-- ============================================================================
-- 202610221741 — de_thi_gan_btvn_giu_cau_truc_de
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 22/10: "Trong việc gán đề thi làm BTVN — builder không chia dạng bài tập mà để đúng format và thứ tự của đề thi luôn.
--   Không cần hiển thị dạng ở bản in." ⇒ THAY quyết định 16/10 (mig 202610162203: BTVN tách theo dạng để khớp BTVN chuẩn).
--   Nhánh 'btvn' của fn_de_thi_gan giờ GIỮ CẤU TRÚC PHẦN I/II/III của đề y như nhánh giáo trình: mỗi phần đề = 1 phần 'btvn'
--   (ref_ma NULL — không gắn dạng; tieu_de = tên phần đề), câu theo đúng thứ tự trong đề. Câu đã xoá khỏi kho vẫn bỏ như trước.
--   Mastery không phụ thuộc phần (câu tự mang dạng của nó ở kho) ⇒ bỏ tách theo dạng không mất gì về đo.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất dữ liệu — chỉ đổi thân hàm. BTVN đã gán trước đây giữ nguyên cấu trúc cũ (theo dạng).
-- ============================================================================

create or replace function public.fn_de_thi_gan(p_de uuid, p_lop uuid, p_ngay date, p_loai text)
 returns uuid language plpgsql security definer set search_path to 'public'
as $function$
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

  -- GIỮ CẤU TRÚC PHẦN I/II/III + THỨ TỰ câu của đề cho CẢ giáo trình (GV dạy theo khối phần) lẫn BTVN (Thùy 22/10).
  -- BTVN: phần 'btvn', không gắn dạng (ref_ma NULL), bỏ câu đã xoá khỏi kho (như bản 16/10).
  for r in select * from tai_lieu_phan where tai_lieu_id = p_de and loai_phan = 'custom' order by thu_tu loop
    insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, tieu_de, noi_dung, kieu, diem_moi_cau)
    values (v_id, v_tt, case p_loai when 'btvn' then 'btvn' else 'dang' end, null, r.tieu_de, r.noi_dung, r.kieu, r.diem_moi_cau)
    returning id into v_phan;
    insert into tai_lieu_cau (phan_id, ma_cau, thu_tu, diem)
      select v_phan, c.ma_cau, c.thu_tu, c.diem from tai_lieu_cau c
       where c.phan_id = r.id
         and (p_loai <> 'btvn' or c.ma_cau not in (select x.ma_cau from public.fn_de_thi_cau(p_de) x where x.xoa));
    v_tt := v_tt + 1;
  end loop;

  return v_id;
end $function$;
