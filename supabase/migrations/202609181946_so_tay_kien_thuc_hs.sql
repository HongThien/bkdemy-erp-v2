-- ============================================================================
-- 202609181946 — SỔ TAY KIẾN THỨC (app HS) — 3 RPC đọc kho lý thuyết
-- ----------------------------------------------------------------------------
-- VÌ SAO:
-- CEO 18/09: HS vào app mở "Sổ tay kiến thức" để TRA CỨU lý thuyết + bài mẫu của 1 dạng.
--   Hai đường vào: (1) em BIẾT tên dạng → gõ, hệ gợi ý theo ký tự; (2) em KHÔNG biết tên →
--   lọc dần Chủ đề → Chuyên đề → Dạng (+ lọc độ khó). Chọn xong hiện lý thuyết + bài mẫu.
--
-- VÌ SAO PHẢI LÀ RPC, KHÔNG PHẢI QUERY THẲNG:
--   `dai_dang_ly_thuyet` / `hgt_dang_ly_thuyet` bật RLS member-gate (chỉ `la_thanh_vien()`).
--   Bundle HS đăng nhập bằng tài khoản HS ⇒ SELECT thẳng trả 0 DÒNG, KHÔNG BÁO LỖI — đúng
--   cái bẫy CLAUDE.md §2.1 cảnh báo. Đó cũng là lý do `bai_test_cau.ly_thuyet` phải snapshot
--   (mig 0067). Ở đây KHÔNG snapshot được (sổ tay tra cứu tự do, không gắn bài) ⇒ security
--   definer là đường duy nhất. Kèm §2.0: mọi gom nhóm/đếm/xếp hạng nằm ở Postgres, client
--   chỉ render.
--
-- PHẠM VI v1 (CEO chốt 18/09): môn Toán, nhánh Đại + Hình GT. KHTN đối xứng sẵn (chỉ cần
--   truyền p_mon='KHTN') nhưng CHƯA bật ở UI. Hình học thuần (`hinh_hoc_bai`) ĐỨNG NGOÀI:
--   3 cột compat ma_chuyen_de/ten_chuyen_de/muc_do (mig 202609181735) còn RỖNG nên không
--   dựng được cây lọc — bật sau khi có người bơm cây chuyên đề cho nhánh đó.
--
-- LỌC THEO KHỐI, KHÔNG THEO BẬC (CEO chốt 18/09): "học sinh bậc nào cũng thấy được bài của
--   tất cả dạng khó và dễ" ⇒ `bac_toi_thieu` KHÔNG được dùng để cắt. Chỉ `khoi` chia ngăn.
--
-- ĐỘ KHÓ: `muc_do` là thang 1–5, KHÔNG phải cờ cơ-bản/nâng-cao. CEO chốt gộp 3 nhóm cho HS
--   dễ đọc: 1–2 cơ bản · 3 trung bình · 4–5 nâng cao. Gộp ở DB (`_sotay_nhom`) để công thức
--   chỉ tồn tại MỘT nơi (§2.0) — client không tự chia lại.
--
-- §1.5 ANTI-NULL: dạng CHƯA có lý thuyết thì KHÔNG xuất hiện trong sổ tay (thà vắng còn hơn
--   mở ra trang trắng). `noi_dung` default '' nên phải lọc `btrim(...) <> ''`, không phải
--   `is not null`. Trả kèm `thieu_ly_thuyet` = số dạng bị ẩn, để còn biết độ phủ mà đi lấp.
--
-- LOẠI "DẠNG CHỜ": mỗi bản đồ có 1 dòng rác/khối tên "Chưa phân dạng" (mã tận cùng 000000, mig
--   202609131706) làm chỗ đậu cho câu nhập kho chưa gán dạng. Nó là công cụ VẬN HÀNH, HS thấy
--   chỉ tổ khó hiểu ⇒ chặn bằng `_kho_la_dang_cho()` ở cả 3 RPC, không dựa vào "chắc nó không
--   có lý thuyết đâu" — hôm nào có người dán lý thuyết vào đó là lòi ra ngay trên app HS.
--
-- MẤT GÌ: không. Chỉ THÊM 5 function mới (2 helper + 3 RPC). Không đụng bảng/cột/dòng nào.
-- Cả 5 đều `revoke … from public` rồi mới `grant … to authenticated` (xem khối cuối file).
-- ============================================================================

