-- Thùy 28/09: "Các dạng nâng cao không có trắc nghiệm MCQ thì phải hiện trả lời ngắn chứ" ⇒ chốt: MỨC ĐỘ 4–5 (bản đồ `muc_do`).
-- NGOẠI LỆ có chủ đích cho luật "MCQ tuyệt đối" (20/09): dạng muc_do ≥ 4 mà CẢ DẠNG không có câu MCQ nào trong kho ⇒ lấy câu TRẢ LỜI NGẮN
-- (kho_chuan + loai_cau='tra_loi_ngan' + có đáp án). Mọi dạng khác (mức 1–3, hoặc mức 4–5 có MCQ) giữ MCQ tuyệt đối như cũ.
-- 1 chỗ sửa (_btyeu_chon_cau) ⇒ áp đồng thời luyện trong ca · test cuối ca · retest · phiếu giấy. TA vẫn tích lại Đúng/Sai câu TLN được (fn_btyeu_ta_sua_ket_qua).
-- Đo 28/09 (case mở, Toán): 10 dạng mức 4–5 không có MCQ; 7 có TLN ⇒ thông; 3 chỉ có tự luận (T105010204, T105020204, T106030402) ⇒ vẫn học giấy.
-- Dựng từ bản ĐANG CHẠY; bản đồ suy từ bảng câu: <x>_cau_hoi ⇒ <x>_ban_do (dai · hgt · khtn).
create or replace function public._btyeu_chon_cau(p_cautbl text, p_ma_dang text, p_ma_cum text, p_tru text[], p_n integer)
 returns text[] language plpgsql security definer set search_path to 'public' as $function$
declare v_out text[] := '{}'; v_more text[]; v_dk text := public._kho_dk_mcq_sql(p_cautbl);
        v_bd text := replace(p_cautbl, '_cau_hoi', '_ban_do'); v_muc smallint; v_co_mcq boolean;
begin
  -- Ngoại lệ nâng cao (Thùy 28/09): mức ≥ 4 và cả dạng 0 MCQ ⇒ dùng câu trả lời ngắn có đáp án.
  if to_regclass('public.' || v_bd) is not null then
    execute format('select muc_do from %I where ma_dang = $1 limit 1', v_bd) into v_muc using p_ma_dang;
  end if;
  if coalesce(v_muc, 0) >= 4 then
    execute format($q$select exists (select 1 from %1$I c where c.dang_chinh = $1 and c.xoa_at is null and %2$s)$q$, p_cautbl, v_dk) into v_co_mcq using p_ma_dang;
    if not v_co_mcq then v_dk := $d$(c.kho_chuan and c.loai_cau = 'tra_loi_ngan' and c.dap_an is not null)$d$; end if;
  end if;

  execute format($q$
    select coalesce(array_agg(ma_cau), '{}') from (
      select c.ma_cau from %1$I c
      where c.dang_chinh = $1 and c.xoa_at is null
        and ($2::text is null or c.ma_cum = $2)
        and %2$s
        and c.ma_cau <> all($3)
      order by random() limit $4) s
  $q$, p_cautbl, v_dk) into v_out using p_ma_dang, p_ma_cum, p_tru, p_n;
  if coalesce(array_length(v_out, 1), 0) < p_n then -- cạn câu chưa gặp ⇒ lặp lại câu cùng loại đã làm
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
end $function$;

-- Dạng nâng cao vừa thông ⇒ bù retest cho dạng đang chờ retest mà trước đây không ra được câu (vd Nguyễn Đăng Đức T107010505/06/07, Lê Hà Khoa, Nguyễn Quang Minh).
select public.fn_btyeu_bu_retest_ton();
