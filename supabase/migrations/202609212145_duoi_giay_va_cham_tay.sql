-- ============================================================================
-- 202609212145 — duoi_giay_va_cham_tay
-- ----------------------------------------------------------------------------
-- BỐI CẢNH (Thùy 21/09, hội thoại 3 lượt, "OK bắt đầu đi"):
--   "Bổ trợ đuổi" (Học từ đầu, mig 202609191521) hiện CHỈ có 1 đường: HS tự làm MCQ trên app, máy tự
--   chấm. Với ~1/2 số dạng CHƯA có MCQ (`spec-bo-tro.md` §10), HS không có cách nào "xong dạng" — chặn
--   tiến độ thật. Ban đầu tôi (Claude) đề xuất mirror y hệt cơ chế giấy của Bổ trợ Yếu (`fn_btyeu_giay_nhap`
--   — TA transcribe đáp án A-D, máy chấm lại) nhưng **BỊ THÙY BÁC**: Đuổi có cả câu tự luận nên ABCD không
--   tổng quát được; đúng ra phải là **TA nhập ĐCS trực tiếp** (Đúng/Chưa đạt/Sai — đúng 3 nút `ET_KQ` đã có
--   ở chấm ET thường `BuoiHocScreen.tsx:858-861`), và **Thùy nói thẳng luôn: "Yếu cũng nên giống Đuổi chứ
--   nhỉ, bên kia là do t chưa làm xong thôi"** — tức ĐCS mới là hướng đúng chung cho cả 2, không phải Đuổi
--   đi theo Yếu.
--
--   3 kịch bản, phụ thuộc DẠNG (không phải cả buổi — 1 buổi có dạng ready dạng không):
--   1. Có iPad + dạng có MCQ → tự động hoàn toàn (đã có, không đụng).
--   2. Có iPad + dạng KHÔNG MCQ → HS đọc đề (iPad hoặc giấy đều được) → TA chấm ĐCS.
--   3. Không có iPad → bắt buộc IN giấy, in ĐÚNG form gốc câu (không tự sinh MCQ giả cho câu tự luận) →
--      TA chấm ĐCS.
--   Chỉ 1 biến TA tự khai/buổi: "buổi này có iPad không" (`buoi_hoc.duoi_co_thiet_bi`, mới). "Dạng có MCQ"
--   tự derive — không cần TA chọn theo từng dạng.
--
--   Mẫu ĐCS tái dùng NGUYÊN — không phát minh mới: 3 nút Đ/C/S đã có ở `BuoiHocScreen.tsx` (chấm ET
--   thường), verdict `correct`/`partial`/`wrong`. `cham_boi='manual'` đã có sẵn trong CHECK của
--   `bai_lam_cau` (không cần nới CHECK).
--
--   `_kho_snapshot_cau` (mig 202609030307) đã TỔNG QUÁT sẵn — nhánh else xử lý MỌI `loai_cau`, không
--   chỉ trắc nghiệm. Chỉ cần bộ CHỌN câu bỏ điều kiện MCQ (`_htd_chon_cau_bat_ky`, sibling của
--   `_btyeu_chon_cau` bỏ `_kho_dk_mcq_sql`) là dùng lại được toàn bộ máy snapshot có sẵn.
--
--   NGƯỠNG PASS ≥50% (đã thống nhất trước "OK bắt đầu đi"): sửa `trg_htd_test_nop` — hiện chỉ cần NỘP
--   là ghi `test_nop_at`, không xét điểm. Verify: dữ liệu tính % đã có sẵn ở `bai_lam_cau.verdict`,
--   không cần bảng/cột mới. Áp NHƯ NHAU dù verdict đến từ tự động (`et_nop`-style so đáp án) hay từ TA
--   nhập ĐCS tay (`fn_botro_cham_tay`) — cả 2 đường đều kết thúc bằng `bai_lam.trang_thai='da_nop'` nên
--   CÙNG 1 trigger, không phải viết 2 nơi (đúng CLAUDE.md §2.0 "nguồn công thức DUY NHẤT").
--   KHÔNG hồi tố: dạng đã `test_nop_at` từ trước (luật cũ, có thể <50%) giữ nguyên, chỉ áp cho lượt nộp
--   MỚI từ migration này — tránh đánh sai dữ liệu đã có (CLAUDE.md "thà bỏ trống còn hơn đánh sai" áp
--   theo tinh thần: không suy đoán ngược để đóng/mở lại cái đã ghi).
--
--   TRẢ NỢ §2.0 nhân tiện: `getDangCuaBuoiDuoi`/`xongMapCho` (src/lib/botro_duoi.ts:47-54) đang JOIN
--   `hoc_tu_dau_dang` Ở CLIENT — tác giả đã tự ghi chú là nợ (không đủ thời gian viết RPC lúc Phase 2).
--   `fn_duoi_dang_trang_thai` thay hẳn phần tính "xong" đó BẰNG RPC, cộng thêm cờ `co_mcq` (mới, cần
--   cho việc chọn kịch bản) — 1 lần sửa trả được cả nợ cũ lẫn nhu cầu mới, không tính 2 nơi.
--
-- CỜ THIẾT BỊ (Thùy 21/09): CHỈ 1 biến TA tự khai — "buổi này có iPad không" (buổi-cấp, không phải
--   dạng-cấp). Ghép với `co_mcq` (tự derive theo dạng) ra đúng kịch bản 1/2/3 cho từng dòng dạng. Mirror
--   đúng tinh thần `buoi_hoc_hs.btyeu_che_do` bên Yếu nhưng đơn giản hơn (chỉ 1 cờ thiết bị, không phải
--   "chế độ" vì chế độ còn phụ thuộc dạng — xem cột mới `buoi_hoc.duoi_co_thiet_bi`).
--
-- MẤT GÌ (Luật xoá): không — toàn ADD (1 cột mới, 5 hàm mới, 1 hàm CREATE OR REPLACE không đổi chữ ký
--   cũ ngoài phần logic bên trong). Không đụng `fn_btyeu_*` của Bổ trợ Yếu.
--
-- ⚠ GHI CHÚ 21/09 (tối): migration này ĐÃ ÁP live 1 lần (verify bằng transaction rollback), nhưng file
--   + DEVLOG + code UI đi kèm bị 1 `git pull --rebase origin main` từ phiên khác cuốn mất khỏi working
--   tree TRƯỚC KHI KỊP COMMIT (repo main dùng chung nhiều phiên đồng thời). Đang RECREATE nguyên văn từ
--   nội dung đã viết — `CREATE OR REPLACE`/`ADD COLUMN IF NOT EXISTS` nên chạy lại vô hại (idempotent),
--   không mất dữ liệu đã có. Bài học: commit SỚM hơn ở repo dùng chung, đừng để cả buổi mới commit 1 lần.
-- ============================================================================

