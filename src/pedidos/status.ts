import { StatusPedido } from "./tipos.ts";

const ROTULOS: Record<StatusPedido, string> = {
  pendente: "⏳ Pendente",
  pago: "💳 Pago",
  enviado: "🚚 Enviado",
  entregue: "✅ Entregue",
  cancelado: "❌ Cancelado",
};

export function rotuloStatus(status: StatusPedido): string {
  return ROTULOS[status];
}

export function proximoStatus(status: StatusPedido): StatusPedido | null {
  switch (status) {
    case StatusPedido.Pendente:
      return StatusPedido.Pago;
    case StatusPedido.Pago:
      return StatusPedido.Enviado;
    case StatusPedido.Enviado:
      return StatusPedido.Entregue;
    case StatusPedido.Entregue:
      return null;
    case StatusPedido.Cancelado:
      return null;
  }
}
