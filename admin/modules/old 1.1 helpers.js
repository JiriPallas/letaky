export function isTodayInRange(from, to) {
  const today = new Date().toISOString().split("T")[0];
  return from <= today && today <= to;
}

export function isActive(item) {
  const today = new Date().toISOString().split("T")[0];
  return item.archive !== true && item.toDate >= today;
}

export function isArchived(item) {
  const today = new Date().toISOString().split("T")[0];
  return item.archive === true || item.toDate < today;
}
