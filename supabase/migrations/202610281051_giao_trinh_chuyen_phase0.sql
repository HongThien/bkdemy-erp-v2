-- ============================================================================
-- 202610281051 — giao_trinh_chuyen_phase0
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 28/10 — chuyển giáo trình CŨ (ban_do='cu') sang khuôn bản đồ mới
-- (spec-builder-ban-do-moi.md A4/B2, bước 5) và gắn tag "phase 0" để phân biệt với
-- giáo trình soạn trực tiếp bằng builder mới.
--   • tai_lieu.phase: NULL = giáo trình thường · 0 = bản chuyển từ giáo trình cũ (phase 0).
--   • fn_tl_bdm_chuyen_luu_tru(p_cu): chuyển THEO CÂU (câu → dạng bài/nhóm qua _bdm_cau_giai),
--     không bỏ câu nào (câu chưa ra nhóm ⇒ phần chua_khop), kiểm số câu trước = sau từng buổi.
--     Bản mới có luu_tru_tu = id cũ ⇒ chỉ xem (_tl_bdm_kiem_buoi chặn ghi). Bản cũ GIỮ NGUYÊN.
--   • Hàm không có quyền cho anon/authenticated: chỉ chạy từ script migrate/vận hành.
--
-- MẤT GÌ: không có (chỉ thêm 1 cột + 1 hàm; không đụng giáo trình cũ).
-- ============================================================================

alter table tai_lieu add column if not exists phase smallint;
comment on column tai_lieu.phase is 'NULL = thường · 0 = bản chuyển từ giáo trình cũ sang bản đồ mới (phase 0). KHÔNG phải khoá.';

create or replace function fn_tl_bdm_chuyen_luu_tru(p_cu uuid)
returns jsonb
language plpgsql
set search_path to 'public'
as $$
declare
  t tai_lieu%rowtype;
  v_moi uuid; v_t int := 0;
  b record; n record; d record;
  v_pb uuid; v_pn uuid; v_pd uuid;
  v_cau_cu int; v_cau_moi int; v_ck int;
  v_bao jsonb := '[]'::jsonb; v_loi text := '';
  v_tong_cu int := 0; v_tong_moi int := 0; v_tong_ck int := 0;
