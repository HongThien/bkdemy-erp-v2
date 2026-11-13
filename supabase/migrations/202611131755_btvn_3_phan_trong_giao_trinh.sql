-- ============================================================================
-- 202611131755 — btvn_3_phan_trong_giao_trinh
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 13/11, sau khi xem bản 202611131635): "đây là phải gán mới thấy à … builder BTVN phải có 3 phần: buổi hôm nay,
--   buổi trước, buổi trước nữa. Mỗi buổi có sẵn dạng luôn để giáo viên chọn. Tỉ lệ 5–3–2 tương đối cho giáo viên thôi, không tuyệt đối."
--   ⇒ BTVN xếp chồng được SOẠN NGAY TRONG GIÁO TRÌNH GỐC (builder, chế độ BTVN), không phải máy tự cắt lúc gán lớp:
--     buổi N có 3 phần — bài của buổi N (btvn_nhom như cũ) · luyện lại buổi N-1 · luyện lại buổi N-2. Hai phần luyện lại bày sẵn
--     NHÓM + DẠNG BÀI của buổi đó; GV bấm Gợi ý / Chọn câu. 5–3–2 chỉ là SỐ CÂU MẶC ĐỊNH của nút Gợi ý (5 · 3 · 2 câu mỗi nhóm).
--   Gán lớp chỉ CHÉP đúng 3 phần đã soạn (không tự chia nữa).
-- LUẬT:
--   · Phần luyện lại lưu trong giáo trình gốc y như trong phiếu của lớp: loai_phan 'ontap_nhom' + lui_bac (1/2) + lui_buoi (mốc buổi
--     được luyện lại), cha_id = mốc buổi N ⇒ fn_tl_bdm_noi_dung, bản in, phiếu lớp đọc được ngay, không thêm loại phần.
--   · "Buổi trước" = 2 buổi CÓ NHÓM đứng ngay trước buổi N theo thứ tự của chính giáo trình đó.
--   · Câu luyện lại là câu MỚI lấy từ kho theo dạng bài của buổi đó và KHÔNG được có ở bất cứ chỗ nào khác trong giáo trình
--     (bài luyện, BTVN, phần luyện lại của buổi nào cũng vậy) ⇒ HS không gặp một câu 2 lần. (Bản đầu chỉ né buổi N + buổi được
--     luyện lại ⇒ một nhóm dạy 2 buổi liền bị lấy cùng 1 câu cho phiếu 2 và phiếu 3 — bài thử bắt được.)
--   · Đổi thứ tự / xoá buổi / bỏ nhóm làm phần luyện lại không còn khớp ⇒ KHÔNG tự xoá: hàm khung trả riêng ở 'le' để GV thấy và bỏ.
--   · Copy buổi sang giáo trình khác: KHÔNG chép phần luyện lại (buổi trước của giáo trình đích là buổi khác).
-- MẤT GÌ (Luật xoá): KHÔNG mất dữ liệu. Thêm 6 hàm; vá 3 hàm trên định nghĩa đang chạy (fn_tl_bdm_trich_btvn: câu luyện lại kiểm
--   theo phần luyện lại của giáo trình gốc · fn_tl_bdm_copy_buoi · _mtt_nhom_lui). Ba hàm tự chia của bản trước
--   (_tl_bdm_btvn_chia · _tl_bdm_btvn_lui · fn_tl_bdm_btvn_xep_chong) GIỮ NGUYÊN trên DB, client thôi gọi — gỡ là việc riêng.
-- ============================================================================

-- ── 1. Bậc của một buổi so với buổi N: 1 = buổi có nhóm liền trước, 2 = buổi trước nữa, NULL = không phải ────────
create or replace function public._tl_bdm_lui_bac(p_tai_lieu uuid, p_buoi uuid, p_lui_buoi uuid)
returns integer language sql stable security definer set search_path to 'public' as $$
  select t.bac from (
    select y.id, (row_number() over (order by y.thu_tu desc, y.id desc))::int as bac
      from tai_lieu_phan y join tai_lieu_phan x on x.id = p_buoi and x.tai_lieu_id = p_tai_lieu and x.loai_phan = 'buoi'
     where y.tai_lieu_id = p_tai_lieu and y.loai_phan = 'buoi' and (y.thu_tu, y.id) < (x.thu_tu, x.id)
       and exists (select 1 from tai_lieu_phan n where n.cha_id = y.id and n.loai_phan = 'nhom')
     order by y.thu_tu desc, y.id desc limit 2) t
   where t.id = p_lui_buoi
