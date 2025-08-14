import { Select } from "@medusajs/ui"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { customersWithMembersQueryKeys } from "../../../../../hooks/api/customers-with-members"

type MemberStatusSelectProps = {
  memberId: string
  currentStatus: string
}

const statusOptions = [
  { value: "報到", label: "報到", color: "bg-blue-100 text-blue-800" },
  { value: "量測", label: "量測", color: "bg-green-100 text-green-800" },
  { value: "門診", label: "門診", color: "bg-purple-100 text-purple-800" },
  { value: "衛教", label: "衛教", color: "bg-yellow-100 text-yellow-800" },
  { value: "結帳", label: "結帳", color: "bg-orange-100 text-orange-800" },
  { value: "預約", label: "預約", color: "bg-pink-100 text-pink-800" },
  { value: "出貨", label: "出貨", color: "bg-indigo-100 text-indigo-800" },
  { value: "異常", label: "異常", color: "bg-red-100 text-red-800" },
  { value: "課程", label: "課程", color: "bg-teal-100 text-teal-800" },
]

export const MemberStatusSelect = ({ memberId, currentStatus }: MemberStatusSelectProps) => {
  const queryClient = useQueryClient()
  
  const updateStatus = useMutation({
    mutationFn: async (newStatus: string) => {
      const statusKey = `member_status_${memberId}`
      localStorage.setItem(statusKey, newStatus)
      return { success: true, status: newStatus }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customersWithMembersQueryKeys.lists() })
    },
  })

  const handleStatusChange = (newStatus: string) => {
    updateStatus.mutate(newStatus)
  }

  const currentOption = statusOptions.find(option => option.value === currentStatus) || statusOptions[0]

  return (
    <Select 
      value={currentStatus} 
      onValueChange={handleStatusChange}
      disabled={updateStatus.isPending}
    >
      <Select.Trigger className="w-28">
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentOption.color}`}>
          {currentOption.label}
        </div>
      </Select.Trigger>
      <Select.Content>
        {statusOptions.map((option) => (
          <Select.Item key={option.value} value={option.value}>
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${option.color}`}>
              {option.label}
            </div>
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  )
}

export const MemberStatusHeader = () => {
  return <span>狀態</span>
}