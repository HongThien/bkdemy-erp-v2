-- ============================================================================
-- 202609201622 — hs_dang_hoc_tap_cua_so
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO 20/09, nối tiếp fix "Tự luyện theo chủ đề" cùng ngày): màn
--   "Danh sách dạng yếu" (ThongTinHocTap.tsx → DangYeuScreen) ĐANG hiện mức
--   Đạt/Cần luyện/Yếu tính từ `masteryOfDang` TRÊN TOÀN BỘ lịch sử đo — dạng
--   đo lần cuối cách đây rất lâu vẫn hiện mức CŨ như đang đúng NGAY BÂY GIỜ.
--   CEO: "chỉ nên hiện thông số những dạng trong 2 cửa sổ đo gần đây. Dạng
--   nào không có cửa sổ đo gần đây thì xếp qua phần CHƯA ĐÁNH GIÁ ĐƯỢC" — 4
--   nhóm: Đạt / Cần luyện / Yếu / Chưa đánh giá được. ĐÚNG rule + ĐÚNG khái
--   niệm "cửa sổ" đã áp cho "Tự luyện theo chủ đề" (mig 202609200922) — dùng
--   LẠI `_tu_luyen_dau_cua_so_truoc()`, KHÔNG bịa mốc thời gian khác.
--
-- KIẾN TRÚC — tái dùng NGUYÊN VẸN, không tính lại công thức ở đâu khác:
--   · Danh sách dạng + "5 lần đo gần nhất" (hiển thị dot Đ/C/S) = GOM từ
--     `hs_dang_evals` (RPC đã có, raw evals) — CHỈ gom nhóm/lấy top-5 trong
--     SQL (không phải công thức nghiệp vụ, chỉ là list thô để hiển thị).
--   · Điểm/mức (Đạt/Cần luyện/Yếu) = `fn_mastery_cells` (CANONICAL, §2.0) —
--     gọi 2 lần y hệt pattern `tu_luyen_chu_de_ds_dang`: 1 lần không giới hạn
--     (điểm thật) + 1 lần p_since=đầu-cửa-sổ-trước (chỉ biết có đo GẦN ĐÂY
--     không). Dạng không xuất hiện ở lần gọi 2 ⇒ muc=null ("chưa đánh giá").
--   · `p_include_btvn := true` — GIỮ NGUYÊN hành vi cũ của `layDangHocTap`
--     (client trước đây gộp MỌI nguồn et/mt/btvn/bt/tu_luyen không qua toggle
--     nào), không thắt/nới thêm phạm vi nguồn đo ngoài yêu cầu lần này.
--
-- MẤT GÌ: không — CREATE FUNCTION mới, không đụng bảng/hàm cũ (hs_dang_evals,
--   fn_mastery_cells, _tu_luyen_dau_cua_so_truoc giữ nguyên).
-- ============================================================================

create or replace function public.hs_dang_hoc_tap(p_mon text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_cutoff timestamptz := public._tu_luyen_dau_cua_so_truoc();
  v_evals jsonb;
  v_out jsonb;
begin
  if v_hs is null then return '[]'::jsonb; end if;
  v_evals := public.hs_dang_evals(p_mon);
  if jsonb_array_length(v_evals) = 0 then return '[]'::jsonb; end if;

  with ev as (
    select (e->>'ma_dang') as ma_dang, (e->>'value')::numeric as value,
           (e->>'t')::timestamptz as t, e->>'src' as src,
           e->>'ten_dang' as ten_dang, e->>'ten_chuyen_de' as ten_chuyen_de
    from jsonb_array_elements(v_evals) e
  ),
  ev_rk as (
    select *, row_number() over (partition by ma_dang order by t desc) as rn from ev
  ),
  grp as (
    select ma_dang, max(ten_dang) as ten_dang, max(ten_chuyen_de) as ten_chuyen_de,
      coalesce(jsonb_agg(jsonb_build_object('value', value, 't', t, 'src', src) order by t desc)
        filter (where rn <= 5), '[]'::jsonb) as recent
    from ev_rk group by ma_dang
  ),
  full_score as (
    select ma_dang, score, muc, n from public.fn_mastery_cells(array[v_hs], true, null, 5, 5, 3)
  ),
  recent_chk as (
    select distinct ma_dang from public.fn_mastery_cells(array[v_hs], true, v_cutoff, 5, 5, 3)
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'ma_dang', g.ma_dang, 'ten_dang', g.ten_dang, 'ten_chuyen_de', g.ten_chuyen_de, 'recent', g.recent,
    'score', case when r.ma_dang is not null then fs.score else null end,
    'muc', case when r.ma_dang is not null then fs.muc else null end,
    'n', fs.n
  ) order by
    -- Yếu → cần luyện → đạt → chưa đánh giá (xuống cuối). Trong mỗi nhóm: score thấp trước.
    case when r.ma_dang is null or fs.score is null then 1 else 0 end,
    fs.muc = 'dat', fs.muc = 'can_luyen', fs.score, g.ten_dang
  ), '[]'::jsonb)
  into v_out
  from grp g
  left join full_score fs on fs.ma_dang = g.ma_dang
  left join recent_chk r on r.ma_dang = g.ma_dang;

  return v_out;
end $$;
grant execute on function public.hs_dang_hoc_tap(text) to authenticated;
revoke execute on function public.hs_dang_hoc_tap(text) from anon;
