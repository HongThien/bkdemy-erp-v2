-- ════════════════════════════════════════════════════════════════════════════
-- TIỀN TỐ MÃ THEO MÔN/NHÁNH — sửa bug mã dạng & mã câu TRÙNG giữa các kho.
--
-- BUG: mã dạng = mã VỊ TRÍ (khối2+chủđề2+chuyênđề2+dạng2, vd 09010201) nên MỌI
-- kho sinh ra cùng một dải mã. Đo lường (`buoi_danh_gia_dang`, `gami_session_problems`…)
-- lưu `ma_dang` là TEXT TRẦN KHÔNG nhãn môn ⇒ ô (HS × dạng) của Toán và KHTN gộp
-- vào nhau ÂM THẦM. Trùng thực đo được: Đại∩KHTN 62 · Đại∩Hình 48 · Đại∩GT 3 ·
-- KHTN∩Hình 9 · KHTN∩GT 7 · Hình∩GT 1. Mã CÂU cũng trùng (Đại∩KHTN 4 · KHTN∩GT 22).
--
-- FIX: mỗi KHO một tiền tố — mã tự mang danh tính môn/nhánh, hết trùng ở gốc.
--   T1 = Toán/Đại (dai_)   T2 = Toán/Hình (hinh_)   T3 = Toán/Giải tích (hgt_)
--   K  = KHTN (khtn_)      [để dành: V = Văn · A = Anh]
--
-- IDEMPOTENT: mã CŨ luôn bắt đầu bằng CHỮ SỐ ('09010201', '4T010101'), mã MỚI luôn
-- bắt đầu bằng CHỮ CÁI ⇒ guard `~ '^[0-9]'` cho phép chạy lại mà không chồng tiền tố.
--
-- PHÂN GIẢI dòng TEXT TRẦN (không FK) — thứ tự nhân chứng, KHÔNG đoán (§1.5/§2):
--   1. ma_cau  — mã câu Đại∩GT = 0 nên đây là nhân chứng SẠCH cho Đại↔Giải tích
--   2. ma_dang chỉ tồn tại ở ĐÚNG MỘT kho ⇒ tự định danh
--   3. mon/nhanh của lớp/tài liệu (Toán+nhanh='hinh_gt' ⇒ T3, còn lại ⇒ T1)
--   4. mốc thời gian: kho hgt_ sinh 10/08/2026, câu đầu 11/08 ⇒ dòng đo TRƯỚC
--      10/08 KHÔNG THỂ là Giải tích
--   Không ra kết quả ⇒ ĐỂ NGUYÊN (thà bỏ trống còn hơn đánh sai). Dry-run đếm số này.
-- ════════════════════════════════════════════════════════════════════════════

-- ── 1. FK: bổ sung ON UPDATE CASCADE (12 constraint đang thiếu) ──────────────
-- Thiếu ON UPDATE ⇒ đổi PK là DB chặn. Phải nới TRƯỚC khi đổi mã.
alter table dai_cum_bai drop constraint dai_cum_bai_ma_dang_fkey;
alter table dai_cum_bai add constraint dai_cum_bai_ma_dang_fkey
  foreign key (ma_dang) references dai_ban_do(ma_dang) on update cascade on delete cascade;

alter table dai_dang_tien_de drop constraint dai_dang_tien_de_ma_dang_fkey;
alter table dai_dang_tien_de add constraint dai_dang_tien_de_ma_dang_fkey
  foreign key (ma_dang) references dai_ban_do(ma_dang) on update cascade on delete cascade;
alter table dai_dang_tien_de drop constraint dai_dang_tien_de_tien_de_ma_dang_fkey;
alter table dai_dang_tien_de add constraint dai_dang_tien_de_tien_de_ma_dang_fkey
  foreign key (tien_de_ma_dang) references dai_ban_do(ma_dang) on update cascade on delete cascade;

alter table hgt_cau_hoi drop constraint hgt_cau_hoi_dang_chinh_fkey;
alter table hgt_cau_hoi add constraint hgt_cau_hoi_dang_chinh_fkey
  foreign key (dang_chinh) references hgt_ban_do(ma_dang) on update cascade on delete restrict;

