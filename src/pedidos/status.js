// ===================== GRUPO B · PEDIDOS =====================
// Status possíveis: "pendente" | "pago" | "enviado" | "entregue" | "cancelado"
// MIGRAÇÃO: Etapa 8 — enum ou objeto "as const"?

export const StatusPedido = {
  Pendente: "pendente",
  Pago: "pago",
  Enviado: "enviado",
  Entregue: "entregue",
  Cancelado: "cancelado",
};

const ROTULOS = {
  pendente: "⏳ Pendente",
  pago: "💳 Pago",
  enviado: "🚚 Enviado",
  entregue: "✅ Entregue",
  cancelado: "❌ Cancelado",
};

export function rotuloStatus(status) {
  return ROTULOS[status];
}

export function proximoStatus(status) {
  switch (status) {
    case StatusPedido.Pendente:
      return StatusPedido.Pago;
    case StatusPedido.Pago:
      return StatusPedido.Enviado;
    case StatusPedido.Enviado:
      return StatusPedido.Entregue;
    case StatusPedido.Entregue:
      return null;
  }
}
