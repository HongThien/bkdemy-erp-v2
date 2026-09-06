-- ============================================================================
-- 202608300301 — Phase 1 (đợt 5b) §2.0: SỬA KEY + CHẤM LẠI CẢ LỚP → RPC transactional
-- ----------------------------------------------------------------------------
-- VÌ SAO: audit 30/08 — suaKeyVaChamLai (testonline.ts) chấm lại từng bài bằng engine JS
--   rồi UPDATE từng dòng (N+1), không nguyên tử: chết giữa chừng là lớp nửa điểm cũ nửa
--   điểm mới. Giờ: fn_sua_key_va_cham_lai — sửa key + chấm lại + đếm + ghi log trong MỘT
--   transaction. Bộ chấm 3 loại câu port 1-1 từ src/gami/testgrade.js:
--   · trac_nghiem: LETTERS[index HS chọn] == chữ cái key
--   · tra_loi_ngan: fn_tln_check (tách ';' → normalize → hoán vị + sai số 1e-6);
--     wrong thì hỏi tiếp cache AI tln_cache_check (đường 'cache')
--   · dung_sai: đếm ý đúng → thang THPT 2025 [0, .1, .25, .5, 1] (4 ý) hoặc dung/n
--   ⚠ parseFloat JS ăn PREFIX số ("5x"→5) — fn_js_parsefloat nhân bản đúng để so sai số.
-- MẤT GÌ (Luật xoá): không mất — thêm function. Hành vi chấm y nguyên engine JS.
-- ============================================================================

-- parseFloat của JS: bóc PREFIX số (kể cả mũ e) — "5x"→5; không có prefix số → null (NaN).
create or replace function public.fn_js_parsefloat(p text) returns float8
language sql immutable as $$
  -- substring(from pattern) trả NHÓM NGOẶC ĐẦU nếu pattern có ngoặc → bọc cả pattern vào ngoặc ngoài.
  select substring(trim(p) from '^([+-]?([0-9]+\.?[0-9]*|\.[0-9]+)([eE][+-]?[0-9]+)?)')::float8
$$;

-- smartCheckTLN (testgrade.js): tách CHỈ theo ';', normalize từng phần, so đa tập (sort) +
-- numeric xấp xỉ 1e-6.
create or replace function public.fn_tln_check(p_user text, p_key text) returns boolean
language plpgsql immutable as $$
declare u text[]; k text[]; i int;
begin
  if p_user is null or p_user = '' or p_key is null or p_key = '' then return false; end if;
  select coalesce(array_agg(x order by x), '{}') into u
    from (select public.fn_tln_normalize(t) as x from unnest(string_to_array(p_user, ';')) t) s where x <> '';
  select coalesce(array_agg(x order by x), '{}') into k
    from (select public.fn_tln_normalize(t) as x from unnest(string_to_array(p_key, ';')) t) s where x <> '';
  if array_length(u, 1) is distinct from array_length(k, 1) then return false; end if;
  if array_length(k, 1) is null then return false; end if;
  for i in 1..array_length(k, 1) loop
    if u[i] = k[i] then continue; end if;
    if public.fn_js_parsefloat(u[i]) is not null and public.fn_js_parsefloat(k[i]) is not null
       and abs(public.fn_js_parsefloat(u[i]) - public.fn_js_parsefloat(k[i])) < 1e-6 then continue; end if;
    return false;
  end loop;
  return true;
end $$;

-- Sửa key 1 câu snapshot + chấm lại mọi bài làm của ĐÚNG câu đó (scope cứng bai_test_cau_id).
create or replace function public.fn_sua_key_va_cham_lai(p_bai_test_cau_id uuid, p_key jsonb, p_ly_do text)
returns jsonb language plpgsql as $$
declare
  c record; r record; v_letters text[] := array['A','B','C','D','E','F'];
  v_verdict text; v_cham_boi text; v_diem numeric; v_dung int; v_n int; v_hit boolean;
  v_sai_dung int := 0; v_dung_sai int := 0; v_khong_doi int := 0; v_so_bai int := 0;
  v_key_cu jsonb; v_diem_tho numeric;
