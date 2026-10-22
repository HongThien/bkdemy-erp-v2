# Báo cáo KIỂM nguồn + độ khó + độ phủ — cây Vectơ K12 (22/10)
Đ xét theo NỘI DUNG câu `nguon_loai='de_thi'` của từng nhóm cũ T11207xx (DB, đọc tay/regex), không chỉ theo tên nhóm: nhóm cũ **T112070301 là "túi" 184 câu** (đọc toạ độ i,j,k · hình chiếu/đối xứng · AB · gắn hệ trục hộp/chóp · cùng phương · vuông góc/góc), T112070101 gồm cả phân tích vectơ. Khớp file `de-erp-theo-nhom-cu.txt` ở 15/17 nhóm (T…101: 169 vs 175, T…105: 17 vs 25 vì thêm câu kho cũ). Bảng `toan_de_thi_cau` role CLI đọc 0 dòng nên không dò được trực tiếp. "Đ-yếu" = 1–3 câu/ý.
Ghép nhiều–một: T…101→P1.1.x,P1.2.x,P1.3.2 · T…102→P1.4.1–2 · T…103→P1.4.4 · T…107→P1.4.3 · T…109→P1.5.1 · T…201→P3.5.x · T…203→P2.3.x · T…301→P2.1.x,P2.2.x,P3.1.2,P3.2.1,P3.4.2–3 · T…302→P3.1.1 · T…303→P3.4.1 · T…304→P3.3.x · T…305→P3.2.2 · T…307→P3.2.3–4,P3.6.x · T…308→P2.2.x · T…311→P3.7.1–2 · T…312→P3.7.2–3. Nhóm cũ 0 đề thi (…108 đồng phẳng, …202, …310) chỉ là câu kho cũ.

| Dạng | Nguồn cũ → mới | Khó cũ → mới | Ghi chú |
|---|---|---|---|
| P1.1.1 | TNP → TNPĐ | 1 | Đ-yếu: ~8 ý Đ/S "bằng/đối nhau, cùng hướng" (101:073,156,161,205,209,219,226,232) |
| P1.1.2 | TNPĐ = | 2 | Đ: 101:105,107,177,182 (độ dài tổng trên lập phương) |
| P1.2.1 | TNPĐ = | 2 | hộp: ~70 câu đề thi |
| P1.2.2 | TNPĐ = | 2 | T chỉ Đ/S27 (ít) |
| P1.2.3 | TNPĐ = | 2 | |
| P1.2.4 | TNP = | 3 | KHÔNG Đ: đề thi không có câu "chứng minh", chỉ "chọn đẳng thức đúng" (đã tính vào .1–.3) |
| P1.2.5 | TNPĐ = | 3 → 2 | quy trình quen (T NB–TH, P TH) |
| P1.2.6 | NP → TNPĐ | 3 | T có (1D, VD3.2); Đ: ≥15 câu "Đặt a,b,c… phân tích/biểu diễn" nằm trong nhóm cũ T…101 |
| P1.3.1 | NP = | 3 | T không có (lý thuyết T bỏ đồng phẳng); không Đ |
| P1.3.2 | NP → TNPĐ | 4 | T có (1E TLN37); Đ-yếu: 101:181 (1 câu) |
| P1.4.1 | TNPĐ = | 2 | |
| P1.4.2 | TNPĐ = | 3 | |
| P1.4.3 | TNPĐ = | 3 → 2 | dời về cùng gốc = quy trình quen; T 1H NB–TH |
| P1.4.4 | TNPĐ → NPĐ | 2 | BỎ T: T không có kiểu "tìm góc từ a·b"; Đ: 103:034,036,038,042 |
| P1.4.5 | NP = | 4 | không Đ |
| P1.5.1 | TNPĐ = | 3 | |
| P1.5.2 | NPĐ → TNP | 3 → 2 | BỎ Đ: 0 câu "công" trong đề thi (grep toàn T11207); T có (TN24) |
| P2.1.1 | TNP → TNPĐ | 1 | Đ-yếu: 301:075 |
| P2.1.2 | TNP → TNPĐ | 2 | Đ: ~25 câu hình chiếu/đối xứng nằm ở T…301 |
| P2.1.3 | TNP → TNPĐ | 1 | Đ: ~45 câu i,j,k↔toạ độ ở T…301 |
| P2.2.1 | TNPĐ = | 3 | |
| P2.2.2 | TNPĐ = | 3 | |
| P2.2.3 | NP → TNPĐ | 4 → 3 | T có (2G TLN39,41); Đ: 301:045,173 · 308:018,023,024,025 · 304:052; sách rate TH–VD |
| P2.3.1 | TNPĐ = | 3 | |
| P2.3.2 | TNPĐ = | 3 | |
| P3.1.1 | TNPĐ = | 1 | |
| P3.1.2 | TNPĐ = | 2 | |
| P3.1.3 | TNPĐ → TNP | 2 | BỎ Đ: đề thi chỉ có "x=2a−b" (=.1), không có "tìm x từ đẳng thức" |
| P3.2.1 | TNP → TNPĐ | 1 | Đ: ~35 câu AB ở T…301 |
| P3.2.2 | TNPĐ = | 2 | |
| P3.2.3 | TNPĐ = | 2 | |
| P3.2.4 | NPĐ → TNPĐ | 3 | T có (3E,3D); Đ: 307:029,031,035,039,040,042 |
| P3.3.1 | TNPĐ = | 1 | |
| P3.3.2 | NPĐ → TNPĐ | 2 | T có (VD3.2, TN12 chu vi); Đ-yếu: 301:025 |
| P3.3.3 | NP → NPĐ | 3 | T không có; Đ-yếu: 301:016, 304:055 |
| P3.4.1 | TNPĐ = | 2 | |
| P3.4.2 | TNP → TNPĐ | 3 | Đ: 301:083,100 (+018,136) |
| P3.4.3 | NP → TNPĐ | 3 | T có (Đ/S20, VD5.2/5.4); Đ: 301:050,083,094,108,132 · 305:044 |
| P3.5.1 | TNP → NPĐ | 2 | BỎ T (T chỉ dùng [AB,AC]·AD 1 chỗ trong lời giải); Đ-yếu: 201:040 |
| P3.5.2 | NPĐ = | 3 | Đ-yếu: 201:041 |
| P3.5.3 | NPĐ = | 3 | Đ-yếu: 308:027 (1 câu) |
| P3.6.1 | TNPĐ = | 4 | Đ: 301:050,115,169 · 307:043,046 |
| P3.6.2 | NPĐ → TNPĐ | 4 | T có (2I TLN36, VD6.1); Đ: 301:097,116 · 308:025 |
| P3.6.3 | NPĐ → NP | 5 | BỎ Đ: 301:057, 311:042 có thể thuộc nhưng không chắc |
| P3.7.1 | NPĐ → TNPĐ | 3 | T có (2H TLN42); Đ: ~16 câu ở T…311 |
| P3.7.2 | NPĐ = | 4 | Đ: 311:042,048,049 · 312:015,017,019 · 203:018,023,027 |
| P3.7.3 | NPĐ → TNPĐ | 3 | T có (2H Đ/S32); Đ: 312:011,012,013,016,018,020 (lực; KHÔNG có công) |

