// ===================== GRUPO A · CATÁLOGO =====================
// Produto: { id, nome, preco, categoria ("cafe" | "acessorios" | "livros"), estoque, tags }
// MIGRAÇÃO: transforme esse comentário em interface Produto.

export class Catalogo {
  constructor(produtos) {
    this.produtos = produtos;
  }

  get total() {
    return this.produtos.length;
  }

  buscarPorId(id) {
    return this.produtos.find((produto) => produto.id === id);
  }

  // filtro: { categoria?, busca?, somenteDisponiveis?, precoMaximo? }
  filtrar(filtro = {}) {
    const { categoria, busca, somenteDisponiveis, precoMaximo } = filtro;
    const termo = busca?.trim().toLowerCase() ?? "";
    return this.produtos.filter(
      (produto) =>
        (!categoria || produto.categoria === categoria) &&
        (termo === "" || produto.nome.toLowerCase().includes(termo)) &&
        (!somenteDisponiveis || produto.estoque > 0) &&
        (precoMaximo === undefined || produto.preco <= precoMaximo),
    );
  }

  ordenarPor(chave, lista = [...this.produtos]) {
    return lista.toSorted((a, b) => (a[chave] < b[chave] ? -1 : a[chave] > b[chave] ? 1 : 0));
  }

  faixaDePreco() {
    const precos = this.produtos.map((produto) => produto.preco);
    return [Math.min(...precos), Math.max(...precos)];
  }
}
