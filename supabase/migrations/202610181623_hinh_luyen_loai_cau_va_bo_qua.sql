-- ============================================================================
-- 202610181623 — hinh_luyen_loai_cau_va_bo_qua
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 18/10):
--   (1) "Các mô hình này chỉ lấy bài TỰ LUẬN thôi. Trắc nghiệm sẽ cho vào 1 kho riêng" — màn Duyệt kho › Hình luyện ·
--       chưa phân mô hình đang lẫn bài trắc nghiệm / đúng sai / trả lời ngắn (bản nhập từ đề thi có câu gốc gắn nhãn
--       `tu_luan` nhưng thật ra là đúng sai, chọn đáp án…).
--       ⇒ hinh_bai.loai_cau ('tu_luan' mặc định · 'trac_nghiem' · 'dung_sai' · 'tra_loi_ngan'). Hàng duyệt mô hình CHỈ
--         lấy 'tu_luan'; loại khác nằm ở "kho riêng" (xem được ở cùng màn, đổi lại được nếu máy xếp nhầm).
--   (2) "Cho t 1 nút BỎ QUA = không duyệt vào kho, có chỗ ghi LÝ DO như Cần sửa"
--       ⇒ hinh_bai.bo_qua_at/boi/ly_do (ly_do BẮT BUỘC). Bài bỏ qua rời hàng duyệt, xem lại + khôi phục được.
--   Đổi trạng thái ghi vết bằng TRIGGER vào hinh_bai_trang_thai_log (CLAUDE.md §4).
--
-- MẤT GÌ: không. Thêm cột/bảng/hàm; fn_hl_kho_chua_phan đổi chữ ký (thêm p_che_do) nên DROP bản 3 tham số rồi tạo lại.
-- PHÂN LOẠI BAN ĐẦU: lấy từ câu gốc hinh_hoc_cau_hoi.loai_cau (tra_loi_ngan/trac_nghiem/dung_sai) + 6 bài đã đọc tay
--   mà câu gốc gắn sai `tu_luan`: HLB00102/107/108/113/121 = đúng sai · HLB00117 = chọn câu sai (trắc nghiệm).
-- ============================================================================
alter table hinh_bai
  add column if not exists loai_cau text not null default 'tu_luan',
  add column if not exists bo_qua_at timestamptz,
  add column if not exists bo_qua_boi uuid references nhan_su(id),
  add column if not exists bo_qua_ly_do text;

alter table hinh_bai drop constraint if exists hinh_bai_loai_cau_check;
alter table hinh_bai add constraint hinh_bai_loai_cau_check check (loai_cau in ('tu_luan', 'trac_nghiem', 'dung_sai', 'tra_loi_ngan'));
alter table hinh_bai drop constraint if exists hinh_bai_bo_qua_co_ly_do;
alter table hinh_bai add constraint hinh_bai_bo_qua_co_ly_do check (bo_qua_at is null or length(btrim(coalesce(bo_qua_ly_do, ''))) > 0);

-- backfill: theo câu gốc
update hinh_bai hb
   set loai_cau = h.loai_cau
  from hinh_hoc_cau_hoi h
 where h.ma_cau = hb.nguon_ma_cau and h.loai_cau in ('tra_loi_ngan', 'trac_nghiem', 'dung_sai') and hb.loai_cau <> h.loai_cau;
-- backfill: 6 bài câu gốc gắn sai
update hinh_bai set loai_cau = 'dung_sai'    where ma_bai in ('HLB00102', 'HLB00107', 'HLB00108', 'HLB00113', 'HLB00121') and loai_cau = 'tu_luan';
update hinh_bai set loai_cau = 'trac_nghiem' where ma_bai = 'HLB00117' and loai_cau = 'tu_luan';

-- ── vết đổi trạng thái ─────────────────────────────────────────────────────
create table if not exists hinh_bai_trang_thai_log (
  id bigserial primary key,
  bai_id uuid not null references hinh_bai(id) on delete cascade,
  hanh_dong text not null check (hanh_dong in ('bo_qua', 'khoi_phuc', 'doi_loai')),
  loai_cau_cu text, loai_cau_moi text, ly_do text,
  boi uuid references nhan_su(id),
  at timestamptz not null default now()
);
create index if not exists hinh_bai_trang_thai_log_bai on hinh_bai_trang_thai_log(bai_id, at desc);
alter table hinh_bai_trang_thai_log enable row level security;
drop policy if exists hinh_bai_trang_thai_log_member on hinh_bai_trang_thai_log;
create policy hinh_bai_trang_thai_log_member on hinh_bai_trang_thai_log for all to authenticated using (la_thanh_vien()) with check (la_thanh_vien());
drop policy if exists claude_ro_select on hinh_bai_trang_thai_log;
create policy claude_ro_select on hinh_bai_trang_thai_log for select to claude_ro using (true);