-- ── Cờ thiết bị mức buổi (chỉ áp buoi_hoc.loai='bo_tro_duoi') ──────────────────────────────────────
alter table buoi_hoc add column if not exists duoi_co_thiet_bi boolean;
comment on column buoi_hoc.duoi_co_thiet_bi is
  'Chỉ áp cho loai=bo_tro_duoi: buổi này TA có iPad cho em dùng không (NULL=chưa chọn). Ghép với "dạng có MCQ" (derive, fn_duoi_dang_trang_thai.co_mcq) ra kịch bản 1/2/3 — xem migration 202609212145.';

-- ── Nhánh (đại/hình) của 1 ma_dang, môn Toán — dùng để dispatch đúng bảng câu hỏi ──────────────────
create or replace function public._kho_nhanh_cua_dang(p_mon text, p_ma_dang text)
returns text
language sql stable as $$
  select case when p_mon <> 'KHTN' and exists (select 1 from hgt_ban_do where ma_dang = p_ma_dang) then 'hinh_gt' else null end
$$;

-- ── Chọn câu theo dạng, KHÔNG giới hạn MCQ (sibling _btyeu_chon_cau bỏ _kho_dk_mcq_sql) ────────────
-- Dùng cho giấy/kịch bản 2-3 của Đuổi: câu gốc trắc nghiệm hay tự luận đều lấy được, để in/hiện ĐÚNG
-- form gốc (Thùy 21/09: "không tự hệ thống tự động sinh thêm").
create or replace function public._htd_chon_cau_bat_ky(p_cautbl text, p_ma_dang text, p_tru text[], p_n integer)
returns text[]
language plpgsql security definer set search_path = public as $$
declare v_out text[] := '{}'; v_more text[];
begin
  execute format($q$
    select coalesce(array_agg(ma_cau), '{}') from (
      select c.ma_cau from %1$I c
      where c.dang_chinh = $1 and c.xoa_at is null and c.kho_chuan
        and c.ma_cau <> all($2)
      order by random() limit $3) s
  $q$, p_cautbl) into v_out using p_ma_dang, p_tru, p_n;
  if coalesce(array_length(v_out, 1), 0) < p_n then -- cạn câu chưa gặp ⇒ lặp lại (cùng tinh thần _btyeu_chon_cau)
    execute format($q$
      select coalesce(array_agg(ma_cau), '{}') from (
        select c.ma_cau from %1$I c
        where c.dang_chinh = $1 and c.xoa_at is null and c.kho_chuan
          and c.ma_cau <> all($2)
        order by random() limit $3) s
    $q$, p_cautbl) into v_more using p_ma_dang, v_out, p_n - coalesce(array_length(v_out, 1), 0);
    v_out := v_out || v_more;
  end if;
  return v_out;
