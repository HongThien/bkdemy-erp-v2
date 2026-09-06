-- ============================================================================
-- 202609061419 — giaibai_loc_dap_an_va_dashboard
-- ----------------------------------------------------------------------------
-- VÌ SAO — Thùy audit 06/09 sau khi build xong tool giải bài, 3 việc:
--
-- (1) "Check kĩ lại logic: người này nhận rồi - người kia chưa nhận chưa." — kiểm race-condition NHẬN BÀI.
--     Đã có index unique `*_cho_uniq (khoá) WHERE xu_ly_at IS NULL` (mig cũ 202609041808/1826) nên DATA
--     KHÔNG THỂ bị 2 người cùng giữ 1 bài dù 2 request tới đúng cùng mili-giây (constraint tầng DB, không
--     dựa vào check phía app). Khe hở DUY NHẤT: `fn_giaibai_nhan` check-rồi-mới-insert (TOCTOU) — người
--     thua trong tình huống hiếm đó nhận lỗi Postgres THÔ ("duplicate key…") thay vì thông báo tiếng Việt.
--     Vá: bọc INSERT bằng EXCEPTION WHEN unique_violation → thông báo thân thiện. Dữ liệu chưa từng sai,
--     chỉ sửa THÔNG BÁO khi khe hở hiếm đó xảy ra.
--
-- (2) "Tài khoản team học thuật cần dashboard quản trị: mỗi người đang nhận bao nhiêu câu, đã làm bao
--     nhiêu câu." — CHƯA có (Thống kê hiện tại CHỈ có báo cáo bài ĐÃ DUYỆT theo tháng, không có view
--     "đang giữ / chờ duyệt / quá hạn" theo từng người). Thêm `fn_giaibai_dashboard(p_nhanh, p_me)`: liệt
--     kê MỌI người có môn tương ứng (kể cả đang giữ 0 bài) kèm đang giữ/quá hạn/chờ duyệt/đã duyệt/từ chối
--     3 lần/đã trả — gác cửa bằng `fn_giaibai_la_nguoi_duyet` (đúng người mới gọi được, giống fn_giaibai_duyet).
--
-- (3) "Check lại logic câu hỏi: chỉ những câu KHÔNG có CẢ đáp án LẪN đáp án chi tiết mới xuất hiện ở đây.
--     Có 1 trong 2 rồi thì không cần xuất hiện." — `v_giaibai_bai` (nguồn của Kho bài + fn_giaibai_nhan)
--     hiện CHỈ lọc theo lời giải chi tiết (`loi_giai`/`anh_dap_an` is null), KHÔNG lọc theo đáp án ngắn
--     (`dap_an`). Đo thật (chỉ đọc, 06/09): dai_cau_hoi 839 câu đang hiện trong pool, nhưng 716/839 (85%)
--     ĐÃ CÓ `dap_an` (đa số trắc_nghiệm đã có sẵn đáp án đúng lúc tạo) — đúng luật mới CHỈ CÒN 123. Tương tự
--     khtn 21→8, hgt 10→2. Vá: `create or replace view` thêm `and c.dap_an is null` ở 3 nhánh toan/khtn/hgt
--     (nhánh Hình vốn không có khái niệm "đáp án ngắn" — `dap_an` luôn `null::text` trong view — KHÔNG đổi).
--
-- MẤT GÌ (Luật xoá): KHÔNG XOÁ GÌ. `create or replace view` (không đổi thứ tự/kiểu cột — chỉ đổi WHERE) +
-- `create or replace function` cùng chữ ký (fn_giaibai_nhan) + 1 function MỚI (fn_giaibai_dashboard). Ảnh
-- hưởng dữ liệu: KHÔNG — chỉ đổi tập câu hiện trong "chưa có lời giải" (câu có dap_an rời khỏi pool ngay,
-- không xoá gì trong kho; ai đang GIỮ bài loại này rồi vẫn giữ bình thường tới khi nộp/trả, không bị đá ra).
-- ============================================================================

