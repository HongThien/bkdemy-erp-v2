// nhap_lo.mjs — NHẬP lô Hình–Học 8T từ bản nháp các trạm (BRIEF.md §7) vào kho luyện, có BÀI NHIỀU Ý (mô hình bài–ý, Thùy 09/11).
//   node kho-rules/hinh/lo/k8T-thales/nhap_lo.mjs <TH> [--ghi] [--chi HH00127,HH00161] [--bo NDT-H3.9,TCHH-5.8]
//     <TH> = thư mục chứa drafts/draft_G*.md và hinh_G*/ (scratchpad của lô)
//   Mặc định CHẠY THỬ: đọc + chuẩn hoá + kiểm, chạy INSERT trong transaction rồi ROLLBACK, KHÔNG upload ảnh.
//   --ghi: upload ảnh (bucket kho-anh, hinh_hoc/<tháng>/…) rồi INSERT trong 1 transaction, COMMIT.
// Câu `don` ⇒ hinh_hoc_cau_hoi (anh_de = hình bài, anh_dap_an = hình _lg nếu có, không thì hình bài).
// Bài `nhieu_y` ⇒ hinh_hoc_bai_y (loi_dan, anh_de) + mỗi ý một câu (bai_y, nhan_y, cau_hoi_y, da_biet, loi_giai, anh_dap_an); trigger tự ghép đề.
// 8T tự duyệt (Thùy 10/10 "bài của 8T, m auto duyệt"): da_duyet=true, duyet_nguon='ai', nguon_giai='ai', giai_method='claude_code', nguon='le'.
// Khối DE_SAU bị bỏ qua (in danh sách). Kiểm: khuôn 2 phần, từ cấm theo bài (dạng sau thắng), trùng đề trong lô và với bài đích, file hình tồn tại.
import pg from 'pg'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, extname } from 'node:path'
import { randomUUID } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
process.loadEnvFile('.env')

const argv = process.argv.slice(2)
const TH = argv.find((a) => !a.startsWith('--') && !['--chi', '--bo', '--dir', '--html'].includes(argv[argv.indexOf(a) - 1]))
const GHI = argv.includes('--ghi')
const gt = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null }
const CHI = gt('--chi') ? new Set(gt('--chi').split(',')) : null
const BO = new Set((gt('--bo') || '').split(',').filter(Boolean))
const DIR = gt('--dir') || 'drafts'           // thư mục bản nháp trong <TH> (drafts_v2 = bản đã đổi sang sơ đồ tư duy)
const CHI_KIEM = argv.includes('--chi-kiem')  // chỉ đọc + kiểm bản nháp, KHÔNG mở DB (cho trạm tự kiểm)
const HTML = gt('--html')                     // dựng trang duyệt rồi thoát (không DB)
const TEN_BAI = { HH00127: 'Định lí Thalès', HH00161: 'Đường trung bình', HH00128: 'Tính chất đường phân giác', HH00162: 'Bổ đề hình thang', HH00131: 'Mê-nê-la-uýt, Xê-va' }
if (!TH || !existsSync(join(TH, DIR))) { console.error('Dùng: node nhap_lo.mjs <TH> [--dir drafts_v2] [--chi-kiem] [--ghi]'); process.exit(2) }

// Từ cấm theo bài: lời giải không được dùng kiến thức học SAU bài đó (bản đồ 14/11). Chỉ quét LỜI GIẢI (đề có thể nhắc phân giác… như dữ kiện).
const SAU_DONG_DANG = String.raw`đồng dạng|\\backsim|\\sim\b|hệ thức lượng|diện tích`
const CAM = {
  HH00127: new RegExp(`${SAU_DONG_DANG}|đường trung bình|tính chất đường phân giác|Mê-nê-la|Xê-va|bổ đề hình thang`, 'i'),
  HH00161: new RegExp(`${SAU_DONG_DANG}|tính chất đường phân giác|Mê-nê-la|Xê-va|bổ đề hình thang`, 'i'),
  HH00128: new RegExp(`${SAU_DONG_DANG}|Mê-nê-la|Xê-va|bổ đề hình thang`, 'i'),
  HH00162: new RegExp(`${SAU_DONG_DANG}|Mê-nê-la|Xê-va`, 'i'),
  HH00131: new RegExp(SAU_DONG_DANG, 'i'),
}
const DICH = new Set(Object.keys(CAM))