create or replace function _hl_bai_ghi_log() returns trigger language plpgsql set search_path = public as $$
begin
  if new.bo_qua_at is not null and old.bo_qua_at is null then
    insert into hinh_bai_trang_thai_log(bai_id, hanh_dong, loai_cau_cu, loai_cau_moi, ly_do, boi) values (new.id, 'bo_qua', old.loai_cau, new.loai_cau, new.bo_qua_ly_do, current_nhan_su_id());
  elsif new.bo_qua_at is null and old.bo_qua_at is not null then
    insert into hinh_bai_trang_thai_log(bai_id, hanh_dong, loai_cau_cu, loai_cau_moi, ly_do, boi) values (new.id, 'khoi_phuc', old.loai_cau, new.loai_cau, old.bo_qua_ly_do, current_nhan_su_id());
  end if;
  if new.loai_cau is distinct from old.loai_cau then
    insert into hinh_bai_trang_thai_log(bai_id, hanh_dong, loai_cau_cu, loai_cau_moi, boi) values (new.id, 'doi_loai', old.loai_cau, new.loai_cau, current_nhan_su_id());
  end if;
  return null;
end $$;
drop trigger if exists trg_hinh_bai_trang_thai_log on hinh_bai;
create trigger trg_hinh_bai_trang_thai_log after update of loai_cau, bo_qua_at on hinh_bai for each row execute function _hl_bai_ghi_log();

-- ── hàng đợi: p_che_do = 'cho' (tự luận, chưa bỏ qua) | 'bo_qua' (đã bỏ qua) | 'khac' (kho riêng: trắc nghiệm/đúng sai/trả lời ngắn) ──
drop function if exists fn_hl_kho_chua_phan(text, integer, integer);
create or replace function fn_hl_kho_chua_phan(p_khoi text, p_gioi_han integer default 30, p_bo_qua integer default 0, p_che_do text default 'cho')
returns jsonb language sql stable set search_path to 'public' as $function$
  with b as (
    select hb.* from hinh_bai hb
     where (p_khoi is null or hb.khoi = p_khoi)
       and hb.mo_hinh_id is null
       and not exists (select 1 from hinh_y y where y.bai_id = hb.id and y.baitoan_id is not null)
       and case coalesce(p_che_do, 'cho')
             when 'bo_qua' then hb.bo_qua_at is not null
             when 'khac'   then hb.bo_qua_at is null and hb.loai_cau <> 'tu_luan'
             else               hb.bo_qua_at is null and hb.loai_cau = 'tu_luan' end
     order by hb.created_at, hb.ma_bai
     limit greatest(1, least(coalesce(p_gioi_han, 30), 200)) offset greatest(0, coalesce(p_bo_qua, 0))
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'ma_bai', b.ma_bai, 'khoi', b.khoi, 'nguon', b.nguon, 'nguon_ma_cau', b.nguon_ma_cau,
    'de_bai', b.de_bai, 'gia_thiet_chung', b.gia_thiet_chung, 'huong_dan', b.huong_dan, 'anh_de', b.anh_de,
    'can_tach_tay', b.can_tach_tay, 'mo_hinh_id', b.mo_hinh_id,
    'loai_cau', b.loai_cau, 'bo_qua_at', b.bo_qua_at, 'bo_qua_ly_do', b.bo_qua_ly_do,
    'bo_qua_ten', (select ns.ho_ten from nhan_su ns where ns.id = b.bo_qua_boi),
    'y', (select coalesce(jsonb_agg(jsonb_build_object(
            'id', y.id, 'ma_y', y.ma_y, 'thu_tu', y.thu_tu, 'nhan', y.nhan_hien_thi, 'noi_dung', y.noi_dung,
            'gia_thiet_them', y.gia_thiet_them, 'dap_an', y.dap_an, 'loi_giai', y.loi_giai, 'anh_loi_giai', y.anh_loi_giai,
            'anh_de', y.anh_de, 'da_duyet', y.da_duyet, 'baitoan_id', y.baitoan_id) order by y.thu_tu), '[]'::jsonb)
            from hinh_y y where y.bai_id = b.id)
  ) order by b.created_at, b.ma_bai), '[]'::jsonb) from b
