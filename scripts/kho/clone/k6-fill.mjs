// ============================================================================
// k6-fill.mjs — fill nốt kho Đại K6 cho đủ 30 câu dùng được/dạng (spec-giai-bai §C13, Thùy 21/11).
//
//   node scripts/kho/clone/k6-fill.mjs hao [--ghi]                 # 3 dạng CÓ gốc nhưng hao do loại: NDB00367 · 00403 · 01229
//   node scripts/kho/clone/k6-fill.mjs moi [--dang NDB01224,...] [--ghi]   # 6 dạng 0 gốc: NDB01224 · 01231 · 01410 · 01619 · 01621 · 03068
//
// Mặc định CHẠY THỬ (không ghi DB, `moi` chạy trong transaction rồi ROLLBACK); --ghi mới ghi thật.
// · hao: đặt yêu cầu clone (dai_cau_hoi_yeu_cau_clone) + `hangdoi-clone.mjs --ghi` vào bảng nháp → duyệt bằng
//        `duyet-nhap-clone.mjs --dang <NDB…> [--ghi]` (bộ kiểm trong k6-fill-kiem.mjs).
// · moi: BÀI LẺ theo chỉ định dạng (§C11): bộ sinh bằng code (đáp số tính bằng code) → bộ kiểm ĐỘC LẬP đọc lại đề từ chữ
//        (k6-fill-kiem.mjs) → cổng `cong-ghi` → `_kho_insert` (dang_bai + dang_bai_chot) → da_duyet=true duyet_nguon='ai'.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'
import { xetGoi, bamNoiDung } from '../cong-ghi.mjs'
import { insertCauBatch } from '../../_kho_insert.mjs'
import { KIEM_K6 } from './k6-fill-kiem.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const env = Object.fromEntries(readFileSync(join(root, '.env'), 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const [LENH, ...rest] = process.argv.slice(2)
const GHI = rest.includes('--ghi')
const CHI_DANG = rest.includes('--dang') ? rest[rest.indexOf('--dang') + 1].split(',') : null

// ── tiện ích chung ────────────────────────────────────────────────────────────────────────────────
const gcd = (a, b) => (b ? gcd(b, a % b) : a)
const uoc = (n) => { const r = []; for (let i = 1; i <= n; i++) if (n % i === 0) r.push(i); return r }
const fac = (n) => { const f = []; for (let p = 2; p * p <= n; p++) { let e = 0; while (n % p === 0) { n /= p; e++ } if (e) f.push([p, e]) } if (n > 1) f.push([n, 1]); return f }
const facStr = (n) => fac(n).map(([p, e]) => (e > 1 ? `${p}^${e}` : `${p}`)).join('.')
const pw = (b, e) => (e === 1 ? `${b}` : e < 10 ? `${b}^${e}` : `${b}^{${e}}`)
const ngoac = (n) => (n < 0 ? `(${n})` : `${n}`)
const bangU = (n) => `\\{${uoc(n).join(';')}\\}`
let seed = 20261121
const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296 }
const tron = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a }
const LG = (chot, buoc, trinhBay, chuY) => `**Phần 1. Hướng dẫn**\n\n**Mấu chốt:** ${chot}\n\n${buoc.map((b, i) => `**Bước ${i + 1}.** ${b}`).join('\n\n')}${chuY ? `\n\n**Chú ý:** ${chuY}` : ''}\n\n**Phần 2. Trình bày**\n\n${trinhBay.join('\n\n')}`

// ═════════════════════════════════════════ NDB00367 — dãy luỹ thừa xen dấu (clone) ═════════════════════════════════
function xenDau(b, k, m, ten) {
  const n = k * m, D = b ** k + 1
  const dau = k === 1 ? `1-${b}+${pw(b, 2)}-\\dots+${pw(b, n)}` : `1-${pw(b, k)}+${pw(b, 2 * k)}-\\dots+${pw(b, n)}`
  const kq = `\\dfrac{${pw(b, n + k)}+1}{${D}}`
  const nhan = `${pw(b, k)}.(${dau})`
  return {
    noi_dung: `Tính $${ten}=${dau}$`, dap_an: `$${kq}$`,
    loi_giai: LG(`nhân tổng với $${pw(b, k)}$ rồi **cộng** với tổng ban đầu (vì các dấu xen kẽ nhau), các số hạng giữa triệt tiêu nhau.`, [
      'Nhận ra dấu của các số hạng đan xen $+,-$ và mỗi số hạng gấp số hạng trước (không kể dấu) cùng một lũy thừa của cơ số.',
      `Nhân $${ten}$ với $${pw(b, k)}$: mỗi số hạng của tích có dấu ngược với số hạng cùng luỹ thừa trong dãy ban đầu.`,
      `Cộng $${pw(b, k)}${ten}$ với $${ten}$: các số hạng giữa triệt tiêu nhau, chỉ còn số hạng cuối của $${pw(b, k)}${ten}$ cộng số hạng đầu của $${ten}$.`,
      `Rút $${ten}$ bằng cách chia hai vế cho hệ số $${D}$ (là $${pw(b, k)}+1$).`], [
      `Ta có $${pw(b, k)}${ten}=${nhan}=${pw(b, k)}-${pw(b, 2 * k)}+${pw(b, 3 * k)}-\\dots+${pw(b, n + k)}$`,
      `Suy ra $${pw(b, k)}${ten}+${ten}=(${pw(b, k)}-${pw(b, 2 * k)}+${pw(b, 3 * k)}-\\dots+${pw(b, n + k)})+(${dau})$`,
      `$${D}${ten}=${pw(b, n + k)}+1$`, `$${ten}=${kq}$`]),
  }
}
const HAO_00367 = [[10, 1, 18, 'S'], [3, 2, 18, 'P'], [4, 3, 12, 'Q'], [6, 1, 14, 'T'], [9, 2, 16, 'U'], [8, 2, 22, 'V'], [2, 6, 10, 'W'], [3, 3, 14, 'Y']].map((a) => xenDau(...a))

