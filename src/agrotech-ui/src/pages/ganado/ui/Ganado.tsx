import { ButtonAdd } from "@/shared/ui/buttonAdd/ButtonAdd";
import styles from "./Ganado.module.css";
import { GanadoTable } from "@/widgets/ganado-table/ui/GanadoTable";
import { ModalRegistrarAnimal } from "@/features/registrar-animal/ui/ModalRegistrarAnimal";
import { Toast } from "@/shared/ui/toast/Toast";
import { useState } from "react";

export const Ganado = () => {
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  
  return (
    <div className={styles["ganado-page"]}>
      <header className={styles["ganado-page__header"]}>
        <div>
          <h1 className={styles["ganado-page__title"]}>Ganado</h1>
          <p className={styles["ganado-page__subtitle"]}>Inventario ganadero</p>

        </div>
        <ButtonAdd label="Registrar Animal Nuevo" onClick={() => setShowModal(true)} />
      
      </header>

      <div className={styles["ganado-page__content"]}>
        <GanadoTable refreshTrigger={refreshKey} />
      </div>

      <ModalRegistrarAnimal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => { setShowToast(true); setRefreshKey(k => k + 1); }}
      />

      {showToast && (
        <Toast
          mensaje="Animal registrado exitosamente"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};
