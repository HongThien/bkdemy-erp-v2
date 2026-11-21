// MÁY KÝ form MCQ của câu CLONE (Thùy 21/11: clone không cần người duyệt) — kèm cổng hình thức + MẪU MÙ 10%.
//   node scripts/mcq-duyet-clone.mjs --khoi 6 [--ghi]     (không --ghi = thử rồi ROLLBACK)
// Điều kiện duyệt: câu clone đã duyệt · mcq-sinh --verify OK (cả --theo-dap-so) · qua cổng hình thức (lib/mcq-hinh-thuc.mjs).
// Sau khi ghi: in/ghi mẫu 10% (≥ 15 form) vào ra/mau-mu-<khối>.json để người/Opus kiểm MÙ về hình thức; mẫu lỗi >5% ⇒ gỡ cả lô.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import pg from 'pg'
import { loiHinhThuc } from './lib/mcq-hinh-thuc.mjs'
const arg = (k) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : null }
const GHI = process.argv.includes('--ghi'), KHOI = arg('--khoi'); if (!KHOI) throw new Error('thiếu --khoi')
const url = readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
const forms = await q(`select f.id, f.ma_cau, f.dap_an, f.lua_chon, h.noi_dung, d.dang_bai_id ndb from dai_cau_form_tn f
  join dai_cau_hoi h on h.ma_cau = f.ma_cau and h.xoa_at is null and h.da_duyet and h.parent_ma_cau is not null
  join bdm_cau_dang d on d.ma_cau = f.ma_cau and d.kho = 'dai' join bdm_ban_do b on b.ma_dang = d.dang_bai_id and b.khoi = $1
  where f.xoa_at is null and not f.da_duyet`, [KHOI])
mkdirSync('ra', { recursive: true })
const tmp = `ra/_cl${KHOI}.json`; writeFileSync(tmp, JSON.stringify(forms.map((x) => ({ ma_cau: x.ma_cau, dap_an: x.dap_an, lua_chon: x.lua_chon }))))
const ok = new Set()
for (const them of [[], ['--theo-dap-so']]) { let o; try { o = execFileSync('node', ['scripts/mcq-sinh.mjs', '--verify', tmp, '--thay', 'kiem', '--kho', 'dai', ...them], { encoding: 'utf8', maxBuffer: 64e6 }) } catch (e) { o = String(e.stdout ?? '') }; for (const m of o.matchAll(/^OK\s+(\S+)/gm)) ok.add(m[1]) }
let loiHT = 0; const dat = []
for (const x of forms) { if (!ok.has(x.ma_cau)) continue; if (loiHinhThuc(x.noi_dung, x.lua_chon.map((o) => o.text)).length) { loiHT++; continue } dat.push(x) }
console.log(`K${KHOI}: form clone chờ ${forms.length} · qua máy ${ok.size} · loại vì hình thức ${loiHT} · duyệt ${dat.length}`)
try {
  await q('begin')
  const [ad] = await q("select tk.id, tk.nhan_su_id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated' })])
  if (dat.length) console.log('duyệt', JSON.stringify((await q(`select fn_mcq_form_duyet_batch('dai', $1::uuid[], $2) r`, [dat.map((x) => x.id), ad.nhan_su_id]))[0].r))
  if (GHI) {
    await q('commit')
    const mau = dat.map((x) => [Math.random(), x]).sort((a, b) => a[0] - b[0]).slice(0, Math.max(15, Math.ceil(dat.length * 0.1))).map((p) => ({ ma: p[1].ma_cau, de: p[1].noi_dung, A: p[1].lua_chon[0].text, B: p[1].lua_chon[1].text, C: p[1].lua_chon[2].text, D: p[1].lua_chon[3].text }))
    const f = `ra/mau-mu-${KHOI}.json`; writeFileSync(f, JSON.stringify(mau, null, 1)); console.log('ĐÃ GHI · mẫu mù', mau.length, '→', f)
  } else { await q('rollback'); console.log('THỬ ⇒ ROLLBACK') }
} catch (e) { await q('rollback'); console.error(e.message); process.exitCode = 1 } finally { await c.end() }
