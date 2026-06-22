import type { Bovino } from '@/entities/bovino/model/types'
import { useState } from 'react';


export const useFiltrarGanadoPorEstado = (bovinos:Bovino[]) => {
  const [filterEstado, setFilterEstado] = useState("Todos");
  const estados = ["Todos", ...Array.from(new Set(bovinos.map((b) => b.estado_actual.estado)))];
  const filtrar = (bovino:Bovino) => {
    return filterEstado === 'Todos' || bovino.estado_actual.estado === filterEstado;

  }
  return {filterEstado,setFilterEstado,estados,filtrar};
  
  
    
}
