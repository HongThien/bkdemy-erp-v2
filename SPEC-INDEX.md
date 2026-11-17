# SPEC-INDEX — tra tên file spec cũ → nguồn đúng hiện nay

> Lập 17/11/2026 (đợt 0 của việc gộp spec, Thùy duyệt). **Code, migration, DEVLOG còn trỏ tên file cũ — không sửa các chú thích đó; tra ở đây.**
> File cũ KHÔNG xoá: nằm nguyên văn trong `_luu-tru/` (lịch sử git giữ nguyên qua `git mv`). Đọc để hiểu lịch sử, **không làm theo** khi trái spec đang dùng.
> Mỗi đợt gộp sau (đợt 1–3) thêm dòng vào bảng B.

## A. Spec đang dùng (đọc theo CLAUDE.md §7)

| Mảng | File đang là nguồn | Sẽ gộp thêm (đợt sau) |
|---|---|---|
| Kiến trúc | `spec-kien-truc.md` | `ADR-mon.md` · `AUDIT-client-tinh-toan.md` |
| Kho · giải bài | `spec-giai-bai.md` | `spec-clone-ai.md` · `spec-kho-chuan.md` |
| Bản đồ kiến thức | `spec-ban-do-4-tang.md` | `spec-builder-ban-do-moi.md` · `PLAN-mastery-ban-do-moi.md` · `spec-format-noidung.md` · `spec-ban-do-k12.md` · `spec-cum-bai.md` |
| Hình | `spec-hinh-cay-nhanh.md` | `spec-hinh-luyen.md` · `spec-kho-hinh-v3.md` |
| Form câu | `spec-mcq-form.md` · `spec-mcq-quy-trinh-sinh.md` · `spec-dien-o.md` | `spec-mcq-tung-phan.md` |
| Đề thi | `spec-de-thi.md` | `spec-on-thi-gk1.md` |
| Bổ trợ | `spec-bo-tro.md` | `spec-xep-bo-tro-chung.md` |
| Vận hành tuần | `spec-van-hanh-tuan.md` | `spec-muc-tieu-tuan.md` |
| Quản lý chất lượng | `spec-truong-khoi.md` · `spec-phong-truong-khoi.md` · `SPEC-troly-nhansu.md` | `spec-danh-gia-cuoi-cap.md` · `spec-bao-cao-ky.md` · `spec-quy-tac-cham.md` |
| Nhân sự · lương | `spec-cham-cong-ta.md` · `spec-hieu-suat-ta.md` · `spec-bot-telegram-ta.md` | `SPEC-tai-chinh-luong-gv-ta.md` (nằm ở nhánh `docs/tai-chinh-luong-gv-ta`, chưa vào `main`) |
| Vận hành trung tâm | `spec-dang-ky-test.md` · `spec-su-kien.md` | `PLAN-thu-chi.md` · `PLAN-tuqua.md` · `BKDEMY_WEB_SPEC.md` (❓) |
| App HS | `spec-v1-app-hs.md` · `spec-giao-dien-hs.md` · `design/STYLE-HS.md` | `spec-so-tay-cong-thuc.md` · `spec-the-gioi-bk.md` · `HUONG-DAN-CHOI-DUYET.md` |
| Kinh tế app HS | `spec-kinh-te-nhiem-vu.md` | `spec-thanh-tuu-nhiem-vu.md` · `spec-bang-xep-hang.md` · `spec-huy-hieu-build.md` |
| Chế độ game học | `spec-che-do-game.md` | `spec-thu-thach-dau-truong.md` · `spec-dau-tu-vung.md` |
| Game BK | `spec-lang-bk.md` | `spec-bk-world.md` · `spec-bat-thu.md` · `spec-nong-trai-nhip-ngay.md` · nháp `spec-game-ban-qua.md` · `spec-game-buoi-hoc.md` · `spec-game-catan.md` (❓) |
| Môn Anh | `spec-anh-kho.md` · `spec-anh-ban-do-k9.md` | `nghien-cuu-mon-anh.md` |
| Bài học tương tác | `spec-day-hinh-3d.md` · `spec-toan-du-hanh.md` · `spec-khtn-du-hanh.md` | — |
| Ngoài ERP | `spec-lunar-cherry.md` (project riêng) | ❓ chuyển sang repo của nó |
| Handoff | `HANDOFF.md` · `HANDOFF-BAI-HOC.md` · `HANDOFF-ARCHIVE.md` · `DEVLOG.md` · `schema.md` (tự sinh) | rút HANDOFF ở đợt 3 |

