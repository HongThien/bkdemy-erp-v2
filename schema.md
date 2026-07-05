# Schema (public) — auto-generated, KHÔNG sửa tay

> Sinh bởi `npm run schema` từ DB live (read-only). Nguồn chuẩn = DB.

78 bảng · 0 enum · 6 trigger · 19 function

## bai_lam

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| bai_test_id | uuid |  |  | FK→bai_test.id |
| hoc_sinh_id | uuid |  |  | FK→hoc_sinh.id |
| trang_thai | text |  | 'dang_lam'::text |  |
| bat_dau_at | timestamp with time zone |  | now() |  |
| nop_at | timestamp with time zone | Y |  |  |

## bai_lam_cau

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| bai_lam_id | uuid |  |  | FK→bai_lam.id |
| bai_test_cau_id | uuid |  |  | FK→bai_test_cau.id |
| dap_an_hs | jsonb | Y |  |  |
| verdict | text | Y |  |  |
| diem | numeric | Y |  |  |
| cham_boi | text | Y |  |  |
| cham_at | timestamp with time zone |  | now() |  |

## bai_test

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| nguon_tai_lieu_id | uuid | Y |  | FK→tai_lieu.id |
| lop_id | uuid |  |  | FK→lop.id |
| ngay | date |  |  |  |
| loai | text |  |  |  |
| mon | text |  | 'Toán'::text |  |
| trang_thai | text |  | 'mo'::text |  |
| mo_at | timestamp with time zone |  | now() |  |
| dong_at | timestamp with time zone | Y |  |  |
| deadline | timestamp with time zone | Y |  |  |
| khoa_reveal | boolean |  | false |  |
| created_by | uuid | Y |  |  |
| created_at | timestamp with time zone |  | now() |  |
| so_cau | integer |  | 0 |  |

## bai_test_cau

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| bai_test_id | uuid |  |  | FK→bai_test.id |
| thu_tu | integer |  |  |  |
| ma_cau | text | Y |  |  |
| loai_cau | text |  |  |  |
| noi_dung | text | Y |  |  |
| lua_chon | jsonb | Y |  |  |
| menh_de | jsonb | Y |  |  |
| dap_an_key | jsonb | Y |  |  |
| diem | numeric |  | 1 |  |
| loi_giai | text | Y |  |  |
| anh_dap_an | text | Y |  |  |
| ma_dang | text | Y |  |  |
| ly_thuyet | text | Y |  |  |

## bai_test_report

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| bai_lam_cau_id | uuid |  |  | FK→bai_lam_cau.id |
| hoc_sinh_id | uuid |  |  | FK→hoc_sinh.id |
| y_kien | text | Y |  |  |
| trang_thai | text |  | 'moi'::text |  |
| duyet_boi | uuid | Y |  |  |
| duyet_at | timestamp with time zone | Y |  |  |
| created_at | timestamp with time zone |  | now() |  |

## bang_khong_bu

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| buoi_hoc_hs_id | uuid |  |  | FK→buoi_hoc_hs.id |
| loai | text |  |  |  |
| ly_do | text | Y |  |  |
| actor | uuid | Y |  |  |
| created_at | timestamp with time zone |  | now() |  |

## bao_loi

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| mo_ta | text |  |  |  |
| route | text | Y |  |  |
| context | jsonb | Y |  |  |
| anh_url | text | Y |  |  |
| trang_thai | text |  | 'moi'::text |  |
| ghi_chu_duyet | text | Y |  |  |
| fix_note | text | Y |  |  |
| branch | text | Y |  |  |
| pr_url | text | Y |  |  |
| commit_sha | text | Y |  |  |
| created_by | uuid | Y |  |  |
| created_at | timestamp with time zone |  | now() |  |
| updated_at | timestamp with time zone |  | now() |  |

## bao_loi_log

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| bao_loi_id | uuid |  |  | FK→bao_loi.id |
| trang_thai_cu | text | Y |  |  |
| trang_thai_moi | text | Y |  |  |
| actor | uuid | Y |  |  |
| created_at | timestamp with time zone |  | now() |  |

## bo_tro_duoi

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| hoc_sinh_id | uuid |  |  | FK→hoc_sinh.id |
| lop_id | uuid | Y |  | FK→lop.id |
| nguon | text |  | 'thu_cong'::text |  |
| ly_do | text | Y |  |  |
| trang_thai | text |  | 'can_duoi'::text |  |
| actor | uuid | Y |  |  |
| created_at | timestamp with time zone |  | now() |  |
| hoan_thanh_at | timestamp with time zone | Y |  |  |

