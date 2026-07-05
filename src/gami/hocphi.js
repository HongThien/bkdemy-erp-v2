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
