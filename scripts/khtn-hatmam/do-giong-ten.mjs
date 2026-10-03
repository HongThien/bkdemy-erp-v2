// Mã dạng trùng nhau giữa Hạt Mầm và khtn_ban_do: có CÙNG DẠNG không? (nhân chứng thứ hai = tên, CLAUDE §2). CHỈ ĐỌC.
import fs from 'node:fs'
import pg from 'pg'
process.loadEnvFile('.env')
const { cay } = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO || process.env.DATABASE_URL }); await c.connect()
const bd = new Map((await c.query(`select ma_dang, ten_dang, ten_chuyen_de from khtn_ban_do`)).rows.map((r) => [r.ma_dang, r]))
const tu = (s) => new Set((s ?? '').normalize('NFC').replace(/^\s*D\S*ng\s+\d+\s*[.:]\s*/i, '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase()
  .replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter((w) => w.length > 1 && !['va', 'cua', 'cac', 'trong', 'theo', 'tu', 'khi', 'bai', 'tap', 'dang', 've', 'mot', 'so'].includes(w)))
const jac = (a, b) => { const A = tu(a), B = tu(b); const i = [...A].filter((x) => B.has(x)).length; return A.size + B.size ? i / (A.size + B.size - i) : 0 }
const kq = {}
const lech = []
for (const [ma, d] of Object.entries(cay.dang)) {
  const e = bd.get(ma); if (!e) continue
  const j = jac(d.ten, e.ten_dang), k = ma.slice(0, 3)
  const o = (kq[k] ??= { giong: 0, mo: 0, khac: 0 })
  if (j >= 0.5) o.giong++; else if (j >= 0.25) o.mo++; else { o.khac++; if (lech.length < 12) lech.push(`${ma} (${j.toFixed(2)}): «${d.ten}» ↔ «${e.ten_dang}»`) }
}
console.log('mã trùng — tên GIỐNG (≥0,5) / MƠ (0,25–0,5) / KHÁC (<0,25):'); for (const [k, o] of Object.entries(kq)) console.log(' ', k, JSON.stringify(o))
console.log(lech.join('\n'))
// chuyên đề: tên chuyên đề theo mã 7 ký tự
const cdErp = new Map(); for (const e of bd.values()) cdErp.set(e.ma_dang.slice(0, 7), e.ten_chuyen_de)
const cdKq = { giong: 0, khac: 0, khongCo: 0 }; const cdLech = []
for (const [ma, d] of Object.entries(cay.chuyenDe)) { const e = cdErp.get(ma); if (!e) { cdKq.khongCo++; continue } const j = jac(d.ten.replace(/^Chuyên đề [\d.]+\.\s*/, ''), e); if (j >= 0.4) cdKq.giong++; else { cdKq.khac++; if (cdLech.length < 8) cdLech.push(`${ma}: «${d.ten}» ↔ «${e}»`) } }
console.log('\nchuyên đề:', JSON.stringify(cdKq), '\n' + cdLech.join('\n'))
await c.end()
