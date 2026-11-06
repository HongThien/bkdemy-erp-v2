-- ============================================================================
-- 202611061430 — phien_kho_sua_duyet_anh_cau
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 06/11 — "t đã nói là cho trưởng khối mọi quyền sửa kho và bản đồ kiến thức, sao m vẫn chặn".
--   Mig 202611051726 mới mở đủ quyền BẢN ĐỒ; phần CÂU trong kho vẫn không có lệnh nào. Đo trong lịch sử phiên:
--   · anh Đạt (Toán 10, 05/11 19:25) "Duyệt luôn bài trong kho của nhóm 1 và nhóm 2" ⇒ Claude không có lệnh duyệt câu;
--   · anh Ngọc (KHTN 9, 06/11 14:03) "thêm ảnh chưa?" ⇒ Claude không có lệnh gắn ảnh vào câu.
-- THÊM (đều qua phiên, đóng vai người mở phiên, câu phải đúng môn + khối của phiên — registry _phien_kho_nhanh_ds):
--   · fn_phien_kho_duyet   — duyệt / bỏ duyệt theo danh sách mã câu, hoặc cả một dạng bài / nhóm bài (câu đã gán + bản sao).
--                            Người duyệt = người mở phiên (duyet_nguon 'nguoi'). Trigger _trg_chan_duyet_dang_cho vẫn chặn câu chưa có dạng.
--   · fn_phien_kho_sua_cau — sửa noi_dung · lua_chon · dap_an · loi_giai (trigger _trg_log_kho_sua giữ bản cũ).
--   · fn_phien_kho_anh     — gắn URL ảnh (đã upload bucket kho-anh bằng ban-do.mjs) vào anh_de / anh_dap_an.
--   · fn_phien_kho_rac     — đưa câu vào kho rác (xoa_at, qua đúng fn_kho_tu_choi_cau màn kho đang dùng; khôi phục được).
-- MẤT GÌ: không xoá/drop gì. Thêm 5 hàm.
-- ============================================================================

-- Tìm câu trong kho của phiên: trả (bảng câu, nhánh). Chặn câu khác môn / khác khối / không có.
create or replace function public._phien_kho_cau(p_p claude_phien, p_ma_cau text)
returns table(tbl text, nhanh text) language plpgsql stable security definer set search_path = public as $$
declare r record; v_q jsonb; v_khoi text;
begin
  for r in select * from public._phien_kho_nhanh_ds() loop
    if (r.nhanh = 'khtn') <> (p_p.mon = 'KHTN') then continue; end if;
    execute format('select to_jsonb(q) from %I q where q.ma_cau = $1', r.cau) into v_q using p_ma_cau;
    if v_q is not null then
      execute format('select khoi from %I where ma_dang = $1', r.ban_do_cu) into v_khoi using v_q->>'dang_chinh';
      if v_khoi is distinct from p_p.khoi then
        raise exception 'Câu % thuộc khối %, ngoài phạm vi phiên (khối %).', p_ma_cau, coalesce(v_khoi, '?'), p_p.khoi;
      end if;
      tbl := r.cau; nhanh := r.nhanh; return next; return;
    end if;
  end loop;
  raise exception 'Không có câu % trong kho % của phiên.', p_ma_cau, p_p.mon;
end $$;

