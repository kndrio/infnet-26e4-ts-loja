// Busca uma lista JSON da pasta public/dados (http://localhost:5173/dados/...).
// MIGRAÇÃO: o que volta do fetch é "qualquer coisa". No TS: unknown + validação.
const URL_DADOS = import.meta.env.VITE_URL_DADOS;

export async function buscarLista(arquivo) {
  const resposta = await fetch(`${URL_DADOS}/${arquivo}`);
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status} ao buscar ${arquivo}`);
  return resposta.json();
}
