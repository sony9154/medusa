# 📦 Medusa 一鍵部署 - 移植檢查清單

## 📁 必需文件清單

複製以下文件和文件夾到新電腦：

### ✅ 核心配置文件
- [ ] `docker-compose.yml` - Docker 服務配置
- [ ] `Dockerfile` - Medusa 容器構建配置  
- [ ] `medusa-config.ts` - Medusa 應用配置
- [ ] `package.json` - 依賴和腳本配置
- [ ] `tsconfig.json` - TypeScript 配置

### ✅ SSL 證書（重要！）
- [ ] `postgres-ssl/server.crt` - PostgreSQL SSL 證書
- [ ] `postgres-ssl/server.key` - PostgreSQL SSL 私鑰

### ✅ 應用代碼
- [ ] `src/` 整個文件夾 - Medusa 應用源代碼
- [ ] `integration-tests/` - 集成測試（可選）

### ✅ 配置文件
- [ ] `.dockerignore` - Docker 構建忽略文件
- [ ] `.env.example` - 環境變量範例
- [ ] `start.sh` - 容器啟動腳本

### ✅ 文檔
- [ ] `DEPLOYMENT.md` - 部署說明
- [ ] `README.md` - 項目說明

## 🚀 部署步驟

### 1. 前置需求檢查
```bash
# 檢查 Docker 是否安裝
docker --version

# 檢查 Docker Compose 是否可用
docker compose version

# 檢查 Docker 是否運行
docker ps
```

### 2. 複製項目
```bash
# 方法1: 直接複製文件夾
cp -r my-medusa-store /path/to/new/location

# 方法2: 使用 Git (如果項目在版本控制中)
git clone <repository-url>
```

### 3. 一鍵啟動
```bash
cd my-medusa-store
docker-compose up -d
```

### 4. 驗證部署
```bash
# 檢查容器狀態
docker-compose ps

# 檢查日誌
docker-compose logs medusa

# 測試 API
curl http://localhost:9000/health

# 訪問 Admin (瀏覽器)
open http://localhost:9000/app
```

## 🔍 故障排除

### 容器啟動失敗
```bash
# 查看詳細日誌
docker-compose logs

# 重新構建
docker-compose up -d --build --force-recreate
```

### 端口衝突
修改 `docker-compose.yml` 中的端口映射：
```yaml
ports:
  - "9001:9000"  # 改為不同端口
```

### SSL 證書問題
重新生成證書：
```bash
rm -rf postgres-ssl
mkdir postgres-ssl
openssl req -x509 -newkey rsa:2048 -keyout postgres-ssl/server.key -out postgres-ssl/server.crt -days 365 -nodes -subj "/CN=localhost"
chmod 600 postgres-ssl/server.key
chmod 644 postgres-ssl/server.crt
```

## 📂 最小部署包

如果只需要最小文件集，確保包含：

```
my-medusa-store/
├── docker-compose.yml      ⭐ 必需
├── Dockerfile             ⭐ 必需  
├── medusa-config.ts       ⭐ 必需
├── package.json           ⭐ 必需
├── postgres-ssl/          ⭐ 必需
│   ├── server.crt
│   └── server.key
├── src/                   ⭐ 必需
└── .dockerignore          ⭐ 建議
```

## 🔐 安全提醒

移植到新環境時：
- [ ] 更改默認管理員密碼
- [ ] 檢查 `.env` 文件中的敏感信息
- [ ] 確保防火牆設置正確
- [ ] 在生產環境中使用適當的 SSL 證書

---

💡 **提示:** 第一次在新機器上啟動需要下載 Docker 鏡像，可能需要幾分鐘時間。