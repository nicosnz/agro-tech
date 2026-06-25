import type { Lote } from '@/entities/lote/model/types'
import { apiClient } from '@/shared/api/clienteHttp'

export const loteApi = {
  getAll: async (): Promise<Lote[]> => {
    const res = await apiClient.get('/api/v1/lotes/all')
    return Array.isArray(res.data) ? res.data : []
  },
  getLotesByPotrero: async (id_potrero: string): Promise<Lote[]> => {
    const res = await apiClient.get('/api/v1/lotes/', { params: { id_potrero } })
    return Array.isArray(res.data) ? res.data : []
  },
}
