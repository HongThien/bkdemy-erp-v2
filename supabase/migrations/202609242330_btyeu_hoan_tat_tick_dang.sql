-- Thùy 24/09 khuya — 2 luật: (1) buổi chưa học xong bị huỷ ⇒ về xếp lại (đã đúng); (2) BUỔI XONG ⇒ CASE PHẢI SANG TRẠNG THÁI TIẾP.
-- Gốc vi phạm (2): đóng ca chỉ đánh dấu "đã dạy" cho dạng em LUYỆN TRÊN APP; em học giấy / không luyện app ⇒ đóng xong 0 dạng tiến ⇒ case về Cần xếp
-- với nguyên dạng cũ, trông như chưa học (đo 24/09: 10/14 buổi yếu đã đóng ca có 0 dạng tiến) ⇒ OPS đi "sửa" buổi cũ (vụ Triệu Đức Tùng, Minh Quân…).
-- Thùy chọn: lúc HOÀN TẤT CA, TA tick dạng đã dạy (mặc định tick hết). 10 buổi cũ: coi như đã dạy hết dạng của buổi.
-- Kèm: retest chỉ chấm dạng CÓ trong bài retest (fn_btyeu_retest_ghi) — bài cũ chỉ lấy ≤3 dạng em luyện app ⇒ dạng dạy thêm sẽ kẹt "Chờ retest" mãi.
-- ⇒ helper bổ sung câu retest cho MỌI dạng vừa dạy mà chưa nằm trong bài retest chưa nộp nào.
-- MẤT GÌ: drop chữ ký cũ fn_btyeu_hoan_tat(uuid,text,text,text) — thay bằng bản thêm p_dang_day (mặc định null = hành vi cũ). Không xoá dữ liệu.

-- ── 1) Bổ sung retest cho các dạng vừa dạy ở 1 buổi ─────────────────────────────────────────────────────────────────
create or replace function public._btyeu_bu_retest(p_buoi uuid, p_dangs text[]) returns uuid
language plpgsql security definer set search_path = public as $$
declare b record; v_lop uuid; v_ngay date; v_rt uuid; v_cautbl text; v_lttbl text; v_tru text[]; v_can text[]; v_moi integer; v_caus text[]; c text; d text; i integer;
begin
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null or coalesce(array_length(p_dangs, 1), 0) = 0 then return null; end if;
  -- dạng đang CHỜ RETEST (đã dạy, dat null, chưa đóng) mà chưa có câu trong bài retest chưa nộp nào của case
  select coalesce(array_agg(x.ma_dang order by x.ma_dang), '{}') into v_can from bo_tro_yeu_dang x
   where x.bo_tro_yeu_id = b.bo_tro_yeu_id and x.ma_dang = any(p_dangs) and x.dong_at is null and x.day_at is not null and x.dat is null
     and not exists (select 1 from bai_test t join bai_test_cau k on k.bai_test_id = t.id
                     join buoi_hoc_hs hh on hh.buoi_hoc_id = t.buoi_hoc_id and hh.bo_tro_yeu_id = b.bo_tro_yeu_id
                     where t.loai = 'retest' and t.hoc_sinh_id = b.hoc_sinh_id and k.ma_dang = x.ma_dang
                       and not exists (select 1 from bai_lam bl where bl.bai_test_id = t.id and bl.trang_thai = 'da_nop'));
  if array_length(v_can, 1) is null then return null; end if;
  v_cautbl := public._kho_cau_tbl(b.mon); v_lttbl := public._kho_lt_tbl(b.mon);
  select hl.lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = b.hoc_sinh_id and hl.trang_thai = 'dang_hoc' and l.mon = b.mon order by hl.ngay_vao desc limit 1;
  -- có bài retest CHƯA NỘP của buổi này ⇒ bổ sung vào; không thì sinh bài mới, ngày = buổi thường kế tiếp của lớp (≤28 ngày, như fn_btyeu_dong_ca)
  select t.id into v_rt from bai_test t where t.buoi_hoc_id = p_buoi and t.loai = 'retest'
    and not exists (select 1 from bai_lam bl where bl.bai_test_id = t.id and bl.trang_thai = 'da_nop') order by t.created_at desc limit 1;
  if v_rt is null then
    if v_lop is null then return null; end if;
    select g.d::date into v_ngay from generate_series(public._btyeu_today() + 1, public._btyeu_today() + 28, interval '1 day') g(d)
      where exists (select 1 from thoi_khoa_bieu t where t.lop_id = v_lop and t.thu = extract(isodow from g.d)::int + 1
                      and t.hieu_luc_tu <= g.d::date and (t.hieu_luc_den is null or t.hieu_luc_den >= g.d::date))
      order by g.d limit 1;
    if v_ngay is null then return null; end if;
    insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai, buoi_hoc_id)
      values (null, v_lop, b.hoc_sinh_id, v_ngay, 'retest', b.mon, 0, 'mo', p_buoi) returning id into v_rt;
  end if;
  select coalesce(array_agg(distinct k.ma_cau), '{}') into v_tru from bai_test t join bai_test_cau k on k.bai_test_id = t.id where t.buoi_hoc_id = p_buoi and k.ma_cau is not null;
  select coalesce(max(thu_tu), 0) into i from bai_test_cau where bai_test_id = v_rt;
  v_moi := greatest(1, least(3, 9 / array_length(v_can, 1))); -- 3 câu/dạng, tổng ~9; nhiều dạng thì ít câu/dạng nhưng dạng nào cũng có
  foreach d in array v_can loop
    v_caus := public._btyeu_chon_cau(v_cautbl, d, null, v_tru, v_moi); -- MCQ tuyệt đối (§4 spec-bo-tro); dạng 0 MCQ ⇒ không có câu (như cũ)
    foreach c in array coalesce(v_caus, '{}') loop
      i := i + 1; perform public._kho_snapshot_cau(v_rt, v_cautbl, v_lttbl, c, i, null); v_tru := v_tru || c;
    end loop;
  end loop;
  update bai_test set so_cau = (select count(*) from bai_test_cau where bai_test_id = v_rt) where id = v_rt;
  if (select so_cau from bai_test where id = v_rt) = 0 then delete from bai_test where id = v_rt; return null; end if; -- bài vừa đẻ mà rỗng
  return v_rt;
