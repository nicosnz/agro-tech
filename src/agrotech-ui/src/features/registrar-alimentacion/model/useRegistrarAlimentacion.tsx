import { useState, useEffect } from "react";
import { potreroApi } from "@/entities/potrero/api/potreroApi";
import { alimentacionApi } from "@/entities/alimentacion/api/alimentacionApi";
import type { Potrero } from "@/entities/potrero/model/types";
import type { Lote } from "@/entities/lote/model/types";

type Paso = 1 | 2 | 3;

interface FormData {
  id_tipo_alimento: string;
  cantidad: string;
  observacion: string;
}

export const useRegistrarAlimentacion = () => {
  const [error, setError] = useState<string|null>(null)
  const [paso, setPaso]                               = useState<Paso>(1);
  const [potreros, setPotreros]                       = useState<Potrero[]>([]);
  const [loadingPotreros, setLoadingPotreros]         = useState(false);
  const [potreroSeleccionado, setPotreroSeleccionado] = useState<Potrero | null>(null);
  const [loteSeleccionado, setLoteSeleccionado]       = useState<Lote | null>(null);
  const [formData, setFormData]                       = useState<FormData>({ id_tipo_alimento: "", cantidad: "", observacion: "" });
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
    setPaso(2);
  };

  const seleccionarLote = (lote: Lote) => {
    setLoteSeleccionado(lote);
    setPaso(3);
  };

  const anterior = () => setPaso((p) => (p - 1) as Paso);

  const reset = () => {
    setPaso(1);
    setPotreroSeleccionado(null);
    setLoteSeleccionado(null);
    setFormData({ id_tipo_alimento: "", cantidad: "", observacion: "" });
  };

  const submit = async (): Promise<boolean> => {
    setError(null);
    if (!loteSeleccionado || !formData.id_tipo_alimento || !formData.cantidad) return false;
    setSubmitting(true);
    try {
      await alimentacionApi.postAlimentacion({
        id_lote:          loteSeleccionado.id,
        id_tipo_alimento: formData.id_tipo_alimento,
        cantidad:         parseFloat(formData.cantidad),
        observacion:      formData.observacion || undefined,
      });
      return true;
    } catch (e: any) {
      setError(e.response?.data?.detail ?? "Error al registrar");
      return false;
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
    formData,
    setFormData,
    seleccionarPotrero,
    seleccionarLote,
    anterior,
    reset,
    submit,
    submitting,
    error,setError
  };
};
