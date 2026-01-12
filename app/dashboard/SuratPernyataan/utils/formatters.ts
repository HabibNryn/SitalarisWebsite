export const formatDateForInput = (value: unknown): string => {
  if (typeof value !== 'string' || !value) return '';
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  } catch {
    return '';
  }
};