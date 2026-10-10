// ============================================================================
// k8T-kiem.mjs — BỘ KIỂM ĐÁP SỐ BẰNG CODE cho câu khối 8T (biên bản "kiem-dap-so" của cổng ghi — kho-rules/dai/k8T.md §4).
//
// Khác k4T-kiem.mjs (mỗi câu một hàm viết tay): câu 8T phần lớn là BIẾN ĐỔI ĐẠI SỐ ⇒ một bộ TÍNH BIỂU THỨC LaTeX dùng chung,
// mỗi câu chỉ cần một dòng `kiem` viết TỪ ĐỀ ở trạm chép (tệp .cs.md → .bai.json):
//   bang    | <biểu thức đề>              đáp án phải BẰNG biểu thức đề tại mọi điểm thử (phân tích nhân tử, rút gọn, tính)
//   gia_tri | <biểu thức> | x=3009; y=1991   đáp án = giá trị biểu thức tại các giá trị cho trước
//   nghiem  | <vế trái> = <vế phải> | x     mỗi giá trị trong đáp án phải thoả phương trình (thiếu nghiệm thì máy KHÔNG thấy —
//                                           so thêm với ket_qua_sach ở kiemChep)
//   khong                                    bài chứng minh ⇒ 'khong_kiem_duoc' (không trả "đạt" giả)
// Số hữu tỉ BigInt (không sai số). Hai biểu thức bằng nhau ⇔ trùng giá trị tại 8 bộ số hữu tỉ ngẫu nhiên (cố định hạt giống).
// Cú pháp chưa đọc được (số mũ chứa chữ, căn, kí hiệu lạ) ⇒ ném lỗi ⇒ 'khong_kiem_duoc', KHÔNG đoán.
// ============================================================================
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const BS = String.fromCharCode(92)
// ── số hữu tỉ ────────────────────────────────────────────────────────────────
const ucln = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a }
const Q = (n, d = 1n) => { if (d === 0n) throw new Error('chia cho 0'); if (d < 0n) { n = -n; d = -d } const g = ucln(n, d) || 1n; return { n: n / g, d: d / g } }
const cong = (a, b) => Q(a.n * b.d + b.n * a.d, a.d * b.d), tru = (a, b) => Q(a.n * b.d - b.n * a.d, a.d * b.d)
const nhan = (a, b) => Q(a.n * b.n, a.d * b.d), chia = (a, b) => Q(a.n * b.d, a.d * b.n)
const bang = (a, b) => a.n === b.n && a.d === b.d
const luyThua = (a, k) => { if (k.d !== 1n) throw new Error('số mũ không nguyên'); let e = k.n; if (e < 0n) { a = chia(Q(1n), a); e = -e } if (e > 400n) throw new Error('số mũ quá lớn'); let r = Q(1n); for (let i = 0n; i < e; i++) r = nhan(r, a); return r }
export const chuoi = (x) => (x.d === 1n ? `${x.n}` : `${x.n}/${x.d}`)

