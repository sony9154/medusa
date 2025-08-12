import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MEMBER_MODULE } from "../../../modules/member"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const memberModuleService = req.scope.resolve(MEMBER_MODULE)
  
  const [members, count] = await memberModuleService.listAndCount({}, {
    skip: req.query.offset ? parseInt(req.query.offset as string) : 0,
    take: req.query.limit ? parseInt(req.query.limit as string) : 20,
  })

  res.json({
    members,
    count,
    offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
  })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const memberModuleService = req.scope.resolve(MEMBER_MODULE)
  
  const member = await memberModuleService.createMembers(req.body)

  res.status(201).json({ member })
}