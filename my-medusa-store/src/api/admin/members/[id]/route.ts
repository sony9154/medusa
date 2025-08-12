import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MEMBER_MODULE } from "../../../../modules/member"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const memberModuleService = req.scope.resolve(MEMBER_MODULE)
  
  const member = await memberModuleService.retrieveMember(req.params.id)

  res.json({ member })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const memberModuleService = req.scope.resolve(MEMBER_MODULE)
  
  const member = await memberModuleService.updateMembers(req.params.id, req.body)

  res.json({ member })
}

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const memberModuleService = req.scope.resolve(MEMBER_MODULE)
  
  await memberModuleService.deleteMembers([req.params.id])

  res.status(200).json({
    id: req.params.id,
    object: "member",
    deleted: true,
  })
}