-- ============================================================================
-- 202610081748 — test_dau_vao_anh_bai_da_cham
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 08/10 — "Bước chấm Test cần thêm 1 bước là upload bài đã chấm lên, để lúc trả bài nhìn được
-- bài của HS, sau này PH cũng nhìn được". Trước đó bài đã chấm chỉ có 1 ô `bai_da_cham_url` (1 file) do Ops
-- scan ở một màn riêng, ít ai dùng (13/53 ca). Bài test thường NHIỀU TRANG ⇒ cột mảng, người CHẤM tự up
-- ngay ở màn chấm; đóng chấm bắt buộc có ≥1 ảnh (client dongChamTest).
--  · `bai_da_cham_anh text[]` = NGUỒN DUY NHẤT từ nay. Rỗng = chưa up (không NULL — §1.5).
--  · Chép 13 ca cũ từ `bai_da_cham_url` sang. Cột cũ GIỮ NGUYÊN (không xoá), từ nay KHÔNG ghi nữa.
--  · 2 RPC thêm/bỏ ảnh nguyên tử (không đọc–sửa–ghi mảng ở client).
--  · fn_test_dau_vao_phieu trả thêm `baiDaChamAnh` (giữ `baiDaChamUrl` cho chỗ cũ).
--
-- MẤT GÌ: không mất gì (thêm cột, chép dữ liệu, thay hàm cùng chữ ký).
-- ============================================================================

alter table ca_test add column if not exists bai_da_cham_anh text[] not null default '{}';
comment on column ca_test.bai_da_cham_anh is 'Ảnh/scan bài ĐÃ CHẤM (nhiều trang), người chấm up ở màn Chấm. Nguồn duy nhất từ 08/10.';
comment on column ca_test.bai_da_cham_url is 'CŨ (tới 08/10): 1 file do Ops scan. Đã chép sang bai_da_cham_anh, KHÔNG ghi nữa.';

update ca_test set bai_da_cham_anh = array[bai_da_cham_url]
 where bai_da_cham_url is not null and bai_da_cham_anh = '{}';

-- Thêm ảnh (nối cuối, bỏ trùng). Invoker ⇒ RLS ca_test (la_thanh_vien) quyết quyền.
create or replace function fn_ca_test_anh_da_cham_them(p_ca_test_id uuid, p_urls text[])
returns text[] language sql security invoker set search_path = public as $$
  update ca_test c
     set bai_da_cham_anh = c.bai_da_cham_anh || array(select t.u from unnest(p_urls) with ordinality t(u, i)
                                    where t.u <> '' and not (t.u = any(c.bai_da_cham_anh))
                                    group by t.u order by min(t.i))
   where c.id = p_ca_test_id
  returning c.bai_da_cham_anh;
$$;
-- Bỏ 1 ảnh khỏi danh sách (chỉ bỏ THAM CHIẾU, file trên storage giữ nguyên).
create or replace function fn_ca_test_anh_da_cham_bo(p_ca_test_id uuid, p_url text)
returns text[] language sql security invoker set search_path = public as $$
  update ca_test c set bai_da_cham_anh = array_remove(c.bai_da_cham_anh, p_url)
   where c.id = p_ca_test_id
  returning c.bai_da_cham_anh;
$$;
revoke execute on function fn_ca_test_anh_da_cham_them(uuid, text[]) from public, anon;
revoke execute on function fn_ca_test_anh_da_cham_bo(uuid, text) from public, anon;
grant execute on function fn_ca_test_anh_da_cham_them(uuid, text[]) to authenticated;
grant execute on function fn_ca_test_anh_da_cham_bo(uuid, text) to authenticated;

