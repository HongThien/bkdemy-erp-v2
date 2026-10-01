-- ============================================================================
-- 202609172220 — CHUYỂN dữ liệu HÌNH khối 8 từ mô hình LUYỆN sang mô hình HỌC (CEO 17/09)
-- ----------------------------------------------------------------------------
-- QUY TẮC (spec-kho-hinh-v3 §5 + user 17/09):
--  · 1 mô hình khối 8 (`hinh_mo_hinh` khoi='8') → 1 Bài học (`hinh_hoc_bai`).
--  · Lý thuyết Bài = gia_thiet + link ảnh cấu hình (nếu có).
--  · Bài toán LẺ (không tham gia chuỗi tiền đề) → 1 câu độc lập.
--  · Bài toán ĐÍCH (nhận tiền đề, không làm tiền đề cho ai) → 1 câu GHÉP:
--      ghép phát biểu của bao đóng tiền đề + đích, sort theo cấp, thành "a) b) c) …".
--      Cross-model: đặt vào Bài của mô hình chứa đích cấp cao nhất.
--  · Bài toán TIỀN ĐỀ THUẦN / GIỮA CHUỖI: không có câu độc lập, chỉ embed vào câu ghép.
--  · Biến thể (`hinh_baitoan_bien_the`) → câu CLONE (parent_ma_cau=câu gốc, clone_method='v3_bien_the').
--      Biến thể của bài tiền đề thuần → câu độc lập (không parent).
--  · da_duyet=false toàn bộ — GV duyệt lại từng câu.
--  · mo_hinh_id giữ nguyên (nhãn mastery signal, spec-kho-hinh-v3 §7 hook đã có).
--
-- SỐ LIỆU (sinh lúc gen):
--   Bài học sẽ tạo:   26
--   Câu lẻ:           46
--   Câu ghép:         27
--   Biến thể clone:   34
--   Biến thể độc lập: 5
--   Bài toán không dùng (tiền đề thuần + giữa chuỗi, không có câu riêng): 33
--   Nguồn: 106 `hinh_baitoan` + 39 biến thể của khối 8.
--
-- KHÔNG XÓA gì bên hinh_mo_hinh/hinh_baitoan/…. Chỉ THÊM vào hinh_hoc_bai/…
-- Idempotency: chèn xong sẽ có 9 dòng `hinh_hoc_bai` khoi='8'. Nếu chạy lại,
--   PRE-CHECK ở đầu block sẽ RAISE để không double-insert.
-- ============================================================================

begin;

-- ── PRE-CHECK: 9 tên Bài mới (đúng tên mô hình v3) đã có trong DB chưa? ────
-- (CEO 16/09 đã có sẵn "Tổng ba góc của một tam giác" cho khối 8 — KHÔNG đụng.
--  Migration này APPEND 9 Bài từ mô hình v3 vào bên cạnh, thu_tu tiếp theo tự động.)
do $$
declare n int;
begin
  select count(*) into n from hinh_hoc_bai where khoi='8' and ten_bai in ('Tứ giác ','Hình thang','Hình thang cân','Hình bình hành','Hình chữ nhật','Hình thoi','Hình vuông','Tam giác vuông - trung điểm','Hình học Test','Tứ giác có 2 cạnh bên cắt nhau','Tứ giác có tổng hai góc đối bằng 180','Tứ giác có hai tia phân giác cắt nhau','Tứ giác có tính chất của hình thang','Phân giác góc đáy hình thang','Hình thang cân trong tam giác cân','Tam giác cân tạo ra hình thang cân','Trung điểm cạnh đấy của hình thang cân','Trung điểm cạnh của hình bình hành','Phân giác của hình bình hành','Đường thẳng qua tâm','Vuông góc với đường chéo','Mô hình trực tâm','Mô hình Đường trung bình của tam giác','Tam giác vuông - Trung điểm cạnh huyền','Tam giác vuông - Chân đường cao','Tam giác vuông - Điểm bất kì thuộc cạnh huyền');
  if n > 0 then raise exception 'Đã có % Bài trong 9 tên mô hình v3 (khối 8) — migration này đã chạy. Bỏ qua để tránh double-insert.', n; end if;
end $$;

-- ── STAGE 1 · Tạo bảng tạm chứa mapping mô hình → thu_tu Bài ────────────────
create temp table _hh_bai_map (mo_hinh_id uuid, ten_bai text, thu_tu smallint) on commit drop;
create temp table _hh_bai_ma (thu_tu smallint, ma_bai text) on commit drop;
create temp table _hh_cau_map (temp_key text primary key, ma_cau text) on commit drop;

-- ── STAGE 2 · INSERT hinh_hoc_bai (9 Bài) + build map thu_tu → ma_bai ──────
insert into _hh_bai_map values ('f048bbd0-ed90-4bbb-b11d-067b7266d89f', 'Tứ giác ', 1);
insert into _hh_bai_map values ('e5d87e5d-2d5f-4f3b-b1d8-be8c49901849', 'Hình thang', 2);
insert into _hh_bai_map values ('d27e8f09-58b2-41e3-98cf-e3995c10e45d', 'Hình thang cân', 3);
insert into _hh_bai_map values ('635fb2eb-1c6d-4ce0-ae41-d64c515132da', 'Hình bình hành', 4);
insert into _hh_bai_map values ('1bb534c1-bb08-4791-a8aa-12b3889d09cd', 'Hình chữ nhật', 5);
insert into _hh_bai_map values ('4fc4d5a9-3c33-42cc-9cc4-3bd92cc6a603', 'Hình thoi', 6);
insert into _hh_bai_map values ('2000730f-ee9a-4414-85aa-4ef34cabaf7f', 'Hình vuông', 7);
insert into _hh_bai_map values ('9e08c8d0-3a67-42d9-8589-c2ae54dc605b', 'Tam giác vuông - trung điểm', 8);
insert into _hh_bai_map values ('2929a790-b2db-4f1d-807d-2a461051d904', 'Hình học Test', 9);
insert into _hh_bai_map values ('37a807ec-e9fd-4353-b80a-9cef46e27640', 'Tứ giác có 2 cạnh bên cắt nhau', 10);
insert into _hh_bai_map values ('47e2c5f9-aaf9-4b11-bc80-a892bf8e7b66', 'Tứ giác có tổng hai góc đối bằng 180', 11);
insert into _hh_bai_map values ('9d9c236f-ea5c-450d-80cd-f1125a271b10', 'Tứ giác có hai tia phân giác cắt nhau', 12);
insert into _hh_bai_map values ('d8b8a6b8-3ec3-4e64-9455-7aa106e19850', 'Tứ giác có tính chất của hình thang', 13);
insert into _hh_bai_map values ('bf40bbcb-5a47-4dbc-ae18-da01577bf3d3', 'Phân giác góc đáy hình thang', 14);
insert into _hh_bai_map values ('26c1a143-1f1f-410d-b917-fc66d7dbcf95', 'Hình thang cân trong tam giác cân', 15);
insert into _hh_bai_map values ('feaa0121-261b-4510-8a1e-435e29d1c390', 'Tam giác cân tạo ra hình thang cân', 16);
insert into _hh_bai_map values ('eb398e67-5bcc-48a5-b567-7dba11c8941b', 'Trung điểm cạnh đấy của hình thang cân', 17);
insert into _hh_bai_map values ('abcbf25b-1631-499a-9acb-72715237bb56', 'Trung điểm cạnh của hình bình hành', 18);
insert into _hh_bai_map values ('1b68aa6b-9316-4f48-aa29-70ea70e0b822', 'Phân giác của hình bình hành', 19);
insert into _hh_bai_map values ('8f8a85c2-9941-478c-9932-9014cc3f923b', 'Đường thẳng qua tâm', 20);
insert into _hh_bai_map values ('2fe2a80c-c887-44c6-b0f3-52e78b7faf02', 'Vuông góc với đường chéo', 21);
insert into _hh_bai_map values ('b00e5d6f-0ed8-49df-a01d-c3067674519d', 'Mô hình trực tâm', 22);
insert into _hh_bai_map values ('7d83b292-a909-44d0-8140-116b934ccd50', 'Mô hình Đường trung bình của tam giác', 23);
insert into _hh_bai_map values ('1cbc59e4-bf8f-4932-8c6d-fb2d2144053a', 'Tam giác vuông - Trung điểm cạnh huyền', 24);
insert into _hh_bai_map values ('4b643fc5-47c9-4d9a-9b79-8d389040a9d3', 'Tam giác vuông - Chân đường cao', 25);
insert into _hh_bai_map values ('3c319ade-a28c-4d95-a5da-013cce71bef6', 'Tam giác vuông - Điểm bất kì thuộc cạnh huyền', 26);

-- Base = max(thu_tu) khối 8 hiện tại. Bài mới ghi thu_tu = base + 1..9.
-- Map giữa (_hh_bai_map.thu_tu ∈ 1..9) và ma_bai mới dựa vào ten_bai (9 tên đều KHÁC nhau, verified).
with base as (select coalesce(max(thu_tu),0) as b from hinh_hoc_bai where khoi='8'),
ins as (
  insert into hinh_hoc_bai (khoi, ten_bai, thu_tu, da_duyet)
  select '8', m.ten_bai, m.thu_tu + b, false from _hh_bai_map m, base order by m.thu_tu
  returning ma_bai, ten_bai
)
insert into _hh_bai_ma (thu_tu, ma_bai)
  select m.thu_tu, ins.ma_bai from ins join _hh_bai_map m on m.ten_bai = ins.ten_bai;

-- ── STAGE 3 · Lý thuyết Bài (gia_thiet + link ảnh cấu hình nếu có) ─────────
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho tứ giác ABCD

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/9595cdea-1f8e-4ca4-91ee-f1da3842c9f9.png)' from _hh_bai_ma where thu_tu = 1;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho hình thang ABCD có AB // CD.

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/84b6c8e5-115b-476c-9eeb-90b7fff865c7.png)' from _hh_bai_ma where thu_tu = 2;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho hình thang cân ABCD, AB // CD.

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/53203313-a184-42d4-aabc-a04063e6cf5b.png)' from _hh_bai_ma where thu_tu = 3;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho hình bình hành ABCD.

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/33bff848-b572-498d-a0cb-3371f25dbb95.png)' from _hh_bai_ma where thu_tu = 4;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho hình chữ nhật ABCD. AC cắt BD tại O

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/b7883534-e0b6-442b-8c5c-e6cf9536f92f.png)' from _hh_bai_ma where thu_tu = 5;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho hình thoi ABCD. AC cắt BD tại O.

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/c5d91fcf-efb2-40e6-b025-a7331d1726d7.png)' from _hh_bai_ma where thu_tu = 6;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho hình vuông ABCD.

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/1e495d00-342d-4672-a3f2-945b11ccfe1a.png)' from _hh_bai_ma where thu_tu = 7;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho tam giác $ABC$ vuông tại A. M là trung điểm của BC' from _hh_bai_ma where thu_tu = 8;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho $\triangle ABC$ nhọn có AM là trung tuyến. Trên tia đối của tia AM lấy điểm D sao cho $AM = MD$.' from _hh_bai_ma where thu_tu = 9;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho tứ giác ABCD. AD cắt BC tại E. AB cắt CD tại F.' from _hh_bai_ma where thu_tu = 10;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho tứ giác $ABCD$ có $B + D = 180^\circ$ và $CB = CD$. Dx là tia đối của tia DA' from _hh_bai_ma where thu_tu = 11;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho tứ giác $ABCD$. Gọi $I$ là giao điểm của các tia phân giác của các góc $\widehat{BAD}$ và $\widehat{ABC}$ của tứ giác.

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/531bec5d-6a9b-4c88-95d0-2f6e4b4bdef3.png)' from _hh_bai_ma where thu_tu = 12;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho tứ giác $ABCD$ có $\widehat{A} = \widehat{B}$ và $BC = AD$.

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/f9bd1187-44c4-443d-9f80-8700676a2c6e.png)' from _hh_bai_ma where thu_tu = 13;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho hình thang ABCD có AB // CD.; BD là phân giác góc D

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/3b41236e-498e-400e-baad-ee536e5e49a4.png)' from _hh_bai_ma where thu_tu = 14;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho hình thang cân ABCD, AB // CD.; Gọi $O$ là giao điểm của $AD$ và $BC$

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/cf3a2cbc-71ea-42d1-8a72-ec95fa477baf.png)' from _hh_bai_ma where thu_tu = 15;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho tam giác cân $ABC$. $E,D$ thuộc $AB, AC$ sao cho $AD = AE$

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/81332f01-540d-4c0d-852b-c4262a4cb183.png)' from _hh_bai_ma where thu_tu = 16;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho hình thang cân ABCD, AB // CD.; $E,F$ là trung điểm của $AB, CD$. $O$ là giao điểm của $AC$ và $BD$

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/873c05b5-3694-4c7e-b674-2a232c20578b.png)' from _hh_bai_ma where thu_tu = 17;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho hình bình hành ABCD.; M,N là trung điểm AB,CD.

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/c85e3eb3-ccc1-49e4-b959-bb1a69190d46.png)' from _hh_bai_ma where thu_tu = 18;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho hình bình hành ABCD.; AM, CN là phân giác của góc A,C

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/c210a8fd-16b2-4f49-b718-71c5548bd96f.png)' from _hh_bai_ma where thu_tu = 19;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho hình bình hành ABCD.; AC cắt BD tại O' from _hh_bai_ma where thu_tu = 20;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho hình bình hành ABCD.; Kẻ AH, CK vuông góc với BD

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/c2882e15-d81f-490b-bd7a-97e5bb87f983.png)' from _hh_bai_ma where thu_tu = 21;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho tam giác ABC có H là trực tâm. Qua B kẻ đường vuông góc với AB. Qua C kể đường vuông góc với AC. Hai đường này cắt nhau ở I

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/a72b0af5-9917-47fa-bcb7-63a910494e44.png)' from _hh_bai_ma where thu_tu = 22;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho tam giác $ABC$. $M,N$ là trung điểm của $AB,AC$.

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/85c2331b-be6c-4f94-b5f4-c2eab5574035.png)' from _hh_bai_ma where thu_tu = 23;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho tam giác $ABC$ vuông tại$A$. $M$ là trung điểm $BC$

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/b52e6a95-ffbb-4a0d-9a98-60c72202beb2.png)' from _hh_bai_ma where thu_tu = 24;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho tam giác $ABC$ vuông ở $A$. Đường cao $AH$.

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/239070d7-03a9-4658-8445-7ec02ae80e16.png)' from _hh_bai_ma where thu_tu = 25;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho tam giác ABC vuông tại A.  Lấy điểm $M$   thuộc cạnh $BC$ . Kẻ $MD$  và $ME$  lần lượt vuông góc với $AB$  và $AC$.' from _hh_bai_ma where thu_tu = 26;

-- ── STAGE 4 · INSERT hinh_hoc_cau_hoi (112 câu: 46 lẻ + 27 ghép + 39 biến thể) ──
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '635fb2eb-1c6d-4ce0-ae41-d64c515132da', 'a. Chứng minh : $\triangle AMD = \triangle CNB$
b. Chứng minh : $DM = BN$ và $DM \parallel BN$', NULL, 'Vì ABCD là hình bình hành nên $AB \parallel CD$, $AB = CD$, $AD = BC$, $\widehat{A} = \widehat{C}$
M là trung điểm AB nên $MA = MB = \frac{AB}{2}$

N là trung điểm CD nên $NC = ND = \frac{CD}{2}$

Do AB = CD nên $MA = MB = NC = ND$

Xét $\triangle AMD$ và $\triangle CNB$ có :
$AD = BC$ (cmt)
$AM = CN$ (cmt)
$\widehat{A} = \widehat{C}$ (cmt)

Vậy $\triangle AMD = \triangle CNB$ (c.g.c)

b. Suy ra DM = BN (vì tương ứng)
$\widehat{AMD} = \widehat{CNB}$ (vì tương ứng)
Mặt khác ta có $AB \parallel CD$

Suy ra $\widehat{CNB} = \widehat{ABN}$ (hai góc so le trong)

Vậy $\widehat{AMD} = \widehat{ABN}$

Mà $\widehat{AMD}$ ; $\widehat{ABN}$ là hai góc ở vị trí đồng vị

Suy ra $DM \parallel BN$

Cho hình bình hành ABCD. Kẻ tia phân giác BE, DF.
a. Chứng minh : $\triangle AFD = \triangle CEB$

b. Chứng minh : BE = DF và $BE \parallel DF$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/f2731369-6249-4274-ba9d-d92abf5a4505.svgxml', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0001', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '635fb2eb-1c6d-4ce0-ae41-d64c515132da', 'Chứng minh  : $AE = CF$', NULL, 'Vì ABCD là hình bình hành nên $AB \parallel CD$. O là giao điểm AC và BD thì O là trung điểm của AC và BD.
Do $AB \parallel CD$ nên $\widehat{EAO} = \widehat{FCO}$ (hai góc so le trong)
O là trung điểm AC nên OA = OC
Xét $\triangle OAE$ và $\triangle OCF$ có :
OA = OC (cmt)
$\widehat{EAO} = \widehat{FCO}$ (cmt)
$\widehat{AOE} = \widehat{COF}$ (hai góc đối đỉnh)
Vậy $\triangle OAE = \triangle OCF (g.c.g)$
Suy ra AE = CF (vì tương ứng)', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/089827e8-d7ce-48e3-8f1a-bd4bd14683fe.svgxml', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0002', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 10),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '37a807ec-e9fd-4353-b80a-9cef46e27640', 'Chứng minh $EIF = \frac{B+D}{2}$.', NULL, 'Gọi $K$ là giao điểm của $FI$ và $BC$.
Xét $\triangle IKE$ có $EIF$ là góc ngoài
đỉnh $I \Rightarrow EIF = EKI + IEK$ (1)
Xét $\triangle FBK$ có $EKI$ là góc ngoài
đỉnh $K \Rightarrow EKI = \hat{B} + BFK$ (2)
Từ (1) và (2) suy ra:
$EIF = B + BFK + IEK$. (3)
Lại có: $BFK = \frac{1}{2}BFC$ ($FK$ là tia phân giác của góc $BFC$)
$= \frac{1}{2}.(180^\circ - \hat{B} - \hat{C})$ (tổng các góc trong $\triangle BFC$)
Tương tự: $IEK = 90^\circ - \frac{A+B}{2}$
Thay (4) và (5) vào (3) ta có:
$EIF = B + 90^\circ - \frac{B+C}{2} + 90^\circ - \frac{A+B}{2}$
$= 180^\circ - \frac{A+C}{2} = \frac{360^\circ - (A+C)}{2} = \frac{B+D}{2}$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/4c41196a-30bd-40e3-975a-d3714d4000f7.png', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/19205c20-dace-4197-8954-cdacfc0964aa.png', 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0003', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'f048bbd0-ed90-4bbb-b11d-067b7266d89f', 'Chứng minh rằng : $AC + BD < AB + BC + CD + DA$', NULL, 'Áp dụng tính chất của bất đẳng thức tam giác ta có :
Xét tam giác ABC có: $AB + BC > AC$
Xét tam giác ADC có: $AD + DC > AC$
Xét tam giác BAD có: $BA + AD > BD$
Xét tam giác BCD có: $BC + CD > BD$
Từ đó suy ra : $2(AB+BC+CD+DA)>2(AC+BD)$
Suy ra $AC + BD < AB + BC + CD + DA$', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0004', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'f048bbd0-ed90-4bbb-b11d-067b7266d89f', 'Chứng minh rằng : $AC + BD > \frac{AB + BC + CD + DA}{2}$', NULL, 'Áp dụng tính chất của bất đẳng thức tam giác
Xét tam giác OAB có : $OA+OB > AB$
Xét tam giác OBC có : $OB+OC > BC$
Xét tam giác OCD có : $OC+OD > CD$
Xét tam giác ODA có : $OD+OA > DA$
Từ đó suy ra:
$2(OA+OB+OC+OD) > AB+BC+CD+DA$
$2(AC+BD) > AB+BC+CD+DA$
$\Rightarrow AC+BD > \frac{AB+BC+CD+DA}{2}$', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0005', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'f048bbd0-ed90-4bbb-b11d-067b7266d89f', 'Cho tứ giác ABCD. Biết rằng số đo các góc A,B,C,D lần lượt tỉ lệ với 1,2,3,4. Tính số đo các góc ?', NULL, 'Vì số đo các góc A,B,C,D lần lượt tỉ lệ với 1,2,3,4 nên ta có :
$\frac{\widehat{A}}{1}=\frac{\widehat{B}}{2}=\frac{\widehat{C}}{3}=\frac{\widehat{D}}{4}=\frac{\widehat{A}+\widehat{B}+\widehat{C}+\widehat{D}}{1+2+3+4}=\frac{360^0}{10}=36^0$
Vậy $\widehat{A}=36^0$; $\widehat{B}=36^0.2=72^0$; $\widehat{C}=36.3=108^0$; $\widehat{D}=36.4=144^0$', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0006', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', 'a) Chứng minh tứ giác $BDME$ là hình chữ nhật.
b) Lấy điểm $F$ thuộc tia đối tia $ME$ sao cho $MF = ME$.
Chứng minh: $BE = EC$ và tứ giác $AFCE$ là hình bình hành.
c) Gọi $I, K$ lần lượt là giao điểm của $BM, BF$ với $AE$. Tính $\frac{IK}{FC}$?', NULL, 'a) Chứng minh tứ giác $BDME$ là hình chữ nhật.

$MD \perp AB$ tại $D$, $ME \perp BC$ tại $E$, và $\triangle ABC$ vuông tại $B$ nên $AB \perp BC$. Tứ giác $BDME$ có $\widehat{B} = \widehat{D} = \widehat{E} = 90°$ nên là hình chữ nhật.

b) Chứng minh $BE=EC$ và tứ giác $AFCE$ là hình bình hành.

Vì $ME \perp BC$ và $AB \perp BC$ nên $ME \parallel AB$. Mà $M$ là trung điểm $AC$, theo định lý đường trung bình (đường thẳng qua trung điểm một cạnh và song song với cạnh thứ hai thì đi qua trung điểm cạnh thứ ba), $E$ là trung điểm $BC$. Vậy $BE=EC$.

$F$ thuộc tia đối tia $ME$ và $MF=ME$ nên $M$ là trung điểm $EF$; mặt khác $M$ là trung điểm $AC$. Hai đường chéo $AC$ và $EF$ của tứ giác $AFCE$ cùng nhận $M$ làm trung điểm, suy ra $AFCE$ là hình bình hành.

c) Tính $\dfrac{IK}{FC}$.

Chọn hệ trục: $B(0;0)$, $A(0;a)$, $C(c;0)$ với $a=BA$, $c=BC$. Khi đó $M\left(\dfrac{c}{2};\dfrac{a}{2}\right)$, $E\left(\dfrac{c}{2};0\right)$ (đúng là trung điểm $BC$ như câu b), $F\left(\dfrac{c}{2};a\right)$.

Đường thẳng $AE$: $x=\dfrac{c}{2}t,\ y=a(1-t)$. Đường thẳng $BM$: $y=\dfrac{a}{c}x$; đường thẳng $BF$: $y=\dfrac{2a}{c}x$.

Giải hệ được $I = BM \cap AE = \left(\dfrac{c}{3};\dfrac{a}{3}\right)$ và $K = BF \cap AE = \left(\dfrac{c}{4};\dfrac{a}{2}\right)$.

$IK = \dfrac{\sqrt{c^2+4a^2}}{12}$; $FC = \dfrac{\sqrt{c^2+4a^2}}{2}$.

Vậy $\dfrac{IK}{FC} = \dfrac{1}{6}$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0007', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', 'a) Chứng minh tứ giác $AFME$ là hình chữ nhật.
b) Gọi $D$ là trung điểm $MC$, $H$ là giao điểm của $AM$ và $EF$. Tứ giác $AHDC$ là hình gì, vì sao?
c) Từ $F$ kẻ $FI \perp ED$ tại $I$. Chứng minh $\triangle AIM$ vuông tại $I$ và $AM$ là phân giác góc $IAB$.', NULL, 'a) Vì $\triangle ABC$ vuông tại $A$ nên $\widehat{FAE} = 90°$. Vì $MF \perp AB$ tại $F$ nên $\widehat{AFM} = 90°$. Vì $ME \perp AC$ tại $E$ nên $\widehat{AEM} = 90°$. Tứ giác $AFME$ có ba góc vuông nên $AFME$ là hình chữ nhật.

b) Vì $MF \perp AB$, $AC \perp AB$ nên $MF \parallel AC$; $M$ là trung điểm $BC$ nên theo đường trung bình, $F$ là trung điểm $AB$. Tương tự $ME \parallel AB$ nên $E$ là trung điểm $AC$.

$AM$ là trung tuyến ứng với cạnh huyền $BC$ của tam giác vuông $ABC$ nên $AM = \dfrac{BC}{2} = MC$ ($M$ là trung điểm $BC$).

Trong $\triangle AMC$: $H$ là trung điểm $AM$ (giao điểm hai đường chéo $AM, EF$ của hình chữ nhật $AFME$, nên là trung điểm mỗi đường chéo), $D$ là trung điểm $MC$. Vậy $HD$ là đường trung bình của $\triangle AMC$ ứng với cạnh $AC$, suy ra $HD \parallel AC$, $HD = \dfrac{AC}{2}$.

Vì $AM = MC$ nên $AH = \dfrac{AM}{2} = \dfrac{MC}{2} = DC$.

Tứ giác $AHDC$ có $HD \parallel AC$ ($HD \ne AC$ nên không phải hình bình hành) và $AH = DC$ nên $AHDC$ là hình thang cân.

c) Cũng trong $\triangle AMC$: $E$ là trung điểm $CA$, $D$ là trung điểm $MC$ nên $ED$ là đường trung bình ứng với cạnh $AM$, suy ra $ED \parallel AM$; mà $H, M$ cùng thuộc đường thẳng $AM$ nên $ED \parallel HM$.

Vì $FI \perp ED$ (giả thiết) và $ED \parallel HM$ nên $FI \perp HM$.

Vì $FI \perp ED$ tại $I$ nên $\widehat{FIE} = 90°$, tức $\triangle FIE$ vuông tại $I$ với cạnh huyền $FE$. Vì $H$ là trung điểm $FE$ nên $HI = \dfrac{FE}{2}$ (trung tuyến ứng cạnh huyền).

Vì $AFME$ là hình chữ nhật nên hai đường chéo $AM = FE$ và cùng nhận $H$ làm trung điểm, suy ra $HA = HM = \dfrac{AM}{2} = \dfrac{FE}{2} = HI$.

Trong $\triangle AIM$, trung tuyến $IH$ (ứng với cạnh $AM$) bằng $\dfrac{AM}{2}$ (vì $HI = HA = HM$), theo định lí đảo của trung tuyến ứng cạnh huyền, $\triangle AIM$ vuông tại $I$.

Mặt khác $HF = HI$ ($=\dfrac{FE}{2}$) nên $H$ thuộc đường trung trực của $FI$; mà $HM \perp FI$ (chứng minh trên) nên đường thẳng $HM$ chính là đường trung trực của $FI$, suy ra $M$ (thuộc đường thẳng này) cách đều $F, I$: $MF = MI$.

$\triangle MFI$ cân tại $M$ ($MF = MI$) có $HM$ vuông góc với đáy $FI$ tại $H$ nên $HM$ (tức đường thẳng $MA$) là đường phân giác của $\widehat{FMI}$: $\widehat{FMA} = \widehat{IMA}$.

Xét $\triangle AMF$ và $\triangle AMI$: $AM$ chung, $\widehat{AMF} = \widehat{AMI}$ (vừa chứng minh), $MF = MI$, suy ra $\triangle AMF = \triangle AMI$ (c.g.c), do đó $\widehat{MAF} = \widehat{MAI}$.

