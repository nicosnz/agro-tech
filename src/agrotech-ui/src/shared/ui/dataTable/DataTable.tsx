import type { ReactNode } from "react";
import styles from "./dataTable.module.css";

interface Props<T> {
  columnas: string[];
  datos: T[];
  renderizarFila: (item: T) => ReactNode;
  keyExtractor: (item: T) => string | number;
  rowClassName?: (item: T, idx: number) => string | undefined;
  empty?: string;
}

export const DataTable = <T,>({ columnas, datos, renderizarFila, keyExtractor, rowClassName, empty }: Props<T>) => (
  <div className={styles["data-table__wrapper"]}>
    <table className={styles["data-table"]}>
      <thead>
        <tr className={styles["data-table__head-row"]}>
          {columnas.map((col) => (
            <th key={col} className={styles["data-table__th"]}>
              <span className={styles["data-table__th-inner"]}>{col}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {datos.length === 0
          ? (
            <tr>
              <td colSpan={columnas.length} className={styles["data-table__empty"]}>
                {empty ?? "Sin resultados"}
              </td>
            </tr>
          )
          : datos.map((item, idx) => (
            <tr
              key={keyExtractor(item)}
              className={`${styles["data-table__row"]} ${idx % 2 !== 0 ? styles["data-table__row--alt"] : ""} ${rowClassName?.(item, idx) ?? ""}`}
            >
              {renderizarFila(item)}
            </tr>
          ))
        }
      </tbody>
    </table>
  </div>
);

export { styles as tableStyles };
