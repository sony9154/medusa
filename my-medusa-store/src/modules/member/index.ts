import MemberModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const MEMBER_MODULE = "member"

export default Module(MEMBER_MODULE, {
  service: MemberModuleService,
})