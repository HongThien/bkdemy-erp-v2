-- ============================================================================
-- 202610231446 — mastery_ban_do_moi_loi
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Thùy 23/10: chuyển MASTERY K6–12 từ bản đồ cũ (dai_ban_do.ma_dang) sang bản đồ mới (dai_bdm_dang_bai.id 'NDB…').
--   "Hiện tại xây 1 ver song song có sẵn, khi nào bấm nút là chuyển" — bấm thứ Hai 27/10. Cấp 1 (K3–5T) GIỮ bản đồ cũ.
--   Mastery không lưu — suy từ lượt đo (mỗi lượt có ma_cau). Đổi bản đồ = đổi hàm quy CÂU → Ô; công thức (cửa sổ 5, trọng số
--   MT 3 · ET 2 · khác 1, ngưỡng 0.8/0.5, độ tin) GIỮ NGUYÊN, chỉ còn MỘT bản (_mastery_cells_core) — fn_mastery_cells giữ chữ ký
--   (mọi người gọi không đổi) và đọc công tắc; fn_mastery_cells_bdm luôn tính theo bản đồ mới (xem trước / so sánh trước khi bấm).
--   Quy câu → dạng bài mới (_do_o_bdm) theo đúng thứ tự builder đang dùng (_bdm_cau_giai): gán câu → gán câu gốc → gán cụm cũ →
--   dạng cũ gắn đúng 1 dạng bài → (thêm) AI đề xuất. Không quy được ⇒ NULL (ô để trống, tự lấp khi câu được gán — §1.5).
--   Thùy: "sai sót đoạn này chấp nhận được" ⇒ dùng cả gán AI / đề xuất chưa duyệt.
--   Công tắc = bảng he_thong_cong_tac (1 dòng / công tắc) + log trigger (ai bấm, lúc nào, cũ → mới — CLAUDE.md §4).
--
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì: fn_mastery_cells thay THÂN (chữ ký giữ nguyên) — công tắc tắt ⇒ kết quả y hệt bản cũ.
-- ============================================================================

-- ── 1. Công tắc hệ thống + lịch sử ──
create table if not exists he_thong_cong_tac (
  ma         text primary key,
  bat        boolean not null default false,
  mo_ta      text not null,
  updated_at timestamptz not null default now(),
  updated_by uuid default jwt_uid()
);
create table if not exists he_thong_cong_tac_log (
  id    bigint generated always as identity primary key,
  ma    text not null,
  cu    boolean,
  moi   boolean not null,
  actor uuid default jwt_uid(),
  at    timestamptz not null default now()
);
alter table he_thong_cong_tac enable row level security;
alter table he_thong_cong_tac_log enable row level security;
create policy he_thong_cong_tac_doc on he_thong_cong_tac for select to authenticated using (la_thanh_vien());
create policy he_thong_cong_tac_log_doc on he_thong_cong_tac_log for select to authenticated using (la_thanh_vien());
-- ghi CHỈ qua fn_he_thong_cong_tac_dat (security definer, kiểm admin) — không có policy ghi

create or replace function _he_thong_cong_tac_ghi_log() returns trigger language plpgsql security definer set search_path to 'public' as $$
begin
  if tg_op = 'INSERT' or new.bat is distinct from old.bat then
    insert into he_thong_cong_tac_log (ma, cu, moi) values (new.ma, case when tg_op = 'UPDATE' then old.bat end, new.bat);
  end if;
  return new;
end $$;
create trigger trg_he_thong_cong_tac_log after insert or update on he_thong_cong_tac for each row execute function _he_thong_cong_tac_ghi_log();

insert into he_thong_cong_tac (ma, bat, mo_ta)
values ('mastery_ban_do_moi', false, 'Mastery K6–12 đo theo BẢN ĐỒ MỚI (dạng bài NDB…). Tắt = bản đồ cũ. Cấp 1 luôn bản đồ cũ.')
on conflict (ma) do nothing;

create or replace function _mastery_bdm_bat() returns boolean language sql stable security definer set search_path to 'public' as $$
  select coalesce((select bat from he_thong_cong_tac where ma = 'mastery_ban_do_moi'), false)
$$;

