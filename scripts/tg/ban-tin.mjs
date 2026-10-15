// Bản tin 08:00 — xem / gửi thử (spec-bot-telegram-ta.md §3.1). Chạy từ gốc repo:
//   node scripts/tg/ban-tin.mjs --xem [YYYY-MM-DD]                 → in chữ bản tin ra màn hình (không gửi)
//   node scripts/tg/ban-tin.mjs --gui-rieng "Đào Xuân Thùy"        → gửi CẢ bản tin vào chat riêng của người đó (đã nối Telegram), KHÔNG ghi tg_ban_tin
//   node scripts/tg/ban-tin.mjs --dang                             → đăng thật vào các nhóm đã bật (= cron 08:00)
//   thêm --mig <file.sql>: áp migration trong transaction rồi ROLLBACK (thử trước khi áp thật; không dùng với --dang)
import fs from 'fs';
import { tg, db } from './_chung.mjs';
import { dungBanTin, dangBanTin } from '../../api/_tg_lib.mjs';
const a = process.argv.slice(2);
const lay = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : undefined };
const c = await db();
const mig = lay('--mig');
if (mig) { if (a.includes('--dang')) throw new Error('--mig chỉ dùng để xem/gửi thử'); await c.query('begin'); await c.query(fs.readFileSync(mig, 'utf8')); }
const secret = (await c.query("select gia_tri from he_thong_bi_mat where khoa = 'push_cron'")).rows[0].gia_tri;
const rpc = async (fn, args) => {
  const ks = Object.keys(args); const r = await c.query(`select ${fn}(${ks.map((k, i) => `${k} => $${i + 1}`).join(', ')}) r`, ks.map((k) => args[k] && typeof args[k] === 'object' ? JSON.stringify(args[k]) : args[k]));
  return r.rows[0].r;
};
try {
  if (a.includes('--dang')) { console.log(await dangBanTin({ rpc, tg, secret })); }
  else {
    const ngay = a.find((x) => /^\d{4}-\d{2}-\d{2}$/.test(x)) ?? null;
    const d = await rpc('fn_tg_ban_tin', { p_secret: secret, p_ngay: ngay });
    const { dau, tin } = dungBanTin(d);
    const ai = lay('--gui-rieng');
    if (ai) {
      const r = (await c.query("select l.tg_user_id from tg_lien_ket l join nhan_su n on n.id = l.nhan_su_id where l.den_at is null and n.ho_ten = $1", [ai])).rows[0];
      if (!r) throw new Error(`${ai} chưa nối Telegram`);
      await tg('sendMessage', { chat_id: r.tg_user_id, text: '🧪 <b>BẢN XEM TRƯỚC</b> — bản tin 08:00 sẽ đăng vào nhóm như dưới đây (chưa đăng thật).', parse_mode: 'HTML' });
      for (const t of [dau, ...tin.map((x) => x.text)]) { await tg('sendMessage', { chat_id: r.tg_user_id, text: t, parse_mode: 'HTML', disable_web_page_preview: true }); await new Promise((s) => setTimeout(s, 400)); }
      console.log(`Đã gửi ${1 + tin.length} tin vào chat riêng của ${ai}.`);
    } else {
      console.log(dau.replace(/<[^>]+>/g, '')); for (const t of tin) console.log('\n' + t.text.replace(/<[^>]+>/g, ''));
      console.log(`\n— ${tin.length} TA · tin dài nhất ${Math.max(...tin.map((t) => t.text.length))} ký tự (giới hạn 4096)`);
    }
  }
} finally { if (mig) await c.query('rollback'); await c.end(); }
