-- ============================================================================
-- 202609182334 — SỔ TAY: vá lỗ `anon` vẫn EXECUTE được 5 hàm (đo thật 18/09)
-- ----------------------------------------------------------------------------
-- VÌ SAO:
-- Mig 202609181946 đã có `revoke all on function … from public` cho cả 5 hàm sổ tay, nhưng
-- ĐO LẠI SAU KHI ÁP thì `anon` VẪN gọi được. ACL thật:
--
--   hs_sotay_cay  [owner=postgres]
--     {postgres=X/postgres, anon=X/postgres, authenticated=X/postgres, service_role=X/postgres}
--                            ^^^^^^^^^^^^^^ còn nguyên
--
-- NGUYÊN NHÂN (không phải câu revoke viết sai):
--   Supabase cấu hình `alter default privileges … grant execute on functions to anon,
--   authenticated, service_role`, và DEFAULT PRIVILEGES GẮN THEO ROLE TẠO HÀM. Mig 181946 được
--   áp TAY qua SQL Editor ⇒ hàm do `postgres` tạo ⇒ `anon` nhận GRANT RIÊNG, TƯỜNG MINH.
--   `revoke … from public` chỉ gỡ pseudo-role PUBLIC (đã gỡ được thật — 5 ACL không còn entry
--   `=X/postgres`), nó KHÔNG đụng tới entry `anon=X`.
--   Đối chiếu: hàm áp bằng `npm run migrate` (owner `claude_build`) KHÔNG dính default
--   privileges của `postgres` ⇒ ACL không hề có `anon` ⇒ ở đó `revoke from public` là đủ.
--     count_cau_by_dang [owner=claude_build] {claude_build=X, authenticated=X}   ← không có anon
--   Đó là lý do tiền lệ mig 0062/0063 chạy đúng mà mig 181946 thì không.
--
-- ⭐ ĐÍNH CHÍNH mig 202609181946 (KHÔNG sửa file đó — lịch sử migration bất biến, CLAUDE.md §2.1):
--   Comment ở khối cuối file 181946 viết: *"3 hàm này là `security definer` ĐỌC KHO — không để
--   cửa mở"*. Câu đó SAI TẠI THỜI ĐIỂM ÁP: cửa vẫn mở cho `anon`. Suy từ tiền lệ 0062/0063 mà
--   KHÔNG tính tới biến số "AI ÁP" (owner hàm). Kể từ migration này thì câu đó mới đúng.
--   Bài học chung: một dòng comment khẳng định "đã an toàn" mà không ai đo lại thì nguy hơn
--   không có dòng nào — đúng như §2.1 đã cảnh báo về chính mục quyền DB.
--
-- ⚠ PHẢI ÁP BẰNG SQL EDITOR (role `postgres`), KHÔNG phải `npm run migrate`:
--   5 hàm này thuộc sở hữu `postgres`. Chỉ owner (hoặc superuser) được REVOKE. Chạy bằng
--   `claude_build` sẽ chết ở câu đầu với "must be owner of function hs_sotay_cay" — fail rõ
--   ràng, không âm thầm, nên không cần guard thêm. Áp tay xong ghi sổ `_migrations` như mig
--   181946 (xem DEVLOG 18/09).
--
-- ĐẦU RA KỲ VỌNG SAU MIGRATION (test bằng anon key, PostgREST):
--   ✅ ĐÚNG : HTTP 401 · {"code":"42501","message":"permission denied for function hs_sotay_cay"}
--            → bị chặn ở tầng GRANT, hàm KHÔNG chạy.
--   ❌ SAI  : HTTP 400 · {"code":"P0001","message":"Không có quyền đọc sổ tay."}
--            → đây là trạng thái TRƯỚC khi vá: anon vẫn có EXECUTE, hàm CHẠY rồi mới bị thân
--              hàm (`_sotay_duoc_doc()`) chặn. Dữ liệu không lộ nhưng chỉ còn 1 lớp phòng thủ.
--   ❌ SAI  : HTTP 404 · {"code":"PGRST202"} → hàm không tồn tại / sai chữ ký.
--   Lệnh kiểm (thay <URL>/<ANON_KEY>):
--     curl -s -o /dev/null -w '%{http_code}\n' -X POST '<URL>/rest/v1/rpc/hs_sotay_cay' \
--       -H 'apikey: <ANON_KEY>' -H 'Authorization: Bearer <ANON_KEY>' \
--       -H 'Content-Type: application/json' \
--       --data-binary '{"p_mon":"Toán","p_nhanh":null,"p_khoi":null}'
--   Tài khoản HS thật KHÔNG ảnh hưởng: app gửi JWT của user ⇒ role `authenticated`, vẫn giữ
--   nguyên `authenticated=X`. Chỉ người gọi KHÔNG đăng nhập mới bị chặn — đúng ý muốn.
--
-- MẤT GÌ: chỉ mất quyền EXECUTE của role `anon` trên đúng 5 hàm dưới đây. KHÔNG drop/alter
--   hàm nào, KHÔNG đụng bảng/cột/dòng, KHÔNG đụng `authenticated` / `service_role` / owner.
--   Đảo lại được bằng `grant execute … to anon` nếu sau này cần (không có lý do gì cần).
-- ============================================================================

