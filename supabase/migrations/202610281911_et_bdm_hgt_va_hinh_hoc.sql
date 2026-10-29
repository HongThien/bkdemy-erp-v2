-- ============================================================================
-- 202610281911 — et_bdm_hgt_va_hinh_hoc
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 28/10 "ET chưa làm được ET hình và lượng giác kìa". ET (bản đồ mới) chỉ đọc cây Đại. Màn ET giờ chọn dạng bài của
--   cả 3 nhánh trong 1 ET (Đại · Hình giải tích/lượng giác · Hình–Học = bài học, Thùy 28/10 bài học = dạng bài); mỗi câu nhớ
--   nhánh ở cau_hinh.nhanhByCau (khuôn MT) nên chấm/in/đo đọc đúng kho. DB cần:
--   ① fn_tl_bdm_et_ma_de: đề 2/3 trước chỉ tìm ứng viên ở dai_cau_hoi ⇒ câu HGT / Hình luôn ra 3 đề giống hệt. Nay ứng viên đọc
--      đúng bảng của câu (Đại · HGT · Hình học); câu Hình học: cùng bài học, không cụm (Thùy 28/10 bỏ cụm Hình học).
--   ② fn_tl_bdm_et_de_xuat: điền sẵn kế hoạch từ giáo trình buổi — thêm bài học của giáo trình Hình (phần 'dang', mig 202610271757).
--   ③ fn_tl_hh_goi_y_bai: gợi ý N câu ít dùng của 1 bài học (né p_tru) cho hàng ET Hình học.
--
-- MẤT GÌ (Luật xoá): Không mất gì — đổi thân 2 hàm đọc + thêm 1 hàm đọc.
-- ============================================================================

create or replace function fn_tl_bdm_et_ma_de(p_khoi text, p_base jsonb) returns jsonb
language plpgsql as $function$   -- volatile: dùng bảng tạm (đọc vị trí câu 1 lần), không ghi gì lâu dài
declare
  b record;
  v_cum text; v_cands text[]; v_picks text[]; v_fresh text; v_dup text;
  v_used text[] := array(select e->>'ma_cau' from jsonb_array_elements(p_base) e);   -- đề 2/3 khác MỌI câu gốc khi còn đủ câu
  v_made jsonb := '{}'; v_form jsonb := '{}';
