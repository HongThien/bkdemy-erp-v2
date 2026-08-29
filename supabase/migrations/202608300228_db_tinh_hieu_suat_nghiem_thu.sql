-- ============================================================================
-- 202608300228 — Phase 1 (đợt 2/5) §2.0: trục HIỆU SUẤT NHÂN SỰ → function + trigger DB
-- ----------------------------------------------------------------------------
-- VÌ SAO: audit 30/08 — công thức hiệu suất sống ở JS và bị GHI CỨNG vào DB tại 3 cửa:
--   nghiemThu (viec.tien_do/chat_luong/phan_tram) · duyetMot/duyetHangLoat
--   (viec_van_hanh_duyet.hieu_suat) · và tồn tại 2 BẢN JS song song (vanhanh.ts vs
--   opsvanhanh.ts). Đã bắt được 1 dòng lệch thật trên DB (viec d4e18725: nộp 26/08
--   TRƯỚC deadline 28/08 mà tien_do=90, nguồn 'tu_dong' — bản SQL housekeeping lệch
--   bản client). Từ nay: công thức = fn_* dưới đây, MỌI đường ghi (client, housekeeping)
--   đều bị trigger tính lại — hết cảnh 2 thế hệ số.
--
-- Công thức (nguyên văn giaoviec-config.ts §4.8 + vanhanh.ts, CEO đã chốt từ 07-05):
--   tien_do  = 100 nếu đúng/không hạn; trễ d ngày → max(40, 100 − 10d)
--   trần chất lượng theo số lần trả lại: 0/1/≥2 → 100/85/70; chat_luong = min(điểm leader, trần)
--   phan_tram = round(0.3×tien_do + 0.7×chat_luong, 1)
--   hieu_suat (vận hành) = max(0, round(chat_luong − (100 − tien_do)))
--
-- MẤT GÌ (Luật xoá): KHÔNG mất dữ liệu; dòng lịch sử giữ nguyên (kể cả dòng lệch
--   d4e18725 — bất biến, chỉ ghi nhận). Chỉ thêm function/trigger.
-- ============================================================================

-- ── Công thức đặt tên, tái dùng ─────────────────────────────────────────────
create or replace function public.fn_gv_tien_do(p_deadline date, p_ngay_nop date)
returns numeric language sql immutable as $$
  select case when p_deadline is null or p_ngay_nop is null then 100
              else greatest(40, 100 - 10 * greatest(0, p_ngay_nop - p_deadline)) end
$$;

create or replace function public.fn_gv_tran_chat_luong(p_so_lan_tra_lai integer)
returns numeric language sql immutable as $$
  select case when coalesce(p_so_lan_tra_lai, 0) <= 0 then 100
              when p_so_lan_tra_lai = 1 then 85 else 70 end
$$;

create or replace function public.fn_gv_phan_tram(p_tien_do numeric, p_chat_luong numeric)
returns numeric language sql immutable as $$
  select round(0.3 * p_tien_do + 0.7 * p_chat_luong, 1)
$$;

create or replace function public.fn_vh_hieu_suat(p_tien_do numeric, p_chat_luong numeric)
returns numeric language sql immutable as $$
  select greatest(0, round(p_chat_luong - (100 - p_tien_do)))
$$;

-- ── Trigger ①: viec_van_hanh_duyet.hieu_suat luôn suy từ tien_do + chat_luong ─
create or replace function public.fn_vvhd_tinh() returns trigger
language plpgsql as $$
begin
  new.hieu_suat := public.fn_vh_hieu_suat(new.tien_do, new.chat_luong);
  return new;
end $$;
drop trigger if exists tg_vvhd_tinh on viec_van_hanh_duyet;
create trigger tg_vvhd_tinh before insert or update of tien_do, chat_luong
  on viec_van_hanh_duyet for each row execute function public.fn_vvhd_tinh();

-- ── Trigger ②: viec khi nghiệm thu 'dat' — bộ ba điểm tự tính ────────────────
-- Client gửi chat_luong = ĐIỂM LEADER THÔ; trigger áp trần + tính tien_do/phan_tram.
-- Chỉ đụng dòng 'dat' có ngay_nop + chat_luong (nghiệm thu thật); các trạng thái khác đi qua nguyên vẹn.
create or replace function public.fn_viec_nghiem_thu_tinh() returns trigger
language plpgsql as $$
begin
  if new.trang_thai = 'dat' and new.ngay_nop is not null and new.chat_luong is not null then
    new.tien_do := public.fn_gv_tien_do(new.deadline, new.ngay_nop);
    new.chat_luong := least(new.chat_luong, public.fn_gv_tran_chat_luong(new.so_lan_tra_lai));
    new.phan_tram := public.fn_gv_phan_tram(new.tien_do, new.chat_luong);
  end if;
  return new;
end $$;
drop trigger if exists tg_viec_nghiem_thu_tinh on viec;
create trigger tg_viec_nghiem_thu_tinh before insert or update
  on viec for each row execute function public.fn_viec_nghiem_thu_tinh();
