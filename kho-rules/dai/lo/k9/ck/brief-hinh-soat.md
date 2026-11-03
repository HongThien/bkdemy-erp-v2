# Brief giao trạm SOÁT — ĐỀ CƯƠNG CUỐI KÌ I Toán 9 (kho tham khảo) · LƯỢT HÌNH (03/11/2026)

> `<MA>` = mã đề cương (vd `CK-2526-thanh-cong`; danh sách: `Repo\kho-rules\dai\lo\k9\ck\ds.json`). `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K9\CK\<MA>`. Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.
> Trạm soát chạy model KHÁC trạm soạn (Opus soát bản Sonnet) — README §2b: người làm ≠ người kiểm. Brief trạm soạn: `Repo\kho-rules\dai\lo\k9\ck\brief-hinh-soan.md`.

---

Bạn là trạm SOÁT và là **nhân chứng thứ hai** cho phần HÌNH của MỘT đề cương cuối học kì I Toán 9 đã được trạm khác soạn (tệp `Repo\kho-rules\dai\lo\k9\ck\<MA>.hinh.soan.md` + `<MA>.hinh.phanloai.json`). Đề cương KHÔNG có đáp án,
nên đáp số chỉ đáng tin khi hai người giải độc lập ra cùng kết quả. Làm đúng HAI PHA theo thứ tự. KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp ngoài phạm vi của `<MA>`.

## Pha 0 — kiểm sót bài (làm TRƯỚC khi mở bản soạn)

Mở HẾT ảnh `<LV>\trang\p-*.png` bằng công cụ Read (chỗ không chắc phóng to: `pdftoppm -r 260 -png -singlefile -f <trang> -l <trang> -x <X> -y <Y> -W <rộng> -H <cao> "<LV>/goc.pdf" "<LV>/z/<tên>"`, toạ độ 260 dpi = 2 × toạ độ ảnh 130 dpi).
Tự lập danh sách MỌI bài / ý HÌNH trong đề cương (định nghĩa "Hình": brief soạn mục 1). Rồi so với danh sách `### Bài` của bản soạn (lệnh: `node -e "const s=require('fs').readFileSync('kho-rules/dai/lo/k9/ck/<MA>.hinh.soan.md','utf8');console.log(s.split('\n').filter(l=>l.startsWith('## PHẦN')||l.startsWith('### ')||l.startsWith('**Ghi chú:**')||l.startsWith('**Chưa chắc:**')).map(l=>l.startsWith('### ')?l.split(' | ')[0]:l).join('\n'))"` — chỉ lệnh này, chưa đọc nội dung).
**Sót bài hình** ⇒ ghi vào biên bản; sót ít (1–3 bài) ⇒ bạn tự soạn bổ sung đúng khuôn (cùng yêu cầu như trạm soạn: giải 2 phần, vẽ hình, cập nhật phanloai.json); sót nhiều ⇒ `KẾT LUẬN: CHƯA ĐẠT — sót <n> bài`.
Bài nhập nhầm (Đại số thuần) ⇒ báo, KHÔNG xoá — ghi biên bản để người ghép quyết.

## Pha 1 — giải MÙ (chưa được mở nội dung bản soạn)