begin
  select * into t from tai_lieu where id = p_cu;
  if not found or t.loai <> 'giao_trinh' or t.ban_do <> 'cu' or t.mon <> 'Toán' or t.nhanh is not null then
    raise exception 'Chỉ chuyển giáo trình Toán nhánh Đại, bản đồ cũ.' using errcode = 'P0001';
  end if;
  if exists (select 1 from tai_lieu x where x.luu_tru_tu = p_cu) then
    raise exception 'Giáo trình này đã được chuyển rồi.' using errcode = 'P0001';
  end if;

  -- Câu của giáo trình cũ + vị trí trên bản đồ mới (không lọc kho_chuan: không bỏ câu nào).
  drop table if exists _cvt;
  create temp table _cvt on commit drop as
  with cs as (
    select distinct tc.ma_cau from tai_lieu_cau tc join tai_lieu_phan p on p.id = tc.phan_id where p.tai_lieu_id = p_cu
  ),
  dc as (select array_agg(distinct c.dang_chinh) as a from dai_cau_hoi c join cs on cs.ma_cau = c.ma_cau),
  cg as (select * from _bdm_cau_giai((select a from dc))),
  mot_nhom as (
    select du.ma_dang_cu, min(du.dich_nhom) as nhom
      from dai_bdm_doi_ung du group by du.ma_dang_cu
    having count(*) = 1 and count(du.dich_nhom) = 1
  )
  select cg.ma_cau, cg.dang_bai_id, coalesce(db.nhom_id, mn.nhom) as nhom
    from cg
    join cs on cs.ma_cau = cg.ma_cau
    left join dai_bdm_dang_bai db on db.id = cg.dang_bai_id
    left join mot_nhom mn on mn.ma_dang_cu = cg.ma_dang_cu and cg.dang_bai_id is null;

  -- Câu theo buổi, theo thứ tự cũ. loai 'l' = luyện (phần dang) · 'b' = BTVN.
  drop table if exists _srct;
  create temp table _srct on commit drop as
  select (select bb.id from tai_lieu_phan bb
           where bb.tai_lieu_id = p_cu and bb.loai_phan = 'buoi' and (bb.thu_tu, bb.id) <= (p.thu_tu, p.id)
           order by bb.thu_tu desc, bb.id desc limit 1) as buoi,
         case p.loai_phan when 'btvn' then 'b' else 'l' end as loai,
         row_number() over (order by p.thu_tu, p.id, tc.thu_tu, tc.id) as seq,
         tc.ma_cau, tc.diem, v.nhom, v.dang_bai_id
    from tai_lieu_phan p
    join tai_lieu_cau tc on tc.phan_id = p.id
    left join _cvt v on v.ma_cau = tc.ma_cau
   where p.tai_lieu_id = p_cu and p.loai_phan in ('dang', 'btvn');

  if exists (select 1 from _srct where buoi is null) then
    raise exception 'Có phần luyện/BTVN nằm ngoài mọi buổi — dừng, không đoán.' using errcode = 'P0001';
  end if;

  insert into tai_lieu (loai, ten, khoi, ma_chuyen_de, theme, cau_hinh, created_by, mon, nhanh, ban_do, luu_tru_tu, phase)
  values (t.loai, t.ten, t.khoi, t.ma_chuyen_de, t.theme, t.cau_hinh, t.created_by, t.mon, t.nhanh, 'moi', p_cu, 0)
  returning id into v_moi;

  for b in select * from tai_lieu_phan where tai_lieu_id = p_cu and loai_phan = 'buoi' order by thu_tu, id loop
    insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, tieu_de, noi_dung, kieu, hien_lt, hien_vi_du, diem_moi_cau, nang_cao)
    values (v_moi, v_t, 'buoi', b.ref_ma, b.tieu_de, b.noi_dung, b.kieu, b.hien_lt, b.hien_vi_du, b.diem_moi_cau, b.nang_cao)
    returning id into v_pb;
    v_t := v_t + 1;

    -- nhóm theo thứ tự xuất hiện đầu tiên (luyện trước, BTVN sau)
    for n in select s.nhom, min(s.seq + case when s.loai = 'b' then 100000000 else 0 end) as o
               from _srct s where s.buoi = b.id and s.nhom is not null group by s.nhom order by 2 loop
      insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id)
      values (v_moi, v_t, 'nhom', n.nhom, v_pb) returning id into v_pn;
      v_t := v_t + 1;

      for d in select s.dang_bai_id, min(s.seq) as o from _srct s
                where s.buoi = b.id and s.nhom = n.nhom and s.loai = 'l' and s.dang_bai_id is not null
                group by s.dang_bai_id order by 2 loop
        insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id)
        values (v_moi, v_t, 'dang_bai', d.dang_bai_id, v_pn) returning id into v_pd;
        v_t := v_t + 1;
        insert into tai_lieu_cau (phan_id, ma_cau, thu_tu, diem)
        select v_pd, s.ma_cau, (row_number() over (order by s.seq) - 1)::int, s.diem from _srct s
         where s.buoi = b.id and s.nhom = n.nhom and s.loai = 'l' and s.dang_bai_id = d.dang_bai_id;
      end loop;

      if exists (select 1 from _srct s where s.buoi = b.id and s.nhom = n.nhom and s.loai = 'l' and s.dang_bai_id is null) then
        insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id)
        values (v_moi, v_t, 'nhom_chua_phan', n.nhom, v_pn) returning id into v_pd;
        v_t := v_t + 1;
        insert into tai_lieu_cau (phan_id, ma_cau, thu_tu, diem)
        select v_pd, s.ma_cau, (row_number() over (order by s.seq) - 1)::int, s.diem from _srct s
         where s.buoi = b.id and s.nhom = n.nhom and s.loai = 'l' and s.dang_bai_id is null;
      end if;

      if exists (select 1 from _srct s where s.buoi = b.id and s.nhom = n.nhom and s.loai = 'b') then
        insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id)
        values (v_moi, v_t, 'btvn_nhom', n.nhom, v_pn) returning id into v_pd;
        v_t := v_t + 1;
        insert into tai_lieu_cau (phan_id, ma_cau, thu_tu, diem)
        select v_pd, s.ma_cau, (row_number() over (order by s.seq) - 1)::int, s.diem from _srct s
         where s.buoi = b.id and s.nhom = n.nhom and s.loai = 'b';
      end if;
    end loop;

    -- câu chưa ra được nhóm: giữ nguyên, không bỏ
    select count(*) into v_ck from _srct s where s.buoi = b.id and s.nhom is null;
    if v_ck > 0 then
      insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, cha_id, tieu_de)
      values (v_moi, v_t, 'chua_khop', v_pb, 'Chưa khớp bản đồ mới') returning id into v_pd;
      v_t := v_t + 1;
      insert into tai_lieu_cau (phan_id, ma_cau, thu_tu, diem)
      select v_pd, s.ma_cau, (row_number() over (order by s.loai desc, s.seq) - 1)::int, s.diem from _srct s
       where s.buoi = b.id and s.nhom is null;
    end if;

    -- kiểm: số câu buổi trước = sau
    select count(*) into v_cau_cu from _srct s where s.buoi = b.id;
    select count(*) into v_cau_moi from tai_lieu_cau tc join _tl_bdm_phan_cua_buoi(v_pb) p on p.id = tc.phan_id;
    if v_cau_cu <> v_cau_moi then
      v_loi := v_loi || format(' [%s: cũ %s ≠ mới %s]', coalesce(b.tieu_de, b.id::text), v_cau_cu, v_cau_moi);
    end if;
    v_tong_cu := v_tong_cu + v_cau_cu; v_tong_moi := v_tong_moi + v_cau_moi; v_tong_ck := v_tong_ck + v_ck;
    v_bao := v_bao || jsonb_build_object('buoi', b.tieu_de, 'cau_cu', v_cau_cu, 'cau_moi', v_cau_moi, 'chua_khop', v_ck);
  end loop;

  if v_loi <> '' then raise exception 'Số câu lệch:%', v_loi using errcode = 'P0001'; end if;

  return jsonb_build_object('moi', v_moi, 'ten', t.ten, 'khoi', t.khoi, 'so_buoi', jsonb_array_length(v_bao),
                            'cau_cu', v_tong_cu, 'cau_moi', v_tong_moi, 'chua_khop', v_tong_ck, 'buoi', v_bao);
end $$;

revoke all on function fn_tl_bdm_chuyen_luu_tru(uuid) from public, anon, authenticated;
