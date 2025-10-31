export function formatDatetime(date: Date): string {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);
  const lastWeek = new Date(now);
  lastWeek.setDate(now.getDate() - 7);

  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();
  const isNextWeek = date > now && date <= nextWeek;
  const isLastWeek = date < now && date >= lastWeek;

  const timeString = date
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
  const dayOfMonth = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const year = date.getFullYear();

  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  if (isToday) return `today at ${timeString}`;
  if (isYesterday) return `yesterday at ${timeString}`;
  if (isTomorrow) return `tomorrow at ${timeString}`;
  if (isNextWeek)
    return `next week ${dayOfWeek} ${getOrdinal(dayOfMonth)} at ${timeString}`;
  if (isLastWeek)
    return `last week ${dayOfWeek} ${getOrdinal(dayOfMonth)} at ${timeString}`;

  return `${month} ${getOrdinal(dayOfMonth)} ${year} at ${timeString}`;
}
