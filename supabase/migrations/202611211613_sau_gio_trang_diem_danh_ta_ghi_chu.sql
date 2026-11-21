-- ============================================================================
-- 202611211613 — sau_gio_trang_diem_danh_ta_ghi_chu
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 21/11): "Bổ trợ sau giờ — TA không điểm danh vắng / có mặt được trên app TA, chỉ Trang mới tích được.
--   Không có bài thì mặc định hệ thống điểm danh vắng — Trang sửa nếu cần dựa trên dữ liệu TA note."  Trang = Phạm Thị Thùy Trang.
--   (28/09 từng có 2 ca TA tích "có mặt" nhầm — mig 202609281000.)
--   · QUYỀN: leaf mới `diem_danh_sau_gio` (vai "Điểm danh Sau giờ"), cấp cho Trang bằng 1 ghế trong team Core team (đã là thành viên ⇒ không đổi team).
--     Admin hệ thống luôn qua cổng (co_quyen_ghi). Không hard-code tên/uuid trong hàm.
--   · MỘT ĐƯỜNG GHI: fn_btnhe_diem_danh(buoi_hoc_hs, 'co_mat'|'vang'). Trigger khoá mọi UPDATE thẳng `buoi_hoc_hs.diem_danh` của buổi bo_tro_nhe
--     từ client (role authenticated/anon); hàm DB / tác vụ nền (owner claude_build) vẫn ghi được.
--   · fn_btyeu_bo_diem_danh (đường cũ của người đứng ca) từ chối buổi bo_tro_nhe.
--   · TA GHI CHÚ: bảng sau_gio_ta_note (1 dòng / buổi — thiếu ghi chú = không có dòng), ghi qua fn_btnhe_ta_note (ghi chú rỗng ⇒ xoá dòng của chính nó).
--   · TỰ VẮNG: _btnhe_tu_vang — buổi sau giờ của NGÀY ĐÃ QUA, chưa điểm danh, chưa có bài làm nào ⇒ em vắng + buổi huỷ (ly do ghi rõ "hệ thống").
--     Có bài (TA nhập Đ/C/S, nộp ⇒ fn_btyeu_giay_nop đặt có mặt) thì không đụng. Chạy 0h mỗi ngày qua bộ điều phối (tinh_san_dang_ky).
--     KHÔNG chạy ngay trong migration (job chạy 0h đêm nay) — Trang có sẵn ghi chú TA trước khi soát.
--   · Trang đổi vắng → có mặt (fn_btnhe_diem_danh): mở lại buổi + mở lại case 'nhe_xong/bo' + dạng đã đóng khi huỷ. Chỉ khi ca chưa bị reset thứ Hai huỷ
--     (ca còn mở, ngày thuộc tuần này) và em không có buổi sau giờ khác đang mở.
-- MẤT GÌ (Luật xoá): không xoá dòng dữ liệu cũ. Thêm 1 vai + 1 ghế (Trang) + 1 bảng + 3 hàm + 1 trigger + 1 dòng điều phối.
--   Đổi: fn_btyeu_bo_diem_danh (thêm 1 dòng chặn bo_tro_nhe). Gỡ quyền: trigger chặn client ghi thẳng diem_danh buổi sau giờ.
-- ============================================================================

-- ── 1) Quyền: vai + leaf + ghế Trang ─────────────────────────────────────────
insert into vai_tro (ten, mo_ta)
select 'Điểm danh Sau giờ', 'Tích có mặt / vắng ca Bổ trợ sau giờ (TA chỉ ghi chú). Chủ trương Thùy 21/11.'
 where not exists (select 1 from vai_tro where ten = 'Điểm danh Sau giờ');

insert into vai_tro_chuc_nang (vai_tro_id, chuc_nang, chi_xem)
select v.id, 'diem_danh_sau_gio', false from vai_tro v
 where v.ten = 'Điểm danh Sau giờ'
   and not exists (select 1 from vai_tro_chuc_nang x where x.vai_tro_id = v.id and x.chuc_nang = 'diem_danh_sau_gio');

