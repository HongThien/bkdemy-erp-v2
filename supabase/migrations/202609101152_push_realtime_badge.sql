-- ============================================================================
-- 202609101152 — push_realtime_badge
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   CEO 10/09: "1 lần 1 ngày thì đâu tác dụng gì" — mig 202609101105/202609101110 mới
--   chỉ đúng SỐ (không đoán), nhưng chỉ bắn lúc cron 10:30/23:30. Giờ thêm ĐƯỜNG BẮN NGAY
--   lúc việc thật sự đổi: TRIGGER ở đúng những bảng làm invariant "có/không việc" đổi —
--   không phải cron, không phải polling.
--
--   pt: đổi khi (a) `viec` insert (giao việc mới) hoặc đổi trang_thai/nguoi_lam_id/
--   nguoi_giao_id, (b) `viec_cap_nhat` insert (cập nhật hôm nay → hết nợ "chưa cập nhật").
--   ta: đổi khi (a) `buoi_hoc` insert/đổi *_dong_at (buổi thuong: có buổi mới = có việc
--   mới; đóng khâu = hết việc đó) — CÙNG bảng cũng gánh luôn bo_tro_yeu (nguoi_day_tg,
--   danh_gia_xong_at), (b) `bai_test` insert loai='retest' (retest mới = việc TG mới).
--   CHƯA làm: bai_lam chuyển da_nop cho retest (sẽ khiến hết nợ retest ngay) — bai_lam là
--   bảng NÓNG nhất hệ thống (mọi câu trả lời của mọi HS mọi bài), thêm trigger kiểm tra mỗi
--   dòng là rủi ro hiệu năng không tương xứng lợi ích (retest chỉ 1 góc nhỏ). Ca này vẫn
--   được vá bởi cron 23:30 hoặc lúc TA tự mở app — nói rõ ra, không âm thầm bỏ qua (§1.5).
--
--   Không gọi thẳng net.http_post trong hàm nghiệp vụ (viec/buoi_hoc đã có trigger khác lo
--   nghiệp vụ chính — không trộn) — tách riêng 1 hàm `_push_bao_cap_nhat(ns, app)`: BẮN VÀ
--   QUÊN (không net.http_collect_response — không chờ, không được phép làm chậm/làm fail
--   giao dịch nghiệp vụ chính vì lỗi mạng push), tự nuốt mọi exception, tự bỏ qua nếu người
--   đó chưa từng đăng ký push app đó (đỡ gọi HTTP vô ích). Domain đích lấy theo app vì mỗi
--   app là 1 Vercel project/domain riêng, giữ đúng cặp khoá VAPID của app đó (không đổi
--   kiến trúc push hiện có — chỉ thêm lối gọi).
--
--   Endpoint nhận: api/push-cap-nhat.mjs (file mới, cùng thư mục api/pt-nhac-viec.mjs).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Toàn hàm/trigger mới. `viec` đã có 3 trigger AFTER khác — trigger mới
--   thêm cùng bảng, tên riêng, không đụng 3 cái cũ.
-- ============================================================================

create extension if not exists pg_net;

-- ── Đếm 1 người (secret-gated) — dùng cho đường realtime, tách khỏi bản batch (fn_pt_push_dem/
--    fn_ta_push_dem) đang dùng cho cron hàng ngày, KHÔNG đổi 2 hàm đó ──
create or replace function public.fn_pt_push_dem_1(p_secret text, p_ns uuid)
returns integer
language plpgsql stable security definer set search_path = public as $$
begin
  if p_secret is null or p_secret <> (select b.gia_tri from he_thong_bi_mat b where b.khoa = 'push_cron') then
    raise exception 'sai secret' using errcode = '28000';
  end if;
  return
    (select count(*) from public.fn_pt_viec_can_cap_nhat(p_ns) v where not v.da_cap_nhat_hom_nay)
    + (select count(*) from viec where nguoi_giao_id = p_ns and trang_thai = 'cho_nghiem_thu');
end $$;
revoke all on function public.fn_pt_push_dem_1(text, uuid) from public;
grant execute on function public.fn_pt_push_dem_1(text, uuid) to anon, authenticated;

create or replace function public.fn_ta_push_dem_1(p_secret text, p_ns uuid)
returns integer
language plpgsql stable security definer set search_path = public as $$
declare v_buoi integer;
begin
  if p_secret is null or p_secret <> (select b.gia_tri from he_thong_bi_mat b where b.khoa = 'push_cron') then
    raise exception 'sai secret' using errcode = '28000';
  end if;
  select count(*) into v_buoi from public.fn_viec_buoi_thuong(null, null, true) v
    where v.dong_at is null and v.tab in ('ingame', 'et', 'btvn') and v.nhan_su_id = p_ns;
  return coalesce(v_buoi, 0) + coalesce(public.fn_btyeu_dem(p_ns), 0);
end $$;
revoke all on function public.fn_ta_push_dem_1(text, uuid) from public;
grant execute on function public.fn_ta_push_dem_1(text, uuid) to anon, authenticated;

