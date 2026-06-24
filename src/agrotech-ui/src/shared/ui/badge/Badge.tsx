import styles from './Badge.module.css'
interface Props{
    estado:string;
    bg:string;
    border:string;
    color:string
    dot?:string;
}


export const Badge = ({estado,bg,border,color,dot}:Props) => {
  return (
    <span className={styles["estado-badge"]} style={{ background: bg, border: `1px solid ${border}`, color: color }}>
      {dot && <span className={styles["estado-badge__dot"]} style={{ background: dot }} />}
      {estado}
    </span>
  )
}
