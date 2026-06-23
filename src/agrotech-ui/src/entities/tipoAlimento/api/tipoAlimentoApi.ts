import { apiClient } from '@/shared/api/clienteHttp'
import type { TipoAlimento } from '../model/types'

export const tipoAlimentoApi = {
  getAll: async (): Promise<TipoAlimento[]> => {
    const res = await apiClient.get('/api/v1/tipo-alimento/')
    return Array.isArray(res.data) ? res.data : []
  }
}