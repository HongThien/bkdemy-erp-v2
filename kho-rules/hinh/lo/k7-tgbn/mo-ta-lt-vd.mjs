// Lô 05/11 (Thùy: "bản soạn hình học khối 7 + khối 8 — đẩy luôn"): lý thuyết HH00099 + MÔ TẢ + VÍ DỤ cho 5 bài Hình–Học K7
// (tam giác bằng nhau) và 3 bài K8 (Thales · đường trung bình · phân giác). Chỉ ghi vào ô đang TRỐNG (không đè nội dung đã có).
// Ví dụ K7 = khuôn "ta trình bày như sau" ở phần lý thuyết của tài liệu (BẢN-NHÁP-TAM-GIÁC-BẰNG-NHAU, sửa 2 chữ in sai: c.g.c góc xen giữa
// là góc B; tam giác vuông ch-cgv "AB = AC" ⇒ "AB = DE"). Ví dụ K8 tự soạn, số liệu đã tính lại.
//   node kho-rules/hinh/lo/k7-tgbn/mo-ta-lt-vd.mjs [--ghi]
import pg from 'pg'
import fs from 'node:fs'

const LT = {
  HH00099: `**Trường hợp bằng nhau thứ nhất của tam giác (cạnh – cạnh – cạnh)**

Nếu ba cạnh của tam giác này lần lượt bằng ba cạnh của tam giác kia thì hai tam giác đó bằng nhau.
Nếu $\\triangle ABC$ và $\\triangle DEF$ có:
$AB=DE$;
$BC=EF$;
$AC=DF$
thì $\\triangle ABC=\\triangle DEF$ (c.c.c).

**Phương pháp giải:**

Áp dụng lý thuyết trường hợp bằng nhau thứ nhất của tam giác.
Từ việc chứng minh hai tam giác bằng nhau suy ra các cạnh tương ứng bằng nhau; các góc tương ứng bằng nhau.`,
}

const MO_TA = {
  HH00099: `Câu chứng minh hai tam giác bằng nhau khi biết (hoặc đọc từ hình) ba cặp cạnh bằng nhau, thường có một cạnh chung.
Từ hai tam giác bằng nhau suy ra các góc tương ứng bằng nhau, rồi suy ra tia phân giác, hai đường thẳng song song (so le trong) hoặc vuông góc (hai góc kề bù bằng nhau).
Đề không cho cặp góc nào để làm điều kiện bằng nhau.`,
  HH00101: `Câu chứng minh hai tam giác bằng nhau khi có hai cặp cạnh bằng nhau và cặp góc XEN GIỮA hai cạnh đó bằng nhau.
Góc xen giữa có thể cho thẳng, hoặc suy ra từ hai góc đối đỉnh, so le trong của hai đường song song, tia phân giác.
Hay gặp: trung điểm + tia đối ($MA=MD$); tam giác có $AB=AC$ và tia phân giác của góc $A$.
Từ đó suy ra cạnh, góc tương ứng; song song; vuông góc; trung điểm.`,
  HH00102: `Câu chứng minh hai tam giác bằng nhau khi có một cặp cạnh bằng nhau và hai cặp góc KỀ cạnh đó bằng nhau.
Các góc có thể cho thẳng, hoặc suy ra từ so le trong của hai đường song song, đối đỉnh, tia phân giác, tổng ba góc của tam giác.
Từ đó suy ra cạnh, góc tương ứng; song song; vuông góc; tia phân giác.`,
  HH00103: `Câu có hai tam giác VUÔNG (kẻ đường vuông góc, chân đường vuông góc) cần chứng minh bằng nhau theo các trường hợp của tam giác vuông: hai cạnh góc vuông (cgv - cgv), cạnh góc vuông và góc nhọn kề (cgv - gn), cạnh huyền và góc nhọn (ch - gn), cạnh huyền và cạnh góc vuông (ch - cgv).
Hay gặp: tam giác có $AB=AC$ kẻ đường vuông góc từ đỉnh; điểm trên tia phân giác của một góc hạ vuông góc xuống hai cạnh của góc; trung điểm kẻ hai đường vuông góc.`,
  HH00104: `Câu có tam giác cân, tam giác vuông cân, tam giác đều hoặc đường trung trực của đoạn thẳng:
tính các góc của tam giác cân khi biết một góc; dùng hai góc đáy bằng nhau để chứng minh tam giác bằng nhau;
chứng minh một tam giác cân, đều (hai cạnh hoặc hai góc bằng nhau);
chứng minh một đường thẳng là đường trung trực (vuông góc tại trung điểm), hoặc dùng tính chất điểm trên đường trung trực cách đều hai mút.`,
  HH00142: `Câu có một đường thẳng song song với một cạnh của tam giác và cắt hai cạnh còn lại (hoặc hình thang có đường song song với hai đáy):
viết các tỉ số đoạn thẳng tỉ lệ; tính độ dài đoạn thẳng bằng định lí Thalès; bài toán thực tế đo khoảng cách không đo trực tiếp được;
chứng minh đẳng thức tỉ số, hoặc chứng minh hai đường thẳng song song bằng định lí Thalès đảo.
Không dùng đường trung bình, tính chất đường phân giác.`,
  HH00143: `Câu có trung điểm của hai cạnh tam giác (hoặc qua trung điểm một cạnh kẻ đường song song với cạnh thứ hai):
tính độ dài bằng tính chất đường trung bình (song song và bằng nửa cạnh thứ ba); chứng minh hai đường thẳng song song; chứng minh trung điểm;
chứng minh tứ giác là hình thang, hình bình hành, hình chữ nhật, hình thoi nhờ đường trung bình; bài toán thực tế đo khoảng cách.`,
  HH00144: `Câu có tia phân giác của một góc trong tam giác cắt cạnh đối diện:
lập tỉ lệ $\\dfrac{DB}{DC}=\\dfrac{AB}{AC}$ để tính độ dài các đoạn thẳng, tính tỉ số; chứng minh đẳng thức tỉ số;
có thể kết hợp định lí Thalès và đường trung bình của tam giác.`,
}

