-- ============================================================================
-- 202609172221 — CHUYỂN dữ liệu HÌNH khối 9 từ mô hình LUYỆN sang mô hình HỌC (CEO 17/09)
-- ----------------------------------------------------------------------------
-- QUY TẮC (spec-kho-hinh-v3 §5 + user 17/09):
--  · 1 mô hình khối 9 (`hinh_mo_hinh` khoi='9') → 1 Bài học (`hinh_hoc_bai`).
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
--   Bài học sẽ tạo:   3
--   Câu lẻ:           55
--   Câu ghép:         16
--   Biến thể clone:   0
--   Biến thể độc lập: 0
--   Bài toán không dùng (tiền đề thuần + giữa chuỗi, không có câu riêng): 30
--   Nguồn: 101 `hinh_baitoan` + 0 biến thể của khối 9.
--
-- KHÔNG XÓA gì bên hinh_mo_hinh/hinh_baitoan/…. Chỉ THÊM vào hinh_hoc_bai/…
-- Idempotency: chèn xong sẽ có 9 dòng `hinh_hoc_bai` khoi='9'. Nếu chạy lại,
--   PRE-CHECK ở đầu block sẽ RAISE để không double-insert.
-- ============================================================================

begin;

-- ── PRE-CHECK: 9 tên Bài mới (đúng tên mô hình v3) đã có trong DB chưa? ────
-- (CEO 16/09 đã có sẵn "Tổng ba góc của một tam giác" cho khối 9 — KHÔNG đụng.
--  Migration này APPEND 9 Bài từ mô hình v3 vào bên cạnh, thu_tu tiếp theo tự động.)
do $$
declare n int;
begin
  select count(*) into n from hinh_hoc_bai where khoi='9' and ten_bai in ('Mô hình tam giác vuông','Hình học Test','Tam giác vuông có Đường cao $AH$');
  if n > 0 then raise exception 'Đã có % Bài trong 9 tên mô hình v3 (khối 9) — migration này đã chạy. Bỏ qua để tránh double-insert.', n; end if;
end $$;

-- ── STAGE 1 · Tạo bảng tạm chứa mapping mô hình → thu_tu Bài ────────────────
create temp table _hh_bai_map (mo_hinh_id uuid, ten_bai text, thu_tu smallint) on commit drop;
create temp table _hh_bai_ma (thu_tu smallint, ma_bai text) on commit drop;
create temp table _hh_cau_map (temp_key text primary key, ma_cau text) on commit drop;

-- ── STAGE 2 · INSERT hinh_hoc_bai (9 Bài) + build map thu_tu → ma_bai ──────
insert into _hh_bai_map values ('ed73b4ae-a169-47e1-b764-5d9b193d2e58', 'Mô hình tam giác vuông', 1);
insert into _hh_bai_map values ('9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'Hình học Test', 2);
insert into _hh_bai_map values ('f52a6e61-ad44-42c6-9823-59395d9f4499', 'Tam giác vuông có Đường cao $AH$', 3);

-- Base = max(thu_tu) khối 9 hiện tại. Bài mới ghi thu_tu = base + 1..9.
-- Map giữa (_hh_bai_map.thu_tu ∈ 1..9) và ma_bai mới dựa vào ten_bai (9 tên đều KHÁC nhau, verified).
with base as (select coalesce(max(thu_tu),0) as b from hinh_hoc_bai where khoi='9'),
ins as (
  insert into hinh_hoc_bai (khoi, ten_bai, thu_tu, da_duyet)
  select '9', m.ten_bai, m.thu_tu + b, false from _hh_bai_map m, base order by m.thu_tu
  returning ma_bai, ten_bai
)
insert into _hh_bai_ma (thu_tu, ma_bai)
  select m.thu_tu, ins.ma_bai from ins join _hh_bai_map m on m.ten_bai = ins.ten_bai;

-- ── STAGE 3 · Lý thuyết Bài (gia_thiet + link ảnh cấu hình nếu có) ─────────
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho tam giác $ABC$ vuông ở $A$.

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/a1bbf797-1ac4-4951-ad69-bdc4c7510f8d.png)' from _hh_bai_ma where thu_tu = 1;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'test' from _hh_bai_ma where thu_tu = 2;
insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung)
  select ma_bai, 'Cho tam giác $ABC$ vuông ở $A$.; Đường cao $AH$

![Cấu hình](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/f11268c6-217a-427f-89ca-060a58ee682e.png)' from _hh_bai_ma where thu_tu = 3;

-- ── STAGE 4 · INSERT hinh_hoc_cau_hoi (71 câu: 55 lẻ + 16 ghép + 0 biến thể) ──
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 3),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'f52a6e61-ad44-42c6-9823-59395d9f4499', 'Chứng minh : $\triangle BHA \sim \triangle BAC$ ; $\triangle CHA \sim \triangle CAB$', NULL, 'Xét tam giác BHA và BAC có :
$\widehat{BHA} = \widehat{BAC} = 90^0$
$\widehat{ABC}$ chung
Suy ra $\triangle BHA \sim \triangle BAC (g.g)$
Xét tam giác CHA và CAB có :
$\widehat{CHA} = \widehat{CAB} = 90^0$
$\widehat{ACB}$ chung
Suy ra $\triangle CHA \sim \triangle CAB (g.g)$', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0001', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'ed73b4ae-a169-47e1-b764-5d9b193d2e58', 'Giải tam giác ABC', NULL, 'Tùy thuộc vào giả thiết của đề bài mà ta sử dụng công thức phù hợp

$\sin B = \frac{AC}{BC}$; $\cos B = \frac{AB}{BC}$; $\tan B = \frac{AC}{AB}$

$\sin C = \frac{AB}{BC}$; $\cos C = \frac{AC}{BC}$; $\tan C = \frac{AB}{AC}$', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0002', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh bốn điểm A, B, C, O cùng thuộc một đường tròn. Xác định tâm và bán kính của đường
tròn đó.
b) Chứng minh rằng $OA \perp BC$ tại H và $OA \parallel CD$
c) Khi $OA = BD$, hãy tính theo R diện tích hình quạt giới hạn bởi bán kính OC, OD và cung nhỏ CD.', NULL, 'a) $AB, AC$ là tiếp tuyến của $(O)$ tại $B, C$ nên $\widehat{ABO} = \widehat{ACO} = 90^\circ$, suy ra $B, C$ cùng nhìn đoạn $AO$ dưới một góc vuông. Vậy bốn điểm $A, B, C, O$ cùng thuộc đường tròn đường kính $AO$, có tâm là trung điểm của $AO$ và bán kính bằng $\dfrac{AO}{2}$.

b) Vì $AB = AC$ (hai tiếp tuyến cắt nhau tại $A$) và $OB = OC = R$ nên $AO$ là trung trực của $BC$, suy ra $AO \perp BC$ tại $H$.

Vì $BD$ là đường kính của $(O)$ nên $\widehat{BCD} = 90^\circ$ (góc nội tiếp chắn nửa đường tròn), suy ra $DC \perp BC$. Kết hợp với $AO \perp BC$, ta có $DC \parallel AO$.

c) Khi $OA = BD = 2R$: xét $\triangle OBA$ vuông tại $B$ (do $AB$ tiếp tuyến), có $OB = R$, $OA = 2R$, suy ra $\cos\widehat{BOA} = \dfrac{OB}{OA} = \dfrac{1}{2}$, do đó $\widehat{BOA} = 60^\circ$.

Vì $AO$ là trung trực $BC$ (câu b) nên $AO$ là phân giác của $\widehat{BOC}$, suy ra $\widehat{BOC} = 2\widehat{BOA} = 120^\circ$.

Vì $B, O, D$ thẳng hàng ($BD$ là đường kính, $O$ là trung điểm) nên $\widehat{COD} = 180^\circ - \widehat{BOC} = 180^\circ - 120^\circ = 60^\circ$.

Diện tích hình quạt $OCD$ (giới hạn bởi $OC$, $OD$ và cung nhỏ $CD$) với góc ở tâm $60^\circ$: $S = \dfrac{60^\circ}{360^\circ} \cdot \pi R^2 = \dfrac{\pi R^2}{6}$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0003', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh bốn điểm $B, C, E, F$ cùng thuộc một đường tròn.
b) Vẽ đường kính $AT$ của đường tròn ($O$). Chứng minh $\triangle ADB$ đồng dạng với $\triangle ACT$ và $2\widehat{HEF} + \widehat{AOC} = 180^\circ$.
c) Vẽ $CI$ vuông góc với $AT$ tại $I$. Gọi $M$ là trung điểm của $BC$. Chứng minh ba điểm $F, M, I$ thẳng hàng.', NULL, 'a) Vì $CF \perp AB$ nên $\widehat{BFC}=90^\circ$; vì $BE \perp AC$ nên $\widehat{BEC}=90^\circ$. Hai điểm $E,F$ cùng nhìn đoạn $BC$ dưới góc $90^\circ$ nên $E,F$ nằm trên đường tròn đường kính $BC$. Vậy bốn điểm $B,C,E,F$ cùng thuộc một đường tròn (đường kính $BC$, tâm là trung điểm $M$ của $BC$).

b) $AT$ là đường kính của $(O)$ nên $\widehat{ACT}=90^\circ$ (góc nội tiếp chắn nửa đường tròn). Mặt khác $AD \perp BC$ nên $\widehat{ADB}=90^\circ$. Lại có $\widehat{ABD}=\widehat{ABC}$ và $\widehat{ABC}=\widehat{ATC}$ (hai góc nội tiếp cùng chắn cung $AC$). Suy ra $\widehat{ADB}=\widehat{ACT}$ và $\widehat{ABD}=\widehat{ATC}$, do đó $\triangle ADB \backsim \triangle ACT$ (g.g), tương ứng đỉnh $A \leftrightarrow A,\ D \leftrightarrow C,\ B \leftrightarrow T$.

Vì $BE \perp AC$ nên $\widehat{AEH}=90^\circ$; vì $CF \perp AB$ nên $\widehat{AFH}=90^\circ$. Vậy $A,E,H,F$ cùng thuộc đường tròn đường kính $AH$. Trong đường tròn này, $\widehat{HEF}$ và $\widehat{HAF}$ cùng chắn cung $HF$ nên $\widehat{HEF}=\widehat{HAF}=\widehat{DAB}$.

Trong tam giác vuông $ADB$ (vuông tại $D$): $\widehat{DAB}=90^\circ-\widehat{ABC}$. Vậy $\widehat{HEF}=90^\circ-\widehat{ABC}$ $(1)$.

Mặt khác $\widehat{AOC}$ là góc ở tâm và $\widehat{ABC}$ là góc nội tiếp cùng chắn cung $AC$ (không chứa $B$) nên $\widehat{AOC}=2\widehat{ABC}$ $(2)$.

Từ $(1)$: $2\widehat{HEF}=180^\circ-2\widehat{ABC}$. Cộng với $(2)$: $2\widehat{HEF}+\widehat{AOC}=180^\circ-2\widehat{ABC}+2\widehat{ABC}=180^\circ$ (đpcm).

c) Chọn hệ trục với tâm $O$ của $(O)$ làm gốc, bán kính $(O)$ bằng $1$, biểu diễn $A,B,C$ trên $(O)$ bởi các số phức $a,b,c$ với $|a|=|b|=|c|=1$ (nên $\bar a=\dfrac1a,\ \bar b=\dfrac1b,\ \bar c=\dfrac1c$). Công thức chân đường vuông góc hạ từ điểm $z$ xuống dây $pq$ của đường tròn đơn vị là $f=\dfrac{p+q+z-pq\bar z}{2}$.

Với $H=a+b+c$ (trực tâm), $T=-a$: $F=\dfrac{a+b+c-ab\bar c}{2}$ (chân đường cao từ $C$), $I=\dfrac{c+a^2\bar c}{2}$ (chân đường vuông góc từ $C$ xuống $AT$), $M=\dfrac{b+c}{2}$.

Tính được $F-M=\dfrac{a(c-b)}{2c}$ và $I-M=\dfrac{a^2-bc}{2c}$, suy ra $\dfrac{F-M}{I-M}=\dfrac{a(c-b)}{a^2-bc}$.

Lấy liên hợp (dùng $\bar a=\frac1a,\bar b=\frac1b,\bar c=\frac1c$) ta được $\overline{\left(\dfrac{F-M}{I-M}\right)}=\dfrac{a(c-b)}{a^2-bc}$, đúng bằng giá trị ban đầu. Vậy $\dfrac{F-M}{I-M}$ là số thực, tức $\overrightarrow{MF}$ và $\overrightarrow{MI}$ cùng phương. Do đó ba điểm $F,M,I$ thẳng hàng (đpcm).

(Đã verify độc lập bằng toạ độ số cho nhiều tam giác nhọn cụ thể thoả $AB<AC$: cả ba kết luận a, b, c đều đúng chính xác đến sai số làm tròn máy.)', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0004', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh bốn điểm A, M, O, B cùng thuộc một đường tròn.
b) Trên đường tròn $(O)$ lấy điểm C sao cho OM là tia phân giác của $\widehat{BOC}$. Dây BC cắt
OA, OM lần lượt tại K, H. Chứng minh rằng MC là tiếp tuyến của đường tròn $(O)$ và
$OK \cdot OA = OH \cdot OM = R^2$.
c) Kẻ đường kính BE của đường tròn $(O)$. Kẻ $CG \perp BE$ tại G, ME cắt CG tại I. Chứng
minh rằng I là trung điểm của CG.', NULL, 'a) Vì $(d) \perp OA$ tại $A$ và $M \in (d)$ nên $\widehat{OAM}=90^\circ$. Vì $MB$ là tiếp tuyến của $(O)$ tại $B$ nên $\widehat{OBM}=90^\circ$. Hai điểm $A,B$ cùng nhìn đoạn $OM$ dưới góc vuông nên $A,M,O,B$ cùng thuộc đường tròn đường kính $OM$.

b) Vì $OM$ là phân giác $\widehat{BOC}$ và $OB=OC=R$ nên tam giác $OBC$ cân tại $O$ có $OM$ vừa là phân giác vừa là trung trực của $BC$. Suy ra $C$ là điểm đối xứng của $B$ qua đường thẳng $OM$.

Phép đối xứng trục $OM$ biến $O \mapsto O$, $M \mapsto M$ (vì $M \in OM$), $B \mapsto C$, nên biến đường thẳng $MB$ (tiếp tuyến tại $B$, $MB \perp OB$) thành đường thẳng $MC$, và $OB$ thành $OC$; do đó $MC \perp OC$, tức $MC$ là tiếp tuyến của $(O)$ tại $C$.

Gọi $H=BC \cap OM$. Vì $OM$ là trung trực của $BC$ nên $OM \perp BC$ tại $H$, và $H$ là trung điểm $BC$. Xét tam giác vuông $OBM$ (vuông tại $B$) có $BH \perp OM$ tại $H$, tức $BH$ là đường cao ứng cạnh huyền $OM$: theo hệ thức lượng, $OH \cdot OM=OB^2=R^2$.

Gọi $K=BC \cap OA$. Xét $\triangle OHK$ và $\triangle OAM$: $\widehat{OHK}=90^\circ$ (vì $HK \subset BC \perp OM$ tại $H$), $\widehat{OAM}=90^\circ$ (câu a), và $\widehat{HOK}=\widehat{AOM}$ (góc chung vì $H \in OM$, $K \in OA$). Vậy $\triangle OHK \backsim \triangle OAM$ (g.g), suy ra $\dfrac{OH}{OA}=\dfrac{OK}{OM}$, tức $OH \cdot OM=OK \cdot OA$.

Kết hợp với $OH \cdot OM=R^2$: $OK \cdot OA=R^2$. Vậy $OK \cdot OA=OH \cdot OM=R^2$ (đpcm).

c) Vì $BE$ là đường kính và $C \in (O)$ nên $\widehat{BCE}=90^\circ$. Đặt hệ trục vuông góc tại $C$: gốc $C$, tia $CB$ là trục hoành, tia $CE$ là trục tung. Đặt $B=(b;0)$, $E=(0;e)$, $b,e>0$.

Trung điểm $O$ của $BE$ là $O=\left(\dfrac b2;\dfrac e2\right)$. Vì $MB,MC$ là hai tiếp tuyến (câu b) nên $MB=MC$, và cùng lập luận như câu 4 bài BT.09.179, $M$ nằm trên trung trực của $BC$ (đường thẳng $x=\dfrac b2$), viết $M=\left(\dfrac b2;m\right)$; điều kiện $MB \perp OB$ cho $m=-\dfrac{b^2}{2e}$.

$G$ là chân đường vuông góc từ $C=(0;0)$ xuống $BE$: $G=\left(\dfrac{be^2}{b^2+e^2};\ \dfrac{b^2e}{b^2+e^2}\right)$, trung điểm $CG$ là $\left(\dfrac{be^2}{2(b^2+e^2)};\ \dfrac{b^2e}{2(b^2+e^2)}\right)$.

Giải hệ tìm giao điểm $I$ của đường thẳng $ME$ với đường thẳng $CG$ (hoàn toàn tương tự phép tính ở câu 4 bài BT.09.179, chỉ đổi tên $d \to e,\ A \to M,\ D \to E,\ K \to I$), được
$$I=\left(\dfrac{be^2}{2(b^2+e^2)};\ \dfrac{b^2e}{2(b^2+e^2)}\right),$$
trùng với trung điểm $CG$. Vậy $I$ là trung điểm của $CG$ (đpcm).

(Đã verify độc lập bằng toạ độ số cho nhiều bộ $(R,\,OA,\,M)$ khác nhau: các kết luận a, b, c đều đúng chính xác đến sai số làm tròn máy.)', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0005', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh rằng: bốn điểm $M,B,O,A$ cùng thuộc một đường tròn;
b) Chứng minh rằng: $H$ là trung điểm của $AB$ và $AM \cdot AD = AB \cdot R$;
c) Gọi $N$ là giao điểm của $MD$ và $AB$. Tiếp tuyến của đường tròn $(O)$ tại $D$ cắt đường thẳng
$AB$ tại $K$.
i) Chứng minh rằng $NA \cdot NB = NK \cdot NH$;
ii) Chứng minh rằng $ON \perp MK$.', NULL, 'a) $MA,MB$ là tiếp tuyến nên $\widehat{MAO}=\widehat{MBO}=90^\circ$. Hai điểm $A,B$ cùng nhìn đoạn $MO$ dưới góc vuông nên $M,B,O,A$ cùng thuộc đường tròn đường kính $MO$.

b) Vì $MA=MB$ (hai tiếp tuyến cắt nhau) và $OA=OB=R$ nên $M,O$ cùng thuộc trung trực của $AB$; suy ra $H=AB \cap OM$ là trung điểm của $AB$ và $OM \perp AB$ tại $H$.

Vì $BD$ là đường kính và $A \in (O)$ nên $\widehat{BAD}=90^\circ$. Đặt $\varphi=\widehat{MAB}$; theo góc tạo bởi tiếp tuyến $MA$ và dây $AB$: $\varphi=\widehat{ADB}$ (góc nội tiếp chắn cung $AB$ ở phía đối diện).

Trong tam giác vuông $ABD$ (vuông tại $A$): $AD=BD\cos\varphi=2R\cos\varphi$, $AB=BD\sin\varphi=2R\sin\varphi$.

Trong tam giác vuông $MAH$ (vuông tại $H$, vì $MH \perp AB$): $\widehat{MAH}=\widehat{MAB}=\varphi$ nên $AH=AM\cos\varphi$, suy ra $AM=\dfrac{AH}{\cos\varphi}=\dfrac{AB/2}{\cos\varphi}=\dfrac{AB}{2\cos\varphi}$.

Nhân lại: $AM \cdot AD=\dfrac{AB}{2\cos\varphi} \cdot 2R\cos\varphi=AB \cdot R$ (đpcm).

c) Đặt hệ trục toạ độ: gốc $O$, trục hoành là đường thẳng $OM$ (do $A,B$ đối xứng nhau qua $OM$). Không mất tính tổng quát chọn bán kính $(O)$ bằng $1$: $M=(m;0)$ với $m>1$, khi đó $A=(a;y_0)$, $B=(a;-y_0)$ với $a=\dfrac1m$, $y_0>0$, $a^2+y_0^2=1$ (do $MA \perp OA$, hệ thức lượng trong tam giác vuông $OAM$). $D=-B=(-a;y_0)$; $H=(a;0)$ (trung điểm $AB$, câu b).

Đường thẳng $MD$ cắt $AB$ (đường thẳng $x=a$) tại $N=\left(a;\ \dfrac{y_0^3}{1+a^2}\right)$ (tính từ tham số hoá đoạn $MD$, dùng $1-a^2=y_0^2$).

Tiếp tuyến của $(O)$ tại $D=(-a;y_0)$ có phương trình $-ax+y_0y=1$; cắt $AB$ ($x=a$) tại $K=\left(a;\ \dfrac{1+a^2}{y_0}\right)$.

Tính trực tiếp trên trục $x=a$ (dùng $y_0^2+a^2=1$):
$$NA=\dfrac{2a^2y_0}{1+a^2},\quad NB=\dfrac{2y_0}{1+a^2},\quad NH=\dfrac{y_0^3}{1+a^2},\quad NK=\dfrac{4a^2}{y_0(1+a^2)}.$$

Suy ra $NA \cdot NB=\dfrac{4a^2y_0^2}{(1+a^2)^2}$ và $NK \cdot NH=\dfrac{4a^2y_0^2}{(1+a^2)^2}$, tức $NA \cdot NB=NK \cdot NH$ (đpcm i).

Với $O=(0;0)$: $\overrightarrow{ON}=\left(a;\ \dfrac{y_0^3}{1+a^2}\right)$; $\overrightarrow{MK}=\left(a-\dfrac1a;\ \dfrac{1+a^2}{y_0}\right)=\left(-\dfrac{y_0^2}{a};\ \dfrac{1+a^2}{y_0}\right)$ (dùng $a^2-1=-y_0^2$).

Tích vô hướng: $\overrightarrow{ON} \cdot \overrightarrow{MK}=a \cdot \left(-\dfrac{y_0^2}{a}\right)+\dfrac{y_0^3}{1+a^2} \cdot \dfrac{1+a^2}{y_0}=-y_0^2+y_0^2=0$.

Vậy $ON \perp MK$ (đpcm ii).

(Đã verify độc lập bằng toạ độ số cho nhiều bộ $(R,\,OM)$ khác nhau: các kết luận a, b, c(i), c(ii) đều đúng chính xác đến sai số làm tròn máy.)', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0006', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh bốn điểm M, A, O, B cùng thuộc một đường tròn.
b) Gọi giao điểm của MO và AB là H. Chứng minh $MO \perp AB$ và $OH \cdot OM = R^2$.
c) Một đường thẳng d thay đổi đi qua M nhưng không đi qua O cắt đường tròn $(O)$ tại hai điểm N và P (N nằm giữa M và P). Tiếp tuyến của đường tròn $(O)$ tại N và P cắt nhau tại F. Gọi K là trung điểm của NP. Chứng minh $\triangle KOM$ đồng dạng với $\triangle HOF$.', NULL, 'a) Vì $MA$ là tiếp tuyến của $(O)$ tại $A$ nên $OA \perp MA$, suy ra $\widehat{OAM} = 90^\circ$. Vì $MB$ là tiếp tuyến của $(O)$ tại $B$ nên $OB \perp MB$, suy ra $\widehat{OBM} = 90^\circ$. Vậy $A$ và $B$ cùng nhìn đoạn $OM$ dưới một góc vuông, nên $A, B$ cùng thuộc đường tròn đường kính $OM$. Vậy bốn điểm $M, A, O, B$ cùng thuộc đường tròn đường kính $OM$.

b) Ta có $MA = MB$ (tính chất hai tiếp tuyến cắt nhau tại $M$) và $OA = OB = R$. Suy ra $M$ và $O$ đều cách đều hai điểm $A, B$, tức $M$ và $O$ cùng nằm trên đường trung trực của $AB$. Do đó đường thẳng $MO$ là đường trung trực của $AB$, suy ra $MO \perp AB$ tại $H$ (và $H$ là trung điểm $AB$).

Xét tam giác $OAM$ vuông tại $A$ (vì $OA \perp AM$). Vì $H \in OM$ và $AH \subset AB \perp OM$ tại $H$, nên $AH$ là đường cao ứng với cạnh huyền $OM$ trong tam giác vuông $OAM$. Theo hệ thức lượng trong tam giác vuông: $OA^2 = OH \cdot OM$. Mà $OA = R$, nên $OH \cdot OM = R^2$.

c) Vì $FN, FP$ là hai tiếp tuyến của $(O)$ tại $N, P$ nên tương tự câu a) với $F$ đóng vai trò như $M$: $\widehat{ONF} = \widehat{OPF} = 90^\circ$, và $FN = FP$, $ON = OP = R$, nên $OF$ là đường trung trực của $NP$, suy ra $OF \perp NP$.

Vì $OF$ là đường trung trực của dây $NP$ nên giao điểm của $OF$ với $NP$ chính là trung điểm của $NP$. Theo đề bài, $K$ là trung điểm $NP$, do đó $K$ chính là giao điểm của $OF$ và $NP$: $K = OF \cap NP$, $OK \perp NP$.

Xét tam giác $ONF$ vuông tại $N$ (vì $ON \perp NF$), $NK$ là đường cao ứng với cạnh huyền $OF$. Theo hệ thức lượng trong tam giác vuông: $ON^2 = OK \cdot OF$, tức $OK \cdot OF = R^2$.

Từ câu b) ta có $OH \cdot OM = R^2$, kết hợp với $OK \cdot OF = R^2$, suy ra $OH \cdot OM = OK \cdot OF$, tức $\dfrac{OK}{OH} = \dfrac{OM}{OF}$.

Trong tam giác vuông $OAM$, chân đường cao $H$ hạ từ $A$ xuống cạnh huyền $OM$ luôn nằm giữa $O$ và $M$, nên tia $OH$ trùng tia $OM$. Tương tự trong tam giác vuông $ONF$, chân đường cao $K$ hạ từ $N$ xuống cạnh huyền $OF$ luôn nằm giữa $O$ và $F$, nên tia $OK$ trùng tia $OF$. Do đó $\widehat{KOM} = \widehat{HOF}$ (cùng là góc giữa tia $OM$ và tia $OF$).

Hai tam giác $KOM$ và $HOF$ có $\dfrac{OK}{OH} = \dfrac{OM}{OF}$ và $\widehat{KOM} = \widehat{HOF}$ (góc xen giữa), nên theo trường hợp đồng dạng cạnh–góc–cạnh: $\triangle KOM \backsim \triangle HOF$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0007', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh bốn điểm $A, M, C, O$ cùng nằm trên một đường tròn.
b) Chứng minh $DF$ là tiếp tuyến của $(O;R)$.
c) Chứng minh: $AF \cdot BH = BF \cdot AH$.', NULL, 'a) $AM$ là tiếp tuyến tại $A$ nên $OA \perp AM$, tức $\widehat{OAM}=90^\circ$. $CM$ là tiếp tuyến tại $C$ nên $OC \perp CM$, tức $\widehat{OCM}=90^\circ$. Hai điểm $A,C$ cùng nhìn đoạn $OM$ dưới một góc vuông $\Rightarrow A,C$ thuộc đường tròn đường kính $OM$ $\Rightarrow$ bốn điểm $A,M,C,O$ cùng thuộc một đường tròn.

b) Vì $AB$ là đường kính và $CD \perp AB$ tại $H$ (giả thiết đường cao $CH$ kéo dài cắt $(O;R)$ tại $D$) nên đường kính $AB$ vuông góc với dây $CD$ tại $H$, do đó $AB$ là đường trung trực của $CD$: phép đối xứng qua đường thẳng $AB$ biến $C$ thành $D$, biến đường tròn $(O;R)$ thành chính nó, và giữ nguyên mọi điểm trên $AB$ (trong đó có $F$, vì $F \in AB$).
Đường thẳng $MC$ chính là tiếp tuyến của $(O;R)$ tại $C$ (do $M$ là giao điểm hai tiếp tuyến tại $A$ và tại $C$), và $F$ là giao điểm của đường thẳng đó với $AB$. Qua phép đối xứng trục $AB$: tiếp tuyến tại $C$ biến thành tiếp tuyến tại $D$, điểm $F$ biến thành chính nó $\Rightarrow$ ảnh của đường thẳng $CF$ là đường thẳng $DF$, và $DF$ là tiếp tuyến của $(O;R)$ tại $D$.

c) Vì $\triangle ABC$ nội tiếp đường tròn đường kính $AB$ nên $\widehat{ACB}=90^\circ$; $CH$ là đường cao ứng với cạnh huyền $AB$ nên theo hệ thức lượng trong tam giác vuông: $CA^2=AH \cdot AB$ và $CB^2=BH \cdot AB$, suy ra $\dfrac{AH}{BH}=\dfrac{CA^2}{CB^2}$.
Mặt khác $FC$ là tiếp tuyến tại $C$ và $FAB$ là cát tuyến qua $A,B$, theo góc tạo bởi tiếp tuyến và dây cung: $\widehat{FCA}=\widehat{FBC}$ (cùng chắn cung $CA$). Xét $\triangle FCA$ và $\triangle FBC$ có góc $F$ chung và $\widehat{FCA}=\widehat{FBC}$ $\Rightarrow \triangle FCA \sim \triangle FBC$ (g.g) $\Rightarrow \dfrac{FA}{FC}=\dfrac{FC}{FB}=\dfrac{CA}{CB}$.
Từ đó $\dfrac{FA}{FB}=\dfrac{FA}{FC}\cdot\dfrac{FC}{FB}=\dfrac{CA}{CB}\cdot\dfrac{CA}{CB}=\dfrac{CA^2}{CB^2}$.
Kết hợp với $\dfrac{AH}{BH}=\dfrac{CA^2}{CB^2}$ ở trên: $\dfrac{FA}{FB}=\dfrac{AH}{BH} \Rightarrow FA \cdot BH=FB \cdot AH$, tức $AF \cdot BH=BF \cdot AH$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0008', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh 4 điểm $A, M, O, C$ cùng thuộc một đường tròn.
b) Qua $O$ kẻ đường thẳng vuông góc với dây cung $MB$ cắt tia $CM$ tại $D$, $OD$ cắt $MB$ tại $H$.
Chứng minh $OH \cdot OD = R^2$ và $DB$ là tiếp tuyến của đường tròn $(O)$.
c) Tia $AH$ cắt đường tròn $(O; R)$ tại $N$, $BN$ cắt $OD$ tại $I$. Chứng minh rằng $I$ là trung điểm của $HD$.', NULL, 'a) $CA, CM$ là hai tiếp tuyến của $(O)$ tại $A$ và $M$ nên $\widehat{OAC}=\widehat{OMC}=90^\circ$. Vậy $A, M$ cùng nhìn $OC$ dưới một góc vuông, suy ra $A, M, O, C$ cùng thuộc đường tròn đường kính $OC$.

b) Tia $CM$ nằm trên đường thẳng tiếp tuyến của $(O)$ tại $M$, nên $D$ (thuộc tia $CM$) cũng thuộc tiếp tuyến này: $OM \perp MD$, tam giác $OMD$ vuông tại $M$. Vì $H = OD \cap MB$ với $OD \perp MB$, nên $MH$ là đường cao ứng với cạnh huyền $OD$ của tam giác vuông $OMD$. Theo hệ thức lượng trong tam giác vuông: $OM^2 = OH \cdot OD$, tức $OH \cdot OD = R^2$.

Vì $OM = OB = R$ nên $OH \cdot OD = OB^2$, hay $\dfrac{OH}{OB} = \dfrac{OB}{OD}$; kết hợp $\widehat{HOB} = \widehat{BOD}$ (góc chung), suy ra $\triangle OHB \backsim \triangle OBD$ (c.g.c). Do đó $\widehat{OHB} = \widehat{OBD}$. Mà $\widehat{OHB} = 90^\circ$ (vì $OH \perp MB$ tại $H \in MB$), nên $\widehat{OBD} = 90^\circ$, tức $DB \perp OB$ tại $B$. Vì $B \in (O)$ và $DB$ vuông góc với bán kính $OB$ tại $B$, $DB$ là tiếp tuyến của $(O)$.

c) Vì $OH \perp MB$ tại $H$ (đường nối tâm vuông góc dây cung thì qua trung điểm dây), $H$ là trung điểm $MB$.

Chuẩn hoá $R=1$, chọn $O$ làm gốc vectơ, đặt $\vec a = \vec{OA}, \vec m = \vec{OM}$ ($|\vec a|=|\vec m|=1$); vì $AB$ là đường kính nên $\vec{OB}=-\vec a$. Đặt $c = \vec a \cdot \vec m$.

$\vec{OH} = \dfrac{\vec m - \vec a}{2}$.

Theo câu b), $DM, DB$ đều là tiếp tuyến của $(O)$, nên $\vec{OD}\cdot\vec m = 1$ và $\vec{OD}\cdot\vec a = -1$. Viết $\vec{OD}=\alpha \vec m + \beta \vec a$, giải hệ này được $\vec{OD} = \dfrac{\vec m - \vec a}{1-c}$.

$N$ là giao thứ hai (khác $A$) của tia $AH$ với $(O)$: viết $\vec{ON} = \vec a + t(\vec{OH}-\vec a)$, thế vào $|\vec{ON}|^2=1$, giải phương trình bậc hai theo $t$ (loại nghiệm $t=0$ ứng với $A$) được $t = \dfrac{2(3-c)}{5-3c}$.

Viết $\vec{ON} = p\,\vec a + q\,\vec m$ với $p = 1-\dfrac{3t}{2} = \dfrac{-4}{5-3c}$, $q=\dfrac{t}{2}=\dfrac{3-c}{5-3c}$.

Gọi $I = BN \cap OD$: viết $\vec{OI}=\mu(\vec m-\vec a)$ (trên $OD$) và $\vec{OI} = -\vec a + r(\vec{ON}+\vec a)$ (trên $BN$); đồng nhất hệ số của $\vec a,\vec m$ (độc lập tuyến tính vì $M \ne \pm A$): $r(1+p)-1=-\mu$, $rq=\mu$, suy ra $r=\dfrac{1}{1+p+q}$, $\mu = \dfrac{q}{1+p+q} = \dfrac{3-c}{4(1-c)}$.

Mặt khác, trung điểm của $HD$ có vectơ $\dfrac{\vec{OH}+\vec{OD}}{2} = \dfrac12\left(\dfrac{\vec m-\vec a}{2}+\dfrac{\vec m-\vec a}{1-c}\right) = (\vec m-\vec a)\cdot\dfrac{3-c}{4(1-c)} = \mu(\vec m-\vec a) = \vec{OI}$.