revoke execute on function public.hs_sotay_cay(text, text, text)                      from anon;
revoke execute on function public.hs_sotay_tim(text, text, text, text, integer)       from anon;
revoke execute on function public.hs_sotay_dang(text, text, text)                     from anon;
revoke execute on function public._sotay_nhom(smallint)                               from anon;
revoke execute on function public._sotay_duoc_doc()                                   from anon;

-- ── SELF-VERIFY: không tin "chạy xong là xong", đo lại ngay trong transaction ────────────────
-- Nếu còn sót hàm nào mà `anon` vẫn EXECUTE được thì RAISE ⇒ rollback cả migration, thay vì
-- để lại trạng thái nửa vời rồi lại phải đi đo bằng curl mới biết. (Mẫu self-verify: mig
-- 202609181048 bắt `fn_dai_kiem_ma()` phải = 0 ở cuối.)
do $$
declare
  v_sot text[] := '{}';
  v_sig text;
begin
  foreach v_sig in array array[
    'public.hs_sotay_cay(text,text,text)',
    'public.hs_sotay_tim(text,text,text,text,integer)',
    'public.hs_sotay_dang(text,text,text)',
    'public._sotay_nhom(smallint)',
    'public._sotay_duoc_doc()'
  ] loop
    if has_function_privilege('anon', v_sig, 'EXECUTE') then
      v_sot := v_sot || v_sig;
    end if;
  end loop;

  if array_length(v_sot, 1) is not null then
    raise exception 'anon VAN con EXECUTE tren: %', array_to_string(v_sot, ', ');
  end if;

  -- Chốt ngược: `authenticated` PHẢI còn EXECUTE, nếu không thì vừa siết quá tay và app HS
  -- sẽ chết ở màn Sổ tay (revoke lố role là lỗi dễ mắc và chỉ lộ khi HS bấm vào).
  foreach v_sig in array array[
    'public.hs_sotay_cay(text,text,text)',
    'public.hs_sotay_tim(text,text,text,text,integer)',
    'public.hs_sotay_dang(text,text,text)',
    'public._sotay_nhom(smallint)',
    'public._sotay_duoc_doc()'
  ] loop
    if not has_function_privilege('authenticated', v_sig, 'EXECUTE') then
      raise exception 'authenticated MAT EXECUTE tren % — siet qua tay, app HS se chet.', v_sig;
    end if;
  end loop;

  raise notice 'OK: anon bi chan ca 5 ham, authenticated con nguyen.';
end $$;
