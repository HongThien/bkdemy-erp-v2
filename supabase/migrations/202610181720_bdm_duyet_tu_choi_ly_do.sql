-- Duyệt kho ở BẢN ĐỒ MỚI: TỪ CHỐI kèm LÝ DO (Thùy 18/10: "nhiều bài m đưa vào đây ko hợp lý").
--   'tu_choi' — AI xếp câu SAI chỗ: gỡ đề xuất / gán AI / cờ thiếu dạng của AI ⇒ câu về hàng "Chưa có dạng"; lý do được LƯU
--               (dai_bdm_tu_choi, append-only) để Claude rút luật xếp lại + không đề xuất lại đúng chỗ đó.
--   'kho_rac' — câu HỎNG / không dùng được: như 'tu_choi' + đưa câu vào kho rác (fn_kho_tu_choi_cau, soft-delete xoa_at).
--   Kiểm mẫu: từ chối câu AI đã gán (mức cao) = ghi kiem_mau 'doi' ⇒ độ chính xác đo được phản ánh đúng.
--   Chỉ gỡ dữ liệu của AI; gán của NGƯỜI (nguon='nguoi') không bị từ chối qua đường này.

create table if not exists dai_bdm_tu_choi (
  id             bigint generated always as identity primary key,
  ma_cau         text not null references dai_cau_hoi(ma_cau),
  dang_bai_ai_id text references dai_bdm_dang_bai(id),     -- chỗ AI đã đề xuất/gán; NULL = AI không đề xuất chỗ nào (câu ở hàng thiếu dạng)
  hang           text not null check (hang in ('de_xuat','mau','thieu','trong')),
  kho_rac        boolean not null default false,
  ly_do          text not null check (btrim(ly_do) <> ''),
  actor          uuid default jwt_uid(),
  at             timestamptz not null default now()
);
create index if not exists dai_bdm_tu_choi_cau_idx on dai_bdm_tu_choi (ma_cau);
alter table dai_bdm_tu_choi enable row level security;
drop policy if exists dai_bdm_tu_choi_doc on dai_bdm_tu_choi;
create policy dai_bdm_tu_choi_doc on dai_bdm_tu_choi for select to authenticated using (la_thanh_vien());
-- ghi CHỈ qua fn_bdm_khop_quyet (security invoker + policy insert); không sửa/xoá
drop policy if exists dai_bdm_tu_choi_ghi on dai_bdm_tu_choi;
create policy dai_bdm_tu_choi_ghi on dai_bdm_tu_choi for insert to authenticated with check (la_thanh_vien());
revoke update, delete, truncate on dai_bdm_tu_choi from authenticated, anon, public;
grant select, insert on dai_bdm_tu_choi to authenticated;

