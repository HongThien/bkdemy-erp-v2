-- ============================================================================
-- 202610241000 — bo_tro_theo_ban_do_cua_ca
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 24/10: "đổi nốt bổ trợ nữa là xong" — bổ trợ yếu sang mastery bản đồ mới (PLAN-mastery-ban-do-moi.md). Giữ nguyên tắc
--   SONG SONG (Thùy 23/10): ca đang chạy KHÔNG đổi khoá giữa chừng ⇒ mỗi ca nhớ bản đồ lúc MỞ: cột bo_tro_yeu.ban_do ('cu' | 'moi'),
--   trigger điền theo công tắc khi tạo ca; mọi ca hiện có = 'cu'.
--   · Ca 'moi': điền dạng yếu (fn_btyeu_fill_dang_yeu → bản song song fn_btyeu_dang_yeu_2_cua_so_moi) + đề xuất dạng mới
--     (fn_btyeu_de_xuat_dang_moi) theo mastery bản đồ mới; báo động đưa vào ca quy mã dạng cũ → dạng bài mới khi ứng đúng 1.
--   · Ca 'cu': y như trước (mastery cũ, _do_nhom_cua_o).
--   · Bù (fn_hs_bu_dang) không phải ca ⇒ theo công tắc (_do_o) — hoạt động mới.
--   · Bài mô hình Hình (hinh_baitoan) giữ nguyên đường riêng.
--   Chọn câu / phiếu / snapshot cho dạng NDB đã chạy qua nhánh registry 'bdm' (mig 202610231525).
--   Client: gợi ý "+ Thêm dạng" của ca 'moi' đọc fn_btyeu_dang_goi_y_moi (đếm ở DB).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — thêm cột (mặc định 'cu' cho mọi ca hiện có), thay thân 4 hàm, thêm 2 hàm.
-- ============================================================================

alter table bo_tro_yeu add column if not exists ban_do text not null default 'cu' check (ban_do in ('cu', 'moi'));
comment on column bo_tro_yeu.ban_do is 'Bản đồ mastery lúc MỞ ca (cu | moi) — điền theo công tắc mastery_ban_do_moi, không đổi suốt đời ca';

create or replace function _btyeu_ban_do_luc_mo() returns trigger language plpgsql as $$
begin
  new.ban_do := case when public._mastery_bdm_bat() then 'moi' else 'cu' end;
  return new;
end $$;
drop trigger if exists trg_btyeu_ban_do_luc_mo on bo_tro_yeu;
create trigger trg_btyeu_ban_do_luc_mo before insert on bo_tro_yeu for each row execute function _btyeu_ban_do_luc_mo();

-- fn_btyeu_dang_yeu_2_cua_so_moi — BẢN MỚI song song (ca bổ trợ mở SAU khi bật công tắc)
CREATE OR REPLACE FUNCTION public.fn_btyeu_dang_yeu_2_cua_so_moi(p_hs uuid, p_mon text)
 RETURNS TABLE(ma_dang text, ten_dang text, score numeric, n integer)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_bd text := public._kho_ban_do_tbl(p_mon); v_moc date := public._btyeu_moc_2_cua_so();
begin
  if not public.la_thanh_vien() or v_bd is null then return; end if;
  return query execute format($q$
    select m.ma_dang::text, bd.ten_dang::text, m.score::numeric, m.n::integer
    from public.fn_mastery_cells_bdm(array[$1]::uuid[], true) m
    join lateral (select public._kho_ten_dang($3, m.ma_dang) as ten_dang) bd on bd.ten_dang is not null and not public._kho_dang_da_xoa_mem(m.ma_dang) -- 29/09: dạng MỌI nhánh của môn
    where m.muc = 'yeu'
      -- 12/10: "có đo gần đây" tính theo dạng HIỆN TẠI của câu (đo đi theo câu) — phân giải 1 lần cho mỗi cặp câu–mã chép
      and m.ma_dang in (select public._do_o_bdm(d.ma_cau, d.ma_dang)
                        from (select distinct p.ma_cau, p.ma_dang from gami_grades g join gami_session_problems p on p.id = g.problem_id
                              left join buoi_hoc b on b.id = g.buoi_hoc_id
                              where g.hoc_sinh_id = $1 and p.ma_dang is not null and coalesce(b.ngay, g.graded_at::date) >= $2) d)
    order by (m.n >= 3) desc, m.score, m.n desc
  $q$, v_bd) using p_hs, v_moc, p_mon;
  -- 14/10: dạng = bài mô hình Hình (ma_dang = hinh_baitoan.ma) — yếu + có đo trong 2 cửa sổ gần nhất, cùng luật "cứ yếu là bổ trợ".
  return query
    select hb.ma::text, public._kho_ten_dang(p_mon, hb.ma)::text, h.score::numeric, h.n::integer
    from public.fn_mastery_cells_hinh(array[p_hs], true) h
    join hinh_baitoan hb on hb.id = h.hinh_baitoan_id and hb.mon = p_mon
    where h.muc = 'yeu'
      and exists (select 1 from gami_grades g join gami_session_problems p on p.id = g.problem_id left join buoi_hoc b on b.id = g.buoi_hoc_id
                  where g.hoc_sinh_id = p_hs and p.hinh_baitoan_id = hb.id and coalesce(b.ngay, g.graded_at::date) >= v_moc)
    order by (h.n >= 2) desc, h.score;