Vì $F \in AB$ nên $\widehat{MAF} = \widehat{MAB}$. Vậy $\widehat{MAB} = \widehat{MAI}$, tức $AM$ là tia phân giác của $\widehat{IAB}$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0008', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', 'a) Chứng minh tứ giác $ANME$ là hình chữ nhật và $ME$ là đường trung bình của tam giác $ABC$.
b) Trên tia đối của tia $EM$ lấy điểm $D$ sao cho $ED=EM$. Chứng minh tứ giác $AMCD$ là hình thoi.
c) $BD$ cắt $AC$ tại $I$. Gọi $J$ là trung điểm $AD$ và $P$ là giao điểm của $AB$ và $CD$. Chứng minh $P,I,J$ thẳng hàng.', NULL, 'a) Chứng minh tứ giác $ANME$ là hình chữ nhật và $ME$ là đường trung bình của $\triangle ABC$.

$MN \perp AB$ tại $N$, $ME \perp AC$ tại $E$, và $\triangle ABC$ vuông tại $A$ nên $AB \perp AC$. Tứ giác $ANME$ có $\widehat{A} = \widehat{N} = \widehat{E} = 90°$ nên là hình chữ nhật.

Vì $ME \perp AC$ và $AB \perp AC$ nên $ME \parallel AB$. Mà $M$ là trung điểm $BC$, theo định lý đường trung bình, $E$ là trung điểm $AC$ và $ME = \dfrac{AB}{2}$. Vậy $ME$ là đường trung bình của $\triangle ABC$ (ứng với cạnh $AB$).

b) Chứng minh tứ giác $AMCD$ là hình thoi.

Theo câu a), $E$ là trung điểm $AC$. Theo giả thiết, $D$ thuộc tia đối tia $EM$ và $ED=EM$ nên $E$ là trung điểm $MD$.

Hai đường chéo $AC$, $MD$ của tứ giác $AMCD$ cùng nhận $E$ làm trung điểm, suy ra $AMCD$ là hình bình hành.

$M$ là trung điểm cạnh huyền $BC$ của tam giác vuông $ABC$ (vuông tại $A$) nên $MA=MC=\dfrac{BC}{2}$ (trung tuyến ứng cạnh huyền).

Hình bình hành $AMCD$ có hai cạnh kề $MA=MC$ nên là hình thoi.

c) $BD$ cắt $AC$ tại $I$, $J$ là trung điểm $AD$, $P$ là giao điểm của $AB$ và $CD$. Chứng minh $P, I, J$ thẳng hàng.

Đặt vectơ gốc $A$: $\vec b=\overrightarrow{AB}$, $\vec c=\overrightarrow{AC}$. Khi đó $M=\dfrac{\vec b+\vec c}{2}$, $E=\dfrac{\vec c}{2}$, $D=2E-M=\dfrac{\vec c-\vec b}{2}$.

- Tìm $P=AB\cap CD$: điểm trên $CD$ có dạng $\vec c + t\left(\dfrac{\vec c-\vec b}{2}-\vec c\right) = \left(1-\dfrac{t}{2}\right)\vec c - \dfrac{t}{2}\vec b$; điểm trên $AB$ có dạng $s\vec b$. Vì $\vec b,\vec c$ độc lập tuyến tính, hệ số của $\vec c$ phải triệt tiêu: $1-\dfrac{t}{2}=0 \Rightarrow t=2$, được điểm $-\vec b$. Vậy $P=-\vec b$.

- Tìm $I=BD\cap AC$: điểm trên $BD$ có dạng $\vec b+t\left(\dfrac{\vec c-\vec b}{2}-\vec b\right)=\left(1-\dfrac{3t}{2}\right)\vec b+\dfrac{t}{2}\vec c$; điểm trên $AC$ có dạng $u\vec c$. Hệ số của $\vec b$ phải triệt tiêu: $1-\dfrac{3t}{2}=0 \Rightarrow t=\dfrac{2}{3}$, được điểm $\dfrac{1}{3}\vec c$. Vậy $I=\dfrac{\vec c}{3}$.

- $J$ là trung điểm $AD$: $J=\dfrac{D}{2}=\dfrac{\vec c-\vec b}{4}$.

Tính $\overrightarrow{PI}=I-P=\dfrac{\vec c}{3}+\vec b=\dfrac{3\vec b+\vec c}{3}$ và $\overrightarrow{PJ}=J-P=\dfrac{\vec c-\vec b}{4}+\vec b=\dfrac{3\vec b+\vec c}{4}$.

Suy ra $\overrightarrow{PI}=\dfrac{4}{3}\overrightarrow{PJ}$, tức hai vectơ cùng phương. Vậy $P, I, J$ thẳng hàng (đpcm).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0009', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', 'a) Chứng minh rằng: $ME\parallel AC$
b) Kẻ $MF \perp AC (F \in AC)$. Chứng minh rằng: tứ giác $AEMF$ là hình chữ nhật
c) Lấy điểm $D$ trên tia $MF$ sao cho $F$ là trung điểm $MD$. Gọi $H,K$ lần lượt là giao điểm của $BD$ với $ME, AC$. Chứng minh rằng: $BH = HK = KD$', NULL, 'a) Chứng minh $ME \parallel AC$.

$E, M$ lần lượt là trung điểm $AB, BC$ nên $EM$ là đường trung bình của $\triangle ABC$ ứng với cạnh $AC$, suy ra $EM \parallel AC$ (và $EM=\dfrac{AC}{2}$).

b) $MF \perp AC$ tại $F$. Chứng minh tứ giác $AEMF$ là hình chữ nhật.

Vì $MF \perp AC$ và $AB \perp AC$ (tam giác vuông tại $A$) nên $MF \parallel AB$, tức $MF \parallel AE$. Vì $M$ là trung điểm $BC$ và $MF \parallel AB$, theo định lý đường trung bình, $F$ là trung điểm $AC$ và $MF=\dfrac{AB}{2}$.

Mà $AE=\dfrac{AB}{2}$ ($E$ là trung điểm $AB$) nên $AE=MF$. Kết hợp $AE \parallel MF$, tứ giác $AEMF$ (một cặp cạnh đối song song và bằng nhau) là hình bình hành.

Hình bình hành $AEMF$ có $\widehat{A}=\widehat{EAF}=\widehat{BAC}=90°$ nên là hình chữ nhật.

c) $D$ trên tia $MF$ sao cho $F$ là trung điểm $MD$; $H,K$ lần lượt là giao điểm của $BD$ với $ME, AC$. Chứng minh $BH=HK=KD$.

Đặt vectơ gốc $A$: $\vec p=\overrightarrow{AB}$, $\vec q=\overrightarrow{AC}$. Khi đó $E=\dfrac{\vec p}{2}$, $M=\dfrac{\vec p+\vec q}{2}$, $F=\dfrac{\vec q}{2}$ (trung điểm $AC$, câu b), $D=2F-M=\dfrac{\vec q-\vec p}{2}$ (vì $F$ là trung điểm $MD$).

Tham số hoá đường thẳng $BD$: điểm$(t) = \vec p + t(D-\vec p) = \left(1-\dfrac{3t}{2}\right)\vec p+\dfrac{t}{2}\vec q$, với $t=0$ ứng $B$ và $t=1$ ứng $D$.

- Giao với đường thẳng $ME$ (các điểm dạng $\dfrac{\vec p}{2}+s\vec q$, vì $ME \parallel AC$ nên cùng phương $\vec q$): hệ số của $\vec p$ cho $1-\dfrac{3t}{2}=\dfrac12 \Rightarrow t=\dfrac13$. Vậy $H$ ứng $t=\dfrac13$.

- Giao với đường thẳng $AC$ (các điểm dạng $u\vec q$): hệ số của $\vec p$ phải triệt tiêu: $1-\dfrac{3t}{2}=0 \Rightarrow t=\dfrac23$. Vậy $K$ ứng $t=\dfrac23$.

Vì điểm$(t)$ là hàm tuyến tính theo $t$ dọc đường thẳng $BD$, độ dài các đoạn tỉ lệ với hiệu tham số $t$. Bốn điểm $B,H,K,D$ ứng với $t=0,\dfrac13,\dfrac23,1$ — cách đều nhau $\dfrac13$. Vậy $BH=HK=KD$ (đpcm).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0010', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', 'a) Chứng minh rằng: Tứ giác $AEHF$ là hình chữ nhật.
b) Lấy $I$ là trung điểm của $HC$. Trên tia đối của tia $IA$ lấy điểm $K$ sao cho $I$ là trung điểm của $AK$. Chứng minh rằng: $CK \parallel AH$
c) Chứng minh rằng: Tứ giác $CFEK$ là hình thang cân
d) Gọi $O$ là giao điểm của $AH$ và $EF$. Gọi $M$ là giao điểm của $AK$ và $CO$. Chứng minh rằng: $AK = 3AM$ .', NULL, 'a) Tam giác $ABC$ vuông tại $A$ nên $\widehat{EAF} = \widehat{BAC} = 90^\circ$ ($E \in AB$, $F \in AC$).
Vì $HE \perp AB$ tại $E$ nên $\widehat{AEH} = 90^\circ$.
Vì $HF \perp AC$ tại $F$ nên $\widehat{AFH} = 90^\circ$.
Tứ giác $AEHF$ có ba góc vuông nên là hình chữ nhật.

b) Vì $I$ là trung điểm $HC$ và cũng là trung điểm $AK$ (giả thiết) nên tứ giác $AHKC$ có hai đường chéo $AK, HC$ cắt nhau tại trung điểm $I$ của mỗi đường, do đó $AHKC$ là hình bình hành. Suy ra $CK \parallel AH$ (cạnh đối của hình bình hành).

c) Vì $AEHF$ là hình chữ nhật (câu a) nên $EH \parallel AF$ (cạnh đối), mà $AF$ nằm trên đường thẳng $AC$, suy ra $EH \parallel AC$.
Vì $AHKC$ là hình bình hành (câu b) nên $HK \parallel CA$ (cạnh đối).
Hai đường thẳng $EH$ và $HK$ cùng đi qua $H$ và cùng song song với $AC$ nên theo tiên đề đường thẳng song song, $EH$ và $HK$ là cùng một đường thẳng, tức $E, H, K$ thẳng hàng và $EK \parallel AC$, do đó $EK \parallel CF$ (vì $C, F$ cũng thuộc $AC$).
Mặt khác, $FE$ là một đường chéo của hình chữ nhật $AEHF$ nên $FE = AH$; và $AHKC$ là hình bình hành nên $CK = AH$ (cạnh đối). Suy ra $FE = CK$.
Vì $EK = EH+HK = AF+AC$ còn $CF = AC-AF$ nên $EK \ne CF$ ($AF>0$), tức $CFEK$ không phải hình bình hành. Tứ giác $CFEK$ có $CF \parallel EK$ ($CF \ne EK$) và hai cạnh bên $FE = CK$ nên $CFEK$ là hình thang cân.

d) Gọi $O$ là giao điểm hai đường chéo $AH, EF$ của hình chữ nhật $AEHF$, do đó $O$ là trung điểm $AH$.
Đặt $\vec{h}=\vec{AH}$, $\vec{c}=\vec{AC}$. Vì $AHKC$ là hình bình hành (câu b) nên $\vec{AK}=\vec{h}+\vec{c}$. Vì $O$ là trung điểm $AH$ nên $\vec{AO}=\dfrac{1}{2}\vec{h}$.
$M \in AK$ nên $\vec{AM}=t(\vec{h}+\vec{c})$; $M \in CO$ nên $\vec{AM}=\vec{AC}+s(\vec{AO}-\vec{AC})=(1-s)\vec{c}+\dfrac{s}{2}\vec{h}$, với $t,s \in \mathbb{R}$.
Vì $\vec{h}, \vec{c}$ không cùng phương, đồng nhất hệ số: $t=\dfrac{s}{2}$ và $t=1-s$. Giải hệ: $s=2t$, $t=1-2t \Rightarrow t=\dfrac{1}{3}$.
Vậy $\vec{AM}=\dfrac{1}{3}\vec{AK}$, tức $AM=\dfrac{1}{3}AK$, suy ra $AK=3AM$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0011', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 20),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '8f8a85c2-9941-478c-9932-9014cc3f923b', 'Chứng minh $AECF$ là hình bình hành', NULL, 'Gọi $O$ là giao điểm hai đường chéo $AC, BD$ của hình bình hành $ABCD$ ($OA=OC$, $OB=OD$).
Xét $\triangle AOE$ và $\triangle COF$: $\widehat{OAE} = \widehat{OCF}$ (so le trong, vì $AB \parallel CD$ và $AC$ là cát tuyến); $OA = OC$; $\widehat{AOE} = \widehat{COF}$ (đối đỉnh, vì $E, O, F$ thẳng hàng và $A,O,C$ thẳng hàng).
Suy ra $\triangle AOE = \triangle COF$ (g.c.g), do đó $OE = OF$.
Tứ giác $AECF$ có hai đường chéo $AC$ và $EF$ cắt nhau tại $O$ là trung điểm của mỗi đường ($OA=OC$, $OE=OF$) nên $AECF$ là hình bình hành.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/ef7356c1-716f-46f2-aa00-2106bb201664.svgxml', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0012', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 3),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'd27e8f09-58b2-41e3-98cf-e3995c10e45d', 'Tính số đo các góc của hình thang cân  $ABCD$.', NULL, 'Vì $ABCD$ là hình thang cân nên có: $\widehat{A}+\widehat{D}=180^\circ$; $\widehat{C}=\widehat{D}$; $\widehat{A}=\widehat{B}$
mà $\widehat{A}=2.\widehat{C}$; nên suy ra $2\widehat{C}+\widehat{C}=180^\circ \Rightarrow 3\widehat{C}=180^\circ \Rightarrow \widehat{C}=60^\circ$
$\Rightarrow \widehat{D}=\widehat{C}=60^\circ$.
$\Rightarrow \widehat{A}=2\widehat{C}=120^\circ$; $\widehat{B}=\widehat{A}=120^\circ$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/e5c401a9-d209-4704-a698-393d57168013.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0013', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 12),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9d9c236f-ea5c-450d-80cd-f1125a271b10', 'Chứng minh $\widehat{AIB} = \frac{\widehat{C} + \widehat{D}}{2}$.', NULL, '$\widehat{AIB} = 180^\circ - (\widehat{IAB} + \widehat{IBA}) = 180^\circ - \frac{\widehat{A} + \widehat{B}}{2} = \frac{360^\circ - (\widehat{A} + \widehat{B})}{2} = \frac{\widehat{C} + \widehat{D}}{2}$', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0014', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 14),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'bf40bbcb-5a47-4dbc-ae18-da01577bf3d3', 'Chứng minh rằng: AB = AD', NULL, 'Ta có $AB \parallel CD$ nên $\widehat{ABD} = \widehat{BDC}$ (so le trong)
Mà DB là phân giác góc D nên $\widehat{BDC} = \widehat{BDA}$
Suy ra $\widehat{BDA} = \widehat{ABD}$
Nên $\triangle ABD$ cân ở A , suy ra $AD = AB$', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0015', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 14),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'bf40bbcb-5a47-4dbc-ae18-da01577bf3d3', 'Chứng minh DB là phân giác góc $\widehat{ADC}$', NULL, 'Ta có $AB \parallel CD$ nên $\widehat{ABD} = \widehat{BDC}$ (so le trong)
Mà $AD = AB$ nên $\triangle ABD$ cân ở A
Suy ra $\widehat{BDA} = \widehat{ABD}$
Vậy $\widehat{BDC} = \widehat{BDA}$ suy ra DB là phân giác của $\widehat{ADC}$', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0016', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 14),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'bf40bbcb-5a47-4dbc-ae18-da01577bf3d3', 'Chứng minh ABCD là hình thang', NULL, 'Ta có $AD = AB$ nên $\triangle ABD$ cân ở A
Suy ra $\widehat{BDA} = \widehat{ABD}$
Mà DB là phân giác góc D nên $\widehat{BDC} = \widehat{BDA}$
Suy ra $\widehat{ABD} = \widehat{BDC}$
Mà $\widehat{ABD}$ và $\widehat{BDC}$ là hai góc ở vị trí so le trong nên $AB \parallel CD$
Suy ra ABCD là hình thang.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0017', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'f048bbd0-ed90-4bbb-b11d-067b7266d89f', 'Cho hình vẽ trên. Tính góc D ? ', NULL, 'Xét tứ giác $ABCD$ có: $\widehat{A} + \widehat{B} + \widehat{C} + \widehat{D} = 360^\circ$
$\Rightarrow 100^\circ + 75^\circ + 120^\circ + \widehat{D} = 360^\circ \Rightarrow 295^\circ + \widehat{D} = 360^\circ \Rightarrow \widehat{D} = 65^\circ$ .', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/0e885362-ad3a-495e-8d94-b774ff267f1a.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0018', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 16),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'feaa0121-261b-4510-8a1e-435e29d1c390', 'Chứng minh $BEDC$ là hình thang cân', NULL, 'Vì tam giác $ABC$ cân tại $A$ nên $\widehat{ABC} = \widehat{ACB}$
Mà $\widehat{ABC} + \widehat{ACB} + \widehat{BAC} = 180^0$
Suy ra $\widehat{ABC} = \widehat{ACB} = \frac{180^0 - \widehat{BAC}}{2}$
Lại có $AD = AE$ (gt) nên tam giác $ADE$ cân tại $A$
Suy ra $\widehat{ADE} = \widehat{AED}$
Mà $\widehat{ADE} + \widehat{AED} + \widehat{DAE} = 180^0$
Suy ra $\widehat{ADE} = \widehat{AED} = \frac{180^0 - \widehat{DAE}}{2}$
Mà $\widehat{DAE} = \widehat{BAC} \Rightarrow \frac{180^0 - \widehat{BAC}}{2} = \frac{180^0 - \widehat{DAE}}{2}$
Suy ra $\widehat{ABC} = \widehat{ACB} = \widehat{ADE} = \widehat{AED}$
Mà $\widehat{ABC}$ và $\widehat{AED}$ là 2 góc ở vị trí đồng vị
Nên $DE \parallel BC$, vậy $BEDC$ là hình thang
Mà tam giác $ABC$ cân nên $\widehat{EBC} = \widehat{DCB}$
Vậy $BEDC$ là hình thang cân', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0019', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '635fb2eb-1c6d-4ce0-ae41-d64c515132da', 'a. Chứng minh rằng $\triangle AHD = \triangle CKB$
b. Chứng minh $DH = BK$ và $DH \parallel BK$', NULL, 'a. Vì ABCD là hình bình hành nên $AD = BC$ ; $\widehat{D} = \widehat{B}$
Xét $\triangle AHD$ và $\triangle CKB$ có :
$AD = BC$ (cmt)
$\widehat{D} = \widehat{B}$ (cmt)
$\widehat{AHD} = \widehat{CKB} = 90^o$
Suy ra $\triangle AHD = \triangle CKB (CH - GN)$
b. Suy ra $DH = BK$ (vì tương ứng)
Mà ABCD là hình bình hành nên $AB \parallel CD$
H thuộc CD, K thuộc AB nên $DH \parallel BK$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/35617e71-5776-43e4-beb2-55914c4ec438.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0020', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 20),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '8f8a85c2-9941-478c-9932-9014cc3f923b', 'Chứng minh $MNPQ$ là hình bình hành', NULL, 'Gọi $O$ là giao điểm hai đường chéo $AC, BD$.
• Đường thẳng $a$ qua $O$ cắt $AB, CD$ tại $M, P$: xét $\triangle AOM$ và $\triangle COP$ có $\widehat{OAM} = \widehat{OCP}$ (so le trong, $AB \parallel CD$), $OA = OC$, $\widehat{AOM} = \widehat{COP}$ (đối đỉnh) $\Rightarrow \triangle AOM = \triangle COP$ (g.c.g) $\Rightarrow OM = OP$.
• Đường thẳng $b$ qua $O$ cắt $BC, AD$ tại $N, Q$: xét $\triangle BON$ và $\triangle DOQ$ có $\widehat{OBN} = \widehat{ODQ}$ (so le trong, $BC \parallel AD$), $OB = OD$, $\widehat{BON} = \widehat{DOQ}$ (đối đỉnh) $\Rightarrow \triangle BON = \triangle DOQ$ (g.c.g) $\Rightarrow ON = OQ$.
Tứ giác $MNPQ$ có hai đường chéo $MP$ và $NQ$ cắt nhau tại $O$ là trung điểm mỗi đường nên $MNPQ$ là hình bình hành.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/ed99ad4d-95db-4151-8d45-4193988032dc.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0021', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', 'a) Chứng minh $AMHN$ là hình chữ nhật.
b) Chứng minh $AC \parallel HK$ .
c) Từ $A$ kẻ đường thẳng vuông góc với $MN$ cắt $BC$ tại $G$. Chứng minh $G$ là trung điểm $BC$ .', NULL, 'a) Vì $\triangle ABC$ vuông tại $A$ nên $\widehat{MAN} = 90°$. Vì $HM \perp AB$ tại $M$ nên $\widehat{AMH} = 90°$. Vì $HN \perp AC$ tại $N$ nên $\widehat{ANH} = 90°$. Tứ giác $AMHN$ có ba góc vuông nên là hình chữ nhật.

b) $I$ là trung điểm $HC$ (giả thiết) và $I$ là trung điểm $AK$ (giả thiết, $K$ trên tia $AI$ sao cho $I$ là trung điểm $AK$). Tứ giác $AHKC$ có hai đường chéo $AK$ và $HC$ cắt nhau tại trung điểm $I$ của mỗi đường, nên $AHKC$ là hình bình hành. Suy ra $HK \parallel AC$.

c) Trong $\triangle AMH$ và $\triangle AHB$: $\widehat A$ chung, $\widehat{AMH} = \widehat{AHB} = 90°$ nên $\triangle AMH \sim \triangle AHB$ (g.g), suy ra $\dfrac{AM}{AH} = \dfrac{AH}{AB}$, tức $AH^2 = AM \cdot AB$.

Tương tự, $\triangle ANH \sim \triangle AHC$ (g.g) suy ra $AH^2 = AN \cdot AC$.

Do đó $AM \cdot AB = AN \cdot AC$, tức $\dfrac{AM}{AC} = \dfrac{AN}{AB}$.

Xét $\triangle AMN$ và $\triangle ACB$: $\widehat{MAN} = \widehat{CAB}$ (cùng là $\widehat A$ của tam giác $ABC$) và $\dfrac{AM}{AC} = \dfrac{AN}{AB}$ nên $\triangle AMN \sim \triangle ACB$ (c.g.c), suy ra $\widehat{AMN} = \widehat{ACB}$ và $\widehat{ANM} = \widehat{ABC}$.

Gọi $d$ là đường thẳng qua $A$ vuông góc $MN$, cắt $MN$ tại $F$ và cắt $BC$ tại $G$ (theo giả thiết). Xét tam giác vuông $ANF$ (vuông tại $F$, vì $AF \perp MN$): $\widehat{ANF} = \widehat{ANM} = \widehat{ABC}$ ($F$ thuộc tia $NM$), suy ra $\widehat{NAF} = 90° - \widehat{ABC} = \widehat{ACB}$ (vì $\widehat{ABC} + \widehat{ACB} = 90°$). Vì $N \in AC$, $F, G \in d$ nên $\widehat{GAC} = \widehat{FAN} = \widehat{ACB}$.

Tương tự, tam giác vuông $AMF$ (vuông tại $F$): $\widehat{AMF} = \widehat{AMN} = \widehat{ACB}$, suy ra $\widehat{MAF} = 90° - \widehat{ACB} = \widehat{ABC}$; vì $M \in AB$ nên $\widehat{GAB} = \widehat{FAM} = \widehat{ABC}$.

Trong $\triangle AGC$: $\widehat{GAC} = \widehat{ACB} = \widehat{GCA}$ nên $\triangle AGC$ cân tại $G$: $GA = GC$.

Trong $\triangle AGB$: $\widehat{GAB} = \widehat{ABC} = \widehat{GBA}$ nên $\triangle AGB$ cân tại $G$: $GA = GB$.

Vậy $GB = GC$, mà $G \in BC$ nên $G$ là trung điểm $BC$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0022', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 24),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '1cbc59e4-bf8f-4932-8c6d-fb2d2144053a', 'Chứng minh rằng : $MA = \frac{1}{2}BC = MB = MC$', NULL, 'Trên tia đối của tia MA lấy D sao cho $MA = MD$. Khi đó M là trung điểm của AD.
Mà M là trung điểm của BC
Suy ra ABDC là hình bình hành.
Mà tam giác ABC vuông tại A nên $\widehat{BAC} = 90^0$
Vậy ABDC là hình chữ nhật.
Suy ra $AD = BC$
Mà $MA = MD = \frac{1}{2}AD$ nên $MA = \frac{1}{2}BC$
M là trung điểm BC nên $MB = MC = \frac{1}{2}BC \Rightarrow MA = \frac{1}{2}BC = MB = MC$', NULL, 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/4a62a4c1-91fc-4216-8c56-6ada9cf6f193.png', 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0023', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 25),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '4b643fc5-47c9-4d9a-9b79-8d389040a9d3', 'Chứng minh  $AHCE$ là hình chữ nhật.', NULL, 'Vì $I$ là trung điểm $AC$ và cũng là trung điểm $HE$ (giả thiết), nên hai đường chéo $AC$ và $HE$ của tứ giác $AHCE$ cắt nhau tại trung điểm $I$ của mỗi đường. Suy ra $AHCE$ là hình bình hành.

Mặt khác, $AH$ là đường cao của tam giác $ABC$ nên $AH \perp BC$; vì $H, C$ đều thuộc đường thẳng $BC$ nên $AH \perp HC$, tức $\widehat{AHC} = 90^\circ$.

Hình bình hành $AHCE$ có một góc vuông ($\widehat{AHC} = 90^\circ$) nên $AHCE$ là hình chữ nhật.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0024', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', 'a) Chứng minh tứ giác $ABCM$ là hình chữ nhật
b) Chứng minh $AB = CP$ và tứ giác $ABPC$ là hình bình hành
c) Lấy điểm $K$ đối xứng với điểm $B$ qua điểm $C$.
Chứng minh rằng tứ giác $MP$ là tia phân giác của $\widehat{BMK}$.', NULL, 'a) Vì $\triangle MNP$ vuông tại $M$ nên $\widehat{AMC} = 90°$ (vì $A \in MN$, $C \in MP$). Vì $BA \perp MN$ tại $A$ nên $\widehat{MAB} = 90°$. Vì $BC \perp MP$ tại $C$ nên $\widehat{MCB} = 90°$. Tứ giác $ABCM$ có ba góc vuông ($\widehat M, \widehat A, \widehat C$) nên là hình chữ nhật.

b) Vì $BA \perp MN$ và $MP \perp MN$ (do $\widehat M = 90°$) nên $BA \parallel MP$; $B$ là trung điểm $PN$ nên theo đường trung bình (đường thẳng qua trung điểm một cạnh, song song cạnh thứ hai của tam giác thì đi qua trung điểm cạnh thứ ba), $A$ là trung điểm $MN$. Tương tự $BC \parallel MN$ nên $C$ là trung điểm $MP$.

Vì $C$ là trung điểm $MP$ nên $CP = CM$. Hình chữ nhật $ABCM$ có $AB = CM$ (cạnh đối), do đó $AB = CM = CP$, tức $AB = CP$.

Vì $BA \parallel MP$ (chứng minh trên) nên $AB \parallel CP$; kết hợp $AB = CP$, tứ giác $ABPC$ có một cặp cạnh đối song song và bằng nhau nên là hình bình hành.

c) $C$ là trung điểm $MP$ (câu b) và $C$ là trung điểm $BK$ (giả thiết $K$ đối xứng $B$ qua $C$) nên tứ giác $MBPK$ có hai đường chéo $MP, BK$ cắt nhau tại trung điểm $C$ của mỗi đường.

Mặt khác, $BC \perp MP$ (giả thiết) tại $C \in MP$; vì $K$ đối xứng với $B$ qua $C$ nên $K$ thuộc đường thẳng $BC$ và $CK = CB$. Do đó $K$ chính là điểm đối xứng của $B$ qua đường thẳng $MP$ (đường vuông góc $BC$ tại chân $C \in MP$, với $CB = CK$).

