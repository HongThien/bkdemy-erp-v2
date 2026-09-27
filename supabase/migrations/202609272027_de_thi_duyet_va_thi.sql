-- ============================================================================
-- ĐỀ THI — P2 Duyệt đề + P3 thi trên lớp (spec-de-thi.md §9, CEO "làm đi thôi" 27/09).
-- Mở rộng chế độ THI sẵn có của ET (et_de/et_nop/LamET) cho loai='de_thi', không xây luồng thi mới.
--   1. Vá RLS: HS đang SELECT thẳng được dap_an_key/loi_giai của đề thi (mig 202609030307 rơi 'de_thi').
--   2. Cột: dấu duyệt đề (+ log trigger) · điểm ghi đè theo phần/câu · thời gian làm bài · tiêu đề phần.
--   3. fn_de_thi_cau (1 chỗ resolve kho từng câu) · fn_de_thi_thieu (invariant) · fn_de_thi_duyet (1 cửa)
--      · fn_de_thi_mo (snapshot SQL, thay phatHanhTest client) · _et_cham (tách từ et_nop, giữ nguyên logic)
--      · et_nop đọc khoa_reveal · fn_de_thi_thu_bai · fn_de_thi_ket_qua · fn_de_thi_diem_cua_toi.
--   4. Trigger chặn HS ghi thẳng vào bài loại THI: sau khi nộp · quá giờ · tự ghi verdict/diem · sửa bat_dau_at.
-- ============================================================================

-- ── 1. Vá RLS bai_test_cau_hs_read — thêm 'de_thi' vào loại trừ, giữ nguyên phần còn lại ─────────────
drop policy if exists bai_test_cau_hs_read on public.bai_test_cau;
create policy bai_test_cau_hs_read on public.bai_test_cau for select to authenticated using (
  exists (select 1 from public.bai_test bt
          where bt.id = bai_test_cau.bai_test_id
            and bt.loai <> all (array['et', 'de_thi', 'bo_tro_test', 'retest'])
            and (public.hs_o_lop(bt.lop_id) or bt.hoc_sinh_id = public.my_hoc_sinh_id())
            and (bt.loai <> 'giao_trinh'
                 or public._btc_trang_thai(bai_test_cau.id, bai_test_cau.bai_test_id, bai_test_cau.ma_dang) <> 'chua')));

-- ── 2. Cột ──────────────────────────────────────────────────────────────────────────────────────────
alter table public.tai_lieu
  add column if not exists duyet_at  timestamptz,                               -- NULL: đề chưa có dấu duyệt / loại tài liệu khác
  add column if not exists duyet_boi uuid references public.nhan_su(id);
alter table public.tai_lieu_phan add column if not exists diem_moi_cau numeric;  -- NULL: theo khuôn Bộ theo loại câu
alter table public.tai_lieu_cau  add column if not exists diem numeric;          -- NULL: theo phần / khuôn Bộ
alter table public.bai_test add column if not exists thoi_gian_phut integer;      -- NULL: không giới hạn thời gian
alter table public.bai_test drop constraint if exists bai_test_thoi_gian_phut_check;
alter table public.bai_test add constraint bai_test_thoi_gian_phut_check check (thoi_gian_phut is null or thoi_gian_phut > 0);
alter table public.bai_test_cau add column if not exists phan text;               -- NULL: test không chia phần

create table if not exists public.tai_lieu_duyet_log (
  id          uuid primary key default gen_random_uuid(),
  tai_lieu_id uuid not null references public.tai_lieu(id) on delete cascade,
  duyet_cu    timestamptz,
  duyet_moi   timestamptz,
  nhan_su_id  uuid references public.nhan_su(id),
  at          timestamptz not null default now()
);
alter table public.tai_lieu_duyet_log enable row level security;
drop policy if exists tai_lieu_duyet_log_staff on public.tai_lieu_duyet_log;
create policy tai_lieu_duyet_log_staff on public.tai_lieu_duyet_log for select to authenticated using (public.la_thanh_vien());

create or replace function public._trg_tai_lieu_duyet_log() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.duyet_at is distinct from old.duyet_at then
    insert into tai_lieu_duyet_log (tai_lieu_id, duyet_cu, duyet_moi, nhan_su_id)
    values (new.id, old.duyet_at, new.duyet_at, public.current_nhan_su_id());
  end if;
  return new;
end $$;
drop trigger if exists trg_tai_lieu_duyet_log on public.tai_lieu;
create trigger trg_tai_lieu_duyet_log after update of duyet_at on public.tai_lieu
  for each row execute function public._trg_tai_lieu_duyet_log();