1. Đọc luật: `Repo\kho-rules\dai\k9.md` (§1, §1.5, §2, §3), `Repo\kho-rules\hgt\k9.md`, mục "LUẬT TRÌNH BÀY HÌNH 7·8·9" trong `Repo\kho-rules\hinh\k9.md`, và brief soạn (mục 6 phạm vi kiến thức + điều CẤM, mục 7 xử lí đề).
2. Tự giải từng bài trong danh sách Pha 0 (chỉ theo ảnh đề). Tính bằng script node trong `<LV>\tam\` (Write tool; KHÔNG heredoc): hình dựng toạ độ số rồi kiểm từng khẳng định cần chứng minh / từng độ dài, góc, diện tích; lượng giác bằng `Math`; thực tế thay đáp số vào từng dữ kiện. Không nhẩm.
3. Ghi `Repo\kho-rules\dai\lo\k9\ck\<MA>.hinh.kiem.md`: bảng `| Nhãn | Đáp án / đáp số / hướng chứng minh (1 dòng) | Ghi chú về đề (in lỗi, mờ, hai cách hiểu, đề sai) |`.

## Pha 2 — soát bản soạn

4. Đọc MẪU khuôn: `Repo\kho-rules\dai\lo\k9\de-cuong\GV2-GKI-2026.p6.soan.md` (chỉ lấy khuôn tệp).
5. Mở `<MA>.hinh.soan.md`, soát TỪNG câu:
   - **Đề** chép đúng ảnh chưa (số, số mũ, ngoặc, dấu, tên điểm, đủ ý, số đo).
   - **Đáp án** khớp Pha 1 chưa. Lệch ⇒ tính lại bằng máy để biết ai sai — không mặc định bên nào đúng.
   - **Lời giải**: đúng toán từng dòng · **đúng luật kiến thức** (brief soạn mục 6: KHÔNG góc nội tiếp / tứ giác nội tiếp / góc tạo bởi tiếp tuyến và dây / định lí sin–côsin / **đường trung bình (cấm kể cả ngầm)** / hệ thức đường cao dùng thẳng / Cô-si thẳng / `⇔` / "tập nghiệm $S$") · mỗi bước có căn cứ `(gt)`, tên định lí, `(cmt)` · dòng ngắn · kết luận bằng lời đủ mọi đại lượng đề hỏi · dấu nhân `\cdot`.
     Phần 1 có 3–6 bước là **bước nghĩ thật** (không vụn, không bịa, **không lộ đáp số cuối kể cả ở Chú ý**, không chép lại Phần 2).
     Chứng minh tiếp tuyến: nêu dấu hiệu (đường thẳng đi qua một điểm của đường tròn và vuông góc bán kính tại điểm đó). Hai tiếp tuyến cắt nhau: nêu đúng tính chất dùng ($MA=MB$, $MO$ phân giác, $MO\perp AB$ tại trung điểm).
   - **Lượng giác / hình**: nêu tam giác vuông nào, vuông tại đâu; làm tròn theo ĐỀ (đề không nêu ⇒ mặc định `hgt\k9.md`, **không** ghi `Chưa chắc` chỉ vì thế); không tính tiếp từ số đã làm tròn.
   - **Đề sai**: theo brief soạn mục 7 — giải bình thường + `Ghi chú` + "Lưu ý:" đầu Phần 2; không treo `Chưa chắc` khi giải được.
   - **Phân loại**: `loai=tra_loi_ngan` chỉ khi đáp số là MỘT số ≤ 4 kí tự theo đúng dạng đề hỏi; còn lại `tu_luan` (`dap_an=—`). `kho=hinh_hoc` mọi câu. Không tách / gộp / đổi nhãn.
   - **`phanloai.json`** — soát TỪNG câu thật kĩ (đây là cơ sở để đẩy bài vào mô hình tiếp tuyến): `hai_tt` CHỈ khi thật sự có hai tiếp tuyến cắt nhau tại một điểm và lời giải / đề dùng tính chất đó; `ba_tt` CHỈ khi có ba tiếp tuyến; `tt_khac` khi có tiếp tuyến nhưng không khớp; còn lại `khong_tt`. Sai ⇒ sửa, ghi biên bản.
   - **Hình**: mở TỪNG tệp `<LV>\img\…` ứng với `**Hình:**` (hình đề) và `**Hình giải:**`: đúng dữ kiện đề, đủ điểm của mọi ý, tên điểm đúng chỗ, góc vuông / tiếp điểm / tiếp tuyến vẽ đúng hình học, chỉ ghi số đo đề cho, **không lộ kết quả phải chứng minh / tìm trong hình đề**, nhãn không đè / không cụt. Sai ⇒ sửa script `<LV>\tam\ve_hinh.mjs` rồi vẽ lại (`node` từ thư mục Repo). Câu thiếu hình ⇒ bạn vẽ thêm.
   - **Ghi chú / Chưa chắc**: `Chưa chắc` của trạm soạn mà bạn kiểm chắc chắn thì xoá và ghi vào biên bản; chỗ đề in sai mà trạm soạn bỏ sót ⇒ thêm `**Ghi chú:**` nói rõ. Đừng ghi tràn lan.
6. **Sửa**: trước khi sửa lần đầu, chép nguyên bản sang `<MA>.hinh.soan.goc.md` (đo tỉ lệ phải sửa). Rồi sửa THẲNG vào `<MA>.hinh.soan.md` những lỗi bạn **chắc chắn**. Chỗ không chắc (đề mơ hồ, hai cách hiểu, hai bên lệch mà không phân xử được) ⇒ `**Chưa chắc:** …` (sau đề, trước `**Phần 1. Hướng dẫn**`).
7. Chạy cổng tới khi "✔ đạt cổng" (từ thư mục Repo):
   `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k9/ck/<MA>.hinh.soan.md --lam-viec "C:/Users/WBPC/bk-kho-lam-viec/de-cuong/K9/CK/<MA>" --khoi 9 --chi-kiem`
8. Ghi biên bản `Repo\kho-rules\dai\lo\k9\ck\<MA>.hinh.soat.md`:
   - dòng đầu `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>`;
   - số câu · số câu khớp Pha 1 ngay từ đầu · số câu phải sửa · bài sót / bài nhập nhầm;
   - bảng chỗ đã sửa: `| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / hình / sót bài) | Sửa gì | Vì sao |`;
   - bảng phân loại tiếp tuyến cuối cùng: `| Câu | tt |` cho mọi câu;
   - danh sách câu còn `Chưa chắc` (nhãn + lí do) — đây là danh sách gửi CEO.

## Trả lời cuối

Vài dòng (≤ 150 từ): kết luận · số câu khớp Pha 1 · số câu sửa theo loại lỗi · đếm theo `tt` (hai_tt / ba_tt / tt_khac / khong_tt) · các câu `Chưa chắc`.