insert into vi_tri (team_id, ten, cap, nhan_su_id, vai_tro_id)
select 'c1c96aaa-43e0-4508-bcba-c8c1d6af25bb', 'Điểm danh Sau giờ', 'thanh_vien', n.id, v.id
  from nhan_su n, vai_tro v
 where n.id = 'e8573f34-65cf-4069-808c-44f10ee39c2e' and n.ho_ten = 'Phạm Thị Thùy Trang'   -- chốt tên để không gán nhầm người khác tên Trang
   and v.ten = 'Điểm danh Sau giờ'
   and exists (select 1 from team where id = 'c1c96aaa-43e0-4508-bcba-c8c1d6af25bb' and ten = 'Core team')
   and not exists (select 1 from vi_tri x where x.nhan_su_id = n.id and x.vai_tro_id = v.id);

-- ── 2) Ghi chú của TA ────────────────────────────────────────────────────────
create table if not exists sau_gio_ta_note (
  buoi_hoc_id uuid primary key references buoi_hoc(id) on delete cascade,
  noi_dung    text not null check (length(btrim(noi_dung)) > 0),
  ns_id       uuid references nhan_su(id),
  updated_at  timestamptz not null default now()
);
comment on table sau_gio_ta_note is 'Ghi chú TA cho Trang về ca Bổ trợ sau giờ (em có đến không...). Thiếu ghi chú = không có dòng. Ghi qua fn_btnhe_ta_note.';
alter table sau_gio_ta_note enable row level security;
drop policy if exists sau_gio_ta_note_doc on sau_gio_ta_note;
create policy sau_gio_ta_note_doc on sau_gio_ta_note for select to authenticated using ((select public.la_thanh_vien()));

create or replace function public.fn_btnhe_ta_note(p_buoi uuid, p_noi_dung text)
returns void language plpgsql security definer set search_path = public as $$
declare v_ns uuid := public._btyeu_my_ns(); v_admin boolean; r record; v_nd text := btrim(coalesce(p_noi_dung, ''));
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select coalesce(la_admin, false) into v_admin from public.my_quyen();
  select b.id, b.nguoi_day_tg, cn.ta_id into r from buoi_hoc b join ca_bo_tro_nhe cn on cn.id = b.ca_bo_tro_nhe_id
   where b.id = p_buoi and b.loai = 'bo_tro_nhe';
  if r.id is null then raise exception 'Không phải buổi Bổ trợ sau giờ.'; end if;
  if not (coalesce(v_admin, false) or coalesce(r.ta_id = v_ns, false) or coalesce(r.nguoi_day_tg = v_ns, false) or public.co_quyen_ghi('diem_danh_sau_gio')) then
    raise exception 'Chỉ TA của ca (hoặc người mở ca, Trang) ghi chú được.'; end if;
  if v_nd = '' then delete from sau_gio_ta_note where buoi_hoc_id = p_buoi; return; end if;
  insert into sau_gio_ta_note (buoi_hoc_id, noi_dung, ns_id) values (p_buoi, left(v_nd, 500), v_ns)
    on conflict (buoi_hoc_id) do update set noi_dung = excluded.noi_dung, ns_id = excluded.ns_id, updated_at = now();
end $$;
revoke execute on function public.fn_btnhe_ta_note(uuid, text) from public, anon;
grant execute on function public.fn_btnhe_ta_note(uuid, text) to authenticated;

