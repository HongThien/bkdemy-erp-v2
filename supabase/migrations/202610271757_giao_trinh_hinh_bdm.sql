-- ============================================================================
-- 202610271757 — giao_trinh_hinh_bdm
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 27/10: "Luồng làm giáo trình đang mới chỉ có Đại. Còn cần Giải tích và Hình nữa. 3 loại cơ mà" + chọn "1 giáo trình
--   Hình chung": mỗi buổi có HỌC (bài học hinh_hoc_bai: lý thuyết + câu luyện + BTVN) và/hoặc LUYỆN (mô hình → bài trọn ý,
--   như chuyên đề Hình mig 202610211633). Hình giải tích không cần hàm mới (fn_tl_bdm_* đã đọc kho HGT — test _test_gt_hgt_bdm).
--   Tài liệu: tai_lieu nhanh='hinh', ban_do='moi' (giáo trình gốc + giáo trình buổi/BTVN của lớp). Cây phần dưới 1 buổi:
--     'dang'       ref_ma = hinh_hoc_bai.ma_bai · câu = hinh_hoc_cau_hoi (luyện trên lớp)   ← KHUÔN Y giáo trình Hình·Học cũ
--     'hl_mo_hinh' ref_ma = id mô hình luyện    · câu = hinh_bai.ma_bai (bài trọn ý)
--     'hl_khac'    bài chưa có mô hình
--     'btvn'       ref_ma = hinh_hoc_bai.ma_bai · câu = hinh_hoc_cau_hoi (về nhà)              ← KHUÔN Y giáo trình Hình·Học cũ
--   Giữ khuôn 'dang'/'btvn' cũ cho phần HỌC ⇒ mọi bên đọc tài liệu lớp (đánh giá, test online, chấm BTVN, PDF) chạy như giáo trình
--   Hình·Học cũ, không phải sửa; phần LUYỆN chỉ có ở bản in (như chuyên đề Hình). Thứ tự trong buổi: Học → Luyện → khác → BTVN.
--   Ôn tập (BTVN) chưa làm cho Hình — chưa có ứng viên theo bài học.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất dữ liệu. Thay thân _tl_hl_xep (thêm thứ tự theo loại phần — chuyên đề Hình chỉ có hl_mo_hinh/hl_khac nên thứ tự
--   cũ giữ nguyên) và fn_tl_hl_noi_dung (thêm khoá 'hoc'; khoá cũ giữ nguyên). Các hàm khác mới.
-- ============================================================================

-- ── Xếp: buổi → con theo LOẠI (Học · Luyện · khác · BTVN) rồi thu_tu ──
create or replace function _tl_hl_xep(p_tai_lieu uuid) returns void language sql as $$
  with k as (
    select p.id, row_number() over (order by coalesce(b.thu_tu, p.thu_tu), coalesce(b.id, p.id), (p.loai_phan <> 'buoi'),
                                             case p.loai_phan when 'dang' then 0 when 'hl_mo_hinh' then 1 when 'hl_khac' then 2 when 'btvn' then 3 else 4 end,
                                             p.thu_tu, p.id) - 1 as tt
      from tai_lieu_phan p left join tai_lieu_phan b on b.id = p.cha_id and b.loai_phan = 'buoi'
     where p.tai_lieu_id = p_tai_lieu
  )
  update tai_lieu_phan p set thu_tu = k.tt from k where p.id = k.id and p.thu_tu is distinct from k.tt::int
$$;

-- ── Câu HỌC dùng được của 1 bài học: còn sống + kho chuẩn (cùng luật _kho_cau_chuan với kho Đại) ──
create or replace function _tl_hh_cau_chuan(p_bai text) returns table (ma_cau text, la_goc boolean, thu_tu int)
language sql stable as $$
  select q.ma_cau, q.parent_ma_cau is null, q.thu_tu::int
    from hinh_hoc_cau_hoi q
   where q.dang_chinh = p_bai and q.xoa_at is null and q.kho_chuan
     and _kho_cau_chuan(q.da_duyet, q.kiem_may, q.created_at, q.giai_method)
$$;

