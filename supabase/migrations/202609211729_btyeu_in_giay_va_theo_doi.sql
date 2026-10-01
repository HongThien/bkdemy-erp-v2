-- Thùy 21/09 — 2 việc cho bổ trợ yếu:
-- (A) IN TÀI LIỆU: ca đang diễn ra mà thiếu iPad ⇒ in bài ra giấy. "Logic tương đương logic đưa câu hỏi — hệ thống định đưa bài nào trên
--     app thì giờ in ra giấy." ⇒ CÙNG bộ chọn câu `_btyeu_chon_cau` (MCQ tuyệt đối, né câu đã gặp trong ca) + CÙNG snapshot
--     `_kho_snapshot_cau` + CÙNG loại bài `bai_test.loai='bo_tro'` gắn buổi ⇒ tiến độ luyện / test cuối ca / câu-đã-gặp đều thấy bài giấy
--     y như bài app. Khác duy nhất: `bai_test.in_giay_at` (NULL = bài làm trên app — "không áp dụng", §1.5) và kết quả do NHÂN SỰ nhập
--     (em khoanh A/B/C/D trên giấy → TA bấm lại) qua `fn_btyeu_giay_nhap` — máy vẫn CHẤM theo key, TA không tự phán đúng/sai.
-- (B) MÀN THEO DÕI ca trong ngày: 1 RPC tổng hợp ở DB (§2.0).
-- MẤT GÌ: không. +1 cột nullable, +4 function.
alter table public.bai_test add column if not exists in_giay_at timestamptz;

-- Sinh 1 BÀI IN cho ca: mỗi dạng còn mở của case lấy p_so_cau câu MCQ. Dạng 0 MCQ trả về trong `dang_khong_co_cau` (không âm thầm bỏ).
create or replace function public.fn_btyeu_in_sinh(p_buoi uuid, p_so_cau integer default 5) returns jsonb
language plpgsql security definer set search_path = public as $$
declare b record; v_lop uuid; v_cautbl text; v_lttbl text; v_tru text[]; v_caus text[]; v_bt uuid; i integer := 0; c text; d record;
  v_thieu text[] := '{}'; v_n integer := greatest(1, least(coalesce(p_so_cau, 5), 10));
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự in được tài liệu.'; end if;
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null then raise exception 'Không thấy ca bổ trợ yếu.'; end if;
  if b.trang_thai <> 'mo' then raise exception 'Ca này không còn mở (%).', b.trang_thai; end if;
  if exists (select 1 from bai_test where buoi_hoc_id = p_buoi and loai = 'bo_tro_test') then raise exception 'Ca đã đóng — không in thêm bài luyện.'; end if;
  select hl.lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = b.hoc_sinh_id and hl.trang_thai = 'dang_hoc' and l.mon = b.mon order by hl.ngay_vao desc limit 1;
  if v_lop is null then raise exception 'Em chưa ghi danh lớp môn %.', b.mon; end if;
  v_cautbl := public._kho_cau_tbl(b.mon); v_lttbl := public._kho_lt_tbl(b.mon);
  select coalesce(array_agg(distinct btc.ma_cau), '{}') into v_tru
    from bai_test bt join bai_test_cau btc on btc.bai_test_id = bt.id where bt.buoi_hoc_id = p_buoi and btc.ma_cau is not null;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai, buoi_hoc_id, in_giay_at, created_by)
    values (null, v_lop, b.hoc_sinh_id, b.ngay, 'bo_tro', b.mon, 0, 'mo', p_buoi, now(), public.jwt_uid()) returning id into v_bt;
  for d in select ma_dang from bo_tro_yeu_dang where bo_tro_yeu_id = b.bo_tro_yeu_id and dong_at is null order by diem_luc_mo nulls last, created_at loop
    v_caus := public._btyeu_chon_cau(v_cautbl, d.ma_dang, null, v_tru, v_n);
    if coalesce(array_length(v_caus, 1), 0) = 0 then v_thieu := v_thieu || d.ma_dang; continue; end if;
    foreach c in array v_caus loop
      i := i + 1;
      perform public._kho_snapshot_cau(v_bt, v_cautbl, v_lttbl, c, i, null);
    end loop;
    v_tru := v_tru || v_caus;
  end loop;
  if i = 0 then
    -- Không có câu nào ⇒ raise làm ROLLBACK cả transaction, dòng bai_test vừa tạo tự biến mất (không để lại bài rỗng).
    raise exception 'Các dạng của ca này chưa có câu TRẮC NGHIỆM trong kho — chưa in được (bổ trợ chỉ dùng trắc nghiệm).';
  end if;
  update bai_test set so_cau = i where id = v_bt;
  return jsonb_build_object('bai_test_id', v_bt, 'so_cau', i, 'dang_khong_co_cau', to_jsonb(v_thieu));
