export function toISODate(d: Date) {
  // YYYY-MM-DD (no time)
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    .toISOString()
    .slice(0, 10);
}

export function formatDateLabel(date?: string) {
  return date ? new Date(date).toLocaleDateString() : '';
}
