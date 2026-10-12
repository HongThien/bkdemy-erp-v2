// ghi-trung-diem-so-do.mjs — clone 2 mẫu bài trung điểm (CEO 12/10) vào kho K3, dạng T103040101, da_duyet=false.
//   Mẫu A: "M là trung điểm AB, MB = x cm, tính AM"                 (15 câu)
//   Mẫu B: "PQ = L cm, M trung điểm PQ, N trung điểm MQ, tính MN"   (15 câu, L chia hết cho 4)
//   Mẫu C: "Tính AB. Biết M là trung điểm AB, MB = x cm"            (15 câu, đáp án = 2x)
//   --mau A|B|C : chỉ làm mẫu đó (mặc định cả ba; câu trùng nội dung bị bộ lọc trùng bỏ qua).
// Hình là SƠ ĐỒ MINH HOẠ (đúng TỈ LỆ vị trí điểm, không đúng cỡ cm — số lớn như 80 cm không thể vẽ thật), vẽ bằng code.
//   node --env-file=.env scripts/kho/ghi-trung-diem-so-do.mjs [--ghi] [--xem <thư-mục>]
//   --xem: xuất PNG ra thư mục để nhìn, không đụng DB.   Không --ghi: chạy thử (ROLLBACK, không upload).
import pg from 'pg'
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import puppeteer from 'puppeteer-core'
import { createClient } from '@supabase/supabase-js'
import { insertCauBatch } from '../_kho_insert.mjs'

const GHI = process.argv.includes('--ghi')
const iXem = process.argv.indexOf('--xem')
const XEM = iXem > 0 ? process.argv[iXem + 1] : null
const iMau = process.argv.indexOf('--mau')
const MAU = iMau > 0 ? process.argv[iMau + 1].toUpperCase().split('') : ['A', 'B', 'C']
const DANG = 'T103040101'
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'

// ---- dữ liệu ----
const A_X = [3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 16, 18, 20, 24, 25] // độ dài cho trước
const A_TEN = [['A', 'M', 'B'], ['C', 'I', 'D'], ['E', 'K', 'F'], ['G', 'O', 'H'], ['P', 'N', 'Q']]
const B_L = [16, 20, 24, 32, 40, 48, 56, 60, 64, 72, 80, 88, 96, 100, 120] // PQ, chia hết cho 4
const B_TEN = [['P', 'M', 'N', 'Q'], ['A', 'I', 'K', 'B'], ['C', 'M', 'N', 'D'], ['E', 'H', 'K', 'F'], ['X', 'I', 'J', 'Y']]

const C_X = [4, 5, 6, 7, 8, 9, 10, 12, 13, 15, 16, 18, 20, 25, 30] // nửa đoạn cho trước ⇒ AB = 2x

// ---- vẽ SVG (đơn vị mm) ----
const f = (n) => Math.round(n * 100) / 100
const FONT = 'font-family="Times New Roman, Times, serif"'
const diem = (x, y) => `<circle cx="${f(x)}" cy="${y}" r="1" fill="#d00"/>`
const chuDiem = (x, y, t) => `<text x="${f(x)}" y="${y}" font-size="6.5" font-weight="bold" font-style="italic" text-anchor="middle" ${FONT}>${t}</text>`
const nhan = (x, y, t) => `<text x="${f(x)}" y="${y}" font-size="5.5" text-anchor="middle" ${FONT}>${t}</text>`
const doan = (x0, x1, y) => `<line x1="${f(x0)}" y1="${y}" x2="${f(x1)}" y2="${y}" stroke="#222" stroke-width="0.35"/>`
const gach = (x, y) => `<line x1="${f(x)}" y1="${y - 2}" x2="${f(x)}" y2="${y + 2}" stroke="#222" stroke-width="0.35"/>`
const thuoc = (x0, x1, y, t) => // đường kích thước: 2 đầu chắn + nhãn bên dưới
  `<line x1="${f(x0)}" y1="${y}" x2="${f(x1)}" y2="${y}" stroke="#222" stroke-width="0.3"/>` +
  `<line x1="${f(x0)}" y1="${y - 1.8}" x2="${f(x0)}" y2="${y + 1.8}" stroke="#222" stroke-width="0.3"/>` +
  `<line x1="${f(x1)}" y1="${y - 1.8}" x2="${f(x1)}" y2="${y + 1.8}" stroke="#222" stroke-width="0.3"/>` +
  nhan((x0 + x1) / 2, y + 7, t)