alter table hgt_dang_ly_thuyet drop constraint hgt_dang_ly_thuyet_ma_dang_fkey;
alter table hgt_dang_ly_thuyet add constraint hgt_dang_ly_thuyet_ma_dang_fkey
  foreign key (ma_dang) references hgt_ban_do(ma_dang) on update cascade on delete cascade;

alter table khtn_cau_hoi drop constraint khtn_cau_hoi_dang_chinh_fkey;
alter table khtn_cau_hoi add constraint khtn_cau_hoi_dang_chinh_fkey
  foreign key (dang_chinh) references khtn_ban_do(ma_dang) on update cascade on delete restrict;

alter table khtn_cum_bai drop constraint khtn_cum_bai_ma_dang_fkey;
alter table khtn_cum_bai add constraint khtn_cum_bai_ma_dang_fkey
  foreign key (ma_dang) references khtn_ban_do(ma_dang) on update cascade on delete cascade;

alter table khtn_dang_ly_thuyet drop constraint khtn_dang_ly_thuyet_ma_dang_fkey;
alter table khtn_dang_ly_thuyet add constraint khtn_dang_ly_thuyet_ma_dang_fkey
  foreign key (ma_dang) references khtn_ban_do(ma_dang) on update cascade on delete cascade;

alter table khtn_dang_tien_de drop constraint khtn_dang_tien_de_ma_dang_fkey;
alter table khtn_dang_tien_de add constraint khtn_dang_tien_de_ma_dang_fkey
  foreign key (ma_dang) references khtn_ban_do(ma_dang) on update cascade on delete cascade;
alter table khtn_dang_tien_de drop constraint khtn_dang_tien_de_tien_de_ma_dang_fkey;
alter table khtn_dang_tien_de add constraint khtn_dang_tien_de_tien_de_ma_dang_fkey
  foreign key (tien_de_ma_dang) references khtn_ban_do(ma_dang) on update cascade on delete cascade;

-- ── 2. ẢNH CHỤP mã CŨ (để phân giải sau khi kho đã đổi + để verify/rollback tra cứu) ──
create table if not exists _tt_mapping (
  kho      text not null,          -- T1 | T2 | T3 | K
  loai     text not null,          -- 'dang' | 'cau'
  ma_cu    text not null,
  ma_moi   text not null,
  primary key (kho, loai, ma_cu)
);
truncate _tt_mapping;
insert into _tt_mapping (kho, loai, ma_cu, ma_moi)
  select 'T1','dang', ma_dang,      'T1'||ma_dang      from dai_ban_do   where ma_dang ~ '^[0-9]'
  union all select 'T2','dang', ma_dang_hinh,'T2'||ma_dang_hinh from hinh_ban_do where ma_dang_hinh ~ '^[0-9]'
  union all select 'T3','dang', ma_dang,     'T3'||ma_dang      from hgt_ban_do  where ma_dang ~ '^[0-9]'
  union all select 'K', 'dang', ma_dang,     'K' ||ma_dang      from khtn_ban_do where ma_dang ~ '^[0-9]'
  union all select 'T1','cau',  ma_cau,      'T1'||ma_cau       from dai_cau_hoi  where ma_cau ~ '^[0-9]'
  union all select 'T3','cau',  ma_cau,      'T3'||ma_cau       from hgt_cau_hoi  where ma_cau ~ '^[0-9]'
  union all select 'K', 'cau',  ma_cau,      'K' ||ma_cau       from khtn_cau_hoi where ma_cau ~ '^[0-9]';

-- PK là (kho, loai, ma_cu) nên tra theo (loai, ma_cu) KHÔNG dùng được PK ⇒ seq scan
-- ~13k dòng × mỗi lần gọi _tt_kho × ~30k dòng đo = treo. Index này là bắt buộc.
create index if not exists _tt_mapping_tra_cuu on _tt_mapping (loai, ma_cu);
analyze _tt_mapping;

