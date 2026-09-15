-- ============================================================================
-- 202608302120 — LUỒNG PH NỘP BTVN BẰNG ẢNH + nền app TA (PLAN-app-ta.md, CEO chốt 30/08)
-- ----------------------------------------------------------------------------
-- ① btvn_nop / btvn_nop_anh: lượt nộp (HS × buổi giao BTVN) + xấp ảnh. Anti-NULL §1.5:
--    dòng nộp CHỈ ra đời cùng transaction với ảnh thật (fn_btvn_nop_tao) — không insert-trước-điền-sau.
--    Ảnh gốc `path` IMMUTABLE; bản TA đánh dấu = `path_cham` RIÊNG (không đè bài làm của HS).
--    Bucket 'btvn-nop' PRIVATE → DB lưu PATH, mọi hiển thị đi qua signed URL.
-- ② btvn_nhan_xet_mau: catalog nhận xét TA CHỌN TỪ LIST (CEO 30/08 — không gõ tay). Tham chiếu bằng
--    mã text không FK → CẤM xoá cứng, tắt bằng active=false (luật §2 kho rác).
-- ③ Vá nợ: CHECK cho btvn_ket_qua.trang_thai_nop/thai_do (NOT VALID — chỉ chặn ghi MỚI, chưa
--    validate data cũ vì chưa audit; giá trị lạ hiện làm fn_exp_btvn_bai trả 0 âm thầm).
-- ④ RPC: fn_btvn_nop_tao (đường ghi duy nhất của PH — security definer, cấp cho role ph_nop) ·
--    fn_btvn_de_xuat_trang_thai (hệ ĐỀ XUẤT đúng-hạn/muộn từ nop_at vs han_nop_bai_test — TA tick
--    tay mới ghi btvn_ket_qua, CEO chốt ⑥) · fn_btvn_tra_bai / fn_btvn_tra_bai_buoi (mở khoá cho PH
--    xem) · fn_dong_btvn v2 (đóng BTVN tự trả nốt lượt nộp đã chấm).
-- ⑤ View cho app PH đọc qua FDW role fdw_bkdemy_web (đường đọc sẵn có): view chạy quyền OWNER
--    (claude_build sở hữu bảng nên bypass RLS) → chỉ cần grant SELECT view, KHÔNG mở bảng gốc.
-- ⑥ Role `ph_nop` + bucket storage `btvn-nop` KHÔNG tạo được từ role claude_build →
--    scripts/sql_appta_role_bucket.sql (dán 1 lần trong Supabase SQL Editor). Grant ở đây được
--    guard `if exists role` nên migration chạy được cả trước lẫn sau bước dán.
-- MẤT GÌ (Luật xoá): không xoá gì — chỉ thêm bảng/hàm/view + redefine fn_dong_btvn (thêm bước trả).
-- ============================================================================

-- ── ① bảng nộp ──
create table if not exists btvn_nop (
  hoc_sinh_id uuid not null references hoc_sinh(id) on delete cascade,
  buoi_hoc_id uuid not null references buoi_hoc(id) on delete cascade,
  nop_at      timestamptz not null default now(),
  nguon       text not null default 'ph_app' check (nguon in ('ph_app')),
  nhan_xet_ma text[] not null default '{}',      -- mã từ btvn_nhan_xet_mau (TA chọn, có thể nhiều)
  tra_at      timestamptz,                        -- null = chưa trả; set = PH thấy bài chấm + đáp án
  tra_boi     uuid references nhan_su(id),
  updated_at  timestamptz not null default now(),
  primary key (hoc_sinh_id, buoi_hoc_id)
);
create table if not exists btvn_nop_anh (
  id          uuid primary key default gen_random_uuid(),
  hoc_sinh_id uuid not null,
  buoi_hoc_id uuid not null,
  path        text not null,                      -- path trong bucket PRIVATE 'btvn-nop' (ảnh GỐC PH nộp — immutable)
  path_cham   text,                               -- path bản TA đánh dấu (PNG mới), null = chưa chấm ảnh này
                                                  -- bucket private → DB lưu PATH, hiển thị = signed URL ký lúc xem
  thu_tu      integer not null default 0,         -- CHỈ để hiển thị — danh tính là id (luật §2)
  created_at  timestamptz not null default now(),
  foreign key (hoc_sinh_id, buoi_hoc_id) references btvn_nop(hoc_sinh_id, buoi_hoc_id) on delete cascade
);
create index if not exists idx_btvn_nop_buoi on btvn_nop (buoi_hoc_id);
create index if not exists idx_btvn_nop_anh_nop on btvn_nop_anh (buoi_hoc_id, hoc_sinh_id);

