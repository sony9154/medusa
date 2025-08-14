# Medusa Store - 會員管理系統

## 專案概述
這是一個基於 Medusa.js 的電商平台，專注於會員管理功能。

## 最新更新

### 會員列表介面優化 (2025-08-14)
1. **會員列表欄位重新設計** - 將客戶列表轉換為會員管理介面
   - ✅ 會員類型 - 顯示為藍色徽章「一般」
   - ✅ 會員編號 - 使用客戶ID的最後6個字符
   - ✅ 姓名 - 客戶的完整姓名
   - ✅ 電話 - 客戶電話號碼
   - ✅ 電子郵件 - 移到後面位置
   - ✅ 創建時間 - 保留但移到最後

2. **技術實現**
   - 修改 `useCustomerTableColumns` hook 直接顯示會員專用欄位
   - 使用內聯實現避免複雜的依賴問題
   - 保持表格的排序和篩選功能
   - 添加視覺化的會員類型徽章

3. **介面訪問**
   - 繁體中文介面: http://localhost:5173/customers
   - 簡體中文介面: http://localhost:9000/app/customers

### 會員建立表單優化 (2025-08-12)
1. **移除公司名稱欄位** - 表單中不再包含公司名稱輸入欄位
2. **會員編號改為非必填** - 會員編號現在是可選填寫的欄位
3. **會員類型簡化** - 會員類型選項只保留「一般」和「VIP」兩種，移除「企業」選項
4. **統一術語** - 將所有「客戶」用詞統一改為「會員」
5. **側邊欄更新** - 透過 i18n-override widget 將側邊欄的「客戶」和「客戶群組」改為「會員」和「會員群組」

### 主要檔案修改
- `packages/admin/dashboard/src/hooks/table/columns/use-customer-table-columns.tsx` - 會員列表欄位定義
- `packages/admin/dashboard/src/routes/customers/customer-list/components/customer-list-table/customer-list-table.tsx` - 會員列表表格組件
- `src/admin/routes/customers/create/page.tsx` - 會員建立表單
- `src/admin/widgets/i18n-override.tsx` - 文字替換 widget
- `src/api/admin/customers-with-members/route.ts` - API 路由
- `src/api/admin/customers-with-members/[id]/route.ts` - 單一會員 API

## 開發指令
- 後端開發服務器: `npx medusa develop`
- 前端開發服務器 (繁體中文): `cd packages/admin/dashboard && yarn dev`
- 管理後台 (簡體中文): http://localhost:9000/app
- 管理後台 (繁體中文): http://localhost:5173

## 會員管理功能
- ✅ 建立新會員 (包含所有必要欄位)
- ✅ 會員列表檢視 (專用欄位顯示)
- ✅ 會員資料管理
- ✅ 會員群組功能
- ✅ 雙語介面支援 (繁體/簡體中文)
- ✅ 會員類型管理 (一般/VIP)
- ✅ 會員編號自動生成