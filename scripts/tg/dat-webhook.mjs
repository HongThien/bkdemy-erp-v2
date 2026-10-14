// Đặt webhook bot Telegram TA. Chạy từ gốc repo:
//   node scripts/tg/dat-webhook.mjs --chi-secret            → chỉ tạo secret 'tg_webhook' trong DB (nếu chưa có)
//   node scripts/tg/dat-webhook.mjs https://<domain app TA>  → setWebhook tới <domain>/api/tg-webhook kèm secret
//   node scripts/tg/dat-webhook.mjs --xem                    → getWebhookInfo
// Secret chỉ nằm ở DB + Telegram, không ở git/Vercel (api/tg-webhook.mjs chuyển header cho fn_tg_nhan tự so).
import crypto from 'crypto';
import { tg, db } from './_chung.mjs';
const arg = process.argv[2];
if (arg === '--xem') { const i = await tg('getWebhookInfo'); console.log({ ...i, url: i.url || '(chưa có)' }); process.exit(); }
const c = await db();
let secret = (await c.query("select gia_tri from he_thong_bi_mat where khoa = 'tg_webhook'")).rows[0]?.gia_tri;
if (!secret) {
  secret = crypto.randomBytes(24).toString('hex');
  await c.query("insert into he_thong_bi_mat (khoa, gia_tri, ghi_chu) values ('tg_webhook', $1, 'Secret webhook bot Telegram TA (header X-Telegram-Bot-Api-Secret-Token)')", [secret]);
  console.log('Đã tạo secret tg_webhook trong DB.');
}
if (arg && arg.startsWith('https://')) {
  const url = arg.replace(/\/$/, '') + '/api/tg-webhook';
  await tg('setWebhook', { url, secret_token: secret, allowed_updates: ['message', 'edited_message', 'my_chat_member'], drop_pending_updates: false });
  console.log('Đã đặt webhook →', url);
}
await c.end();
