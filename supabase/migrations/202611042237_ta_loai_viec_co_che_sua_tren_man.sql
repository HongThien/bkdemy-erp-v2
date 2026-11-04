-- ============================================================================
-- 202611042237 — ta_loai_viec_co_che_sua_tren_man
-- ----------------------------------------------------------------------------
-- VÌ SAO — Thùy 04/11 ("làm đi"): danh sách LOẠI VIỆC + CƠ CHẾ tính lương phải sửa được trên màn (thêm · sửa · ngừng dùng),
--   giá của loại việc ngoài package đặt ngay tại đó. Trước: ta_loai_viec chỉ sửa được bằng migration; giá nối ngầm qua mã
--   'gia_<mã loại>' ⇒ Họp / Đào tạo 0đ mà không ai thấy.
--   · Cơ chế sửa được: 'bo_tro' (package, giờ vào chỉ tiêu bổ trợ của lớp) ↔ 'ngoai' (ngoài package: giờ/buổi × đơn giá).
--     Cơ chế ĐẶC THÙ (tro_giang 'tg' · trong_thi · cham_thi · bo_tro_dac_biet) có logic riêng trong _ta_luong_tinh / đối chiếu
--     ⇒ KHÔNG đổi cơ chế được (vẫn sửa tên, đơn vị nếu ngoài package, giá, cần lớp/HS).
--   · Mã loại = MÃ GỐC: DB cấp lúc thêm (từ tên, bỏ dấu), không bao giờ đổi; không xoá cứng (FK ta_cong_viec + lịch sử) — chỉ
--     NGỪNG DÙNG. 'khac' (Việc khác) không bật lại được (Thùy 04/11: chỉ ghi việc trong danh sách nghiệp vụ).
--   · Mọi thêm/sửa ghi vết ta_cong_log (thêm cột id uuid cho log chung). Quá khứ: bản chốt kỳ đã chụp kết quả + loai_viec
--     (_ta_thong_so_ky) ⇒ đổi cơ chế chỉ ảnh hưởng tháng CHƯA chốt.
-- MẤT GÌ (Luật xoá): không xoá gì. Thêm cột id, 2 trigger, 3 hàm.
-- ============================================================================

alter table public.ta_loai_viec add column if not exists id uuid not null default gen_random_uuid();
create unique index if not exists ta_loai_viec_id_key on public.ta_loai_viec(id);
alter table public.ta_loai_viec add column if not exists ghi_chu text not null default '';

create or replace function public._ta_loai_viec_kiem() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'DELETE' then raise exception 'Không xoá loại việc — dùng Ngừng dùng (giữ lịch sử các việc đã ghi)'; end if;
  if tg_op = 'UPDATE' then
    if new.ma is distinct from old.ma or new.id is distinct from old.id then raise exception 'Mã loại việc là mã gốc — không đổi được'; end if;
    if old.tinh_vao in ('tg', 'trong_thi', 'cham_thi', 'bo_tro_dac_biet')
       and (new.tinh_vao, new.nhom) is distinct from (old.tinh_vao, old.nhom) then
      raise exception 'Loại "%" có cơ chế đặc thù — không đổi cơ chế được', old.ten;
    end if;
    if old.tinh_vao = 'tg' and new.don_vi is distinct from old.don_vi then raise exception 'Trợ giảng tính theo buổi — không đổi đơn vị'; end if;
    if new.ma = 'khac' and new.active and not old.active then raise exception 'Việc khác đã ngừng — chỉ ghi việc trong danh sách nghiệp vụ'; end if;
  else
    if new.tinh_vao not in ('bo_tro', 'khac') then raise exception 'Loại mới chỉ chọn cơ chế Bổ trợ hoặc Ngoài package'; end if;
  end if;
  -- cơ chế phải nhất quán
  if new.tinh_vao = 'bo_tro' and (new.nhom <> 'package' or new.don_vi <> 'gio') then raise exception 'Cơ chế Bổ trợ = trong package, tính theo giờ'; end if;
  if new.tinh_vao = 'khac' and new.nhom <> 'ngoai_package' then raise exception 'Cơ chế Ngoài package phải ở nhóm ngoài package'; end if;
  if btrim(coalesce(new.ten, '')) = '' then raise exception 'Tên loại việc không được trống'; end if;
  return new;
