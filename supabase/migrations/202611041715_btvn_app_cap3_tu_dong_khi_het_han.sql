-- ============================================================================
-- 202611041715 — btvn_app_cap3_tu_dong_khi_het_han
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 04/11 "Luồng BTVN cấp 3: những bài tập được phát hành trên app sẽ được tự động đóng khi hết giờ, ko cần TA đóng nữa."
--   Đo 13/10–04/11 (khối 10–12): BTVN đều làm trên app, đều có hạn nộp, 0 bài nộp ảnh; TA đóng trễ vài ngày (nhiều buổi 18–28/10
--   mới đóng hôm nay), có buổi đóng TRƯỚC hạn. Thùy chốt:
--   · Hết giờ: em có mặt BỎ TRỐNG ⇒ "Không làm bài"; đã trả lời câu nào ⇒ có làm; không điền đủ đáp án ⇒ thái độ "Chưa nghiêm túc".
--   · Sau hạn VẪN cho làm (không khoá — khoá thì lại phải mở), nhưng tính "Nộp muộn".
-- CÁCH:
--   · fn_btvn_online_dong_bo ⇒ tách lõi _btvn_online_dong_bo_core(p_buoi, p_ca_da_dong) (thân lấy NGUYÊN từ bản đang chạy);
--     bản cũ thành wrapper GIỮ chữ ký, hành vi y cũ (đã đóng thì không đụng).
--   · _btvn_app_tu_dong() (job 15 phút, lịch ở 202611041716 — SQL Editor): lớp khối 10·11·12, buổi thường không huỷ, BTVN app
--     (bai_test 'btvn' chung lớp) có hạn đã qua, ≤ 30 ngày; BỎ QUA buổi có bài nộp ảnh (TA chấm ảnh) và buổi chưa em nào trả lời trên
--     app (lớp làm giấy — không gán "Không làm bài" cả lớp). Chưa đóng ⇒ đổ kết quả + trạng thái + thái độ (chỉ ô trống, không đè TA)
--     ⇒ fn_dong_btvn (đường TA bấm) ⇒ giờ đóng = ĐÚNG giờ hạn ⇒ rút đề xuất gậy trễ khâu này. MÁY đã đóng (giờ đóng = giờ hạn) ⇒ vẫn đổ điểm bài làm mới;
--     "Không làm bài"/trống mà nay có trả lời ⇒ nộp đúng hạn/muộn theo giờ câu đầu tiên; đổi thì tính lại EXP tháng. Buổi TA tự đóng: không đụng
--     (thử ROLLBACK lần đầu: máy đổi 22 ô "Không làm bài" TA tick, có em TA đánh "chống đối" — quyết định của TA phải giữ).
-- MẤT GÌ (Luật xoá): Không xoá gì. Thay thân fn_btvn_online_dong_bo (wrapper, cùng hành vi); thêm 2 hàm. Job đổi trạng thái đề xuất
--   gậy 'cho' của khâu BTVN tự đóng ⇒ 'bo_qua' (dòng còn nguyên, xem lại được).
-- ============================================================================

CREATE OR REPLACE FUNCTION public._btvn_online_dong_bo_core(p_buoi uuid, p_ca_da_dong boolean)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare
  v_lop uuid; v_ngay date; v_dong timestamptz; v_test uuid; v_deadline timestamptz;
  v_moi int := 0; v_cap_nhat int := 0; v_giu_tay int := 0; v_khong_khop int := 0;
  v_khong_trong_buoi int := 0; v_hs_lam int := 0; v_hs_nop int := 0; v_nop_moi int := 0;
  r record;
