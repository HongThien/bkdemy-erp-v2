-- ============================================================================
-- 202611061432 — bao_cao_ky_p12_ket_luan_va_ke_hoach_3_phuong_an
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 06/11.
--   (1) Thêm card KẾT LUẬN giống report tháng: ket_luan_muc (7 mức y hệt bao_cao_ph.ket_luan_muc — KET_LUAN_MUC ở ReportPHScreen.tsx) + ket_luan (chữ).
--   (2) Kế hoạch cải thiện chỉ còn 3 phương án đề xuất (chung, không gắn mục): chiến dịch cải thiện riêng · hoạt động bổ trợ sắp tới ·
--       tiếp tục duy trì và phát huy. 17 phương án cũ (Claude soạn 05/11) cất vào KHO RÁC (xoa_at) — không xoá cứng: 17/39 báo cáo nháp đang
--       tích phương án cũ, chữ vẫn đọc được và màn GV vẫn hiện để GV tự bỏ tích.
--   (3) "Bỏ nhận xét thêm" theo mục: chỉ bỏ ở màn (0 báo cáo có dữ liệu nx_them); cột giữ.
-- MẤT GÌ (Luật xoá): không xoá dòng nào — 17 dòng bc_ky_kh_mau chỉ đặt xoa_at (khôi phục được: set xoa_at = null).
-- ============================================================================

alter table public.bao_cao_ph_ky
  add column ket_luan_muc text check (ket_luan_muc in ('rat_tot', 'dat_yeu_cau', 'tien_bo', 'cai_thien_thai_do', 'cai_thien_kien_thuc', 'van_de_thai_do', 'van_de_kien_thuc')),
  add column ket_luan text;

create or replace function public._bao_cao_ph_ky_truoc() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  new.updated_by := coalesce(public.jwt_uid(), new.updated_by);
  if tg_op = 'UPDATE' and old.cong_bo_at is not null and new.cong_bo_at is not null
     and (new.diem_du_doan is distinct from old.diem_du_doan or new.sai_so is distinct from old.sai_so
          or new.nhan_xet is distinct from old.nhan_xet or new.ke_hoach is distinct from old.ke_hoach
          or new.nx_chon is distinct from old.nx_chon or new.kh_chon is distinct from old.kh_chon
          or new.nx_them is distinct from old.nx_them
          or new.ket_luan_muc is distinct from old.ket_luan_muc or new.ket_luan is distinct from old.ket_luan
          or new.snapshot is distinct from old.snapshot) then
    raise exception 'Báo cáo kì đã công bố — bấm "Mở lại để sửa" trước.';
  end if;
  return new;
end $$;

update public.bc_ky_kh_mau set xoa_at = now() where xoa_at is null;
insert into public.bc_ky_kh_mau (muc_ma, noi_dung, thu_tu) values
  (null, 'Con cần tham dự chiến dịch cải thiện riêng.', 1),
  (null, 'Con cần tham dự các hoạt động bổ trợ sắp tới.', 2),
  (null, 'Con cần tiếp tục duy trì và phát huy trạng thái hiện tại.', 3);

create or replace function public._bc_ky_phan_gv(p_hs uuid, p_mon text, p_ky uuid, p_goi_y jsonb)
returns jsonb language plpgsql stable set search_path to 'public' as $$
declare v_bc bao_cao_ph_ky; v_g jsonb := p_goi_y; v_cc jsonb;
begin
  select * into v_bc from bao_cao_ph_ky where hoc_sinh_id = p_hs and mon = p_mon and ky_id = p_ky;
  -- "Cẩn thận" 🤖 theo sai số GV đã nhập (em ≥ 2 lần thi)
  if v_bc.sai_so is not null and v_g is not null and coalesce((v_g ->> 'so_lan')::int, 0) >= 2 then
    select jsonb_object_agg(m.ma, jsonb_build_object(
             'muc_do', case when v_bc.sai_so <= m.nguong_tot then 'tot' when v_bc.sai_so >= m.nguong_chua_tot then 'chua_tot' else 'on' end,
             'khoa', null, 'so', jsonb_build_object('sai_so', v_bc.sai_so, 'tu_gv', true, 'so_lan', (v_g ->> 'so_lan')::int)))
      into v_cc from bc_ky_nx_muc m where m.goi_y = 'can_than' and m.xoa_at is null;
    if v_cc is not null then v_g := v_g || jsonb_build_object('muc', coalesce(v_g -> 'muc', '{}'::jsonb) || v_cc); end if;
  end if;
  return jsonb_build_object(
    'nang_luc', jsonb_build_object('diem', v_bc.diem_du_doan, 'sai_so', v_bc.sai_so),
    'nhan_xet', v_bc.nhan_xet,     -- ô nhận xét TỔNG cũ — màn không còn nhập (thay bằng nhận xét thêm theo từng mục to); giữ để đọc dữ liệu cũ
    'ke_hoach', v_bc.ke_hoach,     -- ô "viết thêm" của kế hoạch
    -- KẾT LUẬN (Thùy 06/11, giống report tháng): 1 trong 7 mức + chữ
    'ket_luan', case when v_bc.ket_luan_muc is not null or nullif(btrim(v_bc.ket_luan), '') is not null
                     then jsonb_build_object('muc', v_bc.ket_luan_muc, 'noi_dung', nullif(btrim(v_bc.ket_luan), '')) end,
    -- nhận xét theo thang (Thùy 05/11): mục to → mục nhỏ GV đã chọn, chữ resolve từ danh mục (loại đã vào kho rác vẫn đọc được)
    'nhan_xet_chon', coalesce((
      select jsonb_agg(jsonb_build_object('ma', t.ma, 'ten', t.ten, 'con', coalesce(x.con, '[]'::jsonb),
                                          'them', nullif(btrim(v_bc.nx_them ->> t.ma), '')) order by t.thu_tu, t.ma)
        from bc_ky_nx_muc t
        cross join lateral (
          select jsonb_agg(jsonb_build_object('ma', m.ma, 'ten', m.ten, 'muc_do', v_bc.nx_chon -> m.ma ->> 'muc_do', 'noi_dung', lc.noi_dung)
                           order by m.thu_tu, m.ma) as con
            from bc_ky_nx_muc m
            left join bc_ky_nx_lua_chon lc on lc.ma = v_bc.nx_chon -> m.ma ->> 'lc'
           where m.cha = t.ma and m.xoa_at is null and v_bc.nx_chon ? m.ma) x
       where t.cha is null and t.xoa_at is null
         and (x.con is not null or nullif(btrim(v_bc.nx_them ->> t.ma), '') is not null)), '[]'::jsonb),
    'ke_hoach_chon', coalesce((
      select jsonb_agg(k.noi_dung order by e.ord)
        from jsonb_array_elements_text(v_bc.kh_chon) with ordinality e(ma, ord) join bc_ky_kh_mau k on k.ma = e.ma), '[]'::jsonb),
    'goi_y', v_g);
end $$;
