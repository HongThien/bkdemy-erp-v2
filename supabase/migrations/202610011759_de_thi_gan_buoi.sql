-- ============================================================================
-- 202610011759 — de_thi_gan_buoi
-- ----------------------------------------------------------------------------
-- ĐỀ THI lát C (spec-de-thi.md §10.7, CEO 01/10): "gán đề giống gán tài liệu — mỗi lớp có 3 loại tài liệu
-- Giáo trình · ET · BTVN; đề gán vào buổi thì thành GIÁO TRÌNH hoặc BTVN của buổi đó, khớp hệ thống hiện tại".
--
--   1. `fn_de_thi_gan(đề, lớp, ngày, loại)` — đẻ đúng MỘT tài liệu vận hành `giao_trinh_buoi` | `btvn` bám (lớp+ngày)
--      như `trichXuatBuoi` vẫn làm cho giáo trình: mốc 'buoi' + mỗi PHẦN của đề thành một phần 'dang' (trên lớp) /
--      'btvn' (về nhà), `nguon_id` = đề. Vì đúng khuôn cũ nên in phiếu, chấm BTVN, phát hành app, việc-của-tôi,
--      bộ giáo trình của lớp… đọc được ngay, KHÔNG phải dạy lại từng chỗ.
--   2. K5 — trả lời ngắn GIỮ form đề gốc: `fn_de_thi_mo` thôi đổi sang 4 phương án, thôi chặn đề có câu trả lời ngắn.
--      Ô nhập trên app = phiếu 4 ô của Bộ ⇒ cột `bai_test_cau.kieu_nhap` ('phieu_4o'; NULL = không áp dụng).
--      Chấm trả lời ngắn ở chế độ thi so theo `fn_tln_normalize` (23,9 = 23.9) — cùng chuẩn với bài chấm ngay.
--   3. K6 — câu còn ở dạng chờ vẫn làm được, kết quả vẫn lưu nhưng CHƯA tính cho dạng nào (`ma_dang` để trống —
--      "không áp dụng", không phải điểm 0). Gán dạng thật cho câu sau đó ⇒ trigger điền `ma_dang` vào các bài đã
--      phát hành từ đề ⇒ mastery (suy động) tự có thêm lần đo. Không tính lại, không job.
--   4. Tab "Đã giao" của Kho đề thi tính cả đề đã gán vào buổi (trước chỉ tính lượt thi).
--
-- MẤT GÌ: không. Thêm 1 cột (NULL sẵn), thêm hàm + trigger, thay thân 4 hàm cùng chữ ký. Không đụng dòng dữ liệu nào.
-- (migrate.mjs đã wrap mỗi file trong begin/commit — không tự bọc thêm)
-- ============================================================================

-- ── 1) Ô nhập của câu trả lời ngắn trên app ───────────────────────────────────
alter table public.bai_test_cau add column if not exists kieu_nhap text;
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'bai_test_cau_kieu_nhap_chk') then
    alter table public.bai_test_cau add constraint bai_test_cau_kieu_nhap_chk check (kieu_nhap is null or kieu_nhap in ('phieu_4o'));
  end if;
end $$;
comment on column public.bai_test_cau.kieu_nhap is
  'Kiểu ô nhập cho câu trả lời ngắn. phieu_4o = phiếu trả lời của Bộ (4 ô: chữ số, dấu − ở ô 1, dấu , ở ô 2–3). NULL = không áp dụng (ô nhập tự do / không phải trả lời ngắn).';

-- Đáp số tô được trên phiếu 4 ô? (cùng luật với gợi ý ở màn sửa đề — KhoDeThi.tsx hopLePhieu4O; nguồn quyết định là hàm này)
create or replace function public._de_thi_hop_le_4o(p text)
returns boolean language sql immutable as $$
  select p is not null and length(p) between 1 and 4 and p ~ '^-?[0-9]*,?[0-9]+$'
         and (position(',' in p) = 0 or position(',' in p) in (2, 3))
$$;