-- ── 2b. Form MCQ của kho HGT không snapshot được: bai_test_cau.form_tn_id có FK CHỈ tới dai_cau_form_tn ⇒ mọi câu
--        hgt có form đã duyệt đâm FK (chưa lộ vì trước 27/09 hgt có 0 form duyệt). Thêm cột riêng đúng tiền lệ
--        form_dien_id (FK hinh_form_dien) — KHÔNG gỡ FK cũ (Luật xoá), metric MCQ Đại đọc form_tn_id giữ nguyên.
alter table public.bai_test_cau add column if not exists form_tn_hgt_id uuid references public.hgt_cau_form_tn(id);

-- _kho_snapshot_cau: giữ nguyên thân (mig 202609080259), chỉ đổi 2 cột id form theo bảng form thật.
create or replace function public._kho_snapshot_cau(p_bt_id uuid, p_cautbl text, p_lttbl text, p_ma_cau text, p_thu_tu integer, p_ma_cum text default null)
returns void language plpgsql security definer set search_path = public as $function$
declare v_row record; v_ly_thuyet text; v_ftbl text; v_form_id uuid; v_form_lc jsonb; v_form_da text;
begin
  execute format($q$select * from %1$I where ma_cau = $1$q$, p_cautbl) into v_row using p_ma_cau;
  if v_row.ma_cau is null then raise exception 'Câu % không có trong %', p_ma_cau, p_cautbl; end if;
  execute format($q$select noi_dung from %1$I where ma_dang = $1$q$, p_lttbl) into v_ly_thuyet using v_row.dang_chinh;

  v_ftbl := public._kho_form_tn_cua(p_cautbl);
  if v_ftbl is not null then
    execute format($q$select id, lua_chon, dap_an from %1$I where ma_cau = $1 and da_duyet and xoa_at is null$q$, v_ftbl)
      into v_form_id, v_form_lc, v_form_da using p_ma_cau;
  end if;

  if v_form_id is not null then
    insert into bai_test_cau (bai_test_id, thu_tu, bien_the, ma_cau, loai_cau, noi_dung, lua_chon,
      menh_de, dap_an_key, loi_giai, anh_de, anh_dap_an, ma_dang, ly_thuyet, diem, ma_cum, form_tn_id, form_tn_hgt_id, lua_chon_rule)
    values (
      p_bt_id, p_thu_tu, 1, v_row.ma_cau, 'trac_nghiem', v_row.noi_dung,
      (select jsonb_agg(e->>'text' order by o) from jsonb_array_elements(v_form_lc) with ordinality t(e, o)),
      null, to_jsonb(v_form_da),
      v_row.loi_giai, v_row.anh_de, v_row.anh_dap_an, v_row.dang_chinh, v_ly_thuyet, 1,
      coalesce(p_ma_cum, v_row.ma_cum),
      case when v_ftbl = 'dai_cau_form_tn' then v_form_id end,
      case when v_ftbl = 'hgt_cau_form_tn' then v_form_id end,
      (select array_agg(case when (e->>'dung')::boolean then null else e->>'rule' end order by o)
         from jsonb_array_elements(v_form_lc) with ordinality t(e, o))
    );
    return;
  end if;

  insert into bai_test_cau (bai_test_id, thu_tu, bien_the, ma_cau, loai_cau, noi_dung, lua_chon,
    menh_de, dap_an_key, loi_giai, anh_de, anh_dap_an, ma_dang, ly_thuyet, diem, ma_cum)
  values (
    p_bt_id, p_thu_tu, 1, v_row.ma_cau, v_row.loai_cau, v_row.noi_dung, v_row.lua_chon, v_row.menh_de,
    case v_row.loai_cau
      when 'trac_nghiem' then to_jsonb(upper(trim(v_row.dap_an)))
      when 'tra_loi_ngan' then to_jsonb(trim(v_row.dap_an))
      when 'dung_sai' then (select jsonb_agg(case when upper(left(trim(m->>'dap_an'), 1)) = 'S' then 'S' else 'D' end)
                             from jsonb_array_elements(coalesce(v_row.menh_de, '[]'::jsonb)) m)
      else to_jsonb(v_row.dap_an)
    end,
    v_row.loi_giai, v_row.anh_de, v_row.anh_dap_an, v_row.dang_chinh, v_ly_thuyet, 1,
    coalesce(p_ma_cum, v_row.ma_cum)
  );
end $function$;

