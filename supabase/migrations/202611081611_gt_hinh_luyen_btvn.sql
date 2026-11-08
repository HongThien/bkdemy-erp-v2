-- ============================================================================
-- 202611081611 — gt_hinh_luyen_btvn
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 08/11 "lúc gán lớp xong in bài tập bị trắng trang" + chọn "Thêm BTVN cho Luyện": giáo trình Hình (mig 202610271757) chỉ có
--   BTVN ở phần HỌC; buổi chỉ có LUYỆN (9S1 buổi 36: MH.129) ⇒ tài liệu BTVN của lớp rỗng ⇒ in trắng.
--   Thêm phần 'hl_btvn' (con của buổi, ref_ma = id mô hình — như hl_mo_hinh): bài kho về nhà của từng mô hình. Ghi qua
--   fn_tl_hl_dat_btvn (1 hàm: tạo phần nếu chưa có, thay bài, rỗng ⇒ gỡ phần). Bài không trùng bài trên lớp cùng buổi (fn_tl_hl_dat_bai
--   vốn chặn "đã dùng ở phần khác cùng buổi" ⇒ tự áp cả 2 chiều). Gán lớp BTVN chép cả 'btvn' + 'hl_btvn'; buổi không có gì để
--   về nhà ⇒ TỪ CHỐI tạo phiếu (trichBuoiBdm tự gỡ tài liệu vừa tạo) thay vì đẻ phiếu trắng.
--   Thân các hàm cũ chép từ DB live (pg_get_functiondef), chỉ sửa đúng chỗ ghi chú.
-- MẤT GÌ (Luật xoá): Không mất dữ liệu có sẵn. Hàm mới chỉ xoá phần hl_btvn / dòng chọn bài của chính nó khi người soạn bỏ hết bài
--   hoặc bỏ mô hình (dòng CHỌN trong tài liệu, kho bài giữ nguyên) — cùng kiểu fn_tl_hl_dat_bai / fn_tl_hl_dat_mo_hinh đang làm.
-- ============================================================================

CREATE OR REPLACE FUNCTION public._tl_hl_xep(p_tai_lieu uuid)
 RETURNS void
 LANGUAGE sql
AS $function$
  with k as (
    select p.id, row_number() over (order by coalesce(b.thu_tu, p.thu_tu), coalesce(b.id, p.id), (p.loai_phan <> 'buoi'),
                                             case p.loai_phan when 'dang' then 0 when 'hl_mo_hinh' then 1 when 'hl_khac' then 2 when 'btvn' then 3 when 'hl_btvn' then 4 else 5 end,
                                             p.thu_tu, p.id) - 1 as tt
      from tai_lieu_phan p left join tai_lieu_phan b on b.id = p.cha_id and b.loai_phan = 'buoi'
     where p.tai_lieu_id = p_tai_lieu
  )
  update tai_lieu_phan p set thu_tu = k.tt from k where p.id = k.id and p.thu_tu is distinct from k.tt::int
$function$;

CREATE OR REPLACE FUNCTION public.fn_tl_hl_dat_bai(p_phan uuid, p_ma_bai text[])
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_tl uuid; v_buoi uuid;
begin
  select p.tai_lieu_id, p.cha_id into v_tl, v_buoi from tai_lieu_phan p where p.id = p_phan and p.loai_phan in ('hl_mo_hinh', 'hl_khac', 'hl_btvn');
  if v_tl is null then raise exception 'Phần này không nhận bài Hình.' using errcode = 'P0001'; end if;
  perform _tl_hl_kiem(v_tl, v_buoi);
  if cardinality(coalesce(p_ma_bai, '{}')) <> (select count(distinct x) from unnest(coalesce(p_ma_bai, '{}')) x) then
    raise exception 'Danh sách có bài lặp.' using errcode = 'P0001';
  end if;
  if exists (select 1 from unnest(coalesce(p_ma_bai, '{}')) x where not exists (select 1 from hinh_bai b where b.ma_bai = x)) then
    raise exception 'Có mã bài không có trong kho Hình–Luyện.' using errcode = 'P0001';
  end if;
  if exists (select 1 from tai_lieu_cau tc join tai_lieu_phan p on p.id = tc.phan_id
              where p.cha_id = v_buoi and p.id <> p_phan and tc.ma_cau = any (coalesce(p_ma_bai, '{}'))) then
    raise exception 'Có bài đã dùng ở mô hình khác trong cùng phần.' using errcode = 'P0001';
  end if;
  delete from tai_lieu_cau where phan_id = p_phan;
  insert into tai_lieu_cau (phan_id, ma_cau, thu_tu) select p_phan, m, (o - 1)::int from unnest(coalesce(p_ma_bai, '{}')) with ordinality as x(m, o);
  update tai_lieu set updated_at = now() where id = v_tl;
end $function$;


