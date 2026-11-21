-- ============================================================================
-- 202611210821 — bao_sai_noi_nhan_xet_cho_claude
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Đã có sẵn một luồng "người báo → Claude sửa → ghi đã sửa gì" từ 17/10: ✎ Cần sửa ⇒ kho_nhan_xet / kho_nhan_xet_xu_ly,
--   Claude xử bằng scripts/kho/nhan-xet.mjs (docs/quy-trinh-sua-theo-nhan-xet.md) — chính là "Claude tự xử câu báo sai" (spec-giai-bai §C7,
--   nợ §C10 mục 15). Báo sai của nhân sự (mig 202611210816) KHÔNG dựng luồng thứ hai mà NỐI vào luồng này:
--     • nhân sự báo sai       ⇒ ghi thêm 1 nhận xét 'cau' (khâu suy từ loại lỗi) ⇒ lượt "sửa theo nhận xét" của Claude nhặt được;
--     • Claude xử nhận xét     ⇒ trigger đóng báo cáo tương ứng (da_sua → đã xử lý · khong_sua → không phải lỗi);
--     • trưởng khối sửa / xoá  ⇒ hàm xử lý đóng báo cáo VÀ ghi xử lý cho nhận xét còn mở (boi='nguoi') để Claude không sửa đè.
--   Báo cáo đã đóng mà ghi_spec_at còn NULL = việc chờ AI ghi vào Phần D (scripts/kho/bao-sai.mjs).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Hai hàm fn_kho_bao_sai / fn_kho_bao_sai_xu_ly viết lại (create or replace) từ bản 202611210816 + thêm bước nối nhận xét.
-- ============================================================================

create or replace function public._bao_sai_khau(p_loai text) returns text language sql immutable as $$
  select case p_loai when 'trinh_bay' then 'trinh_bay' when 'tinh_sai' then 'dap_an' when 'sai_de' then 'de' when 'sai_dang' then 'dang' else 'khac' end
$$;

create or replace function public.fn_kho_bao_sai(p_ma_cau text, p_loai text, p_ghi_chu text, p_kho text default null) returns uuid
 language plpgsql security definer set search_path to 'public' as $$
declare v_ns uuid := public.current_nhan_su_id(); v_kho text := coalesce(nullif(p_kho, ''), public._kho_cua_cau(p_ma_cau));
        v_ghi text := nullif(btrim(coalesce(p_ghi_chu, '')), ''); v_id uuid;
begin
  if v_ns is null then raise exception 'Chỉ nhân sự đang làm việc mới báo sai câu trong kho.' using errcode = '42501'; end if;
  if p_loai not in ('trinh_bay','tinh_sai','sai_de','sai_dang','khac') then raise exception 'Loại lỗi không hợp lệ.' using errcode = '22023'; end if;
  if v_ghi is null or length(v_ghi) < 5 then raise exception 'Viết rõ lỗi gì (ít nhất vài chữ) để Claude và trưởng khối xử lý.' using errcode = '22023'; end if;
  if length(v_ghi) > 500 then raise exception 'Ghi chú tối đa 500 chữ.' using errcode = '22023'; end if;
  if v_kho is null or public.fn_kho_tbl(v_kho) is null then raise exception 'Không tìm thấy câu % trong kho.', p_ma_cau using errcode = 'P0002'; end if;
  if public._kho_cua_cau(p_ma_cau) is distinct from v_kho then raise exception 'Câu % không thuộc kho %.', p_ma_cau, v_kho using errcode = 'P0002'; end if;
  insert into public.bai_cau_bao_loi (nhan_su_id, nguon, mon, kho, ma_cau, ly_do, ghi_chu)
  values (v_ns, 'nhan_su', public._kho_mon_label(v_kho), v_kho, p_ma_cau, p_loai, v_ghi)
  on conflict (nhan_su_id, mon, ma_cau, ly_do) where trang_thai = 'moi' and nhan_su_id is not null
    do update set ghi_chu = excluded.ghi_chu
  returning id into v_id;
  -- Nối luồng "Claude sửa theo nhận xét" (kho_nhan_xet): Claude nhặt ở lượt nhan-xet.mjs --ds
  insert into public.kho_nhan_xet (doi_tuong, mon, ma, khau, noi_dung, man)
  values ('cau', v_kho, p_ma_cau, public._bao_sai_khau(p_loai), '[Báo sai · ' || p_loai || '] ' || v_ghi, 'Báo sai câu trong kho');
  return v_id;
end $$;

create or replace function public.fn_kho_bao_sai_xu_ly(p_ma_cau text, p_hanh_dong text, p_ket_qua text,
                                                      p_loai text default null, p_ghi_chu text default null, p_kho text default null) returns jsonb
 language plpgsql security definer set search_path to 'public' as $$
declare v_kho text := coalesce(nullif(p_kho, ''), public._kho_cua_cau(p_ma_cau)); v_mon text; v_ket text := nullif(btrim(coalesce(p_ket_qua, '')), '');
        v_n integer; v_xoa integer := 0; v_co boolean;
