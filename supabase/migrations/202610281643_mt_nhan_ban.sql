-- NHÂN BẢN MT (Thùy 28/10: "2 lớp thi gần giống nhau nhưng khác nhau 20% ⇒ nhân bản đề để chỉ sửa 20%").
-- Chép 1 MT MẪU (tai_lieu loai='mt', lop_id NULL) thành MẪU MỚI độc lập: mọi phần (tiêu đề, Cơ bản/Nâng cao, thứ tự…) + mọi câu
-- (đúng thứ tự) + cau_hinh (điểm từng câu, form in, số dòng, 2 cột, 3 mã đề, bài Hình, hệ ép theo phần, loại đề/tháng).
-- 1 transaction — hỏng giữa chừng thì không còn bản sao dở dang.
--
-- MÃ GỐC BẤT BIẾN (CLAUDE §2): bản sao là ĐỐI TƯỢNG MỚI ⇒ cấp mã MỚI cho những gì là danh tính riêng của đề:
--   · phần: id mới (phanBac khoá theo id phần ⇒ đổi theo);
--   · hàng Hình `HINH:<uuid>` (định danh hàng trong đề, không phải câu kho) ⇒ uuid mới; mọi khoá trỏ tới nó trong cau_hinh
--     (hinhByMa, diemByCau 'HINH:<uuid>#<ý>', colByCau…) đổi theo. Câu kho (mã câu) giữ nguyên — đó là tham chiếu, không phải danh tính.
-- KHÔNG chép: `hinhBuoiId` (buổi Hình MẪU kiểu cũ — deleteMT xoá kèm, chép sang thì xoá bản sao giết luôn buổi của bản gốc) ·
--   `hsMaDe` (mã đề theo HS chỉ có ở bản đã gán lớp) · duyệt · lượt gán lớp (bản sao chưa gán lớp nào).
-- Dấu vết: cau_hinh.nhanBanTu = id MT gốc.
create or replace function public.fn_mt_nhan_ban(p_de uuid, p_ten text default null)
returns uuid
language plpgsql
as $$
declare
  v_goc  tai_lieu%rowtype;
  v_moi  uuid := gen_random_uuid();
  v_ch   jsonb;
  v_k    text;
  v_v    jsonb;
  v_ma   jsonb;   -- bảng đổi mã { cũ: mới } (không dùng bảng tạm)
begin
  select * into v_goc from tai_lieu where id = p_de;
  if not found then raise exception 'Không tìm thấy MT %', p_de; end if;
  if v_goc.loai <> 'mt' or v_goc.lop_id is not null then
    raise exception 'Chỉ nhân bản được MT mẫu (không phải bản đã gán lớp)';
  end if;

  -- bảng đổi mã: phần (id cũ → mới) + hàng Hình (HINH:cũ → HINH:mới)
  select coalesce(jsonb_object_agg(x.cu, x.moi), '{}'::jsonb) into v_ma from (
    select p.id::text as cu, gen_random_uuid()::text as moi from tai_lieu_phan p where p.tai_lieu_id = p_de
    union all
    select h.ma_cau, 'HINH:' || gen_random_uuid()::text from (
      select distinct tc.ma_cau from tai_lieu_phan p join tai_lieu_cau tc on tc.phan_id = p.id
       where p.tai_lieu_id = p_de and tc.ma_cau like 'HINH:%') h
  ) x;

  -- cau_hinh: mọi khoá-cấp-1 là OBJECT ⇒ đổi khoá con theo bảng mã (khớp đúng, hoặc '<mã>#<ý>' của ý Hình)
  v_ch := coalesce(v_goc.cau_hinh, '{}'::jsonb) - 'hinhBuoiId' - 'hsMaDe';
  for v_k, v_v in select * from jsonb_each(v_ch) loop
    if jsonb_typeof(v_v) = 'object' and v_v <> '{}'::jsonb then
      v_ch := jsonb_set(v_ch, array[v_k], (
        select jsonb_object_agg(
                 coalesce(v_ma ->> e.key,
                          case when position('#' in e.key) > 0 and v_ma ? split_part(e.key, '#', 1)
                               then (v_ma ->> split_part(e.key, '#', 1)) || substr(e.key, position('#' in e.key)) end,
                          e.key), e.value)
          from jsonb_each(v_v) e
      ));
    end if;
  end loop;
  v_ch := v_ch || jsonb_build_object('nhanBanTu', p_de);

  insert into tai_lieu (id, loai, ten, khoi, ma_chuyen_de, theme, cau_hinh, created_by, mon, nhanh, ban_do, phase)
  values (v_moi, 'mt', coalesce(nullif(btrim(p_ten), ''), v_goc.ten || ' (bản sao)'), v_goc.khoi, v_goc.ma_chuyen_de, v_goc.theme,
          v_ch, jwt_uid(), v_goc.mon, v_goc.nhanh, v_goc.ban_do, v_goc.phase);

  insert into tai_lieu_phan (id, tai_lieu_id, thu_tu, loai_phan, ref_ma, tieu_de, noi_dung, kieu, hien_lt, diem_moi_cau, nang_cao, cha_id, hien_vi_du)
  select (v_ma ->> p.id::text)::uuid, v_moi, p.thu_tu, p.loai_phan, p.ref_ma, p.tieu_de, p.noi_dung, p.kieu, p.hien_lt, p.diem_moi_cau,
         p.nang_cao, (v_ma ->> p.cha_id::text)::uuid, p.hien_vi_du
    from tai_lieu_phan p
   where p.tai_lieu_id = p_de
   order by (p.cha_id is not null), p.thu_tu;   -- phần cha trước phần con (FK cha_id)

  insert into tai_lieu_cau (phan_id, ma_cau, thu_tu, diem)
  select (v_ma ->> p.id::text)::uuid, coalesce(v_ma ->> tc.ma_cau, tc.ma_cau), tc.thu_tu, tc.diem
    from tai_lieu_phan p
    join tai_lieu_cau tc on tc.phan_id = p.id
   where p.tai_lieu_id = p_de;

  return v_moi;
end $$;

revoke execute on function public.fn_mt_nhan_ban(uuid, text) from public, anon;
grant execute on function public.fn_mt_nhan_ban(uuid, text) to authenticated;