-- ── Gợi ý N câu của 1 bài học: ít dùng nhất → câu gốc trước → thứ tự kho (né p_tru) ──
create or replace function _tl_hh_goi_y(p_bai text, p_n int, p_tru text[]) returns text[]
language sql stable security definer set search_path to 'public' as $$
  with v as materialized (select * from _tl_hh_cau_chuan(p_bai) x where not (x.ma_cau = any (coalesce(p_tru, '{}')))),
       t as materialized (select tc.ma_cau, count(*) n from tai_lieu_cau tc where tc.ma_cau in (select v.ma_cau from v) group by 1)
  select coalesce(array_agg(ma_cau order by r), '{}') from (
    select v.ma_cau, row_number() over (order by coalesce(t.n, 0), (not v.la_goc), v.thu_tu, v.ma_cau) r
      from v left join t on t.ma_cau = v.ma_cau
  ) s where r <= greatest(coalesce(p_n, 0), 0)
$$;

-- ── Mọi câu đang có trong 1 buổi (né trùng), trừ 1 phần ──
create or replace function _tl_hh_cau_cua_buoi(p_buoi uuid, p_tru_phan uuid default null) returns text[]
language sql stable as $$
  select coalesce(array_agg(distinct tc.ma_cau), '{}')
    from tai_lieu_phan p join tai_lieu_cau tc on tc.phan_id = p.id
   where p.cha_id = p_buoi and p.id is distinct from p_tru_phan
$$;

-- ── Bộ chọn bài học: bài học của khối theo chủ đề Hình, kèm số câu dùng được + có lý thuyết ──
create or replace function fn_tl_hh_cay_chon(p_khoi text) returns jsonb
language sql stable security definer set search_path to 'public' as $$
  select coalesce(jsonb_agg(jsonb_build_object(
           'ma_bai', b.ma_bai, 'ten', b.ten_bai, 'thu_tu', b.thu_tu, 'chu_de_id', b.chu_de_id, 'chu_de', cd.ten,
           'so_cau', (select count(*) from _tl_hh_cau_chuan(b.ma_bai)),
           'co_ly_thuyet', exists (select 1 from hinh_hoc_bai_ly_thuyet l where l.ma_bai = b.ma_bai and (btrim(l.noi_dung) <> '' or l.file_url is not null))
         ) order by cd.thu_tu nulls last, cd.id, b.thu_tu, b.ma_bai), '[]'::jsonb)
    from hinh_hoc_bai b left join dai_bdm_chu_de cd on cd.id = b.chu_de_id
   where b.khoi = p_khoi and la_thanh_vien()
$$;

-- ── Kho câu của 1 bài học (popup "✎ Chọn câu"): nội dung để chọn + số lần đã dùng ──
create or replace function fn_tl_hh_cau(p_bai text) returns jsonb
language sql stable security definer set search_path to 'public' as $$
  with v as materialized (select * from _tl_hh_cau_chuan(p_bai)),
       t as materialized (select tc.ma_cau, count(*) n from tai_lieu_cau tc where tc.ma_cau in (select v.ma_cau from v) group by 1)
  select coalesce(jsonb_agg(jsonb_build_object('ma_cau', q.ma_cau, 'noi_dung', q.noi_dung, 'anh_de', q.anh_de, 'loai_cau', q.loai_cau,
                                               'la_goc', v.la_goc, 'so_lan_dung', coalesce(t.n, 0))
                            order by v.thu_tu, q.ma_cau), '[]'::jsonb)
    from v join hinh_hoc_cau_hoi q on q.ma_cau = v.ma_cau left join t on t.ma_cau = v.ma_cau
   where la_thanh_vien()
$$;

