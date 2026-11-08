-- ============================================================================
-- 202611081556 — gt_hinh_luyen_khong_do_san_bai
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 08/11 "sao chọn giáo trình hình luyện nó lại load cả kho bài vậy. vẫn cho chọn từng bài như bình thường chứ".
--   fn_tl_hl_dat_mo_hinh viết cho CHUYÊN ĐỀ Hình (21/10: thêm mô hình ⇒ đổ sẵn mọi bài kho, _tl_hl_bai_mac_dinh). Giáo trình
--   (loai 'giao_trinh', ChuyenDeHinhBuilder laGiaoTrinh) dùng chung hàm ⇒ thêm 1 mô hình là đổ cả kho (9S1: MH.128 82 bài).
--   Giờ: chỉ loai='chuyen_de' đổ sẵn; giáo trình thêm mô hình để trống rồi chọn bài. Thân hàm chép từ DB live, chỉ bọc đúng
--   câu insert bằng if. Mô hình giữ lại: không đổi (giữ bài đã chọn).
-- MẤT GÌ (Luật xoá): Không. Không đụng bài đã có trong giáo trình nào (9S1 vẫn còn 108 bài — bỏ hay giữ là việc người soạn).
-- ============================================================================

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
  delete from tai_lieu_phan p where p.cha_id = p_buoi and p.loai_phan = 'hl_mo_hinh'
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