end $$;

-- ── Sinh bài giấy/hiện (case 2-3) cho 1 em × 1 dạng — luyện hoặc test ───────────────────────────────
-- 1 bài / (học sinh × dạng × loại) — khớp cách "Học từ đầu" online đã làm (hoc_tu_dau_dang khoá theo
-- hoc_sinh+mon+ma_dang), KHÔNG gộp nhiều dạng vào 1 bài như bên Yếu (Yếu gộp theo CA, Đuổi theo DẠNG —
-- đúng với cách tiến độ Đuổi vốn đã tính theo dạng, không theo buổi/ca).
-- `in_giay_at` KHÔNG có nghĩa đen "đã in ra giấy" — nó đánh dấu "bài này KHÔNG PHẢI đường app-tự-làm,
-- TA phải chấm tay" (case 2 chỉ HIỆN trên iPad không tương tác, case 3 mới thực in) — tái dùng đúng cột
-- đã có bên Yếu, không thêm cột mới, comment ở đây để người sau khỏi hiểu nhầm.
create or replace function public.fn_duoi_giay_sinh(
  p_buoi uuid, p_hoc_sinh uuid, p_mon text, p_ma_dang text, p_loai text, p_so_cau integer default 5
)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_lop uuid; v_nhanh text; v_cautbl text; v_lttbl text; v_tru text[]; v_caus text[];
        v_bt uuid; i integer := 0; c text; v_n integer;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự in/hiện được đề.'; end if;
  if p_loai not in ('htd_luyen', 'htd_test') then raise exception 'loai không hợp lệ: %', p_loai; end if;
  v_n := case when p_loai = 'htd_test' then 10 else greatest(1, least(coalesce(p_so_cau, 5), 10)) end; -- test cố định 10 câu, khớp online

  select hl.lop_id into v_lop from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
    where hl.hoc_sinh_id = p_hoc_sinh and hl.trang_thai = 'dang_hoc' and l.mon = p_mon
    order by hl.ngay_vao desc limit 1;
  if v_lop is null then raise exception 'Em chưa ghi danh lớp môn %.', p_mon; end if;

  v_nhanh := public._kho_nhanh_cua_dang(p_mon, p_ma_dang);
  v_cautbl := public._kho_cau_tbl(p_mon, v_nhanh);
  v_lttbl := public._kho_lt_tbl(p_mon, v_nhanh);

  -- Né câu đã gặp CỦA ĐÚNG (em × dạng) qua MỌI bài trước đó (luyện lẫn test, giấy lẫn app — cùng nguồn).
  select coalesce(array_agg(distinct btc.ma_cau), '{}') into v_tru
    from bai_test bt2 join bai_test_cau btc on btc.bai_test_id = bt2.id
    where bt2.hoc_sinh_id = p_hoc_sinh and bt2.mon = p_mon and bt2.loai in ('htd_luyen', 'htd_test')
      and btc.ma_dang = p_ma_dang and btc.ma_cau is not null;

  v_caus := public._htd_chon_cau_bat_ky(v_cautbl, p_ma_dang, v_tru, v_n);
  if coalesce(array_length(v_caus, 1), 0) = 0 then
    raise exception 'Dạng % chưa có câu nào trong kho — chưa sinh được bài.', p_ma_dang;
  end if;

  insert into bai_test (nguon_tai_lieu_id, lop_id, hoc_sinh_id, ngay, loai, mon, so_cau, trang_thai, buoi_hoc_id, in_giay_at, created_by)
    values (null, v_lop, p_hoc_sinh, current_date, p_loai, p_mon, 0, 'mo', p_buoi, now(), public.jwt_uid())
    returning id into v_bt;
  foreach c in array v_caus loop
    i := i + 1;
    perform public._kho_snapshot_cau(v_bt, v_cautbl, v_lttbl, c, i, null);
  end loop;
  update bai_test set so_cau = i where id = v_bt;
  return jsonb_build_object('bai_test_id', v_bt, 'so_cau', i);
