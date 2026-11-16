-- ============================================================================
-- muc_tieu_tuan_ds_lop — xem mục tiêu tuần của TỪNG em (Thùy 16/11: "muốn xem mục tiêu tuần của từng học sinh thì xem ở đâu")
-- ----------------------------------------------------------------------------
-- VÌ SAO: tab "🎯 Mục tiêu tuần" (Dashboard học tập / Phòng trưởng khối) mới cho mở tờ của em nằm trong "Em cần để ý".
--   Thêm danh sách CẢ LỚP: bấm tên lớp ⇒ mọi em của lớp (tiến độ · ▲/▼ đầu tuần · việc · hạng) ⇒ bấm em ⇒ tờ của em (fn_mtt_hs sẵn có).
-- CÁCH ĐỌC (spec-kien-truc §12 K2/K3): chỉ tốn theo MỘT lớp — đọc bảng đệm mtt_luu (tuần đang chạy) / sổ mtt_chot (tuần đã qua),
--   KHÔNG tính lại tờ. Em chưa có tờ (lớp chưa chốt, hoặc cron chưa kịp) ⇒ co_to = false, mở em thì fn_mtt_hs tính trực tiếp 1 em.
-- MẤT GÌ (Luật xoá): không — thêm 1 hàm đọc.
-- ============================================================================
create or replace function public.fn_mtt_ds_lop(p_lop uuid, p_tuan date default null)
returns jsonb
language plpgsql stable security definer set search_path to 'public' as $$
declare
  v_w date := public._mtt_tuan(public._mtt_hom_nay());
  v_t date := public._mtt_tuan(coalesce(p_tuan, public._mtt_hom_nay()));
  v_mon text;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if not public._mon_duoc_xem((select l.mon from lop l where l.id = p_lop)) then raise exception 'Lớp ngoài quyền môn của bạn.'; end if;   -- cổng quyền môn (mig 202611161701)
  select l.mon into v_mon from lop l where l.id = p_lop;
  if v_mon is null then raise exception 'Không thấy lớp.'; end if;
  return coalesce((
    with em as (
      select h.id, h.ho_ten
        from hoc_sinh_lop hl join hoc_sinh h on h.id = hl.hoc_sinh_id
       where hl.lop_id = p_lop and h.trang_thai = 'dang_hoc'
         and hl.ngay_vao <= v_t + 6 and coalesce(hl.ngay_roi, 'infinity'::date) >= v_t
    ),
    to_ as (   -- tuần đã qua: sổ chốt; tuần đang chạy (hoặc chưa chốt sổ): bảng đệm
      select c.hoc_sinh_id, c.tien_do, c.viec_xong, c.viec_tong, c.viec_den_han, c.hang, c.so_hs, c.payload, true as so_chot
        from mtt_chot c where v_t < v_w and c.tuan = v_t and c.mon = v_mon and c.hoc_sinh_id in (select id from em)
      union all
      select m.hoc_sinh_id, m.tien_do, m.viec_xong, m.viec_tong, m.viec_den_han, m.hang, m.so_hs, m.payload, false
        from mtt_luu m where m.tuan = v_t and m.mon = v_mon and m.hoc_sinh_id in (select id from em)
         and not exists (select 1 from mtt_chot c where v_t < v_w and c.tuan = v_t and c.mon = v_mon and c.hoc_sinh_id = m.hoc_sinh_id)
    )
    select jsonb_agg(jsonb_build_object(
             'id', em.id, 'ten', em.ho_ten, 'co_to', t.hoc_sinh_id is not null,
             'tien_do', t.tien_do, 'tien_do_d', (t.payload->>'tien_do_d')::numeric,
             'viec_xong', t.viec_xong, 'viec_tong', t.viec_tong, 'viec_den_han', t.viec_den_han,
             'hang', t.hang, 'so_hs', t.so_hs,
             'so_nhom', (select count(*) from jsonb_array_elements(t.payload->'nhom') e),
             'so_no', (select count(*) from jsonb_array_elements(t.payload->'nhom') e where (e->>'phan')::int = 2))
           order by t.tien_do desc nulls last, em.ho_ten)
      from em left join to_ t on t.hoc_sinh_id = em.id
  ), '[]'::jsonb);
end $$;
revoke execute on function public.fn_mtt_ds_lop(uuid, date) from public, anon;
grant execute on function public.fn_mtt_ds_lop(uuid, date) to authenticated;
