-- ============================================================================
-- 202610140230 — hinh_luyen_kho_chua_phan_mo_hinh   (spec-hinh-cay-nhanh.md §11 bước 1 + 3)
-- ----------------------------------------------------------------------------
-- VÌ SAO:
--   CEO 14/10: "chạy lớp 8. Nếu không gán được mô hình nào thì để ở màn Duyệt kho — giống 'chưa phân dạng'
--   thì đây là 'chưa phân mô hình'. Tao sẽ điền thủ công sau, hoặc làm mô hình mới rồi bảo mày duyệt lại."
--   ⇒ (a) kho Luyện nhận bài chép từ kho đề thi: cần KHOÁ TỰ NHIÊN trỏ về câu gốc (`nguon_ma_cau`) để chạy lại
--       không nhập trùng và truy được nguồn; "Phần 1. Hướng dẫn" là của CẢ BÀI ⇒ cột `huong_dan`;
--       bài máy không tách ý được ⇒ cờ `can_tach_tay` (không đoán — §1.5).
--   (b) hàng "chưa phân mô hình" = ý chưa có `baitoan_id` — TÍNH ở DB (§2.0), màn Duyệt kho chỉ gọi.
--   (c) gán ý → bài mô hình qua RPC: chỉ nhận bài thuộc mô hình `phan='luyen'` (mô hình cũ đã ẩn — không gán vào được).
--
-- MẤT GÌ: không.
-- ============================================================================
alter table hinh_bai
  add column if not exists nguon_ma_cau text,
  add column if not exists huong_dan    text,
  add column if not exists can_tach_tay boolean not null default false;
comment on column hinh_bai.nguon_ma_cau is 'Mã câu GỐC ở kho nguồn (vd hinh_hoc_cau_hoi.ma_cau của đề thi) mà bài này được chép ra. Khoá tự nhiên chống nhập trùng. NULL = nhập tay.';
comment on column hinh_bai.huong_dan    is 'Hướng dẫn / mấu chốt chung của CẢ BÀI (phần "Hướng dẫn" của lời giải gốc). Lời giải từng ý ở hinh_y.loi_giai.';
comment on column hinh_bai.can_tach_tay is 'true = máy KHÔNG tách được ý (đề và lời giải lệch số ý, hoặc câu Đúng/Sai) ⇒ bài đang là 1 ý chứa trọn đề; cần người tách.';
create unique index if not exists hinh_bai_nguon_ma_cau_uq on hinh_bai(nguon_ma_cau) where nguon_ma_cau is not null;

-- bài mô hình LUYỆN của một khối, kèm số hiển thị — danh sách để chọn khi gán ý
create or replace function fn_hl_bai_mo_hinh_luyen(p_khoi text)
returns table(baitoan_id uuid, ma text, so text, phat_bieu text, goc_id uuid, goc_ma text, goc_ten text, nhanh_id uuid, nhanh_ten text)
language sql stable set search_path = public as $$
  select s.baitoan_id, s.ma, s.so, b.phat_bieu, g.id, g.ma, g.ten, n.id, n.ten
    from hinh_mo_hinh g
    cross join lateral fn_hl_so_hien_thi(g.id) s
    join hinh_baitoan b on b.id = s.baitoan_id
    join hinh_mo_hinh n on n.id = s.mo_hinh_id
   where g.phan = 'luyen' and g.neo_baitoan_id is null and (p_khoi is null or g.khoi = p_khoi)
   order by g.ma, s.so
$$;

-- hàng "CHƯA PHÂN MÔ HÌNH": bài kho còn ít nhất 1 ý chưa gán bài mô hình (trả cả bài + mọi ý của nó)
create or replace function fn_hl_kho_chua_phan(p_khoi text, p_gioi_han int default 30, p_bo_qua int default 0)
returns jsonb language sql stable set search_path = public as $$
  with b as (
    select hb.* from hinh_bai hb
     where (p_khoi is null or hb.khoi = p_khoi)
       and exists (select 1 from hinh_y y where y.bai_id = hb.id and y.baitoan_id is null)
     order by hb.created_at, hb.ma_bai
     limit greatest(1, least(coalesce(p_gioi_han, 30), 200)) offset greatest(0, coalesce(p_bo_qua, 0))
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'ma_bai', b.ma_bai, 'khoi', b.khoi, 'nguon', b.nguon, 'nguon_ma_cau', b.nguon_ma_cau,
    'de_bai', b.de_bai, 'gia_thiet_chung', b.gia_thiet_chung, 'huong_dan', b.huong_dan, 'anh_de', b.anh_de,
    'can_tach_tay', b.can_tach_tay,
    'y', (select coalesce(jsonb_agg(jsonb_build_object(
            'id', y.id, 'ma_y', y.ma_y, 'thu_tu', y.thu_tu, 'nhan', y.nhan_hien_thi, 'noi_dung', y.noi_dung,
            'gia_thiet_them', y.gia_thiet_them, 'dap_an', y.dap_an, 'loi_giai', y.loi_giai, 'anh_loi_giai', y.anh_loi_giai,
            'anh_de', y.anh_de, 'da_duyet', y.da_duyet, 'baitoan_id', y.baitoan_id) order by y.thu_tu), '[]'::jsonb)
            from hinh_y y where y.bai_id = b.id)
  ) order by b.created_at, b.ma_bai), '[]'::jsonb) from b
$$;

-- đếm cho badge: mỗi khối bao nhiêu bài / ý chưa phân mô hình
create or replace function fn_hl_dem_chua_phan()
returns table(khoi text, so_bai bigint, so_y bigint)
language sql stable set search_path = public as $$
  select hb.khoi, count(distinct hb.id), count(*)
    from hinh_bai hb join hinh_y y on y.bai_id = hb.id
   where y.baitoan_id is null
   group by hb.khoi
$$;

-- GÁN một ý vào bài mô hình (p_baitoan = NULL để gỡ). Chỉ nhận bài của mô hình LUYỆN.
create or replace function fn_hl_gan_y(p_y uuid, p_baitoan uuid)
returns void language plpgsql set search_path = public as $$
begin
  if not exists (select 1 from hinh_y where id = p_y) then raise exception 'Ý không tồn tại'; end if;
  if p_baitoan is not null and not exists (
       select 1 from hinh_baitoan b join hinh_mo_hinh g on g.id = fn_hl_goc_mo_hinh(b.mo_hinh_id)
        where b.id = p_baitoan and g.phan = 'luyen') then
    raise exception 'Chỉ gán được vào bài của mô hình LUYỆN (mô hình cũ đã ẩn làm tham khảo)';
  end if;
  update hinh_y set baitoan_id = p_baitoan, co_thieu_node = false, updated_at = now() where id = p_y;
end $$;

revoke execute on function fn_hl_bai_mo_hinh_luyen(text), fn_hl_kho_chua_phan(text, int, int), fn_hl_dem_chua_phan(), fn_hl_gan_y(uuid, uuid) from public, anon;
grant execute on function fn_hl_bai_mo_hinh_luyen(text), fn_hl_kho_chua_phan(text, int, int), fn_hl_dem_chua_phan(), fn_hl_gan_y(uuid, uuid) to authenticated;
