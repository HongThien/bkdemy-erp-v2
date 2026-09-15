-- 202609060122 — TOOL GIẢI BÀI KHO CHUNG (giaibai.bkacademy.edu.vn) — Thùy chốt 06/09.
--
-- Story: hệ liệt kê bài chưa có lời giải → TA/GV bấm "Nhận giải" → bài rời pool, về danh sách riêng của
-- người đó → soạn (MathTextarea/⤢ SoanModal) → Nộp → học thuật duyệt/từ chối (≤3 lần) → duyệt xong mới ghi
-- vào câu trong kho → ghi nhận ai / lúc nào / bao lâu / độ dài. Claude = "1 TA cao cấp": bài đặt Claude cũng
-- không hiện cho người khác. Tiền tính NGOÀI hệ (Thùy tự tính từ báo cáo tháng).
--
-- Thiết kế: KHÔNG đẻ khái niệm mới — 5 bảng `*_yeu_cau_giai` (hàng đợi Claude, mig 202609041808/1826) chính là
-- "ai đang giữ bài này" → mở rộng thành bảng NHẬN BÀI dùng chung: `nguoi_giai` NULL = Claude, có = người.
-- Index unique `(bài) where xu_ly_at is null` sẵn có = mỗi bài tối đa 1 người/Claude giữ. Mọi list/đếm/đặt/ghi
-- = function Postgres (§2.0). Lời giải người soạn nằm ở cột *_nhap của dòng nhận bài cho tới khi DUYỆT — luồng
-- này KHÔNG xoá/ghi đè gì trong kho (Thùy 06/09: "luồng này không xoá gì trong kho cả"); từ chối chỉ đụng dòng nhận.
-- Quá hạn (48h kể từ nhận / kể từ bị từ chối) = coi như trả bài: pool bỏ qua dòng quá hạn, người khác nhận thì dòng
-- cũ đóng `qua_han` — không cần cron.
-- MẤT GÌ (Luật xoá): không — thêm cột/view/function; drop-create lại 3 fn cũ (đổi kiểu trả về) + replace 3 fn.

-- ═══════════ 1. Mở rộng 5 bảng nhận bài (cùng bộ cột) ═══════════
do $$
declare t text;
begin
  foreach t in array array['dai_cau_hoi_yeu_cau_giai','khtn_cau_hoi_yeu_cau_giai','hgt_cau_hoi_yeu_cau_giai','hinh_baitoan_yeu_cau_giai','hinh_bien_the_yeu_cau_giai'] loop
    execute format($q$
      alter table %1$I
        add column if not exists nguoi_giai uuid references nhan_su(id) on delete set null,
        add column if not exists trang_thai text not null default 'cho_claude',
        add column if not exists han_at timestamptz,
        add column if not exists nop_at timestamptz,
        add column if not exists cap_nhat_at timestamptz,
        add column if not exists loi_giai_nhap text,
        add column if not exists anh_nhap text,
        add column if not exists dap_an_nhap text,
        add column if not exists tu_choi_lan int not null default 0,
        add column if not exists ly_do_tu_choi text,
        add column if not exists tu_choi_at timestamptz,
        add column if not exists duyet_boi uuid references nhan_su(id) on delete set null,
        add column if not exists duyet_at timestamptz,
        add column if not exists so_ky_tu int generated always as (length(coalesce(loi_giai_nhap, ''))) stored,
        add column if not exists so_cong_thuc int generated always as ((length(coalesce(loi_giai_nhap, '')) - length(replace(coalesce(loi_giai_nhap, ''), '$', ''))) / 2) stored
    $q$, t);
    -- dòng Claude đã đóng trước migration → 'da_xong'
    execute format('update %I set trang_thai = ''da_xong'' where nguoi_giai is null and xu_ly_at is not null and trang_thai = ''cho_claude''', t);
    execute format('alter table %1$I drop constraint if exists %1$s_trang_thai_chk', t);
    execute format($q$alter table %1$I add constraint %1$s_trang_thai_chk check (
      trang_thai in ('cho_claude','da_xong','dang_giai','cho_duyet','can_sua','da_duyet','da_tra','qua_han','tu_choi_3')
      and ((nguoi_giai is null) = (trang_thai in ('cho_claude','da_xong'))))$q$, t);
    execute format('create index if not exists %1$s_nguoi_giai_idx on %1$I (nguoi_giai) where nguoi_giai is not null', t);
  end loop;
end $$;

-- Dòng Claude: worker đóng bằng `set xu_ly_at = now()` (raw UPDATE trong hangdoi-giai.mjs) → trigger tự đổi nhãn,
-- worker không phải biết cột mới.
create or replace function public.fn_giaibai_tg_claude_dong() returns trigger
language plpgsql as $$
begin
  if new.nguoi_giai is null and new.xu_ly_at is not null and old.xu_ly_at is null then new.trang_thai := 'da_xong'; end if;
  return new;
end $$;
do $$
declare t text;
begin
  foreach t in array array['dai_cau_hoi_yeu_cau_giai','khtn_cau_hoi_yeu_cau_giai','hgt_cau_hoi_yeu_cau_giai','hinh_baitoan_yeu_cau_giai','hinh_bien_the_yeu_cau_giai'] loop
    execute format('drop trigger if exists %1$s_claude_dong on %1$I', t);
    execute format('create trigger %1$s_claude_dong before update on %1$I for each row execute function public.fn_giaibai_tg_claude_dong()', t);
  end loop;
