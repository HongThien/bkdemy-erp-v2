-- ============================================================================
-- 202609201150 — hs_sotay_tim: `p_khoi` LỌC CỨNG thay vì chỉ cộng điểm
-- ----------------------------------------------------------------------------
-- TRIỆU CHỨNG (CEO 20/09): đứng ở khối 9, gõ "chu vi" → ra dạng của mọi khối.
--   Chip khối lọc được CÂY nhưng không lọc KẾT QUẢ TÌM.
--
-- XÁC NHẬN (đọc `prosrc` đang chạy trên DB, không đọc file):
--   · WHERE chỉ có 2 điều kiện, KHÔNG có khối:
--       where btrim(coalesce(lt.noi_dung, '')) <> '' and not public._kho_la_dang_cho(bd.ma_dang)
--       ... from d where d.hay like all($2::text[])
--   · khối xuất hiện ĐÚNG MỘT CHỖ, và nằm trong biểu thức tính điểm:
--       + case when $3::text is not null and d.khoi = $3::text then 50 else 0 end) diem
--   Đo thật: "chu vi" với p_khoi='9' → 13 kết quả, khối [4, 4T, 5, 9];
--            "chu vi" với p_khoi=null → 13 kết quả, khối [4, 4T, 5, 9] — CÙNG TẬP.
--   Khớp đúng số CEO chỉ ra hôm qua ("doanh thu": khối 9 → 3 kết quả điểm 90,
--   khối null → 3 kết quả điểm 40 — cùng tập, chỉ khác điểm).
--
-- SỬA: `p_khoi` không null ⇒ LỌC ngay trong CTE `d`; `p_khoi` null ⇒ giữ nguyên
--   hành vi cũ (tìm toàn kho). Dùng mẫu optional-filter `($3 is null or bd.khoi = $3)`
--   nên một nhánh SQL phục vụ cả hai ca, không đẻ 2 đường code.
--
-- BỎ LUÔN +50 ĐIỂM BOOST — nó CHẾT ở CẢ HAI nhánh sau khi lọc cứng:
--   · p_khoi null  → `$3 is not null` sai ⇒ mọi dòng +0 (vốn đã vô tác dụng từ trước);
--   · p_khoi có    → mọi dòng còn lại đều cùng khối ⇒ mọi dòng +50 như nhau ⇒ thứ tự
--                    không đổi một li.
--   Giữ lại chỉ làm người đọc sau tưởng nó còn ảnh hưởng xếp hạng. Thang điểm còn lại
--   nguyên vẹn: 100 khớp hệt tên dạng · 60 khớp đầu · 40 khớp giữa · 20 chuyên đề ·
--   12 chủ đề · 4 còn lại (khớp qua mô tả ngắn).
--
-- HAI CHIP CÒN LẠI — kiểm luôn theo yêu cầu CEO:
--   · MÔN/NHÁNH (Đại ↔ Hình GT): **LỌC CỨNG THẬT, không phải boost.** Nó chọn hẳn BẢNG
--     khác qua `_kho_ban_do_tbl`: null→`dai_ban_do` · 'hinh_gt'→`hgt_ban_do` · 'KHTN'→
--     `khtn_ban_do`. Đo: "chu vi" p_nhanh=null → 13 kết quả (mã T1…=Đại);
--     p_nhanh='hinh_gt' → 1 kết quả (mã T312010205=HGT). Hai tập rời nhau. KHÔNG PHẢI SỬA.
--   · ĐỘ KHÓ: **không lọc, cũng không boost — KHÔNG TỒN TẠI trong hàm.** Chữ ký không có
--     tham số nào cho nó, WHERE không có, biểu thức điểm không có; client cũng không
--     truyền (và còn ẩn hẳn cụm chip khi đang tìm). Migration này KHÔNG thêm — CEO chưa
--     yêu cầu, và thêm tham số là đổi chữ ký. Ghi ra đây để không ai tưởng nó đang chạy.
--
-- GIỮ NGUYÊN CHỮ KÝ `(text, text, text, text, integer)` ⇒ client không phải sửa.
-- GIỮ LUẬT của mig 202609201056: chuỗi format KHÔNG chứa `%` nào ngoài `%1$I`/`%2$I`
--   (điều kiện khối mới cũng không có `%`), self-verify bên dưới kiểm lại.
--
-- ĐẦU RA KỲ VỌNG:
--   hs_sotay_tim('chu vi','Toán',null,'9',50) → CHỈ còn dòng khối 9 (trước: 4/4T/5/9).
--   hs_sotay_tim('chu vi','Toán',null,null,50) → vẫn đủ mọi khối như cũ.
--   Kiểm bằng `npm run smoke:sotay` (đã thêm case "lọc khối" so khối của mọi dòng trả về).
--
-- ÁP BẰNG SQL EDITOR (role postgres — hàm thuộc owner `postgres`).
-- MẤT GÌ: không. `create or replace` 1 function, không đụng bảng/cột/dòng. Thay đổi hành
--   vi DUY NHẤT: khi p_khoi khác null thì kết quả bị thu hẹp về đúng khối đó — chính là
--   thứ CEO yêu cầu.
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
  v_tien_to text;
  v_giua text;
  v_khoi text := nullif(btrim(coalesce(p_khoi, '')), '');
  v_limit integer := greatest(1, least(coalesce(p_limit, 20), 50));
  v_out jsonb;
