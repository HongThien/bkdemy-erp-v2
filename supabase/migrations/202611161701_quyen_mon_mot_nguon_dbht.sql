-- ============================================================================
-- 202611161701 — quyen_mon_mot_nguon_dbht
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 16/11: "Dashboard KHTN vẫn hiện môn Toán — rất nhiều lần bị lẫn quyền môn rồi."
--   Dò trên luồng thật (đóng vai Phạm Anh Ngọc — trưởng bộ môn KHTN): lá Dashboard học tập (db_hoctap, cấp cho vai Học thuật ·
--   Quản lý môn · Core) mở ra MẶC ĐỊNH Toán khối 6 và thanh lọc liệt kê MỌI môn có lớp, vì:
--     (a) DB KHÔNG có nguồn "tôi được xem môn nào": RLS của lop / hoc_sinh / mastery chỉ hỏi la_thanh_vien() (mọi nhân sự đọc mọi môn),
--         fn_dbht_bang · fn_dbht_o_lich_su không có cổng nào; fn_mtt_trung_tam · fn_mtt_hs chỉ hỏi "có phải nhân sự";
--     (c) màn tự dựng danh sách môn từ bảng lop và gõ cứng môn đầu = 'Toán'.
--   Luật "quyền môn" trước giờ chỉ sống ở client (hook useMonScope: admin + team ops/media/marketing thấy mọi môn, người khác theo
--   nhan_su_mon) và chỉ 9 màn Kho / tài liệu dùng. Migration này đưa đúng luật đó xuống DB thành MỘT nguồn, cộng phạm vi quản lý
--   (spec-truong-khoi: toàn hệ QLCL · trưởng bộ môn · trưởng/phó khối), rồi gắn cổng vào các hàm của Dashboard học tập + tab Mục tiêu tuần.
--   Đo 16/11: mọi (nhân sự, môn) trong phạm vi quản lý và trong phan_cong_lop đều đã có ở nhan_su_mon ⇒ không ai mất môn đang làm.
--
--   fn_mon_cua_toi()      — NGUỒN DUY NHẤT: { tat_ca, mon[] }. Màn nhân sự có bộ chọn môn hỏi hàm này (không tự dựng từ bảng lop).
--   _mon_duoc_xem(p_mon)  — cổng dùng trong hàm đọc dữ liệu học tập theo môn. Người không phải nhân sự ⇒ false.
--   fn_dbht_o()           — các ô (môn × khối) có lớp đang học mà người gọi được xem; môn nhiều lớp nhất đứng đầu (không gõ tên môn).
--   Hàm cũ: thêm cổng, KHÔNG đổi một chữ nào của phép tính.
--     fn_dbht_bang       : ngoài quyền ⇒ danh sách HS rỗng + 'ngoai_quyen': true (hàm sql, không raise được).
--     fn_dbht_o_lich_su  : ngoài quyền ⇒ không có lượt nào.
--     fn_mtt_trung_tam · fn_mtt_hs · fn_mtt_cac_tuan (nhánh nhân sự xem hộ) : ngoài quyền ⇒ raise.
--   Cổng là điều kiện KHÔNG phụ thuộc dòng (hàm stable) ⇒ Postgres tính một lần mỗi lượt gọi, không chạy theo từng dòng (K27).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá dữ liệu, không drop gì. THU HẸP QUYỀN ĐỌC (có chủ ý): nhân sự không thuộc nhóm thấy-mọi-môn gọi 5 hàm trên với môn
--   KHÔNG có trong nhan_su_mon / phạm vi quản lý của mình sẽ nhận rỗng hoặc lỗi "ngoài quyền môn". Script đo chạy bằng role DB
--   (không có jwt nhân sự) gọi fn_dbht_bang cũng nhận rỗng — phải đặt request.jwt.claims của một tài khoản nhân sự trước khi gọi.
-- ============================================================================

-- (1) NGUỒN DUY NHẤT của quyền môn
create or replace function public.fn_mon_cua_toi()
returns jsonb
language sql stable security definer
set search_path to 'public'
as $$
  with toi as (select public.current_nhan_su_id() as id)
  select jsonb_build_object(
    -- thấy mọi môn: admin + trưởng/phó QLCL (spec-truong-khoi) · team liên môn ops / media / marketing (Thùy 08/08 — cùng luật hook useMonScope)
    'tat_ca', toi.id is not null and (
        public._qlcl_toan_he()
        or exists (select 1 from nhan_su_team x join team t on t.id = x.team_id
                    where x.nhan_su_id = toi.id and t.ma in ('ops', 'media', 'marketing'))),
    -- môn riêng: được phân môn (nhan_su_mon) ∪ trưởng bộ môn ∪ trưởng/phó khối được phân công
    'mon', coalesce((
        select jsonb_agg(m order by m) from (
          select nm.mon as m from nhan_su_mon nm where nm.nhan_su_id = toi.id
          union
          select unnest(public._quan_ly_mon())
          union
          select q.mon from public._khoi_quan_ly() q where q.nhan_su_id = toi.id
        ) u where u.m is not null and toi.id is not null), '[]'::jsonb))
  from toi
