-- ============================================================================
-- 202609281749 — rank_bu_et_mat_du_lieu
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 28/09: ET hình tháng 8–9/2026 mất do lỗi hệ thống, "coi như mất luôn", "scale lên mặc định thành 7 —
--   nếu 4 cái thì nhân hệ số thành 7". Chuẩn Toán = 7 buổi ET / tháng.
--   Cách bù: CHỈ ở tháng đánh dấu mất dữ liệu (rank_thang_mat_et), theo TỪNG LỚP: lớp ghi được k buổi ET (< chuẩn)
--   ⇒ mỗi bài ET của em trong buổi của lớp đó = diem_et × chuẩn / k. Em làm đủ k bài ⇒ đúng 7 × 100.
--   Không áp cho tháng bình thường: tháng ít buổi thật (nghỉ lễ) không được bơm điểm. Tính động — không ghi dòng nào.
--   Chỉ bù ET (Thùy nói ET); BTVN/MT không đổi.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không. Thêm 1 cột cấu hình + 1 bảng đánh dấu tháng; thay thân fn_rank_su_kien (cùng chữ ký).
-- ============================================================================
alter table rank_cau_hinh add column if not exists et_chuan_thang integer not null default 7;

create table if not exists rank_thang_mat_et (
  mon    text not null references rank_cau_hinh(mon),
  thang  text not null check (thang ~ '^\d{4}-\d{2}$'),
  ly_do  text not null,
  primary key (mon, thang)
);
comment on table rank_thang_mat_et is 'Tháng mất dữ liệu ET (lỗi hệ thống) ⇒ fn_rank_su_kien nhân điểm ET lên theo et_chuan_thang / số buổi ET lớp ghi được.';
alter table rank_thang_mat_et enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'rank_thang_mat_et' and policyname = 'rank_thang_mat_et_member_all') then
    create policy rank_thang_mat_et_member_all on rank_thang_mat_et for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
  end if;
end $$;
insert into rank_thang_mat_et values
  ('Toán', '2026-08', 'Lỗi hệ thống ET hình — mất dữ liệu (Thùy 28/09)'),
  ('Toán', '2026-09', 'Lỗi hệ thống ET hình — mất dữ liệu (Thùy 28/09)')
on conflict do nothing;

create or replace function public.fn_rank_su_kien(p_mon text, p_thang_tu text, p_thang_den text, p_hs uuid[] default null)
returns table(hoc_sinh_id uuid, nguon text, thang text, ngay date, diem integer, ref_id uuid)
language sql stable as $$
  with cfg as (select * from rank_cau_hinh where mon = p_mon),
  buoi as (
    select b.id, b.lop_id, b.ngay, to_char(b.ngay, 'YYYY-MM') as thang from buoi_hoc b join lop l on l.id = b.lop_id
    where l.mon = p_mon and b.loai in ('thuong', 'bu') and b.trang_thai <> 'huy'
      and b.ngay >= (p_thang_tu || '-01')::date and b.ngay < ((p_thang_den || '-01')::date + interval '1 month')::date
  ),
  et as (   -- 1 bài ET = (em × buổi) có dòng chấm ET. ET online đã mirror vào gami_grades (bai_lam_cau_id) từ 09/2026.
    select distinct g.hoc_sinh_id, g.buoi_hoc_id from gami_grades g
    join gami_session_problems sp on sp.id = g.problem_id and sp.phase = 'et'
    where g.buoi_hoc_id in (select id from buoi)  ),
  et_lop as (  -- số buổi CÓ ET mà lớp ghi được trong tháng (để bù tháng mất dữ liệu ET)
    select b.lop_id, b.thang, count(distinct b.id)::int as so_buoi_et
    from buoi b where exists (select 1 from gami_session_problems sp where sp.buoi_hoc_id = b.id and sp.phase = 'et')
    group by b.lop_id, b.thang
  )
  select et.hoc_sinh_id, 'et', b.thang, b.ngay,
         case when mat.thang is not null and k.so_buoi_et < cfg.et_chuan_thang
              then round(cfg.diem_et * cfg.et_chuan_thang::numeric / k.so_buoi_et)::int else cfg.diem_et end, b.id
  from et join buoi b on b.id = et.buoi_hoc_id cross join cfg
  join et_lop k on k.lop_id = b.lop_id and k.thang = b.thang
  left join rank_thang_mat_et mat on mat.mon = p_mon and mat.thang = b.thang
  where p_hs is null or et.hoc_sinh_id = any(p_hs)
  union all
  select k.hoc_sinh_id, 'btvn', b.thang, b.ngay,
         case k.trang_thai_nop when 'nop_dung_han' then cfg.diem_btvn_dung_han else cfg.diem_btvn_muon end, b.id
  from btvn_ket_qua k join buoi b on b.id = k.buoi_hoc_id cross join cfg
  where k.trang_thai_nop in ('nop_dung_han', 'nop_muon') and (p_hs is null or k.hoc_sinh_id = any(p_hs))
  union all
  select m.hoc_sinh_id, 'mt', t.ym, m.ngay, m.diem_bang * cfg.mt_he_so, null::uuid
  from generate_series((p_thang_tu || '-01')::date, (p_thang_den || '-01')::date, interval '1 month') g(d)
  cross join lateral (select to_char(g.d, 'YYYY-MM') as ym) t
  cross join lateral public.fn_mt_hang_thang(p_mon, t.ym) m
  cross join cfg
  where p_hs is null or m.hoc_sinh_id = any(p_hs)
  union all
  select tl.hoc_sinh_id, 'thu_thach', to_char(tl.ngay, 'YYYY-MM'), tl.ngay, tl.diem, tl.bai_lam_id
  from thu_thach_luot tl
  where tl.mon = p_mon and tl.diem > 0
    and to_char(tl.ngay, 'YYYY-MM') between p_thang_tu and p_thang_den
    and (p_hs is null or tl.hoc_sinh_id = any(p_hs))
$$;
comment on function public.fn_rank_su_kien(text, text, text, uuid[]) is 'Mọi sự kiện cộng Điểm Rank (ET · BTVN · MT · Thử thách) của môn trong khoảng THÁNG QUY ĐIỂM. MT của tháng T thi đầu tháng T+1 nhưng thang = T. Nguồn công thức DUY NHẤT của Điểm Rank.';