-- ── Helper: muc_do (1–5) → nhóm hiển thị cho HS ─────────────────────────────
-- immutable + null-in-null-out: dạng chưa gán độ khó thì client không vẽ chip, KHÔNG bịa
-- "trung bình" cho nó (đoán bừa = §1.5 "thà bỏ trống còn hơn đánh sai").
create or replace function public._sotay_nhom(p_muc_do smallint)
returns text language sql immutable as $$
  select case when p_muc_do is null then null
              when p_muc_do <= 2 then 'co_ban'
              when p_muc_do = 3  then 'trung_binh'
              else 'nang_cao' end
$$;

-- Ai được đọc sổ tay: HS (cho chính mình) hoặc nhân sự (xem trước/hỗ trợ). Tách riêng để 3
-- RPC dưới không lặp điều kiện.
create or replace function public._sotay_duoc_doc()
returns boolean language sql stable as $$
  select public.my_hoc_sinh_id() is not null or public.la_thanh_vien()
$$;

-- ════════════════════════════════════════════════════════════════════════════
-- ① hs_sotay_cay — CÂY LỌC của 1 khối: Chủ đề → Chuyên đề → Dạng
-- ----------------------------------------------------------------------------
-- Trả TOÀN BỘ cây của khối trong 1 lượt (vài trăm dạng ≈ vài chục KB) — sau đó client bấm
-- lọc dần là tức thì, không round-trip mỗi tầng. Lọc trong danh sách đã tải là "sort/filter
-- thuần tuý theo lựa chọn UI đang mở" — §2.0 cho phép; mọi phép ĐẾM vẫn tính ở đây.
-- p_khoi null ⇒ lấy khối của chính HS. Kèm `khoi_list` để em xem khối khác (ôn lại lớp dưới
-- / học trước lớp trên) — CEO không chặn vượt khối.
-- ════════════════════════════════════════════════════════════════════════════
create or replace function public.hs_sotay_cay(
  p_mon text default 'Toán', p_nhanh text default null, p_khoi text default null)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_bd text := public._kho_ban_do_tbl(p_mon, p_nhanh);
  v_lt text := public._kho_lt_tbl(p_mon, p_nhanh);
  v_khoi_hs text;
  v_khoi text;
  v_cay jsonb;
  v_khoi_list jsonb;
  v_co bigint := 0;
  v_thieu bigint := 0;
begin
  if not public._sotay_duoc_doc() then raise exception 'Không có quyền đọc sổ tay.'; end if;

  select h.khoi into v_khoi_hs from hoc_sinh h where h.id = public.my_hoc_sinh_id();
  v_khoi := coalesce(nullif(btrim(coalesce(p_khoi, '')), ''), v_khoi_hs);

  -- Khối nào CÓ nội dung đọc được — dựng từ data, không hardcode danh sách khối.
  execute format($q$
    select coalesce(jsonb_agg(k order by k), '[]'::jsonb) from (
      select distinct bd.khoi k from %1$I bd join %2$I lt on lt.ma_dang = bd.ma_dang
      where btrim(coalesce(lt.noi_dung, '')) <> '' and not public._kho_la_dang_cho(bd.ma_dang)
    ) x
  $q$, v_bd, v_lt) into v_khoi_list;

  -- Khối của HS chưa có nội dung ⇒ rơi về khối đầu tiên có, để em không mở ra thấy trắng.
  if v_khoi is null or not (v_khoi_list ? v_khoi) then
    v_khoi := coalesce(v_khoi_list ->> 0, v_khoi);
  end if;

  execute format($q$
    select count(*) filter (where btrim(coalesce(lt.noi_dung, '')) <> ''),
           count(*) filter (where lt.ma_dang is null or btrim(coalesce(lt.noi_dung, '')) = '')
    from %1$I bd left join %2$I lt on lt.ma_dang = bd.ma_dang
    where bd.khoi = $1 and not public._kho_la_dang_cho(bd.ma_dang)
  $q$, v_bd, v_lt) into v_co, v_thieu using v_khoi;

  -- Sắp xếp theo MÃ (ma_chu_de/ma_chuyen_de/ma_dang) — mã sinh theo cây (fn_dai_sinh_ma_dang)
  -- nên thứ tự mã = thứ tự chương trình. Sắp theo TÊN sẽ ra thứ tự alphabet vô nghĩa.
  execute format($q$
    with d as (
      select bd.ma_dang, bd.ten_dang, bd.muc_do, bd.mo_ta_ngan,
             bd.ma_chu_de, bd.ten_chu_de, bd.ma_chuyen_de, bd.ten_chuyen_de
      from %1$I bd join %2$I lt on lt.ma_dang = bd.ma_dang
      where bd.khoi = $1 and btrim(coalesce(lt.noi_dung, '')) <> ''
        and not public._kho_la_dang_cho(bd.ma_dang)
    ), cde as (
      select ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, count(*) so_dang,
             jsonb_agg(jsonb_build_object(
               'ma_dang', ma_dang, 'ten_dang', ten_dang, 'muc_do', muc_do,
               'nhom', public._sotay_nhom(muc_do), 'mo_ta_ngan', mo_ta_ngan
             ) order by ma_dang) dangs
      from d group by 1, 2, 3, 4
    ), cd as (
      select ma_chu_de, ten_chu_de, sum(so_dang) so_dang,
             jsonb_agg(jsonb_build_object(
               'ma', ma_chuyen_de, 'ten', ten_chuyen_de, 'so_dang', so_dang, 'dangs', dangs
             ) order by ma_chuyen_de) con
      from cde group by 1, 2
    )
    select coalesce(jsonb_agg(jsonb_build_object(
      'ma', ma_chu_de, 'ten', ten_chu_de, 'so_dang', so_dang, 'con', con
    ) order by ma_chu_de), '[]'::jsonb) from cd
  $q$, v_bd, v_lt) into v_cay using v_khoi;

  return jsonb_build_object(
    'mon', p_mon, 'nhanh', p_nhanh,
    'khoi', v_khoi, 'khoi_hs', v_khoi_hs, 'khoi_list', v_khoi_list,
    'so_dang', v_co, 'thieu_ly_thuyet', v_thieu,
    'cay', coalesce(v_cay, '[]'::jsonb));
