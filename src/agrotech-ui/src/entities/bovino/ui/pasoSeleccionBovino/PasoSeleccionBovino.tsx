import { useState, useEffect } from "react";
import { SearchInput } from "@/shared/ui/searchInput/SearchInput";
import { bovinoApi } from "@/entities/bovino/api/bovinoApi";
import { calcularEdad } from "@/shared/lib/calcularEdad";
import type { Lote } from "@/entities/lote/model/types";
import type { Bovino } from "@/entities/bovino/model/types";
import styles from "./PasoSeleccionBovino.module.css";
import { numericId } from "@/shared/lib/toNumericId";

interface Props {
  lote: Lote;
  onSelect: (bovino: Bovino) => void;
}


export const PasoSeleccionBovino = ({ lote, onSelect }: Props) => {
  const [bovinos, setBovinos] = useState<Bovino[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch]   = useState("");

  useEffect(() => {
    setLoading(true);
    bovinoApi.getBovinoByLote(lote.id)
      .then(setBovinos)
      .finally(() => setLoading(false));
  }, [lote.id]);

  const filtrados = bovinos.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.id.toLowerCase().includes(q) ||
      b.raza.toLowerCase().includes(q) ||
      calcularEdad(b.fecha_nacimiento).toLowerCase().includes(q)
    );
  });

  return (
    <div className={styles["paso-bovino"]}>
      <SearchInput
        valueSearch={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul className={styles["paso-bovino__lista"]}>
        {loading && (
          <li className={styles["paso-bovino__empty"]}>Cargando animales...</li>
        )}

        {!loading && filtrados.length === 0 && (
          <li className={styles["paso-bovino__empty"]}>No se encontraron animales.</li>
        )}

        {!loading && filtrados.map((bovino) => (
          <li key={bovino.id}>
            <button className={styles["paso-bovino__item"]} onClick={() => onSelect(bovino)}>
              <div className={styles["paso-bovino__badge-num"]}>
                {numericId(bovino.id)}
              </div>
              <div className={styles["paso-bovino__info"]}>
                <div className={styles["paso-bovino__top"]}>
                  <span className={styles["paso-bovino__id"]}>{numericId(bovino.id)}</span>
                  <span className={styles["paso-bovino__estado"]}>
                    <span className={styles["paso-bovino__dot"]} />
                    {bovino.estado_actual.estado}
                  </span>
                </div>
                <span className={styles["paso-bovino__detalle"]}>
                  {bovino.raza} · {calcularEdad(bovino.fecha_nacimiento)}
                </span>
              </div>
              <div className={styles["paso-bovino__peso"]}>
                <span className={styles["paso-bovino__peso-valor"]}>
                  {bovino.peso_actual ? `${bovino.peso_actual.peso} kg` : "—"}
                </span>
                <span className={styles["paso-bovino__peso-label"]}>peso actual</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