// ═════════════════════════════════════════ NDB00403 — toán thực tế ƯC (clone) ═══════════════════════════════════════
const VAT = [['quyển vở', 'bút bi'], ['chiếc bút', 'quyển sổ'], ['hộp bút chì', 'cục tẩy'], ['gói bánh', 'hộp sữa']]
function chiaPhanThuong(A, B, t, lop, vi) {
  const d = gcd(A, B), us = uoc(d), k = us[us.length - 2], [n1, n2] = VAT[vi % VAT.length]
  return {
    noi_dung: `Tổ ${t} của lớp ${lop} được nhận phần thưởng của cô giáo chủ nhiệm và mỗi em được nhận phần thưởng như nhau.\nCô giáo chủ nhiệm đã chia hết ${A} ${n1} và ${B} ${n2}.\nHỏi số học sinh tổ ${t} của lớp ${lop} là bao nhiêu? Biết mỗi tổ của lớp có số học sinh nhiều hơn ${k}.`,
    dap_an: String(d),
    loi_giai: LG('số học sinh phải chia hết cả hai số lượng phần thưởng nên là **ước chung**; dùng ƯCLN để liệt kê rồi chọn theo điều kiện của đề.', [
      'Gọi số học sinh là $x$; vì chia hết cả hai loại phần thưởng cho mọi em nên $x$ là ước chung của hai số lượng.',
      'Phân tích hai số ra thừa số nguyên tố, tìm ƯCLN.', 'Ước chung là các ước của ƯCLN: liệt kê tất cả.', 'Chọn giá trị thoả điều kiện số học sinh nhiều hơn mức đề cho.'], [
      `Gọi số học sinh của tổ ${t} là $x$ (học sinh) $(x\\in\\mathbb{N}^*)$.`,
      `Vì cô chủ nhiệm chia hết ${A} ${n1} và ${B} ${n2} và mỗi học sinh nhận phần thưởng như nhau nên $x\\in\\text{UC}(${A},${B})$.`,
      `$${A}=${facStr(A)}$\n$${B}=${facStr(B)}$\n$\\text{UCLN}(${A},${B})=${facStr(d)}=${d}$`,
      `$\\text{UC}(${A},${B})=\\text{Ư}(${d})=${bangU(d)}$`,
      `Vì số học sinh mỗi tổ nhiều hơn ${k} nên $x=${d}$.`, `Vậy tổ ${t} có ${d} học sinh.`]),
  }
}
const HAO_00403 = [[96, 72, '4', '6D'], [45, 75, '2', '6A'], [64, 80, '3', '6C'], [90, 150, '1', '6E'], [84, 126, '2', '6B'], [108, 144, '3', '6A'], [70, 105, '1', '6D'], [66, 88, '4', '6C']].map((a, i) => chiaPhanThuong(...a, i))

// ═════════════════════════════════════════ NDB01229 — tích bằng số (clone) ═══════════════════════════════════════════
const fstr = (a, b, s) => `${a === 1 ? '' : a}${s}${b > 0 ? `+${b}` : b < 0 ? `${b}` : ''}`
function giai1(a, b, u, s) {
  const t = u - b, ax = `${a === 1 ? '' : a}${s}`
  if (b === 0) { if (u % a) return { ok: false, txt: `$${ax}=${u}$, mà $${u}$ không chia hết cho $${a}$ nên $${s}$ không là số tự nhiên` }; return { ok: true, val: u / a, txt: a === 1 ? `$${s}=${u}$` : `$${s}=${u}:${a}=${u / a}$` } }
  if (b > 0) {
    if (u < b) return { ok: false, txt: `$${ax}=${u}-${b}$ không là số tự nhiên (vì $${u}<${b}$)` }
    if (t % a) return { ok: false, txt: `$${ax}=${u}-${b}=${t}$, mà $${t}$ không chia hết cho $${a}$ nên $${s}$ không là số tự nhiên` }
    return { ok: true, val: t / a, txt: a === 1 ? `$${s}=${u}-${b}=${t}$` : `$${ax}=${u}-${b}=${t}$ nên $${s}=${t}:${a}=${t / a}$` }
  }
  if (a !== 1) throw new Error('hằng âm chỉ dùng với hệ số 1')
  return { ok: true, val: u - b, txt: `$${s}=${u}+${-b}=${u - b}$` }
}
function tichXY([a1, b1, a2, b2, N], kieu = 0) {
  const f1 = fstr(a1, b1, 'x'), f2 = fstr(a2, b2, 'y')
  const dau = ['Tìm các số tự nhiên $x,\\ y$ biết:', 'Tìm cặp số tự nhiên $x$, $y$ biết:', 'Tìm $x;\\ y\\in\\mathbb{N}$, biết:'][kieu % 3]
  const ve = b1 === 0 && a1 === 1 ? `x(${f2})` : `(${f1})(${f2})`
  const sol = [], dong = []
  for (const u of uoc(N)) {
    const v = N / u, g1 = giai1(a1, b1, u, 'x')
    if (!g1.ok) { dong.push(`Với $${f1}=${u}$ thì ${g1.txt}, loại.`); continue }
    const g2 = giai1(a2, b2, v, 'y')
    if (!g2.ok) { dong.push(`Với $${f1}=${u}$ thì ${g1.txt}; khi đó $${f2}=${N}:${u}=${v}$ nên ${g2.txt}, loại.`); continue }
    sol.push(`(${g1.val};${g2.val})`)
    dong.push(`Với $${f1}=${u}$ thì ${g1.txt}; khi đó $${f2}=${N}:${u}=${v}$ nên ${g2.txt}.`)
  }
  if (!sol.length) throw new Error('vô nghiệm ' + ve)
  return {
    noi_dung: `${dau} $${ve}=${N}$`, dap_an: null,
    loi_giai: LG(`tích hai thừa số bằng ${N} nên mỗi thừa số là **ước** của ${N}; liệt kê các ước rồi tìm $x$, $y$.`, [
      `Xác định vai trò: $${f1}$ và $${f2}$ là hai số tự nhiên nhân với nhau ra ${N}, nên $${f1}$ là một ước của ${N} và $${f2}$ là thương của ${N} cho $${f1}$.`,
      `Liệt kê các ước của ${N} bằng cách thử chia lần lượt cho các số tự nhiên nhỏ.`,
      'Từ mỗi ước, tìm $x$ rồi tìm $y$ theo quy tắc tìm thành phần chưa biết (số hạng chưa biết = tổng − số hạng đã biết, số bị trừ = hiệu + số trừ, thừa số chưa biết = tích : thừa số đã biết).',
      'Kiểm tra điều kiện $x$, $y$ là số tự nhiên (nhớ $x=0$ hoặc $y=0$ vẫn được vì $\\mathbb{N}$ có số 0; giá trị âm hay không nguyên thì loại) rồi viết các cặp $(x;y)$ thoả mãn.'], [
      `Vì $x;\\ y\\in\\mathbb{N}$ và $(${f1}).(${f2})=${N}$ nên $${f1}\\in\\text{Ư}(${N})$ và $${f2}=${N}:(${f1})$.`,
      `Ta có $\\text{Ư}(${N})=${bangU(N)}$.`, ...dong, `Vậy $(x;y)\\in\\{${sol.join(';')}\\}$.`], `để phép trừ thực hiện được trong $\\mathbb{N}$ thì thừa số có dấu trừ phải đủ lớn; thừa số không thể bằng 0 vì khi đó tích bằng 0, không bằng ${N}.`),
  }
}
const HAO_01229 = [[1, 6, 1, -2, 40], [2, 3, 1, -3, 55], [1, -3, 2, 1, 35], [1, 0, 1, -6, 42], [3, 1, 1, 2, 40], [1, 2, 1, -4, 45]].map((a, i) => tichXY(a, i))

