// ghi-hbh-hinh-thoi-lop4-pdf.mjs — clone các bài của "Hình-bình-hành-lớp-4.pdf" + "Hình-thoi-lớp-4.pdf" (Thùy 14/10), mỗi bài 5 câu, HÌNH VẼ BẰNG CODE.
// Vào kho KHỐI 4: T104030301 (Nhận biết hình bình hành) · T104030302 (Nhận biết hình thoi). da_duyet=false.
//   HBH: P1 chọn hình (viền xanh) · P4 chọn hình (tô màu) · P2 cặp cạnh song song · P3 trắc nghiệm độ dài cạnh · P5 điền thẻ · P6 đoạn EF song song đáy
//   Thoi: H1 điền thẻ (song song, bằng nhau) · H2 độ dài cạnh + vuông góc · H3 chọn hình thoi · H4 điền từ (song song/vuông góc/bằng nhau)
//   node --env-file=.env scripts/kho/ghi-hbh-hinh-thoi-lop4-pdf.mjs [--ghi] [--xem <thư-mục>] [--mau P1,H3]
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
const MAU = iMau > 0 ? process.argv[iMau + 1].toUpperCase().split(',') : ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'H1', 'H2', 'H3', 'H4']
const DANG_HBH = 'T104030301', DANG_THOI = 'T104030302'
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const TIEN_TO = 'Lớp 4 HBH/thoi (PDF)'

// ================= bộ vẽ SVG (mm) =================
const f = (n) => Math.round(n * 100) / 100
const FONT = 'font-family="Times New Roman, Times, serif"'
const INK = '#1f2a9a'
const svgDoc = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${f(w)}mm" height="${f(h)}mm" viewBox="0 0 ${f(w)} ${f(h)}"><rect width="100%" height="100%" fill="#fff"/>${body}</svg>`
const Ln = (a, b, o = {}) => `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${o.c ?? INK}" stroke-width="${o.w ?? 0.5}"${o.dash ? ' stroke-dasharray="2 1.5"' : ''} stroke-linecap="round"/>`
const Pg = (pts, o = {}) => `<polygon points="${pts.map((p) => `${f(p[0])},${f(p[1])}`).join(' ')}" fill="${o.fill ?? 'none'}" stroke="${o.c ?? INK}" stroke-width="${o.w ?? 0.6}" stroke-linejoin="round"/>`
const Dt = (p, c = '#c00', r = 0.9) => `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${r}" fill="${c}"/>`
const Tx = (p, t, o = {}) => `<text x="${f(p[0])}" y="${f(p[1])}" font-size="${o.s ?? 5.6}" ${o.i === false ? '' : 'font-style="italic"'} font-weight="${o.b === false ? 'normal' : 'bold'}" text-anchor="${o.a ?? 'middle'}" fill="${o.c ?? '#000'}" ${FONT}>${t}</text>`
const cen = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length]
/** nhãn đỉnh đẩy ra ngoài tâm đa giác */
function nhanDinh(pts, names, d = 4.6, o = {}) {
  const c = cen(pts)
  return pts.map((p, i) => { const u = [p[0] - c[0], p[1] - c[1]], l = Math.hypot(...u) || 1; return Tx([p[0] + (u[0] / l) * d, p[1] + (u[1] / l) * d + 1.9], names[i], o) }).join('')
}
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
/** nhãn nằm cạnh trung điểm cạnh a-b, đẩy ra ngoài tâm c */
function nhanCanh(a, b, c, t, d = 4.2, o = {}) {
  const m = mid(a, b), u = [m[0] - c[0], m[1] - c[1]], l = Math.hypot(...u) || 1
  return Tx([m[0] + (u[0] / l) * d, m[1] + (u[1] / l) * d + 1.8], t, { s: 4.8, b: false, i: false, ...o })
}
/** gạch "bằng nhau" trên đoạn a-b (n gạch) */
function gach(a, b, n = 1, c = '#0a7d34') {
  const m = mid(a, b), d = [b[0] - a[0], b[1] - a[1]], len = Math.hypot(...d) || 1, u = [d[0] / len, d[1] / len], nv = [-u[1], u[0]]
  let s = ''
  for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * 1.5, q = [m[0] + u[0] * o, m[1] + u[1] * o]; s += Ln([q[0] - nv[0] * 1.8, q[1] - nv[1] * 1.8], [q[0] + nv[0] * 1.8, q[1] + nv[1] * 1.8], { c, w: 0.55 }) }
  return s
}
/** mũi tên song song (>) trên đoạn a-b, n mũi */
function songSong(a, b, n = 1, c = '#b45309') {
  const m = mid(a, b), d = [b[0] - a[0], b[1] - a[1]], len = Math.hypot(...d) || 1, u = [d[0] / len, d[1] / len], nv = [-u[1], u[0]]
  let s = ''
  for (let i = 0; i < n; i++) {
    const q = [m[0] + u[0] * (i * 2.2 - (n - 1) * 1.1), m[1] + u[1] * (i * 2.2 - (n - 1) * 1.1)]
    s += Ln([q[0] - u[0] * 1.6 + nv[0] * 1.5, q[1] - u[1] * 1.6 + nv[1] * 1.5], q, { c, w: 0.55 }) + Ln([q[0] - u[0] * 1.6 - nv[0] * 1.5, q[1] - u[1] * 1.6 - nv[1] * 1.5], q, { c, w: 0.55 })
  }
  return s
}
/** ký hiệu góc vuông tại v giữa a và b */
function gocVuong(v, a, b, r = 2.6, c = '#c00') {
  const ua = [a[0] - v[0], a[1] - v[1]], ub = [b[0] - v[0], b[1] - v[1]], la = Math.hypot(...ua), lb = Math.hypot(...ub)
  const p1 = [v[0] + (ua[0] / la) * r, v[1] + (ua[1] / la) * r], p3 = [v[0] + (ub[0] / lb) * r, v[1] + (ub[1] / lb) * r], p2 = [p1[0] + p3[0] - v[0], p1[1] + p3[1] - v[1]]
  return `<polyline points="${[p1, p2, p3].map((p) => `${f(p[0])},${f(p[1])}`).join(' ')}" fill="none" stroke="${c}" stroke-width="0.5"/>`
}

