import { calcularFrete } from "../legado/frete-legado.js";

// Cupom (vem de public/dados/cupons.json), um dos três formatos:
//   { codigo, tipo: "percentual", percentual }
//   { codigo, tipo: "valorFixo", valor, minimo }
//   { codigo, tipo: "freteGratis" }
// MIGRAÇÃO: união discriminada + exaustividade com never.

export class Carrinho {
  constructor(ufDestino) {
    this.ufDestino = ufDestino;
    this.itens = [];
    this.cupom = null;
  }

  adicionar(quantidade, ...produtos) {
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

  remover(produtoId) {
    this.itens = this.itens.filter((item) => item.produtoId !== produtoId);
  }

  aplicarCupom(cupom) {
    this.cupom = cupom;
  }

  listar() {
    return this.itens;
  }

  resumo() {
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

  aplicar(cupom, subtotal, frete) {
    if (cupom === null) return { desconto: 0, frete };
    switch (cupom.tipo) {
      case "percentual":
        return { desconto: (subtotal * cupom.percentual) / 100, frete };
      case "valorfixo":
        return { desconto: subtotal >= cupom.minimo ? cupom.valor : 0, frete };
      case "freteGratis":
        return { desconto: 0, frete: 0 };
      default:
        return { desconto: 0, frete };
    }
  }
}
