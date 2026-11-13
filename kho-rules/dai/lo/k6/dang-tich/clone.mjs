// clone.mjs — Thùy 14/11: clone thêm câu cho 2 dạng của nhóm "Tìm x, y ∈ ℤ thoả điều kiện" (K6 · Số nguyên · NNB01641) để MỖI DẠNG đủ 15 bài:
//   NDB01332 "Đẳng thức tích" (12 → +3) · NDB01334 "Đẳng thức dạng tổng đưa về tích" (1 → +14).
// Sinh bằng CODE: lời giải dựng từ tham số, mọi tập nghiệm đối chiếu VÉT CẠN x,y ∈ [-400,400].
//   node kho-rules/dai/lo/k6/dang-tich/clone.mjs          → kiểm máy + dựng JSON + HTML + chạy khô
//   node kho-rules/dai/lo/k6/dang-tich/clone.mjs --ghi    → ghi thật (gán dạng 'nguoi', CHƯA duyệt)
import { writeFileSync, mkdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import pg from 'pg'
const D = 'kho-rules/dai/lo/k6/dang-tich/'
const GHI = process.argv.includes('--ghi')
const ck = (ten, ok) => { if (!ok) { console.error('✘ KIỂM SAI:', ten); process.exit(3) } }
const P2 = (...l) => `**Phần 2. Trình bày**\n\n${l.join('\n\n')}`
const dau = (x) => (x < 0 ? `-${-x}` : `${x}`)
const term = (c, v) => `${c > 0 ? '+' : '-'}${Math.abs(c) === 1 ? '' : Math.abs(c)}${v}`
const cong = (c) => (c === 0 ? '' : c > 0 ? `+${c}` : `${c}`)
const lin = (p, q, v) => `${p === 1 ? '' : p}${v}${cong(q)}`
const divs = (n) => { n = Math.abs(n); const r = []; for (let d = 1; d <= n; d++) if (n % d === 0) r.push(d); return r }
const uOver = (N) => [...divs(N).map((d) => -d).reverse(), ...divs(N)].sort((a, b) => a - b) // mọi ước nguyên (±) của N, tăng dần
const cap = (arr) => arr.map(([x, y]) => `(${dau(x)};${dau(y)})`).join('; ')
const vet = (f, lim = 400) => { const r = []; for (let x = -lim; x <= lim; x++) for (let y = -lim; y <= lim; y++) if (f(x, y)) r.push([x, y]); return r }
const ss = (a, b) => JSON.stringify([...a].sort((p, q) => p[0] - q[0] || p[1] - q[1])) === JSON.stringify([...b].sort((p, q) => p[0] - q[0] || p[1] - q[1]))
const sapXep = (a) => [...a].sort((p, q) => p[0] - q[0] || p[1] - q[1])

// ───────────────── NDB01334 — đẳng thức dạng tổng đưa về tích
// Họ A: xy + b·x + c·y = d  ⇒  (x+c)(y+b) = d + b·c
function hoA(b, c, d) {
  const N = d + b * c; ck(`A N≠0 (${b},${c},${d})`, N !== 0)
  const sol = [], rows = []
  for (const u of uOver(N)) { const v = N / u, x = u - c, y = v - b; sol.push([x, y]); rows.push(`Nếu $x${cong(c)}=${dau(u)}$ và $y${cong(b)}=${dau(v)}$ thì $x=${dau(u)}${c > 0 ? '-' + c : '+' + (-c)}=${dau(x)}$ và $y=${dau(v)}${b > 0 ? '-' + b : '+' + (-b)}=${dau(y)}$.`) }
  const pt = `xy${term(b, 'x')}${term(c, 'y')}=${d}`
  ck(`A vét cạn ${pt}`, ss(sol, vet((x, y) => x * y + b * x + c * y === d)))
  const bc = b * c, mo = `xy${term(b, 'x')}${term(c, 'y')}${cong(bc)}`
  const p2 = P2(`Ta có $(x${cong(c)})(y${cong(b)})=xy${term(b, 'x')}${term(c, 'y')}${cong(bc)}$ (tính chất phân phối của phép nhân đối với phép cộng).`,
    `${bc > 0 ? 'Cộng' : 'Trừ'} cùng số $${Math.abs(bc)}$ vào hai vế của đẳng thức đã cho: $${mo}=${d}${cong(bc)}$, tức là $(x${cong(c)})(y${cong(b)})=${N}$.`,
    `Vì $x$, $y$ là số nguyên nên $x${cong(c)}$ và $y${cong(b)}$ là hai số nguyên có tích bằng $${N}$. Ta có bảng (kể cả các ước âm):`,
    ...rows, `Vậy $(x;y)=${cap(sapXep(sol)).replace(/; /g, '; ')}$.`)
  return { pt, noi_dung: `Tìm các số nguyên $x,y$ biết $${pt}$.`, p2, sol, N, ten: `A(${b},${c},${d})` }
}
// Họ B: 2xy + b·x + c·y = d (b chẵn, c lẻ) ⇒ (2x+c)(y+b/2) = d + c·b/2, 2x+c lẻ
function hoB(b, c, d) {
  ck('B b chẵn c lẻ', b % 2 === 0 && Math.abs(c) % 2 === 1)
  const h = b / 2, N = d + c * h; ck(`B N≠0 (${b},${c},${d})`, N !== 0)
  const sol = [], rows = []
  for (const u of uOver(N)) {
    if (Math.abs(u) % 2 === 0) continue
    const v = N / u, x = (u - c) / 2, y = v - h; sol.push([x, y])
    rows.push(`Nếu $2x${cong(c)}=${dau(u)}$ và $y${cong(h)}=${dau(v)}$ thì $2x=${dau(u)}${c > 0 ? '-' + c : '+' + (-c)}=${dau(u - c)}$ nên $x=${dau(x)}$ và $y=${dau(v)}${h > 0 ? '-' + h : '+' + (-h)}=${dau(y)}$.`)
  }
  const pt = `2xy${term(b, 'x')}${term(c, 'y')}=${d}`
  ck(`B vét cạn ${pt}`, ss(sol, vet((x, y) => 2 * x * y + b * x + c * y === d)))
  const ch = c * h
  const p2 = P2(`Ta có $(2x${cong(c)})(y${cong(h)})=2xy${term(b, 'x')}${term(c, 'y')}${cong(ch)}$ (tính chất phân phối của phép nhân đối với phép cộng).`,
    `${ch > 0 ? 'Cộng' : 'Trừ'} cùng số $${Math.abs(ch)}$ vào hai vế của đẳng thức đã cho: $2xy${term(b, 'x')}${term(c, 'y')}${cong(ch)}=${d}${cong(ch)}$, tức là $(2x${cong(c)})(y${cong(h)})=${N}$.`,
    `Vì $x$ nguyên nên $2x$ là số chẵn, mà $${c}$ là số lẻ nên $2x${cong(c)}$ là số lẻ. Vậy $2x${cong(c)}$ chỉ có thể là các ước lẻ (kể cả ước âm) của $${N}$, còn $y${cong(h)}=${N}:(2x${cong(c)})$. Ta có bảng:`,
    ...rows, `Vậy $(x;y)=${cap(sapXep(sol))}$.`)
  return { pt, noi_dung: `Tìm các số nguyên $x,y$ biết $${pt}$.`, p2, sol, N, ten: `B(${b},${c},${d})` }
}
const P1_A = String.raw`**Phần 1. Hướng dẫn**

**Mấu chốt:** thêm một số thích hợp vào hai vế để vế trái trở thành tích hai nhị thức $(x+c)(y+b)$; sau đó mọi cách viết vế phải thành tích hai số nguyên cho một cặp $(x;y)$.

**Bước 1.** Nhìn hệ số của $x$ và của $y$ trong đề để tìm hai số hạng hằng $b$, $c$ sao cho khi nhân $(x+c)(y+b)$ ra thì khớp với các số hạng $xy$, $b.x$, $c.y$ của đề.

**Bước 2.** Nhân $(x+c)(y+b)$ ra bằng tính chất phân phối để biết cần cộng (hoặc trừ) số nào vào hai vế.

**Bước 3.** Đưa đẳng thức về dạng "tích hai nhị thức bằng một số nguyên".

**Bước 4.** Liệt kê mọi cách viết số đó thành tích hai số nguyên (kể cả ước âm và đổi thứ tự), từ mỗi cách tìm $x$, $y$.

**Chú ý:** quên ước âm là sót nghiệm; sau khi tìm xong nên thay thử một cặp vào đề.`
const P1_B = String.raw`**Phần 1. Hướng dẫn**

**Mấu chốt:** khi hệ số của $xy$ là $2$ thì xuất hiện nhị thức $2x+c$; nhờ $c$ lẻ nên $2x+c$ luôn lẻ, chỉ cần xét các ước lẻ.

**Bước 1.** Tìm số $c$ ở nhị thức $2x+c$ và số $h$ ở nhị thức $y+h$ sao cho khi nhân $(2x+c)(y+h)$ ra thì khớp các số hạng $2xy$, $b.x$, $c.y$ của đề.

**Bước 2.** Nhân ra bằng tính chất phân phối để biết cần cộng (hoặc trừ) số nào vào hai vế rồi đưa về "tích hai nhị thức bằng một số nguyên".

**Bước 3.** Giải thích vì sao $2x+c$ là số lẻ để loại các ước chẵn.

**Bước 4.** Liệt kê các ước lẻ (kể cả ước âm), từ mỗi ước tìm $x$ rồi $y$.

**Chú ý:** ước chẵn của tích không dùng được cho nhị thức $2x+c$ (vì nó luôn lẻ).`
const A = [[3, 1, 7], [-1, -1, 5], [1, 1, 7], [-2, 3, 11], [4, -2, 1], [-3, -2, 0], [5, 2, -4], [-1, 4, 6], [2, 2, -1]].map(([b, c, d]) => ({ ...hoA(b, c, d), kieu: 'A', p1: P1_A }))
const B = [[6, -1, 10], [-2, 3, 11], [4, 5, 7], [-6, -1, 3], [2, 3, 4]].map(([b, c, d]) => ({ ...hoB(b, c, d), kieu: 'B', p1: P1_B }))
const S4 = [...A, ...B].map((q) => ({ dang: 'NDB01334', parent: 'T106000000470', kieu: q.kieu, noi_dung: q.noi_dung, loi_giai: `${q.p1}\n\n${q.p2}`, ten: q.ten }))
ck('NDB01334: 14 clone', S4.length === 14)

// ───────────────── NDB01332 — đẳng thức tích
const P1_T = String.raw`**Phần 1. Hướng dẫn**

**Mấu chốt:** đẳng thức đã có dạng "tích bằng một số"; liệt kê mọi cách viết số đó thành tích hai số nguyên (kể cả ước âm và đổi thứ tự), rồi giải ra $x$, $y$ và chọn các cặp thoả điều kiện của đề.

**Bước 1.** Xét dấu của số ở vế phải: tích âm thì hai thừa số khác dấu, tích dương thì cùng dấu.

**Bước 2.** Liệt kê các cách viết số đó thành tích hai số nguyên; với mỗi thừa số là một biểu thức của $x$ (hoặc $y$), từ giá trị thừa số tìm $x$ (hoặc $y$) và nhớ chỉ nhận giá trị nguyên.

**Bước 3.** Nếu đề có điều kiện (như $x>y$) thì chỉ giữ các cặp thoả điều kiện đó.

**Chú ý:** đổi thứ tự hai thừa số cho một cặp khác; thừa số có hệ số (như $2y-1$, $3x+1$) thì nhiều ước bị loại vì không cho giá trị nguyên.`
// (a) x.y = a, x>y hoặc x<y
function tichDon(a, cmp) {
  ck('a<0', a < 0)
  const dsx = []; for (const d of divs(a)) { dsx.push([d, a / d]); dsx.push([-d, -a / d]) }
  const loc = dsx.filter(([x, y]) => (cmp === '>' ? x > y : x < y)); const sol = sapXep(loc)
  ck(`tích đơn ${a}${cmp}`, ss(sol, vet((x, y) => x * y === a && (cmp === '>' ? x > y : x < y))))
  const lines = [`Vì $x.y=${a}<0$ nên $x$ và $y$ khác dấu. Ta có ${[...dsx].sort((p, q) => q[0] - p[0]).map(([x, y]) => `$${a}=(${dau(x)}).(${dau(y)})$`).join('; ')}.`,
    `Vì $x${cmp}y$ nên $x$ là số ${cmp === '>' ? 'dương' : 'âm'}, $y$ là số ${cmp === '>' ? 'âm' : 'dương'}. Các cặp thoả mãn là $(x;y)=${cap(sol)}$.`, `Vậy $(x;y)=${cap(sol)}$.`]
  return { noi_dung: `Tìm các số nguyên $x,y$ biết: $x.y=${a}$ và $x${cmp}y$.`, p2: P2(...lines), ten: `tích đơn ${a}${cmp}` }
}
// (b) (p x + q)(r y + s) = N
function tichHe(p, q, r, s, N) {
  const sol = [], rows = []
  for (const u of uOver(N)) {
    const v = N / u
    if ((u - q) % p !== 0) { rows.push(`Nếu $${lin(p, q, 'x')}=${dau(u)}$ thì $${p === 1 ? '' : p}x=${dau(u)}${q > 0 ? '-' + q : '+' + (-q)}=${dau(u - q)}$ không chia hết cho $${p}$ nên $x$ không nguyên, loại.`); continue }
    if ((v - s) % r !== 0) { rows.push(`Nếu $${lin(p, q, 'x')}=${dau(u)}$ thì $${lin(r, s, 'y')}=${dau(v)}$, $${r === 1 ? '' : r}y=${dau(v)}${s > 0 ? '-' + s : '+' + (-s)}=${dau(v - s)}$ không chia hết cho $${r}$ nên $y$ không nguyên, loại.`); continue }
    const x = (u - q) / p, y = (v - s) / r; sol.push([x, y])
    rows.push(`Nếu $${lin(p, q, 'x')}=${dau(u)}$ và $${lin(r, s, 'y')}=${dau(v)}$ thì $x=${dau(x)}$ và $y=${dau(y)}$.`)
  }
  ck(`tích hệ (${p}x+${q})(${r}y+${s})=${N}`, ss(sol, vet((x, y) => (p * x + q) * (r * y + s) === N)) && sol.length > 0)
  return { noi_dung: `Tìm các số nguyên $x,y$ sao cho: $(${lin(p, q, 'x')})(${lin(r, s, 'y')})=${N}$.`, p2: P2(`Vì $x$, $y$ là số nguyên nên $${lin(p, q, 'x')}$ và $${lin(r, s, 'y')}$ là hai số nguyên có tích bằng $${N}$. Ta có bảng (kể cả các ước âm):`, ...rows, `Vậy $(x;y)=${cap(sapXep(sol))}$.`), ten: `tích hệ (${p}x+${q})(${r}y+${s})=${N}` }
}
const S2 = [{ ...tichDon(-8, '>'), parent: 'T1060000001445' }, { ...tichHe(1, 4, 2, -1, -10), parent: 'T1060000001586' }, { ...tichHe(3, 1, 1, -2, 14), parent: 'T1060000001586' }]
  .map((q) => ({ dang: 'NDB01332', parent: q.parent, kieu: 'T', noi_dung: q.noi_dung, loi_giai: `${P1_T}\n\n${q.p2}`, ten: q.ten }))
ck('NDB01332: 3 clone', S2.length === 3)

// ───────────────── kiểm định dạng + KaTeX
const TAT = [...S2, ...S4]
const katex = createRequire(new URL('../../../../../package.json', import.meta.url))('katex')
for (const q of TAT) {
  const t = q.noi_dung + '\n' + q.loi_giai
  if ((t.match(/\$/g) ?? []).length % 2) { console.error('✘ số $ lẻ', q.ten); process.exit(3) }
  if (/\\cdot|\\times|\\left|\\right|\$\{|undefined|NaN|\+-|--/.test(t)) { console.error('✘ ký hiệu lạ', q.ten, t.match(/.{20}(\+-|--|undefined|NaN).{20}/)?.[0]); process.exit(3) }
  const b = (q.loi_giai.match(/\*\*Bước \d+\./g) ?? []).length
  if (b < 3 || b > 6) { console.error('✘ số bước', q.ten, b); process.exit(3) }
  for (const m of t.matchAll(/\$([^$]+)\$/g)) { try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }) } catch (e) { console.error('✘ KaTeX', q.ten, m[1].slice(0, 80)); process.exit(3) } }
}
console.log(`✔ kiểm máy (vét cạn) + định dạng + KaTeX: clone ${TAT.length} (NDB01332 ${S2.length} · NDB01334 ${S4.length})`)