// ================= hình mẫu cho bài chọn hình =================
// mỗi hàm trả về { pts, loai } trong ô 40×30
const SH = {
  par: (sh = 9, w = 26, h = 19) => ({ loai: 'par', pts: [[5 + sh, 5], [5 + sh + w, 5], [5 + w, 5 + h], [5, 5 + h]] }),
  parTrai: (sh = 9, w = 26, h = 19) => ({ loai: 'par', pts: [[5, 5], [5 + w, 5], [5 + w + sh, 5 + h], [5 + sh, 5 + h]] }),
  thoiNam: (s = 8, h = 18) => { const a = Math.sqrt(s * s + h * h); return { loai: 'thoi', pts: [[6 + s, 6], [6 + s + a, 6], [6 + a, 6 + h], [6, 6 + h]] } },
  thoiKc: (p = 16, q = 11) => ({ loai: 'thoi', pts: [[20, 15 - q], [20 + p, 15], [20, 15 + q], [20 - p, 15]] }),
  chuNhat: (w = 30, h = 18) => ({ loai: 'cn', pts: [[5, 6], [5 + w, 6], [5 + w, 6 + h], [5, 6 + h]] }),
  thang: (t = 16, d = 30, h = 19) => ({ loai: 'thang', pts: [[20 - t / 2, 6], [20 + t / 2, 6], [20 + d / 2, 6 + h], [20 - d / 2, 6 + h]] }),
  thangVuong: (t = 14, d = 30, h = 19) => ({ loai: 'thang', pts: [[5, 6], [5 + t, 6], [5 + d, 6 + h], [5, 6 + h]] }),
  tamGiac: (x = 20) => ({ loai: 'tam', pts: [[x, 4], [5, 26], [36, 26]] }),
  tuGiac: () => ({ loai: 'tugiac', pts: [[16, 3], [34, 4], [25, 26], [2, 12]] }), // tứ giác thường: mọi cặp cạnh đối lệch ≥28° (không bị nhìn nhầm hình bình hành/chữ nhật)
  dieu: () => ({ loai: 'dieu', pts: [[20, 3], [32, 12], [20, 27], [8, 12]] }),
  nguGiac: () => ({ loai: 'ngu', pts: [[20, 3], [35, 13], [30, 27], [10, 27], [5, 13]] }),
}
const MAU_TO = [['#dbeed2', '#3f8f2a'], ['#fddccb', '#e0652a'], ['#fff1c2', '#e0a800'], ['#d3e1fb', '#2563c4'], ['#f6d6ea', '#b83280'], ['#d9f0f0', '#1f8a8a']]
/** 4 hình xếp ngang, nhãn "Hình k"; dung = chỉ số (0..3) hình đúng → vẽ viền đậm xanh lá + ✓ khi dapAn */
function hangHinh(shapes, { mau, dung, dapAn }) {
  const cw = 44
  let s = ''
  shapes.forEach((sh, i) => {
    const ox = 4 + i * cw, oy = 2
    const pts = sh.pts.map((p) => [p[0] + ox, p[1] + oy])
    const [fill, line] = mau ? MAU_TO[(i + (mau === 2 ? 2 : 0)) % MAU_TO.length] : ['none', INK]
    const ok = dapAn && i === dung
    s += Pg(pts, { fill: ok ? (mau ? fill : '#e3f6dd') : fill, c: ok ? '#0a7d34' : line, w: ok ? 1.1 : 0.7 })
    s += Tx([ox + 20, oy + 38], `Hình ${i + 1}`, { s: 5, i: false })
    if (ok) s += Tx([ox + 20, oy + 44.5], '✓', { s: 6, c: '#0a7d34', i: false })
  })
  return svgDoc(4 * cw + 6, dapAn ? 50 : 42, s)
}
const MO_TA = {
  par: 'hai cặp cạnh đối diện song song', thoi: 'bốn cạnh bằng nhau', cn: 'hai cặp cạnh đối song song, bốn góc vuông',
  thang: 'chỉ có một cặp cạnh đối song song', tam: 'là hình tam giác (3 cạnh), không phải tứ giác', tugiac: 'không có cặp cạnh đối nào song song',
  dieu: 'không có cặp cạnh đối nào song song', ngu: 'có 5 cạnh, không phải tứ giác',
}
const khongLaHBH = { thang: 'chỉ có một cặp cạnh song song nên là hình thang', tam: 'có 3 cạnh nên là hình tam giác', tugiac: 'không có cặp cạnh đối nào song song', dieu: 'hai cặp cạnh kề bằng nhau nhưng các cạnh đối không song song', ngu: 'có 5 cạnh nên không phải tứ giác' }
const khongLaThoi = { tam: 'có 3 cạnh nên là hình tam giác', thang: 'chỉ có một cặp cạnh song song và các cạnh không bằng nhau', cn: 'có hai cạnh kề không bằng nhau', par: 'có hai cạnh kề không bằng nhau' }

