// MÁY GÁN KHUÔN 'dap_so' cho câu K6–12 chưa có khuôn (Thùy 26/10 "2.OK") — scripts/lib/khuon-dap-so.mjs.
//   node scripts/kho-khuon-gan-may.mjs [--out ds.json]   → chạy THỬ: insert trong 1 transaction rồi ROLLBACK, in số gán / bỏ theo nhánh × khối
//   node scripts/kho-khuon-gan-may.mjs --ghi             → như trên nhưng COMMIT (nguon = 'may'; trigger tự ghi kho_cau_khuon_log)
// Câu được gán khi ĐỦ cả hai nhân chứng độc lập:
//   ① so-vn.mjs docDanhSachSo đọc đáp số thành SỐ THUẦN (nguyên / thập phân, 1 hoặc nhiều số) — phân số, chữ, căn… ⇒ bỏ;
//   ② đúng cổng nhánh 'đáp số' của mcq-auto.mjs: sinhNhieuDapSoThucTe nhận dạng được, chuẩn hoá lại khớp đáp số kho,
//      kiemKeyVoiDapAn không báo lỗi.
// Thiếu một trong hai ⇒ KHÔNG ghi dòng (§1.5 thà bỏ trống) — câu vẫn đi khuôn chung như trước. Bỏ qua: câu trắc nghiệm gốc /
// Đúng-Sai (lua_chon | menh_de có sẵn — pipeline không nhận), câu không đáp số, câu chưa gán dạng bài NDB, câu đã có khuôn.
// Idempotent: on conflict do nothing — chạy lại chỉ gán câu mới.
import pg from 'pg'
import { readFileSync, writeFileSync } from 'node:fs'
import { KHUON_DAP_SO, coBangKhuon } from './lib/khuon-dap-so.mjs'
import { docDanhSachSo, kiemKeyVoiDapAn } from './lib/so-vn.mjs'
import { sinhNhieuDapSoThucTe, chuanHoaDapSoThucTe } from './lib/mini-dang.mjs'

const args = process.argv.slice(2)
const GHI = args.includes('--ghi')
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null }
const url = readFileSync(new URL('../.env', import.meta.url), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url, connectionTimeoutMillis: 20000 }); await c.connect()

const co = await coBangKhuon(c)
if (!co.dai || !co.hgt) { console.error('✖ Chưa có bảng dai_cau_khuon / hgt_cau_khuon (mig 202610261852) — áp migration trước.'); await c.end(); process.exit(1) }

// Lý do bỏ (1 chữ ký / câu) — null = gán được
function xet(q) {
  if (q.tn_goc) return 'trắc nghiệm gốc / Đúng-Sai'
  if (!q.dap_an || !String(q.dap_an).trim()) return 'không có đáp số'
  if (!docDanhSachSo(String(q.dap_an).replace(/\$/g, ''), { thapPhan: true })) return 'đáp số không phải số thuần'
  const ctx = { dang: KHUON_DAP_SO, noiDung: q.noi_dung }
  let res; try { res = sinhNhieuDapSoThucTe(q.dap_an, null, ctx) } catch { res = null }
  if (!res?.text) return 'máy không nhận dạng được đáp số'
  const cText = chuanHoaDapSoThucTe(res.text, KHUON_DAP_SO)
  if (cText !== chuanHoaDapSoThucTe(q.dap_an, KHUON_DAP_SO)) return 'máy đọc lại ≠ đáp số kho'
  if (kiemKeyVoiDapAn({ dapAn: q.dap_an, key: cText, textDung: res.text, dang: KHUON_DAP_SO }).length) return 'nhân chứng so-vn báo đọc sai'
  return null
}

const bang = {}, gan = { dai: [], hgt: [] }, chiTiet = []
for (const kho of ['dai', 'hgt']) {
  const { rows } = await c.query(`
    select q.ma_cau, q.dang_chinh, q.dap_an, q.noi_dung, (q.lua_chon is not null or q.menh_de is not null) as tn_goc, b.khoi, d.dang_bai_id
    from ${kho}_cau_hoi q
    join bdm_cau_dang d on d.ma_cau = q.ma_cau and d.kho = '${kho}'
    join bdm_ban_do b on b.ma_dang = d.dang_bai_id
    where q.xoa_at is null and b.khoi in ('6','7','8','9','10','11','12')
      and not exists (select 1 from ${kho}_cau_khuon k where k.ma_cau = q.ma_cau)
    order by b.khoi::int, q.ma_cau limit 100000`)
  for (const q of rows) {
    const ly = xet(q), k = `${kho}\tK${q.khoi}`
    const o = (bang[k] ??= { tong: 0, gan: 0, ma_cho: 0 }); o.tong++; if (/0{6}$/.test(q.dang_chinh ?? '')) o.ma_cho++
    if (ly) o[ly] = (o[ly] ?? 0) + 1
    else { o.gan++; gan[kho].push(q.ma_cau) }
    chiTiet.push({ kho, khoi: q.khoi, ma_cau: q.ma_cau, dang_bai: q.dang_bai_id, dap_an: q.dap_an, gan: !ly, ly_do: ly })
  }
}

console.log('Nhánh × khối — câu chưa có khuôn (đã gán dạng bài NDB): tổng · gán · lý do bỏ')
for (const [k, o] of Object.entries(bang)) {
  const { tong, gan: g, ma_cho, ...ly } = o
  console.log(`  ${k}: ${tong} (mã chờ ${ma_cho}) · GÁN ${g} · bỏ ${tong - g}${Object.keys(ly).length ? '  ' + JSON.stringify(ly) : ''}`)
}
const tong = (kho) => Object.entries(bang).filter(([k]) => k.startsWith(kho)).reduce((a, [, o]) => a + o.gan, 0)
console.log(`Tổng GÁN: dai ${tong('dai')} · hgt ${tong('hgt')}`)

await c.query('begin')
try {
  let n = 0
  for (const kho of ['dai', 'hgt']) {
    if (!gan[kho].length) continue
    const r = await c.query(`insert into ${kho}_cau_khuon (ma_cau, khuon, nguon) select unnest($1::text[]), $2, 'may' on conflict (ma_cau) do nothing`, [gan[kho], KHUON_DAP_SO])
    n += r.rowCount
  }
  const log = (await c.query(`select count(*)::int n from kho_cau_khuon_log where khuon_moi = $1 and at >= now() - interval '1 minute'`, [KHUON_DAP_SO])).rows[0].n
  if (GHI) { await c.query('commit'); console.log(`\n✅ ĐÃ GHI ${n} dòng khuôn '${KHUON_DAP_SO}' (nguon='may') · log ${log}`) }
  else { await c.query('rollback'); console.log(`\n(chạy thử) insert ${n} dòng · log ${log} ⇒ ROLLBACK — thêm --ghi để ghi thật`) }
} catch (e) { await c.query('rollback'); console.error('✖ rollback:', e.message); process.exitCode = 1 }
await c.end()
if (opt('--out')) { writeFileSync(opt('--out'), JSON.stringify(chiTiet, null, 1), 'utf8'); console.log('→', opt('--out')) }
