// Tách ĐỀ CỦA MỘT Ý (Hình–Học bài nhiều ý) thành các khúc GIẢ THIẾT / CÂU HỎI — chỉ để HIỂN THỊ (tô nền giả thiết, Thùy 16/11:
// "chỉ cần highlight để phân biệt giả thiết và câu hỏi"). Không đổi dữ liệu, không dùng cho nghiệp vụ. Không import gì (script kiểm chạy thẳng file này).
// Luật tách, theo TỪNG CÂU của đề ý:
//   · câu kết bằng "?"                         ⇒ câu hỏi
//   · câu có từ khoá yêu cầu (chứng minh, tính…) ⇒ phần đứng TRƯỚC từ khoá là giả thiết ("Kẻ DH ⊥ BC, chứng minh …"), từ từ khoá trở đi là câu hỏi
//   · câu không có từ khoá                      ⇒ giả thiết ("Gọi I là giao điểm của AH và BK.")
//   · CẢ đề ý không có từ khoá nào và không có "?" ⇒ coi cả đề là câu hỏi (ý là một mệnh đề cần chứng minh, lời dẫn đã ghi "Chứng minh:") — không tô gì
// Công thức $…$ được che lại trước khi tách nên dấu chấm / chữ trong công thức không làm lệch.
export type KhucDe = { gt: boolean; text: string }

const YEU_CAU = /(^|[\s,;:(])(chứng minh|chứng tỏ|cmr|c\/m|so sánh|tìm|hỏi|xác định|hãy|tính(?! chất)|giải thích|có nhận xét|nhận xét|vì sao|tại sao|từ đó|suy ra|kết luận|vẽ hình|kể tên|gọi tên|nêu|viết|điền|cần thêm điều kiện|là hình gì)/i

export function tachGiaThietCauHoi(cauHoi: string | null | undefined): KhucDe[] {
  const goc = (cauHoi ?? '').trim()
  if (!goc) return []
  const cong: string[] = []
  const an = goc.replace(/\$[^$]*\$/g, (x) => { cong.push(x); return `\u0001${cong.length - 1}\u0002` })
  const hien = (s: string) => s.replace(/\u0001(\d+)\u0002/g, (_, i) => cong[+i])
  const ra: KhucDe[] = []
  const them = (gt: boolean, text: string) => {
    const t = text.trim(); if (!t) return
    const cuoi = ra[ra.length - 1]
    if (cuoi && cuoi.gt === gt) cuoi.text += ' ' + t; else ra.push({ gt, text: t })
  }
  let coYeuCau = false
  for (const cau of an.split(/(?<=[.?!])\s+|\n+/)) {
    if (!cau.trim()) continue
    if (/\?\s*$/.test(cau)) { coYeuCau = true; them(false, cau); continue }
    const m = cau.match(YEU_CAU)
    if (!m) { them(true, cau); continue }
    coYeuCau = true
    const viTri = (m.index ?? 0) + m[1].length
    let truoc = cau.slice(0, viTri).trim().replace(/[\s,;:]+$/, '').replace(/\s+(rồi|và|khi đó|hãy)$/i, '').replace(/[\s,;:]+$/, '')
    if (truoc && !/[.?!]$/.test(truoc)) truoc += '.'
    them(true, truoc)
    const sau = cau.slice(viTri).trim()
    them(false, sau.charAt(0).toUpperCase() + sau.slice(1))
  }
  if (!coYeuCau) return [{ gt: false, text: goc }]
  return ra.map((k) => ({ gt: k.gt, text: hien(k.text) }))
}
