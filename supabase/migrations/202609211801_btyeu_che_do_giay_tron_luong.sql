-- Thùy 21/09 (tối): "Thực tế có 2 chế độ bổ trợ: 100% trên app · hoặc IN GIẤY cho HS làm xong TA đánh giá trên app. Giao diện phải
-- clear đoạn này và có nút để trợ giảng bấm."
-- ⇒ Chế độ là 1 THUỘC TÍNH CỦA CA do TA chọn (không suy ngầm từ "đã có phiếu giấy chưa"): `buoi_hoc_hs.btyeu_che_do` = 'app' | 'giay'
--   (NULL = chưa chọn / buổi không phải bổ trợ yếu — "không áp dụng", §1.5). TA đổi bằng update thường (cùng quyền với điểm danh).
-- ⇒ Chế độ GIẤY phải đi TRỌN luồng: không có iPad thì em cũng không làm được TEST CUỐI CA trên app ⇒ test cũng in giấy, TA nhập đáp án em
--   khoanh, rồi TA bấm NỘP (test chỉ tính vào mastery khi `da_nop` — luật sẵn có). Câu em bỏ trống = sai (như mọi bài thi).
-- MẤT GÌ: không. +1 cột nullable, +2 function mới, thay 3 function của chính migration 202609211729.
alter table public.buoi_hoc_hs add column if not exists btyeu_che_do text check (btyeu_che_do in ('app', 'giay'));

-- Đánh dấu test cuối ca là BÀI GIẤY (để in + cho phép nhập tay). Idempotent.
create or replace function public.fn_btyeu_in_test(p_buoi uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_bt uuid; v_nop boolean;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự in được bài.'; end if;
  select id into v_bt from bai_test where buoi_hoc_id = p_buoi and loai = 'bo_tro_test' limit 1;
  if v_bt is null then raise exception 'Ca chưa đóng — chưa có bài kiểm tra cuối buổi.'; end if;
  select exists (select 1 from bai_lam where bai_test_id = v_bt and trang_thai = 'da_nop') into v_nop;
  if v_nop then raise exception 'Bài kiểm tra này đã nộp rồi.'; end if;
  update bai_test set in_giay_at = coalesce(in_giay_at, now()) where id = v_bt;
  return jsonb_build_object('bai_test_id', v_bt);
end $$;
grant execute on function public.fn_btyeu_in_test(uuid) to authenticated;

-- Nội dung bài in — giờ nhận cả test cuối ca; trả thêm `loai` + `da_nop`.
create or replace function public.fn_btyeu_in_lay(p_bai_test uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare t record; v_bd text; v_caus jsonb;
begin
  if not public.la_thanh_vien() then return null; end if;
  select bt.id, bt.loai, bt.mon, bt.ngay, bt.in_giay_at, bt.buoi_hoc_id, bt.hoc_sinh_id, hs.ho_ten, hs.ma_hs, hs.khoi,
         b.gio_bat_dau, b.gio_ket_thuc, b.phong, ns.ho_ten as nguoi_ten,
         exists (select 1 from bai_lam bl where bl.bai_test_id = bt.id and bl.trang_thai = 'da_nop') as da_nop
    into t
  from bai_test bt join hoc_sinh hs on hs.id = bt.hoc_sinh_id
  left join buoi_hoc b on b.id = bt.buoi_hoc_id left join nhan_su ns on ns.id = b.nguoi_day_tg
  where bt.id = p_bai_test and bt.loai in ('bo_tro', 'bo_tro_test');
  if t.id is null then return null; end if;
  v_bd := public._kho_ban_do_tbl(t.mon);
  execute format($q$
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', k.id, 'thu_tu', k.thu_tu, 'ma_cau', k.ma_cau, 'ma_dang', k.ma_dang, 'ten_dang', coalesce(bd.ten_dang, k.ma_dang),
      'loai_cau', k.loai_cau, 'noi_dung', k.noi_dung, 'lua_chon', k.lua_chon, 'anh_de', k.anh_de, 'dap_an_key', k.dap_an_key, 'loi_giai', k.loi_giai,
      'chon', (select blc.dap_an_hs from bai_lam bl join bai_lam_cau blc on blc.bai_lam_id = bl.id where bl.bai_test_id = k.bai_test_id and blc.bai_test_cau_id = k.id limit 1),
      'verdict', (select blc.verdict from bai_lam bl join bai_lam_cau blc on blc.bai_lam_id = bl.id where bl.bai_test_id = k.bai_test_id and blc.bai_test_cau_id = k.id limit 1)
    ) order by k.thu_tu), '[]'::jsonb)
    from bai_test_cau k left join %1$I bd on bd.ma_dang = k.ma_dang where k.bai_test_id = $1
  $q$, v_bd) into v_caus using p_bai_test;
  return jsonb_build_object('bai_test_id', t.id, 'loai', t.loai, 'da_nop', t.da_nop, 'mon', t.mon, 'ngay', t.ngay, 'in_giay_at', t.in_giay_at, 'buoi_id', t.buoi_hoc_id,
    'hs', jsonb_build_object('id', t.hoc_sinh_id, 'ho_ten', t.ho_ten, 'ma_hs', t.ma_hs, 'khoi', t.khoi),
    'gio_bat_dau', t.gio_bat_dau, 'gio_ket_thuc', t.gio_ket_thuc, 'phong', t.phong, 'nguoi_ten', t.nguoi_ten, 'caus', v_caus);
