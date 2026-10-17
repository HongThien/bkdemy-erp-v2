-- BUILDER BẢN ĐỒ MỚI — bước 4: gán lớp (trích buổi) + ôn tập (spec-builder-ban-do-moi.md B6 · CEO chốt 17/10).
-- Builder mới TÁCH RIÊNG builder cũ (Thùy 18/10): không đụng trichXuatBuoi/TrichPanel/ontap.ts của giáo trình cũ.
--
-- 1. fn_tl_bdm_trich_buoi: chép 1 buổi của giáo trình gốc sang tài liệu của LỚP (giao_trinh_buoi hoặc btvn) GIỮ CÂY
--    cha_id (buổi → nhóm → dạng bài/BTVN), 1 transaction. Tài liệu đích do client tạo (tên/số buổi của lớp — dùng
--    chung helper đặt tên với giáo trình cũ), hàm này chỉ đổ nội dung.
--      'gt'   : mốc buổi + nhóm + dạng bài + chưa phân + chưa khớp (KHÔNG BTVN)
--      'btvn' : mốc buổi + nhóm + BTVN nhóm + khối ÔN TẬP (p_on_tap)
-- 2. ÔN TẬP v1 = GV CHỌN TAY nhóm cần ôn từ các buổi TRƯỚC của giáo trình gốc; máy chỉ gợi ý câu (fn_tl_bdm_goi_y).
--    Chưa xếp theo mastery: mastery còn đo theo nhóm (dạng) CŨ, bản đồ mới chưa có mastery theo nhóm (chờ làm lại
--    mastery theo câu — CEO 17/10). Phần ôn tập = loai_phan 'ontap_nhom' (ref_ma = nhóm, cha_id = mốc buổi).
-- 3. fn_tl_bdm_noi_dung trả thêm 'on_tap' mỗi buổi (để in "PHẦN ÔN TẬP" trong phiếu BTVN). Thân lấy từ bản đang chạy.