begin
  select lop_id, ngay, btvn_dong_at into v_lop, v_ngay, v_dong from buoi_hoc where id = p_buoi;
  if v_lop is null then raise exception 'Không thấy buổi %', p_buoi; end if;
  if v_dong is not null and not p_ca_da_dong then return jsonb_build_object('daDong', true); end if;   -- p_ca_da_dong: job nhận bài nộp muộn (Thùy 04/11)

  select id, deadline into v_test, v_deadline from bai_test
   where lop_id = v_lop and ngay = v_ngay and loai = 'btvn'
   order by created_at desc limit 1;
  if v_test is null then return jsonb_build_object('khongCoTest', true); end if;

  select count(distinct bl.hoc_sinh_id), count(distinct bl.hoc_sinh_id) filter (where bl.trang_thai = 'da_nop')
    into v_hs_lam, v_hs_nop
    from bai_lam bl where bl.bai_test_id = v_test
     and exists (select 1 from bai_lam_cau x where x.bai_lam_id = bl.id and x.verdict is not null);

  -- ① Ô điểm: mọi phép đo có verdict (bài dở cũng đổ — BTVN chấm ngay từng câu).
  for r in
    select blc.id as blc_id, bl.hoc_sinh_id, blc.verdict,
           p.id as problem_id,
           exists (select 1 from buoi_hoc_hs h where h.buoi_hoc_id = p_buoi and h.hoc_sinh_id = bl.hoc_sinh_id) as trong_buoi,
           g.id as grade_id, g.bai_lam_cau_id as grade_nguon, g.result as grade_result
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test_cau bc on bc.id = blc.bai_test_cau_id
      left join bai_test_cau goc on goc.bai_test_id = bc.bai_test_id and goc.thu_tu = bc.thu_tu and goc.bien_the = 1
      left join gami_session_problems p on p.buoi_hoc_id = p_buoi and p.phase = 'btvn' and p.ma_cau = goc.ma_cau
      left join gami_grades g on g.problem_id = p.id and g.hoc_sinh_id = bl.hoc_sinh_id
     where bl.bai_test_id = v_test
       and blc.verdict in ('correct', 'partial', 'wrong')
  loop
    if not r.trong_buoi then v_khong_trong_buoi := v_khong_trong_buoi + 1; continue; end if;
    if r.problem_id is null then v_khong_khop := v_khong_khop + 1; continue; end if;
    if r.grade_id is not null and r.grade_nguon is null then v_giu_tay := v_giu_tay + 1; continue; end if;
    if r.grade_id is null then
      insert into gami_grades (buoi_hoc_id, problem_id, hoc_sinh_id, result, presentation, speed, points, loi, graded_by, bai_lam_cau_id)
      values (p_buoi, r.problem_id, r.hoc_sinh_id, r.verdict, 'clean', 'normal',
              case r.verdict when 'correct' then 100 when 'partial' then 50 else 0 end,
              '[]'::jsonb, public.jwt_uid(), r.blc_id)
      on conflict (problem_id, hoc_sinh_id) do update
         set result = excluded.result, points = excluded.points,
             bai_lam_cau_id = excluded.bai_lam_cau_id, graded_by = excluded.graded_by, graded_at = now()
       where gami_grades.bai_lam_cau_id is not null; -- không đụng ô chấm tay (đề phòng, lý do xem VÌ SAO)
      v_moi := v_moi + 1;
    elsif r.grade_result is distinct from r.verdict or r.grade_nguon is distinct from r.blc_id then
      update gami_grades
         set result = r.verdict,
             points = case r.verdict when 'correct' then 100 when 'partial' then 50 else 0 end,
             bai_lam_cau_id = r.blc_id, graded_by = public.jwt_uid(), graded_at = now()
       where id = r.grade_id;
      v_cap_nhat := v_cap_nhat + 1;
    end if;
  end loop;

  -- ② Trạng thái nộp: HS làm HẾT (da_nop) + trong roster + CHƯA có trạng thái ⇒ tự điền theo hạn.
  for r in
    select bl.hoc_sinh_id, bl.nop_at
      from bai_lam bl
     where bl.bai_test_id = v_test and bl.trang_thai = 'da_nop'
       and exists (select 1 from buoi_hoc_hs h where h.buoi_hoc_id = p_buoi and h.hoc_sinh_id = bl.hoc_sinh_id)
       and not exists (select 1 from btvn_ket_qua k where k.buoi_hoc_id = p_buoi and k.hoc_sinh_id = bl.hoc_sinh_id and k.trang_thai_nop is not null)
  loop
    insert into btvn_ket_qua (buoi_hoc_id, hoc_sinh_id, trang_thai_nop, updated_at)
    values (p_buoi, r.hoc_sinh_id,
            case when v_deadline is not null and r.nop_at is not null and r.nop_at > v_deadline then 'nop_muon' else 'nop_dung_han' end,
            now())
    on conflict (hoc_sinh_id, buoi_hoc_id) do update
      set trang_thai_nop = excluded.trang_thai_nop, updated_at = now()
      where btvn_ket_qua.trang_thai_nop is null;
    v_nop_moi := v_nop_moi + 1;
  end loop;

  return jsonb_build_object('hsLam', v_hs_lam, 'hsNop', v_hs_nop, 'moi', v_moi, 'capNhat', v_cap_nhat,
                            'giuTay', v_giu_tay, 'khongKhopO', v_khong_khop, 'khongTrongBuoi', v_khong_trong_buoi,
                            'nopMoi', v_nop_moi);
