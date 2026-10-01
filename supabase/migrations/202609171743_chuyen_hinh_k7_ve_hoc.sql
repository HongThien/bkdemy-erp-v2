-- ============================================================================
-- 202609171743 — CHUYỂN dữ liệu HÌNH khối 7 từ mô hình LUYỆN sang mô hình HỌC (CEO 17/09)
-- ----------------------------------------------------------------------------
-- QUY TẮC (spec-kho-hinh-v3 §5 + user 17/09):
--  · 1 mô hình khối 7 (`hinh_mo_hinh` khoi='7') → 1 Bài học (`hinh_hoc_bai`).
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
--   Bài học sẽ tạo:   9
--   Câu lẻ:           54
--   Câu ghép:         8
--   Biến thể clone:   37
--   Biến thể độc lập: 9
--   Bài toán không dùng (tiền đề thuần + giữa chuỗi, không có câu riêng): 14
--   Nguồn: 76 `hinh_baitoan` + 46 biến thể của khối 7.
--
-- KHÔNG XÓA gì bên hinh_mo_hinh/hinh_baitoan/…. Chỉ THÊM vào hinh_hoc_bai/…
-- Idempotency: chèn xong sẽ có 9 dòng `hinh_hoc_bai` khoi='7'. Nếu chạy lại,
--   PRE-CHECK ở đầu block sẽ RAISE để không double-insert.
-- ============================================================================

begin;

-- ── PRE-CHECK: 9 tên Bài mới (đúng tên mô hình v3) đã có trong DB chưa? ────
-- (CEO 16/09 đã có sẵn "Tổng ba góc của một tam giác" cho khối 7 — KHÔNG đụng.
--  Migration này APPEND 9 Bài từ mô hình v3 vào bên cạnh, thu_tu tiếp theo tự động.)
do $$
declare n int;
begin
  select count(*) into n from hinh_hoc_bai where khoi='7' and ten_bai in ('Hai góc Kề bù','Đối đỉnh','Phân giác','Hai đường thẳng song song','Ba đường thẳng song song','Hình học','Phân giác trong Tam giác vuông.','Mô hình 3 góc bù ','Đối đỉnh thêm tia');
  if n > 0 then raise exception 'Đã có % Bài trong 9 tên mô hình v3 (khối 7) — migration này đã chạy. Bỏ qua để tránh double-insert.', n; end if;
end $$;

-- ── STAGE 1 · Tạo bảng tạm chứa mapping mô hình → thu_tu Bài ────────────────
create temp table _hh_bai_map (mo_hinh_id uuid, ten_bai text, thu_tu smallint) on commit drop;
create temp table _hh_bai_ma (thu_tu smallint, ma_bai text) on commit drop;
create temp table _hh_cau_map (temp_key text primary key, ma_cau text) on commit drop;

-- ── STAGE 2 · INSERT hinh_hoc_bai (9 Bài) + build map thu_tu → ma_bai ──────
insert into _hh_bai_map values ('e54cef1a-52ab-47ab-b206-c689491ed91b', 'Hai góc Kề bù', 1);
insert into _hh_bai_map values ('bba5557a-151b-49c5-a3cd-76daa34c335e', 'Đối đỉnh', 2);
insert into _hh_bai_map values ('b01b66a0-d665-46e2-8fa6-91868613cb70', 'Phân giác', 3);
insert into _hh_bai_map values ('33db9aef-139a-4990-9ddb-35dd7c98e960', 'Hai đường thẳng song song', 4);
insert into _hh_bai_map values ('3a8ccb48-09d2-43f4-9eb1-74c0bba2d73c', 'Ba đường thẳng song song', 5);
insert into _hh_bai_map values ('e88e3d74-08e3-43d6-94c3-93a0b0f07f79', 'Hình học', 6);
insert into _hh_bai_map values ('ac7bab89-24e4-4558-9b9b-3e1531683c8d', 'Phân giác trong Tam giác vuông.', 7);
insert into _hh_bai_map values ('d8c83585-9667-4e5b-bf8f-6c743b5aff66', 'Mô hình 3 góc bù ', 8);
insert into _hh_bai_map values ('05dd85f3-e067-439b-989d-9ef9dc753567', 'Đối đỉnh thêm tia', 9);

-- Base = max(thu_tu) khối 7 hiện tại. Bài mới ghi thu_tu = base + 1..9.
-- Map giữa (_hh_bai_map.thu_tu ∈ 1..9) và ma_bai mới dựa vào ten_bai (9 tên đều KHÁC nhau, verified).
with base as (select coalesce(max(thu_tu),0) as b from hinh_hoc_bai where khoi='7'),
ins as (
  insert into hinh_hoc_bai (khoi, ten_bai, thu_tu, da_duyet)
  select '7', m.ten_bai, m.thu_tu + b, false from _hh_bai_map m, base order by m.thu_tu
  returning ma_bai, ten_bai
)
insert into _hh_bai_ma (thu_tu, ma_bai)
  select m.thu_tu, ins.ma_bai from ins join _hh_bai_map m on m.ten_bai = ins.ten_bai;

-- ── STAGE 3 · Lý thuyết Bài (gia_thiet + link ảnh cấu hình nếu có) ─────────
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho hai tia $Ox$ và $Oy$ đối nhau, tia $Oz$ nằm giữa hai tia $Ox$ và $Oy$.

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/66aa5634-3a1b-4b6e-a973-6465e841b794.png)' from _hh_bai_ma where thu_tu = 1;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho hình vẽ. Biết $Ox$ và $Ox''$, $Oy$ và $Oy''$ là các tia đối nhau.

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/dbd3e77c-c152-4bc1-8c0d-f96732112e82.svgxml)' from _hh_bai_ma where thu_tu = 2;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho góc $xOy$. Kẻ tia $Oz$ là tia phân giác của góc $xOy$.

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/3beced58-c611-4ee2-beb9-88ffc0c03979.svgxml)' from _hh_bai_ma where thu_tu = 3;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho hình vẽ.

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/aa86a91d-6e7b-4511-b648-5fd0f861136f.png)' from _hh_bai_ma where thu_tu = 4;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho hình vẽ.

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/6bdb9945-2c80-4953-bc9c-b44933007cc7.png)' from _hh_bai_ma where thu_tu = 5;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho hình vẽ. Biết $\widehat{xOt}=33^\circ$. Tính $\widehat{zOy}$.' from _hh_bai_ma where thu_tu = 6;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho $\triangle ABC$ vuông tại $A$, tia phân giác của góc $B$ cắt $AC$ tại $D$. Trên $BC$ lấy $E$ sao cho $BE = BA$.

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/26b9bfa4-0228-4b00-9a8e-30f76a91c3f8.png)' from _hh_bai_ma where thu_tu = 7;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho hai tia $Ox$ và $Oy$ đối nhau, tia $Oz$ và $Ot$ nằm giữa hai tia đó.

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/1dc3cd82-f476-4bd5-9f1d-374a059e2620.svgxml)' from _hh_bai_ma where thu_tu = 8;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho hình vẽ. Biết $Ox$ và $Ox''$, $Oy$ và $Oy''$ là các tia đối nhau.; Kẻ tia $Oa$.

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/d513dc58-1212-40ed-9168-83269fb783b5.svgxml)' from _hh_bai_ma where thu_tu = 9;

-- ── STAGE 4 · INSERT hinh_hoc_cau_hoi (108 câu: 54 lẻ + 8 ghép + 46 biến thể) ──
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'Tính các góc $\widehat{yBz''}$ và $\widehat{ABy}$.', NULL, 'Ta có $xx'' \parallel yy''$
Suy ra $\widehat{xAB} = \widehat{ABy''}$ (hai góc so le trong)
Mà $\widehat{xAB} = 70^\circ$ nên $\widehat{ABy''} = 70^\circ$
Lại có : $\widehat{ABy} + \widehat{ABy''} = 180^\circ$ (hai góc kề bù)
Suy ra $\widehat{ABy} = 180^\circ - \widehat{ABy''} = 180^\circ - 70^\circ = 110^\circ$
Mà $\widehat{ABy''} = \widehat{yBz''}$ (hai góc đối đỉnh)
Suy ra $\widehat{yBz''} = 70^\circ$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/b3442547-d925-49a2-b168-359056216d8f.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0001', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'a.  Chứng minh $Mx \parallel Ny$
b. Tính $\widehat{PQN}; \widehat{PQy}$', NULL, 'a. Từ hình vẽ ta có : $\widehat{zMx} = \widehat{zNy} = 70^\circ$
Mà $\widehat{zMx}$ và $\widehat{zNy}$ là 2 góc ở vị trí so le trong
Suy ra $Mx \parallel Ny$
b. Vì $Mx \parallel Ny$
nên $\widehat{xPQ} = \widehat{PQN}$ (hai góc so le trong)
Mà $\widehat{xPQ} = 65^\circ$ suy ra $\widehat{PQN} = 65^\circ$
Mà $\widehat{PQN} + \widehat{PQy} = 180^\circ$ (hai góc kề bù)
Suy ra $\widehat{PQy} = 180^\circ - \widehat{PQN} = 180^\circ - 65^\circ = 115^\circ$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/40cc1bcc-0672-4ef9-902c-6275beca0340.svgxml', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0002', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'Chứng minh a//b', NULL, 'Ta có: $\begin{cases} c \perp a \\ c \perp b \end{cases} \Rightarrow a // b$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/3fc21907-2143-40f9-99d5-3c92560755e5.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0003', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', '.', NULL, 'Vì $m, I, n$ thẳng hàng nên $\widehat{mIq}$ và $\widehat{nIq}$ là hai góc kề bù
$\Rightarrow \widehat{mIq} = 180^\circ - \widehat{nIq} = 180^\circ - 40^\circ = 140^\circ$
Ta có: tia $Ip$ nằm giữa hai tia $Im, Iq$
$\Rightarrow \widehat{mIp} + \widehat{pIq} = \widehat{mIq}$
$\Rightarrow \widehat{pIq} = \widehat{mIq} - \widehat{mIp} = 140^\circ - 90^\circ = 50^\circ$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/30413d6f-9f22-47ef-9e37-b4e58de8ead0.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0004', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', 'a) Chứng minh rằng: $BD = CE$
b) Vẽ M,N sao cho D là trung điểm của BM, E là trung điểm của CN. Chứng minh rằng A là
trung điểm của MN
c) BD cắt CE tại I. Chứng minh AI là phân giác góc BAC
d) Gọi giao của AI và BC là H. Trên tia CB lấy điểm K sao cho $CK = 2AH$ . Biết $\widehat{BAC} = 30^\circ$.
Tính góc KAB.', NULL, 'a) Vì $AB = AC$ và $D, E$ lần lượt là trung điểm $AC, AB$ nên $AD = \dfrac{AC}{2} = \dfrac{AB}{2} = AE$.

Xét $\triangle ABD$ và $\triangle ACE$:
- $AB = AC$ (gt)
- $\widehat{A}$ chung
- $AD = AE$ (cmt)

$\Rightarrow \triangle ABD = \triangle ACE$ (c.g.c) $\Rightarrow BD = CE$.

b) Vì $D$ là trung điểm $AC$ và cũng là trung điểm $BM$ nên tứ giác $ABCM$ có hai đường chéo $AC, BM$ cắt nhau tại trung điểm mỗi đường $\Rightarrow ABCM$ là hình bình hành $\Rightarrow AM \parallel BC$, $AM = BC$ (cùng hướng từ $A$ sang $M$ như từ $B$ sang $C$).

Tương tự, $E$ là trung điểm $AB$ và cũng là trung điểm $CN$ nên tứ giác $ACBN$ là hình bình hành $\Rightarrow AN \parallel BC$, $AN = CB$ (cùng hướng từ $A$ sang $N$ như từ $C$ sang $B$, tức ngược hướng với $AM$).

Vậy $A, M, N$ thẳng hàng (cùng thuộc đường thẳng qua $A$ song song $BC$), $AM = AN$ ($=BC$) nhưng $M, N$ nằm về hai phía ngược nhau của $A$ $\Rightarrow A$ là trung điểm $MN$.

c) Từ câu a), $\triangle ABD = \triangle ACE \Rightarrow \widehat{ABD} = \widehat{ACE}$.

Mà $\widehat{ABC} = \widehat{ACB}$ ($\triangle ABC$ cân tại $A$), nên:
$$\widehat{IBC} = \widehat{ABC} - \widehat{ABD} = \widehat{ACB} - \widehat{ACE} = \widehat{ICB}$$

$\Rightarrow \triangle IBC$ cân tại $I$ $\Rightarrow IB = IC$.

Xét $\triangle ABI$ và $\triangle ACI$: $AB = AC$, $IB = IC$, $AI$ chung $\Rightarrow \triangle ABI = \triangle ACI$ (c.c.c) $\Rightarrow \widehat{BAI} = \widehat{CAI}$, tức $AI$ là phân giác $\widehat{BAC}$.

d) Vì $AI$ là phân giác $\widehat{BAC}$ trong tam giác cân tại $A$ nên $AI$ cũng là đường trung trực của $BC$, do đó $H$ (giao của $AI, BC$) là trung điểm $BC$ và $AH \perp BC$.

Đặt $AH = a$. Vì $\widehat{BAC} = 30^\circ$ và $AH$ là phân giác nên $\widehat{BAH} = 15^\circ$; tam giác $ABH$ vuông tại $H$ cho $BH = AH\tan(15^\circ) = a(2-\sqrt3)$ (vì $\tan15^\circ = 2-\sqrt3$).

$K$ trên tia $CB$ với $CK = 2AH = 2a$. Ta có $CB = 2BH = 2a(2-\sqrt3)$; vì $CK > CB$ nên $K$ nằm ngoài đoạn $CB$, về phía ngoài $B$ (xa $C$ hơn $B$), với:
$$BK = CK - CB = 2a - 2a(2-\sqrt3) = 2a(\sqrt3 - 1)$$
$$HK = HB + BK = a(2-\sqrt3) + 2a(\sqrt3-1) = a\sqrt3$$

Tam giác $AHK$ vuông tại $H$: $\tan(\widehat{KAH}) = \dfrac{HK}{AH} = \sqrt3 \Rightarrow \widehat{KAH} = 60^\circ$.

Vậy $\widehat{KAB} = \widehat{KAH} - \widehat{BAH} = 60^\circ - 15^\circ = 45^\circ$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0005', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', 'a) Chứng minh $\triangle ABD=\triangle EBD$.
b) Chứng minh $DE = AD$ và $DE \perp BC$.
c) Chứng minh: $BD \perp AE$; $IA = IE$ ($I \in AE$)
d) Trên tia đối của tia AB lấy điểm F sao cho $AF = CE$.
Chứng minh ba điểm F, D, E thẳng hàng.', NULL, 'a) $BD$ là phân giác $\widehat{ABC}$ nên $\widehat{ABD} = \widehat{EBD}$. Xét $\triangle ABD$ và $\triangle EBD$: $BA = BE$ (gt), $\widehat{ABD} = \widehat{EBD}$ (cmt), $BD$ chung $\Rightarrow \triangle ABD = \triangle EBD$ (c.g.c).

b) Từ câu a): $AD = ED$ và $\widehat{BAD} = \widehat{BED}$. Mà $\widehat{BAD} = \widehat{BAC} = 90^\circ$ (do $D \in AC$) nên $\widehat{BED} = 90^\circ$, tức $DE \perp BC$ tại $E$.

c) Vì $BA = BE$ nên $\triangle BAE$ cân tại $B$; $\widehat{ABD} = \widehat{EBD}$ nên $BD$ là phân giác góc ở đỉnh $B$ của tam giác cân này, do đó $BD$ đồng thời là đường trung trực của $AE$. Vậy $BD \perp AE$; gọi $I$ là giao điểm của $BD$ và $AE$ thì $I$ là trung điểm $AE$, tức $IA = IE$.

d) Vì $AF$ là tia đối của tia $AB$ mà $\widehat{DAB} = \widehat{CAB} = 90^\circ$ nên $\widehat{DAF} = 180^\circ - \widehat{DAB} = 90^\circ$. Tương tự $\widehat{DEC} = 90^\circ$ (câu b, $DE \perp BC$).

Xét $\triangle ADF$ và $\triangle EDC$: $AD = ED$ (câu b), $\widehat{DAF} = \widehat{DEC} = 90^\circ$, $AF = EC$ (gt) $\Rightarrow \triangle ADF = \triangle EDC$ (c.g.c) $\Rightarrow \widehat{ADF} = \widehat{EDC}$.

Vì $A, D, C$ thẳng hàng ($D \in AC$) nên với điểm $E$ bất kỳ không thuộc $AC$: $\widehat{ADE} + \widehat{EDC} = \widehat{ADC} = 180^\circ$.

Thay $\widehat{EDC} = \widehat{ADF}$: $\widehat{FDA} + \widehat{ADE} = 180^\circ$, tức $\widehat{FDE} = 180^\circ$.

Vậy $F, D, E$ thẳng hàng.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0006', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', 'a) Chứng minh $\triangle OAB = \triangle OCD$.
b) Lấy điểm H bất kì thuộc đoạn thẳng OA, Từ D kẻ DK song song với BH.
Chứng minh $BH = DK$.
c) Trên tia AB lấy điểm M, trên tia DC lấy điểm N sao cho $BM = DN$.', NULL, NULL, NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0007', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', 'a) Chứng minh $\triangle ABK = \triangle EBK$ và $AK = KE$
b) Chứng minh $EK \perp BC$
c) Chứng minh: BK là đường trung trực của đoạn thẳng AE.', NULL, 'a) Xét $\triangle ABK$ và $\triangle EBK$:
- $BA=BE$ (giả thiết)
- $\widehat{ABK}=\widehat{EBK}$ ($BK$ là phân giác góc $B$)
- $BK$ chung
$\Rightarrow \triangle ABK = \triangle EBK$ (c.g.c) $\Rightarrow AK=KE$ (hai cạnh tương ứng).

b) Từ $\triangle ABK=\triangle EBK$ (câu a) suy ra $\widehat{BEK}=\widehat{BAK}$ (hai góc tương ứng). Mà $\widehat{BAK}=\widehat{BAC}=90^\circ$ (do $\triangle ABC$ vuông tại $A$) nên $\widehat{BEK}=90^\circ$, tức $EK \perp BC$ tại $E$.

