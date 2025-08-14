import { useTranslation } from "react-i18next"

export const MemberNumberHeader = () => {
  const { t } = useTranslation()
  return <span>會員編號</span>
}

export const MemberNumberCell = ({ memberNumber }: { memberNumber?: string }) => {
  if (!memberNumber) {
    return <span className="text-ui-fg-muted">-</span>
  }

  return (
    <span className="font-mono text-sm">
      {memberNumber}
    </span>
  )
}