end $function$;

-- fn_btyeu_fill_dang_yeu — chọn bản theo ca
CREATE OR REPLACE FUNCTION public.fn_btyeu_fill_dang_yeu(p_case uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_hs uuid; v_mon text; v_bd text; v_n integer := 0; r record;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự.'; end if;
  select hoc_sinh_id, mon, ban_do into v_hs, v_mon, v_bd from bo_tro_yeu where id = p_case and trang_thai = 'dang_xu';
  if v_hs is null then raise exception 'Case không mở.'; end if;
  -- ca mở SAU khi bật mastery bản đồ mới ⇒ dạng yếu theo bản đồ mới; ca cũ chạy hết theo bản đồ cũ (Thùy 24/10)
  for r in select * from public.fn_btyeu_dang_yeu_2_cua_so_moi(v_hs, v_mon) where v_bd = 'moi'
           union all select * from public.fn_btyeu_dang_yeu_2_cua_so(v_hs, v_mon) where v_bd is distinct from 'moi' loop
    insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, nguon, diem_luc_mo, so_lan_do_luc_mo)
      values (p_case, r.ma_dang, 'may', r.score, r.n) on conflict (bo_tro_yeu_id, ma_dang) do nothing;
    if found then v_n := v_n + 1; end if;
  end loop;
  return v_n;
end $function$;

