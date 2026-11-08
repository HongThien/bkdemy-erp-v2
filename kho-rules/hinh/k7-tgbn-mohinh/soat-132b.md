KẾT LUẬN: ĐẠT

Phạm vi: `lg-132b.json` — MH.132 "Tam giác cân", B14–B23 (10 bài). Bản gốc: `lg-132b.goc.json`.

- Số bài: 10
- Đúng ngay từ đầu (không sửa): 5 (B16, B17, B18, B19, B21)
- Phải sửa: 5 (B14, B15, B20, B22, B23) — đều là thiếu cơ sở / lí do; KHÔNG bài nào sai toán, sai thứ tự đỉnh hay dùng kiến thức cấm.
- Bài `null`: không có.

| Bài | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| B14 | thiếu cơ sở | Đưa bước "$I$ thuộc đoạn $HK$" lên trước khối tam giác bằng nhau, nêu cơ sở: $H$, $K$ khác phía đối với $AD$ (tia $AD$ nằm giữa $AB$, $AC$). | Bản gốc khẳng định $I$ thuộc đoạn $HK$ chỉ từ "tia $AD$ nằm giữa" mà không nói vì sao, và đặt sau khi đã dùng góc $\widehat{HAI}$. |
| B15 | lí do | "Mà $A, I, D$ cùng nằm trên $AD$. Nên $HK\perp AD$ (cmt)" → "Mà $I$ thuộc $AD$ nên $HK\perp AD$." | Lí do "(cmt)" sai chỗ; gộp gọn. |
| B20 | thiếu cơ sở | Hai chỗ "so le trong": thêm "$I$ thuộc $AC$, $I$ nằm giữa $D$, $K'$ ⇒ $D$, $K'$ khác phía đối với $AC$" rồi mới kết luận so le trong (cả cặp $AD$–$CK'$ và cặp $AK'$–$CD$). | Bản gốc lần 1 ghi lí do mơ hồ, lần 2 không có lí do vì sao là so le trong. Phần còn lại (K' ≡ K bằng 2 lần tiên đề Ơ-clit + $Ay$ cắt $Cx$ đúng 1 điểm) đúng. |
| B22 | thiếu cơ sở | Thêm $\widehat{PCB}=\widehat{ACB}$ ($P$ thuộc đoạn $AC$) và $\widehat{QBC}=\widehat{ABC}$ ($Q$ thuộc đoạn $AB$); bỏ "(cmt)" sai chỗ. | Bản gốc chỉ đổi tên góc ở đỉnh $A$, bỏ qua đổi tên góc ở $C$/$B$. Phần "A nằm giữa M, N" (M, B khác phía; N, Q, B cùng phía đối với $AC$) đúng. |
| B23 | thiếu cơ sở | Thay "$G$ thuộc đoạn $BP$ và $CQ$ nên $G$ nằm trong tam giác" (nhìn hình) bằng lập luận nửa mặt phẳng: $A$, $C$ khác phía $BP$; $Q$, $A$ cùng phía ⇒ $G$ thuộc đoạn $CQ$, tương tự đoạn $BP$; nêu tia $BP$ nằm giữa $BA$, $BC$ và tia $CQ$ nằm giữa $CA$, $CB$; tia $AG$ nằm giữa $AB$, $AC$ vì $G$ thuộc đoạn $CQ$. Ghi rõ "($\triangle ABC$ cân tại $A$)". | Brief cấm dựa vào "nhìn hình thấy đúng". |

Kiểm toạ độ: script `k132b.mjs` (scratchpad), 4 bộ tam giác cân (có góc $A$ tù), điểm $H/K$ thử 3 vị trí, $E/F$ thử 3 vị trí; 212 phép, 0 sai — kiểm cả khẳng định trung gian (I thuộc đoạn HK, D/K' khác phía AC, K' ≡ K, các cặp góc tương ứng, M/N khác phía AC, A nằm giữa M N, G thuộc 2 đoạn, GB = GC, A G D thẳng hàng).
Kiểm định dạng (node): JSON hợp lệ · 10 bài đúng thứ tự B14–B23 · không `\n\n` · không `\\n` lộ · `$` chẵn · không từ cấm · dòng ≤ 62 ký tự hiển thị.
