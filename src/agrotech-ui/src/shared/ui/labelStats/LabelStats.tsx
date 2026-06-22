import styles from './labelStats.module.css'


interface Props{
    label:string
    value:number
    color:string
    unit?:string
}

export const LabelStats = ({label,color,value,unit}:Props) => {
  return (
        <div className={styles["stats__card"]}>
            <p className={styles["stats__label"]}>{label}</p>
            <p className={styles["stats__value"]} style={{ color:color }}>{value}{unit && ` ${unit}`}</p>
        </div>
    )
}
