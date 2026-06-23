import { Badge } from "@/shared/ui/badge/Badge";

interface Props {
  disponible: boolean;
}

const ESTILOS = {
  disponible: { bg: "#f0fdf4", border: "#86efac", color: "#15803d" },
  sinStock:   { bg: "#fff1f2", border: "#fca5a5", color: "#dc2626" },
};

export const BadgeAlimento = ({ disponible }: Props) => {
  const cfg = disponible ? ESTILOS.disponible : ESTILOS.sinStock;
  return (
    <Badge
      estado={disponible ? "Disponible" : "No disponible"}
      bg={cfg.bg}
      border={cfg.border}
      color={cfg.color}
    />
  );
};
