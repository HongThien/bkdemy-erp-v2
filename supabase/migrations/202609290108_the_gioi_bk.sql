-- ============================================================================
-- THẾ GIỚI BK — mạng xã hội KHOE nội bộ của HS (spec-the-gioi-bk.md, mockup chốt 29/09/2026).
-- Tin KHÔNG lưu — SUY từ bảng sự kiện đã có (_the_gioi_tin). Chỉ ghi thêm: lượt khen · ẩn tin · cài đặt hiện tên/mã ·
-- lời mời/quan hệ bạn bè · danh mục icon/câu. Mọi đổi trạng thái có TRIGGER ghi log (CLAUDE §4).
-- Kênh (fn_the_gioi_kenh): 'tg' Thế giới = tin S riêng + tin A GỘP theo loại (không ngập — §4) · 'lop' = tin của các lớp em đang
-- học, chi tiết S+A+B · 'ban' = tin của bạn bè, chi tiết S+A+B. Tên LUÔN kèm lớp (§6); em chọn hiện Mã HS thì ẩn tên + lớp, TRỪ với
-- người đã là bạn (đề xuất CTO, chờ Thùy). Quan hệ bạn = dữ liệu KHÔNG-học-tập ⇒ không nhãn môn; tin mang `mon` (§1.6).
-- Tên bảng/hàm KHÔNG dùng tiền tố tg_ (đã là quy ước hàm trigger trong DB).
-- Đợt sau: tin "lên bậc rank" (cần nhật ký lên bậc) · nhiệm vụ/chuỗi ngày · push HS · nút 👑 ở app GV.
-- ============================================================================

-- ── Danh mục icon + câu (admin ẩn/thêm theo trend — an_at = đã ẩn: không cho chọn mới, lượt cũ vẫn hiện) ─────────────
create table public.the_gioi_danh_muc (
  ma       text primary key check (ma ~ '^[a-z0-9_]{1,40}$'),
  loai     text not null check (loai in ('icon', 'cau')),
  noi_dung text not null check (length(btrim(noi_dung)) > 0),
  nhom     text[] not null default '{chung}',   -- câu: hợp loại tin nào (hoc · game · mayman · noluc · chung = mọi tin)
  thu_tu   int not null default 0,
  an_at    timestamptz
);

-- ── Lượt khen: mỗi em 1 lượt / tin (đổi được) · thầy cô khen = ns_id + icon 👑 cố định ───────────────────────────────
create table public.the_gioi_khen (
  id         uuid primary key default gen_random_uuid(),
  tin_khoa   text not null check (tin_khoa ~ '^[a-z_]+:'),   -- khoá TỰ NHIÊN của sự kiện gốc (CLAUDE §2), không vị trí trong feed
  hs_id      uuid references public.hoc_sinh(id) on delete cascade,
  ns_id      uuid references public.nhan_su(id) on delete cascade,
  icon_ma    text references public.the_gioi_danh_muc(ma),
  cau_ma     text references public.the_gioi_danh_muc(ma),
  an_at      timestamptz,                                    -- chủ tin ẩn lượt khen này
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((hs_id is null) <> (ns_id is null)),
  check (ns_id is not null or (icon_ma is not null and cau_ma is not null))
);
create unique index the_gioi_khen_hs_uq on public.the_gioi_khen (tin_khoa, hs_id) where hs_id is not null;
create unique index the_gioi_khen_ns_uq on public.the_gioi_khen (tin_khoa, ns_id) where ns_id is not null;
create index the_gioi_khen_tin_idx on public.the_gioi_khen (tin_khoa);

-- ── Chủ tin ẩn tin của mình (dòng ra đời lần đầu em bấm ẩn; hiện lại = an false) ──────────────────────────────────
create table public.the_gioi_an_tin (
  hoc_sinh_id uuid not null references public.hoc_sinh(id) on delete cascade,
  tin_khoa    text not null,
  an          boolean not null,
  updated_at  timestamptz not null default now(),
  primary key (hoc_sinh_id, tin_khoa)
);

-- ── Em chọn hiện TÊN hay MÃ HS (chưa có dòng = hiện tên) ─────────────────────────────────────────────────────────
create table public.the_gioi_cai_dat (
  hoc_sinh_id uuid primary key references public.hoc_sinh(id) on delete cascade,
  hien        text not null check (hien in ('ten', 'ma')),
  updated_at  timestamptz not null default now()
);

-- ── Bạn bè: 1 dòng / CẶP. Lời mời 'cho' → 'dong_y' (thành bạn) | 'de_sau' · huỷ kết bạn = 'huy' ─────────────────────
create table public.ban_be_loi_moi (
  id         uuid primary key default gen_random_uuid(),
  nguoi_gui  uuid not null references public.hoc_sinh(id) on delete cascade,
  nguoi_nhan uuid not null references public.hoc_sinh(id) on delete cascade,
  trang_thai text not null check (trang_thai in ('cho', 'dong_y', 'de_sau', 'huy')),
  gui_at     timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (nguoi_gui <> nguoi_nhan)
);
create unique index ban_be_cap_uq on public.ban_be_loi_moi (least(nguoi_gui, nguoi_nhan), greatest(nguoi_gui, nguoi_nhan));