end $$;

-- ═══════════ 2. Registry nhánh (phía SQL — mirror KHO_MON/khoTbls ở TS, 1 chỗ duy nhất) ═══════════
-- nhanh ∈ toan | khtn | hgt | hinh_baitoan | hinh_bien_the. Trả bảng nhận bài + cột khoá + biểu thức cast khoá.
create or replace function public.fn_giaibai_tbl(p_nhanh text, out yc text, out key_col text, out key_cast text)
language sql immutable as $$
  select case p_nhanh
           when 'toan' then 'dai_cau_hoi_yeu_cau_giai' when 'khtn' then 'khtn_cau_hoi_yeu_cau_giai' when 'hgt' then 'hgt_cau_hoi_yeu_cau_giai'
           when 'hinh_baitoan' then 'hinh_baitoan_yeu_cau_giai' when 'hinh_bien_the' then 'hinh_bien_the_yeu_cau_giai' end,
         case p_nhanh when 'hinh_baitoan' then 'baitoan_id' when 'hinh_bien_the' then 'bien_the_id' else 'ma_cau' end,
         case when p_nhanh like 'hinh_%' then '$1::uuid' else '$1' end
$$;
-- Môn (nhãn nhan_su_mon) của nhánh — KHTN là môn riêng, còn lại thuộc Toán (KHO_MON).
create or replace function public.fn_giaibai_mon(p_nhanh text) returns text
language sql immutable as $$ select case when p_nhanh = 'khtn' then 'KHTN' else 'Toán' end $$;
-- Dòng nhận bài còn "giữ" bài thật sự (mở + chưa quá hạn). Quá hạn chỉ áp cho dang_giai/can_sua.
create or replace function public.fn_giaibai_dang_giu(p_trang_thai text, p_han_at timestamptz, p_xu_ly_at timestamptz) returns boolean
language sql stable as $$
  select p_xu_ly_at is null and not (p_trang_thai in ('dang_giai','can_sua') and p_han_at is not null and p_han_at < now())
$$;

-- ═══════════ 3. View mọi dòng nhận bài (5 bảng, shape chung, kèm nhãn bài + tên người) ═══════════
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
           (select cg.loi_giai from hinh_cach_giai cg where cg.baitoan_id = b.id and (cg.loi_giai is not null or cg.anh_loi_giai is not null) order by cg.la_mac_dinh desc, cg.thu_tu limit 1) as bai_loi_giai
    from hinh_baitoan_yeu_cau_giai y join hinh_baitoan b on b.id = y.baitoan_id join hinh_mo_hinh m on m.id = b.mo_hinh_id
    union all
    select 'hinh_bien_the', y.id, y.bien_the_id::text, y.ghi_chu, y.nguoi_yeu_cau, y.created_at, y.xu_ly_at, y.nguoi_giai, y.trang_thai, y.han_at, y.nop_at, y.cap_nhat_at,
           y.loi_giai_nhap, y.anh_nhap, y.dap_an_nhap, y.tu_choi_lan, y.ly_do_tu_choi, y.tu_choi_at, y.duyet_boi, y.duyet_at, y.so_ky_tu, y.so_cong_thuc,
           b.ma || ' · BT' || v.thu_tu, m.khoi, m.ten, m.ma, 'Mô hình', null::smallint,
           'bien_the_' || v.kieu, v.de_bai,
           concat_ws(E'\n', m.gia_thiet, m.gia_thiet_them, b.gia_thiet_phu, b.gia_thiet_rieng),
           coalesce(v.anh, b.anh_chuan, m.anh_cau_hinh), null::jsonb, null::jsonb, null::text, v.loi_giai
    from hinh_bien_the_yeu_cau_giai y join hinh_baitoan_bien_the v on v.id = y.bien_the_id join hinh_baitoan b on b.id = v.baitoan_id join hinh_mo_hinh m on m.id = b.mo_hinh_id
  ), u as (
    select nhanh, id, key, ghi_chu, nguoi_yeu_cau, created_at, xu_ly_at, nguoi_giai, trang_thai, han_at, nop_at, cap_nhat_at,
           loi_giai_nhap, anh_nhap, dap_an_nhap, tu_choi_lan, ly_do_tu_choi, tu_choi_at, duyet_boi, duyet_at, so_ky_tu, so_cong_thuc,
           ma, khoi, nhom_ten, nhom_ma, nhom_truoc, muc_do, loai_cau, de_bai, gia_thiet, anh, lua_chon, menh_de, dap_an, bai_loi_giai
    from k
    union all select * from h
  )
  select u.*, public.fn_giaibai_mon(u.nhanh) as mon,
         public.fn_giaibai_dang_giu(u.trang_thai, u.han_at, u.xu_ly_at) as dang_giu,
         (u.xu_ly_at is null and u.trang_thai in ('dang_giai','can_sua') and u.han_at < now()) as qua_han,
         ns.ho_ten as nguoi_giai_ten, nd.ho_ten as duyet_boi_ten,
         extract(epoch from (u.nop_at - u.created_at))::int as giay_giai
  from u
  left join nhan_su ns on ns.id = u.nguoi_giai
  left join nhan_su nd on nd.id = u.duyet_boi;
grant select on public.v_giaibai_nhan to authenticated;

