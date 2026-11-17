# FIX LANE — luồng fix tự động (auto-report Pha 2)

> Lane này nhặt report **đã được Thùy duyệt** (`cho_fix`), fix trên **branch riêng → PR**, để Thùy
> apply+test. **Host-agnostic**: chạy được ở on-demand (#1) / cloud routine (#2) / VPS (#3).
> Đọc DEVLOG/HANDOFF trước khi fix. KHÔNG bao giờ chạm `main`.

## Vòng lặp (agent làm)
1. `git checkout main && git pull` (bắt đầu từ main mới nhất).
2. `node scripts/reports_pull.mjs` → đọc các report `cho_fix` (id · màn · mô tả · người · lỗi console).
3. **Với MỖI report:**
   1. `git checkout -b fix/report-<8-ký-tự-đầu-id>` từ main.
   2. Đọc kỹ mô tả + `route` (leaf màn) + `loi_gan_day` (console). Điều tra đúng chỗ → fix.
   3. **BẮT BUỘC pass:** `npx tsc --noEmit -p tsconfig.json` **và** `npm run build`. Không pass → KHÔNG mở PR.
   4. `git add <file đã sửa>` (chỉ file của fix này) → `git commit` (nhắc id report trong message).
   5. `git push -u origin fix/report-<id>`.
   6. `gh pr create --title "fix: <tóm tắt> (report <id8>)" --body "<mô tả gốc + đã fix gì + cách test>"` → lấy URL PR.
   7. `node scripts/report_set.mjs <id> da_fix --branch=fix/report-<id> --pr=<URL> --note="<fix gì>"`.
4. Quay về main cho report kế tiếp. Mỗi report = **1 branch + 1 PR độc lập** (Thùy merge lần lượt).

## GUARDRAIL (nhốt agent — tuyệt đối)
- **CHỈ branch + PR.** KHÔNG push `main`, KHÔNG merge, KHÔNG `--force`.
- **KHÔNG migration / đổi schema / xoá-sửa dữ liệu / đụng quyền-tiền** trong lane tự động. Report nào cần
  thứ đó → `node scripts/report_set.mjs <id> tu_lam --note="cần <X>, để người làm tay"` (KHÔNG tự làm).
- Fix không sạch (build fail / không chắc) → đừng đẩy rác: `report_set <id> tra_lai --note="<vướng gì>"`.
- 1 commit nhỏ map đúng 1 report → dễ revert. Chỉ `git add` file của fix, KHÔNG `git add -A` (tránh gom việc context khác).

## Thùy (cổng 4 — khi online)
- Vào **Hệ thống → Quản lý báo lỗi** → report `da_fix` có link PR → mở PR, test trên preview.
- Ưng → merge PR → bấm **"Đã apply (xong)"** (`xong`). Chưa ưng → **"Trả lại"** (`tra_lai`, agent sửa tiếp).

## Host chạy lane (chọn 1)
- **#1 on-demand:** mở 1 phiên Claude Code, bảo "chạy fix-lane". Zero infra, máy phải bật lúc chạy.
- **#2 cloud routine (Anthropic):** routine cron chạy runbook này. Cần secret `DATABASE_URL` + GitHub token (push/PR) + repo access. Máy tắt vẫn chạy. ⚠ phải SPIKE xem clone+push+đọc-DB+build có chạy không.
- **#3 VPS luôn bật:** cron chạy runbook. Full toolchain (build/test trước PR) — chắc nhất.

## Công cụ
- `scripts/reports_pull.mjs` — in report `cho_fix` (đọc `DATABASE_URL`).
- `scripts/report_set.mjs <id> <trang_thai> [--note=] [--branch=] [--pr=]` — cập nhật trạng thái (ghi `DATABASE_URL`).