-- ── 3. HÀM PHÂN GIẢI: một dòng đo thuộc KHO nào? ────────────────────────────
-- Trả 'T1'|'T2'|'T3'|'K', hoặc NULL = KHÔNG phân giải được ⇒ caller KHÔNG được đụng.
-- Đọc từ _tt_mapping (mã CŨ) nên gọi được cả trước lẫn sau khi kho đã đổi.
create or replace function _tt_kho(
  p_mon text, p_nhanh text, p_ma_dang text, p_ma_cau text, p_ngay date
) returns text language plpgsql stable as $$
declare
  c_cau  text[];   -- kho ứng viên theo mã CÂU
  c_dang text[];   -- kho ứng viên theo mã DẠNG
  cand   text[];
  v_mon  text := lower(coalesce(p_mon,''));
begin
  -- ⚠ KHÔNG short-circuit từng nhân chứng rồi bỏ cuộc. Mỗi nhân chứng chỉ THU HẸP
  -- tập ứng viên; kết luận chỉ khi còn ĐÚNG MỘT. (Bản đầu return sớm ở nhân chứng
  -- mã câu ⇒ 103 dòng Giải tích bị bỏ sót vì mã câu của chúng trùng KHTN.)
  if p_ma_cau is not null and p_ma_cau ~ '^[0-9]' then
    select array_agg(distinct kho) into c_cau from _tt_mapping where loai='cau' and ma_cu = p_ma_cau;
  end if;
  if p_ma_dang is not null and p_ma_dang ~ '^[0-9]' then
    -- LOẠI T2 (kho Hình): `hinh_ban_do.ma_dang_hinh` KHÔNG được cột nào khác tham chiếu
    -- (kiểm information_schema: chỉ xuất hiện trong chính hinh_ban_do). Nhánh Hình nối
    -- vào đo bằng `hinh_y_id` (uuid) ở gami_session_problems/canh_bao_yeu, KHÔNG bằng
    -- ma_dang text. ⇒ một ô text trần không thể là T2; để T2 trong tập ứng viên chỉ làm
    -- kẹt 563 dòng Đại vốn phân giải được (48 mã Đại∩Hình).
    select array_agg(distinct kho) into c_dang from _tt_mapping
     where loai='dang' and ma_cu = p_ma_dang and kho <> 'T2';
  end if;

  -- (1) GIAO hai nhân chứng mã. Thiếu bên nào thì lấy bên kia. Giao RỖNG = hai nhân
  --     chứng MÂU THUẪN ⇒ bỏ cả lượt (§2 "lệch dù 1 phần tử ⇒ để trống, hỏi người").
  if    c_cau is null and c_dang is null then return null;
  elsif c_cau is null  then cand := c_dang;
  elsif c_dang is null then cand := c_cau;
  else  select array_agg(k) into cand from unnest(c_cau) k where k = any(c_dang);
  end if;
  if cand is null or array_length(cand,1) = 0 then return null; end if;
  if array_length(cand,1) = 1 then return cand[1]; end if;

  -- (2) thu hẹp bằng nhãn MÔN
  if v_mon = 'khtn' then
    select array_agg(k) into cand from unnest(cand) k where k = 'K';
  elsif v_mon in ('toán','toan') then
    select array_agg(k) into cand from unnest(cand) k where k <> 'K';
  end if;
  if cand is null or array_length(cand,1) = 0 then return null; end if;
  if array_length(cand,1) = 1 then return cand[1]; end if;

  -- (3) thu hẹp bằng NHÁNH. 'hinh_gt' ⇒ Giải tích; 'dai' ⇒ caller KHẲNG ĐỊNH là Đại
  --     (tai_lieu.nhanh trống + môn Toán = Đại, xem tailieu.ts). NULL = KHÔNG BIẾT,
  --     khác hẳn 'dai' — không được lẫn.
  if p_nhanh = 'hinh_gt' then
    select array_agg(k) into cand from unnest(cand) k where k = 'T3';
  elsif p_nhanh = 'dai' then
    select array_agg(k) into cand from unnest(cand) k where k <> 'T3';
  -- (4) không biết nhánh ⇒ mốc thời gian: kho hgt_ sinh 10/08/2026, câu đầu 11/08
  --     ⇒ dòng đo TRƯỚC 10/08 không thể là Giải tích.
  elsif p_ngay is not null and p_ngay < date '2026-08-10' then
    select array_agg(k) into cand from unnest(cand) k where k <> 'T3';
  end if;
  if cand is null or array_length(cand,1) = 0 then return null; end if;
  if array_length(cand,1) = 1 then return cand[1]; end if;

  return null;                                                -- vẫn nhập nhằng ⇒ để nguyên
