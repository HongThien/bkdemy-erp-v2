// Parser cho spec-format-noidung.md — tách 1 chuỗi lý thuyết PHẲNG (noi_dung: text, gõ tay trong
// LyThuyetModal, src/screens/kho/BanDo.tsx) thành các KHỐI theo kí hiệu đầu dòng kiểu admonition
// (MkDocs/Docusaurus). KHÔNG phân biệt môn — dùng chung cho cả 4 bảng lý thuyết (Đại/HGT/KHTN/Hình),
// đúng luật đối xứng §1.6 CLAUDE.md. Dùng ở 2 nơi: preview trong LyThuyetModal (screens/kho/ui.tsx) và
// render PDF (LyThuyetBody, screens/tailieu/PrintView.tsx).

export type LyThuyetBlockLoai = 'text' | 'dinh_ly' | 'dinh_nghia' | 'tinh_chat' | 'chu_y' | 'phuong_phap' | 'vi_du' | 'nhan_xet'
export type LyThuyetBlock = { loai: LyThuyetBlockLoai; tieuDe: string; noiDung: string }

// Kí hiệu đứng đầu dòng đầu tiên của 1 đoạn (đoạn = tách bởi dòng trống, đúng quy ước ngắt đoạn lý
// thuyết đã có sẵn — không đổi thói quen soạn). Phần còn lại trên CÙNG dòng kí hiệu = tiêu đề (tuỳ chọn).
// Hỗ trợ cả bản không dấu (##DL/##DN) phòng khi gõ nhanh/thiết bị không gõ được "Đ" ngay.
const MARKER_LOAI: [string, LyThuyetBlockLoai][] = [
  ['##ĐL', 'dinh_ly'], ['##DL', 'dinh_ly'],
  ['##ĐN', 'dinh_nghia'], ['##DN', 'dinh_nghia'],
  ['##TC', 'tinh_chat'],
  ['##CY', 'chu_y'],
  ['##PP', 'phuong_phap'],
  ['##VD', 'vi_du'],
  ['##NX', 'nhan_xet'],
]

// Nhãn ĐÃ CÓ SẴN trong chính văn bản gốc (kiểu "Ví dụ 1.", "Định lý 2:"...) — quy ước viết sách rất phổ
// biến, AI OCR hay giữ nguyên khi bóc. Nếu marker KHÔNG có tiêu đề riêng (đầu dòng chỉ có ##VD trần),
// tự bóc nhãn này ra làm tiêu đề khung + xoá khỏi thân để KHÔNG hiện lặp 2 lần (1 lần ở khung, 1 lần
// trong đề) — xem BanDo.tsx report 26/09 ("Ví dụ" hiện cả ở tag lẫn trong đề).
const LEADING_LABEL_RE: Partial<Record<LyThuyetBlockLoai, RegExp>> = {
  vi_du: /^(Ví dụ\s*\d*)\s*[.:]?\s*/i,
  dinh_ly: /^(Định lý\s*\d*)\s*[.:—-]?\s*/i,
  dinh_nghia: /^(Định nghĩa\s*\d*)\s*[.:—-]?\s*/i,
  tinh_chat: /^(Tính chất\s*\d*)\s*[.:—-]?\s*/i,
  chu_y: /^(Chú ý|Lưu ý)\s*[.:]?\s*/i,
  nhan_xet: /^(Nhận xét)\s*[.:]?\s*/i,
}

export function parseLyThuyetBlocks(text: string): LyThuyetBlock[] {
  const doans = (text || '').split(/\n[ \t]*\n/).map((d) => d.trim()).filter(Boolean)
  return doans.map((doan) => {
    const lines = doan.split('\n')
    const dongDau = lines[0].trim()
    const found = MARKER_LOAI.find(([ky]) => dongDau.toUpperCase().startsWith(ky.toUpperCase()))
    if (!found) return { loai: 'text', tieuDe: '', noiDung: doan }
    const [ky, loai] = found
    let tieuDe = dongDau.slice(ky.length).trim()
    let than = lines.slice(1).join('\n').trim()
    if (!tieuDe) {
      const re = LEADING_LABEL_RE[loai]
      const m = re ? than.match(re) : null
      if (m) { tieuDe = (m[1] ?? m[0]).trim(); than = than.slice(m[0].length).trim() }
    }
    return { loai, tieuDe, noiDung: than }
  })
}

// ##PP riêng 1 quy tắc (spec §1): mỗi DÒNG không trống trong thân khối = 1 bước — tự đánh số + nối
// timeline khi render, không cần gõ số ①②③ tay.
export function splitPhuongPhapBuoc(noiDung: string): string[] {
  return noiDung.split('\n').map((l) => l.trim()).filter(Boolean)
}

// ##VD riêng 1 quy tắc (CEO chốt 26/09): CHỈ đề bài nằm trong khung, "Lời giải" đứng NGOÀI khung (plain).
// Tách tại dòng bắt đầu bằng "Lời giải"/"Bài giải"/"Giải" + dấu . hoặc : ngay sau (tránh khớp nhầm câu
// văn kiểu "Giải phương trình..." — vốn không có dấu câu ngay sau "Giải").
const LOI_GIAI_RE = /^[ \t]*(Lời giải|Bài giải|Giải)\s*[.:]/im
export function splitViDu(noiDung: string): { de: string; loiGiai: string } {
  const m = LOI_GIAI_RE.exec(noiDung)
  if (!m) return { de: noiDung, loiGiai: '' }
  return { de: noiDung.slice(0, m.index).trim(), loiGiai: noiDung.slice(m.index).trim() }
}