-- Bật / tắt (admin). Trả trạng thái mới.
create or replace function fn_he_thong_cong_tac_dat(p_ma text, p_bat boolean) returns boolean
language plpgsql security definer set search_path to 'public' as $$
begin
  if not coalesce((select la_admin from my_quyen()), false) then
    raise exception 'Chỉ admin được bật / tắt công tắc hệ thống' using errcode = '42501';
  end if;
  update he_thong_cong_tac set bat = p_bat, updated_at = now(), updated_by = jwt_uid() where ma = p_ma;
  if not found then raise exception 'Không có công tắc %', p_ma; end if;
  return p_bat;
end $$;
revoke execute on function fn_he_thong_cong_tac_dat(text, boolean) from public, anon;
grant execute on function fn_he_thong_cong_tac_dat(text, boolean) to authenticated;

-- dạng cũ gắn ĐÚNG 1 chỗ và chỗ đó là dạng bài (trường hợp ① của _bdm_cau_giai) ⇒ dạng bài đó; còn lại NULL
create or replace function _bdm_dang_cu_mot_dich(p_ma_dang_cu text) returns text language sql stable as $$
  select min(d.dich_dang_bai) from dai_bdm_doi_ung d where d.ma_dang_cu = p_ma_dang_cu
  having count(*) = 1 and count(d.dich_dang_bai) = 1
$$;

-- ── 2. Quy 1 lượt đo (câu, mã dạng chép lúc đo) → Ô BẢN ĐỒ MỚI ──
-- Đại K6–12 + HGT ⇒ dạng bài mới (NULL nếu chưa quy được). Cấp 1 (K3–5T) + Hình + nhánh khác ⇒ GIỮ bản đồ cũ (_do_nhom_cua_o).
create or replace function _do_o_bdm(p_ma_cau text, p_ma_dang_chep text) returns text
language plpgsql stable security definer set search_path to 'public' as $$
declare q record; v text; v_khoi text;
begin
  if p_ma_cau is not null then
    select c.ma_cau, c.dang_chinh, coalesce(c.parent_ma_cau, c.ma_cau) goc, coalesce(c.ma_cum, g.ma_cum) cum, b.khoi
      into q
      from dai_cau_hoi c left join dai_cau_hoi g on g.ma_cau = c.parent_ma_cau left join dai_ban_do b on b.ma_dang = c.dang_chinh
     where c.ma_cau = p_ma_cau;
    if found then
      if q.khoi in ('3', '4', '4T', '5', '5T') then return _do_nhom_cua_o(p_ma_cau, p_ma_dang_chep); end if;
      select gc.dang_bai_id into v from dai_bdm_gan_cau gc where gc.ma_cau = q.ma_cau;
      if v is null and q.goc <> q.ma_cau then select gc.dang_bai_id into v from dai_bdm_gan_cau gc where gc.ma_cau = q.goc; end if;
      if v is null and q.cum is not null then select cu.dang_bai_id into v from dai_bdm_doi_ung_cum cu where cu.ma_cum_cu = q.cum; end if;
      if v is null then v := _bdm_dang_cu_mot_dich(q.dang_chinh); end if;
      if v is null then select x.dang_bai_id into v from dai_bdm_de_xuat x where x.ma_cau = q.ma_cau; end if;
      return v;
    end if;
    if exists (select 1 from hgt_cau_hoi h where h.ma_cau = p_ma_cau) then
      select gc.dang_bai_id into v from hgt_bdm_gan_cau gc where gc.ma_cau = p_ma_cau;
      if v is null then select x.dang_bai_id into v from hgt_bdm_de_xuat x where x.ma_cau = p_ma_cau; end if;
      return v;
    end if;
  end if;
  -- lượt đo không có mã câu, hoặc câu không (còn) ở kho Đại/HGT: theo mã dạng chép lúc đo.
  -- Mã không phải dạng Đại (Hình, KHTN, …) hoặc dạng cấp 1 ⇒ bản đồ riêng / cũ, không đổi.
  -- Quy về dạng cũ CÒN SỐNG trước (_do_nhom_cua_o đi theo gộp dạng / log đổi dạng), rồi mới sang bản đồ mới.
  v := _do_nhom_cua_o(p_ma_cau, p_ma_dang_chep);
  select b.khoi into v_khoi from dai_ban_do b where b.ma_dang = v;
  if v_khoi is null or v_khoi in ('3', '4', '4T', '5', '5T') then return v; end if;
  return _bdm_dang_cu_mot_dich(v);