## btvn_ket_qua

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| hoc_sinh_id | uuid |  |  | PK FK→hoc_sinh.id |
| buoi_hoc_id | uuid |  |  | PK FK→buoi_hoc.id |
| hoan_thanh | boolean |  | false |  |
| dung_han | boolean | Y |  |  |
| ti_le_dung | numeric | Y |  |  |
| updated_at | timestamp with time zone |  | now() |  |
| trang_thai_nop | text | Y |  |  |
| thai_do | text | Y |  |  |

## buoi_danh_gia

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| buoi_hoc_id | uuid |  |  | PK FK→buoi_hoc.id |
| hoc_sinh_id | uuid |  |  | PK FK→hoc_sinh.id |
| nhan_xet | text | Y |  |  |
| graded_by | uuid | Y |  |  |
| updated_at | timestamp with time zone |  | now() |  |

## buoi_danh_gia_dang

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| buoi_hoc_id | uuid |  |  | PK FK→buoi_hoc.id |
| hoc_sinh_id | uuid |  |  | PK FK→hoc_sinh.id |
| ma_dang | text |  |  | PK |
| diem | numeric |  |  |  |
| graded_by | uuid | Y |  |  |
| updated_at | timestamp with time zone |  | now() |  |

## buoi_hoc

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| ma_buoi | text | Y |  |  |
| loai | text |  | 'thuong'::text |  |
| lop_id | uuid | Y |  | FK→lop.id |
| ngay | date |  |  |  |
| thu | smallint | Y |  |  |
| gio_bat_dau | time without time zone | Y |  |  |
| gio_ket_thuc | time without time zone | Y |  |  |
| phong | text | Y |  |  |
| nguoi_day | uuid | Y |  | FK→nhan_su.id |
| nguoi_day_tg | uuid | Y |  | FK→nhan_su.id |
| trang_thai | text |  | 'mo'::text |  |
| ly_do_huy | text | Y |  |  |
| ingame_dong_at | timestamp with time zone | Y |  |  |
| et_dong_at | timestamp with time zone | Y |  |  |
| created_by | uuid | Y |  |  |
| created_at | timestamp with time zone |  | now() |  |
| updated_at | timestamp with time zone |  | now() |  |
| danh_gia_xong_at | timestamp with time zone | Y |  |  |
| btvn_dong_at | timestamp with time zone | Y |  |  |
| muc_hoc_duoi_id | uuid | Y |  | FK→muc_hoc_duoi.id |

## buoi_hoc_hs

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| buoi_hoc_id | uuid |  |  | FK→buoi_hoc.id |
| hoc_sinh_id | uuid |  |  | FK→hoc_sinh.id |
| diem_danh | text | Y |  |  |
| bu_cho_buoi_id | uuid | Y |  | FK→buoi_hoc.id |
| created_at | timestamp with time zone |  | now() |  |
| bo_tro_duoi_id | uuid | Y |  | FK→bo_tro_duoi.id |
| bao_den_at | timestamp with time zone | Y |  |  |

## canh_bao_yeu

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| hoc_sinh_id | uuid |  |  | FK→hoc_sinh.id |
| ma_dang | text |  |  |  |
| buoi_hoc_id | uuid | Y |  | FK→buoi_hoc.id |
| nguon | text |  | 'btvn'::text |  |
| ghi_chu | text | Y |  |  |
| created_by | uuid | Y |  |  |
| created_at | timestamp with time zone |  | now() |  |

## dai_ban_do

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| ma_dang | text |  | ('DG'::text \|\| lpad((nextval('dai_dang_seq'::regclass))::text, 5, '0'::text)) | PK |
| khoi | text |  |  |  |
| ma_chu_de | text |  |  |  |
| ten_chu_de | text |  |  |  |
| ma_chuyen_de | text |  |  |  |
| ten_chuyen_de | text |  |  |  |
| ten_dang | text |  |  |  |
| muc_do | smallint |  |  |  |
| created_at | timestamp with time zone |  | now() |  |
| bac_toi_thieu | text |  |  | FK→lop_bac.ma |
| mo_ta_ngan | text | Y |  |  |

## dai_cau_bo_de

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| ma_cau | text |  |  | PK FK→dai_cau_hoi.ma_cau |
| id_bo_de | text |  |  | PK FK→dai_danh_muc_bo_de.id |

