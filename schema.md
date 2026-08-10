# Schema (public) — auto-generated, KHÔNG sửa tay

> Sinh bởi `npm run schema` từ DB live (read-only). Nguồn chuẩn = DB.

122 bảng · 0 enum · 11 trigger · 31 function

## bai_lam

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| bai_test_id | uuid |  |  | FK→bai_test.id |  |
| hoc_sinh_id | uuid |  |  | FK→hoc_sinh.id |  |
| trang_thai | text |  | 'dang_lam'::text |  | `dang_lam` · `da_nop` |
| bat_dau_at | timestamp with time zone |  | now() |  |  |
| nop_at | timestamp with time zone | Y |  |  |  |

## bai_lam_cau

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| bai_lam_id | uuid |  |  | FK→bai_lam.id |  |
| bai_test_cau_id | uuid |  |  | FK→bai_test_cau.id |  |
| dap_an_hs | jsonb | Y |  |  |  |
| verdict | text | Y |  |  | `correct` · `partial` · `wrong` |
| diem | numeric | Y |  |  |  |
| cham_boi | text | Y |  |  | `exact` · `cache` · `manual` |
| cham_at | timestamp with time zone |  | now() |  |  |

## bai_lam_goi_y

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| bai_lam_id | uuid |  |  | FK→bai_lam.id |  |
| bai_test_cau_id | uuid |  |  | FK→bai_test_cau.id |  |
| xem_at | timestamp with time zone |  | now() |  |  |

## bai_test

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| nguon_tai_lieu_id | uuid | Y |  | FK→tai_lieu.id |  |
| lop_id | uuid |  |  | FK→lop.id |  |
| ngay | date |  |  |  |  |
| loai | text |  |  |  | `et` · `btvn` · `giao_trinh` · `de_thi` |
| mon | text |  | 'Toán'::text |  |  |
| trang_thai | text |  | 'mo'::text |  | `mo` · `dong` |
| mo_at | timestamp with time zone |  | now() |  |  |
| dong_at | timestamp with time zone | Y |  |  |  |
| deadline | timestamp with time zone | Y |  |  |  |
| khoa_reveal | boolean |  | false |  |  |
| created_by | uuid | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| so_cau | integer |  | 0 |  |  |

## bai_test_cau

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| bai_test_id | uuid |  |  | FK→bai_test.id |  |
| thu_tu | integer |  |  |  |  |
| ma_cau | text | Y |  |  |  |
| loai_cau | text |  |  |  |  |
| noi_dung | text | Y |  |  |  |
| lua_chon | jsonb | Y |  |  |  |
| menh_de | jsonb | Y |  |  |  |
| dap_an_key | jsonb | Y |  |  |  |
| diem | numeric |  | 1 |  |  |
| loi_giai | text | Y |  |  |  |
| anh_dap_an | text | Y |  |  |  |
| ma_dang | text | Y |  |  |  |
| ly_thuyet | text | Y |  |  |  |

## bai_test_report

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| bai_lam_cau_id | uuid |  |  | FK→bai_lam_cau.id |  |
| hoc_sinh_id | uuid |  |  | FK→hoc_sinh.id |  |
| y_kien | text | Y |  |  |  |
| trang_thai | text |  | 'moi'::text |  | `moi` · `dung` · `sai` |
| duyet_boi | uuid | Y |  |  |  |
| duyet_at | timestamp with time zone | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |

## bang_khong_bu

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| buoi_hoc_hs_id | uuid |  |  | FK→buoi_hoc_hs.id |  |
| loai | text |  |  |  | `khong_can_bu` · `khong_xep_duoc` |
| ly_do | text | Y |  |  |  |
| actor | uuid | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |

## bao_cao_ph

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| hoc_sinh_id | uuid |  |  | PK FK→hoc_sinh.id |  |
| mon | text |  |  | PK |  |
| thang | text |  |  | PK |  |
| thai_do | text | Y |  |  |  |
| kien_thuc_ky_nang | text | Y |  |  |  |
| ket_luan | text | Y |  |  |  |
| updated_by | uuid | Y |  |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |
| ket_luan_muc | text | Y |  |  |  |
| muc_tieu | text | Y |  |  |  |
| muc_kien_thuc | smallint | Y |  |  |  |
| muc_thai_do | smallint | Y |  |  |  |
| nl_band | text | Y |  |  | `S-` · `S` · `S+` · `A-` · `A` · `A+` · `B-` · `B` · `B+` · `C-` · `C` · `C+` · `D-` · `D` · `D+` |
| nl_diem | numeric | Y |  |  |  |
| nl_sai_so | numeric | Y |  |  |  |
| cs_thai_do | smallint | Y |  |  |  |
| cs_tap_trung | smallint | Y |  |  |  |
| cs_tiep_thu | smallint | Y |  |  |  |
| cs_tu_duy | smallint | Y |  |  |  |
| cs_ky_nang | smallint | Y |  |  |  |
| cs_van_dung | smallint | Y |  |  |  |
| cs_vuot_kho | smallint | Y |  |  |  |

## bao_loi

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| mo_ta | text |  |  |  |  |
| route | text | Y |  |  |  |
| context | jsonb | Y |  |  |  |
| anh_url | text | Y |  |  |  |
| trang_thai | text |  | 'moi'::text |  | `moi` · `cho_fix` · `tu_choi` · `tu_lam` · `da_fix` · `xong` · `tra_lai` |
| ghi_chu_duyet | text | Y |  |  |  |
| fix_note | text | Y |  |  |  |
| branch | text | Y |  |  |  |
| pr_url | text | Y |  |  |  |
| commit_sha | text | Y |  |  |  |
| created_by | uuid | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |

## bao_loi_log

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| bao_loi_id | uuid |  |  | FK→bao_loi.id |  |
| trang_thai_cu | text | Y |  |  |  |
| trang_thai_moi | text | Y |  |  |  |
| actor | uuid | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |

## bo_tro_duoi

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| hoc_sinh_id | uuid |  |  | FK→hoc_sinh.id |  |
| lop_id | uuid | Y |  | FK→lop.id |  |
| nguon | text |  | 'thu_cong'::text |  |  |
| ly_do | text | Y |  |  |  |
| trang_thai | text |  | 'can_duoi'::text |  |  |
| actor | uuid | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| hoan_thanh_at | timestamp with time zone | Y |  |  |  |
| so_buoi_du_kien | integer | Y |  |  |  |
| dang_duyet_at | timestamp with time zone | Y |  |  |  |
| dang_duyet_boi | uuid | Y |  | FK→nhan_su.id |  |

## bo_tro_duoi_dang

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| bo_tro_duoi_id | uuid |  |  | FK→bo_tro_duoi.id |  |
| ma_dang | text |  |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| day_buoi_id | uuid | Y |  | FK→buoi_hoc.id |  |
| day_at | timestamp with time zone | Y |  |  |  |

## bo_tro_yeu

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| hoc_sinh_id | uuid |  |  | FK→hoc_sinh.id |  |
| lop_id | uuid | Y |  | FK→lop.id |  |
| mon | text |  |  |  |  |
| nguon | text |  | 'thu_cong'::text |  |  |
| ly_do | text | Y |  |  |  |
| trang_thai | text |  | 'dang_xu'::text |  | `dang_xu` · `hoan_thanh` |
| actor | uuid | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| hoan_thanh_at | timestamp with time zone | Y |  |  |  |
| muc | smallint | Y |  |  |  |
| muc_may_de_xuat | smallint | Y |  |  |  |
| de_xuat_may | jsonb |  | '{}'::jsonb |  |  |
| ket_qua | text | Y |  |  | `dat` · `mot_phan` · `chua_dat` · `bo` |
| dong_boi | uuid | Y |  | FK→nhan_su.id |  |
| ghi_chu_dong | text | Y |  |  |  |

## bo_tro_yeu_dang

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| bo_tro_yeu_id | uuid |  |  | FK→bo_tro_yeu.id |  |
| ma_dang | text |  |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| day_buoi_id | uuid | Y |  | FK→buoi_hoc.id |  |
| day_at | timestamp with time zone | Y |  |  |  |
| dong_at | timestamp with time zone | Y |  |  |  |
| diem_luc_mo | numeric | Y |  |  |  |
| so_lan_do_luc_mo | smallint | Y |  |  |  |
| retest_diem | numeric | Y |  |  |  |
| retest_at | timestamp with time zone | Y |  |  |  |
| retest_nguon | text | Y |  |  | `et` · `mt` · `rieng` |
| dat | boolean | Y |  |  |  |

