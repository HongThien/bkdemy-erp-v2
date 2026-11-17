# SPEC-INDEX — tra tên file spec cũ → nguồn đúng hiện nay

> Lập 17/11/2026 (đợt 0 của việc gộp spec, Thùy duyệt). **Code, migration, DEVLOG còn trỏ tên file cũ — không sửa các chú thích đó; tra ở đây.**
> File cũ KHÔNG xoá: nằm nguyên văn trong `_luu-tru/` (lịch sử git giữ nguyên qua `git mv`). Đọc để hiểu lịch sử, **không làm theo** khi trái spec đang dùng.
> Mỗi lượt gộp sau thêm dòng vào bảng B; spec đích viết xong thì cột "Gộp từ" của nó chuyển sang bảng B.

## A. BỘ 20 SPEC ĐÍCH (Thùy chốt 17/11) — file hiện có rơi vào spec nào

> Tên file đích là dự kiến. Chừng nào spec đích chưa viết, **file ở cột "Gộp từ" vẫn là nguồn đúng** — đọc chúng như cũ.
> File đứng ở 2 spec = phải TÁCH phần (ghi phần nào sang đâu). *Nghiêng* = chưa có spec, viết từ code + DB + HANDOFF.

| # | Spec đích | Phạm vi (Thùy chốt) | Gộp từ |
|---|---|---|---|
| 1 | ✅ **`spec-kien-truc.md` — ĐÃ GỘP 17/11** (nguồn đã chuyển `_luu-tru/`) | Kiến trúc, luật K, rà tháng | `spec-kien-truc` · *đã gộp:* `ADR-mon` (→ §2a) · `AUDIT-client-tinh-toan` (→ §14) |
| 2 | ✅ **`spec-ban-do-toan.md` — CHỐT 17/11** (nguồn đã chuyển `_luu-tru/`, trừ `spec-cum-bai` còn cho KHTN + Hình–Học) | Bản đồ Toán — **cả Đại và Hình** | `spec-ban-do-4-tang` · `spec-ban-do-k12` · `spec-cum-bai` · `spec-format-noidung` (hiện lý thuyết dạng) · `spec-hinh-cay-nhanh` · `spec-hinh-luyen` · `spec-kho-hinh-v3` |
| 3 | ✅ **`spec-kho-cau-hoi.md` — CHỐT 17/11** (nguồn đã chuyển `_luu-tru/`, trừ `spec-kho-chuan` → #5) | Câu trong kho có tính năng gì; **sinh MCQ / điền ô / clone**; *mở rộng 17/11 (Thùy):* **nhập kho từ ảnh · từ đề thi · quy chuẩn hiển thị · vẽ lại hình** (luật giải vẫn ở #5) | `spec-mcq-form` · `spec-mcq-quy-trinh-sinh` · `spec-mcq-tung-phan` · `spec-dien-o` · `spec-clone-ai` · `spec-kho-chuan` (phần định nghĩa "câu vào kho") · `spec-de-thi` (phần bóc câu + cấu trúc đề) · `spec-format-noidung` (phần hiển thị câu) |
| 4 | ✅ **`spec-builder.md` — CHỐT 17/11** (nguồn đã chuyển `_luu-tru/`) | Builder · ET · MT · Giáo trình | `spec-builder-ban-do-moi` · `spec-de-thi` (phần đề trên app: duyệt đề, thi trên lớp) |
| 5 | `spec-giai-bai.md` (giữ tên — `scripts/kho/cat-luat.mjs` đọc theo tiêu đề) | Giải đề thi, giải bài, duyệt bài vào kho | `spec-giai-bai` · `spec-kho-chuan` (phần quy trình duyệt) · `PLAN-giaibai` |
| 6 | `spec-quan-ly-chat-luong.md` | **Cách hoạt động của trưởng khối** | `spec-truong-khoi` · `spec-phong-truong-khoi` (gồm phiên Claude) · `SPEC-troly-nhansu` · `spec-bao-cao-ky` |
| 7 | `spec-van-hanh-tuan.md` (giữ tên) | Việc theo nhịp tuần | `spec-van-hanh-tuan` · *đã gộp 17/11:* `spec-muc-tieu-tuan` (→ §4.1–§4.7) |
| 8 | `spec-van-hanh-trung-tam.md` — **NHÁP 17/11, chờ Thùy trả lời 12 câu §11.1** (nguồn chưa chuyển) | Ops: **xếp lịch bổ trợ + báo PH**, **cách thu học phí**, quy trình vận hành, phòng, TKB, sự kiện, tủ quà, app OPS | `spec-xep-bo-tro-chung` · `_luu-tru/spec-bo-tro-ban-13-11.md` §41–§43 (xếp lịch, còn hiệu lực) · `spec-dang-ky-test` · `spec-su-kien` (+ game Trung thu `games-site/`) · `PLAN-tuqua` · `PLAN-thu-chi` (phần quy trình) · *TKB · phòng · thu học phí* |
| 9 | `spec-web-trung-tam.md` | Web trung tâm | `BKDEMY_WEB_SPEC` · `spec-dang-ky-test` (phần web) |
| 10 | `spec-tro-giang.md` | Quy trình TA, chấm công, app TA | `spec-cham-cong-ta` · `spec-hieu-suat-ta` · `spec-bot-telegram-ta` · `spec-quy-tac-cham` |
| 11 | `spec-luong-gay.md` | Tính lương, tính gậy | `SPEC-tai-chinh-luong-gv-ta` (phần lương; file ở nhánh `docs/tai-chinh-luong-gv-ta`, chưa vào `main`) · *luật gậy đang rải ở `spec-truong-khoi` §3 · `spec-bot-telegram-ta` · `spec-van-hanh-tuan`* |
| 12 | `spec-app-hs.md` | Mọi tính năng app HS, **kể cả game** (một file, có mục lục, sửa phần nào đọc phần đó) | `spec-v1-app-hs` · `spec-giao-dien-hs` · `spec-so-tay-cong-thuc` · `spec-the-gioi-bk` · `spec-on-thi-gk1` · `spec-kinh-te-nhiem-vu` · `spec-thanh-tuu-nhiem-vu` · `spec-bang-xep-hang` · `spec-huy-hieu-build` · `spec-che-do-game` · `spec-thu-thach-dau-truong` · `spec-dau-tu-vung` · `spec-lang-bk` · `spec-bk-world` · `spec-bat-thu` · `spec-nong-trai-nhip-ngay` · nháp `spec-game-ban-qua` · `spec-game-buoi-hoc` · `spec-game-catan` · `HUONG-DAN-CHOI-DUYET`. **`design/STYLE-HS.md` giữ riêng** (cổng `check:style-hs`) |
| 13 | `spec-app-ph.md` (để ở repo này; `bkdemy-ph-app` trỏ sang) | App phụ huynh | *repo `bkdemy-ph-app` (HANDOFF + DEVLOG riêng)* · phần PH của `spec-bao-cao-ky` · `spec-muc-tieu-tuan` |
| 14 | `spec-ban-do-khtn.md` | Bản đồ KHTN | *`kho-rules/khtn/bdm-0311/` · mục HANDOFF* |
| 15 | `spec-ban-do-ly.md` | Bản đồ Lý | *`kho-rules/vatly/k12/README.md` · mục HANDOFF "Vật lý 12"* |
| 16 | `spec-ban-do-hoa.md` | Bản đồ Hoá | *chưa có gì* |
| 17 | `spec-bai-hoc-tuong-tac.md` | Bài học tương tác | `spec-day-hinh-3d` · `spec-toan-du-hanh` · `spec-khtn-du-hanh` |
| 18 | ✅ **`spec-bo-tro.md` — CHỐT 17/11** (viết lại; riêng §7.4 Đuổi chờ review; bản 13/11 → `_luu-tru/spec-bo-tro-ban-13-11.md`) | **Chỉ logic bổ trợ**: các level, cách kết luận, theo dõi… (xếp lịch, báo PH ⇒ #8) | `spec-bo-tro` |
| 19 | `spec-tai-chinh.md` | **Số liệu** tài chính (cách thu ⇒ #8, lương ⇒ #11) | `SPEC-tai-chinh-luong-gv-ta` (phần cơ cấu tài chính) · `PLAN-thu-chi` (phần số liệu) |
| 20 | ✅ **`spec-mastery.md` — ĐÃ VIẾT 17/11** (Thùy chốt 5 điểm lệch + xoá A–F; nguồn đã chuyển `_luu-tru/`) | **Mastery / đo lường — spec riêng** (lần đo, mastery, dạng yếu · nhóm yếu · HS yếu, cache, Cuối cấp, Dashboard học tập) | *đã gộp:* `spec-danh-gia-cuoi-cap` · `PLAN-mastery-ban-do-moi` · CLAUDE.md §5 (giữ ý, trỏ sang) · mục HANDOFF mastery. `spec-van-hanh-tuan` §5.6 giữ tại chỗ (trỏ §5) |

**Không vào bộ 20 spec:**
- **Anh, Văn — gác lại (Thùy 17/11):** `spec-anh-kho` · `spec-anh-ban-do-k9` · `nghien-cuu-mon-anh` giữ nguyên ở gốc, chưa gộp.
- `spec-lunar-cherry.md` — project riêng, ngoài ERP.
- Handoff: `HANDOFF.md` · `HANDOFF-BAI-HOC.md` · `HANDOFF-ARCHIVE.md` · `DEVLOG.md` · `schema.md` (tự sinh) — rút HANDOFF ở đợt cuối.

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
| `spec-muc-tieu-tuan.md` | Đã gộp hẳn 17/11 (Thùy "Làm đi") | `spec-van-hanh-tuan.md` §4.1–§4.6 (luật) · §4.7 (kỹ thuật, nhãn "(cũ §x)") |
| `spec-qlht-hien-trang.md` | Audit hệ xu của Hải 08/2026; Hải đã dừng | `spec-kinh-te-nhiem-vu.md` |
| `luat-choi-game.md` | Luật game Trung thu 09/2026 | `spec-su-kien.md` |
| `spec-game-bat-quai.md` | Tự ghi "đã bị thay" 01/10 | `spec-bat-thu.md` → `spec-lang-bk.md` |
| `erp-v2-ui-spec.md` | Shell dữ liệu giả 06/2026 | code |
| `FIX_LANE.md` | Luồng fix tự động 06/2026, không ai trỏ | — |
| `bkdemy_gami_spec_v1_claudecode.md` · `_master_` · `_level_` · `docs/elo-exp-tong-ket.md` | Hệ Elo/EXP 06–07/2026 | `spec-kinh-te-nhiem-vu.md` · `spec-thanh-tuu-nhiem-vu.md` |
| `de-xuat-huy-hieu.md` · `de-xuat-nhiem-vu.md` · `phan-tich-diem-rank.md` | Đề xuất chi tiết 28/09 | `spec-thanh-tuu-nhiem-vu.md` · `spec-kinh-te-nhiem-vu.md` |
| `BUILD-BACKLOG-HS-06-10.md` | Backlog 06/10 | `spec-v1-app-hs.md` · HANDOFF |
| `docs/2026-07-21-thay-cau-chet.md` · `docs/spec-kho-hinh-soan-chuoi.md` · `docs/v1-kho-hientrang.md` | Ghi chú 06–08/2026 | `spec-giai-bai.md` · `spec-hinh-cay-nhanh.md` |
| `spec-ban-do-4-tang.md` | Gộp vào spec #2 (17/11) | `spec-ban-do-toan.md` |
| `spec-ban-do-k12.md` | Gộp vào spec #2 (17/11) | `spec-ban-do-toan.md` |
| `spec-format-noidung.md` | Gộp vào spec #2 (17/11) | `spec-ban-do-toan.md` (thẻ lý thuyết) · `spec-kho-cau-hoi.md` §12 (hiển thị câu) |
| `spec-hinh-cay-nhanh.md` | Gộp vào spec #2 (17/11) | `spec-ban-do-toan.md` |
| `spec-hinh-luyen.md` | Gộp vào spec #2 (17/11) | `spec-ban-do-toan.md` |
| `spec-kho-hinh-v3.md` | Gộp vào spec #2 (17/11) | `spec-ban-do-toan.md` |
| `spec-mcq-form.md` | Gộp vào spec #3 (17/11) | `spec-kho-cau-hoi.md` |
| `spec-mcq-quy-trinh-sinh.md` | Gộp vào spec #3 (17/11) | `spec-kho-cau-hoi.md` |
| `spec-mcq-tung-phan.md` | Gộp vào spec #3 (17/11) | `spec-kho-cau-hoi.md` |
| `spec-dien-o.md` | Gộp vào spec #3 (17/11) | `spec-kho-cau-hoi.md` |
| `spec-clone-ai.md` | Gộp vào spec #3 (17/11) | `spec-kho-cau-hoi.md` |
| `spec-builder-ban-do-moi.md` | Gộp vào spec #4 (17/11) | `spec-builder.md` |
| `spec-de-thi.md` | Gộp vào spec #3 + #4 (17/11) | `spec-kho-cau-hoi.md` §11 (bóc câu, cấu trúc đề, `/nhap-de-thi`) · `spec-builder.md` §8 (Kho đề thi, soạn, duyệt, giao, thi) |
| `ADR-mon.md` | Gộp vào spec #1 (17/11) | `spec-kien-truc.md` §2a (chiều môn) · §2b (gộp theo khuôn) |
| `AUDIT-client-tinh-toan.md` | Gộp vào spec #1 (17/11) | `spec-kien-truc.md` §14 |
| `spec-danh-gia-cuoi-cap.md` · `PLAN-mastery-ban-do-moi.md` | Gộp vào spec #20 (17/11) | `spec-mastery.md` (§9.1 Cuối cấp · §3, §11 bản đồ mới / công tắc) |
| *(đã xoá 15/11, còn trong git)* `spec-giai-bai-ai.md` · `spec-luong-kho.md` · `spec-luong-kho-p0.md` · `kho-rules/README.md` · `kho-rules/*/k*.md` · `docs/luong-kho-kieu-1-hinh-hoc.md` | Thay bằng luật kho mới | `spec-giai-bai.md` |