// ═════════════════════════════════════════ NDB03068 — tìm a<b khi biết BCNN và tích ═════════════════════════════════
function bcnnTich(d, q, kieu) {
  const L = d * q, P = d * d * q, pairs = []
  for (let m = 1; m * m < q; m++) if (q % m === 0) pairs.push([m, q / m])
  const ok = pairs.filter(([m, n]) => gcd(m, n) === 1)
  const dong = pairs.map(([m, n]) => gcd(m, n) === 1
    ? `Với $m=${m}$, $n=${n}$: $\\text{UCLN}(${m},${n})=1$ nên nhận, khi đó $a=${d}.${m}=${d * m}$, $b=${d}.${n}=${d * n}$.`
    : `Với $m=${m}$, $n=${n}$: $\\text{UCLN}(${m},${n})=${gcd(m, n)}\\ne 1$ nên loại.`)
  const cap = ok.map(([m, n]) => `(${d * m};${d * n})`).join(';')
  const de = kieu % 2 === 0
    ? `Tìm hai số tự nhiên $a$ và $b$ với $a<b$, biết $\\text{BCNN}(a,b)=${L}$ và $a.b=${P}$.`
    : `Tìm các số tự nhiên $a,\\ b$ ($a<b$) biết $a.b=${P}$ và $\\text{BCNN}(a,b)=${L}$.`
  return {
    noi_dung: de, dap_an: `$(a;b)\\in\\{${cap}\\}$`,
    loi_giai: LG('dùng $\\text{UCLN}(a,b).\\text{BCNN}(a,b)=a.b$ để tìm UCLN, rồi đặt $a=d.m$, $b=d.n$ với $m,n$ nguyên tố cùng nhau.', [
      'Tính $\\text{UCLN}(a,b)=a.b:\\text{BCNN}(a,b)$.', 'Đặt $a=d.m$, $b=d.n$ với $\\text{UCLN}(m,n)=1$ và $m<n$; thay vào tích $a.b$ để tìm $m.n$.',
      'Liệt kê các cặp $(m;n)$ có tích $m.n$ vừa tìm, $m<n$, rồi loại cặp không nguyên tố cùng nhau.', 'Tính lại $a=d.m$, $b=d.n$ và kết luận.'], [
      `Ta có $\\text{UCLN}(a,b).\\text{BCNN}(a,b)=a.b$ nên $\\text{UCLN}(a,b)=${P}:${L}=${d}$.`,
      `Đặt $a=${d}.m$, $b=${d}.n$ với $m,n\\in\\mathbb{N}^*$, $\\text{UCLN}(m,n)=1$ và $m<n$ (vì $a<b$).`,
      `Khi đó $a.b=${d}.m.${d}.n=${d * d}.m.n=${P}$ nên $m.n=${P}:${d * d}=${q}$.`,
      `Các cặp $(m;n)$ với $m<n$ và $m.n=${q}$:`, ...dong, `Vậy $(a;b)\\in\\{${cap}\\}$.`]),
  }
}
const MOI_03068 = [[2, 30], [3, 36], [4, 24], [5, 42], [6, 20], [7, 30], [8, 18], [9, 48], [10, 12], [11, 60], [12, 36], [3, 60], [4, 72], [5, 30], [6, 90], [7, 24], [8, 42], [9, 20], [2, 72], [3, 18], [4, 90], [5, 36], [10, 30], [6, 48], [12, 18], [7, 60], [2, 48], [15, 24], [11, 30], [9, 72], [13, 30], [14, 18], [4, 36]].map(([d, q], i) => bcnnTich(d, q, i))

// ═════════════════════════════════════════ NDB01231 — chứng minh dãy luỹ thừa là số chính phương ════════════════════
const SQ = (k) => { const s = Math.round(Math.sqrt(k)); return s * s === k ? s : null }
const dayStr = (k, s, r, e) => { // k^s + k^{s+r} + k^{s+2r} + … + k^e
  const mu = (x) => (x === 0 ? '1' : pw(k, x))
  return `${mu(s)}+${mu(s + r)}+${mu(s + 2 * r)}+\\dots+${mu(e)}`
}
function scpMot(k, e, kieu, ten) { // kieu 'F1': A=1+k+…+k^e, (k-1)A+1 ; 'F2': A=k+…+k^e, (k-1)A+k
  const s = kieu === 'F1' ? 0 : 1, hs = k - 1, cong = kieu === 'F1' ? '1' : `${k}`
  const A = dayStr(k, s, 1, e), kA = dayStr(k, s + 1, 1, e + 1)
  const mu = e + 1, sq = SQ(k)
  const ketLuan = mu % 2 === 0
    ? [`Vì $${mu}=2.${mu / 2}$ nên $${pw(k, mu)}=(${pw(k, mu / 2)})^2=${pw(k, mu / 2)}.${pw(k, mu / 2)}$.`]
    : [`Vì $${k}=${sq}^2$ nên $${pw(k, mu)}=(${sq}^2)^{${mu}}=${sq}^{${2 * mu}}=(${pw(sq, mu)})^2=${pw(sq, mu)}.${pw(sq, mu)}$.`]
  return {
    noi_dung: `Cho $${ten}=${A}$. Chứng minh rằng $${hs === 1 ? '' : hs}${ten}+${cong}$ là số chính phương.`, dap_an: null,
    loi_giai: LG(`nhân dãy với cơ số rồi trừ đi dãy ban đầu để rút gọn thành $${pw(k, mu)}-${kieu === 'F1' ? 1 : k}$, từ đó biểu thức cần chứng minh bằng một luỹ thừa; luỹ thừa có số mũ chẵn (hoặc cơ số là số chính phương) thì là số chính phương.`, [
      `Nhân $${ten}$ với ${k}.`, `Lấy $${k}${ten}-${ten}$: các số hạng ở giữa triệt tiêu nhau.`, `Suy ra biểu thức đề cho bằng một luỹ thừa của ${k}.`, 'Viết luỹ thừa đó dưới dạng tích hai thừa số bằng nhau để kết luận số chính phương.'], [
      `Ta có $${k}${ten}=${k}.(${A})=${kA}$.`,
      `Suy ra $${k}${ten}-${ten}=(${kA})-(${A})$, tức $${hs === 1 ? '' : hs}${ten}=${pw(k, mu)}-${kieu === 'F1' ? 1 : k}$.`,
      `Do đó $${hs === 1 ? '' : hs}${ten}+${cong}=${pw(k, mu)}$.`, ...ketLuan, `Vậy $${hs === 1 ? '' : hs}${ten}+${cong}$ là số chính phương.`]),
  }
}
function scpBinh(k, m, ten) { // C=1+k²+k⁴+…+k^{2m}; (k²-1)C+1 = k^{2m+2}
  const K2 = k * k, C = dayStr(k, 0, 2, 2 * m), kC = `${K2}.(${C})`
  const sh = `${pw(k, 2)}+${pw(k, 4)}+${pw(k, 6)}+\\dots+${pw(k, 2 * m + 2)}`
  return {
    noi_dung: `Cho $${ten}=${C}$. Chứng minh rằng $${K2 - 1}${ten}+1$ là số chính phương.`, dap_an: null,
    loi_giai: LG(`mỗi số hạng gấp số hạng trước $${K2}$ lần nên nhân dãy với $${K2}$ rồi trừ dãy ban đầu để rút gọn; kết quả là luỹ thừa số mũ chẵn nên là số chính phương.`, [
      `Nhận ra công bội của dãy là $${K2}=${k}^2$.`, `Nhân $${ten}$ với $${K2}$ rồi lấy trừ $${ten}$: các số hạng giữa triệt tiêu.`, `Suy ra $${K2 - 1}${ten}+1$ bằng một luỹ thừa của ${k} với số mũ chẵn.`, 'Viết dưới dạng bình phương một số tự nhiên và kết luận.'], [
      `Ta có $${K2}${ten}=${kC}=${sh}$.`,
      `Suy ra $${K2}${ten}-${ten}=(${sh})-(${C})$, tức $${K2 - 1}${ten}=${pw(k, 2 * m + 2)}-1$.`,
      `Do đó $${K2 - 1}${ten}+1=${pw(k, 2 * m + 2)}=(${pw(k, m + 1)})^2$.`, `Vậy $${K2 - 1}${ten}+1$ là số chính phương.`]),
  }
}
const MOI_01231 = [
  ...[[3, 13], [5, 7], [6, 9], [7, 11], [10, 5], [9, 12], [2, 15], [11, 7], [12, 9], [4, 20], [13, 5], [8, 15], [3, 21], [6, 13]].map(([k, e], i) => scpMot(k, e, 'F1', 'ABCDMNPS'[i % 8])),
  ...[[3, 19], [4, 15], [5, 23], [6, 17], [8, 9], [7, 29], [2, 25], [10, 11], [9, 14], [11, 15], [12, 7]].map(([k, e], i) => scpMot(k, e, 'F2', 'ABMNSTUV'[i % 8])),
  ...[[2, 10], [3, 8], [5, 6], [10, 4], [4, 7], [6, 5], [7, 9], [9, 6], [11, 5]].map(([k, m], i) => scpBinh(k, m, 'ABCDMNSTU'[i % 9])),
]

