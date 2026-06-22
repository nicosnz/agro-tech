import { useState } from "react";
import { PesajeTable } from "@/widgets/pesaje-table/ui/PesajeTable";
import { ButtonAdd } from "@/shared/ui/buttonAdd/ButtonAdd";
import { ModalRegistrarPesaje } from "@/features/registrar-pesaje/ui/ModalRegistrarPesaje";
import styles from "./pesajes.module.css";

export const Pesajes = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={styles["pesajes-page"]}>
      <header className={styles["pesajes-page__header"]}>
        <div>
          <h1 className={styles["pesajes-page__title"]}>Pesajes</h1>
          <p className={styles["pesajes-page__subtitle"]}>Seguimiento del Peso del Ganado</p>
        </div>
        <ButtonAdd label="Registrar Pesaje" onClick={() => setShowModal(true)} />
      </header>

      <div className={styles["pesajes-page__content"]}>
        <PesajeTable />
      </div>

      <ModalRegistrarPesaje isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};