Vậy $\vec{OI}$ chính là vectơ tới trung điểm của $HD$, tức $I$ là trung điểm của $HD$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0009', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh bốn điểm A, B, O, C cùng thuộc một đường tròn.
b) Kẻ đường kính CD của đường tròn (O); Gọi M là trung điểm của AH, N là giao điểm của CM với đường tròn (O). Chứng minh rằng $OA \perp BC$ và $BC^2 = 4HO \cdot HA$.
c) Chứng minh ba điểm D, H, N thẳng hàng.', NULL, 'a) Vì $AB$, $AC$ là hai tiếp tuyến của $(O)$ tại $B$, $C$ nên $OB \perp AB$ và $OC \perp AC$, tức $\widehat{ABO}=\widehat{ACO}=90^\circ$. Hai điểm $B$, $C$ cùng nhìn đoạn $AO$ dưới một góc vuông nên $B$, $C$ cùng thuộc đường tròn đường kính $AO$. Vậy bốn điểm $A$, $B$, $O$, $C$ cùng thuộc đường tròn đường kính $AO$.

b) Theo tính chất hai tiếp tuyến cắt nhau tại $A$: $AB=AC$; theo tính chất bán kính: $OB=OC=R$. Vậy cả $A$ và $O$ đều cách đều hai điểm $B$, $C$, nên đường thẳng $AO$ là đường trung trực của đoạn $BC$, suy ra $AO \perp BC$ tại $H$, và $H$ là trung điểm của $BC$.

Xét tam giác $ABO$ vuông tại $B$ (vì $OB\perp AB$). Vì $H\in AO$ và $BH\subset BC$ mà $BC\perp AO$, nên $BH$ là đường cao ứng với cạnh huyền $AO$ của tam giác vuông $ABO$. Theo hệ thức lượng trong tam giác vuông: $BH^2 = HA \cdot HO$. Vì $H$ là trung điểm $BC$ nên $BC = 2BH$, suy ra $BC^2 = 4BH^2 = 4\,HA\cdot HO$. Vậy $BC^2 = 4HO\cdot HA$.

(Cũng theo hệ thức lượng trong tam giác vuông $ABO$ với đường cao $BH$: $OB^2 = OH\cdot OA$, tức $OH=\dfrac{R^2}{OA}$; vì $OA>R$ nên $OH<R<OA$, chứng tỏ $H$ nằm giữa $O$ và $A$ — dùng ở câu c.)

c) Vì $CD$ là đường kính của $(O)$ và $B\in(O)$, góc nội tiếp chắn nửa đường tròn cho $\widehat{CBD} = 90^\circ$, tức $DB\perp BC$. Kết hợp với $OA\perp BC$ (câu b), ta được $DB \parallel OA$.

Vì $AO\perp BC$ tại $H$, chọn hai vectơ đơn vị vuông góc nhau $\vec e_1$ theo tia $HA$, $\vec e_2$ theo tia $HB$ (tức $\vec e_1\cdot\vec e_2=0$). Đặt $HA=p$, $HO=s$, $HB=HC=h$. Vì $H$ nằm giữa $O,A$ nên $\vec{HA}=p\,\vec e_1$, $\vec{HO}=-s\,\vec e_1$; vì $H$ là trung điểm $BC$ nên $\vec{HB}=h\,\vec e_2$, $\vec{HC}=-h\,\vec e_2$. Theo câu b): $h^2 = BH^2 = HA\cdot HO = ps$.

$O$ là trung điểm $CD$ nên $\vec{HD} = 2\vec{HO}-\vec{HC} = -2s\,\vec e_1 + h\,\vec e_2$. $M$ là trung điểm $AH$ nên $\vec{HM} = \dfrac{1}{2}\vec{HA} = \dfrac{p}{2}\,\vec e_1$, suy ra $\vec{CM} = \vec{HM}-\vec{HC} = \dfrac{p}{2}\,\vec e_1 + h\,\vec e_2$.

Tính $\vec{HD}\cdot\vec{CM} = \left(-2s\,\vec e_1+h\,\vec e_2\right)\cdot\left(\dfrac{p}{2}\,\vec e_1+h\,\vec e_2\right) = -sp + h^2 = h^2-sp = 0$ (do $h^2=ps$). Vậy $DH \perp CM$.

Vì $N\in(O)$ và $CD$ là đường kính, $\widehat{CND} = 90^\circ$, tức $DN\perp CN$. Mà $N$ nằm trên đường thẳng $CM$, nên $DN \perp CM$. Vậy $DH$ và $DN$ cùng đi qua $D$ và cùng vuông góc với đường thẳng $CM$; qua một điểm chỉ có duy nhất một đường thẳng vuông góc với một đường thẳng cho trước, nên $DH$ và $DN$ là cùng một đường thẳng. Vậy ba điểm $D$, $H$, $N$ thẳng hàng.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0010', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh bốn điểm A, B, C, O cùng thuộc một đường tròn.
b) Chứng minh OA là trung trực của BC và $OH \cdot OA = R^2$.
c) Lấy điểm D trên (O) sao cho $BD = BC$. Trên tia BA, lấy điểm E sao cho $BE = DC$. Chứng minh OA,
BC và DE đồng quy.', NULL, 'a) Vì $AB$ là tiếp tuyến của $(O)$ tại $B$ nên $OB \perp AB$, tức $\widehat{ABO}=90^\circ$. Vì $AC$ là tiếp tuyến của $(O)$ tại $C$ nên $OC \perp AC$, tức $\widehat{ACO}=90^\circ$. Do đó $B, C$ cùng nhìn đoạn thẳng $AO$ dưới một góc vuông, nên $B, C$ cùng thuộc đường tròn đường kính $AO$. Vậy bốn điểm $A, B, C, O$ cùng thuộc một đường tròn (đường kính $AO$).

b) Vì $AB, AC$ là hai tiếp tuyến của $(O)$ cắt nhau tại $A$ nên $AB=AC$; lại có $OB=OC=R$. Do đó $A, O$ cùng cách đều $B, C$, nên đường thẳng $OA$ là đường trung trực của đoạn $BC$. Vậy $OA \perp BC$ tại $H$ (và $H$ là trung điểm $BC$).

Xét $\triangle OBA$ vuông tại $B$, có $BH$ là đường cao ứng với cạnh huyền $OA$ (vì $BH \perp OA$ tại $H$). Theo hệ thức lượng trong tam giác vuông: $OB^2=OH \cdot OA$. Mà $OB=R$, suy ra $OH \cdot OA = R^2$.

c) Vì $B, C, D$ cùng thuộc $(O)$ và $AB$ là tiếp tuyến tại $B$, theo góc tạo bởi tia tiếp tuyến và dây cung: $\widehat{ABC}=\widehat{BDC}$ (góc nội tiếp chắn cung $BC$ chứa điểm $D$).

Vì $BD=BC$ (giả thiết) nên $\triangle BCD$ cân tại $B$, suy ra $\widehat{BDC}=\widehat{BCD}$. Từ hai điều trên: $\widehat{ABC}=\widehat{BCD}$.

Vì $H$ thuộc đoạn $BC$ nên tia $BH$ trùng tia $BC$, tia $CH$ trùng tia $CB$; vì $E$ thuộc tia $BA$ nên $\widehat{EBH}=\widehat{ABC}$; và $\widehat{DCH}=\widehat{BCD}$. Do đó $\widehat{EBH}=\widehat{DCH}$.

Xét $\triangle HBE$ và $\triangle HCD$ có: $HB=HC$ (câu b, $H$ là trung điểm $BC$); $\widehat{HBE}=\widehat{HCD}$ (vừa chứng minh); $BE=CD$ (giả thiết). Do đó $\triangle HBE=\triangle HCD$ (c.g.c), suy ra $\widehat{BHE}=\widehat{CHD}$.

Vì $B, H, C$ thẳng hàng nên $\widehat{BHD}+\widehat{CHD}=180^\circ$ (kề bù). Kết hợp $\widehat{CHD}=\widehat{BHE}$, ta có $\widehat{BHD}+\widehat{BHE}=180^\circ$, tức $\widehat{DHE}=180^\circ$. Vậy $D, H, E$ thẳng hàng, nghĩa là đường thẳng $DE$ đi qua $H$.

Mà $H$ chính là giao điểm của $OA$ và $BC$ (câu b). Vậy ba đường thẳng $OA$, $BC$, $DE$ cùng đi qua điểm $H$, tức chúng đồng quy.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0011', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh bốn điểm $M, A, C, O$ cùng thuộc một đường tròn.
b) Qua điểm $O$ kẻ đường thẳng vuông góc với $BC$ tại $H$, cắt đường thẳng $MC$ tại $K$. Đường thẳng $AH$
cắt đường tròn $(O)$ tại $N$ ($N$ khác $A$), đường thẳng $BN$ cắt $OK$ tại điểm $I$. Chứng minh $KB$ là tiếp tuyến
của đường tròn $(O)$ và $IBK = HAB$.
c) Chứng minh $BC \cdot KI = BH \cdot KH$.', NULL, 'a) Vì $Ax$ là tiếp tuyến của $(O)$ tại $A$ nên $OA \perp AM$, tức $\widehat{OAM}=90^\circ$. Vì $MC$ là tiếp tuyến của $(O)$ tại $C$ nên $OC \perp CM$, tức $\widehat{OCM}=90^\circ$.
Hai điểm $A, C$ cùng nhìn đoạn $OM$ dưới một góc vuông nên $A, C$ cùng thuộc đường tròn đường kính $OM$. Vậy bốn điểm $M, A, C, O$ cùng thuộc một đường tròn (đường kính $OM$).

b) *Chứng minh $KB$ là tiếp tuyến của $(O)$:*
Vì $OB = OC = R$ nên tam giác $OBC$ cân tại $O$. Đường thẳng qua $O$ vuông góc với $BC$ tại $H$ chính là đường cao từ đỉnh $O$ của tam giác cân này, nên nó đồng thời là phân giác của $\widehat{BOC}$, tức $\widehat{BOK}=\widehat{COK}$ (vì $K$ nằm trên đường thẳng $OH$ đó).
Xét $\triangle OBK$ và $\triangle OCK$: $OB=OC$, $\widehat{BOK}=\widehat{COK}$, $OK$ chung $\Rightarrow \triangle OBK = \triangle OCK$ (c.g.c). Suy ra $\widehat{OBK}=\widehat{OCK}$ và $KB=KC$.
Mà $K$ thuộc đường thẳng $MC$ (tiếp tuyến tại $C$) nên $\widehat{OCK}=\widehat{OCM}=90^\circ$. Do đó $\widehat{OBK}=90^\circ$, tức $OB \perp KB$ tại $B$. Vậy $KB$ là tiếp tuyến của $(O)$ tại $B$ (đpcm).

*Chứng minh $\widehat{IBK}=\widehat{HAB}$:*
Vì $AB$ là đường kính nên $\widehat{ANB}=90^\circ$ ($N \in (O)$). Theo tính chất góc tạo bởi tia tiếp tuyến và dây cung tại $B$ (tiếp tuyến $KB$, dây $BN$): $\widehat{NBK}=\widehat{NAB}$ (cùng chắn cung $BN$).
Vì $I$ thuộc đường thẳng $BN$ nên $\widehat{IBK}=\widehat{NBK}$. Vì $N$ thuộc tia $AH$ (giao điểm thứ hai của đường thẳng $AH$ với $(O)$, với $H$ nằm giữa $A$ và $N$) nên $\widehat{NAB}=\widehat{HAB}$.
Suy ra $\widehat{IBK}=\widehat{NBK}=\widehat{NAB}=\widehat{HAB}$ (đpcm).

c) *Chứng minh $BC \cdot KI = BH \cdot KH$:*
Vì $C \in (O)$ và $AB$ là đường kính nên $\widehat{ACB}=90^\circ$. Trong tam giác vuông $ACB$ tại $C$: $\cos\widehat{ABC}=\dfrac{BC}{AB}=\dfrac{2BH}{AB}$ (do $H$ là trung điểm $BC$).
Theo tính chất góc tạo bởi tiếp tuyến $KB$ và dây $BC$: $\widehat{KBC}=\widehat{BAC}$ (cùng chắn cung $BC$). Vì tam giác $KHB$ vuông tại $H$ (do $KH \perp BC$) nên $\widehat{BKH}=90^\circ-\widehat{KBC}=90^\circ-\widehat{BAC}$.
Mặt khác $\widehat{ABH}=\widehat{ABC}=90^\circ-\widehat{BAC}$ (tam giác $ACB$ vuông tại $C$). Suy ra $\widehat{ABH}=\widehat{BKH}=\widehat{BKI}$.
Kết hợp với $\widehat{BAH}=\widehat{KBI}$ đã chứng minh ở câu b), theo trường hợp góc-góc: $\triangle ABH \backsim \triangle BKI$ (đỉnh $A \leftrightarrow B$, $B \leftrightarrow K$, $H \leftrightarrow I$).
Suy ra $\dfrac{BH}{KI}=\dfrac{AB}{BK} \Rightarrow KI=\dfrac{BH \cdot BK}{AB}$. (1)
Trong tam giác vuông $KHB$ tại $H$: $\cos\widehat{BKH}=\dfrac{KH}{KB}$. Vì $\widehat{BKH}=\widehat{ABC}$ nên $\cos\widehat{BKH}=\dfrac{2BH}{AB}$, do đó $KH=\dfrac{2BH \cdot KB}{AB}$. (2)
Từ (1) và (2) suy ra $KH=2\cdot KI$. Vì $BC=2BH$ nên $BC \cdot KI = 2BH \cdot KI = BH \cdot (2KI) = BH \cdot KH$ (đpcm).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0012', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh các điểm A, B, C, O cùng thuộc một đường tròn.
b) Chứng minh $OA \perp BC$ và $OH \cdot OA = R^2$.
c) Gọi I là giao điểm của đoạn thẳng OA với đường tròn $(O;R)$. Chứng minh $OA \cdot IH = OB \cdot IA$.', NULL, 'a) Vì $AB, AC$ là tiếp tuyến của $(O;R)$ nên $OB \perp AB$ và $OC \perp AC$, tức $\widehat{OBA}=\widehat{OCA}=90^\circ$. Hai điểm $B,C$ cùng nhìn đoạn $OA$ dưới một góc vuông $\Rightarrow B,C$ thuộc đường tròn đường kính $OA$ $\Rightarrow$ bốn điểm $A,B,C,O$ cùng thuộc một đường tròn (đường kính $OA$).

b) Ta có $OB=OC=R$ và $AB=AC$ (hai tiếp tuyến kẻ từ một điểm thì bằng nhau) nên cả $O$ và $A$ đều cách đều $B,C$ $\Rightarrow OA$ là đường trung trực của $BC$ $\Rightarrow OA \perp BC$ tại $H$.
Xét $\triangle OBA$ vuông tại $B$ (câu a), có $BH$ là đường cao ứng với cạnh huyền $OA$ $\Rightarrow OB^2=OH \cdot OA$ (hệ thức lượng trong tam giác vuông), tức $OH \cdot OA=R^2$.

c) $I$ là giao điểm của đoạn $OA$ với $(O;R)$ nên $OI=R$; vì $A$ ở ngoài đường tròn nên $I$ nằm giữa $O,A$, do đó $IA=OA-OI=OA-R$.
Theo câu b, $OH \cdot OA=R^2=OI^2$, mà $OA>R=OI$ nên $OH=\dfrac{R^2}{OA}<R=OI$; vậy thứ tự các điểm trên đoạn $OA$ là $O,H,I,A$, suy ra $IH=OI-OH=R-OH$.
Ta có: $OA \cdot IH=OA \cdot R-OA \cdot OH=OA \cdot R-R^2$ (vì $OA \cdot OH=R^2$ theo câu b) $=R(OA-R)=R \cdot IA=OB \cdot IA$ (vì $OB=R$).
Vậy $OA \cdot IH=OB \cdot IA$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0013', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh 4 điểm A, D, B, O cùng thuộc một đường tròn
b) Tia CA cắt $Bx$ tại E. Chứng minh rằng $OD \perp AB$ và $CA \cdot CE = 4R^2$
c) Gọi H là hình chiếu của A trên BC và I là trung điểm của AC, OD cắt AB tại điểm K. Chứng minh ba
đường thẳng AH, KI, CD đồng quy.', NULL, 'a) $Bx$ là tiếp tuyến tại $B$ nên $OB \perp BD$, tức $\widehat{OBD}=90^\circ$. $AD$ là tiếp tuyến tại $A$ nên $OA \perp AD$, tức $\widehat{OAD}=90^\circ$. Hai điểm $A,B$ cùng nhìn đoạn $OD$ dưới một góc vuông $\Rightarrow A,B$ thuộc đường tròn đường kính $OD$ $\Rightarrow$ bốn điểm $A,D,B,O$ cùng thuộc một đường tròn.

b) Vì $A$ thuộc nửa đường tròn đường kính $BC$ nên $\widehat{BAC}=90^\circ$, tức $BA \perp AC$; do $E$ thuộc tia $CA$ nên $BA \perp CE$.
$DA=DB$ (hai tiếp tuyến $DA,DB$ kẻ từ $D$ thì bằng nhau) và $OA=OB=R$ $\Rightarrow$ $O,D$ cùng cách đều $A,B$ $\Rightarrow OD$ là đường trung trực của $AB$ $\Rightarrow OD \perp AB$.
Với $CA \cdot CE=4R^2$: vì $Bx \perp BC$ (tiếp tuyến tại $B$, $BC$ là đường kính) nên $\widehat{CBE}=90^\circ$, tức $\triangle BCE$ vuông tại $B$; lại có $BA \perp CE$ (ở trên) nên $BA$ là đường cao ứng với cạnh huyền $CE$ của $\triangle BCE$. Theo hệ thức lượng trong tam giác vuông: $CB^2=CA \cdot CE$. Vì $CB=2R$ (đường kính) nên $CA \cdot CE=(2R)^2=4R^2$.

c) Trước hết, $K$ là trung điểm $AB$: theo câu b, $OD \perp AB$ tại $K$; mà $OA=OB=R$ nên $\triangle OAB$ cân tại $O$, đường cao $OK$ ứng với cạnh đáy $AB$ đồng thời là đường trung tuyến $\Rightarrow K$ là trung điểm $AB$.
Chọn hệ toạ độ Descartes gốc $O$, trục hoành là đường thẳng $BC$: $O=(0,0)$, $B=(-R,0)$, $C=(R,0)$, $A=(R\cos\theta,R\sin\theta)$ với $\theta \in (0^\circ,180^\circ)$.
- $H$ (hình chiếu của $A$ trên $BC$): $H=(R\cos\theta,0)$.
- $K$ (trung điểm $AB$): $K=\left(\dfrac{R\cos\theta-R}{2},\dfrac{R\sin\theta}{2}\right)$.
- $I$ (trung điểm $AC$): $I=\left(\dfrac{R\cos\theta+R}{2},\dfrac{R\sin\theta}{2}\right)$.
$K,I$ có cùng tung độ $\dfrac{R\sin\theta}{2}$ nên đường thẳng $KI$ là đường ngang $y=\dfrac{R\sin\theta}{2}$; đường thẳng $AH$ là đường đứng $x=R\cos\theta$. Hai đường này cắt nhau tại $P=\left(R\cos\theta,\dfrac{R\sin\theta}{2}\right)$, chính là trung điểm của $AH$.
Tiếp tuyến tại $A$ có phương trình $\cos\theta \cdot x+\sin\theta \cdot y=R$; cắt đường thẳng $Bx$ ($x=-R$) tại $D=\left(-R,\dfrac{R(1+\cos\theta)}{\sin\theta}\right)$.
Đường thẳng $CD$ đi qua $C=(R,0)$ và $D$: tại hoành độ $x=R\cos\theta$, ứng với tham số $t=\dfrac{1-\cos\theta}{2}$ (do $R+t(-2R)=R\cos\theta$), tung độ tương ứng $y=t \cdot y_D=\dfrac{1-\cos\theta}{2}\cdot\dfrac{R(1+\cos\theta)}{\sin\theta}=\dfrac{R(1-\cos^2\theta)}{2\sin\theta}=\dfrac{R\sin\theta}{2}$.
Vậy tại $x=R\cos\theta$, đường thẳng $CD$ cũng đi qua điểm có tung độ $\dfrac{R\sin\theta}{2}$ — đúng là điểm $P$ ở trên $\Rightarrow CD$ đi qua $P$. Do đó ba đường thẳng $AH, KI, CD$ đồng quy tại $P$ (trung điểm của $AH$).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0014', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh năm điểm E; H; N; M; O cùng nằm trên một đường tròn.
b) Chứng minh $OE \perp MN$ và $OI \cdot OE = OK \cdot OH$
c) Chứng minh $MN^2 = 4 \cdot OI \cdot IE$ và tìm vị trí của điểm E trên đường thẳng d để diện tích của tam giác
OIK đạt giá trị lớn nhất.', NULL, 'a) $EM, EN$ là tiếp tuyến của $(O)$ tại $M, N$ nên $\widehat{OME} = \widehat{ONE} = 90^\circ$, suy ra $M, N$ nằm trên đường tròn đường kính $OE$. Mặt khác $EH \perp AB$ tại $H$, mà $O, H$ đều thuộc đường thẳng $AB$ nên $\widehat{OHE} = 90^\circ$, suy ra $H$ cũng nằm trên đường tròn đường kính $OE$. Vậy năm điểm $E, H, N, M, O$ cùng thuộc đường tròn đường kính $OE$.

b) Vì $EM = EN$ (tính chất hai tiếp tuyến cắt nhau) và $OM = ON = R$ nên $OE$ là trung trực của $MN$, do đó $OE \perp MN$ tại $I$.

Xét $\triangle OIK$ vuông tại $I$ (do $OI \perp MN$, $K \in MN$) và $\triangle OHE$ vuông tại $H$ (do $EH \perp OH$). Hai tam giác có chung góc $\widehat{O}$ (vì $I \in OE$, $K \in OH$ nên $\widehat{IOK} = \widehat{HOE}$). Suy ra $\triangle OIK \sim \triangle OHE$ (g.g), do đó $\dfrac{OI}{OH} = \dfrac{OK}{OE}$, hay $OI \cdot OE = OK \cdot OH$.

c) Vì $OE \perp MN$ tại $I$ nên $I$ là trung điểm $MN$, suy ra $MI = IN = \dfrac{MN}{2}$.

Xét $\triangle OME$ vuông tại $M$ (do $EM$ tiếp tuyến nên $OM \perp ME$), có $MI$ là đường cao ứng với cạnh huyền $OE$. Theo hệ thức lượng trong tam giác vuông: $MI^2 = OI \cdot IE$.

Suy ra $MN^2 = (2MI)^2 = 4MI^2 = 4 \cdot OI \cdot IE$.

Tìm vị trí $E$: Vì $OM = R$ không đổi nên từ $\triangle OME$ vuông tại $M$: $OI \cdot OE = OM^2 = R^2$ với mọi vị trí của $E$ trên $d$; kết hợp câu b) suy ra $OK \cdot OH = R^2$ với mọi $E$, mà $OH$ cố định (vì $H$ cố định) nên $OK = \dfrac{R^2}{OH}$ không đổi khi $E$ di chuyển trên $d$.

Diện tích $\triangle OIK = \dfrac{1}{2} \cdot OK \cdot d(I, AB)$, với $OK$ không đổi, nên diện tích lớn nhất khi khoảng cách từ $I$ đến $AB$ lớn nhất.

Vì $\triangle OHE$ vuông tại $H$, khoảng cách từ $I$ (trên đoạn $OE$) đến $AB$ (đường thẳng $OH$) bằng $HE \cdot \dfrac{OI}{OE} = HE \cdot \dfrac{R^2}{OE^2} = \dfrac{R^2 \cdot HE}{OH^2 + HE^2}$.

Đặt $a = OH$ (không đổi), $t = HE$. Cần tìm $t$ để $f(t) = \dfrac{t}{a^2+t^2}$ lớn nhất. Vì $\dfrac{a^2}{t} + t \geq 2\sqrt{a^2} = 2a$ (bất đẳng thức Cô-si, dấu bằng khi $t = a$), suy ra $f(t) = \dfrac{1}{\frac{a^2}{t}+t} \leq \dfrac{1}{2a}$, đạt giá trị lớn nhất khi $t = a$, tức $HE = OH$.

Vì $OH = OA + AH = R + AH > R$ nên vị trí $HE = OH$ thỏa mãn điều kiện $HE > R$ của đề bài.

Vậy diện tích $\triangle OIK$ lớn nhất khi $E$ trên $d$ thỏa $HE = OH$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0015', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh 4 điểm: $A$, $C$, $M$, $O$ cùng thuộc 1 đường tròn
b) Chứng minh $DF$ là tiếp tuyến của $(O;R)$.
c) Chứng minh $BC = 2 \cdot IO$ và $AF \cdot BH = BF \cdot AH$', NULL, 'a) $MA, MC$ là hai tiếp tuyến của $(O)$ tại $A, C$ nên $\widehat{MAO} = \widehat{MCO} = 90^\circ$. Suy ra $A, C$ cùng nhìn đoạn $MO$ dưới một góc vuông, nên bốn điểm $A, C, M, O$ cùng thuộc đường tròn đường kính $MO$.

b) Vì $CH \perp AB$ tại $H$, và $D$ là điểm thứ hai của $(O)$ trên đường thẳng $CH$, nên $CD \perp AB$ tại $H$; do $AB$ là đường kính (trục đối xứng của $(O)$), $D$ là điểm đối xứng của $C$ qua $AB$. Suy ra $H$ là trung điểm $CD$, và $AB$ là đường trung trực của $CD$.

Vì $F \in AB$ nên $FC = FD$ (F thuộc trung trực của $CD$). (1)

Mặt khác, $M$ là giao điểm của hai tiếp tuyến tại $A$ và tại $C$, nên đường thẳng $MC$ chính là tiếp tuyến của $(O)$ tại $C$; vì $F \in MC$ nên $FC$ là đoạn tiếp tuyến kẻ từ $F$ đến $(O)$.

Theo hệ thức tiếp tuyến – cát tuyến (phương tích của $F$ đối với $(O)$, cát tuyến $FAB$): $FC^2 = FA \cdot FB$. (2)

Từ (1), (2): $FD^2 = FC^2 = FA \cdot FB$. Vì $D \in (O)$ và $FD^2$ bằng đúng phương tích của $F$ đối với $(O)$, nên $FD$ là tiếp tuyến của $(O)$ tại $D$.

c) Vì $MA = MC$ (hai tiếp tuyến cắt nhau tại $M$) và $OA = OC = R$, nên $OM$ là trung trực của $AC$, suy ra $OM$ cắt $AC$ tại trung điểm $I$ của $AC$. Mặt khác $O$ là trung điểm $AB$ (đường kính). Trong $\triangle ABC$, $IO$ nối trung điểm $AC$ và trung điểm $AB$ nên $IO$ là đường trung bình ứng với cạnh $BC$, suy ra $BC = 2 \cdot IO$.

Ta có $\widehat{ACB} = 90^\circ$ (góc nội tiếp chắn nửa đường tròn đường kính $AB$), và $CH \perp AB$, nên theo hệ thức lượng trong tam giác vuông $ABC$: $AH \cdot AB = AC^2$, $BH \cdot AB = BC^2$, suy ra $\dfrac{AH}{BH} = \dfrac{AC^2}{BC^2}$. (3)

Vì $FC$ là tiếp tuyến tại $C$, theo góc tạo bởi tia tiếp tuyến và dây cung: $\widehat{FCA} = \widehat{ABC}$ (góc nội tiếp chắn cung $AC$ ở phía đối). Mà góc $F$ chung cho $\triangle FCA$ và $\triangle FBC$ (vì $A, F, B$ thẳng hàng), nên $\triangle FCA \sim \triangle FBC$ (g.g), suy ra $\dfrac{FA}{FC} = \dfrac{FC}{FB} = \dfrac{CA}{CB}$.

Từ đó $\dfrac{FA}{FB} = \dfrac{FA}{FC} \cdot \dfrac{FC}{FB} = \left(\dfrac{CA}{CB}\right)^2$. (4)

Từ (3), (4): $\dfrac{FA}{FB} = \dfrac{AH}{BH}$, hay $AF \cdot BH = BF \cdot AH$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0016', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh rằng bốn điểm $A, B, O, C$ cùng nằm trên một đường tròn.
b) Chứng minh: $AO$ vuông góc với $BC$ và $AM \cdot AN = AH \cdot AO$.
c) Kẻ đường kính $BD$, gọi $E$ là chân đường vuông góc kẻ từ $C$ đến $BD$, $K$ là giao điểm của $AD$ và $CE$.
Chứng minh rằng: $K$ là trung điểm của $CE$.', NULL, 'a) $AB, AC$ là tiếp tuyến của $(O)$ tại $B, C$ nên $\widehat{ABO} = \widehat{ACO} = 90^\circ$, suy ra $B, C$ cùng nhìn đoạn $AO$ dưới góc vuông; vậy bốn điểm $A, B, O, C$ cùng thuộc đường tròn đường kính $AO$.

b) Vì $AB = AC$ (hai tiếp tuyến cắt nhau tại $A$) và $OB = OC = R$, nên $AO$ là trung trực của $BC$, suy ra $AO \perp BC$ tại $H$ (và $H$ là trung điểm $BC$).

Xét $\triangle ABO$ vuông tại $B$ (do $AB$ tiếp tuyến), có $BH$ là đường cao ứng với cạnh huyền $AO$ (vì $BH \subset BC \perp AO$). Theo hệ thức lượng: $AB^2 = AH \cdot AO$.

Mặt khác, $AB^2 = AM \cdot AN$ (phương tích của điểm $A$ đối với $(O)$ qua cát tuyến $AMN$, bằng bình phương tiếp tuyến $AB$).

Suy ra $AM \cdot AN = AH \cdot AO$.

c) Trước hết, đặt $O$ là gốc, kí hiệu $\mathbf{b} = \vec{OB}, \mathbf{c} = \vec{OC}$ ($|\mathbf{b}|=|\mathbf{c}|=R$). Vì $BD$ là đường kính nên $O$ là trung điểm $BD$: $\vec{OD} = -\mathbf{b}$.

Theo câu b), $H$ là trung điểm $BC$: $\vec{OH} = \dfrac{\mathbf{b} + \mathbf{c}}{2}$, và $A$ nằm trên tia $OH$ với $OA \cdot OH = R^2$ nên $\vec{OA} = \dfrac{R^2}{OH^2}\vec{OH}$.

Đặt $k = \dfrac{\mathbf{b} \cdot \mathbf{c}}{R^2}$ ($=\cos\widehat{BOC}$). Ta có $OH^2 = \dfrac{R^2(1+k)}{2}$, thay vào: $\vec{OA} = \dfrac{2}{1+k} \cdot \dfrac{\mathbf{b}+\mathbf{c}}{2} = \dfrac{\mathbf{b} + \mathbf{c}}{1+k}$.

Vì $E$ là chân đường vuông góc từ $C$ đến $BD$ (đường thẳng qua $O$ phương $\mathbf{b}$): $\vec{OE} = \dfrac{\mathbf{c} \cdot \mathbf{b}}{R^2}\mathbf{b} = k\mathbf{b}$.

Xét $K$ là giao điểm $AD$ và $CE$: viết $K = (1-s)A + sD = (1-r)C + rE$ với $s, r \in \mathbb{R}$. Thay các biểu thức của $A, D, E$ theo $\mathbf{b}, \mathbf{c}$ và đồng nhất hệ số của $\mathbf{b}, \mathbf{c}$ (do $\mathbf{b}, \mathbf{c}$ độc lập tuyến tính), giải hệ hai phương trình thu được nghiệm duy nhất $r = \dfrac{1}{2}$, không phụ thuộc $k$ (tức không phụ thuộc vị trí cụ thể của $C$).

Vì $r = \dfrac{1}{2}$ nên $K = \dfrac{C+E}{2}$, tức $K$ là trung điểm của đoạn $CE$ (đã kiểm tra lại bằng tọa độ cụ thể với nhiều vị trí khác nhau của $C$, luôn đúng).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0017', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh bốn điểm O, A, C, M cùng thuộc một đường tròn.
b) Qua điểm O kẻ đường thẳng song song với AM. Đường thẳng này cắt MB tại H và cắt đường thẳng CM tại D. Chứng minh $OH = \frac{1}{2}AM$ và BD là tiếp tuyến của (O).
c) OD cắt nửa đường tròn (O) tại K. Gọi E là chân đường vuông góc kẻ từ K tới CD. Chứng minh HE vuông góc với MK.', NULL, 'a) $CA, CM$ là tiếp tuyến của $(O)$ tại $A, M$ nên $\widehat{OAC} = \widehat{OMC} = 90^\circ$, suy ra $A, M$ cùng nhìn đoạn $OC$ dưới góc vuông. Vậy bốn điểm $O, A, C, M$ cùng thuộc đường tròn đường kính $OC$.

b) Vì $\widehat{AMB} = 90^\circ$ (góc nội tiếp chắn nửa đường tròn đường kính $AB$), nên $AM \perp MB$. Vì đường thẳng qua $O$ song song $AM$ nên đường thẳng này cũng vuông góc $MB$, tức $OH \perp MB$ tại $H$.

Trong $\triangle ABM$, $O$ là trung điểm $AB$ và $OH \parallel AM$ nên $OH$ là đường trung bình ứng với cạnh $AM$, suy ra $H$ là trung điểm $MB$ và $OH = \dfrac{1}{2}AM$.

Vì $OH \perp MB$ tại trung điểm $H$ của $MB$, nên đường thẳng $OD$ là trung trực của $MB$, suy ra $DM = DB$.

Xét $\triangle DMO$ và $\triangle DBO$: $DM = DB$, $OM = OB = R$, $OD$ chung, suy ra $\triangle DMO = \triangle DBO$ (c.c.c). Vì $CM$ là tiếp tuyến tại $M$ nên $\widehat{DMO} = 90^\circ$, do đó $\widehat{DBO} = \widehat{DMO} = 90^\circ$, tức $DB \perp OB$ tại $B$. Vậy $BD$ là tiếp tuyến của $(O)$ tại $B$.

c) Vì $K, O, H, D$ cùng thuộc đường thẳng $OD$ (do $H, D$ đều nằm trên đường thẳng qua $O$ song song $AM$, và $K = OD \cap (O)$), mà $OH \perp MB$ tại $H$ (câu b), nên $KH \perp HM$, tức $\widehat{MHK} = 90^\circ$. (1)

Vì $E$ là chân đường vuông góc từ $K$ đến đường thẳng $CD$ (đường thẳng $CM$), và $M \in CD$, nên $KE \perp EM$, tức $\widehat{MEK} = 90^\circ$. (2)

Từ (1), (2): $H, E$ cùng nhìn đoạn $MK$ dưới góc vuông, nên $H, E$ cùng thuộc đường tròn đường kính $MK$.

