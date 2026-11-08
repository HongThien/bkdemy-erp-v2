-- ============================================================================
-- KHO ĐỀ THI — Thùy 20/10:
--  (1) Lọc theo KỲ: Giữa kì I · Cuối kì I · Giữa kì II · Cuối kì II · Khảo sát (thi thử + vào 10 tính là Khảo sát),
--      đề không thuộc nhóm nào = 'khac'. Áp cho cả Đề thi lẫn Đề cương.
--      Kỳ = cau_hinh.deThi.ky nếu người đã đặt tay, không thì SUY từ tên đề (_de_thi_ky_doan) — không ghi dữ liệu.
--  (2) Phân dạng trong đề dùng BẢN ĐỒ MỚI, bỏ bản đồ cũ — cho kho đã có bản đồ mới (Đại 'dai' → nhánh 'toan', HGT 'hgt'):
--      câu thường ⇒ dạng bài (Đại: _bdm_cau_giai = gán câu > gán cụm > đối ứng; HGT: hgt_bdm_gan_cau, bản sao theo gốc)
--      câu Đúng/Sai ⇒ CHỦ ĐỀ ở kho Đ/S (dai_bdm_kho_ds / hgt_bdm_kho_ds, câu gốc) — Thùy 18/10 + 20/10.
--      Kho chưa có bản đồ mới (Hình, Anh…) giữ bản đồ cũ (he = 'cu').
--      fn_de_thi_thieu / fn_de_thi_duyet đọc "chưa có dạng" theo đúng hệ đó; ghi dạng = fn_de_thi_gan_dang_moi.
-- Thay chữ ký fn_de_thi_ds / fn_de_thi_dem (thêm p_ky) ⇒ drop + tạo lại (chỉ hàm, không đụng dữ liệu).
-- ============================================================================

-- ── (1) KỲ ──────────────────────────────────────────────────────────────────
create or replace function public._de_thi_ky_doan(p_ten text) returns text
language sql immutable as $$
  select case
    when s ~ '(giữa|giua)\s+(học\s+|hoc\s+)?(kì|kỳ|ki|ky)\s*(i|1)\M' or s ~ '(giữa|giua)\s+hk\s*(i|1)\M' then 'gk1'
    when s ~ '(giữa|giua)\s+(học\s+|hoc\s+)?(kì|kỳ|ki|ky)\s*(ii|2)\M' or s ~ '(giữa|giua)\s+hk\s*(ii|2)\M' then 'gk2'
    when s ~ '(cuối|cuoi)\s+(học\s+|hoc\s+)?(kì|kỳ|ki|ky)\s*(i|1)\M' or s ~ '(cuối|cuoi)\s+hk\s*(i|1)\M' then 'ck1'
    when s ~ '(cuối|cuoi)\s+(học\s+|hoc\s+)?(kì|kỳ|ki|ky)\s*(ii|2)\M' or s ~ '(cuối|cuoi)\s+hk\s*(ii|2)\M' then 'ck2'
    when s ~ '(khảo|khao)\s+(sát|sat)|thi\s+(thử|thu)|vào\s+(lớp\s+)?10|tuyển\s+sinh' then 'khao_sat'
    else 'khac' end
  from (select lower(coalesce(p_ten, '')) s) x
$$;

-- kỳ đặt tay (cau_hinh.deThi.ky) thắng; giá trị lạ coi như chưa đặt
create or replace function public._de_thi_ky(p_cau_hinh jsonb, p_ten text) returns text
language sql immutable as $$
  select case when p_cau_hinh -> 'deThi' ->> 'ky' in ('gk1', 'ck1', 'gk2', 'ck2', 'khao_sat', 'khac')
              then p_cau_hinh -> 'deThi' ->> 'ky' else public._de_thi_ky_doan(p_ten) end
$$;

