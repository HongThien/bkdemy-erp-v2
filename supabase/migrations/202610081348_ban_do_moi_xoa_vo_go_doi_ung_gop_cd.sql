-- ════════════════════════════════════════════════════════════════════════════
-- BẢN ĐỒ MỚI (NHÁP) — chuẩn bị chép VỎ bản đồ cũ (CEO 08/10) · spec-ban-do-4-tang.md §9.3
--
-- ① Xoá trong vỏ TỰ GỠ đối ứng (thay vì chặn): vỏ chép sẵn thì nhóm/dạng bài nào cũng có dạng cũ / cụm cũ gắn vào,
--    chặn thì CEO không dọn được. Gỡ ⇒ dạng cũ / cụm cũ quay lại "chưa gắn" — HIỆN ĐỎ ở ngăn Bản đồ cũ + badge, không mất dấu.
--    RIÊNG câu đã gán (dai_bdm_gan_cau = công người/AI) VẪN CHẶN.
-- ② fn_bdm_gop_chuyen_de: vỏ chép ra mỗi chủ đề có chuyên đề riêng ⇒ gộp X vào Y để thành chuyên đề DÙNG CHUNG.
-- ════════════════════════════════════════════════════════════════════════════

alter table dai_bdm_doi_ung
  drop constraint dai_bdm_doi_ung_dich_dang_bai_fkey,
  drop constraint dai_bdm_doi_ung_dich_nhom_fkey,
  drop constraint dai_bdm_doi_ung_dich_chu_de_dich_chuyen_de_fkey,
  add constraint dai_bdm_doi_ung_dich_dang_bai_fkey foreign key (dich_dang_bai) references dai_bdm_dang_bai(id) on delete cascade,
  add constraint dai_bdm_doi_ung_dich_nhom_fkey foreign key (dich_nhom) references dai_bdm_nhom(id) on delete cascade,
  add constraint dai_bdm_doi_ung_dich_chu_de_dich_chuyen_de_fkey foreign key (dich_chu_de, dich_chuyen_de)
      references dai_bdm_o (chu_de_id, chuyen_de_id) on update cascade on delete cascade;

alter table dai_bdm_doi_ung_cum
  drop constraint dai_bdm_doi_ung_cum_dang_bai_id_fkey,
  add constraint dai_bdm_doi_ung_cum_dang_bai_id_fkey foreign key (dang_bai_id) references dai_bdm_dang_bai(id) on delete cascade;

-- Gộp chuyên đề X vào Y: mọi ô của X ⇒ ô của Y (chủ đề đã có Y thì dồn nhóm vào, xếp sau nhóm sẵn có).
-- Nhóm, mũi tên tiền đề, đối ứng ③ đi theo. X biến mất. Mô tả X chuyển sang Y nếu Y chưa có mô tả.
create or replace function fn_bdm_gop_chuyen_de(p_tu text, p_vao text)
returns void language plpgsql as $$
declare
  r record;
begin
  if p_tu = p_vao then raise exception 'Không thể gộp chuyên đề vào chính nó'; end if;
  if not exists (select 1 from dai_bdm_chuyen_de where id = p_vao) then raise exception 'Không tìm thấy chuyên đề đích %', p_vao; end if;
  for r in select chu_de_id from dai_bdm_o where chuyen_de_id = p_tu loop
    if exists (select 1 from dai_bdm_o where chu_de_id = r.chu_de_id and chuyen_de_id = p_vao) then
      update dai_bdm_nhom
         set chuyen_de_id = p_vao,
             thu_tu = thu_tu + (select coalesce(max(thu_tu), 0) from dai_bdm_nhom where chu_de_id = r.chu_de_id and chuyen_de_id = p_vao)
       where chu_de_id = r.chu_de_id and chuyen_de_id = p_tu;
      delete from dai_bdm_doi_ung d
       where d.dich_chu_de = r.chu_de_id and d.dich_chuyen_de = p_tu
         and exists (select 1 from dai_bdm_doi_ung e where e.ma_dang_cu = d.ma_dang_cu
                       and e.dich_chu_de = r.chu_de_id and e.dich_chuyen_de = p_vao);
      update dai_bdm_doi_ung set dich_chuyen_de = p_vao where dich_chu_de = r.chu_de_id and dich_chuyen_de = p_tu;
      delete from dai_bdm_o where chu_de_id = r.chu_de_id and chuyen_de_id = p_tu;
    else
      -- ON UPDATE CASCADE kéo nhóm + đối ứng ③ theo
      update dai_bdm_o set chuyen_de_id = p_vao where chu_de_id = r.chu_de_id and chuyen_de_id = p_tu;
    end if;
  end loop;
  update dai_bdm_chuyen_de v set mo_ta = t.mo_ta
    from dai_bdm_chuyen_de t where v.id = p_vao and t.id = p_tu and btrim(v.mo_ta) = '';
  delete from dai_bdm_chuyen_de where id = p_tu;
end $$;

revoke execute on function fn_bdm_gop_chuyen_de(text, text) from public, anon;
grant execute on function fn_bdm_gop_chuyen_de(text, text) to authenticated;