## dai_cau_hoi

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| ma_cau | text |  | ('DC'::text \|\| lpad((nextval('dai_cau_seq'::regclass))::text, 6, '0'::text)) | PK |
| dang_chinh | text |  |  | FK→dai_ban_do.ma_dang |
| loai_cau | text |  |  |  |
| noi_dung | text |  |  |  |
| lua_chon | jsonb | Y |  |  |
| menh_de | jsonb | Y |  |  |
| dap_an | text | Y |  |  |
| loi_giai | text | Y |  |  |
| anh_de | text | Y |  |  |
| anh_dap_an | text | Y |  |  |
| created_at | timestamp with time zone |  | now() |  |
| nguon | text |  | 'le'::text |  |
| parent_ma_cau | text | Y |  | FK→dai_cau_hoi.ma_cau |
| clone_method | text | Y |  |  |
| nguon_giai | text |  | 'nguoi'::text |  |

## dai_chuyen_de_ly_thuyet

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| ma_chuyen_de | text |  |  | PK |
| noi_dung | text |  | ''::text |  |
| file_url | text | Y |  |  |
| ten_file | text | Y |  |  |
| cap_nhat_at | timestamp with time zone |  | now() |  |
| khong_can | boolean |  | false |  |

## dai_dang_ly_thuyet

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| ma_dang | text |  |  | PK FK→dai_ban_do.ma_dang |
| file_url | text | Y |  |  |
| ten_file | text | Y |  |  |
| cap_nhat_at | timestamp with time zone |  | now() |  |
| noi_dung | text |  | ''::text |  |

## dai_dang_thuoc_tinh

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| ma_dang | text |  |  | PK FK→dai_ban_do.ma_dang |
| id_thuoc_tinh | text |  |  | PK FK→dai_danh_muc_thuoc_tinh.id |

## dai_danh_muc_bo_de

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | text |  | ('BD'::text \|\| lpad((nextval('dai_bd_seq'::regclass))::text, 4, '0'::text)) | PK |
| ten | text |  |  |  |

## dai_danh_muc_thuoc_tinh

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | text |  | ('TT'::text \|\| lpad((nextval('dai_tt_seq'::regclass))::text, 4, '0'::text)) | PK |
| ten | text |  |  |  |

## diem_thi

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| ky_thi_id | uuid |  |  | PK FK→ky_thi.id |
| hoc_sinh_id | uuid |  |  | PK FK→hoc_sinh.id |
| diem | numeric | Y |  |  |
| band_luc_thi | text | Y |  |  |
| verdict | text |  |  |  |
| vuot_band | boolean |  | false |  |
| graded_by | uuid | Y |  |  |
| updated_at | timestamp with time zone |  | now() |  |

## gami_elo

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| hoc_sinh_id | uuid |  |  | FK→hoc_sinh.id |
| elo | integer |  | 1000 |  |
| sessions_played | integer |  | 0 |  |
| updated_at | timestamp with time zone |  | now() |  |
| mon | text |  |  |  |

## gami_elo_history

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| hoc_sinh_id | uuid |  |  | FK→hoc_sinh.id |
| buoi_hoc_id | uuid |  |  | FK→buoi_hoc.id |
| phase | text |  |  |  |
| elo_before | integer |  |  |  |
| expected | numeric |  |  |  |
| actual | numeric |  |  |  |
| delta | integer |  |  |  |
| elo_after | integer |  |  |  |
| created_at | timestamp with time zone |  | now() |  |
| mon | text | Y |  |  |
| rank | integer | Y |  |  |
| rank_total | integer | Y |  |  |

## gami_exp_ledger

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| hoc_sinh_id | uuid |  |  | FK→hoc_sinh.id |
| source | text |  |  |  |
| amount | integer |  |  |  |
| ref_buoi_hoc_id | uuid | Y |  | FK→buoi_hoc.id |
| note | text | Y |  |  |
| created_at | timestamp with time zone |  | now() |  |
| mon | text | Y |  |  |

## gami_grades

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| buoi_hoc_id | uuid |  |  | FK→buoi_hoc.id |
| problem_id | uuid |  |  | FK→gami_session_problems.id |
| hoc_sinh_id | uuid |  |  | FK→hoc_sinh.id |
| result | text |  |  |  |
| presentation | text |  |  |  |
| speed | text |  |  |  |
| points | numeric |  |  |  |
| graded_by | uuid | Y |  |  |
| graded_at | timestamp with time zone |  | now() |  |
| loi | jsonb |  | '[]'::jsonb |  |
| muc | smallint | Y |  |  |

