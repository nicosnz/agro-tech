import { apiClient } from '../../../shared/api/clienteHttp'
import type { Bovino } from '../model/types'

export const bovinoApi = {
  getAll: async () => {
    const res = await apiClient.get<Bovino[]>('/api/v1/bovinos')
    return res.data
  },
//   getById: async (id: string) => {
//     const res = await apiClient.get<Bovino>(`/bovinos/${id}`)
//     return res.data
//   },
}