Vì $M \in MP$ (trục đối xứng) nên phép đối xứng qua đường thẳng $MP$ biến điểm $B$ thành điểm $K$ và giữ nguyên $M$, do đó biến tia $MB$ thành tia $MK$, suy ra $MP$ là tia phân giác của $\widehat{BMK}$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0025', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', 'a) Chứng minh: $MN \parallel AB$
b) Trên tia đối tia NM lấy điểm Q sao cho $MN = NQ$. Chứng minh tứ giác AMCQLà
hình thoi.
c) Qua M kẻ đường thẳng song song với AC cắt AB tại P. Trên tia MP lấy điểm K sao
cho $MP = PK$. Chứng minh A là trung điểm KQ.', NULL, 'a) Xét $\triangle ABC$: $M$ là trung điểm $BC$ (vì $AM$ là đường trung tuyến), $N$ là trung điểm $AC$, suy ra $MN$ là đường trung bình của $\triangle ABC$ ứng với cạnh $AB$, do đó $MN \parallel AB$.

b) $Q$ thuộc tia đối tia $NM$ sao cho $NQ = MN$, suy ra $N$ là trung điểm $MQ$. Tứ giác $AMCQ$ có hai đường chéo $AC$, $MQ$ cắt nhau tại $N$, và $N$ là trung điểm của cả hai đường chéo ($N$ là trung điểm $AC$ theo giả thiết, trung điểm $MQ$ theo cách dựng), suy ra $AMCQ$ là hình bình hành.

$\triangle ABC$ vuông tại $A$ có $AM$ là đường trung tuyến ứng với cạnh huyền $BC$ nên $AM = \dfrac{BC}{2}$. Mà $M$ là trung điểm $BC$ nên $MC = \dfrac{BC}{2}$. Suy ra $AM = MC$.

Hình bình hành $AMCQ$ có hai cạnh kề $AM = MC$ nên $AMCQ$ là hình thoi.

c) Trong $\triangle ABC$, $M$ là trung điểm $BC$ và đường thẳng qua $M$ song song $AC$ cắt $AB$ tại $P$; theo định lí đường trung bình (chiều đảo), $P$ là trung điểm $AB$.

Trên tia $MP$ lấy $K$ sao cho $MP = PK$, suy ra $P$ là trung điểm $MK$.

Xét tứ giác $AMBK$: hai đường chéo $AB$ và $MK$ cùng cắt nhau tại $P$ và cùng nhận $P$ làm trung điểm ($P$ là trung điểm $AB$ và trung điểm $MK$), suy ra $AMBK$ là hình bình hành, do đó $AK \parallel MB$ và $AK = MB$.

Tương tự, từ hình bình hành $AMCQ$ (câu b): $AQ \parallel MC$ và $AQ = MC$.

Vì $MB$, $MC$ cùng nằm trên đường thẳng $BC$ nên $AK \parallel BC$ và $AQ \parallel BC$; hai tia $AK$, $AQ$ cùng xuất phát từ $A$ và cùng song song $BC$ nên $K, A, Q$ thẳng hàng.

Lại có $AK = MB = \dfrac{BC}{2}$ và $AQ = MC = \dfrac{BC}{2}$ nên $AK = AQ$. Vì $K, A, Q$ thẳng hàng, $AK = AQ$ và $K \ne Q$ nên $A$ phải nằm giữa $K$ và $Q$, tức $A$ là trung điểm $KQ$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0026', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', 'a) Chứng minh tứ giác $AMHN$ là hình chữ nhật.
b) Gọi $I$ là trung điểm của $HC$, $K$ là điểm đối xứng của $A$ qua $I$. Chứng minh $AC \parallel HK$
c) $MN$ cắt $AH$ tại $O$, $CO$ cắt $AK$ tại $D$. Chứng minh $AK = 3AD$.', NULL, 'a) Tứ giác $AMHN$ có $\widehat{MAN} = 90^\circ$ (vì $\widehat{BAC}=90^\circ$), $\widehat{AMH}=90^\circ$ (vì $HM \perp AB$), $\widehat{ANH}=90^\circ$ (vì $HN \perp AC$). Tứ giác có ba góc vuông nên $AMHN$ là hình chữ nhật.

b) $I$ là trung điểm $HC$ (giả thiết); $K$ đối xứng với $A$ qua $I$ nên $I$ cũng là trung điểm $AK$. Xét tứ giác $AHKC$: hai đường chéo $AK$ và $HC$ cắt nhau tại $I$ và $I$ là trung điểm của cả hai đường chéo, suy ra $AHKC$ là hình bình hành. Do đó cạnh $HK$ song song với cạnh đối diện $CA$, tức $AC \parallel HK$.

c) Vì $AMHN$ là hình chữ nhật (câu a) nên hai đường chéo $AH$, $MN$ cắt nhau tại trung điểm mỗi đường; mà $O = MN \cap AH$, suy ra $O$ là trung điểm $AH$.

Xét $\triangle ACH$: $O$ là trung điểm $AH$ nên $CO$ là đường trung tuyến kẻ từ $C$; $I$ là trung điểm $HC$ nên $AI$ là đường trung tuyến kẻ từ $A$. $D$ là giao điểm của hai đường trung tuyến $CO$, $AI$ nên $D$ chính là trọng tâm của $\triangle ACH$.

Theo tính chất trọng tâm, $D$ chia trung tuyến $AI$ theo tỉ số $AD = \dfrac{2}{3}AI$.

Mà $I$ là trung điểm $AK$ nên $AI = \dfrac{1}{2}AK$, suy ra $AD = \dfrac{2}{3} \cdot \dfrac{1}{2}AK = \dfrac{1}{3}AK$.

Vậy $AK = 3AD$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0027', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', 'a) Chứng minh tứ giác $AMIN$ là hình chữ nhật.
b) Tứ giác $MNCI$ là hình gì? Vì sao?
c) Gọi $G$ là giao điểm của $BN$ và $AI$. Chứng minh $BG = 2.GN$', NULL, 'a) Tứ giác $AMIN$ có $\widehat{MAN}=90^\circ$ (vì $\widehat{BAC}=90^\circ$), $\widehat{AMI}=90^\circ$ (vì $IM\perp AB$), $\widehat{ANI}=90^\circ$ (vì $IN\perp AC$). Tứ giác có ba góc vuông nên $AMIN$ là hình chữ nhật.

Mặt khác, vì $\widehat{BAC}=90^\circ$ nên $AC \perp AB$; kết hợp $IM \perp AB$ suy ra $IM \parallel AC$. Trong $\triangle ABC$, $I$ là trung điểm $BC$ và đường thẳng qua $I$ song song $AC$ cắt $AB$ tại $M$; theo định lí đường trung bình (chiều đảo), $M$ là trung điểm $AB$. Tương tự, $AB \perp AC$ và $IN \perp AC$ nên $IN \parallel AB$, suy ra $N$ là trung điểm $AC$.

b) $M$ là trung điểm $AB$, $N$ là trung điểm $AC$ (câu a) nên $MN$ là đường trung bình của $\triangle ABC$ ứng với cạnh $BC$, suy ra $MN \parallel BC$ và $MN = \dfrac{BC}{2}$.

$I$ là trung điểm $BC$ nên $IC = \dfrac{BC}{2}$, và $IC$ nằm trên đường thẳng $BC$ nên $MN \parallel IC$.

Ta có $MN \parallel IC$ và $MN = IC$ nên tứ giác $MNCI$ là hình bình hành (một cặp cạnh đối song song và bằng nhau).

c) $N$ là trung điểm $AC$ nên $BN$ là đường trung tuyến của $\triangle ABC$ kẻ từ $B$. $I$ là trung điểm $BC$ nên $AI$ là đường trung tuyến của $\triangle ABC$ kẻ từ $A$. $G$ là giao điểm của hai đường trung tuyến $BN$, $AI$ nên $G$ là trọng tâm của $\triangle ABC$.

Theo tính chất trọng tâm, $G$ chia trung tuyến $BN$ theo tỉ số $2:1$ kể từ đỉnh, tức $BG = 2GN$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0028', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', 'a) Chứng minh tứ giác $BDME$ là hình chữ nhật.
b) Lấy $F$ thuộc tia đối của tia $ME$ sao cho $MF = ME$ .
Chứng minh: $BE = EC$ và tứ giác $AFCE$ là hình bình hành.
c) Gọi $I,K$ lần lượt là giao điểm của $BM,BF$ với $AE$ . Chứng minh: $FC = 6IK$', NULL, 'a) Tứ giác $BDME$ có $\widehat{DBE}=90^\circ$ (vì $\widehat{ABC}=90^\circ$), $\widehat{BDM}=90^\circ$ (vì $MD\perp AB$), $\widehat{BEM}=90^\circ$ (vì $ME\perp BC$). Tứ giác có ba góc vuông nên $BDME$ là hình chữ nhật.

Vì $AB \perp BC$ và $MD \perp AB$ nên $MD \parallel BC$; trong $\triangle ABC$, $M$ là trung điểm $AC$ và đường thẳng qua $M$ song song $BC$ cắt $AB$ tại $D$, suy ra $D$ là trung điểm $AB$. Tương tự, $ME \parallel AB$ nên $E$ là trung điểm $BC$.

b) $E$ là trung điểm $BC$ (vừa chứng minh) nên $BE = EC$.

$F$ thuộc tia đối tia $ME$ với $MF = ME$ nên $M$ là trung điểm $EF$. Xét tứ giác $AFCE$: hai đường chéo $AC$, $FE$ cắt nhau tại $M$, và $M$ là trung điểm $AC$ (giả thiết) đồng thời là trung điểm $FE$ (vừa chứng minh), suy ra $AFCE$ là hình bình hành.

c) Từ hình bình hành $AFCE$: $AF \parallel CE$ và $AF = CE$. Mà $CE = BE$ (câu b) và $CE$ nằm trên đường thẳng $BC$, nên $AF \parallel BE$ và $AF = BE$.

Tứ giác $ABEF$ có $AF \parallel BE$ và $AF = BE$ nên là hình bình hành; lại có $\widehat{ABE} = \widehat{ABC} = 90^\circ$ nên $ABEF$ là hình chữ nhật.

Hình chữ nhật $ABEF$ có hai đường chéo $AE$, $BF$ bằng nhau và cắt nhau tại trung điểm mỗi đường; $K = BF \cap AE$ nên $K$ là trung điểm $AE$, và $BF = AE$.

Đường thẳng chứa $E, M, F$ vuông góc với $BC$ tại $E$, mà $E$ là trung điểm $BC$, nên đó là đường trung trực của $BC$; $F$ nằm trên đường trung trực này nên $FB = FC$. Kết hợp $BF = AE$, suy ra $FC = AE$.

Mặt khác, $BM$ là đường trung tuyến của $\triangle ABC$ kẻ từ $B$ (vì $M$ là trung điểm $AC$) và $AE$ là đường trung tuyến kẻ từ $A$ (vì $E$ là trung điểm $BC$); $I = BM \cap AE$ nên $I$ là trọng tâm $\triangle ABC$, suy ra $AI = \dfrac{2}{3}AE$.

Vì $K$ là trung điểm $AE$ nên $AK = \dfrac{1}{2}AE < AI$, do đó $K$ nằm giữa $A$ và $I$, suy ra $IK = AI - AK = \dfrac{2}{3}AE - \dfrac{1}{2}AE = \dfrac{1}{6}AE$.

Vậy $FC = AE = 6 \cdot \dfrac{1}{6}AE = 6\,IK$, tức $FC = 6IK$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0029', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', 'a) Chứng minh tứ giác ADME là hình chữ nhật.
b) Kẻ đường cao AH của tam giác ABC. Trên tia đối của tia HA lấy điểm I sao cho HI = HA; trên tia đối của tia HB lấy điểm K sao cho HK = HB. Chứng minh tứ giác ABIK là hình thoi và từ đó suy ra $\widehat{MAB} = \widehat{IKB}$
c) Chứng minh AK $\perp$ IC.', NULL, '**a)** Vì $\triangle ABC$ vuông tại $A$ nên $\widehat{DAE}=\widehat{BAC}=90^\circ$. Lại có $MD\perp AB$ nên $\widehat{ADM}=90^\circ$, và $ME\perp AC$ nên $\widehat{AEM}=90^\circ$. Tứ giác $ADME$ có $3$ góc vuông nên $ADME$ là hình chữ nhật.

**b)** Vì $MD\perp AB$ và $AC\perp AB$ nên $MD\parallel AC$; trong $\triangle ABC$, $M$ là trung điểm $BC$ nên theo định lí đường trung bình, $D$ là trung điểm $AB$.

Vì $\triangle ABC$ vuông tại $A$ và $M$ là trung điểm cạnh huyền $BC$ nên $MA=MB=\dfrac{BC}{2}$, suy ra $\triangle MAB$ cân tại $M$, do đó $\widehat{MAB}=\widehat{ABC}$ (1).

Xét tứ giác $ABIK$: theo giả thiết $HI=HA$ nên $H$ là trung điểm $AI$; $HK=HB$ nên $H$ cũng là trung điểm $BK$. Hai đường chéo $AI,BK$ cắt nhau tại trung điểm $H$ của mỗi đường nên $ABIK$ là hình bình hành. Mặt khác $AI$ nằm trên đường cao $AH$ (vuông góc $BC$) còn $BK$ nằm trên $BC$, nên $AI\perp BK$; hình bình hành có hai đường chéo vuông góc là hình thoi, vậy $ABIK$ là hình thoi.

Vì $K\in BC$ nên $\widehat{ABK}=\widehat{ABC}$ (2). Trong hình thoi $ABIK$, $AB=AK$ nên $\triangle ABK$ cân tại $A$, suy ra $\widehat{AKB}=\widehat{ABK}$ (3). Đường chéo $BK$ của hình thoi chia đôi góc $\widehat{AKI}$ nên $\widehat{AKB}=\widehat{IKB}$ (4).

Từ (1),(2),(3),(4): $\widehat{MAB}=\widehat{ABC}=\widehat{ABK}=\widehat{AKB}=\widehat{IKB}$, vậy $\widehat{MAB}=\widehat{IKB}$.

**c)** Chọn hệ trục $Hxy$ với gốc $H$, trục $Hx$ là đường thẳng $BC$, trục $Hy$ là đường thẳng $AH$ (do $AH\perp BC$). Đặt $HB=p, HC=q, AH=a$ ($p,q,a>0$): $B=(-p;0), C=(q;0), A=(0;a)$.

Vì $H$ là trung điểm $AI$ nên $I=(0;-a)$; vì $H$ là trung điểm $BK$ nên $K=(p;0)$.

$\overrightarrow{AK}=(p;-a)$, $\overrightarrow{IC}=(q;a)$, suy ra $\overrightarrow{AK}\cdot\overrightarrow{IC}=pq-a^2$.

Trong tam giác vuông $ABC$ (vuông tại $A$) với đường cao $AH$: $\triangle HAB\sim\triangle HCA$ (cùng vuông, $\widehat{HAB}=\widehat{HCA}$ vì cùng phụ với $\widehat{HAC}$), suy ra $\dfrac{HA}{HC}=\dfrac{HB}{HA}$, tức $a^2=HA^2=HB\cdot HC=pq$.

Do đó $\overrightarrow{AK}\cdot\overrightarrow{IC}=pq-a^2=0$, suy ra $AK\perp IC$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0030', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', 'a) Chứng minh: Tứ giác AMHN là hình chữ nhật.
b) Gọi K là trung điểm của HC. Trên tia AK lấy điểm E sao cho K là trung điểm của AE. Chứng minh: $HE = AC$.
c) Gọi P là giao điểm của AH và MN, Q là giao điểm của CP và AE.
Chứng minh: $AE = 3AQ$.', NULL, '**a)** $\triangle ABC$ vuông tại $A$ nên $\widehat{MAN}=\widehat{BAC}=90^\circ$; $HM\perp AB$ nên $\widehat{AMH}=90^\circ$; $HN\perp AC$ nên $\widehat{ANH}=90^\circ$. Tứ giác $AMHN$ có $3$ góc vuông nên là hình chữ nhật.

**b)** Theo giả thiết, $K$ là trung điểm $HC$ và cũng là trung điểm $AE$. Xét tứ giác $AHEC$: hai đường chéo $AE$ và $HC$ cắt nhau tại trung điểm $K$ của mỗi đường, nên $AHEC$ là hình bình hành. Do đó hai cạnh đối $HE$ và $AC$ bằng nhau: $HE=AC$.

**c)** Vì $AMHN$ là hình chữ nhật nên hai đường chéo $AH,MN$ cắt nhau tại trung điểm mỗi đường, tức $P$ là trung điểm $AH$.

Chọn $A$ làm gốc vectơ, đặt $\vec h=\overrightarrow{AH}$, $\vec c=\overrightarrow{AC}$. Theo câu b), $AHEC$ là hình bình hành nên $\overrightarrow{AE}=\overrightarrow{AH}+\overrightarrow{AC}=\vec h+\vec c$; và $\overrightarrow{AP}=\dfrac12\vec h$.

Đặt $\overrightarrow{AQ}=t\cdot\overrightarrow{AE}=t(\vec h+\vec c)$ (do $Q\in AE$). Vì $Q\in CP$ nên $\overrightarrow{AQ}=\overrightarrow{AC}+s\cdot\overrightarrow{CP}=\vec c+s\left(\dfrac12\vec h-\vec c\right)$ với $s\in[0;1]$.

So sánh hệ số của $\vec h,\vec c$ (hai vectơ không cùng phương vì $A,H,C$ không thẳng hàng): $t=\dfrac{s}{2}$ (hệ số $\vec h$), $t=1-s$ (hệ số $\vec c$).

Giải hệ: $\dfrac{s}{2}=1-s\Rightarrow s=\dfrac{2}{3}\Rightarrow t=\dfrac{1}{3}$.

Vậy $\overrightarrow{AQ}=\dfrac13\overrightarrow{AE}$, suy ra $AE=3AQ$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0031', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', 'a) Chứng minh: tứ giác AKMH là hình chữ nhật ;
b) Gọi I là giao điểm của AM và HK. Từ I kẻ đường thẳng song song với AC, cắt BC tại D. Chứng
minh: D là trung điểm của MC. Tứ giác AIDH là hình gì? Tại sao?
c) Từ K kẻ $KF \perp HD$ tại F. Kéo dài AF cắt MH tại N. Chứng minh: AM là phân giác $\widehat{NAB}$.', NULL, '**a)** $\triangle ABC$ vuông tại $A$ nên $\widehat{KAH}=\widehat{BAC}=90^\circ$; $MK\perp AB$ nên $\widehat{AKM}=90^\circ$; $MH\perp AC$ nên $\widehat{AHM}=90^\circ$. Tứ giác $AKMH$ có $3$ góc vuông nên là hình chữ nhật.

(Nhận xét: vì $MK\perp AB, AC\perp AB\Rightarrow MK\parallel AC$; $M$ là trung điểm $BC$ nên $K$ là trung điểm $AB$. Tương tự $H$ là trung điểm $AC$ — dùng ở câu sau.)

**b)** $I$ là giao điểm hai đường chéo $AM,HK$ của hình chữ nhật $AKMH$ nên $I$ là trung điểm $AM$.

Trong $\triangle AMC$, $I$ là trung điểm cạnh $AM$, đường thẳng qua $I$ song song với $AC$ cắt cạnh $MC$ tại $D$, theo định lí đường trung bình, $D$ là trung điểm $MC$.

Xét tứ giác $AIDH$: $ID$ là đường trung bình của $\triangle AMC$ ứng với cạnh $AC$ nên $ID\parallel AC$ và $ID=\dfrac{AC}{2}$. Mặt khác $H$ là trung điểm $AC$ (theo nhận xét câu a) nên $AH=\dfrac{AC}{2}$. Vậy $ID\parallel AH$ và $ID=AH$: tứ giác $AIDH$ có một cặp cạnh đối vừa song song vừa bằng nhau nên $AIDH$ là hình bình hành.

**c)** Chọn hệ trục $Axy$, gốc $A$, $AB\subset Ox$, $AC\subset Oy$ (do $\widehat A=90^\circ$). Đặt $AB=2p,AC=2q$ ($p,q>0$): $K=(p;0)$ (trung điểm $AB$), $H=(0;q)$ (trung điểm $AC$), $M=(p;q)$.

$I=$ trung điểm $AM=\left(\dfrac p2;\dfrac q2\right)$, $D=$ trung điểm $MC=\left(\dfrac p2;\dfrac{3q}2\right)$.

Đường thẳng $HD$ có vectơ chỉ phương $\overrightarrow{HD}=\left(\dfrac p2;\dfrac q2\right)$, cùng phương $(p;q)$ — tức cùng phương với $AM$. Tham số hoá $HD:(tp;\,q+tq)$; điều kiện $\overrightarrow{KF}\perp\overrightarrow{HD}$ với $K=(p;0)$ cho $t=\dfrac{p^2-q^2}{p^2+q^2}\ \Rightarrow\ F=\left(\dfrac{p(p^2-q^2)}{p^2+q^2};\ \dfrac{2p^2q}{p^2+q^2}\right)$.

Đường thẳng $AF$ có vectơ chỉ phương cùng phương với $(p^2-q^2;\,2pq)$. Đường thẳng $MH$ (kéo dài) là đường $y=q$; giao điểm $N=AF\cap MH$ ứng với tham số $s=\dfrac{1}{2p}$ trong $\big(s(p^2-q^2);\,2spq\big)$, cho $N=\left(\dfrac{p^2-q^2}{2p};\ q\right)$.

Gọi $\theta=\widehat{MAB}$ (góc giữa $AM$ và tia $AB\equiv Ox$): $\tan\theta=\dfrac{q}{p}$. Gọi $\varphi$ là góc giữa $AN$ và $Ox$: $\tan\varphi=\dfrac{q}{\frac{p^2-q^2}{2p}}=\dfrac{2pq}{p^2-q^2}=\dfrac{2\tan\theta}{1-\tan^2\theta}=\tan 2\theta$.

Suy ra $\varphi=2\theta$, tức $\widehat{NAB}=2\widehat{MAB}$; vì $0<\theta<\varphi$ (tia $AM,AN$ cùng phía trên $Ox$) nên tia $AM$ nằm giữa hai tia $AB,AN$. Vậy $AM$ là tia phân giác của $\widehat{NAB}$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0032', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', 'a) Cho $AB=6$ cm, $AC=8$ cm. Tính độ dài cạnh $BC$.
b) Kẻ $HM \perp AB, HN \perp AC,(M \in AB,N \in AC)$. Chứng minh tứ giác $AMHN$ là hình chữ nhật và $AH = MN$.
c) Lấy điểm $D$ trên tia $BM$ sao cho $M$ là trung điểm của $DB$, lấy điểm $E$ trên tia $HM$ sao cho $M$ là trung điểm của $HE$. Chứng minh tứ giác $HBED$ là hình thoi và $HD \perp AE$.', NULL, '**a)** $BC=\sqrt{AB^2+AC^2}=\sqrt{6^2+8^2}=\sqrt{100}=10$ (cm).

**b)** $\triangle ABC$ vuông tại $A$ nên $\widehat{MAN}=\widehat{BAC}=90^\circ$; $HM\perp AB$ nên $\widehat{AMH}=90^\circ$; $HN\perp AC$ nên $\widehat{ANH}=90^\circ$. Tứ giác $AMHN$ có $3$ góc vuông nên là hình chữ nhật, suy ra hai đường chéo bằng nhau: $AH=MN$.

**c)** $M$ là trung điểm $DB$ (giả thiết) và cũng là trung điểm $HE$ (giả thiết) nên tứ giác $HBED$ có hai đường chéo $HE,BD$ cắt nhau tại trung điểm $M$ của mỗi đường, vậy $HBED$ là hình bình hành. Vì $HM\perp AB$ và $BM\subset AB$ nên $HM\perp BM$, tức hai đường chéo $HE,BD$ vuông góc; hình bình hành có hai đường chéo vuông góc là hình thoi, vậy $HBED$ là hình thoi.

Chọn hệ trục $Axy$, gốc $A$, $AB\subset Ox$, $AC\subset Oy$, $B=(b;0)$. Gọi $H=(h_1;h_2)$ là chân đường cao từ $A$; vì $M$ là hình chiếu của $H$ lên $AB$ nên $M=(h_1;0)$. Theo giả thiết $D=2M-B=(2h_1-b;0)$, $E=2M-H=(h_1;-h_2)$.

$\overrightarrow{HD}=(h_1-b;-h_2)$, $\overrightarrow{AE}=(h_1;-h_2)$, suy ra $\overrightarrow{HD}\cdot\overrightarrow{AE}=h_1(h_1-b)+h_2^2=(h_1^2+h_2^2)-b\,h_1=AH^2-b\cdot AM$.

Trong tam giác vuông $ABH$ (vuông tại $H$ vì $AH\perp BC$), $HM$ là đường cao ứng với cạnh huyền $AB$, nên theo hệ thức lượng $AH^2=AM\cdot AB=AM\cdot b$.

Do đó $\overrightarrow{HD}\cdot\overrightarrow{AE}=AH^2-b\cdot AM=0$, suy ra $HD\perp AE$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0033', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', 'a) Chứng minh tứ giác $AEHF$ là hình chữ nhật và $OH = OF$.
b) Kẻ $FD \perp BC$ tại $D$. Chứng minh $CF \cdot CH = CA \cdot CD$ và $FH$ là tia phân giác của $\widehat{EFD}$.
c) Kẻ $DK \perp AB$ tại $K$. Chứng minh $BF \perp KH$.', NULL, '**a)** $\triangle ABC$ vuông tại $A$ nên $\widehat{EAF}=90^\circ$; $HE\perp AB$ nên $\widehat{AEH}=90^\circ$; $HF\perp AC$ nên $\widehat{AFH}=90^\circ$. Tứ giác $AEHF$ có $3$ góc vuông nên là hình chữ nhật.

$O$ là giao điểm hai đường chéo $AH,EF$ nên $O$ là trung điểm của mỗi đường; hình chữ nhật có hai đường chéo bằng nhau nên $OA=OE=OH=OF$, đặc biệt $OH=OF$.

**b)** Vì $AH\perp BC$ (đường cao) nên $\widehat{AHC}=90^\circ$; $HF\perp AC$ chính là đường cao của $\triangle AHC$ (vuông tại $H$) ứng với cạnh huyền $AC$, theo hệ thức lượng: $CH^2=CF\cdot CA$ (1).

Vì $F\in AC$ và $HF\perp AC$ nên $\widehat{HFC}=90^\circ$; $FD\perp BC$ chính là đường cao của $\triangle HFC$ (vuông tại $F$) ứng với cạnh huyền $HC$, theo hệ thức lượng: $CF^2=CD\cdot CH$ (2).

Từ (2): $CD=\dfrac{CF^2}{CH}$, suy ra $CA\cdot CD=CA\cdot\dfrac{CF^2}{CH}=\dfrac{(CA\cdot CF)\cdot CF}{CH}=\dfrac{CH^2\cdot CF}{CH}=CH\cdot CF$ (dùng (1): $CA\cdot CF=CH^2$). Vậy $CF\cdot CH=CA\cdot CD$.

Về góc: $\triangle AFH$ (vuông tại $F$) và $\triangle AHC$ (vuông tại $H$) có chung $\widehat A$ nên $\triangle AFH\sim\triangle AHC$, suy ra $\widehat{AHF}=\widehat{ACH}=\widehat{ACB}$. Vì $O\in AH$ nên $\widehat{OHF}=\widehat{AHF}=\widehat{ACB}$; $\triangle OHF$ cân tại $O$ (do $OH=OF$) nên $\widehat{OFH}=\widehat{OHF}=\widehat{ACB}$, mà $O\in EF$ nên $\widehat{OFH}=\widehat{EFH}$, vậy $\widehat{EFH}=\widehat{ACB}$ (3).

$\triangle HFC$ vuông tại $F$ có $FD$ là đường cao ứng cạnh huyền $HC$ nên $\triangle HDF\sim\triangle HFC$, suy ra $\widehat{HFD}=\widehat{HCF}=\widehat{ACB}$, vậy $\widehat{HFD}=\widehat{ACB}$ (4).

Từ (3),(4): $\widehat{EFH}=\widehat{HFD}$, suy ra $FH$ là tia phân giác của $\widehat{EFD}$.

