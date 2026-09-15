-- ============================================================================
-- 202609080938 — kho_duyet_hop_nhat
-- ----------------------------------------------------------------------------
-- VÌ SAO (spec-kho-chuan.md §3 + §4 bước 3 — "màn duyệt = bước CHUẨN HOÁ, một hàng đợi, nhiều bộ lọc"):
--   Sau bước 1–2, "hàng duyệt lại" = câu máy NGHI đáp số (17 câu, đã rời kho chuẩn) ∪ không kiểm được, cộng hàng cũ của màn
--   "Duyệt lời giải AI" (lời giải Claude mới · tồn đọng) và CÂU MỚI sau NGÀY BẬT (cửa 1 chặn khỏi HS tới khi duyệt). Tất cả
--   là cùng một trạng thái — dòng thật trong bảng câu, `da_duyet=false` — nên 1 hàm liệt kê với tham số bộ lọc, 1 hàm đếm,
--   1 RPC duyệt (sửa tại chỗ + ký, cùng transaction) và 1 RPC từ chối (kho rác). Client chỉ gọi rpc + render (CLAUDE.md §2.0).
--   `dang_ai_de_xuat` = dạng AI gán lúc câu vào kho (đường nhập kho/file/clone sẽ ghi ở bước 5); người chốt = `dang_chinh`
--   ⇒ precision gán dạng đo được bằng query, không cần log riêng (memory: kho-ingest-ai-accuracy-metric).
--   NGÀY BẬT gom về 1 hàm `_kho_ngay_bat()`; `_kho_cau_chuan` viết lại gọi nó (thân hàm đổi nhưng KẾT QUẢ y hệt ⇒ cột generated
--   `kho_chuan` không cần tính lại).
--   Duyệt 1 câu (fn_kho_duyet_cau): áp sửa đề/đáp số/lời giải/dạng/cụm (cụm phải thuộc dạng; đổi dạng mà cụm không thuộc dạng
--   mới ⇒ cụm về null) + da_duyet=true, duyet_nguon='nguoi'. Sửa ĐÁP SỐ ⇒ thu hồi MỌI form trắc nghiệm của câu (xoa_at, kể cả
--   form đã duyệt — phương án đúng đã sai) để sinh lại. Câu đang nghi/không kiểm được/chưa kiểm ⇒ kiem_may='khop' bởi 'nguoi'
--   (người xác nhận là nhân chứng cuối); câu máy/AI đã ký khớp mà người KHÔNG đổi đáp số ⇒ giữ nguyên kết quả máy (để đo
--   precision mẫu 2% ở mức C). Không có "duyệt tất cả" cho hàng nghi — client không có nút, DB cũng không có hàm lô.
--
-- MẤT GÌ: không — thêm cột/hàm; `_kho_cau_chuan` thay thân hàm tương đương.
-- ============================================================================

-- ── 0) NGÀY BẬT 1 chỗ ───────────────────────────────────────────────────────────────────────────────────────
create or replace function public._kho_ngay_bat() returns timestamptz
language sql immutable as $$ select '2026-09-08 09:12:00+07'::timestamptz $$;
comment on function public._kho_ngay_bat() is 'NGÀY BẬT cửa 1 kho chuẩn (mig 202609080912): câu created_at ≥ mốc này phải da_duyet mới được dùng.';

create or replace function public._kho_cau_chuan(p_da_duyet boolean, p_kiem_may text, p_created_at timestamptz)
returns boolean language sql immutable as $$
  select coalesce(p_da_duyet, false)
      or (p_kiem_may is distinct from 'nghi' and p_created_at < public._kho_ngay_bat())
$$;

-- ── 1) dang_ai_de_xuat ─────────────────────────────────────────────────────────────────────────────────────
do $$
declare t text;
begin
  foreach t in array array['dai_cau_hoi', 'khtn_cau_hoi', 'hgt_cau_hoi'] loop
    execute format('alter table %I add column if not exists dang_ai_de_xuat text', t);
  end loop;
end $$;
comment on column dai_cau_hoi.dang_ai_de_xuat is 'Dạng AI gán lúc câu vào kho (nhập kho/file/clone). Người chốt = dang_chinh ⇒ precision gán dạng = count(dang_ai_de_xuat = dang_chinh)/count(dang_ai_de_xuat is not null).';