-- ── 2) Hoàn thiện một bài test phát hành TỪ ĐỀ THI (lượt thi, hoặc Giáo trình / BTVN gán từ đề) ─────────────
-- Gọi ngay sau khi snapshot câu. Một chỗ duy nhất cho 4 việc: ô 4 ký tự · bỏ dạng chờ khỏi phép đo · tên phần ·
-- mở sẵn mọi câu nếu là bài luyện trên lớp (đề luyện là làm cả đề, không mở từng dạng như giáo trình thường).
create or replace function public.fn_de_thi_hoan_thien_bai_test(p_bt uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare bt record; v_tu_de boolean; n4 int; n_cho int; n_mo int := 0;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  select b.id, b.loai, b.nguon_tai_lieu_id into bt from bai_test b where b.id = p_bt;
  if bt.id is null then raise exception 'Không thấy bài test %', p_bt; end if;
  v_tu_de := bt.loai = 'de_thi'
          or exists (select 1 from tai_lieu t where t.id = bt.nguon_tai_lieu_id and t.cau_hinh ? 'deThi');
  if not v_tu_de then raise exception 'Bài test này không phát hành từ đề thi'; end if;

  update bai_test_cau set kieu_nhap = 'phieu_4o'
   where bai_test_id = p_bt and loai_cau = 'tra_loi_ngan' and public._de_thi_hop_le_4o(btrim(dap_an_key #>> '{}'));
  get diagnostics n4 = row_count;

  update bai_test_cau set ma_dang = null where bai_test_id = p_bt and public._kho_la_dang_cho(ma_dang);
  get diagnostics n_cho = row_count;

  -- Tên phần (Phần I / II / III) theo CÂU — khoá tự nhiên ma_cau, không theo vị trí
  update bai_test_cau bc set phan = p.tieu_de
    from tai_lieu_cau c join tai_lieu_phan p on p.id = c.phan_id
   where bc.bai_test_id = p_bt and bc.phan is null
     and p.tai_lieu_id = bt.nguon_tai_lieu_id and p.loai_phan <> 'buoi' and c.ma_cau = bc.ma_cau;

  if bt.loai = 'giao_trinh' then
    insert into bai_test_cau_phat_hanh (bai_test_cau_id, bai_test_id, mo_by)
      select bc.id, p_bt, public.current_nhan_su_id() from bai_test_cau bc where bc.bai_test_id = p_bt
    on conflict (bai_test_cau_id) do nothing;
    get diagnostics n_mo = row_count;
  end if;
  return jsonb_build_object('so_4o', n4, 'so_cho_dang', n_cho, 'so_mo', n_mo);
end $$;
revoke all on function public.fn_de_thi_hoan_thien_bai_test(uuid) from public, anon;
grant execute on function public.fn_de_thi_hoan_thien_bai_test(uuid) to authenticated;

-- ── 3) Gán đề vào một buổi của lớp ⇒ tài liệu Giáo trình buổi / BTVN ─────────────────────────────────────
create or replace function public.fn_de_thi_gan(p_de uuid, p_lop uuid, p_ngay date, p_loai text)
returns uuid language plpgsql security definer set search_path = public as $$
declare tl record; lp record; v_cu text; v_id uuid; v_ch jsonb; v_form jsonb; r record; v_phan uuid; v_tt int := 1;
        v_nhan text := case p_loai when 'btvn' then 'BTVN' else 'GT' end;
begin
  if not public.la_thanh_vien() then raise exception 'not a member'; end if;
  if p_loai is null or p_loai not in ('giao_trinh_buoi', 'btvn') then
    raise exception 'Đề gán vào buổi chỉ thành Giáo trình (bài trên lớp) hoặc BTVN' using errcode = 'check_violation';
  end if;
  if p_lop is null or p_ngay is null then raise exception 'Thiếu lớp hoặc ngày'; end if;
  select * into tl from tai_lieu where id = p_de and loai = 'de_thi';
  if tl.id is null then raise exception 'Không phải đề thi: %', p_de; end if;
  if tl.duyet_at is null then raise exception 'Đề chưa duyệt — duyệt đề trước khi gán cho lớp' using errcode = 'check_violation'; end if;
  if (public.fn_de_thi_thieu(p_de) ->> 'so_chan')::int > 0 then
    raise exception 'Đề bị sửa sau khi duyệt và đang thiếu đáp án / phương án — xử lý rồi gán lại' using errcode = 'check_violation';
  end if;
  select id, ten_lop, mon into lp from lop where id = p_lop;
  if lp.id is null then raise exception 'Không thấy lớp'; end if;
  if lp.mon is distinct from tl.mon then
    raise exception 'Đề môn % không gán được cho lớp môn %', tl.mon, lp.mon using errcode = 'check_violation';
  end if;
  -- 1 buổi (lớp+ngày) chỉ có 1 Giáo trình + 1 BTVN (uq_tai_lieu_van_hanh). Không tự thay bản đang có.
  select ten into v_cu from tai_lieu where loai = p_loai and lop_id = p_lop and ngay = p_ngay limit 1;
  if v_cu is not null then
    raise exception 'Buổi % của lớp % đã có % «%» — xoá bản đó ở Kho tài liệu hoặc chọn ngày khác',
      to_char(p_ngay, 'DD/MM'), lp.ten_lop, case p_loai when 'btvn' then 'BTVN' else 'Giáo trình' end, v_cu
      using errcode = 'unique_violation';
  end if;

  -- Trả lời ngắn giữ đúng form trả lời ngắn khi in / lên app (K5) — ghi tường minh, không để luật "khối 10–12 ép trắc nghiệm" đổi form
  select coalesce(jsonb_object_agg(c.ma_cau, 'tra_loi_ngan'), '{}'::jsonb) into v_form
    from public.fn_de_thi_cau(p_de) c where c.loai_cau = 'tra_loi_ngan' and not c.xoa;
  v_ch := coalesce(tl.cau_hinh, '{}'::jsonb)
          || jsonb_build_object('etFormByCau', coalesce(tl.cau_hinh -> 'etFormByCau', '{}'::jsonb) || v_form);

  insert into tai_lieu (loai, ten, khoi, mon, nhanh, ma_chuyen_de, theme, cau_hinh, lop_id, ngay, nguon_id, created_by)
  values (p_loai, v_nhan || ' ' || lp.ten_lop || ' ' || to_char(p_ngay, 'DD/MM/YYYY') || ' · ' || tl.ten,
          tl.khoi, tl.mon, tl.nhanh, tl.ma_chuyen_de, tl.theme, v_ch, p_lop, p_ngay, p_de, public.jwt_uid())
  returning id into v_id;

  -- Mốc buổi (số buổi của lớp do renumberBuoiLop đánh lại ngay sau khi gán — cùng đường với trích xuất giáo trình)
  insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, tieu_de) values (v_id, 0, 'buoi', null, tl.ten);
  for r in select * from tai_lieu_phan where tai_lieu_id = p_de and loai_phan = 'custom' order by thu_tu loop
    insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, tieu_de, noi_dung, kieu, diem_moi_cau)
    values (v_id, v_tt, case p_loai when 'btvn' then 'btvn' else 'dang' end, null, r.tieu_de, r.noi_dung, r.kieu, r.diem_moi_cau)
    returning id into v_phan;
    insert into tai_lieu_cau (phan_id, ma_cau, thu_tu, diem)
      select v_phan, c.ma_cau, c.thu_tu, c.diem from tai_lieu_cau c where c.phan_id = r.id;
    v_tt := v_tt + 1;
  end loop;
  return v_id;
