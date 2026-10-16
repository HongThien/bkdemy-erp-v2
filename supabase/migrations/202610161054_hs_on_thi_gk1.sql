-- Box "Ôn thi giữa kì I" của app HS (Thùy 16/10): 2 tab Đề cương · Đề thi các trường.
-- Nguồn = Kho đề thi sẵn có (tai_lieu loai='de_thi'; đề cương = cau_hinh.deThi.kieu='de_cuong').
-- HS CHỈ thấy đề ĐÃ DUYỆT (duyet_at not null) đúng KHỐI của em ở môn đang chọn. Chỉ ĐỌC — không chấm, không đo mastery.
-- security definer vì HS không có RLS đọc tai_lieu / bảng kho; cổng quyền nằm trong hàm (khối + duyệt).

create or replace function public._hs_on_thi_khoi(p_mon text)
returns text language sql stable security definer set search_path to 'public' as $$
  select l.khoi from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
   where hl.hoc_sinh_id = public.my_hoc_sinh_id() and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
   order by hl.ngay_vao desc nulls last limit 1
$$;

create or replace function public.fn_hs_on_thi_ds(p_mon text)
returns jsonb language sql stable security definer set search_path to 'public' as $$
  with k as (select public._hs_on_thi_khoi(p_mon) khoi)
  select coalesce(jsonb_agg(jsonb_build_object(
      'id', t.id, 'ten', t.ten,
      'tab', case when coalesce(t.cau_hinh -> 'deThi' ->> 'kieu', '') = 'de_cuong' then 'de_cuong' else 'de_thi' end,
      'nguon', nullif(t.cau_hinh -> 'deThi' ->> 'nguon', ''),
      'nam', nullif(t.cau_hinh -> 'deThi' ->> 'nam', '')::int,
      'so_cau', (select count(*) from tai_lieu_phan p join tai_lieu_cau c on c.phan_id = p.id where p.tai_lieu_id = t.id and p.loai_phan = 'custom')
    ) order by t.updated_at desc), '[]'::jsonb)
  from tai_lieu t, k
  where k.khoi is not null and t.loai = 'de_thi' and t.mon = p_mon and t.khoi = k.khoi and t.duyet_at is not null
$$;

create or replace function public.fn_hs_on_thi_xem(p_de uuid)
returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
declare
  tl record; v_phans jsonb := '[]'::jsonb; r record; v jsonb; kho text; n int := 0; cau jsonb;
  v_cur uuid; v_cs jsonb := '[]'::jsonb; v_tt text;
begin
  select t.id, t.ten, t.mon, t.khoi, t.cau_hinh, t.nhanh into tl from tai_lieu t
   where t.id = p_de and t.loai = 'de_thi' and t.duyet_at is not null;
  if tl.id is null or public._hs_on_thi_khoi(tl.mon) is distinct from tl.khoi then return null; end if;
  for r in
    select p.id pid, p.tieu_de ptd, c.ma_cau cma
      from tai_lieu_phan p join tai_lieu_cau c on c.phan_id = p.id
     where p.tai_lieu_id = p_de and p.loai_phan = 'custom' order by p.thu_tu, c.thu_tu
  loop
    if v_cur is distinct from r.pid then
      if v_cur is not null then v_phans := v_phans || jsonb_build_object('tieu_de', v_tt, 'cau', v_cs); end if;
      v_cur := r.pid; v_tt := r.ptd; v_cs := '[]'::jsonb;
    end if;
    kho := public._de_thi_kho(tl.cau_hinh, tl.nhanh, tl.mon, r.cma);
    v := null;
    if to_regclass('public.' || kho || '_cau_hoi') is not null then
      execute format('select to_jsonb(q) from %I q where q.ma_cau = $1 and q.xoa_at is null', kho || '_cau_hoi') into v using r.cma;
    end if;
    if v is null then continue; end if;
    n := n + 1;
    cau := jsonb_build_object('stt', n, 'ma_cau', r.cma, 'loai_cau', v -> 'loai_cau', 'noi_dung', v -> 'noi_dung',
      'lua_chon', v -> 'lua_chon', 'menh_de', v -> 'menh_de', 'dap_an', v -> 'dap_an', 'loi_giai', v -> 'loi_giai',
      'anh_de', v -> 'anh_de', 'anh_dap_an', v -> 'anh_dap_an');
    v_cs := v_cs || cau;
  end loop;
  if v_cur is not null then v_phans := v_phans || jsonb_build_object('tieu_de', v_tt, 'cau', v_cs); end if;
  return jsonb_build_object('id', tl.id, 'ten', tl.ten, 'phans', v_phans);
end $$;

revoke execute on function public._hs_on_thi_khoi(text), public.fn_hs_on_thi_ds(text), public.fn_hs_on_thi_xem(uuid) from public, anon;
grant execute on function public._hs_on_thi_khoi(text), public.fn_hs_on_thi_ds(text), public.fn_hs_on_thi_xem(uuid) to authenticated;