end $$;

-- ── 4. ĐỔI MÃ TRONG KHO (PK) — FK ON UPDATE CASCADE lo các bảng con ─────────
update dai_ban_do   set ma_dang      = 'T1'||ma_dang      where ma_dang      ~ '^[0-9]';
update hinh_ban_do  set ma_dang_hinh = 'T2'||ma_dang_hinh where ma_dang_hinh ~ '^[0-9]';
update hgt_ban_do   set ma_dang      = 'T3'||ma_dang      where ma_dang      ~ '^[0-9]';
update khtn_ban_do  set ma_dang      = 'K' ||ma_dang      where ma_dang      ~ '^[0-9]';

-- `parent_ma_cau` là self-FK: ON UPDATE CASCADE KHÔNG dùng được khi đổi hàng loạt PK
-- ngay trong cùng bảng (cascade sửa parent của dòng chưa tới lượt ⇒ vi phạm giữa chừng).
-- ⇒ gỡ FK, đổi CẢ HAI cột trong MỘT câu (cùng kho ⇒ cùng tiền tố), rồi gắn lại.
alter table dai_cau_hoi  drop constraint dai_cau_hoi_parent_ma_cau_fkey;
alter table hgt_cau_hoi  drop constraint hgt_cau_hoi_parent_ma_cau_fkey;
alter table khtn_cau_hoi drop constraint khtn_cau_hoi_parent_ma_cau_fkey;

update dai_cau_hoi set
  ma_cau        = case when ma_cau        ~ '^[0-9]' then 'T1'||ma_cau        else ma_cau        end,
  parent_ma_cau = case when parent_ma_cau ~ '^[0-9]' then 'T1'||parent_ma_cau else parent_ma_cau end
where ma_cau ~ '^[0-9]' or parent_ma_cau ~ '^[0-9]';

update hgt_cau_hoi set
  ma_cau        = case when ma_cau        ~ '^[0-9]' then 'T3'||ma_cau        else ma_cau        end,
  parent_ma_cau = case when parent_ma_cau ~ '^[0-9]' then 'T3'||parent_ma_cau else parent_ma_cau end
where ma_cau ~ '^[0-9]' or parent_ma_cau ~ '^[0-9]';

update khtn_cau_hoi set
  ma_cau        = case when ma_cau        ~ '^[0-9]' then 'K'||ma_cau        else ma_cau        end,
  parent_ma_cau = case when parent_ma_cau ~ '^[0-9]' then 'K'||parent_ma_cau else parent_ma_cau end
where ma_cau ~ '^[0-9]' or parent_ma_cau ~ '^[0-9]';

alter table dai_cau_hoi add constraint dai_cau_hoi_parent_ma_cau_fkey
  foreign key (parent_ma_cau) references dai_cau_hoi(ma_cau) on update cascade on delete set null;
alter table hgt_cau_hoi add constraint hgt_cau_hoi_parent_ma_cau_fkey
  foreign key (parent_ma_cau) references hgt_cau_hoi(ma_cau) on update cascade;
alter table khtn_cau_hoi add constraint khtn_cau_hoi_parent_ma_cau_fkey
  foreign key (parent_ma_cau) references khtn_cau_hoi(ma_cau) on update cascade;