## bt_grades

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| tai_lieu_id | uuid |  |  | FK→tai_lieu.id |  |
| ma_cau | text |  |  |  |  |
| ma_dang | text |  |  |  |  |
| result | text |  |  |  | `correct` · `partial` · `wrong` |
| graded_by | uuid | Y |  |  |  |
| graded_at | timestamp with time zone |  | now() |  |  |

## btvn_ket_qua

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| hoc_sinh_id | uuid |  |  | PK FK→hoc_sinh.id |  |
| buoi_hoc_id | uuid |  |  | PK FK→buoi_hoc.id |  |
| hoan_thanh | boolean |  | false |  |  |
| dung_han | boolean | Y |  |  |  |
| ti_le_dung | numeric | Y |  |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |
| trang_thai_nop | text | Y |  |  |  |
| thai_do | text | Y |  |  |  |

## btvn_ontap_config

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| nguon_id | uuid |  |  | FK→tai_lieu.id |  |
| nguon_buoi | text |  |  |  |  |
| lop_id | uuid |  |  | FK→lop.id |  |
| config | jsonb |  | '{}'::jsonb |  |  |
| updated_by | uuid | Y |  |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |

## buoi_danh_gia

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| buoi_hoc_id | uuid |  |  | PK FK→buoi_hoc.id |  |
| hoc_sinh_id | uuid |  |  | PK FK→hoc_sinh.id |  |
| nhan_xet | text | Y |  |  |  |
| graded_by | uuid | Y |  |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |
| hoan_thanh_pct | smallint | Y |  |  |  |
| muc | smallint | Y |  |  |  |

## buoi_danh_gia_dang

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| buoi_hoc_id | uuid |  |  | PK FK→buoi_hoc.id |  |
| hoc_sinh_id | uuid |  |  | PK FK→hoc_sinh.id |  |
| ma_dang | text |  |  | PK |  |
| diem | numeric |  |  |  |  |
| graded_by | uuid | Y |  |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |

## buoi_hoc

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| ma_buoi | text | Y |  |  |  |
| loai | text |  | 'thuong'::text |  | `thuong` · `bu` · `bo_tro_yeu` · `bo_tro_duoi` · `mt` |
| lop_id | uuid | Y |  | FK→lop.id |  |
| ngay | date |  |  |  |  |
| thu | smallint | Y |  |  |  |
| gio_bat_dau | time without time zone | Y |  |  |  |
| gio_ket_thuc | time without time zone | Y |  |  |  |
| phong | text | Y |  |  |  |
| nguoi_day | uuid | Y |  | FK→nhan_su.id |  |
| nguoi_day_tg | uuid | Y |  | FK→nhan_su.id |  |
| trang_thai | text |  | 'mo'::text |  | `mo` · `hoan_tat` · `huy` |
| ly_do_huy | text | Y |  |  |  |
| ingame_dong_at | timestamp with time zone | Y |  |  |  |
| et_dong_at | timestamp with time zone | Y |  |  |  |
| created_by | uuid | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |
| danh_gia_xong_at | timestamp with time zone | Y |  |  |  |
| btvn_dong_at | timestamp with time zone | Y |  |  |  |
| muc_hoc_duoi_id | uuid | Y |  | FK→muc_hoc_duoi.id |  |
| mt_dong_at | timestamp with time zone | Y |  |  |  |
| noi_dung_buoi | text | Y |  |  |  |
| mo_ta | text | Y |  |  |  |
| ngu_canh_luot | text | Y |  |  | `mo_hinh` · `dang` · `luyen_de` |

## buoi_hoc_hs

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| buoi_hoc_id | uuid |  |  | FK→buoi_hoc.id |  |
| hoc_sinh_id | uuid |  |  | FK→hoc_sinh.id |  |
| diem_danh | text | Y |  |  | `co_mat` · `vang` · `vang_phep` |
| bu_cho_buoi_id | uuid | Y |  | FK→buoi_hoc.id |  |
| created_at | timestamp with time zone |  | now() |  |  |
| bo_tro_duoi_id | uuid | Y |  | FK→bo_tro_duoi.id |  |
| bao_den_at | timestamp with time zone | Y |  |  |  |
| bo_tro_yeu_id | uuid | Y |  | FK→bo_tro_yeu.id |  |

## ca_test

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| ung_vien_id | uuid |  |  | FK→ung_vien.id |  |
| mon | text |  |  |  |  |
| ngay | date |  |  |  |  |
| gio_bat_dau | time without time zone |  |  |  |  |
| thoi_luong_phut | integer |  |  |  |  |
| trang_thai | text |  | 'dang_test'::text |  | `dang_test` · `hoan_thanh` |
| bai_url | text | Y |  |  |  |
| hoan_thanh_at | timestamp with time zone | Y |  |  |  |
| created_by | uuid | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| cham_xong_at | timestamp with time zone | Y |  |  |  |
| danh_gia_xong_at | timestamp with time zone | Y |  |  |  |
| tra_bai_xong_at | timestamp with time zone | Y |  |  |  |
| nhan_xet | jsonb | Y |  |  |  |
| tai_lieu_id | uuid | Y |  | FK→tai_lieu.id |  |
| bai_da_cham_url | text | Y |  |  |  |

## ca_test_cau

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| ca_test_id | uuid |  |  | FK→ca_test.id |  |
| thu_tu | integer |  |  |  |  |
| diem_toi_da | numeric |  | 1 |  |  |
| dap_an | text | Y |  |  |  |
| ma_dang | text | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| ma_cau | text | Y |  |  |  |
| loai_cau | text | Y |  |  |  |
| noi_dung | text | Y |  |  |  |
| lua_chon | jsonb | Y |  |  |  |
| menh_de | jsonb | Y |  |  |  |
| loi_giai | text | Y |  |  |  |
| anh_de | text | Y |  |  |  |
| anh_dap_an | text | Y |  |  |  |

## ca_test_cau_kq

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| ca_test_cau_id | uuid |  |  | FK→ca_test_cau.id |  |
| ket_qua | text |  |  |  | `correct` · `partial` · `wrong` |
| diem | numeric |  |  |  |  |
| cham_boi | uuid | Y |  |  |  |
| cham_at | timestamp with time zone |  | now() |  |  |

## ca_test_log

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| ca_test_id | uuid |  |  | FK→ca_test.id |  |
| hanh_dong | text |  |  |  |  |
| truoc | jsonb | Y |  |  |  |
| sau | jsonb |  |  |  |  |
| actor | uuid | Y |  |  |  |
| ts | timestamp with time zone |  | now() |  |  |

## canh_bao_yeu

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| hoc_sinh_id | uuid |  |  | FK→hoc_sinh.id |  |
| ma_dang | text |  |  |  |  |
| buoi_hoc_id | uuid | Y |  | FK→buoi_hoc.id |  |
| nguon | text |  | 'btvn'::text |  |  |
| ghi_chu | text | Y |  |  |  |
| created_by | uuid | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| hinh_y_id | uuid | Y |  | FK→hinh_y.id |  |
| ngu_canh_luot | text | Y |  |  | `mo_hinh` · `dang` · `luyen_de` |

## dai_ban_do

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| ma_dang | text |  | ('DG'::text \|\| lpad((nextval('dai_dang_seq'::regclass))::text, 5, '0'::text)) | PK |  |
| khoi | text |  |  |  |  |
| ma_chu_de | text |  |  |  |  |
| ten_chu_de | text |  |  |  |  |
| ma_chuyen_de | text |  |  |  |  |
| ten_chuyen_de | text |  |  |  |  |
| ten_dang | text |  |  |  |  |
| muc_do | smallint |  |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| bac_toi_thieu | text |  |  | FK→lop_bac.ma |  |
| mo_ta_ngan | text | Y |  |  |  |

## dai_cau_bo_de

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| ma_cau | text |  |  | PK FK→dai_cau_hoi.ma_cau |  |
| id_bo_de | text |  |  | PK FK→dai_danh_muc_bo_de.id |  |

## dai_cau_hoi

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| ma_cau | text |  | ('DC'::text \|\| lpad((nextval('dai_cau_seq'::regclass))::text, 6, '0'::text)) | PK |  |
| dang_chinh | text |  |  | FK→dai_ban_do.ma_dang |  |
| loai_cau | text |  |  |  |  |
| noi_dung | text |  |  |  |  |
| lua_chon | jsonb | Y |  |  |  |
| menh_de | jsonb | Y |  |  |  |
| dap_an | text | Y |  |  |  |
| loi_giai | text | Y |  |  |  |
| anh_de | text | Y |  |  |  |
| anh_dap_an | text | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| nguon | text |  | 'le'::text |  |  |
| parent_ma_cau | text | Y |  | FK→dai_cau_hoi.ma_cau |  |
| clone_method | text | Y |  |  |  |
| nguon_giai | text |  | 'nguoi'::text |  |  |
| xoa_at | timestamp with time zone | Y |  |  |  |