const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}mm" height="${h}mm" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="#fff"/>${body}</svg>`

/** Mẫu A. bietBen='MB' ⇒ cho MB hỏi AM; 'AM' ⇒ ngược lại. dapAn: điền số vào chỗ "?" + gạch hai nửa bằng nhau. */
function hinhA({ ten: [A, M, B], x, bietBen, dapAn }) {
  const x0 = 15, x1 = 115, xm = 65, y = 20
  const trai = bietBen === 'AM' || dapAn ? `${x} cm` : '? cm'
  const phai = bietBen === 'MB' || dapAn ? `${x} cm` : '? cm'
  let s = doan(x0, x1, y) + diem(x0, y) + diem(xm, y) + diem(x1, y)
  s += chuDiem(x0, y + 10, A) + chuDiem(xm, y + 10, M) + chuDiem(x1, y + 10, B)
  s += nhan((x0 + xm) / 2, y - 6, trai) + nhan((xm + x1) / 2, y - 6, phai)
  if (dapAn) s += gach((x0 + xm) / 2, y) + gach((xm + x1) / 2, y)
  return svg(130, 36, s)
}

/** Mẫu B. M giữa PQ, N giữa MQ (vị trí đúng tỉ lệ 0 · 1/2 · 3/4 · 1). */
function hinhB({ ten: [P, M, N, Q], L, dapAn }) {
  const x0 = 12, d = 120, xM = x0 + d / 2, xN = x0 + (d * 3) / 4, xQ = x0 + d, y = 20
  let s = doan(x0, xQ, y) + [x0, xM, xN, xQ].map((x) => diem(x, y)).join('')
  s += chuDiem(x0, y + 10, P) + chuDiem(xM, y + 10, M) + chuDiem(xN, y + 10, N) + chuDiem(xQ, y + 10, Q)
  s += nhan((xM + xN) / 2, y - 6, dapAn ? `${L / 4} cm` : '? cm')
  s += thuoc(x0, xQ, y + 20, `${L} cm`)
  if (dapAn) s += thuoc(xM, xQ, y + 35, `${L / 2} cm`)
  return svg(150, dapAn ? 72 : 56, s)
}

/** Mẫu C. Cung nét đứt A→B mang nhãn cần tìm; nhãn đã biết nằm dưới nửa đoạn tương ứng. */
function hinhC({ ten: [A, M, B], x, bietBen, dapAn }) {
  const x0 = 15, x1 = 115, xm = 65, y = 24
  const cung = `<path d="M ${x0} ${y} Q ${xm} ${y - 14} ${x1} ${y}" fill="none" stroke="#222" stroke-width="0.35" stroke-dasharray="2 1.4"/>`
  let s = doan(x0, x1, y) + cung + diem(x0, y) + diem(xm, y) + diem(x1, y)
  s += chuDiem(x0, y + 10, A) + chuDiem(xm, y + 10, M) + chuDiem(x1, y + 10, B)
  s += nhan(xm, y - 10, dapAn ? `${2 * x} cm` : '? cm')
  const xb = bietBen === 'MB' ? (xm + x1) / 2 : (x0 + xm) / 2
  s += nhan(xb, y + 9, `${x} cm`)
  if (dapAn) {
    const xk = bietBen === 'MB' ? (x0 + xm) / 2 : (xm + x1) / 2
    s += nhan(xk, y + 9, `${x} cm`) + gach((x0 + xm) / 2, y) + gach((xm + x1) / 2, y)
  }
  return svg(130, 40, s)
}

