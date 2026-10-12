-- ============================================================================
-- HÀNG DUYỆT: PHÂN TRANG + LỌC THEO CHỦ ĐỀ BẢN ĐỒ MỚI (Thùy 11/10: "mỗi batch 1000 câu — t ko check
-- được riêng chủ đề tích phân").
--
-- Nguyên nhân: Supabase API cắt mọi truy vấn ở 1000 dòng (max_rows) — `.limit(10000)` của client vô tác
-- dụng. Khối 12 có 2.563 câu ở dạng chờ + ~3.900 câu ở dạng thật chưa duyệt ⇒ màn Duyệt chỉ thấy 1000
-- câu đầu (xếp theo dạng, mã câu), câu mới nhập nằm cuối nên KHÔNG BAO GIỜ hiện; mà câu dạng chờ không
-- có chuyên đề nên cũng không lọc được theo chủ đề.
--
-- Sửa:
--  (1) fn_kho_hang_duyet thêm p_offset ⇒ client phân trang từng 1000 (CLAUDE.md §2 "luôn paginate").
--  (2) fn_kho_hang_duyet trả thêm GỢI Ý BẢN ĐỒ MỚI của câu (chủ đề · chuyên đề · nhóm · dạng bài + trạng
--      thái 'gan' | 'chua_khop') — chỉ môn Toán Đại (kho 'dai'), môn khác trả null.
--  (3) Bảng mới `dai_bdm_cau_chua_khop` = rổ "chưa khớp" của spec-ban-do-4-tang.md §0 B3: câu THUỘC chủ đề
--      bản đồ mới nhưng không dạng bài nào khớp (không ép — §1.5). Chỉ cộng, không đụng bảng cũ.
-- ============================================================================

create table if not exists public.dai_bdm_cau_chua_khop (
  ma_cau    text primary key references public.dai_cau_hoi(ma_cau),
  chu_de_id text not null references public.dai_bdm_chu_de(id),
  ly_do     text not null default '',
  nguon     text not null default 'ai' check (nguon in ('nguoi', 'ai')),
  actor     uuid default public.jwt_uid(),
  at        timestamptz not null default now()
);
create index if not exists dai_bdm_cau_chua_khop_chu_de_idx on public.dai_bdm_cau_chua_khop (chu_de_id);

comment on table public.dai_bdm_cau_chua_khop is
  'Rổ "chưa khớp" của bản đồ mới: câu thuộc chủ đề chu_de_id nhưng không dạng bài nào khớp (AI/người ghi lý do). Không có dòng = chưa ai xét hoặc đã gán dạng bài (dai_bdm_gan_cau).';

alter table public.dai_bdm_cau_chua_khop enable row level security;
revoke all on public.dai_bdm_cau_chua_khop from public, anon;
grant select, insert, update, delete on public.dai_bdm_cau_chua_khop to authenticated;
drop policy if exists dai_bdm_cau_chua_khop_member_all on public.dai_bdm_cau_chua_khop;
create policy dai_bdm_cau_chua_khop_member_all on public.dai_bdm_cau_chua_khop
  for all to authenticated using (public.la_thanh_vien()) with check (public.la_thanh_vien());

drop trigger if exists trg_bdm_cau_chua_khop_log on public.dai_bdm_cau_chua_khop;
create trigger trg_bdm_cau_chua_khop_log after insert or update or delete on public.dai_bdm_cau_chua_khop
  for each row execute function public._bdm_ghi_log();

-- ── fn_kho_hang_duyet: + p_offset, + cột gợi ý bản đồ mới ─────────────────────────────────────────
drop function if exists public.fn_kho_hang_duyet(text, text, text, integer);

create function public.fn_kho_hang_duyet(p_mon text, p_loc text, p_khoi text default null, p_limit integer default 300, p_offset integer default 0)
 returns table(ma_cau text, dang_chinh text, ten_dang text, ten_chuyen_de text, khoi text, loai_cau text, noi_dung text,
               lua_chon jsonb, menh_de jsonb, dap_an text, loi_giai text, anh_de text, anh_dap_an text, nguon text,
               nguon_giai text, giai_method text, created_at timestamptz, ma_cum text, ten_cum text, da_duyet boolean,
               kho_chuan boolean, kiem_may text, kiem_may_boi text, kiem_may_ghi text, kiem_may_at timestamptz,
               dang_ai_de_xuat text,
               bdm_chu_de text, bdm_chuyen_de text, bdm_nhom text, bdm_dang_bai text, bdm_dang_bai_id text,
               bdm_trang_thai text, bdm_ly_do text)
 language plpgsql
 stable security definer
 set search_path to 'public'
as $function$
declare t text := public.fn_kho_tbl(p_mon); v_dk text := public._kho_loc_duyet_sql(p_loc);
        v_co_cum boolean; v_bdm boolean;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if t is null then raise exception 'fn_kho_hang_duyet: môn không hợp lệ %', p_mon; end if;
  if v_dk is null then raise exception 'fn_kho_hang_duyet: bộ lọc không hợp lệ %', p_loc; end if;
  v_co_cum := to_regclass('public.' || t || '_cum_bai') is not null;   -- môn Anh chưa có bảng cụm
  v_bdm := (t = 'dai');                                                 -- bản đồ mới chỉ có cho Toán Đại
  return query execute format($q$
    select c.ma_cau, c.dang_chinh, b.ten_dang, b.ten_chuyen_de, b.khoi, c.loai_cau,
           c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai, c.anh_de, c.anh_dap_an,
           c.nguon, c.nguon_giai, c.giai_method, c.created_at,
           c.ma_cum, %5$s, c.da_duyet, c.kho_chuan,
           c.kiem_may, c.kiem_may_boi, c.kiem_may_ghi, c.kiem_may_at, c.dang_ai_de_xuat,
           %6$s
    from %1$I c
    join %2$I b on b.ma_dang = c.dang_chinh
    %3$s
    %7$s
    where c.xoa_at is null and %4$s and ($1::text is null or b.khoi = $1)
    order by b.khoi, c.dang_chinh, c.ma_cau
    limit $2 offset $3
  $q$, t || '_cau_hoi', t || '_ban_do',
       case when v_co_cum then format('left join %I m on m.ma_cum = c.ma_cum', t || '_cum_bai') else '' end,
       v_dk,
       case when v_co_cum then 'm.ten' else 'null::text' end,
       case when v_bdm
         then $s$coalesce(bcd.ten, bck.ten) as bdm_chu_de, bch.ten as bdm_chuyen_de, bnh.ten as bdm_nhom,
                 bdb.ten as bdm_dang_bai, bdb.id as bdm_dang_bai_id,
                 case when bgc.ma_cau is not null then 'gan' when bk.ma_cau is not null then 'chua_khop' end as bdm_trang_thai,
                 bk.ly_do as bdm_ly_do$s$
         else 'null::text, null::text, null::text, null::text, null::text, null::text, null::text' end,
       case when v_bdm
         then $s$left join dai_bdm_gan_cau bgc on bgc.ma_cau = c.ma_cau
                 left join dai_bdm_dang_bai bdb on bdb.id = bgc.dang_bai_id
                 left join dai_bdm_nhom bnh on bnh.id = bdb.nhom_id
                 left join dai_bdm_chuyen_de bch on bch.id = bnh.chuyen_de_id
                 left join dai_bdm_chu_de bcd on bcd.id = bnh.chu_de_id
                 left join dai_bdm_cau_chua_khop bk on bk.ma_cau = c.ma_cau
                 left join dai_bdm_chu_de bck on bck.id = bk.chu_de_id$s$
         else '' end
  ) using p_khoi, p_limit, p_offset;
end $function$;

revoke all on function public.fn_kho_hang_duyet(text, text, text, integer, integer) from public, anon;
grant execute on function public.fn_kho_hang_duyet(text, text, text, integer, integer) to authenticated;
