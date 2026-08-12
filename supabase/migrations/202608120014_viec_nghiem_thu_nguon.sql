-- ============================================================================
-- 202608120014 — viec_nghiem_thu_nguon
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Việc 'dat' do NGƯỜI duyệt và 'dat' do giaoviec_housekeeping() TỰ ĐÓNG sau 7 ngày
--   hiện KHÔNG phân biệt được: cả hai đều có nghiem_thu_at, chat_luong, phan_tram.
--   Dấu duy nhất là chuỗi '[tự đóng: ...]' nhét trong ghi_chu_nghiem_thu — text tự do,
--   không đếm được. Trợ lý AI (phase 2) đọc bảng này sẽ tưởng lỗ đen là việc đạt 100%
--   rồi báo team khoẻ trong khi thực tế không ai nghiệm thu.
--
--   Tách ra cột riêng để (a) đọc ĐÚNG, (b) ĐẾM được. Số lần tự đóng chính là chỉ số
--   đo trợ lý có chặn được lỗ đen không: trợ lý chạy đúng thì cột này không bao giờ
--   nhận thêm 'tu_dong' (CEO 08-11: "2 ngày là phải clear rồi").
--
--   ⚠ Ngưỡng TU_DONG_DONG_NGAY=7 GIỮ NGUYÊN — nó là VAN XẢ cuối cùng, không phải
--   ngưỡng nhắc. Ngưỡng nhắc (2 ngày) sống ở view của trợ lý, không sống ở đây.
--   Mục tiêu là van không bao giờ mở, chứ không phải bỏ van.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   KHÔNG mất dữ liệu. Thêm 1 cột + backfill từ dấu vết đã có sẵn.
--   · `drop constraint if exists` chỉ để IDEMPOTENT (migrate.mjs chạy lại TOÀN BỘ
--     migration mỗi lần, không có bảng tracking) — gỡ rồi thêm lại y nguyên, cùng
--     transaction, không có khoảnh khắc nào bảng thiếu ràng buộc.
--   · ghi_chu_nghiem_thu GIỮ NGUYÊN chuỗi '[tự đóng: ...]': cột mới cho MÁY đếm,
--     chuỗi cũ cho NGƯỜI đọc trên UI. Không xoá chữ của ai cả.
--   · KHÔNG sửa file migration 202607311326 (lịch sử bất biến). Hàm được
--     `create or replace` lại ở đây; file này sort SAU nên bản này thắng.
-- ============================================================================

alter table viec add column if not exists nghiem_thu_nguon text;

comment on column viec.nghiem_thu_nguon is
  'Ai đóng việc: nguoi = leader bấm nghiệm thu · tu_dong = giaoviec_housekeeping() xả sau TU_DONG_DONG_NGAY ngày. NULL = chưa nghiệm thu. Đếm ''tu_dong'' theo tuần = chỉ số đo trợ lý AI có chặn được lỗ đen không.';

alter table viec drop constraint if exists viec_nghiem_thu_nguon_ck;
alter table viec add constraint viec_nghiem_thu_nguon_ck
  check (nghiem_thu_nguon is null or nghiem_thu_nguon = any (array['nguoi', 'tu_dong']));

-- ── Backfill — THỨ TỰ HAI LỆNH DƯỚI ĐÂY LÀ BẮT BUỘC ─────────────────────────
-- Bắt marker TRƯỚC, phần dư mới là người duyệt. Đảo lại thì mọi dòng tự-đóng bị gán
-- 'nguoi' (chúng cũng có nghiem_thu_at), và cái sai đó IM LẶNG: không lỗi, không cảnh
-- báo, chỉ là chỉ số vĩnh viễn bằng 0 → tưởng trợ lý hoàn hảo.
-- Cả hai chốt bằng `nghiem_thu_nguon is null` ⇒ lần chạy thứ hai không đụng dòng nào.
update viec set nghiem_thu_nguon = 'tu_dong'
 where nghiem_thu_nguon is null
   and ghi_chu_nghiem_thu like '%[tự đóng:%';

update viec set nghiem_thu_nguon = 'nguoi'
 where nghiem_thu_nguon is null
   and nghiem_thu_at is not null;

-- ── Hàm housekeeping: từ nay ghi thẳng cột mới ──────────────────────────────
-- Chép y nguyên bản gốc (202607311326 §6), CHỈ thêm 1 dòng `nghiem_thu_nguon`.
-- Hằng số vẫn ĐỒNG BỘ với src/lib/giaoviec-config.ts (§4.8):
--   TU_DONG_DONG_NGAY=7 · NGU_DONG_THANG=3 · TRE_MOI_NGAY=10 · SAN_TIEN_DO=40
--   W_TIEN_DO=0.3 · W_CHAT_LUONG=0.7
--
-- ⚠ SỬA COMMENT SAI CỦA BẢN GỐC: bản gốc ghi "gọi lazy khi mở màn Review/Cá nhân",
--   nhưng grep toàn repo ra ĐÚNG MỘT nơi gọi — src/screens/giaoviec/WeeklyPlanningTab.tsx.
--   Nghĩa là dữ liệu chỉ được dọn khi có người mở đúng tab đó. Hệ quả cho phase 2:
--   view của trợ lý PHẢI TỰ SUY trạng thái quá-hạn tại chỗ, KHÔNG được chờ hàm này
--   chạy — worker không mở tab bao giờ, nên nó và người ngồi nhìn màn hình sẽ thấy
--   hai thực tại khác nhau mà không ai phát hiện ra.
create or replace function public.giaoviec_housekeeping() returns void
language plpgsql security definer set search_path = public as $$
begin
  -- (a) cho_nghiem_thu quá 7 ngày → TỰ ĐÓNG 'dat' mặc định (chất lượng 100). Lỗ đen là lỗi sếp (§4.6).
  update viec v set
    trang_thai   = 'dat',
    ngay_nop     = coalesce(v.ngay_nop, (v.hoan_thanh_at at time zone 'Asia/Ho_Chi_Minh')::date),
    tien_do      = t.td,
    chat_luong   = (array[100,85,70])[least(v.so_lan_tra_lai,2)+1],
    phan_tram    = round((0.3 * t.td + 0.7 * (array[100,85,70])[least(v.so_lan_tra_lai,2)+1])::numeric, 1),
    nghiem_thu_at = now(),
    nghiem_thu_nguon = 'tu_dong',
    ghi_chu_nghiem_thu = coalesce(v.ghi_chu_nghiem_thu,'') || '[tự đóng: quá 7 ngày chờ nghiệm thu]'
  from (
    select id, case when d <= 0 then 100 else greatest(40, 100 - 10 * d) end as td
    from (
      select id, greatest(0, ((hoan_thanh_at at time zone 'Asia/Ho_Chi_Minh')::date - deadline)) as d
      from viec
      where trang_thai = 'cho_nghiem_thu'
        and hoan_thanh_at is not null
        and hoan_thanh_at < now() - interval '7 days'
    ) x
  ) t
  where v.id = t.id and v.trang_thai = 'cho_nghiem_thu';

  -- (b) backlog nằm quá 3 tháng chưa chọn → tự NGỦ ĐÔNG (không xoá, vẫn tra được §2.3)
  update y_tuong set trang_thai = 'ngu_dong'
  where trang_thai = 'backlog'
    and ngay_vao_backlog is not null
    and ngay_vao_backlog < (now() at time zone 'Asia/Ho_Chi_Minh')::date - interval '3 months';
end $$;
