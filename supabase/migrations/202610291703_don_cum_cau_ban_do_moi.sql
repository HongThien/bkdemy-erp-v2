-- Dọn CỤM khỏi câu của bản đồ mới (Thùy 29/10: "bản đồ mới 4 tầng, dạng là tầng cuối, không có cụm … Dọn cụm đi, ko dùng nữa rồi").
-- Phạm vi: câu kho 'dai' ĐÃ gán dạng NDB* (bdm_cau_dang) còn mang dai_cau_hoi.ma_cum (mã DCUM… của bản đồ cũ). Câu dùng CHUNG dòng với kho cũ,
-- nên các dạng mã cũ T… trỏ tới cùng câu cũng mất cụm ⇒ rơi về "Cả dạng" (hôm nay chỉ 2 dạng đang xử: K4 T104050102, K7 T107020302).
-- KHÔNG đụng: 300 câu hgt (Hình có cụm riêng) · 124 câu dai chưa gán NDB · bảng cụm (dai_cum_bai 355, dai_cum_tien_de 20) · bai_test_cau.ma_cum (lịch sử luyện).
-- HOÀN LẠI: update dai_cau_hoi q set ma_cum = l.ma_cum from bdm_ma_cum_luu_20261029 l where l.ma_cau = q.ma_cau;
create table bdm_ma_cum_luu_20261029 (
  ma_cau text primary key,
  ma_cum text not null,
  luu_at timestamptz not null default now()
);
comment on table bdm_ma_cum_luu_20261029 is 'Bản lưu dai_cau_hoi.ma_cum của câu đã gán dạng NDB* trước khi dọn cụm 29/10 (Thùy). Khôi phục: update dai_cau_hoi set ma_cum = l.ma_cum from bdm_ma_cum_luu_20261029 l where l.ma_cau = dai_cau_hoi.ma_cau.';
alter table bdm_ma_cum_luu_20261029 enable row level security;
create policy bdm_ma_cum_luu_member_read on bdm_ma_cum_luu_20261029 for select to authenticated using (la_thanh_vien());

insert into bdm_ma_cum_luu_20261029 (ma_cau, ma_cum)
select q.ma_cau, q.ma_cum from dai_cau_hoi q
where q.ma_cum is not null and q.xoa_at is null
  and exists (select 1 from bdm_cau_dang d where d.ma_cau = q.ma_cau and d.kho = 'dai');

update dai_cau_hoi q set ma_cum = null
from bdm_ma_cum_luu_20261029 l where l.ma_cau = q.ma_cau;
