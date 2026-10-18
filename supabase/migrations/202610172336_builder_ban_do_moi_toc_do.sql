-- BUILDER BẢN ĐỒ MỚI — tốc độ dưới RLS (đo 17/10 bằng phiên đăng nhập thật, mig 202610172312 vừa áp).
--
-- Triệu chứng: "Dùng 2 nhóm" ⇒ "canceling statement due to statement timeout" (trần 8 giây của authenticated).
-- Gốc: các hàm fn_tl_bdm_* là INVOKER ⇒ mọi bảng đọc (dai_cau_hoi ~30k dòng, dai_bdm_*, tai_lieu_cau 74k) bị lọc
--   bằng policy `la_thanh_vien()` — hàm này chạy 2 truy vấn con, và chạy LẠI TRÊN TỪNG DÒNG.
--   Đo trên app: cây chọn / kho câu nhóm / gợi ý mỗi lần ≈ 1,9 giây (chạy thẳng chỉ 0,15–0,3 giây);
--   đặt buổi 2 nhóm 3 dạng bài = 5 lần gợi ý ⇒ quá 8 giây. Script test không thấy vì chạy bằng role chủ bảng.
-- Sửa: 2 helper CHỈ ĐỌC KHO chạy quyền chủ (security definer) và kiểm thành viên ĐÚNG MỘT LẦN ở đầu hàm:
--   _tl_bdm_cau_vi_tri (vị trí câu trên bản đồ) · _tl_bdm_so_lan_dung (đếm lần câu nằm trong tài liệu).
--   Không trả thêm gì ngoài cái thành viên vốn đã đọc được qua policy (kho câu, mã câu) ⇒ không nới quyền.
--   Hàm GHI (dat_buoi, dat_cau) vẫn invoker + RLS như cũ.

create or replace function _tl_bdm_cau_vi_tri(p_khoi text)
returns table (ma_cau text, la_goc boolean, cum text, loai_cau text, dang_bai_id text, nhom_id text)
language plpgsql stable security definer set search_path = public as $$
begin
  if not la_thanh_vien() then raise exception 'Chỉ nhân sự mới đọc được kho.' using errcode = '42501'; end if;
  return query
  with cg as materialized (
    select * from _bdm_cau_giai(array(
      select b.ma_dang from dai_ban_do b where b.khoi = p_khoi
      union
      select unnest(_bdm_dang_cu_cua_khoi(p_khoi))))
  ),
  mot_nhom as (
    select d.ma_dang_cu, min(d.dich_nhom) as nhom
      from dai_bdm_doi_ung d
     group by d.ma_dang_cu
    having count(*) = 1 and count(d.dich_nhom) = 1
  )
  select c.ma_cau, c.parent_ma_cau is null, coalesce(cg.ma_cum_cu, c.parent_ma_cau, c.ma_cau), c.loai_cau,
         cg.dang_bai_id, coalesce(db.nhom_id, mn.nhom)
    from cg
    join dai_cau_hoi c on c.ma_cau = cg.ma_cau
    left join dai_bdm_dang_bai db on db.id = cg.dang_bai_id
    left join mot_nhom mn on mn.ma_dang_cu = cg.ma_dang_cu and cg.dang_bai_id is null
   where c.kho_chuan and c.xoa_at is null;
end $$;

-- Số lần mỗi câu đã nằm trong tài liệu (mọi tài liệu) — chỉ báo "ít dùng nhất", không phải số liệu nghiệp vụ.
create or replace function _tl_bdm_so_lan_dung(p_ma_caus text[])
returns table (ma_cau text, n bigint)
language plpgsql stable security definer set search_path = public as $$
begin
  if not la_thanh_vien() then raise exception 'Chỉ nhân sự mới đọc được kho.' using errcode = '42501'; end if;
  return query select tc.ma_cau, count(*) from tai_lieu_cau tc where tc.ma_cau = any (p_ma_caus) group by 1;
end $$;

