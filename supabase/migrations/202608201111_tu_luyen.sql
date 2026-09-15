-- ============================================================================
-- TỰ LUYỆN — spec Thùy 18-20/08:
--   · Mỗi ngày HS mở "Tự luyện" → hệ tự sinh 10 câu (không cron — pure-derive lúc mở, giống
--     mo_bai_lam của ET/BTVN). Làm thêm được, tối đa 30 câu/ngày.
--   · 10 câu: mỗi câu ĐỘC LẬP có 40% rơi vào "ngẫu nhiên trong các dạng ĐÃ HỌC" (toàn bộ từ
--     đầu, không giới hạn thời gian) · 60% rơi vào "các dạng đang YẾU" (nửa dưới khi xếp theo
--     điểm mastery — không đòi hỏi phải có dạng nào chính thức 'yếu', luôn có nhóm để rút).
--   · Cấp 1: tính THẲNG vào mastery hệ số 1 (không có kênh nào khác để đối chiếu). Cấp 3: chỉ
--     gộp ở mastery-view của HS (loai='tu_luyen' tách biệt để mastery TRUNG TÂM lọc ra được).
--   · Chống lặp câu: 1 câu ở dạng X ra lần thứ N thì lần TIẾP THEO của dạng X phải là lần N+10
--     mới được lặp lại. Kho hết câu mới chấp nhận lặp sớm hơn.
--
-- KIẾN TRÚC — tái dùng NGUYÊN bai_test/bai_test_cau/bai_lam/bai_lam_cau (mastery.ts đã đọc
-- bai_lam_cau làm nguồn đo chung, KHÔNG cần sửa gì để nhận thêm tu_luyen). Khác 1 điểm: ET/BTVN
-- là test DÙNG CHUNG cho cả lớp (1 lop_id × 1 ngay); tu_luyen là bài CÁ NHÂN HOÁ (1 hoc_sinh_id
-- × 1 ngay) — thêm cột `bai_test.hoc_sinh_id` (NULL cho mọi loại khác) thay vì tách bảng riêng.
--
-- ⭐ KHÔNG PORT LẠI CÔNG THỨC MASTERY SANG SQL. `masteryOfDang` (gami/mastery.js) là NGUỒN DUY
-- NHẤT — RPC `hs_dang_evals` chỉ trả DỮ LIỆU THÔ (đúng data HS được phép thấy: điểm đúng/sai của
-- CHÍNH mình), client dùng lại pure function `masteryOfDang` y hệt màn Thông tin học tập sẽ dùng
-- sau này. Xếp dạng/chọn dạng random ở CLIENT (không nhạy cảm — chỉ là tên dạng + điểm của chính
-- HS). Chỉ bước ĐỘNG TỚI NỘI DUNG CÂU (kho staff-only) mới cần RPC thứ hai, `tu_luyen_sinh`.
-- ============================================================================

-- ── ① bai_test: thêm hoc_sinh_id + nới loai ────────────────────────────────────
alter table bai_test add column if not exists hoc_sinh_id uuid references hoc_sinh(id);
comment on column bai_test.hoc_sinh_id is
  'CHỈ set cho loai=tu_luyen — bài cá nhân hoá, không dùng chung cả lớp như ET/BTVN/giáo trình.';

alter table bai_test drop constraint if exists bai_test_loai_check;
alter table bai_test add constraint bai_test_loai_check check (loai in ('et', 'btvn', 'giao_trinh', 'de_thi', 'tu_luyen'));

