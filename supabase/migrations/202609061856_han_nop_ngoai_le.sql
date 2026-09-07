-- ============================================================================
-- 202609061856 — han_nop_ngoai_le
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO 06/09): hạn nộp (`han_nop_bai_test`, mig 202609041507) áp CÙNG 1
--   hằng số cho MỌI lớp — đã sửa 3 lần trong 3 tuần vì luật chung không khớp hết
--   ca lớp. Ví dụ thật: lớp 9S1 học CN–Thứ 3, hạn BTVN mặc định (giờ bắt đầu ca
--   kế tiếp −2h) rơi vào ngày HS không kịp làm, cần dời sang Thứ 4.
--
--   Quyết định (CEO chốt 06/09):
--   ① Ghi đè LƯU THAM SỐ chênh lệch (`so_phut_lech`, THAY hằng số mặc định
--      trong công thức), KHÔNG lưu hạn chót đã tính sẵn — anchor (hết ca / ca
--      kế tiếp qua TKB) không đổi, chỉ hằng số cộng/trừ là ghi đè được.
--   ② Chỉ `et`/`btvn` có công thức dạng mốc+lệch. `giao_trinh` (vô hạn) và
--      `de_thi` (staff tự đặt tay/bài) ngoài phạm vi — không có cột ghi đè.
--   ③ Ngoại lệ KHÔNG có hạn hiệu lực — có tác dụng đến lần sửa tiếp theo.
--   ④ Mọi sửa/xoá ghi vết bằng trigger (actor + cũ/mới + lý do) — CLAUDE.md §4,
--      khuôn y hệt `chi_khoan_log`/`trg_chi_khoan_log` (202609022329).
--   ⑤ Quyền bám GHẾ qua `co_chuc_nang`/`co_quyen_ghi('han_nop')` đã có
--      (202608151045) — CEO tick ở màn Phân quyền cho vai trò Thùy Trang, xong
--      không cần Claude cấp quyền cho các lần sau (Thùy: "để Trang tự đổi mà
--      t không phải care").
--
-- MẤT GÌ (Luật xoá): không xoá/đổi gì. Chỉ THÊM 2 bảng mới + sửa
--   `han_nop_bai_test` (CREATE OR REPLACE — công thức mặc định giữ nguyên,
--   chỉ thêm bước tra ghi đè trước khi dùng hằng số).
-- ============================================================================

-- ── bảng ngoại lệ (THƯA — chỉ có dòng khi lớp thật sự khác mặc định) ──
create table if not exists public.han_nop_ngoai_le (
  lop_id       uuid not null references public.lop(id),
  loai         text not null check (loai in ('et','btvn')),
  so_phut_lech integer not null,
  ly_do        text,
  created_by   uuid references public.nhan_su(id),
  updated_at   timestamptz not null default now(),
  primary key (lop_id, loai)
);

create table if not exists public.han_nop_ngoai_le_log (
  id          bigserial primary key,
  lop_id      uuid not null,
  loai        text not null,
  actor       uuid references public.nhan_su(id),
  at          timestamptz not null default now(),
  so_phut_cu  integer,
  so_phut_moi integer,  -- NULL = dòng bị xoá, quay về mặc định
  ly_do       text
);
create index if not exists han_nop_ngoai_le_log_idx on public.han_nop_ngoai_le_log(lop_id, loai, at);

-- ── trigger ghi vết (§4) — actor resolve đúng khuôn coalesce co_chuc_nang() đang dùng ──
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
    insert into han_nop_ngoai_le_log (lop_id, loai, actor, so_phut_cu, so_phut_moi, ly_do)
    values (new.lop_id, new.loai, v_actor, null, new.so_phut_lech, new.ly_do);
    return new;
  elsif tg_op = 'UPDATE' then
    insert into han_nop_ngoai_le_log (lop_id, loai, actor, so_phut_cu, so_phut_moi, ly_do)
    values (new.lop_id, new.loai, v_actor, old.so_phut_lech, new.so_phut_lech, new.ly_do);
    return new;
  else
    insert into han_nop_ngoai_le_log (lop_id, loai, actor, so_phut_cu, so_phut_moi, ly_do)
    values (old.lop_id, old.loai, v_actor, old.so_phut_lech, null, null);
    return old;
  end if;
end;
$$;

drop trigger if exists tg_han_nop_ngoai_le_log on public.han_nop_ngoai_le;
create trigger tg_han_nop_ngoai_le_log
  after insert or update or delete on public.han_nop_ngoai_le
  for each row execute function public.trg_han_nop_ngoai_le_log();

-- ── RLS: đọc = mọi nhân sự (hiểu vì sao lớp mình khác) · ghi = quyền 'han_nop' ──
alter table public.han_nop_ngoai_le     enable row level security;
alter table public.han_nop_ngoai_le_log enable row level security;

drop policy if exists han_nop_ngoai_le_sel on public.han_nop_ngoai_le;
drop policy if exists han_nop_ngoai_le_all on public.han_nop_ngoai_le;
create policy han_nop_ngoai_le_sel on public.han_nop_ngoai_le for select to authenticated
  using (public.la_thanh_vien());
create policy han_nop_ngoai_le_all on public.han_nop_ngoai_le for all to authenticated
  using (public.co_quyen_ghi('han_nop')) with check (public.co_quyen_ghi('han_nop'));

drop policy if exists han_nop_ngoai_le_log_sel on public.han_nop_ngoai_le_log;
create policy han_nop_ngoai_le_log_sel on public.han_nop_ngoai_le_log for select to authenticated
  using (public.la_thanh_vien());

grant select, insert, update, delete on public.han_nop_ngoai_le to authenticated;
grant select, insert on public.han_nop_ngoai_le_log to authenticated;
grant usage, select on sequence public.han_nop_ngoai_le_log_id_seq to authenticated;

-- ── han_nop_bai_test: tra ghi đè trước khi dùng hằng số mặc định, anchor giữ nguyên ──
create or replace function han_nop_bai_test(p_lop uuid, p_ngay date, p_loai text)
returns timestamptz
language plpgsql
stable
as $$
declare
  v_ke date;
  v_ket time;
  v_bat time;
  v_lech integer;
begin
  select so_phut_lech into v_lech from han_nop_ngoai_le where lop_id = p_lop and loai = p_loai;

  if p_loai = 'et' then
    -- HẾT CA + lệch (mặc định 15 phút, mig 202609031701). Không có TKB → 23:59 hôm đó.
    select t.gio_ket_thuc into v_ket
    from thoi_khoa_bieu t
    where t.lop_id = p_lop
      and t.thu = (case when extract(dow from p_ngay) = 0 then 8 else extract(dow from p_ngay) + 1 end)
      and t.hieu_luc_tu <= p_ngay
      and (t.hieu_luc_den is null or p_ngay <= t.hieu_luc_den)
    order by t.gio_ket_thuc desc
    limit 1;
    if v_ket is null then
      return (p_ngay::text || ' 23:59')::timestamp at time zone 'Asia/Ho_Chi_Minh';
    end if;
    return (p_ngay::text || ' ' || v_ket::text)::timestamp at time zone 'Asia/Ho_Chi_Minh'
           + make_interval(mins => coalesce(v_lech, 15));

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
  'Hạn nộp theo loại test. et=hết ca + lệch (mặc định 15'') · btvn=ca kế tiếp + lệch (mặc định −2h) · lệch tra từ han_nop_ngoai_le theo (lop_id, loai), không có thì dùng mặc định · giao_trinh=NULL · khác=NULL.';

grant execute on function han_nop_bai_test(uuid, date, text) to authenticated;
