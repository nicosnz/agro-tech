import { apiClient } from '@/shared/api/clienteHttp'
import type { Potrero } from '../model/types'

export const potreroApi = {
  getAll: async (): Promise<Potrero[]> => {
    const res = await apiClient.get('/api/v1/potreros/')
    return Array.isArray(res.data) ? res.data : []
  }
}
