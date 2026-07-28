-- ============================================================================
-- 202607241923 — kho_hinh_v3_derive
-- ----------------------------------------------------------------------------
-- VÌ SAO: 3 phép suy của kho Hình là ĐỆ QUY trên đồ thị (hậu duệ/tổ tiên mô hình,
--   bao đóng tiền đề). Spec §1.1 "derive — KHÔNG lưu cột" + §2.11 "business logic ở
--   Postgres" ⇒ đặt ở DB dưới dạng function, client chỉ gọi rpc. Làm ở client thì
--   mỗi màn phải tự tải cả lưới rồi tự đệ quy — 3 bản sao logic, lệch nhau lúc nào
--   không biết.
--
-- CHẶN CHU TRÌNH: cả 3 hàm mang guard đường-đi (mảng `duong`) của WITH RECURSIVE,
--   nên dù dữ liệu lỡ có vòng (bug tầng service) thì query vẫn dừng, không treo DB.
--
-- MẤT GÌ: không mất gì — chỉ thêm 3 function (create or replace).
-- ============================================================================

-- Hậu duệ của một mô hình (KHÔNG gồm chính nó) — dùng cho: phạm vi gợi ý khi gán,
-- "mô hình con dùng được toàn bộ N bài toán này", chặn vòng khi nối cha.
create or replace function hinh_mo_hinh_hau_due(goc uuid)
returns table (id uuid, do_sau int)
language sql stable security invoker as $$
  with recursive di as (
    select c.mo_hinh_id as id, 1 as do_sau, array[c.cha_id, c.mo_hinh_id] as duong
      from hinh_mo_hinh_cha c where c.cha_id = goc
    union all
    select c.mo_hinh_id, d.do_sau + 1, d.duong || c.mo_hinh_id
      from hinh_mo_hinh_cha c join di d on c.cha_id = d.id
     where not c.mo_hinh_id = any (d.duong)
  )
  select id, min(do_sau)::int from di group by id;
$$;

-- Tổ tiên của một mô hình (KHÔNG gồm chính nó) — dùng cho: tìm gốc họ (`la_goc_ho`),
-- độ sâu trong họ, kế thừa lý thuyết ("cha có tính chất gì, con dùng được hết").
create or replace function hinh_mo_hinh_to_tien(nut uuid)
returns table (id uuid, do_sau int)
language sql stable security invoker as $$
  with recursive di as (
    select c.cha_id as id, 1 as do_sau, array[c.mo_hinh_id, c.cha_id] as duong
      from hinh_mo_hinh_cha c where c.mo_hinh_id = nut
    union all
    select c.cha_id, d.do_sau + 1, d.duong || c.cha_id
      from hinh_mo_hinh_cha c join di d on c.mo_hinh_id = d.id
     where not c.cha_id = any (d.duong)
  )
  select id, min(do_sau)::int from di group by id;
$$;

-- Bao đóng tiền đề của một bài toán nhỏ, theo CÁCH MẶC ĐỊNH (§1.1).
-- `do_sau` = số bước lùi tối thiểu từ node gốc ⇒ sắp topo cho "lời giải liền mạch" (M8/M9).
-- Cách mặc định = la_mac_dinh, không có thì thu_tu nhỏ nhất (v1 mỗi node điền 1 cách).
create or replace function hinh_bao_dong_tien_de(goc uuid)
returns table (id uuid, do_sau int)
language sql stable security invoker as $$
  with recursive cach_md as (
    select distinct on (baitoan_id) baitoan_id, id
      from hinh_cach_giai
     order by baitoan_id, la_mac_dinh desc, thu_tu, id
  ), di as (
    select t.tien_de_id as id, 1 as do_sau, array[goc, t.tien_de_id] as duong
      from cach_md m join hinh_cach_tien_de t on t.cach_id = m.id
     where m.baitoan_id = goc
    union all
    select t.tien_de_id, d.do_sau + 1, d.duong || t.tien_de_id
      from di d
      join cach_md m on m.baitoan_id = d.id
      join hinh_cach_tien_de t on t.cach_id = m.id
     where not t.tien_de_id = any (d.duong)
  )
  select id, min(do_sau)::int from di group by id;
$$;

grant execute on function hinh_mo_hinh_hau_due(uuid) to authenticated;
grant execute on function hinh_mo_hinh_to_tien(uuid) to authenticated;
grant execute on function hinh_bao_dong_tien_de(uuid) to authenticated;
