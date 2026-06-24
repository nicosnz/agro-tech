import type { Potrero } from "@/entities/potrero/model/types";
import styles from "./PasoSeleccionPotrero.module.css";

interface Props {
  potreros: Potrero[];
  loading: boolean;
  onSelect: (potrero: Potrero) => void;
}

const PlantIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22V12" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M12 12C12 12 8 10 6 6C10 6 13 9 12 12Z" fill="#16a34a" />
    <path d="M12 16C12 16 16 14 18 10C14 10 11 13 12 16Z" fill="#16a34a" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 4L10 8L6 12" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PasoSeleccionPotrero = ({ potreros, loading, onSelect }: Props) => {
  return (
    <div className={styles["paso-potrero"]}>
      <ul className={styles["paso-potrero__lista"]}>
        {loading && (
          <li className={styles["paso-potrero__empty"]}>Cargando potreros...</li>
        )}

        {!loading && potreros.length === 0 && (
          <li className={styles["paso-potrero__empty"]}>No se encontraron potreros.</li>
        )}

        {!loading && potreros.map((potrero) => (
          <li key={potrero.id}>
            <button className={styles["paso-potrero__item"]} onClick={() => onSelect(potrero)}>
              <div className={styles["paso-potrero__icono"]}>
                <PlantIcon />
              </div>
              <div className={styles["paso-potrero__info"]}>
                <span className={styles["paso-potrero__nombre"]}>{potrero.nombre}</span>
                <span className={styles["paso-potrero__detalle"]}>{potrero.ubicacion} · cap. {potrero.capacidad} animales</span>
              </div>
              <ArrowRightIcon />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
