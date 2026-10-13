# Brief cập nhật — đề cương Ngôi Sao Hoàng Mai (NSHM-GKI-2026) sau quyết định của CEO 13/10

> Đọc `brief-soan.md` (khuôn lời giải 2 phần, định dạng, cách vẽ hình giải, cách tự kiểm) TRƯỚC. Phụ lục này chỉ ghi điều ĐỔI so với brief đó.
> Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K8\NSHM-GKI-2026`. Nguồn đề: `<LV>\anh\1.png … 5.webp` (+ `crop.mjs` để phóng to).

## Quyết định của CEO (13/10)

1. **Trường Ngôi Sao Hoàng Mai học đường trung bình SỚM ⇒ ở đề cương NÀY được dùng đường trung bình của TAM GIÁC:** định nghĩa, tính chất (song song cạnh thứ ba và bằng nửa cạnh đó) và chiều đảo
   (qua trung điểm một cạnh, song song cạnh thứ hai thì qua trung điểm cạnh thứ ba). Gọi tên rõ trong lời giải: "$MN$ là đường trung bình của $\triangle ABH$ nên …".
   **VẪN CẤM:** Thalès · đồng dạng · Pythagore · lượng giác · đường trung bình của HÌNH THANG (KNTT 8 không có).
2. **Bài 17: thêm điều kiện $AB>AD$ vào đề.** Dòng `**Đề:**` mở đầu thành "Cho hình chữ nhật $ABCD$ ($AB>AD$). Kẻ …"; thêm dòng `**Ghi chú:** Đề cương không ghi $AB>AD$; đã thêm điều kiện này theo quyết định của CEO để tứ giác $DKCB$ có đúng thứ tự đỉnh.`
   Gỡ dòng `Chưa chắc` của Bài 17; bỏ phần lời giải bàn trường hợp $AB<AD$ / hình vuông (với $AB>AD$: $DKCB$ lồi, hình thang cân hai đáy $KC$, $DB$).
3. Các câu 7i, 7k, 10, 12 đã được CEO duyệt cách hiểu hiện tại — KHÔNG đụng.

## Việc của bạn (chỉ phần được giao, tệp `kho-rules\dai\lo\k8\de-cuong\NSHM-GKI-2026.p<P>.soan.md`)

- Câu nào trong phần của bạn đang có dòng `**Chưa chắc:** … dữ kiện đúng là bài đường trung bình …`: **viết lại ĐÚNG các ý đó** (Phần 1 + Phần 2) theo cách dùng THẲNG đường trung bình (ngắn hơn, đúng cách sách), rồi **gỡ dòng `Chưa chắc`** đó.
  Đáp số / kết luận không đổi. Các ý khác của câu, đề, nhãn, `kho`, `loai`, `dap_an` GIỮ NGUYÊN.
- Bài 18b (phần 9): "$D$ là trung điểm $AB$" hiện chứng minh bằng hai tam giác vuông bằng nhau — viết lại bằng đường trung bình đảo cho gọn (ED ∥ AC, E là trung điểm BC).
- Phần 1 của câu vẫn là card 3–6 bước ("Mấu chốt" + "Bước k"); câu hình chứng minh: bước viết theo chiều phân tích đi lên; Phần 2 đi ngược lại. Mỗi ý có lí do. KHÔNG dùng công cụ cấm ở trên, kể cả ngầm.
- **Hình giải:** điểm phụ chỉ phục vụ lời giải CŨ (vd điểm $T$, đoạn $OT$ ở Bài 14; điểm đối xứng ở Bài 19, 15) mà lời giải MỚI không dùng ⇒ vẽ lại hình bỏ chúng
  (sửa `<LV>\tam\ve_p<P>.mjs` rồi chạy `node "<LV>/tam/ve_p<P>.mjs"` từ thư mục Repo; GIỮ NGUYÊN tên tệp `giai_bai<N>.png`), mở ảnh bằng Read để kiểm. Điểm phụ vẫn dùng thì giữ.
- Kiểm toạ độ lại các khẳng định mới (đừng nhẩm). Rồi chạy cổng:
  `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k8/de-cuong/NSHM-GKI-2026.p<P>.soan.md --lam-viec "<LV>" --khoi 8 --chi-kiem` tới khi "✔ đạt cổng".
- KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp khác. Trả lời cuối ≤ 100 từ: những ý đã viết lại, hình đã vẽ lại, cổng đã đạt chưa.