end $$;
drop trigger if exists ta_loai_viec_kiem on public.ta_loai_viec;
create trigger ta_loai_viec_kiem before insert or update or delete on public.ta_loai_viec
  for each row execute function public._ta_loai_viec_kiem();
drop trigger if exists ta_loai_viec_log on public.ta_loai_viec;
create trigger ta_loai_viec_log after insert or update on public.ta_loai_viec
  for each row execute function public._ta_cong_ghi_log();

-- Danh sách loại việc + cơ chế + giá đang hiệu lực (hôm nay) + số việc đã ghi
create or replace function public.fn_ta_loai_viec_ds()
returns table (ma text, ten text, co_che text, dac_thu boolean, nhom text, tinh_vao text, don_vi text, can_lop boolean, can_hs boolean,
               thu_tu smallint, active boolean, ghi_chu text, gia_tri numeric, gia_hieu_luc_tu date, gia_id uuid, gia_khoa_ky date, so_viec bigint)
language plpgsql stable security definer set search_path = public as $$
declare v_ngay date := (now() at time zone 'Asia/Ho_Chi_Minh')::date;
begin
  if not public.co_chuc_nang('ta_luong') then raise exception 'Không có quyền xem loại việc'; end if;
  return query
  select l.ma, l.ten,
         case l.tinh_vao when 'tg' then 'tg' when 'bo_tro' then 'bo_tro' else 'ngoai' end,
         l.tinh_vao in ('tg', 'trong_thi', 'cham_thi', 'bo_tro_dac_biet'),
         l.nhom, l.tinh_vao, l.don_vi, l.can_lop, l.can_hs, l.thu_tu, l.active, l.ghi_chu,
         g.gia_tri, g.hieu_luc_tu, g.id, case when g.id is not null then public._ta_don_gia_ky_khoa(g.hieu_luc_tu) end,
         (select count(*) from ta_cong_viec v where v.loai_viec = l.ma)
    from ta_loai_viec l
    left join lateral (select d.id, d.gia_tri, d.hieu_luc_tu from ta_don_gia d
                        where d.ma = 'gia_' || l.ma and d.xoa_at is null and d.hieu_luc_tu <= v_ngay
                        order by d.hieu_luc_tu desc limit 1) g on l.nhom = 'ngoai_package'
   order by l.active desc, l.thu_tu, l.ma;
end $$;
revoke all on function public.fn_ta_loai_viec_ds() from public, anon;
grant execute on function public.fn_ta_loai_viec_ds() to authenticated;

-- Thêm (p_ma null) / sửa một loại việc. p_co_che: 'bo_tro' | 'ngoai' (bỏ qua với loại đặc thù).
-- p_gia + p_gia_tu: đặt giá mới (thêm dòng ta_don_gia 'gia_<mã>', có hiệu lực từ ngày đó) — chỉ cho loại ngoài package.
create or replace function public.fn_ta_loai_viec_luu(p_ma text, p_ten text, p_co_che text, p_don_vi text, p_can_lop boolean, p_can_hs boolean,
                                                      p_ghi_chu text default '', p_gia numeric default null, p_gia_tu date default null)
