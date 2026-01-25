# 部署指南

本文档介绍如何将 Markdown 转图片生成器部署到生产环境。由于本项目采用纯前端方案，您可以非常容易地将其部署到任何静态网站托管服务。

## 部署前准备

### 环境要求

- Node.js 18+ (推荐使用 LTS 版本)
- 现代浏览器支持

## 部署方案

### 方案一: 静态托管 (Vercel / Netlify / GitHub Pages) - 推荐

这是最简单且性能最好的部署方案。

#### Vercel 部署步骤:
1. 在 Vercel 导入项目。
2. 设置构建配置:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. 点击部署。

### 方案二: 传统 VPS 部署 (使用 Nginx)

#### 1. 克隆并构建
```bash
git clone https://github.com/slsefe/markdown-to-image-generator.git
cd markdown-to-image-generator/frontend
npm install
npm run build
```

#### 2. 配置 Nginx
将生成的 `dist` 目录配置为 Nginx 的根目录。

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/markdown-to-image-generator/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

## 安全建议

1. **HTTPS** - 强烈建议使用 SSL 证书（如 Let's Encrypt）。
2. **安全头部** - 配置 Nginx 安全头部。

---

如有问题,请查看项目 Issues 或联系维护者。

---

如有问题,请查看项目 Issues 或联系维护者。
