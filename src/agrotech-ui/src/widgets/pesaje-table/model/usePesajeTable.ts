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
    setLoading(true);
    bovinoApi.getAll(pagina)
      .then(setBovinos)
      .catch(() => setError("Error al cargar los pesajes"))
      .finally(() => setLoading(false));
  }, [pagina]);

  const filtered = bovinos.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.id.toLowerCase().includes(q) ||
      b.raza.toLowerCase().includes(q)
    );
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
  };
};
