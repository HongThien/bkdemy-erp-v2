-- ============================================================================
-- SƠ ĐỒ TƯ DUY của câu Hình (Thùy 14/11).
--   · Thuộc tính RIÊNG của câu, lưu TÁCH khỏi lời giải chi tiết; chỉ hiển thị kèm lời giải (HS muốn xem thì bấm).
--   · Lưu MỘT đồ thị mốc, máy vẽ ra 2 chiều:
--       XUÔI  = giả thiết → kết luận (ô trái → phải, hết hàng thì xuống dòng). Lời giải chi tiết chia KHÚC theo đúng thứ tự này,
--               mỗi khúc chứng minh đúng một ô, mở bằng dòng `[[so-do:<k>]]` (app hiện dải highlight "③ <mốc>").
--       NGƯỢC = phân tích đi lên ("muốn có ⑤ cần ③, ④") = Phần 1 "Hướng dẫn" cũ, kể cả Mấu chốt.
--     (phân tích – tổng hợp của Pappus: phân tích đi ngược để TÌM cách, tổng hợp đi xuôi để TRÌNH BÀY.)
--   · Hai chiều cùng một nguồn ⇒ không bao giờ lệch nhau.
--
-- nut = mảng ô theo THỨ TỰ XUÔI. Mỗi ô:
--   k        khoá BẤT BIẾN trong câu ('n1', 'n2'…; thêm ô mới lấy số chưa dùng, không đánh lại) — lời giải móc khúc vào khoá này,
--            số hiển thị ①②③ là VỊ TRÍ, suy lúc vẽ (CLAUDE.md "mã gốc bất biến", "danh tính bám khoá, không bám vị trí").
--   y        nhãn ý theo đề ('a', 'b', 'c'…) mà ô thuộc về.
--   noi_dung mốc (kết luận bộ phận), có thể chứa $…$.
--   tu       mảng: khoá các ô ĐỨNG TRƯỚC mà ô này cần, và/hoặc 'gt' (giả thiết). Chỉ trỏ về ô trước ⇒ đồ thị không thể có vòng.
--   ly_do    (tuỳ chọn) lý do ngắn của mũi tên, vd "c.g.c".
-- ============================================================================

create or replace function public._hh_so_do_hop_le(p jsonb) returns boolean
language plpgsql immutable as $$
declare
  e jsonb; t text; khoa text[] := '{}';
begin
  if p is null or jsonb_typeof(p) <> 'array' or jsonb_array_length(p) < 1 or jsonb_array_length(p) > 20 then return false; end if;
  for e in select x from jsonb_array_elements(p) x loop
    if jsonb_typeof(e) <> 'object' then return false; end if;
    if coalesce(e->>'k', '') !~ '^n[0-9]+$' or (e->>'k') = any(khoa) then return false; end if;
    if coalesce(btrim(e->>'y'), '') = '' then return false; end if;
    if coalesce(btrim(e->>'noi_dung'), '') = '' then return false; end if;
    if jsonb_typeof(e->'tu') is distinct from 'array' or jsonb_array_length(e->'tu') < 1 then return false; end if;
    for t in select jsonb_array_elements_text(e->'tu') loop
      if t <> 'gt' and not (t = any(khoa)) then return false; end if;
    end loop;
    if e ? 'ly_do' and jsonb_typeof(e->'ly_do') <> 'string' then return false; end if;
    khoa := khoa || (e->>'k');
  end loop;
  return true;
end $$;

create table public.hinh_hoc_cau_so_do (
  ma_cau     text primary key references public.hinh_hoc_cau_hoi(ma_cau),
  mau_chot   text not null check (btrim(mau_chot) <> ''),
  nut        jsonb not null check (public._hh_so_do_hop_le(nut)),
  nguon      text not null default 'claude' check (nguon in ('claude', 'nguoi')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.hinh_hoc_cau_so_do is 'Sơ đồ tư duy của câu Hình (Thùy 14/11): một đồ thị mốc theo thứ tự xuôi, vẽ ra 2 chiều xuôi/ngược; lời giải chia khúc bằng [[so-do:<k>]].';

create or replace function public._hh_so_do_cham_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;
create trigger hinh_hoc_cau_so_do_updated_at before update on public.hinh_hoc_cau_so_do
  for each row execute function public._hh_so_do_cham_updated_at();

alter table public.hinh_hoc_cau_so_do enable row level security;
create policy hinh_hoc_cau_so_do_member_all on public.hinh_hoc_cau_so_do for all to authenticated
  using ((select public.la_thanh_vien())) with check ((select public.la_thanh_vien()));
revoke all on public.hinh_hoc_cau_so_do from anon;