end $$;

-- ── TA chấm tay ĐCS — CHUNG cho mọi loại bổ trợ (Yếu sẽ chuyển sang dùng hàm này ở đợt sau) ─────────
-- Nhận thẳng bai_test_cau (câu CHƯA có ai trả lời — case 2/3 không có hành động app nào tạo bai_lam
-- trước), tự upsert bai_lam/bai_lam_cau — mirror cấu trúc `fn_btyeu_giay_nhap` nhưng verdict TRỰC TIẾP
-- (ĐCS) thay vì so đáp án A-D, nên KHÔNG giới hạn loai_cau='trac_nghiem' như hàm đó.
create or replace function public.fn_botro_cham_tay(p_bai_test_cau uuid, p_verdict text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare k record; v_bl uuid; v_tt text; v_diem numeric;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự nhập được kết quả.'; end if;
  if p_verdict is not null and p_verdict not in ('correct', 'partial', 'wrong') then
    raise exception 'verdict không hợp lệ: %', p_verdict;
  end if;
  select btc.id, btc.diem, bt.id as bt_id, bt.hoc_sinh_id, bt.loai
    into k from bai_test_cau btc join bai_test bt on bt.id = btc.bai_test_id where btc.id = p_bai_test_cau;
  if k.id is null then raise exception 'Không thấy câu.'; end if;
  if k.loai not in ('bo_tro', 'bo_tro_test', 'retest', 'htd_luyen', 'htd_test') then
    raise exception 'Chỉ chấm tay cho bài bổ trợ (yếu/bù/đuổi).';
  end if;
  if k.hoc_sinh_id is null then raise exception 'Bài không gắn học sinh.'; end if;

  insert into bai_lam (bai_test_id, hoc_sinh_id, trang_thai, bat_dau_at) values (k.bt_id, k.hoc_sinh_id, 'dang_lam', now())
    on conflict (bai_test_id, hoc_sinh_id) do update set bai_test_id = excluded.bai_test_id
    returning id, trang_thai into v_bl, v_tt;
  if v_tt = 'da_nop' then raise exception 'Bài đã nộp — không sửa được nữa.'; end if;

  if p_verdict is null then -- bấm lại ô đang chọn = xoá (thao tác sửa nhập liệu thường ngày, không phải "xoá" theo Luật xoá)
    delete from bai_lam_cau where bai_lam_id = v_bl and bai_test_cau_id = k.id;
    return jsonb_build_object('verdict', null);
  end if;
  v_diem := case p_verdict when 'correct' then coalesce(k.diem, 1) when 'partial' then coalesce(k.diem, 1) * 0.5 else 0 end;
  insert into bai_lam_cau (bai_lam_id, bai_test_cau_id, dap_an_hs, verdict, diem, cham_boi, cham_at)
    values (v_bl, k.id, null, p_verdict, v_diem, 'manual', now())
    on conflict (bai_lam_id, bai_test_cau_id) do update
      set verdict = excluded.verdict, diem = excluded.diem, cham_boi = 'manual', cham_at = now();
  return jsonb_build_object('verdict', p_verdict);
end $$;

-- ── Nộp bài giấy/tay — câu TA chưa chấm = bỏ trống = sai (§1.5, không suy đoán) ─────────────────────
create or replace function public.fn_botro_giay_nop(p_bai_test uuid)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare t record; v_bl uuid; v_trong integer;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự nộp được bài giấy.'; end if;
  select id, loai, hoc_sinh_id into t from bai_test where id = p_bai_test;
  if t.id is null or t.loai not in ('bo_tro_test', 'htd_test', 'retest') then
    raise exception 'Chỉ nộp tay cho bài KIỂM TRA.';
  end if;
  if t.hoc_sinh_id is null then raise exception 'Bài không gắn học sinh.'; end if;

  insert into bai_lam (bai_test_id, hoc_sinh_id, trang_thai, bat_dau_at) values (t.id, t.hoc_sinh_id, 'dang_lam', now())
    on conflict (bai_test_id, hoc_sinh_id) do update set bai_test_id = excluded.bai_test_id returning id into v_bl;
  insert into bai_lam_cau (bai_lam_id, bai_test_cau_id, dap_an_hs, verdict, diem, cham_boi, cham_at)
    select v_bl, k.id, null, 'wrong', 0, 'manual', now() from bai_test_cau k
    where k.bai_test_id = t.id and not exists (select 1 from bai_lam_cau x where x.bai_lam_id = v_bl and x.bai_test_cau_id = k.id);
  get diagnostics v_trong = row_count;
  update bai_lam set trang_thai = 'da_nop', nop_at = now() where id = v_bl and trang_thai = 'dang_lam';
  return jsonb_build_object('bo_trong', v_trong,
    'so_dung', (select count(*) from bai_lam_cau where bai_lam_id = v_bl and verdict = 'correct'),
    'so_cau', (select count(*) from bai_test_cau where bai_test_id = t.id));
end $$;

-- ── Ngưỡng pass ≥50% cho "xong dạng" — áp đều dù verdict đến từ auto hay tay (cùng 1 trigger) ──────
create or replace function public.trg_htd_test_nop()
returns trigger
language plpgsql
security definer set search_path = public as $$
declare
  v_bt record;
  v_ma_dang text;
  v_dung integer; v_tong integer;
begin
  select mon, loai, hoc_sinh_id into v_bt from bai_test where id = new.bai_test_id;
  if v_bt.loai <> 'htd_test' or v_bt.hoc_sinh_id is null then return new; end if;
  select ma_dang into v_ma_dang from bai_test_cau where bai_test_id = new.bai_test_id limit 1;
  if v_ma_dang is null then return new; end if;

  select count(*) filter (where verdict = 'correct'), count(*) into v_dung, v_tong
    from bai_lam_cau where bai_lam_id = new.id;
  if v_tong = 0 or v_dung::numeric / v_tong < 0.5 then return new; end if; -- Thùy 21/09: cổng pass ≥50%, không hồi tố dạng đã xong trước đây

  insert into hoc_tu_dau_dang (hoc_sinh_id, mon, ma_dang, test_bai_test_id, test_nop_at)
    values (v_bt.hoc_sinh_id, v_bt.mon, v_ma_dang, new.bai_test_id, new.nop_at)
    on conflict (hoc_sinh_id, mon, ma_dang) do update
      set test_bai_test_id = excluded.test_bai_test_id, test_nop_at = excluded.test_nop_at;
  return new;
end $$;

-- ── Trạng thái dạng của 1 buổi đuổi — thay xongMapCho() ở client (nợ §2.0 tự ghi nhận lúc Phase 2) ──
-- Trả cho MỖI (học sinh × dạng thuộc case của buổi này): đã xong chưa + dạng có MCQ không (để UI tự
-- chọn kịch bản 1 vs 2/3, KHÔNG cần TA bấm chọn theo dạng — chỉ chọn thiết bị 1 lần/buổi).
create or replace function public.fn_duoi_dang_trang_thai(p_buoi uuid)
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare r record; v_cautbl text; v_dk text; v_co_mcq boolean; v_out jsonb := '[]'::jsonb;
begin
  if not public.la_thanh_vien() then raise exception 'Chỉ nhân sự xem được.'; end if;
  for r in
    select bd.hoc_sinh_id, bd.id as bo_tro_duoi_id, l.mon, bdd.ma_dang,
           (htd.test_nop_at is not null) as xong
    from buoi_hoc_hs bh
    join bo_tro_duoi bd on bd.id = bh.bo_tro_duoi_id
    join lop l on l.id = bd.lop_id
    join bo_tro_duoi_dang bdd on bdd.bo_tro_duoi_id = bd.id
    left join hoc_tu_dau_dang htd on htd.hoc_sinh_id = bd.hoc_sinh_id and htd.mon = l.mon and htd.ma_dang = bdd.ma_dang
    where bh.buoi_hoc_id = p_buoi and bh.bo_tro_duoi_id is not null
    order by bd.hoc_sinh_id, bdd.ma_dang
  loop
    v_cautbl := public._kho_cau_tbl(r.mon, public._kho_nhanh_cua_dang(r.mon, r.ma_dang));
    v_dk := public._kho_dk_online_hs_sql(v_cautbl);
    execute format('select exists(select 1 from %1$I c where c.dang_chinh = $1 and c.xoa_at is null and %2$s)', v_cautbl, v_dk)
      into v_co_mcq using r.ma_dang;
    v_out := v_out || jsonb_build_object(
      'hoc_sinh_id', r.hoc_sinh_id, 'bo_tro_duoi_id', r.bo_tro_duoi_id, 'ma_dang', r.ma_dang,
      'xong', r.xong, 'co_mcq', v_co_mcq
    );
  end loop;
  return v_out;
end $$;

grant execute on function public.fn_duoi_giay_sinh(uuid, uuid, text, text, text, integer) to authenticated;
grant execute on function public.fn_botro_cham_tay(uuid, text) to authenticated;
grant execute on function public.fn_botro_giay_nop(uuid) to authenticated;
grant execute on function public.fn_duoi_dang_trang_thai(uuid) to authenticated;

comment on function public.fn_botro_cham_tay(uuid, text) is
  'TA chấm tay ĐCS (correct/partial/wrong) 1 câu bất kỳ loại — dùng cho bổ trợ đuổi kịch bản 2/3 (Thùy 21/09). Yếu sẽ chuyển sang dùng hàm này thay fn_btyeu_giay_nhap ở đợt sau, chưa đụng trong migration này.';
comment on function public.fn_duoi_giay_sinh(uuid, uuid, text, text, text, integer) is
  'Sinh 1 bài (luyện/test) cho 1 em × 1 dạng, KHÔNG giới hạn MCQ — in giấy hoặc hiện trên iPad không tương tác (kịch bản 2/3 Đuổi).';
