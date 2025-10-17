#!/bin/bash

# AgentPut 一键部署脚本
# 用于生产环境部署

set -e

echo "🚀 开始部署 AgentPut..."
echo ""

# 检查依赖
command -v uv >/dev/null 2>&1 || { echo "❌ 错误: 需要安装 uv"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ 错误: 需要安装 npm"; exit 1; }

# 进入项目根目录
cd "$(dirname "$0")/.."

echo "📦 安装后端依赖..."
uv pip install -r requirements.txt

echo "📦 安装前端依赖..."
cd frontend
npm install
cd ..

echo "🔨 构建前端..."
./scripts/build_frontend.sh

echo ""
echo "✅ 部署完成！"
echo ""
echo "下一步："
echo "  1. 配置 .env 文件（如果还没有）"
echo "  2. 初始化数据库: uv run python scripts/init_db.py"
echo "  3. 启动服务: uv run python -m backend.main"
echo ""
echo "服务将运行在: http://localhost:8000"
