-- MỤC TIÊU TUẦN — kết quả TỪNG DẠNG của một việc (ET · MT · BTVN của một buổi) (Thùy 17/11 khuya:
-- "các dạng trong hoạt động không cần hiện mặc định; có nút Chi tiết cùng dòng, bấm vào mới hiện kết quả từng dạng").
-- Bấm đến đâu gọi đến đấy (§2.0): chỉ gọi khi mở chi tiết MỘT việc; tốn theo một em × một buổi.
-- KHÔNG quét rộng (spec-kien-truc K2/K24): mọi đường đọc có index sẵn — gami_grades (buoi_hoc_id, hoc_sinh_id) · bai_test (buoi_hoc_id) ·
--   bai_lam (hoc_sinh_id) · bai_lam_cau unique (bai_lam_id, bai_test_cau_id) · gami_grades (bai_lam_cau_id). Không đọc lịch sử đo, không tính mastery
--   (mức của dạng đã có ở bảng lưu sẵn qua fn_mtt_dang_tinh_trang) — đây chỉ là điểm thô của MỘT bài, vài chục câu.
-- Nguồn câu y hệt _mtt_diem (cùng bộ lọc) ⇒ tổng các dạng khớp % của việc. Quy câu → ô (dạng NDB; Hình–Học: bài) bằng _do_o_quy như mastery.
-- Câu không quy được về dạng ⇒ một dòng "Câu chưa gán dạng" (không bỏ, để tổng số câu khớp).
create or replace function public.fn_mtt_viec_dang(p_hs uuid, p_mon text, p_buoi uuid, p_loai text)
returns jsonb
language plpgsql stable security definer
set search_path to 'public'
as $$
declare
  v       jsonb;
  v_phase text := case p_loai when 'btvn' then 'btvn' when 'mt' then 'mt' else 'et' end;
begin
  -- cổng: nhân sự xem được môn này, hoặc chính em
  if not ((public.la_thanh_vien() and public._mon_duoc_xem(p_mon)) or public.my_hoc_sinh_id() = p_hs) then
    raise exception 'Ngoài quyền xem.' using errcode = '42501';
  end if;
  if p_loai not in ('et', 'mt', 'btvn') then return '[]'::jsonb; end if;

  with g as (
    select coalesce(sp.ma_cau, '') as kc, coalesce(sp.ma_dang, '') as kd,
           case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end as v
      from gami_grades g join gami_session_problems sp on sp.id = g.problem_id
     where g.buoi_hoc_id = p_buoi and g.hoc_sinh_id = p_hs and sp.phase = v_phase   -- gami_grades_buoi_hs_idx (buổi, em)
    union all
    select coalesce(btc.ma_cau, ''), coalesce(btc.ma_dang, ''),
           case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end
      from bai_test bt
      join bai_lam bl on bl.bai_test_id = bt.id and bl.hoc_sinh_id = p_hs
      join bai_lam_cau blc on blc.bai_lam_id = bl.id
      join bai_test_cau btc on btc.id = blc.bai_test_cau_id
     where v_phase <> 'mt' and bt.buoi_hoc_id = p_buoi and blc.verdict is not null
       and case when v_phase = 'btvn' then bt.loai = 'btvn' else bt.loai not in ('btvn', 'tu_luyen') end
       and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop')
       and not exists (select 1 from gami_grades gx where gx.bai_lam_cau_id = blc.id)
  ),
  m as materialized (
    select q.kc, q.kd, public._do_o_quy(public._mastery_bdm_bat(), false, q.kc, q.kd) as o
      from (select distinct kc, kd from g) q
  ),
  x as (
    select m.o, count(*)::int as n, avg(g.v) as p
      from g join m on m.kc = g.kc and m.kd = g.kd
     group by m.o
  )
  select coalesce(jsonb_agg(jsonb_build_object(
           'ma', x.o,
           'ten', case when x.o is null then 'Câu chưa gán dạng'
                       else coalesce(db.ten, hh.ten_bai, public._kho_ten_dang(p_mon, x.o), x.o) end,
           'so_cau', x.n,
           'pct', round(x.p * 100)::int)
         order by (x.o is null), db.thu_tu nulls last, x.o), '[]'::jsonb)
    into v
    from x
    left join dai_bdm_dang_bai db on db.id = x.o
    left join hinh_hoc_bai hh on hh.ma_bai = x.o;
  return v;
end $$;

revoke execute on function public.fn_mtt_viec_dang(uuid, text, uuid, text) from public, anon;
grant execute on function public.fn_mtt_viec_dang(uuid, text, uuid, text) to authenticated;
-- áp bằng SQL Editor ⇒ chủ là postgres; trả về claude_build như mọi hàm mtt (bài học 16–17/11)
alter function public.fn_mtt_viec_dang(uuid, text, uuid, text) owner to claude_build;
