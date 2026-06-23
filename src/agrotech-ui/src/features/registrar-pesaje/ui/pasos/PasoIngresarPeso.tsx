import { calcularEdad } from "@/shared/lib/calcularEdad";
import type { Bovino } from "@/entities/bovino/model/types";
import styles from "./pasoIngresarPeso.module.css";

interface Props {
  bovino: Bovino;
  peso: string;
  onPesoChange: (valor: string) => void;
  onConfirmar: () => void;
  onCancelar: () => void;
  submitting: boolean;
}

const numericId = (id: string) => id.replace(/\D/g, "").slice(-3);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PasoIngresarPeso = ({ bovino, peso, onPesoChange, onConfirmar, onCancelar, submitting }: Props) => {
  const pesoValido = peso !== "" && parseFloat(peso) > 0;

  return (
    <div className={styles["paso-peso"]}>
      <div className={styles["paso-peso__card"]}>
        <div className={styles["paso-peso__badge-num"]}>{numericId(bovino.id)}</div>
        <div className={styles["paso-peso__info"]}>
          <div className={styles["paso-peso__top"]}>
            <span className={styles["paso-peso__id"]}>{bovino.id}</span>
            <span className={styles["paso-peso__estado"]}>
              <span className={styles["paso-peso__dot"]} />
              {bovino.estado_actual.estado}
            </span>
          </div>
          <span className={styles["paso-peso__detalle"]}>
            {bovino.raza} · {calcularEdad(bovino.fecha_nacimiento)}
          </span>
        </div>
      </div>

      <div className={styles["paso-peso__campos"]}>
        <div className={styles["paso-peso__campo"]}>
          <label className={styles["paso-peso__label"]}>Peso actual</label>
          <div className={styles["paso-peso__actual"]}>
            <span className={styles["paso-peso__actual-valor"]}>
              {bovino.peso_actual ? <><strong>{bovino.peso_actual.peso}</strong>kg</> : "—"}
            </span>
          </div>
        </div>

        <div className={styles["paso-peso__flecha"]}>
          <ArrowIcon />
        </div>

        <div className={styles["paso-peso__campo"]}>
          <label className={styles["paso-peso__label"]}>Nuevo peso</label>
          <div className={styles["paso-peso__input-wrapper"]}>
            <input
              type="number"
              min="0"
              value={peso}
              onChange={(e) => onPesoChange(e.target.value)}
              placeholder="0"
              className={styles["paso-peso__input"]}
            />
            <span className={styles["paso-peso__unidad"]}>kg</span>
          </div>
        </div>
      </div>

      <div className={styles["paso-peso__acciones"]}>
        <button className={styles["paso-peso__btn-cancelar"]} onClick={onCancelar}>
          Cancelar
        </button>
        <button
          className={`${styles["paso-peso__btn-confirmar"]} ${pesoValido ? styles["paso-peso__btn-confirmar--activo"] : ""}`}
          onClick={onConfirmar}
          disabled={!pesoValido || submitting}
        >
          {submitting ? "Guardando..." : "Confirmar"}
        </button>
      </div>
    </div>
  );
};
