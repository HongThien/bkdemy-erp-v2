-- ============================================================================
-- 202611161740 — giao_trinh_tuan_hinh
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Giáo trình tuần bước 3 (spec-giao-trinh-tuan.md §8, Thùy 16/11 "cần Hình"): đặt khung cho ca có giáo trình Hình ngay ở màn tuần.
--   Giáo trình Hình là KHUÔN mô hình–bài–ý (CLAUDE.md §1.6): buổi có phần HỌC = bài học (loai_phan 'dang', ref_ma = mã bài HH…)
--   và phần LUYỆN = mô hình (loai_phan 'hl_mo_hinh', ref_ma = hinh_mo_hinh.id). Builder Hình ghi bằng fn_tl_hh_dat_bai / fn_tl_hl_dat_mo_hinh
--   ⇒ fn_gtt_dat_khung gọi lại ĐÚNG hai hàm đó (không viết bộ ghi thứ hai), cùng tham số mặc định như builder truyền (lib/chuyenDeHinh.ts).
--   Hình dạng p_chon theo khuôn: MẢNG [{nhom, dang_bai[]}] = khuôn nhóm (Đại · HGT · KHTN); ĐỐI TƯỢNG {bai?: text[], mo_hinh?: uuid[]} = khuôn
--   mô hình (Hình) — khoá nào vắng thì phần đó giữ nguyên. Gửi sai khuôn so với giáo trình ⇒ báo lỗi.
--   _gtt_khung / _gtt_khung_khoa thêm mô hình (phần LUYỆN) — trước chỉ thấy bài học. Đổi khoá so sánh không ảnh hưởng bản chụp nào
--   (đo 16/11 17:40: gtt_duyet 0 dòng).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì. Thay thân 3 hàm (giữ chữ ký).
-- ============================================================================

create or replace function _gtt_khung(p_buoi uuid) returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(x.j order by x.k, x.tt, x.id), '[]'::jsonb) from (
    select 0 as k, p.thu_tu as tt, p.id, jsonb_build_object('ma', p.ref_ma, 'loai', 'nhom', 'ten', n.ten,
             'con', coalesce((select jsonb_agg(jsonb_build_object('ma', c.ref_ma, 'ten', db.ten) order by c.thu_tu, c.id)
                                from tai_lieu_phan c left join tl_bdm_dang_bai_v db on db.id = c.ref_ma
                               where c.cha_id = p.id and c.loai_phan = 'dang_bai'), '[]'::jsonb)) as j
      from tai_lieu_phan p left join tl_bdm_nhom_v n on n.id = p.ref_ma
     where p.cha_id = p_buoi and p.loai_phan = 'nhom'
    union all
    -- Hình · HỌC: bài học
    select 0, p.thu_tu, p.id, jsonb_build_object('ma', p.ref_ma, 'loai', 'dang', 'ten',
             (select h.ten_dang from hinh_hoc_ban_do h where h.ma_dang = p.ref_ma limit 1), 'con', '[]'::jsonb)
      from tai_lieu_phan p
     where p.cha_id = p_buoi and p.loai_phan = 'dang'
    union all
    -- Hình · LUYỆN: mô hình
    select 1, p.thu_tu, p.id, jsonb_build_object('ma', p.ref_ma, 'loai', 'mo_hinh', 'ten', m.ten, 'con', '[]'::jsonb)
      from tai_lieu_phan p left join hinh_mo_hinh m on m.id::text = p.ref_ma
     where p.cha_id = p_buoi and p.loai_phan = 'hl_mo_hinh'
  ) x
$$;

create or replace function _gtt_khung_khoa(p_buoi uuid) returns text[]
language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(k order by k), '{}') from (
    select 'n:' || p.ref_ma as k from tai_lieu_phan p where p.cha_id = p_buoi and p.loai_phan = 'nhom'
    union
    select 'n:' || p.ref_ma || '/' || c.ref_ma from tai_lieu_phan p join tai_lieu_phan c on c.cha_id = p.id and c.loai_phan = 'dang_bai'
     where p.cha_id = p_buoi and p.loai_phan = 'nhom'
    union
    select 'd:' || p.ref_ma from tai_lieu_phan p where p.cha_id = p_buoi and p.loai_phan = 'dang'
    union
    select 'm:' || p.ref_ma from tai_lieu_phan p where p.cha_id = p_buoi and p.loai_phan = 'hl_mo_hinh'
  ) x
