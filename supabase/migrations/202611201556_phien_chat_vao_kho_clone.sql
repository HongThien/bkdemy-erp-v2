-- Phiên Claude › giải bài từ ảnh: nút "Vào kho" / "Clone → Duyệt" NGAY TRONG khung chat (Thùy 20/11, spec-quan-ly-chat-luong §6.5).
-- Người mở phiên bấm nút = người duyệt. Tái dùng đúng đường của Claude (fn_phien_kho_them / fn_phien_kho_duyet) nên mọi rào cũ giữ nguyên:
-- câu đúng môn + khối, dedupe theo nội dung, dạng thuộc bản đồ khối, mức "cao" mới xếp dạng, "vừa" thì vào hàng chờ duyệt.

-- Loại giai_bai cũng là "nhãn việc" như ba loại kia (spec §6.2): đủ quyền bản đồ + kho trong khối của mình.
create or replace function public._phien_loai_sua_ban_do() returns text[]
  language sql immutable as $$ select array['ban_do', 'ly_thuyet', 'nhap_kho', 'giai_bai'] $$;

-- p_ds: mảng ≤ 20 phần tử, mỗi phần tử = một câu như fn_phien_kho_them (loai_cau · noi_dung · lua_chon · dap_an · loi_giai · phan{ket_qua,dang_bai_id,ly_do} …)
--   + "parent_ma_cau" (CLONE: câu gốc đã nằm trong kho; bản sao không tự xếp dạng, đi theo gốc)
-- p_duyet: true ⇒ câu xếp dạng mức "cao" (và mọi bản clone) được duyệt luôn; câu mức "vừa"/chờ ở lại hàng duyệt.
create or replace function public.fn_phien_chat_vao_kho(p_phien uuid, p_ds jsonb, p_duyet boolean default false)
 returns jsonb language plpgsql security definer set search_path to 'public' as $function$
declare
  v_p claude_phien; v_tbl text; x jsonb; v_in jsonb; v_r jsonb; v_ct jsonb; v_kq jsonb := '[]'::jsonb;
  v_duyet text[]; v_ma text; v_cha text; v_dk jsonb; i int := 0; v_nh text;
begin
  select * into v_p from claude_phien where id = p_phien;
  if not found or v_p.nguoi_mo is distinct from public.jwt_uid() then
    raise exception 'Chỉ người mở phiên này bấm được "Vào kho".';
  end if;
  if v_p.trang_thai <> 'mo' then raise exception 'Phiên đã đóng — mở lại phiên rồi bấm.'; end if;
  if not public._truong_khoi_tro_len(v_p.mon, v_p.khoi) then
    raise exception 'Bạn không còn là trưởng khối trở lên của % khối %.', v_p.mon, v_p.khoi;
  end if;
  if jsonb_typeof(p_ds) <> 'array' or jsonb_array_length(p_ds) = 0 then raise exception 'Chưa có câu nào để đưa vào kho.'; end if;
  if jsonb_array_length(p_ds) > 20 then raise exception 'Mỗi lần tối đa 20 câu.'; end if;

  v_duyet := '{}';
  for x in select * from jsonb_array_elements(p_ds) loop
    i := i + 1;
    v_cha := nullif(trim(x->>'parent_ma_cau'), '');
    v_nh := coalesce(nullif(x->>'nhanh', ''), case when v_p.mon = 'KHTN' then 'khtn' when v_p.mon = 'Vật lý' then 'vatly' when v_p.mon = 'Hóa học' then 'hoahoc' else 'dai' end);
    v_tbl := v_nh || '_cau_hoi';
    -- Clone: bỏ "phan" (bản sao đi theo gốc), kiểm gốc tồn tại, đúng khối, chưa xoá, không phải bản sao.
    v_in := case when v_cha is not null then x - 'phan' - 'parent_ma_cau' else x - 'parent_ma_cau' end;
    if v_cha is not null then
      begin
        execute format('select jsonb_build_object(''ok'', true) from %I where ma_cau = $1 and xoa_at is null and parent_ma_cau is null', v_tbl) into v_dk using v_cha;
        if v_dk is null then raise exception 'Câu gốc % không có trong kho (hoặc đã vào kho rác / là bản sao).', v_cha; end if;
        if coalesce(x->>'loai_cau', '') = 'dung_sai' then raise exception 'Câu Đúng/Sai không clone được.'; end if;
        if coalesce(x->>'anh_de', '') <> '' then raise exception 'Câu có hình đề không clone (hình lệch số).'; end if;
      exception when others then
        v_kq := v_kq || jsonb_build_array(jsonb_build_object('i', i, 'ok', false, 'loi', sqlerrm)); continue;
      end;
    end if;

    v_r := public.fn_phien_kho_them(p_phien, jsonb_build_array(v_in));
    v_ct := v_r->'chi_tiet'->0;
    if coalesce((v_ct->>'ok')::boolean, false) is not true then
      v_kq := v_kq || jsonb_build_array(jsonb_build_object('i', i, 'ok', false, 'loi', coalesce(v_ct->>'loi', 'Không ghi được.'))); continue;
    end if;
    v_ma := v_ct->>'ma_cau';
    if v_cha is not null and coalesce((v_ct->>'trung')::boolean, false) is not true then
      execute format('update %I set parent_ma_cau = $2, clone_method = ''claude_phien'', nguon = ''clone'', giai_method = ''claude_code'' where ma_cau = $1', v_tbl) using v_ma, v_cha;
    end if;
    -- Duyệt: clone (người đã xem biến thể) hoặc câu gốc đã xếp dạng mức "cao". Câu "vừa"/chờ dạng: ở lại hàng duyệt.
    if p_duyet and (v_cha is not null or coalesce(x->'phan'->>'ket_qua', '') = 'cao') then
      v_duyet := v_duyet || v_ma;
    end if;
    v_kq := v_kq || jsonb_build_array(jsonb_build_object('i', i, 'ok', true, 'ma_cau', v_ma, 'trung', coalesce((v_ct->>'trung')::boolean, false),
                                                         'phan', v_ct->'phan', 'clone_cua', v_cha));
  end loop;

  if cardinality(v_duyet) > 0 then
    v_r := public.fn_phien_kho_duyet(p_phien, jsonb_build_object('ma_cau', to_jsonb(v_duyet)));
    return jsonb_build_object('ket_qua', v_kq, 'duyet', v_r);
  end if;
  return jsonb_build_object('ket_qua', v_kq, 'duyet', null);
end $function$;
revoke all on function public.fn_phien_chat_vao_kho(uuid, jsonb, boolean) from public, anon;
grant execute on function public.fn_phien_chat_vao_kho(uuid, jsonb, boolean) to authenticated, service_role;