-- ═══════════ 4. View mọi BÀI chưa có lời giải (4 nhánh) + người/Claude đang giữ ═══════════
create or replace view public.v_giaibai_bai as
  with k as (
    select 'toan'::text as nhanh, c.ma_cau as key, c.ma_cau as ma, b.khoi, b.ten_dang as nhom_ten, b.ma_dang as nhom_ma, b.ten_chuyen_de as nhom_truoc, b.muc_do,
           c.loai_cau, c.noi_dung as de_bai, null::text as gia_thiet, c.anh_de as anh, c.lua_chon, c.menh_de, c.dap_an, c.nguon, c.created_at
    from dai_cau_hoi c join dai_ban_do b on b.ma_dang = c.dang_chinh where c.xoa_at is null and c.loi_giai is null and c.anh_dap_an is null
    union all
    select 'khtn', c.ma_cau, c.ma_cau, b.khoi, b.ten_dang, b.ma_dang, b.ten_chuyen_de, b.muc_do, c.loai_cau, c.noi_dung, null, c.anh_de, c.lua_chon, c.menh_de, c.dap_an, c.nguon, c.created_at
    from khtn_cau_hoi c join khtn_ban_do b on b.ma_dang = c.dang_chinh where c.xoa_at is null and c.loi_giai is null and c.anh_dap_an is null
    union all
    select 'hgt', c.ma_cau, c.ma_cau, b.khoi, b.ten_dang, b.ma_dang, b.ten_chuyen_de, b.muc_do, c.loai_cau, c.noi_dung, null, c.anh_de, c.lua_chon, c.menh_de, c.dap_an, c.nguon, c.created_at
    from hgt_cau_hoi c join hgt_ban_do b on b.ma_dang = c.dang_chinh where c.xoa_at is null and c.loi_giai is null and c.anh_dap_an is null
    union all
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

-- ═══════════ 5. Pool + đếm ═══════════
create or replace function public.fn_giaibai_pool(p_nhanh text[], p_khoi text, p_limit int default 500)
returns setof public.v_giaibai_bai
language sql stable as $$
  select * from public.v_giaibai_bai
  where nhanh = any(p_nhanh) and (p_khoi is null or khoi = p_khoi) and yc_id is null
  order by nhanh, nhom_ma, ma limit p_limit
$$;
grant execute on function public.fn_giaibai_pool(text[], text, int) to authenticated;

create or replace function public.fn_giaibai_dem_pool(p_nhanh text[])
returns table (khoi text, so_bai bigint)
language sql stable as $$
  select khoi, count(*) from public.v_giaibai_bai where nhanh = any(p_nhanh) and yc_id is null group by khoi
$$;
grant execute on function public.fn_giaibai_dem_pool(text[]) to authenticated;

-- ═══════════ 6. Nhận / trả / lưu nháp / nộp ═══════════
-- Đóng dòng quá hạn còn mở của 1 bài (để index unique cho phép người mới nhận).
create or replace function public.fn_giaibai_dong_qua_han(p_nhanh text, p_key text) returns void
language plpgsql as $$
declare r record := public.fn_giaibai_tbl(p_nhanh);
begin
  if r.yc is null then raise exception 'fn_giaibai_dong_qua_han: nhánh không hợp lệ %', p_nhanh; end if;
  execute format('update %I set xu_ly_at = now(), trang_thai = ''qua_han'' where %I = %s and xu_ly_at is null and trang_thai in (''dang_giai'',''can_sua'') and han_at < now()', r.yc, r.key_col, r.key_cast) using p_key;
end $$;

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
  execute format('insert into %I (%I, nguoi_yeu_cau, nguoi_giai, trang_thai, han_at) values (%s, $2, $2, ''dang_giai'', now() + interval ''48 hours'') returning id', r.yc, r.key_col, r.key_cast)
    into v_id using p_key, p_me;
  return v_id;
end $$;
grant execute on function public.fn_giaibai_nhan(text, text, uuid) to authenticated;

create or replace function public.fn_giaibai_tra(p_nhanh text, p_id uuid, p_me uuid) returns void
language plpgsql as $$
declare r record := public.fn_giaibai_tbl(p_nhanh);
begin
  if r.yc is null then raise exception 'fn_giaibai_tra: nhánh không hợp lệ %', p_nhanh; end if;
  execute format('update %I set xu_ly_at = now(), trang_thai = ''da_tra'' where id = $1 and nguoi_giai = $2 and xu_ly_at is null and trang_thai in (''dang_giai'',''can_sua'')', r.yc) using p_id, p_me;
  if not found then raise exception 'Không trả được — bài không còn ở trạng thái đang giải của bạn.'; end if;
end $$;
grant execute on function public.fn_giaibai_tra(text, uuid, uuid) to authenticated;

-- Lưu nháp: chỉ chủ bài, đang giải/cần sửa, chưa quá hạn.
create or replace function public.fn_giaibai_luu_nhap(p_nhanh text, p_id uuid, p_me uuid, p_loi_giai text, p_anh text, p_dap_an text) returns void
language plpgsql as $$
declare r record := public.fn_giaibai_tbl(p_nhanh);
begin
  if r.yc is null then raise exception 'fn_giaibai_luu_nhap: nhánh không hợp lệ %', p_nhanh; end if;
  execute format('update %I set loi_giai_nhap = nullif($3, ''''), anh_nhap = nullif($4, ''''), dap_an_nhap = nullif($5, ''''), cap_nhat_at = now()
                  where id = $1 and nguoi_giai = $2 and xu_ly_at is null and trang_thai in (''dang_giai'',''can_sua'') and (han_at is null or han_at >= now())', r.yc)
    using p_id, p_me, p_loi_giai, p_anh, p_dap_an;
  if not found then raise exception 'Không lưu được — bài đã quá hạn, đã nộp hoặc không phải của bạn.'; end if;
end $$;
grant execute on function public.fn_giaibai_luu_nhap(text, uuid, uuid, text, text, text) to authenticated;

-- Nộp: cần text HOẶC ảnh; nop_at giữ mốc nộp ĐẦU (đo "mất bao lâu" = nop_at - created_at), nộp lại sau khi sửa không đổi mốc.
create or replace function public.fn_giaibai_nop(p_nhanh text, p_id uuid, p_me uuid, p_loi_giai text, p_anh text, p_dap_an text) returns void
language plpgsql as $$
declare r record := public.fn_giaibai_tbl(p_nhanh);
begin
  if r.yc is null then raise exception 'fn_giaibai_nop: nhánh không hợp lệ %', p_nhanh; end if;
  if nullif(p_loi_giai, '') is null and nullif(p_anh, '') is null then raise exception 'Cần lời giải text hoặc ảnh lời giải.'; end if;
  execute format('update %I set loi_giai_nhap = nullif($3, ''''), anh_nhap = nullif($4, ''''), dap_an_nhap = nullif($5, ''''), cap_nhat_at = now(),
                    trang_thai = ''cho_duyet'', nop_at = coalesce(nop_at, now()), han_at = null
                  where id = $1 and nguoi_giai = $2 and xu_ly_at is null and trang_thai in (''dang_giai'',''can_sua'') and (han_at is null or han_at >= now())', r.yc)
    using p_id, p_me, p_loi_giai, p_anh, p_dap_an;
  if not found then raise exception 'Không nộp được — bài đã quá hạn, đã nộp hoặc không phải của bạn.'; end if;
end $$;
grant execute on function public.fn_giaibai_nop(text, uuid, uuid, text, text, text) to authenticated;

create or replace function public.fn_giaibai_cua_toi(p_me uuid)
returns setof public.v_giaibai_nhan
language sql stable as $$
  select * from public.v_giaibai_nhan where nguoi_giai = p_me
  order by case trang_thai when 'can_sua' then 0 when 'dang_giai' then 1 when 'cho_duyet' then 2 else 3 end, coalesce(xu_ly_at, created_at) desc
$$;
grant execute on function public.fn_giaibai_cua_toi(uuid) to authenticated;

-- ═══════════ 7. Duyệt / từ chối (ghế học thuật đúng môn, hoặc admin hệ thống) ═══════════
create or replace function public.fn_giaibai_la_nguoi_duyet(p_me uuid, p_nhanh text) returns boolean
language sql stable as $$
  select exists (select 1 from nhan_su where id = p_me and la_admin_he_thong)
      or exists (select 1 from vi_tri v join team t on t.id = v.team_id
                 where t.ma = 'hoc_thuat' and v.nhan_su_id = p_me and v.mon = public.fn_giaibai_mon(p_nhanh))
$$;
grant execute on function public.fn_giaibai_la_nguoi_duyet(uuid, text) to authenticated;

create or replace function public.fn_giaibai_cho_duyet(p_nhanh text[])
returns setof public.v_giaibai_nhan
language sql stable as $$
  select * from public.v_giaibai_nhan where nhanh = any(p_nhanh) and xu_ly_at is null and trang_thai = 'cho_duyet' order by nop_at
$$;
grant execute on function public.fn_giaibai_cho_duyet(text[]) to authenticated;

-- Duyệt = LÚC NÀY mới ghi vào kho (câu: loi_giai/anh_dap_an/dap_an nếu trống; Hình: qua fn_hinh_ghi_loi_giai) với
-- nguon_giai='nguoi', giai_method='ta', da_duyet=true. Câu đã có lời giải trong lúc chờ → từ chối ghi (không ghi đè).
create or replace function public.fn_giaibai_duyet(p_nhanh text, p_id uuid, p_me uuid) returns void
language plpgsql as $$
declare r record := public.fn_giaibai_tbl(p_nhanh); t text; v_key text; v_nguoi uuid; v_lg text; v_anh text; v_da text; n int;
begin
  if r.yc is null then raise exception 'fn_giaibai_duyet: nhánh không hợp lệ %', p_nhanh; end if;
  if not public.fn_giaibai_la_nguoi_duyet(p_me, p_nhanh) then raise exception 'Chỉ team học thuật môn % mới duyệt được.', public.fn_giaibai_mon(p_nhanh); end if;
  execute format('select %I::text, nguoi_giai, loi_giai_nhap, anh_nhap, dap_an_nhap from %I where id = $1 and xu_ly_at is null and trang_thai = ''cho_duyet'' for update', r.key_col, r.yc)
    into v_key, v_nguoi, v_lg, v_anh, v_da using p_id;
  if not found then raise exception 'Bài không ở trạng thái chờ duyệt.'; end if;
  if v_nguoi = p_me then raise exception 'Không tự duyệt bài mình giải.'; end if;
  if p_nhanh in ('toan','khtn','hgt') then
    t := public.fn_kho_tbl(p_nhanh) || '_cau_hoi';
    execute format('update %I set loi_giai = $2, anh_dap_an = $3, dap_an = coalesce(dap_an, $4), nguon_giai = ''nguoi'', giai_method = ''ta'', da_duyet = true, duyet_boi = $5, duyet_at = now()
                    where ma_cau = $1 and xoa_at is null and loi_giai is null and anh_dap_an is null', t)
      using v_key, v_lg, v_anh, v_da, p_me;
    get diagnostics n = row_count;
    if n = 0 then raise exception 'Câu % đã có lời giải trong lúc chờ — không ghi đè. Từ chối bài này hoặc trả bài.', v_key; end if;
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
  execute format('update %I set xu_ly_at = now(), trang_thai = ''da_duyet'', duyet_boi = $2, duyet_at = now() where id = $1', r.yc) using p_id, p_me;
end $$;
grant execute on function public.fn_giaibai_duyet(text, uuid, uuid) to authenticated;

create or replace function public.fn_giaibai_tu_choi(p_nhanh text, p_id uuid, p_me uuid, p_ly_do text) returns void
language plpgsql as $$
declare r record := public.fn_giaibai_tbl(p_nhanh); v_lan int;
begin
  if r.yc is null then raise exception 'fn_giaibai_tu_choi: nhánh không hợp lệ %', p_nhanh; end if;
  if not public.fn_giaibai_la_nguoi_duyet(p_me, p_nhanh) then raise exception 'Chỉ team học thuật môn % mới duyệt được.', public.fn_giaibai_mon(p_nhanh); end if;
  if nullif(p_ly_do, '') is null then raise exception 'Từ chối phải ghi lý do.'; end if;
  execute format('update %I set tu_choi_lan = tu_choi_lan + 1, ly_do_tu_choi = $2, tu_choi_at = now(), duyet_boi = $3
                  where id = $1 and xu_ly_at is null and trang_thai = ''cho_duyet'' returning tu_choi_lan', r.yc) into v_lan using p_id, p_ly_do, p_me;
  if v_lan is null then raise exception 'Bài không ở trạng thái chờ duyệt.'; end if;
  if v_lan >= 3 then
    execute format('update %I set xu_ly_at = now(), trang_thai = ''tu_choi_3'' where id = $1', r.yc) using p_id;
  else
    execute format('update %I set trang_thai = ''can_sua'', han_at = now() + interval ''48 hours'' where id = $1', r.yc) using p_id;
  end if;
end $$;
grant execute on function public.fn_giaibai_tu_choi(text, uuid, uuid, text) to authenticated;

-- ═══════════ 8. Báo cáo (bài ĐÃ DUYỆT trong khoảng, theo duyet_at) — Thùy tự tính tiền từ đây ═══════════
create or replace function public.fn_giaibai_bao_cao_chi_tiet(p_tu date, p_den date)
returns setof public.v_giaibai_nhan
language sql stable as $$
  select * from public.v_giaibai_nhan
  where trang_thai = 'da_duyet' and nguoi_giai is not null
    and duyet_at >= (p_tu::timestamp at time zone 'Asia/Ho_Chi_Minh') and duyet_at < ((p_den + 1)::timestamp at time zone 'Asia/Ho_Chi_Minh')
  order by nguoi_giai_ten, duyet_at
$$;
grant execute on function public.fn_giaibai_bao_cao_chi_tiet(date, date) to authenticated;

create or replace function public.fn_giaibai_bao_cao_tong(p_tu date, p_den date)
returns table (nguoi_giai uuid, ho_ten text, so_bai bigint, md1 bigint, md2 bigint, md3 bigint, md4 bigint, md5 bigint, md_khac bigint, tong_ky_tu bigint, tong_cong_thuc bigint, tb_giay_giai int)
language sql stable as $$
  select nguoi_giai, nguoi_giai_ten, count(*),
         count(*) filter (where muc_do = 1), count(*) filter (where muc_do = 2), count(*) filter (where muc_do = 3),
         count(*) filter (where muc_do = 4), count(*) filter (where muc_do = 5), count(*) filter (where muc_do is null or muc_do not between 1 and 5),
         sum(so_ky_tu), sum(so_cong_thuc), avg(giay_giai)::int
  from public.fn_giaibai_bao_cao_chi_tiet(p_tu, p_den)
  group by nguoi_giai, nguoi_giai_ten
  order by count(*) desc, sum(so_ky_tu) desc
$$;
grant execute on function public.fn_giaibai_bao_cao_tong(date, date) to authenticated;

-- ═══════════ 9. Vá fn cũ để KHÔNG giẫm lên bài người đang giữ ═══════════
-- 9a. ERP tab "Chưa có lời giải": trả thêm người đang giữ (để hiện "🧑 X đang giải" thay vì "Đã đặt Claude").
drop function if exists public.fn_kho_cau_chua_giai(text, text, int);
create or replace function public.fn_kho_cau_chua_giai(p_mon text, p_khoi text, p_limit int default 500)
returns table (
  ma_cau text, dang_chinh text, ten_dang text, ten_chuyen_de text, khoi text, loai_cau text,
  noi_dung text, lua_chon jsonb, menh_de jsonb, dap_an text, anh_de text, nguon text, created_at timestamptz,
  yeu_cau_id uuid, yeu_cau_at timestamptz, yeu_cau_ghi_chu text, yeu_cau_nguoi_giai uuid, yeu_cau_nguoi_giai_ten text, yeu_cau_trang_thai text
)
language plpgsql stable as $$
declare t text := public.fn_kho_tbl(p_mon);
begin
  if t is null then raise exception 'fn_kho_cau_chua_giai: môn không hợp lệ %', p_mon; end if;
  return query execute format($q$
    select c.ma_cau, c.dang_chinh, b.ten_dang, b.ten_chuyen_de, b.khoi, c.loai_cau,
           c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.anh_de, c.nguon, c.created_at,
           y.id, y.created_at, y.ghi_chu, y.nguoi_giai, ns.ho_ten, y.trang_thai
    from %1$I c
    join %2$I b on b.ma_dang = c.dang_chinh
    left join %3$I y on y.ma_cau = c.ma_cau and public.fn_giaibai_dang_giu(y.trang_thai, y.han_at, y.xu_ly_at)
    left join nhan_su ns on ns.id = y.nguoi_giai
    where c.xoa_at is null and c.loi_giai is null and c.anh_dap_an is null and b.khoi = $1
    order by c.dang_chinh, c.ma_cau
    limit $2
  $q$, t || '_cau_hoi', t || '_ban_do', t || '_cau_hoi_yeu_cau_giai') using p_khoi, p_limit;
end $$;
grant execute on function public.fn_kho_cau_chua_giai(text, text, int) to authenticated;

-- 9b. v_hinh_chua_giai: thêm 3 cột cuối (create or replace view chỉ cho phép NỐI cột) + chỉ coi là "giữ" khi chưa quá hạn.
create or replace view public.v_hinh_chua_giai as
  select 'baitoan'::text as loai, b.id, b.ma, m.khoi, m.ma as mo_hinh_ma, m.ten as mo_hinh_ten,
         concat_ws(E'\n', m.gia_thiet, m.gia_thiet_them, b.gia_thiet_phu, b.gia_thiet_rieng) as gia_thiet,
         b.phat_bieu as de_bai, coalesce(b.anh_chuan, m.anh_cau_hinh) as anh, null::text as kieu, b.created_at,
         y.id as yeu_cau_id, y.created_at as yeu_cau_at, y.ghi_chu as yeu_cau_ghi_chu,
         y.nguoi_giai as yeu_cau_nguoi_giai, ns.ho_ten as yeu_cau_nguoi_giai_ten, y.trang_thai as yeu_cau_trang_thai
  from hinh_baitoan b
  join hinh_mo_hinh m on m.id = b.mo_hinh_id
  left join hinh_baitoan_yeu_cau_giai y on y.baitoan_id = b.id and public.fn_giaibai_dang_giu(y.trang_thai, y.han_at, y.xu_ly_at)
  left join nhan_su ns on ns.id = y.nguoi_giai
  where not exists (select 1 from hinh_cach_giai cg where cg.baitoan_id = b.id and (cg.loi_giai is not null or cg.anh_loi_giai is not null))
  union all
  select 'bien_the', v.id, b.ma || ' · BT' || v.thu_tu, m.khoi, m.ma, m.ten,
         concat_ws(E'\n', m.gia_thiet, m.gia_thiet_them, b.gia_thiet_phu, b.gia_thiet_rieng),
         v.de_bai, coalesce(v.anh, b.anh_chuan, m.anh_cau_hinh), v.kieu, v.created_at,
         y.id, y.created_at, y.ghi_chu, y.nguoi_giai, ns.ho_ten, y.trang_thai
  from hinh_baitoan_bien_the v
  join hinh_baitoan b on b.id = v.baitoan_id
  join hinh_mo_hinh m on m.id = b.mo_hinh_id
  left join hinh_bien_the_yeu_cau_giai y on y.bien_the_id = v.id and public.fn_giaibai_dang_giu(y.trang_thai, y.han_at, y.xu_ly_at)
  left join nhan_su ns on ns.id = y.nguoi_giai
  where v.loi_giai is null and v.anh_loi_giai is null;

-- 9c. Worker Claude chỉ nhặt dòng CỦA CLAUDE (nguoi_giai null).
drop function if exists public.fn_kho_yeu_cau_giai_cho(text);
create or replace function public.fn_kho_yeu_cau_giai_cho(p_mon text)
returns table (
  yeu_cau_id uuid, yeu_cau_at timestamptz, ghi_chu text, ma_cau text, dang_chinh text, ten_dang text,
  khoi text, loai_cau text, noi_dung text, lua_chon jsonb, menh_de jsonb, dap_an text, anh_de text, ma_cum text,
  da_co_loi_giai boolean
)
language plpgsql stable as $$
declare t text := public.fn_kho_tbl(p_mon);
begin
  if t is null then raise exception 'fn_kho_yeu_cau_giai_cho: môn không hợp lệ %', p_mon; end if;
  return query execute format($q$
    select y.id, y.created_at, y.ghi_chu, c.ma_cau, c.dang_chinh, b.ten_dang, b.khoi, c.loai_cau,
           c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.anh_de, c.ma_cum,
           (c.loi_giai is not null or c.anh_dap_an is not null)
    from %3$I y
    join %1$I c on c.ma_cau = y.ma_cau
    join %2$I b on b.ma_dang = c.dang_chinh
    where y.xu_ly_at is null and y.nguoi_giai is null
    order by y.created_at
  $q$, t || '_cau_hoi', t || '_ban_do', t || '_cau_hoi_yeu_cau_giai');
end $$;
grant execute on function public.fn_kho_yeu_cau_giai_cho(text) to authenticated;

create or replace function public.fn_hinh_yeu_cau_giai_cho()
returns table (
  yeu_cau_id uuid, yeu_cau_at timestamptz, ghi_chu text, loai text, id uuid, ma text, khoi text,
  mo_hinh_ma text, mo_hinh_ten text, gia_thiet text, de_bai text, anh text, kieu text,
  da_co_loi_giai boolean, mau_loi_giai text, mau_anh text
)
language sql stable as $$
  select y.id, y.created_at, y.ghi_chu, 'baitoan', b.id, b.ma, m.khoi, m.ma, m.ten,
         concat_ws(E'\n', m.gia_thiet, m.gia_thiet_them, b.gia_thiet_phu, b.gia_thiet_rieng), b.phat_bieu,
         coalesce(b.anh_chuan, m.anh_cau_hinh), null::text,
         exists (select 1 from hinh_cach_giai cg where cg.baitoan_id = b.id and (cg.loi_giai is not null or cg.anh_loi_giai is not null)),
         null::text, null::text
  from hinh_baitoan_yeu_cau_giai y
  join hinh_baitoan b on b.id = y.baitoan_id
  join hinh_mo_hinh m on m.id = b.mo_hinh_id
  where y.xu_ly_at is null and y.nguoi_giai is null
  union all
  select y.id, y.created_at, y.ghi_chu, 'bien_the', v.id, b.ma || ' · BT' || v.thu_tu, m.khoi, m.ma, m.ten,
         concat_ws(E'\n', m.gia_thiet, m.gia_thiet_them, b.gia_thiet_phu, b.gia_thiet_rieng), v.de_bai,
         coalesce(v.anh, b.anh_chuan, m.anh_cau_hinh), v.kieu,
         (v.loi_giai is not null or v.anh_loi_giai is not null),
         cg.loi_giai, cg.anh_loi_giai
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

-- 9d. Đặt Claude / người tự giải ở ERP: bài đang có NGƯỜI giữ (chưa quá hạn) → chặn rõ, không xoá dòng của người.
create or replace function public.fn_kho_dat_giai(p_mon text, p_ma_cau text[], p_ghi_chu text, p_nguoi uuid)
returns int
language plpgsql as $$
declare t text := public.fn_kho_tbl(p_mon); n int; k text;
begin
  if t is null then raise exception 'fn_kho_dat_giai: môn không hợp lệ %', p_mon; end if;
  foreach k in array p_ma_cau loop perform public.fn_giaibai_dong_qua_han(p_mon, k); end loop;
  execute format($q$
    insert into %2$I (ma_cau, ghi_chu, nguoi_yeu_cau)
    select c.ma_cau, nullif($2, ''), $3
    from %1$I c
    where c.ma_cau = any($1) and c.xoa_at is null and c.loi_giai is null and c.anh_dap_an is null
      and not exists (select 1 from %2$I y where y.ma_cau = c.ma_cau and y.xu_ly_at is null)
  $q$, t || '_cau_hoi', t || '_cau_hoi_yeu_cau_giai') using p_ma_cau, p_ghi_chu, p_nguoi;
  get diagnostics n = row_count;
  return n;
end $$;

create or replace function public.fn_kho_giai_nguoi_xong(p_mon text, p_ma_cau text)
returns void
language plpgsql as $$
declare t text := public.fn_kho_tbl(p_mon); ok boolean; v_ten text;
begin
  if t is null then raise exception 'fn_kho_giai_nguoi_xong: môn không hợp lệ %', p_mon; end if;
  execute format('select ns.ho_ten from %I y join nhan_su ns on ns.id = y.nguoi_giai where y.ma_cau = $1 and public.fn_giaibai_dang_giu(y.trang_thai, y.han_at, y.xu_ly_at) limit 1', t || '_cau_hoi_yeu_cau_giai') into v_ten using p_ma_cau;
  if v_ten is not null then raise exception '% đang giữ câu này trên tool giải bài — không ghi đè.', v_ten; end if;
  execute format('select (loi_giai is not null or anh_dap_an is not null) from %I where ma_cau = $1', t || '_cau_hoi')
    into ok using p_ma_cau;
  if ok is distinct from true then raise exception 'Câu % chưa có lời giải/ảnh lời giải — chưa thể đóng.', p_ma_cau; end if;
  execute format('update %I set nguon_giai = ''nguoi'', giai_method = null where ma_cau = $1', t || '_cau_hoi') using p_ma_cau;
  execute format('delete from %I where ma_cau = $1 and xu_ly_at is null and nguoi_giai is null', t || '_cau_hoi_yeu_cau_giai') using p_ma_cau;
end $$;

create or replace function public.fn_hinh_dat_giai(p_loai text, p_ids uuid[], p_ghi_chu text, p_nguoi uuid)
returns int
language plpgsql as $$
declare n int; k uuid;
begin
  if p_loai not in ('baitoan','bien_the') then raise exception 'fn_hinh_dat_giai: loai không hợp lệ %', p_loai; end if;
  foreach k in array p_ids loop perform public.fn_giaibai_dong_qua_han('hinh_' || p_loai, k::text); end loop;
  if p_loai = 'baitoan' then
    insert into hinh_baitoan_yeu_cau_giai (baitoan_id, ghi_chu, nguoi_yeu_cau)
    select h.id, nullif(p_ghi_chu, ''), p_nguoi from public.v_hinh_chua_giai h
    where h.loai = 'baitoan' and h.id = any(p_ids) and h.yeu_cau_id is null
      and not exists (select 1 from hinh_baitoan_yeu_cau_giai y where y.baitoan_id = h.id and y.xu_ly_at is null);
  else
    insert into hinh_bien_the_yeu_cau_giai (bien_the_id, ghi_chu, nguoi_yeu_cau)
    select h.id, nullif(p_ghi_chu, ''), p_nguoi from public.v_hinh_chua_giai h
    where h.loai = 'bien_the' and h.id = any(p_ids) and h.yeu_cau_id is null
      and not exists (select 1 from hinh_bien_the_yeu_cau_giai y where y.bien_the_id = h.id and y.xu_ly_at is null);
  end if;
  get diagnostics n = row_count;
  return n;
end $$;

create or replace function public.fn_hinh_ghi_loi_giai(p_loai text, p_id uuid, p_loi_giai text, p_anh text, p_nguon text)
returns void
language plpgsql as $$
declare v_cg uuid; v_method text; v_duyet boolean; v_ten text;
begin
  if nullif(p_loi_giai, '') is null and nullif(p_anh, '') is null then
    raise exception 'Cần lời giải text hoặc ảnh lời giải.';
  end if;
  if p_nguon not in ('nguoi', 'ai') then raise exception 'fn_hinh_ghi_loi_giai: nguon không hợp lệ %', p_nguon; end if;
  v_method := case when p_nguon = 'ai' then 'claude_code' else null end;
  v_duyet := false;
  -- người khác đang giữ bài trên tool giải bài → chặn (cả 2 đường: người ở ERP lẫn Claude)
  if p_loai = 'baitoan' then
    select ns.ho_ten into v_ten from hinh_baitoan_yeu_cau_giai y join nhan_su ns on ns.id = y.nguoi_giai
      where y.baitoan_id = p_id and public.fn_giaibai_dang_giu(y.trang_thai, y.han_at, y.xu_ly_at) limit 1;
  else
    select ns.ho_ten into v_ten from hinh_bien_the_yeu_cau_giai y join nhan_su ns on ns.id = y.nguoi_giai
      where y.bien_the_id = p_id and public.fn_giaibai_dang_giu(y.trang_thai, y.han_at, y.xu_ly_at) limit 1;
  end if;
  if v_ten is not null then raise exception '% đang giữ bài này trên tool giải bài — không ghi đè.', v_ten; end if;
  if p_loai = 'baitoan' then
    if not exists (select 1 from hinh_baitoan where id = p_id) then raise exception 'Không thấy bài toán %', p_id; end if;
    if exists (select 1 from hinh_cach_giai where baitoan_id = p_id and (loi_giai is not null or anh_loi_giai is not null)) then
      raise exception 'Bài toán % đã có cách giải có nội dung — không ghi đè.', p_id;
    end if;
    select id into v_cg from hinh_cach_giai where baitoan_id = p_id order by la_mac_dinh desc, thu_tu limit 1;
    if v_cg is not null then
      update hinh_cach_giai set loi_giai = nullif(p_loi_giai, ''), anh_loi_giai = nullif(p_anh, ''),
        nguon_giai = p_nguon, giai_method = v_method, da_duyet = v_duyet, updated_at = now() where id = v_cg;
    else
      insert into hinh_cach_giai (baitoan_id, dang_id, loi_giai, anh_loi_giai, la_mac_dinh, thu_tu, nguon_giai, giai_method, da_duyet)
      values (p_id, null, nullif(p_loi_giai, ''), nullif(p_anh, ''), true, 0, p_nguon, v_method, v_duyet);
    end if;
    update hinh_baitoan set updated_at = now() where id = p_id;
    if p_nguon = 'nguoi' then delete from hinh_baitoan_yeu_cau_giai where baitoan_id = p_id and xu_ly_at is null and nguoi_giai is null;
    else update hinh_baitoan_yeu_cau_giai set xu_ly_at = now() where baitoan_id = p_id and xu_ly_at is null and nguoi_giai is null; end if;
  elsif p_loai = 'bien_the' then
    update hinh_baitoan_bien_the
      set loi_giai = nullif(p_loi_giai, ''), anh_loi_giai = nullif(p_anh, ''), nguon_giai = p_nguon, giai_method = v_method, da_duyet = v_duyet, updated_at = now()
      where id = p_id and loi_giai is null and anh_loi_giai is null;
    if not found then raise exception 'Biến thể % không tồn tại hoặc đã có lời giải — không ghi đè.', p_id; end if;
    if p_nguon = 'nguoi' then delete from hinh_bien_the_yeu_cau_giai where bien_the_id = p_id and xu_ly_at is null and nguoi_giai is null;
    else update hinh_bien_the_yeu_cau_giai set xu_ly_at = now() where bien_the_id = p_id and xu_ly_at is null and nguoi_giai is null; end if;
  else
    raise exception 'fn_hinh_ghi_loi_giai: loai không hợp lệ %', p_loai;
  end if;
end $$;
