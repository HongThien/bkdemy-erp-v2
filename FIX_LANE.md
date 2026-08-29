# FIX LANE — luồng Claude tự fix bug + làm tính năng theo order (v2, chốt 29/08)

> Lane này nhặt report **đã duyệt** (`cho_fix`) — gồm **BUG** (nhân sự báo, Thùy gật cổng 2) và
> **YÊU CẦU tính năng** (Thùy order từ màn Quản lý báo lỗi, vào thẳng `cho_fix`) — code trên
> **branch riêng → test trên dev → PR**, để Thùy duyệt qua **PR + Vercel preview**.
> Chạy **on-demand**: Thùy bảo "chạy fix-lane" trong 1 phiên Claude Code.
> Đọc HANDOFF trước khi fix. KHÔNG bao giờ chạm `main`.

## Vòng lặp (agent làm)
1. `git checkout main && git pull` (bắt đầu từ main mới nhất).
2. `node scripts/reports_pull.mjs` → đọc các report `cho_fix` (loại · id · màn · mô tả · lỗi console).
3. **Với MỖI report:**
   1. `git checkout -b fix/report-<8-ký-tự-đầu-id>` từ main (yêu cầu tính năng: `feat/order-<id8>`).
   2. Đọc kỹ mô tả + `route` (leaf màn) + `loi_gan_day` (console). Điều tra đúng chỗ → code.
   3. **BẮT BUỘC pass:** `npx tsc --noEmit -p tsconfig.json` **và** `npm run build`.
   4. **TEST TRÊN DEV (bắt buộc, READ-ONLY):** bật dev server, đăng nhập tài khoản test, mở đúng
      màn (`route`), nhìn bằng mắt (browser tools): hiển thị đúng? console sạch? thao tác ĐỌC ổn?
      - **CẤM thao tác GHI** — dev dùng chung DB Supabase THẬT. Không bấm nút lưu/tạo/xoá/duyệt.
      - Ca chỉ verify được bằng thao tác ghi → **DỪNG, hỏi Thùy** trong chat (nói rõ định bấm gì,
        ghi vào bảng nào). Thùy gật mới bấm; không gật thì ghi rõ trong fix_note phần chưa test được.
   5. Ghi **bằng chứng test** vào PR + `fix_note`: đã mở màn nào, thấy gì, console thế nào,
      phần nào CHƯA test được (và vì sao). Kèm ảnh chụp màn nếu thay đổi giao diện.
   6. `git add <file đã sửa>` (chỉ file của fix này) → `git commit` (nhắc id report trong message).
   7. `git push -u origin <branch>`.
   8. `gh pr create --title "fix: <tóm tắt> (report <id8>)" --body "<mô tả gốc + đã làm gì + bằng chứng test + cách Thùy test trên preview>"` → lấy URL PR.
   9. `node scripts/report_set.mjs <id> da_fix --branch=<branch> --pr=<URL> --note="<làm gì + test gì>"`.
4. Quay về main cho report kế tiếp. Mỗi report = **1 branch + 1 PR độc lập** (Thùy merge lần lượt).

## GUARDRAIL (nhốt agent — tuyệt đối)
- **CHỈ branch + PR.** KHÔNG push `main`, KHÔNG merge, KHÔNG `--force`.
- **DB production bất khả xâm phạm:**
  - Test trên dev = **READ-ONLY** (xem mục 3.4). Muốn ghi phải hỏi Thùy từng ca.
  - **KHÔNG áp migration.** Yêu cầu tính năng cần đổi schema → **SOẠN file migration trong branch
    (npm run new-migration), KHÔNG chạy** — ghi rõ trong PR "cần áp migration X trước khi merge";
    Thùy áp lúc duyệt. Cấm alter/drop/delete chạy thẳng vào DB dưới mọi hình thức.
  - KHÔNG xoá-sửa dữ liệu, KHÔNG đụng quyền-tiền trong lane. Report nào bản chất cần thứ đó
    → `node scripts/report_set.mjs <id> tu_lam --note="cần <X>, để người làm tay"`.
- Fix không sạch (build fail / test dev thấy sai / không chắc) → đừng đẩy rác:
  `report_set <id> tra_lai --note="<vướng gì>"`.
- 1 commit nhỏ map đúng 1 report → dễ revert. Chỉ `git add` file của fix, KHÔNG `git add -A`.

## Thùy (cổng duyệt — khi online)
- **Order tính năng:** màn Hệ thống → Quản lý báo lỗi → nút **"➕ Order tính năng"** (vào thẳng `cho_fix`).
- **Duyệt bug nhân sự báo:** cùng màn, report `moi` → Cho AI fix / Để tự làm / Từ chối.
- **Duyệt kết quả:** report `da_fix` có link PR → mở PR, bấm thử trên **Vercel preview** của branch
  → ưng thì Merge + bấm **"Đã apply (xong)"**; chưa ưng → **"Trả lại"** (agent sửa tiếp).
- PR ghi "cần áp migration" → chạy `npm run migrate` TRƯỚC khi merge (file nằm trong branch).

## Setup 1 lần (còn thiếu thì lane chưa chạy full)
- [ ] `gh auth login` trên máy này (Thùy làm — cần để agent mở PR).
- [x] Vercel auto-deploy: push branch → preview URL tự sinh (project đã nối GitHub).

## Công cụ
- `scripts/reports_pull.mjs` — in report `cho_fix` kèm loại bug/yêu-cầu (đọc `DATABASE_URL` .env).
- `scripts/report_set.mjs <id> <trang_thai> [--note=] [--branch=] [--pr=]` — cập nhật trạng thái.

## Host (tương lai — hiện tại chỉ #1)
- **#1 on-demand (ĐANG DÙNG):** Thùy mở phiên Claude Code, bảo "chạy fix-lane".
- **#2 cloud routine / #3 VPS:** nâng cấp sau khi #1 nghiệm ổn vài lượt (xem HANDOFF mục AUTO-REPORT).
