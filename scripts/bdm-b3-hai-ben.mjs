// B3 — GHÉP kết quả của HAI người xếp độc lập (khối không có câu mẫu do người nối ⇒ không đo được precision bằng mẫu; dùng
// đồng thuận hai model khác nhau thay, như lô 4T Trung bình cộng ban-do-4t-tbc-gan.mjs). Không đụng DB.
//   node scripts/bdm-b3-hai-ben.mjs <khoi>        (đọc kho-rules/dai/lo/b3/k<khoi>/lo-NN.json + lo-NN.out.json + lo-NN.out2.json)
// Luật ghép:
//   · cùng dạng, CẢ HAI 'cao'                ⇒ cao (ghi thẳng dai_bdm_gan_cau qua bdm-b3-ghi-de-xuat.mjs)
//   · cùng dạng, một bên 'vua'               ⇒ vua (hàng duyệt dai_bdm_de_xuat)
//   · khác dạng (cả hai có dạng)             ⇒ vua, dạng của người thứ hai (Opus), ly_do ghi cả hai lựa chọn
//   · một bên có dạng, một bên để trống      ⇒ vua, dạng của bên có dạng, ly_do ghi bên kia để trống vì sao
//   · cả hai để trống                        ⇒ trống (dai_bdm_cau_thieu_dang), ly_do của người thứ hai
// Ghi ket_qua.json (khuôn chung của B3) + mau_kiem_dap_an.json rỗng (không có mẫu) + bao-cao-hai-ben.json (thống kê + danh sách lệch).
import fs from 'node:fs'
import path from 'node:path'

const khoi = process.argv[2]
if (!khoi) { console.error('Dùng: node scripts/bdm-b3-hai-ben.mjs <khoi>'); process.exit(2) }
const goc = path.join('kho-rules', 'dai', 'lo', 'b3', 'k' + khoi)
const dbIds = new Set([...fs.readFileSync(path.join(goc, 'dich.md'), 'utf8').matchAll(/\*\*(NDB\d+)\*\*/g)].map((m) => m[1]))
const lo = fs.readdirSync(goc).filter((f) => /^lo-\d+\.json$/.test(f)).sort()
const loi = [], kq = [], lech = []
const tk = { cao: 0, vua_cung_dang: 0, vua_khac_dang: 0, vua_mot_ben_trong: 0, trong: 0 }
const doc = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')) } catch (e) { loi.push(`${path.basename(f)}: ${e.code === 'ENOENT' ? 'chưa có' : 'không phải JSON'}`); return null } }
for (const f of lo) {
  const vao = JSON.parse(fs.readFileSync(path.join(goc, f), 'utf8'))
  const a = doc(path.join(goc, f.replace('.json', '.out.json'))), b = doc(path.join(goc, f.replace('.json', '.out2.json')))
  if (!a || !b) continue
  const A = new Map(a.map((r) => [r.ma_cau, r])), B = new Map(b.map((r) => [r.ma_cau, r]))
  for (const v of vao) {
    const x = A.get(v.ma_cau), y = B.get(v.ma_cau)
    if (!x || !y) { loi.push(`${f}: thiếu ${v.ma_cau} ở ${!x ? 'out' : 'out2'}`); continue }
    for (const [ten, r] of [['out', x], ['out2', y]]) if (r.dang_bai_id && !dbIds.has(r.dang_bai_id)) { loi.push(`${f} ${ten}: ${v.ma_cau} mã ${r.dang_bai_id} không có trong dich.md`); r.dang_bai_id = null; r.chac = null }
    let o
    if (x.dang_bai_id && x.dang_bai_id === y.dang_bai_id) {
      if (x.chac === 'cao' && y.chac === 'cao') { o = { dang_bai_id: x.dang_bai_id, chac: 'cao', ly_do: y.ly_do }; tk.cao++ }
      else { o = { dang_bai_id: x.dang_bai_id, chac: 'vua', ly_do: `hai bên cùng dạng, chưa cùng chắc: ${x.ly_do} / ${y.ly_do}` }; tk.vua_cung_dang++ }
    } else if (x.dang_bai_id && y.dang_bai_id) {
      o = { dang_bai_id: y.dang_bai_id, chac: 'vua', ly_do: `LỆCH: người 1 → ${x.dang_bai_id} (${x.ly_do}); người 2 → ${y.dang_bai_id} (${y.ly_do})` }; tk.vua_khac_dang++
      lech.push({ ma_cau: v.ma_cau, de: String(v.de ?? '').slice(0, 160), mot: x.dang_bai_id, hai: y.dang_bai_id })
    } else if (x.dang_bai_id || y.dang_bai_id) {
      const co = x.dang_bai_id ? x : y, khong = x.dang_bai_id ? y : x
      o = { dang_bai_id: co.dang_bai_id, chac: 'vua', ly_do: `một bên để trống (${khong.ly_do}); bên kia: ${co.ly_do}` }; tk.vua_mot_ben_trong++
    } else { o = { dang_bai_id: null, chac: null, ly_do: y.ly_do || x.ly_do }; tk.trong++ }
    kq.push({ ma_cau: v.ma_cau, ...o })
  }
}
if (loi.length) { console.error('✘', loi.length, 'lỗi:'); for (const l of loi.slice(0, 40)) console.error('  ', l) }
fs.writeFileSync(path.join(goc, 'ket_qua.json'), JSON.stringify(kq, null, 1))
if (!fs.existsSync(path.join(goc, 'mau_kiem_dap_an.json'))) fs.writeFileSync(path.join(goc, 'mau_kiem_dap_an.json'), '{}')
const theoDang = {}; for (const r of kq.filter((r) => r.chac === 'cao')) theoDang[r.dang_bai_id] = (theoDang[r.dang_bai_id] ?? 0) + 1
fs.writeFileSync(path.join(goc, 'bao-cao-hai-ben.json'), JSON.stringify({ tk, theo_dang_cao: theoDang, lech }, null, 1))
console.log('câu', kq.length, JSON.stringify(tk), '· đồng thuận cao', (100 * tk.cao / Math.max(1, kq.length)).toFixed(1) + '%', '· lệch dạng', lech.length)
console.log('→', path.join(goc, 'ket_qua.json'))
