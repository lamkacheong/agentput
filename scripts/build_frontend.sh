#!/bin/bash

# 前端构建脚本
# 将前端打包并复制到后端 static 目录

set -e

echo "🔨 开始构建前端项目..."

# 进入前端目录
cd "$(dirname "$0")/../frontend"

# 安装依赖（如果需要）
if [ ! -d "node_modules" ]; then
    echo "📦 安装前端依赖..."
    npm install
fi

# 构建前端
echo "🏗️  打包前端项目..."
npm run build

echo "✅ 前端构建完成！"
echo "📂 静态文件已输出到: backend/static"
echo ""
echo "现在可以只启动后端服务："
echo "  uv run python -m backend.main"
echo ""
echo "访问: http://localhost:8000"
