-- ============================================================================
-- BỘ CHỌN NHÓM / DẠNG BÀI (giáo trình · ET · MT, bản đồ mới) — số câu đọc bản lưu, không đếm cả kho khối mỗi lần mở
-- (audit timeout 11/11: fn_tl_bdm_cay_chon 583 lần × 941 ms, max 7,8 s; CLAUDE.md §2.0 "số không realtime thì tính sẵn").
--
-- Đo 11/11: gần hết thời gian là `_tl_bdm_cau_vi_tri(khối, môn)` — dựng vị trí MỌI câu kho chuẩn của khối để đếm so_cau /
-- so_cau_chua_phan (K10–12: 52–67k khối đệm/lần; ETBdmEditor + MTScreen gọi 2 lần liền: nhánh toan + hgt, cùng một tập câu).
-- Cây (chủ đề/chuyên đề/nhóm/dạng bài, tên, lý thuyết) vẫn đọc TRỰC TIẾP — sửa bản đồ là thấy ngay.
-- Chỉ 2 bộ đếm đọc bản lưu `tl_bdm_dem_luu` (khối, môn), tính lại khi bản lưu cũ hơn 5 phút ⇒ số "kho N" chậm tối đa 5 phút
-- sau khi phân dạng / duyệt câu. Hàm chuyển STABLE → VOLATILE (phải ghi bản lưu; PostgREST rpc gọi POST nên không đổi gì phía app).
-- Kiểm 11/11 (ROLLBACK, tài khoản Thùy, khối 6→12 × toan/hgt + KHTN): jsonb cũ = mới từng chữ.
-- ============================================================================

create table if not exists public.tl_bdm_dem_luu (
  khoi text not null,
  mon text not null,
  dem_db jsonb not null,      -- {dang_bai_id: số câu}
  dem_cp jsonb not null,      -- {nhom_id: số câu chưa phân dạng bài}
  tinh_at timestamptz not null default clock_timestamp(),
  primary key (khoi, mon)
);
comment on table public.tl_bdm_dem_luu is 'Bản lưu số câu theo dạng bài / nhóm (chưa phân) của bộ chọn bản đồ mới — fn_tl_bdm_cay_chon, ≤ 5 phút. Mig 202611112216.';
alter table public.tl_bdm_dem_luu enable row level security;
revoke all on public.tl_bdm_dem_luu from anon, authenticated;

create or replace function public._tl_bdm_dem(p_khoi text, p_mon text)
returns table(dem_db jsonb, dem_cp jsonb)
language plpgsql
security definer
set search_path to 'public'
as $function$
#variable_conflict use_column
declare v tl_bdm_dem_luu;
begin
  if not la_thanh_vien() then raise exception 'Chỉ nhân sự mới đọc được kho.' using errcode = '42501'; end if;
  select * into v from tl_bdm_dem_luu l where l.khoi = p_khoi and l.mon = p_mon;
  if found and v.tinh_at > clock_timestamp() - interval '5 minutes' then
    return query select v.dem_db, v.dem_cp; return;
  end if;
  -- cùng công thức đếm cũ của fn_tl_bdm_cay_chon
  return query
  with x as materialized (select * from _tl_bdm_cau_vi_tri(p_khoi, p_mon)),
  d as (select coalesce(jsonb_object_agg(a.dang_bai_id, a.n), '{}'::jsonb) j
          from (select x.dang_bai_id, count(*) n from x where x.dang_bai_id is not null group by 1) a),
  c as (select coalesce(jsonb_object_agg(b.nhom_id, b.n), '{}'::jsonb) j
          from (select x.nhom_id, count(*) n from x where x.dang_bai_id is null and x.nhom_id is not null group by 1) b),
  ghi as (insert into tl_bdm_dem_luu as t (khoi, mon, dem_db, dem_cp, tinh_at)
          select p_khoi, p_mon, d.j, c.j, clock_timestamp() from d, c
          on conflict (khoi, mon) do update set dem_db = excluded.dem_db, dem_cp = excluded.dem_cp, tinh_at = excluded.tinh_at
          returning t.dem_db, t.dem_cp)
  select ghi.dem_db, ghi.dem_cp from ghi;
end $function$;
revoke execute on function public._tl_bdm_dem(text, text) from public, anon;
grant execute on function public._tl_bdm_dem(text, text) to authenticated;

CREATE OR REPLACE FUNCTION public.fn_tl_bdm_cay_chon(p_khoi text, p_nhanh text DEFAULT 'toan'::text)
 RETURNS jsonb
 LANGUAGE sql
 VOLATILE
AS $function$
  with m as materialized (select case when p_nhanh = 'khtn' then 'KHTN' else 'Toán' end as mon),
  -- 11/11: số câu đọc BẢN LƯU _tl_bdm_dem (≤ 5 phút), không đếm lại cả kho khối mỗi lần mở bộ chọn
  dm as materialized (select * from _tl_bdm_dem(p_khoi, (select m.mon from m)))
  select jsonb_build_object('chu_de', coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', cd.id, 'ten', cd.ten,
      'chuyen_de', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', ch.id, 'ten', ch.ten, 'so', o.so,
          'nhom', coalesce((
            select jsonb_agg(jsonb_build_object(
              'id', n.id, 'ten', n.ten, 'mo_ta', n.mo_ta, 'so', n.so,
              'co_ly_thuyet', (btrim(coalesce(n.ly_thuyet, '')) <> '' or n.ly_thuyet_file_url is not null),
              'so_cau_chua_phan', coalesce(((select dm.dem_cp from dm)->>n.id)::bigint, 0),
              'dang_bai', coalesce((
                select jsonb_agg(jsonb_build_object(
                  'id', d.id, 'ten', d.ten, 'mo_ta', d.mo_ta, 'so', d.so,
                  'co_ly_thuyet', (btrim(coalesce(d.ly_thuyet, '')) <> '' or d.ly_thuyet_file_url is not null),
                  'co_vi_du', (btrim(coalesce(d.vi_du, '')) <> '' or d.vi_du_file_url is not null),
                  'so_cau', coalesce(((select dm.dem_db from dm)->>d.id)::bigint, 0)
                ) order by d.so)
                from (select d0.*, row_number() over (order by d0.thu_tu, d0.id) as so
                        from tl_bdm_dang_bai_v d0 where d0.nhom_id = n.id) d), '[]'::jsonb)
            ) order by n.so)
            from (select n0.*, (row_number() over (order by n0.thu_tu, n0.id))::integer as so
                    from tl_bdm_nhom_v n0 where n0.chu_de_id = cd.id and n0.chuyen_de_id = ch.id) n), '[]'::jsonb)
        ) order by o.so)
        from (select o0.*, row_number() over (order by o0.thu_tu, o0.chuyen_de_id) as so
                from tl_bdm_o_v o0 where o0.chu_de_id = cd.id) o
        join tl_bdm_chuyen_de_v ch on ch.id = o.chuyen_de_id), '[]'::jsonb)
    ) order by cd.thu_tu, cd.id)
    from tl_bdm_chu_de_v cd where cd.mon = (select m.mon from m) and cd.khoi = p_khoi and cd.nhanh = p_nhanh), '[]'::jsonb))
$function$;
