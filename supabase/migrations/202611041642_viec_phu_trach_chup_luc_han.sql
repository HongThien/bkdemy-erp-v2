-- ============================================================================
-- viec_phu_trach_chup_luc_han — Thùy 04/11: gậy phải theo NGƯỜI PHỤ TRÁCH LÚC TỚI HẠN, ghi + chụp lại,
-- không tính theo phân công HIỆN TẠI.
-- ----------------------------------------------------------------------------
-- LỖI CŨ: máy quét gậy lấy người từ fn_viec_buoi_thuong = phan_cong_lop BÂY GIỜ. Lớp đổi TA (A → B) thì mọi việc
-- trễ cũ của lớp đó, kể cả lúc A còn giữ lớp, bị đề xuất gậy cho B. Ca thật: 8B1 — Khánh giữ tới 03/11, 3 đề xuất
-- BTVN hạn 22/10 · 26/10 · 02/11 lại đứng tên Đỗ Xuân Phong (nhận lớp 03/11).
--
-- MỚI: bảng chụp BẤT BIẾN viec_phu_trach_snap — mỗi (buổi × khâu) chụp người phụ trách TẠI GIỜ HẠN, ghi 1 lần,
-- không sửa không xoá (trigger chặn). Máy quét gậy chỉ đọc bản chụp.
--   · danhgia / et / btvn / ingame: tra NGƯỢC sổ phan_cong_lop_log về đúng giờ hạn (sổ tin được từ 12/10/2026)
--     ⇒ chụp muộn vẫn ra đúng người. Luật chọn y hệt nguoiPhuTrach (lib/gay.ts): 1 người của vai đó, hoặc người
--     'chính' duy nhất; mơ hồ ⇒ KHÔNG chụp (§1.5 thà bỏ trống còn hơn gán sai).
--   · mt: người làm theo SƠ ĐỒ TỔ CHỨC (vi_tri — KHÔNG có sổ lịch sử) ⇒ chỉ chụp được khi gần hạn: trong 6 giờ
--     sau hạn. Quá 6 giờ mà chưa chụp ⇒ bỏ trống, không đoán theo sơ đồ hiện tại. Cần cron 10 phút
--     (file *_cron_sql_editor.sql cùng đợt — Thùy chạy SQL Editor vì claude_build không vào schema cron).
-- ============================================================================

create table if not exists public.viec_phu_trach_snap (
  buoi_id    uuid        not null references public.buoi_hoc(id),
  tab        text        not null check (tab in ('ingame', 'et', 'btvn', 'danhgia', 'mt')),
  nhan_su_id uuid        not null references public.nhan_su(id),
  han        timestamptz not null,
  nguon      text        not null check (nguon in ('nhat_ky_phan_cong', 'so_do_luc_chup')),
  chup_at    timestamptz not null default now(),
  primary key (buoi_id, tab, nhan_su_id)
);
create index if not exists viec_phu_trach_snap_ns on public.viec_phu_trach_snap (nhan_su_id, han);

create or replace function public._viec_phu_trach_snap_bat_bien() returns trigger
language plpgsql as $$
begin
  raise exception 'viec_phu_trach_snap là bản chụp bất biến — không sửa, không xoá (Thùy 04/11)';
end $$;
drop trigger if exists viec_phu_trach_snap_bat_bien on public.viec_phu_trach_snap;
create trigger viec_phu_trach_snap_bat_bien before update or delete on public.viec_phu_trach_snap
  for each row execute function public._viec_phu_trach_snap_bat_bien();

alter table public.viec_phu_trach_snap enable row level security;
drop policy if exists viec_phu_trach_snap_doc on public.viec_phu_trach_snap;
create policy viec_phu_trach_snap_doc on public.viec_phu_trach_snap
  for select to authenticated using (public.la_thanh_vien());

-- Phân công của 1 lớp TẠI thời điểm p_ts (sự kiện cuối ≤ p_ts của mỗi người×vai không phải 'xoa').
create or replace function public._pc_luc(p_lop uuid, p_ts timestamptz)
returns table (nhan_su_id uuid, vai_tro text, la_chinh boolean)
language sql stable security definer set search_path = public
as $$
  select x.nhan_su_id, x.vai_tro, coalesce(x.la_chinh, false)
  from (select distinct on (l.nhan_su_id, l.vai_tro) l.nhan_su_id, l.vai_tro, l.la_chinh, l.hanh_dong
        from phan_cong_lop_log l
        where l.lop_id = p_lop and l.ts <= p_ts
        order by l.nhan_su_id, l.vai_tro, l.ts desc) x
  where x.hanh_dong <> 'xoa';
