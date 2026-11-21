-- ============================================================================
-- 202611210816 — kho_bao_sai_moi_cau_nhan_su
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 21/11 (spec-giai-bai §E3 20/11): luật tự vào kho đã bỏ nhân chứng đáp số, nên an toàn dựa vào HẬU KIỂM ⇒ MỌI câu trong kho
--   phải có nút báo sai, ở mọi nơi người dùng thấy câu. Loại lỗi: trình bày · tính sai · sai đề · sai dạng · khác.
--   Trưởng khối được sửa hoặc xoá luôn, nhưng PHẢI báo lỗi trước (báo + xử lý cùng 1 giao dịch) để có luồng thông tin cho AI ghi vào
--   Phần D của spec-giai-bai (cột ghi_spec_at đánh dấu AI đã ghi).
--   Bảng báo lỗi của học sinh (bai_cau_bao_loi, mig 202610101606) đã có hàng đợi + màn xử lý ⇒ MỞ RỘNG bảng đó (một hàng đợi duy nhất,
--   không dựng bảng thứ hai kiểu "<nhánh>_<tên>" — CLAUDE.md §1.6): người báo có thể là nhân sự, thêm kho/khối/hành động xử lý.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá dữ liệu. Nới: hoc_sinh_id cho phép NULL (báo của nhân sự) · CHECK ly_do thêm 4 giá trị · CHECK mới "có người báo".
--   Backfill kho/khoi cho 126 báo cáo cũ của học sinh (chỉ điền cột mới đang trống).
-- ============================================================================

-- ---------- Cột mới ----------
alter table public.bai_cau_bao_loi alter column hoc_sinh_id drop not null;
alter table public.bai_cau_bao_loi
  add column if not exists nhan_su_id uuid references public.nhan_su(id),
  add column if not exists nguon text not null default 'hs',
  add column if not exists kho text,                 -- khoá kho theo fn_kho_tbl: toan · hgt · hinh_hoc · khtn · vatly · hoahoc · anh · tsa
  add column if not exists khoi text,                -- khối của câu lúc báo (để lọc theo phạm vi trưởng khối)
  add column if not exists hanh_dong text,           -- người xử lý đã làm gì: sua · xoa · khong_loi
  add column if not exists ghi_spec_at timestamptz;  -- AI đã ghi vào Phần D spec-giai-bai (NULL = còn chờ AI)

alter table public.bai_cau_bao_loi drop constraint if exists bai_cau_bao_loi_ly_do_check;
alter table public.bai_cau_bao_loi add constraint bai_cau_bao_loi_ly_do_check check (ly_do = any (array[
  'thieu_du_kien','hinh_loi','cong_thuc_loi','dap_an_sai','loi_giai_sai','khac',     -- học sinh (cũ)
  'trinh_bay','tinh_sai','sai_de','sai_dang'                                          -- nhân sự (mới)
]));
alter table public.bai_cau_bao_loi add constraint bai_cau_bao_loi_nguon_check check (nguon in ('hs','nhan_su','phien'));
alter table public.bai_cau_bao_loi add constraint bai_cau_bao_loi_hanh_dong_check check (hanh_dong is null or hanh_dong in ('sua','xoa','khong_loi'));
alter table public.bai_cau_bao_loi add constraint bai_cau_bao_loi_co_nguoi_bao check (hoc_sinh_id is not null or nhan_su_id is not null);

create unique index if not exists bai_cau_bao_loi_mo_ns_uq on public.bai_cau_bao_loi (nhan_su_id, mon, ma_cau, ly_do) where trang_thai = 'moi' and nhan_su_id is not null;
create index if not exists bai_cau_bao_loi_cho_ai_idx on public.bai_cau_bao_loi (xu_ly_at) where trang_thai <> 'moi' and ghi_spec_at is null;

-- ---------- Hàm phụ ----------
create or replace function public._kho_mon_label(p_kho text) returns text language sql immutable as $$
  select case p_kho when 'khtn' then 'KHTN' when 'vatly' then 'Vật lý' when 'hoahoc' then 'Hóa học'
                    when 'anh' then 'Tiếng Anh' when 'tsa' then 'TSA' else 'Toán' end
$$;

