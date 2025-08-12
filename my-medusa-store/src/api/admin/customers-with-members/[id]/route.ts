import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MEMBER_MODULE } from "../../../../modules/member"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const customerModuleService = req.scope.resolve("customer")
  const memberModuleService = req.scope.resolve(MEMBER_MODULE)
  
  const customer = await customerModuleService.retrieveCustomer(req.params.id)
  
  // 尋找對應的會員資料
  const [members] = await memberModuleService.listAndCount({
    customer_id: req.params.id
  })
  
  const member = members[0] || null

  res.json({
    customer,
    member
  })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const customerModuleService = req.scope.resolve("customer")
  const memberModuleService = req.scope.resolve(MEMBER_MODULE)
  
  const { customer_data, member_data } = req.body

  // 更新會員資料
  let customer
  if (customer_data) {
    customer = await customerModuleService.updateCustomers(req.params.id, customer_data)
  } else {
    customer = await customerModuleService.retrieveCustomer(req.params.id)
  }

  // 更新或創建會員資料
  let member
  const [existingMembers] = await memberModuleService.listAndCount({
    customer_id: req.params.id
  })

  if (existingMembers.length > 0) {
    // 更新現有會員
    member = await memberModuleService.updateMembers(existingMembers[0].id, member_data)
  } else {
    // 創建新會員
    member = await memberModuleService.createMembers({
      ...member_data,
      customer_id: req.params.id,
    })
  }

  res.json({
    customer,
    member
  })
}