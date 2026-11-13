-- CEO Thùy 16/09: màn Duyệt câu sửa được Đề + Đáp số + Lời giải nhưng KHÔNG sửa được 4 phương án A/B/C/D
-- (lua_chon) của câu trắc nghiệm. fn_kho_duyet_cau chưa từng đụng cột lua_chon. Thêm key "lua_chon" (jsonb
-- array 4 chuỗi) vào p_sua, theo đúng khuôn các key khác: vắng = giữ nguyên, có = validate rồi ghi.
create or replace function public.fn_kho_duyet_cau(p_mon text, p_ma_cau text, p_nguoi uuid, p_sua jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  t text := public.fn_kho_tbl(p_mon); v_cau text; v_ban_do text; v_cum_tbl text; v_form text;
  r record; v_dang text; v_cum text; v_dap text; v_lg text; v_de text; v_lua_chon jsonb;
  v_doi_dap boolean; v_doi_dang boolean; v_ok boolean; v_thu_hoi integer := 0;
  v_kiem_may text; v_kiem_boi text; v_kiem_ghi text; v_kiem_at timestamptz;
  v_opt jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if t is null then raise exception 'fn_kho_duyet_cau: môn không hợp lệ %', p_mon; end if;
  if p_nguoi is null then raise exception 'Thiếu người duyệt'; end if;
  v_cau := t || '_cau_hoi'; v_ban_do := t || '_ban_do'; v_cum_tbl := t || '_cum_bai'; v_form := public._kho_form_tn_cua(v_cau);

  execute format('select * from %I where ma_cau = $1 and xoa_at is null for update', v_cau) into r using p_ma_cau;
  if r.ma_cau is null then raise exception 'Câu % không tồn tại hoặc đã vào kho rác', p_ma_cau; end if;

  -- Dạng: phải có trong bản đồ của nhánh
  v_dang := coalesce(nullif(trim(p_sua->>'dang_chinh'), ''), r.dang_chinh);
  execute format('select exists (select 1 from %I where ma_dang = $1)', v_ban_do) into v_ok using v_dang;
  if not v_ok then raise exception 'Dạng % không có trong bản đồ %', v_dang, v_ban_do; end if;
  v_doi_dang := v_dang is distinct from r.dang_chinh;

  -- Cụm: key có ⇒ lấy giá trị (null = bỏ cụm); vắng ⇒ giữ. Cụm phải THUỘC dạng đã chốt, không thì về null (cụm nằm gọn trong 1 dạng).
  v_cum := case when p_sua ? 'ma_cum' then nullif(trim(p_sua->>'ma_cum'), '') else r.ma_cum end;
  if v_cum is not null then
    execute format('select exists (select 1 from %I where ma_cum = $1 and ma_dang = $2)', v_cum_tbl) into v_ok using v_cum, v_dang;
    if not v_ok then
      if p_sua ? 'ma_cum' then raise exception 'Cụm % không thuộc dạng %', v_cum, v_dang; end if;
      v_cum := null;   -- cụm cũ theo dạng cũ ⇒ reset
    end if;
  end if;

  v_de  := case when p_sua ? 'noi_dung' then nullif(trim(p_sua->>'noi_dung'), '') else r.noi_dung end;
  if v_de is null then raise exception 'Đề không được trống'; end if;
  v_dap := case when p_sua ? 'dap_an'   then nullif(trim(p_sua->>'dap_an'), '')   else r.dap_an end;
  v_lg  := case when p_sua ? 'loi_giai' then nullif(trim(p_sua->>'loi_giai'), '') else r.loi_giai end;
  v_doi_dap := v_dap is distinct from r.dap_an;

  -- 4 phương án A/B/C/D (chỉ câu trắc nghiệm có cột này): key có ⇒ validate là mảng chuỗi không rỗng, cùng
  -- số lượng phương án gốc (đáp số đang trỏ theo CHỮ CÁI/vị trí, đổi số lượng phương án dễ lệch đáp số).
  if p_sua ? 'lua_chon' then
    v_lua_chon := p_sua->'lua_chon';
    if jsonb_typeof(v_lua_chon) is distinct from 'array' then raise exception 'lua_chon phải là mảng chuỗi'; end if;
    if r.lua_chon is null then raise exception 'Câu này không phải trắc nghiệm, không có phương án để sửa'; end if;
    if jsonb_array_length(v_lua_chon) is distinct from jsonb_array_length(r.lua_chon) then
      raise exception 'Số phương án phải giữ nguyên (%), không thêm/bớt A/B/C/D', jsonb_array_length(r.lua_chon);
    end if;
    for v_opt in select * from jsonb_array_elements(v_lua_chon) loop
      if jsonb_typeof(v_opt) is distinct from 'string' or trim(v_opt #>> '{}') = '' then
        raise exception 'Mỗi phương án phải là chuỗi khác rỗng';
      end if;
    end loop;
  else
    v_lua_chon := r.lua_chon;
  end if;

  -- Sửa đáp số ⇒ thu hồi mọi form trắc nghiệm của câu (phương án đúng đã sai) để sinh lại
  if v_doi_dap and v_form is not null then
    execute format($q$update %I set xoa_at = now(), tu_choi_boi = $2,
                      tu_choi_ly_do = 'thu hồi: người sửa đáp số câu khi duyệt (' || $3 || ' → ' || $4 || ')'
                    where ma_cau = $1 and xoa_at is null$q$, v_form)
      using p_ma_cau, p_nguoi, coalesce(r.dap_an, '∅'), coalesce(v_dap, '∅');
    get diagnostics v_thu_hoi = row_count;
  end if;

  -- Kết quả kiểm đáp số: người là nhân chứng cuối khi câu đang nghi/không kiểm/chưa kiểm hoặc người đổi đáp số;
  -- máy/AI đã ký khớp mà người không đổi ⇒ giữ (đo precision mẫu ở mức C).
  if v_doi_dap or r.kiem_may is distinct from 'khop' then
    v_kiem_may := 'khop'; v_kiem_boi := 'nguoi'; v_kiem_at := now();
    v_kiem_ghi := case when v_doi_dap then 'người sửa đáp số: ' || coalesce(r.dap_an, '∅') || ' → ' || coalesce(v_dap, '∅') else 'người xác nhận' end
               || case when r.kiem_may_ghi is not null then ' (trước: ' || r.kiem_may_ghi || ')' else '' end;
  else
    v_kiem_may := r.kiem_may; v_kiem_boi := r.kiem_may_boi; v_kiem_ghi := r.kiem_may_ghi; v_kiem_at := r.kiem_may_at;
  end if;

  execute format($q$update %I set noi_dung = $2, dap_an = $3, loi_giai = $4, dang_chinh = $5, ma_cum = $6,
                    lua_chon = $12,
                    da_duyet = true, duyet_boi = $7, duyet_at = now(), duyet_nguon = 'nguoi',
                    kiem_may = $8, kiem_may_boi = $9, kiem_may_ghi = $10, kiem_may_at = $11
                  where ma_cau = $1$q$, v_cau)
    using p_ma_cau, v_de, v_dap, v_lg, v_dang, v_cum, p_nguoi, v_kiem_may, v_kiem_boi, v_kiem_ghi, v_kiem_at, v_lua_chon;

  return jsonb_build_object('thu_hoi_form', v_thu_hoi, 'doi_dap_an', v_doi_dap, 'doi_dang', v_doi_dang);
end
$function$;
