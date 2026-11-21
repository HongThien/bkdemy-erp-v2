// ============================================================================
// k6-scp-sua.mjs — dọn câu CŨ của NDB02800 · NDB02801 theo luật Thùy 21/11 "ưu tiên cách 1" (p | A, p² ∤ A):
//   · câu giải được bằng cách 1  ⇒ VIẾT LẠI lời giải theo cách 1 (giữ nguyên đề);
//   · câu KHÔNG giải được bằng cách 1 (tận cùng · số dư · kẹp · số mũ lẻ · …) ⇒ xoá MỀM (xoa_at, vào kho rác, khôi phục được).
// Danh sách cố định dưới đây (đã rà từng câu). Mặc định chạy thử (ROLLBACK); --ghi mới ghi.
//   node scripts/kho/clone/k6-scp-sua.mjs [--ghi]
// Khôi phục 1 câu: update dai_cau_hoi set xoa_at = null where ma_cau = '<mã>'.
// ============================================================================
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'
import { dayMot, dayHaiPhan, kiem } from './k6-scp.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const env = Object.fromEntries(readFileSync(join(root, '.env'), 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const GHI = process.argv.includes('--ghi')
const T = (n) => `T106000000${String(n).padStart(4, '0')}`            // T1060000001623 …

// ── Xoá mềm: không giải được bằng cách 1 ────────────────────────────────────────────────────────────────────────
const XOA = {
  // 02800 — chuỗi 1+a+a²+…(không có số hạng chung p‖) · a=8 (v₂ = 3, lẻ nhưng không phải p/p²)
  NDB02800: [1618, 1738, 4865, 4866, 4867, 4868, 4869, 4870].map(T),
  NDB02801: [
    1617, 1748, 4874, 4875,                                    // tổng các chữ số (cách 3)
    1619, 1620, 1745, 1746, 1747, 4876, 4877, 4878,            // biểu thức = luỹ thừa số mũ lẻ (chia hết cho p² nên cách 1 không dùng được)
    1621, 1749, 1750, 4881, 4882,                              // tổng 4 luỹ thừa 4n: số dư khi chia 5 (cách 3)
    1751, 1752, 1753, 1754, 4873, 4883, 4884,                  // n²+…: kẹp giữa hai số chính phương liên tiếp
    2458,                                                      // abab / abcabc / ababab: abcabc, ababab cần cách mở rộng (nhiều thừa số nguyên tố)
    2463,                                                      // A, B không đồng thời SCP: số dư
    2464,                                                      // đề "chứng minh là SCP" — không thuộc dạng "không phải SCP"
  ].map(T),
}

// ── Viết lại theo cách 1 ──────────────────────────────────────────────────────────────────────────────────────────
const VIET_LAI = []                                            // { dang, ma, loi_giai, kt: {noi_dung, p, chia?} }
const chu = (nd) => nd.match(/\$([A-Z])=/)[1]
const doc = (nd) => { const m = nd.match(/\$[A-Z]=(\d+)\+\d+\^2\+\d+\^3\+\\dots\+\d+\^\{?(\d+)\}?\$/); return { a: +m[1], n: +m[2] } }
// dãy a+a²+…+a^n (a nguyên tố): 02800
for (const n of [1739, 1740, 1741, 1742, 1743, 1744, 1732, 1733, 1734, 1735, 1736, 1737, 4861, 4862, 4863, 4864]) VIET_LAI.push({ dang: 'NDB02800', ma: T(n), loai: 'day' })
for (const n of [1623, 4858, 4859, 4860, 4871, 4872]) VIET_LAI.push({ dang: 'NDB02800', ma: T(n), loai: 'haiphan' })
// tổng k số tự nhiên liên tiếp (k = 4, 12, 20) và abc+bca+cab: 02801
for (const n of [1622, 4879, 4880]) VIET_LAI.push({ dang: 'NDB02801', ma: T(n), loai: 'lientiep' })
VIET_LAI.push({ dang: 'NDB02801', ma: T(2459), loai: 'abc' })

