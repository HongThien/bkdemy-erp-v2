// ============================================================================
// DANH MỤC CÔNG CỤ TRA CỨU — "Phần 1 — Query" của trợ lý (CEO 18/08).
// File .mjs THUẦN (không TS, không import gì khác) vì được import ở CẢ HAI phía:
//   · worker/troly.mjs (Node)      — gửi danh mục này cho model chọn.
//   · src/lib/troly-tracuu.ts (Vite/browser) — đối chiếu tên công cụ trước khi chạy.
// Đổi 1 chỗ, cả 2 phía cùng thấy — không có bản sao thứ hai để lệch.
//
// ⭐ Model CHỈ chọn tên công cụ + điền tham số THÔ (tên người, tên lớp — lấy nguyên văn từ
// câu hỏi). KHÔNG bao giờ điền uuid/id — client tự tra tên → id (đúng luật "danh tính bám
// khoá tự nhiên", CLAUDE.md §2) và tự chạy query dưới ĐÚNG quyền người hỏi (client dùng
// session thật, bị RLS lọc — worker dùng service-role nên KHÔNG được tự trả data).
// ============================================================================

export const TROLY_TOOLS = [
  {
    name: 'hoc_tap_hoc_sinh',
    mo_ta: 'Tra dữ liệu học tập (mastery theo dạng, ET/BTVN/MT, Elo, EXP) của MỘT học sinh cụ thể theo tên.',
    tham_so: {
      type: 'object',
      properties: {
        ten_hoc_sinh: { type: 'string', description: 'Tên học sinh, lấy nguyên văn từ câu hỏi (có thể không dấu/gõ tắt).' },
        mon: { type: 'string', enum: ['Toán', 'Văn', 'Anh', 'KHTN'], description: 'Môn học, nếu câu hỏi có nhắc tới. Bỏ trống nếu không rõ.' },
      },
      required: ['ten_hoc_sinh'],
    },
  },
  {
    name: 'ket_qua_btvn_lop',
    mo_ta: 'Tra kết quả BTVN (bài tập về nhà) của MỘT lớp — buổi gần nhất hoặc cả tháng.',
    tham_so: {
      type: 'object',
      properties: {
        ten_lop: { type: 'string', description: 'Tên lớp, vd "8A1".' },
        thang: { type: 'string', description: 'Tháng dạng YYYY-MM. Bỏ trống = tháng hiện tại.' },
        pham_vi: { type: 'string', enum: ['buoi_gan_nhat', 'ca_thang'], description: 'Chỉ 1 buổi gần nhất hay cả tháng. Bỏ trống = cả tháng.' },
      },
      required: ['ten_lop'],
    },
  },
  {
    name: 'ket_qua_mt_lop',
    mo_ta: 'Tra kết quả MT (bài kiểm tra định kỳ trong buổi) của MỘT lớp theo tháng.',
    tham_so: {
      type: 'object',
      properties: {
        ten_lop: { type: 'string', description: 'Tên lớp, vd "8A1".' },
        thang: { type: 'string', description: 'Tháng dạng YYYY-MM. Bỏ trống = tháng hiện tại.' },
      },
      required: ['ten_lop'],
    },
  },
  {
    name: 'hoc_phi_hoc_sinh',
    mo_ta: 'Tra thông tin chi tiết học phí (học phí/học liệu/học đuổi/phát sinh/nợ) của MỘT học sinh theo tháng.',
    tham_so: {
      type: 'object',
      properties: {
        ten_hoc_sinh: { type: 'string', description: 'Tên học sinh, lấy nguyên văn từ câu hỏi.' },
        thang: { type: 'string', description: 'Tháng dạng YYYY-MM. Bỏ trống = tháng hiện tại.' },
      },
      required: ['ten_hoc_sinh'],
    },
  },
  {
    name: 'tinh_trang_nhan_vien',
    mo_ta: 'Tra tình trạng làm việc / hiệu suất theo tháng của MỘT nhân viên theo tên.',
    tham_so: {
      type: 'object',
      properties: {
        ten_nhan_vien: { type: 'string', description: 'Tên nhân viên, lấy nguyên văn từ câu hỏi.' },
        thang: { type: 'string', description: 'Tháng dạng YYYY-MM. Bỏ trống = tháng hiện tại.' },
      },
      required: ['ten_nhan_vien'],
    },
  },
]
