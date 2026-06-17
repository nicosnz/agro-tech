export interface Bovino {
    id:               string;
    raza:             string;
    lote:             Lote;
    peso_actual:      PesoActual | null;
    estado_actual:    EstadoActual;
    fecha_nacimiento: Date;
}

export interface EstadoActual {
    estado: string;
}

export interface Lote {
    nombre: string;
}

export interface PesoActual {
    peso:         string;
    fecha_pesaje: Date;
}
