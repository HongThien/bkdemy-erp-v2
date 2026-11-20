KẾT LUẬN: ĐẠT

Trạm kiểm Opus, ngữ cảnh sạch, 20/11. Lô thử 50 câu Toán 3 (Kết nối tri thức).
Pha 1 giải mù xong rồi mới mở `ket-qua.json` (đáp số giải mù ở `.tmp-k3/opus-mu.json`). Đã đọc trường `moi` của cả 50 câu, và quét máy tìm `×` Unicode, `⇒ ⇔ →`, `\frac`, dấu phẩy thập phân, số bước, "Bước n. Bước m".
Không câu nào sai đáp số. Không câu nào sai lập luận hay dùng kiến thức ngoài lớp 3.
Có 19 câu lỗi khuôn hoặc diễn đạt; 4 câu trong số đó phải sửa trước khi đưa vào kho (mục 2, mức NẶNG).

## 1. Bảng đáp số

| | Số câu |
|---|---|
| Pha 1 khớp đáp án kho và khớp kết quả cuối của lời giải mới | 48 |
| Pha 1 lệch đáp án kho | 0 |
| Lời giải mới lệch đáp án kho | 0 |
| Không so được (bài vẽ, pha 1 ghi "?"): T1030000001099 (vẽ hình vuông và hình chữ nhật), T1030000001113 (vẽ góc vuông) | 2 |

Ghi chú: T1030000001469 (bọ ngựa, $54$ cm) phụ thuộc hình. Pha 1 giả định đường đi là $AB$ + $BC$ + $CD$ với $BC$ = hai lần khoảng cách giữa hai tâm ($18 + 18$), nên ra cùng kết quả với kho. Không có lệch.

## 2. Danh sách lỗi

Mức: NẶNG = trái luật §A5 / Khối 3 rõ ràng (bước Hướng dẫn ghi đáp số cuối, hoặc trẻ đọc dễ hiểu nhầm). NHẸ = văn phong / bước rỗng.

1. **T103000000248** · NẶNG · bước Hướng dẫn làm trọn phép tính và ghi đáp số cuối.
   Nguyên văn: "**Bước 3.** Hàng chục: $3$ thêm $1$ là $4$, lấy $7 - 4 = 3$; được hiệu $34$."
   Đề xuất: chuyển phần tính theo hàng sang Phần 2, để bước chỉ nói cách nghĩ:
   "**Bước 2.** Đặt tính thẳng hàng rồi trừ từ hàng đơn vị; hàng đơn vị không trừ được thì lấy thêm $10$ và nhớ $1$."
   "**Bước 3.** Sang hàng chục, cộng số nhớ vào số trừ rồi mới trừ."
   Phần 2: "$72 - 38 = 34$" / "Vậy hiệu là $34$." (giữ nguyên).

2. **T1030000001001** · NẶNG · dòng Chú ý ghi sẵn kết quả của Phần 2.
   Nguyên văn: "**Chú ý:** Thương có thể có chữ số $0$ ở giữa, như $819 : 8 = 102$."
   Đề xuất: "**Chú ý:** Hạ chữ số xuống mà được số bé hơn số chia thì viết $0$ vào thương rồi mới hạ tiếp."

3. **T103000000286** · NẶNG · đánh số chồng lên nhau, trẻ đọc khó hiểu.
   Nguyên văn: "**Bước 2.** Bước 1: tìm độ dài mỗi đoạn tre bằng phép chia." / "**Bước 3.** Bước 2: hình vuông có $4$ cạnh bằng nhau, …"
   Đề xuất: "**Bước 2.** Trước hết tìm độ dài mỗi đoạn tre bằng phép chia." / "**Bước 3.** Hình vuông có $4$ cạnh bằng nhau, mỗi cạnh là một đoạn tre, nên lấy độ dài một đoạn nhân với $4$."
   Bỏ "**Bước 1.** Đọc đề: …" và thay bằng: "**Bước 1.** Nhận ra bài có hai bước: phải biết một đoạn tre dài bao nhiêu thì mới tính được hình vuông."

