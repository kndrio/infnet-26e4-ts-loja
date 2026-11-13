// @ts-check
// Código JavaScript legado: continua em .js, mas agora com checagem via JSDoc.

/**
 * @param {string} iso
 * @returns {string}
 */
export function formatarData(iso) {
  const data = new Date(iso);
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * @param {string} iso
 * @param {Date} [hoje]
 * @returns {number}
 */
export function diasDesde(iso, hoje = new Date()) {
  return Math.floor((hoje.getTime() - new Date(iso).getTime()) / 86_400_000);
}
