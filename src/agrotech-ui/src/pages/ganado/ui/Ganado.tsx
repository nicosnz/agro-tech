import styles from "./Ganado.module.css";
import { GanadoTable } from "@/widgets/ganado-table/ui/GanadoTable";

export const Ganado = () => {
  return (
    <div className={styles["ganado-page"]}>
      <header className={styles["ganado-page__header"]}>
        <h1 className={styles["ganado-page__title"]}>Ganado</h1>
        <p className={styles["ganado-page__subtitle"]}>Inventario ganadero</p>
      </header>

      <div className={styles["ganado-page__content"]}>
        <GanadoTable />
      </div>
    </div>
  );
};