end $$;

-- ── 3. Công thức mastery — MỘT bản, tham số p_bdm chọn bản đồ ──
create or replace function _mastery_cells_core(p_bdm boolean, p_hs uuid[], p_include_btvn boolean DEFAULT false, p_since timestamp with time zone DEFAULT NULL::timestamp with time zone, p_window integer DEFAULT 5, p_tin_cao integer DEFAULT 5, p_tin_tb integer DEFAULT 3, p_den timestamp with time zone DEFAULT NULL::timestamp with time zone)
 RETURNS TABLE(hoc_sinh_id uuid, ma_dang text, score numeric, n bigint, muc text, tin text)
 LANGUAGE sql
 STABLE
AS $function$
  with hs_cap1 as (
    select id, (khoi in ('3', '4', '4T', '5', '5T')) as cap1 from hoc_sinh where id = any(p_hs)
  ),
  m as (
    -- gami_grades: t = NGÀY BUỔI (mọi gsp gắn buổi theo schema, join left để phòng thủ)
    select g.hoc_sinh_id, sp.ma_dang,
           case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end as value,
           coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) as t,
           sp.phase as src, sp.ma_cau
    from gami_grades g
    join gami_session_problems sp on sp.id = g.problem_id
    left join buoi_hoc bh on bh.id = sp.buoi_hoc_id
    where g.hoc_sinh_id = any(p_hs) and sp.ma_dang is not null
      and sp.phase in ('et', 'mt', 'btvn')
      and (p_since is null or coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) >= p_since)
      and (p_den is null or coalesce((bh.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', g.graded_at) < p_den)
    union all
    -- bai_lam_cau online: t = ngày buổi của bai_test (nếu có), fallback cham_at
    select bl.hoc_sinh_id, btc.ma_dang,
           case blc.verdict when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
           coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at),
           case when bt.loai in ('et', 'de_thi') then 'et'
                when bt.loai = 'bo_tro_test' then 'et' -- Thùy 22/09: test cuối ca bổ trợ yếu tính mastery như ET
                when bt.loai = 'tu_luyen' then 'tu_luyen' else 'btvn' end, btc.ma_cau
    from bai_lam_cau blc
    join bai_lam bl on bl.id = blc.bai_lam_id
    join bai_test bt on bt.id = bl.bai_test_id
    join bai_test_cau btc on btc.id = blc.bai_test_cau_id
    left join buoi_hoc bh2 on bh2.id = bt.buoi_hoc_id
    where bl.hoc_sinh_id = any(p_hs) and blc.verdict is not null and btc.ma_dang is not null
      and (bt.loai not in ('et', 'de_thi') or bl.trang_thai = 'da_nop') and bt.loai not in ('on_thi_luyen', 'thi_thu')
      and (p_since is null or coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at) >= p_since)
      and (p_den is null or coalesce((bh2.ngay::timestamp) at time zone 'Asia/Ho_Chi_Minh', blc.cham_at) < p_den)
    union all
    -- bt_grades: bổ trợ không gắn buổi, giữ graded_at
    select tl.hoc_sinh_id, btg.ma_dang,
           case btg.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end,
           btg.graded_at, 'bt', btg.ma_cau
    from bt_grades btg
    join tai_lieu tl on tl.id = btg.tai_lieu_id
    where tl.hoc_sinh_id = any(p_hs)
      and (p_since is null or btg.graded_at >= p_since)
      and (p_den is null or btg.graded_at < p_den)
  ),
  mf as (
    select m.* from m join hs_cap1 h on h.id = m.hoc_sinh_id
    where m.src in ('et', 'mt')
       or (p_include_btvn and m.src in ('btvn', 'bt', 'tu_luyen'))
       or (h.cap1 and m.src = 'tu_luyen')
  ),
  -- 12/10 ĐO ĐI THEO CÂU (spec-ban-do-4-tang §10): dạng của một lượt đo = _do_nhom_cua_o(câu, mã chép) — tính 1 lần cho mỗi cặp
  cap as (
    select d.kc, d.kd,
           case when public._btyeu_la_hinh_mh(d.kd) then null
                when p_bdm then public._do_o_bdm(nullif(d.kc, ''), nullif(d.kd, ''))   -- BẢN ĐỒ MỚI (K6–12; cấp 1 + Hình giữ cũ bên trong)
                else public._do_nhom_cua_o(nullif(d.kc, ''), nullif(d.kd, '')) end as nhom -- 14/10: bài mô hình đo ở fn_mastery_cells_hinh
    from (select distinct coalesce(ma_cau, '') as kc, coalesce(ma_dang, '') as kd from mf) d
  ),
  mg as (
    select mf.hoc_sinh_id, cap.nhom as ma_dang, mf.value, mf.t, mf.src
    from mf join cap on cap.kc = coalesce(mf.ma_cau, '') and cap.kd = coalesce(mf.ma_dang, '') and cap.nhom is not null
  ),
  rk as (
    select mf.*,
           case mf.src when 'mt' then 3 when 'et' then 2 else 1 end as w,
           row_number() over (partition by mf.hoc_sinh_id, mf.ma_dang
                              order by mf.t desc, mf.src, mf.value desc, mf.ma_dang) as rn,
           -- ⭐ HÌNH–HỌC (CEO 14/10): bài tập hình làm được ít hơn Đại nhiều ⇒ thang đo 3 bài thay vì 5.
           -- Độ tin scale cùng tỉ lệ (3/2 thay 5/3) — cùng bộ số với Hình–Luyện (fn_mastery_cells_hinh, 21/08).
           -- "Là Hình–Học" = dạng nằm trong hinh_hoc_bai (KP = bài học). Đại / Hình giải tích giữ nguyên tham số.
           case when hh.ma_bai is not null then least(p_window, 3)  else p_window  end as cs,
           case when hh.ma_bai is not null then least(p_tin_cao, 3) else p_tin_cao end as tc,
           case when hh.ma_bai is not null then least(p_tin_tb, 2)  else p_tin_tb  end as tt
    from mg mf
    left join hinh_hoc_bai hh on hh.ma_bai = mf.ma_dang
  )
  select hoc_sinh_id, ma_dang,
         sum(value * w) filter (where rn <= cs) / nullif(sum(w) filter (where rn <= cs), 0) as score,
         count(*) as n,
         case when sum(value * w) filter (where rn <= cs) / nullif(sum(w) filter (where rn <= cs), 0) >= 0.8 then 'dat'
              when sum(value * w) filter (where rn <= cs) / nullif(sum(w) filter (where rn <= cs), 0) >= 0.5 then 'can_luyen'
              else 'yeu' end,
         case when count(*) >= max(tc) then 'cao' when count(*) >= max(tt) then 'tb' else 'thap' end
  from rk
  group by hoc_sinh_id, ma_dang
