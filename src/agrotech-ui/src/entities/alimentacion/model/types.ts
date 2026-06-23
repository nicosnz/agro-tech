export interface AlimentacionRequest{
    id_tipo_alimento:string;
    cantidad:number;
    observacion?:string;
    id_lote:string;
}

export interface AlimentacionResponse {
    id:                 string;
    cantidad:           string;
    id_lote:            string;
    actualizado_en:     Date;
    fecha_alimentacion: Date;
    id_tipo_alimento:   string;
    observacion:        string;
    creado_en:          Date;
}
