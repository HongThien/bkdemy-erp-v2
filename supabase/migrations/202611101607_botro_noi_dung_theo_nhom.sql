-- MÀN NỘI DUNG BỔ TRỢ YẾU GOM THEO NHÓM (Thùy 10/11). Đi sau mig 202611101521_botro_yeu_theo_nhom.
-- Hai hàm đọc trả mỗi dạng KÈM nhóm + mastery nhóm (theo lần) + mastery dạng — màn chỉ gom để hiển thị (§2.0).
-- Nhóm của dạng: bản đồ mới (bdm_ban_do.ma_nhom) · Hình–Học: nhóm = bài. Dạng không có nhóm ⇒ nhom_id null (màn xếp nhóm "Khác").
-- Mastery: cùng nguồn luật bổ trợ (_mastery_lan_cap, include_btvn = true, bỏ tự luyện trừ cấp 1).

-- 1. Dạng ĐÃ CÓ trong case
create or replace function public.fn_btyeu_case_dang_nhom(p_case uuid)
returns table(id uuid, ma_dang text, ten_dang text, ten_chuyen_de text, day_at timestamptz, dong_at timestamptz,
              nhom_id text, ten_nhom text, nhom_score numeric, nhom_muc text, nhom_n integer,
              score numeric, muc text, n integer)
language plpgsql stable security definer set search_path = public as $$
#variable_conflict use_column
declare v_hs uuid; v_mon text;
begin
  if not public.la_thanh_vien() then return; end if;
  select y.hoc_sinh_id, y.mon into v_hs, v_mon from bo_tro_yeu y where y.id = p_case;
  if v_hs is null then return; end if;
  return query
  with m as materialized (
    select * from public._mastery_lan_cap(public._mastery_bdm_bat(), array[v_hs], true, null, null, array['dang', 'nhom'], 5, 5, 3)
  ),
  d as (
    select x.id, x.ma_dang, x.day_at, x.dong_at,
           coalesce(b.ten_dang, public._kho_ten_dang(v_mon, x.ma_dang), x.ma_dang) as ten_dang,
           coalesce(b.ten_chuyen_de, '') as ten_chuyen_de,
           coalesce(b.ma_nhom, hh.ma_bai) as nhom_id,
           coalesce(b.ten_nhom, hh.ten_bai) as ten_nhom
    from bo_tro_yeu_dang x
    left join bdm_ban_do b on b.ma_dang = x.ma_dang
    left join hinh_hoc_bai hh on hh.ma_bai = x.ma_dang
    where x.bo_tro_yeu_id = p_case
  )
  select d.id, d.ma_dang, d.ten_dang::text, d.ten_chuyen_de::text, d.day_at, d.dong_at,
         d.nhom_id, d.ten_nhom::text, mn.score, mn.muc, mn.n::int, md.score, md.muc, md.n::int
  from d
  left join m mn on mn.cap = 'nhom' and mn.nut = d.nhom_id
  left join m md on md.cap = 'dang' and md.nut = d.ma_dang
  order by mn.score nulls last, d.nhom_id nulls last, md.score nulls last, d.ten_dang;
end $$;

-- 2. GỢI Ý cho nút "+ Thêm dạng": dạng em chưa đạt (như fn_btyeu_dang_goi_y_moi) — kèm nhóm, nhóm yếu nhất lên đầu
create or replace function public.fn_btyeu_dang_goi_y_nhom(p_hs uuid, p_mon text)
returns table(ma_dang text, ten_dang text, ten_chuyen_de text, score numeric, n integer, muc text, tin text,
              nhom_id text, ten_nhom text, nhom_score numeric, nhom_muc text, nhom_n integer)
language sql stable security definer set search_path = public as $$
  with m as materialized (
    select * from public._mastery_lan_cap(public._mastery_bdm_bat(), array[p_hs], true, null, null, array['dang', 'nhom'], 5, 5, 3)
  )
  select md.nut, coalesce(b.ten_dang, public._kho_ten_dang(p_mon, md.nut))::text, coalesce(b.ten_chuyen_de, '')::text,
         md.score, md.n::int, md.muc, md.tin,
         coalesce(b.ma_nhom, hh.ma_bai), coalesce(b.ten_nhom, hh.ten_bai)::text, mn.score, mn.muc, mn.n::int
  from m md
  left join bdm_ban_do b on b.ma_dang = md.nut
  left join hinh_hoc_bai hh on hh.ma_bai = md.nut
  left join m mn on mn.cap = 'nhom' and mn.nut = coalesce(b.ma_nhom, hh.ma_bai)
  where public.la_thanh_vien() and md.cap = 'dang' and md.muc <> 'dat' and md.score is not null
    and coalesce(b.ten_dang, public._kho_ten_dang(p_mon, md.nut)) is not null
    and not public._kho_dang_da_xoa_mem(md.nut)
  order by mn.score nulls last, coalesce(b.ma_nhom, hh.ma_bai) nulls last, md.score, md.n desc
$$;

revoke all on function public.fn_btyeu_case_dang_nhom(uuid) from public, anon;
grant execute on function public.fn_btyeu_case_dang_nhom(uuid) to authenticated, service_role;
revoke all on function public.fn_btyeu_dang_goi_y_nhom(uuid, text) from public, anon;
grant execute on function public.fn_btyeu_dang_goi_y_nhom(uuid, text) to authenticated, service_role;
