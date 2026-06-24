import { LabelStats } from "@/shared/ui/labelStats/LabelStats";
import styles from './StatsPesajes.module.css'
import type { Bovino } from "@/entities/bovino/model/types"

interface Props{
    bovinos:Bovino[]
}

type Stats = {
    label:string;
    value:number;
    unit?:string;
    color:string;
}
export const StatsPesajes = ({bovinos}:Props) => {
    const conAmbos = bovinos.filter((b) => b.peso_actual && b.peso_anterior);

    const promedio = bovinos.length > 0
        ? Math.round(bovinos.reduce((sum, b) => sum + (b.peso_actual ? parseFloat(b.peso_actual.peso) : 0), 0) / bovinos.length)
        : 0;

    const stats: Stats[] = [
        { label: "Promedio de peso", value: promedio, unit: "kg", color: "#111827" },
        { label: "Ganando peso",     value: conAmbos.filter((b) => parseFloat(b.peso_actual!.peso) > parseFloat(b.peso_anterior!.peso)).length, color: "#15803d" },
        { label: "Perdiendo peso",   value: conAmbos.filter((b) => parseFloat(b.peso_actual!.peso) < parseFloat(b.peso_anterior!.peso)).length, color: "#dc2626" },
        { label: "Sin variación",    value: conAmbos.filter((b) => parseFloat(b.peso_actual!.peso) === parseFloat(b.peso_anterior!.peso)).length, color: "#6b7280" },
    ];

    return (
        <div className={styles['stats-pesaje']}>
            {stats.map((stat) => (
                <LabelStats key={stat.label} label={stat.label} value={stat.value} color={stat.color} unit={stat.unit} />
            ))}
        </div>
    )
}
