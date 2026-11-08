-- ============================================================================
-- 202611051853 — bao_cao_ky_p11_nhan_xet_them_theo_muc
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 05/11 "nhận xét thêm là nhận xét thêm ở MỖI PHẦN thái độ, năng lực… chứ không phải nhận xét thêm tổng".
--   bao_cao_ph_ky.nx_them = { "<mã mục to>": "chữ GV viết thêm" } (khoá = mã gốc mục to). _bc_ky_phan_gv đưa 'them' vào từng mục to
--   của nhan_xet_chon (mục to có chữ thêm mà chưa chọn mục nhỏ nào vẫn hiện). Cột nhan_xet (tổng) giữ — chưa ai nhập (0 dòng).
--   Trigger khoá sau công bố thêm nx_them.
-- MẤT GÌ (Luật xoá): không — thêm cột, thay thân 2 hàm.
-- ============================================================================

alter table public.bao_cao_ph_ky
  add column nx_them jsonb not null default '{}'::jsonb check (jsonb_typeof(nx_them) = 'object');

create or replace function public._bao_cao_ph_ky_truoc() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  new.updated_by := coalesce(public.jwt_uid(), new.updated_by);
  if tg_op = 'UPDATE' and old.cong_bo_at is not null and new.cong_bo_at is not null
     and (new.diem_du_doan is distinct from old.diem_du_doan or new.sai_so is distinct from old.sai_so
          or new.nhan_xet is distinct from old.nhan_xet or new.ke_hoach is distinct from old.ke_hoach
          or new.nx_chon is distinct from old.nx_chon or new.kh_chon is distinct from old.kh_chon
          or new.nx_them is distinct from old.nx_them
          or new.snapshot is distinct from old.snapshot) then
    raise exception 'Báo cáo kì đã công bố — bấm "Mở lại để sửa" trước.';
  end if;
  return new;
end $$;

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