-- ═══════════ 1. v_giaibai_bai — thêm điều kiện "chưa có ĐÁP ÁN NGẮN" cho toan/khtn/hgt ═══════════
create or replace view public.v_giaibai_bai as
  with k as (
    select 'toan'::text as nhanh, c.ma_cau as key, c.ma_cau as ma, b.khoi, b.ten_dang as nhom_ten, b.ma_dang as nhom_ma, b.ten_chuyen_de as nhom_truoc, b.muc_do,
           c.loai_cau, c.noi_dung as de_bai, null::text as gia_thiet, c.anh_de as anh, c.lua_chon, c.menh_de, c.dap_an, c.nguon, c.created_at
    from dai_cau_hoi c join dai_ban_do b on b.ma_dang = c.dang_chinh where c.xoa_at is null and c.loi_giai is null and c.anh_dap_an is null and c.dap_an is null
    union all
    select 'khtn', c.ma_cau, c.ma_cau, b.khoi, b.ten_dang, b.ma_dang, b.ten_chuyen_de, b.muc_do, c.loai_cau, c.noi_dung, null, c.anh_de, c.lua_chon, c.menh_de, c.dap_an, c.nguon, c.created_at
    from khtn_cau_hoi c join khtn_ban_do b on b.ma_dang = c.dang_chinh where c.xoa_at is null and c.loi_giai is null and c.anh_dap_an is null and c.dap_an is null
    union all
    select 'hgt', c.ma_cau, c.ma_cau, b.khoi, b.ten_dang, b.ma_dang, b.ten_chuyen_de, b.muc_do, c.loai_cau, c.noi_dung, null, c.anh_de, c.lua_chon, c.menh_de, c.dap_an, c.nguon, c.created_at
    from hgt_cau_hoi c join hgt_ban_do b on b.ma_dang = c.dang_chinh where c.xoa_at is null and c.loi_giai is null and c.anh_dap_an is null and c.dap_an is null
    union all
    -- Hình (bài toán gốc + biến thể) không có khái niệm "đáp án ngắn" — dap_an luôn null ở đây, giữ nguyên.
    select case h.loai when 'baitoan' then 'hinh_baitoan' else 'hinh_bien_the' end, h.id::text, h.ma, h.khoi, h.mo_hinh_ten, h.mo_hinh_ma, 'Mô hình', null::smallint,
           case h.loai when 'baitoan' then 'bai_toan_goc' else 'bien_the_' || h.kieu end, h.de_bai, h.gia_thiet, h.anh, null::jsonb, null::jsonb, null::text, 'le', h.created_at
    from public.v_hinh_chua_giai h
  )
  select k.*, public.fn_giaibai_mon(k.nhanh) as mon,
         y.id as yc_id, y.nguoi_giai as yc_nguoi_giai, y.nguoi_giai_ten as yc_nguoi_giai_ten, y.trang_thai as yc_trang_thai, y.han_at as yc_han_at, y.created_at as yc_created_at, y.ghi_chu as yc_ghi_chu
  from k
  left join lateral (
    select n.* from public.v_giaibai_nhan n where n.nhanh = k.nhanh and n.key = k.key and n.dang_giu limit 1
  ) y on true;
grant select on public.v_giaibai_bai to authenticated;

