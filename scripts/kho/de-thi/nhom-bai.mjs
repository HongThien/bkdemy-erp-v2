// nhom-bai.mjs — tính các NHÓM BÀI của một đề: nhiều câu kho (đã tách ý) cùng thuộc MỘT bài của đề gốc (Bài 2a, 2b, 2c, 2d → "Bài 2").
// Đề giữ CẤU TRÚC GỐC (Bài 2 có 4 ý); kho thì tách thành 4 câu riêng (CEO 13/10: "vào kho thì mới tách thành 4 bài khác nhau").
// Kết quả lưu ở cau_hinh.deThi.nhomBai = [{ nhan:'Bài 2', dan:'Thu gọn …:', cau:[{ ma_cau, y:'a' }, …] }, …] (đúng thứ tự trong đề).
//
//   tinhNhomBai([{ nhan, noi_dung, ma_cau }]) → { nhomBai, canhBao[] }
// Nhãn ý: "Bài 2a" · "Câu 9b" · "Bài 23 (B)". Nhóm = ≥ 2 câu LIÊN TIẾP cùng bài, MỌI câu đều có ý.
// Lời dẫn (`dan`) = tiền tố chung của nội dung các ý, cắt về cuối cụm ": " (nếu có) hoặc cuối câu ". " — và PHẢI là tiền tố thật của
// từng câu (còn phần dư không rỗng), không thì bỏ cả nhóm (để nguyên từng câu) và ghi cảnh báo.
const RE_Y = /^((?:Bài|Câu) \d+)\s*(?:\(([A-Za-z])\)|([a-z]))$/

const tienToChung = (xs) => {
  let p = xs[0] ?? ''
  for (const s of xs.slice(1)) { let i = 0; while (i < p.length && i < s.length && p[i] === s[i]) i++; p = p.slice(0, i) }
  return p
}
const catLoiDan = (p) => {
  const i = p.lastIndexOf(': '), j = p.lastIndexOf('. ')
  const k = i >= 0 ? i + 1 : j >= 0 ? j + 1 : -1
  if (k > 0) return p.slice(0, k).trim()
  const m = p.lastIndexOf(' $') // lời dẫn không dấu câu ("Tính giá trị biểu thức $B=…$" / "$D=…$"): cắt trước công thức đầu tiên
  return m > 0 ? p.slice(0, m).trim() : ''
}

export function tinhNhomBai(cau) {
  const nhomBai = [], canhBao = []
  let i = 0
  while (i < cau.length) {
    const m = RE_Y.exec(cau[i].nhan ?? '')
    if (!m) { i++; continue }
    let j = i
    while (j + 1 < cau.length) { const n = RE_Y.exec(cau[j + 1].nhan ?? ''); if (n && n[1] === m[1]) j++; else break }
    if (j > i) {
      const mem = cau.slice(i, j + 1)
      const ys = mem.map((c) => { const t = RE_Y.exec(c.nhan); return t[2] ?? t[3] })
      const dan = catLoiDan(tienToChung(mem.map((c) => c.noi_dung ?? '')))
      const du = mem.map((c) => (dan && c.noi_dung.startsWith(dan) ? c.noi_dung.slice(dan.length).trim() : null))
      if (!dan || du.some((x) => !x)) canhBao.push(`${m[1]}: không tách được lời dẫn chung (${mem.length} câu) — để nguyên từng câu`)
      else nhomBai.push({ nhan: m[1], dan, cau: mem.map((c, k) => ({ ma_cau: c.ma_cau, y: ys[k] })) })
    }
    i = j + 1
  }
  return { nhomBai, canhBao }
}
