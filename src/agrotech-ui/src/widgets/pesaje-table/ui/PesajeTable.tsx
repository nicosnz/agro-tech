import { DataTable, tableStyles } from '@/shared/ui/dataTable/DataTable';
import { SearchInput } from '@/shared/ui/searchInput/SearchInput';
import { Pagination } from '@/shared/ui/pagination/Pagination';
import { Loading } from '@/shared/ui/loading/Loading';
import { Error } from '@/shared/ui/error/Error';
import { StatsPesajes } from '@/entities/pesaje/ui/statsPesajes/StatsPesajes';
import { VariacionPeso } from '@/entities/pesaje/ui/variacionPeso/VariacionPeso';
import { PesajeCard } from '@/entities/pesaje/ui/pesajeCard/PesajeCard';
import { calcularEdad } from '@/shared/lib/calcularEdad';
import { usePesajeTable } from '../model/usePesajeTable';
import styles from './PesajeTable.module.css';
import { formatFecha } from '@/shared/lib/formatFecha';

const COLUMNAS = ["ID", "Edad", "Raza", "Peso Actual", "Peso Anterior", "Variación", "Último Pesaje"];

export const PesajeTable = () => {
  const {
    bovinos,
    filtered,
    loading,
    error,
    pagina,
    setPagina,
    search,
    setSearch,
  } = usePesajeTable();

  if (loading) return <Loading />;
  if (error)   return <Error error={error} />;

  return (
    <>
      <StatsPesajes bovinos={bovinos} />

      <div className={styles["pesaje-table"]}>
        <div className={styles["pesaje-table__controls"]}>
          <div>
            <h2 className={styles["pesaje-table__title"]}>Pesos registrados</h2>
            <p className={styles["pesaje-table__count"]}>{filtered.length} de {bovinos.length} animales</p>
          </div>
          <SearchInput valueSearch={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <Pagination
          pagina={pagina}
          hasNext={bovinos.length === 8}
          onNext={() => setPagina(p => p + 1)}
          onPrev={() => setPagina(p => p - 1)}
        />

        <div className={styles["pesaje-table__desktop"]}>
          <DataTable
            columnas={COLUMNAS}
            datos={filtered}
            keyExtractor={(b) => b.id}
            empty="No se encontraron pesajes."
            rowClassName={(b) => {
              if (!b.peso_actual || !b.peso_anterior) return undefined;
              const diff = parseFloat(b.peso_actual.peso) - parseFloat(b.peso_anterior.peso);
              if (diff > 0) return styles["pesaje-table__row--sube"];
              if (diff < 0) return styles["pesaje-table__row--baja"];
              return undefined;
            }}
            renderizarFila={(bovino) => (
              <>
                <td className={`${tableStyles["data-table__td"]} ${styles["pesaje-table__td--id"]}`}>{bovino.id}</td>
                <td className={tableStyles["data-table__td"]}>{calcularEdad(bovino.fecha_nacimiento)}</td>
                <td className={tableStyles["data-table__td"]}>{bovino.raza}</td>
                <td className={tableStyles["data-table__td"]}><span className={styles['pesaje-table__td--pesoactual']}>{bovino.peso_actual ? `${bovino.peso_actual.peso} kg` : "—"}</span></td>
                <td className={tableStyles["data-table__td"]}>{bovino.peso_anterior ? `${bovino.peso_anterior.peso} kg` : "—"}</td>
                <td className={tableStyles["data-table__td"]}>
                  <VariacionPeso actual={bovino.peso_actual} anterior={bovino.peso_anterior} />
                </td>
                <td className={`${tableStyles["data-table__td"]} ${styles["pesaje-table__td--fecha"]}`}>
                  {bovino.peso_actual ? formatFecha(bovino.peso_actual.fecha_pesaje) : "—"}
                </td>
              </>
            )}
          />
        </div>

        <div className={styles["pesaje-table__card-list"]}>
          {filtered.length === 0
            ? <p className={styles["pesaje-table__empty-cards"]}>No se encontraron pesajes.</p>
            : filtered.map((bovino) => <PesajeCard key={bovino.id} bovino={bovino} />)
          }
        </div>
      </div>
    </>
  );
};