4. **T1030000001249** · NẶNG · cùng lỗi đánh số chồng.
   Nguyên văn: "**Bước 2.** Bước 1: tìm số lít nước mắm bán buổi chiều bằng phép trừ." / "**Bước 3.** Bước 2: cộng số lít hai buổi để biết cả hai buổi."
   Đề xuất: "**Bước 1.** Muốn biết cả hai buổi thì phải biết buổi chiều bán bao nhiêu lít, mà đề chưa cho." / "**Bước 2.** Buổi chiều bán ít hơn buổi sáng nên tìm số lít buổi chiều bằng phép trừ." / "**Bước 3.** Cộng số lít của buổi sáng và buổi chiều để ra số lít cả hai buổi."

5. **T103000000583** và **T103000000551** · NHẸ · Phần 1 và Phần 2 bị đảo vai.
   Phần 1 là ba bước chung chép y hệt nhau ở hai câu. Cách nghĩ theo từng hàng ("Hàng đơn vị: $0$ không trừ được $6$, lấy $10 - 6 = 4$, viết $4$ nhớ $1$.") lại nằm ở Phần 2. Khối 3 (a) quy định Phần 2 viết phép tính hàng ngang, việc đặt tính nói ở Phần 1.
   Đề xuất: chuyển ba dòng "Hàng đơn vị / Hàng chục / Hàng trăm" lên làm Bước 2–4 của Phần 1, nhưng bỏ chữ số kết quả cuối. Ví dụ với 850 − 276: "**Bước 2.** Hàng đơn vị: $0$ không trừ được $6$ nên lấy $10$ trừ $6$, nhớ $1$." Phần 2 còn: "$850 - 276 = 574$".

6. **T1030000001433, T1030000001417, T1030000001406, T103000000285, T103000000997** · NHẸ · Bước 1 chỉ chép lại số liệu ("**Bước 1.** Đọc đề: có $45$ viên bi, chia đều vào $5$ hộp."), Bước 3 là câu rỗng ("**Bước 3.** Viết câu lời giải, phép tính và đáp số.").
   §A5 cấm bịa bước "Đọc kĩ đề". Đề xuất cho T1030000001433:
   "**Bước 1.** Nhận ra $45$ viên bi được chia thành $5$ phần bằng nhau, mỗi hộp là một phần."
   "**Bước 2.** Muốn biết một phần có bao nhiêu thì lấy tổng số bi chia cho số hộp."
   "**Bước 3.** Câu lời giải bắt đầu bằng điều đề hỏi: "Mỗi hộp có số viên bi là:", đơn vị là viên bi."
   Bốn câu còn lại viết theo cùng mẫu: Bước 1 nói ý nghĩa (nhóm bằng nhau / chia đều / giảm đi), Bước 3 nói câu lời giải và đơn vị.

7. **T103030101046** và **T103000000491** · NHẸ · Bước 1 cũng là "Đọc đề", và bước chép phép tính của Phần 2.
   T103030101046, nguyên văn: "**Bước 1.** Đọc đề: cần tìm $\dfrac{1}{6}$ của $36$ l." Đề xuất: "**Bước 1.** Nhận ra "một phần sáu" nghĩa là chia đều thành $6$ phần rồi lấy một phần."
   T103000000491, nguyên văn: "**Bước 1.** Đọc đề để biết phải nhân hay chia trước, …" Đề xuất: "**Bước 1.** Làm theo đúng thứ tự đề nói: phép đầu tiên xong mới làm phép thứ hai, kết quả phép đầu là số bắt đầu của phép sau."

8. **T1030000001499** · NHẸ · bước chép phép tính của Phần 2.
   Nguyên văn: "**Bước 3.** Tính $8 \times 4$ rồi ghi đơn vị xăng-ti-mét."
   Đề xuất: "**Bước 3.** Lấy độ dài một đoạn nhân với số đoạn, nhớ ghi đơn vị xăng-ti-mét."