## dai_chuyen_de_ly_thuyet

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| ma_chuyen_de | text |  |  | PK |  |
| noi_dung | text |  | ''::text |  |  |
| file_url | text | Y |  |  |  |
| ten_file | text | Y |  |  |  |
| cap_nhat_at | timestamp with time zone |  | now() |  |  |
| khong_can | boolean |  | false |  |  |

## dai_dang_ly_thuyet

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| ma_dang | text |  |  | PK FK→dai_ban_do.ma_dang |  |
| file_url | text | Y |  |  |  |
| ten_file | text | Y |  |  |  |
| cap_nhat_at | timestamp with time zone |  | now() |  |  |
| noi_dung | text |  | ''::text |  |  |

## dai_dang_thuoc_tinh

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| ma_dang | text |  |  | PK FK→dai_ban_do.ma_dang |  |
| id_thuoc_tinh | text |  |  | PK FK→dai_danh_muc_thuoc_tinh.id |  |

## dai_danh_muc_bo_de

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | text |  | ('BD'::text \|\| lpad((nextval('dai_bd_seq'::regclass))::text, 4, '0'::text)) | PK |  |
| ten | text |  |  |  |  |

## dai_danh_muc_thuoc_tinh

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | text |  | ('TT'::text \|\| lpad((nextval('dai_tt_seq'::regclass))::text, 4, '0'::text)) | PK |  |
| ten | text |  |  |  |  |

## danhgia_ai_job

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| lop_id | uuid |  |  | FK→lop.id |  |
| mon | text |  |  |  |  |
| stat_sheet | jsonb |  |  |  |  |
| trang_thai | text |  | 'pending'::text |  | `pending` · `processing` · `done` · `failed` |
| attempt | integer |  | 0 |  |  |
| ket_qua | jsonb | Y |  |  |  |
| model | text | Y |  |  |  |
| usage | jsonb | Y |  |  |  |
| error | text | Y |  |  |  |
| created_by | uuid | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |
| done_at | timestamp with time zone | Y |  |  |  |
| model_chon | text | Y |  |  |  |

## de_test_ghim

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| tai_lieu_id | uuid |  |  | PK FK→tai_lieu.id |  |
| ghim_boi | uuid | Y |  |  |  |
| ghim_at | timestamp with time zone |  | now() |  |  |

## diem_thi

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| ky_thi_id | uuid |  |  | PK FK→ky_thi.id |  |
| hoc_sinh_id | uuid |  |  | PK FK→hoc_sinh.id |  |
| diem | numeric | Y |  |  |  |
| band_luc_thi | text | Y |  |  |  |
| verdict | text |  |  |  | `dat` · `gan_dat` · `khong_dat` |
| vuot_band | boolean |  | false |  |  |
| graded_by | uuid | Y |  |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |
| diem_co_ban | numeric | Y |  |  |  |
| diem_nang_cao | numeric | Y |  |  |  |
| full_diem | boolean |  | false |  |  |

## gami_elo

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| hoc_sinh_id | uuid |  |  | FK→hoc_sinh.id |  |
| elo | integer |  | 1000 |  |  |
| sessions_played | integer |  | 0 |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |
| mon | text |  |  |  |  |

## gami_elo_history

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| hoc_sinh_id | uuid |  |  | FK→hoc_sinh.id |  |
| buoi_hoc_id | uuid |  |  | FK→buoi_hoc.id |  |
| phase | text |  |  |  |  |
| elo_before | integer |  |  |  |  |
| expected | numeric |  |  |  |  |
| actual | numeric |  |  |  |  |
| delta | integer |  |  |  |  |
| elo_after | integer |  |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| mon | text | Y |  |  |  |
| rank | integer | Y |  |  |  |
| rank_total | integer | Y |  |  |  |

## gami_exp_ledger

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| hoc_sinh_id | uuid |  |  | FK→hoc_sinh.id |  |
| source | text |  |  |  |  |
| amount | integer |  |  |  |  |
| ref_buoi_hoc_id | uuid | Y |  | FK→buoi_hoc.id |  |
| note | text | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| mon | text | Y |  |  |  |

## gami_grades

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| buoi_hoc_id | uuid |  |  | FK→buoi_hoc.id |  |
| problem_id | uuid |  |  | FK→gami_session_problems.id |  |
| hoc_sinh_id | uuid |  |  | FK→hoc_sinh.id |  |
| result | text |  |  |  | `correct` · `partial` · `wrong` |
| presentation | text |  |  |  | `clean` · `ok` · `sloppy` |
| speed | text |  |  |  | `fast` · `normal` · `slow` |
| points | numeric |  |  |  |  |
| graded_by | uuid | Y |  |  |  |
| graded_at | timestamp with time zone |  | now() |  |  |
| loi | jsonb |  | '[]'::jsonb |  |  |
| muc | smallint | Y |  |  |  |

## gami_session_problems

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| buoi_hoc_id | uuid |  |  | FK→buoi_hoc.id |  |
| phase | text |  |  |  | `ingame` · `et` · `mt` · `btvn` |
| problem_no | integer |  |  |  |  |
| opened_at | timestamp with time zone |  | now() |  |  |
| deadline_at | timestamp with time zone | Y |  |  |  |
| hidden | boolean |  | false |  |  |
| ma_dang | text | Y |  |  |  |
| hoc_sinh_id | uuid | Y |  | FK→hoc_sinh.id |  |
| ma_cau | text | Y |  |  |  |
| hinh_y_id | uuid | Y |  | FK→hinh_y.id |  |
| ngu_canh_luot | text | Y |  |  | `mo_hinh` · `dang` · `luyen_de` |

## hgt_ban_do

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| ma_dang | text |  | ('GT'::text \|\| lpad((nextval('hgt_dang_seq'::regclass))::text, 5, '0'::text)) | PK |  |
| khoi | text |  |  |  |  |
| ma_chu_de | text |  |  |  |  |
| ten_chu_de | text |  |  |  |  |
| ma_chuyen_de | text |  |  |  |  |
| ten_chuyen_de | text |  |  |  |  |
| ten_dang | text |  |  |  |  |
| muc_do | smallint |  |  |  |  |
| bac_toi_thieu | text |  |  | FK→lop_bac.ma |  |
| created_at | timestamp with time zone |  | now() |  |  |

## hgt_cau_hoi

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| ma_cau | text |  | ('GC'::text \|\| lpad((nextval('hgt_cau_seq'::regclass))::text, 6, '0'::text)) | PK |  |
| dang_chinh | text |  |  | FK→hgt_ban_do.ma_dang |  |
| loai_cau | text |  |  |  |  |
| noi_dung | text |  |  |  |  |
| lua_chon | jsonb | Y |  |  |  |
| menh_de | jsonb | Y |  |  |  |
| dap_an | text | Y |  |  |  |
| loi_giai | text | Y |  |  |  |
| anh_de | text | Y |  |  |  |
| anh_dap_an | text | Y |  |  |  |
| nguon | text |  | 'le'::text |  |  |
| nguon_giai | text |  | 'nguoi'::text |  |  |
| parent_ma_cau | text | Y |  | FK→hgt_cau_hoi.ma_cau |  |
| clone_method | text | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| xoa_at | timestamp with time zone | Y |  |  |  |

## hgt_chuyen_de_ly_thuyet

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| ma_chuyen_de | text |  |  | PK |  |
| noi_dung | text |  | ''::text |  |  |
| file_url | text | Y |  |  |  |
| ten_file | text | Y |  |  |  |
| khong_can | boolean |  | false |  |  |
| cap_nhat_at | timestamp with time zone |  | now() |  |  |

## hgt_dang_ly_thuyet

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| ma_dang | text |  |  | PK FK→hgt_ban_do.ma_dang |  |
| noi_dung | text |  | ''::text |  |  |
| file_url | text | Y |  |  |  |
| ten_file | text | Y |  |  |  |
| cap_nhat_at | timestamp with time zone |  | now() |  |  |

## hinh_bai

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| mon | text |  | 'Toán'::text |  |  |
| ma_bai | text |  | ('HH.'::text \|\| lpad((nextval('hinh_bai_v3_seq'::regclass))::text, 4, '0'::text)) |  |  |
| de_bai | text |  |  |  |  |
| anh_de | text |  |  |  |  |
| nguon | text | Y |  |  |  |
| khoi | text | Y |  |  |  |
| trang_thai | text |  | 'tam'::text |  | `tam` · `chinh` |
| created_by | uuid | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |

## hinh_baitoan

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| mon | text |  | 'Toán'::text |  |  |
| ma | text |  | ('BT.'::text \|\| lpad((nextval('hinh_baitoan_seq'::regclass))::text, 3, '0'::text)) |  |  |
| phat_bieu | text |  |  |  |  |
| mo_hinh_id | uuid |  |  | FK→hinh_mo_hinh.id |  |
| cap | smallint |  |  |  |  |
| de_bai_chuan | text | Y |  |  |  |
| anh_chuan | text | Y |  |  |  |
| ghi_chu | text | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |
| gia_thiet_phu | text | Y |  |  |  |

## hinh_baitoan_bien_the

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| baitoan_id | uuid |  |  | FK→hinh_baitoan.id |  |
| mon | text |  | 'Toán'::text |  |  |
| kieu | text |  | 'doi_dinh'::text |  | `doi_so` · `doi_dinh` · `ca_hai` |
| de_bai | text |  | ''::text |  |  |
| anh | text | Y |  |  |  |
| loi_giai | text | Y |  |  |  |
| anh_loi_giai | text | Y |  |  |  |
| ghi_chu | text | Y |  |  |  |
| thu_tu | integer |  | 0 |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |
| lua_id | uuid | Y |  |  |  |
| tien_de_ids | uuid[] |  | '{}'::uuid[] |  |  |

## hinh_ban_do

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| ma_dang_hinh | text |  | ('HD'::text \|\| lpad((nextval('hinh_dang_seq'::regclass))::text, 5, '0'::text)) | PK |  |
| khoi | text |  |  |  |  |
| ma_mang | text |  |  |  |  |
| ten_mang | text |  |  |  |  |
| ma_loai_ch | text |  |  |  |  |
| ten_loai_ch | text |  |  |  |  |
| ten_dang | text |  |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| bac_toi_thieu | text |  |  | FK→lop_bac.ma |  |

## hinh_bo_de

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| mon | text |  | 'Toán'::text |  |  |
| ma | text |  | ('BD.'::text \|\| lpad((nextval('hinh_bo_de_seq'::regclass))::text, 3, '0'::text)) |  |  |
| ten | text |  |  |  |  |
| phat_bieu | text | Y |  |  |  |
| thu_tu | integer |  | 0 |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |
| khoi | text | Y |  |  |  |

## hinh_bo_de_ly_thuyet

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| bo_de_id | uuid |  |  | PK FK→hinh_bo_de.id |  |
| noi_dung | text |  | ''::text |  |  |
| file_url | text | Y |  |  |  |
| ten_file | text | Y |  |  |  |
| cap_nhat_at | timestamp with time zone |  | now() |  |  |

## hinh_cach_bo_de

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| cach_id | uuid |  |  | PK FK→hinh_cach_giai.id |  |
| bo_de_id | uuid |  |  | PK FK→hinh_bo_de.id |  |

## hinh_cach_giai

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| baitoan_id | uuid |  |  | FK→hinh_baitoan.id |  |
| ten | text | Y |  |  |  |
| dang_id | uuid | Y |  | FK→hinh_dang.id |  |
| loi_giai | text | Y |  |  |  |
| anh_loi_giai | text | Y |  |  |  |
| la_mac_dinh | boolean |  | false |  |  |
| thu_tu | integer |  | 0 |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |

## hinh_cach_tien_de

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| cach_id | uuid |  |  | PK FK→hinh_cach_giai.id |  |
| tien_de_id | uuid |  |  | PK FK→hinh_baitoan.id |  |
| keo_gt_phu | boolean |  | false |  |  |

## hinh_dang

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| mon | text |  | 'Toán'::text |  |  |
| ma | text |  | ('DH.'::text \|\| lpad((nextval('hinh_dang_v3_seq'::regclass))::text, 3, '0'::text)) |  |  |
| ten | text |  |  |  |  |
| cap | text |  |  |  | `loai_ch` · `dang` |
| cha_id | uuid | Y |  | FK→hinh_dang.id |  |
| thu_tu | integer |  | 0 |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |
| khoi | text | Y |  |  |  |

## hinh_dang_ly_thuyet

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| dang_id | uuid |  |  | PK FK→hinh_dang.id |  |
| noi_dung | text |  | ''::text |  |  |
| file_url | text | Y |  |  |  |
| ten_file | text | Y |  |  |  |
| cap_nhat_at | timestamp with time zone |  | now() |  |  |

## hinh_giao_trinh

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| ten | text |  |  |  |  |
| khoi | text |  |  |  |  |
| mon | text |  | 'Toán'::text |  |  |
| created_by | uuid | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |

## hinh_gt_bai

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| buoi_id | uuid |  |  | FK→hinh_gt_buoi.id |  |
| phan | text |  |  |  | `lop` · `nha` |
| loai | text |  |  |  | `chuan` · `bienthe` · `y` · `ghep` |
| ref_id | uuid | Y |  |  |  |
| ghep_node_ids | uuid[] |  | '{}'::uuid[] |  |  |
| lua_id | uuid | Y |  |  |  |
| an_de | boolean |  | false |  |  |
| thu_tu | integer |  | 0 |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| so_dong | integer | Y |  |  |  |

## hinh_gt_buoi

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| thu_tu | integer |  | 0 |  |  |
| tieu_de | text | Y |  |  |  |
| mo_hinh_chinh_id | uuid | Y |  | FK→hinh_mo_hinh.id |  |
| giao_trinh_id | uuid | Y |  | FK→hinh_giao_trinh.id |  |
| lop_id | uuid | Y |  |  |  |
| ngay | date | Y |  |  |  |
| stt_lop | integer | Y |  |  |  |
| nguon_buoi_id | uuid | Y |  |  |  |
| created_by | uuid | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |

## hinh_mo_hinh

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| mon | text |  | 'Toán'::text |  |  |
| ma | text |  | ('MH.'::text \|\| lpad((nextval('hinh_mo_hinh_seq'::regclass))::text, 3, '0'::text)) |  |  |
| ten | text |  |  |  |  |
| gia_thiet | text |  |  |  |  |
| gia_thiet_them | text | Y |  |  |  |
| anh_cau_hinh | text | Y |  |  |  |
| la_goc_ho | boolean |  | false |  |  |
| cap_mo_hinh | smallint | Y |  |  |  |
| khoi | text | Y |  |  |  |
| ghi_chu | text | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |
| gt_thay_the | boolean |  | false |  |  |

## hinh_mo_hinh_cha

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| mo_hinh_id | uuid |  |  | PK FK→hinh_mo_hinh.id |  |
| cha_id | uuid |  |  | PK FK→hinh_mo_hinh.id |  |

## hinh_y

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| bai_id | uuid |  |  | FK→hinh_bai.id |  |
| thu_tu | integer |  |  |  |  |
| nhan_hien_thi | text | Y |  |  |  |
| noi_dung | text |  |  |  |  |
| dap_an | text | Y |  |  |  |
| loi_giai | text | Y |  |  |  |
| anh_loi_giai | text | Y |  |  |  |
| da_duyet | boolean |  | false |  |  |
| baitoan_id | uuid | Y |  | FK→hinh_baitoan.id |  |
| co_thieu_node | boolean |  | false |  |  |
| mo_ta_thieu | text | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |
| ma_y | text |  | ('HY.'::text \|\| lpad((nextval('hinh_y_ma_seq'::regclass))::text, 5, '0'::text)) |  |  |

## hoa_don

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| phu_huynh_id | uuid |  |  | FK→phu_huynh.id |  |
| ky | date |  |  |  |  |
| trang_thai | text |  | 'chua_thu'::text |  | `chua_thu` · `da_thu` · `thu_mot_phan` · `qua_han` · `xet_duyet` · `mien` |
| tong_tien | numeric |  | 0 |  |  |
| dong_at | timestamp with time zone | Y |  |  |  |
| created_by | uuid | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| trang_thai_tb | text |  | 'thong_bao_1'::text |  | `thong_bao_1` · `cho_xu_ly` · `hoan_thanh` |
| bao_lan1_at | timestamp with time zone | Y |  |  |  |

## hoa_don_dong

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| hoa_don_id | uuid |  |  | FK→hoa_don.id |  |
| loai | text |  |  |  | `hoc_phi` · `hoc_duoi` · `hoc_lieu` · `phat_sinh` · `no_ky_truoc` · `giam_gioi_thieu` |
| hoc_sinh_id | uuid | Y |  | FK→hoc_sinh.id |  |
| lop_id | uuid | Y |  | FK→lop.id |  |
| mo_ta | text | Y |  |  |  |
| so_luong | numeric | Y |  |  |  |
| don_gia | numeric | Y |  |  |  |
| he_so | numeric | Y |  |  |  |
| thanh_tien | numeric |  |  |  |  |
| snapshot | jsonb | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |

## hoa_don_log

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| hoa_don_id | uuid |  |  | FK→hoa_don.id |  |
| hanh_dong | text |  |  |  |  |
| truoc | jsonb | Y |  |  |  |
| sau | jsonb |  |  |  |  |
| actor | uuid | Y |  |  |  |
| ts | timestamp with time zone |  | now() |  |  |

## hoc_phi_cong_thuc

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| hoc_sinh_id | uuid |  |  | PK FK→hoc_sinh.id |  |
| lop_id | uuid |  |  | PK FK→lop.id |  |
| ky | date |  |  | PK |  |
| cong_thuc | text |  |  |  | `ct1` · `ct2` |
| actor | uuid | Y |  |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |

## hoc_phi_phat_sinh

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| ky | date |  |  |  |  |
| loai | text |  |  |  | `lop` · `ca_nhan` |
| lop_id | uuid | Y |  | FK→lop.id |  |
| hoc_sinh_id | uuid | Y |  | FK→hoc_sinh.id |  |
| mo_ta | text |  |  |  |  |
| so_tien | numeric |  |  |  |  |
| created_by | uuid | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |

## hoc_phi_tin_dung

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| phu_huynh_id | uuid |  |  | FK→phu_huynh.id |  |
| hoc_sinh_moi_id | uuid | Y |  | FK→hoc_sinh.id |  |
| so_tien | numeric |  | 500000 |  |  |
| hieu_luc_tu | date |  |  |  |  |
| mo_ta | text | Y |  |  |  |
| created_by | uuid | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |

## hoc_phi_xet_duyet

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| hoc_sinh_id | uuid |  |  | FK→hoc_sinh.id |  |
| lop_id | uuid |  |  | FK→lop.id |  |
| ky | date |  |  |  |  |
| ly_do | text |  |  |  | `nghi_30` · `window_lech` |
| so_buoi_lop | integer | Y |  |  |  |
| so_buoi_window | integer | Y |  |  |  |
| so_buoi_nghi | integer | Y |  |  |  |
| trang_thai | text |  | 'cho_duyet'::text |  | `cho_duyet` · `da_duyet` |
| so_buoi_chot | integer | Y |  |  |  |
| quyet_dinh | text | Y |  |  |  |
| nguoi_duyet | uuid | Y |  |  |  |
| duyet_at | timestamp with time zone | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |

## hoc_sinh

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| ma_hs | text | Y | ('HS'::text \|\| lpad((nextval('hs_seq'::regclass))::text, 4, '0'::text)) |  |  |
| ho_ten | text |  |  |  |  |
| ngay_sinh | date | Y |  |  |  |
| gioi_tinh | text | Y |  |  | `nam` · `nu` |
| khoi | text | Y |  |  |  |
| trang_thai | text |  | 'dang_hoc'::text |  | `dang_hoc` · `bao_luu` · `nghi` · `tot_nghiep` |
| diem_test_dau_vao | numeric | Y |  |  |  |
| ngay_nhap_hoc | date | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |
| dia_chi | text | Y |  |  |  |
| truong_hoc | text | Y |  |  |  |
| phu_huynh_id | uuid | Y |  | FK→phu_huynh.id |  |
| anh_url | text | Y |  |  |  |
| he_so_hoc_phi | numeric |  | 1 |  |  |
| he_so_nguon | text |  | 'auto'::text |  | `auto` · `manual` |
| ngay_nghi | date | Y |  |  |  |
| ly_do_nghi | text | Y |  |  |  |

## hoc_sinh_he_so

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| hoc_sinh_id | uuid |  |  | FK→hoc_sinh.id |  |
| he_so | numeric |  |  |  |  |
| hieu_luc_tu | date |  |  |  |  |
| nguon | text |  | 'manual'::text |  |  |
| created_by | uuid | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |

## hoc_sinh_lop

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| hoc_sinh_id | uuid |  |  | FK→hoc_sinh.id |  |
| lop_id | uuid |  |  | FK→lop.id |  |
| muc_nang_luc_id | uuid | Y |  | FK→muc_nang_luc.id |  |
| ngay_vao | date |  |  |  |  |
| trang_thai | text |  | 'dang_hoc'::text |  | `dang_hoc` · `da_roi` |
| ngay_roi | date | Y |  |  |  |

## hoc_sinh_lop_log

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| ghi_danh_id | uuid | Y |  |  |  |
| hoc_sinh_id | uuid | Y |  |  |  |
| lop_id | uuid | Y |  |  |  |
| hanh_dong | text |  |  |  |  |
| truoc | jsonb | Y |  |  |  |
| sau | jsonb |  |  |  |  |
| actor | uuid | Y |  |  |  |
| ts | timestamp with time zone |  | now() |  |  |

## hoc_sinh_thanh_tich_ghim

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| hoc_sinh_id | uuid |  |  | PK FK→hoc_sinh.id |  |
| mon | text |  |  | PK |  |
| loai_key | text |  |  | PK FK→thanh_tich_loai.key |  |
| thu_tu | integer |  | 0 |  |  |

## hs_level

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| hoc_sinh_id | uuid |  |  | PK FK→hoc_sinh.id |  |
| mon | text |  |  | PK |  |
| loai | text |  |  | PK | `kien_thuc` · `thai_do` |
| level | smallint |  |  |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |

## hs_level_log

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| hoc_sinh_id | uuid |  |  | FK→hoc_sinh.id |  |
| mon | text |  |  |  |  |
| loai | text |  |  |  | `kien_thuc` · `thai_do` |
| level_cu | smallint | Y |  |  |  |
| level_may_de_xuat | smallint | Y |  |  |  |
| ly_do_may | jsonb |  | '{}'::jsonb |  |  |
| level_chot | smallint |  |  |  |  |
| ly_do_nguoi | text | Y |  |  |  |
| actor | uuid | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |

## kho_cau_log

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| tbl | text |  |  |  |  |
| ma_cau | text |  |  |  |  |
| hanh_dong | text |  |  |  | `vao_rac` · `khoi_phuc` · `xoa_vinh_vien` |
| truoc | jsonb | Y |  |  |  |
| sau | jsonb | Y |  |  |  |
| actor | uuid | Y |  |  |  |
| ts | timestamp with time zone |  | now() |  |  |

## kho_tag_log

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| mon | text |  |  |  |  |
| ma_cau | text | Y |  |  |  |
| loai_field | text |  | 'dang'::text |  |  |
| ai_value | text | Y |  |  |  |
| final_value | text | Y |  |  |  |
| ai_confidence | real | Y |  |  |  |
| da_verify | boolean |  | false |  |  |
| nguoi_id | uuid | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |

## khtn_ban_do

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| ma_dang | text |  | ('KG'::text \|\| lpad((nextval('khtn_dang_seq'::regclass))::text, 5, '0'::text)) | PK |  |
| khoi | text |  |  |  |  |
| ma_chu_de | text |  |  |  |  |
| ten_chu_de | text |  |  |  |  |
| ma_chuyen_de | text |  |  |  |  |
| ten_chuyen_de | text |  |  |  |  |
| ten_dang | text |  |  |  |  |
| muc_do | smallint |  |  |  |  |
| bac_toi_thieu | text |  |  | FK→lop_bac.ma |  |
| created_at | timestamp with time zone |  | now() |  |  |
| mo_ta_ngan | text | Y |  |  |  |

## khtn_cau_hoi

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| ma_cau | text |  | ('KC'::text \|\| lpad((nextval('khtn_cau_seq'::regclass))::text, 6, '0'::text)) | PK |  |
| dang_chinh | text |  |  | FK→khtn_ban_do.ma_dang |  |
| loai_cau | text |  |  |  |  |
| noi_dung | text |  |  |  |  |
| lua_chon | jsonb | Y |  |  |  |
| menh_de | jsonb | Y |  |  |  |
| dap_an | text | Y |  |  |  |
| loi_giai | text | Y |  |  |  |
| anh_de | text | Y |  |  |  |
| anh_dap_an | text | Y |  |  |  |
| nguon | text |  | 'le'::text |  |  |
| nguon_giai | text |  | 'nguoi'::text |  |  |
| parent_ma_cau | text | Y |  | FK→khtn_cau_hoi.ma_cau |  |
| clone_method | text | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| xoa_at | timestamp with time zone | Y |  |  |  |

## khtn_chuyen_de_ly_thuyet

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| ma_chuyen_de | text |  |  | PK |  |
| noi_dung | text |  | ''::text |  |  |
| file_url | text | Y |  |  |  |
| ten_file | text | Y |  |  |  |
| khong_can | boolean |  | false |  |  |
| cap_nhat_at | timestamp with time zone |  | now() |  |  |