-- ── 1. Ứng viên ôn tập: nhóm đã có ở các buổi TRƯỚC, không có trong buổi này ─────────────────────────
create or replace function fn_tl_bdm_on_tap_ung_vien(p_master uuid, p_buoi uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tt int; v_out jsonb;
begin
  if not la_thanh_vien() then raise exception 'Chỉ nhân sự mới đọc được giáo trình.' using errcode = '42501'; end if;
  select p.thu_tu into v_tt from tai_lieu_phan p where p.id = p_buoi and p.tai_lieu_id = p_master and p.loai_phan = 'buoi';
  if v_tt is null then raise exception 'Không thấy buổi này trong giáo trình.' using errcode = 'P0001'; end if;
  with truoc as (
    select n.ref_ma as nhom, b.tieu_de, b.thu_tu
      from tai_lieu_phan b join tai_lieu_phan n on n.cha_id = b.id and n.loai_phan = 'nhom'
     where b.tai_lieu_id = p_master and b.loai_phan = 'buoi' and b.thu_tu < v_tt
  ),
  nay as (select n.ref_ma from tai_lieu_phan n where n.cha_id = p_buoi and n.loai_phan = 'nhom'),
  gan as (  -- buổi gần nhất có nhóm đó
    select distinct on (t.nhom) t.nhom, t.tieu_de, t.thu_tu from truoc t
     where not exists (select 1 from nay where nay.ref_ma = t.nhom)
     order by t.nhom, t.thu_tu desc
  )
  select coalesce(jsonb_agg(jsonb_build_object('nhom', g.nhom, 'ten', bn.ten, 'buoi', g.tieu_de) order by g.thu_tu, bn.thu_tu, g.nhom), '[]'::jsonb)
    into v_out
    from gan g left join dai_bdm_nhom bn on bn.id = g.nhom;
  return v_out;
end $$;

-- ── 2. Chép 1 buổi sang tài liệu của lớp (giữ cây) ─────────────────────────────────────────────────
-- p_on_tap = [{"nhom":"NNB…","caus":["ma_cau",…]}, …] (chỉ dùng khi p_loai='btvn').
create or replace function fn_tl_bdm_trich_buoi(p_master uuid, p_buoi uuid, p_den uuid, p_loai text, p_tieu_de text, p_on_tap jsonb default '[]')
returns void language plpgsql security definer set search_path = public as $$
declare
  v_mk uuid; v_tt int := 0; r record; c record; v_n uuid; v_c uuid; v_trung text[];
begin
  if not la_thanh_vien() then raise exception 'Chỉ nhân sự mới gán được giáo trình.' using errcode = '42501'; end if;
  if p_loai not in ('gt', 'btvn') then raise exception 'p_loai phải là gt hoặc btvn.'; end if;
  if not exists (select 1 from tai_lieu t where t.id = p_master and t.ban_do = 'moi') then
    raise exception 'Giáo trình gốc không phải bản đồ mới.' using errcode = 'P0001';
  end if;
  if not exists (select 1 from tai_lieu_phan p where p.id = p_buoi and p.tai_lieu_id = p_master and p.loai_phan = 'buoi') then
    raise exception 'Không thấy buổi này trong giáo trình gốc.' using errcode = 'P0001';
  end if;
  perform 1 from tai_lieu t where t.id = p_den and t.nguon_id = p_master and t.nguon_buoi = p_buoi::text and t.ban_do = 'moi'
    and t.loai = case p_loai when 'gt' then 'giao_trinh_buoi' else 'btvn' end for update;
  if not found then raise exception 'Tài liệu đích không khớp giáo trình gốc / buổi / loại.' using errcode = 'P0001'; end if;
  if exists (select 1 from tai_lieu_phan p where p.tai_lieu_id = p_den) then
    raise exception 'Tài liệu đích đã có nội dung — tạo tài liệu mới rồi chép.' using errcode = 'P0001';
  end if;

  insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de)
  values (p_den, v_tt, 'buoi', p_tieu_de) returning id into v_mk;

  -- Phần LUYỆN (gt): nhóm → con theo đúng thứ tự gốc; BTVN (btvn): nhóm có BTVN → BTVN nhóm.
  for r in select p.* from tai_lieu_phan p where p.cha_id = p_buoi and p.loai_phan = 'nhom' order by p.thu_tu, p.id loop
    if p_loai = 'btvn' and not exists (
      select 1 from tai_lieu_phan x join tai_lieu_cau tc on tc.phan_id = x.id where x.cha_id = r.id and x.loai_phan = 'btvn_nhom') then
      continue;
    end if;
    v_tt := v_tt + 1;
    insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id, hien_lt, hien_vi_du, kieu)
    values (p_den, v_tt, 'nhom', r.ref_ma, v_mk, r.hien_lt, r.hien_vi_du, r.kieu) returning id into v_n;
    for c in select x.* from tai_lieu_phan x where x.cha_id = r.id
               and x.loai_phan = any (case p_loai when 'gt' then array['dang_bai', 'nhom_chua_phan'] else array['btvn_nhom'] end)
             order by x.thu_tu, x.id loop
      v_tt := v_tt + 1;
      insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id, hien_lt, hien_vi_du, kieu)
      values (p_den, v_tt, c.loai_phan, c.ref_ma, v_n, c.hien_lt, c.hien_vi_du, c.kieu) returning id into v_c;
      insert into tai_lieu_cau (phan_id, ma_cau, thu_tu) select v_c, tc.ma_cau, tc.thu_tu from tai_lieu_cau tc where tc.phan_id = c.id;
    end loop;
  end loop;

  if p_loai = 'gt' then
    for c in select x.* from tai_lieu_phan x where x.cha_id = p_buoi and x.loai_phan = 'chua_khop' order by x.thu_tu, x.id loop
      v_tt := v_tt + 1;
      insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, cha_id) values (p_den, v_tt, 'chua_khop', v_mk) returning id into v_c;
      insert into tai_lieu_cau (phan_id, ma_cau, thu_tu) select v_c, tc.ma_cau, tc.thu_tu from tai_lieu_cau tc where tc.phan_id = c.id;
    end loop;
  else
    -- Ôn tập: câu không được trùng câu đã có trong phiếu (cùng buổi không trùng — luật builder).
    for r in select e->>'nhom' as nhom, coalesce(array(select jsonb_array_elements_text(e->'caus')), '{}') as caus
               from jsonb_array_elements(coalesce(p_on_tap, '[]')) with ordinality as z(e, o) order by o loop
      if cardinality(r.caus) = 0 then continue; end if;
      v_trung := array(select x from unnest(r.caus) x where exists (
        select 1 from tai_lieu_phan p join tai_lieu_cau tc on tc.phan_id = p.id where p.tai_lieu_id = p_den and tc.ma_cau = x));
      if cardinality(v_trung) > 0 then
        raise exception 'Câu ôn tập trùng câu đã có trong phiếu: %', array_to_string(v_trung, ', ') using errcode = 'P0001';
      end if;
      v_tt := v_tt + 1;
      insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id) values (p_den, v_tt, 'ontap_nhom', r.nhom, v_mk) returning id into v_c;
      insert into tai_lieu_cau (phan_id, ma_cau, thu_tu) select v_c, m, (o - 1)::int from unnest(r.caus) with ordinality as y(m, o);
    end loop;
  end if;
  update tai_lieu set updated_at = now() where id = p_den;
end $$;

