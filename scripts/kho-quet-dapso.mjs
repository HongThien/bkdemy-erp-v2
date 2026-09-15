// QUÉT ĐÁP SỐ TOÀN KHO — MỨC A (máy tính, spec-kho-chuan.md §2) bằng bộ tính mcq-auto.tinh().
//   node scripts/kho-quet-dapso.mjs [--kho dai] [--out lech.json]
//        → CHỈ ĐỌC: thống kê phủ/khớp/lệch trên MỌI dạng máy tính được (như bản 09/09) + bản nháp của --ghi
//          (whitelist: sẽ ký bao nhiêu, nghi bao nhiêu, liệt kê câu nghi).
//   node scripts/kho-quet-dapso.mjs --ghi [--kho dai] [--out kq.json]
//        → GHI kiem_may cho câu thuộc WHITELIST dạng (đáp số = giá trị biểu thức), 1 transaction:
//          khớp ⇒ kiem_may='khop', da_duyet=true, duyet_nguon='may' (câu người đã ký: giữ 'nguoi', chỉ thêm kiem_may)
//          lệch ⇒ kiem_may='nghi' + kiem_may_ghi "máy X ≠ kho Y" — KHÔNG đụng da_duyet/dap_an (AI/máy chỉ được BÁO,
//                 không sửa kho); cột generated kho_chuan tự rút câu cũ 'nghi' khỏi HS.
//          Chỉ ghi dòng máy chưa kiểm hoặc máy tự kiểm lần trước (kiem_may_boi null | 'mcq-auto') — không đè người/Claude.
//          Idempotent: chạy lại chỉ đổi dòng có kết quả khác.
//
// VÌ SAO whitelist theo DẠNG chứ không "cứ máy tính được là ký": lần quét đầu (09/09) 627 "lệch" phần lớn BÁO GIẢ —
// toán có lời (máy vớ 1 số trong đề), đặt tính chia (kho ghi thương + dư / làm tròn), quy đồng (đáp số là cặp),
// làm tròn, đổi đơn vị, lớp 6 viết phép nhân bằng dấu chấm. Máy chỉ đáng tin khi ĐÁP SỐ = GIÁ TRỊ BIỂU THỨC trong đề.
// Dạng loại ra và lý do (đối chiếu bằng mẫu thật khi quét 08/09):
//   T103020101 (2 phép tính/câu → đáp số là cặp) · T104040105, T105040107 (đơn vị đo) · T14T040201, T105010201,
//   T105040203 (phép chia: dư / thương làm tròn) · T105020102 (quy đồng) · 0770201102 (làm tròn) · T1077030101 (nhận diện).
import pg from 'pg'
import { readFileSync, writeFileSync } from 'node:fs'
import { tinh } from './mcq-auto.mjs'
import { parseHuuTi } from './lib/huuti.mjs'

const args = process.argv.slice(2)
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d }
const kho = opt('--kho', 'dai')
const GHI = args.includes('--ghi')

// WHITELIST dạng máy được ký (kho Đại). `cham`: dấu chấm giữa 2 số = phép NHÂN (lớp 6 số tự nhiên, lớp 8 hằng đẳng thức).
const C = { chamLaNhan: true }
const WHITELIST = {
  // K3–K4: cộng trừ số tự nhiên, tính thuận tiện, nhân
  T103020103: {}, T104020101: {}, T104020102: {}, T104020103: {}, T104020104: {},
  T14T040101: {}, T14T040102: {}, T14T040103: {},
  // K5: biểu thức số tự nhiên, phân số, hỗn số, số thập phân (KHÔNG chia đặt tính, KHÔNG quy đồng, KHÔNG đơn vị)
  T105010202: {}, T105010203: {}, T105020201: {}, T105020202: {}, T105020203: {}, T105020204: {},
  T105030101: {}, T105030201: {}, T105030202: {}, T105030203: {}, T105040103: {}, T105040201: {}, T105040202: {}, T105040204: {},
  T15T020101: {}, T15T020102: {},
  // K6: số tự nhiên — dấu chấm là nhân
  T106020202: C, T106020203: C, T106020301: C, T106020302: C, T106020303: C,
  T106020401: C, T106020402: C, T106020403: C, T106020501: C, T106020503: C,
  // K7: số hữu tỉ (tính, tìm x, luỹ thừa, thứ tự phép tính)
  T107010201: {}, T107010202: {}, T107010203: {}, T107010206: {}, T107010207: {}, T107010301: {},
  T107010401: {}, T107010403: {}, T107010404: {}, T10770330201: {}, T107703330301: {},
  // K8–K9
  T108020402: C, T109020101: {}, T109020102: {},
}

