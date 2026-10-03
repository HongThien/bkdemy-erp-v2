-- ============================================================================
-- khtn_de_xuat_dang_cum — ĐỀ XUẤT DẠNG / CỤM / TRAO ĐỔI cho kho KHTN, y hệt Toán Đại (Thùy 03/10: "KHTN làm như toán ấy")
-- ----------------------------------------------------------------------------
-- VÌ SAO: nhập ngân hàng trắc nghiệm Hạt Mầm (KHTN 7–9, GV đã duyệt) vào kho KHTN theo luồng kho 3 làn (spec-luong-kho §5.3):
--   cây Hạt Mầm là PHIÊN BẢN BẢN ĐỒ KHÁC (trùng mã, không trùng dạng — DEVLOG 03/10) ⇒ Thùy chốt GIỮ bản đồ ERP, gán từng dạng Hạt Mầm
--   vào dạng ERP; 🟡 dạng mới / 🔴 cần trao đổi nằm ở bảng đề xuất tới khi học thuật quyết (bản đồ không bị ghi thẳng).
--   Kho Đại đã có đủ luồng này (mig 202609282236) ⇒ KHTN dùng ĐÚNG khuôn đó, bảng riêng theo môn (§1.6: tầng dưới mỗi nhánh bảng riêng),
--   màn ERP dùng chung qua registry ở client. Thân 4 hàm = bản sao hàm Đại ĐANG CHẠY, chỉ thay tên bảng (scripts/khtn-hatmam/gen-mig-de-xuat.mjs).
--   + `fn_khtn_sinh_ma_dang` (mã dạng KHTN = mã chuyên đề K<khối><cđ><ch> + 2 số) — dạng mới nhận từ đề xuất.
--   + `khtn_cau_hoi.muc_cau` = mức của CÂU (1 Nhận biết · 2 Thông hiểu · 3 Vận dụng · 4 Vận dụng cao · 5) — Hạt Mầm đo theo câu,
--     bản đồ đo theo dạng (khtn_ban_do.muc_do). Câu cũ: null = chưa đo mức câu (không phải 0).
--
-- MẤT GÌ (Luật xoá): không mất gì — 3 bảng mới, 5 hàm mới, 1 cột mới (null).
-- ============================================================================

create or replace function public.fn_khtn_sinh_ma_dang(p_ma_chuyen_de text)
returns text language plpgsql as $$
declare v_stt int; v_ma text;
begin
  if p_ma_chuyen_de !~ '^K[0-9]{6}$' or right(p_ma_chuyen_de, 4) = '0000' then
    raise exception 'fn_khtn_sinh_ma_dang: chuyên đề "%" không hợp lệ', p_ma_chuyen_de;
  end if;
  select coalesce(max(substring(ma_dang from 8 for 2)::int), 0) + 1 into v_stt
    from khtn_ban_do where ma_dang ~ ('^' || p_ma_chuyen_de || '[0-9]{2}$');
  if v_stt > 99 then raise exception 'fn_khtn_sinh_ma_dang: chuyên đề % đã đủ 99 dạng', p_ma_chuyen_de; end if;
  v_ma := p_ma_chuyen_de || lpad(v_stt::text, 2, '0');
  if exists (select 1 from khtn_ban_do where ma_dang = v_ma) then raise exception 'fn_khtn_sinh_ma_dang: mã "%" đã tồn tại', v_ma; end if;
  return v_ma;
end $$;
revoke all on function public.fn_khtn_sinh_ma_dang(text) from public, anon;

alter table public.khtn_cau_hoi add column muc_cau smallint check (muc_cau between 1 and 5);