-- ── 5. ĐO LƯỜNG & VẬN HÀNH (text trần, không FK) ────────────────────────────
-- Mẫu chung: FROM là subquery ĐỌC bảng đích + nguồn nhân chứng, trả (khoá, kho).
-- (Không dùng LATERAL tham chiếu bảng đích — Postgres cấm trong UPDATE…FROM.)
-- `kho is null` ⇒ dòng đó KHÔNG được đụng (§1.5 thà bỏ trống còn hơn đánh sai).

-- 5.1 bai_test_cau — môn từ bai_test.mon
update bai_test_cau x set
  ma_dang = s.kho || x.ma_dang,
  ma_cau  = case when x.ma_cau ~ '^[0-9]' then s.kho || x.ma_cau else x.ma_cau end
from (select y.id, _tt_kho(t.mon, null, y.ma_dang, y.ma_cau, t.ngay) kho
      from bai_test_cau y join bai_test t on t.id = y.bai_test_id
      where y.ma_dang ~ '^[0-9]') s
where s.id = x.id and s.kho is not null;

-- câu KHÔNG kèm mã dạng: phân giải riêng theo ma_cau
update bai_test_cau x set ma_cau = s.kho || x.ma_cau
from (select y.id, _tt_kho(t.mon, null, null, y.ma_cau, t.ngay) kho
      from bai_test_cau y join bai_test t on t.id = y.bai_test_id
      where y.ma_cau ~ '^[0-9]') s
where s.id = x.id and s.kho is not null;

-- 5.2 bo_tro_duoi_dang — môn từ lớp của phiếu bổ trợ
update bo_tro_duoi_dang x set ma_dang = s.kho || x.ma_dang
from (select y.id, _tt_kho(l.mon, null, y.ma_dang, null, y.created_at::date) kho
      from bo_tro_duoi_dang y join bo_tro_duoi p on p.id = y.bo_tro_duoi_id
        left join lop l on l.id = p.lop_id
      where y.ma_dang ~ '^[0-9]') s
where s.id = x.id and s.kho is not null;

-- 5.3 bo_tro_yeu_dang — môn ngay trên bo_tro_yeu
update bo_tro_yeu_dang x set ma_dang = s.kho || x.ma_dang
from (select y.id, _tt_kho(p.mon, null, y.ma_dang, null, y.created_at::date) kho
      from bo_tro_yeu_dang y join bo_tro_yeu p on p.id = y.bo_tro_yeu_id
      where y.ma_dang ~ '^[0-9]') s
where s.id = x.id and s.kho is not null;

-- 5.4 bt_grades — môn + NHÁNH từ tài liệu (nhánh phân biệt Đại ↔ Giải tích)
update bt_grades x set
  ma_dang = s.kho || x.ma_dang,
  ma_cau  = case when x.ma_cau ~ '^[0-9]' then s.kho || x.ma_cau else x.ma_cau end
from (select y.id, _tt_kho(t.mon, coalesce(t.nhanh, 'dai'), y.ma_dang, y.ma_cau, t.ngay) kho
      from bt_grades y join tai_lieu t on t.id = y.tai_lieu_id
      where y.ma_dang ~ '^[0-9]') s
where s.id = x.id and s.kho is not null;

-- 5.5 buoi_danh_gia_dang — môn từ lớp của buổi; buổi BÙ (lop_id null) đi qua buổi GỐC
--     (bu_cho_buoi_id trên buoi_hoc_hs) — 304 dòng chỉ ra được môn bằng đường này.
update buoi_danh_gia_dang x set ma_dang = s.kho || x.ma_dang
from (select y.buoi_hoc_id, y.hoc_sinh_id, y.ma_dang,
             _tt_kho(coalesce(l.mon, (
                 select lg.mon from buoi_hoc_hs h
                   join buoi_hoc g on g.id = h.bu_cho_buoi_id
                   join lop lg on lg.id = g.lop_id
                 where h.buoi_hoc_id = b.id and h.hoc_sinh_id = y.hoc_sinh_id limit 1)),
               null, y.ma_dang, null, b.ngay) kho
      from buoi_danh_gia_dang y join buoi_hoc b on b.id = y.buoi_hoc_id
        left join lop l on l.id = b.lop_id
      where y.ma_dang ~ '^[0-9]') s