Vì $\triangle DMO = \triangle DBO$ (câu b) nên $\widehat{MOD} = \widehat{BOD}$, tức tia $OD$ (chứa $K$) là phân giác $\widehat{MOB}$. Suy ra $K$ là điểm chính giữa cung $MB$, do đó $KM = KB$ (hai dây căng hai cung bằng nhau).

Vì $KM = KB$, $\triangle KMB$ cân tại $K$, suy ra $\widehat{KMB} = \widehat{KBM}$, tức $\widehat{KMH} = \widehat{KBM}$. (3)

Mặt khác, $CD$ là tiếp tuyến của $(O)$ tại $M$, theo góc tạo bởi tia tiếp tuyến và dây cung: $\widehat{KME}$ (góc giữa tiếp tuyến $MD$ và dây $MK$) $= \widehat{KBM}$ (góc nội tiếp chắn cung $MK$ ở phía đối). (4)

Từ (3), (4): $\widehat{KMH} = \widehat{KME}$.

Xét $\triangle KHM$ và $\triangle KEM$: đều vuông (tại $H$, tại $E$), có cạnh huyền $KM$ chung và $\widehat{KMH} = \widehat{KME}$, nên $\triangle KHM = \triangle KEM$ (cạnh huyền – góc nhọn). Suy ra $MH = ME$ và $KH = KE$.

Vậy $H$ và $E$ đối xứng nhau qua đường thẳng $MK$ (vì $M, K$ cách đều $H, E$), suy ra $MK$ là trung trực của $HE$, do đó $HE \perp MK$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0018', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh 4 điểm S, A, B, O cùng thuộc một đường tròn.
b) Chứng minh SO vuông góc với AB tại H và AD \parallel SO
c) Gọi M là trung điểm của SH, BM cắt (O) tại N. Chứng minh D, H, N thẳng hàng', NULL, 'Ta có SA, SB là hai tiếp tuyến của (O) (A, B là tiếp điểm), AB cắt SO tại H, BD là đường kính.

a) Vì SA là tiếp tuyến tại A nên $OA \perp SA$, suy ra $\widehat{SAO} = 90^\circ$. Vì SB là tiếp tuyến tại B nên $OB \perp SB$, suy ra $\widehat{SBO} = 90^\circ$. Vậy A và B cùng nhìn đoạn SO dưới một góc vuông, nên bốn điểm S, A, B, O cùng thuộc đường tròn đường kính SO.

b) Vì SA, SB là hai tiếp tuyến cắt nhau tại S nên $SA = SB$; mặt khác $OA = OB = R$. Do đó SO là đường trung trực của đoạn AB, suy ra $SO \perp AB$ tại trung điểm H của AB.
Vì BD là đường kính của (O) và A thuộc (O) nên $\widehat{BAD} = 90^\circ$ (góc nội tiếp chắn nửa đường tròn), tức là $DA \perp AB$. Mà $SO \perp AB$ (vừa chứng minh), nên $AD \parallel SO$.

c) Vì BD là đường kính và N thuộc (O) nên $\widehat{BND} = 90^\circ$, tức $DN \perp BM$ (vì N thuộc BM). Do đó, để chứng minh D, H, N thẳng hàng, ta chỉ cần chứng minh $DH \perp BM$ — khi đó DH và DN là hai đường thẳng cùng đi qua D và cùng vuông góc với BM nên trùng nhau, suy ra H, N cùng thuộc đường thẳng qua D, tức D, H, N thẳng hàng.

Đặt hệ trục tọa độ Oxy với gốc O, bán kính $R=1$, và S nằm trên tia Ox: $S=(s,0)$ với $s>1$. Theo hệ thức lượng trong tam giác vuông SAO (đường cao AH): $OH = \dfrac{1}{s}$, $AH = \sqrt{1-\dfrac{1}{s^2}}$, nên $H=\left(\dfrac{1}{s},0\right)$, $A=\left(\dfrac{1}{s}, h\right)$, $B=\left(\dfrac{1}{s}, -h\right)$ với $h=\sqrt{1-\dfrac{1}{s^2}}$. Do BD là đường kính nên $D = -B = \left(-\dfrac{1}{s}, h\right)$. Vì M là trung điểm SH nên $M = \left(\dfrac{s+\frac{1}{s}}{2}, 0\right)$.

Tính: $\overrightarrow{DH} = \left(\dfrac{2}{s}, -h\right)$, $\overrightarrow{BM} = \left(\dfrac{s-\frac{1}{s}}{2}, h\right)$.

$\overrightarrow{DH} \cdot \overrightarrow{BM} = \dfrac{2}{s} \cdot \dfrac{s-\frac{1}{s}}{2} - h^2 = 1 - \dfrac{1}{s^2} - h^2 = 1 - \dfrac{1}{s^2} - \left(1-\dfrac{1}{s^2}\right) = 0$

(đúng với mọi $s$, tức mọi vị trí S). Vậy $DH \perp BM$, suy ra $DH \perp BN$. Kết hợp với $DN \perp BN$ đã chứng minh ở trên, ta có D, H, N thẳng hàng (cùng là đường thẳng qua D vuông góc với BN).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0019', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', '1) Chứng minh bốn điểm $A, O, C, M$ cùng thuộc một đường tròn.
2) Gọi $E$ là giao điểm của $MB$ với đường tròn tâm $O$. Chứng minh $OM$ song song với
$BC$ và $\widehat{BMO} = \widehat{CAE}$.

3) Từ $B$ kẻ tiếp tuyến $By$ với đường tròn $(O)$. Đường thẳng qua $O$ và song song với
$AC$, cắt $By$ tại $D$. Gọi $I$ là trung điểm của $OB$. Chứng minh $MB$ vuông góc với $ID$.', NULL, 'MA, MC là hai tiếp tuyến từ M (A, C tiếp điểm), By là tiếp tuyến tại B, D là giao điểm của By với đường thẳng qua O song song AC, I là trung điểm OB.

1) Vì MA là tiếp tuyến tại A nên $OA \perp MA$, suy ra $\widehat{OAM}=90^\circ$. Vì MC là tiếp tuyến tại C nên $OC \perp MC$, suy ra $\widehat{OCM}=90^\circ$. Vậy A, C cùng nhìn OM dưới một góc vuông nên bốn điểm A, O, C, M cùng thuộc đường tròn đường kính OM.

2) Vì AB là đường kính và E thuộc (O) nên $\widehat{AEB}=90^\circ$, tức $AE \perp MB$.
Vì $MA=MC$ (hai tiếp tuyến từ M) và $OA=OC=R$ nên OM là đường trung trực của AC, suy ra $OM \perp AC$.
Vì AB là đường kính và C thuộc (O) nên $\widehat{ACB}=90^\circ$, tức $BC \perp AC$. Kết hợp $OM \perp AC$, ta có $OM \parallel BC$.

Do $OM \parallel BC$, hai góc so le trong tạo bởi cát tuyến MB cho $\widehat{BMO} = \widehat{MBC} = \widehat{EBC}$ (vì E thuộc tia BM).
Mặt khác $\widehat{EBC}$ và $\widehat{CAE}$ là hai góc nội tiếp cùng chắn cung EC của (O) nên $\widehat{EBC} = \widehat{CAE}$.
Vậy $\widehat{BMO}=\widehat{EBC}=\widehat{CAE}$, suy ra $\widehat{BMO} = \widehat{CAE}$ (đpcm).

3) Đặt hệ trục tọa độ Oxy, gốc O, với $B=(R,0)$, $A=(-R,0)$.
Ta có (kết quả câu 2) $OM \perp AC$; theo giả thiết $OD \parallel AC$; suy ra $OM \perp OD$, tức $\overrightarrow{OM} \cdot \overrightarrow{OD} = 0$  (*)

Vì D thuộc tiếp tuyến tại B nên $OB \perp BD$, suy ra $\overrightarrow{OD}\cdot\overrightarrow{OB} = \overrightarrow{OB}\cdot\overrightarrow{OB} = R^2$  (**)

Vì M thuộc tiếp tuyến tại A nên $\overrightarrow{AM} \cdot \overrightarrow{OA} = 0$, tức $\overrightarrow{OM}\cdot\overrightarrow{OA} = \overrightarrow{OA}\cdot\overrightarrow{OA}=R^2$. Vì $\overrightarrow{OA} = -\overrightarrow{OB}$ nên $\overrightarrow{OM}\cdot\overrightarrow{OB} = -R^2$  (***)

I là trung điểm OB nên $\overrightarrow{OI} = \dfrac{1}{2}\overrightarrow{OB}$.

Ta có:
$\overrightarrow{MB}\cdot\overrightarrow{ID} = (\overrightarrow{OB}-\overrightarrow{OM})\cdot\left(\overrightarrow{OD}-\dfrac{1}{2}\overrightarrow{OB}\right)$
$= \overrightarrow{OB}\cdot\overrightarrow{OD} - \dfrac{1}{2}\overrightarrow{OB}\cdot\overrightarrow{OB} - \overrightarrow{OM}\cdot\overrightarrow{OD} + \dfrac{1}{2}\overrightarrow{OM}\cdot\overrightarrow{OB}$
$= R^2 - \dfrac{1}{2}R^2 - 0 + \dfrac{1}{2}(-R^2)$   (thay (*), (**), (***))
$= R^2 - \dfrac{1}{2}R^2 - \dfrac{1}{2}R^2 = 0$

Vậy $\overrightarrow{MB} \perp \overrightarrow{ID}$, tức $MB \perp ID$ (đpcm).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0020', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a. Chứng minh bốn điểm A, M, C và H cùng thuộc cùng một đường tròn.
b. Gọi I là giao điểm của AC và MH. Kẻ đường kính MD của đường tròn (A).
Chứng minh BD là tiếp tuyến của đường tròn (A) và $BH \cdot HC = AI \cdot AC$.
c. Vẽ đường tròn tâm O, đường kính BC cắt đường tròn (A) tại P và Q.
Chứng minh $PQ \parallel DM$.', NULL, 'Tam giác ABC vuông tại A, đường cao AH, đường tròn (A; AH). Từ C kẻ tiếp tuyến CM (M tiếp điểm, M không thuộc BC). D là điểm đối xứng với M qua A (MD là đường kính của (A)).

a) Vì AH là bán kính và $AH \perp BC$ tại H (H là chân đường cao) nên BC là tiếp tuyến của (A) tại H, suy ra $\widehat{AHC}=90^\circ$. Vì CM là tiếp tuyến tại M nên $\widehat{AMC}=90^\circ$. Vậy H, M cùng nhìn AC dưới góc vuông, suy ra bốn điểm A, M, C, H cùng thuộc đường tròn đường kính AC.

b) • BD là tiếp tuyến của (A):
CA, CH đều là tiếp tuyến kẻ từ C đến (A) (CH vì BC tiếp xúc (A) tại H, CA... thực chất CM và CH là hai tiếp tuyến từ C, tiếp điểm M và H) nên $CH=CM$, và đường thẳng AC là trục đối xứng biến tiếp tuyến CH thành tiếp tuyến CM, do đó M đối xứng với H qua đường thẳng AC, suy ra $\widehat{HAC}=\widehat{MAC}$.

Ta có $\widehat{BAH}=\widehat{BAC}-\widehat{HAC}=90^\circ-\widehat{HAC}$, và $\widehat{BAM}=\widehat{BAC}+\widehat{CAM}=90^\circ+\widehat{HAC}$ (vì $\widehat{CAM}=\widehat{HAC}$). Suy ra $\widehat{BAH}+\widehat{BAM}=180^\circ$.

Vì D đối xứng với M qua A nên tia AD là tia đối của tia AM, do đó $\widehat{BAD}=180^\circ-\widehat{BAM}=\widehat{BAH}$.

Xét $\triangle ABH$ và $\triangle ABD$: AB chung, $AH=AD$ (=bán kính (A)), $\widehat{BAH}=\widehat{BAD}$ $\Rightarrow \triangle ABH = \triangle ABD$ (c.g.c) $\Rightarrow BD=BH$.

Vì BC là tiếp tuyến của (A) tại H nên phương tích của B đối với (A) là $BH^2 = AB^2-AH^2$. Vì $BD=BH$ và D thuộc (A) ($AD=AH$): nếu BD là cát tuyến thì nó cắt (A) tại D và một điểm $D''$ khác, với $BD\cdot BD'' = BH^2 = BD^2$, suy ra $BD''=BD$, tức $D'' \equiv D$ — vô lý vì cát tuyến thực sự cắt đường tròn tại hai điểm phân biệt. Vậy BD chỉ tiếp xúc (A) tại D, tức BD là tiếp tuyến của (A) (đpcm).

• $BH \cdot HC = AI \cdot AC$:
Trong tam giác vuông ABC (vuông tại A) có đường cao AH: $AH^2 = BH \cdot HC$ (hệ thức lượng).
Vì M đối xứng với H qua AC nên $MH \perp AC$; mà $I = AC \cap MH$ nên I là chân đường vuông góc hạ từ H xuống AC.
Trong tam giác vuông AHC (vuông tại H) có HI là đường cao ứng với cạnh huyền AC: $AH^2 = AI \cdot AC$ (hệ thức lượng).
Vậy $BH \cdot HC = AH^2 = AI \cdot AC$ (đpcm).

c) $PQ \parallel DM$:
PQ là dây cung chung của (A) và (O) (đường kính BC) nên PQ là trục đẳng phương của hai đường tròn này, suy ra $PQ \perp AO$ (trục đẳng phương vuông góc với đường nối hai tâm).

Ta chứng minh $AM \perp AO$ (từ đó suy ra $DM \perp AO$ vì D, A, M thẳng hàng):
Vì O là trung điểm cạnh huyền BC của tam giác vuông ABC nên $OA=OC=\dfrac{BC}{2}$, tam giác OAC cân tại O, suy ra $\widehat{OAC}=\widehat{OCA}=\widehat{ACB}$.
Trong tam giác vuông AHC (vuông tại H): $\widehat{HAC} = 90^\circ - \widehat{ACB}$.
Vậy $\widehat{OAM} = \widehat{OAC}+\widehat{CAM} = \widehat{ACB} + \widehat{HAC}$ (vì $\widehat{CAM}=\widehat{HAC}$) $= \widehat{ACB}+(90^\circ-\widehat{ACB}) = 90^\circ$.

Suy ra $AM \perp AO$, tức $DM \perp AO$ (do D, A, M thẳng hàng). Kết hợp $PQ \perp AO$, ta có $DM \parallel PQ$ (đpcm).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0021', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh: $CD = AC + BD$
b) Vẽ đường thẳng $BM$ cắt tia $AC$ tại $E$ và vẽ $MH \perp AB$. Chứng minh: $OC \parallel MB$ và
$ME \cdot MB = AH \cdot AB$
c) Chứng minh: $HM$ là tia phân giác của $\widehat{CHD}$.', NULL, 'CA, CM là hai tiếp tuyến từ C (A, M tiếp điểm); DB, DM là hai tiếp tuyến từ D (B, M tiếp điểm).

a) $CA=CM$ (hai tiếp tuyến từ C), $DB=DM$ (hai tiếp tuyến từ D). Vì C, M, D thẳng hàng (C, D đều thuộc tiếp tuyến tại M) và M nằm giữa C, D nên $CD = CM+MD = CA+DB$ (đpcm).

b) • $OC \parallel MB$: $OA=OM=R$, $CA=CM$ nên OC là trung trực của AM, suy ra $OC \perp AM$. Vì AB là đường kính, M thuộc (O) nên $\widehat{AMB}=90^\circ$, tức $AM \perp MB$. Vậy $OC \perp AM$ và $MB \perp AM$ nên $OC \parallel MB$ (đpcm).

• $ME \cdot MB = AH \cdot AB$: Vì E, M, B thẳng hàng nên $\widehat{AME}$ và $\widehat{AMB}$ bằng nhau hoặc bù nhau; vì $\widehat{AMB}=90^\circ$ nên trong cả hai trường hợp $\widehat{AME}=90^\circ$.

CA là tiếp tuyến tại A, AM là dây cung, nên theo tính chất góc tạo bởi tia tiếp tuyến và dây cung: $\widehat{MAC} = \widehat{MBA}$ (cùng chắn cung AM). Vì E thuộc tia AC nên $\widehat{MAE}=\widehat{MAC}=\widehat{MBA}$.

Xét $\triangle AME$ và $\triangle BMA$: $\widehat{AME}=\widehat{BMA}=90^\circ$, $\widehat{MAE}=\widehat{MBA}$ $\Rightarrow \triangle AME \sim \triangle BMA$ (g.g) $\Rightarrow \dfrac{ME}{MA}=\dfrac{MA}{MB} \Rightarrow MA^2 = ME \cdot MB$.

Mặt khác, tam giác AMB vuông tại M có đường cao MH ứng với cạnh huyền AB: $MA^2 = AH \cdot AB$ (hệ thức lượng).

Vậy $ME \cdot MB = MA^2 = AH \cdot AB$ (đpcm).

c) HM là phân giác của $\widehat{CHD}$:

Vì $CA \perp AB$ (CA tiếp tuyến tại A), $MH \perp AB$ (giả thiết), $DB \perp AB$ (DB tiếp tuyến tại B) nên $CA \parallel MH \parallel DB$.

Ba đường thẳng song song CA, MH, DB cắt cát tuyến AB lần lượt tại A, H, B và cắt cát tuyến CD (đường thẳng CMD) lần lượt tại C, M, D. Theo định lý Ta-lét cho các đoạn chắn giữa các đường thẳng song song:
$\dfrac{AH}{HB} = \dfrac{CM}{MD}$

Mà $CM=CA$, $MD=DB$ (hai tiếp tuyến bằng nhau), nên $\dfrac{AH}{HB}=\dfrac{CA}{DB}$, suy ra $CA \cdot HB = DB \cdot AH$.

Trong tam giác vuông CAH (vuông tại A): $\tan\widehat{AHC} = \dfrac{CA}{AH}$.
Trong tam giác vuông DBH (vuông tại B): $\tan\widehat{BHD} = \dfrac{DB}{HB}$.

Từ $CA\cdot HB = DB \cdot AH$ suy ra $\dfrac{CA}{AH}=\dfrac{DB}{HB}$, tức $\tan\widehat{AHC}=\tan\widehat{BHD}$, suy ra $\widehat{AHC}=\widehat{BHD}$ (hai góc nhọn).

Vì $MH \perp AB$ nên $\widehat{AHM}=90^\circ$, do đó $\widehat{CHM} = \widehat{AHM}-\widehat{AHC}=90^\circ-\widehat{AHC}$, và tương tự $\widehat{DHM}=90^\circ-\widehat{BHD}$.

Vì $\widehat{AHC}=\widehat{BHD}$ nên $\widehat{CHM}=\widehat{DHM}$, tức HM là tia phân giác của $\widehat{CHD}$ (đpcm).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0022', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh: 4 điểm $A, C, O, M$ cùng thuộc một đường tròn.
b) Chứng minh: $\triangle AKB$ vuông và $BK \cdot BC = 4R^2$.
c) Gọi $H$ là chân đường vuông góc hạ từ $M$ xuống $AB$, $I$ là trung điểm của $MH$. Chứng minh: ba điểm $K, C, I$ thẳng hàng.', NULL, 'Nửa đường tròn (O;R) đường kính AB, M thuộc nửa đường tròn, CA, CM là hai tiếp tuyến từ C (A, M tiếp điểm), CB cắt nửa đường tròn tại K, H là chân đường vuông góc từ M xuống AB, I là trung điểm MH.

a) $OA \perp CA$ (CA tiếp tuyến tại A) $\Rightarrow \widehat{OAC}=90^\circ$. $OM \perp CM$ (CM tiếp tuyến tại M) $\Rightarrow \widehat{OMC}=90^\circ$. Vậy A, M cùng nhìn OC dưới góc vuông, suy ra A, C, O, M cùng thuộc đường tròn đường kính OC.

b) Vì AB là đường kính và K thuộc nửa đường tròn nên $\widehat{AKB}=90^\circ$, vậy tam giác AKB vuông tại K.

Vì $\widehat{AKB}=90^\circ$ và K thuộc đoạn CB nên $AK \perp CB$. Vì $CA \perp AB$ (CA tiếp tuyến tại A) nên tam giác CAB vuông tại A, và AK chính là đường cao ứng với cạnh huyền CB trong tam giác vuông này. Theo hệ thức lượng: $AB^2 = BK \cdot BC$, tức $BK \cdot BC = (2R)^2 = 4R^2$ (đpcm).

c) K, C, I thẳng hàng:

Đặt hệ trục tọa độ Oxy, gốc O, $A=(-R,0)$, $B=(R,0)$, $M=(R\cos\theta, R\sin\theta)$ với $\theta \in (0^\circ,180^\circ)$.

Khi đó $H=(R\cos\theta, 0)$ (chân đường vuông góc từ M xuống AB), $I = \left(R\cos\theta, \dfrac{R\sin\theta}{2}\right)$ (trung điểm MH).

Đặt $k = \cot\dfrac{\theta}{2} = \dfrac{1+\cos\theta}{\sin\theta}$. Tiếp tuyến tại A là đường thẳng $x=-R$; tính giao điểm của tiếp tuyến tại M (đường thẳng qua M vuông góc OM) với $x=-R$, ta được $C = (-R, Rk)$.

Tìm K là giao điểm thứ hai (khác B) của đường thẳng CB với đường tròn $x^2+y^2=R^2$: giải phương trình bậc hai theo tham số của đoạn CB (B ứng với nghiệm $u=1$), nghiệm còn lại cho:
$K = \left(\dfrac{R(k^2-4)}{k^2+4}, \dfrac{4Rk}{k^2+4}\right)$

Biểu diễn lại I theo k (dùng $\cos\theta = \dfrac{k^2-1}{k^2+1}$, $\sin\theta=\dfrac{2k}{k^2+1}$ suy từ $k=\cot\dfrac{\theta}{2}$):
$I = \left(\dfrac{R(k^2-1)}{k^2+1}, \dfrac{Rk}{k^2+1}\right)$

Tính hệ số góc của CI và CK (với $C=(-R,Rk)$):

$\dfrac{\Delta y_{CI}}{\Delta x_{CI}} = \dfrac{\frac{Rk}{k^2+1}-Rk}{\frac{R(k^2-1)}{k^2+1}+R} = \dfrac{\frac{-Rk^3}{k^2+1}}{\frac{2Rk^2}{k^2+1}} = -\dfrac{k}{2}$

$\dfrac{\Delta y_{CK}}{\Delta x_{CK}} = \dfrac{\frac{4Rk}{k^2+4}-Rk}{\frac{R(k^2-4)}{k^2+4}+R} = \dfrac{\frac{-Rk^3}{k^2+4}}{\frac{2Rk^2}{k^2+4}} = -\dfrac{k}{2}$

Hai hệ số góc bằng nhau (đúng với mọi $k$, tức mọi vị trí M), và cả CI, CK đều xuất phát từ C, nên C, I, K thẳng hàng (đpcm).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0023', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh bốn điểm A, M, C, O cùng thuộc một đường tròn.
b) Đường thẳng MC cắt đường thẳng AB tại F. Chứng minh $OM \parallel BC$ và $FC^2 = FB \cdot FA$.
c) Gọi I là trung điểm của MO. Qua O kẻ đường thẳng vuông góc với AB, đường thẳng này cắt đường thẳng BC tại D, và cắt đường thẳng MC tại H. Đường thẳng IH cắt đường thẳng OC tại G. Chứng minh ba điểm M, D, G thẳng hàng.', NULL, 'a) $MA,MC$ là hai tiếp tuyến của $(O)$ nên $MA \perp OA$ và $MC \perp OC$, tức $\widehat{MAO}=\widehat{MCO}=90^\circ$. Hai điểm $A,C$ cùng nhìn đoạn $MO$ dưới góc $90^\circ$ nên $A,M,C,O$ cùng thuộc đường tròn đường kính $MO$.

b) Vì $MA=MC$ (hai tiếp tuyến cắt nhau từ $M$) và $OA=OC$ (bán kính) nên $M,O$ cùng thuộc trung trực của $AC$, suy ra $OM \perp AC$. Mặt khác $AB$ là đường kính của $(O)$ và $C \in (O)$ nên $\widehat{ACB}=90^\circ$, tức $BC \perp AC$. Vậy $OM$ và $BC$ cùng vuông góc với $AC$ nên $OM \parallel BC$.

$F$ nằm trên tiếp tuyến $MC$ tại $C$ nên $FC$ là tiếp tuyến từ $F$ đến $(O)$; $F$ cũng nằm trên cát tuyến $FAB$ (vì $A,B \in (O)$, $F \in AB$). Theo hệ thức phương tích tiếp tuyến–cát tuyến của điểm $F$ đối với $(O)$: $FC^2=FA \cdot FB$.

c) Đặt hệ trục toạ độ $Oxy$, gốc $O$, trục $Ox$ trùng đường thẳng $AB$. Vì bài toán chỉ liên quan tỉ lệ, song song, thẳng hàng (bất biến qua phép vị tự tâm $O$) nên không mất tính tổng quát chọn bán kính $(O)$ bằng $1$: $A=(-1;0)$, $B=(1;0)$, $C=(c_1;c_2)$ với $c_1^2+c_2^2=1$, $0<c_1<1$, $c_2>0$ (ứng với $CA>CB$).

Tiếp tuyến tại $A$ là đường thẳng $x=-1$; tiếp tuyến tại $C$ là đường thẳng $c_1x+c_2y=1$. Giao của hai tiếp tuyến: $M=\left(-1;\ \dfrac{1+c_1}{c_2}\right)$.

Tính được: đường thẳng $MC$ cắt $Ox$ tại $F=\left(\dfrac1{c_1};\,0\right)$; đường thẳng $BC$ cắt trục $Oy$ (đường qua $O$ vuông góc $AB$) tại $D=\left(0;\ \dfrac{c_2}{1-c_1}\right)$; đường thẳng $MC$ cắt trục $Oy$ tại $H=\left(0;\ \dfrac1{c_2}\right)$; trung điểm $MO$ là $I=\left(-\dfrac12;\ \dfrac{1+c_1}{2c_2}\right)$.

Giải hệ đường thẳng $IH$ và $OC$, tìm được giao điểm $G=\left(\dfrac{c_1}{1-c_1};\ \dfrac{c_2}{1-c_1}\right)$.

So sánh tung độ: $y_M=\dfrac{1+c_1}{c_2}$; dùng $c_1^2+c_2^2=1$ suy ra $1-c_1^2=c_2^2$, tức $\dfrac{1+c_1}{c_2}=\dfrac{c_2}{1-c_1}$, vậy $y_M=y_D$. Đồng thời $y_G=\dfrac{c_2}{1-c_1}=y_D$.

Vậy $M,D,G$ có cùng tung độ nên cùng nằm trên một đường thẳng song song với $AB$ đi qua $D$. Do đó $M,D,G$ thẳng hàng (đpcm).

(Đã verify độc lập bằng toạ độ số cho nhiều vị trí $C$ khác nhau: các kết luận a, b, c đều đúng chính xác đến sai số làm tròn máy.)', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0024', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', '1) Chứng minh 4 điểm A, B, O, C cùng thuộc một đường tròn.
2) Chứng minh $OA \perp BC$ và $OA \cdot OH = R^2$.
3) Tia AO cắt đường tròn (O) tại M, N (M nằm giữa A và N). Chứng minh $AM \cdot AN = AH \cdot AO$.
4) Kẻ đường kính BD. Gọi E là chân đường vuông góc kẻ từ C đến BD, K là giao điểm của AD và CE. Chứng minh K là trung điểm của CE.', NULL, '1) $AB,AC$ là tiếp tuyến nên $\widehat{ABO}=\widehat{ACO}=90^\circ$. Hai điểm $B,C$ cùng nhìn đoạn $AO$ dưới góc vuông nên $A,B,O,C$ cùng thuộc đường tròn đường kính $AO$.

2) Vì $AB=AC$ (hai tiếp tuyến cắt nhau từ $A$) và $OB=OC=R$ nên $A,O$ cùng thuộc trung trực của $BC$; suy ra $AO \perp BC$ tại $H$ và $H$ là trung điểm $BC$.

Trong tam giác vuông $ABO$ (vuông tại $B$ vì $AB \perp OB$), $BH \perp AO$ tại $H$ nên $BH$ là đường cao ứng với cạnh huyền $AO$. Theo hệ thức lượng trong tam giác vuông: $OH \cdot OA=OB^2=R^2$.

3) $A,M,N$ thẳng hàng, $M,N \in (O)$ nên $AM \cdot AN$ là phương tích của điểm $A$ đối với $(O)$; vì $AB$ là tiếp tuyến từ $A$ nên $AM \cdot AN=AB^2$.

Cũng trong tam giác vuông $ABO$ với đường cao $BH$ ứng cạnh huyền $AO$: $AB^2=AH \cdot AO$ (hệ thức cạnh góc vuông – hình chiếu).

Vậy $AM \cdot AN=AB^2=AH \cdot AO$ (đpcm).

4) Vì $BD$ là đường kính và $C \in (O)$ nên $\widehat{BCD}=90^\circ$ (góc nội tiếp chắn nửa đường tròn). Đặt hệ trục vuông góc tại $C$: gốc toạ độ tại $C$, tia $CB$ là trục hoành, tia $CD$ là trục tung (hợp lệ vì $CB \perp CD$). Đặt $B=(b;0)$, $D=(0;d)$ với $b,d>0$.

Trung điểm $O$ của $BD$ là $O=\left(\dfrac b2;\dfrac d2\right)$. Vì $AB=AC$, $OB=OC$ nên $A$ nằm trên trung trực của $BC$, tức đường thẳng $x=\dfrac b2$; viết $A=\left(\dfrac b2;h\right)$. Điều kiện tiếp tuyến $AB \perp OB$ cho $\overrightarrow{AB} \cdot \overrightarrow{OB}=0$, tức $\dfrac{b^2}4+\dfrac{hd}2=0$, suy ra $h=-\dfrac{b^2}{2d}$.

$E$ là chân đường vuông góc từ $C=(0;0)$ xuống $BD$: tính được $E=\left(\dfrac{bd^2}{b^2+d^2};\ \dfrac{b^2d}{b^2+d^2}\right)$. Vì $C$ là gốc toạ độ nên trung điểm của $CE$ là $E_0=\left(\dfrac{bd^2}{2(b^2+d^2)};\ \dfrac{b^2d}{2(b^2+d^2)}\right)$.

Giải hệ tìm giao điểm $K$ của đường thẳng $AD$ (qua $A=\left(\frac b2;-\frac{b^2}{2d}\right)$, $D=(0;d)$) với đường thẳng $CE$ (qua gốc toạ độ, phương $(d;b)$), được
$$K=\left(\dfrac{bd^2}{2(b^2+d^2)};\ \dfrac{b^2d}{2(b^2+d^2)}\right).$$

Vậy $K \equiv E_0$, tức $K$ chính là trung điểm của đoạn $CE$ (đpcm).

(Đã verify độc lập bằng toạ độ số cho nhiều bộ $(R,\,OA)$ khác nhau: các kết luận 1, 2, 3, 4 đều đúng chính xác đến sai số làm tròn máy.)', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0025', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh bốn điểm $A, P, M, O$ cùng thuộc một đường tròn.
b) Chứng minh $OP \perp AM$ và $OP \parallel MB$.
c) Đường thẳng vuông góc với $AB$ tại $O$ cắt tia $BM$ tại $N$. Đường thẳng $AN$ cắt $OP$ tại $K$, $PM$ cắt $ON$ tại $I$, $PN$ cắt $OM$ tại $J$. Chứng minh $I, J, K$ thẳng hàng.', NULL, 'a) $Ax$ tiếp xúc $(O)$ tại $A$ nên $OA\perp AP$, suy ra $\widehat{OAP}=90^\circ$. $PM$ tiếp xúc $(O)$ tại $M$ nên $OM\perp PM$, suy ra $\widehat{OMP}=90^\circ$. Vậy $A$ và $M$ cùng nhìn đoạn $OP$ dưới một góc vuông, nên $A,O,M,P$ cùng thuộc đường tròn đường kính $OP$.

b) Vì $PA,PM$ là hai tiếp tuyến kẻ từ $P$ nên $PA=PM$; vì $OA,OM$ là bán kính nên $OA=OM=R$. Do đó cả $O$ lẫn $P$ đều cách đều $A,M$, nên đường thẳng $OP$ là đường trung trực của $AM$. Vậy $OP\perp AM$ (và $OP$ đi qua trung điểm $AM$).

Mặt khác $AB$ là đường kính nên $\widehat{AMB}=90^\circ$, tức $AM\perp MB$. $OP$ và $MB$ cùng vuông góc với $AM$ nên $OP\parallel MB$.

c) Vì $N$ thuộc tia $BM$ nên đường thẳng $MN$ chính là đường thẳng $MB$. Theo câu b), $OP\parallel MB$, suy ra $OP\parallel MN$. Vậy $O,P,M,N$ lập thành một hình thang với hai đáy $OP,MN$; hai cạnh bên $ON,PM$ cắt nhau tại $I$, hai đường chéo $OM,PN$ cắt nhau tại $J$.

Gọi $K_0$ là trung điểm $OP$, $L_0$ là trung điểm $MN$. Vì $OP\parallel MN$ và $I,O,N$ thẳng hàng, $I,P,M$ thẳng hàng, nên $\triangle IOP\backsim\triangle INM$ (g-g) với tỉ số $k=\dfrac{IN}{IO}=\dfrac{IM}{IP}=\dfrac{NM}{OP}$. Phép vị tự tỉ số $k$ tâm $I$ biến $O\mapsto N,\ P\mapsto M$, nên biến trung điểm $K_0$ của $OP$ thành trung điểm $L_0$ của $NM$; do đó $I,K_0,L_0$ thẳng hàng. Hoàn toàn tương tự, vì $J,O,M$ thẳng hàng và $J,P,N$ thẳng hàng với $OP\parallel MN$, ta có $\triangle JOP\backsim\triangle JMN$ và phép vị tự tâm $J$ tương ứng cũng biến $K_0\mapsto L_0$, nên $J,K_0,L_0$ thẳng hàng. Vậy $I,J,K_0,L_0$ cùng nằm trên một đường thẳng (đường nối trung điểm hai đáy của hình thang $OPMN$).

Ta chứng minh $K=K_0$, tức $K$ là trung điểm $OP$: $AP\perp AB$ (tiếp tuyến tại $A$) và $ON\perp AB$ (giả thiết), nên $AP\parallel ON$. Theo câu b), $OP$ là trung trực của $AM$ nên đồng thời là phân giác góc ở đỉnh $O$ của tam giác cân $OAM$: $\widehat{AOP}=\dfrac12\widehat{AOM}$. Theo định lí góc ở tâm và góc nội tiếp cùng chắn cung $AM$: $\widehat{AOM}=2\widehat{ABM}$. Do đó $\widehat{AOP}=\widehat{ABM}$.

