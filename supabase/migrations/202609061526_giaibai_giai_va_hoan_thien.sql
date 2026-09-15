-- ============================================================================
-- 202609061526 — giaibai_giai_va_hoan_thien
-- ----------------------------------------------------------------------------
-- VÌ SAO — Thùy sửa hướng 06/09 (2 lần trong buổi): (1) KHÔNG gọi API Claude, dùng thẳng Claude Code
-- (đã có scripts/hangdoi-giai.mjs). (2) Web vẫn nên có 2 CHẾ ĐỘ:
--   · "Giải" = giải TỪ ĐẦU. Dành cho câu THIẾU CẢ đáp án lẫn đáp án chi tiết (163 câu, đúng luật
--     202609061419) — PHÒNG lúc Claude có sự cố vẫn có việc làm, không phụ thuộc AI.
--   · "Hoàn thiện" = trên NỀN Claude đã giải (không phải clone). Đo thật (chỉ đọc, 06/09): với
--     dai/khtn/hgt, MỌI câu `nguon_giai='ai'` hiện có đều `giai_method IS NULL` (11.854/42/141 câu — đây
--     là "clone", KHÔNG phải Claude tự giải) — chỉ `hinh_cach_giai` có ĐÚNG 7 dòng `giai_method=
--     'claude_code'` (khớp "có mấy bài thôi" Thùy nói). Từ nay, Claude Code giải qua hangdoi-giai.mjs
--     (ghi thẳng `loi_giai`/`giai_method='claude_code'`, KHÔNG đổi gì ở script đó) → câu tự RỜI "Giải"
--     (hết thiếu) và VÀO "Hoàn thiện" (điều kiện `nguon_giai='ai' and giai_method='claude_code' and
--     not da_duyet`) — 2 pool tách biệt HOÀN TOÀN TỰ NHIÊN bằng chính cột đã có, không đẻ khái niệm mới.
--
-- Tái dùng nguyên: 5 bảng `*_yeu_cau_giai` (nhận/nộp/duyệt), 4 cột AI thêm hôm nay (loi_giai_ai/dap_an_ai/
-- ai_model/ai_de_xuat_at) — đổi Ý NGHĨA từ "kho ý tưởng AI mới nhất" (thiết kế worker API, đã bỏ) sang
-- "SNAPSHOT bản Claude gốc lúc người bấm Nhận ở chế độ Hoàn thiện" (so sánh trước/sau — đúng ý Thùy
-- "lưu lời giải AI đề xuất để so hiệu suất" từ đầu buổi, chỉ đổi nguồn ghi từ script sang chính chỗ nhận).
--
-- `fn_giaibai_nhan` GIỮ NGUYÊN CHỮ KÝ — tự dò câu đang ở pool nào (Giải hay Hoàn thiện, 2 pool không
-- giao nhau vì định nghĩa loại trừ nhau) rồi set `che_do` tương ứng; `fn_giaibai_duyet` đọc `che_do` của
-- dòng để chọn đúng điều kiện ghi đè (Giải: loi_giai phải đang trống · Hoàn thiện: phải đang là bản AI
-- claude_code chưa duyệt) — cùng 1 hàm, không tách 2 luồng riêng cho người dùng cuối.
--
-- MẤT GÌ (Luật xoá): KHÔNG XOÁ GÌ — thêm cột `che_do` + view mới + create-or-replace GIỮ chữ ký cũ.
-- v_giaibai_bai bỏ điều kiện `loi_giai_ai is not null` đã thêm sáng nay (không dùng nữa) — KHÔNG mất dữ
-- liệu (cột vẫn còn, chỉ đổi WHERE của 1 view).
-- ============================================================================

-- ═══════════ 1. che_do trên dòng NHẬN BÀI — Giải hay Hoàn thiện (set lúc Nhận, không đổi sau) ═══════════
do $$
declare t text;
begin
  foreach t in array array['dai_cau_hoi_yeu_cau_giai','khtn_cau_hoi_yeu_cau_giai','hgt_cau_hoi_yeu_cau_giai','hinh_baitoan_yeu_cau_giai','hinh_bien_the_yeu_cau_giai'] loop
    execute format($q$alter table %1$I add column if not exists che_do text not null default 'giai' check (che_do in ('giai','hoan_thien'))$q$, t);
  end loop;
