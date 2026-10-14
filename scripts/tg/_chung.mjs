// Dùng chung cho script bot Telegram TA (spec-bot-telegram-ta.md). Token đọc từ .env.local (TG_BOT_TOKEN) — không in ra.
import pg from 'pg'; import fs from 'fs';
const doc = (f) => { try { return fs.readFileSync(f, 'utf8') } catch { return '' } };
export const TOKEN = (process.env.TG_BOT_TOKEN || doc('.env.local').match(/^TG_BOT_TOKEN=(.*)$/m)?.[1] || '').trim().replace(/^['"]|['"]$/g, '');
if (!TOKEN) throw new Error('Thiếu TG_BOT_TOKEN trong .env.local');
export const tg = async (method, body) => {
  const r = await (await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body ?? {}) })).json();
  if (!r.ok) throw new Error(`Telegram ${method}: ${r.description}`);
  return r.result;
};
export async function db() {
  const env = doc('.env').match(/^DATABASE_URL=(.*)$/m)[1].replace(/^['"]|['"]$/g, '');
  const c = new pg.Client({ connectionString: env, ssl: { rejectUnauthorized: false } }); await c.connect(); return c;
}
