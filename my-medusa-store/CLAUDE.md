# Medusa Store - 會員管理系統

## 專案概述
這是一個基於 Medusa.js 的電商平台，專注於會員管理功能。

## 最新更新

### 會員建立表單優化 (2025-08-12)
1. **移除公司名稱欄位** - 表單中不再包含公司名稱輸入欄位
2. **會員編號改為非必填** - 會員編號現在是可選填寫的欄位
3. **會員類型簡化** - 會員類型選項只保留「一般」和「VIP」兩種，移除「企業」選項
4. **統一術語** - 將所有「客戶」用詞統一改為「會員」
5. **側邊欄更新** - 透過 i18n-override widget 將側邊欄的「客戶」和「客戶群組」改為「會員」和「會員群組」

### 檔案修改
- `src/admin/routes/customers/create/page.tsx` - 會員建立表單
- `src/admin/widgets/i18n-override.tsx` - 文字替換 widget
- `src/api/admin/customers-with-members/route.ts` - API 路由
- `src/api/admin/customers-with-members/[id]/route.ts` - 單一會員 API

## 開發指令
- 啟動開發服務器: `npx medusa develop`
- 管理後台: http://localhost:9000/app

## 會員管理功能
- 建立新會員
- 會員資料管理
- 會員群組功能
- 中文介面支援