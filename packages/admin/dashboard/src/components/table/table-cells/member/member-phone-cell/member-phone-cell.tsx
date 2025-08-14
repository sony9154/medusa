import { useTranslation } from "react-i18next"

export const MemberPhoneHeader = () => {
  const { t } = useTranslation()
  return <span>電話</span>
}

export const MemberPhoneCell = ({ phone }: { phone?: string }) => {
  if (!phone) {
    return <span className="text-ui-fg-muted">-</span>
  }

  return (
    <span className="font-mono text-sm">
      {phone}
    </span>
  )
}