c) Ta có $BA=BE$ (giả thiết) nên $B$ cách đều hai điểm $A,E$; và $KA=KE$ (câu a) nên $K$ cũng cách đều hai điểm $A,E$. Hai điểm $B,K$ cùng cách đều hai đầu mút của đoạn thẳng $AE$ nên đường thẳng $BK$ là đường trung trực của đoạn thẳng $AE$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0008', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', 'a) Chứng minh $ABC = ACB$
b) Chứng minh $AH \perp BC$
c) Chứng minh $AD = AE$
d) Chứng minh AH là tia phân giác của DBE', NULL, 'a) Xét $\triangle ABH$ và $\triangle ACH$: $AB = AC$ (gt), $\widehat{BAH} = \widehat{CAH}$ ($AH$ là phân giác $\widehat{BAC}$), $AH$ chung $\Rightarrow \triangle ABH = \triangle ACH$ (c.g.c) $\Rightarrow \widehat{ABH} = \widehat{ACH}$, tức $\widehat{ABC} = \widehat{ACB}$.

b) Từ câu a), $\triangle ABH = \triangle ACH \Rightarrow BH = CH$ và $\widehat{AHB} = \widehat{AHC}$. Mà $\widehat{AHB} + \widehat{AHC} = 180^\circ$ ($B, H, C$ thẳng hàng) nên $\widehat{AHB} = \widehat{AHC} = 90^\circ$, tức $AH \perp BC$.

c) Vì $D$ trên tia đối tia $BC$ nên $\widehat{ABD} = 180^\circ - \widehat{ABC}$; vì $E$ trên tia đối tia $CB$ nên $\widehat{ACE} = 180^\circ - \widehat{ACB}$. Mà $\widehat{ABC} = \widehat{ACB}$ (câu a) nên $\widehat{ABD} = \widehat{ACE}$.

Xét $\triangle ABD$ và $\triangle ACE$: $AB = AC$ (gt), $\widehat{ABD} = \widehat{ACE}$ (cmt), $BD = CE$ (gt) $\Rightarrow \triangle ABD = \triangle ACE$ (c.g.c) $\Rightarrow AD = AE$.

d) Vì $BH = CH$ (câu b) và $BD = CE$ (gt) nên:
$$HD = HB + BD = HC + CE = HE$$

Xét $\triangle ADH$ và $\triangle AEH$: $AD = AE$ (câu c), $DH = EH$ (cmt), $AH$ chung $\Rightarrow \triangle ADH = \triangle AEH$ (c.c.c) $\Rightarrow \widehat{DAH} = \widehat{EAH}$, tức $AH$ là tia phân giác $\widehat{DAE}$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0009', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', 'a) Chứng minh rằng: $\triangle ABI = \triangle AKI$
b) Gọi giao điểm của AI và BK là O. Chứng minh rằng: AI vuông góc với BK tại O
c) Gọi giao điểm của AB và KI là E. Chứng minh rằng: $BK \parallel EC$', NULL, 'a) Xét $\triangle ABI$ và $\triangle AKI$ có: $AB = AK$ (giả thiết); $\widehat{BAI} = \widehat{KAI}$ (AI là tia phân giác của $\widehat{BAC}$); $AI$ là cạnh chung. Do đó $\triangle ABI = \triangle AKI$ (c.g.c).

b) Từ câu a) suy ra $IB = IK$ (hai cạnh tương ứng). Khi đó $A$ và $I$ cùng cách đều hai điểm $B, K$ (vì $AB=AK$ và $IB=IK$) nên đường thẳng $AI$ là đường trung trực của đoạn thẳng $BK$. Do đó $AI \perp BK$ tại $O$.

c) Từ câu a): $\widehat{AIB} = \widehat{AIK}$ (hai góc tương ứng).

Ta chứng minh $AE = AC$: vì $E, I, K$ thẳng hàng nên $\widehat{AIE}$ và $\widehat{AIK}$ kề bù; vì $B, I, C$ thẳng hàng nên $\widehat{AIB}$ và $\widehat{AIC}$ cũng kề bù. Mà $\widehat{AIB} = \widehat{AIK}$ nên $\widehat{AIE} = \widehat{AIC}$.

Xét $\triangle AIE$ và $\triangle AIC$ có: $\widehat{IAE} = \widehat{IAC}$ (vì $E$ thuộc tia $AB$, mà $AI$ là phân giác $\widehat{BAC}$); $AI$ là cạnh chung; $\widehat{AIE} = \widehat{AIC}$ (vừa chứng minh). Do đó $\triangle AIE = \triangle AIC$ (g.c.g), suy ra $AE = AC$.

Vì $AB = AK$ nên $\triangle ABK$ cân tại $A$, suy ra $\widehat{ABK} = \widehat{AKB} = 90^\circ - \dfrac{\widehat{BAC}}{2}$. Vì $AC = AE$ nên $\triangle ACE$ cân tại $A$, suy ra $\widehat{ACE} = \widehat{AEC} = 90^\circ - \dfrac{\widehat{BAC}}{2}$. Suy ra $\widehat{ABK} = \widehat{ACE}$.

Đặt $\widehat{BAC}=\widehat{A}$, $\widehat{ABC}=\widehat{B}$, $\widehat{ACB}=\widehat{C}$ (với $\widehat A+\widehat B+\widehat C=180^\circ$), khi đó $\widehat{ABK}=\widehat{ACE}=\dfrac{\widehat B+\widehat C}{2}$.

Vì $K$ nằm giữa $A, C$ nên tia $BK$ nằm giữa hai tia $BA, BC$: $\widehat{KBC}=\widehat{ABC}-\widehat{ABK}=\widehat B-\dfrac{\widehat B+\widehat C}{2}=\dfrac{\widehat B-\widehat C}{2}$.

Vì $B$ nằm giữa $A, E$ nên tia $CB$ nằm giữa hai tia $CA, CE$: $\widehat{BCE}=\widehat{ACE}-\widehat{ACB}=\dfrac{\widehat B+\widehat C}{2}-\widehat C=\dfrac{\widehat B-\widehat C}{2}$.

Do đó $\widehat{KBC}=\widehat{BCE}$. Đây là cặp góc so le trong tạo bởi đường thẳng $BC$ cắt hai đường thẳng $BK, CE$, suy ra $BK \parallel EC$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0010', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 7),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'ac7bab89-24e4-4558-9b9b-3e1531683c8d', 'Chứng minh $\triangle ABD = \triangle EBD$.', NULL, 'Vì $BD$ là tia phân giác của góc $\widehat{B} \Rightarrow \widehat{ABD} = \widehat{EBD}$.
Xét $\triangle ABD$ và $\triangle EBD$ có:
$AB = BE$ (gt)
$\widehat{ABD} = \widehat{EBD}$ (cmt)
$BD$ chung
$\Rightarrow \triangle ABD = \triangle EBD$ (c - g - c)', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0011', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', 'a) Chứng minh $\triangle ABM = \triangle ACM$
b) Kẻ $ME \perp AB$ tại E, kẻ $MF \perp AC$ tại F. Chứng minh $AE = AF$
c) AM cắt EF tại K. Chứng minh $AK \perp EF$
d) Chứng minh $EF \parallel BC$
e) Từ C kẻ đường thẳng song song với AM cắt tia BA tại D.
Chứng minh A là trung điểm của BD.', NULL, 'a) Xét $\triangle ABM$ và $\triangle ACM$: $AB = AC$ (gt), $BM = CM$ ($M$ trung điểm $BC$), $AM$ chung $\Rightarrow \triangle ABM = \triangle ACM$ (c.c.c) $\Rightarrow \widehat{BAM} = \widehat{CAM}$ và $\widehat{AMB} = \widehat{AMC} = 90^\circ$ (vì $\widehat{AMB} + \widehat{AMC} = 180^\circ$ và hai góc bằng nhau).

b) Xét $\triangle AEM$ và $\triangle AFM$ (vuông tại $E, F$): $AM$ chung (cạnh huyền), $\widehat{EAM} = \widehat{FAM}$ (câu a, vì $E \in AB$, $F \in AC$) $\Rightarrow \triangle AEM = \triangle AFM$ (cạnh huyền – góc nhọn) $\Rightarrow AE = AF$ (và $ME = MF$).

c) Vì $AE = AF$ (câu b) nên $\triangle AEF$ cân tại $A$; mà $AM$ là phân giác $\widehat{EAF}$ (do $\widehat{EAM} = \widehat{FAM}$) nên $AM$ đồng thời là đường trung trực của $EF$. Vậy $AM \perp EF$ tại $K$.

d) Vì $AE = AF$, $AB = AC$ nên $\dfrac{AE}{AB} = \dfrac{AF}{AC}$; kết hợp $\widehat{A}$ chung $\Rightarrow \triangle AEF \sim \triangle ABC$ (c.g.c) $\Rightarrow \widehat{AEF} = \widehat{ABC}$ (hai góc đồng vị) $\Rightarrow EF \parallel BC$.

e) Vì $CD \parallel AM$ (gt) và $M$ là trung điểm $BC$, xét $\triangle BCD$: đường thẳng qua $M$ song song với cạnh $CD$ chính là đường thẳng $AM$, và đường này cắt cạnh $BD$ tại $A$. Theo định lý đường trung bình (chiều đảo): đường thẳng đi qua trung điểm một cạnh của tam giác và song song với cạnh thứ hai thì đi qua trung điểm cạnh thứ ba. Vậy $A$ là trung điểm $BD$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0012', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', 'a) Chứng minh tam giác $ABM$ và tam giác $ACM$ bằng nhau.
b) Chứng minh $AM$ là phân giác của góc $BAC$ và $AM$ vuông góc với $BC$.
c) Lấy $D$ là một điểm bất kỳ trên đoạn thẳng $AM$. Chứng minh $DB = DC$ .', NULL, 'a) Xét $\triangle ABM$ và $\triangle ACM$:
- $AB = AC$ (giả thiết)
- $BM = CM$ (M là trung điểm BC)
- $AM$ chung
$\Rightarrow \triangle ABM = \triangle ACM$ (c.c.c).

b) Từ $\triangle ABM = \triangle ACM$ suy ra $\widehat{BAM} = \widehat{CAM}$ (hai góc tương ứng) $\Rightarrow AM$ là tia phân giác của $\widehat{BAC}$.
Cũng từ $\triangle ABM = \triangle ACM$ suy ra $\widehat{AMB} = \widehat{AMC}$ (hai góc tương ứng), mà $\widehat{AMB} + \widehat{AMC} = 180^\circ$ (kề bù) nên $\widehat{AMB} = \widehat{AMC} = 90^\circ \Rightarrow AM \perp BC$.

c) Với $D$ bất kỳ trên đoạn $AM$, xét $\triangle DBM$ và $\triangle DCM$:
- $DM$ chung
- $\widehat{DMB} = \widehat{DMC} = 90^\circ$ (vì $D \in AM$ và $AM \perp BC$)
- $BM = CM$ (M là trung điểm BC)
$\Rightarrow \triangle DBM = \triangle DCM$ (c.g.c) $\Rightarrow DB = DC$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0013', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', 'a) Chứng minh $\triangle ABD = \triangle ACD$.
b) Chứng minh AD là trung trực của BC.
c) Vẽ $DM \perp AB$ tại M. Trên cạnh AC lấy N sao cho $AN = AM$. Chứng minh $\triangle ADM = \triangle ADN$ và
$DN \perp AC$.
d) Gọi K là trung điểm của CN. Trên tia đối của tia KD lấy điểm E sao cho $KE = KD$.
Chứng minh M, N, E thẳng hàng.', NULL, 'a) Xét $\triangle ABD$ và $\triangle ACD$ có: $AB = AC$ (gt), $\widehat{BAD} = \widehat{CAD}$ (Az là phân giác $\widehat{xAy}$), $AD$ chung. Vậy $\triangle ABD = \triangle ACD$ (c.g.c).

b) Từ câu a): $DB = DC$ (hai cạnh tương ứng). Ta có $AB = AC$ (gt) và $DB = DC$ (trên), nên A và D cùng cách đều B, C. Vậy AD là đường trung trực của đoạn thẳng BC.

c) Xét $\triangle ADM$ và $\triangle ADN$ có: $AM = AN$ (gt), $\widehat{DAM} = \widehat{DAN}$ (M∈AB, N∈AC và $\widehat{BAD} = \widehat{CAD}$ theo câu a), $AD$ chung. Vậy $\triangle ADM = \triangle ADN$ (c.g.c) nên $DM = DN$ và $\widehat{AMD} = \widehat{AND}$ (hai góc tương ứng). Vì $DM \perp AB$ nên $\widehat{AMD} = 90^\circ$, suy ra $\widehat{AND} = 90^\circ$, tức $DN \perp AC$.

d) Vì K là trung điểm của CN và cũng là trung điểm của DE (do $KE = KD$ và E, K, D thẳng hàng) nên tứ giác NDCE có hai đường chéo NC và DE cắt nhau tại trung điểm K của mỗi đường, do đó NDCE là hình bình hành. Suy ra $NE \parallel DC$ (cặp cạnh đối).
Mặt khác, theo câu c) $AM = AN$, và theo giả thiết $AB = AC$, nên $\dfrac{AM}{AB} = \dfrac{AN}{AC}$. Theo định lí Ta-lét đảo, $MN \parallel BC$.
Vì D thuộc BC nên đường thẳng DC chính là đường thẳng BC. Vậy cả MN và NE đều song song với BC, mà hai đường thẳng này cùng đi qua điểm N nên theo tiên đề Ơ-clit, MN và NE là cùng một đường thẳng. Vậy M, N, E thẳng hàng.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0014', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 5),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '3a8ccb48-09d2-43f4-9eb1-74c0bba2d73c', 'TÍnh $\widehat{ABC}$', NULL, 'Qua $B$ kẻ tia $Bt$ song song với $Ax$ (khi đó $Bt$ cũng song song với $Cy$ vì $Ax \parallel Cy$).

Vì $Bt \parallel Ax$ với cát tuyến $AB$ nên $\widehat{ABt} = \widehat{BAx} = 45^\circ$ (hai góc so le trong).

Vì $Bt \parallel Cy$ với cát tuyến $CB$ nên $\widehat{CBt} = \widehat{BCy} = 40^\circ$ (hai góc so le trong).

Vì $B$ nằm giữa hai đường thẳng $Ax$ và $Cy$ nên tia $Bt$ nằm trong góc $\widehat{ABC}$, do đó:
$\widehat{ABC} = \widehat{ABt} + \widehat{CBt} = 45^\circ + 40^\circ = 85^\circ$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0015', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 3),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'b01b66a0-d665-46e2-8fa6-91868613cb70', 'Cho hình vẽ. Biết $\widehat{xOy} = 70^\circ$ và $Oz$ là phân giác của góc $xOy$. Tính các góc $xOz$ và $zOy$.', NULL, 'Vì Oz là tia phân giác của góc xOy nên:
$\widehat{xOz} = \widehat{zOy} = \frac{1}{2}\widehat{xOy}$
Mà $\widehat{xOy} = 70^\circ$.
Do đó: $\widehat{xOz} = \widehat{zOy} = \frac{1}{2}.70^\circ = 35^\circ$
Vậy $\widehat{xOz} = 35^\circ$ và $\widehat{zOy} = 35^\circ$ .', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/9eeeb57a-7df9-4dfc-bb3c-31ff80542938.svgxml', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0016', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'Chứng minh rằng $xx'' //yy''$', NULL, 'Ta có $\widehat{xMN} + \widehat{x''MN} = 180^0$ (hai góc kề bù)
Mà $\widehat{xMN} = 55^0$ suy ra $\widehat{x''MN} = 180^0 - \widehat{xMN} = 180^0 - 55^0 = 125^0$
Lại có $\widehat{MNy} = 125^0$ nên $\widehat{x''MN} = \widehat{MNy}$
Mà $\widehat{x''MN} ; \widehat{MNy}$ là 2 góc ở vị trí so le trong
Suy ra $xx'' // yy''$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/3d64c901-8dc0-4cfd-b220-af194ce86af8.svgxml', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0017', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'a. Chứng minh rằng : $a \parallel b$
b. Tính số đo $\widehat{B_2} ; \widehat{B_3}$
c. Gọi Bx là tia phân giác góc $\widehat{B_1}$. Tia Bx cắt đường
thẳng b tại E. Tính số đo $\widehat{BEb}$', NULL, 'a. Ta có $a \perp c$ và $b \perp c$ nên $a \parallel b$.
b. Vì $a \parallel b$ nên $\widehat{B_3} = \widehat{BAb}$ (hai góc đồng vị) $= 50^\circ$.
$\widehat{B_1}$ và $\widehat{B_3}$ kề bù nên $\widehat{B_1} = 180^\circ - 50^\circ = 130^\circ$.
$\widehat{B_2}$ và $\widehat{B_3}$ kề bù nên $\widehat{B_2} = 180^\circ - 50^\circ = 130^\circ$.
c. Bx là phân giác $\widehat{B_1}$ nên chia $\widehat{B_1}$ thành 2 góc $65^\circ$.
Vì $a \parallel b$, xét đường thẳng Bx cắt $b$ tại $E$: góc $65^\circ$ kề Bx tại B và $\widehat{BEb}$ là hai góc trong cùng phía.
Suy ra $\widehat{BEb} = 180^\circ - 65^\circ = 115^\circ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/8d3a4831-6d13-45e4-8087-5781be28f0c3.svgxml', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0018', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'a. Chứng minh $xx'' // yy''$
b. Tính $\widehat{CDy''}$; $\widehat{CDy}$', NULL, 'a. Từ hình vẽ ta thấy : $\widehat{xAB} = \widehat{ABD} = 80^0$
Mà $\widehat{xAB}$ và $\widehat{ABD}$ là 2 góc ở vị trí so le trong
Suy ra $xx'' // yy''$
b. Vì $xx'' \parallel yy''$
nên $\widehat{tCx''} = \widehat{CDy''}$ (hai góc đồng vị)
Mà $\widehat{tCx''} = 115^0$ suy ra $\widehat{CDy''} = 115^0$
Ta có $\widehat{CDy''} + \widehat{CDy} = 180^0$ (hai góc kề bù)
Suy ra $\widehat{CDy} = 180^0 - \widehat{CDy''} = 180^0 - 115^0 = 65^0$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/b5dc2c5e-0fa4-43b8-bf4d-a7cbefa2c942.svgxml', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0019', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'Chứng minh rằng $Ax \parallel By$, $Ax \parallel Cz$; $By \parallel Cz$', NULL, 'Ta có $\widehat{tAx} + \widehat{xAB} = 180^\circ$ (hai góc kề bù )
Mà $\widehat{xAB} = 130^\circ$ nên $\widehat{tAx} = 180^\circ - \widehat{xAB} = 180^\circ - 130^\circ = 50$
Lại có $\widehat{ABy} = 50^\circ$ nên $\widehat{tAx} = \widehat{ABy} = 50^\circ$
Mà $\widehat{tAx}$ và $\widehat{ABy}$ là 2 góc ở vị trí đồng vị
Suy ra $Ax \parallel By$
Mặt khác, ta có $\widehat{BCz} = \widehat{z''Ct''}$ (hai góc đối đỉnh)
Mà $\widehat{z''Ct''} = 50^\circ$ nên $\widehat{BCz} = 50^\circ$
Suy ra $\widehat{BCz} = \widehat{tAx} = 50^\circ$
Lại có $\widehat{BCz}$ và $\widehat{tAx}$ là 2 góc đồng vị (so với Ax và Cz)
Suy ra $Ax \parallel Cz$
Dễ thấy $\widehat{BCz} = \widehat{ABy} = 50^\circ$
Mà $\widehat{BCz}$ và $\widehat{ABy}$ là 2 góc đồng vị (so với By và Cz)
Suy ra $By \parallel Cz$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/218b150f-7cc8-44c5-8ea5-86ac3a16e746.svgxml', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0020', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'a. Chứng minh $a \parallel b$
b. Biết $\widehat{aMN} = 120^0$. Tính $\widehat{MNB}; \widehat{MNb}$
c. Biết NP là tia phân giác của $\widehat{MNB}$ và tia $Pt \parallel MN$
Chứng minh : Pt là phân giác của góc $\widehat{NPA}$', NULL, 'a. Ta có $m \perp a$ và $n \perp b$ ($m$, $n$ cùng một đường thẳng, hình vẽ) nên $a \parallel b$.
b. Vì $a \parallel b$ nên $\widehat{MNB} = \widehat{aMN} = 120^\circ$ (hai góc so le trong).
$\widehat{MNB}$ và $\widehat{MNb}$ kề bù (cùng nằm trên đường thẳng $b$) nên $\widehat{MNb} = 180^\circ - 120^\circ = 60^\circ$.
c. Vì $NP$ là phân giác $\widehat{MNB}$ nên $\widehat{MNP} = \widehat{PNB} = 60^\circ$.
Vì $MN \parallel Pt$ nên $\widehat{NPt} = \widehat{MNP} = 60^\circ$ (hai góc so le trong, cắt bởi $NP$).
Vì $MN \parallel Pt$ nên $\widehat{aPt} = \widehat{aMN} = 120^\circ$ (hai góc đồng vị, cắt bởi đường thẳng $a$).
Mà $\widehat{aPt}$ và $\widehat{tPA}$ kề bù nên $\widehat{tPA} = 180^\circ - 120^\circ = 60^\circ$.
Vậy $\widehat{NPt} = \widehat{tPA} = 60^\circ$, suy ra $Pt$ là tia phân giác của $\widehat{NPA}$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/3e0c7979-94c7-4cd7-bbab-6220b702fc6f.svgxml', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0021', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'a. Chứng minh : $xy \parallel mn$
b. Tính số đo $\stackrel{\frown}{CDB}$
c. Kẻ DH vuông góc với xy tại H. Tính $\stackrel{\frown}{CDH}$', NULL, 'Từ hình vẽ: $AB \perp xy$ tại $A$; $AB \perp mn$ tại $B$; $\widehat{ECx} = 80^\circ$.