-- Đổi nội dung con bump updated_at cha (luật §2 — mất dấu thời gian là chẩn đoán sau đọc nhầm).
create or replace function public.fn_btvn_nop_touch() returns trigger language plpgsql as $$
begin
  update btvn_nop set updated_at = now()
  where hoc_sinh_id = coalesce(new.hoc_sinh_id, old.hoc_sinh_id)
    and buoi_hoc_id = coalesce(new.buoi_hoc_id, old.buoi_hoc_id);
  return coalesce(new, old);
end $$;
drop trigger if exists tg_btvn_nop_anh_touch on btvn_nop_anh;
create trigger tg_btvn_nop_anh_touch after insert or update or delete on btvn_nop_anh
  for each row execute function public.fn_btvn_nop_touch();

-- ── ② catalog nhận xét (TA chọn từ list — CEO sửa list bằng data, không cần deploy) ──
create table if not exists btvn_nhan_xet_mau (
  ma       text primary key,
  noi_dung text not null,
  thu_tu   integer not null default 0,
  active   boolean not null default true
);
insert into btvn_nhan_xet_mau (ma, noi_dung, thu_tu) values
  ('lam_day_du',      'Con làm bài đầy đủ, trình bày tốt.', 1),
  ('trinh_bay_sach',  'Bài làm sạch sẽ, trình bày cẩn thận.', 2),
  ('tien_bo',         'Con tiến bộ hơn so với các buổi trước.', 3),
  ('sai_do_au',       'Sai chủ yếu do ẩu / nhầm lẫn tính toán — con lưu ý đọc kỹ đề.', 4),
  ('can_xem_ly_thuyet','Con chưa nắm chắc dạng bài, cần xem lại lý thuyết trước buổi sau.', 5),
  ('lam_thieu',       'Con làm thiếu một số câu — cố gắng hoàn thành đủ bài.', 6),
  ('trinh_bay_can_sua','Kết quả ổn nhưng cách trình bày cần sửa — xem bản chữa trong ảnh.', 7),
  ('can_ho_tro',      'Con cần hỗ trợ thêm phần này, thầy/cô sẽ trao đổi trực tiếp với con.', 8)
on conflict (ma) do nothing;

-- ── ③ vá nợ CHECK (NOT VALID — data cũ chưa audit; validate ở đợt dọn riêng) ──
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'btvn_ket_qua_trang_thai_nop_chk') then
    alter table btvn_ket_qua add constraint btvn_ket_qua_trang_thai_nop_chk
      check (trang_thai_nop is null or trang_thai_nop in ('nop_dung_han','nop_muon','xin_phep','khong_lam')) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'btvn_ket_qua_thai_do_chk') then
    alter table btvn_ket_qua add constraint btvn_ket_qua_thai_do_chk
      check (thai_do is null or thai_do in ('nghiem_tuc','chua_het_suc','chua_nghiem_tuc','chong_doi')) not valid;
  end if;
end $$;

-- ── RLS: staff member-gate như mọi bảng động; PH không đọc thẳng (đi qua view FDW / RPC) ──
alter table btvn_nop enable row level security;
alter table btvn_nop_anh enable row level security;
alter table btvn_nhan_xet_mau enable row level security;
drop policy if exists btvn_nop_member_all on btvn_nop;
create policy btvn_nop_member_all on btvn_nop for all to authenticated
  using (public.la_thanh_vien()) with check (public.la_thanh_vien());
drop policy if exists btvn_nop_anh_member_all on btvn_nop_anh;
create policy btvn_nop_anh_member_all on btvn_nop_anh for all to authenticated
  using (public.la_thanh_vien()) with check (public.la_thanh_vien());
