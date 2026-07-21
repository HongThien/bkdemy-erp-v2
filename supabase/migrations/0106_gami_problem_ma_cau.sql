-- 0106 — Ô CHẤM BÁM CÂU, KHÔNG BÁM VỊ TRÍ.
--
-- Bug thật (Thùy 07-21, ET 5A2 20/07: in ra 5 câu nhưng ảnh gửi PH 6 câu):
-- `gami_session_problems` không có gì trỏ về CÂU — danh tính 1 ô chấm là `problem_no`, tức VỊ TRÍ
-- trong mảng câu của đề. Lưới lại chỉ seed MỘT LẦN rồi không theo đề nữa. Hệ quả: sửa đề (thêm/bớt/
-- đổi câu ở giữa) thì ô lệch câu → điểm gắn sang DẠNG khác → mastery sai, mà UI chỉ cảnh báo khi số
-- câu lệch (đổi câu giữ nguyên số lượng = hỏng hoàn toàn im lặng).
--
-- Sửa tận gốc: mỗi ô mang `ma_cau`. Từ nay khớp ô↔câu theo MÃ CÂU, vị trí chỉ còn là thứ tự hiển thị.
--
-- KHÔNG xoá gì trong migration này. Chỉ THÊM 1 cột + gắn nhãn cho dữ liệu cũ ở nơi CHẮC CHẮN đúng.

alter table gami_session_problems add column if not exists ma_cau text;

comment on column gami_session_problems.ma_cau is
  'Câu (kho) mà ô chấm này đại diện — danh tính THẬT của ô. NULL = ô không sinh từ đề (phase ingame), hoặc lưới đời cũ chưa xác định được câu.';

create index if not exists gami_session_problems_ma_cau_idx
  on gami_session_problems (buoi_hoc_id, phase, ma_cau);

-- ── Backfill ────────────────────────────────────────────────────────────────
-- HAI điều kiện, phải thoả CẢ HAI:
--  (1) SỐ Ô == SỐ CÂU của đề — điều kiện cần, KHÔNG đủ.
--  (2) KIỂM TRA CHÉO DẠNG: dang_chinh của câu định gắn phải KHỚP `ma_dang` sẵn có của ô.
-- Vì sao cần (2): (1) một mình KHÔNG an toàn. Phản ví dụ thật — ET 5A2 20/07 bỏ 1 câu ở GIỮA rồi
-- ô rỗng cuối bị dọn → số lại khớp nhau nhưng ô 3,4,5 vẫn giữ câu CŨ, map theo vị trí là gắn SAI.
-- `ma_dang` seed từ dang_chinh của câu LÚC CHẤM nên là nhân chứng độc lập — lệch = biết chắc sai.
-- Không thoả ⇒ để NULL, KHÔNG ĐOÁN. App sẽ hỏi người (§"thà bỏ trống còn hơn đánh sai", CLAUDE §1.5).
with doc as (
  -- Doc vận hành của buổi — đúng luật khớp của app (getETByBuoi/getBTVNByBuoi/getMTInstanceByBuoi):
  -- (lop_id, ngay), lấy bản MỚI NHẤT nếu lỡ có trùng.
  select distinct on (tl.loai, tl.lop_id, tl.ngay) tl.id, tl.loai, tl.lop_id, tl.ngay
  from tai_lieu tl
  where tl.loai in ('et', 'btvn', 'mt_buoi') and tl.lop_id is not null and tl.ngay is not null
  order by tl.loai, tl.lop_id, tl.ngay, tl.created_at desc
),
cau as (
  -- Thứ tự câu PHẢI y hệt getTaiLieuFull: phan.thu_tu rồi cau.thu_tu (id làm chốt cho ổn định).
  -- Lọc loai_phan đúng theo từng loại doc, giống getETCaus / getBTVNCaus / getMTPhanCaus.
  select d.loai, d.lop_id, d.ngay, tc.ma_cau, q.dang_chinh,
         row_number() over (partition by d.id order by tp.thu_tu, tc.thu_tu, tc.id) as rn,
         count(*)     over (partition by d.id)                                      as n_cau
  from doc d
  join tai_lieu_phan tp on tp.tai_lieu_id = d.id
  join tai_lieu_cau  tc on tc.phan_id     = tp.id
  -- dạng THẬT của câu (kho theo môn — union nên không cần biết môn ở đây) → làm nhân chứng đối chiếu
  left join (select ma_cau, dang_chinh from dai_cau_hoi
             union all
             select ma_cau, dang_chinh from khtn_cau_hoi) q on q.ma_cau = tc.ma_cau
  where (d.loai = 'et'      and tp.loai_phan = 'custom')
     or (d.loai = 'mt_buoi' and tp.loai_phan = 'custom')
     or (d.loai = 'btvn'    and tp.loai_phan = 'btvn')
),
prob as (
  select p.id, p.phase, p.problem_no, b.lop_id, b.ngay,
         count(*) over (partition by p.buoi_hoc_id, p.phase) as n_prob
  from gami_session_problems p
  join buoi_hoc b on b.id = p.buoi_hoc_id
  where p.phase in ('et', 'btvn', 'mt') and p.ma_cau is null
)
update gami_session_problems g
set    ma_cau = c.ma_cau
from   prob p
join   cau  c
       on  c.lop_id = p.lop_id
       and c.ngay   = p.ngay
       and c.loai   = case p.phase when 'mt' then 'mt_buoi' else p.phase end
       and c.rn     = p.problem_no
where  g.id = p.id
  and  p.n_prob = c.n_cau                 -- (1) số ô khớp số câu — CẦN, không đủ
  and  c.dang_chinh is not null
  and  g.ma_dang   is not null
  and  c.dang_chinh = g.ma_dang;          -- (2) kiểm tra chéo dạng — cái CHẶN gắn nhãn sai