**a. Chứng minh $xy \parallel mn$:**

$AB \perp xy$ và $AB \perp mn$ (từ hình vẽ).

Hai đường thẳng $xy$ và $mn$ cùng vuông góc với đường thẳng $AB$, nên $xy \parallel mn$. $\square$

**b. Tính số đo $\widehat{CDB}$:**

$\widehat{ECx} = 80^\circ$ (đã cho).

Hai góc $\widehat{ECx}$ và $\widehat{DCy}$ là hai góc đối đỉnh, nên:
$\widehat{DCy} = \widehat{ECx} = 80^\circ$

Vì $xy \parallel mn$, hai góc $\widehat{DCy}$ (tại $C$) và $\widehat{CDB}$ (tại $D$) là hai góc trong cùng phía của cát tuyến $CD$, nên:
$\widehat{DCy} + \widehat{CDB} = 180^\circ$
$\Rightarrow \widehat{CDB} = 180^\circ - 80^\circ = 100^\circ$

**c. Tính số đo $\widehat{CDH}$:**

$DH \perp xy$ tại $H$. Vì $xy \parallel mn$, suy ra $DH \perp mn$ tại $D$, nên $\widehat{HDB} = 90^\circ$.

$H$ nằm trên $xy$, $B$ nằm trên $mn$ cùng phía với $C$ so với $D$, nên $H$ nằm trong góc $CDB$:
$\widehat{CDH} = \widehat{CDB} - \widehat{HDB} = 100^\circ - 90^\circ = 10^\circ$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/087c5818-d96d-47eb-b7fc-578e5faf3abd.svgxml', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0022', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'a. Chứng minh $yy'' \parallel tt''$
b. Tính số đo $\widehat{ABy''}$; $\widehat{tCz''}$ 
c. Vẽ tia Am của tia phân giác $\widehat{xAC}$, tia Cn là tia phân giác của $\widehat{tCA}$. Am và Cn cắt nhau tại I. Chứng minh $Am \perp Cn$', NULL, 'a. Gọi $n$ là đường thẳng qua $A, H, K$ (như hình vẽ). Vì $\widehat{AHy''} = 90^\circ$ nên $n \perp yy''$ tại $H$. Vì $\widehat{AKt''} = 90^\circ$ nên $n \perp tt''$ tại $K$. Hai đường thẳng $yy''$ và $tt''$ cùng vuông góc với $n$ nên $yy'' \parallel tt''$.
b. Vì $xx'' \parallel yy''$ nên $\widehat{ABy''} = \widehat{xAC}$ (hai góc so le trong) $= 50^\circ$.
Vì $xx'' \parallel tt''$ (do $xx'' \parallel yy'' \parallel tt''$) nên $\widehat{tCz''} = \widehat{xAC}$ (hai góc đồng vị) $= 50^\circ$.
c. Vì $xx'' \parallel tt''$ nên $\widehat{xAC}$ và $\widehat{tCA}$ là hai góc trong cùng phía, suy ra $\widehat{xAC} + \widehat{tCA} = 180^\circ$, tức $\widehat{tCA} = 180^\circ - 50^\circ = 130^\circ$.
$Am$ là phân giác $\widehat{xAC}$ nên $\widehat{mAC} = 25^\circ$; $Cn$ là phân giác $\widehat{tCA}$ nên $\widehat{nCA} = 65^\circ$.
Xét tam giác $AIC$ ($I = Am \cap Cn$): $\widehat{AIC} = 180^\circ - \widehat{IAC} - \widehat{ICA} = 180^\circ - 25^\circ - 65^\circ = 90^\circ$.
Vậy $Am \perp Cn$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/335c5309-a1eb-4696-a4ad-f7c307960e42.svgxml', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0023', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', '.', NULL, 'Vì $Ox, Oy$ là hai tia đối nhau và $Ot, Oz$ là hai tia đối nhau nên $\widehat{zOy}$ và $\widehat{xOt}$ là hai góc đối đỉnh
$\Rightarrow \widehat{zOy} = \widehat{xOt} = 33^\circ$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/e5020f08-17be-42dc-8946-c21d312cc2ce.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0024', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', '.', NULL, 'Vì $m, E, n$ thẳng hàng nên $\widehat{xEn}$ và $\widehat{xEm}$ là hai góc kề bù
Vì $x, E, y$ thẳng hàng nên $\widehat{xEn}$ và $\widehat{nEy}$ là hai góc kề bù
$\Rightarrow$ Góc kề bù với $\widehat{xEn}$ là $\widehat{xEm}$ và $\widehat{nEy}$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/fca2e4fc-53ce-434a-9623-2c5f073cae1a.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0025', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', 'Chứng minh rằng:
a) $\triangle BME = \triangle CMF$
b) $ME = MF$
c) $CE = BF$
d) $CE \parallel BF$ ; $BE \parallel CF$ .', NULL, 'a) Xét $\triangle BME$ và $\triangle CMF$:
- $\widehat{BEM}=\widehat{CFM}=90^\circ$ (vì $BE,CF \perp Ax$)
- $MB=MC$ ($M$ là trung điểm $BC$)
- $\widehat{BME}=\widehat{CMF}$ (hai góc đối đỉnh, vì $B,M,C$ thẳng hàng và $E,M,F$ cùng thuộc $Ax$)
$\Rightarrow \triangle BME = \triangle CMF$ (cạnh huyền – góc nhọn).

b) Từ $\triangle BME=\triangle CMF$ (câu a) suy ra $ME=MF$ (hai cạnh tương ứng).

c) Xét $\triangle CME$ và $\triangle BMF$:
- $MC=MB$ (giả thiết)
- $\widehat{CME}=\widehat{BMF}$ (hai góc đối đỉnh)
- $ME=MF$ (câu b)
$\Rightarrow \triangle CME = \triangle BMF$ (c.g.c) $\Rightarrow CE=BF$ (hai cạnh tương ứng).

d) Từ $\triangle CME=\triangle BMF$ (câu c) suy ra $\widehat{MCE}=\widehat{MBF}$ (hai góc tương ứng); đây là cặp góc so le trong tạo bởi cát tuyến $BC$ với hai đường thẳng $CE$ và $BF$ $\Rightarrow CE \parallel BF$.
Từ $\triangle BME=\triangle CMF$ (câu a) suy ra $\widehat{MBE}=\widehat{MCF}$ (hai góc tương ứng), là cặp góc so le trong tạo bởi cát tuyến $BC$ với hai đường thẳng $BE$ và $CF$ $\Rightarrow BE \parallel CF$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0026', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', '.', NULL, 'Vì $Oz$ là tia phân giác của $\widehat{xOy}$ nên $\widehat{xOz} = \widehat{zOy} = \dfrac{\widehat{xOy}}{2}$
$\Rightarrow \widehat{xOz} = \dfrac{80^\circ}{2} = 40^\circ$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/f4f25d19-b41c-47f3-9c9c-5ea6d3834b77.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0027', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', 'Chứng minh:
a) $\triangle OHB = \triangle AHB$
b) $AB \parallel Oy$
c) $AC \parallel Ox$
d) $AO$ là tia phân giác góc $BAC$.', NULL, 'a) Xét $\triangle OHB$ và $\triangle AHB$:
- $OH = AH$ ($H$ là trung điểm $OA$)
- $\widehat{OHB} = \widehat{AHB} = 90^\circ$ ($BC \perp OA$ tại $H$)
- $HB$ chung

$\Rightarrow \triangle OHB = \triangle AHB$ (c.g.c) $\Rightarrow BO = BA$.

b) Tương tự, xét $\triangle OHC$ và $\triangle AHC$: $OH = AH$, $\widehat{OHC} = \widehat{AHC} = 90^\circ$, $HC$ chung $\Rightarrow \triangle OHC = \triangle AHC$ (c.g.c) $\Rightarrow CO = CA$.

Từ $\triangle OHB = \triangle AHB$ suy ra $\widehat{OAB} = \widehat{AOB}$. Vì $Om$ là phân giác góc $xOy$ nên $\widehat{AOB} = \widehat{xOm} = \widehat{mOy} = \widehat{AOC}$.

Do đó $\widehat{OAB} = \widehat{AOC}$. Đây là hai góc so le trong tạo bởi cát tuyến $OA$ với hai đường thẳng $AB$ và $Oy$ (chứa $C$) $\Rightarrow AB \parallel Oy$.

c) Tương tự, từ $\triangle OHC = \triangle AHC$ suy ra $\widehat{OAC} = \widehat{AOC} = \widehat{AOB}$. Đây là hai góc so le trong tạo bởi cát tuyến $OA$ với hai đường thẳng $AC$ và $Ox$ (chứa $B$) $\Rightarrow AC \parallel Ox$.

d) Ta có $\widehat{OAB} = \widehat{AOB} = \widehat{AOC} = \widehat{OAC}$ (chứng minh trên) nên $\widehat{BAO} = \widehat{OAC}$.

Vì $B$, $C$ nằm về hai phía của đường thẳng $Om$ (chứa $A$, $O$) nên tia $AO$ nằm giữa hai tia $AB$, $AC$. Vậy $AO$ là tia phân giác của $\widehat{BAC}$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0028', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 5),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '3a8ccb48-09d2-43f4-9eb1-74c0bba2d73c', 'Chứng minh $Ax//By$', NULL, NULL, 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/438b1301-b14b-4808-821b-8941f8c85818.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0029', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 5),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '3a8ccb48-09d2-43f4-9eb1-74c0bba2d73c', 'Chứng minh $Ax//Cy$', NULL, 'Theo giả thiết: $\widehat{xAB} = 45°$, $\widehat{yCB} = 40°$, $\widehat{ABC} = 85°$.

Qua $B$, vẽ tia $Bt$ song song với $Ax$, tia $Bt$ nằm trong góc $\widehat{ABC}$.

Vì $Bt \parallel Ax$ nên $\widehat{ABt} = \widehat{xAB} = 45°$ (hai góc so le trong, cát tuyến $AB$).

Vì tia $Bt$ nằm trong góc $\widehat{ABC}$ nên $\widehat{tBC} = \widehat{ABC} - \widehat{ABt} = 85° - 45° = 40°$.

Mà $\widehat{yCB} = 40°$, suy ra $\widehat{tBC} = \widehat{yCB}$. Đây là hai góc so le trong tạo bởi cát tuyến $BC$ với hai đường thẳng $Bt$ và $Cy$, nên $Bt \parallel Cy$.

Vậy $Bt \parallel Ax$ và $Bt \parallel Cy$ nên $Ax \parallel Cy$ (hai đường thẳng cùng song song với một đường thẳng thứ ba thì song song với nhau).', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/93d2e38b-a4de-4eb3-952a-442df4c3a717.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0030', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', 'a) Chứng minh $\triangle AKB=\triangle AKC$
b) Chứng minh $AK \perp BC$
c) Từ C kẻ đường vuông góc với BC tại C cắt đường thẳng AB tại E. Chứng minh: $EC \parallel AK$.
d) Chứng minh: $CB = CE$', NULL, 'a) Xét $\triangle AKB$ và $\triangle AKC$:
- $AB = AC$ (gt)
- $KB = KC$ ($K$ là trung điểm $BC$)
- $AK$ chung

$\Rightarrow \triangle AKB = \triangle AKC$ (c.c.c).

b) Từ $\triangle AKB = \triangle AKC$ suy ra $\widehat{AKB} = \widehat{AKC}$. Mà $\widehat{AKB} + \widehat{AKC} = 180^\circ$ ($B, K, C$ thẳng hàng) nên $\widehat{AKB} = \widehat{AKC} = 90^\circ$. Vậy $AK \perp BC$.

c) Theo gt, $CE \perp BC$ tại $C$; theo câu b, $AK \perp BC$. Hai đường thẳng $CE$ và $AK$ cùng vuông góc với $BC$ nên $EC \parallel AK$.

d) Vì $\triangle ABC$ có $\widehat{BAC} = 90^\circ$, $AB = AC$ nên $\widehat{ABC} = \widehat{ACB} = 45^\circ$.

Vì $E, A, B$ thẳng hàng và $\widehat{BAC} = 90^\circ$ nên $\widehat{EAC} = 180^\circ - \widehat{BAC} = 90^\circ$ (hai góc kề bù).

Vì $CE \perp BC$ tại $C$ nên $\widehat{BCE} = 90^\circ$; mà $\widehat{BCA} = 45^\circ$ và tia $CA$ nằm giữa hai tia $CB$, $CE$ nên $\widehat{ACE} = \widehat{BCE} - \widehat{BCA} = 90^\circ - 45^\circ = 45^\circ = \widehat{ACB}$.

Xét $\triangle ACB$ và $\triangle ACE$: $\widehat{BAC} = \widehat{EAC} = 90^\circ$, $AC$ chung, $\widehat{ACB} = \widehat{ACE} = 45^\circ$ $\Rightarrow \triangle ACB = \triangle ACE$ (g.c.g) $\Rightarrow CB = CE$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0031', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', 'a) Chứng minh $NB \parallel AC$ và $NB = AC$
b) Trên tia đối tia BN lấy điểm E sao cho $BN = BE$. Chứng minh: $AB = EC$
c) Gọi F là trung điểm của BC. Chứng minh A, E, F thẳng hàng.', NULL, 'a) Xét $\triangle AMC$ và $\triangle BMN$:
- $MA = MB$ ($M$ là trung điểm $AB$)
- $\widehat{AMC} = \widehat{BMN}$ (hai góc đối đỉnh, vì $A, M, B$ thẳng hàng và $C, M, N$ thẳng hàng)
- $MC = MN$ (gt)

$\Rightarrow \triangle AMC = \triangle BMN$ (c.g.c) $\Rightarrow AC = BN$ và $\widehat{MAC} = \widehat{MBN}$.

Hai góc $\widehat{MAC}$, $\widehat{MBN}$ ở vị trí so le trong (cát tuyến $AB$ cắt hai đường thẳng $AC$, $BN$) và bằng nhau $\Rightarrow AC \parallel BN$.

Vậy $NB \parallel AC$ và $NB = AC$.

b) Vì $E$ thuộc tia đối của tia $BN$ và $BE = BN$ nên $B$ là trung điểm $NE$; suy ra $BE = BN = AC$ (theo câu a) và $BE \parallel AC$ (vì $E, B, N$ thẳng hàng, $NB \parallel AC$).

Xét tứ giác $ABEC$ có $AC \parallel BE$ và $AC = BE$ (một cặp cạnh đối song song và bằng nhau) $\Rightarrow ABEC$ là hình bình hành $\Rightarrow AB = EC$ (cặp cạnh đối còn lại).

Vậy $AB = EC$.

c) Vì $ABEC$ là hình bình hành (câu b) nên hai đường chéo $AE$ và $BC$ cắt nhau tại trung điểm của mỗi đường.

Mà $F$ là trung điểm $BC$ (gt) nên giao điểm hai đường chéo chính là $F$, tức $F$ là trung điểm của $AE$.

Vậy $A$, $E$, $F$ thẳng hàng.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0032', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', 'a) Chứng minh: $\triangle ABD = \triangle ACD$
b) Trên nửa mặt phẳng bờ BC chứa điểm A vẽ tia $Cx \perp BC$. Trên nửa mặt phẳng bờ AB chứa
điểm C vẽ tia $Ay \parallel BC$. Chứng minh $\widehat{yAC} = \widehat{ABC}$
c) Chứng minh: $AD \parallel Cx$
d) Gọi I là trung điểm của AC, K là giao điểm của hai tia Ay và Cx. Chứng minh I là trung điểm
của DK.', NULL, 'a) Xét $\triangle ABD$ và $\triangle ACD$:
- $AB = AC$ (gt)
- $\widehat{BAD} = \widehat{CAD}$ ($AD$ là tia phân giác góc $A$)
- $AD$ chung

