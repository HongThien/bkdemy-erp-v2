-- ============================================================================
-- 202611210813 — lo_mau_va_khoa_duyet_truong_khoi
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   (1) LÔ MẪU (spec-giai-bai §C3, Thùy 18/11): trigger _bdm_tu_duyet_sau_gan (mig 202611051930, bản mới nhất 202611130903) tự duyệt
--       MỌI câu chưa duyệt mà máy gán dạng mức cao + đủ đáp án, không biết có lô mẫu. Đã cắn thật 21/11: lô CLC lớp 6 (khối 5T, nguồn mới)
--       ghi 720 câu thì 344 câu tự duyệt dù luật nói batch đầu tiên của (khối × loại kì) phải đi làn duyệt hết.
--       Thùy 21/11 chốt: lô CLC coi như ĐÃ duyệt mẫu (ghi §C9); từ nay lô mẫu khai báo vào kho_lo_mau, trigger bỏ qua.
--   (2) KHOÁ NGƯỜI DUYỆT (§E1, §C10 mục 14, Thùy 18/11): fn_kho_duyet_cau / _ds / _menh_de chỉ kiểm "là nhân sự" và tin p_nguoi từ tham số.
--       Nay: người dùng app (có JWT) phải là TRƯỞNG KHỐI đúng (môn × khối của câu) trở lên (_truong_khoi_tro_len: Ban lãnh đạo ·
--       quản lý môn · trưởng khối; Phó khối KHÔNG), và p_nguoi phải là chính họ. Kết nối script/DB (không JWT) giữ nguyên để các
--       bộ kiểm và batch chạy. Đường duyệt qua phiên Claude (fn_phien_kho_duyet) đã tự khoá theo người mở phiên — không đụng.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Thu hẹp quyền: TA / giáo viên / phó khối thôi bấm được duyệt câu vào kho trên màn "Duyệt lời giải AI"
--   (trước đó bất kỳ nhân sự nào). Thu hẹp hành vi trigger: câu thuộc lô mẫu đang chờ không tự duyệt khi được gán dạng.
-- ============================================================================

-- ---------- (1) Sổ lô mẫu ----------
create table if not exists public.kho_lo_mau (
  id            uuid primary key default gen_random_uuid(),
  bang_cau      text not null check (bang_cau in ('dai_cau_hoi','hgt_cau_hoi','khtn_cau_hoi','vatly_cau_hoi','hoahoc_cau_hoi')),
  mau           text not null,          -- mẫu LIKE trên ten_de_goc của câu (tên đề / mã sách; '%' để khớp cả loạt)
  khoi          text,                   -- chỉ để đọc (khối × loại kì của lô)
  loai_ki       text,
  ghi_chu       text,
  tao_boi       uuid references public.nhan_su(id),
  tao_at        timestamptz not null default now(),
  duyet_mau_boi uuid references public.nhan_su(id),
  duyet_mau_at  timestamptz,            -- NULL = lô mẫu còn chờ duyệt (câu không tự vào kho); có giá trị = đã duyệt mẫu
  unique (bang_cau, mau)
);
comment on table public.kho_lo_mau is 'Sổ lô mẫu (spec-giai-bai §C3/§C9): dòng có duyet_mau_at NULL ⇒ câu có ten_de_goc LIKE mau KHÔNG tự duyệt khi gán dạng mức cao.';
alter table public.kho_lo_mau enable row level security;
drop policy if exists kho_lo_mau_doc on public.kho_lo_mau;
create policy kho_lo_mau_doc on public.kho_lo_mau for select to authenticated using (true);
-- ghi: chỉ qua RPC bên dưới (không có policy ghi); batch/script dùng role sở hữu bảng.

