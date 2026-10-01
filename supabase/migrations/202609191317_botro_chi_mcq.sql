-- Thùy 19/09: "tất cả luồng bài tập bổ trợ yếu, bù, đuổi trên app đều dùng trắc nghiệm MCQ".
-- HIỆN TRẠNG: chỉ BỔ TRỢ YẾU có bài làm trên app HS (luyện lô 3 câu · test cuối ca · retest) — cả 3 đi qua `_btyeu_chon_cau`.
--   Bù = ET giấy TA chấm; Đuổi = tài liệu giấy (bt_grades) — CHƯA có luồng bài trên app. Luật này áp cho chúng khi build:
--   dùng `_kho_dk_mcq_sql` làm điều kiện chọn câu (1 nguồn duy nhất cho "câu MCQ dùng được trên app").
-- ĐO 19/09 (scripts/_diag_mcq_nguon_botro.mjs): 122 dạng đang mở trong 101 case Toán — CHỈ 41 dạng có câu MCQ (1282 câu);
--   81 dạng = 0 MCQ (53 dạng có ≥3 form_tn CHỜ DUYỆT — 1786 form; 28 dạng chưa sinh form). Bài bổ trợ thực tế 85% là trả lời ngắn.
-- ⇒ Siết cứng MCQ-only lúc này = 2/3 dạng đang bổ trợ HẾT CÂU, ca đang chạy bị gãy. Nên: MCQ TUYỆT ĐỐI khi phạm vi (dạng[+cụm])
--   có ≥1 câu MCQ; phạm vi 0 MCQ ⇒ TẠM lùi về điều kiện online cũ (TN/TLN/ĐS) tới khi form được duyệt — tự chuyển MCQ, không cần
--   sửa code. Snapshot (`_kho_snapshot_cau`) vốn đã ưu tiên form_tn đã duyệt ⇒ câu TLN có form sẽ hiện thành 4 đáp án.
-- MẤT GÌ: không. Thêm 1 function, thay 1 function (create or replace).
create or replace function public._kho_dk_mcq_sql(p_cautbl text) returns text
language sql stable as $$
  select '(c.kho_chuan and ((c.loai_cau = ''trac_nghiem'' and c.dap_an is not null)'
      || case when public._kho_form_tn_cua(p_cautbl) is null then ''
              else format(' or exists (select 1 from %I f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)', public._kho_form_tn_cua(p_cautbl)) end
      || '))'
$$;

create or replace function public._btyeu_chon_cau(p_cautbl text, p_ma_dang text, p_ma_cum text, p_tru text[], p_n integer)
returns text[] language plpgsql security definer set search_path = public as $$
declare v_out text[] := '{}'; v_more text[]; v_dk text; v_co_mcq boolean;
begin
  -- Phạm vi có câu MCQ không? Có ⇒ CHỈ MCQ (kể cả lượt bù khi đã làm hết — lặp câu MCQ, không lùi sang TLN).
  execute format($q$select exists (select 1 from %1$I c where c.dang_chinh = $1 and c.xoa_at is null
      and ($2::text is null or c.ma_cum = $2) and %2$s)$q$, p_cautbl, public._kho_dk_mcq_sql(p_cautbl))
    into v_co_mcq using p_ma_dang, p_ma_cum;
  v_dk := case when v_co_mcq then public._kho_dk_mcq_sql(p_cautbl) else public._kho_dk_online_sql(p_cautbl) end;

  execute format($q$
    select coalesce(array_agg(ma_cau), '{}') from (
      select c.ma_cau from %1$I c
      where c.dang_chinh = $1 and c.xoa_at is null
        and ($2::text is null or c.ma_cum = $2)
        and %2$s
        and c.ma_cau <> all($3)
      order by random() limit $4) s
  $q$, p_cautbl, v_dk) into v_out using p_ma_dang, p_ma_cum, p_tru, p_n;
  if coalesce(array_length(v_out, 1), 0) < p_n then
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
