// ============================================================================
// k5T-pt-fill-A-mcq.mjs — PHƯƠNG ÁN NHIỄU MCQ cho 153 câu lô A (k5T-pt-fill-A.json), 7 dạng NDB02767/68/69/70, 03000, 03001, 03553.
// Mỗi nhiễu là KẾT QUẢ THẬT của một đường sai có tên: máy đọc CHỮ của đề (số, %, đơn vị, hướng), tính lại bằng code theo đường sai
// (rule R100…R540 trong dai_mcq_rule), ghép vào CÙNG khuôn chữ với dap_an. Câu không đủ 3 rule khác nhau thì bị loại và liệt kê.
//   node scripts/kho/clone/k5T-pt-fill-A-mcq.mjs [--vao kho-rules/dai/clone/k5T-pt-fill-A.json] [--ra kho-rules/dai/clone/k5T-pt-fill-A-mcq.json]
// Hạt giống: không ngẫu nhiên (đường sai tất định, thứ tự ưu tiên cố định) ⇒ chạy lại ra đúng lô.
// ============================================================================
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { chonNhieu, kiemUngVien } from './k5T-pt-mcq-kiem.mjs'

const RULE_INFO = new Map(['R100', 'R101', 'R104', 'R407', 'R408', 'R409', 'R525', 'R526', 'R527', 'R528', 'R529', 'R530', 'R531', 'R538', 'R539', 'R540'].map((m) => [m, { ma: m, du_phong: m === 'R540' }]))
const r6 = (x) => Math.round(x * 1e6) / 1e6
const dp = (x, k) => Math.abs(x * 10 ** k - Math.round(x * 10 ** k)) < 1e-6
const fmt = (x) => String(r6(x)).replace('.', ',')
const gcd = (a, b) => (b ? gcd(b, a % b) : a)

/** các số trong văn bản: {v, pct, unit} (bỏ "5A", "5B") */
function docSo(d) {
  const kq = []
  for (const m of d.matchAll(/(?<![\w,.])(\d{1,3}(?: \d{3})+|\d+)(?:,(\d+))?(?![\dA-Za-z])(\s*%)?(?:\s+([\p{L}]+))?/gu)) kq.push({ v: Number((m[1] + (m[2] ? '.' + m[2] : '')).replace(/ /g, '')), pct: !!m[3], unit: m[4] || '' })
  return kq
}
/** thay lần lượt các số trong dap_an bằng vals (bỏ qua số mũ ^2) */
function like(dap, vals) {
  let i = 0
  return dap.replace(/(?<!\^)\d+(?:,\d+)?/g, (m) => (i < vals.length ? fmt(vals[i++]) : m))
}
const frac = (u, v) => { const g = gcd(u, v); return `$\\dfrac{${u / g}}{${v / g}}$` }
const ptuSo = (s) => { const m = /^\$\\dfrac\{(\d+)\}\{(\d+)\}\$$/.exec(s.trim()); return m ? [+m[1], +m[2]] : null }