**c)** Chọn hệ trục $Axy$, gốc $A$, $AB\subset Ox$, $AC\subset Oy$, $B=(b;0),C=(0;c)$. Chân đường cao $H=(h_1;h_2)$ với $h_1=\dfrac{bc^2}{S}, h_2=\dfrac{cb^2}{S}$ ($S=b^2+c^2$, công thức chân đường cao trong tam giác vuông). Vì $HE\perp AB,HF\perp AC$ nên $E=(h_1;0), F=(0;h_2)$.

Tính hình chiếu $D$ của $F$ lên $BC$ rồi hình chiếu $K$ của $D$ lên $AB$ (nên $K$ có cùng hoành độ với $D$), ta được $D_x=\dfrac{bc^4}{S^2}$, và $h_1-D_x=\dfrac{bc^2}{S}-\dfrac{bc^4}{S^2}=\dfrac{bc^2(S-c^2)}{S^2}=\dfrac{b^3c^2}{S^2}$.

Khi đó $\overrightarrow{BF}=(-b;h_2)=\left(-b;\dfrac{cb^2}{S}\right)$ và $\overrightarrow{KH}=(h_1-D_x;h_2)=\left(\dfrac{b^3c^2}{S^2};\dfrac{cb^2}{S}\right)$, suy ra $\overrightarrow{BF}\cdot\overrightarrow{KH}=-b\cdot\dfrac{b^3c^2}{S^2}+\dfrac{cb^2}{S}\cdot\dfrac{cb^2}{S}=-\dfrac{b^4c^2}{S^2}+\dfrac{b^4c^2}{S^2}=0$.

Vậy $BF\perp KH$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0034', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', 'a) Tứ giác $ABEM$ là hình gì? Vì sao?
b) Gọi $N$ là giao điểm của $EM$ và $AC$. Chứng minh $M$ là trực tâm của $\triangle AEC$.
c) Lấy $F$ là trung điểm của $MC$. Chứng minh $HF^2 = HN^2 + NF^2$.', NULL, 'a) Tứ giác $ABEM$ là hình gì? Vì sao?

- $H$ là trung điểm của $BM$ (giả thiết).
- Vì $E$ thuộc tia đối của tia $HA$ và $HE = AH$ nên $A$, $H$, $E$ thẳng hàng và $H$ là trung điểm của $AE$.
- Hai đường chéo $AE$ và $BM$ của tứ giác $ABEM$ cùng nhận $H$ làm trung điểm, suy ra $ABEM$ là hình bình hành.
- $AH$ là đường cao của $\triangle ABC$ nên $AH \perp BC$; vì $B, H, M$ thẳng hàng ($M \in BC$) nên $AE \perp BM$ tại $H$.
- Hình bình hành có hai đường chéo vuông góc là hình thoi. Vậy $ABEM$ là hình thoi.

b) Chứng minh $M$ là trực tâm của $\triangle AEC$.

- Theo câu a), $ABEM$ là hình bình hành nên $EM \parallel AB$.
- $\triangle ABC$ vuông tại $A$ nên $AB \perp AC$, suy ra $EM \perp AC$. Vì $N = EM \cap AC$ nên đường thẳng $EM$ là đường cao kẻ từ đỉnh $E$ của $\triangle AEC$, và $M$ nằm trên đường thẳng này.
- $A, H, E$ thẳng hàng và $AH \perp BC$ tại $H$ nên đường thẳng $AE$ vuông góc với đường thẳng $BC$ tại $H$. Vì $C, M$ đều thuộc đường thẳng $BC$ nên đường thẳng $BC$ (chứa $CM$) là đường cao kẻ từ đỉnh $C$ của $\triangle AEC$, và $M$ nằm trên đường thẳng này.
- $M$ nằm trên hai đường cao (kẻ từ $E$ và từ $C$) của $\triangle AEC$ nên $M$ là trực tâm của $\triangle AEC$.

c) Chứng minh $HF^2 = HN^2 + NF^2$ với $F$ là trung điểm $MC$.

Ta chứng minh $HN \perp NF$, khi đó $\triangle HNF$ vuông tại $N$ và định lý Pythagore cho ngay đpcm.

Chọn hệ trục tọa độ gốc $H$, trục $Ox$ trùng đường thẳng $BC$, trục $Oy$ trùng đường thẳng $AH$. Đặt $HB=p$, $HC=q$, $AH=h$ (do $H$ nằm giữa $B,C$): $B(-p;0)$, $C(q;0)$, $A(0;h)$.

Vì $H$ là trung điểm $BM$: $M(p;0)$. Vì $H$ là trung điểm $AE$: $E(0;-h)$.

Giao điểm $N$ của đường thẳng $AC$ và đường thẳng $EM$: $N = \left(\dfrac{2pq}{p+q}; \dfrac{h(q-p)}{p+q}\right)$.

$F$ là trung điểm $MC$: $F = \left(\dfrac{p+q}{2}; 0\right)$.

$\overrightarrow{HN} = \left(\dfrac{2pq}{p+q}; \dfrac{h(q-p)}{p+q}\right)$, $\overrightarrow{NF} = \left(\dfrac{(p-q)^2}{2(p+q)}; \dfrac{h(p-q)}{p+q}\right)$.

$\overrightarrow{HN} \cdot \overrightarrow{NF} = \dfrac{(p-q)^2}{(p+q)^2}\left(pq-h^2\right)$.

Theo hệ thức lượng trong tam giác vuông $ABC$ (đường cao $AH$ ứng cạnh huyền $BC$): $AH^2 = HB \cdot HC$, tức $h^2=pq$. Do đó $\overrightarrow{HN} \cdot \overrightarrow{NF}=0$, nghĩa là $HN \perp NF$.

Vậy $\triangle HNF$ vuông tại $N$, áp dụng định lý Pythagore: $HF^2 = HN^2 + NF^2$ (đpcm).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0035', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', 'a) Chứng minh tứ giác $BDME$ là hình chữ nhật.
b) Chứng minh: $MA = MB = MC$. Lấy điểm $F$ thuộc tia đối tia $ME$ sao cho $MF = ME$. Chứng minh: tứ giác $AFCE$ là hình bình hành.
c) Gọi $I$, $K$ lần lượt là giao điểm của $BM$, $BF$ với $AE$. Tính $\frac{IK}{FC}$?', NULL, 'a) Chứng minh tứ giác $BDME$ là hình chữ nhật.

$MD \perp AB$ tại $D$, $ME \perp BC$ tại $E$, và $\triangle ABC$ vuông tại $B$ nên $AB \perp BC$. Tứ giác $BDME$ có $\widehat{B} = \widehat{D} = \widehat{E} = 90°$ (ba góc vuông) nên là hình chữ nhật.

b) Chứng minh $MA=MB=MC$ và tứ giác $AFCE$ là hình bình hành.

$M$ là trung điểm cạnh huyền $AC$ của tam giác vuông $ABC$ (vuông tại $B$), theo tính chất đường trung tuyến ứng với cạnh huyền: $MB = \dfrac{AC}{2} = MA = MC$.

$F$ thuộc tia đối tia $ME$ và $MF=ME$ nên $M$ là trung điểm của $EF$; mặt khác $M$ là trung điểm của $AC$ (giả thiết). Hai đường chéo $AC$ và $EF$ của tứ giác $AFCE$ cùng nhận $M$ làm trung điểm, suy ra $AFCE$ là hình bình hành.

c) Tính $\dfrac{IK}{FC}$.

Chọn hệ trục: $B(0;0)$, $A(0;a)$, $C(c;0)$ với $a=BA$, $c=BC$. Khi đó $M\left(\dfrac{c}{2};\dfrac{a}{2}\right)$, $E\left(\dfrac{c}{2};0\right)$, $F\left(\dfrac{c}{2};a\right)$.

Đường thẳng $AE$: $x=\dfrac{c}{2}t,\ y=a(1-t)$. Đường thẳng $BM$: $y=\dfrac{a}{c}x$; đường thẳng $BF$: $y=\dfrac{2a}{c}x$.

Giải hệ được $I = BM \cap AE = \left(\dfrac{c}{3};\dfrac{a}{3}\right)$ và $K = BF \cap AE = \left(\dfrac{c}{4};\dfrac{a}{2}\right)$.

$IK = \sqrt{\left(\dfrac{c}{3}-\dfrac{c}{4}\right)^2+\left(\dfrac{a}{3}-\dfrac{a}{2}\right)^2} = \dfrac{\sqrt{c^2+4a^2}}{12}$; $FC = \sqrt{\left(\dfrac{c}{2}\right)^2+a^2} = \dfrac{\sqrt{c^2+4a^2}}{2}$.

Vậy $\dfrac{IK}{FC} = \dfrac{1}{6}$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0036', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', 'a) Chứng minh $MN \parallel AC$.
b) Chứng minh tứ giác $AMNP$ là hình vuông.
c) Đường phân giác $BE$ của tam giác $ABC$ cắt đường thẳng $AN$ tại $I$.
Chứng minh $CE = 2NI$.', NULL, 'a) $M$ là trung điểm $AB$, $N$ là trung điểm $BC$ nên $MN$ là đường trung bình của $\triangle ABC$ ứng với cạnh $AC$, suy ra $MN \parallel AC$.

b) $P$ là trung điểm $AC$ nên $AP = \dfrac{AC}{2} = MN$ (câu a, vì $MN=\dfrac{AC}{2}$ theo tính chất đường trung bình). Theo câu a), $MN \parallel AC$ tức $MN \parallel AP$. Tứ giác $AMNP$ có $MN \parallel AP$ và $MN = AP$ nên là hình bình hành.

Vì $\triangle ABC$ vuông cân tại $A$ nên $AB = AC$, suy ra $AM = \dfrac{AB}{2} = \dfrac{AC}{2} = AP$; hình bình hành $AMNP$ có hai cạnh kề $AM = AP$ nên là hình thoi. Lại có $\widehat{MAP} = \widehat{BAC} = 90°$ nên hình thoi $AMNP$ có một góc vuông, vậy $AMNP$ là hình vuông.

c) Đặt $AB = AC = a$. Vì $N$ là trung điểm cạnh huyền $BC$ của tam giác vuông $ABC$ (vuông tại $A$) nên $NA = NB = NC = \dfrac{BC}{2}$; vì thêm $AB = AC$ nên $\triangle ABC$ cân tại $A$, do đó trung tuyến $AN$ đồng thời là đường cao: $AN \perp BC$.

Theo Pythagore, $BC = a\sqrt2$, nên $AN = BN = \dfrac{BC}{2} = \dfrac{a}{\sqrt2}$.

Trong tam giác vuông $ABN$ (vuông tại $N$), $I = AN \cap BE$ với $BE$ là phân giác $\widehat{ABN}$ (chính là $\widehat{ABC}$, vì $N \in$ tia $BC$); theo tính chất đường phân giác trong $\triangle ABN$: $\dfrac{IA}{IN} = \dfrac{BA}{BN} = \dfrac{a}{a/\sqrt2} = \sqrt2$.

Vì $IA + IN = AN = \dfrac{a}{\sqrt2}$ nên $IN(\sqrt2 + 1) = \dfrac{a}{\sqrt2}$, suy ra $IN = \dfrac{a}{\sqrt2(\sqrt2+1)} = \dfrac{a}{2+\sqrt2} = \dfrac{a(2-\sqrt2)}{2}$.

Trong $\triangle ABC$, $BE$ là phân giác $\widehat{ABC}$ ($E \in AC$), theo tính chất đường phân giác: $\dfrac{EA}{EC} = \dfrac{BA}{BC} = \dfrac{a}{a\sqrt2} = \dfrac{1}{\sqrt2}$.

Vì $EA + EC = AC = a$ và $EA = \dfrac{EC}{\sqrt2}$ nên $EC(1+\sqrt2) = a\sqrt2$, suy ra $EC = \dfrac{a\sqrt2}{1+\sqrt2} = a\sqrt2(\sqrt2-1) = a(2-\sqrt2)$.

So sánh: $EC = a(2-\sqrt2) = 2 \cdot \dfrac{a(2-\sqrt2)}{2} = 2\cdot IN$. Vậy $CE = 2NI$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0037', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', 'a) Chứng minh rằng tứ giác ACBE là hình bình hành;
b) Chứng minh rằng $\triangle EBD$ cân tại B;
c) Kẻ AP vuông góc với EB tại P và kẻ BQ vuông góc với AC tại Q. Gọi O là trung điểm của AB. Chứng minh rằng ba điểm P, O, Q thẳng hàng;
d) Vẽ đường thẳng DH vuông góc với AC tại H; đường thẳng DH cắt AB và EB lần lượt tại F và K. Đường thẳng CK cắt AB tại M. Chứng minh rằng M là trung điểm của FB.', NULL, 'a) Vì $xy$ đi qua $B$ và song song $AC$, $E$ là giao điểm của $xy$ với đường thẳng $AD$, nên $BE \parallel AC$.

$ABCD$ là hình chữ nhật nên $AD \parallel BC$; vì $E \in$ đường thẳng $AD$ nên $AE \parallel BC$.

Tứ giác $ACBE$ có $AC \parallel BE$ (giả thiết) và $CB \parallel EA$ (vừa chứng minh) — hai cặp cạnh đối song song — nên $ACBE$ là hình bình hành.

b) Hình bình hành $ACBE$ (câu a) có $BE = AC$ (cạnh đối). $ABCD$ là hình chữ nhật nên hai đường chéo bằng nhau: $BD = AC$. Vậy $BE = AC = BD$, suy ra $BE = BD$, tức $\triangle EBD$ cân tại $B$.

c), d) Chọn hệ trục $Oxy$ với $A(0;0)$, $B(w;0)$, $C(w;h)$, $D(0;h)$ ($w = AB > h = BC$ theo giả thiết). Đường thẳng qua $B$ song song $AC$ cắt đường thẳng $AD$ (trục $Oy$) tại $E(0;-h)$.

c) $P$ là hình chiếu của $A$ trên đường thẳng $EB$, $Q$ là hình chiếu của $B$ trên đường thẳng $AC$. Vì $EB \parallel AC$ nên $AP \parallel BQ$ (cùng vuông góc một phương chung $\vec u$ của $AC, EB$). Với $k = \dfrac{(A-B)\cdot \vec u}{|\vec u|^2}$, ta có $P = B + k\vec u$ và $Q = A - k\vec u$, suy ra $P + Q = A + B$. Vậy trung điểm của $PQ$ trùng trung điểm của $AB$, tức là $O$; do đó $P, O, Q$ thẳng hàng.

Kiểm tra bằng tọa độ cụ thể ($w=4,h=2$): $P=(0.8;-1.6)$, $Q=(3.2;1.6)$, $O=(2;0)$, đúng là trung điểm $PQ$.

d) Đường thẳng $AC$ có phương $(w;h)$. $H$ là hình chiếu của $D(0;h)$ lên $AC$: $H = \left(\dfrac{h^2w}{w^2+h^2}; \dfrac{h^3}{w^2+h^2}\right)$, nên đường thẳng $DH$ có phương $(h;-w)$.

$F = DH \cap AB$ (đường thẳng $AB$: $y=0$): giải ra $F = \left(\dfrac{h^2}{w}; 0\right)$.

$K = DH \cap EB$: giải hệ hai phương trình đường thẳng, được $K = \left(\dfrac{2h^2w}{w^2+h^2}; \dfrac{h(h^2-w^2)}{w^2+h^2}\right)$.

$M = CK \cap AB$: đường thẳng $CK$ (qua $C(w;h)$) có phương $(h^2-w^2; -2hw)$, giải với $y=0$ được $M = \left(\dfrac{w^2+h^2}{2w}; 0\right)$.

Trung điểm $FB = \left(\dfrac{1}{2}\left(\dfrac{h^2}{w}+w\right); 0\right) = \left(\dfrac{w^2+h^2}{2w}; 0\right) = M$.

Vậy $M$ là trung điểm $FB$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0038', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', 'a) Giả sử: $AB = 2,4cm, AC = 3,2cm, BC = 3,5cm$. Tính độ dài đoạn thẳng BM và MC.
b) Lấy điểm $N$ là trung điểm của đoạn thẳng $AC$. Trên tia $MN$ lấy điểm $P$ sao cho $N$ là trung điểm $MP$. Chứng minh: Tứ giác $APCM$ là hình bình hành.
c) Qua $N$ kẻ đường thẳng $d$ song song $AP$ cắt $AB$ tại $K$. Gọi $Q$ là trung điểm $AM$
Chứng minh rằng: K là trung điểm của $AB$ và ba điểm $N,K,Q$ thẳng hàng.
d) Chứng minh rằng: $KQ.MC = MB.QN$', NULL, 'a) Theo tính chất đường phân giác trong tam giác: $\dfrac{BM}{MC} = \dfrac{AB}{AC} = \dfrac{2,4}{3,2} = \dfrac{3}{4}$.

Mà $BM + MC = BC = 3,5$ cm nên $BM = \dfrac{3}{7} \times 3,5 = 1,5$ cm và $MC = \dfrac{4}{7} \times 3,5 = 2$ cm.

b) $N$ là trung điểm $AC$ (giả thiết) và cũng là trung điểm $MP$ (giả thiết $N$ là trung điểm $MP$). Tứ giác $APCM$ có hai đường chéo $AC$ và $PM$ cắt nhau tại $N$, cùng nhận $N$ làm trung điểm, suy ra $APCM$ là hình bình hành.

c) Vì $APCM$ là hình bình hành nên $AP \parallel MC$; mà $M, C \in BC$ nên $AP \parallel BC$. Theo cách dựng, $d$ đi qua $N$ và $d \parallel AP$, suy ra $d \parallel BC$.

Trong $\triangle ABC$, $N$ là trung điểm $AC$ và đường thẳng $d$ qua $N$ song song $BC$ cắt $AB$ tại $K$; theo định lí đường trung bình (chiều đảo), $K$ là trung điểm $AB$.

Xét $\triangle ABM$: $K$ là trung điểm $AB$, $Q$ là trung điểm $AM$ (giả thiết) nên $KQ$ là đường trung bình của $\triangle ABM$, suy ra $KQ \parallel BM$ và $KQ = \dfrac{BM}{2}$.

Xét $\triangle ACM$: $N$ là trung điểm $AC$, $Q$ là trung điểm $AM$ nên $NQ$ là đường trung bình của $\triangle ACM$, suy ra $NQ \parallel CM$ và $NQ = \dfrac{CM}{2}$.

Vì $BM$, $CM$ cùng nằm trên đường thẳng $BC$ nên $KQ \parallel BC$ và $NQ \parallel BC$; hai đường thẳng $KQ$, $NQ$ cùng đi qua $Q$ và cùng song song $BC$ nên trùng nhau, suy ra $K, Q, N$ thẳng hàng.

d) Từ câu c: $KQ = \dfrac{MB}{2}$ và $QN = \dfrac{MC}{2}$.

Suy ra $KQ \cdot MC = \dfrac{MB}{2} \cdot MC = \dfrac{MB \cdot MC}{2}$ và $MB \cdot QN = MB \cdot \dfrac{MC}{2} = \dfrac{MB \cdot MC}{2}$.

Vậy $KQ \cdot MC = MB \cdot QN$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0039', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', 'a) Chứng minh tứ giác $AHCD$ là hình chữ nhật.
b) Chứng minh tứ giác $ABHD$ là hình bình hành.
c) Gọi $I$ là trung điểm của $AC$, $E$ là điểm đối xứng của $A$ qua $D$. Chứng minh $I$ là
trung điểm của $BE$.', NULL, 'a) Vì $AH \perp BC$ nên $\widehat{AHC} = 90^\circ$.
Vì $CD \perp BC$ ($d''$ qua $C$ vuông góc $BC$) nên $\widehat{HCD} = 90^\circ$.
Vì $AD \perp AH$ ($d$ qua $A$ vuông góc $AH$) nên $\widehat{HAD} = 90^\circ$.
Tứ giác $AHCD$ có ba góc vuông $\widehat{AHC} = \widehat{HCD} = \widehat{HAD} = 90^\circ$ nên $AHCD$ là hình chữ nhật.

b) Vì tam giác $ABC$ cân tại $A$ và $AH \perp BC$ nên $AH$ vừa là đường cao vừa là đường trung tuyến, suy ra $H$ là trung điểm $BC$, tức $BH = HC$.
Vì $AHCD$ là hình chữ nhật (câu a) nên $AD = HC$ (hai cạnh đối) và $AD \parallel HC$, mà $HC$ nằm trên đường thẳng $BC$ nên $AD \parallel BC$.
Suy ra $AD = BH$ và $AD \parallel BH$ (vì $BH$ cũng nằm trên $BC$), nên tứ giác $ABHD$ có một cặp cạnh đối $AD, BH$ song song và bằng nhau, do đó $ABHD$ là hình bình hành.

c) Vì $AHCD$ là hình chữ nhật nên hai đường chéo $AC$ và $HD$ cắt nhau tại trung điểm mỗi đường, suy ra trung điểm của $HD$ chính là trung điểm của $AC$, tức $I$ cũng là trung điểm của $HD$.
Vì $ABHD$ là hình bình hành (câu b) nên $BH = AD$ và $BH \parallel AD$.
Vì $E$ đối xứng với $A$ qua $D$ nên $D$ là trung điểm $AE$, suy ra $DE = AD$ và $D, A, E$ thẳng hàng nên $DE \parallel AD$, tức $DE \parallel BH$.
Từ đó $BH = DE$ và $BH \parallel DE$, nên tứ giác $BHED$ (đúng thứ tự đỉnh) có cặp cạnh đối $BH, ED$ song song và bằng nhau, do đó $BHED$ là hình bình hành; hai đường chéo $BE$ và $HD$ của nó cắt nhau tại trung điểm mỗi đường.
Vậy trung điểm của $BE$ = trung điểm của $HD$ = $I$ (đã chỉ ra ở trên). Do đó $I$ là trung điểm của $BE$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0040', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', 'a) Chứng minh tứ giác $ADHE$ là hình chữ nhật.
b) Gọi $M$ là trung điểm của $BC$. Chứng minh $\triangle AMC$ cân và $AM$ vuông góc với $DE$.
c) Kẻ $HI$ vuông góc với $DE$ ($I \in DE$). Trên tia đối của tia $HI$ lấy điểm $K$ sao cho $HK = DE$. Chứng minh $AK$ là phân giác góc $BAC$.', NULL, 'a) Tam giác $ABC$ vuông tại $A$ nên $\widehat{DAE} = \widehat{BAC} = 90^\circ$ ($D \in AB$, $E \in AC$).
Vì $HD \perp AB$ tại $D$ nên $\widehat{ADH} = 90^\circ$.
Vì $HE \perp AC$ tại $E$ nên $\widehat{AEH} = 90^\circ$.
Tứ giác $ADHE$ có ba góc vuông nên là hình chữ nhật.

b) Vì $\widehat{BAC} = 90^\circ$ nên $AM$ là trung tuyến ứng với cạnh huyền $BC$ của tam giác vuông $ABC$, suy ra $AM = MB = MC = \dfrac{BC}{2}$. Do đó tam giác $AMC$ có $MA = MC$ nên cân tại $M$.

Chứng minh $AM \perp DE$: Trong tam giác vuông $AHB$ (vuông tại $H$ vì $AH \perp BC$), $HD$ là đường cao ứng với cạnh huyền $AB$ nên $AD \cdot AB = AH^2$.
Tương tự, trong tam giác vuông $AHC$, $HE$ là đường cao ứng với cạnh huyền $AC$ nên $AE \cdot AC = AH^2$.
Suy ra $AD \cdot AB = AE \cdot AC$, tức $\dfrac{AD}{AC} = \dfrac{AE}{AB}$.
Xét $\triangle ADE$ và $\triangle ACB$ có $\widehat{A}$ chung và $\dfrac{AD}{AC} = \dfrac{AE}{AB}$ nên $\triangle ADE \sim \triangle ACB$ (c.g.c), suy ra $\widehat{ADE} = \widehat{ACB}$.
Gọi $P$ là giao điểm của $AM$ và $DE$. Trong tam giác $ADP$: $\widehat{PAD} = \widehat{MAB} = \widehat{ABM} = \widehat{ABC}$ (vì $\triangle ABM$ cân tại $M$, $MA=MB$); và $\widehat{ADP} = \widehat{ADE} = \widehat{ACB}$.
Suy ra $\widehat{APD} = 180^\circ - \widehat{PAD} - \widehat{ADP} = 180^\circ - \widehat{ABC} - \widehat{ACB} = 180^\circ - 90^\circ = 90^\circ$.
Vậy $AM \perp DE$ tại $P$.

c) Vì $ADHE$ là hình chữ nhật nên $DE = AH$ (hai đường chéo bằng nhau), và tam giác $DHE$ vuông tại $H$ (do $\widehat{DHE}$ là góc của hình chữ nhật) với hai cạnh góc vuông $HD, HE$, cạnh huyền $DE$; $HI$ chính là đường cao ứng với cạnh huyền $DE$ của tam giác vuông này.
Chọn hệ trục tọa độ $Axy$ với $A$ là gốc, tia $AB \equiv$ tia $Ax$, tia $AC \equiv$ tia $Ay$ (vì $\widehat{BAC}=90^\circ$). Đặt $AD=m$, $AE=n$ thì $D(m;0)$, $E(0;n)$, và vì $ADHE$ là hình chữ nhật nên $H(m;n)$.
Đường thẳng $DE$ có phương trình $nx+my-mn=0$, vectơ pháp tuyến $(n;m)$. Vì $HI \perp DE$ tại $I$ nên $I$ là hình chiếu vuông góc của $H$ lên $DE$; tính được $\vec{HI} = -\dfrac{mn}{m^2+n^2}(n;m)$, tức tia $HI$ có hướng $-(n;m)$, nên tia đối của tia $HI$ có hướng $(n;m)$.
Vì $K$ nằm trên tia đối của tia $HI$ và $HK = DE = \sqrt{m^2+n^2} = |(n;m)|$, ta có $K = H+(n;m) = (m+n;\ n+m)$.
Điểm $K$ có hoành độ bằng tung độ nên $K$ nằm trên đường phân giác của góc vuông tạo bởi tia $Ax \equiv AB$ và tia $Ay \equiv AC$, tức góc $BAC$. Vì $A$ (gốc tọa độ) cũng thuộc đường phân giác này nên đường thẳng $AK$ chính là đường phân giác của góc $BAC$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0041', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', 'a) Chứng minh $AEHD$ là hình chữ nhật.
b) Cho $AB = 6$ cm, $AC = 8$ cm, $BH = 3,6$ cm. Tính $BC$, $DE$.
c) Gọi $M$ là trung điểm của $BC$. Chứng minh $AM \perp DE$.', NULL, 'a) Tam giác $ABC$ vuông tại $A$ nên $\widehat{DAE} = \widehat{BAC} = 90^\circ$ ($D \in AB$, $E \in AC$).
Vì $HE \perp AC$ tại $E$ nên $\widehat{AEH} = 90^\circ$.
Vì $HD \perp AB$ tại $D$ nên $\widehat{HDA} = 90^\circ$.
Tứ giác $AEHD$ có ba góc vuông $\widehat{DAE} = \widehat{AEH} = \widehat{HDA} = 90^\circ$ nên là hình chữ nhật.

b) Tam giác $ABC$ vuông tại $A$, theo định lý Pythagore: $BC = \sqrt{AB^2+AC^2} = \sqrt{6^2+8^2} = \sqrt{100} = 10$ (cm).
Vì $AEHD$ là hình chữ nhật nên $DE = AH$ (hai đường chéo bằng nhau). Trong tam giác vuông $ABC$, đường cao $AH$ ứng với cạnh huyền $BC$ thỏa $AH \cdot BC = AB \cdot AC$, suy ra $AH = \dfrac{AB \cdot AC}{BC} = \dfrac{6 \cdot 8}{10} = 4,8$ (cm).
Vậy $BC = 10$ cm, $DE = 4,8$ cm.