end $$;
revoke all on function public.fn_de_thi_gan(uuid, uuid, date, text) from public, anon;
grant execute on function public.fn_de_thi_gan(uuid, uuid, date, text) to authenticated;

-- ── 4) Đề đã gán vào những buổi nào (kèm bài trên app nếu đã mở) ─────────────────────────────────────────
create or replace function public.fn_de_thi_da_gan(p_de uuid)
returns table (tai_lieu_id uuid, loai text, ten text, lop_id uuid, lop_ten text, ngay date, created_at timestamptz,
               bai_test_id uuid, so_da_lam int)
language sql stable set search_path = public as $$
  select t.id, t.loai, t.ten, t.lop_id, l.ten_lop, t.ngay, t.created_at, b.id,
         (select count(*)::int from bai_lam bl where bl.bai_test_id = b.id)
    from tai_lieu t
    join lop l on l.id = t.lop_id
    left join lateral (select b.id from bai_test b
                        where b.nguon_tai_lieu_id = t.id and b.lop_id = t.lop_id and b.ngay = t.ngay
                        order by b.created_at desc limit 1) b on true
   where t.nguon_id = p_de and t.loai in ('giao_trinh_buoi', 'btvn') and t.lop_id is not null
   order by t.ngay desc, l.ten_lop
   limit 200
$$;
revoke all on function public.fn_de_thi_da_gan(uuid) from public, anon;
grant execute on function public.fn_de_thi_da_gan(uuid) to authenticated;