// ---- P1 / P4: chọn hình bình hành ----
const BIEN_HBH = [
  { hs: [SH.thang(), SH.par(10), SH.thangVuong(), SH.tamGiac()], dung: 1 },
  { hs: [SH.tuGiac(), SH.thang(14, 32), SH.par(8, 24, 20), SH.tamGiac(12)], dung: 2 },
  { hs: [SH.parTrai(8), SH.dieu(), SH.tamGiac(28), SH.thang(18, 26)], dung: 0 },
  { hs: [SH.nguGiac(), SH.tamGiac(), SH.thangVuong(12, 28), SH.parTrai(11, 24, 18)], dung: 3 },
  { hs: [SH.thang(10, 30, 18), SH.parTrai(10), SH.tuGiac(), SH.thangVuong()], dung: 1 },
]
const BIEN_HBH2 = [
  { hs: [SH.par(10), SH.tamGiac(), SH.thang(18, 32), SH.dieu()], dung: 0 },
  { hs: [SH.tamGiac(30), SH.nguGiac(), SH.parTrai(9, 27, 18), SH.thangVuong()], dung: 2 },
  { hs: [SH.thangVuong(16, 30), SH.tuGiac(), SH.thang(10, 28), SH.par(7, 28, 18)], dung: 3 },
  { hs: [SH.dieu(), SH.parTrai(12, 22, 20), SH.tamGiac(10), SH.thang(20, 34)], dung: 1 },
  { hs: [SH.par(8, 28, 17), SH.thang(12, 30), SH.tuGiac(), SH.tamGiac()], dung: 0 },
]
function cauChonHBH(ma, v, mau) {
  const k = v.dung + 1
  const khac = v.hs.map((s, i) => [i + 1, s]).filter(([, s], i) => i !== v.dung)
  return {
    ma, dang: DANG_HBH, loai: 'tra_loi_ngan',
    svgDe: hangHinh(v.hs, { mau, dung: v.dung, dapAn: false }), svgDa: hangHinh(v.hs, { mau, dung: v.dung, dapAn: true }),
    noi_dung: 'Hình nào dưới đây là hình bình hành?', dap_an: String(k),
    loi_giai: [
      '**Phần 1. Hướng dẫn**',
      '**Mấu chốt:** Hình bình hành là tứ giác có hai cặp cạnh đối diện song song (và bằng nhau).',
      '**Bước 1.** Đếm số cạnh của từng hình: hình bình hành phải có đúng 4 cạnh.',
      '**Bước 2.** Với mỗi hình có 4 cạnh, xem hai cạnh đối diện (cạnh trên với cạnh dưới, cạnh trái với cạnh phải) có song song với nhau không.',
      '**Bước 3.** Chọn hình có cả hai cặp cạnh đối diện song song, loại các hình còn lại.',
      '**Phần 2. Trình bày**',
      `Hình ${k} có hai cặp cạnh đối diện song song nên là hình bình hành.`,
      ...khac.map(([i, s]) => `Hình ${i} ${khongLaHBH[s.loai] ?? 'không phải hình bình hành'} nên không phải hình bình hành.`),
      `Vậy hình bình hành là Hình ${k}.`,
    ].join('\n\n'),
  }
}

// ---- H3: chọn hình thoi ----
const BIEN_THOI = [
  { hs: [SH.tamGiac(), SH.thang(), SH.thoiKc(), SH.chuNhat()], dung: 2 },
  { hs: [SH.thoiNam(9, 17), SH.chuNhat(28, 20), SH.tamGiac(30), SH.thang(14, 30)], dung: 0 },
  { hs: [SH.par(10), SH.tamGiac(), SH.thang(12, 30), SH.thoiKc(15, 12)], dung: 3 },
  { hs: [SH.chuNhat(), SH.thoiNam(8, 19), SH.parTrai(11, 28, 17), SH.tamGiac(10)], dung: 1 },
  { hs: [SH.thang(18, 32), SH.thoiKc(17, 10), SH.chuNhat(26, 16), SH.tamGiac(30)], dung: 1 },
]
function cauChonThoi(ma, v, mau) {
  const k = v.dung + 1
  const khac = v.hs.map((s, i) => [i + 1, s]).filter((_, i) => i !== v.dung)
  return {
    ma, dang: DANG_THOI, loai: 'tra_loi_ngan',
    svgDe: hangHinh(v.hs, { mau, dung: v.dung, dapAn: false }), svgDa: hangHinh(v.hs, { mau, dung: v.dung, dapAn: true }),
    noi_dung: 'Hình nào dưới đây có dạng hình thoi?', dap_an: String(k),
    loi_giai: [
      '**Phần 1. Hướng dẫn**',
      '**Mấu chốt:** Hình thoi là tứ giác có bốn cạnh bằng nhau và hai cặp cạnh đối diện song song.',
      '**Bước 1.** Loại các hình không phải tứ giác (tam giác có 3 cạnh).',
      '**Bước 2.** Với các tứ giác còn lại, quan sát xem bốn cạnh có bằng nhau không (có thể so sánh bằng thước hoặc ê ke).',
      '**Bước 3.** Chọn hình có bốn cạnh bằng nhau, loại hình có cạnh dài cạnh ngắn.',
      '**Phần 2. Trình bày**',
      `Hình ${k} có bốn cạnh bằng nhau nên là hình thoi.`,
      ...khac.map(([i, s]) => `Hình ${i} ${khongLaThoi[s.loai] ?? 'không phải hình thoi'} nên không phải hình thoi.`),
      `Vậy hình có dạng hình thoi là Hình ${k}.`,
    ].join('\n\n'),
  }
}

// ================= hình bình hành có nhãn =================
/** pts theo thứ tự [TL,TR,BR,BL] */
function parPts(ox, oy, w, h, sh) { return [[ox + sh, oy], [ox + sh + w, oy], [ox + w, oy + h], [ox, oy + h]] }