drop function if exists public.fn_de_thi_ds(text, text, text, text, integer, timestamptz);
create function public.fn_de_thi_ds(p_mon text, p_khoi text DEFAULT NULL::text, p_tab text DEFAULT 'cho_duyet'::text, p_tim text DEFAULT NULL::text,
                                    p_gioi_han integer DEFAULT 25, p_truoc timestamp with time zone DEFAULT NULL::timestamp with time zone,
                                    p_ky text DEFAULT NULL::text)
 RETURNS TABLE(id uuid, ten text, khoi text, mon text, created_at timestamp with time zone, updated_at timestamp with time zone, duyet_at timestamp with time zone,
               nguon text, nam integer, co_de_goc boolean, so_cau integer, so_chan integer, so_chua_dang integer, so_canh_bao_nhap integer, so_luot integer,
               luot_gan_nhat date, ky text)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  with trang as (
    select t.* from tai_lieu t
     where t.loai = 'de_thi' and t.mon = p_mon and (p_khoi is null or t.khoi = p_khoi)
       and (nullif(btrim(p_tim), '') is null or t.ten ilike '%' || btrim(p_tim) || '%')
       and (p_ky is null or public._de_thi_ky(t.cau_hinh, t.ten) = p_ky)
       and case p_tab
             when 'de_cuong'  then coalesce(t.cau_hinh -> 'deThi' ->> 'kieu', '') = 'de_cuong'
             when 'cho_duyet' then not (coalesce(t.cau_hinh -> 'deThi' ->> 'kieu', '') = 'de_cuong') and t.duyet_at is null
             when 'san_sang'  then not (coalesce(t.cau_hinh -> 'deThi' ->> 'kieu', '') = 'de_cuong') and t.duyet_at is not null
             when 'da_giao'   then not (coalesce(t.cau_hinh -> 'deThi' ->> 'kieu', '') = 'de_cuong') and public._de_thi_da_giao(t.id)
             else true end
       and (p_truoc is null or t.created_at < p_truoc)
     order by t.created_at desc
     limit least(greatest(p_gioi_han, 1), 100)
  )
  select t.id, t.ten, t.khoi, t.mon, t.created_at, t.updated_at, t.duyet_at,
         nullif(t.cau_hinh -> 'deThi' ->> 'nguon', ''), nullif(t.cau_hinh -> 'deThi' ->> 'nam', '')::int,
         coalesce(t.cau_hinh -> 'deThi' ->> 'pdfGocUrl', t.file_url) is not null,
         (th.v ->> 'tong')::int, (th.v ->> 'so_chan')::int, (th.v ->> 'so_chua_dang')::int,
         (select count(*)::int from jsonb_object_keys(case when jsonb_typeof(t.cau_hinh -> 'deThi' -> 'canhBaoCau') = 'object'
                                                          then t.cau_hinh -> 'deThi' -> 'canhBaoCau' else '{}'::jsonb end)),
         -- số lần giao = lượt thi + số buổi đã gán (Giáo trình / BTVN)
         (select count(*)::int from bai_test b where b.nguon_tai_lieu_id = t.id)
           + (select count(*)::int from tai_lieu g where g.nguon_id = t.id and g.lop_id is not null and g.loai in ('giao_trinh_buoi', 'btvn')),
         greatest((select max(b.ngay) from bai_test b where b.nguon_tai_lieu_id = t.id),
                  (select max(g.ngay) from tai_lieu g where g.nguon_id = t.id and g.lop_id is not null and g.loai in ('giao_trinh_buoi', 'btvn'))),
         public._de_thi_ky(t.cau_hinh, t.ten)
    from trang t
    cross join lateral (select public.fn_de_thi_thieu(t.id) v) th
   order by t.created_at desc
$function$;
revoke all on function public.fn_de_thi_ds(text, text, text, text, integer, timestamptz, text) from public;
grant execute on function public.fn_de_thi_ds(text, text, text, text, integer, timestamptz, text) to authenticated;

