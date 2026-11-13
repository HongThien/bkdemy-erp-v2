// do-trung-batch.mjs — BƯỚC 2 của một batch (KE-HOACH.md §2): CHỈ ĐỌC DB, KHÔNG gọi AI. Mỗi bài của batch so với MỌI đề thi
// (tai_lieu loai de_thi) cùng khối đang có trong kho — cùng luật nhân chứng như kiem-noctorium.mjs (cụm 6 chữ, câu khớp ≥50% cụm,
// best vs nhì) + tên trường. Bài scan (không có lớp chữ) ⇒ khong_doc, phải xem ảnh.
//   node --env-file=.env kho-rules/dai/lo/toanmath/do-trung-batch.mjs --batch B001
// Ra: batch/<ma>/do-trung.json
import os from 'node:os'; import pg from 'pg'; import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
const JSZip = createRequire(import.meta.url)('jszip')
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d }
const GOC = process.env.BK_GOC || 'E:/BK ACADEMY/Tài liệu tham khảo', MA = arg('--batch')
const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'))
const ROOT = path.resolve(HERE, '../../../..')
const B = JSON.parse(fs.readFileSync(path.join(HERE, 'batch.json'), 'utf8'))
const ds = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, '.nhap-tam/toanmath-word/danh-sach.json'), 'utf8')) } catch { return [] } })()
const docx = new Map(ds.filter((x) => x.docx).map((x) => [path.normalize(x.file), x.docx]))
const bai = B.find((b) => b.ma === MA).bai.map((x) => ({ ...x, batch: MA })), KHOI = bai[0].khoi.slice(1)

const tu = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase().match(/[a-z0-9]+/g) || []
const K = +arg('--k', 6), PH = +arg('--ph', 0.5)  // chốt 12/11: cụm 6 chữ, câu khớp khi ≥50% cụm có trong file (cụm 5 + 1 cụm là đủ ⇒ nhiễu quá cao)
const cum = (w, k = K) => { const r = []; for (let i = 0; i + k <= w.length; i++) r.push(w.slice(i, i + k).join(' ')); return r }
const lam = (nd) => cum(tu(nd.replace(/\$[^$]*\$/g, ' ').replace(/\\[a-zA-Z]+/g, ' ')))
const chuFile = async (p) => {
  try {
    if (/\.pdf$/i.test(p)) { // pdftotext bản msys không mở được đường dẫn có chữ có dấu ("Đề thi") ⇒ chép sang tên ASCII rồi đọc
      const tmp = path.join(os.tmpdir(), 'dt-' + process.pid + '.pdf'); fs.copyFileSync(p, tmp)
      try { return execFileSync('pdftotext', ['-q', '-enc', 'UTF-8', tmp, '-'], { maxBuffer: 1 << 28 }).toString('utf8') } finally { fs.rmSync(tmp, { force: true }) }
    }
    const q = /\.doc$/i.test(p) ? docx.get(path.normalize(p)) : p
    if (q && /\.docx$/i.test(q)) { const z = await JSZip.loadAsync(fs.readFileSync(q)); return ((await z.file('word/document.xml')?.async('string')) || '').replace(/<\/w:p>/g, '\n').replace(/<[^>]+>/g, '') }
  } catch { return '' }
  return ''
}

const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO || process.env.DATABASE_URL }); await c.connect()
await c.query('set default_transaction_read_only = on')
const de = new Map()
for (const r of (await c.query(`select t.id, t.ten, coalesce(d.noi_dung, h.noi_dung, hh.noi_dung) nd
  from tai_lieu t join tai_lieu_phan p on p.tai_lieu_id = t.id join tai_lieu_cau tc on tc.phan_id = p.id
  left join dai_cau_hoi d on d.ma_cau = tc.ma_cau left join hgt_cau_hoi h on h.ma_cau = tc.ma_cau left join hinh_hoc_cau_hoi hh on hh.ma_cau = tc.ma_cau
  where t.loai = 'de_thi' and t.khoi = $1`, [KHOI])).rows) {
  if (!de.has(r.id)) de.set(r.id, { id: r.id, ten: r.ten, cau: [] }); de.get(r.id).cau.push(r.nd || '') }
