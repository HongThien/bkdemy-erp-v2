KẾT LUẬN: ĐẠT

# Soát nbv-b2-d (NBV — Giới hạn hàm số — phần D, Đúng/Sai)

- Số câu: 21 (câu 2–22), đều `luyen`, `dung_sai`, `dang_bai: null`. Câu 1 bỏ đúng: cần đồ thị để đọc 4 giới hạn.
- Lệch Pha 1 (giải mù bằng máy, `nbv-b2-d.kiem.md`): **trước 0 / sau 0**. Cả 84 ý trùng bản soạn và trùng kết luận Đ/S của sách.
- Đề chuẩn hoá: đối chiếu từng ý với nguồn `.txt`, giữ nghĩa (số, dấu, mũ, một bên ±, ∞). Câu 11: sách in nhãn "b)" hai lần, ý thứ ba đánh lại thành c) đúng (lời giải sách cũng gọi ý đó là c).
- `kiem.mjs` ✔ đạt sau khi sửa. Bản trước khi sửa: `nbv-b2-d.goc.json`.

## Phân xử bằng máy các điểm trạm soạn nêu
| id | ý | sách | máy | kết luận |
|---|---|---|---|---|
| nbv-b2-d-14 | b | S(π/3) ≈ 16,95 m, Sai | 15(π/3+1/2) = 23,208 m, Sai | sách tính sai số, kết luận Sai vẫn đúng ⇒ giữ `LỆCH SÁCH` |
| nbv-b2-d-14 | d | 7,5π, Sai | 15·π/2 = 23,562 = 7,5π ≠ 15π = 47,12, Sai | trùng sách. Nhưng α→(π/2)⁺ nằm NGOÀI miền 0<α<π/2 ⇒ đề sai, đã thêm "Lưu ý" và giải theo (π/2)⁻ |
| nbv-b2-d-15 | b | "C(15) = 35·10/60 ≈ 5,83", Sai | C(10) = 5,833 ≠ 5,38, Sai | chỉ lỗi in C(15) trong lời giải sách, số trùng ⇒ KHÔNG phải lệch sách, đã sửa nhãn |
| nbv-b2-d-15 | c | t = 300 phút, Sai | t = 300 phút = 5 giờ ≠ 2 giờ, Sai | trùng |
| nbv-b2-d-8 | — | trùng hệt câu 5 | cùng đáp án S Đ Đ S | giữ, nêu ở dưới cho CEO |
| nbv-b2-d-19 | c, d | trùng 18c, 18d | 4/3 (Đúng) · −1/12 (Sai) | giữ, nêu ở dưới |

## Lỗi đã sửa
| id | lỗi | sửa gì |
|---|---|---|
| nbv-b2-d-6 | lời giải (định dạng): Mấu chốt `$x\ne1$` bị hỏng thoát thành `$x` + xuống dòng + `e1$` | khôi phục `$x\ne1$` |
| nbv-b2-d-7 | như câu 6 | như câu 6 |
| nbv-b2-d-10 | lời giải (định dạng): Mấu chốt `$infty-infty$` mất `\` | `$\infty-\infty$` |
| nbv-b2-d-17 | lời giải (định dạng): Mấu chốt `$x\to-\infty$` thành ký tự TAB + `o-infty`; `sqrt`, `infty` mất `\` | khôi phục `$x\to-\infty$`, `$\sqrt{x^{2}}=-x$`, `$\infty-\infty$` |
| nbv-b2-d-22 | lời giải (định dạng): Mấu chốt TAB thay `\t`, `sqrt`/`approx` mất `\`, `$a\ne3$` bị xuống dòng | khôi phục `$x\to+\infty$`, `$\sqrt{9x^{2}}\approx3x$`, `$a\ne3$` |
| nbv-b2-d-14 | đề sai ý d (α→(π/2)⁺ ngoài miền); lời giải cũ lướt qua bằng "hàm liên tục nên giá trị tại π/2" | thêm dòng "Lưu ý: …" đầu Phần 2, ý d tính giới hạn trái (π/2)⁻; `ghi_chu` ghi đề sai |
| nbv-b2-d-14 | `kiem` ý a là tautology (so 15cosα+15α với chính công thức) | thay bằng dựng toạ độ thật: C trên đường tròn, AC + cung CB = 15(α+cosα) tại 3 giá trị α |
| nbv-b2-d-15 | `ghi_chu` ghi "LỆCH SÁCH" sai (sách chỉ in nhầm chữ C(15), số đúng) | viết lại `ghi_chu`: lỗi in, không lệch đáp số |

Lưu ý cho trạm soạn / `kiem.mjs`: 5 lỗi định dạng trên đều là ký tự điều khiển hoặc mất `\` trong `$…$` — `kiem.mjs` hiện KHÔNG bắt. Máy soát: `scan.mjs` (scratchpad) tìm TAB/BS/FF/CR, xuống dòng trong `$…$`, lệnh LaTeX mất `\`.

## Còn cần CEO
- **nbv-b2-d-8** trùng hệt **nbv-b2-d-5** (cùng hàm, cùng 4 ý). Nhập cả hai hay bỏ câu 8? (Bản này giữ cả hai.)
- **nbv-b2-d-19** ý c), d) trùng **nbv-b2-d-18** ý c), d). Đúng/Sai không tách ý ⇒ giữ nguyên cả câu; chỉ để Thùy biết.
- **nbv-b2-d-14** ý d) đề sai (α→(π/2)⁺): giữ chữ đề như sách + Lưu ý, hay sửa thẳng đề thành (π/2)⁻? Bản này giữ chữ đề sách (theo luật 24/10).