-- ── Log chung (trigger — app không tự nhớ ghi) ──────────────────────────────────────────────────────────────────
create table public.the_gioi_log (
  id    bigint generated always as identity primary key,
  bang  text not null,
  actor uuid,
  at    timestamptz not null default now(),
  cu    jsonb,   -- NULL = dòng mới tạo (không có trạng thái cũ)
  moi   jsonb    -- NULL = dòng bị xoá
);
create or replace function public._the_gioi_ghi_log()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into the_gioi_log (bang, actor, cu, moi)
  values (tg_table_name, public.jwt_uid(),
          case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end,
          case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end);
  return coalesce(new, old);
end $$;
create trigger the_gioi_khen_log after insert or update or delete on public.the_gioi_khen for each row execute function public._the_gioi_ghi_log();
create trigger the_gioi_an_tin_log after insert or update or delete on public.the_gioi_an_tin for each row execute function public._the_gioi_ghi_log();
create trigger the_gioi_cai_dat_log after insert or update or delete on public.the_gioi_cai_dat for each row execute function public._the_gioi_ghi_log();
create trigger ban_be_loi_moi_log after insert or update or delete on public.ban_be_loi_moi for each row execute function public._the_gioi_ghi_log();

alter table public.the_gioi_danh_muc enable row level security;
alter table public.the_gioi_khen enable row level security;
alter table public.the_gioi_an_tin enable row level security;
alter table public.the_gioi_cai_dat enable row level security;
alter table public.ban_be_loi_moi enable row level security;
alter table public.the_gioi_log enable row level security;
create policy the_gioi_danh_muc_doc on public.the_gioi_danh_muc for select to authenticated using (true);
-- Còn lại KHÔNG policy: đọc/ghi CHỈ qua hàm security definer bên dưới (tự lọc theo em đang đăng nhập).

-- ── Danh mục: 20 icon + câu ✅ đã duyệt (design/THE-GIOI-BK-danh-muc-tuong-tac.md; bỏ các câu ⚠) ─────────────────
insert into public.the_gioi_danh_muc (ma, loai, noi_dung, nhom, thu_tu) values
  ('lua','icon','🔥','{chung}',1), ('vo_tay','icon','👏','{chung}',2), ('tram_diem','icon','💯','{chung}',3), ('cup','icon','🏆','{chung}',4),
  ('ten_lua','icon','🚀','{chung}',5), ('set','icon','⚡','{chung}',6), ('de_goat','icon','🐐','{chung}',7), ('co_bap','icon','💪','{chung}',8),
  ('nao','icon','🧠','{chung}',9), ('no_nao','icon','🤯','{chung}',10), ('ngau','icon','😎','{chung}',11), ('chao','icon','🫡','{chung}',12),
  ('bai_su','icon','🙇','{chung}',13), ('kim_cuong','icon','💎','{chung}',14), ('ngoi_sao','icon','🌟','{chung}',15), ('an_mung','icon','🥳','{chung}',16),
  ('hong_tam','icon','🎯','{chung}',17), ('co_4_la','icon','🍀','{chung}',18), ('tim_tay','icon','🫶','{chung}',19), ('bat_tay','icon','🤝','{chung}',20),
  ('c01','cau','Đỉnh nóc, kịch trần, bay phấp phới 🚀','{chung}',1), ('c02','cau','Đỉnh của chóp','{chung}',2),
  ('c03','cau','Quá dữ, quá xịn','{chung}',3), ('c04','cau','Khét lẹt luôn 🔥','{chung}',4), ('c05','cau','Hết nước chấm','{chung}',5),
  ('c07','cau','GOAT là đây chứ đâu 🐐','{chung}',7), ('c08','cau','Slay quá trời','{chung}',8), ('c09','cau','Keo lỳ tái châu','{chung}',9),
  ('c10','cau','Gét gô! Let''s go!','{chung}',10), ('c11','cau','Chấn động BK 😱','{chung}',11),
  ('c13','cau','Idol của em đây rồi','{hoc}',13), ('c14','cau','Cho xin bí kíp với 🙏','{hoc}',14), ('c15','cau','Xin vía học giỏi 🍀','{hoc}',15),
  ('c16','cau','Bái sư, nhận đệ tử không ạ 🙇','{hoc}',16), ('c17','cau','Thần đồng BK xuất hiện','{hoc}',17), ('c18','cau','Trùm cuối lộ diện','{hoc}',18),
  ('c19','cau','Tấm gương sáng cho thế hệ trẻ ✨','{hoc}',19),
  ('c20','cau','Chăm thế này ai đỡ nổi 💪','{noluc}',20), ('c21','cau','Bền bỉ như Tây Du Ký','{noluc}',21),
  ('c22','cau','Streak này phải đóng khung','{noluc}',22), ('c23','cau','Cày không biết mệt','{noluc}',23),
  ('c24','cau','Tiến bộ thấy rõ luôn 🚀','{noluc}',24), ('c25','cau','Từ từ mà chắc, chất lượng','{noluc}',25),
  ('c26','cau','Nhân phẩm vô cực 🍀','{mayman}',26), ('c27','cau','Carry cả team luôn','{game}',27), ('c28','cau','Bắn phát ăn luôn 🎯','{game}',28),
  ('c29','cau','Trà sữa đâu, khao đi! 🧋','{mayman}',29),
  ('c31','cau','Thua Gia Cát Lượng đúng cây quạt 🪭','{hoc}',31), ('c32','cau','Cổ điển, tôn trọng 🫡','{noluc}',32),
  ('c33','cau','10 điểm không có nhưng','{chung}',33), ('c34','cau','Tuyệt đối điện ảnh 🎬','{game}',34),
  ('c35','cau','Bốc trúng sít rịt','{mayman}',35), ('c36','cau','8386 phát tài phát lộc 🍀','{mayman}',36),
  ('c37','cau','Vuýp quá trời','{chung}',37), ('c38','cau','Kiwi kiwi, xịn xò','{chung}',38), ('c39','cau','Gooo! 🚀','{chung}',39),
  ('c40','cau','Đỉnh thật sự, no cap','{chung}',40), ('c41','cau','Stan cậu luôn rồi','{hoc}',41), ('c42','cau','Mãi mận mãi keo 🤝','{game,noluc}',42);

