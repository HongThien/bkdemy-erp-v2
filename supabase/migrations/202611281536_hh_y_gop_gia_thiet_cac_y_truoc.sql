-- ============================================================================
-- 202611281536 — hh_y_gop_gia_thiet_cac_y_truoc
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 28/11 — chọn bài Hình-Học nhiều ý mà chỉ lấy ý c (không lấy a, b) thì đề vẫn phải có GIẢ THIẾT mà ý a, b thêm vào
--   (cột da_biet của ý), nhưng KHÔNG có câu hỏi của a, b. Đề ghép noi_dung (trigger _trg_hh_y_ghep) trước đây = lời dẫn + da_biet của chính ý + câu hỏi
--   ⇒ ý c đứng một mình thiếu giả thiết của ý trước. Sửa Ở DB (một nguồn): noi_dung của ý = lời dẫn + giả thiết các ý TRƯỚC (da_biet, bỏ trùng,
--   theo thứ tự nhãn) + da_biet của chính ý + câu hỏi ý ⇒ mọi nơi đọc câu (kho, builder, in, ET, MT, app HS) chạy như cũ, không phải sửa client.
--   Khúc nhiều ý liền nhau vẫn đúng: lời dẫn của khúc = phần đứng trước đuôi (da_biet + câu hỏi) của ý ĐẦU khúc (tachLoiDanY) — ý đầu khúc đã gồm giả thiết các ý trước nó.
--   Ý đổi giả thiết / nhãn / bị xoá ⇒ các ý còn lại của bài ghép lại (trigger sau).
-- MẤT GÌ (Luật xoá): không xoá gì. noi_dung của các ý có ý TRƯỚC mang da_biet khác rỗng sẽ DÀI THÊM (chỉ phần giả thiết); mã câu / mã gốc không đổi.
-- ============================================================================
create or replace function public._trg_hh_y_ghep() returns trigger language plpgsql as $f$
declare b record; v_truoc text;
begin
  if new.bai_y is null then return new; end if;
  select * into b from hinh_hoc_bai_y where ma_bai_y = new.bai_y;
  if not found then raise exception 'Không thấy bài nhiều ý %', new.bai_y; end if;
  if tg_op = 'UPDATE' and new.noi_dung is distinct from old.noi_dung
     and new.cau_hoi_y is not distinct from old.cau_hoi_y and new.da_biet is not distinct from old.da_biet then
    raise exception 'Câu % là ý %) của bài % — sửa lời dẫn ở bài, sửa câu hỏi ở ý (không sửa thẳng đề ghép).', new.ma_cau, new.nhan_y, new.bai_y
      using errcode = 'P0001';
  end if;
  -- giả thiết các ý đứng TRƯỚC (theo nhãn), bỏ trùng, bỏ cái trùng giả thiết của chính ý này
  select string_agg(x.d, E'\n' order by x.nhan_y) into v_truoc
    from (select distinct on (btrim(s.da_biet)) btrim(s.da_biet) d, s.nhan_y
            from hinh_hoc_cau_hoi s
           where s.bai_y = new.bai_y and s.xoa_at is null and s.ma_cau is distinct from new.ma_cau
             and s.nhan_y < new.nhan_y
             and btrim(coalesce(s.da_biet, '')) <> ''
             and btrim(s.da_biet) is distinct from btrim(coalesce(new.da_biet, ''))
           order by btrim(s.da_biet), s.nhan_y) x;
  new.noi_dung := b.loi_dan || E'\n' || coalesce(v_truoc || E'\n', '') || coalesce(nullif(btrim(new.da_biet), '') || E'\n', '') || new.cau_hoi_y;
  new.anh_de := b.anh_de;
  new.dang_chinh := b.dang_chinh;
  return new;
end $f$;

-- Ý đổi giả thiết / nhãn / bị xoá hoặc thêm ý ⇒ các ý khác cùng bài ghép lại (chạm cau_hoi_y = chính nó ⇒ đi qua trigger trên; không kích lại chính trigger này
-- vì nó chỉ nghe da_biet · nhan_y · xoa_at).
create or replace function public._trg_hh_y_lan_y_khac() returns trigger language plpgsql as $f$
begin
  if new.bai_y is not null then
    update hinh_hoc_cau_hoi set cau_hoi_y = cau_hoi_y where bai_y = new.bai_y and xoa_at is null and ma_cau <> new.ma_cau;
  end if;
  return null;
end $f$;
create trigger trg_hh_y_lan_y_khac_upd after update of da_biet, nhan_y, xoa_at on public.hinh_hoc_cau_hoi
  for each row when (new.bai_y is not null) execute function public._trg_hh_y_lan_y_khac();
create trigger trg_hh_y_lan_y_khac_ins after insert on public.hinh_hoc_cau_hoi
  for each row when (new.bai_y is not null) execute function public._trg_hh_y_lan_y_khac();
revoke execute on function public._trg_hh_y_lan_y_khac() from public, anon, authenticated;

-- Ghép lại các bài ĐÃ có giả thiết ở ý trước (chỉ bài có ít nhất một da_biet — ghép lại bài khác cũng không đổi gì).
update public.hinh_hoc_cau_hoi set cau_hoi_y = cau_hoi_y
 where bai_y in (select bai_y from public.hinh_hoc_cau_hoi where bai_y is not null and xoa_at is null and btrim(coalesce(da_biet, '')) <> '')
   and xoa_at is null;