begin
  if not public._sotay_duoc_doc() then raise exception 'Không có quyền đọc sổ tay.'; end if;
  if length(v_q) < 2 then return '[]'::jsonb; end if;

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
      where btrim(coalesce(lt.noi_dung, '')) <> ''
        and not public._kho_la_dang_cho(bd.ma_dang)
        and ($3::text is null or bd.khoi = $3::text)
    ), m as (
      select d.*,
        (case when d.t_dang = $1::text then 100
              when d.t_dang like $4::text then 60
              when d.t_dang like $5::text then 40
              when public.fn_bo_dau(d.ten_chuyen_de) like $5::text then 20
              when public.fn_bo_dau(d.ten_chu_de) like $5::text then 12
              else 4 end) diem
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
  using v_q, v_pats, v_khoi, v_tien_to, v_giua, v_limit;

  return coalesce(v_out, '[]'::jsonb);
end $$;

revoke all    on function public.hs_sotay_tim(text, text, text, text, integer) from public;
revoke execute on function public.hs_sotay_tim(text, text, text, text, integer) from anon;
grant  execute on function public.hs_sotay_tim(text, text, text, text, integer) to authenticated;

-- ── SELF-VERIFY ─────────────────────────────────────────────────────────────────────────────
-- ① chuỗi format vẫn sạch `%` (luật mig 202609201056 — chặn lớp lỗi 22023 tái phát);
-- ② khối phải xuất hiện trong ĐIỀU KIỆN LỌC, không phải chỉ trong biểu thức điểm — đây chính
--    là bug đang sửa, nên kiểm thẳng vào nó thay vì tin mắt;
-- ③ quyền 2 chiều như các mig trước.
do $$
declare
  v_src text; v_fmt text; v_con text;
begin
  select p.prosrc into v_src from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public' and p.proname = 'hs_sotay_tim';

  v_fmt := substring(v_src from '\$q\$(.*)\$q\$');
  if v_fmt is null then raise exception 'Khong tach duoc chuoi format cua hs_sotay_tim'; end if;

  v_con := replace(replace(v_fmt, '%1$I', ''), '%2$I', '');
  if position('%' in v_con) > 0 then
    raise exception 'Chuoi format VAN con dau %% ngoai %%1$I/%%2$I — se throw luc goi.';
  end if;

  if position('bd.khoi = $3' in v_fmt) = 0 then
    raise exception 'Khong thay dieu kien LOC theo khoi (bd.khoi = $3) trong chuoi format.';
  end if;
  if position('then 50' in v_fmt) > 0 then
    raise exception 'Van con +50 diem boost theo khoi — dang le da bo khi loc cung.';
  end if;

  if has_function_privilege('anon', 'public.hs_sotay_tim(text,text,text,text,integer)', 'EXECUTE') then
    raise exception 'anon VAN EXECUTE duoc hs_sotay_tim';
  end if;
  if not has_function_privilege('authenticated', 'public.hs_sotay_tim(text,text,text,text,integer)', 'EXECUTE') then
    raise exception 'authenticated MAT EXECUTE tren hs_sotay_tim — app HS se chet';
  end if;

  raise notice 'OK: format sach, co loc theo khoi, bo boost, quyen dung.';
end $$;
