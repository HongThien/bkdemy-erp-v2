// Thư viện tạm — bóc câu K10 Vectơ từ .txt do scripts/kho/mathtype-thu/doc-docx.mjs trích ra.
import { readFileSync } from 'node:fs'

export function docDong(file) {
  return readFileSync(file, 'utf8').split(/\r?\n/).map((l) => l.replace(/^\[\d{4}\]\s?/, ''))
}

/** Lấy danh sách ảnh trong 1 dòng thô, rồi trả dòng đã bỏ ảnh */
export function tachAnh(raw) {
  const imgs = []
  const s = raw.replace(/\[\[img:([^\]]+)\]\]/g, (_, n) => { imgs.push(n); return '' })
  return { s, imgs }
}

/** bỏ thẻ định dạng; giữ nội dung */
export function sach(s) {
  return s
    .replace(/\[\[(?:\/?(?:b|u|i|nen|mau|sym)(?::[^\]]*)?)\]\]/g, '')
    .replace(/\[\[sym:[^\]]*\]\]/g, '')
    .replace(/\t+/g, ' ')
    .replace(/ /g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .trim()
}

/** che $...$ để tìm mốc ngoài công thức */
export function che(s) {
  return s.replace(/\$[^$]*\$/g, (m) => '\u0001'.repeat(m.length))
}

/** chuẩn hoá công thức nhẹ: "Tồng"… không sửa chữ; chỉ sửa khoảng trắng kề $ */
export function chuanCT(s) {
  return s
    .replace(/\$\s+/g, '$').replace(/\s+\$/g, ' $') // bỏ khoảng trắng trong $ ... $ ở mép (sơ bộ)
}

/** khoá so trùng: chữ + toán chuẩn hoá mạnh */
export function khoaTrung(s) {
  return String(s ?? '')
    .toLowerCase()
    .replace(/\\overrightarrow|\\vec|\\overset\{\\rightarrow\}/g, 'V')
    .replace(/\\dfrac|\\tfrac/g, '\\frac')
    .replace(/\\left|\\right|\\,|\\;|\\!|\\ |\\text\{[^}]*\}|\\mathrm/g, '')
    .replace(/[\s$.,;:{}()\\]/g, '')
}
