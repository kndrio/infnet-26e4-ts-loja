export const StatusPedido = {
  Pendente: "pendente",
  Pago: "pago",
  Enviado: "enviado",
  Entregue: "entregue",
  Cancelado: "cancelado",
} as const;

export type StatusPedido = (typeof StatusPedido)[keyof typeof StatusPedido];

export interface ItemPedido {
  produtoId: number;
  quantidade: number;
}

export interface Pedido {
  id: string;
  cliente: string;
  status: StatusPedido;
  itens: ItemPedido[];
  criadoEm: string;
}

export type Cupom =
  | { codigo: string; tipo: "percentual"; percentual: number }
  | { codigo: string; tipo: "valorFixo"; valor: number; minimo: number }
  | { codigo: string; tipo: "freteGratis" };

export interface ItemCarrinho {
  produtoId: number;
  quantidade: number;
  produto: { nome: string; preco: number };
}