end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- ② hs_sotay_tim — GỢI Ý theo ký tự HS gõ
-- ----------------------------------------------------------------------------
-- Bỏ dấu bằng `fn_bo_dau` (DB này KHÔNG có extension unaccent — xem mig 202609080246) để em
-- gõ "phuong trinh bac hai" vẫn ra "Phương trình bậc hai". Mỗi tiếng là 1 điều kiện AND nên
-- gõ thêm chữ là thu hẹp dần, đúng cảm giác autocomplete.
--
-- TÌM TOÀN KHO, KHÔNG CẮT THEO KHỐI — chỉ CỘNG ĐIỂM cho khối của em. Cắt cứng thì em gõ đúng
-- tên dạng mà ra rỗng (dạng nằm khối khác) và không hiểu vì sao; cộng điểm thì phần của em
-- luôn nổi lên đầu mà vẫn với được phần còn lại. Mỗi dòng trả kèm `khoi` để UI gắn nhãn.
-- ════════════════════════════════════════════════════════════════════════════
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
  v_limit integer := greatest(1, least(coalesce(p_limit, 20), 50));
  v_out jsonb;
begin
  if not public._sotay_duoc_doc() then raise exception 'Không có quyền đọc sổ tay.'; end if;
  if length(v_q) < 2 then return '[]'::jsonb; end if;

  v_pats := array(select '%' || x || '%' from unnest(regexp_split_to_array(v_q, '\s+')) x where x <> '');
  if coalesce(array_length(v_pats, 1), 0) = 0 then return '[]'::jsonb; end if;

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
      -- ⚠ `%%` KHÔNG phải lỗi gõ: chuỗi này đi qua format() nên mọi `%` của LIKE phải nhân đôi,
      -- không thì format() gặp `%'` là ném "unrecognized format() type specifier" ngay lượt gõ đầu.
      select d.*,
        (case when d.t_dang = $1::text then 100
              when d.t_dang like $1::text || '%%' then 60
              when d.t_dang like '%%' || $1::text || '%%' then 40
              when public.fn_bo_dau(d.ten_chuyen_de) like '%%' || $1::text || '%%' then 20
              when public.fn_bo_dau(d.ten_chu_de) like '%%' || $1::text || '%%' then 12
              else 4 end
         + case when $3::text is not null and d.khoi = $3::text then 50 else 0 end) diem
      -- Ép kiểu tường minh: trong EXECUTE…USING, `like all($2)` đứng một mình không suy được
      -- kiểu tham số ⇒ "could not determine data type of parameter $2".
      from d where d.hay like all($2::text[])
    )
    select coalesce(jsonb_agg(jsonb_build_object(
      'ma_dang', ma_dang, 'ten_dang', ten_dang, 'khoi', khoi, 'muc_do', muc_do,
      'nhom', public._sotay_nhom(muc_do), 'mo_ta_ngan', mo_ta_ngan,
      'ten_chu_de', ten_chu_de, 'ten_chuyen_de', ten_chuyen_de
    ) order by diem desc, ten_dang), '[]'::jsonb)
    from (select * from m order by diem desc, ten_dang limit %3$s) z
  $q$, v_bd, v_lt, v_limit) into v_out using v_q, v_pats, nullif(btrim(coalesce(p_khoi, '')), '');

  return coalesce(v_out, '[]'::jsonb);
end $$;

