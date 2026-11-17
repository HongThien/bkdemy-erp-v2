# verify-danhgia-hoctap — chạy 2026-07-22 21:54 (giờ máy)

> Nguồn: `node scripts/verify_danhgia_hoctap.mjs` (read-only, DB thật).
> Trả lời §8 của `spec-danhgia-hoctap.md`. Chạy lại khi data đổi đáng kể.

```

### A1 · gami_grades.result
  result  | n    
  --------+------
  correct | 15685
  partial | 2679 
  wrong   | 2149 

### A2 · gami_session_problems.phase × gắn dạng
  phase  | n    | co_ma_dang | pct_co_dang
  -------+------+------------+------------
  btvn   | 2461 | 2461       | 100.0      
  ingame | 2038 | 347        | 17.0       
  et     | 964  | 964        | 100.0      
  mt     | 141  | 141        | 100.0      

### A3 · btvn_ket_qua.thai_do (4 bậc?)
  thai_do         | n   | pct 
  ----------------+-----+-----
  nghiem_tuc      | 690 | 74.8
  ∅ NULL          | 110 | 11.9
  chua_nghiem_tuc | 74  | 8.0 
  chua_het_suc    | 46  | 5.0 
  chong_doi       | 3   | 0.3 

### A4 · btvn_ket_qua.trang_thai_nop
  trang_thai_nop | n  
  ---------------+----
  nop_dung_han   | 755
  khong_lam      | 91 
  nop_muon       | 53 
  xin_phep       | 24 

### A5 · bo_tro_duoi.trang_thai × nguon
  trang_thai | nguon      | n 
  -----------+------------+---
  hoan_thanh | thu_cong   | 18
  hoan_thanh | tuyen_sinh | 7 
  can_duoi   | thu_cong   | 5 
  can_duoi   | tuyen_sinh | 1 

### A6 · canh_bao_yeu.nguon (③ chuông đỏ persist ở đây?)
  nguon | n | co_dang | co_buoi | co_ghichu | tu                                                 | den                                               
  ------+---+---------+---------+-----------+----------------------------------------------------+---------------------------------------------------
  btvn  | 3 | 3       | 3       | 3         | Mon Jul 20 2026 00:00:00 GMT+0700 (Indochina Time) | Tue Jul 21 2026 00:00:00 GMT+0700 (Indochina Time)

### A7 · bai_test.loai × bai_lam_cau.verdict
  loai       | verdict | n
  -----------+---------+--
  btvn       | correct | 1
  et         | wrong   | 8
  et         | correct | 1
  et         | ∅       | 1
  giao_trinh | wrong   | 8
  giao_trinh | correct | 1

### A8 · buoi_hoc_hs.diem_danh
  diem_danh | n   
  ----------+-----
  co_mat    | 1956
  vang_phep | 223 
  ∅ NULL    | 172 
  vang      | 132 

### B1 · bo_tro_duoi_dang.day_at CÓ POPULATE KHÔNG (neo outcome §5)
  n_dong | co_day_at | pct_day_at | co_buoi | tu                                                 | den                                               
  -------+-----------+------------+---------+----------------------------------------------------+---------------------------------------------------
  12     | 9         | 75.0       | 9       | Tue Jul 14 2026 00:00:00 GMT+0700 (Indochina Time) | Wed Jul 22 2026 00:00:00 GMT+0700 (Indochina Time)

### B2 · Lần đo (et/mt/btvn) — nối được tới dạng & chuyên đề?
  phase | mon  | n_cham | co_dang | co_chuyen_de | pct_chuyen_de
  ------+------+--------+---------+--------------+--------------
  btvn  | Toán | 11195  | 11195   | 11195        | 100.0        
  et    | Toán | 5833   | 5833    | 5833         | 100.0        
  mt    | Toán | 1074   | 1074    | 1074         | 100.0        

### B2b · ma_dang TRÙNG SỐ giữa 2 bản đồ (bẫy join gộp)
  so_ma_trung
  -----------
  30         

### B3 · Dạng MỒ CÔI (đo rồi nhưng không có trong bản đồ)
  (0 dòng)

### B4 · Test online: bai_test_cau.ma_dang + verdict phủ tới đâu
  loai       | n_cau_lam | co_dang | co_verdict | pct_dang
  -----------+-----------+---------+------------+---------
  et         | 10        | 10      | 9          | 100.0   
  giao_trinh | 9         | 9       | 9          | 100.0   
  btvn       | 1         | 1       | 1          | 100.0   

### B5 · thai_do — ĐỘ PHỦ so với buổi đã đóng BTVN
  buoi_da_dong_btvn | hs_co_mat | dong_ket_qua | co_thai_do
  ------------------+-----------+--------------+-----------
  134               | 1086      | 908          | 799       

### B6 · bt_grades (bổ trợ đuổi) — có gắn học sinh không?
  n | co_dang | tu | den
  --+---------+----+----
  0 | 0       | ∅  | ∅  

### C1 · Khoảng thời gian có data đo, theo phase
  phase | n     | tu                                                 | den                                                | so_cua_so | so_hs
  ------+-------+----------------------------------------------------+----------------------------------------------------+-----------+------
  btvn  | 11195 | Mon Jun 22 2026 00:00:00 GMT+0700 (Indochina Time) | Wed Jul 22 2026 00:00:00 GMT+0700 (Indochina Time) | 3         | 187  
  et    | 5833  | Tue Jun 16 2026 00:00:00 GMT+0700 (Indochina Time) | Wed Jul 22 2026 00:00:00 GMT+0700 (Indochina Time) | 3         | 236  
  mt    | 1074  | Wed Jul 08 2026 00:00:00 GMT+0700 (Indochina Time) | Thu Jul 16 2026 00:00:00 GMT+0700 (Indochina Time) | 2         | 56   

### C2 · MẬT ĐỘ: số câu mỗi (HS × chuyên đề × cửa sổ 14 ngày) → chọn min-n k
  so_o | tb_cau | p50 | p75 | p90 | max_cau | pct_ge3 | pct_ge5 | pct_ge8
  -----+--------+-----+-----+-----+---------+---------+---------+--------
  1484 | 12.2   | 6   | 15  | 29  | 104     | 77.3    | 57.5    | 45.2   

### C3 · Mỗi (HS × cửa sổ) có bao nhiêu chuyên đề đủ ≥5 câu (cỡ stat sheet)
  cua_so    | so_hs | o_du_5 | o_tong | cd_du5_moi_hs
  ----------+-------+--------+--------+--------------
  2026-07-B | 217   | 285    | 558    | 1.3          
  2026-07-A | 197   | 461    | 765    | 2.3          
  2026-06-B | 63    | 108    | 161    | 1.7          

### C4 · Chuỗi cửa sổ liên tiếp của 1 HS×chuyên đề (đủ 3 chu kỳ để mượt MA-3?)
  so_cua_so | so_cap_hs_chuyende
  ----------+-------------------
  1         | 462               
  2         | 187               
  3         | 6                 

### C5 · SĨ SỐ lớp đang học (ngưỡng lùi-lên-khối khi lớp < 8)
  mon       | so_lop | tb_si_so | min_ss | max_ss | lop_duoi_8
  ----------+--------+----------+--------+--------+-----------
  Toán      | 32     | 8.7      | 1      | 15     | 11        
  KHTN      | 4      | 11.8     | 8      | 17     | 0         
  Tiếng Anh | 3      | 8.3      | 6      | 13     | 2         
  Văn       | 3      | 7.3      | 6      | 10     | 2         

### C6 · CỠ CANDIDATE: %HS có ≥1 dạng YẾU (mastery 5-gần-nhất, ET+MT+BTVN)
  mon  | so_hs | hs_co_yeu | pct_co_yeu | tb_dang_yeu | tb_dang_da_do
  -----+-------+-----------+------------+-------------+--------------
  Toán | 246   | 189       | 76.8       | 2.5         | 13.4         

### C7 · Phân bố số dạng YẾU mỗi HS (chọn ngưỡng ~10-15% roster)
  so_dang_yeu | so_hs | pct 
  ------------+-------+-----
  0           | 57    | 23.2
  1           | 52    | 21.1
  2           | 47    | 19.1
  3           | 33    | 13.4
  4           | 15    | 6.1 
  5           | 6     | 2.4 
  6           | 13    | 5.3 
  7           | 9     | 3.7 
  8           | 6     | 2.4 
  9           | 3     | 1.2 
  10          | 5     | 2.0 

### C8 · Nguồn đo mỗi cửa sổ (ET/MT/BTVN có đều không → trọng số có ý nghĩa?)
  cua_so    | et   | mt   | btvn
  ----------+------+------+-----
  2026-07-B | 1710 | 18   | 4114
  2026-07-A | 3279 | 1056 | 6581
  2026-06-B | 844  | 0    | 500 
```
