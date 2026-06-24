import { LabelStats } from "@/shared/ui/labelStats/LabelStats";
import styles from './StatsBovino.module.css'
import type { Bovino } from "../../model/types";

interface Props{
    bovinos:Bovino[]
}

type Stats = {
  label:string;
  value:number;
  color:string;
}

export const StatsBovino = ({bovinos}:Props) => {
    const stats:Stats[] = [
        { label: "Total Ganado",   value: bovinos.length, color: "#111827" },
        { label: "Sanos",        value: bovinos.filter((b) => b.estado_actual.estado === "Sano").length,        color: "#15803d" },
        { label: "En tratamiento", value: bovinos.filter((b) => b.estado_actual.estado === "En tratamiento").length, color: "#b45309" },
        { label: "En observacion",       value: bovinos.filter((b) => b.estado_actual.estado === "En observacion").length,       color: "#dc2626" },
    ];
  return (
    <div className={styles["stats-bovino"]}>
          {stats.map((stat) => (
            <LabelStats key={stat.label} label={stat.label} value={stat.value} color={stat.color}/>
          ))}
    </div>
  )
}