// ═════════════════════════════════════════ NDB01410 — tích luỹ thừa cùng số mũ x ═════════════════════════════════════
function tichLuyThua(bases, cs, x0) {
  const P = bases.reduce((a, b) => a * b, 1), Cn = bases.reduce((a, b, i) => a * b ** cs[i], 1)
  const R = BigInt(Cn) * BigInt(P) ** BigInt(x0)
  const mu = (c) => (c === 0 ? 'x' : `x+${c}`)
  const lt = (b, c) => `${b}^${c === 0 ? 'x' : `{x+${c}}`}`
  const lhs = bases.map((b, i) => lt(b, cs[i])).join('.')
  const tach = bases.map((b, i) => (cs[i] === 0 ? `${b}^x` : `${b}^x.${b}^${cs[i]}`)).join('.')
  const hsList = bases.map((b, i) => (cs[i] ? `${b ** cs[i]}` : null)).filter(Boolean)
  const nhom = bases.map((b) => `${b}^x`).join('.')
  const dong = [`$${lhs}=${tach}$`]
  if (hsList.length > 1) dong.push(`$=${hsList.join('.')}.(${nhom})$`); else dong.push(`$=${hsList[0]}.(${nhom})$`)
  dong.push(`$=${Cn}.(${bases.join('.')})^x$`, `$=${Cn}.${P}^x$`)
  const Q = R / BigInt(Cn)
  return {
    noi_dung: `Tìm số tự nhiên $x$, biết: $${lhs}=${R}$.`, dap_an: String(x0),
    loi_giai: LG('tách mỗi luỹ thừa $a^{x+k}$ thành $a^x.a^k$ để mọi luỹ thừa chứa $x$ có **cùng số mũ $x$**, gộp thành một luỹ thừa $(a.b.c)^x$ rồi so sánh hai luỹ thừa cùng cơ số.', [
      'Tách các luỹ thừa $a^{x+k}=a^x.a^k$.', 'Gom các hệ số (các luỹ thừa không chứa $x$) ra ngoài, các luỹ thừa $a^x$ vào trong ngoặc.', 'Gộp $a^x.b^x.c^x=(a.b.c)^x$.', 'Chia hai vế cho hệ số, viết vế phải thành luỹ thừa cùng cơ số rồi suy ra $x$.'], [
      ...dong, `Do đó $${Cn}.${P}^x=${R}$, suy ra $${P}^x=${R}:${Cn}=${Q}$.`, `Mà $${Q}=${P}^${x0}$ nên $${P}^x=${P}^${x0}$, suy ra $x=${x0}$.`, `Vậy $x=${x0}$.`]),
  }
}
const MOI_01410 = (() => {
  const nhom = [[2, 3], [2, 5], [3, 4], [2, 7], [3, 5], [4, 5], [2, 3, 5], [2, 3, 4], [3, 4, 5], [2, 5, 7], [2, 3, 7], [3, 5, 6], [2, 6], [5, 6], [3, 7]]
  const off = (n) => (n === 2 ? [[1, 0], [2, 1], [0, 3], [3, 2], [1, 3], [2, 2], [4, 1], [3, 0]] : [[1, 2, 0], [2, 1, 0], [0, 1, 3], [3, 0, 2], [1, 0, 2], [2, 2, 1], [1, 1, 1], [0, 2, 3]])
  const cand = []
  for (const bs of nhom) for (const c of off(bs.length)) for (const x0 of [1, 2, 3, 4]) {
    const R = BigInt(bs.reduce((a, b, i) => a * b ** c[i], 1)) * BigInt(bs.reduce((a, b) => a * b, 1)) ** BigInt(x0)
    if (R < 10n ** 10n && R > 100n) cand.push([bs, c, x0])
  }
  return tron(cand).slice(0, 40).map((a) => tichLuyThua(...a))
})()

