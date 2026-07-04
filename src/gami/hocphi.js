// ============================================================================
// hocphi.js — ENGINE HỌC PHÍ (PURE, không I/O). Test: node scripts/verify_hocphi.mjs
// Spec: spec-hocphi.md. Hệ số = tài sản GIA ĐÌNH (tính theo n_con/n_con_3mon,
// đóng dấu y nhau lên MỌI con của PH đó — recompute ở lib/hocphi.ts khi đổi ghi danh).
// ============================================================================

// Hệ số học phí gia đình (Thùy chốt §4):
//  < 2 con: 1.00 · ≥2 con & ≥2 con học ≥3 môn: 0.90 · ≥2 con (còn lại): 0.95.
export function tinhHeSoGiaDinh(nCon, nCon3Mon) {
  if (nCon < 2) return 1.0
  if (nCon3Mon >= 2) return 0.9
  return 0.95
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
