# 🛒 Medusa 電商平台 Docker 部署完整指南

###### tags: `Medusa` `Docker` `E-commerce` `PostgreSQL` `部署`

---

## 📖 目錄
[TOC]

---

## 🎯 專案概述

本專案實現了基於 Docker 的 Medusa 電商平台一鍵部署方案，解決了官方文檔中的 SSL 連接問題，並提供完整的移植解決方案。

### 🏗️ 技術棧
- **Backend**: Medusa.js v2.8.8
- **Database**: PostgreSQL 13 (啟用 SSL)
- **Cache**: Redis 7-Alpine
- **容器化**: Docker + Docker Compose
- **Runtime**: Node.js 20 Alpine

### 🌟 特色功能
- ✅ 一鍵 Docker 部署
- ✅ SSL 安全連接
- ✅ 數據持久化
- ✅ 跨平台移植
- ✅ 自動數據庫遷移

---

## 🚀 快速開始

### 前置需求
- Docker Desktop
- 8GB+ RAM (推薦)
- 5GB+ 磁碟空間

### 一鍵啟動
```bash
docker-compose up -d
```

### 訪問服務
| 服務 | URL | 用途 |
|------|-----|------|
| Admin Panel | http://localhost:9000/app | 管理後台 |
| API Server | http://localhost:9000 | REST API |
| Health Check | http://localhost:9000/health | 健康檢查 |

### 默認登入資訊
```
Email: admin@example.com
Password: supersecret
```

---

## 🏗️ 架構設計

### 服務架構圖
```mermaid
graph TB
    subgraph "Docker Compose 服務"
        A[Medusa Server<br/>:9000] --> B[PostgreSQL<br/>:5432]
        A --> C[Redis<br/>:6379]
        B --> D[SSL 證書<br/>postgres-ssl/]
    end
    
    subgraph "外部訪問"
        E[Admin Panel<br/>localhost:9000/app]
        F[API Endpoints<br/>localhost:9000]
    end
    
    A --> E
    A --> F
```

### 數據流程
1. **啟動順序**: PostgreSQL → Redis → Medusa
2. **初始化**: 自動運行數據庫遷移
3. **SSL 連接**: PostgreSQL 啟用自簽名證書
4. **持久化**: Docker Volume 保存數據

---

## 📁 專案結構

```
my-medusa-store/
├── 🐳 docker-compose.yml          # Docker 服務配置
├── 🐳 Dockerfile                  # Medusa 容器構建
├── ⚙️ medusa-config.ts            # Medusa 應用配置
├── 📦 package.json                # NPM 依賴和腳本
├── 🔐 postgres-ssl/               # PostgreSQL SSL 證書
│   ├── server.crt                 # SSL 證書
│   └── server.key                 # SSL 私鑰
├── 💻 src/                        # Medusa 應用源代碼
│   ├── admin/                     # Admin UI 配置
│   ├── api/                       # API 路由
│   ├── jobs/                      # 背景任務
│   ├── modules/                   # 自定義模組
│   ├── scripts/                   # 腳本文件
│   ├── subscribers/               # 事件訂閱者
│   └── workflows/                 # 工作流程
├── 📚 DEPLOYMENT.md               # 部署說明
├── 📋 DEPLOYMENT-CHECKLIST.md     # 部署檢查清單
├── 🔧 create-deployment-package.sh # 打包腳本
└── 📄 .env.example                # 環境變量範例
```

---

## ⚙️ 核心配置詳解

### Docker Compose 配置

#### PostgreSQL 服務
```yaml
postgres:
  image: postgres:13
  restart: always
  environment:
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
    POSTGRES_DB: medusa-docker
  ports:
    - "5432:5432"
  volumes:
    - postgres_data:/var/lib/postgresql/data
    - ./postgres-ssl/server.crt:/var/lib/postgresql/server.crt:ro
    - ./postgres-ssl/server.key:/var/lib/postgresql/server.key:ro
  command: >
    postgres
    -c ssl=on
    -c ssl_cert_file=/var/lib/postgresql/server.crt
    -c ssl_key_file=/var/lib/postgresql/server.key
```

