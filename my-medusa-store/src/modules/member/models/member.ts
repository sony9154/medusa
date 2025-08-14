import { model } from "@medusajs/framework/utils"

const Member = model.define("member", {
  id: model.id().primaryKey(),
  customer_id: model.text().nullable(),
  type: model.text(),
  name: model.text(),
  phone: model.text(),
  member_number: model.text().unique(),
  id_card: model.text(),
  birthday: model.dateTime(),
  email: model.text(),
  address: model.text(),
  notes: model.text().nullable(),
  status: model.text().default("報到"),
})

export default Member