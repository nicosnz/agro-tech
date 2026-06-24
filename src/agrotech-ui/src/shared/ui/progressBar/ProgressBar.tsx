import { colorPorPorcentaje } from "@/shared/lib/colorPorcentaje";
import styles from "./ProgressBar.module.css";

interface Props {
  porcentaje: number;
}



export const ProgressBar = ({ porcentaje }: Props) => {
  const format   = Math.min(Math.max(porcentaje, 0), 100);
  const color = colorPorPorcentaje(format);

  return (
    <div className={styles["progress-bar"]}>
      <div
        className={styles["progress-bar__fill"]}
        style={{ width: `${format}%`, background: color }}
      />
    </div>
  );
};