$\Rightarrow \triangle ABD = \triangle ACD$ (c.g.c).

b) Vì $Ay \parallel BC$, xét cát tuyến $AC$ cắt hai đường thẳng song song $Ay$, $BC$: $\widehat{yAC}$ và $\widehat{ACB}$ ở vị trí so le trong $\Rightarrow \widehat{yAC} = \widehat{ACB}$.

Mặt khác $\triangle ABC$ cân tại $A$ ($AB = AC$) nên $\widehat{ABC} = \widehat{ACB}$.

Vậy $\widehat{yAC} = \widehat{ACB} = \widehat{ABC}$.

c) Từ câu a, $\triangle ABD = \triangle ACD$ suy ra $\widehat{ADB} = \widehat{ADC}$. Mà $\widehat{ADB} + \widehat{ADC} = 180^\circ$ ($B, D, C$ thẳng hàng) nên $\widehat{ADB} = \widehat{ADC} = 90^\circ$, tức $AD \perp BC$.

Theo gt, $Cx \perp BC$ tại $C$. Hai đường thẳng $AD$ và $Cx$ cùng vuông góc với $BC$ nên $AD \parallel Cx$.

d) Xét tứ giác $AKCD$: $AK \parallel DC$ (vì $Ay \parallel BC$ và $D, C$ thuộc đường thẳng $BC$); $AD \parallel KC$ (vì $AD \parallel Cx$ — câu c — và $K$ thuộc tia $Cx$).

Tứ giác có hai cặp cạnh đối song song $\Rightarrow AKCD$ là hình bình hành. Hai đường chéo của $AKCD$ là $AC$ và $KD$ cắt nhau tại trung điểm mỗi đường, nên trung điểm $AC$ = trung điểm $KD$.

Mà $I$ là trung điểm $AC$ (gt) $\Rightarrow I$ là trung điểm $DK$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0033', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 5),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '3a8ccb48-09d2-43f4-9eb1-74c0bba2d73c', 'Tính $\widehat{BAC}$', NULL, 'Vì $BD \perp DE$ và $CE \perp DE$ nên $BD \parallel CE$ (hai đường thẳng cùng vuông góc với đường thẳng thứ ba $DE$).

Qua $A$, vẽ tia $At$ song song với $BD$ (do đó $At$ cũng song song với $CE$), tia $At$ nằm trong góc $\widehat{BAC}$.

Vì $At \parallel BD$ nên $\widehat{BAt} + \widehat{ABD} = 180°$ (hai góc trong cùng phía, cát tuyến $AB$), suy ra $\widehat{BAt} = 180° - 160° = 20°$.

Vì $At \parallel CE$ nên $\widehat{CAt} + \widehat{ACE} = 180°$ (hai góc trong cùng phía, cát tuyến $AC$), suy ra $\widehat{CAt} = 180° - 130° = 50°$.

Vì tia $At$ nằm trong góc $\widehat{BAC}$ nên $\widehat{BAC} = \widehat{BAt} + \widehat{CAt} = 20° + 50° = 70°$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/9a04e19c-84f2-4eae-bf99-76dba89f82ae.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0034', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 5),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '3a8ccb48-09d2-43f4-9eb1-74c0bba2d73c', 'Tính $\widehat{ABC}$', NULL, 'Vì $AM \perp MN$ và $CN \perp MN$ nên $AM \parallel CN$ (hai đường thẳng cùng vuông góc với đường thẳng thứ ba $MN$).

Qua $B$, vẽ tia $Bt$ song song với $AM$ (do đó $Bt$ cũng song song với $CN$), tia $Bt$ nằm trong góc $\widehat{ABC}$.

Vì $Bt \parallel AM$ nên $\widehat{ABt} = \widehat{BAM} = 22°$ (hai góc so le trong, cát tuyến $AB$).

Vì $Bt \parallel CN$ nên $\widehat{tBC} = \widehat{BCN} = 32°$ (hai góc so le trong, cát tuyến $BC$).

Vậy $\widehat{ABC} = \widehat{ABt} + \widehat{tBC} = 22° + 32° = 54°$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/c4831bde-5325-4e54-8d05-92cd56d74e92.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0035', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', 'a) Chứng minh $\triangle ABE = \triangle MBE$.
b) Chứng minh BE là tia phân giác của góc ABC
c) Gọi K là giao điểm của BE và AC. Chứng minh $KM \perp BC$.
d) Trên tia đối của tia MK lấy điểm H sao cho $MH = MC$. Chứng minh ba điểm B, A, H thẳng hàng', NULL, NULL, NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0036', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', 'a) Chứng minh rằng: $\triangle AMB = \triangle DMC$ và $AB = DC$
b) Chứng minh rằng $BD \parallel AC$
c) Qua M vẽ đường thẳng vuông góc với AC tại I, và đường thẳng vuông góc với BD tại K.
Chứng minh rằng ba điểm I, M, K thẳng hàng.', NULL, 'a) Xét $\triangle AMB$ và $\triangle DMC$:
- $MA = MD$ (gt)
- $\widehat{AMB} = \widehat{DMC}$ (hai góc đối đỉnh, vì $A, M, D$ thẳng hàng và $B, M, C$ thẳng hàng)
- $MB = MC$ ($M$ là trung điểm $BC$)

$\Rightarrow \triangle AMB = \triangle DMC$ (c.g.c) $\Rightarrow AB = DC$.

b) Xét $\triangle AMC$ và $\triangle DMB$: $MA = MD$, $\widehat{AMC} = \widehat{DMB}$ (đối đỉnh), $MC = MB$ $\Rightarrow \triangle AMC = \triangle DMB$ (c.g.c) $\Rightarrow \widehat{MAC} = \widehat{MDB}$.

Hai góc này ở vị trí so le trong (cát tuyến $AD$ cắt hai đường thẳng $AC$, $DB$) và bằng nhau $\Rightarrow AC \parallel DB$, tức $BD \parallel AC$.

c) Vì $AC \parallel BD$ (câu b) mà $MI \perp AC$ tại $I$ nên $MI \perp BD$ (đường thẳng vuông góc với một trong hai đường thẳng song song thì vuông góc với đường thẳng còn lại).

Lại có $MK \perp BD$ tại $K$ (gt). Qua điểm $M$ chỉ có duy nhất một đường thẳng vuông góc với $BD$, nên đường thẳng $MI$ và đường thẳng $MK$ trùng nhau.

Vậy $I$, $M$, $K$ thẳng hàng.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0037', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', 'Chứng minh rằng:
a) $AM = BC$
b) $AM \parallel BC$
c) A là trung điểm của đoạn thẳng MN.', NULL, 'a) Xét $\triangle ADM$ và $\triangle CDB$:
- $DA = DC$ (D là trung điểm AC)
- $DM = DB$ (giả thiết)
- $\widehat{ADM} = \widehat{CDB}$ (hai góc đối đỉnh)
$\Rightarrow \triangle ADM = \triangle CDB$ (c.g.c) $\Rightarrow AM = CB$, tức $AM = BC$.
Từ đó $\widehat{DAM} = \widehat{DCB}$ (hai góc tương ứng), hai góc này ở vị trí so le trong tạo bởi cát tuyến $AC$ với hai đường thẳng $AM$ và $CB$ $\Rightarrow AM \parallel BC$.

b) Xét $\triangle AEN$ và $\triangle BEC$:
- $EA = EB$ (E là trung điểm AB)
- $EN = EC$ (giả thiết)
- $\widehat{AEN} = \widehat{BEC}$ (hai góc đối đỉnh)
$\Rightarrow \triangle AEN = \triangle BEC$ (c.g.c) $\Rightarrow AN = BC$.
Từ đó $\widehat{EAN} = \widehat{EBC}$ (hai góc tương ứng), so le trong với cát tuyến $AB$ $\Rightarrow AN \parallel BC$.

c) Từ câu a) và b): $AM \parallel BC$ và $AN \parallel BC$. Qua điểm $A$ chỉ có duy nhất một đường thẳng song song với $BC$ (tiên đề Euclid) nên ba điểm $M, A, N$ thẳng hàng.
Lại có $AM = BC = AN$ (từ a, b), và $M \ne N$ (hai điểm dựng từ hai phép dựng độc lập qua $D$ và $E$). Trên một đường thẳng chỉ có đúng hai điểm cách $A$ một khoảng bằng $AM$, nằm về hai phía đối diện của $A$; vì $M \ne N$ nên $M, N$ chính là hai điểm đó, tức $A$ nằm giữa $M$ và $N$. Vậy $A$ là trung điểm của $MN$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0038', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', 'a) Chứng minh rằng: $\widehat{HDA} = \widehat{BAD}$.
b) Trên tia đối của tia HD lấy điểm M sao cho $MH = HD$. Chứng minh rằng: $CD = CM$.
c) Chứng minh rằng: $\triangle MCA = \triangle DCA$.
d) Kéo dài CM và BA cắt nhau tại K. Chứng minh rằng: $\widehat{MKA} = \widehat{DBA}$.', NULL, 'a) Trong $\triangle ADH$ vuông tại $H$ (vì $DH \perp AC$): $\widehat{HDA} + \widehat{HAD} = 90^\circ$ (1).
Vì $\widehat{BAC} = 90^\circ$ và tia $AD$ nằm giữa hai tia $AB, AC$ nên $\widehat{BAD} + \widehat{DAC} = 90^\circ$ (2).
Mà $\widehat{HAD} = \widehat{DAC}$ (H thuộc đoạn AC nên tia $AH$ trùng tia $AC$).
So sánh (1), (2): $\widehat{HDA} = 90^\circ - \widehat{DAC} = \widehat{BAD}$.

b) Vì $MH = HD$ và $M$ trên tia đối tia $HD$ nên $H$ là trung điểm $DM$; lại có $DH \perp AC$ tại $H$, nên $AC$ là đường trung trực của đoạn $DM$. Mọi điểm trên $AC$ cách đều $D$ và $M$; $C \in AC$ nên $CD = CM$.

c) Vì $AC$ là trung trực của $DM$ (câu b) và $A \in AC$, ta có $AD = AM$. Xét $\triangle MCA$ và $\triangle DCA$:
- $CA$ chung
- $CM = CD$ (câu b)
- $AM = AD$ (vừa nêu)
$\Rightarrow \triangle MCA = \triangle DCA$ (c.c.c).

d) Từ câu c): $\widehat{AMC} = \widehat{ADC}$ và $\widehat{MAC} = \widehat{DAC}$ (các góc tương ứng).
Vì $D$ nằm giữa $B, C$ nên $\widehat{ADB} = 180^\circ - \widehat{ADC}$ (kề bù).
Vì $K, M, C$ thẳng hàng và (theo hình vẽ) $M$ nằm giữa $K, C$ nên $\widehat{AMK} = 180^\circ - \widehat{AMC} = 180^\circ - \widehat{ADC} = \widehat{ADB}$.
Theo hình vẽ, $K$ thuộc tia đối của tia $AB$ (giao điểm của $CM$ kéo dài với $BA$ kéo dài) và tia $AC$ nằm giữa hai tia $AM, AB$, nên:
$\widehat{MAK} = 180^\circ - \widehat{MAB} = 180^\circ - (\widehat{MAC} + \widehat{CAB}) = 180^\circ - (\widehat{DAC} + 90^\circ) = 90^\circ - \widehat{DAC} = \widehat{DAB}$ (theo câu a).
Xét $\triangle AMK$ và $\triangle ADB$: $AM = AD$ (câu c), $\widehat{MAK} = \widehat{DAB}$, $\widehat{AMK} = \widehat{ADB}$ $\Rightarrow \triangle AMK = \triangle ADB$ (g.c.g) $\Rightarrow \widehat{AKM} = \widehat{ABD}$, tức $\widehat{MKA} = \widehat{DBA}$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0039', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', 'a) $\triangle AMB = \triangle EMC$
b) AC vuông góc với CE
c) $BC = 2AM$', NULL, 'a) Xét $\triangle AMB$ và $\triangle EMC$:
- $MA = ME$ (giả thiết)
- $\widehat{AMB} = \widehat{EMC}$ (hai góc đối đỉnh)
- $MB = MC$ (M là trung điểm BC)
$\Rightarrow \triangle AMB = \triangle EMC$ (c.g.c).

b) Từ câu a): $AB = EC$ (hai cạnh tương ứng) và $\widehat{ABM} = \widehat{ECM}$ (hai góc tương ứng), hai góc này ở vị trí so le trong tạo bởi cát tuyến $BC$ với hai đường thẳng $AB, EC$ $\Rightarrow AB \parallel EC$.
Vì $\triangle ABC$ vuông tại $A$ nên $AB \perp AC$. Mà $AB \parallel EC$ $\Rightarrow EC \perp AC$, tức $AC \perp CE$.

c) Vì $ME = MA$ và $E$ trên tia đối của tia $MA$, và $M$ là trung điểm $BC$, nên $M$ cũng là trung điểm $AE$, do đó $AE = 2AM$.
Xét $\triangle BAC$ và $\triangle ECA$: $\widehat{BAC} = \widehat{ECA} = 90^\circ$ (giả thiết và câu b), $AB = EC$ (câu a), $AC$ chung $\Rightarrow \triangle BAC = \triangle ECA$ (c.g.c) $\Rightarrow BC = EA$ (hai cạnh huyền tương ứng).
Vậy $BC = EA = 2AM$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0040', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', 'a) Chứng minh: $\triangle ABM = \triangle ACM$ .
b) Chứng minh: AM là phân giác của $\widehat{BAC}$ và $AM \perp BC$ .
c) Trên cạnh AB lấy điểm H, trên cạnh AC lấy điểm K sao cho $AH = AK$ , Gọi giao điểm của
HK và AM là I. Chứng minh: $AI \perp HK$ ;
d) Chứng minh rằng $HK \parallel BC$', NULL, 'a) Xét $\triangle ABM$ và $\triangle ACM$ có: $AB = AC$ ($\triangle ABC$ cân tại A), $BM = CM$ (M là trung điểm BC), $AM$ chung. Vậy $\triangle ABM = \triangle ACM$ (c.c.c).

b) Từ câu a), $\widehat{BAM} = \widehat{CAM}$ (hai góc tương ứng) nên AM là tia phân giác của $\widehat{BAC}$.
Cũng từ câu a), $\widehat{AMB} = \widehat{AMC}$ (hai góc tương ứng), mà $\widehat{AMB} + \widehat{AMC} = 180^\circ$ (kề bù) nên $\widehat{AMB} = \widehat{AMC} = 90^\circ$. Vậy $AM \perp BC$.

c) Xét $\triangle AHI$ và $\triangle AKI$ có: $AH = AK$ (gt), $\widehat{HAI} = \widehat{KAI}$ (AM là phân giác $\widehat{BAC}$, I thuộc AM), $AI$ chung. Vậy $\triangle AHI = \triangle AKI$ (c.g.c) nên $\widehat{AIH} = \widehat{AIK}$ (hai góc tương ứng), mà $\widehat{AIH} + \widehat{AIK} = 180^\circ$ (kề bù) nên $\widehat{AIH} = \widehat{AIK} = 90^\circ$. Vậy $AI \perp HK$.

d) Vì $AH = AK$ nên $\triangle AHK$ cân tại A, mà AI là phân giác của $\widehat{HAK}$ (I thuộc AM là phân giác $\widehat{BAC}$) nên AI đồng thời là đường trung trực của HK, tức $AM \perp HK$ (đã chứng minh ở câu c). Theo câu b), $AM \perp BC$. Hai đường thẳng $HK$ và $BC$ cùng vuông góc với đường thẳng $AM$ nên $HK \parallel BC$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0041', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', 'a) Chứng minh $\triangle ABD = \triangle ACD$.
b) Từ D kẻ DE vuông góc với AB ($E \in AB$), DF vuông góc với AC ($F \in AC$). Chứng minh $DE = DF$.
c) Gọi I là trung điểm của EF. Chứng minh 3 điểm A, I, D thẳng hàng.', NULL, 'a) Xét $\triangle ABD$ và $\triangle ACD$ có: 
$AB=AC$ (giả thiết); 
$\widehat{BAD}=\widehat{CAD}$ ($AD$ là tia phân giác $\widehat{BAC}$); 
$AD$ là cạnh chung. 
Do đó $\triangle ABD=\triangle ACD$ (c.g.c).

b) Xét hai tam giác vuông $\triangle ADE$ và $\triangle ADF$ ($\widehat{AED}=\widehat{AFD}=90^\circ$) có: $AD$ là cạnh huyền chung; $\widehat{DAE}=\widehat{DAF}$ ($AD$ là phân giác $\widehat{BAC}$). Do đó $\triangle ADE=\triangle ADF$ (cạnh huyền - góc nhọn), suy ra $DE=DF$.

c) Từ câu b) suy ra thêm $AE=AF$ (hai cạnh tương ứng). Vì $AE=AF$ và $DE=DF$ nên cả $A$ và $D$ đều cách đều hai điểm $E, F$, do đó đường thẳng $AD$ là đường trung trực của đoạn thẳng $EF$. Mà đường trung trực của một đoạn thẳng luôn đi qua trung điểm của đoạn thẳng đó, nên $AD$ đi qua trung điểm $I$ của $EF$. Vậy $A, I, D$ thẳng hàng.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0042', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 5),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '3a8ccb48-09d2-43f4-9eb1-74c0bba2d73c', 'Tính $\widehat{CED}$', NULL, NULL, 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/cb0f64ce-e3da-48bb-b964-8a2910a25c24.png', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/b57e15d6-b51e-41f8-9c11-236c2c75a6ac.png', 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0043', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 5),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '3a8ccb48-09d2-43f4-9eb1-74c0bba2d73c', 'Tính $\widehat{CNM}$', NULL, NULL, 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/fe4e71a1-0c3b-4fda-8a46-fca22d17b2c4.png', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/35320933-9207-4e16-b978-81ca283cc544.png', 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0044', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', 'a) Chứng minh $\triangle AMB = \triangle CMD$
b) Chứng minh $\triangle ABC = \triangle CDA$
c) Chứng minh $AD = CB$ và $AD \parallel CB$
d) Gọi N là trung điểm của AB. Trên tia đối của tia NC lấy điểm K sao cho $NC = NK$.
Chứng minh 3 điểm D, A, K thẳng hàng.
e) Vẽ $CE \perp AD$ ($E \in AD$) và $AF \perp BC$ ($F \in BC$). Chứng minh $DE = BF$.', NULL, 'a) Xét $\triangle AMB$ và $\triangle CMD$ có: $MA = MC$ (M trung điểm AC), $MB = MD$ (gt), $\widehat{AMB} = \widehat{CMD}$ (hai góc đối đỉnh). Vậy $\triangle AMB = \triangle CMD$ (c.g.c).

