import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, ArrowRight } from "lucide-react";
import { bovinoApi } from "../../../entities/bovino/api/bovinoApi";
import type { Bovino } from "../../../entities/bovino/model/types";
import styles from "./ganado.module.css";
import { calcularEdad } from "../../../shared/lib/calcularEdad";
import { StastBovino } from "../../../entities/bovino/ui/stats/StastBovino";
import { SearchInput } from "../../../shared/ui/searchInput/SearchInput";



const estadoStyle: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  "Sano":           { bg: "#f0fdf4", border: "#86efac", text: "#15803d", dot: "#22c55e" },
  "Vendido":          { bg: "#f8fafc", border: "#cbd5e1", text: "#64748b", dot: "#94a3b8" },
  "En observacion":          { bg: "#fff1f2", border: "#fca5a5", text: "#dc2626", dot: "#ef4444" },
  "En tratamiento":   { bg: "#fffbeb", border: "#fcd34d", text: "#b45309", dot: "#f59e0b" },
};

const loteStyle: Record<string, { bg: string; text: string; border: string }> = {
  "Lote A": { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  "Lote B": { bg: "#faf5ff", text: "#7e22ce", border: "#e9d5ff" },
  "Lote C": { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
  "Lote D": { bg: "#f0fdfa", text: "#0f766e", border: "#99f6e4" },
};

function EstadoBadge({ estado }: { estado: string }) {
  const cfg = estadoStyle[estado] ?? { bg: "#f3f4f6", border: "#d1d5db", text: "#374151", dot: "#9ca3af" };
  return (
    <span className={styles["estado-badge"]} style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text }}>
      <span className={styles["estado-badge__dot"]} style={{ background: cfg.dot }} />
      {estado}
    </span>
  );
}

function LoteBadge({ lote }: { lote: string }) {
  const cfg = loteStyle[lote] ?? { bg: "#f3f4f6", text: "#374151", border: "#d1d5db" };
  return (
    <span className={styles["lote-badge"]} style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.text }}>
      {lote}
    </span>
  );
}

type SortKey = "id" | "raza" | "lote" | "peso" | "estado" | "edad" | null;

export const Ganado = () => {
  const [bovinos, setBovinos] = useState<Bovino[]>([]);
  const [search, setsearch] = useState('')
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    setLoading(true);
    bovinoApi.getAll(pagina)
      .then(setBovinos)
      .catch(() => setError("Error al cargar el ganado"))
      .finally(() => setLoading(false));
  }, [pagina]);

  const estados = ["Todos", ...Array.from(new Set(bovinos.map((b) => b.estado_actual.estado)))];

  const filtered = bovinos
    .filter((b) => {
      const q = search.toLowerCase();
      const matchSearch =
        b.id.toLowerCase().includes(q) ||
        b.raza.toLowerCase().includes(q) ||
        b.lote.nombre.toLowerCase().includes(q);
      const matchEstado = filterEstado === "Todos" || b.estado_actual.estado === filterEstado;
      return matchSearch && matchEstado;
    })
    .sort((a, b) => {
      if (!sortKey) return 0;
      if (sortKey === "edad") {
        const diff = new Date(a.fecha_nacimiento).getTime() - new Date(b.fecha_nacimiento).getTime();
        return sortAsc ? diff : -diff;
      }
      const get = (bovino: Bovino): string => ({
        id:     bovino.id,
        raza:   bovino.raza,
        lote:   bovino.lote.nombre,
        peso:   bovino.peso_actual?.peso ?? "",
        estado: bovino.estado_actual.estado,
      }[sortKey] ?? "");
      return sortAsc ? get(a).localeCompare(get(b)) : get(b).localeCompare(get(a));
    });

  const handleSort = (key: SortKey) => {
    if (!key) return;
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k
      ? sortAsc ? <ChevronUp size={11} /> : <ChevronDown size={11} />
      : <ChevronUp size={11} className={styles["sort-icon--muted"]} />;

  

  const columns: { key: SortKey; label: string }[] = [
    { key: "id",     label: "ID" },
    { key: "lote",   label: "Lote" },
    { key: "raza",   label: "Raza" },
    { key: "edad",   label: "Edad" },
    { key: "peso",   label: "Peso" },
    { key: "estado", label: "Estado" },
    { key: null,     label: "" },
  ];

  if (loading) return <div className={styles["ganado-page__loading"]}>Cargando...</div>;
  if (error)   return <div className={styles["ganado-page__error"]}>{error}</div>;

  return (
    <div className={styles["ganado-page"]}>
      <header className={styles["ganado-page__header"]}>
        <h1 className={styles["ganado-page__title"]}>Ganado</h1>
        <p className={styles["ganado-page__subtitle"]}>Inventario ganadero</p>
      </header>

      <div className={styles["ganado-page__content"]}>
        <StastBovino bovinos={bovinos}/>

        <div className={styles["ganado-table"]}>
          <div className={styles["ganado-table__controls"]}>
            <div>
              <h2 className={styles["ganado-table__title"]}>Ganado Registrado</h2>
              <p className={styles["ganado-table__count"]}>{filtered.length} de {bovinos.length} animales</p>
            </div>
            <div className={styles["ganado-table__filters"]}>
              <div className={styles["ganado-table__filter-btns"]}>
                {estados.map((e) => (
                  <button
                    key={e}
                    onClick={() => setFilterEstado(e)}
                    className={`${styles["filter-btn"]} ${filterEstado === e ? styles["filter-btn--active"] : ""}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
              <SearchInput valueSearch={search} onChange={(e) => setsearch(e.target.value)}/>
              
            </div>
          </div>

          <div className={styles["ganado-table__pagination"]}>
            <button
              className={styles["pagination__btn"]}
              onClick={() => setPagina((p) => p - 1)}
              disabled={pagina === 1}
            >
              ← Anterior
            </button>
            <span className={styles["pagination__info"]}>Página {pagina}</span>
            <button
              className={styles["pagination__btn"]}
              onClick={() => setPagina((p) => p + 1)}
              disabled={bovinos.length < 8}
            >
              Siguiente →
            </button>
          </div>

          <div className={styles["ganado-table__wrapper"]}>
            <table className={styles["ganado-table__table"]}>
              <thead>
                <tr className={styles["ganado-table__head-row"]}>
                  {columns.map(({ key, label }) => (
                    <th
                      key={label}
                      onClick={() => handleSort(key)}
                      className={`${styles["ganado-table__th"]} ${!key ? styles["ganado-table__th--no-sort"] : ""}`}
                    >
                      <span className={styles["ganado-table__th-inner"]}>
                        {label}
                        {key && <SortIcon k={key} />}
                      </span>
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
                    <td className={styles["ganado-table__td"]}><LoteBadge lote={bovino.lote.nombre} /></td>
                    <td className={styles["ganado-table__td"]}>{bovino.raza}</td>
                    <td className={styles["ganado-table__td"]}>{calcularEdad(bovino.fecha_nacimiento)}</td>
                    <td className={styles["ganado-table__td"]}>{bovino.peso_actual?.peso ?? "—"}</td>
                    <td className={styles["ganado-table__td"]}><EstadoBadge estado={bovino.estado_actual.estado} /></td>
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
