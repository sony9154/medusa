import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes, PaginatedResponse } from "@medusajs/types"
import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"

const CUSTOMERS_WITH_MEMBERS_QUERY_KEY = "customers-with-members" as const
export const customersWithMembersQueryKeys = queryKeysFactory(CUSTOMERS_WITH_MEMBERS_QUERY_KEY)

export interface MemberData {
  id: string
  customer_id: string
  type: string
  name: string
  phone: string
  member_number: string
  id_card: string
  birthday: string
  email: string
  address: string
  notes: string
  created_at: string
  updated_at: string
}

export interface CustomerWithMember {
  customer: HttpTypes.AdminCustomer
  member: MemberData | null
}

export const useCustomersWithMembers = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      PaginatedResponse<{ customers: CustomerWithMember[] }>,
      FetchError,
      PaginatedResponse<{ customers: CustomerWithMember[] }>,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => {
      // 暫時使用標準客戶 API 來避免錯誤
      const response = await fetch("/admin/customers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch customers")
      }
      
      const result = await response.json()
      
      // 將標準客戶格式轉換為會員格式
      const customersWithMembers = result.customers.map((customer: any) => ({
        customer,
        member: {
          type: "一般",
          member_number: customer.id.slice(-6),
          name: `${customer.first_name || ""} ${customer.last_name || ""}`.trim(),
          phone: customer.phone || "",
          email: customer.email,
          id_card: "",
          birthday: "",
          address: "",
          notes: "",
        }
      }))
      
      return {
        customers: customersWithMembers,
        count: result.count,
        offset: result.offset,
        limit: result.limit,
      }
    },
    queryKey: customersWithMembersQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCustomerWithMember = (
  id: string,
  options?: Omit<
    UseQueryOptions<
      CustomerWithMember,
      FetchError,
      CustomerWithMember,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: customersWithMembersQueryKeys.detail(id),
    queryFn: async () => {
      const response = await fetch(`/admin/customers-with-members/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch customer with member")
      }
      
      return response.json()
    },
    ...options,
  })

  return { ...data, ...rest }
}

export const useUpdateCustomerWithMember = (
  id: string,
  options?: UseMutationOptions<
    CustomerWithMember,
    FetchError,
    { customer_data?: any; member_data?: any }
  >
) => {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await fetch(`/admin/customers-with-members/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      })
      
      if (!response.ok) {
        throw new Error("Failed to update customer with member")
      }
      
      return response.json()
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: customersWithMembersQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: customersWithMembersQueryKeys.detail(id) })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}