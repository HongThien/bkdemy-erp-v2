-- ============================================================================
-- 202611211604 — ta_ca_tu_duyet_theo_viec
-- ----------------------------------------------------------------------------
-- VÌ SAO — Thùy 21/11: "Không duyệt checkin–checkout mà là duyệt VIỆC bên trong. Toàn bộ việc được duyệt thì checkin–checkout
--   tự được duyệt. Checkin/checkout bây giờ chỉ để luyện thao tác cho nhân sự; sau này scale sẽ quản chặt (thời gian + địa điểm)
--   và không cần người duyệt — hệ thống tự duyệt."
--   Lỗi gốc (kiểm 21/11): trưởng khối duyệt được việc nhưng không duyệt được dòng ca, vì _ta_cong_duoc_ca đòi mọi việc khối khác /
--   việc không có khối trong ca phải duyệt xong trước ⇒ ca kẹt "chờ duyệt" ⇒ việc đã duyệt không vào lương (lương chỉ tính việc đã duyệt
--   thuộc ca đã duyệt) — 7 ca / 8 việc đã duyệt bị kẹt tại thời điểm kiểm.
-- LUẬT MỚI (DB là nơi duy nhất quyết, trigger — CLAUDE.md §2.0):
--   Ca (ta_cham_cong.duyet) THEO VIỆC của nó, không ai duyệt tay:
--     · có ≥1 việc còn hiệu lực (≠ từ chối) · MỌI việc hiệu lực đã duyệt · ca đã có giờ ra (ra_at hoặc ra_chot) ⇒ 'da_duyet'
--     · ngược lại (còn việc chờ — kể cả việc mới thêm / việc được mở lại) ⇒ 'cho_duyet'
--     · ca không có việc nào, hoặc mọi việc đều bị từ chối ⇒ KHÔNG đụng (giữ như cũ; xem câu hỏi mở cho Thùy ở cuối)
--   Chạy khi: việc đổi trạng thái / thêm / xoá / đổi ca · ca có giờ ra (checkout, chốt giờ, TA sửa giờ ca khai bù).
--   Ca quên checkout: việc duyệt xong thì ca vẫn chờ tới khi có giờ ra — người duyệt "Chốt giờ" (giờ gốc giữ nguyên) là ca tự duyệt.
--   _ta_cong_duoc_ca nới: ca "trong phạm vi" khi có ≥1 việc thuộc khối mình và không phải ca của mình (dùng cho chốt giờ + hiện dòng);
--   bỏ điều kiện "việc khối khác phải duyệt trước" — giờ có mặt không còn là thứ ai phải duyệt nên không còn gì để tranh chấp.
--   fn_ta_duyet_cong giữ nguyên chữ ký + hành vi; màn duyệt chỉ không còn gửi ca nữa.
-- MẤT GÌ (Luật xoá): không xoá / thu hẹp gì. Thêm 3 hàm + 2 trigger; viết lại _ta_cong_duoc_ca (create or replace, chữ ký giữ nguyên);
--   backfill: ca đang chờ có mọi việc đã duyệt + đã có giờ ra ⇒ 'da_duyet' (tháng chưa chốt, từ mốc chấm công).
-- ============================================================================

-- ── 1. Tính lại trạng thái duyệt của MỘT ca theo việc của nó ──
create or replace function public._ta_ca_tu_duyet(p_ca uuid)
returns void language plpgsql security definer set search_path = public as $$
declare c ta_cham_cong; v_hl int; v_cho int; v_muc text; v_boi uuid;
begin
  if p_ca is null then return; end if;
  select * into c from ta_cham_cong where id = p_ca;
  if c.id is null then return; end if;
  select count(*) filter (where trang_thai <> 'tu_choi'),
         count(*) filter (where trang_thai = 'cho_duyet')
    into v_hl, v_cho from ta_cong_viec where cham_cong_id = p_ca;
  if v_hl = 0 then return; end if;   -- không việc / mọi việc bị từ chối: không có gì để suy
  v_muc := case when v_cho = 0 and (c.ra_at is not null or c.ra_chot is not null) then 'da_duyet' else 'cho_duyet' end;
  if v_muc = c.duyet then return; end if;
  if v_muc = 'da_duyet' then
    select cv.duyet_boi into v_boi from ta_cong_viec cv
     where cv.cham_cong_id = p_ca and cv.trang_thai = 'da_duyet' order by cv.duyet_at desc nulls last limit 1;
    update ta_cham_cong set duyet = 'da_duyet', duyet_boi = v_boi, duyet_at = now(), ly_do_duyet = 'Tự động: mọi việc trong ca đã duyệt'
     where id = p_ca;
  else
    update ta_cham_cong set duyet = 'cho_duyet', duyet_boi = public.current_nhan_su_id(), duyet_at = now(),
           ly_do_duyet = 'Mở lại: ca có việc chưa duyệt (tự động)'
     where id = p_ca;
  end if;
