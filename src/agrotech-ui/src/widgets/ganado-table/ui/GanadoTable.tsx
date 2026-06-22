import { calcularEdad } from '@/shared/lib/calcularEdad';
import { DataTable, tableStyles } from '@/shared/ui/dataTable/DataTable';
import { StatsBovino } from '@/entities/bovino/ui/statsBovinos/StatsBovino';
import { BadgeEstado } from '@/entities/bovino/ui/badgeEstado/BadgeEstado';
import { BadgeLote } from '@/entities/bovino/ui/badgeLote/BadgeLote';
import { SearchInput } from '@/shared/ui/searchInput/SearchInput';
import { Pagination } from '@/shared/ui/pagination/Pagination';
import { Loading } from '@/shared/ui/loading/Loading';
import { Error } from '@/shared/ui/error/Error';
import { BotonFiltros } from '@/features/filtrar-ganado-por-estado/ui/BotonFiltros';
import { useGanadoTable } from '../model/useGanadoTable';
import styles from './ganadoTable.module.css';

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

        <DataTable
          columnas={COLUMNAS}
          datos={filtered}
          keyExtractor={(b) => b.id}
          empty="No se encontraron animales."
          renderizarFila={(bovino) => (
            <>
              <td className={`${tableStyles["data-table__td"]} ${styles["ganado-table__td--id"]}`}>{bovino.id}</td>
              <td className={tableStyles["data-table__td"]}><BadgeLote lote={bovino.lote.nombre} /></td>
              <td className={tableStyles["data-table__td"]}>{bovino.raza}</td>
              <td className={tableStyles["data-table__td"]}>{calcularEdad(bovino.fecha_nacimiento)}</td>
              <td className={tableStyles["data-table__td"]}>{bovino.peso_actual ? `${bovino.peso_actual.peso} kg` : "—"}</td>
              <td className={tableStyles["data-table__td"]}><BadgeEstado estado={bovino.estado_actual.estado} /></td>
              <td className={tableStyles["data-table__td"]}>
                <button className={styles["ver-btn"]}>Ver más</button>
              </td>
            </>
          )}
        />
      </div>
    </>
  );
};
