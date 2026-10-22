-- ============================================================================
-- 202610221334 — chuyen_de_hinh_theo_mo_hinh_kho
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 22/10: "mấy bài Hình 7 t cập nhật lại mô hình thì file Chuyên đề hình giữa kì ko tự cập nhật theo". Chuyên đề Hình
--   (mig 202610211633/202610211748) lưu bài vào khối mô hình LÚC ĐẶT ⇒ đổi mô hình ở kho (hinh_bai.mo_hinh_id) thì chuyên đề
--   vẫn để bài ở khối cũ / "Bài chưa có mô hình". Khối mô hình trong chuyên đề nghĩa là "bài của mô hình này" ⇒ phải đi theo kho.
--   Trigger trên hinh_bai: đổi mo_hinh_id ⇒ mọi chuyên đề đang chứa bài chuyển bài sang khối đúng (thiếu khối thì tạo):
--     · mô hình mới có khối trong tài liệu ⇒ vào khối đó (ưu tiên cùng phần) · chưa có ⇒ tạo khối ở phần đang có mô hình CÙNG NHÓM,
--       không có thì ở phần hiện tại · bỏ mô hình ⇒ khối "Bài chưa có mô hình" của phần hiện tại. Bài vào CUỐI khối.
--   Chạy 1 lần cho mọi chuyên đề Hình hiện có (K7 lệch 3 bài: HLB00251/255/257 đã gán MH.090 nhưng còn ở "Bài tập khác").
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì: "chuyển" = xoá dòng tai_lieu_cau ở khối cũ + thêm dòng cùng mã bài ở khối mới (cùng transaction). Khối cũ rỗng
--   vẫn giữ (người tự bỏ). Bài bị BỎ QUA ở kho KHÔNG tự rời chuyên đề (không xoá gì) — để người quyết.
-- ============================================================================

-- Chuyển 1 bài trong 1 tài liệu về khối đúng mô hình hiện tại ở kho. Trả true nếu có chuyển.
create or replace function _tl_hl_dong_bo_bai(p_tai_lieu uuid, p_ma_bai text) returns boolean
language plpgsql security definer set search_path to 'public' as $$
declare
  v_mh uuid; v_nhom text; r record; v_dich uuid; v_phan uuid; v_doi boolean := false;
begin
  select b.mo_hinh_id, m.nhom_mh_id into v_mh, v_nhom from hinh_bai b left join hinh_mo_hinh m on m.id = b.mo_hinh_id where b.ma_bai = p_ma_bai;
  for r in
    select tc.id, tc.phan_id, p.cha_id, p.loai_phan, p.ref_ma
      from tai_lieu_cau tc join tai_lieu_phan p on p.id = tc.phan_id
     where p.tai_lieu_id = p_tai_lieu and tc.ma_cau = p_ma_bai and p.loai_phan in ('hl_mo_hinh', 'hl_khac')
  loop
    if (v_mh is null and r.loai_phan = 'hl_khac') or (v_mh is not null and r.ref_ma = v_mh::text) then continue; end if;
    v_dich := null;
    if v_mh is null then
      select p.id into v_dich from tai_lieu_phan p where p.cha_id = r.cha_id and p.loai_phan = 'hl_khac' limit 1;
      if v_dich is null then
        insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, cha_id) values (p_tai_lieu, 2147483000, 'hl_khac', r.cha_id) returning id into v_dich;
      end if;
    else
      select p.id into v_dich from tai_lieu_phan p join tai_lieu_phan b on b.id = p.cha_id
       where p.tai_lieu_id = p_tai_lieu and p.loai_phan = 'hl_mo_hinh' and p.ref_ma = v_mh::text
       order by (p.cha_id = r.cha_id) desc, b.thu_tu, p.thu_tu limit 1;
      if v_dich is null then
        -- phần chứa mô hình cùng nhóm (theo thứ tự tài liệu), không có thì phần đang chứa bài
        select p.cha_id into v_phan from tai_lieu_phan p join hinh_mo_hinh m on m.id::text = p.ref_ma join tai_lieu_phan b on b.id = p.cha_id
         where p.tai_lieu_id = p_tai_lieu and p.loai_phan = 'hl_mo_hinh' and v_nhom is not null and m.nhom_mh_id = v_nhom
         order by b.thu_tu limit 1;
        v_phan := coalesce(v_phan, r.cha_id);
        insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, cha_id)
        values (p_tai_lieu, (select coalesce(max(p.thu_tu), 0) + 1 from tai_lieu_phan p where p.cha_id = v_phan and p.loai_phan = 'hl_mo_hinh'), 'hl_mo_hinh', v_mh::text, v_phan)
        returning id into v_dich;   -- sau mô hình cuối phần
        -- _tl_hl_xep đã đánh số lại cả tài liệu ⇒ khối "chưa có mô hình" có thể trùng số với khối mới: đẩy về cuối phần như fn_tl_hl_dat_mo_hinh
        update tai_lieu_phan set thu_tu = 2147483000 where cha_id = v_phan and loai_phan = 'hl_khac';
      end if;
    end if;
    delete from tai_lieu_cau where id = r.id;
    if not exists (select 1 from tai_lieu_cau where phan_id = v_dich and ma_cau = p_ma_bai) then
      insert into tai_lieu_cau (phan_id, ma_cau, thu_tu)
      values (v_dich, p_ma_bai, (select coalesce(max(thu_tu), -1) + 1 from tai_lieu_cau where phan_id = v_dich));
    end if;
    v_doi := true;
  end loop;
  if v_doi then
    perform _tl_hl_xep(p_tai_lieu);
    update tai_lieu set updated_at = now() where id = p_tai_lieu;   -- đổi nội dung con ⇒ bump cha (CLAUDE.md §2)
  end if;
  return v_doi;
end $$;
revoke execute on function _tl_hl_dong_bo_bai(uuid, text) from public, anon, authenticated;

create or replace function _hinh_bai_dong_bo_chuyen_de() returns trigger
language plpgsql security definer set search_path to 'public' as $$
declare v_tl uuid;
begin
  for v_tl in select distinct p.tai_lieu_id from tai_lieu_cau tc join tai_lieu_phan p on p.id = tc.phan_id
               where tc.ma_cau = new.ma_bai and p.loai_phan in ('hl_mo_hinh', 'hl_khac') loop
    perform _tl_hl_dong_bo_bai(v_tl, new.ma_bai);
  end loop;
  return null;
end $$;

drop trigger if exists trg_hinh_bai_dong_bo_chuyen_de on hinh_bai;
create trigger trg_hinh_bai_dong_bo_chuyen_de after update of mo_hinh_id on hinh_bai
  for each row when (old.mo_hinh_id is distinct from new.mo_hinh_id) execute function _hinh_bai_dong_bo_chuyen_de();

-- Một lần cho mọi chuyên đề Hình hiện có
do $$
declare r record; n int := 0;
begin
  for r in select distinct p.tai_lieu_id, tc.ma_cau from tai_lieu_cau tc join tai_lieu_phan p on p.id = tc.phan_id
            where p.loai_phan in ('hl_mo_hinh', 'hl_khac') loop
    if _tl_hl_dong_bo_bai(r.tai_lieu_id, r.ma_cau) then n := n + 1; end if;
  end loop;
  raise notice 'Chuyên đề Hình: chuyển % bài về đúng mô hình kho', n;
end $$;
