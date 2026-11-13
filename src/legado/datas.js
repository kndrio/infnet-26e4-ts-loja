export function formatarData(iso) {
  const data = new Date(iso);
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export function diasDesde(iso, hoje = new Date()) {
  return Math.floor((hoje - new Date(iso)) / 86_400_000);
}
