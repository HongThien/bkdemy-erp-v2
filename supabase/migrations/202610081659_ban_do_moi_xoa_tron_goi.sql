-- ════════════════════════════════════════════════════════════════════════════
-- BẢN ĐỒ MỚI (NHÁP) — XOÁ TRỌN GÓI (CEO 08/10: "vỏ không tái sử dụng được thì phải cho t xoá")
--
-- Trước: FK chặn xoá khi còn con ⇒ muốn bỏ 1 nhóm chép từ bản cũ phải xoá TỪNG dạng bài trước; bỏ 1 chuyên đề phải
-- xoá từng nhóm; bỏ 1 chủ đề phải gỡ từng chuyên đề. Với vỏ chép sẵn (681 nhóm, 329 dạng bài) là không làm nổi.
-- Nay: xoá 1 mục = xoá luôn mọi thứ bên dưới (1 transaction), màn hỏi xác nhận kèm SỐ LƯỢNG sẽ mất.
-- CHẶN DUY NHẤT: bên dưới có CÂU ĐÃ GÁN (dai_bdm_gan_cau = công người/AI) ⇒ báo rõ, không xoá gì.
-- Ghi vết: trigger _bdm_ghi_log ghi từng dòng bị xoá (như xoá tay). Mũi tên tiền đề + đối ứng đi theo (ON DELETE CASCADE).
-- ════════════════════════════════════════════════════════════════════════════

create or replace function _bdm_xoa_cac_nhom(p_nhom text[])
returns jsonb language plpgsql as $$
declare
  v_db integer;
  v_cau integer;
  v_n integer;
begin
  select count(*) into v_cau from dai_bdm_gan_cau g join dai_bdm_dang_bai d on d.id = g.dang_bai_id where d.nhom_id = any (p_nhom);
  if v_cau > 0 then
    raise exception 'Bên trong có % câu đã được gán vào dạng bài — gỡ gán hoặc chuyển dạng bài đi trước rồi mới xoá', v_cau;
  end if;
  delete from dai_bdm_dang_bai where nhom_id = any (p_nhom);
  get diagnostics v_db = row_count;
  delete from dai_bdm_nhom where id = any (p_nhom);
  get diagnostics v_n = row_count;
  return jsonb_build_object('nhom', v_n, 'dang_bai', v_db);
end $$;

-- Xoá 1 nhóm cùng mọi dạng bài bên trong
create or replace function fn_bdm_xoa_nhom(p_id text)
returns jsonb language plpgsql as $$
begin
  if not exists (select 1 from dai_bdm_nhom where id = p_id) then raise exception 'Không tìm thấy nhóm bài %', p_id; end if;
  return _bdm_xoa_cac_nhom(array[p_id]);
end $$;

-- Gỡ 1 chuyên đề khỏi 1 chủ đề cùng mọi nhóm + dạng bài của nó trong chủ đề đó.
-- Chuyên đề không còn ở chủ đề nào ⇒ xoá luôn khỏi danh mục (khỏi rác ở ô chọn chuyên đề).
create or replace function fn_bdm_xoa_o(p_chu_de text, p_chuyen_de text)
returns jsonb language plpgsql as $$
declare
  v jsonb;
  v_xoa_cd boolean := false;
begin
  if not exists (select 1 from dai_bdm_o where chu_de_id = p_chu_de and chuyen_de_id = p_chuyen_de) then
    raise exception 'Không tìm thấy chuyên đề % trong chủ đề %', p_chuyen_de, p_chu_de;
  end if;
  v := _bdm_xoa_cac_nhom(array(select id from dai_bdm_nhom where chu_de_id = p_chu_de and chuyen_de_id = p_chuyen_de));
  delete from dai_bdm_o where chu_de_id = p_chu_de and chuyen_de_id = p_chuyen_de;
  if not exists (select 1 from dai_bdm_o where chuyen_de_id = p_chuyen_de) then
    delete from dai_bdm_chuyen_de where id = p_chuyen_de;
    v_xoa_cd := true;
  end if;
  return v || jsonb_build_object('xoa_khoi_danh_muc', v_xoa_cd);
end $$;

-- Xoá 1 chủ đề cùng mọi chuyên đề (ô) + nhóm + dạng bài bên trong
create or replace function fn_bdm_xoa_chu_de(p_id text)
returns jsonb language plpgsql as $$
declare
  v jsonb;
  v_o integer;
  v_cds text[];
begin
  if not exists (select 1 from dai_bdm_chu_de where id = p_id) then raise exception 'Không tìm thấy chủ đề %', p_id; end if;
  v := _bdm_xoa_cac_nhom(array(select id from dai_bdm_nhom where chu_de_id = p_id));
  v_cds := array(select chuyen_de_id from dai_bdm_o where chu_de_id = p_id);
  delete from dai_bdm_o where chu_de_id = p_id;
  get diagnostics v_o = row_count;
  delete from dai_bdm_chuyen_de ch
   where ch.id = any (v_cds)
     and not exists (select 1 from dai_bdm_o o where o.chuyen_de_id = ch.id);
  delete from dai_bdm_chu_de where id = p_id;
  return v || jsonb_build_object('chuyen_de', v_o);
end $$;

revoke execute on function _bdm_xoa_cac_nhom(text[]), fn_bdm_xoa_nhom(text), fn_bdm_xoa_o(text, text), fn_bdm_xoa_chu_de(text) from public, anon;
grant execute on function _bdm_xoa_cac_nhom(text[]), fn_bdm_xoa_nhom(text), fn_bdm_xoa_o(text, text), fn_bdm_xoa_chu_de(text) to authenticated;