-- ── Đặt tập BÀI HỌC của 1 buổi (thứ tự = mảng). Bài giữ lại ⇒ GIỮ câu đã chọn; bài mới ⇒ gợi ý luyện + BTVN ──
create or replace function fn_tl_hh_dat_bai(p_tai_lieu uuid, p_buoi uuid, p_bai text[], p_so_luyen int default 4, p_so_btvn int default 4)
returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare v_b text; v_o int; v_p uuid; v_l text[];
begin
  perform _tl_hl_kiem(p_tai_lieu, p_buoi);
  if cardinality(coalesce(p_bai, '{}')) <> (select count(distinct x) from unnest(coalesce(p_bai, '{}')) x) then
    raise exception 'Một bài học bị chọn 2 lần.' using errcode = 'P0001';
  end if;
  if exists (select 1 from unnest(coalesce(p_bai, '{}')) x where not exists (select 1 from hinh_hoc_bai b where b.ma_bai = x)) then
    raise exception 'Có mã không phải bài học Hình.' using errcode = 'P0001';
  end if;
  delete from tai_lieu_phan p where p.cha_id = p_buoi and p.loai_phan in ('dang', 'btvn') and not (p.ref_ma = any (coalesce(p_bai, '{}')));
  for v_b, v_o in select x, o from unnest(coalesce(p_bai, '{}')) with ordinality as t(x, o) loop
    select p.id into v_p from tai_lieu_phan p where p.cha_id = p_buoi and p.loai_phan = 'dang' and p.ref_ma = v_b;
    if v_p is null then
      insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id) values (p_tai_lieu, v_o, 'dang', v_b, p_buoi) returning id into v_p;
      v_l := _tl_hh_goi_y(v_b, p_so_luyen, _tl_hh_cau_cua_buoi(p_buoi));
      insert into tai_lieu_cau (phan_id, ma_cau, thu_tu) select v_p, m, (o - 1)::int from unnest(v_l) with ordinality as x(m, o);
    else
      update tai_lieu_phan set thu_tu = v_o where id = v_p;
    end if;
    v_p := null;
    select p.id into v_p from tai_lieu_phan p where p.cha_id = p_buoi and p.loai_phan = 'btvn' and p.ref_ma = v_b;
    if v_p is null then
      insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id) values (p_tai_lieu, v_o, 'btvn', v_b, p_buoi) returning id into v_p;
      v_l := _tl_hh_goi_y(v_b, p_so_btvn, _tl_hh_cau_cua_buoi(p_buoi));
      insert into tai_lieu_cau (phan_id, ma_cau, thu_tu) select v_p, m, (o - 1)::int from unnest(v_l) with ordinality as x(m, o);
    else
      update tai_lieu_phan set thu_tu = v_o where id = v_p;
    end if;
    v_p := null;
  end loop;
  perform _tl_hl_xep(p_tai_lieu);
  update tai_lieu set updated_at = now() where id = p_tai_lieu;   -- đổi nội dung con ⇒ bump cha (CLAUDE.md §2)
  return fn_tl_hl_noi_dung(p_tai_lieu, p_buoi);
end $$;

-- ── Đặt câu (theo thứ tự) của 1 phần HỌC ('dang' luyện / 'btvn' về nhà) ──
create or replace function fn_tl_hh_dat_cau(p_phan uuid, p_ma_caus text[]) returns void
language plpgsql security definer set search_path to 'public' as $$
declare v_tl uuid; v_buoi uuid; v_bai text; v_x text[];
begin
  select p.tai_lieu_id, p.cha_id, p.ref_ma into v_tl, v_buoi, v_bai from tai_lieu_phan p where p.id = p_phan and p.loai_phan in ('dang', 'btvn');
  if v_tl is null then raise exception 'Phần này không nhận câu bài học Hình.' using errcode = 'P0001'; end if;
  perform _tl_hl_kiem(v_tl, v_buoi);
  if cardinality(coalesce(p_ma_caus, '{}')) <> (select count(distinct x) from unnest(coalesce(p_ma_caus, '{}')) x) then
    raise exception 'Danh sách có câu lặp.' using errcode = 'P0001';
  end if;
  v_x := array(select x from unnest(coalesce(p_ma_caus, '{}')) x
                where not exists (select 1 from hinh_hoc_cau_hoi q where q.ma_cau = x and q.dang_chinh = v_bai and q.xoa_at is null));
  if cardinality(v_x) > 0 then raise exception 'Câu không thuộc bài học %: %', v_bai, array_to_string(v_x, ', ') using errcode = 'P0001'; end if;
  v_x := array(select x from unnest(coalesce(p_ma_caus, '{}')) x where x = any (_tl_hh_cau_cua_buoi(v_buoi, p_phan)));
  if cardinality(v_x) > 0 then raise exception 'Câu đã dùng ở phần khác trong cùng buổi: %', array_to_string(v_x, ', ') using errcode = 'P0001'; end if;
  delete from tai_lieu_cau where phan_id = p_phan;
  insert into tai_lieu_cau (phan_id, ma_cau, thu_tu) select p_phan, m, (o - 1)::int from unnest(coalesce(p_ma_caus, '{}')) with ordinality as x(m, o);
  update tai_lieu set updated_at = now() where id = v_tl;
end $$;