## gami_session_problems

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| buoi_hoc_id | uuid |  |  | FK→buoi_hoc.id |
| phase | text |  |  |  |
| problem_no | integer |  |  |  |
| opened_at | timestamp with time zone |  | now() |  |
| deadline_at | timestamp with time zone | Y |  |  |
| hidden | boolean |  | false |  |
| ma_dang | text | Y |  |  |
| hoc_sinh_id | uuid | Y |  | FK→hoc_sinh.id |

## hinh_bai

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| ma_bai | text |  | ('HBai'::text \|\| lpad((nextval('hinh_bai_seq'::regclass))::text, 5, '0'::text)) | PK |
| muc_do | smallint |  |  |  |
| noi_dung | text |  |  |  |
| anh_de | text | Y |  |  |
| anh_dap_an | text | Y |  |  |
| created_at | timestamp with time zone |  | now() |  |

## hinh_bai_mo_hinh

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| ma_bai | text |  |  | PK FK→hinh_bai.ma_bai |
| id_mo_hinh | text |  |  | PK FK→hinh_danh_muc_mo_hinh.id |

## hinh_ban_do

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| ma_dang_hinh | text |  | ('HD'::text \|\| lpad((nextval('hinh_dang_seq'::regclass))::text, 5, '0'::text)) | PK |
| khoi | text |  |  |  |
| ma_mang | text |  |  |  |
| ten_mang | text |  |  |  |
| ma_loai_ch | text |  |  |  |
| ten_loai_ch | text |  |  |  |
| ten_dang | text |  |  |  |
| created_at | timestamp with time zone |  | now() |  |
| bac_toi_thieu | text |  |  | FK→lop_bac.ma |

## hinh_danh_muc_bo_de

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | text |  | ('HB'::text \|\| lpad((nextval('hinh_bd_seq'::regclass))::text, 4, '0'::text)) | PK |
| ten | text |  |  |  |

## hinh_danh_muc_mo_hinh

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | text |  | ('MH'::text \|\| lpad((nextval('hinh_mh_seq'::regclass))::text, 4, '0'::text)) | PK |
| ten | text |  |  |  |

## hinh_y

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| ma_y | text |  | ('HY'::text \|\| lpad((nextval('hinh_y_seq'::regclass))::text, 6, '0'::text)) | PK |
| ma_bai | text |  |  | FK→hinh_bai.ma_bai |
| thu_tu | smallint |  |  |  |
| dang_hinh | text |  |  | FK→hinh_ban_do.ma_dang_hinh |
| noi_dung_y | text |  |  |  |
| dap_an_y | text | Y |  |  |
| loi_giai_y | text | Y |  |  |

## hinh_y_bo_de

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| ma_y | text |  |  | PK FK→hinh_y.ma_y |
| id_bo_de | text |  |  | PK FK→hinh_danh_muc_bo_de.id |

## hoa_don

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| phu_huynh_id | uuid |  |  | FK→phu_huynh.id |
| ky | date |  |  |  |
| trang_thai | text |  | 'chua_thu'::text |  |
| tong_tien | numeric |  | 0 |  |
| dong_at | timestamp with time zone | Y |  |  |
| created_by | uuid | Y |  |  |
| created_at | timestamp with time zone |  | now() |  |
| trang_thai_tb | text |  | 'thong_bao_1'::text |  |

## hoa_don_dong

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| hoa_don_id | uuid |  |  | FK→hoa_don.id |
| loai | text |  |  |  |
| hoc_sinh_id | uuid | Y |  | FK→hoc_sinh.id |
| lop_id | uuid | Y |  | FK→lop.id |
| mo_ta | text | Y |  |  |
| so_luong | numeric | Y |  |  |
| don_gia | numeric | Y |  |  |
| he_so | numeric | Y |  |  |
| thanh_tien | numeric |  |  |  |
| snapshot | jsonb | Y |  |  |
| created_at | timestamp with time zone |  | now() |  |

## hoa_don_log

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| hoa_don_id | uuid |  |  | FK→hoa_don.id |
| hanh_dong | text |  |  |  |
| truoc | jsonb | Y |  |  |
| sau | jsonb |  |  |  |
| actor | uuid | Y |  |  |
| ts | timestamp with time zone |  | now() |  |