b) Từ câu a): $AB = CD$ và $\widehat{MAB} = \widehat{MCD}$ (hai góc tương ứng), đây là hai góc so le trong tạo bởi cát tuyến AC với AB và CD nên $AB \parallel CD$, suy ra $\widehat{BAC} = \widehat{DCA}$ (so le trong).
Xét $\triangle ABC$ và $\triangle CDA$ có: $AB = CD$ (trên), $\widehat{BAC} = \widehat{DCA}$ (trên), $AC$ chung. Vậy $\triangle ABC = \triangle CDA$ (c.g.c).

c) Xét $\triangle AMD$ và $\triangle CMB$ có: $MA = MC$ (M trung điểm AC), $MD = MB$ (gt), $\widehat{AMD} = \widehat{CMB}$ (đối đỉnh). Vậy $\triangle AMD = \triangle CMB$ (c.g.c) nên $AD = CB$ (hai cạnh tương ứng) và $\widehat{MAD} = \widehat{MCB}$ (hai góc tương ứng, so le trong tạo bởi cát tuyến AC) nên $AD \parallel CB$.

d) Xét $\triangle ANK$ và $\triangle BNC$ có: $NA = NB$ (N trung điểm AB), $NK = NC$ (gt), $\widehat{ANK} = \widehat{BNC}$ (đối đỉnh). Vậy $\triangle ANK = \triangle BNC$ (c.g.c) nên $\widehat{NAK} = \widehat{NBC}$ (so le trong, cát tuyến AB) nên $AK \parallel BC$.
Theo câu c), $AD \parallel CB$. Qua điểm A có hai đường thẳng AD và AK cùng song song với BC nên theo tiên đề Ơ-clit, AD và AK là cùng một đường thẳng. Vậy D, A, K thẳng hàng.

e) Theo câu b), $\triangle ABC = \triangle CDA$ nên $\widehat{ABC} = \widehat{CDA}$ (hai góc tương ứng), tức $\widehat{ABF} = \widehat{CDE}$ (F thuộc BC, E thuộc AD). Theo câu a), $AB = CD$.
Xét $\triangle ABF$ và $\triangle CDE$ (vuông tại F và tại E, do $AF \perp BC$, $CE \perp AD$) có: $AB = CD$ (cạnh huyền), $\widehat{ABF} = \widehat{CDE}$ (trên). Vậy $\triangle ABF = \triangle CDE$ (cạnh huyền - góc nhọn) nên $BF = DE$ (hai cạnh tương ứng).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0045', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', 'a) Chứng minh $\triangle ABD = \triangle EBD$.
b) Chứng minh $DE = AD$ và $DE \perp BC$.
c) Chứng minh BD là đường trung trực của AE.
d) Trên tia đối của tia AB lấy điểm F sao cho $AF = CE$.Chứng minh D, F, E thẳng hàng.', NULL, 'a) Xét $\triangle ABD$ và $\triangle EBD$ có: $BA = BE$ (gt), $\widehat{ABD} = \widehat{EBD}$ (BD là phân giác $\widehat{ABC}$), $BD$ chung. Vậy $\triangle ABD = \triangle EBD$ (c.g.c).

b) Từ câu a): $DA = DE$ (hai cạnh tương ứng) và $\widehat{BAD} = \widehat{BED}$ (hai góc tương ứng). Mà $\widehat{BAD} = \widehat{BAC} = 90^\circ$ ($\triangle ABC$ vuông tại A) nên $\widehat{BED} = 90^\circ$, tức $DE \perp BC$.

c) Ta có $BA = BE$ (gt) và $DA = DE$ (câu b), nên B và D cùng cách đều hai điểm A, E. Vậy BD là đường trung trực của đoạn thẳng AE.

d) Vì F thuộc tia đối tia AB nên $\widehat{DAF}$ và $\widehat{DAB}$ kề bù, mà $\widehat{DAB} = 90^\circ$ nên $\widehat{DAF} = 90^\circ$.
Vì $E \in BC$ và $\widehat{DEB} = 90^\circ$ (câu b) nên $\widehat{DEC}$ (kề bù với $\widehat{DEB}$) $= 90^\circ$.
Xét $\triangle DAF$ và $\triangle DEC$ có: $DA = DE$ (câu b), $\widehat{DAF} = \widehat{DEC} = 90^\circ$, $AF = EC$ (gt). Vậy $\triangle DAF = \triangle DEC$ (c.g.c) nên $\widehat{ADF} = \widehat{EDC}$ (hai góc tương ứng).
Mặt khác A, D, C thẳng hàng (D∈AC) nên $\widehat{ADE} + \widehat{EDC} = 180^\circ$. Thay $\widehat{EDC} = \widehat{ADF}$ vào, ta có $\widehat{ADE} + \widehat{ADF} = 180^\circ$, tức $\widehat{FDE} = 180^\circ$. Vậy D, F, E thẳng hàng.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0046', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', 'a) Chứng minh $EA = EC$ .
b) Chứng minh $\triangle AEF = \triangle CEB$ .
c) Gọi H là trung điểm của FB. Chứng minh M,E,H thẳng hàng', NULL, 'a) Xét $\triangle MAE$ và $\triangle MCE$ có: $MA = MC$ (gt), $\widehat{AME} = \widehat{CME}$ (ME là phân giác $\widehat{AMB}$), $ME$ chung. Vậy $\triangle MAE = \triangle MCE$ (c.g.c) nên $EA = EC$ (hai cạnh tương ứng).

b) Từ câu a), $\widehat{MAE} = \widehat{MCE}$ (hai góc tương ứng).
Vì F thuộc tia MA nên $\widehat{FAE}$ kề bù với $\widehat{MAE}$: $\widehat{FAE} = 180^\circ - \widehat{MAE}$.
Vì C thuộc đoạn MB nên $\widehat{BCE}$ kề bù với $\widehat{MCE}$: $\widehat{BCE} = 180^\circ - \widehat{MCE}$.
Do $\widehat{MAE} = \widehat{MCE}$ nên $\widehat{FAE} = \widehat{BCE}$.
Mặt khác F, E, C thẳng hàng (F nằm trên đường thẳng CE) và A, E, B thẳng hàng nên $\widehat{AEF} = \widehat{CEB}$ (đối đỉnh).
Xét $\triangle AEF$ và $\triangle CEB$ có: $\widehat{FAE} = \widehat{BCE}$ (trên), $EA = EC$ (câu a), $\widehat{AEF} = \widehat{CEB}$ (trên). Vậy $\triangle AEF = \triangle CEB$ (g.c.g).

c) Từ câu b), $EF = EB$ và $AF = CB$ (các cạnh tương ứng).
Vì F thuộc tia MA nên $MF = MA + AF$; vì C thuộc đoạn MB nên $MB = MC + CB$. Mà $MA = MC$ (gt) và $AF = CB$ (trên) nên $MF = MB$, tức $\triangle MFB$ cân tại M.
Vì F thuộc tia MA nên $\widehat{FMB} = \widehat{AMB}$, mà ME là phân giác $\widehat{AMB}$ nên ME cũng là phân giác của $\widehat{FMB}$.
Trong tam giác cân MFB (MF = MB), đường phân giác của góc ở đỉnh M đồng thời là đường trung tuyến, tức đi qua trung điểm của FB. Vậy tia ME đi qua trung điểm H của FB, do đó M, E, H thẳng hàng.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0047', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', 'a) Chứng minh $\triangle AMC = \triangle DMB$.
b) Chứng minh $AC \parallel BD$.
c) Kẻ $AH \perp BC$, $DK \perp BC$ (H, K thuộc BC). Chứng minh $AH = DK$.
d) Gọi I là trung điểm của AC, vẽ điểm E sao cho I là trung điểm của BE. Chứng minh ba điểm E, C, D thẳng hàng.', NULL, 'a) Xét $\triangle AMC$ và $\triangle DMB$ có: $MA=MD$ (giả thiết); $\widehat{AMC}=\widehat{DMB}$ (hai góc đối đỉnh); $MC=MB$ ($M$ là trung điểm $BC$). Do đó $\triangle AMC=\triangle DMB$ (c.g.c).

b) Từ câu a) suy ra $\widehat{MAC}=\widehat{MDB}$ (hai góc tương ứng). Đây là cặp góc so le trong tạo bởi đường thẳng $AD$ cắt hai đường thẳng $AC, DB$, suy ra $AC \parallel BD$.

c) Xét hai tam giác vuông $\triangle AHM$ và $\triangle DKM$ ($\widehat{AHM}=\widehat{DKM}=90^\circ$) có: $MA=MD$ (giả thiết, là hai cạnh huyền); $\widehat{AMH}=\widehat{DMK}$ (hai góc đối đỉnh). Do đó $\triangle AHM=\triangle DKM$ (cạnh huyền - góc nhọn), suy ra $AH=DK$.

d) Vì $I$ là trung điểm của $AC$ và cũng là trung điểm của $BE$, nên tứ giác $ABCE$ có hai đường chéo $AC, BE$ cắt nhau tại trung điểm mỗi đường, do đó $ABCE$ là hình bình hành, suy ra $CE \parallel AB$.

Mặt khác, từ câu a), tứ giác $ABDC$ có hai đường chéo $AD, BC$ cắt nhau tại trung điểm $M$ của mỗi đường (do $MA=MD$, $MB=MC$), nên $ABDC$ cũng là hình bình hành, suy ra $CD \parallel AB$.

Qua điểm $C$ có cả $CE \parallel AB$ và $CD \parallel AB$; theo tiên đề Euclid, qua một điểm ngoài một đường thẳng chỉ có một đường thẳng song song với đường thẳng đó, nên hai đường thẳng $CE$ và $CD$ trùng nhau. Vậy ba điểm $E, C, D$ thẳng hàng.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0048', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 6),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e88e3d74-08e3-43d6-94c3-93a0b0f07f79', 'a) Tính số đo các góc của $\triangle AOE$.
b) Trên tia Oy lấy điểm B sao cho $OA = OB$. Chứng minh $\triangle AOE = \triangle BOE$.
c) Lấy M thuộc đoạn thẳng OA, N thuộc đoạn thẳng EB sao cho $AM = BN$. Nối AB cắt tia Om tại I. Chứng minh: M, I, N thẳng hàng', NULL, 'a) Vì $Om$ là tia phân giác của $\widehat{xOy}$ nên $\widehat{xOm}=\widehat{mOy}=\dfrac{\widehat{xOy}}{2}=40^\circ$.

Vì $A$ thuộc tia $Ox$, $E$ thuộc tia $Om$ nên $\widehat{AOE}=\widehat{xOm}=40^\circ$.

Vì $AE \parallel Oy$ nên $\widehat{AEO}=\widehat{EOy}$ (so le trong, cát tuyến $OE$), suy ra $\widehat{AEO}=\widehat{mOy}=40^\circ$.

Trong $\triangle AOE$: $\widehat{OAE}=180^\circ-\widehat{AOE}-\widehat{AEO}=100^\circ$.

Vậy $\widehat{AOE}=40^\circ$, $\widehat{AEO}=40^\circ$, $\widehat{OAE}=100^\circ$.

b) Xét $\triangle AOE$ và $\triangle BOE$ có: $OA=OB$ (giả thiết); $\widehat{AOE}=\widehat{BOE}$ (vì $\widehat{AOE}=\widehat{xOm}$, $\widehat{BOE}=\widehat{yOm}$, mà $\widehat{xOm}=\widehat{yOm}$); $OE$ là cạnh chung. Do đó $\triangle AOE=\triangle BOE$ (c.g.c).

c) Từ câu a), $\triangle OAE$ cân tại $A$ (vì $\widehat{AOE}=\widehat{AEO}=40^\circ$), suy ra $OA=AE$. Từ câu b), $EB=EA$ (hai cạnh tương ứng). Do đó $OA=AE=EB=BO$, nên tứ giác $OAEB$ có bốn cạnh bằng nhau, tức là hình thoi. Suy ra hai đường chéo $OE$ và $AB$ cắt nhau tại trung điểm mỗi đường; giao điểm đó chính là $I$ (giao của $AB$ với tia $Om$, vì $Om$ chứa $OE$). Vậy $OI=EI$.

Đặt $AM=BN=t$. Vì $M$ thuộc đoạn $OA$ nên $OM=OA-t$; vì $N$ thuộc đoạn $EB$ nên $EN=EB-t$. Mà $OA=EB$ (chứng minh trên) nên $OM=EN$.

Ta có $\widehat{IOM}=\widehat{AOE}=40^\circ$ (tia $OI$ là tia $Om$, tia $OM$ là tia $OA$). Từ câu b), $\widehat{OEA}=\widehat{OEB}$, suy ra $\widehat{IEN}=\widehat{OEB}=\widehat{OEA}=40^\circ$ (tia $EI$ là tia $EO$, tia $EN$ là tia $EB$). Vậy $\widehat{IOM}=\widehat{IEN}$.

Xét $\triangle OIM$ và $\triangle EIN$ có: $OI=EI$; $\widehat{IOM}=\widehat{IEN}$; $OM=EN$. Do đó $\triangle OIM=\triangle EIN$ (c.g.c), suy ra $\widehat{OIM}=\widehat{EIN}$.

Vì $O, I, E$ thẳng hàng nên $\widehat{OIM}+\widehat{MIE}=180^\circ$ (kề bù). Kết hợp $\widehat{OIM}=\widehat{EIN}$, ta có $\widehat{MIE}+\widehat{EIN}=180^\circ$, tức $\widehat{MIN}=180^\circ$. Vậy $M, I, N$ thẳng hàng.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0049', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 5),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '3a8ccb48-09d2-43f4-9eb1-74c0bba2d73c', 'TÍnh $\widehat{MNP}$', NULL, 'Vì $a \parallel b$.

Qua $N$, vẽ tia $Nt$ song song với $a$ và $b$, cùng hướng với tia $Ma$.

Vì $Nt \parallel a$, cát tuyến $MN$, hai tia $Nt$ và $Ma$ cùng hướng nên $\widehat{aMN}$ và $\widehat{tNM}$ là hai góc trong cùng phía: $\widehat{aMN} + \widehat{tNM} = 180°$, suy ra $\widehat{tNM} = 180° - 100° = 80°$.

Vì $Nt \parallel b$, cát tuyến $NP$, hai tia $Nt$ và $Pb$ ngược hướng nên $\widehat{tNP}$ và $\widehat{NPb}$ là hai góc so le trong: $\widehat{tNP} = \widehat{NPb} = 120°$.

Vì $\widehat{tNM} = 80° < \widehat{tNP} = 120°$ nên tia $NM$ nằm trong góc $\widehat{tNP}$, do đó $\widehat{MNP} = \widehat{tNP} - \widehat{tNM} = 120° - 80° = 40°$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/6f72da8d-eb98-4d74-9c83-eefb80fac598.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0050', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 5),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '3a8ccb48-09d2-43f4-9eb1-74c0bba2d73c', 'TÍnh $\widehat{ABC}$', NULL, 'Kẻ tia $Bt$ đi qua $B$ song song với hai tia $Ax$, $Cy$ (tia $Bt$ nằm giữa hai tia $BA$, $BC$).

Vì $Bt \parallel Ax$ nên $\widehat{ABt} = \widehat{xAB} = 35^0$ (hai góc so le trong).

Vì $Bt \parallel Cy$ nên $\widehat{tBC}$ và $\widehat{BCy}$ là hai góc trong cùng phía, suy ra $\widehat{tBC} = 180^0 - \widehat{BCy} = 180^0 - 135^0 = 45^0$.

Vậy $\widehat{ABC} = \widehat{ABt} + \widehat{tBC} = 35^0 + 45^0 = 80^0$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/cb52a185-10a2-43e7-a8e8-651aafe68d09.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0051', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 5),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '3a8ccb48-09d2-43f4-9eb1-74c0bba2d73c', 'Tính $\widehat{BCy}$', NULL, 'Kẻ tia $Bt$ đi qua $B$ song song với hai tia $Ax$, $Cy$ (tia $Bt$ nằm giữa hai tia $BA$, $BC$).

Vì $Bt \parallel Ax$ nên $\widehat{ABt} = \widehat{xAB} = 40^0$ (hai góc so le trong).

Vì tia $Bt$ nằm giữa hai tia $BA$, $BC$ nên $\widehat{tBC} = \widehat{ABC} - \widehat{ABt} = 60^0 - 40^0 = 20^0$.

Vì $Bt \parallel Cy$ nên $\widehat{tBC} = \widehat{BCy}$ (hai góc so le trong).

Vậy $\widehat{BCy} = 20^0$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/1fc6d106-4269-4ab6-975b-e673c71c62d3.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0052', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 5),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '3a8ccb48-09d2-43f4-9eb1-74c0bba2d73c', 'Chứng minh $Ma // Pb$', NULL, 'Kẻ tia $Nt$ đi qua $N$ song song với tia $Ma$.

Vì $Nt \parallel Ma$ nên $\widehat{tNM}$ và $\widehat{aMN}$ là hai góc trong cùng phía, suy ra $\widehat{tNM} = 180^0 - \widehat{aMN} = 180^0 - 100^0 = 80^0$.

Vì tia $NM$ nằm giữa hai tia $Nt$, $NP$ nên $\widehat{tNP} = \widehat{tNM} + \widehat{MNP} = 80^0 + 40^0 = 120^0$.

Mà $\widehat{NPb} = 120^0$ nên $\widehat{tNP} = \widehat{NPb}$, đây là hai góc so le trong (cát tuyến $NP$), suy ra $Nt \parallel Pb$.

Vậy $Ma \parallel Nt \parallel Pb$ nên $Ma \parallel Pb$ (hai đường thẳng cùng song song với một đường thẳng thứ ba thì song song với nhau).', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/0ccda913-69f0-421f-a10f-f7c016526de4.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0053', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 5),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '3a8ccb48-09d2-43f4-9eb1-74c0bba2d73c', 'Tính $\widehat{ABF}$', NULL, 'Kẻ tia $Ct$ đi qua $C$ song song với $AB$.

Vì $Ct \parallel AB$ nên $\widehat{BCt} = \widehat{ABC}$ (hai góc so le trong, cát tuyến $BC$).

Vì tia $CD$ nằm giữa hai tia $Ct$, $CB$ nên $\widehat{tCD} = \widehat{BCt} - \widehat{BCD} = \widehat{ABC} - \widehat{BCD}$.

Theo giả thiết $\widehat{ABC} + \widehat{CDE} = \widehat{BCD} + 180^0$ nên $\widehat{ABC} - \widehat{BCD} = 180^0 - \widehat{CDE}$, tức $\widehat{tCD} = 180^0 - \widehat{CDE}$, hay $\widehat{tCD} + \widehat{CDE} = 180^0$.