where s.buoi_hoc_id = x.buoi_hoc_id and s.hoc_sinh_id = x.hoc_sinh_id and s.ma_dang = x.ma_dang
  and s.kho is not null;

-- 5.6 ca_test_cau — môn từ ca_test
update ca_test_cau x set
  ma_dang = s.kho || x.ma_dang,
  ma_cau  = case when x.ma_cau ~ '^[0-9]' then s.kho || x.ma_cau else x.ma_cau end
from (select y.id, _tt_kho(t.mon, null, y.ma_dang, y.ma_cau, y.created_at::date) kho
      from ca_test_cau y join ca_test t on t.id = y.ca_test_id
      where y.ma_dang ~ '^[0-9]') s
where s.id = x.id and s.kho is not null;

update ca_test_cau x set ma_cau = s.kho || x.ma_cau
from (select y.id, _tt_kho(t.mon, null, null, y.ma_cau, y.created_at::date) kho
      from ca_test_cau y join ca_test t on t.id = y.ca_test_id
      where y.ma_cau ~ '^[0-9]') s
where s.id = x.id and s.kho is not null;

-- 5.7 canh_bao_yeu — môn từ lớp của buổi (buổi bù qua buổi gốc)
update canh_bao_yeu x set ma_dang = s.kho || x.ma_dang
from (select y.id,
             _tt_kho(coalesce(l.mon, (
                 select lg.mon from buoi_hoc_hs h
                   join buoi_hoc g on g.id = h.bu_cho_buoi_id
                   join lop lg on lg.id = g.lop_id
                 where h.buoi_hoc_id = b.id and h.hoc_sinh_id = y.hoc_sinh_id limit 1)),
               null, y.ma_dang, null, b.ngay) kho
      from canh_bao_yeu y join buoi_hoc b on b.id = y.buoi_hoc_id
        left join lop l on l.id = b.lop_id
      where y.ma_dang ~ '^[0-9]') s
where s.id = x.id and s.kho is not null;

-- canh_bao_yeu KHÔNG gắn buổi ⇒ không có nhân chứng môn: chỉ nhận mã tự định danh
-- (chỉ tồn tại ở 1 kho). Nhập nhằng thì để nguyên.
update canh_bao_yeu x set ma_dang = s.kho || x.ma_dang
from (select y.id, _tt_kho(null, null, y.ma_dang, null, y.created_at::date) kho
      from canh_bao_yeu y where y.buoi_hoc_id is null and y.ma_dang ~ '^[0-9]') s
where s.id = x.id and s.kho is not null;

-- 5.8 gami_session_problems — môn từ lớp của buổi (buổi bù qua buổi gốc);
--     ma_cau là nhân chứng MẠNH hơn (Đại∩GT = 0) và được _tt_kho ưu tiên.
update gami_session_problems x set
  ma_dang = s.kho || x.ma_dang,
  ma_cau  = case when x.ma_cau ~ '^[0-9]' then s.kho || x.ma_cau else x.ma_cau end
from (select y.id,
             _tt_kho(coalesce(l.mon, (
                 select lg.mon from buoi_hoc_hs h
                   join buoi_hoc g on g.id = h.bu_cho_buoi_id
                   join lop lg on lg.id = g.lop_id
                 where h.buoi_hoc_id = b.id and h.hoc_sinh_id = y.hoc_sinh_id limit 1)),
               null, y.ma_dang, y.ma_cau, b.ngay) kho
      from gami_session_problems y join buoi_hoc b on b.id = y.buoi_hoc_id
        left join lop l on l.id = b.lop_id
      where y.ma_dang ~ '^[0-9]') s
where s.id = x.id and s.kho is not null;

-- dòng chỉ có ma_cau (không ma_dang)
update gami_session_problems x set ma_cau = s.kho || x.ma_cau
from (select y.id, _tt_kho(null, null, null, y.ma_cau, b.ngay) kho
      from gami_session_problems y join buoi_hoc b on b.id = y.buoi_hoc_id
      where y.ma_cau ~ '^[0-9]') s
