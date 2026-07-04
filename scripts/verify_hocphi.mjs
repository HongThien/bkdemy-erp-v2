// Test thuần engine hocphi.js (node, không cần DB). Chạy: node scripts/verify_hocphi.mjs
import { tinhHeSoGiaDinh, lamTron1000, thanhTienHocPhi, thanhTienHocDuoi, canXetDuyetNghi30 } from '../src/gami/hocphi.js'

let ok = 0, fail = 0
function eq(label, got, want) {
  const pass = JSON.stringify(got) === JSON.stringify(want)
  if (pass) ok++; else { fail++; console.log(`✗ FAIL ${label}: got ${JSON.stringify(got)} want ${JSON.stringify(want)}`) }
}

// hệ số gia đình
eq('1 con → 1.00', tinhHeSoGiaDinh(1, 0), 1.0)
eq('2 con, 0 học ≥3 môn → 0.95', tinhHeSoGiaDinh(2, 0), 0.95)
eq('2 con, 1 học ≥3 môn → 0.95 (chưa đủ 2)', tinhHeSoGiaDinh(2, 1), 0.95)
eq('2 con, cả 2 học ≥3 môn → 0.90', tinhHeSoGiaDinh(2, 2), 0.9)
eq('3 con, 2 đứa ≥3 môn + 1 đứa 1 môn → 0.90 cả 3', tinhHeSoGiaDinh(3, 2), 0.9)
eq('4 con, chỉ 1 đứa ≥3 môn → 0.95 (không đủ 2)', tinhHeSoGiaDinh(4, 1), 0.95)
eq('0 con → 1.00', tinhHeSoGiaDinh(0, 0), 1.0)

// làm tròn
eq('làm tròn 1.000đ (1234500)', lamTron1000(1234500), 1235000)
eq('làm tròn 1.000đ (999499)', lamTron1000(999499), 999000)

// thành tiền học phí
eq('200k × 8 buổi × 1.00', thanhTienHocPhi(200000, 8, 1.0), 1600000)
eq('200k × 8 buổi × 0.90', thanhTienHocPhi(200000, 8, 0.9), 1440000)
eq('180k × 7 buổi × 0.95 (làm tròn)', thanhTienHocPhi(180000, 7, 0.95), 1197000) // 1197000 chẵn, không cần làm tròn thực tế nhưng test qua hàm

// thành tiền đuổi (KHÔNG nhân hệ số)
eq('đuổi 250k × 2 buổi', thanhTienHocDuoi(250000, 2), 500000)
eq('đuổi 150k × 3 buổi', thanhTienHocDuoi(150000, 3), 450000)

// xét duyệt 30%
eq('nghỉ 3/8 = 37.5% → xét duyệt', canXetDuyetNghi30(3, 8), true)
eq('nghỉ 2/8 = 25% → KHÔNG xét duyệt', canXetDuyetNghi30(2, 8), false)
eq('nghỉ 0 buổi lớp (chưa mở buổi nào) → false', canXetDuyetNghi30(0, 0), false)
eq('nghỉ đúng ngưỡng 30% (2.4/8=30%)', canXetDuyetNghi30(2.4, 8), true)

console.log(`\n${ok} pass, ${fail} fail`)
if (fail > 0) process.exit(1)
