-- ============================================================================
-- 202609061619 — giaibai_hinh_chuoi_y
-- ----------------------------------------------------------------------------
-- VÌ SAO — Thùy 06/09: "Với Hình, khi hiện thì phải hiện CẢ CHUỖI câu để nhân sự đọc. Khi nhập giải thì MỖI Ý
-- trong chuỗi có ô nhập giải riêng. Claude giải bài thì phải đọc cả các bài TIỀN ĐỀ nữa."
-- Bám docs/spec-kho-hinh-soan-chuoi.md §2: **1 bài = 1 ĐÍCH (node ngọn) + bao đóng tiền đề hội tụ** (chuoiTienDe /
-- hinh_bao_dong_tien_de đã có), node lẻ = chuỗi 1 node. Đo thật 06/09: pool Giải 8 bài Hình có 5 tiền đề chưa giải,
-- Hoàn thiện 27 bài / 2 tiền đề chưa giải, sâu nhất 3 — nhỏ, không lo hiệu năng.
--
-- Thiết kế:
--   · `fn_hinh_chuoi_json(loai, id)` → jsonb {mo_hinh, y[]}: mọi node trong bao đóng + đích (sắp cap↑, mã), mỗi node
--     kèm phát biểu/giả thiết riêng+phụ/hình + TRẠNG THÁI lời giải hiện có (chua · claude · nguoi · da_duyet) + nội dung.
--     Biến thể: chuỗi của bài toán gốc (đọc) + chính biến thể là ý cuối. DÙNG CHUNG cho tool (fn_giaibai_chuoi, gọi
--     theo lô p_keys) và cho Claude (fn_hinh_yeu_cau_giai_cho thêm cột `chuoi` — hangdoi-giai.mjs --list dump nguyên).
--   · POOL Hình chỉ hiện ĐÍCH: ẩn node N nếu tồn tại node phụ thuộc N cũng đang "chưa xong" (cùng pool) — N sẽ được
--     giải như 1 Ý bên trong bài của node đó. Chỉ đổi WHERE ở v_giaibai_bai (nhánh h) / v_giaibai_hoan_thien —
--     KHÔNG đụng v_hinh_chua_giai (ERP tab "Chưa có lời giải" giữ nguyên). Nhận bài = nhận ĐÍCH; tiền đề chưa giải
--     không bị "giữ" riêng (index unique theo node vẫn 1 người/node) — lúc duyệt ý nào đã có nội dung do người khác
--     ghi trước thì BỎ QUA ý đó (không ghi đè), báo trong thông báo.
--   · Nháp theo ý: cột `y_nhap jsonb` [{id, loi_giai, anh}] trên 5 bảng *_yeu_cau_giai (Đại/KHTN/HGT luôn null — thêm
--     cho v_giaibai_nhan union đồng hình). `loi_giai_nhap` với Hình = bản GỘP client tự dựng (hiện + đếm ký tự/công
--     thức bằng generated column sẵn có) — KHÔNG phải nguồn ghi kho.
--   · `fn_giaibai_luu_nhap/nop` thêm `p_y_nhap jsonb default null` — PHẢI DROP chữ ký 6 tham số cũ (bài học overload
--     mig 202609061533). `fn_giaibai_duyet` nhánh Hình: có y_nhap → duyệt TỪNG Ý theo trạng thái HIỆN TẠI của node
--     (chưa có → fn_hinh_ghi_loi_giai 'nguoi' + đóng dấu duyệt; bản claude chưa duyệt → UPDATE ghi đè; đã có nội dung
--     khác → bỏ qua); không có y_nhap → hành vi cũ (1 node) giữ nguyên.
-- MẤT GÌ (Luật xoá): drop 2 overload cũ của fn_giaibai_luu_nhap/nop (thay bằng bản 7 tham số, default giữ hành vi cũ)
-- + drop/recreate fn_hinh_yeu_cau_giai_cho (cùng cột cũ + 1 cột chuoi). Không mất dữ liệu.
-- ============================================================================

