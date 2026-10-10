// ============================================================================
// NSHM-GKI-2026.build.mjs — gõ lại ĐỀ CƯƠNG ôn tập giữa kì I Toán 6 (2026–2027) — Trường TH, THCS & THPT Ngôi Sao Hoàng Mai,
// "Toán cô Hương – CLB Toán học Pi" (3 trang ảnh Thùy gửi 10/10) → de.json cho `scripts/kho/de-thi/ghi.mjs`.
//
//   node kho-rules/dai/lo/k6/de-cuong/NSHM-GKI-2026.build.mjs <thư mục làm việc> <thư mục chứa 1.webp 2.webp 3.webp>
//   node scripts/kho/de-thi/ghi.mjs <thư mục làm việc>            # chạy thử (ROLLBACK)
//   node scripts/kho/de-thi/ghi.mjs <thư mục làm việc> --ghi
//
// Luật: kho-rules/dai/k6.md (dấu nhân = dấu chấm như SGK; chia hết = \vdots; ƯCLN…); tách ý theo bài TÍNH / TÌM x / viết tập hợp (độc lập),
// bài lời văn + bài chứng minh giữ nguyên cả bài. Đề cương KHÔNG có đáp án / lời giải (chỉ gõ lại) ⇒ loai_cau = tu_luan, dap_an = null.
// `kieu: 'de_cuong'` ⇒ lọt vào tab "Đề cương" của Kho đề thi (mig …_de_thi_tab_de_cuong), không lẫn vào Chờ duyệt / Sẵn sàng / Đã giao.
// Nhãn câu giữ ĐÚNG nhãn in trên đề cương (Bài 9: j) q) k)).
// ============================================================================
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'

const [LV, ANH] = process.argv.slice(2)
if (!LV || !ANH) { console.error('Dùng: node …/NSHM-GKI-2026.build.mjs <thư mục làm việc> <thư mục chứa 1.webp 2.webp 3.webp>'); process.exit(2) }
const require = createRequire(new URL('../../../../../package.json', import.meta.url))
const katex = require('katex')
const R = String.raw
const bt = (e) => `$${e}$.`   // biểu thức + dấu chấm kết câu NGOÀI công thức (k6.md §3)

// ── NỘI DUNG ────────────────────────────────────────────────────────────────
// [ý, nội dung] hoặc [ý, nội dung, [ghi chú lúc nhập…]]. nội dung = chuỗi ĐÃ ghép (lead + ý) do hàm `y` bên dưới.
const PHAN = [
  { thu_tu: 1, ten: 'I. Tập hợp, chia hết' },
  { thu_tu: 2, ten: 'II. Thực hiện phép tính' },
  { thu_tu: 3, ten: 'III. Tìm x' },
  { thu_tu: 4, ten: 'IV. Toán thực tế' },
  { thu_tu: 5, ten: 'V. Chủ đề chuyên' },
]
const DK_CHIA_HET = 'Đề cương in dấu ":" cho phép chia hết — đã nhập thành $\\vdots$.'

/** tách ý: mỗi ý một câu, câu = lead + ý */
const tach = (phan, bai, lead, ys) => ys.map(([y, nd, cb]) => ({ phan, nhan: `Bài ${bai}${y}`, noi_dung: `${lead} ${nd}`, canh_bao: cb ?? [] }))
/** giữ nguyên cả bài (lời văn / chứng minh) */
const ca = (phan, bai, nd, cb) => [{ phan, nhan: `Bài ${bai}`, noi_dung: nd, canh_bao: cb ?? [] }]