// ---- dựng câu ----
const cau = []
A_X.forEach((x, i) => {
  const ten = A_TEN[i % 5], [A, M, B] = ten
  const bietBen = i % 3 === 2 ? 'AM' : 'MB' // 5 câu cho AM hỏi MB, 10 câu cho MB hỏi AM
  const cho = bietBen === 'MB' ? `${M}${B}` : `${A}${M}`, hoi = bietBen === 'MB' ? `${A}${M}` : `${M}${B}`
  cau.push({
    ma: `A${i + 1}`,
    ten_de_goc: `Trung điểm sơ đồ · A${i + 1} · ${A}${B} (${cho} = ${x} cm)`,
    svgDe: hinhA({ ten, x, bietBen, dapAn: false }), svgDa: hinhA({ ten, x, bietBen, dapAn: true }),
    noi_dung: `Biết ${M} là trung điểm của đoạn thẳng ${A}${B} theo hình vẽ sau, ${cho} = ${x} cm. Tính độ dài ${hoi}.`,
    dap_an: `${x} cm`,
    loi_giai: [
      '**Phần 1. Hướng dẫn**',
      `**Mấu chốt:** Trung điểm ${M} nằm giữa ${A} và ${B} và chia đoạn thẳng ${A}${B} thành hai phần bằng nhau, nên ${A}${M} = ${M}${B}.`,
      `**Bước 1.** Đọc đề và hình: ${M} là trung điểm của ${A}${B}, đã biết ${cho} = ${x} cm, cần tìm ${hoi}.`,
      `**Bước 2.** Vì ${M} là trung điểm của ${A}${B} nên hai đoạn thẳng ${A}${M} và ${M}${B} có độ dài bằng nhau.`,
      `**Bước 3.** Từ ${cho} = ${x} cm suy ra ${hoi} cũng bằng ${x} cm.`,
      '**Phần 2. Trình bày**',
      `${M} là trung điểm của đoạn thẳng ${A}${B} nên ${A}${M} = ${M}${B}.`,
      `Độ dài đoạn thẳng ${hoi} là $${x}$ cm.`,
      `Đáp số: $${x}$ cm.`,
    ].join('\n\n'),
  })
})
B_L.forEach((L, i) => {
  const ten = B_TEN[i % 5], [P, M, N, Q] = ten
  const nua = L / 2, tu = L / 4
  cau.push({
    ma: `B${i + 1}`,
    ten_de_goc: `Trung điểm sơ đồ · B${i + 1} · ${P}${Q} = ${L} cm`,
    svgDe: hinhB({ ten, L, dapAn: false }), svgDa: hinhB({ ten, L, dapAn: true }),
    noi_dung: `Cho đoạn thẳng ${P}${Q} = ${L} cm, có ${M} là trung điểm của đoạn thẳng ${P}${Q}, ${N} là trung điểm của đoạn thẳng ${M}${Q}. Độ dài đoạn thẳng ${M}${N} là bao nhiêu?`,
    dap_an: `${tu} cm`,
    loi_giai: [
      '**Phần 1. Hướng dẫn**',
      '**Mấu chốt:** Mỗi lần lấy trung điểm thì đoạn thẳng được chia làm hai phần bằng nhau, nên độ dài giảm đi một nửa. Ở bài này phải lấy trung điểm hai lần liên tiếp.',
      `**Bước 1.** ${M} là trung điểm của ${P}${Q} nên ${M}${Q} bằng một nửa ${P}${Q}; tính ${M}${Q} bằng cách lấy ${L} chia 2.`,
      `**Bước 2.** ${N} là trung điểm của ${M}${Q} nên ${M}${N} bằng một nửa ${M}${Q}; lấy kết quả ở bước 1 chia tiếp cho 2.`,
      `**Bước 3.** Kết quả cuối cùng chính là độ dài ${M}${N}, nhớ ghi đơn vị cm.`,
      '**Phần 2. Trình bày**',
      `Độ dài của đoạn thẳng ${M}${Q} là:`,
      `$${L} : 2 = ${nua}$ (cm)`,
      `Độ dài của đoạn thẳng ${M}${N} là:`,
      `$${nua} : 2 = ${tu}$ (cm)`,
      `Đáp số: $${tu}$ cm.`,
    ].join('\n\n'),
  })
})