c) Vì $\widehat{BAC} = 90^\circ$ nên $AM$ là trung tuyến ứng với cạnh huyền $BC$, suy ra $AM = MB = MC = \dfrac{BC}{2}$, do đó $\triangle ABM$ cân tại $M$.
Trong tam giác vuông $AHB$ (vuông tại $H$), $HD$ là đường cao ứng với cạnh huyền $AB$ nên $AD \cdot AB = AH^2$; trong tam giác vuông $AHC$, $HE$ là đường cao ứng với cạnh huyền $AC$ nên $AE \cdot AC = AH^2$. Suy ra $AD \cdot AB = AE \cdot AC$, tức $\dfrac{AD}{AC} = \dfrac{AE}{AB}$.
Xét $\triangle ADE$ và $\triangle ACB$ có $\widehat{A}$ chung và $\dfrac{AD}{AC}=\dfrac{AE}{AB}$ nên $\triangle ADE \sim \triangle ACB$ (c.g.c), suy ra $\widehat{ADE} = \widehat{ACB}$.
Gọi $P$ là giao điểm của $AM$ và $DE$. Trong tam giác $ADP$: $\widehat{PAD} = \widehat{MAB} = \widehat{ABM} = \widehat{ABC}$ (vì $\triangle ABM$ cân tại $M$); và $\widehat{ADP} = \widehat{ADE} = \widehat{ACB}$.
Suy ra $\widehat{APD} = 180^\circ - \widehat{ABC} - \widehat{ACB} = 180^\circ - 90^\circ = 90^\circ$. Vậy $AM \perp DE$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0042', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', 'a) Chứng minh $HM \parallel AB$ và $CH.CB = CM.CA$.
b) Lấy điểm $K$ sao cho $M$ là trung điểm của $HK$. Chứng minh tứ giác $BKCH$ là hình chữ nhật.
c) Kẻ $CE \perp AK$ ($E \in AK$). Gọi $N$ là trung điểm của $EA$. Chứng minh $BN \perp CN$.', NULL, 'a) Vì $H, M$ lần lượt là trung điểm của $CA, CB$ nên $HM$ là đường trung bình của tam giác $ABC$ (ứng với cạnh $AB$), suy ra $HM \parallel AB$.
Vì $H$ là trung điểm $CA$ nên $CH = \dfrac{CA}{2}$; vì $M$ là trung điểm $CB$ nên $CM = \dfrac{CB}{2}$.
Suy ra $CH \cdot CB = \dfrac{CA}{2}\cdot CB = \dfrac{CA\cdot CB}{2}$ và $CM \cdot CA = \dfrac{CB}{2}\cdot CA = \dfrac{CA\cdot CB}{2}$, nên $CH \cdot CB = CM \cdot CA$.

b) Vì $M$ là trung điểm $BC$ và cũng là trung điểm $HK$ (giả thiết) nên tứ giác $BKCH$ có hai đường chéo $BC$ và $HK$ cắt nhau tại trung điểm $M$ của mỗi đường, do đó $BKCH$ là hình bình hành.
Theo câu a, $HM$ là đường trung bình của $\triangle ABC$ nên $HM = \dfrac{AB}{2}$, suy ra $HK = 2HM = AB$.
Vì tam giác $ABC$ cân tại $B$ nên $BA = BC$; kết hợp $HK = AB$ ta có $HK = BC$.
Hình bình hành $BKCH$ có hai đường chéo $BC = HK$ bằng nhau nên $BKCH$ là hình chữ nhật.

c) Chọn hệ trục tọa độ $Oxy$ với $H$ (trung điểm $AC$) là gốc tọa độ, tia $HC$ trùng tia $Ox$: $A(-a;0)$, $C(a;0)$ với $a = HA = HC$ ($a>0$). Vì tam giác $ABC$ cân tại $B$ nên trung tuyến $BH$ đồng thời là đường cao, tức $BH \perp AC$, nên $B$ nằm trên trục $Oy$: $B(0;b)$ với $b=BH>0$.
Khi đó $M$ (trung điểm $BC$) $=\left(\dfrac{a}{2};\dfrac{b}{2}\right)$, và $K=2M-H=(a;b)$ (vì $M$ là trung điểm $HK$).
Đường thẳng $AK$ qua $A(-a;0)$, $K(a;b)$ có vectơ chỉ phương $(2a;b)$. $E$ là hình chiếu vuông góc của $C(a;0)$ lên $AK$: tham số hóa điểm trên $AK$ là $A+t(2a;b)$, điều kiện $\big(A+t(2a;b)-C\big)\cdot(2a;b)=0$ cho $t=\dfrac{4a^2}{4a^2+b^2}$, suy ra
$E=\left(\dfrac{a(4a^2-b^2)}{4a^2+b^2};\ \dfrac{4a^2b}{4a^2+b^2}\right)$.
$N$ là trung điểm $AE$: $N=\left(\dfrac{-ab^2}{4a^2+b^2};\ \dfrac{2a^2b}{4a^2+b^2}\right)$.
Tính $\vec{BN}=N-B=\dfrac{-b}{4a^2+b^2}\big(ab;\ 2a^2+b^2\big)$, $\vec{CN}=N-C=\dfrac{2a}{4a^2+b^2}\big(-(2a^2+b^2);\ ab\big)$.
Suy ra $\vec{BN}\cdot\vec{CN}$ tỉ lệ với $ab\cdot\big(-(2a^2+b^2)\big)+(2a^2+b^2)\cdot ab = 0$.
Vậy $\vec{BN}\cdot\vec{CN}=0$, tức $BN \perp CN$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0043', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', 'a) Chứng minh tứ giác $AMCN$ là hình chữ nhật?
b) Gọi $O$ là giao điểm của $AM$ và $BN$, lấy $J$ là trung điểm của $AB$. Chứng minh tứ giác $ANMB$ là hình bình hành và ba điểm $I, J, O$ thẳng hàng?
c) Kẻ $MH$ vuông góc với $BN$ tại $H$. Chứng minh $AH \perp HC$?', NULL, 'Vì $\triangle ABC$ cân tại A và AM là đường cao nên AM cũng là đường trung tuyến, tức M là trung điểm BC.

a) Chứng minh AMCN là hình chữ nhật:

I là trung điểm AC (giả thiết); vì N thuộc tia đối của tia IM và $IN = IM$ nên I cũng là trung điểm MN. Tứ giác AMCN có hai đường chéo AC và MN cùng nhận I làm trung điểm nên AMCN là hình bình hành.

Mặt khác $\widehat{AMC} = 90^\circ$ (vì $AM \perp BC$, M và C đều thuộc BC). Hình bình hành có một góc vuông là hình chữ nhật, vậy AMCN là hình chữ nhật.

b) Chứng minh ANMB là hình bình hành và I, J, O thẳng hàng:

Vì AMCN là hình chữ nhật nên $AN \parallel MC$ và $AN = MC$ (cạnh đối). Vì M là trung điểm BC nên $MC = MB$, và MB, MC cùng nằm trên đường thẳng BC nên $AN \parallel MB$, $AN = MB$. Tứ giác ANMB có một cặp cạnh đối song song và bằng nhau nên ANMB là hình bình hành.

Hình bình hành ANMB có hai đường chéo AM và NB cắt nhau tại trung điểm mỗi đường; mà O là giao điểm của AM và BN nên O là trung điểm của AM.

Xét $\triangle ABM$: J là trung điểm AB, O là trung điểm AM nên JO là đường trung bình của $\triangle ABM$, suy ra $JO \parallel BM$.

Xét $\triangle AMC$: O là trung điểm AM, I là trung điểm AC nên OI là đường trung bình của $\triangle AMC$, suy ra $OI \parallel MC$.

Vì BM và MC cùng thuộc đường thẳng BC nên JO và OI cùng song song với BC; hai đường thẳng này lại cùng đi qua O nên ba điểm J, O, I thẳng hàng.

c) Chứng minh $AH \perp HC$ (H là chân đường vuông góc kẻ từ M xuống BN):

AMCN là hình chữ nhật nên hai đường chéo AC, MN bằng nhau và cắt nhau tại trung điểm I, do đó $IM = IN = IA = IC$.

Xét $\triangle MHN$ có $\widehat{MHN} = 90^\circ$ (vì $MH \perp BN$ và H, N cùng thuộc đường thẳng BN). I là trung điểm MN nên IH là trung tuyến ứng với cạnh huyền MN của tam giác vuông MHN, suy ra $IH = IM = IN$ (trung tuyến ứng cạnh huyền bằng nửa cạnh huyền).

Kết hợp hai kết quả: $IH = IM = IA = IC = \dfrac{AC}{2}$. Vậy H cách đều hai điểm A, C một khoảng bằng $\dfrac{AC}{2}$, tức H thuộc đường tròn đường kính AC. Theo hệ quả góc nội tiếp chắn nửa đường tròn, $\widehat{AHC} = 90^\circ$, tức $AH \perp HC$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0044', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', '1) Chứng minh $\frac{AN}{NC} = \frac{BH}{HC}$.
2) Đường thẳng qua $O$ song song với $AC$ cắt $BC$ tại $E$, đường thẳng qua $O$ song song với $AB$ cắt $BC$ tại $I$. Chứng minh $E$ là trung điểm của $HC$ và tính độ dài của đoạn thẳng $IE$, biết $BC = 15\ cm$.
3) Vẽ điểm $D$ sao cho $A$ là trung điểm của $BD$. Chứng minh $HD \perp OC$.', NULL, 'Tứ giác AMHN có $\widehat{MAN} = 90^\circ$ (góc A của $\triangle ABC$), $\widehat{AMH} = 90^\circ$ (vì $HM \perp AB$), $\widehat{ANH} = 90^\circ$ (vì $HN \perp AC$) nên AMHN là hình chữ nhật. Do đó hai đường chéo AH và MN cắt nhau tại trung điểm mỗi đường, tức O là trung điểm của AH (và của MN).

1) Chứng minh $\dfrac{AN}{NC} = \dfrac{BH}{HC}$:

Vì $AH \perp BC$ nên $\widehat{AHC} = 90^\circ$, $\triangle AHC$ vuông tại H, HN là đường cao ứng với cạnh huyền AC. Theo hệ thức lượng trong tam giác vuông: $AH^2 = AN \cdot AC$ và $HC^2 = NC \cdot AC$. Chia hai đẳng thức: $\dfrac{AN}{NC} = \dfrac{AH^2}{HC^2}$.

Mặt khác AH là đường cao ứng với cạnh huyền BC của $\triangle ABC$ vuông tại A nên $AH^2 = BH \cdot HC$.

Thay vào: $\dfrac{AN}{NC} = \dfrac{AH^2}{HC^2} = \dfrac{BH \cdot HC}{HC^2} = \dfrac{BH}{HC}$ (đpcm).

2) Chứng minh E là trung điểm HC; tính IE khi $BC = 15\ cm$:

Xét $\triangle AHC$: O là trung điểm AH, đường thẳng qua O song song AC cắt HC tại E nên OE là đường trung bình của $\triangle AHC$, suy ra E là trung điểm HC (và $OE = \dfrac{AC}{2}$).

Tương tự, xét $\triangle AHB$: O là trung điểm AH, đường thẳng qua O song song AB cắt HB tại I nên OI là đường trung bình của $\triangle AHB$, suy ra I là trung điểm HB.

Trên đường thẳng BC các điểm sắp theo thứ tự B, I, H, E, C (vì I là trung điểm BH, E là trung điểm HC), do đó $IE = IH + HE = \dfrac{BH}{2} + \dfrac{HC}{2} = \dfrac{BH+HC}{2} = \dfrac{BC}{2}$.

Với $BC = 15\ cm$: $IE = \dfrac{15}{2} = 7{,}5\ cm$.

3) Chứng minh $HD \perp OC$ (D sao cho A là trung điểm BD):

Chọn hệ trục toạ độ Axy, gốc A, hai tia AB, AC lần lượt là hai trục (hợp lệ vì $\widehat{BAC} = 90^\circ$). Đặt $AB = c$, $AC = b$, $BC = a$ (với $a^2 = b^2+c^2$ theo Pythagoras). Toạ độ: $A(0;0)$, $B(c;0)$, $C(0;b)$.

Dùng công thức hình chiếu quen thuộc của tam giác vuông (chân đường cao và hình chiếu), tính được: $H\left(\dfrac{b^2c}{a^2};\ \dfrac{bc^2}{a^2}\right)$, $O\left(\dfrac{b^2c}{2a^2};\ \dfrac{bc^2}{2a^2}\right)$ (trung điểm AH). Vì A là trung điểm BD nên $D(-c;0)$.

Ta có $\vec{HD} = \left(-c-\dfrac{b^2c}{a^2};\ -\dfrac{bc^2}{a^2}\right) = \left(-\dfrac{c(a^2+b^2)}{a^2};\ -\dfrac{bc^2}{a^2}\right)$ và $\vec{OC} = \left(-\dfrac{b^2c}{2a^2};\ b-\dfrac{bc^2}{2a^2}\right) = \left(-\dfrac{b^2c}{2a^2};\ \dfrac{b(2a^2-c^2)}{2a^2}\right)$.

$\vec{HD}\cdot\vec{OC} = \dfrac{c(a^2+b^2)}{a^2}\cdot\dfrac{b^2c}{2a^2} - \dfrac{bc^2}{a^2}\cdot\dfrac{b(2a^2-c^2)}{2a^2} = \dfrac{b^2c^2}{2a^4}\Big[(a^2+b^2)-(2a^2-c^2)\Big] = \dfrac{b^2c^2}{2a^4}\left(b^2+c^2-a^2\right)$.

Vì $\widehat{BAC} = 90^\circ$ nên $a^2 = b^2+c^2$ (Pythagoras), tức $b^2+c^2-a^2 = 0$. Do đó $\vec{HD}\cdot\vec{OC} = 0$, suy ra $HD \perp OC$ (đpcm).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0045', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', 'a) Chứng minh tứ giác $AFME$ là hình chữ nhật.
b) Trên tia $EM$ lấy điểm $H$ sao cho $ME = MH$. Chứng minh $HC$ song song với $BE$.
c) Gọi $I$ là giao điểm của $AM$ và $BE$. Chứng minh $EF = 3MI$', NULL, 'a) Chứng minh AFME là hình chữ nhật:

Tứ giác AFME có $\widehat{FAE} = \widehat{BAC} = 90^\circ$, $\widehat{AFM} = 90^\circ$ (vì $MF \perp AB$), $\widehat{AEM} = 90^\circ$ (vì $ME \perp AC$). Tứ giác có ba góc vuông nên AFME là hình chữ nhật.

(Vì $MF \perp AB$ và $AC \perp AB$ nên $MF \parallel AC$; M là trung điểm BC nên theo đường trung bình, F là trung điểm AB. Tương tự $ME \parallel AB$ nên E là trung điểm AC — hai kết quả này dùng ở câu b, c.)

b) Chứng minh $HC \parallel BE$ (H trên tia EM, $MH = ME$):

Vì H thuộc tia EM (tia gốc E, qua M) và $MH = ME$ nên M là trung điểm của EH. Theo giả thiết, M cũng là trung điểm của BC.

Xét tứ giác BECH: hai đường chéo của nó là BC và EH, cùng nhận M làm trung điểm, nên BECH là hình bình hành.

Trong hình bình hành BECH, hai cạnh đối BE và CH song song với nhau, tức $HC \parallel BE$ (đpcm).

c) Chứng minh $EF = 3MI$ (I là giao điểm AM và BE):

Theo câu a), E là trung điểm AC nên BE chính là đường trung tuyến kẻ từ đỉnh B của $\triangle ABC$. Theo giả thiết, AM là đường trung tuyến kẻ từ đỉnh A (M là trung điểm BC).

I là giao điểm của hai đường trung tuyến AM và BE nên I chính là trọng tâm của $\triangle ABC$.

Theo tính chất trọng tâm, I chia trung tuyến AM theo tỉ số $AI = \dfrac{2}{3}AM$, $MI = \dfrac{1}{3}AM$, tức $AM = 3MI$.

Mặt khác, AFME là hình chữ nhật (câu a) nên hai đường chéo bằng nhau: $EF = AM$.

Suy ra $EF = AM = 3MI$ (đpcm).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0046', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '635fb2eb-1c6d-4ce0-ae41-d64c515132da', 'a) Chứng minh $\triangle AHD = \triangle CKB$


b) Chứng minh : BH = DK', NULL, 'a) a. Vì ABCD là hình bình hành nên $AD \parallel BC$, $AD = BC$.
Suy ra $\widehat{ADH} = \widehat{CBK}$ (hai góc so le trong)
Xét tam giác $\triangle AHD$ và $\triangle CKB$
$AD = BC$ (cmt)
$\widehat{ADH} = \widehat{CBK}$ (cmt)
$\widehat{AHD} = \widehat{CKB} = 90^\circ$
Vậy $\triangle AHD = \triangle CKB$ ($CH - GN$)


b) Suy ra $DH = BK$ (vì tương ứng)
Nên $DH + HK = BK + HK$
Suy ra $DK = BH$ (dpcm)', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0047', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 13),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'd8b8a6b8-3ec3-4e64-9455-7aa106e19850', 'a) $\triangle DAB=\triangle CBA$ , từ đó suy ra $BD=AC$

b) Góc $\widehat{ADC}$ bằng góc $\widehat{BCD}$

c) $AB//CD$', NULL, 'b) Xét tam giác ACD và BDC có
CD chung
AD = BC (gt)
AC = BD (cmt)
Suy ra $\triangle ACD = \triangle BDC (c.c.c)$
Suy ra $\widehat{ADC} = \widehat{BCD}$ (vì tương ứng)

c) Ta có $\widehat{ABC} + \widehat{BCD} + \widehat{ADC} + \widehat{DAB} = 360^0$
Mà $\widehat{DAB} = \widehat{ABC}(gt) ; \widehat{ADC} = \widehat{BCD}(cmt)$
Suy ra $2(\widehat{DAB} + \widehat{ADC}) = 360^0 \Rightarrow \widehat{DAB} + \widehat{ADC} = 180^0$
Gọi Ax là tia đối của tia AB. Suy ra $\widehat{DAx} + \widehat{DAB} = 180^0$
Suy ra $\widehat{DAx} = \widehat{ADC}$.
Mà $\widehat{DAx}$ và $\widehat{ADC}$ là 2 góc ở vị trí so le trong đối với AB và CD
Suy ra AB $\parallel$ CD', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0048', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 16),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'feaa0121-261b-4510-8a1e-435e29d1c390', 'a) Chứng minh : AD = AE

b) Chứng minh $BECD$ là hình thang cân', NULL, 'a) Vì tam giác ABC cân nên $\widehat{ABC} = \widehat{ACB}$ và AB = AC
BD là phân giác góc B nên $\widehat{ABD} = \widehat{CBD} = \frac{\widehat{ABC}}{2}$
CE là phân giác góc C nên $\widehat{ACE} = \widehat{BCE} = \frac{\widehat{ACB}}{2}$
Suy ra $\widehat{ABD} = \widehat{CBD} = \widehat{ACE} = \widehat{BCE}$
Xét tam giác ABD và ACE có
AB = AC (cmt)
$\widehat{A}$ chung
$\widehat{ABD} = \widehat{ACE}$
Suy ra $\triangle ABD = \triangle ACE (g.c.g)$
$\Rightarrow AD = AE$ (vì tương ứng)

b) Vì tam giác $ABC$ cân tại $A$ nên $\widehat{ABC} = \widehat{ACB}$
Mà $\widehat{ABC} + \widehat{ACB} + \widehat{BAC} = 180^0$
Suy ra $\widehat{ABC} = \widehat{ACB} = \frac{180^0 - \widehat{BAC}}{2}$
Lại có $AD = AE$ (cmt) nên tam giác $ADE$ cân tại A
Suy ra $\widehat{ADE} = \widehat{AED}$
Mà $\widehat{ADE} + \widehat{AED} + \widehat{DAE} = 180^0$
Suy ra $\widehat{ADE} = \widehat{AED} = \frac{180^0 - \widehat{DAE}}{2}$
Mà $\widehat{DAE} = \widehat{BAC} \Rightarrow \frac{180^0 - \widehat{BAC}}{2} = \frac{180^0 - \widehat{DAE}}{2}$
Suy ra $\widehat{ABC} = \widehat{ACB} = \widehat{ADE} = \widehat{AED}$
Mà $\widehat{ABC}$ và $\widehat{AED}$ là 2 góc ở vị trí đồng vị
Nên $DE \parallel BC$, vậy $BEDC$ là hình thang
Mà tam giác $ABC$ cân nên $\widehat{EBC} = \widehat{DCB}$
Vậy $BEDC$ là hình thang cân', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/00429451-14b7-43d5-9f76-75d7ede898d4.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0049', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 17),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'eb398e67-5bcc-48a5-b567-7dba11c8941b', 'a) Chứng minh  $OA = OB$

b) Chứng minh  $OC = OD$

c) Chứng minh rằng : $OE \perp AB$

d) Chứng minh rằng : $OE \perp CD$

e) Chứng minh  $O, E, F$ thẳng hàng

f) $EF$ là trung trực của $AB, CD$', NULL, 'a) Vì $ABCD$ là hình thang cân nên $AD = BC, AC = BD$.
Xét tam giác ABD và BAC có :
AB chung
$BD = AC$ (cmt)
$AD = BC$ (cmt)
Vậy $\triangle ABD = \triangle BAC$ (c.c.c).
$\Rightarrow \widehat{ABD} = \widehat{BAC}$ (vì tương ứng)
Suy ra tam giác OAB cân tại E nên OA = OB

b) Vì $ABCD$ là hình thang cân nên $AD=BC,AC=BD$.
Xét tam giác ACD và BCD có :
$AC = BD$ (cmt)
$AD = BC$ (cmt)
CD chung
Suy ra $\triangle ACD = \triangle BCD (c.c.c)$
$\widehat{ACD} = \widehat{BDC}$ (vì tương ứng)
$\Rightarrow \triangle OCD$ cân tại E suy ra OC = OD.

c) Ta có $OA = OB$
Suy ra $\triangle OAB$ cân tại O
Mà E là trung điểm của AB nên OE là trung tuyến.
Vậy OE cũng là đường cao của tam giác OAB
Suy ra $OE \perp AB$

d) Ta có $OC = OD$
Suy ra $\triangle OCD$ cân tại O
Mà F là trung điểm của CD nên OF là trung tuyến.
Vậy OF cũng là đường cao của tam giác OCD
Suy ra $OE \perp CD$

e) Ta có $OE \perp AB$; $AB \parallel CD \Rightarrow OE \perp CD$
Mà $OF \perp CD$ suy ra O,E, F thẳng hàng

f) Ta có $OE \perp AB$; $AB \parallel CD \Rightarrow OE \perp CD$
Mà $OF \perp CD$ suy ra O,E, F thẳng hàng
Suy ra $EF \perp CD$
F là trung điểm CD nên EF là trung trực của CD
E là trung điểm AB nên EF là trung trực của AB', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0050', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 23),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '7d83b292-a909-44d0-8140-116b934ccd50', 'a) Chứng minh : $AMCK$ là hình bình hành

b) Chứng minh : $BMKC$ là hình bình hành

c) Chứng minh : $MN // BC$ và $BC = 2MN$', NULL, 'a) Vì $N$ là trung điểm $AC$ (giả thiết) và theo cách dựng $NK = NM$ với $K$ thuộc tia đối của tia $NM$, nên $N$ cũng là trung điểm của $MK$.
Tứ giác $AMCK$ có hai đường chéo $AC$ và $MK$ cắt nhau tại $N$ là trung điểm của mỗi đường, nên $AMCK$ là hình bình hành.

b) Theo câu trên, $AMCK$ là hình bình hành nên $AM \parallel CK$ và $AM = CK$.
Vì $M$ là trung điểm $AB$ nên $MB = AM$; suy ra $MB = CK$.
Mà $MB$ và $CK$ cùng nằm trên hai đường thẳng chứa $AM, CK$ song song nên $MB \parallel CK$.
Tứ giác $BMKC$ có cặp cạnh đối $BM, CK$ song song và bằng nhau nên $BMKC$ là hình bình hành.

c) Theo câu b), $BMKC$ là hình bình hành nên $MK \parallel BC$ và $MK = BC$.
Vì $N$ là trung điểm $MK$ (theo cách dựng ở câu a) nên $MN = \dfrac{1}{2}MK = \dfrac{1}{2}BC$, tức $BC = 2MN$.
Mà $M, N, K$ thẳng hàng (do $K$ thuộc tia đối của tia $NM$) nên đường thẳng $MN$ trùng với đường thẳng $MK$, mà $MK \parallel BC$, suy ra $MN \parallel BC$.
Vậy $MN \parallel BC$ và $BC = 2MN$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0051', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 21),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2fe2a80c-c887-44c6-b0f3-52e78b7faf02', 'a) Chứng minh $\triangle AHD = \triangle CKB$

b) Chứng minh $AHCK$ là hình bình hành

c) Chứng minh : A, O, C thẳng hàng.', NULL, 'a) Vì $ABCD$ là hình bình hành nên $AD \parallel BC$, suy ra $\widehat{ADB} = \widehat{DBC}$ (so le trong, cắt bởi cát tuyến $BD$), tức là $\widehat{ADH} = \widehat{CBK}$ (vì $H, K \in BD$).
Xét $\triangle AHD$ và $\triangle CKB$: $\widehat{AHD} = \widehat{CKB} = 90^\circ$ (do $AH \perp BD$, $CK \perp BD$); $AD = CB$ (cạnh đối hình bình hành); $\widehat{ADH} = \widehat{CBK}$ (cmt).
Suy ra $\triangle AHD = \triangle CKB$ (cạnh huyền – góc nhọn).

b) Xét $\triangle AHD$ và $\triangle CKB$: $\widehat{AHD}=\widehat{CKB}=90^\circ$; $AD=CB$ (cạnh đối hbh); $\widehat{ADH}=\widehat{CBK}$ (so le trong, $AD\parallel BC$).
Suy ra $\triangle AHD = \triangle CKB$ (cạnh huyền – góc nhọn), do đó $AH = CK$.
Mà $AH \parallel CK$ (cùng vuông góc với $BD$).
Tứ giác $AHCK$ có cặp cạnh đối $AH, CK$ song song và bằng nhau nên $AHCK$ là hình bình hành.

c) Gọi $I$ là giao điểm của $AC$ và $BD$.
Xét $\triangle AHD$ và $\triangle CKB$: $\widehat{AHD}=\widehat{CKB}=90^\circ$; $AD=CB$ (cạnh đối hbh); $\widehat{ADH}=\widehat{CBK}$ (so le trong, $AD\parallel BC$). Suy ra $\triangle AHD=\triangle CKB$ (cạnh huyền – góc nhọn) $\Rightarrow AH=CK$.
Mà $AH \parallel CK$ (cùng vuông góc $BD$) nên $AHCK$ là hình bình hành.
Trong hình bình hành $AHCK$, hai đường chéo $AC$ và $HK$ cắt nhau tại trung điểm mỗi đường; vì $I = AC \cap BD$ và $H,K \in BD$ nên $I$ chính là trung điểm $HK$.
Theo giả thiết $O$ là trung điểm $HK$, do trung điểm một đoạn thẳng là duy nhất nên $O \equiv I$, suy ra $O \in AC$, tức $A,O,C$ thẳng hàng.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0052', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '635fb2eb-1c6d-4ce0-ae41-d64c515132da', 'a) Chứng minh $\triangle AHD = \triangle CKB$


b) Chứng minh $AHCK$ là hình bình hành

c) Chứng minh : $AK // HC$', NULL, 'a) a. Vì ABCD là hình bình hành nên $AD \parallel BC$, $AD = BC$.
Suy ra $\widehat{ADH} = \widehat{CBK}$ (hai góc so le trong)
Xét tam giác $\triangle AHD$ và $\triangle CKB$
$AD = BC$ (cmt)
$\widehat{ADH} = \widehat{CBK}$ (cmt)
$\widehat{AHD} = \widehat{CKB} = 90^\circ$
Vậy $\triangle AHD = \triangle CKB$ ($CH - GN$)


