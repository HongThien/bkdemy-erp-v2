// CEO DUYỆT tab «Mức cao» của trang đề xuất (Thùy nói "ghi") ⇒ chuyển đề xuất chac='cao' (nguon 'ai') thành GÁN CHẮC.
//   node scripts/bdm-b3-duyet-cao.mjs --kho dai|hgt --khoi 9[,12…] [--chi <ds.json>] [--tru T1…,T1…] [--ghi]   (mặc định chạy thử, ROLLBACK)
// Tập câu = đúng tập tab «Mức cao» của bdm-b3-hgt-xem.mjs --hang: de_xuat chac 'cao' nguon 'ai' của câu còn sống thuộc khối (dạng cũ),
// chưa có gan_cau; --chi giới hạn theo danh sách đợt (trang dựng với --chi); --tru = câu CEO loại ra.
// Ghi *_bdm_gan_cau (nguon 'ai' — mức cao AI đã qua mắt CEO, hậu kiểm bằng Kiểm mẫu như mọi gán AI) rồi rút dòng đề xuất đó. 1 transaction.
import pg from 'pg'
import fs from 'node:fs'
process.loadEnvFile('.env')
const args = process.argv.slice(2)
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null }
const KHO = opt('--kho'), KHOI = (opt('--khoi') || '').split(',').filter(Boolean), GHI = args.includes('--ghi')
const CHI = opt('--chi') ? JSON.parse(fs.readFileSync(opt('--chi'), 'utf8')).cau.map((x) => x.ma_cau) : null
const TRU = (opt('--tru') || '').split(',').filter(Boolean)
if (!['dai', 'hgt'].includes(KHO) || !KHOI.length) { console.error('Dùng: --kho dai|hgt --khoi 9[,12] [--chi ds.json] [--tru …] [--ghi]'); process.exit(2) }
const T = KHO === 'dai'
  ? { cau: 'dai_cau_hoi', bd: 'dai_ban_do', gan: 'dai_bdm_gan_cau', dx: 'dai_bdm_de_xuat' }
  : { cau: 'hgt_cau_hoi', bd: 'hgt_ban_do', gan: 'hgt_bdm_gan_cau', dx: 'hgt_bdm_de_xuat' }
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL })
await c.connect()
try {
  await c.query('begin')
  const ds = (await c.query(`
    select x.ma_cau, x.dang_bai_id from ${T.dx} x
      join ${T.cau} h on h.ma_cau = x.ma_cau and h.xoa_at is null
      join ${T.bd} b on b.ma_dang = h.dang_chinh
     where b.khoi = any($1) and x.chac = 'cao' and x.nguon = 'ai'
       and not exists (select 1 from ${T.gan} g where g.ma_cau = x.ma_cau)
       and ($2::text[] is null or x.ma_cau = any($2)) and not (x.ma_cau = any($3))
     order by x.ma_cau`, [KHOI, CHI, TRU])).rows
  const g = await c.query(`insert into ${T.gan} (ma_cau, dang_bai_id, nguon)
    select t.ma, t.db, 'ai' from unnest($1::text[], $2::text[]) t(ma, db) on conflict (ma_cau) do nothing returning ma_cau`,
    [ds.map((r) => r.ma_cau), ds.map((r) => r.dang_bai_id)])
  const r = await c.query(`delete from ${T.dx} where ma_cau = any($1) and nguon = 'ai' and chac = 'cao'`, [g.rows.map((x) => x.ma_cau)])
  console.log(`${KHO} K${KHOI.join(',')}${CHI ? ' (--chi)' : ''}: mức cao ${ds.length} · gán chắc +${g.rowCount} · rút đề xuất ${r.rowCount}${TRU.length ? ` · loại ${TRU.length}` : ''}`)
  if (g.rowCount !== ds.length || r.rowCount !== ds.length) throw new Error('lệch số dòng')
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
