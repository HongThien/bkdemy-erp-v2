// ============================================================================
// bai-thi.mjs — BÀI THI của bộ đọc Word MathType (spec-luong-kho.md §9.6: dựng bài thi trước, sửa sau).
//
//   node scripts/kho/mathtype-thu/bai-thi.mjs [<thư mục bài thi>]
//
// Thư mục bài thi chứa các cặp <MA>.docx + <MA>.pdf (bản PDF cùng tên tác giả để lại cạnh file Word —
// nhân chứng ĐỘC LẬP, không do bộ đọc sinh ra) + nguon.txt (MA|đường dẫn gốc). Mặc định:
// <KHO_LAM_VIEC>/bai-thi-mathtype (dựng 28/09: 3 Từ Tâm · 3 NBV · 3 PNL · 1 đề NBV, đều K12).
//
// Chấm 3 thứ, mỗi thứ 1 con số, không có "nhìn chung ổn":
//   1. SỐ CÂU  — số nhãn "Câu N" bộ đọc dựng lại  so với  số nhãn "Câu N" trong chữ của PDF (pdftotext).
//                PDF không có lớp chữ (scan) ⇒ ghi "PDF không chữ", không chấm.
//   2. LIÊN TỤC — trong mỗi danh sách đánh số (numId), số phải chạy 1,2,3… không nhảy, không lặp.
//   3. ĐÁP ÁN  — mỗi câu trắc nghiệm A/B/C/D có ĐÚNG MỘT phương án gạch chân; nếu lời giải có "Chọn X"
//                thì X phải trùng chữ gạch chân (nhân chứng thứ hai nằm ngay trong file).
// Thoát 0 khi mọi file đạt cả 3; khác 0 khi có file trượt — để nối vào vòng sửa (sửa xong phải thi lại).
// ============================================================================
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, basename } from 'node:path'
import { spawnSync } from 'node:child_process'
import { convertDocx } from './doc.mjs'
import { thuMucLamViec } from '../cau-hinh.mjs'

const thuMuc = process.argv[2] ?? join(thuMucLamViec().duong_dan, 'bai-thi-mathtype')
if (!existsSync(thuMuc)) { console.error('❌ Không có thư mục bài thi: ' + thuMuc); process.exit(2) }
const maFiles = readdirSync(thuMuc).filter((f) => /\.docx$/i.test(f)).map((f) => f.replace(/\.docx$/i, '')).sort()

const RE_CAU = /(?:^|[^A-Za-zÀ-ỹ])Câu\s*(\d+)\s*[.:]/g
// Bỏ mọi thẻ định dạng [[…]] của bộ đọc; giữ lại [[u]]…[[/u]] khi cần soi gạch chân
const boThe = (s) => s.replace(/\[\[[^\]]*\]\]/g, '')
const boTheTruU = (s) => s.replace(/\[\[(?!u\]\]|\/u\]\])[^\]]*\]\]/g, '')