-- ── 2) Điều kiện từng bộ lọc — 1 chỗ, dùng cho cả list và đếm (alias bảng câu = c) ────────────────────────
-- cau_moi   : câu MỚI sau NGÀY BẬT chưa duyệt (cửa 1 đang chặn khỏi HS) — mọi đường vào
-- moi       : lời giải Claude mới (giai_method='claude_code') chưa duyệt  — tab cũ "Lời giải mới từ Claude"
-- nghi      : máy/AI NGHI đáp số                                            — đã rời kho chuẩn
-- khong_kiem: máy/AI không kiểm được
-- ton_dong  : backlog cũ nguồn AI (giai_method null) chưa duyệt             — tab cũ "Câu trong kho (tồn đọng)"
create or replace function public._kho_loc_duyet_sql(p_loc text) returns text
language sql immutable as $$
  select case p_loc
    when 'cau_moi'    then 'not c.da_duyet and c.created_at >= public._kho_ngay_bat()'
    when 'moi'        then $s$not c.da_duyet and c.nguon_giai = 'ai' and c.giai_method = 'claude_code'$s$
    when 'nghi'       then $s$c.kiem_may = 'nghi'$s$
    when 'khong_kiem' then $s$c.kiem_may = 'khong_kiem_duoc'$s$
    when 'ton_dong'   then $s$not c.da_duyet and c.nguon_giai = 'ai' and c.giai_method is null$s$
  end
$$;

-- ── 3) Liệt kê hàng duyệt của 1 nhánh kho theo bộ lọc (+ khối tuỳ chọn) ─────────────────────────────────────
create or replace function public.fn_kho_hang_duyet(p_mon text, p_loc text, p_khoi text default null, p_limit integer default 300)
returns table (
  ma_cau text, dang_chinh text, ten_dang text, ten_chuyen_de text, khoi text, loai_cau text,
  noi_dung text, lua_chon jsonb, menh_de jsonb, dap_an text, loi_giai text, anh_de text, anh_dap_an text,
  nguon text, nguon_giai text, giai_method text, created_at timestamptz,
  ma_cum text, ten_cum text, da_duyet boolean, kho_chuan boolean,
  kiem_may text, kiem_may_boi text, kiem_may_ghi text, kiem_may_at timestamptz, dang_ai_de_xuat text)
language plpgsql stable security definer set search_path = public as $$
declare t text := public.fn_kho_tbl(p_mon); v_dk text := public._kho_loc_duyet_sql(p_loc);
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if t is null then raise exception 'fn_kho_hang_duyet: môn không hợp lệ %', p_mon; end if;
  if v_dk is null then raise exception 'fn_kho_hang_duyet: bộ lọc không hợp lệ %', p_loc; end if;
  return query execute format($q$
    select c.ma_cau, c.dang_chinh, b.ten_dang, b.ten_chuyen_de, b.khoi, c.loai_cau,
           c.noi_dung, c.lua_chon, c.menh_de, c.dap_an, c.loi_giai, c.anh_de, c.anh_dap_an,
           c.nguon, c.nguon_giai, c.giai_method, c.created_at,
           c.ma_cum, m.ten, c.da_duyet, c.kho_chuan,
           c.kiem_may, c.kiem_may_boi, c.kiem_may_ghi, c.kiem_may_at, c.dang_ai_de_xuat
    from %1$I c
    join %2$I b on b.ma_dang = c.dang_chinh
    left join %3$I m on m.ma_cum = c.ma_cum
    where c.xoa_at is null and %4$s and ($1::text is null or b.khoi = $1)
    order by b.khoi, c.dang_chinh, c.ma_cau
    limit $2
  $q$, t || '_cau_hoi', t || '_ban_do', t || '_cum_bai', v_dk) using p_khoi, p_limit;
end $$;
grant execute on function public.fn_kho_hang_duyet(text, text, text, integer) to authenticated;