-- Câu nằm ở kho nào (mã câu duy nhất xuyên kho). NULL = không thấy (kể cả câu đã vào rác vẫn tính là thấy).
create or replace function public._kho_cua_cau(p_ma_cau text) returns text
 language plpgsql stable security definer set search_path to 'public' as $$
declare k text; v_ok boolean;
begin
  foreach k in array array['toan','hgt','hinh_hoc','khtn','vatly','hoahoc','anh','tsa'] loop
    execute format('select exists (select 1 from %I where ma_cau = $1)', public.fn_kho_tbl(k) || '_cau_hoi') into v_ok using p_ma_cau;
    if v_ok then return k; end if;
  end loop;
  return null;
end $$;

create or replace function public._kho_khoi_cua_cau(p_kho text, p_ma_cau text) returns text
 language plpgsql stable security definer set search_path to 'public' as $$
declare t text := public.fn_kho_tbl(p_kho); v text;
begin
  if t is null then return null; end if;
  execute format('select b.khoi from %I c join %I b on b.ma_dang = c.dang_chinh where c.ma_cau = $1', t || '_cau_hoi', t || '_ban_do') into v using p_ma_cau;
  return v;
end $$;

-- Người gọi có phải trưởng khối (trở lên) đúng khối của câu không. Kết nối script/DB (không JWT) = có.
create or replace function public._kho_la_truong_khoi_cua_cau(p_kho text, p_ma_cau text) returns boolean
 language plpgsql stable security definer set search_path to 'public' as $$
declare v_khoi text;
begin
  if public.jwt_uid() is null then return true; end if;
  v_khoi := public._kho_khoi_cua_cau(p_kho, p_ma_cau);
  if v_khoi is null then return public._qlcl_toan_he(); end if;
  return public._truong_khoi_tro_len(public._kho_mon_label(p_kho), v_khoi);
end $$;

-- Điền kho / khối / mon cho báo cáo mới nếu thiếu (đường học sinh không khai kho).
create or replace function public._bao_sai_dien_kho() returns trigger
 language plpgsql security definer set search_path to 'public' as $$
begin
  if new.kho is null then new.kho := public._kho_cua_cau(new.ma_cau); end if;
  if new.kho is not null and new.khoi is null then new.khoi := public._kho_khoi_cua_cau(new.kho, new.ma_cau); end if;
  return new;
end $$;
drop trigger if exists trg_bao_sai_dien_kho on public.bai_cau_bao_loi;
create trigger trg_bao_sai_dien_kho before insert on public.bai_cau_bao_loi for each row execute function public._bao_sai_dien_kho();

-- Backfill 126 báo cáo cũ (chỉ cột đang trống)
update public.bai_cau_bao_loi set kho = public._kho_cua_cau(ma_cau) where kho is null;
update public.bai_cau_bao_loi set khoi = public._kho_khoi_cua_cau(kho, ma_cau) where kho is not null and khoi is null;

-- ---------- Nhân sự báo sai ----------
create or replace function public.fn_kho_bao_sai(p_ma_cau text, p_loai text, p_ghi_chu text, p_kho text default null) returns uuid
 language plpgsql security definer set search_path to 'public' as $$
declare v_ns uuid := public.current_nhan_su_id(); v_kho text := coalesce(nullif(p_kho, ''), public._kho_cua_cau(p_ma_cau));
        v_ghi text := nullif(btrim(coalesce(p_ghi_chu, '')), ''); v_id uuid;
begin
  if v_ns is null then raise exception 'Chỉ nhân sự đang làm việc mới báo sai câu trong kho.' using errcode = '42501'; end if;
  if p_loai not in ('trinh_bay','tinh_sai','sai_de','sai_dang','khac') then raise exception 'Loại lỗi không hợp lệ.' using errcode = '22023'; end if;
  if v_ghi is null or length(v_ghi) < 5 then raise exception 'Viết rõ lỗi gì (ít nhất vài chữ) để Claude và trưởng khối xử lý.' using errcode = '22023'; end if;
  if length(v_ghi) > 500 then raise exception 'Ghi chú tối đa 500 chữ.' using errcode = '22023'; end if;
  if v_kho is null or public.fn_kho_tbl(v_kho) is null then raise exception 'Không tìm thấy câu % trong kho.', p_ma_cau using errcode = 'P0002'; end if;
  if public._kho_cua_cau(p_ma_cau) is distinct from v_kho then raise exception 'Câu % không thuộc kho %.', p_ma_cau, v_kho using errcode = 'P0002'; end if;
  insert into public.bai_cau_bao_loi (nhan_su_id, nguon, mon, kho, ma_cau, ly_do, ghi_chu)
  values (v_ns, 'nhan_su', public._kho_mon_label(v_kho), v_kho, p_ma_cau, p_loai, v_ghi)
  on conflict (nhan_su_id, mon, ma_cau, ly_do) where trang_thai = 'moi' and nhan_su_id is not null
    do update set ghi_chu = excluded.ghi_chu
  returning id into v_id;
  return v_id;