-- ── 5) Phát hành đề làm bài KIỂM TRA: trả lời ngắn giữ form, không còn chặn ──────────────────────────────
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
    raise exception 'Đề bị sửa sau khi duyệt và đang thiếu dữ liệu — mở đề để xử lý' using errcode = 'check_violation';
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
    -- Điểm theo phần · tiêu đề phần · đang THI ⇒ không kèm lý thuyết gợi ý
    update bai_test_cau set diem = r.diem, phan = r.phan_tieu_de, ly_thuyet = null
    where bai_test_id = v_bt and thu_tu = n and bien_the = 1;
    -- K5: câu trả lời ngắn giữ form đề gốc. `_kho_snapshot_cau` tự hiện thành 4 phương án nếu kho có form trắc nghiệm đã
    -- duyệt (đúng cho bổ trợ / tự luyện) — với đề thi thì trả về đúng trả lời ngắn + đáp số của kho.
    if r.loai_cau = 'tra_loi_ngan' then
      update bai_test_cau set loai_cau = 'tra_loi_ngan', lua_chon = null, lua_chon_rule = null,
             form_tn_id = null, form_tn_hgt_id = null, dap_an_key = to_jsonb(btrim(r.dap_an))
      where bai_test_id = v_bt and thu_tu = n and bien_the = 1 and loai_cau <> 'tra_loi_ngan';
    end if;
  end loop;
  if n = 0 then raise exception 'Đề không có câu nào làm được trên app'; end if;
  update bai_test set so_cau = n where id = v_bt;
  perform public.fn_de_thi_hoan_thien_bai_test(v_bt);
  return v_bt;
end $$;

-- ── 6) Đề cho HS (chế độ thi): trả thêm kieu_nhap ────────────────────────────────────────────────────────
create or replace function public.et_de(p_bai_test uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_bien_the smallint;
begin
  select bl.bien_the into v_bien_the from bai_lam bl
  where bl.bai_test_id = p_bai_test and bl.hoc_sinh_id = public.my_hoc_sinh_id();
  v_bien_the := coalesce(v_bien_the, 1);

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', bc.id, 'thu_tu', bc.thu_tu, 'loai_cau', bc.loai_cau,
      'noi_dung', bc.noi_dung, 'lua_chon', bc.lua_chon, 'anh_de', bc.anh_de,
      'menh_de', (select jsonb_agg(jsonb_build_object('noi_dung', m->>'noi_dung'))
                  from jsonb_array_elements(coalesce(bc.menh_de, '[]'::jsonb)) m),
      'ma_dang', bc.ma_dang, 'ly_thuyet', bc.ly_thuyet, 'diem', bc.diem,
      'phan', bc.phan, 'kieu_nhap', bc.kieu_nhap
    ) order by bc.thu_tu)
    from bai_test_cau bc join bai_test bt on bt.id = bc.bai_test_id
    where bc.bai_test_id = p_bai_test and bc.bien_the = v_bien_the
      and ((bt.loai in ('et', 'de_thi') and public.hs_o_lop(bt.lop_id))
           or (bt.loai in ('bo_tro_test', 'retest') and bt.hoc_sinh_id = public.my_hoc_sinh_id()))
  ), '[]'::jsonb);
end $$;