-- ── 4) Đếm hàng duyệt theo (bộ lọc × khối) cho TẬP NHÁNH của môn đang chọn; dòng khoi = null là tổng của bộ lọc ──
create or replace function public.fn_kho_dem_hang_duyet(p_nhanh text[])
returns table (loc text, khoi text, so_cau bigint)
language plpgsql stable security definer set search_path = public as $$
declare v_mon text; t text; v_loc text;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  create temp table if not exists _dem_hd (loc text, khoi text, n bigint) on commit drop;
  delete from _dem_hd;
  foreach v_mon in array p_nhanh loop
    t := public.fn_kho_tbl(v_mon);
    if t is null then continue; end if;   -- 'hinh' không có bảng câu dạng
    foreach v_loc in array array['cau_moi', 'moi', 'nghi', 'khong_kiem', 'ton_dong'] loop
      execute format($q$insert into _dem_hd select %L, b.khoi, count(*) from %I c join %I b on b.ma_dang = c.dang_chinh
                       where c.xoa_at is null and %s group by b.khoi$q$, v_loc, t || '_cau_hoi', t || '_ban_do', public._kho_loc_duyet_sql(v_loc));
    end loop;
  end loop;
  return query
    select d.loc, d.khoi, sum(d.n) from _dem_hd d group by grouping sets ((d.loc, d.khoi), (d.loc)) order by 1, 2 nulls first;
end $$;
grant execute on function public.fn_kho_dem_hang_duyet(text[]) to authenticated;

