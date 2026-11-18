-- MỤC TIÊU TUẦN — (1) CHẶN công bố khi lớp chưa đủ giáo trình tuần · (2) CÔNG BỐ LẠI (Thùy 18/11:
-- "cần có tính năng công bố lại, ví dụ 9A1 bị lỗi giáo trình t đã công bố rồi. Đáng lẽ ko đủ giáo trình thì ko cho công bố").
-- spec-van-hanh-tuan.md §4.6. Không xoá / không sửa dòng sổ nào: bản khoá cũ giữ làm vết, công bố lại = một dòng mới ở sổ mtt_cong_bo_lai,
-- bản khoá có hiệu lực của một em = bản mới nhất ghi SAU lần công bố lại gần nhất của lớp em.
-- Thân _mtt_tinh / _mtt_ghi / fn_mtt_trung_tam = thân đang chạy 18/11 19:20 (pg_get_functiondef, bỏ CR) + vá đúng 1 chỗ mỗi hàm.

-- ── 1. Sổ công bố lại (chỉ thêm) ────────────────────────────────────────────
create table public.mtt_cong_bo_lai (
  so      bigint generated always as identity primary key,
  tuan    date not null,
  lop_id  uuid not null references public.lop(id) on delete cascade,
  at      timestamptz not null default now(),
  boi     uuid references public.nhan_su(id),
  ly_do   text not null check (btrim(ly_do) <> '')
);
create index mtt_cong_bo_lai_tuan_lop_idx on public.mtt_cong_bo_lai (tuan, lop_id, at desc);
create index mtt_cong_bo_lai_lop_idx on public.mtt_cong_bo_lai (lop_id);
create index mtt_cong_bo_lai_boi_idx on public.mtt_cong_bo_lai (boi);
alter table public.mtt_cong_bo_lai enable row level security;   -- không policy cho người đăng nhập: chỉ đọc / ghi qua hàm có cổng
create trigger mtt_cong_bo_lai_bat_bien_trg before delete or update on public.mtt_cong_bo_lai
  for each row execute function public._mtt_chot_bat_bien();

-- ── 2. Bản khoá kế hoạch: một em có thể có nhiều bản trong một tuần (mỗi lần công bố lại một bản) — không mất dòng nào
alter table public.mtt_ke_hoach drop constraint mtt_ke_hoach_pkey,
  add constraint mtt_ke_hoach_pkey primary key (tuan, mon, hoc_sinh_id, chot_at);

-- ── 3. Hàm nội bộ (một nguồn) ───────────────────────────────────────────────
-- số buổi của tuần ĐÃ có giáo trình (tài liệu của lớp ngày đó, hoặc buổi kế hoạch ở Giáo trình tuần) — cột "Giáo trình x/y" và cổng công bố cùng đọc
create function public._mtt_buoi_co_gt(p_lop uuid, p_tuan date) returns int
language sql stable set search_path to 'public' as $$
  select count(*)::int from public._mtt_buoi_tuan(p_lop, p_tuan) bt
   where exists (select 1 from tai_lieu tl where tl.lop_id = p_lop and tl.ngay = bt.ngay and tl.hoc_sinh_id is null
                   and tl.loai in ('giao_trinh_buoi', 'et', 'btvn'))
      or exists (select 1 from gtt_ca g where g.lop_id = p_lop and g.ngay = bt.ngay)
$$;
-- mốc công bố lại gần nhất của các lớp em đang học trong tuần (null = chưa công bố lại lần nào)
create function public._mtt_moc_cong_bo_lai(p_tuan date, p_lop uuid[]) returns timestamptz
language sql stable set search_path to 'public' as $$
  select max(b.at) from mtt_cong_bo_lai b where b.tuan = p_tuan and b.lop_id = any(p_lop)
$$;
-- cổng chung của Công bố / Công bố lại: nhân sự · phạm vi môn × khối · tuần chưa qua · ĐỦ giáo trình
create function public._mtt_kiem_cong_bo(p_lop uuid, p_tuan date) returns void
language plpgsql stable set search_path to 'public' as $$
declare v_l record; v_so int; v_co int;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select l.id, l.mon, l.khoi, l.ten_lop into v_l from lop l where l.id = p_lop;
  if not found then raise exception 'Không thấy lớp.'; end if;
  if not exists (select 1 from public.fn_pham_vi_cua_toi() p where p.mon = v_l.mon and p.khoi = v_l.khoi) then
    raise exception 'Lớp ngoài phạm vi của bạn.';
  end if;
  if p_tuan < public._mtt_tuan(public._mtt_hom_nay()) then raise exception 'Không công bố được tuần đã qua.'; end if;
  select count(*) into v_so from public._mtt_buoi_tuan(p_lop, p_tuan);
  v_co := public._mtt_buoi_co_gt(p_lop, p_tuan);
  if v_co < v_so then
    raise exception 'Lớp % mới có giáo trình %/% buổi của tuần — điền đủ Giáo trình tuần rồi mới công bố.', v_l.ten_lop, v_co, v_so;
  end if;
end $$;
revoke all on function public._mtt_buoi_co_gt(uuid, date), public._mtt_moc_cong_bo_lai(date, uuid[]), public._mtt_kiem_cong_bo(uuid, date)
  from public, anon, authenticated;

-- ── 4. Công bố (thêm cổng đủ giáo trình) · Công bố lại ──────────────────────
create or replace function public.fn_mtt_chot_lop(p_lop uuid, p_tuan date default null::date)
 returns jsonb language plpgsql security definer set search_path to 'public'
as $function$
declare
  v_t date := public._mtt_tuan(coalesce(p_tuan, public._mtt_hom_nay()));
begin
  perform public._mtt_kiem_cong_bo(p_lop, v_t);
  insert into mtt_lop_chot (tuan, lop_id, chot_boi) values (v_t, p_lop, public.current_nhan_su_id())
  on conflict (tuan, lop_id) do nothing;
  return jsonb_build_object('tuan', v_t, 'lop_id', p_lop,
                            'chot_at', (select c.chot_at from mtt_lop_chot c where c.tuan = v_t and c.lop_id = p_lop),
                            'da_tinh', 0,
                            'tong', (select count(*) from hoc_sinh_lop hl join hoc_sinh h on h.id = hl.hoc_sinh_id
                                      where hl.lop_id = p_lop and hl.trang_thai = 'dang_hoc' and h.trang_thai = 'dang_hoc'));