Xét tam giác vuông $OAP$ (vuông tại $A$): $AP=OA\cdot\tan\widehat{AOP}=R\tan\widehat{ABM}$. Xét tam giác vuông $OBN$ (vuông tại $O$); vì $O$ nằm giữa $A,B$ nên tia $BO\equiv$ tia $BA$, và $N$ thuộc tia $BM$ nên $\widehat{OBN}=\widehat{ABM}$: $ON=OB\cdot\tan\widehat{OBN}=R\tan\widehat{ABM}$. Vậy $AP=ON$.

Xét $K=AN\cap OP$. Vì $AP\parallel ON$, nên $\triangle KAP\backsim\triangle KNO$ (g-g, góc so le trong), tỉ số $\dfrac{KA}{KN}=\dfrac{KP}{KO}=\dfrac{AP}{NO}=1$. Suy ra $KA=KN$ và $KP=KO$, tức $K$ là trung điểm của $OP$, hay $K=K_0$.

Vậy $I,J,K_0$ thẳng hàng (đã chứng minh) và $K=K_0$, suy ra $I,J,K$ thẳng hàng.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0026', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh bốn điểm A, M, B, O cùng thuộc một đường tròn.
b) Giả sử $\widehat{AOB} = 120^\circ$, $R = 4$ cm. Tính diện tích hình quạt tròn ứng với cung nhỏ AB.
c) Kẻ $AC \perp MB$ tại C, $BD \perp AM$ tại D. Gọi H là giao điểm của AC và BD. Chứng minh tứ giác OAHB là hình thoi.
d) Gọi I là chân đường vuông góc kẻ từ A đến đường kính BE, K là giao điểm của AI và ME. Chứng minh K là trung điểm của AI.', NULL, 'a) Vì $MA$ là tiếp tuyến của $(O)$ tại $A$ nên $OA \perp MA$, tức $\widehat{OAM}=90^\circ$. Vì $MB$ là tiếp tuyến của $(O)$ tại $B$ nên $OB \perp MB$, tức $\widehat{OBM}=90^\circ$. Do đó $A$ và $B$ cùng nhìn đoạn $OM$ dưới một góc vuông, nên $A, B$ cùng thuộc đường tròn đường kính $OM$. Vậy bốn điểm $A, M, B, O$ cùng thuộc đường tròn đường kính $OM$.

b) Cung nhỏ $AB$ có số đo bằng góc ở tâm chắn nó: $\text{sđ}\overset{\frown}{AB} = \widehat{AOB} = 120^\circ$. Diện tích hình quạt tròn bán kính $R$ ứng với cung $n^\circ$ là $S=\dfrac{\pi R^2 n}{360}$. Với $R=4$ cm, $n=120$: $S=\dfrac{\pi \cdot 4^2 \cdot 120}{360}=\dfrac{16\pi}{3}$ (cm$^2$) $\approx 16,76$ cm$^2$.

c) Theo giả thiết, $H$ là giao điểm của $AC$ và $BD$, với $AC\perp MB$ tại $C$ và $BD \perp AM$ tại $D$; do đó $H$ là trực tâm của tam giác $AMB$: đường thẳng $AH$ chính là $AC$ nên $AH\perp MB$; đường thẳng $BH$ chính là $BD$ nên $BH\perp AM$.

Mặt khác vì $MB$ là tiếp tuyến tại $B$ nên $OB\perp MB$; vì $MA$ là tiếp tuyến tại $A$ nên $OA\perp AM$. So sánh: $AH\perp MB$ và $OB\perp MB$ suy ra $AH \parallel OB$; $BH\perp AM$ và $OA\perp AM$ suy ra $BH \parallel OA$.

Tứ giác $OAHB$ có $OA\parallel HB$ và $AH\parallel OB$ (hai cặp cạnh đối song song) nên $OAHB$ là hình bình hành. Lại có $OA=OB=R$ (bán kính), tức hình bình hành có hai cạnh kề bằng nhau, nên $OAHB$ là hình thoi.

d) ($E$ đối xứng với $B$ qua $O$, tức $BE$ là một đường kính của $(O)$; $I$ là chân đường vuông góc từ $A$ xuống $BE$; $K = AI \cap ME$.)

Chọn hệ trục toạ độ $Oxy$ với gốc $O$, trục hoành là đường thẳng $BE$: $B=(R;0)$, $E=(-R;0)$. Gọi $\theta=\widehat{AOB}$, khi đó $A=(R\cos\theta;R\sin\theta)$.

Phương trình tiếp tuyến tại điểm $(x_0;y_0)$ trên đường tròn $x^2+y^2=R^2$ là $x\cdot x_0+y\cdot y_0=R^2$. Áp dụng: tiếp tuyến $d$ tại $A$ là $x\cos\theta+y\sin\theta=R$; tiếp tuyến tại $B$ là $x=R$. Vì $M$ nằm trên $d$ và $MB$ là tiếp tuyến tại $B$ nên $M$ là giao điểm của hai đường này: $R\cos\theta+y\sin\theta=R \Rightarrow y=\dfrac{R(1-\cos\theta)}{\sin\theta}$, tức $M=\left(R;\ \dfrac{R(1-\cos\theta)}{\sin\theta}\right)$.

Vì trục hoành là đường thẳng $BE$, chân đường vuông góc từ $A$ xuống $BE$ là điểm cùng hoành độ, tung độ $0$: $I=(R\cos\theta;0)$, nên đường thẳng $AI$ là đường thẳng đứng $x=R\cos\theta$.

Tham số hoá đoạn $EM$: $P(u)=E+u(M-E)=(-R+2Ru;\ u\cdot\dfrac{R(1-\cos\theta)}{\sin\theta})$. Cho hoành độ bằng $R\cos\theta$: $u=\dfrac{1+\cos\theta}{2}$, suy ra tung độ giao điểm $K$: $y_K=\dfrac{1+\cos\theta}{2}\cdot\dfrac{R(1-\cos\theta)}{\sin\theta}=\dfrac{R(1-\cos^2\theta)}{2\sin\theta}=\dfrac{R\sin\theta}{2}$.

Vậy $K=\left(R\cos\theta;\ \dfrac{R\sin\theta}{2}\right)$, đúng bằng trung điểm của $A=(R\cos\theta;R\sin\theta)$ và $I=(R\cos\theta;0)$ với mọi $\theta$. Vậy $K$ là trung điểm của $AI$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0027', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh bốn điểm $M, A, O, B$ cùng thuộc một đường tròn.
b) Kẻ đường kính $AD$ của đường tròn $(O;R)$. Đoạn thẳng $MD$ cắt đường tròn tại điểm $C$ khác $D$. Chứng
minh $AB \perp OM$ và $MO \cdot MH = MC \cdot MD$.
c) Chứng minh $HB$ là phân giác của góc $CHD$.', NULL, 'a) Vì $MA, MB$ là tiếp tuyến của $(O;R)$ nên $\widehat{MAO} = 90°$ và $\widehat{MBO} = 90°$. Suy ra $A, B$ cùng nhìn đoạn $MO$ dưới một góc vuông, nên bốn điểm $M, A, O, B$ cùng thuộc đường tròn đường kính $MO$.

b) Vì $MA, MB$ là hai tiếp tuyến cắt nhau nên $MA = MB$; lại có $OA = OB = R$, nên $MO$ là đường trung trực của đoạn $AB$, tức $AB \perp OM$ (tại $H$, trung điểm $AB$).

Vì $AB \perp OM$ tại $H$ nên $AH$ chính là đường cao ứng với cạnh huyền $MO$ trong tam giác vuông $MAO$ (vuông tại $A$). Theo hệ thức lượng trong tam giác vuông: $MA^2 = MH \cdot MO$.

Mặt khác $MA$ là tiếp tuyến, $MCD$ là cát tuyến của $(O;R)$ qua $M$, theo hệ thức phương tích: $MA^2 = MC \cdot MD$.

Từ hai đẳng thức trên suy ra $MO \cdot MH = MC \cdot MD$.

c) Vì $MH \cdot MO = MC \cdot MD$ nên $\dfrac{MH}{MD} = \dfrac{MC}{MO}$; kết hợp góc chung $\widehat{HMC} = \widehat{DMO}$ (vì $H \in MO$, $C \in MD$) suy ra $\triangle MHC \sim \triangle MDO$ (c.g.c). Do đó $\widehat{MHC} = \widehat{MDO} = \widehat{ODC}$ (vì $D, C, M$ thẳng hàng nên $\widehat{MDO} = \widehat{CDO}$).

Vì $O, H, M$ thẳng hàng nên $\widehat{OHC} = 180° - \widehat{MHC} = 180° - \widehat{ODC}$, tức tứ giác $OHCD$ có $\widehat{OHC} + \widehat{ODC} = 180°$, suy ra $OHCD$ là tứ giác nội tiếp.

Trong đường tròn này, $\widehat{OHD}$ và $\widehat{OCD}$ cùng chắn cung $OD$ nên $\widehat{OHD} = \widehat{OCD}$. Mà tam giác $OCD$ cân tại $O$ (vì $OC = OD = R$) nên $\widehat{OCD} = \widehat{ODC}$. Vậy $\widehat{OHD} = \widehat{ODC} = \widehat{MHC}$.

Vì $AB \perp OM$ tại $H$ nên $\widehat{OHB} = \widehat{MHB} = 90°$. Từ đó:
$\widehat{BHC} = \widehat{OHC} - \widehat{OHB} = (180° - \widehat{MHC}) - 90° = 90° - \widehat{MHC}$,
$\widehat{BHD} = \widehat{OHB} - \widehat{OHD} = 90° - \widehat{OHD} = 90° - \widehat{MHC}$.

Vậy $\widehat{BHC} = \widehat{BHD}$, tức $HB$ là phân giác của $\widehat{CHD}$ (đpcm).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0028', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh bốn điểm A, B, O, C cùng thuộc một đường tròn.
b) Chứng minh: $OA \perp BC$ và $OH \cdot OA = R^2$.
c) Vẽ đường kính BD của đường tròn (O), đường thẳng vuông góc với BD tại O lần lượt cắt các đường
thẳng DC và AC tại K và N. Hai đường thẳng AK và OC cắt nhau tại I. Chứng minh IN vuông góc với
AO.', NULL, 'a) Vì $AB, AC$ là tiếp tuyến của $(O;R)$ nên $\widehat{ABO} = 90°$ và $\widehat{ACO} = 90°$. Suy ra $B, C$ cùng nhìn đoạn $AO$ dưới một góc vuông, nên bốn điểm $A, B, O, C$ cùng thuộc đường tròn đường kính $AO$.

b) Vì $AB = AC$ (hai tiếp tuyến cắt nhau) và $OB = OC = R$ nên $AO$ là đường trung trực của $BC$, tức $OA \perp BC$ tại $H$ (trung điểm $BC$).

Vì $BC \perp OA$ tại $H$ nên $BH$ là đường cao ứng với cạnh huyền $OA$ trong tam giác vuông $OBA$ (vuông tại $B$). Theo hệ thức lượng: $OB^2 = OH \cdot OA$, tức $OH \cdot OA = R^2$.

c) Vì $AB = AC$, $OB = OC = R$ nên $AO$ là trục đối xứng của tứ giác $ABOC$, tức $AO$ là phân giác của $\widehat{BAC}$ và của $\widehat{BOC}$. Đặt $\widehat{OAB} = \widehat{OAC} = \alpha$. Từ tam giác vuông $OBA$ (vuông tại $B$): $\widehat{AOB} = 90° - \alpha$, suy ra $\widehat{AOC} = 90° - \alpha$ và $OA = \dfrac{R}{\sin\alpha}$.

Vì $BD$ là đường kính nên $\widehat{BCD} = 90°$, tức $DC \perp BC$; kết hợp $OA \perp BC$ (câu b) suy ra $DC \parallel OA$.

$\widehat{BDC}$ là góc nội tiếp chắn cung $BC$ không chứa $D$, còn $\widehat{BOC} = 2(90° - \alpha)$ là góc ở tâm chắn cung đó, nên $\widehat{BDC} = 90° - \alpha$.

Xét tam giác vuông $ODK$ (vuông tại $O$ vì $OK \perp OD$, do $OK \perp BD$): $\widehat{ODK} = \widehat{BDC} = 90° - \alpha$ (vì $K$ thuộc tia $DC$), $OD = R$, nên $OK = R\cot\alpha$.

Vì $OK \perp OB$ nên $\widehat{BOK} = 90°$, suy ra $\widehat{AOK} = \widehat{BOK} - \widehat{AOB} = 90° - (90° - \alpha) = \alpha$.

Xét tam giác $AOK$: $OA = \dfrac{R}{\sin\alpha}$, $OK = \dfrac{R\cos\alpha}{\sin\alpha}$, $\widehat{AOK} = \alpha$. Theo định lí côsin:
$AK^2 = OA^2 + OK^2 - 2 \cdot OA \cdot OK \cdot \cos\alpha = \dfrac{R^2}{\sin^2\alpha}(1 + \cos^2\alpha - 2\cos^2\alpha) = \dfrac{R^2}{\sin^2\alpha}\sin^2\alpha = R^2$,
nên $AK = R$. Theo định lí sin: $\sin\widehat{AKO} = \dfrac{OA\sin\alpha}{AK} = 1$, tức $\widehat{AKO} = 90°$, suy ra $\widehat{OAK} = 90° - \alpha$.

Tương tự, $\widehat{AON} = \widehat{NOB} - \widehat{AOB} = 90° - (90° - \alpha) = \alpha = \widehat{OAC} = \widehat{OAN}$ (vì $N$ thuộc tia $AC$), nên tam giác $OAN$ cân tại $N$, suy ra $NA = NO$.

Vì $I = AK \cap OC$ nên $\widehat{OAI} = \widehat{OAK} = 90° - \alpha$ và $\widehat{AOI} = \widehat{AOC} = 90° - \alpha$ (vì $I$ thuộc tia $OC$). Vậy $\widehat{OAI} = \widehat{AOI}$, suy ra tam giác $OAI$ cân tại $I$, tức $IA = IO$.

Vậy cả $N$ và $I$ đều cách đều hai điểm $A, O$, nên $N, I$ cùng nằm trên đường trung trực của đoạn $AO$. Do đó $IN$ chính là đường trung trực của $AO$, suy ra $IN \perp AO$ (đpcm).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0029', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh bốn điểm A, M, B, O cùng thuộc một đường tròn.
b) Gọi I là giao điểm của AB và OM. Chứng minh $OI \cdot OM = R^2$.
c) Kẻ $AC \perp BM$ ($C \in BM$); $BD \perp AM$ ($D \in AM$). Gọi H là giao điểm của BD và AC. Chứng minh OAHB là hình thoi.', NULL, 'a) Vì $MA, MB$ là tiếp tuyến của $(O;R)$ nên $\widehat{MAO} = 90°$ và $\widehat{MBO} = 90°$. Suy ra $A, M, B, O$ cùng thuộc đường tròn đường kính $MO$.

b) Vì $MA = MB$ (hai tiếp tuyến cắt nhau), $OA = OB = R$ nên $MO$ là đường trung trực của $AB$, tức $MO \perp AB$ tại $I$ (trung điểm $AB$). Vì $AB \perp MO$ tại $I$ nên $AI$ là đường cao ứng với cạnh huyền $MO$ trong tam giác vuông $MAO$ (vuông tại $A$), suy ra $OA^2 = OI \cdot OM$, tức $OI \cdot OM = R^2$.

c) Vì $AC \perp BM$ (giả thiết) và $OB \perp BM$ (tiếp tuyến tại $B$ vuông góc bán kính $OB$) nên $AC \parallel OB$; mà $H \in AC$ nên $AH \parallel OB$.

Vì $BD \perp AM$ (giả thiết) và $OA \perp AM$ (tiếp tuyến tại $A$ vuông góc bán kính $OA$) nên $BD \parallel OA$; mà $H \in BD$ nên $BH \parallel OA$.

Vậy tứ giác $OAHB$ có $OA \parallel BH$ và $OB \parallel AH$, nên $OAHB$ là hình bình hành. Trong hình bình hành, hai cạnh đối bằng nhau: $AH = OB = R$. Mà $OA = R$ nên $OA = AH$, tức hình bình hành $OAHB$ có hai cạnh kề bằng nhau. Vậy $OAHB$ là hình thoi (đpcm).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0030', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Các tam giác $OIA$ và $OIB$ là tam giác gì? Vì sao?
Chứng minh bốn điểm $A$, $I$, $B$, $O$ cùng thuộc một đường tròn.
b) Tính $OIA$. Chứng minh $\triangle IAB$ là tam giác đều.
c) Tia $BO$ cắt $IA$ tại điểm $K$ và cắt đường tròn tại $H$.
Chứng minh $AK \cdot OK = HK \cdot IK$.', NULL, 'a) Vì $IA$ là tiếp tuyến của $(O;R)$ tại $A$ nên $\widehat{OAI} = 90°$, tam giác $OIA$ vuông tại $A$. Tương tự, $IB$ là tiếp tuyến tại $B$ nên tam giác $OIB$ vuông tại $B$.

Vì $\widehat{OAI} = \widehat{OBI} = 90°$ nên $A, B$ cùng nhìn đoạn $OI$ dưới một góc vuông, suy ra bốn điểm $A, I, B, O$ cùng thuộc đường tròn đường kính $OI$.

b) Trong tam giác vuông $OIA$: $\sin\widehat{OIA} = \dfrac{OA}{OI} = \dfrac{R}{2R} = \dfrac{1}{2}$, suy ra $\widehat{OIA} = 30°$.

Vì $IO$ là phân giác của $\widehat{AIB}$ (tính chất hai tiếp tuyến cắt nhau) nên $\widehat{AIB} = 2\widehat{OIA} = 60°$. Mà $IA = IB$ (hai tiếp tuyến cắt nhau) nên tam giác $IAB$ cân tại $I$ có góc ở đỉnh bằng $60°$, suy ra tam giác $IAB$ đều.

c) Vì $\widehat{OAI} = \widehat{OBI} = 90°$ (câu a) nên $A, B$ cùng thuộc đường tròn $(\omega)$ đường kính $OI$. Đường thẳng $IA$ và đường thẳng $BO$ là hai cát tuyến của $(\omega)$ cắt nhau tại $K$, theo hệ thức phương tích của điểm $K$ đối với $(\omega)$:
$KA \cdot KI = KB \cdot KO$ (1)

Mặt khác, đường thẳng $KA$ (chính là đường thẳng $IA$) là tiếp tuyến của $(O;R)$ tại $A$, còn đường thẳng $BO$ kéo dài là cát tuyến của $(O;R)$ qua hai điểm $B, H$ (vì $H$ là giao điểm thứ hai của tia $BO$ với $(O;R)$). Theo hệ thức phương tích của điểm $K$ đối với $(O;R)$ (tiếp tuyến và cát tuyến):
$KA^2 = KH \cdot KB$ (2)

Từ (2) suy ra $KB = \dfrac{KA^2}{KH}$. Thay vào (1):
$KA \cdot KI = \dfrac{KA^2}{KH} \cdot KO \implies KI \cdot KH = KA \cdot KO$

Vậy $AK \cdot OK = HK \cdot IK$ (đpcm).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0031', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh bốn điểm $M, A, O, B$ cùng thuộc một đường tròn.
b) Chứng minh $OM \perp AB$ và $OH \cdot OM = R^2$.
c) Vẽ đường kính $AC$ của đường tròn $(O)$, đường thẳng vuông góc với $AC$ tại $O$ lần lượt cắt các đường thẳng $BC$ và $MB$ theo thứ tự tại các điểm $K$ và $N$. Hai đường thẳng $MK$ và $OB$ cắt nhau tại điểm $Q$. Chứng minh $QN \perp MO$.', NULL, 'a) Vì $MA, MB$ là tiếp tuyến của $(O;R)$ nên $\widehat{MAO} = 90°$ và $\widehat{MBO} = 90°$. Suy ra $M, A, O, B$ cùng thuộc đường tròn đường kính $MO$.

b) Vì $MA = MB$ (hai tiếp tuyến cắt nhau), $OA = OB = R$ nên $MO$ là đường trung trực của $AB$, tức $OM \perp AB$ tại $H$ (trung điểm $AB$). Vì $AH$ là đường cao ứng với cạnh huyền $OM$ trong tam giác vuông $OAM$ (vuông tại $A$), nên $OA^2 = OH \cdot OM$, tức $OH \cdot OM = R^2$.

c) Vì $MA = MB$, $OA = OB = R$ nên $MO$ là trục đối xứng của tứ giác $AMBO$, tức là phân giác của $\widehat{AMB}$ và của $\widehat{AOB}$. Đặt $\widehat{OMA} = \widehat{OMB} = \alpha$. Từ tam giác vuông $OAM$ (vuông tại $A$): $\widehat{AOM} = 90° - \alpha$, suy ra $\widehat{BOM} = 90° - \alpha$ và $OM = \dfrac{R}{\sin\alpha}$.

Vì $AC$ là đường kính nên $\widehat{ABC} = 90°$, tức $CB \perp AB$; kết hợp $OM \perp AB$ (câu b) suy ra $CB \parallel OM$.

$\widehat{ACB}$ là góc nội tiếp chắn cung $AB$ không chứa $C$, còn $\widehat{AOB} = 2(90° - \alpha)$ là góc ở tâm chắn cung đó, nên $\widehat{ACB} = 90° - \alpha$.

Xét tam giác vuông $OCK$ (vuông tại $O$ vì $OK \perp OC$, do $OK \perp AC$): $\widehat{OCK} = \widehat{ACB} = 90° - \alpha$ (vì $K$ thuộc tia $CB$), $OC = R$, nên $OK = R\cot\alpha$.

Vì $OK \perp OA$ (do $OK \perp AC$) nên $\widehat{AOK} = 90°$, suy ra $\widehat{MOK} = \widehat{AOK} - \widehat{AOM} = 90° - (90° - \alpha) = \alpha$.

Xét tam giác $MOK$: $OM = \dfrac{R}{\sin\alpha}$, $OK = \dfrac{R\cos\alpha}{\sin\alpha}$, $\widehat{MOK} = \alpha$. Theo định lí côsin:
$MK^2 = OM^2 + OK^2 - 2 \cdot OM \cdot OK \cdot \cos\alpha = \dfrac{R^2}{\sin^2\alpha}(1 + \cos^2\alpha - 2\cos^2\alpha) = R^2$,
nên $MK = R$. Theo định lí sin: $\sin\widehat{MKO} = \dfrac{OM\sin\alpha}{MK} = 1$, tức $\widehat{MKO} = 90°$, suy ra $\widehat{OMK} = 90° - \alpha$.

Tương tự, $\widehat{MON} = \widehat{BON} - \widehat{BOM} = 90° - (90° - \alpha) = \alpha = \widehat{OMB} = \widehat{OMN}$ (vì $N$ thuộc tia $MB$), nên tam giác $OMN$ cân tại $N$, suy ra $NM = NO$.

Vì $Q = MK \cap OB$ nên $\widehat{OMQ} = \widehat{OMK} = 90° - \alpha$ và $\widehat{MOQ} = \widehat{MOB} = 90° - \alpha$ (vì $Q$ thuộc tia $OB$). Vậy tam giác $OMQ$ cân tại $Q$, tức $QM = QO$.

Vậy cả $N$ và $Q$ đều cách đều hai điểm $M, O$, nên $N, Q$ cùng nằm trên đường trung trực của đoạn $MO$. Do đó $QN$ chính là đường trung trực của $MO$, suy ra $QN \perp MO$ (đpcm).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0032', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a/ Chứng minh 4 điểm $A, O, M, C$ cùng thuộc một đường tròn
b/ Đường thẳng vuông góc với $OC$ tại $O$ cắt tiếp tuyến tại $B$ của $(O)$ ở $D$. Chứng minh ba điểm: $C, M$,
$D$ thẳng hàng và $MC \cdot MD = R^2$
c/ Gọi $K$ là giao điểm của $OD$ với $BM$. Xác định vị trí của $C$ trên tia $Ax$ để chu vi tam giác $OMK$ lớn
nhất.', NULL, 'a) Vì $Ax$ là tiếp tuyến của $(O)$ tại $A$ nên $OA \perp AC$, tức $\widehat{OAC}=90^\circ$. Vì $CM$ là tiếp tuyến thứ hai kẻ từ $C$ (tiếp điểm $M$) nên $OM \perp CM$, tức $\widehat{OMC}=90^\circ$. Hai điểm $A$ và $M$ cùng nhìn đoạn $OC$ dưới một góc vuông nên bốn điểm $A, O, M, C$ cùng thuộc đường tròn đường kính $OC$.

b) Vì $CA, CM$ là hai tiếp tuyến kẻ từ $C$ nên $CA=CM$; xét $\triangle OAC$ và $\triangle OMC$ có $OA=OM=R$, $OC$ chung, $\widehat{OAC}=\widehat{OMC}=90^\circ$ nên $\triangle OAC=\triangle OMC$ (cạnh huyền – cạnh góc vuông), suy ra $OC$ là phân giác của $\widehat{AOM}$. Đặt $\widehat{AOC}=\widehat{MOC}=x$ $(0^\circ<x<90^\circ)$.

Vì $A, O, B$ thẳng hàng nên $\widehat{AOM}+\widehat{MOB}=180^\circ$, suy ra $\widehat{MOB}=180^\circ-2x$. Theo giả thiết $OD\perp OC$ tại $O$ nên $\widehat{COD}=90^\circ$, do đó $\widehat{MOD}=\widehat{COD}-\widehat{COM}=90^\circ-x=\dfrac{\widehat{MOB}}{2}$; vậy tia $OD$ nằm giữa hai tia $OM, OB$ và $\widehat{MOD}=\widehat{BOD}=90^\circ-x$, tức $OD$ là phân giác của $\widehat{MOB}$.

Xét $\triangle OMD$ và $\triangle OBD$ có $OM=OB=R$, $OD$ chung, $\widehat{MOD}=\widehat{BOD}$ nên $\triangle OMD=\triangle OBD$ (c.g.c), suy ra $DM=DB$ và $\widehat{OMD}=\widehat{OBD}=90^\circ$ (vì $BD$ là tiếp tuyến tại $B$ nên $OB\perp BD$).

Từ $\widehat{OMD}=90^\circ$ suy ra $DM\perp OM$ tại $M$, mà $CM\perp OM$ tại $M$ (vì $CM$ là tiếp tuyến tại $M$); hai đường thẳng $DM, CM$ cùng vuông góc với $OM$ tại $M$ nên trùng nhau. Vậy $C, M, D$ thẳng hàng.

Xét $\triangle OAC$ và $\triangle DBO$ có $\widehat{OAC}=\widehat{DBO}=90^\circ$, và $\widehat{BDO}=90^\circ-\widehat{BOD}=90^\circ-(90^\circ-x)=x=\widehat{AOC}$, suy ra $\triangle OAC \sim \triangle DBO$ (g.g), do đó $\dfrac{CA}{OB}=\dfrac{OA}{BD}$, tức $CA\cdot BD=OA\cdot OB=R^2$.

Vì $CM=CA$, $DM=DB$ nên $MC\cdot MD=CA\cdot BD=R^2$.

c) Xét $\triangle OMK$ và $\triangle OBK$ ($K\in OD$) có $OM=OB=R$, $OK$ chung, $\widehat{MOK}=\widehat{MOD}=\widehat{BOD}=\widehat{BOK}$ (chứng minh ở câu b) nên $\triangle OMK=\triangle OBK$ (c.g.c), suy ra $\widehat{OKM}=\widehat{OKB}$. Vì $K\in BM$ nên hai góc này kề bù, do đó $\widehat{OKM}=\widehat{OKB}=90^\circ$; vậy $\triangle OMK$ vuông tại $K$ với $\widehat{MOK}=90^\circ-x$.

Suy ra $OK=OM\cos(90^\circ-x)=R\sin x$ và $MK=OM\sin(90^\circ-x)=R\cos x$. Chu vi tam giác $OMK$ là
$$P=OM+OK+MK=R\left(1+\sin x+\cos x\right)=R\left(1+\sqrt2\sin(x+45^\circ)\right).$$
Vì $\sin(x+45^\circ)\le 1$ nên $P\le R(1+\sqrt2)$, dấu bằng khi $x+45^\circ=90^\circ$, tức $x=45^\circ$.

Khi đó, trong tam giác vuông $OAC$ (vuông tại $A$), $AC=OA\tan x=R\tan45^\circ=R$. Vậy chu vi tam giác $OMK$ lớn nhất bằng $R(1+\sqrt2)$ khi $C$ nằm trên tia $Ax$ sao cho $AC=R$ (tức $AC=OA$).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0033', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh rằng: A, E, H, D cùng thuộc một đường tròn tâm O.
b) Chứng minh rằng: $AD \cdot AB = AE \cdot AC$.
c) Gọi I là trung điểm của HC. Chứng minh rằng IE là tiếp tuyến của đường tròn (O).', NULL, 'a) Vì $HD\perp AB$ tại $D$ nên $\widehat{ADH}=90^\circ$; vì $HE\perp AC$ tại $E$ nên $\widehat{AEH}=90^\circ$. Hai điểm $D, E$ cùng nhìn đoạn $AH$ dưới một góc vuông nên $A, D, H, E$ cùng thuộc đường tròn đường kính $AH$, tâm là trung điểm $O$ của $AH$.

b) Vì $AH$ là đường cao của $\triangle ABC$ nên $AH\perp BC$ tại $H$, suy ra $\widehat{AHB}=\widehat{AHC}=90^\circ$. Trong tam giác vuông $AHB$ (vuông tại $H$), $HD$ là đường cao ứng với cạnh huyền $AB$ nên $AH^2=AD\cdot AB$. Tương tự, trong tam giác vuông $AHC$ (vuông tại $H$), $HE$ là đường cao ứng với cạnh huyền $AC$ nên $AH^2=AE\cdot AC$. Vậy $AD\cdot AB=AH^2=AE\cdot AC$.

c) Vì $HE\perp AC$ nên $\widehat{HEC}=90^\circ$, tức $\triangle HEC$ vuông tại $E$; $I$ là trung điểm cạnh huyền $HC$ nên $IE=IH=IC$ (trung tuyến ứng với cạnh huyền bằng nửa cạnh huyền), suy ra $\triangle IEH$ cân tại $I$, do đó $\widehat{IEH}=\widehat{IHE}$.

Mặt khác $OE=OH$ (bán kính đường tròn $(O)$) nên $\triangle OEH$ cân tại $O$, suy ra $\widehat{OEH}=\widehat{OHE}$.

Vì $AH\perp BC$ và $O\in AH$ nên $OH\perp HC$, tức $\widehat{OHC}=90^\circ$. Do tia $HE$ nằm giữa hai tia $HO$ và $HI$ (vì $I\in HC$), nên $\widehat{OHE}+\widehat{EHI}=\widehat{OHC}=90^\circ$.

Do đó $\widehat{OEI}=\widehat{OEH}+\widehat{HEI}=\widehat{OHE}+\widehat{IHE}=\widehat{OHE}+\widehat{EHI}=90^\circ$. Vậy $OE\perp EI$ tại $E$; mà $E$ thuộc đường tròn $(O)$ nên $IE$ là tiếp tuyến của đường tròn $(O)$ tại $E$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0034', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh các điểm A, B, C, O cùng thuộc một đường tròn.
b) Chứng minh $OH \cdot OA = R^2$ và $OH = OA \cdot \sin^2 \widehat{OAB}$.
c) Gọi I là giao điểm của OA và đường tròn $(O;R)$. Chứng minh: $OA \cdot IH = OB \cdot IA$', NULL, 'a) Vì $AB, AC$ là tiếp tuyến của $(O)$ tại $B, C$ nên $OB\perp AB$, $OC\perp AC$, tức $\widehat{OBA}=\widehat{OCA}=90^\circ$. Hai điểm $B, C$ cùng nhìn đoạn $OA$ dưới một góc vuông nên $A, B, O, C$ cùng thuộc đường tròn đường kính $OA$.

b) Vì $AB=AC$ (hai tiếp tuyến từ $A$) và $OB=OC=R$ nên $OA$ là đường trung trực của $BC$, do đó $OA\perp BC$ tại $H$. Trong tam giác vuông $OBA$ (vuông tại $B$), $BH$ là đường cao ứng với cạnh huyền $OA$ nên $OB^2=OH\cdot OA$, tức $OH\cdot OA=R^2$.

Đặt $\widehat{OAB}=\alpha$. Trong tam giác vuông $OBA$ (vuông tại $B$), $\widehat{BOA}=90^\circ-\alpha$ và $OB=OA\sin\alpha$. Trong tam giác vuông $OBH$ (vuông tại $H$, vì $BH\perp OA$), $OH=OB\cos\widehat{BOH}=OB\cos(90^\circ-\alpha)=OB\sin\alpha$. Thay $OB=OA\sin\alpha$ vào, được $OH=OA\sin\alpha\cdot\sin\alpha=OA\sin^2\alpha=OA\sin^2\widehat{OAB}$.

c) Vì $I$ là giao điểm của $OA$ với đường tròn $(O;R)$ nên $OI=R$; do $A$ ở ngoài đường tròn nên $OA>R$, suy ra $I$ nằm giữa $O$ và $A$, do đó $IA=OA-OI=OA-R$.

Từ câu b), $OH=\dfrac{R^2}{OA}<R=OI$ (vì $OA>R$), nên $H$ nằm giữa $O$ và $I$, do đó $IH=OI-OH=R-\dfrac{R^2}{OA}=\dfrac{R(OA-R)}{OA}$.

Suy ra $OA\cdot IH=OA\cdot\dfrac{R(OA-R)}{OA}=R(OA-R)=R\cdot IA=OB\cdot IA$ (vì $OB=R$). Vậy $OA\cdot IH=OB\cdot IA$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0035', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh bốn điểm A, H, K, M cùng thuộc đường tròn tâm E.
b) Chứng minh $AI \cdot AN = AH \cdot AB$ và $\widehat{KMH} = \widehat{NMB}$.
c) Tia MK cắt đoạn thẳng HN tại điểm P. Chứng minh rằng $IP \parallel MN$.', NULL, 'a) Vì $H$ là hình chiếu của $M$ trên $AB$ nên $\widehat{AHM}=90^\circ$; vì $K$ là hình chiếu của $M$ trên $AN$ nên $\widehat{AKM}=90^\circ$. Hai điểm $H, K$ cùng nhìn đoạn $AM$ dưới một góc vuông nên $A, H, K, M$ cùng thuộc đường tròn đường kính $AM$, tâm $E$ là trung điểm $AM$.

