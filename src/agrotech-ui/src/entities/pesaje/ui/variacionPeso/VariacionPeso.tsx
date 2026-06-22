import type { Peso } from "@/entities/pesaje/model/types";
import styles from "./variacionPeso.module.css";

interface Props {
  actual: Peso | null;
  anterior: Peso | null;
}

const ArrowUpIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 10V2M6 2L2 6M6 2L10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 2V10M6 10L2 6M6 10L10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const VariacionPeso = ({ actual, anterior }: Props) => {
  if (!actual || !anterior) return <span className={styles["variacion--neutral"]}>— Sin datos</span>;

  const pesoActual   = parseFloat(actual.peso);
  const pesoAnterior = parseFloat(anterior.peso);
  const diff         = pesoActual - pesoAnterior;
  const pct          = ((diff / pesoAnterior) * 100).toFixed(1);

  if (diff === 0) return <span className={styles["variacion--neutral"]}>— Sin cambio</span>;

  const subiendo = diff > 0;

  return (
    <span className={subiendo ? styles["variacion--sube"] : styles["variacion--baja"]}>
      {subiendo ? <ArrowUpIcon /> : <ArrowDownIcon />}
      {subiendo ? "+" : ""}{diff} kg
      <span className={styles["variacion__pct"]}>({subiendo ? "+" : ""}{pct}%)</span>
    </span>
  );
};