end $function$;

-- Công bố lại: lớp ĐÃ công bố, tuần đang chạy, bắt buộc lý do. Ghi một dòng sổ; bản khoá Phần 1 cũ hết hiệu lực (vẫn nằm trong mtt_ke_hoach),
-- bộ điều phối khoá lại theo giáo trình hiện tại ở lượt kế (≤ 5 phút) — đánh dấu tờ của lớp "chưa có bản khoá" để được tính trước.
create function public.fn_mtt_cong_bo_lai(p_lop uuid, p_tuan date, p_ly_do text) returns jsonb
language plpgsql security definer set search_path to 'public' as $function$
declare
  v_t  date := public._mtt_tuan(coalesce(p_tuan, public._mtt_hom_nay()));
  v_at timestamptz;
begin
  perform public._mtt_kiem_cong_bo(p_lop, v_t);
  if btrim(coalesce(p_ly_do, '')) = '' then raise exception 'Công bố lại phải ghi lý do.'; end if;
  if not exists (select 1 from mtt_lop_chot c where c.tuan = v_t and c.lop_id = p_lop) then
    raise exception 'Lớp chưa công bố tuần này — dùng nút Công bố.';
  end if;
  perform pg_advisory_xact_lock(hashtextextended('mtt_cong_bo_lai|' || p_lop::text || '|' || v_t::text, 0));
  insert into mtt_cong_bo_lai (tuan, lop_id, boi, ly_do) values (v_t, p_lop, public.current_nhan_su_id(), btrim(p_ly_do))
  returning at into v_at;
  update mtt_luu set payload = payload - 'ke_hoach_at' where tuan = v_t and lop_id = p_lop;   -- bảng đệm: báo bộ điều phối tính lại lớp này trước
  return jsonb_build_object('tuan', v_t, 'lop_id', p_lop, 'at', v_at,
                            'tong', (select count(*) from hoc_sinh_lop hl join hoc_sinh h on h.id = hl.hoc_sinh_id
                                      where hl.lop_id = p_lop and hl.trang_thai = 'dang_hoc' and h.trang_thai = 'dang_hoc'));
end $function$;
revoke all on function public.fn_mtt_cong_bo_lai(uuid, date, text) from public, anon;
grant execute on function public.fn_mtt_cong_bo_lai(uuid, date, text) to authenticated;

-- ── 5. Ba hàm đang chạy, mỗi hàm vá đúng 1 chỗ ──────────────────────────────
CREATE OR REPLACE FUNCTION public._mtt_tinh(p_hs uuid, p_mon text, p_tuan date, p_den timestamp with time zone DEFAULT NULL::timestamp with time zone)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_bdm    boolean := public._mastery_bdm_bat();
  v_tu     date := p_tuan;
  v_toi    date := p_tuan + 6;
  v_den    timestamptz := coalesce(p_den, now());
  v_today  date := (coalesce(p_den, now()) at time zone 'Asia/Ho_Chi_Minh')::date;
  v_han30  bigint := extract(epoch from public._mtt_moc(p_tuan + 7) - interval '30 days')::bigint;
  v_hs     record;
  v_lop    uuid[];
  v_lop1   uuid;
  v_chot   boolean;
  v_buoi   jsonb;
  v_ho_tro jsonb;
  v_p      jsonb;
  v_dau    jsonb;
  v_n2     text[];
  v_nhom   jsonb;
  v_viec   jsonb;
  v_tl     jsonb;
  v_sap    jsonb;
  v_hang   jsonb;
  v_td     numeric;
  v_td_dau numeric;
  v_kh     record;
  v_dmap   jsonb;
  v_them   jsonb := '[]'::jsonb;