end $$;
grant execute on function public.fn_btyeu_in_sinh(uuid, integer) to authenticated;

-- Nội dung 1 bài in (đề + key + lời giải + kết quả đã nhập) — cho trang in và màn nhập kết quả.
create or replace function public.fn_btyeu_in_lay(p_bai_test uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare t record; v_bd text; v_caus jsonb;
begin
  if not public.la_thanh_vien() then return null; end if;
  select bt.id, bt.mon, bt.ngay, bt.in_giay_at, bt.buoi_hoc_id, bt.hoc_sinh_id, hs.ho_ten, hs.ma_hs, hs.khoi,
         b.gio_bat_dau, b.gio_ket_thuc, b.phong, ns.ho_ten as nguoi_ten
    into t
  from bai_test bt join hoc_sinh hs on hs.id = bt.hoc_sinh_id
  left join buoi_hoc b on b.id = bt.buoi_hoc_id left join nhan_su ns on ns.id = b.nguoi_day_tg
  where bt.id = p_bai_test and bt.loai = 'bo_tro';
  if t.id is null then return null; end if;
  v_bd := public._kho_ban_do_tbl(t.mon);
  execute format($q$
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', k.id, 'thu_tu', k.thu_tu, 'ma_cau', k.ma_cau, 'ma_dang', k.ma_dang, 'ten_dang', coalesce(bd.ten_dang, k.ma_dang),
      'noi_dung', k.noi_dung, 'lua_chon', k.lua_chon, 'anh_de', k.anh_de, 'dap_an_key', k.dap_an_key, 'loi_giai', k.loi_giai,
      'chon', (select blc.dap_an_hs from bai_lam bl join bai_lam_cau blc on blc.bai_lam_id = bl.id where bl.bai_test_id = k.bai_test_id and blc.bai_test_cau_id = k.id limit 1),
      'verdict', (select blc.verdict from bai_lam bl join bai_lam_cau blc on blc.bai_lam_id = bl.id where bl.bai_test_id = k.bai_test_id and blc.bai_test_cau_id = k.id limit 1)
    ) order by k.thu_tu), '[]'::jsonb)
    from bai_test_cau k left join %1$I bd on bd.ma_dang = k.ma_dang where k.bai_test_id = $1
  $q$, v_bd) into v_caus using p_bai_test;
  return jsonb_build_object('bai_test_id', t.id, 'mon', t.mon, 'ngay', t.ngay, 'in_giay_at', t.in_giay_at, 'buoi_id', t.buoi_hoc_id,
    'hs', jsonb_build_object('id', t.hoc_sinh_id, 'ho_ten', t.ho_ten, 'ma_hs', t.ma_hs, 'khoi', t.khoi),
    'gio_bat_dau', t.gio_bat_dau, 'gio_ket_thuc', t.gio_ket_thuc, 'phong', t.phong, 'nguoi_ten', t.nguoi_ten, 'caus', v_caus);
end $$;
grant execute on function public.fn_btyeu_in_lay(uuid) to authenticated;

