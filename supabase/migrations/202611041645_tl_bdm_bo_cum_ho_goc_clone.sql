-- ============================================================================
-- 202611041645_tl_bdm_bo_cum_ho_goc_clone
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 04/11 "làm gì còn khái niệm cụm nữa?". Bản đồ mới chỉ còn nhóm bài → dạng bài (cụm cũ đã thành dạng bài; view
--   bdm_cum_bai bỏ 29/10), nhưng _tl_bdm_cau_vi_tri vẫn trả cột cum = mã CỤM CŨ (Toán cg.ma_cum_cu · HGT h.ma_cum · KHTN c.ma_cum)
--   ⇒ fn_tl_bdm_goi_y "rải cụm", fn_tl_bdm_et_ma_de "ưu tiên cùng cụm" còn ăn theo cụm cũ.
-- SỬA: cột cum của _tl_bdm_cau_vi_tri (cả 2 bản Toán · KHTN) = HỌ gốc–clone coalesce(parent_ma_cau, ma_cau) — giữ TÊN cột để không
--   phải drop/dựng lại hàm. Kéo theo: gợi ý câu rải theo họ gốc–clone (không lấy gốc + clone của nó cùng lúc); et_ma_de bỏ bậc
--   "cùng cụm" (đã có "cùng gốc"). Thân hàm lấy NGUYÊN từ bản đang chạy, thay đúng chỗ. _bdm_cau_giai (mastery) không đụng.
-- MẤT GÌ (Luật xoá): Không. Chỉ thay thân 3 hàm; tài liệu đã lưu không đổi.
-- ============================================================================

