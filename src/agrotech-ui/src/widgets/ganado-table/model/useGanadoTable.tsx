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
    const timeoutId = setTimeout(() => {
      setLoading(true);

      const llamada = search.trim()
        ? bovinoApi.getBovinoBySearch(search)
        : bovinoApi.getAll(pagina);

      llamada
        .then(setBovinos)
        .catch(() => setError("Error al cargar el ganado"))
        .finally(() => setLoading(false));

    }, search.trim() ? 700 : 0);

    return () => clearTimeout(timeoutId);
  }, [search, pagina]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPagina(1);
  };

  const filtered = bovinos.filter((b) => {
    
    return filtrar(b);
  });

  return {
    bovinos,
    filtered,
    loading,
    error,
    pagina,
    setPagina,
    search,
    handleSearch,
    estados,
    filterEstado,
    setFilterEstado,
  };
};
