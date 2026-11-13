import type { FiltroProdutos, Produto } from "./tipos.ts";

export class Catalogo {
  produtos: Produto[];

  constructor(produtos: Produto[]) {
    this.produtos = produtos;
  }

  get total(): number {
    return this.produtos.length;
  }

  buscarPorId(id: number): Produto | undefined {
    return this.produtos.find((produto) => produto.id === id);
  }

  filtrar(filtro: FiltroProdutos = {}): Produto[] {
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

  ordenarPor(chave: keyof Produto, lista: Produto[] = [...this.produtos]): Produto[] {
    return lista.toSorted((a, b) => (a[chave] < b[chave] ? -1 : a[chave] > b[chave] ? 1 : 0));
  }

  faixaDePreco(): [number, number] {
    const precos = this.produtos.map((produto) => produto.preco);
    return [Math.min(...precos), Math.max(...precos)];
  }
}
