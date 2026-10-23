-- ============================================================================
-- 202610231549 — danh_gia_cuoi_cap
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 23/10 — spec-danh-gia-cuoi-cap.md. Màn NHÌN THÊM cho lớp cuối cấp (5T · 9 · 12): đo theo LẦN làm bài,
--   không theo câu. Một lần = một bài làm (1 BTVN / ET / MT / khảo sát / test bổ trợ); % của lần = TB giá trị các câu
--   của lần đó THUỘC NÚT đang xét; mọi lần ngang nhau (không trọng số số câu, không trọng số nguồn).
--   Xu hướng = TB ngắn − TB dài (cửa sổ ngắn NẰM TRONG cửa sổ dài), cửa sổ theo tầng: chủ đề 5/10 · chuyên đề 5/10 · nhóm 3/5.
--   Chỉ năm học này (≥ 15/06/2026). 5T tạm bản đồ CŨ (không có tầng nhóm bài). Hình: tạm chỉ tầng chủ đề.
--   KHÔNG tính: thi thử, tự luyện, game, luyện bổ trợ, retest.
--   Nguồn câu theo đúng luật _dbht_cau (Dashboard học tập, cùng ngày): câu app có bản sao trong lưới chấm buổi
--   (gami_grades.bai_lam_cau_id) ⇒ lấy bản chấm buổi, không đếm 2 lần; giá trị câu = điểm đạt / tối đa, không có điểm ⇒ Đ 1 · nửa 0.5 · S 0.
--   Khác _dbht_cau có chủ ý: CÓ khảo sát (buổi khảo sát không có lop_id ⇒ môn lấy từ đề), KHÔNG retest, có bản đồ cũ + Hình.
--   Mastery hiện tại (fn_mastery_cells) KHÔNG đổi.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì: chỉ thêm hàm mới.
-- ============================================================================

-- ── 1. Tham số (sửa con số = sửa MỘT chỗ) ──
create or replace function _dgcc_tham_so()
returns table(tu_ngay date, khoi text[], khoi_ban_do_cu text[], nguong_nhe numeric, nguong_ro numeric)
language sql immutable as $$
  select date '2026-06-15', array['5T', '9', '12'], array['5T'], 3::numeric, 10::numeric
$$;

create or replace function _dgcc_cua_so()
returns table(tang text, ngan integer, dai integer)
language sql immutable as $$
  values ('chu_de', 5, 10), ('chuyen_de', 5, 10), ('nhom', 3, 5)
$$;