#### Medusa 服務
```yaml
medusa:
  build: .
  restart: always
  depends_on:
    - postgres
    - redis
  environment:
    DATABASE_URL: postgres://postgres:postgres@postgres:5432/medusa-docker?sslmode=prefer
    REDIS_URL: redis://redis:6379
    NODE_ENV: development
    NODE_TLS_REJECT_UNAUTHORIZED: "0"
  ports:
    - "9000:9000"
  volumes:
    - .:/server
    - /server/node_modules
```

### Dockerfile 配置
```dockerfile
FROM node:20-alpine

WORKDIR /server

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 9000

CMD ["sh", "-c", "sleep 10 && npx medusa db:migrate && npx medusa develop"]
```

---

## 🔐 SSL 配置解決方案

### 問題描述
官方 Docker 文檔中的配置會遇到 PostgreSQL SSL 連接錯誤：
```
Error: The server does not support SSL connections
```

### 解決方案

#### 1. 生成自簽名證書
```bash
# 創建 SSL 證書目錄
mkdir postgres-ssl

# 生成自簽名證書
openssl req -x509 -newkey rsa:2048 \
  -keyout postgres-ssl/server.key \
  -out postgres-ssl/server.crt \
  -days 365 -nodes \
  -subj "/CN=localhost"

# 設置正確權限
chmod 600 postgres-ssl/server.key
chmod 644 postgres-ssl/server.crt
```

#### 2. PostgreSQL 啟用 SSL
在 `docker-compose.yml` 中配置：
- 掛載證書文件到容器
- 設置 PostgreSQL 啟動參數啟用 SSL

#### 3. 客戶端 SSL 配置
在 Medusa 環境變量中設置：
```bash
DATABASE_URL=postgres://postgres:postgres@postgres:5432/medusa-docker?sslmode=prefer
NODE_TLS_REJECT_UNAUTHORIZED=0
```

### 驗證 SSL 連接
```bash
# 檢查 PostgreSQL SSL 狀態
docker exec my-medusa-store-postgres-1 psql -U postgres -d medusa-docker -c "SHOW ssl;"
```

---

## 📋 常用命令速查

### Docker 操作
```bash
# 啟動所有服務（後台運行）
docker-compose up -d

# 停止所有服務
docker-compose down

# 重新構建並啟動
docker-compose up -d --build

# 查看容器狀態
docker-compose ps

# 查看服務日誌
docker-compose logs medusa
docker-compose logs postgres
docker-compose logs redis

# 進入容器 shell
docker-compose exec medusa sh
docker-compose exec postgres bash
```

### Medusa 管理
```bash
# 創建管理員用戶
docker-compose run --rm medusa npx medusa user -e admin@example.com -p password

# 運行數據庫遷移
docker-compose run --rm medusa npx medusa db:migrate

# 執行種子數據
docker-compose run --rm medusa npm run seed

# 檢查 Medusa 版本
docker-compose run --rm medusa npx medusa --version
```

### 數據庫操作
```bash
# 連接到 PostgreSQL
docker-compose exec postgres psql -U postgres -d medusa-docker

# 檢查數據庫表
docker-compose exec postgres psql -U postgres -d medusa-docker -c "\dt"

# 檢查數據庫連接
docker-compose exec postgres pg_isready -U postgres
```

---

## 🔧 故障排除指南

### 常見問題與解決方案

#### 1. 容器啟動失敗
**症狀**: `docker-compose up` 失敗
```bash
# 檢查 Docker 狀態
docker ps
docker info

# 查看詳細錯誤日誌
docker-compose logs

# 清理並重新啟動
docker-compose down -v
docker-compose up -d --build
```

#### 2. 端口被占用
**症狀**: `Port already in use`
```bash
# 檢查端口使用情況
lsof -i :9000
lsof -i :5432
lsof -i :6379

# 修改 docker-compose.yml 中的端口映射
ports:
  - "9001:9000"  # 改為其他端口
```

