export const formatFecha = (fecha: Date | string) => {
  const d = typeof fecha === 'string' ? fecha.replace(/-/g, '/') : fecha;
  return new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
};