create or replace function public._kho_lo_mau_quyen(p_bang text) returns boolean
 language sql stable security definer set search_path to 'public' as $$
  select public._qlcl_toan_he()
      or (case when p_bang in ('dai_cau_hoi','hgt_cau_hoi') then 'Toán' when p_bang = 'khtn_cau_hoi' then 'KHTN'
               when p_bang = 'vatly_cau_hoi' then 'Vật lý' when p_bang = 'hoahoc_cau_hoi' then 'Hóa học' end) = any(public._quan_ly_mon())
$$;

create or replace function public.fn_kho_lo_mau_dang_ky(p_bang text, p_mau text, p_khoi text default null, p_loai_ki text default null, p_ghi_chu text default null)
 returns uuid language plpgsql security definer set search_path to 'public' as $$
declare v_id uuid;
begin
  if not public._kho_lo_mau_quyen(p_bang) then raise exception 'Chỉ quản lý môn trở lên khai báo lô mẫu'; end if;
  if nullif(trim(p_mau), '') is null then raise exception 'Thiếu mẫu tên đề'; end if;
  insert into public.kho_lo_mau (bang_cau, mau, khoi, loai_ki, ghi_chu, tao_boi)
  values (p_bang, trim(p_mau), p_khoi, p_loai_ki, p_ghi_chu, public.current_nhan_su_id())
  on conflict (bang_cau, mau) do update set ghi_chu = coalesce(excluded.ghi_chu, public.kho_lo_mau.ghi_chu)
  returning id into v_id;
  return v_id;
end $$;

create or replace function public.fn_kho_lo_mau_duyet(p_id uuid) returns void
 language plpgsql security definer set search_path to 'public' as $$
declare r public.kho_lo_mau;
begin
  select * into r from public.kho_lo_mau where id = p_id for update;
  if r.id is null then raise exception 'Không có lô mẫu %', p_id; end if;
  if not public._kho_lo_mau_quyen(r.bang_cau) then raise exception 'Chỉ quản lý môn trở lên duyệt lô mẫu'; end if;
  update public.kho_lo_mau set duyet_mau_boi = public.current_nhan_su_id(), duyet_mau_at = now() where id = p_id and duyet_mau_at is null;
end $$;

revoke execute on function public._kho_lo_mau_quyen(text) from public, anon;
revoke execute on function public.fn_kho_lo_mau_dang_ky(text, text, text, text, text) from public, anon;
revoke execute on function public.fn_kho_lo_mau_duyet(uuid) from public, anon;
grant execute on function public.fn_kho_lo_mau_dang_ky(text, text, text, text, text) to authenticated;
grant execute on function public.fn_kho_lo_mau_duyet(uuid) to authenticated;

-- Trigger tự duyệt: thân dựng từ bản đang chạy (202611130903), thêm đúng 1 điều kiện (không thuộc lô mẫu chờ).
create or replace function public._bdm_tu_duyet_sau_gan()
 returns trigger
 language plpgsql
as $function$
declare v_bang text := case when tg_table_name like 'hgt%' then 'hgt_cau_hoi'
                            when tg_table_name like 'khtn%' then 'khtn_cau_hoi'
                            when tg_table_name like 'vatly%' then 'vatly_cau_hoi'
                            when tg_table_name like 'hoahoc%' then 'hoahoc_cau_hoi'
                            else 'dai_cau_hoi' end;
begin
  if new.nguon = 'ai' then
    execute format($q$update public.%I q set da_duyet = true, duyet_nguon = 'ai', duyet_at = now()
      where q.ma_cau = $1 and q.da_duyet = false and q.xoa_at is null
        and q.kiem_may is distinct from 'nghi'
        and public._bdm_du_dap_an(q.loai_cau, q.dap_an, q.menh_de, q.loi_giai)
        and not exists (select 1 from public.kho_lo_mau m
                         where m.bang_cau = %L and m.duyet_mau_at is null and q.ten_de_goc like m.mau)$q$, v_bang, v_bang) using new.ma_cau;
  end if;
  return null;
end $function$;

-- ---------- (2) Khoá người duyệt ----------
create or replace function public._kho_duoc_duyet(p_mon text, p_ma_cau text, p_nguoi uuid) returns void
 language plpgsql stable security definer set search_path to 'public' as $$
