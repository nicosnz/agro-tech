import styles from './pagination.module.css'

interface Props{
    pagina:number;
    hasNext:boolean;
    onNext: ()=> void;
    onPrev:()=>void;
}


export const Pagination = ({pagina,hasNext,onNext,onPrev}:Props) => {
  return (
    <div className={styles["ganado-table__pagination"]}>
            <button
              className={styles["pagination__btn"]}
              onClick={onPrev}
              disabled={pagina === 1}
            >
              ← Anterior
            </button>
            <span className={styles["pagination__info"]}>Página {pagina}</span>
            <button
              className={styles["pagination__btn"]}
              onClick={onNext}
              disabled={!hasNext}
            >
              Siguiente →
            </button>
          </div>
  )
}
