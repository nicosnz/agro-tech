import { useState, useEffect } from "react";
import { SearchInput } from "@/shared/ui/searchInput/SearchInput";
import { loteApi } from "@/entities/lote/api/loteApi";
import type { Potrero } from "@/entities/potrero/model/types";
import type { Lote } from "@/entities/lote/model/types";
import styles from "./pasoSeleccionLote.module.css";

interface Props {
  potrero: Potrero;
  onSelect: (lote: Lote) => void;
}

const LoteIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="8" height="8" rx="2" fill="#16a34a" />
    <rect x="13" y="3" width="8" height="8" rx="2" fill="#16a34a" opacity="0.5" />
    <rect x="3" y="13" width="8" height="8" rx="2" fill="#16a34a" opacity="0.5" />
    <rect x="13" y="13" width="8" height="8" rx="2" fill="#16a34a" opacity="0.3" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 4L10 8L6 12" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PasoSeleccionLote = ({ potrero, onSelect }: Props) => {
  const [lotes, setLotes]     = useState<Lote[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch]   = useState("");

  useEffect(() => {
    setLoading(true);
    loteApi.getLotesByPotrero(potrero.id)
      .then(setLotes)
      .finally(() => setLoading(false));
  }, [potrero.id]);

  const filtrados = lotes.filter((l) =>
    l.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles["paso-lote"]}>
      <SearchInput valueSearch={search} onChange={(e) => setSearch(e.target.value)} />

      <ul className={styles["paso-lote__lista"]}>
        {loading && (
          <li className={styles["paso-lote__empty"]}>Cargando lotes...</li>
        )}

        {!loading && filtrados.length === 0 && (
          <li className={styles["paso-lote__empty"]}>No se encontraron lotes.</li>
        )}

        {!loading && filtrados.map((lote) => (
          <li key={lote.id}>
            <button className={styles["paso-lote__item"]} onClick={() => onSelect(lote)}>
              <div className={styles["paso-lote__icono"]}>
                <LoteIcon />
              </div>
              <div className={styles["paso-lote__info"]}>
                <span className={styles["paso-lote__nombre"]}>{lote.nombre}</span>
                <span className={styles["paso-lote__detalle"]}>{lote.tipo} · {lote.cantidad_animales} animales</span>
              </div>
              <ArrowRightIcon />
            </button>
          </li>
        ))}
      </ul>

    </div>
  );
};
