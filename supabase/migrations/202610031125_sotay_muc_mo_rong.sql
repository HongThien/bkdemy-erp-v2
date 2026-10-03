-- ============================================================================
-- sotay_muc_mo_rong — THẺ CÔNG THỨC → MỤC SỔ TAY chung mọi môn (Thùy 03/10: đưa sổ tay KHTN (KHTN Pocket, GV đã duyệt) lên app HS;
--   "đưa lên ERP 1 lần làm gốc, từ đó tham chiếu lên app sử dụng")
-- ----------------------------------------------------------------------------
-- VÌ SAO: sổ tay KHTN có 9 LOẠI mục (khái niệm, đại lượng, công thức, hiện tượng, cấu tạo, chất–loài, thực hành, ứng dụng, so sánh) và
--   nhiều phần hơn thẻ công thức Toán (ý chính, bảng, bảng ký hiệu, ví dụ từng bước, hay nhầm, mục liên quan). Đẻ bảng riêng cho KHTN =
--   2 màn ERP, 2 đường tìm, 2 màn đọc cho cùng một thứ ⇒ MỞ RỘNG bảng `sotay_cong_thuc` thành bảng mục sổ tay chung (đối xứng §1.6):
--   thẻ Toán cũ = loại 'ct', mọi cột mới null ("không áp dụng"). Tên bảng giữ nguyên (đổi tên = đụng màn ERP + RPC đang chạy).
--   KHTN: `noi_dung` = tóm tắt (cột bắt buộc có sẵn), `cong_thuc` = công thức chữ thường (H₂O, →, không LaTeX).
--   `sotay_ct_chu_de.nhanh` = phân môn hiển thị trong sổ tay (Lý / Hóa / Sinh); Toán để null.
--   App HS ĐỌC từ đây (1 gốc): `_sotay_muc_json` = 1 nguồn dựng nội dung 1 mục cho tìm / duyệt cây / mở mục liên quan.
--   Phần sửa hàm có sẵn (trigger hạ trạng thái + hs_sotay_tim_ct) lấy từ pg_get_functiondef bản đang chạy (scripts/sotay-khtn/gen-mig-mo-rong.mjs).
--
-- MẤT GÌ (Luật xoá): không mất gì — thêm cột (null / mặc định), thêm 3 hàm, sửa 2 hàm bằng create or replace (giữ chữ ký).
-- ============================================================================

alter table public.sotay_ct_chu_de add column nhanh text;

alter table public.sotay_cong_thuc
  add column loai text not null default 'ct'
    check (loai in ('kn', 'dl', 'ct', 'ht', 'cq', 'ch', 'tn', 'ud', 'ss')),
  add column cong_thuc text,                         -- công thức dạng chữ (KHTN); Toán để công thức trong noi_dung
  add column y     jsonb check (y is null or jsonb_typeof(y) = 'array'),         -- ý chính: ["…", …]
  add column bang  jsonb check (bang is null or jsonb_typeof(bang) = 'array'),   -- bảng: [[ô tiêu đề…], [ô…], …]
  add column bien  jsonb check (bien is null or jsonb_typeof(bien) = 'array'),   -- bảng ký hiệu – đại lượng – đơn vị
  add column vd    jsonb check (vd is null or jsonb_typeof(vd) = 'object'),      -- ví dụ: {de, buoc: [], kq}
  add column nham  jsonb check (nham is null or jsonb_typeof(nham) = 'array'),   -- hay nhầm: ["…", …]
  add column lq    text[] not null default '{}';     -- mã mục liên quan (cùng môn)

-- Nội dung ĐỦ của 1 mục cho app HS (chỉ mục đã duyệt, chưa xoá). Mục liên quan cũng chỉ lấy mục đã duyệt.
create or replace function public._sotay_muc_json(p_ma text)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_strip_nulls(jsonb_build_object(
    'ma', c.ma, 'mon', c.mon, 'khoi', c.khoi, 'loai', c.loai, 'ten', c.ten,
    'chu_de', c.chu_de, 'ten_chu_de', cd.ten, 'nhanh', cd.nhanh,
    'noi_dung', c.noi_dung, 'cong_thuc', c.cong_thuc, 'luu_y', c.luu_y, 'cau_nho', c.cau_nho, 'hinh_url', h.url,
    'y', c.y, 'bang', c.bang, 'bien', c.bien, 'vd', c.vd, 'nham', c.nham,
    'lq', (select jsonb_agg(jsonb_build_object('ma', x.ma, 'ten', x.ten, 'loai', x.loai) order by array_position(c.lq, x.ma))
           from sotay_cong_thuc x
           where x.ma = any(c.lq) and x.mon = c.mon and x.trang_thai = 'da_duyet' and x.xoa_at is null)))
  from sotay_cong_thuc c
  join sotay_ct_chu_de cd on cd.mon = c.mon and cd.khoi = c.khoi and cd.ma = c.chu_de
  left join sotay_ct_hinh h on h.mon = c.mon and h.khoi = c.khoi and h.ma = c.hinh
  where c.ma = p_ma and c.trang_thai = 'da_duyet' and c.xoa_at is null
