// Busca uma lista JSON da pasta public/dados (http://localhost:5173/dados/...).
const URL_DADOS = import.meta.env.VITE_URL_DADOS;

export async function buscarLista<T>(arquivo: string, validar: (valor: unknown) => valor is T[]): Promise<T[]> {
  const resposta = await fetch(`${URL_DADOS}/${arquivo}`);
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status} ao buscar ${arquivo}`);
  const dados: unknown = await resposta.json();
  if (!validar(dados)) throw new Error(`Formato inesperado ao buscar ${arquivo}`);
  return dados;
}
