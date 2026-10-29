-- ============================================================================
-- hau_kiem_gay — Thùy 29/10, spec-truong-khoi.md §3 (P2 hai tầng): trưởng khối QUYẾT, có hiệu lực ngay; Trang HẬU KIỂM.
-- Bảng hau_kiem dùng chung cho mọi loại việc (gậy trước; việc vận hành / case bổ trợ nối vào sau bằng thêm `loai`).
-- 1 dòng sinh ra = Trang đã xem (Đồng ý / Đã sửa) — chưa xem = KHÔNG có dòng (§1.5).
--
-- Cần hậu kiểm (gậy), quyết từ 29/10 trở đi bởi người KHÔNG phải toàn hệ (Thùy/Trang) và KHÔNG phải quản lý môn:
--   gay_ledger    — trưởng khối đánh (tu_dong qua đề xuất · thu_cong) hoặc gỡ (go), chưa thu hồi   ⇒ Sửa = Thu hồi (đã có)
--   gay_bo_qua    — trưởng khối BỎ QUA 1 đề xuất                                                 ⇒ Sửa = Mở lại đề xuất (về 'cho')
-- Chỉ toàn hệ (Lead / Quản lý chất lượng) đọc + ghi hàng này.
-- ============================================================================

create table if not exists hau_kiem (
  id        uuid primary key default gen_random_uuid(),
  loai      text not null check (loai in ('gay_ledger', 'gay_bo_qua')),
  ref_id    uuid not null,
  ket_qua   text not null check (ket_qua in ('dong_y', 'da_sua')),
  ghi_chu   text,
  nguoi     uuid not null references nhan_su(id),
  at        timestamptz not null default now(),
  unique (loai, ref_id)
);
comment on table hau_kiem is 'Hậu kiểm của Trang (toàn hệ QLCL) trên quyết định của trưởng khối — spec-truong-khoi.md §3. Không có dòng = chưa hậu kiểm.';
alter table hau_kiem enable row level security;
drop policy if exists hau_kiem_doc on hau_kiem;
create policy hau_kiem_doc on hau_kiem for select to authenticated using (public.la_thanh_vien());

