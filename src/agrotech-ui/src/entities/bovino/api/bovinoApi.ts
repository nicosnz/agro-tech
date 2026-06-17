import { apiClient } from '../../../shared/api/clienteHttp'
import type { Bovino } from '../model/types'

export const bovinoApi = {
  getAll: async (pagina = 1): Promise<Bovino[]> => {
    const res = await apiClient.get('/api/v1/bovinos/', { params: { pagina } })
    return Array.isArray(res.data) ? res.data : []
  },
//   getById: async (id: string) => {
//     const res = await apiClient.get<Bovino>(`/bovinos/${id}`)
//     return res.data
//   },
}