create or replace function public.fn_bdm_khop_quyet(p_ma_cau text, p_hanh_dong text, p_dang_bai text DEFAULT NULL::text, p_ly_do text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare
  v_khoi text; v_cd_hien text; v_cd_dich text; v_ai text; v_nguon text; v_dx text; v_hang text;
begin
  select b.khoi into v_khoi
    from dai_cau_hoi q join dai_ban_do b on b.ma_dang = q.dang_chinh
   where q.ma_cau = p_ma_cau and q.xoa_at is null;
  if v_khoi is null then raise exception 'Không tìm thấy câu % (hoặc đã vào kho rác)', p_ma_cau; end if;

  -- chủ đề HIỆN TẠI của câu (chỗ đang gán, hoặc chỗ đang được đề xuất); NULL = chưa có chỗ
  select g.dang_bai_id, g.nguon into v_ai, v_nguon from dai_bdm_gan_cau g where g.ma_cau = p_ma_cau;
  select x.dang_bai_id into v_dx from dai_bdm_de_xuat x where x.ma_cau = p_ma_cau;
  select cd.id into v_cd_hien
    from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
   where d.id = coalesce(v_ai, v_dx);
  if not _bdm_duyet_duoc(v_khoi, v_cd_hien) then
    raise exception 'Câu % nằm ngoài phạm vi duyệt của bạn', p_ma_cau;
  end if;

  if p_dang_bai is not null then
    select cd.id into v_cd_dich
      from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id
     where d.id = p_dang_bai and cd.khoi = v_khoi;
    if v_cd_dich is null then raise exception 'Dạng bài % không tồn tại trong khối %', p_dang_bai, v_khoi; end if;
  end if;

  if p_hanh_dong = 'gan' then
    if p_dang_bai is null then raise exception 'Thiếu dạng bài đích'; end if;
    insert into dai_bdm_gan_cau (ma_cau, dang_bai_id, nguon) values (p_ma_cau, p_dang_bai, 'nguoi')
      on conflict (ma_cau) do update set dang_bai_id = excluded.dang_bai_id, nguon = 'nguoi', actor = jwt_uid(), at = now();
    delete from dai_bdm_de_xuat where ma_cau = p_ma_cau;
    delete from dai_bdm_cau_thieu_dang where ma_cau = p_ma_cau;
  elsif p_hanh_dong = 'thieu' then
    if coalesce(btrim(p_ly_do), '') = '' then raise exception 'Cần ghi lý do "thiếu dạng"'; end if;
    if v_ai is not null then raise exception 'Câu đã có dạng bài, không đánh dấu thiếu dạng'; end if;
    insert into dai_bdm_cau_thieu_dang (ma_cau, ly_do, nguon) values (p_ma_cau, btrim(p_ly_do), 'nguoi')
      on conflict (ma_cau) do update set ly_do = excluded.ly_do, nguon = 'nguoi', actor = jwt_uid(), at = now();
    delete from dai_bdm_de_xuat where ma_cau = p_ma_cau;
  elsif p_hanh_dong = 'bo_de_xuat' then
    delete from dai_bdm_de_xuat where ma_cau = p_ma_cau;
  elsif p_hanh_dong = 'mau_giu' then
    if v_ai is null or v_nguon <> 'ai' then raise exception 'Câu không phải gán AI'; end if;
    insert into dai_bdm_kiem_mau (ma_cau, dang_bai_ai_id, ket_qua) values (p_ma_cau, v_ai, 'giu') on conflict (ma_cau) do nothing;
  elsif p_hanh_dong = 'mau_doi' then
    if v_ai is null or v_nguon <> 'ai' then raise exception 'Câu không phải gán AI'; end if;
    if p_dang_bai is null or p_dang_bai = v_ai then raise exception 'Cần chọn dạng bài KHÁC để đổi'; end if;
    insert into dai_bdm_kiem_mau (ma_cau, dang_bai_ai_id, ket_qua) values (p_ma_cau, v_ai, 'doi') on conflict (ma_cau) do nothing;
    update dai_bdm_gan_cau set dang_bai_id = p_dang_bai, nguon = 'nguoi', actor = jwt_uid(), at = now() where ma_cau = p_ma_cau;
  elsif p_hanh_dong in ('tu_choi', 'kho_rac') then
    -- Thùy 18/10: từ chối kèm lý do (bắt buộc). Chỉ gỡ phần của AI; gán của người không đi đường này.
    if coalesce(btrim(p_ly_do), '') = '' then raise exception 'Cần ghi lý do từ chối'; end if;
    if v_ai is not null and v_nguon <> 'ai' and p_hanh_dong = 'tu_choi' then
      raise exception 'Câu đã được NGƯỜI gán dạng bài — muốn đổi thì chọn dạng khác';
    end if;
    v_hang := case when v_ai is not null and v_nguon = 'ai' then 'mau'
                   when v_dx is not null then 'de_xuat'
                   when exists (select 1 from dai_bdm_cau_thieu_dang where ma_cau = p_ma_cau) then 'thieu'
                   else 'trong' end;
    insert into dai_bdm_tu_choi (ma_cau, dang_bai_ai_id, hang, kho_rac, ly_do)
    values (p_ma_cau, case when v_nguon = 'ai' then v_ai else v_dx end, v_hang, p_hanh_dong = 'kho_rac', btrim(p_ly_do));
    if v_ai is not null and v_nguon = 'ai' then
      insert into dai_bdm_kiem_mau (ma_cau, dang_bai_ai_id, ket_qua) values (p_ma_cau, v_ai, 'doi') on conflict (ma_cau) do nothing;
      delete from dai_bdm_gan_cau where ma_cau = p_ma_cau and nguon = 'ai';
    end if;
    delete from dai_bdm_de_xuat where ma_cau = p_ma_cau;
    delete from dai_bdm_cau_thieu_dang where ma_cau = p_ma_cau and nguon = 'ai';
    if p_hanh_dong = 'kho_rac' then
      perform fn_kho_tu_choi_cau('toan', p_ma_cau, current_nhan_su_id(), btrim(p_ly_do));
    end if;
  else
    raise exception 'Hành động không hợp lệ: %', p_hanh_dong;
  end if;
  return jsonb_build_object('ok', true, 'ma_cau', p_ma_cau, 'hanh_dong', p_hanh_dong);
end $function$;