b) Gọi $O$ là giao điểm của hai đường chéo $AC$ và $BD$.
Xét $\triangle AOH$ và $\triangle COK$: $OA = OC$ (tính chất đường chéo hình bình hành); $\widehat{AOH} = \widehat{COK}$ (hai góc đối đỉnh, vì $A,O,C$ thẳng hàng và $H,O,K$ thẳng hàng); $\widehat{AHO} = \widehat{CKO} = 90^\circ$ (do $AH \perp BD$, $CK \perp BD$).
Suy ra $\triangle AOH = \triangle COK$ (cạnh huyền – góc nhọn), do đó $AH = CK$.
Mà $AH \parallel CK$ (cùng vuông góc với $BD$).
Tứ giác $AHCK$ có một cặp cạnh đối $AH, CK$ song song và bằng nhau nên $AHCK$ là hình bình hành.

c) Gọi $O$ là giao điểm của $AC$ và $BD$.
Xét $\triangle AOH$ và $\triangle COK$: $OA=OC$ (tính chất đường chéo hbh); $\widehat{AOH}=\widehat{COK}$ (đối đỉnh); $\widehat{AHO}=\widehat{CKO}=90^\circ$.
Suy ra $\triangle AOH = \triangle COK$ (cạnh huyền – góc nhọn) $\Rightarrow AH = CK$.
Mà $AH \parallel CK$ (cùng vuông góc $BD$) nên tứ giác $AHCK$ có một cặp cạnh đối song song và bằng nhau, suy ra $AHCK$ là hình bình hành.
Trong hình bình hành $AHCK$, cặp cạnh đối còn lại là $AK$ và $HC$ cũng song song với nhau.
Vậy $AK \parallel HC$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0053', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 18),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'abcbf25b-1631-499a-9acb-72715237bb56', 'a) Tứ giác $AMCN$ là hình gì?

b) Chứng minh ba đường thẳng $AC, BD, MN$ đồng quy.', NULL, 'a) Vì $ABCD$ là hình bình hành nên $AB \parallel DC$ và $AB = DC$.
$M \in AB$ nên $AM = AB - BM$; $N \in DC$ nên $NC = DC - DN$.
Mà $AB = DC$ và $BM = DN$ (giả thiết) nên $AM = NC$.
Lại có $AM \parallel NC$ (vì $AM$ nằm trên $AB$, $NC$ nằm trên $DC$, mà $AB \parallel DC$).
Tứ giác $AMCN$ có một cặp cạnh đối $AM, NC$ song song và bằng nhau nên $AMCN$ là hình bình hành.

b) Theo câu trên, $AMCN$ là hình bình hành, nên hai đường chéo $AC$ và $MN$ cắt nhau tại trung điểm $O$ của mỗi đường.
Mặt khác, $ABCD$ cũng là hình bình hành nên hai đường chéo $AC$ và $BD$ cắt nhau tại trung điểm $O$ của $AC$.
Vậy $O$ vừa là trung điểm $AC$, vừa là trung điểm $BD$, vừa là trung điểm $MN$, nên ba đường thẳng $AC, BD, MN$ cùng đi qua $O$, tức chúng đồng quy.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0054', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '635fb2eb-1c6d-4ce0-ae41-d64c515132da', 'a) Chứng minh $\triangle AHD = \triangle CKB$


b) Chứng minh $AHCK$ là hình bình hành

c) Chứng minh : $A,O,C$ thẳng hàng', NULL, 'a) a. Vì ABCD là hình bình hành nên $AD \parallel BC$, $AD = BC$.
Suy ra $\widehat{ADH} = \widehat{CBK}$ (hai góc so le trong)
Xét tam giác $\triangle AHD$ và $\triangle CKB$
$AD = BC$ (cmt)
$\widehat{ADH} = \widehat{CBK}$ (cmt)
$\widehat{AHD} = \widehat{CKB} = 90^\circ$
Vậy $\triangle AHD = \triangle CKB$ ($CH - GN$)


b) Gọi $O$ là giao điểm của hai đường chéo $AC$ và $BD$.
Xét $\triangle AOH$ và $\triangle COK$: $OA = OC$ (tính chất đường chéo hình bình hành); $\widehat{AOH} = \widehat{COK}$ (hai góc đối đỉnh, vì $A,O,C$ thẳng hàng và $H,O,K$ thẳng hàng); $\widehat{AHO} = \widehat{CKO} = 90^\circ$ (do $AH \perp BD$, $CK \perp BD$).
Suy ra $\triangle AOH = \triangle COK$ (cạnh huyền – góc nhọn), do đó $AH = CK$.
Mà $AH \parallel CK$ (cùng vuông góc với $BD$).
Tứ giác $AHCK$ có một cặp cạnh đối $AH, CK$ song song và bằng nhau nên $AHCK$ là hình bình hành.

c) Vì $ABCD$ là hình bình hành nên $AB \parallel CD$, suy ra $\widehat{ABO} = \widehat{CDO}$ (so le trong, $O \in BD$).
Xét $\triangle ABO$ và $\triangle CDO$: $AB = CD$ (cạnh đối hình bình hành); $\widehat{ABO} = \widehat{CDO}$ (cmt); $OB = OD$ (giả thiết).
Suy ra $\triangle ABO = \triangle CDO$ (c.g.c), do đó $\widehat{AOB} = \widehat{COD}$.
Mà $\widehat{AOB}$ và $\widehat{AOD}$ kề bù (vì $B,O,D$ thẳng hàng) nên $\widehat{AOB} + \widehat{AOD} = 180^\circ$.
Thay $\widehat{AOB} = \widehat{COD}$ vào, ta được $\widehat{AOD} + \widehat{DOC} = 180^\circ$.
Vậy hai tia $OA$, $OC$ là hai tia đối nhau, suy ra $A$, $O$, $C$ thẳng hàng.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/3d27b594-bfa8-429a-b80b-a8bbfc16371c.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0055', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 22),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'b00e5d6f-0ed8-49df-a01d-c3067674519d', 'a) Chứng minh $BHCI$ là hình bình hành

b) Chứng minh $H,M,I$ thẳng hàng', NULL, 'a) Vì $H$ là trực tâm $\triangle ABC$ nên $BH \perp AC$ và $CH \perp AB$.
Theo giả thiết, $BI \perp AB$ và $CI \perp AC$.
Vì $CH \perp AB$ và $BI \perp AB$ nên $CH \parallel BI$ (cùng vuông góc với $AB$).
Vì $BH \perp AC$ và $CI \perp AC$ nên $BH \parallel CI$ (cùng vuông góc với $AC$).
Tứ giác $BHCI$ có hai cặp cạnh đối $BH \parallel CI$ và $HC \parallel IB$ nên $BHCI$ là hình bình hành.

b) Vì $BHCI$ là hình bình hành (câu trên), hai đường chéo $BC$ và $HI$ của nó cắt nhau tại trung điểm của mỗi đường.
Theo giả thiết, $M$ là trung điểm $BC$; mà trung điểm một đoạn thẳng là duy nhất nên $M$ cũng chính là trung điểm của $HI$.
Vậy $M \in HI$, suy ra $H, M, I$ thẳng hàng.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/8608a723-68ba-4f4b-b9d0-3583e7e5de14.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0056', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 11),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '47e2c5f9-aaf9-4b11-bc80-a892bf8e7b66', 'a) Chứng minh: $\widehat{CDx} = \widehat{CBA}$

b) Chứng minh $AC$ là tia phân giác của góc $\widehat{BAD}$.', NULL, 'a) Ta có $\widehat{B} + \widehat{D} = 180^0$ (giả thiết)
Mà $\widehat{CDA} + \widehat{CDx} = 180^0$ (hai góc kề bù)
Suy ra $\widehat{CDx} = \widehat{CBA}$

b) Kẻ $CF \perp AD$; $CE \perp AB$
Theo câu trước, ta dễ dàng chứng minh được $\widehat{CDF} = \widehat{CBE}$
Xét 2 tam giác CDF và CBE có :
$\widehat{CDF} = \widehat{CBE}$ (cmt)
$\widehat{CFD} = \widehat{CEB} = 90^o$
$CD = CB(gt)$
Vậy $\triangle CDF = \triangle CBE (CH - GN)$
Suy ra $CF = CE$ (vì tương ứng)
Suy ra AC là phân giác của góc $\widehat{BAD}$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/0a8b1ed6-42ed-4caa-bd72-8ec3b563dcf9.png', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/f753f0b9-f0e4-42f8-bd88-cb83f8c0a1c5.png', 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0057', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 18),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'abcbf25b-1631-499a-9acb-72715237bb56', 'a) Chứng minh $BMDN$ là hình bình hành

b) Chứng minh  : $AE = EF = FC$', NULL, 'a) Vì $M$ là trung điểm $AB$ nên $MB = \dfrac{1}{2}AB$; vì $N$ là trung điểm $DC$ nên $DN = \dfrac{1}{2}DC$.
Mà $AB = DC$ (cạnh đối hình bình hành $ABCD$) nên $MB = DN$.
Lại có $MB \parallel DN$ (vì $M \in AB$, $N \in DC$, $AB \parallel DC$).
Tứ giác $BMDN$ có cặp cạnh đối $MB, ND$ song song và bằng nhau nên $BMDN$ là hình bình hành.

b) Gọi $O$ là giao điểm hai đường chéo $AC, BD$ (đồng thời là trung điểm mỗi đường), $E = AC \cap DM$, $F = AC \cap BN$.
• Xét $\triangle ABD$: $O$ là trung điểm $BD$ nên $AO$ là đường trung tuyến; $M$ là trung điểm $AB$ nên $DM$ là đường trung tuyến. Hai trung tuyến $AO$ và $DM$ cắt nhau tại trọng tâm $E$ của $\triangle ABD$, do đó $AE = \dfrac{2}{3}AO = \dfrac{2}{3}\cdot\dfrac{AC}{2} = \dfrac{AC}{3}$.
• Xét $\triangle BCD$: $O$ là trung điểm $BD$ nên $CO$ là đường trung tuyến; $N$ là trung điểm $DC$ nên $BN$ là đường trung tuyến. Hai trung tuyến $CO$ và $BN$ cắt nhau tại trọng tâm $F$ của $\triangle BCD$, do đó $FC = \dfrac{2}{3}CO = \dfrac{2}{3}\cdot\dfrac{AC}{2} = \dfrac{AC}{3}$.
Suy ra $EF = AC - AE - FC = AC - \dfrac{AC}{3} - \dfrac{AC}{3} = \dfrac{AC}{3}$.
Vậy $AE = EF = FC = \dfrac{AC}{3}$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/2c60c9b7-b06f-471d-b2ca-15b877800102.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0058', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 3),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'd27e8f09-58b2-41e3-98cf-e3995c10e45d', 'a) Chứng minh $\triangle ADH = \triangle BCK$

b) Chứng minh: $DH = \frac{CD-AB}{2}$.', NULL, 'a) Vì ABCD là hình thang cân nên $\widehat{C} = \widehat{D}$; $AD = BC$.
Xét $\triangle ADH$ và $\triangle BCK$ có :
$\widehat{H} = \widehat{K} = 90^o$
$\widehat{C} = \widehat{D}$
$AD = BC$
Suy ra $\triangle ADH = \triangle BCK$ (cạnh huyền - góc nhọn).

b) Từ $\triangle ADH = \triangle BCK$ (cạnh huyền - góc nhọn).
Suy ra $DH = CK; AH = BK$ (vì tương ứng)
Xét tam giác $\triangle AHK$ và $\triangle KBA$ có
$AH = BK (cmt)$
$AK$ chung
$\widehat{H} = \widehat{B} = 90^o$
Vậy $\triangle AHK = \triangle KBA$ (cạnh huyền – cạnh góc vuông),
suy ra $AB = HK$ (vì tương ứng)
Vậy ta có $CD = CK + HK + DH = DH + AB + DH = 2DH + AB \Rightarrow 2DH = CD - AB$
Suy ra $DH = \frac{CD - AB}{2}$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/eb17f736-41ee-4438-9a89-5136f2b2f4b0.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0059', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 15),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '26c1a143-1f1f-410d-b917-fc66d7dbcf95', 'a) Chứng minh tam giác OAB và OCD cân tại O

b) Chứng minh  rằng $EA = EB$

c) Chứng minh OE là trung trực của AB', NULL, 'a) Ta có : ABCD là hình thang cân nên $\widehat{OCD} = \widehat{ODC}$
Vậy tam giác OCD cân tại O
Mà AB $\parallel$ CD nên $\widehat{OAB} = \widehat{ODC}; \widehat{OBA} = \widehat{OCD}$ (hai góc đồng vị)
Suy ra $\widehat{OAB} = \widehat{OBA}$
Suy ra tam giác OAB cân tại O

b) Vì $ABCD$ là hình thang cân nên $AD = BC,AC = BD$.
Xét tam giác ABD và BAC có :
AB chung
$BD = AC$ (cmt)
$AD = BC$ (cmt)
Vậy $\triangle ABD = \triangle BAC$ (c.c.c).
$\Rightarrow \widehat{ABD} = \widehat{BAC}$ (vì tương ứng)
Suy ra tam giác EAB cân tại E nên EA = EB

c) Ta có tam giác $OAB$ cân ở $O$ nên $OA = OB$
Vậy $O$ thuộc trung trực của $AB$
Ta lại có $EA = EB$ (cmt).
Vậy $E$ cũng thuộc trung trực của $AB$
Vậy $OE$ là trung trực của $AB$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/a1c42cf4-62c4-4ebb-9191-349761f2b1fa.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0060', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 16),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'feaa0121-261b-4510-8a1e-435e29d1c390', 'a) Chứng minh rằng: $AD = AE$

b) Chứng minh $BECD $ là hình thang cân', NULL, 'a) Vì tam giác $ABC$ cân tại $A$ nên $AB = AC$
Xét tam giác $AEC$ và $ADB$ có :
$AB = AC$ (cmt)
$\widehat{A}$ chung
$\widehat{AEC} = \widehat{ADB} = 90^0$
Suy ra $\triangle AEC = \triangle ADB (CH - GN)$
Nên $AD = AE$ (vì tương ứng)

b) Vì tam giác $ABC$ cân tại $A$ nên $\widehat{ABC} = \widehat{ACB}$
Mà $\widehat{ABC} + \widehat{ACB} + \widehat{BAC} = 180^o$
Suy ra $\widehat{ABC} = \widehat{ACB} = \frac{180^o - \widehat{BAC}}{2}$
Lại có $AD = AE$ (cmt) nên tam giác $ADE$ cân tại $A$
Suy ra $\widehat{ADE} = \widehat{AED}$
Mà $\widehat{ADE} + \widehat{AED} + \widehat{DAE} = 180^o$
Suy ra $\widehat{ADE} = \widehat{AED} = \frac{180^o - \widehat{DAE}}{2}$
Mà $\widehat{DAE} = \widehat{BAC} \Rightarrow \frac{180^o - \widehat{BAC}}{2} = \frac{180^o - \widehat{DAE}}{2}$
Suy ra $\widehat{ABC} = \widehat{ACB} = \widehat{ADE} = \widehat{AED}$
Mà $\widehat{ABC}$ và $\widehat{AED}$ là 2 góc ở vị trí đồng vị
Nên $DE \parallel BC$, vậy $BEDC$ là hình thang
Mà tam giác $ABC$ cân nên $\widehat{EBC} = \widehat{DCB}$
Vậy $BEDC$ là hình thang cân', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0061', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 16),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'feaa0121-261b-4510-8a1e-435e29d1c390', 'a) Chứng minh rằng : $AD = AE$

b) Chứng minh $BEDC$ là hình thang cân', NULL, 'a) Vì tam giác $ABC$ cân tại $A$ nên $AB = AC$
D là trung điểm $AC$ nên $AD = DC = \frac{AC}{2}$
E là trung điểm $AB$ nên $AE = EB = \frac{AB}{2}$
Suy ra $AD = DC = AE = EB$
Vậy $AD = AE$

b) Vì tam giác $ABC$ cân tại $A$ nên $\widehat{ABC} = \widehat{ACB}$
Mà $\widehat{ABC} + \widehat{ACB} + \widehat{BAC} = 180^\circ$
Suy ra $\widehat{ABC} = \widehat{ACB} = \frac{180^\circ - \widehat{BAC}}{2}$
Lại có $AD = AE$ (cmt) nên tam giác $ADE$ cân tại A
Suy ra $\widehat{ADE} = \widehat{AED}$
Mà $\widehat{ADE} + \widehat{AED} + \widehat{DAE} = 180^\circ$
Suy ra $\widehat{ADE} = \widehat{AED} = \frac{180^\circ - \widehat{DAE}}{2}$
Mà $\widehat{DAE} = \widehat{BAC} \Rightarrow \frac{180^\circ - \widehat{BAC}}{2} = \frac{180^\circ - \widehat{DAE}}{2}$
Suy ra $\widehat{ABC} = \widehat{ACB} = \widehat{ADE} = \widehat{AED}$
Mà $\widehat{ABC}$ và $\widehat{AED}$ là 2 góc ở vị trí đồng vị
Nên $DE \parallel BC$, vậy $BEDC$ là hình thang
Mà tam giác $ABC$ cân nên $\widehat{EBC} = \widehat{DCB}$
Vậy $BEDC$ là hình thang cân', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0062', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 15),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '26c1a143-1f1f-410d-b917-fc66d7dbcf95', 'a) Chứng minh tam giác OAB và OCD cân tại O

b) Chứng minh  rằng : $EC = ED$

c) Chứng minh  rằng $OE$là trung trực của $CD$', NULL, 'a) Ta có : ABCD là hình thang cân nên $\widehat{OCD} = \widehat{ODC}$
Vậy tam giác OCD cân tại O
Mà AB $\parallel$ CD nên $\widehat{OAB} = \widehat{ODC}; \widehat{OBA} = \widehat{OCD}$ (hai góc đồng vị)
Suy ra $\widehat{OAB} = \widehat{OBA}$
Suy ra tam giác OAB cân tại O

b) Vì $ABCD$ là hình thang cân nên $AD = BC, AC = BD$.
Xét tam giác ACD và BCD có :
$AC = BD$ (cmt)
$AD = BC$ (cmt)
CD chung
Suy ra $\triangle ACD = \triangle BCD (c.c.c)|$
$\widehat{ACD} = \widehat{BDC}$ (vì tương ứng)
$\Rightarrow \triangle ECD$ cân tại $E \Rightarrow EC = ED$.

c) Ta có tam giác OCD cân ở O nên $OC = OD$
Vậy O thuộc trung trực của CD
Ta lại có $EC = ED$ (cmt).
Vậy E cũng thuộc trung trực của CD
Vậy OE là trung trực của CD', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/b55f6a5f-218a-48bd-a8c5-5997e6a550f0.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0063', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 19),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '1b68aa6b-9316-4f48-aa29-70ea70e0b822', 'a) Chứng minh $AMCN$ là hình bình hành

b) Chứng minh $AC,BD,MN$ đồng quy', NULL, 'a) Vì $AM$ là phân giác $\widehat{DAB}$ nên $\widehat{DAM} = \widehat{MAB}$.
Vì $AB \parallel DC$ nên $\widehat{MAB} = \widehat{AMD}$ (so le trong).
Suy ra $\widehat{DAM} = \widehat{AMD}$, do đó $\triangle ADM$ cân tại $D$, suy ra $DM = DA$.
Tương tự, vì $CN$ là phân giác $\widehat{BCD}$ nên $\widehat{BCN} = \widehat{NCD}$, và $AB \parallel DC$ nên $\widehat{BNC} = \widehat{NCD}$ (so le trong), suy ra $\widehat{BNC} = \widehat{BCN}$, do đó $\triangle BCN$ cân tại $B$, suy ra $BN = BC$.
Vì $AD = BC$ (cạnh đối hbh) nên $DM = BN$.
Ta có $AN = AB - BN$ và $MC = DC - DM$; mà $AB = DC$ và $BN = DM$ nên $AN = MC$.
Lại có $AN \parallel MC$ (vì $N \in AB$, $M \in DC$, $AB \parallel DC$).
Tứ giác $AMCN$ có cặp cạnh đối $MC, NA$ song song và bằng nhau nên $AMCN$ là hình bình hành.

b) Theo câu trên, $AMCN$ là hình bình hành, nên hai đường chéo $AC$ và $MN$ cắt nhau tại trung điểm $P$ của mỗi đường.
Mà $ABCD$ cũng là hình bình hành nên hai đường chéo $AC$ và $BD$ cắt nhau tại trung điểm $O$ của mỗi đường.
Cả $P$ và $O$ đều là trung điểm của đoạn $AC$, mà trung điểm một đoạn thẳng là duy nhất nên $P \equiv O$.
Vậy $O$ là điểm chung của cả ba đoạn $AC$, $BD$, $MN$, tức $AC$, $BD$, $MN$ đồng quy tại $O$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/0b22c308-eded-45c2-9d1c-7197334d3a9e.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0064', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 19),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '1b68aa6b-9316-4f48-aa29-70ea70e0b822', 'a) Chứng minh $AMCN$ là hình bình hành

b) Chứng minh $BMDN$ là hình bình hành', NULL, 'a) Vì $AM$ là phân giác $\widehat{DAB}$ nên $\widehat{DAM} = \widehat{MAB}$.
Vì $AB \parallel DC$ nên $\widehat{MAB} = \widehat{AMD}$ (so le trong).
Suy ra $\widehat{DAM} = \widehat{AMD}$, do đó $\triangle ADM$ cân tại $D$, suy ra $DM = DA$.
Tương tự, vì $CN$ là phân giác $\widehat{BCD}$ nên $\widehat{BCN} = \widehat{NCD}$, và $AB \parallel DC$ nên $\widehat{BNC} = \widehat{NCD}$ (so le trong), suy ra $\widehat{BNC} = \widehat{BCN}$, do đó $\triangle BCN$ cân tại $B$, suy ra $BN = BC$.
Vì $AD = BC$ (cạnh đối hbh) nên $DM = BN$.
Ta có $AN = AB - BN$ và $MC = DC - DM$; mà $AB = DC$ và $BN = DM$ nên $AN = MC$.
Lại có $AN \parallel MC$ (vì $N \in AB$, $M \in DC$, $AB \parallel DC$).
Tứ giác $AMCN$ có cặp cạnh đối $MC, NA$ song song và bằng nhau nên $AMCN$ là hình bình hành.

b) Theo chứng minh ở câu a), $DM = BN$ (từ hai tam giác cân $ADM$ và $BCN$).
Mà $DM$ và $BN$ đều nằm trên hai đường thẳng $DC$ và $AB$ song song với nhau, nên $DM \parallel BN$.
Tứ giác $BMDN$ có cặp cạnh đối $MD, NB$ song song và bằng nhau nên $BMDN$ là hình bình hành.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0065', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 18),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'abcbf25b-1631-499a-9acb-72715237bb56', 'a) Chứng minh $BMDN$ là hình bình hành

b) Chứng minh AC, BD, MN đồng quy', NULL, 'a) Vì $M$ là trung điểm $AB$ nên $MB = \dfrac{1}{2}AB$; vì $N$ là trung điểm $DC$ nên $DN = \dfrac{1}{2}DC$.
Mà $AB = DC$ (cạnh đối hình bình hành $ABCD$) nên $MB = DN$.
Lại có $MB \parallel DN$ (vì $M \in AB$, $N \in DC$, $AB \parallel DC$).
Tứ giác $BMDN$ có cặp cạnh đối $MB, ND$ song song và bằng nhau nên $BMDN$ là hình bình hành.

b) Gọi $O$ là giao điểm của $AC$ và $BD$ (trung điểm mỗi đường chéo).
Vì $BMDN$ là hình bình hành (câu a), hai đường chéo $BD$ và $MN$ của nó cắt nhau tại trung điểm mỗi đường.
Mà $O$ là trung điểm $BD$, và trung điểm một đoạn thẳng là duy nhất, nên $O$ cũng là trung điểm $MN$.
Vậy $O$ là điểm chung của $AC, BD, MN$, tức ba đường thẳng này đồng quy tại $O$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/d4e37545-82da-45f1-ad4d-84d911955e35.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0066', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '635fb2eb-1c6d-4ce0-ae41-d64c515132da', 'a) Chứng minh $\triangle AHD = \triangle CKB$


b) Chứng minh $AHCK$ là hình bình hành

c) Chứng minh $A,O, C$ thẳng hàng', NULL, 'a) a. Vì ABCD là hình bình hành nên $AD \parallel BC$, $AD = BC$.
Suy ra $\widehat{ADH} = \widehat{CBK}$ (hai góc so le trong)
Xét tam giác $\triangle AHD$ và $\triangle CKB$
$AD = BC$ (cmt)
$\widehat{ADH} = \widehat{CBK}$ (cmt)
$\widehat{AHD} = \widehat{CKB} = 90^\circ$
Vậy $\triangle AHD = \triangle CKB$ ($CH - GN$)


b) Gọi $O$ là giao điểm của hai đường chéo $AC$ và $BD$.
Xét $\triangle AOH$ và $\triangle COK$: $OA = OC$ (tính chất đường chéo hình bình hành); $\widehat{AOH} = \widehat{COK}$ (hai góc đối đỉnh, vì $A,O,C$ thẳng hàng và $H,O,K$ thẳng hàng); $\widehat{AHO} = \widehat{CKO} = 90^\circ$ (do $AH \perp BD$, $CK \perp BD$).
Suy ra $\triangle AOH = \triangle COK$ (cạnh huyền – góc nhọn), do đó $AH = CK$.
Mà $AH \parallel CK$ (cùng vuông góc với $BD$).
Tứ giác $AHCK$ có một cặp cạnh đối $AH, CK$ song song và bằng nhau nên $AHCK$ là hình bình hành.

c) Gọi $I$ là giao điểm của hai đường chéo $AC$ và $BD$.
Xét $\triangle AIH$ và $\triangle CIK$: $IA = IC$ (tính chất đường chéo hình bình hành $ABCD$); $\widehat{AIH} = \widehat{CIK}$ (đối đỉnh); $\widehat{AHI} = \widehat{CKI} = 90^\circ$.
Suy ra $\triangle AIH = \triangle CIK$ (cạnh huyền – góc nhọn), do đó $IH = IK$, nghĩa là $I$ là trung điểm của $HK$.
Theo giả thiết, $O$ là trung điểm của $HK$, mà trung điểm một đoạn thẳng là duy nhất nên $O \equiv I$.
Vậy $O$ là giao điểm của $AC$ và $BD$, suy ra $A$, $O$, $C$ thẳng hàng.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/0c1d8946-12b4-4896-999b-8e5984219301.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0067', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 18),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'abcbf25b-1631-499a-9acb-72715237bb56', 'a) Chứng minh $BMDN$ là hình bình hành

b) Chứng minh : $M,O,N$ thẳng hàng', NULL, 'a) Vì $M$ là trung điểm $AB$ nên $MB = \dfrac{1}{2}AB$; vì $N$ là trung điểm $DC$ nên $DN = \dfrac{1}{2}DC$.
Mà $AB = DC$ (cạnh đối hình bình hành $ABCD$) nên $MB = DN$.
Lại có $MB \parallel DN$ (vì $M \in AB$, $N \in DC$, $AB \parallel DC$).
Tứ giác $BMDN$ có cặp cạnh đối $MB, ND$ song song và bằng nhau nên $BMDN$ là hình bình hành.

b) Vì $BMDN$ là hình bình hành, hai đường chéo $BD$ và $MN$ cắt nhau tại trung điểm mỗi đường; gọi trung điểm đó là $O''$.
Mà $ABCD$ là hình bình hành nên trung điểm $BD$ cũng là trung điểm $AC$; theo giả thiết, $O$ là trung điểm $AC$, nên $O'' \equiv O$.
Vậy $O$ là trung điểm của $MN$, suy ra $M, O, N$ thẳng hàng.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/4bcc17a4-3b8d-4444-a7d5-32d3df6bd6bd.png', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/8e52cbf7-6086-40b0-9708-f5ba948db58c.png', 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0068', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 19),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '1b68aa6b-9316-4f48-aa29-70ea70e0b822', 'a) Chứng minh $AMCN$ là hình bình hành

