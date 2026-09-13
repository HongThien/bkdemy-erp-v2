-- ============================================================================
-- 202609122228 — fn_kho_duyet_menh_de_reset_co_skip_sync
-- ----------------------------------------------------------------------------
-- VÌ SAO: set_config('kho.skip_sync_menh_de','1', is_local=true) sống tới HẾT TRANSACTION,
--   không phải hết function. Smoke test 12/09 lộ: sau khi RPC duyệt mệnh đề chạy, mọi UPDATE
--   jsonb menh_de kế tiếp trong CÙNG tx bị trigger _sync_cau_menh_de bỏ qua (da_duyet không
--   reset khi đổi nội dung). Qua PostgREST mỗi RPC = 1 tx nên chưa cắn thật, nhưng
--   fn_kho_duyet_cau_ds gọi RPC này trong vòng lặp rồi gọi tiếp — cờ treo là bẫy chờ nổ.
--   Fix: cuối RPC đặt lại cờ '0'. Cờ = phạm vi "đoạn ghi đôi" đúng nghĩa, không rộng hơn.
-- MẤT GÌ: không. Thay body 1 function (giữ nguyên phần còn lại của mig 202609122224).
-- ============================================================================
create or replace function fn_kho_duyet_menh_de(p_mon text, p_ma_cau text, p_thu_tu integer, p_nguoi uuid, p_sua jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  t text := public.fn_kho_tbl(p_mon); v_cau text; v_ban_do text; v_con text;
  r record; k record; e jsonb;
  v_dang text; v_nd text; v_dung boolean; v_lg text; v_id uuid; v_ten_dang text; v_ten_cd text;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if t is null then raise exception 'fn_kho_duyet_menh_de: môn không hợp lệ %', p_mon; end if;
  if p_nguoi is null then raise exception 'Thiếu người duyệt'; end if;
  v_cau := t || '_cau_hoi'; v_ban_do := t || '_ban_do'; v_con := t || '_cau_menh_de';
  if to_regclass(v_con) is null then raise exception 'Nhánh % chưa hỗ trợ duyệt Đúng/Sai theo mệnh đề', p_mon; end if;

  execute format('select * from %I where ma_cau = $1 and xoa_at is null for update', v_cau) into r using p_ma_cau;
  if r.ma_cau is null then raise exception 'Câu % không tồn tại hoặc đã vào kho rác', p_ma_cau; end if;
  if r.loai_cau <> 'dung_sai' then raise exception 'Câu % không phải Đúng/Sai', p_ma_cau; end if;
  if r.menh_de is null or jsonb_typeof(r.menh_de) <> 'array' or p_thu_tu < 1 or p_thu_tu > jsonb_array_length(r.menh_de) then
    raise exception 'Câu % không có mệnh đề thứ %', p_ma_cau, p_thu_tu;
  end if;
  e := r.menh_de -> (p_thu_tu - 1);

  execute format('select * from %I where ma_cau_cha = $1 and thu_tu = $2', v_con) into k using p_ma_cau, p_thu_tu;

  v_dang := coalesce(nullif(trim(p_sua->>'dang_chinh'), ''), k.dang_chinh, e->>'ma_dang');
  if v_dang is null then raise exception 'Mệnh đề % chưa có dạng — chọn dạng trước khi duyệt', p_thu_tu; end if;
  execute format('select ten_dang, ten_chuyen_de from %I where ma_dang = $1', v_ban_do) into v_ten_dang, v_ten_cd using v_dang;
  if v_ten_dang is null then raise exception 'Dạng % không có trong bản đồ % — chọn dạng khác', v_dang, v_ban_do; end if;

  v_nd   := case when p_sua ? 'noi_dung' then nullif(trim(p_sua->>'noi_dung'), '') else coalesce(k.noi_dung, e->>'noi_dung') end;
  if v_nd is null then raise exception 'Nội dung mệnh đề không được trống'; end if;
  v_dung := case when p_sua ? 'dung' then (p_sua->>'dung')::boolean else coalesce(k.dung, coalesce(e->>'dap_an','S') = 'D') end;
  v_lg   := case when p_sua ? 'loi_giai' then nullif(trim(p_sua->>'loi_giai'), '') else coalesce(k.loi_giai, e->>'loi_giai') end;

  -- Đoạn ghi đôi (bảng con + jsonb cha): tắt trigger sync CHỈ trong đoạn này.
  perform set_config('kho.skip_sync_menh_de', '1', true);
  execute format($q$
    insert into %I (ma_cau_cha, thu_tu, dang_chinh, dang_ai_de_xuat, noi_dung, dung, loi_giai,
                    da_duyet, duyet_boi, duyet_at, duyet_nguon, kiem_may, kiem_may_at, xoa_at)
    values ($1, $2, $3, $4, $5, $6, $7, true, $8, now(), 'nguoi', 'khop', now(), null)
    on conflict (ma_cau_cha, thu_tu) do update set
      dang_chinh = excluded.dang_chinh, noi_dung = excluded.noi_dung, dung = excluded.dung, loi_giai = excluded.loi_giai,
      da_duyet = true, duyet_boi = excluded.duyet_boi, duyet_at = now(), duyet_nguon = 'nguoi',
      kiem_may = 'khop', kiem_may_at = now(), xoa_at = null
    returning id$q$, v_con)
    into v_id using p_ma_cau, p_thu_tu, v_dang, coalesce(k.dang_ai_de_xuat, e->>'ma_dang'), v_nd, v_dung, v_lg, p_nguoi;

  execute format($q$update %I set menh_de = jsonb_set(menh_de, array[$2::text], $3::jsonb, false) where ma_cau = $1$q$, v_cau)
    using p_ma_cau, (p_thu_tu - 1),
          jsonb_build_object('noi_dung', v_nd, 'dap_an', case when v_dung then 'D' else 'S' end, 'ma_dang', v_dang, 'loi_giai', v_lg);
  perform set_config('kho.skip_sync_menh_de', '0', true);

  return jsonb_build_object('id', v_id, 'thu_tu', p_thu_tu, 'dang_chinh', v_dang, 'ten_dang', v_ten_dang, 'ten_chuyen_de', v_ten_cd,
                            'noi_dung', v_nd, 'dung', v_dung, 'loi_giai', v_lg, 'da_duyet', true, 'duyet_at', now(),
                            'dang_ai_de_xuat', coalesce(k.dang_ai_de_xuat, e->>'ma_dang'));
end $$;
grant execute on function public.fn_kho_duyet_menh_de(text, text, integer, uuid, jsonb) to authenticated;