## khtn_dang_ly_thuyet

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| ma_dang | text |  |  | PK FK→khtn_ban_do.ma_dang |  |
| noi_dung | text |  | ''::text |  |  |
| file_url | text | Y |  |  |  |
| ten_file | text | Y |  |  |  |
| cap_nhat_at | timestamp with time zone |  | now() |  |  |

## ky_thi

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| ten | text |  |  |  |  |
| loai | text |  |  |  | `truong` · `mt_sat_hach` · `khao_sat_thang` |
| he_so | integer |  |  |  |  |
| dot | text | Y |  |  | `giua_ky_1` · `cuoi_ky_1` · `giua_ky_2` · `cuoi_ky_2` |
| ngay | date | Y |  |  |  |
| mon | text | Y |  |  |  |
| khoi | text | Y |  |  |  |
| mua | text | Y |  |  |  |
| buoi_hoc_id | uuid | Y |  | FK→buoi_hoc.id |  |
| created_at | timestamp with time zone |  | now() |  |  |

## linkgen_jobs

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| tai_lieu_id | uuid |  |  | PK FK→tai_lieu.id |  |
| loai | text |  |  |  |  |
| status | text |  | 'pending'::text |  | `pending` · `processing` · `done` · `failed` |
| attempt | integer |  | 0 |  |  |
| error | text | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |

## loai_viec

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| ten | text |  |  |  |  |
| thang_kl | jsonb |  | '[]'::jsonb |  |  |
| active | boolean |  | true |  |  |
| created_at | timestamp with time zone |  | now() |  |  |

## lop

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| ten_lop | text |  |  |  |  |
| mon | text |  |  |  |  |
| khoi | text | Y |  |  |  |
| bac | text | Y |  | FK→lop_bac.ma |  |
| co_so | text | Y |  |  |  |
| trang_thai | text |  | 'dang_hoc'::text |  | `dang_hoc` · `dong` |
| created_at | timestamp with time zone |  | now() |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |
| ngay_khai_giang | date | Y |  |  |  |
| muc_hoc_phi_id | uuid | Y |  | FK→muc_hoc_phi.id |  |
| muc_hoc_lieu_id | uuid | Y |  | FK→muc_hoc_lieu.id |  |

## lop_bac

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| ma | text |  |  | PK |  |
| ten | text |  |  |  |  |
| thu_tu | smallint |  |  |  |  |

## luong_bac

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| min_exp | integer |  |  | PK |  |
| xu | integer |  |  |  |  |

## muc_hoc_duoi

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| ten | text |  |  |  |  |
| gia | numeric |  |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |

## muc_hoc_lieu

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| ten | text |  |  |  |  |
| gia | numeric |  |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |

## muc_hoc_phi

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| ten | text |  |  |  |  |
| don_gia_buoi | numeric |  |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |

## muc_nang_luc

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| ma | text |  |  |  |  |
| bac | text |  |  | FK→lop_bac.ma |  |
| muc | smallint |  |  |  |  |
| thu_tu | smallint |  |  |  |  |
| ten | text | Y |  |  |  |
| diem_ky_vong | numeric | Y |  |  |  |

## nhan_su

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| ho_ten | text |  |  |  |  |
| so_dien_thoai | text | Y |  |  |  |
| email | text | Y |  |  |  |
| trang_thai | text |  | 'dang_lam'::text |  | `dang_lam` · `nghi` |
| ngay_vao_lam | date | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |
| ma_ns | text | Y | ('NS'::text \|\| lpad((nextval('ns_seq'::regclass))::text, 3, '0'::text)) |  |  |
| anh_url | text | Y |  |  |  |
| la_admin_he_thong | boolean |  | false |  |  |

## nhan_su_mon

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| nhan_su_id | uuid |  |  | PK FK→nhan_su.id |  |
| mon | text |  |  | PK |  |

## nhan_su_team

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| nhan_su_id | uuid |  |  | PK FK→nhan_su.id |  |
| team_id | uuid |  |  | PK FK→team.id |  |

## nhan_xet_mau

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| mon | text |  |  |  |  |
| nhom | text |  |  |  | `ky_nang` · `kien_thuc` · `khac` |
| noi_dung | text |  |  |  |  |
| created_by | uuid | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |

## phan_cong_ca

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| thu | smallint |  |  |  |  |
| ca | text |  |  |  | `sang` · `chieu` · `toi` |
| nhan_su_id | uuid |  |  | FK→nhan_su.id |  |
| hieu_luc_tu | date |  |  |  |  |
| hieu_luc_den | date | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |

## phan_cong_lop

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| nhan_su_id | uuid |  |  | FK→nhan_su.id |  |
| lop_id | uuid |  |  | FK→lop.id |  |
| vai_tro | text |  |  |  | `gv` · `tg` |
| la_chinh | boolean |  | false |  |  |
| created_at | timestamp with time zone |  | now() |  |  |

## phan_cong_ops

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| tkb_id | uuid |  |  | FK→thoi_khoa_bieu.id |  |
| nhan_su_id | uuid |  |  | FK→nhan_su.id |  |
| hieu_luc_tu | date |  |  |  |  |
| hieu_luc_den | date | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |

## phu_huynh

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| ma_ph | text |  | ('PH'::text \|\| lpad((nextval('ph_seq'::regclass))::text, 4, '0'::text)) |  |  |
| ho_ten | text |  |  |  |  |
| so_dien_thoai | text | Y |  |  |  |
| email | text | Y |  |  |  |
| dia_chi | text | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |
| no_khoi_tao | numeric |  | 0 |  |  |

## prep_phong

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| phong | text |  |  |  |  |
| ngay | date |  |  |  |  |
| luot | text |  |  |  | `sang` · `chieu` · `toi` |
| nhan_su_id | uuid | Y |  | FK→nhan_su.id |  |
| don_phong | boolean |  | false |  |  |
| chuan_bi_kit | boolean |  | false |  |  |
| anh_url | text | Y |  |  |  |
| dong_at | timestamp with time zone | Y |  |  |  |
| gv_diem_nen | numeric |  | 100 |  |  |
| gv_ghi_chu | text | Y |  |  |  |
| gv_cham_at | timestamp with time zone | Y |  |  |  |
| leader_chot_at | timestamp with time zone | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |

## question_accepted_answers

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| ma_cau | text |  |  |  |  |
| answer_normalized | text |  |  |  |  |
| answer_raw | text | Y |  |  |  |
| source | text |  | 'manual'::text |  |  |
| ai_reason | text | Y |  |  |  |
| hit_count | integer |  | 1 |  |  |
| created_at | timestamp with time zone |  | now() |  |  |

## tai_khoan

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  |  | PK |  |
| nhan_su_id | uuid | Y |  | FK→nhan_su.id |  |
| email | text | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| hoc_sinh_id | uuid | Y |  | FK→hoc_sinh.id |  |

## tai_lieu

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| loai | text |  | 'giao_trinh'::text |  |  |
| ten | text |  |  |  |  |
| khoi | text |  |  |  |  |
| ma_chuyen_de | text | Y |  |  |  |
| theme | text |  | 'bkdemy'::text |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |
| cau_hinh | jsonb |  | '{}'::jsonb |  |  |
| created_by | uuid | Y |  |  |  |
| lop_id | uuid | Y |  | FK→lop.id |  |
| ngay | date | Y |  |  |  |
| nguon_id | uuid | Y |  | FK→tai_lieu.id |  |
| nguon_buoi | text | Y |  |  |  |
| mon | text |  | 'Toán'::text |  |  |
| hoc_sinh_id | uuid | Y |  | FK→hoc_sinh.id |  |
| file_url | text | Y |  |  |  |
| stt_lop | integer | Y |  |  |  |
| nhanh | text | Y |  |  |  |

## tai_lieu_cau

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| phan_id | uuid |  |  | FK→tai_lieu_phan.id |  |
| ma_cau | text |  |  |  |  |
| thu_tu | integer |  | 0 |  |  |

## tai_lieu_phan

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| tai_lieu_id | uuid |  |  | FK→tai_lieu.id |  |
| thu_tu | integer |  | 0 |  |  |
| loai_phan | text |  |  |  |  |
| ref_ma | text | Y |  |  |  |
| tieu_de | text | Y |  |  |  |
| noi_dung | text | Y |  |  |  |
| kieu | text |  | 'thuong'::text |  |  |
| hien_lt | boolean |  | true |  |  |

## team

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| ma | text |  |  |  |  |
| ten | text |  |  |  |  |
| thu_tu | smallint |  | 0 |  |  |

## thanh_tich_loai

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| key | text |  |  | PK |  |
| ten | text |  |  |  |  |
| icon | text | Y |  |  |  |
| nhom | text | Y |  |  |  |
| kieu | text | Y |  |  |  |
| nguon | text | Y |  |  |  |
| per_mon | boolean |  | true |  |  |
| trong_so | integer |  | 0 |  |  |
| thu_tu | integer |  | 0 |  |  |
| active | boolean |  | true |  |  |

