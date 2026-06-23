import { AlimentoCard } from "@/entities/tipoAlimento/ui/alimentoCard/AlimentoCard";
import { Loading } from "@/shared/ui/loading/Loading";
import { Error } from "@/shared/ui/error/Error";
import { useAlimentoGrid } from "../model/useAlimentoGrid";
import styles from "./alimentoGrid.module.css";

export const AlimentoGrid = () => {
  const { alimentos, stockMaximo, loading, error } = useAlimentoGrid();

  if (loading) return <Loading />;
  if (error)   return <Error error={error} />;

  return (
    <div className={styles["alimento-grid"]}>
      {alimentos.map((alimento) => (
        <AlimentoCard
          key={alimento.id}
          alimento={alimento}
          stockMaximo={stockMaximo}
        />
      ))}
    </div>
  );
};