// ── tách kí hiệu LaTeX ───────────────────────────────────────────────────────
const LENH = {   // lệnh LaTeX đọc được ⇒ kí hiệu; lệnh ngoài bảng ⇒ ném lỗi (KHÔNG bỏ qua im lặng: "\rightarrow" mà bỏ "\right" thì thành 5 biến)
  left: null, right: null, displaystyle: null, quad: null, ',': null, '!': null, ';': null, ' ': null,
  dfrac: 'F', tfrac: 'F', frac: 'F', cdot: '*', times: '*', lvert: 'A(', rvert: ')A', '{': '(', '}': ')',
}
const laSo = (c) => c >= '0' && c <= '9', laChu = (c) => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')
function tachKiHieu(s) {
  const t = String(s).normalize('NFC').replaceAll('$', '').replaceAll('−', '-').replaceAll('–', '-').replaceAll('{,}', ',')   // 16{,}87 = cách gõ số thập phân của kho
  const kq = []
  for (let i = 0; i < t.length;) {
    const c = t[i]
    if (c === ' ' || c === '\n' || c === '\t' || c === '\r') { i++; continue }
    if (c === BS) {
      let j = i + 1
      if (laChu(t[j] ?? '')) { while (j < t.length && laChu(t[j])) j++ } else j++
      const ten = t.slice(i + 1, j)
      if (!(ten in LENH)) throw new Error(`lệnh LaTeX chưa đọc được "${BS}${ten}" trong: ${String(s).slice(0, 60)}`)
      if (LENH[ten]) kq.push({ k: LENH[ten] })
      i = j; continue
    }
    if (laSo(c)) {
      let j = i; while (j < t.length && laSo(t[j])) j++
      const nguyen = t.slice(i, j)
      if (t[j] === ',' && laSo(t[j + 1] ?? '')) {
        let k = j + 1; while (k < t.length && laSo(t[k])) k++
        const thap = t.slice(j + 1, k)
        kq.push({ k: 'so', v: Q(BigInt(nguyen + thap), 10n ** BigInt(thap.length)), chu: null }); i = k; continue
      }
      kq.push({ k: 'so', v: Q(BigInt(nguyen)), chu: nguyen }); i = j; continue
    }
    if (laChu(c)) { kq.push({ k: 'bien', v: c }); i++; continue }
    if (c === '[') { kq.push({ k: '(' }); i++; continue }
    if (c === ']') { kq.push({ k: ')' }); i++; continue }
    if ('+-*:^(){}'.includes(c)) { kq.push({ k: c }); i++; continue }
    throw new Error(`kí hiệu chưa đọc được "${c}" trong: ${String(s).slice(0, 60)}`)
  }
  return kq
}

// ── tính giá trị (đệ quy đi xuống) ───────────────────────────────────────────
export function giaTri(latex, bien = {}) {
  const k = tachKiHieu(latex); let p = 0
  const xem = () => k[p], an = (x) => { if (k[p]?.k !== x) throw new Error(`thiếu "${x}" ở vị trí ${p} trong: ${String(latex).slice(0, 60)}`); p++ }
  const batDauThuaSo = () => { const t = xem(); return !!t && ['so', 'bien', '(', '{', 'F', 'A('].includes(t.k) }
  function bieuThuc() {
    let v
    if (xem()?.k === '-') { p++; v = tru(Q(0n), soHang()) } else { if (xem()?.k === '+') p++; v = soHang() }
    while (xem() && (xem().k === '+' || xem().k === '-')) { const d = k[p++].k; const s = soHang(); v = d === '+' ? cong(v, s) : tru(v, s) }
    return v
  }
  function soHang() {
    let v = thuaSo()
    for (;;) {
      const t = xem(); if (!t) break
      if (t.k === '*') { p++; v = nhan(v, thuaSoCoDau()) } else if (t.k === ':') { p++; v = chia(v, thuaSoCoDau()) } else if (batDauThuaSo()) v = nhan(v, thuaSo()); else break
    }
    return v
  }
  const thuaSoCoDau = () => { if (xem()?.k === '-') { p++; return tru(Q(0n), thuaSo()) } return thuaSo() }
  function thuaSo() {
    let v = coSo()
    while (xem()?.k === '^') { p++; v = luyThua(v, soMu()) }
    return v
  }
  /** đối số KHÔNG có ngoặc nhọn của ^ và \dfrac: LaTeX chỉ lấy MỘT kí tự — x^23 = x^2·3, \dfrac52 = 5/2, \dfrac12x = (1/2)x */
  function soMu() {
    const t = xem()
    if (t?.k === '{') { p++; const v = bieuThuc(); an('}'); return v }
    if (t?.k === 'so') { p++; if (t.chu && t.chu.length > 1) { k.splice(p, 0, { k: 'so', v: Q(BigInt(t.chu.slice(1))), chu: t.chu.slice(1) }); return Q(BigInt(t.chu[0])) } return t.v }
    if (t?.k === 'bien') { p++; return tra(t.v) }
    throw new Error('đối số của ^ hoặc phân số chưa đọc được')
  }
  const tra = (ten) => { if (!(ten in bien)) throw new Error(`biến "${ten}" chưa có giá trị`); return bien[ten] }
  function coSo() {
    const t = xem(); if (!t) throw new Error('biểu thức cụt: ' + String(latex).slice(0, 60))
    if (t.k === 'so') { p++; return t.v }
    if (t.k === 'bien') { p++; return tra(t.v) }
    if (t.k === '(') { p++; const v = bieuThuc(); an(')'); return v }
    if (t.k === '{') { p++; const v = bieuThuc(); an('}'); return v }
    if (t.k === 'A(') { p++; const v = bieuThuc(); an(')A'); return v.n < 0n ? Q(-v.n, v.d) : v }
    if (t.k === 'F') { p++; const a = soMu(), b = soMu(); return chia(a, b) }
    throw new Error(`gặp "${t.k}" ở chỗ cần một thừa số: ${String(latex).slice(0, 60)}`)
  }
  const v = bieuThuc()
  if (p !== k.length) throw new Error(`thừa kí hiệu từ vị trí ${p}: ${String(latex).slice(0, 60)}`)
  return v
}
const cacBien = (s) => [...new Set(tachKiHieu(s).filter((t) => t.k === 'bien').map((t) => t.v))]

