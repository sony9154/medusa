import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"

import {
  EmailCell,
  EmailHeader,
} from "../../../components/table/table-cells/common/email-cell"
import {
  NameCell,
  NameHeader,
} from "../../../components/table/table-cells/common/name-cell"
import {
  AccountCell,
  AccountHeader,
} from "../../../components/table/table-cells/customer/account-cell/account-cell"
import {
  FirstSeenCell,
  FirstSeenHeader,
} from "../../../components/table/table-cells/customer/first-seen-cell"
import { HttpTypes } from "@medusajs/types"

const columnHelper = createColumnHelper<HttpTypes.AdminCustomer>()

export const useCustomerTableColumns = () => {
  return useMemo(
    () => [
      columnHelper.display({
        id: "member_type",
        header: () => <span>會員類型</span>,
        cell: () => <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">一般</span>,
      }),
      columnHelper.display({
        id: "member_number", 
        header: () => <span>會員編號</span>,
        cell: ({ row: { original } }) => <span className="font-mono text-sm">{original.id.slice(-6)}</span>,
      }),
      columnHelper.display({
        id: "name",
        header: () => <NameHeader />,
        cell: ({
          row: {
            original: { first_name, last_name },
          },
        }) => <NameCell firstName={first_name} lastName={last_name} />,
      }),
      columnHelper.display({
        id: "phone",
        header: () => <span>電話</span>,
        cell: ({ row: { original } }) => <span className="font-mono text-sm">{original.phone || "-"}</span>,
      }),
      columnHelper.accessor("email", {
        header: () => <EmailHeader />,
        cell: ({ getValue }) => <EmailCell email={getValue()} />,
      }),
      columnHelper.accessor("created_at", {
        header: () => <FirstSeenHeader />,
        cell: ({ getValue }) => <FirstSeenCell createdAt={getValue()} />,
      }),
    ],
    []
  )
}