## thanh_toan

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| hoa_don_id | uuid |  |  | FK→hoa_don.id |  |
| so_tien | numeric |  |  |  |  |
| ngay | date |  | CURRENT_DATE |  |  |
| phuong_thuc | text | Y |  |  |  |
| nguoi_thu | uuid | Y |  |  |  |
| ghi_chu | text | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |

## thoi_khoa_bieu

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| lop_id | uuid |  |  | FK→lop.id |  |
| thu | smallint |  |  |  |  |
| gio_bat_dau | time without time zone |  |  |  |  |
| gio_ket_thuc | time without time zone |  |  |  |  |
| phong | text | Y |  |  |  |
| hieu_luc_tu | date |  |  |  |  |
| hieu_luc_den | date | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |

## ung_vien

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| ma_uv | text | Y |  |  |  |
| ho_ten_hs | text |  |  |  |  |
| ho_ten_ph | text | Y |  |  |  |
| sdt_ph | text | Y |  |  |  |
| khoi | text | Y |  |  |  |
| mon | text |  | 'Toán'::text |  |  |
| nguon | text | Y |  |  |  |
| level | text |  | 'L5'::text |  | `L5` · `L6` · `L7` |
| trang_thai | text |  | 'dang_chay'::text |  | `dang_chay` · `loai` · `da_convert` |
| ly_do_loai | text | Y |  |  |  |
| diem_test | numeric | Y |  |  |  |
| lop_du_kien_id | uuid | Y |  | FK→lop.id |  |
| ngay_hoc_thu | date | Y |  |  |  |
| ghi_chu | text | Y |  |  |  |
| hoc_sinh_id | uuid | Y |  | FK→hoc_sinh.id |  |
| created_by | uuid | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| updated_at | timestamp with time zone |  | now() |  |  |
| ngay_sinh | date | Y |  |  |  |
| gioi_tinh | text | Y |  |  |  |
| dia_chi | text | Y |  |  |  |
| truong_hoc | text | Y |  |  |  |
| email_ph | text | Y |  |  |  |
| phu_huynh_id | uuid | Y |  | FK→phu_huynh.id |  |
| hoc_sinh_goc_id | uuid | Y |  | FK→hoc_sinh.id |  |
| can_bo_tro_duoi | boolean |  | false |  |  |

## ung_vien_log

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| ung_vien_id | uuid | Y |  |  |  |
| hanh_dong | text |  |  |  |  |
| truoc | jsonb | Y |  |  |  |
| sau | jsonb |  |  |  |  |
| actor | uuid | Y |  |  |  |
| ts | timestamp with time zone |  | now() |  |  |

## ung_vien_viec

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| ung_vien_id | uuid |  |  | FK→ung_vien.id |  |
| viec_key | text |  |  |  |  |
| xong_at | timestamp with time zone |  | now() |  |  |
| nguoi_xong | uuid | Y |  |  |  |

## vai_tro

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| ten | text |  |  |  |  |
| mo_ta | text | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |

## vai_tro_chuc_nang

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| vai_tro_id | uuid |  |  | PK FK→vai_tro.id |  |
| chuc_nang | text |  |  | PK |  |
| chi_xem | boolean |  | false |  |  |

## vh_ops_task

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| tkb_id | uuid |  |  | FK→thoi_khoa_bieu.id |  |
| ngay | date |  |  |  |  |
| tab | text |  |  |  | `report` · `tan` |
| nhan_su_id | uuid |  |  | FK→nhan_su.id |  |
| anh_url | text | Y |  |  |  |
| dong_at | timestamp with time zone | Y |  |  |  |
| chat_luong | numeric |  | 100 |  |  |
| nguoi_duyet | uuid | Y |  | FK→nhan_su.id |  |
| duyet_at | timestamp with time zone | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |

## vi_tri

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| team_id | uuid |  |  | FK→team.id |  |
| ten | text | Y |  |  |  |
| cap | text |  | 'thanh_vien'::text |  | `truong` · `pho` · `thanh_vien` |
| cha_id | uuid | Y |  | FK→vi_tri.id |  |
| nhan_su_id | uuid | Y |  | FK→nhan_su.id |  |
| created_at | timestamp with time zone |  | now() |  |  |
| vai_tro_id | uuid | Y |  | FK→vai_tro.id |  |
| mon | text | Y |  |  |  |

## viec

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| loai_viec_id | uuid | Y |  | FK→loai_viec.id |  |
| y_tuong_id | uuid | Y |  | FK→y_tuong.id |  |
| tieu_de | text |  |  |  |  |
| muc_tieu | text | Y |  |  |  |
| output | text | Y |  |  |  |
| mo_ta | text | Y |  |  |  |
| nguoi_lam_id | uuid | Y |  | FK→nhan_su.id |  |
| nguoi_giao_id | uuid |  |  | FK→nhan_su.id |  |
| khoi_luong | numeric |  |  |  |  |
| nguon | text |  | 'ke_hoach'::text |  | `ke_hoach` · `phat_sinh` |
| trang_thai | text |  | 'moi_giao'::text |  | `moi_giao` · `dang_lam` · `cho_nghiem_thu` · `dat` · `tra_lai` · `hold` · `huy` · `chuyen` |
| deadline | date | Y |  |  |  |
| deadline_goc | date | Y |  |  |  |
| so_lan_gia_han | integer |  | 0 |  |  |
| gia_han_xin_deadline | date | Y |  |  |  |
| gia_han_xin_ly_do | text | Y |  |  |  |
| ngay_nop | date | Y |  |  |  |
| ky_tuan | date | Y |  |  |  |
| tien_do | numeric | Y |  |  |  |
| chat_luong | numeric | Y |  |  |  |
| phan_tram | numeric | Y |  |  |  |
| so_lan_tra_lai | integer |  | 0 |  |  |
| evidence | text | Y |  |  |  |
| phan_tram_ghi_nhan | numeric | Y |  |  |  |
| ly_do_huy | text | Y |  |  |  |
| ngay_hold | timestamp with time zone | Y |  |  |  |
| viec_ke_thua_id | uuid | Y |  | FK→viec.id |  |
| ghi_chu_nghiem_thu | text | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |
| hoan_thanh_at | timestamp with time zone | Y |  |  |  |
| nghiem_thu_at | timestamp with time zone | Y |  |  |  |
| task_me_id | uuid | Y |  | FK→viec.id |  |

## viec_log

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| viec_id | uuid |  |  | FK→viec.id |  |
| hanh_dong | text |  |  |  |  |
| truoc | jsonb | Y |  |  |  |
| sau | jsonb |  |  |  |  |
| actor | uuid | Y |  |  |  |
| ts | timestamp with time zone |  | now() |  |  |

## viec_van_hanh_duyet

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| buoi_hoc_id | uuid |  |  | FK→buoi_hoc.id |  |
| tab | text |  |  |  | `danhgia` · `ingame` · `et` · `btvn` · `mt` |
| nhan_su_id | uuid |  |  | FK→nhan_su.id |  |
| chat_luong | numeric |  | 100 |  |  |
| nguoi_duyet | uuid |  |  | FK→nhan_su.id |  |
| ghi_chu | text | Y |  |  |  |
| duyet_at | timestamp with time zone |  | now() |  |  |
| tien_do | numeric |  | 100 |  |  |
| tien_do_de_xuat | numeric |  | 100 |  |  |
| tien_do_ly_do | text | Y |  |  |  |
| hieu_suat | numeric | Y |  |  |  |

## y_tuong

| cột | kiểu | null | default | khóa | giá trị hợp lệ |
|---|---|---|---|---|---|
| id | uuid |  | gen_random_uuid() | PK |  |
| tieu_de | text |  |  |  |  |
| mo_ta | text | Y |  |  |  |
| tac_gia_id | uuid |  |  | FK→nhan_su.id |  |
| trang_thai | text |  | 'moi'::text |  | `moi` · `backlog` · `holding` · `da_trien_khai` · `ngu_dong` · `tu_choi` |
| ly_do_tu_choi | text | Y |  |  |  |
| gia_tri | integer | Y |  |  |  |
| co | integer | Y |  |  |  |
| ngay_vao_backlog | date | Y |  |  |  |
| created_at | timestamp with time zone |  | now() |  |  |

## Triggers

