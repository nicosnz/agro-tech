import styles from './ganadoTable.module.css';
import { ArrowRight } from 'lucide-react';
import { calcularEdad } from '@/shared/lib/calcularEdad';
import { StatsBovino } from '@/entities/bovino/ui/stats/StatsBovino';
import { BadgeEstado } from '@/entities/bovino/ui/badgeEstado/BadgeEstado';
import { BadgeLote } from '@/entities/bovino/ui/badgeLote/BadgeLote';
import { SearchInput } from '@/shared/ui/searchInput/SearchInput';
import { Pagination } from '@/shared/ui/pagination/Pagination';
import { Loading } from '@/shared/ui/loading/Loading';
import { Error } from '@/shared/ui/error/Error';
import { BotonFiltros } from '@/features/filtrar-ganado-por-estado/ui/BotonFiltros';
import { useGanadoTable } from '../model/useGanadoTable';

const COLUMNAS = ["ID", "Lote", "Raza", "Edad", "Peso", "Estado", ""];

export const GanadoTable = () => {
  const {
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
  } = useGanadoTable();

  if (loading) return <Loading />;
  if (error)   return <Error error={error} />;

  return (
    <>
      <StatsBovino bovinos={bovinos} />

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
            <SearchInput valueSearch={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <Pagination
          pagina={pagina}
          hasNext={bovinos.length === 8}
          onNext={() => setPagina(p => p + 1)}
          onPrev={() => setPagina(p => p - 1)}
        />

        <div className={styles["ganado-table__wrapper"]}>
          <table className={styles["ganado-table__table"]}>
            <thead>
              <tr className={styles["ganado-table__head-row"]}>
                {COLUMNAS.map((label, i) => (
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
                  <td className={styles["ganado-table__td"]}>{bovino.peso_actual ? `${bovino.peso_actual.peso} kg` : "—"}</td>
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
    </>
  );
};