-- ── 3) Một đường ghi điểm danh: Trang ────────────────────────────────────────
create or replace function public.fn_btnhe_diem_danh(p_bhh uuid, p_tt text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare r record; v_dau date := public._btnhe_dau_tuan();
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if not public.co_quyen_ghi('diem_danh_sau_gio') then
    raise exception 'Điểm danh ca Sau giờ chỉ Trang tích được. TA ghi chú; không có bài thì hệ thống tự điểm danh vắng.'; end if;
  if p_tt is null or p_tt not in ('co_mat', 'vang') then raise exception 'Điểm danh phải là co_mat | vang.'; end if;
  select hh.id, hh.diem_danh, hh.bo_tro_yeu_id, b.id as buoi_id, b.ngay, b.trang_thai, b.danh_gia_xong_at, cn.trang_thai as ca_tt
    into r from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id
    left join ca_bo_tro_nhe cn on cn.id = b.ca_bo_tro_nhe_id
   where hh.id = p_bhh and b.loai = 'bo_tro_nhe';
  if r.id is null then raise exception 'Không phải buổi Bổ trợ sau giờ.'; end if;
  if r.diem_danh is not distinct from p_tt and (p_tt = 'co_mat' or r.trang_thai = 'huy') then return jsonb_build_object('diem_danh', p_tt, 'doi', false); end if;
  if r.danh_gia_xong_at is not null then raise exception 'Ca đã xong (có bài nộp) — không đổi điểm danh được.'; end if;

  if p_tt = 'co_mat' then
    if r.trang_thai = 'huy' then   -- đang huỷ vì vắng ⇒ mở lại
      if r.ca_tt = 'huy' or r.ngay < v_dau then
        raise exception 'Ca đã bị huỷ / hết tuần (reset thứ Hai) — không mở lại được; trưởng khối khởi tạo ca mới.'; end if;
      if exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id
                  where x.bo_tro_yeu_id = r.bo_tro_yeu_id and bb.id <> r.buoi_id and bb.loai = 'bo_tro_nhe' and bb.trang_thai = 'mo' and bb.danh_gia_xong_at is null) then
        raise exception 'Em đã có buổi sau giờ khác đang mở — không mở lại buổi này được.'; end if;
      update buoi_hoc set trang_thai = 'mo', ly_do_huy = null, updated_at = now() where id = r.buoi_id;
      update bo_tro_yeu set trang_thai = 'nhe_mo', hoan_thanh_at = null, ket_qua = null, dong_boi = null, ghi_chu_dong = null
       where id = r.bo_tro_yeu_id and trang_thai = 'nhe_xong' and ket_qua = 'bo';
      update bo_tro_yeu_dang set dong_at = null where bo_tro_yeu_id = r.bo_tro_yeu_id and dong_at is not null
         and exists (select 1 from bo_tro_yeu y where y.id = r.bo_tro_yeu_id and y.trang_thai = 'nhe_mo');
    end if;
    update buoi_hoc_hs set diem_danh = 'co_mat' where id = p_bhh;
  else
    if r.trang_thai = 'mo' then
      update buoi_hoc set trang_thai = 'huy', ly_do_huy = 'Trang điểm danh vắng — ca sau giờ không bù', updated_at = now() where id = r.buoi_id;
    end if;
    update buoi_hoc_hs set diem_danh = 'vang', btyeu_che_do = null where id = p_bhh;
  end if;
  return jsonb_build_object('diem_danh', p_tt, 'doi', true);
end $$;
revoke execute on function public.fn_btnhe_diem_danh(uuid, text) from public, anon;
grant execute on function public.fn_btnhe_diem_danh(uuid, text) to authenticated;

-- Trigger khoá: client không ghi thẳng diem_danh buổi sau giờ (invoker ⇒ current_user là role của người gọi; hàm DB chạy owner claude_build).
create or replace function public._trg_btnhe_diem_danh_khoa()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.diem_danh is not distinct from old.diem_danh then return new; end if;
  if current_user not in ('authenticated', 'anon') then return new; end if;
  if exists (select 1 from buoi_hoc b where b.id = new.buoi_hoc_id and b.loai = 'bo_tro_nhe') then
    raise exception 'Điểm danh ca Sau giờ chỉ Trang tích được (TA ghi chú; không có bài thì hệ thống tự vắng).';
  end if;
  return new;
end $$;
drop trigger if exists trg_btnhe_diem_danh_khoa on buoi_hoc_hs;
create trigger trg_btnhe_diem_danh_khoa before update of diem_danh on buoi_hoc_hs
  for each row execute function public._trg_btnhe_diem_danh_khoa();