drop policy if exists btvn_nhan_xet_mau_member_read on btvn_nhan_xet_mau;
create policy btvn_nhan_xet_mau_member_read on btvn_nhan_xet_mau for select to authenticated
  using (public.la_thanh_vien());

-- ── ④ RPC ──

-- Đường GHI DUY NHẤT của PH (server bkdemy-ph gọi bằng role ph_nop). security definer (owner
-- claude_build) → tự validate, không dựa RLS. Idempotent: đã có lượt nộp thì CHỈ THÊM ảnh
-- (không đẻ dòng nộp thứ 2, không reset nop_at). Chặn khi đã trả bài.
create or replace function public.fn_btvn_nop_tao(p_hoc_sinh_id uuid, p_buoi_hoc_id uuid, p_paths text[])
returns jsonb language plpgsql security definer set search_path = public as $$
declare b record; v_max integer; v_new boolean := false;
begin
  if p_paths is null or array_length(p_paths, 1) is null then
    raise exception 'Phải có ít nhất 1 ảnh — lượt nộp không ảnh không được tạo (anti-NULL §1.5).';
  end if;
  select id, lop_id, trang_thai into b from buoi_hoc where id = p_buoi_hoc_id;
  if b is null then raise exception 'Không thấy buổi %', p_buoi_hoc_id; end if;
  if b.trang_thai = 'huy' then raise exception 'Buổi đã huỷ — không nhận bài.'; end if;
  if not exists (
    select 1 from hoc_sinh_lop hl
    where hl.hoc_sinh_id = p_hoc_sinh_id and hl.lop_id = b.lop_id and hl.trang_thai = 'dang_hoc'
  ) and not exists (
    -- HS đã rời lớp nhưng CÓ MẶT ở chính buổi này (chuyển lớp giữa kỳ) vẫn nộp được
    select 1 from buoi_hoc_hs r where r.buoi_hoc_id = p_buoi_hoc_id and r.hoc_sinh_id = p_hoc_sinh_id
  ) then
    raise exception 'Học sinh không thuộc lớp của buổi này.';
  end if;
  if exists (select 1 from btvn_nop n where n.hoc_sinh_id = p_hoc_sinh_id and n.buoi_hoc_id = p_buoi_hoc_id
             and n.tra_at is not null) then
    raise exception 'Bài đã được trả — không bổ sung ảnh được nữa.';
  end if;

  insert into btvn_nop (hoc_sinh_id, buoi_hoc_id)
  values (p_hoc_sinh_id, p_buoi_hoc_id)
  on conflict (hoc_sinh_id, buoi_hoc_id) do nothing;
  get diagnostics v_max = row_count; v_new := v_max > 0;

  select coalesce(max(thu_tu), 0) into v_max from btvn_nop_anh
  where hoc_sinh_id = p_hoc_sinh_id and buoi_hoc_id = p_buoi_hoc_id;
  insert into btvn_nop_anh (hoc_sinh_id, buoi_hoc_id, path, thu_tu)
  select p_hoc_sinh_id, p_buoi_hoc_id, u, v_max + ord
  from unnest(p_paths) with ordinality as t(u, ord);

  return jsonb_build_object('moi', v_new, 'so_anh_them', array_length(p_paths, 1));
end $$;
revoke execute on function public.fn_btvn_nop_tao(uuid, uuid, text[]) from public;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'ph_nop') then
    grant execute on function public.fn_btvn_nop_tao(uuid, uuid, text[]) to ph_nop;
  end if;
end $$;

-- Hệ ĐỀ XUẤT trạng thái nộp (CEO ⑥: đề xuất thôi, TA tick tay mới ghi btvn_ket_qua).
-- Deadline = han_nop_bai_test(lớp, ngày, 'btvn') — cùng nguồn deadline BTVN của Việc-của-tôi.
create or replace function public.fn_btvn_de_xuat_trang_thai(p_buoi_hoc_id uuid)
returns table (hoc_sinh_id uuid, nop_at timestamptz, de_xuat text)
language sql stable as $$
  select n.hoc_sinh_id, n.nop_at,
         case when h.han is null or n.nop_at <= h.han then 'nop_dung_han' else 'nop_muon' end
  from btvn_nop n
  join buoi_hoc b on b.id = n.buoi_hoc_id
  cross join lateral (select public.han_nop_bai_test(b.lop_id, b.ngay, 'btvn') as han) h
  where n.buoi_hoc_id = p_buoi_hoc_id