-- ═══════════ 1. y_nhap trên 5 bảng nhận bài ═══════════
do $$
declare t text;
begin
  foreach t in array array['dai_cau_hoi_yeu_cau_giai','khtn_cau_hoi_yeu_cau_giai','hgt_cau_hoi_yeu_cau_giai','hinh_baitoan_yeu_cau_giai','hinh_bien_the_yeu_cau_giai'] loop
    execute format('alter table %I add column if not exists y_nhap jsonb', t);
  end loop;
end $$;

-- ═══════════ 2. Trạng thái lời giải của 1 node / biến thể (1 chỗ, dùng ở view + chuỗi) ═══════════
-- chua · claude (nguon_giai='ai' & giai_method='claude_code' & chưa duyệt) · nguoi (có nội dung, chưa duyệt) · da_duyet
create or replace function public.fn_hinh_tt_node(p_id uuid)
returns table (trang_thai text, loi_giai text, anh_loi_giai text, cach_id uuid)
language sql stable as $$
  select case when cg.id is null then 'chua'
              when cg.da_duyet then 'da_duyet'
              when cg.nguon_giai = 'ai' and cg.giai_method = 'claude_code' then 'claude'
              else 'nguoi' end,
         cg.loi_giai, cg.anh_loi_giai, cg.id
  from (select null) x
  left join lateral (
    select id, loi_giai, anh_loi_giai, da_duyet, nguon_giai, giai_method from hinh_cach_giai
    where baitoan_id = p_id and (loi_giai is not null or anh_loi_giai is not null)
    order by la_mac_dinh desc, thu_tu limit 1
  ) cg on true
$$;
create or replace function public.fn_hinh_tt_bien_the(p_id uuid)
returns text
language sql stable as $$
  select case when v.loi_giai is null and v.anh_loi_giai is null then 'chua'
              when v.da_duyet then 'da_duyet'
              when v.nguon_giai = 'ai' and v.giai_method = 'claude_code' then 'claude'
              else 'nguoi' end
  from hinh_baitoan_bien_the v where v.id = p_id
$$;

-- ═══════════ 3. Chuỗi → jsonb {mo_hinh, y[]} ═══════════
create or replace function public.fn_hinh_chuoi_json(p_loai text, p_id uuid)
returns jsonb
language sql stable as $$
  with goc as (
    select case when p_loai = 'baitoan' then p_id else (select baitoan_id from hinh_baitoan_bien_the where id = p_id) end as id
  ),
  nodes as (
    select g.id, 0 as do_sau from goc g
    union all
    select t.id, t.do_sau from goc g cross join lateral public.hinh_bao_dong_tien_de(g.id) t
  ),
  y as (
    select jsonb_build_object(
      'id', b.id, 'ma', b.ma, 'cap', b.cap, 'do_sau', n.do_sau, 'loai', 'baitoan',
      'la_dich', (p_loai = 'baitoan' and b.id = (select id from goc)),
      'gia_thiet_rieng', b.gia_thiet_rieng, 'gt_thay_the', b.gt_thay_the, 'gia_thiet_phu', b.gia_thiet_phu,
      'phat_bieu', b.phat_bieu, 'anh', b.anh_chuan,
      'trang_thai', tt.trang_thai, 'loi_giai', tt.loi_giai, 'anh_loi_giai', tt.anh_loi_giai
    ) as j, b.cap, b.ma
    from nodes n join hinh_baitoan b on b.id = n.id
    cross join lateral public.fn_hinh_tt_node(b.id) tt
    union all
    select jsonb_build_object(
      'id', v.id, 'ma', b.ma || ' · BT' || v.thu_tu, 'cap', b.cap, 'do_sau', -1, 'loai', 'bien_the', 'la_dich', true,
      'gia_thiet_rieng', null, 'gt_thay_the', false, 'gia_thiet_phu', null,
      'phat_bieu', v.de_bai, 'anh', v.anh,
      'trang_thai', public.fn_hinh_tt_bien_the(v.id), 'loi_giai', v.loi_giai, 'anh_loi_giai', v.anh_loi_giai
    ), b.cap + 1, 'zz'
    from hinh_baitoan_bien_the v join hinh_baitoan b on b.id = v.baitoan_id
    where p_loai = 'bien_the' and v.id = p_id
  )
  select jsonb_build_object(
    'mo_hinh', (select jsonb_build_object('ma', m.ma, 'ten', m.ten, 'gia_thiet', m.gia_thiet, 'gia_thiet_them', m.gia_thiet_them, 'anh', m.anh_cau_hinh)
                from goc g join hinh_baitoan b on b.id = g.id join hinh_mo_hinh m on m.id = b.mo_hinh_id),
    'y', coalesce((select jsonb_agg(j order by cap, ma) from y), '[]'::jsonb)
  )