## hoc_phi_phat_sinh

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| ky | date |  |  |  |
| loai | text |  |  |  |
| lop_id | uuid | Y |  | FK→lop.id |
| hoc_sinh_id | uuid | Y |  | FK→hoc_sinh.id |
| mo_ta | text |  |  |  |
| so_tien | numeric |  |  |  |
| created_by | uuid | Y |  |  |
| created_at | timestamp with time zone |  | now() |  |

## hoc_phi_xet_duyet

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| hoc_sinh_id | uuid |  |  | FK→hoc_sinh.id |
| lop_id | uuid |  |  | FK→lop.id |
| ky | date |  |  |  |
| ly_do | text |  |  |  |
| so_buoi_lop | integer | Y |  |  |
| so_buoi_window | integer | Y |  |  |
| so_buoi_nghi | integer | Y |  |  |
| trang_thai | text |  | 'cho_duyet'::text |  |
| so_buoi_chot | integer | Y |  |  |
| quyet_dinh | text | Y |  |  |
| nguoi_duyet | uuid | Y |  |  |
| duyet_at | timestamp with time zone | Y |  |  |
| created_at | timestamp with time zone |  | now() |  |

## hoc_sinh

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| ma_hs | text | Y | ('HS'::text \|\| lpad((nextval('hs_seq'::regclass))::text, 4, '0'::text)) |  |
| ho_ten | text |  |  |  |
| ngay_sinh | date | Y |  |  |
| gioi_tinh | text | Y |  |  |
| khoi | text | Y |  |  |
| trang_thai | text |  | 'dang_hoc'::text |  |
| diem_test_dau_vao | numeric | Y |  |  |
| ngay_nhap_hoc | date | Y |  |  |
| created_at | timestamp with time zone |  | now() |  |
| updated_at | timestamp with time zone |  | now() |  |
| dia_chi | text | Y |  |  |
| truong_hoc | text | Y |  |  |
| phu_huynh_id | uuid | Y |  | FK→phu_huynh.id |
| anh_url | text | Y |  |  |
| he_so_hoc_phi | numeric |  | 1 |  |
| he_so_nguon | text |  | 'auto'::text |  |

## hoc_sinh_lop

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| hoc_sinh_id | uuid |  |  | FK→hoc_sinh.id |
| lop_id | uuid |  |  | FK→lop.id |
| muc_nang_luc_id | uuid | Y |  | FK→muc_nang_luc.id |
| ngay_vao | date | Y |  |  |
| trang_thai | text |  | 'dang_hoc'::text |  |
| ngay_roi | date | Y |  |  |

## hoc_sinh_lop_log

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| ghi_danh_id | uuid | Y |  |  |
| hoc_sinh_id | uuid | Y |  |  |
| lop_id | uuid | Y |  |  |
| hanh_dong | text |  |  |  |
| truoc | jsonb | Y |  |  |
| sau | jsonb |  |  |  |
| actor | uuid | Y |  |  |
| ts | timestamp with time zone |  | now() |  |

## hoc_sinh_thanh_tich_ghim

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| hoc_sinh_id | uuid |  |  | PK FK→hoc_sinh.id |
| mon | text |  |  | PK |
| loai_key | text |  |  | PK FK→thanh_tich_loai.key |
| thu_tu | integer |  | 0 |  |

## kho_tag_log

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| mon | text |  |  |  |
| ma_cau | text | Y |  |  |
| loai_field | text |  | 'dang'::text |  |
| ai_value | text | Y |  |  |
| final_value | text | Y |  |  |
| ai_confidence | real | Y |  |  |
| da_verify | boolean |  | false |  |
| nguoi_id | uuid | Y |  |  |
| created_at | timestamp with time zone |  | now() |  |

## khtn_ban_do

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| ma_dang | text |  | ('KG'::text \|\| lpad((nextval('khtn_dang_seq'::regclass))::text, 5, '0'::text)) | PK |
| khoi | text |  |  |  |
| ma_chu_de | text |  |  |  |
| ten_chu_de | text |  |  |  |
| ma_chuyen_de | text |  |  |  |
| ten_chuyen_de | text |  |  |  |
| ten_dang | text |  |  |  |
| muc_do | smallint |  |  |  |
| bac_toi_thieu | text |  |  | FK→lop_bac.ma |
| created_at | timestamp with time zone |  | now() |  |
| mo_ta_ngan | text | Y |  |  |

