-- ============================================================================
-- 202611161718 — quyen_mon_cum_bo_tro
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Tiếp mig 202611161701 (Thùy 16/11: "rà lại toàn bộ logic về môn"; bấm "Làm cụm Bổ trợ trước").
--   Lá Bổ trợ (botro · botroyeu) cấp cho 24 nhân sự, trong đó ~20 người CHỈ có một môn (GV/học thuật KHTN, Anh, Toán…). Mọi hàm đọc
--   của cụm (dashboard tuần · đuổi · bù · yếu: nội dung / xếp / trạng thái ca · Hình · Lịch phòng) chỉ hỏi "có phải nhân sự" ⇒ người KHTN
--   mở ra thấy toàn bộ case / ca / lần nghỉ của Toán (trừ Sau giờ — đã lọc theo phạm vi khối từ trước: _btnhe_duoc_tao).
--   Đo 16/11: 30 ngày qua 0 ca bổ trợ có TA trực ngoài môn được phân ⇒ lọc theo quyền môn không làm TA mất ca nào.
--
--   _mon_xem_ds()  — text[] môn người gọi được xem; NULL = không lọc (thấy mọi môn, hoặc MÁY gọi: cron · SQL · service_role — các hàm này còn
--                    được trợ lý / cron gọi, không có tài khoản). Người đăng nhập không phải nhân sự ⇒ mảng rỗng.
--   _mon_duoc_xem  — viết lại trên _mon_xem_ds (cùng luật, thêm: máy gọi ⇒ true; trước đây script đo không có jwt nhận rỗng).
--   _bo_tro_mon(…) — môn của một lượt (em × buổi) bổ trợ: buổi bổ trợ KHÔNG có lop_id (đo 16/11: 786/786 buổi 60 ngày) ⇒ lấy từ case yếu /
--                    case Hình / đợt đuổi → lớp / buổi nghỉ → lớp / ca sau giờ / ca trực.
--   Lọc = điều kiện không phụ thuộc dòng bọc (select …) ⇒ một lần mỗi lượt gọi (K27). Không đổi phép tính nào.
--   Các danh sách đọc thẳng bảng (đợt đuổi, buổi đuổi / bù, không-bù, case đang mở, lịch khối) lọc ở câu truy vấn phía client (lib/monQuyen.ts) —
--   rào CỨNG cho chúng là RLS theo môn, chưa làm (nêu ở DEVLOG).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá / drop gì. THU HẸP QUYỀN ĐỌC có chủ ý: nhân sự không thấy-mọi-môn gọi các hàm dưới đây chỉ nhận dòng thuộc môn của mình;
--   gọi hàm theo 1 case / 1 ca của môn khác ⇒ rỗng / lỗi "ngoài quyền môn".
-- ============================================================================

create or replace function public._mon_xem_ds()
returns text[]
language sql stable security definer
set search_path to 'public'
as $$
  select case
    when coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'role', '') not in ('anon', 'authenticated') then null
    when (j->>'tat_ca')::boolean then null
    else array(select jsonb_array_elements_text(j->'mon')) end
  from (select public.fn_mon_cua_toi() as j) x
$$;

create or replace function public._mon_duoc_xem(p_mon text)
returns boolean
language sql stable
set search_path to 'public'
as $$
  select p_mon is not null and coalesce(d is null or p_mon = any(d), false) from (select public._mon_xem_ds() as d) x
$$;

create or replace function public._bo_tro_mon(p_yeu uuid, p_hinh uuid, p_duoi uuid, p_bu_cho uuid, p_nhe uuid, p_ca uuid)
returns text
language sql stable
set search_path to 'public'
as $$
  select coalesce(
    (select y.mon from bo_tro_yeu y where y.id = p_yeu),
    (select h.mon from bo_tro_hinh h where h.id = p_hinh),
    (select l.mon from bo_tro_duoi d join lop l on l.id = d.lop_id where d.id = p_duoi),
    (select l.mon from buoi_hoc g join lop l on l.id = g.lop_id where g.id = p_bu_cho),
    (select c.mon from ca_bo_tro_nhe c where c.id = p_nhe),
    (select c.mon from ca_bo_tro c where c.id = p_ca))
$$;
-- chỉ dùng trong hàm definer của cụm bổ trợ ⇒ client không cần gọi
revoke execute on function public._bo_tro_mon(uuid, uuid, uuid, uuid, uuid, uuid) from public, authenticated;

