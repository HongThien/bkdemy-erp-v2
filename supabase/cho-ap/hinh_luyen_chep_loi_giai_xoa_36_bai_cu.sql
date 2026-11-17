-- ⏸ CHƯA ÁP — chờ Thùy duyệt reports/hinh-luyen-chep-loi-giai-17-11.html (nằm ngoài migrations/ có chủ ý).
-- Hình–Luyện: chép 12 lời giải từ bài cũ sang bài mới tương đương, chuyển 1 slot BTVN, rồi XOÁ 36 bài cũ loại (1) "đã dựng lại"
-- (Thùy 17/11: "Sửa 131.17 + xử 36 bài" · "Chép sang rồi xoá"). Đối chiếu: reports/hinh-luyen-cu-doi-chieu-17-11.{json,html}.
-- Bản chép trước khi xoá (36 bài · 36 cách giải · 30 dòng tiền đề · 16 yêu cầu giải · 1 slot): _luu-tru/du-lieu/hinh-luyen-bai-cu-loai1-17-11.json
-- Mất theo cascade: 36 cách giải của bài cũ · 16 yêu cầu giải · dòng tiền đề trỏ vào / từ 36 bài (8 dòng là tiền đề của bài cũ KHÁC, đang ẩn).
-- Không có tham chiếu text (hmh_cau_hoi là VIEW). BT.07.131.14 không chép (lời giải cũ sai đề). BT.07.126.13 có đoạn kết viết lại — Thùy duyệt.
-- CÁCH ÁP: npm run new-migration hinh_luyen_chep_loi_giai_xoa_36_bai_cu → chép file này vào → node scripts/migrate.mjs --only <file>
do $$
declare v_n int;
begin
  -- BT.07.126.05 ← BT.07.061.13
  update hinh_cach_giai set loi_giai = $lg$Xét $\triangle BAD$ và $\triangle BED$ có:
$BA = BE$ (gt)
$\widehat{ABD} = \widehat{EBD}$ ($BD$ là tia phân giác của $\widehat{ABC}$)
$BD$ là cạnh chung
Vậy $\triangle BAD = \triangle BED$ (c.g.c).$lg$, updated_at = now()
   where id = 'e2b6ff8c-4d01-4d08-a396-38d36fd0b064' and coalesce(btrim(loi_giai),'') = '' and anh_loi_giai is null;
  get diagnostics v_n = row_count; if v_n <> 1 then raise exception 'BT.07.126.05: cách giải đích không còn rỗng'; end if;
  -- BT.07.126.06 ← BT.07.061.12
  update hinh_cach_giai set loi_giai = $lg$Ta có $BA = BE$ (gt)
$\Rightarrow B$ thuộc đường trung trực của $AE$ (1).
$\triangle BAD = \triangle BED$ (cmt)
$\Rightarrow DA = DE$ (hai cạnh tương ứng)
$\Rightarrow D$ thuộc đường trung trực của $AE$ (2).
Từ (1) và (2) $\Rightarrow BD$ là đường trung trực của $AE$.$lg$, updated_at = now()
   where id = '4a62155b-5319-402a-b2fc-7c851c4a491c' and coalesce(btrim(loi_giai),'') = '' and anh_loi_giai is null;
  get diagnostics v_n = row_count; if v_n <> 1 then raise exception 'BT.07.126.06: cách giải đích không còn rỗng'; end if;
  -- BT.07.126.07 ← BT.07.061.14
  update hinh_cach_giai set loi_giai = $lg$Ta có $\triangle BAD = \triangle BED$ (cmt)
$\Rightarrow DE = DA$ (hai cạnh tương ứng)
$\Rightarrow \widehat{BED} = \widehat{BAD}$ (hai góc tương ứng).
Mà $\widehat{BAD} = 90^\circ$ (do $\triangle ABC$ vuông tại $A$)
nên $\widehat{BED} = 90^\circ$.
Vậy $DE \perp BC$.$lg$, updated_at = now()
   where id = '33364acc-20fa-4011-b5d9-79b4c94fd99a' and coalesce(btrim(loi_giai),'') = '' and anh_loi_giai is null;
  get diagnostics v_n = row_count; if v_n <> 1 then raise exception 'BT.07.126.07: cách giải đích không còn rỗng'; end if;
  -- BT.07.126.12 ← BT.07.061.16
  update hinh_cach_giai set loi_giai = $lg$Ta có $\triangle BAD = \triangle BED$ (cmt)