$$;

-- Tool gọi theo LÔ (1 RPC cho cả trang Kho bài) — key = uuid dạng text (khớp v_giaibai_bai.key).
create or replace function public.fn_giaibai_chuoi(p_nhanh text, p_keys text[])
returns table (key text, chuoi jsonb)
language sql stable as $$
  select k, public.fn_hinh_chuoi_json(case p_nhanh when 'hinh_baitoan' then 'baitoan' when 'hinh_bien_the' then 'bien_the' end, k::uuid)
  from unnest(p_keys) k
  where p_nhanh in ('hinh_baitoan','hinh_bien_the')
$$;
grant execute on function public.fn_giaibai_chuoi(text, text[]) to authenticated;

-- ═══════════ 4. Pool Hình chỉ hiện ĐÍCH — ẩn node còn node PHỤ THUỘC chưa xong ═══════════
-- "Chưa xong" = trạng thái chua (pool Giải) HOẶC claude (pool Hoàn thiện) — bất kể node đang xét ở pool nào: node
-- phụ thuộc sẽ hiện làm ĐÍCH và node này là 1 Ý bên trong (ý 'claude' được nạp sẵn bản Claude). Đi NGƯỢC cạnh tiền
-- đề của CÁCH MẶC ĐỊNH (đúng tập cạnh hinh_bao_dong_tien_de dùng) — không quét cả bảng gọi bao đóng từng node.
create or replace function public.fn_hinh_co_phu_thuoc_cho(p_id uuid)
returns boolean
language sql stable as $$
  with recursive cach_md as (
    select distinct on (baitoan_id) baitoan_id, id from hinh_cach_giai order by baitoan_id, la_mac_dinh desc, thu_tu, id
  ), canh as (
    select m.baitoan_id as x, t.tien_de_id as y from cach_md m join hinh_cach_tien_de t on t.cach_id = m.id
  ), len as (
    select x as id, array[p_id, x] as duong from canh where y = p_id
    union all
    select c.x, u.duong || c.x from len u join canh c on c.y = u.id where not c.x = any(u.duong)
  )
  select exists (
    select 1 from (select distinct id from len) u cross join lateral public.fn_hinh_tt_node(u.id) tt
    where tt.trang_thai in ('chua', 'claude')
  )