-- ── 3a. Kho của 1 câu trong tài liệu — đúng quy tắc khoCuaMon/nhanhByCau phía TS (tailieu.ts) ─────────
create or replace function public._de_thi_kho(p_cau_hinh jsonb, p_nhanh text, p_mon text, p_ma_cau text)
returns text language sql immutable as $$
  select case coalesce(nullif(p_cau_hinh -> 'nhanhByCau' ->> p_ma_cau, ''), p_nhanh)
           when 'hinh_gt'  then 'hgt'
           when 'hinh_hoc' then 'hinh_hoc'
           else case when p_mon = 'KHTN' then 'khtn' else 'dai' end
         end
$$;

-- ── 3b. Câu của đề theo thứ tự phần → câu, kèm điểm hiệu lực. MỌI hàm đề thi đọc qua đây. ────────────
create or replace function public.fn_de_thi_cau(p_de uuid)
returns table (stt int, phan_id uuid, phan_thu_tu int, phan_tieu_de text, ma_cau text, kho text,
               loai_cau text, dang_chinh text, dap_an text, lua_chon jsonb, menh_de jsonb,
               da_duyet boolean, xoa boolean, co_form boolean, form_duyet boolean, diem numeric)
language plpgsql stable set search_path = public as $$
#variable_conflict use_column
declare tl record; r record; v jsonb; n int := 0; v_form text;
begin
  select t.id, t.cau_hinh, t.nhanh, t.mon into tl from tai_lieu t where t.id = p_de and t.loai = 'de_thi';
  if tl.id is null then raise exception 'Không phải đề thi: %', p_de; end if;
  for r in
    select p.id pid, p.thu_tu ptt, p.tieu_de ptd, p.diem_moi_cau pdiem, c.ma_cau cma, c.diem cdiem
    from tai_lieu_phan p join tai_lieu_cau c on c.phan_id = p.id
    where p.tai_lieu_id = p_de and p.loai_phan = 'custom'
    order by p.thu_tu, c.thu_tu
  loop
    n := n + 1;
    stt := n; phan_id := r.pid; phan_thu_tu := r.ptt; phan_tieu_de := r.ptd; ma_cau := r.cma;
    kho := public._de_thi_kho(tl.cau_hinh, tl.nhanh, tl.mon, r.cma);
    v := null;
    if to_regclass('public.' || kho || '_cau_hoi') is not null then
      execute format('select to_jsonb(q) from %I q where q.ma_cau = $1', kho || '_cau_hoi') into v using r.cma;
    end if;
    xoa := v is null or (v ->> 'xoa_at') is not null;
    loai_cau := v ->> 'loai_cau'; dang_chinh := v ->> 'dang_chinh'; dap_an := v ->> 'dap_an';
    lua_chon := v -> 'lua_chon'; menh_de := v -> 'menh_de';
    da_duyet := coalesce((v ->> 'da_duyet')::boolean, false);
    co_form := false; form_duyet := false;
    v_form := public._kho_form_tn_cua(kho || '_cau_hoi');
    if v_form is not null then
      execute format('select count(*) > 0, coalesce(bool_or(f.da_duyet), false) from %I f where f.ma_cau = $1 and f.xoa_at is null', v_form)
        into co_form, form_duyet using r.cma;
    end if;
    diem := coalesce(r.cdiem, r.pdiem,
                     case loai_cau when 'trac_nghiem' then 0.25 when 'dung_sai' then 1 else 0.5 end);
    return next;
  end loop;
end $$;