const dongDe = (s) => s.replace(/\r\n/g, '\n').replace(/[ \t]+\n/g, '\n').replace(/\n{2,}/g, '\n').trim()
const dongLG = (s) => dongDe(s).replace(/\n([b-z]\) )/g, '\n\n$1').replace(/\n(\*\*Phần 2\b)/g, '\n\n$1')
const chuanDe = (s) => s.replace(/\$|\\left|\\right|\s|[.,;:()]/g, '').toLowerCase()
// Đáp án trả lời ngắn về dạng phẳng như kho Hình K8 ("6", "4,8", "28/3", "MN=20; PQ=12"). Vế phải còn chữ in hoa (vd "$\dfrac{AB}{AC}=\dfrac{AD}{AE}$",
// "$DE\parallel BC$") = đáp án là một QUAN HỆ, không gõ ngắn được ⇒ câu đổi sang tự luận (soát 14/11).
const phang = (s) => s.replace(/\$/g, '').replace(/\\[dt]?frac\s*(\{[^{}]*\}|\w)\s*(\{[^{}]*\}|\w)/g, (_, a, b) => `${a.replace(/[{}]/g, '')}/${b.replace(/[{}]/g, '')}`).replace(/\{,\}/g, ',').replace(/\\cdot/g, '·').replace(/\s+/g, ' ').trim()
const doiDapAn = (y, ten) => {
  if (y.loai_cau === 'tu_luan') { y.dap_an = null; return } // tự luận: đáp số nằm trong lời giải, không lưu dap_an (như kho K8)
  if (y.loai_cau !== 'tra_loi_ngan' || !y.dap_an) return
  const phan = phang(y.dap_an).replace(/\s*\(.*\)\s*$/, '').split(/\s*(?:;| và |,\s(?=[A-Za-z]))\s*/).filter(Boolean)
  const ra = []
  for (const p of phan) {
    const m = p.match(/^(.*?)=([^=]*)$/)
    const ve = (m ? m[2] : p).replace(/\s*(cm|m|dm|mm|độ|°)$/i, '').trim()
    if (/[A-Z]|\\parallel|\\perp/.test(ve)) { y.loai_cau = 'tu_luan'; y.dap_an = null; doiLoai.push(`${ten}: đáp án là quan hệ "${phang(y.dap_an_goc)}" ⇒ tự luận`); return }
    ra.push(m && phan.length > 1 ? `${m[1].trim()}=${ve}` : ve)
  }
  y.dap_an = ra.join('; ')
}
const doiLoai = []

