import { PencilSquare } from "@medusajs/icons"
import { Button, Container, Heading } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { HttpTypes } from "@medusajs/types"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { _DataTable } from "../../../../../components/table/data-table"
import { useCustomersWithMembers, CustomerWithMember } from "../../../../../hooks/api/customers-with-members"
import { useCustomerTableColumns } from "../../../../../hooks/table/columns/use-customer-table-columns"
import { useCustomerTableFilters } from "../../../../../hooks/table/filters/use-customer-table-filters"
import { useCustomerTableQuery } from "../../../../../hooks/table/query/use-customer-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"

const PAGE_SIZE = 20

export const CustomerListTable = () => {
  const { t } = useTranslation()

  const { searchParams, raw } = useCustomerTableQuery({ pageSize: PAGE_SIZE })
  const { customers, count, isLoading, isError, error } = useCustomersWithMembers(
    {
      ...searchParams,
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const filters = useCustomerTableFilters()
  const columns = useColumns()

  const { table } = useDataTable({
    data: customers ?? [],
    columns,
    count,
    enablePagination: true,
    getRowId: (row) => row.customer.id,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{t("customers.domain")}</Heading>
        <Link to="/customers/create">
          <Button size="small" variant="secondary">
            {t("actions.create")}
          </Button>
        </Link>
      </div>
      <_DataTable
        table={table}
        columns={columns}
        pageSize={PAGE_SIZE}
        count={count}
        filters={filters}
        orderBy={[
          { key: "member_type", label: "會員類型" },
          { key: "member_number", label: "會員編號" },
          { key: "name", label: "姓名" },
          { key: "phone", label: "電話" },
          { key: "birthday", label: "出生年月日" },
          { key: "gender", label: "性別" },
          { key: "email", label: t("fields.email") },
          { key: "created_at", label: t("fields.createdAt") },
        ]}
        isLoading={isLoading}
        navigateTo={(row) => row.original.customer.id}
        search
        queryObject={raw}
        noRecords={{
          message: t("customers.list.noRecordsMessage"),
        }}
      />
    </Container>
  )
}

const CustomerActions = ({
  customerWithMember,
}: {
  customerWithMember: CustomerWithMember
}) => {
  const { t } = useTranslation()

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `/customers/${customerWithMember.customer.id}/edit`,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<CustomerWithMember>()

const useColumns = () => {
  const columns = useCustomerTableColumns()

  return useMemo(
    () => [
      ...columns,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => <CustomerActions customerWithMember={row.original} />,
      }),
    ],
    [columns]
  )
}