-- ── 3c. Invariant "đề sẵn sàng": từng câu thiếu gì. chan = chặn duyệt/phát hành. ───────────────────────
create or replace function public.fn_de_thi_thieu(p_de uuid)
returns jsonb language sql stable set search_path = public as $$
  with c as (select * from public.fn_de_thi_cau(p_de)),
  l as (
    select c.stt, c.ma_cau, c.kho, c.loai_cau, c.phan_tieu_de,
      array_remove(array[
        case when c.xoa then 'cau_da_xoa' end,
        case when not c.xoa and (c.dang_chinh is null or public._kho_la_dang_cho(c.dang_chinh)) then 'dang_cho' end,
        case when not c.xoa and c.loai_cau = 'trac_nghiem'
                  and (upper(trim(coalesce(c.dap_an, ''))) not in ('A', 'B', 'C', 'D')) then 'thieu_dap_an' end,
        case when not c.xoa and c.loai_cau = 'trac_nghiem'
                  and coalesce(jsonb_array_length(case when jsonb_typeof(c.lua_chon) = 'array' then c.lua_chon end), 0) < 2 then 'thieu_phuong_an' end,
        case when not c.xoa and c.loai_cau = 'tra_loi_ngan' and trim(coalesce(c.dap_an, '')) = '' then 'thieu_dap_an' end,
        case when not c.xoa and c.loai_cau = 'tra_loi_ngan' and not c.co_form then 'tln_chua_mcq' end,
        case when not c.xoa and c.loai_cau = 'dung_sai'
                  and coalesce(jsonb_array_length(case when jsonb_typeof(c.menh_de) = 'array' then c.menh_de end), 0) < 2 then 'thieu_menh_de' end,
        case when not c.xoa and c.loai_cau = 'dung_sai' and exists (
                  select 1 from jsonb_array_elements(case when jsonb_typeof(c.menh_de) = 'array' then c.menh_de else '[]'::jsonb end) m
                  where upper(left(trim(coalesce(m ->> 'dap_an', '')), 1)) not in ('D', 'S')) then 'md_thieu_dap_an' end,
        case when not c.xoa and c.loai_cau = 'dung_sai' and exists (
                  select 1 from jsonb_array_elements(case when jsonb_typeof(c.menh_de) = 'array' then c.menh_de else '[]'::jsonb end) m
                  where m ->> 'ma_dang' is null or public._kho_la_dang_cho(m ->> 'ma_dang')) then 'md_dang_cho' end,
        case when not c.xoa and c.loai_cau not in ('trac_nghiem', 'dung_sai', 'tra_loi_ngan') then 'tu_luan_chi_in' end
      ], null) loi
    from c
  ),
  l2 as (select l.*, cardinality(array_remove(l.loi, 'tu_luan_chi_in')) > 0 chan from l)
  select jsonb_build_object(
    'tong', (select count(*) from c),
    'so_chan', count(*) filter (where l2.chan),
    'so_canh', count(*) filter (where 'tu_luan_chi_in' = any (l2.loi)),
    'cau', coalesce(jsonb_agg(jsonb_build_object(
             'stt', l2.stt, 'ma_cau', l2.ma_cau, 'kho', l2.kho, 'loai_cau', l2.loai_cau, 'phan', l2.phan_tieu_de,
             'loi', to_jsonb(l2.loi), 'chan', l2.chan
           ) order by l2.stt) filter (where cardinality(l2.loi) > 0), '[]'::jsonb))
  from l2
$$;