$$;
grant execute on function public.fn_btvn_de_xuat_trang_thai(uuid) to authenticated;

-- Trả bài 1 HS: mở khoá cho PH xem bài chấm + đáp án. Guard: phải có gì đó để trả
-- (đã có verdict per-câu HOẶC đã ghi btvn_ket_qua) — không trả bài trắng.
create or replace function public.fn_btvn_tra_bai(p_hoc_sinh_id uuid, p_buoi_hoc_id uuid)
returns void language plpgsql as $$
begin
  if not exists (select 1 from btvn_nop where hoc_sinh_id = p_hoc_sinh_id and buoi_hoc_id = p_buoi_hoc_id) then
    raise exception 'HS này chưa nộp bài trên app.';
  end if;
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

-- Trả cả buổi: trả nốt các lượt nộp ĐÃ CHẤM mà TA quên bấm trả (gọi lúc đóng BTVN).
create or replace function public.fn_btvn_tra_bai_buoi(p_buoi_hoc_id uuid)
returns integer language plpgsql as $$
declare v integer;
begin
  update btvn_nop n set tra_at = now(), tra_boi = public.current_nhan_su_id(), updated_at = now()
  where n.buoi_hoc_id = p_buoi_hoc_id and n.tra_at is null
    and (exists (select 1 from gami_grades g
                 join gami_session_problems sp on sp.id = g.problem_id and sp.phase = 'btvn'
                 where sp.buoi_hoc_id = p_buoi_hoc_id and g.hoc_sinh_id = n.hoc_sinh_id)
      or exists (select 1 from btvn_ket_qua k
                 where k.hoc_sinh_id = n.hoc_sinh_id and k.buoi_hoc_id = p_buoi_hoc_id));
  get diagnostics v = row_count;
  return v;
end $$;
grant execute on function public.fn_btvn_tra_bai_buoi(uuid) to authenticated;

-- fn_dong_btvn v2: y hệt 202608300240 + TỰ TRẢ nốt lượt nộp đã chấm (CEO ③ "hệ thống gửi qua app").
create or replace function public.fn_dong_btvn(p_buoi_id uuid)
returns jsonb language plpgsql as $$
declare b record; v_claimed integer; v_ret jsonb; v_tra integer;
begin
  select lop_id, ngay into b from buoi_hoc where id = p_buoi_id;
  update buoi_hoc set btvn_dong_at = now(), updated_at = now() where id = p_buoi_id and btvn_dong_at is null;
  get diagnostics v_claimed = row_count;
  if v_claimed = 0 then return jsonb_build_object('already', true, 'thuong', 0); end if;
  v_ret := public.fn_recompute_exp_thang(b.lop_id, to_char(b.ngay, 'YYYY-MM'));
  perform public.fn_buoi_recompute_hoan_tat(p_buoi_id);
  v_tra := public.fn_btvn_tra_bai_buoi(p_buoi_id);
  return jsonb_build_object('thuong', v_ret->'hs', 'tra', v_tra);
end $$;
grant execute on function public.fn_dong_btvn(uuid) to authenticated;

-- ── ⑤ VIEW cho app PH (FDW đọc, chạy quyền owner — gate chặt trong định nghĩa) ──

-- Lượt nộp của HS: PH thấy "đã nộp / đã trả" (không gate tra_at — trạng thái nộp là của PH).
create or replace view public.v_btvn_nop_ph as
  select n.hoc_sinh_id, n.buoi_hoc_id, b.ngay, l.mon, l.ten_lop, n.nop_at, n.tra_at,
         (select count(*) from btvn_nop_anh a
          where a.hoc_sinh_id = n.hoc_sinh_id and a.buoi_hoc_id = n.buoi_hoc_id) as so_anh
  from btvn_nop n
  join buoi_hoc b on b.id = n.buoi_hoc_id
  left join lop l on l.id = b.lop_id;

