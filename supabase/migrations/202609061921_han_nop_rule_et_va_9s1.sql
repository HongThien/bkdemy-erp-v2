-- ============================================================================
-- 202609061921 — han_nop_rule_et_va_9s1
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO chốt 06/09, tiếp nối mig 202609061856):
--
--   ① ĐỔI rule `et`: "23h59 NGÀY DIỄN RA buổi học" — thay hẳn "hết ca + 15
--      phút" (202609031701). Không còn phụ thuộc `thoi_khoa_bieu` nữa (đơn
--      giản hơn, ít điểm chết hơn khi thiếu TKB).
--   ② Ngoại lệ THẬT đầu tiên lộ ra hạ tầng cũ (mig 202609061856) THIẾU 1
--      chiều: 9S1 học Thứ 3 (19:30) & Chủ Nhật (14:00) — khoảng cách CN→T3
--      chỉ 2 NGÀY (quá sát), nhưng T3→CN tới 5 ngày (bình thường). Một cột
--      `so_phut_lech` DUY NHẤT theo (lớp, loại) sẽ áp NHẦM cho CẢ HAI chiều —
--      đúng loại lỗi "so SỐ LƯỢNG không so NỘI DUNG" (CLAUDE.md §2 cảnh báo).
--      ⇒ Thêm cột `thu_bat_dau` (thứ của buổi GỐC sinh ra BTVN, quy ước như
--      `thoi_khoa_bieu.thu`: CN=8, T2..T7=2..7; 0 = áp cho MỌI buổi của lớp —
--      giữ được ca dùng chung như 202609061856). Khớp đúng thứ ưu tiên hơn
--      hàng mặc định (0).
--   ③ 9S1: buổi CN → hạn BTVN dời sang Thứ 5, GIỮ giờ theo công thức cũ (giờ
--      bắt đầu ca kế tiếp T3 = 19:30, trừ 2 giờ = 17:30), CHỈ dời ngày neo
--      +2 ngày (T3 → Thứ 5) ⇒ so_phut_lech = −120 + 2880 = 2760.
--      Buổi T3 → CN: CEO gọi "như bình thường", GIỮ NGUYÊN mặc định — không
--      thêm dòng ghi đè cho thu=3. ⚠ Lưu ý thật (không giấu): mặc định hiện
--      cho ra ~12:00 trưa CN (giờ bắt đầu CN 14:00 − 2h), KHÔNG phải "trước
--      CN 1 ngày" như mô tả miệng — CEO không yêu cầu đổi chiều này nên GIỮ
--      NGUYÊN, chỉ ghi chú lại để khỏi hiểu lầm sau này là đã áp "Thứ 7".
--
-- MẤT GÌ (Luật xoá): không xoá dữ liệu. `han_nop_ngoai_le` đang RỖNG (mig
--   trước mới tạo, chưa ai dùng) nên đổi PK (thêm `thu_bat_dau`) an toàn.
--   `han_nop_bai_test` CREATE OR REPLACE — bỏ nhánh tra `thoi_khoa_bieu` của
--   `et` (không cần nữa vì rule mới không neo theo ca).
-- ============================================================================

alter table public.han_nop_ngoai_le
  add column if not exists thu_bat_dau smallint not null default 0;
alter table public.han_nop_ngoai_le
  drop constraint if exists han_nop_ngoai_le_thu_check;
alter table public.han_nop_ngoai_le
  add constraint han_nop_ngoai_le_thu_check check (thu_bat_dau in (0,2,3,4,5,6,7,8));
alter table public.han_nop_ngoai_le drop constraint han_nop_ngoai_le_pkey;
alter table public.han_nop_ngoai_le add primary key (lop_id, loai, thu_bat_dau);

alter table public.han_nop_ngoai_le_log
  add column if not exists thu_bat_dau smallint;

create or replace function public.trg_han_nop_ngoai_le_log()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_actor uuid;
begin
  v_actor := coalesce(
    (select nhan_su_id from tai_khoan where id = public.jwt_uid()),
    (select id from nhan_su where email is not null
       and lower(email) = public.jwt_email() and public.jwt_email() <> '')
  );
  if tg_op = 'INSERT' then
    insert into han_nop_ngoai_le_log (lop_id, loai, thu_bat_dau, actor, so_phut_cu, so_phut_moi, ly_do)
    values (new.lop_id, new.loai, new.thu_bat_dau, v_actor, null, new.so_phut_lech, new.ly_do);
    return new;
  elsif tg_op = 'UPDATE' then
    insert into han_nop_ngoai_le_log (lop_id, loai, thu_bat_dau, actor, so_phut_cu, so_phut_moi, ly_do)
    values (new.lop_id, new.loai, new.thu_bat_dau, v_actor, old.so_phut_lech, new.so_phut_lech, new.ly_do);
    return new;
  else
    insert into han_nop_ngoai_le_log (lop_id, loai, thu_bat_dau, actor, so_phut_cu, so_phut_moi, ly_do)
    values (old.lop_id, old.loai, old.thu_bat_dau, v_actor, old.so_phut_lech, null, null);
    return old;
  end if;
