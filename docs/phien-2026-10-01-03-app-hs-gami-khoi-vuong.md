# Phiên 01–03/10/2026 — App HS: kit gamification · Nhiệm vụ + Rank ra màn chính · style Khối vuông

> Lưu 09/10 để Thùy clear và mở phiên mới. Luồng **[Giao diện]** của release App HS V1.0 (`spec-v1-app-hs.md` §13).
> Nhật ký thô từng bước: `DEVLOG.md` (mục `2026-10-01 [Giao diện] (máy BK_v2)` → `2026-10-03 … tiếp`). Đơn hình: `design/DON-HANG-GAMI-HS.md`,
> `design/DON-HANG-STYLE-KHOI.md`. Kế hoạch style: `spec-giao-dien-hs.md` §10.

## 0. Đọc nhanh cho phiên mới

- **Repo làm việc: `C:\Users\Admin\Desktop\BK_v2\bkdemy-erp-v2`** (clone, nhánh `main`). Worktree `Desktop\2\…\student-app-design-f72cd3`
  mà phiên này mở ra đã cũ hàng trăm commit — **đừng code ở đó**.
- Cài thư viện: `npm install --package-lock=false` (`npm ci` lỗi vì lock lệch `package.json`, đừng sửa lock). Có `.env` (VITE_* + `DATABASE_URL_RO`
  chỉ đọc — **không có chuỗi GHI**, migration phải Thùy chạy).
- Xem app không cần đăng nhập: `hs.html?xem=gami&skin=<rpg|khoi|toi_gian>&man=<home|nhiem_vu|album|rank|ho_so|bo_hinh>[&tt=1..3][&nen=…][&an]`.
- Mọi việc của phiên **đã commit + push `main`**. **Production CHƯA deploy** (09/10: bundle `hs.bkacademy.edu.vn` chưa có `skin/khoi`). Deploy = Thùy
  bấm tay: Vercel → `bkdemy-erp-v2-hs` → Deployments → Create Deployment → `main` (auto-deploy tắt từ 07/09).

## 1. Đã làm

| Ngày | Việc | Commit |
|---|---|---|
| 01/10 | Ghép kit gamification: 72 hình ChatGPT nhận diện bằng mắt + đổi tên → `design/bk-ui-src/gami/`; 8 huy hiệu × 5 sao + **khoá dựng từ ★1**; 10 biểu tượng bậc; nén vào `public/bk-ui/hs/gami/{huy-hieu,rank}`; `KIT.huy_hieu` bật, cờ rank tách `rank_bieu_tuong` (bật) / `rank_khung` (tắt) | `64cd092f` |
| 01/10 | Dựng lại **Nhiệm vụ · Album · lớp phủ "Huy hiệu mới"** theo 8 ảnh toàn cảnh (`design/handoff/gami-v1/reference/*.jpg`); màu game gom `gami/hinh.ts` | `64cd092f` |
| 01/10 | **Ô Nhiệm vụ + ô Rank trên màn chính** (theo môn, ẩn khi RPC null) + **huy hiệu bậc cạnh tên** (bấm ⇒ Rank) | `64cd092f` |
| 01/10 | PWA: `huy-hieu` + `rank` ra khỏi precache (`vite.config.hs.ts` globIgnores) | `64cd092f` |
| 01/10 | Ảnh gốc gami ~140 MB **ngoài git** (`.gitignore`), bản chính trên Drive | `9cf2ecf9` |
| 01/10 | Soạn **style Khối vuông** (cảm hứng Minecraft): đơn ChatGPT K1 (màn chính + bộ hình) + K2 (bản đồ + quái, cùng tên Đơn 6), nền mặc định **anh đào hoàng hôn**, "giống Minecraft nhất có thể mà không vi phạm bản quyền" (luật ĐƯỢC/CẤM) | `79e2cb9a` `deadd837` `9d7480a0` |
| 03/10 | Kiểm hàng Khối vuông: **K1 30/31, K2 41/41**; xếp vào `design/bk-ui-src/khoi/` (+ `phieu-luu/`, `_thua/`, log đổi tên); Drive | `53385aa4` `b1c67e2a` `49099538` |
| 03/10 | **Dựng style Khối vuông vào app** làm lựa chọn: `skin/styles/khoi.ts`, 26 ảnh `public/bk-ui/hs/skin/khoi/`, font Handjet, biến `--sk-radius-pill`, bóng chữ tối chỉ ở chế độ tối, `&skin=` cho trang mẫu | `e65a00e9` |
| 03/10 | Migration `202610030147_hs_giao_dien_skin_khoi` (CHECK skin + `khoi`) — **Thùy ĐÃ áp qua SQL Editor** (kèm dòng `_migrations`); `schema.md` cập nhật | `f677aa3d` |

## 2. Quyết định của Thùy (còn hiệu lực)

- Dáng huy hiệu nhận như ChatGPT vẽ · **khoá** Claude dựng từ ★1 · icon nhiệm vụ giữ bộ 29/09 (bộ vẽ lại thiếu N1–N3).
- **Hình gamification giữ 1 BỘ CHUNG mọi style** (không vẽ bản khối vuông).
- Khối vuông là **lựa chọn thêm**, Anime RPG vẫn mặc định · **chưa cần bản tối** · tên trong app "Khối vuông" (không chữ "Minecraft").
- Ảnh gốc ChatGPT bộ lớn: **ngoài git, cất Drive** — gami: `…/folders/1SuezN0GRVndmnU25MaDfcR1r12ha3aYA` · khoi: `…/folders/1eZN5eRK8SxtcTjl6LXxSiuWhlp1qPjnE`.
- Màn chính cấp 1 (HomeCap1) **chưa** thêm ô Nhiệm vụ/Rank — để sau.

