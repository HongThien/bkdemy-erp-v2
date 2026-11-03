KẾT LUẬN: ĐẠT

# Biên bản soát — CK-2425-ngoc-lam · phần Hình (THCS Ngọc Lâm, cuối HK I 2024–2025, bản SCAN)

- Số câu: **7** (Dạng 5, Bài 22–28) · 1 `tra_loi_ngan` (Bài 22, `8,0`) · 6 `tu_luan`.
- Pha 0: tự lập danh sách bài Hình từ 5 ảnh trang ⇒ đúng Bài 22–28 (Bài 28 in tiếp đầu trang 5). **Không sót bài, không nhập nhầm bài Đại số.**
- Khớp Pha 1 ngay từ đầu: **7/7** (đáp số 22, 23, 24 và hướng chứng minh mọi ý của 25–28 trùng bản giải mù `CK-2425-ngoc-lam.hinh.kiem.md`; kiểm toạ độ số `tam/soat_pha1.mjs`, 4000 cấu hình / bài, 0 lỗi).
- Số câu phải sửa: **5** (Bài 24–28) — **0 lỗi toán / đáp số / kiến thức**; chỉ ghi chú, căn cứ trong ngoặc và nhãn hình. Bản gốc trạm soạn: `CK-2425-ngoc-lam.hinh.soan.goc.md`; script vẽ gốc: `<LV>\tam\ve_hinh.goc.mjs`.
- Luật kiến thức: không góc nội tiếp (các góc vuông $\widehat{ACD}$ Bài 26, $\widehat{O'AC}$ Bài 28 chứng minh bằng hai tam giác cân + tổng ba góc), không đường trung bình (Bài 25b dùng $\triangle MIK\backsim\triangle MAB$ c.g.c; 25d dùng so le trong; 25f dùng Thalès), hệ thức đường cao đều suy từ tam giác đồng dạng, không `⇔`. Đạt.
- Bài 24 (mơ hồ $4$ cm / $10$ cm): **đã phân xử** — phóng to ảnh gốc 400 và 800 dpi (`<LV>\z\b24.png`, `b24b.png`): có HAI mũi tên đo nối tiếp trên cùng mép quạt $OB$, mũi $4$ cm từ đỉnh quạt tới cung trong, mũi $10$ cm từ cung trong tới $B$ ⇒ bán kính ngoài $14$ cm, trong $4$ cm, $S=60\pi\approx188{,}5\ \text{cm}^2$ (trạm soạn đúng). Cách hiểu $28\pi\approx88{,}0$ bị loại.
- Cổng `dung-de-tu-soan.mjs --chi-kiem`: **✔ đạt cổng** (7 câu · 1 TLN · 6 tự luận · hình 7 · chưa chắc 0).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 24 | định dạng (ghi chú) | Viết lại `**Ghi chú:**` và mục GHI CHÚ CHO NGƯỜI DUYỆT: bỏ lập luận "đối chiếu tỉ lệ" + phương án $28\pi$, thay bằng bằng chứng hai mũi tên đo nối tiếp đọc trên ảnh phóng to | Trạm soạn suy từ tỉ lệ đoạn (đo ra $\approx0{,}3$, nằm giữa $4{:}14$ và $4{:}10$ — không đủ phân xử); ảnh phóng to cho bằng chứng trực tiếp. Đáp số giữ nguyên |
| Bài 25 | định dạng | Thêm căn cứ: "(tính chất đường trung trực)" ở ý b; "(quan hệ giữa tính vuông góc và tính song song)" ở ý d và ý f; "(cùng vuông góc với $AB$)" cho $AC\parallel BD$ ở ý f | Luật trình bày Hình 7·8·9: mọi kiến thức dùng phải có chú thích trong ngoặc |
| Bài 25 | hình | Vẽ lại hình đề + hình giải: $M$ từ $62^\circ$ sang $76^\circ$, $R$ $118\to130$; nhãn $K$, $S$ có viền trắng; nhãn $N$ dời lên trên-trái | Nhãn $K$ cũ đè lên cung nửa đường tròn và sát đường thẳng $By$ (phóng to thấy rõ); điểm $K$ bị kẹp giữa $MB$, $BC$, $OD$, cung và đường tròn đường kính $CD$ nên phải nới hình + viền trắng. Hình vẫn đúng dữ kiện (đã chạy lại kiểm 4000 cấu hình), canvas 364×400 |
| Bài 26 | hình | Dời nhãn $C$ (đè đoạn $MB$), $H$ (đè đoạn nét đứt $OC$ ở hình giải), $I$ (đè cung $(O)$ ở hình giải — $I$ nằm đúng trên $(O)$ vì $OM=2R$) | Nhãn không được đè nét |
| Bài 27 | định dạng | Thêm "(cùng vuông góc với $DE$)" cho $OD\parallel O'E$ ở ý f | Thiếu căn cứ |
| Bài 27 | hình | Nhãn $H$ dời ra và có viền trắng | Chân chữ $H$ chạm cung $(O')$ |
| Bài 28 | định dạng | Thêm "(tính chất đường trung trực)" cho "$O'C$ là đường trung trực của $AB$" ở ý b | Thiếu căn cứ |
| Bài 28 | hình | Dời nhãn $O$ sang trên-trái điểm $O$ | Chữ $O$ cũ nằm đè lên cung $(O')$ |

Không sửa: đề chép đúng ảnh cả 7 bài (Bài 22 sửa "một phẳng" ⇒ "một mặt phẳng" đã có Ghi chú); `loai` đúng (Bài 23 `106,0`, Bài 24 `188,5` đều 5 kí tự ⇒ `tu_luan`); Phần 1 cả 7 bài 4–5 bước, không lộ đáp số; hình đề không vẽ sẵn điều phải chứng minh (không đánh dấu góc vuông cần chứng minh; đường $MS$ Bài 25 phải có vì định nghĩa $Q$).

## Phân loại tiếp tuyến cuối cùng (không đổi so với trạm soạn)

| Câu | tt |
|---|---|
| P1 Bài 22 | khong_tt |
| P1 Bài 23 | khong_tt |
| P1 Bài 24 | khong_tt |
| P1 Bài 25 | ba_tt |
| P1 Bài 26 | hai_tt |
| P1 Bài 27 | tt_khac |
| P1 Bài 28 | hai_tt |

Đếm: hai_tt 2 · ba_tt 1 · tt_khac 1 · khong_tt 3.

## Câu còn `Chưa chắc` (gửi CEO)

Không có.