// ═════════════════════════════════════════ NDB01621 — tìm x dùng bình phương ≥ 0 ═════════════════════════════════════
const bp = (a, v = 'x') => `(${v}${a < 0 ? a : `+${a}`})^2`        // a là hằng; (x-3)^2 ⇒ a=-3
const hs = (c, s) => (c === 1 ? s : `${c}${s}`)
const nghiem = (a) => -a                                                // x+a=0 ⇒ x=-a
function bpMot(a, c, le) {
  return {
    noi_dung: `Tìm số nguyên $x$, biết: $${hs(c, bp(a))}\\le 0$.`, dap_an: `$x=${nghiem(a)}$`,
    loi_giai: LG('bình phương của một số nguyên luôn $\\ge 0$; nếu một biểu thức chứa bình phương mà $\\le 0$ thì nó phải bằng $0$, từ đó tìm $x$.', [
      'Nhận xét: $(x+a)^2\\ge 0$ với mọi số nguyên $x$.', 'So sánh với điều kiện $\\le 0$ của đề để suy ra biểu thức bằng $0$.', 'Giải phương trình $x+a=0$ để tìm $x$.'], [
      `Vì $${bp(a)}\\ge 0$ với mọi số nguyên $x$ nên $${hs(c, bp(a))}\\ge 0$.`, `Mà theo đề $${hs(c, bp(a))}\\le 0$ nên $${hs(c, bp(a))}=0$${c === 1 ? '' : `, suy ra $${bp(a)}=0$`}.`,
      `Suy ra $x${a < 0 ? a : `+${a}`}=0$, tức $x=${nghiem(a)}$.`, `Vậy $x=${nghiem(a)}$.`]),
  }
}
function bpHai(a, b, c1, c2, dau) {
  return {
    noi_dung: `Tìm các số nguyên $x$, $y$ biết: $${hs(c1, bp(a))}+${hs(c2, bp(b, 'y'))}${dau === '=' ? '=' : '\\le'} 0$.`, dap_an: `$x=${nghiem(a)};\\ y=${nghiem(b)}$`,
    loi_giai: LG('tổng hai biểu thức không âm mà $\\le 0$ thì cả hai biểu thức đều phải bằng $0$.', [
      'Nhận xét mỗi số hạng của vế trái đều $\\ge 0$.', 'Suy ra tổng $\\ge 0$; so với đề (bằng $0$ hoặc $\\le 0$) thì tổng bằng $0$.', 'Tổng hai số không âm bằng $0$ khi cả hai số cùng bằng $0$; giải từng phương trình tìm $x$, $y$.'], [
      `Vì $${bp(a)}\\ge 0$ và $${bp(b, 'y')}\\ge 0$ với mọi số nguyên $x$, $y$ nên $${hs(c1, bp(a))}+${hs(c2, bp(b, 'y'))}\\ge 0$.`,
      `Mà theo đề tổng đó ${dau === '=' ? 'bằng' : '$\\le$'} $0$ nên tổng bằng $0$, do đó $${bp(a)}=0$ và $${bp(b, 'y')}=0$.`,
      `Suy ra $x${a < 0 ? a : `+${a}`}=0$ và $y${b < 0 ? b : `+${b}`}=0$, tức $x=${nghiem(a)}$ và $y=${nghiem(b)}$.`, `Vậy $x=${nghiem(a)}$ và $y=${nghiem(b)}$.`]),
  }
}
function bpNho(a, c, hang, ten) {
  return {
    noi_dung: `Cho $${ten}=${hs(c, bp(a))}${hang < 0 ? hang : `+${hang}`}$. Tìm số nguyên $x$ để $${ten}$ đạt giá trị nhỏ nhất.`, dap_an: `$x=${nghiem(a)}$`,
    loi_giai: LG('vì bình phương luôn $\\ge 0$ nên biểu thức nhỏ nhất khi bình phương bằng $0$; giải $x+a=0$ để tìm $x$.', [
      'Nhận xét: phần bình phương luôn $\\ge 0$.', 'Suy ra biểu thức luôn lớn hơn hoặc bằng hằng số cộng thêm; dấu "$=$" xảy ra khi bình phương bằng $0$.', 'Giải để tìm $x$ làm bình phương bằng $0$.'], [
      `Vì $${bp(a)}\\ge 0$ với mọi số nguyên $x$ nên $${hs(c, bp(a))}\\ge 0$.`, `Suy ra $${ten}=${hs(c, bp(a))}${hang < 0 ? hang : `+${hang}`}\\ge ${hang}$.`,
      `Dấu "$=$" xảy ra khi $${bp(a)}=0$, tức $x${a < 0 ? a : `+${a}`}=0$, suy ra $x=${nghiem(a)}$.`, `Vậy $${ten}$ đạt giá trị nhỏ nhất khi $x=${nghiem(a)}$.`]),
  }
}
function bpLon(a, c, hang, ten) {
  return {
    noi_dung: `Cho $${ten}=${hang}-${hs(c, bp(a))}$. Tìm số nguyên $x$ để $${ten}$ đạt giá trị lớn nhất.`, dap_an: `$x=${nghiem(a)}$`,
    loi_giai: LG('phần bị trừ là bình phương luôn $\\ge 0$ nên biểu thức lớn nhất khi bình phương bằng $0$; giải $x+a=0$ để tìm $x$.', [
      'Nhận xét: phần bình phương luôn $\\ge 0$ nên số bị trừ không âm.', `Suy ra biểu thức $\\le$ số đã cho; dấu "$=$" xảy ra khi bình phương bằng $0$.`, 'Giải để tìm $x$ làm bình phương bằng $0$.'], [
      `Vì $${bp(a)}\\ge 0$ với mọi số nguyên $x$ nên $${hs(c, bp(a))}\\ge 0$.`, `Suy ra $${ten}=${hang}-${hs(c, bp(a))}\\le ${hang}$.`,
      `Dấu "$=$" xảy ra khi $${bp(a)}=0$, tức $x${a < 0 ? a : `+${a}`}=0$, suy ra $x=${nghiem(a)}$.`, `Vậy $${ten}$ đạt giá trị lớn nhất khi $x=${nghiem(a)}$.`]),
  }
}
const MOI_01621 = [
  ...[[-3, 1], [2, 1], [-5, 1], [4, 1], [-1, 1], [6, 1], [-7, 1], [3, 1], [-2, 3], [5, 2], [-4, 5], [1, 4]].map(([a, c]) => bpMot(a, c)),
  ...[[2, -5, 1, 1, '<'], [-3, 4, 1, 1, '='], [1, 6, 2, 1, '<'], [-4, -2, 1, 3, '='], [5, -1, 3, 1, '<'], [-6, 3, 1, 1, '='], [3, 7, 1, 2, '<'], [-2, -8, 2, 2, '=']].map(([a, b, c1, c2, d]) => bpHai(a, b, c1, c2, d === '=' ? '=' : '<')),
  ...[[-4, 1, 7, 'A'], [3, 1, -9, 'B'], [-6, 2, 5, 'C'], [2, 1, -12, 'D'], [-1, 3, 10, 'M']].map(([a, c, h, t]) => bpNho(a, c, h, t)),
  ...[[1, 1, 8, 'A'], [-5, 1, 15, 'B'], [4, 2, -3, 'C'], [-2, 3, 20, 'N'], [6, 1, 9, 'P']].map(([a, c, h, t]) => bpLon(a, c, h, t)),
]