$\Rightarrow AD = DE$ (hai cạnh tương ứng).
Vì $\widehat{BAC} = 90^\circ$, $D \in AC$ và $F$ thuộc tia đối của tia $AB$
nên $\widehat{DAF} = 180^\circ - \widehat{DAB} = 90^\circ$.
Vì $DE \perp BC$ tại $E$ (gt) và $E$ nằm giữa $B$, $C$
nên tia $EC$ là tia đối của tia $EB$,
do đó $\widehat{DEC} = 180^\circ - \widehat{DEB} = 90^\circ$.
Xét $\triangle ADF$ và $\triangle EDC$ có:
$AD = ED$ (cmt)
$\widehat{DAF} = \widehat{DEC} = 90^\circ$ (cmt)
$AF = EC$ (gt)
Do đó $\triangle ADF = \triangle EDC$ (c.g.c)
$\Rightarrow \widehat{ADF} = \widehat{EDC}$ (hai góc tương ứng).
Vì $A$, $D$, $C$ thẳng hàng ($D \in AC$)
nên $\widehat{ADE} + \widehat{EDC} = \widehat{ADC} = 180^\circ$.
Thay $\widehat{EDC} = \widehat{ADF}$ vào, ta được $\widehat{ADE} + \widehat{ADF} = 180^\circ$,
tức là $\widehat{FDE} = 180^\circ$.
Vậy ba điểm $F$, $D$, $E$ thẳng hàng.$lg$, updated_at = now()
   where id = '4c721e4f-7b03-466e-8099-6b2e18a90575' and coalesce(btrim(loi_giai),'') = '' and anh_loi_giai is null;
  get diagnostics v_n = row_count; if v_n <> 1 then raise exception 'BT.07.126.12: cách giải đích không còn rỗng'; end if;
  -- BT.07.126.14 ← BT.07.061.25
  update hinh_cach_giai set loi_giai = $lg$Xét hai tam giác vuông $BAD$ và $BED$ có:
$\widehat{BAD} = \widehat{BED} = 90^\circ$ ($\triangle ABC$ vuông tại $A$, $DE \perp BC$)
$BD$ là cạnh huyền chung
$\widehat{ABD} = \widehat{EBD}$ ($BD$ là tia phân giác của $\widehat{ABC}$)
Do đó $\triangle BAD = \triangle BED$ (ch - gn).$lg$, updated_at = now()
   where id = '69b7eca2-ad0c-4e01-9916-d05d6532e8fa' and coalesce(btrim(loi_giai),'') = '' and anh_loi_giai is null;
  get diagnostics v_n = row_count; if v_n <> 1 then raise exception 'BT.07.126.14: cách giải đích không còn rỗng'; end if;
  -- BT.07.126.13 ← BT.07.061.27 [khong_chac]
  update hinh_cach_giai set loi_giai = $lg$Ta có $DF = DC$ (gt) nên $\triangle DFC$ cân tại $D$.
Do đó đường trung tuyến $DM$ ($M$ là trung điểm $FC$)
đồng thời là tia phân giác của $\widehat{FDC}$.
$\triangle BAD = \triangle BED$ (cmt)
$\Rightarrow \widehat{ADB} = \widehat{EDB}$ (hai góc tương ứng).
$\widehat{ADF} = \widehat{EDC}$ (hai góc đối đỉnh).
Cộng hai đẳng thức góc này (tia $DA$ nằm giữa hai tia $DB, DF$
và tia $DE$ nằm giữa hai tia $DB, DC$):
$\widehat{BDF} = \widehat{ADB} + \widehat{ADF} = \widehat{EDB} + \widehat{EDC} = \widehat{BDC}$.
Gọi $Dx$ là tia đối của tia $DB$.
Ta có $\widehat{xDF} = 180^\circ - \widehat{BDF}$ và $\widehat{xDC} = 180^\circ - \widehat{BDC}$ (hai góc kề bù)
nên $\widehat{xDF} = \widehat{xDC}$.
Mà tia $Dx$ nằm giữa hai tia $DF$, $DC$
nên $Dx$ là tia phân giác của $\widehat{FDC}$.
Tia $Dx$ và tia $DM$ cùng là tia phân giác của $\widehat{FDC}$ nên hai tia này trùng nhau.
Vậy ba điểm $B$, $D$, $M$ thẳng hàng.$lg$, updated_at = now()
   where id = '3d30822e-cb3c-490b-96a8-4aab0a8f496a' and coalesce(btrim(loi_giai),'') = '' and anh_loi_giai is null;
  get diagnostics v_n = row_count; if v_n <> 1 then raise exception 'BT.07.126.13: cách giải đích không còn rỗng'; end if;
  -- BT.07.132.02 ← BT.07.062.09
  update hinh_cach_giai set loi_giai = $lg$Ta có $\triangle ABD = \triangle ACD$ (cmt)
