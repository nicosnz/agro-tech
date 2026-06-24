import styles from './BotonFiltros.module.css'

interface Props {
  estados: string[];
  filtroActivo: string;
  onFiltrar: (estado: string) => void;
}

export const BotonFiltros = ({ estados, filtroActivo, onFiltrar }: Props) => {
  return (
    <div className={styles["filters"]}>
      {estados.map((estado) => (
        <button
          key={estado}
          onClick={() => onFiltrar(estado)}
          className={`${styles["filters-btn"]} ${filtroActivo === estado ? styles["filters-btn--active"] : ""}`}
        >
          {estado}
        </button>
      ))}
    </div>
  );
};
