import { useState, useEffect } from "react";
import { bovinoApi } from "@/entities/bovino/api/bovinoApi";
import type { Bovino } from "@/entities/bovino/model/types";
import { useFiltrarGanadoPorEstado } from "@/features/filtrar-ganado-por-estado/model/useFiltrarGanadoPorEstado";

export const useGanadoTable = () => {
  const [bovinos, setBovinos] = useState<Bovino[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagina, setPagina] = useState(1);
  const [search, setSearch] = useState('');
  const { filterEstado, setFilterEstado, estados, filtrar } = useFiltrarGanadoPorEstado(bovinos);

  useEffect(() => {
    setLoading(true);
    bovinoApi.getAll(pagina)
      .then(setBovinos)
      .catch(() => setError("Error al cargar el ganado"))
      .finally(() => setLoading(false));
  }, [pagina]);

  const filtered = bovinos.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch =
      b.id.toLowerCase().includes(q) ||
      b.raza.toLowerCase().includes(q) ||
      b.lote.nombre.toLowerCase().includes(q);
    return matchSearch && filtrar(b);
  });

  return {
    bovinos,
    filtered,
    loading,
    error,
    pagina,
    setPagina,
    search,
    setSearch,
    estados,
    filterEstado,
    setFilterEstado,
  };
};
