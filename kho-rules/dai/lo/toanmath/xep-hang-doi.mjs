// xep-hang-doi.mjs — CHỈ ĐỌC DB. Từ kết quả do-toanmath.mjs (--ra) ⇒ hàng đợi các bài toanmath CHƯA giải.
//   node --env-file=.env kho-rules/dai/lo/toanmath/xep-hang-doi.mjs <do-toanmath.json>
// Trạng thái: da_co (sha khớp tai_lieu/nhap_kho_log/ten_de_goc) · nghi_trung (ĐỀ THI cùng khối+trường+năm+kỳ đã có, khác file — cần kiểm nội dung
// trước khi bỏ qua) · chua. Đề cương không xét nghi_trung theo tên (hay khớp nhầm sang đề thi cùng trường).
import pg from 'pg'; import fs from 'node:fs'
const kq = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-')
const ky = (s) => /giua-(hoc-)?k[iy]-?(1|i)\b|gki\b/.test(s) ? 'gk1' : /giua-(hoc-)?k[iy]-?(2|ii)\b|gkii/.test(s) ? 'gk2' : /cuoi-(hoc-)?k[iy]-?(1|i)\b|hoc-k[iy]-(1|i)\b|cki\b/.test(s) ? 'ck1' : /cuoi-(hoc-)?k[iy]-?(2|ii)\b|hoc-k[iy]-(2|ii)\b|ckii/.test(s) ? 'ck2' : '?'
const truong = (s) => { const m = s.match(/(?:truong|thcs|thpt|lien-truong|so-gddt|phong-gddt|cum)-(.+?)(?:-co-dap-an|-$|$)/); return m ? m[1].split('-').filter((w) => !/^(thcs|thpt|truong|va|ha|noi|tp|hcm)$/.test(w)).slice(0, 4).join('-') : null }
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO || process.env.DATABASE_URL }); await c.connect()
await c.query('set default_transaction_read_only = on')
const db = (await c.query(`select id, khoi, ten from tai_lieu where loai='de_thi'`)).rows.map((r) => ({ id: r.id, khoi: String(r.khoi), ten: r.ten, s: slug(r.ten) }))
await c.end()
const out = kq.map((x) => {
  let tt = x.co ? 'da_co' : 'chua', trung = null
  if (!x.co && !/Đề cương/.test(x.folder)) { const t = truong(x.ten_bai), kk = ky(x.ten_bai), nam = (x.ten_bai.match(/20\d\d-20\d\d/) || [])[0]
    const h = t && t.length > 4 && db.find((d) => d.khoi === x.khoi.slice(1) && d.s.includes(t) && (!nam || d.s.includes(nam)) && (kk === '?' || ky(d.s) === kk || ky(d.s) === '?'))
    if (h) { tt = 'nghi_trung'; trung = { id: h.id, ten: h.ten } } }
  const word = x.files.filter((f) => /docx?$/.test(f.duoi)).length, pdf = x.files.filter((f) => f.duoi === 'pdf').length
  return { khoi: x.khoi, folder: x.folder, ten_bai: x.ten_bai, tt, trung, word, pdf, dinh_dang: !x.so_file ? 'khong_file' : word ? 'word' : 'pdf', files: x.files.filter((f) => !(f.tl || f.log || f.tdg)).map((f) => f.p) }
})
fs.writeFileSync(new URL('./hang-doi.json', import.meta.url), JSON.stringify(out, null, 1))
const g = {}
for (const x of out) { const k = `${x.khoi} ${x.folder.replace(/\/.*/, '')}`; g[k] ??= { bai: 0, da_co: 0, nghi_trung: 0, chua: 0, chua_word: 0, chua_pdf: 0, chua_file_word: 0, chua_file_pdf: 0, khong_file: 0 }
  const o = g[k]; o.bai++; o[x.tt]++; if (x.tt === 'chua') { if (x.dinh_dang === 'word') o.chua_word++; else if (x.dinh_dang === 'pdf') o.chua_pdf++; else o.khong_file++
    for (const f of x.files) /\.docx?$/i.test(f) ? o.chua_file_word++ : /\.pdf$/i.test(f) ? o.chua_file_pdf++ : 0 } }
const T = {}; console.log('nhóm'.padEnd(22), 'bài  đã_có nghi_trùng chưa | chưa: word pdf không_file | file word pdf')
for (const k of Object.keys(g).sort((a, b) => +a.slice(1, 3) - +b.slice(1, 3) || a.localeCompare(b))) { const o = g[k]; for (const z in o) T[z] = (T[z] || 0) + o[z]
  console.log(k.padEnd(22), [o.bai, o.da_co, o.nghi_trung, o.chua].map((v) => String(v).padStart(5)).join(''), ' |', [o.chua_word, o.chua_pdf, o.khong_file].map((v) => String(v).padStart(5)).join(''), ' |', [o.chua_file_word, o.chua_file_pdf].map((v) => String(v).padStart(6)).join('')) }
console.log('TỔNG', T)