$$;

-- ── 2. Khung BTVN của cả giáo trình: mỗi buổi → 2 buổi trước + nhóm/dạng bài bày sẵn + câu đã chọn ───────────────
-- { "tru":  [mọi câu đang có trong giáo trình — ô luyện lại không được chọn lại],
--   "buoi": { "<buổi>": { "lui": [{bac, buoi, tieu_de, nhom:[{nhom, ten, dang_bai:[…], phan_id, caus:[…]}]}],
--                         "le":  [{phan_id, nhom, ten, caus}]   -- phần luyện lại không còn khớp buổi trước (đổi thứ tự / bỏ nhóm)
--           } } }
create or replace function public.fn_tl_bdm_btvn_khung(p_tai_lieu uuid)
returns jsonb language sql stable security definer set search_path to 'public' as $$
  with b as (
    select p.id, p.thu_tu, p.tieu_de,
           exists (select 1 from tai_lieu_phan n where n.cha_id = p.id and n.loai_phan = 'nhom') as co_nhom
      from tai_lieu_phan p where p.tai_lieu_id = p_tai_lieu and p.loai_phan = 'buoi' and la_thanh_vien()
  ),
  cap as (
    select x.id as buoi, t.id as lui, t.tieu_de, t.bac
      from b x cross join lateral (
        select y.id, y.tieu_de, (row_number() over (order by y.thu_tu desc, y.id desc))::int as bac
          from b y where y.co_nhom and (y.thu_tu, y.id) < (x.thu_tu, x.id)
         order by y.thu_tu desc, y.id desc limit 2) t
  ),
  lp as (
    select p.id, p.cha_id as buoi, p.lui_buoi, p.ref_ma as nhom, p.thu_tu,
           coalesce((select array_agg(tc.ma_cau order by tc.thu_tu, tc.id) from tai_lieu_cau tc where tc.phan_id = p.id), '{}') as caus
      from tai_lieu_phan p
     where p.tai_lieu_id = p_tai_lieu and p.loai_phan = 'ontap_nhom' and p.lui_bac is not null
  ),
  o as (
    select c.buoi, c.bac, jsonb_build_object(
             'bac', c.bac, 'buoi', c.lui, 'tieu_de', c.tieu_de,
             'nhom', coalesce((
               select jsonb_agg(jsonb_build_object(
                        'nhom', n.ref_ma, 'ten', nv.ten,
                        'dang_bai', coalesce((select jsonb_agg(d.ref_ma order by d.thu_tu, d.id) from tai_lieu_phan d
                                               where d.cha_id = n.id and d.loai_phan = 'dang_bai'), '[]'::jsonb),
                        'phan_id', s.id, 'caus', coalesce(to_jsonb(s.caus), '[]'::jsonb)) order by n.thu_tu, n.id)
                 from tai_lieu_phan n
                 left join tl_bdm_nhom_v nv on nv.id = n.ref_ma
                 left join lateral (select k.id, k.caus from lp k
                                     where k.buoi = c.buoi and k.lui_buoi = c.lui and k.nhom = n.ref_ma
                                     order by k.thu_tu, k.id limit 1) s on true
                where n.cha_id = c.lui and n.loai_phan = 'nhom'), '[]'::jsonb)) as j
      from cap c
  )
  select jsonb_build_object(
    'tru', coalesce((select to_jsonb(array_agg(distinct tc.ma_cau)) from tai_lieu_phan p join tai_lieu_cau tc on tc.phan_id = p.id
                      where p.tai_lieu_id = p_tai_lieu and la_thanh_vien()), '[]'::jsonb),
    'buoi', (select coalesce(jsonb_object_agg(x.id, jsonb_build_object(
           'lui', coalesce((select jsonb_agg(o.j order by o.bac) from o where o.buoi = x.id), '[]'::jsonb),
           'le', coalesce((
             select jsonb_agg(jsonb_build_object('phan_id', k.id, 'nhom', k.nhom, 'ten', nv.ten, 'caus', to_jsonb(k.caus)) order by k.thu_tu, k.id)
               from lp k left join tl_bdm_nhom_v nv on nv.id = k.nhom
              where k.buoi = x.id
                and not exists (select 1 from cap c join tai_lieu_phan n on n.cha_id = c.lui and n.loai_phan = 'nhom' and n.ref_ma = k.nhom
                                 where c.buoi = x.id and c.lui = k.lui_buoi)), '[]'::jsonb))), '{}'::jsonb)
    from b x))
