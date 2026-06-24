import { ProgressBar } from "@/shared/ui/progressBar/ProgressBar";
import { BadgeAlimento } from "../badgeAlimento/BadgeAlimento";
import type { TipoAlimento } from "../../model/types";
import styles from "./AlimentoCard.module.css";

interface Props {
  alimento: TipoAlimento;
  stockMaximo: number;
}

export const AlimentoCard = ({ alimento, stockMaximo }: Props) => {
  const porcentaje = stockMaximo > 0
    ? Math.round((alimento.cantidad_restante / stockMaximo) * 100)
    : 0;

  return (
    <div className={styles["alimento-card"]}>
      <div className={styles["alimento-card__header"]}>
        <span className={styles["alimento-card__nombre"]}>{alimento.nombre}</span>
        {alimento.precio > 0
          ? <span className={styles["alimento-card__precio"]}>Bs. {alimento.precio}/kg</span>
          : <span className={styles["alimento-card__sin-costo"]}>Sin costo</span>
        }
      </div>

      <BadgeAlimento disponible={alimento.disponible} />

      <p className={styles["alimento-card__descripcion"]}>{alimento.descripcion}</p>

      {alimento.disponible && (
        <div className={styles["alimento-card__stock"]}>
          <div className={styles["alimento-card__stock-row"]}>
            <span className={styles["alimento-card__stock-label"]}>Cantidad restante</span>
            <span className={styles["alimento-card__stock-valor"]}>{alimento.cantidad_restante} kg</span>
          </div>
          <ProgressBar porcentaje={porcentaje} />
        </div>
      )}
    </div>
  );
};