end $$;

-- Nhập kết quả giấy — giờ nhận cả test cuối ca (đã đánh dấu in giấy); bài ĐÃ NỘP thì khoá.
create or replace function public.fn_btyeu_giay_nhap(p_bai_test_cau uuid, p_chon integer) returns jsonb
language plpgsql security definer set search_path = public as $$
declare k record; v_bl uuid; v_tt text; v_verdict text; v_letters text[] := array['A','B','C','D','E','F'];
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự nhập được kết quả bài giấy.'; end if;
  select btc.id, btc.loai_cau, btc.dap_an_key, btc.diem, bt.id as bt_id, bt.hoc_sinh_id, bt.in_giay_at, bt.loai
    into k from bai_test_cau btc join bai_test bt on bt.id = btc.bai_test_id where btc.id = p_bai_test_cau;
  if k.id is null then raise exception 'Không thấy câu.'; end if;
  if k.loai not in ('bo_tro', 'bo_tro_test') or k.in_giay_at is null then raise exception 'Chỉ nhập tay cho bài bổ trợ IN GIẤY (bài trên app do em tự làm).'; end if;
  if k.loai_cau <> 'trac_nghiem' then raise exception 'Bài giấy chỉ có trắc nghiệm.'; end if;
  insert into bai_lam (bai_test_id, hoc_sinh_id, trang_thai, bat_dau_at) values (k.bt_id, k.hoc_sinh_id, 'dang_lam', now())
    on conflict (bai_test_id, hoc_sinh_id) do update set bai_test_id = excluded.bai_test_id returning id, trang_thai into v_bl, v_tt;
  if v_tt = 'da_nop' then raise exception 'Bài đã nộp — không sửa kết quả được nữa.'; end if;
  if p_chon is null then
    delete from bai_lam_cau where bai_lam_id = v_bl and bai_test_cau_id = k.id; -- xoá lựa chọn nhập nhầm (dòng do chính luồng nhập tay này tạo)
    return jsonb_build_object('chon', null, 'verdict', null);
  end if;
  if p_chon < 0 or p_chon > 5 then raise exception 'Lựa chọn không hợp lệ.'; end if;
  v_verdict := case when v_letters[p_chon + 1] = upper(trim(k.dap_an_key #>> '{}')) then 'correct' else 'wrong' end;
  insert into bai_lam_cau (bai_lam_id, bai_test_cau_id, dap_an_hs, verdict, diem, cham_boi, cham_at)
    values (v_bl, k.id, to_jsonb(p_chon), v_verdict, case when v_verdict = 'correct' then coalesce(k.diem, 1) else 0 end, 'manual', now())
    on conflict (bai_lam_id, bai_test_cau_id) do update set dap_an_hs = excluded.dap_an_hs, verdict = excluded.verdict, diem = excluded.diem, cham_boi = 'manual';
  return jsonb_build_object('chon', p_chon, 'verdict', v_verdict);
end $$;

-- NỘP test giấy: câu chưa nhập = em bỏ trống = sai; chuyển da_nop (từ đây test tính vào mastery + khối "Hoàn tất ca" mở).
create or replace function public.fn_btyeu_giay_nop(p_bai_test uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare t record; v_bl uuid; v_trong integer;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự nộp được bài giấy.'; end if;
  select id, loai, in_giay_at, hoc_sinh_id into t from bai_test where id = p_bai_test;
  if t.id is null or t.loai <> 'bo_tro_test' or t.in_giay_at is null then raise exception 'Chỉ nộp tay cho BÀI KIỂM TRA CUỐI CA in giấy.'; end if;
  insert into bai_lam (bai_test_id, hoc_sinh_id, trang_thai, bat_dau_at) values (t.id, t.hoc_sinh_id, 'dang_lam', now())
    on conflict (bai_test_id, hoc_sinh_id) do update set bai_test_id = excluded.bai_test_id returning id into v_bl;
  insert into bai_lam_cau (bai_lam_id, bai_test_cau_id, dap_an_hs, verdict, diem, cham_boi, cham_at)
    select v_bl, k.id, null, 'wrong', 0, 'manual', now() from bai_test_cau k
    where k.bai_test_id = t.id and not exists (select 1 from bai_lam_cau x where x.bai_lam_id = v_bl and x.bai_test_cau_id = k.id);
  get diagnostics v_trong = row_count;
  update bai_lam set trang_thai = 'da_nop', nop_at = now() where id = v_bl and trang_thai = 'dang_lam';
  return jsonb_build_object('bo_trong', v_trong,
    'so_dung', (select count(*) from bai_lam_cau where bai_lam_id = v_bl and verdict = 'correct'),
    'so_cau', (select count(*) from bai_test_cau where bai_test_id = t.id));
end $$;
grant execute on function public.fn_btyeu_giay_nop(uuid) to authenticated;

-- Bảng theo dõi: thêm chế độ của ca + test giấy.
create or replace function public.fn_btyeu_ca_theo_doi(p_ngay date default null) returns jsonb
language sql stable security definer set search_path = public as $$
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce(jsonb_agg(jsonb_build_object(
    'buoi_id', b.id, 'ngay', b.ngay, 'gio_bat_dau', b.gio_bat_dau, 'gio_ket_thuc', b.gio_ket_thuc, 'phong', b.phong, 'trang_thai', b.trang_thai,
    'nguoi_day_tg', b.nguoi_day_tg, 'nguoi_ten', ns.ho_ten, 'mon', y.mon, 'case_id', y.id, 'uu_tien', y.uu_tien,
    'hoc_sinh_id', hs.id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs, 'khoi', hs.khoi, 'diem_danh', hh.diem_danh, 'buoi_hoc_hs_id', hh.id,
    'che_do', hh.btyeu_che_do,
    'level', coalesce((select l.level from hs_level l where l.hoc_sinh_id = hs.id and l.mon = y.mon and l.loai = 'kien_thuc'), 0),
    'so_dang', (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.dong_at is null),
    'so_cau', coalesce(td.so_cau, 0), 'so_dung', coalesce(td.so_dung, 0), 'cau_cuoi_at', td.cau_cuoi_at,
    'bai_giay', coalesce((select jsonb_agg(jsonb_build_object('bai_test_id', g.id, 'loai', g.loai, 'so_cau', g.so_cau, 'in_giay_at', g.in_giay_at,
                   'da_nhap', (select count(*) from bai_lam bl join bai_lam_cau blc on blc.bai_lam_id = bl.id where bl.bai_test_id = g.id and blc.verdict is not null)) order by g.in_giay_at)
                 from bai_test g where g.buoi_hoc_id = b.id and g.loai in ('bo_tro', 'bo_tro_test') and g.in_giay_at is not null), '[]'::jsonb),
    'da_dong', exists (select 1 from bai_test t where t.buoi_hoc_id = b.id and t.loai = 'bo_tro_test'),
    'test_da_nop', exists (select 1 from bai_test t join bai_lam bl on bl.bai_test_id = t.id where t.buoi_hoc_id = b.id and t.loai = 'bo_tro_test' and bl.trang_thai = 'da_nop'),
    'danh_gia_xong_at', b.danh_gia_xong_at
  ) order by b.gio_bat_dau nulls last, ns.ho_ten, hs.ho_ten), '[]'::jsonb) end
  from buoi_hoc b
  join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.bo_tro_yeu_id is not null
  join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
  join hoc_sinh hs on hs.id = hh.hoc_sinh_id
  left join nhan_su ns on ns.id = b.nguoi_day_tg
  left join lateral (select sum(so_cau)::int so_cau, sum(so_dung)::int so_dung, max(cau_cuoi_at) cau_cuoi_at from public._btyeu_tien_do(b.id)) td on true
  where b.loai = 'bo_tro_yeu' and b.trang_thai <> 'huy'
    and b.ngay = coalesce(p_ngay, (now() at time zone 'Asia/Ho_Chi_Minh')::date)
$$;
