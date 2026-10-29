// sua-ndb01412.mjs — Thùy 29/10: dạng 5.3 (NDB01412 "Tìm x thỏa mãn tích các số tự nhiên liên tiếp chứa lũy thừa") có 10 câu clone DeepSeek giải sai
//   (sao y lời giải của câu gốc T106020803001: kết luận x=3 cho mọi đề, đề dùng 9^y/16^y làm hỏng lập luận chẵn lẻ, viết "y nguyên dương?" …).
//   Viết lại 10 đề cùng KHUÔN gốc: t(t+1)(t+2) + c^y = N, t = a^x, c CHẴN, N LẺ ⇒ y = 0 ⇒ t(t+1)(t+2) = N−1 ⇒ so sánh theo t. Mỗi bộ (x,y) duy nhất (vét cạn).
//   node kho-rules/dai/lo/k6/ban-do-moi/sua-ndb01412.mjs [--ghi]
import pg from 'pg'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
// [mã câu, cơ số a, x, c] — N = a^x(a^x+1)(a^x+2) + 1 (y = 0)
const BO = [['T106020803002', 3, 2, 6], ['T106020803003', 4, 2, 2], ['T106020803004', 3, 1, 8], ['T106020803005', 5, 1, 4], ['T106020803006', 3, 3, 10], ['T106020803007', 2, 2, 6],
  ['T106020803008', 2, 1, 2], ['T106020803009', 2, 4, 8], ['T106020803010', 5, 2, 6], ['T106020803011', 2, 5, 12]]
const P = (t) => t * (t + 1n) * (t + 2n)
const lg = (a, x, c, N) => {
  const A = BigInt(a), t = A ** BigInt(x), p = P(t)
  const tr = (k) => `${a}^${k}`, ta = (u) => `${u}.${u + 1n}.${u + 2n}`
  const V = (u) => `${a}^x . (${a}^x + 1)(${a}^x + 2)`
  return [
    `Ta có $${a}^x$; $${a}^x + 1$; $${a}^x + 2$ là 3 số tự nhiên liên tiếp nên tích của chúng là số chẵn`,
    `Mà $${N}$ là số lẻ`,
    `Suy ra $${c}^y$ là số lẻ. Mà $${c}$ là số chẵn nên nếu $y \\ge 1$ thì $${c}^y$ là số chẵn, vậy $y = 0$`,
    `Khi đó $${V()} + 1 = ${N}$`,
    `Suy ra $${V()} = ${p} = ${ta(t)}$`,
    `Nếu $x = ${x} \\Rightarrow ${tr(x)} = ${t} \\Rightarrow ${V()} = ${ta(t)}$`,
    `Nếu $x > ${x} \\Rightarrow ${tr('x')} > ${tr(x)} = ${t} \\Rightarrow ${V()} > ${ta(t)}$ (loại)`,
    ...(x > 0 ? [`Nếu $x < ${x} \\Rightarrow ${tr('x')} < ${tr(x)} = ${t} \\Rightarrow ${V()} < ${ta(t)}$ (loại)`] : []),
    `Vậy $x = ${x}$`,
  ].join('\n')
}
const rows = [], loi = []
for (const [ma, a, x, c] of BO) {
  const t = BigInt(a) ** BigInt(x), N = P(t) + 1n
  // vét cạn: nghiệm tự nhiên (x', y') duy nhất
  const ns = []; for (let X = 0; X <= 14; X++) for (let Y = 0; Y <= 40; Y++) if (P(BigInt(a) ** BigInt(X)) + BigInt(c) ** BigInt(Y) === N) ns.push(`${X},${Y}`)
  if (ns.join(' ') !== `${x},0`) loi.push(`${ma}: nghiệm ${ns.join(' ')} ≠ ${x},0`)
  rows.push({ ma, nd: `Tìm $x$ biết $${a}^x . (${a}^x + 1)(${a}^x + 2) + ${c}^y = ${N}$`, da: String(x), lg: lg(a, x, c, N), N, a, x, c })
}
if (loi.length) { console.error('✘\n' + loi.join('\n')); process.exit(3) }
import { createRequire } from 'node:module'
const katex = createRequire(new URL('../../../../../package.json', import.meta.url))('katex')
for (const r of rows) for (const m of (r.nd + '\n' + r.lg).matchAll(/\$([^$]+)\$/g)) { try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }) } catch (e) { console.error('KaTeX', r.ma, m[1]); process.exit(3) } }
console.log(rows[2].lg)
for (const r of rows) console.log(r.ma, '|', r.nd, '→ x =', r.da)
const cl = new pg.Client({ connectionString: process.env.DATABASE_URL }); await cl.connect()
try {
  await cl.query('begin')
  let n = 0
  for (const r of rows) {
    const u = await cl.query(`update dai_cau_hoi set noi_dung=$2, dap_an=$3, loi_giai=$4 where ma_cau=$1 and parent_ma_cau='T106020803001' and nguon='clone' and loai_cau='tra_loi_ngan'`, [r.ma, r.nd, r.da, r.lg])
    n += u.rowCount
  }
  console.log('đã sửa', n, '/ 10')
  if (n !== 10) throw new Error('không đủ 10 câu')
  if (GHI) { await cl.query('commit'); console.log('✔ ĐÃ GHI') } else { await cl.query('rollback'); console.log('↩ ROLLBACK (chạy thử)') }
} catch (e) { try { await cl.query('rollback') } catch {} console.error('✘', e.message); process.exitCode = 1 } finally { await cl.end() }
