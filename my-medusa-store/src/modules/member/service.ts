import { MedusaService } from "@medusajs/framework/utils"
import Member from "./models/member"

class MemberModuleService extends MedusaService({
  Member,
}) {}

export default MemberModuleService