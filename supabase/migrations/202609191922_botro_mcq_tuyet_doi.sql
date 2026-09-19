-- Thùy 20/09: "Sao bổ trợ yếu lớp 9 vẫn còn câu trả lời ngắn. Đã bảo CHỈ làm các câu MCQ cơ mà."
-- 19/09 t để nhánh lùi (dạng 0 câu MCQ ⇒ tạm ra trả lời ngắn để ca không gãy) — đo lại: 48/111 câu sinh sau khi áp vẫn là TLN, TẤT CẢ
-- từ dạng 0 MCQ (K9 Bảo Châu T109010203 · K7 T107010205/0505/0506/0507). CEO đã chốt luật ⇒ BỎ nhánh lùi: MCQ TUYỆT ĐỐI.
-- Hệ quả (chấp nhận): dạng chưa có MCQ ⇒ app báo rõ "chưa có câu trắc nghiệm", em học dạng đó với thầy cô trên giấy; test cuối ca /
-- retest tự bỏ qua dạng đó (fn_btyeu_dong_ca vốn xử được mảng rỗng). Hết khi học thuật sinh + duyệt form MCQ — không cần sửa code.
create or replace function public._btyeu_chon_cau(p_cautbl text, p_ma_dang text, p_ma_cum text, p_tru text[], p_n integer)
returns text[] language plpgsql security definer set search_path = public as $$
declare v_out text[] := '{}'; v_more text[]; v_dk text := public._kho_dk_mcq_sql(p_cautbl);
begin
  execute format($q$
    select coalesce(array_agg(ma_cau), '{}') from (
      select c.ma_cau from %1$I c
      where c.dang_chinh = $1 and c.xoa_at is null
        and ($2::text is null or c.ma_cum = $2)
        and %2$s
        and c.ma_cau <> all($3)
      order by random() limit $4) s
  $q$, p_cautbl, v_dk) into v_out using p_ma_dang, p_ma_cum, p_tru, p_n;
  if coalesce(array_length(v_out, 1), 0) < p_n then -- cạn câu chưa gặp ⇒ lặp lại câu MCQ đã làm (vẫn CHỈ MCQ)
    execute format($q$
      select coalesce(array_agg(ma_cau), '{}') from (
        select c.ma_cau from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null
          and ($2::text is null or c.ma_cum = $2)
          and %2$s
          and c.ma_cau <> all($3)
        order by random() limit $4) s
    $q$, p_cautbl, v_dk) into v_more using p_ma_dang, p_ma_cum, v_out, p_n - coalesce(array_length(v_out, 1), 0);
    v_out := v_out || v_more;
  end if;
  return v_out;
end $$;

-- Thông báo rõ nguyên nhân cho em/TA (thay câu chung chung cũ) — vá đúng 1 chuỗi trong thân hàm đang sống, không chép lại cả hàm.
do $$
declare v_def text := pg_get_functiondef('public.fn_btyeu_luyen_sinh(uuid,text,text,integer)'::regprocedure);
begin
  if position('Kho chưa có câu chấm online cho dạng này.' in v_def) > 0 then
    execute replace(v_def, 'Kho chưa có câu chấm online cho dạng này.',
      'Dạng này chưa có câu TRẮC NGHIỆM trong kho — em học dạng này với thầy cô trên giấy nhé (bổ trợ trên app chỉ dùng trắc nghiệm).');
  end if;
end $$;