b) Chứng minh :  $M,O,N$ thẳng hàng', NULL, 'a) Vì $AM$ là phân giác $\widehat{DAB}$ nên $\widehat{DAM} = \widehat{MAB}$.
Vì $AB \parallel DC$ nên $\widehat{MAB} = \widehat{AMD}$ (so le trong).
Suy ra $\widehat{DAM} = \widehat{AMD}$, do đó $\triangle ADM$ cân tại $D$, suy ra $DM = DA$.
Tương tự, vì $CN$ là phân giác $\widehat{BCD}$ nên $\widehat{BCN} = \widehat{NCD}$, và $AB \parallel DC$ nên $\widehat{BNC} = \widehat{NCD}$ (so le trong), suy ra $\widehat{BNC} = \widehat{BCN}$, do đó $\triangle BCN$ cân tại $B$, suy ra $BN = BC$.
Vì $AD = BC$ (cạnh đối hbh) nên $DM = BN$.
Ta có $AN = AB - BN$ và $MC = DC - DM$; mà $AB = DC$ và $BN = DM$ nên $AN = MC$.
Lại có $AN \parallel MC$ (vì $N \in AB$, $M \in DC$, $AB \parallel DC$).
Tứ giác $AMCN$ có cặp cạnh đối $MC, NA$ song song và bằng nhau nên $AMCN$ là hình bình hành.

b) Theo câu trên, $BMDN$ là hình bình hành, nên hai đường chéo $BD$ và $MN$ cắt nhau tại trung điểm mỗi đường.
Theo giả thiết, $O$ là trung điểm $BD$; mà trung điểm một đoạn thẳng là duy nhất nên $O$ cũng chính là trung điểm của $MN$.
Vậy $O \in MN$, suy ra $M, O, N$ thẳng hàng.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0069', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 25),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '4b643fc5-47c9-4d9a-9b79-8d389040a9d3', 'a) Chứng minh : ADHE là hình chữ nhật


b) Chứng minh : AM vuông góc với DE.', NULL, 'a) Xét tứ giác $ADHE$:
- $\widehat{DAE} = \widehat{BAC} = 90^\circ$ (giả thiết tam giác $ABC$ vuông tại $A$).
- $HD \perp AB$ tại $D$ nên $\widehat{ADH} = 90^\circ$.
- $HE \perp AC$ tại $E$ nên $\widehat{AEH} = 90^\circ$.

Tứ giác $ADHE$ có ba góc vuông ($\widehat{A} = \widehat{D} = \widehat{E} = 90^\circ$) nên $ADHE$ là hình chữ nhật.

b) Theo câu trên, $ADHE$ là hình chữ nhật.

Bước 1 — hệ thức lượng: Trong tam giác vuông $ABH$ (vuông tại $H$), $HD$ là đường cao ứng với cạnh huyền $AB$ nên $AD \cdot AB = AH^2$. Tương tự, trong tam giác vuông $ACH$ (vuông tại $H$), $HE$ là đường cao ứng với cạnh huyền $AC$ nên $AE \cdot AC = AH^2$. Suy ra $AD \cdot AB = AE \cdot AC$, tức là $\dfrac{AD}{AC} = \dfrac{AE}{AB}$.

Bước 2 — tam giác đồng dạng: Xét $\triangle ADE$ và $\triangle ACB$: có $\widehat{DAE} = \widehat{CAB}$ (cùng là góc $A$, vì $D \in AB$, $E \in AC$) và $\dfrac{AD}{AC} = \dfrac{AE}{AB}$ (bước 1), suy ra $\triangle ADE \sim \triangle ACB$ (c.g.c). Do đó $\widehat{ADE} = \widehat{ACB}$.

Bước 3 — góc tại đỉnh $A$: Vì $AM$ là trung tuyến ứng với cạnh huyền $BC$ của tam giác vuông $ABC$ nên $MA = MB = MC$, suy ra $\triangle AMC$ cân tại $M$, do đó $\widehat{MAC} = \widehat{ACB}$. Vì $E \in AC$ nên $\widehat{MAE} = \widehat{MAC} = \widehat{ACB}$.

Bước 4 — kết luận: Gọi $K = AM \cap DE$. Vì $D \in AB$ nên $\widehat{DAM} = \widehat{BAM}$; mà $\triangle ABM$ cân tại $M$ ($MA = MB$) nên $\widehat{BAM} = \widehat{ABM}$, và vì $M \in BC$ nên $\widehat{ABM} = \widehat{ABC}$. Xét $\triangle ADK$: $\widehat{ADK} = \widehat{ADE} = \widehat{ACB}$ (bước 2) và $\widehat{DAK} = \widehat{DAM} = \widehat{ABC}$ (trên). Suy ra $\widehat{AKD} = 180^\circ - \widehat{ACB} - \widehat{ABC} = 90^\circ$ (vì $\widehat{ABC} + \widehat{ACB} = 90^\circ$ trong tam giác vuông $ABC$). Vậy $AM \perp DE$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/bb5c95a3-969d-4173-b0b9-11a33a3fa7c0.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0070', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 25),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '4b643fc5-47c9-4d9a-9b79-8d389040a9d3', 'a) Chứng minh tam giác $IHA$ cân.


b) Chứng minh $IHK=90^\circ$.', NULL, 'a) Vì $AH$ là đường cao của tam giác vuông $ABC$ (vuông tại $A$) ứng với cạnh huyền $BC$, nên $AH\perp BC$ tại $H$, suy ra $\widehat{AHB}=90^\circ$.

Xét tam giác $AHB$ vuông tại $H$, có $I$ là trung điểm cạnh huyền $AB$. Theo tính chất đường trung tuyến ứng với cạnh huyền của tam giác vuông (bằng nửa cạnh huyền), ta có $IH=IA=IB=\dfrac{AB}{2}$.

Vậy $IA=IH$, suy ra tam giác $IHA$ cân tại $I$.

b) Chứng minh tương tự với tam giác vuông $AHC$ (vuông tại $H$) và $K$ là trung điểm cạnh huyền $AC$: $KH=KA=KC=\dfrac{AC}{2}$, suy ra tam giác $KHA$ cân tại $K$.

Theo câu trên, tam giác $IHA$ cân tại $I$ nên $\widehat{AHI}=\widehat{HAI}$; mà tia $AI$ trùng tia $AB$ (do $I$ là trung điểm $AB$) nên $\widehat{AHI}=\widehat{BAH}$.

Tương tự, tam giác $KHA$ cân tại $K$ nên $\widehat{AHK}=\widehat{HAK}=\widehat{CAH}$ (vì tia $AK$ trùng tia $AC$).

$I$ là trung điểm cạnh huyền $AB$ của tam giác vuông $AHB$ (vuông tại $H$) nên tia $HI$ nằm trong góc $\widehat{AHB}$; tương tự tia $HK$ nằm trong góc $\widehat{AHC}$. Do $H$ nằm giữa $B,C$ nên hai tia $HB,HC$ đối nhau, suy ra tia $HA$ nằm giữa hai tia $HI,HK$. Do đó:

$\widehat{IHK}=\widehat{AHI}+\widehat{AHK}=\widehat{BAH}+\widehat{CAH}=\widehat{BAC}=90^\circ$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0071', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 26),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '3c319ade-a28c-4d95-a5da-013cce71bef6', 'a)  Tứ giác $ADME$ là hình gì? Vì sao?


b)  Chứng minh ba điểm $A,I,M$ thẳng hàng.

c) Chứng minh $A,P,Q$ thẳng hàng và $A$ là trung điểm $PQ$.', NULL, 'a) Xét tứ giác $ADME$: $\widehat{DAE} = 90^\circ$ (do tam giác $ABC$ vuông tại $A$), $\widehat{ADM} = 90^\circ$ (do $MD \perp AB$), $\widehat{AEM} = 90^\circ$ (do $ME \perp AC$).
Tứ giác có ba góc vuông nên góc còn lại $\widehat{DME}$ cũng bằng $90^\circ$.
Vậy $ADME$ là hình chữ nhật.

b) Theo câu trên, $ADME$ là hình chữ nhật, có hai đường chéo $AM$ và $DE$.
Trong hình chữ nhật, hai đường chéo cắt nhau tại trung điểm của mỗi đường, nên trung điểm của $DE$ trùng với trung điểm của $AM$.
Theo giả thiết, $I$ là trung điểm của $DE$, suy ra $I$ cũng là trung điểm của $AM$, tức $I$ nằm trên đoạn thẳng $AM$.
Vậy ba điểm $A, I, M$ thẳng hàng.

c) Vì $MD \perp AB$ tại $D$ và $P$ thuộc tia đối của tia $DM$ với $DP = DM$, nên $D$ là trung điểm của $PM$ và $AB \perp PM$ tại $D$. Do đó $AB$ là đường trung trực của đoạn $PM$, suy ra $P$ là điểm đối xứng của $M$ qua đường thẳng $AB$.
Tương tự, $AC$ là đường trung trực của đoạn $QM$, suy ra $Q$ là điểm đối xứng của $M$ qua đường thẳng $AC$.

Vì $A$ nằm trên đường thẳng $AB$ (trục đối xứng biến $M$ thành $P$), nên $AP = AM$ và $\widehat{BAP} = \widehat{BAM}$.
Vì $A$ nằm trên đường thẳng $AC$ (trục đối xứng biến $M$ thành $Q$), nên $AQ = AM$ và $\widehat{CAQ} = \widehat{CAM}$.

Suy ra $AP = AQ = AM$.

Vì $M$ thuộc cạnh $BC$ nên tia $AM$ nằm giữa hai tia $AB, AC$, do đó $\widehat{BAM} + \widehat{MAC} = \widehat{BAC} = 90^\circ$.

Mặt khác $P$ và $M$ đối xứng nhau qua $AB$ nên $P$ nằm khác phía $M$ so với $AB$; tương tự $Q$ nằm khác phía $M$ so với $AC$. Do đó các tia $AP, AB, AM, AC, AQ$ nằm liên tiếp quanh $A$, và:
$\widehat{PAQ} = \widehat{PAB} + \widehat{BAM} + \widehat{MAC} + \widehat{CAQ} = \widehat{BAM} + \widehat{BAM} + \widehat{MAC} + \widehat{MAC} = 2(\widehat{BAM} + \widehat{MAC}) = 2 \cdot 90^\circ = 180^\circ$.

Vậy $\widehat{PAQ} = 180^\circ$, tức $P, A, Q$ thẳng hàng.

Vì $AP = AQ$ (chứng minh trên) và $A$ nằm giữa $P, Q$ (do $\widehat{PAQ} = 180^\circ$), nên $A$ là trung điểm của $PQ$.

Vậy $A, P, Q$ thẳng hàng và $A$ là trung điểm của $PQ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/8d24457f-3968-4420-adcb-f7fb078f1c7a.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0072', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '2929a790-b2db-4f1d-807d-2a461051d904', 'a) Chứng minh $\triangle ABM = \triangle DCM$ .

b) Chứng minh $\triangle ABD = \triangle DCA$ .

c) Chứng minh $AC \parallel BD$.

d) Gọi E, F lần lượt là trung điểm của DC và AC. AE cắt CM tại G. Chứng minh D, G, F thẳng hàng.

e) Gọi H là trung điểm của AB. Chứng minh E, M, F thẳng hàng.', NULL, 'a) Xét $\triangle ABM$ và $\triangle DCM$ có:

$AM = DM$ (giả thiết);

$\widehat{AMB} = \widehat{DMC}$ (hai góc đối đỉnh, vì $A, M, D$ thẳng hàng và $B, M, C$ thẳng hàng);

$BM = CM$ (vì $AM$ là trung tuyến nên $M$ là trung điểm $BC$).

Suy ra $\triangle ABM = \triangle DCM$ (c.g.c).

b) Theo câu trên, $\triangle ABM = \triangle DCM$ nên $AB = DC$ và $\widehat{MAB} = \widehat{MDC}$ (hai góc tương ứng).

Vì $M$ nằm giữa $A, D$ nên $\widehat{MAB} = \widehat{DAB}$ và $\widehat{MDC} = \widehat{ADC}$, do đó $\widehat{DAB} = \widehat{ADC}$.

Xét $\triangle ABD$ và $\triangle DCA$ có:

$AB = DC$ (chứng minh trên);

$\widehat{DAB} = \widehat{ADC}$ (chứng minh trên);

$AD = DA$ (cạnh chung).

Suy ra $\triangle ABD = \triangle DCA$ (c.g.c).

c) Theo câu trên, $\triangle ABD = \triangle DCA$ nên $\widehat{ADB} = \widehat{DAC}$ (hai góc tương ứng).

Vì $M$ là trung điểm $BC$ nên $B, C$ nằm khác phía đối với đường thẳng $AD$, do đó $\widehat{ADB}$ và $\widehat{DAC}$ là hai góc so le trong tạo bởi cát tuyến $AD$ với hai đường thẳng $DB$ và $AC$.

Hai góc so le trong bằng nhau nên $AC \parallel BD$.

d) Xét $\triangle ACD$: $M$ là trung điểm $AD$ nên $CM$ là đường trung tuyến của $\triangle ACD$ kẻ từ đỉnh $C$; $E$ là trung điểm $DC$ nên $AE$ là đường trung tuyến của $\triangle ACD$ kẻ từ đỉnh $A$; $F$ là trung điểm $AC$ nên $DF$ là đường trung tuyến của $\triangle ACD$ kẻ từ đỉnh $D$.

$G$ là giao điểm của hai đường trung tuyến $AE$ và $CM$ nên $G$ chính là trọng tâm của $\triangle ACD$.

Vì ba đường trung tuyến của một tam giác đồng quy tại trọng tâm, nên đường trung tuyến $DF$ cũng đi qua $G$. Vậy $D, G, F$ thẳng hàng.

e) (Ghi chú cho người duyệt: đề mục này nêu điểm $H$ nhưng câu hỏi lại nhắc điểm $F$ của câu trước — kiểm bằng toạ độ thấy $E, M, F$ (với $F$ = trung điểm $AC$) KHÔNG thẳng hàng, còn $E, M, H$ (với $H$ = trung điểm $AB$ vừa nêu trong đề) thẳng hàng đúng như một tính chất tổng quát. Nhiều khả năng đề gõ nhầm $F$ thành $H$ — lời giải dưới đây chứng minh $E, M, H$ thẳng hàng, cần xác nhận lại với đề gốc.)

Gọi $H$ là trung điểm $AB$. Xét $\triangle AHM$ và $\triangle DEM$ có:

$AH = DE$ (vì $AH = \dfrac{1}{2}AB$, $DE = \dfrac{1}{2}DC$, mà $AB = DC$ theo BT.08.259);

$\widehat{HAM} = \widehat{EDM}$ (chính là $\widehat{MAB} = \widehat{MDC}$ đã chứng minh ở BT.08.260, vì $H$ thuộc tia $AB$ và $E$ thuộc tia $DC$);

$AM = DM$ (giả thiết).

Suy ra $\triangle AHM = \triangle DEM$ (c.g.c), do đó $\widehat{AMH} = \widehat{DME}$ (hai góc tương ứng).

Vì $A, M, D$ thẳng hàng nên $\widehat{AMH}$ và $\widehat{HMD}$ kề bù: $\widehat{HMD} = 180^\circ - \widehat{AMH}$.

Suy ra $\widehat{HMD} + \widehat{DME} = 180^\circ - \widehat{AMH} + \widehat{AMH} = 180^\circ$, mà hai góc này kề nhau (chung tia $MD$), nên $\widehat{HME} = 180^\circ$. Vậy $H, M, E$ thẳng hàng.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0073', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 11),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '47e2c5f9-aaf9-4b11-bc80-a892bf8e7b66', 'Cho tứ giác $MNPQ$ có $\widehat{N} + \widehat{Q} = 180^\circ$ và $PN = PQ$. Qy là tia đối của tia QM. Chứng minh Chứng minh: $\widehat{PQy} = \widehat{PNM}$', NULL, 'Ta có $\widehat{N} + \widehat{Q} = 180^0$ (giả thiết)
Mà $\widehat{PQM} + \widehat{PQy} = 180^0$ (hai góc kề bù)
Suy ra $\widehat{PQy} = \widehat{PNM}$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/37537ea3-2d0d-4187-8eb9-1fe5faf70931.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0080', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 11),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '47e2c5f9-aaf9-4b11-bc80-a892bf8e7b66', 'Cho tứ giác $MNPQ$ có $N + Q = 180^\circ$ và $PN = PQ$. Qy là tia đối của tia QM␞Chứng minh: $\widehat{PQy} = \widehat{PNM}$', NULL, 'Ta có $\widehat{N} + \widehat{Q} = 180^0$ (giả thiết)Mà $\widehat{PQM} + \widehat{PQy} = 180^0$ (hai góc kề bù)Suy ra $\widehat{PQy} = \widehat{PNM}$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/2d9d8116-98ae-4930-8269-91e34c8fb8d5.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0081', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 13),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'd8b8a6b8-3ec3-4e64-9455-7aa106e19850', 'Cho tứ giác $MNPQ$ có $\widehat{M} = \widehat{N}$ và $NP = MQ$.. Chứng minh Góc $\widehat{PQM}$ bằng góc $\widehat{QPN}$', NULL, 'Xét tam giác PMQ và QNP có
PQ chung
MQ = NP (gt)
PM = QN (cmt)
Suy ra $\triangle PMQ = \triangle QNP (c.c.c)$
Suy ra $\widehat{PQM} = \widehat{QPN}$ (vì tương ứng)', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/34174307-631e-4b39-9e6e-7afeaf95445c.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0089', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 13),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'd8b8a6b8-3ec3-4e64-9455-7aa106e19850', 'Cho tứ giác $MNPQ$ có $\widehat{M} = \widehat{N}$ và $NP = MQ$.. Chứng minh $\triangle QMN=\triangle PNM$ , từ đó suy ra $QN=PM$', NULL, '(tự giải theo phương pháp chuẩn)', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/17da9a27-7726-47de-8409-0b11dc6353a9.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0099', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '635fb2eb-1c6d-4ce0-ae41-d64c515132da', 'Cho hình bình hành ABCD.; Kẻ AE, CF vuông góc với BD. a. Chứng minh $\triangle AED = \triangle CFB$ b. Chứng minh : BE = DF', NULL, 'a. Vì ABCD là hình bình hành nên $AD \parallel BC$, $AD = BC$. Suy ra $\widehat{ADE} = \widehat{CBF}$ (hai góc so le trong) Xét tam giác $\triangle AED$ và $\triangle CFB$ $AD = BC$ (cmt) $\widehat{ADE} = \widehat{CBF}$ (cmt) $\widehat{AED} = \widehat{CFB} = 90^\circ$ Vậy $\triangle AED = \triangle CFB$ ($CH - GN$) b. Suy ra $DE = BF$ (vì tương ứng) Nên $DE + EF = BF + EF$ Suy ra $DF = BE$ (dpcm)', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/53217867-32ac-4caf-b1c2-3f78c74fa12d.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0104', ma_cau from ins;