// ---- P2: cặp cạnh song song (có hai đường chéo, điểm O) ----
const BIEN_P2 = [
  { n: ['A', 'B', 'C', 'D'], sh: 9, w: 40, h: 22, trai: true },
  { n: ['M', 'N', 'P', 'Q'], sh: 12, w: 38, h: 24, trai: false },
  { n: ['E', 'F', 'G', 'H'], sh: 8, w: 42, h: 20, trai: true },
  { n: ['K', 'L', 'M', 'N'], sh: 11, w: 36, h: 25, trai: false },
  { n: ['P', 'Q', 'R', 'S'], sh: 10, w: 40, h: 21, trai: true },
]
function hinhP2(v, dapAn) {
  // thứ tự đỉnh quanh hình: n0 = dưới-trái, n1 = trên-trái, n2 = trên-phải, n3 = dưới-phải (giống hình mẫu)
  const base = parPts(10 + (v.trai ? 0 : v.sh), 8, v.w, v.h, v.trai ? v.sh : -v.sh) // [TL,TR,BR,BL]
  const [TL, TR, BR, BL] = base
  const pts = [BL, TL, TR, BR]
  const o = mid(BL, TR)
  let s = Pg(pts, { c: INK, w: 0.7 }) + Ln(BL, TR, { c: INK, w: 0.4 }) + Ln(TL, BR, { c: INK, w: 0.4 })
  if (dapAn) s += Ln(pts[0], pts[1], { c: '#0a7d34', w: 1 }) + Ln(pts[2], pts[3], { c: '#0a7d34', w: 1 }) + Ln(pts[1], pts[2], { c: '#c2410c', w: 1 }) + Ln(pts[3], pts[0], { c: '#c2410c', w: 1 })
  for (const p of pts) s += Dt(p)
  s += Dt(o, '#c00', 1)
  s += nhanDinh(pts, v.n, 4.8) + Tx([o[0] + 3, o[1] - 2], 'O', { s: 5.2 })
  return svgDoc(v.w + 28, v.h + 22, s)
}
const cauP2 = BIEN_P2.map((v, i) => {
  const [A, B, C, D] = v.n
  return {
    ma: `P2-${i + 1}`, dang: DANG_HBH, loai: 'tra_loi_ngan', svgDe: hinhP2(v, false), svgDa: hinhP2(v, true),
    noi_dung: `Cho hình bình hành ${A}${B}${C}${D}, cặp cạnh song song với nhau là`,
    dap_an: `${B}${C} song song với ${A}${D}; ${A}${B} song song với ${C}${D}`,
    loi_giai: [
      '**Phần 1. Hướng dẫn**',
      '**Mấu chốt:** Hình bình hành có hai cặp cạnh đối diện song song với nhau; cạnh đối diện là hai cạnh không có chung đỉnh.',
      `**Bước 1.** Tìm các cạnh của hình bình hành ${A}${B}${C}${D}: ${A}${B}, ${B}${C}, ${C}${D}, ${D}${A}.`,
      `**Bước 2.** Ghép các cạnh đối diện (không chung đỉnh): ${A}${B} đối diện ${C}${D}, còn ${B}${C} đối diện ${A}${D}.`,
      '**Bước 3.** Mỗi cặp cạnh đối diện song song với nhau, ghi cả hai cặp (đường chéo không phải là cạnh nên không tính).',
      '**Phần 2. Trình bày**',
      `${B}${C} song song với ${A}${D}`,
      `${A}${B} song song với ${C}${D}`,
    ].join('\n\n'),
  }
})

// ---- P3: trắc nghiệm độ dài cạnh ----
const BIEN_P3 = [
  { n: ['M', 'N', 'P', 'Q'], a: 5, b: 3, dung: 0 },
  { n: ['A', 'B', 'C', 'D'], a: 7, b: 4, dung: 2 },
  { n: ['E', 'F', 'G', 'H'], a: 6, b: 2, dung: 1 },
  { n: ['K', 'L', 'I', 'O'], a: 8, b: 5, dung: 3 },
  { n: ['X', 'Y', 'Z', 'T'], a: 9, b: 6, dung: 0 },
]
function hinhP3(v, dapAn) {
  const pts = parPts(8, 10, 44, 22, 12) // [TL,TR,BR,BL]
  let s = Pg(pts, { c: '#444', w: 0.6 })
  if (dapAn) s += gach(pts[0], pts[1], 1) + gach(pts[3], pts[2], 1) + gach(pts[1], pts[2], 2) + gach(pts[0], pts[3], 2)
  s += nhanDinh(pts, v.n, 4.6, { i: false })
  const c = cen(pts)
  s += nhanCanh(pts[0], pts[1], c, `${v.a} cm`, 4.2) + nhanCanh(pts[1], pts[2], c, `${v.b} cm`, 9)
  return svgDoc(78, 46, s)
}
function cauP3(v, i) {
  const [M, N, P, Q] = v.n, a = v.a, b = v.b
  const dungS = `${M}${N} = ${Q}${P} = ${a} cm; ${N}${P} = ${M}${Q} = ${b} cm`
  const sai = [
    `${M}${N} = ${M}${Q} = ${a} cm; ${N}${P} = ${M}${Q} = ${b} cm`,
    `${M}${N} = ${N}${P} = ${a} cm; ${M}${Q} = ${Q}${P} = ${b} cm`,
    `${M}${N} = ${Q}${P} = ${b} cm; ${N}${P} = ${M}${Q} = ${a} cm`,
  ]
  const lc = [...sai]; lc.splice(v.dung, 0, dungS)
  return {
    ma: `P3-${i + 1}`, dang: DANG_HBH, loai: 'trac_nghiem', svgDe: hinhP3(v, false), svgDa: hinhP3(v, true),
    noi_dung: `Hình bình hành ${M}${N}${P}${Q} có:`, lua_chon: lc, dap_an: 'ABCD'[v.dung],
    loi_giai: [
      '**Phần 1. Hướng dẫn**',
      '**Mấu chốt:** Trong hình bình hành, hai cạnh đối diện có độ dài bằng nhau.',
      `**Bước 1.** Đọc độ dài trên hình: ${M}${N} = ${a} cm, ${N}${P} = ${b} cm.`,
      `**Bước 2.** Tìm cạnh đối diện của từng cạnh đã biết: ${M}${N} đối diện ${Q}${P}, còn ${N}${P} đối diện ${M}${Q}.`,
      '**Bước 3.** Cạnh đối diện thì bằng nhau, từ đó chọn phương án đúng và loại các phương án cho hai cạnh kề bằng nhau.',
      '**Phần 2. Trình bày**',
      `${M}${N} và ${Q}${P} là hai cạnh đối diện nên ${M}${N} = ${Q}${P} = ${a} cm.`,
      `${N}${P} và ${M}${Q} là hai cạnh đối diện nên ${N}${P} = ${M}${Q} = ${b} cm.`,
      `Vậy chọn đáp án ${'ABCD'[v.dung]}.`,
    ].join('\n\n'),
  }
}