create table if not exists public.khtn_de_xuat (
  id            uuid primary key default gen_random_uuid(),
  loai          text not null check (loai in ('dang_moi', 'cum_moi', 'trao_doi')),
  khoi          text not null,
  ma_chuyen_de  text not null,                 -- chuyên đề đề xuất thuộc về (bản đồ không có bảng chuyên đề ⇒ text)
  ma_dang       text references public.khtn_ban_do (ma_dang) on update cascade on delete cascade,
  ten           text,                          -- tên dạng/cụm đề xuất. NULL = không áp dụng (trao_doi)
  mo_ta_ngan    text,                          -- dấu hiệu nhận biết (dang_moi). NULL = không áp dụng
  dang_gan_nhat text references public.khtn_ban_do (ma_dang) on update cascade on delete set null,
  ly_do         text not null,                 -- dang/cum_moi: vì sao KHÔNG gộp được vào dạng/cụm gần nhất · trao_doi: CÂU HỎI cụ thể
  lo            text not null,                 -- mã lô chạy (vd 'k12-thuc-te-01') — đo theo lô
  nguon         text not null default 'ai' check (nguon in ('ai', 'nguoi')),
  ai_model      text,
  created_at    timestamptz not null default now(),
  constraint khtn_de_xuat_hinh_dang check (
    (loai = 'dang_moi' and ten is not null and mo_ta_ngan is not null and ma_dang is null) or
    (loai = 'cum_moi'  and ten is not null and ma_dang is not null) or
    (loai = 'trao_doi' and ten is null)
  )
);
create index if not exists khtn_de_xuat_khoi_lo on public.khtn_de_xuat (khoi, lo, created_at);

create table if not exists public.khtn_de_xuat_cau (
  de_xuat_id uuid not null references public.khtn_de_xuat (id) on delete cascade,
  ma_cau     text not null references public.khtn_cau_hoi (ma_cau) on update cascade,
  primary key (de_xuat_id, ma_cau)
);
create index if not exists khtn_de_xuat_cau_ma_cau on public.khtn_de_xuat_cau (ma_cau);

create table if not exists public.khtn_de_xuat_quyet_dinh (
  de_xuat_id      uuid primary key references public.khtn_de_xuat (id) on delete cascade,
  hanh_dong       text not null check (hanh_dong in ('nhan', 'nhan_co_sua', 'gop', 'bac', 'tra_loi')),
  ket_qua_ma_dang text references public.khtn_ban_do (ma_dang) on update cascade on delete set null,
  ket_qua_ma_cum  text references public.khtn_cum_bai (ma_cum) on update cascade on delete set null,
  tra_loi         text,           -- lý do bác / câu trả lời — NGUỒN cho luật (bánh đà §5.0). Bắt buộc với bac, tra_loi
  so_cau_doi      int not null default 0,
  nguoi           uuid not null references public.nhan_su (id),
  quyet_at        timestamptz not null default now(),
  constraint khtn_de_xuat_qd_tra_loi check (hanh_dong not in ('bac', 'tra_loi') or nullif(btrim(tra_loi), '') is not null)
);

alter table public.khtn_de_xuat            enable row level security;
alter table public.khtn_de_xuat_cau        enable row level security;
alter table public.khtn_de_xuat_quyet_dinh enable row level security;
drop policy if exists khtn_de_xuat_select on public.khtn_de_xuat;
drop policy if exists khtn_de_xuat_cau_select on public.khtn_de_xuat_cau;
drop policy if exists khtn_de_xuat_quyet_dinh_select on public.khtn_de_xuat_quyet_dinh;
create policy khtn_de_xuat_select            on public.khtn_de_xuat            for select to authenticated using (true);
create policy khtn_de_xuat_cau_select        on public.khtn_de_xuat_cau        for select to authenticated using (true);
create policy khtn_de_xuat_quyet_dinh_select on public.khtn_de_xuat_quyet_dinh for select to authenticated using (true);
grant select on public.khtn_de_xuat, public.khtn_de_xuat_cau, public.khtn_de_xuat_quyet_dinh to authenticated;