await c.end()
const df = new Map(); for (const d of de.values()) for (const k of new Set(d.cau.flatMap(lam))) df.set(k, (df.get(k) || 0) + 1)
for (const d of de.values()) d.cs = d.cau.map((nd) => lam(nd).filter((k) => df.get(k) <= 2)).filter((cs) => cs.length >= 2)

// nhân chứng 2 = TÊN: chữ riêng của tên đề Noctorium (bỏ chữ chung kiểu 'đề thi thử…') có trong slug bài toanmath
const STOP = new Set('de thi thu tot nghiep thpt mon toan nam lan truong so gd dt gddt khao sat kscl ktcl 12 hoc ki ky giua cuoi 1 2 2024 2025 2026 2027 co dap an va loi giai chi tiet chuyen cum cac lien kiem tra chat luong on tn tap dot'.split(' '))
const giongTen = (slug, ten) => { const A = new Set(slug.split('-')), b = tu(ten).filter((w) => !STOP.has(w)); return b.length ? b.filter((w) => A.has(w)).length / b.length : 0 }
const boDe = (t) => /^(bo-|tuyen-tap)|(^|-)d+-(de|cau)-/.test(t)
const out = []
for (const x of bai) {
  let chu = ''; for (const f of x.files) chu += '\n' + await chuFile(path.join(GOC, f))
  const w = tu(chu), set = new Set(cum(w))
  const sc = [...de.values()].map((d) => ({ ten: d.ten, n: d.cs.length, t: d.cs.length ? d.cs.filter((cs) => { const h = cs.filter((k) => set.has(k)).length; return PH ? h / cs.length >= PH : h > 0 }).length / d.cs.length : 0 })).sort((a, b) => b.t - a.t)
  const [b1, b2] = sc; const t = b1?.t ?? 0, nhi = b2?.t ?? 0
  const kl = w.length < 150 ? 'khong_doc' : (b1.n >= 4 && t >= 0.6) || (b1.n >= 4 && t >= 0.4 && t - nhi >= 0.35) ? 'trung' : t < 0.2 ? 'khac' : 'mo_ho'
  out.push({ batch: x.batch, folder: x.folder, ten_bai: x.ten_bai, ket_luan: kl, so_tu: w.length, best: b1 && { ten: b1.ten, ti_le: +t.toFixed(2), cau: b1.n }, nhi: +nhi.toFixed(2),
    so_de_khop: sc.filter((s) => s.t >= 0.6 && s.n >= 4).length })
  const o = out.at(-1), nm = b1 ? giongTen(x.ten_bai, b1.ten) : 0; o.giong_ten = +nm.toFixed(2)
  // BỎ khỏi batch chỉ khi ĐỦ 2 nhân chứng: nội dung (trung, hoặc ≥0.4 và vượt nhì ≥0.3) + tên trường khớp ≥0.8; bộ nhiều đề không bỏ
  o.trung_kho = !boDe(x.ten_bai) && nm >= 0.8 && (kl === 'trung' || (t >= 0.4 && t - nhi >= 0.3))
}
fs.mkdirSync(path.join(HERE, 'batch', MA), { recursive: true }); fs.writeFileSync(path.join(HERE, 'batch', MA, 'do-trung.json'), JSON.stringify(out, null, 1))
console.log('Đề thi khối', KHOI, 'trong kho:', de.size)
for (const x of out) console.log(x.ket_luan.padEnd(9), (x.trung_kho ? 'TRÙNG' : '').padEnd(5), String(x.best?.ti_le).padEnd(5), String(x.nhi).padEnd(5), String(x.giong_ten).padEnd(5), x.ten_bai.slice(0, 70), '|', (x.best?.ten || '').slice(0, 70))