-- ── BẮN VÀ QUÊN: gọi endpoint app tương ứng, không chờ phản hồi, nuốt lỗi ──
create or replace function public._push_bao_cap_nhat(p_ns uuid, p_app text)
returns void
language plpgsql security definer set search_path = public as $$
declare v_secret text; v_url text;
begin
  if p_ns is null then return; end if;
  if not exists (select 1 from push_dang_ky d where d.nhan_su_id = p_ns and d.app = p_app and d.loi_ma is distinct from 410) then
    return;   -- người này chưa đăng ký push app đó — khỏi gọi HTTP vô ích
  end if;
  v_url := case p_app
    when 'pt' then 'https://pt.bkacademy.edu.vn/api/push-cap-nhat'
    when 'ta' then 'https://ta.bkacademy.edu.vn/api/push-cap-nhat'
  end;
  if v_url is null then return; end if;
  select b.gia_tri into v_secret from he_thong_bi_mat b where b.khoa = 'push_cron';
  begin
    perform net.http_post(
      url := v_url,
      body := jsonb_build_object('secret', v_secret, 'nhan_su_id', p_ns, 'app', p_app),
      headers := jsonb_build_object('Content-Type', 'application/json'),
      timeout_milliseconds := 8000
    );
  exception when others then
    null;   -- push lỗi KHÔNG được phép làm hỏng giao dịch nghiệp vụ đang chạy
  end;
end $$;
revoke all on function public._push_bao_cap_nhat(uuid, text) from public;
grant execute on function public._push_bao_cap_nhat(uuid, text) to authenticated;

-- ── TRIGGER pt: viec (giao mới / đổi trạng thái / đổi người làm-người giao) ──
create or replace function public._trg_pt_viec_push() returns trigger
language plpgsql set search_path = public as $$
begin
  if TG_OP = 'INSERT' then
    perform public._push_bao_cap_nhat(NEW.nguoi_lam_id, 'pt');
    if NEW.trang_thai = 'cho_nghiem_thu' then perform public._push_bao_cap_nhat(NEW.nguoi_giao_id, 'pt'); end if;
  elsif TG_OP = 'UPDATE' and (
      NEW.trang_thai is distinct from OLD.trang_thai
      or NEW.nguoi_lam_id is distinct from OLD.nguoi_lam_id
      or NEW.nguoi_giao_id is distinct from OLD.nguoi_giao_id
    ) then
    perform public._push_bao_cap_nhat(NEW.nguoi_lam_id, 'pt');
    if OLD.nguoi_lam_id is distinct from NEW.nguoi_lam_id then perform public._push_bao_cap_nhat(OLD.nguoi_lam_id, 'pt'); end if;
    perform public._push_bao_cap_nhat(NEW.nguoi_giao_id, 'pt');
    if OLD.nguoi_giao_id is distinct from NEW.nguoi_giao_id then perform public._push_bao_cap_nhat(OLD.nguoi_giao_id, 'pt'); end if;
  end if;
  return NEW;
end $$;
drop trigger if exists trg_pt_viec_push_badge on viec;
create trigger trg_pt_viec_push_badge after insert or update on viec
for each row execute function public._trg_pt_viec_push();

-- ── TRIGGER pt: viec_cap_nhat (cập nhật hôm nay → hết nợ "chưa cập nhật") ──
create or replace function public._trg_pt_viec_cap_nhat_push() returns trigger
language plpgsql set search_path = public as $$
declare v_ns uuid;
begin
  select nguoi_lam_id into v_ns from viec where id = NEW.viec_id;
  perform public._push_bao_cap_nhat(v_ns, 'pt');
  return NEW;
end $$;
drop trigger if exists trg_pt_viec_cap_nhat_push_badge on viec_cap_nhat;
create trigger trg_pt_viec_cap_nhat_push_badge after insert on viec_cap_nhat
for each row execute function public._trg_pt_viec_cap_nhat_push();

-- ── TRIGGER ta: buoi_hoc (thuong: buổi mới/đóng khâu · bo_tro_yeu: ca mới/đánh giá xong) ──
create or replace function public._trg_ta_buoi_hoc_push() returns trigger
language plpgsql set search_path = public as $$
declare r record;
begin
  if NEW.loai = 'thuong' then
    if TG_OP = 'INSERT' or (TG_OP = 'UPDATE' and (
         NEW.ingame_dong_at is distinct from OLD.ingame_dong_at
         or NEW.et_dong_at is distinct from OLD.et_dong_at
         or NEW.btvn_dong_at is distinct from OLD.btvn_dong_at
       )) then
      for r in select nhan_su_id from phan_cong_lop where lop_id = NEW.lop_id and vai_tro = 'tg' loop
        perform public._push_bao_cap_nhat(r.nhan_su_id, 'ta');
      end loop;
    end if;
  elsif NEW.loai = 'bo_tro_yeu' then
    if TG_OP = 'INSERT' or (TG_OP = 'UPDATE' and NEW.danh_gia_xong_at is distinct from OLD.danh_gia_xong_at) then
      perform public._push_bao_cap_nhat(NEW.nguoi_day_tg, 'ta');
    end if;
  end if;
  return NEW;
end $$;
drop trigger if exists trg_ta_buoi_hoc_push_badge on buoi_hoc;
create trigger trg_ta_buoi_hoc_push_badge after insert or update on buoi_hoc
for each row execute function public._trg_ta_buoi_hoc_push();

-- ── TRIGGER ta: bai_test (retest mới = việc TG mới) ──
create or replace function public._trg_ta_retest_push() returns trigger
language plpgsql set search_path = public as $$
declare r record;
begin
  if NEW.loai = 'retest' then
    for r in select nhan_su_id from phan_cong_lop where lop_id = NEW.lop_id and vai_tro = 'tg' loop
      perform public._push_bao_cap_nhat(r.nhan_su_id, 'ta');
    end loop;
  end if;
  return NEW;
end $$;
drop trigger if exists trg_ta_retest_push_badge on bai_test;
create trigger trg_ta_retest_push_badge after insert on bai_test
for each row execute function public._trg_ta_retest_push();