declare t text := public.fn_kho_tbl(p_mon); v_mon text; v_khoi text;
begin
  if public.jwt_uid() is null then return; end if;   -- kết nối script / DB: không phải người dùng app
  if t is null then return; end if;            -- môn lạ: để hàm duyệt tự báo lỗi
  if p_nguoi is distinct from public.current_nhan_su_id() then
    raise exception 'Người duyệt phải là chính người đang đăng nhập';
  end if;
  v_mon := case p_mon when 'khtn' then 'KHTN' when 'vatly' then 'Vật lý' when 'hoahoc' then 'Hóa học'
                      when 'anh' then 'Tiếng Anh' when 'tsa' then 'TSA' else 'Toán' end;
  execute format('select b.khoi from %I c join %I b on b.ma_dang = c.dang_chinh where c.ma_cau = $1', t || '_cau_hoi', t || '_ban_do')
    into v_khoi using p_ma_cau;
  if v_khoi is null then return; end if;       -- không thấy câu: để hàm duyệt tự báo lỗi
  if not public._truong_khoi_tro_len(v_mon, v_khoi) then
    raise exception 'Chỉ trưởng khối % khối % (hoặc cấp trên) được duyệt câu vào kho', v_mon, v_khoi;
  end if;
end $$;
revoke execute on function public._kho_duoc_duyet(text, text, uuid) from public, anon;
grant execute on function public._kho_duoc_duyet(text, text, uuid) to authenticated;

-- Ba hàm duyệt: thân = bản đang chạy + 1 dòng gọi _kho_duoc_duyet ngay sau kiểm p_nguoi.

