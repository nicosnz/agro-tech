export const numericId = (id: string) => {
  const digits = id.replace(/\D/g, '').slice(-3);
  return `G-${digits.padStart(3, '0')}`;
};