// ═════════════════════════════════════════ NDB01619 — biết giá trị biểu thức chứa biến, tính biểu thức khác ══════════
const sg = (s, t) => (s > 0 ? `+${t}` : `-${t}`)
function bieuThucA(s1, s2, S, T, ten) { // (a + s1 b)(x + s2 y) = ax + s2 ay + s1 bx + s1s2 by
  const sa = s1 > 0 ? '+' : '-', sy = s2 > 0 ? '+' : '-'
  const A = `ax${sg(s2, 'ay')}${sg(s1, 'bx')}${sg(s1 * s2, 'by')}`
  const g1 = `a(x${sy}y)`, g2 = `b(x${sy}y)`
  return {
    noi_dung: `Tính giá trị biểu thức $${ten}=${A}$, biết $a${sa}b=${S}$ và $x${sy}y=${T}$.`, dap_an: String(S * T),
    loi_giai: LG('nhóm các số hạng để đặt nhân tử chung, đưa biểu thức về tích của hai biểu thức đã cho giá trị rồi thay số.', [
      'Nhóm hai số hạng đầu và hai số hạng sau sao cho mỗi nhóm có nhân tử chung.', 'Đặt nhân tử chung, ra nhân tử chung của hai nhóm.', 'Viết biểu thức thành tích của hai biểu thức đã cho giá trị.', 'Thay giá trị đã cho vào và tính.'], [
      `Ta có $${ten}=${A}=(ax${sg(s2, 'ay')})${s1 > 0 ? '+' : '-'}(bx${sg(s2, 'by')})$`,
      `$=${g1}${s1 > 0 ? '+' : '-'}${g2}$`, `$=(a${sa}b)(x${sy}y)$`, `Thay $a${sa}b=${S}$ và $x${sy}y=${T}$ vào, ta được $${ten}=${ngoac(S)}.${ngoac(T)}=${S * T}$.`, `Vậy $${ten}=${S * T}$.`]),
  }
}
function bieuThucB(p, q, S, ten, v) { // Cho a+b=S. Tính p a + p b + q
  const [a, b] = v, val = p * S + q
  return {
    noi_dung: `Cho $${a}+${b}=${S}$. Tính giá trị biểu thức $${ten}=${p}${a}+${p}${b}${q < 0 ? q : `+${q}`}$.`, dap_an: String(val),
    loi_giai: LG('đặt nhân tử chung để xuất hiện biểu thức đã biết giá trị rồi thay số.', ['Nhóm hai số hạng chứa biến và đặt nhân tử chung.', 'Thay giá trị của biểu thức đã cho vào.', 'Thực hiện phép tính.'], [
      `Ta có $${ten}=${p}${a}+${p}${b}${q < 0 ? q : `+${q}`}=${p}(${a}+${b})${q < 0 ? q : `+${q}`}$.`, `Thay $${a}+${b}=${S}$ vào, ta được $${ten}=${p}.${ngoac(S)}${q < 0 ? q : `+${q}`}=${val}$.`, `Vậy $${ten}=${val}$.`]),
  }
}
function bieuThucC(p, q, S, ten, v) { // Cho a-b=S. Tính q - p a + p b
  const [a, b] = v, val = q - p * S
  return {
    noi_dung: `Cho $${a}-${b}=${S}$. Tính giá trị biểu thức $${ten}=${q}-${p}${a}+${p}${b}$.`, dap_an: String(val),
    loi_giai: LG('đặt nhân tử chung với dấu trừ để xuất hiện $a-b$ rồi thay số.', ['Nhóm hai số hạng chứa biến và đặt nhân tử chung (lưu ý đổi dấu trong ngoặc).', 'Thay giá trị của hiệu đã cho vào.', 'Thực hiện phép tính.'], [
      `Ta có $${ten}=${q}-${p}${a}+${p}${b}=${q}-${p}(${a}-${b})$.`, `Thay $${a}-${b}=${S}$ vào, ta được $${ten}=${q}-${p}.${ngoac(S)}=${val}$.`, `Vậy $${ten}=${val}$.`]),
  }
}
function bieuThucD(T, U) { // Cho x-y=T và y+z=U. Tính x+z
  return {
    noi_dung: `Cho $x-y=${T}$ và $y+z=${U}$. Tính giá trị biểu thức $D=x+z$.`, dap_an: String(T + U),
    loi_giai: LG('cộng hai đẳng thức đã cho theo vế để triệt tiêu $y$.', ['Quan sát: $-y$ và $+y$ đối nhau nên cộng hai đẳng thức thì $y$ mất.', 'Cộng hai vế tương ứng.', 'Tính.'], [
      `Ta có $(x-y)+(y+z)=x-y+y+z=x+z$.`, `Do đó $D=x+z=(x-y)+(y+z)=${ngoac(T)}+${ngoac(U)}=${T + U}$.`, `Vậy $D=${T + U}$.`]),
  }
}
const MOI_01619 = [
  ...[[1, -1, -7, -1], [1, 1, 5, 3], [-1, -1, 4, 6], [1, 1, -3, 4], [-1, 1, 8, -2], [1, -1, 6, -5], [-1, -1, -9, 2], [1, 1, 10, -3], [-1, 1, -4, 7], [1, -1, 2, 9], [1, 1, -6, -4], [-1, -1, 7, 5], [1, -1, -2, 8], [-1, 1, 3, -6]]
    .map(([s1, s2, S, T], i) => bieuThucA(s1, s2, S, T, 'ABCDMNPQ'[i % 8])),
  ...[[2, 3, 5, 'B', 'xy'], [3, -4, 7, 'C', 'ab'], [4, 1, -6, 'M', 'mn'], [5, -2, 4, 'N', 'xy'], [6, 7, -3, 'P', 'ab'], [7, -1, 2, 'Q', 'mn'], [2, -9, 8, 'S', 'xy'], [3, 5, -5, 'T', 'ab']].map(([p, q, S, t, v]) => bieuThucB(p, q, S, t, v)),
  ...[[2, 3, 4, 'A', 'xy'], [3, -1, -5, 'B', 'ab'], [4, 7, 3, 'C', 'mn'], [5, 2, -2, 'D', 'xy'], [6, -8, 6, 'E', 'ab'], [7, 9, -4, 'F', 'mn']].map(([p, q, S, t, v]) => bieuThucC(p, q, S, t, v)),
  ...[[3, -5], [4, 6], [-2, 7], [5, -8], [-6, -3], [8, 2]].map(([T, U]) => bieuThucD(T, U)),
]

