// 7 mức KẾT LUẬN dùng chung report tháng (bao_cao_ph.ket_luan_muc) và báo cáo học kì (bao_cao_ph_ky.ket_luan_muc).
// Tách khỏi ReportCard.tsx (06/11) để app giáo viên dùng mà không kéo theo html2canvas/mastery — khoá phải khớp CHECK ở DB.
export const MUC_HEX: Record<string, { bg: string; fg: string; emoji: string; label: string }> = {
  rat_tot: { bg: '#ecfdf5', fg: '#047857', emoji: '🌟', label: 'Con học rất tốt' },
  dat_yeu_cau: { bg: '#f0fdf4', fg: '#15803d', emoji: '✅', label: 'Con đạt yêu cầu' },
  tien_bo: { bg: '#f0f9ff', fg: '#0369a1', emoji: '📈', label: 'Con đang tiến bộ' },
  cai_thien_thai_do: { bg: '#fffbeb', fg: '#b45309', emoji: '⚠️', label: 'Con cần cải thiện thái độ học tập' },
  cai_thien_kien_thuc: { bg: '#fffbeb', fg: '#b45309', emoji: '⚠️', label: 'Con cần cải thiện kiến thức và kĩ năng' },
  van_de_thai_do: { bg: '#fff1f2', fg: '#be123c', emoji: '🆘', label: 'Con gặp vấn đề về thái độ học tập' },
  van_de_kien_thuc: { bg: '#fff1f2', fg: '#be123c', emoji: '🆘', label: 'Con gặp vấn đề về kiến thức và kĩ năng' },
}
