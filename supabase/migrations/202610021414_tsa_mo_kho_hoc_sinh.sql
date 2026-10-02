-- ============================================================================
-- 202610021414 — tsa_mo_kho_hoc_sinh
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 02/10 — "lên được app cho học sinh học luôn và giữ đúng thể loại câu hỏi trong pdf". Mở chốt kho TSA cho học sinh
--   (tự luyện theo chủ đề/chuyên đề). Mig 202610021339 cố ý để đóng vì 16 hàm còn nhánh "không phải KHTN thì là Toán"; ở đây vá đúng
--   những hàm học sinh đi qua và mở chốt. Dựng từ định nghĩa ĐANG CHẠY (pg_get_functiondef).
--   • _kho_co_mon('TSA') = true (_kho_ds_nhanh: môn ≠ Toán đã là 1 nhánh — mig 202610021403 của phiên Anh).
--   • THỂ LOẠI: câu TSA giữ nguyên thể loại như PDF — bộ lọc _kho_dk_online(_hs)_sql cho TSA nhận trắc nghiệm · trả lời ngắn · Đúng/Sai · KÉO THẢ
--     (luật "chỉ MCQ" là của luồng bổ trợ Toán, không áp cho TSA). Kéo thả: _tsa_keo_tha_key() rút khoá đáp án theo từng ô từ dap_an chuẩn
--     "a) $x$, b) $y$" (chỉ câu chuẩn hoá được mới được phát); _kho_snapshot_cau chụp khoá; _et_cham chấm theo ô (điểm tỉ lệ ô đúng).
--   • tu_luyen_chu_de_ds_dang / hs_dang_evals / htd_* đã đi qua registry (mig 202610021403, phiên Anh) — TSA hưởng luôn, không cần nhánh riêng.
-- MẤT GÌ: không mất dữ liệu. Chỉ thay (create or replace) 6 hàm + thêm 1 hàm; hành vi Toán/KHTN giữ nguyên.
-- ============================================================================
create or replace function public._tsa_keo_tha_key(p_dap_an text, p_noi_dung text, p_lua_chon jsonb)
 returns jsonb language sql immutable
as $function$
  select case
    when p_lua_chon is null or jsonb_typeof(p_lua_chon) <> 'array' or jsonb_array_length(p_lua_chon) = 0 then null
    when v.n = 0 or v.n <> (select count(*) from regexp_matches(coalesce(p_noi_dung, ''), '_{4,}', 'g')) then null
    when exists (select 1 from jsonb_array_elements_text(v.arr) x where not (p_lua_chon ? x)) then null
    else v.arr end
  from (
    select coalesce(jsonb_agg(m[1] order by o), '[]'::jsonb) as arr, count(*)::int as n
    from regexp_matches(coalesce(p_dap_an, ''), '(?:^|,\s*)[a-f]\)\s*(\$[^$]*\$)(?=,\s*[a-f]\)|\s*$)', 'g') with ordinality t(m, o)
  ) v
$function$;

create or replace function public._kho_dk_online_sql(p_cautbl text)
 returns text language sql stable
as $function$
  select '(c.kho_chuan and ((c.loai_cau in (''trac_nghiem'',''tra_loi_ngan'') and c.dap_an is not null)'
      || ' or (c.loai_cau = ''dung_sai'' and jsonb_array_length(coalesce(c.menh_de,''[]''::jsonb)) >= 2)'
      || case when p_cautbl = 'tsa_cau_hoi' then ' or (c.loai_cau = ''keo_tha'' and public._tsa_keo_tha_key(c.dap_an, c.noi_dung, c.lua_chon) is not null)' else '' end
      || case when public._kho_form_tn_cua(p_cautbl) is null then ''
              else format(' or exists (select 1 from %I f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)', public._kho_form_tn_cua(p_cautbl)) end
      || '))'
$function$;

CREATE OR REPLACE FUNCTION public._kho_dk_online_hs_sql(p_cautbl text)
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
  -- Thùy 02/10: HS CHỈ nhận câu trong KHO CHUẨN, mọi môn ⇒ đúng điều kiện chọn câu bổ trợ (một nguồn duy nhất).
  select case when p_cautbl = 'tsa_cau_hoi' then public._kho_dk_online_sql(p_cautbl) else public._kho_dk_mcq_sql(p_cautbl) end
