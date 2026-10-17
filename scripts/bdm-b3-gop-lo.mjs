// B3 — GỘP + KIỂM kết quả agent của một khối (không đụng DB).
//   node scripts/bdm-b3-gop-lo.mjs <khoi>
// Đọc kho-rules/dai/lo/b3/k<khoi>/lo-NN.json + lo-NN.out.json + mau.json + dich.md ⇒
//   kiểm: đủ câu, đúng thứ tự, mã dạng bài có trong bảng đích, chac hợp lệ
//   đo: precision trên câu MẪU (tổng · riêng mức cao) — mẫu = câu người đã nối, agent không biết
//   ghi: ket_qua.json (mọi câu, kể cả mẫu) cho bdm-b3-ghi-de-xuat.mjs / bdm-b3-nap-de-xuat.mjs (hai script đó tự bỏ câu mẫu qua --mau / mau.json)
import fs from 'node:fs'
import path from 'node:path'

const khoi = process.argv[2]
const goc = path.join('kho-rules', 'dai', 'lo', 'b3', 'k' + khoi)
const dbIds = new Set([...fs.readFileSync(path.join(goc, 'dich.md'), 'utf8').matchAll(/\*\*(NDB\d+)\*\*/g)].map((m) => m[1]))
const mau = JSON.parse(fs.readFileSync(fs.existsSync(path.join(goc, '..', '_mau', `k${khoi}.json`)) ? path.join(goc, '..', '_mau', `k${khoi}.json`) : path.join(goc, 'mau.json'), 'utf8')) // mẫu để NGOÀI thư mục agent (17/10: 1 agent đã mở mau.json)
const loi = [], kq = []
const lo = fs.readdirSync(goc).filter((f) => /^lo-\d+\.json$/.test(f)).sort()
let thieuOut = 0
for (const f of lo) {
  const vao = JSON.parse(fs.readFileSync(path.join(goc, f), 'utf8'))
  const fo = path.join(goc, f.replace('.json', '.out.json'))
  if (!fs.existsSync(fo)) { thieuOut++; loi.push(`${f}: chưa có .out.json`); continue }
  let ra
  try { ra = JSON.parse(fs.readFileSync(fo, 'utf8')) } catch (e) { loi.push(`${f}: out không phải JSON (${e.message})`); continue }
  const theoMa = new Map(ra.map((r) => [r.ma_cau, r]))
  if (ra.length !== vao.length) loi.push(`${f}: vào ${vao.length} câu, ra ${ra.length}`)
  for (const v of vao) {
    const r = theoMa.get(v.ma_cau)
    if (!r) { loi.push(`${f}: thiếu ${v.ma_cau}`); continue }
    if (r.dang_bai_id && !dbIds.has(r.dang_bai_id)) { loi.push(`${f}: ${v.ma_cau} mã lạ ${r.dang_bai_id} ⇒ coi như trống`); r.dang_bai_id = null; r.chac = null }
    if (r.dang_bai_id && !['cao', 'vua'].includes(r.chac)) { loi.push(`${f}: ${v.ma_cau} chac lạ "${r.chac}" ⇒ vua`); r.chac = 'vua' }
    if (!r.dang_bai_id) r.chac = null
    kq.push({ ma_cau: v.ma_cau, dang_bai_id: r.dang_bai_id ?? null, chac: r.chac ?? null, ly_do: r.ly_do ?? '' })
  }
}
fs.writeFileSync(path.join(goc, 'ket_qua.json'), JSON.stringify(kq, null, 1))
// tên file mà bdm-b3-ghi-de-xuat.mjs (bản K8) đọc để bỏ câu mẫu
fs.writeFileSync(path.join(goc, 'mau_kiem_dap_an.json'), JSON.stringify(mau, null, 1))

const m = kq.filter((r) => r.ma_cau in mau)
const dung = (r) => r.dang_bai_id === mau[r.ma_cau]
const mc = m.filter((r) => r.chac === 'cao'), mv = m.filter((r) => r.chac === 'vua'), mt = m.filter((r) => !r.dang_bai_id)
const pct = (a, b) => (b ? ((100 * a) / b).toFixed(1) + '%' : '—')
const ngoai = kq.filter((r) => !(r.ma_cau in mau))
console.log(`K${khoi}: ${lo.length} lô (${thieuOut} chưa có kết quả) · ${kq.length} câu`)
console.log(`  câu thật: cao ${ngoai.filter((r) => r.chac === 'cao').length} · vừa ${ngoai.filter((r) => r.chac === 'vua').length} · trống ${ngoai.filter((r) => !r.dang_bai_id).length}`)
console.log(`  MẪU ${m.length}: cao ${mc.length} đúng ${mc.filter(dung).length} (${pct(mc.filter(dung).length, mc.length)}) · vừa ${mv.length} đúng ${mv.filter(dung).length} · trống ${mt.length}`)
for (const r of mc.filter((x) => !dung(x))) console.log(`    ✗ cao sai ${r.ma_cau}: AI ${r.dang_bai_id} · người ${mau[r.ma_cau]} — ${r.ly_do}`)
if (loi.length) { console.log(`  ⚠ ${loi.length} lỗi:`); for (const l of loi.slice(0, 30)) console.log('   ', l) }
