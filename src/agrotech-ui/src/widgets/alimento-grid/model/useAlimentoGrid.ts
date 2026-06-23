import { useState, useEffect } from "react";
import { tipoAlimentoApi } from "@/entities/tipoAlimento/api/tipoAlimentoApi";
import type { TipoAlimento } from "@/entities/tipoAlimento/model/types";

export const useAlimentoGrid = () => {
  const [alimentos, setAlimentos] = useState<TipoAlimento[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    tipoAlimentoApi.getAll()
      .then(setAlimentos)
      .catch(() => setError("Error al cargar los alimentos"))
      .finally(() => setLoading(false));
  }, []);

  const stockMaximo = Math.max(...alimentos.map((a) => a.cantidad_restante), 1);

  return { alimentos, stockMaximo, loading, error };
};