-- Người quyết có cần hậu kiểm không: không phải toàn hệ, không phải quản lý môn
create or replace function public._hk_can_hau_kiem(p_ns uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select p_ns is not null
     and not coalesce((select n.la_admin_he_thong from nhan_su n where n.id = p_ns), false)
     and not exists (select 1 from vi_tri v join team t on t.id = v.team_id and t.ma = 'qlcl'
                      where v.nhan_su_id = p_ns and not v.tk_tu_dong and v.cap in ('truong', 'pho'))
     and cardinality(public._quan_ly_mon_cua(p_ns)) = 0
$$;

create or replace function public._hk_tu() returns timestamptz language sql immutable as $$ select timestamptz '2026-10-29 00:00+07' $$;

-- Hàng hậu kiểm gậy: chưa xem + đã xem trong p_so_ngay ngày gần nhất
create or replace function public.fn_hau_kiem_gay(p_so_ngay integer default 7)
returns jsonb language sql stable security definer set search_path = public as $$
  select case when not public._qlcl_toan_he() then '[]'::jsonb else coalesce(jsonb_agg(x order by x->>'at' desc), '[]'::jsonb) end
  from (
    select jsonb_build_object(
      'loai', 'gay_ledger', 'ref_id', g.id, 'at', g.created_at,
      'nguoi_quyet_id', g.nguoi_tao, 'nguoi_quyet', nq.ho_ten,
      'nhan_su_id', g.nhan_su_id, 'nhan_su', ns.ho_ten,
      'hanh_dong', case g.loai when 'go' then 'gỡ' when 'tu_dong' then 'đánh (từ đề xuất)' else 'đánh tay' end,
      'so_gay', g.so_gay, 'loi', gl.ten, 'ly_do', g.ly_do, 'viec', coalesce(g.ref_mo_ta, dx.mo_ta),
      'thu_hoi_at', g.thu_hoi_at,
      'hk', case when h.id is null then null else jsonb_build_object('ket_qua', h.ket_qua, 'ghi_chu', h.ghi_chu, 'at', h.at, 'nguoi', nh.ho_ten) end) x
    from gay_ledger g
    join nhan_su nq on nq.id = g.nguoi_tao
    join nhan_su ns on ns.id = g.nhan_su_id
    left join gay_loi gl on gl.id = g.loi_id
    left join gay_de_xuat dx on dx.ledger_id = g.id
    left join hau_kiem h on h.loai = 'gay_ledger' and h.ref_id = g.id
    left join nhan_su nh on nh.id = h.nguoi
    where g.created_at >= public._hk_tu() and public._hk_can_hau_kiem(g.nguoi_tao)
      and (h.id is null or h.at >= now() - make_interval(days => p_so_ngay))
    union all
    select jsonb_build_object(
      'loai', 'gay_bo_qua', 'ref_id', d.id, 'at', d.quyet_at,
      'nguoi_quyet_id', d.nguoi_quyet, 'nguoi_quyet', nq.ho_ten,
      'nhan_su_id', d.nhan_su_id, 'nhan_su', ns.ho_ten,
      'hanh_dong', 'bỏ qua đề xuất', 'so_gay', d.so_gay, 'loi', null, 'ly_do', d.ly_do_bo_qua, 'viec', d.mo_ta,
      'tre_phut', d.tre_phut, 'thu_hoi_at', null,
      'hk', case when h.id is null then null else jsonb_build_object('ket_qua', h.ket_qua, 'ghi_chu', h.ghi_chu, 'at', h.at, 'nguoi', nh.ho_ten) end)
    from gay_de_xuat d
    join nhan_su nq on nq.id = d.nguoi_quyet
    join nhan_su ns on ns.id = d.nhan_su_id
    left join hau_kiem h on h.loai = 'gay_bo_qua' and h.ref_id = d.id
    left join nhan_su nh on nh.id = h.nguoi
    where d.trang_thai = 'bo_qua' and d.quyet_at >= public._hk_tu() and public._hk_can_hau_kiem(d.nguoi_quyet)
      and (h.id is null or h.at >= now() - make_interval(days => p_so_ngay))
  ) s
$$;

-- Ghi hậu kiểm (Đồng ý / Đã sửa). Ghi lại được (đổi ý) — dòng cập nhật, người + giờ mới.
create or replace function public.fn_hau_kiem_ghi(p_loai text, p_ref uuid, p_ket_qua text, p_ghi_chu text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public._qlcl_toan_he() then raise exception 'Chỉ Lead / Quản lý chất lượng hậu kiểm.'; end if;
  insert into hau_kiem (loai, ref_id, ket_qua, ghi_chu, nguoi)
  values (p_loai, p_ref, p_ket_qua, nullif(trim(coalesce(p_ghi_chu, '')), ''), public.current_nhan_su_id())
  on conflict (loai, ref_id) do update set ket_qua = excluded.ket_qua, ghi_chu = excluded.ghi_chu, nguoi = excluded.nguoi, at = now();
end $$;

-- Sửa "bỏ qua": mở lại đề xuất về 'cho' (gay_log tự giữ vết trước/sau) + ghi hậu kiểm 'da_sua' kèm lý do bỏ qua cũ.
create or replace function public.fn_hau_kiem_mo_lai_de_xuat(p_de_xuat uuid, p_ghi_chu text)
returns void language plpgsql security definer set search_path = public as $$
declare d record;
begin
  if not public._qlcl_toan_he() then raise exception 'Chỉ Lead / Quản lý chất lượng hậu kiểm.'; end if;
  select * into d from gay_de_xuat where id = p_de_xuat for update;
  if d.id is null or d.trang_thai <> 'bo_qua' then raise exception 'Đề xuất không còn ở trạng thái bỏ qua.'; end if;
  update gay_de_xuat set trang_thai = 'cho', nguoi_quyet = null, quyet_at = null, ly_do_bo_qua = null where id = p_de_xuat;
  perform public.fn_hau_kiem_ghi('gay_bo_qua', p_de_xuat, 'da_sua',
    concat_ws(' — ', 'Mở lại đề xuất', nullif(trim(coalesce(p_ghi_chu, '')), ''), 'trưởng khối bỏ qua vì: ' || coalesce(d.ly_do_bo_qua, '?')));
end $$;

do $$
declare f text;
begin
  foreach f in array array['public._hk_can_hau_kiem(uuid)', 'public.fn_hau_kiem_gay(integer)', 'public.fn_hau_kiem_ghi(text, uuid, text, text)',
                           'public.fn_hau_kiem_mo_lai_de_xuat(uuid, text)'] loop
    execute format('revoke execute on function %s from public', f);
    execute format('revoke execute on function %s from anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
end $$;