$$;

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
    -- chỉ ĐÍCH: node còn phụ thuộc chưa giải thì ẩn (sẽ là 1 ý trong bài của node phụ thuộc)
    where not (h.loai = 'baitoan' and public.fn_hinh_co_phu_thuoc_cho(h.id))
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
    select 'hinh_baitoan', b.id::text, b.ma, m.khoi, m.ten, m.ma, 'Mô hình', null::smallint, 'bai_toan_goc',
           b.phat_bieu, concat_ws(E'\n', m.gia_thiet, m.gia_thiet_them, b.gia_thiet_phu, b.gia_thiet_rieng),
           coalesce(b.anh_chuan, m.anh_cau_hinh), null::jsonb, null::jsonb, null::text, 'le', b.created_at, cg.loi_giai, null::text, 'claude_code'::text, cg.updated_at
    from hinh_cach_giai cg
    join hinh_baitoan b on b.id = cg.baitoan_id
    join hinh_mo_hinh m on m.id = b.mo_hinh_id
    where cg.nguon_giai = 'ai' and cg.giai_method = 'claude_code' and cg.da_duyet = false
      and not exists (select 1 from hinh_cach_giai x where x.baitoan_id = b.id and x.id <> cg.id and (x.loi_giai is not null or x.anh_loi_giai is not null))
      and not public.fn_hinh_co_phu_thuoc_cho(b.id)
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

-- ═══════════ 5. v_giaibai_nhan — nối y_nhap ở CUỐI ═══════════
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
           y.loi_giai_ai, y.ai_model, y.che_do, y.y_nhap
    from hinh_baitoan_yeu_cau_giai y join hinh_baitoan b on b.id = y.baitoan_id join hinh_mo_hinh m on m.id = b.mo_hinh_id
    union all
    select 'hinh_bien_the', y.id, y.bien_the_id::text, y.ghi_chu, y.nguoi_yeu_cau, y.created_at, y.xu_ly_at, y.nguoi_giai, y.trang_thai, y.han_at, y.nop_at, y.cap_nhat_at,
           y.loi_giai_nhap, y.anh_nhap, y.dap_an_nhap, y.tu_choi_lan, y.ly_do_tu_choi, y.tu_choi_at, y.duyet_boi, y.duyet_at, y.so_ky_tu, y.so_cong_thuc,
           b.ma || ' · BT' || v.thu_tu, m.khoi, m.ten, m.ma, 'Mô hình', null::smallint,
           'bien_the_' || v.kieu, v.de_bai,
           concat_ws(E'\n', m.gia_thiet, m.gia_thiet_them, b.gia_thiet_phu, b.gia_thiet_rieng),
           coalesce(v.anh, b.anh_chuan, m.anh_cau_hinh), null::jsonb, null::jsonb, null::text, v.loi_giai,
           y.loi_giai_ai, y.ai_model, y.che_do, y.y_nhap
    from hinh_bien_the_yeu_cau_giai y join hinh_baitoan_bien_the v on v.id = y.bien_the_id join hinh_baitoan b on b.id = v.baitoan_id join hinh_mo_hinh m on m.id = b.mo_hinh_id
  ), u as (
    select nhanh, id, key, ghi_chu, nguoi_yeu_cau, created_at, xu_ly_at, nguoi_giai, trang_thai, han_at, nop_at, cap_nhat_at,
           loi_giai_nhap, anh_nhap, dap_an_nhap, tu_choi_lan, ly_do_tu_choi, tu_choi_at, duyet_boi, duyet_at, so_ky_tu, so_cong_thuc,
           ma, khoi, nhom_ten, nhom_ma, nhom_truoc, muc_do, loai_cau, de_bai, gia_thiet, anh, lua_chon, menh_de, dap_an, bai_loi_giai,
           loi_giai_ai, ai_model, che_do, y_nhap
    from k
    union all select * from h
  )
  select u.nhanh, u.id, u.key, u.ghi_chu, u.nguoi_yeu_cau, u.created_at, u.xu_ly_at, u.nguoi_giai, u.trang_thai, u.han_at, u.nop_at, u.cap_nhat_at,
         u.loi_giai_nhap, u.anh_nhap, u.dap_an_nhap, u.tu_choi_lan, u.ly_do_tu_choi, u.tu_choi_at, u.duyet_boi, u.duyet_at, u.so_ky_tu, u.so_cong_thuc,
         u.ma, u.khoi, u.nhom_ten, u.nhom_ma, u.nhom_truoc, u.muc_do, u.loai_cau, u.de_bai, u.gia_thiet, u.anh, u.lua_chon, u.menh_de, u.dap_an, u.bai_loi_giai,
         public.fn_giaibai_mon(u.nhanh) as mon,
         public.fn_giaibai_dang_giu(u.trang_thai, u.han_at, u.xu_ly_at) as dang_giu,
         (u.xu_ly_at is null and u.trang_thai in ('dang_giai','can_sua') and u.han_at < now()) as qua_han,
         ns.ho_ten as nguoi_giai_ten, nd.ho_ten as duyet_boi_ten,
         extract(epoch from (u.nop_at - u.created_at))::int as giay_giai,
         u.loi_giai_ai, u.ai_model, u.che_do,
         u.y_nhap
  from u
  left join nhan_su ns on ns.id = u.nguoi_giai
  left join nhan_su nd on nd.id = u.duyet_boi;