-- ── Đặt bài BTVN (về nhà) của 1 mô hình trong 1 buổi ──
create or replace function public.fn_tl_hl_dat_btvn(p_tai_lieu uuid, p_buoi uuid, p_mo_hinh uuid, p_ma_bai text[])
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare v_p uuid;
begin
  perform _tl_hl_kiem(p_tai_lieu, p_buoi);
  if not exists (select 1 from tai_lieu_phan p where p.cha_id = p_buoi and p.loai_phan = 'hl_mo_hinh' and p.ref_ma = p_mo_hinh::text) then
    raise exception 'Mô hình này không có trong buổi.' using errcode = 'P0001';
  end if;
  select p.id into v_p from tai_lieu_phan p where p.cha_id = p_buoi and p.loai_phan = 'hl_btvn' and p.ref_ma = p_mo_hinh::text;
  if cardinality(coalesce(p_ma_bai, '{}')) = 0 then
    if v_p is not null then delete from tai_lieu_phan where id = v_p; end if;   -- bỏ hết bài ⇒ gỡ phần (câu đi theo cascade)
  else
    if v_p is null then
      insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id) values (p_tai_lieu, 0, 'hl_btvn', p_mo_hinh::text, p_buoi)
      returning id into v_p;
    end if;
    perform fn_tl_hl_dat_bai(v_p, p_ma_bai);   -- cùng kiểm (lặp, có trong kho, không trùng phần khác cùng buổi) + ghi
  end if;
  perform _tl_hl_xep(p_tai_lieu);
  update tai_lieu set updated_at = now() where id = p_tai_lieu;
end $function$;
revoke execute on function public.fn_tl_hl_dat_btvn(uuid, uuid, uuid, text[]) from public, anon;
grant execute on function public.fn_tl_hl_dat_btvn(uuid, uuid, uuid, text[]) to authenticated;