-- ── 7) Chấm chế độ thi: trả lời ngắn so thêm theo fn_tln_normalize (23,9 = 23.9 · 0,50 = 0,5) ──────────────
-- Chỉ NỚI thêm một nhánh đúng; mọi bài trước đây đúng vẫn đúng (tln_norm vẫn được thử trước).
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
    else  -- tra_loi_ngan: exact (norm cơ bản → chuẩn hoá số) → cache đáp-án-đã-duyệt
      vv := case when public.tln_norm(a #>> '{}') = public.tln_norm(k #>> '{}')
                   or (public.fn_tln_normalize(a #>> '{}') <> ''
                       and public.fn_tln_normalize(a #>> '{}') = public.fn_tln_normalize(k #>> '{}'))
                 then 'correct' else 'wrong' end;
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
revoke all on function public._et_cham(uuid) from public, anon, authenticated;

-- ── 8) K6: câu rời dạng chờ ⇒ điền dạng vào các bài đã phát hành TỪ ĐỀ THI ───────────────────────────────
-- Chỉ điền chỗ đang TRỐNG, chỉ bài có nguồn là đề thi (lượt thi, hoặc Giáo trình / BTVN gán từ đề). Không đổi dạng đã có.
create or replace function public._trg_de_thi_dien_dang() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.dang_chinh is null or public._kho_la_dang_cho(new.dang_chinh) then return new; end if;
  if not (old.dang_chinh is null or public._kho_la_dang_cho(old.dang_chinh)) then return new; end if;
  update bai_test_cau bc set ma_dang = new.dang_chinh
    from bai_test bt
   where bc.ma_cau = new.ma_cau and bc.ma_dang is null and bt.id = bc.bai_test_id
     and (bt.loai = 'de_thi'
          or exists (select 1 from tai_lieu t where t.id = bt.nguon_tai_lieu_id and t.cau_hinh ? 'deThi'));
  return new;
end $$;
do $$
declare k text;
begin
  foreach k in array array['dai', 'hgt', 'khtn', 'hinh_hoc'] loop
    if to_regclass('public.' || k || '_cau_hoi') is not null
       and exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = k || '_cau_hoi' and column_name = 'dang_chinh') then
      execute format('drop trigger if exists trg_de_thi_dien_dang on public.%I', k || '_cau_hoi');
      execute format('create trigger trg_de_thi_dien_dang after update of dang_chinh on public.%I
                      for each row execute function public._trg_de_thi_dien_dang()', k || '_cau_hoi');
    end if;
  end loop;
end $$;

-- ── 9) Kho đề thi: "đã giao" = có lượt thi HOẶC đã gán vào buổi của lớp ──────────────────────────────────
create or replace function public._de_thi_da_giao(p_de uuid)
returns boolean language sql stable set search_path = public as $$
  select exists (select 1 from bai_test b where b.nguon_tai_lieu_id = p_de)
      or exists (select 1 from tai_lieu g where g.nguon_id = p_de and g.lop_id is not null and g.loai in ('giao_trinh_buoi', 'btvn'))
$$;

create or replace function public.fn_de_thi_dem(p_mon text, p_khoi text default null)
returns jsonb
language sql stable set search_path = public as $$
  select jsonb_build_object(
    'cho_duyet', count(*) filter (where t.duyet_at is null),
    'san_sang',  count(*) filter (where t.duyet_at is not null),
    'da_giao',   count(*) filter (where public._de_thi_da_giao(t.id)))
  from tai_lieu t
  where t.loai = 'de_thi' and t.mon = p_mon and (p_khoi is null or t.khoi = p_khoi)
$$;

create or replace function public.fn_de_thi_ds(
  p_mon text, p_khoi text default null, p_tab text default 'cho_duyet', p_tim text default null,
  p_gioi_han int default 25, p_truoc timestamptz default null
) returns table (
  id uuid, ten text, khoi text, mon text, created_at timestamptz, updated_at timestamptz, duyet_at timestamptz,
  nguon text, nam int, co_de_goc boolean,
  so_cau int, so_chan int, so_chua_dang int, so_canh_bao_nhap int, so_luot int, luot_gan_nhat date
)
language sql stable set search_path = public as $$
  with trang as (
    select t.* from tai_lieu t
     where t.loai = 'de_thi' and t.mon = p_mon and (p_khoi is null or t.khoi = p_khoi)
       and (nullif(btrim(p_tim), '') is null or t.ten ilike '%' || btrim(p_tim) || '%')
       and case p_tab
             when 'cho_duyet' then t.duyet_at is null
             when 'san_sang'  then t.duyet_at is not null
             when 'da_giao'   then public._de_thi_da_giao(t.id)
             else true end
       and (p_truoc is null or t.created_at < p_truoc)
     order by t.created_at desc
     limit least(greatest(p_gioi_han, 1), 100)
  )
  select t.id, t.ten, t.khoi, t.mon, t.created_at, t.updated_at, t.duyet_at,
         nullif(t.cau_hinh -> 'deThi' ->> 'nguon', ''), nullif(t.cau_hinh -> 'deThi' ->> 'nam', '')::int,
         coalesce(t.cau_hinh -> 'deThi' ->> 'pdfGocUrl', t.file_url) is not null,
         (th.v ->> 'tong')::int, (th.v ->> 'so_chan')::int, (th.v ->> 'so_chua_dang')::int,
         (select count(*)::int from jsonb_object_keys(case when jsonb_typeof(t.cau_hinh -> 'deThi' -> 'canhBaoCau') = 'object'
                                                          then t.cau_hinh -> 'deThi' -> 'canhBaoCau' else '{}'::jsonb end)),
         -- số lần giao = lượt thi + số buổi đã gán (Giáo trình / BTVN)
         (select count(*)::int from bai_test b where b.nguon_tai_lieu_id = t.id)
           + (select count(*)::int from tai_lieu g where g.nguon_id = t.id and g.lop_id is not null and g.loai in ('giao_trinh_buoi', 'btvn')),
         greatest((select max(b.ngay) from bai_test b where b.nguon_tai_lieu_id = t.id),
                  (select max(g.ngay) from tai_lieu g where g.nguon_id = t.id and g.lop_id is not null and g.loai in ('giao_trinh_buoi', 'btvn')))
    from trang t
    cross join lateral (select public.fn_de_thi_thieu(t.id) v) th
   order by t.created_at desc
$$;
