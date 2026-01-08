# 📝 Markdown 转图片生成器

一个在线 Web 应用,可以将 Markdown 文本转换为精美的高清图片,非常适合社交媒体内容分享。

![Demo](demo.jpg)

## ✨ 功能特性

### 核心功能 (MVP)

- ✅ **Markdown 文本编辑** - 支持实时编辑和预览
- ✅ **支持的 Markdown 语法**:
  - 4 级标题 (H1-H4)
  - 无序列表
  - 有序列表
  - 粗体文本
  - 斜体文本
  - 链接
- ✅ **3 个预设主题**:
  - 简约明亮 - 适合日常分享
  - 深色优雅 - 适合夜间阅读
  - 温暖舒适 - 适合温馨内容
- ✅ **灵活配置**:
  - 画布尺寸自定义
  - 社交媒体预设尺寸 (微信、微博、Instagram、小红书)
  - 字体大小调整
  - 颜色自定义 (背景、文字、强调色)
  - 间距控制 (内边距、行间距、段落间距)
- ✅ **元信息** - 支持添加作者和时间信息
- ✅ **高清图片生成** - 使用 2x DPI 确保清晰度
- ✅ **一键下载** - PNG 格式导出

## 🎯 适用场景

- 📱 社交媒体内容创作 (微信朋友圈、微博、Instagram)
- 📝 笔记分享和知识传播
- 💡 个人想法和观点表达
- 🎨 文字排版和设计

## 🛠 技术栈

### 前端
- **React** - 用户界面框架
- **Vite** - 快速的开发构建工具
- **React-Markdown** - Markdown 渲染

### 后端
- **Node.js** - 运行时环境
- **Express** - Web 服务器框架
- **Puppeteer** - 无头浏览器,用于高质量截图
- **Marked** - Markdown 解析库

## 📦 安装和运行

### 前置要求

- Node.js 18+ 
- npm 或 yarn

### 安装步骤

1. **克隆仓库**

```bash
git clone https://github.com/slsefe/markdown-to-image-generator.git
cd markdown-to-image-generator
```

2. **安装后端依赖**

```bash
cd backend
npm install
```

3. **安装前端依赖**

```bash
cd ../frontend
npm install
```

### 启动应用

#### 开发模式

1. **启动后端服务器**

```bash
cd backend
npm start
```

后端服务器将在 `http://localhost:3001` 运行

2. **启动前端开发服务器** (新终端窗口)

```bash
cd frontend
npm run dev
```

前端应用将在 `http://localhost:5173` 运行

3. **访问应用**

在浏览器中打开 `http://localhost:5173`

## 📖 使用指南

### 基本使用流程

1. **输入内容** - 在左侧编辑器中输入或粘贴 Markdown 内容
2. **实时预览** - 右侧会实时显示渲染效果
3. **选择主题** - 从 3 个预设主题中选择一个
4. **调整配置** - 根据需要调整画布尺寸、字体、颜色等
5. **生成图片** - 点击"生成图片"按钮
6. **下载图片** - 生成完成后点击"下载图片"按钮

### 画布尺寸推荐

| 平台 | 推荐尺寸 | 比例 |
|------|---------|------|
| 微信朋友圈 | 1080 x 1260 | 6:7 |
| 微博竖图 | 1080 x 1920 | 9:16 |
| Instagram 方图 | 1080 x 1080 | 1:1 |
| Instagram 竖图 | 1080 x 1350 | 4:5 |
| 小红书 | 1080 x 1440 | 3:4 |

### 样式配置说明

- **字体大小**: 12-32px,默认 16px
- **内边距**: 20-80px,控制内容与边缘的距离
- **行间距**: 1.2-2.5,控制行与行之间的距离
- **段落间距**: 10-40px,控制段落之间的间隔

## 🎨 主题自定义

应用提供 3 个预设主题,也可以自定义颜色:

