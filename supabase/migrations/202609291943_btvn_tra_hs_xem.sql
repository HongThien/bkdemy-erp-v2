-- ============================================================================
-- 202609291943 — BTVN ẢNH: TRẢ KẾT QUẢ CHO HỌC SINH (app HS · Hòm thư) — Thùy 29/09
-- ----------------------------------------------------------------------------
-- VÌ SAO: PH xem được bài chấm từ 09/09 (4 view v_btvn_tra_* đọc qua FDW). HS thì CHƯA có đường
--   nào: app HS đăng nhập role `authenticated` nhưng không là thành viên ⇒ RLS btvn_nop /
--   btvn_nop_anh (la_thanh_vien()) trả 0 dòng; bucket private 'btvn-nop' cũng chỉ mở cho thành viên.
--   CEO chốt 29/09: HS xem ở HÒM THƯ — TA trả bài ⇒ có thư "BTVN buổi dd/mm đã chấm" ⇒ bấm mở bài chấm.
--
-- THIẾT KẾ — thư BTVN là SUY RA (invariant, CLAUDE §4), KHÔNG chèn dòng vào thong_bao_hs:
--   có thư ⇔ btvn_nop.tra_at is not null (tra_at chỉ set 1 lần, không có đường gỡ). Không đẻ dòng
--   ⇒ 19 bài đã trả trước hôm nay tự hiện, không cần backfill; mọi đường trả (fn_btvn_tra_bai của
--   TA, fn_btvn_tra_bai_buoi lúc đóng BTVN) đều tự có thư, không phải nhớ gắn thêm.
--   (Thêm lý do kỹ thuật: thong_bao_hs thuộc `postgres`, claude_build chỉ có quyền r ⇒ trigger chèn
--    thư sẽ làm chết mọi UPDATE tra_at chạy bằng claude_build.)
--   "Đã xem" = cột btvn_nop.hs_xem_at — cùng kiểu doc_at của thong_bao_hs (null = em chưa mở).
--
-- HÀM (security definer — chỉ chạm dòng của CHÍNH HS đang đăng nhập, qua my_hoc_sinh_id()):
--   fn_btvn_tra_cua_toi()                  → bài đã trả (mới nhất trước) + số câu Đ/C/S + đã xem chưa
--   fn_btvn_tra_chi_tiet_cua_toi(buoi)     → 1 bài: trạng thái nộp · thái độ · nhận xét · Đ/C/S từng
--                                            câu (kèm tên dạng) · path ảnh (bản TA chấm, chưa chấm thì gốc)
--   fn_btvn_tra_da_xem(buoi)               → đánh dấu em đã mở (idempotent, chỉ bài đã trả)
--   fn_btvn_tra_chua_xem_cua_toi()         → số bài đã trả em chưa mở (cộng vào badge chuông Hòm thư)
--   _btvn_hs_xem_anh(name)                 → cho storage policy: path này là ảnh bài ĐÃ TRẢ của chính em?
--   Mọi số liệu đọc lại từ ĐÚNG 4 view của PH (v_btvn_nop_ph / v_btvn_tra_ket_qua / v_btvn_tra_cau /
--   v_btvn_tra_anh) ⇒ gate tra_at + cách tính 1 nơi, PH và HS luôn thấy cùng một bài chấm.
--
-- ẢNH: bucket private ⇒ HS ký signed URL cần policy SELECT trên storage.objects. claude_build KHÔNG
--   tạo được (storage.objects thuộc supabase_storage_admin) ⇒ scripts/sql_btvn_tra_hs_storage.sql
--   dán 1 lần ở SQL Editor. Chưa dán: app HS vẫn hiện kết quả + nhận xét, ảnh báo "chưa mở được".
--
-- MẤT GÌ (Luật xoá): không xoá gì — thêm 1 cột nullable + 5 hàm mới. Không đổi hàm/view cũ.
-- ============================================================================

alter table btvn_nop add column if not exists hs_xem_at timestamptz;
comment on column btvn_nop.hs_xem_at is
  'Lúc HS mở bài đã trả trên app HS (null = em chưa mở). Chỉ có nghĩa khi tra_at is not null.';

-- ── Danh sách bài đã trả của em ──
create or replace function public.fn_btvn_tra_cua_toi()
returns table (
  buoi_hoc_id uuid, ngay date, mon text, ten_lop text, nop_at timestamptz, tra_at timestamptz,
  da_xem boolean, so_cau integer, so_dung integer, so_chua_tron integer, so_sai integer
)
language sql stable security definer set search_path = public as $$
  select v.buoi_hoc_id, v.ngay, v.mon, v.ten_lop, v.nop_at, v.tra_at,
         n.hs_xem_at is not null,
         coalesce(k.so_cau, 0), coalesce(k.so_dung, 0), coalesce(k.so_chua_tron, 0), coalesce(k.so_sai, 0)
  from v_btvn_nop_ph v
  join btvn_nop n on n.hoc_sinh_id = v.hoc_sinh_id and n.buoi_hoc_id = v.buoi_hoc_id
  left join lateral (
    select count(*)::int as so_cau,
           (count(*) filter (where c.result = 'correct'))::int as so_dung,
           (count(*) filter (where c.result = 'partial'))::int as so_chua_tron,
           (count(*) filter (where c.result = 'wrong'))::int as so_sai
    from v_btvn_tra_cau c
    where c.hoc_sinh_id = v.hoc_sinh_id and c.buoi_hoc_id = v.buoi_hoc_id
  ) k on true
  where v.hoc_sinh_id = public.my_hoc_sinh_id() and v.tra_at is not null
  order by v.tra_at desc
  limit 100