CREATE OR REPLACE FUNCTION public.fn_test_dau_vao_phieu(p_ca_test_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
AS $function$
declare
  v jsonb;
begin
  with ct as (
    select c.id, c.mon, c.ngay, c.nhan_xet, c.bai_da_cham_url, c.bai_da_cham_anh, c.diem_nhap, c.cham_xong_at, c.tra_bai_xong_at,
           uv.ho_ten_hs, uv.khoi, uv.gioi_tinh, uv.lop_du_kien_id
    from ca_test c join ung_vien uv on uv.id = c.ung_vien_id
    where c.id = p_ca_test_id
  ),
  cau as (
    select cc.id, cc.thu_tu, cc.diem_toi_da, cc.ma_dang, cc.nhanh, cc.muc_do, cc.ten_chuyen_de,
           kq.ket_qua, kq.diem
    from ca_test_cau cc left join ca_test_cau_kq kq on kq.ca_test_cau_id = cc.id
    where cc.ca_test_id = p_ca_test_id
  ),
  tong as (
    select count(*) as so_cau, count(ket_qua) as da_cham,
           coalesce(sum(diem) filter (where ket_qua is not null), 0) as diem,
           coalesce(sum(diem_toi_da) filter (where ket_qua is not null), 0) as toi_da
    from cau
  ),
  theo_cd as (
    select coalesce(ten_chuyen_de, 'Khác') as chuyen_de,
           sum(diem) as diem, sum(diem_toi_da) as toi_da, count(*) as so_cau, min(thu_tu) as tt
    from cau where ket_qua is not null
    group by 1
  ),
  nhom as (
    -- 1 dòng / nhóm: co_ban · nang_cao · dai · hinh — null khi nhóm không có câu đã chấm
    select
      (select jsonb_build_object('diem', sum(diem), 'toiDa', sum(diem_toi_da), 'soCau', count(*),
               'pct', round(100 * sum(diem) / nullif(sum(diem_toi_da), 0)))
         from cau where ket_qua is not null and muc_do is not null and muc_do <= 3) as co_ban,
      (select jsonb_build_object('diem', sum(diem), 'toiDa', sum(diem_toi_da), 'soCau', count(*),
               'pct', round(100 * sum(diem) / nullif(sum(diem_toi_da), 0)))
         from cau where ket_qua is not null and muc_do is not null and muc_do >= 4) as nang_cao,
      (select jsonb_build_object('diem', sum(diem), 'toiDa', sum(diem_toi_da), 'soCau', count(*),
               'pct', round(100 * sum(diem) / nullif(sum(diem_toi_da), 0)))
         from cau where ket_qua is not null and nhanh = 'dai') as dai,
      (select jsonb_build_object('diem', sum(diem), 'toiDa', sum(diem_toi_da), 'soCau', count(*),
               'pct', round(100 * sum(diem) / nullif(sum(diem_toi_da), 0)))
         from cau where ket_qua is not null and nhanh = 'hinh') as hinh
  ),
  lop_dx as (
    select l.id, l.ten_lop,
      (select coalesce(jsonb_agg(ns.ho_ten order by pc.la_chinh desc, ns.ho_ten), '[]'::jsonb)
         from phan_cong_lop pc join nhan_su ns on ns.id = pc.nhan_su_id
        where pc.lop_id = l.id and pc.vai_tro = 'gv') as gv,
      (select jsonb_build_object('hoTen', ns.ho_ten, 'anhUrl', ns.anh_url)
         from phan_cong_lop pc join nhan_su ns on ns.id = pc.nhan_su_id
        where pc.lop_id = l.id and pc.vai_tro = 'gv' order by pc.la_chinh desc, ns.ho_ten limit 1) as gv_chinh,
      (select jsonb_build_object('hoTen', ns.ho_ten, 'anhUrl', ns.anh_url)
         from phan_cong_lop pc join nhan_su ns on ns.id = pc.nhan_su_id
        where pc.lop_id = l.id and pc.vai_tro = 'tg' order by pc.la_chinh desc, ns.ho_ten limit 1) as tg_chinh,
      (select coalesce(jsonb_agg(jsonb_build_object('thu', t.thu, 'gioBatDau', to_char(t.gio_bat_dau, 'HH24:MI'),
                'gioKetThuc', to_char(t.gio_ket_thuc, 'HH24:MI'), 'phong', t.phong) order by t.thu, t.gio_bat_dau), '[]'::jsonb)
         from thoi_khoa_bieu t
        where t.lop_id = l.id
          and t.hieu_luc_tu <= (now() at time zone 'Asia/Ho_Chi_Minh')::date
          and (t.hieu_luc_den is null or t.hieu_luc_den >= (now() at time zone 'Asia/Ho_Chi_Minh')::date)) as lich
    from ct join lop l on l.id = ct.lop_du_kien_id
  )
  select jsonb_build_object(
    'hoTenHs', ct.ho_ten_hs, 'khoi', ct.khoi, 'gioiTinh', ct.gioi_tinh, 'mon', ct.mon, 'ngay', ct.ngay,
    'diemNhap', ct.diem_nhap, 'chamXong', ct.cham_xong_at is not null, 'traBaiXong', ct.tra_bai_xong_at is not null,
    'tong', (select jsonb_build_object('soCau', so_cau, 'daCham', da_cham, 'diem', diem, 'toiDa', toi_da,
                                       'pct', coalesce(round(100 * diem / nullif(toi_da, 0)), 0)) from tong),
    'theoChuyenDe', (select coalesce(jsonb_agg(jsonb_build_object('chuyenDe', chuyen_de, 'diem', diem, 'toiDa', toi_da,
                        'soCau', so_cau, 'pct', coalesce(round(100 * diem / nullif(toi_da, 0)), 0)) order by tt), '[]'::jsonb) from theo_cd),
    'theoMucDo', (select jsonb_build_object('coBan', co_ban, 'nangCao', nang_cao) from nhom),
    'theoNhanh', (select jsonb_build_object('dai', dai, 'hinh', hinh) from nhom),
    'nhanXet', ct.nhan_xet, 'baiDaChamUrl', ct.bai_da_cham_url, 'baiDaChamAnh', to_jsonb(ct.bai_da_cham_anh),
    'lopDeXuat', (select jsonb_build_object('id', id, 'tenLop', ten_lop, 'gv', gv, 'gvChinh', gv_chinh, 'tgChinh', tg_chinh, 'lich', lich) from lop_dx)
  ) into v
  from ct;
  return v; -- null nếu ca không tồn tại / RLS chặn
end $function$
;
