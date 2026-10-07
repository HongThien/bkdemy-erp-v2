-- ============================================================================
-- 202610072101 — tinh_nang_mo_dan: CÔNG TẮC MỞ TÍNH NĂNG app HS theo từng đợt
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 07/10 — "sợ mở ra học sinh bị ngợp, dự định mở từ từ từng phần". App HS đã có ~14 ô chức năng
--   (học tập, nhiệm vụ, thành tựu, Rank, BXH, Thế giới BK, game…); bật hết cùng lúc ⇒ em không biết bắt đầu từ đâu,
--   phần phụ bị bỏ phế. Cần BẬT/TẮT KHÔNG CẦN DEPLOY, theo từng lớp (mở thử 1 lớp trước rồi mới mở cả khối).
--   Nguồn sự thật = DB (CLAUDE.md §2): client chỉ hỏi "tôi được thấy những gì" qua fn_hs_tinh_nang_mo().
--
-- MÔ HÌNH (không placeholder — §1.5):
--   tinh_nang      : danh mục tính năng + `mo_tu` = ngày (giờ VN) bắt đầu mở cho MỌI lớp. NULL = chưa mở cho ai.
--   tinh_nang_lop  : NGOẠI LỆ theo lớp. Có dòng ⇒ dòng đó thắng mo_tu: mo=true mở sớm cho lớp thử, mo=false đóng riêng 1 lớp.
--   Em học nhiều lớp (nhiều môn) ⇒ thấy tính năng nếu BẤT KỲ lớp đang học nào của em được mở (không tách theo môn:
--   tính năng gắn vào app, không gắn vào môn). Em chưa có lớp nào ⇒ theo mo_tu chung.
--   KHÔNG gate: bài trên lớp / ET / BTVN / ca bổ trợ / kiểm tra lại — đó là việc thầy cô giao, không phải "tính năng để bật dần".
--
-- AN TOÀN KHI DEPLOY: seed MỌI tính năng MỞ từ 2020-01-01 ⇒ hành vi hiện tại KHÔNG ĐỔI cho tới khi Thùy đóng bớt.
--   Muốn mở dần: đóng hết phần phụ (mo_tu = NULL) rồi mở lại từng đợt bằng fn_tinh_nang_dat / fn_tinh_nang_lop_dat.
--
-- GHI VẾT: trigger tự đẻ dòng tinh_nang_log (ai · lúc nào · trước/sau) — app KHÔNG tự nhớ ghi log (§4).
-- QUYỀN GHI: co_quyen_ghi('tinh_nang') (admin hệ thống mặc định qua; cấp thêm cho vai trò khác bằng vai_tro_chuc_nang).
--
-- MẤT GÌ: không xoá/thu hẹp gì — chỉ thêm 3 bảng + 4 hàm.
-- ============================================================================

create table if not exists public.tinh_nang (
  ma      text primary key,
  ten     text not null,
  nhom    text not null check (nhom in ('hoc', 'choi')),
  thu_tu  smallint not null,
  mo_tu   date,
  mo_ta   text,
  updated_at timestamptz not null default now()
);
create table if not exists public.tinh_nang_lop (
  ma     text not null references public.tinh_nang(ma) on update cascade on delete cascade,
  lop_id uuid not null references public.lop(id) on delete cascade,
  mo     boolean not null,
  updated_at timestamptz not null default now(),
  primary key (ma, lop_id)
);
create table if not exists public.tinh_nang_log (
  id     bigint generated always as identity primary key,
  ma     text not null,
  lop_id uuid,
  cu     jsonb,
  moi    jsonb,
  nguoi  uuid,
  luc    timestamptz not null default now()
);
create index if not exists tinh_nang_log_ma_idx on public.tinh_nang_log (ma, luc desc);

-- ── trigger ghi vết ─────────────────────────────────────────────────────────
create or replace function public._tinh_nang_ghi_vet() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_table_name = 'tinh_nang' then
    if tg_op = 'UPDATE' and new.mo_tu is distinct from old.mo_tu then
      insert into tinh_nang_log (ma, cu, moi, nguoi) values (new.ma, jsonb_build_object('mo_tu', old.mo_tu), jsonb_build_object('mo_tu', new.mo_tu), auth.uid());
    end if;
    new.updated_at := now();
    return new;
  else
    if tg_op = 'DELETE' then
      insert into tinh_nang_log (ma, lop_id, cu, moi, nguoi) values (old.ma, old.lop_id, jsonb_build_object('mo', old.mo), null, auth.uid());
      return old;
    elsif tg_op = 'INSERT' then
      insert into tinh_nang_log (ma, lop_id, cu, moi, nguoi) values (new.ma, new.lop_id, null, jsonb_build_object('mo', new.mo), auth.uid());
      return new;
    else
      if new.mo is distinct from old.mo then
        insert into tinh_nang_log (ma, lop_id, cu, moi, nguoi) values (new.ma, new.lop_id, jsonb_build_object('mo', old.mo), jsonb_build_object('mo', new.mo), auth.uid());
      end if;
      new.updated_at := now();
      return new;
    end if;
  end if;
