-- ============================================================================
-- 202609201056 — FIX: hs_sotay_tim THROW mọi lần gọi (ô tìm sổ tay chưa từng chạy)
-- ----------------------------------------------------------------------------
-- TRIỆU CHỨNG (CEO 20/09): cây hiện đúng, bấm chuyên đề "Bài toán về Doanh thu - Lợi nhuận"
--   (khối 9) ra đủ 2 dạng; nhưng gõ "doanh thu" vào ô tìm thì 0 kết quả.
--
-- GỐC: `hs_sotay_tim` KHÔNG hề "không khớp" — nó NỔ ngay tại `format()`:
--       ERROR 22023: unrecognized format() type specifier "`"
--   Thủ phạm là 2 dòng COMMENT nằm BÊN TRONG chuỗi $q$…$q$ của mig 202609181946:
--       -- ⚠ `%%` KHÔNG phải lỗi gõ: … nên mọi `%` của LIKE phải nhân đôi,
--       -- không thì format() gặp `%'` là ném "unrecognized format() type specifier" …
--   `format()` xử lý CHUỖI THÔ — nó KHÔNG biết `--` là comment SQL. Hai dấu `%` trần trong
--   `` `%` `` và `` `%'` `` bị nuốt làm format specifier ⇒ throw. Tức: cái comment dặn escape
--   `%` lại chính là chỗ quên escape `%`.
--
-- VÌ SAO LỌT QUA MỌI LẦN KIỂM TRƯỚC — cả 3 đường kiểm đều KHÔNG đi qua `format()`:
--   (a) test anon → chạm guard `_sotay_duoc_doc()` TRƯỚC `format()` ⇒ ra 401/400, không tới chỗ nổ;
--   (b) các lần "chạy thử" đo độ phủ → viết lại query BẰNG TAY với `%` thường, không qua format();
--   (c) demo `hs.html?demo=sotay` → dùng MOCK_API, không gọi RPC.
--   Bài học đã có sẵn cuối HANDOFF mà vẫn đạp lại: **verify dữ liệu ≠ verify đường code.**
--   Chỉ `hs_sotay_tim` dính — quét lại `hs_sotay_cay` (3 khối format) và `hs_sotay_dang` (1 khối)
--   đều sạch, không dấu `%` trần nào.
--
-- CÁCH SỬA — KHÔNG phải "escape `%%` trong comment", mà BỎ HẲN `%` KHỎI CHUỖI FORMAT:
--   1. Mọi comment ra NGOÀI $q$…$q$ (trong chuỗi format chỉ còn SQL thuần).
--   2. Mọi mẫu LIKE dựng sẵn ở plpgsql rồi TRUYỀN VÀO qua USING ($4 tiền tố, $5 chứa-giữa),
--      thay vì ghép `|| '%%'` trong chuỗi. `p_limit` cũng chuyển từ `%3$s` sang tham số $6.
--   ⇒ chuỗi format giờ chỉ còn ĐÚNG 2 specifier `%1$I` `%2$I` (tên bảng, bắt buộc phải là
--      identifier nên không truyền tham số được). Không còn `%` nào khác để mà quên escape.
--   Chọn cách này vì escape `%%` chỉ đúng cho LẦN NÀY: người sửa sau viết thêm một dòng comment
--   là đạp lại y hệt. Luật "chuỗi format không chứa `%` nào ngoài `%1$I/%2$I`" thì nhìn là thấy.
--
-- KHÔNG ĐỔI HÀNH VI TÌM KIẾM: vẫn khớp trên ten_dang + ten_chuyen_de + ten_chu_de + mo_ta_ngan,
--   vẫn AND từng tiếng, vẫn thang điểm 100/60/40/20/12/4 + 50 cho đúng khối, vẫn lọc
--   `noi_dung <> ''` và loại dạng chờ. Chỉ đổi CÁCH DỰNG CHUỖI.
--
-- ĐẦU RA KỲ VỌNG sau migration (đã đo bằng chính SQL do format() sinh ra, sau khi bỏ comment):
--   hs_sotay_tim('doanh thu', 'Toán', null, '9') → 3 dòng:
--     T109090101 "Bài toán tối ưu doanh thu - Lợi nhuận"
--     T109090102 "Bài toán tối ưu Doanh thu - Lợi nhuận sử dụng điều kiện biến nguyên"
--     T109090401 "Bài toán tối ưu doanh thu chi phí có miền điều kiện"
--   Kiểm bằng: `npm run smoke:sotay` (gọi THẬT cả 3 RPC bằng tài khoản authenticated).
--
-- ÁP BẰNG SQL EDITOR (role postgres) — hàm cũ thuộc owner `postgres`; `create or replace` bằng
--   role khác sẽ chết "must be owner of function". Khối grant/revoke ở cuối giữ nguyên posture
--   của mig 202609182334 (anon KHÔNG được EXECUTE) — `create or replace` KHÔNG reset ACL, nhưng
--   ghi lại cho tường minh và để self-verify bắt được nếu có gì lệch.
--
-- MẤT GÌ: không. Chỉ `create or replace` 1 function. Không đụng bảng/cột/dòng, không đổi chữ ký
--   (vẫn `(text, text, text, text, integer)`) nên không cần sửa client.
-- ============================================================================

create or replace function public.hs_sotay_tim(
  p_tu_khoa text, p_mon text default 'Toán', p_nhanh text default null,
  p_khoi text default null, p_limit integer default 20)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_bd text := public._kho_ban_do_tbl(p_mon, p_nhanh);
  v_lt text := public._kho_lt_tbl(p_mon, p_nhanh);
  v_q text := public.fn_bo_dau(btrim(coalesce(p_tu_khoa, '')));
  v_pats text[];
  v_tien_to text;   -- 'abc%'  → khớp ĐẦU tên dạng
  v_giua text;      -- '%abc%' → khớp GIỮA
  v_limit integer := greatest(1, least(coalesce(p_limit, 20), 50));
  v_out jsonb;