-- ── Trợ giúp ───────────────────────────────────────────────────────────────────────────────────────────────────
-- Lớp đang học của 1 em theo môn (mon null ⇒ lớp gần nhất bất kỳ).
create or replace function public._the_gioi_lop(p_hs uuid, p_mon text)
returns table (lop_id uuid, ten_lop text) language sql stable security definer set search_path = public as $$
  select l.id, l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
  where hl.hoc_sinh_id = p_hs and hl.trang_thai = 'dang_hoc' and (p_mon is null or l.mon = p_mon)
  order by hl.ngay_vao desc nulls last limit 1
$$;

-- Danh tính hiển thị của 1 em: tên + lớp; chế độ Mã HS ⇒ chỉ mã (trừ khi người xem là bạn — p_ban).
create or replace function public._the_gioi_nguoi(p_hs uuid, p_lop text, p_ban boolean)
returns jsonb language sql stable security definer set search_path = public as $$
  select case when coalesce(cd.hien, 'ten') = 'ma' and not coalesce(p_ban, false)
    then jsonb_build_object('an', true, 'ma', h.ma_hs)
    else jsonb_strip_nulls(jsonb_build_object('an', false, 'id', h.id, 'ten', h.ho_ten, 'lop', p_lop, 'anh', h.anh_url)) end
  from hoc_sinh h left join the_gioi_cai_dat cd on cd.hoc_sinh_id = h.id where h.id = p_hs
$$;

-- Bạn bè (đã đồng ý) của 1 em.
create or replace function public._ban_be_cua(p_hs uuid)
returns setof uuid language sql stable security definer set search_path = public as $$
  select case when nguoi_gui = p_hs then nguoi_nhan else nguoi_gui end from ban_be_loi_moi
  where trang_thai = 'dong_y' and p_hs in (nguoi_gui, nguoi_nhan)
$$;