// ---- P5: điền thẻ (hình bình hành, không số đo) ----
// n = [TL,TR,BR,BL] ; hỏi: a) cạnh `ss` song song với ...; b) x = ... ; y = ...
const BIEN_P5 = [
  { n: ['M', 'N', 'P', 'Q'], ss: 0, b: [3, 2] }, // MN∥QP ; MQ = NP , QP = MN
  { n: ['A', 'B', 'C', 'D'], ss: 1, b: [0, 3] },
  { n: ['E', 'F', 'G', 'H'], ss: 2, b: [1, 0] },
  { n: ['K', 'L', 'I', 'O'], ss: 3, b: [2, 1] },
  { n: ['X', 'Y', 'Z', 'T'], ss: 0, b: [1, 3] },
]
function canhP5(n) { return [`${n[0]}${n[1]}`, `${n[1]}${n[2]}`, `${n[3]}${n[2]}`, `${n[0]}${n[3]}`] } // trên, phải, dưới, trái
function hinhP5(v, dapAn) {
  const pts = parPts(10, 12, 44, 24, 12)
  let s = Pg(pts, { c: '#444', w: 0.6 })
  if (dapAn) { const cs = [[0, 1], [1, 2], [3, 2], [0, 3]]; const C = ['#0a7d34', '#c2410c', '#0a7d34', '#c2410c']; cs.forEach(([a, b], k) => { s += Ln(pts[a], pts[b], { c: C[k], w: 1.1 }) }) }
  s += nhanDinh(pts, v.n, 4.8, { i: false })
  return svgDoc(78, 52, s)
}
const doiDien = [2, 3, 0, 1] // chỉ số cạnh đối diện (trên-dưới, phải-trái)
const cauP5 = BIEN_P5.map((v, i) => {
  const cs = canhP5(v.n), [M, N, P, Q] = v.n
  const dap = [doiDien[v.ss], doiDien[v.b[0]], doiDien[v.b[1]]]
  const dapTxt = [cs[dap[0]], cs[dap[1]], cs[dap[2]]]
  const dungThe = [cs[dap[0]], cs[dap[1]], cs[dap[2]]]
  // thẻ: bốn cạnh, thêm lặp những thẻ dùng 2 lần, xáo cố định theo i
  const the = [...new Set(cs)]
  const rot = i % 4
  const theXep = [...the.slice(rot), ...the.slice(0, rot)]
  void dungThe
  return {
    ma: `P5-${i + 1}`, dang: DANG_HBH, loai: 'tra_loi_ngan', svgDe: hinhP5(v, false), svgDa: hinhP5(v, true),
    noi_dung: `Cho các thẻ sau: ${theXep.join('; ')}. Điền thẻ thích hợp vào chỗ chấm.\n\nHình bình hành ${M}${N}${P}${Q} có:\n\na) Cạnh ${cs[v.ss]} song song với cạnh ...\n\nb) ${cs[v.b[0]]} = ......... ; ${cs[v.b[1]]} = ...........`,
    dap_an: `a) ${dapTxt[0]}\nb) ${dapTxt[1]}; ${dapTxt[2]}`,
    loi_giai: [
      '**Phần 1. Hướng dẫn**',
      '**Mấu chốt:** Trong hình bình hành, hai cạnh đối diện vừa song song vừa bằng nhau; cạnh đối diện là hai cạnh không có chung đỉnh.',
      `**Bước 1.** Xác định cạnh đối diện của ${cs[v.ss]}: đó là cạnh không có chung đỉnh với nó.`,
      `**Bước 2.** Cạnh đối diện thì song song nên điền thẻ ${dapTxt[0]} vào câu a.`,
      `**Bước 3.** Với câu b, tìm cạnh đối diện của ${cs[v.b[0]]} và của ${cs[v.b[1]]}, hai cạnh đối diện có độ dài bằng nhau.`,
      '**Phần 2. Trình bày**',
      `a) Cạnh ${cs[v.ss]} song song với cạnh ${dapTxt[0]}.`,
      `b) Hai cạnh ${cs[v.b[0]]} và ${dapTxt[1]} là hai cạnh đối diện nên có độ dài bằng nhau: ${cs[v.b[0]]} = ${dapTxt[1]}.`,
      `Hai cạnh ${cs[v.b[1]]} và ${dapTxt[2]} là hai cạnh đối diện nên có độ dài bằng nhau: ${cs[v.b[1]]} = ${dapTxt[2]}.`,
    ].join('\n\n'),
  }
})

