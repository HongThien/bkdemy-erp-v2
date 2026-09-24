// Parser cho spec-format-noidung.md — tách 1 chuỗi lý thuyết PHẲNG (noi_dung: text, gõ tay trong
// LyThuyetModal, src/screens/kho/BanDo.tsx) thành các KHỐI theo kí hiệu đầu dòng kiểu admonition
// (MkDocs/Docusaurus). KHÔNG phân biệt môn — dùng chung cho cả 4 bảng lý thuyết (Đại/HGT/KHTN/Hình),
// đúng luật đối xứng §1.6 CLAUDE.md. Dùng ở 2 nơi: preview trong LyThuyetModal (screens/kho/ui.tsx) và
// render PDF (LyThuyetBody, screens/tailieu/PrintView.tsx).

export type LyThuyetBlockLoai = 'text' | 'dinh_ly' | 'dinh_nghia' | 'chu_y' | 'phuong_phap' | 'vi_du' | 'nhan_xet'
export type LyThuyetBlock = { loai: LyThuyetBlockLoai; tieuDe: string; noiDung: string }

// Kí hiệu đứng đầu dòng đầu tiên của 1 đoạn (đoạn = tách bởi dòng trống, đúng quy ước ngắt đoạn lý
// thuyết đã có sẵn — không đổi thói quen soạn). Phần còn lại trên CÙNG dòng kí hiệu = tiêu đề (tuỳ chọn).
// Hỗ trợ cả bản không dấu (##DL/##DN) phòng khi gõ nhanh/thiết bị không gõ được "Đ" ngay.
const MARKER_LOAI: [string, LyThuyetBlockLoai][] = [
  ['##ĐL', 'dinh_ly'], ['##DL', 'dinh_ly'],
  ['##ĐN', 'dinh_nghia'], ['##DN', 'dinh_nghia'],
  ['##CY', 'chu_y'],
  ['##PP', 'phuong_phap'],
  ['##VD', 'vi_du'],
  ['##NX', 'nhan_xet'],
]

export function parseLyThuyetBlocks(text: string): LyThuyetBlock[] {
  const doans = (text || '').split(/\n[ \t]*\n/).map((d) => d.trim()).filter(Boolean)
  return doans.map((doan) => {
    const lines = doan.split('\n')
    const dongDau = lines[0].trim()
    const found = MARKER_LOAI.find(([ky]) => dongDau.toUpperCase().startsWith(ky.toUpperCase()))
    if (!found) return { loai: 'text', tieuDe: '', noiDung: doan }
    const [ky, loai] = found
    const tieuDe = dongDau.slice(ky.length).trim()
    const than = lines.slice(1).join('\n').trim()
    return { loai, tieuDe, noiDung: than }
  })
}

// ##PP riêng 1 quy tắc (spec §1): mỗi DÒNG không trống trong thân khối = 1 bước — tự đánh số + nối
// timeline khi render, không cần gõ số ①②③ tay.
export function splitPhuongPhapBuoc(noiDung: string): string[] {
  return noiDung.split('\n').map((l) => l.trim()).filter(Boolean)
}
