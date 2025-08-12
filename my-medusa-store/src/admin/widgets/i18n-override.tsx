import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useEffect } from "react"

const I18nOverrideWidget = () => {
  useEffect(() => {
    // 動態替換文字的函數
    const replaceText = () => {
      // 替換側邊欄中的 Customers 和 Customer Groups
      const sidebarLinks = document.querySelectorAll('[data-testid*="sidebar-link"] span, nav a span, [role="navigation"] span')
      sidebarLinks.forEach(span => {
        const text = span.textContent
        if (text?.includes('Customers') || text?.includes('客户') || text?.includes('客戶')) {
          span.textContent = text.replace(/Customers|客户|客戶/g, '會員')
        }
        if (text?.includes('Customer Groups') || text?.includes('客户群组') || text?.includes('客戶群組')) {
          span.textContent = text.replace(/Customer Groups|客户群组|客戶群組/g, '會員群組')
        }
        if (text?.includes('Customer group') || text?.includes('客户群组') || text?.includes('客戶群組')) {
          span.textContent = text.replace(/Customer group|客户群组|客戶群組/g, '會員群組')
        }
      })
      
      // 替換頁面標題和所有文字內容
      const allTextElements = document.querySelectorAll('h1, h2, h3, p, span, div, button, label, a')
      allTextElements.forEach(element => {
        if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
          let text = element.textContent || ''
          
          // 替換各種customer相關詞彙
          const replacements = [
            { from: /Customer Groups?/g, to: '會員群組' },
            { from: /Customers?/g, to: '會員' },
            { from: /客戶群組/g, to: '會員群組' },
            { from: /客戶/g, to: '會員' },
            { from: /客户群组/g, to: '會員群組' },
            { from: /客户/g, to: '會員' }
          ]
          
          let hasChanges = false
          replacements.forEach(({ from, to }) => {
            if (from.test(text)) {
              text = text.replace(from, to)
              hasChanges = true
            }
          })
          
          if (hasChanges) {
            element.textContent = text
          }
        }
      })
    }
    
    // 立即執行一次
    replaceText()
    
    // 使用 MutationObserver 監聽 DOM 變化
    const observer = new MutationObserver(() => {
      replaceText()
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    })
    
    // 每秒檢查一次，確保替換完成
    const interval = setInterval(replaceText, 1000)
    
    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  }, [])

  return null // 這個 widget 不顯示任何內容，只是執行腳本
}

export const config = defineWidgetConfig({
  zone: "login.after", // 在登入後載入
})

export default I18nOverrideWidget