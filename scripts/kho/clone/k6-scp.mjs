// ============================================================================
// k6-scp.mjs — clone bù cho NDB02800 · NDB02801 (K6 · nhóm Số chính phương: "chứng minh ... không phải số chính phương"),
// theo luật Thùy 21/11: ƯU TIÊN cách 1 = "chia hết cho số nguyên tố p nhưng KHÔNG chia hết cho p²" (cả chọn bài lẫn lời giải);
// chỉ khi cách 1 không dùng được mới dùng cách 2 (chữ số tận cùng), cách 3 (số dư khi chia cho 3, 4, 5).
// Mọi bài trong tệp này đều giải được bằng cách 1 ⇒ lời giải chỉ dùng cách 1.
//
//   node scripts/kho/clone/k6-scp.mjs [--ghi]     # mặc định chạy thử (không ghi DB)
//
// Luồng: bộ sinh (code) → bộ kiểm độc lập (BigInt: không là SCP · p nguyên tố · p | A · p² ∤ A · phần a) chia hết) → yêu cầu clone →
// hangdoi-clone --ghi (nháp) → duyet-nhap-clone --duyet-lo (biên bản = bộ kiểm trên) --ghi.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const env = Object.fromEntries(readFileSync(join(root, '.env'), 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const GHI = process.argv.includes('--ghi')

const pw = (b, e) => (e === 1 ? `${b}` : e < 10 ? `${b}^${e}` : `${b}^{${e}}`)
const LG = (chot, buoc, trinhBay, chuY) => `**Phần 1. Hướng dẫn**\n\n**Mấu chốt:** ${chot}\n\n${buoc.map((b, i) => `**Bước ${i + 1}.** ${b}`).join('\n\n')}${chuY ? `\n\n**Chú ý:** ${chuY}` : ''}\n\n**Phần 2. Trình bày**\n\n${trinhBay.join('\n\n')}`
const CHOT = 'chứng minh biểu thức chia hết cho số nguyên tố $p$ nhưng **không chia hết cho $p^2$**, rồi dùng tính chất: số chính phương mà chia hết cho $p$ thì phải chia hết cho $p^2$ (mọi thừa số nguyên tố của số chính phương có số mũ chẵn).'
const KET = (X, p) => [
  `Giả sử $${X}$ là số chính phương, tức là $${X}=m.m$ với $m\\in\\mathbb{N}$. Phân tích $m$ ra thừa số nguyên tố; mỗi luỹ thừa $q^e$ có trong $m$ thì trong $m.m$ thành $q^e.q^e=q^{e+e}$, số mũ là số chẵn. Vậy khi phân tích $${X}$ ra thừa số nguyên tố, mọi thừa số đều có số mũ chẵn.`,
  `Vì $${X}$ chia hết cho $${p}$ nên số mũ của thừa số nguyên tố $${p}$ trong $${X}$ lớn hơn hoặc bằng $1$, mà số mũ đó chẵn nên lớn hơn hoặc bằng $2$. Suy ra $${X}$ chia hết cho $${p}^2=${p * p}$. Mâu thuẫn với $${X}$ không chia hết cho $${p * p}$.`,
  `Vậy $${X}$ không là số chính phương.`]
const BUOC_KET = ['Lập luận số chính phương thì mọi số mũ trong phân tích ra thừa số nguyên tố đều chẵn: chia hết cho $p$ thì phải chia hết cho $p^2$; trái với bước trước nên kết luận.']