function chuPdf(pdf) {
  const r = spawnSync('pdftotext', ['-layout', pdf, '-'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  if (r.status !== 0) return null
  return r.stdout
}
function soTrangPdf(pdf) {
  const r = spawnSync('pdfinfo', [pdf], { encoding: 'utf8' })
  return r.status === 0 ? +(/Pages:\s+(\d+)/.exec(r.stdout)?.[1] ?? 0) : 0
}
// Chữ gạch chân trong một khối câu → các chữ cái phương án được gạch (A/B/C/D), không trùng.
// Bắt cả hai kiểu tác giả hay dùng: gạch riêng chữ cái "A" / "A." và gạch cả phương án "A. $x=2$."
function chuGach(khoi) {
  const s = boTheTruU(khoi)
  const ra = new Set()
  for (const m of s.matchAll(/\[\[u\]\]([\s\S]*?)\[\[\/u\]\]/g)) {
    const t = m[1].trim()
    const c = /^([ABCD])(?:\s*\.|$)/.exec(t)
    if (c) ra.add(c[1])
  }
  return [...ra]
}

const ket = []
for (const ma of maFiles) {
  const docx = join(thuMuc, ma + '.docx'), pdf = join(thuMuc, ma + '.pdf')
  const { paragraphs, nhan, stats } = await convertDocx(docx)

  // 1. SỐ CÂU
  const nhanCau = nhan.map((n, i) => (n && /Câu\s*\d+/i.test(n.text) ? { i, ...n } : null)).filter(Boolean)
  // nhãn gõ tay (không numPr) cũng tính — DE1 của NBV gõ "Câu 1." bằng tay (có thể nằm trong [[b]])
  const goTay = paragraphs.map((p, i) => (!nhan[i] && /^\s*Câu\s*\d+\s*[.:]/i.test(boThe(p)) ? i : -1)).filter((i) => i >= 0)
  const soCauDoc = nhanCau.length + goTay.length
  const txtPdf = existsSync(pdf) ? chuPdf(pdf) : null
  const trangPdf = existsSync(pdf) ? soTrangPdf(pdf) : 0
  // Nhân chứng PDF chỉ dùng được khi có lớp chữ (≥300 ký tự/trang) và không phải bản xem thử cụt (≤2 trang)
  const pdfDung = txtPdf && trangPdf > 2 && txtPdf.replace(/\s/g, '').length / trangPdf >= 300
  const soCauPdf = pdfDung ? [...txtPdf.matchAll(RE_CAU)].length : null
  const lyDoPdf = !txtPdf ? 'không PDF' : trangPdf <= 2 ? `PDF ${trangPdf} tr.` : 'PDF không chữ'

  // 2. LIÊN TỤC theo numId
  const theoNum = {}
  for (const n of nhanCau) (theoNum[n.numId] ??= []).push(n.so)
  const lienTuc = Object.values(theoNum).every((arr) => arr.every((v, k) => v === k + 1))

  // 3. ĐÁP ÁN — cắt khối câu: từ nhãn "Câu" tới nhãn "Câu" kế
  const moc = [...nhanCau.map((n) => n.i), ...goTay].sort((a, b) => a - b)
  // Dấu hiệu đáp án của 1 khối câu TN: đúng 1 chữ gạch chân, và/hoặc lời giải ghi "Chọn X".
  //   rõ      = 1 gạch chân (không Chọn, hoặc Chọn trùng) · hoặc 0 gạch chân + có Chọn
  //   mâu thuẫn = gạch chân ≠ Chọn, hoặc gạch ≥2 chữ — LỖI NẰM TRONG FILE GỐC (đã soi 4 ca 28/09: lời giải tính ra
  //             đúng chữ GẠCH CHÂN, chữ "Chọn X" của tác giả sai) ⇒ liệt kê để dây chuyền nêu cờ 🔴, không tính lỗi bộ đọc
  //   trống   = không có gì. Trống được CHẤP NHẬN khi một khối TN khác CÙNG SỐ CÂU trong file đã rõ
  //             (kiểu đề thi: phần ĐỀ không đáp án, phần LỜI GIẢI lặp lại từng câu có đáp án — DE1).
  //   File không có bất kỳ dấu hiệu nào (bản HS, vd TT1 "-HS") ⇒ tiêu chí này KHÔNG ÁP DỤNG, ghi rõ.
  const khoiTN = []
  for (let k = 0; k < moc.length; k++) {
    const i = moc[k]
    const khoi = paragraphs.slice(i, moc[k + 1] ?? paragraphs.length).join('\n')
    const sach = boThe(khoi)
    if (!['A', 'B', 'C', 'D'].every((c) => new RegExp('(?:^|\\s)' + c + '\\s*\\.').test(sach))) continue
    const so = nhan[i]?.so ?? +(/Câu\s*(\d+)/i.exec(boThe(paragraphs[i]))?.[1] ?? 0)
    const gach = chuGach(khoi)
    const chon = /Chọn\s+([ABCD])\b/.exec(sach)?.[1] ?? null
    const loai = gach.length === 1 && (!chon || chon === gach[0]) ? 'ro' : gach.length === 0 && chon ? 'ro' : gach.length === 0 && !chon ? 'trong' : 'mau_thuan'
    khoiTN.push({ so, gach, chon, loai })
  }
  const tn = khoiTN.length
  const soRo = new Set(khoiTN.filter((b) => b.loai === 'ro').map((b) => b.so))
  const mauThuan = khoiTN.filter((b) => b.loai === 'mau_thuan')
  const trongThat = khoiTN.filter((b) => b.loai === 'trong' && !soRo.has(b.so))
  const coDapAn = khoiTN.filter((b) => b.loai === 'ro' || (b.loai === 'trong' && soRo.has(b.so))).length
  const gach1 = khoiTN.filter((b) => b.gach.length === 1).length, coChon = khoiTN.filter((b) => b.chon).length
  const khongDapAn = tn > 0 && gach1 === 0 && coChon === 0

  const dat = (soCauPdf === null || soCauDoc === soCauPdf) && lienTuc && (khongDapAn || trongThat.length === 0)
  ket.push({ ma, soCauDoc, soCauPdf, lyDoPdf, lienTuc, tn, coDapAn, gach1, coChon, khongDapAn, mauThuan, trongThat: trongThat.slice(0, 3),
    matNhan: stats.autoNumberedUnresolved, chuTrang: stats.runsWhiteText, dat })
}

console.log('Bài thi bộ đọc Word MathType — ' + thuMuc)
console.log('MA    | câu đọc | câu PDF     | liên tục | TN | có đáp án | gạch chân | Chọn X | mâu thuẫn nguồn | [[#]] còn | chữ trắng | ĐẠT')
for (const r of ket) {
  console.log([r.ma.padEnd(5), String(r.soCauDoc).padStart(7), (r.soCauPdf === null ? r.lyDoPdf : String(r.soCauPdf)).padStart(11),
    (r.lienTuc ? '✔' : '✘').padStart(8), String(r.tn).padStart(2), (r.khongDapAn ? 'file không ĐA' : `${r.coDapAn}/${r.tn}`).padStart(13),
    String(r.gach1).padStart(9), String(r.coChon).padStart(6), String(r.mauThuan.length).padStart(15),
    String(r.matNhan).padStart(9), String(r.chuTrang).padStart(9), r.dat ? '✔' : '✘'].join(' | '))
  if (r.mauThuan.length) console.log('      mâu thuẫn trong file gốc (gạch chân ≠ "Chọn X"):', JSON.stringify(r.mauThuan.map((b) => ({ cau: b.so, gach: b.gach, chon: b.chon }))))
  if (r.trongThat.length) console.log('      câu TN KHÔNG có đáp án:', JSON.stringify(r.trongThat.map((b) => b.so)))
}
const truot = ket.filter((r) => !r.dat)
console.log(`\n${ket.length - truot.length}/${ket.length} file đạt.` + (truot.length ? ' Trượt: ' + truot.map((r) => r.ma).join(', ') : ''))
process.exit(truot.length ? 1 : 0)