const CAU = [
  // ── I. TẬP HỢP, CHIA HẾT ──
  ...tach(1, 1, 'Viết lại tập hợp sau theo hai cách:', [
    ['a', R`Tập hợp $A$ bao gồm các số tự nhiên lớn hơn 5 và không vượt quá 9.`],
    ['b', R`Tập hợp $B$ gồm các số tự nhiên lớn hơn 6, nhỏ hơn 40 và chia hết cho 4.`]]),
  ...tach(1, 2, 'Viết lại tập hợp sau bằng cách liệt kê:', [
    ['a', bt(R`A=\{x\mid x\ \text{là số tự nhiên lẻ},\ 150\le x<160\}`)],
    ['b', bt(R`B=\{x\in\mathbb{N}^*\mid 1\le x<11\}`)],
    ['c', bt(R`C=\{x\in\mathbb{N}\mid 2x+1\le 5\}`)],
    ['d', bt(R`D=\{x\in\mathbb{N}\mid 12\vdots x,\ 20\vdots x,\ x\le 4\}`), [DK_CHIA_HET]]]),
  ...tach(1, 3, R`Tìm chữ số $x$; $y$ biết:`, [
    ['a', R`$\overline{3x4y}$ chia hết cho 9; 5.`],
    ['b', R`$\overline{1x8y}$ chia hết cho 2; 3.`],
    ['c', R`$\overline{2x4y}$ chia hết cho 2; 3; 5; 9.`],
    ['d', R`$\overline{178x}$ chia hết cho 2 nhưng chia cho 5 dư 4.`]]),
  ...tach(1, 4, R`Tìm các số tự nhiên $a$ sao cho:`, [
    ['a', R`$a\in\text{Ư}(30)$ và $a\ \square\ 10$.`,
      [R`CHƯA CHẮC — Ảnh đề cương để TRỐNG ô ký hiệu giữa $a$ và $10$ (đọc "a ∈ Ư(30) và a …… 10"); đã giữ ô trống $\square$, cần đối chiếu bản gốc rồi điền (>, ≥, <, ≤…).`]],
    ['b', bt(R`20\vdots(a-1)`), [DK_CHIA_HET]],
    ['c', R`$70\vdots a$, $84\vdots a$ và $a>8$.`, [DK_CHIA_HET]],
    ['d', R`$120\vdots a$, $84\vdots a$, $72\vdots a$ và $a$ là số lớn nhất.`, [DK_CHIA_HET]]]),

  // ── II. THỰC HIỆN PHÉP TÍNH ──
  ...tach(2, 5, 'Thực hiện phép tính:', [
    ['a', bt(R`13+21.5-198:11`)],
    ['b', bt(R`3^3-2^8:2^5+6.5^2`)],
    ['c', bt(R`\{132-[116-(16-8)]:2\}.5`)],
    ['d', bt(R`17^0+[5^{13}:5^{11}+(135-130)^3]`)],
    ['e', bt(R`3.[50-(87-2.41)^2]+1^{2026}`)],
    ['f', bt(R`\{(2^2+1).10-(10:2-1):2\}+20-(5^2:5)^2`)]]),
  ...tach(2, 6, 'Tính hợp lí:', [
    ['a', bt(R`123+216+452+277+184`)],
    ['b', bt(R`1258+3345+1002+4742+2655`)],
    ['c', bt(R`27569-4568-27564+4573+357`)],
    ['d', bt(R`28.76+24.28`)],
    ['e', bt(R`129.172-73.129+129`)],
    ['f', bt(R`37.39+62.21-11.39-21.3`)],
    ['g', bt(R`31.175-31.50+69.125`)],
    ['h', bt(R`18.34+9.2.27+54.13`)],
    ['i', bt(R`7^2+49.29-30.48`)],
    ['k', bt(R`6^2.27-6^2.12+6^3`)]]),
  ...tach(2, 7, 'Tính tổng:', [
    ['a', bt(R`A=1.2+2.3+3.4+\dots+99.100`)],
    ['b', bt(R`B=2.4+4.6+6.8+\dots+100.102`)],
    ['c', bt(R`C=1.2.3+2.3.4+\dots+98.99.100`)],
    ['d', bt(R`D=1^2+2^2+3^2+\dots+100^2`)],
    ['e', bt(R`E=2^2+4^2+6^2+\dots+100^2`)],
    ['f', bt(R`F=1^2+4^2+7^2+\dots+2023^2+2026^2`)],
    ['g', bt(R`G=1.2^2+2.3^2+3.4^2+\dots+99.100^2`)],
    ['h', bt(R`H=1^3+2^3+3^3+\dots+2025^3+2026^3`)],
    ['k', bt(R`I=1^2+3^2+5^2+\dots+2023^2+2025^2`),
      [R`Đề cương in $2023^3$ (số mũ 3) ở số hạng áp chót — lỗi in; đã sửa thành $2023^2$ theo quy luật dãy bình phương các số lẻ. Chữ gốc: $I=1^2+3^2+5^2+\dots+2023^3+2025^2$.`]]]),
  ...tach(2, 8, 'Rút gọn:', [
    ['a', bt(R`\dfrac{2^{10}.13+2^{10}.65}{2^8.39}`)],
    ['b', bt(R`\dfrac{4^5.9+2^{10}.18}{2^{10}.3^8}`)],
    ['c', bt(R`\dfrac{27^4.12+9^6.4}{4^2.3^8}`)],
    ['d', bt(R`\dfrac{3^{10}.11+9^5.67}{27^3.26}`)],
    ['e', bt(R`\dfrac{4^{10}.15+8^7.60}{2^{20}.5}`)],
    ['f', bt(R`\dfrac{4^6.9^5+6^6.120}{8^4.3^{12}-6^{11}}`)]]),

  // ── III. TÌM x ──
  ...tach(3, 9, R`Tìm số tự nhiên $x$, biết:`, [
    ['a', bt(R`(x-32)-68=0`)],
    ['b', bt(R`274-(9.x+18)=4`)],
    ['c', bt(R`x-320:32=25.16`)],
    ['d', bt(R`2x+21:3=27`)],
    ['e', bt(R`36:(x-5)=2^2`)],
    ['f', bt(R`2(70-x)+2^2.3^3=92`)],
    ['g', bt(R`(2x+1):7=2^2+3^2`)],
    ['h', bt(R`75-3(x+1)=2^2.3^2`)],
    ['i', bt(R`2448:[119-(x-6)]=2^3.3`)],
    ['j', bt(R`(x-5)(x+3)=0`)],
    ['q', bt(R`(2x-4)(3x+9)=0`)],
    ['k', bt(R`(x-1)(2x-1)(3x-6)=0`)]]),
  ...tach(3, 10, R`Tìm số tự nhiên $x$, biết:`, [
    ['a', bt(R`3^x=9^4:3`)],
    ['b', bt(R`4^{x+1}=16^4`)],
    ['c', bt(R`(x^{54})^2=5^{108}`)],
    ['d', bt(R`(5^x)^2=125^3:5^2`)],
    ['e', bt(R`6^2.6^{x-1}=36^6`)],
    ['f', bt(R`(5x+3^4).2^4=2^6.7^2`)],
    ['g', bt(R`5^{2x-3}-2.5^2=5^2.3`)],
    ['h', bt(R`(3x+4)^2=3^2+2^3+83`)],
    ['i', bt(R`(3x-14)^3=2^5.5^2+200`)],
    ['j', bt(R`5^x+5^{x+1}=750`)],
    ['q', bt(R`5.3^{x-1}+3^{x-1}=162`)],
    ['k', bt(R`4^{2x+1}+4^{2x}=80`)]]),
  ...tach(3, 11, R`Tìm số tự nhiên $x$, biết:`, [
    ['a', bt(R`2^x+2^{x+1}+2^{x+2}+2^{x+3}=480`)],
    ['b', bt(R`5^{x+1}-5^x=2.2^x+8.2^x`)],
    ['c', bt(R`6^x+6^{x+1}=2^x+2.2^x+4.2^x`)],
    ['d', bt(R`3^x+25=26.2^3+2.3^0`)],
    ['e', bt(R`3^x+3^{x+1}+3^{x+2}+3^{x+3}=1080`)],
    ['f', bt(R`5^x+5^{x+1}+5^{x+2}+5^{x+3}=1+2+3+\dots+87+88-4^2`)],
    ['g', bt(R`2^{x+2}.3^{x+1}.5^x=10800`)],
    ['h', bt(R`4^{x+3}.5^{x+1}.6^x=38400`)],
    ['i', bt(R`(125^3.7^5-175^5:5):2021^{2022}=x^{2022}`)],
    ['j', bt(R`(1+2+3+4)^2.(1-x)^{2021}=1^3+2^3+3^3+4^3`)]]),

  // ── IV. TOÁN THỰC TẾ (lời văn: giữ nguyên cả bài) ──
  ...ca(4, 12, 'Để chuẩn bị cho đêm hội Trăng rằm của lớp, Bạn Phụ huynh có 120 chiếc bánh trung thu mini, 168 chiếc lồng đèn phát sáng hình thỏ Miffy và 216 bộ sticker Chilikawa. Bạn tổ chức muốn chia số đồ dùng trên thành các túi quà giống nhau, sao cho mỗi túi có số lượng từng loại như nhau và không còn thừa món nào. Hỏi có thể chia được nhiều nhất bao nhiêu túi quà? Khi đó, mỗi túi có bao nhiêu món đồ của mỗi loại?'),
  ...ca(4, 13, 'Nhân ngày Phụ nữ Việt Nam 20/10, các bạn nam lớp 6A chuẩn bị 180 chiếc dây buộc tóc scrunchie, 270 chiếc kẹp tóc hình Miffy, 315 móc khóa Chikawa và 405 tấm thiệp tự làm để tặng các bạn nữ. Các bạn muốn chia số đồ đã chuẩn bị thành những hộp quà giống nhau, sao cho mỗi hộp có số lượng từng loại như nhau và không còn thừa món nào. Hỏi các bạn nam có thể đóng được nhiều nhất bao nhiêu hộp quà?'),
  ...ca(4, 14, 'Câu lạc bộ Khoa học (STEM) có 148 khối Rubik, 264 bộ mô hình lắp ráp tàu vũ trụ và 342 cuốn sách khám phá khoa học để chia thành các phần quà giống nhau. Sau khi chia đều, còn thừa 4 khối Rubik, 12 bộ mô hình và 18 cuốn sách. Hỏi có thể chia được nhiều nhất bao nhiêu phần quà? Biết số phần quà lớn hơn số vật phẩm còn thừa ở mỗi loại.'),
  ...ca(4, 15, 'Để tổng kết thi đua tháng, cô giáo chuẩn bị 192 cuốn sổ tay, 296 chiếc bút bi hình phi hành gia, 324 túi mù đựng cụ học tập và 255 bộ thước kẻ ê-ke để chia thành các phần quà giống nhau. Khi chia, số sổ tay vừa đủ, số bút bi thừa 8 chiếc, số túi mù thiếu 12 túi mới đủ và số bộ thước kẻ thừa 15 bộ. Hỏi cô giáo có thể chuẩn bị được nhiều nhất bao nhiêu phần quà?'),

  // ── V. CHỦ ĐỀ CHUYÊN (chứng minh: giữ nguyên cả bài, ý sau dựa ý trước) ──
  ...ca(5, 16, 'a) Viết các số 7; 8; 9; 10 thành tổng của hai số nguyên tố cùng nhau lớn hơn 1.\nb) Chứng minh rằng mọi số tự nhiên $n$ lớn hơn 6 đều biểu diễn được dưới dạng tổng của hai số nguyên tố cùng nhau lớn hơn 1.'),
  ...ca(5, 17, 'Cho số tự nhiên $n$ có 39 ước. Chứng minh rằng:\na) $n$ là bình phương của một số tự nhiên $a$.\nb) Tích các ước của $n$ bằng $a^3$.'),
  ...ca(5, 18, 'Cho số tự nhiên $M$ gồm 100 chữ số 1, số tự nhiên $N$ gồm 50 chữ số 2. Chứng minh rằng $M-N$ là một số chính phương.'),
  ...ca(5, 19, 'Cho $A=10^{2012}+10^{2011}+10^{2010}+10^{2009}+8$.\na) Chứng minh rằng $A$ chia hết cho 24.\nb) Chứng minh rằng $A$ không phải là số chính phương.'),
  ...ca(5, 20, 'Tìm ba số nguyên tố $a,\\ b,\\ c$ khác nhau sao cho $abc<ab+bc+ca$.'),
]

