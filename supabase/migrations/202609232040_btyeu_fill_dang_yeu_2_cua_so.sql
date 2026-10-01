-- Thùy 23/09: "Logic bổ trợ yếu nên là TẤT CẢ các dạng bị Yếu trong đánh giá 2 cửa sổ 15 ngày gần nhất" + chốt:
--   (1) chỉ THÊM, không xoá dạng người đã chọn · (2) bỏ tin thấp (<3 lần đo — "thấp nghĩa là không quan trọng") ·
--   (3) hệ thống chỉ đổ dạng LÚC MỞ CASE ("cứ yếu là bổ trợ"), sau đó người rà ở màn Nội dung.
-- Lúc duyệt, client đã đổ `dien` (engine src/gami/danhgia.js: yếu <0.5 + ≥3 lần đo) — sửa engine thêm điều kiện
-- "có lần đo trong 2 cửa sổ" (cùng phạm vi kênh ②). Hàm này = BẢN SQL của cùng rule, dùng để đổ lại cho case đã mở
-- mà còn RỖNG (đo 23/09: 10/132 case rỗng — mở bằng chuông đỏ/thái độ khi dạng yếu chưa đủ 3 lần đo, ví dụ Hà Linh 11A1).
-- Cửa sổ = nửa tháng (1–15 'A', 16–cuối 'B'); 2 cửa sổ gần nhất = hiện tại + liền trước ⇒ mốc từ = ngày 16 tháng trước
-- (nếu hôm nay ≤15) hoặc ngày 1 tháng này (nếu >15). Mastery = fn_mastery_cells (5 lần đo gần nhất, kể BTVN — cùng
-- engine màn Kết quả học tập / picker Nội dung). Đúng bản đồ môn (§1.6, _kho_ban_do_tbl).
create or replace function public._btyeu_moc_2_cua_so() returns date
language sql stable as $$
  select case when extract(day from d) <= 15 then (date_trunc('month', d) - interval '1 month' + interval '15 days')::date
              else date_trunc('month', d)::date end
  from (select (now() at time zone 'Asia/Ho_Chi_Minh')::date as d) x
$$;

-- Dạng yếu theo rule cho 1 (HS, môn): yếu (score <0.5) · n ≥ 3 · có ≥1 lần đo (gami_grades, theo ngày buổi) từ mốc 2 cửa sổ.
create or replace function public.fn_btyeu_dang_yeu_2_cua_so(p_hs uuid, p_mon text)
returns table (ma_dang text, ten_dang text, score numeric, n integer)
language plpgsql stable security definer set search_path = public as $$
declare v_bd text := public._kho_ban_do_tbl(p_mon); v_moc date := public._btyeu_moc_2_cua_so();
begin
  if not public.la_thanh_vien() or v_bd is null then return; end if;
  return query execute format($q$
    select m.ma_dang::text, bd.ten_dang::text, m.score::numeric, m.n::integer
    from public.fn_mastery_cells(array[$1]::uuid[], true) m
    join %I bd on bd.ma_dang = m.ma_dang
    where m.muc = 'yeu' and m.n >= 3
      and exists (select 1 from gami_grades g join gami_session_problems p on p.id = g.problem_id
                  left join buoi_hoc b on b.id = g.buoi_hoc_id
                  where g.hoc_sinh_id = $1 and p.ma_dang = m.ma_dang and coalesce(b.ngay, g.graded_at::date) >= $2)
    order by m.score, m.n desc
  $q$, v_bd) using p_hs, v_moc;
end $$;
grant execute on function public.fn_btyeu_dang_yeu_2_cua_so(uuid, text) to authenticated;

-- Đổ dạng yếu theo rule vào case (nguon='may', giữ dạng đã có). Trả số dạng thêm được.
create or replace function public.fn_btyeu_fill_dang_yeu(p_case uuid) returns integer
language plpgsql security definer set search_path = public as $$
declare v_hs uuid; v_mon text; v_n integer := 0; r record;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select hoc_sinh_id, mon into v_hs, v_mon from bo_tro_yeu where id = p_case and trang_thai = 'dang_xu';
  if v_hs is null then raise exception 'Case không mở.'; end if;
  for r in select * from public.fn_btyeu_dang_yeu_2_cua_so(v_hs, v_mon) loop
    insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, nguon, diem_luc_mo, so_lan_do_luc_mo)
      values (p_case, r.ma_dang, 'may', r.score, r.n) on conflict (bo_tro_yeu_id, ma_dang) do nothing;
    if found then v_n := v_n + 1; end if;
  end loop;
  return v_n;
end $$;
grant execute on function public.fn_btyeu_fill_dang_yeu(uuid) to authenticated;
