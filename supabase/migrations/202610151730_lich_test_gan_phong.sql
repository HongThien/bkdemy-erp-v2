-- ============================================================================
-- 202610151730 — LỊCH TEST GẮN PHÒNG + THÔNG VỚI QUẢN LÝ PHÒNG HỌC (Thùy 15/10)
-- ----------------------------------------------------------------------------
-- Thùy chốt: mỗi khung test = 1 phòng · GIỮ TRỌN KHUNG trên Lịch phòng (kể cả chưa có hẹn) ·
--   KHÔNG giới hạn số em theo sức chứa · trùng TKB/khung test khác cùng phòng ⇒ CHẶN không cho lưu;
--   buổi lẻ (bù/bổ trợ/phát sinh) trùng ⇒ chỉ cảnh báo (fn_ts_khung_trung_phong).
-- Lịch phòng (src/lib/phong.ts lichPhongNgay) thêm nguồn thứ 4 = fn_phong_lich_test_ngay(ngay):
--   buổi test của khung chưa bỏ, buổi chưa đóng. Đóng buổi test ⇒ phòng tự trả lại.
-- lich_test_khung đang 0 dòng (kiểm 15/10) ⇒ thêm cột NOT NULL thẳng.
-- MẤT GÌ (Luật xoá): không.
-- ============================================================================

alter table public.lich_test_khung add column if not exists phong_id uuid not null references public.phong(id);

-- TKB dùng thu 2..7 = T2..T7, 8 = CN; khung test dùng ISO 1..7
create or replace function public._ts_thu_tkb(p_thu_iso integer) returns integer
language sql immutable as $$ select case when p_thu_iso = 7 then 8 else p_thu_iso + 1 end $$;

-- Xung đột của 1 khung (định lưu) với phòng: loai 'chan' = TKB / khung test khác (lặp hằng tuần),
-- 'canh_bao' = buổi lẻ trong 60 ngày tới (buổi học bù/bổ trợ, hoạt động phát sinh).
create or replace function public.fn_ts_khung_trung_phong(p_phong uuid, p_thu integer, p_tu time, p_den time, p_bo_qua uuid default null)
returns table (muc text, nguon text, mo_ta text)
language sql stable security definer set search_path = public as $$
  with ph as (select ma_phong from phong where id = p_phong),
  ngay_toi as (
    select d::date ngay from generate_series(public._ts_gio_vn()::date, public._ts_gio_vn()::date + 60, interval '1 day') d
    where extract(isodow from d)::int = p_thu
  )
  select 'chan', 'tkb', l.ten_lop || coalesce(' · ' || l.mon, '') || ' ' || to_char(t.gio_bat_dau, 'HH24:MI') || '–' || to_char(t.gio_ket_thuc, 'HH24:MI')
  from thoi_khoa_bieu t join lop l on l.id = t.lop_id, ph
  where btrim(t.phong) = ph.ma_phong and t.thu = public._ts_thu_tkb(p_thu)
    and (t.hieu_luc_den is null or t.hieu_luc_den >= public._ts_gio_vn()::date)
    and t.gio_bat_dau < p_den and p_tu < t.gio_ket_thuc
  union all
  select 'chan', 'test', 'Khung test khác ' || to_char(k.gio_bat_dau, 'HH24:MI') || '–' || to_char(k.gio_ket_thuc, 'HH24:MI')
  from lich_test_khung k
  where k.phong_id = p_phong and k.thu = p_thu and k.xoa_at is null and k.id is distinct from p_bo_qua
    and k.gio_bat_dau < p_den and p_tu < k.gio_ket_thuc
  union all
  select 'canh_bao', 'buoi', to_char(b.ngay, 'DD/MM') || ' ' || coalesce(l.ten_lop, b.loai) || ' (' || b.loai || ') '
         || to_char(b.gio_bat_dau, 'HH24:MI') || '–' || to_char(b.gio_ket_thuc, 'HH24:MI')
  from buoi_hoc b join ngay_toi n on n.ngay = b.ngay left join lop l on l.id = b.lop_id, ph
  where btrim(b.phong) = ph.ma_phong and b.trang_thai <> 'huy' and b.loai <> 'thuong'
    and b.gio_bat_dau < p_den and p_tu < b.gio_ket_thuc
  union all
  select 'canh_bao', 'phat_sinh', to_char(h.ngay, 'DD/MM') || ' ' || h.tieu_de || ' ' || to_char(h.gio_bat_dau, 'HH24:MI') || '–' || to_char(h.gio_ket_thuc, 'HH24:MI')
  from hoat_dong_phong h join ngay_toi n on n.ngay = h.ngay
  where h.phong_id = p_phong and h.trang_thai = 'xac_nhan' and h.gio_bat_dau < p_den and p_tu < h.gio_ket_thuc