drop function if exists public.fn_de_thi_dem(text, text);
create function public.fn_de_thi_dem(p_mon text, p_khoi text DEFAULT NULL::text, p_ky text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select jsonb_build_object(
    'cho_duyet', count(*) filter (where not (coalesce(t.cau_hinh -> 'deThi' ->> 'kieu', '') = 'de_cuong') and t.duyet_at is null),
    'san_sang',  count(*) filter (where not (coalesce(t.cau_hinh -> 'deThi' ->> 'kieu', '') = 'de_cuong') and t.duyet_at is not null),
    'da_giao',   count(*) filter (where not (coalesce(t.cau_hinh -> 'deThi' ->> 'kieu', '') = 'de_cuong') and public._de_thi_da_giao(t.id)),
    'de_cuong',  count(*) filter (where coalesce(t.cau_hinh -> 'deThi' ->> 'kieu', '') = 'de_cuong'))
  from tai_lieu t
  where t.loai = 'de_thi' and t.mon = p_mon and (p_khoi is null or t.khoi = p_khoi)
    and (p_ky is null or public._de_thi_ky(t.cau_hinh, t.ten) = p_ky)
$function$;
revoke all on function public.fn_de_thi_dem(text, text, text) from public;
grant execute on function public.fn_de_thi_dem(text, text, text) to authenticated;

-- ── (2) DẠNG THEO BẢN ĐỒ MỚI ────────────────────────────────────────────────
-- 1 câu của đề ⇒ hệ bản đồ ('moi' | 'cu') + chỗ của nó ở bản đồ mới (dạng bài, hoặc chủ đề nếu là Đ/S). id NULL = chưa có.
create or replace function public._de_thi_dang_moi(p_kho text, p_ma_cau text)
returns table(he text, loai text, id text, ten text, chu_de_id text, chu_de text)
language plpgsql stable set search_path to 'public' as $$
declare v_loai text; v_goc text; v_dang text; v_id text;
begin
  if p_kho is null or p_kho not in ('dai', 'hgt') then he := 'cu'; return next; return; end if;
  he := 'moi';
  if p_kho = 'dai' then
    select c.loai_cau, coalesce(c.parent_ma_cau, c.ma_cau), c.dang_chinh into v_loai, v_goc, v_dang from dai_cau_hoi c where c.ma_cau = p_ma_cau;
  else
    select c.loai_cau, coalesce(c.parent_ma_cau, c.ma_cau), c.dang_chinh into v_loai, v_goc, v_dang from hgt_cau_hoi c where c.ma_cau = p_ma_cau;
  end if;
  if not found then return next; return; end if;

  if v_loai = 'dung_sai' then
    loai := 'chu_de';
    if p_kho = 'dai' then
      select k.chu_de_id into v_id from dai_bdm_kho_ds k where k.ma_cau in (v_goc, p_ma_cau) order by (k.ma_cau = p_ma_cau) desc limit 1;
    else
      select k.chu_de_id into v_id from hgt_bdm_kho_ds k where k.ma_cau in (v_goc, p_ma_cau) order by (k.ma_cau = p_ma_cau) desc limit 1;
    end if;
    if v_id is not null then
      select cd.id, cd.ten, cd.id, cd.ten into id, ten, chu_de_id, chu_de from dai_bdm_chu_de cd where cd.id = v_id;
    end if;
  else
    loai := 'dang_bai';
    if p_kho = 'dai' then
      -- cùng nguồn với số câu trên bản đồ mới (gán câu > gán cụm > đối ứng ①, bản sao theo gốc)
      if v_dang is not null then
        select g.dang_bai_id into v_id from _bdm_cau_giai(array[v_dang]) g where g.ma_cau = p_ma_cau;
      end if;
      if v_id is null then
        select coalesce((select a.dang_bai_id from dai_bdm_gan_cau a where a.ma_cau = p_ma_cau),
                        (select b.dang_bai_id from dai_bdm_gan_cau b where b.ma_cau = v_goc)) into v_id;
      end if;
    else
      select coalesce((select a.dang_bai_id from hgt_bdm_gan_cau a where a.ma_cau = p_ma_cau),
                      (select b.dang_bai_id from hgt_bdm_gan_cau b where b.ma_cau = v_goc)) into v_id;
    end if;
    if v_id is not null then
      select d.id, d.ten, cd.id, cd.ten into id, ten, chu_de_id, chu_de
        from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
       where d.id = v_id;
    end if;
  end if;
  return next;
end $$;

-- Màn sửa đề: chỗ của từng câu trên bản đồ mới (1 lần cho cả đề).
create or replace function public.fn_de_thi_dang_moi(p_de uuid)
returns table(ma_cau text, kho text, he text, loai text, id text, ten text, chu_de_id text, chu_de text)
language sql stable set search_path to 'public' as $$
  select c.ma_cau, c.kho, m.he, m.loai, m.id, m.ten, m.chu_de_id, m.chu_de
    from public.fn_de_thi_cau(p_de) c cross join lateral public._de_thi_dang_moi(c.kho, c.ma_cau) m
   order by c.stt
$$;
revoke all on function public.fn_de_thi_dang_moi(uuid) from public;
grant execute on function public.fn_de_thi_dang_moi(uuid) to authenticated;

-- Danh sách đích để chọn: dạng bài + chủ đề của 1 khối, đúng nhánh của kho câu (dai → toan, hgt → hgt).
create or replace function public.fn_de_thi_dich_moi(p_khoi text, p_kho text)
returns jsonb language sql stable set search_path to 'public' as $$
  with nh as (select case p_kho when 'dai' then 'toan' when 'hgt' then 'hgt' end v)
  select jsonb_build_object(
    'chu_de', coalesce((select jsonb_agg(jsonb_build_object('id', cd.id, 'ten', cd.ten) order by cd.thu_tu)
                          from dai_bdm_chu_de cd, nh where cd.khoi = p_khoi and cd.nhanh = nh.v), '[]'::jsonb),
    'dang_bai', coalesce((select jsonb_agg(jsonb_build_object('id', d.id, 'ten', d.ten, 'nhom', n.ten, 'chuyen_de', ch.ten,
                                                              'chu_de_id', cd.id, 'chu_de', cd.ten)
                                           order by cd.thu_tu, o.thu_tu, n.thu_tu, d.thu_tu)
                            from dai_bdm_chu_de cd cross join nh
                            join dai_bdm_nhom n on n.chu_de_id = cd.id
                            join dai_bdm_chuyen_de ch on ch.id = n.chuyen_de_id
                            join dai_bdm_dang_bai d on d.nhom_id = n.id
                            left join dai_bdm_o o on o.chu_de_id = n.chu_de_id and o.chuyen_de_id = n.chuyen_de_id
                           where cd.khoi = p_khoi and cd.nhanh = nh.v), '[]'::jsonb))
$$;
revoke all on function public.fn_de_thi_dich_moi(text, text) from public;
grant execute on function public.fn_de_thi_dich_moi(text, text) to authenticated;

-- Ghi chỗ của 1 câu trong đề lên bản đồ mới (người chọn ⇒ nguon 'nguoi'). Câu thường ⇒ *_bdm_gan_cau của CHÍNH câu đó;
-- Đ/S ⇒ *_bdm_kho_ds của câu GỐC. Không xoá đề xuất cũ: hàng duyệt đã tự bỏ câu có dòng gán.
create or replace function public.fn_de_thi_gan_dang_moi(p_de uuid, p_ma_cau text, p_id text)
returns jsonb language plpgsql set search_path to 'public' as $$
declare tl record; v_kho text; v_nhanh text; v_loai text; v_goc text; v jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  select t.cau_hinh, t.nhanh, t.mon into tl from tai_lieu t where t.id = p_de and t.loai = 'de_thi';
  if not found then raise exception 'Không phải đề thi: %', p_de; end if;
  if not exists (select 1 from tai_lieu_phan p join tai_lieu_cau c on c.phan_id = p.id where p.tai_lieu_id = p_de and c.ma_cau = p_ma_cau) then
    raise exception 'Câu % không nằm trong đề này', p_ma_cau;
  end if;
  v_kho := public._de_thi_kho(tl.cau_hinh, tl.nhanh, tl.mon, p_ma_cau);
  v_nhanh := case v_kho when 'dai' then 'toan' when 'hgt' then 'hgt' end;
  if v_nhanh is null then raise exception 'Kho % chưa có bản đồ mới', v_kho; end if;
  execute format('select loai_cau, coalesce(parent_ma_cau, ma_cau) from %I where ma_cau = $1 and xoa_at is null', v_kho || '_cau_hoi')
    into v_loai, v_goc using p_ma_cau;
  if v_goc is null then raise exception 'Câu % không còn trong kho', p_ma_cau; end if;

  if v_loai = 'dung_sai' then
    if not exists (select 1 from dai_bdm_chu_de cd where cd.id = p_id and cd.nhanh = v_nhanh) then
      raise exception 'Câu Đúng/Sai chỉ gắn CHỦ ĐỀ (nhánh %) — % không phải chủ đề hợp lệ', v_nhanh, p_id;
    end if;
    execute format('insert into %I (ma_cau, chu_de_id, nguon) values ($1, $2, ''nguoi'')
                    on conflict (ma_cau) do update set chu_de_id = excluded.chu_de_id, nguon = ''nguoi'', actor = public.jwt_uid(), at = now()',
                   v_kho || '_bdm_kho_ds') using v_goc, p_id;
  else
    if not exists (select 1 from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
                    where d.id = p_id and cd.nhanh = v_nhanh) then
      raise exception 'Dạng bài % không thuộc nhánh % của bản đồ mới', p_id, v_nhanh;
    end if;
    execute format('insert into %I (ma_cau, dang_bai_id, nguon) values ($1, $2, ''nguoi'')
                    on conflict (ma_cau) do update set dang_bai_id = excluded.dang_bai_id, nguon = ''nguoi'', actor = public.jwt_uid(), at = now()',
                   v_kho || '_bdm_gan_cau') using p_ma_cau, p_id;
  end if;
  select to_jsonb(m) into v from public._de_thi_dang_moi(v_kho, p_ma_cau) m;
  return v;
end $$;
revoke all on function public.fn_de_thi_gan_dang_moi(uuid, text, text) from public;
grant execute on function public.fn_de_thi_gan_dang_moi(uuid, text, text) to authenticated;

-- Thiếu dạng theo đúng hệ: kho bản đồ mới ⇒ 'dang_cho' (câu thường chưa có dạng bài) / 'chua_chu_de' (Đ/S chưa có chủ đề);
-- kho bản đồ cũ ⇒ như trước ('dang_cho' · 'md_dang_cho'). Cả 3 chỉ CẢNH BÁO, không chặn duyệt.
create or replace function public.fn_de_thi_thieu(p_de uuid)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  with c as (
    select c.*, m.he, m.id moi_id
      from public.fn_de_thi_cau(p_de) c cross join lateral public._de_thi_dang_moi(c.kho, c.ma_cau) m
  ),
  l as (
    select c.stt, c.ma_cau, c.kho, c.loai_cau, c.phan_tieu_de,
      array_remove(array[
        case when c.xoa then 'cau_da_xoa' end,
        case when not c.xoa and c.he = 'cu' and (c.dang_chinh is null or public._kho_la_dang_cho(c.dang_chinh)) then 'dang_cho'
             when not c.xoa and c.he = 'moi' and c.loai_cau is distinct from 'dung_sai' and c.moi_id is null then 'dang_cho' end,
        case when not c.xoa and c.he = 'moi' and c.loai_cau = 'dung_sai' and c.moi_id is null then 'chua_chu_de' end,
        case when not c.xoa and c.loai_cau = 'trac_nghiem'
                  and (upper(trim(coalesce(c.dap_an, ''))) not in ('A', 'B', 'C', 'D')) then 'thieu_dap_an' end,
        case when not c.xoa and c.loai_cau = 'trac_nghiem'
                  and coalesce(jsonb_array_length(case when jsonb_typeof(c.lua_chon) = 'array' then c.lua_chon end), 0) < 2 then 'thieu_phuong_an' end,
        case when not c.xoa and c.loai_cau = 'tra_loi_ngan' and trim(coalesce(c.dap_an, '')) = '' then 'thieu_dap_an' end,
        case when not c.xoa and c.loai_cau = 'dung_sai'
                  and coalesce(jsonb_array_length(case when jsonb_typeof(c.menh_de) = 'array' then c.menh_de end), 0) < 2 then 'thieu_menh_de' end,
        case when not c.xoa and c.loai_cau = 'dung_sai' and exists (
                  select 1 from jsonb_array_elements(case when jsonb_typeof(c.menh_de) = 'array' then c.menh_de else '[]'::jsonb end) m
                  where upper(left(trim(coalesce(m ->> 'dap_an', '')), 1)) not in ('D', 'S')) then 'md_thieu_dap_an' end,
        case when not c.xoa and c.he = 'cu' and c.loai_cau = 'dung_sai' and exists (
                  select 1 from jsonb_array_elements(case when jsonb_typeof(c.menh_de) = 'array' then c.menh_de else '[]'::jsonb end) m
                  where m ->> 'ma_dang' is null or public._kho_la_dang_cho(m ->> 'ma_dang')) then 'md_dang_cho' end,
        case when not c.xoa and c.loai_cau not in ('trac_nghiem', 'dung_sai', 'tra_loi_ngan') then 'tu_luan_chi_in' end
      ], null) loi
    from c
  ),
  -- CẢNH BÁO (không chặn): chưa có dạng · chưa có chủ đề · tự luận chỉ in. Mọi lỗi khác = CHẶN.
  l2 as (select l.*, cardinality(array_remove(array_remove(array_remove(array_remove(l.loi, 'tu_luan_chi_in'), 'dang_cho'), 'md_dang_cho'), 'chua_chu_de')) > 0 chan from l)
  select jsonb_build_object(
    'tong', (select count(*) from c),
    'so_chan', count(*) filter (where l2.chan),
    'so_canh', count(*) filter (where 'tu_luan_chi_in' = any (l2.loi)),
    'so_chua_dang', count(*) filter (where 'dang_cho' = any (l2.loi) or 'md_dang_cho' = any (l2.loi) or 'chua_chu_de' = any (l2.loi)),
    'cau', coalesce(jsonb_agg(jsonb_build_object(
             'stt', l2.stt, 'ma_cau', l2.ma_cau, 'kho', l2.kho, 'loai_cau', l2.loai_cau, 'phan', l2.phan_tieu_de,
             'loi', to_jsonb(l2.loi), 'chan', l2.chan
           ) order by l2.stt) filter (where cardinality(l2.loi) > 0), '[]'::jsonb))
  from l2
$function$;

-- Duyệt đề: câu vào kho chuẩn khi đã có chỗ — kho bản đồ mới đọc bản đồ mới (dạng bài / chủ đề Đ/S), kho cũ như trước.
create or replace function public.fn_de_thi_duyet(p_de uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v jsonb; r record; nsu uuid := public.current_nhan_su_id(); n int := 0; n_cho int := 0; v_form text; v_md_cho boolean;
        v_he text; v_moi text; v_cho boolean;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if nsu is null then raise exception 'Không xác định được nhân sự duyệt'; end if;
  v := public.fn_de_thi_thieu(p_de);
  if (v ->> 'so_chan')::int > 0 then
    raise exception 'Đề còn % câu thiếu đáp án / phương án — xử lý hết rồi mới duyệt được', v ->> 'so_chan' using errcode = 'check_violation';
  end if;
  for r in select * from public.fn_de_thi_cau(p_de) order by stt loop
    v_md_cho := false;
    if r.loai_cau = 'dung_sai' and to_regclass('public.' || r.kho || '_cau_menh_de') is not null then
      -- mệnh đề đã có dạng thật ⇒ duyệt; mệnh đề dạng chờ ⇒ để nguyên
      execute format('update %I set da_duyet = true, duyet_boi = $2, duyet_at = now(), duyet_nguon = ''nguoi''
                      where ma_cau_cha = $1 and xoa_at is null and not da_duyet and not public._kho_la_dang_cho(dang_chinh)',
                     r.kho || '_cau_menh_de') using r.ma_cau, nsu;
      v_md_cho := exists (select 1 from jsonb_array_elements(case when jsonb_typeof(r.menh_de) = 'array' then r.menh_de else '[]'::jsonb end) m
                           where m ->> 'ma_dang' is null or public._kho_la_dang_cho(m ->> 'ma_dang'));
    end if;
    select m.he, m.id into v_he, v_moi from public._de_thi_dang_moi(r.kho, r.ma_cau) m;
    v_cho := case when v_he = 'moi' then v_moi is null
                  else r.dang_chinh is null or public._kho_la_dang_cho(r.dang_chinh) or v_md_cho end;
    if v_cho then
      n_cho := n_cho + 1;   -- câu chưa có chỗ trên bản đồ: nội dung đã được người xem, nhưng chưa vào kho chuẩn
    else
      execute format('update %I set da_duyet = true, duyet_boi = $2, duyet_at = now(), duyet_nguon = ''nguoi''
                      where ma_cau = $1 and not da_duyet', r.kho || '_cau_hoi') using r.ma_cau, nsu;
      n := n + 1;
    end if;
    if r.loai_cau = 'tra_loi_ngan' then   -- form trắc nghiệm của câu TLN (nếu kho đã có sẵn) — không bắt buộc cho đề thi nữa (K5)
      v_form := public._kho_form_tn_cua(r.kho || '_cau_hoi');
      if v_form is not null then
        execute format('update %I set da_duyet = true, duyet_boi = $2, duyet_at = now()
                        where ma_cau = $1 and xoa_at is null and not da_duyet', v_form) using r.ma_cau, nsu;
      end if;
    end if;
  end loop;
  update tai_lieu set duyet_at = now(), duyet_boi = nsu, updated_at = now() where id = p_de;
  return jsonb_build_object('so_cau', n, 'so_cau_cho_dang', n_cho);
end $function$;
