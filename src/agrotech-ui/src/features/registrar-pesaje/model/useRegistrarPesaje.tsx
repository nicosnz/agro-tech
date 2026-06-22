import { useState, useEffect } from "react";
import { potreroApi } from "@/entities/potrero/api/potreroApi";
import { pesajeApi } from "@/entities/pesaje/api/pesajeApi";
import type { Potrero } from "@/entities/potrero/model/types";
import type { Lote } from "@/entities/lote/model/types";
import type { Bovino } from "@/entities/bovino/model/types";

type Paso = 1 | 2 | 3 | 4;

interface FormData {
  peso: string;
}

export const useRegistrarPesaje = () => {
  const [paso, setPaso]                               = useState<Paso>(1);
  const [potreros, setPotreros]                       = useState<Potrero[]>([]);
  const [loadingPotreros, setLoadingPotreros]         = useState(false);
  const [potreroSeleccionado, setPotreroSeleccionado] = useState<Potrero | null>(null);
  const [loteSeleccionado, setLoteSeleccionado]       = useState<Lote | null>(null);
  const [bovinoSeleccionado, setBovinoSeleccionado]   = useState<Bovino | null>(null);
  const [formData, setFormData]                       = useState<FormData>({ peso: "" });
  const [submitting, setSubmitting]                   = useState(false);

  useEffect(() => {
    setLoadingPotreros(true);
    potreroApi.getAll()
      .then(setPotreros)
      .finally(() => setLoadingPotreros(false));
  }, []);

  const seleccionarPotrero = (potrero: Potrero) => {
    setPotreroSeleccionado(potrero);
    setLoteSeleccionado(null);
    setBovinoSeleccionado(null);
    setPaso(2);
  };

  const seleccionarLote = (lote: Lote) => {
    setLoteSeleccionado(lote);
    setBovinoSeleccionado(null);
    setPaso(3);
  };

  const seleccionarBovino = (bovino: Bovino) => {
    setBovinoSeleccionado(bovino);
    setPaso(4);
  };

  const anterior = () => setPaso((p) => (p - 1) as Paso);

  const reset = () => {
    setPaso(1);
    setPotreroSeleccionado(null);
    setLoteSeleccionado(null);
    setBovinoSeleccionado(null);
    setFormData({ peso: "" });
  };

  const submit = async () => {
    if (!bovinoSeleccionado || !formData.peso) return;
    setSubmitting(true);
    try {
      await pesajeApi.postPesaje({
        id: bovinoSeleccionado.id,
        peso: parseFloat(formData.peso),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    paso,
    potreros,
    loadingPotreros,
    potreroSeleccionado,
    loteSeleccionado,
    bovinoSeleccionado,
    formData,
    setFormData,
    seleccionarPotrero,
    seleccionarLote,
    seleccionarBovino,
    anterior,
    reset,
    submit,
    submitting,
  };
};