// ═════════════════════════════════════════ NDB01224 — so sánh số tự nhiên ════════════════════════════════════════════
const sosanh = (a, b) => ({
  noi_dung: `Điền dấu $<$, $>$ hoặc $=$ vào chỗ trống: $${a} \\ldots ${b}$.`, dap_an: `$${a < b ? '<' : a > b ? '>' : '='}$`,
  loi_giai: LG('so sánh số chữ số trước; nếu bằng nhau thì so sánh từng cặp chữ số cùng hàng từ trái sang phải.', ['Đếm số chữ số của hai số.', 'Nếu số chữ số khác nhau thì số nhiều chữ số hơn lớn hơn.', 'Nếu bằng nhau, so sánh lần lượt các cặp chữ số từ hàng cao nhất, dừng ở cặp đầu tiên khác nhau.'],
    String(a).length !== String(b).length
      ? [`Số $${a}$ có $${String(a).length}$ chữ số, số $${b}$ có $${String(b).length}$ chữ số.`, `Do đó $${a}${a < b ? '<' : '>'}${b}$.`]
      : (() => { const x = String(a), y = String(b); let i = 0; while (x[i] === y[i]) i++; return [`Hai số đều có $${x.length}$ chữ số, ${i} chữ số đầu (tính từ trái sang phải) giống nhau; ở cặp chữ số thứ $${i + 1}$ ta có $${x[i]}${+x[i] < +y[i] ? '<' : '>'}${y[i]}$.`, `Do đó $${a}${a < b ? '<' : '>'}${b}$.`] })()),
})
const sapXep = (xs, tang) => {
  const s = [...xs].sort((p, q) => (tang ? p - q : q - p))
  return {
    noi_dung: `Sắp xếp các số sau theo thứ tự ${tang ? 'tăng' : 'giảm'} dần: ${xs.map((x) => `$${x}$`).join('; ')}.`, dap_an: `$${s.join(tang ? '<' : '>')}$`,
    loi_giai: LG('so sánh số chữ số rồi từng cặp chữ số cùng hàng; sắp xếp từ nhỏ đến lớn (hoặc ngược lại) theo yêu cầu.', ['Nhóm các số theo số chữ số: số ít chữ số hơn thì nhỏ hơn.', 'Với các số cùng số chữ số, so sánh các chữ số từ trái sang phải.', 'Viết các số theo thứ tự yêu cầu bằng dấu $<$ hoặc $>$.'], [
      `Số chữ số của các số: ${xs.map((x) => `$${x}$ có ${String(x).length}`).join('; ')}.`, `So sánh theo số chữ số và từng hàng ta được: $${[...s].sort((p, q) => p - q).join('<')}$.`, `Vậy theo thứ tự ${tang ? 'tăng' : 'giảm'} dần: $${s.join(tang ? '<' : '>')}$.`]),
  }
}
const lonNho = (xs, lon) => {
  const v = lon ? Math.max(...xs) : Math.min(...xs)
  return {
    noi_dung: `Tìm số ${lon ? 'lớn' : 'nhỏ'} nhất trong các số sau: ${xs.map((x) => `$${x}$`).join('; ')}.`, dap_an: String(v),
    loi_giai: LG('so sánh số chữ số rồi từng cặp chữ số cùng hàng để tìm số lớn nhất (nhỏ nhất).', ['Tìm các số có nhiều (ít) chữ số nhất.', 'Nếu có nhiều số cùng số chữ số, so sánh từng hàng từ trái sang phải.'], [
      `Số chữ số của các số: ${xs.map((x) => `$${x}$ có ${String(x).length}`).join('; ')}.`, `So sánh các số ta được số ${lon ? 'lớn' : 'nhỏ'} nhất là $${v}$.`, `Vậy số ${lon ? 'lớn' : 'nhỏ'} nhất là $${v}$.`]),
  }
}
const chuSo = (n, vt, c1, c2, delta1, delta2) => { // số n chữ số, dấu * ở vị trí vt
  const base = []; for (let i = 0; i < n; i++) base.push(1 + ((i * 3 + 2) % 8))
  const mk = (c) => { const d = [...base]; d[vt] = c; return Number(d.join('')) }
  const lo = mk(c1) - delta1, hi = mk(c2) + delta2
  const ok = []; for (let c = 0; c <= 9; c++) { const v = mk(c); if (lo < v && v < hi) ok.push(c) }
  const pat = base.map((d, i) => (i === vt ? '*' : d)).join('')
  return { ok, n, de: `Tìm chữ số thích hợp ở dấu $*$ sao cho: $${lo}<\\overline{${pat}}<${hi}$`, lo, hi, pat }
}
function chuSoCau(n, vt, c1, c2, d1, d2) {
  const r = chuSo(n, vt, c1, c2, d1, d2)
  if (!r.ok.length || r.ok.length > 4) return null
  return {
    noi_dung: r.de, dap_an: `$*\\in\\{${r.ok.join(';')}\\}$`,
    loi_giai: LG('so sánh từng hàng từ trái sang phải với hai số hai đầu để thu hẹp chữ số cần tìm, rồi thử các chữ số còn lại.', ['Viết số có dấu $*$ dưới dạng $\\overline{\\dots}$.', 'So sánh với số nhỏ hơn và số lớn hơn ở hai đầu để tìm các chữ số $*$ có thể.', 'Thử lần lượt từng chữ số và kiểm tra cả hai bất đẳng thức.'], [
      `Ta cần $${r.lo}<\\overline{${r.pat}}<${r.hi}$.`, ...r.ok.map((c) => `Với $*=${c}$ thì số là $${r.pat.replace('*', c)}$, thoả mãn vì $${r.lo}<${r.pat.replace('*', c)}<${r.hi}$.`),
      `Các chữ số khác không thoả mãn một trong hai bất đẳng thức.`, `Vậy $*\\in\\{${r.ok.join(';')}\\}$.`]),
  }
}
const lienKe = (n, sau) => ({
  noi_dung: `Tìm số tự nhiên liền ${sau ? 'sau' : 'trước'} của $${n}$.`, dap_an: String(sau ? n + 1 : n - 1),
  loi_giai: LG(`số liền ${sau ? 'sau' : 'trước'} của $a$ là $a${sau ? '+' : '-'}1$.`, [`Nhớ: số liền ${sau ? 'sau' : 'trước'} hơn kém $a$ đúng 1 đơn vị.`, 'Tính, chú ý trường hợp đổi số chữ số.'], [`Số liền ${sau ? 'sau' : 'trước'} của $${n}$ là $${n}${sau ? '+' : '-'}1=${sau ? n + 1 : n - 1}$.`, `Vậy đáp án là $${sau ? n + 1 : n - 1}$.`]),
})
const demX = (a, b, kieu) => {
  const so = kieu === 0 ? b - a : b - a // a<x≤b hoặc a≤x<b đều có b-a số
  return {
    noi_dung: `Có bao nhiêu số tự nhiên $x$ thỏa mãn $${a} ${kieu === 0 ? '< x \\le' : '\\le x <'} ${b}$?`, dap_an: String(so),
    loi_giai: LG('các số tự nhiên liên tiếp từ số đầu đến số cuối: đếm bằng hiệu hai đầu (lưu ý đầu nào được lấy).', ['Xác định số đầu và số cuối thực sự được lấy.', 'Số các số tự nhiên liên tiếp từ $m$ đến $n$ là $n-m+1$.'],
      kieu === 0 ? [`Vì $${a}<x\\le ${b}$ nên $x$ chạy từ $${a + 1}$ đến $${b}$.`, `Số giá trị của $x$ là $${b}-${a + 1}+1=${so}$.`, `Vậy có ${so} số.`] : [`Vì $${a}\\le x<${b}$ nên $x$ chạy từ $${a}$ đến $${b - 1}$.`, `Số giá trị của $x$ là $${b - 1}-${a}+1=${so}$.`, `Vậy có ${so} số.`]),
  }
}
const MOI_01224 = [
  ...[[9876, 10000], [4705, 4750], [123456, 123465], [5090, 5009], [999, 1000], [20260, 2026], [38274, 38247], [700001, 70001]].map(([a, b]) => sosanh(a, b)),
  sapXep([3092, 3209, 392, 3029], true), sapXep([5810, 581, 5801, 5180], false), sapXep([76543, 7654, 76435, 76534], true), sapXep([2468, 2486, 2648, 2864, 2846], false),
  sapXep([100200, 99999, 100020, 10200], true), sapXep([4001, 4010, 4100, 401], false), sapXep([67890, 69780, 69870, 67980], true), sapXep([1234, 1243, 1324, 1342], false),
  lonNho([8765, 8756, 8675, 8657], true), lonNho([90210, 9210, 90120, 9021], false), lonNho([54321, 54312, 54231, 5432], true), lonNho([706, 7060, 670, 760], false), lonNho([99990, 100001, 99999, 90999], true),
  chuSoCau(4, 2, 4, 5, 10, 10), chuSoCau(4, 1, 2, 3, 15, 15), chuSoCau(5, 2, 1, 3, 100, 100), chuSoCau(4, 3, 3, 6, 5, 5), chuSoCau(5, 3, 2, 4, 10, 10), chuSoCau(5, 1, 3, 5, 1000, 1000), chuSoCau(4, 2, 6, 8, 30, 30),
  lienKe(9999, true), lienKe(100000, false), lienKe(54329, true), lienKe(1000, false), lienKe(879999, true),
  demX(2024, 2040, 0), demX(150, 200, 1), demX(999, 1020, 0), demX(75, 120, 1), demX(1990, 2026, 0),
].filter(Boolean)

const MOI = { NDB03068: MOI_03068, NDB01231: MOI_01231, NDB01410: MOI_01410, NDB01621: MOI_01621, NDB01619: MOI_01619, NDB01224: MOI_01224 }
const LOAI = { NDB01231: 'tu_luan', NDB01229: 'tu_luan' }          // còn lại: trả lời ngắn
const HAO = { NDB00367: { goc: 'T106020601018', cau: HAO_00367 }, NDB00403: { goc: 'T106040103001', cau: HAO_00403 }, NDB01229: { goc: 'T1060000001050', cau: HAO_01229 } }