const url = readFileSync(new URL('../.env', import.meta.url), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1]
const c = new pg.Client({ connectionString: url, connectionTimeoutMillis: 20000 }); await c.connect()
const { rows } = await c.query(`select q.ma_cau, q.dang_chinh, b.khoi, b.ten_dang, q.noi_dung, q.dap_an, q.nguon, q.nguon_giai, q.da_duyet,
    q.kiem_may, q.kiem_may_boi, q.kiem_may_ghi
  from ${kho}_cau_hoi q left join ${kho}_ban_do b on b.ma_dang = q.dang_chinh
  where q.xoa_at is null and q.dap_an is not null and q.dap_an <> ''`)

const tk = { tong: rows.length, ds_parse: 0, may_tinh: 0, khop: 0, lech: 0 }
const byKhoi = {}, byDang = {}, lech = []
const wl = { khop: [], nghi: [], bo_qua_nguoi: 0, da_ky_nguoi: 0 }   // bản nháp --ghi
for (const q of rows) {
  const k = byKhoi[q.khoi ?? '?'] ??= { tong: 0, may: 0, khop: 0, lech: 0 }; k.tong++
  const key = parseHuuTi(q.dap_an); if (!key.ok) continue
  // CHỈ câu mà đề = 1 biểu thức: phần chữ ngoài $…$ ngắn ("Tính:", "Tìm x biết:") và KHÔNG chứa số — toán có lời thì
  // máy vớ 1 con số trong đề rồi "tính" ra rác (lần quét đầu: 627 "lệch" mà phần lớn là báo giả kiểu này).
  const chu = q.noi_dung.replace(/\$[^$]*\$/g, ' ').replace(/\$.*$/, ' ').replace(/\s+/g, ' ').trim()
  if (chu.length > 45 || /\d/.test(chu)) continue
  tk.ds_parse++
  const w = WHITELIST[q.dang_chinh]
  const r = tinh(q.noi_dung, w ?? {}); if (!r.ok) continue
  tk.may_tinh++; k.may++
  const d = byDang[q.dang_chinh] ??= { ten: q.ten_dang, may: 0, lech: 0, ng: {} }; d.may++
  const ngk = q.nguon === 'clone' ? 'clone' : 'goc'; const ng = d.ng[ngk] ??= { may: 0, lech: 0 }; ng.may++
  const khop = r.canon === key.canon
  if (khop) { tk.khop++; k.khop++ } else { tk.lech++; k.lech++; d.lech++; ng.lech++; lech.push({ ma_cau: q.ma_cau, dang: q.dang_chinh, khoi: q.khoi, nguon: q.nguon, nguon_giai: q.nguon_giai, da_duyet: q.da_duyet, kho: key.canon, may: r.canon, de: q.noi_dung.replace(/\s+/g, ' ').slice(0, 120) }) }
  if (!w) continue
  if (q.kiem_may_boi && q.kiem_may_boi !== 'mcq-auto') { wl.bo_qua_nguoi++; continue }   // người/Claude đã kiểm → máy không đè
  const ghi = khop ? null : `máy ${r.canon} ≠ kho ${key.canon}`
  if (khop && q.da_duyet) wl.da_ky_nguoi++
  ;(khop ? wl.khop : wl.nghi).push({ ma_cau: q.ma_cau, dang: q.dang_chinh, khoi: q.khoi, ten_dang: q.ten_dang, nguon: q.nguon, da_duyet: q.da_duyet, kho: key.canon, may: r.canon, ghi, de: q.noi_dung.replace(/\s+/g, ' ').slice(0, 120), doi: q.kiem_may !== (khop ? 'khop' : 'nghi') || (q.kiem_may_ghi ?? null) !== ghi })
}