// ── NDB02800: dãy luỹ thừa ─────────────────────────────────────────────────────────────────────────────────
// a = p (nguyên tố) hoặc a = p.t với p ∤ t. Mọi số hạng a^j (j ≥ 2) chia hết cho a² ⇒ chia hết cho p²; số hạng a chia hết cho p, không chia hết cho p².
const lyDoA = (a, p) => (a === p ? '' : `, mà $${a}=${p}.${a / p}$ nên $${a}$ chia hết cho $${p}$ và không chia hết cho $${p * p}$ (vì $${a / p}$ không chia hết cho $${p}$)`)
function dayMot(a, p, n, ten, le) { // le=false: a + a² + … + a^n ; le=true: a + a³ + a⁵ + … + a^n (n lẻ)
  const dau = le ? `${a}+${pw(a, 3)}+${pw(a, 5)}+\\dots+${pw(a, n)}` : `${a}+${pw(a, 2)}+${pw(a, 3)}+\\dots+${pw(a, n)}`
  const phan = le ? `${pw(a, 3)}+${pw(a, 5)}+\\dots+${pw(a, n)}` : `${pw(a, 2)}+${pw(a, 3)}+\\dots+${pw(a, n)}`
  const a2 = a * a
  return {
    noi_dung: `Cho $${ten}=${dau}$. Chứng minh $${ten}$ không là số chính phương.`, p,
    loi_giai: LG(CHOT, [
      `Chứng tỏ mọi số hạng đều chia hết cho ${a}, nên $${ten}$ chia hết cho $${p}$.`,
      `Tách $${ten}=${a}+(${phan})$: từ số hạng thứ hai trở đi mọi số hạng đều chia hết cho $${a}^2$, nên chia hết cho $${p * p}$; còn $${a}$ chia hết cho $${p}$ nhưng không chia hết cho $${p * p}$.`,
      `Suy ra $${ten}$ chia hết cho $${p}$ mà không chia hết cho $${p * p}$.`, ...BUOC_KET], [
      `Mỗi số hạng của $${ten}$ đều chia hết cho $${a}$, mà $${a}$ chia hết cho $${p}$, nên $${ten}\\vdots ${p}$.`,
      `Viết $${ten}=${a}+(${phan})$. Với ${le ? 'mỗi số mũ lẻ $j\\ge 3$' : 'mỗi $j\\ge 2$'} ta có $${a}^j=${a}^2.${a}^{j-2}=${a2}.${a}^{j-2}$ chia hết cho $${a2}$${a === p ? '' : `, nên chia hết cho $${p * p}$`}. Do đó tổng $${phan}$ chia hết cho $${p * p}$. Mà $${a}$ chia hết cho $${p}$ và không chia hết cho $${p * p}$${lyDoA(a, p)}.`,
      `Suy ra $${ten}$ chia hết cho $${p}$ nhưng không chia hết cho $${p * p}$.`, ...KET(ten, p)]),
  }
}
function dayHaiPhan(a, n, ten) { // a nguyên tố, n chẵn: a) chia hết cho a+1  b) không SCP
  const p = a, c = a + 1
  const dau = `${a}+${pw(a, 2)}+${pw(a, 3)}+\\dots+${pw(a, n)}`
  const phan = `${pw(a, 2)}+${pw(a, 3)}+\\dots+${pw(a, n)}`
  return {
    noi_dung: `Cho $${ten}=${dau}$.\na) Chứng minh $${ten}$ chia hết cho ${c}.\nb) Chứng minh $${ten}$ không là số chính phương.`, p, chia: c,
    loi_giai: LG(`câu a) ghép các số hạng thành từng cặp liên tiếp để đặt nhân tử chung $${c}$; câu b) ${CHOT.replace(/^./, (x) => x.toLowerCase())}`, [
      `Câu a): số số hạng là $${n}$ (chẵn) nên ghép thành cặp $(${a}+${pw(a, 2)})+(${pw(a, 3)}+${pw(a, 4)})+\\dots$, mỗi cặp có nhân tử chung $${a + 1}$.`,
      `Câu b): chứng tỏ $${ten}$ chia hết cho $${p}$ nhưng không chia hết cho $${p * p}$ (số hạng đầu là $${a}$, các số hạng sau chia hết cho $${p * p}$).`, ...BUOC_KET], [
      `a) Ta có $${ten}=(${a}+${pw(a, 2)})+(${pw(a, 3)}+${pw(a, 4)})+\\dots+(${pw(a, n - 1)}+${pw(a, n)})=${a}(1+${a})+${pw(a, 3)}(1+${a})+\\dots+${pw(a, n - 1)}(1+${a})=${c}.(${a}+${pw(a, 3)}+\\dots+${pw(a, n - 1)})$.`,
      `Vậy $${ten}$ chia hết cho ${c}.`,
      `b) Mỗi số hạng của $${ten}$ đều chia hết cho $${a}$ nên $${ten}\\vdots ${p}$.`,
      `Viết $${ten}=${a}+(${phan})$. Với mỗi $j\\ge 2$ ta có $${a}^j=${a}^2.${a}^{j-2}$ chia hết cho $${a * a}$. Do đó tổng $${phan}$ chia hết cho $${p * p}$. Mà $${a}$ không chia hết cho $${p * p}$.`,
      `Suy ra $${ten}$ chia hết cho $${p}$ nhưng không chia hết cho $${p * p}$.`, ...KET(ten, p)]),
  }
}
const D1 = [[5, 5, 100, 'A'], [2, 2, 45, 'B'], [3, 3, 71, 'C'], [7, 7, 31, 'D'], [19, 19, 24, 'M'], [23, 23, 18, 'N'], [29, 29, 16, 'P'], [6, 3, 40, 'S'], [6, 2, 35, 'T'], [10, 5, 30, 'U'], [10, 2, 27, 'V'], [14, 7, 22, 'A'], [15, 5, 20, 'B'], [21, 7, 16, 'C'], [22, 11, 14, 'D'], [30, 3, 12, 'M']].map(([a, p, n, t]) => dayMot(a, p, n, t, false))
const D2 = [[3, 3, 41, 'M'], [5, 5, 31, 'A'], [7, 7, 25, 'B'], [2, 2, 51, 'N'], [10, 5, 21, 'S'], [6, 3, 27, 'T']].map(([a, p, n, t]) => dayMot(a, p, n, t, true))
const D3 = [[3, 40, 'M'], [7, 36, 'A'], [11, 30, 'B'], [13, 24, 'N'], [2, 50, 'S'], [17, 20, 'P'], [19, 26, 'T'], [23, 16, 'U']].map(([a, n, t]) => dayHaiPhan(a, n, t))