-- ── Gợi ý lại câu cho 1 phần HỌC (né mọi câu khác của buổi) — trả danh sách, builder gọi fn_tl_hh_dat_cau để ghi ──
create or replace function fn_tl_hh_goi_y(p_phan uuid, p_n int) returns text[]
language plpgsql stable security definer set search_path to 'public' as $$
declare v_buoi uuid; v_bai text;
begin
  if not la_thanh_vien() then raise exception 'Chỉ nhân sự mới soạn được tài liệu.' using errcode = '42501'; end if;
  select p.cha_id, p.ref_ma into v_buoi, v_bai from tai_lieu_phan p where p.id = p_phan and p.loai_phan in ('dang', 'btvn');
  if v_bai is null then raise exception 'Phần này không nhận câu bài học Hình.' using errcode = 'P0001'; end if;
  return _tl_hh_goi_y(v_bai, p_n, _tl_hh_cau_cua_buoi(v_buoi, p_phan));
end $$;

-- ── Nội dung (builder + in): thêm khoá 'hoc' cho mỗi buổi; mo_hinh / khac như cũ ──
create or replace function fn_tl_hl_noi_dung(p_tai_lieu uuid, p_buoi uuid default null) returns jsonb
language sql stable security definer set search_path to 'public' as $$
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
    select tc.phan_id, jsonb_agg(jsonb_build_object('ma_cau', tc.ma_cau, 'noi_dung', q.noi_dung, 'anh_de', q.anh_de, 'loai_cau', q.loai_cau,
                                                    'con_trong_kho', q.ma_cau is not null and q.xoa_at is null) order by tc.thu_tu) as caus
      from tai_lieu_cau tc
      join tai_lieu_phan p on p.id = tc.phan_id and p.tai_lieu_id = p_tai_lieu and p.loai_phan in ('dang', 'btvn')
      left join hinh_hoc_cau_hoi q on q.ma_cau = tc.ma_cau
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
$$;

-- ── GÁN LỚP: chép 1 buổi của giáo trình Hình gốc sang tài liệu lớp (gt: Học luyện + Luyện mô hình; btvn: BTVN Học) ──
create or replace function fn_tl_hinh_trich_buoi(p_master uuid, p_buoi uuid, p_den uuid, p_loai text, p_tieu_de text, p_on_tap jsonb default '[]'::jsonb)
returns void language plpgsql security definer set search_path to 'public' as $$
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
  insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values (p_den, v_tt, 'buoi', p_tieu_de) returning id into v_mk;
  for c in select x.* from tai_lieu_phan x where x.cha_id = p_buoi
             and x.loai_phan = any (case p_loai when 'gt' then array['dang', 'hl_mo_hinh', 'hl_khac'] else array['btvn'] end)
             and (x.loai_phan <> 'btvn' or exists (select 1 from tai_lieu_cau tc where tc.phan_id = x.id))
           order by x.thu_tu, x.id loop
    v_tt := v_tt + 1;
    insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id, hien_lt, hien_vi_du, kieu)
    values (p_den, v_tt, c.loai_phan, c.ref_ma, v_mk, c.hien_lt, c.hien_vi_du, c.kieu) returning id into v_c;
    insert into tai_lieu_cau (phan_id, ma_cau, thu_tu) select v_c, tc.ma_cau, tc.thu_tu from tai_lieu_cau tc where tc.phan_id = c.id;
  end loop;
  update tai_lieu set updated_at = now() where id = p_den;
end $$;

revoke execute on function _tl_hh_cau_chuan(text), _tl_hh_goi_y(text, int, text[]), _tl_hh_cau_cua_buoi(uuid, uuid),
  fn_tl_hh_cay_chon(text), fn_tl_hh_cau(text), fn_tl_hh_dat_bai(uuid, uuid, text[], int, int), fn_tl_hh_dat_cau(uuid, text[]),
  fn_tl_hh_goi_y(uuid, int), fn_tl_hinh_trich_buoi(uuid, uuid, uuid, text, text, jsonb) from public, anon;
grant execute on function _tl_hh_cau_chuan(text), _tl_hh_goi_y(text, int, text[]), _tl_hh_cau_cua_buoi(uuid, uuid),
  fn_tl_hh_cay_chon(text), fn_tl_hh_cau(text), fn_tl_hh_dat_bai(uuid, uuid, text[], int, int), fn_tl_hh_dat_cau(uuid, text[]),
  fn_tl_hh_goi_y(uuid, int), fn_tl_hinh_trich_buoi(uuid, uuid, uuid, text, text, jsonb) to authenticated;
