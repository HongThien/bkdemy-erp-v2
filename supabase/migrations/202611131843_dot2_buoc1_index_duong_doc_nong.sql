-- ĐỢT 2 — BƯỚC 1 (13/11/2026): index cho các đường đọc nóng (spec-kien-truc.md §10 đợt 2, K7). Bằng chứng: reports/audit-scale-13-11.md §2.2.
-- Các index này ĐÃ được tạo trước bằng CREATE INDEX CONCURRENTLY (không khoá ghi) rồi mới ghi sổ; file dùng IF NOT EXISTS để dựng lại DB từ repo vẫn đủ.
-- 4 index *_khoa_trung2_idx là bản đúng của *_khoa_trung_idx (mig 202611112136 dựng nhầm 's+' thay vì '\s+' ⇒ idx_scan = 0). Bản cũ CHƯA xoá (Luật xoá — chờ Thùy).
-- view bdm_cau_dang nối gốc→bản sao: thiếu nên mọi hàm bốc câu quét cả bảng (bên dai đã có idx_dai_cau_parent)
create index if not exists hgt_cau_hoi_parent_idx on public.hgt_cau_hoi (parent_ma_cau) where parent_ma_cau is not null;
-- _hs_dang_da_hoc / fn_ban_do_phieu_luu: bài lớp đã giao — trước chỉ có index riêng cho loai=et
create index if not exists bai_test_lop_loai_idx on public.bai_test (lop_id, loai);
-- _de_thi_da_giao(t.id) chạy cho từng đề — fn_de_thi_dem/_ds
create index if not exists bai_test_nguon_idx on public.bai_test (nguon_tai_lieu_id) where nguon_tai_lieu_id is not null;
-- _et_diem_buoi, cron tin Thế giới: điểm theo buổi
create index if not exists gami_grades_buoi_hs_idx on public.gami_grades (buoi_hoc_id, hoc_sinh_id);
-- cron tin Thế giới + mastery theo mốc thời gian
create index if not exists bai_lam_cau_cham_at_idx on public.bai_lam_cau (cham_at);
-- _hs_cau_lan_gap: bài làm của một em (index cũ có cột đầu là bai_test_id)
create index if not exists bai_lam_hs_idx on public.bai_lam (hoc_sinh_id);
-- tin của em: v_me = any(thanh_vien)
create index if not exists the_gioi_tin_luu_thanh_vien_gin on public.the_gioi_tin_luu using gin (thanh_vien);
-- đối xứng với dai_bdm_de_xuat
create index if not exists hgt_bdm_de_xuat_dang_bai_idx on public.hgt_bdm_de_xuat (dang_bai_id);
-- fn_hocphi_no_theo_ph: 2 truy vấn con cho mỗi hoá đơn, trước quét cả bảng
create index if not exists hoa_don_dong_hoa_don_idx on public.hoa_don_dong (hoa_don_id);
-- như trên
create index if not exists thanh_toan_hoa_don_idx on public.thanh_toan (hoa_don_id);
-- fn_btyeu_case_xep_lich: buổi của từng case
create index if not exists buoi_hoc_hs_btyeu_idx on public.buoi_hoc_hs (bo_tro_yeu_id) where bo_tro_yeu_id is not null;
-- Kho đề thi: danh sách + đếm
create index if not exists tai_lieu_de_thi_idx on public.tai_lieu (mon, khoi, created_at desc) where loai = 'de_thi';
-- _ban_be_cua: bạn của một em
create index if not exists ban_be_loi_moi_gui_idx on public.ban_be_loi_moi (nguoi_gui);
-- như trên
create index if not exists ban_be_loi_moi_nhan_idx on public.ban_be_loi_moi (nguoi_nhan);
-- xu-dong-bo, EXP theo em theo tháng — trước chỉ có khoá chính
create index if not exists gami_exp_ledger_hs_idx on public.gami_exp_ledger (hoc_sinh_id, created_at);
-- báo động yếu theo em
create index if not exists canh_bao_yeu_hs_idx on public.canh_bao_yeu (hoc_sinh_id);
-- kiểm trùng khi thêm câu (fn_phien_kho_them) — bản ĐÚNG biểu thức \s+; bản cũ *_khoa_trung_idx dựng nhầm s+ nên chưa từng được dùng
create index if not exists dai_cau_hoi_khoa_trung2_idx on public.dai_cau_hoi (md5(regexp_replace(lower(noi_dung || coalesce(lua_chon::text, '') || coalesce(menh_de::text, '')), '\s+', '', 'g'))) where xoa_at is null;
-- như trên
create index if not exists hgt_cau_hoi_khoa_trung2_idx on public.hgt_cau_hoi (md5(regexp_replace(lower(noi_dung || coalesce(lua_chon::text, '') || coalesce(menh_de::text, '')), '\s+', '', 'g'))) where xoa_at is null;
-- như trên
create index if not exists khtn_cau_hoi_khoa_trung2_idx on public.khtn_cau_hoi (md5(regexp_replace(lower(noi_dung || coalesce(lua_chon::text, '') || coalesce(menh_de::text, '')), '\s+', '', 'g'))) where xoa_at is null;
-- như trên
create index if not exists hinh_hoc_cau_hoi_khoa_trung2_idx on public.hinh_hoc_cau_hoi (md5(regexp_replace(lower(noi_dung || coalesce(lua_chon::text, '') || coalesce(menh_de::text, '')), '\s+', '', 'g'))) where xoa_at is null;