with bai as (select ma_bai from _hh_bai_ma where thu_tu = 10),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0003'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '37a807ec-e9fd-4353-b80a-9cef46e27640', 'Cho tứ giác $ABCD$ có $\hat{A}+\hat{C}=180^\circ$. Hai cạnh $AD$ và $BC$ cắt nhau tại $E$, hai cạnh $DC$ và $AB$ cắt nhau tại $F$. Kẻ tia phân giác của các góc $\widehat{CED}$ và $\widehat{BFC}$, các tia phân giác này cắt nhau tại $I$.
Chứng minh : $IE \perp IF$', NULL, 'Giải :
Gọi $K$ là giao điểm của $FI$ và $BC$.
Xét $\triangle IKE$ có $\widehat{EIF}$ là góc ngoài đỉnh $I \Rightarrow \widehat{EIF} = \widehat{EKI} + \widehat{IEK}$ (1)
Xét $\triangle FBK$ có $\widehat{EKI}$ là góc ngoài đỉnh $K \Rightarrow \widehat{EKI} = \hat{B} + \widehat{BFK}$ (2)
Từ (1) và (2) suy ra: $\widehat{EIF} = \hat{B} + \widehat{BFK} + \widehat{IEK}$. (3)
Lại có: $\widehat{BFK} = \dfrac{1}{2} \widehat{BFC}$ ($FK$ là tia phân giác của góc $BFC$)
$= \dfrac{1}{2} (180^\circ - \hat{B} - \hat{C})$ (tổng các góc trong $\triangle BFC$)
Tương tự: $\widehat{IEK} = 90^\circ - \dfrac{\hat{A} + \hat{B}}{2}$
Thay (4) và (5) vào (3) ta có:
$\widehat{EIF} = \hat{B} + 90^\circ - \dfrac{\hat{B} + \hat{C}}{2} + 90^\circ - \dfrac{\hat{A} + \hat{B}}{2}$
$= 180^\circ - \dfrac{\hat{A} + \hat{C}}{2} = \dfrac{360^\circ - (\hat{A} + \hat{C})}{2} = \dfrac{\hat{B} + \hat{D}}{2}$
Mà $\hat{A} + \hat{B} + \hat{C} + \hat{D} = 360^\circ$; $\hat{A} + \hat{C} = 180^\circ$ (gt) $\Rightarrow \hat{B} + \hat{D} = 180^\circ$
Suy ra $\widehat{EIF} = \dfrac{180^\circ}{2} = 90^\circ \Rightarrow IE \perp IF$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/4c41196a-30bd-40e3-975a-d3714d4000f7.png', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/19205c20-dace-4197-8954-cdacfc0964aa.png', 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0074', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 10),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0003'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '37a807ec-e9fd-4353-b80a-9cef46e27640', 'Cho tứ giác MNPQ. MQ cắt NP tại R. MN cắt QP tại S. Gọi T là giao điểm của tia phân giác góc $\widehat{NSP}$ và tia phân giác góc $\widehat{NRM}$. Chứng minh $\widehat{RTS} = \dfrac{\widehat{N}+\widehat{Q}}{2}$.', NULL, 'Gọi $L$ là giao điểm của $ST$ và $NP$.
Trong $\triangle TLR$ có $\widehat{RTS}$ là góc ngoài tại đỉnh $T \Rightarrow \widehat{RTS} = \widehat{RLS} + \widehat{TRL}$ (1)
Trong $\triangle SLN$ có $\widehat{RLS}$ là góc ngoài tại đỉnh $L \Rightarrow \widehat{RLS} = \widehat{N} + \widehat{NSL}$ (2)
Từ (1) và (2) suy ra:$\widehat{RTS} = \widehat{N} + \widehat{NSL} + \widehat{TRL}$. (3)
Lại có: $\widehat{NSL} = \dfrac{1}{2}\widehat{NSP}$ ($SL$ là tia phân giác của góc $\widehat{NSP}$)$= \dfrac{1}{2}.(180^\circ - \widehat{N} - \widehat{P})$ (tổng các góc trong $\triangle NSP$)
Tương tự: $\widehat{TRL} = 90^\circ - \dfrac{\widehat{M}+\widehat{N}}{2}$
Thay (4) và (5) vào (3) ta có:   
$\widehat{RTS} = \widehat{N} + 90^\circ - \dfrac{\widehat{N}+\widehat{P}}{2} + 90^\circ - \dfrac{\widehat{M}+\widehat{N}}{2}$$= 180^\circ - \dfrac{\widehat{M}+\widehat{P}}{2} = \dfrac{360^\circ - (\widehat{M}+\widehat{P})}{2} = \dfrac{\widehat{N}+\widehat{Q}}{2}$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/ea22a48a-cd73-4e9f-8142-38edd43a88c8.png', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/4a3313f0-7223-4555-9463-0afe9564d2ee.png', 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0075', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0005'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'f048bbd0-ed90-4bbb-b11d-067b7266d89f', 'Cho tứ giác $ABCD$ và điểm $M$ nằm trong tứ giác.
Chứng minh: $MA + MB + MC + MD \geq AB + CD$.', NULL, 'Giải :
Ta có : $MA + MB \geq AB; MC + MD \geq CD$
Suy ra $MA + MB + MC + MD \geq AB + CD$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/0294964a-8e12-4150-b1de-ed2f6a099c9f.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0076', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0005'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'f048bbd0-ed90-4bbb-b11d-067b7266d89f', 'Cho tứ giác $ABCD$ và điểm $M$ nằm trong tứ giác.
Chứng minh : $MA + MB + MC + MD \ge \dfrac{1}{2}.(AB + BC + CD + DA)$', NULL, 'Giải
$MA + MB \ge AB; MC + MD \ge CD$
$MA + MD \ge AD; MB + MC \ge BC$.
$\Rightarrow 2(MA + MB + MC + MD) \ge AB + BC + CD + DA$
Suy ra $MA + MB + MC + MD \ge \dfrac{1}{2}.(AB + BC + CD + DA)$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/af70c723-4b1d-4023-8e1f-6cf4de008ec3.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0077', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0005'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'f048bbd0-ed90-4bbb-b11d-067b7266d89f', 'Cho tứ giác ABCD. M là điểm nằm trong tứ giác.
Chứng minh : $MA+MB+MC+MD \ge AC+BD$', NULL, 'Giải :
Áp dụng tính chất của bất đẳng thức tam giác.
Xét tam giác AMC có : $MA+MC \ge AC$
Xét tam giác BMD có : $MB+MD \ge BD$
Từ đó suy ra $MA+MB+MC+MD \ge AC+BD$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/377ae445-fe7d-4575-8c47-cfdafc9b927e.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0078', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0005'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'f048bbd0-ed90-4bbb-b11d-067b7266d89f', 'Cho tứ giác MNPQ. MP cắt NQ tại O. Chứng minh Chứng minh rằng : $MP + NQ > \dfrac{MN + NP + PQ + QM}{2}$', NULL, 'Áp dụng tính chất của bất đẳng thức tam giác
Xét tam giác OMN có : $OM+ON > MN$
Xét tam giác ONP có : $ON+OP > NP$
Xét tam giác OPQ có : $OP+OQ > PQ$
Xét tam giác OQM có : $OQ+OM > QM$
Từ đó suy ra:
$2(OM+ON+OP+OQ) > MN+NP+PQ+QM$
$2(MP+NQ) > MN+NP+PQ+QM$
$\Rightarrow MP+NQ > \dfrac{MN+NP+PQ+QM}{2}$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/dbca7767-b9f8-43d8-97fa-2be17e3f8f2d.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0079', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0004'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'f048bbd0-ed90-4bbb-b11d-067b7266d89f', 'Cho tứ giác MNPQ. MP cắt NQ tại K. Chứng minh Chứng minh rằng : $MP + NQ < MN + NP + PQ + QM$', NULL, 'Áp dụng tính chất của bất đẳng thức tam giác ta có :
Xét tam giác MNP có: $MN + NP > MP$
Xét tam giác MQP có: $MQ + QP > MP$
Xét tam giác NMQ có: $NM + MQ > NQ$
Xét tam giác NPQ có: $NP + PQ > NQ$
Từ đó suy ra : $2(MN+NP+PQ+QM)>2(MP+NQ)$
Suy ra $MP + NQ < MN + NP + PQ + QM$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/f2c394d2-92a7-490b-952f-1abe62b9ed27.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0082', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0018'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'f048bbd0-ed90-4bbb-b11d-067b7266d89f', 'Tính các góc chưa biết của các tứ giác trong hình dưới đây:', NULL, 'Giải :
Ta có $\widehat{P}+\widehat{Q}+\widehat{R}+\widehat{S}=360^0 \Rightarrow \widehat{Q}=360^0-\widehat{P}-\widehat{R}-\widehat{S}=360^0-90^0-90^0-100^0=80^0$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/72c65651-b718-4f54-be28-4de6e7559f1e.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0083', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0018'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'f048bbd0-ed90-4bbb-b11d-067b7266d89f', 'Tính các góc chưa biết của các tứ giác trong hình dưới đây:', NULL, 'Giải :
Ta có $\widehat{G} + \widehat{GHI} + \widehat{I} + \widehat{IKG} = 360^0$
Mà $\widehat{GHI} = 180^0 - 45^0 = 135^0$; $\widehat{IKG} = 180^0 - 120^0 = 60^0$
Suy ra $\widehat{I} = 360^0 - \widehat{G} - \widehat{GHI} - \widehat{IKG} = 360^0 - 105^0 - 135^0 - 60^0 = 60^0$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/c9f56533-0d5f-4947-b82d-bd1336ab82ac.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0084', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0018'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'f048bbd0-ed90-4bbb-b11d-067b7266d89f', 'Tính các góc chưa biết của các tứ giác trong hình dưới đây:', NULL, 'Giải:
Ta có $\widehat{NPQ}=180^0-60^0=120^0$
Mà $\widehat{M}+\widehat{N}+\widehat{NPQ}+\widehat{Q}=360^0 \Rightarrow \widehat{M}=360^0-60^0-120^0-100^0=80^0$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/576ebff3-5696-491a-80ef-b82f1ca266ca.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0085', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0018'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'f048bbd0-ed90-4bbb-b11d-067b7266d89f', 'Tính các góc chưa biết của các tứ giác trong hình dưới đây:', NULL, 'Giải :
Ta có $\widehat{A}+\widehat{B}+\widehat{C}+\widehat{D}=360^0$
Mà $\widehat{B}=\widehat{C}=\widehat{D}$; $\widehat{A}=120^0 \Rightarrow 120^0+3\widehat{B}=360^0 \Rightarrow \widehat{B}=80^0 \Rightarrow \widehat{C}=\widehat{D}=80^0$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/bec3b8cd-5a75-4a4f-b613-ff944c4521c4.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0086', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0018'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'f048bbd0-ed90-4bbb-b11d-067b7266d89f', 'Cho tứ giác $ABCD$ có $\hat{B} + \hat{C} = 200^\circ$; $\hat{B} + \hat{D} = 180^\circ$; $\hat{C} + \hat{D} = 120^\circ$. Tính số đo các góc của tứ giác $ABCD$.', NULL, 'Cộng các vế ta được $2(\hat{B} + \hat{C} + \hat{D}) = 200^\circ + 180^\circ + 120^\circ = 500^\circ$
$\hat{B} + \hat{C} + \hat{D} = 250^\circ \Rightarrow \hat{A} = 360^\circ - 250^\circ = 110^\circ; \hat{B} = 250^\circ - 120^\circ = 130^\circ$; Tương tự $\hat{C} = 70^\circ; \hat{D} = 50^\circ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/0e885362-ad3a-495e-8d94-b774ff267f1a.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0087', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 13),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0048'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'd8b8a6b8-3ec3-4e64-9455-7aa106e19850', 'Cho tứ giác $MNPQ$ có $\widehat{M} = \widehat{N}$ và $NP = MQ$.. Chứng minh $MN//PQ$', NULL, 'Ta có $\widehat{MNP} + \widehat{NPQ} + \widehat{PQM} + \widehat{QMN} = 360^0$Mà $\widehat{QMN} = \widehat{MNP}(gt) ; \widehat{PQM} = \widehat{QPN}(cmt)$Suy ra $2(\widehat{QMN} + \widehat{PQM}) = 360^0 \Rightarrow \widehat{QMN} + \widehat{PQM} = 180^0$Gọi Mx là tia đối của tia MN. Suy ra $\widehat{QMX} + \widehat{QMN} = 180^0$Suy ra $\widehat{QMX} = \widehat{PQM}$.Mà $\widehat{QMX}$ và $\widehat{PQM}$ là 2 góc ở vị trí so le trong đối với MN và PQSuy ra MN $\parallel$ PQ', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/793dbb06-9689-4bc0-acf3-b819285de0ea.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0088', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0020'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '635fb2eb-1c6d-4ce0-ae41-d64c515132da', 'Cho hình bình hành ABCD.; Kẻ AE, CF vuông góc với CD, AB.. a. Chứng minh rằng $\triangle AED = \triangle CFB$\nb. Chứng minh $DE = BF$ và $DE \parallel BF$', NULL, 'a. Vì ABCD là hình bình hành nên $AD = BC$ ; $\widehat{D} = \widehat{B}$\nXét $\triangle AED$ và $\triangle CFB$ có :\n$AD = BC$ (cmt)\n$\widehat{D} = \widehat{B}$ (cmt)\n$\widehat{AED} = \widehat{CFB} = 90^o$\nSuy ra $\triangle AED = \triangle CFB (CH - GN)$\nb. Suy ra $DE = CF$ (vì tương ứng)\nMà ABCD là hình bình hành nên $AB \parallel CD$\nE thuộc CD, F thuộc AB nên $DE \parallel BF$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/5ff4dc9f-5e49-4549-969e-19643ff75cc5.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0090', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0020'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '635fb2eb-1c6d-4ce0-ae41-d64c515132da', 'Cho hình bình hành ABCD.; Kẻ AM, CN vuông góc với CD, AB.. a. Chứng minh rằng $\triangle AMD = \triangle CNB$
b. Chứng minh $DM = BN$ và $DM \parallel BN$', NULL, 'a. Vì ABCD là hình bình hành nên $AD = BC$ ; $\widehat{D} = \widehat{B}$
Xét $\triangle AMD$ và $\triangle CNB$ có :
$AD = BC$ (cmt)
$\widehat{D} = \widehat{B}$ (cmt)
$\widehat{AMD} = \widehat{CNB} = 90^o$
Suy ra $\triangle AMD = \triangle CNB (CH - GN)$
b. Suy ra $DM = BN$ (vì tương ứng)
Mà ABCD là hình bình hành nên $AB \parallel CD$
M thuộc CD, N thuộc AB nên $DM \parallel BN$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/416c3ff4-daa2-4ba0-82ab-d01bcb5c2442.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0091', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 3),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0013'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'd27e8f09-58b2-41e3-98cf-e3995c10e45d', 'Cho hình thang cân $ABCD(AB\parallel CD)$ có $\hat{A}=3\hat{D}$. Tính số đo các góc của hình thang cân $ABCD$.', NULL, 'Giải :
Vì $ABCD$ là hình thang cân nên có: $\hat{A}+\hat{D}=180^\circ; \hat{C}=\hat{D}; \hat{A}=\hat{B}$
Mà $\hat{A}=3\hat{D}$ nên $3\hat{D}+\hat{D}=180^\circ \Rightarrow 4\hat{D}=180^\circ \Rightarrow \hat{D}=45^\circ$
$\hat{C}=\hat{D}=45^\circ; \hat{A}=3\hat{C}=135^\circ \Rightarrow \hat{B}=\hat{A}=135^\circ$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/e5c401a9-d209-4704-a698-393d57168013.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0092', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 3),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0013'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'd27e8f09-58b2-41e3-98cf-e3995c10e45d', 'Cho hình thang cân $ABCD$ ($AB\parallel CD$) có $\hat{A}=3\hat{C}$. Tính số đo các góc của hình thang cân $ABCD$.', NULL, 'Giải :
Vì $ABCD$ là hình thang cân nên có: $\hat{A}+\hat{D}=180^\circ$; $\hat{C}=\hat{D}$; $\hat{A}=\hat{B}$.
mà $\hat{A}=3\hat{C}$; nên suy ra $3\hat{C}+\hat{C}=180^\circ \Rightarrow 4\hat{C}=180^\circ \Rightarrow \hat{C}=45^\circ$.
$\Rightarrow \hat{D}=\hat{C}=45^\circ$.
$\Rightarrow \hat{A}=3\hat{C}=135^\circ$; $\hat{B}=\hat{A}=135^\circ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/e5c401a9-d209-4704-a698-393d57168013.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0093', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 3),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0013'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'd27e8f09-58b2-41e3-98cf-e3995c10e45d', 'Cho hình thang cân ABCD, AB // CD.. Chứng minh Tính số đo các góc của hình thang cân  $ABCD$.', NULL, 'Vì $ABCD$ là hình thang cân nên có: $\widehat{A}+\widehat{D}=180^\circ$; $\widehat{C}=\widehat{D}$; $\widehat{A}=\widehat{B}$
mà $\widehat{A}=2.\widehat{C}$; nên suy ra $2\widehat{C}+\widehat{C}=180^\circ \Rightarrow 3\widehat{C}=180^\circ \Rightarrow \widehat{C}=60^\circ$
$\Rightarrow \widehat{D}=\widehat{C}=60^\circ$.
$\Rightarrow \widehat{A}=2\widehat{C}=120^\circ$; $\widehat{B}=\widehat{A}=120^\circ$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/e5c401a9-d209-4704-a698-393d57168013.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0094', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 3),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0013'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'd27e8f09-58b2-41e3-98cf-e3995c10e45d', '2A. Cho hình thang cân $ABCD$ ($AB \parallel CD$) có $\widehat{B} = 4\widehat{D}$. Tính số đo các góc của hình thang cân $ABCD$.', NULL, 'Giải :
Vì $ABCD$ là hình thang cân nên có: $\widehat{A} + \widehat{D} = 180^\circ$; $\widehat{C} = \widehat{D}$; $\widehat{A} = \widehat{B}$.
mà $\widehat{B} = 4\widehat{D}$, hay $\widehat{A} = 4\widehat{C}$; nên suy ra $4\widehat{C} + \widehat{C} = 180^\circ \Rightarrow 5\widehat{C} = 180^\circ \Rightarrow \widehat{C} = 36^\circ$.
$\Rightarrow \widehat{D} = \widehat{C} = 36^\circ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/e5c401a9-d209-4704-a698-393d57168013.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0095', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 3),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0013'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'd27e8f09-58b2-41e3-98cf-e3995c10e45d', '3A. Cho hình thang cân $ABCD$ ($AB \parallel CD$) có $\widehat{A} - \widehat{C} = 40^\circ$. Tính số đo các góc của hình thang cân $ABCD$.', NULL, 'Giải:
Vì $ABCD$ là hình thang cân nên có: $\widehat{A} + \widehat{D} = 180^\circ$; $\widehat{C} = \widehat{D}$; $\widehat{A} = \widehat{B}$.
Do $\widehat{C} = \widehat{D}$ nên $\widehat{A} + \widehat{C} = 180^\circ$.
mà $\widehat{A} - \widehat{C} = 40^\circ$; nên suy ra $2\widehat{A} = 220^\circ \Rightarrow \widehat{A} = 110^\circ$.
$\Rightarrow \widehat{B} = \widehat{A} = 110^\circ$.
$\Rightarrow \widehat{C} = 180^\circ - \widehat{A} = 70^\circ$; $\widehat{D} = \widehat{C} = 70^\circ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/e5c401a9-d209-4704-a698-393d57168013.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0096', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 3),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0013'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'd27e8f09-58b2-41e3-98cf-e3995c10e45d', '4A. Cho hình thang cân $ABCD$ ($AB \parallel CD$) có $\hat{A}=5\hat{D}$. Tính số đo các góc của hình thang cân $ABCD$.', NULL, 'Giải:
Vì $ABCD$ là hình thang cân nên có: $\hat{A} + \hat{D} = 180^\circ$; $\hat{C} = \hat{D}$; $\hat{A} = \hat{B}$.
mà $\hat{A} = 5\hat{D}$, hay $\hat{A} = 5\hat{C}$; nên suy ra $5\hat{C} + \hat{C} = 180^\circ \Rightarrow 6\hat{C} = 180^\circ \Rightarrow \hat{C} = 30^\circ$.
$\Rightarrow \hat{D} = \hat{C} = 30^\circ$.
$\Rightarrow \hat{A} = 5\hat{C} = 150^\circ$; $\hat{B} = \hat{A} = 150^\circ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/e5c401a9-d209-4704-a698-393d57168013.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0097', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 3),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0013'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'd27e8f09-58b2-41e3-98cf-e3995c10e45d', 'Cho hình thang cân $ABCD$ ($AB\parallel CD$) có $\hat{B}-\hat{D}=60^\circ$. Tính số đo các góc của hình thang cân $ABCD$.', NULL, 'Vì $ABCD$ là hình thang cân nên có: $\hat{A}+\hat{D}=180^\circ$; $\hat{C}=\hat{D}$; $\hat{A}=\hat{B}$.
Do $\hat{C}=\hat{D}$ và $\hat{A}=\hat{B}$ nên $\hat{B}-\hat{D}=\hat{A}-\hat{C}$.
mà $\hat{B}-\hat{D}=60^\circ$; nên suy ra $\hat{A}-\hat{C}=60^\circ$.
Lại có $\hat{A}+\hat{C}=180^\circ$ nên suy ra $2\hat{A}=240^\circ \Rightarrow \hat{A}=120^\circ$.
$\Rightarrow \hat{B}=\hat{A}=120^\circ$.
$\Rightarrow \hat{C}=180^\circ-\hat{A}=60^\circ$; $\hat{D}=\hat{C}=60^\circ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/e5c401a9-d209-4704-a698-393d57168013.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0098', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0002'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '635fb2eb-1c6d-4ce0-ae41-d64c515132da', 'Cho hình bình hành ABCD.; AC cắt DB tại O. Một đường thẳng bất kì qua O cắt AD tại E và cắt CB tại F. Chứng minh : $AE = CF$', NULL, 'Vì ABCD là hình bình hành nên $AD \parallel CB$. \n O là giao điểm AC và DB thì O là trung điểm của AC và DB.\nDo $AD \parallel CB$ nên $\widehat{EAO} = \widehat{FCO}$ (hai góc so le trong)\nO là trung điểm AC nên OA = OC\nXét $\triangle OAE$ và $\triangle OCF$ có :\nOA = OC (cmt)\n$\widehat{EAO} = \widehat{FCO}$ (cmt)\n$\widehat{AOE} = \widehat{COF}$ (hai góc đối đỉnh)\nVậy $\triangle OAE = \triangle OCF (g.c.g)$\nSuy ra AE = CF (vì tương ứng)', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/089827e8-d7ce-48e3-8f1a-bd4bd14683fe.svgxml', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0100', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0001'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '635fb2eb-1c6d-4ce0-ae41-d64c515132da', 'Cho hình bình hành ABCD.; E,F lần lượt là trung điểm của AB,CD. a. Chứng minh : $\triangle AED = \triangle CFB$ b. Chứng minh : $DE = BF$ và $DE \parallel BF$', NULL, 'Vì ABCD là hình bình hành nên $AB \parallel CD$, $AB = CD$, $AD = BC$, $\widehat{A} = \widehat{C}$ \nE là trung điểm AB nên $EA = EB = \dfrac{AB}{2}$F là trung điểm CD nên $FC = FD = \dfrac{CD}{2}$Do AB = CD nên $EA = EB = FC = FD$Xét $\triangle AED$ và $\triangle CFB$ có :$AD = BC$ (cmt)$AE = CF$ (cmt)$\widehat{A} = \widehat{C}$ (cmt)Vậy $\triangle AED = \triangle CFB$ (c.g.c)b. Suy ra DE = BF (vì tương ứng)$\widehat{AED} = \widehat{CFB}$ (vì tương ứng)Mặt khác ta có $AB \parallel CD$Suy ra $\widehat{CFB} = \widehat{ABF}$ (hai góc so le trong)Vậy $\widehat{AED} = \widehat{ABF}$Mà $\widehat{AED}$ ; $\widehat{ABF}$ là hai góc ở vị trí đồng vịSuy ra $DE \parallel BF$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/37351bc9-393f-4269-bc9f-7fa156d0a03a.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0101', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 11),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0057'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '47e2c5f9-aaf9-4b11-bc80-a892bf8e7b66', 'Cho tứ giác $MNPQ$ có $\widehat{N} + \widehat{Q} = 180^\circ$ và $PN = PQ$. Qy là tia đối của tia QM. Chứng minh Chứng minh $PM$ là tia phân giác của góc $\widehat{NMQ}$.', NULL, 'Kẻ $PF \perp QM$; $PE \perp MN$
Theo câu trước, ta dễ dàng chứng minh được $\widehat{PQF} = \widehat{PNE}$
Xét 2 tam giác PQF và PNE có :
$\widehat{PQF} = \widehat{PNE}$ (cmt)
$\widehat{PFQ} = \widehat{PEN} = 90^o$
$PQ = PN(gt)$
Vậy $\triangle PQF = \triangle PNE (CH - GN)$
Suy ra $PF = PE$ (vì tương ứng)
Suy ra PM là phân giác của góc $\widehat{NMQ}$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/dde9ad5e-3abc-459d-aef4-e20eca33437e.png', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/d176f9f7-7c2a-4246-a077-94f6d45d6223.png', 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0102', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 11),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0057'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '47e2c5f9-aaf9-4b11-bc80-a892bf8e7b66', 'Cho tứ giác $MNPQ$ có $N + Q = 180^\circ$ và $PN = PQ$. Qy là tia đối của tia QM␞Chứng minh $PM$ là tia phân giác của góc $\widehat{NMQ}$.', NULL, 'Kẻ $PS \perp QM$; $PR \perp NM$Theo câu trước, ta dễ dàng chứng minh được $\widehat{PQS} = \widehat{PNR}$Xét 2 tam giác PQS và PNR có :$\widehat{PQS} = \widehat{PNR}$ (cmt)$\widehat{PSQ} = \widehat{PRN} = 90^o$$PQ = PN(gt)$Vậy $\triangle PQS = \triangle PNR (CH - GN)$Suy ra $PS = PR$ (vì tương ứng)Suy ra PM là phân giác của góc $\widehat{NMQ}$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/0a8b1ed6-42ed-4caa-bd72-8ec3b563dcf9.png', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/f753f0b9-f0e4-42f8-bd88-cb83f8c0a1c5.png', 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0103', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0006'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'f048bbd0-ed90-4bbb-b11d-067b7266d89f', 'Bài 2. Cho tứ giác MNPQ. Biết rằng số đo các góc M, N, P, Q lần lượt tỉ lệ với 1, 3, 4, 4. Tính số đo các góc của tứ giác MNPQ.', NULL, 'Giải
Vì số đo các góc M, N, P, Q lần lượt tỉ lệ với 1, 3, 4, 4 nên ta có:
$\dfrac{\widehat{M}}{1}=\dfrac{\widehat{N}}{3}=\dfrac{\widehat{P}}{4}=\dfrac{\widehat{Q}}{4}=\dfrac{\widehat{M}+\widehat{N}+\widehat{P}+\widehat{Q}}{1+3+4+4}=\dfrac{360^\circ}{12}=30^\circ$
Vậy:
$\widehat{M}=30^\circ\times 1=30^\circ$
$\widehat{N}=30^\circ\times 3=90^\circ$
$\widehat{P}=30^\circ\times 4=120^\circ$
$\widehat{Q}=30^\circ\times 4=120^\circ$', NULL, NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0105', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0006'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'f048bbd0-ed90-4bbb-b11d-067b7266d89f', 'Bài 1. Cho tứ giác ABCD. Biết rằng số đo các góc A, B, C, D lần lượt tỉ lệ với 2, 3, 4, 6. Tính số đo các góc của tứ giác ABCD.', NULL, 'Giải
Vì số đo các góc A, B, C, D lần lượt tỉ lệ với 2, 3, 4, 6 nên ta có:
$\dfrac{\widehat{A}}{2} = \dfrac{\widehat{B}}{3} = \dfrac{\widehat{C}}{4} = \dfrac{\widehat{D}}{6} = \dfrac{\widehat{A} + \widehat{B} + \widehat{C} + \widehat{D}}{2+3+4+6} = \dfrac{360^\circ}{15} = 24^\circ$
Vậy:
$\widehat{A} = 24^\circ \times 2 = 48^\circ$
$\widehat{B} = 24^\circ \times 3 = 72^\circ$
$\widehat{C} = 24^\circ \times 4 = 96^\circ$
$\widehat{D} = 24^\circ \times 6 = 144^\circ$', NULL, NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0106', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0006'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'f048bbd0-ed90-4bbb-b11d-067b7266d89f', 'Bài 3. Cho tứ giác EFGH. Biết rằng số đo các góc E, F, G, H lần lượt tỉ lệ với 2, 3, 5, 8. Tính số đo các góc của tứ giác EFGH.', NULL, 'Giải
Vì số đo các góc E, F, G, H lần lượt tỉ lệ với 2, 3, 5, 8 nên ta có:
$\dfrac{\widehat{E}}{2} = \dfrac{\widehat{F}}{3} = \dfrac{\widehat{G}}{5} = \dfrac{\widehat{H}}{8} = \dfrac{\widehat{E} + \widehat{F} + \widehat{G} + \widehat{H}}{2 + 3 + 5 + 8} = \dfrac{360^\circ}{18} = 20^\circ$
Vậy:
$\widehat{E} = 20^\circ \times 2 = 40^\circ$
$\widehat{F} = 20^\circ \times 3 = 60^\circ$
$\widehat{G} = 20^\circ \times 5 = 100^\circ$
$\widehat{H} = 20^\circ \times 8 = 160^\circ$', NULL, NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0107', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0006'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'f048bbd0-ed90-4bbb-b11d-067b7266d89f', 'Bài 4. Cho tứ giác ABCD. Biết rằng số đo các góc A, B, C, D lần lượt tỉ lệ với 1, 2, 4, 5. Tính số đo các góc của tứ giác ABCD.', NULL, 'Giải
Vì số đo các góc A, B, C, D lần lượt tỉ lệ với 1, 2, 4, 5 nên ta có:
$\dfrac{\widehat{A}}{1}=\dfrac{\widehat{B}}{2}=\dfrac{\widehat{C}}{4}=\dfrac{\widehat{D}}{5}=\dfrac{\widehat{A}+\widehat{B}+\widehat{C}+\widehat{D}}{1+2+4+5}=\dfrac{360^{\circ}}{12}=30^{\circ}$
Vậy:
$\widehat{A}=30^{\circ}\times 1=30^{\circ}$
$\widehat{B}=30^{\circ}\times 2=60^{\circ}$
$\widehat{C}=30^{\circ}\times 4=120^{\circ}$
$\widehat{D}=30^{\circ}\times 5=150^{\circ}$', NULL, NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0108', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0006'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'f048bbd0-ed90-4bbb-b11d-067b7266d89f', 'Bài 5. Cho tứ giác MNPQ. Biết rằng số đo các góc M, N, P, Q lần lượt tỉ lệ với 3, 4, 5, 6. Tính số đo các góc của tứ giác MNPQ.', NULL, 'Giải
Vì số đo các góc M, N, P, Q lần lượt tỉ lệ với 3, 4, 5, 6 nên ta có:
$\dfrac{\widehat{M}}{3}=\dfrac{\widehat{N}}{4}=\dfrac{\widehat{P}}{5}=\dfrac{\widehat{Q}}{6}=\dfrac{\widehat{M}+\widehat{N}+\widehat{P}+\widehat{Q}}{3+4+5+6}=\dfrac{360^{\circ}}{18}=20^{\circ}$
Vậy:
$\widehat{M}=20^{\circ}\times 3=60^{\circ}$
$\widehat{N}=20^{\circ}\times 4=80^{\circ}$
$\widehat{P}=20^{\circ}\times 5=100^{\circ}$
$\widehat{Q}=20^{\circ}\times 6=120^{\circ}$', NULL, NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0109', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 12),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0014'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '9d9c236f-ea5c-450d-80cd-f1125a271b10', 'Cho tứ giác $ABCD$ có $\widehat{D}-\widehat{C}=20^\circ$. Các tia phân giác của các góc $\widehat{BAD}$ và $\widehat{ABC}$ cắt nhau tại $I$.
Biết $\widehat{AIB}=60^\circ$.
Tính các góc $\widehat{C}$ và $\widehat{D}$.', NULL, 'Giải :
$\widehat{AIB}=\dfrac{\widehat{C}+\widehat{D}}{2}\Rightarrow\widehat{C}+\widehat{D}=120^\circ$. Mà $\widehat{D}-\widehat{C}=20^\circ$
$\Rightarrow\widehat{D}=\dfrac{120^\circ+20^\circ}{2}=70^\circ$; $\widehat{C}=120^\circ-70^\circ=50^\circ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/531bec5d-6a9b-4c88-95d0-2f6e4b4bdef3.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0110', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 12),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0014'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '9d9c236f-ea5c-450d-80cd-f1125a271b10', 'Cho tứ giác $ABCD$ có $\widehat{A}+\widehat{B}=150^\circ$. Gọi $I$ là giao điểm của các tia phân giác của các góc $\widehat{BAD}$ và $\widehat{ABC}$ của tứ giác. Tính $\widehat{AIB}$', NULL, 'Giải
$\widehat{AIB}=180^\circ-(\widehat{IAB}+\widehat{IBA})=180^\circ-\dfrac{\widehat{A}+\widehat{B}}{2}=\dfrac{360^\circ-(\widehat{A}+\widehat{B})}{2}=\dfrac{\widehat{C}+\widehat{D}}{2}$
Ta có $\widehat{A}+\widehat{B}+\widehat{C}+\widehat{D}=360^\circ$; $\widehat{A}+\widehat{B}=150^\circ (gt)\Rightarrow \widehat{C}+\widehat{D}=360-150=210^\circ$
Vậy $\widehat{AIB}=\dfrac{210}{2}=105^\circ$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/531bec5d-6a9b-4c88-95d0-2f6e4b4bdef3.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0111', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 12),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0014'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '9d9c236f-ea5c-450d-80cd-f1125a271b10', 'Cho tứ giác $ABCD$ có $\widehat{A}+\widehat{B}=200^\circ$. Gọi $I$ là giao điểm của các tia phân giác của các góc $\widehat{BAD}$ và $\widehat{ABC}$ của tứ giác. Tính $\widehat{AIB}$', NULL, 'Giải
$\widehat{AIB}=180^\circ-(\widehat{IAB}+\widehat{IBA})=180^\circ-\dfrac{\widehat{A}+\widehat{B}}{2}=\dfrac{360^\circ-(\widehat{A}+\widehat{B})}{2}=\dfrac{\widehat{C}+\widehat{D}}{2}$
Ta có $\widehat{A}+\widehat{B}+\widehat{C}+\widehat{D}=360^\circ$; $\widehat{A}+\widehat{B}=200^\circ(gt)\Rightarrow\widehat{C}+\widehat{D}=360-200=160^\circ$
Vậy $\widehat{AIB}=\dfrac{160}{2}=80^\circ$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/531bec5d-6a9b-4c88-95d0-2f6e4b4bdef3.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0112', ma_cau from ins;

-- ── POST-CHECK ──────────────────────────────────────────────────────────────
do $$
declare n_bai int; n_cau int; n_lt int;
begin
  select count(*) into n_bai from hinh_hoc_bai where khoi='8';
  select count(*) into n_cau from hinh_hoc_cau_hoi c join hinh_hoc_bai b on b.ma_bai=c.dang_chinh where b.khoi='8';
  select count(*) into n_lt from hinh_hoc_bai_ly_thuyet lt join hinh_hoc_bai b on b.ma_bai=lt.ma_bai where b.khoi='8';
  raise notice 'Chuyển xong khối 8: % Bài học tổng (bao gồm Bài đã có trước migration), % câu tổng, % lý thuyết Bài tổng.', n_bai, n_cau, n_lt;
  -- Sau migration ít nhất phải THÊM 9 Bài + 112 câu so với trước.
  -- (Verify chính xác thêm bao nhiêu bằng cách xem count(*) TRƯỚC/SAU migration nếu cần)
  -- Guard tối thiểu: mỗi Bài trong 9 tên mô hình v3 phải xuất hiện đúng 1 lần.
  select count(*) into n_bai from hinh_hoc_bai where khoi='8' and ten_bai in ('Tứ giác ','Hình thang','Hình thang cân','Hình bình hành','Hình chữ nhật','Hình thoi','Hình vuông','Tam giác vuông - trung điểm','Hình học Test','Tứ giác có 2 cạnh bên cắt nhau','Tứ giác có tổng hai góc đối bằng 180','Tứ giác có hai tia phân giác cắt nhau','Tứ giác có tính chất của hình thang','Phân giác góc đáy hình thang','Hình thang cân trong tam giác cân','Tam giác cân tạo ra hình thang cân','Trung điểm cạnh đấy của hình thang cân','Trung điểm cạnh của hình bình hành','Phân giác của hình bình hành','Đường thẳng qua tâm','Vuông góc với đường chéo','Mô hình trực tâm','Mô hình Đường trung bình của tam giác','Tam giác vuông - Trung điểm cạnh huyền','Tam giác vuông - Chân đường cao','Tam giác vuông - Điểm bất kì thuộc cạnh huyền');
  if n_bai <> 26 then raise exception 'Sau migration: mong 26 Bài tên mô hình v3, có %', n_bai; end if;
end $$;

commit;