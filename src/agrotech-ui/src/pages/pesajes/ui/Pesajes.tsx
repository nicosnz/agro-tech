import { PesajeTable } from "@/widgets/pesaje-table/ui/PesajeTable";
import styles from "./pesajes.module.css";
import { ButtonAdd } from "@/shared/ui/buttonAdd/ButtonAdd";

export const Pesajes = () => {
  return (
    <div className={styles["pesajes-page"]}>
      <header className={styles["pesajes-page__header"]}>
        <div>
          <h1 className={styles["pesajes-page__title"]}>Pesajes</h1>
          <p className={styles["pesajes-page__subtitle"]}>Seguimiento del Peso del Ganado</p>
        </div>
        <ButtonAdd label="Registrar Pesaje" onClick={() => console.log('sd')} />
      </header>

      <div className={styles["pesajes-page__content"]}>
        <PesajeTable/>
      </div>
    </div>
  );
};