-- Hàm kiểm trùng của bot kho: dạng min() trực tiếp khiến planner quét theo khoá chính (3,9 giây/lượt) dù đã có index đúng.
do $g$ begin if (select md5(p.prosrc) from pg_proc p where p.oid = 'fn_phien_kho_them(uuid,jsonb)'::regprocedure) is distinct from 'a404ca99ed3d8984ded4ec27288f7fd8' then raise exception 'dot 2: fn_phien_kho_them da doi — sinh lai'; end if; end $g$;

CREATE OR REPLACE FUNCTION public.fn_phien_kho_them(p_phien uuid, p_ds jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_p claude_phien; x jsonb; v_kq jsonb := '[]'::jsonb; v_ok int := 0; v_trung int := 0; v_loi int := 0;
        v_nh text; v_tbl text; v_ma text; v_cu text; v_k text; v_phan jsonb;
begin
  v_p := public._phien_kho_vao(p_phien);
  if jsonb_typeof(p_ds) <> 'array' or jsonb_array_length(p_ds) = 0 then raise exception 'Cần một mảng câu (xem tro-giup).'; end if;
  if jsonb_array_length(p_ds) > 20 then raise exception 'Mỗi lô tối đa 20 câu.'; end if;
  for x in select * from jsonb_array_elements(p_ds) loop
    begin
      v_nh := coalesce(nullif(x->>'nhanh', ''), case when v_p.mon = 'KHTN' then 'khtn' when v_p.mon = 'Vật lý' then 'vatly' when v_p.mon = 'Hóa học' then 'hoahoc' else 'dai' end);
      if v_p.mon = 'KHTN' and v_nh <> 'khtn' then raise exception 'Phiên KHTN: nhanh phải là khtn.'; end if;
      if v_p.mon = 'Vật lý' and v_nh <> 'vatly' then raise exception 'Phiên Vật lý: nhanh phải là vatly.'; end if;
      if v_p.mon = 'Hóa học' and v_nh <> 'hoahoc' then raise exception 'Phiên Hóa học: nhanh phải là hoahoc.'; end if;
      if v_p.mon not in ('KHTN', 'Vật lý', 'Hóa học') and v_nh not in ('dai', 'hgt', 'hinh_hoc') then raise exception 'nhanh phải là dai · hgt · hinh_hoc.'; end if;
      if coalesce(x->>'loai_cau', '') not in ('trac_nghiem', 'tra_loi_ngan', 'tu_luan', 'dung_sai') then
        raise exception 'loai_cau phải là trac_nghiem · tra_loi_ngan · tu_luan · dung_sai.';
      end if;
      v_tbl := v_nh || '_cau_hoi';
      v_k := regexp_replace(lower(coalesce(x->>'noi_dung', '') || coalesce(nullif((x->'lua_chon')::text, 'null'), '') || coalesce(nullif((x->'menh_de')::text, 'null'), '')), '\s+', '', 'g');
      -- 11/11: md5(khoá) = md5($1) chỉ để đi index <bảng>_khoa_trung_idx (mig 202611112136); so khoá đầy đủ vẫn giữ.
      -- [dot 2, 13/11] boc truy van con + offset 0: de planner di index <bang>_khoa_trung2_idx (dang min() truc tiep bi chon quet theo khoa chinh)
      execute format($q$select min(s.ma_cau) from (select c.ma_cau from %I c where c.xoa_at is null
                         and md5(regexp_replace(lower(c.noi_dung || coalesce(c.lua_chon::text, '') || coalesce(c.menh_de::text, '')), '\s+', '', 'g')) = md5($1)
                         and regexp_replace(lower(c.noi_dung || coalesce(c.lua_chon::text, '') || coalesce(c.menh_de::text, '')), '\s+', '', 'g') = $1 offset 0) s$q$, v_tbl)
        into v_cu using v_k;
      if v_cu is not null then
        v_kq := v_kq || jsonb_build_array(jsonb_build_object('ok', true, 'trung', true, 'ma_cau', v_cu));
        v_trung := v_trung + 1;
        continue;
      end if;
      if v_nh = 'hinh_hoc' then   -- 07/11: câu Hình–Học vào thẳng bài học (dạng = bài), chưa duyệt
        if not exists (select 1 from hinh_hoc_bai where ma_bai = x->>'ma_bai' and khoi = v_p.khoi) then
          raise exception 'Câu Hình–Học cần "ma_bai" là bài học Hình của khối %.', v_p.khoi;
        end if;
        if nullif(trim(x->>'noi_dung'), '') is null then raise exception 'Đề không được trống'; end if;
        insert into hinh_hoc_cau_hoi (dang_chinh, loai_cau, noi_dung, lua_chon, menh_de, dap_an, loi_giai, nguon, nguon_giai, da_duyet, dang_ai_de_xuat)
        values (x->>'ma_bai', x->>'loai_cau', trim(x->>'noi_dung'),
                case when jsonb_typeof(x->'lua_chon') = 'array' then x->'lua_chon' end,
                case when jsonb_typeof(x->'menh_de') = 'array' then x->'menh_de' end,
                nullif(trim(x->>'dap_an'), ''), nullif(trim(x->>'loi_giai'), ''), 'le',
                case when nullif(trim(x->>'loi_giai'), '') is not null then 'ai' else 'nguoi' end, false, x->>'ma_bai')
        returning ma_cau into v_ma;
      else
      v_ma := public.fn_bdm_nhap_cau(case v_nh when 'dai' then 'toan' else v_nh end, v_p.khoi,
                                     x || jsonb_build_object('nguon_giai', case when nullif(trim(x->>'loi_giai'), '') is not null then 'ai' else 'nguoi' end),
                                     null, null);
      end if;
      if nullif(trim(x->>'ten_de_goc'), '') is not null and v_nh <> 'hinh_hoc' then
        execute format('update %I set ten_de_goc = $2 where ma_cau = $1', v_tbl) using v_ma, trim(x->>'ten_de_goc');
      end if;
      v_phan := null;
      if jsonb_typeof(x->'phan') = 'object' and x->>'loai_cau' <> 'dung_sai' and v_nh <> 'hinh_hoc' then
        v_phan := public._phien_kho_phan1(v_p, v_ma, x->'phan'->>'ket_qua', x->'phan'->>'dang_bai_id', x->'phan'->>'ly_do', x->'phan'->>'chu_de_id');
      end if;
      v_kq := v_kq || jsonb_build_array(jsonb_build_object('ok', true, 'ma_cau', v_ma, 'nhanh', v_nh, 'phan', v_phan));
      v_ok := v_ok + 1;
    exception when others then
      v_kq := v_kq || jsonb_build_array(jsonb_build_object('ok', false, 'loi', sqlerrm, 'dau_de', left(coalesce(x->>'noi_dung', ''), 60)));
      v_loi := v_loi + 1;
    end;
  end loop;
  insert into claude_phien_ghi (phien_id, viec, tham_so, ket_qua)
  values (p_phien, 'them_cau', jsonb_build_object('so_cau', jsonb_array_length(p_ds)),
          jsonb_build_object('them', v_ok, 'trung', v_trung, 'loi', v_loi, 'chi_tiet', v_kq));
  return jsonb_build_object('them', v_ok, 'trung', v_trung, 'loi', v_loi, 'chi_tiet', v_kq);
end $function$;