-- 1 HS × 1 môn × 1 ngày = ĐÚNG 1 bai_test loai=tu_luyen (khác ET/BTVN vốn unique theo lop_id+ngay+doc,
-- tu_luyen không theo lop). Chặn 2 lượt gọi RPC gần-đồng-thời tạo trùng dòng (bài học "ensure* slot
-- phải unique" — StrictMode/bấm đúp là ca thật đã dính ở moBaiLam).
create unique index if not exists bai_test_tu_luyen_uniq on bai_test (hoc_sinh_id, mon, ngay) where loai = 'tu_luyen';

-- ── ② RLS: tu_luyen scope theo hoc_sinh_id (KHÔNG theo lop_id — 1 lớp nhiều HS, mỗi em 1 bài) ──
drop policy if exists bai_test_hs_read on bai_test;
create policy bai_test_hs_read on bai_test for select to authenticated
  using (
    (loai <> 'tu_luyen' and hs_o_lop(lop_id))
    or (loai = 'tu_luyen' and hoc_sinh_id = my_hoc_sinh_id())
  );

drop policy if exists bai_test_cau_hs_read on bai_test_cau;
create policy bai_test_cau_hs_read on bai_test_cau for select to authenticated
  using (exists (
    select 1 from bai_test bt where bt.id = bai_test_cau.bai_test_id
      and bt.loai not in ('et', 'de_thi')
      and (
        (bt.loai <> 'tu_luyen' and hs_o_lop(bt.lop_id))
        or (bt.loai = 'tu_luyen' and bt.hoc_sinh_id = my_hoc_sinh_id())
      )
  ));
-- bai_lam/bai_lam_cau: policy hiện có đã scope hoc_sinh_id = my_hoc_sinh_id() thẳng (không qua
-- lop) — tu_luyen dùng NGUYÊN, không cần sửa.

-- ── ③ Sổ chống lặp câu theo dạng (10 lần) ──────────────────────────────────────
create table if not exists tu_luyen_dang_lan (
  id          uuid primary key default gen_random_uuid(),
  hoc_sinh_id uuid not null references hoc_sinh(id),
  mon         text not null,
  ma_dang     text not null,
  lan_thu     integer not null,
  ma_cau      text not null,
  bai_test_id uuid not null references bai_test(id) on delete cascade,
  tao_at      timestamptz not null default now()
);
create index if not exists tu_luyen_dang_lan_hs_dang_idx
  on tu_luyen_dang_lan (hoc_sinh_id, mon, ma_dang, lan_thu desc);
comment on table tu_luyen_dang_lan is
  'Vết mỗi câu tự luyện đã ra cho HS, theo (dạng, lần thứ mấy) — để chặn lặp trong 10 lần liên tiếp của CÙNG 1 dạng.';

alter table tu_luyen_dang_lan enable row level security;
drop policy if exists tu_luyen_dang_lan_staff on tu_luyen_dang_lan;
create policy tu_luyen_dang_lan_staff on tu_luyen_dang_lan for all to authenticated
  using (la_thanh_vien()) with check (la_thanh_vien());
-- KHÔNG có policy cho HS — chỉ RPC (security definer) đọc/ghi; HS không cần xem sổ này trực tiếp.

-- ── ④ Dispatch môn → bảng kho (mirror khoCuaMon() TS, chỉ trả TÊN bảng — không dynamic SQL ở đây) ──
create or replace function public._kho_ban_do_tbl(p_mon text, p_nhanh text default null)
returns text language sql immutable as $$
  select case when p_mon = 'KHTN' then 'khtn_ban_do'
              when p_nhanh = 'hinh_gt' then 'hgt_ban_do'
              else 'dai_ban_do' end
$$;
create or replace function public._kho_cau_tbl(p_mon text, p_nhanh text default null)
returns text language sql immutable as $$
  select case when p_mon = 'KHTN' then 'khtn_cau_hoi'
              when p_nhanh = 'hinh_gt' then 'hgt_cau_hoi'
              else 'dai_cau_hoi' end
$$;
create or replace function public._kho_lt_tbl(p_mon text, p_nhanh text default null)
returns text language sql immutable as $$
  select case when p_mon = 'KHTN' then 'khtn_dang_ly_thuyet'
              when p_nhanh = 'hinh_gt' then 'hgt_dang_ly_thuyet'
              else 'dai_dang_ly_thuyet' end
$$;

-- ── ⑤ RPC hs_dang_evals — DỮ LIỆU THÔ (không phải điểm đã tính) cho CHÍNH HS đang gọi ─────────
-- Mirror ĐÚNG data assembly của getMasteryHS/fetchOnlineEvals/fetchBTEvals (mastery.ts) — KHÔNG
-- lọc theo thời gian (CEO: "toàn bộ từ đầu"). Trả {ma_dang, value, t, src} — client tự chạy
-- masteryOfDang() (pure, y hệt bản TS đang dùng) để xếp dạng, không có công thức thứ hai nào.
create or replace function public.hs_dang_evals(p_mon text, p_nhanh text default null)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_bd text := public._kho_ban_do_tbl(p_mon, p_nhanh);
  v_out jsonb;
begin
  if v_hs is null then return '[]'::jsonb; end if;
  execute format($q$
    select coalesce(jsonb_agg(x), '[]'::jsonb) from (
      select p.ma_dang, (case g.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric as value,
             g.graded_at as t, p.phase as src
      from gami_grades g
      join gami_session_problems p on p.id = g.problem_id
      join %1$I bd on bd.ma_dang = p.ma_dang
      where g.hoc_sinh_id = $1 and p.phase in ('et','mt','btvn')

      union all
      select bc.ma_dang, (case blc.verdict when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             blc.cham_at, (case when bt.loai in ('et','de_thi') then 'et' else 'btvn' end)
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test_cau bc on bc.id = blc.bai_test_cau_id
      join bai_test bt on bt.id = bl.bai_test_id
      join %1$I bd2 on bd2.ma_dang = bc.ma_dang
      where bl.hoc_sinh_id = $1 and blc.verdict is not null and bt.mon = $2
        and (bt.loai not in ('et','de_thi') or bl.trang_thai = 'da_nop')

      union all
      select bg.ma_dang, (case bg.result when 'correct' then 1 when 'partial' then 0.5 else 0 end)::numeric,
             bg.graded_at, 'bt'
      from bt_grades bg
      join tai_lieu tl on tl.id = bg.tai_lieu_id
      join %1$I bd3 on bd3.ma_dang = bg.ma_dang
      where tl.hoc_sinh_id = $1 and tl.mon = $2
    ) x
  $q$, v_bd)
  into v_out using v_hs, p_mon;
  return v_out;
end $$;
grant execute on function public.hs_dang_evals(text, text) to authenticated;

-- ── ⑥ RPC tu_luyen_sinh — HS đã CHỌN xong dạng (client, từ evals ở ⑤) → server chọn CÂU + snapshot.
-- p_dangs = mảng ma_dang (độ dài = số câu muốn sinh đợt này, vd 10 lần đầu / thêm ≤20 sau đó).
-- Trả bai_test (id, so_cau, ngay) sau khi APPEND xong. Chặn vượt trần 30 câu/ngày (transaction —
-- không có khe hở 2 request cùng lúc vượt trần: update...where so_cau+... <=30 atomic).
create or replace function public.tu_luyen_sinh(p_mon text, p_dangs jsonb, p_nhanh text default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_hs uuid := public.my_hoc_sinh_id();
  v_lop uuid;
  v_bt_id uuid;
  v_so_cau_cu integer;
  v_them integer := jsonb_array_length(p_dangs);
  v_cautbl text := public._kho_cau_tbl(p_mon, p_nhanh);
  v_lttbl text := public._kho_lt_tbl(p_mon, p_nhanh);
  v_thu_tu integer;
  v_ma_dang text;
  v_lan_thu integer;
  v_used_batch text[] := '{}';
  v_ma_cau text;
  v_row record;
  v_ly_thuyet text;
  v_ok_count integer := 0;
begin
  if v_hs is null then raise exception 'Không xác định được học sinh.'; end if;
  if v_them is null or v_them = 0 then raise exception 'Không có dạng nào để sinh.'; end if;

  select lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = v_hs and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
    order by hl.ngay_vao desc limit 1;
  if v_lop is null then raise exception 'Học sinh chưa ghi danh lớp môn %.', p_mon; end if;

  -- FOR UPDATE: khoá dòng nếu đã có — chặn 2 lượt "làm thêm" bấm gần như đồng thời cùng đọc so_cau
  -- CŨ rồi cùng vượt trần 30 (race). Bấm 2 lần thật nhanh giờ tuần tự hoá, lượt sau thấy so_cau MỚI.
  select id, so_cau into v_bt_id, v_so_cau_cu from bai_test
    where hoc_sinh_id = v_hs and mon = p_mon and loai = 'tu_luyen'
      and ngay = (now() at time zone 'Asia/Ho_Chi_Minh')::date
    for update;

  if v_bt_id is null then
    if v_them > 30 then raise exception 'Tối đa 30 câu/ngày.'; end if;
    begin
      insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai)
        values (null, v_lop, v_hs, (now() at time zone 'Asia/Ho_Chi_Minh')::date, 'tu_luyen', p_mon, 0, 'mo')
        returning id, so_cau into v_bt_id, v_so_cau_cu;
    exception when unique_violation then
      -- 2 lượt gọi gần-đồng-thời cùng thấy "chưa có" (race) — lượt thua re-SELECT + khoá dòng lượt
      -- thắng vừa tạo, tiếp tục như đường APPEND bình thường thay vì lỗi ra ngoài.
      select id, so_cau into v_bt_id, v_so_cau_cu from bai_test
        where hoc_sinh_id = v_hs and mon = p_mon and loai = 'tu_luyen'
          and ngay = (now() at time zone 'Asia/Ho_Chi_Minh')::date
        for update;
      if v_so_cau_cu + v_them > 30 then
        raise exception 'Đã làm % câu hôm nay — tối đa 30 câu/ngày, chỉ sinh thêm được %.', v_so_cau_cu, greatest(30 - v_so_cau_cu, 0);
      end if;
    end;
  else
    if v_so_cau_cu + v_them > 30 then
      raise exception 'Đã làm % câu hôm nay — tối đa 30 câu/ngày, chỉ sinh thêm được %.', v_so_cau_cu, greatest(30 - v_so_cau_cu, 0);
    end if;
  end if;

  v_thu_tu := v_so_cau_cu;
  for v_ma_dang in select jsonb_array_elements_text(p_dangs) loop
    v_thu_tu := v_thu_tu + 1;

    select coalesce(max(lan_thu), 0) + 1 into v_lan_thu
      from tu_luyen_dang_lan where hoc_sinh_id = v_hs and mon = p_mon and ma_dang = v_ma_dang;

    -- Ứng viên: chưa dùng trong 9 lần gần nhất của CHÍNH dạng này, VÀ chưa dùng trong đợt này (v_used_batch).
    -- Chỉ câu HỖ TRỢ CHẤM ONLINE (TN/ĐS/TLN có đáp án) — cùng tập SUPPORTED của testonline.ts,
    -- tránh chọn câu tự luận/thiếu đáp án thành câu KHÔNG chấm được.
    v_ma_cau := null;
    execute format($q$
      select ma_cau from %1$I
      where dang_chinh = $1 and xoa_at is null
        and (
          (loai_cau in ('trac_nghiem','tra_loi_ngan') and dap_an is not null)
          or (loai_cau = 'dung_sai' and jsonb_array_length(coalesce(menh_de,'[]'::jsonb)) >= 2)
        )
        and ma_cau <> all($2)
        and ma_cau not in (
          select ma_cau from tu_luyen_dang_lan
          where hoc_sinh_id = $3 and mon = $4 and ma_dang = $1 and lan_thu > $5 - 10
        )
      order by random() limit 1
    $q$, v_cautbl)
    into v_ma_cau using v_ma_dang, v_used_batch, v_hs, p_mon, v_lan_thu;

    -- Hết ứng viên tránh-lặp → CHẤP NHẬN LẶP (CEO chốt), chỉ né trùng NGAY TRONG đợt này.
    if v_ma_cau is null then
      execute format($q$
        select ma_cau from %1$I
        where dang_chinh = $1 and xoa_at is null
          and (
          (loai_cau in ('trac_nghiem','tra_loi_ngan') and dap_an is not null)
          or (loai_cau = 'dung_sai' and jsonb_array_length(coalesce(menh_de,'[]'::jsonb)) >= 2)
        )
          and ma_cau <> all($2)
        order by random() limit 1
      $q$, v_cautbl)
      into v_ma_cau using v_ma_dang, v_used_batch;
    end if;

    -- Dạng không có câu nào trong kho (hiếm) → BỎ RIÊNG slot này, không suy đoán (§1.5).
    if v_ma_cau is null then
      v_thu_tu := v_thu_tu - 1;
      continue;
    end if;

    v_used_batch := v_used_batch || v_ma_cau;

    execute format($q$select * from %1$I where ma_cau = $1$q$, v_cautbl) into v_row using v_ma_cau;

    v_ly_thuyet := null;
    execute format($q$select noi_dung from %1$I where ma_dang = $1$q$, v_lttbl) into v_ly_thuyet using v_row.dang_chinh;

    insert into bai_test_cau (bai_test_id, thu_tu, bien_the, ma_cau, loai_cau, noi_dung, lua_chon,
      menh_de, dap_an_key, loi_giai, anh_de, anh_dap_an, ma_dang, ly_thuyet, diem)
    values (
      v_bt_id, v_thu_tu, 1, v_row.ma_cau, v_row.loai_cau, v_row.noi_dung, v_row.lua_chon, v_row.menh_de,
      case v_row.loai_cau
        when 'trac_nghiem' then to_jsonb(upper(trim(v_row.dap_an)))
        when 'tra_loi_ngan' then to_jsonb(trim(v_row.dap_an))
        when 'dung_sai' then (select jsonb_agg(case when upper(left(trim(m->>'dap_an'), 1)) = 'S' then 'S' else 'D' end)
                               from jsonb_array_elements(coalesce(v_row.menh_de, '[]'::jsonb)) m)
        else to_jsonb(v_row.dap_an)
      end,
      v_row.loi_giai, v_row.anh_de, v_row.anh_dap_an, v_row.dang_chinh, v_ly_thuyet, 1
    );

    insert into tu_luyen_dang_lan (hoc_sinh_id, mon, ma_dang, lan_thu, ma_cau, bai_test_id)
      values (v_hs, p_mon, v_ma_dang, v_lan_thu, v_ma_cau, v_bt_id);

    v_ok_count := v_ok_count + 1;
  end loop;

  update bai_test set so_cau = v_so_cau_cu + v_ok_count where id = v_bt_id;
  return jsonb_build_object('bai_test_id', v_bt_id, 'them', v_ok_count, 'tong', v_so_cau_cu + v_ok_count);
end $$;
grant execute on function public.tu_luyen_sinh(text, jsonb, text) to authenticated;