end $$;

-- ═══════════ 2. v_giaibai_nhan — nối cột che_do ở CUỐI (create-or-replace chỉ cho nối cột) ═══════════
create or replace view public.v_giaibai_nhan as
  with k as (
    select 'toan'::text as nhanh, y.*, y.ma_cau as key, c.ma_cau as ma, b.khoi, b.ten_dang as nhom_ten, b.ma_dang as nhom_ma, b.ten_chuyen_de as nhom_truoc, b.muc_do,
           c.loai_cau, c.noi_dung as de_bai, null::text as gia_thiet, c.anh_de as anh, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai as bai_loi_giai
    from dai_cau_hoi_yeu_cau_giai y join dai_cau_hoi c on c.ma_cau = y.ma_cau join dai_ban_do b on b.ma_dang = c.dang_chinh
    union all
    select 'khtn', y.*, y.ma_cau, c.ma_cau, b.khoi, b.ten_dang, b.ma_dang, b.ten_chuyen_de, b.muc_do,
           c.loai_cau, c.noi_dung, null, c.anh_de, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai
    from khtn_cau_hoi_yeu_cau_giai y join khtn_cau_hoi c on c.ma_cau = y.ma_cau join khtn_ban_do b on b.ma_dang = c.dang_chinh
    union all
    select 'hgt', y.*, y.ma_cau, c.ma_cau, b.khoi, b.ten_dang, b.ma_dang, b.ten_chuyen_de, b.muc_do,
           c.loai_cau, c.noi_dung, null, c.anh_de, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai
    from hgt_cau_hoi_yeu_cau_giai y join hgt_cau_hoi c on c.ma_cau = y.ma_cau join hgt_ban_do b on b.ma_dang = c.dang_chinh
  ), h as (
    select 'hinh_baitoan'::text as nhanh, y.id, y.baitoan_id::text as key, y.ghi_chu, y.nguoi_yeu_cau, y.created_at, y.xu_ly_at, y.nguoi_giai, y.trang_thai, y.han_at, y.nop_at, y.cap_nhat_at,
           y.loi_giai_nhap, y.anh_nhap, y.dap_an_nhap, y.tu_choi_lan, y.ly_do_tu_choi, y.tu_choi_at, y.duyet_boi, y.duyet_at, y.so_ky_tu, y.so_cong_thuc,
           b.ma, m.khoi, m.ten as nhom_ten, m.ma as nhom_ma, 'Mô hình'::text as nhom_truoc, null::smallint as muc_do,
           'bai_toan_goc'::text as loai_cau, b.phat_bieu as de_bai,
           concat_ws(E'\n', m.gia_thiet, m.gia_thiet_them, b.gia_thiet_phu, b.gia_thiet_rieng) as gia_thiet,
           coalesce(b.anh_chuan, m.anh_cau_hinh) as anh, null::jsonb as lua_chon, null::jsonb as menh_de, null::text as dap_an,
           (select cg.loi_giai from hinh_cach_giai cg where cg.baitoan_id = b.id and (cg.loi_giai is not null or cg.anh_loi_giai is not null) order by cg.la_mac_dinh desc, cg.thu_tu limit 1) as bai_loi_giai,
           y.loi_giai_ai, y.ai_model, y.che_do
    from hinh_baitoan_yeu_cau_giai y join hinh_baitoan b on b.id = y.baitoan_id join hinh_mo_hinh m on m.id = b.mo_hinh_id
    union all
    select 'hinh_bien_the', y.id, y.bien_the_id::text, y.ghi_chu, y.nguoi_yeu_cau, y.created_at, y.xu_ly_at, y.nguoi_giai, y.trang_thai, y.han_at, y.nop_at, y.cap_nhat_at,
           y.loi_giai_nhap, y.anh_nhap, y.dap_an_nhap, y.tu_choi_lan, y.ly_do_tu_choi, y.tu_choi_at, y.duyet_boi, y.duyet_at, y.so_ky_tu, y.so_cong_thuc,
           b.ma || ' · BT' || v.thu_tu, m.khoi, m.ten, m.ma, 'Mô hình', null::smallint,
           'bien_the_' || v.kieu, v.de_bai,
           concat_ws(E'\n', m.gia_thiet, m.gia_thiet_them, b.gia_thiet_phu, b.gia_thiet_rieng),
           coalesce(v.anh, b.anh_chuan, m.anh_cau_hinh), null::jsonb, null::jsonb, null::text, v.loi_giai,
           y.loi_giai_ai, y.ai_model, y.che_do
    from hinh_bien_the_yeu_cau_giai y join hinh_baitoan_bien_the v on v.id = y.bien_the_id join hinh_baitoan b on b.id = v.baitoan_id join hinh_mo_hinh m on m.id = b.mo_hinh_id
  ), u as (
    select nhanh, id, key, ghi_chu, nguoi_yeu_cau, created_at, xu_ly_at, nguoi_giai, trang_thai, han_at, nop_at, cap_nhat_at,
           loi_giai_nhap, anh_nhap, dap_an_nhap, tu_choi_lan, ly_do_tu_choi, tu_choi_at, duyet_boi, duyet_at, so_ky_tu, so_cong_thuc,
           ma, khoi, nhom_ten, nhom_ma, nhom_truoc, muc_do, loai_cau, de_bai, gia_thiet, anh, lua_chon, menh_de, dap_an, bai_loi_giai,
           loi_giai_ai, ai_model, che_do
    from k
    union all select * from h
  )
  -- ⚠ loi_giai_ai/ai_model/che_do PHẢI đứng SAU CÙNG (append-only) — mon/dang_giu/… đã là cột cũ, đặt cột
  -- mới trước chúng đổi vị trí = Postgres hiểu nhầm "đổi tên cột mon" (đã dính đúng lỗi này sáng nay).
  select u.nhanh, u.id, u.key, u.ghi_chu, u.nguoi_yeu_cau, u.created_at, u.xu_ly_at, u.nguoi_giai, u.trang_thai, u.han_at, u.nop_at, u.cap_nhat_at,
         u.loi_giai_nhap, u.anh_nhap, u.dap_an_nhap, u.tu_choi_lan, u.ly_do_tu_choi, u.tu_choi_at, u.duyet_boi, u.duyet_at, u.so_ky_tu, u.so_cong_thuc,
         u.ma, u.khoi, u.nhom_ten, u.nhom_ma, u.nhom_truoc, u.muc_do, u.loai_cau, u.de_bai, u.gia_thiet, u.anh, u.lua_chon, u.menh_de, u.dap_an, u.bai_loi_giai,
         public.fn_giaibai_mon(u.nhanh) as mon,
         public.fn_giaibai_dang_giu(u.trang_thai, u.han_at, u.xu_ly_at) as dang_giu,
         (u.xu_ly_at is null and u.trang_thai in ('dang_giai','can_sua') and u.han_at < now()) as qua_han,
         ns.ho_ten as nguoi_giai_ten, nd.ho_ten as duyet_boi_ten,
         extract(epoch from (u.nop_at - u.created_at))::int as giay_giai,
         u.loi_giai_ai, u.ai_model, u.che_do
  from u
  left join nhan_su ns on ns.id = u.nguoi_giai
  left join nhan_su nd on nd.id = u.duyet_boi;
