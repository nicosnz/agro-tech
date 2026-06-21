import styles from './error.module.css'

interface Props{
    error:string;
}

export const Error = ({error}:Props) => {
  return (
    <div className={styles["error"]}>{error}</div>
  )
}