$$;

-- ── 3. Đặt câu cho MỘT ô luyện lại (buổi N × buổi trước × nhóm); danh sách rỗng = bỏ ô ───────────────────────────
create or replace function public.fn_tl_bdm_dat_cau_lui(p_tai_lieu uuid, p_buoi uuid, p_lui_buoi uuid, p_nhom text, p_ma_caus text[])
returns void language plpgsql security definer set search_path to 'public' as $$
declare
  v_bac int; v_phan uuid; v_idx int; v_trung text[]; v_caus text[] := coalesce(p_ma_caus, '{}');
begin
  perform _tl_bdm_kiem_buoi(p_tai_lieu, p_buoi);
  select p.id into v_phan from tai_lieu_phan p
   where p.cha_id = p_buoi and p.loai_phan = 'ontap_nhom' and p.lui_bac is not null and p.lui_buoi = p_lui_buoi and p.ref_ma = p_nhom
   order by p.thu_tu, p.id limit 1;

  if cardinality(v_caus) = 0 then
    if v_phan is not null then
      delete from tai_lieu_phan where id = v_phan;   -- GV bỏ hết câu của ô ⇒ ô không còn (câu theo cascade phan_id)
      update tai_lieu set updated_at = now() where id = p_tai_lieu;
    end if;
    return;
  end if;

  v_bac := public._tl_bdm_lui_bac(p_tai_lieu, p_buoi, p_lui_buoi);
  if v_bac is null then raise exception 'Buổi được luyện lại phải là một trong hai buổi liền trước.' using errcode = 'P0001'; end if;
  select z.rn into v_idx from (
    select n.ref_ma, (row_number() over (order by n.thu_tu, n.id))::int as rn
      from tai_lieu_phan n where n.cha_id = p_lui_buoi and n.loai_phan = 'nhom') z
   where z.ref_ma = p_nhom limit 1;
  if v_idx is null then raise exception 'Nhóm này không thuộc buổi được luyện lại.' using errcode = 'P0001'; end if;

  if cardinality(v_caus) <> (select count(distinct x) from unnest(v_caus) x) then
    raise exception 'Danh sách có câu lặp.' using errcode = 'P0001';
  end if;
  v_trung := array(select x from unnest(v_caus) x where x = any (_tl_bdm_cau_da_dung(p_buoi, v_phan)));
  if cardinality(v_trung) > 0 then
    raise exception 'Câu đã dùng ở phần khác trong buổi: %', array_to_string(v_trung, ', ') using errcode = 'P0001';
  end if;
  v_trung := array(select x from unnest(v_caus) x where x = any (_tl_bdm_cau_da_dung(p_lui_buoi)));
  if cardinality(v_trung) > 0 then
    raise exception 'Câu đã có trong bài của chính buổi đó (học sinh đã làm): %', array_to_string(v_trung, ', ') using errcode = 'P0001';
  end if;
  v_trung := array(select x from unnest(v_caus) x where exists (
    select 1 from tai_lieu_phan k join tai_lieu_cau tc on tc.phan_id = k.id
     where k.tai_lieu_id = p_tai_lieu and k.id is distinct from v_phan and tc.ma_cau = x));
  if cardinality(v_trung) > 0 then
    raise exception 'Câu đã có ở chỗ khác trong giáo trình (học sinh sẽ gặp 2 lần): %', array_to_string(v_trung, ', ') using errcode = 'P0001';
  end if;

  if v_phan is null then
    insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id, lui_bac, lui_buoi)
    values (p_tai_lieu, 900000 + v_bac * 1000 + v_idx, 'ontap_nhom', p_nhom, p_buoi, v_bac, p_lui_buoi) returning id into v_phan;
  else
    update tai_lieu_phan set lui_bac = v_bac where id = v_phan and lui_bac is distinct from v_bac;
  end if;
  perform _tl_bdm_ghi_cau(v_phan, v_caus);
  update tai_lieu set updated_at = now() where id = p_tai_lieu;