grant select on public.v_giaibai_nhan to authenticated;

-- ═══════════ 3. v_giaibai_bai ("Giải") — BỎ điều kiện loi_giai_ai (thiết kế worker API đã bỏ) ═══════════
create or replace view public.v_giaibai_bai as
  with k as (
    select 'toan'::text as nhanh, c.ma_cau as key, c.ma_cau as ma, b.khoi, b.ten_dang as nhom_ten, b.ma_dang as nhom_ma, b.ten_chuyen_de as nhom_truoc, b.muc_do,
           c.loai_cau, c.noi_dung as de_bai, null::text as gia_thiet, c.anh_de as anh, c.lua_chon, c.menh_de, c.dap_an, c.nguon, c.created_at,
           c.loi_giai_ai, c.dap_an_ai, c.ai_model, c.ai_de_xuat_at
    from dai_cau_hoi c join dai_ban_do b on b.ma_dang = c.dang_chinh
    where c.xoa_at is null and c.loi_giai is null and c.anh_dap_an is null and c.dap_an is null
    union all
    select 'khtn', c.ma_cau, c.ma_cau, b.khoi, b.ten_dang, b.ma_dang, b.ten_chuyen_de, b.muc_do, c.loai_cau, c.noi_dung, null, c.anh_de, c.lua_chon, c.menh_de, c.dap_an, c.nguon, c.created_at,
           c.loi_giai_ai, c.dap_an_ai, c.ai_model, c.ai_de_xuat_at
    from khtn_cau_hoi c join khtn_ban_do b on b.ma_dang = c.dang_chinh
    where c.xoa_at is null and c.loi_giai is null and c.anh_dap_an is null and c.dap_an is null
    union all
    select 'hgt', c.ma_cau, c.ma_cau, b.khoi, b.ten_dang, b.ma_dang, b.ten_chuyen_de, b.muc_do, c.loai_cau, c.noi_dung, null, c.anh_de, c.lua_chon, c.menh_de, c.dap_an, c.nguon, c.created_at,
           c.loi_giai_ai, c.dap_an_ai, c.ai_model, c.ai_de_xuat_at
    from hgt_cau_hoi c join hgt_ban_do b on b.ma_dang = c.dang_chinh
    where c.xoa_at is null and c.loi_giai is null and c.anh_dap_an is null and c.dap_an is null
    union all
    select case h.loai when 'baitoan' then 'hinh_baitoan' else 'hinh_bien_the' end, h.id::text, h.ma, h.khoi, h.mo_hinh_ten, h.mo_hinh_ma, 'Mô hình', null::smallint,
           case h.loai when 'baitoan' then 'bai_toan_goc' else 'bien_the_' || h.kieu end, h.de_bai, h.gia_thiet, h.anh, null::jsonb, null::jsonb, null::text, 'le', h.created_at,
           h.loi_giai_ai, h.dap_an_ai, h.ai_model, h.ai_de_xuat_at
    from public.v_hinh_chua_giai h
  )
  select k.nhanh, k.key, k.ma, k.khoi, k.nhom_ten, k.nhom_ma, k.nhom_truoc, k.muc_do,
         k.loai_cau, k.de_bai, k.gia_thiet, k.anh, k.lua_chon, k.menh_de, k.dap_an, k.nguon, k.created_at,
         public.fn_giaibai_mon(k.nhanh) as mon,
         y.id as yc_id, y.nguoi_giai as yc_nguoi_giai, y.nguoi_giai_ten as yc_nguoi_giai_ten, y.trang_thai as yc_trang_thai, y.han_at as yc_han_at, y.created_at as yc_created_at, y.ghi_chu as yc_ghi_chu,
         k.loi_giai_ai, k.dap_an_ai, k.ai_model, k.ai_de_xuat_at
  from k
  left join lateral (
    select n.* from public.v_giaibai_nhan n where n.nhanh = k.nhanh and n.key = k.key and n.dang_giu limit 1
  ) y on true;
