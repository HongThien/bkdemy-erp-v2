-- ============================================================================
-- mt_diem_theo_de_goc
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 08/10: "chỗ nhập MT chi tiết chưa đồng bộ theo đề đã sửa, vẫn để tối đa 2 điểm"): gán MT vào lớp
-- CHÉP cau_hinh (diemByCau) + phần sang bản lớp (tai_lieu loai='mt_buoi') ⇒ sửa điểm câu / cờ Nâng cao ở đề gốc
-- KHÔNG sang lớp đã gán (thấy thật: đề K8, câu HH00062080 gốc 2.5đ, 5 lớp K8 vẫn 2đ). Bản lớp không có màn sửa
-- riêng ⇒ đề gốc là nguồn duy nhất: điểm câu đọc diemByCau của GỐC; cờ Nâng cao đọc phần GỐC cùng tiêu đề
-- (khoá tự nhiên = tieu_de, chép nguyên văn lúc gán). Mất gốc (nguon_id hỏng) mới dùng bản lớp.
-- Kèm: dựng lại khung mọi buổi MT từ 01/10 để lớp đã gán theo ngay — Đ đang = điểm tối đa cũ thì theo điểm mới;
-- điểm tổng 'cau' tự cộng lại; điểm nhập tay ('tay') không đụng.
-- MẤT GÌ: không.
-- ============================================================================
create or replace function _mt_phan_nang_cao(p_phan uuid) returns boolean
language sql stable as $$
  select coalesce((select mp.nang_cao from tai_lieu_phan mp
                     join tai_lieu t on t.id = p.tai_lieu_id
                     join tai_lieu m on m.id = t.nguon_id and m.loai = 'mt'
                    where mp.tai_lieu_id = m.id and mp.loai_phan = 'custom' and mp.tieu_de is not distinct from p.tieu_de
                    order by mp.thu_tu limit 1), p.nang_cao)
    from tai_lieu_phan p where p.id = p_phan
$$;
grant execute on function _mt_phan_nang_cao(uuid) to authenticated;
revoke execute on function _mt_phan_nang_cao(uuid) from public, anon;

create or replace function _mt_khung_tinh(p_buoi uuid)
returns table (id uuid, moi numeric, nc boolean, ngoai boolean, tl uuid, dbc jsonb)
language sql stable as $$
  with doc as (
    -- Điểm câu lấy từ ĐỀ GỐC (master, nguon_id) — bản lớp chỉ là bản chép lúc gán; mất gốc mới dùng bản lớp.
    select t.id as tl, coalesce(m.cau_hinh -> 'diemByCau', t.cau_hinh -> 'diemByCau', '{}'::jsonb) as dbc
      from buoi_hoc b join tai_lieu t on t.loai = 'mt_buoi' and t.lop_id = b.lop_id and t.ngay = b.ngay
      left join tai_lieu m on m.id = t.nguon_id and m.loai = 'mt'
     where b.id = p_buoi order by t.created_at desc limit 1
  ),
  hang as (
    select tc.ma_cau, _mt_phan_nang_cao(p.id) as nang_cao, row_number() over (order by p.thu_tu, tc.thu_tu) as rn
      from doc join tai_lieu_phan p on p.tai_lieu_id = doc.tl and p.loai_phan = 'custom'
      join tai_lieu_cau tc on tc.phan_id = p.id
  ),
  hinh as (
    select h.ma_cau, h.nang_cao, row_number() over (order by h.rn) as k,
           (doc.dbc ? h.ma_cau) and not exists (select 1 from jsonb_object_keys(doc.dbc) as kk(k) where kk.k like h.ma_cau || '#%') as cu
      from hang h cross join doc where h.ma_cau like 'HINH:%'
  ),
  dai as (select distinct on (ma_cau) ma_cau, nang_cao from hang where ma_cau not like 'HINH:%' order by ma_cau, rn),
  o as (
    select s.id, s.ma_cau, s.hinh_baitoan_id,
           nullif(substring(s.hinh_nhan from '^[0-9]+'), '')::int as k,
           (row_number() over (partition by (s.hinh_baitoan_id is not null), substring(s.hinh_nhan from '^[0-9]+') order by s.problem_no) - 1) as yi
      from gami_session_problems s where s.buoi_hoc_id = p_buoi and s.phase = 'mt'
  )
  select o.id,
         case when o.hinh_baitoan_id is null then
                case when d.ma_cau is null then null else coalesce((doc.dbc ->> d.ma_cau)::numeric, 1) end
              when h.ma_cau is null then 1                       -- bài Hình thêm tay ở buổi học (không có hàng trong đề)
              when h.cu then null                                 -- đề cũ: điểm cả bài, người chấm tự cho từng ý
              else coalesce((doc.dbc ->> (h.ma_cau || '#' || o.yi))::numeric, 1) end,
         coalesce(case when o.hinh_baitoan_id is null then d.nang_cao else h.nang_cao end, false),
         (o.hinh_baitoan_id is null and d.ma_cau is null),
         doc.tl, doc.dbc
    from o cross join doc
    left join dai d on o.hinh_baitoan_id is null and d.ma_cau = o.ma_cau
    left join hinh h on o.hinh_baitoan_id is not null and h.k = o.k
