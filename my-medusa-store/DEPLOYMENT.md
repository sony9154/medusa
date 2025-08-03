# Medusa E-commerce Platform - 一鍵部署

這是一個完整配置的 Medusa 電商平台，支援 Docker 一鍵啟動。

## 🚀 快速開始

### 前置需求
- Docker Desktop (已安裝並運行)

### 一鍵啟動
```bash
docker-compose up -d
```

就這麼簡單！系統會自動：
- 啟動 PostgreSQL (啟用 SSL)
- 啟動 Redis 
- 啟動 Medusa API 服務器
- 運行數據庫遷移
- 啟動開發服務器

## 🌐 訪問服務

啟動後訪問：
- **Admin 管理面板:** http://localhost:9000/app
- **API 服務器:** http://localhost:9000
- **健康檢查:** http://localhost:9000/health

## 👤 管理員登入

**默認管理員帳號:**
- Email: `admin@example.com`
- Password: `supersecret`

## 📋 常用命令

```bash
# 啟動所有服務
docker-compose up -d

# 停止所有服務  
docker-compose down

# 查看日誌
docker-compose logs medusa

# 查看所有容器狀態
docker-compose ps

# 創建新的管理員用戶
docker-compose run --rm medusa npx medusa user -e user@example.com -p password

# 重新構建並啟動（如果有代碼更改）
docker-compose up -d --build
```

## 📁 移植到其他電腦

### 方法1: 複製整個項目文件夾
1. 複製整個 `my-medusa-store` 文件夾到新電腦
2. 確保新電腦已安裝 Docker Desktop
3. 在項目文件夾中運行: `docker-compose up -d`

### 方法2: 使用 Git
```bash
# 如果你將項目推送到 Git 倉庫
git clone <your-repo-url>
cd my-medusa-store
docker-compose up -d
```

## 🔧 技術細節

### 服務架構
- **PostgreSQL 13** (端口 5432) - 主數據庫，啟用 SSL
- **Redis 7-Alpine** (端口 6379) - 緩存和會話存儲
- **Medusa Server** (端口 9000) - API 服務器和 Admin 面板

### 數據持久化
- PostgreSQL 數據存儲在 Docker volume: `my-medusa-store_postgres_data`
- 即使容器重啟，數據也會保留

### SSL 配置
- PostgreSQL 啟用 SSL 連接
- 使用自簽名證書 (適用於開發環境)

## 🐛 常見問題

### Q: 容器啟動失敗
```bash
# 檢查 Docker 是否運行
docker ps

# 查看錯誤日誌
docker-compose logs
```

### Q: 端口被占用
如果端口 9000, 5432, 或 6379 被占用，修改 `docker-compose.yml` 中的端口映射。

### Q: 數據庫連接失敗
確保 PostgreSQL 容器完全啟動：
```bash
docker-compose exec postgres pg_isready -U postgres
```

### Q: 重置所有數據
```bash
# 停止服務並刪除數據
docker-compose down -v

# 重新啟動（會創建新的空數據庫）
docker-compose up -d
```

## 📝 文件說明

### 核心文件
- `docker-compose.yml` - Docker 服務配置
- `Dockerfile` - Medusa 容器構建配置
- `medusa-config.ts` - Medusa 應用配置
- `package.json` - Node.js 依賴和腳本

### SSL 證書
- `postgres-ssl/server.crt` - PostgreSQL SSL 證書
- `postgres-ssl/server.key` - PostgreSQL SSL 私鑰

### 其他
- `.dockerignore` - Docker 構建時忽略的文件
- `start.sh` - 容器啟動腳本

## 🔒 生產環境注意事項

在生產環境部署前，請：
1. 更改默認管理員密碼
2. 使用有效的 SSL 證書
3. 配置適當的環境變量
4. 設置防火牆規則
5. 配置備份策略

---

💡 **提示:** 第一次啟動可能需要幾分鐘來下載鏡像和初始化數據庫。後續啟動會更快。