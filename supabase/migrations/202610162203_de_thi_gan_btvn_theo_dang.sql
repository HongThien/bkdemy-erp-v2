-- ============================================================================
-- 202610162203 — de_thi_gan_btvn_theo_dang
-- ----------------------------------------------------------------------------
-- VÌ SAO (Thùy 16/10): bản 202610011759 gán đề thi → BTVN giữ nguyên khuôn PHẦN của đề (Phần I/II/III = 1 phần
-- `btvn` ref_ma=null) — khớp "giao đề giống gán tài liệu" lúc đầu. Nhưng BTVN chuẩn của buổi học thì tách
-- theo DẠNG (ref_ma=ma_dang) ⇒ hệ hiển thị tên dạng + gom LT + chấm mastery đi đúng đường cũ. Giờ BTVN
-- GÁN TỪ ĐỀ cũng phải tách theo dạng cho KHỚP luồng BTVN chuẩn.
--
-- Cùng tay sửa 2 chỗ:
--   1. `fn_de_thi_gan(p_loai='btvn')` — group câu theo dang_chinh, mỗi dạng = 1 phần `btvn` ref_ma=ma_dang.
--      Câu dạng CHỜ (ma_dang NULL hoặc _kho_la_dang_cho) gộp 1 phần ref_ma=null, tieu_de='Chưa phân dạng'.
--      Thứ tự dạng = lần đầu xuất hiện trong đề (giữ mạch GV ra đề).
--   2. `fn_de_thi_gan(p_loai='giao_trinh_buoi')` GIỮ NGUYÊN khuôn copy theo PHẦN cũ — bài trên lớp cần cấu trúc
--      "Phần I TN · Phần II TLN · Phần III TL" để GV dạy từng khối, không tách theo dạng.
--
-- MẤT GÌ: không. Thay thân 1 hàm cùng chữ ký. Bản gán cũ (đã đẻ ra tài liệu) KHÔNG đụng — chỉ ảnh hưởng
-- các lần gán SAU khi migration áp. Muốn bản gán cũ cũng theo dạng mới: xoá tài liệu đã gán + gán lại.
-- ============================================================================