$$;

create or replace function fn_mt_khung_buoi(p_buoi uuid) returns jsonb
language plpgsql as $$
declare
  v_tl uuid; v_dbc jsonb; v_ky uuid; v_kcb numeric; v_knc numeric; v_n int;
begin
  select count(*), max(k.tl::text)::uuid, (array_agg(k.dbc))[1] into v_n, v_tl, v_dbc from _mt_khung_tinh(p_buoi) k;
  if v_tl is null or v_n = 0 then return jsonb_build_object('so_o', v_n, 'co_de', v_tl is not null); end if;

  -- Ô Đ/S cũ chưa có điểm ⇒ điền; Đ đang bằng điểm tối đa cũ ⇒ theo điểm tối đa mới.
  update gami_grades g set diem_dat = k.moi
    from _mt_khung_tinh(p_buoi) k join gami_session_problems s on s.id = k.id
   where g.problem_id = k.id and g.result = 'correct' and k.moi is not null
     and (g.diem_dat is null or g.diem_dat = s.diem_toi_da) and g.diem_dat is distinct from k.moi;
  update gami_grades g set diem_dat = 0
    from _mt_khung_tinh(p_buoi) k where g.problem_id = k.id and g.result = 'wrong' and g.diem_dat is null;

  update gami_session_problems s set diem_toi_da = k.moi, nang_cao = k.nc, ngoai_de = k.ngoai
    from _mt_khung_tinh(p_buoi) k
   where s.id = k.id and (s.diem_toi_da is distinct from k.moi or s.nang_cao <> k.nc or s.ngoai_de <> k.ngoai);

  -- Khung của kỳ = tổng điểm tối đa theo CB/NC (bài Hình đề cũ: điểm cả bài, tính 1 lần).
  v_ky := _mt_ky_thi(p_buoi);
  select coalesce(sum(x.d) filter (where not x.nc), 0), coalesce(sum(x.d) filter (where x.nc), 0) into v_kcb, v_knc from (
    select s.diem_toi_da as d, s.nang_cao as nc from gami_session_problems s
     where s.buoi_hoc_id = p_buoi and s.phase = 'mt' and not s.ngoai_de and s.diem_toi_da is not null
    union all
    select (v_dbc ->> hh.ma_cau)::numeric, _mt_phan_nang_cao(p.id)
      from tai_lieu_phan p join tai_lieu_cau hh on hh.phan_id = p.id
     where p.tai_lieu_id = v_tl and p.loai_phan = 'custom' and hh.ma_cau like 'HINH:%' and (v_dbc ? hh.ma_cau)
       and not exists (select 1 from jsonb_object_keys(v_dbc) as kk(k) where kk.k like hh.ma_cau || '#%')
  ) x;
  if v_ky is not null and not exists (select 1 from diem_thi where ky_thi_id = v_ky and nguon = 'tay') then
    update ky_thi set khung_co_ban = v_kcb, khung_nang_cao = v_knc
     where id = v_ky and (khung_co_ban is distinct from v_kcb or khung_nang_cao is distinct from v_knc);
  end if;
  return jsonb_build_object('so_o', v_n, 'co_de', true, 'khung_co_ban', v_kcb, 'khung_nang_cao', v_knc);
end $$;


-- Cho lớp đã gán theo đề gốc ngay (buổi MT từ 01/10).
do $$
declare r record;
begin
  for r in select distinct b.id from buoi_hoc b join gami_session_problems s on s.buoi_hoc_id = b.id and s.phase = 'mt'
            where b.ngay >= date '2026-10-01' and b.loai = 'thuong' and b.trang_thai <> 'huy'
  loop perform fn_mt_khung_buoi(r.id); end loop;
end $$;
