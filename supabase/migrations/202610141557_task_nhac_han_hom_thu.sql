-- ============================================================================
-- 202610141557 — task_nhac_han_hom_thu
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   HANDOFF 14/10 còn treo "nhắc hạn task chưa tự gửi vào hòm thư". Thùy chốt 14/10 (lịch nhắc):
--     ① TRƯỚC hạn 1 ngày  → nhắc NGƯỜI LÀM.
--     ② QUÁ hạn (từ sáng hôm sau ngày hạn) mà task vẫn 'dang_lam' (chưa báo xong) → báo CẢ người làm LẪN người giao,
--        để cấp trên duyệt % / gia hạn / huỷ (luồng fn_task_duyet · fn_task_gia_han · fn_task_huy).
--   Mỗi mốc chỉ gửi MỘT lần cho mỗi hạn: sổ `task_nhac_han` khoá (task, mốc, hạn) — gia hạn ⇒ hạn mới ⇒ mốc tính lại từ đầu.
--   Sổ chỉ ghi dòng khi ĐÃ GỬI THẬT (§1.5: không đẻ dòng chờ). Chạy lại nhiều lần trong ngày vô hại.
--   `_task_nhac_han()` do pg_cron gọi mỗi sáng 8h giờ VN — lịch đặt ở file kế tiếp
--   202610141558_task_nhac_han_cron_sql_editor.sql (cron.schedule cần quyền postgres ⇒ chạy bằng SQL Editor).
--   Ngày "hôm nay" tính theo giờ VN (CLAUDE.md §2 Timezone).
--
--   Kèm DỌN RÁC hệ giao việc CŨ (Thùy gật 14/10): xoá đúng 1 dòng gay_de_xuat còn 'cho' của hệ cũ.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   1 dòng gay_de_xuat id 4b2e19a0-3626-4d1f-b4ac-4a80065699d0 — nguon 'giaoviec', ref_key 'viec:b18ce872-…',
--   mô tả 'Test đầu vào KHTN khối 7', hạn 24/09, trạng thái 'cho' (chưa ai quyết, CHƯA thành gậy — không có ledger_id).
--   Lý do: khoá 'viec:' trỏ vào bảng việc của hệ cũ đã gỡ (mig …0119) ⇒ màn Gậy không còn mở được việc gốc để quyết.
--   Chỉ xoá nếu dòng vẫn đúng như trên (còn 'cho', chưa có ledger) — đã bị quyết rồi thì giữ nguyên.
-- ============================================================================

create table if not exists task_nhac_han (
  task_id uuid not null references task_phat_trien(id) on delete cascade,
  moc text not null check (moc in ('truoc_1_ngay', 'qua_han')),
  han date not null,                 -- hạn của task LÚC gửi; gia hạn ⇒ khoá mới ⇒ được nhắc lại
  gui_at timestamptz not null default now(),
  primary key (task_id, moc, han)
);
comment on table task_nhac_han is
  'Sổ đã gửi nhắc hạn task vào hòm thư (mỗi task × mốc × hạn đúng 1 lần). Chỉ _task_nhac_han() ghi. Mig 202610141557.';
alter table task_nhac_han enable row level security;   -- không policy cho authenticated: chỉ hàm hệ thống đụng tới

create or replace function public._task_nhac_han()
returns integer
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_hom_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  t record;
  v_n integer := 0;
begin
  -- ① Trước hạn 1 ngày → người làm
  for t in
    select tp.id, tp.tieu_de, tp.han, tp.nguoi_lam_id
    from task_phat_trien tp
    where tp.trang_thai = 'dang_lam' and tp.han = v_hom_nay + 1
  loop
    insert into task_nhac_han (task_id, moc, han) values (t.id, 'truoc_1_ngay', t.han) on conflict do nothing;
    if found then
      perform public._hom_thu_gui(t.nguoi_lam_id, 'viec', 'Task tới hạn ngày mai (' || to_char(t.han, 'DD/MM') || ')',
        t.tieu_de || E'\nXong rồi thì bấm Báo xong; cần thêm thời gian thì trao đổi với người giao.', 'giaoviec', null);
      v_n := v_n + 1;
    end if;
  end loop;

  -- ② Quá hạn, vẫn chưa báo xong → người làm + người giao
  for t in
    select tp.id, tp.tieu_de, tp.han, tp.nguoi_lam_id, tp.nguoi_giao_id, nl.ho_ten as ten_lam
    from task_phat_trien tp
    join nhan_su nl on nl.id = tp.nguoi_lam_id
    where tp.trang_thai = 'dang_lam' and tp.han < v_hom_nay
  loop
    insert into task_nhac_han (task_id, moc, han) values (t.id, 'qua_han', t.han) on conflict do nothing;
    if found then
      perform public._hom_thu_gui(t.nguoi_lam_id, 'viec', 'Task đã quá hạn ' || to_char(t.han, 'DD/MM'),
        t.tieu_de || E'\nBáo xong ngay nếu đã làm xong, hoặc trao đổi với người giao để gia hạn.', 'giaoviec', null);
      perform public._hom_thu_gui(t.nguoi_giao_id, 'viec', t.ten_lam || ' có task quá hạn ' || to_char(t.han, 'DD/MM'),
        t.tieu_de || E'\nVào Bảng task để duyệt %, gia hạn hoặc huỷ.', 'giaoviec', null);
      v_n := v_n + 1;
    end if;
  end loop;

  return v_n;   -- số mốc vừa gửi (để xem log cron)
end $function$;

comment on function public._task_nhac_han() is
  'Nhắc hạn task vào hòm thư: trước hạn 1 ngày (người làm) · quá hạn chưa báo xong (người làm + người giao). pg_cron 8h VN. Mig 202610141557.';
revoke execute on function public._task_nhac_han() from public;
revoke execute on function public._task_nhac_han() from anon;
revoke execute on function public._task_nhac_han() from authenticated;
grant execute on function public._task_nhac_han() to postgres;   -- pg_cron chạy job dưới quyền postgres

-- Dọn rác hệ giao việc cũ (xem MẤT GÌ ở đầu file).
delete from gay_de_xuat
where id = '4b2e19a0-3626-4d1f-b4ac-4a80065699d0'
  and ref_key like 'viec:%' and nguon = 'giaoviec' and trang_thai = 'cho' and ledger_id is null;