// ── NDB02801: biểu thức T1 ± T2, T1 chia hết cho p², T2 chia hết cho p nhưng không chia hết cho p² ───────────────
// kieu: 'pn+p' (p^n + p) · 'pn-p' · 'an+a' (a^n + a, p ‖ a) · '10n' (10^n ± c, p=5, c=5.t) · 'pn+c' (p^n + c, c=p.t, p ∤ t)
function bieuThuc(kieu, p, n, ten, c = null, dau = '+') {
  let T1, T2, ly1, ly2, a = p
  if (kieu === 'pn+p' || kieu === 'pn-p') { T1 = pw(p, n); T2 = `${p}`; dau = kieu === 'pn+p' ? '+' : '-'
    ly1 = `$${T1}=${p}^2.${pw(p, n - 2)}=${p * p}.${pw(p, n - 2)}$ chia hết cho $${p * p}$ (vì $${n}\\ge 2$)`; ly2 = `$${p}$ chia hết cho $${p}$ và không chia hết cho $${p * p}$` }
  else if (kieu === 'an+a') { a = c; T1 = pw(a, n); T2 = `${a}`
    ly1 = `$${T1}=${a}^2.${pw(a, n - 2)}=${a * a}.${pw(a, n - 2)}$ chia hết cho $${a * a}$, mà $${a * a}$ chia hết cho $${p * p}$ nên $${T1}$ chia hết cho $${p * p}$`
    ly2 = `$${a}=${p}.${a / p}$ chia hết cho $${p}$ và không chia hết cho $${p * p}$ (vì $${a / p}$ không chia hết cho $${p}$)` }
  else if (kieu === '10n') { T1 = pw(10, n); T2 = `${c}`; p = 5
    ly1 = `$${T1}=100.${pw(10, n - 2)}=25.(4.${pw(10, n - 2)})$ chia hết cho $25$`; ly2 = `$${c}=5.${c / 5}$ chia hết cho $5$ và không chia hết cho $25$ (vì $${c / 5}$ không chia hết cho $5$)` }
  else { T1 = pw(p, n); T2 = `${c}`
    ly1 = `$${T1}=${p}^2.${pw(p, n - 2)}=${p * p}.${pw(p, n - 2)}$ chia hết cho $${p * p}$ (vì $${n}\\ge 2$)`; ly2 = `$${c}=${p}.${c / p}$ chia hết cho $${p}$ và không chia hết cho $${p * p}$ (vì $${c / p}$ không chia hết cho $${p}$)`; dau = '+' }
  const bt = `${T1}${dau}${T2}`, P = p * p
  const lyTong = dau === '+'
    ? `Do đó $${ten}=${bt}$ chia hết cho $${p}$ (tổng hai số cùng chia hết cho $${p}$), và không chia hết cho $${P}$ (tổng của một số chia hết cho $${P}$ với một số không chia hết cho $${P}$)`
    : `Do đó $${ten}=${bt}$ chia hết cho $${p}$ (hiệu hai số cùng chia hết cho $${p}$), và không chia hết cho $${P}$ (hiệu của một số chia hết cho $${P}$ với một số không chia hết cho $${P}$)`
  return {
    noi_dung: `Chứng minh rằng $${ten}=${bt}$ không là số chính phương.`, p,
    loi_giai: LG(CHOT, [
      `Tách biểu thức thành hai số: một số chia hết cho $p^2$ và một số chỉ chia hết cho $p$ (không chia hết cho $p^2$).`,
      `Suy ra biểu thức chia hết cho $p$ nhưng không chia hết cho $p^2$.`, ...BUOC_KET], [
      `Ta có ${ly1}; ${ly2}.`, `${lyTong}.`, `Suy ra $${ten}$ chia hết cho $${p}$ nhưng không chia hết cho $${P}$.`, ...KET(ten, p)]),
  }
}
const E1 = [[3, 15, 'A'], [5, 12, 'B'], [7, 10, 'C'], [11, 8, 'M'], [13, 9, 'N'], [2, 20, 'P']].map(([p, n, t]) => bieuThuc('pn+p', p, n, t))
const E2 = [[3, 17, 'A'], [5, 14, 'B'], [7, 11, 'S'], [2, 25, 'T'], [11, 9, 'U']].map(([p, n, t]) => bieuThuc('pn-p', p, n, t))
const E3 = [[6, 3, 10, 'M'], [10, 5, 12, 'A'], [14, 7, 9, 'B'], [15, 5, 8, 'N'], [21, 3, 7, 'P'], [22, 11, 6, 'Q']].map(([a, p, n, t]) => bieuThuc('an+a', p, n, t, a))
const E4 = [[12, '+', 5, 'A'], [15, '+', 15, 'B'], [9, '+', 35, 'C'], [20, '-', 5, 'M'], [14, '+', 45, 'N'], [11, '-', 15, 'P']].map(([n, d, c, t]) => bieuThuc('10n', 5, n, t, c, d))
const E5 = [[3, 14, 12, 'A'], [5, 9, 10, 'B'], [7, 8, 14, 'C'], [2, 40, 6, 'M'], [3, 20, 6, 'N'], [11, 7, 22, 'P'], [2, 33, 10, 'S'], [13, 6, 26, 'T']].map(([p, n, c, t]) => bieuThuc('pn+c', p, n, t, c))

