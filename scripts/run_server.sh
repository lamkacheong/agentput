#!/bin/bash

# AgentPut 服务器启动脚本

cd "$(dirname "$0")/.."

echo "正在启动 AgentPut 服务器..."
echo "访问 http://localhost:8000/docs 查看 API 文档"

uv run uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
