import { Badge } from "../../../../shared/ui/badge/Badge";



interface Props{
    estado:string;
}
const estadoStyle: Record<string, { bg: string; border: string; color: string; dot: string }> = {
  "Sano":           { bg: "#f0fdf4", border: "#86efac", color: "#15803d", dot: "#22c55e" },
  "Vendido":          { bg: "#f8fafc", border: "#cbd5e1", color: "#64748b", dot: "#94a3b8" },
  "En observacion":          { bg: "#fff1f2", border: "#fca5a5", color: "#dc2626", dot: "#ef4444" },
  "En tratamiento":   { bg: "#fffbeb", border: "#fcd34d", color: "#b45309", dot: "#f59e0b" },
};

export const BadgeEstado = ({estado}:Props) => {
    const cfg = estadoStyle[estado] ?? { bg: "#f3f4f6", border: "#d1d5db", text: "#374151", dot: "#9ca3af" };

  return <Badge estado={estado} bg={cfg.bg} border={cfg.border} color={cfg.color} dot={cfg.dot} />
}