begin
  select id, loai_cau, dap_an_key, diem, ma_cau into c from bai_test_cau where id = p_bai_test_cau_id;
  if c is null then raise exception 'Không thấy câu %', p_bai_test_cau_id; end if;
  v_key_cu := c.dap_an_key;
  update bai_test_cau set dap_an_key = p_key where id = p_bai_test_cau_id;

  for r in select id, dap_an_hs, verdict from bai_lam_cau where bai_test_cau_id = p_bai_test_cau_id loop
    v_cham_boi := 'exact'; v_diem_tho := null;
    if c.loai_cau = 'trac_nghiem' then
      if r.dap_an_hs is null or jsonb_typeof(r.dap_an_hs) <> 'number' or (r.dap_an_hs #>> '{}')::numeric < 0 then
        v_verdict := 'wrong';
      else
        v_verdict := case when v_letters[((r.dap_an_hs #>> '{}')::numeric)::int + 1]
                            = upper(trim(p_key #>> '{}')) then 'correct' else 'wrong' end;
      end if;
    elsif c.loai_cau = 'dung_sai' then
      v_n := coalesce(jsonb_array_length(p_key), 0);
      select count(*) into v_dung from generate_series(0, v_n - 1) i
      where r.dap_an_hs is not null and jsonb_typeof(r.dap_an_hs) = 'array'
        and (r.dap_an_hs ->> i) is not null
        and (case when upper(trim(r.dap_an_hs ->> i)) like 'S%' then 'S' else 'D' end)
          = (case when upper(trim(p_key ->> i)) like 'S%' then 'S' else 'D' end);
      v_diem_tho := case when v_n = 4 then (array[0, 0.1, 0.25, 0.5, 1.0]::numeric[])[v_dung + 1]
                         when v_n > 0 then v_dung::numeric / v_n else 0 end;
      v_verdict := case when v_dung = v_n and v_n > 0 then 'correct' when v_dung > 0 then 'partial' else 'wrong' end;
    else -- tra_loi_ngan
      v_verdict := case when public.fn_tln_check(r.dap_an_hs #>> '{}', p_key #>> '{}') then 'correct' else 'wrong' end;
      if v_verdict = 'wrong' and c.ma_cau is not null then
        select public.tln_cache_check(c.ma_cau, public.fn_tln_normalize(r.dap_an_hs #>> '{}')) into v_hit;
        if v_hit is true then v_verdict := 'correct'; v_cham_boi := 'cache'; end if;
      end if;
    end if;

    v_diem := case when v_diem_tho is not null then v_diem_tho * c.diem
                   when v_verdict = 'correct' then c.diem
                   when v_verdict = 'partial' then c.diem * 0.5 else 0 end;
    update bai_lam_cau set verdict = v_verdict, diem = v_diem, cham_boi = v_cham_boi, cham_at = now()
      where id = r.id;
    v_so_bai := v_so_bai + 1;
    if r.verdict is distinct from 'correct' and v_verdict = 'correct' then v_sai_dung := v_sai_dung + 1;
    elsif r.verdict = 'correct' and v_verdict <> 'correct' then v_dung_sai := v_dung_sai + 1;
    else v_khong_doi := v_khong_doi + 1; end if;
  end loop;

  insert into bai_test_cham_lai_log (bai_test_cau_id, key_cu, key_moi, so_bai, sai_thanh_dung, dung_thanh_sai, ly_do, nguoi)
  values (p_bai_test_cau_id, v_key_cu, p_key, v_so_bai, v_sai_dung, v_dung_sai, nullif(p_ly_do, ''), public.jwt_uid());
  return jsonb_build_object('soBai', v_so_bai, 'saiThanhDung', v_sai_dung, 'dungThanhSai', v_dung_sai, 'khongDoi', v_khong_doi);
end $$;
grant execute on function public.fn_sua_key_va_cham_lai(uuid, jsonb, text) to authenticated;