$$;

-- Chặn ở DB (mọi đường ghi): khung test trùng TKB hoặc khung test khác cùng phòng
create or replace function public._ts_khung_chan_trung() returns trigger
language plpgsql security definer set search_path = public as $$
declare v text;
begin
  if new.xoa_at is not null then return new; end if;
  if not exists (select 1 from phong where id = new.phong_id and dang_hoat_dong) then
    raise exception 'Phòng này đang ngừng hoạt động';
  end if;
  select string_agg(mo_ta, '; ') into v
  from public.fn_ts_khung_trung_phong(new.phong_id, new.thu, new.gio_bat_dau, new.gio_ket_thuc, new.id) where muc = 'chan';
  if v is not null then raise exception 'Phòng bị trùng lịch cố định: %', v; end if;
  return new;
end $$;
drop trigger if exists trg_lich_test_khung_chan_trung on public.lich_test_khung;
create trigger trg_lich_test_khung_chan_trung before insert or update of phong_id, thu, gio_bat_dau, gio_ket_thuc, xoa_at
  on public.lich_test_khung for each row execute function public._ts_khung_chan_trung();

-- Nguồn "Test đầu vào" cho Lịch phòng 1 ngày: giữ trọn khung, kèm số hẹn để nhìn
create or replace function public.fn_phong_lich_test_ngay(p_ngay date)
returns table (khung_id uuid, ma_phong text, gio_bat_dau time, gio_ket_thuc time, so_hen integer)
language sql stable security definer set search_path = public as $$
  select k.id, p.ma_phong, k.gio_bat_dau, k.gio_ket_thuc,
         (select count(*)::int from dang_ky_test h where h.khung_id = k.id and h.ngay = p_ngay and h.trang_thai = 'hen')
  from lich_test_khung k join phong p on p.id = k.phong_id
  where k.xoa_at is null and k.thu = extract(isodow from p_ngay)::int
    and not exists (select 1 from lich_test_dong x where x.khung_id = k.id and x.ngay = p_ngay)
    and public.la_thanh_vien()
$$;