// ── dựng ứng viên theo mẫu ───────────────────────────────────────────────────────────────────────────────────────
/** trả mảng [{ vals:number[] | text, rule, ds }] theo thứ tự ưu tiên */
function duongSai(c) {
  const d = c.noi_dung, S = docSo(d), N = S.filter((x) => !x.pct).map((x) => x.v), Pc = S.filter((x) => x.pct).map((x) => x.v)
  const L = []; const add = (rule, v, ds) => { L.push({ rule, v: Array.isArray(v) ? v : [v], ds }) }
  const addT = (rule, text, ds) => L.push({ rule, text, ds })
  const mau = c.mau
  const ct = (d.match(/\$([^$]+)\$/) ?? [])[1] ?? ''
  const so1 = (c.dap_an.match(/\d+(?:,\d+)?/) ?? ['0'])[0].replace(',', '.'); const ans = Number(so1)
  const x10 = (nhan) => { add('R538', ans * 10, `${nhan} dịch dấu phẩy một chữ số về bên phải (nhân thêm 10) nên kết quả gấp 10 lần`); add('R538', ans / 10, `${nhan} dịch dấu phẩy sai một chữ số về bên trái nên kết quả chỉ bằng một phần mười`) }
  const lech = () => { const dd = (so1.split('.')[1] ?? '').length; add('R540', ans + 10 ** -dd, 'Làm đúng cách nhưng lệch một đơn vị ở chữ số cuối khi tính bước cuối') }

  // ───────── NDB02767 ─────────
  if (c.dang === 'NDB02767') {
    const toks = [...ct.matchAll(/([+\-]?)(\d+(?:,\d+)?)(\\%)?/g)].map((m) => ({ s: m[1] === '-' ? -1 : 1, v: Number(m[2].replace(',', '.')), pct: !!m[3] }))
    const td = /số thập phân/.test(d)
    if (mau === 'ct_pt' || mau === 'ct_td') {
      const tong = (sg) => toks.reduce((a, t, i) => a + (i === 0 ? 1 : sg[i]) * t.v, 0)
      const sg0 = toks.map((t, i) => (i === 0 ? 1 : t.s)); const S0 = tong(sg0); const chuy = (x) => (td ? x / 100 : x)
      for (let i = 1; i < toks.length; i++) { const sg = [...sg0]; sg[i] = -sg[i]; add('R407', chuy(tong(sg)), `Đổi dấu ${sg0[i] > 0 ? 'cộng thành trừ' : 'trừ thành cộng'} ở số hạng thứ ${i + 1} nên cộng trừ sai các tỉ số phần trăm`) }
      if (toks.length === 3) add('R408', chuy(sg0[0] * toks[0].v + sg0[1] * toks[1].v), 'Chỉ cộng trừ hai số hạng đầu rồi dừng lại, bỏ sót số hạng cuối')
      add('R538', chuy(S0) * 10, 'Đổi kết quả cuối sai chỗ dấu phẩy, dịch một chữ số thay vì hai chữ số'); add('R538', chuy(S0) / 10, 'Đổi kết quả cuối sai chỗ dấu phẩy, dịch ba chữ số thay vì hai chữ số')
      if (td) add('R100', S0, 'Quên đổi tỉ số phần trăm ra số thập phân (không chia cho 100), giữ nguyên phần số')
      add('R540', chuy(S0) + (td ? 0.001 : 1), 'Làm đúng cách nhưng lệch một đơn vị ở chữ số cuối khi cộng trừ')
    } else if (mau === 'nhan_td' || mau === 'nhan_pt') {
      const [a, b] = toks.map((t) => t.v); const pt = mau === 'nhan_pt'; const ch = (x) => (pt ? x : x / 100)   // x tính theo đơn vị %
      const kq = (a * b) / 100
      add('R526', ch(a + b), 'Cộng hai phần số rồi giữ dấu phần trăm thay vì đổi ra số thập phân rồi nhân'); add('R407', ch(((a / b) * 100)), 'Dùng phép chia thay cho phép nhân hai tỉ số phần trăm')
      add('R538', ch(kq) * 10, 'Nhân đúng nhưng dịch dấu phẩy ở kết quả sai một chữ số'); add('R538', ch(kq) / 10, 'Nhân đúng nhưng đếm thiếu một chữ số thập phân ở kết quả')
      add('R100', ch(a * b),'Nhân phần số hai tỉ số rồi giữ dấu phần trăm, quên chia cho 100'); add('R540', ch(kq) + (pt ? 1 : 0.001), 'Làm đúng cách nhưng lệch một đơn vị ở chữ số cuối')
    } else if (mau === 'chia_2') {
      const [a, b] = toks.map((t) => t.v); const kq = a / b
      add('R529', b / a, 'Chia ngược vai trò: lấy tỉ số thứ hai chia cho tỉ số thứ nhất'); add('R407', (a / 100) * (b / 100), 'Dùng phép nhân thay cho phép chia hai tỉ số phần trăm')
      add('R526', (a - b) / 100, 'Trừ thẳng hai tỉ số phần trăm thay vì chia'); add('R538', kq * 10, 'Đổi ra số thập phân sai chỗ dấu phẩy, kết quả gấp 10 lần'); add('R538', kq / 10, 'Đổi ra số thập phân sai chỗ dấu phẩy, kết quả bằng một phần mười')
      add('R540', kq + 0.1, 'Làm đúng cách nhưng lệch một chữ số ở bước chia cuối')
    } else if (mau === 'ba_so') {
      const [a, b, cc] = toks.map((t) => t.v); const t1 = (a / 100) * (b / 100); const kq = t1 / (cc / 100)
      add('R408', t1, 'Chỉ nhân hai tỉ số đầu rồi dừng, bỏ sót phép chia cuối'); add('R407', t1 * (cc / 100), 'Nhân với tỉ số cuối thay vì chia cho tỉ số cuối')
      add('R538', kq * 10, 'Đổi ra số thập phân sai chỗ dấu phẩy, kết quả gấp 10 lần'); add('R538', kq / 10, 'Đổi ra số thập phân sai chỗ dấu phẩy, kết quả bằng một phần mười')
      add('R529', (a / 100) / ((b / 100) * (cc / 100)), 'Lấy tỉ số thứ nhất chia cho tích hai tỉ số sau, sai thứ tự phép tính'); add('R540', kq + 0.1, 'Làm đúng cách nhưng lệch một chữ số ở bước chia cuối')
    } else if (mau === 'so_nhan') {
      const [a, n] = toks.map((t) => t.v); const kq = (a / 100) * n
      add('R100', a * n, 'Nhân phần số với số tự nhiên và quên đổi tỉ số phần trăm ra số thập phân (quên chia 100)'); add('R538', kq * 10, 'Đổi tỉ số phần trăm ra số thập phân sai chỗ dấu phẩy, kết quả gấp 10 lần'); add('R538', kq / 10, 'Đổi tỉ số phần trăm sai, dịch ba chữ số thay vì hai chữ số')
      add('R407', a / 100 / n, 'Dùng phép chia thay cho phép nhân với số tự nhiên'); add('R540', kq + 0.01, 'Làm đúng cách nhưng lệch một đơn vị ở chữ số cuối')
    } else if (mau === 'so_chia') {
      const [a, n] = toks.map((t) => t.v); const kq = a / 100 / n
      add('R407', (a / 100) * n, 'Dùng phép nhân thay cho phép chia cho số tự nhiên'); add('R538', kq * 10, 'Đổi tỉ số phần trăm ra số thập phân sai chỗ dấu phẩy, kết quả gấp 10 lần'); add('R538', kq / 10, 'Đổi tỉ số phần trăm sai, dịch ba chữ số thay vì hai chữ số')
      add('R100', a / n, 'Chia phần số cho số tự nhiên và quên đổi ra số thập phân (quên chia 100)'); add('R540', kq + 0.01, 'Làm đúng cách nhưng lệch một đơn vị ở chữ số cuối')
    } else if (mau === 'so_chia_pt') {
      const n = toks[0].v, b = toks[1].v; const kq = n / (b / 100)
      add('R525', (n * b) / 100, 'Nhân với tỉ số phần trăm thay vì chia cho tỉ số phần trăm'); add('R101', n / ((100 - b) / 100), 'Lấy nhầm phần trăm bù (100% trừ tỉ số đã cho) rồi mới chia')
      add('R538', kq * 10, 'Đổi tỉ số phần trăm ra số thập phân sai chỗ dấu phẩy, kết quả gấp 10 lần'); add('R538', kq / 10, 'Đổi tỉ số phần trăm sai, dịch ba chữ số thay vì hai chữ số')
      add('R529', (b / 100) / n, 'Lấy tỉ số phần trăm chia cho số tự nhiên, chia ngược vai trò'); add('R540', kq + 0.1, 'Làm đúng cách nhưng lệch một chữ số ở bước chia cuối')
    }
  }
  // ───────── NDB02768 ─────────
  else if (c.dang === 'NDB02768') {
    const toks = [...ct.matchAll(/(\d+(?:,\d+)?)(\\%)?/g)].map((m) => ({ v: Number(m[1].replace(',', '.')), pct: !!m[2] }))
    const P = toks.filter((t) => t.pct).map((t) => t.v), Nn = toks.filter((t) => !t.pct).map((t) => t.v)
    const hasPlus = /\+/.test(ct); const kq = ans
    if (mau === 'tt_chung_cong' || mau === 'tt_chung_tru') {
      const [a, b] = P, M = Nn[0], cong = mau === 'tt_chung_cong'; const s = cong ? a + b : a - b
      add('R539', s / 100, `Chỉ ${cong ? 'cộng' : 'trừ'} hai tỉ số phần trăm trong ngoặc rồi dừng, quên nhân với thừa số chung`)
      add('R407', ((cong ? a - b : a + b) / 100) * M, `Nhóm đúng thừa số chung nhưng ${cong ? 'trừ' : 'cộng'} hai tỉ số phần trăm thay vì ${cong ? 'cộng' : 'trừ'}`)
      x10('Nhân với thừa số chung nhưng'); add('R100', s * M, 'Nhân thẳng phần số với thừa số chung, quên đổi tỉ số phần trăm ra số thập phân (quên chia 100)'); lech()
    } else if (mau === 'tt_ba_tich') {
      const [a, b, cc] = P, M = Nn[0], s = a + b + cc
      add('R539', s / 100, 'Chỉ cộng ba tỉ số phần trăm trong ngoặc rồi dừng, quên nhân với thừa số chung'); add('R407', ((a + b - cc) / 100) * M, 'Nhóm đúng thừa số chung nhưng trừ tỉ số cuối thay vì cộng')
      x10('Nhân với thừa số chung nhưng'); add('R100', s * M, 'Nhân thẳng phần số với thừa số chung, quên đổi tỉ số phần trăm ra số thập phân (quên chia 100)'); lech()
    } else if (mau === 'tt_cap_tron') {
      const a = P[0]; const pctLast = /\\%\$?$/.test(ct); const M = pctLast ? Nn[1] : Nn[0], n = pctLast ? Nn[0] : Nn[1]
      add('R408', (M * a) / 100, 'Mới nhân số chung với tỉ số phần trăm mà chưa nhân với số còn lại (dừng ở bước giữa)'); add('R407', ((M * a) / 100) / n, 'Chia cho số còn lại thay vì nhân với số còn lại'); x10('Nhóm đúng cặp số nhưng'); add('R100', M * a * n, 'Nhân phần số của tỉ số phần trăm với hai số còn lại, quên chia cho 100'); lech()
    } else if (mau === 'tt_tru_100') {
      const [a, b] = P, M = Nn[0]
      add('R101', (M * (a + b)) / 100, 'Lấy phần trăm bù: tính tổng hai tỉ số phần trăm của số chung thay vì phần còn lại'); add('R408', (M * (100 - a)) / 100, 'Mới trừ đi tỉ số phần trăm thứ nhất rồi dừng, bỏ sót tỉ số phần trăm thứ hai')
      add('R407', (M * (100 - a + b)) / 100, 'Cộng thay vì trừ tỉ số phần trăm thứ hai khi đặt thừa số chung'); x10('Đặt đúng thừa số chung nhưng'); lech()
    } else if (mau === 'tt_chung_pt_cong' || mau === 'tt_chung_pt_tru') {
      const a = P[0], [M, Nv] = Nn, cong = mau === 'tt_chung_pt_cong'; const S = cong ? M + Nv : M - Nv
      add('R539', S, `Chỉ ${cong ? 'cộng' : 'trừ'} hai số trong ngoặc rồi dừng, quên nhân với tỉ số phần trăm chung`); add('R407', (a / 100) * (cong ? M - Nv : M + Nv), `Đặt đúng thừa số chung nhưng ${cong ? 'trừ' : 'cộng'} hai số trong ngoặc thay vì ${cong ? 'cộng' : 'trừ'}`)
      x10('Đặt đúng thừa số chung nhưng'); add('R100', a * S, 'Nhân số trong ngoặc với phần số của tỉ số phần trăm, quên chia cho 100'); lech()
    }
  }
  // ───────── NDB02769 ─────────
  else if (c.dang === 'NDB02769') {
    if (mau === 'pc_tinh' || mau === 'pc_hs') {
      const M = N[0], a = Pc[0]
      add('R100', M * a, 'Lấy số nhân với phần số của tỉ số phần trăm, quên chia cho 100'); add('R525', (M * 100) / a, 'Chia số cho tỉ số phần trăm thay vì nhân'); add('R101', (M * (100 - a)) / 100, 'Lấy nhầm phần trăm bù: tính (100 − p)% của số thay vì p%')
      add('R538', (M * a) / 1000, 'Đổi tỉ số phần trăm ra số thập phân sai, dịch ba chữ số thay vì hai chữ số'); add('R538', (M * a) / 10, 'Đổi tỉ số phần trăm ra số thập phân sai, dịch một chữ số thay vì hai chữ số'); lech()
    } else if (mau === 'pc_con_lai') {
      const M = N[0], a = Pc[0], dung = (M * a) / 100
      add('R408', dung, 'Chỉ tính lượng đã dùng rồi dừng, quên lấy tổng trừ đi lượng đã dùng'); add('R407', M + dung, 'Cộng lượng đã dùng vào tổng thay vì trừ đi')
      add('R538', M - (M * a) / 1000, 'Tìm lượng đã dùng sai, dịch ba chữ số thay vì hai chữ số rồi mới trừ'); add('R538', M - (M * a) / 10, 'Tìm lượng đã dùng sai, dịch một chữ số thay vì hai chữ số rồi mới trừ'); lech()
    } else if (mau === 'pc_dien_tich') {
      const [D, R] = N, a = Pc[0], S = D * R
      add('R408', S, 'Chỉ tính diện tích cả mảnh đất rồi dừng, quên lấy tỉ số phần trăm của diện tích'); add('R527', (D * a) / 100, 'Tính tỉ số phần trăm của chiều dài thay vì của diện tích')
      add('R101', (S * (100 - a)) / 100, 'Lấy nhầm phần trăm bù: tính phần đất còn lại thay vì phần đất theo đề'); add('R100', S * a, 'Nhân diện tích với phần số của tỉ số phần trăm, quên chia cho 100'); add('R407', ((D + R) * a) / 100, 'Cộng chiều dài với chiều rộng thay vì nhân khi tính diện tích'); lech()
    } else if (mau === 'pc_tang') {
      const M = N[0], a = Pc[0], t = (M * a) / 100
      add('R531', t, 'Chỉ tính phần tăng thêm rồi dừng, quên cộng vào số ban đầu'); add('R530', M - t, 'Hiểu ngược thành giảm đi nên trừ phần tăng khỏi số ban đầu')
      add('R100', M + M * a, 'Tính phần tăng bằng cách nhân với phần số, quên chia cho 100'); add('R538', M + (M * a) / 10, 'Tính phần tăng sai, dịch một chữ số thay vì hai chữ số'); lech()
    }
  }
  // ───────── NDB02770 ─────────
  else if (c.dang === 'NDB02770') {
    if (mau === 'ts_tim_A' || mau === 'ts_phan_chiem') {
      const M = N[0], a = Pc[0]
      add('R525', (M * a) / 100, 'Nhân với tỉ số phần trăm thay vì chia cho tỉ số phần trăm'); add('R101', (M * 100) / (100 - a), 'Lấy nhầm phần trăm bù: chia cho (100 − p)% thay vì p%'); add('R538', (M * 10) / a, 'Đổi tỉ số phần trăm ra số thập phân sai, dịch một chữ số thay vì hai chữ số')
      add('R100', M / a, 'Chia cho phần số của tỉ số phần trăm, quên đổi ra số thập phân (quên chia 100)'); add('R538', (M * 1000) / a, 'Đổi tỉ số phần trăm sai, dịch ba chữ số thay vì hai chữ số'); lech()
    } else if (mau === 'ts_con_lai') {
      const k = N[0], a = Pc[0]
      add('R527', (k * 100) / a, 'Chia cho tỉ số phần trăm của phần không liên quan thay vì phần còn lại'); add('R525', (k * (100 - a)) / 100, 'Nhân với phần trăm còn lại thay vì chia'); add('R407', (k * 100) / (100 + a), 'Cộng thay vì trừ khi tìm phần trăm còn lại')
      x10('Tìm đúng phần trăm còn lại nhưng'); lech()
    } else if (mau === 'ts_tang' || mau === 'ts_giam') {
      const M = N[0], a = Pc[0], tang = mau === 'ts_tang'; const s = tang ? 100 + a : 100 - a, o = tang ? 100 - a : 100 + a
      add('R407', (M * 100) / o, `${tang ? 'Trừ' : 'Cộng'} thay vì ${tang ? 'cộng' : 'trừ'} khi tìm phần trăm so với số ban đầu`); add('R525', (M * s) / 100, 'Nhân với phần trăm thay vì chia cho phần trăm')
      add('R527', tang ? M - (M * a) / 100 : M + (M * a) / 100, `Tính ${a}% trên số đã cho (số sau) thay vì trên số ban đầu rồi ${tang ? 'trừ' : 'cộng'}`); x10('Chia đúng nhưng'); lech()
    } else if (mau === 'ts_doi_don_vi') {
      const sp = N[0], a = Pc[0]
      add('R408', (sp * 100) / a, 'Chia đúng ra số ki-lô-gam rồi dừng, quên đổi sang tạ'); add('R538', (sp * 10) / a, 'Đổi ki-lô-gam sang tạ sai, chia cho 10 thay vì 100'); add('R101', (sp * 100) / (100 - a) / 100, 'Lấy nhầm phần trăm bù: chia cho (100 − p)% rồi đổi sang tạ')
      add('R525', (sp * a) / 10000, 'Nhân với tỉ số phần trăm thay vì chia rồi đổi sang tạ'); lech()
    } else if (mau === 'ts_roi_pt') {
      const M = N[0], a = Pc[0], b = Pc[1], S = (M * 100) / a
      add('R531', S, 'Chỉ tìm số đó rồi dừng, quên tìm tiếp phần trăm thứ hai của số đó'); add('R527', (M * b) / 100, 'Tính phần trăm thứ hai của số đã cho thay vì của số cần tìm')
      add('R101', (S * (100 - b)) / 100, 'Lấy nhầm phần trăm bù: tính (100 − p)% của số đó'); add('R100', S * b, 'Nhân số đó với phần số của tỉ số phần trăm, quên chia cho 100'); x10('Làm đúng các bước nhưng'); lech()
    }
  }
  // ───────── NDB03001 ─────────
  else if (c.dang === 'NDB03001') {
    const pc = (r) => r * 100
    if (mau === 'ti_phan_cl') { const [Nn, k] = N; add('R529', (100 * Nn) / k, 'Chia ngược: lấy số cả chia cho số phần'); add('R527', (100 * k) / (Nn - k), 'Lấy số phần chia cho số còn lại thay vì chia cho số cả'); add('R101', 100 - ans, 'Lấy nhầm phần trăm bù: tính phần còn lại thay vì phần đã cho'); x10('Chia đúng nhưng'); lech() }
    else if (mau === 'ti_bang_pt') { const [A, B] = N; add('R529', (100 * A) / B, 'Chia ngược: lấy số năm trước chia cho số năm nay'); add('R528', ans - 100, 'Nhầm "bằng bao nhiêu phần trăm" với "hơn bao nhiêu phần trăm" nên trừ thêm 100%'); add('R101', 100 - ans, 'Lấy nhầm phần trăm bù: tính phần thiếu so với 100%'); add('R527', (100 * B) / (A + B), 'Lấy số sau chia cho tổng hai số thay vì chia cho số gốc'); x10('Chia đúng nhưng'); lech() }
    else if (mau === 'ti_hon_kem') { const [A, B] = N; add('R528', (100 * B) / A, 'Chia đúng ra số sau bằng bao nhiêu phần trăm số trước nhưng quên so với 100%'); add('R527', (100 * Math.abs(B - A)) / B, 'Tính phần chênh lệch trên số sau thay vì trên số trước'); add('R529', (100 * A) / B, 'Chia ngược: lấy số trước chia cho số sau'); x10('Tính đúng nhưng'); lech() }
    else if (mau === 'ti_ke_hoach_dat') { const [K, T] = N; add('R529', (100 * K) / T, 'Chia ngược: lấy kế hoạch chia cho thực tế'); add('R101', 100 - ans, 'Lấy nhầm phần trăm bù: tính phần chưa đạt kế hoạch'); add('R527', (100 * T) / (K + T), 'Lấy thực tế chia cho tổng kế hoạch và thực tế'); x10('Chia đúng nhưng'); lech() }
    else if (mau === 'ti_ke_hoach_vuot') { const [K, T] = N; add('R528', (100 * T) / K, 'Chia đúng ra số thực tế bằng bao nhiêu phần trăm kế hoạch nhưng quên trừ 100%'); add('R527', (100 * (T - K)) / T, 'Tính phần vượt trên số thực tế thay vì trên kế hoạch'); add('R101', 100 - ans, 'Lấy nhầm phần trăm bù: lấy 100% trừ phần vượt'); add('R529', (100 * (K - 0)) / T, 'Chia ngược: lấy kế hoạch chia cho thực tế'); x10('Tính đúng nhưng'); lech() }
    else if (mau === 'ti_nam_nu') { const [n, m] = N; add('R529', (100 * m) / n, 'Chia ngược: lấy số nữ chia cho số nam'); add('R528', ans - 100, 'Nhầm "bằng bao nhiêu phần trăm" với "hơn bao nhiêu phần trăm" nên trừ thêm 100%'); add('R527', (100 * n) / (n + m), 'Lấy số nam chia cho cả lớp thay vì chia cho số nữ'); add('R101', 100 - ans, 'Lấy nhầm phần trăm bù: lấy 100% trừ kết quả'); x10('Chia đúng nhưng'); lech() }
    else if (mau === 'ti_nu_cl') { const [n, m] = N; add('R527', (100 * m) / n, 'Lấy số nữ chia cho số nam thay vì chia cho cả lớp'); add('R101', (100 * n) / (n + m), 'Lấy nhầm phần trăm bù: tính tỉ số phần trăm của số nam'); add('R529', (100 * (n + m)) / m, 'Chia ngược: lấy cả lớp chia cho số nữ'); x10('Chia đúng nhưng'); lech() }
    else if (mau === 'ti_hieu_tong') { const [n, k] = N; const nu = n + k; add('R527', (100 * nu) / n, 'Lấy số nữ chia cho số nam thay vì chia cho cả lớp'); add('R101', (100 * n) / (n + nu), 'Lấy nhầm phần trăm bù: tính tỉ số phần trăm của số nam'); add('R529', (100 * (n + nu)) / nu, 'Chia ngược: lấy cả lớp chia cho số nữ'); x10('Chia đúng nhưng'); lech() }
    else if (mau === 'ti_don_vi') {
      const u = S.filter((x) => !x.pct); const f = { 'km>m': 1000, 'kg>g': 1000, 'm>cm': 100, 'tạ>kg': 100 }[`${u[0].unit}>${u[1].unit}`]; const W = u[0].v * f, p = u[1].v
      add('R527', (100 * p) / (W + p), 'Lấy phần đã có chia cho tổng của cả và phần thay vì chia cho cả'); add('R529', (100 * W) / p, 'Chia ngược: lấy số đo của cả chia cho số đo của phần'); add('R101', 100 - ans, 'Lấy nhầm phần trăm bù: tính phần còn lại thay vì phần đã dùng'); x10('Đổi đơn vị đúng nhưng'); lech()
    }
  }
  // ───────── NDB03000 ─────────
  else if (c.dang === 'NDB03000') {
    const toks = [...ct.matchAll(/(\d+)?(?:\\dfrac\{(\d+)\}\{(\d+)\})|(\d+(?:,\d+)?)/g)]
    if (mau === 'doi_stp_pt') {
      const x = Number(ct.replace(',', '.'))
      add('R538', x * 10, 'Đổi số thập phân ra phần trăm nhưng chỉ dịch dấu phẩy một chữ số'); add('R101', 100 - ans, 'Lấy nhầm phần trăm bù: lấy 100% trừ kết quả'); add('R538', x * 1000, 'Đổi số thập phân ra phần trăm nhưng dịch dấu phẩy ba chữ số')
      add('R529', 100 / x, 'Lấy 1 chia cho số thập phân (đảo ngược) rồi đổi ra phần trăm'); add('R100', x, 'Chỉ viết thêm dấu phần trăm sau số thập phân, quên dịch dấu phẩy sang phải hai chữ số'); lech()
    } else if (mau === 'doi_ps_pt') {
      const m = /\\dfrac\{(\d+)\}\{(\d+)\}/.exec(ct), a = +m[1], b = +m[2]
      add('R407', a * b, 'Nhân tử số với mẫu số thay vì chia tử số cho mẫu số'); add('R538', (a / b) * 10, 'Chia đúng ra số thập phân nhưng đổi sang phần trăm chỉ dịch dấu phẩy một chữ số'); add('R101', 100 - ans, 'Lấy nhầm phần trăm bù: lấy 100% trừ kết quả')
      add('R529', (100 * b) / a, 'Chia ngược: lấy mẫu số chia cho tử số'); add('R100', a / b, 'Chia tử cho mẫu rồi chỉ viết dấu phần trăm, quên dịch dấu phẩy sang phải hai chữ số'); lech()
    } else if (mau === 'doi_hs_pt') {
      const m = /(\d+)\\dfrac\{(\d+)\}\{(\d+)\}/.exec(ct), w = +m[1], a = +m[2], b = +m[3]
      add('R539', (100 * a) / b, 'Chỉ đổi phần phân số ra phần trăm, quên cộng phần nguyên'); add('R407', ((w * a) / b) * 100, 'Nhân phần nguyên với phân số thay vì cộng'); x10('Đổi đúng ra số thập phân nhưng'); add('R529', (100 * b) / (w * b + a), 'Chia ngược: lấy mẫu số chia cho tử số sau khi đổi hỗn số'); lech()
    } else if (mau === 'doi_pt_stp') {
      const p = Number(ct.replace('\\%', '').replace(',', '.'))
      add('R100', p, 'Chỉ bỏ dấu phần trăm, quên chia cho 100 (quên dịch dấu phẩy sang trái hai chữ số)'); add('R538', p / 10, 'Đổi ra số thập phân nhưng chỉ dịch dấu phẩy một chữ số'); add('R101', (100 - p) / 100, 'Lấy nhầm phần trăm bù: đổi (100 − p)% ra số thập phân'); add('R538', p / 1000, 'Đổi ra số thập phân nhưng dịch dấu phẩy ba chữ số'); lech()
    } else if (mau === 'doi_pt_ps') {
      const p = Number(ct.replace('\\%', '').replace(',', '.')); const dd = (String(p).split('.')[1] ?? '').length, mm = 10 ** dd
      const tu = Math.round(p * mm), mau_ = 100 * mm; const g = gcd(tu, mau_); const u = tu / g, v = mau_ / g
      const t10 = Math.round(p * mm), m10 = 1000 * mm
      addT('R538', frac(t10, m10), 'Đổi phần trăm ra phân số nhưng viết mẫu số 1000 thay vì 100 (dịch một chữ số)'); addT('R529', frac(v, u), 'Viết ngược phân số: mẫu số làm tử số'); addT('R101', frac(Math.round((100 - p) * mm), mau_), 'Lấy nhầm phần trăm bù: viết (100 − p)/100 rồi rút gọn')
      addT('R538', frac(t10, 10 * mm), 'Đổi phần trăm ra phân số nhưng viết mẫu số 10 thay vì 100'); addT('R540', frac(u + 1, v), 'Rút gọn đúng nhưng lệch một đơn vị ở tử số')
    } else if (mau === 'doi_danh_sach') {
      const items = ct.replace(/\\ /g, '').split(';')
      const vs = items.map((it) => { const mm = /^(\d+)?\\dfrac\{(\d+)\}\{(\d+)\}$/.exec(it); if (mm) return { loai: mm[1] ? 'hs' : 'ps', w: +(mm[1] ?? 0), a: +mm[2], b: +mm[3] }; return { loai: 'stp', x: Number(it.replace(',', '.')) } })
      const dung = vs.map((o) => (o.loai === 'stp' ? o.x * 100 : ((o.w * o.b + o.a) / o.b) * 100))
      add('R538', dung.map((v) => v * 10), 'Đổi mỗi số ra phần trăm nhưng chỉ dịch dấu phẩy một chữ số')
      add('R407', vs.map((o, i) => (o.loai === 'ps' ? o.a * o.b : o.loai === 'hs' ? o.a * o.b + o.w * 100 : dung[i])), 'Với phân số lấy tử số nhân mẫu số thay vì chia; hỗn số làm tương tự')
      if (vs.some((o) => o.loai === 'hs')) add('R539', vs.map((o, i) => (o.loai === 'hs' ? (o.a / o.b) * 100 : dung[i])), 'Với hỗn số chỉ đổi phần phân số, quên phần nguyên')
      add('R538', dung.map((v) => v / 10), 'Đổi mỗi số ra phần trăm nhưng dịch dấu phẩy sai một chữ số về bên trái')
      add('R540', dung.map((v, i) => (i === dung.length - 1 ? v + 1 : v)), 'Đổi đúng nhưng ý cuối lệch một đơn vị ở chữ số cuối')
    }
  }
  // ───────── NDB03553 ─────────
  else if (c.dang === 'NDB03553') {
    const e1 = (a) => Math.abs(100 - 2 * a)
    const hon = /nhiều hơn số|nhiều hơn/.test(d)
    if (mau === 'ht_hieu_mot_pt' || mau === 'ht_hieu_hai_y') {
      const a = Pc[0], k = N[0], e = e1(a), T = (k * 100) / e
      const ts = [
        ['R527', (k * 100) / a, 'Cho rằng hiệu hai bộ phận ứng với chính phần trăm đã cho nên lấy hiệu chia cho phần trăm đó'],
        ['R407', k, 'Cộng hai phần trăm thành 100% rồi chia hiệu cho 100% thay vì trừ hai phần trăm'],
        ['R101', (k * 100) / (100 - a), 'Lấy hiệu chia cho phần trăm của bộ phận còn lại thay vì chia cho hiệu hai phần trăm'],
        ['R525', (k * e) / 100, 'Nhân hiệu với hiệu hai phần trăm thay vì chia'],
        ['R538', T * 10, 'Tìm đúng hiệu hai phần trăm nhưng đổi ra số thập phân sai một chữ số'],
      ]
      for (const [rule, Tp, ds] of ts) { if (mau === 'ht_hieu_mot_pt') add(rule, Tp, ds); else { const A = (Tp * a) / 100; add(rule, [Tp, A, Tp - A], ds) } }
      if (mau === 'ht_hieu_mot_pt') lech(); else { { const A0 = (T * a) / 100; if (A0 !== T - A0) add('R101', [T, T - A0, A0], 'Lấy nhầm phần trăm bù: đổi chỗ số bộ phận chiếm a% với bộ phận còn lại'); add('R407', [T, A0, T + A0], 'Cộng thay vì trừ khi tìm bộ phận còn lại (lấy tổng cộng với bộ phận kia)') } add('R540', [T + 1, (T * a) / 100 + 1, T - (T * a) / 100], 'Làm đúng cách nhưng lệch một đơn vị ở bước tính tổng và phần chiếm a%') }
    } else if (mau === 'ht_hieu_hai_pt' || mau === 'ht_hieu_hai_pt_phan') {
      const [a, b] = Pc, k = N[0], T = (k * 100) / (a - b); const R = mau === 'ht_hieu_hai_pt_phan' ? (x, aa) => (x * aa) / 100 : (x) => x
      if (mau === 'ht_hieu_hai_pt') {
        add('R407', (k * 100) / (a + b), 'Cộng hai phần trăm thay vì trừ khi tìm hiệu ứng với bao nhiêu phần trăm'); add('R527', (k * 100) / a, 'Chia hiệu cho phần trăm của bộ phận lớn thay vì cho hiệu hai phần trăm')
        add('R101', (k * 100) / (100 - a - b), 'Chia hiệu cho phần trăm của phần còn lại thay vì cho hiệu hai phần trăm'); add('R408', k, 'Dừng lại ở số đã cho (hiệu hai bộ phận) và lấy luôn làm tổng, bỏ sót bước chia cho phần trăm'); add('R525', (k * (a - b)) / 100, 'Nhân hiệu với hiệu hai phần trăm thay vì chia'); x10('Tìm đúng hiệu hai phần trăm nhưng'); lech()
      } else {
        add('R408', T, 'Chỉ tìm tổng rồi dừng, quên tìm bộ phận chiếm a%'); add('R407', (((k * 100) / (a + b)) * a) / 100, 'Cộng hai phần trăm thay vì trừ khi tìm tổng, rồi mới tìm bộ phận')
        add('R101', (T * (100 - a)) / 100, 'Lấy nhầm phần trăm bù: tính bộ phận còn lại thay vì bộ phận chiếm a%'); add('R525', (k * a) / 100, 'Nhân hiệu với phần trăm thay vì tìm tổng rồi tìm bộ phận'); x10('Tìm đúng bộ phận nhưng'); lech()
      }
    } else if (mau === 'ht_tong_hai_pt') {
      const [a, b] = Pc, k = N[0]
      add('R407', (k * 100) / (a - b), 'Trừ thay vì cộng hai phần trăm khi tìm phần trăm ứng với tổng'); add('R527', (k * 100) / a, 'Chia tổng cho phần trăm của một bộ phận thay vì cho tổng hai phần trăm')
      add('R101', (k * 100) / (100 - a - b), 'Chia cho phần trăm của phần còn lại thay vì cho tổng hai phần trăm'); add('R408', k, 'Dừng lại ở tổng hai bộ phận và lấy luôn làm tổng cả, bỏ sót bước chia cho phần trăm'); add('R525', (k * (a + b)) / 100, 'Nhân với tổng hai phần trăm thay vì chia'); x10('Tìm đúng tổng hai phần trăm nhưng'); lech()
    } else if (mau === 'ht_bang_nhau_them') {
      const b = Pc[0], [n, m] = N, Tc = ((n - m) * 100) / (2 * b - 100)
      add('R531', Tc, 'Chỉ tìm tổng lúc sau rồi dừng, quên trừ số người nhận thêm'); add('R407', Tc + n + m, 'Cộng số người nhận thêm vào tổng lúc sau thay vì trừ đi')
      add('R527', ((n - m) * 100) / b - n - m, 'Chia hiệu cho phần trăm của bộ phận thay vì cho hiệu hai phần trăm'); add('R101', ((n - m) * 100) / (100 - b) - n - m, 'Chia hiệu cho phần trăm của bộ phận còn lại thay vì cho hiệu hai phần trăm'); x10('Tìm đúng tổng lúc đầu nhưng'); lech()
    } else if (mau === 'ht_sau_them_hoi_dau') {
      const a = Pc[0], [t, k] = N, T = (k * 100) / e1(a)
      add('R531', T, 'Chỉ tìm tổng lúc sau rồi dừng, quên trừ số người nhận thêm'); add('R407', T + t, 'Cộng số người nhận thêm vào thay vì trừ đi')
      add('R527', (k * 100) / a - t, 'Chia hiệu cho phần trăm của bộ phận thay vì cho hiệu hai phần trăm'); add('R101', (k * 100) / (100 - a) - t, 'Chia hiệu cho phần trăm của bộ phận còn lại thay vì cho hiệu hai phần trăm'); x10('Tìm đúng tổng nhưng'); lech()
    } else if (mau === 'ht_dau_hoi_sau') {
      const a = Pc[0], [k, t] = N, bot = /chuyển đi/.test(d), T = (k * 100) / e1(a), sg = bot ? -1 : 1
      add('R531', T, `Chỉ tìm tổng lúc đầu rồi dừng, quên ${bot ? 'trừ' : 'cộng'} số người ${bot ? 'chuyển đi' : 'nhận thêm'}`); add('R530', T - sg * t, `Hiểu ngược thành ${bot ? 'nhận thêm' : 'chuyển đi'} nên ${bot ? 'cộng' : 'trừ'} thay vì ${bot ? 'trừ' : 'cộng'}`)
      add('R527', (k * 100) / a + sg * t, 'Chia hiệu cho phần trăm của bộ phận thay vì cho hiệu hai phần trăm'); add('R101', (k * 100) / (100 - a) + sg * t, 'Chia hiệu cho phần trăm của bộ phận còn lại thay vì cho hiệu hai phần trăm'); x10('Tìm đúng tổng nhưng'); lech()
    } else if (mau === 'ht_tong_roi_them') {
      const [a, b] = Pc, [k, t] = N, T = (k * 100) / (a + b)
      add('R531', T, 'Chỉ tìm tổng lúc đầu rồi dừng, quên cộng số người mới thêm'); add('R530', T - t, 'Hiểu ngược thành bớt đi nên trừ thay vì cộng số người mới thêm')
      add('R527', (k * 100) / a + t, 'Chia tổng hai bộ phận cho phần trăm của một bộ phận rồi mới cộng'); add('R101', (k * 100) / (100 - a - b) + t, 'Chia cho phần trăm của phần còn lại thay vì cho tổng hai phần trăm rồi mới cộng'); add('R407', (k * 100) / (a - b) + t, 'Trừ thay vì cộng hai phần trăm khi tìm tổng'); lech()
    }
  }
  return L
}