grant select on public.v_giaibai_bai to authenticated;

-- ═══════════ 4. v_giaibai_hoan_thien (MỚI) — câu Claude ĐàGIẢI THẬT (giai_method='claude_code'), chưa duyệt ═══════════
-- ⚠ PHẢI cùng SHAPE cột — kiểu, THỨ TỰ, SỐ LƯỢNG — với v_giaibai_bai: fn_giaibai_pool khai
-- `returns setof v_giaibai_bai` rồi SELECT * từ view này khi p_che_do='hoan_thien' (đỡ khai kiểu riêng).
-- "de_bai"/"dap_an" ở đây LÀ bản Claude đã viết (không null như v_giaibai_bai) để BaiBody xem trước được
-- ngay trên card trước khi Nhận; dap_an_ai/ai_model/ai_de_xuat_at giữ placeholder cho khớp shape (không
-- dùng ở nhánh Hoàn thiện — snapshot thật nằm trên DÒNG NHẬN, xem mục 6).
create or replace view public.v_giaibai_hoan_thien as
  with k as (
    select 'toan'::text as nhanh, c.ma_cau as key, c.ma_cau as ma, b.khoi, b.ten_dang as nhom_ten, b.ma_dang as nhom_ma, b.ten_chuyen_de as nhom_truoc, b.muc_do,
           c.loai_cau, c.noi_dung as de_bai, null::text as gia_thiet, c.anh_de as anh, c.lua_chon, c.menh_de, c.dap_an, c.nguon, c.created_at, c.loi_giai as loi_giai_ai, null::text as dap_an_ai, 'claude_code'::text as ai_model, c.ai_de_xuat_at
    from dai_cau_hoi c join dai_ban_do b on b.ma_dang = c.dang_chinh
    where c.xoa_at is null and c.nguon_giai = 'ai' and c.giai_method = 'claude_code' and c.da_duyet = false
    union all
    select 'khtn', c.ma_cau, c.ma_cau, b.khoi, b.ten_dang, b.ma_dang, b.ten_chuyen_de, b.muc_do, c.loai_cau, c.noi_dung, null, c.anh_de, c.lua_chon, c.menh_de, c.dap_an, c.nguon, c.created_at, c.loi_giai, null::text, 'claude_code'::text, c.ai_de_xuat_at
    from khtn_cau_hoi c join khtn_ban_do b on b.ma_dang = c.dang_chinh
    where c.xoa_at is null and c.nguon_giai = 'ai' and c.giai_method = 'claude_code' and c.da_duyet = false
    union all
    select 'hgt', c.ma_cau, c.ma_cau, b.khoi, b.ten_dang, b.ma_dang, b.ten_chuyen_de, b.muc_do, c.loai_cau, c.noi_dung, null, c.anh_de, c.lua_chon, c.menh_de, c.dap_an, c.nguon, c.created_at, c.loi_giai, null::text, 'claude_code'::text, c.ai_de_xuat_at
    from hgt_cau_hoi c join hgt_ban_do b on b.ma_dang = c.dang_chinh
    where c.xoa_at is null and c.nguon_giai = 'ai' and c.giai_method = 'claude_code' and c.da_duyet = false
    union all
    -- Hình: bài toán gốc (qua hinh_cach_giai) — bỏ qua bài đã có CÁCH GIẢI khác của người (chỉ hiện khi
    -- cách giải claude_code là cách DUY NHẤT/mặc định — tránh hiện nhầm bài đã có người viết cách khác).
    select 'hinh_baitoan', b.id::text, b.ma, m.khoi, m.ten, m.ma, 'Mô hình', null::smallint, 'bai_toan_goc',
           b.phat_bieu, concat_ws(E'\n', m.gia_thiet, m.gia_thiet_them, b.gia_thiet_phu, b.gia_thiet_rieng),
           coalesce(b.anh_chuan, m.anh_cau_hinh), null::jsonb, null::jsonb, null::text, 'le', b.created_at, cg.loi_giai, null::text, 'claude_code'::text, cg.updated_at
    from hinh_cach_giai cg
    join hinh_baitoan b on b.id = cg.baitoan_id
    join hinh_mo_hinh m on m.id = b.mo_hinh_id
    where cg.nguon_giai = 'ai' and cg.giai_method = 'claude_code' and cg.da_duyet = false
      and not exists (select 1 from hinh_cach_giai x where x.baitoan_id = b.id and x.id <> cg.id and (x.loi_giai is not null or x.anh_loi_giai is not null))
    union all
    select 'hinh_bien_the', v.id::text, b.ma || ' · BT' || v.thu_tu, m.khoi, m.ten, m.ma, 'Mô hình', null::smallint, 'bien_the_' || v.kieu,
           v.de_bai, concat_ws(E'\n', m.gia_thiet, m.gia_thiet_them, b.gia_thiet_phu, b.gia_thiet_rieng),
           coalesce(v.anh, b.anh_chuan, m.anh_cau_hinh), null::jsonb, null::jsonb, null::text, 'le', v.created_at, v.loi_giai, null::text, 'claude_code'::text, v.updated_at
    from hinh_baitoan_bien_the v
    join hinh_baitoan b on b.id = v.baitoan_id
    join hinh_mo_hinh m on m.id = b.mo_hinh_id
    where v.nguon_giai = 'ai' and v.giai_method = 'claude_code' and v.da_duyet = false
  )
  select k.nhanh, k.key, k.ma, k.khoi, k.nhom_ten, k.nhom_ma, k.nhom_truoc, k.muc_do,
         k.loai_cau, k.de_bai, k.gia_thiet, k.anh, k.lua_chon, k.menh_de, k.dap_an, k.nguon, k.created_at,
         public.fn_giaibai_mon(k.nhanh) as mon,
         y.id as yc_id, y.nguoi_giai as yc_nguoi_giai, y.nguoi_giai_ten as yc_nguoi_giai_ten, y.trang_thai as yc_trang_thai, y.han_at as yc_han_at, y.created_at as yc_created_at, y.ghi_chu as yc_ghi_chu,
         k.loi_giai_ai, k.dap_an_ai, k.ai_model, k.ai_de_xuat_at
  from k
  left join lateral (
    select n.* from public.v_giaibai_nhan n where n.nhanh = k.nhanh and n.key = k.key and n.dang_giu limit 1
  ) y on true;