end $$;

-- ── 4. Bỏ một phần luyện lại không còn khớp (theo id phần) ──────────────────────────────────────────────────────
create or replace function public.fn_tl_bdm_bo_phan_lui(p_phan uuid)
returns void language plpgsql security definer set search_path to 'public' as $$
declare v_tl uuid; v_buoi uuid;
begin
  select p.tai_lieu_id, p.cha_id into v_tl, v_buoi from tai_lieu_phan p
   where p.id = p_phan and p.loai_phan = 'ontap_nhom' and p.lui_bac is not null;
  if v_tl is null then raise exception 'Không phải phần luyện lại.' using errcode = 'P0001'; end if;
  perform _tl_bdm_kiem_buoi(v_tl, v_buoi);
  delete from tai_lieu_phan where id = p_phan;
  update tai_lieu set updated_at = now() where id = v_tl;
end $$;

-- ── 5. Gợi ý câu cho MỘT ô luyện lại rồi ghi luôn (mặc định buổi trước 3 câu, buổi trước nữa 2 câu) ─────────────────
create or replace function public.fn_tl_bdm_lui_goi_y(p_tai_lieu uuid, p_buoi uuid, p_lui_buoi uuid, p_nhom text, p_so jsonb default null)
returns text[] language plpgsql security definer set search_path to 'public' as $$
declare v_bac int; v_ds text[]; v_tru text[]; v_cau text[]; v_so jsonb;
begin
  perform _tl_bdm_kiem_buoi(p_tai_lieu, p_buoi);
  v_bac := public._tl_bdm_lui_bac(p_tai_lieu, p_buoi, p_lui_buoi);
  if v_bac is null then raise exception 'Buổi được luyện lại phải là một trong hai buổi liền trước.' using errcode = 'P0001'; end if;
  v_ds := array(select d.ref_ma from tai_lieu_phan n join tai_lieu_phan d on d.cha_id = n.id and d.loai_phan = 'dang_bai'
                 where n.cha_id = p_lui_buoi and n.loai_phan = 'nhom' and n.ref_ma = p_nhom order by d.thu_tu, d.id);
  -- né MỌI câu đang có trong giáo trình (kể cả bộ đang có ở ô này ⇒ ra bộ khác)
  v_tru := coalesce((select array_agg(distinct tc.ma_cau) from tai_lieu_phan k join tai_lieu_cau tc on tc.phan_id = k.id
                      where k.tai_lieu_id = p_tai_lieu), '{}');
  v_so := coalesce(p_so, case v_bac when 1 then '{"_tong": 3, "trac_nghiem": 1, "tra_loi_ngan": 1, "tu_luan": 1}'::jsonb
                                    else '{"_tong": 2, "trac_nghiem": 1, "tu_luan": 1}'::jsonb end);
  v_cau := fn_tl_bdm_goi_y(p_nhom, case when cardinality(v_ds) = 0 then null else v_ds end, v_so, v_tru);
  if cardinality(coalesce(v_cau, '{}')) = 0 then return '{}'; end if;   -- hết câu khác ⇒ giữ bộ đang có
  perform public.fn_tl_bdm_dat_cau_lui(p_tai_lieu, p_buoi, p_lui_buoi, p_nhom, v_cau);
  return v_cau;
end $$;

