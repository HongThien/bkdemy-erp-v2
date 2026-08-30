-- ============================================================================
-- 202608310020 — SIẾT QUYỀN luồng nộp BTVN (audit bảo mật 30/08 đêm, CEO yêu cầu)
-- ----------------------------------------------------------------------------
-- ① Supabase auto-grant object mới trong public cho anon/authenticated (default
--    privileges) — `revoke from public` ở 202608302120 KHÔNG đủ. View v_btvn_* chạy
--    quyền OWNER (bypass RLS) → anon key/tài khoản HS đọc được đáp án + ảnh + trạng
--    thái của MỌI HS qua PostgREST. → REVOKE tường minh anon + authenticated.
-- ② fn nộp (security definer) cùng nguy cơ auto-grant → revoke tường minh.
-- ③ Trần TỔNG ảnh/lượt nộp (30) — mỗi lần ≤12 nhưng nộp bổ sung vô hạn thì spam
--    đầy bucket + ngập màn chấm.
-- (Storage policy bucket btvn-nop siết la_thanh_vien nằm ở scripts/sql_appta_role_bucket.sql
--  — schema storage không áp được từ claude_build.)
-- MẤT GÌ (Luật xoá): không mất data — chỉ revoke grant + thêm guard trong fn.
-- ============================================================================

-- ① view FDW: chỉ fdw_bkdemy_web (+ owner) được đọc
revoke all on public.v_btvn_nop_ph, public.v_btvn_tra_anh, public.v_btvn_tra_ket_qua,
  public.v_btvn_tra_cau, public.v_btvn_dap_an from anon, authenticated;

-- ② fn nộp: chỉ ph_nop
revoke execute on function public.fn_btvn_nop_tao(uuid, uuid, text[]) from anon, authenticated;
revoke execute on function public.fn_btvn_nop_tao_auto(uuid, text[]) from anon, authenticated;

-- ③ fn_btvn_nop_tao v2: thêm trần TỔNG 30 ảnh/lượt (phần còn lại nguyên văn 202608302120)
create or replace function public.fn_btvn_nop_tao(p_hoc_sinh_id uuid, p_buoi_hoc_id uuid, p_paths text[])
returns jsonb language plpgsql security definer set search_path = public as $$
declare b record; v_max integer; v_new boolean := false; v_cur integer;
begin
  if p_paths is null or array_length(p_paths, 1) is null then
    raise exception 'Phải có ít nhất 1 ảnh — lượt nộp không ảnh không được tạo (anti-NULL §1.5).';
  end if;
  if array_length(p_paths, 1) > 12 then
    raise exception 'Tối đa 12 ảnh mỗi lần nộp.';
  end if;
  select id, lop_id, trang_thai into b from buoi_hoc where id = p_buoi_hoc_id;
  if b is null then raise exception 'Không thấy buổi %', p_buoi_hoc_id; end if;
  if b.trang_thai = 'huy' then raise exception 'Buổi đã huỷ — không nhận bài.'; end if;
  if not exists (
    select 1 from hoc_sinh_lop hl
    where hl.hoc_sinh_id = p_hoc_sinh_id and hl.lop_id = b.lop_id and hl.trang_thai = 'dang_hoc'
  ) and not exists (
    select 1 from buoi_hoc_hs r where r.buoi_hoc_id = p_buoi_hoc_id and r.hoc_sinh_id = p_hoc_sinh_id
  ) then
    raise exception 'Học sinh không thuộc lớp của buổi này.';
  end if;
  if exists (select 1 from btvn_nop n where n.hoc_sinh_id = p_hoc_sinh_id and n.buoi_hoc_id = p_buoi_hoc_id
             and n.tra_at is not null) then
    raise exception 'Bài đã được trả — không bổ sung ảnh được nữa.';
  end if;
  select count(*) into v_cur from btvn_nop_anh
  where hoc_sinh_id = p_hoc_sinh_id and buoi_hoc_id = p_buoi_hoc_id;
  if v_cur + array_length(p_paths, 1) > 30 then
    raise exception 'Lượt nộp này đã có % ảnh — tổng tối đa 30 ảnh.', v_cur;
  end if;

  insert into btvn_nop (hoc_sinh_id, buoi_hoc_id)
  values (p_hoc_sinh_id, p_buoi_hoc_id)
  on conflict (hoc_sinh_id, buoi_hoc_id) do nothing;
  get diagnostics v_max = row_count; v_new := v_max > 0;

  select coalesce(max(thu_tu), 0) into v_max from btvn_nop_anh
  where hoc_sinh_id = p_hoc_sinh_id and buoi_hoc_id = p_buoi_hoc_id;
  insert into btvn_nop_anh (hoc_sinh_id, buoi_hoc_id, path, thu_tu)
  select p_hoc_sinh_id, p_buoi_hoc_id, u, v_max + ord
  from unnest(p_paths) with ordinality as t(u, ord);

  return jsonb_build_object('moi', v_new, 'so_anh_them', array_length(p_paths, 1));
end $$;
revoke execute on function public.fn_btvn_nop_tao(uuid, uuid, text[]) from public, anon, authenticated;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'ph_nop') then
    grant execute on function public.fn_btvn_nop_tao(uuid, uuid, text[]) to ph_nop;
  end if;
end $$;