end $$;

-- ---------- Trưởng khối xử lý: sửa / xoá / không phải lỗi — LUÔN kèm báo lỗi ----------
-- Chưa có báo cáo mở cho câu này ⇒ bắt buộc kèm loại + ghi chú (hàm tự tạo báo cáo cho chính người xử lý, cùng giao dịch).
create or replace function public.fn_kho_bao_sai_xu_ly(p_ma_cau text, p_hanh_dong text, p_ket_qua text,
                                                      p_loai text default null, p_ghi_chu text default null, p_kho text default null) returns jsonb
 language plpgsql security definer set search_path to 'public' as $$
declare v_kho text := coalesce(nullif(p_kho, ''), public._kho_cua_cau(p_ma_cau)); v_mon text; v_ket text := nullif(btrim(coalesce(p_ket_qua, '')), '');
        v_n integer; v_xoa integer := 0; v_co boolean;
begin
  if v_kho is null or public.fn_kho_tbl(v_kho) is null then raise exception 'Không tìm thấy câu % trong kho.', p_ma_cau using errcode = 'P0002'; end if;
  if p_hanh_dong not in ('sua','xoa','khong_loi') then raise exception 'Hành động không hợp lệ.' using errcode = '22023'; end if;
  if v_ket is null or length(v_ket) < 5 then raise exception 'Ghi rõ đã làm gì / vì sao (ít nhất vài chữ).' using errcode = '22023'; end if;
  if not public._kho_la_truong_khoi_cua_cau(v_kho, p_ma_cau) then
    raise exception 'Chỉ trưởng khối đúng khối của câu (hoặc cấp trên) mới sửa / xoá câu.' using errcode = '42501';
  end if;
  v_mon := public._kho_mon_label(v_kho);

  select exists (select 1 from public.bai_cau_bao_loi where mon = v_mon and ma_cau = p_ma_cau and trang_thai = 'moi') into v_co;
  if not v_co then
    if p_loai is null or nullif(btrim(coalesce(p_ghi_chu, '')), '') is null then
      raise exception 'Phải báo lỗi trước: chọn loại lỗi và ghi lỗi gì (câu chưa có báo cáo nào đang mở).' using errcode = '22023';
    end if;
    perform public.fn_kho_bao_sai(p_ma_cau, p_loai, p_ghi_chu, v_kho);
  end if;

  if p_hanh_dong = 'xoa' then
    execute format('update %I set xoa_at = now() where ma_cau = $1 and xoa_at is null', public.fn_kho_tbl(v_kho) || '_cau_hoi') using p_ma_cau;
    get diagnostics v_xoa = row_count;
  end if;

  update public.bai_cau_bao_loi
     set trang_thai = case when p_hanh_dong = 'khong_loi' then 'khong_loi' else 'da_xu_ly' end,
         hanh_dong = p_hanh_dong, xu_ly_boi = public.jwt_uid(), xu_ly_at = now(), xu_ly_ghi_chu = v_ket
   where mon = v_mon and ma_cau = p_ma_cau and trang_thai = 'moi';
  get diagnostics v_n = row_count;
  return jsonb_build_object('da_dong', v_n, 'da_xoa', v_xoa);
end $$;

-- ---------- Hàng đợi cho trưởng khối (theo phạm vi môn × khối) ----------
create or replace function public.fn_kho_bao_sai_ds(p_trang_thai text default 'moi') returns jsonb
 language plpgsql stable security definer set search_path to 'public' as $$
