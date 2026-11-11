-- ============================================================================
-- 202611111600 — ta_cong_mo_lai_lich_su_va_duyet_ca_tron_khoi
-- ----------------------------------------------------------------------------
-- VÌ SAO — Thùy 11/11:
--   (1) "Cần có chức năng sửa lại công việc đã duyệt — lịch sử duyệt để đề phòng trưởng khối duyệt nhầm."
--       · fn_ta_duyet_cong nhận thêm kết quả 'cho_duyet' = MỞ LẠI (đưa dòng đã duyệt / đã từ chối về chờ duyệt, bắt buộc lý do),
--         cùng luật phạm vi như duyệt (trưởng khối trong khối mình, không phải công của mình · người giữ ta_cong_duyet mọi dòng).
--         Mở lại xong TA tự sửa được (fn_ta_sua_viec chỉ chặn dòng đã duyệt) rồi duyệt lại. Tháng đã chốt: trigger khoá kỳ vẫn chặn.
--       · fn_ta_cong_lich_su(id): lịch sử 1 dòng ca/việc từ ta_cong_log (ai · lúc nào · đổi gì) — bấm mới gọi.
--       · fn_ta_cong_nguoi_duyet(từ, đến): người + lúc xử lý (duyệt/từ chối/mở lại) của các dòng trong khoảng — hiện trên màn.
--   (2) "Trưởng khối Cường chưa duyệt được dòng Checkin–Checkout của Tạ Quang Tùng": ca 01/11 của Tùng có 2 việc trông thi
--       7B1 (khối 7 — của Cường) + 9A2 (khối 9). Luật 09/11 (mig 202611091507): ca trộn khối ⇒ chỉ người giữ ta_cong_duyet.
--       Nới: ca duyệt được khi có ≥1 việc thuộc phạm vi mình và MỌI việc còn hiệu lực ngoài phạm vi mình ĐÃ được duyệt
--       (người khối kia đã xác nhận phần của họ ⇒ giờ có mặt không còn gì tranh chấp). Việc khối khác còn chờ ⇒ vẫn chưa duyệt ca được.
-- MẤT GÌ (Luật xoá): không xoá gì. Viết lại _ta_cong_duoc_ca · fn_ta_duyet_cong (chữ ký giữ nguyên); thêm 2 hàm đọc.
-- ============================================================================

create or replace function public._ta_cong_duoc_ca(p_ca uuid, p_pv text[], p_me uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from ta_cham_cong cc where cc.id = p_ca and cc.nhan_su_id is distinct from p_me)
     and exists (select 1 from ta_cong_viec v where v.cham_cong_id = p_ca and v.trang_thai <> 'tu_choi'
                   and public._ta_cong_duoc_viec(v.id, p_pv, p_me))
     and not exists (select 1 from ta_cong_viec v where v.cham_cong_id = p_ca and v.trang_thai = 'cho_duyet'
                       and not public._ta_cong_duoc_viec(v.id, p_pv, p_me))
$$;

