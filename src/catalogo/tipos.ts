export type Categoria = "cafe" | "acessorios" | "livros";

export interface Produto {
  id: number;
  nome: string;
  preco: number;
  categoria: Categoria;
  estoque: number;
  tags: string[];
}

export interface CategoriaInfo {
  id: Categoria;
  nome: string;
}

export interface FiltroProdutos {
  categoria?: string;
  busca?: string;
  somenteDisponiveis?: boolean;
  precoMaximo?: number;
}