-- ── 6. Gợi ý cho MỌI ô luyện lại còn trống của một buổi (nút "Gợi ý cả phần luyện lại") ───────────────────────────
create or replace function public.fn_tl_bdm_lui_goi_y_buoi(p_tai_lieu uuid, p_buoi uuid)
returns integer language plpgsql security definer set search_path to 'public' as $$
declare r record; v_n int := 0;
begin
  perform _tl_bdm_kiem_buoi(p_tai_lieu, p_buoi);
  for r in
    select y.id as lui, n.ref_ma as nhom
      from tai_lieu_phan y
      join tai_lieu_phan n on n.cha_id = y.id and n.loai_phan = 'nhom'
     where y.tai_lieu_id = p_tai_lieu and y.loai_phan = 'buoi' and public._tl_bdm_lui_bac(p_tai_lieu, p_buoi, y.id) is not null
       and not exists (select 1 from tai_lieu_phan k where k.cha_id = p_buoi and k.loai_phan = 'ontap_nhom' and k.lui_bac is not null
                          and k.lui_buoi = y.id and k.ref_ma = n.ref_ma)
     order by public._tl_bdm_lui_bac(p_tai_lieu, p_buoi, y.id), n.thu_tu, n.id
  loop
    if cardinality(public.fn_tl_bdm_lui_goi_y(p_tai_lieu, p_buoi, r.lui, r.nhom, null)) > 0 then v_n := v_n + 1; end if;
  end loop;
  return v_n;
end $$;

-- ── 7. fn_tl_bdm_trich_btvn: câu luyện lại kiểm theo PHẦN LUYỆN LẠI của giáo trình gốc (không còn theo BTVN của buổi trước) ──
do $mig$
declare
  d text; n text; c integer;
  a_cu text := replace($a$    if r.bac is null or r.bac not in (1, 2) or r.buoi is null then
      raise exception 'Phần luyện lại thiếu bậc (1/2) hoặc buổi gốc.' using errcode = 'P0001';
    end if;
    v_la := array(select m from unnest(r.caus) m where not exists (
      select 1 from tai_lieu_phan b
        join tai_lieu tg on tg.id = b.tai_lieu_id and tg.ban_do = 'moi'
        join tai_lieu_phan n on n.cha_id = b.id and n.loai_phan = 'nhom' and n.ref_ma = r.nhom
        join tai_lieu_phan x on x.cha_id = n.id and x.loai_phan = 'btvn_nhom'
        join tai_lieu_cau tc on tc.phan_id = x.id
       where b.id = r.buoi and b.loai_phan = 'buoi' and tc.ma_cau = m));
    if cardinality(v_la) > 0 then
      raise exception 'Câu luyện lại không thuộc BTVN của buổi gốc: %', array_to_string(v_la, ', ') using errcode = 'P0001';
    end if;$a$, E'\r', '');
  a_moi text := replace($a$    if r.bac is null or r.bac not in (1, 2) then
      raise exception 'Phần luyện lại thiếu bậc (1/2).' using errcode = 'P0001';
    end if;
    -- 13/11 (mig 202611131755): phần luyện lại được SOẠN trong giáo trình gốc ⇒ câu phải thuộc phần luyện lại của buổi này, đúng nhóm
    v_la := array(select m from unnest(r.caus) m where not exists (
      select 1 from tai_lieu_phan x join tai_lieu_cau tc on tc.phan_id = x.id
       where x.cha_id = p_buoi and x.loai_phan = 'ontap_nhom' and x.lui_bac is not null and x.ref_ma = r.nhom and tc.ma_cau = m));
    if cardinality(v_la) > 0 then
      raise exception 'Câu luyện lại không thuộc phần luyện lại đã soạn của buổi này: %', array_to_string(v_la, ', ') using errcode = 'P0001';
    end if;$a$, E'\r', '');