begin
  if not public._sotay_duoc_doc() then raise exception 'Không có quyền đọc sổ tay.'; end if;
  if length(v_q) < 2 then return '[]'::jsonb; end if;

  -- Dựng mẫu LIKE Ở ĐÂY (plpgsql thuần, `%` hoàn toàn bình thường), rồi truyền vào qua USING.
  -- Nhờ vậy chuỗi format bên dưới không chứa dấu `%` nào ngoài 2 specifier tên bảng.
  v_pats := array(select '%' || x || '%' from unnest(regexp_split_to_array(v_q, '\s+')) x where x <> '');
  if coalesce(array_length(v_pats, 1), 0) = 0 then return '[]'::jsonb; end if;
  v_tien_to := v_q || '%';
  v_giua    := '%' || v_q || '%';

  execute format($q$
    with d as (
      select bd.ma_dang, bd.ten_dang, bd.khoi, bd.muc_do, bd.mo_ta_ngan,
             bd.ten_chu_de, bd.ten_chuyen_de,
             public.fn_bo_dau(bd.ten_dang) t_dang,
             public.fn_bo_dau(bd.ten_dang) || ' ' || public.fn_bo_dau(bd.ten_chuyen_de) || ' '
               || public.fn_bo_dau(bd.ten_chu_de) || ' ' || public.fn_bo_dau(coalesce(bd.mo_ta_ngan, '')) hay
      from %1$I bd join %2$I lt on lt.ma_dang = bd.ma_dang
      where btrim(coalesce(lt.noi_dung, '')) <> '' and not public._kho_la_dang_cho(bd.ma_dang)
    ), m as (
      select d.*,
        (case when d.t_dang = $1::text then 100
              when d.t_dang like $4::text then 60
              when d.t_dang like $5::text then 40
              when public.fn_bo_dau(d.ten_chuyen_de) like $5::text then 20
              when public.fn_bo_dau(d.ten_chu_de) like $5::text then 12
              else 4 end
         + case when $3::text is not null and d.khoi = $3::text then 50 else 0 end) diem
      from d where d.hay like all($2::text[])
    )
    select coalesce(jsonb_agg(jsonb_build_object(
      'ma_dang', ma_dang, 'ten_dang', ten_dang, 'khoi', khoi, 'muc_do', muc_do,
      'nhom', public._sotay_nhom(muc_do), 'mo_ta_ngan', mo_ta_ngan,
      'ten_chu_de', ten_chu_de, 'ten_chuyen_de', ten_chuyen_de
    ) order by diem desc, ten_dang), '[]'::jsonb)
    from (select * from m order by diem desc, ten_dang limit $6::int) z
  $q$, v_bd, v_lt)
  into v_out
  using v_q, v_pats, nullif(btrim(coalesce(p_khoi, '')), ''), v_tien_to, v_giua, v_limit;

  return coalesce(v_out, '[]'::jsonb);
end $$;

revoke all on function public.hs_sotay_tim(text, text, text, text, integer) from public;
revoke execute on function public.hs_sotay_tim(text, text, text, text, integer) from anon;
grant  execute on function public.hs_sotay_tim(text, text, text, text, integer) to authenticated;

-- ── SELF-VERIFY ─────────────────────────────────────────────────────────────────────────────
-- ① Chuỗi format KHÔNG còn `%` nào ngoài `%1$I`/`%2$I` — chặn đúng lớp lỗi vừa cắn, kể cả khi
--    người sau vô tình thêm comment hay mẫu LIKE vào trong $q$…$q$.
-- ② Quyền: anon KHÔNG được EXECUTE, authenticated PHẢI còn (siết lố thì app HS chết im lặng).
-- Không gọi thử hàm ở đây: nó `security definer` + guard `_sotay_duoc_doc()`, mà người chạy
-- migration không phải HS/nhân sự ⇒ sẽ raise 'Không có quyền đọc sổ tay.' gây rollback oan.
-- Việc gọi thật để `npm run smoke:sotay` lo (chạy bằng tài khoản authenticated).
do $$
declare
  v_src text;
  v_fmt text;
  v_con text;
begin
  select p.prosrc into v_src from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public' and p.proname = 'hs_sotay_tim';

  v_fmt := substring(v_src from '\$q\$(.*)\$q\$');
  if v_fmt is null then raise exception 'Khong tach duoc chuoi format cua hs_sotay_tim'; end if;

  -- gỡ 2 specifier hợp lệ rồi xem còn dấu % nào sót không
  v_con := replace(replace(v_fmt, '%1$I', ''), '%2$I', '');
  if position('%' in v_con) > 0 then
    raise exception 'Chuoi format cua hs_sotay_tim VAN con dau %% ngoai %%1$I/%%2$I — se throw luc goi.';
  end if;

  if has_function_privilege('anon', 'public.hs_sotay_tim(text,text,text,text,integer)', 'EXECUTE') then
    raise exception 'anon VAN EXECUTE duoc hs_sotay_tim';
  end if;
  if not has_function_privilege('authenticated', 'public.hs_sotay_tim(text,text,text,text,integer)', 'EXECUTE') then
    raise exception 'authenticated MAT EXECUTE tren hs_sotay_tim — app HS se chet';
  end if;

  raise notice 'OK: chuoi format sach, anon bi chan, authenticated con nguyen.';
end $$;