## khtn_cau_hoi

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| ma_cau | text |  | ('KC'::text \|\| lpad((nextval('khtn_cau_seq'::regclass))::text, 6, '0'::text)) | PK |
| dang_chinh | text |  |  | FK→khtn_ban_do.ma_dang |
| loai_cau | text |  |  |  |
| noi_dung | text |  |  |  |
| lua_chon | jsonb | Y |  |  |
| menh_de | jsonb | Y |  |  |
| dap_an | text | Y |  |  |
| loi_giai | text | Y |  |  |
| anh_de | text | Y |  |  |
| anh_dap_an | text | Y |  |  |
| nguon | text |  | 'le'::text |  |
| nguon_giai | text |  | 'nguoi'::text |  |
| parent_ma_cau | text | Y |  | FK→khtn_cau_hoi.ma_cau |
| clone_method | text | Y |  |  |
| created_at | timestamp with time zone |  | now() |  |

## khtn_chuyen_de_ly_thuyet

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| ma_chuyen_de | text |  |  | PK |
| noi_dung | text |  | ''::text |  |
| file_url | text | Y |  |  |
| ten_file | text | Y |  |  |
| khong_can | boolean |  | false |  |
| cap_nhat_at | timestamp with time zone |  | now() |  |

## khtn_dang_ly_thuyet

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| ma_dang | text |  |  | PK FK→khtn_ban_do.ma_dang |
| noi_dung | text |  | ''::text |  |
| file_url | text | Y |  |  |
| ten_file | text | Y |  |  |
| cap_nhat_at | timestamp with time zone |  | now() |  |

## ky_thi

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| ten | text |  |  |  |
| loai | text |  |  |  |
| he_so | integer |  |  |  |
| dot | text | Y |  |  |
| ngay | date | Y |  |  |
| mon | text | Y |  |  |
| khoi | text | Y |  |  |
| mua | text | Y |  |  |
| buoi_hoc_id | uuid | Y |  | FK→buoi_hoc.id |
| created_at | timestamp with time zone |  | now() |  |

## lop

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| ten_lop | text |  |  |  |
| mon | text |  |  |  |
| khoi | text | Y |  |  |
| bac | text | Y |  | FK→lop_bac.ma |
| co_so | text | Y |  |  |
| trang_thai | text |  | 'dang_hoc'::text |  |
| created_at | timestamp with time zone |  | now() |  |
| updated_at | timestamp with time zone |  | now() |  |
| ngay_khai_giang | date | Y |  |  |
| muc_hoc_phi_id | uuid | Y |  | FK→muc_hoc_phi.id |
| muc_hoc_lieu_id | uuid | Y |  | FK→muc_hoc_lieu.id |

## lop_bac

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| ma | text |  |  | PK |
| ten | text |  |  |  |
| thu_tu | smallint |  |  |  |

## luong_bac

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| min_exp | integer |  |  | PK |
| xu | integer |  |  |  |

## muc_hoc_duoi

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| ten | text |  |  |  |
| gia | numeric |  |  |  |
| created_at | timestamp with time zone |  | now() |  |

## muc_hoc_lieu

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| ten | text |  |  |  |
| gia | numeric |  |  |  |
| created_at | timestamp with time zone |  | now() |  |

## muc_hoc_phi

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| ten | text |  |  |  |
| don_gia_buoi | numeric |  |  |  |
| created_at | timestamp with time zone |  | now() |  |

## muc_nang_luc

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| ma | text |  |  |  |
| bac | text |  |  | FK→lop_bac.ma |
| muc | smallint |  |  |  |
| thu_tu | smallint |  |  |  |
| ten | text | Y |  |  |
| diem_ky_vong | numeric | Y |  |  |

## nhan_su

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| ho_ten | text |  |  |  |
| so_dien_thoai | text | Y |  |  |
| email | text | Y |  |  |
| trang_thai | text |  | 'dang_lam'::text |  |
| ngay_vao_lam | date | Y |  |  |
| created_at | timestamp with time zone |  | now() |  |
| updated_at | timestamp with time zone |  | now() |  |
| ma_ns | text | Y | ('NS'::text \|\| lpad((nextval('ns_seq'::regclass))::text, 3, '0'::text)) |  |
| anh_url | text | Y |  |  |
| la_admin_he_thong | boolean |  | false |  |

## nhan_su_mon

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| nhan_su_id | uuid |  |  | PK FK→nhan_su.id |
| mon | text |  |  | PK |

