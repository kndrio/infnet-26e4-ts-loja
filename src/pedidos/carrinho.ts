import { calcularFrete } from "../legado/frete-legado.js";
import type { Produto } from "../catalogo/tipos.ts";
import type { Cupom, ItemCarrinho } from "./tipos.ts";

interface ResumoCarrinho {
  subtotal: number;
  desconto: number;
  frete: number;
  total: number;
  quantidadeItens: number;
  cupomAplicado: string | null;
}

export class Carrinho {
  ufDestino: string;
  itens: ItemCarrinho[];
  cupom: Cupom | null;

  constructor(ufDestino: string) {
    this.ufDestino = ufDestino;
    this.itens = [];
    this.cupom = null;
  }

  adicionar(quantidade: number, ...produtos: Produto[]): void {
    for (const produto of produtos) {
      if (quantidade <= 0 || produto.estoque < quantidade) continue;
      const existente = this.itens.find((item) => item.produtoId === produto.id);
      if (existente) {
        existente.quantidade += quantidade;
      } else {
        this.itens.push({ produtoId: produto.id, quantidade, produto: { nome: produto.nome, preco: produto.preco } });
      }
    }
  }

  remover(produtoId: number): void {
    this.itens = this.itens.filter((item) => item.produtoId !== produtoId);
  }

  aplicarCupom(cupom: Cupom | null): void {
    this.cupom = cupom;
  }

  listar(): ItemCarrinho[] {
    return this.itens;
  }

  resumo(): ResumoCarrinho {
    const subtotal = this.itens.reduce((soma, item) => soma + item.produto.preco * item.quantidade, 0);
    const quantidadeItens = this.itens.reduce((soma, item) => soma + item.quantidade, 0);
    const freteBase = quantidadeItens === 0 ? 0 : calcularFrete(this.ufDestino, quantidadeItens);
    const { desconto, frete } = this.aplicar(this.cupom, subtotal, freteBase);
    return {
      subtotal,
      desconto,
      frete,
      total: Math.max(0, subtotal - desconto + frete),
      quantidadeItens,
      cupomAplicado: this.cupom?.codigo ?? null,
    };
  }

  aplicar(cupom: Cupom | null, subtotal: number, frete: number): { desconto: number; frete: number } {
    if (cupom === null) return { desconto: 0, frete };
    switch (cupom.tipo) {
      case "percentual":
        return { desconto: (subtotal * cupom.percentual) / 100, frete };
      case "valorFixo":
        return { desconto: subtotal >= cupom.minimo ? cupom.valor : 0, frete };
      case "freteGratis":
        return { desconto: 0, frete: 0 };
      default: {
        const _exaustivo: never = cupom;
        return _exaustivo;
      }
    }
  }
}
