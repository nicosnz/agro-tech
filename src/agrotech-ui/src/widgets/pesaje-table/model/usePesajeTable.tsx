import { useState, useEffect } from "react";
import { bovinoApi } from "@/entities/bovino/api/bovinoApi";
import type { Bovino } from "@/entities/bovino/model/types";

export const usePesajeTable = () => {
  const [bovinos, setBovinos] = useState<Bovino[]>([]);
  const [loading, setLoading]  = useState(true);
  const [error, setError]      = useState<string | null>(null);
  const [pagina, setPagina]    = useState(1);
  const [search, setSearch]    = useState('');

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
  

  return {
    bovinos,
    loading,
    handleSearch,
    error,
    pagina,
    setPagina,
    search,
    setSearch,
  };
};
