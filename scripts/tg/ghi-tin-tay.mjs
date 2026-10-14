// Ghi TAY các tin Telegram còn trong hàng đợi của bot (getUpdates, ≤24h) vào DB qua fn_tg_nhan — idempotent.
// Chỉ dùng TRƯỚC khi webhook chạy (có webhook thì getUpdates bị Telegram khoá). Chạy từ gốc repo:
//   node scripts/tg/ghi-tin-tay.mjs
import { tg, db } from './_chung.mjs';
const c = await db();
const secret = (await c.query("select gia_tri from he_thong_bi_mat where khoa = 'tg_webhook'")).rows[0]?.gia_tri;
if (!secret) throw new Error("Chưa có secret 'tg_webhook' — chạy scripts/tg/dat-webhook.mjs --chi-secret trước");
const ups = await tg('getUpdates', { allowed_updates: ['message', 'edited_message', 'my_chat_member'] });
let tra = 0;
for (const u of ups) { const r = (await c.query('select fn_tg_nhan($1, $2::jsonb) r', [secret, u])).rows[0].r; if (r) { await tg('sendMessage', r); tra++; } }
const n = (await c.query('select count(*)::int n from tg_tin')).rows[0].n;
console.log(`Đã đưa ${ups.length} update vào DB (trả lời ${tra} tin riêng). tg_tin hiện có ${n} dòng.`);
await c.end();
