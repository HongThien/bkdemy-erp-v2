-- ============================================================================
-- 202609261541 — su_kien_xu_luot_theo_van
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 26/09: hết 3 ván quản trò phải thấy MÀN TỔNG KẾT xu — 3 cột Ván 1/2/3 + cột Tổng — rồi mới bấm
--   "Lượt tiếp". Tình trạng lượt (_sk_xu_luot) trước chỉ trả tổng theo slot; giờ trả thêm xu TỪNG VÁN
--   (theo thứ tự matchId = thứ tự chơi). Tổng vẫn tính ở DB, client không cộng.
--   Kèm: khoá hàm phụ _sk_xu_luot khỏi authenticated (mig 202609261450 để lọt qua default privileges của
--   Supabase — ai đăng nhập cũng gọi thẳng được). fn_sk_xu_luot / fn_sk_tra_xu_van là security definer
--   owner postgres nên vẫn gọi hàm phụ bình thường.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   KHÔNG. create or replace cùng chữ ký (thêm khoá 'van' vào jsonb trả về, giữ nguyên các khoá cũ).
-- ÁP: SQL Editor (hàm do postgres sở hữu).
-- ============================================================================

create or replace function public._sk_xu_luot(p_luot uuid) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'so_van', (select count(distinct x.van) from sk_xu x where x.luot_id = p_luot and x.nguon = 'game' and x.van is not null),
    'toi_da', (select coalesce((s.cau_hinh->>'so_van')::int, 3) from sk_luot lu join sk_phong ph on ph.id = lu.phong_id join sk_su_kien s on s.id = ph.su_kien_id where lu.id = p_luot),
    'xong',   (select lu.trang_thai <> 'dang_choi' from sk_luot lu where lu.id = p_luot),
    'tong',   coalesce((select jsonb_object_agg(t.slot::text, t.xu) from (
                select dk.slot, sum(x.so_xu)::int as xu
                from sk_dang_ky dk join sk_xu x on x.nguoi_choi_id = dk.nguoi_choi_id and x.luot_id = dk.luot_id and x.nguon = 'game'
                where dk.luot_id = p_luot and dk.slot is not null group by dk.slot) t), '{}'::jsonb),
    -- [{van: matchId, xu: {slot: xu}}] theo thứ tự chơi
    'van',    coalesce((select jsonb_agg(jsonb_build_object('van', v.van, 'xu', v.xu) order by v.van) from (
                select x.van, jsonb_object_agg(dk.slot::text, x.so_xu) as xu
                from sk_xu x join sk_dang_ky dk on dk.nguoi_choi_id = x.nguoi_choi_id and dk.luot_id = x.luot_id
                where x.luot_id = p_luot and x.nguon = 'game' and x.van is not null and dk.slot is not null
                group by x.van) v), '[]'::jsonb)
  )
$$;

revoke all on function public._sk_xu_luot(uuid) from public;
revoke all on function public._sk_xu_luot(uuid) from anon;
revoke all on function public._sk_xu_luot(uuid) from authenticated;

-- Kiểm sau khi áp (kỳ vọng: helper_goi_duoc = 0, fn_goi_duoc = 2)
select
  (select count(*) from pg_proc where proname = '_sk_xu_luot'
     and (has_function_privilege('anon', oid, 'execute') or has_function_privilege('authenticated', oid, 'execute'))) as helper_goi_duoc,
  (select count(*) from pg_proc where proname in ('fn_sk_xu_luot', 'fn_sk_tra_xu_van')
     and has_function_privilege('authenticated', oid, 'execute')) as fn_goi_duoc;
