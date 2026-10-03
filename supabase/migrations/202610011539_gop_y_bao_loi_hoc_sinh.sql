-- ============================================================================
-- GÓP Ý / BÁO LỖI CỦA HỌC SINH (spec-v1-app-hs.md §6, Thùy 01/10)
-- Dùng lại bảng bao_loi của nhân sự (cùng màn duyệt BaoLoiScreen, cùng 7 trạng thái, cùng trigger ghi vết):
--   loai 'bug' = "Báo lỗi" · 'yeu_cau' = "Góp ý tưởng" · hoc_sinh_id NOT NULL ⇒ báo từ học sinh (NULL = "không áp dụng": báo của nhân sự).
-- HS KHÔNG ghi thẳng bảng (RLS chỉ thành viên) — chỉ qua RPC security definer: giới hạn 5 gửi/em/ngày (giờ VN), độ dài, ảnh chỉ từ kho-anh/report.
-- HS xem lại góp ý của mình + lời trả lời (fn_hs_gop_y_cua_toi). Nhân sự trả lời (fn_bao_loi_tra_loi) ⇒ tự đẩy 1 thư vào Hòm thư của em.
-- ============================================================================

alter table public.bao_loi add column if not exists hoc_sinh_id uuid references public.hoc_sinh(id);
alter table public.bao_loi add column if not exists tra_loi text;
alter table public.bao_loi add column if not exists tra_loi_at timestamptz;
alter table public.bao_loi add column if not exists tra_loi_boi uuid;
alter table public.bao_loi add column if not exists tra_loi_doc_at timestamptz;   -- em đã đọc lời trả lời lúc nào (null/cũ hơn tra_loi_at = chưa đọc)
create index if not exists bao_loi_hoc_sinh_idx on public.bao_loi (hoc_sinh_id, created_at desc) where hoc_sinh_id is not null;

-- ── HS gửi ──
create or replace function public.fn_hs_gui_gop_y(p_loai text, p_mo_ta text, p_route text default null, p_context jsonb default null, p_anh_url text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_mo_ta text := btrim(coalesce(p_mo_ta, ''));
  v_ngay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_da int; v_id uuid; v_hoten text; v_ma text; v_khoi text; v_ctx jsonb;
  v_toi_da constant int := 5;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  if p_loai not in ('bug', 'yeu_cau') then raise exception 'Loại góp ý không hợp lệ.'; end if;
  if length(v_mo_ta) < 10 then raise exception 'Em mô tả kỹ hơn một chút nhé (ít nhất 10 chữ).'; end if;
  if length(v_mo_ta) > 1500 then raise exception 'Mô tả dài quá (tối đa 1500 chữ).'; end if;
  if p_anh_url is not null and p_anh_url not like '%/storage/v1/object/public/kho-anh/report/%' then
    raise exception 'Ảnh đính kèm không hợp lệ.';
  end if;
  if p_context is not null and length(p_context::text) > 4000 then p_context := null; end if;

  select count(*) into v_da from bao_loi
    where hoc_sinh_id = v_hs and (created_at at time zone 'Asia/Ho_Chi_Minh')::date = v_ngay;
  if v_da >= v_toi_da then raise exception 'Hôm nay em đã gửi % góp ý rồi, mai gửi tiếp nhé!', v_toi_da; end if;

  select h.ho_ten, h.ma_hs, h.khoi into v_hoten, v_ma, v_khoi from hoc_sinh h where h.id = v_hs;
  v_ctx := coalesce(p_context, '{}'::jsonb) || jsonb_build_object('nguon', 'hoc_sinh', 'ho_ten', v_hoten, 'ma_hs', v_ma, 'khoi', v_khoi);

  insert into bao_loi (mo_ta, route, context, anh_url, loai, hoc_sinh_id, created_by)
  values (v_mo_ta, left(p_route, 300), v_ctx, p_anh_url, p_loai, v_hs, public.jwt_uid())
  returning id into v_id;
  return jsonb_build_object('id', v_id, 'con_lai_hom_nay', v_toi_da - v_da - 1);
end $$;

-- ── HS xem lại góp ý của mình ──
create or replace function public.fn_hs_gop_y_cua_toi()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_hs uuid := public.my_hoc_sinh_id();
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', b.id, 'loai', b.loai, 'mo_ta', b.mo_ta, 'anh_url', b.anh_url, 'at', b.created_at,
      -- trạng thái nói với em bằng lời dễ hiểu (không lộ quy trình nội bộ)
      'trang_thai', case b.trang_thai
        when 'moi' then 'da_nhan'
        when 'cho_fix' then 'dang_xem' when 'tu_lam' then 'dang_xem' when 'tra_lai' then 'dang_xem'
        when 'da_fix' then 'da_xu_ly' when 'xong' then 'da_xu_ly'
        when 'tu_choi' then 'chua_lam_duoc' end,
      'tra_loi', b.tra_loi, 'tra_loi_at', b.tra_loi_at,
      'tra_loi_moi', (b.tra_loi_at is not null and (b.tra_loi_doc_at is null or b.tra_loi_doc_at < b.tra_loi_at))) order by b.created_at desc)
    from (select * from bao_loi where hoc_sinh_id = v_hs order by created_at desc limit 30) b
  ), '[]'::jsonb);
