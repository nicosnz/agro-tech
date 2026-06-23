import styles from "./progressBar.module.css";

interface Props {
  porcentaje: number;
}

const colorPorPorcentaje = (p: number) => {
  if (p > 50) return "#4ADE80";
  if (p > 20) return "#f59e0b";
  return "#dc2626";
};

export const ProgressBar = ({ porcentaje }: Props) => {
  const pct   = Math.min(Math.max(porcentaje, 0), 100);
  const color = colorPorPorcentaje(pct);

  return (
    <div className={styles["progress-bar"]}>
      <div
        className={styles["progress-bar__fill"]}
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
};