end;
$$;

-- ── han_nop_bai_test: et = 23:59 ngày diễn ra (mới) · btvn = ca kế tiếp + lệch
--    (lệch tra theo (lớp, loại, thứ buổi gốc) — khớp đúng thứ ưu tiên hơn mặc định) ──
create or replace function han_nop_bai_test(p_lop uuid, p_ngay date, p_loai text)
returns timestamptz
language plpgsql
stable
as $$
declare
  v_ke date;
  v_bat time;
  v_lech integer;
  v_thu smallint := (case when extract(dow from p_ngay) = 0 then 8 else extract(dow from p_ngay) + 1 end);
begin
  select so_phut_lech into v_lech
  from han_nop_ngoai_le
  where lop_id = p_lop and loai = p_loai and thu_bat_dau in (0, v_thu)
  order by (thu_bat_dau = 0) asc  -- khớp đúng thứ (false) ưu tiên trước hàng mặc định (true)
  limit 1;

  if p_loai = 'et' then
    -- 23:59 NGÀY DIỄN RA buổi học (Thùy 06/09) + lệch nếu có ghi đè (mặc định 0).
    return (p_ngay::text || ' 23:59')::timestamp at time zone 'Asia/Ho_Chi_Minh'
           + make_interval(mins => coalesce(v_lech, 0));

  elsif p_loai = 'btvn' then
    -- CA KẾ TIẾP + lệch (mặc định −2 giờ = −120 phút, mig 202609041507).
    v_ke := buoi_ke_tiep(p_lop, p_ngay);
    if v_ke is null then return null; end if;
    select t.gio_bat_dau into v_bat
    from thoi_khoa_bieu t
    where t.lop_id = p_lop
      and t.thu = (case when extract(dow from v_ke) = 0 then 8 else extract(dow from v_ke) + 1 end)
      and t.hieu_luc_tu <= v_ke
      and (t.hieu_luc_den is null or v_ke <= t.hieu_luc_den)
    order by t.gio_bat_dau asc
    limit 1;
    if v_bat is null then return null; end if; -- buoi_ke_tiep tìm thấy thì slot phải có; phòng hờ
    return (v_ke::text || ' ' || v_bat::text)::timestamp at time zone 'Asia/Ho_Chi_Minh'
           + make_interval(mins => coalesce(v_lech, -120));

  elsif p_loai = 'giao_trinh' then
    return null; -- bài luyện: không hạn (Thùy 03/09) — chưa có ghi đè theo lớp

  else
    return null; -- de_thi và loại mới: staff tự đặt
  end if;
end;
$$;

comment on function han_nop_bai_test(uuid, date, text) is
  'Hạn nộp theo loại test. et=23:59 ngày diễn ra + lệch (mặc định 0) · btvn=ca kế tiếp + lệch (mặc định −2h) · lệch tra han_nop_ngoai_le theo (lop_id, loai, thứ buổi gốc — 0=mọi buổi), khớp đúng thứ ưu tiên hơn mặc định · giao_trinh=NULL · khác=NULL.';

-- ── 9S1: buổi CN quá sát buổi T3 kế tiếp (2 ngày) — dời hạn BTVN sang Thứ 5,
--    giữ giờ theo công thức cũ (17:30 = 19:30 giờ T3 − 2h), chỉ dời ngày neo ──
insert into public.han_nop_ngoai_le (lop_id, loai, thu_bat_dau, so_phut_lech, ly_do)
select id, 'btvn', 8, 2760,
  'Lịch CN→Thứ 3 chỉ cách 2 ngày (quá sát) — dời hạn BTVN giao từ buổi CN sang Thứ 5, giữ nguyên giờ trong ngày theo công thức cũ (giờ bắt đầu ca T3 trừ 2h), chỉ dời ngày neo +2 ngày. Buổi Thứ 3→CN (5 ngày, đủ thời gian) giữ mặc định, không đổi. (Thùy chốt 06/09)'
from public.lop where ten_lop = '9S1'
on conflict (lop_id, loai, thu_bat_dau) do update
  set so_phut_lech = excluded.so_phut_lech, ly_do = excluded.ly_do;

grant execute on function han_nop_bai_test(uuid, date, text) to authenticated;
