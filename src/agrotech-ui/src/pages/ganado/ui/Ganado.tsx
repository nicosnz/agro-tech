import { useState, useEffect } from "react";
import styles from "./ganado.module.css";
import { ArrowRight } from "lucide-react";
import { bovinoApi } from "@/entities/bovino/api/bovinoApi";
import type { Bovino } from "@/entities/bovino/model/types";
import { calcularEdad } from "@/shared/lib/calcularEdad";
import { StatsBovino } from "@/entities/bovino/ui/stats/StatsBovino";
import { SearchInput } from "@/shared/ui/searchInput/SearchInput";
import { BadgeEstado } from "@/entities/bovino/ui/badgeEstado/BadgeEstado";
import { BadgeLote } from "@/entities/bovino/ui/badgeLote/BadgeLote";
import { Pagination } from "@/shared/ui/pagination/Pagination";
import { Loading } from "@/shared/ui/loading/Loading";
import { Error } from "@/shared/ui/error/Error";
import { useFiltrarGanadoPorEstado } from "@/features/filtrar-ganado-por-estado/model/useFiltrarGanadoPorEstado";
import { BotonFiltros } from "@/features/filtrar-ganado-por-estado/ui/BotonFiltros";

const columns = ["ID", "Lote", "Raza", "Edad", "Peso", "Estado", ""];

export const Ganado = () => {
  const [bovinos, setBovinos] = useState<Bovino[]>([]);
  const [search, setsearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagina, setPagina] = useState(1);
  const {filterEstado,setFilterEstado, estados,filtrar} = useFiltrarGanadoPorEstado(bovinos)

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

  if (loading) return <Loading/>;
  if (error)   return <Error error={error}/>;

  return (
    <div className={styles["ganado-page"]}>
      <header className={styles["ganado-page__header"]}>
        <h1 className={styles["ganado-page__title"]}>Ganado</h1>
        <p className={styles["ganado-page__subtitle"]}>Inventario ganadero</p>
      </header>

      <div className={styles["ganado-page__content"]}>
        <StatsBovino bovinos={bovinos}/>

        <div className={styles["ganado-table"]}>
          <div className={styles["ganado-table__controls"]}>
            <div>
              <h2 className={styles["ganado-table__title"]}>Ganado Registrado</h2>
              <p className={styles["ganado-table__count"]}>{filtered.length} de {bovinos.length} animales</p>
            </div>
            <div className={styles["ganado-table__filters"]}>
              <BotonFiltros
                estados={estados}
                filtroActivo={filterEstado}
                onFiltrar={setFilterEstado}
              />
              <SearchInput valueSearch={search} onChange={(e) => setsearch(e.target.value)}/>
            </div>
          </div>

          <Pagination pagina={pagina} hasNext={bovinos.length === 8} onNext={() => setPagina(p => p + 1)} onPrev={() => setPagina(p => p - 1)}/>

          <div className={styles["ganado-table__wrapper"]}>
            <table className={styles["ganado-table__table"]}>
              <thead>
                <tr className={styles["ganado-table__head-row"]}>
                  {columns.map((label, i) => (
                    <th key={i} className={styles["ganado-table__th"]}>
                      <span className={styles["ganado-table__th-inner"]}>{label}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((bovino, idx) => (
                  <tr
                    key={bovino.id}
                    className={`${styles["ganado-table__row"]} ${idx % 2 !== 0 ? styles["ganado-table__row--alt"] : ""}`}
                  >
                    <td className={`${styles["ganado-table__td"]} ${styles["ganado-table__td--id"]}`}>{bovino.id}</td>
                    <td className={styles["ganado-table__td"]}><BadgeLote lote={bovino.lote.nombre} /></td>
                    <td className={styles["ganado-table__td"]}>{bovino.raza}</td>
                    <td className={styles["ganado-table__td"]}>{calcularEdad(bovino.fecha_nacimiento)}</td>
                    <td className={styles["ganado-table__td"]}>{bovino.peso_actual?.peso ?? "—"}</td>
                    <td className={styles["ganado-table__td"]}><BadgeEstado estado={bovino.estado_actual.estado} /></td>
                    <td className={styles["ganado-table__td"]}>
                      <button className={styles["ver-btn"]}>
                        Ver más <ArrowRight size={11} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className={styles["ganado-table__empty"]}>
                      No se encontraron animales.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