grant select on public.v_giaibai_hoan_thien to authenticated;

-- ═══════════ 5. Pool + đếm — thêm p_che_do (mặc định 'giai', KHÔNG phá lời gọi cũ) ═══════════
create or replace function public.fn_giaibai_pool(p_nhanh text[], p_khoi text, p_limit int default 500, p_che_do text default 'giai')
returns setof public.v_giaibai_bai
language plpgsql stable as $$
begin
  if p_che_do = 'hoan_thien' then
    return query select * from public.v_giaibai_hoan_thien
      where nhanh = any(p_nhanh) and (p_khoi is null or khoi = p_khoi) and yc_id is null
      order by nhanh, nhom_ma, ma limit p_limit;
  else
    return query select * from public.v_giaibai_bai
      where nhanh = any(p_nhanh) and (p_khoi is null or khoi = p_khoi) and yc_id is null
      order by nhanh, nhom_ma, ma limit p_limit;
  end if;
end $$;
grant execute on function public.fn_giaibai_pool(text[], text, int, text) to authenticated;

create or replace function public.fn_giaibai_dem_pool(p_nhanh text[], p_che_do text default 'giai')
returns table (khoi text, so_bai bigint)
language plpgsql stable as $$
begin
  if p_che_do = 'hoan_thien' then
    return query select v.khoi, count(*) from public.v_giaibai_hoan_thien v where v.nhanh = any(p_nhanh) and v.yc_id is null group by v.khoi;
  else
    return query select v.khoi, count(*) from public.v_giaibai_bai v where v.nhanh = any(p_nhanh) and v.yc_id is null group by v.khoi;
  end if;