Suy ra $\widehat{ADB} = \widehat{ADC}$ (hai góc tương ứng).
Mà $\widehat{ADB} + \widehat{ADC} = 180^\circ$ (hai góc kề bù)
nên $\widehat{ADB} = \widehat{ADC} = 90^\circ$.
Vậy $AD \perp BC$.$lg$, updated_at = now()
   where id = 'b1db617f-b82a-43a9-8435-70c57a9876e8' and coalesce(btrim(loi_giai),'') = '' and anh_loi_giai is null;
  get diagnostics v_n = row_count; if v_n <> 1 then raise exception 'BT.07.132.02: cách giải đích không còn rỗng'; end if;
  -- BT.07.131.01 ← BT.07.063.10
  update hinh_cach_giai set loi_giai = $lg$Vì $B, M, C$ thẳng hàng ($M$ là trung điểm $BC$)
và $A, M, D$ thẳng hàng ($D$ thuộc tia đối của tia $MA$)
nên $\widehat{AMB} = \widehat{DMC}$ (hai góc đối đỉnh).
Xét $\triangle ABM$ và $\triangle DCM$ có:
$MB = MC$ ($M$ là trung điểm $BC$)
$\widehat{AMB} = \widehat{DMC}$ (cmt)
$MA = MD$ (gt)
Do đó $\triangle ABM = \triangle DCM$ (c.g.c).$lg$, updated_at = now()
   where id = '23306f4c-88f3-43e9-890d-e751f62b647e' and coalesce(btrim(loi_giai),'') = '' and anh_loi_giai is null;
  get diagnostics v_n = row_count; if v_n <> 1 then raise exception 'BT.07.131.01: cách giải đích không còn rỗng'; end if;
  -- BT.07.131.02 ← BT.07.063.15
  update hinh_cach_giai set loi_giai = $lg$Vì $M$ là trung điểm của $BC$ nên $MB = MC$.
Vì $D$ thuộc tia đối của tia $MA$ nên $A, M, D$ thẳng hàng.
Vì $A, M, D$ thẳng hàng và $B, M, C$ thẳng hàng
nên $\widehat{AMC} = \widehat{DMB}$ (hai góc đối đỉnh).
Xét $\triangle ACM$ và $\triangle DBM$ có:
$MA = MD$ (gt)
$\widehat{AMC} = \widehat{DMB}$ (cmt)
$MC = MB$ (cmt)
Vậy $\triangle ACM = \triangle DBM$ (c.g.c).$lg$, updated_at = now()
   where id = 'ad211bd5-f789-4465-a251-be92d9b84025' and coalesce(btrim(loi_giai),'') = '' and anh_loi_giai is null;
  get diagnostics v_n = row_count; if v_n <> 1 then raise exception 'BT.07.131.02: cách giải đích không còn rỗng'; end if;
  -- BT.07.131.13 ← BT.07.063.16
  update hinh_cach_giai set loi_giai = $lg$Ta có $\triangle ACM = \triangle DBM$ (cmt)
suy ra $\widehat{MCA} = \widehat{MBD}$ (hai góc tương ứng).
Vì $M$ nằm giữa $B$ và $C$ nên $\widehat{MCA} = \widehat{BCA}$ và $\widehat{MBD} = \widehat{CBD}$;
do đó $\widehat{BCA} = \widehat{CBD}$.
Vì $M$ nằm giữa $A$ và $D$ nên $A, D$ nằm ở hai phía của đường thẳng $BC$;
suy ra $\widehat{BCA}$ và $\widehat{CBD}$ là hai góc so le trong
tạo bởi đường thẳng $BC$ cắt hai đường thẳng $CA, BD$.
Vậy $AC \parallel BD$ (hai góc so le trong bằng nhau).$lg$, updated_at = now()
   where id = '03f966a4-1838-4cf8-bd2c-f09e646eb27f' and coalesce(btrim(loi_giai),'') = '' and anh_loi_giai is null;
  get diagnostics v_n = row_count; if v_n <> 1 then raise exception 'BT.07.131.13: cách giải đích không còn rỗng'; end if;
  -- BT.07.131.20 ← BT.07.063.17
  update hinh_cach_giai set loi_giai = $lg$Xét $\triangle AGM$ và $\triangle DJM$ vuông tại $G$, $J$ có:
$\widehat{AGM} = \widehat{DJM} = 90^\circ$
$AM = DM$ (gt)
$\widehat{AMG} = \widehat{DMJ}$ (hai góc đối đỉnh)
(vì $A, M, D$ thẳng hàng và $G, M, J$ thuộc đường thẳng $BC$)
Vậy $\triangle AGM = \triangle DJM$ (ch - gn)
suy ra $AG = DJ$ (hai cạnh tương ứng).$lg$, updated_at = now()
   where id = 'd840259d-e357-4d2d-8b7f-83e28b7635cf' and coalesce(btrim(loi_giai),'') = '' and anh_loi_giai is null;
  get diagnostics v_n = row_count; if v_n <> 1 then raise exception 'BT.07.131.20: cách giải đích không còn rỗng'; end if;
  -- BT.07.131.21 ← BT.07.063.03
  update hinh_cach_giai set loi_giai = $lg$Ta có $AB \parallel CD$ (cmt).
Đường thẳng qua $M$ vuông góc với $AB$ tại $S$, tức là $MS \perp AB$.
Vì $AB \parallel CD$ nên đường thẳng $MS$ cũng vuông góc với $CD$.
Qua điểm $M$ chỉ có duy nhất một đường thẳng vuông góc với $CD$;
theo giả thiết đó là đường thẳng $MT$ ($MT \perp CD$ tại $T$).
Vì $MS$ và $MT$ đều là đường thẳng qua $M$ vuông góc với $CD$
nên $MS$ và $MT$ là cùng một đường thẳng.
$\Rightarrow S$ và $T$ cùng thuộc đường thẳng đó
$\Rightarrow$ ba điểm $S, M, T$ thẳng hàng.$lg$, updated_at = now()
   where id = 'd5dc3cce-7649-485f-ad32-ac00d0a8ffd0' and coalesce(btrim(loi_giai),'') = '' and anh_loi_giai is null;
  get diagnostics v_n = row_count; if v_n <> 1 then raise exception 'BT.07.131.21: cách giải đích không còn rỗng'; end if;
  -- slot BTVN 20/10 (problem_no 1) trỏ bài cũ BT.08.058.01 → bài mới BT.08.073.01
  update gami_session_problems set hinh_baitoan_id = '38e77036-fe18-4770-bf78-a4b2e14d3127' where id = '4d18a045-aeac-4913-a052-a5e16ad821a7' and hinh_baitoan_id = '8a10dce1-73b9-4bf1-98b5-4b360a2d5096';
  get diagnostics v_n = row_count; if v_n <> 1 then raise exception 'slot BTVN: sửa % dòng', v_n; end if;
  if exists (select 1 from gami_session_problems where hinh_baitoan_id = any(array['9532c3e4-6bbc-4bfc-8531-3b5d0314d759','2da645c8-aa7b-4a20-aaaa-6b4e3b4b6634','77f51fe3-09cc-4aab-90a0-9b46533d1704','5b6fe107-ecf0-457f-bf43-8b26ee9edf81','ada96f89-d976-4327-82ea-8fc2b949fea0','114f198d-31a3-4369-a833-552d90abe24d','8325e30a-24e9-4e7d-baa1-8b0fe95cc133','6daf7ff1-073d-42b1-9ba3-298db66ea85e','64574f7d-8645-4851-8f51-83b3ac8f3a1f','ad206bed-8540-468d-b208-12ddb5b241d1','9ff26483-5765-4328-81c9-2abaa18a766c','e6848b22-f0ab-4f43-98be-1c219691c3f4','8ed3ac0d-fcb1-4ab9-a084-e1c0de8ca7bf','44e9371c-8e96-4f3b-a5aa-d4b2ffe4fcc2','e84c4d0f-da30-4a25-8c5f-f64e49c09be9','1733a16b-0747-402e-85e1-fc28b959abe2','1d0105fc-7cb8-4420-8db8-aaa4b82e7935','9ae1c80d-a6c2-4948-81c6-dd22e7e330f7','3fd8fe7e-6d0f-4dd3-88cc-e553d9e24abc','57ebbf4f-dbf5-4a19-aea4-6f49745cce41','9e6ad72b-fb53-4173-9942-28ba9141a74e','ba29650e-3c13-49e3-915d-3a235f6be4b7','e856edef-9a7f-4531-b9c7-bdedea8fd362','a48fa7f2-c331-4e18-a639-3f777c45f511','5510f305-845e-4e7f-bbdc-38cbe92300cb','9cc5c22e-2d91-4c00-b54d-8df8fce7478e','75b03cfe-c49a-4d11-b415-1adad88f8298','7df4c2eb-0312-4686-88c0-80246c459c55','5d536823-de70-4648-9c04-e7e01cf9dc82','efe2ecc0-2d5d-4270-8a57-29189498a17d','7e47926c-b925-4409-96a5-3b423f8c8b17','d87aa36e-e3eb-4a36-a544-3108d4a0323e','6dc727d9-c6e6-46e1-bbde-391f702e940f','1926f2e9-6ff4-47ca-88bf-064764c0199b','8a10dce1-73b9-4bf1-98b5-4b360a2d5096','6b37c88a-216c-4179-b7ec-f6fffd8e0cc4']::uuid[])) then
    raise exception 'còn lượt làm trỏ vào bài cũ sắp xoá — dừng'; end if;
  delete from hinh_baitoan where id = any(array['9532c3e4-6bbc-4bfc-8531-3b5d0314d759','2da645c8-aa7b-4a20-aaaa-6b4e3b4b6634','77f51fe3-09cc-4aab-90a0-9b46533d1704','5b6fe107-ecf0-457f-bf43-8b26ee9edf81','ada96f89-d976-4327-82ea-8fc2b949fea0','114f198d-31a3-4369-a833-552d90abe24d','8325e30a-24e9-4e7d-baa1-8b0fe95cc133','6daf7ff1-073d-42b1-9ba3-298db66ea85e','64574f7d-8645-4851-8f51-83b3ac8f3a1f','ad206bed-8540-468d-b208-12ddb5b241d1','9ff26483-5765-4328-81c9-2abaa18a766c','e6848b22-f0ab-4f43-98be-1c219691c3f4','8ed3ac0d-fcb1-4ab9-a084-e1c0de8ca7bf','44e9371c-8e96-4f3b-a5aa-d4b2ffe4fcc2','e84c4d0f-da30-4a25-8c5f-f64e49c09be9','1733a16b-0747-402e-85e1-fc28b959abe2','1d0105fc-7cb8-4420-8db8-aaa4b82e7935','9ae1c80d-a6c2-4948-81c6-dd22e7e330f7','3fd8fe7e-6d0f-4dd3-88cc-e553d9e24abc','57ebbf4f-dbf5-4a19-aea4-6f49745cce41','9e6ad72b-fb53-4173-9942-28ba9141a74e','ba29650e-3c13-49e3-915d-3a235f6be4b7','e856edef-9a7f-4531-b9c7-bdedea8fd362','a48fa7f2-c331-4e18-a639-3f777c45f511','5510f305-845e-4e7f-bbdc-38cbe92300cb','9cc5c22e-2d91-4c00-b54d-8df8fce7478e','75b03cfe-c49a-4d11-b415-1adad88f8298','7df4c2eb-0312-4686-88c0-80246c459c55','5d536823-de70-4648-9c04-e7e01cf9dc82','efe2ecc0-2d5d-4270-8a57-29189498a17d','7e47926c-b925-4409-96a5-3b423f8c8b17','d87aa36e-e3eb-4a36-a544-3108d4a0323e','6dc727d9-c6e6-46e1-bbde-391f702e940f','1926f2e9-6ff4-47ca-88bf-064764c0199b','8a10dce1-73b9-4bf1-98b5-4b360a2d5096','6b37c88a-216c-4179-b7ec-f6fffd8e0cc4']::uuid[])
     and mo_hinh_id in (select id from hinh_mo_hinh where phan is null);   -- chỉ bài thuộc mô hình CŨ
  get diagnostics v_n = row_count; if v_n <> 36 then raise exception 'xoá % bài, cần đúng 36', v_n; end if;
end $$;
