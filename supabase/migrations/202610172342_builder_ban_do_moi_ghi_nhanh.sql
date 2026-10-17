-- BUILDER BẢN ĐỒ MỚI — 2 hàm GHI chạy quyền chủ + mặc định BTVN có _tong (đo 17/10 trên app sau mig 202610172340).
--
-- Đo bằng phiên đăng nhập thật: fn_tl_bdm_dat_buoi KHÔNG đổi gì vẫn mất 1,0 giây; thêm 1 nhóm 1 dạng bài 2,9 giây;
--   2 nhóm 3 dạng bài ≈ 7 giây — sát trần 8 giây. Script test (role chủ bảng) chỉ vài trăm ms ⇒ phần còn lại là RLS:
--   policy của tai_lieu / tai_lieu_phan / tai_lieu_cau / dai_bdm_* đều là la_thanh_vien() (2 truy vấn con), chạy lại
--   trên từng dòng ở từng câu lệnh trong hàm.
-- Sửa: fn_tl_bdm_dat_buoi + fn_tl_bdm_dat_cau chạy SECURITY DEFINER; quyền kiểm ĐÚNG MỘT LẦN ở _tl_bdm_kiem_buoi
--   (cả hai gọi nó đầu tiên) bằng chính điều kiện của policy ⇒ ai gọi được thì vốn đã ghi được các bảng đó qua RLS —
--   không nới quyền, chỉ bỏ việc kiểm lặp. Hàm chỉ đụng đúng tài liệu được truyền vào (đã khoá dòng + kiểm ban_do).
-- Kèm: mặc định BTVN / luyện-cả-nhóm thêm _tong (trước thiếu ⇒ loại nào kho không có câu là hụt luôn:
--   thử trên app 2 nhóm chỉ ra 1 câu BTVN/nhóm thay vì 4).
-- Thân fn_tl_bdm_dat_buoi lấy từ pg_get_functiondef bản đang chạy (memory: sửa hàm DB lấy thân từ bản đang chạy).

