// Kiểm TƯƠNG ĐƯƠNG engine.js (JS) ↔ hàm Postgres của "bạn lớp thật" (mig nt_ban_that) + kịch bản giúp/trộm trong ROLLBACK.
// Chạy: node scripts/test-nt-ban.mjs   (cần DATABASE_URL trong .env; không ghi gì lại DB)
import pg from 'pg'; import fs from 'node:fs'; import vm from 'node:vm'

const G = 'C:/Users/WBPC/Desktop/BKERP/BKGame/NongTrai/js/'
const ctx = { window: {}, console, Math, Date, JSON, Object, Array, Set, String, Number }; vm.createContext(ctx)
for (const f of ['data.js', 'engine.js']) vm.runInContext(fs.readFileSync(G + f, 'utf8'), ctx)
const D = ctx.window.NT_DATA, E = ctx.window.NT_ENGINE

const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=') && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')] }))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
let loi = 0
const ok = (cond, m) => { if (!cond) { loi++; console.log('✗', m) } else console.log('✓', m) }

// mulberry32 — ngẫu nhiên có hạt giống để chạy lại được
let seed = 20261013; const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 }

// 1) bam
{
  const keys = []; for (let i = 0; i < 400; i++) keys.push(String(Math.floor(rnd() * 1e9)) + '|o' + Math.floor(rnd() * 12) + '|' + Math.floor(rnd() * 20000) + (rnd() < 0.5 ? '|le' : '|s' + Math.floor(rnd() * 20000)))
  const r = await q(`select k, public._nt_bam(k) v from unnest($1::text[]) k`, [keys])
  const sai = r.filter(x => Math.abs(x.v - E.bam(x.k)) > 1e-15)
  ok(sai.length === 0, `bam: ${keys.length} khoá khớp JS (lệch ${sai.length})`)
}

// 2) ttO — ô ngẫu nhiên
{
  const cayIds = Object.keys(D.RUONG); let n = 0, lech = 0, cin = 0
  for (let t = 0; t < 600; t++) {
    const id = cayIds[Math.floor(rnd() * cayIds.length)], C = D.RUONG[id], d0 = 20000 + Math.floor(rnd() * 40)
    const dn = d0 + Math.floor(rnd() * (C.ngay + 4))
    const tuoi = [], bat = []
    for (let d = d0; d < d0 + C.ngay + 2; d++) if (rnd() < 0.5) tuoi.push(d)
    for (let d = d0 + 1; d <= d0 + C.ngay; d++) if (rnd() < 0.15) bat.push(d)
    const r = { cay: id, d0, tuoi, bat, bon: rnd() < 0.4, trom: Math.floor(rnd() * 3), haiBan: rnd() < 0.3 ? { a: 1, b: 1 } : {} }
    const hat = String(Math.floor(rnd() * 1e9)), i = Math.floor(rnd() * 12), ngay0 = d0 - Math.floor(rnd() * 70)
    const key = hat + '|o' + i
    const js = E.ttO(r, key, dn, E.muaCua({ ngay0 }, d0).bonus)
    const tong = (r.trom || 0) + Object.values(r.haiBan).reduce((a, x) => a + x, 0)
    const rs = (await q(`select public._nt_o_tt($1::jsonb, $2, $3, public._nt_bonus_mua($4, $5)) r`, [JSON.stringify({ ...r, trom: tong }), key, dn, ngay0, d0]))[0].r
    n++
    const sau = js.sau
    const sameCommon = rs.tt === js.tt && rs.sau === sau
    let same = sameCommon
    if (js.tt === 'lon') same = same && rs.conNgay === js.conNgay && rs.tuoiHom === js.tuoiHom
    if (js.tt === 'chin') { cin++; same = same && rs.n === js.sl.n && rs.trom === js.trom && rs.con === js.con && rs.quaHan === js.quaHan && rs.tromDuoc === js.tromDuoc }
    if (!same) { lech++; if (lech <= 3) console.log('  lệch', JSON.stringify({ r, dn, key, js: { tt: js.tt, sau: js.sau, n: js.sl && js.sl.n, tromDuoc: js.tromDuoc }, rs })) }
  }
  ok(lech === 0, `ttO: ${n} ô ngẫu nhiên (${cin} ô chín) khớp JS (lệch ${lech})`)
}

