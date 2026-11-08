// Thùy 05/11 "lý thuyết chưa chuyển đúng form, chưa dùng các tag ##VD, ##CY": viết lại lý thuyết 8 bài Hình–Học (K7 HH00099–104,
// K8 HH00142–144) theo thẻ spec-format-noidung.md (##ĐN · ##ĐL · ##TC · ##CY · ##PP; khối cắt ở dòng trống; ảnh là đoạn riêng ngoài khung).
// Lý thuyết KHÔNG chứa ví dụ (ví dụ ở ô vi_du — luật 19/10): ví dụ ch-cgv trong lý thuyết HH00103 đã có ở ô ví dụ ⇒ bỏ khỏi lý thuyết.
// Nội dung giữ nguyên phát biểu cũ, chỉ đổi khung. Bản cũ lưu vào lt-cu-05-11.json TRƯỚC khi ghi.
//   node kho-rules/hinh/lo/k7-tgbn/lt-gan-the.mjs [--ghi]
import pg from 'pg'
import fs from 'node:fs'

const LT = {
  HH00099: `##ĐL Trường hợp bằng nhau thứ nhất (cạnh – cạnh – cạnh)
Nếu ba cạnh của tam giác này lần lượt bằng ba cạnh của tam giác kia thì hai tam giác đó bằng nhau.
Nếu $\\triangle ABC$ và $\\triangle DEF$ có $AB=DE$, $BC=EF$, $AC=DF$ thì $\\triangle ABC=\\triangle DEF$ (c.c.c).

##PP Phương pháp giải
Chọn hai tam giác chứa các đoạn thẳng, các góc cần chứng minh bằng nhau.
Tìm ba cặp cạnh bằng nhau (giả thiết, cạnh chung, trung điểm).
Kết luận hai tam giác bằng nhau (c.c.c).
Suy ra các cặp góc tương ứng bằng nhau.

##CY
Khi viết kí hiệu hai tam giác bằng nhau, các đỉnh tương ứng phải viết theo cùng thứ tự.`,

  HH00101: `##ĐL Trường hợp bằng nhau thứ hai (cạnh – góc – cạnh)
Nếu hai cạnh và góc xen giữa của tam giác này bằng hai cạnh và góc xen giữa của tam giác kia thì hai tam giác đó bằng nhau.
Nếu $\\triangle ABC$ và $\\triangle A'B'C'$ có $AB=A'B'$, $\\widehat{B}=\\widehat{B'}$, $BC=B'C'$ thì $\\triangle ABC=\\triangle A'B'C'$ (c.g.c).

##PP Phương pháp giải
Chọn hai tam giác chứa các yếu tố cần chứng minh bằng nhau.
Tìm hai cặp cạnh bằng nhau và cặp góc xen giữa hai cạnh đó bằng nhau (góc đối đỉnh, so le trong, tia phân giác…).
Kết luận hai tam giác bằng nhau (c.g.c).
Suy ra các cạnh tương ứng, các góc tương ứng bằng nhau.

##CY
Góc bằng nhau phải là góc XEN GIỮA hai cặp cạnh đã chọn.`,

  HH00102: `##ĐL Trường hợp bằng nhau thứ ba (góc – cạnh – góc)
Nếu một cạnh và hai góc kề của tam giác này bằng một cạnh và hai góc kề của tam giác kia thì hai tam giác đó bằng nhau.
Nếu $\\triangle ABC$ và $\\triangle A'B'C'$ có $\\widehat{B}=\\widehat{B'}$, $BC=B'C'$, $\\widehat{C}=\\widehat{C'}$ thì $\\triangle ABC=\\triangle A'B'C'$ (g.c.g).

##PP Phương pháp giải
Chọn hai tam giác chứa các yếu tố cần chứng minh bằng nhau.
Tìm một cặp cạnh bằng nhau và hai cặp góc kề cạnh đó bằng nhau (so le trong, đối đỉnh, tia phân giác, tổng ba góc…).
Kết luận hai tam giác bằng nhau (g.c.g).
Suy ra các cạnh tương ứng, các góc tương ứng bằng nhau.

##CY
Hai góc bằng nhau phải là hai góc KỀ cạnh đã chọn.`,

  HH00103: `##ĐL Ba trường hợp bằng nhau của tam giác vuông
Nếu hai cạnh góc vuông của tam giác vuông này lần lượt bằng hai cạnh góc vuông của tam giác vuông kia thì hai tam giác vuông đó bằng nhau (cgv - cgv).
Nếu một cạnh góc vuông và góc nhọn kề cạnh ấy của tam giác vuông này bằng một cạnh góc vuông và góc nhọn kề cạnh ấy của tam giác vuông kia thì hai tam giác vuông đó bằng nhau (cgv - gn).
Nếu cạnh huyền và một góc nhọn của tam giác vuông này bằng cạnh huyền và một góc nhọn của tam giác vuông kia thì hai tam giác vuông đó bằng nhau (ch - gn).

##ĐL Trường hợp cạnh huyền – cạnh góc vuông
Nếu cạnh huyền và một cạnh góc vuông của tam giác vuông này bằng cạnh huyền và một cạnh góc vuông của tam giác vuông kia thì hai tam giác vuông đó bằng nhau (ch - cgv).

##PP Phương pháp giải
Xét hai tam giác vuông, tìm các yếu tố bằng nhau.
Đối chiếu với các trường hợp bằng nhau của tam giác vuông ở trên.
Kết luận hai tam giác vuông bằng nhau.
Suy ra các cạnh tương ứng, các góc tương ứng bằng nhau.`,

  HH00104: `##ĐN Tam giác cân
Tam giác cân là tam giác có hai cạnh bằng nhau.

##TC Tính chất tam giác cân
Trong tam giác cân, hai góc đáy bằng nhau.
$\\triangle ABC$ cân tại $A$ $\\Rightarrow \\widehat{B}=\\widehat{C}$.

##TC Dấu hiệu nhận biết tam giác cân
Tam giác có hai cạnh bằng nhau là tam giác cân.
Tam giác có hai góc bằng nhau là tam giác cân.
$\\triangle ABC$ có $AB=AC$ hoặc $\\widehat{B}=\\widehat{C}$ $\\Rightarrow \\triangle ABC$ cân tại $A$.

##ĐN Tam giác vuông cân
Tam giác vuông cân là tam giác vuông có hai cạnh bằng nhau.

##TC Tính chất và dấu hiệu tam giác vuông cân
Trong tam giác vuông cân, hai góc nhọn bằng $45^\\circ$.
Tam giác vuông có hai cạnh bằng nhau là tam giác vuông cân.
Tam giác vuông có một góc bằng $45^\\circ$ là tam giác vuông cân.
Tam giác cân có một góc đáy bằng $45^\\circ$ là tam giác vuông cân.

##ĐN Tam giác đều
Tam giác đều là tam giác có ba cạnh bằng nhau.

##TC Tính chất và dấu hiệu tam giác đều
Trong tam giác đều, ba góc bằng nhau và bằng $60^\\circ$.
Tam giác có ba cạnh bằng nhau là tam giác đều.
Tam giác có ba góc bằng nhau là tam giác đều.
Tam giác cân có một góc bằng $60^\\circ$ là tam giác đều.

##ĐN Đường trung trực của đoạn thẳng
Đường thẳng vuông góc với một đoạn thẳng tại trung điểm của nó được gọi là đường trung trực của đoạn thẳng đó.

##TC Tính chất đường trung trực
Điểm nằm trên đường trung trực của một đoạn thẳng thì cách đều hai mút của đoạn thẳng đó.`,

  HH00142: `##ĐN Tỉ số của hai đoạn thẳng
Tỉ số của hai đoạn thẳng là tỉ số độ dài của chúng theo cùng một đơn vị đo.

##ĐN Đoạn thẳng tỉ lệ
Hai đoạn thẳng $AB$ và $CD$ gọi là tỉ lệ với hai đoạn thẳng $A'B'$ và $C'D'$ nếu có tỉ lệ thức $\\dfrac{AB}{CD}=\\dfrac{A'B'}{C'D'}$ hay $\\dfrac{AB}{A'B'}=\\dfrac{CD}{C'D'}$.

##ĐL Định lí Thalès
Nếu một đường thẳng song song với một cạnh của tam giác và cắt hai cạnh còn lại thì nó định ra trên hai cạnh đó những đoạn thẳng tương ứng tỉ lệ.
Xét $\\triangle ABC$ có $DE\\parallel BC$ ($D\\in AB$, $E\\in AC$) thì $\\dfrac{AD}{AB}=\\dfrac{AE}{AC}$; $\\dfrac{AD}{DB}=\\dfrac{AE}{EC}$; $\\dfrac{BD}{AB}=\\dfrac{EC}{AC}$.

##ĐL Định lí Thalès đảo
Nếu một đường thẳng cắt hai cạnh của một tam giác và định ra trên hai cạnh này những đoạn thẳng tương ứng tỉ lệ thì đường thẳng đó song song với cạnh còn lại của tam giác.
Xét $\\triangle ABC$ có $D\\in AB$, $E\\in AC$ và $\\dfrac{AD}{AB}=\\dfrac{AE}{AC}$ thì $DE\\parallel BC$.`,

  HH00143: `##ĐN Đường trung bình của tam giác
Đường trung bình của tam giác là đoạn thẳng nối trung điểm hai cạnh của tam giác.
Xét $\\triangle ABC$ có $D$ là trung điểm của $AB$, $E$ là trung điểm của $AC$ nên $DE$ là đường trung bình của $\\triangle ABC$.

##ĐL Tính chất đường trung bình của tam giác
Đường trung bình của tam giác thì song song với cạnh thứ ba và bằng nửa cạnh đó.
Xét $\\triangle ABC$ có $DE$ là đường trung bình ($D\\in AB$, $E\\in AC$) thì $DE\\parallel BC$ và $DE=\\dfrac12BC$.

![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/e6a51005-4553-4a65-b0d6-ee7698334c22.png)

**Chứng minh:**
Lấy $F$ đối xứng với $D$ qua $E$ nên $E$ là trung điểm của $DF$.
Tứ giác $ADCF$ có hai đường chéo $AC$ và $DF$ cắt nhau tại trung điểm $E$ của mỗi đường nên $ADCF$ là hình bình hành.
Suy ra $FC\\parallel AD$ và $FC=AD$.
Mà $AD=DB$ ($D$ là trung điểm của $AB$) nên $FC=DB$; lại có $A,D,B$ thẳng hàng nên $FC\\parallel DB$.
Tứ giác $BDFC$ có $FC=DB$ và $FC\\parallel DB$ nên $BDFC$ là hình bình hành.
Suy ra $DF\\parallel BC$ và $DF=BC$.
Do đó $DE\\parallel BC$. Mà $DE=\\dfrac12DF$ nên $DE=\\dfrac12BC$.

##CY
Trong một tam giác, nếu một đường thẳng đi qua trung điểm một cạnh và song song với cạnh thứ hai thì nó đi qua trung điểm của cạnh thứ ba.
Xét $\\triangle ABC$ có $D$ là trung điểm của $AB$, $DE\\parallel BC$ ($E\\in AC$) thì $E$ là trung điểm của $AC$.`,

  HH00144: `##ĐL Tính chất đường phân giác của tam giác
Trong một tam giác, đường phân giác của một góc chia cạnh đối diện thành hai đoạn thẳng tỉ lệ với hai cạnh kề hai đoạn ấy.
Xét $\\triangle ABC$ có $AD$ là tia phân giác của góc $A$ ($D\\in BC$). Khi đó $\\dfrac{DB}{DC}=\\dfrac{AB}{AC}$.

##CY
Trong $\\triangle ABC$, nếu $D$ là điểm thuộc đoạn $BC$ và thoả mãn $\\dfrac{DB}{DC}=\\dfrac{AB}{AC}$ thì $AD$ là đường phân giác của góc $A$.`,
}