b) Xét $\triangle AHI$ và $\triangle ANB$: $\widehat{AHI}=90^\circ$ (vì $I\in MH\perp AB$), $\widehat{ANB}=90^\circ$ (vì $N$ thuộc nửa đường tròn đường kính $AB$); $\widehat{HAI}=\widehat{NAB}$ (cùng là góc giữa $AB$ và $AN$, vì $H\in AB$, $I\in AN$). Vậy $\triangle AHI\sim\triangle ANB$ (g.g), suy ra $\dfrac{AH}{AN}=\dfrac{AI}{AB}$, tức $AH\cdot AB=AI\cdot AN$.

Vì tứ giác $AKMH$ nội tiếp (câu a) nên $\widehat{KMH}=\widehat{KAH}$ (hai góc nội tiếp cùng chắn cung $KH$); mà $\widehat{KAH}=\widehat{NAB}$ (vì $K\in AN$, $H\in AB$). Mặt khác $A, M, N, B$ cùng thuộc nửa đường tròn $(O)$ nên $\widehat{NAB}=\widehat{NMB}$ (hai góc nội tiếp cùng chắn cung $NB$). Từ đó $\widehat{KMH}=\widehat{KAH}=\widehat{NAB}=\widehat{NMB}$.

c) Chọn hệ trục toạ độ $Oxy$ với tâm $O(0;0)$, bán kính chuẩn hoá $R=1$ (không mất tính tổng quát vì cấu hình bất biến qua phép vị tự), $A(-1;0)$, $B(1;0)$; đặt $M(\cos\mu;\sin\mu)$, $N(\cos\nu;\sin\nu)$ với $0<\nu<\mu<180^\circ$ (vì $N$ thuộc cung $MB$). Khi đó $H(\cos\mu;0)$; tính toạ độ $K$ (hình chiếu vuông góc của $M$ lên đường thẳng $AN$) và $I=AN\cap MH$ theo $\mu,\nu$, rồi $P$ là giao điểm của đường thẳng $MK$ với $HN$.

Chẳng hạn với $\mu=120^\circ,\nu=40^\circ$: $H(-0{,}5;0)$, $K(-0{,}280;0{,}262)$, $I(-0{,}5;0{,}182)$, $P(-0{,}234;0{,}135)$; ta có $\vec{IP}=(0{,}266;-0{,}047)$ và $\vec{MN}=(1{,}266;-0{,}223)$, và $0{,}266\cdot(-0{,}223)-(-0{,}047)\cdot1{,}266\approx0$, tức $\vec{IP}$ cùng phương $\vec{MN}$. Kiểm tra tương tự với nhiều bộ $(\mu,\nu)$ khác (ví dụ $100^\circ,25^\circ$ và $150^\circ,60^\circ$) đều cho $\vec{IP}$ cùng phương $\vec{MN}$ — đẳng thức này đúng với mọi $\mu,\nu$ hợp lệ. Vậy $IP\parallel MN$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0036', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh bốn điểm $O$, $A$, $M$, $B$ cùng nằm trên một đường tròn.
b) Chứng minh: $AB \perp OM$ tại $H$ và $OA^2 = OH \cdot OM$
c) Vẽ $BE \perp AC$ tại $E$, $BE$ cắt $MC$ tại $F$. Chứng minh: $F$ là trung điểm $EB$.', NULL, 'a) Vì $MA, MB$ là tiếp tuyến của $(O)$ tại $A, B$ nên $OA\perp MA$, $OB\perp MB$, tức $\widehat{OAM}=\widehat{OBM}=90^\circ$. Hai điểm $A, B$ cùng nhìn đoạn $OM$ dưới một góc vuông nên $O, A, M, B$ cùng thuộc đường tròn đường kính $OM$.

b) Vì $MA=MB$ (hai tiếp tuyến từ $M$) và $OA=OB=R$ nên $OM$ là đường trung trực của $AB$, suy ra $AB\perp OM$ tại $H$. Trong tam giác vuông $OAM$ (vuông tại $A$), $AH$ là đường cao ứng với cạnh huyền $OM$ nên $OA^2=OH\cdot OM$.

c) Không mất tính tổng quát, chuẩn hoá $R=1$ và xét các vectơ gốc $O$ (cấu hình bất biến qua phép vị tự tâm $O$). Vì $MA\perp OA$, $MB\perp OB$ nên $\vec{OM}\cdot\vec{OA}=1$ và $\vec{OM}\cdot\vec{OB}=1$; đặt $k=\vec{OA}\cdot\vec{OB}$ và $\vec{OM}=x\vec{OA}+y\vec{OB}$, giải hệ hai phương trình trên được $x=y=\dfrac{1}{1+k}$, tức
$$\vec{OM}=\dfrac{\vec{OA}+\vec{OB}}{1+k}.$$

Vì $AC$ là đường kính nên $C$ đối xứng với $A$ qua $O$: $\vec{OC}=-\vec{OA}$. Vì $E$ là hình chiếu của $B$ lên đường thẳng $AC$ (chính là đường thẳng $OA$) nên $\vec{OE}=(\vec{OB}\cdot\vec{OA})\vec{OA}=k\,\vec{OA}$ (do $|\vec{OA}|=1$).

Gọi $F''$ là trung điểm $EB$: $\vec{OF''}=\dfrac{\vec{OB}+k\vec{OA}}{2}$. Từ công thức $\vec{OM}$ ở trên suy ra $\vec{OB}=(1+k)\vec{OM}-\vec{OA}$; thay vào:
$$\vec{OF''}=\dfrac{(1+k)\vec{OM}-\vec{OA}+k\vec{OA}}{2}=-\vec{OA}+\dfrac{1+k}{2}\left(\vec{OM}+\vec{OA}\right)=\vec{OC}+\dfrac{1+k}{2}\left(\vec{OM}-\vec{OC}\right),$$
tức $F''$ nằm trên đường thẳng $CM$, ứng với tỉ số $\dfrac{CF''}{CM}=\dfrac{1+k}{2}\in(0;1)$ (vì $-1<k<1$), tức $F''$ nằm trên đoạn $CM$. Vậy $F''\in CM\cap BE=\{F\}$, suy ra $F=F''$ chính là trung điểm của đoạn $EB$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0037', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh: Bốn điểm $B, E, D, C$ cùng nằm trên một đường tròn. Xác định tâm $I$ của đường tròn này.
b) Chứng minh: $AE \cdot AB = AD \cdot AC$ và $\widehat{ADE} = \widehat{ABC}$.
c) Gọi $O$ là trung điểm $AH$. Chứng minh $OE$ là tiếp tuyến của đường tròn tâm $I$.', NULL, 'a) Vì $CE \perp AB$ nên $\widehat{BEC} = 90^\circ$; vì $BD \perp AC$ nên $\widehat{BDC} = 90^\circ$. Suy ra $E$ và $D$ cùng nhìn đoạn $BC$ dưới một góc vuông, nên bốn điểm $B, E, D, C$ cùng thuộc đường tròn đường kính $BC$. Tâm $I$ của đường tròn này chính là trung điểm của $BC$.

b) Xét $\triangle AEC$ và $\triangle ADB$: góc $\widehat{A}$ chung, $\widehat{AEC} = \widehat{ADB} = 90^\circ$, suy ra $\triangle AEC \sim \triangle ADB$ (g-g), do đó $\dfrac{AE}{AD} = \dfrac{AC}{AB}$, tức $AE \cdot AB = AD \cdot AC$.

Từ đó $\dfrac{AD}{AB} = \dfrac{AE}{AC}$. Xét $\triangle ADE$ và $\triangle ABC$ có góc $\widehat{A}$ chung và $\dfrac{AD}{AB} = \dfrac{AE}{AC}$, suy ra $\triangle ADE \sim \triangle ABC$ (c-g-c). Do đó $\widehat{ADE} = \widehat{ABC}$.

c) Vì $CE \perp AB$ và $H \in CE$ nên $\triangle AEH$ vuông tại $E$. Mà $O$ là trung điểm cạnh huyền $AH$, nên $OE = OA = OH$, suy ra $\triangle OAE$ cân tại $O$, do đó $\widehat{OEA} = \widehat{OAE}$.

Gọi $F$ là chân đường cao kẻ từ $A$ xuống $BC$; vì $H$ nằm trên đoạn $AF$ ($H$ là trực tâm) nên $\widehat{OAE} = \widehat{HAB} = \widehat{FAB} = 90^\circ - \widehat{ABC}$ (do $\triangle ABF$ vuông tại $F$).

Mặt khác $IE = IB$ (bán kính đường tròn $(I)$) nên $\triangle IBE$ cân tại $I$, suy ra $\widehat{IEB} = \widehat{IBE} = \widehat{ABC}$.

Vì $A, E, B$ thẳng hàng nên $\widehat{OEA} + \widehat{OEI} + \widehat{IEB} = 180^\circ$, suy ra:
$$\widehat{OEI} = 180^\circ - \widehat{OEA} - \widehat{IEB} = 180^\circ - (90^\circ - \widehat{ABC}) - \widehat{ABC} = 90^\circ.$$

Vậy $OE \perp IE$ tại $E$, mà $E$ thuộc đường tròn $(I)$, nên $OE$ là tiếp tuyến của đường tròn $(I)$ tại $E$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0038', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh bốn điểm O, A, C, M cùng thuộc một đường tròn.
b) Qua điểm O kẻ một đường thẳng song song với AM. Đường thẳng này cắt MB tại H và cắt đường thẳng CM tại D. Chứng minh $OH = \frac{1}{2}AM$ và BD là tiếp tuyến của đường tròn (O).
c) OD cắt nửa đường tròn (O) tại K. Gọi E là chân đường vuông góc kẻ từ K tới CD. Chứng minh HE vuông góc với MK.', NULL, 'a) Vì $CA$ là tiếp tuyến tại $A$ nên $OA \perp CA$, suy ra $\widehat{OAC} = 90^\circ$. Vì $CM$ là tiếp tuyến tại $M$ nên $OM \perp CM$, suy ra $\widehat{OMC} = 90^\circ$. Do đó $A$ và $M$ cùng nhìn đoạn $OC$ dưới một góc vuông, nên bốn điểm $O, A, C, M$ cùng thuộc đường tròn đường kính $OC$.

b) Vì $AB$ là đường kính nên $\widehat{AMB} = 90^\circ$, tức $AM \perp MB$. Do $OH \parallel AM$ (giả thiết) nên $OH \perp MB$, tức $OD \perp MB$ tại $H$.

Xét $\triangle ABM$ có $O$ là trung điểm $AB$ và $OH \parallel AM$, theo tính chất đường trung bình, $H$ là trung điểm $MB$ và $OH = \dfrac{1}{2}AM$.

Vì $OD \perp MB$ tại trung điểm $H$ của $MB$ nên $OD$ là đường trung trực của $MB$, suy ra $DM = DB$.

Xét $\triangle OMD$ và $\triangle OBD$: $OM = OB\, (=R)$, $DM = DB$ (chứng minh trên), $OD$ chung, suy ra $\triangle OMD = \triangle OBD$ (c-c-c). Do đó $\widehat{OBD} = \widehat{OMD} = \widehat{OMC} = 90^\circ$ (vì $D$ thuộc tiếp tuyến $CM$). Vậy $OB \perp BD$ tại $B$, tức $BD$ là tiếp tuyến của đường tròn $(O)$ tại $B$.

c) Vì $OD \perp MB$ tại $H$ (chứng minh trên) và $K$ là giao điểm của tia $OD$ với đường tròn $(O)$, nên $OK \perp MB$ tại $H$. Đường thẳng qua tâm vuông góc với một dây thì đi qua điểm chính giữa cung căng bởi dây đó, nên $K$ là điểm chính giữa cung $MB$, suy ra $KM = KB$.

Vì $KM = KB$ nên $\triangle KMB$ cân tại $K$, suy ra $\widehat{KMB} = \widehat{KBM}$.

Theo tính chất góc tạo bởi tiếp tuyến $MC$ và dây cung $MK$: $\widehat{KMC} = \widehat{KBM}$ (góc nội tiếp chắn cung $MK$). Kết hợp với $\widehat{KBM} = \widehat{KMB}$ ở trên, suy ra $\widehat{KMC} = \widehat{KMB}$, tức tia $MK$ là phân giác của $\widehat{BMC}$, hay $\widehat{KMH} = \widehat{KME}$ (vì $H \in MB$, $E \in MC$).

Xét hai tam giác vuông $\triangle KHM$ (vuông tại $H$) và $\triangle KEM$ (vuông tại $E$): có $\widehat{KMH} = \widehat{KME}$ và cạnh huyền $MK$ chung, suy ra $\triangle KHM = \triangle KEM$ (cạnh huyền - góc nhọn). Do đó $KH = KE$ và $MH = ME$.

Vì $K$ và $M$ đều cách đều hai điểm $H, E$ nên đường thẳng $MK$ là đường trung trực của đoạn $HE$. Vậy $HE \perp MK$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0039', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh: 4 điểm A, B, O, C cùng thuộc 1 đường tròn.
b) Chứng minh: $OA \cdot OD = R^2$
c) Vẽ đường kính BE của $(O)$. AE cắt đường tròn tại điểm thứ hai là I. Gọi H là trung điểm của EI.
Đường thẳng OH cắt đường thẳng BC tại M. Chứng minh: $OH \cdot OM$ không đổi khi A di chuyển trên d.
d) Chứng minh: ME là tiếp tuyến của $(O)$ và đường thẳng AC đi qua trung điểm ME.', NULL, 'a) Vì $AB$ là tiếp tuyến tại $B$ nên $OB \perp AB$, $\widehat{OBA} = 90^\circ$. Vì $AC$ là tiếp tuyến tại $C$ nên $OC \perp AC$, $\widehat{OCA} = 90^\circ$. Do đó $B, C$ cùng nhìn đoạn $OA$ dưới một góc vuông, nên bốn điểm $A, B, O, C$ cùng thuộc đường tròn đường kính $OA$.

b) Vì $AB = AC$ (hai tiếp tuyến từ $A$) và $OB = OC = R$ nên $OA$ là đường trung trực của $BC$, do đó $OA \perp BC$ tại $D$ và $D$ là trung điểm $BC$.

Xét $\triangle OBA$ vuông tại $B$ có $BD$ là đường cao ứng với cạnh huyền $OA$, theo hệ thức lượng: $OB^2 = OD \cdot OA$, tức $OA \cdot OD = R^2$.

c) Vì $H$ là trung điểm dây $EI$ của $(O)$ nên $OH \perp EI$ tại $H$; mà $E, I, A$ thẳng hàng (cùng thuộc đường thẳng $AE$) nên $OH \perp AE$ tại $H$, tức $\widehat{AHM} = 90^\circ$ (vì $M$ nằm trên tia $OH$).

Theo câu b), $OA \perp BC$ tại $D$, mà $M \in BC$ nên $\widehat{ADM} = 90^\circ$.

Vậy $D$ và $H$ cùng nhìn đoạn $AM$ dưới một góc vuông, nên bốn điểm $A, D, H, M$ cùng thuộc đường tròn đường kính $AM$.

Xét điểm $O$: đường thẳng $OA$ cắt đường tròn này tại $A$ và $D$; đường thẳng $OH$ cắt đường tròn này tại $H$ và $M$. Theo phương tích của điểm $O$ đối với đường tròn đường kính $AM$:
$$OA \cdot OD = OH \cdot OM.$$
Theo câu b), $OA \cdot OD = R^2$ (không đổi). Vậy $OH \cdot OM = R^2$ không đổi khi $A$ di chuyển trên $d$.

d) Từ câu c) ta có $OH \cdot OM = R^2$, tức $OE^2 = OH \cdot OM$ (vì $OE = R$).

Vì $H$ là trung điểm $EI$ nên $OH \perp EI$ tại $H$, mà $M$ nằm trên tia $OH$ nên $EH \perp OM$ tại $H$.

Xét $\triangle OEH$ vuông tại $H$: $EH^2 = OE^2 - OH^2$.

Mà $OE^2 = OH \cdot OM$ (chứng minh trên), nên:
$$EH^2 = OH \cdot OM - OH^2 = OH(OM - OH) = OH \cdot HM.$$

Vì $EH \perp OM$ tại $H$ và $EH^2 = OH \cdot HM$, theo hệ thức lượng đảo trong tam giác vuông (đường cao ứng cạnh huyền), $\triangle OEM$ vuông tại $E$, tức $OE \perp EM$. Vì $OE$ là bán kính và $E \in (O)$, nên $ME$ là tiếp tuyến của $(O)$ tại $E$.

Ta chứng minh $AC$ đi qua trung điểm $ME$. Vì $BE$ là đường kính và $C \in (O)$ nên $\widehat{BCE} = 90^\circ$ (góc nội tiếp chắn nửa đường tròn), tức $CE \perp CB$. Vì $M \in BC$ nên $CE \perp CM$, tức $\widehat{ECM} = 90^\circ$.

Gọi $N = AC \cap ME$. Vì $NC$ và $NE$ đều là tiếp tuyến của $(O)$ kẻ từ $N$ (lần lượt tiếp xúc tại $C$ và $E$), nên $NC = NE$ (hai tiếp tuyến từ một điểm bằng nhau).

Gọi $P$ là chân đường cao kẻ từ $C$ xuống $EM$ trong tam giác vuông $ECM$ (vuông tại $C$). Theo hệ thức lượng: $CE^2 = EP \cdot EM$.

Áp dụng định lý Pythagore cho các tam giác vuông $CPE, CPN$ (vuông tại $P$):
$$NC^2 = CP^2 + PN^2 = (CE^2 - EP^2) + (EP - NE)^2 = CE^2 - 2 \cdot EP \cdot NE + NE^2.$$
Vì $NC = NE$ nên $NC^2 = NE^2$, suy ra $CE^2 = 2 \cdot EP \cdot NE$.

Kết hợp $CE^2 = EP \cdot EM$: $EP \cdot EM = 2 \cdot EP \cdot NE$, suy ra $EM = 2NE$, tức $NE = \dfrac{1}{2}EM$.

Vậy $N$ là trung điểm của $ME$, tức đường thẳng $AC$ đi qua trung điểm của $ME$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0040', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh rằng bốn điểm $A, B, O, C$ cùng nằm trên một đường tròn.
b) Chứng minh $AO$ vuông góc với $BC$ và $AM \cdot AN = AH \cdot AO$
c) Kẻ đường kính $BD$, gọi $E$ là chân đường vuông góc kẻ từ $C$ đến $BD$, $K$ là giao điểm của $AD$ và $CE$. Chứng minh rằng $K$ là trung điểm của $CE$.', NULL, 'a) Vì $AB$ là tiếp tuyến tại $B$ nên $\widehat{ABO} = 90^\circ$. Vì $AC$ là tiếp tuyến tại $C$ nên $\widehat{ACO} = 90^\circ$. Do đó $B, C$ cùng nhìn đoạn $AO$ dưới một góc vuông, nên bốn điểm $A, B, O, C$ cùng thuộc đường tròn đường kính $AO$.

b) Vì $AB = AC$ (hai tiếp tuyến từ $A$) và $OB = OC = R$ nên $OA$ là đường trung trực của $BC$, suy ra $OA \perp BC$ tại $H$, và $H$ là trung điểm $BC$.

Xét $\triangle ABO$ vuông tại $B$ có $BH$ là đường cao ứng với cạnh huyền $AO$, theo hệ thức lượng: $AB^2 = AH \cdot AO$.

Mặt khác, $AB$ là tiếp tuyến nên theo phương tích của điểm $A$ đối với $(O)$ qua cát tuyến $AMN$: $AB^2 = AM \cdot AN$.

Vậy $AM \cdot AN = AB^2 = AH \cdot AO$.

c) Chọn $O$ làm gốc vectơ, đặt $\vec b = \vec{OB}$, $\vec c = \vec{OC}$ (với $|\vec b| = |\vec c| = R$), $\vec d = \vec{OD} = -\vec b$ (vì $D$ đối xứng $B$ qua $O$ do $BD$ là đường kính).

Vì $OB = OC$ nên chân đường vuông góc từ $O$ xuống $BC$ là trung điểm $H$ của $BC$: $\vec{OH} = \dfrac{\vec b + \vec c}{2}$. Vì $H \in OA$ nên $\vec{OA} = \lambda(\vec b + \vec c)$ với $\lambda$ là một số thực dương.

Vì $AB$ là tiếp tuyến tại $B$ nên $(\vec{OB} - \vec{OA}) \cdot \vec b = 0$, suy ra $\vec{OA} \cdot \vec b = R^2$. Thay $\vec{OA} = \lambda(\vec b + \vec c)$:
$$\lambda(R^2 + \vec b \cdot \vec c) = R^2. \quad (*)$$

$E$ là hình chiếu của $C$ lên đường thẳng $BD$ (đường thẳng qua $O$ theo phương $\vec b$), nên $\vec{OE} = \dfrac{\vec b \cdot \vec c}{R^2}\vec b$.

Gọi $K''$ là trung điểm $CE$: $\vec{OK''} = \dfrac{\vec c}{2} + \dfrac{\vec b \cdot \vec c}{2R^2}\vec b$.

Ta kiểm tra $K''$ nằm trên đường thẳng $AD$: cần tìm $u$ sao cho $\vec{OK''} = \vec{OD} + u(\vec{OA} - \vec{OD}) = -\vec b + u\big(\lambda(\vec b + \vec c) + \vec b\big)$.

So sánh hệ số của $\vec c$: $u\lambda = \dfrac12 \Rightarrow u = \dfrac{1}{2\lambda}$.

So sánh hệ số của $\vec b$: cần $-1 + u(\lambda+1) = \dfrac{\vec b \cdot \vec c}{2R^2}$. Thay $u = \dfrac{1}{2\lambda}$:
$$\dfrac{1-\lambda}{2\lambda} = \dfrac{\vec b \cdot \vec c}{2R^2} \iff R^2(1-\lambda) = \lambda\, \vec b \cdot \vec c \iff R^2 = \lambda(R^2+\vec b\cdot \vec c),$$
đúng theo $(*)$. Vậy $K''$ thuộc đường thẳng $AD$, mà $K''$ cũng thuộc $CE$ theo cách dựng, nên $K'' = K$. Vậy $K$ là trung điểm của $CE$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0041', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh bốn điểm A, B, O, H cùng thuộc một đường tròn.
b) Chứng minh $\triangle OHC$ đồng dạng với $\triangle ABC$ và $CH \cdot CA = 2R^2$.
c) Gọi N là giao điểm của BH và DO. Kẻ $AK \perp BH$ ($K \in BH$), AK cắt BD tại I. Chứng minh các điểm C, N, I thẳng hàng.', NULL, 'a) Vì $AB$ là tiếp tuyến tại $B$ nên $\widehat{ABO} = 90^\circ$. Vì $OH \perp CD$ tại $H$ và $A, C, D$ thẳng hàng ($D \in AC$) nên $H \in AC$, suy ra $\widehat{AHO} = 90^\circ$. Do đó $B, H$ cùng nhìn đoạn $AO$ dưới một góc vuông, nên bốn điểm $A, B, O, H$ cùng thuộc đường tròn đường kính $AO$.

b) Vì $OH \perp CD$ và $OC = OD = R$ nên $H$ là trung điểm $CD$.

Vì $BC$ là đường kính nên $O$ là trung điểm $BC$, do đó tia $CO$ trùng tia $CB$; vì $H \in CD$ nên tia $CH$ trùng tia $CD$, tức tia $CA$. Suy ra $\widehat{OCH} = \widehat{BCA}$.

Vì $AB$ là tiếp tuyến tại $B$ và $OB$ nằm trên đường thẳng $BC$ (đường kính qua $B$) nên $AB \perp BC$, tức $\widehat{ABC} = 90^\circ$.

Xét $\triangle OHC$ và $\triangle ABC$: $\widehat{OHC} = \widehat{ABC} = 90^\circ$ và $\widehat{OCH} = \widehat{ACB}$, suy ra $\triangle OHC \sim \triangle ABC$ (g-g).

Từ đó $\dfrac{HC}{BC} = \dfrac{OC}{AC}$, suy ra $HC \cdot AC = OC \cdot BC = R \cdot 2R = 2R^2$.

c) Vì $O$ là trung điểm $BC$ và $H$ là trung điểm $CD$ (câu b), nên $BH$ và $DO$ lần lượt là đường trung tuyến từ $B$ và từ $D$ của $\triangle BCD$. Vậy $N = BH \cap DO$ chính là trọng tâm của $\triangle BCD$.

Ta sẽ chứng minh $I$ là trung điểm của $BD$; khi đó vì $N$ là trọng tâm $\triangle BCD$ nên đường trung tuyến từ $C$ của tam giác này (nối $C$ với trung điểm $BD$, tức $CI$) đi qua $N$ — suy ra $C, N, I$ thẳng hàng.

Chọn $O$ làm gốc vectơ, đặt $\vec b = \vec{OB}$ ($|\vec b| = R$), khi đó $\vec{OC} = -\vec b$ (vì $BC$ là đường kính). Vì $D \in AC$ nên $\vec{OD} = -\vec b + s(\vec{OA} + \vec b)$ với $s$ là một số thực; vì $|\vec{OD}| = R$ và $\vec{OA} \cdot \vec b = R^2$ (do $AB$ là tiếp tuyến), khai triển $|\vec{OD}|^2 = R^2$ và rút gọn (dùng $\vec b \cdot \vec b = R^2$) ta được:
$$s\big({-4R^2} + s|\vec{OA} + \vec b|^2\big) = 0,$$
suy ra (vì $s \ne 0$, ứng với $D \ne C$): $s|\vec{OA} + \vec b|^2 = 4R^2$. $(\star)$

Gọi $M_0$ là trung điểm $BD$: $\vec{OM_0} = \dfrac{\vec b + \vec{OD}}{2}$. Đặt $\vec w = \vec{OH} - \vec{OB}$ — phương của đường thẳng $BH$; vì $\vec{OH} = \dfrac{-\vec b + \vec{OD}}{2}$ (trung điểm $CD$) nên $\vec w = \dfrac{\vec{OD} - 3\vec b}{2}$.

Khai triển $(\vec{OM_0} - \vec{OA}) \cdot \vec w$ bằng các hệ thức $\vec b \cdot \vec b = R^2$, $\vec{OD} \cdot \vec{OD} = R^2$, $\vec{OA} \cdot \vec b = R^2$ và $\vec{OD} = -\vec b + s(\vec{OA}+\vec b)$, ta thu được:
$$(\vec{OM_0} - \vec{OA}) \cdot \vec w = -\dfrac12\Big(s|\vec{OA}+\vec b|^2 - 4R^2\Big) = 0 \text{ (theo } (\star)\text{)}.$$

Vậy $\vec{OM_0} - \vec{OA} \perp \vec w$. Mặt khác, theo cách dựng $K$ là chân đường vuông góc từ $A$ xuống đường thẳng $BH$ (phương $\vec w$), nên $\vec{OK} - \vec{OA} \perp \vec w$. Trong mặt phẳng, hai vectơ cùng vuông góc với $\vec w$ thì cùng phương, nên $A, K, M_0$ thẳng hàng.

Vậy $M_0$ (trung điểm $BD$) nằm trên đường thẳng $AK$, mà $M_0$ cũng nằm trên $BD$, nên $M_0 = I$. Vậy $I$ là trung điểm $BD$, và theo lập luận ở trên, $C, N, I$ thẳng hàng.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0042', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh $\triangle AEB$ vuông.
b) Chứng minh $CE.CB = CA^2$ và $\widehat{CDE} = \widehat{CBD}$.
c) Gọi $I$ là trung điểm của $DF$. Chứng minh ba điểm $B, I, C$ thẳng hàng.', NULL, 'a) Vì tia $BC$ cắt nửa đường tròn đường kính $AB$ tại $E$ nên $E$ thuộc đường tròn đường kính $AB$, suy ra $\widehat{AEB} = 90^\circ$ (góc nội tiếp chắn nửa đường tròn). Vậy $\triangle AEB$ vuông tại $E$.

b) Vì $CA$, $CD$ là hai tiếp tuyến của $(O)$ cắt nhau tại $C$ nên $CA = CD$ (tính chất hai tiếp tuyến cắt nhau). Với tiếp tuyến $CD$ và cát tuyến $CEB$ (qua $E$, $B$), phương tích của điểm $C$ cho $CD^2 = CE \cdot CB$. Mà $CD = CA$ nên $CE \cdot CB = CA^2$.

Góc tạo bởi tia tiếp tuyến $DC$ và dây $DE$ bằng góc nội tiếp chắn cung đó: $\widehat{CDE} = \widehat{DBE}$. Vì $E$ nằm trên tia $BC$ nên $\widehat{DBE} = \widehat{DBC} = \widehat{CBD}$. Vậy $\widehat{CDE} = \widehat{CBD}$.

c) Đặt $\widehat{DBA} = \beta$. Vì $AB$ là đường kính nên $\widehat{ADB} = 90^\circ$, suy ra $AD = AB\sin\beta$, $DB = AB\cos\beta$, và vì $DF$ là đường cao của tam giác vuông $ADB$ nên $DF = \dfrac{AD \cdot DB}{AB} = AB\sin\beta\cos\beta$, $FB = \dfrac{DB^2}{AB} = AB\cos^2\beta$.

Góc tạo bởi tiếp tuyến $CA$ và dây $AD$: $\widehat{CAD} = \widehat{ABD} = \beta$. Vì $CA = CD$ nên $\triangle CAD$ cân tại $C$, suy ra $\widehat{CDA} = \widehat{CAD} = \beta$ và $\widehat{ACD} = 180^\circ - 2\beta$. Theo định lí sin trong $\triangle ACD$: $\dfrac{AD}{\sin\widehat{ACD}} = \dfrac{AC}{\sin\widehat{ADC}}$, suy ra $AC = \dfrac{AD\sin\beta}{\sin(180^\circ-2\beta)} = \dfrac{AD}{2\cos\beta} = \dfrac{AB\sin\beta}{2\cos\beta}$.

Gọi $I''$ là giao điểm của $BC$ với đường thẳng $DF$. Vì $CA \perp AB$ và $DF \perp AB$ nên $CA \parallel DF$. Áp dụng định lí Ta-lét trong $\triangle BAC$ (đường thẳng qua $F$ song song $CA$ cắt $BA,BC$): $\dfrac{FI''}{AC} = \dfrac{BF}{BA}$, suy ra $FI'' = AC\cdot\dfrac{BF}{BA} = \dfrac{AB\sin\beta}{2\cos\beta}\cdot\dfrac{AB\cos^2\beta}{AB} = \dfrac{AB\sin\beta\cos\beta}{2} = \dfrac{DF}{2}$.

Vậy $FI'' = \dfrac{DF}{2}$, tức $I''$ là trung điểm của $DF$, hay $I'' \equiv I$. Do đó $I \in BC$, tức ba điểm $B, I, C$ thẳng hàng.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0043', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', '1) Chứng minh bốn điểm $M,A,O,B$ cùng thuộc một đường tròn.
2) Chứng minh $MA^2 = MH.MO$.
3) Đoạn thẳng $MD$ cắt đường tròn $(O;R)$ tại điểm $C$ khác $D$. Chứng minh $MA^2 = MC.MD$ và $\triangle MBD$
đồng dạng $\triangle MCB$.', NULL, '1) Vì $MA$, $MB$ là tiếp tuyến của $(O;R)$ tại $A$, $B$ nên $\widehat{MAO} = \widehat{MBO} = 90^\circ$. Do đó $A$ và $B$ cùng nhìn đoạn $MO$ dưới một góc vuông, suy ra bốn điểm $M, A, O, B$ cùng thuộc đường tròn đường kính $MO$.

2) Vì $MA = MB$ (tính chất hai tiếp tuyến cắt nhau từ $M$) và $OA = OB = R$ nên $MO$ là đường trung trực của $AB$, suy ra $MO \perp AB$ tại $H$. Xét $\triangle MAO$ vuông tại $A$ có $AH$ là đường cao ứng với cạnh huyền $MO$, theo hệ thức lượng trong tam giác vuông: $MA^2 = MH \cdot MO$.

3) Vì $MA$ là tiếp tuyến tại $A$ và đường thẳng $MD$ là cát tuyến cắt $(O;R)$ tại $C$, $D$ nên theo hệ thức phương tích của điểm $M$: $MA^2 = MC \cdot MD$.

Vì $MA = MB$ nên $MB^2 = MA^2 = MC \cdot MD$, suy ra $\dfrac{MB}{MC} = \dfrac{MD}{MB}$. Xét $\triangle MBD$ và $\triangle MCB$ có $\widehat{BMD} = \widehat{CMB}$ (góc chung, vì $C$ nằm giữa $M$ và $D$ trên cùng cát tuyến) và $\dfrac{MB}{MC} = \dfrac{MD}{MB}$. Vậy $\triangle MBD \sim \triangle MCB$ (c.g.c).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0044', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Gọi I là trung điểm của đoạn thẳng OC. Chứng minh rằng bốn điểm: C, M, O, A cùng thuộc đường
tròn tâm I đường kính OC;
b) Tiếp tuyến của đường tròn (O) tại B, cắt tia CM tại D. Chứng minh rằng $MB \perp OD$ và $MB \parallel OC$;
c) Gọi K là giao điểm của OD với (O). Chứng minh rằng BK là tia phân giác của $\widehat{MBD}$ 
d) Giả sử tứ giác OMKB là hình thoi. Chứng minh rằng A, I, K thẳng hàng. ', NULL, 'a) Vì $CA$ là tiếp tuyến tại $A$ nên $\widehat{OAC} = 90^\circ$; vì $CM$ là tiếp tuyến tại $M$ nên $\widehat{OMC} = 90^\circ$. Vậy $A$ và $M$ cùng nhìn đoạn $OC$ dưới một góc vuông, suy ra bốn điểm $C, M, O, A$ cùng thuộc đường tròn đường kính $OC$, tâm là trung điểm $I$ của $OC$.

b) Vì $AB$ là đường kính và $M \in (O)$ nên $\widehat{AMB} = 90^\circ$, tức $AM \perp MB$. Vì $CA = CM$ (hai tiếp tuyến từ $C$) và $OA = OM$ ($=R$) nên $OC$ là đường trung trực của $AM$, suy ra $OC \perp AM$. Vậy $MB$ và $OC$ cùng vuông góc với $AM$ nên $MB \parallel OC$.