Hai góc $\widehat{tCD}$ và $\widehat{CDE}$ ở vị trí trong cùng phía (cát tuyến $CD$) nên $Ct \parallel DE$.

Do đó $AB \parallel Ct \parallel DE$, suy ra $AB \parallel DE$; mà $D$, $E$, $F$ thẳng hàng nên $AB \parallel FE$.

Vì $\widehat{BFE} = 90^0$ và $AB \parallel FE$ nên $BF \perp AB$ (đường thẳng vuông góc với một trong hai đường thẳng song song thì vuông góc với đường thẳng còn lại).

Vậy $\widehat{ABF} = 90^0$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/7855e8e8-946a-4f3b-8908-7884caabe631.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0054', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'bba5557a-151b-49c5-a3cd-76daa34c335e', 'a) Kể tên các cặp góc đối đỉnh.

b) Cho hình vẽ. Biết $Ox$ và $Ox''$, $Oy$ và $Oy''$ là các tia đối nhau. Tính góc $xOy$, góc $x''Oy$.', NULL, 'a) Vì $Ox$ và $Ox''$ là hai tia đối nhau, $Oy$ và $Oy''$ là hai tia đối nhau nên các cặp góc đối đỉnh trong hình là:
$\widehat{x''Oy}$ và $\widehat{xOy''}$ ;
$\widehat{x''Oy''}$ và $\widehat{xOy}$.

b) Vì $\widehat{x''Oy''} = 65^\circ$ và $\widehat{xOy}$ là hai góc đối đỉnh nên $\widehat{xOy} = 65^\circ$
$\widehat{x''Oy}$ kề bù với $\widehat{xOy}$ nên:
$\widehat{x''Oy} + \widehat{xOy} = 180^\circ$
$\widehat{x''Oy} = 180^\circ - 65^\circ = 115^\circ$
Vậy $\widehat{xOy} = 65^\circ$ , $\widehat{x''Oy} = 115^\circ$ .', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/1a07495e-f810-4c0a-b8df-5aca487d590c.svgxml', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0055', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '05dd85f3-e067-439b-989d-9ef9dc753567', 'a) Kể tên các cặp góc đối đỉnh.

b) Tìm các cặp góc kề bù, các cặp góc đối đỉnh trên hình vẽ', NULL, 'a) Vì $Ox$ và $Ox''$ là hai tia đối nhau, $Oy$ và $Oy''$ là hai tia đối nhau nên các cặp góc đối đỉnh trong hình là:
$\widehat{x''Oy}$ và $\widehat{xOy''}$ ;
$\widehat{x''Oy''}$ và $\widehat{xOy}$.

b) Vì Ox và Ox'' là hai tia đối nhau, Oy và Oy'' là hai tia đối nhau nên:
Các cặp góc kề bù là:
$\widehat{xOy}$ và $\widehat{yOx''}$ ;
$\widehat{xOy''}$ và $\widehat{y''Ox''}$ ;
$\widehat{xOa}$ và $\widehat{aOx''}$ ;
$\widehat{yOx}$ và $\widehat{xOy''}$ ;
$\widehat{yOx''}$ và $\widehat{x''Oy''}$ ;
$\widehat{yOa}$ và $\widehat{aOy''}$.
Các cặp góc đối đỉnh là:
$\widehat{xOy}$ và $\widehat{x''Oy''}$ ;
$\widehat{xOy''}$ và $\widehat{x''Oy}$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0056', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 8),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'd8c83585-9667-4e5b-bf8f-6c743b5aff66', 'a) Kể tên các cặp góc kề bù trong hình trên. 

b) Tìm các cặp góc kề bù trong hình ? 

c) Cho $\widehat{xOz}=60^\circ$, tính số đo góc $\widehat{yOz}$.

d) Tính số đo các góc $\widehat{tOz}$, góc $\widehat{xOt}$, góc $\widehat{yOz}$.', NULL, 'a) Hai góc $\widehat{xOy}$ và $\widehat{yOz}$ là hai góc kề bù.

b) Các cặp góc kề bù trong hình là:
$\widehat{xOz}$ và $\widehat{zOy}$;
$\widehat{xOt}$ và $\widehat{tOy}$.

c) Vì Ox và Oy là hai tia đối nhau nên $\widehat{xOz}$ và $\widehat{zOy}$ là hai góc kề bù.
Ta có:
$\widehat{xOz} + \widehat{zOy} = 180^\circ$
$60^\circ + \widehat{zOy} = 180^\circ$
$\widehat{zOy} = 180^\circ - 60^\circ = 120^\circ$
Vậy $\widehat{zOy} = 120^\circ$.

d) Vì Ox và Oy là hai tia đối nhau nên:
$\widehat{xOz} + \widehat{zOt} + \widehat{tOy} = 180^\circ$
Suy ra $\widehat{tOz} = 180^\circ - 30^\circ - 60^\circ = 90^\circ$
Ta có góc $\widehat{xOt}$ và $\widehat{tOy}$ là hai góc kề bù.
$\Rightarrow \widehat{xOt} = 180^\circ - \widehat{tOy} = 180^\circ - 60^\circ = 120^\circ$.
Ta có góc $\widehat{xOz}$ và $\widehat{yOz}$ là hai góc kề bù.
$\Rightarrow \widehat{yOz} = 180^\circ - \widehat{xOz} = 180^\circ - 30^\circ = 150^\circ$.
Vậy $\widehat{tOz} = 90^\circ$, $\widehat{xOt} = 120^\circ$, $\widehat{yOz} = 150^\circ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/3bc477ff-e64b-42e0-b4d4-e6d0d09ea178.svgxml', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0057', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'a) Chứng minh : $DA \parallel EF$

b) Tính $\widehat{ABC}$; $\widehat{AFE}$

c) Chứng minh $AB \perp AC$', NULL, 'c) Vì $DA \parallel BC$ nên $\widehat{DAC} + \widehat{BCA} = 180^\circ$ (hai góc trong cùng phía, đường thẳng $AC$ cắt hai đường thẳng song song).
Mà $\widehat{BCA} = 60^\circ$ nên $\widehat{DAC} = 180^\circ - 60^\circ = 120^\circ$.
Ta có $\widehat{BAC} = \widehat{DAC} - \widehat{DAB} = 120^\circ - 30^\circ = 90^\circ$.
Vậy $AB \perp AC$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/6f5a8472-9195-46b6-ae9e-c7413e880304.svgxml', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0058', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'a) Tính $\widehat{BAm}$

b) Chứng minh : $At \parallel Bz$', NULL, 'a) Vì $mn \parallel xy$ nên $\widehat{BAm} = \widehat{ABy}$ (hai góc so le trong).
Mà $\widehat{ABy} = 60^\circ$.
Vậy $\widehat{BAm} = 60^\circ$.

b) Theo câu trên, $\widehat{BAm} = 60^\circ$. Vì $A, m, n$ thẳng hàng nên $\widehat{nAB} = 180^\circ - \widehat{BAm} = 120^\circ$.
Vì $A, B, c$ thẳng hàng nên $\widehat{cBy} = 180^\circ - \widehat{ABy} = 180^\circ - 60^\circ = 120^\circ$.
$At$ là phân giác $\widehat{nAB}$ nên $\widehat{tAB} = 60^\circ$; $Bz$ là phân giác $\widehat{cBy}$ nên $\widehat{zBc} = 60^\circ$.
$\widehat{tAB}$ và $\widehat{zBc}$ là hai góc đồng vị (của $At, Bz$ qua cát tuyến $ABc$) và bằng nhau ($=60^\circ$), suy ra $At \parallel Bz$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/3ac1ec36-5331-4cc7-886b-97cbae6a5525.svgxml', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0059', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'a) Gọi tên góc đối đỉnh với $\widehat{xAa}$.

b) Chứng minh $ab \parallel cd$.


c)  Chứng minh $Cz \parallel xy$.', NULL, 'a) Góc đối đỉnh với $\widehat{xAa}$ là $\widehat{yAb}$

b) Ta có : $\widehat{xAa} + \widehat{aAB} = 180^\circ$ (2 góc kề bù)
mà $\widehat{aAB} = 135^\circ$
$\Rightarrow \widehat{xAa} + 135^\circ = 180^\circ$
$\Rightarrow \widehat{xAa} = 180^\circ - 135^\circ = 45^\circ$
Ta có: $\widehat{xAa} = \widehat{ABC} = 45^\circ$
mà 2 góc này ở vị trí đồng vị
$\Rightarrow ab \parallel cd$

c) Vì $cd \perp mn$
$\Rightarrow \widehat{nCd} = 90^\circ$
Ta có: Cz là tia phân giác của $\widehat{nCd}$
$\Rightarrow \widehat{BCz} = \widehat{nCz} = \frac{\widehat{nCd}}{2} = \frac{90^\circ}{2} = 45^\circ$
Ta có: $\widehat{BCz} = \widehat{Cbx} = 45^\circ$
mà 2 góc này ở vị trí so le trong
$\Rightarrow Cz // xy$', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0060', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'a) Chứng minh : $a // b$

b) Tính $\widehat{GHE} ; \widehat{EHI}$

c) Chứng minh : $Hx \parallel Ey$', NULL, 'a) Ta có đường thẳng đứng qua $G$ và $K$ vuông góc với cả $a$ và $b$ (theo hình vẽ).
Theo tính chất hai đường thẳng cùng vuông góc với một đường thẳng thứ ba thì song song với nhau, suy ra $a \parallel b$.

b) Vì $a \parallel b$ (theo câu trên) nên $\widehat{GHE} = \widehat{HEF}$ (hai góc so le trong) $= 120^\circ$.
Vì $G, H, I$ thẳng hàng nên $\widehat{GHE}$ và $\widehat{EHI}$ kề bù, suy ra $\widehat{EHI} = 180^\circ - 120^\circ = 60^\circ$.

c) Theo câu trên, $\widehat{GHE} = 120^\circ$ và $\widehat{HEF} = 120^\circ$.
$Hx$ là phân giác $\widehat{GHE}$ nên $\widehat{xHE} = 60^\circ$; $Ey$ là phân giác $\widehat{HEF}$ nên $\widehat{HEy} = 60^\circ$.
$\widehat{xHE}$ và $\widehat{HEy}$ là hai góc so le trong (của $Hx, Ey$ qua cát tuyến $HE$) và bằng nhau ($=60^\circ$), suy ra $Hx \parallel Ey$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/272ffa61-a782-4b72-bf53-ceda8735f1a4.svgxml', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0061', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'a) Chứng minh $a \parallel b$

b) Tính $\widehat{D_1};\widehat{D_2}$

c) Chứng minh : $b \parallel c$ và $c \perp d$

d) Tính $\widehat{DIE}$', NULL, 'a) Ta có $a \perp d$ và $b \perp d$.
Theo tính chất "hai đường thẳng phân biệt cùng vuông góc với một đường thẳng thứ ba thì song song với nhau", suy ra $a \parallel b$.

b) Ta có $d \perp a$ và $d \perp b$ (hình vẽ) nên $a \parallel b$.
Vì $a \parallel b$ nên $\widehat{D_2} = \widehat{C} = 70^\circ$ (hai góc đồng vị).
$\widehat{D_1}$ và $\widehat{D_2}$ kề bù (cùng nằm trên đường thẳng $b$) nên $\widehat{D_1} = 180^\circ - 70^\circ = 110^\circ$.

c) Ta có $d \perp a$ và $d \perp b$ (hình vẽ) nên $a \parallel b$.
Vì $a \parallel b$ nên $\widehat{D_2} = \widehat{C} = 70^\circ$ (hai góc đồng vị), suy ra $\widehat{D_1} = 180^\circ - 70^\circ = 110^\circ$ (kề bù trên đường thẳng $b$).
Mà $\widehat{D_1}$ và góc $110^\circ$ tại $E$ là hai góc đồng vị (cùng vị trí, cắt bởi đường xiên) và bằng nhau.
Suy ra $b \parallel c$.
Vì $b \parallel c$ và $d \perp b$, suy ra $d \perp c$ (đường thẳng vuông góc với 1 trong 2 đường thẳng song song thì vuông góc với đường còn lại).

d) Theo câu trên, $b \parallel c$.
Vì $b \parallel c$ nên $\widehat{BDE}$ và $\widehat{DEF}$ là hai góc trong cùng phía, suy ra $\widehat{BDE} + \widehat{DEF} = 180^\circ$.
$DI$ là phân giác $\widehat{BDE}$ nên $\widehat{IDE} = \dfrac{\widehat{BDE}}{2}$; $EI$ là phân giác $\widehat{DEF}$ nên $\widehat{IED} = \dfrac{\widehat{DEF}}{2}$.
Xét tam giác $DIE$: $\widehat{DIE} = 180^\circ - \widehat{IDE} - \widehat{IED} = 180^\circ - \dfrac{\widehat{BDE} + \widehat{DEF}}{2} = 180^\circ - 90^\circ = 90^\circ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/fcaa2bb0-e3f9-49fa-a13a-e01b421ff0c4.svgxml', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0062', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 8),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'd8c83585-9667-4e5b-bf8f-6c743b5aff66', 'Cho hình vẽ. Biết Om và On là hai tia đối nhau. Kể tên các cặp góc kề bù có trong hình.', NULL, 'Các cặp góc kề bù trong hình là:
$\widehat{mOp}$ và $\widehat{pOn}$;
$\widehat{mOq}$ và $\widehat{qOn}$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/acfe4710-df3c-4962-83c5-545f8f7eae20.svgxml', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0063', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 8),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'd8c83585-9667-4e5b-bf8f-6c743b5aff66', 'Cho hình vẽ. Biết $Ox$ và $Oz$ là hai tia đối nhau. Kể tên các cặp góc kề bù có trong hình.', NULL, 'Các cặp góc kề bù trong hình là:
$\widehat{xOy}$ và $\widehat{yOz}$;
$\widehat{xOt}$ và $\widehat{tOz}$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/bdea32b4-555b-440d-81df-fca24e889e80.svgxml', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0064', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'bba5557a-151b-49c5-a3cd-76daa34c335e', 'Cho hình vẽ. Biết $Oz$ và $Oz''$, $Ot$ và $Ot''$ là các tia đối nhau. Kể tên các cặp góc đối đỉnh.', NULL, 'Vì Oz và Oz'' là hai tia đối nhau, Ot và Ot'' là hai tia đối nhau nên các cặp góc đối đỉnh là:
$\widehat{zOt}$ và $\widehat{z''Ot''}$ ;
$\widehat{zOt''}$ và $\widehat{z''Ot}$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/2499a3b6-5c5b-4579-a3f2-29c9727708b7.svgxml', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0091', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'bba5557a-151b-49c5-a3cd-76daa34c335e', 'Cho hình vẽ. Biết $Oa$ và $Oa''$, $Ob$ và $Ob''$ là các tia đối nhau. Kể tên các cặp góc đối đỉnh.', NULL, 'Vì $Oa$ và $Oa''$ là hai tia đối nhau, $Ob$ và $Ob''$ là hai tia đối nhau nên các cặp góc đối đỉnh là:
$\widehat{aOb}$ và $\widehat{a''Ob''}$;
$\widehat{aOb''}$ và $\widehat{a''Ob}$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/b7d4809f-eb30-4e90-a904-e2994279c6f6.svgxml', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0092', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e54cef1a-52ab-47ab-b206-c689491ed91b', 'Cho hình vẽ. Biết Oa và Ob là hai tia đối nhau. Kể tên các cặp góc kề bù.', NULL, 'Các cặp góc kề bù: $\widehat{aOc}$ và $\widehat{bOc}$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/38148821-d9a7-454b-83e2-14676a5d07fb.svgxml', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0093', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e54cef1a-52ab-47ab-b206-c689491ed91b', 'Cho hình vẽ. Biết Om và On là hai tia đối nhau. Kể tên các cặp góc kề bù.', NULL, 'Các cặp góc kề bù: $\widehat{mOp}$ và $\widehat{nOp}$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/effdc634-4007-4319-829c-75384283bc83.svgxml', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0094', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e54cef1a-52ab-47ab-b206-c689491ed91b', 'Cho hình vẽ. Biết $Ox$ và $Oy$ là hai tia đối nhau. Tính số đo góc $yOz$.', NULL, 'Vì $\widehat{xOz}$ và $\widehat{yOz}$ là hai góc kề bù nên $\widehat{xOz} + \widehat{yOz} = 180^\circ$.
$\Rightarrow \widehat{yOz} = 180^\circ - \widehat{xOz} = 180^\circ - 115^\circ = 65^\circ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/76b93fee-7f46-4c11-80bb-4dbf79c06c40.svgxml', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0095', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e54cef1a-52ab-47ab-b206-c689491ed91b', 'Cho hình vẽ. Biết Ox và Oy là hai tia đối nhau. Tính số đo góc $\angle yOz$.', NULL, 'Vì $\widehat{xOz}$ và $\widehat{yOz}$ là hai góc kề bù nên $\widehat{xOz} + \widehat{yOz} = 180^\circ$.
$\Rightarrow \widehat{yOz} = 180^\circ - \widehat{xOz} = 180^\circ - 90^\circ = 90^\circ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/d2d88cf5-d82f-40aa-b0fa-12670608060b.svgxml', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0096', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'e54cef1a-52ab-47ab-b206-c689491ed91b', 'Cho hình vẽ. Biết Om và On là hai tia đối nhau. Tính số đo góc $\widehat{nOp}$.', NULL, 'Vì $\widehat{mOp}$ và $\widehat{nOp}$ là hai góc kề bù nên $\widehat{mOp} + \widehat{nOp} = 180^\circ$.
$\Rightarrow \widehat{nOp} = 180^\circ - \widehat{mOp} = 180^\circ - 56^\circ = 124^\circ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/25a54b64-c632-4d4e-a679-56fa69a176d3.svgxml', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0097', ma_cau from ins;