// kiểm khuôn: mọi đoạn (cắt ở dòng trống) phải mở bằng thẻ, trừ đoạn ảnh và đoạn "**Chứng minh:**"
for (const [ma, s] of Object.entries(LT)) {
  for (const d of s.split(/\n[ \t]*\n/)) {
    const dau = d.trim().split('\n')[0]
    if (!/^##(ĐN|ĐL|TC|CY|PP)\b/.test(dau) && !/^!\[\]\(/.test(dau) && dau !== '**Chứng minh:**') throw new Error(`${ma}: đoạn không có thẻ: ${dau.slice(0, 60)}`)
  }
  if (/##VD|Ví dụ|Bài giải/.test(s)) throw new Error(`${ma}: lý thuyết còn ví dụ`)
}

const GHI = process.argv.includes('--ghi')
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const cu = (await c.query(`select ma_bai, noi_dung, file_url, cap_nhat_at from hinh_hoc_bai_ly_thuyet where ma_bai = any($1)`, [Object.keys(LT)])).rows
const sao = new URL('./lt-cu-05-11.json', import.meta.url)
if (GHI && !fs.existsSync(sao)) fs.writeFileSync(sao, JSON.stringify(cu, null, 1))
await c.query('begin')
try {
  for (const [ma, nd] of Object.entries(LT)) {
    const r = await c.query(`update hinh_hoc_bai_ly_thuyet set noi_dung = $2, cap_nhat_at = now() where ma_bai = $1`, [ma, nd])
    console.log(ma, r.rowCount ? 'ghi' : 'KHÔNG CÓ DÒNG', `(${cu.find((x) => x.ma_bai === ma)?.noi_dung.length ?? 0} → ${nd.length} kí tự)`)
  }
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? 'ĐÃ GHI (bản cũ: lt-cu-05-11.json)' : 'CHẠY THỬ — rollback')
} catch (e) { await c.query('rollback'); throw e } finally { await c.end() }