// ───────────────── JSON + HTML
mkdirSync('.nhap-tam', { recursive: true })
const L = (q) => ({ khoi: '6', loai_cau: 'tu_luan', noi_dung: q.noi_dung, dap_an: null, loi_giai: q.loi_giai, dang_bai: q.dang, dang_bai_chot: true, ten_de_goc: null, nguon: 'clone', nguon_giai: 'ai', ghi_chu_nhap: `Clone máy sinh (${q.ten}) 14/11 — tập nghiệm đối chiếu vét cạn x,y∈[-400,400].` })
const lo = TAT.map(L); writeFileSync('.nhap-tam/dang-tich-clone.json', JSON.stringify(lo))
writeFileSync(D + 'clone-cau.json', JSON.stringify(TAT.map((q, i) => ({ id: `C${i + 1}`, parent: q.parent, ...lo[i] })), null, 1))
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const fmt = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>')
let h = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Duyệt: 17 clone Đẳng thức tích / tổng đưa về tích</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<style>body{font:15px/1.65 system-ui,'Segoe UI',sans-serif;max-width:1000px;margin:0 auto;padding:16px;background:#fafafb;color:#1a1a2e}h1{font-size:22px}h2{margin-top:26px;border-bottom:2px solid #4c6fff;padding-bottom:4px}.q{background:#fff;border:1px solid #e1e1ec;border-left:5px solid #4c6fff;border-radius:8px;padding:8px 14px;margin:10px 0}.tag{display:inline-block;font-size:11.5px;border-radius:10px;padding:1px 9px;color:#fff;background:#2D9CDB;margin-right:4px}.box{background:#fff;border:1px solid #dde;border-radius:10px;padding:10px 14px}</style></head><body>
<h1>Đẳng thức tích · Đẳng thức dạng tổng đưa về tích — 17 clone (mỗi dạng đủ 15 bài)</h1>
<div class="box">NDB01332 +3 (12 → 15) · NDB01334 +14 (1 → 15). Sinh bằng <b>code</b>, mọi tập nghiệm đối chiếu <b>vét cạn</b>. Chưa duyệt — Thùy xem rồi nói "duyệt".</div>`
for (const [id, ten, ds] of [['NDB01332', 'Đẳng thức tích', S2], ['NDB01334', 'Đẳng thức dạng tổng đưa về tích', S4]]) { h += `<h2>${id} — ${ten} (+${ds.length})</h2>`; for (const q of ds) h += `<div class="q"><span class="tag">${esc(q.ten)}</span><p><b>Đề:</b><br>${fmt(q.noi_dung)}</p><details><summary>Lời giải</summary><div>${fmt(q.loi_giai)}</div></details></div>` }
h += `<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script><script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script><script>renderMathInElement(document.body,{delimiters:[{left:'$',right:'$',display:false}],throwOnError:false})</script></body></html>`
writeFileSync(D + 'dang-tich-clone-duyet.html', h)
console.log('✔ dang-tich-clone-duyet.html', (h.length / 1024).toFixed(0) + ' KB')

// ───────────────── nhập kho
const a = ['scripts/nhap_kho.mjs', 'insert', '--subject', 'dai', '--json', '.nhap-tam/dang-tich-clone.json']; if (!GHI) a.push('--thu')
const r = spawnSync('node', a, { encoding: 'utf8' }); let j; try { j = JSON.parse(r.stdout) } catch { j = { ok: false, error: (r.stdout + r.stderr).slice(0, 700) } }
console.log(GHI ? '── GHI ──' : '── chạy khô ──', JSON.stringify({ ...j, ma_cau_list: j.ma_cau_list?.length, chua_dang: undefined }).slice(0, 400)); if (!j.ok) process.exit(1)
if (GHI) {
  process.loadEnvFile('.env')
  const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
  try {
    await c.query('begin')
    for (let i = 0; i < j.ma_cau_list.length; i++) await c.query(`update dai_cau_hoi set nguon='clone', parent_ma_cau=$2, clone_method='claude_may_sinh', kiem_may='khop', kiem_may_boi='claude_code', kiem_may_at=now(), kiem_may_ghi=$3 where ma_cau=$1`, [j.ma_cau_list[i], TAT[i].parent, `Máy sinh theo khuôn ${TAT[i].ten}; tập nghiệm đối chiếu vét cạn (dang-tich/clone.mjs).`])
    const st = (await c.query(`select g.dang_bai_id d, count(*) n from dai_bdm_gan_cau g join dai_cau_hoi q on q.ma_cau=g.ma_cau where g.dang_bai_id in ('NDB01332','NDB01334') and q.xoa_at is null group by 1 order by 1`)).rows
    console.table(st); if (st.some((x) => Number(x.n) !== 15)) throw new Error('mỗi dạng phải đủ 15: ' + JSON.stringify(st))
    await c.query('commit'); console.log('✔ ĐÃ GHI', j.ma_cau_list.length, 'clone'); writeFileSync(D + 'clone-ma-cau.json', JSON.stringify({ clone: j.ma_cau_list }))
  } catch (e) { try { await c.query('rollback') } catch {} console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
}