returns text
language plpgsql security definer set search_path = public as $$
declare o ta_loai_viec; v_ma text; v_goc text; v_n int := 1; v_nhom text; v_tinh text; v_dv text;
begin
  if not public.co_quyen_ghi('ta_luong') then raise exception 'Không có quyền sửa loại việc'; end if;
  if p_co_che not in ('bo_tro', 'ngoai', 'tg') then raise exception 'Cơ chế không hợp lệ'; end if;
  if p_don_vi not in ('gio', 'buoi') then raise exception 'Đơn vị phải là giờ hoặc buổi'; end if;
  if p_ma is not null then
    select * into o from ta_loai_viec where ma = p_ma for update;
    if o.ma is null then raise exception 'Không thấy loại việc %', p_ma; end if;
  end if;
  if o.tinh_vao in ('tg', 'trong_thi', 'cham_thi', 'bo_tro_dac_biet') then
    v_nhom := o.nhom; v_tinh := o.tinh_vao; v_dv := case when o.tinh_vao = 'tg' then o.don_vi else p_don_vi end;
  elsif p_co_che = 'bo_tro' then v_nhom := 'package'; v_tinh := 'bo_tro'; v_dv := 'gio';
  elsif p_co_che = 'ngoai' then v_nhom := 'ngoai_package'; v_tinh := 'khac'; v_dv := p_don_vi;
  else raise exception 'Cơ chế Trợ giảng chỉ dành cho loại Trợ giảng lớp học';
  end if;

  if p_ma is null then
    v_goc := btrim(regexp_replace(translate(lower(btrim(p_ten)),
               'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ',
               'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd'), '[^a-z0-9]+', '_', 'g'), '_');
    v_goc := left(coalesce(nullif(v_goc, ''), 'viec'), 40);
    v_ma := v_goc;
    while exists (select 1 from ta_loai_viec where ma = v_ma) or exists (select 1 from ta_don_gia where ma = 'gia_' || v_ma) loop
      v_n := v_n + 1; v_ma := v_goc || '_' || v_n;
    end loop;
    insert into ta_loai_viec (ma, ten, nhom, tinh_vao, don_vi, can_lop, can_hs, thu_tu, active, ghi_chu)
    values (v_ma, btrim(p_ten), v_nhom, v_tinh, v_dv, coalesce(p_can_lop, false), coalesce(p_can_hs, false),
            (select coalesce(max(thu_tu), 0) + 1 from ta_loai_viec where ma <> 'khac'), true, coalesce(p_ghi_chu, ''));
  else
    v_ma := p_ma;
    update ta_loai_viec set ten = btrim(p_ten), nhom = v_nhom, tinh_vao = v_tinh, don_vi = v_dv,
           can_lop = coalesce(p_can_lop, can_lop), can_hs = coalesce(p_can_hs, can_hs), ghi_chu = coalesce(p_ghi_chu, ghi_chu)
     where ma = v_ma;
  end if;

  if p_gia is not null then
    if v_nhom <> 'ngoai_package' then raise exception 'Chỉ loại ngoài package mới có đơn giá riêng'; end if;
    if p_gia < 0 then raise exception 'Giá phải ≥ 0'; end if;
    if p_gia_tu is null then raise exception 'Chọn ngày giá bắt đầu có hiệu lực'; end if;
    insert into ta_don_gia (ma, ten, gia_tri, don_vi, hieu_luc_tu, ghi_chu, tao_boi)
    values ('gia_' || v_ma, btrim(p_ten), p_gia, case v_dv when 'gio' then 'đ/giờ' else 'đ/buổi' end, p_gia_tu, '', public.current_nhan_su_id());
  end if;
  return v_ma;
end $$;
revoke all on function public.fn_ta_loai_viec_luu(text, text, text, text, boolean, boolean, text, numeric, date) from public, anon;
grant execute on function public.fn_ta_loai_viec_luu(text, text, text, text, boolean, boolean, text, numeric, date) to authenticated;

create or replace function public.fn_ta_loai_viec_dung(p_ma text, p_active boolean)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.co_quyen_ghi('ta_luong') then raise exception 'Không có quyền sửa loại việc'; end if;
  update ta_loai_viec set active = p_active where ma = p_ma;
  if not found then raise exception 'Không thấy loại việc %', p_ma; end if;
end $$;
revoke all on function public.fn_ta_loai_viec_dung(text, boolean) from public, anon;
grant execute on function public.fn_ta_loai_viec_dung(text, boolean) to authenticated;