$$;
revoke all on function public._sotay_muc_json(text) from public;
revoke all on function public._sotay_muc_json(text) from anon;

-- Duyệt sổ tay theo cây: chủ đề (theo phân môn, thứ tự) → mục (tên + loại). Khối mặc định = khối em đang học môn đó
-- (lớp của môn ⇒ không có thì khối của em); khối đó chưa có mục ⇒ khối đầu tiên có mục. Chỉ mục đã duyệt.
create or replace function public.hs_sotay_muc_cay(p_mon text, p_khoi text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_ds text[];
  v_khoi text := nullif(btrim(coalesce(p_khoi, '')), '');
begin
  if not (v_hs is not null or public.la_thanh_vien()) then raise exception 'Không có quyền đọc sổ tay.'; end if;
  select array_agg(k order by length(k), k) into v_ds from (
    select distinct c.khoi k from sotay_cong_thuc c where c.mon = p_mon and c.trang_thai = 'da_duyet' and c.xoa_at is null) z;
  if v_ds is null then return jsonb_build_object('khoi', null, 'khoi_list', '[]'::jsonb, 'chu_de', '[]'::jsonb); end if;
  if v_khoi is null and v_hs is not null then
    v_khoi := coalesce((select l.khoi from lop l where l.id = public._hs_lop_tu_luyen(v_hs, p_mon)),
                       (select h.khoi from hoc_sinh h where h.id = v_hs));
  end if;
  if v_khoi is null or not (v_khoi = any(v_ds)) then v_khoi := v_ds[1]; end if;
  return jsonb_build_object('khoi', v_khoi, 'khoi_list', to_jsonb(v_ds), 'chu_de', coalesce((
    select jsonb_agg(jsonb_build_object('ma', cd.ma, 'ten', cd.ten, 'nhanh', cd.nhanh,
             'muc', (select jsonb_agg(jsonb_build_object('ma', c.ma, 'ten', c.ten, 'loai', c.loai) order by c.thu_tu, c.ten)
                     from sotay_cong_thuc c
                     where c.mon = cd.mon and c.khoi = cd.khoi and c.chu_de = cd.ma and c.trang_thai = 'da_duyet' and c.xoa_at is null))
           order by cd.thu_tu)
    from sotay_ct_chu_de cd
    where cd.mon = p_mon and cd.khoi = v_khoi
      and exists (select 1 from sotay_cong_thuc c where c.mon = cd.mon and c.khoi = cd.khoi and c.chu_de = cd.ma
                  and c.trang_thai = 'da_duyet' and c.xoa_at is null)), '[]'::jsonb));
end $$;

-- Mở 1 mục (bấm mục trong cây / mục liên quan)
create or replace function public.hs_sotay_muc(p_ma text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not (public.my_hoc_sinh_id() is not null or public.la_thanh_vien()) then raise exception 'Không có quyền đọc sổ tay.'; end if;
  return public._sotay_muc_json(p_ma);
end $$;

revoke all on function public.hs_sotay_muc_cay(text, text) from public;
revoke all on function public.hs_sotay_muc_cay(text, text) from anon;
grant execute on function public.hs_sotay_muc_cay(text, text) to authenticated;
revoke all on function public.hs_sotay_muc(text) from public;
revoke all on function public.hs_sotay_muc(text) from anon;
grant execute on function public.hs_sotay_muc(text) to authenticated;

-- _sotay_ct_truoc_ghi — thân từ bản đang chạy, chỉ nới bộ cột "nội dung"
CREATE OR REPLACE FUNCTION public._sotay_ct_truoc_ghi()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  v_doi boolean;
  v_n   integer;
begin
  if tg_op = 'INSERT' then
    if new.thu_tu is null or new.thu_tu = 0 then
      select coalesce(max(thu_tu), 0) + 1 into new.thu_tu
      from sotay_cong_thuc where mon = new.mon and khoi = new.khoi and chu_de = new.chu_de;
    end if;
    if new.ma is null or btrim(new.ma) = '' then
      -- CT<khối>-<chủ đề>-<nn>; nn = số lớn nhất đã dùng (kể cả thẻ trong kho rác — mã đã xoá KHÔNG cấp lại) + 1.
      select coalesce(max(nullif(regexp_replace(ma, '^.*-', ''), '')::int), 0) + 1 into v_n
      from sotay_cong_thuc
      where mon = new.mon and khoi = new.khoi and chu_de = new.chu_de and ma ~ '-[0-9]+$';
      new.ma := 'CT' || new.khoi || '-' || new.chu_de || '-' || lpad(v_n::text, 2, '0');
    end if;
    new.cap_nhat_boi := coalesce(new.cap_nhat_boi, current_nhan_su_id());
    return new;
  end if;

  -- UPDATE
  new.cap_nhat_at := now();
  new.cap_nhat_boi := current_nhan_su_id();
  v_doi := (new.ten, new.ten_khac, new.noi_dung, new.luu_y, new.cau_nho, new.hinh, new.chu_de, new.ct2018,
            new.loai, new.cong_thuc, new.y, new.bang, new.bien, new.vd, new.nham, new.lq) -- mig sotay_muc_mo_rong: thêm cột nội dung mới
           is distinct from (old.ten, old.ten_khac, old.noi_dung, old.luu_y, old.cau_nho, old.hinh, old.chu_de, old.ct2018,
            old.loai, old.cong_thuc, old.y, old.bang, old.bien, old.vd, old.nham, old.lq);
  -- Sửa nội dung mà KHÔNG đồng thời đổi trạng thái ⇒ thẻ đã duyệt / bị trả về quay lại chờ duyệt.
  if v_doi and new.trang_thai = old.trang_thai and old.trang_thai in ('da_duyet', 'tra_ve') then
    new.trang_thai := 'cho_duyet';
  end if;
  if new.trang_thai is distinct from old.trang_thai then
    if new.trang_thai = 'cho_duyet' then
      new.xet_boi := null; new.xet_at := null; new.ly_do_tra_ve := null;
    else
      new.xet_boi := current_nhan_su_id(); new.xet_at := now();
      if new.trang_thai = 'da_duyet' then new.ly_do_tra_ve := null; end if;
    end if;
  end if;
  return new;
end $function$;

-- hs_sotay_tim_ct — thân từ bản đang chạy, mỗi kết quả = _sotay_muc_json (đủ nội dung để mở luôn)
CREATE OR REPLACE FUNCTION public.hs_sotay_tim_ct(p_tu_khoa text, p_mon text DEFAULT 'Toán'::text, p_khoi text DEFAULT NULL::text, p_limit integer DEFAULT 20)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_q     text := public.fn_bo_dau(btrim(coalesce(p_tu_khoa, '')));
  v_toks  text[];
  v_pats  text[] := '{}';
  v_n     integer;
  v_i     integer;
  v_khoi  text := nullif(btrim(coalesce(p_khoi, '')), '');
  v_limit integer := greatest(1, least(coalesce(p_limit, 20), 50));
  v_out   jsonb;
begin
  -- = `_sotay_duoc_doc()`, viết thẳng ra: helper đó thuộc owner `postgres` và đã bị revoke khỏi public
  -- (mig 202609182334) ⇒ hàm này (owner claude_build, security definer) gọi nó là "permission denied".
  if not (public.my_hoc_sinh_id() is not null or public.la_thanh_vien()) then
    raise exception 'Không có quyền đọc sổ tay.';
  end if;
  if length(v_q) < 2 then return '[]'::jsonb; end if;

  v_toks := array(
    select regexp_replace(x, '[^a-z0-9]', '', 'g')
    from unnest(regexp_split_to_array(v_q, '\s+')) x
    where regexp_replace(x, '[^a-z0-9]', '', 'g') <> ''
  );
  v_n := coalesce(array_length(v_toks, 1), 0);
  if v_n = 0 then return '[]'::jsonb; end if;
  for v_i in 1 .. v_n loop
    v_pats := v_pats || (case when v_i < v_n then '\m' || v_toks[v_i] || '\M' else '\m' || v_toks[v_i] end);
  end loop;

  with d as (
    select c.ma, c.ten, c.khoi, c.noi_dung, c.luu_y, c.cau_nho, c.thu_tu,
           cd.ten as ten_chu_de, cd.thu_tu as thu_tu_cd, h.url as hinh_url,
           public.fn_bo_dau(c.ten) as t_ten,
           public.fn_bo_dau(array_to_string(c.ten_khac, ' | ')) as t_khac,
           public.fn_bo_dau(c.ten || ' ' || array_to_string(c.ten_khac, ' ') || ' ' || cd.ten) as hay,
           c.ten_khac
    from sotay_cong_thuc c
    join sotay_ct_chu_de cd on cd.mon = c.mon and cd.khoi = c.khoi and cd.ma = c.chu_de
    left join sotay_ct_hinh h on h.mon = c.mon and h.khoi = c.khoi and h.ma = c.hinh
    where c.trang_thai = 'da_duyet' and c.xoa_at is null
      and c.mon = p_mon and (v_khoi is null or c.khoi = v_khoi)
  ), m as (
    select d.*,
      (case when d.t_ten = v_q then 100
            when exists (select 1 from unnest(d.ten_khac) k where public.fn_bo_dau(k) = v_q) then 90
            when d.t_ten like v_q || '%' then 60
            when d.t_khac like '%' || v_q || '%' then 50
            when d.t_ten like '%' || v_q || '%' then 40
            else 10 end) as diem
    from d where d.hay ~ all(v_pats)
  )
  select coalesce(jsonb_agg(public._sotay_muc_json(ma) order by diem desc, thu_tu_cd, thu_tu), '[]'::jsonb)
  into v_out
  from (select * from m order by diem desc, thu_tu_cd, thu_tu limit v_limit) z;

  return v_out;
end $function$;

