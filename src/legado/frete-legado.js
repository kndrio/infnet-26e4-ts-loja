// Código JavaScript legado (sem tipos). Imagine uma lib antiga da empresa.
const TABELA = { RJ: 9.9, SP: 12.9, MG: 14.9 };

export function calcularFrete(uf, quantidadeItens) {
  const base = TABELA[uf] || 24.9;
  return base + Math.max(0, quantidadeItens - 1) * 2;
}

export const UFS_ATENDIDAS = Object.keys(TABELA);