end $function$;

-- Wrapper giữ NGUYÊN chữ ký cũ (client + các màn gọi { p_buoi }).
create or replace function public.fn_btvn_online_dong_bo(p_buoi uuid)
 returns jsonb
 language plpgsql
as $function$
begin
  -- BTVN đã đóng ⇒ như cũ: không đụng (màn chấm gọi mỗi lần mở tab). Đường nhận bài nộp MUỘN sau khi đóng chỉ do job
  -- _btvn_app_tu_dong() gọi thẳng lõi với p_ca_da_dong = true (Thùy 04/11).
  return public._btvn_online_dong_bo_core(p_buoi, false);
end $function$;

-- ── JOB: BTVN app cấp 3 tự đóng khi hết hạn + nhận bài nộp muộn sau đó ──────────────────────────────────────────────
-- Gọi 15 phút/lần (lịch 202611041716, SQL Editor). Idempotent: chạy lại không đổi gì nếu không có bài làm mới.
create or replace function public._btvn_app_tu_dong()
 returns jsonb
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  r record; h record;
  v_dong int := 0; v_tre int := 0; v_hs int := 0; v_rut int := 0; v_n int; v_doi boolean;
  v_ly_do constant text := 'Máy tự rút (Thùy 04/11): BTVN app cấp 3 tự đóng đúng giờ hết hạn — TA không cần đóng';
