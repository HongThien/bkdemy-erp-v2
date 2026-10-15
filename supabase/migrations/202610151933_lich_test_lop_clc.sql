-- ============================================================================
-- 202610151933 — ĐĂNG KÝ TEST: thêm "Lớp 4 CLC" / "Lớp 5 CLC" (Thùy 15/10)
-- ----------------------------------------------------------------------------
-- Thùy: bài test cấp 2–3 = 90', khối 3–4–5 = 60', 4T/5T = 75'. PH chọn lớp ở trường nên không phân
--   biệt được bài thường/nâng cao ⇒ thêm lựa chọn riêng, HIỆN "Lớp 4 CLC"/"Lớp 5 CLC" ("4T/5T là cách
--   gọi của BK"). Mã lưu (ung_vien.khoi, thời lượng) = khối BK '4T'/'5T' — khớp test_dau_vao_phan_cong.
-- Danh sách khối CLC sống ở MỘT chỗ: _ts_lop_cua_khoi (8T vẫn gộp vào lớp 8 — Thùy chỉ nói 4T/5T).
-- Tên hiển thị lớp do DB trả (_ts_ten_lop) — web/ERP không tự dịch 'T' → 'CLC'.
-- Thân các hàm dưới = bản đã áp ở 1355/1730, chỉ đổi chỗ lớp (sinh bằng script, không gõ lại tay).
-- MẤT GÌ (Luật xoá): DROP CHECK test_dau_vao_thoi_luong_khoi_check để thay bằng CHECK rộng hơn —
--   không mất dòng nào (chỉ nới tập giá trị hợp lệ). Thùy gật 15/10.
-- ============================================================================

create or replace function public._ts_lop_cua_khoi(p_khoi text) returns text
language sql immutable as $$
  select case when p_khoi in ('4T', '5T') then p_khoi
              else nullif(regexp_replace(coalesce(p_khoi, ''), '\D', '', 'g'), '') end
$$;

create or replace function public._ts_lop_hop_le(p_lop text) returns boolean
language sql immutable as $$ select coalesce(p_lop ~ '^(1[0-2]|[1-9]|4T|5T)$', false) $$;

create or replace function public._ts_ten_lop(p_lop text) returns text
language sql immutable as $$
  select case when p_lop ~ 'T$' then 'Lớp ' || regexp_replace(p_lop, '\D', '', 'g') || ' CLC' else 'Lớp ' || p_lop end
$$;

-- Thứ tự hiển thị: 3, 4, 4 CLC, 5, 5 CLC, 6…
create or replace function public._ts_lop_thu_tu(p_lop text) returns numeric
language sql immutable as $$
  select regexp_replace(p_lop, '\D', '', 'g')::numeric + case when p_lop ~ 'T$' then 0.5 else 0 end
$$;

alter table public.test_dau_vao_thoi_luong drop constraint if exists test_dau_vao_thoi_luong_khoi_check;
alter table public.test_dau_vao_thoi_luong add constraint test_dau_vao_thoi_luong_khoi_check check (public._ts_lop_hop_le(khoi));

create or replace function public._ts_mon_theo_lop()
returns table (lop text, mon text, thoi_luong_phut integer)
language sql stable as $$
  select distinct public._ts_lop_cua_khoi(l.khoi), l.mon, t.thoi_luong_phut
  from lop l
  left join test_dau_vao_thoi_luong t on t.khoi = public._ts_lop_cua_khoi(l.khoi) and t.mon = l.mon
  where l.trang_thai = 'dang_hoc' and public._ts_lop_hop_le(public._ts_lop_cua_khoi(l.khoi))
$$;

create or replace function public.fn_ts_dk_form(p_so_ngay integer default 14, p_som_phut integer default 60)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_now  timestamp := public._ts_gio_vn();
  v_som  timestamp := v_now + greatest(p_som_phut, 0) * interval '1 minute';
  v_tu   date := v_now::date;
  v_den  date := v_now::date + least(greatest(p_so_ngay, 1), 90) - 1;
  v jsonb;
begin
  with mt as (select * from public._ts_mon_theo_lop()),
  tls as (select distinct thoi_luong_phut tl from mt where thoi_luong_phut is not null),
  buoi as (
    select b.*, (select jsonb_object_agg(tls.tl::text, s.gio)
                 from tls cross join lateral (
                   select jsonb_agg(jsonb_build_object('bat_dau', to_char(g.bat_dau, 'HH24:MI'), 'xong', to_char(g.xong, 'HH24:MI')) order by g.bat_dau) gio
                   from public._ts_gio_trong_buoi(b.ngay, b.tu, b.den, tls.tl, v_som) g) s
                 where s.gio is not null) as gio
    from public._ts_buoi_mo(v_tu, v_den) b
  )
  select jsonb_build_object(
    'hom_nay', v_tu,
    'lop', coalesce((select jsonb_agg(jsonb_build_object('lop', x.lop, 'ten', public._ts_ten_lop(x.lop), 'mon', x.mon) order by public._ts_lop_thu_tu(x.lop)) from (
              select lop, jsonb_agg(jsonb_build_object('mon', mon, 'thoi_luong_phut', thoi_luong_phut) order by mon) mon
              from mt where thoi_luong_phut is not null group by lop) x), '[]'::jsonb),
    'thieu_thoi_luong', coalesce((select jsonb_agg(jsonb_build_object('lop', lop, 'mon', mon) order by public._ts_lop_thu_tu(lop), mon)
                                  from mt where thoi_luong_phut is null), '[]'::jsonb),
    'truong', coalesce((select jsonb_agg(jsonb_build_object('ten', ten, 'cap', cap) order by ten)
                        from truong_hoc_dm where xoa_at is null), '[]'::jsonb),
    'lich', coalesce((select jsonb_agg(jsonb_build_object(
                        'khung_id', khung_id, 'ngay', ngay, 'thu', extract(isodow from ngay)::int,
                        'tu', to_char(tu, 'HH24:MI'), 'den', to_char(den, 'HH24:MI'), 'gio', gio) order by ngay, tu)
                      from buoi where gio is not null), '[]'::jsonb)
  ) into v;
  return v;
end $$;

create or replace function public._ts_dang_ky_test(
  p jsonb, p_nguon text, p_kenh text, p_tu_nhan_su uuid, p_max_ngay integer, p_som timestamp
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_ten     text := public._ts_ten_chuan(p->>'ho_ten_hs');
  v_sdt     text := public._ts_sdt_chuan(p->>'sdt_ph');
  v_lop     text := btrim(coalesce(p->>'lop', ''));
  v_truong  text := public._ts_ten_chuan(p->>'truong');
  v_tu_go   boolean := coalesce((p->>'truong_tu_go')::boolean, false);
  v_lan     uuid := gen_random_uuid();
  v_uid     uuid := public.jwt_uid();
  v_item    jsonb;
  v_mon     text; v_khung uuid; v_ngay date; v_bd time; v_tl integer; v_err text;
  v_uv      uuid; v_uv_moi boolean; v_ma text; v_hen uuid;
  v_ra      jsonb := '[]'::jsonb;
  v_dong    text := '';
  v_ph_cu   text;
  v_lai     integer := 0;
  r         record;
begin
  if length(v_ten) < 2 or length(v_ten) > 80 then raise exception 'Bố mẹ điền họ tên của con giúp trung tâm.'; end if;
  if v_sdt is null then raise exception 'Số điện thoại chưa đúng (10 số, bắt đầu bằng 0).'; end if;
  if not public._ts_lop_hop_le(v_lop) then raise exception 'Bố mẹ chọn lớp con đang học.'; end if;
  if length(v_truong) < 2 then raise exception 'Bố mẹ chọn trường của con.'; end if;
  if not v_tu_go and not exists (select 1 from truong_hoc_dm where ten = v_truong and xoa_at is null) then
    raise exception 'Trường đã chọn không còn trong danh sách, bố mẹ chọn lại.';
  end if;
  if jsonb_typeof(p->'mon') <> 'array' or jsonb_array_length(p->'mon') = 0 then raise exception 'Bố mẹ tích ít nhất 1 môn.'; end if;
  if jsonb_array_length(p->'mon') > 4 then raise exception 'Tối đa 4 môn.'; end if;
  if (select count(distinct x->>'mon') from jsonb_array_elements(p->'mon') x) <> jsonb_array_length(p->'mon') then
    raise exception 'Mỗi môn chỉ chọn 1 lịch.';
  end if;

  -- Kiểm từng môn + slot
  create temp table if not exists _ts_dk_tmp (mon text, khung_id uuid, ngay date, bd time, tl integer) on commit drop;
  truncate _ts_dk_tmp;
  for v_item in select * from jsonb_array_elements(p->'mon') loop
    v_mon := v_item->>'mon'; v_khung := (v_item->>'khung_id')::uuid; v_ngay := (v_item->>'ngay')::date; v_bd := (v_item->>'gio_bat_dau')::time;
    select m.thoi_luong_phut into v_tl from public._ts_mon_theo_lop() m where m.lop = v_lop and m.mon = v_mon and m.thoi_luong_phut is not null;
    if v_tl is null then raise exception 'Môn % hiện chưa mở test cho %.', v_mon, public._ts_ten_lop(v_lop); end if;
    v_err := public._ts_kiem_slot(v_khung, v_ngay, v_bd, v_tl, p_som, p_max_ngay);
    if v_err is not null then raise exception '%: %', v_mon, v_err; end if;
    insert into _ts_dk_tmp values (v_mon, v_khung, v_ngay, v_bd, v_tl);
  end loop;
  -- Các môn không được chồng giờ nhau
  if exists (select 1 from _ts_dk_tmp a join _ts_dk_tmp b on a.mon < b.mon and a.ngay = b.ngay
             where a.bd < b.bd + b.tl * interval '1 minute' and b.bd < a.bd + a.tl * interval '1 minute') then
    raise exception 'Hai môn đang bị trùng giờ nhau, bố mẹ chọn giờ lệch ra giúp trung tâm.';
  end if;

  select string_agg(ho_ten, ', ') into v_ph_cu from phu_huynh where public._ts_sdt_chuan(so_dien_thoai) = v_sdt;

  perform pg_advisory_xact_lock(hashtext('ung_vien.ma_uv'));
  for r in select * from _ts_dk_tmp order by ngay, bd loop
    -- Lead đang chạy cùng SĐT + tên + môn ⇒ dùng lại (đăng ký lại = đổi lịch), không đẻ trùng
    select u.id into v_uv from ung_vien u
     where u.trang_thai = 'dang_chay' and u.mon = r.mon
       and public._ts_sdt_chuan(u.sdt_ph) = v_sdt and lower(public._ts_ten_chuan(u.ho_ten_hs)) = lower(v_ten)
     order by u.created_at desc limit 1;
    v_uv_moi := v_uv is null;
    if v_uv_moi then
      select 'UV' || lpad((coalesce(max((substring(ma_uv from '\d+'))::int), 0) + 1)::text, 4, '0') into v_ma
        from ung_vien where ma_uv ~ '\d';
      insert into ung_vien (ma_uv, ho_ten_hs, sdt_ph, khoi, mon, truong_hoc, nguon, level, ghi_chu, created_by)
      values (v_ma, v_ten, v_sdt, v_lop, r.mon, v_truong,
              case when p_nguon = 'web' then 'web' else nullif(btrim(coalesce(p->>'nguon_lead', '')), '') end,
              'L5', nullif(btrim(coalesce(p->>'ghi_chu', '')), ''), v_uid)
      returning id into v_uv;
    else
      v_lai := v_lai + 1;
      update dang_ky_test set trang_thai = 'huy', huy_ly_do = 'Đăng ký lại lịch mới'
       where ung_vien_id = v_uv and trang_thai = 'hen';
    end if;
    insert into dang_ky_test (lan_dk_id, ung_vien_id, mon, khung_id, ngay, gio_bat_dau, thoi_luong_phut, nguon, kenh, truong_tu_go, created_by)
    values (v_lan, v_uv, r.mon, r.khung_id, r.ngay, r.bd, r.tl, p_nguon, case when p_nguon = 'web' then null else p_kenh end, v_tu_go, v_uid)
    returning id into v_hen;
    v_ra := v_ra || jsonb_build_object('mon', r.mon, 'ngay', r.ngay, 'thu', extract(isodow from r.ngay)::int,
              'gio_bat_dau', to_char(r.bd, 'HH24:MI'), 'gio_xong', to_char(r.bd + r.tl * interval '1 minute', 'HH24:MI'),
              'thoi_luong_phut', r.tl, 'dang_ky_lai', not v_uv_moi);
    v_dong := v_dong || '• ' || r.mon || ': ' || to_char(r.ngay, 'DD/MM') || ' · ' || to_char(r.bd, 'HH24:MI') || '–'
              || to_char(r.bd + r.tl * interval '1 minute', 'HH24:MI') || ' (' || r.tl || '′)'
              || case when v_uv_moi then '' else ' — đăng ký LẠI, lịch cũ đã huỷ' end || E'\n';
  end loop;

  -- Hòm thư người nhận
  for r in select nhan_su_id from tuyen_sinh_nhan_bao loop
    perform public._hom_thu_gui(r.nhan_su_id, 'viec',
      '📅 Đăng ký test: ' || v_ten || ' (' || public._ts_ten_lop(v_lop) || ')',
      v_dong
        || 'SĐT PH: ' || v_sdt || E'\n'
        || 'Trường: ' || v_truong || case when v_tu_go then ' (PH tự gõ — cần chuẩn hoá)' else '' end || E'\n'
        || 'Nguồn: ' || case when p_nguon = 'web' then 'Web' else 'Nhập thay PH' || coalesce(' (' || p_kenh || ')', '') end
        || coalesce(E'\n⚠ SĐT trùng phụ huynh cũ: ' || v_ph_cu, ''),
      'tuyensinh', p_tu_nhan_su);
  end loop;

  return jsonb_build_object('lan_dk_id', v_lan, 'ho_ten_hs', v_ten, 'lop', v_lop, 'ten_lop', public._ts_ten_lop(v_lop), 'mon', v_ra);
end $$;

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
      'sdt_ph', h.sdt_ph, 'lop', h.lop, 'ten_lop', public._ts_ten_lop(h.lop), 'truong', h.truong_hoc, 'mon', h.mon, 'khung_id', h.khung_id, 'ngay', h.ngay,
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
    'thieu_thoi_luong', coalesce((select jsonb_agg(jsonb_build_object('lop', lop, 'mon', mon) order by public._ts_lop_thu_tu(lop), mon)
                                  from public._ts_mon_theo_lop() where thoi_luong_phut is null), '[]'::jsonb),
    'mon_theo_lop', coalesce((select jsonb_agg(jsonb_build_object('lop', lop, 'ten', public._ts_ten_lop(lop), 'mon', mon, 'thoi_luong_phut', thoi_luong_phut) order by public._ts_lop_thu_tu(lop), mon)
                              from public._ts_mon_theo_lop()), '[]'::jsonb)
  ) into v;
  return v;
end $$;

-- Thời lượng Thùy chốt 15/10: CLC = 75'
insert into public.test_dau_vao_thoi_luong (khoi, mon, thoi_luong_phut)
select distinct lop, mon, 75 from public._ts_mon_theo_lop() where lop in ('4T', '5T')
on conflict (khoi, mon) do update set thoi_luong_phut = excluded.thoi_luong_phut;