-- fn_btyeu_de_xuat_dang_moi — theo bản đồ của từng ca
CREATE OR REPLACE FUNCTION public.fn_btyeu_de_xuat_dang_moi(p_mon text DEFAULT NULL::text, p_case uuid DEFAULT NULL::uuid, p_thuc_hien boolean DEFAULT false)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_bd text; v_mon text; v_n integer := 0; v_out jsonb := '[]'::jsonb; r record;
begin
  if not public.la_thanh_vien() then return jsonb_build_object('them', 0, 'chi_tiet', '[]'::jsonb); end if;
  if p_thuc_hien and p_case is null then raise exception 'Thêm dạng phải chỉ rõ case.'; end if;
  for v_mon in select distinct mon from bo_tro_yeu where trang_thai = 'dang_xu' and (p_mon is null or mon = p_mon) and (p_case is null or id = p_case) loop
    v_bd := public._kho_ban_do_tbl(v_mon);
    for r in execute format($q$
      with cs as (select y.id as case_id, y.hoc_sinh_id, y.created_at, y.ban_do from bo_tro_yeu y where y.mon = $1 and y.trang_thai = 'dang_xu' and ($2::uuid is null or y.id = $2)),
      m as (select c.hoc_sinh_id, c.ma_dang, c.score, c.n, 'cu'::text as ban_do from public.fn_mastery_cells((select array_agg(hoc_sinh_id) from cs where ban_do is distinct from 'moi'), true) c
            where c.muc = 'yeu'
            union all  -- ca mở sau khi bật bản đồ mới (Thùy 24/10)
            select c.hoc_sinh_id, c.ma_dang, c.score, c.n, 'moi' from public.fn_mastery_cells_bdm((select array_agg(hoc_sinh_id) from cs where ban_do = 'moi'), true) c
            where c.muc = 'yeu'),
      -- 12/10: dạng CÓ ĐO sau khi mở case, tính theo dạng HIỆN TẠI của câu (đo đi theo câu) — 1 lần cho mỗi cặp câu–mã chép của từng case
      gan as materialized (
        select cs.case_id, case when cs.ban_do = 'moi' then public._do_o_bdm(d.ma_cau, d.ma_dang) else public._do_nhom_cua_o(d.ma_cau, d.ma_dang) end as md
        from cs cross join lateral (select distinct p.ma_cau, p.ma_dang from gami_grades g join gami_session_problems p on p.id = g.problem_id
                                    where g.hoc_sinh_id = cs.hoc_sinh_id and p.ma_dang is not null and g.graded_at > cs.created_at) d)
      select cs.case_id, cs.hoc_sinh_id, m.ma_dang, bd.ten_dang, m.score, m.n
      from cs join m on m.hoc_sinh_id = cs.hoc_sinh_id and m.ban_do = case when cs.ban_do = 'moi' then 'moi' else 'cu' end
      join lateral (select public._kho_ten_dang($1, m.ma_dang) as ten_dang) bd on bd.ten_dang is not null and not public._kho_dang_da_xoa_mem(m.ma_dang) -- 29/09: dạng MỌI nhánh của môn
      where not exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = cs.case_id and d.ma_dang = m.ma_dang)
        and exists (select 1 from gan where gan.case_id = cs.case_id and gan.md = m.ma_dang)
      order by cs.case_id, (m.n >= 3) desc, m.score
    $q$, v_bd) using v_mon, p_case loop
      if p_thuc_hien then
        insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, nguon, diem_luc_mo, so_lan_do_luc_mo)
          values (r.case_id, r.ma_dang, 'may', r.score, r.n) on conflict (bo_tro_yeu_id, ma_dang) do nothing;
        if found then v_n := v_n + 1; end if;
      end if;
      v_out := v_out || jsonb_build_object('case_id', r.case_id, 'hoc_sinh_id', r.hoc_sinh_id, 'ma_dang', r.ma_dang, 'ten_dang', r.ten_dang, 'score', r.score, 'n', r.n);
    end loop;
    -- 14/10: bài mô hình Hình yếu, có đo SAU khi mở case (ET/BTVN/MT) hoặc từ kết quả bổ trợ — cùng luật dạng thường.
    for r in
      select y.id as case_id, y.hoc_sinh_id, hb.ma as ma_dang, public._kho_ten_dang(v_mon, hb.ma) as ten_dang, h.score, h.n
      from bo_tro_yeu y
      cross join lateral public.fn_mastery_cells_hinh(array[y.hoc_sinh_id], true) h
      join hinh_baitoan hb on hb.id = h.hinh_baitoan_id and hb.mon = v_mon
      where y.mon = v_mon and y.trang_thai = 'dang_xu' and (p_case is null or y.id = p_case) and h.muc = 'yeu'
        and not exists (select 1 from bo_tro_yeu_dang d where d.bo_tro_yeu_id = y.id and d.ma_dang = hb.ma)
        and exists (select 1 from gami_grades g join gami_session_problems p on p.id = g.problem_id
                    where g.hoc_sinh_id = y.hoc_sinh_id and p.hinh_baitoan_id = hb.id and g.graded_at > y.created_at)
      order by y.id, (h.n >= 2) desc, h.score
    loop
      if p_thuc_hien then
        insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, nguon, diem_luc_mo, so_lan_do_luc_mo)
          values (r.case_id, r.ma_dang, 'may', r.score, r.n) on conflict (bo_tro_yeu_id, ma_dang) do nothing;
        if found then v_n := v_n + 1; end if;
      end if;
      v_out := v_out || jsonb_build_object('case_id', r.case_id, 'hoc_sinh_id', r.hoc_sinh_id, 'ma_dang', r.ma_dang, 'ten_dang', r.ten_dang, 'score', r.score, 'n', r.n);
    end loop;
  end loop;
  return jsonb_build_object('them', v_n, 'chi_tiet', v_out);
end $function$;

