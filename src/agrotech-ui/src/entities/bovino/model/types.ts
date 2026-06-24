import type { Peso } from "@/entities/pesaje/model/types";

export interface Bovino {
    id:               string;
    raza:             string;
    lote:             LoteRef;
    peso_actual:      Peso | null;
    peso_anterior:      Peso | null;
    estado_actual:    EstadoActual | null;
    fecha_nacimiento: Date;
}

export interface EstadoActual {
    estado: string;
}

export interface LoteRef {
    nombre: string;
}

