-- ============================================================================
-- 202608302330 — PH NỘP KHÔNG CẦN CHỌN BUỔI: hệ GÁN TẠM buổi gần nhất, TA CHỐT
-- (CEO chốt 30/08 đêm: "PH cứ chụp ảnh nộp là được; hệ thống đề xuất mặc định
--  buổi gần nhất — sau này có QR; TA trong giao diện chấm chọn bài thuộc buổi nào")
-- ----------------------------------------------------------------------------
-- Model: btvn_nop thêm `buoi_xac_nhan_at/boi` — null = hệ gán TẠM, TA bấm xác nhận
-- hoặc chuyển buổi mới thành chân lý (pattern "hệ đề xuất → người confirm", §1.5
-- "thà bỏ trống còn hơn đánh sai" — KHÔNG trả bài khi buổi chưa được người chốt).
-- Backfill: lượt nộp hiện có (seed tay, gán đúng buổi) coi như đã xác nhận.
-- Chuyển buổi = update PK (ảnh kéo theo qua FK ON UPDATE CASCADE — path file trong
-- storage KHÔNG đổi: path chỉ là địa chỉ, danh tính nằm ở DB). Trùng nộp ở buổi
-- đích → GỘP ảnh (ảnh là bằng chứng, không mất), giữ nop_at sớm nhất.
-- MẤT GÌ (Luật xoá): dòng btvn_nop nguồn khi GỘP vào nộp đích (ảnh + nop_at sớm
-- nhất được giữ lại ở đích) — chỉ xảy ra khi TA chủ động chuyển buổi trùng.
-- ============================================================================

alter table btvn_nop add column if not exists buoi_xac_nhan_at timestamptz;
alter table btvn_nop add column if not exists buoi_xac_nhan_boi uuid references nhan_su(id);
update btvn_nop set buoi_xac_nhan_at = nop_at where buoi_xac_nhan_at is null;

-- FK ảnh: thêm ON UPDATE CASCADE để chuyển buổi tự kéo ảnh theo
alter table btvn_nop_anh drop constraint if exists btvn_nop_anh_hoc_sinh_id_buoi_hoc_id_fkey;
alter table btvn_nop_anh add constraint btvn_nop_anh_hoc_sinh_id_buoi_hoc_id_fkey
  foreign key (hoc_sinh_id, buoi_hoc_id) references btvn_nop(hoc_sinh_id, buoi_hoc_id)
  on update cascade on delete cascade;

-- ── Nộp KHÔNG chỉ định buổi (đường app PH chính từ giờ): hệ tự tìm buổi GẦN NHẤT
--    có phiếu BTVN trong các lớp HS đang học (≤ hôm nay giờ VN; ưu tiên buổi chưa
--    đóng BTVN), gán TẠM (xac_nhan null). Không thấy buổi nào → báo lỗi rõ.
create or replace function public.fn_btvn_nop_tao_auto(p_hoc_sinh_id uuid, p_paths text[])
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_buoi uuid; v_ret jsonb;
begin
  select b.id into v_buoi
  from buoi_hoc b
  join hoc_sinh_lop hl on hl.lop_id = b.lop_id and hl.hoc_sinh_id = p_hoc_sinh_id and hl.trang_thai = 'dang_hoc'
  join tai_lieu t on t.lop_id = b.lop_id and t.ngay = b.ngay and t.loai = 'btvn'
  where b.trang_thai <> 'huy' and b.ngay <= (now() at time zone 'Asia/Ho_Chi_Minh')::date
  order by (b.btvn_dong_at is null) desc, b.ngay desc, b.id
  limit 1;
  if v_buoi is null then
    raise exception 'Chưa tìm thấy buổi nào có bài tập về nhà cho học sinh này — liên hệ trung tâm.';
  end if;
  v_ret := public.fn_btvn_nop_tao(p_hoc_sinh_id, v_buoi, p_paths);
  return v_ret || jsonb_build_object('buoi_hoc_id', v_buoi, 'gan_tam', true);
end $$;
revoke execute on function public.fn_btvn_nop_tao_auto(uuid, text[]) from public;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'ph_nop') then
    grant execute on function public.fn_btvn_nop_tao_auto(uuid, text[]) to ph_nop;
  end if;