-- Ảnh bài CHẤM (chỉ sau khi trả): ưu tiên bản TA đánh dấu, fallback ảnh gốc.
-- `path` = path trong bucket private 'btvn-nop' — server bkdemy-ph ký signed URL rồi mới đưa PH.
create or replace view public.v_btvn_tra_anh as
  select a.hoc_sinh_id, a.buoi_hoc_id, a.thu_tu, coalesce(a.path_cham, a.path) as path
  from btvn_nop_anh a
  join btvn_nop n on n.hoc_sinh_id = a.hoc_sinh_id and n.buoi_hoc_id = a.buoi_hoc_id
  where n.tra_at is not null;

-- Kết quả chấm (chỉ sau khi trả): trạng thái nộp/thái độ + nhận xét mẫu đã chọn.
create or replace view public.v_btvn_tra_ket_qua as
  select n.hoc_sinh_id, n.buoi_hoc_id, n.tra_at, k.trang_thai_nop, k.thai_do,
         coalesce((select array_agg(m.noi_dung order by m.thu_tu) from btvn_nhan_xet_mau m
                   where m.ma = any(n.nhan_xet_ma)), '{}') as nhan_xet
  from btvn_nop n
  left join btvn_ket_qua k on k.hoc_sinh_id = n.hoc_sinh_id and k.buoi_hoc_id = n.buoi_hoc_id
  where n.tra_at is not null;

-- Đ/C/S per câu (chỉ sau khi trả).
create or replace view public.v_btvn_tra_cau as
  select n.hoc_sinh_id, n.buoi_hoc_id, sp.problem_no, sp.ma_dang, g.result
  from btvn_nop n
  join gami_session_problems sp on sp.buoi_hoc_id = n.buoi_hoc_id and sp.phase = 'btvn'
  join gami_grades g on g.problem_id = sp.id and g.hoc_sinh_id = n.hoc_sinh_id
  where n.tra_at is not null;

-- Đáp án chi tiết từ kho (CEO ③) — per (HS × buổi × câu), CHỈ sau khi trả bài cho đúng HS đó.
-- Dispatch môn→bảng câu ở đây (Toán=dai_cau_hoi · KHTN=khtn_cau_hoi); câu Hình (hinh_y) chưa
-- có trong view v1 — bổ sung khi luồng Hình cần.
create or replace view public.v_btvn_dap_an as
  select n.hoc_sinh_id, n.buoi_hoc_id, sp.problem_no, sp.ma_dang, sp.ma_cau,
         coalesce(d.loai_cau, kk.loai_cau) as loai_cau,
         coalesce(d.noi_dung, kk.noi_dung) as de_bai,
         coalesce(d.lua_chon, kk.lua_chon) as lua_chon,
         coalesce(d.menh_de, kk.menh_de)   as menh_de,
         coalesce(d.dap_an, kk.dap_an)     as dap_an,
         coalesce(d.loi_giai, kk.loi_giai) as loi_giai,
         coalesce(d.anh_de, kk.anh_de)     as anh_de,
         coalesce(d.anh_dap_an, kk.anh_dap_an) as anh_dap_an
  from btvn_nop n
  join buoi_hoc b on b.id = n.buoi_hoc_id
  left join lop l on l.id = b.lop_id
  join gami_session_problems sp on sp.buoi_hoc_id = n.buoi_hoc_id and sp.phase = 'btvn' and sp.ma_cau is not null
  left join dai_cau_hoi d  on l.mon = 'Toán' and d.ma_cau = sp.ma_cau
  left join khtn_cau_hoi kk on l.mon = 'KHTN' and kk.ma_cau = sp.ma_cau
  where n.tra_at is not null;

do $$ begin
  if exists (select 1 from pg_roles where rolname = 'fdw_bkdemy_web') then
    grant select on public.v_btvn_nop_ph, public.v_btvn_tra_anh, public.v_btvn_tra_ket_qua,
                    public.v_btvn_tra_cau, public.v_btvn_dap_an to fdw_bkdemy_web;
  end if;
end $$;
