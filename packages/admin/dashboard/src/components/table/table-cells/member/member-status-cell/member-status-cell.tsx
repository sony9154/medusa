import { Badge } from "@medusajs/ui"

type MemberStatusCellProps = {
  status: string
}

const statusColorMap = {
  "報到": "bg-blue-100 text-blue-800",
  "量測": "bg-green-100 text-green-800", 
  "門診": "bg-purple-100 text-purple-800",
  "衛教": "bg-yellow-100 text-yellow-800",
  "結帳": "bg-orange-100 text-orange-800",
  "預約": "bg-pink-100 text-pink-800",
  "出貨": "bg-indigo-100 text-indigo-800",
  "異常": "bg-red-100 text-red-800",
  "課程": "bg-teal-100 text-teal-800"
}

export const MemberStatusCell = ({ status }: MemberStatusCellProps) => {
  const colorClass = statusColorMap[status as keyof typeof statusColorMap] || "bg-gray-100 text-gray-800"
  
  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {status}
    </div>
  )
}

export const MemberStatusHeader = () => {
  return <span>狀態</span>
}