$$;

-- Người của 1 vai tại p_ts: đúng 1 người ⇒ người đó; nhiều người ⇒ người 'chính' duy nhất; còn lại ⇒ null.
create or replace function public._pc_chon(p_lop uuid, p_ts timestamptz, p_vai text)
returns uuid
language sql stable security definer set search_path = public
as $$
  with c as (select * from public._pc_luc(p_lop, p_ts) where vai_tro = p_vai)
  select case when (select count(*) from c) = 1 then (select nhan_su_id from c)
              when (select count(*) from c where la_chinh) = 1 then (select nhan_su_id from c where la_chinh) end;
$$;

revoke execute on function public._pc_luc(uuid, timestamptz) from public, anon, authenticated;
revoke execute on function public._pc_chon(uuid, timestamptz, text) from public, anon, authenticated;

-- CHỤP: mọi việc buổi thường đã tới hạn mà chưa có bản chụp, buổi từ p_tu (mặc định 10 ngày trước) tới hôm nay.
-- Idempotent (on conflict do nothing) — cron 10 phút + máy quét gậy cùng gọi được.
create or replace function public.fn_viec_chup_phu_trach(p_tu date default null)
returns integer
language plpgsql security definer set search_path = public
as $$
declare
  v_hom_nay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
  v_n int;
begin
  with b as (
    select bh.id, bh.lop_id, bh.ngay, bh.gio_bat_dau, l.mon, l.khoi,
           exists (select 1 from tai_lieu tl where tl.loai = 'mt_buoi' and tl.lop_id = bh.lop_id and tl.ngay = bh.ngay) as co_mt
    from buoi_hoc bh join lop l on l.id = bh.lop_id
    where bh.loai = 'thuong' and bh.trang_thai <> 'huy'
      and bh.ngay >= coalesce(p_tu, v_hom_nay - 10) and bh.ngay <= v_hom_nay
  ),
  t as (   -- khâu của buổi: y hệt fn_viec_buoi_thuong (MT thay hẳn các khâu; ingame bỏ từ 01/10/2026)
    select b.*, x.tab, public.fn_han_viec(b.lop_id, b.ngay, b.gio_bat_dau, x.tab) as han
    from b cross join lateral unnest(
      case when b.co_mt then array['mt']
           when b.ngay >= date '2026-10-01' then array['danhgia', 'et', 'btvn']
           else array['danhgia', 'ingame', 'et', 'btvn'] end) as x(tab)
  ),
  cho as (
    select t.* from t
    where t.han is not null and t.han <= now()
      and not exists (select 1 from viec_phu_trach_snap s where s.buoi_id = t.id and s.tab = t.tab)
  )
  insert into viec_phu_trach_snap (buoi_id, tab, nhan_su_id, han, nguon)
  select c.id, c.tab, o.ns, c.han, o.nguon
  from cho c
  cross join lateral (
    select x.ns, 'nhat_ky_phan_cong'::text as nguon
    from (select case c.tab
                   when 'danhgia' then public._pc_chon(c.lop_id, c.han, 'gv')
                   when 'ingame'  then case when exists (select 1 from public._pc_luc(c.lop_id, c.han) p where p.vai_tro = 'tg')
                                            then public._pc_chon(c.lop_id, c.han, 'tg') else public._pc_chon(c.lop_id, c.han, 'gv') end
                   else public._pc_chon(c.lop_id, c.han, 'tg') end as ns) x
    where c.tab <> 'mt' and x.ns is not null
    union all
    -- MT: Phó khối (không có ⇒ Trưởng) theo sơ đồ — chỉ khi đang sát hạn
    select k.nhan_su_id, 'so_do_luc_chup'
    from public._khoi_van_hanh(c.mon, c.khoi) k
    where c.tab = 'mt' and now() - c.han <= interval '6 hours'
    union all
    -- MT, khối không ai giữ ghế ⇒ GV chính của lớp tại giờ hạn
    select g.ns, 'nhat_ky_phan_cong'
    from (select public._pc_chon(c.lop_id, c.han, 'gv') as ns) g
    where c.tab = 'mt' and now() - c.han <= interval '6 hours' and g.ns is not null
      and not exists (select 1 from public._khoi_van_hanh(c.mon, c.khoi))
  ) o
  on conflict do nothing;
  get diagnostics v_n = row_count;
  return v_n;
