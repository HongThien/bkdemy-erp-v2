-- DUYỆT ĐỀ KHÔNG ĐÒI PHÂN DẠNG (Thùy 20/10: "Việc duyệt đề không liên quan phân dạng. Duyệt xong rồi phân dạng sau cũng được").
-- Trước: trg_chan_duyet_dang_cho chặn da_duyet khi câu ở dạng chờ ⇒ fn_de_thi_duyet BỎ QUA câu chưa dạng (đề "đã duyệt" mà câu vẫn
--   chưa duyệt), câu nằm lại hàng "Chưa phân dạng" và phải chọn dạng mới duyệt được ⇒ người duyệt đề bị bắt phân đủ dạng.
-- Sau:
--   · Duyệt đề = xác nhận NỘI DUNG + ĐÁP ÁN ⇒ đánh dấu da_duyet MỌI câu của đề (kể cả mệnh đề Đ/S), dạng chưa có vẫn được.
--     Trigger chỉ nới cho ĐÚNG đường này (cờ phiên kho.duyet_noi_dung, đặt cục bộ trong fn_de_thi_duyet); duyệt câu lẻ ở
--     Duyệt kho vẫn như cũ (chọn dạng rồi duyệt).
--   · Hàng "Chưa phân dạng" = câu ĐANG Ở DẠNG CHỜ (bỏ điều kiện chưa duyệt) ⇒ câu đã duyệt nội dung vẫn ở đó chờ người phân dạng.
-- Câu đã duyệt mà còn dạng chờ: không bộ chọn nào lấy theo dạng chờ (không phải dạng thật) ⇒ không lọt vào bài theo dạng; builder
-- bản đồ mới lấy được ngay nếu câu đã gán dạng bài (dai_bdm_gan_cau) — đúng ý "phân dạng sau".

create or replace function public._trg_chan_duyet_dang_cho()
 returns trigger
 language plpgsql
as $function$
begin
  if new.da_duyet and public._kho_la_dang_cho(new.dang_chinh)
     and coalesce(current_setting('kho.duyet_noi_dung', true), '') <> 'on' then   -- duyệt ĐỀ (nội dung) được phép, phân dạng sau
    raise exception 'Chưa phân dạng: % đang ở dạng chờ % — chọn dạng thật trước khi duyệt', tg_table_name, new.dang_chinh
      using errcode = 'check_violation';
  end if;
  return new;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_de_thi_duyet(p_de uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v jsonb; r record; nsu uuid := public.current_nhan_su_id(); n int := 0; n_cho int := 0; v_form text; v_md_cho boolean;
        v_he text; v_moi text; v_cho boolean;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if nsu is null then raise exception 'Không xác định được nhân sự duyệt'; end if;
  v := public.fn_de_thi_thieu(p_de);
  if (v ->> 'so_chan')::int > 0 then
    raise exception 'Đề còn % câu thiếu đáp án / phương án — xử lý hết rồi mới duyệt được', v ->> 'so_chan' using errcode = 'check_violation';
  end if;
  perform set_config('kho.duyet_noi_dung', 'on', true);   -- chỉ trong transaction này: duyệt nội dung không đòi dạng
  for r in select * from public.fn_de_thi_cau(p_de) order by stt loop
    v_md_cho := false;
    if r.loai_cau = 'dung_sai' and to_regclass('public.' || r.kho || '_cau_menh_de') is not null then
      execute format('update %I set da_duyet = true, duyet_boi = $2, duyet_at = now(), duyet_nguon = ''nguoi''
                      where ma_cau_cha = $1 and xoa_at is null and not da_duyet', r.kho || '_cau_menh_de') using r.ma_cau, nsu;
      v_md_cho := exists (select 1 from jsonb_array_elements(case when jsonb_typeof(r.menh_de) = 'array' then r.menh_de else '[]'::jsonb end) m
                           where m ->> 'ma_dang' is null or public._kho_la_dang_cho(m ->> 'ma_dang'));
    end if;
    select m.he, m.id into v_he, v_moi from public._de_thi_dang_moi(r.kho, r.ma_cau) m;
    v_cho := case when v_he = 'moi' then v_moi is null
                  else r.dang_chinh is null or public._kho_la_dang_cho(r.dang_chinh) or v_md_cho end;
    if v_cho then n_cho := n_cho + 1; end if;   -- đã duyệt nội dung, còn chờ phân dạng (đếm để báo)
    execute format('update %I set da_duyet = true, duyet_boi = $2, duyet_at = now(), duyet_nguon = ''nguoi''
                    where ma_cau = $1 and not da_duyet', r.kho || '_cau_hoi') using r.ma_cau, nsu;
    n := n + 1;
    if r.loai_cau = 'tra_loi_ngan' then   -- form trắc nghiệm của câu TLN (nếu kho đã có sẵn) — không bắt buộc cho đề thi nữa (K5)
      v_form := public._kho_form_tn_cua(r.kho || '_cau_hoi');
      if v_form is not null then
        execute format('update %I set da_duyet = true, duyet_boi = $2, duyet_at = now()
                        where ma_cau = $1 and xoa_at is null and not da_duyet', v_form) using r.ma_cau, nsu;
      end if;
    end if;
  end loop;
  perform set_config('kho.duyet_noi_dung', 'off', true);
  update tai_lieu set duyet_at = now(), duyet_boi = nsu, updated_at = now() where id = p_de;
  return jsonb_build_object('so_cau', n, 'so_cau_cho_dang', n_cho);
end $function$;

-- Hàng "Chưa phân dạng" = câu đang ở dạng chờ (đã duyệt nội dung hay chưa đều phải phân dạng)
CREATE OR REPLACE FUNCTION public._kho_loc_duyet_sql(p_loc text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case p_loc
    when 'cau_moi'    then $s$c.loai_cau <> 'dung_sai' and not public._kho_la_dang_cho(c.dang_chinh) and not c.da_duyet and c.created_at >= public._kho_ngay_bat()$s$
    when 'moi'        then $s$c.loai_cau <> 'dung_sai' and not public._kho_la_dang_cho(c.dang_chinh) and not c.da_duyet and c.nguon_giai = 'ai' and c.giai_method = 'claude_code'$s$
    when 'nghi'       then $s$c.loai_cau <> 'dung_sai' and not public._kho_la_dang_cho(c.dang_chinh) and c.kiem_may = 'nghi'$s$
    when 'khong_kiem' then $s$c.loai_cau <> 'dung_sai' and not public._kho_la_dang_cho(c.dang_chinh) and c.kiem_may = 'khong_kiem_duoc'$s$
    when 'ton_dong'   then $s$c.loai_cau <> 'dung_sai' and not public._kho_la_dang_cho(c.dang_chinh) and not c.da_duyet and c.nguon_giai = 'ai' and c.giai_method is null$s$
    when 'chua_dang'  then $s$c.loai_cau <> 'dung_sai' and public._kho_la_dang_cho(c.dang_chinh)$s$
    when 'dung_sai'   then $s$c.loai_cau = 'dung_sai' and not c.da_duyet$s$
  end
$function$;
