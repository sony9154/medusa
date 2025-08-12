import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MEMBER_MODULE } from "../../../modules/member"

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const customerModuleService = req.scope.resolve("customer")
  const memberModuleService = req.scope.resolve(MEMBER_MODULE)
  
  const { customer_data, member_data } = req.body

  // 創建會員
  const customer = await customerModuleService.createCustomers(customer_data)

  // 創建會員，並關聯到會員
  const member = await memberModuleService.createMembers({
    ...member_data,
    customer_id: customer.id,
  })

  res.status(201).json({
    customer,
    member,
  })
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const customerModuleService = req.scope.resolve("customer")
  const memberModuleService = req.scope.resolve(MEMBER_MODULE)
  
  // 獲取所有會員
  const [customers, customerCount] = await customerModuleService.listAndCount({}, {
    skip: req.query.offset ? parseInt(req.query.offset as string) : 0,
    take: req.query.limit ? parseInt(req.query.limit as string) : 20,
  })

  // 獲取所有會員
  const [members] = await memberModuleService.listAndCount({})

  // 建立會員與會員的對應關係
  const customersWithMembers = customers.map(customer => {
    const member = members.find(m => m.customer_id === customer.id)
    return {
      ...customer,
      member
    }
  })

  res.json({
    customers: customersWithMembers,
    count: customerCount,
    offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
  })
}