-- Màn Lộc: buổi kèm phòng
create or replace function public.fn_ts_lich_test_tong_quan(p_tu date default null, p_so_ngay integer default 14)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_now timestamp := public._ts_gio_vn();
  v_tu  date := coalesce(p_tu, v_now::date);
  v_den date := coalesce(p_tu, v_now::date) + least(greatest(p_so_ngay, 1), 90) - 1;
  v jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Không có quyền'; end if;
  with hen as (
    select h.*, u.ma_uv, u.ho_ten_hs, u.sdt_ph, u.khoi as lop, u.truong_hoc, u.level, u.trang_thai as uv_trang_thai,
           exists (select 1 from ca_test c where c.ung_vien_id = h.ung_vien_id and c.mon = h.mon and c.trang_thai <> 'huy') as da_den
    from dang_ky_test h join ung_vien u on u.id = h.ung_vien_id
    where h.trang_thai = 'hen'
  ),
  hen_j as (
    select h.*, jsonb_build_object(
      'id', h.id, 'lan_dk_id', h.lan_dk_id, 'ung_vien_id', h.ung_vien_id, 'ma_uv', h.ma_uv, 'ho_ten_hs', h.ho_ten_hs,
      'sdt_ph', h.sdt_ph, 'lop', h.lop, 'truong', h.truong_hoc, 'mon', h.mon, 'khung_id', h.khung_id, 'ngay', h.ngay,
      'gio_bat_dau', to_char(h.gio_bat_dau, 'HH24:MI'), 'gio_xong', to_char(h.gio_xong, 'HH24:MI'), 'thoi_luong_phut', h.thoi_luong_phut,
      'nguon', h.nguon, 'kenh', h.kenh, 'truong_tu_go', h.truong_tu_go, 'created_at', h.created_at,
      'tinh_trang', case when h.da_den then 'da_den' when (h.ngay + h.gio_xong) < v_now then 'lo_hen' else 'cho' end) j
    from hen h
  ),
  buoi as (
    select k.id khung_id, d::date ngay, k.gio_bat_dau tu, k.gio_ket_thuc den, k.xoa_at is not null khung_da_xoa, k.phong_id,
           exists (select 1 from lich_test_dong x where x.khung_id = k.id and x.ngay = d::date) dong
    from generate_series(v_tu, v_den, interval '1 day') d
    join lich_test_khung k on k.thu = extract(isodow from d)::int and k.xoa_at is null
    union
    select k.id, h.ngay, k.gio_bat_dau, k.gio_ket_thuc, k.xoa_at is not null, k.phong_id,
           exists (select 1 from lich_test_dong x where x.khung_id = k.id and x.ngay = h.ngay)
    from hen h join lich_test_khung k on k.id = h.khung_id
    where h.ngay between v_tu and v_den
  )
  select jsonb_build_object(
    'tu', v_tu, 'den', v_den,
    'buoi', coalesce((select jsonb_agg(jsonb_build_object(
               'khung_id', b.khung_id, 'ngay', b.ngay, 'thu', extract(isodow from b.ngay)::int,
               'tu', to_char(b.tu, 'HH24:MI'), 'den', to_char(b.den, 'HH24:MI'), 'dong', b.dong, 'khung_da_xoa', b.khung_da_xoa,
               'phong', (select ten_phong from phong p where p.id = b.phong_id),
               'hen', coalesce((select jsonb_agg(hj.j order by hj.gio_bat_dau, hj.ho_ten_hs) from hen_j hj
                                where hj.khung_id = b.khung_id and hj.ngay = b.ngay), '[]'::jsonb)) order by b.ngay, b.tu)
             from buoi b), '[]'::jsonb),
    'lo_hen', coalesce((select jsonb_agg(hj.j order by hj.ngay desc, hj.gio_bat_dau) from hen_j hj
                        where hj.j->>'tinh_trang' = 'lo_hen' and hj.ngay >= v_now::date - 30), '[]'::jsonb),
    'truong_tu_go', coalesce((select jsonb_agg(jsonb_build_object('ten', t.ten, 'so_hen', t.n) order by t.n desc, t.ten) from (
                       select h.truong_hoc ten, count(*)::int n from hen h
                       where h.truong_tu_go and h.truong_hoc is not null
                         and not exists (select 1 from truong_hoc_dm d where d.ten = h.truong_hoc and d.xoa_at is null)
                       group by 1) t), '[]'::jsonb),
    'thieu_thoi_luong', coalesce((select jsonb_agg(jsonb_build_object('lop', lop, 'mon', mon) order by lop::int, mon)
                                  from public._ts_mon_theo_lop() where thoi_luong_phut is null), '[]'::jsonb),
    'mon_theo_lop', coalesce((select jsonb_agg(jsonb_build_object('lop', lop, 'mon', mon, 'thoi_luong_phut', thoi_luong_phut) order by lop::int, mon)
                              from public._ts_mon_theo_lop()), '[]'::jsonb)
  ) into v;
  return v;
end $$;

revoke all on function public.fn_ts_khung_trung_phong(uuid, integer, time, time, uuid) from public, anon;
revoke all on function public.fn_phong_lich_test_ngay(date) from public, anon;
revoke all on function public._ts_khung_chan_trung() from public, anon, authenticated;
grant execute on function public.fn_ts_khung_trung_phong(uuid, integer, time, time, uuid) to authenticated;
grant execute on function public.fn_phong_lich_test_ngay(date) to authenticated;
