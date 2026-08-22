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
//
// ⭐ CHIỀU THỜI GIAN (CEO 19/08: "câu hỏi thường sẽ có chiều thời gian") — 1 khuôn DÙNG CHUNG
// cho 4/5 công cụ (trừ hoc_tap_hoc_sinh, xem riêng): `tu_thang` (bắt buộc nếu có mốc) +
// `den_thang` (chỉ điền khi hỏi NHIỀU tháng/khoảng — "các tháng", "quý 3", "từ tháng X đến Y").
// Hỏi ĐÚNG 1 tháng → chỉ điền tu_thang. Không nói gì tới thời gian → bỏ trống cả hai, client
// tự hiểu là tháng hiện tại. KHÔNG BAO GIỜ suy đoán khoảng khi câu hỏi không nói khoảng.
const CHIEU_THOI_GIAN = {
  tu_thang: { type: 'string', description: 'Tháng bắt đầu, dạng YYYY-MM. Bỏ trống nếu câu hỏi không nhắc mốc thời gian nào (client tự hiểu = tháng hiện tại).' },
  den_thang: { type: 'string', description: 'Tháng kết thúc, dạng YYYY-MM — CHỈ điền khi câu hỏi rõ ràng muốn NHIỀU tháng ("các tháng", "quý 3", "từ tháng X đến tháng Y", "3 tháng gần đây"). Hỏi đúng 1 tháng thì bỏ trống, chỉ điền tu_thang.' },
}
// ============================================================================

export const TROLY_TOOLS = [
  {
    name: 'hoc_tap_hoc_sinh',
    mo_ta: 'Tra dữ liệu học tập (mastery theo dạng, ET/BTVN/MT, Elo, EXP) của MỘT học sinh cụ thể theo tên, tại 1 mốc tháng (không hỗ trợ khoảng nhiều tháng — số liệu vốn đã suy động từ mọi lần đo).',
    tham_so: {
      type: 'object',
      properties: {
        ten_hoc_sinh: { type: 'string', description: 'Tên học sinh, lấy nguyên văn từ câu hỏi (có thể không dấu/gõ tắt).' },
        mon: { type: 'string', enum: ['Toán', 'Văn', 'Anh', 'KHTN'], description: 'Môn học, nếu câu hỏi có nhắc tới. Bỏ trống nếu không rõ.' },
        thang: { type: 'string', description: 'Tháng dạng YYYY-MM, nếu câu hỏi hỏi về ĐÚNG 1 tháng cụ thể (vd "tháng trước"). Bỏ trống = suy động toàn bộ lịch sử tới hiện tại (mặc định, thường đúng ý hơn).' },
      },
      required: ['ten_hoc_sinh'],
    },
  },
  {
    name: 'ket_qua_btvn_lop',
    mo_ta: 'Tra kết quả BTVN (bài tập về nhà) của MỘT lớp — theo 1 tháng hoặc 1 khoảng nhiều tháng.',
    tham_so: {
      type: 'object',
      properties: {
        ten_lop: { type: 'string', description: 'Tên lớp, vd "8A1".' },
        ...CHIEU_THOI_GIAN,
        pham_vi: { type: 'string', enum: ['buoi_gan_nhat', 'ca_thang'], description: 'Chỉ 1 buổi gần nhất hay cả (các) tháng đã chọn. Bỏ trống = cả tháng.' },
      },
      required: ['ten_lop'],
    },
  },
  {
    name: 'ket_qua_mt_lop',
    mo_ta: 'Tra kết quả MT (bài kiểm tra định kỳ trong buổi) của MỘT lớp — theo 1 tháng hoặc 1 khoảng nhiều tháng (đúng nghĩa "các tháng").',
    tham_so: {
      type: 'object',
      properties: {
        ten_lop: { type: 'string', description: 'Tên lớp, vd "8A1".' },
        ...CHIEU_THOI_GIAN,
      },
      required: ['ten_lop'],
    },
  },
  {
    name: 'hoc_phi_hoc_sinh',
    mo_ta: 'Tra thông tin chi tiết học phí (học phí/học liệu/học đuổi/phát sinh/nợ) của MỘT học sinh — theo 1 tháng hoặc 1 khoảng nhiều tháng (mỗi tháng 1 phiếu riêng, không cộng dồn).',
    tham_so: {
      type: 'object',
      properties: {
        ten_hoc_sinh: { type: 'string', description: 'Tên học sinh, lấy nguyên văn từ câu hỏi.' },
        ...CHIEU_THOI_GIAN,
      },
      required: ['ten_hoc_sinh'],
    },
  },
  {
    name: 'tinh_trang_nhan_vien',
    mo_ta: 'Tra tình trạng làm việc / hiệu suất của MỘT nhân viên theo tên — theo 1 tháng hoặc 1 khoảng nhiều tháng.',
    tham_so: {
      type: 'object',
      properties: {
        ten_nhan_vien: { type: 'string', description: 'Tên nhân viên, lấy nguyên văn từ câu hỏi.' },
        ...CHIEU_THOI_GIAN,
      },
      required: ['ten_nhan_vien'],
    },
  },
]
