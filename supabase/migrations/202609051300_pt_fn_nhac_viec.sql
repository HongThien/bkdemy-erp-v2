-- ============================================================================
-- 202609051300 — pt_fn_nhac_viec
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Tab "Hôm nay" của app Phát triển (pt) hỏi: "việc nào của tôi ĐANG MỞ mà HÔM NAY
--   chưa ghi tình trạng?". Đây là invariant kiểu R-ET (CLAUDE §4): must-exist = mỗi
--   việc đang làm phải có 1 dòng viec_cap_nhat trong ngày; does-exist = dòng thật.
--   Thiếu ⇒ hiện ở nhóm "chưa cập nhật". Không đẻ row, không cờ. Công thức đặt Ở DB
--   (§2.0): hàm lõi fn_pt_viec_can_cap_nhat(p_ns) + wrapper invoker fn_pt_viec_hom_nay().
--   Push 10:30 là TIN CHUNG cho mọi máy đăng ký (CEO 05/09) — KHÔNG dùng hàm derive này;
--   cron chỉ cần địa chỉ thiết bị, lấy qua security-definer có secret (anon key, KHÔNG
--   service-role — xem migration 202609051259).
--
--   "Đang mở" = trạng thái người làm đang cầm (moi_giao/dang_lam/tra_lai). Loại
--   cho_nghiem_thu (bóng đang ở leader), hold (rút khỏi kỳ), và task MẸ đã có con
--   (đơn vị làm là con — mẹ tự đóng theo con, mig giaoviec_auto_dong_task_me).
--   Ngày = giờ VN (§2 timezone).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Hàm mới hoàn toàn.
-- ============================================================================

-- ── LÕI: việc đang mở của 1 nhân sự + cờ đã-cập-nhật-hôm-nay (derive, không lưu) ──
create or replace function public.fn_pt_viec_can_cap_nhat(p_ns uuid)
returns table (
  id uuid, tieu_de text, trang_thai text, deadline date, task_me_id uuid,
  qua_han boolean, da_cap_nhat_hom_nay boolean,
  cap_nhat_cuoi_at timestamptz, tien_do_bao_cao numeric, so_ngay_im integer
)
language sql stable set search_path = public as $$
  with h as (select (now() at time zone 'Asia/Ho_Chi_Minh')::date as d),
  mo as (
    select v.id, v.tieu_de, v.trang_thai, v.deadline, v.task_me_id, v.created_at
    from viec v
    where v.nguoi_lam_id = p_ns
      and v.trang_thai in ('moi_giao', 'dang_lam', 'tra_lai')
      and not exists (select 1 from viec c where c.task_me_id = v.id)
  ),
  cn as (
    select c.viec_id,
           max(c.created_at) as cuoi,
           bool_or((c.created_at at time zone 'Asia/Ho_Chi_Minh')::date = h.d) as hom_nay
    from viec_cap_nhat c cross join h
    where c.viec_id in (select mo.id from mo)
    group by c.viec_id
  )
  select m.id, m.tieu_de, m.trang_thai, m.deadline, m.task_me_id,
         (m.deadline is not null and m.deadline < h.d)                       as qua_han,
         coalesce(cn.hom_nay, false)                                          as da_cap_nhat_hom_nay,
         cn.cuoi                                                              as cap_nhat_cuoi_at,
         (select c2.tien_do_bao_cao from viec_cap_nhat c2
            where c2.viec_id = m.id order by c2.created_at desc limit 1)      as tien_do_bao_cao,
         (h.d - (coalesce(cn.cuoi, m.created_at) at time zone 'Asia/Ho_Chi_Minh')::date)::integer as so_ngay_im
  from mo m
  cross join h
  left join cn on cn.viec_id = m.id
  order by qua_han desc, m.deadline asc nulls last, m.created_at asc
$$;
revoke all on function public.fn_pt_viec_can_cap_nhat(uuid) from public;
grant execute on function public.fn_pt_viec_can_cap_nhat(uuid) to authenticated;

-- ── APP: việc của TÔI hôm nay (invoker — RLS viec/viec_cap_nhat áp như mọi màn) ──
create or replace function public.fn_pt_viec_hom_nay()
returns table (
  id uuid, tieu_de text, trang_thai text, deadline date, task_me_id uuid,
  qua_han boolean, da_cap_nhat_hom_nay boolean,
  cap_nhat_cuoi_at timestamptz, tien_do_bao_cao numeric, so_ngay_im integer
)
language sql stable set search_path = public as $$
  select * from public.fn_pt_viec_can_cap_nhat(
    (select tk.nhan_su_id from tai_khoan tk where tk.id = jwt_uid())
  )
$$;
revoke all on function public.fn_pt_viec_hom_nay() from public;
grant execute on function public.fn_pt_viec_hom_nay() to authenticated;

-- ── CRON: mọi máy đang đăng ký của nhân sự đang làm (security definer + secret) ──
-- CEO 05/09 chốt: push là TIN CHUNG cho tất cả ("Đến giờ cập nhật Công việc Daily rồi các tình
-- yêu"), KHÔNG cá nhân hoá theo việc. Hàm này vì thế chỉ trả địa chỉ thiết bị; nội dung do
-- api/pt-nhac-viec.mjs đặt. Bỏ máy đã chết (loi_ma = 410) và người đã nghỉ.
create or replace function public.fn_pt_push_danh_sach(p_secret text)
returns table (id uuid, endpoint text, p256dh text, auth text)
language plpgsql stable security definer set search_path = public as $$
begin
  if p_secret is null or p_secret <> (select b.gia_tri from he_thong_bi_mat b where b.khoa = 'push_cron') then
    raise exception 'sai secret' using errcode = '28000';
  end if;
  return query
  select d.id, d.endpoint, d.p256dh, d.auth
  from push_dang_ky d
  join nhan_su ns on ns.id = d.nhan_su_id
  where ns.trang_thai = 'dang_lam'
    and d.loi_ma is distinct from 410
  order by d.created_at;
end $$;
revoke all on function public.fn_pt_push_danh_sach(text) from public;
grant execute on function public.fn_pt_push_danh_sach(text) to anon, authenticated;

-- ── CRON: ghi vết kết quả gửi (ok → gui_ok_at; lỗi → loi_at + loi_ma; 410 = chết) ──
-- p_ket_qua = [{"id": uuid, "ok": bool, "ma": int|null}, ...]
create or replace function public.fn_pt_push_ghi_ket_qua(p_secret text, p_ket_qua jsonb)
returns integer
language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  if p_secret is null or p_secret <> (select b.gia_tri from he_thong_bi_mat b where b.khoa = 'push_cron') then
    raise exception 'sai secret' using errcode = '28000';
  end if;
  with kq as (
    select (e->>'id')::uuid as id, coalesce((e->>'ok')::boolean, false) as ok, (e->>'ma')::integer as ma
    from jsonb_array_elements(coalesce(p_ket_qua, '[]'::jsonb)) e
  )
  update push_dang_ky d set
    gui_ok_at = case when kq.ok then now() else d.gui_ok_at end,
    loi_at    = case when kq.ok then d.loi_at else now() end,
    loi_ma    = case when kq.ok then null else kq.ma end
  from kq where d.id = kq.id;
  get diagnostics n = row_count;
  return n;
end $$;
revoke all on function public.fn_pt_push_ghi_ket_qua(text, jsonb) from public;
grant execute on function public.fn_pt_push_ghi_ket_qua(text, jsonb) to anon, authenticated;
