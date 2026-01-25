#!/bin/bash

# Markdown 转图片生成器 - 启动脚本

echo "🚀 启动 Markdown 转图片生成器..."
echo ""

# 检查是否安装了依赖
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 前端依赖未安装，正在安装..."
    cd frontend && npm install
    cd ..
fi

echo ""
echo "✅ 依赖检查完成"
echo ""

# 启动前端开发服务器
echo "🎨 启动前端开发服务器 (http://localhost:5173)..."
cd frontend && npm run dev

echo ""
echo "✨ 应用启动成功!"
echo ""
echo "📱 访问地址: http://localhost:5173"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""
