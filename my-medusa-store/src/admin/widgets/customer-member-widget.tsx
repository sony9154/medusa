import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminCustomer } from "@medusajs/framework/types"
import { useState, useEffect } from "react"
import { Button, Container, Heading, Input, Label, Textarea, Select } from "@medusajs/ui"

type CustomerMemberData = {
  id?: string
  customer_id?: string
  type: string
  name: string
  phone: string
  member_number: string
  id_card: string
  birthday: string
  email: string
  address: string
  notes?: string
}

const CustomerMemberWidget = ({ data }: DetailWidgetProps<AdminCustomer>) => {
  const [memberData, setMemberData] = useState<CustomerMemberData>({
    type: "",
    name: "",
    phone: "",
    member_number: "",
    id_card: "",
    birthday: "",
    email: data.email || "",
    address: "",
    notes: ""
  })
  
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // 載入會員資料
  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await fetch(`/admin/customers-with-members/${data.id}`, {
          credentials: 'include'
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.member) {
            setMemberData(result.member)
          }
        }
      } catch (error) {
        console.error('載入會員資料失敗:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMemberData()
  }, [data.id])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/admin/customers-with-members/${data.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          member_data: memberData
        })
      })

      if (response.ok) {
        const result = await response.json()
        setMemberData(result.member)
        setIsEditing(false)
        alert('會員資料已更新')
      } else {
        alert('更新失敗，請重試')
      }
    } catch (error) {
      console.error('儲存會員資料失敗:', error)
      alert('儲存失敗，請重試')
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof CustomerMemberData, value: string) => {
    setMemberData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (isLoading) {
    return (
      <Container className="p-6">
        <div>載入會員資料中...</div>
      </Container>
    )
  }

  return (
    <Container className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Heading level="h2">會員資料</Heading>
        {!isEditing ? (
          <Button 
            variant="secondary" 
            onClick={() => setIsEditing(true)}
          >
            編輯會員資料
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              onClick={() => {
                setIsEditing(false)
                // 重置資料
              }}
              disabled={isSaving}
            >
              取消
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? '儲存中...' : '儲存'}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="type">會員類型</Label>
            {isEditing ? (
              <Select 
                onValueChange={(value) => handleInputChange('type', value)}
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
            ) : (
              <div className="p-2 bg-gray-50 rounded">{memberData.type || '未設定'}</div>
            )}
          </div>

          <div>
            <Label htmlFor="name">姓名</Label>
            {isEditing ? (
              <Input
                id="name"
                value={memberData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded">{memberData.name || '未設定'}</div>
            )}
          </div>

          <div>
            <Label htmlFor="phone">電話</Label>
            {isEditing ? (
              <Input
                id="phone"
                value={memberData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded">{memberData.phone || '未設定'}</div>
            )}
          </div>

          <div>
            <Label htmlFor="member_number">會員編號</Label>
            {isEditing ? (
              <Input
                id="member_number"
                value={memberData.member_number}
                onChange={(e) => handleInputChange('member_number', e.target.value)}
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded">{memberData.member_number || '未設定'}</div>
            )}
          </div>

          <div>
            <Label htmlFor="email">電子郵件</Label>
            {isEditing ? (
              <Input
                id="email"
                type="email"
                value={memberData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded">{memberData.email || '未設定'}</div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="id_card">身分證字號</Label>
            {isEditing ? (
              <Input
                id="id_card"
                value={memberData.id_card}
                onChange={(e) => handleInputChange('id_card', e.target.value)}
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded">{memberData.id_card || '未設定'}</div>
            )}
          </div>

          <div>
            <Label htmlFor="birthday">生日</Label>
            {isEditing ? (
              <Input
                id="birthday"
                type="date"
                value={memberData.birthday ? memberData.birthday.split('T')[0] : ''}
                onChange={(e) => handleInputChange('birthday', e.target.value + 'T00:00:00.000Z')}
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded">
                {memberData.birthday ? new Date(memberData.birthday).toLocaleDateString('zh-TW') : '未設定'}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="address">地址</Label>
            {isEditing ? (
              <Textarea
                id="address"
                value={memberData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded min-h-[80px]">{memberData.address || '未設定'}</div>
            )}
          </div>

          <div>
            <Label htmlFor="notes">備註</Label>
            {isEditing ? (
              <Textarea
                id="notes"
                value={memberData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded min-h-[80px]">{memberData.notes || '無'}</div>
            )}
          </div>
        </div>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "customer.details.after",
})

export default CustomerMemberWidget