-- Duyệt / bỏ duyệt. p_ts: {"ma_cau":[...]} | {"dang_bai_id":".."} | {"nhom_id":".."}, "duyet": true|false (mặc định true)
create or replace function public.fn_phien_kho_duyet(p_phien uuid, p_ts jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_p claude_phien; v_ma text[]; m text; c record; v_duyet boolean := coalesce((p_ts->>'duyet')::boolean, true);
        v_ok int := 0; v_loi int := 0; v_kq jsonb := '[]'::jsonb; b text; v_gan text[]; v_tmp text[];
begin
  v_p := public._phien_kho_vao(p_phien);
  select bang into b from public._phien_bdm_bang(v_p.mon);
  v_gan := case when v_p.mon = 'KHTN' then array['khtn_bdm_gan_cau'] else array['dai_bdm_gan_cau', 'hgt_bdm_gan_cau'] end;
  if jsonb_typeof(p_ts->'ma_cau') = 'array' then
    v_ma := array(select jsonb_array_elements_text(p_ts->'ma_cau'));
  elsif p_ts ? 'dang_bai_id' or p_ts ? 'nhom_id' then
    if p_ts ? 'dang_bai_id' then perform public._phien_bd_kiem_khoi(b, 'dang_bai', p_ts->>'dang_bai_id', v_p.khoi);
    else perform public._phien_bd_kiem_khoi(b, 'nhom', p_ts->>'nhom_id', v_p.khoi); end if;
    v_ma := '{}';
    foreach m in array v_gan loop
      execute format($q$select coalesce(array_agg(g.ma_cau), '{}') from %I g join %I d on d.id = g.dang_bai_id
                        where ($1::text is not null and d.id = $1) or ($2::text is not null and d.nhom_id = $2)$q$, m, b || 'dang_bai')
        into v_tmp using p_ts->>'dang_bai_id', p_ts->>'nhom_id';
      v_ma := v_ma || v_tmp;
    end loop;
  else
    raise exception 'Cần {"ma_cau":[...]} hoặc {"dang_bai_id":".."} hoặc {"nhom_id":".."}.';
  end if;
  if cardinality(v_ma) = 0 then return jsonb_build_object('ok', 0, 'loi', 0, 'ghi_chu', 'Không có câu nào.'); end if;
  if cardinality(v_ma) > 1000 then raise exception 'Mỗi lần tối đa 1000 câu (đang %).', cardinality(v_ma); end if;
  foreach m in array v_ma loop
    begin
      select * into c from public._phien_kho_cau(v_p, m);
      -- bản sao đi theo câu gốc (cùng như màn duyệt: duyệt gốc ⇒ duyệt bản sao)
      execute format($q$update %I set da_duyet = $2, duyet_boi = case when $2 then public.current_nhan_su_id() end,
                          duyet_at = case when $2 then now() end, duyet_nguon = case when $2 then 'nguoi' end
                        where (ma_cau = $1 or parent_ma_cau = $1) and xoa_at is null and da_duyet is distinct from $2$q$, c.tbl) using m, v_duyet;   -- câu đã đúng trạng thái: giữ người duyệt cũ
      v_ok := v_ok + 1;
    exception when others then
      v_loi := v_loi + 1; v_kq := v_kq || jsonb_build_array(jsonb_build_object('ma_cau', m, 'loi', sqlerrm));
    end;
  end loop;
  insert into claude_phien_ghi (phien_id, viec, tham_so, ket_qua)
  values (p_phien, case when v_duyet then 'duyet_cau' else 'bo_duyet_cau' end, p_ts, jsonb_build_object('ok', v_ok, 'loi', v_loi, 'chi_tiet', v_kq));
  return jsonb_build_object('ok', v_ok, 'loi', v_loi, 'chi_tiet', v_kq);
end $$;

-- Sửa nội dung câu. p_ds: [{"ma_cau":..,"noi_dung"?:..,"lua_chon"?:[..],"dap_an"?:..,"loi_giai"?:..}]
create or replace function public.fn_phien_kho_sua_cau(p_phien uuid, p_ds jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_p claude_phien; x jsonb; c record; v_set text[]; v_ok int := 0; v_loi int := 0; v_kq jsonb := '[]'::jsonb;
begin
  v_p := public._phien_kho_vao(p_phien);
  if jsonb_typeof(p_ds) <> 'array' or jsonb_array_length(p_ds) = 0 then raise exception 'Cần một mảng câu.'; end if;
  if jsonb_array_length(p_ds) > 50 then raise exception 'Mỗi lô tối đa 50 câu.'; end if;
  for x in select * from jsonb_array_elements(p_ds) loop
    begin
      select * into c from public._phien_kho_cau(v_p, x->>'ma_cau');
      v_set := '{}';
      if x ? 'noi_dung' then
        if nullif(btrim(coalesce(x->>'noi_dung', '')), '') is null then raise exception 'Đề không được trống.'; end if;
        v_set := v_set || format('noi_dung = %L', x->>'noi_dung');
      end if;
      if x ? 'lua_chon' then v_set := v_set || format('lua_chon = %L::jsonb', (x->'lua_chon')::text); end if;
      if x ? 'dap_an' then v_set := v_set || format('dap_an = %L', nullif(btrim(coalesce(x->>'dap_an', '')), '')); end if;
      if x ? 'loi_giai' then v_set := v_set || format('loi_giai = %L', nullif(btrim(coalesce(x->>'loi_giai', '')), '')); end if;
      if cardinality(v_set) = 0 then raise exception 'Không có gì để sửa (noi_dung · lua_chon · dap_an · loi_giai).'; end if;
      execute format('update %I set %s where ma_cau = $1', c.tbl, array_to_string(v_set, ', ')) using x->>'ma_cau';
      v_ok := v_ok + 1;
    exception when others then
      v_loi := v_loi + 1; v_kq := v_kq || jsonb_build_array(jsonb_build_object('ma_cau', x->>'ma_cau', 'loi', sqlerrm));
    end;
  end loop;
  insert into claude_phien_ghi (phien_id, viec, tham_so, ket_qua)
  values (p_phien, 'sua_cau', jsonb_build_object('so_cau', jsonb_array_length(p_ds), 'ma_cau', (select jsonb_agg(e->'ma_cau') from jsonb_array_elements(p_ds) e)),
          jsonb_build_object('ok', v_ok, 'loi', v_loi, 'chi_tiet', v_kq));
  return jsonb_build_object('ok', v_ok, 'loi', v_loi, 'chi_tiet', v_kq);
end $$;

-- Gắn ảnh (URL đã upload). p_o: 'de' | 'dap_an' | 'ca_hai'
create or replace function public.fn_phien_kho_anh(p_phien uuid, p_ma_cau text, p_url text, p_o text default 'ca_hai')
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_p claude_phien; c record;
begin
  v_p := public._phien_kho_vao(p_phien);
  if coalesce(p_o, '') not in ('de', 'dap_an', 'ca_hai') then raise exception 'o phải là de · dap_an · ca_hai.'; end if;
  if p_url !~ '^https://[^ ]+/storage/v1/object/public/kho-anh/' then raise exception 'URL ảnh phải nằm ở bucket kho-anh.'; end if;
  select * into c from public._phien_kho_cau(v_p, p_ma_cau);
  execute format('update %I set %s where ma_cau = $1', c.tbl,
                 case p_o when 'de' then 'anh_de = $2' when 'dap_an' then 'anh_dap_an = $2' else 'anh_de = $2, anh_dap_an = $2' end)
    using p_ma_cau, p_url;
  insert into claude_phien_ghi (phien_id, viec, tham_so, ket_qua)
  values (p_phien, 'gan_anh', jsonb_build_object('ma_cau', p_ma_cau, 'o', p_o), jsonb_build_object('url', p_url));
  return jsonb_build_object('ok', true, 'ma_cau', p_ma_cau, 'o', p_o, 'url', p_url);
end $$;

-- Đưa câu vào kho rác (khôi phục được ở màn kho). p_ds: [{"ma_cau":..,"ly_do":..}]
create or replace function public.fn_phien_kho_rac(p_phien uuid, p_ds jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_p claude_phien; x jsonb; c record; v_ok int := 0; v_loi int := 0; v_kq jsonb := '[]'::jsonb;
begin
  v_p := public._phien_kho_vao(p_phien);
  if jsonb_typeof(p_ds) <> 'array' or jsonb_array_length(p_ds) = 0 then raise exception 'Cần một mảng câu.'; end if;
  if jsonb_array_length(p_ds) > 50 then raise exception 'Mỗi lô tối đa 50 câu.'; end if;
  for x in select * from jsonb_array_elements(p_ds) loop
    begin
      select * into c from public._phien_kho_cau(v_p, x->>'ma_cau');
      if nullif(btrim(coalesce(x->>'ly_do', '')), '') is null then raise exception 'Cần lý do.'; end if;
      perform public.fn_kho_tu_choi_cau(case c.nhanh when 'dai' then 'toan' else c.nhanh end, x->>'ma_cau', public.current_nhan_su_id(), btrim(x->>'ly_do'));
      v_ok := v_ok + 1;
    exception when others then
      v_loi := v_loi + 1; v_kq := v_kq || jsonb_build_array(jsonb_build_object('ma_cau', x->>'ma_cau', 'loi', sqlerrm));
    end;
  end loop;
  insert into claude_phien_ghi (phien_id, viec, tham_so, ket_qua)
  values (p_phien, 'kho_rac', p_ds, jsonb_build_object('ok', v_ok, 'loi', v_loi, 'chi_tiet', v_kq));
  return jsonb_build_object('ok', v_ok, 'loi', v_loi, 'chi_tiet', v_kq);
end $$;

revoke execute on function public._phien_kho_cau(claude_phien, text), public.fn_phien_kho_duyet(uuid, jsonb),
  public.fn_phien_kho_sua_cau(uuid, jsonb), public.fn_phien_kho_anh(uuid, text, text, text), public.fn_phien_kho_rac(uuid, jsonb)
  from public, anon, authenticated;
grant execute on function public.fn_phien_kho_duyet(uuid, jsonb), public.fn_phien_kho_sua_cau(uuid, jsonb),
  public.fn_phien_kho_anh(uuid, text, text, text), public.fn_phien_kho_rac(uuid, jsonb) to service_role;
