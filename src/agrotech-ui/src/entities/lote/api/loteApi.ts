import type { Lote } from '@/entities/bovino/model/types'
import { apiClient } from '@/shared/api/clienteHttp'

export const loteApi = {
  getLotesByPotrero: async (id_potrero:string): Promise<Lote[]> => {
    const res = await apiClient.get('/api/v1/lotes/',{params:{id_potrero}})
    return Array.isArray(res.data) ? res.data : []
  }
}