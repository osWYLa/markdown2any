# 部署指南

本文档介绍如何将 Markdown 转图片生成器部署到生产环境。

## 部署前准备

### 环境要求

- Node.js 18+ (推荐使用 LTS 版本)
- 至少 2GB RAM (Puppeteer 需要)
- 支持中文字体的操作系统

### 必要依赖

对于 Linux 服务器,需要安装以下依赖:

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y \
    chromium-browser \
    fonts-liberation \
    fonts-wqy-microhei \
    fonts-wqy-zenhei

# CentOS/RHEL
sudo yum install -y \
    chromium \
    liberation-fonts \
    wqy-microhei-fonts
```

## 部署方案

### 方案一: 传统 VPS 部署

#### 1. 克隆代码到服务器

```bash
git clone https://github.com/yourusername/markdown-to-image-generator.git
cd markdown-to-image-generator
```

#### 2. 安装依赖

```bash
# 后端
cd backend
npm install --production
cd ..

# 前端
cd frontend
npm install
npm run build
cd ..
```

#### 3. 配置环境变量

创建 `backend/.env` 文件:

```env
PORT=3001
NODE_ENV=production
```

#### 4. 使用 PM2 管理进程

```bash
# 安装 PM2
npm install -g pm2

# 启动后端服务
cd backend
pm2 start server.js --name markdown-backend

# 保存 PM2 配置
pm2 save
pm2 startup
```

#### 5. 配置 Nginx

创建 `/etc/nginx/sites-available/markdown-generator`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/markdown-to-image-generator/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

启用配置:

```bash
sudo ln -s /etc/nginx/sites-available/markdown-generator /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 6. 配置 SSL (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 方案二: Docker 部署

#### 1. 创建 Dockerfile (后端)

在 `backend/Dockerfile`:

```dockerfile
FROM node:18-slim

# 安装 Chromium 和字体
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    fonts-wqy-microhei \
    fonts-wqy-zenhei \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# 设置 Puppeteer 使用系统 Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
```

#### 2. 创建 Dockerfile (前端)

在 `frontend/Dockerfile`:

```dockerfile
FROM node:18-slim as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### 3. 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
    restart: unless-stopped
    volumes:
      - /dev/shm:/dev/shm  # 共享内存,提升 Puppeteer 性能

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

#### 4. 启动服务

```bash
docker-compose up -d
```

### 方案三: Vercel + Railway 部署

#### 前端部署到 Vercel

1. 在 Vercel 导入项目
2. 设置构建配置:
   - Framework Preset: Vite
   - Root Directory: frontend
   - Build Command: `npm run build`
   - Output Directory: dist

3. 配置环境变量:
   - `VITE_API_URL`: 后端 API 地址

#### 后端部署到 Railway

1. 在 Railway 创建新项目
2. 连接 GitHub 仓库
3. 设置根目录为 `backend`
4. Railway 会自动检测并部署

### 方案四: Heroku 部署

#### 后端部署

在 `backend` 目录创建 `Procfile`:

```
web: node server.js
```

部署命令:

```bash
cd backend
heroku create your-app-name
heroku buildpacks:add heroku/nodejs
heroku buildpacks:add jontewks/puppeteer
git push heroku main
```

## 性能优化

### 1. 启用缓存

在后端添加 Redis 缓存:

```javascript
const redis = require('redis');
const client = redis.createClient();

// 缓存生成的图片
const cacheKey = `img:${hash(markdownContent + JSON.stringify(config))}`;
const cached = await client.get(cacheKey);
if (cached) {
  return res.json({ success: true, image: cached });
}
```

### 2. Puppeteer 优化

```javascript
// 复用 browser 实例
let browserInstance;

async function getBrowser() {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });
  }
  return browserInstance;
}
```

### 3. 限流保护

使用 express-rate-limit:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100 // 限制 100 次请求
});

app.use('/api/generate', limiter);
```

## 监控和维护

### 日志管理

使用 Winston 或 Pino 记录日志:

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### 健康检查

确保 `/api/health` 端点正常工作,用于负载均衡器健康检查。

### 定期重启

使用 cron 任务定期重启 PM2 进程:

```bash
# 每天凌晨 3 点重启
0 3 * * * pm2 restart markdown-backend
```

## 故障排查

### 常见问题

1. **Chromium 下载失败**
   - 手动安装系统 Chromium
   - 配置 `PUPPETEER_EXECUTABLE_PATH`

2. **内存不足**
   - 增加服务器内存
   - 配置 swap 分区
   - 限制并发请求数

3. **中文字体问题**
   - 确保安装了中文字体包
   - 检查字体路径配置

4. **生成速度慢**
   - 复用 browser 实例
   - 启用缓存
   - 使用 CDN 加速

## 安全建议

1. **输入验证** - 限制输入长度和内容
2. **速率限制** - 防止 API 滥用
3. **CORS 配置** - 正确配置跨域策略
4. **HTTPS** - 使用 SSL 证书
5. **环境变量** - 敏感信息不要硬编码

## 备份策略

定期备份:
- 用户数据 (如果有)
- 配置文件
- 日志文件

## 扩展建议

1. **负载均衡** - 使用 Nginx 或云服务商的负载均衡
2. **CDN** - 加速静态资源访问
3. **数据库** - 如需用户系统,添加 PostgreSQL/MongoDB
4. **消息队列** - 处理大量请求,使用 Redis/RabbitMQ

---

如有问题,请查看项目 Issues 或联系维护者。