-- ════════════════════════════════════════════════════════════════════════════
-- ③ hs_sotay_dang — NỘI DUNG 1 dạng (lý thuyết + phương pháp + bài mẫu)
-- ----------------------------------------------------------------------------
-- `noi_dung` gói cả 3 phần trong 1 trường (chủ ý từ mig 0004: "lý thuyết + phương pháp + bài
-- mẫu gói 1 file") — client render bằng MathText như trang in, không tách phần ở đây.
-- Trả NULL khi dạng không có nội dung đọc được ⇒ màn hình biết mà báo tử tế thay vì vẽ rỗng.
-- `file_url` CỐ TÌNH không trả: là file kho nội bộ trong storage bucket staff-only, HS mở ra
-- sẽ 403 — hứa link hỏng còn tệ hơn không hứa.
-- ════════════════════════════════════════════════════════════════════════════
create or replace function public.hs_sotay_dang(
  p_ma_dang text, p_mon text default 'Toán', p_nhanh text default null)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_bd text := public._kho_ban_do_tbl(p_mon, p_nhanh);
  v_lt text := public._kho_lt_tbl(p_mon, p_nhanh);
  v_out jsonb;
begin
  if not public._sotay_duoc_doc() then raise exception 'Không có quyền đọc sổ tay.'; end if;
  if btrim(coalesce(p_ma_dang, '')) = '' then return null; end if;

  execute format($q$
    select jsonb_build_object(
      'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang, 'khoi', bd.khoi,
      'muc_do', bd.muc_do, 'nhom', public._sotay_nhom(bd.muc_do), 'mo_ta_ngan', bd.mo_ta_ngan,
      'ma_chu_de', bd.ma_chu_de, 'ten_chu_de', bd.ten_chu_de,
      'ma_chuyen_de', bd.ma_chuyen_de, 'ten_chuyen_de', bd.ten_chuyen_de,
      'noi_dung', lt.noi_dung, 'cap_nhat_at', lt.cap_nhat_at)
    from %1$I bd join %2$I lt on lt.ma_dang = bd.ma_dang
    where bd.ma_dang = $1 and btrim(coalesce(lt.noi_dung, '')) <> ''
      and not public._kho_la_dang_cho(bd.ma_dang)
  $q$, v_bd, v_lt) into v_out using p_ma_dang;

  return v_out;
end $$;

-- ⚠ PHẢI `revoke … from public` TRƯỚC KHI grant: Postgres mặc định cấp EXECUTE cho PUBLIC lúc
-- CREATE FUNCTION, nên `grant … to authenticated` MỘT MÌNH KHÔNG chặn anon — nó chỉ cấp thêm cho
-- một role vốn đã có quyền qua PUBLIC. Đo thật 18/09: `hs_dang_evals` (chỉ có grant, không revoke)
-- gọi được bằng anon key → HTTP 200; còn `my_hoc_sinh_id` (mig 0063) và `count_cau_by_dang`
-- (mig 0062) có revoke → HTTP 401. Theo đúng tiền lệ 2 mig đó.
-- Ở đây thiệt hại nếu thiếu revoke là "chỉ" lộ bề mặt gọi (thân hàm vẫn chặn bằng
-- `_sotay_duoc_doc()` → raise), nhưng 3 hàm này là `security definer` ĐỌC KHO — không để cửa mở.
revoke all on function public.hs_sotay_cay(text, text, text) from public;
grant  execute on function public.hs_sotay_cay(text, text, text) to authenticated;

revoke all on function public.hs_sotay_tim(text, text, text, text, integer) from public;
grant  execute on function public.hs_sotay_tim(text, text, text, text, integer) to authenticated;

revoke all on function public.hs_sotay_dang(text, text, text) from public;
grant  execute on function public.hs_sotay_dang(text, text, text) to authenticated;

-- 2 helper siết CÙNG MỘT KHUÔN với 3 RPC trên (CEO 18/09: "cả 5 hàm cùng một khuôn, không để
-- ngoại lệ phải nhớ"). Xét riêng thì 2 hàm này vô hại với anon (`_sotay_nhom` thuần tính, không
-- đọc bảng; `_sotay_duoc_doc` trả boolean về chính người gọi) — siết vì tính NHẤT QUÁN: một khuôn
-- 5/5 thì đọc là biết, còn 3/5 thì người sau phải nhớ ngoại lệ, và ngoại lệ không ai nhớ được.
revoke all on function public._sotay_nhom(smallint) from public;
grant  execute on function public._sotay_nhom(smallint) to authenticated;

revoke all on function public._sotay_duoc_doc() from public;
grant  execute on function public._sotay_duoc_doc() to authenticated;