// ---- P6: đoạn EF song song cạnh đáy ----
const BIEN_P6 = [
  { n: ['A', 'B', 'C', 'D', 'E', 'F'], w: 5, a: 2, b: 2 },
  { n: ['M', 'N', 'P', 'Q', 'I', 'K'], w: 7, a: 2, b: 3 },
  { n: ['H', 'K', 'L', 'G', 'U', 'V'], w: 6, a: 4, b: 3 },
  { n: ['A', 'B', 'C', 'D', 'E', 'F'], w: 8, a: 3, b: 5 },
  { n: ['X', 'Y', 'Z', 'T', 'M', 'N'], w: 9, a: 4, b: 4 },
]
function hinhP6(v, dapAn) {
  const W = v.w * 5.2, H = 38, sh = 10, ox = 22, oy = 10
  const [A, B, C, D, E, F] = v.n
  const pts = parPts(ox, oy, W, H, sh) // TL=A, TR=B, BR=C, BL=D
  const t = v.a / (v.a + v.b)
  const lerp = (p, q, k) => [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k]
  const e = lerp(pts[0], pts[3], t), fp = lerp(pts[1], pts[2], t)
  let s = Pg(pts, { c: '#444', w: 0.6 }) + Ln(e, fp, { c: '#444', w: 0.6 })
  for (const p of [...pts, e, fp]) s += Dt(p, '#c00', 0.8)
  const c = cen(pts)
  s += Tx([pts[0][0] - 3, pts[0][1] - 2], A, { i: false, s: 5 }) + Tx([pts[1][0] + 3, pts[1][1] - 2], B, { i: false, s: 5 })
  s += Tx([pts[2][0] + 3, pts[2][1] + 5], C, { i: false, s: 5 }) + Tx([pts[3][0] - 3, pts[3][1] + 5], D, { i: false, s: 5 })
  s += Tx([e[0] - 4.2, e[1] + 1.8], E, { i: false, s: 5 }) + Tx([fp[0] + 4.2, fp[1] + 1.8], F, { i: false, s: 5 })
  s += Tx([mid(pts[0], pts[1])[0], pts[0][1] - 3], `${v.w} cm`, { b: false, i: false, s: 4.6 })
  s += Tx([mid(pts[0], e)[0] - 8, mid(pts[0], e)[1] + 1], `${v.a} cm`, { b: false, i: false, s: 4.6 })
  s += Tx([mid(e, pts[3])[0] - 8, mid(e, pts[3])[1] + 2], `${v.b} cm`, { b: false, i: false, s: 4.6 })
  if (dapAn) {
    s += Ln(e, fp, { c: '#0a7d34', w: 1.1 }) + Tx([mid(e, fp)[0], mid(e, fp)[1] + 5], `EF = ${v.w} cm`.replace('E', E).replace('F', F), { b: false, i: false, s: 4.4, c: '#0a7d34' })
    s += Tx([mid(pts[1], fp)[0] + 9, mid(pts[1], fp)[1] + 1], `${v.a} cm`, { b: false, i: false, s: 4.4, c: '#c2410c' }) + Tx([mid(fp, pts[2])[0] + 9, mid(fp, pts[2])[1] + 2], `${v.b} cm`, { b: false, i: false, s: 4.4, c: '#c2410c' })
  }
  void c
  return svgDoc(W + sh + ox + 24, H + 26, s)
}
const cauP6 = BIEN_P6.map((v, i) => {
  const [A, B, C, D, E, F] = v.n
  return {
    ma: `P6-${i + 1}`, dang: DANG_HBH, loai: 'tra_loi_ngan', svgDe: hinhP6(v, false), svgDa: hinhP6(v, true),
    noi_dung: `Cho hình bình hành ${A}${B}${C}${D}, đoạn thẳng ${E}${F} song song với ${A}${B} (xem hình). Điền số thích hợp vào ô trống:\n\na) ${E}${F} = … cm\n\nb) ${B}${F} = … cm ;  ${F}${C} = … cm`,
    dap_an: `a) ${v.w} cm\nb) ${v.a} cm; ${v.b} cm`,
    loi_giai: [
      '**Phần 1. Hướng dẫn**',
      `**Mấu chốt:** Đoạn ${E}${F} chia hình bình hành ${A}${B}${C}${D} thành hai hình bình hành nhỏ, nên các cạnh đối diện của mỗi hình nhỏ bằng nhau.`,
      `**Bước 1.** Nhìn hình ${A}${B}${F}${E}: có ${A}${B} // ${E}${F} và ${A}${E} // ${B}${F} nên đây là hình bình hành.`,
      `**Bước 2.** Cạnh đối diện của hình bình hành ${A}${B}${F}${E} bằng nhau: ${E}${F} = ${A}${B} và ${B}${F} = ${A}${E}.`,
      `**Bước 3.** Tương tự, ${E}${F}${C}${D} cũng là hình bình hành nên ${F}${C} = ${E}${D}; lấy số đo ${A}${B}, ${A}${E}, ${E}${D} trên hình để điền.`,
      '**Phần 2. Trình bày**',
      `Hình bình hành ${A}${B}${F}${E} có ${A}${B} = ${E}${F} và ${A}${E} = ${B}${F}.`,
      `Hình bình hành ${E}${F}${C}${D} có ${E}${F} = ${D}${C} và ${E}${D} = ${F}${C}.`,
      `a) ${E}${F} = ${v.w} cm`,
      `b) ${B}${F} = ${v.a} cm; ${F}${C} = ${v.b} cm`,
    ].join('\n\n'),
  }
})

// ================= hình thoi =================
// n = [A(trái), B(trên), C(phải), D(dưới)]
function thoiPts(p = 24, q = 15, ox = 14, oy = 10) { const cx = ox + p, cy = oy + q; return [[cx - p, cy], [cx, cy - q], [cx + p, cy], [cx, cy + q]] }
const canhThoi = (n) => [`${n[0]}${n[1]}`, `${n[1]}${n[2]}`, `${n[2]}${n[3]}`, `${n[3]}${n[0]}`] // AB, BC, CD, DA
const nhanThoi = (pts, n) => {
  const c = cen(pts)
  return pts.map((p, i) => Tx([p[0] + (i === 0 ? -4.5 : i === 2 ? 4.5 : 0), p[1] + (i === 1 ? -3 : i === 3 ? 7 : 2)], n[i], { i: false, s: 5.4 })).join('') + void c
}
function hinhThoi(n, { cheo = false, tag = null, dapAn = false, hl = [] } = {}) {
  const pts = thoiPts()
  let s = Pg(pts, { c: '#333', w: 0.6 })
  if (cheo) s += Ln(pts[0], pts[2], { c: '#333', w: 0.5 }) + Ln(pts[1], pts[3], { c: '#333', w: 0.5 })
  for (const [a, b, col] of hl) s += Ln(pts[a], pts[b], { c: col, w: 1.2 })
  if (dapAn && cheo) { const o = mid(pts[0], pts[2]); s += gocVuong(o, pts[1], pts[2], 2.8) }
  for (const p of pts) s += Dt(p, '#111', 0.8)
  s += nhanThoi(pts, n)
  if (tag) { const [k, t] = tag, m = mid(pts[k], pts[(k + 1) % 4]), c = cen(pts), u = [m[0] - c[0], m[1] - c[1]], l = Math.hypot(...u); s += Tx([m[0] + (u[0] / l) * 5.5, m[1] + (u[1] / l) * 5.5 + 2], t, { b: false, i: false, s: 4.8 }) }
  return svgDoc(76, 50, s)
}
const BIEN_THOI_N = [['A', 'B', 'C', 'D'], ['M', 'N', 'P', 'Q'], ['E', 'F', 'G', 'H'], ['K', 'L', 'I', 'O'], ['X', 'Y', 'Z', 'T']]
const xoayCanh = (cs, r) => [0, 1, 2, 3].map((k) => cs[(k + r) % 4])