do $$
declare r record; v_def text; v_src text; v_n int;
begin
  for r in
    select * from (values
      ('public.fn_bo_tro_dashboard_tuan(date,integer)', '285aadacf7f312d5b35927f51cda6085',
       '    left join nhan_su ns2 on ns2.id = b.nguoi_day
  ),',
       '    left join nhan_su ns2 on ns2.id = b.nguoi_day
    where ((select public._mon_xem_ds()) is null or public._bo_tro_mon(hh.bo_tro_yeu_id, hh.bo_tro_hinh_id, hh.bo_tro_duoi_id, hh.bu_cho_buoi_id, b.ca_bo_tro_nhe_id, b.ca_bo_tro_id) = any((select public._mon_xem_ds())::text[]))   -- 16/11: quyền môn
  ),'),
      ('public.fn_bo_tro_tu_kiem(date,date)', 'a8660332073f1a9cf71466e82b476124',
       '    where b.loai in (''bo_tro_yeu'', ''bu'', ''bo_tro_duoi'', ''bo_tro_hinh'') and b.trang_thai = ''mo'' and b.ngay between v_tu and v_den',
       '    where b.loai in (''bo_tro_yeu'', ''bu'', ''bo_tro_duoi'', ''bo_tro_hinh'') and b.trang_thai = ''mo'' and b.ngay between v_tu and v_den
      and exists (select 1 from buoi_hoc_hs m where m.buoi_hoc_id = b.id and ((select public._mon_xem_ds()) is null or public._bo_tro_mon(m.bo_tro_yeu_id, m.bo_tro_hinh_id, m.bo_tro_duoi_id, m.bu_cho_buoi_id, b.ca_bo_tro_nhe_id, b.ca_bo_tro_id) = any((select public._mon_xem_ds())::text[])))   -- 16/11: quyền môn'),
      ('public.fn_bthinh_danh_sach(text,integer)', '532f497a4d16c6e2ff7d4aa328ec5e65',
       '    where y.trang_thai = coalesce(p_trang_thai, ''dang_xu'')',
       '    where y.trang_thai = coalesce(p_trang_thai, ''dang_xu'') and ((select public._mon_xem_ds()) is null or y.mon = any((select public._mon_xem_ds())::text[]))   -- 16/11: quyền môn (số trần bên dưới vẫn là trần CẢ trung tâm)'),
      ('public.fn_bthinh_lich_su(uuid)', 'e770f615aae0497163ce9fce14207139',
       '  from bo_tro_hinh_log l where l.case_id = p_case',
       '  from bo_tro_hinh_log l where l.case_id = p_case
    and exists (select 1 from bo_tro_hinh h where h.id = p_case and ((select public._mon_xem_ds()) is null or h.mon = any((select public._mon_xem_ds())::text[])))   -- 16/11: quyền môn'),
      ('public.fn_btyeu_ca_sap_toi(date,date)', '90bd93b1653285659a58604773caadab',
       '    where bh.loai = ''bo_tro_yeu'' and bh.trang_thai = ''mo'' and bh.ngay between kh.tu and kh.den',
       '    where bh.loai = ''bo_tro_yeu'' and bh.trang_thai = ''mo'' and bh.ngay between kh.tu and kh.den and ((select public._mon_xem_ds()) is null or y.mon = any((select public._mon_xem_ds())::text[]))   -- 16/11: quyền môn'),
      ('public.fn_btyeu_ca_theo_doi(date)', 'b6eb494489ba22a70f5428f971ea933f',
       '  where b.loai = ''bo_tro_yeu'' and b.trang_thai <> ''huy''
',
       '  where b.loai = ''bo_tro_yeu'' and b.trang_thai <> ''huy'' and ((select public._mon_xem_ds()) is null or y.mon = any((select public._mon_xem_ds())::text[]))   -- 16/11: quyền môn
'),
      ('public.fn_btyeu_case_dang_nhom(uuid)', 'aa373a0d30686c48a80fbc079a89d167',
       '  if v_hs is null then return; end if;',
       '  if v_hs is null then return; end if;
  if not public._mon_duoc_xem(v_mon) then return; end if;   -- 16/11: quyền môn'),
      ('public.fn_btyeu_case_xep_lich(text)', '2dcd42207fdb0ba1f0b0e24d5cda08b3',
       '    where (p_mon is null or y.mon = p_mon) and',
       '    where (p_mon is null or y.mon = p_mon) and ((select public._mon_xem_ds()) is null or y.mon = any((select public._mon_xem_ds())::text[])) and   -- 16/11: quyền môn
         '),
      ('public.fn_btyeu_chi_tiet_case(uuid)', '0a59582558dfb0d48705b9ca3f56df73',
       '  where y.id = p_case
',
       '  where y.id = p_case and ((select public._mon_xem_ds()) is null or y.mon = any((select public._mon_xem_ds())::text[]))   -- 16/11: quyền môn
'),
      ('public.fn_btyeu_dang_goi_y_nhom(uuid,text)', 'fc0ba29fc8b33404bbb34611f5ddab12',
       '  where public.la_thanh_vien() and md.cap = ''dang''',
       '  where public.la_thanh_vien() and public._mon_duoc_xem(p_mon) and md.cap = ''dang''   -- 16/11: quyền môn
   '),
      ('public.fn_btyeu_de_xuat_dang_moi(text,uuid,boolean)', '8f38121882c439d42a4f332e4882a0e0',
       '  for v_mon in select distinct mon from bo_tro_yeu where trang_thai = ''dang_xu'' and (p_mon is null or mon = p_mon) and (p_case is null or id = p_case) loop',
       '  for v_mon in select distinct mon from bo_tro_yeu where trang_thai = ''dang_xu'' and (p_mon is null or mon = p_mon) and (p_case is null or id = p_case)
                 and ((select public._mon_xem_ds()) is null or mon = any((select public._mon_xem_ds())::text[])) loop   -- 16/11: quyền môn (máy / cron: không lọc)'),
      ('public.fn_btyeu_trang_thai_ca(integer)', '67482b9a00b759661058194934c452d7',
       '    where y.trang_thai = ''dang_xu'' or y.hoan_thanh_at >= now() - make_interval(days => greatest(1, coalesce(p_so_ngay_ht, 60)))',
       '    where (y.trang_thai = ''dang_xu'' or y.hoan_thanh_at >= now() - make_interval(days => greatest(1, coalesce(p_so_ngay_ht, 60))))
      and ((select public._mon_xem_ds()) is null or y.mon = any((select public._mon_xem_ds())::text[]))   -- 16/11: quyền môn'),
      ('public.fn_bu_lan_nghi_can_xep()', 'bcb401ce62084a7cc6a854316a4da079',
       '      and not exists (select 1 from public.bang_khong_bu kb where kb.buoi_hoc_hs_id = hh.id)',
       '      and not exists (select 1 from public.bang_khong_bu kb where kb.buoi_hoc_hs_id = hh.id)
      and ((select public._mon_xem_ds()) is null or l.mon = any((select public._mon_xem_ds())::text[]))   -- 16/11: quyền môn'),
      ('public.fn_ca_bo_tro_ngay(date)', 'ab4bb5318689ee1e1bc78651d6a7ed43',
       '  where c.ngay = p_ngay
',
       '  where c.ngay = p_ngay and ((select public._mon_xem_ds()) is null or c.mon = any((select public._mon_xem_ds())::text[]))   -- 16/11: quyền môn
'),
      ('public.fn_ca_bo_tro_tuan(date,date)', '70fde9d04827cd054b2329d9c9839aff',
       ' where c.ngay between p_tu and p_den group by c.ngay),',
       ' where c.ngay between p_tu and p_den and ((select public._mon_xem_ds()) is null or c.mon = any((select public._mon_xem_ds())::text[])) group by c.ngay),   -- 16/11: quyền môn'),
      ('public.fn_ca_bo_tro_tuan(date,date)', null,
       '         where not exists (select 1 from ca_bo_tro c where c.lich_truc_id = t.id and c.ngay = d.ngay)',
       '         where ((select public._mon_xem_ds()) is null or t.mon = any((select public._mon_xem_ds())::text[]))   -- 16/11: quyền môn
           and not exists (select 1 from ca_bo_tro c where c.lich_truc_id = t.id and c.ngay = d.ngay)'),
      ('public.fn_ca_bo_tro_ung_vien(uuid)', 'eac20868752bab42c437d9d167d31138',
       '  if c.id is null then raise exception ''Không thấy ca.''; end if;',
       '  if c.id is null then raise exception ''Không thấy ca.''; end if;
  if not public._mon_duoc_xem(c.mon) then raise exception ''Ca môn % ngoài quyền môn của bạn.'', c.mon; end if;   -- 16/11')
    ) t(ham, md5_cu, cu, moi)
  loop
    select p.prosrc, pg_get_functiondef(p.oid) into v_src, v_def from pg_proc p where p.oid = r.ham::regprocedure;
    if r.md5_cu is not null and md5(v_src) <> r.md5_cu then
      raise exception '% đã khác bản lúc viết migration (16/11) — đọc lại trước khi áp.', r.ham;
    end if;
    v_n := (length(v_def) - length(replace(v_def, r.cu, ''))) / length(r.cu);
    if v_n <> 1 then raise exception '%: mốc thay khớp % lần (phải đúng 1): %', r.ham, v_n, left(r.cu, 120); end if;
    execute replace(v_def, r.cu, r.moi);
  end loop;
end $$;