end $$;

-- ── HS đọc lời trả lời (tắt dấu "mới") + đếm cho chấm đỏ ──
create or replace function public.fn_hs_gop_y_da_doc()
returns void language plpgsql security definer set search_path = public as $$
begin
  update bao_loi set tra_loi_doc_at = now()
   where hoc_sinh_id = public.my_hoc_sinh_id() and tra_loi_at is not null and (tra_loi_doc_at is null or tra_loi_doc_at < tra_loi_at);
end $$;

create or replace function public.fn_hs_gop_y_chua_doc()
returns integer language sql stable security definer set search_path = public as $$
  select count(*)::int from bao_loi
   where hoc_sinh_id = public.my_hoc_sinh_id() and tra_loi_at is not null and (tra_loi_doc_at is null or tra_loi_doc_at < tra_loi_at)
$$;

-- ── Nhân sự trả lời ⇒ em thấy ở "Góp ý của em" (+ thư vào Hòm thư nếu role migrate được cấp quyền ghi thong_bao_hs) ──
create or replace function public.fn_bao_loi_tra_loi(p_id uuid, p_noi_dung text)
returns void language plpgsql security definer set search_path = public as $$
declare v_hs uuid; v_nd text := btrim(coalesce(p_noi_dung, ''));
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự được trả lời góp ý.'; end if;
  if length(v_nd) < 2 or length(v_nd) > 600 then raise exception 'Lời trả lời 2–600 chữ.'; end if;
  update bao_loi set tra_loi = v_nd, tra_loi_at = now(), tra_loi_boi = public.jwt_uid() where id = p_id returning hoc_sinh_id into v_hs;
  if not found then raise exception 'Không thấy góp ý này.'; end if;
  if v_hs is not null then
    -- thong_bao_hs thuộc role postgres (tạo tay): hàm này chạy dưới role migrate nên có thể chưa được ghi ⇒ bỏ qua êm, KHÔNG làm hỏng việc trả lời.
    begin
      insert into thong_bao_hs (hoc_sinh_id, mon, noi_dung)
      values (v_hs, 'Góp ý', 'Thầy cô đã trả lời góp ý của em: ' || v_nd);
    exception when insufficient_privilege then null;
    end;
  end if;
end $$;

-- ── Quyền ──
revoke all on function public.fn_hs_gui_gop_y(text, text, text, jsonb, text) from public, anon;
grant execute on function public.fn_hs_gui_gop_y(text, text, text, jsonb, text) to authenticated;
revoke all on function public.fn_hs_gop_y_cua_toi() from public, anon;
grant execute on function public.fn_hs_gop_y_cua_toi() to authenticated;
revoke all on function public.fn_hs_gop_y_da_doc() from public, anon;
grant execute on function public.fn_hs_gop_y_da_doc() to authenticated;
revoke all on function public.fn_hs_gop_y_chua_doc() from public, anon;
grant execute on function public.fn_hs_gop_y_chua_doc() to authenticated;
revoke all on function public.fn_bao_loi_tra_loi(uuid, text) from public, anon;
grant execute on function public.fn_bao_loi_tra_loi(uuid, text) to authenticated;