// ---- H1: điền thẻ (song song, bằng nhau) ----
const cauH1 = BIEN_THOI_N.map((n, i) => {
  const cs = canhThoi(n), r = i % 4, [s0, s1, s2, s3] = xoayCanh(cs, r)
  const [N0, , N2] = [n[0], n[1], n[2]]
  void N0; void N2
  const the = [s0, s1, s2, s3, s3].map((x, k) => [x, (k * 7 + i) % 5]).sort((a, b) => a[1] - b[1]).map((x) => x[0])
  const hl = (da) => da ? [[0, 1, '#0a7d34'], [2, 3, '#0a7d34'], [1, 2, '#c2410c'], [3, 0, '#c2410c']] : []
  return {
    ma: `H1-${i + 1}`, dang: DANG_THOI, loai: 'tra_loi_ngan', svgDe: hinhThoi(n, {}), svgDa: hinhThoi(n, { hl: hl(true) }),
    noi_dung: `Cho các thẻ sau: ${the.join('; ')}. Điền thẻ thích hợp vào chỗ chấm.\n\nHình thoi ${n.join('')} có:\n\na) Cạnh ${s0} song song với cạnh ...\n\nb) Cạnh ${s1} song song với cạnh ...\n\nc) ${s0} = ... = ${s2} = ...`,
    dap_an: `a) ${s2}\nb) ${s3}\nc) ${s1}; ${s3}`,
    loi_giai: [
      '**Phần 1. Hướng dẫn**',
      '**Mấu chốt:** Hình thoi có hai cặp cạnh đối diện song song và bốn cạnh bằng nhau.',
      `**Bước 1.** Tìm cạnh đối diện của ${s0} và của ${s1} (cạnh đối diện là cạnh không có chung đỉnh).`,
      '**Bước 2.** Cạnh đối diện thì song song nên điền thẻ tương ứng vào câu a và b.',
      '**Bước 3.** Hình thoi có bốn cạnh bằng nhau nên ở câu c, điền hai cạnh còn lại để được dãy bốn cạnh bằng nhau.',
      '**Phần 2. Trình bày**',
      `a) Cạnh ${s0} song song với cạnh ${s2}.`,
      `b) Cạnh ${s1} song song với cạnh ${s3}.`,
      `c) Vì ${n.join('')} là hình thoi nên bốn cạnh bằng nhau:`,
      `${s0} = ${s1} = ${s2} = ${s3}.`,
    ].join('\n\n'),
  }
})

// ---- H2: độ dài cạnh + hai đường chéo vuông góc ----
const BIEN_H2 = [
  { k: 2, len: 4, chieu: 0 }, { k: 0, len: 6, chieu: 1 }, { k: 1, len: 5, chieu: 0 }, { k: 3, len: 7, chieu: 1 }, { k: 2, len: 3, chieu: 1 },
]
const cauH2 = BIEN_THOI_N.map((n, i) => {
  const v = BIEN_H2[i], cs = canhThoi(n), k = v.k
  const chain = [cs[(k + 2) % 4], cs[(k + 3) % 4], cs[k], cs[(k + 1) % 4]]
  const blanks = [chain[0], chain[1], chain[3]]
  const dg = [`${n[0]}${n[2]}`, `${n[1]}${n[3]}`]
  const hoi = dg[v.chieu], dapB = dg[1 - v.chieu]
  const the = [...blanks, dapB, cs[k]].map((x, j) => [x, (j * 3 + i) % 5]).sort((a, b) => a[1] - b[1]).map((x) => x[0])
  return {
    ma: `H2-${i + 1}`, dang: DANG_THOI, loai: 'tra_loi_ngan',
    svgDe: hinhThoi(n, { cheo: true, tag: [k, `${v.len} cm`] }), svgDa: hinhThoi(n, { cheo: true, tag: [k, `${v.len} cm`], dapAn: true, hl: [[0, 1, '#0a7d34'], [1, 2, '#0a7d34'], [2, 3, '#0a7d34'], [3, 0, '#0a7d34']] }),
    noi_dung: `Cho các thẻ sau: ${the.join('; ')}. Điền thẻ thích hợp vào chỗ chấm.\n\nHình thoi ${n.join('')} có ${cs[k]} = ${v.len} cm.\n\na) ... = ... = ${cs[k]} = ... = ${v.len} cm.\n\nb) ${hoi} vuông góc ...`,
    dap_an: `a) ${blanks.join('; ')}\nb) ${dapB}`,
    loi_giai: [
      '**Phần 1. Hướng dẫn**',
      '**Mấu chốt:** Hình thoi có bốn cạnh bằng nhau và hai đường chéo vuông góc với nhau.',
      `**Bước 1.** Hình thoi ${n.join('')} có bốn cạnh bằng nhau nên mọi cạnh đều dài bằng ${cs[k]} = ${v.len} cm.`,
      `**Bước 2.** Liệt kê ba cạnh còn lại ngoài ${cs[k]} để điền vào chỗ trống ở câu a.`,
      `**Bước 3.** Hai đường chéo ${dg[0]} và ${dg[1]} cắt nhau vuông góc, nên ${hoi} vuông góc với đường chéo còn lại.`,
      '**Phần 2. Trình bày**',
      `a) Vì ${n.join('')} là hình thoi nên bốn cạnh bằng nhau:`,
      `${chain.join(' = ')} = ${v.len} cm.`,
      `b) Hai đường chéo ${dg[0]} và ${dg[1]} vuông góc với nhau nên:`,
      `${hoi} vuông góc ${dapB}.`,
    ].join('\n\n'),
  }
})