$function$;

-- Giữ CHỮ KÝ cũ: mọi chỗ đang gọi không đổi; bản đồ theo công tắc.
create or replace function fn_mastery_cells(p_hs uuid[], p_include_btvn boolean DEFAULT false, p_since timestamp with time zone DEFAULT NULL::timestamp with time zone, p_window integer DEFAULT 5, p_tin_cao integer DEFAULT 5, p_tin_tb integer DEFAULT 3, p_den timestamp with time zone DEFAULT NULL::timestamp with time zone)
 RETURNS TABLE(hoc_sinh_id uuid, ma_dang text, score numeric, n bigint, muc text, tin text)
 language sql stable as $$
  select * from _mastery_cells_core(_mastery_bdm_bat(), p_hs, p_include_btvn, p_since, p_window, p_tin_cao, p_tin_tb, p_den)
$$;
-- Luôn theo BẢN ĐỒ MỚI — xem trước / so sánh trước khi bấm công tắc.
create or replace function fn_mastery_cells_bdm(p_hs uuid[], p_include_btvn boolean DEFAULT false, p_since timestamp with time zone DEFAULT NULL::timestamp with time zone, p_window integer DEFAULT 5, p_tin_cao integer DEFAULT 5, p_tin_tb integer DEFAULT 3, p_den timestamp with time zone DEFAULT NULL::timestamp with time zone)
 RETURNS TABLE(hoc_sinh_id uuid, ma_dang text, score numeric, n bigint, muc text, tin text)
 language sql stable as $$
  select * from _mastery_cells_core(true, p_hs, p_include_btvn, p_since, p_window, p_tin_cao, p_tin_tb, p_den)
$$;
grant execute on function fn_mastery_cells_bdm(uuid[], boolean, timestamptz, integer, integer, integer, timestamptz) to authenticated;