end $$;
drop trigger if exists tinh_nang_vet on public.tinh_nang;
create trigger tinh_nang_vet before update on public.tinh_nang for each row execute function public._tinh_nang_ghi_vet();
drop trigger if exists tinh_nang_lop_vet on public.tinh_nang_lop;
create trigger tinh_nang_lop_vet before insert or update or delete on public.tinh_nang_lop for each row execute function public._tinh_nang_ghi_vet();

-- ── RLS: chỉ người có quyền xem danh mục; GHI chỉ qua RPC bên dưới ─────────────
alter table public.tinh_nang enable row level security;
alter table public.tinh_nang_lop enable row level security;
alter table public.tinh_nang_log enable row level security;
drop policy if exists tinh_nang_doc on public.tinh_nang;
create policy tinh_nang_doc on public.tinh_nang for select to authenticated using (public.co_chuc_nang('tinh_nang'));
drop policy if exists tinh_nang_lop_doc on public.tinh_nang_lop;
create policy tinh_nang_lop_doc on public.tinh_nang_lop for select to authenticated using (public.co_chuc_nang('tinh_nang'));
drop policy if exists tinh_nang_log_doc on public.tinh_nang_log;
create policy tinh_nang_log_doc on public.tinh_nang_log for select to authenticated using (public.co_chuc_nang('tinh_nang'));
revoke all on public.tinh_nang, public.tinh_nang_lop, public.tinh_nang_log from anon;

-- ── SEED: danh mục (mọi tính năng MỞ — không đổi hành vi hiện tại) ─────────────
-- Thứ tự = thứ tự đề xuất mở dần (Thùy duyệt 07/10): lõi học → nhiệm vụ/chuỗi → thành tựu → xếp hạng → xã hội/game.
insert into public.tinh_nang (ma, ten, nhom, thu_tu, mo_tu, mo_ta) values
  ('hoc_tap',    'Học tập (Tự luyện · Phiêu lưu)', 'hoc',  10, date '2020-01-01', 'Ô Học tập — luyện dạng yếu, bản đồ phiêu lưu'),
  ('thong_tin',  'Thông tin học tập',              'hoc',  20, date '2020-01-01', 'Kết quả gần nhất, dạng đang yếu, nhận xét'),
  ('so_tay',     'Sổ tay kiến thức',               'hoc',  30, date '2020-01-01', 'Tra lý thuyết và bài mẫu theo dạng'),
  ('nhiem_vu',   'Nhiệm vụ (+ quay may mắn)',      'choi', 40, date '2020-01-01', 'Nhiệm vụ ngày/tuần/tháng, điểm học tập ĐHT, vòng quay'),
  ('chuoi',      'Chuỗi làm bài',                  'choi', 50, date '2020-01-01', 'Ngọn lửa chuỗi ngày ở đầu màn chính + mốc chuỗi'),
  ('thanh_tuu',  'Thành tựu',                      'choi', 60, date '2020-01-01', 'Thành tựu mùa, giải cuối tháng, huy hiệu'),
  ('vi_xu',      'Ví xu',                          'choi', 70, date '2020-01-01', 'Xu, lịch sử, đổi quà'),
  ('xep_hang',   'Bảng xếp hạng',                  'choi', 80, date '2020-01-01', 'BXH theo môn/lớp/khối'),
  ('rank',       'Rank (cấp bậc chiến binh)',      'choi', 90, date '2020-01-01', 'Bậc Rank theo môn, huy hiệu cạnh tên'),
  ('thu_vien',   'Thư viện BK',                    'choi', 100, date '2020-01-01', 'Nơi tìm hiểu mọi thứ trên app'),
  ('the_gioi',   'Thế giới BK',                    'choi', 110, date '2020-01-01', 'Mạng xã hội khoe thành tích'),
  ('tro_choi',   'Trò chơi',                       'choi', 120, date '2020-01-01', 'Nông trại BK, Đấu Từ và game khác'),
  ('de_thi_thu', 'Đề thi thử (sắp có)',            'hoc',  130, date '2020-01-01', 'Ô "Sắp có" — đóng đi để màn chính gọn')
on conflict (ma) do nothing;

