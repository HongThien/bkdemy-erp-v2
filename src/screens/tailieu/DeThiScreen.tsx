// Đề thi — màn danh sách + sửa đã chuyển sang KhoDeThi.tsx (Kho đề thi, spec-de-thi.md §10, CEO 01/10/2026).
// File này chỉ còn là lối vào cho các chỗ đang import tên cũ.
// ĐÃ GỠ 01/10 (CEO: "Xoá luôn đi — bỏ luồng nhập thẳng PDF ở đấy, đưa vào folder chỉ định và Claude chạy"):
//   NhapDeThiWizard ("Nhập đề thi từ PDF" — Gemini đọc trong trình duyệt, lỗi bịa câu khi lời giải tràn trang),
//   BocCauModal ("+ Bóc câu vào phần này"), bocDeTuFile, DungSaiBoc, và màn sửa đề cũ (DeThiEditor bản danh sách 1 dòng/câu).
// Code cũ còn trong lịch sử git (trước commit này). Prompt/schema bóc đề ở lib/kho/api.ts GIỮ (scripts/test-dethi-ingest.ts còn dùng).
export { default } from './KhoDeThi'
export { DeThiSoan as DeThiEditor } from './KhoDeThi'