## 3. Sau phiên này các phiên khác đã đổi (đọc trước khi sửa tiếp)

- `4715707e` (03/10): màn chính xếp lại — Thế giới BK lên đầu · **Nhiệm vụ + Thư viện BK (Rank bên trong) ở khối Giải trí** · bỏ ô Bài tập được giao
  ⇒ ô Rank / Nhiệm vụ phiên này đặt ở Học tập đã được dời.
- `6a0e3428` (03/10): lời chữ theo style (`skin/loi.ts`, `Skin.loi` — Khối vuông dùng `LOI_GAME`).
- `af9db276` (06/10), `596ddd5f` (07/10): Khối vuông có thêm **bản đồ (K2), quái, Đơn K3 49 hình, khu Học tập, Chinh phục BK, sân Đấu trường**
  (`khoi.ts` khai `the3d`, `banDo2d`, `quai2d`, `sanDau`, `game`…). Xem HANDOFF mục "GIAO DIỆN APP HS — CẬP NHẬT CUỐI NGÀY 03/10" + DEVLOG 06–07/10.

## 4. Việc còn treo

- **Deploy app HS** (Thùy bấm) — sau đó soi bundle prod có `skin/khoi`.
- Khối vuông: **nợ #29 `khoi_b_kiem_tra_lai`** (banner kiểm tra lại đang tắt `RETEST_BAT=false` ⇒ không chặn). Đơn bổ sung ở đầu `DON-HANG-STYLE-KHOI.md`.
- Gami còn thiếu hình: Đơn 3 **10 khung avatar** + 3 hình chung (sao · hào quang thần · lên bậc) + 6 ảnh toàn cảnh Rank · Đơn 2 hình bí ẩn + 8 phôi bản cứng ·
  (tuỳ) N1–N3 nét bộ mới. Kiểm hàng ở đầu `DON-HANG-GAMI-HS.md`.
- Precache app HS phình (19,6 → ~26 MB, kéo cả hình app khác trong `public/`) — đã gợi ý 1 việc riêng, chưa làm.
- **File `design/bk-ui-src/khoi-20261006T102912Z-1-001.zip`** (Thùy tải Drive về) nằm NGOÀI thư mục được ignore ⇒ ai `git add .` là lên git
  — chưa đụng (Luật xoá: hỏi Thùy).
- Lỗ hợp đồng style: ~170 chỗ `rounded-full`/`999px` ở màn con chưa dùng `--sk-radius-pill` · ô lõm túi đồ vát ngược (`--sk-o-shadow`) chưa có.

## 5. Bài học / bẫy (đã gặp thật trong phiên)

- **Hình ChatGPT về tên mặc định ở GỐC `bk-ui-src/`** — nhận diện bằng mắt (ghép tấm xem trên nền tối), đếm sao/đối chiếu đơn; **thứ tự giờ tải không tin được**
  (Zeus ★2/★3 đảo). Gán theo vị trí = gắn nhầm âm thầm.
- **Lệnh Bash heredoc dài (có ký tự đặc biệt) bị vỡ** ⇒ ghi script Python ra file scratchpad rồi chạy.
- **`.gitignore` không hiểu chú thích cuối dòng** (`path/  # ghi chú` = mẫu hỏng) — luôn kiểm bằng `git check-ignore -v`.
- **Hợp đồng `nenTen`**: trước "có tấm tên ⇒ bóng chữ TỐI toàn trang" — đúng cho style tối, làm nhoè chữ tối của style sáng ⇒ giờ chỉ bật khi chế độ tối.
- **Style sáng trên tranh nhiều màu:** tiêu đề chữ tối đè tranh không đọc được ⇒ phủ sương sáng ~1/4 trên tranh; màu nhấn dùng làm CHỮ phải đủ tương phản
  (xanh cỏ sáng trên xám chỉ ~2:1).
- **Migration khi máy chỉ có `DATABASE_URL_RO`:** soạn 1 khối SQL dán SQL Editor **kèm dòng sổ** `insert into _migrations (ten, bam)` — `bam` = sha256 nội dung
  file đã bỏ `\r`, 16 ký tự đầu (khớp `scripts/migrate.mjs`). Kiểm trước `pg_has_role('postgres','claude_build','USAGE')` để chắc SQL Editor ALTER được bảng.
- **Mỗi lần `git pull --rebase` đều xung đột `DEVLOG.md`** (các luồng cùng nối cuối file) ⇒ giữ cả hai (bên origin trước, mình sau). Commit theo đường dẫn, không `git add .`.
- **Chụp màn để soát:** ô Browser của app hay treo khi chụp ⇒ dùng `puppeteer-core` (có sẵn trong repo) + Chrome máy (`C:/Program Files/Google/Chrome/Application/chrome.exe`),
  kiểm luôn ảnh vỡ (`naturalWidth === 0`) + tràn ngang.
- **Font pixel tiếng Việt:** Press Start 2P / Pixelify Sans / Silkscreen mất dấu; **Handjet / VT323 / Bungee đủ dấu** (kiểm unicode-range `U+1EA0-1EF9` của Google Fonts CSS).

## 6. Câu mở đầu gợi ý cho phiên mới

```
Đọc CLAUDE.md, HANDOFF.md (① mục GIAO DIỆN APP HS) và docs/phien-2026-10-01-03-app-hs-gami-khoi-vuong.md.
Làm trong C:\Users\Admin\Desktop\BK_v2\bkdemy-erp-v2 (git pull trước). Việc hôm nay: <ghi việc>.
```
