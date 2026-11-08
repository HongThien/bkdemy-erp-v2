-- ============================================================================
-- qlcl_dau_tuan_de_xuat_yeu — Thùy 29/10, spec-truong-khoi.md §4.1 + §8.4–8.5:
--  (3) ĐÓNG BĂNG ĐẦU TUẦN: lúc Trang bấm Chốt tuần (fn_botro_chot_tuan), CÙNG transaction chụp số dạng yếu từng em của môn đó
--      sang dang_yeu_dau_tuan (nguồn = cache dang_yeu_hien_tai — client làm mới cache cho đủ TRƯỚC khi chốt, vì tính thẳng
--      toàn môn ~2 phút vượt trần). Chốt lại trong tuần ⇒ chụp lại (thay ảnh tuần đó). Widget: đầu tuần → hiện tại.
--  (4) ĐỀ XUẤT YẾU: trưởng khối đưa em vào "Đang theo dõi" (vòng 2 màn Duyệt của Trang) — nguồn theo dõi mới 'truong_khoi'.
-- ============================================================================

create table if not exists dang_yeu_dau_tuan (
  tuan         date not null,               -- thứ 2 của tuần (giờ VN)
  mon          text not null,
  khoi         text not null,
  hoc_sinh_id  uuid not null references hoc_sinh(id),
  so_dang_yeu  integer not null,
  dang         jsonb not null default '[]'::jsonb,
  tinh_at      timestamptz not null,         -- lần tính cache được chụp
  chot_id      uuid references bo_tro_chot_tuan(id),
  primary key (tuan, mon, hoc_sinh_id)
);
comment on table dang_yeu_dau_tuan is 'Ảnh chụp dạng yếu đầu tuần (đóng băng lúc Chốt tuần) — so sánh tuần, KPI trưởng khối (spec-truong-khoi.md §4). Chỉ có dòng cho em có kết quả tính.';
alter table dang_yeu_dau_tuan enable row level security;
drop policy if exists dydt_doc on dang_yeu_dau_tuan;
create policy dydt_doc on dang_yeu_dau_tuan for select to authenticated using (public.la_thanh_vien());

create or replace function public._qlcl_dong_bang_tuan(p_mon text, p_tuan date, p_chot uuid)
returns integer language plpgsql security definer set search_path = public as $$
declare n int;
begin
  delete from dang_yeu_dau_tuan where tuan = p_tuan and mon = p_mon;   -- chốt lại trong tuần ⇒ thay ảnh tuần đó
  insert into dang_yeu_dau_tuan (tuan, mon, khoi, hoc_sinh_id, so_dang_yeu, dang, tinh_at, chot_id)
  select p_tuan, p_mon, o.khoi, d.hoc_sinh_id, d.so_dang_yeu, d.dang, d.tinh_at, p_chot
    from dang_yeu_hien_tai d
    join lateral (select l.khoi from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
                   where hl.hoc_sinh_id = d.hoc_sinh_id and hl.trang_thai = 'dang_hoc' and l.trang_thai = 'dang_hoc'
                     and l.mon = p_mon and l.khoi is not null
                   order by hl.ngay_vao desc limit 1) o on true
   where d.mon = p_mon;
  get diagnostics n = row_count;
  return n;
end $$;

-- Tuần hiện tại (thứ 2, giờ VN) — cùng cách fn_botro_chot_tuan tính v_tuan
create or replace function public._qlcl_tuan_nay()
returns date language sql stable as $$ select date_trunc('week', (now() at time zone 'Asia/Ho_Chi_Minh'))::date $$;

-- Widget: thêm số đầu tuần (null = tuần này chưa chốt môn đó)
create or replace function public.fn_qlcl_tong_quan()
returns table (mon text, khoi text, vai text, so_hs integer, so_hs_yeu integer, so_dang_yeu integer, so_can_tinh integer,
               tinh_at timestamptz, dau_tuan_hs_yeu integer, dau_tuan_dang_yeu integer)