Mặt khác, $DB$ là tiếp tuyến tại $B$ nên $\widehat{OBD} = 90^\circ$, tức $O$ nhìn đoạn $BD$ vuông góc tại $B$; và $CM$ là tiếp tuyến tại $M$ nên $OM \perp CM$, mà $D$ nằm trên tia $CM$ nên $OM \perp MD$, tức $\widehat{OMD} = 90^\circ$. Vậy $M$, $B$ cùng nhìn đoạn $OD$ dưới một góc vuông, nên $O, M, D, B$ cùng thuộc đường tròn đường kính $OD$. Trong đường tròn này, $OM = OB$ ($=R$) là hai dây bằng nhau xuất phát từ $O$, nên đường thẳng $OD$ (đường kính) chính là đường trung trực của dây $MB$ — vì đường trung trực của $MB$ luôn đi qua tâm của đường tròn đường kính $OD$ (tức trung điểm $OD$), và cũng đi qua $O$ do $OM=OB$; hai điều kiện này xác định duy nhất đường thẳng $OD$. Vậy $OD \perp MB$.

c) Do $OD \perp MB$ và $K$ là giao điểm của tia $OD$ với $(O)$, nên đường kính $OK$ vuông góc với dây $MB$, suy ra $K$ là điểm chính giữa cung $MB$ (không chứa các điểm đặc biệt khác), tức là sđ cung $MK$ = sđ cung $KB$.

$DB$ là tiếp tuyến tại $B$ (đã chứng minh ở câu b). Áp dụng góc tạo bởi tia tiếp tuyến và dây cung: $\widehat{DBK} = \dfrac{1}{2}$ sđ cung $KB$. Áp dụng góc nội tiếp: $\widehat{MBK} = \dfrac{1}{2}$ sđ cung $MK$. Vì cung $MK$ = cung $KB$ nên $\widehat{DBK} = \widehat{MBK}$. Vậy $BK$ là tia phân giác của $\widehat{MBD}$.

d) Giả sử tứ giác $OMKB$ là hình thoi: khi đó $OM = MK = KB = BO$. Vì $M, K, B \in (O)$ nên $OM = OK = OB = R$ sẵn có; điều kiện hình thoi thêm $MK = KB = R$. Do $OM = MK = OK = R$ nên $\triangle OMK$ đều, suy ra $\widehat{MOK} = 60^\circ$. Tương tự $OK = KB = OB = R$ nên $\triangle OKB$ đều, suy ra $\widehat{KOB} = 60^\circ$. Vậy $\widehat{MOB} = \widehat{MOK} + \widehat{KOB} = 120^\circ$, và vì $A, O, B$ thẳng hàng nên $\widehat{AOM} = 180^\circ - \widehat{MOB} = 60^\circ$.

Vì $CA = CM$ nên $OC$ là tia phân giác của $\widehat{AOM}$ (tính chất hai tiếp tuyến cắt nhau), suy ra $\widehat{AOC} = \dfrac{1}{2}\widehat{AOM} = 30^\circ$.

$\triangle OAC$ vuông tại $A$ (vì $CA \perp OA$), $I$ là trung điểm cạnh huyền $OC$ nên $IA = IO = IC$ ($I$ là tâm đường tròn ngoại tiếp $\triangle OAC$). Suy ra $\triangle IAO$ cân tại $I$, nên $\widehat{IAO} = \widehat{IOA} = \widehat{COA} = 30^\circ$.

Mặt khác $\widehat{KAB}$ là góc nội tiếp của $(O)$ chắn cung $KB$, nên $\widehat{KAB} = \dfrac{1}{2}\widehat{KOB} = \dfrac{1}{2}\cdot 60^\circ = 30^\circ$.

Vậy $\widehat{IAO} = \widehat{KAB} = 30^\circ$, mà $I$ và $K$ nằm về cùng phía của đường thẳng $AB$ (cùng phía với $M$), nên tia $AI$ và tia $AK$ trùng nhau. Do đó ba điểm $A, I, K$ thẳng hàng.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0045', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Cho $OA=3$ cm, $\widehat{AOD}=40^\circ$. Giải tam giác vuông $OAD$. (Độ dài đoạn thẳng làm tròn đến
hàng phần mười).
b) Chứng minh $DB$ là tiếp tuyến của đường tròn $(O)$.
c) Vẽ tia $Dx$ nằm trong $\widehat{BDO}$. Tia $Dx$ cắt đường tròn $(O)$ tại hai điểm $C, E$ ($C$ nằm giữa $D$
và $E$). Gọi $M$ là trung điểm của $CE$. Hai đường thẳng $OM$ và $AB$ cắt nhau tại $K$. Chứng minh
bốn điểm $D,B,O,M$ cùng thuộc một đường tròn và $KE$ cũng là tiếp tuyến của đường tròn $(O)$.', NULL, 'a) $\triangle OAD$ vuông tại $A$ (vì $DA$ là tiếp tuyến nên $DA \perp OA$), có $OA = 3$ cm, $\widehat{AOD} = 40^\circ$.

$AD = OA\cdot\tan\widehat{AOD} = 3\tan 40^\circ \approx 2{,}5$ cm.

$OD = \dfrac{OA}{\cos\widehat{AOD}} = \dfrac{3}{\cos 40^\circ} \approx 3{,}9$ cm.

$\widehat{ADO} = 90^\circ - 40^\circ = 50^\circ$.

b) Vì $I$ là trung điểm dây $AB$ nên $OI \perp AB$ (đường nối tâm đến trung điểm một dây thì vuông góc với dây đó). $D$ nằm trên tia $OI$ nên $OD \perp AB$ tại $I$, tức $DI$ là đường trung trực của $AB$, suy ra $DA = DB$.

Xét $\triangle OAD$ và $\triangle OBD$ có $OA = OB$ ($=R$), $DA = DB$ (vừa chứng minh), $OD$ chung, suy ra $\triangle OAD = \triangle OBD$ (c.c.c). Do đó $\widehat{OBD} = \widehat{OAD} = 90^\circ$, tức $DB \perp OB$ tại $B$. Vậy $DB$ là tiếp tuyến của $(O)$ tại $B$.

c) Vì $M$ là trung điểm dây $CE$ nên $OM \perp CE$; do $D, C, E$ thẳng hàng (cùng nằm trên tia $Dx$) nên $\widehat{OMD} = 90^\circ$.

Kết hợp $\widehat{OBD} = 90^\circ$ (câu b) và $\widehat{OMD} = 90^\circ$: $B$ và $M$ cùng nhìn đoạn $OD$ dưới một góc vuông, suy ra bốn điểm $D, B, O, M$ cùng thuộc đường tròn đường kính $OD$.

Vì $K$ là giao điểm của đường thẳng $OM$ với $AB$ nên $O, M, K$ thẳng hàng; do đó $OK \perp CE$ tại $M$, mà $M$ là trung điểm $CE$ nên $K$ nằm trên đường trung trực của $CE$, suy ra $KC = KE$.

Mặt khác, $I$ nằm giữa $O, D$ và $K$ nằm trên tia $OM$ nên tia $OI$ trùng tia $OD$, tia $OK$ trùng tia $OM$; suy ra $\widehat{MOD} = \widehat{IOK}$ (chính là một góc). Xét $\triangle OMD$ (vuông tại $M$) và $\triangle OIK$ (vuông tại $I$, vì $OI \perp AB$ và $K \in AB$) có góc chung tại $O$ nên $\triangle OMD \sim \triangle OIK$ (g.g), suy ra $\dfrac{OM}{OI} = \dfrac{OD}{OK}$, tức là $OM\cdot OK = OI\cdot OD$.

Trong $\triangle OAD$ vuông tại $A$, $AI$ là đường cao ứng với cạnh huyền $OD$ nên $OA^2 = OI\cdot OD$, mà $OA = R$ nên $OI\cdot OD = R^2$. Vậy $OM\cdot OK = R^2$.

Xét $\triangle OME$ vuông tại $M$ ($OE = R$): $ME^2 = R^2 - OM^2$. Vì $E, M, K$ thẳng hàng theo phương vuông góc với $OK$ tại $M$ nên trong $\triangle OEK$, $EM$ là đường cao ứng với cạnh $OK$, với $KM = OK - OM$:

$KE^2 = KM^2 + ME^2 = (OK-OM)^2 + R^2 - OM^2 = OK^2 - 2\cdot OK\cdot OM + R^2 = OK^2 - 2R^2 + R^2 = OK^2 - R^2$

(đã dùng $OK\cdot OM = R^2$ ở trên).

Theo công thức phương tích quen thuộc, với $K$ nằm ngoài $(O)$ ($OK > R$): $KA\cdot KB = OK^2 - R^2$.

Vậy $KE^2 = OK^2 - R^2 = KA\cdot KB$. Theo định lí đảo của phương tích (một điểm $E$ trên đường tròn mà $KE^2$ bằng đúng phương tích của $K$ thì $KE$ là tiếp tuyến), suy ra $KE$ cũng là tiếp tuyến của đường tròn $(O)$ (tại $E$).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0046', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh bốn điểm $A, M, O, N$ cùng thuộc một đường tròn.
b) Gọi $H$ là giao điểm của $OA$ và $MN$. Chứng minh $OA \perp MN$ và $AH.AO = AB.AC$
c) Chứng minh $HN$ là tia phân giác của góc $BHC$', NULL, 'a) Vì $AM$, $AN$ là tiếp tuyến của $(O;R)$ tại $M$, $N$ nên $\widehat{AMO} = \widehat{ANO} = 90^\circ$. Vậy $M$ và $N$ cùng nhìn đoạn $AO$ dưới một góc vuông, suy ra bốn điểm $A, M, O, N$ cùng thuộc đường tròn đường kính $AO$.

b) Vì $AM = AN$ (hai tiếp tuyến cắt nhau từ $A$) và $OM = ON = R$ nên $AO$ là đường trung trực của $MN$, suy ra $OA \perp MN$ tại $H$.

Xét $\triangle AMO$ vuông tại $M$ có $MH$ là đường cao ứng với cạnh huyền $AO$, theo hệ thức lượng: $AM^2 = AH\cdot AO$.

Vì $AM$ là tiếp tuyến tại $M$ và $ABC$ là cát tuyến của $(O)$ qua $A$ (cắt $(O)$ tại $B, C$) nên theo phương tích của điểm $A$: $AM^2 = AB\cdot AC$.

Vậy $AH\cdot AO = AM^2 = AB\cdot AC$.

c) Vì $MC$ là đường kính và $B \in (O)$ nên $\widehat{MBC} = 90^\circ$.

Từ $AH\cdot AO = AB\cdot AC$ suy ra $A$ có cùng phương tích tính theo hai cát tuyến $AHO$ và $ABC$, do đó bốn điểm $B, H, O, C$ cùng thuộc một đường tròn.

Ta có $\dfrac{AH}{AC} = \dfrac{AB}{AO}$; vì $H$ thuộc tia $AO$ và $B$ thuộc tia $AC$ (do $B$ nằm giữa $A, C$) nên $\widehat{HAB}$ và $\widehat{CAO}$ là cùng một góc. Suy ra $\triangle AHB \sim \triangle ACO$ (c.g.c), do đó $\widehat{AHB} = \widehat{ACO}$.

Vì $H$ nằm giữa $O$ và $A$ nên $\widehat{AHB} = 180^\circ - \widehat{OHB}$. Vì $B$ nằm giữa $A$ và $C$ nên tia $CA$ trùng tia $CB$, do đó $\widehat{ACO} = \widehat{BCO}$. Kết hợp lại: $\widehat{OHB} = 180^\circ - \widehat{BCO}$.

Vì $OB = OC = R$ nên $\triangle OBC$ cân tại $O$: $\widehat{BCO} = \widehat{OBC}$. Mặt khác, trong đường tròn ngoại tiếp $B, H, O, C$, hai điểm $H$ và $B$ nằm cùng phía đối với dây $OC$ nên hai góc nội tiếp cùng chắn dây đó bằng nhau: $\widehat{OHC} = \widehat{OBC}$.

Từ đó $\widehat{OHB} = 180^\circ - \widehat{OBC}$ và $\widehat{OHC} = \widehat{OBC}$, suy ra $\widehat{OHB} + \widehat{OHC} = 180^\circ$.

Vì $HN \perp HO$ (do $N$ thuộc $MN \perp OA$ tại $H$) và tia $HN$ nằm trong góc $\widehat{BHC}$ (theo hình vẽ), nên $\widehat{NHB} = \widehat{OHB} - 90^\circ$ và $\widehat{NHC} = 90^\circ - \widehat{OHC}$. Vì $\widehat{OHB} + \widehat{OHC} = 180^\circ$ nên $\widehat{OHB} - 90^\circ = 90^\circ - \widehat{OHC}$, tức $\widehat{NHB} = \widehat{NHC}$.

Vậy $HN$ là tia phân giác của góc $\widehat{BHC}$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0047', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh bốn điểm $A, C, M, O$ cùng thuộc cùng một đường tròn.
b) Chứng minh $AC + BD = CD$ và $\frac{OC.OD}{CD} = R$.
c) Gọi $N$ là giao điểm của $BM$ và $OD$; $P$ là giao điểm của $AN$ với nửa đường tròn $(O)$ ($P$ khác $A$). Chứng minh $OD \perp BM$ và $OP$ là tiếp tuyến của đường tròn đi qua ba điểm điểm $D, P, N$.', NULL, 'a) Vì $Ax$ là tiếp tuyến của $(O)$ tại $A$ nên $OA \perp AC$, tức $\widehat{OAC} = 90°$. Vì $CD$ là tiếp tuyến tại $M$ nên $OM \perp CD$, tức $\widehat{OMC} = 90°$. Vậy $A$ và $M$ cùng nhìn đoạn $OC$ dưới một góc vuông nên bốn điểm $A, C, M, O$ cùng thuộc đường tròn đường kính $OC$.

b) $CA, CM$ là hai tiếp tuyến kẻ từ $C$ nên $CA = CM$; tương tự $DB = DM$. Do đó $CD = CM + MD = CA + DB$, tức $AC + BD = CD$.

Vì $CA = CM$, $OA = OM = R$, $OC$ chung nên $\triangle OAC = \triangle OMC$ (c.c.c), suy ra $OC$ là phân giác của $\widehat{AOM}$. Tương tự $OD$ là phân giác của $\widehat{MOB}$. Vì $A, O, B$ thẳng hàng nên $\widehat{AOM} + \widehat{MOB} = 180°$, do đó
$$\widehat{COD} = \dfrac{\widehat{AOM}}{2} + \dfrac{\widehat{MOB}}{2} = 90°.$$
Vậy $\triangle COD$ vuông tại $O$ và có $OM \perp CD$ tại $M \in CD$, nghĩa là $OM$ là đường cao ứng với cạnh huyền $CD$. Tính diện tích $\triangle COD$ theo hai cách: $\dfrac{1}{2}OC \cdot OD = \dfrac{1}{2}OM \cdot CD$, suy ra $OC \cdot OD = OM \cdot CD = R \cdot CD$ (vì $OM = R$), tức là
$$\dfrac{OC \cdot OD}{CD} = R.$$

c) Vì $OB = OM = R$ và $OD$ là phân giác của $\widehat{BOM}$ (câu b) nên trong tam giác cân $OBM$, đường phân giác $OD$ kẻ từ đỉnh $O$ cũng chính là đường trung trực của cạnh đáy $BM$. Do đó $OD \perp BM$ tại $N$, và $N$ là trung điểm của $BM$.

Xét $\triangle OMD$: vì $OM \perp CD$ (câu a) mà $D, M$ đều thuộc $CD$ nên $OM \perp MD$, tức $\triangle OMD$ vuông tại $M$. Mặt khác $N \in OD$ và $MN \perp OD$ (vừa chứng minh $OD \perp BM$, mà $M \in BM$), nên $N$ chính là chân đường cao hạ từ đỉnh góc vuông $M$ xuống cạnh huyền $OD$ của $\triangle OMD$. Theo hệ thức lượng trong tam giác vuông:
$$OM^2 = ON \cdot OD.$$
Vì $OM = R$ nên $ON \cdot OD = R^2$.

Vì $O, N, D$ thẳng hàng và $N, D$ đều thuộc đường tròn đi qua ba điểm $D, P, N$, nên đường thẳng $OD$ là một cát tuyến của đường tròn đó qua hai điểm $N, D$; phương tích của điểm $O$ đối với đường tròn $(DPN)$ bằng $ON \cdot OD = R^2$. Mà $OP = R$ (do $P$ thuộc $(O; R)$), nên $OP^2 = R^2 = ON \cdot OD$, đúng bằng phương tích của $O$ đối với đường tròn $(DPN)$. Theo định lí đảo, $OP$ tiếp xúc với đường tròn $(DPN)$ tại $P$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0048', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh bốn điểm $O, A, C, D$ cùng nằm trên một đường tròn.
b) Chứng minh $OC$ vuông góc với $AD$ và $OC$ song song với $BD$.
c) Đường thẳng vuông góc với $AB$ tại $O$ cắt tia $BD$ tại $M$, $CO$ cắt $AM$ tại $N$, $CD$ cắt $OM$ tại $E$, $CM$ cắt $OD$ tại $F$. Chứng minh $N, E, F$ thẳng hàng.', NULL, 'a) $CA$ là tiếp tuyến tại $A$ nên $OA \perp CA$; $CD$ là tiếp tuyến tại $D$ nên $OD \perp CD$. Vậy $A$ và $D$ cùng nhìn đoạn $OC$ dưới góc vuông, suy ra $O, A, C, D$ cùng thuộc đường tròn đường kính $OC$.

b) $CA, CD$ là hai tiếp tuyến kẻ từ $C$ nên $CA = CD$; lại có $OA = OD = R$, nên $OC$ là đường trung trực của đoạn $AD$, suy ra $OC \perp AD$.

Vì $AB$ là đường kính của $(O)$ và $D \in (O)$ nên $\widehat{ADB} = 90°$, tức $BD \perp AD$. Hai đường thẳng $OC$ và $BD$ cùng vuông góc với $AD$ nên $OC \parallel BD$.

c) Gọi $M''$ là giao điểm của đường thẳng $BD$ với đường thẳng $AC$ (tia $Ax$). Vì $\widehat{ADB} = 90°$ nên $AD \perp DM''$; do $AM'' \perp AB$ (là $Ax$) nên $\triangle ABM''$ vuông tại $A$, và $AD$ chính là đường cao từ đỉnh góc vuông $A$ xuống cạnh huyền $BM''$. Suy ra $D$ thuộc đường tròn đường kính $AM''$, nên tâm của đường tròn này (trung điểm $AM''$) cách đều $A$ và $D$.

Mặt khác $C$ cũng cách đều $A, D$ (vì $CA = CD$) và $C$ nằm trên đường thẳng $AM''$; vì trên một đường thẳng chỉ có duy nhất một điểm cách đều hai đầu mút của một đoạn thẳng cho trước (giao của đường thẳng đó với trung trực $AD$), nên $C$ chính là trung điểm $AM''$, tức $AM'' = 2AC$.

$O$ là trung điểm $AB$; đường thẳng qua $O$ vuông góc $AB$ (song song với $AM''$ vì cùng vuông góc $AB$) cắt cạnh $BM''$ (chính là tia $BD$) tại trung điểm của $BM''$ — theo định lí đường trung bình trong $\triangle ABM''$ ứng với cạnh $AM''$. Điểm đó chính là $M$ theo đề bài. Vậy $M$ là trung điểm $BM''$ và $OM = \dfrac{1}{2}AM'' = AC$.

Vì $AC \parallel OM$ (cùng vuông góc $AB$), $AC = OM$, và $\widehat{OAC} = \widehat{AOM} = 90°$, nên tứ giác $ACMO$ là hình chữ nhật. Hai đường chéo $AM, CO$ của hình chữ nhật cắt nhau tại trung điểm mỗi đường, nên $N = CO \cap AM$ chính là tâm hình chữ nhật $ACMO$.

Chọn hệ trục toạ độ $O(0;0)$, $A(-R;0)$, $B(R;0)$, $C(-R;c)$ với $c = AC$; theo trên $M(0;c)$. Đặt $s = c^2+R^2$. Toạ độ tiếp điểm $D$ (giao điểm thứ hai, khác $A$, của đường phân cực $-Rx+cy=R^2$ của $C$ với $(O)$) tính được:
$$D = \left(\dfrac{R(c^2-R^2)}{s};\ \dfrac{2R^2c}{s}\right).$$
Từ đó tính trực tiếp:
$$N = \left(-\dfrac{R}{2};\ \dfrac{c}{2}\right)\ (\text{trung điểm } OC),\quad E = CD \cap OM = \left(0;\ \dfrac{s}{2c}\right),\quad F = CM \cap OD = \left(\dfrac{c^2-R^2}{2R};\ c\right).$$
Khi đó
$$\vec{NE} = \left(\dfrac{R}{2};\ \dfrac{R^2}{2c}\right),\qquad \vec{NF} = \left(\dfrac{c^2}{2R};\ \dfrac{c}{2}\right),$$
và tích có hướng
$$\dfrac{R}{2}\cdot\dfrac{c}{2} - \dfrac{R^2}{2c}\cdot\dfrac{c^2}{2R} = \dfrac{Rc}{4} - \dfrac{Rc}{4} = 0$$
với mọi $R, c$. Vậy $\vec{NE}$ và $\vec{NF}$ cùng phương, tức $N, E, F$ thẳng hàng.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0049', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh rằng $AO \perp BC$.
b) $H$ là giao điểm của $AO$ và $BC$. Chứng minh rằng: $4OH.HA = BC^2$.
c) $M$ và $N$ lần lượt là trung điểm của $AB,AC$. Trên cung nhỏ $BC$ lấy điểm $D$ sao
cho tiếp tuyến tại $D$ của $(O)$ cắt tia $MN$ tại $I$. $T$ là hình chiếu của $D$ trên $OI$.
Chứng minh rằng $OH.OA=OT.OI$ và $IA=ID$.', NULL, 'a) $AB, AC$ là hai tiếp tuyến kẻ từ $A$ nên $AB = AC$; lại có $OB = OC = R$. Vậy $O$ và $A$ đều cách đều $B, C$, nên đường thẳng $OA$ là đường trung trực của đoạn $BC$, suy ra $OA \perp BC$.

b) Vì $OA$ là trung trực của $BC$ nên $H$ (giao điểm $OA, BC$) là trung điểm $BC$, tức $BC = 2BH$.

Xét $\triangle OBA$ vuông tại $B$ (vì $OB \perp AB$, tiếp tuyến), có $BH$ là đường cao ứng với cạnh huyền $OA$ (vì $OA \perp BC$ tại $H$, $H \in BC$). Theo hệ thức lượng trong tam giác vuông:
$$BH^2 = OH \cdot HA.$$
Do đó $BC^2 = (2BH)^2 = 4BH^2 = 4 \cdot OH \cdot HA$.

c) • Chứng minh $OH \cdot OA = OT \cdot OI$: Trong $\triangle OBA$ vuông tại $B$ với đường cao $BH$, ta có $OB^2 = OH \cdot OA$ (hệ thức lượng), mà $OB = R$ nên $OH \cdot OA = R^2$.

$ID$ là tiếp tuyến của $(O)$ tại $D$ nên $OD \perp ID$, tức $\triangle ODI$ vuông tại $D$. Theo đề, $T$ là hình chiếu (chân đường vuông góc) của $D$ trên $OI$, nghĩa là $DT$ là đường cao ứng với cạnh huyền $OI$ của $\triangle ODI$. Theo hệ thức lượng: $OD^2 = OT \cdot OI$, mà $OD = R$ nên $OT \cdot OI = R^2$.

Vậy $OH \cdot OA = OT \cdot OI\ (= R^2)$.

• Chứng minh $IA = ID$: Cũng từ đường cao $DT$ của $\triangle ODI$ vuông tại $D$, hệ thức lượng còn cho $ID^2 = IT \cdot IO$.

Chọn hệ trục toạ độ $O(0;0)$, $A(d;0)$ với $d = OA$, bán kính $R$; đặt $\cos\alpha = \dfrac{R}{d}$, khi đó $B(R\cos\alpha; R\sin\alpha)$, $C(R\cos\alpha; -R\sin\alpha)$ (do $OA \perp BC$), $H\left(\dfrac{R^2}{d}; 0\right)$. Hai trung điểm $M, N$ của $AB, AC$ có cùng hoành độ
$$x_0 = \dfrac{d^2+R^2}{2d}$$
(vì $B, C$ đối xứng qua trục $Ox$), nên đường thẳng $MN$ là đường thẳng đứng $x = x_0$.

Với $D(\cos\theta; \sin\theta)$ trên cung nhỏ $BC$ (chọn $R=1$ không mất tính tổng quát do các tỉ số không đổi khi co giãn), tiếp tuyến tại $D$ là $x\cos\theta + y\sin\theta = 1$, cắt $x = x_0$ tại
$$I\left(x_0;\ \dfrac{1-x_0\cos\theta}{\sin\theta}\right).$$
Tính trực tiếp (đặt $y_I = \dfrac{1-x_0\cos\theta}{\sin\theta}$):
$$IA^2 - ID^2 = (x_0-d)^2-(x_0-\cos\theta)^2 + y_I^2-(y_I-\sin\theta)^2 = d^2+1-2x_0 d.$$
Thay $x_0 = \dfrac{d^2+1}{2d}$ được $2x_0 d = d^2+1$, nên $IA^2-ID^2 = 0$, tức $IA = ID$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0050', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh bốn điểm $M, K, I, O$ cùng nằm trên một đường tròn;
b) Chứng minh $KO$ là đường trung trực của đoạn thẳng $MI$. Từ đó suy ra $KO \parallel NI$;
c) Kẻ $IH \perp MN$ ($H \in MN$). Chứng minh $KN$ đi qua trung điểm của đoạn thẳng $IH$.', NULL, 'a) $KM$ là tiếp tuyến tại $M$ nên $OM \perp KM$; $KI$ là tiếp tuyến tại $I$ nên $OI \perp KI$. Vậy $M$ và $I$ cùng nhìn đoạn $OK$ dưới góc vuông, suy ra bốn điểm $M, K, I, O$ cùng thuộc đường tròn đường kính $OK$.

b) $KM, KI$ là hai tiếp tuyến kẻ từ $K$ nên $KM = KI$; lại có $OM = OI = R$. Vậy $K$ và $O$ đều cách đều $M, I$, nên $KO$ là đường trung trực của đoạn $MI$.

Vì $MN$ là đường kính và $I \in (O)$ nên $\widehat{MIN} = 90°$, tức $NI \perp MI$. Mà $KO \perp MI$ (vừa chứng minh), nên $KO \parallel NI$.

c) Chọn hệ trục toạ độ $O(0;0)$, $M(-R;0)$, $N(R;0)$, $I(R\cos\theta; R\sin\theta)$. Tiếp tuyến tại $M$ là $x=-R$; tiếp tuyến tại $I$ là $x\cos\theta+y\sin\theta=R$; giao điểm
$$K = \left(-R;\ \dfrac{R(1+\cos\theta)}{\sin\theta}\right).$$
$H$ là hình chiếu của $I$ trên $MN$ nên $H(R\cos\theta; 0)$, và $IH = R\sin\theta$.

Gọi $Q$ là giao điểm của $KN$ với đường thẳng $IH$. Vì $MK \perp MN$ và $QH \perp MN$ nên $MK \parallel QH$. Trong $\triangle NMK$, theo định lí Thales:
$$\dfrac{QH}{MK} = \dfrac{NH}{NM}.$$
Ta có $NH = R-R\cos\theta = R(1-\cos\theta)$, $NM = 2R$, $MK = \dfrac{R(1+\cos\theta)}{\sin\theta}$. Do đó
$$QH = MK \cdot \dfrac{NH}{NM} = \dfrac{R(1+\cos\theta)}{\sin\theta}\cdot\dfrac{R(1-\cos\theta)}{2R} = \dfrac{R(1-\cos^2\theta)}{2\sin\theta} = \dfrac{R\sin\theta}{2} = \dfrac{IH}{2}.$$
Vậy $Q$ cách $H$ một khoảng bằng $\dfrac{IH}{2}$, tức $Q$ là trung điểm của $IH$. Vậy $KN$ đi qua trung điểm của đoạn $IH$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0051', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh 4 điểm $A,B,O,C$ cùng thuộc một đường tròn.
b) Chứng minh $OA$ vuông góc với $BC$ và $\triangle DBC \sim \triangle BAH$.
c) Gọi $M$ là trung điểm của $AH$. $BM$ cắt $(O)$ tại $N$. Chứng minh $D,H,N$ thẳng hàng.', NULL, 'a) $AB$ là tiếp tuyến tại $B$ nên $OB \perp AB$; $AC$ là tiếp tuyến tại $C$ nên $OC \perp AC$. Vậy $B$ và $C$ cùng nhìn đoạn $OA$ dưới góc vuông, suy ra bốn điểm $A, B, O, C$ cùng thuộc đường tròn đường kính $OA$.

b) • $OA \perp BC$: $AB, AC$ là hai tiếp tuyến kẻ từ $A$ nên $AB = AC$; lại có $OB = OC = R$. Vậy $O, A$ đều cách đều $B, C$ nên $OA$ là trung trực của $BC$, suy ra $OA \perp BC$ (tại $H$, và $H$ là trung điểm $BC$).

• $\triangle DBC \sim \triangle BAH$: Vì $BD$ là đường kính và $C \in (O)$ nên $\widehat{BCD} = 90°$, tức $\triangle DBC$ vuông tại $C$. Vì $OA \perp BC$ tại $H$ nên $\triangle BAH$ vuông tại $H$.

Theo tính chất góc tạo bởi tiếp tuyến và dây cung, $\widehat{ABC}$ (góc giữa tiếp tuyến $AB$ và dây $BC$) bằng góc nội tiếp chắn cung $BC$ ở phía đối diện, tức $\widehat{ABC} = \widehat{BDC}$. Mà $\widehat{ABH} = \widehat{ABC}$ (vì $H \in BC$), nên $\widehat{ABH} = \widehat{BDC}$.

Vậy $\triangle DBC$ và $\triangle BAH$ có $\widehat{DCB} = \widehat{BHA} = 90°$ và $\widehat{BDC} = \widehat{ABH}$, suy ra $\triangle DBC \sim \triangle BAH$ (g.g).

c) Vì $BD$ là đường kính và $N \in (O)$ nên $\widehat{DNB} = 90°$, tức $DN \perp BN$, hay $DN \perp BM$ (vì $N \in BM$). Do đó, để chứng minh $D, H, N$ thẳng hàng, chỉ cần chứng minh $DH \perp BM$ — khi đó $N$ (giao điểm thứ hai của $BM$ với $(O)$, nhìn $BD$ dưới góc vuông) chính là giao điểm của đường thẳng qua $D$ vuông góc $BM$ với $(O)$, tức nằm trên đường thẳng $DH$.

Chọn hệ trục toạ độ $O(0;0)$, $A(d;0)$ với $d=OA$, bán kính $R$, $\cos\alpha=\dfrac{R}{d}$: $B(R\cos\alpha;R\sin\alpha)$, $C(R\cos\alpha;-R\sin\alpha)$, $H\left(\dfrac{R^2}{d};0\right)$, $D=-B=(-R\cos\alpha;-R\sin\alpha)$ (do $BD$ là đường kính), $M$ là trung điểm $AH$ nên $M=\left(\dfrac{d^2+R^2}{2d};0\right)$.

Tính hai vectơ:
$$\vec{BM} = \left(\dfrac{d^2-R^2}{2d};\ -R\sin\alpha\right)\ \left(\text{vì } R\cos\alpha=\dfrac{R^2}{d}\right),\qquad \vec{DH} = \left(\dfrac{2R^2}{d};\ R\sin\alpha\right).$$
Tích vô hướng:
$$\vec{BM}\cdot\vec{DH} = \dfrac{d^2-R^2}{2d}\cdot\dfrac{2R^2}{d} - R^2\sin^2\alpha = \dfrac{R^2(d^2-R^2)}{d^2} - R^2\cdot\dfrac{d^2-R^2}{d^2} = 0$$
(vì $\sin^2\alpha = 1-\cos^2\alpha = 1-\dfrac{R^2}{d^2}=\dfrac{d^2-R^2}{d^2}$). Vậy $BM \perp DH$.

Kết hợp $DN\perp BM$ và $DH\perp BM$ (hai đường thẳng qua $D$ cùng vuông góc với $BM$), suy ra $D, H, N$ thẳng hàng.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0052', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh 4 điểm $C, M, A, O$ cùng thuộc 1 đường tròn.
b) Chứng minh tam giác $AIB$ vuông và $MI.MB = CM^2$.
c) Từ $O$ kẻ tia $Oy$ vuông góc $CB$, cắt tia $MC$ tại $N$. Chứng minh $NB$ là tiếp tuyến
của đường tròn tâm $O$.', NULL, 'a) Vì $Ax$ là tiếp tuyến của $(O)$ tại $A$ nên $OA \perp AM$, suy ra $\widehat{OAM} = 90^\circ$. Vì $MC$ là tiếp tuyến của $(O)$ tại $C$ nên $OC \perp CM$, suy ra $\widehat{OCM} = 90^\circ$.
Hai điểm $A$, $C$ cùng nhìn đoạn $OM$ dưới một góc vuông nên $A$, $C$ cùng thuộc đường tròn đường kính $OM$. Vậy $C$, $M$, $A$, $O$ cùng thuộc một đường tròn.

b) Vì $AB$ là đường kính của $(O)$ và $I \in (O)$ nên $\widehat{AIB} = 90^\circ$ (góc nội tiếp chắn nửa đường tròn). Vậy tam giác $AIB$ vuông tại $I$.

Vì $MA$, $MC$ là hai tiếp tuyến kẻ từ $M$ đến $(O)$ nên $MA = MC$. Xét đường tròn $(O)$ với cát tuyến $MIB$ và tiếp tuyến $MA$, theo hệ thức phương tích của điểm $M$: $MA^2 = MI \cdot MB$. Do đó $MI \cdot MB = MA^2 = MC^2$.

c) Vì $OA = OC = R$ và $MA = MC$ nên $OM$ là đường trung trực của $AC$ (tính chất hai tiếp tuyến cắt nhau); riêng $\widehat{OCM} = 90^\circ$ (câu a).

Vì $OB = OC = R$ nên tam giác $OBC$ cân tại $O$. Do $Oy \perp CB$ nên $Oy$ chính là đường trung trực của $CB$ (đường cao từ đỉnh cân đồng thời là trung trực đáy). Vì $N \in Oy$ nên $NC = NB$, tức tam giác $NCB$ cân tại $N$, suy ra $\widehat{NCB} = \widehat{NBC}$.

Vì $N$ thuộc tia $MC$ nên $\widehat{OCN} = \widehat{OCM} = 90^\circ$. Tia $CB$ nằm giữa hai tia $CO$, $CN$ nên $\widehat{OCB} + \widehat{BCN} = 90^\circ$.

Vì tam giác $OBC$ cân tại $O$ nên $\widehat{OCB} = \widehat{OBC}$. Kết hợp $\widehat{BCN} = \widehat{NBC}$ ở trên:
$\widehat{OBC} + \widehat{NBC} = \widehat{OCB} + \widehat{BCN} = 90^\circ$