// ---- H4: điền từ ----
const BIEN_H4 = [
  { a: ['song song', 0, 2], b: ['vuông góc', 0] },
  { a: ['song song', 1, 3], b: ['vuông góc', 1] },
  { a: ['bằng nhau', 0, 1], b: ['vuông góc', 0] },
  { a: ['bằng nhau', 3, 2], b: ['vuông góc', 1] },
  { a: ['song song', 3, 1], b: ['bằng nhau', 0, 'cc'] },
]
const cauH4 = BIEN_THOI_N.map((n, i) => {
  const v = BIEN_H4[i], cs = canhThoi(n), dg = [`${n[0]}${n[2]}`, `${n[1]}${n[3]}`]
  const hang = (arr) => ({ tu: arr[0], x: cs[arr[1]], y: cs[arr[2]] })
  const a = hang(v.a)
  let bx, by, btu
  if (v.b[2] === 'cc') { btu = 'bằng nhau'; bx = cs[1]; by = cs[2] } else { btu = 'vuông góc'; bx = dg[v.b[1]]; by = dg[1 - v.b[1]] }
  const lg = {
    'song song': `${a.x} // ${a.y} vì hai cạnh đối diện của hình thoi song song với nhau`,
    'bằng nhau': `${a.x} = ${a.y} vì hình thoi có bốn cạnh bằng nhau`,
  }
  return {
    ma: `H4-${i + 1}`, dang: DANG_THOI, loai: 'tra_loi_ngan', svgDe: hinhThoi(n, { cheo: true }), svgDa: hinhThoi(n, { cheo: true, dapAn: true }),
    noi_dung: `Điền từ thích hợp (song song, vuông góc, bằng nhau) vào chỗ chấm. Cho hình thoi ${n.join('')}:\n\na) ${a.x} ……………….. ${a.y}\n\nb) ${bx} ……………….. ${by}`,
    dap_an: `a) ${a.tu}\nb) ${btu}`,
    loi_giai: [
      '**Phần 1. Hướng dẫn**',
      '**Mấu chốt:** Hình thoi có hai cặp cạnh đối diện song song, bốn cạnh bằng nhau và hai đường chéo vuông góc với nhau.',
      `**Bước 1.** Xem ${a.x} và ${a.y} là hai cạnh đối diện hay hai cạnh kề nhau để biết chúng song song hay bằng nhau.`,
      `**Bước 2.** Xác định ${bx} và ${by} là hai cạnh hay hai đường chéo của hình thoi.`,
      '**Bước 3.** Nhớ tính chất tương ứng để điền từ thích hợp: cạnh đối song song; bốn cạnh bằng nhau; hai đường chéo vuông góc.',
      '**Phần 2. Trình bày**',
      `a) ${lg[a.tu]}.`,
      `Vậy điền: ${a.tu}.`,
      btu === 'vuông góc' ? `b) ${bx} và ${by} là hai đường chéo của hình thoi nên vuông góc với nhau.` : `b) ${bx} và ${by} là hai cạnh của hình thoi nên bằng nhau.`,
      `Vậy điền: ${btu}.`,
    ].join('\n\n'),
  }
})

// ================= gom + dựng =================
const cauP1 = BIEN_HBH.map((v, i) => cauChonHBH(`P1-${i + 1}`, v, 0))
const cauP4 = BIEN_HBH2.map((v, i) => cauChonHBH(`P4-${i + 1}`, v, 1))
const cauP3a = BIEN_P3.map((v, i) => cauP3(v, i))
const cauH3 = BIEN_THOI.map((v, i) => cauChonThoi(`H3-${i + 1}`, v, i % 2 ? 2 : 1))
const TAT_CA = { P1: cauP1, P2: cauP2, P3: cauP3a, P4: cauP4, P5: cauP5, P6: cauP6, H1: cauH1, H2: cauH2, H3: cauH3, H4: cauH4 }
const cau = MAU.flatMap((m) => TAT_CA[m])

// ================= render + upload =================
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
  const path = `hbh-thoi/${new Date().toISOString().slice(0, 7)}/${randomUUID()}.png`
  if (!GHI) return `dry://kho-anh/${path}`
  const { error } = await sb.storage.from('kho-anh').upload(path, buf, { contentType: 'image/png', upsert: false })
  if (error) throw new Error(`upload: ${error.message}`)
  return sb.storage.from('kho-anh').getPublicUrl(path).data.publicUrl
}

try {
  if (XEM) mkdirSync(XEM, { recursive: true })
  const cauList = []
  let daCo = new Set()
  if (!XEM) {
    const db0 = new pg.Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000 })
    await db0.connect()
    daCo = new Set((await db0.query('select ten_de_goc from dai_cau_hoi where xoa_at is null and ten_de_goc like $1', [`${TIEN_TO} · %`])).rows.map((r) => r.ten_de_goc))
    await db0.end()
  }
  for (const c of cau) {
    if (daCo.has(`${TIEN_TO} · ${c.ma}`)) continue
    const de = await png(c.svgDe), da = await png(c.svgDa)
    if (XEM) { writeFileSync(`${XEM}/${c.ma}-de.png`, de); writeFileSync(`${XEM}/${c.ma}-da.png`, da); continue }
    cauList.push({
      dang_chinh: c.dang, loai_cau: c.loai, noi_dung: c.noi_dung, lua_chon: c.lua_chon ?? null, dap_an: c.dap_an, loi_giai: c.loi_giai,
      anh_de: await up(de), anh_dap_an: await up(da), nguon: 'le', nguon_giai: 'nguoi', ten_de_goc: `${TIEN_TO} · ${c.ma}`,
    })
  }
  if (XEM) console.log(`Đã xuất ${cau.length * 2} ảnh vào ${XEM}`)
  else {
    const db = new pg.Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000 })
    await db.connect()
    await db.query('begin')
    try {
      if (!cauList.length) throw new Error('Không còn câu nào cần ghi')
      const { maCauList, trung } = await insertCauBatch({ client: db, subject: 'dai', cauList, choTrung: true })
      console.log(`${maCauList.length} mã: ${maCauList[0]} … ${maCauList.at(-1)}${trung.length ? ' · trùng ' + JSON.stringify(trung) : ''}`)
      await db.query(GHI ? 'commit' : 'rollback')
      console.log(GHI ? '✅ ĐÃ GHI' : '↩ chạy thử, ROLLBACK')
    } catch (e) { await db.query('rollback'); throw e } finally { await db.end() }
  }
} finally { await br.close() }
