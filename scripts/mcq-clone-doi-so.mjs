// CLONE ĐỔI SỐ cho dạng ít câu (spec-mcq-form.md §9, CEO 08/09: "clone thêm câu để đảm bảo độ đa dạng").
//   node scripts/mcq-clone-doi-so.mjs --dang T107010201 --muc-tieu 60 [--ghi] [--seed 7]
// Cách: lấy câu gốc trong dạng → thay các SỐ trong đề (giữ cấu trúc; số lặp lại thay NHẤT QUÁN để giữ "thuận tiện"
// a·b + a·c) → tính lại đáp số bằng đúng bộ tính của mcq-auto.mjs → chỉ nhận khi đáp số "đẹp" (tử ≤ 200, mẫu ≤ 100,
// khác đáp số gốc, không phải 0/±1 trừ khi gốc cũng vậy). Ghi vào dai_cau_hoi_clone_cho_duyet (clone_method
// 'mcq_auto_doi_so', loi_giai NULL → sau duyệt câu vào hàng "Chưa có lời giải" như mọi clone) — NGƯỜI DUYỆT quyết.
// Form MCQ cho clone sinh SAU khi clone được duyệt (§9 thứ tự bắt buộc).
import pg from 'pg'
import { readFileSync } from 'node:fs'
import { parseHuuTi } from './lib/huuti.mjs'
import { tinh, texOfValue } from './mcq-auto.mjs'

const env = Object.fromEntries(readFileSync(new URL('../.env', import.meta.url), 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const args = process.argv.slice(2)
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d }
const dang = opt('--dang'), mucTieu = Number(opt('--muc-tieu', 60)), ghi = args.includes('--ghi')
if (!dang) { console.error('Cần --dang'); process.exit(1) }
let seed = Number(opt('--seed', 20260908)); const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648 }
const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1))

const c = new pg.Client({ connectionString: env.DATABASE_URL, connectionTimeoutMillis: 20000 }); await c.connect()
const goc = (await c.query(`select ma_cau, loai_cau, noi_dung, dap_an from dai_cau_hoi where dang_chinh = $1 and xoa_at is null and dap_an is not null order by ma_cau`, [dang])).rows
const daCo = (await c.query(`select count(*)::int n from dai_cau_hoi where dang_chinh = $1 and xoa_at is null`, [dang])).rows[0].n
const choDuyet = (await c.query(`select count(*)::int n from dai_cau_hoi_clone_cho_duyet where dang_chinh = $1 and tu_choi_at is null and duyet_at is null`, [dang])).rows[0].n
const can = Math.max(0, mucTieu - daCo - choDuyet)
console.log(`${dang}: kho ${daCo} · clone chờ duyệt ${choDuyet} · mục tiêu ${mucTieu} ⇒ cần sinh ${can}`)
if (!can) { await c.end(); process.exit(0) }

