import { LabelStats } from "../../../../shared/ui/labelStats/LabelStats";
import type { Bovino } from "../../model/types";
import styles from './statsBovino.module.css'

interface Props{
    bovinos:Bovino[]
}


export const StastBovino = ({bovinos}:Props) => {
    const stats = [
        { label: "Total Ganado",   value: bovinos.length, color: "#111827" },
        { label: "Sanos",        value: bovinos.filter((b) => b.estado_actual.estado === "Sano").length,        color: "#15803d" },
        { label: "En tratamiento", value: bovinos.filter((b) => b.estado_actual.estado === "En tratamiento").length, color: "#b45309" },
        { label: "En observacion",       value: bovinos.filter((b) => b.estado_actual.estado === "En observacion").length,       color: "#dc2626" },
    ];
  return (
    <div className={styles["stats"]}>
          {stats.map((stat) => (
            <LabelStats key={stat.label} label={stat.label} value={stat.value} color={stat.color}/>
          ))}
    </div>
  )
}