CREATE OR REPLACE FUNCTION public._tl_bdm_cau_vi_tri(p_khoi text)
 RETURNS TABLE(ma_cau text, la_goc boolean, cum text, loai_cau text, dang_bai_id text, nhom_id text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if not la_thanh_vien() then raise exception 'Chỉ nhân sự mới đọc được kho.' using errcode = '42501'; end if;
  return query
  with cg as materialized (
    select * from _bdm_cau_giai(array(
      select b.ma_dang from dai_ban_do b where b.khoi = p_khoi
      union
      select unnest(_bdm_dang_cu_cua_khoi(p_khoi))))
  ),
  mot_nhom as (
    select d.ma_dang_cu, min(d.dich_nhom) as nhom
      from dai_bdm_doi_ung d
     group by d.ma_dang_cu
    having count(*) = 1 and count(d.dich_nhom) = 1
  )
  select c.ma_cau, c.parent_ma_cau is null, coalesce(c.parent_ma_cau, c.ma_cau)   /* cột cum = HỌ gốc–clone (bản đồ mới không còn cụm, Thùy 04/11) */, c.loai_cau,
         cg.dang_bai_id, coalesce(db.nhom_id, mn.nhom)
    from cg
    join dai_cau_hoi c on c.ma_cau = cg.ma_cau
    left join dai_bdm_dang_bai db on db.id = cg.dang_bai_id
    left join mot_nhom mn on mn.ma_dang_cu = cg.ma_dang_cu and cg.dang_bai_id is null
   where c.kho_chuan and c.xoa_at is null
  union all
  -- HGT: chỉ câu ĐÃ GÁN dạng bài (hgt_bdm_gan_cau), dạng bài thuộc chủ đề của khối này
  select h.ma_cau, h.parent_ma_cau is null, coalesce(h.parent_ma_cau, h.ma_cau), h.loai_cau, g.dang_bai_id, db.nhom_id
    from hgt_bdm_gan_cau g
    join hgt_cau_hoi h on h.ma_cau = g.ma_cau
    join dai_bdm_dang_bai db on db.id = g.dang_bai_id
    join dai_bdm_nhom n on n.id = db.nhom_id
    join dai_bdm_chu_de cd on cd.id = n.chu_de_id
   where cd.khoi = p_khoi and h.kho_chuan and h.xoa_at is null;
end $function$;

CREATE OR REPLACE FUNCTION public._tl_bdm_cau_vi_tri(p_khoi text, p_mon text)
 RETURNS TABLE(ma_cau text, la_goc boolean, cum text, loai_cau text, dang_bai_id text, nhom_id text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
#variable_conflict use_column
begin
  if not la_thanh_vien() then raise exception 'Chỉ nhân sự mới đọc được kho.' using errcode = '42501'; end if;
  if p_mon = 'Toán' then
    return query select * from _tl_bdm_cau_vi_tri(p_khoi);
    return;
  end if;
  if p_mon = 'KHTN' then
    return query
    with nh as materialized (
      select n.id, n.ma_cu from khtn_bdm_nhom n join khtn_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = p_khoi
    ),
    mot_nhom as (   -- câu chưa phân ⇒ nhóm qua dạng cũ, chỉ khi dạng cũ ứng ĐÚNG 1 nhóm (như Toán)
      select nh.ma_cu, min(nh.id) as nhom from nh where nh.ma_cu is not null group by nh.ma_cu having count(*) = 1
    )
    select c.ma_cau, c.parent_ma_cau is null, coalesce(c.parent_ma_cau, c.ma_cau), c.loai_cau, g.dang_bai_id, db.nhom_id
      from khtn_bdm_gan_cau g
      join khtn_bdm_dang_bai db on db.id = g.dang_bai_id
      join nh on nh.id = db.nhom_id
      join khtn_cau_hoi c on c.ma_cau = g.ma_cau
     where c.kho_chuan and c.xoa_at is null and c.loai_cau <> 'dung_sai'
    union all
    select c.ma_cau, c.parent_ma_cau is null, coalesce(c.parent_ma_cau, c.ma_cau), c.loai_cau, null::text, mn.nhom
      from khtn_cau_hoi c
      join mot_nhom mn on mn.ma_cu = c.dang_chinh
     where c.kho_chuan and c.xoa_at is null and c.loai_cau <> 'dung_sai'
       and not exists (select 1 from khtn_bdm_gan_cau g where g.ma_cau = c.ma_cau);
    return;
  end if;
  raise exception 'Môn % chưa có bản đồ mới cho giáo trình / ET.', p_mon using errcode = 'P0001';
end $function$;

CREATE OR REPLACE FUNCTION public.fn_tl_bdm_et_ma_de(p_khoi text, p_base jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$   -- volatile: dùng bảng tạm (đọc vị trí câu 1 lần), không ghi gì lâu dài
declare
  b record;
  v_loai text; v_goc text; v_cands text[]; v_picks text[]; v_fresh text; v_dup text;
  v_used text[] := array(select e->>'ma_cau' from jsonb_array_elements(p_base) e);   -- đề 2/3 khác MỌI câu gốc khi còn đủ câu
  v_made jsonb := '{}'; v_form jsonb := '{}';
begin
  create temp table if not exists _et_vt3 (ma_cau text, cum text, dang_bai_id text, la_goc boolean, loai_cau text, goc text) on commit drop;   -- tên mới: thêm loai_cau (bảng tạm cũ cùng phiên có khuôn khác)
  truncate _et_vt3;
  -- chỉ tính vị trí câu của MÔN có dạng bài trong đề (Toán · KHTN — registry tl_bdm_dang_bai_v)
  insert into _et_vt3 select x.ma_cau, x.cum, x.dang_bai_id, x.la_goc, x.loai_cau
    from (select distinct v.mon from tl_bdm_dang_bai_v v where v.id in (select e->>'dang_bai' from jsonb_array_elements(p_base) e)) m
    cross join lateral _tl_bdm_cau_vi_tri(p_khoi, m.mon) x
   where x.dang_bai_id in (select e->>'dang_bai' from jsonb_array_elements(p_base) e);
  -- Hình học: dạng bài = bài học (mã HH…), cả bài là 1 "cụm" (không còn cụm Hình học)
  insert into _et_vt3 select h.ma_cau, h.dang_chinh, h.dang_chinh, h.parent_ma_cau is null, h.loai_cau
    from hinh_hoc_cau_hoi h
   where h.dang_chinh in (select e->>'dang_bai' from jsonb_array_elements(p_base) e)
     and h.ma_cau in (select x.ma_cau from _tl_hh_cau_chuan(h.dang_chinh) x);
  update _et_vt3 v set goc = coalesce(k.parent_ma_cau, k.ma_cau) from (
    select ma_cau, parent_ma_cau from dai_cau_hoi where ma_cau in (select ma_cau from _et_vt3) union all
    select ma_cau, parent_ma_cau from hgt_cau_hoi where ma_cau in (select ma_cau from _et_vt3) union all
    select ma_cau, parent_ma_cau from hinh_hoc_cau_hoi where ma_cau in (select ma_cau from _et_vt3) union all
    select ma_cau, parent_ma_cau from khtn_cau_hoi where ma_cau in (select ma_cau from _et_vt3)) k
   where k.ma_cau = v.ma_cau;
  for b in select e->>'ma_cau' as ma, e->>'dang_bai' as db, coalesce(e->>'form', 'tra_loi_ngan') as form, o
             from jsonb_array_elements(p_base) with ordinality as t(e, o) order by o loop
    select v.loai_cau into v_loai from _et_vt3 v where v.ma_cau = b.ma;
    -- gốc của câu đề 1 (câu gốc ⇒ chính nó; câu clone ⇒ parent) — đọc thẳng kho, kể cả khi câu đề 1 không còn kho chuẩn
    v_goc := coalesce((select coalesce(x.parent_ma_cau, x.ma_cau) from (
               select ma_cau, parent_ma_cau from dai_cau_hoi where ma_cau = b.ma union all
               select ma_cau, parent_ma_cau from hgt_cau_hoi where ma_cau = b.ma union all
               select ma_cau, parent_ma_cau from hinh_hoc_cau_hoi where ma_cau = b.ma union all
               select ma_cau, parent_ma_cau from khtn_cau_hoi where ma_cau = b.ma) x limit 1), b.ma);
    -- ⭐⭐ Thùy 04/11 "nếu có câu clone thì phải chọn câu clone": ưu tiên SỐ 1 = câu cùng GỐC (clone của câu đề 1, hoặc gốc + clone
    --   anh em khi câu đề 1 là clone), rồi cùng loại câu → câu gốc khác cùng dạng bài. Thùy 04/11 "làm gì còn khái niệm cụm nữa?" ⇒ bỏ bậc cụm.
    -- ⭐ Thùy 04/11 "đề 2 3 bị giống đề 1": ứng viên = cùng DẠNG BÀI + in được cùng form; cùng cụm / cùng loại câu chỉ là ƯU TIÊN.
    --   Trước: lọc cứng cùng cụm ⇒ câu không cụm (câu nhập từ đề thi: cụm = chính nó) chỉ có chính nó ⇒ 52% câu ET bản đồ mới đề 2/3 = đề 1,
    --   dù dạng bài còn 2–84 câu. Dạng bài là đơn vị đo (KP) của bản đồ mới ⇒ câu cùng dạng bài là biến thể hợp lệ.
    -- (cũ) ứng viên = cùng dạng bài + cùng cụm + in được cùng form (TN: có phương án / mệnh đề / form TN đã duyệt; form khác: không phải Đ/S)
    v_cands := array(
      select v.ma_cau from _et_vt3 v
        join lateral (
          select to_jsonb(c.lua_chon) lc, to_jsonb(c.menh_de) md, exists (select 1 from dai_cau_form_tn f where f.ma_cau = c.ma_cau and f.da_duyet) tn
            from dai_cau_hoi c where c.ma_cau = v.ma_cau
          union all
          select to_jsonb(c.lua_chon), to_jsonb(c.menh_de), exists (select 1 from hgt_cau_form_tn f where f.ma_cau = c.ma_cau and f.da_duyet)
            from hgt_cau_hoi c where c.ma_cau = v.ma_cau
          union all
          select to_jsonb(c.lua_chon), to_jsonb(c.menh_de), exists (select 1 from hinh_hoc_cau_form_tn f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)
            from hinh_hoc_cau_hoi c where c.ma_cau = v.ma_cau
          union all
          select to_jsonb(c.lua_chon), to_jsonb(c.menh_de), exists (select 1 from khtn_cau_form_tn f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)
            from khtn_cau_hoi c where c.ma_cau = v.ma_cau
        ) c on true
       where v.dang_bai_id = b.db
         and case when b.form = 'trac_nghiem'
                  then jsonb_array_length(coalesce(c.lc, '[]'::jsonb)) > 0 or jsonb_array_length(coalesce(c.md, '[]'::jsonb)) > 0 or c.tn
                  else jsonb_array_length(coalesce(c.md, '[]'::jsonb)) = 0 end
       order by (v.ma_cau = b.ma), (v.goc is distinct from v_goc), (v.loai_cau is distinct from v_loai), (not v.la_goc), v.ma_cau);
    v_picks := '{}';
    for i in 1..2 loop
      select x into v_fresh from unnest(v_cands) x where not (x = any (v_used)) limit 1;
      if v_fresh is not null then
        v_used := v_used || v_fresh; v_picks := v_picks || v_fresh;
        v_form := v_form || jsonb_build_object(v_fresh, b.form);
      else
        -- dạng bài hết câu chưa dùng (cùng form) ⇒ cho trùng TRONG dạng bài (khác đề 2 nếu được), rồi câu gốc — không nhảy dạng bài, không để trống
        v_dup := coalesce((select x from unnest(v_cands) x where not (x = any (v_picks)) limit 1), v_cands[1], b.ma);
        v_picks := v_picks || v_dup;
        v_form := v_form || jsonb_build_object(v_dup, b.form);
      end if;
    end loop;
    v_made := v_made || jsonb_build_object(b.ma, to_jsonb(v_picks));
  end loop;
  return jsonb_build_object('etMaDe', v_made, 'etFormByCau', v_form);
end $function$;