// ── bộ kiểm ĐỘC LẬP (đọc đề + lời giải từ chữ, tính lại bằng BigInt) ──────────────────────────────────────────────
const isqrt = (n) => { if (n < 2n) return n; let x = 1n << BigInt((n.toString(2).length >> 1) + 1); for (;;) { const y = (x + n / x) >> 1n; if (y >= x) return x; x = y } }
const laNT = (p) => { if (p < 2n) return false; for (let i = 2n; i * i <= p; i++) if (p % i === 0n) return false; return true }
const giaTri = (bt) => { // "3^{15}+3" | "10^{12}-5" | "a+a^2+\dots+a^n" | "a+a^3+a^5+\dots+a^n"
  bt = bt.replace(/\s+/g, '')
  const tok = (s) => [...s.matchAll(/([+-]?)(\d+)(?:\^\{?(\d+)\}?)?/g)].map((m) => ({ dau: m[1] === '-' ? -1n : 1n, b: BigInt(m[2]), e: m[3] ? BigInt(m[3]) : 1n, coMu: !!m[3] }))
  if (bt.includes('\\dots')) {
    const [dau, cuoi] = bt.split('\\dots'); const ts = tok(dau.replace(/\+$/, '')), last = tok(cuoi)[0]
    const b = ts[0].b; if (ts.some((t) => t.b !== b) || last.b !== b || ts.length < 3) return null
    const buoc = ts[1].e - ts[0].e; if (buoc < 1n || ts.some((t, i) => t.e !== ts[0].e + BigInt(i) * buoc)) return null
    let S = 0n; for (let e = ts[0].e; e <= last.e; e += buoc) S += b ** e
    return (last.e - ts[0].e) % buoc === 0n ? S : null
  }
  return tok(bt).reduce((s, t) => s + t.dau * t.b ** t.e, 0n)
}
function kiem(c) {
  const m = c.noi_dung.match(/\$([A-Z])=([^$]+)\$/); if (!m) return ['không đọc được đề']
  const A = giaTri(m[2]); if (A === null || A <= 0n) return ['không tính được biểu thức']
  const loi = [], r = isqrt(A)
  if (r * r === A) loi.push('biểu thức LÀ số chính phương (đề sai)')
  const p = BigInt(c.p)
  if (!laNT(p)) loi.push('p không nguyên tố')
  if (A % p !== 0n) loi.push(`biểu thức không chia hết cho ${p}`)
  if (A % (p * p) === 0n) loi.push(`biểu thức chia hết cho ${p}² (cách 1 không dùng được)`)
  if (!new RegExp(`chia hết cho \\$${p}\\$ nhưng không chia hết cho \\$${p * p}\\$`).test(c.loi_giai)) loi.push('lời giải không nêu đúng p / p² đã kiểm')
  if (c.chia && A % BigInt(c.chia) !== 0n) loi.push(`phần a) sai: không chia hết cho ${c.chia}`)
  if (/chữ số tận cùng|chia cho \d+ dư/.test(c.loi_giai)) loi.push('lời giải dùng cách 2/3 (luật: ưu tiên cách 1)')
  return loi
}

