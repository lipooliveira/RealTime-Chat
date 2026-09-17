import { getTelegramConfig } from '../config.js';
import { money } from '../services/orders.js';

export async function sendSaleNotification(order: { publicId: string; productNameSnapshot: string; instagramUsername: string; amount: number; supplierCostSnapshot: number; grossProfitSnapshot: number }) {
  const { token, chatId } = await getTelegramConfig();
  if (!token || !chatId) throw new Error('Telegram não configurado');
  const text = `🟢 NOVA VENDA\n\nPedido: #${order.publicId}\n\nProduto:\n${order.productNameSnapshot}\n\nInstagram:\n@${order.instagramUsername}\n\nValor:\n${money(order.amount)}\n\nCusto:\n${money(order.supplierCostSnapshot)}\n\nLucro bruto:\n${money(order.grossProfitSnapshot)}\n\nPagamento:\n✅ APROVADO\n\nAtendimento:\n🟡 AGUARDANDO FORNECEDOR`;
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ chat_id: chatId, text }), signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Telegram respondeu HTTP ${response.status}`);
}
