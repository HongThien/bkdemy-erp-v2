// ============================================================================
// hocphi.js — ENGINE HỌC PHÍ (PURE, không I/O). Test: node scripts/verify_hocphi.mjs
// Spec: spec-hocphi.md. Hệ số = thông tin CỦA HỌC SINH (Thùy chốt 07-05, KHÔNG phải
// tài sản gia đình dùng chung) — hệ thống GỢI Ý (pure-derive, tính lúc đọc), Nhân sự
// XÁC NHẬN mới ghi vào hoc_sinh.he_so_hoc_phi (người-trong-vòng-lặp, không auto-ghi).
// ============================================================================

// Hệ số gợi ý cho 1 học sinh (Thùy chốt 07-05):
//  - Học sinh học ≥2 môn: giảm 5%.
//  - PH có ≥2 con CÙNG học chung ít nhất 1 môn: giảm thêm 5% (áp cho các con liên quan).
//  → gộp cả 2: 1 PH có 2 con, mỗi con học 2 môn (trùng nhau) → mỗi con giảm 10%.
export function tinhHeSoHocSinh(soMon, coAnhChiEmCungMon) {
  let heSo = 1.0
  if (soMon >= 2) heSo -= 0.05
  if (coAnhChiEmCungMon) heSo -= 0.05
  return Math.round(heSo * 100) / 100
}

// Làm tròn 1.000đ (§2 công thức).
export function lamTron1000(n) {
  return Math.round(n / 1000) * 1000
}

// Thành tiền 1 dòng học phí (con·lớp·tháng).
export function thanhTienHocPhi(donGiaBuoi, soBuoi, heSo) {
  return lamTron1000(donGiaBuoi * soBuoi * heSo)
}

// Thành tiền học đuổi (KHÔNG nhân hệ số — §2/§6).
export function thanhTienHocDuoi(giaDuoi, soBuoi) {
  return lamTron1000(giaDuoi * soBuoi)
}

// Xét duyệt nghỉ ≥30%: buổi đuổi KHÔNG tính vào mẫu số (§5.1).
// soBuoiLop = buổi lớp trong tháng (đã trừ huỷ) · soBuoiNghi = buổi con vắng (vang + vang_phep).
export function canXetDuyetNghi30(soBuoiNghi, soBuoiLop) {
  if (soBuoiLop <= 0) return false
  return soBuoiNghi / soBuoiLop >= 0.3
}

// ── 2 CÔNG THỨC HỌC PHÍ CHÍNH (Thùy chốt 07-13) ─────────────────────────────
// CT1 (nghỉ ÍT, dưới 30% số buổi):  Học phí = Số buổi học CỦA LỚP × đơn giá × hệ số
//   (nghỉ ít vẫn đóng đủ theo lớp — công bằng vận hành, đỡ li ti từng buổi lẻ).
// CT2 (nghỉ NHIỀU, từ 30% trở lên): Học phí = (Số buổi HS học THỰC TẾ + Số buổi BÙ) × đơn giá × hệ số.
// Hệ thống ĐỀ XUẤT theo ngưỡng 30% (cùng ngưỡng canXetDuyetNghi30) — NGƯỜI DÙNG chọn lại được
// theo tình hình thực tế (người-trong-vòng-lặp chỗ tiền nhạy cảm, không auto).
export function deXuatCongThuc(soBuoiNghi, soBuoiLop) {
  return canXetDuyetNghi30(soBuoiNghi, soBuoiLop) ? 'ct2' : 'ct1'
}
export function thanhTienHocChinh(congThuc, { soBuoiLop, soBuoiDiHoc, soBuoiBu }, donGiaBuoi, heSo) {
  const soBuoi = congThuc === 'ct2' ? soBuoiDiHoc + soBuoiBu : soBuoiLop
  return lamTron1000(donGiaBuoi * soBuoi * heSo)
}
