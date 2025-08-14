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
  gender: string
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
      try {
        // 模擬數據
        const mockCustomers = [
          {
            id: "cust_01H0123456789",
            email: "test@example.com", 
            full_name: "張小華",
            phone: "+886-912-345-678",
            birthday: "1985-06-15",
            gender: "男",
            created_at: "2024-01-01T00:00:00.000Z",
            updated_at: "2024-01-01T00:00:00.000Z",
          },
          {
            id: "cust_01H0987654321",
            email: "demo@example.com",
            full_name: "李美玲",
            phone: "+886-987-654-321",
            birthday: "1990-03-22",
            gender: "女",
            created_at: "2024-01-01T00:00:00.000Z", 
            updated_at: "2024-01-01T00:00:00.000Z",
          },
          {
            id: "cust_01H0555666777",
            email: "sample@example.com",
            full_name: "王小明",
            phone: "+886-955-123-456",
            birthday: "1992-11-08",
            gender: "男",
            created_at: "2024-01-15T00:00:00.000Z", 
            updated_at: "2024-01-15T00:00:00.000Z",
          },
          {
            id: "cust_01H0888999000",
            email: "chen@example.com",
            full_name: "陳雅婷",
            phone: "+886-933-888-999",
            birthday: "1988-07-12",
            gender: "女",
            created_at: "2024-01-20T00:00:00.000Z", 
            updated_at: "2024-01-20T00:00:00.000Z",
          }
        ]
        
        // 從 localStorage 讀取真實創建的會員資料
        const realMembers: any[] = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key?.startsWith('member_')) {
            try {
              const memberData = JSON.parse(localStorage.getItem(key) || '{}')
              realMembers.push({
                id: memberData.customer_id,
                email: memberData.email,
                full_name: memberData.name,
                phone: memberData.phone,
                birthday: memberData.birthday,
                gender: memberData.gender || "未知",
                created_at: memberData.created_at,
                updated_at: memberData.updated_at,
                member_data: memberData
              })
            } catch (error) {
              console.error('解析會員資料失敗:', key, error)
            }
          }
        }
        
        console.log('從 localStorage 讀取的會員:', realMembers.length)
        
        // 合併模擬資料和真實資料
        const allCustomers = [...mockCustomers, ...realMembers]
        
        // 將客戶格式轉換為會員格式
        const customersWithMembers = allCustomers.map((customer: any) => {
          return {
            customer,
            member: customer.member_data || {
              id: customer.id,
              customer_id: customer.id,
              type: "一般",
              member_number: customer.id?.slice(-6) || "000000",
              name: customer.full_name || customer.email || "未知",
              phone: customer.phone || "",
              email: customer.email || "",
              id_card: "",
              birthday: customer.birthday || "",
              gender: customer.gender || "未知",
              address: "",
              notes: "",
              created_at: customer.created_at,
              updated_at: customer.updated_at,
            }
          }
        })
        
        return {
          customers: customersWithMembers,
          count: customersWithMembers.length,
          offset: 0,
          limit: 20,
        }
      } catch (error) {
        console.error('Error in useCustomersWithMembers:', error)
        throw error
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