## nhan_su_team

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| nhan_su_id | uuid |  |  | PK FK→nhan_su.id |
| team_id | uuid |  |  | PK FK→team.id |

## phan_cong_lop

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| nhan_su_id | uuid |  |  | FK→nhan_su.id |
| lop_id | uuid |  |  | FK→lop.id |
| vai_tro | text |  |  |  |
| la_chinh | boolean |  | false |  |
| created_at | timestamp with time zone |  | now() |  |

## phu_huynh

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| ma_ph | text |  | ('PH'::text \|\| lpad((nextval('ph_seq'::regclass))::text, 4, '0'::text)) |  |
| ho_ten | text |  |  |  |
| so_dien_thoai | text | Y |  |  |
| email | text | Y |  |  |
| dia_chi | text | Y |  |  |
| created_at | timestamp with time zone |  | now() |  |
| updated_at | timestamp with time zone |  | now() |  |

## question_accepted_answers

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| ma_cau | text |  |  |  |
| answer_normalized | text |  |  |  |
| answer_raw | text | Y |  |  |
| source | text |  | 'manual'::text |  |
| ai_reason | text | Y |  |  |
| hit_count | integer |  | 1 |  |
| created_at | timestamp with time zone |  | now() |  |

## tai_khoan

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  |  | PK |
| nhan_su_id | uuid | Y |  | FK→nhan_su.id |
| email | text | Y |  |  |
| created_at | timestamp with time zone |  | now() |  |
| hoc_sinh_id | uuid | Y |  | FK→hoc_sinh.id |

## tai_lieu

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| loai | text |  | 'giao_trinh'::text |  |
| ten | text |  |  |  |
| khoi | text |  |  |  |
| ma_chuyen_de | text | Y |  |  |
| theme | text |  | 'bkdemy'::text |  |
| created_at | timestamp with time zone |  | now() |  |
| updated_at | timestamp with time zone |  | now() |  |
| cau_hinh | jsonb |  | '{}'::jsonb |  |
| created_by | uuid | Y |  |  |
| lop_id | uuid | Y |  | FK→lop.id |
| ngay | date | Y |  |  |
| nguon_id | uuid | Y |  | FK→tai_lieu.id |
| nguon_buoi | text | Y |  |  |
| mon | text |  | 'Toán'::text |  |

## tai_lieu_cau

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| phan_id | uuid |  |  | FK→tai_lieu_phan.id |
| ma_cau | text |  |  |  |
| thu_tu | integer |  | 0 |  |

## tai_lieu_phan

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| tai_lieu_id | uuid |  |  | FK→tai_lieu.id |
| thu_tu | integer |  | 0 |  |
| loai_phan | text |  |  |  |
| ref_ma | text | Y |  |  |
| tieu_de | text | Y |  |  |
| noi_dung | text | Y |  |  |
| kieu | text |  | 'thuong'::text |  |

## team

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| ma | text |  |  |  |
| ten | text |  |  |  |
| thu_tu | smallint |  | 0 |  |

## thanh_tich_loai

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| key | text |  |  | PK |
| ten | text |  |  |  |
| icon | text | Y |  |  |
| nhom | text | Y |  |  |
| kieu | text | Y |  |  |
| nguon | text | Y |  |  |
| per_mon | boolean |  | true |  |
| trong_so | integer |  | 0 |  |
| thu_tu | integer |  | 0 |  |
| active | boolean |  | true |  |

## thanh_toan

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| hoa_don_id | uuid |  |  | FK→hoa_don.id |
| so_tien | numeric |  |  |  |
| ngay | date |  | CURRENT_DATE |  |
| phuong_thuc | text | Y |  |  |
| nguoi_thu | uuid | Y |  |  |
| ghi_chu | text | Y |  |  |
| created_at | timestamp with time zone |  | now() |  |

## thoi_khoa_bieu

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| lop_id | uuid |  |  | FK→lop.id |
| thu | smallint |  |  |  |
| gio_bat_dau | time without time zone |  |  |  |
| gio_ket_thuc | time without time zone |  |  |  |
| phong | text | Y |  |  |
| hieu_luc_tu | date |  |  |  |
| hieu_luc_den | date | Y |  |  |
| created_at | timestamp with time zone |  | now() |  |