-- fn_khtn_de_xuat_ds(text, boolean) — bản sao fn_dai_de_xuat_ds(text, boolean) (thân lấy từ bản đang chạy, chỉ thay tên bảng Đại → KHTN)
CREATE OR REPLACE FUNCTION public.fn_khtn_de_xuat_ds(p_khoi text, p_chi_cho boolean DEFAULT true)
 RETURNS TABLE(id uuid, loai text, khoi text, ma_chuyen_de text, ten_chuyen_de text, ma_dang text, ten_dang text, ten text, mo_ta_ngan text, dang_gan_nhat text, ten_dang_gan_nhat text, ly_do text, lo text, nguon text, created_at timestamp with time zone, cau jsonb, quyet_dinh jsonb)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select d.id, d.loai, d.khoi, d.ma_chuyen_de,
         (select b.ten_chuyen_de from khtn_ban_do b where b.ma_chuyen_de = d.ma_chuyen_de limit 1),
         d.ma_dang, (select b.ten_dang from khtn_ban_do b where b.ma_dang = d.ma_dang),
         d.ten, d.mo_ta_ngan, d.dang_gan_nhat, (select b.ten_dang from khtn_ban_do b where b.ma_dang = d.dang_gan_nhat),
         d.ly_do, d.lo, d.nguon, d.created_at,
         coalesce((select jsonb_agg(jsonb_build_object(
                     'ma_cau', q.ma_cau, 'loai_cau', q.loai_cau, 'noi_dung', left(q.noi_dung, 700),
                     'dang_chinh', q.dang_chinh, 'da_duyet', q.da_duyet) order by q.ma_cau)
                     from khtn_de_xuat_cau c join khtn_cau_hoi q on q.ma_cau = c.ma_cau
                    where c.de_xuat_id = d.id), '[]'::jsonb),
         (select to_jsonb(x) from (select qd.hanh_dong, qd.ket_qua_ma_dang, qd.ket_qua_ma_cum, qd.tra_loi, qd.so_cau_doi, qd.quyet_at,
                                          (select ns.ho_ten from nhan_su ns where ns.id = qd.nguoi) nguoi_ten
                                     from khtn_de_xuat_quyet_dinh qd where qd.de_xuat_id = d.id) x)
    from khtn_de_xuat d
   where d.khoi = p_khoi
     and (not p_chi_cho or not exists (select 1 from khtn_de_xuat_quyet_dinh qd where qd.de_xuat_id = d.id))
   order by d.lo, d.ma_chuyen_de, d.created_at
   limit 500
$function$;
revoke all on function public.fn_khtn_de_xuat_ds(text, boolean) from public, anon;
grant execute on function public.fn_khtn_de_xuat_ds(text, boolean) to authenticated;

