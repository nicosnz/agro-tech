import { useEffect, useState } from "react";
import styles from "./Toast.module.css";

const CheckIcon = () => (
  <svg className={styles["toast__icono"]} viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 10l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface Props {
  mensaje: string;
  duracion?: number;
  onClose: () => void;
}

export const Toast = ({ mensaje, duracion = 3000, onClose }: Props) => {
  const [saliendo, setSaliendo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSaliendo(true), duracion - 200);
    const close = setTimeout(onClose, duracion);
    return () => { clearTimeout(timer); clearTimeout(close); };
  }, [duracion, onClose]);

  return (
    <div className={`${styles["toast"]} ${saliendo ? styles["toast--saliendo"] : ""}`}>
      <CheckIcon />
      <span className={styles["toast__mensaje"]}>{mensaje}</span>
    </div>
  );
};