// 3) kịch bản giúp / trộm — trong ROLLBACK
await c.query('begin')
try {
  const cap = (await q(`select hl.lop_id, array_agg(distinct hl.hoc_sinh_id) hs from hoc_sinh_lop hl join tai_khoan tk on tk.hoc_sinh_id = hl.hoc_sinh_id
                        join hoc_sinh h on h.id = hl.hoc_sinh_id and h.trang_thai = 'dang_hoc'
                        where hl.trang_thai = 'dang_hoc' group by hl.lop_id having count(distinct hl.hoc_sinh_id) >= 3 limit 1`))[0]
  const [A, B, X] = cap.hs
  const uid = async hs => (await q(`select id from tai_khoan where hoc_sinh_id = $1 limit 1`, [hs]))[0].id
  const as = async hs => { await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: await uid(hs), role: 'authenticated' })]) }
  const rpc = async (fn, ...a) => (await q(`select public.${fn}(${a.map((_, i) => '$' + (i + 1)).join(',')}) r`, a))[0].r
  const dn = (await q(`select public._nt_hom_nay() d`))[0].d
  await c.query(`delete from nt_luu where hoc_sinh_id = any($1)`, [[A, B, X]])
  // Vườn của B: ô0 lúa mì ĐÃ CHÍN từ hôm trước (d0 = dn-2, ngày 1 ⇒ chín dn-1, quá hạn); ô1 cà rốt đang lớn chưa tưới; ô2 ngô chín HÔM NAY (giờ vàng chủ)
  const hat = '123456789'
  const st = { v: 2, hat, ngay0: dn - 10, cap: 5, oMo: 4, ruong: [
    { cay: 'lua_mi', d0: dn - 2, tuoi: [dn - 2], bat: [], bon: false, trom: 0 },
    { cay: 'khoai_tay', d0: dn - 1, tuoi: [], bat: [], bon: false, trom: 0 },
    { cay: 'ngo', d0: dn - 2, tuoi: [dn - 2, dn - 1], bat: [], bon: false, trom: 0 },
    { cay: null }], vat: { ga: { con: [] }, bo: { con: [] } }, trangTri: [], thu: { cho: { tc: 0, d: -1 } } }
  await c.query(`insert into nt_luu(hoc_sinh_id, state) values ($1, $2)`, [B, JSON.stringify(st)])
  await as(A)
  const ds = await rpc('fn_nt_ban_ds')
  const b = ds.ban.find(x => x.id === B)
  ok(!!b, 'A thấy B trong danh sách bạn cùng lớp (B có vườn)')
  ok(!ds.ban.find(x => x.id === X), 'X chưa có vườn ⇒ không có trong danh sách')
  ok(ds.con_giup === 5 && ds.con_trom === 3, 'lượt đầu ngày: giúp 5 · trộm 3')
  // lúa mì ô0: trạng thái theo JS
  const js0 = E.ttO(st.ruong[0], hat + '|o0', dn, E.muaCua({ ngay0: st.ngay0 }, st.ruong[0].d0).bonus)
  console.log('  ô0 JS:', js0.tt, 'n=', js0.sl && js0.sl.n, 'tromDuoc=', js0.tromDuoc, 'quaHan=', js0.quaHan)
  const trom0 = await rpc('fn_nt_ban_trom', B, 0)
  const nChin = js0.sl.n
  if (js0.tromDuoc >= 1) ok(trom0.ok && (trom0.loai === 'trom' || trom0.loai === 'cho_duoi'), 'hái trộm ô0 (chín quá hạn): ' + JSON.stringify(trom0))
  else ok(!trom0.ok && trom0.loi === 'het_phan', 'ô0 quá ít quả ⇒ không ai hái được (n=' + nChin + '): ' + JSON.stringify(trom0))
  const trom0b = await rpc('fn_nt_ban_trom', B, 0)
  ok(!trom0b.ok && (trom0b.loi === 'da_hai' || trom0b.loi === 'het_phan'), 'hái lần 2 cùng ô bị chặn: ' + trom0b.loi)
  const trom2 = await rpc('fn_nt_ban_trom', B, 2)
  ok(!trom2.ok && trom2.loi === 'gio_vang_cua_chu', 'ô2 chín hôm nay là giờ vàng của chủ: ' + trom2.loi)
  const trom1 = await rpc('fn_nt_ban_trom', B, 1)
  ok(!trom1.ok && trom1.loi === 'chua_chin', 'ô1 chưa chín: ' + trom1.loi)
  const giup1 = await rpc('fn_nt_ban_giup', B, 1)
  ok(giup1.ok && giup1.loai === 'tuoi', 'giúp tưới ô1 chưa tưới: ' + JSON.stringify(giup1))
  const giup1b = await rpc('fn_nt_ban_giup', B, 1)
  ok(!giup1b.ok && giup1b.loi === 'khong_can', 'tưới lần 2 trong ngày ⇒ không cần: ' + giup1b.loi)
  ok(giup1.con_giup === 4, 'còn 4 lượt giúp')
  // X (không cùng lớp thật?) — X cùng lớp nhưng chưa có vườn
  const xv = await rpc('fn_nt_ban_vuon', X)
  ok(!xv.ok && xv.loi === 'chua_co_vuon', 'xem vườn bạn chưa chơi: ' + xv.loi)
  // người ngoài lớp
  const ngoai = (await q(`select h.id from hoc_sinh h where h.trang_thai='dang_hoc' and h.id <> all($1) and not exists (
      select 1 from hoc_sinh_lop x join hoc_sinh_lop y on y.lop_id = x.lop_id where x.hoc_sinh_id = $2 and y.hoc_sinh_id = h.id and x.trang_thai='dang_hoc' and y.trang_thai='dang_hoc') limit 1`, [[A, B, X], A]))[0]
  if (ngoai) { await c.query(`insert into nt_luu(hoc_sinh_id, state) values ($1, $2)`, [ngoai.id, JSON.stringify(st)]); const r = await rpc('fn_nt_ban_giup', ngoai.id, 1); ok(!r.ok && r.loi === 'khong_cung_lop', 'ngoài lớp bị từ chối: ' + r.loi) }
  // vườn B nhìn từ A: ô0 phải có daHai, ô1 có tuoi hôm nay
  const v = await rpc('fn_nt_ban_vuon', B)
  ok(v.ok && v.ruong[0].daHai === true, 'vườn B từ A: ô0 daHai')
  ok(v.ruong[1].tuoi.includes(dn), 'vườn B: ô1 đã có ngày tưới hộ hôm nay')
  const tong0 = v.ruong[0].trom
  // B nhận việc
  await as(B)
  const ve = await rpc('fn_nt_viec_ve_toi', 0)
  ok(ve.viec.length >= 2, 'B thấy ' + ve.viec.length + ' việc bạn đã làm lên vườn mình')
  const ve2 = await rpc('fn_nt_viec_ve_toi', ve.viec[ve.viec.length - 1].id)
  ok(ve2.viec.length === 0, 'lấy tiếp từ id cuối ⇒ 0 việc')
  // ô0 từ góc B: cùng tổng trộm (đã gộp)
  console.log('  ô0 trộm tổng =', tong0, '· trộm hụt chó =', trom0.loai === 'cho_duoi')
} finally { await c.query('rollback'); await c.end() }
console.log(loi ? `\n${loi} LỖI` : '\nTất cả khớp')
process.exit(loi ? 1 : 0)
