import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useState } from "react"
import { Button, Container, Heading, Input, Label, Textarea, Select } from "@medusajs/ui"
import { ArrowLeft } from "@medusajs/icons"

type CustomerData = {
  first_name: string
  last_name: string
  email: string
  phone?: string
}

type MemberData = {
  type: string
  name: string
  phone: string
  member_number?: string
  id_card: string
  birthday: string
  email: string
  address: string
  notes?: string
}

const CreateCustomerPage = () => {
  const [customerData, setCustomerData] = useState<CustomerData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: ""
  })

  const [memberData, setMemberData] = useState<MemberData>({
    type: "",
    name: "",
    phone: "",
    member_number: "",
    id_card: "",
    birthday: "",
    email: "",
    address: "",
    notes: ""
  })

  const [isCreating, setIsCreating] = useState(false)

  const handleCustomerChange = (field: keyof CustomerData, value: string) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleMemberChange = (field: keyof MemberData, value: string) => {
    setMemberData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!memberData.name || !memberData.email || !memberData.type) {
      alert('請填寫必填欄位：姓名、電子郵件、會員類型')
      return
    }

    setIsCreating(true)
    
    try {
      // 同步會員資料
      const names = memberData.name.split(' ')
      const syncedCustomerData = {
        ...customerData,
        first_name: names[0] || '',
        last_name: names.slice(1).join(' ') || '',
        email: memberData.email,
        phone: memberData.phone
      }

      const response = await fetch('/admin/customers-with-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          customer_data: syncedCustomerData,
          member_data: memberData
        })
      })

      if (response.ok) {
        const result = await response.json()
        alert(`會員建立成功！會員ID: ${result.customer.id}`)
        
        // 導向到會員詳情頁
        window.location.href = `/admin/customers/${result.customer.id}`
      } else {
        const error = await response.text()
        alert(`建立失敗: ${error}`)
      }
    } catch (error) {
      console.error('建立會員失敗:', error)
      alert('建立失敗，請重試')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Container className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* 標題列 */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="small"
            onClick={() => window.history.back()}
          >
            <ArrowLeft />
          </Button>
          <Heading level="h1">建立會員</Heading>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 會員資料表單 */}
          <div className="bg-white p-6 rounded-lg border">
            <Heading level="h2" className="mb-4">會員資料</Heading>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="member_type">會員類型 *</Label>
                <Select 
                  onValueChange={(value) => handleMemberChange('type', value)}
                  value={memberData.type}
                >
                  <Select.Trigger>
                    <Select.Value placeholder="選擇會員類型" />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="VIP">VIP</Select.Item>
                    <Select.Item value="一般">一般</Select.Item>
                  </Select.Content>
                </Select>
              </div>

              <div>
                <Label htmlFor="member_number">會員編號</Label>
                <Input
                  id="member_number"
                  value={memberData.member_number || ''}
                  onChange={(e) => handleMemberChange('member_number', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="member_name">姓名 *</Label>
                <Input
                  id="member_name"
                  value={memberData.name}
                  onChange={(e) => {
                    handleMemberChange('name', e.target.value)
                    // 同步到會員姓名
                    const names = e.target.value.split(' ')
                    setCustomerData(prev => ({
                      ...prev,
                      first_name: names[0] || '',
                      last_name: names.slice(1).join(' ') || ''
                    }))
                  }}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">電話</Label>
                <Input
                  id="phone"
                  value={memberData.phone}
                  onChange={(e) => {
                    handleMemberChange('phone', e.target.value)
                    setCustomerData(prev => ({ ...prev, phone: e.target.value }))
                  }}
                />
              </div>

              <div>
                <Label htmlFor="email">電子郵件 *</Label>
                <Input
                  id="email"
                  type="email"
                  value={memberData.email}
                  onChange={(e) => {
                    handleMemberChange('email', e.target.value)
                    setCustomerData(prev => ({ ...prev, email: e.target.value }))
                  }}
                  required
                />
              </div>

              <div>
                <Label htmlFor="id_card">身分證字號</Label>
                <Input
                  id="id_card"
                  value={memberData.id_card}
                  onChange={(e) => handleMemberChange('id_card', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="birthday">生日</Label>
                <Input
                  id="birthday"
                  type="date"
                  value={memberData.birthday ? memberData.birthday.split('T')[0] : ''}
                  onChange={(e) => handleMemberChange('birthday', e.target.value + 'T00:00:00.000Z')}
                />
              </div>


              <div className="col-span-3">
                <Label htmlFor="address">地址</Label>
                <Textarea
                  id="address"
                  value={memberData.address}
                  onChange={(e) => handleMemberChange('address', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="col-span-3">
                <Label htmlFor="notes">備註</Label>
                <Textarea
                  id="notes"
                  value={memberData.notes || ''}
                  onChange={(e) => handleMemberChange('notes', e.target.value)}
                  rows={2}
                  placeholder="會員備註..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="secondary"
              onClick={() => window.history.back()}
            >
              取消
            </Button>
            <Button 
              type="submit"
              disabled={isCreating}
            >
              {isCreating ? '建立中...' : '建立會員'}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  path: "/customers/create",
})

export default CreateCustomerPage