// ── SƠ ĐỒ TƯ DUY (Thùy 14/11, README §3 — bảng hinh_hoc_cau_so_do): câu Hình có ý CHỨNG MINH không viết Phần 1; khối "**Sơ đồ tư duy**"
//   (Mấu chốt + mỗi ô một dòng `- nK | - | mốc | từ | lý do`, thứ tự xuôi) lưu riêng; lời giải = Phần 2 chia khúc, mỗi khúc mở bằng `[[so-do:nK]]`.
//   Ở lô này mỗi câu (kể cả mỗi ý của bài nhiều ý) là một câu riêng ⇒ cột ý luôn "-". Luật kiểm chép từ docSoDo() của scripts/kho/de-thi/dung-de-tu-soan.mjs.
const LA_CHUNG_MINH = /chứng minh|chứng tỏ/i
function tachSoDo(ten, raw, loiKiem) {
  const L = (s) => loiKiem.push(`${ten} Sơ đồ tư duy: ${s}`)
  const iSd = raw.indexOf('**Sơ đồ tư duy**'), i2 = raw.indexOf('**Phần 2. Trình bày**')
  if (iSd < 0) return null
  if (raw.includes('**Phần 1. Hướng dẫn**')) L('đã có Sơ đồ tư duy thì bỏ Phần 1')
  if (i2 < iSd) { L('thiếu Phần 2 sau sơ đồ'); return null }
  const dong = raw.slice(iSd, i2).split('\n').map((s) => s.trim()).filter(Boolean)
  let mauChot = null; const nut = [], khoa = new Set()
  for (const d of dong.slice(1)) {
    let m
    if ((m = d.match(/^\*\*Mấu chốt:\*\*\s*(.+)$/))) { if (mauChot) L('hai dòng Mấu chốt'); mauChot = m[1].trim(); continue }
    if (d.startsWith('- ')) {
      const f = d.slice(2).split(' | ').map((s) => s.trim())
      if (f.length < 4 || f.length > 5) { L(`dòng ô phải 4–5 cột "k | ý | mốc | từ | lý do": «${d.slice(0, 60)}»`); continue }
      const [k, y, noi, tu, ly] = f
      if (!/^n\d+$/.test(k)) L(`khoá «${k}» phải dạng n1, n2…`)
      if (khoa.has(k)) L(`khoá ${k} lặp`)
      if (y !== '-') L(`${k}: cột ý phải là "-" (mỗi ý đã là một câu riêng)`)
      if (!noi) L(`${k}: mốc rỗng`)
      const tuDs = tu.split(',').map((s) => s.trim()).filter(Boolean)
      if (!tuDs.length) L(`${k}: cột "từ" rỗng`)
      for (const t of tuDs) if (t !== 'gt' && !khoa.has(t)) L(`${k}: "từ" trỏ «${t}» — chỉ được trỏ gt hoặc ô ĐỨNG TRƯỚC`)
      if (((noi + (ly || '')).match(/\$/g) || []).length % 2) L(`${k}: lệch dấu $`)
      khoa.add(k); nut.push({ k, y: '-', noi_dung: noi, tu: tuDs, ...(ly ? { ly_do: ly } : {}) })
      continue
    }
    L(`dòng lạc «${d.slice(0, 60)}»`)
  }
  if (!mauChot) L('thiếu "**Mấu chốt:**"')
  if (!nut.length || nut.length > 20) L(`số ô = ${nut.length}, phải 1–20`)
  const p2 = raw.slice(i2)
  const moc = []; let khuc = null
  for (const d0 of p2.split('\n').slice(1)) {
    const d = d0.trim(); if (!d) continue
    const m = d.match(/^\[\[so-do:(n\d+)\]\]$/)
    if (m) { moc.push(m[1]); khuc = m[1]; continue }
    if (/\[\[so-do/.test(d)) { L(`dòng móc sai khuôn «${d.slice(0, 40)}»`); continue }
    if (!khuc) L(`Phần 2: chữ nằm ngoài khúc (trước [[so-do:…]] đầu tiên): «${d.slice(0, 50)}»`)
  }
  if (nut.map((o) => o.k).join(',') !== moc.join(',')) L(`khúc Phần 2 phải móc đúng mọi ô, mỗi ô một lần, theo thứ tự — sơ đồ [${nut.map((o) => o.k)}] · Phần 2 [${moc}]`)
  return { mau_chot: mauChot, nut, loi_giai: dongLG(p2) }
}

// ── đọc bản nháp
const tep = readdirSync(join(TH, DIR)).filter((f) => /^draft_G\d+\.md$/.test(f)).sort((a, b) => +a.match(/\d+/)[0] - +b.match(/\d+/)[0])
const truong = (blk, k) => { // **k:** giá trị (một dòng hoặc nhiều dòng tới trường kế)
  const m = blk.match(new RegExp(`\\*\\*${k}:\\*\\*[ \\t]*([\\s\\S]*?)(?=\\n\\*\\*[a-z_]+:\\*\\*|\\n#### |$)`))
  return m ? m[1].trim() : ''
}
const bai = [], deSau = [], loi = []
for (const f of tep) {
  const txt = readFileSync(join(TH, DIR, f), 'utf8').replace(/\r\n/g, '\n')
  const khoi = txt.split(/\n(?=### )/).filter((k) => k.startsWith('### '))
  for (const k of khoi) {
    const dau = k.split('\n')[0]
    const m = dau.match(/^### (\S+)\s*→\s*(HH\d{5}|DE_SAU.*)$/)
    if (!m) { loi.push(`${f}: dòng đầu khối lạ: ${dau}`); continue }
    const [, nhan, dich] = m
    if (dich.startsWith('DE_SAU')) { deSau.push({ f, nhan, dich, ly_do: truong(k, 'ly_do') }); continue }
    const loai = truong(k, 'loai') || 'don'
    const b = { f, nhan, dich, loai, nguon: truong(k, 'nguon'), hinh: truong(k, 'hinh').split(/\s/)[0], nghi: truong(k, 'nghi_van'), y: [] }
    if (loai === 'nhieu_y') {
      const [than, ...ys] = k.split(/\n#### y /)
      b.loi_dan = dongDe(truong(than, 'loi_dan'))
      b.hinh = truong(than, 'hinh').split(/\s/)[0]
      for (const y of ys) {
        const nhanY = y.split('\n')[0].trim().replace(/\)$/, '')
        b.y.push({ nhan: nhanY, loai_cau: truong(y, 'loai_cau') || 'tu_luan', dap_an: truong(y, 'dap_an') || null,
          cau_hoi: dongDe(truong(y, 'cau_hoi')), da_biet: dongDe(truong(y, 'da_biet')) || null,
          loi_giai: dongLG(truong(y, 'loi_giai')), hinh_lg: truong(y, 'hinh_lg').split(/\s/)[0] || null })
      }
      const nv = ys.length ? truong(ys[ys.length - 1], 'nghi_van') : ''
      if (nv) b.nghi = [b.nghi, nv].filter(Boolean).join(' | ')
    } else {
      b.y.push({ nhan: null, loai_cau: truong(k, 'loai_cau') || 'tu_luan', dap_an: truong(k, 'dap_an') || null,
        noi_dung: dongDe(truong(k, 'noi_dung')), loi_giai: dongLG(truong(k, 'loi_giai')), hinh_lg: truong(k, 'hinh_lg').split(/\s/)[0] || null })
    }
    bai.push(b)
  }
}

// ── tìm file hình (trong mọi hinh_G*)
const thuMucHinh = readdirSync(TH).filter((d) => /^hinh_G\d+$/.test(d)).map((d) => join(TH, d))
const timHinh = (ten) => { if (!ten) return null; for (const d of thuMucHinh) if (existsSync(join(d, ten))) return join(d, ten); return null }

// ── kiểm
const chon = bai.filter((b) => !BO.has(b.nhan) && (!CHI || CHI.has(b.dich)))
const thayDe = new Map()
for (const b of chon) {
  if (!DICH.has(b.dich)) loi.push(`${b.nhan}: mã đích ${b.dich} không thuộc lô (chỉ ${[...DICH]})`)
  if (!b.hinh || !timHinh(b.hinh)) loi.push(`${b.nhan}: thiếu file hình đề "${b.hinh}"`)
  if (b.loai === 'nhieu_y' && (!b.loi_dan || b.y.length < 2)) loi.push(`${b.nhan}: bài nhiều ý thiếu lời dẫn hoặc < 2 ý`)
  for (const y of b.y) {
    const ten = b.nhan + (y.nhan ? ' ý ' + y.nhan : '')
    y.dap_an_goc = y.dap_an
    doiDapAn(y, ten)
    const de = y.noi_dung ?? y.cau_hoi
    if (!de) loi.push(`${ten}: đề trống`)
    y.so_do = tachSoDo(ten, y.loi_giai, loi)
    if (y.so_do) y.loi_giai = y.so_do.loi_giai
    else {
      if (!/\*\*Phần 1\. Hướng dẫn\*\*/.test(y.loi_giai) || !/\*\*Phần 2\. Trình bày\*\*/.test(y.loi_giai)) loi.push(`${ten}: lời giải thiếu khuôn 2 phần`)
      if (y.loai_cau === 'tu_luan' && LA_CHUNG_MINH.test(de)) loi.push(`${ten}: câu chứng minh phải có "**Sơ đồ tư duy**" (luật 14/11), không viết Phần 1`)
    }
    if (y.loai_cau === 'tra_loi_ngan' && !y.dap_an) loi.push(`${ten}: trả lời ngắn mà thiếu dap_an`)
    if (!['tu_luan', 'tra_loi_ngan'].includes(y.loai_cau)) loi.push(`${ten}: loai_cau lạ ${y.loai_cau}`)
    const cam = CAM[b.dich]?.exec(y.loi_giai)
    if (cam) loi.push(`${ten} → ${b.dich}: lời giải dùng "${cam[0]}" (kiến thức học SAU bài này)`)
    if (y.hinh_lg && !timHinh(y.hinh_lg)) loi.push(`${ten}: thiếu file hình lời giải "${y.hinh_lg}"`)
    if (/\b(bài|ví dụ) \d+[a-z]?\b(?! *[a-z]\))/i.test(y.loi_giai)) loi.push(`${ten}: lời giải có vẻ viện dẫn sách ("bài k" / "ví dụ k") — xem lại`)
    const khoa = chuanDe((b.loi_dan || '') + de)
    if (thayDe.has(khoa)) loi.push(`${ten}: TRÙNG đề với ${thayDe.get(khoa)}`); else thayDe.set(khoa, ten)
  }
}

console.log(`Bản nháp: ${tep.join(', ')}`)
const dem = {}; for (const b of chon) dem[b.dich] = (dem[b.dich] || 0) + b.y.length
console.log(`Bài ghi: ${chon.length} (${chon.reduce((a, b) => a + b.y.length, 0)} câu) — theo mã:`, dem, ` · bỏ theo --bo: ${[...BO].join(', ') || 0} · DE_SAU: ${deSau.length}`)
for (const d of deSau) console.log(`  DE_SAU ${d.nhan} ${d.dich}: ${d.ly_do}`)
for (const d of doiLoai) console.log('  ↺ ' + d)
console.log('Đáp án trả lời ngắn sau chuẩn hoá:', chon.flatMap((b) => b.y.filter((y) => y.loai_cau === 'tra_loi_ngan').map((y) => `${b.nhan}${y.nhan ? y.nhan : ''}=${y.dap_an}`)).join(' · '))
const nghi = chon.filter((b) => b.nghi && !/^(không|—|-)?$/i.test(b.nghi))
console.log(`Nghi vấn ghi trong nháp: ${nghi.length} bài`)
if (loi.length) { console.log(`\n❌ ${loi.length} lỗi kiểm:`); for (const l of loi) console.log('  - ' + l) }
console.log(`Sơ đồ tư duy: ${chon.reduce((a, b) => a + b.y.filter((y) => y.so_do).length, 0)} câu`)
if (HTML) { await dungTrang(HTML); }
if (CHI_KIEM || HTML) { console.log(loi.length ? `CHỈ KIỂM: ${loi.length} lỗi` : 'CHỈ KIỂM: không lỗi'); process.exit(loi.length ? 1 : 0) }

// ── TRANG DUYỆT (--html <tệp>): đề · hình mới · sơ đồ tư duy · lời giải (MathML dựng sẵn) · ảnh trang sách gốc. Không đọc DB.
async function dungTrang(ra) {
  const katex = (await import('katex')).default
  const { execFileSync } = await import('node:child_process')
  const { writeFileSync, mkdtempSync } = await import('node:fs')
  const { tmpdir } = await import('node:os')
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const toan = (s) => esc(s).replace(/\$([^$]+)\$/g, (_, t) => { try { return katex.renderToString(t.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'), { output: 'mathml', throwOnError: false }) } catch { return '$' + t + '$' } })
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  const khoi = (s, nut) => (s || '').split('\n').map((d) => {
    const m = d.trim().match(/^\[\[so-do:(n\d+)\]\]$/)
    if (m) { const o = nut?.find((x) => x.k === m[1]); return `<div class="khuc">${m[1]} · ${o ? toan(o.noi_dung) : ''}</div>` }
    return d.trim() ? `<div>${toan(d)}</div>` : '<div class="trong"></div>'
  }).join('')
  const anh = (ten) => { const p = timHinh(ten); return p ? `<img src="data:image/png;base64,${readFileSync(p).toString('base64')}">` : '' }
  const PDF = { NDT: 'E:/BK ACADEMY/Tài liệu tham khảo/8T/HSG/Chuyên đề bồi dưỡng HSG Toán 8-NĐT.pdf', TCHH: 'E:/BK ACADEMY/Tài liệu tham khảo/8T/HSG/Tuyển chọn cách đề bồi dưỡng HSG Toán 8 Hình học.pdf' }
  const tam = mkdtempSync(join(tmpdir(), 'h8t-'))
  const trang = new Map()
  const anhTrang = (sach, p) => {
    const k = `${sach}-${p}`; if (trang.has(k)) return trang.get(k)
    const o = join(tam, k)
    execFileSync('pdftoppm', ['-r', '75', '-gray', '-f', String(p), '-l', String(p), '-jpeg', '-jpegopt', 'quality=55', '-singlefile', PDF[sach], o])
    const v = `data:image/jpeg;base64,${readFileSync(o + '.jpg').toString('base64')}`; trang.set(k, v); return v
  }
  const the = []
  for (const b of [...chon, ...deSau.map((d) => ({ ...d, deSau: true }))]) {
    const sach = b.nhan.startsWith('TCHH') ? 'TCHH' : 'NDT'
    const ps = [...new Set(((b.nguon || '').match(/@p(\d+)(?:[–-](\d+))?/) || []).slice(1).filter(Boolean).map(Number))]
    const trangHtml = ps.map((p) => `<details><summary>Trang sách PDF ${p}</summary><img src="${anhTrang(sach, p)}"></details>`).join('')
    if (b.deSau) { the.push(`<section class="the sau"><h3>${esc(b.nhan)} <span class="nhan">${esc(b.dich)}</span></h3><p>${toan(b.ly_do || '')}</p></section>`); continue }
    const yHtml = b.y.map((y) => `<div class="y">${y.nhan ? `<h4>Ý ${y.nhan}) ${y.loai_cau === 'tra_loi_ngan' ? `<span class="nhan">đáp án ${esc(y.dap_an || '')}</span>` : ''}</h4>` : (y.loai_cau === 'tra_loi_ngan' ? `<p class="nhan">đáp án ${esc(y.dap_an || '')}</p>` : '')}
      <div class="de">${khoi((y.da_biet ? y.da_biet + '\n' : '') + (y.noi_dung ?? y.cau_hoi))}</div>
      ${y.so_do ? `<div class="sodo"><b>Sơ đồ tư duy</b><div>${toan('**Mấu chốt:** ' + (y.so_do.mau_chot || ''))}</div><ol>${y.so_do.nut.map((o) => `<li><b>${o.k}</b> ${toan(o.noi_dung)} <span class="tu">← ${o.tu.join(', ')}${o.ly_do ? ' · ' + toan(o.ly_do) : ''}</span></li>`).join('')}</ol></div>` : ''}
      <div class="lg">${khoi(y.loi_giai, y.so_do?.nut)}</div>${y.hinh_lg ? `<div class="hinh">${anh(y.hinh_lg)}</div>` : ''}</div>`).join('')
    the.push(`<section class="the"><h3>${esc(b.nhan)} <span class="nhan">→ ${b.dich} · ${TEN_BAI[b.dich] || ''}</span></h3><p class="nguon">${esc(b.nguon || '')}</p>
      ${b.loi_dan ? `<div class="de">${khoi(b.loi_dan)}</div>` : ''}<div class="hinh">${anh(b.hinh)}</div>${yHtml}
      ${b.nghi ? `<p class="nghi"><b>Ghi chú soát / nghi vấn:</b> ${toan(b.nghi)}</p>` : ''}${trangHtml}</section>`)
  }
  const dem = Object.entries(chon.reduce((a, b) => (a[b.dich] = (a[b.dich] || 0) + b.y.length, a), {})).map(([k, v]) => `${TEN_BAI[k] || k}: ${v} câu`).join(' · ')
  writeFileSync(ra, `<title>Hình 8T Thalès lô 1</title>
<meta name="description" content="Trang duyệt lô Hình–Học 8T chuyên đề Thalès (NĐT + TCHH): đề, hình vẽ lại, sơ đồ tư duy, lời giải, trang sách gốc.">
<style>
:root{--bg:#f5f3ee;--card:#fff;--fg:#1d2330;--muted:#5e6676;--line:#e2ddd0;--accent:#2f5d8c;--band:#e8f0fa;--warn:#a3561b;--warn-bg:#fbeee2}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#15181e;--card:#1d222b;--fg:#e8eaee;--muted:#9aa3b2;--line:#2e3542;--accent:#8ab4e8;--band:#1f2f45;--warn:#f0a56a;--warn-bg:#3a2815;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#15181e;--card:#1d222b;--fg:#e8eaee;--muted:#9aa3b2;--line:#2e3542;--accent:#8ab4e8;--band:#1f2f45;--warn:#f0a56a;--warn-bg:#3a2815;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font:15px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif;margin:0;padding-inline:16px;padding-block:20px 48px}
main{max-width:900px;margin:0 auto}h1{font-size:24px;margin:0 0 6px}.sub{color:var(--muted)}
.the{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 18px;margin:16px 0}.the.sau{opacity:.85}
.the h3{margin:0 0 4px;font-size:17px}.nhan{font-size:13px;color:var(--accent);font-weight:600}.nguon{color:var(--muted);font-size:13px;margin:0 0 8px}
.de{border-left:3px solid var(--accent);padding-left:10px;margin:8px 0}.y{border-top:1px dashed var(--line);margin-top:10px;padding-top:6px}.y h4{margin:4px 0}
.hinh img{max-width:100%;height:auto;max-height:380px;display:block;margin:8px 0;background:#fff;border-radius:6px}
.lg{font-size:14.5px;line-height:1.75}.lg .trong{height:6px}.khuc{background:var(--band);border-radius:6px;padding:2px 8px;margin:8px 0 2px;font-size:13px;font-weight:600}
.sodo{background:var(--band);border-radius:8px;padding:8px 12px;margin:8px 0;font-size:14px}.sodo ol{margin:4px 0;padding-left:20px}.tu{color:var(--muted);font-size:12.5px}
.nghi{background:var(--warn-bg);color:var(--fg);border-radius:8px;padding:8px 12px;font-size:13.5px}.nghi b{color:var(--warn)}
details{margin-top:8px}summary{cursor:pointer;color:var(--accent);font-size:13px}details img{max-width:100%;border:1px solid var(--line)}
math{font-size:1.05em}
</style><main><h1>Hình 8T — chuyên đề Thalès, lô 1</h1>
<p class="sub">NĐT Hình I §3 (đường trung bình) + Hình III §1–2 (Thalès) · TCHH chuyên đề 5. ${dem}. Đã tự duyệt theo luật 8T; hình vẽ lại 100% bằng code. Mỗi thẻ: đề → hình → sơ đồ tư duy (câu chứng minh) → lời giải; bấm "Trang sách" để đối chiếu.</p>
${the.join('\n')}</main>`)
  console.log(`Trang duyệt: ${ra} (${the.length} thẻ, ${trang.size} trang sách)`)
}

const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL })
await c.connect()
try {
  // trùng với câu đã có trong các bài đích
  const coSan = await c.query(`select ma_cau, dang_chinh, noi_dung from hinh_hoc_cau_hoi where dang_chinh = any($1) and xoa_at is null`, [[...DICH]])
  for (const r of coSan.rows) { const k = chuanDe(r.noi_dung); if (thayDe.has(k)) loi.push(`${thayDe.get(k)}: TRÙNG đề với câu đã có ${r.ma_cau} (${r.dang_chinh})`) }
  if (loi.length && GHI) throw new Error(`${loi.length} lỗi kiểm — không ghi`)

  // upload (chỉ khi --ghi)
  const envL = Object.fromEntries(readFileSync('.env.local', 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '')] }))
  const sb = GHI ? createClient(envL.VITE_SUPABASE_URL, envL.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false, autoRefreshToken: false } }) : null
  const thang = new Date().toISOString().slice(0, 7)
  const daUp = new Map()
  const up = async (ten) => {
    if (!ten) return null
    if (daUp.has(ten)) return daUp.get(ten)
    if (!GHI) { daUp.set(ten, `(thử)${ten}`); return daUp.get(ten) }
    const p = `hinh_hoc/${thang}/8T-${randomUUID()}${extname(ten).toLowerCase()}`
    const { error } = await sb.storage.from('kho-anh').upload(p, readFileSync(timHinh(ten)), { contentType: 'image/png', upsert: false })
    if (error) throw new Error(`upload ${ten}: ${error.message}`)
    const url = sb.storage.from('kho-anh').getPublicUrl(p).data.publicUrl
    daUp.set(ten, url); return url
  }

  await c.query('begin')
  const ttCau = {}, ttY = {}
  for (const d of DICH) {
    ttCau[d] = (await c.query(`select coalesce(max(thu_tu),0)::int m from hinh_hoc_cau_hoi where dang_chinh=$1 and xoa_at is null`, [d])).rows[0].m
    ttY[d] = (await c.query(`select coalesce(max(thu_tu),0)::int m from hinh_hoc_bai_y where dang_chinh=$1 and xoa_at is null`, [d])).rows[0].m
  }
  const bang = []
  for (const b of chon) {
    const anhBai = await up(b.hinh)
    if (b.loai === 'nhieu_y') {
      const by = (await c.query(`insert into hinh_hoc_bai_y (dang_chinh, loi_dan, anh_de, thu_tu) values ($1,$2,$3,$4) returning ma_bai_y`,
        [b.dich, b.loi_dan, anhBai, ++ttY[b.dich]])).rows[0].ma_bai_y
      for (const y of b.y) {
        const r = await c.query(`insert into hinh_hoc_cau_hoi (dang_chinh, noi_dung, bai_y, nhan_y, cau_hoi_y, da_biet, loi_giai, dap_an, anh_dap_an, thu_tu, loai_cau,
            nguon, nguon_giai, giai_method, da_duyet, duyet_nguon, duyet_at)
          values ($1,'',$2,$3,$4,$5,$6,$7,$8,$9,$10,'le','ai','claude_code',true,'ai',now()) returning ma_cau, noi_dung, anh_de`,
          [b.dich, by, y.nhan, y.cau_hoi, y.da_biet, y.loi_giai, y.dap_an, (await up(y.hinh_lg)) ?? anhBai, ++ttCau[b.dich], y.loai_cau])
        if (y.so_do) await c.query(`insert into hinh_hoc_cau_so_do (ma_cau, mau_chot, nut, nguon) values ($1,$2,$3::jsonb,'claude')`, [r.rows[0].ma_cau, y.so_do.mau_chot, JSON.stringify(y.so_do.nut)])
        bang.push({ so_do: y.so_do ? y.so_do.nut.length : 0, nhan: `${b.nhan} ${y.nhan})`, dich: b.dich, bai_y: by, ma_cau: r.rows[0].ma_cau, de: r.rows[0].noi_dung.length, anh: !!r.rows[0].anh_de })
      }
    } else {
      const y = b.y[0]
      const r = await c.query(`insert into hinh_hoc_cau_hoi (dang_chinh, noi_dung, loi_giai, dap_an, anh_de, anh_dap_an, thu_tu, loai_cau,
          nguon, nguon_giai, giai_method, da_duyet, duyet_nguon, duyet_at)
        values ($1,$2,$3,$4,$5,$6,$7,$8,'le','ai','claude_code',true,'ai',now()) returning ma_cau`,
        [b.dich, y.noi_dung, y.loi_giai, y.dap_an, anhBai, (await up(y.hinh_lg)) ?? anhBai, ++ttCau[b.dich], y.loai_cau])
      if (y.so_do) await c.query(`insert into hinh_hoc_cau_so_do (ma_cau, mau_chot, nut, nguon) values ($1,$2,$3::jsonb,'claude')`, [r.rows[0].ma_cau, y.so_do.mau_chot, JSON.stringify(y.so_do.nut)])
      bang.push({ so_do: y.so_do ? y.so_do.nut.length : 0, nhan: b.nhan, dich: b.dich, bai_y: '', ma_cau: r.rows[0].ma_cau, de: y.noi_dung.length, anh: !!anhBai })
    }
  }
  console.table(bang)
  const sau = await c.query(`select dang_chinh, count(*)::int cau, count(*) filter (where da_duyet)::int duyet, count(*) filter (where anh_de is null)::int thieu_anh
      from hinh_hoc_cau_hoi where dang_chinh = any($1) and xoa_at is null group by 1 order by 1`, [[...DICH]])
  console.table(sau.rows)
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? `✔ ĐÃ GHI ${bang.length} câu, upload ${daUp.size} ảnh` : `↩ ROLLBACK (chạy thử) — ${loi.length ? loi.length + ' lỗi kiểm ở trên, sửa trước khi --ghi' : 'không lỗi kiểm'}`)
} catch (e) { await c.query('rollback').catch(() => {}); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