$$;

-- ── Chi tiết 1 bài đã trả ── (null = không phải bài của em / chưa trả)
create or replace function public.fn_btvn_tra_chi_tiet_cua_toi(p_buoi_hoc_id uuid)
returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'buoi_hoc_id', v.buoi_hoc_id, 'ngay', v.ngay, 'mon', v.mon, 'ten_lop', v.ten_lop,
    'nop_at', v.nop_at, 'tra_at', v.tra_at,
    'trang_thai_nop', k.trang_thai_nop, 'thai_do', k.thai_do, 'nhan_xet', coalesce(to_jsonb(k.nhan_xet), '[]'::jsonb),
    'so_cau', (select count(*) from v_btvn_tra_cau c where c.hoc_sinh_id = v.hoc_sinh_id and c.buoi_hoc_id = v.buoi_hoc_id),
    'so_dung', (select count(*) from v_btvn_tra_cau c where c.hoc_sinh_id = v.hoc_sinh_id and c.buoi_hoc_id = v.buoi_hoc_id and c.result = 'correct'),
    'so_chua_tron', (select count(*) from v_btvn_tra_cau c where c.hoc_sinh_id = v.hoc_sinh_id and c.buoi_hoc_id = v.buoi_hoc_id and c.result = 'partial'),
    'so_sai', (select count(*) from v_btvn_tra_cau c where c.hoc_sinh_id = v.hoc_sinh_id and c.buoi_hoc_id = v.buoi_hoc_id and c.result = 'wrong'),
    'cau', coalesce((
      select jsonb_agg(jsonb_build_object(
               'problem_no', c.problem_no, 'result', c.result, 'ma_dang', c.ma_dang,
               'ten_dang', coalesce(public._kho_ten_dang(v.mon, c.ma_dang), c.ma_dang))
             order by c.problem_no)
      from v_btvn_tra_cau c where c.hoc_sinh_id = v.hoc_sinh_id and c.buoi_hoc_id = v.buoi_hoc_id
    ), '[]'::jsonb),
    'anh', coalesce((
      select jsonb_agg(a.path order by a.thu_tu, a.path)
      from v_btvn_tra_anh a where a.hoc_sinh_id = v.hoc_sinh_id and a.buoi_hoc_id = v.buoi_hoc_id
    ), '[]'::jsonb)
  )
  from v_btvn_nop_ph v
  left join v_btvn_tra_ket_qua k on k.hoc_sinh_id = v.hoc_sinh_id and k.buoi_hoc_id = v.buoi_hoc_id
  where v.hoc_sinh_id = public.my_hoc_sinh_id() and v.buoi_hoc_id = p_buoi_hoc_id and v.tra_at is not null
$$;

-- ── Em đã mở bài ── (không bump updated_at: HS xem không đổi nội dung bài nộp)
create or replace function public.fn_btvn_tra_da_xem(p_buoi_hoc_id uuid)
returns void
language sql volatile security definer set search_path = public as $$
  update btvn_nop set hs_xem_at = now()
  where hoc_sinh_id = public.my_hoc_sinh_id() and buoi_hoc_id = p_buoi_hoc_id
    and tra_at is not null and hs_xem_at is null
$$;

-- ── Số bài đã trả em chưa mở (badge chuông) ──
create or replace function public.fn_btvn_tra_chua_xem_cua_toi()
returns integer
language sql stable security definer set search_path = public as $$
  select count(*)::int from btvn_nop
  where hoc_sinh_id = public.my_hoc_sinh_id() and tra_at is not null and hs_xem_at is null
$$;

-- ── Storage policy dùng: ảnh (gốc hoặc bản chấm) thuộc bài ĐÃ TRẢ của chính em? ──
-- my_hoc_sinh_id() null với tài khoản nhân sự ⇒ luôn false ⇒ nhân sự vẫn đi policy btvn_nop_read cũ.
create or replace function public._btvn_hs_xem_anh(p_name text)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from btvn_nop_anh a
    join btvn_nop n on n.hoc_sinh_id = a.hoc_sinh_id and n.buoi_hoc_id = a.buoi_hoc_id
    where n.hoc_sinh_id = public.my_hoc_sinh_id() and n.tra_at is not null
      and (a.path = p_name or a.path_cham = p_name)
  )
$$;

-- Hàm tạo bằng `npm run migrate` (owner claude_build) chỉ có entry PUBLIC, không dính anon
-- (CLAUDE §2.1 "AI ÁP đổi cả posture quyền") ⇒ revoke PUBLIC + grant authenticated là đủ.
revoke all on function public.fn_btvn_tra_cua_toi() from public;
revoke all on function public.fn_btvn_tra_chi_tiet_cua_toi(uuid) from public;
revoke all on function public.fn_btvn_tra_da_xem(uuid) from public;
revoke all on function public.fn_btvn_tra_chua_xem_cua_toi() from public;
revoke all on function public._btvn_hs_xem_anh(text) from public;
grant execute on function public.fn_btvn_tra_cua_toi() to authenticated;
grant execute on function public.fn_btvn_tra_chi_tiet_cua_toi(uuid) to authenticated;
grant execute on function public.fn_btvn_tra_da_xem(uuid) to authenticated;
grant execute on function public.fn_btvn_tra_chua_xem_cua_toi() to authenticated;
grant execute on function public._btvn_hs_xem_anh(text) to authenticated;
