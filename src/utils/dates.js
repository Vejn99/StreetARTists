export function generateDateLabels(daysAgo = 7) {
  const labels = [];

  for (let i = 0; i < daysAgo; i++) {
    const now = new Date();

    const startDate = now.getDate();

    const offsetDate = now.setDate(startDate - i);

    const formattedDate = formatDate(offsetDate);
    labels.push(formattedDate);
  }

  return labels;
}

export function formatDate(dateUnix) {
  const date = new Date(dateUnix);

  return date.toLocaleDateString("en-gb");
}
