import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"

import {
  EmailCell,
  EmailHeader,
} from "../../../components/table/table-cells/common/email-cell"
import {
  AccountCell,
  AccountHeader,
} from "../../../components/table/table-cells/customer/account-cell/account-cell"
import {
  FirstSeenCell,
  FirstSeenHeader,
} from "../../../components/table/table-cells/customer/first-seen-cell"
import { CustomerWithMember } from "../../api/customers-with-members"

const columnHelper = createColumnHelper<CustomerWithMember>()

export const useCustomerTableColumns = () => {
  return useMemo(
    () => [
      columnHelper.display({
        id: "member_type",
        header: () => <span>會員類型</span>,
        cell: ({ row: { original } }) => (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
            {original.member?.type || "一般"}
          </span>
        ),
      }),
      columnHelper.display({
        id: "member_number", 
        header: () => <span>會員編號</span>,
        cell: ({ row: { original } }) => (
          <span className="font-mono text-sm">{original.member?.member_number || original.customer.id.slice(-6)}</span>
        ),
      }),
      columnHelper.display({
        id: "name",
        header: () => <span>姓名</span>,
        cell: ({ row: { original } }) => (
          <span className="font-medium text-ui-fg-base">
            {original.member?.name || "未知"}
          </span>
        ),
      }),
      columnHelper.display({
        id: "phone",
        header: () => <span>電話</span>,
        cell: ({ row: { original } }) => (
          <span className="font-mono text-sm">{original.member?.phone || original.customer.phone || "-"}</span>
        ),
      }),
      columnHelper.display({
        id: "birthday",
        header: () => <span>出生年月日</span>,
        cell: ({ row: { original } }) => (
          <span className="text-sm">{original.member?.birthday || "-"}</span>
        ),
      }),
      columnHelper.display({
        id: "gender",
        header: () => <span>性別</span>,
        cell: ({ row: { original } }) => (
          <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700">
            {original.member?.gender || "未知"}
          </span>
        ),
      }),
      columnHelper.display({
        id: "email",
        header: () => <EmailHeader />,
        cell: ({ row: { original } }) => (
          <EmailCell email={original.member?.email || original.customer.email} />
        ),
      }),
      columnHelper.display({
        id: "created_at",
        header: () => <FirstSeenHeader />,
        cell: ({ row: { original } }) => (
          <FirstSeenCell createdAt={original.customer.created_at} />
        ),
      }),
    ],
    []
  )
}
