-- ============================================================================
-- 202611041721 — ta_cham_cong_chan_trung_va_bam_nham
-- ----------------------------------------------------------------------------
-- VÌ SAO — Thùy 04/11 "OK. chặn cứng đi": soát T10 thấy (1) Nhật An khai bù 04/10 HAI ca giống hệt 14:30–21:30,
--   (2) 4 ca dài 0 phút (checkin rồi checkout ngay = bấm nhầm). Trước đây chỉ gắn cờ, Trang phải tự thấy rồi từ chối.
--   Giờ DB từ chối ngay lúc ghi, báo lý do cho TA:
--   • ca (đã có giờ ra) chồng giờ với một ca khác CÙNG NGÀY của chính người đó (ca còn mở coi như kéo tới cuối ngày);
--   • ca dài < 1 phút.
--   Áp cho MỌI đường ghi giờ (khai bù · checkout · sửa ca · nhập hộ · chốt giờ) vì đặt ở trigger.
--   KHÔNG chặn: checkin (chưa có giờ ra) · ca bị từ chối/huỷ (huỷ ca đặt ra_at = vao_at cố ý) · đổi trạng thái duyệt
--   (trigger chỉ chạy khi cột giờ đổi ⇒ dòng trùng CŨ vẫn duyệt/từ chối được bình thường).
-- MẤT GÌ (Luật xoá): không xoá gì. Thêm 1 hàm + 1 trigger.
-- ============================================================================

create or replace function public._ta_cham_cong_kiem_gio() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_vao timestamptz := coalesce(new.vao_chot, new.vao_at);
  v_ra  timestamptz := coalesce(new.ra_chot, new.ra_at);
  o record;
begin
  if new.duyet = 'tu_choi' or v_ra is null then return new; end if;

  if v_ra < v_vao + interval '1 minute' then
    raise exception 'Ca chỉ dài % giây (vào %, ra %) — có bấm nhầm không? Checkout khi xong ca; checkin nhầm thì bấm Huỷ ca.',
      greatest(0, round(extract(epoch from (v_ra - v_vao))))::int,
      to_char(v_vao at time zone 'Asia/Ho_Chi_Minh', 'HH24:MI'), to_char(v_ra at time zone 'Asia/Ho_Chi_Minh', 'HH24:MI')
      using errcode = 'check_violation';
  end if;

  select c.id, coalesce(c.vao_chot, c.vao_at) as vao, coalesce(c.ra_chot, c.ra_at) as ra into o
    from ta_cham_cong c
   where c.nhan_su_id = new.nhan_su_id and c.ngay = new.ngay and c.id <> new.id and c.duyet <> 'tu_choi'
     and tstzrange(coalesce(c.vao_chot, c.vao_at), coalesce(c.ra_chot, c.ra_at, 'infinity'::timestamptz))
         && tstzrange(v_vao, v_ra)
   order by 2 limit 1;
  if o.id is not null then
    raise exception 'Ngày % đã có ca %–% — không ghi ca trùng giờ. Giờ ca đó sai thì sửa ca đó.',
      to_char(new.ngay, 'DD/MM'), to_char(o.vao at time zone 'Asia/Ho_Chi_Minh', 'HH24:MI'),
      coalesce(to_char(o.ra at time zone 'Asia/Ho_Chi_Minh', 'HH24:MI'), 'chưa checkout')
      using errcode = 'check_violation';
  end if;
  return new;
end $$;
revoke execute on function public._ta_cham_cong_kiem_gio() from public, anon;

drop trigger if exists ta_cham_cong_kiem_gio on public.ta_cham_cong;
create trigger ta_cham_cong_kiem_gio
  before insert or update of vao_at, ra_at, vao_chot, ra_chot, ngay, nhan_su_id on public.ta_cham_cong
  for each row execute function public._ta_cham_cong_kiem_gio();
