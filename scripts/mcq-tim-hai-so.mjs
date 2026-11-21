// SINH MCQ cho NDB00415 / NDB00416 "tìm hai số a, b biết ƯCLN = d và BCNN = m | a + b = s" (Thùy 21/11 "viết rule nhiễu mới").
//   node scripts/mcq-tim-hai-so.mjs --out kq.json [--dang NDB00415,NDB00416]   → đọc câu (đã duyệt, đang có form chờ) rồi sinh kq.json
//   node scripts/mcq-sinh.mjs --verify kq.json --thay "<lý do>" --kho dai --theo-dap-so      (phải 0 FAIL)
//   node scripts/mcq-sinh.mjs --ghi kq.json --thay "<lý do>" --kho dai --theo-dap-so --model may-tim-hai-so-2111d
// Đáp án đúng do MÁY TÍNH LẠI (a = d·x, b = d·y, (x,y)=1) rồi ĐỐI CHIẾU với đáp số kho theo tập cặp; lệch ⇒ bỏ câu (§1.5 không đoán).
// Luật nhiễu (mẫu mù 21/11 bốn vòng): MỌI nhiễu xuất phát từ một danh sách ĐÃ SAI (W = cặp không thoả ƯCLN = d), KHÔNG BAO GIỜ rút ra từ chính đáp án đúng
// (tập con / tập cha / rút gọn của đáp án đúng ⇒ đối chiếu tập hợp hoặc nhân d là ra đáp án).
//   S1 (R520) = đáp án ∪ W · S2 (R524) = đáp án thay một cặp bằng W · Q (R519) = S2 chia cho d (quên nhân lại ƯCLN) · T (R521) = S1 chỉ một thứ tự (a ≤ b).
// W: cặp có ước chung (nếu có) · hoặc a = b (BCNN: (m;m); tổng chẵn: (s/2; s/2)) · hoặc có số 0 (tổng lẻ: (0;s)).
import { readFileSync, writeFileSync } from 'node:fs'
import pg from 'pg'

const args = process.argv.slice(2)
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d }
const OUT = opt('--out'); if (!OUT) throw new Error('thiếu --out')
const DANG = (opt('--dang', 'NDB00415,NDB00416')).split(',')
const url = readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } }); await c.connect()

const gcd = (a, b) => { while (b) { [a, b] = [b, a % b] } return a }
const DOLA = String.fromCharCode(36)
// nhóm [u, v] (giá trị thật) → [[u,v],[v,u]] (hoặc 1 phần tử nếu u = v)
const grp = ([u, v]) => (u === v ? [[u, v]] : [[u, v], [v, u]])
let SAPXEP_A = false // đáp số kho xếp theo a tăng dần ⇒ mọi phương án của câu xếp cùng kiểu
const fmt = (cap) => { const l = SAPXEP_A ? cap.slice().sort((p, q) => p[0] - q[0]) : cap; return DOLA + l.map(([u, v]) => `(${u};${v})`).join(', ') + DOLA }
const nhomCoprime = (n, kieu) => { // nhóm hệ số (x ≤ y) nguyên tố cùng nhau; 'tich': x·y = n ; 'tong': x + y = n
  const r = []
  if (kieu === 'tich') { for (let x = 1; x * x <= n; x++) if (n % x === 0 && gcd(x, n / x) === 1) r.push([x, n / x]) }
  else { for (let x = 1; x <= n - x; x++) if (gcd(x, n - x) === 1) r.push([x, n - x]) }
  return r
}
const nhomKhongCoprime = (n, kieu) => {
  if (kieu === 'tich') { for (let x = 2; x * x <= n; x++) if (n % x === 0 && gcd(x, n / x) > 1) return [x, n / x] }
  else { for (let x = 2; x <= n - x; x++) if (gcd(x, n - x) > 1) return [x, n - x] }
  return null
}
const sapXep = (g) => g.slice().sort((p, q) => p[0] - q[0])
const cungTap = (a, b) => a.length === b.length && a.every((v) => b.includes(v))

const rows = (await c.query(`select distinct on (h.ma_cau) h.ma_cau, h.noi_dung, h.dap_an from dai_cau_hoi h join bdm_cau_dang d on d.ma_cau = h.ma_cau and d.kho = 'dai'
  join dai_cau_form_tn f on f.ma_cau = h.ma_cau and f.xoa_at is null and not f.da_duyet
  where h.xoa_at is null and h.da_duyet and d.dang_bai_id = any($1) order by h.ma_cau`, [DANG])).rows
