// phan-loai-dang.mjs — ĐỘ KHÓ (muc_do 1–5) và NGUỒN TẠO DẠNG của từng dạng bài, chương Vectơ K12. SƠ BỘ 22/10 — một trạm kiểm lại theo hồ sơ nguồn (ho-so/).
// DO_KHO: để trống = dùng độ khó ghi trong cau-truc.mjs (đề xuất CTO); điền mã dạng → số 1–5 để ghi đè.
// NGUON: nhân chứng — T Từ Tâm · N NBV · P PNL · Đ đề thi (bản đồ cũ T1120701–T1120703: dạng cũ tương ứng có câu nằm trong đề thi K12 trên ERP, xem ho-so/de-erp-theo-nhom-cu.txt).
//   Có Đ ⇒ có trong đề thi. Không có Đ ⇒ "chỉ có ở sách". '' ⇒ chưa đối chiếu.
// KIỂM 22/10: Đ xét theo NỘI DUNG câu nguon_loai='de_thi' của từng nhóm cũ (nhóm cũ T112070301 = "túi" 184 câu gồm cả hình chiếu/đối xứng/i-j-k/gắn hệ trục) chứ không chỉ theo tên nhóm. Đ YẾU (1–3 câu/ý): P1.1.1 · P1.3.2 · P2.1.1 · P3.3.2 · P3.3.3 · P3.5.1 · P3.5.2 · P3.5.3. Xem ho-so/bao-cao-kiem-nguon.md.
export const DO_KHO = { 'P1.2.5': 2, 'P1.4.3': 2, 'P1.5.2': 2, 'P2.2.3': 3 }
export const NGUON = {
  'P1.1.1': 'TNPĐ', 'P1.1.2': 'TNPĐ',
  'P1.2.7': 'TNP', 'P1.4.6': 'TNPĐ', 'P3.2.5': 'NPĐ',
  'P1.2.1': 'TNPĐ', 'P1.2.2': 'TNPĐ', 'P1.2.3': 'TNPĐ', 'P1.2.4': 'TNP', 'P1.2.5': 'TNPĐ', 'P1.2.6': 'TNPĐ',
  'P1.3.1': 'NP', 'P1.3.2': 'TNPĐ',
  'P1.4.1': 'TNPĐ', 'P1.4.2': 'TNPĐ', 'P1.4.3': 'TNPĐ', 'P1.4.4': 'NPĐ', 'P1.4.5': 'NP',
  'P1.5.1': 'TNPĐ', 'P1.5.2': 'TNP',
  'P2.1.1': 'TNPĐ', 'P2.1.2': 'TNPĐ', 'P2.1.3': 'TNPĐ',
  'P2.2.1': 'TNPĐ', 'P2.2.2': 'TNPĐ', 'P2.2.3': 'TNPĐ',
  'P2.3.1': 'TNPĐ', 'P2.3.2': 'TNPĐ',
  'P3.1.1': 'TNPĐ', 'P3.1.2': 'TNPĐ', 'P3.1.3': 'TNP',
  'P3.2.1': 'TNPĐ', 'P3.2.2': 'TNPĐ', 'P3.2.3': 'TNPĐ', 'P3.2.4': 'TNPĐ',
  'P3.3.1': 'TNPĐ', 'P3.3.2': 'TNPĐ', 'P3.3.3': 'NPĐ',
  'P3.4.1': 'TNPĐ', 'P3.4.2': 'TNPĐ', 'P3.4.3': 'TNPĐ',
  'P3.5.1': 'NPĐ', 'P3.5.2': 'NPĐ', 'P3.5.3': 'NPĐ',
  'P3.6.1': 'TNPĐ', 'P3.6.2': 'TNPĐ', 'P3.6.3': 'NP',
  'P3.7.1': 'TNPĐ', 'P3.7.2': 'NPĐ', 'P3.7.3': 'TNPĐ',
}
export const TEN_KHO = { 1: 'đọc trực tiếp', 2: 'một quy trình quen', 3: 'quy trình + biến đổi', 4: 'tham số khó, nhiều bước', 5: 'nâng cao' }
const TEN = { T: 'Từ Tâm', N: 'NBV', P: 'PNL', 'Đ': 'đề thi' }
export function nguonCua(ma) {
  const s = NGUON[ma]
  if (!s) return { chu: 'chưa đối chiếu', loai: 'chua' }
  const ten = [...s].map((c) => TEN[c]).filter(Boolean).join(' · ')
  return { chu: ten, loai: s.includes('Đ') ? (/[TNP]/.test(s) ? 'ca_hai' : 'chi_de_thi') : 'chi_sach' }
}