begin
  if v_kho is null or public.fn_kho_tbl(v_kho) is null then raise exception 'Không tìm thấy câu % trong kho.', p_ma_cau using errcode = 'P0002'; end if;
  if p_hanh_dong not in ('sua','xoa','khong_loi') then raise exception 'Hành động không hợp lệ.' using errcode = '22023'; end if;
  if v_ket is null or length(v_ket) < 5 then raise exception 'Ghi rõ đã làm gì / vì sao (ít nhất vài chữ).' using errcode = '22023'; end if;
  if not public._kho_la_truong_khoi_cua_cau(v_kho, p_ma_cau) then
    raise exception 'Chỉ trưởng khối đúng khối của câu (hoặc cấp trên) mới sửa / xoá câu.' using errcode = '42501';
  end if;
  v_mon := public._kho_mon_label(v_kho);

  select exists (select 1 from public.bai_cau_bao_loi where mon = v_mon and ma_cau = p_ma_cau and trang_thai = 'moi') into v_co;
  if not v_co then
    if p_loai is null or nullif(btrim(coalesce(p_ghi_chu, '')), '') is null then
      raise exception 'Phải báo lỗi trước: chọn loại lỗi và ghi lỗi gì (câu chưa có báo cáo nào đang mở).' using errcode = '22023';
    end if;
    perform public.fn_kho_bao_sai(p_ma_cau, p_loai, p_ghi_chu, v_kho);
  end if;

  if p_hanh_dong = 'xoa' then
    execute format('update %I set xoa_at = now() where ma_cau = $1 and xoa_at is null', public.fn_kho_tbl(v_kho) || '_cau_hoi') using p_ma_cau;
    get diagnostics v_xoa = row_count;
  end if;

  -- 1) đóng báo cáo (trước, để trigger bên dưới không ghi đè hanh_dong)
  update public.bai_cau_bao_loi
     set trang_thai = case when p_hanh_dong = 'khong_loi' then 'khong_loi' else 'da_xu_ly' end,
         hanh_dong = p_hanh_dong, xu_ly_boi = public.jwt_uid(), xu_ly_at = now(), xu_ly_ghi_chu = v_ket
   where mon = v_mon and ma_cau = p_ma_cau and trang_thai = 'moi';
  get diagnostics v_n = row_count;
  -- 2) nhận xét còn mở của câu ⇒ ghi xử lý bởi người (Claude không sửa đè)
  insert into public.kho_nhan_xet_xu_ly (nhan_xet_id, ket_qua, ghi_chu, boi)
  select n.id, case when p_hanh_dong = 'sua' then 'da_sua' else 'khong_sua' end,
         case p_hanh_dong when 'xoa' then 'Trưởng khối đã xoá câu: ' when 'sua' then 'Trưởng khối đã sửa: ' else 'Trưởng khối xác nhận không phải lỗi: ' end || v_ket, 'nguoi'
    from public.kho_nhan_xet n
   where n.doi_tuong = 'cau' and n.mon = v_kho and n.ma = p_ma_cau
     and not exists (select 1 from public.kho_nhan_xet_xu_ly x where x.nhan_xet_id = n.id);
  return jsonb_build_object('da_dong', v_n, 'da_xoa', v_xoa);
end $$;

-- Claude (hoặc người) xử nhận xét 'cau' ⇒ đóng báo sai của NHÂN SỰ cho câu đó (báo của học sinh không tự đóng).
create or replace function public._bao_sai_dong_theo_nhan_xet() returns trigger
 language plpgsql security definer set search_path to 'public' as $$
declare n public.kho_nhan_xet;
begin
  select * into n from public.kho_nhan_xet where id = new.nhan_xet_id;
  if n.id is null or n.doi_tuong <> 'cau' then return null; end if;
  update public.bai_cau_bao_loi
     set trang_thai = case when new.ket_qua = 'da_sua' then 'da_xu_ly' else 'khong_loi' end,
         hanh_dong = case when new.ket_qua = 'da_sua' then 'sua' else 'khong_loi' end,
         xu_ly_at = new.at,
         xu_ly_ghi_chu = case when new.boi = 'claude' then 'Claude: ' else '' end || coalesce(new.ghi_chu, '')
   where kho = n.mon and ma_cau = n.ma and nguon = 'nhan_su' and trang_thai = 'moi';
  return null;
end $$;
drop trigger if exists trg_bao_sai_dong_theo_nhan_xet on public.kho_nhan_xet_xu_ly;
create trigger trg_bao_sai_dong_theo_nhan_xet after insert on public.kho_nhan_xet_xu_ly for each row execute function public._bao_sai_dong_theo_nhan_xet();

revoke execute on function public._bao_sai_khau(text) from public, anon;
revoke execute on function public._bao_sai_dong_theo_nhan_xet() from public, anon;
revoke execute on function public.fn_kho_bao_sai(text, text, text, text) from public, anon;
revoke execute on function public.fn_kho_bao_sai_xu_ly(text, text, text, text, text, text) from public, anon;
grant execute on function public.fn_kho_bao_sai(text, text, text, text) to authenticated;
grant execute on function public.fn_kho_bao_sai_xu_ly(text, text, text, text, text, text) to authenticated;