end $$;

-- ── 2) Hoàn tất ca: TA tick dạng đã dạy ⇒ case tiến ──────────────────────────────────────────────────────────────────
drop function if exists public.fn_btyeu_hoan_tat(uuid, text, text, text);
create or replace function public.fn_btyeu_hoan_tat(p_buoi uuid, p_nhan_xet text, p_muc_ma text default null, p_khong_test_ly_do text default null, p_dang_day text[] default null)
returns void language plpgsql security definer set search_path = public as $$
declare b record; v_ns uuid := public._btyeu_my_ns(); v_admin boolean; v_test_da_nop boolean; v_co_test boolean; v_nx text; v_day text[];
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select la_admin into v_admin from public.my_quyen();
  select * into b from public._btyeu_buoi(p_buoi);
  if b.buoi_id is null then raise exception 'Không phải buổi bổ trợ yếu.'; end if;
  if b.nguoi_day_tg is distinct from v_ns and not coalesce(v_admin, false) then raise exception 'Chỉ người đứng ca (hoặc admin).'; end if;
  if b.danh_gia_xong_at is not null then return; end if; -- idempotent
  select exists (select 1 from bai_test bt where bt.buoi_hoc_id = p_buoi and bt.loai = 'bo_tro_test'),
         exists (select 1 from bai_test bt join bai_lam bl on bl.bai_test_id = bt.id where bt.buoi_hoc_id = p_buoi and bt.loai = 'bo_tro_test' and bl.trang_thai = 'da_nop')
    into v_co_test, v_test_da_nop;
  if v_co_test and not v_test_da_nop and nullif(trim(coalesce(p_khong_test_ly_do, '')), '') is null then
    raise exception 'Em chưa làm bài kiểm tra cuối buổi — nhập lý do "không test" nếu em không làm.';
  end if;
  v_nx := nullif(trim(coalesce(p_nhan_xet, '')), '');
  if v_co_test and not v_test_da_nop then v_nx := concat_ws(E'\n', '[Không test: ' || trim(p_khong_test_ly_do) || ']', v_nx); end if;
  if v_nx is null and p_muc_ma is null then raise exception 'Nhập nhận xét hoặc chọn mức.'; end if;

  -- Thùy 24/09: buổi xong ⇒ case phải tiến. p_dang_day = dạng TA xác nhận ĐÃ DẠY buổi này (null = client cũ ⇒ giữ hành vi cũ).
  if p_dang_day is not null then
    update bo_tro_yeu_dang set day_at = null, day_buoi_id = null -- TA bỏ tick dạng máy tự đánh dấu ở buổi này
      where bo_tro_yeu_id = b.bo_tro_yeu_id and day_buoi_id = p_buoi and dong_at is null and dat is null and not (ma_dang = any(p_dang_day));
    update bo_tro_yeu_dang set day_at = now(), day_buoi_id = p_buoi
      where bo_tro_yeu_id = b.bo_tro_yeu_id and day_at is null and dong_at is null and ma_dang = any(p_dang_day);
    update bo_tro_yeu_dang set dat = null -- retest trượt, dạy lại xong ⇒ chờ retest mới
      where bo_tro_yeu_id = b.bo_tro_yeu_id and dat = false and dong_at is null and ma_dang = any(p_dang_day);
    v_day := p_dang_day;
  else
    select coalesce(array_agg(ma_dang), '{}') into v_day from bo_tro_yeu_dang where bo_tro_yeu_id = b.bo_tro_yeu_id and day_buoi_id = p_buoi;
  end if;

  insert into buoi_danh_gia (buoi_hoc_id, hoc_sinh_id, nhan_xet, muc_ma, graded_by, updated_at)
    values (p_buoi, b.hoc_sinh_id, v_nx, p_muc_ma, public.jwt_uid(), now())
    on conflict (buoi_hoc_id, hoc_sinh_id) do update set nhan_xet = excluded.nhan_xet, muc_ma = excluded.muc_ma, graded_by = excluded.graded_by, updated_at = now();
  update buoi_hoc set danh_gia_xong_at = now(), updated_at = now() where id = p_buoi;
  perform public._btyeu_bu_retest(p_buoi, v_day); -- mọi dạng vừa dạy đều có câu retest ⇒ không kẹt "Chờ retest"