begin
  create temp table if not exists _et_vt (ma_cau text, cum text, dang_bai_id text, la_goc boolean) on commit drop;
  truncate _et_vt;
  insert into _et_vt select x.ma_cau, x.cum, x.dang_bai_id, x.la_goc from _tl_bdm_cau_vi_tri(p_khoi) x
   where x.dang_bai_id in (select e->>'dang_bai' from jsonb_array_elements(p_base) e);
  -- Hình học: dạng bài = bài học (mã HH…), cả bài là 1 "cụm" (không còn cụm Hình học)
  insert into _et_vt select h.ma_cau, h.dang_chinh, h.dang_chinh, h.parent_ma_cau is null
    from hinh_hoc_cau_hoi h
   where h.dang_chinh in (select e->>'dang_bai' from jsonb_array_elements(p_base) e)
     and h.ma_cau in (select x.ma_cau from _tl_hh_cau_chuan(h.dang_chinh) x);
  for b in select e->>'ma_cau' as ma, e->>'dang_bai' as db, coalesce(e->>'form', 'tra_loi_ngan') as form, o
             from jsonb_array_elements(p_base) with ordinality as t(e, o) order by o loop
    select v.cum into v_cum from _et_vt v where v.ma_cau = b.ma;
    v_cum := coalesce(v_cum, b.ma);   -- câu gốc không còn trong kho chuẩn ⇒ cụm = chính nó
    -- ứng viên = cùng dạng bài + cùng cụm + in được cùng form (TN: có phương án / mệnh đề / form TN đã duyệt; form khác: không phải Đ/S)
    v_cands := array(
      select v.ma_cau from _et_vt v
        join lateral (
          select to_jsonb(c.lua_chon) lc, to_jsonb(c.menh_de) md, exists (select 1 from dai_cau_form_tn f where f.ma_cau = c.ma_cau and f.da_duyet) tn
            from dai_cau_hoi c where c.ma_cau = v.ma_cau
          union all
          select to_jsonb(c.lua_chon), to_jsonb(c.menh_de), exists (select 1 from hgt_cau_form_tn f where f.ma_cau = c.ma_cau and f.da_duyet)
            from hgt_cau_hoi c where c.ma_cau = v.ma_cau
          union all
          select to_jsonb(c.lua_chon), to_jsonb(c.menh_de), exists (select 1 from hinh_hoc_cau_form_tn f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)
            from hinh_hoc_cau_hoi c where c.ma_cau = v.ma_cau
        ) c on true
       where v.dang_bai_id = b.db and v.cum = v_cum
         and case when b.form = 'trac_nghiem'
                  then jsonb_array_length(coalesce(c.lc, '[]'::jsonb)) > 0 or jsonb_array_length(coalesce(c.md, '[]'::jsonb)) > 0 or c.tn
                  else jsonb_array_length(coalesce(c.md, '[]'::jsonb)) = 0 end
       order by (v.ma_cau = b.ma), (not v.la_goc), v.ma_cau);
    v_picks := '{}';
    for i in 1..2 loop
      select x into v_fresh from unnest(v_cands) x where not (x = any (v_used)) limit 1;
      if v_fresh is not null then
        v_used := v_used || v_fresh; v_picks := v_picks || v_fresh;
        v_form := v_form || jsonb_build_object(v_fresh, b.form);
      else
        -- không đủ biến thể cùng cụm + form ⇒ cho trùng TRONG cụm (khác đề 2 nếu được), rồi câu gốc — không nhảy cụm, không để trống
        v_dup := coalesce((select x from unnest(v_cands) x where not (x = any (v_picks)) limit 1), v_cands[1], b.ma);
        v_picks := v_picks || v_dup;
        v_form := v_form || jsonb_build_object(v_dup, b.form);
      end if;
    end loop;
    v_made := v_made || jsonb_build_object(b.ma, to_jsonb(v_picks));
  end loop;
  return jsonb_build_object('etMaDe', v_made, 'etFormByCau', v_form);
end $function$;

create or replace function fn_tl_bdm_et_de_xuat(p_lop uuid, p_ngay date) returns jsonb
language sql stable as $function$
  with gt as (
    select t.id from tai_lieu t
     where t.loai = 'giao_trinh_buoi' and t.ban_do = 'moi' and t.lop_id = p_lop and t.ngay = p_ngay
     order by t.created_at desc limit 1
  )
  select jsonb_build_object(
    'giao_trinh', (select id from gt),
    'dang_bai', coalesce((
      select jsonb_agg(x.j order by x.tt, x.id) from (
        select jsonb_build_object('id', p.ref_ma, 'nhom_id', db.nhom_id, 'ten', db.ten) j, p.thu_tu tt, p.id
          from tai_lieu_phan p join dai_bdm_dang_bai db on db.id = p.ref_ma
         where p.tai_lieu_id = (select id from gt) and p.loai_phan = 'dang_bai'
        union all
        -- giáo trình Hình: phần HỌC = bài học (bài học = nhóm = dạng bài)
        select jsonb_build_object('id', p.ref_ma, 'nhom_id', p.ref_ma, 'ten', hb.ten_bai), p.thu_tu, p.id
          from tai_lieu_phan p join hinh_hoc_bai hb on hb.ma_bai = p.ref_ma
         where p.tai_lieu_id = (select id from gt) and p.loai_phan = 'dang'
      ) x), '[]'::jsonb))
$function$;

create or replace function fn_tl_hh_goi_y_bai(p_bai text, p_n int, p_tru text[] default '{}') returns text[]
language plpgsql stable security definer set search_path to 'public' as $$
begin
  if not la_thanh_vien() then raise exception 'Chỉ nhân sự mới đọc được kho.' using errcode = '42501'; end if;
  return _tl_hh_goi_y(p_bai, p_n, p_tru);
end $$;
revoke execute on function fn_tl_hh_goi_y_bai(text, int, text[]) from public, anon;
grant execute on function fn_tl_hh_goi_y_bai(text, int, text[]) to authenticated;
