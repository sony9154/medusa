#!/bin/bash

# 創建 Medusa 部署包腳本

echo "📦 創建 Medusa 部署包..."

# 設定包名
PACKAGE_NAME="medusa-deployment-$(date +%Y%m%d-%H%M%S)"
TEMP_DIR="/tmp/$PACKAGE_NAME"

# 創建臨時目錄
mkdir -p "$TEMP_DIR"

echo "📁 複製必要文件..."

# 複製必要文件和文件夾
cp docker-compose.yml "$TEMP_DIR/"
cp Dockerfile "$TEMP_DIR/"
cp medusa-config.ts "$TEMP_DIR/"
cp package.json "$TEMP_DIR/"
cp tsconfig.json "$TEMP_DIR/"
cp start.sh "$TEMP_DIR/"
cp .dockerignore "$TEMP_DIR/"
cp .env.example "$TEMP_DIR/"
cp DEPLOYMENT.md "$TEMP_DIR/"
cp DEPLOYMENT-CHECKLIST.md "$TEMP_DIR/"

# 複製 SSL 證書文件夾
cp -r postgres-ssl "$TEMP_DIR/"

# 複製 src 文件夾
cp -r src "$TEMP_DIR/"

# 複製測試文件（可選）
if [ -d "integration-tests" ]; then
    cp -r integration-tests "$TEMP_DIR/"
fi

echo "🗜️  創建壓縮包..."

# 創建壓縮包
cd /tmp
tar -czf "${PACKAGE_NAME}.tar.gz" "$PACKAGE_NAME"

# 移動到當前目錄
mv "${PACKAGE_NAME}.tar.gz" "$(pwd)/"

# 清理臨時文件
rm -rf "$TEMP_DIR"

echo "✅ 部署包創建完成: ${PACKAGE_NAME}.tar.gz"
echo ""
echo "📋 使用方法:"
echo "1. 將 ${PACKAGE_NAME}.tar.gz 複製到目標機器"
echo "2. 解壓: tar -xzf ${PACKAGE_NAME}.tar.gz"
echo "3. 進入目錄: cd $PACKAGE_NAME"
echo "4. 啟動: docker-compose up -d"
echo ""
echo "🌐 服務將在以下地址可用:"
echo "   Admin: http://localhost:9000/app"
echo "   API:   http://localhost:9000"