$$;

create or replace function fn_gtt_dat_khung(p_lop uuid, p_ngay date, p_chon jsonb, p_tai_lieu uuid default null) returns jsonb
language plpgsql security definer set search_path = public as $$
declare l lop; v_buoi uuid; v_tl uuid; v_nhanh text; v_n int; v_tt int; v_hinh boolean;
begin
  l := public._gtt_kiem_ca(p_lop, p_ngay);
  select g.buoi_id, p.tai_lieu_id into v_buoi, v_tl
    from gtt_ca g join tai_lieu_phan p on p.id = g.buoi_id where g.lop_id = p_lop and g.ngay = p_ngay;

  if v_buoi is null then
    if p_tai_lieu is null then raise exception 'Ca chưa gắn buổi — chọn giáo trình để thêm buổi mới.' using errcode = 'P0001'; end if;
    perform 1 from tai_lieu t where t.id = p_tai_lieu and t.loai = 'giao_trinh' and t.ban_do = 'moi' and t.luu_tru_tu is null
                                and t.lop_id = p_lop and t.mon = l.mon for update;
    if not found then raise exception 'Giáo trình này không phải giáo trình của lớp.' using errcode = 'P0001'; end if;
    v_tl := p_tai_lieu;
  end if;

  -- Khuôn của giáo trình: mô hình–bài–ý (Hình) hay nhóm › dạng bài. Hình dạng p_chon phải khớp khuôn.
  select t.nhanh into v_nhanh from tai_lieu t where t.id = v_tl;
  v_hinh := coalesce(v_nhanh = 'hinh', false);   -- nhanh null (Đại · KHTN) ⇒ false, không để null lọt qua kiểm khuôn
  if v_hinh and jsonb_typeof(p_chon) is distinct from 'object' then
    raise exception 'Giáo trình Hình: khung là {bai: [...], mo_hinh: [...]}.' using errcode = 'P0001';
  elsif not v_hinh and jsonb_typeof(coalesce(p_chon, '[]'::jsonb)) <> 'array' then
    raise exception 'Giáo trình này chọn theo nhóm › dạng bài.' using errcode = 'P0001';
  end if;

  if v_buoi is null then
    select count(*) filter (where p.loai_phan = 'buoi'), coalesce(max(p.thu_tu), -1) + 1 into v_n, v_tt
      from tai_lieu_phan p where p.tai_lieu_id = v_tl;
    insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values (v_tl, v_tt, 'buoi', 'Buổi ' || (v_n + 1))
    returning id into v_buoi;
    insert into gtt_ca (lop_id, ngay, buoi_id, mon) values (p_lop, p_ngay, v_buoi, l.mon);
  end if;

  if v_hinh then
    -- đúng hai hàm builder Hình gọi (lib/chuyenDeHinh.ts hhDatBai / cdhDatMoHinh), tham số mặc định như builder
    if p_chon ? 'bai' then
      perform public.fn_tl_hh_dat_bai(v_tl, v_buoi, array(select jsonb_array_elements_text(p_chon -> 'bai')));
    end if;
    if p_chon ? 'mo_hinh' then
      perform public.fn_tl_hl_dat_mo_hinh(v_tl, v_buoi, array(select jsonb_array_elements_text(p_chon -> 'mo_hinh'))::uuid[]);
    end if;
  else
    -- p_so_btvn = đúng giá trị builder truyền (src/lib/tailieuBdm.ts datBuoi: SO_BTVN_MAC_DINH + _tong 5 — Thùy 13/11 BTVN 5 câu / nhóm)
    perform public.fn_tl_bdm_dat_buoi(v_tl, v_buoi, coalesce(p_chon, '[]'::jsonb),
      p_so_btvn => '{"_tong": 5, "tu_luan": 2, "trac_nghiem": 2, "tra_loi_ngan": 1}'::jsonb);
  end if;
  return public._gtt_ca_json(p_lop, p_ngay, public._gtt_snap_duyet(l.mon, l.khoi, p_ngay - (extract(isodow from p_ngay)::int - 1)));
end $$;