-- Đường cũ của người đứng ca: từ chối buổi sau giờ (bản dựng lại từ định nghĩa mig 202610291639, chỉ thêm 1 dòng chặn)
CREATE OR REPLACE FUNCTION public.fn_btyeu_bo_diem_danh(p_bhh uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare r record; v_ns uuid := public._btyeu_my_ns(); v_admin boolean; v_cau integer;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select la_admin into v_admin from public.my_quyen();
  select hh.id, hh.diem_danh, hh.bo_tro_yeu_id, b.id as buoi_id, b.loai, b.trang_thai, b.danh_gia_xong_at, b.nguoi_day_tg, b.ly_do_huy
    into r from buoi_hoc_hs hh join buoi_hoc b on b.id = hh.buoi_hoc_id where hh.id = p_bhh;
  if r.id is null or r.loai not in ('bo_tro_yeu', 'bo_tro_nhe') then raise exception 'Không phải buổi bổ trợ yếu.'; end if;
  if r.loai = 'bo_tro_nhe' then raise exception 'Điểm danh ca Sau giờ do Trang quản lý (fn_btnhe_diem_danh).'; end if;
  if r.nguoi_day_tg is distinct from v_ns and not coalesce(v_admin, false) then raise exception 'Chỉ người đứng ca (hoặc admin).'; end if;
  if r.diem_danh is null then return; end if; -- chưa điểm danh: không có gì để bỏ
  if r.danh_gia_xong_at is not null then raise exception 'Ca đã hoàn tất — không bỏ điểm danh được.'; end if;
  if exists (select 1 from bai_test t where t.buoi_hoc_id = r.buoi_id and t.loai = 'bo_tro_test') then
    raise exception 'Ca đã đóng (đã sinh test cuối ca) — không bỏ điểm danh được.'; end if;
  select count(*) into v_cau from bai_test t join bai_lam bl on bl.bai_test_id = t.id join bai_lam_cau k on k.bai_lam_id = bl.id
    where t.buoi_hoc_id = r.buoi_id and k.verdict is not null;
  if v_cau > 0 then raise exception 'Em đã làm % câu trong ca — không bỏ điểm danh được.', v_cau; end if;
  if r.diem_danh in ('vang', 'vang_phep') and r.trang_thai = 'huy' then
    if exists (select 1 from buoi_hoc_hs x join buoi_hoc bb on bb.id = x.buoi_hoc_id
               where x.bo_tro_yeu_id = r.bo_tro_yeu_id and bb.id <> r.buoi_id and bb.loai in ('bo_tro_yeu', 'bo_tro_nhe') and bb.trang_thai = 'mo' and bb.danh_gia_xong_at is null) then
      raise exception 'Em đã được xếp buổi khác — không mở lại buổi này được.'; end if;
    update buoi_hoc set trang_thai = 'mo', ly_do_huy = null, updated_at = now() where id = r.buoi_id;
  end if;
  update buoi_hoc_hs set diem_danh = null, btyeu_che_do = null where id = p_bhh;
end $function$;

-- ── 4) Tự vắng khi không có bài (tác vụ nền, 0h mỗi ngày) ──────────────────────
create or replace function public._btnhe_tu_vang(p_ngan_giay integer default 20)
returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare v_bd timestamptz := clock_timestamp(); v_hom date := (now() at time zone 'Asia/Ho_Chi_Minh')::date; v_n int := 0; r record;
begin
  if not public._la_tac_vu_nen() then raise exception 'Chỉ tác vụ nền.'; end if;
  for r in
    select b.id as buoi_id, hh.id as bhh from buoi_hoc b
      join ca_bo_tro_nhe cn on cn.id = b.ca_bo_tro_nhe_id and cn.trang_thai <> 'huy'
      join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id
     where b.loai = 'bo_tro_nhe' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null and b.ngay < v_hom and hh.diem_danh is null
       and not exists (select 1 from bai_test bt join bai_lam bl on bl.bai_test_id = bt.id where bt.buoi_hoc_id = b.id)
     order by b.ngay
  loop
    exit when clock_timestamp() - v_bd > make_interval(secs => p_ngan_giay);
    update buoi_hoc_hs set diem_danh = 'vang' where id = r.bhh;
    update buoi_hoc set trang_thai = 'huy', updated_at = now(),
           ly_do_huy = 'Hệ thống: không có bài làm — tự điểm danh vắng (Trang sửa nếu cần)' where id = r.buoi_id;
    v_n := v_n + 1;
  end loop;
  return jsonb_build_object('tu_vang', v_n);
end $$;
revoke execute on function public._btnhe_tu_vang(integer) from public, anon, authenticated;

insert into tinh_san_dang_ky (ma, ten, lenh, chu_ky_phut, gio_chay, uu_tien, ngan_sach_giay, bat, ghi_chu)
values ('sau_gio_tu_vang', 'Bổ trợ sau giờ: không có bài ⇒ hệ thống điểm danh vắng', 'public._btnhe_tu_vang(30)',
        1200, array[0], 14, 30, true, 'Thùy 21/11 · idempotent · chạy TRƯỚC reset thứ Hai (uu_tien 14 < 15) · Trang sửa bằng fn_btnhe_diem_danh')
on conflict (ma) do update set lenh = excluded.lenh, chu_ky_phut = excluded.chu_ky_phut, gio_chay = excluded.gio_chay,
  uu_tien = excluded.uu_tien, ngan_sach_giay = excluded.ngan_sach_giay, bat = excluded.bat, ghi_chu = excluded.ghi_chu;