-- ── 3d. Duyệt đề — 1 cửa, 1 transaction: mọi câu + mệnh đề + form MCQ của đề, rồi đóng dấu đề ─────────
create or replace function public.fn_de_thi_duyet(p_de uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v jsonb; r record; nsu uuid := public.current_nhan_su_id(); n int := 0; v_form text;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if nsu is null then raise exception 'Không xác định được nhân sự duyệt'; end if;
  v := public.fn_de_thi_thieu(p_de);
  if (v ->> 'so_chan')::int > 0 then
    raise exception 'Đề còn % câu thiếu — xử lý hết rồi mới duyệt được', v ->> 'so_chan' using errcode = 'check_violation';
  end if;
  for r in select * from public.fn_de_thi_cau(p_de) order by stt loop
    execute format('update %I set da_duyet = true, duyet_boi = $2, duyet_at = now(), duyet_nguon = ''nguoi''
                    where ma_cau = $1 and not da_duyet', r.kho || '_cau_hoi') using r.ma_cau, nsu;
    if r.loai_cau = 'dung_sai' and to_regclass('public.' || r.kho || '_cau_menh_de') is not null then
      execute format('update %I set da_duyet = true, duyet_boi = $2, duyet_at = now(), duyet_nguon = ''nguoi''
                      where ma_cau_cha = $1 and xoa_at is null and not da_duyet', r.kho || '_cau_menh_de') using r.ma_cau, nsu;
    end if;
    if r.loai_cau = 'tra_loi_ngan' then
      v_form := public._kho_form_tn_cua(r.kho || '_cau_hoi');
      if v_form is not null then
        execute format('update %I set da_duyet = true, duyet_boi = $2, duyet_at = now()
                        where ma_cau = $1 and xoa_at is null and not da_duyet', v_form) using r.ma_cau, nsu;
      end if;
    end if;
    n := n + 1;
  end loop;
  update tai_lieu set duyet_at = now(), duyet_boi = nsu, updated_at = now() where id = p_de;
  return jsonb_build_object('so_cau', n);
end $$;

-- ── 3e. Phát hành đề thành bài thi cho 1 lớp — snapshot ở DB, tính + ghi cùng transaction ────────────────
create or replace function public.fn_de_thi_mo(p_de uuid, p_lop uuid, p_ngay date, p_thoi_gian_phut integer,
                                                p_khoa_dap_an boolean default true)
returns uuid language plpgsql security definer set search_path = public as $$
declare tl record; v_bt uuid; r record; n int := 0;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  select * into tl from tai_lieu where id = p_de and loai = 'de_thi';
  if tl.id is null then raise exception 'Không phải đề thi: %', p_de; end if;
  if tl.duyet_at is null then raise exception 'Đề chưa duyệt — duyệt đề trước khi phát hành' using errcode = 'check_violation'; end if;
  if (public.fn_de_thi_thieu(p_de) ->> 'so_chan')::int > 0 then
    raise exception 'Đề bị sửa sau khi duyệt và đang thiếu dữ liệu — mở Duyệt đề để xử lý' using errcode = 'check_violation';
  end if;
  if p_lop is null or p_ngay is null then raise exception 'Thiếu lớp hoặc ngày thi'; end if;
  if exists (select 1 from bai_test where nguon_tai_lieu_id = p_de and lop_id = p_lop and ngay = p_ngay and loai = 'de_thi') then
    raise exception 'Đề này đã phát hành cho lớp này ngày này rồi' using errcode = 'unique_violation';
  end if;

  insert into bai_test (nguon_tai_lieu_id, lop_id, ngay, loai, mon, deadline, khoa_reveal, thoi_gian_phut, so_cau)
  values (p_de, p_lop, p_ngay, 'de_thi', tl.mon, null, coalesce(p_khoa_dap_an, true), p_thoi_gian_phut, 0)
  returning id into v_bt;

  for r in select * from public.fn_de_thi_cau(p_de) where not xoa and loai_cau in ('trac_nghiem', 'dung_sai', 'tra_loi_ngan') order by stt loop
    n := n + 1;
    perform public._kho_snapshot_cau(v_bt, r.kho || '_cau_hoi', r.kho || '_dang_ly_thuyet', r.ma_cau, n);
    -- Điểm theo phần (TLN chuyển MCQ vẫn giữ điểm TLN) · tiêu đề phần · đang THI ⇒ không kèm lý thuyết gợi ý
    update bai_test_cau set diem = r.diem, phan = r.phan_tieu_de, ly_thuyet = null
    where bai_test_id = v_bt and thu_tu = n and bien_the = 1;
  end loop;
  if n = 0 then raise exception 'Đề không có câu nào làm được trên app'; end if;
  -- App chỉ có trắc nghiệm + đúng/sai (CEO 20/09): TLN phải đã hiện thành 4 phương án qua form MCQ đã duyệt
  if exists (select 1 from bai_test_cau where bai_test_id = v_bt and loai_cau not in ('trac_nghiem', 'dung_sai')) then
    raise exception 'Có câu trả lời ngắn chưa có phương án trắc nghiệm đã duyệt — mở Duyệt đề' using errcode = 'check_violation';
  end if;
  update bai_test set so_cau = n where id = v_bt;
  return v_bt;
end $$;

-- ── 3f. Chấm 1 bài làm — TÁCH NGUYÊN VĂN vòng chấm của et_nop (0070), không đổi logic ─────────────────
create or replace function public._et_cham(p_bai_lam uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_test uuid; v_qa uuid; rec record;
        a jsonb; k jsonb; vv text; vd numeric; cb text; dung int; n int; i int; lt text;
begin
  select bai_test_id into v_test from bai_lam where id = p_bai_lam;
  for rec in
    select bc.id cau_id, bc.loai_cau, bc.dap_an_key, bc.diem, bc.ma_cau, blc.id blc_id, blc.dap_an_hs
    from bai_test_cau bc left join bai_lam_cau blc on blc.bai_test_cau_id = bc.id and blc.bai_lam_id = p_bai_lam
    where bc.bai_test_id = v_test
  loop
    if rec.blc_id is null then continue; end if;  -- HS ko trả lời → bỏ (§1.5 anti-NULL)
    a := rec.dap_an_hs; k := rec.dap_an_key; cb := 'exact';
    if rec.loai_cau = 'trac_nghiem' then
      lt := chr(65 + (a #>> '{}')::int);
      vv := case when lt = upper(trim(k #>> '{}')) then 'correct' else 'wrong' end;
      vd := case when vv = 'correct' then rec.diem else 0 end;
    elsif rec.loai_cau = 'dung_sai' then
      n := jsonb_array_length(k); dung := 0;
      for i in 0 .. n - 1 loop
        if upper(left(a ->> i, 1)) = upper(left(k ->> i, 1)) then dung := dung + 1; end if;
      end loop;
      vd := (case dung when 0 then 0 when 1 then 0.1 when 2 then 0.25 when 3 then 0.5 else 1.0 end) * rec.diem;
      vv := case when dung = n then 'correct' when dung > 0 then 'partial' else 'wrong' end;
    else  -- tra_loi_ngan: exact (norm cơ bản) → cache đáp-án-đã-duyệt
      vv := case when public.tln_norm(a #>> '{}') = public.tln_norm(k #>> '{}') then 'correct' else 'wrong' end;
      if vv = 'wrong' and rec.ma_cau is not null then
        select id into v_qa from question_accepted_answers
          where ma_cau = rec.ma_cau
            and (answer_normalized = public.tln_norm(a #>> '{}') or public.tln_norm(answer_raw) = public.tln_norm(a #>> '{}'))
          limit 1;
        if v_qa is not null then
          vv := 'correct'; cb := 'cache';
          update question_accepted_answers set hit_count = hit_count + 1 where id = v_qa;
        end if;
      end if;
      vd := case when vv = 'correct' then rec.diem else 0 end;
    end if;
    update bai_lam_cau set verdict = vv, diem = vd, cham_boi = cb, cham_at = now() where id = rec.blc_id;
  end loop;
end $$;

-- ── 3g. et_nop — chấm qua _et_cham; khoa_reveal ⇒ không trả key/lời giải/đúng-sai (chỉ cờ khoá) ────────
create or replace function public.et_nop(p_bai_lam uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_hs uuid; v_test uuid; v_claimed int; v_khoa boolean;
begin
  select hoc_sinh_id, bai_test_id into v_hs, v_test from bai_lam where id = p_bai_lam;
  if v_hs is null or v_hs <> public.my_hoc_sinh_id() then raise exception 'khong phai bai lam cua ban'; end if;
  update bai_lam set trang_thai = 'da_nop', nop_at = now() where id = p_bai_lam and trang_thai = 'dang_lam';
  get diagnostics v_claimed = row_count;  -- 1 = lần nộp đầu · 0 = đã nộp rồi (chỉ chấm lần đầu, 0069)
  if v_claimed > 0 then perform public._et_cham(p_bai_lam); end if;
  select coalesce(khoa_reveal, false) into v_khoa from bai_test where id = v_test;
  if v_khoa then
    return (select coalesce(jsonb_agg(jsonb_build_object('bai_test_cau_id', bc.id, 'khoa', true) order by bc.thu_tu), '[]'::jsonb)
            from bai_test_cau bc where bc.bai_test_id = v_test);
  end if;
  return (
    select coalesce(jsonb_agg(jsonb_build_object(
      'bai_test_cau_id', bc.id, 'verdict', blc.verdict, 'dap_an_key', bc.dap_an_key,
      'loi_giai', bc.loi_giai, 'anh_dap_an', bc.anh_dap_an, 'menh_de', bc.menh_de
    ) order by bc.thu_tu), '[]'::jsonb)
    from bai_test_cau bc left join bai_lam_cau blc on blc.bai_test_cau_id = bc.id and blc.bai_lam_id = p_bai_lam
    where bc.bai_test_id = v_test
  );
end $$;

-- ── 3h. Staff thu bài — bài còn đang làm (HS tắt app, hết giờ…) ⇒ nộp + chấm ────────────────────────────
create or replace function public.fn_de_thi_thu_bai(p_bai_test uuid)
returns integer language plpgsql security definer set search_path = public as $$
declare r record; n int := 0; c int;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  for r in select id from bai_lam where bai_test_id = p_bai_test and trang_thai = 'dang_lam' loop
    update bai_lam set trang_thai = 'da_nop', nop_at = now() where id = r.id and trang_thai = 'dang_lam';
    get diagnostics c = row_count;
    if c > 0 then perform public._et_cham(r.id); n := n + 1; end if;
  end loop;
  return n;
end $$;

-- ── 3i. Kết quả 1 lượt thi (staff) — điểm thang 10 = Σ đạt / Σ tối đa × 10, theo từng phần ─────────────
create or replace function public.fn_de_thi_ket_qua(p_bai_test uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with bt as (select * from bai_test where id = p_bai_test and public.la_thanh_vien()),
  cau as (select bc.id, bc.phan, bc.diem, bc.thu_tu from bai_test_cau bc, bt where bc.bai_test_id = bt.id and bc.bien_the = 1),
  phan as (select coalesce(phan, '') phan, sum(diem) toi_da, min(thu_tu) tt from cau group by coalesce(phan, '')),
  hs as (
    select hl.hoc_sinh_id from hoc_sinh_lop hl, bt where hl.lop_id = bt.lop_id and hl.trang_thai = 'dang_hoc'
    union
    select bl.hoc_sinh_id from bai_lam bl, bt where bl.bai_test_id = bt.id
  ),
  dong as (
    select h.hoc_sinh_id, s.ho_ten, s.ma_hs, bl.trang_thai, bl.bat_dau_at, bl.nop_at,
      (select coalesce(sum(blc.diem), 0) from bai_lam_cau blc where blc.bai_lam_id = bl.id) diem,
      (select coalesce(jsonb_object_agg(p.phan, coalesce((select sum(blc.diem) from bai_lam_cau blc join cau c2 on c2.id = blc.bai_test_cau_id
                                                           where blc.bai_lam_id = bl.id and coalesce(c2.phan, '') = p.phan), 0)), '{}'::jsonb)
       from phan p) theo_phan
    from hs h join hoc_sinh s on s.id = h.hoc_sinh_id
    left join bai_lam bl on bl.bai_test_id = p_bai_test and bl.hoc_sinh_id = h.hoc_sinh_id
  )
  select case when not exists (select 1 from bt) then null else jsonb_build_object(
    'toi_da', (select coalesce(sum(diem), 0) from cau),
    'thoi_gian_phut', (select thoi_gian_phut from bt),
    'khoa_reveal', (select khoa_reveal from bt),
    'phan', (select coalesce(jsonb_agg(jsonb_build_object('phan', phan, 'toi_da', toi_da) order by tt), '[]'::jsonb) from phan),
    'hs', (select coalesce(jsonb_agg(jsonb_build_object(
              'hoc_sinh_id', d.hoc_sinh_id, 'ho_ten', d.ho_ten, 'ma_hs', d.ma_hs,
              'trang_thai', coalesce(d.trang_thai, 'chua_lam'), 'bat_dau_at', d.bat_dau_at, 'nop_at', d.nop_at,
              'diem', case when d.trang_thai = 'da_nop' then d.diem end,
              'diem_10', case when d.trang_thai = 'da_nop' and (select sum(diem) from cau) > 0
                              then round(d.diem / (select sum(diem) from cau) * 10, 2) end,
              'theo_phan', case when d.trang_thai = 'da_nop' then d.theo_phan end
            ) order by d.ho_ten), '[]'::jsonb) from dong d)
  ) end
$$;

-- ── 3j. Điểm của chính HS — chỉ khi đã nộp VÀ đáp án đã mở ──────────────────────────────────────────────
create or replace function public.fn_de_thi_diem_cua_toi(p_bai_test uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  with bl as (select bl.* from bai_lam bl join bai_test bt on bt.id = bl.bai_test_id
              where bl.bai_test_id = p_bai_test and bl.hoc_sinh_id = public.my_hoc_sinh_id()
                and bl.trang_thai = 'da_nop' and not coalesce(bt.khoa_reveal, false)),
  cau as (select bc.id, bc.phan, bc.diem, bc.thu_tu from bai_test_cau bc, bl
          where bc.bai_test_id = bl.bai_test_id and bc.bien_the = bl.bien_the),
  phan as (select coalesce(phan, '') phan, sum(diem) toi_da, min(thu_tu) tt from cau group by coalesce(phan, '')),
  dat as (select coalesce(c.phan, '') phan, coalesce(sum(blc.diem), 0) diem
          from bai_lam_cau blc join cau c on c.id = blc.bai_test_cau_id, bl where blc.bai_lam_id = bl.id group by coalesce(c.phan, ''))
  select case when not exists (select 1 from bl) then null else jsonb_build_object(
    'diem', (select coalesce(sum(diem), 0) from dat),
    'toi_da', (select coalesce(sum(diem), 0) from cau),
    'diem_10', case when (select sum(diem) from cau) > 0
                    then round((select coalesce(sum(diem), 0) from dat) / (select sum(diem) from cau) * 10, 2) end,
    'phan', (select coalesce(jsonb_agg(jsonb_build_object('phan', p.phan, 'toi_da', p.toi_da,
                                                          'diem', coalesce((select d.diem from dat d where d.phan = p.phan), 0)) order by p.tt), '[]'::jsonb)
             from phan p)
  ) end
$$;

-- ── 4. Trigger chặn HS ghi thẳng (PostgREST, role authenticated, không phải nhân sự) vào bài loại THI ────
-- Trong hàm SECURITY DEFINER (et_nop, _et_cham, fn_de_thi_thu_bai…) current_user = owner ⇒ không bị chặn.
create or replace function public._trg_bai_lam_cau_thi() returns trigger
language plpgsql set search_path = public as $$
declare v_loai text; v_tt text; v_bd timestamptz; v_phut int;
begin
  if current_user not in ('authenticated', 'anon') or public.la_thanh_vien() then return new; end if;
  select bt.loai, bl.trang_thai, bl.bat_dau_at, bt.thoi_gian_phut into v_loai, v_tt, v_bd, v_phut
  from bai_lam bl join bai_test bt on bt.id = bl.bai_test_id where bl.id = new.bai_lam_id;
  if v_loai is null or v_loai not in ('et', 'de_thi', 'bo_tro_test', 'retest') then return new; end if;
  if v_tt <> 'dang_lam' then raise exception 'Bài đã nộp — không sửa được nữa' using errcode = 'check_violation'; end if;
  if v_phut is not null and now() > v_bd + make_interval(mins => v_phut + 2) then  -- ân hạn 2' cho mạng chậm
    raise exception 'Hết giờ làm bài' using errcode = 'check_violation';
  end if;
  if tg_op = 'INSERT' then new.verdict := null; new.diem := null; new.cham_boi := null;
  else new.verdict := old.verdict; new.diem := old.diem; new.cham_boi := old.cham_boi; end if;  -- chấm là việc của server
  return new;
end $$;
drop trigger if exists trg_bai_lam_cau_thi on public.bai_lam_cau;
create trigger trg_bai_lam_cau_thi before insert or update on public.bai_lam_cau
  for each row execute function public._trg_bai_lam_cau_thi();

create or replace function public._trg_bai_lam_thi() returns trigger
language plpgsql set search_path = public as $$
declare v_loai text;
begin
  if current_user not in ('authenticated', 'anon') or public.la_thanh_vien() then return new; end if;
  select loai into v_loai from bai_test where id = new.bai_test_id;
  if tg_op = 'INSERT' then
    new.bat_dau_at := now();                                   -- giờ bắt đầu do server đóng, HS không tự đặt
    if v_loai in ('et', 'de_thi', 'bo_tro_test', 'retest') then new.trang_thai := 'dang_lam'; new.nop_at := null; end if;
    return new;
  end if;
  new.bat_dau_at := old.bat_dau_at; new.bai_test_id := old.bai_test_id;
  new.hoc_sinh_id := old.hoc_sinh_id; new.bien_the := old.bien_the;
  if v_loai in ('et', 'de_thi', 'bo_tro_test', 'retest') then     -- nộp bài THI chỉ qua et_nop
    new.trang_thai := old.trang_thai; new.nop_at := old.nop_at;
  end if;
  return new;
end $$;
drop trigger if exists trg_bai_lam_thi on public.bai_lam;
create trigger trg_bai_lam_thi before insert or update on public.bai_lam
  for each row execute function public._trg_bai_lam_thi();

-- ── 5. Quyền ────────────────────────────────────────────────────────────────────────────────────────────
revoke all on function public._et_cham(uuid) from public, anon, authenticated;
revoke all on function public.fn_de_thi_cau(uuid) from public, anon;
revoke all on function public.fn_de_thi_thieu(uuid) from public, anon;
revoke all on function public.fn_de_thi_duyet(uuid) from public, anon;
revoke all on function public.fn_de_thi_mo(uuid, uuid, date, integer, boolean) from public, anon;
revoke all on function public.fn_de_thi_thu_bai(uuid) from public, anon;
revoke all on function public.fn_de_thi_ket_qua(uuid) from public, anon;
revoke all on function public.fn_de_thi_diem_cua_toi(uuid) from public, anon;
grant execute on function public.fn_de_thi_cau(uuid), public.fn_de_thi_thieu(uuid), public.fn_de_thi_duyet(uuid),
  public.fn_de_thi_mo(uuid, uuid, date, integer, boolean), public.fn_de_thi_thu_bai(uuid),
  public.fn_de_thi_ket_qua(uuid), public.fn_de_thi_diem_cua_toi(uuid) to authenticated;
