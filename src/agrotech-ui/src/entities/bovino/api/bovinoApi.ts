import { apiClient } from '@/shared/api/clienteHttp'
import type { Bovino } from '../model/types'

export const bovinoApi = {
  getAll: async (pagina = 1): Promise<Bovino[]> => {
    const res = await apiClient.get('/api/v1/bovinos/', { params: { pagina } })
    return Array.isArray(res.data) ? res.data : []
  },
  getBovinoByLote: async (id_lote: string): Promise<Bovino[]> => {
    const res = await apiClient.get('/api/v1/bovinos/by-lote/',{params: {id_lote}})
    return Array.isArray(res.data) ? res.data : []

  },
  getBovinoBySearch: async (query: string): Promise<Bovino[]> => {
    const res = await apiClient.get('/api/v1/bovinos/search/',{params: {query}})
    return Array.isArray(res.data) ? res.data : []

  },
}