// ── định dạng + lọc ──────────────────────────────────────────────────────────────────────────────────────────────
function thanhUngVien(c, L) {
  const ptu = ptuSo(c.dap_an); const tinh = ['NDB02767', 'NDB02768', 'NDB03000'].includes(c.dang)
  const nguyenCan = /(\$A=)?/.test('') && !/(kg|lít|\bm\b|km|tạ|tấn|cm|A=|\\%|\\dfrac)/.test(c.dap_an) && !tinh
  const kq = []
  for (const o of L) {
    let text
    if (o.text) text = o.text
    else {
      const vs = o.v.map(r6); if (vs.some((v) => !Number.isFinite(v) || v <= 0)) continue
      if (vs.some((v) => !dp(v, tinh ? 4 : 2))) continue
      if (nguyenCan && vs.some((v) => !Number.isInteger(v))) continue
      if (ptu) continue
      text = like(c.dap_an, vs)
    }
    kq.push({ text, rule: o.rule, duong_sai: o.ds })
  }
  return kq
}

export function sinhNhieu(lo) {
  const ra = [], loai = []
  for (const c of lo) {
    const ung = thanhUngVien(c, duongSai(c))
    const { chon, lyDo } = chonNhieu(c.dap_an, ung, RULE_INFO)
    if (chon.length < 3) { loai.push({ c, chon: chon.length, lyDo }); continue }
    const ids = new Set(chon.map((x) => x.text)); const them = []
    for (const nv of ung) { if (them.length + chon.length >= 6) break; if (ids.has(nv.text)) continue; if (kiemUngVien(c.dap_an, nv, RULE_INFO).length) continue; ids.add(nv.text); them.push(nv) }
    ra.push({ noi_dung: c.noi_dung, nhieu: [...chon, ...them] })
  }
  return { ra, loai }
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('k5T-pt-fill-A-mcq.mjs')) {
  const a = process.argv.slice(2), lay = (k, mac) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : mac }
  const lo = JSON.parse(readFileSync(lay('--vao', 'kho-rules/dai/clone/k5T-pt-fill-A.json'), 'utf8'))
  const { ra, loai } = sinhNhieu(lo)
  const ra_ = lay('--ra', 'kho-rules/dai/clone/k5T-pt-fill-A-mcq.json'); mkdirSync(dirname(ra_), { recursive: true }); writeFileSync(ra_, JSON.stringify(ra, null, 1))
  const theoDang = {}; for (const c of lo) theoDang[c.dang] = theoDang[c.dang] || { tong: 0, du: 0 }
  for (const c of lo) theoDang[c.dang].tong++
  const duSet = new Set(ra.map((x) => x.noi_dung)); for (const c of lo) if (duSet.has(c.noi_dung)) theoDang[c.dang].du++
  console.log('đủ nhiễu:', JSON.stringify(theoDang)); console.log('loại:', loai.length)
  for (const l of loai) console.log(`  ✘ ${l.c.dang}/${l.c.mau} [${l.c.dap_an}] chỉ ${l.chon} nhiễu · ${l.c.noi_dung.slice(0, 70).replace(/\n/g, ' ')}\n      ${l.lyDo.slice(0, 3).join(' | ')}`)
  console.log('→', ra_)
}