grant select on public.v_giaibai_nhan to authenticated;

-- ═══════════ 6. luu_nhap / nop — thêm p_y_nhap (DROP chữ ký cũ, tránh overload) ═══════════
drop function if exists public.fn_giaibai_luu_nhap(text, uuid, uuid, text, text, text);
create or replace function public.fn_giaibai_luu_nhap(p_nhanh text, p_id uuid, p_me uuid, p_loi_giai text, p_anh text, p_dap_an text, p_y_nhap jsonb default null) returns void
language plpgsql as $$
declare r record := public.fn_giaibai_tbl(p_nhanh); n int;
begin
  if r.yc is null then raise exception 'fn_giaibai_luu_nhap: nhánh không hợp lệ %', p_nhanh; end if;
  execute format('update %I set loi_giai_nhap = nullif($3, ''''), anh_nhap = nullif($4, ''''), dap_an_nhap = nullif($5, ''''), y_nhap = $6, cap_nhat_at = now()
                  where id = $1 and nguoi_giai = $2 and xu_ly_at is null and trang_thai in (''dang_giai'',''can_sua'') and (han_at is null or han_at >= now())', r.yc)
    using p_id, p_me, p_loi_giai, p_anh, p_dap_an, p_y_nhap;
  get diagnostics n = row_count;
  if n = 0 then raise exception 'Không lưu được — bài đã quá hạn, đã nộp hoặc không phải của bạn.'; end if;
end $$;
grant execute on function public.fn_giaibai_luu_nhap(text, uuid, uuid, text, text, text, jsonb) to authenticated;

drop function if exists public.fn_giaibai_nop(text, uuid, uuid, text, text, text);
create or replace function public.fn_giaibai_nop(p_nhanh text, p_id uuid, p_me uuid, p_loi_giai text, p_anh text, p_dap_an text, p_y_nhap jsonb default null) returns void
language plpgsql as $$
declare r record := public.fn_giaibai_tbl(p_nhanh); n int;
begin
  if r.yc is null then raise exception 'fn_giaibai_nop: nhánh không hợp lệ %', p_nhanh; end if;
  if nullif(p_loi_giai, '') is null and nullif(p_anh, '') is null and (p_y_nhap is null or jsonb_array_length(p_y_nhap) = 0) then
    raise exception 'Cần lời giải text hoặc ảnh lời giải.';
  end if;
  execute format('update %I set loi_giai_nhap = nullif($3, ''''), anh_nhap = nullif($4, ''''), dap_an_nhap = nullif($5, ''''), y_nhap = $6, cap_nhat_at = now(),
                    trang_thai = ''cho_duyet'', nop_at = coalesce(nop_at, now()), han_at = null
                  where id = $1 and nguoi_giai = $2 and xu_ly_at is null and trang_thai in (''dang_giai'',''can_sua'') and (han_at is null or han_at >= now())', r.yc)
    using p_id, p_me, p_loi_giai, p_anh, p_dap_an, p_y_nhap;
  get diagnostics n = row_count;
  if n = 0 then raise exception 'Không nộp được — bài đã quá hạn, đã nộp hoặc không phải của bạn.'; end if;
end $$;
grant execute on function public.fn_giaibai_nop(text, uuid, uuid, text, text, text, jsonb) to authenticated;

-- ═══════════ 7. fn_giaibai_duyet — Hình: duyệt TỪNG Ý theo y_nhap (giữ nguyên nhánh Đại/KHTN/HGT của 1543) ═══════════
create or replace function public.fn_giaibai_duyet(p_nhanh text, p_id uuid, p_me uuid) returns void
language plpgsql as $$
declare r record := public.fn_giaibai_tbl(p_nhanh); t text; v_key text; v_nguoi uuid; v_lg text; v_anh text; v_da text; v_che_do text; v_y jsonb; n int;
        y jsonb; v_yid uuid; v_ylg text; v_yanh text; v_tt text; v_bo text[] := '{}'; v_ghi int := 0;
begin
  if r.yc is null then raise exception 'fn_giaibai_duyet: nhánh không hợp lệ %', p_nhanh; end if;
  if not public.fn_giaibai_la_nguoi_duyet(p_me, p_nhanh) then raise exception 'Chỉ team học thuật môn % mới duyệt được.', public.fn_giaibai_mon(p_nhanh); end if;
  execute format('select %I::text, nguoi_giai, loi_giai_nhap, anh_nhap, dap_an_nhap, che_do, y_nhap from %I where id = $1 and xu_ly_at is null and trang_thai = ''cho_duyet'' for update', r.key_col, r.yc)
    into v_key, v_nguoi, v_lg, v_anh, v_da, v_che_do, v_y using p_id;
  if v_key is null then raise exception 'Bài không ở trạng thái chờ duyệt.'; end if;
  if v_nguoi = p_me then raise exception 'Không tự duyệt bài mình giải.'; end if;

  if p_nhanh in ('toan','khtn','hgt') then
    t := public.fn_kho_tbl(p_nhanh) || '_cau_hoi';
    if v_che_do = 'hoan_thien' then
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
    execute format('update %I set xu_ly_at = now(), trang_thai = ''da_duyet'', duyet_boi = $2, duyet_at = now() where id = $1', r.yc) using p_id, p_me;
    return;
  end if;

  -- ── HÌNH ──
  if v_y is not null and jsonb_typeof(v_y) = 'array' and jsonb_array_length(v_y) > 0 then
    -- Đóng dòng nhận TRƯỚC (fn_hinh_ghi_loi_giai xoá dòng mở nguoi_giai NULL của node; dòng của người thì không đụng).
    execute format('update %I set xu_ly_at = now(), trang_thai = ''da_duyet'', duyet_boi = $2, duyet_at = now() where id = $1', r.yc) using p_id, p_me;
    for y in select * from jsonb_array_elements(v_y) loop
      v_yid := (y->>'id')::uuid; v_ylg := nullif(y->>'loi_giai', ''); v_yanh := nullif(y->>'anh', '');
      if v_ylg is null and v_yanh is null then continue; end if;
      if p_nhanh = 'hinh_bien_the' and v_yid = v_key::uuid then
        v_tt := public.fn_hinh_tt_bien_the(v_yid);
        if v_tt = 'chua' then
          perform public.fn_hinh_ghi_loi_giai('bien_the', v_yid, v_ylg, v_yanh, 'nguoi');
          update hinh_baitoan_bien_the set da_duyet = true, duyet_boi = p_me, duyet_at = now(), giai_method = 'ta' where id = v_yid;
          v_ghi := v_ghi + 1;
        elsif v_tt = 'claude' then
          update hinh_baitoan_bien_the set loi_giai = v_ylg, anh_loi_giai = coalesce(anh_loi_giai, v_yanh), nguon_giai = 'nguoi', giai_method = 'ta', da_duyet = true, duyet_boi = p_me, duyet_at = now(), updated_at = now() where id = v_yid;
          v_ghi := v_ghi + 1;
        else v_bo := v_bo || (y->>'ma'); end if;
      else
        select trang_thai into v_tt from public.fn_hinh_tt_node(v_yid);
        if v_tt = 'chua' then
          -- tiền đề có thể đang bị NGƯỜI KHÁC giữ riêng (nhận trước khi luật ĐÍCH có) → fn_hinh_ghi_loi_giai ném lỗi:
          -- bỏ qua ý đó, không hỏng cả lượt duyệt.
          begin
            perform public.fn_hinh_ghi_loi_giai('baitoan', v_yid, v_ylg, v_yanh, 'nguoi');
            update hinh_cach_giai set da_duyet = true, duyet_boi = p_me, duyet_at = now(), giai_method = 'ta'
              where baitoan_id = v_yid and nguon_giai = 'nguoi' and (loi_giai is not null or anh_loi_giai is not null) and da_duyet = false;
            v_ghi := v_ghi + 1;
          exception when others then
            v_bo := v_bo || (coalesce(y->>'ma', v_yid::text) || ' (' || sqlerrm || ')');
          end;
        elsif v_tt = 'claude' then
          update hinh_cach_giai set loi_giai = v_ylg, anh_loi_giai = coalesce(anh_loi_giai, v_yanh), nguon_giai = 'nguoi', giai_method = 'ta', da_duyet = true, duyet_boi = p_me, duyet_at = now(), updated_at = now()
            where baitoan_id = v_yid and nguon_giai = 'ai' and giai_method = 'claude_code' and da_duyet = false;
          v_ghi := v_ghi + 1;
        else v_bo := v_bo || coalesce(y->>'ma', v_yid::text); end if;   -- đã có nội dung người khác / đã duyệt: KHÔNG ghi đè
      end if;
    end loop;
    if v_ghi = 0 then raise exception 'Không ghi được ý nào — mọi ý đã có lời giải chính thức/của người khác (%). Trả bài hoặc từ chối.', array_to_string(v_bo, ', '); end if;
    if array_length(v_bo, 1) > 0 then raise notice 'Bỏ qua % ý đã có nội dung: %', array_length(v_bo, 1), array_to_string(v_bo, ', '); end if;
    return;
  end if;

  -- Không có y_nhap (bản cũ / 1 node) — hành vi 1543 giữ nguyên
  if v_che_do = 'hoan_thien' then
    if p_nhanh = 'hinh_baitoan' then
      update hinh_cach_giai set loi_giai = v_lg, anh_loi_giai = coalesce(anh_loi_giai, v_anh), nguon_giai = 'nguoi', giai_method = 'ta', da_duyet = true, duyet_boi = p_me, duyet_at = now(), updated_at = now()
        where baitoan_id = v_key::uuid and nguon_giai = 'ai' and giai_method = 'claude_code' and da_duyet = false;
    else
      update hinh_baitoan_bien_the set loi_giai = v_lg, anh_loi_giai = coalesce(anh_loi_giai, v_anh), nguon_giai = 'nguoi', giai_method = 'ta', da_duyet = true, duyet_boi = p_me, duyet_at = now(), updated_at = now()
        where id = v_key::uuid and nguon_giai = 'ai' and giai_method = 'claude_code' and da_duyet = false;
    end if;
    get diagnostics n = row_count;
    if n = 0 then raise exception 'Bài % không còn ở trạng thái "Claude đã giải, chưa duyệt".', v_key; end if;
    execute format('update %I set xu_ly_at = now(), trang_thai = ''da_duyet'', duyet_boi = $2, duyet_at = now() where id = $1', r.yc) using p_id, p_me;
  else
    execute format('update %I set xu_ly_at = now(), trang_thai = ''da_duyet'', duyet_boi = $2, duyet_at = now() where id = $1', r.yc) using p_id, p_me;
    perform public.fn_hinh_ghi_loi_giai(case when p_nhanh = 'hinh_baitoan' then 'baitoan' else 'bien_the' end, v_key::uuid, v_lg, v_anh, 'nguoi');
    if p_nhanh = 'hinh_baitoan' then
      update hinh_cach_giai set da_duyet = true, duyet_boi = p_me, duyet_at = now(), giai_method = 'ta'
        where baitoan_id = v_key::uuid and nguon_giai = 'nguoi' and (loi_giai is not null or anh_loi_giai is not null) and da_duyet = false;
    else
      update hinh_baitoan_bien_the set da_duyet = true, duyet_boi = p_me, duyet_at = now(), giai_method = 'ta' where id = v_key::uuid;
    end if;
  end if;
end $$;
grant execute on function public.fn_giaibai_duyet(text, uuid, uuid) to authenticated;

-- ═══════════ 8. Claude đọc cả chuỗi: fn_hinh_yeu_cau_giai_cho thêm cột `chuoi` (hangdoi-giai.mjs --list dump nguyên) ═══════════
drop function if exists public.fn_hinh_yeu_cau_giai_cho();
create or replace function public.fn_hinh_yeu_cau_giai_cho()
returns table (
  yeu_cau_id uuid, yeu_cau_at timestamptz, ghi_chu text, loai text, id uuid, ma text, khoi text,
  mo_hinh_ma text, mo_hinh_ten text, gia_thiet text, de_bai text, anh text, kieu text,
  da_co_loi_giai boolean, mau_loi_giai text, mau_anh text, chuoi jsonb
)
language sql stable as $$
  select y.id, y.created_at, y.ghi_chu, 'baitoan', b.id, b.ma, m.khoi, m.ma, m.ten,
         concat_ws(E'\n', m.gia_thiet, m.gia_thiet_them, b.gia_thiet_phu, b.gia_thiet_rieng), b.phat_bieu,
         coalesce(b.anh_chuan, m.anh_cau_hinh), null::text,
         exists (select 1 from hinh_cach_giai cg where cg.baitoan_id = b.id and (cg.loi_giai is not null or cg.anh_loi_giai is not null)),
         null::text, null::text,
         public.fn_hinh_chuoi_json('baitoan', b.id)
  from hinh_baitoan_yeu_cau_giai y
  join hinh_baitoan b on b.id = y.baitoan_id
  join hinh_mo_hinh m on m.id = b.mo_hinh_id
  where y.xu_ly_at is null and y.nguoi_giai is null
  union all
  select y.id, y.created_at, y.ghi_chu, 'bien_the', v.id, b.ma || ' · BT' || v.thu_tu, m.khoi, m.ma, m.ten,
         concat_ws(E'\n', m.gia_thiet, m.gia_thiet_them, b.gia_thiet_phu, b.gia_thiet_rieng), v.de_bai,
         coalesce(v.anh, b.anh_chuan, m.anh_cau_hinh), v.kieu,
         (v.loi_giai is not null or v.anh_loi_giai is not null),
         cg.loi_giai, cg.anh_loi_giai,
         public.fn_hinh_chuoi_json('bien_the', v.id)
  from hinh_bien_the_yeu_cau_giai y
  join hinh_baitoan_bien_the v on v.id = y.bien_the_id
  join hinh_baitoan b on b.id = v.baitoan_id
  join hinh_mo_hinh m on m.id = b.mo_hinh_id
  left join lateral (
    select loi_giai, anh_loi_giai from hinh_cach_giai c where c.baitoan_id = b.id and (c.loi_giai is not null or c.anh_loi_giai is not null)
    order by la_mac_dinh desc, thu_tu limit 1
  ) cg on true
  where y.xu_ly_at is null and y.nguoi_giai is null
  order by 2
$$;
grant execute on function public.fn_hinh_yeu_cau_giai_cho() to authenticated;