create or replace function public.fn_ta_duyet_cong(p_ca uuid[], p_viec uuid[], p_ket_qua text, p_ly_do text default null)
returns integer language plpgsql security definer set search_path = public as $$
declare v_me uuid := public.current_nhan_su_id(); v_n integer; v_m integer; v_pv text[]; v_sai int; v_ld text := p_ly_do;
begin
  if not public.co_quyen_ghi('ta_cong_duyet') then
    v_pv := public._ta_cong_pham_vi();
    if cardinality(v_pv) = 0 then raise exception 'Không có quyền duyệt công'; end if;
    select count(*) into v_sai from unnest(coalesce(p_viec, '{}')) x(id) where not public._ta_cong_duoc_viec(x.id, v_pv, v_me);
    if v_sai > 0 then raise exception '% việc ngoài phạm vi duyệt của bạn (khác khối, không thuộc khối nào, hoặc công của chính bạn)', v_sai; end if;
    select count(*) into v_sai from unnest(coalesce(p_ca, '{}')) x(id) where not public._ta_cong_duoc_ca(x.id, v_pv, v_me);
    if v_sai > 0 then raise exception '% ca có mặt ngoài phạm vi duyệt của bạn (ca còn việc khối khác chưa duyệt / việc chung, hoặc ca của chính bạn)', v_sai; end if;
  end if;
  if p_ket_qua not in ('da_duyet', 'tu_choi', 'cho_duyet') then raise exception 'Kết quả duyệt không hợp lệ'; end if;
  if p_ket_qua in ('tu_choi', 'cho_duyet') and btrim(coalesce(p_ly_do, '')) = '' then
    raise exception '% phải có lý do', case p_ket_qua when 'tu_choi' then 'Từ chối' else 'Mở lại' end;
  end if;
  if p_ket_qua = 'cho_duyet' then v_ld := 'Mở lại: ' || btrim(p_ly_do); end if;
  if p_ket_qua = 'da_duyet' and exists (select 1 from ta_cham_cong where id = any(coalesce(p_ca, '{}')) and ra_at is null and ra_chot is null) then
    raise exception 'Có ca chưa có giờ ra — chốt giờ trước khi duyệt';
  end if;
  -- mở lại: việc trước rồi mới tới ca (ca chờ ⇒ việc trong ca vẫn hợp lệ); duyệt/từ chối: ca trước như cũ
  if p_ket_qua = 'cho_duyet' then
    update ta_cong_viec set trang_thai = p_ket_qua, duyet_boi = v_me, duyet_at = now(), ly_do_duyet = v_ld
     where id = any(coalesce(p_viec, '{}')) and trang_thai <> p_ket_qua;
    get diagnostics v_m = row_count;
    update ta_cham_cong set duyet = p_ket_qua, duyet_boi = v_me, duyet_at = now(), ly_do_duyet = v_ld
     where id = any(coalesce(p_ca, '{}')) and duyet <> p_ket_qua;
    get diagnostics v_n = row_count;
  else
    update ta_cham_cong set duyet = p_ket_qua, duyet_boi = v_me, duyet_at = now(), ly_do_duyet = v_ld
     where id = any(coalesce(p_ca, '{}')) and duyet <> p_ket_qua;
    get diagnostics v_n = row_count;
    update ta_cong_viec set trang_thai = p_ket_qua, duyet_boi = v_me, duyet_at = now(), ly_do_duyet = v_ld
     where id = any(coalesce(p_viec, '{}')) and trang_thai <> p_ket_qua;
    get diagnostics v_m = row_count;
  end if;
  return v_n + v_m;
end $$;

-- Ai được xem lịch sử / người duyệt: người giữ ta_cong_duyet, hoặc có phạm vi (trưởng khối · TBM · QLCL)
create or replace function public._ta_cong_xem_duoc() returns boolean
language sql stable security definer set search_path = public as $$
  select public.co_chuc_nang('ta_cong_duyet') or cardinality(public._ta_cong_pham_vi()) > 0
$$;
revoke execute on function public._ta_cong_xem_duoc() from public, anon;

