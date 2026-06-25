import { apiClient } from '@/shared/api/clienteHttp'
import type { Bovino, BovinoIds, BovinoRequest } from '../model/types'

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
  postBovino: async (bovino:BovinoRequest): Promise<Bovino> => {
          const res = await apiClient.post('/api/v1/bovinos/',bovino)
          return res.data
  },
  getMachos: async (): Promise<BovinoIds[]> => {
    const res = await apiClient.get('/api/v1/bovinos/machos')
    return Array.isArray(res.data) ? res.data : []
  },
  getHembras: async (): Promise<BovinoIds[]> => {
    const res = await apiClient.get('/api/v1/bovinos/hembras')
    return Array.isArray(res.data) ? res.data : []
  },

}