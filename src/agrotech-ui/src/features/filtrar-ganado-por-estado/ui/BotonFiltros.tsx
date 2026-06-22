import styles from './botonFiltros.module.css'

interface Props {
  estados: string[];
  filtroActivo: string;
  onFiltrar: (estado: string) => void;
}

export const BotonFiltros = ({ estados, filtroActivo, onFiltrar }: Props) => {
  return (
    <div className={styles["filter-btns"]}>
      {estados.map((estado) => (
        <button
          key={estado}
          onClick={() => onFiltrar(estado)}
          className={`${styles["filter-btn"]} ${filtroActivo === estado ? styles["filter-btn--active"] : ""}`}
        >
          {estado}
        </button>
      ))}
    </div>
  );
};