// ── KIỂM ────────────────────────────────────────────────────────────────────
const loi = []
for (const q of CAU) {
  const s = q.noi_dung
  if ((s.match(/\$/g) || []).length % 2) loi.push(`${q.nhan}: số dấu $ lẻ`)
  for (const m of s.matchAll(/\$([^$]+)\$/g)) {
    try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }) } catch (e) { loi.push(`${q.nhan}: KaTeX hỏng «${m[1].slice(0, 50)}» — ${e.message.slice(0, 80)}`) }
    if (/\\cdot|\\times/.test(m[1])) loi.push(`${q.nhan}: dấu nhân phải là dấu chấm`)
    if (/[À-ỹĐđ]/.test(m[1].replace(/\\text\{[^}]*\}/g, ''))) loi.push(`${q.nhan}: chữ Việt ngoài \\text{} trong công thức`)
  }
}
if (new Set(CAU.map((q) => q.nhan)).size !== CAU.length) loi.push('trùng nhãn câu')
if (loi.length) { console.error('❌\n  ' + loi.join('\n  ')); process.exit(3) }

// ── FILE GỐC (3 ảnh → 1 PDF) ───────────────────────────────────────────────
mkdirSync(LV, { recursive: true })
const pdf = join(LV, 'goc.pdf')
if (!existsSync(pdf)) {
  const puppeteer = require('puppeteer-core')
  const imgs = [1, 2, 3].map((i) => {
    const f = join(ANH, `${i}.webp`); copyFileSync(f, join(LV, `anh-goc-${i}.webp`))
    return `<img src="data:image/webp;base64,${readFileSync(f).toString('base64')}" style="display:block;width:100%;page-break-after:always">`
  }).join('')
  const br = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' })
  try {
    const pg = await br.newPage()
    await pg.setContent(`<body style="margin:0">${imgs}</body>`, { waitUntil: 'load' })
    await pg.pdf({ path: pdf, width: '1070px', height: '1520px', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } })
  } finally { await br.close() }
}
const sha256 = createHash('sha256').update(readFileSync(pdf)).digest('hex')