create or replace function public.fn_de_thi_gan(p_de uuid, p_lop uuid, p_ngay date, p_loai text)
returns uuid language plpgsql security definer set search_path = public as $$
declare tl record; lp record; v_cu text; v_id uuid; v_ch jsonb; v_form jsonb; r record; v_phan uuid; v_tt int := 1;
        v_nhan text := case p_loai when 'btvn' then 'BTVN' else 'GT' end;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if p_loai is null or p_loai not in ('giao_trinh_buoi', 'btvn') then
    raise exception 'Đề gán vào buổi chỉ thành Giáo trình (bài trên lớp) hoặc BTVN' using errcode = 'check_violation';
  end if;
  if p_lop is null or p_ngay is null then raise exception 'Thiếu lớp hoặc ngày'; end if;
  select * into tl from tai_lieu where id = p_de and loai = 'de_thi';
  if tl.id is null then raise exception 'Không phải đề thi: %', p_de; end if;
  if tl.duyet_at is null then raise exception 'Đề chưa duyệt — duyệt đề trước khi gán cho lớp' using errcode = 'check_violation'; end if;
  if (public.fn_de_thi_thieu(p_de) ->> 'so_chan')::int > 0 then
    raise exception 'Đề bị sửa sau khi duyệt và đang thiếu đáp án / phương án — xử lý rồi gán lại' using errcode = 'check_violation';
  end if;
  select id, ten_lop, mon into lp from lop where id = p_lop;
  if lp.id is null then raise exception 'Không thấy lớp'; end if;
  if lp.mon is distinct from tl.mon then
    raise exception 'Đề môn % không gán được cho lớp môn %', tl.mon, lp.mon using errcode = 'check_violation';
  end if;
  -- 1 buổi (lớp+ngày) chỉ có 1 Giáo trình + 1 BTVN (uq_tai_lieu_van_hanh). Không tự thay bản đang có.
  select ten into v_cu from tai_lieu where loai = p_loai and lop_id = p_lop and ngay = p_ngay limit 1;
  if v_cu is not null then
    raise exception 'Buổi % của lớp % đã có % «%» — xoá bản đó ở Kho tài liệu hoặc chọn ngày khác',
      to_char(p_ngay, 'DD/MM'), lp.ten_lop, case p_loai when 'btvn' then 'BTVN' else 'Giáo trình' end, v_cu
      using errcode = 'unique_violation';
  end if;

  -- Trả lời ngắn giữ đúng form (K5) — không để luật "khối 10–12 ép trắc nghiệm" đổi form.
  select coalesce(jsonb_object_agg(c.ma_cau, 'tra_loi_ngan'), '{}'::jsonb) into v_form
    from public.fn_de_thi_cau(p_de) c where c.loai_cau = 'tra_loi_ngan' and not c.xoa;
  v_ch := coalesce(tl.cau_hinh, '{}'::jsonb)
          || jsonb_build_object('etFormByCau', coalesce(tl.cau_hinh -> 'etFormByCau', '{}'::jsonb) || v_form);

  insert into tai_lieu (loai, ten, khoi, mon, nhanh, ma_chuyen_de, theme, cau_hinh, lop_id, ngay, nguon_id, created_by)
  values (p_loai, v_nhan || ' ' || lp.ten_lop || ' ' || to_char(p_ngay, 'DD/MM/YYYY') || ' · ' || tl.ten,
          tl.khoi, tl.mon, tl.nhanh, tl.ma_chuyen_de, tl.theme, v_ch, p_lop, p_ngay, p_de, public.jwt_uid())
  returning id into v_id;

  insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, tieu_de) values (v_id, 0, 'buoi', null, tl.ten);

  if p_loai = 'btvn' then
    -- ⭐ 16/10 (Thùy): BTVN TÁCH THEO DẠNG để khớp BTVN chuẩn của buổi học. Mỗi dạng = 1 phần 'btvn'
    -- (ref_ma=ma_dang). Câu dạng chờ (NULL hoặc *_000000) gộp vào 1 phần ref_ma=null 'Chưa phân dạng'.
    -- Thứ tự = min(stt) của câu đầu tiên trong dạng (giữ mạch đề).
    for r in
      with c as (
        select stt, ma_cau, diem,
               case when dang_chinh is null or public._kho_la_dang_cho(dang_chinh) then null else dang_chinh end as ma_dang_nhom
        from public.fn_de_thi_cau(p_de) where not xoa
      )
      select ma_dang_nhom, min(stt) as thu_tu_dau from c group by ma_dang_nhom order by min(stt)
    loop
      insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, tieu_de)
      values (v_id, v_tt, 'btvn', r.ma_dang_nhom, case when r.ma_dang_nhom is null then 'Chưa phân dạng' else null end)
      returning id into v_phan;
      insert into tai_lieu_cau (phan_id, ma_cau, thu_tu, diem)
      select v_phan, c.ma_cau, row_number() over (order by c.stt), c.diem
      from public.fn_de_thi_cau(p_de) c
      where not c.xoa
        and (case when c.dang_chinh is null or public._kho_la_dang_cho(c.dang_chinh) then null else c.dang_chinh end)
            is not distinct from r.ma_dang_nhom;
      v_tt := v_tt + 1;
    end loop;
  else
    -- Giáo trình (bài trên lớp) GIỮ CẤU TRÚC PHẦN I/II/III của đề — GV cần dạy theo khối phần.
    for r in select * from tai_lieu_phan where tai_lieu_id = p_de and loai_phan = 'custom' order by thu_tu loop
      insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, tieu_de, noi_dung, kieu, diem_moi_cau)
      values (v_id, v_tt, 'dang', null, r.tieu_de, r.noi_dung, r.kieu, r.diem_moi_cau)
      returning id into v_phan;
      insert into tai_lieu_cau (phan_id, ma_cau, thu_tu, diem)
        select v_phan, c.ma_cau, c.thu_tu, c.diem from tai_lieu_cau c where c.phan_id = r.id;
      v_tt := v_tt + 1;
    end loop;
  end if;

  return v_id;
end $$;