## C. Độ phủ — kiểu trong chương nhưng cây chưa có dạng
1. **Tìm ĐIỂM thoả đẳng thức vectơ** (OM=2AB−AC; MA+2MB−MC=0; Σk·MA=0 tìm M): N ≈8 (C9 G4) · P ≈7 (B2D1 g, B3D1 e) · T 0 · Đ 3 (301:065, 305:058, 307:029). P3.1.3 chỉ nói tìm *vectơ*. → thêm dạng P3.2.5, hoặc mở rộng P3.1.3.
2. **Chứng minh vuông góc / góc hai đường chéo nhau bằng tích vô hướng** (tứ diện/chóp tổng quát, dữ kiện cạnh bằng nhau, góc đỉnh): T 4 (1J) · N ≈8 (B8 3d, C8 F1, D8 E1) · P ≈3 · kho cũ T…107:031–036. → thêm P1.4.x sau .3 (đáp án hay dồn 90°).
3. **Cùng phương / ba điểm thẳng hàng / tìm tỉ số trên hình khối** (MN∥BD′, mp(AMN)∩SC): T VD3.2 · N ≈4 · P ≈6 (B1D1 g,h). Mô tả nhóm P1.2 có nêu a=kb nhưng KHÔNG dạng nào. → thêm P1.2.7.
4. **Chân đường cao / chân phân giác trong**: T VD2.4 · N ≈3 (C9#24, E9 D, Đ1-III.4) · P ≈3 (B3D1 i, Đ03) · Đ 1 (307:026). → P3.2 hoặc bỏ.
5. **Hình thang / hình vuông cho diện tích, tìm đỉnh**: P ≈7 (B3D1 j,k, P3 C6,7,9, B3D2 l) · Đ 2 (307:034, 301:108). → P3.2/P3.5.
6. **Tâm ngoại tiếp / nội tiếp / trực tâm bằng toạ độ**: T 1 (3I) · N ≈5 (E9 D) · P ≈3 (B3D2 k) — kiến thức lớp 10, gần ngoài chương. → P3.6 hoặc bỏ.
7. Lẻ (≤5 câu, gộp được): rubik/CH₄/NH₃ tứ diện đều trọng tâm (N 2 · P 2 · Đ 1: 109:025 → P1.2.5) · cos²α+cos²β+cos²γ=1 (N 1) · S=½√(AB²AC²−(AB·AC)²) (P 1) · thang máy/chân bàn (N 2, → P1.1.1).
8. Đã phủ (không cần dạng mới): "toạ độ hoá rồi tính" (P2.2.x), tích hỗn tạp/4 điểm đồng phẳng (P3.5.3), đếm vectơ bằng chỉnh hợp (P1.1.1).
Dạng của cây không có kiểu nào trong sách: **không có**; dạng chỉ 2/3 sách: P1.3.1, P1.4.4, P1.4.5, P3.3.3, P3.5.x, P3.6.3, P3.7.2.

## Cần Thùy quyết
- P3.6.1 và P3.6.2 chồng nhau (đề thi "M∈(Oxy) làm ΣkMA² nhỏ nhất" khớp tên .2 lẫn mô tả .1): tách ranh .1 = tìm I/M tự do, .2 = M bị ràng buộc trên mp/trục?
- Thêm dạng mục C.1–C.3 (mỗi cái ≥10 câu sách)? C.4–C.6 giữ hay bỏ?
- P1.2.4 "Chứng minh đẳng thức": đề thi không ra dạng chứng minh — giữ (sách 13+ câu) hay gộp vào .1–.3? P1.5.2 "Công" giữ chỉ-sách?
- Chấp nhận cách tính Đ theo nội dung (khác cách ghép tên nhóm: nếu ghép theo tên, P2.1.x sẽ không Đ)?
