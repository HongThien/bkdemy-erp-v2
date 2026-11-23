-- ============================================================================
-- 202611232122 — k1_thu_quyen_8_ham_noi_bo_sau_17_11
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Cổng `check:kien-truc` mục K1 `db_ham_noi_bo_mo` (hàm nội bộ tên bắt đầu `_` mà người đăng nhập gọi được) lên 329,
--   trần 322 (chốt 17/11, commit 042470cf). So `schema.md` ở mốc đó với DB hiện tại: có đúng 8 hàm `_` MỚI ra đời sau
--   17/11 và còn quyền gọi mặc định của `authenticated` (một hàm cũ đã đóng trong lúc đó nên số tăng ròng là 7):
--     _bctk_ny            (mig 202611171137…)  ← chỉ fn_bctk_so (definer) gọi
--     _btnhe_duoc_nhap    (mig 202611211643)   ← chỉ fn_btnhe_nhap_dcs, fn_btnhe_ta_nhap_ds (definer) gọi
--     _ta_ca_tu_duyet     (mig 202611211604)   ← chỉ 2 trigger definer _tg_ta_ca_gio_ra_tu_duyet, _tg_ta_viec_ca_tu_duyet gọi
--     _ts_kiem_ca         (mig 202611211500)   ← chỉ _ts_dang_ky_test (definer) gọi
--     _ts_mon_theo_nhom   (mig 20261120–21)    ← chỉ _ts_dang_ky_test, fn_ts_dk_form (definer) gọi
--     _ts_nhom_cua_lop                         ← chỉ _ts_mon_theo_nhom gọi (hàm này lại chỉ chạy trong 2 hàm definer trên)
--     _ts_ten_nhom                             ← chỉ _ts_dang_ky_test, fn_ts_dk_form (definer) gọi
--     _ts_thu_tu_nhom                          ← chỉ fn_ts_dk_form (definer) gọi
--   Đã dò trên DB thật (23/11): không policy, view, ràng buộc, giá trị mặc định, index, job cron nào gọi 8 hàm này;
--   không file nào trong src/ · scripts/ · supabase/functions gọi thẳng. Hàm definer chạy bằng quyền chủ hàm
--   (claude_build) nên vẫn gọi được sau khi thu quyền của `authenticated`. Edge Function `dang-ky-test` gọi bằng
--   service_role — không đụng.
--   Khối `do` đầu file là rào: lúc áp mà có hàm chạy quyền NGƯỜI GỌI (ngoài 8 hàm này), policy hay view nào gọi tới
--   thì DỪNG, không thu (bài học mig 202611171025: thu nhầm ⇒ màn chết im lặng).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất dữ liệu, không đổi thân hàm. Thu quyền EXECUTE của `authenticated` trên 8 hàm nội bộ nói trên
--   (`service_role`, `claude_ro`, chủ hàm giữ nguyên). Hoàn lại: `grant execute on function … to authenticated`.
-- ============================================================================

do $$
declare
  v_ten text[] := array['_bctk_ny','_btnhe_duoc_nhap','_ta_ca_tu_duyet','_ts_kiem_ca','_ts_mon_theo_nhom','_ts_nhom_cua_lop','_ts_ten_nhom','_ts_thu_tu_nhom'];
  v_re  text := '(^|[^a-z0-9_])(' || array_to_string(v_ten, '|') || ')\s*\(';
  v_loi text;
begin
  select string_agg(x, ', ') into v_loi from (
    select 'hàm quyền người gọi ' || p.proname as x
      from pg_proc p
     where p.pronamespace = 'public'::regnamespace and not p.prosecdef and p.proname <> all (v_ten) and p.prosrc ~* v_re
    union all
    select 'policy ' || tablename || '.' || policyname
      from pg_policies where coalesce(qual, '') || ' ' || coalesce(with_check, '') ~* v_re
    union all
    select 'view ' || c.relname
      from pg_class c where c.relnamespace = 'public'::regnamespace and c.relkind in ('v', 'm') and pg_get_viewdef(c.oid) ~* v_re
  ) t;
  if v_loi is not null then
    raise exception 'KHÔNG thu quyền: còn nơi chạy bằng quyền người gọi dùng hàm nội bộ — %', v_loi;
  end if;
end $$;

revoke execute on function public._bctk_ny(bigint, bigint) from authenticated;
revoke execute on function public._btnhe_duoc_nhap(uuid) from authenticated;
revoke execute on function public._ta_ca_tu_duyet(uuid) from authenticated;
revoke execute on function public._ts_kiem_ca(uuid, date, timestamp without time zone, integer) from authenticated;
revoke execute on function public._ts_mon_theo_nhom() from authenticated;
revoke execute on function public._ts_nhom_cua_lop(text) from authenticated;
revoke execute on function public._ts_ten_nhom(text) from authenticated;
revoke execute on function public._ts_thu_tu_nhom(text) from authenticated;