begin
  for r in
    select b.id, b.lop_id, b.ngay, b.btvn_dong_at, t.id as test_id, t.deadline,
           greatest(t.so_cau, (select count(distinct c.thu_tu) from bai_test_cau c where c.bai_test_id = t.id))::int as so_cau
      from buoi_hoc b
      join lop l on l.id = b.lop_id and l.khoi in ('10', '11', '12')       -- cấp 3
      join lateral (select bt.* from bai_test bt
                     where bt.lop_id = b.lop_id and bt.ngay = b.ngay and bt.loai = 'btvn' and bt.hoc_sinh_id is null
                     order by bt.created_at desc limit 1) t on true
     where b.loai = 'thuong' and b.trang_thai <> 'huy'
       and t.deadline is not null and t.deadline <= now()
       -- chưa đóng · hoặc MÁY đã đóng (giờ đóng = đúng giờ hạn). Buổi TA tự đóng ⇒ giữ nguyên quyết định của TA, không nhận bài muộn tự động.
       and (b.btvn_dong_at is null or b.btvn_dong_at = t.deadline)
       and b.ngay >= (now() at time zone 'Asia/Ho_Chi_Minh')::date - 30
       -- có bài nộp ẢNH ⇒ TA phải chấm ảnh, để TA đóng như cũ
       and not exists (select 1 from btvn_nop n where n.buoi_hoc_id = b.id)
       -- chưa em nào làm trên app ⇒ nhiều khả năng lớp làm GIẤY, không tự gán "Không làm bài" cho cả lớp
       and exists (select 1 from bai_lam bl join bai_lam_cau x on x.bai_lam_id = bl.id
                    where bl.bai_test_id = t.id and x.dap_an_hs is not null)
  loop
    -- ⓪ Buổi CHƯA có lưới chấm BTVN (lưới vốn chỉ dựng khi TA mở tab chấm) ⇒ dựng như màn chấm (syncDocProblems: chưa có ô nào ⇒
    --    mỗi câu 1 ô, gắn ma_cau + dạng = dạng bài bản đồ mới nếu có, không thì dang_chinh). Câu lấy từ BÀI APP (biến thể 1 theo thứ tự),
    --    vốn sinh từ phiếu BTVN của buổi. Đã có ô ⇒ không đụng (lưới bám phiếu là việc của màn chấm).
    if not exists (select 1 from gami_session_problems sp where sp.buoi_hoc_id = r.id and sp.phase = 'btvn') then
      insert into gami_session_problems (buoi_hoc_id, phase, problem_no, ma_cau, ma_dang)
      select r.id, 'btvn', (row_number() over (order by x.thu_tu))::int, x.ma_cau,
             coalesce((select d.ma_dang from fn_bdm_dang_cua_cau(array[x.ma_cau]) d limit 1),
                      (select k.dang_chinh from (select q.dang_chinh from dai_cau_hoi q where q.ma_cau = x.ma_cau union all
                                                 select q.dang_chinh from hgt_cau_hoi q where q.ma_cau = x.ma_cau union all
                                                 select q.dang_chinh from khtn_cau_hoi q where q.ma_cau = x.ma_cau union all
                                                 select q.dang_chinh from hinh_hoc_cau_hoi q where q.ma_cau = x.ma_cau) k limit 1))
        from (select distinct on (bc.thu_tu) bc.thu_tu, bc.ma_cau from bai_test_cau bc
               where bc.bai_test_id = r.test_id and bc.bien_the = 1 and bc.ma_cau is not null order by bc.thu_tu) x
      on conflict (buoi_hoc_id, phase, problem_no) do nothing;
    end if;

    -- ① Đổ kết quả app vào lưới (kể cả khi đã đóng — bài làm sau hạn vẫn vào, tính nộp muộn) + trạng thái của em làm HẾT
    perform public._btvn_online_dong_bo_core(r.id, true);
    v_doi := false;

    -- ② Trạng thái nộp + thái độ của em CÓ MẶT (hoặc có bài làm) theo bài làm app — chỉ điền chỗ còn TRỐNG,
    --    và nâng "Không làm bài" → nộp khi em làm sau đó (Thùy 04/11: "vẫn cho làm, nhưng tính là nộp muộn").
    for h in
      with hs as (
        select x.hoc_sinh_id from buoi_hoc_hs x where x.buoi_hoc_id = r.id and x.diem_danh = 'co_mat'
        union
        select bl.hoc_sinh_id from bai_lam bl
         where bl.bai_test_id = r.test_id
           and exists (select 1 from buoi_hoc_hs x where x.buoi_hoc_id = r.id and x.hoc_sinh_id = bl.hoc_sinh_id)
      ),
      lam as (
        select bl.hoc_sinh_id,
               count(distinct bc.thu_tu) filter (where x.dap_an_hs is not null) as da_tra_loi,
               min(x.cham_at) filter (where x.dap_an_hs is not null) as luc_dau
          from bai_lam bl
          join bai_lam_cau x on x.bai_lam_id = bl.id
          join bai_test_cau bc on bc.id = x.bai_test_cau_id
         where bl.bai_test_id = r.test_id
         group by bl.hoc_sinh_id
      )
      select hs.hoc_sinh_id, coalesce(lam.da_tra_loi, 0)::int as da_tra_loi, lam.luc_dau,
             k.trang_thai_nop, k.thai_do
        from hs
        left join lam on lam.hoc_sinh_id = hs.hoc_sinh_id
        left join btvn_ket_qua k on k.buoi_hoc_id = r.id and k.hoc_sinh_id = hs.hoc_sinh_id
    loop
      if h.da_tra_loi = 0 then
        -- bỏ trống ⇒ Không làm bài (chỉ khi BTVN chưa đóng — sau khi đóng, ô trống đã được chốt lúc hết hạn)
        if r.btvn_dong_at is null and h.trang_thai_nop is null then
          insert into btvn_ket_qua (buoi_hoc_id, hoc_sinh_id, trang_thai_nop, updated_at)
          values (r.id, h.hoc_sinh_id, 'khong_lam', now())
          on conflict (hoc_sinh_id, buoi_hoc_id) do update set trang_thai_nop = 'khong_lam', updated_at = now()
            where btvn_ket_qua.trang_thai_nop is null;
          v_hs := v_hs + 1; v_doi := true;
        end if;
      else
        -- có trả lời ⇒ có làm: trước hạn = đúng hạn · sau hạn = nộp muộn. Đè được ô trống hoặc "Không làm bài".
        if h.trang_thai_nop is null or (h.trang_thai_nop = 'khong_lam' and r.btvn_dong_at is not null) then   -- 'Không làm bài' chỉ do máy chốt lúc hết hạn mới được nâng
          insert into btvn_ket_qua (buoi_hoc_id, hoc_sinh_id, trang_thai_nop, updated_at)
          values (r.id, h.hoc_sinh_id, case when h.luc_dau > r.deadline then 'nop_muon' else 'nop_dung_han' end, now())
          on conflict (hoc_sinh_id, buoi_hoc_id) do update
            set trang_thai_nop = excluded.trang_thai_nop, updated_at = now()
            where btvn_ket_qua.trang_thai_nop is null or (btvn_ket_qua.trang_thai_nop = 'khong_lam' and r.btvn_dong_at is not null);
          v_hs := v_hs + 1; v_doi := true;
          if r.btvn_dong_at is not null then v_tre := v_tre + 1; end if;
        end if;
        -- không điền đủ đáp án ⇒ thái độ "Chưa nghiêm túc" (chỉ khi thái độ còn trống — không đè TA)
        if h.da_tra_loi < r.so_cau and h.thai_do is null then
          insert into btvn_ket_qua (buoi_hoc_id, hoc_sinh_id, thai_do, updated_at)
          values (r.id, h.hoc_sinh_id, 'chua_nghiem_tuc', now())
          on conflict (hoc_sinh_id, buoi_hoc_id) do update set thai_do = 'chua_nghiem_tuc', updated_at = now()
            where btvn_ket_qua.thai_do is null;
          v_doi := true;
        end if;
      end if;
    end loop;

    if r.btvn_dong_at is null then
      -- ③ Đóng y đường TA bấm (EXP tháng + hoàn tất + trả bài), rồi ghi giờ đóng = ĐÚNG giờ hết hạn (không ai bị tính trễ).
      perform public.fn_dong_btvn(r.id);
      update buoi_hoc set btvn_dong_at = r.deadline where id = r.id and btvn_dong_at is distinct from r.deadline;
      v_dong := v_dong + 1;
      update gay_de_xuat set trang_thai = 'bo_qua', quyet_at = now(), nguoi_quyet = null, ly_do_bo_qua = v_ly_do
       where trang_thai = 'cho' and nguon = 'vanhanh' and ref_key like 'vh:' || r.id::text || '|btvn|%';
      get diagnostics v_n = row_count; v_rut := v_rut + v_n;
    elsif v_doi then
      -- đã đóng mà trạng thái đổi (bài nộp muộn) ⇒ EXP tháng tính lại (EXP BTVN đọc trạng thái nộp)
      perform public.fn_recompute_exp_thang(r.lop_id, to_char(r.ngay, 'YYYY-MM'));
    end if;
  end loop;
  return jsonb_build_object('dong', v_dong, 'hs_ghi', v_hs, 'nop_muon_sau_dong', v_tre, 'rut_gay', v_rut);
end $function$;

revoke execute on function public._btvn_app_tu_dong() from public, anon, authenticated;
revoke execute on function public._btvn_online_dong_bo_core(uuid, boolean) from public, anon;
grant execute on function public._btvn_online_dong_bo_core(uuid, boolean) to authenticated;