-- ── 5) DUYỆT 1 câu = áp sửa + ký, cùng transaction. p_sua: {noi_dung?, dap_an?, loi_giai?, dang_chinh?, ma_cum?} —
--       key vắng = giữ nguyên; key có giá trị null/'' = xoá (dap_an/loi_giai/ma_cum). Trả jsonb {thu_hoi_form, doi_dap_an}. ──
create or replace function public.fn_kho_duyet_cau(p_mon text, p_ma_cau text, p_nguoi uuid, p_sua jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  t text := public.fn_kho_tbl(p_mon); v_cau text; v_ban_do text; v_cum_tbl text; v_form text;
  r record; v_dang text; v_cum text; v_dap text; v_lg text; v_de text;
  v_doi_dap boolean; v_doi_dang boolean; v_ok boolean; v_thu_hoi integer := 0;
  v_kiem_may text; v_kiem_boi text; v_kiem_ghi text; v_kiem_at timestamptz;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if t is null then raise exception 'fn_kho_duyet_cau: môn không hợp lệ %', p_mon; end if;
  if p_nguoi is null then raise exception 'Thiếu người duyệt'; end if;
  v_cau := t || '_cau_hoi'; v_ban_do := t || '_ban_do'; v_cum_tbl := t || '_cum_bai'; v_form := public._kho_form_tn_cua(v_cau);

  execute format('select * from %I where ma_cau = $1 and xoa_at is null for update', v_cau) into r using p_ma_cau;
  if r.ma_cau is null then raise exception 'Câu % không tồn tại hoặc đã vào kho rác', p_ma_cau; end if;

  -- Dạng: phải có trong bản đồ của nhánh
  v_dang := coalesce(nullif(trim(p_sua->>'dang_chinh'), ''), r.dang_chinh);
  execute format('select exists (select 1 from %I where ma_dang = $1)', v_ban_do) into v_ok using v_dang;
  if not v_ok then raise exception 'Dạng % không có trong bản đồ %', v_dang, v_ban_do; end if;
  v_doi_dang := v_dang is distinct from r.dang_chinh;

  -- Cụm: key có ⇒ lấy giá trị (null = bỏ cụm); vắng ⇒ giữ. Cụm phải THUỘC dạng đã chốt, không thì về null (cụm nằm gọn trong 1 dạng).
  v_cum := case when p_sua ? 'ma_cum' then nullif(trim(p_sua->>'ma_cum'), '') else r.ma_cum end;
  if v_cum is not null then
    execute format('select exists (select 1 from %I where ma_cum = $1 and ma_dang = $2)', v_cum_tbl) into v_ok using v_cum, v_dang;
    if not v_ok then
      if p_sua ? 'ma_cum' then raise exception 'Cụm % không thuộc dạng %', v_cum, v_dang; end if;
      v_cum := null;   -- cụm cũ theo dạng cũ ⇒ reset
    end if;
  end if;

  v_de  := case when p_sua ? 'noi_dung' then nullif(trim(p_sua->>'noi_dung'), '') else r.noi_dung end;
  if v_de is null then raise exception 'Đề không được trống'; end if;
  v_dap := case when p_sua ? 'dap_an'   then nullif(trim(p_sua->>'dap_an'), '')   else r.dap_an end;
  v_lg  := case when p_sua ? 'loi_giai' then nullif(trim(p_sua->>'loi_giai'), '') else r.loi_giai end;
  v_doi_dap := v_dap is distinct from r.dap_an;

  -- Sửa đáp số ⇒ thu hồi mọi form trắc nghiệm của câu (phương án đúng đã sai) để sinh lại
  if v_doi_dap and v_form is not null then
    execute format($q$update %I set xoa_at = now(), tu_choi_boi = $2,
                      tu_choi_ly_do = 'thu hồi: người sửa đáp số câu khi duyệt (' || $3 || ' → ' || $4 || ')'
                    where ma_cau = $1 and xoa_at is null$q$, v_form)
      using p_ma_cau, p_nguoi, coalesce(r.dap_an, '∅'), coalesce(v_dap, '∅');
    get diagnostics v_thu_hoi = row_count;
  end if;

  -- Kết quả kiểm đáp số: người là nhân chứng cuối khi câu đang nghi/không kiểm/chưa kiểm hoặc người đổi đáp số;
  -- máy/AI đã ký khớp mà người không đổi ⇒ giữ (đo precision mẫu ở mức C).
  if v_doi_dap or r.kiem_may is distinct from 'khop' then
    v_kiem_may := 'khop'; v_kiem_boi := 'nguoi'; v_kiem_at := now();
    v_kiem_ghi := case when v_doi_dap then 'người sửa đáp số: ' || coalesce(r.dap_an, '∅') || ' → ' || coalesce(v_dap, '∅') else 'người xác nhận' end
               || case when r.kiem_may_ghi is not null then ' (trước: ' || r.kiem_may_ghi || ')' else '' end;
  else
    v_kiem_may := r.kiem_may; v_kiem_boi := r.kiem_may_boi; v_kiem_ghi := r.kiem_may_ghi; v_kiem_at := r.kiem_may_at;
  end if;

  execute format($q$update %I set noi_dung = $2, dap_an = $3, loi_giai = $4, dang_chinh = $5, ma_cum = $6,
                    da_duyet = true, duyet_boi = $7, duyet_at = now(), duyet_nguon = 'nguoi',
                    kiem_may = $8, kiem_may_boi = $9, kiem_may_ghi = $10, kiem_may_at = $11
                  where ma_cau = $1$q$, v_cau)
    using p_ma_cau, v_de, v_dap, v_lg, v_dang, v_cum, p_nguoi, v_kiem_may, v_kiem_boi, v_kiem_ghi, v_kiem_at;

  return jsonb_build_object('thu_hoi_form', v_thu_hoi, 'doi_dap_an', v_doi_dap, 'doi_dang', v_doi_dang);
end $$;
grant execute on function public.fn_kho_duyet_cau(text, text, uuid, jsonb) to authenticated;

-- ── 6) TỪ CHỐI = kho rác (xoa_at, trigger log_kho_cau ghi vết) + lý do vào kiem_may_ghi ─────────────────────────
create or replace function public.fn_kho_tu_choi_cau(p_mon text, p_ma_cau text, p_nguoi uuid, p_ly_do text)
returns void language plpgsql security definer set search_path = public as $$
declare t text := public.fn_kho_tbl(p_mon); v_n integer;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if t is null then raise exception 'fn_kho_tu_choi_cau: môn không hợp lệ %', p_mon; end if;
  if p_nguoi is null then raise exception 'Thiếu người từ chối'; end if;
  if coalesce(trim(p_ly_do), '') = '' then raise exception 'Từ chối phải có lý do'; end if;
  execute format($q$update %I set xoa_at = now(),
                    kiem_may_ghi = concat_ws(' · ', 'từ chối: ' || trim($3), kiem_may_ghi)
                  where ma_cau = $1 and xoa_at is null$q$, t || '_cau_hoi') using p_ma_cau, p_nguoi, p_ly_do;
  get diagnostics v_n = row_count;
  if v_n = 0 then raise exception 'Câu % không tồn tại hoặc đã vào kho rác', p_ma_cau; end if;
end $$;
grant execute on function public.fn_kho_tu_choi_cau(text, text, uuid, text) to authenticated;