end $$;

revoke execute on function public.fn_viec_chup_phu_trach(date) from public, anon;
grant execute on function public.fn_viec_chup_phu_trach(date) to authenticated;

-- ỨNG VIÊN GẬY VẬN HÀNH: việc buổi đã chụp người, buổi từ p_tu, buổi còn hiệu lực. Trễ hay không do
-- fn_viec_tien_do đo (theo lần đóng đầu) — hàm này chỉ trả "việc nào, của AI lúc hạn".
create or replace function public.fn_gay_ung_vien_vh(p_tu date)
returns table (nhan_su_id uuid, buoi_id uuid, lop_id uuid, ten_lop text, ngay date, tab text,
               han timestamptz, et_online boolean, ref_key text)
language sql stable set search_path = public
as $$
  select s.nhan_su_id, s.buoi_id, bh.lop_id, l.ten_lop, bh.ngay, s.tab, s.han,
         exists (select 1 from bai_test bt where bt.lop_id = bh.lop_id and bt.ngay = bh.ngay and bt.loai = 'et'),
         'vh:' || s.buoi_id::text || '|' || s.tab || '|' || s.nhan_su_id::text
  from viec_phu_trach_snap s
  join buoi_hoc bh on bh.id = s.buoi_id and bh.loai = 'thuong' and bh.trang_thai <> 'huy'
  join lop l on l.id = bh.lop_id
  where bh.ngay >= p_tu;
$$;
revoke execute on function public.fn_gay_ung_vien_vh(date) from public, anon;
grant execute on function public.fn_gay_ung_vien_vh(date) to authenticated;

-- ── CHỤP BÙ cho buổi từ 01/10 (khâu tra sổ phân công; MT quá 6 giờ tự bỏ trống) ──
select public.fn_viec_chup_phu_trach(date '2026-10-01');

-- ── SỬA ĐỀ XUẤT ĐANG CHỜ ĐỨNG SAI TÊN ──
-- Đề xuất 'cho' mà bản chụp nói việc đó của NGƯỜI KHÁC lúc hạn: chuyển sang đúng người (đề xuất mới, giữ mô tả/hạn/
-- phút trễ), đề xuất cũ ⇒ bo_qua kèm lý do ghi rõ người đúng. Đề xuất đã CHỐT thành gậy (da_danh) KHÔNG đụng — Thùy quyết.
create temp table _sai on commit drop as
select d.id, d.nhan_su_id, d.mo_ta, d.deadline_at, d.tre_phut, d.so_gay,
       substring(d.ref_key from '^vh:([0-9a-f-]{36})[|]')::uuid as buoi_id, split_part(d.ref_key, '|', 2) as tab
from gay_de_xuat d
where d.trang_thai = 'cho' and d.nguon = 'vanhanh' and d.ref_key ~ '^vh:[0-9a-f-]{36}[|]';
delete from _sai s
where not exists (select 1 from viec_phu_trach_snap p where p.buoi_id = s.buoi_id and p.tab = s.tab)
   or exists (select 1 from viec_phu_trach_snap p where p.buoi_id = s.buoi_id and p.tab = s.tab and p.nhan_su_id = s.nhan_su_id);

insert into gay_de_xuat (nhan_su_id, nguon, ref_key, mo_ta, deadline_at, tre_phut, so_gay)
select p.nhan_su_id, 'vanhanh', 'vh:' || s.buoi_id::text || '|' || s.tab || '|' || p.nhan_su_id::text,
       s.mo_ta, s.deadline_at, s.tre_phut, s.so_gay
from _sai s
join viec_phu_trach_snap p on p.buoi_id = s.buoi_id and p.tab = s.tab
join nhan_su n on n.id = p.nhan_su_id and not coalesce(n.mien_gay, false)
on conflict (ref_key) do nothing;

update gay_de_xuat d
set trang_thai = 'bo_qua', quyet_at = now(), nguoi_quyet = null,
    ly_do_bo_qua = 'Sai người (máy cũ tính theo phân công HIỆN TẠI) — lúc tới hạn việc này của '
                   || (select string_agg(n.ho_ten, ', ') from viec_phu_trach_snap p join nhan_su n on n.id = p.nhan_su_id
                        where p.buoi_id = s.buoi_id and p.tab = s.tab)
                   || ', đề xuất đã chuyển sang người đó (Thùy 04/11)'
from _sai s
where d.id = s.id and d.trang_thai = 'cho';