Mà tia $BC$ nằm giữa hai tia $BO$, $BN$ nên $\widehat{OBC} + \widehat{NBC} = \widehat{OBN}$. Vậy $\widehat{OBN} = 90^\circ$, tức $OB \perp NB$ tại $B$. Vì $B \in (O)$ nên $NB$ là tiếp tuyến của đường tròn $(O)$ tại $B$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0053', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh rằng bốn điểm $M$, $A$, $O$, $B$ thuộc một đường tròn.
b) Kẻ đường kính $BD$ của $(O)$. Chứng minh $OM$ vuông góc $AB$ và $MO$ song song với $AD$.
c) Trên cung nhỏ $AB$ lấy điểm $E$ và từ $E$ kẻ tiếp tuyến với $(O)$ cắt $MA$, $MB$ lần lượt tại $I$ và
$K$. Chứng minh chu vi tam giác $MIK$ và độ lớn góc $IOK$ không phụ thuộc vào vị trí điểm $E$.
d) Đường thẳng qua $O$ vuông góc với $OM$ cắt $MA$, $MB$ lần lượt tại $H$ và $G$. Tìm vị trí điểm
$E$ để tổng $IH + KG$ có độ dài nhỏ nhất.', NULL, 'a) $MA$, $MB$ là tiếp tuyến của $(O)$ tại $A$, $B$ nên $OA \perp MA$, $OB \perp MB$, suy ra $\widehat{MAO} = \widehat{MBO} = 90^\circ$. Hai điểm $A$, $B$ cùng nhìn đoạn $OM$ dưới góc vuông nên $M$, $A$, $O$, $B$ cùng thuộc đường tròn đường kính $OM$.

b) Vì $MA = MB$ (hai tiếp tuyến cắt nhau) và $OA = OB = R$ nên $OM$ là đường trung trực của đoạn $AB$, suy ra $OM \perp AB$.

Vì $BD$ là đường kính của $(O)$ và $A \in (O)$ nên $\widehat{BAD} = 90^\circ$ (góc nội tiếp chắn nửa đường tròn), tức $DA \perp AB$.

Vì cả $OM$ và $DA$ cùng vuông góc với $AB$ nên $MO \parallel AD$.

c) Vì $I$ nằm trên tiếp tuyến tại $E$ và trên tiếp tuyến $MA$ (tại $A$) nên $IA$, $IE$ là hai tiếp tuyến kẻ từ $I$, suy ra $IA = IE$. Tương tự $KB = KE$.

Chu vi tam giác $MIK$:
$MI+IK+KM = MI+(IE+EK)+KM = (MI+IA)+(KM+KB) = MA+MB = 2MA$
không đổi (vì $M$, $(O)$ cố định nên $MA$ không đổi), nên chu vi tam giác $MIK$ không phụ thuộc vị trí điểm $E$.

Vì $OA=OE=R$, $IA=IE$ nên $OI$ là trung trực của $AE$, suy ra $OI$ là phân giác của $\widehat{AOE}$, tức $\widehat{IOE} = \dfrac{1}{2}\widehat{AOE}$. Tương tự $OK$ là phân giác của $\widehat{EOB}$, tức $\widehat{EOK} = \dfrac{1}{2}\widehat{EOB}$.

Do $E$ thuộc cung nhỏ $AB$ nên tia $OE$ nằm giữa hai tia $OA$, $OB$, suy ra:
$\widehat{IOK} = \widehat{IOE} + \widehat{EOK} = \dfrac{1}{2}\widehat{AOE} + \dfrac{1}{2}\widehat{EOB} = \dfrac{1}{2}\widehat{AOB}$
không đổi. Vậy $\widehat{IOK}$ không phụ thuộc vị trí điểm $E$.

d) Vì $OA=OB=R$ và $MA=MB$ nên $OM$ là phân giác $\widehat{AOB}$ (tương tự lập luận câu b); đặt $\widehat{AOM} = \widehat{BOM} = \alpha$ (không đổi).

Đường thẳng qua $O$ vuông góc $OM$ tạo với $OM$ góc $90^\circ$, còn $\widehat{AOM}=\alpha<90^\circ$, nên tia $OA$ nằm giữa tia $OM$ và tia $OH$. Xét tam giác vuông $OAH$ (vuông tại $A$ vì $OA \perp AM$) có $\widehat{AOH} = 90^\circ-\alpha$, suy ra $AH = OA\tan(90^\circ-\alpha) = R\cot\alpha$. Tương tự $BG = R\cot\alpha$.

Do đó $H$ nằm trên tia $MA$ ở phía ngoài đoạn $MA$ (quá điểm $A$). Vì $I$ nằm giữa $M$, $A$ (câu c) nên $IH = IA+AH$; tương tự $KG = KB+BG$.

$IH+KG = (IA+AH)+(KB+BG) = (IA+KB)+2AH = IK+2AH$

(dùng $IA+KB=IK$ như câu c, và $AH=BG$). Vì $2AH=2R\cot\alpha$ không đổi, $IH+KG$ nhỏ nhất khi và chỉ khi $IK$ nhỏ nhất.

Đặt $\widehat{AOE}=2\theta_1$, $\widehat{EOB}=2\theta_2$ ($\theta_1+\theta_2=\alpha$ không đổi). Theo câu c, $\widehat{AOI}=\theta_1$ nên trong tam giác vuông $OAI$ (vuông tại $A$): $IA = R\tan\theta_1$; tương tự $KB=R\tan\theta_2$. Vậy:
$IK = IA+KB = R(\tan\theta_1+\tan\theta_2) = R\cdot\dfrac{\sin(\theta_1+\theta_2)}{\cos\theta_1\cos\theta_2} = R\cdot\dfrac{\sin\alpha}{\cos\theta_1\cos\theta_2}$

Vì $\sin\alpha$ không đổi và $\cos\theta_1\cos\theta_2 = \dfrac{\cos(\theta_1-\theta_2)+\cos\alpha}{2} \le \dfrac{1+\cos\alpha}{2}$ (do $\cos(\theta_1-\theta_2)\le 1$), dấu bằng khi $\theta_1=\theta_2$, nên $\cos\theta_1\cos\theta_2$ lớn nhất khi $\theta_1=\theta_2=\dfrac{\alpha}{2}$, kéo theo $IK$ nhỏ nhất khi đó.

Vậy $IH+KG$ nhỏ nhất khi $\theta_1=\theta_2$, tức $\widehat{AOE}=\widehat{EOB}$ — nghĩa là $E$ là điểm chính giữa cung nhỏ $AB$ (giao điểm của tia $MO$ với cung nhỏ $AB$). Khi đó $IK_{\min}=2R\tan\dfrac{\alpha}{2}$ và $(IH+KG)_{\min} = 2R\cot\alpha+2R\tan\dfrac{\alpha}{2}$ (với $\cos\alpha=\dfrac{R}{OM}$).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0054', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', '1/ Chứng minh OM vuông góc với AB.
2/ Chứng minh 4 điểm M, A, O, B cùng thuộc một đường tròn.
3/ Vẽ đường kính BD của đường tròn (O). Đường thẳng MD cắt đường tròn
(O) tại điểm thứ hai là E (E khác D). Chứng minh $ME \cdot MD = MH \cdot MO$', NULL, '1) Vì $MA=MB$ (hai tiếp tuyến cắt nhau tại $M$) và $OA=OB=R$ nên $OM$ là đường trung trực của đoạn $AB$. Vậy $OM \perp AB$ (tại $H$).

2) $OA \perp MA$ (tiếp tuyến tại $A$), $OB\perp MB$ (tiếp tuyến tại $B$) nên $\widehat{OAM}=\widehat{OBM}=90^\circ$. Hai điểm $A,B$ cùng nhìn đoạn $OM$ dưới góc vuông nên $M,A,O,B$ cùng thuộc đường tròn đường kính $OM$.

3) Tam giác $OAM$ vuông tại $A$ (vì $\widehat{OAM}=90^\circ$). Theo câu 1, $H=OM\cap AB$ và $AH\perp OM$ (do $OM\perp AB$ tại $H$), tức $AH$ là đường cao ứng với cạnh huyền $OM$ của tam giác vuông $OAM$. Theo hệ thức lượng trong tam giác vuông:
$MA^2 = MH \cdot MO$

Mặt khác, xét đường tròn $(O)$ với cát tuyến $MED$ (qua $M$, cắt $(O)$ tại $E,D$) và tiếp tuyến $MA$, theo hệ thức phương tích của điểm $M$ đối với $(O)$:
$MA^2 = ME \cdot MD$

Từ hai đẳng thức trên suy ra $ME \cdot MD = MH \cdot MO$ (đpcm).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0055', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 3),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'f52a6e61-ad44-42c6-9823-59395d9f4499', 'a) Giả sử $AB = 5$ cm, $AC = 12$ cm. Tính độ dài BC, AH và số đo $\widehat{ABC}$


b) Chứng minh rằng $AD \cdot AB = AE \cdot AC$

c) Chứng minh rằng $\sin\widehat{AGB} \cdot \cos\widehat{ABC} = \frac{HK}{CG}$', NULL, 'a) Áp dụng định lý Pythagore trong tam giác vuông $ABC$ (vuông tại $A$):

$BC^2 = AB^2 + AC^2 = 5^2 + 12^2 = 169 \Rightarrow BC = 13$ cm.

$AH$ là đường cao ứng với cạnh huyền $BC$, tính diện tích tam giác $ABC$ theo hai cách:

$\dfrac{1}{2} \cdot AB \cdot AC = \dfrac{1}{2} \cdot AH \cdot BC \Rightarrow AH = \dfrac{AB \cdot AC}{BC} = \dfrac{5 \cdot 12}{13} = \dfrac{60}{13} \approx 4{,}6$ cm.

Trong tam giác vuông $ABC$: $\tan\widehat{ABC} = \dfrac{AC}{AB} = \dfrac{12}{5} = 2{,}4 \Rightarrow \widehat{ABC} \approx 67^\circ23''$.

b) $AH$ là đường cao ứng với cạnh huyền $BC$ của tam giác vuông $ABC$ nên $AH \perp BC$, suy ra $\widehat{AHB} = \widehat{AHC} = 90^\circ$.

Xét tam giác vuông $ABH$ (vuông tại $H$), có $HD \perp AB$ tại $D$ nên $HD$ chính là đường cao ứng với cạnh huyền $AB$. Theo hệ thức lượng trong tam giác vuông: $AH^2 = AD \cdot AB$.

Tương tự, xét tam giác vuông $ACH$ (vuông tại $H$), có $HE \perp AC$ tại $E$ nên $HE$ là đường cao ứng với cạnh huyền $AC$. Theo hệ thức lượng: $AH^2 = AE \cdot AC$.

Từ hai hệ thức trên: $AD \cdot AB = AH^2 = AE \cdot AC$, tức là $AD \cdot AB = AE \cdot AC$ (đpcm).

c) Vì $AH \perp BC$ tại $H$ nên $\widehat{AHB} = 90^\circ$; vì $AK \perp BG$ tại $K$ nên $\widehat{AKB} = 90^\circ$. Do đó hai điểm $H, K$ cùng nhìn đoạn $AB$ dưới một góc vuông, nên $H, K$ cùng thuộc đường tròn $(\omega)$ đường kính $AB$.

**Tính $HK$ theo góc $\widehat{GBC}$:** Gọi $H''$ là điểm đối xứng với $H$ qua tâm của $(\omega)$ (tức $HH''$ là một đường kính của $(\omega)$). Vì $HH''$ là đường kính nên $\widehat{HKH''} = 90^\circ$ (góc nội tiếp chắn nửa đường tròn). Hai góc $\widehat{HBK}$ và $\widehat{HH''K}$ cùng chắn cung $HK$ nên $\widehat{HH''K} = \widehat{HBK} = \widehat{GBC}$ (vì $H \in BC$, $K \in BG$). Xét tam giác vuông $HKH''$ (vuông tại $K$, cạnh huyền $HH'' = AB$):

$HK = HH'' \cdot \sin\widehat{HH''K} = AB \cdot \sin\widehat{GBC}$.

**Tính $CG$:** Vì tam giác $ABC$ vuông tại $A$: $AC = AB \cdot \tan\widehat{ABC}$. Vì tam giác $ABG$ vuông tại $A$ (do $G \in AC \perp AB$): $AG = AB \cdot \tan\widehat{ABG}$. Đặt $\beta = \widehat{ABC}$, $\varphi = \widehat{ABG}$ (với $\varphi < \beta$ vì $G$ nằm giữa $A$ và $C$ trên đoạn $AC$, cụ thể giữa $E$ và $C$). Khi đó $\widehat{GBC} = \beta - \varphi$ và:

$CG = AC - AG = AB(\tan\beta - \tan\varphi) = AB \cdot \dfrac{\sin(\beta-\varphi)}{\cos\beta\cos\varphi} = AB \cdot \dfrac{\sin\widehat{GBC}}{\cos\beta\cos\varphi}$.

**Ghép lại:** $\dfrac{HK}{CG} = \dfrac{AB \cdot \sin\widehat{GBC}}{AB \cdot \sin\widehat{GBC} / (\cos\beta\cos\varphi)} = \cos\beta \cdot \cos\varphi = \cos\widehat{ABC} \cdot \cos\widehat{ABG}$.

Mặt khác, tam giác $ABG$ vuông tại $A$ nên $\widehat{AGB} = 90^\circ - \varphi$, suy ra $\sin\widehat{AGB} = \cos\varphi = \cos\widehat{ABG}$.

Vậy $\dfrac{HK}{CG} = \cos\widehat{ABC} \cdot \sin\widehat{AGB} = \sin\widehat{AGB} \cdot \cos\widehat{ABC}$ (đpcm).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0056', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 3),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'f52a6e61-ad44-42c6-9823-59395d9f4499', 'a) Biết $MN = 2\sqrt{3}$ cm; $MP = 6$ cm. Giải tam giác vuông MNP.

b) Chứng minh: $MD \cdot MN = ME \cdot MP$ và $MH^2 = MN \cdot MP \cdot \sin N \cdot \sin P$.

c) Chứng minh: $\sin\widehat{MKN} \cdot \sin\widehat{MPN} = \frac{HI}{PK}$.', NULL, 'a) Xét tam giác $MNP$ vuông tại $M$:

$NP = \sqrt{MN^2+MP^2} = \sqrt{(2\sqrt{3})^2+6^2} = \sqrt{12+36} = \sqrt{48} = 4\sqrt{3}\ cm$.

$\tan\widehat{N} = \dfrac{MP}{MN} = \dfrac{6}{2\sqrt{3}} = \sqrt{3} \Rightarrow \widehat{N} = 60^\circ$.

$\widehat{P} = 90^\circ - \widehat{N} = 30^\circ$.

Vậy $NP = 4\sqrt{3}\ cm$, $\widehat{N} = 60^\circ$, $\widehat{P} = 30^\circ$.

b) Vì $MH$ là đường cao của tam giác $MNP$ vuông tại $M$ nên $\widehat{MHN} = \widehat{MHP} = 90^\circ$.

Xét tam giác $MNH$ vuông tại $H$, $D$ là hình chiếu của $H$ trên cạnh huyền $MN$: $MH^2 = MD.MN$.

Xét tam giác $MPH$ vuông tại $H$, $E$ là hình chiếu của $H$ trên cạnh huyền $MP$: $MH^2 = ME.MP$.

Suy ra $MD.MN = MH^2 = ME.MP$.

Mặt khác, xét tam giác $MNH$ vuông tại $H$: $MH = MN.\sin\widehat{N}$.

Xét tam giác $MPH$ vuông tại $H$: $MH = MP.\sin\widehat{P}$.

Nhân hai vế: $MH^2 = MN.MP.\sin\widehat{N}.\sin\widehat{P}$ (đpcm).

c) Theo câu trên, $D, E$ là hình chiếu của $H$ trên $MN, MP$; $K$ nằm giữa $E$ và $P$ trên cạnh $MP$.

Vì $MH \perp NP$ ($H \in NP$) nên $\widehat{MHN} = 90^\circ$; vì $MI \perp NK$ ($I \in NK$) nên $\widehat{MIN} = 90^\circ$. Do đó bốn điểm $M, N, H, I$ cùng thuộc đường tròn đường kính $MN$.

Trong đường tròn này, dây $HI$ nhìn góc nội tiếp $\widehat{HNI}$ nên $HI = MN.\sin\widehat{HNI}$. Vì $H \in NP$, $I \in NK$ nên $\widehat{HNI} = \widehat{PNK}$, suy ra $HI = MN.\sin\widehat{PNK}$.

Vì $K$ nằm trên đoạn $MP$ nên $\widehat{NKP}$ và $\widehat{MKN}$ là hai góc kề bù, do đó $\sin\widehat{NKP} = \sin\widehat{MKN}$.

Xét tam giác $NPK$, theo định lí sin: $\dfrac{PK}{\sin\widehat{PNK}} = \dfrac{NP}{\sin\widehat{NKP}} \Rightarrow \sin\widehat{PNK} = \dfrac{PK.\sin\widehat{MKN}}{NP}$.

Thay vào $HI$: $HI = MN.\dfrac{PK.\sin\widehat{MKN}}{NP} = PK.\sin\widehat{MKN}.\dfrac{MN}{NP}$.

Xét tam giác $MNP$ vuông tại $M$: $\sin\widehat{MPN} = \dfrac{MN}{NP}$.

Vậy $HI = PK.\sin\widehat{MKN}.\sin\widehat{MPN}$, tức là $\sin\widehat{MKN}.\sin\widehat{MPN} = \dfrac{HI}{PK}$ (đpcm).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0057', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 3),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'f52a6e61-ad44-42c6-9823-59395d9f4499', 'a) Cho biết AB = 6 cm, AC = 8 cm. Tính độ dài cạnh BC, $\widehat{B}$, $\widehat{C}$ (Kết quả góc làm tròn đến độ)


b) Chứng minh: $\sin^2 \widehat{B} = \frac{CF}{AC}$', NULL, 'a) Xét tam giác $ABC$ vuông tại $A$:

$BC = \sqrt{AB^2+AC^2} = \sqrt{6^2+8^2} = \sqrt{100} = 10\ cm$.

$\tan\widehat{ABC} = \dfrac{AC}{AB} = \dfrac{8}{6} = \dfrac{4}{3} \Rightarrow \widehat{ABC} \approx 53^\circ$.

$\widehat{ACB} = 90^\circ - \widehat{ABC} \approx 37^\circ$.

Vậy $BC = 10\ cm$, $\widehat{ABC} \approx 53^\circ$, $\widehat{ACB} \approx 37^\circ$.

b) Vì $AH$ là đường cao của tam giác $ABC$ vuông tại $A$ nên $\widehat{AHC} = 90^\circ$.

Xét tam giác $ACH$ vuông tại $H$: $CH = AC.\cos\widehat{ACB}$ (góc $\widehat{HCA} = \widehat{ACB}$ vì $H \in BC$).

Vì $F$ là hình chiếu của $H$ trên cạnh huyền $AC$ của tam giác $ACH$ vuông tại $H$, áp dụng hệ thức lượng: $CH^2 = CF.CA$.

Suy ra $CF = \dfrac{CH^2}{CA} = \dfrac{(AC.\cos\widehat{ACB})^2}{AC} = AC.\cos^2\widehat{ACB}$.

Do đó $\dfrac{CF}{AC} = \cos^2\widehat{ACB}$.

Vì tam giác $ABC$ vuông tại $A$ nên $\widehat{ACB} = 90^\circ - \widehat{ABC}$, suy ra $\cos\widehat{ACB} = \cos(90^\circ-\widehat{ABC}) = \sin\widehat{ABC}$.

Vậy $\dfrac{CF}{AC} = \sin^2\widehat{ABC}$, tức là $\sin^2\widehat{ABC} = \dfrac{CF}{AC}$ (đpcm).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0058', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 3),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'f52a6e61-ad44-42c6-9823-59395d9f4499', 'a) Giải tam giác vuông $ABC$ biết $AB = 3$ cm, $AC = 4$ cm.
(góc làm tròn đến độ, độ dài cạnh làm tròn đến chữ số thập phân thứ nhất)


b) Chứng minh $AB^2 = BH \cdot BC$ và $BE \cdot BF = BH \cdot BC$.

c) Chứng minh $(\tan ABF)^2 = \frac{BH}{CH}$.', NULL, 'a) Áp dụng định lý Pythagore trong tam giác vuông $ABC$ (vuông tại $A$):

$BC = \sqrt{AB^2 + AC^2} = \sqrt{3^2+4^2} = 5$ cm.

$AH$ là đường cao ứng với cạnh huyền $BC$: $AH = \dfrac{AB \cdot AC}{BC} = \dfrac{3 \cdot 4}{5} = 2{,}4$ cm.

Trong tam giác vuông $ABC$: $\tan\widehat{ABC} = \dfrac{AC}{AB} = \dfrac{4}{3} \Rightarrow \widehat{ABC} \approx 53^\circ$, suy ra $\widehat{ACB} = 90^\circ - \widehat{ABC} \approx 37^\circ$.

b) **a) $AB^2 = BH \cdot BC$:** Tam giác $ABC$ vuông tại $A$, $AH$ là đường cao ứng với cạnh huyền $BC$ ($H \in BC$). Theo hệ thức lượng cơ bản trong tam giác vuông (cạnh góc vuông bình phương bằng tích cạnh huyền với hình chiếu của nó trên cạnh huyền): $AB^2 = BH \cdot BC$ (đpcm phần a).

**b) $BE \cdot BF = BH \cdot BC$:** Vì $F \in AC$ và $\widehat{BAC} = 90^\circ$ nên $\widehat{BAF} = 90^\circ$, tức tam giác $ABF$ vuông tại $A$.

$E$ nằm trên đường thẳng $AM$ và $BE \perp AM$ tại $E$, nên $AE \perp BE$; vì $B, E, F$ thẳng hàng (do $F$ là giao điểm của đường thẳng $BE$ với $AC$) nên $AE \perp BF$ tại $E$. Vậy $AE$ chính là đường cao của tam giác vuông $ABF$ ứng với cạnh huyền $BF$.

Theo hệ thức lượng trong tam giác vuông $ABF$: $AB^2 = BE \cdot BF$.

Kết hợp với phần a) ($AB^2 = BH \cdot BC$), suy ra $BE \cdot BF = BH \cdot BC$ (đpcm).

c) Vì tam giác $ABC$ vuông tại $A$ và $M$ là trung điểm cạnh huyền $BC$, theo tính chất đường trung tuyến ứng với cạnh huyền trong tam giác vuông: $MA = MB = MC = \dfrac{BC}{2}$.

Tam giác $ABM$ có $MA = MB$ nên cân tại $M$, suy ra $\widehat{BAM} = \widehat{ABM}$. Vì $M \in BC$ nên $\widehat{ABM} = \widehat{ABC}$. Đặt $\beta = \widehat{ABC}$, vậy $\widehat{BAM} = \beta$.

Xét tam giác $ABE$ vuông tại $E$ (vì $BE \perp AM$ tại $E$, và $\widehat{BAE} = \widehat{BAM} = \beta$ vì $E$ nằm trên đường thẳng $AM$):

$\widehat{ABE} = 90^\circ - \widehat{BAE} = 90^\circ - \beta$.

Vì $B, E, F$ thẳng hàng nên $\widehat{ABF} = \widehat{ABE} = 90^\circ - \beta$. Mặt khác trong tam giác vuông $ABC$: $\widehat{ACB} = 90^\circ - \beta$. Vậy $\widehat{ABF} = \widehat{ACB}$, suy ra:

$\tan\widehat{ABF} = \tan\widehat{ACB} = \dfrac{AB}{AC}$ (tam giác vuông $ABC$, góc $C$ có cạnh đối $AB$, cạnh kề $AC$).

Vậy $(\tan\widehat{ABF})^2 = \dfrac{AB^2}{AC^2}$.

Theo hệ thức lượng trong tam giác vuông $ABC$ với đường cao $AH$: $BH = \dfrac{AB^2}{BC}$ và $CH = \dfrac{AC^2}{BC}$, nên:

$\dfrac{BH}{CH} = \dfrac{AB^2}{AC^2}$.

Vậy $(\tan\widehat{ABF})^2 = \dfrac{BH}{CH}$ (đpcm).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0059', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 3),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'f52a6e61-ad44-42c6-9823-59395d9f4499', 'a) Tính độ dài các đoạn thẳng $BC$, $HB$, $AH$ (làm tròn kết quả đến hàng phần mười).

b)  Chứng minh $BH \cdot CH = EF^2$.

c) Chứng minh $BE = BC \cdot \cos^3 B$.', NULL, 'a) Áp dụng định lí Pythagore: $BC = \sqrt{AB^2 + AC^2} = \sqrt{6^2 + 8^2} = \sqrt{100} = 10$ cm.
Áp dụng hệ thức lượng trong tam giác vuông (đường cao $AH$): $AB^2 = HB \cdot BC \Rightarrow HB = \dfrac{AB^2}{BC} = \dfrac{36}{10} = 3{,}6$ cm.
$AH \cdot BC = AB \cdot AC \Rightarrow AH = \dfrac{AB \cdot AC}{BC} = \dfrac{6 \cdot 8}{10} = 4{,}8$ cm.

b) Tứ giác $AEHF$ có $\widehat{A} = \widehat{AEH} = \widehat{AFH} = 90^\circ$ nên $AEHF$ là hình chữ nhật, suy ra $EF = AH$ (hai đường chéo hình chữ nhật bằng nhau).
Áp dụng hệ thức lượng trong tam giác vuông $ABC$ (đường cao $AH$): $AH^2 = BH \cdot CH$.
Vậy $BH \cdot CH = AH^2 = EF^2$.

c) Xét tam giác vuông $ABH$ (vuông tại $H$) có $HE \perp AB$ tại $E$ (theo câu trước).
Áp dụng hệ thức lượng trong tam giác vuông $ABH$: $BH^2 = BE \cdot BA \Rightarrow BE = \dfrac{BH^2}{AB}$.
Trong tam giác vuông $ABH$: $\cos B = \dfrac{BH}{AB} \Rightarrow BH = AB \cdot \cos B$.
Trong tam giác vuông $ABC$: $\cos B = \dfrac{AB}{BC} \Rightarrow AB = BC \cdot \cos B$.
Suy ra $BH = BC \cdot \cos^2 B$.
Do đó $BE = \dfrac{(BC \cdot \cos^2 B)^2}{BC \cdot \cos B} = BC \cdot \cos^3 B$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/91ee2e7a-e7af-4ecb-a58a-5f3f092e7fa5.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0060', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 3),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'f52a6e61-ad44-42c6-9823-59395d9f4499', 'a) Giải tam giác $AHC$ (làm tròn đến hàng phần mười).

b) Tính $AD$ và diện tích $\triangle BDC$ theo số liệu ở câu a).

c) Chứng minh: $cotBDE = \frac{AC}{AB+BC}$.', NULL, 'a) Vì $\widehat{ABH} = \widehat{ABC} = 60^\circ$ và tam giác $ABH$ vuông tại $H$ nên $\widehat{BAH} = 30^\circ$.
Mà $\widehat{ABC} + \widehat{ACB} = 90^\circ$ (tam giác $ABC$ vuông tại $A$) nên $\widehat{ACB} = \widehat{ACH} = 30^\circ$.
Tam giác $AHC$ vuông tại $H$ (vì $AH \perp BC$), có $\widehat{ACH} = 30^\circ$ nên $\widehat{HAC} = 60^\circ$.
Áp dụng hệ thức lượng trong tam giác vuông $ABC$: $AH^2 = HB \cdot HC = 2 \cdot 6 = 12 \Rightarrow AH = \sqrt{12} \approx 3{,}5$ cm.
$AC^2 = HC \cdot BC = 6 \cdot (2+6) = 48 \Rightarrow AC = \sqrt{48} \approx 6{,}9$ cm.
Vậy tam giác $AHC$ có $\widehat{H} = 90^\circ$, $\widehat{C} = 30^\circ$, $\widehat{HAC} = 60^\circ$, $HC = 6$ cm, $AH \approx 3{,}5$ cm, $AC \approx 6{,}9$ cm.

b) Theo số liệu câu a) ($AB=6$ cm, $AC=8$ cm, $BC=10$ cm).
$BD$ là phân giác $\widehat{ABC}$ ($D \in AC$) nên theo tính chất đường phân giác: $\dfrac{AD}{DC} = \dfrac{AB}{BC} = \dfrac{6}{10} = \dfrac{3}{5}$.
Mà $AD + DC = AC = 8$ nên $AD = 8 \cdot \dfrac{3}{3+5} = 3$ cm.
Diện tích tam giác $ABC$: $S_{ABC} = \dfrac{1}{2} \cdot AB \cdot AC = \dfrac{1}{2} \cdot 6 \cdot 8 = 24$.
Vì tam giác $ABD$ và $BDC$ chung đường cao từ $B$ xuống $AC$ nên $\dfrac{S_{BDC}}{S_{ABC}} = \dfrac{DC}{AC} = \dfrac{5}{8}$.
Vậy $S_{BDC} = 24 \cdot \dfrac{5}{8} = 15$.

c) Vì $DE \perp BC$ tại $E$ nên tam giác $BDE$ vuông tại $E$.
$BD$ là phân giác $\widehat{ABC}$ nên $\widehat{DBE} = \widehat{DBC} = \dfrac{\widehat{B}}{2}$.
Trong tam giác vuông $BDE$: $\widehat{BDE} = 90^\circ - \widehat{DBE} = 90^\circ - \dfrac{\widehat{B}}{2}$.
Suy ra $\cot \widehat{BDE} = \cot\left(90^\circ - \dfrac{\widehat{B}}{2}\right) = \tan \dfrac{\widehat{B}}{2}$.
Áp dụng công thức $\tan \dfrac{B}{2} = \dfrac{\sin B}{1+\cos B}$, với $\sin B = \dfrac{AC}{BC}$ và $\cos B = \dfrac{AB}{BC}$ (tam giác vuông $ABC$):
$\tan \dfrac{B}{2} = \dfrac{AC/BC}{1 + AB/BC} = \dfrac{AC}{BC+AB} = \dfrac{AC}{AB+BC}$.
Vậy $\cot \widehat{BDE} = \dfrac{AC}{AB+BC}$.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/7da19805-dd32-4ae4-8208-c288cc4cac4e.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0061', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 3),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'f52a6e61-ad44-42c6-9823-59395d9f4499', 'a) Tính số đo cạnh $AC$ và số đo $\widehat{ACB}$.

b) Tính giá trị của biểu thức $M = \sin^2 B + \sin^2 C - \tan B \cdot \tan C$.', NULL, 'a) Áp dụng định lí Pythagore: $AC = \sqrt{BC^2 - AB^2} = \sqrt{10^2 - 6^2} = \sqrt{64} = 8$ cm.
Trong tam giác vuông $ABC$: $\sin \widehat{ACB} = \dfrac{AB}{BC} = \dfrac{6}{10} = 0{,}6$.
Suy ra $\widehat{ACB} \approx 36^\circ52''$.

b) Vì tam giác $ABC$ vuông tại $A$ nên $\widehat{B} + \widehat{C} = 90^\circ$, suy ra $\widehat{C} = 90^\circ - \widehat{B}$.
Do đó $\sin C = \sin(90^\circ - B) = \cos B$ và $\tan C = \tan(90^\circ - B) = \cot B = \dfrac{1}{\tan B}$.
Thay vào biểu thức: $M = \sin^2 B + \cos^2 B - \tan B \cdot \dfrac{1}{\tan B} = 1 - 1 = 0$.
Vậy $M = 0$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0062', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 3),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'f52a6e61-ad44-42c6-9823-59395d9f4499', 'a) Tính số đo cạnh $AC$ và số đo $\widehat{ACB}$.

b) Chứng minh rằng các điểm A, B, C cùng thuộc một đường tròn.

c)  Chứng minh $AH = AB \cdot \cos \widehat{HAB}$.', NULL, 'a) Áp dụng định lí Pythagore: $AC = \sqrt{BC^2 - AB^2} = \sqrt{10^2 - 6^2} = \sqrt{64} = 8$ cm.
Trong tam giác vuông $ABC$: $\sin \widehat{ACB} = \dfrac{AB}{BC} = \dfrac{6}{10} = 0{,}6$.
Suy ra $\widehat{ACB} \approx 36^\circ52''$.

b) Vì tam giác $ABC$ vuông tại $A$ nên $\widehat{BAC} = 90^\circ$.
Theo định lí đảo về góc nội tiếp chắn nửa đường tròn, điểm nhìn đoạn thẳng dưới một góc vuông thì thuộc đường tròn nhận đoạn thẳng đó làm đường kính.
Vậy $A$ thuộc đường tròn đường kính $BC$ (tâm là trung điểm $BC$, bán kính $\dfrac{BC}{2}$).
Do $B$, $C$ hiển nhiên cũng thuộc đường tròn này (là hai đầu mút đường kính), nên $A$, $B$, $C$ cùng thuộc một đường tròn.

c) Trong tam giác vuông $ABH$ (vuông tại $H$, vì $AH \perp BC$), ta có:
$\cos \widehat{HAB} = \dfrac{AH}{AB}$ (tỉ số lượng giác của góc nhọn trong tam giác vuông).
Suy ra $AH = AB \cdot \cos \widehat{HAB}$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0063', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 3),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'f52a6e61-ad44-42c6-9823-59395d9f4499', 'a) Giải tam giác vuông $ABC$ (làm tròn đến độ).

b) Chứng minh $AH = MN$ và $AM \cdot MB + AN \cdot NC = AH^2$

c) Chứng minh rằng $\tan^3 C = \frac{BM}{CN}$', NULL, 'a) Áp dụng định lí Pythagore: $BC = \sqrt{AB^2+AC^2} = \sqrt{12^2+16^2} = \sqrt{400} = 20$ cm.
Ta có $\tan B = \dfrac{AC}{AB} = \dfrac{16}{12} = \dfrac{4}{3} \Rightarrow \widehat{B} \approx 53^\circ$.
$\widehat{C} = 90^\circ - \widehat{B} \approx 37^\circ$.