const LG = (chot, buoc, trinhBay) => `**Phần 1. Hướng dẫn**\n\n**Mấu chốt:** ${chot}\n\n${buoc.map((b, i) => `**Bước ${i + 1}.** ${b}`).join('\n\n')}\n\n**Phần 2. Trình bày**\n\n${trinhBay.join('\n\n')}`
const CHOT = 'chứng minh biểu thức chia hết cho số nguyên tố $p$ nhưng **không chia hết cho $p^2$**, rồi dùng tính chất: số chính phương mà chia hết cho $p$ thì phải chia hết cho $p^2$ (mọi thừa số nguyên tố của số chính phương có số mũ chẵn).'
const KET = (X, p) => [
  `Giả sử $${X}$ là số chính phương, tức là $${X}=m.m$ với $m\\in\\mathbb{N}$. Phân tích $m$ ra thừa số nguyên tố; mỗi luỹ thừa $q^e$ có trong $m$ thì trong $m.m$ thành $q^e.q^e=q^{e+e}$, số mũ là số chẵn. Vậy khi phân tích $${X}$ ra thừa số nguyên tố, mọi thừa số đều có số mũ chẵn.`,
  `Vì $${X}$ chia hết cho $${p}$ nên số mũ của thừa số nguyên tố $${p}$ trong $${X}$ lớn hơn hoặc bằng $1$, mà số mũ đó chẵn nên lớn hơn hoặc bằng $2$. Suy ra $${X}$ chia hết cho $${p}^2=${p * p}$. Mâu thuẫn với $${X}$ không chia hết cho $${p * p}$.`, `Vậy $${X}$ không là số chính phương.`]
const SO = { 'bốn': 4, 'mười hai': 12, 'hai mươi': 20 }
function lienTiep(nd) {
  const k = Object.entries(SO).find(([w]) => nd.includes(`tổng ${w} số`))?.[1]; if (!k) throw new Error('không đọc được số số hạng: ' + nd)
  const m = k / 2, c = k - 1                                        // k/2 = 2.(số lẻ) ; mỗi cặp có tổng 2n + (k-1)
  if (m % 2 !== 0 && m !== 2 && (m / 2) % 2 === 0) throw new Error('k không hợp lệ')
  const le = m / 2
  return {
    p: 2, loi_giai: LG(CHOT, [
      `Gọi $${k}$ số tự nhiên liên tiếp là $n;\\ n+1;\\ \\dots;\\ n+${k - 1}$ và tính tổng $S$ (ghép cặp hai đầu).`,
      `Viết $S$ dưới dạng tích của $2$ với một số lẻ để thấy $S$ chia hết cho $2$ nhưng không chia hết cho $4$.`, 'Dùng tính chất: số chính phương mà chia hết cho $2$ thì phải chia hết cho $4$ để kết luận.'], [
      `Gọi $${k}$ số tự nhiên liên tiếp là $n;\\ n+1;\\ \\dots;\\ n+${k - 1}$. Tổng của chúng là $S=n+(n+1)+\\dots+(n+${k - 1})$.`,
      `Ghép cặp hai đầu: $S$ có $${m}$ cặp, mỗi cặp có tổng $2n+${c}$ nên $S=${m}.(2n+${c})$.`,
      `Ta có $${m}=2.${le}$ nên $S=2.${le}.(2n+${c})$, trong đó $${le}$ là số lẻ và $2n+${c}$ là số lẻ (vì $2n$ chẵn, ${c} lẻ), nên $${le}.(2n+${c})$ là số lẻ.`,
      `Suy ra $S$ chia hết cho $2$ nhưng không chia hết cho $4$.`, ...KET('S', 2)]),
  }
}
function abc() {
  return {
    p: 37, loi_giai: LG(CHOT, ['Viết tổng dưới dạng số và gộp theo hàng trăm, chục, đơn vị để được $111.(a+b+c)$ rồi tách $111=3.37$.', 'Chứng tỏ $a+b+c$ nhỏ hơn $37$ nên $A$ chia hết cho $37$ mà không chia hết cho $37^2$.', 'Dùng tính chất: số chính phương mà chia hết cho số nguyên tố $37$ thì phải chia hết cho $37^2$.'], [
      `Ta có $A=\\overline{abc}+\\overline{bca}+\\overline{cab}=(100a+10b+c)+(100b+10c+a)+(100c+10a+b)=111a+111b+111c=111.(a+b+c)=3.37.(a+b+c)$.`,
      `Vì $a,b,c$ là các chữ số khác $0$ nên $1\\le a+b+c\\le 27<37$, do đó $a+b+c$ không chia hết cho $37$.`,
      `Suy ra $A=37.[3.(a+b+c)]$ chia hết cho $37$; còn $3.(a+b+c)$ không chia hết cho $37$ (vì $37$ nguyên tố, $37\\nmid 3$ và $37\\nmid(a+b+c)$) nên $A$ không chia hết cho $37^2=1369$.`, ...KET('A', 37)]),
  }
}
function viet(c, dang) {
  const nd = c.noi_dung
  if (c.loai === 'day' || c.loai === 'haiphan') {
    const { a, n } = doc(nd), ten = chu(nd)
    const sinh = c.loai === 'day' ? dayMot(a, a, n, ten, false) : dayHaiPhan(a, n, ten)
    return { loi_giai: sinh.loi_giai, p: a, chia: sinh.chia }
  }
  if (c.loai === 'lientiep') return lienTiep(nd)
  return abc()
}