end $$;
revoke execute on function public._ta_ca_tu_duyet(uuid) from public, anon;

-- ── 2. Trigger: việc đổi ⇒ ca theo ──
create or replace function public._tg_ta_viec_ca_tu_duyet()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op <> 'DELETE' then perform public._ta_ca_tu_duyet(new.cham_cong_id); end if;
  if tg_op <> 'INSERT' and (tg_op = 'DELETE' or old.cham_cong_id is distinct from new.cham_cong_id) then
    perform public._ta_ca_tu_duyet(old.cham_cong_id);
  end if;
  return null;
end $$;
revoke execute on function public._tg_ta_viec_ca_tu_duyet() from public, anon;

drop trigger if exists ta_cong_viec_ca_tu_duyet on public.ta_cong_viec;
create trigger ta_cong_viec_ca_tu_duyet after insert or delete or update of trang_thai, cham_cong_id on public.ta_cong_viec
  for each row execute function public._tg_ta_viec_ca_tu_duyet();

-- ── 3. Trigger: ca có giờ ra (checkout · chốt giờ · TA sửa ca khai bù) ⇒ tính lại ──
create or replace function public._tg_ta_ca_gio_ra_tu_duyet()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.ra_at is distinct from old.ra_at or new.ra_chot is distinct from old.ra_chot then
    perform public._ta_ca_tu_duyet(new.id);
  end if;
  return null;
end $$;
revoke execute on function public._tg_ta_ca_gio_ra_tu_duyet() from public, anon;

drop trigger if exists ta_cham_cong_gio_ra_tu_duyet on public.ta_cham_cong;
create trigger ta_cham_cong_gio_ra_tu_duyet after update of ra_at, ra_chot on public.ta_cham_cong
  for each row execute function public._tg_ta_ca_gio_ra_tu_duyet();

-- ── 4. Ca "trong phạm vi" của trưởng khối: có ≥1 việc thuộc khối mình, không phải ca của mình ──
create or replace function public._ta_cong_duoc_ca(p_ca uuid, p_pv text[], p_me uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from ta_cham_cong cc where cc.id = p_ca and cc.nhan_su_id is distinct from p_me)
     and exists (select 1 from ta_cong_viec v where v.cham_cong_id = p_ca and v.trang_thai <> 'tu_choi'
                   and public._ta_cong_duoc_viec(v.id, p_pv, p_me))
$$;

-- ── 5. Backfill: ca đang chờ mà mọi việc đã duyệt + đã có giờ ra (tháng chưa chốt, từ mốc chấm công) ──
do $$
declare r record;
begin
  for r in select cc.id from ta_cham_cong cc
            where cc.duyet = 'cho_duyet' and cc.ngay >= public._ta_moc_cham_cong() and not public._ta_ky_da_chot(cc.ngay)
  loop
    perform public._ta_ca_tu_duyet(r.id);
  end loop;
end $$;

-- CÂU HỎI MỞ (Thùy): ca KHÔNG có việc nào (checkin cho có, ~24 ca tính tới 21/11) vẫn "chờ duyệt" mãi và chặn chốt kỳ
-- ("không còn ca chờ duyệt"). Trưởng khối không thấy những ca này (không việc ⇒ không thuộc khối nào), chỉ Core team thấy.