with bai as (select ma_bai from _hh_bai_ma where thu_tu = 3),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0016'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'b01b66a0-d665-46e2-8fa6-91868613cb70', 'Cho hình vẽ. Biết $\widehat{xOy} = 110^\circ$ và Oz là phân giác của góc $xOy$. Tính các góc $xOz$ và $zOy$.', NULL, 'Vì Oz là tia phân giác của góc xOy nên:
$\widehat{xOz} = \widehat{zOy} = \dfrac{1}{2} \widehat{xOy}$
Mà $\widehat{xOy} = 110^\circ$.
Do đó:
$\widehat{xOz} = \widehat{zOy} = \dfrac{1}{2} \cdot 110^\circ = 55^\circ$
Vậy $\widehat{xOz} = 55^\circ$ và $\widehat{zOy} = 55^\circ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/ba907482-a9fc-4a49-9068-ac1da8b3b10f.svgxml', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0065', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 3),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0016'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'b01b66a0-d665-46e2-8fa6-91868613cb70', 'Cho hình vẽ. Biết $\widehat{xOy} = 80^\circ$ và Oz là phân giác của góc $xOy$. Tính các góc $xOz$ và $zOy$.', NULL, 'Vì Oz là tia phân giác của góc xOy nên:
$\widehat{xOz} = \widehat{zOy} = \dfrac{1}{2}\widehat{xOy}$
Mà $\widehat{xOy} = 80^\circ$.
Do đó:
$\widehat{xOz} = \widehat{zOy} = \dfrac{1}{2}\cdot 80^\circ = 40^\circ$
Vậy $\widehat{xOz} = 40^\circ$ và $\widehat{zOy} = 40^\circ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/822df7ff-33ef-4ae7-bb1e-8daa93633700.svgxml', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0066', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 3),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0016'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'b01b66a0-d665-46e2-8fa6-91868613cb70', 'Cho hình vẽ. Biết $\widehat{xOy} = 66^\circ$ và Oz là phân giác của góc xOy. Tính các góc xOz và zOy.', NULL, 'Vì Oz là tia phân giác của góc xOy nên:
$\widehat{xOz} = \widehat{zOy} = \dfrac{1}{2}\widehat{xOy}$
Mà $\widehat{xOy} = 66^\circ$.
Do đó:
$\widehat{xOz} = \widehat{zOy} = \dfrac{1}{2}\cdot 66^\circ = 33^\circ$
Vậy $\widehat{xOz} = 33^\circ$ và $\widehat{zOy} = 33^\circ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/bb981163-8ac5-4dff-a407-d433bb93964f.svgxml', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0067', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 3),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0016'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'b01b66a0-d665-46e2-8fa6-91868613cb70', 'Cho hình vẽ. Biết $Oz$ là phân giác của góc $xOy$. Tính các góc $xOz$ và $zOy$.', NULL, 'Vì hình vẽ cho thấy góc $xOy$ là góc vuông nên:
$\widehat{xOy}=90^\circ$
Vì $Oz$ là tia phân giác của góc $xOy$ nên:
$\widehat{xOz}=\widehat{zOy}=\dfrac{1}{2}\widehat{xOy}$
Do đó:
$\widehat{xOz}=\widehat{zOy}=\dfrac{1}{2}\cdot 90^\circ=45^\circ$
Vậy $\widehat{xOz}=45^\circ$ và $\widehat{zOy}=45^\circ$ .', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/645213dc-e9b4-495e-9637-1dc970788216.svgxml', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0068', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 8),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0057'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'd8c83585-9667-4e5b-bf8f-6c743b5aff66', 'Cho hình vẽ. Biết $Ox$ và $Oy$ là hai tia đối nhau. Tính số đo các góc $\widehat{tOz}$, góc $\widehat{xOt}$, góc $\widehat{yOz}$.', NULL, 'Vì $Ox$ và $Oy$ là hai tia đối nhau nên:
$\widehat{xOz} + \widehat{zOt} + \widehat{tOy} = 180^\circ$
$\Rightarrow \widehat{tOz} = 180^\circ - 69^\circ - 45^\circ = 66^\circ$.
Vì $\widehat{xOt}$ và $\widehat{tOy}$ là hai góc kề bù $\Rightarrow \widehat{xOt} = 180^\circ - \widehat{tOy} = 180^\circ - 45^\circ = 135^\circ$.
Vì $\widehat{xOz}$ và $\widehat{zOy}$ là hai góc kề bù $\Rightarrow \widehat{yOz} = 180^\circ - \widehat{xOz} = 180^\circ - 69^\circ = 111^\circ$.
Vậy $\widehat{tOz} = 66^\circ$, $\widehat{xOt} = 135^\circ$, $\widehat{yOz} = 111^\circ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/d2008975-c6f1-48a1-b019-99693a32a2d1.svgxml', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0069', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 8),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0057'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'd8c83585-9667-4e5b-bf8f-6c743b5aff66', 'Cho hình vẽ. Biết Ox và Oy là hai tia đối nhau. Tính số đo các góc $\widehat{tOz}$, góc $\widehat{xOt}$, góc $\widehat{yOz}$.', NULL, 'Vì Ox và Oy là hai tia đối nhau nên:
$\widehat{xOz} + \widehat{zOt} + \widehat{tOy} = 180^\circ$
Mà $\widehat{xOz} = 90^\circ$, $\widehat{tOy} = 36^\circ$
$\Rightarrow \widehat{tOz} = 180^\circ - 90^\circ - 36^\circ = 54^\circ$.
Vì $\widehat{xOt}$ và $\widehat{tOy}$ là hai góc kề bù $\Rightarrow \widehat{xOt} = 180^\circ - \widehat{tOy} = 180^\circ - 36^\circ = 144^\circ$.
Vì $\widehat{xOz}$ và $\widehat{zOy}$ là hai góc kề bù $\Rightarrow \widehat{yOz} = 180^\circ - \widehat{xOz} = 180^\circ - 90^\circ = 90^\circ$.
Vậy $\widehat{tOz} = 54^\circ$, $\widehat{xOt} = 144^\circ$, $\widehat{yOz} = 90^\circ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/cca0a746-e39e-4bc9-ba69-7bcc6f2a8f9c.svgxml', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0070', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 8),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0057'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'd8c83585-9667-4e5b-bf8f-6c743b5aff66', 'Cho hình vẽ. Biết $Ox$ và $Oy$ là hai tia đối nhau. Tính số đo các góc $\widehat{tOz}$, góc $\widehat{xOt}$, góc $\widehat{yOz}$.', NULL, 'Vì $Ox$ và $Oy$ là hai tia đối nhau nên:
$\widehat{xOz} + \widehat{zOt} + \widehat{tOy} = 180^\circ$
$\Rightarrow \widehat{tOz} = 180^\circ - 66^\circ - 36^\circ = 78^\circ$.
Vì $\widehat{xOt}$ và $\widehat{tOy}$ là hai góc kề bù $\Rightarrow \widehat{xOt} = 180^\circ - \widehat{tOy} = 180^\circ - 36^\circ = 144^\circ$.
Vì $\widehat{xOz}$ và $\widehat{zOy}$ là hai góc kề bù $\Rightarrow \widehat{yOz} = 180^\circ - \widehat{xOz} = 180^\circ - 66^\circ = 114^\circ$.
Vậy $\widehat{tOz} = 78^\circ$, $\widehat{xOt} = 144^\circ$, $\widehat{yOz} = 114^\circ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/330893ba-ef9b-4311-9e8c-3b4fcdb52d4e.svgxml', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0071', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 8),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0057'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'd8c83585-9667-4e5b-bf8f-6c743b5aff66', 'Cho hình vẽ. Biết Ox và Oy là hai tia đối nhau. Tính số đo các góc $\widehat{tOz}$, góc $\widehat{xOt}$, góc $\widehat{yOz}$.', NULL, 'Vì Ox và Oy là hai tia đối nhau nên:
$\widehat{xOz} + \widehat{zOt} + \widehat{tOy} = 180^\circ$
$\Rightarrow \widehat{tOz} = 180^\circ - 75^\circ - 61^\circ = 44^\circ$.
Vì $\widehat{xOt}$ và $\widehat{tOy}$ là hai góc kề bù nên:
$\widehat{xOt} = 180^\circ - \widehat{tOy} = 180^\circ - 61^\circ = 119^\circ$.
Vì $\widehat{xOz}$ và $\widehat{zOy}$ là hai góc kề bù nên:
$\widehat{yOz} = 180^\circ - \widehat{xOz} = 180^\circ - 75^\circ = 105^\circ$.
Vậy $\widehat{tOz} = 44^\circ$, $\widehat{xOt} = 119^\circ$, $\widehat{yOz} = 105^\circ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/acd117b7-5b12-429f-968b-b9a36454e75b.svgxml', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0072', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 8),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0057'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'd8c83585-9667-4e5b-bf8f-6c743b5aff66', 'Cho hình vẽ. Biết $Ox$ và $Oy$ là hai tia đối nhau. Tính số đo các góc $\widehat{tOz}$, góc $\widehat{xOt}$, góc $\widehat{yOz}$ .', NULL, 'Vì $Ox$ và $Oy$ là hai tia đối nhau nên:
$\widehat{xOz} + \widehat{zOt} + \widehat{tOy} = 180^\circ$
$\Rightarrow \widehat{tOz} = 180^\circ - 60^\circ - 45^\circ = 75^\circ$.
Vì $\widehat{xOt}$ và $\widehat{tOy}$ là hai góc kề bù nên:
$\widehat{xOt} = 180^\circ - \widehat{tOy} = 180^\circ - 45^\circ = 135^\circ$.
Vì $\widehat{xOz}$ và $\widehat{zOy}$ là hai góc kề bù nên:
$\widehat{yOz} = 180^\circ - \widehat{xOz} = 180^\circ - 60^\circ = 120^\circ$.
Vậy $\widehat{tOz} = 75^\circ$, $\widehat{xOt} = 135^\circ$, $\widehat{yOz} = 120^\circ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/9a3a8983-369a-4e02-a11e-025c2f80aa7a.svgxml', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0073', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 8),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0057'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'd8c83585-9667-4e5b-bf8f-6c743b5aff66', 'Cho hình vẽ. Biết $Ox$ và $Oy$ là hai tia đối nhau. Tính số đo các góc $\widehat{tOz}$, góc $\widehat{xOt}$, góc $\widehat{yOz}$.', NULL, 'Vì $Ox$ và $Oy$ là hai tia đối nhau nên:
$\widehat{xOz} + \widehat{zOt} + \widehat{tOy} = 180^\circ$
$\Rightarrow \widehat{tOz} = 180^\circ - 78^\circ - 30^\circ = 72^\circ$.
Vì $\widehat{xOt}$ và $\widehat{tOy}$ là hai góc kề bù nên:
$\widehat{xOt} = 180^\circ - \widehat{tOy} = 180^\circ - 30^\circ = 150^\circ$.
Vì $\widehat{xOz}$ và $\widehat{zOy}$ là hai góc kề bù nên:
$\widehat{yOz} = 180^\circ - \widehat{xOz} = 180^\circ - 78^\circ = 102^\circ$.
Vậy $\widehat{tOz} = 72^\circ$, $\widehat{xOt} = 150^\circ$, $\widehat{yOz} = 102^\circ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/8b744d75-1b9c-4a8e-9768-353d984a7ff3.svgxml', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0074', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0019'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'Cho hình vẽ .
a. Chứng minh $xx'' \parallel yy''$
b. Tính $CDy''; CDy$', NULL, 'Giải :
a. Từ hình vẽ ta thấy : $\angle xAB = \angle ABD = 72^\circ$
Mà $\angle xAB$ và $\angle ABD$ là 2 góc ở vị trí so le trong
Suy ra $xx'' \parallel yy''$
b. Vì $xx'' \parallel yy''$
nên $\angle tCx'' = \angle CDy''$ (hai góc đồng vị)
Mà $\angle tCx'' = 118^\circ$ suy ra $\angle CDy'' = 118^\circ$
Ta có $\angle CDy'' + \angle CDy = 180^\circ$ (hai góc kề bù)
Suy ra $\angle CDy = 180^\circ - \angle CDy'' = 180^\circ - 118^\circ = 62^\circ$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/1b1a4b22-a849-48fe-a4e5-7b6d9349484a.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0075', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0019'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'Cho hình vẽ .
a. Chứng minh $aa'' \parallel bb''$
b. Tính $PQb''; PQb$', NULL, 'Giải :
a. Từ hình vẽ ta thấy : $\angle aMN = \angle MNQ = 65^\circ$
Mà $\angle aMN$ và $\angle MNQ$ là 2 góc ở vị trí so le trong
Suy ra $aa'' \parallel bb''$
b. Vì $aa'' \parallel bb''$
nên $\angle dPa'' = \angle PQb''$ (hai góc đồng vị)
Mà $\angle dPa'' = 124^\circ$ suy ra $\angle PQb'' = 124^\circ$
Ta có $\angle PQb'' + \angle PQb = 180^\circ$ (hai góc kề bù)
Suy ra $\angle PQb = 180^\circ - \angle PQb'' = 180^\circ - 124^\circ = 56^\circ$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/af052074-9871-4240-8747-9a6c266daf67.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0076', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0019'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'Cho hình vẽ .
a. Chứng minh $mm'' \parallel nn''$
b. Tính $GHn''$; $GHn$', NULL, 'Giải :
a. Từ hình vẽ ta thấy : $mEF = EFH = 78^\circ$
Mà $mEF$ và $EFH$ là 2 góc ở vị trí so le trong
Suy ra $mm'' \parallel nn''$
b. Vì $mm'' \parallel nn''$
nên $yGm'' = GHn''$ (hai góc đồng vị)
Mà $yGm'' = 112^\circ$ suy ra $GHn'' = 112^\circ$
Ta có $GHn'' + GHn = 180^\circ$ (hai góc kề bù)
Suy ra $GHn = 180^\circ - GHn'' = 180^\circ - 112^\circ = 68^\circ$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/4664436f-c00b-4a59-8763-6a0e5f818c0d.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0077', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0019'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'Cho hình vẽ .
a. Chứng minh $xx'' \parallel yy''$
b. Tính $RSy''$; $RSy$', NULL, 'a) Ta có: $\widehat{xPQ}=60^\circ$
Mà $\widehat{PQS}=60^\circ$
Suy ra $\widehat{xPQ}=\widehat{PQS}$
Mà $\widehat{xPQ}$ và $\widehat{PQS}$ là 2 góc so le trong
Suy ra $xx'' \parallel yy''$.
b) Ta có: $xx'' \parallel yy''$
Suy ra $\widehat{RSy''}=\widehat{bRx''}$ (2 góc đồng vị)
Mà $\widehat{bRx''}=130^\circ$
Suy ra $\widehat{RSy''}=130^\circ$
Ta có: $\widehat{RSy}+\widehat{RSy''}=180^\circ$ (2 góc kề bù)
Mà $\widehat{RSy''}=130^\circ$
Nên $\widehat{RSy}+130^\circ=180^\circ$
$\widehat{RSy}=180^\circ-130^\circ=50^\circ$
Vậy $\widehat{RSy''}=130^\circ$; $\widehat{RSy}=50^\circ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/e7746bc7-1435-414b-949f-2b64683f4fe7.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0078', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0019'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'Cho hình vẽ .
a. Chứng minh $mm'' \parallel nn''$
b. Tính $PQn''$; $PQn$', NULL, 'Giải :
a. Từ hình vẽ ta thấy : $\angle mUV = \angle UVQ = 68^\circ$
Mà $\angle mUV$ và $\angle UVQ$ là 2 góc ở vị trí so le trong
Suy ra $mm'' \parallel nn''$
b. Vì $mm'' \parallel nn''$
nên $\angle tPm'' = \angle PQn''$ (hai góc đồng vị)
Mà $\angle tPm'' = 121^\circ$ suy ra $\angle PQn'' = 121^\circ$
Ta có $\angle PQn'' + \angle PQn = 180^\circ$ (hai góc kề bù)
Suy ra $\angle PQn = 180^\circ - \angle PQn'' = 180^\circ - 121^\circ = 59^\circ$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/d226c4fa-dfc8-4f92-95c7-5d037adc1409.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0079', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0017'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'Cho hình vẽ. Chứng minh rằng $mm'' \parallel nn''$', NULL, 'Giải:
Ta có : $\widehat{ABn''} + \widehat{ABn} = 180^\circ$ (hai góc kề bù)
Mà $\widehat{ABn} = 115^\circ$ nên $\widehat{ABn''} = 180^\circ - \widehat{ABn} = 180^\circ - 115^\circ = 65^\circ$
Lại có $\widehat{dAm''} = 65^\circ$ nên $\widehat{ABn''} = \widehat{dAm''}$ 
Mà $\widehat{ABn''}$ và $\widehat{dAm''}$ là 2 góc ở vị trí đồng vị
Suy ra $mm'' \parallel nn''$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/fc16db17-1f7b-43b3-ad39-5703e21cd589.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0080', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0017'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'Cho hình vẽ. Chứng minh rằng $xx'' \parallel yy''$', NULL, 'Ta có : $\widehat{MNy''} + \widehat{MNy} = 180^\circ$ (hai góc kề bù)
Mà $\widehat{MNy} = 105^\circ$ nên $\widehat{MNy''} = 180^\circ - \widehat{MNy} = 180^\circ - 105^\circ = 75^\circ$
Lại có $\widehat{tMx''} = 75^\circ$ nên $\widehat{MNy''} = \widehat{tMx''}$
Mà $\widehat{MNy''}$ và $\widehat{tMx''}$ là 2 góc ở vị trí đồng vị
Suy ra $xx'' \parallel yy''$}````', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/cf74db22-82ce-45b8-834b-17597c3ccfcf.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0081', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0017'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'Cho hình vẽ. Chứng minh rằng $pp'' \parallel qq''$', NULL, 'Ta có : $\widehat{CDq''} + \widehat{CDq} = 180^\circ$ (hai góc kề bù)
Mà $\widehat{CDq} = 125^\circ$ nên $\widehat{CDq''} = 180^\circ - \widehat{CDq} = 180^\circ - 125^\circ = 55^\circ$
Lại có $\widehat{rCp''} = 55^\circ$ nên $\widehat{CDq''} = \widehat{rCp''}$
Mà $\widehat{CDq''}$ và $\widehat{rCp''}$ là 2 góc ở vị trí đồng vị
Suy ra $pp'' \parallel qq''$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/ba30dc15-1a59-4311-8347-3c6dfecf8302.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0082', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0017'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'Cho hình vẽ. Chứng minh rằng $uu'' \parallel vv''$', NULL, 'Giải:
Ta có : $\widehat{EFv''} + \widehat{EFv} = 180^\circ$ (hai góc kề bù)
Mà $\widehat{EFv} = 100^\circ$ nên $\widehat{EFv''} = 180^\circ - \widehat{EFv} = 180^\circ - 100^\circ = 80^\circ$
Lại có $\widehat{sEu''} = 80^\circ$ nên $\widehat{EFv''} = \widehat{sEu''}$ 
Mà $\widehat{EFv''}$ và $\widehat{sEu''}$ là 2 góc ở vị trí đồng vị
Suy ra $uu'' \parallel vv''$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/91c9c3f8-de18-4fd0-ba54-dfc09621e6db.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0083', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0017'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'Cho hình vẽ.. Chứng minh Chứng minh rằng $xx'' //yy''$', NULL, 'Ta có $\widehat{xMN} + \widehat{x''MN} = 180^0$ (hai góc kề bù)
Mà $\widehat{xMN} = 55^0$ suy ra $\widehat{x''MN} = 180^0 - \widehat{xMN} = 180^0 - 55^0 = 125^0$
Lại có $\widehat{MNy} = 125^0$ nên $\widehat{x''MN} = \widehat{MNy}$
Mà $\widehat{x''MN} ; \widehat{MNy}$ là 2 góc ở vị trí so le trong
Suy ra $xx'' // yy''$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/d2cae7ec-7dd0-48dd-9aca-0d2aa92ae00a.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0084', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 7),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0011'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'ac7bab89-24e4-4558-9b9b-3e1531683c8d', 'Cho $\triangle ABC$ vuông tại $A$, tia phân giác của góc $B$ cắt $AC$ tại $D$. Kẻ $DE \perp BC$ ($E \in BC$). Chứng minh $\triangle ABD = \triangle EBD$.', NULL, 'Vì $BD$ là tia phân giác của góc $\widehat{B} \Rightarrow \widehat{ABD} = \widehat{EBD}$.
$\triangle ABC$ vuông tại $A \Rightarrow \widehat{BAD} = 90^\circ$.
$DE \perp BC \Rightarrow \widehat{BED} = 90^\circ$.
Xét $\triangle ABD$ và $\triangle EBD$ có:
$\widehat{ABD} = \widehat{EBD}$ (cmt)
$BD$ chung
$\widehat{BAD} = \widehat{BED} = 90^\circ$
$\Rightarrow \triangle ABD = \triangle EBD$ (ch – gn)', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/26b9bfa4-0228-4b00-9a8e-30f76a91c3f8.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0085', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0002'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'Cho hình vẽ
a. Chứng minh $Mx \parallel Ny$
b. Tính $\angle PQN$; $\angle PQy$', NULL, 'Giải :
a. Từ hình vẽ ta có : $\angle zMx = \angle zNy = 70^\circ$
Mà $\angle zMx$ và $\angle zNy$ là 2 góc ở vị trí đồng vị
Suy ra $Mx \parallel Ny$
b. Vì $Mx \parallel Ny$
nên $\angle xPQ = \angle PQN$ (hai góc so le trong)
Mà $\angle xPQ = 65^\circ$ suy ra $\angle PQN = 65^\circ$
Mà $\angle PQN + \angle PQy = 180^\circ$ (hai góc kề bù)
Suy ra $\angle PQy = 180^\circ - \angle PQN = 180^\circ - 65^\circ = 115^\circ$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/b881b239-4502-4fdd-aa4e-1a519eb0be25.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0086', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0002'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'Cho hình vẽ
a. Chứng minh $Pa \parallel Qb$
b. Tính $\angle RSQ$; $\angle RSb$', NULL, 'Giải :
a. Từ hình vẽ ta có : $\angle cPa = \angle cQb = 60^\circ$
Mà $\angle cPa$ và $\angle cQb$ là 2 góc ở vị trí đồng vị
Suy ra $Pa \parallel Qb$
b. Vì $Pa \parallel Qb$
nên $\angle aRS = \angle RSQ$ (hai góc so le trong)
Mà $\angle aRS = 70^\circ$ suy ra $\angle RSQ = 70^\circ$
Mà $\angle RSQ + \angle RSb = 180^\circ$ (hai góc kề bù)
Suy ra $\angle RSb = 180^\circ - \widehat{RSQ} = 180^\circ - 70^\circ = 110^\circ$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/c0e8a0bc-fd62-4acd-a621-bd34f6ae56ca.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0087', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0002'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'Cho hình vẽ
a. Chứng minh $Am \parallel Bn$
b. Tính $CDB$; $CDn$', NULL, 'Giải :
a. Từ hình vẽ ta có : $\widehat{xAm} = \widehat{xBn} = 68^\circ$
Mà $\widehat{xAm}$ và $\widehat{xBn}$ là 2 góc ở vị trí đồng vị
Suy ra $Am \parallel Bn$
b. Vì $Am \parallel Bn$
nên $\widehat{mCD} = \widehat{CDB}$ (hai góc so le trong)
Mà $\widehat{mCD} = 62^\circ$ suy ra $\widehat{CDB} = 62^\circ$
Mà $\widehat{CDB} + \widehat{CDn} = 180^\circ$ (hai góc kề bù)
Suy ra $\widehat{CDn} = 180^\circ - \widehat{CDB} = 180^\circ - 62^\circ = 118^\circ$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/1f318836-676e-4628-b70d-7f3fb000fdf8.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0088', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0002'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'Cho hình vẽ
a. Chứng minh $Ea \parallel Fb$
b. Tính $\angle GHF$; $\angle GHb$', NULL, 'Giải :
a. Từ hình vẽ ta có : $\angle mEa = \angle mFb = 72^\circ$
Mà $\angle mEa$ và $\angle mFb$ là 2 góc ở vị trí đồng vị
Suy ra $Ea \parallel Fb$
b. Vì $Ea \parallel Fb$
nên $\angle aGH = \angle GHF$ (hai góc so le trong)
Mà $\angle aGH = 58^\circ$ suy ra $\angle GHF = 58^\circ$
Mà $\angle GHF + \angle GHb = 180^\circ$ (hai góc kề bù)
Suy ra $\angle GHb = 180^\circ - \widehat{GHF} = 180^\circ-58^\circ = 122^\circ$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/43f3f0da-98dd-47b5-8d9c-9f2f506d9626.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0089', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0002'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'Cho hình vẽ
a. Chứng minh $Kc \parallel Ld$
b. Tính $\angle MNL$; $\angle MNd$', NULL, 'Giải :
a. Từ hình vẽ ta có : $\angle zKc = \angle zLd = 66^\circ$
Mà $\angle zKc$ và $\angle zLd$ là 2 góc ở vị trí đồng vị
Suy ra $Kc \parallel Ld$
b. Vì $Kc \parallel Ld$
nên $\angle cMN = \angle MNL$ (hai góc so le trong)
Mà $\angle cMN = 52^\circ$ suy ra $\angle MNL = 52^\circ$
Mà $\angle MNL + \angle MNd = 180^\circ$ (hai góc kề bù)
Suy ra $\angle MNd = 180^\circ - \widehat{MNL} = 180^\circ - 52^\circ = 128^\circ$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/9272e1c1-a3dd-4e79-ba42-a4911b6e9d65.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0090', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 9),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0056'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '05dd85f3-e067-439b-989d-9ef9dc753567', 'Tìm các cặp góc kề bù, các cặp góc đối đỉnh trên hình vẽ:', NULL, 'Vì $Oz$ và $Oz''$ là hai tia đối nhau, $Ot$ và $Ot''$ là hai tia đối nhau nên:
Các cặp góc kề bù trong hình là:
$\widehat{zOt}$ và $\widehat{tOz''}$;
$\widehat{zOt''}$ và $\widehat{t''Oz''}$;
$\widehat{zOa}$ và $\widehat{aOz''}$;
$\widehat{tOz}$ và $\widehat{zOt''}$;
$\widehat{tOz''}$ và $\widehat{z''Ot''}$;
$\widehat{tOa}$ và $\widehat{aOt''}$.
Các cặp góc đối đỉnh trong hình là:
$\widehat{zOt}$ và $\widehat{z''Ot''}$;
$\widehat{zOt''}$ và $\widehat{z''Ot}$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/13773048-b739-4958-a308-85c1c51da419.svgxml', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0098', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0001'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'Cho hình vẽ. biết $mm'' \parallel nn''$ và $\widehat{mCD} = 65^\circ$. Tính các góc $\widehat{nDp''}$ và $\widehat{CDn}$.', NULL, 'Giải :
Ta có $mm'' \parallel nn''$
Suy ra $\widehat{mCD} = \widehat{CDn''}$ (hai góc so le trong)
Mà $\widehat{mCD} = 65^\circ$ nên $\widehat{CDn''} = 65^\circ$
Lại có : $\widehat{CDn} + \widehat{CDn''} = 180^\circ$ (hai góc kề bù)
Suy ra $\widehat{CDn} = 180^\circ - \widehat{CDn''} = 180^\circ - 65^\circ = 115^\circ$
Mà $\widehat{CDn''} = \widehat{nDp''}$ (hai góc đối đỉnh)
Suy ra $\widehat{nDp''} = 65^\circ$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/233712e5-e71d-41c4-b698-6cebf4d9c7dc.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0099', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0001'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'Cho hình vẽ, biết $aa'' \parallel bb''$ và $\widehat{aEF} = 50^\circ$. Tính các góc $\widehat{bFx''}$ và $\widehat{EFb}$.', NULL, 'Giải :
Ta có $aa'' \parallel bb''$
Suy ra $\widehat{aEF} = \widehat{EFb''}$ (hai góc so le trong)
Mà $\widehat{aEF} = 50^\circ$ nên $\widehat{EFb''} = 50^\circ$
Lại có : $\widehat{EFb} + \widehat{EFb''} = 180^\circ$ (hai góc kề bù)
Suy ra $\widehat{EFb} = 180^\circ - \widehat{EFb''} = 180^\circ - 50^\circ = 130^\circ$
Mà $\widehat{EFb''} = \widehat{bFx''}$ (hai góc đối đỉnh)
Suy ra $\widehat{bFx''} = 50^\circ$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/3db4754f-ce8f-48fb-bd78-d73743fc73f8.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0100', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0001'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'Cho hình vẽ. biết $cc'' \parallel dd''$ và $\widehat{cGH} = 72^{\circ} $. Tính các góc $\widehat{dHy''}$ và $\widehat{GHd}$.', NULL, 'Giải :
Ta có $cc'' \parallel dd''$
Suy ra $\widehat{cGH} = \widehat{GHd''}$ (hai góc so le trong)
Mà $\widehat{cGH} = 72^{\circ}$ nên $\widehat{GHd''} = 72^{\circ}$
Lại có : $\widehat{GHd} + \widehat{GHd''} = 180^{\circ}$ (hai góc kề bù)
Suy ra $\widehat{GHd} = 180^{\circ} - \widehat{GHd''} = 180^{\circ} - 72^{\circ} = 108^{\circ}$
Mà $\widehat{GHd''} = \widehat{dHy''}$ (hai góc đối đỉnh)
Suy ra $\widehat{dHy''} = 72^{\circ}$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/25698760-2228-4efd-b346-8531f97d1a45.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0101', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0001'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'Cho hình vẽ, biết $mm'' \parallel nn''$ và $\widehat{mPQ} = 58^\circ$. Tính các góc $\widehat{nQz''}$ và $\widehat{PQn}$.', NULL, 'Giải :
Ta có $mm'' \parallel nn''$
Suy ra $\widehat{mPQ} = \widehat{PQn''}$ (hai góc so le trong)
Mà $\widehat{mPQ} = 58^\circ$ nên $\widehat{PQn''} = 58^\circ$
Lại có : $\widehat{PQn} + \widehat{PQn''} = 180^\circ$ (hai góc kề bù)
Suy ra $\widehat{PQn} = 180^\circ - \widehat{PQn''} = 180^\circ - 58^\circ = 122^\circ$
Mà $\widehat{PQn''} = \widehat{nQz''}$ (hai góc đối đỉnh)
Suy ra $\widehat{nQz''} = 58^\circ$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/c024ddf4-eb65-41b4-b867-e692346d843d.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0102', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0001'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'Cho hình vẽ, biết $uu'' \parallel vv''$ và $\widehat{uRS} = 76^\circ$. Tính các góc $\widehat{vSt''}$ và $\widehat{RSv}$.', NULL, 'Giải :
Ta có $uu'' \parallel vv''$
Suy ra $\widehat{uRS} = \widehat{RSv''}$ (hai góc so le trong)
Mà $\widehat{uRS} = 76^\circ$ nên $\widehat{RSv''} = 76^\circ$
Lại có : $\widehat{RSv} + \widehat{RSv''} = 180^\circ$ (hai góc kề bù)
Suy ra $\widehat{RSv} = 180^\circ - \widehat{RSv''} = 180^\circ - 76^\circ = 104^\circ$
Mà $\widehat{RSv''} = \widehat{vSt''}$ (hai góc đối đỉnh)
Suy ra $\widehat{vSt''} = 76^\circ$', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/2a43b267-8e1a-44c3-9c51-bf2c270fa54c.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0103', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 4),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0001'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, '33db9aef-139a-4990-9ddb-35dd7c98e960', 'Cho hình vẽ. biết $kk'' \parallel ll''$ và $\widehat{kMN} = 64^\circ$. Tính các góc $\widehat{lNl''}$ và $\widehat{MNl}$.', NULL, 'Ta có: $kk'' \parallel ll''$
Suy ra $\widehat{MNl''}=\widehat{kMN}$ (2 góc so le trong)
Mà $\widehat{kMN}=64^\circ$
Suy ra $\widehat{MNl''}=64^\circ$