end $$;
grant execute on function public.fn_btyeu_hoan_tat(uuid, text, text, text, text[]) to authenticated;

-- ── 3) 10 buổi đã đóng mà 0 dạng tiến (Thùy: coi như đã dạy hết dạng của buổi) ──────────────────────────────────────
-- Dạng của case có TỪ TRƯỚC lúc đóng ca, còn cần dạy ⇒ đã dạy tại buổi đó (day_at = lúc đóng ca); bổ sung retest (ngày = buổi thường kế tiếp từ hôm nay).
-- Trừ Triệu Đức Tùng (dữ liệu test, chờ xoá).
do $$ declare r record; v_day text[]; begin
  for r in
    select b.id, b.danh_gia_xong_at, hh.bo_tro_yeu_id cid
    from buoi_hoc b join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.bo_tro_yeu_id is not null join bo_tro_yeu y on y.id = hh.bo_tro_yeu_id
    where b.loai = 'bo_tro_yeu' and b.trang_thai <> 'huy' and b.danh_gia_xong_at is not null and hh.diem_danh = 'co_mat' and y.trang_thai = 'dang_xu'
      and hh.hoc_sinh_id <> '30a354aa-0c70-4dbb-88c7-4a540d2dd8bb'
      and not exists (select 1 from bo_tro_yeu_dang d where d.day_buoi_id = b.id)
    order by b.danh_gia_xong_at
  loop
    select coalesce(array_agg(d.ma_dang), '{}') into v_day from bo_tro_yeu_dang d
      where d.bo_tro_yeu_id = r.cid and d.dong_at is null and (d.day_at is null or d.dat = false) and d.created_at <= r.danh_gia_xong_at;
    update bo_tro_yeu_dang set day_at = r.danh_gia_xong_at, day_buoi_id = r.id where bo_tro_yeu_id = r.cid and day_at is null and ma_dang = any(v_day);
    update bo_tro_yeu_dang set dat = null where bo_tro_yeu_id = r.cid and dat = false and ma_dang = any(v_day);
    perform public._btyeu_bu_retest(r.id, v_day);
  end loop;
end $$;

-- ── 4) Tự bù retest (chạy mỗi lần mở màn Xếp, như fn_btyeu_don_ca_khong_dien_ra) ─────────────────────────────────────
-- Dạng đang chờ retest mà KHÔNG có câu trong bài retest chưa nộp nào ⇒ bổ sung. Gồm lỗi cũ (bài retest chỉ lấy ≤3 dạng — đo 24/09: Bảo Châu,
-- Nguyễn Ngọc Trâm Anh) và dạng CHƯA CÓ MCQ (không sinh được câu — MCQ tuyệt đối): khi phiên MCQ sinh + duyệt xong câu, lần mở màn kế tiếp tự thông.
create or replace function public.fn_btyeu_bu_retest_ton() returns integer
language plpgsql security definer set search_path = public as $$
declare r record; n integer := 0;
begin
  if not public.la_thanh_vien() and current_user not in ('claude_build', 'postgres') then return 0; end if;
  for r in
    select d.day_buoi_id as buoi, array_agg(d.ma_dang) as dangs
    from bo_tro_yeu_dang d join bo_tro_yeu y on y.id = d.bo_tro_yeu_id
    where y.trang_thai = 'dang_xu' and d.dong_at is null and d.day_at is not null and d.dat is null and d.day_buoi_id is not null
      and not exists (select 1 from bai_test t join bai_test_cau k on k.bai_test_id = t.id
                      where t.loai = 'retest' and t.hoc_sinh_id = y.hoc_sinh_id and k.ma_dang = d.ma_dang
                        and not exists (select 1 from bai_lam bl where bl.bai_test_id = t.id and bl.trang_thai = 'da_nop'))
    group by d.day_buoi_id
  loop
    if public._btyeu_bu_retest(r.buoi, r.dangs) is not null then n := n + 1; end if;
  end loop;
  return n;
end $$;
grant execute on function public.fn_btyeu_bu_retest_ton() to authenticated;
select public.fn_btyeu_bu_retest_ton();
