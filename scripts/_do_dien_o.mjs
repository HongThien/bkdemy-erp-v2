// ĐO KHẢ THI "điền ô trống trong lời giải": lời giải kho có máy đọc được từng dòng không, và có bao nhiêu ứng viên ô.
// Ứng viên ô = số/phân số ở dòng k là GIÁ TRỊ của một biểu thức con (không phải lá) ở dòng k−1 → "vừa thực hiện 1 phép tính con".
import pg from 'pg'
import { readFileSync } from 'node:fs'
import { parse, mathOf, ev, canonOf } from './mcq-auto.mjs'
const url = readFileSync(new URL('../.env', import.meta.url), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1]
const c = new pg.Client({ connectionString: url }); await c.connect()
const { rows } = await c.query(`select ma_cau, dang_chinh, noi_dung, loi_giai, nguon from dai_cau_hoi where xoa_at is null and loi_giai is not null
  and dang_chinh in ('T107010201','T107010202','T107010203','T107010206','T107010207','T107010401','T107010403','T107010404','T107010301')`)
await c.end()
const val = (n) => { try { return canonOf(ev(n, { rule: null })) } catch { return null } }
// mọi biểu thức con KHÔNG phải lá, kèm giá trị
function subs(n, out = []) { if (!n || n.t === 'num' || n.t === 'x') return out; if (n.t !== 'paren') { const v = val(n); if (v) out.push({ n, v }) } for (const k of ['a', 'b']) if (n[k]) subs(n[k], out); return out }
function leaves(n, out = []) { if (!n) return out; if (n.t === 'num') { out.push(canonOf(n.v)); return out } if (n.t === 'neg' && n.a.t === 'num') { out.push(canonOf(ev(n, { rule: null }))); return out } for (const k of ['a', 'b']) if (n[k]) leaves(n[k], out); return out }
const tk = { cau: 0, doc_het: 0, chuoi_ok: 0, o: 0, cau_co_o: 0, dong: 0, dong_doc: 0 }
const byNguon = {}
for (const q of rows) {
  tk.cau++
  const lines = q.loi_giai.replace(/\\n/g, '\n').split('\n').map((l) => l.trim()).filter(Boolean)
  const trees = []
  let docHet = true
  for (const l of lines) {
    tk.dong++
    let s = l.replace(/^(TH\d:|Vậy.*|x\s*\\in.*)$/i, '').replace(/^\$?\s*(x\s*)?=\s*/, '').replace(/^x\s*=\s*/, '')
    s = s.replace(/^\$|\$$/g, '').trim()
    if (!s || /[a-wyzA-Z]{3,}/.test(s.replace(/\\(dfrac|left|right|cdot|times)/g, ''))) { trees.push(null); continue }
    try { const t = parse(s.includes('=') ? s.slice(s.lastIndexOf('=') + 1) : s); trees.push(t); tk.dong_doc++ } catch { trees.push(null); docHet = false }
  }
  const ok = trees.filter(Boolean)
  if (docHet && ok.length >= 2) tk.doc_het++
  // chuỗi nhất quán: các dòng đọc được có cùng giá trị (Tính) — Tìm x thì bỏ qua kiểm này
  const vals = ok.map(val).filter(Boolean)
  const chuoi = !q.noi_dung.includes('x') && vals.length >= 2 && vals.every((v) => v === vals[0])
  if (chuoi) tk.chuoi_ok++
  let nO = 0
  for (let k = 1; k < trees.length; k++) {
    if (!trees[k] || !trees[k - 1]) continue
    const sv = new Set(subs(trees[k - 1]).map((s) => s.v))
    const lv = leaves(trees[k]); const prevLeaves = new Set(leaves(trees[k - 1]))
    for (const v of lv) if (sv.has(v) && !prevLeaves.has(v)) nO++
  }
  if (nO) tk.cau_co_o++; tk.o += nO
  const b = byNguon[q.nguon] ??= { cau: 0, co_o: 0 }; b.cau++; if (nO) b.co_o++
}
console.log(tk, 'ô/câu có ô:', (tk.o / Math.max(1, tk.cau_co_o)).toFixed(2), 'dòng đọc được:', (100 * tk.dong_doc / tk.dong).toFixed(0) + '%', byNguon)