C_X.forEach((x, i) => {
  const ten = A_TEN[(i + 2) % 5], [A, M, B] = ten
  const bietBen = i % 3 === 1 ? 'AM' : 'MB'
  const cho = bietBen === 'MB' ? `${M}${B}` : `${A}${M}`
  cau.push({
    ma: `C${i + 1}`,
    ten_de_goc: `Trung điểm sơ đồ · C${i + 1} · ${A}${B} (${cho} = ${x} cm)`,
    svgDe: hinhC({ ten, x, bietBen, dapAn: false }), svgDa: hinhC({ ten, x, bietBen, dapAn: true }),
    noi_dung: `Tính độ dài ${A}${B}. Biết ${M} là trung điểm của ${A}${B} và ${cho} = ${x} cm.`,
    dap_an: `${2 * x} cm`,
    loi_giai: [
      '**Phần 1. Hướng dẫn**',
      `**Mấu chốt:** Trung điểm ${M} chia đoạn thẳng ${A}${B} thành hai phần bằng nhau, nên cả đoạn ${A}${B} dài gấp đôi một nửa của nó.`,
      `**Bước 1.** Vì ${M} là trung điểm của ${A}${B} nên ${A}${M} = ${M}${B}; đã biết ${cho} = ${x} cm thì đoạn còn lại cũng dài ${x} cm.`,
      `**Bước 2.** Đoạn thẳng ${A}${B} gồm hai đoạn ${A}${M} và ${M}${B} ghép lại, nên ${A}${B} bằng tổng hai đoạn đó.`,
      `**Bước 3.** Cộng hai độ dài bằng nhau để ra ${A}${B}, nhớ ghi đơn vị cm.`,
      '**Phần 2. Trình bày**',
      `Vì ${M} là trung điểm của ${A}${B} và ${cho} = ${x}$ cm nên ${A}${M} = ${M}${B} = ${x}$ cm.`,
      `Độ dài đoạn thẳng ${A}${B} là:`,
      `${x} + ${x} = ${2 * x}$ (cm)`,
      `Đáp số: ${2 * x}$ cm.`,
    ].join('\n\n'),
  })
})
const cauChon = cau.filter((c) => MAU.includes(c.ma[0]))

// ---- render + upload ----
const br = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
async function png(s) {
  const w = Math.ceil(+s.match(/width="([\d.]+)mm"/)[1] * 3.7795), h = Math.ceil(+s.match(/height="([\d.]+)mm"/)[1] * 3.7795)
  const pg = await br.newPage()
  await pg.setViewport({ width: w, height: h, deviceScaleFactor: 3 })
  await pg.setContent(`<body style="margin:0;background:#fff">${s}</body>`)
  const b = Buffer.from(await pg.screenshot({ clip: { x: 0, y: 0, width: w, height: h } }))
  await pg.close()
  return b
}
const env = {}
for (const l of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!l.includes('=') || l.trim().startsWith('#')) continue
  const i = l.indexOf('=')
  env[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^"|"$/g, '')
}
const sb = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false } })
async function up(buf) {
  const path = `trung-diem/${new Date().toISOString().slice(0, 7)}/${randomUUID()}.png`
  if (!GHI) return `dry://kho-anh/${path}`
  const { error } = await sb.storage.from('kho-anh').upload(path, buf, { contentType: 'image/png', upsert: false })
  if (error) throw new Error(`upload: ${error.message}`)
  return sb.storage.from('kho-anh').getPublicUrl(path).data.publicUrl
}

try {
  if (XEM) mkdirSync(XEM, { recursive: true })
  const cauList = []
  for (const c of cauChon) {
    const de = await png(c.svgDe), da = await png(c.svgDa)
    if (XEM) {
      writeFileSync(`${XEM}/${c.ma}-de.png`, de)
      writeFileSync(`${XEM}/${c.ma}-da.png`, da)
      continue
    }
    cauList.push({
      dang_chinh: DANG, loai_cau: 'tra_loi_ngan', noi_dung: c.noi_dung, dap_an: c.dap_an, loi_giai: c.loi_giai,
      anh_de: await up(de), anh_dap_an: await up(da), nguon: 'le', nguon_giai: 'nguoi', ten_de_goc: c.ten_de_goc,
    })
  }
  if (XEM) { console.log(`Đã xuất ${cauChon.length * 2} ảnh vào ${XEM}`) }
  else {
    const db = new pg.Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000 })
    await db.connect()
    await db.query('begin')
    try {
      const { maCauList, trung } = await insertCauBatch({ client: db, subject: 'dai', cauList })
      console.log(`${maCauList.length} mã: ${maCauList[0]} … ${maCauList.at(-1)}${trung.length ? ' · trùng ' + JSON.stringify(trung) : ''}`)
      await db.query(GHI ? 'commit' : 'rollback')
      console.log(GHI ? '✅ ĐÃ GHI' : '↩ chạy thử, ROLLBACK')
    } catch (e) { await db.query('rollback'); throw e } finally { await db.end() }
  }
} finally { await br.close() }