## B. Đã chuyển vào `_luu-tru/` — tên cũ → nguồn đúng

| File cũ | Vì sao lưu trữ | Nguồn đúng hiện nay |
|---|---|---|
| `BKDEMY_CANHBAO_BOTRO_SPEC.md` | Spec 05/07, bổ trợ đã làm lại | `spec-bo-tro.md` |
| `BKDEMY_DETHI_SPEC.md` | Bản 05/07, đã có bản thay | `spec-de-thi.md` |
| `BKDEMY_GIAOVIEC_HIEUSUAT_SPEC.md` | Build 07/2026; task phát triển làm lại 14/10 | `spec-hieu-suat-ta.md` · `spec-truong-khoi.md` · code |
| `BKDEMY_OPS_SPEC_DETAIL.md` | Build 07/2026 | `PLAN-app-ops` (lưu trữ) · code |
| `BKDEMY_TESTDAUVAO_SPEC_DETAIL.md` | Build 07/2026 | `spec-dang-ky-test.md` · code |
| `PLAN-app-gv.md` · `PLAN-app-ops.md` · `PLAN-app-ta.md` | Kế hoạch 08/2026, đã build | code các app |
| `PLAN-botro-yeu.md` · `PLAN-botro-yeu-ca.md` | Thiết kế gốc bổ trợ yếu 09/2026 | `spec-bo-tro.md` |
| `PLAN-danhgia-hoctap.md` · `ket-qua-hoc-tap-tong-quan.md` · `docs/verify-danhgia-hoctap.md` | Pha 07/2026; trỏ tới `spec-danhgia-hoctap.md` đã không còn | `spec-bo-tro.md` · `spec-truong-khoi.md` |
| `PLAN.md` | Ôn tập trong BTVN 07/2026; trỏ tới `spec-btvn-ontap.md` đã không còn | `spec-van-hanh-tuan.md` §6 (BTVN xếp chồng) |
| `spec-test-online.md` | ET + BTVN trắc nghiệm 07/2026, đã build | code |
| `spec-kho-v2.md` | Schema kho 06/2026 | `schema.md` (DB thật) · `spec-giai-bai.md` |
| `spec-giao-trinh-tuan.md` | Đã gộp trọn 16/11 | `spec-van-hanh-tuan.md` §3 |
| `spec-bao-cao-tuan.md` | Đã gộp trọn 16/11 | `spec-van-hanh-tuan.md` §5 |
| `spec-qlht-hien-trang.md` | Audit hệ xu của Hải 08/2026; Hải đã dừng | `spec-kinh-te-nhiem-vu.md` |
| `luat-choi-game.md` | Luật game Trung thu 09/2026 | `spec-su-kien.md` |
| `spec-game-bat-quai.md` | Tự ghi "đã bị thay" 01/10 | `spec-bat-thu.md` → `spec-lang-bk.md` |
| `erp-v2-ui-spec.md` | Shell dữ liệu giả 06/2026 | code |
| `FIX_LANE.md` | Luồng fix tự động 06/2026, không ai trỏ | — |
| `bkdemy_gami_spec_v1_claudecode.md` · `_master_` · `_level_` · `docs/elo-exp-tong-ket.md` | Hệ Elo/EXP 06–07/2026 | `spec-kinh-te-nhiem-vu.md` · `spec-thanh-tuu-nhiem-vu.md` |
| `de-xuat-huy-hieu.md` · `de-xuat-nhiem-vu.md` · `phan-tich-diem-rank.md` | Đề xuất chi tiết 28/09 | `spec-thanh-tuu-nhiem-vu.md` · `spec-kinh-te-nhiem-vu.md` |
| `BUILD-BACKLOG-HS-06-10.md` | Backlog 06/10 | `spec-v1-app-hs.md` · HANDOFF |
| `docs/2026-07-21-thay-cau-chet.md` · `docs/spec-kho-hinh-soan-chuoi.md` · `docs/v1-kho-hientrang.md` | Ghi chú 06–08/2026 | `spec-giai-bai.md` · `spec-hinh-cay-nhanh.md` |
| *(đã xoá 15/11, còn trong git)* `spec-giai-bai-ai.md` · `spec-luong-kho.md` · `spec-luong-kho-p0.md` · `kho-rules/README.md` · `kho-rules/*/k*.md` · `docs/luong-kho-kieu-1-hinh-hoc.md` | Thay bằng luật kho mới | `spec-giai-bai.md` |