end $$;

-- ── TA xác nhận "đúng buổi này" ──
create or replace function public.fn_btvn_xac_nhan_buoi(p_hoc_sinh_id uuid, p_buoi_hoc_id uuid)
returns void language plpgsql as $$
begin
  update btvn_nop set buoi_xac_nhan_at = now(), buoi_xac_nhan_boi = public.current_nhan_su_id(), updated_at = now()
  where hoc_sinh_id = p_hoc_sinh_id and buoi_hoc_id = p_buoi_hoc_id and buoi_xac_nhan_at is null;
end $$;
grant execute on function public.fn_btvn_xac_nhan_buoi(uuid, uuid) to authenticated;

-- ── TA chuyển bài sang buổi khác (chọn tay = chốt luôn) ──
create or replace function public.fn_btvn_chuyen_buoi(p_hoc_sinh_id uuid, p_buoi_cu uuid, p_buoi_moi uuid)
returns void language plpgsql as $$
declare n record; b record;
begin
  select * into n from btvn_nop where hoc_sinh_id = p_hoc_sinh_id and buoi_hoc_id = p_buoi_cu;
  if n is null then raise exception 'Không thấy lượt nộp.'; end if;
  if n.tra_at is not null then raise exception 'Bài đã trả cho PH — không chuyển buổi được nữa.'; end if;
  select id, lop_id, trang_thai into b from buoi_hoc where id = p_buoi_moi;
  if b is null or b.trang_thai = 'huy' then raise exception 'Buổi đích không hợp lệ.'; end if;
  if not exists (
    select 1 from hoc_sinh_lop hl where hl.hoc_sinh_id = p_hoc_sinh_id and hl.lop_id = b.lop_id and hl.trang_thai = 'dang_hoc'
  ) and not exists (
    select 1 from buoi_hoc_hs r where r.buoi_hoc_id = p_buoi_moi and r.hoc_sinh_id = p_hoc_sinh_id
  ) then raise exception 'Học sinh không thuộc lớp của buổi đích.'; end if;

  if exists (select 1 from btvn_nop where hoc_sinh_id = p_hoc_sinh_id and buoi_hoc_id = p_buoi_moi) then
    -- đích đã có lượt nộp → GỘP: dồn ảnh sang (đánh lại thu_tu nối đuôi), giữ nop_at sớm nhất, xoá dòng nguồn
    update btvn_nop_anh a set buoi_hoc_id = p_buoi_moi,
      thu_tu = a.thu_tu + coalesce((select max(thu_tu) from btvn_nop_anh x
                                    where x.hoc_sinh_id = p_hoc_sinh_id and x.buoi_hoc_id = p_buoi_moi), 0)
    where a.hoc_sinh_id = p_hoc_sinh_id and a.buoi_hoc_id = p_buoi_cu;
    update btvn_nop t set nop_at = least(t.nop_at, n.nop_at),
      buoi_xac_nhan_at = now(), buoi_xac_nhan_boi = public.current_nhan_su_id(), updated_at = now()
    where t.hoc_sinh_id = p_hoc_sinh_id and t.buoi_hoc_id = p_buoi_moi;
    delete from btvn_nop where hoc_sinh_id = p_hoc_sinh_id and buoi_hoc_id = p_buoi_cu;
  else
    update btvn_nop set buoi_hoc_id = p_buoi_moi,   -- ảnh kéo theo (FK ON UPDATE CASCADE)
      buoi_xac_nhan_at = now(), buoi_xac_nhan_boi = public.current_nhan_su_id(), updated_at = now()
    where hoc_sinh_id = p_hoc_sinh_id and buoi_hoc_id = p_buoi_cu;
  end if;
end $$;
grant execute on function public.fn_btvn_chuyen_buoi(uuid, uuid, uuid) to authenticated;

