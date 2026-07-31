// ============================================================================
// giaoviec-config.ts — HẰNG SỐ + CÔNG THỨC chấm cho Giao việc & Hiệu suất v2.
// Spec §4.8: "Toàn bộ hằng số nằm 1 file config, KHÔNG hardcode rải rác."
// ⚠ Bản SQL của auto-close nằm ở function public.giaoviec_housekeeping()
//   (mig 202607311326) — nếu ĐỔI hằng số ở đây thì SỬA CẢ SQL đó cho khớp.
// ============================================================================

// ── HẰNG SỐ (§4.8 bảng mặc định) ────────────────────────────────────────────
export const GV = {
  TRE_MOI_NGAY: 10,              // điểm tiến độ trừ mỗi ngày trễ
  SAN_TIEN_DO: 40,               // sàn điểm tiến độ dù trễ bao lâu
  TRAN_TRA_LAI: [100, 85, 70],   // trần chất lượng theo 0 / 1 / ≥2 lần trả lại
  W_TIEN_DO: 0.3,                // trọng số tiến độ
  W_CHAT_LUONG: 0.7,             // trọng số chất lượng (nặng hơn — ẩu tệ hơn chậm)
  GIA_HAN_TOI_DA: 1,             // số lần gia hạn tối đa mỗi task
  TU_DONG_DONG_NGAY: 7,          // quá hạn nghiệm thu bao lâu thì tự đóng 'dat'
  HOLD_CANH_BAO_TUAN: 3,         // hold quá bao lâu thì đỏ
  NGU_DONG_THANG: 3,             // backlog nằm bao lâu thì tự ngủ đông
  TRAN_WIP_BACKLOG: 30,          // trần số item trong backlog
  CHU_KY_TRIAGE_TUAN: 2,         // nhịp triage
} as const

// ── CÔNG THỨC (§4.8) ────────────────────────────────────────────────────────

// Tiến độ (máy tính): d = số ngày trễ = max(0, ngay_nop − deadline).
// d=0 → 100; d>0 → max(SAN, 100 − TRE×d). Không có deadline ⇒ coi như đúng hạn.
export function tinhTienDo(deadline: string | null, ngayNop: string | null): number {
  if (!deadline || !ngayNop) return 100
  const d = Math.max(0, soNgayLech(deadline, ngayNop))
  if (d === 0) return 100
  return Math.max(GV.SAN_TIEN_DO, 100 - GV.TRE_MOI_NGAY * d)
}

// Trần chất lượng theo số lần trả lại (0/1/≥2 → 100/85/70).
export function tranChatLuong(soLanTraLai: number): number {
  return GV.TRAN_TRA_LAI[Math.min(Math.max(soLanTraLai, 0), GV.TRAN_TRA_LAI.length - 1)]
}

// Chất lượng thực = min(điểm leader chấm, trần theo số lần trả lại).
export function tinhChatLuong(diemLeader: number, soLanTraLai: number): number {
  return Math.min(diemLeader, tranChatLuong(soLanTraLai))
}

// Gộp: phan_tram = W_TIEN_DO×tien_do + W_CHAT_LUONG×chat_luong (1 chữ số thập phân).
export function gopPhanTram(tienDo: number, chatLuong: number): number {
  return Math.round((GV.W_TIEN_DO * tienDo + GV.W_CHAT_LUONG * chatLuong) * 10) / 10
}

// ── HELPER NGÀY/TUẦN (giờ VN — CLAUDE §2: KHÔNG toISOString/new Date('YYYY-MM-DD')) ──

// Hôm nay 'YYYY-MM-DD' giờ VN.
export const todayVN = (): string => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })

// Số ngày lệch b − a (a,b = 'YYYY-MM-DD'); dương nếu b sau a. Tính bằng UTC-midnight
// (không TZ-drift), format tay — không đụng ngày-local.
export function soNgayLech(a: string, b: string): number {
  const pa = a.split('-').map(Number), pb = b.split('-').map(Number)
  const ua = Date.UTC(pa[0], pa[1] - 1, pa[2]), ub = Date.UTC(pb[0], pb[1] - 1, pb[2])
  return Math.round((ub - ua) / 86400000)
}

// KỲ TUẦN = thứ 2 của tuần chứa 'YYYY-MM-DD' (mốc tính hiệu suất §4.2). Trả 'YYYY-MM-DD'.
export function kyTuanCuaNgay(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  const dow = dt.getUTCDay()               // 0=CN..6=T7
  dt.setUTCDate(dt.getUTCDate() + (dow === 0 ? -6 : 1 - dow))   // dời về thứ 2
  const yy = dt.getUTCFullYear(), mm = String(dt.getUTCMonth() + 1).padStart(2, '0'), dd = String(dt.getUTCDate()).padStart(2, '0')
  return `${yy}-${mm}-${dd}`
}

// Kỳ tuần hiện tại (thứ 2 của tuần này, giờ VN).
export const kyTuanHienTai = (): string => kyTuanCuaNgay(todayVN())

// Tháng 'YYYY-MM' của một kỳ tuần (để rollup tháng = Σ tuần).
export const thangCuaKyTuan = (kyTuan: string): string => kyTuan.slice(0, 7)

// Nhãn tuần đọc được: "Tuần 28/07" (thứ 2 → CN).
export function nhanKyTuan(kyTuan: string): string {
  const [, m, d] = kyTuan.split('-')
  return `Tuần ${d}/${m}`
}

// Số tuần đã trôi kể từ mốc (cho cảnh báo hold quá 3 tuần).
export function soTuanTuMoc(tuIso: string): number {
  return Math.floor(soNgayLech(tuIso.slice(0, 10), todayVN()) / 7)
}
