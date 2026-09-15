-- ============================================================================
-- TỰ LUYỆN — MỖI LƯỢT = 1 BÀI RIÊNG (Thùy 29/08: "mỗi lần luyện phải độc lập chứ sao lại gộp
-- tất cả các câu"). Bỏ model cộng-dồn-1-bài/ngày của 202608201111: giờ mỗi lượt bấm luyện là
-- 1 bai_test MỚI 10 câu, chấm/kết quả độc lập theo lượt. Mastery/xếp hạng KHÔNG ảnh hưởng —
-- cả hai đều tính theo TỪNG CÂU (bai_lam_cau join bai_test loai='tu_luyen'), không đếm bài.
--
-- ① Index: bỏ unique 1 bài/(HS×môn×ngày) — ràng buộc này CHÍNH LÀ model cũ, giữ thì không tạo
--    nổi lượt thứ hai trong ngày. Không mất dữ liệu (chỉ là ràng buộc). Thay bằng index THƯỜNG
--    cùng cột — query "các lượt hôm nay" (client) vẫn nhanh. Race StrictMode/bấm đúp giờ chặn
--    bằng guard client (daGoi ref — hàng rào duy nhất còn lại, đã ghi chú tại LamTuLuyen).
-- ② tu_luyen_sinh: thay NGUYÊN VĂN — bỏ toàn bộ nhánh tìm-bài-hôm-nay/FOR UPDATE/append/bắt
--    unique_violation; mỗi lần gọi = INSERT bài mới, thu_tu từ 1. Chọn câu/chống lặp/snapshot
--    GIỮ NGUYÊN (sổ tu_luyen_dang_lan theo (HS, môn, dạng) — xuyên bài, không đổi).
--    Thêm: cả lượt không ra nổi CÂU NÀO (kho cạn) → raise exception (rollback cả bai_test vừa
--    insert trong cùng transaction) thay vì để lại bài rỗng so_cau=0 mồ côi.
-- ============================================================================

drop index if exists bai_test_tu_luyen_uniq;
create index if not exists bai_test_tu_luyen_idx on bai_test (hoc_sinh_id, mon, ngay) where loai = 'tu_luyen';

create or replace function public.tu_luyen_sinh(p_mon text, p_dangs jsonb, p_nhanh text default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_lop uuid;
  v_bt_id uuid;
  v_them integer := jsonb_array_length(p_dangs);
  v_cautbl text := public._kho_cau_tbl(p_mon, p_nhanh);
  v_lttbl text := public._kho_lt_tbl(p_mon, p_nhanh);
  v_thu_tu integer := 0;
  v_ma_dang text;
  v_lan_thu integer;
  v_used_batch text[] := '{}';
  v_ma_cau text;
  v_row record;
  v_ly_thuyet text;
  v_ok_count integer := 0;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  if v_them is null or v_them = 0 then raise exception 'Không có dạng nào để sinh.'; end if;

  select lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
    order by hl.ngay_vao desc limit 1;
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'tu_luyen', p_mon, 0, 'mo')
    returning id into v_bt_id;

  for v_ma_dang in select jsonb_array_elements_text(p_dangs) loop
    v_thu_tu := v_thu_tu + 1;

    select coalesce(max(lan_thu), 0) + 1 into v_lan_thu
      from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon and ma_dang = v_ma_dang;

    -- Ứng viên: chưa dùng trong 9 lần gần nhất của CHÍNH dạng này, VÀ chưa dùng trong lượt này (v_used_batch).
    -- Chỉ câu HỖ TRỢ CHẤM ONLINE (TN/ĐS/TLN có đáp án) — cùng tập SUPPORTED của testonline.ts,
    -- tránh chọn câu tự luận/thiếu đáp án thành câu KHÔNG chấm được.
    v_ma_cau := null;
    execute format($q$
      select ma_cau from %1$I
      where dang_chinh = $1 and xoa_at is null
        and (
          (loai_cau in ('trac_nghiem','tra_loi_ngan') and dap_an is not null)
          or (loai_cau = 'dung_sai' and jsonb_array_length(coalesce(menh_de,'[]'::jsonb)) >= 2)
        )
        and ma_cau <> all($2)
        and ma_cau not in (
          select ma_cau from tu_luyen_dang_lan
          where hoc_sinh_id = $3 and mon = $4 and ma_dang = $1 and lan_thu > $5 - 10
        )
      order by random() limit 1
    $q$, v_cautbl)
    into v_ma_cau using v_ma_dang, v_used_batch, v_hs, p_mon, v_lan_thu;

    -- Hết ứng viên tránh-lặp → CHẤP NHẬN LẶP (CEO chốt), chỉ né trùng NGAY TRONG lượt này.
    if v_ma_cau is null then
      execute format($q$
        select ma_cau from %1$I
        where dang_chinh = $1 and xoa_at is null
          and (
          (loai_cau in ('trac_nghiem','tra_loi_ngan') and dap_an is not null)
          or (loai_cau = 'dung_sai' and jsonb_array_length(coalesce(menh_de,'[]'::jsonb)) >= 2)
        )
          and ma_cau <> all($2)
        order by random() limit 1
      $q$, v_cautbl)
      into v_ma_cau using v_ma_dang, v_used_batch;
    end if;

    -- Dạng không có câu nào trong kho (hiếm) → BỎ RIÊNG slot này, không suy đoán (§1.5).
    if v_ma_cau is null then
      v_thu_tu := v_thu_tu - 1;
      continue;
    end if;

    v_used_batch := v_used_batch || v_ma_cau;

    execute format($q$select * from %1$I where ma_cau = $1$q$, v_cautbl) into v_row using v_ma_cau;

    v_ly_thuyet := null;
    execute format($q$select noi_dung from %1$I where ma_dang = $1$q$, v_lttbl) into v_ly_thuyet using v_row.dang_chinh;

    insert into bai_test_cau (bai_test_id, thu_tu, bien_the, ma_cau, loai_cau, noi_dung, lua_chon,
      menh_de, dap_an_key, loi_giai, anh_de, anh_dap_an, ma_dang, ly_thuyet, diem)
    values (
      v_bt_id, v_thu_tu, 1, v_row.ma_cau, v_row.loai_cau, v_row.noi_dung, v_row.lua_chon, v_row.menh_de,
      case v_row.loai_cau
        when 'trac_nghiem' then to_jsonb(upper(trim(v_row.dap_an)))
        when 'tra_loi_ngan' then to_jsonb(trim(v_row.dap_an))
        when 'dung_sai' then (select jsonb_agg(case when upper(left(trim(m->>'dap_an'), 1)) = 'S' then 'S' else 'D' end)
                               from jsonb_array_elements(coalesce(v_row.menh_de, '[]'::jsonb)) m)
        else to_jsonb(v_row.dap_an)
      end,
      v_row.loi_giai, v_row.anh_de, v_row.anh_dap_an, v_row.dang_chinh, v_ly_thuyet, 1
    );

    insert into tu_luyen_dang_lan (hoc_sinh_id, mon, ma_dang, lan_thu, ma_cau, bai_test_id)
      values (v_hs, p_mon, v_ma_dang, v_lan_thu, v_ma_cau, v_bt_id);

    v_ok_count := v_ok_count + 1;
  end loop;

  -- Không ra nổi câu nào → rollback (raise huỷ cả insert bai_test ở trên), không để bài rỗng mồ côi.
  if v_ok_count = 0 then
    raise exception 'Kho câu tạm hết cho các dạng của em — thử lại sau nhé.';
  end if;

  update bai_test set so_cau = v_ok_count where id = v_bt_id;
  return jsonb_build_object('bai_test_id', v_bt_id, 'them', v_ok_count, 'tong', v_ok_count);
end $$;
grant execute on function public.tu_luyen_sinh(text, jsonb, text) to authenticated;
