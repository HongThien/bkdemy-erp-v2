-- ============================================================================
-- 202609191521 — hoc_tu_dau (PHASE 1 — engine độc lập, chưa nối màn TA bổ trợ đuổi)
-- ----------------------------------------------------------------------------
-- VÌ SAO (CEO 19/09): trước đây bổ trợ đuổi = GV dạy giấy + tick tay "đã dạy dạng"
--   (bo_tro_duoi_dang.day_at, setDangDay). CEO chốt lại toàn bộ, sau khi hỏi rõ 4 điểm:
--   1. "Xong 1 dạng" = HS chỉ cần NỘP bài test (không đòi %, chưa đạt vẫn qua dạng sau
--      bình thường — mastery vẫn ghi nhận yếu, không chặn tiến độ).
--   2. "Học từ đầu" hiện cho HS đang có case bổ trợ đuổi ĐANG MỞ — KHÔNG lưu cờ mới,
--      tự suy từ bo_tro_duoi.trang_thai='can_duoi' (đúng tinh thần §4 "task = suy từ
--      dữ liệu, không đẻ row placeholder/cờ riêng").
--   3. Học ở nhà hay ở trung tâm đều qua ĐÚNG 1 kênh: tài khoản HS tự làm online.
--      GV KHÔNG tick gì nữa — mọi tiến độ tự suy từ bai_test đã nộp (day_at/day_buoi_id
--      của bo_tro_duoi_dang thành VẾT LỊCH SỬ của cơ chế cũ, không xoá cột — nối màn TA
--      đọc tiến độ mới là việc PHASE 2, chưa làm ở đây).
--   4. Thứ tự dạng trong 1 chuyên đề = TẠM dùng 2 số cuối ma_dang (STT cấp mã), CEO
--      chấp nhận rủi ro dù biết không đảm bảo đúng sư phạm 100% (mig 202609180046
--      dòng ghi rõ: dạng bị renumber/chuyển chuyên đề LUÔN cấp STT max+1 ở đích —
--      không giữ vị trí sư phạm gốc). Đổi sau nếu cần thêm cột thu_tu riêng.
--
-- LUỒNG (CEO mô tả): chọn 1 chuyên đề (được phép bỏ qua chuyên đề khác, nhưng đã vào
--   thì học TUẦN TỰ dạng 1→2→3…, không nhảy cóc) → mỗi dạng có 3 chức năng: Đọc lý
--   thuyết · Luyện tập (batch 10 câu, VÔ HẠN, KHÔNG tính mastery) · Làm bài Test (1 lượt
--   10 câu, CÓ tính mastery — quyết định mở dạng kế tiếp). Cả 3 không khoá lẫn nhau
--   trong CÙNG 1 dạng (CEO không yêu cầu ép đọc lý thuyết trước) — chỉ khoá GIỮA các
--   dạng (dạng N+1 chỉ mở khi dạng N đã có bài test đã nộp).
--
-- KIẾN TRÚC — tái dùng tối đa, không xây trùng:
--   · Sinh câu luyện tập/test = GENERALIZE `tu_luyen_chu_de_sinh` (mig 202609191417)
--     thêm p_loai — cùng engine rải cụm/MCQ-only/chống lặp, chỉ đổi loai bai_test ghi ra.
--     Luyện tập & test CHUNG 1 sổ tu_luyen_dang_lan với "Tự luyện theo chủ đề" — coverage
--     %, chống lặp câu tính GỘP mọi nguồn, đúng tinh thần "đã luyện qua dạng này".
--   · "Xong dạng" = TRIGGER tự ghi khi bai_lam.trang_thai→'da_nop' (pure-derive, không
--     RPC riêng để client gọi báo "tôi nộp rồi" — tránh lệch nếu client quên gọi).
--   · Loại 'htd_luyen' bị loại khỏi mastery bằng cách sửa hs_dang_evals (nguồn DUY NHẤT
--     dữ liệu thô mastery — CLAUDE.md §2.0, không port công thức riêng).
--
-- MẤT GÌ: không mất — chỉ ADD COLUMN/thêm giá trị CHECK/CREATE TABLE mới + sửa 2 hàm
--   (thêm tham số có default, thêm 1 điều kiện lọc). Không drop/delete gì.
-- ============================================================================

-- ── ① Nới CHECK bai_test.loai — 2 loại mới cho Học từ đầu ──────────────────
alter table bai_test drop constraint bai_test_loai_check;
alter table bai_test add constraint bai_test_loai_check
  check (loai in ('et','btvn','giao_trinh','de_thi','tu_luyen','bo_tro','bo_tro_test','retest','htd_luyen','htd_test'));

-- ── ② Sổ tiến độ Học từ đầu — 1 dòng/(HS×môn×dạng) ──────────────────────────
create table if not exists hoc_tu_dau_dang (
  id uuid primary key default gen_random_uuid(),
  hoc_sinh_id uuid not null references hoc_sinh(id),
  mon text not null,
  ma_dang text not null,
  doc_ly_thuyet_at timestamptz,
  test_bai_test_id uuid,
  test_nop_at timestamptz,
  created_at timestamptz not null default now(),
  unique (hoc_sinh_id, mon, ma_dang)
);
comment on table hoc_tu_dau_dang is
  'Tiến độ "Học từ đầu" theo (HS, môn, dạng). test_nop_at set = "xong dạng" (đủ ĐK mở dạng kế tiếp trong chuyên đề + tính xong bổ trợ đuổi) — TỰ GHI qua trigger khi nộp bài, không qua RPC client gọi tay.';
create index if not exists hoc_tu_dau_dang_hs_idx on hoc_tu_dau_dang (hoc_sinh_id, mon);

alter table hoc_tu_dau_dang enable row level security;
drop policy if exists hoc_tu_dau_dang_staff on hoc_tu_dau_dang;
create policy hoc_tu_dau_dang_staff on hoc_tu_dau_dang for all to authenticated
  using (la_thanh_vien()) with check (la_thanh_vien());
-- Không có policy cho HS trực tiếp — chỉ qua RPC security definer (đồng bộ pattern tu_luyen_dang_lan).

-- ── ③ Generalize tu_luyen_chu_de_sinh — thêm p_loai (mặc định 'tu_luyen', KHÔNG đổi
--    hành vi cũ khi gọi không truyền) ──────────────────────────────────────────────
create or replace function public.tu_luyen_chu_de_sinh(p_mon text, p_ma_dang text, p_loai text default 'tu_luyen')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_lop uuid;
  v_bt_id uuid;
  v_nhanh text := case when p_ma_dang like 'GT%' then 'hinh_gt' else null end;
  v_cautbl text := public._kho_cau_tbl(p_mon, v_nhanh);
  v_lttbl text := public._kho_lt_tbl(p_mon, v_nhanh);
  v_dk text := public._kho_dk_online_hs_sql(v_cautbl);
  v_thu_tu integer := 0;
  v_lan_thu integer;
  v_used_batch text[] := '{}';
  v_used_cum text[] := '{}';
  v_ma_cau text;
  v_cum text;
  v_ok_count integer := 0;
  i integer;
begin
  if p_loai not in ('tu_luyen', 'htd_luyen', 'htd_test') then
    raise exception 'tu_luyen_chu_de_sinh: loai % không hợp lệ', p_loai;
  end if;
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  select lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
    order by hl.ngay_vao desc limit 1;
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;

  select coalesce(max(lan_thu), 0) + 1 into v_lan_thu
    from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon and ma_dang = p_ma_dang;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
    values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, p_loai, p_mon, 0, 'mo')
    returning id into v_bt_id;

  for i in 1..10 loop
    v_thu_tu := v_thu_tu + 1;
    v_ma_cau := null; v_cum := null;

    execute format($q$
      select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
      where c.dang_chinh = $1 and c.xoa_at is null and %2$s
        and c.ma_cau <> all($2)
        and coalesce(c.ma_cum, c.ma_cau) <> all($3)
        and c.ma_cau not in (
          select ma_cau from tu_luyen_dang_lan
          where hoc_sinh_id = $4 and mon = $5 and ma_dang = $1 and lan_thu > $6 - 10)
      order by random() limit 1
    $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_used_cum, v_hs, p_mon, v_lan_thu;

    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
          and c.ma_cau not in (
            select ma_cau from tu_luyen_dang_lan
            where hoc_sinh_id = $3 and mon = $4 and ma_dang = $1 and lan_thu > $5 - 10)
        order by random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch, v_hs, p_mon, v_lan_thu;
    end if;

    if v_ma_cau is null then
      execute format($q$
        select c.ma_cau, coalesce(c.ma_cum, c.ma_cau) from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and %2$s
          and c.ma_cau <> all($2)
        order by random() limit 1
      $q$, v_cautbl, v_dk) into v_ma_cau, v_cum using p_ma_dang, v_used_batch;
    end if;

    if v_ma_cau is null then
      v_thu_tu := v_thu_tu - 1;
      exit;
    end if;

    v_used_batch := v_used_batch || v_ma_cau;
    v_used_cum := v_used_cum || v_cum;
    perform public._kho_snapshot_cau(v_bt_id, v_cautbl, v_lttbl, v_ma_cau, v_thu_tu, null);

    insert into tu_luyen_dang_lan (hoc_sinh_id, mon, ma_dang, lan_thu, ma_cau, bai_test_id)
      values (v_hs, p_mon, p_ma_dang, v_lan_thu, v_ma_cau, v_bt_id);

    v_ok_count := v_ok_count + 1;
  end loop;

  if v_ok_count = 0 then
    raise exception 'Kho câu tạm hết cho dạng này — thử lại sau nhé.';
  end if;

  update bai_test set so_cau = v_ok_count where id = v_bt_id;
  return jsonb_build_object('bai_test_id', v_bt_id, 'them', v_ok_count, 'tong', v_ok_count);
end $$;
grant execute on function public.tu_luyen_chu_de_sinh(text, text, text) to authenticated;

-- ── ④ Có case bổ trợ đuổi đang mở cho môn này không (gate hiện ô "Học từ đầu") ──
create or replace function public.htd_co_mo(p_mon text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from bo_tro_duoi bd
    join bo_tro_duoi_dang bdd on bdd.bo_tro_duoi_id = bd.id
    where bd.hoc_sinh_id = public.my_hoc_sinh_id() and bd.trang_thai = 'can_duoi'
      and (
        (p_mon = 'KHTN' and exists (select 1 from khtn_ban_do b where b.ma_dang = bdd.ma_dang))
        or (p_mon <> 'KHTN' and exists (
          select 1 from dai_ban_do b where b.ma_dang = bdd.ma_dang
          union all select 1 from hgt_ban_do b where b.ma_dang = bdd.ma_dang))
      )
  )
$$;
grant execute on function public.htd_co_mo(text) to authenticated;
revoke execute on function public.htd_co_mo(text) from anon;

-- ── ⑤ Lộ trình: chuyên đề + dạng tuần tự (chỉ chuyên đề liên quan case đang mở) ──
-- "Liên quan" = chứa ÍT NHẤT 1 ma_dang trong bo_tro_duoi_dang của case. Với MỖI chuyên
-- đề như vậy, trả ĐỦ mọi dạng từ STT 1 (không chỉ các dạng học thuật liệt kê rải rác) —
-- đúng luật CEO "phải học từ đầu chuyên đề", không phụ thuộc học thuật liệt kê đủ hay
-- thiếu ở bo_tro_duoi_dang.
create or replace function public.htd_lo_trinh(p_mon text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_dang_can text[];
  v_dk text;
  v_part jsonb;
  v_out jsonb := '[]'::jsonb;
begin
  if v_hs is null then return '[]'::jsonb; end if;
  select coalesce(array_agg(distinct bdd.ma_dang), '{}') into v_dang_can
    from bo_tro_duoi bd join bo_tro_duoi_dang bdd on bdd.bo_tro_duoi_id = bd.id
    where bd.hoc_sinh_id = v_hs and bd.trang_thai = 'can_duoi';
  if array_length(v_dang_can, 1) is null then return '[]'::jsonb; end if;

  if p_mon = 'KHTN' then
    v_dk := public._kho_dk_online_hs_sql('khtn_cau_hoi');
    execute format($q$
      select coalesce(jsonb_agg(jsonb_build_object(
        'ma_chuyen_de', bd.ma_chuyen_de, 'ten_chuyen_de', bd.ten_chuyen_de,
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang,
        'tong_cau', c.tong_cau
      ) order by bd.ma_dang), '[]'::jsonb)
      from khtn_ban_do bd
      join lateral (select count(*) as tong_cau from khtn_cau_hoi c where c.dang_chinh = bd.ma_dang and c.xoa_at is null and %s) c on true
      where bd.ma_chuyen_de in (select distinct ma_chuyen_de from khtn_ban_do where ma_dang = any($1))
    $q$, v_dk) into v_part using v_dang_can;
    v_out := v_part;
  else
    v_dk := public._kho_dk_online_hs_sql('dai_cau_hoi');
    execute format($q$
      select coalesce(jsonb_agg(jsonb_build_object(
        'ma_chuyen_de', bd.ma_chuyen_de, 'ten_chuyen_de', bd.ten_chuyen_de,
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang,
        'tong_cau', c.tong_cau
      ) order by bd.ma_dang), '[]'::jsonb)
      from dai_ban_do bd
      join lateral (select count(*) as tong_cau from dai_cau_hoi c where c.dang_chinh = bd.ma_dang and c.xoa_at is null and %s) c on true
      where bd.ma_chuyen_de in (select distinct ma_chuyen_de from dai_ban_do where ma_dang = any($1))
    $q$, v_dk) into v_part using v_dang_can;
    v_out := v_out || v_part;

    v_dk := public._kho_dk_online_hs_sql('hgt_cau_hoi');
    execute format($q$
      select coalesce(jsonb_agg(jsonb_build_object(
        'ma_chuyen_de', bd.ma_chuyen_de, 'ten_chuyen_de', bd.ten_chuyen_de,
        'ma_dang', bd.ma_dang, 'ten_dang', bd.ten_dang,
        'tong_cau', c.tong_cau
      ) order by bd.ma_dang), '[]'::jsonb)
      from hgt_ban_do bd
      join lateral (select count(*) as tong_cau from hgt_cau_hoi c where c.dang_chinh = bd.ma_dang and c.xoa_at is null and %s) c on true
      where bd.ma_chuyen_de in (select distinct ma_chuyen_de from hgt_ban_do where ma_dang = any($1))
    $q$, v_dk) into v_part using v_dang_can;
    v_out := v_out || v_part;
  end if;

  -- Gắn tiến độ CỦA CHÍNH HS (bảng cố định, không cần dynamic SQL).
  select coalesce(jsonb_agg(
    x || jsonb_build_object(
      'doc_ly_thuyet', (htd.doc_ly_thuyet_at is not null),
      'xong', (htd.test_nop_at is not null)
    )
    order by x->>'ma_chuyen_de', x->>'ma_dang'
  ), '[]'::jsonb)
  into v_out
  from jsonb_array_elements(v_out) x
  left join hoc_tu_dau_dang htd
    on htd.hoc_sinh_id = v_hs and htd.mon = p_mon and htd.ma_dang = x->>'ma_dang';

  return v_out;
end $$;
grant execute on function public.htd_lo_trinh(text) to authenticated;
revoke execute on function public.htd_lo_trinh(text) from anon;

-- ── ⑥ Lý thuyết 1 dạng (HS đọc) — ghi nhận đã đọc luôn (upsert, không chặn ai) ──
create or replace function public.htd_ly_thuyet(p_mon text, p_ma_dang text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_nhanh text := case when p_ma_dang like 'GT%' then 'hinh_gt' else null end;
  v_lttbl text := public._kho_lt_tbl(p_mon, v_nhanh);
  v_row record;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  execute format($q$select noi_dung, file_url from %1$I where ma_dang = $1$q$, v_lttbl) into v_row using p_ma_dang;

  insert into hoc_tu_dau_dang (hoc_sinh_id, mon, ma_dang, doc_ly_thuyet_at)
    values (v_hs, p_mon, p_ma_dang, now())
    on conflict (hoc_sinh_id, mon, ma_dang) do update set doc_ly_thuyet_at = now();

  return jsonb_build_object('noi_dung', coalesce(v_row.noi_dung, ''), 'file_url', v_row.file_url);
end $$;
grant execute on function public.htd_ly_thuyet(text, text) to authenticated;
revoke execute on function public.htd_ly_thuyet(text, text) from anon;

-- ── ⑦ Trigger: nộp bài loai=htd_test → TỰ GHI "xong dạng" (pure-derive, không RPC riêng) ──
create or replace function public.trg_htd_test_nop() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_bt record;
  v_ma_dang text;
begin
  select mon, loai, hoc_sinh_id into v_bt from bai_test where id = new.bai_test_id;
  if v_bt.loai <> 'htd_test' or v_bt.hoc_sinh_id is null then return new; end if;
  select ma_dang into v_ma_dang from bai_test_cau where bai_test_id = new.bai_test_id limit 1;
  if v_ma_dang is null then return new; end if;

  insert into hoc_tu_dau_dang (hoc_sinh_id, mon, ma_dang, test_bai_test_id, test_nop_at)
    values (v_bt.hoc_sinh_id, v_bt.mon, v_ma_dang, new.bai_test_id, new.nop_at)
    on conflict (hoc_sinh_id, mon, ma_dang) do update
      set test_bai_test_id = excluded.test_bai_test_id, test_nop_at = excluded.test_nop_at;
  return new;
end $$;

drop trigger if exists trg_htd_test_nop on bai_lam;
create trigger trg_htd_test_nop after update of trang_thai on bai_lam
  for each row when (new.trang_thai = 'da_nop')
  execute function public.trg_htd_test_nop();

-- ── ⑧ Loại 'htd_luyen' khỏi mastery — hs_dang_evals là NGUỒN THÔ DUY NHẤT (§2.0) ──
-- Luyện tập Học từ đầu KHÔNG tính mastery (CEO chốt) — chỉ test (htd_test) tính, rơi
-- vào nhánh else hiện có (giống btvn/giao_trinh) nên không cần sửa gì thêm cho nó.
create or replace function public.hs_dang_evals(p_mon text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_out jsonb;
begin
  if v_hs is null then return '[]'::jsonb; end if;
  if p_mon = 'KHTN' then
    select coalesce(jsonb_agg(x), '[]'::jsonb) into v_out from (
      select p.ma_dang, (case g.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric as value,
             g.graded_at as t, p.phase as src, bd.ten_dang, bd.ten_chuyen_de, bd.muc_do
      from gami_grades g
      join gami_session_problems p on p.id = g.problem_id
      join buoi_hoc b on b.id = p.buoi_hoc_id
      left join lop l on l.id = b.lop_id
      left join khtn_ban_do bd on bd.ma_dang = p.ma_dang
      where g.hoc_sinh_id = v_hs and p.phase in ('et','mt','btvn') and (l.mon = 'KHTN' or l.mon is null)

      union all
      select bc.ma_dang, (case blc.verdict when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             blc.cham_at, (case when bt.loai in ('et','de_thi') then 'et' when bt.loai = 'tu_luyen' then 'tu_luyen' else 'btvn' end),
             bd.ten_dang, bd.ten_chuyen_de, bd.muc_do
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test_cau bc on bc.id = blc.bai_test_cau_id
      join bai_test bt on bt.id = bl.bai_test_id
      left join khtn_ban_do bd on bd.ma_dang = bc.ma_dang
      where bl.hoc_sinh_id = v_hs and blc.verdict is not null and bt.mon = 'KHTN'
        and (bt.loai not in ('et','de_thi') or bl.trang_thai = 'da_nop')
        and bt.loai <> 'htd_luyen'

      union all
      select bg.ma_dang, (case bg.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             bg.graded_at, 'bt', bd.ten_dang, bd.ten_chuyen_de, bd.muc_do
      from bt_grades bg
      join tai_lieu tl on tl.id = bg.tai_lieu_id
      left join khtn_ban_do bd on bd.ma_dang = bg.ma_dang
      where tl.hoc_sinh_id = v_hs and tl.mon = 'KHTN'
    ) x;
  else
    select coalesce(jsonb_agg(x), '[]'::jsonb) into v_out from (
      select p.ma_dang, (case g.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric as value,
             g.graded_at as t, p.phase as src,
             coalesce(bd_dai.ten_dang, bd_hgt.ten_dang) as ten_dang,
             coalesce(bd_dai.ten_chuyen_de, bd_hgt.ten_chuyen_de) as ten_chuyen_de,
             coalesce(bd_dai.muc_do, bd_hgt.muc_do) as muc_do
      from gami_grades g
      join gami_session_problems p on p.id = g.problem_id
      join buoi_hoc b on b.id = p.buoi_hoc_id
      left join lop l on l.id = b.lop_id
      left join dai_ban_do bd_dai on bd_dai.ma_dang = p.ma_dang
      left join hgt_ban_do bd_hgt on bd_hgt.ma_dang = p.ma_dang
      where g.hoc_sinh_id = v_hs and p.phase in ('et','mt','btvn') and (l.mon = 'Toán' or l.mon is null)

      union all
      select bc.ma_dang, (case blc.verdict when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             blc.cham_at, (case when bt.loai in ('et','de_thi') then 'et' when bt.loai = 'tu_luyen' then 'tu_luyen' else 'btvn' end),
             coalesce(bd_dai.ten_dang, bd_hgt.ten_dang),
             coalesce(bd_dai.ten_chuyen_de, bd_hgt.ten_chuyen_de),
             coalesce(bd_dai.muc_do, bd_hgt.muc_do)
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test_cau bc on bc.id = blc.bai_test_cau_id
      join bai_test bt on bt.id = bl.bai_test_id
      left join dai_ban_do bd_dai on bd_dai.ma_dang = bc.ma_dang
      left join hgt_ban_do bd_hgt on bd_hgt.ma_dang = bc.ma_dang
      where bl.hoc_sinh_id = v_hs and blc.verdict is not null and bt.mon = 'Toán'
        and (bt.loai not in ('et','de_thi') or bl.trang_thai = 'da_nop')
        and bt.loai <> 'htd_luyen'

      union all
      select bg.ma_dang, (case bg.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             bg.graded_at, 'bt',
             coalesce(bd_dai.ten_dang, bd_hgt.ten_dang),
             coalesce(bd_dai.ten_chuyen_de, bd_hgt.ten_chuyen_de),
             coalesce(bd_dai.muc_do, bd_hgt.muc_do)
      from bt_grades bg
      join tai_lieu tl on tl.id = bg.tai_lieu_id
      left join dai_ban_do bd_dai on bd_dai.ma_dang = bg.ma_dang
      left join hgt_ban_do bd_hgt on bd_hgt.ma_dang = bg.ma_dang
      where tl.hoc_sinh_id = v_hs and tl.mon = 'Toán'
    ) x;
  end if;
  return v_out;
end $$;
grant execute on function public.hs_dang_evals(text) to authenticated;
