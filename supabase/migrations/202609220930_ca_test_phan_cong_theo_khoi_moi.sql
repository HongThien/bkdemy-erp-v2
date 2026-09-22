-- ============================================================================
-- 202609220930 — ca_test_phan_cong_theo_khoi_moi
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO 22/09 "sao 4T lại sai phân công"): Nguyễn Đức Thành tạo ca 19/09 khi ứng viên khối 6 ⇒ trigger
--   `tg_ca_test_phan_cong` (BEFORE INSERT) gán người chấm/trả của khối 6. Ngày 20/09 sửa khối → 4T; trigger chỉ chạy
--   lúc INSERT ⇒ ca vẫn mang người của khối 6 trong khi bảng Phân công 4T là người khác.
-- LÀM: trigger AFTER UPDATE OF khoi trên `ung_vien` ⇒ gán lại người cho các ca của ứng viên đó theo phân công
--   (khối mới × môn): ca chưa chấm xong ⇒ đổi cả người chấm + người trả; ca chấm xong nhưng chưa trả ⇒ chỉ đổi
--   người trả. Ca đã trả bài / đã huỷ giữ nguyên. Khối mới chưa có phân công ⇒ không đụng (giữ người cũ còn hơn NULL).
--   + Vá retro: các ca đang lệch (người ≠ phân công của khối hiện tại) theo cùng luật.
-- MẤT GÌ (Luật xoá): không xoá. UPDATE ghi đè nguoi_cham_id / nguoi_tra_bai_id trên ca đang lệch (log ca_test ghi 'sua').
-- ============================================================================
create or replace function public.fn_ca_test_phan_cong_lai(p_ung_vien_id uuid, p_khoi text) returns integer
language plpgsql security definer set search_path = public as $$
declare n integer := 0;
begin
  if p_khoi is null then return 0; end if;
  with pc as (select mon, nguoi_cham_id, nguoi_tra_bai_id from public.test_dau_vao_phan_cong where khoi = p_khoi),
  upd as (
    update public.ca_test ct
       set nguoi_cham_id    = case when ct.cham_xong_at is null then pc.nguoi_cham_id else ct.nguoi_cham_id end,
           nguoi_tra_bai_id = pc.nguoi_tra_bai_id
      from pc
     where ct.ung_vien_id = p_ung_vien_id and ct.mon = pc.mon
       and ct.trang_thai <> 'huy' and ct.tra_bai_xong_at is null
       and (ct.nguoi_tra_bai_id is distinct from pc.nguoi_tra_bai_id
            or (ct.cham_xong_at is null and ct.nguoi_cham_id is distinct from pc.nguoi_cham_id))
     returning 1)
  select count(*) into n from upd;
  return n;
end $$;

create or replace function public.tg_ung_vien_doi_khoi_phan_cong() returns trigger
language plpgsql as $$
begin
  if new.khoi is distinct from old.khoi then perform public.fn_ca_test_phan_cong_lai(new.id, new.khoi); end if;
  return null;
end $$;
drop trigger if exists trg_ung_vien_doi_khoi_phan_cong on public.ung_vien;
create trigger trg_ung_vien_doi_khoi_phan_cong after update of khoi on public.ung_vien
  for each row execute function public.tg_ung_vien_doi_khoi_phan_cong();

-- Vá retro mọi ứng viên có ca đang lệch với phân công của khối hiện tại.
do $$
declare r record; tong integer := 0;
begin
  for r in
    select distinct uv.id, uv.khoi
      from public.ca_test ct join public.ung_vien uv on uv.id = ct.ung_vien_id
      join public.test_dau_vao_phan_cong pc on pc.khoi = uv.khoi and pc.mon = ct.mon
     where ct.trang_thai <> 'huy' and ct.tra_bai_xong_at is null
       and (ct.nguoi_tra_bai_id is distinct from pc.nguoi_tra_bai_id
            or (ct.cham_xong_at is null and ct.nguoi_cham_id is distinct from pc.nguoi_cham_id))
  loop tong := tong + public.fn_ca_test_phan_cong_lai(r.id, r.khoi); end loop;
  raise notice 'Vá retro: % ca gán lại người theo khối hiện tại', tong;
end $$;