declare r record; v_out jsonb := '[]'::jsonb; v_nd text; v_all boolean := public._qlcl_toan_he();   -- bdkt KHÔNG đủ: trưởng khối cũng có bdkt mà chỉ được thấy khối mình
begin
  if p_trang_thai not in ('moi','da_xu_ly','khong_loi') then raise exception 'Trạng thái không hợp lệ' using errcode = '22023'; end if;
  for r in
    select b.mon, b.kho, b.khoi, b.ma_cau,
           count(*) so_bao, count(distinct b.hoc_sinh_id) so_hs, count(distinct b.nhan_su_id) so_ns,
           max(b.created_at) moi_nhat,
           (select jsonb_object_agg(l, n) from (select b2.ly_do l, count(*) n from public.bai_cau_bao_loi b2
              where b2.mon = b.mon and b2.ma_cau = b.ma_cau and b2.trang_thai = p_trang_thai group by b2.ly_do) q) ly_do,
           (select coalesce(jsonb_agg(g), '[]'::jsonb) from (select coalesce(n2.ho_ten || ': ', 'HS: ') || b3.ghi_chu g
              from public.bai_cau_bao_loi b3 left join public.nhan_su n2 on n2.id = b3.nhan_su_id
              where b3.mon = b.mon and b3.ma_cau = b.ma_cau and b3.trang_thai = p_trang_thai and b3.ghi_chu is not null
              order by b3.created_at desc limit 4) q2) ghi_chu,
           (array_agg(b.hanh_dong order by b.xu_ly_at desc nulls last))[1] hanh_dong,
           (array_agg(b.xu_ly_ghi_chu order by b.xu_ly_at desc nulls last))[1] ket_qua
      from public.bai_cau_bao_loi b
     where b.trang_thai = p_trang_thai
       and (v_all or exists (select 1 from public.fn_pham_vi_cua_toi() v where v.mon = b.mon and v.khoi = b.khoi))
     group by b.mon, b.kho, b.khoi, b.ma_cau
     order by (count(distinct b.hoc_sinh_id) + count(distinct b.nhan_su_id)) desc, max(b.created_at) desc
     limit 200
  loop
    v_nd := null;
    if r.kho is not null then
      execute format('select left(coalesce(noi_dung, ''''), 400) from %I where ma_cau = $1', public.fn_kho_tbl(r.kho) || '_cau_hoi') into v_nd using r.ma_cau;
    end if;
    v_out := v_out || jsonb_build_array(jsonb_build_object(
      'mon', r.mon, 'kho', r.kho, 'khoi', r.khoi, 'ma_cau', r.ma_cau, 'so_bao', r.so_bao, 'so_hs', r.so_hs, 'so_ns', r.so_ns,
      'moi_nhat', r.moi_nhat, 'ly_do', coalesce(r.ly_do, '{}'::jsonb), 'ghi_chu', r.ghi_chu, 'noi_dung', v_nd,
      'hanh_dong', r.hanh_dong, 'ket_qua', r.ket_qua,
      'xu_ly_duoc', r.kho is not null and public._kho_la_truong_khoi_cua_cau(r.kho, r.ma_cau)));
  end loop;
  return v_out;
end $$;

-- ---------- Quyền ----------
revoke execute on function public._kho_mon_label(text) from public, anon;
revoke execute on function public._kho_cua_cau(text) from public, anon;
revoke execute on function public._kho_khoi_cua_cau(text, text) from public, anon;
revoke execute on function public._kho_la_truong_khoi_cua_cau(text, text) from public, anon;
revoke execute on function public._bao_sai_dien_kho() from public, anon;
revoke execute on function public.fn_kho_bao_sai(text, text, text, text) from public, anon;
revoke execute on function public.fn_kho_bao_sai_xu_ly(text, text, text, text, text, text) from public, anon;
revoke execute on function public.fn_kho_bao_sai_ds(text) from public, anon;
grant execute on function public._kho_la_truong_khoi_cua_cau(text, text) to authenticated;
grant execute on function public.fn_kho_bao_sai(text, text, text, text) to authenticated;
grant execute on function public.fn_kho_bao_sai_xu_ly(text, text, text, text, text, text) to authenticated;
grant execute on function public.fn_kho_bao_sai_ds(text) to authenticated;