begin
  select replace(pg_get_functiondef('public.fn_tl_bdm_trich_btvn(uuid,uuid,uuid,text,jsonb)'::regprocedure), E'\r', '') into d;
  if position('mig 202611131755' in d) = 0 then
    c := (length(d) - length(replace(d, a_cu, ''))) / length(a_cu);
    if c <> 1 then raise exception 'fn_tl_bdm_trich_btvn đã đổi: thấy % chỗ kiểm câu luyện lại, cần đúng 1', c; end if;
    execute replace(d, a_cu, a_moi);
  end if;
end $mig$;

-- ── 8. fn_tl_bdm_copy_buoi: không chép phần luyện lại sang giáo trình khác ────────────────────────────────────────
do $mig$
declare
  d text; c integer;
  a_cu text := replace($a$       where p.cha_id = p_buoi_nguon
      union all$a$, E'\r', '');
  a_moi text := replace($a$       where p.cha_id = p_buoi_nguon and p.lui_bac is null   -- 13/11: phần luyện lại bám buổi trước của giáo trình NGUỒN ⇒ không chép
      union all$a$, E'\r', '');
begin
  select replace(pg_get_functiondef('public.fn_tl_bdm_copy_buoi(uuid,uuid,text)'::regprocedure), E'\r', '') into d;
  if position('p.lui_bac is null' in d) = 0 then
    c := (length(d) - length(replace(d, a_cu, ''))) / length(a_cu);
    if c <> 1 then raise exception 'fn_tl_bdm_copy_buoi đã đổi: thấy % chỗ duyệt cây buổi, cần đúng 1', c; end if;
    execute replace(d, a_cu, a_moi);
  end if;
end $mig$;

-- ── 9. Mục tiêu tuần: phiếu chưa tạo ⇒ nhóm luyện lại dự kiến = phần luyện lại đã soạn trong giáo trình gốc của buổi đó ──
create or replace function public._mtt_nhom_lui(p_lop uuid, p_ngay date)
returns text[]
language sql stable security definer set search_path to 'public' as $$
  with phieu as (
    select t.id from tai_lieu t where t.lop_id = p_lop and t.ngay = p_ngay and t.loai = 'btvn' and t.hoc_sinh_id is null
  ),
  c as (
    select tc.ma_cau
      from phieu f join tai_lieu_phan tp on tp.tai_lieu_id = f.id join tai_lieu_cau tc on tc.phan_id = tp.id
     where tp.loai_phan in ('ontap', 'ontap_nhom') and tc.ma_cau is not null
    union
    select tc.ma_cau
      from tai_lieu t
      join tai_lieu_phan k on k.cha_id = case when t.nguon_buoi ~ '^[0-9a-fA-F-]{36}$' then t.nguon_buoi::uuid end
                          and k.loai_phan = 'ontap_nhom' and k.lui_bac is not null
      join tai_lieu_cau tc on tc.phan_id = k.id
     where t.lop_id = p_lop and t.ngay = p_ngay and t.loai = 'giao_trinh_buoi' and t.ban_do = 'moi' and t.hoc_sinh_id is null
       and not exists (select 1 from phieu)
  )
  select coalesce(array_agg(distinct n) filter (where n is not null), '{}')
    from (select public._do_o_quy(public._mastery_bdm_bat(), false, c.ma_cau, '') as n from c) x
$$;

-- ── 10. Quyền ───────────────────────────────────────────────────────────────────────────────────────────────────
do $$
declare f text;
begin
  execute 'revoke all on function public._tl_bdm_lui_bac(uuid,uuid,uuid) from public, anon, authenticated';
  execute 'grant execute on function public._tl_bdm_lui_bac(uuid,uuid,uuid) to service_role';
  foreach f in array array[
    'fn_tl_bdm_btvn_khung(uuid)', 'fn_tl_bdm_dat_cau_lui(uuid,uuid,uuid,text,text[])', 'fn_tl_bdm_bo_phan_lui(uuid)',
    'fn_tl_bdm_lui_goi_y(uuid,uuid,uuid,text,jsonb)', 'fn_tl_bdm_lui_goi_y_buoi(uuid,uuid)'] loop
    execute format('revoke all on function public.%s from public, anon', f);
    execute format('grant execute on function public.%s to authenticated, service_role', f);
  end loop;
end $$;
