# Schema (public) — auto-generated, KHÔNG sửa tay

> Sinh bởi `npm run schema` từ DB live (read-only). Nguồn chuẩn = DB.

16 bảng · 0 enum · 0 trigger · 0 function

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

## lop_bac

| cột | kiểu | null | default | khóa |
|---|---|---|---|---|
| ma | text |  |  | PK |
| ten | text |  |  |  |
| thu_tu | smallint |  |  |  |