language sql stable security definer set search_path = public as $$
  select p.mon, p.khoi, p.vai,
         (select count(*)::int from public._qlcl_hs_cua_o(p.mon, p.khoi)),
         (select count(*)::int from public._qlcl_hs_cua_o(p.mon, p.khoi) h join dang_yeu_hien_tai d on d.mon = p.mon and d.hoc_sinh_id = h.hoc_sinh_id where d.so_dang_yeu > 0),
         (select coalesce(sum(d.so_dang_yeu), 0)::int from public._qlcl_hs_cua_o(p.mon, p.khoi) h join dang_yeu_hien_tai d on d.mon = p.mon and d.hoc_sinh_id = h.hoc_sinh_id),
         (select count(*)::int from public._qlcl_hs_can_tinh(p.mon, p.khoi)),
         (select max(d.tinh_at) from public._qlcl_hs_cua_o(p.mon, p.khoi) h join dang_yeu_hien_tai d on d.mon = p.mon and d.hoc_sinh_id = h.hoc_sinh_id),
         case when exists (select 1 from dang_yeu_dau_tuan z where z.tuan = public._qlcl_tuan_nay() and z.mon = p.mon)
              then (select count(*)::int from dang_yeu_dau_tuan z where z.tuan = public._qlcl_tuan_nay() and z.mon = p.mon and z.khoi = p.khoi and z.so_dang_yeu > 0) end,
         case when exists (select 1 from dang_yeu_dau_tuan z where z.tuan = public._qlcl_tuan_nay() and z.mon = p.mon)
              then (select coalesce(sum(z.so_dang_yeu), 0)::int from dang_yeu_dau_tuan z where z.tuan = public._qlcl_tuan_nay() and z.mon = p.mon and z.khoi = p.khoi) end
    from public.fn_pham_vi_cua_toi() p
   where public.la_thanh_vien()
   order by p.mon, p.khoi
$$;

-- Bảng chi tiết: thêm số dạng đầu tuần từng em + đã có đề xuất trưởng khối
drop function if exists public.fn_qlcl_dang_yeu_hs(text, text);
create function public.fn_qlcl_dang_yeu_hs(p_mon text, p_khoi text)
returns table (hoc_sinh_id uuid, ho_ten text, ma_hs text, lop_id uuid, ten_lop text, so_dang_yeu integer, dang jsonb, tinh_at timestamptz,
               so_dang_dau_tuan integer, so_ca_nhe_tuan integer, co_case_yeu boolean, dang_theo_doi boolean, theo_doi_nguon text)
language plpgsql stable security definer set search_path = public as $$
declare v_tuan date := public._qlcl_tuan_nay();
begin
  if not public.la_thanh_vien() or not public._trong_pham_vi(p_mon, p_khoi) then raise exception 'Ngoài phạm vi khối của bạn.'; end if;
  return query
  select h.id, h.ho_ten, h.ma_hs, l.id, l.ten_lop, d.so_dang_yeu, d.dang, d.tinh_at,
         (select z.so_dang_yeu from dang_yeu_dau_tuan z where z.tuan = v_tuan and z.mon = p_mon and z.hoc_sinh_id = h.id),
         (select count(*)::int from buoi_hoc_hs x join buoi_hoc b on b.id = x.buoi_hoc_id
           where x.hoc_sinh_id = h.id and b.loai = 'bo_tro_nhe' and b.trang_thai <> 'huy' and b.ngay >= v_tuan and b.ngay < v_tuan + 7),
         exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = h.id and y.mon = p_mon and y.trang_thai = 'dang_xu'),
         exists (select 1 from bo_tro_theo_doi t where t.hoc_sinh_id = h.id and t.mon = p_mon and t.trang_thai = 'theo_doi'),
         (select t.nguon from bo_tro_theo_doi t where t.hoc_sinh_id = h.id and t.mon = p_mon and t.trang_thai = 'theo_doi' limit 1)
    from dang_yeu_hien_tai d
    join hoc_sinh h on h.id = d.hoc_sinh_id
    join lateral (select l.id, l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
                   where hl.hoc_sinh_id = d.hoc_sinh_id and hl.trang_thai = 'dang_hoc' and l.trang_thai = 'dang_hoc' and l.mon = p_mon and l.khoi = p_khoi
                   order by hl.ngay_vao desc limit 1) l on true
   where d.mon = p_mon and d.so_dang_yeu > 0
   order by d.so_dang_yeu desc, h.ho_ten;
end $$;

-- (4) Đề xuất Yếu
alter table bo_tro_theo_doi drop constraint bo_tro_theo_doi_nguon_ck;
alter table bo_tro_theo_doi add constraint bo_tro_theo_doi_nguon_ck check (nguon = any (array['bao_dong', 'diem_thap', 'sau_bo_tro', 'truong_khoi']));