| bảng | trigger | timing | event | function |
|---|---|---|---|---|
| bao_loi | trg_log_bao_loi | BEFORE | UPDATE | log_bao_loi |
| ca_test | trg_log_ca_test | AFTER | INSERT/UPDATE | log_ca_test |
| dai_cau_hoi | trg_log_kho_cau_dai | AFTER | DELETE/UPDATE | log_kho_cau |
| hgt_cau_hoi | trg_log_kho_cau_hgt | AFTER | DELETE/UPDATE | log_kho_cau |
| hoa_don | trg_log_hoa_don | AFTER | INSERT/UPDATE | log_hoa_don |
| hoc_sinh | trg_hs_nghi_tu_roi_lop | AFTER | UPDATE | hs_nghi_tu_roi_lop |
| hoc_sinh | trg_log_he_so_hoc_phi | AFTER | UPDATE | log_he_so_hoc_phi |
| hoc_sinh_lop | trg_log_hoc_sinh_lop | AFTER | INSERT/UPDATE | log_hoc_sinh_lop |
| khtn_cau_hoi | trg_log_kho_cau_khtn | AFTER | DELETE/UPDATE | log_kho_cau |
| ung_vien | trg_log_ung_vien | AFTER | INSERT/UPDATE | log_ung_vien |
| viec | trg_log_viec | AFTER | INSERT/UPDATE | log_viec |

## Functions

- `count_cau_by_dang(p_tbl text)` → jsonb
- `et_de(p_bai_test uuid)` → jsonb
- `et_nop(p_bai_lam uuid)` → jsonb
- `giaoviec_housekeeping()` → void
- `hinh_bao_dong_tien_de(goc uuid)` → TABLE(id uuid, do_sau integer)
- `hinh_mo_hinh_hau_due(goc uuid)` → TABLE(id uuid, do_sau integer)
- `hinh_mo_hinh_to_tien(nut uuid)` → TABLE(id uuid, do_sau integer)
- `hs_nghi_tu_roi_lop()` → trigger
- `hs_o_lop(p_lop uuid)` → boolean
- `increment_qaa_hit(p_id uuid)` → void
- `jwt_email()` → text
- `jwt_uid()` → uuid
- `la_thanh_vien()` → boolean
- `log_bao_loi()` → trigger
- `log_ca_test()` → trigger
- `log_he_so_hoc_phi()` → trigger
- `log_hoa_don()` → trigger
- `log_hoc_sinh_lop()` → trigger
- `log_kho_cau()` → trigger
- `log_ung_vien()` → trigger
- `log_viec()` → trigger
- `my_hoc_sinh_id()` → uuid
- `my_quyen()` → TABLE(la_admin boolean, chuc_nang text[], chi_xem text[])
- `postgres_fdw_disconnect(text)` → boolean
- `postgres_fdw_disconnect_all()` → boolean
- `postgres_fdw_get_connections(OUT server_name text, OUT valid boolean)` → SETOF record
- `postgres_fdw_handler()` → fdw_handler
- `postgres_fdw_validator(text[], oid)` → void
- `self_link_account()` → uuid
- `tln_cache_check(p_ma_cau text, p_norm text)` → boolean
- `tln_norm(t text)` → text

## Checks khác (không phải dạng enum)

| bảng | constraint | định nghĩa |
|---|---|---|
| bao_cao_ph | bao_cao_ph_cs_ky_nang_chk | `CHECK (((cs_ky_nang IS NULL) OR ((cs_ky_nang >= 1) AND (cs_ky_nang <= 5))))` |
| bao_cao_ph | bao_cao_ph_cs_tap_trung_chk | `CHECK (((cs_tap_trung IS NULL) OR ((cs_tap_trung >= 1) AND (cs_tap_trung <= 5))))` |
| bao_cao_ph | bao_cao_ph_cs_thai_do_chk | `CHECK (((cs_thai_do IS NULL) OR ((cs_thai_do >= 1) AND (cs_thai_do <= 5))))` |
| bao_cao_ph | bao_cao_ph_cs_tiep_thu_chk | `CHECK (((cs_tiep_thu IS NULL) OR ((cs_tiep_thu >= 1) AND (cs_tiep_thu <= 5))))` |
| bao_cao_ph | bao_cao_ph_cs_tu_duy_chk | `CHECK (((cs_tu_duy IS NULL) OR ((cs_tu_duy >= 1) AND (cs_tu_duy <= 5))))` |
| bao_cao_ph | bao_cao_ph_cs_van_dung_chk | `CHECK (((cs_van_dung IS NULL) OR ((cs_van_dung >= 1) AND (cs_van_dung <= 5))))` |
| bao_cao_ph | bao_cao_ph_cs_vuot_kho_chk | `CHECK (((cs_vuot_kho IS NULL) OR ((cs_vuot_kho >= 1) AND (cs_vuot_kho <= 5))))` |
| bao_cao_ph | bao_cao_ph_nl_diem_chk | `CHECK (((nl_diem IS NULL) OR ((nl_diem >= (0)::numeric) AND (nl_diem <= (10)::numeric))))` |
| bao_cao_ph | bao_cao_ph_nl_sai_so_chk | `CHECK (((nl_sai_so IS NULL) OR ((nl_sai_so >= (0)::numeric) AND (nl_sai_so <= (5)::numeric))))` |
| bo_tro_yeu | bo_tro_yeu_dong_du_ck | `CHECK (((trang_thai <> 'hoan_thanh'::text) OR ((ket_qua IS NOT NULL) AND (hoan_thanh_at IS NOT NULL))))` |
| bo_tro_yeu | bo_tro_yeu_muc_ck | `CHECK (((muc IS NULL) OR (muc = ANY (ARRAY[1, 2, 3]))))` |
| bo_tro_yeu | bo_tro_yeu_muc_may_ck | `CHECK (((muc_may_de_xuat IS NULL) OR (muc_may_de_xuat = ANY (ARRAY[1, 2, 3]))))` |
| buoi_danh_gia | buoi_danh_gia_hoan_thanh_pct_check | `CHECK (((hoan_thanh_pct IS NULL) OR (((hoan_thanh_pct >= 0) AND (hoan_thanh_pct <= 100)) AND (((hoan_thanh_pct)::integer % 5) = 0))))` |
| buoi_danh_gia | buoi_danh_gia_muc_chk | `CHECK (((muc IS NULL) OR ((muc >= 1) AND (muc <= 5))))` |
| buoi_danh_gia_dang | buoi_danh_gia_dang_diem_check | `CHECK ((diem = ANY (ARRAY[(0)::numeric, 0.5, (1)::numeric])))` |
| ca_test | ca_test_thoi_luong_phut_check | `CHECK ((thoi_luong_phut = ANY (ARRAY[45, 60, 75, 90, 120])))` |
| dai_ban_do | dai_ban_do_muc_do_check | `CHECK (((muc_do >= 1) AND (muc_do <= 5)))` |
| hinh_mo_hinh | hinh_mo_hinh_cap_mo_hinh_check | `CHECK (((cap_mo_hinh >= 1) AND (cap_mo_hinh <= 4)))` |
| hinh_mo_hinh_cha | hinh_mo_hinh_cha_check | `CHECK ((mo_hinh_id <> cha_id))` |
| hoc_phi_phat_sinh | hoc_phi_phat_sinh_dung_loai | `CHECK ((((loai = 'lop'::text) AND (lop_id IS NOT NULL) AND (hoc_sinh_id IS NULL)) OR ((loai = 'ca_nhan'::text) AND (hoc_sinh_id IS NOT NULL) AND (lop_id IS NULL))))` |
| hs_level | hs_level_level_check | `CHECK (((level >= 0) AND (level <= 3)))` |
| hs_level_log | hs_level_log_level_chot_check | `CHECK (((level_chot >= 0) AND (level_chot <= 3)))` |
| hs_level_log | hs_level_log_level_cu_check | `CHECK (((level_cu >= 0) AND (level_cu <= 3)))` |
| hs_level_log | hs_level_log_level_may_de_xuat_check | `CHECK (((level_may_de_xuat >= 0) AND (level_may_de_xuat <= 3)))` |
| ky_thi | ky_thi_he_so_check | `CHECK ((he_so = ANY (ARRAY[1, 2])))` |
| muc_nang_luc | muc_nang_luc_muc_check | `CHECK (((muc >= 1) AND (muc <= 3)))` |
| phan_cong_ca | phan_cong_ca_thu_check | `CHECK (((thu >= 2) AND (thu <= 8)))` |
| thoi_khoa_bieu | thoi_khoa_bieu_thu_check | `CHECK (((thu >= 2) AND (thu <= 8)))` |
| y_tuong | y_tuong_co_check | `CHECK ((co = ANY (ARRAY[1, 2, 3, 5, 8])))` |
| y_tuong | y_tuong_gia_tri_check | `CHECK ((gia_tri = ANY (ARRAY[1, 2, 3, 5, 8])))` |