-- ═══════════ 2. fn_giaibai_nhan — bọc INSERT: khe hở race hiếm → thông báo thân thiện, không phải lỗi Postgres thô ═══════════
create or replace function public.fn_giaibai_nhan(p_nhanh text, p_key text, p_me uuid)
returns uuid
language plpgsql as $$
declare r record := public.fn_giaibai_tbl(p_nhanh); v_id uuid; n int; v_ten text;
begin
  if r.yc is null then raise exception 'fn_giaibai_nhan: nhánh không hợp lệ %', p_nhanh; end if;
  if p_me is null then raise exception 'Chưa xác định người nhận.'; end if;
  if not exists (select 1 from public.v_giaibai_bai b where b.nhanh = p_nhanh and b.key = p_key) then
    raise exception 'Bài này không còn trong danh sách chưa có lời giải.';
  end if;
  select count(*) into n from public.v_giaibai_nhan v where v.nguoi_giai = p_me and v.dang_giu and v.trang_thai in ('dang_giai','can_sua');
  if n >= 3 then raise exception 'Bạn đang giữ 3 bài — nộp hoặc trả bớt rồi nhận thêm.'; end if;
  if exists (select 1 from public.v_giaibai_nhan v where v.nguoi_giai = p_me and v.nhanh = p_nhanh and v.key = p_key and v.tu_choi_lan >= 3) then
    raise exception 'Bài này bạn đã bị từ chối 3 lần — không nhận lại được.';
  end if;
  perform public.fn_giaibai_dong_qua_han(p_nhanh, p_key);
  select coalesce(v.nguoi_giai_ten, 'Claude') into v_ten from public.v_giaibai_nhan v where v.nhanh = p_nhanh and v.key = p_key and v.xu_ly_at is null limit 1;
  if v_ten is not null then raise exception '% đang giữ bài này.', v_ten; end if;
  -- Check phía trên xong rồi mới INSERT (TOCTOU) — 2 người bấm NHẬN đúng cùng mili-giây đều qua được hết ở
  -- trên. Chốt chặn THẬT là index unique `%_cho_uniq (khoá) WHERE xu_ly_at IS NULL` (đã có từ mig cũ) — dữ
  -- liệu KHÔNG BAO GIỜ sai (chỉ 1 INSERT thắng), CATCH ở đây chỉ để người thua nhận thông báo tiếng Việt
  -- thay vì lỗi Postgres thô "duplicate key value violates unique constraint …".
  begin
    execute format('insert into %I (%I, nguoi_yeu_cau, nguoi_giai, trang_thai, han_at) values (%s, $2, $2, ''dang_giai'', now() + interval ''48 hours'') returning id', r.yc, r.key_col, r.key_cast)
      into v_id using p_key, p_me;
  exception when unique_violation then
    raise exception 'Bài này vừa có người khác nhận trước 1 bước — thử bài khác.';
  end;
  return v_id;
end $$;
grant execute on function public.fn_giaibai_nhan(text, text, uuid) to authenticated;

-- ═══════════ 3. Dashboard quản trị (học thuật / admin) — mỗi người đang giữ / chờ duyệt / đã duyệt bao nhiêu ═══════════
create or replace function public.fn_giaibai_dashboard(p_nhanh text[], p_me uuid)
returns table (
  nhan_su_id uuid, ho_ten text, dang_giu bigint, qua_han bigint, cho_duyet bigint, da_duyet bigint, tu_choi_3 bigint, da_tra bigint
)
language plpgsql stable as $$
declare v_mon text;
begin
  if p_nhanh is null or array_length(p_nhanh, 1) is null then raise exception 'fn_giaibai_dashboard: thiếu nhánh'; end if;
  v_mon := public.fn_giaibai_mon(p_nhanh[1]);
  if not public.fn_giaibai_la_nguoi_duyet(p_me, p_nhanh[1]) then raise exception 'Chỉ team học thuật môn % (hoặc admin) mới xem được dashboard này.', v_mon; end if;
  return query
    select ns.id, ns.ho_ten,
           coalesce(sum(case when v.trang_thai in ('dang_giai','can_sua') and not v.qua_han then 1 else 0 end), 0),
           coalesce(sum(case when v.qua_han then 1 else 0 end), 0),
           coalesce(sum(case when v.trang_thai = 'cho_duyet' then 1 else 0 end), 0),
           coalesce(sum(case when v.trang_thai = 'da_duyet' then 1 else 0 end), 0),
           coalesce(sum(case when v.trang_thai = 'tu_choi_3' then 1 else 0 end), 0),
           coalesce(sum(case when v.trang_thai = 'da_tra' then 1 else 0 end), 0)
    from nhan_su ns
    join nhan_su_mon nm on nm.nhan_su_id = ns.id and nm.mon = v_mon
    left join public.v_giaibai_nhan v on v.nguoi_giai = ns.id and v.nhanh = any(p_nhanh)
    group by ns.id, ns.ho_ten
    order by 3 desc, 5 desc, ns.ho_ten;
end $$;
grant execute on function public.fn_giaibai_dashboard(text[], uuid) to authenticated;