### 简约明亮
- 背景: 白色 (#FFFFFF)
- 文字: 深灰 (#333333)
- 强调: 蓝色 (#007AFF)

### 深色优雅
- 背景: 深黑 (#1a1a1a)
- 文字: 浅灰 (#E5E5E5)
- 强调: 亮蓝 (#4A9EFF)

### 温暖舒适
- 背景: 米黄 (#FFF8F0)
- 文字: 棕褐 (#5D4E37)
- 强调: 橙棕 (#D2691E)

## 🔧 配置说明

### 后端配置

后端服务器端口可以通过环境变量配置:

```bash
PORT=3001 npm start
```

### Puppeteer 配置

Puppeteer 会在首次运行时自动下载 Chromium。如果遇到下载问题,可以:

1. 配置代理
2. 使用本地 Chrome
3. 使用 `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` 跳过下载

## 📁 项目结构

```
markdown-to-image-generator/
├── frontend/                 # 前端应用
│   ├── src/
│   │   ├── App.jsx          # 主应用组件
│   │   ├── App.css          # 样式文件
│   │   ├── main.jsx         # 入口文件
│   │   └── index.css        # 全局样式
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # 后端服务
│   ├── server.js            # Express 服务器和 API
│   └── package.json
│
└── README.md                # 项目文档
```

## 🚀 部署

### 前端部署

前端可以部署到任何静态网站托管服务:

1. **构建生产版本**

```bash
cd frontend
npm run build
```

2. **部署 dist 目录** 到服务器或托管平台 (Vercel, Netlify, GitHub Pages 等)

### 后端部署

后端需要 Node.js 环境支持:

1. **部署到服务器** (VPS, AWS, Azure 等)
2. **使用 PM2 管理进程**

```bash
npm install -g pm2
pm2 start server.js
```

3. **配置 Nginx 反向代理** (可选)

### Docker 部署 (推荐)

```dockerfile
# 后端 Dockerfile 示例
FROM node:18
RUN apt-get update && apt-get install -y \
    chromium \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## ⚠️ 注意事项

1. **内容限制**: 建议内容控制在 10000 字符以内
2. **生成时间**: 图片生成通常需要 2-5 秒,取决于内容复杂度
3. **资源消耗**: Puppeteer 比较消耗资源,生产环境建议配置合理的服务器规格
4. **字体支持**: 确保系统安装了中文字体,否则可能显示方块
5. **跨域问题**: 开发时前后端分离,生产环境建议使用同域名或配置 CORS

## 🐛 常见问题

### Q1: Puppeteer 安装失败?

A: 可能是网络问题导致 Chromium 下载失败。解决方法:
- 配置 npm 代理
- 使用淘宝镜像: `npm config set puppeteer_download_host=https://npm.taobao.org/mirrors`

### Q2: 生成的图片中文显示为方块?

A: 系统缺少中文字体。解决方法:
- macOS: 自带中文字体,无需处理
- Linux: 安装中文字体包 `sudo apt-get install fonts-wqy-microhei`
- Docker: 在 Dockerfile 中安装字体

### Q3: 生成图片失败?

A: 检查:
- 后端服务是否正常运行
- 浏览器控制台是否有错误信息
- 网络连接是否正常
- Puppeteer 是否成功安装

## 🗺 开发路线图

### 已完成 ✅
- [x] MVP 核心功能
- [x] 3 个预设主题
- [x] 基础配置调整
- [x] 高清图片生成
- [x] 元信息支持

### 计划中 🎯
- [ ] 更多预设主题 (10+)
- [ ] 渐变背景支持
- [ ] 水印功能
- [ ] 历史记录 (本地存储)
- [ ] 配置模板保存
- [ ] 批量生成
- [ ] 代码高亮支持
- [ ] 表格支持
- [ ] 用户系统
- [ ] 付费功能

## 📄 许可证

MIT License

## 👥 贡献

欢迎提交 Issue 和 Pull Request!

## 📧 联系方式

如有问题或建议,请通过以下方式联系:

- 提交 Issue: [GitHub Issues](https://github.com/slsefe/markdown-to-image-generator/issues)
- 邮箱: baiyslsefe@gmail.com

---

**Made with ❤️ by Your Name**