// ── chạy ──────────────────────────────────────────────────────────────────────────────────────────
const kiemTai = (dang, c) => (KIEM_K6[dang] ? KIEM_K6[dang](c.noi_dung, c.dap_an ?? '', c.loi_giai) : ['chưa có bộ kiểm'])
const db = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await db.connect()
try {
  if (LENH === 'hao') {
    const out = []
    for (const [dang, { goc, cau }] of Object.entries(HAO)) {
      if (CHI_DANG && !CHI_DANG.includes(dang)) continue
      const tot = cau.filter((c) => { const l = kiemTai(dang, c); if (l.length) console.log(`  ✘ ${dang} (bộ sinh): ${l.join(' | ')} :: ${c.noi_dung.slice(0, 70)}`); return !l.length })
      console.log(`${dang}: sinh ${cau.length}, qua bộ kiểm ${tot.length}, gốc ${goc}`)
      if (!GHI) { for (const c of tot.slice(0, 2)) console.log('   mẫu:', c.noi_dung.replace(/\n/g, ' ⏎ ').slice(0, 160), '=>', c.dap_an); continue }
      const y = (await db.query(`insert into dai_cau_hoi_yeu_cau_clone (ma_cau_goc, so_bien_the, ghi_chu) values ($1, $2, 'fill K6 đủ 30 (spec-giai-bai §C13) — 21/11') returning id`, [goc, tot.length])).rows[0]
      out.push({ yeu_cau_id: y.id, variants: tot.map((c) => ({ noi_dung: c.noi_dung, dap_an: c.dap_an ?? undefined, loi_giai: c.loi_giai })) })
    }
    if (GHI && out.length) {
      const tep = join(process.env.TEMP || '.', `k6-fill-hao-${Date.now()}.json`); writeFileSync(tep, JSON.stringify(out))
      console.log(execFileSync('node', [join(root, 'scripts/hangdoi-clone.mjs'), '--ghi', tep], { encoding: 'utf8' }))
    }
  } else if (LENH === 'moi') {
    const dem = {}
    await db.query('begin')
    const qua = []
    for (const [dang, ds] of Object.entries(MOI)) {
      if (CHI_DANG && !CHI_DANG.includes(dang)) continue
      const thay = new Set()
      for (const c of ds) {
        const l = kiemTai(dang, c)
        if (l.length) { console.log(`  ✘ ${dang}: ${l.join(' | ')} :: ${c.noi_dung.slice(0, 80)}`); continue }
        if (thay.has(c.noi_dung)) continue
        thay.add(c.noi_dung)
        const cau = { khoi: '6', loai_cau: LOAI[dang] ?? 'tra_loi_ngan', noi_dung: c.noi_dung, lua_chon: null, menh_de: null, dap_an: c.dap_an ?? null, loi_giai: c.loi_giai, anh_de: null, anh_dap_an: null, ma_cum: null, nguon_giai: 'ai' }
        const bam = bamNoiDung({ ...cau, dang_chinh: 'cho' })
        const mk = (tram, ghi) => ({ tram, lan_chay: 'k6-fill-kiem', cach: 'code', ket_qua: 'dat', ghi_chu: ghi, bam_noi_dung: bam })
        const kq = xetGoi({ cau: { ...cau, dang_chinh: 'cho' }, vet: { lam: { tram: 'giai', lan_chay: 'k6-fill-sinh', model: 'claude-sonnet-5-5 (bộ sinh bằng code)' }, kiem: [
          mk('kiem-doc', `bài lẻ soạn bù dạng ${dang} (0 gốc): khuôn hai phần, không nhãn "Câu N"`), mk('kiem-dang', `dạng ${dang} do điều phối chỉ định (§C11)`),
          mk('kiem-dap-so', 'bộ kiểm đọc lại đề từ chữ, tính lại đáp số bằng code/vét cạn, khớp đáp án và kết luận lời giải')] } })
        if (!kq.duoc_ghi) { console.log(`  ✘ ${dang} cổng: ${kq.ly_do.join(' | ')}`); continue }
        qua.push({ dang, cau, kq })
      }
    }
    if (qua.length) {
      const cauList = qua.map(({ dang, cau }) => ({ ...cau, nguon: 'le', giai_method: 'claude_code', ai_model: 'claude-sonnet-5-5', dang_bai: dang, dang_bai_chot: true, ten_de_goc: `Soạn bù ${dang} (0 gốc) · fill K6 21/11` }))
      const { maCauList, trung } = await insertCauBatch({ client: db, subject: 'dai', cauList })
      const laTrung = new Set(trung.map((t) => t.idx))
      for (let i = 0; i < qua.length; i++) {
        if (laTrung.has(i)) { console.log(`  ≈ trùng đề: ${qua[i].dang} ↔ ${maCauList[i]}`); continue }
        const { dang, kq } = qua[i]
        await db.query(`update dai_cau_hoi set kiem_may = $2, kiem_may_at = now(), kiem_may_boi = 'claude_code', kiem_may_ghi = $3, da_duyet = true, duyet_nguon = 'ai', duyet_at = now() where ma_cau = $1`, [maCauList[i], kq.kiem_may, kq.kiem_may_ghi.slice(0, 1500)])
        dem[dang] = (dem[dang] || 0) + 1
      }
    }
    console.log(GHI ? '■ GHI THẬT' : '□ CHẠY THỬ (sẽ ROLLBACK)', '· qua cổng', qua.length); console.table(dem)
    await db.query(GHI ? 'commit' : 'rollback')
  } else if (LENH === 'thu') {
    // Thử bộ kiểm: (1) in 1 câu mẫu mỗi dạng; (2) cố tình làm sai đáp án / kết luận → bộ kiểm PHẢI bắt được
    const tatca = { ...Object.fromEntries(Object.entries(HAO).map(([d, h]) => [d, h.cau])), ...MOI }
    for (const [dang, ds] of Object.entries(tatca)) {
      const dung = ds.filter((c) => !kiemTai(dang, c).length).length
      const c = ds[1] ?? ds[0]
      const sai = { ...c, dap_an: c.dap_an == null ? null : c.dap_an.replace(/\d/, (m) => String((+m + 1) % 10)), loi_giai: c.dap_an == null ? c.loi_giai.replace(/(\d)(?=[^\d]*$)/, (m) => String((+m + 3) % 10)) : c.loi_giai }
      const loi = kiemTai(dang, sai)
      console.log(`${dang}: ${dung}/${ds.length} qua bộ kiểm · cố tình sai → ${loi.length ? 'BẮT ĐƯỢC (' + loi[0].slice(0, 50) + ')' : '⚠ KHÔNG BẮT ĐƯỢC'}`)
      if (rest.includes('--in') && (!CHI_DANG || CHI_DANG.includes(dang))) console.log('-----\n' + c.noi_dung + '\n=> ' + c.dap_an + '\n' + c.loi_giai + '\n-----')
    }
  } else console.log('Dùng: hao | moi | thu  [--dang NDB…] [--ghi]')
} catch (e) { await db.query('rollback').catch(() => {}); console.error('LỖI — đã rollback:', e.message); process.exitCode = 1 } finally { await db.end() }
