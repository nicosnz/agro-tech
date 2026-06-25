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
export interface BovinoIds {
    id:               string;
}

export interface EstadoActual {
    estado: string;
}

export interface LoteRef {
    nombre: string;
}

export type SexoBovino   = 'Macho' | 'Hembra';
export type RazaBovino   = 'Nelore' | 'Brangus' | 'Brahman';
export type OrigenBovino = 'Comprado' | 'Nacimiento propio';

export interface BovinoRequest {
    sexo:             SexoBovino;
    raza:             RazaBovino;
    fecha_nacimiento: string;
    origen:           OrigenBovino;
    id_lote:          string;
    id_madre:         string | null;
    id_padre:         string | null;
}