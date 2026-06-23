import { useState } from "react";
import { ButtonAdd } from "@/shared/ui/buttonAdd/ButtonAdd";
import { AlimentoGrid } from "@/widgets/alimento-grid/ui/AlimentoGrid";
import { ModalRegistrarAlimentacion } from "@/features/registrar-alimentacion/ui/ModalRegistrarAlimentacion";
import { Toast } from "@/shared/ui/toast/Toast";
import styles from "./alimentacion.module.css";

export const Alimentacion = () => {
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  return (
    <div className={styles["alimentacion-page"]}>
      <header className={styles["alimentacion-page__header"]}>
        <div>
          <h1 className={styles["alimentacion-page__title"]}>Alimentación</h1>
          <p className={styles["alimentacion-page__subtitle"]}>Alimentos disponibles en la hacienda que puedes usar</p>
        </div>
        <ButtonAdd label="Alimentar a un lote" onClick={() => setShowModal(true)} />
      </header>

      <div className={styles["alimentacion-page__content"]}>
        <AlimentoGrid />
      </div>

      <ModalRegistrarAlimentacion
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => setShowToast(true)}
      />

      {showToast && (
        <Toast
          mensaje="Alimentación registrada exitosamente"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};
