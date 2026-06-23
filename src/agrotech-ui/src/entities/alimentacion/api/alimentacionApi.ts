import { apiClient } from '@/shared/api/clienteHttp'
import type { AlimentacionRequest, AlimentacionResponse } from '../model/types'

export const alimentacionApi = {
    postAlimentacion: async (alimentacion:AlimentacionRequest): Promise<AlimentacionResponse> => {
        const res = await apiClient.post('/api/v1/alimentacion/',alimentacion)
        return res.data
    }
}