## ung_vien

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| ma_uv | text | Y |  |  |
| ho_ten_hs | text |  |  |  |
| ho_ten_ph | text | Y |  |  |
| sdt_ph | text | Y |  |  |
| khoi | text | Y |  |  |
| mon | text |  | 'Toán'::text |  |
| nguon | text | Y |  |  |
| level | text |  | 'L5'::text |  |
| trang_thai | text |  | 'dang_chay'::text |  |
| ly_do_loai | text | Y |  |  |
| diem_test | numeric | Y |  |  |
| lop_du_kien_id | uuid | Y |  | FK→lop.id |
| ngay_hoc_thu | date | Y |  |  |
| ghi_chu | text | Y |  |  |
| hoc_sinh_id | uuid | Y |  | FK→hoc_sinh.id |
| created_by | uuid | Y |  |  |
| created_at | timestamp with time zone |  | now() |  |
| updated_at | timestamp with time zone |  | now() |  |
| ngay_sinh | date | Y |  |  |
| gioi_tinh | text | Y |  |  |
| dia_chi | text | Y |  |  |
| truong_hoc | text | Y |  |  |
| email_ph | text | Y |  |  |
| phu_huynh_id | uuid | Y |  | FK→phu_huynh.id |
| hoc_sinh_goc_id | uuid | Y |  | FK→hoc_sinh.id |
| can_bo_tro_duoi | boolean |  | false |  |

## ung_vien_log

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| ung_vien_id | uuid | Y |  |  |
| hanh_dong | text |  |  |  |
| truoc | jsonb | Y |  |  |
| sau | jsonb |  |  |  |
| actor | uuid | Y |  |  |
| ts | timestamp with time zone |  | now() |  |

## ung_vien_viec

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| ung_vien_id | uuid |  |  | FK→ung_vien.id |
| viec_key | text |  |  |  |
| xong_at | timestamp with time zone |  | now() |  |
| nguoi_xong | uuid | Y |  |  |

## vai_tro

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| ten | text |  |  |  |
| mo_ta | text | Y |  |  |
| created_at | timestamp with time zone |  | now() |  |

## vai_tro_chuc_nang

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| vai_tro_id | uuid |  |  | PK FK→vai_tro.id |
| chuc_nang | text |  |  | PK |

## vi_tri

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |
| team_id | uuid |  |  | FK→team.id |
| ten | text | Y |  |  |
| cap | text |  | 'thanh_vien'::text |  |
| cha_id | uuid | Y |  | FK→vi_tri.id |
| nhan_su_id | uuid | Y |  | FK→nhan_su.id |
| created_at | timestamp with time zone |  | now() |  |
| vai_tro_id | uuid | Y |  | FK→vai_tro.id |
| mon | text | Y |  |  |

## Triggers

| bảng | trigger | timing | event | function |
|---|---|---|---|---|
| bao_loi | trg_log_bao_loi | BEFORE | UPDATE | log_bao_loi |
| hoa_don | trg_log_hoa_don | AFTER | INSERT/UPDATE | log_hoa_don |
| hoc_sinh | trg_hs_nghi_tu_roi_lop | AFTER | UPDATE | hs_nghi_tu_roi_lop |
| hoc_sinh | trg_log_he_so_hoc_phi | AFTER | UPDATE | log_he_so_hoc_phi |
| hoc_sinh_lop | trg_log_hoc_sinh_lop | AFTER | INSERT/UPDATE | log_hoc_sinh_lop |
| ung_vien | trg_log_ung_vien | AFTER | INSERT/UPDATE | log_ung_vien |

## Functions

- `count_cau_by_dang(p_tbl text)` → jsonb
- `et_de(p_bai_test uuid)` → jsonb
- `et_nop(p_bai_lam uuid)` → jsonb
- `hs_nghi_tu_roi_lop()` → trigger
- `hs_o_lop(p_lop uuid)` → boolean
- `increment_qaa_hit(p_id uuid)` → void
- `jwt_email()` → text
- `jwt_uid()` → uuid
- `la_thanh_vien()` → boolean
- `log_bao_loi()` → trigger
- `log_he_so_hoc_phi()` → trigger
- `log_hoa_don()` → trigger
- `log_hoc_sinh_lop()` → trigger
- `log_ung_vien()` → trigger
- `my_hoc_sinh_id()` → uuid
- `my_quyen()` → TABLE(la_admin boolean, chuc_nang text[])
- `self_link_account()` → uuid
- `tln_cache_check(p_ma_cau text, p_norm text)` → boolean
- `tln_norm(t text)` → text

