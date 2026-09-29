-- Thùy 29/09: "reset toàn bộ các trạng thái bổ trợ yếu về L0, đưa vào danh sách duyệt bổ trợ để Trang duyệt lại" +
--   "ai đã có trạng thái xếp lớp rồi thì giữ lại. Còn lại thì reset về L0" ⇒ Thùy "OK reset" đúng phạm vi đo 29/09:
--   GIỮ 25 em đang có lịch (case mở có buổi 'mo' chưa đóng ca) · RESET 72 em =
--     55 case mở "Cần xếp" (7 ưu tiên Cao) ⇒ đóng: ket_qua 'bo', ghi chú 'Reset 29/09 — chờ duyệt lại'
--     17 em đã 'day_xong' nhưng còn L1 ⇒ chỉ hạ mức
--   ⇒ xoá 71 dòng hs_level kiến thức (L0 = không có dòng, §1.5) · ghi 72 dòng hs_level_log, ly_do_may.nguon = 'reset_duyet_lai'
--     (dấu này đưa em vào hàng đợi Duyệt bổ trợ — src/lib/danhgia.ts — tới khi có lần duyệt mới).
--   9 bài retest đang mở của 55 case bị đóng ⇒ trang_thai 'dong' (giống hạ L0 ở fn_btyeu_doi_level; retest đang HOLD nên không ai thấy).
--   KHÔNG xoá dạng, bài làm, buổi, retest nào. Số lệch với lúc đo ⇒ raise, cả migration rollback.

-- Log kiến thức mới nhất của từng em (1 nguồn cho hàng đợi Duyệt: "đã duyệt trong cửa sổ" + "reset chờ duyệt lại").
create or replace function public.fn_btyeu_log_kt_moi_nhat(p_hs uuid[], p_mon text)
returns table (hoc_sinh_id uuid, created_at timestamptz, nguon text)
language sql stable set search_path = public as $$
  select distinct on (l.hoc_sinh_id) l.hoc_sinh_id, l.created_at, l.ly_do_may->>'nguon'
  from hs_level_log l
  where l.hoc_sinh_id = any(p_hs) and l.mon = p_mon and l.loai = 'kien_thuc'
  order by l.hoc_sinh_id, l.created_at desc
$$;
grant execute on function public.fn_btyeu_log_kt_moi_nhat(uuid[], text) to authenticated;

do $$
declare v_giu int; v_reset int; v_case int; v_lv int; v_log int; v_rt int;
begin
  create temp table _giu on commit drop as
    select distinct y.hoc_sinh_id, y.mon from bo_tro_yeu y
      join buoi_hoc_hs hh on hh.bo_tro_yeu_id = y.id join buoi_hoc b on b.id = hh.buoi_hoc_id
      where y.trang_thai = 'dang_xu' and b.trang_thai = 'mo' and b.danh_gia_xong_at is null;
  create temp table _reset on commit drop as
    select d.hoc_sinh_id, d.mon, coalesce(lv.level, 0) as level_cu, y.id as case_id from (
      select hoc_sinh_id, mon from hs_level where loai = 'kien_thuc' and level >= 1
      union select hoc_sinh_id, mon from bo_tro_yeu where trang_thai = 'dang_xu') d
    left join hs_level lv on lv.hoc_sinh_id = d.hoc_sinh_id and lv.mon = d.mon and lv.loai = 'kien_thuc'
    left join bo_tro_yeu y on y.hoc_sinh_id = d.hoc_sinh_id and y.mon = d.mon and y.trang_thai = 'dang_xu'
    where not exists (select 1 from _giu g where g.hoc_sinh_id = d.hoc_sinh_id and g.mon = d.mon);

  select count(*) into v_giu from _giu;
  select count(*) into v_reset from _reset;
  if v_giu <> 25 or v_reset <> 72 then raise exception 'Lệch phạm vi đã duyệt: giữ % (kỳ vọng 25), reset % (kỳ vọng 72)', v_giu, v_reset; end if;

  -- Log TRƯỚC (bằng chứng) — cùng khuôn fn_btyeu_doi_level
  insert into hs_level_log (hoc_sinh_id, mon, loai, level_cu, level_may_de_xuat, ly_do_may, level_chot, ly_do_nguoi, actor)
    select r.hoc_sinh_id, r.mon, 'kien_thuc', r.level_cu, null,
           jsonb_build_object('nguon', 'reset_duyet_lai', 'case_id', r.case_id), 0, 'Reset 29/09 — chờ duyệt lại (Thùy)', null
    from _reset r;
  get diagnostics v_log = row_count;

  update bai_test t set trang_thai = 'dong', dong_at = now()
    where t.loai = 'retest' and t.trang_thai = 'mo'
      and exists (select 1 from buoi_hoc_hs hh join _reset r on r.case_id = hh.bo_tro_yeu_id where hh.buoi_hoc_id = t.buoi_hoc_id)
      and not exists (select 1 from bai_lam bl where bl.bai_test_id = t.id and bl.trang_thai = 'da_nop');
  get diagnostics v_rt = row_count;

  update bo_tro_yeu y set trang_thai = 'hoan_thanh', hoan_thanh_at = now(), ket_qua = 'bo', ghi_chu_dong = 'Reset 29/09 — chờ duyệt lại'
    from _reset r where y.id = r.case_id;
  get diagnostics v_case = row_count;

  delete from hs_level lv using _reset r where lv.hoc_sinh_id = r.hoc_sinh_id and lv.mon = r.mon and lv.loai = 'kien_thuc';
  get diagnostics v_lv = row_count;

  if v_log <> 72 or v_case <> 55 or v_lv <> 71 or v_rt > 9 then
    raise exception 'Lệch số: log % (72) · case % (55) · hs_level % (71) · retest % (≤9)', v_log, v_case, v_lv, v_rt;
  end if;
  raise notice 'Reset OK: giữ % · log % · đóng case % · xoá hs_level % · đóng retest %', v_giu, v_log, v_case, v_lv, v_rt;
end $$;
