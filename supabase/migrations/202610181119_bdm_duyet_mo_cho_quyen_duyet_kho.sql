-- Duyệt kho ở BẢN ĐỒ MỚI: mở cho người có quyền GHI chức năng "Duyệt kho" (Thùy 18/10: "mở quyền duyệt kho cho team học thuật,
-- hiện tại hình như chỉ có mỗi t").
--   Trước: chỉ admin hoặc người đã được giao PHẠM VI (dai_bdm_duyet_pham_vi) — chưa ai được giao ⇒ chỉ admin thấy hàng duyệt.
--   Sau:  + ai có co_quyen_ghi('duyetloigiai') (theo vai trò: Học thuật, Core team…) mà CHƯA được giao phạm vi nào ⇒ duyệt mọi khối.
--         Ai ĐÃ được giao phạm vi thì vẫn chỉ trong phạm vi đó (giữ cách chia việc không trùng của spec-ban-do-4-tang §13).
-- Quyền đi theo vai trò (vai_tro_chuc_nang), không gắn cứng tên team. Mọi hàm hàng đợi / quyết định đều đi qua hàm này.

create or replace function _bdm_duyet_duoc(p_khoi text, p_chu_de text)
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select la_admin from my_quyen()), false)
      or exists (
        select 1 from dai_bdm_duyet_pham_vi v
         where v.tai_khoan_id = jwt_uid() and v.khoi = p_khoi
           and (v.chu_de_id = p_chu_de
                or (v.chu_de_id is null
                    and not exists (select 1 from dai_bdm_duyet_pham_vi w where w.khoi = p_khoi and w.chu_de_id = p_chu_de)))
      )
      or (not exists (select 1 from dai_bdm_duyet_pham_vi v where v.tai_khoan_id = jwt_uid())
          and co_quyen_ghi('duyetloigiai'))
$$;