-- ── 3. Nội dung: thêm on_tap mỗi buổi (thân lấy từ pg_get_functiondef bản đang chạy) ──
CREATE OR REPLACE FUNCTION public.fn_tl_bdm_noi_dung(p_tai_lieu uuid, p_buoi uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$
  with ph as materialized (select p.* from tai_lieu_phan p where p.tai_lieu_id = p_tai_lieu),
  cau as materialized (
    select tc.phan_id, array_agg(tc.ma_cau order by tc.thu_tu, tc.id) as ds
      from tai_lieu_cau tc where tc.phan_id in (select ph.id from ph) group by 1
  ),
  khoi_cau as (select c.phan_id, jsonb_build_object('phan_id', c.phan_id, 'caus', to_jsonb(c.ds)) as j from cau c)
  select jsonb_build_object(
    'tai_lieu', (select jsonb_build_object('id', t.id, 'ten', t.ten, 'khoi', t.khoi, 'mon', t.mon, 'nhanh', t.nhanh,
                                           'ban_do', t.ban_do, 'luu_tru_tu', t.luu_tru_tu, 'cau_hinh', t.cau_hinh, 'updated_at', t.updated_at)
                   from tai_lieu t where t.id = p_tai_lieu),
    'buoi', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', b.id, 'tieu_de', b.tieu_de, 'thu_tu', b.thu_tu,
        'nhom', coalesce((
          select jsonb_agg(jsonb_build_object(
            'phan_id', pn.id, 'id', pn.ref_ma, 'stt', pn.stt, 'hien_lt', pn.hien_lt,
            'ten', n.ten, 'mo_ta', n.mo_ta, 'con_tren_ban_do', n.id is not null,
            'ly_thuyet', n.ly_thuyet, 'ly_thuyet_file_url', n.ly_thuyet_file_url,
            'dang_bai', coalesce((
              select jsonb_agg(jsonb_build_object(
                'phan_id', pd.id, 'id', pd.ref_ma, 'stt', pd.stt, 'hien_lt', pd.hien_lt, 'hien_vi_du', pd.hien_vi_du,
                'ten', d.ten, 'mo_ta', d.mo_ta, 'con_tren_ban_do', d.id is not null,
                'ly_thuyet', d.ly_thuyet, 'ly_thuyet_file_url', d.ly_thuyet_file_url,
                'vi_du', d.vi_du, 'vi_du_file_url', d.vi_du_file_url,
                'caus', coalesce(to_jsonb((select c.ds from cau c where c.phan_id = pd.id)), '[]'::jsonb)
              ) order by pd.stt)
              from (select p.*, row_number() over (order by p.thu_tu, p.id) as stt
                      from ph p where p.cha_id = pn.id and p.loai_phan = 'dang_bai') pd
              left join dai_bdm_dang_bai d on d.id = pd.ref_ma), '[]'::jsonb),
            'chua_phan', (select coalesce(k.j, jsonb_build_object('phan_id', p.id, 'caus', '[]'::jsonb))
                            from ph p left join khoi_cau k on k.phan_id = p.id
                           where p.cha_id = pn.id and p.loai_phan = 'nhom_chua_phan' order by p.thu_tu, p.id limit 1),
            'btvn', (select coalesce(k.j, jsonb_build_object('phan_id', p.id, 'caus', '[]'::jsonb))
                       from ph p left join khoi_cau k on k.phan_id = p.id
                      where p.cha_id = pn.id and p.loai_phan = 'btvn_nhom' order by p.thu_tu, p.id limit 1)
          ) order by pn.stt)
          from (select p.*, row_number() over (order by p.thu_tu, p.id) as stt
                  from ph p where p.cha_id = b.id and p.loai_phan = 'nhom') pn
          left join dai_bdm_nhom n on n.id = pn.ref_ma), '[]'::jsonb),
        'chua_khop', (select coalesce(k.j, jsonb_build_object('phan_id', p.id, 'caus', '[]'::jsonb))
                        from ph p left join khoi_cau k on k.phan_id = p.id
                       where p.cha_id = b.id and p.loai_phan = 'chua_khop' order by p.thu_tu, p.id limit 1),
        'on_tap', coalesce((
          select jsonb_agg(jsonb_build_object('phan_id', p.id, 'id', p.ref_ma, 'ten', n.ten,
                   'caus', coalesce(to_jsonb((select c.ds from cau c where c.phan_id = p.id)), '[]'::jsonb)) order by p.thu_tu, p.id)
            from ph p left join dai_bdm_nhom n on n.id = p.ref_ma
           where p.cha_id = b.id and p.loai_phan = 'ontap_nhom'), '[]'::jsonb)
      ) order by b.thu_tu, b.id)
      from ph b where b.loai_phan = 'buoi' and (p_buoi is null or b.id = p_buoi)), '[]'::jsonb)
  )
$function$;

do $$
declare f text;
begin
  foreach f in array array['fn_tl_bdm_on_tap_ung_vien(uuid,uuid)', 'fn_tl_bdm_trich_buoi(uuid,uuid,uuid,text,text,jsonb)', 'fn_tl_bdm_noi_dung(uuid,uuid)'] loop
    execute format('revoke execute on function %s from public, anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
end $$;