const VI_DU = {
  HH00099: `##VD
Cho hai tam giác $ABC$ và $DEF$ có $AB=DE$, $BC=EF$, $AC=DF$. Chứng minh $\\triangle ABC=\\triangle DEF$.

Bài giải:
Xét $\\triangle ABC$ và $\\triangle DEF$ có:
$AB=DE$ (gt);
$BC=EF$ (gt);
$AC=DF$ (gt).
Vậy $\\triangle ABC=\\triangle DEF$ (c.c.c).`,
  HH00101: `##VD
Cho hai tam giác $ABC$ và $DEF$ có $AB=DE$, $\\widehat{ABC}=\\widehat{DEF}$, $BC=EF$. Chứng minh $\\triangle ABC=\\triangle DEF$.

Bài giải:
Xét $\\triangle ABC$ và $\\triangle DEF$ có:
$AB=DE$ (gt);
$\\widehat{ABC}=\\widehat{DEF}$ (gt);
$BC=EF$ (gt).
Suy ra $\\triangle ABC=\\triangle DEF$ (c.g.c).`,
  HH00102: `##VD
Cho hai tam giác $ABC$ và $MEF$ có $\\widehat{ABC}=\\widehat{MEF}$, $AB=ME$, $\\widehat{BAC}=\\widehat{EMF}$. Chứng minh $\\triangle ABC=\\triangle MEF$.

Bài giải:
Xét $\\triangle ABC$ và $\\triangle MEF$ có:
$\\widehat{ABC}=\\widehat{MEF}$ (gt);
$AB=ME$ (gt);
$\\widehat{BAC}=\\widehat{EMF}$ (gt).
Suy ra $\\triangle ABC=\\triangle MEF$ (g.c.g).`,
  HH00103: `##VD
Cho hai tam giác $ABC$ và $DEF$ vuông tại $A$ và $D$, có $BC=EF$, $AB=DE$. Chứng minh $\\triangle ABC=\\triangle DEF$.

Bài giải:
Xét $\\triangle ABC$ và $\\triangle DEF$ có:
$\\widehat{BAC}=\\widehat{EDF}=90^\\circ$;
$BC=EF$ (gt);
$AB=DE$ (gt).
Suy ra $\\triangle ABC=\\triangle DEF$ (ch - cgv).

##VD
Cho hai tam giác $ABC$ và $DEF$ vuông tại $A$ và $D$, có $BC=EF$, $\\widehat{ABC}=\\widehat{DEF}$. Chứng minh $\\triangle ABC=\\triangle DEF$.

Bài giải:
Xét $\\triangle ABC$ và $\\triangle DEF$ có:
$\\widehat{BAC}=\\widehat{EDF}=90^\\circ$;
$BC=EF$ (gt);
$\\widehat{ABC}=\\widehat{DEF}$ (gt).
Suy ra $\\triangle ABC=\\triangle DEF$ (ch - gn).`,
  HH00104: `##VD
Cho $\\triangle ABC$ cân tại $A$ có $\\widehat{A}=70^\\circ$. Tính $\\widehat{B}$ và $\\widehat{C}$.

Bài giải:
Vì $\\triangle ABC$ cân tại $A$
nên $\\widehat{B}=\\widehat{C}$ (tính chất tam giác cân).
Ta có $\\widehat{A}+\\widehat{B}+\\widehat{C}=180^\\circ$ (tổng ba góc của tam giác)
nên $\\widehat{B}=\\widehat{C}=\\dfrac{180^\\circ-70^\\circ}{2}=55^\\circ$.
Vậy $\\widehat{B}=\\widehat{C}=55^\\circ$.`,
  HH00142: `##VD
Cho $\\triangle ABC$, điểm $D$ thuộc cạnh $AB$, điểm $E$ thuộc cạnh $AC$ sao cho $DE\\parallel BC$. Biết $AD=2$ cm, $DB=3$ cm, $AE=4$ cm. Tính $EC$.

Bài giải:
Xét $\\triangle ABC$ có $DE\\parallel BC$ (gt)
nên $\\dfrac{AD}{DB}=\\dfrac{AE}{EC}$ (định lí Thalès).
Suy ra $\\dfrac{2}{3}=\\dfrac{4}{EC}$
nên $EC=\\dfrac{3\\cdot4}{2}=6$ (cm).
Vậy $EC=6$ cm.`,
  HH00143: `##VD
Cho $\\triangle ABC$ có $M$, $N$ lần lượt là trung điểm của $AB$, $AC$. Biết $BC=10$ cm. Tính $MN$.

Bài giải:
Xét $\\triangle ABC$ có $M$, $N$ lần lượt là trung điểm của $AB$, $AC$ (gt)
nên $MN$ là đường trung bình của $\\triangle ABC$ (định nghĩa đường trung bình).
Suy ra $MN\\parallel BC$ và $MN=\\dfrac{BC}{2}$ (tính chất đường trung bình)
nên $MN=\\dfrac{10}{2}=5$ (cm).
Vậy $MN=5$ cm.`,
  HH00144: `##VD
Cho $\\triangle ABC$ có $AB=6$ cm, $AC=9$ cm, $BC=10$ cm. Tia phân giác của góc $A$ cắt $BC$ tại $D$. Tính $DB$ và $DC$.

Bài giải:
Vì $AD$ là tia phân giác của góc $A$ (gt)
nên $\\dfrac{DB}{DC}=\\dfrac{AB}{AC}=\\dfrac{6}{9}=\\dfrac{2}{3}$ (tính chất đường phân giác).
Suy ra $\\dfrac{DB}{2}=\\dfrac{DC}{3}=\\dfrac{DB+DC}{2+3}=\\dfrac{10}{5}=2$
nên $DB=2\\cdot2=4$ (cm), $DC=3\\cdot2=6$ (cm).
Vậy $DB=4$ cm, $DC=6$ cm.`,
}

