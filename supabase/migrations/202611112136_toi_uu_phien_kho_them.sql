-- ============================================================================
-- 202611112136 — toi_uu_phien_kho_them
-- ----------------------------------------------------------------------------
-- VÌ SAO (audit timeout 11/11, reports/audit-timeout-11-11.md — hàng #2):
--   fn_phien_kho_them (bot phiên Claude, service role) 1.580 lần · TB 3,65 s · max 8 s · tổng 5.769 s.
--   Bot đưa câu vào kho TỪNG CÂU MỘT (phiên Toán K4: 930 lượt × 1 câu), mỗi câu tốn 2 lượt QUÉT CẢ BẢNG
--   dai_cau_hoi (70k dòng / 95 MB):
--     ① kiểm trùng: regexp_replace(lower(noi_dung || lua_chon || menh_de)) = khoá  — tính regexp trên MỌI dòng.
--     ② fn_bdm_nhap_cau cấp mã: max(...) where ma_cau like 'T104000000%' — DB collation en_US ⇒ khoá chính
--        (btree thường) KHÔNG dùng được cho LIKE tiền tố ⇒ quét cả bảng.
--   Cả hai chiếm DB chung với app HS + ERP.
-- SỬA (cùng nghĩa, không đổi kết quả):
--   ① index biểu thức md5(khoá kiểm trùng) WHERE xoa_at IS NULL trên 4 kho (dai/hgt/khtn/hinh_hoc).
--      Hàm thêm điều kiện md5(khoá) = md5($1) để dùng index, GIỮ NGUYÊN điều kiện so khoá đầy đủ
--      (md5 chỉ để lọc nhanh; va md5 không thể làm "trùng giả"). md5 vì noi_dung dài có thể vượt trần
--      2.7 kB của dòng btree.
--   ② index ma_cau text_pattern_ops trên dai/hgt/khtn để LIKE 'tiền tố%' của fn_bdm_nhap_cau dùng được
--      (EXECUTE … USING lập kế hoạch một lần với giá trị thật ⇒ tiền tố là hằng). KHÔNG sửa fn_bdm_nhap_cau.
--   ⚠ CREATE INDEX (không CONCURRENTLY — migrate chạy trong transaction) KHOÁ GHI bảng kho trong lúc tạo.
--   Đo 11/11 ~22h (DB đang nghẽn): 2 index của dai_cau_hoi mất 53 s + 40 s (riêng lẻ), 125 s (cùng lượt).
--   CÁCH ÁP KHUYÊN DÙNG: chạy trước 7 lệnh index ở SQL Editor dạng `create index CONCURRENTLY if not exists …`
--   (không khoá ghi), rồi `npm run migrate -- --only <file này>` — các dòng `if not exists` bên dưới thành no-op.
-- ĐO (ROLLBACK, phiên Toán K4, tham số thật lấy từ câu T104000000133x): 1 câu mới 130.029 ms → 563 ms ·
--   3 câu mới 471.491 ms → 172 ms · 5 câu trùng 452 → 88 ms. Kết quả trả về + dòng ghi (câu, gán dạng,
--   đề xuất, claude_phien_ghi) khớp 100% cũ–mới.
--
-- MẤT GÌ (Luật xoá): không có. Chỉ thêm index + thay thân 1 hàm (cùng chữ ký, cùng quyền).
-- ============================================================================

create index if not exists dai_cau_hoi_khoa_trung_idx on public.dai_cau_hoi
  (md5(regexp_replace(lower(noi_dung || coalesce(lua_chon::text, '') || coalesce(menh_de::text, '')), '\s+', '', 'g')))
  where xoa_at is null;
create index if not exists hgt_cau_hoi_khoa_trung_idx on public.hgt_cau_hoi
  (md5(regexp_replace(lower(noi_dung || coalesce(lua_chon::text, '') || coalesce(menh_de::text, '')), '\s+', '', 'g')))
  where xoa_at is null;
create index if not exists khtn_cau_hoi_khoa_trung_idx on public.khtn_cau_hoi
  (md5(regexp_replace(lower(noi_dung || coalesce(lua_chon::text, '') || coalesce(menh_de::text, '')), '\s+', '', 'g')))
  where xoa_at is null;
create index if not exists hinh_hoc_cau_hoi_khoa_trung_idx on public.hinh_hoc_cau_hoi
  (md5(regexp_replace(lower(noi_dung || coalesce(lua_chon::text, '') || coalesce(menh_de::text, '')), '\s+', '', 'g')))
  where xoa_at is null;

create index if not exists dai_cau_hoi_ma_cau_tien_to_idx on public.dai_cau_hoi (ma_cau text_pattern_ops);
create index if not exists hgt_cau_hoi_ma_cau_tien_to_idx on public.hgt_cau_hoi (ma_cau text_pattern_ops);
create index if not exists khtn_cau_hoi_ma_cau_tien_to_idx on public.khtn_cau_hoi (ma_cau text_pattern_ops);

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
      v_nh := coalesce(nullif(x->>'nhanh', ''), case when v_p.mon = 'KHTN' then 'khtn' else 'dai' end);
      if v_p.mon = 'KHTN' and v_nh <> 'khtn' then raise exception 'Phiên KHTN: nhanh phải là khtn.'; end if;
      if v_p.mon <> 'KHTN' and v_nh not in ('dai', 'hgt', 'hinh_hoc') then raise exception 'nhanh phải là dai · hgt · hinh_hoc.'; end if;
      if coalesce(x->>'loai_cau', '') not in ('trac_nghiem', 'tra_loi_ngan', 'tu_luan', 'dung_sai') then
        raise exception 'loai_cau phải là trac_nghiem · tra_loi_ngan · tu_luan · dung_sai.';
      end if;
      v_tbl := v_nh || '_cau_hoi';
      v_k := regexp_replace(lower(coalesce(x->>'noi_dung', '') || coalesce(nullif((x->'lua_chon')::text, 'null'), '') || coalesce(nullif((x->'menh_de')::text, 'null'), '')), '\s+', '', 'g');
      -- 11/11: md5(khoá) = md5($1) chỉ để đi index <bảng>_khoa_trung_idx (mig 202611112136); so khoá đầy đủ vẫn giữ.
      execute format($q$select min(c.ma_cau) from %I c where c.xoa_at is null
                         and md5(regexp_replace(lower(c.noi_dung || coalesce(c.lua_chon::text, '') || coalesce(c.menh_de::text, '')), '\s+', '', 'g')) = md5($1)
                         and regexp_replace(lower(c.noi_dung || coalesce(c.lua_chon::text, '') || coalesce(c.menh_de::text, '')), '\s+', '', 'g') = $1$q$, v_tbl)
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
