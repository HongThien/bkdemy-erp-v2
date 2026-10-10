// PHÂN XỬ các câu máy so ba nguồn báo LỆCH (bản soạn ≠ người kiểm tự tính) — bộ CLC lớp 6.
// Opus xem từng câu: đề, lời giải soạn, ghi chú kiểm. ket:
//   'giu_soan' — bản soạn đúng (cùng giá trị khác cách viết, hoặc người kiểm / sách sai) ⇒ ghi như bản soạn
//   'ceo'      — đề mơ hồ, hai cách hiểu cho hai đáp số ⇒ ghi theo bản soạn hiện có, đưa vào danh sách CEO chốt
// Câu phải SỬA bản soạn thì không ghi ở đây: sửa xong, máy so lại sẽ tự khớp.
export const PHAN_XU = {
  // ── cùng giá trị, khác cách viết
  'NTL 2024 · P2.2': { ket: 'giu_soan', ly_do: 'cùng 100/3; 3/2; 3/2 (làm theo đề in AM = 2/3 AD; sách giải theo 2/5 — đã ghi ở sua-de.mjs)' },
  'NS 2020 · 15': { ket: 'giu_soan', ly_do: 'cùng dấu <' },
  'NS-HB1 · P1.2': { ket: 'giu_soan', ly_do: '16 4/11 phút = 3/11 giờ' },
  'NS-HB1 · P2.1': { ket: 'giu_soan', ly_do: 'b) 3 3/560 giờ = 1683/560 giờ; sách làm tròn 3 giờ (số liệu đề không tròn)' },
  'ARC 2021-NC · 14': { ket: 'giu_soan', ly_do: 'cùng 774 chữ số, số lớn nhất 223 chữ số 9 rồi 662' },

  // ── bản soạn đúng, người kiểm theo sách mà sách sai
  'ARC 2022-CB · 46': { ket: 'giu_soan', ly_do: 'Mỗi lớp ăn 20/3 kg; 5A nhường 16/3 kg, 5B nhường 4/3 kg ⇒ 800 000 chia 4 : 1 ⇒ 5A nhận 640 000 (B). Sách chọn C = 480 000 là chia theo số kem MANG ĐI (12 : 8) — sai, vì 5A, 5B cũng ăn phần của mình.' },

  // ── đề mơ hồ — CEO chốt
  'NS 2025 · P2.3': { ket: 'ceo', ly_do: 'a) đếm mọi cỡ tam giác = 27 (bản soạn) hay chỉ tam giác cạnh 1 cm = 16 (sách). b) sách không nêu số; bản soạn: còn ít nhất 16 hình.' },
}