const GHI = process.argv.includes('--ghi')
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
await c.query('begin')
try {
  for (const [ma, nd] of Object.entries(LT)) {
    const r = await c.query(`insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung) values ($1, $2)
      on conflict (ma_bai) do update set noi_dung = excluded.noi_dung, cap_nhat_at = now() where btrim(hinh_hoc_bai_ly_thuyet.noi_dung) = ''`, [ma, nd])
    console.log('lý thuyết', ma, r.rowCount ? 'ghi' : 'BỎ (đã có)')
  }
  for (const [ma, v] of Object.entries(MO_TA)) {
    const r = await c.query(`update hinh_hoc_bai set mo_ta = $2 where ma_bai = $1 and btrim(mo_ta) = ''`, [ma, v])
    console.log('mô tả', ma, r.rowCount ? 'ghi' : 'BỎ (đã có)')
  }
  for (const [ma, v] of Object.entries(VI_DU)) {
    const r = await c.query(`update hinh_hoc_bai set vi_du = $2 where ma_bai = $1 and btrim(vi_du) = '' and vi_du_file_url is null`, [ma, v])
    console.log('ví dụ', ma, r.rowCount ? 'ghi' : 'BỎ (đã có)')
  }
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? 'ĐÃ GHI' : 'CHẠY THỬ — đã rollback')
} catch (e) { await c.query('rollback'); throw e } finally { await c.end() }