-- ── MỌI TIN từ sự kiện thật từ mốc p_tu (không lưu — suy mỗi lần gọi) ────────────────────────────────────────────
-- tang: S cực phẩm · A đáng khoe · B nỗ lực. nhom: loại câu hợp (hoc · game · mayman · noluc).
create or replace function public._the_gioi_tin(p_tu timestamptz)
returns table (khoa text, tang text, nhom text, kieu text, hoc_sinh_id uuid, thanh_vien uuid[], lop_id uuid, mon text, at timestamptz, chi_tiet jsonb)
language sql stable security definer set search_path = public as $$
  -- Nhất buổi (giải 1 xếp hạng buổi)
  select 'nhat_buoi:' || g.buoi_hoc_id || ':' || g.hoc_sinh_id, 'A', 'hoc', 'nhat_buoi', g.hoc_sinh_id, array[g.hoc_sinh_id], b.lop_id, g.mon,
         coalesce(b.giai_chot_at, g.created_at), jsonb_build_object('ngay', b.ngay)
  from buoi_giai g join buoi_hoc b on b.id = g.buoi_hoc_id
  where g.giai = 1 and coalesce(b.giai_chot_at, g.created_at) >= p_tu
  union all
  -- Nhất game buổi (cá nhân) — Bắn Quà chế độ đội thì tin theo ĐỘI ở dưới
  select 'game:' || l.id, 'A', 'game', 'game_nhat', l.hoc_sinh_id, array[l.hoc_sinh_id], b.lop_id, l.mon, l.at,
         jsonb_build_object('game', l.game, 'ngay', b.ngay)
  from buoi_game_luot l join buoi_hoc b on b.id = l.buoi_hoc_id
  where l.giai = 1 and l.at >= p_tu
    and not exists (select 1 from buoi_ban_qua q where q.buoi_hoc_id = l.buoi_hoc_id and q.che_do = 'doi' and l.game = 'ban_qua')
  union all
  -- 🧋 trúng trà sữa — tầng S
  select 'tra_sua:' || q.luot_id, 'S', 'mayman', 'tra_sua', q.hoc_sinh_id, array[q.hoc_sinh_id], b.lop_id, l.mon, q.at,
         jsonb_build_object('game', l.game, 'ngay', b.ngay)
  from buoi_game_qua q join buoi_game_luot l on l.id = q.luot_id join buoi_hoc b on b.id = q.buoi_hoc_id
  where q.qua = 'tra_sua' and q.at >= p_tu
  union all
  -- Đội thắng Bắn Quà (chế độ đội)
  select 'ban_qua:' || q.buoi_hoc_id || ':' || d.doi, 'A', 'game', 'doi_thang', null::uuid,
         array(select h.hoc_sinh_id from buoi_ban_qua_hs h where h.buoi_hoc_id = q.buoi_hoc_id and h.doi = d.doi),
         b.lop_id, q.mon, q.chot_at, jsonb_build_object('doi', d.doi, 'game', 'ban_qua', 'ngay', b.ngay)
  from buoi_ban_qua q join buoi_ban_qua_doi d on d.buoi_hoc_id = q.buoi_hoc_id and d.hang = 1 join buoi_hoc b on b.id = q.buoi_hoc_id
  where q.che_do = 'doi' and q.chot_at >= p_tu
  union all
  -- Huy hiệu: ★4–5 = S, ★1–3 = A
  select 'huy_hieu:' || x.id, case when x.sao >= 4 then 'S' else 'A' end, 'hoc', 'huy_hieu', x.hoc_sinh_id, array[x.hoc_sinh_id], null::uuid, x.mon, x.dat_at,
         jsonb_build_object('key', x.huy_hieu_key, 'ten', hh.ten, 'sao', x.sao)
  from hs_huy_hieu_dat x left join huy_hieu hh on hh.mon = x.mon and hh.key = x.huy_hieu_key
  where x.dat_at >= p_tu
  union all
  -- Giải tháng đã công bố — tầng S
  select 'giai_thang:' || g.id, 'S', 'hoc', 'giai_thang', g.hoc_sinh_id, array[g.hoc_sinh_id], g.lop_id, g.mon, g.cong_bo_at,
         jsonb_build_object('loai_giai', g.loai_giai, 'thang', g.thang)
  from giai_thuong g where g.cong_bo_at >= p_tu
  union all
  -- Nỗ lực (tầng B): gộp 1 tin / em / ngày (giờ VN) / môn — số bài đã nộp + số Thử thách đạt
  select 'no_luc:' || bl.hoc_sinh_id || ':' || (bl.nop_at at time zone 'Asia/Ho_Chi_Minh')::date || ':' || bt.mon, 'B', 'noluc', 'no_luc',
         bl.hoc_sinh_id, array[bl.hoc_sinh_id], null::uuid, bt.mon, max(bl.nop_at),
         jsonb_build_object('ngay', (bl.nop_at at time zone 'Asia/Ho_Chi_Minh')::date, 'so_bai', count(*), 'so_thu_thach', count(*) filter (where tt.pass))
  from bai_lam bl join bai_test bt on bt.id = bl.bai_test_id left join thu_thach_luot tt on tt.bai_lam_id = bl.id
  where bl.trang_thai = 'da_nop' and bl.nop_at >= p_tu
  group by bl.hoc_sinh_id, (bl.nop_at at time zone 'Asia/Ho_Chi_Minh')::date, bt.mon
$$;

-- Tóm tắt lượt khen của 1 tin (khen chủ tin đã ẩn thì không đếm, không hiện).
create or replace function public._the_gioi_khen_json(p_khoa text, p_me uuid, p_ban uuid[])
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'dem', coalesce((select jsonb_agg(jsonb_build_object('icon', d.noi_dung, 'ma', d.ma, 'so', x.so) order by x.so desc, d.thu_tu)
                     from (select icon_ma, count(*) so from the_gioi_khen where tin_khoa = p_khoa and hs_id is not null and an_at is null group by icon_ma) x
                     join the_gioi_danh_muc d on d.ma = x.icon_ma), '[]'::jsonb),
    'tong', (select count(*) from the_gioi_khen where tin_khoa = p_khoa and hs_id is not null and an_at is null),
    'cau', coalesce((select jsonb_agg(c.j) from (
              select jsonb_build_object('cau', d.noi_dung, 'nguoi',
                       public._the_gioi_nguoi(k.hs_id, (select ten_lop from public._the_gioi_lop(k.hs_id, null)), k.hs_id = any(p_ban) or k.hs_id = p_me),
                       'la_em', k.hs_id = p_me) j
              from the_gioi_khen k join the_gioi_danh_muc d on d.ma = k.cau_ma
              where k.tin_khoa = p_khoa and k.hs_id is not null and k.an_at is null
              order by (k.hs_id = p_me) desc, k.updated_at desc limit 2) c), '[]'::jsonb),
    'cua_toi', (select jsonb_build_object('icon', di.noi_dung, 'icon_ma', k.icon_ma, 'cau', dc.noi_dung, 'cau_ma', k.cau_ma)
                from the_gioi_khen k join the_gioi_danh_muc di on di.ma = k.icon_ma join the_gioi_danh_muc dc on dc.ma = k.cau_ma
                where k.tin_khoa = p_khoa and k.hs_id = p_me),
    'thay_co', coalesce((select jsonb_agg(split_part(ns.ho_ten, ' ', array_length(string_to_array(ns.ho_ten, ' '), 1)) order by k.created_at)
                         from the_gioi_khen k join nhan_su ns on ns.id = k.ns_id where k.tin_khoa = p_khoa and k.ns_id is not null), '[]'::jsonb))