9. **T1030000001137, T103000000873, T1030000001149** · NHẸ · bước rỗng, ít hơn 5 chữ hoặc không có ý nghĩ.
   Nguyên văn: "**Bước 3.** Ghi số đỉnh." · "**Bước 3.** Kết luận số lần." · "**Bước 3.** Ghi số thanh sắt cần dùng."
   Đề xuất: bỏ hẳn bước đó (vẫn còn đủ ý), hoặc thay bằng bước kiểm:
   T1030000001137: "**Bước 3.** Đếm lại các góc của mặt sơn đỏ, mỗi góc là một đỉnh."
   T103000000873: "**Bước 3.** Chú ý số vừa tìm là số bé, $36$ là số lớn, nên lấy $36$ chia cho số bé."
   T1030000001149: "**Bước 3.** Đếm lại theo nhóm: $4$ cạnh ở mặt trên, $4$ cạnh ở mặt dưới, $4$ cạnh đứng."

10. **T103000000703** · NHẸ · một chuỗi dấu bằng trộn đơn vị với số trần.
    Nguyên văn: "$2$ l $= 2 \times 1000 = 2000$ ml"
    Đề xuất: "$2 \times 1000 = 2000$" / "Vậy $2$ l $= 2000$ ml."

11. **T103000000282** · NHẸ · trình bày không đồng nhất với câu cùng mẫu T103000000271. Câu kia có dòng thử lại số đã cho ($54 - 6 = 48$); câu này nhảy từ "$63 - 7 = 56$" sang "$49 - 7 = 42$".
    Đề xuất: thêm dòng "$56 - 7 = 49$ (khớp với số đã cho)" vào giữa hai dòng đó.

12. **T103000000280** · NHẸ · lỗi nằm ở trường `dap_an` của kho, lời giải không sai. Đáp án kho gõ dấu nhân Unicode: "$7×5 = 5×7$; …"
    Đề xuất: "$7 \times 5 = 5 \times 7$; $42 : 7 = 30 : 5$; $14 : 2 = 49 : 7$; $21 : 7 = 18 : 6$; $28 : 7 = 24 : 6$".

13. Ngoài phạm vi lời giải, báo để biết · gán dạng có vẻ lệch:
    - T1030000001499 và T1030000001493 (đường gấp khúc) gán "Biểu thức chưa cộng trừ hỗn hợp".
    - T103000000280 và T103000000278 (bảng nhân, chia 7) gán "So sánh số tự nhiên".
    Không sửa. Để trưởng khối xem.

Tổng: 19 câu có lỗi khuôn hoặc diễn đạt trong lời giải (mục 1–11), cộng 1 câu lỗi ở `dap_an` (mục 12). 4 câu mức NẶNG.

## 3. Nhận xét chung về văn phong

- Cả 50 câu đều đủ khung hai phần: Mấu chốt + 3 bước, có "Bài giải" và "Đáp số" ở bài lời văn, trắc nghiệm kết bằng "Chọn B.". Lời giải mới dùng `\times` và dấu chia `:`, không có `⇒`, không có chữ "chuyển vế", không có số thập phân. Câu lời giải theo đúng mẫu sách, đơn vị trong ngoặc đầy đủ.
- Điểm yếu lặp lại: bước Hướng dẫn hay bị dùng làm chỗ "điền cho đủ 3 bước": "Đọc đề: …", "Viết câu lời giải, phép tính và đáp số", "Ghi số …". Các bước này không dạy cách nghĩ. Nên rút luật: thà có 3 bước thật, còn không đủ ý thì gộp lại, không thêm bước chép đề.
- Bài đặt tính (trừ có nhớ) chưa thống nhất chỗ đặt cách tính theo từng hàng. Nên chốt một luật cho Khối 3: cách tính theo từng hàng nằm ở Phần 1 (không ghi kết quả cuối), Phần 2 chỉ ghi phép tính hàng ngang và kết quả.
- Lời văn ngắn, phù hợp trẻ 8–9 tuổi. Riêng kiểu "**Bước 2.** Bước 1: …" ở bài hai bước là chỗ duy nhất dễ gây rối.