-- fn_khtn_de_xuat_quyet(uuid, text, text, text, text, text) — bản sao fn_dai_de_xuat_quyet(uuid, text, text, text, text, text) (thân lấy từ bản đang chạy, chỉ thay tên bảng Đại → KHTN)
CREATE OR REPLACE FUNCTION public.fn_khtn_de_xuat_quyet(p_id uuid, p_hanh_dong text, p_ten text DEFAULT NULL::text, p_mo_ta_ngan text DEFAULT NULL::text, p_ma_dang_dich text DEFAULT NULL::text, p_tra_loi text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  d        khtn_de_xuat%rowtype;
  v_nguoi  uuid := public.current_nhan_su_id();
  v_hd     text := p_hanh_dong;
  v_ma     text;
  v_cum    text;
  v_n      int := 0;
  v_bo_qua int := 0;
  m        record;
begin
  if v_nguoi is null then raise exception 'Chưa đăng nhập bằng tài khoản nhân sự' using errcode = 'insufficient_privilege'; end if;
  if not public.co_quyen_ghi('bdkt') then raise exception 'Không có quyền sửa Bản đồ kiến thức' using errcode = 'insufficient_privilege'; end if;

  select * into d from khtn_de_xuat where id = p_id for update;
  if not found then raise exception 'Đề xuất không tồn tại'; end if;
  if exists (select 1 from khtn_de_xuat_quyet_dinh where de_xuat_id = p_id) then raise exception 'Đề xuất này đã được quyết rồi'; end if;

  if not ((d.loai = 'dang_moi' and v_hd in ('nhan', 'gop', 'bac'))
       or (d.loai = 'cum_moi'  and v_hd in ('nhan', 'bac'))
       or (d.loai = 'trao_doi' and v_hd = 'tra_loi')) then
    raise exception 'Hành động "%" không hợp lệ cho đề xuất loại "%"', v_hd, d.loai;
  end if;
  if v_hd in ('bac', 'tra_loi') and nullif(btrim(p_tra_loi), '') is null then
    raise exception 'Phải ghi lý do / câu trả lời — đây là thứ biến thành luật cho lô sau';
  end if;
  if v_hd = 'gop' and p_ma_dang_dich is null then raise exception 'Gộp thì phải chọn dạng đích'; end if;
  if p_ma_dang_dich is not null and not exists (select 1 from khtn_ban_do where ma_dang = p_ma_dang_dich) then
    raise exception 'Dạng đích "%" không tồn tại', p_ma_dang_dich;
  end if;
  if p_ma_dang_dich is not null and public._kho_la_dang_cho(p_ma_dang_dich) then
    raise exception 'Không dời câu về dạng chờ';
  end if;

  select count(*) into v_bo_qua from khtn_de_xuat_cau c join khtn_cau_hoi q on q.ma_cau = c.ma_cau
   where c.de_xuat_id = p_id and q.da_duyet;

  if d.loai = 'dang_moi' and v_hd = 'nhan' then
    select * into m from khtn_ban_do where ma_chuyen_de = d.ma_chuyen_de and not public._kho_la_dang_cho(ma_dang) order by ma_dang limit 1;
    if not found then raise exception 'Chuyên đề "%" chưa có dạng nào để lấy tên chủ đề/chuyên đề', d.ma_chuyen_de; end if;
    v_ma := public.fn_khtn_sinh_ma_dang(d.ma_chuyen_de);
    insert into khtn_ban_do (ma_dang, khoi, ma_chu_de, ten_chu_de, ma_chuyen_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan)
    values (v_ma, m.khoi, m.ma_chu_de, m.ten_chu_de, m.ma_chuyen_de, m.ten_chuyen_de,
            coalesce(nullif(btrim(p_ten), ''), d.ten), m.muc_do, m.bac_toi_thieu, coalesce(nullif(btrim(p_mo_ta_ngan), ''), d.mo_ta_ngan));
    if coalesce(nullif(btrim(p_ten), ''), d.ten) is distinct from d.ten
       or coalesce(nullif(btrim(p_mo_ta_ngan), ''), d.mo_ta_ngan) is distinct from d.mo_ta_ngan then
      v_hd := 'nhan_co_sua';
    end if;
  elsif v_hd in ('gop', 'tra_loi') then
    v_ma := p_ma_dang_dich;          -- tra_loi không chỉ định dạng ⇒ null, không dời câu
  elsif d.loai = 'cum_moi' and v_hd = 'nhan' then
    insert into khtn_cum_bai (ma_dang, ten, thu_tu)
    values (d.ma_dang, coalesce(nullif(btrim(p_ten), ''), d.ten),
            coalesce((select max(thu_tu) from khtn_cum_bai where ma_dang = d.ma_dang), 0) + 1)
    returning ma_cum into v_cum;
    if coalesce(nullif(btrim(p_ten), ''), d.ten) is distinct from d.ten then v_hd := 'nhan_co_sua'; end if;
    update khtn_cau_hoi q set ma_cum = v_cum
      from khtn_de_xuat_cau c where c.de_xuat_id = p_id and c.ma_cau = q.ma_cau and q.dang_chinh = d.ma_dang;
    get diagnostics v_n = row_count;
  end if;

  if v_ma is not null then
    update khtn_cau_hoi q set dang_chinh = v_ma, ma_cum = null
      from khtn_de_xuat_cau c
     where c.de_xuat_id = p_id and c.ma_cau = q.ma_cau and not q.da_duyet and q.dang_chinh is distinct from v_ma;
    get diagnostics v_n = row_count;
  end if;

  insert into khtn_de_xuat_quyet_dinh (de_xuat_id, hanh_dong, ket_qua_ma_dang, ket_qua_ma_cum, tra_loi, so_cau_doi, nguoi)
  values (p_id, v_hd, v_ma, v_cum, nullif(btrim(p_tra_loi), ''), v_n, v_nguoi);

  return jsonb_build_object('hanh_dong', v_hd, 'ket_qua_ma_dang', v_ma, 'ket_qua_ma_cum', v_cum,
                            'so_cau_doi', v_n, 'so_cau_da_duyet_bo_qua', case when v_ma is null then 0 else v_bo_qua end);
end $function$;
revoke all on function public.fn_khtn_de_xuat_quyet(uuid, text, text, text, text, text) from public, anon;
grant execute on function public.fn_khtn_de_xuat_quyet(uuid, text, text, text, text, text) to authenticated;

-- fn_khtn_de_xuat_tao(text, text, text, text, text[], text, text, text, text, text) — bản sao fn_dai_de_xuat_tao(text, text, text, text, text[], text, text, text, text, text) (thân lấy từ bản đang chạy, chỉ thay tên bảng Đại → KHTN)
CREATE OR REPLACE FUNCTION public.fn_khtn_de_xuat_tao(p_loai text, p_khoi text, p_ma_chuyen_de text, p_ly_do text, p_ma_cau text[], p_lo text, p_ten text DEFAULT NULL::text, p_mo_ta_ngan text DEFAULT NULL::text, p_ma_dang text DEFAULT NULL::text, p_dang_gan_nhat text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_id uuid; v_thieu text;
begin
  if public.current_nhan_su_id() is null then raise exception 'Chưa đăng nhập bằng tài khoản nhân sự' using errcode = 'insufficient_privilege'; end if;
  if not public.co_quyen_ghi('bdkt') then raise exception 'Không có quyền sửa Bản đồ kiến thức' using errcode = 'insufficient_privilege'; end if;
  if nullif(btrim(p_ly_do), '') is null then raise exception 'Phải ghi lý do / câu hỏi'; end if;
  if nullif(btrim(p_lo), '') is null then raise exception 'Thiếu mã lô'; end if;
  if coalesce(array_length(p_ma_cau, 1), 0) = 0 then raise exception 'Đề xuất phải có ít nhất 1 câu làm chứng'; end if;
  if not exists (select 1 from khtn_ban_do where ma_chuyen_de = p_ma_chuyen_de and khoi = p_khoi) then
    raise exception 'Chuyên đề "%" không thuộc khối %', p_ma_chuyen_de, p_khoi;
  end if;
  select string_agg(x, ', ') into v_thieu from unnest(p_ma_cau) x
   where not exists (select 1 from khtn_cau_hoi q where q.ma_cau = x and q.xoa_at is null);
  if v_thieu is not null then raise exception 'Câu không tồn tại: %', v_thieu; end if;

  insert into khtn_de_xuat (loai, khoi, ma_chuyen_de, ma_dang, ten, mo_ta_ngan, dang_gan_nhat, ly_do, lo, nguon)
  values (p_loai, p_khoi, p_ma_chuyen_de, p_ma_dang, nullif(btrim(p_ten), ''), nullif(btrim(p_mo_ta_ngan), ''),
          p_dang_gan_nhat, btrim(p_ly_do), btrim(p_lo), 'nguoi')
  returning id into v_id;
  insert into khtn_de_xuat_cau (de_xuat_id, ma_cau) select v_id, x from (select distinct unnest(p_ma_cau) x) t;
  return v_id;
end $function$;
revoke all on function public.fn_khtn_de_xuat_tao(text, text, text, text, text[], text, text, text, text, text) from public, anon;
grant execute on function public.fn_khtn_de_xuat_tao(text, text, text, text, text[], text, text, text, text, text) to authenticated;

-- fn_khtn_de_xuat_tk(text) — bản sao fn_dai_de_xuat_tk(text) (thân lấy từ bản đang chạy, chỉ thay tên bảng Đại → KHTN)
CREATE OR REPLACE FUNCTION public.fn_khtn_de_xuat_tk(p_khoi text)
 RETURNS TABLE(lo text, loai text, tong integer, cho integer, nhan integer, nhan_co_sua integer, gop integer, bac integer, tra_loi integer)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select d.lo, d.loai, count(*)::int,
         count(*) filter (where qd.de_xuat_id is null)::int,
         count(*) filter (where qd.hanh_dong = 'nhan')::int,
         count(*) filter (where qd.hanh_dong = 'nhan_co_sua')::int,
         count(*) filter (where qd.hanh_dong = 'gop')::int,
         count(*) filter (where qd.hanh_dong = 'bac')::int,
         count(*) filter (where qd.hanh_dong = 'tra_loi')::int
    from khtn_de_xuat d left join khtn_de_xuat_quyet_dinh qd on qd.de_xuat_id = d.id
   where d.khoi = p_khoi
   group by d.lo, d.loai order by d.lo, d.loai
$function$;
revoke all on function public.fn_khtn_de_xuat_tk(text) from public, anon;
grant execute on function public.fn_khtn_de_xuat_tk(text) to authenticated;
