-- ============================================================================
-- 202611101554 — Điểm BTVN: số ý của mỗi câu theo CẢ BUỔI, không theo từng em (CEO 10/11)
-- ----------------------------------------------------------------------------
-- Lỗi thấy khi chạy thử 9A2 07/11: em thiếu ảnh trang chứa câu 3 ⇒ câu 3 chỉ bị đếm 1 ý ⇒ mẫu số
-- nhỏ hơn bạn khác (7 ý thay vì 9) ⇒ mỗi ý có giá trị cao hơn ⇒ điểm CAO ẢO (Hương Giang 5,75 thay vì ≈5).
-- Sửa: số ý của 1 câu = số ý NHIỀU NHẤT mà máy từng ghi cho câu đó ở cùng buổi (mọi em), tối thiểu 1.
-- Ý em không có (thiếu trang / máy không ghi) = 0 điểm. Mọi em cùng buổi dùng cùng mẫu số ⇒ điểm so được với nhau.
-- Phần còn lại giữ nguyên mig 202611081545 (ý = 10/tổng ý · Đ trọn · C nửa làm tròn xuống 0,25 · tổng bội 0,25 · [5;10]).
-- MẤT GÌ (Luật xoá): không xoá gì — create or replace 1 hàm tính (không ghi dữ liệu).
-- ============================================================================
create or replace function public.fn_btvn_ai_diem(p_lan_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Không có quyền.'; end if;
  with l as (select * from btvn_ai_lan where id = p_lan_id),
  mx as (  -- số ý nhiều nhất từng ghi cho mỗi câu, trong cùng buổi
    select c.problem_id, max(coalesce(jsonb_array_length(c.y), 0)) m
    from btvn_ai_cau c
    join btvn_ai_lan l2 on l2.id = c.lan_id
    join l on l2.buoi_hoc_id = l.buoi_hoc_id
    group by c.problem_id
  ),
  cau as (
    select sp.id pid, c.result may, c.y,
           case when l.chot_at is not null then g.result else c.result end cuoi,
           greatest(1, coalesce(mx.m, 0), coalesce(jsonb_array_length(c.y), 0)) n
    from l
    join gami_session_problems sp on sp.buoi_hoc_id = l.buoi_hoc_id and sp.phase = 'btvn'
    left join btvn_ai_cau c on c.lan_id = l.id and c.problem_id = sp.id
    left join gami_grades g on g.problem_id = sp.id and g.hoc_sinh_id = l.hoc_sinh_id
    left join mx on mx.problem_id = sp.id
  ),
  y as (
    select case
             when c.y is not null and c.cuoi is not distinct from c.may then coalesce((c.y -> (s.i - 1)) ->> 'result', 'wrong')
             else coalesce(c.cuoi, 'wrong')
           end kq
    from cau c cross join lateral generate_series(1, c.n) s(i)
  ),
  n as (select count(*) so_y, 10.0 / nullif(count(*), 0) gt from y),
  t as (
    select sum(case y.kq when 'correct' then n.gt
                        when 'partial' then floor(n.gt / 2 / 0.25) * 0.25
                        else 0 end) tong
    from y cross join n
  )
  select jsonb_build_object(
           'diem', greatest(5, least(10, round(coalesce(t.tong, 0) / 0.25) * 0.25)),
           'so_y', n.so_y, 'gia_tri_y', round(n.gt, 4), 'tong_tho', round(coalesce(t.tong, 0), 4))
    into v
  from n cross join t;
  return v;
end $$;
revoke execute on function public.fn_btvn_ai_diem(uuid) from public, anon;
grant execute on function public.fn_btvn_ai_diem(uuid) to authenticated;