-- fn_tl_bdm_cau: đếm lần dùng qua helper (thân giữ nguyên, chỉ đổi nguồn đếm).
create or replace function fn_tl_bdm_cau(p_nhom text)
returns jsonb language sql stable as $$
  with v as materialized (select * from _tl_bdm_cau_vi_tri(_tl_bdm_khoi_nhom(p_nhom)) x where x.nhom_id = p_nhom),
  u as materialized (select * from _tl_bdm_so_lan_dung(array(select v.ma_cau from v)))
  select coalesce(jsonb_agg(jsonb_build_object(
           'ma_cau', v.ma_cau, 'dang_bai_id', v.dang_bai_id, 'loai_cau', v.loai_cau, 'la_goc', v.la_goc, 'cum', v.cum,
           'so_lan_dung', coalesce(u.n, 0))
         order by db.thu_tu nulls last, db.id, coalesce(u.n, 0), v.ma_cau), '[]'::jsonb)
    from v
    left join u on u.ma_cau = v.ma_cau
    left join dai_bdm_dang_bai db on db.id = v.dang_bai_id
$$;

-- fn_tl_bdm_goi_y: như bản 202610172312 (kèm sửa r_dbk), chỉ đổi nguồn đếm lần dùng.
create or replace function fn_tl_bdm_goi_y(p_nhom text, p_dang_bai text[], p_so jsonb, p_tru text[] default '{}')
returns text[] language plpgsql stable as $$
declare
  v_out text[];
  v_tong int := coalesce((p_so->>'_tong')::int, 0);
begin
  with v as materialized (
    select x.* from _tl_bdm_cau_vi_tri(_tl_bdm_khoi_nhom(p_nhom)) x
     where x.nhom_id = p_nhom
       and (p_dang_bai is null or x.dang_bai_id = any (p_dang_bai))
       and not (x.ma_cau = any (coalesce(p_tru, '{}')))
  ),
  t as materialized (select * from _tl_bdm_so_lan_dung(array(select v.ma_cau from v))),
  u as (
    select v.*, coalesce(t.n, 0) as dung, coalesce(db.thu_tu, 2147483647) as db_tt, coalesce(v.dang_bai_id, '') as dbk
      from v
      left join t on t.ma_cau = v.ma_cau
      left join dai_bdm_dang_bai db on db.id = v.dang_bai_id
  ),
  r1 as (
    select u.*,
           row_number() over (partition by loai_cau, dbk, cum order by dung, (not la_goc), ma_cau) as rn_cum,
           min(dung)    over (partition by loai_cau, dbk, cum) as cum_min
      from u
  ),
  r2 as (select r1.*, row_number() over (partition by loai_cau, dbk order by rn_cum, cum_min, cum) as r_db from r1),
  r3 as (select r2.*, row_number() over (partition by loai_cau order by r_db, db_tt, dbk) as r_loai,
                      row_number() over (partition by dbk order by r_db, dung, ma_cau) as r_dbk
           from r2),
  chon as (
    select r3.* from r3
     where r3.r_loai <= coalesce((p_so->>r3.loai_cau)::int, 0)
  ),
  them as (
    select r3.* from r3
     where not exists (select 1 from chon c where c.ma_cau = r3.ma_cau)
     order by r3.r_dbk, r3.db_tt, r3.dbk
     limit greatest(v_tong - (select count(*) from chon), 0)
  ),
  tat as (select * from chon union all select * from them)
  select coalesce(array_agg(ma_cau order by db_tt, dbk,
                  case loai_cau when 'trac_nghiem' then 1 when 'tra_loi_ngan' then 2 when 'tu_luan' then 3 else 4 end, r_loai), '{}')
    into v_out from tat;
  return v_out;
end $$;

do $$
declare f text;
begin
  foreach f in array array['_tl_bdm_cau_vi_tri(text)', '_tl_bdm_so_lan_dung(text[])', 'fn_tl_bdm_cau(text)', 'fn_tl_bdm_goi_y(text,text[],jsonb,text[])'] loop
    execute format('revoke execute on function %s from public, anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
end $$;