end $$;
grant execute on function public.fn_giaibai_dem_pool(text[], text) to authenticated;

-- ═══════════ 6. fn_giaibai_nhan — tự dò Giải hay Hoàn thiện (GIỮ CHỮ KÝ, client không đổi gì) ═══════════
create or replace function public.fn_giaibai_nhan(p_nhanh text, p_key text, p_me uuid)
returns uuid
language plpgsql as $$
declare r record := public.fn_giaibai_tbl(p_nhanh); s record := public.fn_giaibai_src(p_nhanh);
        v_id uuid; n int; v_ten text; v_che_do text; v_lg_ai text; v_da_ai text; v_model text;
begin
  if r.yc is null then raise exception 'fn_giaibai_nhan: nhánh không hợp lệ %', p_nhanh; end if;
  if p_me is null then raise exception 'Chưa xác định người nhận.'; end if;
  -- Câu ở pool nào: Giải (thiếu cả 2, viết từ đầu) hay Hoàn thiện (Claude đã giải thật, sửa lại)?
  -- 2 pool LOẠI TRỪ NHAU theo định nghĩa (1 = thiếu hết, 2 = đã có nguon_giai='ai'+giai_method='claude_code')
  -- nên không thể khớp cả hai — if/elsif là đủ, không có nhánh mơ hồ.
  if exists (select 1 from public.v_giaibai_bai b where b.nhanh = p_nhanh and b.key = p_key) then
    v_che_do := 'giai'; v_lg_ai := null; v_da_ai := null; v_model := null;
  elsif exists (select 1 from public.v_giaibai_hoan_thien b where b.nhanh = p_nhanh and b.key = p_key) then
    v_che_do := 'hoan_thien';
    execute format('select loi_giai, dap_an from %I where %I = %s', s.src, s.src_key, r.key_cast) into v_lg_ai, v_da_ai using p_key;
    v_model := 'claude_code';
  else
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
  -- Khe hở race hiếm (2 người bấm NHẬN đúng cùng mili-giây): unique index `*_cho_uniq` (mig cũ) chặn ở
  -- tầng DB, người thua CATCH ở đây để nhận thông báo tiếng Việt thay vì lỗi Postgres thô.
  -- Hoàn thiện: pre-fill loi_giai_nhap/dap_an_nhap TỪ bản Claude (v_lg_ai/v_da_ai) — người SỬA, không viết
  -- từ đầu. loi_giai_ai/ai_model lưu SONG SONG trên chính dòng nhận = snapshot bản gốc (so sánh về sau).
  begin
    execute format('insert into %I (%I, nguoi_yeu_cau, nguoi_giai, trang_thai, han_at, che_do, loi_giai_nhap, dap_an_nhap, loi_giai_ai, ai_model)
                     values (%s, $2, $2, ''dang_giai'', now() + interval ''48 hours'', $3, $4, $5, $4, $6) returning id',
                    r.yc, r.key_col, r.key_cast)
      into v_id using p_key, p_me, v_che_do, v_lg_ai, v_da_ai, v_model;
  exception when unique_violation then
    raise exception 'Bài này vừa có người khác nhận trước 1 bước — thử bài khác.';
  end;
  return v_id;
