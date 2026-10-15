-- ============================================================================
-- 202610151938 — ta_sua_cong_cua_toi
-- ----------------------------------------------------------------------------
-- VÌ SAO — Thùy 15/10: "Trong khai bù, trợ giảng chưa quen nhầm lẫn — cần chức năng SỬA lại cái đã chấm công, phải có
--   list để sửa." Trước đây TA chỉ "Bỏ" được việc chờ duyệt; ca khai bù sai giờ / sai ngày thì không có đường nào.
--   · fn_ta_sua_ca(id, vao, ra): sửa giờ ca KHAI BÙ của mình đang chờ duyệt (cùng ngày, cùng luật như khai bù). Ca
--     checkin/checkout bằng app là giờ máy ghi thật ⇒ không sửa giờ được (chỉ huỷ, hoặc nhờ quản lý chốt giờ).
--   · fn_ta_huy_ca(id, ly_do): huỷ ca của mình đang chờ duyệt (vd khai nhầm ngày) ⇒ ca + mọi việc gắn ca còn chờ duyệt
--     chuyển 'tu_choi' với lý do "TA tự huỷ" — không xoá dòng (immutable append + state-log, CLAUDE.md §4).
--   · fn_ta_sua_viec(id, …): sửa loại việc / lớp / giờ / học sinh / ghi chú của việc mình đang chờ duyệt; buổi lớp gắn
--     theo cùng luật fn_ta_khai_viec (trợ giảng / trông thi ⇒ tìm buổi của lớp hôm đó).
--   Cả 3: chỉ khi còn trong hạn tự khai (24 giờ hoặc đợt khai lùi) — quá hạn thì nhờ quản lý (cùng luật khai bù).
--   Trigger _ta_cong_ghi_log tự ghi cặp cũ/mới mỗi lần sửa; _ta_khoa_ky chặn kỳ đã chốt; _ta_cong_viec_kiem kiểm lớp.
-- MẤT GÌ (Luật xoá): không xoá gì. 3 hàm mới.
-- ============================================================================

create or replace function public._ta_con_han_tu_khai(p_ngay date, p_ket timestamptz) returns boolean
language sql stable security definer set search_path = public as $$
  select now() <= p_ket + interval '24 hours' or public._ta_duoc_khai_bu(p_ngay)
$$;
revoke all on function public._ta_con_han_tu_khai(date, timestamptz) from public, anon, authenticated;

create or replace function public.fn_ta_sua_ca(p_id uuid, p_vao timestamptz, p_ra timestamptz)
returns void
language plpgsql security definer set search_path = public as $$
declare v_ns uuid := public.current_nhan_su_id(); c ta_cham_cong;
begin
  select * into c from ta_cham_cong where id = p_id and nhan_su_id = v_ns for update;
  if c.id is null then raise exception 'Không thấy ca của bạn'; end if;
  if c.duyet <> 'cho_duyet' then raise exception 'Ca đã được duyệt / từ chối — nhờ quản lý sửa'; end if;
  if not c.khai_bu then raise exception 'Ca checkin bằng app là giờ máy ghi — không sửa giờ được; khai nhầm thì bấm Huỷ ca'; end if;
  if p_ra <= p_vao then raise exception 'Giờ checkout phải sau giờ checkin'; end if;
  if (p_vao at time zone 'Asia/Ho_Chi_Minh')::date <> c.ngay or (p_ra at time zone 'Asia/Ho_Chi_Minh')::date <> c.ngay then
    raise exception 'Giờ sửa phải trong ngày %. Nhầm ngày thì Huỷ ca rồi khai bù đúng ngày', to_char(c.ngay, 'DD/MM');
  end if;
  if p_ra > now() then raise exception 'Không khai cho giờ chưa tới'; end if;
  if not public._ta_con_han_tu_khai(c.ngay, coalesce(c.ra_at, p_ra)) then raise exception 'Đã quá hạn tự sửa — nhờ quản lý'; end if;
  update ta_cham_cong set vao_at = p_vao, ra_at = p_ra, trang_thai = 'xong' where id = p_id;
end $$;
revoke all on function public.fn_ta_sua_ca(uuid, timestamptz, timestamptz) from public, anon;
grant execute on function public.fn_ta_sua_ca(uuid, timestamptz, timestamptz) to authenticated;

