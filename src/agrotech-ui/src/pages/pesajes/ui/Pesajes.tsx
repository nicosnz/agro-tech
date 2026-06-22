import { PesajeTable } from "@/widgets/pesaje-table/ui/PesajeTable";
import styles from "./pesajes.module.css";

export const Pesajes = () => {
  return (
    <div className={styles["pesajes-page"]}>
      <header className={styles["pesajes-page__header"]}>
        <h1 className={styles["pesajes-page__title"]}>Pesajes</h1>
        <p className={styles["pesajes-page__subtitle"]}>Seguimiento del Peso del Ganado</p>
      </header>

      <div className={styles["pesajes-page__content"]}>
        <PesajeTable/>
      </div>
    </div>
  );
};
