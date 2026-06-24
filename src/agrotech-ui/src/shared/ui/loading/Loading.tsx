import styles from './Loading.module.css'

export const Loading = () => {
  return (
    <div className={styles["loading"]}>
      <div className={styles["loading__spinner"]} />
      <span className={styles["loading__text"]}>Cargando...</span>
    </div>
  )
}
