export interface Peso{
    peso:string;
    fecha_pesaje:Date;
}

export interface RequestPesaje{
    id:string;
    peso:number;
}
export interface ResponsePesaje {
    fecha_pesaje:   Date;
    peso:           string;
    creado_en:      Date;
    id:             string;
    id_animal:      string;
    actualizado_en: Date;
}