-- Lịch sử 1 dòng (ca hoặc việc): mỗi lần ghi một dòng, đã dịch ra chữ
create or replace function public.fn_ta_cong_lich_su(p_id uuid)
returns table (luc timestamptz, nguoi text, viec text, chi_tiet text)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public._ta_cong_xem_duoc() then raise exception 'Không có quyền xem lịch sử công'; end if;
  return query
  with lg as (
    select l.ts, l.hanh_dong, l.truoc, l.sau, l.bang, n.ho_ten
      from ta_cong_log l left join nhan_su n on n.id = l.actor
     where l.row_id = p_id and l.bang in ('ta_cham_cong', 'ta_cong_viec')
  ), tt as (
    select lg.*,
           case lg.bang when 'ta_cham_cong' then lg.truoc->>'duyet' else lg.truoc->>'trang_thai' end as tt0,
           case lg.bang when 'ta_cham_cong' then lg.sau->>'duyet' else lg.sau->>'trang_thai' end as tt1
      from lg
  )
  select tt.ts, coalesce(tt.ho_ten, 'hệ thống'),
         case when tt.hanh_dong = 'INSERT' then 'Khai'
              when tt.tt0 is distinct from tt.tt1 then
                case tt.tt1 when 'da_duyet' then 'Duyệt' when 'tu_choi' then 'Từ chối' when 'cho_duyet' then 'Mở lại' else tt.tt1 end
              else 'Sửa' end,
         concat_ws(' · ',
           case when tt.tt0 is distinct from tt.tt1 and tt.hanh_dong <> 'INSERT' then nullif(tt.sau->>'ly_do_duyet', '') end,
           case when tt.bang = 'ta_cham_cong' then nullif(concat_ws(' · ',
             case when (tt.truoc->>'vao_chot') is distinct from (tt.sau->>'vao_chot') or (tt.truoc->>'ra_chot') is distinct from (tt.sau->>'ra_chot')
                  then 'chốt giờ ' || coalesce(to_char((tt.sau->>'vao_chot')::timestamptz at time zone 'Asia/Ho_Chi_Minh', 'HH24:MI'), '?')
                       || '–' || coalesce(to_char((tt.sau->>'ra_chot')::timestamptz at time zone 'Asia/Ho_Chi_Minh', 'HH24:MI'), '?') end,
             case when (tt.truoc->>'vao_at') is distinct from (tt.sau->>'vao_at') or (tt.truoc->>'ra_at') is distinct from (tt.sau->>'ra_at')
                  then 'giờ ' || coalesce(to_char((tt.sau->>'vao_at')::timestamptz at time zone 'Asia/Ho_Chi_Minh', 'HH24:MI'), '?')
                       || '–' || coalesce(to_char((tt.sau->>'ra_at')::timestamptz at time zone 'Asia/Ho_Chi_Minh', 'HH24:MI'), '—') end), '')
           else nullif(concat_ws(' · ',
             case when tt.hanh_dong = 'INSERT' or (tt.truoc->>'loai_viec') is distinct from (tt.sau->>'loai_viec')
                  then (select lv.ten from ta_loai_viec lv where lv.ma = tt.sau->>'loai_viec') end,
             case when tt.hanh_dong = 'INSERT' or (tt.truoc->>'lop_id') is distinct from (tt.sau->>'lop_id')
                  then (select 'lớp ' || lp.ten_lop from lop lp where lp.id = (tt.sau->>'lop_id')::uuid) end,
             case when tt.hanh_dong = 'INSERT' or (tt.truoc->>'gio_bat_dau') is distinct from (tt.sau->>'gio_bat_dau')
                       or (tt.truoc->>'gio_ket_thuc') is distinct from (tt.sau->>'gio_ket_thuc')
                  then left(tt.sau->>'gio_bat_dau', 5) || '–' || left(tt.sau->>'gio_ket_thuc', 5) end), '')
           end)
    from tt
   where tt.hanh_dong = 'INSERT' or tt.tt0 is distinct from tt.tt1
      or (tt.bang = 'ta_cham_cong' and ((tt.truoc->>'vao_chot') is distinct from (tt.sau->>'vao_chot') or (tt.truoc->>'ra_chot') is distinct from (tt.sau->>'ra_chot')
                                       or (tt.truoc->>'vao_at') is distinct from (tt.sau->>'vao_at') or (tt.truoc->>'ra_at') is distinct from (tt.sau->>'ra_at')))
      or (tt.bang = 'ta_cong_viec' and ((tt.truoc->>'loai_viec') is distinct from (tt.sau->>'loai_viec') or (tt.truoc->>'lop_id') is distinct from (tt.sau->>'lop_id')
                                       or (tt.truoc->>'gio_bat_dau') is distinct from (tt.sau->>'gio_bat_dau') or (tt.truoc->>'gio_ket_thuc') is distinct from (tt.sau->>'gio_ket_thuc')))
   order by tt.ts;
end $$;
revoke all on function public.fn_ta_cong_lich_su(uuid) from public, anon;
grant execute on function public.fn_ta_cong_lich_su(uuid) to authenticated;

-- Người + lúc xử lý gần nhất của các dòng trong khoảng ngày (dòng còn chờ mà từng được mở lại cũng có)
create or replace function public.fn_ta_cong_nguoi_duyet(p_tu date, p_den date default null)
returns table (id uuid, nguoi text, luc timestamptz)
language plpgsql stable security definer set search_path = public as $$
declare v_den date := coalesce(p_den, p_tu);
begin
  if not public._ta_cong_xem_duoc() then raise exception 'Không có quyền xem người duyệt'; end if;
  return query
  select cc.id, n.ho_ten, cc.duyet_at from ta_cham_cong cc join nhan_su n on n.id = cc.duyet_boi
   where cc.ngay between p_tu and v_den and cc.duyet_at is not null
  union all
  select cv.id, n.ho_ten, cv.duyet_at from ta_cong_viec cv join nhan_su n on n.id = cv.duyet_boi
   where cv.ngay between p_tu and v_den and cv.duyet_at is not null;
end $$;
revoke all on function public.fn_ta_cong_nguoi_duyet(date, date) from public, anon;
grant execute on function public.fn_ta_cong_nguoi_duyet(date, date) to authenticated;
