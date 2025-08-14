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
  full_name: zod.string().min(1, "請輸入姓名"),
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
      full_name: "",
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
    try {
      // 創建客戶 - 將完整姓名存為 first_name
      const customerResponse = await mutateAsync({
        email: data.email,
        first_name: data.full_name || undefined,
        last_name: undefined,
        company_name: data.company_name || undefined,
        phone: data.phone || undefined,
      })
      
      // 暫時將會員資料存入 localStorage，模擬會員功能
      const memberData = {
        customer_id: customerResponse.customer.id,
        type: data.member_type,
        name: data.full_name,
        phone: data.phone || '',
        member_number: data.member_number || customerResponse.customer.id.slice(-6),
        id_card: data.id_card || '',
        birthday: data.birthday || '',
        gender: "未知", // 暫時設為未知，未來可以加入性別欄位
        email: data.email,
        address: data.address || '',
        notes: data.notes || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      // 將會員資料存入 localStorage
      const memberKey = `member_${customerResponse.customer.id}`
      localStorage.setItem(memberKey, JSON.stringify(memberData))
      
      console.log('已將會員資料存入 localStorage:', memberData)
      
      toast.success(`成功創建會員：${data.full_name}`)
      handleSuccess(`/customers`)
      
    } catch (error: any) {
      console.error('創建會員失敗:', error)
      toast.error(error.message || '創建會員失敗')
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
                name="full_name"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>姓名 *</Form.Label>
                      <Form.Control>
                        <Input autoComplete="off" placeholder="請輸入完整姓名" {...field} />
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