// bộ số thử cố định: phân số nhỏ, khác 0, khác nhau giữa các biến ⇒ chạy lại ra đúng kết quả cũ
function* boSoThu(bien, soBo = 8) {
  let h = 20261010
  const ngau = () => { h = (h * 1103515245 + 12345) % 2147483648; return h }
  for (let i = 0; i < soBo; i++) {
    const b = {}
    for (const x of bien) { const tu = BigInt((ngau() % 13) - 6) || 7n, mau = BigInt((ngau() % 4) + 1); b[x] = Q(tu * 5n + BigInt(i + 1), mau * 3n + 1n) }
    yield b
  }
}
/** hai biểu thức bằng nhau tại mọi bộ số thử? trả { bang, vi_du? } — bộ nào làm mẫu bằng 0 thì bỏ qua (cần ≥ 5 bộ dùng được) */
export function bangNhau(a, b) {
  const bien = [...new Set([...cacBien(a), ...cacBien(b)])]
  let dung = 0
  for (const bo of boSoThu(bien, 12)) {
    let x, y
    try { x = giaTri(a, bo); y = giaTri(b, bo) } catch (e) { if (/chia cho 0/.test(e.message)) continue; throw e }
    dung++
    if (!bang(x, y)) return { bang: false, vi_du: `${bien.map((v) => `${v}=${chuoi(bo[v])}`).join(', ')} ⇒ ${chuoi(x)} ≠ ${chuoi(y)}` }
  }
  if (dung < 5) throw new Error('không đủ bộ số thử dùng được')
  return { bang: true }
}

// ── đọc đáp án ───────────────────────────────────────────────────────────────
const boDola = (s) => String(s).replaceAll('$', '').trim()
/** các giá trị nghiệm trong đáp án: "S=\{0;2;-2\}" · "x=1" · "x=1; x=-2" · "x \in \{…\}" */
export function docNghiem(dapAn) {
  let s = boDola(dapAn).replaceAll(BS + 'left', '').replaceAll(BS + 'right', '')
  const mo = s.indexOf(BS + '{'), dong = s.lastIndexOf(BS + '}')
  if (mo >= 0 && dong > mo) s = s.slice(mo + 2, dong)
  return s.split(';').map((x) => x.trim()).filter(Boolean).map((x) => (x.includes('=') ? x.slice(x.lastIndexOf('=') + 1).trim() : x))
}
const sauDauBang = (s) => { const t = boDola(s); return t.includes('=') ? t.slice(t.lastIndexOf('=') + 1).trim() : t }

/** `kiem` của một bài (chuỗi "bang | …") ⇒ { kieu, … } */
export function docKiem(dong) {
  const p = String(dong ?? '').split('|').map((x) => x.trim())
  if (p[0] === 'bang' && p[1]) return { kieu: 'bang', bieu_thuc: p[1] }
  if (p[0] === 'gia_tri' && p[1] && p[2]) return { kieu: 'gia_tri', bieu_thuc: p[1], gan: Object.fromEntries(p[2].split(';').map((g) => g.split('=').map((x) => x.trim())).filter((g) => g.length === 2)) }
  if (p[0] === 'nghiem' && p[1]?.includes('=') && p[2]) { const i = p[1].indexOf('='); return { kieu: 'nghiem', ve_trai: p[1].slice(0, i).trim(), ve_phai: p[1].slice(i + 1).trim(), bien: p[2] } }
  return { kieu: 'khong' }
}