CREATE OR REPLACE FUNCTION public.fn_tl_hl_dat_mo_hinh(p_tai_lieu uuid, p_buoi uuid, p_mo_hinh uuid[])
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_mh uuid; v_o int; v_pm uuid;
begin
  perform _tl_hl_kiem(p_tai_lieu, p_buoi);
  if cardinality(coalesce(p_mo_hinh, '{}')) <> (select count(distinct x) from unnest(coalesce(p_mo_hinh, '{}')) x) then
    raise exception 'Một mô hình bị chọn 2 lần.' using errcode = 'P0001';
  end if;
  if exists (select 1 from unnest(coalesce(p_mo_hinh, '{}')) x where not exists (select 1 from hinh_mo_hinh m where m.id = x and m.phan = 'luyen')) then
    raise exception 'Có mô hình không thuộc Hình–Luyện.' using errcode = 'P0001';
  end if;
  delete from tai_lieu_phan p where p.cha_id = p_buoi and p.loai_phan in ('hl_mo_hinh', 'hl_btvn')   -- bỏ mô hình ⇒ bỏ cả BTVN của nó
     and not (p.ref_ma = any (array(select x::text from unnest(coalesce(p_mo_hinh, '{}')) x)));
  for v_mh, v_o in select x, o from unnest(coalesce(p_mo_hinh, '{}')) with ordinality as t(x, o) loop
    select p.id into v_pm from tai_lieu_phan p where p.cha_id = p_buoi and p.loai_phan = 'hl_mo_hinh' and p.ref_ma = v_mh::text;
    if v_pm is null then
      insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id) values (p_tai_lieu, v_o, 'hl_mo_hinh', v_mh::text, p_buoi)
      returning id into v_pm;
      -- CHỈ chuyên đề đổ sẵn mọi bài kho của mô hình (chuyên đề = trọn mô hình). Giáo trình: mô hình mới để TRỐNG,
      -- người soạn bấm "✎ Chọn bài" chọn từng bài (Thùy 08/11).
      if (select t.loai from tai_lieu t where t.id = p_tai_lieu) = 'chuyen_de' then
        insert into tai_lieu_cau (phan_id, ma_cau, thu_tu)
        select v_pm, m, (o - 1)::int from unnest(_tl_hl_bai_mac_dinh(v_mh)) with ordinality as x(m, o);
      end if;
    else
      update tai_lieu_phan set thu_tu = v_o where id = v_pm;
    end if;
    v_pm := null;
  end loop;
  update tai_lieu_phan set thu_tu = 2147483000 where cha_id = p_buoi and loai_phan = 'hl_khac';   -- khối bài chưa có mô hình luôn cuối phần
  perform _tl_hl_xep(p_tai_lieu);
  update tai_lieu set updated_at = now() where id = p_tai_lieu;   -- đổi nội dung con ⇒ bump cha (CLAUDE.md §2)
  return fn_tl_hl_noi_dung(p_tai_lieu, p_buoi);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_tl_hl_noi_dung(p_tai_lieu uuid, p_buoi uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with bai_json as (
    select tc.phan_id, jsonb_agg(jsonb_build_object(
      'ma_bai', tc.ma_cau, 'id', hb.id, 'de_bai', hb.de_bai, 'gia_thiet_chung', hb.gia_thiet_chung, 'anh_de', hb.anh_de,
      'con_trong_kho', hb.id is not null, 'loai_cau', hb.loai_cau,
      'y', (select coalesce(jsonb_agg(jsonb_build_object('nhan', y.nhan_hien_thi, 'noi_dung', y.noi_dung, 'dap_an', y.dap_an,
              'loi_giai', y.loi_giai, 'anh_de', y.anh_de, 'anh_loi_giai', y.anh_loi_giai, 'gia_thiet_them', y.gia_thiet_them) order by y.thu_tu), '[]'::jsonb)
              from hinh_y y where y.bai_id = hb.id)
    ) order by tc.thu_tu) as bai
      from tai_lieu_cau tc
      join tai_lieu_phan p on p.id = tc.phan_id and p.tai_lieu_id = p_tai_lieu and p.loai_phan in ('hl_mo_hinh', 'hl_khac', 'hl_btvn')
      left join hinh_bai hb on hb.ma_bai = tc.ma_cau
     group by tc.phan_id
  ),
  cau_json as (
    select tc.phan_id, jsonb_agg(jsonb_build_object('ma_cau', tc.ma_cau, 'noi_dung', coalesce(q.noi_dung, l.noi_dung), 'anh_de', coalesce(q.anh_de, l.anh_de),
                                                    'loai_cau', coalesce(q.loai_cau, l.loai_cau), 'kho_lop', l.ma_cau is not null,
                                                    'con_trong_kho', (q.ma_cau is not null and q.xoa_at is null) or (l.ma_cau is not null and l.xoa_at is null)) order by tc.thu_tu) as caus
      from tai_lieu_cau tc
      join tai_lieu_phan p on p.id = tc.phan_id and p.tai_lieu_id = p_tai_lieu and p.loai_phan in ('dang', 'btvn')
      left join hinh_hoc_cau_hoi q on q.ma_cau = tc.ma_cau
      left join hinh_hoc_cau_lop l on l.ma_cau = tc.ma_cau   -- kho trên lớp (mig 202611051603)
     group by tc.phan_id
  )
  select jsonb_build_object(
    'tai_lieu', (select jsonb_build_object('id', t.id, 'ten', t.ten, 'khoi', t.khoi, 'mon', t.mon, 'nhanh', t.nhanh, 'loai', t.loai,
                                           'ban_do', t.ban_do, 'cau_hinh', t.cau_hinh, 'updated_at', t.updated_at)
                   from tai_lieu t where t.id = p_tai_lieu and la_thanh_vien()),
    'buoi', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'tieu_de', b.tieu_de, 'thu_tu', b.thu_tu,
        'hoc', coalesce((
          select jsonb_agg(jsonb_build_object(
            'phan_id', pd.id, 'ma_bai', pd.ref_ma, 'ten', hb.ten_bai, 'hien_lt', pd.hien_lt, 'con_trong_kho', hb.ma_bai is not null,
            'co_ly_thuyet', exists (select 1 from hinh_hoc_bai_ly_thuyet l where l.ma_bai = pd.ref_ma and (btrim(l.noi_dung) <> '' or l.file_url is not null)),
            'caus', coalesce(cl.caus, '[]'::jsonb),
            'btvn', (select jsonb_build_object('phan_id', pb.id, 'caus', coalesce(cb.caus, '[]'::jsonb))
                       from tai_lieu_phan pb left join cau_json cb on cb.phan_id = pb.id
                      where pb.cha_id = b.id and pb.loai_phan = 'btvn' and pb.ref_ma = pd.ref_ma order by pb.thu_tu limit 1)
          ) order by pd.thu_tu, pd.id)
            from tai_lieu_phan pd left join hinh_hoc_bai hb on hb.ma_bai = pd.ref_ma left join cau_json cl on cl.phan_id = pd.id
           where pd.cha_id = b.id and pd.loai_phan = 'dang'), '[]'::jsonb),
        'mo_hinh', coalesce((
          select jsonb_agg(jsonb_build_object(
            'phan_id', pm.id, 'id', mh.id, 'ma', mh.ma, 'ten', mh.ten, 'gia_thiet', mh.gia_thiet, 'anh', mh.anh_cau_hinh,
            'con_tren_ban_do', mh.id is not null, 'bai', coalesce(bj.bai, '[]'::jsonb)) order by pm.thu_tu, pm.id)
            from tai_lieu_phan pm left join hinh_mo_hinh mh on mh.id::text = pm.ref_ma left join bai_json bj on bj.phan_id = pm.id
           where pm.cha_id = b.id and pm.loai_phan = 'hl_mo_hinh'), '[]'::jsonb),
        'khac', (select jsonb_build_object('phan_id', pk.id, 'bai', coalesce(bj.bai, '[]'::jsonb))
                   from tai_lieu_phan pk left join bai_json bj on bj.phan_id = pk.id
                  where pk.cha_id = b.id and pk.loai_phan = 'hl_khac' order by pk.thu_tu limit 1),
        'btvn_luyen', coalesce((
          select jsonb_agg(jsonb_build_object('phan_id', pv.id, 'mo_hinh_id', pv.ref_ma, 'ma', mh.ma, 'ten', mh.ten,
                                              'bai', coalesce(bj.bai, '[]'::jsonb)) order by pv.thu_tu, pv.id)
            from tai_lieu_phan pv left join hinh_mo_hinh mh on mh.id::text = pv.ref_ma left join bai_json bj on bj.phan_id = pv.id
           where pv.cha_id = b.id and pv.loai_phan = 'hl_btvn'), '[]'::jsonb)
      ) order by b.thu_tu, b.id)
        from tai_lieu_phan b
       where b.tai_lieu_id = p_tai_lieu and b.loai_phan = 'buoi' and (p_buoi is null or b.id = p_buoi) and la_thanh_vien()), '[]'::jsonb))