#### 3. PostgreSQL 連接失敗
**症狀**: 數據庫連接錯誤
```bash
# 檢查 PostgreSQL 是否就緒
docker-compose exec postgres pg_isready -U postgres

# 檢查 SSL 配置
docker-compose exec postgres psql -U postgres -c "SHOW ssl;"

# 重新生成 SSL 證書
rm -rf postgres-ssl
mkdir postgres-ssl
openssl req -x509 -newkey rsa:2048 -keyout postgres-ssl/server.key -out postgres-ssl/server.crt -days 365 -nodes -subj "/CN=localhost"
```

#### 4. Medusa 服務無法訪問
**症狀**: `curl http://localhost:9000` 失敗
```bash
# 檢查 Medusa 容器狀態
docker-compose ps medusa

# 查看 Medusa 啟動日誌
docker-compose logs medusa | tail -50

# 檢查是否出現 "Server is ready" 消息
docker-compose logs medusa | grep "Server is ready"
```

#### 5. 數據庫遷移失敗
**症狀**: 表不存在錯誤
```bash
# 手動運行遷移
docker-compose run --rm medusa npx medusa db:migrate

# 檢查數據庫表
docker-compose exec postgres psql -U postgres -d medusa-docker -c "\dt"

# 重置數據庫（警告：會刪除所有數據）
docker-compose down -v
docker-compose up -d
```

---

## 📦 移植到其他電腦

### 方法一：直接複製（推薦）

#### 準備工作
1. 確保目標機器已安裝 Docker Desktop
2. 複製整個 `my-medusa-store` 文件夾

#### 部署步驟
```bash
# 在目標機器上
cd my-medusa-store
docker-compose up -d
```

### 方法二：創建部署包

#### 創建部署包
```bash
# 在原機器上執行
./create-deployment-package.sh
```

這會創建 `medusa-deployment-YYYYMMDD-HHMMSS.tar.gz` 文件

#### 部署到目標機器
```bash
# 傳輸並解壓
scp medusa-deployment-*.tar.gz user@target-machine:/path/to/destination/
ssh user@target-machine
cd /path/to/destination/
tar -xzf medusa-deployment-*.tar.gz
cd medusa-deployment-*
docker-compose up -d
```

### 方法三：Git 版本控制

#### 推送到 Git
```bash
# 添加到版本控制（注意排除敏感文件）
git init
git add .
git commit -m "Initial Medusa Docker setup"
git remote add origin <your-repo-url>
git push -u origin main
```

#### 從 Git 部署
```bash
# 在目標機器上
git clone <your-repo-url>
cd my-medusa-store
docker-compose up -d
```

### 部署驗證清單
- [ ] Docker Desktop 已安裝並運行
- [ ] 所有文件已正確複製
- [ ] SSL 證書權限正確 (600 for .key, 644 for .crt)
- [ ] 端口 9000, 5432, 6379 未被占用
- [ ] `docker-compose ps` 顯示所有服務為 "Up"
- [ ] 可以訪問 http://localhost:9000/app
- [ ] 可以使用默認憑據登入

---

## 🔒 生產環境考量

### 安全性配置

#### 1. 更改默認憑據
```bash
# 創建新的管理員用戶
docker-compose run --rm medusa npx medusa user -e admin@yourcompany.com -p strong-password

# 更新環境變量
JWT_SECRET=your-super-secure-jwt-secret
COOKIE_SECRET=your-super-secure-cookie-secret
```

#### 2. 使用有效 SSL 證書
```bash
# 使用 Let's Encrypt 或購買的證書替換自簽名證書
cp /path/to/valid/cert.pem postgres-ssl/server.crt
cp /path/to/valid/key.pem postgres-ssl/server.key
```

#### 3. 網絡安全
```yaml
# 在 docker-compose.yml 中移除不必要的端口暴露
# 只保留必要的 9000 端口，移除 PostgreSQL 和 Redis 的外部端口
```

### 效能優化

#### 1. 資源限制
```yaml
# 在 docker-compose.yml 中添加資源限制
services:
  medusa:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
```

#### 2. 數據庫調優
```bash
# PostgreSQL 配置優化
-c shared_buffers=256MB
-c effective_cache_size=1GB
-c maintenance_work_mem=64MB
```

### 監控與備份

#### 1. 健康檢查
```yaml
# 添加健康檢查
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:9000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

#### 2. 數據備份
```bash
# 創建數據庫備份
docker-compose exec postgres pg_dump -U postgres medusa-docker > backup.sql

