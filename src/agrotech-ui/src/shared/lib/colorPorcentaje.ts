export const colorPorPorcentaje = (p: number) => {
  if (p > 50) return "#4ADE80";
  if (p > 20) return "#f59e0b";
  return "#dc2626";
};