-- ── 2. Mọi câu đã chấm của nhóm HS ở các bài chính quy, kèm khoá LẦN (chưa quy về bản đồ) ──
create or replace function _dgcc_cau(p_hs uuid[], p_mon text)
returns table(hoc_sinh_id uuid, luot text, kenh text, t timestamptz, ma_cau text, ma_dang text, hinh_baitoan_id uuid, gia_tri numeric)
language sql stable set search_path to 'public' as $$
  -- chấm theo buổi (giấy / trên lớp / bản sao câu app): ET · MT · khảo sát · BTVN
  select g.hoc_sinh_id, sp.phase || ':' || sp.buoi_hoc_id,
         case when bh.loai = 'khao_sat' then 'khao_sat' else sp.phase end,
         coalesce(nop.t, (bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at),
         sp.ma_cau, sp.ma_dang, sp.hinh_baitoan_id,
         case when g.diem_dat is not null and sp.diem_toi_da > 0 then least(g.diem_dat / sp.diem_toi_da, 1)
              else case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end end
    from gami_grades g
    join gami_session_problems sp on sp.id = g.problem_id
    join buoi_hoc bh on bh.id = sp.buoi_hoc_id
    left join lop l on l.id = bh.lop_id
    left join tai_lieu de on de.id = bh.de_id
    left join lateral (select coalesce(bl0.nop_at, b0.cham_at) as t from bai_lam_cau b0 join bai_lam bl0 on bl0.id = b0.bai_lam_id
                        where b0.id = g.bai_lam_cau_id) nop on true
   where g.hoc_sinh_id = any(p_hs) and sp.phase in ('et', 'mt', 'btvn')
     and coalesce(l.mon, de.mon) = p_mon
  union all
  -- làm trên app (chưa có bản sao ở lưới chấm buổi): ET · BTVN · test bổ trợ (yếu · bù · đuổi)
  select bl.hoc_sinh_id, 'bl:' || bl.id,
         case when bt.loai in ('et', 'de_thi') then 'et' when bt.loai in ('btvn', 'giao_trinh') then 'btvn' else bt.loai end,
         coalesce(bl.nop_at, blc.cham_at),
         btc.ma_cau, btc.ma_dang, null::uuid,
         case when blc.diem is not null and btc.diem > 0 then least(blc.diem / btc.diem, 1)
              else case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end end
    from bai_lam_cau blc
    join bai_lam bl on bl.id = blc.bai_lam_id
    join bai_test bt on bt.id = bl.bai_test_id and bt.mon = p_mon
    join bai_test_cau btc on btc.id = blc.bai_test_cau_id
   where bl.hoc_sinh_id = any(p_hs) and blc.verdict is not null
     and not exists (select 1 from gami_grades gx where gx.bai_lam_cau_id = blc.id)
     and bt.loai in ('et', 'de_thi', 'btvn', 'giao_trinh', 'bo_tro_test', 'bu_test', 'htd_test')
     and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop')
$$;

-- ── 3. Một câu → (chủ đề, chuyên đề, nhóm bài). Không quy được ⇒ 0 dòng (không đoán — §1.5) ──
--   Hình luyện (bài mô hình) / Hình học ⇒ chỉ chủ đề. Bản đồ cũ ⇒ chủ đề + chuyên đề. Bản đồ mới ⇒ đủ 3 tầng.
create or replace function _dgcc_nut(p_ma_cau text, p_ma_dang text, p_hbt uuid, p_cu boolean)
returns table(chu_de text, chuyen_de text, nhom text)
language plpgsql stable security definer set search_path to 'public' as $$
declare v_mh uuid; v_cd text; v text; i integer := 0;
begin
  -- Hình luyện: bài mô hình → mô hình → chủ đề (của mô hình, nhóm mô hình, hoặc mô hình cha chính)
  if p_hbt is not null then select hb.mo_hinh_id into v_mh from hinh_baitoan hb where hb.id = p_hbt; end if;
  if v_mh is null and p_ma_dang is not null then
    select hb.mo_hinh_id into v_mh from hinh_baitoan hb where hb.ma = p_ma_dang order by hb.id limit 1;
  end if;
  if v_mh is not null then
    loop
      select coalesce(mh.chu_de_id, nm.chu_de_id) into v_cd
        from hinh_mo_hinh mh left join hinh_nhom_mo_hinh nm on nm.id = mh.nhom_mh_id where mh.id = v_mh;
      exit when v_cd is not null or i >= 8;
      select c.cha_id into v_mh from hinh_mo_hinh_cha c where c.mo_hinh_id = v_mh and c.chinh limit 1;
      exit when v_mh is null;
      i := i + 1;
    end loop;
    if v_cd is not null then return query select v_cd, null::text, null::text; end if;
    return;
  end if;

  -- Hình học: câu → bài học → chủ đề
  select hb.chu_de_id into v_cd from hinh_hoc_bai hb
   where hb.ma_bai = coalesce((select c.dang_chinh from hinh_hoc_cau_hoi c where c.ma_cau = p_ma_cau), p_ma_dang);
  if found then
    if v_cd is not null then return query select v_cd, null::text, null::text; end if;
    return;
  end if;

  -- Đại / HGT
  if p_cu then
    v := _do_nhom_cua_o(p_ma_cau, p_ma_dang);
    return query select b.ma_chu_de, b.ma_chuyen_de, null::text from dai_ban_do b
                  where b.ma_dang = v and b.xoa_at is null and not _kho_la_dang_cho(b.ma_dang);
    return;
  end if;
  v := _do_o_bdm(p_ma_cau, p_ma_dang);
  return query select n.chu_de_id, n.chuyen_de_id, n.id from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id where d.id = v;
end $$;

-- ── 4. Các LẦN ở mỗi tầng: (HS, tầng, nút, cha, lần) → số câu, % ──
create or replace function _dgcc_lan(p_hs uuid[], p_mon text)
returns table(hoc_sinh_id uuid, tang text, nut text, cha text, luot text, kenh text, t timestamptz, ngay date,
              so_cau integer, diem numeric, ti_le numeric)
language sql stable set search_path to 'public' as $$
  with ts as (select * from _dgcc_tham_so()),
  hs as (
    select h.id, h.khoi = any(ts.khoi_ban_do_cu) as cu from hoc_sinh h, ts where h.id = any(p_hs) and h.khoi = any(ts.khoi)
  ),
  c as (
    select c.*, hs.cu, coalesce(c.ma_cau, '') kc, coalesce(c.ma_dang, '') kd, coalesce(c.hinh_baitoan_id::text, '') kh
      from _dgcc_cau(array(select id from hs), p_mon) c
      join hs on hs.id = c.hoc_sinh_id
     cross join ts
     where c.t >= (ts.tu_ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh'
       and (c.ma_cau is not null or c.ma_dang is not null or c.hinh_baitoan_id is not null)
  ),
  m as (
    select k.kc, k.kd, k.kh, k.cu, n.chu_de, n.chuyen_de, n.nhom
      from (select distinct kc, kd, kh, cu from c) k
     cross join lateral _dgcc_nut(nullif(k.kc, ''), nullif(k.kd, ''), nullif(k.kh, '')::uuid, k.cu) n
  ),
  x as (
    select c.hoc_sinh_id, c.luot, c.kenh, c.t, c.gia_tri, m.chu_de, m.chuyen_de, m.nhom
      from c join m on m.kc = c.kc and m.kd = c.kd and m.kh = c.kh and m.cu = c.cu
  ),
  tg as (
    select hoc_sinh_id, 'chu_de' as tang, chu_de as nut, null::text as cha, luot, kenh, t, gia_tri from x where chu_de is not null
    union all
    select hoc_sinh_id, 'chuyen_de', chuyen_de, chu_de, luot, kenh, t, gia_tri from x where chuyen_de is not null
    union all
    select hoc_sinh_id, 'nhom', nhom, chuyen_de, luot, kenh, t, gia_tri from x where nhom is not null
  )
  select hoc_sinh_id, tang, nut, cha, luot, min(kenh), max(t), (max(t) at time zone 'Asia/Ho_Chi_Minh')::date,
         count(*)::integer, sum(gia_tri), avg(gia_tri)
    from tg
   group by hoc_sinh_id, tang, nut, cha, luot
$$;

-- ── 5. Tên + thứ tự hiển thị của một nút (bản đồ mới hoặc cũ) ──
create or replace function _dgcc_ten(p_tang text, p_nut text, p_cha text)
returns table(ten text, thu_tu integer)
language sql stable security definer set search_path to 'public' as $$
  select x.ten, x.thu_tu from (
    select cd.ten, cd.thu_tu, 1 as uu from dai_bdm_chu_de cd where p_tang = 'chu_de' and cd.id = p_nut
    union all
    select ch.ten, o.thu_tu, 1 from dai_bdm_chuyen_de ch left join dai_bdm_o o on o.chuyen_de_id = ch.id and o.chu_de_id = p_cha
     where p_tang = 'chuyen_de' and ch.id = p_nut
    union all
    select n.ten, n.thu_tu, 1 from dai_bdm_nhom n where p_tang = 'nhom' and n.id = p_nut
    union all
    select b.ten_chu_de, null::integer, 2 from dai_ban_do b where p_tang = 'chu_de' and b.ma_chu_de = p_nut
    union all
    select b.ten_chuyen_de, null::integer, 2 from dai_ban_do b where p_tang = 'chuyen_de' and b.ma_chuyen_de = p_nut
  ) x order by x.uu limit 1
$$;

-- ── 6. Bảng của nhóm HS: mỗi (HS, tầng, nút) → số lần, TB ngắn / dài (%), chênh, nhãn xu hướng ──
create or replace function fn_dgcc_hs(p_hs uuid[], p_mon text DEFAULT 'Toán')
returns table(hoc_sinh_id uuid, tang text, nut text, cha text, ten text, thu_tu integer, so_lan integer,
              cua_so_ngan integer, cua_so_dai integer, tb_ngan numeric, tb_dai numeric, chenh numeric, xu_huong text, lan_cuoi date)
language sql stable set search_path to 'public' as $$
  with l as (
    select l.*, row_number() over (partition by l.hoc_sinh_id, l.tang, l.nut, l.cha order by l.t desc, l.luot) as rn
      from _dgcc_lan(p_hs, p_mon) l
  ),
  a as (
    select l.hoc_sinh_id, l.tang, l.nut, l.cha, count(*)::integer as so_lan, max(w.ngan) as ngan, max(w.dai) as dai,
           avg(l.ti_le) filter (where l.rn <= w.ngan) as tb_ngan,
           avg(l.ti_le) filter (where l.rn <= w.dai) as tb_dai,
           max(l.ngay) as lan_cuoi
      from l join _dgcc_cua_so() w on w.tang = l.tang
     group by l.hoc_sinh_id, l.tang, l.nut, l.cha
  )
  select a.hoc_sinh_id, a.tang, a.nut, a.cha, tn.ten, tn.thu_tu, a.so_lan, a.ngan, a.dai,
         round(a.tb_ngan * 100, 1), round(a.tb_dai * 100, 1),
         case when a.so_lan > a.ngan then round((a.tb_ngan - a.tb_dai) * 100, 1) end,
         case when a.so_lan <= a.ngan then 'chua_du'
              when (a.tb_ngan - a.tb_dai) * 100 >  ts.nguong_ro   then 'tang_ro'
              when (a.tb_ngan - a.tb_dai) * 100 >= ts.nguong_nhe  then 'tang_nhe'
              when (a.tb_ngan - a.tb_dai) * 100 < -ts.nguong_ro   then 'giam_ro'
              when (a.tb_ngan - a.tb_dai) * 100 <= -ts.nguong_nhe then 'giam_nhe'
              else 'di_ngang' end,
         a.lan_cuoi
    from a
   cross join _dgcc_tham_so() ts
    left join lateral _dgcc_ten(a.tang, a.nut, a.cha) tn on true
$$;

-- ── 7. Một lớp, một tầng (môn = môn của lớp; HS ngoài 5T · 9 · 12 tự rơi) ──
create or replace function fn_dgcc_lop(p_lop uuid, p_tang text DEFAULT 'chu_de')
returns table(hoc_sinh_id uuid, ho_ten text, tang text, nut text, cha text, ten text, thu_tu integer, so_lan integer,
              cua_so_ngan integer, cua_so_dai integer, tb_ngan numeric, tb_dai numeric, chenh numeric, xu_huong text, lan_cuoi date)
language sql stable set search_path to 'public' as $$
  select r.hoc_sinh_id, h.ho_ten, r.tang, r.nut, r.cha, r.ten, r.thu_tu, r.so_lan, r.cua_so_ngan, r.cua_so_dai,
         r.tb_ngan, r.tb_dai, r.chenh, r.xu_huong, r.lan_cuoi
    from fn_dgcc_hs(array(select hl.hoc_sinh_id from hoc_sinh_lop hl where hl.lop_id = p_lop and hl.trang_thai = 'dang_hoc'),
                    (select l.mon from lop l where l.id = p_lop)) r
    join hoc_sinh h on h.id = r.hoc_sinh_id
   where r.tang = p_tang
$$;

-- ── 8. Bấm một ô: các lần của nút đó (mới nhất trước), đánh dấu lần nào nằm trong cửa sổ ngắn / dài ──
create or replace function fn_dgcc_lan_nut(p_hs uuid, p_tang text, p_nut text, p_cha text DEFAULT NULL, p_mon text DEFAULT 'Toán')
returns table(stt integer, ngay date, kenh text, so_cau integer, diem numeric, ti_le numeric, trong_ngan boolean, trong_dai boolean)
language sql stable set search_path to 'public' as $$
  with l as (
    select l.*, row_number() over (order by l.t desc, l.luot)::integer as rn
      from _dgcc_lan(array[p_hs], p_mon) l
     where l.tang = p_tang and l.nut = p_nut and l.cha is not distinct from p_cha
  )
  select l.rn, l.ngay, l.kenh, l.so_cau, round(l.diem, 2), round(l.ti_le * 100, 1), l.rn <= w.ngan, l.rn <= w.dai
    from l join _dgcc_cua_so() w on w.tang = l.tang
   order by l.rn
$$;

revoke execute on function _dgcc_tham_so() from public, anon;
revoke execute on function _dgcc_cua_so() from public, anon;
revoke execute on function _dgcc_cau(uuid[], text) from public, anon;
revoke execute on function _dgcc_nut(text, text, uuid, boolean) from public, anon;
revoke execute on function _dgcc_lan(uuid[], text) from public, anon;
revoke execute on function _dgcc_ten(text, text, text) from public, anon;
revoke execute on function fn_dgcc_hs(uuid[], text) from public, anon;
revoke execute on function fn_dgcc_lop(uuid, text) from public, anon;
revoke execute on function fn_dgcc_lan_nut(uuid, text, text, text, text) from public, anon;
grant execute on function _dgcc_tham_so(), _dgcc_cua_so(), _dgcc_cau(uuid[], text), _dgcc_nut(text, text, uuid, boolean),
  _dgcc_lan(uuid[], text), _dgcc_ten(text, text, text), fn_dgcc_hs(uuid[], text), fn_dgcc_lop(uuid, text),
  fn_dgcc_lan_nut(uuid, text, text, text, text) to authenticated;
