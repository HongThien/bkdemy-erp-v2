# scripts/kien-truc/do — script dò, so khớp, sinh migration của đợt kiến trúc 13/11/2026

Chép từ thư mục tạm của phiên 13/11 để máy khác (và phiên sau) dùng lại được. Bối cảnh: `spec-kien-truc.md`, `HANDOFF.md` mục "KIẾN TRÚC ĐỂ CHỊU 1.000 → 10.000 HS", bằng chứng `reports/audit-scale-13-11.md`.

**Cách chạy** (từ gốc repo; script đọc `DATABASE_URL` trong `.env`, ghi file ra thư mục `SCR`):

```bash
SCR=/tmp/kt node scripts/kien-truc/do/khao-sat.mjs
```

Tạo thư mục `SCR` trước. Phần lớn script chỉ ĐỌC (`default_transaction_read_only`) hoặc chạy trong transaction rồi `ROLLBACK`.
Script tên `*-sinh*` / `cuu` / `don` chỉ SINH file `.sql` vào `SCR` — không tự áp; SQL của chúng đã được áp và nằm trong `supabase/migrations/`.

## Dùng lại được

| File | Làm gì |
|---|---|
| `khao-sat.mjs` | Khảo sát tổng: realtime, RLS, quyền hàm, bảng tính sẵn, dead tuple, log lớn, hàm không ai tham chiếu (cần `pss.json` trong `SCR` — xem bên dưới) |
| `kiem-bm.mjs` | Kiểm nhanh các lỗ quyền: bảng không RLS, hàm anon gọi được, view không `security_invoker`, thân `la_thanh_vien` |
| `doi-xung.mjs` | Đo mức nhân bản bảng/hàm theo nhánh môn |
| `d0-do.mjs` | anon thực tế gọi gì (pss), role nào có quyền gì, default privileges |
| `d0-dump.mjs` | Dump hàm + tìm hàm anon gọi được xuất hiện ở code ngữ cảnh khách |
| `d0b-hs2.mjs` | **Đồ thị import từ `src/main-hs.tsx` ở MỨC EXPORT của `src/lib`** → app HS thật sự chạm bảng / view / hàm invoker nào (cần `d0b-fns.json` do `d0b-do.mjs` ghi) |
| `d0b-x.mjs` | Hàm invoker có đường chạm một tập view; trigger / policy / view / lượt gọi API liên quan |
| `gop-do-ham.mjs` | Hàm đọc `alias.*` / `select *` / kiểu dòng trên một họ bảng (vỡ khi thêm cột) |
| `gop-trung-ten.mjs`, `gop-tran.mjs`, `gop-dong.mjs` | Biến / tham số / tên dùng trần trùng tên cột mới (tĩnh và SQL động) |
| `gop-lech.mjs` | Bảng chỗ lệch cột giữa các nhánh của một họ |
| `kiem-thay.mjs` | Rà thân hàm đã sửa có bị chèn rác do `String.replace` không |
| `viec.mjs`, `viec2.mjs`, `xh.mjs` | Mẫu "sửa hàm bằng thay chuỗi + khoá md5 + so cũ–mới cho TỪNG nhân sự trong rollback" |
| `tra-thu.mjs`, `view-thu.mjs` | Mẫu "dựng bảng tính sẵn + so khớp với đường cũ + thử trigger" và "đổi view, so nội dung + đo trước–sau" |

## Tư liệu (đã áp, giữ để truy lại)

`d0-sinh / d0-thu / d0-chitiet / d0-kiem2` (đợt 0a) · `d0b-do / d0b-hs / d0b-sinh / d0b-thu` (0b) · `d0c-do / d0c-sinh-thu` (0c-1) · `d2-index / d2-ham` (index) · `mau-thu` (họ mẫu gộp partition — **cách này đã thất bại, xem spec §2b**) · `cuu` (tách partition) · `don` (xoá bảng rỗng + index sai).

## Lấy `pss.json` (thống kê câu lệnh)

```sql
select r.rolname, s.query q, s.calls, s.total_exec_time t, s.mean_exec_time m, s.max_exec_time mx
from public._audit_pss() s left join pg_roles r on r.oid = s.userid;
```

Số là CỘNG DỒN — muốn số hiện tại thì chụp hai lần rồi lấy hiệu.

## Bẫy khi viết script kiểu này

- Regex trong heredoc bị shell nuốt `\\` ⇒ ghi script ra file rồi chạy.
- JS `a.replace(b, c)`: chuỗi `c` chứa `$'` / `$&` bị hiểu là ký hiệu đặc biệt ⇒ dùng `split(b).join(c)`.
- Áp nhiều migration liên tiếp: giãn nhịp, tránh khe cron (phút chia hết cho 5).
