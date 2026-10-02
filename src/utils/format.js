const LOCALE = "en-KE";

export const formatDate = (value, options = { day: "numeric", month: "short", year: "numeric" }) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString(LOCALE, options);
};

/** "12 - 14 Oct 2026", "30 Oct - 2 Nov 2026" or a single date. */
export const formatDateRange = (start, end) => {
  const a = new Date(start);
  const b = new Date(end || start);
  if (Number.isNaN(a.getTime())) return "";
  if (Number.isNaN(b.getTime()) || a.toDateString() === b.toDateString()) return formatDate(a);
  const sameMonth = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  const first = sameMonth ? a.getDate() : formatDate(a, { day: "numeric", month: "short" });
  return `${first} - ${formatDate(b)}`;
};

export const formatKES = (amount) =>
  amount || amount === 0 ? `KES ${Number(amount).toLocaleString(LOCALE)}` : "";

export const daysUntil = (value) =>
  Math.ceil((new Date(value).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
