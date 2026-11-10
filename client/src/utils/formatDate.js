export const formatDate = (d) =>
  new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