console.log(`Kho ${kho}: ${tk.tong} câu có đáp số · đáp số parse được ${tk.ds_parse} · MÁY TÍNH ĐƯỢC ${tk.may_tinh} (${(100 * tk.may_tinh / tk.tong).toFixed(1)}%) · khớp ${tk.khop} · LỆCH ${tk.lech} (${(100 * tk.lech / Math.max(1, tk.may_tinh)).toFixed(1)}% của phần máy tính được)`)
console.log('Theo khối (tổng / máy tính được / lệch):', Object.entries(byKhoi).sort().map(([k, v]) => `${k}: ${v.tong}/${v.may}/${v.lech}`).join('  '))
console.log('Dạng lệch nhiều nhất:'); for (const [ma, d] of Object.entries(byDang).filter(([, d]) => d.lech).sort((a, b) => b[1].lech - a[1].lech).slice(0, 12)) console.log(`  ${ma} ${d.ten}: ${d.lech}/${d.may}${WHITELIST[ma] ? '' : '  (ngoài whitelist)'}`)
const byNguon = {}; for (const l of lech) { const k = `${l.nguon}/${l.nguon_giai}`; byNguon[k] = (byNguon[k] ?? 0) + 1 }
console.log('Lệch theo nguồn đề/lời giải:', byNguon)

const soDoi = wl.khop.filter((x) => x.doi).length + wl.nghi.filter((x) => x.doi).length
console.log(`\nWHITELIST (${Object.keys(WHITELIST).length} dạng): máy ký KHỚP ${wl.khop.length} (trong đó người đã ký trước ${wl.da_ky_nguoi}) · NGHI ${wl.nghi.length} · bỏ qua vì người/Claude đã kiểm ${wl.bo_qua_nguoi} · dòng sẽ đổi so với DB ${soDoi}`)
console.log('Câu NGHI (máy ≠ kho) — đưa vào hàng duyệt lại:')
for (const l of wl.nghi) console.log(`  ${l.ma_cau} K${l.khoi} ${l.nguon}${l.da_duyet ? ' [người đã ký]' : ''} kho=${l.kho} máy=${l.may} | ${l.de.slice(0, 90)}`)

if (GHI) {
  await c.query('begin')
  try {
    let n = 0
    for (const list of [wl.khop, wl.nghi]) for (const x of list) {
      if (!x.doi) continue
      const kq = x.ghi ? 'nghi' : 'khop'
      const r = await c.query(`
        update ${kho}_cau_hoi set
          kiem_may = $2, kiem_may_at = now(), kiem_may_boi = 'mcq-auto', kiem_may_ghi = $3,
          da_duyet    = case when $2 = 'khop' then true else da_duyet end,
          duyet_nguon = case when $2 = 'khop' and not da_duyet then 'may' else duyet_nguon end,
          duyet_at    = case when $2 = 'khop' and not da_duyet then now() else duyet_at end
        where ma_cau = $1 and xoa_at is null and (kiem_may_boi is null or kiem_may_boi = 'mcq-auto')`, [x.ma_cau, kq, x.ghi])
      n += r.rowCount
    }
    await c.query('commit')
    console.log(`\n✅ Đã ghi ${n} dòng (kiem_may_boi='mcq-auto').`)
  } catch (e) { await c.query('rollback'); console.error('❌ rollback:', e.message); process.exitCode = 1 }
  const { rows: tt } = await c.query(`select coalesce(kiem_may, '(chưa)') kiem_may, duyet_nguon, count(*)::int n, count(*) filter (where kho_chuan)::int kho_chuan
    from ${kho}_cau_hoi where xoa_at is null group by 1, 2 order by 1, 2`)
  console.log('Trạng thái kho sau ghi (kiem_may × duyet_nguon → số câu / thuộc kho chuẩn):'); for (const r of tt) console.log(`  ${r.kiem_may} × ${r.duyet_nguon ?? '-'}: ${r.n} / ${r.kho_chuan}`)
} else {
  console.log('\n(chỉ đọc — thêm --ghi để ghi kiem_may / ký da_duyet cho phần whitelist)')
}
await c.end()
if (opt('--out')) { writeFileSync(opt('--out'), JSON.stringify(GHI ? wl : lech, null, 1), 'utf8'); console.log('→', opt('--out')) }
