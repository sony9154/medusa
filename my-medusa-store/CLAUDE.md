# Medusa Store - 會員管理系統

## 專案概述
這是一個基於 Medusa.js 的電商平台，專注於會員管理功能。

## 最新更新

### 會員欄位結構優化 (2025-08-14)
1. **移除狀態欄位** - 取消會員狀態管理功能，簡化資料結構
2. **新增出生年月日欄位** - 添加會員生日資訊顯示
3. **新增性別欄位** - 添加會員性別資訊，以灰色圓角標籤顯示
4. **姓名欄位合併** - 將姓和名合併為單一姓名欄位，簡化輸入和顯示
5. **創建表單優化** - 統一使用完整姓名輸入，提升用戶體驗

### 會員創建功能修復 (2025-08-14)
1. **修復創建失敗問題** - 解決 API 調用錯誤導致的創建失敗
2. **本地資料存儲** - 使用 localStorage 暫存會員資料，確保功能可用性
3. **即時資料顯示** - 新創建的會員立即顯示在會員列表中
4. **完整欄位支援** - 支援會員類型、編號、電話、生日、地址、備註等欄位

### 技術架構改進 (2025-08-14)
1. **混合資料來源** - 結合模擬資料和 localStorage 真實資料
2. **錯誤處理優化** - 改進 API 錯誤處理和用戶提示
3. **資料結構統一** - 標準化 CustomerWithMember 資料格式
4. **表單驗證強化** - 加強必填欄位驗證和錯誤提示

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
- ✅ 建立新會員 (姓名、信箱、會員類型、電話、生日等完整欄位)
- ✅ 會員列表檢視 (類型、編號、姓名、電話、生日、性別、信箱、創建時間)
- ✅ 會員資料管理 (本地存儲，即時顯示)
- ✅ 會員群組功能
- ✅ 雙語介面支援 (繁體/簡體中文)
- ✅ 會員類型管理 (一般/VIP)
- ✅ 會員編號自動生成 (基於客戶ID)
- ✅ 表單驗證 (必填欄位檢查和錯誤提示)
- ✅ 混合資料源 (模擬資料 + localStorage 真實資料)