-- Gán dạng bài + tự duyệt câu 5T đang ở dạng chờ "Chưa phân dạng" (Thùy 01/11: "đẩy toàn bộ các bài đã giải vào kho như luật đẩy kho:
-- câu nào chắc chắn tự duyệt").
-- CÁCH PHÂN: 8 lượt AI độc lập (2 lượt × 4 lô, lượt B đi từ lời giải). "CHẮC CHẮN" = cả hai lượt cùng chọn 1 dạng bài, cùng ghi độ chắc cao
--   VÀ câu đã được kiểm đáp số "khớp" (kiem_may='khop'). Hai lượt không lệch câu nào; câu máy nghi (kiem_may='nghi') KHÔNG đụng.
-- GHI: (1) 128 câu chắc chắn → dai_bdm_gan_cau nguon 'ai' + da_duyet=true duyet_nguon='ai' (như 73 câu AI đã duyệt trước đó);
--      (2) 50 câu chỉ một lượt chọn → ĐỀ XUẤT dai_bdm_de_xuat chac 'vua' (chờ người duyệt, chưa dùng được).
--      Còn lại (610 câu cả hai lượt để trống: hình học, chuyển động, phần trăm, trung bình cộng…) giữ nguyên dạng chờ.
-- MẤT GÌ: không xoá gì. Không sửa đáp án/lời giải. Chỉ thêm dòng gán/đề xuất và bật da_duyet cho câu đã khớp.

do $$
declare n_gan int; n_dd int; n_dx int;
begin
  create temp table _chac(ma_cau text, db text) on commit drop;
  insert into _chac values
    ('T15T000000016','NDB01806'),
    ('T15T000000017','NDB01807'),
    ('T15T000000029','NDB01799'),
    ('T15T000000033','NDB01803'),
    ('T15T000000034','NDB01804'),
    ('T15T000000035','NDB01805'),
    ('T15T000000044','NDB01813'),
    ('T15T000000045','NDB01813'),
    ('T15T000000046','NDB01815'),
    ('T15T000000049','NDB01797'),
    ('T15T000000112','NDB01810'),
    ('T15T000000118','NDB01810'),
    ('T15T000000125','NDB01811'),
    ('T15T000000126','NDB01811'),
    ('T15T000000150','NDB01806'),
    ('T15T000000151','NDB01807'),
    ('T15T000000152','NDB01800'),
    ('T15T000000153','NDB01806'),
    ('T15T000000154','NDB01806'),
    ('T15T000000157','NDB01807'),
    ('T15T000000158','NDB01807'),
    ('T15T000000159','NDB01807'),
    ('T15T000000160','NDB01807'),
    ('T15T000000161','NDB01807'),
    ('T15T000000163','NDB01807'),
    ('T15T000000165','NDB01809'),
    ('T15T000000166','NDB01797'),
    ('T15T000000167','NDB01797'),
    ('T15T000000168','NDB01798'),
    ('T15T000000169','NDB01800'),
    ('T15T000000170','NDB01800'),
    ('T15T000000171','NDB01800'),
    ('T15T000000233','NDB01797'),
    ('T15T000000246','NDB01797'),
    ('T15T000000249','NDB01800'),
    ('T15T000000251','NDB01801'),
    ('T15T000000252','NDB01800'),
    ('T15T000000255','NDB01812'),
    ('T15T000000256','NDB01812'),
    ('T15T000000257','NDB01812'),
    ('T15T000000258','NDB01812'),
    ('T15T000000265','NDB01812'),
    ('T15T000000266','NDB01812'),
    ('T15T000000267','NDB01812'),
    ('T15T000000269','NDB01812'),
    ('T15T000000270','NDB01812'),
    ('T15T000000271','NDB01812'),
    ('T15T000000272','NDB01812'),
    ('T15T000000289','NDB01813'),
    ('T15T000000290','NDB01813'),
    ('T15T000000291','NDB01813'),
    ('T15T000000292','NDB01813'),
    ('T15T000000293','NDB01813'),
    ('T15T000000294','NDB01813'),
    ('T15T000000295','NDB01813'),
    ('T15T000000296','NDB01813'),
    ('T15T000000297','NDB01813'),
    ('T15T000000298','NDB01814'),
    ('T15T000000300','NDB01814'),
    ('T15T000000301','NDB01814'),
    ('T15T000000302','NDB01814'),
    ('T15T000000303','NDB01814'),
    ('T15T000000304','NDB01813'),
    ('T15T000000305','NDB01813'),
    ('T15T000000306','NDB01813'),
    ('T15T000000307','NDB01813'),
    ('T15T000000308','NDB01813'),
    ('T15T000000309','NDB01814'),
    ('T15T000000310','NDB01814'),
    ('T15T000000311','NDB01814'),
    ('T15T000000312','NDB01814'),
    ('T15T000000313','NDB01815'),
    ('T15T000000314','NDB01815'),
    ('T15T000000315','NDB01815'),
    ('T15T000000316','NDB01815'),
    ('T15T000000317','NDB01815'),
    ('T15T000000318','NDB01815'),
    ('T15T000000319','NDB01815'),
    ('T15T000000320','NDB01815'),
    ('T15T000000321','NDB01815'),
    ('T15T000000322','NDB01815'),
    ('T15T000000323','NDB01815'),
    ('T15T000000324','NDB01815'),
    ('T15T000000325','NDB01815'),
    ('T15T000000326','NDB01815'),
    ('T15T000000327','NDB01815'),
    ('T15T000000328','NDB01817'),
    ('T15T000000329','NDB01817'),
    ('T15T000000330','NDB01817'),
    ('T15T000000331','NDB01817'),
    ('T15T000000332','NDB01817'),
    ('T15T000000419','NDB01803'),
    ('T15T000000420','NDB01804'),
    ('T15T000000421','NDB01805'),
    ('T15T000000422','NDB01803'),
    ('T15T000000423','NDB01803'),
    ('T15T000000424','NDB01803'),
    ('T15T000000425','NDB01804'),
    ('T15T000000426','NDB01804'),
    ('T15T000000427','NDB01804'),
    ('T15T000000428','NDB01804'),
    ('T15T000000429','NDB01804'),
    ('T15T000000430','NDB01804'),
    ('T15T000000431','NDB01804'),
    ('T15T000000432','NDB01804'),
    ('T15T000000433','NDB01804'),
    ('T15T000000434','NDB01805'),
    ('T15T000000435','NDB01805'),
    ('T15T000000436','NDB01805'),
    ('T15T000000437','NDB01805'),
    ('T15T000000438','NDB01805'),
    ('T15T000000451','NDB01798'),
    ('T15T000000464','NDB01798'),
    ('T15T000000494','NDB01798'),
    ('T15T000000496','NDB01803'),
    ('T15T000000497','NDB01804'),
    ('T15T000000498','NDB01805'),
    ('T15T000000675','NDB01799'),
    ('T15T000000677','NDB01798'),
    ('T15T000000680','NDB01798'),
    ('T15T000000682','NDB01800'),
    ('T15T000000684','NDB01806'),
    ('T15T000000685','NDB01806'),
    ('T15T000000688','NDB01807'),
    ('T15T000000692','NDB01803'),
    ('T15T000000693','NDB01804'),
    ('T15T000000694','NDB01805'),
    ('T15T000000745','NDB01815');
  create temp table _mot(ma_cau text, db text) on commit drop;
  insert into _mot values
    ('T15T000000009','NDB01813'),
    ('T15T000000010','NDB01813'),
    ('T15T000000011','NDB01813'),
    ('T15T000000012','NDB01813'),
    ('T15T000000013','NDB01813'),
    ('T15T000000043','NDB01807'),
    ('T15T000000050','NDB01817'),
    ('T15T000000052','NDB01814'),
    ('T15T000000113','NDB01810'),
    ('T15T000000114','NDB01810'),
    ('T15T000000115','NDB01810'),
    ('T15T000000116','NDB01810'),
    ('T15T000000117','NDB01810'),
    ('T15T000000119','NDB01810'),
    ('T15T000000120','NDB01810'),
    ('T15T000000155','NDB01806'),
    ('T15T000000156','NDB01806'),
    ('T15T000000162','NDB01808'),
    ('T15T000000172','NDB01797'),
    ('T15T000000173','NDB01809'),
    ('T15T000000239','NDB01799'),
    ('T15T000000247','NDB01797'),
    ('T15T000000248','NDB01797'),
    ('T15T000000268','NDB01812'),
    ('T15T000000286','NDB01812'),
    ('T15T000000288','NDB01817'),
    ('T15T000000440','NDB01807'),
    ('T15T000000446','NDB01807'),
    ('T15T000000458','NDB01813'),
    ('T15T000000459','NDB01813'),
    ('T15T000000460','NDB01813'),
    ('T15T000000461','NDB01813'),
    ('T15T000000462','NDB01815'),
    ('T15T000000463','NDB01815'),
    ('T15T000000483','NDB01814'),
    ('T15T000000485','NDB01814'),
    ('T15T000000486','NDB01815'),
    ('T15T000000487','NDB01815'),
    ('T15T000000488','NDB01815'),
    ('T15T000000489','NDB01815'),
    ('T15T000000490','NDB01797'),
    ('T15T000000491','NDB01797'),
    ('T15T000000492','NDB01797'),
    ('T15T000000493','NDB01797'),
    ('T15T000000495','NDB01798'),
    ('T15T000000679','NDB01797'),
    ('T15T000000686','NDB01806'),
    ('T15T000000689','NDB01809'),
    ('T15T000000712','NDB01823'),
    ('T15T000000744','NDB01814');

  insert into dai_bdm_gan_cau (ma_cau, dang_bai_id, nguon)
  select t.ma_cau, t.db, 'ai' from _chac t
    join dai_cau_hoi c on c.ma_cau = t.ma_cau and c.xoa_at is null and c.dang_chinh = 'T15T000000' and c.kiem_may = 'khop'
    join dai_bdm_dang_bai d on d.id = t.db
   where not exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = t.ma_cau)
  on conflict (ma_cau) do nothing;
  get diagnostics n_gan = row_count;

  update dai_cau_hoi c set da_duyet = true, duyet_nguon = 'ai', duyet_at = now()
   where c.ma_cau in (select ma_cau from _chac) and not c.da_duyet and c.xoa_at is null and c.kiem_may = 'khop'
     and exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = c.ma_cau);
  get diagnostics n_dd = row_count;

  insert into dai_bdm_de_xuat (ma_cau, dang_bai_id, chac, ly_do, nguon)
  select t.ma_cau, t.db, 'vua', 'Một lượt phân loại chọn dạng này, lượt độc lập kia để trống — chờ người duyệt', 'ai' from _mot t
    join dai_cau_hoi c on c.ma_cau = t.ma_cau and c.xoa_at is null and c.dang_chinh = 'T15T000000'
    join dai_bdm_dang_bai d on d.id = t.db
   where not exists (select 1 from dai_bdm_gan_cau g where g.ma_cau = t.ma_cau)
  on conflict (ma_cau) do nothing;
  get diagnostics n_dx = row_count;

  raise notice 'gán +%, duyệt +%, đề xuất +%', n_gan, n_dd, n_dx;
  if n_gan <> 128 then raise exception 'Gán % câu, kỳ vọng 128 — dừng', n_gan; end if;
end $$;