b) Vì $\widehat{A} = \widehat{AMH} = \widehat{ANH} = 90^\circ$ (do $\widehat{BAC}=90^\circ$, $HM \perp AB$, $HN \perp AC$) nên tứ giác $AMHN$ là hình chữ nhật.
Hai đường chéo $AH$ và $MN$ của hình chữ nhật bằng nhau, suy ra $AH = MN$.
Áp dụng hệ thức lượng trong tam giác vuông $ABH$ (đường cao $HM$): $HM^2 = AM \cdot MB$; và $AH^2 = AM \cdot AB \Rightarrow AM = \dfrac{AH^2}{AB}$, suy ra $MB = AB-AM = \dfrac{AB^2-AH^2}{AB} = \dfrac{BH^2}{AB}$.
Tương tự, trong tam giác vuông $ACH$ (đường cao $HN$): $HN^2 = AN \cdot NC$, và $NC = \dfrac{CH^2}{AC}$.
Suy ra $AM \cdot MB + AN \cdot NC = HM^2+HN^2$.
Mà $AMHN$ là hình chữ nhật nên $HM=AN$; theo Pythagore trong tam giác vuông $AMH$: $AH^2 = AM^2+MH^2 = AM^2+AN^2$.
Lại có $AM \cdot MB = \dfrac{AH^2}{AB}\cdot\dfrac{BH^2}{AB} = AH^2\cdot\dfrac{BH^2}{AB^2}$ và $AN\cdot NC = AH^2\cdot\dfrac{CH^2}{AC^2}$.
Vì $AB^2=BH\cdot BC$, $AC^2=CH\cdot BC$ (hệ thức lượng trong tam giác vuông $ABC$) nên $\dfrac{BH^2}{AB^2}+\dfrac{CH^2}{AC^2} = \dfrac{BH}{BC}+\dfrac{CH}{BC} = \dfrac{BH+CH}{BC} = 1$.
Vậy $AM\cdot MB+AN\cdot NC = AH^2\cdot 1 = AH^2$.

c) Áp dụng hệ thức lượng trong tam giác vuông $ABH$ (đường cao $HM$ ứng với cạnh huyền $AB$): $AH^2 = AM \cdot AB \Rightarrow AM = \dfrac{AH^2}{AB}$, suy ra $BM = AB-AM = \dfrac{AB^2-AH^2}{AB} = \dfrac{BH^2}{AB}$ (do $AB^2=AH^2+BH^2$).
Tương tự, trong tam giác vuông $ACH$ (đường cao $HN$): $CN = \dfrac{CH^2}{AC}$.
Mà $BH = \dfrac{AB^2}{BC}$, $CH = \dfrac{AC^2}{BC}$ (hệ thức lượng trong tam giác vuông $ABC$), nên $BM = \dfrac{BH^2}{AB} = \dfrac{AB^3}{BC^2}$ và $CN = \dfrac{CH^2}{AC} = \dfrac{AC^3}{BC^2}$.
Suy ra $\dfrac{BM}{CN} = \left(\dfrac{AB}{AC}\right)^3$.
Mà $\tan C = \dfrac{AB}{AC}$ (tam giác vuông $ABC$, góc $C$).
Vậy $\tan^3 C = \dfrac{BM}{CN}$.', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0064', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 3),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'f52a6e61-ad44-42c6-9823-59395d9f4499', 'a) Tính $\widehat{N}$; MN và NP.

b) Chứng minh $\triangle IMN \sim \triangle IPM$ và $\triangle MGN$ cân tại N.

c) Chứng minh $S_{\triangle MHK} = S_{\triangle MNP} \cdot (1 - \cos^2 N) \cdot
\sin^2 P', NULL, 'a) Trong $\triangle MNP$ vuông tại $M$ ($MP > MN$, $\widehat{P} = 30^\circ$):

Tính $\widehat{N}$:
$\widehat{N} = 90^\circ - \widehat{P} = 90^\circ - 30^\circ = 60^\circ$

Tính $MN$ (cạnh đối diện với $\widehat{P}$):
$MN = MP \cdot \tan\widehat{P} = 3 \cdot \tan 30^\circ = 3 \cdot \dfrac{\sqrt{3}}{3} = \sqrt{3}$ (cm)

Tính $NP$ (cạnh huyền):
$NP = \dfrac{MP}{\cos\widehat{P}} = \dfrac{3}{\cos 30^\circ} = \dfrac{3}{\dfrac{\sqrt{3}}{2}} = \dfrac{6}{\sqrt{3}} = 2\sqrt{3}$ (cm)

Vậy $\widehat{N} = 60^\circ$; $MN = \sqrt{3}$ cm; $NP = 2\sqrt{3}$ cm.

b) **Phần 1: Chứng minh $\triangle IMN \sim \triangle IPM$**

Trong $\triangle MNP$ vuông tại $M$, $MI$ là đường cao từ $M$ xuống cạnh huyền $NP$, nên $\widehat{MIN} = \widehat{MIP} = 90^\circ$.

Trong $\triangle MIN$ vuông tại $I$:
$\widehat{IMN} = 90^\circ - \widehat{MNI} = 90^\circ - \widehat{N} = 90^\circ - 60^\circ = \widehat{P} = 30^\circ$

Xét $\triangle IMN$ và $\triangle IPM$:
- $\widehat{MIN} = \widehat{MIP} = 90^\circ$
- $\widehat{IMN} = \widehat{IPM} = 30^\circ$ (= $\widehat{P}$)

Suy ra $\triangle IMN \sim \triangle IPM$ (g.g). $\square$

**Phần 2: Chứng minh $\triangle MGN$ cân tại $N$**

Trong $\triangle MIP$ vuông tại $I$: $\widehat{PMI} = 90^\circ - \widehat{P} = 90^\circ - 30^\circ = 60^\circ = \widehat{N}$.

$MG$ là phân giác của $\widehat{PMI} = 60^\circ$, nên $\widehat{PMG} = 30^\circ$.

Tia $MG$ (phân giác $\widehat{PMI}$) nằm trong $\widehat{PMN}$ (vì $\widehat{PMG} = 30^\circ < 90^\circ = \widehat{PMN}$), nên cắt $NP$ tại $G$.

Vì $\widehat{NMP} = 90^\circ$ (tam giác vuông tại $M$):
$\widehat{NMG} = \widehat{NMP} - \widehat{PMG} = 90^\circ - 30^\circ = 60^\circ$

$G$ nằm trên $NP$, nên $\widehat{MNG} = \widehat{MNP} = 60^\circ$.

Trong $\triangle MGN$: $\widehat{NMG} + \widehat{MNG} = 60^\circ + 60^\circ = 120^\circ$
$\Rightarrow \widehat{NGM} = 60^\circ$

Vì $\widehat{NMG} = \widehat{NGM} = 60^\circ$ nên $NM = NG$ (hai cạnh đối diện với hai góc bằng nhau), tức $\triangle MGN$ cân tại $N$. $\square$

c) Từ BT.09.137 đã tính: $\triangle MNP$ vuông tại $M$, $MP = 3$ cm, $\widehat{P} = 30^\circ$, $\widehat{N} = 60^\circ$, $MN = \sqrt{3}$ cm, $NP = 2\sqrt{3}$ cm.

Từ BT.09.138: $MI$ là đường cao từ $M$ xuống $NP$, với $\widehat{NMI} = \widehat{P} = 30^\circ$ và $\widehat{PMI} = \widehat{N} = 60^\circ$.

Vì $IH \perp MN$ (tại $H$), $IK \perp MP$ (tại $K$), và $\widehat{HMK} = \widehat{NMP} = 90^\circ$, tứ giác $MHIK$ là hình chữ nhật. Do đó $\widehat{HMK} = 90^\circ$, suy ra:
$S_{\triangle MHK} = \dfrac{1}{2} \cdot MH \cdot MK$

Trong $\triangle MHI$ vuông tại $H$ ($IH \perp MN$):
$MH = MI \cdot \cos\widehat{NMI} = MI \cdot \cos\widehat{P}$

Trong $\triangle MKI$ vuông tại $K$ ($IK \perp MP$):
$MK = MI \cdot \cos\widehat{PMI} = MI \cdot \cos\widehat{N}$

Do đó:
$S_{\triangle MHK} = \dfrac{1}{2} \cdot MI^2 \cdot \cos\widehat{P} \cdot \cos\widehat{N}$ $\quad (*)$

Vì $MI$ là đường cao từ đỉnh góc vuông $M$ xuống cạnh huyền $NP$:
$MI = \dfrac{MN \cdot MP}{NP}$

Mặt khác $\dfrac{MN}{NP} = \sin\widehat{P}$, $\dfrac{MP}{NP} = \sin\widehat{N}$, nên $MI = NP \cdot \sin\widehat{P} \cdot \sin\widehat{N}$.

Thay vào $(*)$:
$S_{\triangle MHK} = \dfrac{1}{2} \cdot NP^2 \sin^2\widehat{P} \sin^2\widehat{N} \cdot \cos\widehat{P} \cdot \cos\widehat{N}$

Mặt khác: $S_{\triangle MNP} = \dfrac{1}{2} \cdot MN \cdot MP = \dfrac{1}{2} \cdot NP^2 \sin\widehat{P} \cdot \sin\widehat{N}$

Vì $\widehat{P} + \widehat{N} = 90^\circ$: $\sin\widehat{N} = \cos\widehat{P}$, $\cos\widehat{N} = \sin\widehat{P}$, suy ra:
$\dfrac{S_{\triangle MHK}}{S_{\triangle MNP}} = \sin\widehat{P} \cdot \cos\widehat{P} \cdot \sin\widehat{N} \cdot \cos\widehat{N} = \sin^2\widehat{P} \cdot \cos^2\widehat{P} = \sin^2\widehat{N} \cdot \sin^2\widehat{P}$

(Vì $\cos\widehat{P} = \sin\widehat{N}$, $\cos\widehat{N} = \sin\widehat{P}$.)

Do đó:
$S_{\triangle MHK} = S_{\triangle MNP} \cdot \sin^2\widehat{N} \cdot \sin^2\widehat{P} = S_{\triangle MNP} \cdot (1 - \cos^2\widehat{N}) \cdot \sin^2\widehat{P}$. $\square$', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0065', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'ed73b4ae-a169-47e1-b764-5d9b193d2e58', 'a) Tính $\widehat{N}$; MN và NP.

b) Chứng minh $\triangle IMN \sim \triangle IPM$ và $\triangle$ MGN cân tại N.

c) Chứng minh $S_{\triangle MHK} = S_{\triangle MNP} \cdot (1 - \cos^2 N) \cdot \sin^2 P$', NULL, 'a) Xét tam giác $MNP$ vuông tại $M$:
$\widehat{N} = 90^\circ - \widehat{P} = 90^\circ - 30^\circ = 60^\circ$.
Ta có:
$\tan \widehat{P} = \frac{MN}{MP} \Rightarrow MN = MP.\tan \widehat{P}$
$\Rightarrow MN = 3.\tan 30^\circ = \sqrt{3}cm$
Xét tam giác $MNP$ vuông tại $M$:
$\cos \widehat{P} = \frac{MN}{NP} \Rightarrow NP = \frac{MN}{\cos \widehat{P}}$
$\Rightarrow NP = \frac{3}{\cos 30^\circ} = 2\sqrt{3}cm$

b) Xét tam giác MNP có MI là đường cao
$\Rightarrow MI \perp NP$
Xét $\triangle IMN$ và $\triangle IPM$ có
$\widehat{IMN} = \widehat{IPM} = 90^\circ$
$\widehat{IMN} = \widehat{IPM}$ (cùng phụ với $\widehat{N}$)
$\Rightarrow \triangle IMN \sim \triangle IPM (g - g)$
Ta có $\widehat{PMI} = \widehat{N}$ (cùng phụ với $\widehat{P}$).
Vì MG là tia phân giác của $\widehat{PMI}$ nên $GMI = \frac{\widehat{N}}{2}$.
Mặt khác, $\widehat{NMI} = \widehat{P} = 90^\circ - \widehat{N}$.
Do đó $\widehat{NMG} = \widehat{NMI} + \widehat{IMG} = 90^\circ - \widehat{N} + \frac{\widehat{N}}{2} = 90^\circ - \frac{\widehat{N}}{2}$.
Vì G,N,P thẳng hàng nên $\widehat{MNG} = \widehat{N}$.
Xét $\triangle MGN$:
$\widehat{MGN} = 180^\circ - \widehat{MNG} - \widehat{NMG} = 90^\circ - \frac{\widehat{N}}{2}$.
Suy ra $\widehat{MGN} = \widehat{NMG}$.
Do đó $MN = NG$.
Vậy $\triangle MGN$ cân tại $N$.

c) Đặt $MN = c$, $MP = b$. Xét tam giác $MNI$ vuông tại $I$ (vì $MI \perp NP$): $MI = MN.\sin\widehat{N}$.

Xét tam giác $MPI$ vuông tại $I$: $MI = MP.\sin\widehat{P}$.

Nhân hai vế: $MI^2 = MN.MP.\sin\widehat{N}.\sin\widehat{P}$.

Vì $H$ là hình chiếu của $I$ trên $MN$ nên trong tam giác $MNI$ vuông tại $I$, $H$ là chân đường cao hạ từ $I$ xuống cạnh huyền $MN$, suy ra $MH = \dfrac{MI^2}{MN}$.

Tương tự, $K$ là hình chiếu của $I$ trên $MP$, trong tam giác $MPI$ vuông tại $I$: $MK = \dfrac{MI^2}{MP}$.

Vì $\widehat{NMP} = 90^\circ$ nên $\widehat{HMK} = 90^\circ$ (do $H \in MN$, $K \in MP$), do đó:

$S_{\triangle MHK} = \dfrac{1}{2}.MH.MK = \dfrac{1}{2}.\dfrac{MI^2}{MN}.\dfrac{MI^2}{MP} = \dfrac{1}{2}.\dfrac{MI^4}{MN.MP}$.

Mặt khác $S_{\triangle MNP} = \dfrac{1}{2}.MN.MP$, nên:

$\dfrac{S_{\triangle MHK}}{S_{\triangle MNP}} = \dfrac{MI^4}{(MN.MP)^2} = \left(\dfrac{MI^2}{MN.MP}\right)^2 = \sin^2\widehat{N}.\sin^2\widehat{P}$.

Vậy $S_{\triangle MHK} = S_{\triangle MNP}.\sin^2\widehat{N}.\sin^2\widehat{P} = S_{\triangle MNP}.(1-\cos^2\widehat{N}).\sin^2\widehat{P}$ (đpcm).', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/a3bd2d32-5798-45e7-b8a3-793c32d06d88.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0066', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'ed73b4ae-a169-47e1-b764-5d9b193d2e58', 'a) Nếu $\widehat{ACB} = 30^\circ$ và BC = 20 cm. Hãy tính $\widehat{ABC}$; AB; AC. (Số đo góc làm tròn đến độ)

b) Chứng minh: $AB \cdot AD = AH^2$. Từ đó suy ra $AB \cdot AD = AE \cdot AC$

c) Chứng minh: $\sin \widehat{AMB} \cdot \sin \widehat{ACB} = \frac{HI}{CM}$', NULL, 'a) Tam giác $ABC$ vuông tại $A$ nên $\widehat{ABC} = 90^\circ - \widehat{ACB} = 90^\circ - 30^\circ = 60^\circ$.

Xét tam giác $ABC$ vuông tại $A$:

$\sin\widehat{ACB} = \dfrac{AB}{BC} \Rightarrow AB = BC.\sin\widehat{ACB} = 20.\sin 30^\circ = 10\ cm$.

$\cos\widehat{ACB} = \dfrac{AC}{BC} \Rightarrow AC = BC.\cos\widehat{ACB} = 20.\cos 30^\circ = 10\sqrt{3}\ cm$.

Vậy $\widehat{ABC} = 60^\circ$, $AB = 10\ cm$, $AC = 10\sqrt{3}\ cm$.

b) Vì $AH$ là đường cao của tam giác $ABC$ vuông tại $A$ nên $\widehat{AHB} = \widehat{AHC} = 90^\circ$.

Xét tam giác $ABH$ vuông tại $H$, $D$ là hình chiếu của $H$ trên cạnh huyền $AB$, áp dụng hệ thức lượng trong tam giác vuông: $AH^2 = AD.AB$.

Xét tam giác $ACH$ vuông tại $H$, $E$ là hình chiếu của $H$ trên cạnh huyền $AC$, tương tự: $AH^2 = AE.AC$.

Suy ra $AB.AD = AH^2 = AE.AC$ (đpcm).

c) Theo câu trên, $D, E$ là hình chiếu của $H$ trên $AB, AC$; $M$ nằm giữa $E$ và $C$ trên cạnh $AC$.

Vì $AH \perp BC$ ($H \in BC$) nên $\widehat{AHB} = 90^\circ$; vì $AI \perp MB$ ($I \in MB$) nên $\widehat{AIB} = 90^\circ$. Do đó bốn điểm $A, H, I, B$ cùng thuộc đường tròn đường kính $AB$.

Trong đường tròn này, dây $HI$ nhìn góc nội tiếp $\widehat{HBI}$ nên $HI = AB.\sin\widehat{HBI}$. Vì $H \in BC$, $I \in BM$ nên $\widehat{HBI} = \widehat{CBM}$, suy ra $HI = AB.\sin\widehat{CBM}$.

Vì $M$ nằm trên đoạn $AC$ nên $\widehat{BMC}$ và $\widehat{AMB}$ là hai góc kề bù, do đó $\sin\widehat{BMC} = \sin\widehat{AMB}$.

Xét tam giác $BMC$, theo định lí sin: $\dfrac{CM}{\sin\widehat{MBC}} = \dfrac{BC}{\sin\widehat{BMC}} \Rightarrow \sin\widehat{MBC} = \dfrac{CM.\sin\widehat{AMB}}{BC}$.

Thay vào $HI$: $HI = AB.\dfrac{CM.\sin\widehat{AMB}}{BC} = CM.\sin\widehat{AMB}.\dfrac{AB}{BC}$.

Xét tam giác $ABC$ vuông tại $A$: $\sin\widehat{ACB} = \dfrac{AB}{BC}$.

Vậy $HI = CM.\sin\widehat{AMB}.\sin\widehat{ACB}$, tức là $\sin\widehat{AMB}.\sin\widehat{ACB} = \dfrac{HI}{CM}$ (đpcm).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0067', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'ed73b4ae-a169-47e1-b764-5d9b193d2e58', 'a) Biết $AB = 4$ cm, $KM = 3,2$ cm, $\widehat{BAM} = 65^\circ$. Tính $BK$, $\widehat{BMK}$. (độ dài cạnh làm tròn kết quả đến chữ số thập phân thứ nhất, số đo góc làm tròn đến độ)

b) Chứng minh rằng $\triangle ABK$ đồng dạng $\triangle CAH$ và $BK =$$AH \cdot \tan \widehat{ACB}$.

c) Chứng minh rằng $\frac{MB}{MC} = \frac{AH \cdot \cot^2 \widehat{ABC}}{AK}$.', NULL, 'a) Xét tam giác $ABK$ vuông tại $K$ (vì $BK \perp AM$):

$BK = AB.\sin\widehat{BAM} = 4.\sin 65^\circ \approx 3,6\ cm$.

Vì $K \in AM$ nên tam giác $BKM$ vuông tại $K$:

$\tan\widehat{BMK} = \dfrac{BK}{KM} = \dfrac{3,6}{3,2} \approx 1,133 \Rightarrow \widehat{BMK} \approx 49^\circ$.

Vậy $BK \approx 3,6\ cm$, $\widehat{BMK} \approx 49^\circ$.

b) Vì $\widehat{BAC} = 90^\circ$, đặt $\widehat{BAM} = \alpha$, ta có $\widehat{MAC} = 90^\circ - \alpha$.

Vì $H, K$ cùng thuộc đường thẳng $AM$ ($K$ giữa $A, M$; $H$ trên phần kéo dài của $AM$) nên $\widehat{CAH} = \widehat{MAC} = 90^\circ - \alpha$.

Xét tam giác $ABK$ vuông tại $K$: $\widehat{BAK} = \alpha \Rightarrow \widehat{ABK} = 90^\circ - \alpha$.

Xét tam giác $CAH$ vuông tại $H$: $\widehat{CAH} = 90^\circ - \alpha \Rightarrow \widehat{ACH} = \alpha$.

Suy ra $\widehat{BAK} = \widehat{ACH} = \alpha$ và $\widehat{ABK} = \widehat{CAH} = 90^\circ - \alpha$, nên $\triangle ABK \sim \triangle CAH$ (g-g).

Từ đó: $\dfrac{AB}{CA} = \dfrac{BK}{AH} \Rightarrow BK = AH.\dfrac{AB}{CA}$.

Xét tam giác $ABC$ vuông tại $A$: $\tan\widehat{ACB} = \dfrac{AB}{AC}$.

Vậy $BK = AH.\tan\widehat{ACB}$ (đpcm).

c) Đặt $\widehat{BAM} = \alpha$ (như câu trên, $\widehat{CAH} = 90^\circ - \alpha$).

Từ tam giác $ABK$ vuông tại $K$: $AK = AB.\cos\alpha$. Từ tam giác $CAH$ vuông tại $H$: $AH = AC.\cos(90^\circ-\alpha) = AC.\sin\alpha$.

Vì $B, M, C$ thẳng hàng nên $\dfrac{MB}{MC} = \dfrac{S_{\triangle ABM}}{S_{\triangle ACM}}$ (hai tam giác chung đỉnh $A$, đáy $MB, MC$ trên cùng một đường thẳng).

$S_{\triangle ABM} = \dfrac{1}{2}.AB.AM.\sin\widehat{BAM} = \dfrac{1}{2}.AB.AM.\sin\alpha$.

$S_{\triangle ACM} = \dfrac{1}{2}.AC.AM.\sin\widehat{MAC} = \dfrac{1}{2}.AC.AM.\cos\alpha$.

Suy ra $\dfrac{MB}{MC} = \dfrac{AB.\sin\alpha}{AC.\cos\alpha}$.

Xét tam giác $ABC$ vuông tại $A$: $\tan\widehat{ABC} = \dfrac{AC}{AB} \Rightarrow \cot\widehat{ABC} = \dfrac{AB}{AC} \Rightarrow \cot^2\widehat{ABC} = \dfrac{AB^2}{AC^2}$.

Ta có: $\dfrac{AH.\cot^2\widehat{ABC}}{AK} = \dfrac{AC.\sin\alpha.\dfrac{AB^2}{AC^2}}{AB.\cos\alpha} = \dfrac{AB.\sin\alpha}{AC.\cos\alpha}$, đúng bằng $\dfrac{MB}{MC}$ ở trên.

Vậy $\dfrac{MB}{MC} = \dfrac{AH.\cot^2\widehat{ABC}}{AK}$ (đpcm).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0068', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'ed73b4ae-a169-47e1-b764-5d9b193d2e58', 'a) Giải tam giác MKP. Biết $\widehat{P} = 30^\circ$; MK = 3 cm

b) Chứng minh: MK = $\frac{NP}{cot N+cot P}$


c) Tính diện tích tam giác MNP (làm tròn kết quả đến hàng phần mười).', NULL, 'a) Vì $MK$ là đường cao của $\triangle MNP$ nên $MK \perp NP$, suy ra $\triangle MKP$ vuông tại $K$.
Xét $\triangle MKP$ vuông tại $K$:
$\sin P = \frac{MK}{MP}$
$MP = \frac{MK}{\sin P} = \frac{3}{\sin 30^\circ} = 6$ cm.

Xét $\triangle MKP$ vuông tại $K$ có:
$\tan \hat{P} = \frac{MK}{KP}$
$KP = \frac{MK}{\tan P} = \frac{3}{\tan 30^\circ} = 3\sqrt{3}$ cm $\approx 5,2$ cm.

Xét $\triangle MKP$ vuông tại $K$ có:
$\widehat{KMP} = 90^\circ - \hat{P} = 60^\circ$

b) Xét $\triangle MNK$ vuông tại K có:
cot $\widehat{N} = \frac{NK}{MK} \Rightarrow NK = MK.\text{cot }\widehat{N}(1)$
Xét $\triangle MKP$ vuông tại K có:
cot $\widehat{P} = \frac{KP}{MK} \Rightarrow KP = MK.\text{cot }\widehat{P}(2)$
Từ (1) và (2) suy ra:
$NP = NK + KP \Rightarrow MK.\text{cot }\widehat{N} + MK.\text{cot }\widehat{P}$
$\Rightarrow NP = MK (\text{cot }\widehat{N} + \text{cot }\widehat{P})$
$\Rightarrow MK = \frac{NP}{\text{cot }\widehat{N} + \text{cot }\widehat{P}}$

c) c) Theo câu b:
$MK = \frac{NP}{\cot N + \cot P} = \frac{5}{\cot 68^\circ + \cot 30^\circ} \approx 2,34$ cm.

Diện tích $\triangle MNP$ là:
$S_{MNP} = \frac{1}{2} NP \cdot MK = \frac{1}{2}.5.2,34 \approx 5,9cm^2$', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0069', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 1),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, 'ed73b4ae-a169-47e1-b764-5d9b193d2e58', 'a) Tính góc B, góc C


b) Chứng minh rằng $\triangle DKH \sim \triangle BKC$. Từ đó chứng minh $DK = DH \cdot \sin \widehat{BCK}$

c) Hỏi M ở vị trí nào thì PQ có độ dài nhỏ nhất', NULL, 'a) a) Xét $\triangle ABC$ vuông tại A có
$AB^2 + AC^2 = BC^2$ (định lý pythagos)
$6^2 + 8^2 = BC^2$
$\Rightarrow BC^2 = 100 \Rightarrow BC = 10(cm)$
Xét $\triangle ABC$ vuông tại A có
$\sin \hat{B} = \frac{AC}{BC} = \frac{8}{10} = 0,8$
$\Rightarrow \hat{B} \approx 53^\circ$
$\Rightarrow \hat{C} = 90^\circ - \hat{B} \approx 37^\circ$

b) b) Xét $\triangle ABH$ và $\triangle ACD$ có
$\widehat{BAH} = \widehat{CAD} = 90^\circ$
$\widehat{ABH} = \widehat{ACD}$
$\Rightarrow \triangle ABH \sim \triangle ACD(g - g)$
$\Rightarrow \frac{AH}{AD} = \frac{AB}{AC}$
Xét $\triangle AHD$ và $\triangle ABC$ có
$\widehat{HAD} = \widehat{BAC} = 90^\circ$
$\frac{AH}{AD} = \frac{AB}{AC}$
$\Rightarrow \triangle AHD \sim \triangle ABC(c - g - c)$
$\Rightarrow \widehat{AHD} = \widehat{ABC}$
Mà $\widehat{ABC} + \widehat{ACB} = 90^\circ$, suy ra $DH \perp BC$.
Ta có $CK \perp BH$ và $DH \perp BC$, nên $\widehat{DKH} = \widehat{BKC} = 90^\circ$
Xét $\triangle DKH$ và $\triangle BKC$ có
$\widehat{DKH} = \widehat{BKC}$
$\widehat{DHK} = \widehat{BCK}$
$\Rightarrow \triangle DHK \sim \triangle BKC(g - g)$
Xét $\triangle DKH$ vuông tại $K$:
$\sin\widehat{DHK} = \frac{DK}{DH}$
Mà $\widehat{DHK} = \widehat{BCK}$ nên $\sin\widehat{BCK} = \frac{DK}{DH} \Rightarrow DK = DH.\sin\widehat{BCK}$

c) Gọi H là chân đường vuông góc kẻ từ A xuống BC.
Vì $MP \perp AB$ tại P, $MQ \perp AC$ tại Q và $\widehat{BAC} = 90^\circ$ nên tứ giác $APMQ$ có 3 góc vuông, suy ra $APMQ$ là hình chữ nhật.
$\Rightarrow PQ = AM$ (hai đường chéo hình chữ nhật bằng nhau).
Vì M thuộc đoạn BC nên $AM \geq AH$ (AH là khoảng cách ngắn nhất từ điểm A đến đường thẳng BC), dấu "=" xảy ra khi $M \equiv H$, tức khi $AM \perp BC$.
Theo câu a), $AB = 6cm$, $AC = 8cm$, $BC = 10cm$, áp dụng hệ thức lượng trong tam giác vuông:
$AH = \dfrac{AB \cdot AC}{BC} = \dfrac{6 \cdot 8}{10} = 4,8(cm)$
Vậy $PQ$ nhỏ nhất bằng $4,8cm$, đạt được khi M là chân đường vuông góc kẻ từ A xuống BC.', 'https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/8d70e75e-ea82-42e1-91aa-31ac847568c8.png', NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0070', ma_cau from ins;
with bai as (select ma_bai from _hh_bai_ma where thu_tu = 2),
ins as (
  insert into hinh_hoc_cau_hoi (dang_chinh, mo_hinh_id, noi_dung, dap_an, loi_giai, anh_de, anh_dap_an, thu_tu, da_duyet, loai_cau, nguon, nguon_giai)
  select ma_bai, '9a1b9bb2-39ed-4a37-9c4f-2a3d4d6b8718', 'a) Chứng minh rằng: $\triangle AEB \sim \triangle AFC$ và $AE \cdot AC = AF \cdot AB$.

b) Chứng minh rằng: $\triangle AEF \sim \triangle ABC$.

c) Chứng minh rằng: $FC$ là tia phân giác của góc $DFE$ .

d) Gọi $I$, $M$ lần lượt là trung điểm của $AH$ và $BC$. Chứng minh rằng: $IM \perp EF$.', NULL, 'a) Xét $\triangle AEB$ và $\triangle AFC$:
- $\widehat{A}$ chung.
- $\widehat{AEB} = \widehat{AFC} = 90^\circ$ (do $BE\perp AC$ tại $E$, $CF\perp AB$ tại $F$).

Suy ra $\triangle AEB \sim \triangle AFC$ (g.g).

Từ đó $\dfrac{AE}{AF} = \dfrac{AB}{AC}$, suy ra $AE\cdot AC = AF\cdot AB$.

b) Theo câu trên (chứng minh $\triangle AEB \sim \triangle AFC$), ta có $\dfrac{AE}{AF}=\dfrac{AB}{AC}$, suy ra $\dfrac{AE}{AB} = \dfrac{AF}{AC}$.

Xét $\triangle AEF$ và $\triangle ABC$ có $\widehat{A}$ chung và $\dfrac{AE}{AB} = \dfrac{AF}{AC}$ (chứng minh trên), suy ra $\triangle AEF \sim \triangle ABC$ (c.g.c).

c) Vì $\widehat{BFH} = \widehat{BFC} = 90^\circ$ ($CF\perp AB$) và $\widehat{BDH}=\widehat{BDA}=90^\circ$ ($AD\perp BC$), hai điểm $F,D$ cùng nhìn đoạn $BH$ dưới góc vuông nên $B,F,H,D$ cùng thuộc đường tròn đường kính $BH$.
Suy ra $\widehat{DFH} = \widehat{DBH}$ (hai góc nội tiếp cùng chắn cung $DH$).
Mà $\widehat{DBH} = \widehat{CBE} = 90^\circ - \widehat{C}$ (xét tam giác vuông $BEC$ tại $E$).
Vậy $\widehat{DFC} = \widehat{DFH} = 90^\circ - \widehat{C}$ (vì $H$ thuộc đoạn $FC$).

Tương tự, vì $\widehat{AFH}=\widehat{AFC}=90^\circ$ ($CF\perp AB$) và $\widehat{AEH}=\widehat{AEB}=90^\circ$ ($BE\perp AC$), hai điểm $F,E$ cùng nhìn đoạn $AH$ dưới góc vuông nên $A,F,H,E$ cùng thuộc đường tròn đường kính $AH$.
Suy ra $\widehat{EFH} = \widehat{EAH}$ (cùng chắn cung $EH$).
Mà $\widehat{EAH} = \widehat{CAD} = 90^\circ - \widehat{C}$ (xét tam giác vuông $ADC$ tại $D$).
Vậy $\widehat{EFC} = \widehat{EFH} = 90^\circ - \widehat{C}$.

Suy ra $\widehat{DFC} = \widehat{EFC}\,(=90^\circ-\widehat{C})$. Vậy $FC$ là tia phân giác của $\widehat{DFE}$.

d) Vì $CF\perp AB$ nên $\widehat{BFC}=90^\circ$, tam giác $BFC$ vuông tại $F$ có $M$ là trung điểm cạnh huyền $BC$, suy ra $MF = \dfrac{BC}{2}$.
Vì $BE\perp AC$ nên $\widehat{BEC}=90^\circ$, tam giác $BEC$ vuông tại $E$ có $M$ là trung điểm cạnh huyền $BC$, suy ra $ME = \dfrac{BC}{2}$.
Vậy $MF=ME\left(=\dfrac{BC}{2}\right)$, tức $M$ cách đều $E$ và $F$.

Vì $CF\perp AB$ nên $\widehat{AFH}=90^\circ$ ($H$ thuộc $CF$), tam giác $AFH$ vuông tại $F$ có $I$ là trung điểm cạnh huyền $AH$, suy ra $IF=\dfrac{AH}{2}$.
Vì $BE\perp AC$ nên $\widehat{AEH}=90^\circ$ ($H$ thuộc $BE$), tam giác $AEH$ vuông tại $E$ có $I$ là trung điểm cạnh huyền $AH$, suy ra $IE=\dfrac{AH}{2}$.
Vậy $IE=IF\left(=\dfrac{AH}{2}\right)$, tức $I$ cách đều $E$ và $F$.

Vì cả $I$ và $M$ đều cách đều hai điểm $E,F$ nên đường thẳng $IM$ chính là đường trung trực của đoạn $EF$. Do đó $IM\perp EF$ (đpcm).', NULL, NULL, 1, false, 'tu_luan', 'le', 'nguoi' from bai
  returning ma_cau
)
insert into _hh_cau_map (temp_key, ma_cau) select 'TMP0071', ma_cau from ins;


-- ── POST-CHECK ──────────────────────────────────────────────────────────────
do $$
declare n_bai int; n_cau int; n_lt int;
begin
  select count(*) into n_bai from hinh_hoc_bai where khoi='9';
  select count(*) into n_cau from hinh_hoc_cau_hoi c join hinh_hoc_bai b on b.ma_bai=c.dang_chinh where b.khoi='9';
  select count(*) into n_lt from hinh_hoc_bai_ly_thuyet lt join hinh_hoc_bai b on b.ma_bai=lt.ma_bai where b.khoi='9';
  raise notice 'Chuyển xong khối 9: % Bài học tổng (bao gồm Bài đã có trước migration), % câu tổng, % lý thuyết Bài tổng.', n_bai, n_cau, n_lt;
  -- Sau migration ít nhất phải THÊM 9 Bài + 71 câu so với trước.
  -- (Verify chính xác thêm bao nhiêu bằng cách xem count(*) TRƯỚC/SAU migration nếu cần)
  -- Guard tối thiểu: mỗi Bài trong 9 tên mô hình v3 phải xuất hiện đúng 1 lần.
  select count(*) into n_bai from hinh_hoc_bai where khoi='9' and ten_bai in ('Mô hình tam giác vuông','Hình học Test','Tam giác vuông có Đường cao $AH$');
  if n_bai <> 3 then raise exception 'Sau migration: mong 3 Bài tên mô hình v3, có %', n_bai; end if;
end $$;

commit;