where s.id = x.id and s.kho is not null;

-- 5.9 tai_lieu_phan.ref_ma (loai_phan dang/btvn/ontap ⇒ ref_ma là ma_dang)
update tai_lieu_phan x set ref_ma = s.kho || x.ref_ma
from (select p.id, _tt_kho(t.mon, coalesce(t.nhanh, 'dai'), p.ref_ma, null, t.ngay) kho
      from tai_lieu_phan p join tai_lieu t on t.id = p.tai_lieu_id
      where p.ref_ma ~ '^[0-9]') s
where s.id = x.id and s.kho is not null;

-- 5.10 tai_lieu_cau.ma_cau — qua phan → tài liệu
update tai_lieu_cau x set ma_cau = s.kho || x.ma_cau
from (select tc.id, _tt_kho(t.mon, coalesce(t.nhanh, 'dai'), null, tc.ma_cau, t.ngay) kho
      from tai_lieu_cau tc join tai_lieu_phan p on p.id = tc.phan_id
        join tai_lieu t on t.id = p.tai_lieu_id
      where tc.ma_cau ~ '^[0-9]') s
where s.id = x.id and s.kho is not null;

-- 5.11 kho_cau_log — cột `tbl` chính là nhân chứng (dai_cau_hoi | khtn_cau_hoi | hgt_cau_hoi)
update kho_cau_log set ma_cau =
  case tbl when 'dai_cau_hoi' then 'T1' when 'khtn_cau_hoi' then 'K' when 'hgt_cau_hoi' then 'T3' end || ma_cau
where ma_cau ~ '^[0-9]' and tbl in ('dai_cau_hoi','khtn_cau_hoi','hgt_cau_hoi');

-- 5.12 kho_tag_log — mon='toan' toàn bộ; ai_value/final_value là mã DẠNG do AI gợi ý
update kho_tag_log set
  ma_cau      = case when ma_cau      ~ '^[0-9]'     then 'T1'||ma_cau      else ma_cau      end,
  ai_value    = case when ai_value    ~ '^[0-9]{8}$' then 'T1'||ai_value    else ai_value    end,
  final_value = case when final_value ~ '^[0-9]{8}$' then 'T1'||final_value else final_value end
where lower(mon) in ('toan','toán')
  and (ma_cau ~ '^[0-9]' or ai_value ~ '^[0-9]{8}$' or final_value ~ '^[0-9]{8}$');

-- 5.13 question_accepted_answers — không có nhãn môn ⇒ chỉ nhận mã tự định danh
update question_accepted_answers x set ma_cau = s.kho || x.ma_cau
from (select y.id, _tt_kho(null, null, null, y.ma_cau, null) kho
      from question_accepted_answers y where y.ma_cau ~ '^[0-9]') s
where s.id = x.id and s.kho is not null;

-- ── 6. JSONB ────────────────────────────────────────────────────────────────
-- 6.1 btvn_ontap_config.config = {dangs:[{ma_dang, ma_caus[], linesByCau{ma_cau:n}}], skipped}
--     Chỉ ghi khi MỌI dạng trong config phân giải được (một phần tử lệch ⇒ bỏ cả lượt).
update btvn_ontap_config x set config = s.cfg
from (
  select cfg.id,
         jsonb_set(cfg.config, '{dangs}', coalesce((
           select jsonb_agg(
             d - 'ma_dang' - 'ma_caus' - 'linesByCau'
               || jsonb_build_object('ma_dang', kd.kho || (d->>'ma_dang'))
               || case when d ? 'ma_caus' then jsonb_build_object('ma_caus', coalesce((
                      select jsonb_agg(case when mc ~ '^[0-9]' then kd.kho||mc else mc end)
                      from jsonb_array_elements_text(d->'ma_caus') mc), '[]'::jsonb)) else '{}'::jsonb end
               || case when d ? 'linesByCau' then jsonb_build_object('linesByCau', coalesce((
                      select jsonb_object_agg(case when kk ~ '^[0-9]' then kd.kho||kk else kk end, vv)
                      from jsonb_each(d->'linesByCau') e(kk, vv)), '{}'::jsonb)) else '{}'::jsonb end)
           from jsonb_array_elements(cfg.config->'dangs') d
                cross join lateral (select _tt_kho(l.mon, null, d->>'ma_dang', null, null) kho) kd
         ), '[]'::jsonb)) cfg
  from btvn_ontap_config cfg join lop l on l.id = cfg.lop_id
  where cfg.config ? 'dangs'
    and exists (select 1 from jsonb_array_elements(cfg.config->'dangs') dd where dd->>'ma_dang' ~ '^[0-9]')
    and not exists (select 1 from jsonb_array_elements(cfg.config->'dangs') dd
                    where dd->>'ma_dang' ~ '^[0-9]'
                      and _tt_kho(l.mon, null, dd->>'ma_dang', null, null) is null)
) s
where s.id = x.id;