$function$;
revoke execute on function fn_hl_kho_chua_phan(text, integer, integer, text) from public, anon;
grant execute on function fn_hl_kho_chua_phan(text, integer, integer, text) to authenticated;

-- đếm "chờ duyệt" = tự luận chưa bỏ qua (badge trên tab + thanh tiến độ)
create or replace function fn_hl_dem_chua_phan()
returns table(khoi text, so_bai bigint, so_y bigint) language sql stable set search_path to 'public' as $function$
  select hb.khoi, count(distinct hb.id), count(y.id)
    from hinh_bai hb left join hinh_y y on y.bai_id = hb.id
   where hb.mo_hinh_id is null and hb.bo_qua_at is null and hb.loai_cau = 'tu_luan'
     and not exists (select 1 from hinh_y y2 where y2.bai_id = hb.id and y2.baitoan_id is not null)
   group by hb.khoi
$function$;

-- đếm hai hàng phụ của một khối: đã bỏ qua · kho riêng (không tự luận, chưa bỏ qua)
create or replace function fn_hl_dem_hang_phu(p_khoi text)
returns table(bo_qua bigint, khac bigint) language sql stable set search_path to 'public' as $function$
  select count(*) filter (where hb.bo_qua_at is not null),
         count(*) filter (where hb.bo_qua_at is null and hb.loai_cau <> 'tu_luan')
    from hinh_bai hb
   where (p_khoi is null or hb.khoi = p_khoi) and hb.mo_hinh_id is null
     and not exists (select 1 from hinh_y y where y.bai_id = hb.id and y.baitoan_id is not null)
$function$;
revoke execute on function fn_hl_dem_hang_phu(text) from public, anon;
grant execute on function fn_hl_dem_hang_phu(text) to authenticated;

-- ── ghi ─────────────────────────────────────────────────────────────────────
create or replace function fn_hl_bo_qua_bai(p_bai uuid, p_ly_do text)
returns void language plpgsql set search_path = public as $$
begin
  if length(btrim(coalesce(p_ly_do, ''))) = 0 then raise exception 'Phải ghi lý do bỏ qua'; end if;
  if not exists (select 1 from hinh_bai where id = p_bai) then raise exception 'Bài không tồn tại'; end if;
  if exists (select 1 from hinh_bai where id = p_bai and mo_hinh_id is not null) then raise exception 'Bài đã gán mô hình — gỡ mô hình trước rồi mới bỏ qua'; end if;
  update hinh_bai set bo_qua_at = now(), bo_qua_boi = current_nhan_su_id(), bo_qua_ly_do = btrim(p_ly_do),
         da_duyet = false, duyet_boi = null, duyet_at = null, updated_at = now()
   where id = p_bai;
  update hinh_y set da_duyet = false, updated_at = now() where bai_id = p_bai and da_duyet;
end $$;

create or replace function fn_hl_khoi_phuc_bai(p_bai uuid)
returns void language plpgsql set search_path = public as $$
begin
  if not exists (select 1 from hinh_bai where id = p_bai) then raise exception 'Bài không tồn tại'; end if;
  update hinh_bai set bo_qua_at = null, bo_qua_boi = null, bo_qua_ly_do = null, updated_at = now() where id = p_bai;
end $$;

create or replace function fn_hl_doi_loai_bai(p_bai uuid, p_loai text)
returns void language plpgsql set search_path = public as $$
begin
  if p_loai not in ('tu_luan', 'trac_nghiem', 'dung_sai', 'tra_loi_ngan') then raise exception 'Loại câu không hợp lệ: %', p_loai; end if;
  if not exists (select 1 from hinh_bai where id = p_bai) then raise exception 'Bài không tồn tại'; end if;
  update hinh_bai set loai_cau = p_loai, updated_at = now() where id = p_bai;
end $$;

revoke execute on function fn_hl_bo_qua_bai(uuid, text), fn_hl_khoi_phuc_bai(uuid), fn_hl_doi_loai_bai(uuid, text) from public, anon;
grant execute on function fn_hl_bo_qua_bai(uuid, text), fn_hl_khoi_phuc_bai(uuid), fn_hl_doi_loai_bai(uuid, text) to authenticated;
