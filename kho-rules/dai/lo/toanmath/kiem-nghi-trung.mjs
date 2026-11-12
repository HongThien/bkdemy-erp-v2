// kiem-nghi-trung.mjs — CHỈ ĐỌC DB, KHÔNG gọi AI. Kiểm các bài toanmath "nghi_trung" (cùng khối+trường+năm+kỳ với đề đã có, khác file)
// bằng NHÂN CHỨNG THỨ HAI = nội dung: câu của đề ứng viên trong DB có nằm trong chữ của file không.
//   node --env-file=.env kho-rules/dai/lo/toanmath/kiem-nghi-trung.mjs [--goc "E:\BK ACADEMY\Tài liệu tham khảo"] [--n 20]
// Chữ file: PDF → pdftotext · .docx → word/document.xml bỏ thẻ · .doc cũ bỏ qua. Câu DB: bỏ $…$, so bằng cụm 5 chữ liên tiếp.
// Kết luận mỗi bài: trung (≥60% câu đủ dài của 1 đề ứng viên có trong file) · khac (<20% với mọi ứng viên) · mo_ho (giữa, hoặc <4 câu đủ dài)
//   · khong_doc (file không có lớp chữ — scan). Ghi ra kiem-nghi-trung.json; KHÔNG sửa hang-doi.json.
import pg from 'pg'; import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
const JSZip = createRequire(import.meta.url)('jszip')
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d }
const GOC = arg('--goc', 'E:\\BK ACADEMY\\Tài liệu tham khảo'), N = +arg('--n', 1e9)
const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'))
const hd = JSON.parse(fs.readFileSync(path.join(HERE, 'hang-doi.json'), 'utf8')).filter((x) => x.tt === 'nghi_trung').slice(0, N)

const slug = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-')
const ky = (s) => /giua-(hoc-)?k[iy]-?(1|i)\b|gki\b/.test(s) ? 'gk1' : /giua-(hoc-)?k[iy]-?(2|ii)\b|gkii/.test(s) ? 'gk2' : /cuoi-(hoc-)?k[iy]-?(1|i)\b|hoc-k[iy]-(1|i)\b|cki\b/.test(s) ? 'ck1' : /cuoi-(hoc-)?k[iy]-?(2|ii)\b|hoc-k[iy]-(2|ii)\b|ckii/.test(s) ? 'ck2' : '?'
const truong = (s) => { const m = s.match(/(?:truong|thcs|thpt|lien-truong|so-gddt|phong-gddt|cum)-(.+?)(?:-co-dap-an|-$|$)/); return m ? m[1].split('-').filter((w) => !/^(thcs|thpt|truong|va|ha|noi|tp|hcm)$/.test(w)).slice(0, 4).join('-') : null }
// chữ → dãy từ (bỏ dấu để chịu được font lỗi dấu, giữ chữ + số)
const tu = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase().match(/[a-z0-9]+/g) || []
const cum = (w, k = 5) => { const r = []; for (let i = 0; i + k <= w.length; i++) r.push(w.slice(i, i + k).join(' ')); return r }

const chuFile = async (p) => {
  try {
    if (/\.pdf$/i.test(p)) return execFileSync('pdftotext', ['-q', '-enc', 'UTF-8', p, '-'], { maxBuffer: 1 << 28 }).toString('utf8')
    if (/\.docx$/i.test(p)) { const z = await JSZip.loadAsync(fs.readFileSync(p)); return ((await z.file('word/document.xml')?.async('string')) || '').replace(/<\/w:p>/g, '\n').replace(/<[^>]+>/g, '') }
  } catch { return '' }
  return ''
}

const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO || process.env.DATABASE_URL }); await c.connect()
await c.query('set default_transaction_read_only = on')
const db = (await c.query(`select id, khoi, ten from tai_lieu where loai='de_thi'`)).rows.map((r) => ({ id: r.id, khoi: String(r.khoi), ten: r.ten, s: slug(r.ten) }))
const ungVien = (x) => { const t = truong(x.ten_bai), kk = ky(x.ten_bai), nam = (x.ten_bai.match(/20\d\d-20\d\d/) || [])[0]
  return t && t.length > 4 ? db.filter((d) => d.khoi === x.khoi.slice(1) && d.s.includes(t) && (!nam || d.s.includes(nam)) && (kk === '?' || ky(d.s) === kk || ky(d.s) === '?')) : [] }