// ── de.json ─────────────────────────────────────────────────────────────────
const cau = CAU.map((q) => ({ phan: q.phan, so: 0, nhan: q.nhan, kho: 'dai', loai_cau: 'tu_luan', noi_dung: q.noi_dung, lua_chon: null, dap_an: null, dap_an_nguon: null,
  menh_de: null, loi_giai: null, anh: [], anh_giai: [], dang: null, canh_bao: q.canh_bao }))
const dem = {}
for (const q of cau) q.so = (dem[q.phan] = (dem[q.phan] ?? 0) + 1)
const de = {
  khoi: '6', mon: 'Toán', nam: 2026, nguon: 'Trường TH, THCS & THPT Ngôi Sao Hoàng Mai', kieu: 'de_cuong',
  ten: 'Đề cương ôn tập giữa học kì I Toán 6 năm 2026–2027 — Trường TH, THCS & THPT Ngôi Sao Hoàng Mai (Toán cô Hương – CLB Toán học Pi)',
  file: 'De-cuong-giua-ki-1-Toan-6-NSHM-2026.pdf', sha256, thoi_gian_phut: null, thang_diem: 10,
  phan: PHAN.map((p) => ({ ...p, dang_thuc: 'tu_luan', diem_moi_cau: 0 })), cau,
}
writeFileSync(join(LV, 'de.json'), JSON.stringify(de, null, 1))
const tk = PHAN.map((p) => `${p.ten}: ${cau.filter((q) => q.phan === p.thu_tu).length}`).join(' · ')
console.log(`✔ ${join(LV, 'de.json')} — ${cau.length} câu (${tk}) · ghi chú ${cau.filter((q) => q.canh_bao.length).length} câu · sha256 ${sha256.slice(0, 12)}…`)