// Thay số trong ĐOẠN TOÁN của đề (giữ nguyên phần chữ). Số mũ (sau ^) giữ nguyên. Cùng literal → cùng số mới.
const gcdN = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a }
function doiSo(noiDung) {
  const segs = noiDung.split('$'); if (segs.length < 3) return null
  const map = new Map()
  const newInt = (old) => { if (map.has('i' + old)) return map.get('i' + old); const v = String(ri(1, old.length > 1 ? 30 : 12)); map.set('i' + old, v); return v }
  // GIỮ THIẾT KẾ của đề gốc: các phân số có CÙNG MẪU SAU RÚT GỌN (3/−21 và −2/7 đều về mẫu 7) → cùng 1 mẫu mới;
  // phân số gốc CHƯA tối giản (3/21, k=3) → phân số mới cũng nhân cùng k để HS vẫn phải rút gọn.
  const mauMoi = new Map() // mẫu-rút-gọn gốc → mẫu mới
  const newFrac = (a, b) => {
    const k = `f${a}/${b}`; if (map.has(k)) return map.get(k)
    const sa = a.startsWith('-') ? '-' : '', sb = b.startsWith('-') ? '-' : ''
    const ai = Math.abs(Number(a)), bi = Math.abs(Number(b)); const g = gcdN(ai, bi) || 1; const bRut = bi / g
    if (!mauMoi.has(bRut)) { let m; do { m = ri(2, 12) } while ([...mauMoi.values()].includes(m) && mauMoi.size < 8); mauMoi.set(bRut, m) }
    const m = mauMoi.get(bRut)
    let na; do { na = ri(1, Math.max(3, 2 * m)) } while (na % m === 0)
    const v = `\\dfrac{${sa}${na * g}}{${sb}${m * g}}`; map.set(k, v); return v
  }
  const newDec = (old) => { if (map.has('d' + old)) return map.get('d' + old); const sep = old.includes(',') ? ',' : '.'; const v = `${ri(0, 3)}${sep}${[25, 5, 75, 2, 4, 6, 8, 1, 3, 15, 35][ri(0, 10)]}`; map.set('d' + old, v); return v }
  for (let i = 1; i < segs.length; i += 2) {
    let s = segs[i]
    s = s.replace(/\\[dt]?frac\{(-?\d+)\}\{(-?\d+)\}/g, (_, a, b) => newFrac(a, b))
    s = s.replace(/(?<![\d,.^{])(\d+[,.]\d+)(?![\d,.])/g, (_, d) => newDec(d))
    // số nguyên đứng 1 mình: không sau ^ / ^{ , không trong \dfrac (đã thay), không phần thập phân
    s = s.replace(/(?<![\d,.^{\\])(\d+)(?![\d,.}])/g, (m, d, off, str) => (str.slice(Math.max(0, off - 2), off).includes('^') ? m : newInt(d)))
    segs[i] = s
  }
  return segs.join('$')
}
const depSo = (v, goc) => {
  const arr = Array.isArray(v) ? v : [v]
  if (arr.some((r) => (r.p < 0n ? -r.p : r.p) > 100n || r.q > 50n)) return false
  const gocArr = Array.isArray(goc) ? goc : [goc]
  const tamThuong = (r) => r.p === 0n || (r.q === 1n && (r.p === 1n || r.p === -1n))
  if (arr.some(tamThuong) && !gocArr.some(tamThuong)) return false
  return true
}

const out = []; const daSinh = new Set()
let vong = 0
while (out.length < can && vong < 40) {
  vong++
  for (const q of goc) {
    if (out.length >= can) break
    const keyGoc = parseHuuTi(q.dap_an); if (!keyGoc.ok) continue
    const gocVal = tinh(q.noi_dung); if (!gocVal.ok || gocVal.canon !== keyGoc.canon) continue // máy không tái tạo được đáp số gốc → không dám clone
    for (let t = 0; t < 25; t++) {
      const nd = doiSo(q.noi_dung); if (!nd || nd === q.noi_dung || daSinh.has(nd)) continue
      const r = tinh(nd); if (!r.ok || r.canon === keyGoc.canon || !depSo(r.value, gocVal.value)) continue
      daSinh.add(nd); out.push({ parent: q.ma_cau, loai_cau: q.loai_cau, noi_dung: nd, dap_an: texOfValue(r.value), canon: r.canon }); break
    }
  }
}
console.log(`Sinh được ${out.length}/${can} (từ ${new Set(out.map((o) => o.parent)).size} câu gốc)`)
for (const o of out.slice(0, 6)) console.log('  ', o.parent, '→', o.noi_dung.replace(/\s+/g, ' ').slice(0, 90), '| ĐA', o.dap_an)
if (ghi && out.length) {
  const rows = out.map((o) => ({ dang_chinh: dang, loai_cau: o.loai_cau, noi_dung: o.noi_dung, dap_an: o.dap_an, parent_ma_cau: o.parent, clone_method: 'mcq_auto_doi_so' }))
  for (const r of rows) await c.query(`insert into dai_cau_hoi_clone_cho_duyet (dang_chinh, loai_cau, noi_dung, dap_an, parent_ma_cau, clone_method) values ($1,$2,$3,$4,$5,$6)`, [r.dang_chinh, r.loai_cau, r.noi_dung, r.dap_an, r.parent_ma_cau, r.clone_method])
  console.log(`Đã ghi ${rows.length} clone vào dai_cau_hoi_clone_cho_duyet (chờ duyệt).`)
}
await c.end()