$$;

-- (2) cổng — invoker (gọi hàm definer ở trên), stable ⇒ một lần mỗi lượt gọi
create or replace function public._mon_duoc_xem(p_mon text)
returns boolean
language sql stable
set search_path to 'public'
as $$
  select coalesce(p_mon is not null and ((j->>'tat_ca')::boolean or j->'mon' ? p_mon), false)
    from (select public.fn_mon_cua_toi() as j) x
$$;

-- (3) ô (môn × khối) của Dashboard học tập — thay việc màn tự đọc bảng lop rồi liệt kê mọi môn
create or replace function public.fn_dbht_o()
returns table(mon text, khoi text, so_lop integer)
language sql stable
set search_path to 'public'
as $$
  select l.mon, l.khoi, count(*)::int
    from lop l
   where l.trang_thai = 'dang_hoc' and l.khoi is not null and public._mon_duoc_xem(l.mon)
   group by l.mon, l.khoi
   order by sum(count(*)) over (partition by l.mon) desc, l.mon, coalesce(substring(l.khoi from '^[0-9]+')::int, 0), l.khoi
$$;

-- (4) gắn cổng vào hàm đang sống: thay chuỗi khớp đúng một lần, khoá md5 thân hàm lúc viết (16/11)
do $$
declare
  r record; v_def text; v_src text; v_n int;
begin
  for r in
    select * from (values
      -- fn_dbht_bang: danh sách HS rỗng khi ngoài quyền + cờ cho màn
      ('public.fn_dbht_bang(text,text,integer,text)', '5adcc873e0958dafde2f8e5d06ddb3eb',
       'and l.mon = p_mon and l.khoi = p_khoi' || E'\n' || '     order by hl.hoc_sinh_id, l.ten_lop',
       'and l.mon = p_mon and l.khoi = p_khoi' || E'\n' || '       and public._mon_duoc_xem(p_mon)   -- 16/11: quyền môn (fn_mon_cua_toi)' || E'\n' || '     order by hl.hoc_sinh_id, l.ten_lop'),
      ('public.fn_dbht_bang(text,text,integer,text)', null,
       '''tu'', null,',
       '''tu'', null, ''ngoai_quyen'', not public._mon_duoc_xem(p_mon),'),
      -- fn_dbht_o_lich_su: cả hai nhánh
      ('public.fn_dbht_o_lich_su(uuid,text,text,text,integer)', '5202940a05f8714c53f92dda0af11774',
       'and public._kho_ban_do_tbl(p_mon) = ''dai_ban_do''',
       'and public._kho_ban_do_tbl(p_mon) = ''dai_ban_do'' and public._mon_duoc_xem(p_mon)'),
      ('public.fn_dbht_o_lich_su(uuid,text,text,text,integer)', null,
       'where p_mon = any(public._mastery_mon_ds())',
       'where p_mon = any(public._mastery_mon_ds()) and public._mon_duoc_xem(p_mon)'),
      -- tab Mục tiêu tuần
      ('public.fn_mtt_trung_tam(text,text,date)', 'b0bc0ecba465cf0af2c663539d9967e0',
       'if not public.la_thanh_vien() then raise exception ''Chỉ nhân sự.''; end if;',
       'if not public.la_thanh_vien() then raise exception ''Chỉ nhân sự.''; end if;' || E'\n' || '  if not public._mon_duoc_xem(p_mon) then raise exception ''Môn % ngoài quyền môn của bạn.'', p_mon; end if;'),
      ('public.fn_mtt_hs(uuid,text,date)', 'b3a394bf1ac163c9918bc121774c8765',
       'if not public.la_thanh_vien() then raise exception ''Chỉ nhân sự.''; end if;',
       'if not public.la_thanh_vien() then raise exception ''Chỉ nhân sự.''; end if;' || E'\n' || '  if not public._mon_duoc_xem(p_mon) then raise exception ''Môn % ngoài quyền môn của bạn.'', p_mon; end if;'),
      ('public.fn_mtt_cac_tuan(text,uuid,integer)', 'd483745a652d3c7160f3c04e655a37ee',
       'elsif public.la_thanh_vien() then v_hs := p_hs;',
       'elsif public.la_thanh_vien() and public._mon_duoc_xem(p_mon) then v_hs := p_hs;')
    ) t(ham, md5_cu, cu, moi)
  loop
    select p.prosrc, pg_get_functiondef(p.oid) into v_src, v_def from pg_proc p where p.oid = r.ham::regprocedure;
    if r.md5_cu is not null and md5(v_src) <> r.md5_cu then
      raise exception '% đã khác bản lúc viết migration (16/11) — đọc lại trước khi áp.', r.ham;
    end if;
    v_n := (length(v_def) - length(replace(v_def, r.cu, ''))) / length(r.cu);
    if v_n <> 1 then raise exception '%: mốc thay khớp % lần (phải đúng 1): %', r.ham, v_n, r.cu; end if;
    execute replace(v_def, r.cu, r.moi);
  end loop;
end $$;
