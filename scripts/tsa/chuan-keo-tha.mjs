// Chuẩn hoá câu KÉO THẢ của kho TSA để app học sinh dựng được đúng thể loại (kéo thẻ vào ô trống):
//   lua_chon = NGÂN HÀNG THẺ (mảng chuỗi, mỗi thẻ là chữ/LaTeX như trong PDF)
//   dap_an   = dạng chuẩn "a) $x$, b) $y$"  (mỗi ô trống 1 giá trị, theo thứ tự ô trống trong đề)
//   số ô trống = số cụm "____" (≥4 gạch dưới) trong noi_dung
// Câu nào không đưa được về dạng chuẩn, hoặc đáp án không nằm trong ngân hàng ⇒ KHÔNG đụng, liệt kê (app chưa phát câu đó cho học sinh).
//   node scripts/tsa/chuan-keo-tha.mjs [--ghi]
import pg from 'pg'; import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const GHI = process.argv.includes('--ghi')
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect()
const { rows } = await c.query(`select ma_cau, noi_dung, lua_chon, dap_an, da_duyet from tsa_cau_hoi where loai_cau = 'keo_tha' and xoa_at is null order by ma_cau`)

const boBold = (s) => s.replace(/\*\*/g, '')
const bo$ = (s) => s.trim().replace(/^\$+|\$+$/g, '').trim()
const phanSo = (s) => String(s).replace(/(^|[^\\\w{])(-?\d+)\s*\/\s*(\d+)(?![\w}])/g, '$1\\frac{$2}{$3}') // "400/3" → \frac{400}{3}
const chuan = (s) => phanSo(s).replace(/\\left|\\right|\\,|\\;|\\!|\\quad|\\text\{([^}]*)\}|\\mathrm\{([^}]*)\}|[\s$]/g, '').replace(/\\dfrac|\\tfrac/g, '\\frac').replace(/[;,.]+$/, '')
const tokens = (t) => [...t.matchAll(/\[\s*([^\[\]]+?)\s*\]/g)].map((m) => bo$(m[1]))

// ngân hàng thẻ = đoạn (cách nhau dòng trống) mà SAU KHI bỏ hết thẻ chỉ còn dấu ngăn cách.
// Thẻ = "[ … ]" (có thể là "[ $…$ ]") hoặc công thức rời "$…$" (kể cả "$\left[ 2 \right]$" = thẻ "2").
const bocThe = (m) => bo$(m).replace(/^\\left\[\s*(.+?)\s*\\right\]$/, '$1').trim()
function theTrong(dong) {
  const t = boBold(dong).replace(/\$\\quad\$/g, ' ')
  const re = /\[\s*(\$[^$]*\$|[^\[\]$]+?)\s*\]|\$[^$]+\$/g
  const th = []
  let con = t
  for (const m of t.matchAll(re)) { th.push(m[1] !== undefined ? bocThe(m[1]) : bocThe(m[0])); con = con.replace(m[0], ' ') }
  if (con.replace(/[\[\]|;,\s]|\bvà\b/g, '') !== '') return null
  return th
}
function nganHang(nd) {
  const bank = []
  for (const dong of nd.split('\n\n')) {
    if (/_{4,}/.test(dong)) continue
    const th = theTrong(dong)
    if (th && (th.length >= 2 || (th.length === 1 && !/^\d{1,2}$/.test(th[0])))) bank.push(...th)
  }
  return bank
}
function dapAn(dap, nBlank) {
  const d = String(dap ?? '').trim()
  let v = null
  if (/^[a-d]\)/.test(d)) v = d.split(/(?:^|,|;)\s*(?=[a-d]\)\s)/).map((p) => p.trim()).filter(Boolean).map((p) => bo$(p.replace(/^[a-d]\)\s*/, '').replace(/^\[\s*|\s*\]$/g, '')))
  else if (/^Ô\s*\d/.test(d)) v = d.split(/;\s*/).filter(Boolean).map((p) => bo$(p.replace(/^Ô\s*\d+\s*:\s*/, '').replace(/^\[\s*|\s*\]$/g, '')))
  else if (/^\[/.test(d)) { v = tokens(d); if (!v.length) v = null }
  else if (/^\$[^$]+\$(\s*(và|,|;)\s*\$[^$]+\$)+$/.test(d)) v = [...d.matchAll(/\$([^$]+)\$/g)].map((m) => m[1].trim())
  else if (/^\$[^$]+\$$/.test(d)) v = [bo$(d)]
  return v
}
const ketQua = { ok: [], loai: [] }
for (const q of rows) {
  const nBlank = (q.noi_dung.match(/_{4,}/g) || []).length
  const bank = (q.lua_chon && q.lua_chon.length ? q.lua_chon.map(bo$) : nganHang(q.noi_dung))
  const v = dapAn(q.dap_an, nBlank)
  let ly = null
  if (!nBlank) ly = 'đề không có ô trống ____'
  else if (!bank.length) ly = 'không tìm thấy ngân hàng thẻ'
  else if (!v) ly = 'đáp án không đọc được: ' + String(q.dap_an).slice(0, 50)
  else if (v.length !== nBlank) ly = `số đáp án ${v.length} ≠ số ô trống ${nBlank}`
  else if (!v.every((x) => bank.some((b) => chuan(b) === chuan(x)))) ly = 'đáp án không nằm trong ngân hàng thẻ: ' + JSON.stringify(v.filter((x) => !bank.some((b) => chuan(b) === chuan(x))))
  if (ly) { ketQua.loai.push({ ma: q.ma_cau, ly, duyet: q.da_duyet }); continue }
  // dùng đúng chữ của thẻ trong ngân hàng cho đáp án (để so khớp chính xác)
  const dapChuan = v.map((x) => bank.find((b) => chuan(b) === chuan(x)))
  ketQua.ok.push({ ma: q.ma_cau, bank: bank.map((b) => `$${b}$`.replace(/^\$\$|\$\$$/g, '$')), dap: dapChuan.map((x, i) => `${'abcdef'[i]}) $${x}$`).join(', ') })
}
console.log(GHI ? 'GHI' : 'CHẠY THỬ', 'chuẩn hoá được', ketQua.ok.length, '· không đưa được về dạng chuẩn', ketQua.loai.length)
for (const x of ketQua.loai) console.log('  KHÔNG', x.ma, x.duyet ? '(đã duyệt)' : '', '—', x.ly)
try {
  await c.query('begin')
  for (const o of ketQua.ok) await c.query(`update tsa_cau_hoi set lua_chon = $2::jsonb, dap_an = $3 where ma_cau = $1`, [o.ma, JSON.stringify(o.bank), o.dap])
  await c.query(GHI ? 'commit' : 'rollback')
} catch (e) { await c.query('rollback').catch(() => {}); console.error('LỖI', e.message); process.exitCode = 1 } finally { await c.end() }