-- 6.2 tai_lieu.cau_hinh — 3 map KHOÁ theo ma_cau (btvnLinesByCau · etFormByCau · colByCau)
--     + etMaDe (khoá ma_cau, GIÁ TRỊ là mảng ma_cau/null).
--     phanBac (khoá = phan.id) và hsMaDe (khoá = hoc_sinh_id) KHÔNG đụng.
--     Kho suy thẳng từ (mon, nhanh) của tài liệu — mọi câu trong 1 tài liệu cùng 1 kho.
update tai_lieu x set cau_hinh = s.ch
from (
  select t.id,
    t.cau_hinh
    || case when t.cau_hinh ? 'btvnLinesByCau' then jsonb_build_object('btvnLinesByCau', coalesce((
         select jsonb_object_agg(case when kk ~ '^[0-9]' then k.kho||kk else kk end, vv)
         from jsonb_each(t.cau_hinh->'btvnLinesByCau') e(kk,vv)), '{}'::jsonb)) else '{}'::jsonb end
    || case when t.cau_hinh ? 'etFormByCau' then jsonb_build_object('etFormByCau', coalesce((
         select jsonb_object_agg(case when kk ~ '^[0-9]' then k.kho||kk else kk end, vv)
         from jsonb_each(t.cau_hinh->'etFormByCau') e(kk,vv)), '{}'::jsonb)) else '{}'::jsonb end
    || case when t.cau_hinh ? 'colByCau' then jsonb_build_object('colByCau', coalesce((
         select jsonb_object_agg(case when kk ~ '^[0-9]' then k.kho||kk else kk end, vv)
         from jsonb_each(t.cau_hinh->'colByCau') e(kk,vv)), '{}'::jsonb)) else '{}'::jsonb end
    || case when t.cau_hinh ? 'etMaDe' then jsonb_build_object('etMaDe', coalesce((
         select jsonb_object_agg(
                  case when kk ~ '^[0-9]' then k.kho||kk else kk end,
                  coalesce((select jsonb_agg(case when jsonb_typeof(el)='string' and el#>>'{}' ~ '^[0-9]'
                                                  then to_jsonb(k.kho || (el#>>'{}')) else el end)
                            from jsonb_array_elements(vv) el), '[]'::jsonb))
         from jsonb_each(t.cau_hinh->'etMaDe') e(kk,vv)), '{}'::jsonb)) else '{}'::jsonb end AS ch
  from tai_lieu t
       cross join lateral (select case when lower(coalesce(t.mon,'')) = 'khtn' then 'K'
                                       when t.nhanh = 'hinh_gt' then 'T3' else 'T1' end kho) k
  where t.cau_hinh is not null
    and t.cau_hinh ?| array['btvnLinesByCau','etFormByCau','colByCau','etMaDe']
) s
where s.id = x.id;

-- ── 7. DỌN ──────────────────────────────────────────────────────────────────
-- GIỮ `_tt_mapping` (tra cứu mã cũ ↔ mới khi soi lại data lịch sử). Bỏ hàm tạm.
drop function if exists _tt_kho(text, text, text, text, date);