/** so MỘT chuỗi kết quả (đáp án kho hoặc kết quả sách) với đề theo `kiem`. Trả { ket_qua: dat|khong_dat|khong_kiem_duoc, ghi_chu } */
export function soVoiDe(kiem, ketQua, ten = 'đáp án') {
  try {
    if (kiem.kieu === 'bang') {
      const r = bangNhau(kiem.bieu_thuc, boDola(ketQua).includes('=') ? sauDauBang(ketQua) : boDola(ketQua))
      return r.bang ? { ket_qua: 'dat', ghi_chu: `máy thay số: ${ten} bằng biểu thức đề tại mọi bộ số thử` }
        : { ket_qua: 'khong_dat', ghi_chu: `${ten} KHÁC biểu thức đề: ${r.vi_du}` }
    }
    if (kiem.kieu === 'gia_tri') {
      const gan = Object.fromEntries(Object.entries(kiem.gan).map(([k, v]) => [k, giaTri(v)]))
      const can = giaTri(kiem.bieu_thuc, gan), co = giaTri(sauDauBang(ketQua))
      return bang(can, co) ? { ket_qua: 'dat', ghi_chu: `máy tự tính lại từ đề: ${chuoi(can)}` } : { ket_qua: 'khong_dat', ghi_chu: `máy tính ra ${chuoi(can)}, ${ten} ghi ${chuoi(co)}` }
    }
    if (kiem.kieu === 'nghiem') {
      const ds = docNghiem(ketQua)
      if (!ds.length) return { ket_qua: 'khong_dat', ghi_chu: `${ten} không có nghiệm nào đọc được` }
      const sai = []
      for (const x of ds) { const v = { [kiem.bien]: giaTri(x) }; if (!bang(giaTri(kiem.ve_trai, v), giaTri(kiem.ve_phai, v))) sai.push(x) }
      return sai.length ? { ket_qua: 'khong_dat', ghi_chu: `không thoả phương trình: ${kiem.bien}=${sai.join('; ')}` }
        : { ket_qua: 'dat', ghi_chu: `máy thay ngược: ${ds.length} nghiệm (${ds.join('; ')}) đều thoả phương trình — máy KHÔNG kiểm được thiếu nghiệm` }
    }
  } catch (e) { return { ket_qua: 'khong_kiem_duoc', ghi_chu: `máy chưa đọc được: ${e.message}`.slice(0, 200) } }
  return { ket_qua: 'khong_kiem_duoc', ghi_chu: 'bài chứng minh / chưa có cách kiểm bằng máy' }
}

// ── dữ liệu bài (mọi *.bai.json trong kho-rules/dai/lo/k8T/) ──────────────────
const THU_MUC = join(dirname(fileURLToPath(import.meta.url)), 'k8T')
let BAI = null
function napBai() {
  if (BAI) return BAI
  BAI = new Map()
  if (existsSync(THU_MUC)) for (const f of readdirSync(THU_MUC).filter((x) => x.endsWith('.bai.json'))) for (const b of JSON.parse(readFileSync(join(THU_MUC, f), 'utf8'))) BAI.set(b.ma, b)
  return BAI
}
/** CỔNG GHI gọi: kiemDapSo(mã nguồn, đáp án sắp ghi) */
export function kiemDapSo(maNguon, dapAn) {
  const b = napBai().get(maNguon)
  if (!b) return { ket_qua: 'khong_kiem_duoc', ghi_chu: 'không thấy bài này trong *.bai.json' }
  return soVoiDe(docKiem(b.kiem), dapAn)
}
/** KIỂM CHÉP: kết quả của SÁCH có khớp ĐỀ đã chép không (hai mẩu chép độc lập trên cùng trang) */
export function kiemChep(b) {
  if (!b.ket_qua_sach) return { ket_qua: 'khong_kiem_duoc', ghi_chu: 'sách không ghi kết quả' }
  return soVoiDe(docKiem(b.kiem), b.ket_qua_sach, 'kết quả của sách')
}