CREATE OR REPLACE FUNCTION public._tl_bdm_kiem_buoi(p_tai_lieu uuid, p_buoi uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
  if not la_thanh_vien() then raise exception 'Chỉ nhân sự mới soạn được giáo trình.' using errcode = '42501'; end if;
  perform 1 from tai_lieu t where t.id = p_tai_lieu and t.ban_do = 'moi' and t.luu_tru_tu is null for update;
  if not found then
    raise exception 'Tài liệu không phải giáo trình theo bản đồ mới (hoặc là bản lưu trữ — chỉ xem).' using errcode = 'P0001';
  end if;
  if not exists (select 1 from tai_lieu_phan p where p.id = p_buoi and p.tai_lieu_id = p_tai_lieu and p.loai_phan = 'buoi') then
    raise exception 'Không thấy buổi này trong giáo trình.' using errcode = 'P0001';
  end if;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_tl_bdm_dat_buoi(p_tai_lieu uuid, p_buoi uuid, p_chon jsonb, p_so_luyen jsonb DEFAULT '{"_tong": 2, "tu_luan": 1, "trac_nghiem": 1}'::jsonb, p_so_luyen_nhom jsonb DEFAULT '{"_tong": 6, "tu_luan": 1, "trac_nghiem": 3, "tra_loi_ngan": 2}'::jsonb, p_so_btvn jsonb DEFAULT '{"_tong": 4, "tu_luan": 1, "trac_nghiem": 2, "tra_loi_ngan": 1}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  r record; d record;
  v_nhom text; v_ds text[]; v_ds_bd text[];
  v_pn uuid; v_pd uuid;
  v_used text[];
  v_cau text[];
  v_moi boolean;
  v_seq uuid[] := '{}'; v_btvn uuid[] := '{}';
  v_all uuid[]; v_i int; v_j int;
begin
  perform _tl_bdm_kiem_buoi(p_tai_lieu, p_buoi);
  if jsonb_typeof(p_chon) is distinct from 'array' then raise exception 'p_chon phải là mảng.'; end if;

  -- Kiểm đầu vào: nhóm có thật, không trùng; dạng bài thuộc đúng nhóm, không trùng.
  if (select count(*) from jsonb_array_elements(p_chon) e) <> (select count(distinct e->>'nhom') from jsonb_array_elements(p_chon) e) then
    raise exception 'Một nhóm bị chọn 2 lần.' using errcode = 'P0001';
  end if;
  for r in select e->>'nhom' as nhom, coalesce(array(select jsonb_array_elements_text(e->'dang_bai')), '{}') as ds
             from jsonb_array_elements(p_chon) e loop
    if not exists (select 1 from dai_bdm_nhom n where n.id = r.nhom) then
      raise exception 'Nhóm % không có trên bản đồ.', r.nhom using errcode = 'P0001';
    end if;
    if cardinality(r.ds) <> (select count(distinct x) from unnest(r.ds) x) then
      raise exception 'Một dạng bài bị chọn 2 lần trong nhóm %.', r.nhom using errcode = 'P0001';
    end if;
    if exists (select 1 from unnest(r.ds) x where not exists (select 1 from dai_bdm_dang_bai db where db.id = x and db.nhom_id = r.nhom)) then
      raise exception 'Có dạng bài không thuộc nhóm %.', r.nhom using errcode = 'P0001';
    end if;
  end loop;

  -- Bỏ nhóm không còn chọn (cascade cha_id xoá phần con, cascade phan_id xoá câu).
  delete from tai_lieu_phan p
   where p.cha_id = p_buoi and p.loai_phan = 'nhom'
     and not (p.ref_ma = any (array(select e->>'nhom' from jsonb_array_elements(p_chon) e)));

  for r in select e->>'nhom' as nhom, coalesce(array(select jsonb_array_elements_text(e->'dang_bai')), '{}') as ds, o
             from jsonb_array_elements(p_chon) with ordinality as x(e, o) order by o loop
    v_nhom := r.nhom; v_ds := r.ds;
    select p.id into v_pn from tai_lieu_phan p where p.cha_id = p_buoi and p.loai_phan = 'nhom' and p.ref_ma = v_nhom;
    v_moi := v_pn is null;
    if v_moi then
      insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id)
      values (p_tai_lieu, 999999, 'nhom', v_nhom, p_buoi) returning id into v_pn;
    end if;
    v_seq := v_seq || v_pn;

    -- Bỏ dạng bài không còn chọn.
    delete from tai_lieu_phan p where p.cha_id = v_pn and p.loai_phan = 'dang_bai' and not (p.ref_ma = any (v_ds));

    -- Dạng bài: giữ cái đã có, tạo + gợi ý cái mới.
    for d in select x as db, o from unnest(v_ds) with ordinality as y(x, o) order by o loop
      select p.id into v_pd from tai_lieu_phan p where p.cha_id = v_pn and p.loai_phan = 'dang_bai' and p.ref_ma = d.db;
      if v_pd is null then
        insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id)
        values (p_tai_lieu, 999999, 'dang_bai', d.db, v_pn) returning id into v_pd;
        v_used := _tl_bdm_cau_da_dung(p_buoi);
        perform _tl_bdm_ghi_cau(v_pd, fn_tl_bdm_goi_y(v_nhom, array[d.db], p_so_luyen, v_used));
      end if;
      v_seq := v_seq || v_pd;
      v_pd := null;
    end loop;

    -- Nhóm mới mà bản đồ chưa có dạng bài nào ⇒ câu luyện theo cả nhóm.
    v_ds_bd := array(select db.id from dai_bdm_dang_bai db where db.nhom_id = v_nhom);
    if v_moi and cardinality(v_ds_bd) = 0 then
      insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id)
      values (p_tai_lieu, 999999, 'nhom_chua_phan', v_nhom, v_pn) returning id into v_pd;
      v_used := _tl_bdm_cau_da_dung(p_buoi);
      perform _tl_bdm_ghi_cau(v_pd, fn_tl_bdm_goi_y(v_nhom, null, p_so_luyen_nhom, v_used));
      v_pd := null;
    end if;
    -- chưa phân đứng sau các dạng bài
    v_seq := v_seq || array(select p.id from tai_lieu_phan p where p.cha_id = v_pn and p.loai_phan = 'nhom_chua_phan' order by p.thu_tu, p.id);

    -- BTVN của nhóm: chỉ tự gợi ý khi nhóm mới thêm (nhóm cũ giữ câu GV đã chỉnh).
    if v_moi then
      insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id)
      values (p_tai_lieu, 999999, 'btvn_nhom', v_nhom, v_pn) returning id into v_pd;
      v_used := _tl_bdm_cau_da_dung(p_buoi);
      perform _tl_bdm_ghi_cau(v_pd, fn_tl_bdm_goi_y(v_nhom, case when cardinality(v_ds_bd) = 0 then null else v_ds end, p_so_btvn, v_used));
      v_pd := null;
    end if;
    v_btvn := v_btvn || array(select p.id from tai_lieu_phan p where p.cha_id = v_pn and p.loai_phan = 'btvn_nhom' order by p.thu_tu, p.id);
    v_pn := null;
  end loop;

  -- Phần khác của buổi (chua_khop, con lạ) giữ nguyên, xếp sau phần luyện, trước BTVN.
  v_seq := p_buoi || v_seq
        || array(select p.id from _tl_bdm_phan_cua_buoi(p_buoi) p
                  where not (p.id = any (v_seq)) and not (p.id = any (v_btvn)) order by p.thu_tu, p.id)
        || v_btvn;

  -- Thay đúng đoạn của buổi này trong thứ tự cả tài liệu (các buổi khác giữ nguyên chỗ).
  v_all := array(select p.id from tai_lieu_phan p where p.tai_lieu_id = p_tai_lieu order by p.thu_tu, p.id);
  v_i := array_position(v_all, p_buoi);
  v_j := v_i + 1;
  while v_j <= cardinality(v_all)
        and not exists (select 1 from tai_lieu_phan p where p.id = v_all[v_j] and p.loai_phan = 'buoi') loop
    v_j := v_j + 1;
  end loop;
  v_all := coalesce(v_all[1:v_i - 1], '{}')
        || v_seq
        || array(select x from unnest(coalesce(v_all[v_i:v_j - 1], '{}')) x where not (x = any (v_seq)))   -- phần rời không thuộc khung (giữ, không mất)
        || coalesce(v_all[v_j:], '{}');
  update tai_lieu_phan p set thu_tu = x.o - 1
    from unnest(v_all) with ordinality as x(id, o)
   where p.id = x.id and p.thu_tu is distinct from (x.o - 1)::int;

  update tai_lieu set updated_at = now() where id = p_tai_lieu;   -- đổi nội dung con ⇒ bump cha (CLAUDE.md §2)
  return fn_tl_bdm_noi_dung(p_tai_lieu, p_buoi);
end $function$;

alter function fn_tl_bdm_dat_cau(uuid, text[]) security definer set search_path = public;

do $$
declare f text;
begin
  foreach f in array array['_tl_bdm_kiem_buoi(uuid,uuid)', 'fn_tl_bdm_dat_buoi(uuid,uuid,jsonb,jsonb,jsonb,jsonb)', 'fn_tl_bdm_dat_cau(uuid,text[])'] loop
    execute format('revoke execute on function %s from public, anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
end $$;