$$;

-- ── KÊNH cho app HS ─────────────────────────────────────────────────────────────────────────────────────────
-- p_kenh: 'tg' | 'lop' | 'ban'. Trả { toi, tin[], gop[] (chỉ 'tg') }. 7 ngày gần nhất (tin S ghim đầu trong 24h).
create or replace function public.fn_the_gioi_kenh(p_kenh text)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare
  v_me uuid := public.my_hoc_sinh_id();
  v_ban uuid[];
  v_lop uuid[];
  v_hom_nay timestamptz := ((now() at time zone 'Asia/Ho_Chi_Minh')::date)::timestamp at time zone 'Asia/Ho_Chi_Minh';
  v_tin jsonb; v_gop jsonb := '[]'::jsonb;
begin
  if v_me is null then raise exception 'Chỉ tài khoản học sinh mới xem được Thế giới BK'; end if;
  if p_kenh not in ('tg', 'lop', 'ban') then raise exception 'Kênh không hợp lệ: %', p_kenh; end if;
  v_ban := array(select public._ban_be_cua(v_me));
  v_lop := array(select hl.lop_id from hoc_sinh_lop hl where hl.hoc_sinh_id = v_me and hl.trang_thai = 'dang_hoc');

  create temp table if not exists _tgk (khoa text, tang text, nhom text, kieu text, hoc_sinh_id uuid, thanh_vien uuid[], lop_id uuid, mon text, at timestamptz, chi_tiet jsonb, ten_lop text) on commit drop;
  truncate _tgk;
  insert into _tgk
  select t.*, coalesce((select l.ten_lop from lop l where l.id = t.lop_id), (select x.ten_lop from public._the_gioi_lop(t.thanh_vien[1], t.mon) x))
  from public._the_gioi_tin(now() - interval '7 days') t
  where not exists (select 1 from the_gioi_an_tin a where a.tin_khoa = t.khoa and a.an and not (v_me = any(t.thanh_vien)));
  -- lớp của tin chưa gắn lop_id (huy hiệu, nỗ lực) = lớp môn đó của em chủ tin
  update _tgk set lop_id = (select x.lop_id from public._the_gioi_lop(thanh_vien[1], mon) x) where lop_id is null;

  select coalesce(jsonb_agg(j order by ghim desc, at desc), '[]'::jsonb) into v_tin from (
    select t.at, (t.tang = 'S' and t.at >= now() - interval '24 hours') as ghim,
      jsonb_build_object(
        'khoa', t.khoa, 'tang', t.tang, 'nhom', t.nhom, 'kieu', t.kieu, 'mon', t.mon, 'at', t.at, 'lop', t.ten_lop, 'chi_tiet', t.chi_tiet,
        'ghim', (t.tang = 'S' and t.at >= now() - interval '24 hours'),
        'nguoi', case when t.hoc_sinh_id is not null then public._the_gioi_nguoi(t.hoc_sinh_id, t.ten_lop, t.hoc_sinh_id = any(v_ban) or t.hoc_sinh_id = v_me) end,
        'doi', case when t.hoc_sinh_id is null then jsonb_build_object('so', coalesce(array_length(t.thanh_vien, 1), 0),
                 'thanh_vien', (select coalesce(jsonb_agg(public._the_gioi_nguoi(m, t.ten_lop, m = any(v_ban) or m = v_me)), '[]'::jsonb) from unnest(t.thanh_vien[1:4]) m)) end,
        'cua_toi', v_me = any(t.thanh_vien),
        'la_ban', t.thanh_vien && v_ban,
        'da_an', exists (select 1 from the_gioi_an_tin a where a.tin_khoa = t.khoa and a.an),
        'khen', public._the_gioi_khen_json(t.khoa, v_me, v_ban)) j
    from _tgk t
    where case p_kenh
      when 'tg'  then t.tang = 'S'
      when 'lop' then t.lop_id = any(v_lop)
      when 'ban' then t.thanh_vien && v_ban
    end
    order by t.at desc limit 60) q;

  if p_kenh = 'tg' then
    -- tin A gộp 1 thẻ / loại: hôm nay (huy hiệu ★1–3 gộp 7 ngày vì chốt tháng đổ dồn 1 ngày)
    select coalesce(jsonb_agg(g order by g->>'kieu'), '[]'::jsonb) into v_gop from (
      select jsonb_build_object('kieu', t.kieu, 'so', count(*),
        'ds', (select jsonb_agg(jsonb_build_object('khoa', u.khoa, 'kieu', u.kieu, 'nhom', u.nhom, 'lop', u.ten_lop, 'chi_tiet', u.chi_tiet, 'at', u.at,
                  'nguoi', case when u.hoc_sinh_id is not null then public._the_gioi_nguoi(u.hoc_sinh_id, u.ten_lop, u.hoc_sinh_id = any(v_ban) or u.hoc_sinh_id = v_me) end,
                  'doi', case when u.hoc_sinh_id is null then jsonb_build_object('so', coalesce(array_length(u.thanh_vien, 1), 0)) end,
                  'la_ban', u.thanh_vien && v_ban, 'cua_toi', v_me = any(u.thanh_vien),
                  'khen', public._the_gioi_khen_json(u.khoa, v_me, v_ban)) order by (u.thanh_vien && v_ban) desc, u.at desc)
               from (select * from _tgk u2 where u2.tang = 'A' and u2.kieu = t.kieu
                       and u2.at >= case when t.kieu = 'huy_hieu' then now() - interval '7 days' else v_hom_nay end
                     order by u2.at desc limit 30) u)) g
      from _tgk t
      where t.tang = 'A' and t.at >= case when t.kieu = 'huy_hieu' then now() - interval '7 days' else v_hom_nay end
      group by t.kieu) z;
  end if;

  return jsonb_build_object(
    'toi', jsonb_build_object('hien', coalesce((select hien from the_gioi_cai_dat where hoc_sinh_id = v_me), 'ten'),
                              'so_ban', coalesce(array_length(v_ban, 1), 0),
                              'loi_moi', (select count(*) from ban_be_loi_moi where nguoi_nhan = v_me and trang_thai = 'cho')),
    'tin', v_tin, 'gop', v_gop);