-- Nhập kết quả bài GIẤY: p_chon = 0..3 (A..D) em khoanh; null = xoá lựa chọn (nhập nhầm). Máy chấm theo key.
create or replace function public.fn_btyeu_giay_nhap(p_bai_test_cau uuid, p_chon integer) returns jsonb
language plpgsql security definer set search_path = public as $$
declare k record; v_bl uuid; v_verdict text; v_letters text[] := array['A','B','C','D','E','F'];
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự nhập được kết quả bài giấy.'; end if;
  select btc.id, btc.loai_cau, btc.dap_an_key, btc.diem, bt.id as bt_id, bt.hoc_sinh_id, bt.in_giay_at, bt.loai
    into k from bai_test_cau btc join bai_test bt on bt.id = btc.bai_test_id where btc.id = p_bai_test_cau;
  if k.id is null then raise exception 'Không thấy câu.'; end if;
  if k.loai <> 'bo_tro' or k.in_giay_at is null then raise exception 'Chỉ nhập tay cho bài bổ trợ IN GIẤY (bài trên app do em tự làm).'; end if;
  if k.loai_cau <> 'trac_nghiem' then raise exception 'Bài giấy chỉ có trắc nghiệm.'; end if;
  insert into bai_lam (bai_test_id, hoc_sinh_id, trang_thai, bat_dau_at) values (k.bt_id, k.hoc_sinh_id, 'dang_lam', now())
    on conflict (bai_test_id, hoc_sinh_id) do update set bai_test_id = excluded.bai_test_id returning id into v_bl;
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
grant execute on function public.fn_btyeu_giay_nhap(uuid, integer) to authenticated;

-- BẢNG THEO DÕI ca bổ trợ yếu của 1 ngày (mặc định hôm nay VN): trạng thái từng ca + tiến độ + bài giấy.
create or replace function public.fn_btyeu_ca_theo_doi(p_ngay date default null) returns jsonb
language sql stable security definer set search_path = public as $$
  select case when not public.la_thanh_vien() then '[]'::jsonb else coalesce(jsonb_agg(jsonb_build_object(
    'buoi_id', b.id, 'ngay', b.ngay, 'gio_bat_dau', b.gio_bat_dau, 'gio_ket_thuc', b.gio_ket_thuc, 'phong', b.phong, 'trang_thai', b.trang_thai,
    'nguoi_day_tg', b.nguoi_day_tg, 'nguoi_ten', ns.ho_ten, 'mon', y.mon, 'case_id', y.id, 'uu_tien', y.uu_tien,
    'hoc_sinh_id', hs.id, 'ho_ten', hs.ho_ten, 'ma_hs', hs.ma_hs, 'khoi', hs.khoi, 'diem_danh', hh.diem_danh, 'buoi_hoc_hs_id', hh.id,
    'level', coalesce((select l.level from hs_level l where l.hoc_sinh_id = hs.id and l.mon = y.mon and l.loai = 'kien_thuc'), 0),
    'so_dang', (select count(*) from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.dong_at is null),
    'so_cau', coalesce(td.so_cau, 0), 'so_dung', coalesce(td.so_dung, 0), 'cau_cuoi_at', td.cau_cuoi_at,
    'bai_giay', coalesce((select jsonb_agg(jsonb_build_object('bai_test_id', g.id, 'so_cau', g.so_cau, 'in_giay_at', g.in_giay_at,
                   'da_nhap', (select count(*) from bai_lam bl join bai_lam_cau blc on blc.bai_lam_id = bl.id where bl.bai_test_id = g.id and blc.verdict is not null)) order by g.in_giay_at)
                 from bai_test g where g.buoi_hoc_id = b.id and g.loai = 'bo_tro' and g.in_giay_at is not null), '[]'::jsonb),
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
grant execute on function public.fn_btyeu_ca_theo_doi(date) to authenticated;