Ta có: $\widehat{MNl}+\widehat{MNl''}=180^\circ$ (2 góc kề bù)
Mà $\widehat{MNl''}=64^\circ$
Nên $\widehat{MNl}+64^\circ=180^\circ$
$\widehat{MNl}=180^\circ-64^\circ=116^\circ$
Vậy $\widehat{MNl}=116^\circ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/de6965ad-4066-43b0-8400-9bb70c329efa.png', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0104', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0055'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'bba5557a-151b-49c5-a3cd-76daa34c335e', 'Cho hình vẽ. Biết $Ox$ và $Ox''$, $Oy$ và $Oy''$ là các tia đối nhau. Tính góc $xOy$, góc $x''Oy$.', NULL, 'Vì $\widehat{x''Oy''} = 45^\circ$ và $\widehat{xOy}$ là hai góc đối đỉnh nên $\widehat{xOy}=45^\circ$.
$\widehat{x''Oy}$ kề bù với $\widehat{xOy}$ nên:
$\widehat{x''Oy} + \widehat{xOy} = 180^\circ$
$\widehat{x''Oy} = 180^\circ - 45^\circ = 135^\circ$
Vậy $\widehat{xOy}=45^\circ$, $\widehat{x''Oy}=135^\circ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/c88cd5f0-4771-4363-8d31-06539084df95.svgxml', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0105', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0055'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'bba5557a-151b-49c5-a3cd-76daa34c335e', 'Cho hình vẽ. Biết $Ox$ và $Ox''$, $Oy$ và $Oy''$ là các tia đối nhau. Tính góc $\widehat {xOy}$, góc $\widehat {x''Oy}$.', NULL, 'Vì $\widehat {x''Oy''} = 60^\circ$ và $\widehat  {xOy}$ là hai góc đối đỉnh nên $\widehat  {xOy} = 60^\circ$.
$\widehat  {x''Oy}$ kề bù với $\widehat  {xOy}$ nên:
$\widehat { x''Oy} + \widehat  {xOy} = 180^\circ$
$\widehat  {x''Oy} = 180^\circ - 60^\circ = 120^\circ$
Vậy $\widehat  {xOy} = 60^\circ$, $\widehat  {x''Oy} = 120^\circ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/ab63c1d0-10e1-4d6d-8a2d-630ae43f664f.svgxml', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0106', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0055'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'bba5557a-151b-49c5-a3cd-76daa34c335e', 'Cho hình vẽ. Biết $Ox$ và $Ox''$, $Oy$ và $Oy''$ là các tia đối nhau. Tính góc $xOy$, góc $x''Oy$.', NULL, 'Vì $\widehat{xOy''} = 54^\circ$ và $\widehat{x''Oy}$ là hai góc đối đỉnh nên $\widehat{x''Oy} = 54^\circ$.
$\widehat{xOy}$ kề bù với $\widehat{x''Oy}$ nên:
$\widehat{xOy} + \widehat{x''Oy} = 180^\circ$
$\widehat{xOy} = 180^\circ - 54^\circ = 126^\circ$
Vậy $\widehat{xOy} = 126^\circ$, $\widehat{x''Oy} = 54^\circ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/a6993901-e166-4776-a912-28fa47f70295.svgxml', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0107', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
par as (select ma_cau from _hh_cau_map where temp_key = 'TMP0055'),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai, parent_ma_cau, clone_method)
  select bai.ma_bai, 'bba5557a-151b-49c5-a3cd-76daa34c335e', 'Cho hình vẽ. Biết $Ox$ và $Ox''$, $Oy$ và $Oy''$ là các tia đối nhau. Tính góc $xOy$, góc $x''Oy$.', NULL, 'Vì $\widehat{x''Oy''} = 35^\circ$ và $\widehat{xOy}$ là hai góc đối đỉnh nên $\widehat{xOy} = 35^\circ$.
$\widehat{x''Oy}$ kề bù với $\widehat{xOy}$ nên:
$\widehat{x''Oy} + \widehat{xOy} = 180^\circ$
$\widehat{x''Oy} = 180^\circ - 35^\circ = 145^\circ$
Vậy $\widehat{xOy} = 35^\circ$, $\widehat{x''Oy} = 145^\circ$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/68675e42-ef29-4c0c-8189-63e47aee3168.svgxml', NULL, 1, false, 'tu_luan', 'clone', 'nguoi', par.ma_cau, 'v3_bien_the'
  from bai, par
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0108', ma_cau from ins;

-- ── POST-CHECK ──────────────────────────────────────────────────────────────
do $$
declare n_bai int; n_cau int; n_lt int;
begin
  select count(*) into n_bai from hinh_hoc_bai where khoi='7';
  select count(*) into n_cau from hinh_hoc_cau_hoi c join hinh_hoc_bai b on b.ma_bai=c.dang_chinh where b.khoi='7';
  select count(*) into n_lt from hinh_hoc_bai_ly_thuyet lt join hinh_hoc_bai b on b.ma_bai=lt.ma_bai where b.khoi='7';
  raise notice 'Chuyển xong khối 7: % Bài học tổng (bao gồm Bài đã có trước migration), % câu tổng, % lý thuyết Bài tổng.', n_bai, n_cau, n_lt;
  -- Sau migration ít nhất phải THÊM 9 Bài + 108 câu so với trước.
  -- (Verify chính xác thêm bao nhiêu bằng cách xem count(*) TRƯỚC/SAU migration nếu cần)
  -- Guard tối thiểu: mỗi Bài trong 9 tên mô hình v3 phải xuất hiện đúng 1 lần.
  select count(*) into n_bai from hinh_hoc_bai where khoi='7' and ten_bai in ('Hai góc Kề bù','Đối đỉnh','Phân giác','Hai đường thẳng song song','Ba đường thẳng song song','Hình học','Phân giác trong Tam giác vuông.','Mô hình 3 góc bù ','Đối đỉnh thêm tia');
  if n_bai <> 9 then raise exception 'Sau migration: mong 9 Bài tên mô hình v3, có %', n_bai; end if;
end $$;

commit;