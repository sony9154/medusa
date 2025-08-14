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
  MemberTypeCell,
  MemberTypeHeader,
} from "../../../components/table/table-cells/member/member-type-cell"
import {
  MemberNumberCell,
  MemberNumberHeader,
} from "../../../components/table/table-cells/member/member-number-cell"
import {
  MemberPhoneCell,
  MemberPhoneHeader,
} from "../../../components/table/table-cells/member/member-phone-cell"
import {
  FirstSeenCell,
  FirstSeenHeader,
} from "../../../components/table/table-cells/customer/first-seen-cell"
import { CustomerWithMember } from "../../api/customers-with-members"

const columnHelper = createColumnHelper<CustomerWithMember>()

export const useMemberTableColumns = () => {
  return useMemo(
    () => [
      columnHelper.accessor("member.type", {
        header: () => <MemberTypeHeader />,
        cell: ({ getValue }) => <MemberTypeCell type={getValue()} />,
      }),
      columnHelper.accessor("member.member_number", {
        header: () => <MemberNumberHeader />,
        cell: ({ getValue }) => <MemberNumberCell memberNumber={getValue()} />,
      }),
      columnHelper.display({
        id: "name",
        header: () => <NameHeader />,
        cell: ({
          row: {
            original: { member },
          },
        }) => <NameCell firstName={member?.name || ""} lastName="" />,
      }),
      columnHelper.accessor("member.phone", {
        header: () => <MemberPhoneHeader />,
        cell: ({ getValue }) => <MemberPhoneCell phone={getValue()} />,
      }),
      columnHelper.accessor("customer.email", {
        header: () => <EmailHeader />,
        cell: ({ getValue }) => <EmailCell email={getValue()} />,
      }),
      columnHelper.accessor("customer.created_at", {
        header: () => <FirstSeenHeader />,
        cell: ({ getValue }) => <FirstSeenCell createdAt={getValue()} />,
      }),
    ],
    []
  )
}