end $$;
grant execute on function public.fn_giaibai_nhan(text, text, uuid) to authenticated;

-- ═══════════ 7. fn_giaibai_duyet — đọc che_do của dòng để chọn đúng điều kiện ghi (KHÔNG đổi chữ ký) ═══════════
create or replace function public.fn_giaibai_duyet(p_nhanh text, p_id uuid, p_me uuid) returns void
language plpgsql as $$
declare r record := public.fn_giaibai_tbl(p_nhanh); t text; v_key text; v_nguoi uuid; v_lg text; v_anh text; v_da text; v_che_do text; n int;
begin
  if r.yc is null then raise exception 'fn_giaibai_duyet: nhánh không hợp lệ %', p_nhanh; end if;
  if not public.fn_giaibai_la_nguoi_duyet(p_me, p_nhanh) then raise exception 'Chỉ team học thuật môn % mới duyệt được.', public.fn_giaibai_mon(p_nhanh); end if;
  execute format('select %I::text, nguoi_giai, loi_giai_nhap, anh_nhap, dap_an_nhap, che_do from %I where id = $1 and xu_ly_at is null and trang_thai = ''cho_duyet'' for update', r.key_col, r.yc)
    into v_key, v_nguoi, v_lg, v_anh, v_da, v_che_do using p_id;
  if not found then raise exception 'Bài không ở trạng thái chờ duyệt.'; end if;
  if v_nguoi = p_me then raise exception 'Không tự duyệt bài mình giải.'; end if;
  if p_nhanh in ('toan','khtn','hgt') then
    t := public.fn_kho_tbl(p_nhanh) || '_cau_hoi';
    if v_che_do = 'hoan_thien' then
      -- Hoàn thiện: câu ĐANG LÀ bản Claude claude_code chưa duyệt (không cần loi_giai trống — ngược lại,
      -- BẮT BUỘC đang có, đó là tiền đề của chế độ này).
      execute format('update %I set loi_giai = $2, anh_dap_an = coalesce(anh_dap_an, $3), dap_an = coalesce($4, dap_an), nguon_giai = ''nguoi'', giai_method = ''ta'', da_duyet = true, duyet_boi = $5, duyet_at = now()
                      where ma_cau = $1 and xoa_at is null and nguon_giai = ''ai'' and giai_method = ''claude_code'' and da_duyet = false', t)
        using v_key, v_lg, v_anh, nullif(v_da, ''), p_me;
      get diagnostics n = row_count;
      if n = 0 then raise exception 'Câu % không còn ở trạng thái "Claude đã giải, chưa duyệt" — có thể đã bị duyệt/sửa nơi khác.', v_key; end if;
    else
      execute format('update %I set loi_giai = $2, anh_dap_an = $3, dap_an = coalesce(dap_an, $4), nguon_giai = ''nguoi'', giai_method = ''ta'', da_duyet = true, duyet_boi = $5, duyet_at = now()
                      where ma_cau = $1 and xoa_at is null and loi_giai is null and anh_dap_an is null', t)
        using v_key, v_lg, v_anh, v_da, p_me;
      get diagnostics n = row_count;
      if n = 0 then raise exception 'Câu % đã có lời giải trong lúc chờ — không ghi đè. Từ chối bài này hoặc trả bài.', v_key; end if;
    end if;
  else
    if v_che_do = 'hoan_thien' then
      -- Hoàn thiện Hình: UPDATE thẳng dòng hinh_cach_giai/hinh_baitoan_bien_the đã có (KHÔNG qua
      -- fn_hinh_ghi_loi_giai — hàm đó viết cho câu TRỐNG, ở đây câu đã có nội dung claude_code cần SỬA).
      if p_nhanh = 'hinh_baitoan' then
        update hinh_cach_giai set loi_giai = v_lg, anh_loi_giai = coalesce(anh_loi_giai, v_anh), nguon_giai = 'nguoi', giai_method = 'ta', da_duyet = true, duyet_boi = p_me, duyet_at = now(), updated_at = now()
          where baitoan_id = v_key::uuid and nguon_giai = 'ai' and giai_method = 'claude_code' and da_duyet = false;
      else
        update hinh_baitoan_bien_the set loi_giai = v_lg, anh_loi_giai = coalesce(anh_loi_giai, v_anh), nguon_giai = 'nguoi', giai_method = 'ta', da_duyet = true, duyet_boi = p_me, duyet_at = now(), updated_at = now()
          where id = v_key::uuid and nguon_giai = 'ai' and giai_method = 'claude_code' and da_duyet = false;
      end if;
      get diagnostics n = row_count;
      if n = 0 then raise exception 'Bài % không còn ở trạng thái "Claude đã giải, chưa duyệt".', v_key; end if;
    else
      -- đóng dòng nhận TRƯỚC (fn_hinh_ghi_loi_giai xoá dòng mở khi nguon='nguoi'), rồi ghi, rồi đóng dấu duyệt.
      execute format('update %I set xu_ly_at = now(), trang_thai = ''da_duyet'', duyet_boi = $2, duyet_at = now() where id = $1', r.yc) using p_id, p_me;
      perform public.fn_hinh_ghi_loi_giai(case when p_nhanh = 'hinh_baitoan' then 'baitoan' else 'bien_the' end, v_key::uuid, v_lg, v_anh, 'nguoi');
      if p_nhanh = 'hinh_baitoan' then
        update hinh_cach_giai set da_duyet = true, duyet_boi = p_me, duyet_at = now(), giai_method = 'ta'
          where baitoan_id = v_key::uuid and nguon_giai = 'nguoi' and (loi_giai is not null or anh_loi_giai is not null) and da_duyet = false;
      else
        update hinh_baitoan_bien_the set da_duyet = true, duyet_boi = p_me, duyet_at = now(), giai_method = 'ta' where id = v_key::uuid;
      end if;
      return;
    end if;
  end if;
  execute format('update %I set xu_ly_at = now(), trang_thai = ''da_duyet'', duyet_boi = $2, duyet_at = now() where id = $1', r.yc) using p_id, p_me;
end $$;
grant execute on function public.fn_giaibai_duyet(text, uuid, uuid) to authenticated;
