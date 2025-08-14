import { Badge } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

export const MemberTypeHeader = () => {
  const { t } = useTranslation()
  return <span>會員類型</span>
}

export const MemberTypeCell = ({ type }: { type?: string }) => {
  if (!type) {
    return <span className="text-ui-fg-muted">-</span>
  }

  const variant = type === "VIP" ? "orange" : "blue"

  return (
    <Badge size="2xsmall" variant={variant}>
      {type}
    </Badge>
  )
}