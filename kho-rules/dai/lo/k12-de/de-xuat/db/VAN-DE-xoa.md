# Vấn đề khi chuẩn bị XOÁ bản đồ CŨ K12 (xoa-cu.mjs, chạy thử 03/11)

Chạy thử ROLLBACK (`xoa-cu-dry-run.txt`): 94 id cũ (9 chuyên đề · 68 nhóm · 17 dạng) khớp kỳ vọng; 2.266 dòng sẽ mất ở 32 bảng, mỗi bảng có md5 chứng minh mất ĐÚNG các dòng đã sao lưu; cây + gan_cau của NCD00095/099, 4 cây MỚI, `diem_thi`, `tai_lieu`, `dai_bdm_chu_de` trước = trong tx = sau ROLLBACK. **Không có FK chặn, không trigger lạ, không lan sang chủ đề khác.** Chưa chạy `--ghi`. Còn 1 việc Thùy phải quyết (script chặn `--ghi` cho tới khi có cờ), và vài điều Thùy nên biết.

## CẦN QUYẾT (chặn --ghi)

1. **MT — điểm thi đã chốt sẽ không còn khớp câu.** Buổi `053e2447-afc0-4120-a8f3-5c738ac25780` (04/10/2026) có 30 câu MT, **29 câu** trỏ dạng cũ ⇒ bị xoá cùng 145 dòng chấm `gami_grades`. Kỳ thi `bf6205b0-ac39-4a72-9a58-1f2518b0bec1` có **5 dòng `diem_thi`** (`nguon = 'cau'`, điểm cộng từ câu).
   - Khi xoá theo CASCADE, trigger `_tg_gami_grades_mt_tong` không tính lại (câu cha đã mất) ⇒ `diem_thi` **giữ nguyên** điểm cũ (md5 kiểm = trước). Đây là cách script đang làm.
   - Rủi ro: lần sau có ai chấm lại câu MT còn lại, `_mt_dong_bo_diem_thi` sẽ cộng lại trên **1 câu** ⇒ điểm 5 em sụt hẳn, im lặng.
   - Lựa chọn: (a) giữ nguyên `diem_thi` (chạy kèm `--giu-diem-thi`); (b) tính lại ngay sau xoá (điểm = 1 câu còn lại); (c) chốt `diem_thi` thành nhập tay (`nguon = 'tay'`) để không bao giờ bị tính lại. (b)/(c) là SỬA dữ liệu ngoài phạm vi xoá ⇒ cần Thùy nói rõ.

## Nên biết (không chặn)

2. **Cha còn lại RỖNG — không xoá, chờ Thùy:** 11 bài test hết câu (3 giáo trình · 2 BTVN · 3 ET · 3 tự luyện), 7 buổi×phase hết câu ET/BTVN, 4 phần giáo trình cha («Buổi 2/3» của 12B, «Buổi 2/4» của 12A) hết con; giáo trình «Ôn tập hàm số» còn 2/42 phần, «Giáo trình 12A» còn 16/43, «Giáo Trình 12B» còn 13/50. Danh sách id: `xoa-cu-danh-sach.md` §2.
3. **Số suy ra không tự đổi:** EXP/xu đã thưởng (`gami_exp_ledger` chỉ trỏ buổi, không trỏ câu) giữ nguyên; `bai_lam` không có cột điểm tổng nên không lệch. Mastery bản đồ mới suy động ⇒ tự đúng.
4. **Mất đối ứng bản đồ cũ → mới:** `dai_bdm_doi_ung` 72 dòng (66 theo nhóm · 6 theo dạng) và `dai_bdm_doi_ung_cum` 11 dòng — đã sao lưu, Thùy đã chấp nhận ("xoá hết").
5. **Sao lưu nằm ở thư mục TẠM của phiên** (`…\scratchpad\backup-xoa-cu\`, 32 tệp + `manifest.json` có md5). Trước `--ghi` nên chép ra chỗ bền (Drive/repo ngoài git); `dai_bdm_log` chỉ giữ `cu` cho 7 bảng bản đồ (551 dòng), KHÔNG giữ cho bảng đo lường/giáo trình/`dai_bdm_de_xuat`.
6. **Điểm mù:** 17 bảng owner `postgres` (đầu `schema.md`, gồm `hinh_giao_trinh`/`hinh_gt_*`) `claude_build` đọc ra 0 dòng — quét không thấy được. Các bảng đó thuộc Hình/sự kiện, không chứa mã dạng Đại theo B1, nhưng "0" không phải bằng chứng.
7. **Quyền:** vẫn chạy bằng `DATABASE_URL` (`claude_build`, role GHI) — rào cứng chưa có (VAN-DE.md mục 9).
