import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Input, Text, toast, Select, Textarea } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Form } from "../../../../../components/common/form"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useCreateCustomer } from "../../../../../hooks/api/customers"

const CreateCustomerSchema = zod.object({
  email: zod.string().email(),
  first_name: zod.string().optional(),
  last_name: zod.string().optional(),
  company_name: zod.string().optional(),
  phone: zod.string().optional(),
  // 會員欄位
  member_type: zod.string().min(1, "請選擇會員類型"),
  member_number: zod.string().optional(),
  id_card: zod.string().optional(),
  birthday: zod.string().optional(),
  address: zod.string().optional(),
  notes: zod.string().optional(),
})

export const CreateCustomerForm = () => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const { mutateAsync, isPending } = useCreateCustomer()

  const form = useForm<zod.infer<typeof CreateCustomerSchema>>({
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      company_name: "",
      // 會員欄位預設值
      member_type: "",
      member_number: "",
      id_card: "",
      birthday: "",
      address: "",
      notes: "",
    },
    resolver: zodResolver(CreateCustomerSchema),
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    // 同步姓名到會員資料
    const fullName = `${data.first_name || ''} ${data.last_name || ''}`.trim()
    
    try {
      // 先創建客戶
      const customerResponse = await mutateAsync({
        email: data.email,
        first_name: data.first_name || undefined,
        last_name: data.last_name || undefined,
        company_name: data.company_name || undefined,
        phone: data.phone || undefined,
      })
      
      // 然後創建會員資料
      const memberData = {
        type: data.member_type,
        name: fullName,
        phone: data.phone || '',
        member_number: data.member_number || '',
        id_card: data.id_card || '',
        birthday: data.birthday ? data.birthday + 'T00:00:00.000Z' : '',
        email: data.email,
        address: data.address || '',
        notes: data.notes || '',
      }
      
      console.log('正在創建會員資料:', memberData)
      console.log('客戶ID:', customerResponse.customer.id)
      console.log('API 路徑:', `/admin/customers-with-members/${customerResponse.customer.id}`)
      
      // 發送會員資料到自定義 API
      const memberResponse = await fetch(`/admin/customers-with-members/${customerResponse.customer.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ member_data: memberData })
      })
      
      console.log('會員 API 響應狀態:', memberResponse.status)
      
      if (memberResponse.ok) {
        toast.success(
          t("customers.create.successToast", {
            email: customerResponse.customer.email,
          })
        )
        handleSuccess(`/customers/${customerResponse.customer.id}`)
      } else {
        const errorText = await memberResponse.text()
        console.error('會員資料創建失敗:', errorText)
        toast.error(`會員資料創建失敗: ${errorText}`)
      }
    } catch (error: any) {
      console.error('創建客戶/會員失敗:', error)
      toast.error(error.message || '創建失敗')
    }
  })

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <RouteFocusModal.Header />
        <RouteFocusModal.Body className="flex flex-1 flex-col items-center overflow-y-auto py-16">
          <div className="flex w-full max-w-[720px] flex-col gap-y-8">
            <div>
              <Heading>{t("customers.create.header")}</Heading>
              <Text size="small" className="text-ui-fg-subtle">
                {t("customers.create.hint")}
              </Text>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Form.Field
                control={form.control}
                name="member_type"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>會員類型 *</Form.Label>
                      <Form.Control>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <Select.Trigger>
                            <Select.Value placeholder="選擇會員類型" />
                          </Select.Trigger>
                          <Select.Content>
                            <Select.Item value="一般">一般</Select.Item>
                            <Select.Item value="VIP">VIP</Select.Item>
                          </Select.Content>
                        </Select>
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="member_number"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label optional>會員編號</Form.Label>
                      <Form.Control>
                        <Input autoComplete="off" {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="first_name"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label optional>名</Form.Label>
                      <Form.Control>
                        <Input autoComplete="off" {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="last_name"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label optional>姓</Form.Label>
                      <Form.Control>
                        <Input autoComplete="off" {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="email"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>電子郵件 *</Form.Label>
                      <Form.Control>
                        <Input autoComplete="off" type="email" {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="phone"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label optional>電話</Form.Label>
                      <Form.Control>
                        <Input autoComplete="off" {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="id_card"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label optional>身分證字號</Form.Label>
                      <Form.Control>
                        <Input autoComplete="off" {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="birthday"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label optional>生日</Form.Label>
                      <Form.Control>
                        <Input autoComplete="off" type="date" {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <div className="md:col-span-2">
                <Form.Field
                  control={form.control}
                  name="address"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label optional>地址</Form.Label>
                        <Form.Control>
                          <Textarea {...field} rows={2} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              </div>
              <div className="md:col-span-2">
                <Form.Field
                  control={form.control}
                  name="notes"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label optional>備註</Form.Label>
                        <Form.Control>
                          <Textarea {...field} rows={2} placeholder="會員備註..." />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              </div>
            </div>
          </div>
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button
              size="small"
              variant="primary"
              type="submit"
              isLoading={isPending}
            >
              {t("actions.create")}
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}