const DANH_SACH = { NDB02800: { goc: 'T1060000001623', cau: [...D1, ...D2, ...D3] }, NDB02801: { goc: 'T1060000001621', cau: [...E1, ...E2, ...E3, ...E4, ...E5] } }

const db = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await db.connect()
try {
  const out = [], lo = {}, yc = {}
  for (const [dang, { goc, cau }] of Object.entries(DANH_SACH)) {
    const tot = cau.filter((c) => { const l = kiem(c); if (l.length) console.log(`  ✘ ${dang}: ${l.join(' | ')} :: ${c.noi_dung.slice(0, 80)}`); return !l.length })
    console.log(`${dang}: sinh ${cau.length}, qua bộ kiểm ${tot.length}, gốc ${goc}`)
    if (!GHI) { console.log('   mẫu:', tot[0].noi_dung.replace(/\n/g, ' ⏎ '), '\n', tot[0].loi_giai.split('**Phần 2. Trình bày**')[1].slice(0, 400)); continue }
    const y = (await db.query(`insert into dai_cau_hoi_yeu_cau_clone (ma_cau_goc, so_bien_the, ghi_chu) values ($1, $2, 'bù SCP ưu tiên cách 1 (p | A, p² ∤ A) — Thùy 21/11') returning id`, [goc, tot.length])).rows[0]
    yc[dang] = y.id
    out.push({ yeu_cau_id: y.id, variants: tot.map((c) => ({ noi_dung: c.noi_dung, loi_giai: c.loi_giai })) })
  }
  if (GHI && out.length) {
    const tmp = process.env.TEMP || '.', tep = join(tmp, `k6-scp-${Date.now()}.json`); writeFileSync(tep, JSON.stringify(out))
    console.log(execFileSync('node', [join(root, 'scripts/hangdoi-clone.mjs'), '--ghi', tep], { encoding: 'utf8' }))
    for (const [dang, id] of Object.entries(yc)) {
      const ids = (await db.query(`select id from dai_cau_hoi_clone_cho_duyet where yeu_cau_id = $1 and tu_choi_at is null`, [id])).rows.map((r) => r.id)
      lo[dang] = { ids, ghi_chu: 'bộ kiểm BigInt đọc lại đề: không là SCP, p nguyên tố, p | A, p² ∤ A (cách 1), phần a) chia hết (k6-scp.mjs)', mot_phan: false }
    }
    const tepLo = join(tmp, `k6-scp-lo-${Date.now()}.json`); writeFileSync(tepLo, JSON.stringify(lo))
    console.log(execFileSync('node', [join(root, 'scripts/kho/clone/duyet-nhap-clone.mjs'), '--dang', Object.keys(lo).join(','), '--duyet-lo', tepLo, '--ghi'], { encoding: 'utf8' }))
  }
} finally { await db.end() }