$function$;

CREATE OR REPLACE FUNCTION public._kho_snapshot_cau(p_bt_id uuid, p_cautbl text, p_lttbl text, p_ma_cau text, p_thu_tu integer, p_ma_cum text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_row record; v_ly_thuyet text; v_ftbl text; v_form_id uuid; v_form_lc jsonb; v_form_da text; v_nltbl text; v_nl jsonb;
begin
  execute format($q$select * from %1$I where ma_cau = $1$q$, p_cautbl) into v_row using p_ma_cau;
  if v_row.ma_cau is null then raise exception 'Câu % không có trong %', p_ma_cau, p_cautbl; end if;
  execute format($q$select noi_dung from %1$I where ma_dang = $1$q$, p_lttbl) into v_ly_thuyet using v_row.dang_chinh;
  -- NGỮ LIỆU (đoạn văn / thông báo / biển báo) dùng chung cho nhiều câu: chụp kèm câu — HS không đọc được bảng ngữ liệu.
  v_nltbl := replace(p_cautbl, '_cau_hoi', '_ngu_lieu');
  if to_regclass('public.' || v_nltbl) is not null and to_jsonb(v_row) ->> 'ngu_lieu' is not null then
    execute format($q$select jsonb_build_object('ma', ma_ngu_lieu, 'loai', loai, 'tieu_de', tieu_de, 'noi_dung', noi_dung,
                                                'anh', anh, 'am_thanh', am_thanh, 'thu_tu', $2)
                      from %1$I where ma_ngu_lieu = $1$q$, v_nltbl)
      into v_nl using to_jsonb(v_row) ->> 'ngu_lieu', (to_jsonb(v_row) ->> 'thu_tu_trong_ngu_lieu')::int;
  end if;

  v_ftbl := public._kho_form_tn_cua(p_cautbl);
  if v_ftbl is not null then
    execute format($q$select id, lua_chon, dap_an from %1$I where ma_cau = $1 and da_duyet and xoa_at is null$q$, v_ftbl)
      into v_form_id, v_form_lc, v_form_da using p_ma_cau;
  end if;

  if v_form_id is not null then
    insert into bai_test_cau (bai_test_id, thu_tu, bien_the, ma_cau, loai_cau, noi_dung, lua_chon,
      menh_de, dap_an_key, loi_giai, anh_de, anh_dap_an, ma_dang, ly_thuyet, diem, ma_cum, form_tn_id, form_tn_hgt_id, lua_chon_rule, ngu_lieu)
    values (
      p_bt_id, p_thu_tu, 1, v_row.ma_cau, 'trac_nghiem', v_row.noi_dung,
      (select jsonb_agg(e->>'text' order by o) from jsonb_array_elements(v_form_lc) with ordinality t(e, o)),
      null, to_jsonb(v_form_da),
      v_row.loi_giai, v_row.anh_de, v_row.anh_dap_an, v_row.dang_chinh, v_ly_thuyet, 1,
      coalesce(p_ma_cum, v_row.ma_cum),
      case when v_ftbl = 'dai_cau_form_tn' then v_form_id end,
      case when v_ftbl = 'hgt_cau_form_tn' then v_form_id end,
      (select array_agg(case when (e->>'dung')::boolean then null else e->>'rule' end order by o)
         from jsonb_array_elements(v_form_lc) with ordinality t(e, o)),
      v_nl
    );
    return;
  end if;

  insert into bai_test_cau (bai_test_id, thu_tu, bien_the, ma_cau, loai_cau, noi_dung, lua_chon,
    menh_de, dap_an_key, loi_giai, anh_de, anh_dap_an, ma_dang, ly_thuyet, diem, ma_cum, ngu_lieu)
  values (
    p_bt_id, p_thu_tu, 1, v_row.ma_cau, v_row.loai_cau, v_row.noi_dung, v_row.lua_chon, v_row.menh_de,
    case v_row.loai_cau
      when 'trac_nghiem' then to_jsonb(upper(trim(v_row.dap_an)))
      when 'tra_loi_ngan' then to_jsonb(trim(v_row.dap_an))
      when 'keo_tha' then public._tsa_keo_tha_key(v_row.dap_an, v_row.noi_dung, v_row.lua_chon)
      when 'dung_sai' then (select jsonb_agg(case when upper(left(trim(m->>'dap_an'), 1)) = 'S' then 'S' else 'D' end)
                             from jsonb_array_elements(coalesce(v_row.menh_de, '[]'::jsonb)) m)
      else to_jsonb(v_row.dap_an)
    end,
    v_row.loi_giai, v_row.anh_de, v_row.anh_dap_an, v_row.dang_chinh, v_ly_thuyet, 1,
    coalesce(p_ma_cum, v_row.ma_cum), v_nl
  );
end $function$;

CREATE OR REPLACE FUNCTION public._et_cham(p_bai_lam uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_test uuid; v_qa uuid; rec record;
        a jsonb; k jsonb; vv text; vd numeric; cb text; dung int; n int; i int; lt text;
begin
  select bai_test_id into v_test from bai_lam where id = p_bai_lam;
  for rec in
    select bc.id cau_id, bc.loai_cau, bc.dap_an_key, bc.diem, bc.ma_cau, blc.id blc_id, blc.dap_an_hs
    from bai_test_cau bc left join bai_lam_cau blc on blc.bai_test_cau_id = bc.id and blc.bai_lam_id = p_bai_lam
    where bc.bai_test_id = v_test
  loop
    if rec.blc_id is null then continue; end if;  -- HS ko trả lời → bỏ (§1.5 anti-NULL)
    a := rec.dap_an_hs; k := rec.dap_an_key; cb := 'exact';
    if rec.loai_cau = 'trac_nghiem' then
      lt := chr(65 + (a #>> '{}')::int);
      vv := case when lt = upper(trim(k #>> '{}')) then 'correct' else 'wrong' end;
      vd := case when vv = 'correct' then rec.diem else 0 end;
    elsif rec.loai_cau = 'dung_sai' then
      n := jsonb_array_length(k); dung := 0;
      for i in 0 .. n - 1 loop
        if upper(left(a ->> i, 1)) = upper(left(k ->> i, 1)) then dung := dung + 1; end if;
      end loop;
      vd := (case dung when 0 then 0 when 1 then 0.1 when 2 then 0.25 when 3 then 0.5 else 1.0 end) * rec.diem;
      vv := case when dung = n then 'correct' when dung > 0 then 'partial' else 'wrong' end;
    elsif rec.loai_cau = 'keo_tha' then
      n := jsonb_array_length(k); dung := 0;
      for i in 0 .. n - 1 loop
        if public.tln_norm(a ->> i) = public.tln_norm(k ->> i) and coalesce(a ->> i, '') <> '' then dung := dung + 1; end if;
      end loop;
      vd := (dung::numeric / greatest(n, 1)) * rec.diem;
      vv := case when dung = n then 'correct' when dung > 0 then 'partial' else 'wrong' end;
    else  -- tra_loi_ngan: exact (norm cơ bản → chuẩn hoá số) → cache đáp-án-đã-duyệt
      vv := case when public.tln_norm(a #>> '{}') = public.tln_norm(k #>> '{}')
                   or (public.fn_tln_normalize(a #>> '{}') <> ''
                       and public.fn_tln_normalize(a #>> '{}') = public.fn_tln_normalize(k #>> '{}'))
                 then 'correct' else 'wrong' end;
      if vv = 'wrong' and rec.ma_cau is not null then
        select id into v_qa from question_accepted_answers
          where ma_cau = rec.ma_cau
            and (answer_normalized = public.tln_norm(a #>> '{}') or public.tln_norm(answer_raw) = public.tln_norm(a #>> '{}'))
          limit 1;
        if v_qa is not null then
          vv := 'correct'; cb := 'cache';
          update question_accepted_answers set hit_count = hit_count + 1 where id = v_qa;
        end if;
      end if;
      vd := case when vv = 'correct' then rec.diem else 0 end;
    end if;
    update bai_lam_cau set verdict = vv, diem = vd, cham_boi = cb, cham_at = now() where id = rec.blc_id;
  end loop;
end $function$;
