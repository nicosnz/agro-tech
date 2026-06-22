import { apiClient } from '@/shared/api/clienteHttp'
import type { RequestPesaje, ResponsePesaje } from '../model/types'

export const pesajeApi = {
    postPesaje: async (pesaje:RequestPesaje): Promise<ResponsePesaje> => {
        const res = await apiClient.post('/api/v1/pesajes/',pesaje)
        return res.data
    }
}