-- fn_hs_bu_dang — theo công tắc
CREATE OR REPLACE FUNCTION public.fn_hs_bu_dang(p_buoi uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_hs uuid := public.my_hoc_sinh_id(); r record; v_out jsonb; v_kq jsonb := '[]'::jsonb; x jsonb; v_tbl text; v_co boolean;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select b.id as bu, b.ngay, hh.bu_cho_buoi_id as me, bm.ngay as ngay_me, l.mon, l.ten_lop into r
    from buoi_hoc b join buoi_hoc_hs hh on hh.buoi_hoc_id = b.id and hh.hoc_sinh_id = v_hs
    left join buoi_hoc bm on bm.id = hh.bu_cho_buoi_id left join lop l on l.id = bm.lop_id
    where b.id = p_buoi and b.loai = 'bu' limit 1;
  if r.bu is null then raise exception 'Không thấy buổi bù của em.'; end if;
  select coalesce(jsonb_agg(jsonb_build_object('ma_dang', x.ma_dang, 'ten_dang', coalesce(public._kho_ten_dang(r.mon, x.ma_dang), x.ma_dang)) order by x.thu_tu), '[]'::jsonb)
    into v_out
    from (select public._do_o(p.ma_cau, p.ma_dang) as ma_dang, min(case p.phase when 'ingame' then 0 when 'et' then 1000 else 2000 end + p.problem_no) as thu_tu
          from gami_session_problems p
          where p.ma_dang is not null and not p.hidden
            and ((p.buoi_hoc_id = r.me and p.hoc_sinh_id is null and p.phase in ('ingame', 'et', 'btvn'))
              or (p.buoi_hoc_id = r.bu and p.hoc_sinh_id = v_hs))
          group by 1) x
     where x.ma_dang is not null;   -- bản đồ mới: câu chưa quy được thì không hiện
  -- Thùy 03/10: bù 100% MCQ ⇒ báo dạng nào CÓ câu trắc nghiệm (cùng điều kiện duy nhất _kho_dk_mcq_sql) — dạng không có thì app ghi rõ 'học trên giấy'.
  for x in select * from jsonb_array_elements(v_out) loop
    v_tbl := public._kho_cau_tbl(r.mon, public._kho_nhanh_cua_dang(r.mon, x->>'ma_dang'));
    execute format('select exists (select 1 from %I c where c.dang_chinh = $1 and c.xoa_at is null and (%s or %s))', v_tbl, public._kho_dk_mcq_sql(v_tbl), public._kho_dk_tln_sql()) into v_co using x->>'ma_dang'; -- Thùy 10/10: MCQ hoặc trả lời ngắn
    v_kq := v_kq || (x || jsonb_build_object('co_mcq', coalesce(v_co, false)));
  end loop;
  return jsonb_build_object('mon', r.mon, 'ten_lop', r.ten_lop, 'ngay_me', r.ngay_me, 'ngay_bu', r.ngay, 'dangs', v_kq);
end $function$;

-- _trg_btyeu_bao_dong_vao_case — ca mới quy sang dạng bài mới
CREATE OR REPLACE FUNCTION public._trg_btyeu_bao_dong_vao_case()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_mon text; v_case uuid; v_bd text; v_ma text;
begin
  if new.ma_dang is null then return new; end if;
  v_mon := public._btyeu_mon_cua_bao_dong(new.hoc_sinh_id, new.buoi_hoc_id);
  if v_mon is null then return new; end if;
  select id, ban_do into v_case, v_bd from bo_tro_yeu where hoc_sinh_id = new.hoc_sinh_id and mon = v_mon and trang_thai = 'dang_xu' limit 1;
  if v_case is null then return new; end if; -- chưa có bổ trợ ⇒ engine đưa vào hàng đợi Duyệt (báo động tự đủ tín hiệu)
  v_ma := new.ma_dang;
  if v_bd = 'moi' then v_ma := coalesce(public._bdm_dang_cu_mot_dich(public._do_nhom_cua_o(null, new.ma_dang)), new.ma_dang); end if;
  insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, nguon) values (v_case, v_ma, 'bao_dong')
    on conflict (bo_tro_yeu_id, ma_dang) do nothing;
  return new;
end $function$;

-- Gợi ý "+ Thêm dạng" cho ca 'moi': dạng yếu / cần luyện theo mastery bản đồ mới, có tên + chuyên đề (đếm ở DB — §2.0)
create or replace function fn_btyeu_dang_goi_y_moi(p_hs uuid, p_mon text)
returns table (ma_dang text, ten_dang text, ten_chuyen_de text, score numeric, n integer, muc text, tin text)
language sql stable security definer set search_path to 'public' as $$
  select m.ma_dang, coalesce(b.ten_dang, public._kho_ten_dang(p_mon, m.ma_dang)), coalesce(b.ten_chuyen_de, ''),
         m.score, m.n::int, m.muc, m.tin
    from public.fn_mastery_cells_bdm(array[p_hs], true) m
    left join bdm_ban_do b on b.ma_dang = m.ma_dang
   where public.la_thanh_vien() and m.muc <> 'dat' and m.score is not null
     and coalesce(b.ten_dang, public._kho_ten_dang(p_mon, m.ma_dang)) is not null
   order by m.score, m.n desc
$$;
revoke execute on function fn_btyeu_dang_goi_y_moi(uuid, text) from public, anon;
grant execute on function fn_btyeu_dang_goi_y_moi(uuid, text) to authenticated;