create or replace function public.fn_qlcl_de_xuat_yeu(p_hs uuid, p_mon text, p_ghi_chu text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_khoi text;
begin
  select l.khoi into v_khoi from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
   where hl.hoc_sinh_id = p_hs and hl.trang_thai = 'dang_hoc' and l.trang_thai = 'dang_hoc' and l.mon = p_mon order by hl.ngay_vao desc limit 1;
  if v_khoi is null then raise exception 'Em không học lớp môn % nào.', p_mon; end if;
  if not public._trong_pham_vi(p_mon, v_khoi) then raise exception 'Em ngoài phạm vi khối của bạn.'; end if;
  return public.fn_botro_theo_doi_vao(p_hs, p_mon, 'truong_khoi', p_ghi_chu, false);
end $$;

-- fn_botro_theo_doi_vao (dựng lại từ định nghĩa ĐANG CHẠY, chỉ nới danh sách nguồn) + fn_botro_chot_tuan (thêm 1 dòng chụp đầu tuần):

-- fn_botro_theo_doi_vao: if p_nguon not in ('bao_dong', 'diem_thap') then raise excep
CREATE OR REPLACE FUNCTION public.fn_botro_theo_doi_vao(p_hs uuid, p_mon text, p_nguon text, p_ghi_chu text DEFAULT NULL::text, p_bo_qua boolean DEFAULT false)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_id uuid; v_sl jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if p_nguon not in ('bao_dong', 'diem_thap', 'truong_khoi') then raise exception 'Nguồn phải là bao_dong | diem_thap | truong_khoi.'; end if; -- 29/10: + trưởng khối đề xuất (fn_qlcl_de_xuat_yeu)
  if exists (select 1 from bo_tro_yeu where hoc_sinh_id = p_hs and mon = p_mon and trang_thai = 'dang_xu') then raise exception 'Em đã đang bổ trợ chính thức.'; end if;
  if exists (select 1 from bo_tro_theo_doi where hoc_sinh_id = p_hs and mon = p_mon and trang_thai = 'theo_doi') then raise exception 'Em đã ở danh sách theo dõi.'; end if;
  select h.du_lieu into v_sl from bo_tro_chot_tuan_hs h join bo_tro_chot_tuan c on c.id = h.chot_id
    where c.mon = p_mon and h.hoc_sinh_id = p_hs order by c.chot_at desc limit 1;
  v_sl := coalesce(v_sl, jsonb_build_object('chuyen_de', '[]'::jsonb, 'et_btvn', public.fn_botro_et_btvn(p_hs)));
  insert into bo_tro_theo_doi (hoc_sinh_id, mon, vao_boi, nguon, ghi_chu, so_lieu_vao, trang_thai, ket_thuc_at, ket_thuc_boi, ly_do_ket_thuc)
    values (p_hs, p_mon, public.jwt_uid(), p_nguon, nullif(trim(coalesce(p_ghi_chu, '')), ''), v_sl,
            case when p_bo_qua then 'bo_qua' else 'theo_doi' end, case when p_bo_qua then now() end, case when p_bo_qua then public.jwt_uid() end, case when p_bo_qua then 'Bỏ qua vòng 1' end)
    returning id into v_id;
  return v_id;
end $function$;

-- fn_botro_chot_tuan: update bo_tro_chot_tuan set so_diem_thap = n1 + n3, so_theo_
CREATE OR REPLACE FUNCTION public.fn_botro_chot_tuan(p_mon text, p_ung_vien jsonb, p_theo_doi_cd jsonb DEFAULT '[]'::jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_id uuid; v_tuan date := date_trunc('week', (now() at time zone 'Asia/Ho_Chi_Minh'))::date; r record; n1 int := 0; n2 int := 0; n3 int := 0; v_prev record;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if nullif(trim(coalesce(p_mon, '')), '') is null then raise exception 'Thiếu môn.'; end if;
  perform public.fn_btyeu_het_han_xu_ly(); -- 26/10: ca quá 14 ngày đóng + vào theo dõi TRƯỚC khi chụp ảnh tuần
  insert into bo_tro_chot_tuan (tuan, mon, chot_boi) values (v_tuan, p_mon, public.jwt_uid()) returning id into v_id;
  for r in select * from jsonb_to_recordset(coalesce(p_ung_vien, '[]'::jsonb)) as x(hoc_sinh_id uuid, lop text, khoi text, ly_do text[], kenh text[], uu_tien int, chuyen_de jsonb) loop
    insert into bo_tro_chot_tuan_hs (chot_id, hoc_sinh_id, loai, lop, khoi, ly_do, kenh, uu_tien, du_lieu)
      values (v_id, r.hoc_sinh_id, 'diem_thap', r.lop, r.khoi, coalesce(r.ly_do, '{}'), coalesce(r.kenh, '{}'), coalesce(r.uu_tien, 0),
              jsonb_build_object('chuyen_de', coalesce(r.chuyen_de, '[]'::jsonb), 'et_btvn', public.fn_botro_et_btvn(r.hoc_sinh_id)))
      on conflict do nothing;
    n1 := n1 + 1;
  end loop;
  for r in select td.hoc_sinh_id, td.id, coalesce(x.cd, '[]'::jsonb) as cd,
                  (select l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where hl.hoc_sinh_id = td.hoc_sinh_id and hl.trang_thai = 'dang_hoc' and l.mon = td.mon limit 1) as lop,
                  (select hs.khoi from hoc_sinh hs where hs.id = td.hoc_sinh_id) as khoi
           from bo_tro_theo_doi td
           left join (select (e->>'hoc_sinh_id')::uuid as hs, e->'chuyen_de' as cd from jsonb_array_elements(coalesce(p_theo_doi_cd, '[]'::jsonb)) e) x on x.hs = td.hoc_sinh_id
           where td.mon = p_mon and td.trang_thai = 'theo_doi' loop
    insert into bo_tro_chot_tuan_hs (chot_id, hoc_sinh_id, loai, lop, khoi, du_lieu)
      values (v_id, r.hoc_sinh_id, 'theo_doi', r.lop, r.khoi, jsonb_build_object('chuyen_de', r.cd, 'et_btvn', public.fn_botro_et_btvn(r.hoc_sinh_id)))
      on conflict do nothing;
    n2 := n2 + 1;
  end loop;
  -- Thùy 26/10: mỗi tuần chốt = lượt mới + PHẦN CHƯA XỬ LÝ từ tuần trước. "Chưa xử lý" = đứng trong Điểm thấp của lần chốt cuối tuần trước,
  -- chưa vào theo dõi / bỏ qua / mở case từ sau lần chốt đó, và chưa có trong lượt mới. Ghi thẳng vào ảnh chụp tuần này ⇒ tuần sau tự nối tiếp.
  select c.id, c.chot_at, c.tuan into v_prev from bo_tro_chot_tuan c where c.mon = p_mon and c.tuan < v_tuan order by c.tuan desc, c.chot_at desc limit 1;
  if v_prev.id is not null then
    for r in select h.* from bo_tro_chot_tuan_hs h
              where h.chot_id = v_prev.id and h.loai = 'diem_thap'
                and not exists (select 1 from bo_tro_chot_tuan_hs x where x.chot_id = v_id and x.hoc_sinh_id = h.hoc_sinh_id and x.loai = 'diem_thap')
                and not exists (select 1 from bo_tro_theo_doi td where td.hoc_sinh_id = h.hoc_sinh_id and td.mon = p_mon and (td.trang_thai = 'theo_doi' or td.vao_at >= v_prev.chot_at))
                and not exists (select 1 from bo_tro_yeu y where y.hoc_sinh_id = h.hoc_sinh_id and y.mon = p_mon and (y.trang_thai = 'dang_xu' or y.created_at >= v_prev.chot_at)) loop
      insert into bo_tro_chot_tuan_hs (chot_id, hoc_sinh_id, loai, lop, khoi, ly_do, kenh, uu_tien, du_lieu)
        values (v_id, r.hoc_sinh_id, 'diem_thap', r.lop, r.khoi,
                array['Tồn từ tuần ' || to_char(v_prev.tuan, 'DD/MM') || ' — chưa xử lý'] || coalesce(array(select l from unnest(r.ly_do) l where l not like 'Tồn từ tuần%'), '{}'),
                r.kenh, r.uu_tien, jsonb_set(coalesce(r.du_lieu, '{}'::jsonb), '{et_btvn}', public.fn_botro_et_btvn(r.hoc_sinh_id)))
        on conflict do nothing;
      n3 := n3 + 1;
    end loop;
  end if;
  update bo_tro_chot_tuan set so_diem_thap = n1 + n3, so_theo_doi = n2 where id = v_id;
  perform public._qlcl_dong_bang_tuan(p_mon, v_tuan, v_id); -- 29/10: đóng băng dạng yếu đầu tuần (spec-truong-khoi.md §4.1)
  return v_id;
end $function$;

do $$
declare f text;
begin
  foreach f in array array['public._qlcl_dong_bang_tuan(text, date, uuid)', 'public.fn_qlcl_tong_quan()', 'public.fn_qlcl_dang_yeu_hs(text, text)', 'public.fn_qlcl_de_xuat_yeu(uuid, text, text)'] loop
    execute format('revoke execute on function %s from public', f);
    execute format('revoke execute on function %s from anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
end $$;