end $$;

-- ── Khen (mỗi em 1 lượt / tin, gửi lại = đổi) ────────────────────────────────────────────────────────────────
create or replace function public.fn_the_gioi_khen(p_khoa text, p_icon text, p_cau text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_me uuid := public.my_hoc_sinh_id(); v_tin record;
begin
  if v_me is null then raise exception 'Chỉ tài khoản học sinh mới khen được'; end if;
  select * into v_tin from public._the_gioi_tin(now() - interval '30 days') t where t.khoa = p_khoa;
  if not found then raise exception 'Tin không còn trên Thế giới BK'; end if;
  if v_me = any(v_tin.thanh_vien) then raise exception 'Không tự khen tin của mình'; end if;
  if exists (select 1 from the_gioi_an_tin a where a.tin_khoa = p_khoa and a.an) then raise exception 'Tin đã được chủ tin ẩn'; end if;
  if not exists (select 1 from the_gioi_danh_muc where ma = p_icon and loai = 'icon' and an_at is null) then raise exception 'Icon không hợp lệ'; end if;
  if not exists (select 1 from the_gioi_danh_muc where ma = p_cau and loai = 'cau' and an_at is null
                 and ('chung' = any(nhom) or v_tin.nhom = any(nhom))) then raise exception 'Câu không hợp loại tin'; end if;
  insert into the_gioi_khen (tin_khoa, hs_id, icon_ma, cau_ma) values (p_khoa, v_me, p_icon, p_cau)
  on conflict (tin_khoa, hs_id) where hs_id is not null
  do update set icon_ma = excluded.icon_ma, cau_ma = excluded.cau_ma, updated_at = now();
  return public._the_gioi_khen_json(p_khoa, v_me, array(select public._ban_be_cua(v_me)));
end $$;

-- 👑 Thầy cô khen (chỉ nhân sự đang làm) — nút ở app GV làm đợt sau.
create or replace function public.fn_the_gioi_thay_co_khen(p_khoa text)
returns void language plpgsql security definer set search_path = public as $$
declare v_ns uuid := public.current_nhan_su_id();
begin
  if v_ns is null then raise exception 'Chỉ thầy cô mới thả được 👑'; end if;
  if not exists (select 1 from public._the_gioi_tin(now() - interval '30 days') t where t.khoa = p_khoa) then raise exception 'Tin không còn trên Thế giới BK'; end if;
  insert into the_gioi_khen (tin_khoa, ns_id) values (p_khoa, v_ns) on conflict (tin_khoa, ns_id) where ns_id is not null do nothing;
end $$;

-- ── Chủ tin tự quản ──────────────────────────────────────────────────────────────────────────────────────────
create or replace function public.fn_the_gioi_an_tin(p_khoa text, p_an boolean)
returns void language plpgsql security definer set search_path = public as $$
declare v_me uuid := public.my_hoc_sinh_id();
begin
  if not exists (select 1 from public._the_gioi_tin(now() - interval '30 days') t where t.khoa = p_khoa and v_me = any(t.thanh_vien)) then
    raise exception 'Chỉ ẩn được tin của chính em'; end if;
  insert into the_gioi_an_tin (hoc_sinh_id, tin_khoa, an) values (v_me, p_khoa, p_an)
  on conflict (hoc_sinh_id, tin_khoa) do update set an = excluded.an, updated_at = now();
end $$;

create or replace function public.fn_the_gioi_an_khen(p_khen uuid, p_an boolean)
returns void language plpgsql security definer set search_path = public as $$
declare v_me uuid := public.my_hoc_sinh_id(); v_khoa text;
begin
  select tin_khoa into v_khoa from the_gioi_khen where id = p_khen;
  if v_khoa is null or not exists (select 1 from public._the_gioi_tin(now() - interval '30 days') t where t.khoa = v_khoa and v_me = any(t.thanh_vien)) then
    raise exception 'Chỉ ẩn được lượt khen trên tin của chính em'; end if;
  update the_gioi_khen set an_at = case when p_an then now() end, updated_at = now() where id = p_khen;
end $$;

create or replace function public.fn_the_gioi_cai_dat(p_hien text)
returns void language plpgsql security definer set search_path = public as $$
declare v_me uuid := public.my_hoc_sinh_id();
begin
  if v_me is null then raise exception 'Chỉ tài khoản học sinh'; end if;
  insert into the_gioi_cai_dat (hoc_sinh_id, hien) values (v_me, p_hien)
  on conflict (hoc_sinh_id) do update set hien = excluded.hien, updated_at = now();
end $$;

-- ── Bạn bè ─────────────────────────────────────────────────────────────────────────────────────────────────
create or replace function public.fn_ban_be_cua_toi()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_me uuid := public.my_hoc_sinh_id(); v_ban uuid[];
begin
  if v_me is null then raise exception 'Chỉ tài khoản học sinh'; end if;
  v_ban := array(select public._ban_be_cua(v_me));
  return jsonb_build_object(
    'ban', coalesce((select jsonb_agg(public._the_gioi_nguoi(b, (select ten_lop from public._the_gioi_lop(b, null)), true) order by h.ho_ten)
                     from unnest(v_ban) b join hoc_sinh h on h.id = b), '[]'::jsonb),
    'loi_moi', coalesce((select jsonb_agg(jsonb_build_object('id', m.id, 'nguoi', public._the_gioi_nguoi(m.nguoi_gui, (select ten_lop from public._the_gioi_lop(m.nguoi_gui, null)), true),
                         'ban_chung', (select count(*) from public._ban_be_cua(m.nguoi_gui) x where x = any(v_ban))) order by m.gui_at desc)
                         from ban_be_loi_moi m where m.nguoi_nhan = v_me and m.trang_thai = 'cho'), '[]'::jsonb),
    'da_gui', coalesce((select jsonb_agg(m.nguoi_nhan) from ban_be_loi_moi m where m.nguoi_gui = v_me and m.trang_thai in ('cho', 'de_sau')), '[]'::jsonb));
end $$;

-- Gợi ý / tìm: chỉ HS BK đang học. Không gõ ⇒ cùng lớp + có bạn chung. Gõ ⇒ tên, mã HS, hoặc lớp.
-- Em để chế độ Mã HS ⇒ chỉ tìm được bằng đúng mã, và hiện bằng mã.
create or replace function public.fn_ban_be_goi_y(p_tim text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_me uuid := public.my_hoc_sinh_id(); v_ban uuid[]; v_lop uuid[]; v_q text := lower(btrim(coalesce(p_tim, '')));
begin
  if v_me is null then raise exception 'Chỉ tài khoản học sinh'; end if;
  v_ban := array(select public._ban_be_cua(v_me));
  v_lop := array(select hl.lop_id from hoc_sinh_lop hl where hl.hoc_sinh_id = v_me and hl.trang_thai = 'dang_hoc');
  return coalesce((select jsonb_agg(r.j order by r.cung_lop desc, r.chung desc, r.ten) from (
    select h.ho_ten ten, (hl_cung.lop_id is not null) cung_lop,
           (select count(*) from public._ban_be_cua(h.id) x where x = any(v_ban)) chung,
           jsonb_build_object('id', h.id, 'nguoi', public._the_gioi_nguoi(h.id, coalesce(hl_cung.ten_lop, lp.ten_lop), false),
             'ly_do', case when hl_cung.lop_id is not null then 'Cùng lớp ' || hl_cung.ten_lop
                           else nullif((select count(*) from public._ban_be_cua(h.id) x where x = any(v_ban)), 0) || ' bạn chung' end,
             'trang_thai', (select case when m.trang_thai in ('cho', 'de_sau') and m.nguoi_gui = v_me then 'da_gui'
                                        when m.trang_thai = 'cho' then 'cho_em' end
                            from ban_be_loi_moi m where least(m.nguoi_gui, m.nguoi_nhan) = least(v_me, h.id) and greatest(m.nguoi_gui, m.nguoi_nhan) = greatest(v_me, h.id))) j
    from hoc_sinh h
    cross join lateral (select x.lop_id, x.ten_lop from public._the_gioi_lop(h.id, null) x) lp
    left join lateral (select hl.lop_id, l.ten_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id  -- lớp CHUNG với em (hiện đúng lớp đó)
                       where hl.hoc_sinh_id = h.id and hl.trang_thai = 'dang_hoc' and hl.lop_id = any(v_lop) limit 1) hl_cung on true
    left join the_gioi_cai_dat cd on cd.hoc_sinh_id = h.id
    where h.id <> v_me and not (h.id = any(v_ban))
      and case when v_q = '' then hl_cung.lop_id is not null or exists (select 1 from public._ban_be_cua(h.id) x where x = any(v_ban))
               when coalesce(cd.hien, 'ten') = 'ma' then lower(h.ma_hs) = v_q
               else lower(h.ho_ten) like '%' || v_q || '%' or lower(h.ma_hs) = v_q or lower(lp.ten_lop) = v_q end
    limit 30) r), '[]'::jsonb);
end $$;

create or replace function public.fn_ban_be_gui(p_hs uuid)
returns text language plpgsql security definer set search_path = public as $$
declare v_me uuid := public.my_hoc_sinh_id(); v_m ban_be_loi_moi;
begin
  if v_me is null then raise exception 'Chỉ tài khoản học sinh'; end if;
  if p_hs = v_me then raise exception 'Không tự kết bạn với mình'; end if;
  if not exists (select 1 from hoc_sinh_lop where hoc_sinh_id = p_hs and trang_thai = 'dang_hoc') then raise exception 'Bạn này không còn học ở BK'; end if;
  select * into v_m from ban_be_loi_moi where least(nguoi_gui, nguoi_nhan) = least(v_me, p_hs) and greatest(nguoi_gui, nguoi_nhan) = greatest(v_me, p_hs);
  if not found then
    insert into ban_be_loi_moi (nguoi_gui, nguoi_nhan, trang_thai) values (v_me, p_hs, 'cho'); return 'da_gui';
  end if;
  if v_m.trang_thai = 'dong_y' then return 'da_la_ban'; end if;
  if v_m.trang_thai in ('cho', 'de_sau') and v_m.nguoi_nhan = v_me then   -- bạn ấy đã mời em ⇒ gửi lại = đồng ý luôn
    update ban_be_loi_moi set trang_thai = 'dong_y', updated_at = now() where id = v_m.id; return 'da_la_ban';
  end if;
  update ban_be_loi_moi set nguoi_gui = v_me, nguoi_nhan = p_hs, trang_thai = 'cho', gui_at = now(), updated_at = now() where id = v_m.id;
  return 'da_gui';
end $$;

create or replace function public.fn_ban_be_tra_loi(p_loi_moi uuid, p_dong_y boolean)
returns void language plpgsql security definer set search_path = public as $$
declare v_me uuid := public.my_hoc_sinh_id();
begin
  update ban_be_loi_moi set trang_thai = case when p_dong_y then 'dong_y' else 'de_sau' end, updated_at = now()
  where id = p_loi_moi and nguoi_nhan = v_me and trang_thai in ('cho', 'de_sau');
  if not found then raise exception 'Không tìm thấy lời mời'; end if;
end $$;

create or replace function public.fn_ban_be_huy(p_hs uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_me uuid := public.my_hoc_sinh_id();
begin
  update ban_be_loi_moi set trang_thai = 'huy', updated_at = now()
  where least(nguoi_gui, nguoi_nhan) = least(v_me, p_hs) and greatest(nguoi_gui, nguoi_nhan) = greatest(v_me, p_hs) and trang_thai = 'dong_y';
end $$;

-- ── Quyền: chỉ người đã đăng nhập; hàm nội bộ (_*) không mở cho client ─────────────────────────────────────────────
revoke execute on function public._the_gioi_ghi_log() from public, anon;
revoke execute on function public._the_gioi_lop(uuid, text) from public, anon, authenticated;
revoke execute on function public._the_gioi_nguoi(uuid, text, boolean) from public, anon, authenticated;
revoke execute on function public._ban_be_cua(uuid) from public, anon, authenticated;
revoke execute on function public._the_gioi_tin(timestamptz) from public, anon, authenticated;
revoke execute on function public._the_gioi_khen_json(text, uuid, uuid[]) from public, anon, authenticated;
revoke execute on function public.fn_the_gioi_kenh(text) from public, anon;
revoke execute on function public.fn_the_gioi_khen(text, text, text) from public, anon;
revoke execute on function public.fn_the_gioi_thay_co_khen(text) from public, anon;
revoke execute on function public.fn_the_gioi_an_tin(text, boolean) from public, anon;
revoke execute on function public.fn_the_gioi_an_khen(uuid, boolean) from public, anon;
revoke execute on function public.fn_the_gioi_cai_dat(text) from public, anon;
revoke execute on function public.fn_ban_be_cua_toi() from public, anon;
revoke execute on function public.fn_ban_be_goi_y(text) from public, anon;
revoke execute on function public.fn_ban_be_gui(uuid) from public, anon;
revoke execute on function public.fn_ban_be_tra_loi(uuid, boolean) from public, anon;
revoke execute on function public.fn_ban_be_huy(uuid) from public, anon;
grant execute on function public.fn_the_gioi_kenh(text) to authenticated;
grant execute on function public.fn_the_gioi_khen(text, text, text) to authenticated;
grant execute on function public.fn_the_gioi_thay_co_khen(text) to authenticated;
grant execute on function public.fn_the_gioi_an_tin(text, boolean) to authenticated;
grant execute on function public.fn_the_gioi_an_khen(uuid, boolean) to authenticated;
grant execute on function public.fn_the_gioi_cai_dat(text) to authenticated;
grant execute on function public.fn_ban_be_cua_toi() to authenticated;
grant execute on function public.fn_ban_be_goi_y(text) to authenticated;
grant execute on function public.fn_ban_be_gui(uuid) to authenticated;
grant execute on function public.fn_ban_be_tra_loi(uuid, boolean) to authenticated;
grant execute on function public.fn_ban_be_huy(uuid) to authenticated;
