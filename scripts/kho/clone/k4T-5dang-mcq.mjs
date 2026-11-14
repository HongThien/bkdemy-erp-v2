// ============================================================================
// k4T-5dang-mcq.mjs — PHƯƠNG ÁN NHIỄU THEO LỖI cho 2 dạng mà máy chung (mcq-auto --theo-dap-so) làm hỏng (14/11):
//   · Quy đồng tử số (NDB01553): máy chung RÚT GỌN đáp án ⇒ "phương án đúng" thành chính hai phân số đề cho; nhiễu "±1 vào tử".
//   · Tìm x dãy hiệu – tích (NDB01577): máy chung sinh số âm / "+1 vào phân số" — vô nghĩa với lớp 4.
// Ở đây mỗi nhiễu là KẾT QUẢ THẬT của một đường sai, tính lại từ chữ của đề (phân số chính xác):
//   Quy đồng tử: R07 chỉ nhân tử, quên nhân mẫu · R174 đổi nhầm số nhân giữa hai phân số · R102 cộng thêm (vào tử và mẫu) thay vì nhân.
//   Tìm x:       R102/R09 chọn nhầm phép tính ngược (± đảo dấu, ×/: đảo phép) · D50 bỏ sót số hạng cuối của dãy · R200 quên trừ phần sau (lấy dãy = 1/số đầu).
//   node scripts/kho/clone/k4T-5dang-mcq.mjs <pool.json> --out <kq.json>    (pool = mcq-sinh --list)
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs'
const a = process.argv.slice(2), opt = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null }
const pool = JSON.parse(readFileSync(a[0], 'utf8')).cau
const gcd = (x, y) => (y ? gcd(y, x % y) : Math.abs(x))
const Q = (p, q) => { if (q < 0) { p = -p; q = -q } const g = gcd(p, q) || 1; return [p / g, q / g] }
const cong = (x, y) => Q(x[0] * y[1] + y[0] * x[1], x[1] * y[1]), tru = (x, y) => Q(x[0] * y[1] - y[0] * x[1], x[1] * y[1])
const nhan = (x, y) => Q(x[0] * y[0], x[1] * y[1]), chia = (x, y) => Q(x[0] * y[1], x[1] * y[0])
const F = (p, q) => `\\dfrac{${p}}{${q}}`, fs$ = ([p, q]) => (q === 1 ? `${p}` : F(p, q))
const phanSo = (s) => [...String(s).matchAll(/\\dfrac\{(\d+)\}\{(\d+)\}/g)].map((m) => [+m[1], +m[2]])
const lcm = (x, y) => (x / gcd(x, y)) * y
let seed = 20261114; const R = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648)
const xepVao = (dung, nhieu) => {            // đặt đáp án đúng vào vị trí xoay vòng A→D để cân phân bố
  const vt = ['A', 'B', 'C', 'D'][xepVao.i++ % 4], lc = [...nhieu]; lc.splice('ABCD'.indexOf(vt), 0, dung); return { dap_an: vt, lua_chon: lc }
}
xepVao.i = 0
const out = [], bo = []
for (const c of pool) {
  const nd = c.noi_dung
  if (/^Quy đồng tử số/.test(nd)) {
    const [[p1, q1], [p2, q2]] = phanSo(nd), T = lcm(p1, p2), k1 = T / p1, k2 = T / p2
    const dung = { text: `$${F(T, q1 * k1)}$ ; $${F(T, q2 * k2)}$`, dung: true }
    const n = [
      { text: `$${F(T, q1)}$ ; $${F(T, q2)}$`, dung: false, rule: 'R07', duong_sai: 'chỉ nhân tử số với số cần nhân, quên nhân mẫu số' },
      { text: `$${F(T, q1 * k2)}$ ; $${F(T, q2 * k1)}$`, dung: false, rule: 'R174', duong_sai: 'nhân mẫu số của phân số này với số nhân của phân số kia (đổi nhầm số nhân)' },
      { text: `$${F(T, q1 + (T - p1))}$ ; $${F(T, q2 + (T - p2))}$`, dung: false, rule: 'R102', duong_sai: 'cộng thêm cùng một số vào tử và mẫu cho tử bằng tử chung, thay vì nhân' },
    ]
    const val = [dung, ...n].map((o) => phanSo(o.text).map(([x, y]) => Q(x, y).join('/')).join(';'))
    if (new Set(val).size < 4 || k1 === k2) { bo.push({ ma_cau: c.ma_cau, bo: 'nhiễu quy đồng tử trùng giá trị' }); continue }
    out.push({ ma_cau: c.ma_cau, ...xepVao(dung, n) }); continue
  }
  if (/^Tìm \$x\$/.test(nd)) {
    const t = [...nd.matchAll(/\$([^$]+)\$/g)].map((m) => m[1]).at(-1), trong = t.match(/\\left\((.*)\\right\)/)[1]
    const sh = [...trong.matchAll(/\\dfrac\{(\d+)\}\{(\d+)\\times (\d+)\}/g)].map((m) => [+m[1], +m[2], +m[3]])
    let ds = sh
    if (/…/.test(trong)) { const k = sh[0][0], b = sh[1][1] - sh[0][1]; ds = []; for (let n = sh[0][1]; n <= sh.at(-1)[1]; n += b) ds.push([k, n, n + k]) }
    const tong = (arr) => arr.reduce((s, [k, n, m]) => cong(s, Q(k, n * m)), [0, 1])
    const S = tong(ds), S1 = tong(ds.slice(0, -1)), S2 = Q(1, ds[0][1])
    const vp = t.split('=').at(-1), r = vp.includes('dfrac') ? phanSo(vp)[0] : [+vp, 1]
    const ve = (t.split('\\left(')[0] + '#' + t.split('\\right)')[1].split('=')[0]).replace(/\s/g, '')
    const giai = { 'x-#': (s) => cong(r, s), 'x+#': (s) => tru(r, s), '#-x': (s) => tru(s, r), 'x\\times#': (s) => chia(r, s), 'x:#': (s) => nhan(r, s) }[ve]
    const nguoc = { 'x-#': (s) => tru(r, s), 'x+#': (s) => cong(r, s), '#-x': (s) => cong(s, r), 'x\\times#': (s) => nhan(r, s), 'x:#': (s) => chia(r, s) }[ve]
    if (!giai) { bo.push({ ma_cau: c.ma_cau, bo: 'không đọc được phép tính' }); continue }
    const x = giai(S)
    const ung = [
      { v: nguoc(S), rule: /x[-+]#|#-x/.test(ve) ? 'R102' : 'R09', duong_sai: /x[-+]#|#-x/.test(ve) ? 'chọn nhầm phép tính khi tìm thành phần chưa biết (cộng thành trừ hoặc ngược lại)' : 'chọn nhầm phép tính khi tìm thành phần chưa biết (nhân thành chia hoặc ngược lại)' },
      { v: giai(S1), rule: 'D50', duong_sai: 'tính dãy trong ngoặc bỏ sót số hạng cuối cùng' },
      { v: giai(S2), rule: 'R200', duong_sai: 'tách dãy rồi chỉ giữ phân số đầu, quên trừ phân số cuối' },
    ].filter((o) => o.v[0] > 0)
    const dung = { text: `$${fs$(x)}$`, dung: true }
    const da = new Set([x.join('/')]), n = []
    for (const o of ung) { const k = o.v.join('/'); if (da.has(k)) continue; da.add(k); n.push({ text: `$${fs$(o.v)}$`, dung: false, rule: o.rule, duong_sai: o.duong_sai }) }
    if (n.length < 3) { bo.push({ ma_cau: c.ma_cau, bo: `chỉ có ${n.length} nhiễu dương khác nhau` }); continue }
    out.push({ ma_cau: c.ma_cau, ...xepVao(dung, n) }); continue
  }
}
writeFileSync(opt('--out'), JSON.stringify([...out, ...bo], null, 1))
console.log('sinh', out.length, '· bỏ', bo.length, bo.map((b) => b.bo).join(' | '))
