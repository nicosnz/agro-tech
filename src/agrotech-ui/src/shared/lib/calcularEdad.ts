export function calcularEdad(fechaNacimiento: Date): string {
  const diff = Date.now() - new Date(fechaNacimiento).getTime();
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  if (years >= 1) return `${years} año${years !== 1 ? "s" : ""}`;
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
  return `${months} mes${months !== 1 ? "es" : ""}`;
}