-- ── Trả bài: CHỈ khi buổi đã được người chốt (đánh sai buổi là ghi sai sự thật cho PH) ──
create or replace function public.fn_btvn_tra_bai(p_hoc_sinh_id uuid, p_buoi_hoc_id uuid)
returns void language plpgsql as $$
declare n record;
begin
  select * into n from btvn_nop where hoc_sinh_id = p_hoc_sinh_id and buoi_hoc_id = p_buoi_hoc_id;
  if n is null then raise exception 'HS này chưa nộp bài trên app.'; end if;
  if n.buoi_xac_nhan_at is null then raise exception 'Chưa xác nhận bài thuộc buổi này — bấm "Đúng buổi này" hoặc chuyển buổi trước.'; end if;
  if not exists (
    select 1 from gami_grades g
    join gami_session_problems sp on sp.id = g.problem_id and sp.phase = 'btvn'
    where sp.buoi_hoc_id = p_buoi_hoc_id and g.hoc_sinh_id = p_hoc_sinh_id
  ) and not exists (
    select 1 from btvn_ket_qua k where k.hoc_sinh_id = p_hoc_sinh_id and k.buoi_hoc_id = p_buoi_hoc_id
  ) then
    raise exception 'Chưa chấm gì cho HS này — chấm rồi mới trả bài.';
  end if;
  update btvn_nop set tra_at = now(), tra_boi = public.current_nhan_su_id(), updated_at = now()
  where hoc_sinh_id = p_hoc_sinh_id and buoi_hoc_id = p_buoi_hoc_id and tra_at is null;
end $$;
grant execute on function public.fn_btvn_tra_bai(uuid, uuid) to authenticated;

-- Trả cả buổi (lúc đóng BTVN): chỉ trả lượt ĐÃ chốt buổi + đã chấm.
create or replace function public.fn_btvn_tra_bai_buoi(p_buoi_hoc_id uuid)
returns integer language plpgsql as $$
declare v integer;
begin
  update btvn_nop n set tra_at = now(), tra_boi = public.current_nhan_su_id(), updated_at = now()
  where n.buoi_hoc_id = p_buoi_hoc_id and n.tra_at is null and n.buoi_xac_nhan_at is not null
    and (exists (select 1 from gami_grades g
                 join gami_session_problems sp on sp.id = g.problem_id and sp.phase = 'btvn'
                 where sp.buoi_hoc_id = p_buoi_hoc_id and g.hoc_sinh_id = n.hoc_sinh_id)
      or exists (select 1 from btvn_ket_qua k
                 where k.hoc_sinh_id = n.hoc_sinh_id and k.buoi_hoc_id = p_buoi_hoc_id));
  get diagnostics v = row_count;
  return v;
end $$;
grant execute on function public.fn_btvn_tra_bai_buoi(uuid) to authenticated;

-- Picker "chuyển buổi": buổi có phiếu BTVN của lớp, 12 buổi gần nhất (join buổi×tai_lieu
-- không FK — bám lop+ngay — nên ở DB theo §2.0).
create or replace function public.fn_btvn_buoi_cua_lop(p_lop_id uuid)
returns table (id uuid, ngay date, dong boolean)
language sql stable as $$
  select b.id, b.ngay, (b.btvn_dong_at is not null) as dong
  from buoi_hoc b
  where b.lop_id = p_lop_id and b.trang_thai <> 'huy'
    and exists (select 1 from tai_lieu t where t.lop_id = b.lop_id and t.ngay = b.ngay and t.loai = 'btvn')
  order by b.ngay desc
  limit 12
$$;
grant execute on function public.fn_btvn_buoi_cua_lop(uuid) to authenticated;

-- View PH: thêm cờ đã-chốt-buổi (PH thấy "đã ghi nhận" ngay cả khi TA chưa chốt).
create or replace view public.v_btvn_nop_ph as
  select n.hoc_sinh_id, n.buoi_hoc_id, b.ngay, l.mon, l.ten_lop, n.nop_at, n.tra_at,
         (n.buoi_xac_nhan_at is not null) as buoi_da_chot,
         (select count(*) from btvn_nop_anh a
          where a.hoc_sinh_id = n.hoc_sinh_id and a.buoi_hoc_id = n.buoi_hoc_id) as so_anh
  from btvn_nop n
  join buoi_hoc b on b.id = n.buoi_hoc_id
  left join lop l on l.id = b.lop_id;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'fdw_bkdemy_web') then
    grant select on public.v_btvn_nop_ph to fdw_bkdemy_web;
  end if;
end $$;
