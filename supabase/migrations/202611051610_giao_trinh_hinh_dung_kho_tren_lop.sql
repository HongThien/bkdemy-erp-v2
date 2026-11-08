-- ============================================================================
-- 202611051610 — giao_trinh_hinh_dung_kho_tren_lop
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Kho trên lớp Hình–Học (mig 202611051603) chỉ có ích khi builder giáo trình chọn được câu từ đó — như Đại (Thùy 22/10 "giáo viên
--   phải được chọn nguồn từ cả 2 kho"). 3 chỗ:
--   · fn_tl_hh_dat_cau: nhận câu HHL của ĐÚNG bài học đó (trước chỉ nhận hinh_hoc_cau_hoi ⇒ câu kho trên lớp bị chặn).
--   · fn_tl_hl_noi_dung: nội dung câu của phần bài học lấy từ kho luyện HOẶC kho trên lớp (trước chỉ join kho luyện ⇒ câu HHL hiện rỗng).
--   · fn_hh_lop_cua_bai (mới tạo ở 202611051603, chưa ai dùng): trả thêm noi_dung/anh_de để popup chọn câu hiện đề.
--   Thân 2 hàm cũ sinh NGUYÊN từ pg_get_functiondef, chỉ thay đúng đoạn (scratchpad gen_gt_hinh_lop.mjs).
--   ET (bài ĐO) không đụng: popup chọn câu của ET vẫn chỉ kho luyện — kho trên lớp không đo, không vào mastery.
--
-- MẤT GÌ (Luật xoá): Không mất gì — nới điều kiện nhận câu + thêm cột trả về.
-- ============================================================================

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
      join tai_lieu_phan p on p.id = tc.phan_id and p.tai_lieu_id = p_tai_lieu and p.loai_phan in ('hl_mo_hinh', 'hl_khac')
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
                  where pk.cha_id = b.id and pk.loai_phan = 'hl_khac' order by pk.thu_tu limit 1)
      ) order by b.thu_tu, b.id)
        from tai_lieu_phan b
       where b.tai_lieu_id = p_tai_lieu and b.loai_phan = 'buoi' and (p_buoi is null or b.id = p_buoi) and la_thanh_vien()), '[]'::jsonb))
$function$;

CREATE OR REPLACE FUNCTION public.fn_tl_hh_dat_cau(p_phan uuid, p_ma_caus text[])
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_tl uuid; v_buoi uuid; v_bai text; v_x text[];
begin
  select p.tai_lieu_id, p.cha_id, p.ref_ma into v_tl, v_buoi, v_bai from tai_lieu_phan p where p.id = p_phan and p.loai_phan in ('dang', 'btvn');
  if v_tl is null then raise exception 'Phần này không nhận câu bài học Hình.' using errcode = 'P0001'; end if;
  perform _tl_hl_kiem(v_tl, v_buoi);
  if cardinality(coalesce(p_ma_caus, '{}')) <> (select count(distinct x) from unnest(coalesce(p_ma_caus, '{}')) x) then
    raise exception 'Danh sách có câu lặp.' using errcode = 'P0001';
  end if;
  v_x := array(select x from unnest(coalesce(p_ma_caus, '{}')) x
                where not exists (select 1 from hinh_hoc_cau_hoi q where q.ma_cau = x and q.dang_chinh = v_bai and q.xoa_at is null)
                  and not exists (select 1 from hinh_hoc_cau_lop l where l.ma_cau = x and l.dang_bai_id = v_bai and l.xoa_at is null));
  if cardinality(v_x) > 0 then raise exception 'Câu không thuộc bài học %: %', v_bai, array_to_string(v_x, ', ') using errcode = 'P0001'; end if;
  v_x := array(select x from unnest(coalesce(p_ma_caus, '{}')) x where x = any (_tl_hh_cau_cua_buoi(v_buoi, p_phan)));
  if cardinality(v_x) > 0 then raise exception 'Câu đã dùng ở phần khác trong cùng buổi: %', array_to_string(v_x, ', ') using errcode = 'P0001'; end if;
  delete from tai_lieu_cau where phan_id = p_phan;
  insert into tai_lieu_cau (phan_id, ma_cau, thu_tu) select p_phan, m, (o - 1)::int from unnest(coalesce(p_ma_caus, '{}')) with ordinality as x(m, o);
  update tai_lieu set updated_at = now() where id = v_tl;
end $function$;

create or replace function fn_hh_lop_cua_bai(p_ma_bai text) returns jsonb
language sql stable as $$
  with v as materialized (
    select c.ma_cau, c.dang_bai_id, c.vai, c.loai_cau, c.thu_tu, c.noi_dung, c.anh_de
      from hinh_hoc_cau_lop c where c.dang_bai_id = p_ma_bai and c.xoa_at is null
  ),
  u as materialized (select * from _tl_bdm_so_lan_dung(array(select v.ma_cau from v)))
  select coalesce(jsonb_agg(jsonb_build_object(
           'ma_cau', v.ma_cau, 'dang_bai_id', v.dang_bai_id, 'vai', v.vai, 'loai_cau', v.loai_cau, 'noi_dung', v.noi_dung, 'anh_de', v.anh_de,
           'so_lan_dung', coalesce(u.n, 0))
         order by v.vai, v.thu_tu), '[]'::jsonb)
    from v left join u on u.ma_cau = v.ma_cau
$$;
