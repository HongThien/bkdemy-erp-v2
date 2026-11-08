-- ============================================================================
-- 202611041729 — ta_chan_duyet_viec_ca_tu_choi_va_bo_viec_khac
-- ----------------------------------------------------------------------------
-- VÌ SAO — Thùy 04/11:
--   (1) "Chặn đi": rà soát T10 thấy 13 việc ĐÃ DUYỆT nằm trong ca BỊ TỪ CHỐI (ca quên checkout bị từ chối "chưa ghi việc",
--       sau đó việc vẫn được duyệt) ⇒ _ta_luong_tinh chỉ tính việc có ca đã duyệt ⇒ lương bỏ qua IM LẶNG. Chặn cả 2 chiều:
--       • không duyệt được việc khi ca của nó đã bị từ chối;
--       • không từ chối được ca khi trong ca còn việc đã duyệt.
--       Muốn giữ việc: chốt giờ ra + duyệt lại ca. Không có mặt thật: từ chối việc. (13 dòng cũ giữ nguyên, Trang xử lý tay.)
--   (2) "sau này không cho ghi việc khác, chỉ ghi các việc từ danh sách nghiệp vụ có sẵn": ngưng loại 'khac'
--       (active = false — app chỉ liệt kê loại active) + DB chặn mọi đường ghi/sửa việc bằng loại đã ngưng.
--       Dòng 'khac' cũ GIỮ NGUYÊN (FK, lịch sử) — Trang xử từng dòng.
--   (3) "việc khác đổi đúng loại hoặc Trang duyệt": KHÔNG đổi dòng nào tự động — không dòng nào khớp chắc 100% một loại có sẵn
--       (trông thi bắt buộc lớp mà "khảo sát khối 9" không có lớp; "dạy hộ" 18:00 không có buổi) ⇒ danh sách gửi Trang.
-- MẤT GÌ (Luật xoá): không xoá gì. Viết lại thân _ta_cong_viec_kiem (giữ kiểm tra cũ) + thêm 1 hàm trigger/1 trigger cho ca, đổi active 1 loại việc.
-- ============================================================================

-- (2) ngưng loại 'khac'
update public.ta_loai_viec set active = false where ma = 'khac' and active;

-- Việc: VIẾT LẠI _ta_cong_viec_kiem (trigger ta_cong_viec_kiem có sẵn, BEFORE INSERT OR UPDATE) — giữ nguyên mọi kiểm tra cũ, đổi 1 chỗ + thêm 1 chặn:
--   • 'loại ngừng dùng' chỉ xét khi THÊM hoặc ĐỔI loại (bản cũ xét mọi UPDATE ⇒ ngưng 'khac' xong Trang không duyệt/từ chối nổi dòng cũ);
--   • mới: không duyệt việc khi ca của nó đã bị từ chối.
create or replace function public._ta_cong_viec_kiem() returns trigger
language plpgsql as $$
declare v ta_loai_viec; v_ca text;
begin
  select * into v from ta_loai_viec where ma = new.loai_viec;
  if (tg_op = 'INSERT' or new.loai_viec is distinct from old.loai_viec) and not v.active then
    raise exception 'Loại việc "%" không còn dùng — chọn một loại trong danh sách việc có sẵn', coalesce(v.ten, new.loai_viec);
  end if;
  if new.lop_id is null and new.buoi_hoc_id is not null then new.lop_id := public._ta_lop_cua_buoi(new.buoi_hoc_id); end if;
  -- Buổi bổ trợ chính là bằng chứng (đối chiếu + lương bổ trợ bám buổi, không bám lớp) ⇒ có buổi thì không bắt lớp.
  if v.can_lop and new.lop_id is null and new.buoi_hoc_id is null then raise exception 'Loại việc "%" cần chọn lớp', v.ten; end if;
  if new.loai_viec = 'khac' and btrim(coalesce(new.ghi_chu, '')) = '' then raise exception 'Việc khác phải ghi chú'; end if;
  if new.trang_thai = 'da_duyet' and new.cham_cong_id is not null
     and (tg_op = 'INSERT' or old.trang_thai is distinct from 'da_duyet' or new.cham_cong_id is distinct from old.cham_cong_id) then
    select to_char(coalesce(c.vao_chot, c.vao_at) at time zone 'Asia/Ho_Chi_Minh', 'HH24:MI') into v_ca
      from ta_cham_cong c where c.id = new.cham_cong_id and c.duyet = 'tu_choi';
    if found then
      raise exception 'Việc ngày % nằm trong ca % đã bị TỪ CHỐI — duyệt thì lương vẫn không tính. Có mặt thật: chốt giờ ra rồi duyệt lại ca; không có mặt: từ chối việc.',
        to_char(new.ngay, 'DD/MM'), v_ca;
    end if;
  end if;
  new.updated_at := now();
  return new;
end $$;

-- Ca: không từ chối khi còn việc đã duyệt trong ca
create or replace function public._ta_cham_cong_kiem_tu_choi() returns trigger
language plpgsql security definer set search_path = public as $$
declare v_n int;
begin
  if new.duyet = 'tu_choi' and old.duyet is distinct from 'tu_choi' then
    select count(*) into v_n from ta_cong_viec v where v.cham_cong_id = new.id and v.trang_thai = 'da_duyet';
    if v_n > 0 then
      raise exception 'Ca ngày % còn % việc đã duyệt — từ chối ca thì các việc đó mất lương. Từ chối các việc trước, hoặc giữ ca.',
        to_char(new.ngay, 'DD/MM'), v_n using errcode = 'check_violation';
    end if;
  end if;
  return new;
end $$;
revoke execute on function public._ta_cham_cong_kiem_tu_choi() from public, anon;
create trigger ta_cham_cong_kiem_tu_choi
  before update of duyet on public.ta_cham_cong
  for each row execute function public._ta_cham_cong_kiem_tu_choi();
