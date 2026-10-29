-- ============================================================================
-- 202610291647 — (1) XOÁ HẲN tài khoản test TESTQLHT003 · (2) TEST01–10 đưa xu về 0 · (3) sửa view số dư xu
-- Thùy 29/10 chọn phương án (a) sau khi được liệt kê đủ cái sẽ mất (Luật xoá), và "Lỗi kia sửa luôn đi".
-- ----------------------------------------------------------------------------
-- (1) TESTQLHT003 (hoc_sinh 43da0d83-aa45-4f3f-b020-89e75ca057d2, tạo 23/08) — trạng thái 'dang_hoc' nên bị tính như em thật.
--     MẤT (đo 29/10): 4 dòng sổ xu (+500 cộng tay, −50 đổi quà, +1, +50 hoàn ⇒ 501 xu) · 1 đơn đổi quà · 100 lượt tự luyện ·
--     17 bài test + 16 bài làm (kèm câu/gợi ý/phát hành theo cascade) · 4 dòng Học từ đầu · 5 dòng điểm danh (2 buổi 10B1, đã rời lớp 29/09)
--     + bảng_không_bù theo cascade · 1 bổ trợ yếu · 1 bổ trợ đuổi · 1 hs_level_log · 1 ghi danh lớp · 2 dòng hoc_sinh_lop_log (tham chiếu text)
--     · 1 dòng tai_khoan (email testqlht003@hs.bkdemy.local). Tài khoản Auth cùng email KHÔNG xoá được từ role này — xoá trong Supabase Auth.
--     Thứ tự lá → gốc; mỗi bước có chốt số dòng, lệch ⇒ raise, cả file rollback.
-- (2) TEST01–10 GIỮ tài khoản; ví ≠ 0 (đo 29/10: TEST06 3 · TEST07 4) ⇒ 1 dòng tru_tay về 0, người ghi = Admin hệ thống. Không tự động lặp
--     (tài khoản test còn dùng để thử luồng xu/nông trại).
-- (3) qlht_v_so_du_xu: xu_dieu_chinh chỉ cộng cong_tay/tru_tay/doi_qua/hoan ⇒ so_du THIẾU nong_trai, giai_thuong, nghi_ve_0 — lệch với
--     fn_tuqua_so_du (cộng đủ sổ). Sửa: xu_dieu_chinh = mọi loại KHÔNG phải chot_* ⇒ so_du = tổng cả sổ. Giữ nguyên tên/kiểu/thứ tự cột.
--     Người đọc view: qlht_doi_qua_moi + qlht_dieu_chinh_xu (kiểm đủ xu), listSoDuXu (tuqua.ts), thanhtich.ts.
-- ============================================================================

do $$
declare
  h constant uuid := '43da0d83-aa45-4f3f-b020-89e75ca057d2';
  n int;
begin
  if not exists (select 1 from public.hoc_sinh where id = h and ma_hs = 'TESTQLHT003') then
    raise exception 'Không thấy TESTQLHT003 đúng id — dừng';
  end if;

  delete from public.qlht_xu_ledger where hoc_sinh_id = h;      get diagnostics n = row_count; if n <> 4 then raise exception 'sổ xu: % ≠ 4', n; end if;
  delete from public.qlht_qua_order where hoc_sinh_id = h;      get diagnostics n = row_count; if n <> 1 then raise exception 'đơn quà: % ≠ 1', n; end if;
  delete from public.xu_thanh_phan where hoc_sinh_id = h;
  delete from public.buoi_hoc_hs where hoc_sinh_id = h;         get diagnostics n = row_count; if n <> 5 then raise exception 'điểm danh: % ≠ 5', n; end if;
  delete from public.tu_luyen_dang_lan where hoc_sinh_id = h;   get diagnostics n = row_count; if n <> 100 then raise exception 'tự luyện: % ≠ 100', n; end if;
  delete from public.bai_lam where hoc_sinh_id = h;             get diagnostics n = row_count; if n <> 16 then raise exception 'bài làm: % ≠ 16', n; end if;
  delete from public.bai_test where hoc_sinh_id = h;            get diagnostics n = row_count; if n <> 17 then raise exception 'bài test: % ≠ 17', n; end if;
  delete from public.hoc_tu_dau_dang where hoc_sinh_id = h;     get diagnostics n = row_count; if n <> 4 then raise exception 'học từ đầu: % ≠ 4', n; end if;
  delete from public.hoc_sinh_lop_log where hoc_sinh_id = h;    get diagnostics n = row_count; if n <> 2 then raise exception 'log lớp: % ≠ 2', n; end if;
  delete from public.tai_khoan where hoc_sinh_id = h;           get diagnostics n = row_count; if n <> 1 then raise exception 'tài khoản: % ≠ 1', n; end if;
  delete from public.hoc_sinh where id = h;                     get diagnostics n = row_count; if n <> 1 then raise exception 'học sinh: % ≠ 1', n; end if;
end $$;

-- (2) TEST01–10 về 0 xu
do $$
declare n int;
begin
  insert into public.qlht_xu_ledger (hoc_sinh_id, amount, loai, ly_do, nguoi_tao)
  select s.hs, -s.du, 'tru_tay', format('Tài khoản test — đưa ví về 0 (số dư trước: %s xu) · Thùy 29/10', s.du),
         'f845ac87-1d8a-4120-b039-bf117eea2ed0'::uuid
  from (select x.hoc_sinh_id as hs, sum(x.amount)::integer as du
        from public.qlht_xu_ledger x join public.hoc_sinh h on h.id = x.hoc_sinh_id
        where h.trang_thai = 'test' group by 1) s
  where s.du <> 0;
  get diagnostics n = row_count;
  if n <> 2 then raise exception 'ví test ≠ 0: % ≠ 2', n; end if;
end $$;

-- (3) View số dư = tổng cả sổ
create or replace view public.qlht_v_so_du_xu as
select hs.id as hoc_sinh_id,
    hs.ho_ten,
    coalesce(e.exp_total, 0::bigint) as exp_total,
    coalesce(k.xu_chot, 0::bigint)::integer as xu_kiem,
    coalesce(l.dieu_chinh, 0::bigint) as xu_dieu_chinh,
    coalesce(k.xu_chot, 0::bigint) + coalesce(l.dieu_chinh, 0::bigint) as so_du,
    hs.ma_hs,
    hs.khoi,
    hs.anh_url,
    hs.trang_thai
  from public.hoc_sinh hs
    left join (select hoc_sinh_id, sum(amount) as exp_total from public.gami_exp_ledger group by hoc_sinh_id) e on e.hoc_sinh_id = hs.id
    left join (select hoc_sinh_id, sum(amount) as xu_chot from public.qlht_xu_ledger
               where loai = any (array['chot_thang', 'chot_lai']) group by hoc_sinh_id) k on k.hoc_sinh_id = hs.id
    left join (select hoc_sinh_id, sum(amount) as dieu_chinh from public.qlht_xu_ledger
               where loai <> all (array['chot_thang', 'chot_lai']) group by hoc_sinh_id) l on l.hoc_sinh_id = hs.id
  where public.la_thanh_vien();