-- ── ĐỌC cho HS: danh sách mã tính năng em ĐƯỢC THẤY ──────────────────────────
create or replace function public.fn_hs_tinh_nang_mo()
returns text[]
language sql stable security definer set search_path = public as $$
  with hom as (select (now() at time zone 'Asia/Ho_Chi_Minh')::date as d),
  lop_hs as (select hl.lop_id from hoc_sinh_lop hl where hl.hoc_sinh_id = public.my_hoc_sinh_id() and hl.trang_thai = 'dang_hoc')
  select coalesce(array_agg(t.ma order by t.thu_tu), '{}'::text[])
  from tinh_nang t, hom
  where case
    when exists (select 1 from lop_hs) then exists (
      select 1 from lop_hs l left join tinh_nang_lop o on o.ma = t.ma and o.lop_id = l.lop_id
      where coalesce(o.mo, t.mo_tu is not null and t.mo_tu <= hom.d))
    else t.mo_tu is not null and t.mo_tu <= hom.d
  end
$$;
revoke all on function public.fn_hs_tinh_nang_mo() from public;
revoke execute on function public.fn_hs_tinh_nang_mo() from anon;
grant execute on function public.fn_hs_tinh_nang_mo() to authenticated;

-- ── ĐỌC cho admin: toàn bộ công tắc + ngoại lệ lớp + số em đang thấy ───────────
create or replace function public.fn_tinh_nang_ds()
returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.co_chuc_nang('tinh_nang') then raise exception 'Không có quyền xem công tắc tính năng' using errcode = '42501'; end if;
  return jsonb_build_object(
    'hom_nay', (now() at time zone 'Asia/Ho_Chi_Minh')::date,
    'tinh_nang', coalesce((select jsonb_agg(jsonb_build_object(
        'ma', t.ma, 'ten', t.ten, 'nhom', t.nhom, 'mo_ta', t.mo_ta, 'mo_tu', t.mo_tu,
        'ngoai_le', coalesce((select jsonb_agg(jsonb_build_object('lop_id', o.lop_id, 'ten_lop', l.ten_lop, 'mon', l.mon, 'mo', o.mo) order by l.ten_lop)
                              from tinh_nang_lop o join lop l on l.id = o.lop_id where o.ma = t.ma), '[]'::jsonb)
      ) order by t.thu_tu) from tinh_nang t), '[]'::jsonb),
    'lop', coalesce((select jsonb_agg(jsonb_build_object('id', l.id, 'ten_lop', l.ten_lop, 'mon', l.mon, 'khoi', l.khoi) order by l.khoi, l.ten_lop)
                     from lop l where l.trang_thai = 'dang_hoc'), '[]'::jsonb));
end $$;
revoke all on function public.fn_tinh_nang_ds() from public;
revoke execute on function public.fn_tinh_nang_ds() from anon;
grant execute on function public.fn_tinh_nang_ds() to authenticated;

-- ── GHI: đặt ngày mở chung (NULL = đóng với mọi lớp chưa có ngoại lệ) ─────────
create or replace function public.fn_tinh_nang_dat(p_ma text, p_mo_tu date)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.co_quyen_ghi('tinh_nang') then raise exception 'Không có quyền đổi công tắc tính năng' using errcode = '42501'; end if;
  update tinh_nang set mo_tu = p_mo_tu where ma = p_ma;
  if not found then raise exception 'Tính năng % không tồn tại', p_ma using errcode = 'P0002'; end if;
end $$;
revoke all on function public.fn_tinh_nang_dat(text, date) from public;
revoke execute on function public.fn_tinh_nang_dat(text, date) from anon;
grant execute on function public.fn_tinh_nang_dat(text, date) to authenticated;

-- ── GHI: ngoại lệ theo lớp (p_mo = NULL ⇒ bỏ ngoại lệ, lớp quay về theo ngày chung) ──
create or replace function public.fn_tinh_nang_lop_dat(p_ma text, p_lop_id uuid, p_mo boolean)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.co_quyen_ghi('tinh_nang') then raise exception 'Không có quyền đổi công tắc tính năng' using errcode = '42501'; end if;
  if not exists (select 1 from tinh_nang where ma = p_ma) then raise exception 'Tính năng % không tồn tại', p_ma using errcode = 'P0002'; end if;
  if p_mo is null then
    delete from tinh_nang_lop where ma = p_ma and lop_id = p_lop_id;
  else
    insert into tinh_nang_lop (ma, lop_id, mo) values (p_ma, p_lop_id, p_mo)
    on conflict (ma, lop_id) do update set mo = excluded.mo;
  end if;
end $$;
revoke all on function public.fn_tinh_nang_lop_dat(text, uuid, boolean) from public;
revoke execute on function public.fn_tinh_nang_lop_dat(text, uuid, boolean) from anon;
grant execute on function public.fn_tinh_nang_lop_dat(text, uuid, boolean) to authenticated;