const db = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await db.connect()
try {
  await db.query('begin')
  const tatCa = [...VIET_LAI.map((v) => v.ma), ...Object.values(XOA).flat()]
  const { rows } = await db.query(`select ma_cau, noi_dung, loai_cau, nguon_giai, giai_method, xoa_at, (select dang_bai_id from bdm_cau_dang d where d.ma_cau = c.ma_cau and d.kho = 'dai') dang from dai_cau_hoi c where ma_cau = any($1)`, [tatCa])
  const theoMa = new Map(rows.map((r) => [r.ma_cau, r]))
  for (const ma of tatCa) if (!theoMa.has(ma)) throw new Error(`không có câu ${ma}`)
  for (const [dang, ds] of Object.entries(XOA)) for (const ma of ds) if (theoMa.get(ma).dang !== dang) throw new Error(`${ma} không thuộc ${dang} (thuộc ${theoMa.get(ma).dang})`)
  let sua = 0
  for (const v of VIET_LAI) {
    const r = theoMa.get(v.ma); if (r.dang !== v.dang) throw new Error(`${v.ma} không thuộc ${v.dang}`)
    const m = viet({ ...v, noi_dung: r.noi_dung }, v.dang)
    // bộ kiểm độc lập: đề + lời giải mới (abc & liên tiếp kiểm riêng bằng vét cạn bên dưới)
    let loi = []
    if (v.loai === 'haiphan' && Number(r.noi_dung.match(/chia hết cho (\d+)/)?.[1]) !== m.chia) loi.push('đề nói chia hết cho số khác a+1')
    if (v.loai === 'day' || v.loai === 'haiphan') loi.push(...kiem({ noi_dung: r.noi_dung, loi_giai: m.loi_giai, p: m.p, chia: m.chia }))
    else if (v.loai === 'abc') { for (let a = 1; a <= 9; a++) for (let b = 1; b <= 9; b++) for (let c = 1; c <= 9; c++) { const A = (100 * a + 10 * b + c) + (100 * b + 10 * c + a) + (100 * c + 10 * a + b); if (A % 37 || !(A % 1369)) loi.push(`abc=${a}${b}${c}`) } }
    else { const k = Object.entries(SO).find(([w]) => r.noi_dung.includes(`tổng ${w} số`))[1]; for (let n = 0; n < 2000; n++) { let S = 0; for (let i = 0; i < k; i++) S += n + i; if (S % 2 || !(S % 4)) loi.push(`n=${n}`) } }
    if (loi.length) throw new Error(`${v.ma}: bộ kiểm không đạt: ${loi.slice(0, 3).join(' | ')}`)
    await db.query(`update dai_cau_hoi set loi_giai = $2, nguon_giai = 'ai', giai_method = coalesce(giai_method, 'claude_code') where ma_cau = $1`, [v.ma, m.loi_giai])
    sua++
  }
  let xoa = 0
  for (const ds of Object.values(XOA)) { const r = await db.query(`update dai_cau_hoi set xoa_at = now() where ma_cau = any($1) and xoa_at is null`, [ds]); xoa += r.rowCount }
  console.log(GHI ? '■ GHI THẬT' : '□ CHẠY THỬ (sẽ ROLLBACK)', `· viết lại ${sua} câu theo cách 1 · xoá mềm ${xoa} câu`)
  console.log('  nguồn lời giải cũ của câu viết lại:', Object.entries(VIET_LAI.reduce((a, v) => { const r = theoMa.get(v.ma); const k = `${r.nguon_giai}/${r.giai_method}`; a[k] = (a[k] || 0) + 1; return a }, {})).map(([k, n]) => `${k}=${n}`).join(' · '))
  await db.query(GHI ? 'commit' : 'rollback')
} catch (e) { await db.query('rollback').catch(() => {}); console.error('LỖI — đã rollback:', e.message); process.exitCode = 1 } finally { await db.end() }
