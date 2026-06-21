export function calcularEdad(fechaNacimiento: Date): string {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);

  let años = hoy.getFullYear() - nacimiento.getFullYear();
  let meses = hoy.getMonth() - nacimiento.getMonth();

  if (meses < 0) { años--; meses += 12; }

  if (años === 0) return `${meses} mes${meses !== 1 ? "es" : ""}`;
  if (meses === 0) return `${años} año${años !== 1 ? "s" : ""}`;
  return `${años} año${años !== 1 ? "s" : ""} y ${meses} mes${meses !== 1 ? "es" : ""}`;
}