CREATE OR REPLACE FUNCTION public.fn_kho_duyet_cau(p_mon text, p_ma_cau text, p_nguoi uuid, p_sua jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  t text := public.fn_kho_tbl(p_mon); v_cau text; v_ban_do text; v_cum_tbl text; v_form text;
  r record; v_dang text; v_cum text; v_dap text; v_lg text; v_de text; v_lua_chon jsonb;
  v_doi_dap boolean; v_doi_dang boolean; v_ok boolean; v_thu_hoi integer := 0;
  v_kiem_may text; v_kiem_boi text; v_kiem_ghi text; v_kiem_at timestamptz;
  v_opt jsonb; v_dang_bai text;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if t is null then raise exception 'fn_kho_duyet_cau: môn không hợp lệ %', p_mon; end if;
  if p_nguoi is null then raise exception 'Thiếu người duyệt'; end if;
  perform public._kho_duoc_duyet(p_mon, p_ma_cau, p_nguoi);   -- khoá 21/11: chỉ trưởng khối đúng (môn × khối) trở lên (spec-giai-bai §E1)
  v_cau := t || '_cau_hoi'; v_ban_do := t || '_ban_do'; v_cum_tbl := t || '_cum_bai'; v_form := public._kho_form_tn_cua(v_cau);

  execute format('select * from %I where ma_cau = $1 and xoa_at is null for update', v_cau) into r using p_ma_cau;
  if r.ma_cau is null then raise exception 'Câu % không tồn tại hoặc đã vào kho rác', p_ma_cau; end if;

  -- Bản đồ mới (K6–12 Toán Đại/HGT — Thùy 26/10): người chọn DẠNG BÀI ⇒ ghi GÁN (nguon 'nguoi') TRƯỚC khi ký duyệt, cùng transaction.
  -- dang_chinh (dạng cũ) giữ nguyên = lưu trữ; trigger chặn duyệt nhận câu đã gán là đã phân dạng.
  v_dang_bai := nullif(trim(p_sua->>'dang_bai'), '');
  if v_dang_bai is not null then perform public._bdm_nguoi_gan_cau(t, p_ma_cau, v_dang_bai); end if;

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

  -- 4 phương án A/B/C/D (chỉ câu trắc nghiệm có cột này): key có ⇒ validate là mảng chuỗi không rỗng, cùng
  -- số lượng phương án gốc (đáp số đang trỏ theo CHỮ CÁI/vị trí, đổi số lượng phương án dễ lệch đáp số).
  if p_sua ? 'lua_chon' then
    v_lua_chon := p_sua->'lua_chon';
    if jsonb_typeof(v_lua_chon) is distinct from 'array' then raise exception 'lua_chon phải là mảng chuỗi'; end if;
    if r.lua_chon is null then raise exception 'Câu này không phải trắc nghiệm, không có phương án để sửa'; end if;
    if jsonb_array_length(v_lua_chon) is distinct from jsonb_array_length(r.lua_chon) then
      raise exception 'Số phương án phải giữ nguyên (%), không thêm/bớt A/B/C/D', jsonb_array_length(r.lua_chon);
    end if;
    for v_opt in select * from jsonb_array_elements(v_lua_chon) loop
      if jsonb_typeof(v_opt) is distinct from 'string' or trim(v_opt #>> '{}') = '' then
        raise exception 'Mỗi phương án phải là chuỗi khác rỗng';
      end if;
    end loop;
  else
    v_lua_chon := r.lua_chon;
  end if;

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
                    lua_chon = $12,
                    da_duyet = true, duyet_boi = $7, duyet_at = now(), duyet_nguon = 'nguoi',
                    kiem_may = $8, kiem_may_boi = $9, kiem_may_ghi = $10, kiem_may_at = $11
                  where ma_cau = $1$q$, v_cau)
    using p_ma_cau, v_de, v_dap, v_lg, v_dang, v_cum, p_nguoi, v_kiem_may, v_kiem_boi, v_kiem_ghi, v_kiem_at, v_lua_chon;

  return jsonb_build_object('thu_hoi_form', v_thu_hoi, 'doi_dap_an', v_doi_dap, 'doi_dang', v_doi_dang or v_dang_bai is not null, 'dang_bai', v_dang_bai);
end
$function$;

CREATE OR REPLACE FUNCTION public.fn_kho_duyet_cau_ds(p_mon text, p_ma_cau text, p_nguoi uuid, p_sua jsonb DEFAULT '{}'::jsonb, p_duyet_het boolean DEFAULT false)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  t text := public.fn_kho_tbl(p_mon); v_cau text; v_con text; r record; v_n int; v_ok int; i int; kq jsonb; v_moi boolean; v_cd text;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if t is null then raise exception 'fn_kho_duyet_cau_ds: môn không hợp lệ %', p_mon; end if;
  if p_nguoi is null then raise exception 'Thiếu người duyệt'; end if;
  perform public._kho_duoc_duyet(p_mon, p_ma_cau, p_nguoi);   -- khoá 21/11: chỉ trưởng khối đúng (môn × khối) trở lên (spec-giai-bai §E1)
  v_cau := t || '_cau_hoi'; v_con := t || '_cau_menh_de';
  if to_regclass(v_con) is null then raise exception 'Nhánh % chưa hỗ trợ duyệt Đúng/Sai theo mệnh đề', p_mon; end if;

  execute format('select ma_cau, loai_cau, menh_de, dang_chinh, parent_ma_cau from %I where ma_cau = $1 and xoa_at is null for update', v_cau) into r using p_ma_cau;
  if r.ma_cau is null then raise exception 'Câu % không tồn tại hoặc đã vào kho rác', p_ma_cau; end if;
  if r.loai_cau <> 'dung_sai' then raise exception 'Câu % không phải Đúng/Sai', p_ma_cau; end if;
  v_n := coalesce(jsonb_array_length(r.menh_de), 0);
  if v_n < 2 then raise exception 'Câu % có % mệnh đề — câu Đúng/Sai cần ít nhất 2', p_ma_cau, v_n; end if;

  -- Bản đồ mới: câu Đ/S thuộc KHO Đ/S của CHỦ ĐỀ — duyệt chỉ cần chủ đề (p_sua.chu_de = người chọn ⇒ ghi nguon 'nguoi')
  v_moi := public._bdm_dang_o_khoi_moi(t, r.dang_chinh);
  if v_moi then
    v_cd := nullif(trim(p_sua->>'chu_de'), '');
    if v_cd is not null then perform public._bdm_nguoi_gan_chu_de_ds(t, p_ma_cau, v_cd); end if;
    if not public._bdm_cau_ds_co_chu_de(t, p_ma_cau, r.parent_ma_cau) then
      raise exception 'Câu Đúng/Sai % chưa có chủ đề (kho Đúng/Sai của chủ đề) — chọn chủ đề trước khi duyệt', p_ma_cau using errcode = 'check_violation';
    end if;
  end if;

  if p_duyet_het then
    for i in 1..v_n loop perform public.fn_kho_duyet_menh_de(p_mon, p_ma_cau, i, p_nguoi, '{}'::jsonb); end loop;
  end if;

  execute format('select count(*) from %I where ma_cau_cha = $1 and xoa_at is null and da_duyet', v_con) into v_ok using p_ma_cau;
  if v_ok < v_n then
    raise exception 'Còn %/% mệnh đề chưa duyệt (hoặc chưa gán dạng) — duyệt từng mệnh đề trước', v_n - v_ok, v_n;
  end if;

  kq := public.fn_kho_duyet_cau(p_mon, p_ma_cau, p_nguoi, p_sua);
  return kq || jsonb_build_object('so_menh_de', v_n, 'chu_de', v_cd);
end $function$;

CREATE OR REPLACE FUNCTION public.fn_kho_duyet_menh_de(p_mon text, p_ma_cau text, p_thu_tu integer, p_nguoi uuid, p_sua jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  t text := public.fn_kho_tbl(p_mon); v_cau text; v_ban_do text; v_con text;
  r record; k record; e jsonb;
  v_dang text; v_nd text; v_dung boolean; v_lg text; v_id uuid; v_ten_dang text; v_ten_cd text; v_khoi text; v_ok boolean;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if t is null then raise exception 'fn_kho_duyet_menh_de: môn không hợp lệ %', p_mon; end if;
  if p_nguoi is null then raise exception 'Thiếu người duyệt'; end if;
  perform public._kho_duoc_duyet(p_mon, p_ma_cau, p_nguoi);   -- khoá 21/11: chỉ trưởng khối đúng (môn × khối) trở lên (spec-giai-bai §E1)
  v_cau := t || '_cau_hoi'; v_ban_do := t || '_ban_do'; v_con := t || '_cau_menh_de';
  if to_regclass(v_con) is null then raise exception 'Nhánh % chưa hỗ trợ duyệt Đúng/Sai theo mệnh đề', p_mon; end if;

  execute format('select * from %I where ma_cau = $1 and xoa_at is null for update', v_cau) into r using p_ma_cau;
  if r.ma_cau is null then raise exception 'Câu % không tồn tại hoặc đã vào kho rác', p_ma_cau; end if;
  if r.loai_cau <> 'dung_sai' then raise exception 'Câu % không phải Đúng/Sai', p_ma_cau; end if;
  if r.menh_de is null or jsonb_typeof(r.menh_de) <> 'array' or p_thu_tu < 1 or p_thu_tu > jsonb_array_length(r.menh_de) then
    raise exception 'Câu % không có mệnh đề thứ %', p_ma_cau, p_thu_tu;
  end if;
  e := r.menh_de -> (p_thu_tu - 1);

  execute format('select * from %I where ma_cau_cha = $1 and thu_tu = $2', v_con) into k using p_ma_cau, p_thu_tu;

  v_dang := coalesce(nullif(trim(p_sua->>'dang_chinh'), ''), k.dang_chinh, e->>'ma_dang');
  -- Bản đồ mới (Thùy 26/10 "để tạm vào kho của chủ đề"): ý Đ/S KHÔNG gắn dạng ⇒ chưa có / dạng không còn ⇒ dạng chờ của khối
  if public._bdm_dang_o_khoi_moi(t, r.dang_chinh) then
    if v_dang is not null then execute format('select exists (select 1 from %I where ma_dang = $1)', v_ban_do) into v_ok using v_dang; end if;
    if v_dang is null or not coalesce(v_ok, false) then
      execute format('select khoi from %I where ma_dang = $1', v_ban_do) into v_khoi using r.dang_chinh;
      v_dang := public._kho_dang_cho(t, v_khoi);
    end if;
  end if;
  if v_dang is null then raise exception 'Mệnh đề % chưa có dạng — chọn dạng trước khi duyệt', p_thu_tu; end if;
  execute format('select ten_dang, ten_chuyen_de from %I where ma_dang = $1', v_ban_do) into v_ten_dang, v_ten_cd using v_dang;
  if v_ten_dang is null then raise exception 'Dạng % không có trong bản đồ % — chọn dạng khác', v_dang, v_ban_do; end if;

  v_nd   := case when p_sua ? 'noi_dung' then nullif(trim(p_sua->>'noi_dung'), '') else coalesce(k.noi_dung, e->>'noi_dung') end;
  if v_nd is null then raise exception 'Nội dung mệnh đề không được trống'; end if;
  v_dung := case when p_sua ? 'dung' then (p_sua->>'dung')::boolean else coalesce(k.dung, coalesce(e->>'dap_an','S') = 'D') end;
  v_lg   := case when p_sua ? 'loi_giai' then nullif(trim(p_sua->>'loi_giai'), '') else coalesce(k.loi_giai, e->>'loi_giai') end;

  -- Đoạn ghi đôi (bảng con + jsonb cha): tắt trigger sync CHỈ trong đoạn này.
  perform set_config('kho.skip_sync_menh_de', '1', true);
  execute format($q$
    insert into %I (ma_cau_cha, thu_tu, dang_chinh, dang_ai_de_xuat, noi_dung, dung, loi_giai,
                    da_duyet, duyet_boi, duyet_at, duyet_nguon, kiem_may, kiem_may_at, xoa_at)
    values ($1, $2, $3, $4, $5, $6, $7, true, $8, now(), 'nguoi', 'khop', now(), null)
    on conflict (ma_cau_cha, thu_tu) do update set
      dang_chinh = excluded.dang_chinh, noi_dung = excluded.noi_dung, dung = excluded.dung, loi_giai = excluded.loi_giai,
      da_duyet = true, duyet_boi = excluded.duyet_boi, duyet_at = now(), duyet_nguon = 'nguoi',
      kiem_may = 'khop', kiem_may_at = now(), xoa_at = null
    returning id$q$, v_con)
    into v_id using p_ma_cau, p_thu_tu, v_dang, coalesce(k.dang_ai_de_xuat, e->>'ma_dang'), v_nd, v_dung, v_lg, p_nguoi;

  execute format($q$update %I set menh_de = jsonb_set(menh_de, array[$2::text], $3::jsonb, false) where ma_cau = $1$q$, v_cau)
    using p_ma_cau, (p_thu_tu - 1),
          jsonb_build_object('noi_dung', v_nd, 'dap_an', case when v_dung then 'D' else 'S' end, 'ma_dang', v_dang, 'loi_giai', v_lg);
  perform set_config('kho.skip_sync_menh_de', '0', true);

  return jsonb_build_object('id', v_id, 'thu_tu', p_thu_tu, 'dang_chinh', v_dang, 'ten_dang', v_ten_dang, 'ten_chuyen_de', v_ten_cd,
                            'noi_dung', v_nd, 'dung', v_dung, 'loi_giai', v_lg, 'da_duyet', true, 'duyet_at', now(),
                            'dang_ai_de_xuat', coalesce(k.dang_ai_de_xuat, e->>'ma_dang'));
end $function$;