begin
  select h.id, h.ho_ten, h.khoi into v_hs from hoc_sinh h where h.id = p_hs;
  if not found then return null; end if;

  -- lớp của em cho môn này có mặt trong tuần (vào trước hết tuần, chưa rời trước đầu tuần)
  select array_agg(distinct l.id), (array_agg(l.id order by hl.ngay_vao desc))[1]
    into v_lop, v_lop1
    from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
   where hl.hoc_sinh_id = p_hs and l.mon = p_mon
     and hl.ngay_vao <= v_toi and coalesce(hl.ngay_roi, 'infinity'::date) >= v_tu;
  v_lop := coalesce(v_lop, '{}');
  v_chot := exists (select 1 from mtt_lop_chot c where c.tuan = p_tuan and c.lop_id = any(v_lop));

  -- buổi thường của lớp quanh tuần + buổi kế (lead) — chỉ buổi em đã ở trong lớp
  -- 16/11 Giáo trình tuần (spec-giao-trinh-tuan §6): buổi thường tương lai chưa có dòng buoi_hoc (sinh lúc mở buổi) ⇒ thêm CA CHIẾU từ TKB
  -- (_gtt_ca, từ hôm nay trở đi, chưa có buổi thường, không huỷ; id null). Nhờ vậy cửa sổ "buổi cuối tuần trước + buổi đầu tuần này" đủ ngay
  -- thứ Hai (lead 'sau' thấy buổi kế), và nhóm của buổi sắp dạy lấy từ kế hoạch tuần (_mtt_nhom_buoi nhánh gtt_ca).
  with b0 as (
    select bh.id, bh.lop_id, bh.ngay, bh.gio_bat_dau
      from buoi_hoc bh
     where bh.lop_id = any(v_lop) and bh.loai = 'thuong' and bh.trang_thai <> 'huy'
       and bh.ngay between v_tu - 28 and v_toi + 21
    union all
    select null::uuid, c.lop_id, c.ngay, c.gio_bat_dau
      from public._gtt_ca(v_lop, greatest(v_tu - 28, v_today), v_toi + 21) c
     where c.buoi_hoc_id is null and not c.huy
  ),
  b as (
    select b0.*, lead(b0.ngay) over (partition by b0.lop_id order by b0.ngay, b0.gio_bat_dau) as sau from b0
  )
  select coalesce(jsonb_agg(jsonb_build_object(
           'id', b.id, 'lop_id', b.lop_id, 'ngay', b.ngay, 'sau', b.sau,
           'w', b.ngay between v_tu and v_toi, 's', coalesce(b.sau between v_tu and v_toi, false),
           'dd', (select x.diem_danh from buoi_hoc_hs x where x.buoi_hoc_id = b.id and x.hoc_sinh_id = p_hs limit 1),
           'nhom', to_jsonb(public._mtt_nhom_buoi(b.lop_id, b.ngay, b.id)),
           'lui', case when coalesce(b.sau between v_tu and v_toi, false)
                       then to_jsonb(public._mtt_nhom_lui(b.lop_id, b.ngay)) else '[]'::jsonb end) order by b.ngay, b.gio_bat_dau), '[]'::jsonb)
    into v_buoi
    from b
   where (b.ngay between v_tu and v_toi or b.sau between v_tu and v_toi)
     and exists (select 1 from hoc_sinh_lop hl where hl.hoc_sinh_id = p_hs and hl.lop_id = b.lop_id
                    and hl.ngay_vao <= b.ngay and coalesce(hl.ngay_roi, 'infinity'::date) >= b.ngay);

  -- ca hỗ trợ trong tuần: test sau giờ (bo_tro_nhe) · bổ trợ yếu (bo_tro_yeu)
  select coalesce(jsonb_agg(jsonb_build_object(
           'id', b.id, 'loai', b.loai, 'ngay', b.ngay, 'gio', to_char(b.gio_bat_dau, 'HH24:MI'),
           'phong', coalesce(b.phong, cn.phong, cb.phong), 'dd', x.diem_danh) order by b.ngay, b.gio_bat_dau), '[]'::jsonb)
    into v_ho_tro
    from buoi_hoc_hs x
    join buoi_hoc b on b.id = x.buoi_hoc_id
    left join ca_bo_tro_nhe cn on cn.id = b.ca_bo_tro_nhe_id
    left join ca_bo_tro cb on cb.id = b.ca_bo_tro_id
    left join lop lb on lb.id = b.lop_id
   where x.hoc_sinh_id = p_hs and b.loai in ('bo_tro_nhe', 'bo_tro_yeu') and b.trang_thai <> 'huy'
     and b.ngay between v_tu and v_toi
     and coalesce(cn.mon, cb.mon, lb.mon) = p_mon
     and coalesce(cn.trang_thai, 'mo') <> 'huy' and coalesce(cb.trang_thai, 'mo') <> 'huy';

  -- % nhóm hiện tại = mastery theo lần ĐANG CHẠY (có BTVN), chỉ nhóm của bản đồ môn này (như Dashboard học tập / bổ trợ)
  select coalesce(jsonb_object_agg(m.nut, jsonb_build_object('s', round(m.score, 4), 'n', m.n, 'muc', m.muc)), '{}'::jsonb)
    into v_p
    from public._mastery_lan_cap_nhanh(v_bdm, array[p_hs], true, null, p_den, array['nhom'], 5, 5, 3) m
    left join dai_bdm_nhom nb on nb.id = m.nut
    left join hinh_hoc_bai hh on hh.ma_bai = m.nut
   where public._kho_ban_do_tbl(p_mon) = 'dai_ban_do' and m.cap = 'nhom' and m.score is not null
     and (nb.id is not null or hh.ma_bai is not null);

  -- số đầu tuần: bản chụp nếu đã có (bất biến), chưa có thì tính tại mốc
  select d.nhom into v_dau from mtt_dau d where d.tuan = p_tuan and d.hoc_sinh_id = p_hs;
  v_dau := coalesce(v_dau, public._mtt_dau_tinh(p_hs, p_tuan));

  -- Phần 2 = nhóm do lượt chốt bổ trợ đưa vào: đề xuất MỚI NHẤT đã duyệt gần đây + dạng của case bổ trợ còn mở
  select coalesce(array_agg(distinct x.ma) filter (where x.ma is not null), '{}') into v_n2 from (
    select e->>'ma' as ma
      from bo_tro_de_xuat d cross join lateral jsonb_array_elements(d.nhom) e
     where d.hoc_sinh_id = p_hs and d.mon = p_mon and d.trang_thai = 'da_duyet'
       and d.id = (select d2.id from bo_tro_de_xuat d2 where d2.hoc_sinh_id = p_hs and d2.mon = p_mon
                     and d2.tao_at < v_den order by d2.tao_at desc limit 1)
       and coalesce(d.duyet_at, d.tao_at) >= public._mtt_moc(v_tu) and coalesce(d.duyet_at, d.tao_at) < v_den   /* 16/11: lượt chốt chỉ hiệu lực trong tuần duyệt */
    union all
    select public._mtt_nhom_cua_o(public._do_o_quy(v_bdm, false, '', yd.ma_dang))   /* 16/11: ô → nhóm */
      from bo_tro_yeu y join bo_tro_yeu_dang yd on yd.bo_tro_yeu_id = y.id
     where y.hoc_sinh_id = p_hs and y.mon = p_mon and y.trang_thai in ('dang_xu', 'nhe_mo')
       and yd.dong_at is null and y.created_at < v_den
  ) x;

  -- NHÓM của tờ: Phần 1 (dạy trong cửa sổ) + Phần 2 (nợ). Một nhóm chỉ ở 1 phần (nợ ưu tiên).
  with bb as (select e as b from jsonb_array_elements(v_buoi) e),
  n1 as (   -- nhóm của buổi thuộc cửa sổ (s) + số lần đo dự kiến trong tuần: ET của buổi trong tuần (w) + BTVN của buổi cửa sổ (s)
    -- 13/11 BTVN xếp chồng: nhóm luyện lại trong phiếu của buổi cửa sổ (lui) = thêm 1 lần đo, vẫn thuộc Phần 1
    select x.ma, sum(x.k)::int as k, bool_or(x.s) as trong_cua_so,
           jsonb_agg(distinct x.ngay) filter (where x.s and x.goc) as ngay_hoc
      from (
        select n.value #>> '{}' as ma,
               case when (bb.b->>'s')::boolean then 2 else 0 end as k,
               (bb.b->>'s')::boolean as s, true as goc, bb.b->'ngay' as ngay   /* 17/11 tối (Thùy): buổi thuộc tuần của BUỔI KẾ (lùi một buổi); ET + BTVN của buổi đi CÙNG buổi ⇒ 2 lần đo */
          from bb cross join lateral jsonb_array_elements(bb.b->'nhom') n
        union all
        select n.value #>> '{}', 1, true, false, bb.b->'ngay'
          from bb cross join lateral jsonb_array_elements(coalesce(bb.b->'lui', '[]'::jsonb)) n
         where not coalesce(bb.b->'nhom', '[]'::jsonb) @> jsonb_build_array(n.value)
      ) x
     group by 1
  ),
  tat as (
    select coalesce(n2.ma, n1.ma) as ma,
           case when n2.ma is not null then 2 else 1 end as phan,
           coalesce(n1.k, 0) + case when n2.ma is not null then jsonb_array_length(v_ho_tro) else 0 end as k,
           n1.ngay_hoc
      from (select ma, k, ngay_hoc from n1 where trong_cua_so) n1
      full join (select unnest(v_n2) as ma) n2 on n2.ma = n1.ma
  ),
  t2 as (
    select tat.*, public._mtt_ten_nhom(tat.ma) as ten,
           (v_p->tat.ma->>'s')::numeric as p, (v_p->tat.ma->>'n')::int as n,
           (public._mtt_dau_buoi(v_dau->tat.ma, tat.ngay_hoc)->>'s')::numeric as p_dau,   /* 17/11 tối: khởi điểm = TRƯỚC buổi của tuần */
           coalesce((v_dau->tat.ma->>'cs')::int, case when tat.ma like 'HH%' then 3 else 5 end) as cs,
           coalesce(public._mtt_dau_buoi(v_dau->tat.ma, tat.ngay_hoc)->'lan', '[]'::jsonb) as lan,
           (select count(*) from dai_bdm_dang_bai db where db.nhom_id = tat.ma)::int as tong_dang
      from tat
  ),
  t3 as (
    select t2.*,
           case when t2.k > 0 then (
             select least(0.8, avg(z.v)) from (
               select s.v from (
                 select 0.8::numeric as v, 0 as o, gs as i from generate_series(1, t2.k) gs
                 union all
                 select (a.e->>1)::numeric, 1, a.ord::int from jsonb_array_elements(t2.lan) with ordinality as a(e, ord)
                  where (a.e->>0)::bigint > v_han30
               ) s order by s.o, s.i limit t2.cs
             ) z) end as mt
      from t2
  )
  select coalesce(jsonb_agg(jsonb_build_object(
           'ma', t3.ma, 'ten', t3.ten, 'phan', t3.phan,
           'p', case when t3.p is not null then round(100 * t3.p)::int end, 'n', t3.n,
           'muc', v_p->t3.ma->>'muc',   /* 17/11 tối: mức của nhóm (dat · can_luyen · yeu — ngưỡng 80/50 của mastery) ⇒ màn hiện Đạt · Chưa đạt · Yếu */
           'p_dau', case when t3.p_dau is not null then round(100 * t3.p_dau)::int end,
           'd', case when t3.p is not null and t3.p_dau is not null then round(100 * t3.p)::int - round(100 * t3.p_dau)::int end,
           'mt', case when t3.mt is not null then round(100 * t3.mt)::int end, 'dich', 80,
           'k', t3.k, 'tong_dang', t3.tong_dang, 'ngay_hoc', coalesce(t3.ngay_hoc, '[]'::jsonb),
           'tien', case when t3.p is not null and t3.mt is not null and t3.mt > 0 then round(least(t3.p / t3.mt, 1), 4) end,
           'tien_dau', case when t3.p_dau is not null and t3.mt is not null and t3.mt > 0 then round(least(t3.p_dau / t3.mt, 1), 4) end)
         order by t3.phan, t3.p nulls last, t3.ten), '[]'::jsonb)
    into v_nhom
    from t3;

  -- ⭐ KẾ HOẠCH ĐÃ KHOÁ lúc chốt lớp (mig 202611161844): danh sách nhóm · phần · mục tiêu tuần · số lần đo = bản khoá;
  -- số đo (% hiện tại, đầu tuần, tiến độ) vẫn tính trực tiếp. Nhóm mới xuất hiện sau khi chốt ⇒ them_sau_chot (chỉ để nhân sự thấy).
  select k.nhom, k.viec, k.chot_at into v_kh from mtt_ke_hoach k where k.tuan = p_tuan and k.mon = p_mon and k.hoc_sinh_id = p_hs
     and k.chot_at >= coalesce(public._mtt_moc_cong_bo_lai(p_tuan, v_lop), '-infinity'::timestamptz)   /* 18/11: công bố lại ⇒ bản khoá cũ hết hiệu lực (mig 202611181916) */
   order by k.chot_at desc limit 1;
  if found then
    select coalesce(jsonb_agg(jsonb_build_object('ma', e->>'ma', 'ten', e->>'ten', 'phan', (e->>'phan')::int)), '[]'::jsonb)
      into v_them
      from jsonb_array_elements(v_nhom) e
     where (e->>'phan')::int = 1   /* 17/11 tối: chỉ Phần 1 bị khoá — Phần 2 luôn theo lượt chốt bổ trợ mới nhất */
       and not exists (select 1 from jsonb_array_elements(v_kh.nhom) x where x->>'ma' = e->>'ma' and (x->>'phan')::int = 1);
    with x as (
      select x.e->>'ma' as ma, x.e->>'ten' as ten, (x.e->>'phan')::int as phan, (x.e->>'mt')::numeric / 100 as mt,
             (x.e->>'k')::int as k, coalesce(x.e->'ngay_hoc', '[]'::jsonb) as ngay_hoc, x.o
        from jsonb_array_elements(v_kh.nhom) with ordinality as x(e, o)
       where (x.e->>'phan')::int = 1   /* 17/11 tối: bản khoá chỉ giữ Phần 1; nhóm nay là nợ (Phần 2 sống) thì nhường cho Phần 2 */
         and not exists (select 1 from jsonb_array_elements(v_nhom) l where (l->>'phan')::int = 2 and l->>'ma' = x.e->>'ma')
    ),
    y as (
      select x.*, (v_p->x.ma->>'s')::numeric as p, (v_p->x.ma->>'n')::int as n, (public._mtt_dau_buoi(v_dau->x.ma, x.ngay_hoc)->>'s')::numeric as p_dau,   /* 17/11 tối: khởi điểm trước buổi */
             (select count(*) from dai_bdm_dang_bai db where db.nhom_id = x.ma)::int as tong_dang
        from x
    )
    select coalesce(jsonb_agg(jsonb_build_object(
             'ma', y.ma, 'ten', y.ten, 'phan', y.phan,
             'p', case when y.p is not null then round(100 * y.p)::int end, 'n', y.n,
             'muc', v_p->y.ma->>'muc',   /* 17/11 tối */
             'p_dau', case when y.p_dau is not null then round(100 * y.p_dau)::int end,
             'd', case when y.p is not null and y.p_dau is not null then round(100 * y.p)::int - round(100 * y.p_dau)::int end,
             'mt', case when y.mt is not null then round(100 * y.mt)::int end, 'dich', 80,
             'k', y.k, 'tong_dang', y.tong_dang, 'ngay_hoc', y.ngay_hoc,
             'tien', case when y.p is not null and y.mt is not null and y.mt > 0 then round(least(y.p / y.mt, 1), 4) end,
             'tien_dau', case when y.p_dau is not null and y.mt is not null and y.mt > 0 then round(least(y.p_dau / y.mt, 1), 4) end)
           order by y.o), '[]'::jsonb)
           || coalesce((select jsonb_agg(l order by l->>'ten') from jsonb_array_elements(v_nhom) l where (l->>'phan')::int = 2), '[]'::jsonb)   /* 17/11 tối: Phần 2 LUÔN SỐNG */
      into v_nhom
      from y;
  end if;

  -- DẠNG của từng nhóm trong tuần (Thùy 16/11: "học sinh có mục tiêu học dạng A, click vào dạng A ⇒ lý thuyết · luyện tập") — để app mở thẳng màn dạng
  -- của Học từ đầu. Không khoá: là đường dẫn, đơn vị đánh giá vẫn là NHÓM. Nhóm không có dạng nào thấy được ⇒ 'dang' = [] (app hiện nút chung).
  v_dmap := public._mtt_dang_nhom(p_hs, p_mon, v_buoi, v_den, v_bdm);
  select coalesce(jsonb_agg(e || jsonb_build_object('dang', coalesce(v_dmap->(e->>'ma'), '[]'::jsonb),
                                              /* mig 202611180010: cờ đạt mục tiêu tuần — cùng điều kiện với tiến độ */
                                              'dat_mt', (e->>'p') is not null and (e->>'p')::numeric >= coalesce((e->>'mt')::numeric, (e->>'dich')::numeric, 80))
                              order by o), '[]'::jsonb)
    into v_nhom
    from jsonb_array_elements(v_nhom) with ordinality as t(e, o);

  -- đầu tuần: cùng tập nhóm đang tính tiến độ; nhóm CHƯA có số lúc đầu tuần (kiến thức mới) tính 0 — chưa học thì chưa tới đâu
  -- TIẾN ĐỘ (Thùy 17/11 khuya, mig 202611172340) = số nhóm CHẠM MỤC TIÊU TUẦN ÷ MỌI nhóm trên tờ (chưa đo = chưa đạt;
  -- nhóm không có mục tiêu tuần ⇒ so với đích 80). Đầu tuần: cùng phép đếm trên p_dau.
  select round(100.0 * count(*) filter (where e->>'p' is not null
                 and (e->>'p')::numeric >= coalesce((e->>'mt')::numeric, (e->>'dich')::numeric, 80)) / nullif(count(*), 0), 1),
         round(100.0 * count(*) filter (where e->>'p_dau' is not null
                 and (e->>'p_dau')::numeric >= coalesce((e->>'mt')::numeric, (e->>'dich')::numeric, 80)) / nullif(count(*), 0), 1)
    into v_td, v_td_dau
    from jsonb_array_elements(v_nhom) e;

  -- đang xếp hàng: nhóm đang YẾU mà chưa vào tờ tuần này
  select coalesce(jsonb_agg(jsonb_build_object('ma', k.key, 'ten', public._mtt_ten_nhom(k.key),
                                                'p', round(100 * (k.value->>'s')::numeric)::int) order by (k.value->>'s')::numeric), '[]'::jsonb)
    into v_hang
    from jsonb_each(v_p) k
   where k.value->>'muc' = 'yeu'
     and not exists (select 1 from jsonb_array_elements(v_nhom) e where e->>'ma' = k.key);

  -- sắp học: buổi trong tuần mà buổi kế đã sang tuần sau ⇒ tính vào mục tiêu tuần sau
  select jsonb_build_object('ngay', e->'ngay',
           'nhom', coalesce((select jsonb_agg(public._mtt_ten_nhom(n.value #>> '{}')) from jsonb_array_elements(e->'nhom') n), '[]'::jsonb))
    into v_sap
    from jsonb_array_elements(v_buoi) e
   where (e->>'w')::boolean and not (e->>'s')::boolean   /* 17/11 tối: khôi phục — buổi trong tuần mà buổi kế sang tuần sau ⇒ tính vào tuần sau */
   order by e->>'ngay' limit 1;

  -- VIỆC CỦA CON
  with bb as (select e as b from jsonb_array_elements(v_buoi) e),
  et as (
    select case when exists (select 1 from tai_lieu tl where tl.loai = 'mt_buoi' and tl.lop_id = (bb.b->>'lop_id')::uuid
                                and tl.ngay = (bb.b->>'ngay')::date and tl.hoc_sinh_id is null)
                then 'mt' else 'et' end::text as loai,   /* 17/11 tối: buổi có MT ⇒ việc MT thay ET (như việc nhân sự: buổi gán MT chỉ có Chấm MT) */
           (bb.b->>'id')::uuid as buoi_id, (bb.b->>'ngay')::date as ngay, null::date as han, bb.b->>'dd' as dd, 1 as o
      from bb where (bb.b->>'s')::boolean   /* 17/11 tối: ET của buổi thuộc tuần (s) — kể cả ca chiếu chưa mở buổi (id null ⇒ "sắp tới") */
  ),
  bt as (
    select 'btvn'::text, (bb.b->>'id')::uuid, (bb.b->>'ngay')::date, (bb.b->>'sau')::date, bb.b->>'dd', 2
      from bb where (bb.b->>'s')::boolean   /* 17/11 tối: BTVN của buổi thuộc tuần (s) — đi cùng ET của buổi đó, kể cả ca chiếu */
  ),
  ht as (
    select case h.value->>'loai' when 'bo_tro_nhe' then 'sau_gio' else 'bo_tro' end, (h.value->>'id')::uuid, (h.value->>'ngay')::date,
           null::date, h.value->>'dd', 3
      from jsonb_array_elements(v_ho_tro) h
  ),
  tat as (select * from et union all select * from bt union all select * from ht),
  d as (
    select tat.*, dm.pct, dm.so_cau,
           kq.thai_do, kq.trang_thai_nop,
           exists (select 1 from btvn_nop np where np.hoc_sinh_id = p_hs and np.buoi_hoc_id = tat.buoi_id and np.nop_at < v_den) as da_nop
      from tat
      left join lateral public._mtt_diem(p_hs, tat.buoi_id, case when tat.loai in ('btvn', 'mt') then tat.loai else 'et' end, p_den) dm on true
      left join btvn_ket_qua kq on tat.loai = 'btvn' and kq.hoc_sinh_id = p_hs and kq.buoi_hoc_id = tat.buoi_id
  ),
  d2 as (
    select d.*,
           case
             when d.pct is not null then 'xong'
             when d.loai = 'btvn' then case when d.da_nop or d.trang_thai_nop in ('nop_dung_han', 'nop_muon') then 'cho_cham'
                                            when d.trang_thai_nop = 'xin_phep' then 'xin_phep'
                                            when d.han is null or d.han > v_today then 'sap_toi'
                                            else 'chua_nop' end
             when d.ngay >= v_today then 'sap_toi'
             when d.dd in ('vang', 'vang_phep') then 'vang'
             else 'cho_cham'
           end as tt,
           case when d.pct is null then null
                when d.loai = 'btvn' and d.thai_do is not null and d.thai_do <> 'nghiem_tuc' then public._mtt_ha_muc(public._mtt_muc(d.pct))
                else public._mtt_muc(d.pct) end as muc
      from d
  )
  select coalesce(jsonb_agg(jsonb_build_object(
           'loai', d2.loai, 'buoi_id', d2.buoi_id, 'ngay', d2.ngay, 'han', d2.han, 'tt', d2.tt,
           'pct', case when d2.pct is not null then round(100 * d2.pct)::int end, 'so_cau', d2.so_cau, 'muc', d2.muc,
           'thai_do', d2.thai_do, 'nop', d2.trang_thai_nop, 'dd', d2.dd,
           'ghi_chu', case when d2.loai = 'btvn' and d2.pct is not null and d2.thai_do is not null and d2.thai_do <> 'nghiem_tuc'
                             then 'Thiếu nghiêm túc (hạ 1 mức)'
                           when d2.tt = 'vang' then 'Vắng — cần học bù'
                           when d2.loai = 'btvn' and d2.trang_thai_nop = 'nop_muon' then 'Nộp muộn' end,
           'nhom', case when d2.loai in ('sau_gio', 'bo_tro') then
                     (select jsonb_agg(e->'ten') from jsonb_array_elements(v_nhom) e where (e->>'phan')::int = 2)
                   else (select jsonb_agg(public._mtt_ten_nhom(n.value #>> '{}'))
                           from jsonb_array_elements(v_buoi) bx cross join lateral jsonb_array_elements(bx->'nhom') n
                          where (bx->>'id')::uuid = d2.buoi_id
                             or (d2.buoi_id is null and bx->>'id' is null and (bx->>'ngay')::date = d2.ngay)) end,   /* 17/11 tối: việc của ca chiếu */
           'gio', (select h.value->>'gio' from jsonb_array_elements(v_ho_tro) h where (h.value->>'id')::uuid = d2.buoi_id),
           'phong', (select h.value->>'phong' from jsonb_array_elements(v_ho_tro) h where (h.value->>'id')::uuid = d2.buoi_id))
         order by d2.ngay, d2.o), '[]'::jsonb)
    into v_viec
    from d2;

  -- tự luyện trên app (không bắt buộc, không tính vào x/y)
  select jsonb_build_object('so_cau', count(*), 'so_luot', count(distinct bl.id),
           'pct', case when count(*) > 0 then round(100 * avg(case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end))::int end,
           'nhom', coalesce((select jsonb_agg(distinct public._mtt_ten_nhom(q.n)) from (
                     select public._mtt_nhom_cua_o(public._do_o_quy(v_bdm, false, coalesce(btc2.ma_cau, ''), coalesce(btc2.ma_dang, ''))) as n   /* 16/11: ô → nhóm */
                       from bai_lam bl2 join bai_test bt2 on bt2.id = bl2.bai_test_id
                       join bai_lam_cau blc2 on blc2.bai_lam_id = bl2.id join bai_test_cau btc2 on btc2.id = blc2.bai_test_cau_id
                      where bl2.hoc_sinh_id = p_hs and bt2.loai = 'tu_luyen' and bt2.mon = p_mon and blc2.verdict is not null
                        and blc2.cham_at >= public._mtt_moc(v_tu) and blc2.cham_at < least(v_den, public._mtt_moc(v_toi + 1))
                      group by 1 limit 6) q where q.n is not null), '[]'::jsonb))
    into v_tl
    from bai_lam bl join bai_test bt on bt.id = bl.bai_test_id
    join bai_lam_cau blc on blc.bai_lam_id = bl.id
   where bl.hoc_sinh_id = p_hs and bt.loai = 'tu_luyen' and bt.mon = p_mon and blc.verdict is not null
     and blc.cham_at >= public._mtt_moc(v_tu) and blc.cham_at < least(v_den, public._mtt_moc(v_toi + 1));

  if v_kh.nhom is not null then
    select coalesce(jsonb_agg(e || jsonb_build_object('them_sau', e->>'loai' not in ('sau_gio', 'bo_tro') and not exists (   /* 17/11 tối: ca bổ trợ luôn sống */
             select 1 from jsonb_array_elements(v_kh.viec) x where x->>'loai' = e->>'loai' and x->>'ngay' = e->>'ngay'))   /* 17/11 tối: so theo NGÀY — lúc công bố buổi sắp dạy chưa có mã buổi */
           order by o), '[]'::jsonb)
      into v_viec
      from jsonb_array_elements(v_viec) with ordinality as t(e, o);
  end if;

  return jsonb_build_object(
    'tuan', v_tu, 'den_ngay', v_toi, 'mon', p_mon, 'chot', v_chot,
    'ke_hoach_at', v_kh.chot_at, 'them_sau_chot', v_them,
    'hs', jsonb_build_object('id', v_hs.id, 'ten', v_hs.ho_ten, 'khoi', v_hs.khoi,
                             'lop_id', v_lop1, 'lop', (select l.ten_lop from lop l where l.id = v_lop1)),
    'tien_do', v_td, 'tien_do_dau', v_td_dau, 'tien_do_d', round(v_td - v_td_dau),
    'nhom', v_nhom, 'xep_hang_cho', v_hang, 'sap_hoc', v_sap,
    'viec', v_viec,
    'viec_tong', jsonb_array_length(v_viec),
    'viec_xong', (select count(*) from jsonb_array_elements(v_viec) e where e->>'tt' in ('xong', 'cho_cham')),
    'viec_den_han', (select count(*) from jsonb_array_elements(v_viec) e where e->>'tt' <> 'sap_toi'),
    'tu_luyen', v_tl,
    'tinh_at', now());
end $function$;

CREATE OR REPLACE FUNCTION public._mtt_ghi(p_hs uuid, p_mon text, p_tuan date)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v jsonb;
begin
  -- đầu tuần chụp 1 lần (chỉ khi đã qua 00:00 thứ Hai của tuần đó)
  if now() >= public._mtt_moc(p_tuan) then
    insert into mtt_dau (tuan, hoc_sinh_id, nhom) values (p_tuan, p_hs, public._mtt_dau_tinh(p_hs, p_tuan))
    on conflict (tuan, hoc_sinh_id) do nothing;
  end if;
  v := public._mtt_tinh(p_hs, p_mon, p_tuan, null);
  if v is null then return; end if;
  -- ⭐ KHOÁ KẾ HOẠCH tuần (mig 202611161844): lần đầu tính tờ SAU KHI LỚP CHỐT ⇒ ghi cứng nhóm · phần · mục tiêu tuần · số lần đo · danh sách việc
  if coalesce((v->>'chot')::boolean, false) and v->>'ke_hoach_at' is null then
    insert into mtt_ke_hoach (tuan, mon, hoc_sinh_id, nhom, viec)
    values (p_tuan, p_mon, p_hs,
            coalesce((select jsonb_agg(jsonb_build_object('ma', e->>'ma', 'ten', e->>'ten', 'phan', (e->>'phan')::int, 'mt', e->'mt',
                                                          'k', e->'k', 'ngay_hoc', e->'ngay_hoc') order by o)
                        from jsonb_array_elements(v->'nhom') with ordinality as t(e, o)), '[]'::jsonb),
            coalesce((select jsonb_agg(jsonb_build_object('loai', e->>'loai', 'buoi_id', e->>'buoi_id', 'ngay', e->>'ngay'))
                        from jsonb_array_elements(v->'viec') e), '[]'::jsonb))
    on conflict do nothing;   /* 18/11: khoá chính có thêm chot_at — mỗi lần công bố lại một bản khoá mới (mig 202611181916) */
    v := public._mtt_tinh(p_hs, p_mon, p_tuan, null);
  end if;
  insert into mtt_luu (tuan, mon, hoc_sinh_id, lop_id, khoi, tien_do, viec_xong, viec_tong, viec_den_han, payload, tinh_at)
  values (p_tuan, p_mon, p_hs, (v->'hs'->>'lop_id')::uuid, v->'hs'->>'khoi', (v->>'tien_do')::numeric,
          (v->>'viec_xong')::int, (v->>'viec_tong')::int, (v->>'viec_den_han')::int, v, now())
  on conflict (tuan, mon, hoc_sinh_id) do update set
    lop_id = excluded.lop_id, khoi = excluded.khoi, tien_do = excluded.tien_do, viec_xong = excluded.viec_xong,
    viec_tong = excluded.viec_tong, viec_den_han = excluded.viec_den_han, payload = excluded.payload, tinh_at = excluded.tinh_at;
end $function$;

CREATE OR REPLACE FUNCTION public.fn_mtt_trung_tam(p_mon text, p_khoi text, p_tuan date DEFAULT NULL::date)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_w date := public._mtt_tuan(public._mtt_hom_nay());
  v_t date := public._mtt_tuan(coalesce(p_tuan, public._mtt_hom_nay()));
  v_r jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  if not public._mon_duoc_xem(p_mon) then raise exception 'Môn % ngoài quyền môn của bạn.', p_mon; end if;
  with lop_k as (
    select l.id, l.ten_lop from lop l where l.mon = p_mon and l.khoi = p_khoi and l.trang_thai = 'dang_hoc'
  ),
  t as (   -- tuần đã qua: sổ chốt; tuần đang chạy: bảng đệm
    select c.hoc_sinh_id, c.lop_id, c.tien_do, c.viec_xong, c.viec_tong, c.viec_den_han, c.hang, c.payload, c.chot_at as at
      from mtt_chot c where v_t < v_w and c.tuan = v_t and c.mon = p_mon and c.lop_id in (select id from lop_k)
    union all
    select m.hoc_sinh_id, m.lop_id, m.tien_do, m.viec_xong, m.viec_tong, m.viec_den_han, m.hang, m.payload, m.tinh_at
      from mtt_luu m where m.tuan = v_t and m.mon = p_mon and m.lop_id in (select id from lop_k)
       and (v_t >= v_w or not exists (select 1 from mtt_chot c where c.tuan = v_t and c.mon = p_mon and c.hoc_sinh_id = m.hoc_sinh_id))
  ),
  vb as (   -- BTVN từng em: mức hiển thị + thái độ gốc (trung tâm thấy đủ 4 mức)
    select t.hoc_sinh_id, t.lop_id, e->>'muc' as muc, e->>'thai_do' as thai_do
      from t cross join lateral jsonb_array_elements(t.payload->'viec') e where e->>'loai' = 'btvn'
  ),
  em as (
    select t.*, h.ho_ten,
           array_remove(array[
             case when t.viec_den_han > 0 and t.viec_xong = 0 then 'Chưa làm việc nào trong ' || t.viec_den_han || ' việc đến hạn' end,
             case when (t.payload->>'tien_do')::numeric < (t.payload->>'tien_do_dau')::numeric
                  then 'Tiến độ giảm so với đầu tuần (' || round((t.payload->>'tien_do_dau')::numeric) || '% → ' || round((t.payload->>'tien_do')::numeric) || '%)' end,
             case when exists (select 1 from vb where vb.hoc_sinh_id = t.hoc_sinh_id and vb.thai_do in ('chua_nghiem_tuc', 'chong_doi'))
                  then 'BTVN: ' || (select string_agg(distinct case vb.thai_do when 'chong_doi' then 'chống đối' else 'chưa nghiêm túc' end, ', ')
                                      from vb where vb.hoc_sinh_id = t.hoc_sinh_id and vb.thai_do in ('chua_nghiem_tuc', 'chong_doi')) end,
             case when exists (select 1 from jsonb_array_elements(t.payload->'viec') e where e->>'loai' in ('sau_gio', 'bo_tro') and e->>'tt' = 'vang')
                  then 'Vắng ca bổ trợ / test sau giờ' end,
             case when (select count(*) from jsonb_array_elements(t.payload->'viec') e where e->>'loai' = 'btvn' and e->>'tt' = 'chua_nop') > 0
                  then 'Chưa nộp ' || (select count(*) from jsonb_array_elements(t.payload->'viec') e where e->>'loai' = 'btvn' and e->>'tt' = 'chua_nop') || ' BTVN' end
           ], null) as ly_do
      from t join hoc_sinh h on h.id = t.hoc_sinh_id
  ),
  theo_lop as (
    select lk.id as lop_id, lk.ten_lop,
           (select count(*) from hoc_sinh_lop hl join hoc_sinh h on h.id = hl.hoc_sinh_id
             where hl.lop_id = lk.id and hl.trang_thai = 'dang_hoc' and h.trang_thai = 'dang_hoc')::int as si_so,
           (select c.chot_at from mtt_lop_chot c where c.tuan = v_t and c.lop_id = lk.id) as chot_at,
           (select count(*) from public._mtt_buoi_tuan(lk.id, v_t))::int as so_buoi,
           public._mtt_buoi_co_gt(lk.id, v_t) as so_buoi_co_tl,   /* 18/11: một nguồn với cổng công bố (mig 202611181916) */
           (select max(b.at) from mtt_cong_bo_lai b where b.tuan = v_t and b.lop_id = lk.id) as cong_bo_lai_at,
           (select count(*) from bo_tro_de_xuat d where d.lop_id = lk.id and d.mon = p_mon and d.trang_thai in ('nhap', 'cho_duyet')
             and d.tao_at >= public._mtt_moc(v_t - 7))::int as bo_tro_cho,
           (select round(avg(em.tien_do), 1) from em where em.lop_id = lk.id) as tien_do_tb,
           (select round(avg((em.payload->>'tien_do_dau')::numeric), 1) from em where em.lop_id = lk.id and em.tien_do is not null) as tien_do_dau_tb,
           (select coalesce(sum(em.viec_xong), 0) from em where em.lop_id = lk.id)::int as viec_xong,
           (select coalesce(sum(em.viec_den_han), 0) from em where em.lop_id = lk.id)::int as viec_den_han,
           (select count(*) from vb where vb.lop_id = lk.id and vb.muc = 'tot')::int as btvn_tot,
           (select count(*) from vb where vb.lop_id = lk.id and vb.muc = 'tam_on')::int as btvn_tam_on,
           (select count(*) from vb where vb.lop_id = lk.id and vb.muc = 'chua_tot')::int as btvn_chua_tot,
           (select count(*) from em where em.lop_id = lk.id and em.viec_den_han > 0 and em.viec_xong = 0)::int as chua_lam
      from lop_k lk
  )
  select jsonb_build_object(
    'tuan', v_t, 'dang_chay', v_t >= v_w, 'tinh_at', (select max(at) from t),
    'tong', jsonb_build_object(
      'so_em', (select count(*) from t),
      'tien_do_tb', (select round(avg(tien_do), 1) from t),
      'tien_do_dau_tb', (select round(avg((payload->>'tien_do_dau')::numeric), 1) from t where tien_do is not null),
      'viec_xong', (select coalesce(sum(viec_xong), 0) from t),
      'viec_den_han', (select coalesce(sum(viec_den_han), 0) from t),
      'viec_pct', (select case when sum(viec_den_han) > 0 then round(100.0 * sum(viec_xong) / sum(viec_den_han))::int end from t),
      'tien_do_d', (select round(avg(tien_do) - avg((payload->>'tien_do_dau')::numeric) filter (where tien_do is not null)) from t),
      'btvn_tot', (select count(*) from vb where muc = 'tot'),
      'btvn_tam_on', (select count(*) from vb where muc = 'tam_on'),
      'btvn_chua_tot', (select count(*) from vb where muc = 'chua_tot'),
      'thai_do', jsonb_build_object(
        'nghiem_tuc', (select count(*) from vb where thai_do = 'nghiem_tuc'),
        'chua_het_suc', (select count(*) from vb where thai_do = 'chua_het_suc'),
        'chua_nghiem_tuc', (select count(*) from vb where thai_do = 'chua_nghiem_tuc'),
        'chong_doi', (select count(*) from vb where thai_do = 'chong_doi')),
      'chua_lam', (select count(*) from em where viec_den_han > 0 and viec_xong = 0)),
    'lop', coalesce((select jsonb_agg(to_jsonb(tl) || jsonb_build_object(
                       'tien_do_d', round(tl.tien_do_tb - tl.tien_do_dau_tb),
                       'viec_pct', case when tl.viec_den_han > 0 then round(100.0 * tl.viec_xong / tl.viec_den_han)::int end)
                     order by tl.ten_lop) from theo_lop tl), '[]'::jsonb),
    'em', coalesce((select jsonb_agg(jsonb_build_object('id', em.hoc_sinh_id, 'ten', em.ho_ten, 'lop', em.payload->'hs'->>'lop',
                                                          'tien_do', em.tien_do, 'viec_xong', em.viec_xong, 'viec_den_han', em.viec_den_han,
                                                          'ly_do', to_jsonb(em.ly_do))
                                     order by cardinality(em.ly_do) desc, em.tien_do nulls first, em.ho_ten)
                      from em where cardinality(em.ly_do) > 0), '[]'::jsonb))
    into v_r;
  return v_r;
end $function$;
