-- ============================================================================
-- 202609201203 — hs_sotay_tim: khớp theo RANH GIỚI TỪ, hết lọt giữa từ
-- ----------------------------------------------------------------------------
-- TRIỆU CHỨNG (CEO 20/09): gõ "chu vi" ra "Bài toán Công việc chung - riêng".
--   Cơ chế cũ là AND các CHUỖI CON: `%chu%` khớp trong "**chu**ng", `%vi%` khớp
--   trong "**vi**ec". Với HS thì kết quả này vô nghĩa.
--
-- ⚠ ĐÃ ĐO TRƯỚC KHI SỬA — luật "mỗi tiếng khớp ĐẦU một từ" KHÔNG đủ để chữa ca này:
--     haystack: "bai toan cong viec chung - rieng giai toan bang cach lap he phuong trinh"
--     `\mchu` → khớp, vì "chung" BẮT ĐẦU bằng "chu"
--     `\mvi`  → khớp, vì "viec"  BẮT ĐẦU bằng "vi"
--   ⇒ dạng sai VẪN LỌT. Kiểm thật trên 2 dạng đối lập (T109090301 "chu vi - diện tích"
--     vs T109010302 "Công việc chung - riêng"):
--        chuỗi con      : cả 2 khớp        (sai)
--        khớp đầu từ    : cả 2 khớp        (sai — vẫn không chữa được)
--        luật áp dụng ở đây: chỉ T109090301 khớp   (đúng)
--
-- LUẬT ÁP DỤNG — "tiếng cuối là tiền tố sống, các tiếng TRƯỚC phải trọn từ":
--   · tiếng 1..n-1 : `\m<tiếng>\M`  → phải khớp TRỌN một từ
--   · tiếng cuối n : `\m<tiếng>`    → chỉ cần khớp ĐẦU một từ (đang gõ dở)
--   Vẫn AND từng tiếng · vẫn bỏ dấu · vẫn không phân biệt hoa-thường (cả haystack lẫn
--   từ khoá đều đi qua `fn_bo_dau`, vốn đã `lower()`).
--
--   Vì sao luật này đúng cả 2 yêu cầu CEO:
--   · "chu vi"  → "chu" phải TRỌN TỪ. "Công việc chung" không có từ nào là "chu" ⇒ LOẠI. ✓
--   · "chu" một mình → nó là tiếng CUỐI ⇒ tiền tố ⇒ vẫn ra "chu vi". ✓ (không siết thành
--     khớp nguyên từ — đúng yêu cầu "đừng siết quá tay"). Lưu ý có chủ ý: gõ mỗi "chu" thì
--     "chung" VẪN ra — đó là hành vi autocomplete bình thường, gõ thêm tiếng là hết.
--   · Đo rộng: "phuong trinh bac" → 31 kết quả, không bị bóp.
--
-- CHỐNG REGEX-INJECTION (sửa luôn một lỗ âm thầm của bản cũ): chuyển từ LIKE sang regex
--   thì ký tự người dùng gõ có thể là metachar (`(`, `[`, `*`, `\`…) ⇒ query nổ hoặc khớp
--   bậy. Bản LIKE cũ cũng đã dính nhẹ (`%`, `_` trong input là wildcard). Nay mỗi tiếng bị
--   **lọc chỉ còn [a-z0-9]** trước khi ghép vào regex. Haystack đã qua `fn_bo_dau` nên chỉ
--   còn chữ không dấu + số + dấu câu ⇒ không mất gì có ý nghĩa tìm kiếm.
--
-- KHÔNG ĐỔI: chữ ký `(text, text, text, text, integer)` · lọc khối cứng (mig 202609201150)
--   · lọc `noi_dung <> ''` + loại dạng chờ · thang điểm 100/60/40/20/12/4 · dispatch môn.
--   Thang điểm vẫn dùng LIKE vì nó chỉ quyết định THỨ TỰ trong tập ĐÃ lọc, không quyết
--   định dòng nào xuất hiện.
-- GIỮ LUẬT mig 202609201056: chuỗi format không chứa `%` nào ngoài `%1$I`/`%2$I`.
--
-- ĐẦU RA KỲ VỌNG:
--   "chu vi" khối 9 → chỉ còn dạng chu vi/diện tích; KHÔNG còn "Công việc chung - riêng".
--   "chu" → vẫn ra "chu vi". "phuong trinh bac" → vẫn nhiều kết quả.
--   Kiểm bằng `npm run smoke:sotay` (đã thêm case âm "công việc chung" + 2 case đối chứng dương).
--
-- ÁP BẰNG SQL EDITOR (role postgres). MẤT GÌ: không — `create or replace` 1 function.
--   Thay đổi hành vi duy nhất: kết quả tìm HẸP LẠI, bỏ các dòng khớp-giữa-từ vô nghĩa.
-- ============================================================================

create or replace function public.hs_sotay_tim(
  p_tu_khoa text, p_mon text default 'Toán', p_nhanh text default null,
  p_khoi text default null, p_limit integer default 20)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_bd text := public._kho_ban_do_tbl(p_mon, p_nhanh);
  v_lt text := public._kho_lt_tbl(p_mon, p_nhanh);
  v_q text := public.fn_bo_dau(btrim(coalesce(p_tu_khoa, '')));
  v_toks text[];
  v_pats text[] := '{}';
  v_n integer;
  v_i integer;
  v_tien_to text;
  v_giua text;
  v_khoi text := nullif(btrim(coalesce(p_khoi, '')), '');
  v_limit integer := greatest(1, least(coalesce(p_limit, 20), 50));
  v_out jsonb;
begin
  if not public._sotay_duoc_doc() then raise exception 'Không có quyền đọc sổ tay.'; end if;
  if length(v_q) < 2 then return '[]'::jsonb; end if;

  -- Tách tiếng + LỌC CHỈ GIỮ [a-z0-9] (chặn metachar regex của người dùng — xem header).
  v_toks := array(
    select regexp_replace(x, '[^a-z0-9]', '', 'g')
    from unnest(regexp_split_to_array(v_q, '\s+')) x
    where regexp_replace(x, '[^a-z0-9]', '', 'g') <> ''
  );
  v_n := coalesce(array_length(v_toks, 1), 0);
  if v_n = 0 then return '[]'::jsonb; end if;

  -- Tiếng cuối = tiền tố (`\m…`), các tiếng trước = trọn từ (`\m…\M`).
  for v_i in 1 .. v_n loop
    v_pats := v_pats || (case when v_i < v_n then '\m' || v_toks[v_i] || '\M'
                              else '\m' || v_toks[v_i] end);
  end loop;

  v_tien_to := v_q || '%';
  v_giua    := '%' || v_q || '%';

  execute format($q$
    with d as (
      select bd.ma_dang, bd.ten_dang, bd.khoi, bd.muc_do, bd.mo_ta_ngan,
             bd.ten_chu_de, bd.ten_chuyen_de,
             public.fn_bo_dau(bd.ten_dang) t_dang,
             public.fn_bo_dau(bd.ten_dang) || ' ' || public.fn_bo_dau(bd.ten_chuyen_de) || ' '
               || public.fn_bo_dau(bd.ten_chu_de) || ' ' || public.fn_bo_dau(coalesce(bd.mo_ta_ngan, '')) hay
      from %1$I bd join %2$I lt on lt.ma_dang = bd.ma_dang
      where btrim(coalesce(lt.noi_dung, '')) <> ''
        and not public._kho_la_dang_cho(bd.ma_dang)
        and ($3::text is null or bd.khoi = $3::text)
    ), m as (
      select d.*,
        (case when d.t_dang = $1::text then 100
              when d.t_dang like $4::text then 60
              when d.t_dang like $5::text then 40
              when public.fn_bo_dau(d.ten_chuyen_de) like $5::text then 20
              when public.fn_bo_dau(d.ten_chu_de) like $5::text then 12
              else 4 end) diem
      from d where d.hay ~ all($2::text[])
    )
    select coalesce(jsonb_agg(jsonb_build_object(
      'ma_dang', ma_dang, 'ten_dang', ten_dang, 'khoi', khoi, 'muc_do', muc_do,
      'nhom', public._sotay_nhom(muc_do), 'mo_ta_ngan', mo_ta_ngan,
      'ten_chu_de', ten_chu_de, 'ten_chuyen_de', ten_chuyen_de
    ) order by diem desc, ten_dang), '[]'::jsonb)
    from (select * from m order by diem desc, ten_dang limit $6::int) z
  $q$, v_bd, v_lt)
  into v_out
  using v_q, v_pats, v_khoi, v_tien_to, v_giua, v_limit;

  return coalesce(v_out, '[]'::jsonb);
end $$;

revoke all     on function public.hs_sotay_tim(text, text, text, text, integer) from public;
revoke execute on function public.hs_sotay_tim(text, text, text, text, integer) from anon;
grant  execute on function public.hs_sotay_tim(text, text, text, text, integer) to authenticated;

-- ── SELF-VERIFY ─────────────────────────────────────────────────────────────────────────────
do $$
declare
  v_src text; v_fmt text; v_con text;
begin
  select p.prosrc into v_src from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public' and p.proname = 'hs_sotay_tim';

  v_fmt := substring(v_src from '\$q\$(.*)\$q\$');
  if v_fmt is null then raise exception 'Khong tach duoc chuoi format cua hs_sotay_tim'; end if;

  -- ① luật mig 202609201056: format sạch `%`
  v_con := replace(replace(v_fmt, '%1$I', ''), '%2$I', '');
  if position('%' in v_con) > 0 then
    raise exception 'Chuoi format VAN con dau %% ngoai %%1$I/%%2$I — se throw luc goi.';
  end if;

  -- ② luật mig 202609201150: khối phải nằm trong điều kiện lọc
  if position('bd.khoi = $3' in v_fmt) = 0 then
    raise exception 'Mat dieu kien LOC theo khoi (bd.khoi = $3).';
  end if;

  -- ③ luật của CHÍNH migration này: lọc dòng bằng REGEX, không còn LIKE chuỗi con
  if position('hay ~ all(' in v_fmt) = 0 then
    raise exception 'Khong thay "hay ~ all(" — chua chuyen sang khop theo ranh gioi tu.';
  end if;
  if position('hay like all(' in v_fmt) > 0 then
    raise exception 'VAN con "hay like all(" — van dang khop chuoi con.';
  end if;

  -- ④ quyền 2 chiều
  if has_function_privilege('anon', 'public.hs_sotay_tim(text,text,text,text,integer)', 'EXECUTE') then
    raise exception 'anon VAN EXECUTE duoc hs_sotay_tim';
  end if;
  if not has_function_privilege('authenticated', 'public.hs_sotay_tim(text,text,text,text,integer)', 'EXECUTE') then
    raise exception 'authenticated MAT EXECUTE tren hs_sotay_tim — app HS se chet';
  end if;

  raise notice 'OK: format sach, loc khoi, khop ranh gioi tu, quyen dung.';
end $$;