const kq = [], lyDoBo = {}
const bo = (ma, ly) => { kq.push({ ma_cau: ma, bo: ly }); lyDoBo[ly] = (lyDoBo[ly] || 0) + 1 }
const viTri = { A: 0, B: 0, C: 0, D: 0 }
const RULES = { R519: "quên nhân lại ƯCLN (ghi cặp a', b' đã chia cho ƯCLN)", R520: 'thừa một cặp không thoả ƯCLN (quên kiểm điều kiện nguyên tố cùng nhau / ƯCLN)', R521: 'chỉ ghi một thứ tự, bỏ các cặp đảo', R524: 'chọn nhầm một cặp không thoả ƯCLN thay cho cặp đúng' }
const reUclnB = /(?:\(a\s*[,;]\s*b\)|ƯCLN\}?\(a\s*[,;]\s*b\))\s*=\s*(\d+)/
const reBcnn = /(?:\[a\s*[,;]\s*b\]|BCNN\}?\(a\s*[,;]\s*b\))\s*=\s*(\d+)/
const reTong = /a\s*\+\s*b\s*=\s*(\d+)/
const reCap = /\(\s*(\d+)\s*;\s*(\d+)\s*\)/g
for (const r of rows) {
  const nd = r.noi_dung
  if (/\n|a\s*[<>]\s*b|\\le|\\ge|ba số|a\)/.test(nd)) { bo(r.ma_cau, 'đề nhiều ý / có điều kiện a<b ngoài mẫu'); continue }
  const d = nd.match(reUclnB), m = nd.match(reBcnn), s = nd.match(reTong)
  if (!d || (!m && !s) || (m && s)) { bo(r.ma_cau, 'không đúng mẫu ƯCLN + (BCNN | tổng)'); continue }
  const D = Number(d[1]), kieu = m ? 'tich' : 'tong', V = Number(m ? m[1] : s[1])
  if (V % D) { bo(r.ma_cau, 'không chia hết cho ƯCLN (đề vô nghiệm)'); continue }
  const n = V / D
  const dung = sapXep(nhomCoprime(n, kieu))
  const khoCap = [...String(r.dap_an || '').matchAll(reCap)].map((x) => [Number(x[1]), Number(x[2])])
  const kho = khoCap.map(([u, v]) => `${u};${v}`)
  const dungCap = dung.flatMap(([x, y]) => grp([D * x, D * y]))
  if (!kho.length || !cungTap(kho, dungCap.map(([u, v]) => `${u};${v}`))) { bo(r.ma_cau, 'máy tính lại ≠ đáp số kho (không đoán)'); continue }
  SAPXEP_A = khoCap.every(([u], i) => i === 0 || khoCap[i - 1][0] <= u) && dung.some(([x, y]) => x !== y)
  if (dung.length < 2) { bo(r.ma_cau, 'chỉ một nhóm cặp đúng'); continue }
  // W = cặp KHÔNG thoả ƯCLN = d (giá trị thật)
  const kc = nhomKhongCoprime(n, kieu)
  let W = null
  if (kc) W = [D * kc[0], D * kc[1]]
  else if (kieu === 'tich') { if (V !== D) W = [V, V] }
  else if (V % 2 === 0) { if (V / 2 !== D) W = [V / 2, V / 2] }
  else if (V !== D) W = [0, V]
  if (!W) { bo(r.ma_cau, 'không dựng được cặp sai'); continue }
  const dungText = fmt(dungCap)
  const S1 = [...dungCap, ...grp(W)]
  // S2: bỏ nhóm đầu có x ≠ 1 rồi thay bằng W
  const idx = dung.findIndex(([x]) => x !== 1)
  const S2 = idx > 0 ? [...dung.filter((_, i) => i !== idx).flatMap(([x, y]) => grp([D * x, D * y])), ...grp(W)] : null
  const ung = []
  const them = (rule, cap) => { if (!cap || !cap.length) return; const t = fmt(cap); if (t !== dungText && !ung.some((u) => u[1] === t)) ung.push([rule, t]) }
  them('R520', S1)
  them('R524', S2)
  if (D > 1 && S2 && S2.every(([u, v]) => u % D === 0 && v % D === 0)) them('R519', S2.map(([u, v]) => [u / D, v / D]))
  them('R521', S1.filter(([u, v]) => u <= v))
  const NHOM = { R520: 'S', R524: 'S', R519: 'K', R521: 'T' }, TRAN = { S: 2, K: 1, T: 1 }
  const dem = { S: 0, K: 0, T: 0 }, chon = []
  for (const rule of ['R520', 'R524', 'R519', 'R521']) { const u = ung.find((x) => x[0] === rule); if (u && chon.length < 3 && dem[NHOM[rule]] < TRAN[NHOM[rule]]) { chon.push(u); dem[NHOM[rule]]++ } }
  if (chon.length < 3) { bo(r.ma_cau, 'không đủ 3 nhiễu khác cấu trúc'); continue }
  const ten = Object.entries(viTri).sort((a, b) => a[1] - b[1])[0][0]; viTri[ten]++ // cân vị trí đúng A–D toàn lô
  const lc = chon.map(([rule, t]) => ({ text: t, dung: false, rule, duong_sai: RULES[rule] }))
  lc.splice('ABCD'.indexOf(ten), 0, { text: dungText, dung: true })
  kq.push({ ma_cau: r.ma_cau, dap_an: ten, lua_chon: lc })
}
writeFileSync(OUT, JSON.stringify(kq, null, 1))
console.log(`câu ${rows.length} · sinh ${kq.filter((x) => !x.bo).length} · bỏ ${kq.filter((x) => x.bo).length}`, JSON.stringify(lyDoBo), '· vị trí đúng', JSON.stringify(viTri))
await c.end()