# 恢復數據庫
docker-compose exec -T postgres psql -U postgres medusa-docker < backup.sql
```

---

## 📊 效能指標

### 系統要求

| 組件 | 最低要求 | 推薦配置 |
|------|----------|----------|
| CPU | 2 核心 | 4 核心 |
| RAM | 4GB | 8GB+ |
| 磁碟 | 10GB | 50GB+ SSD |
| 網路 | 10Mbps | 100Mbps+ |

### 啟動時間
- **首次啟動**: 3-5 分鐘（下載鏡像 + 初始化）
- **後續啟動**: 30-60 秒
- **數據庫遷移**: 10-30 秒

### 容器資源使用
```bash
# 查看資源使用情況
docker stats
```

典型資源使用量：
- **Medusa**: ~200-500MB RAM
- **PostgreSQL**: ~100-200MB RAM  
- **Redis**: ~20-50MB RAM

---

## 🔄 版本升級指南

### Medusa 版本升級

#### 1. 備份數據
```bash
docker-compose exec postgres pg_dump -U postgres medusa-docker > backup-$(date +%Y%m%d).sql
```

#### 2. 更新 package.json
```json
{
  "dependencies": {
    "@medusajs/medusa": "^2.9.0",
    "@medusajs/admin-sdk": "^2.9.0"
  }
}
```

#### 3. 重新構建
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Docker 鏡像升級

#### PostgreSQL 升級
```yaml
# 在 docker-compose.yml 中更新版本
postgres:
  image: postgres:14  # 從 13 升級到 14
```

#### Node.js 升級
```dockerfile
# 在 Dockerfile 中更新版本
FROM node:21-alpine  # 從 20 升級到 21
```

---

## 📚 參考資源

### 官方文檔
- [Medusa 官方文檔](https://docs.medusajs.com/)
- [Medusa Docker 安裝指南](https://docs.medusajs.com/learn/installation/docker)
- [Docker Compose 文檔](https://docs.docker.com/compose/)

### 社群資源
- [Medusa GitHub](https://github.com/medusajs/medusa)
- [Medusa Discord 社群](https://discord.gg/medusajs)
- [Docker Hub - Medusa](https://hub.docker.com/r/medusajs/medusa)

### 相關技術
- [PostgreSQL 官方文檔](https://www.postgresql.org/docs/)
- [Redis 官方文檔](https://redis.io/documentation)
- [Node.js 官方文檔](https://nodejs.org/docs/)

---

## 🏷️ 版本歷史

| 版本 | 日期 | 更新內容 |
|------|------|----------|
| v1.0 | 2025-08-03 | 初始版本，基本 Docker 配置 |
| v1.1 | 2025-08-03 | 解決 SSL 連接問題 |
| v1.2 | 2025-08-03 | 添加一鍵部署方案 |
| v1.3 | 2025-08-03 | 完善文檔和故障排除 |

---

## 🤝 貢獻指南

### 問題回報
如果遇到問題，請提供以下信息：
- 操作系統版本
- Docker 版本
- 錯誤日誌
- 重現步驟

### 改進建議
歡迎提出以下方面的改進建議：
- 效能優化
- 安全性增強
- 文檔完善
- 新功能添加

---

## 📝 總結

本指南提供了完整的 Medusa 電商平台 Docker 部署解決方案，解決了官方文檔中的 SSL 問題，並實現了真正的一鍵部署。主要特點：

✅ **簡單易用**: 一條命令啟動完整電商平台  
✅ **穩定可靠**: 解決了 SSL 連接問題  
✅ **易於移植**: 支援跨平台部署  
✅ **文檔完善**: 詳細的配置和故障排除指南  

通過此方案，開發者可以快速搭建 Medusa 電商平台，專注於業務邏輯開發而非環境配置。

---

:::info
💡 **提示**: 建議收藏此文檔，作為 Medusa Docker 部署的參考手冊。
:::

:::warning
⚠️ **注意**: 生產環境使用前請務必更改默認密碼和配置適當的安全設置。
:::

---

*最後更新: 2025-08-03*  
*作者: Claude Code Assistant*