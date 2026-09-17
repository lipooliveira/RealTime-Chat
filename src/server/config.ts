import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
const value = (input: string | undefined | null) => input?.trim() || '';
const setting = async (key: string) => value((await prisma.appSetting.findUnique({ where: { key } }))?.value);
export const maskSecret = (secret?: string | null) => {
  const current = value(secret);
  return current ? `${'•'.repeat(Math.max(0, current.length - 4))}${current.slice(-4)}` : '';
};

/** Database values take precedence; blank database values intentionally fall back to .env. */
export async function getMercadoPagoConfig() {
  const [dbAccessToken, dbPublicKey, dbEnvironment] = await Promise.all([
    setting('mp_access_token'), setting('mp_public_key'), setting('mp_environment'),
  ]);
  return {
    accessToken: dbAccessToken || value(process.env.MERCADOPAGO_ACCESS_TOKEN),
    publicKey: dbPublicKey || value(process.env.MERCADOPAGO_PUBLIC_KEY),
    environment: dbEnvironment === 'production' ? 'production' : 'test',
    webhookSecret: value(process.env.MERCADOPAGO_WEBHOOK_SECRET),
  } as const;
}
export async function getTelegramConfig() {
  const [dbToken, dbChatId] = await Promise.all([setting('telegram_bot_token'), setting('telegram_chat_id')]);
  return { token: dbToken || value(process.env.TELEGRAM_BOT_TOKEN), chatId: dbChatId || value(process.env.TELEGRAM_CHAT_ID) };
}