$function$;

CREATE OR REPLACE FUNCTION public.fn_tl_hinh_trich_buoi(p_master uuid, p_buoi uuid, p_den uuid, p_loai text, p_tieu_de text, p_on_tap jsonb DEFAULT '[]'::jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_mk uuid; v_tt int := 0; c record; v_c uuid;
begin
  if not la_thanh_vien() then raise exception 'Chỉ nhân sự mới gán được giáo trình.' using errcode = '42501'; end if;
  if p_loai not in ('gt', 'btvn') then raise exception 'p_loai phải là gt hoặc btvn.'; end if;
  if not exists (select 1 from tai_lieu t where t.id = p_master and t.ban_do = 'moi' and t.nhanh = 'hinh' and t.loai = 'giao_trinh') then
    raise exception 'Giáo trình gốc không phải giáo trình Hình bản đồ mới.' using errcode = 'P0001';
  end if;
  if not exists (select 1 from tai_lieu_phan p where p.id = p_buoi and p.tai_lieu_id = p_master and p.loai_phan = 'buoi') then
    raise exception 'Không thấy buổi này trong giáo trình gốc.' using errcode = 'P0001';
  end if;
  perform 1 from tai_lieu t where t.id = p_den and t.nguon_id = p_master and t.nguon_buoi = p_buoi::text and t.ban_do = 'moi' and t.nhanh = 'hinh'
    and t.loai = case p_loai when 'gt' then 'giao_trinh_buoi' else 'btvn' end for update;
  if not found then raise exception 'Tài liệu đích không khớp giáo trình gốc / buổi / loại.' using errcode = 'P0001'; end if;
  if exists (select 1 from tai_lieu_phan p where p.tai_lieu_id = p_den) then
    raise exception 'Tài liệu đích đã có nội dung — tạo tài liệu mới rồi chép.' using errcode = 'P0001';
  end if;
  if p_loai = 'btvn' and not exists (select 1 from tai_lieu_phan x join tai_lieu_cau tc on tc.phan_id = x.id
                                      where x.cha_id = p_buoi and x.loai_phan in ('btvn', 'hl_btvn')) then
    raise exception 'Buổi này chưa có BTVN — chọn câu BTVN (bài học) hoặc bài BTVN (mô hình Luyện) trong giáo trình trước.' using errcode = 'P0001';
  end if;
  insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values (p_den, v_tt, 'buoi', p_tieu_de) returning id into v_mk;
  for c in select x.* from tai_lieu_phan x where x.cha_id = p_buoi
             and x.loai_phan = any (case p_loai when 'gt' then array['dang', 'hl_mo_hinh', 'hl_khac'] else array['btvn', 'hl_btvn'] end)
             and (x.loai_phan not in ('btvn', 'hl_btvn') or exists (select 1 from tai_lieu_cau tc where tc.phan_id = x.id))
           order by x.thu_tu, x.id loop
    v_tt := v_tt + 1;
    insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id, hien_lt, hien_vi_du, kieu)
    values (p_den, v_tt, c.loai_phan, c.ref_ma, v_mk, c.hien_lt, c.hien_vi_du, c.kieu) returning id into v_c;
    insert into tai_lieu_cau (phan_id, ma_cau, thu_tu) select v_c, tc.ma_cau, tc.thu_tu from tai_lieu_cau tc where tc.phan_id = c.id;
  end loop;
  update tai_lieu set updated_at = now() where id = p_den;
end $function$;