create or replace function public.fn_ta_huy_ca(p_id uuid, p_ly_do text default 'TA tự huỷ')
returns integer
language plpgsql security definer set search_path = public as $$
declare v_ns uuid := public.current_nhan_su_id(); c ta_cham_cong; v_ld text := coalesce(nullif(btrim(p_ly_do), ''), 'TA tự huỷ'); v_n int;
begin
  select * into c from ta_cham_cong where id = p_id and nhan_su_id = v_ns for update;
  if c.id is null then raise exception 'Không thấy ca của bạn'; end if;
  if c.duyet <> 'cho_duyet' then raise exception 'Ca đã được duyệt / từ chối — nhờ quản lý sửa'; end if;
  update ta_cong_viec set trang_thai = 'tu_choi', duyet_boi = v_ns, duyet_at = now(), ly_do_duyet = v_ld || ' (huỷ ca)'
   where cham_cong_id = p_id and nhan_su_id = v_ns and trang_thai = 'cho_duyet';
  get diagnostics v_n = row_count;
  update ta_cham_cong set duyet = 'tu_choi', duyet_boi = v_ns, duyet_at = now(), ly_do_duyet = v_ld,
         trang_thai = 'xong', ra_at = coalesce(ra_at, vao_at)
   where id = p_id;
  return v_n;   -- số việc huỷ kèm
end $$;
revoke all on function public.fn_ta_huy_ca(uuid, text) from public, anon;
grant execute on function public.fn_ta_huy_ca(uuid, text) to authenticated;

create or replace function public.fn_ta_sua_viec(p_id uuid, p_loai text, p_lop uuid default null, p_bat time default null,
                                                p_ket time default null, p_hs text default null, p_ghi_chu text default '')
returns void
language plpgsql security definer set search_path = public as $$
declare v_ns uuid := public.current_nhan_su_id(); v ta_cong_viec; v_lop uuid := p_lop; v_buoi uuid; v_bat time := p_bat; v_ket time := p_ket;
        v_tinh text;
begin
  select * into v from ta_cong_viec where id = p_id and nhan_su_id = v_ns for update;
  if v.id is null then raise exception 'Không thấy việc của bạn'; end if;
  if v.trang_thai <> 'cho_duyet' then raise exception 'Việc đã được duyệt / từ chối — nhờ quản lý sửa'; end if;
  if not public._ta_con_han_tu_khai(v.ngay, ((v.ngay + coalesce(v.gio_ket_thuc, time '23:59'))::timestamp at time zone 'Asia/Ho_Chi_Minh')) then
    raise exception 'Đã quá hạn tự sửa — nhờ quản lý';
  end if;
  select tinh_vao into v_tinh from ta_loai_viec where ma = p_loai;
  if v_tinh is null then raise exception 'Loại việc không hợp lệ'; end if;
  -- giữ buổi đang gắn nếu không đổi loại và không đổi lớp; ngược lại gắn lại theo luật fn_ta_khai_viec
  if p_loai = v.loai_viec and v_lop is not distinct from v.lop_id then v_buoi := v.buoi_hoc_id; end if;
  if v_lop is null and p_loai = 'tro_giang' then
    select t.lop_id into v_lop from public._ta_tg_tai(v.ngay, null, v_ns) t order by t.la_chinh desc limit 1;
  end if;
  if v_buoi is null and v_tinh in ('tg', 'trong_thi') and v_lop is not null then
    select b.id, coalesce(v_bat, b.gio_bat_dau), coalesce(v_ket, b.gio_ket_thuc) into v_buoi, v_bat, v_ket
      from buoi_hoc b where b.lop_id = v_lop and b.ngay = v.ngay and b.loai = 'thuong' and b.trang_thai <> 'huy'
     order by b.gio_bat_dau nulls last limit 1;
  end if;
  begin
    update ta_cong_viec
       set loai_viec = p_loai, lop_id = v_lop, buoi_hoc_id = v_buoi,
           ca_bo_tro_id = case when p_loai = v.loai_viec then ca_bo_tro_id end,
           gio_bat_dau = v_bat, gio_ket_thuc = v_ket, hoc_sinh = nullif(btrim(coalesce(p_hs, '')), ''),
           ghi_chu = coalesce(p_ghi_chu, '')
     where id = p_id;
  exception when unique_violation then
    raise exception 'Việc này đã ghi công rồi (trùng một dòng khác)';
  end;
end $$;
revoke all on function public.fn_ta_sua_viec(uuid, text, uuid, time, time, text, text) from public, anon;
grant execute on function public.fn_ta_sua_viec(uuid, text, uuid, time, time, text, text) to authenticated;
