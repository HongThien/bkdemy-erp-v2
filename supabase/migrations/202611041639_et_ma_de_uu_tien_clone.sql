-- ============================================================================
-- 202611041639_et_ma_de_uu_tien_clone
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 04/11 "logic là nếu có câu clone thì phải chọn câu clone nhé". Mig 202611041623 nới ứng viên ra cả dạng bài nhưng
--   thứ tự (cùng cụm → cùng loại → câu GỐC trước) không đặt clone lên đầu — còn đẩy câu gốc khác lên trước clone.
-- SỬA: thêm cột goc (= coalesce(parent_ma_cau, ma_cau)) cho ứng viên; thứ tự: khác câu đề 1 → CÙNG GỐC (clone) → cùng cụm → cùng loại
--   → câu gốc → mã. Luật form, phạm vi dạng bài, luật trùng khi hết câu giữ nguyên. Thân hàm lấy NGUYÊN từ bản đang chạy, thay đúng chỗ.
-- MẤT GÌ (Luật xoá): Không. Chỉ thay thân hàm; ET đã lưu không đổi (đề 2/3 sinh lại khi bấm 🎲 Sinh đề 2 & 3 / Lưu).
-- ============================================================================

CREATE OR REPLACE FUNCTION public.fn_tl_bdm_et_ma_de(p_khoi text, p_base jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$   -- volatile: dùng bảng tạm (đọc vị trí câu 1 lần), không ghi gì lâu dài
declare
  b record;
  v_cum text; v_loai text; v_goc text; v_cands text[]; v_picks text[]; v_fresh text; v_dup text;
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
    select v.cum, v.loai_cau into v_cum, v_loai from _et_vt3 v where v.ma_cau = b.ma;
    -- gốc của câu đề 1 (câu gốc ⇒ chính nó; câu clone ⇒ parent) — đọc thẳng kho, kể cả khi câu đề 1 không còn kho chuẩn
    v_goc := coalesce((select coalesce(x.parent_ma_cau, x.ma_cau) from (
               select ma_cau, parent_ma_cau from dai_cau_hoi where ma_cau = b.ma union all
               select ma_cau, parent_ma_cau from hgt_cau_hoi where ma_cau = b.ma union all
               select ma_cau, parent_ma_cau from hinh_hoc_cau_hoi where ma_cau = b.ma union all
               select ma_cau, parent_ma_cau from khtn_cau_hoi where ma_cau = b.ma) x limit 1), b.ma);
    v_cum := coalesce(v_cum, b.ma);   -- câu gốc không còn trong kho chuẩn ⇒ cụm = chính nó
    -- ⭐⭐ Thùy 04/11 "nếu có câu clone thì phải chọn câu clone": ưu tiên SỐ 1 = câu cùng GỐC (clone của câu đề 1, hoặc gốc + clone
    --   anh em khi câu đề 1 là clone), rồi mới tới cùng cụm → cùng loại câu → câu gốc khác cùng dạng bài.
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
       order by (v.ma_cau = b.ma), (v.goc is distinct from v_goc), (v.cum is distinct from v_cum), (v.loai_cau is distinct from v_loai), (not v.la_goc), v.ma_cau);
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