const rnd = (a, k, seed) => { const r = []; let h = seed; for (let j = 0; j < k && a.length; j++) { h = (h * 1103515245 + 12345) % 2147483648; r.push(a[h % a.length]) } return r }
const doiChung = new Map(hd.map((x, j) => { const uv = new Set(ungVien(x).map((d) => d.id)); return [x.ten_bai, rnd(db.filter((d) => d.khoi === x.khoi.slice(1) && !uv.has(d.id)), 3, j + 7)] }))
const can = [...new Set(hd.flatMap((x) => [...ungVien(x), ...doiChung.get(x.ten_bai)].map((d) => d.id)))]
const cauDb = new Map()
for (const r of (await c.query(`select p.tai_lieu_id id, tc.ma_cau, coalesce(d.noi_dung, h.noi_dung, hh.noi_dung) nd
  from tai_lieu_phan p join tai_lieu_cau tc on tc.phan_id = p.id
  left join dai_cau_hoi d on d.ma_cau = tc.ma_cau left join hgt_cau_hoi h on h.ma_cau = tc.ma_cau left join hinh_hoc_cau_hoi hh on hh.ma_cau = tc.ma_cau
  where p.tai_lieu_id = any($1::uuid[])`, [can])).rows) { if (!cauDb.has(r.id)) cauDb.set(r.id, []); cauDb.get(r.id).push(r.nd || '') }
await c.end()
const lam = (nd) => cum(tu(nd.replace(/\$[^$]*\$/g, ' ').replace(/\\[a-zA-Z]+/g, ' ')))
const df = new Map(); for (const [, ds] of cauDb) { const u = new Set(ds.flatMap(lam)); for (const k of u) df.set(k, (df.get(k) || 0) + 1) }
const riengCum = (nd) => lam(nd).filter((k) => df.get(k) <= 2)
const cham = (d, set) => { const cau = (cauDb.get(d.id) || []).map(riengCum).filter((cs) => cs.length >= 2); const trung = cau.filter((cs) => cs.some((k) => set.has(k))).length
  return { id: d.id, ten: d.ten, cau_du_dai: cau.length, cau_trung: trung, ti_le: cau.length ? +(trung / cau.length).toFixed(2) : null } }

const out = []; let i = 0
for (const x of hd) {
  const files = x.files.map((f) => path.join(GOC, f))
  let chu = ''; for (const f of files) chu += '\n' + await chuFile(f)
  const w = tu(chu), set = new Set(cum(w))
  const soDeTrongFile = (chu.match(/(^|\n)\s*C[aâ]u\s*0?1\s*[\.:\)]/gi) || []).length
  const uv = ungVien(x).map((d) => cham(d, set)).sort((a, b) => (b.ti_le ?? -1) - (a.ti_le ?? -1))
  const best = uv[0]
  const nen = doiChung.get(x.ten_bai).map((d) => cham(d, set).ti_le ?? 0); const nen_max = Math.max(0, ...nen)
  // Luật chốt (12/11): nhân chứng 2 = nội dung, có mốc nhiễu = max khớp với 3 đề ngẫu nhiên cùng khối.
  // Bộ nhiều đề ⇒ 'mot_phan' (DB chỉ có một phần ⇒ làm lại, câu trùng tự lọc lúc ghi).
  const n = best?.cau_du_dai ?? 0, t = best?.ti_le ?? 0
  let kl
  if (w.length < 150) kl = 'khong_doc'
  else if (/^(bo-de|tuyen-tap)|(^|-)\d+-de-/.test(x.ten_bai) || w.length > 20000) kl = 'mot_phan'
  else if ((n >= 4 && t >= 0.6) || (n >= 4 && t >= 0.4 && t - nen_max >= 0.35) || (n >= 3 && t >= 0.67 && nen_max < 0.1)) kl = 'trung'
  else if (uv.every((u) => (u.ti_le ?? 0) < 0.2)) kl = 'khac'
  else kl = 'mo_ho'
  const daKhop = uv.filter((u) => u.ti_le >= 0.6).length
  out.push({ khoi: x.khoi, folder: x.folder, ten_bai: x.ten_bai, ket_luan: kl, so_tu_file: w.length, so_de_trong_file: soDeTrongFile, so_de_db_khop: daKhop, nen_max,
    thieu_de: kl === 'trung' && soDeTrongFile > daKhop + 1, ung_vien: uv })
  if (++i % 50 === 0) console.error(`… ${i}/${hd.length}`)
}
fs.writeFileSync(path.join(HERE, 'kiem-nghi-trung.json'), JSON.stringify(out, null, 1))
const g = {}
for (const x of out) { const k = `${x.khoi} ${x.folder.replace(/\/.*/, '')}`; g[k] ??= { bai: 0, trung: 0, mot_phan: 0, khac: 0, mo_ho: 0, khong_doc: 0 }; g[k].bai++; g[k][x.ket_luan]++ }
const T = {}; for (const k of Object.keys(g)) { for (const z in g[k]) T[z] = (T[z] || 0) + g[k][z]; console.log(k.padEnd(22), JSON.stringify(g[k])) }
console.log('TỔNG', JSON.stringify(T))
