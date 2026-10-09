// Lý thuyết 6 bài Hình 9 (đường tròn) — rút từ Tóm tắt lý thuyết của Ngô Đức Tài ch.V + Nguyễn Trãi CĐ7, CĐ9 + SGK KNTT.
// Định dạng R2: xuống dòng đơn, chỉ 1 dòng trống trước tiêu đề mục. Chạy: node --env-file=.env ly-thuyet.mjs [--ghi]
import pg from 'pg'
const S = String.raw
export const LT = {
  HH00105: S`**1. Đường tròn**
Đường tròn tâm $O$ bán kính $R$ $(R>0)$, kí hiệu $(O;R)$, là hình gồm tất cả các điểm cách điểm $O$ một khoảng bằng $R$. Khi không cần để ý đến bán kính ta kí hiệu là $(O)$.
Nếu $A$ là một điểm của đường tròn $(O)$ ta viết $A\in(O)$; ta còn nói đường tròn $(O)$ đi qua điểm $A$.
Cho đường tròn $(O;R)$ và điểm $M$:
- $M$ nằm trên đường tròn $(O;R)$ nếu $OM=R$;
- $M$ nằm trong đường tròn $(O;R)$ nếu $OM<R$;
- $M$ nằm ngoài đường tròn $(O;R)$ nếu $OM>R$.
Hình tròn tâm $O$ bán kính $R$ là hình gồm các điểm nằm trên và nằm trong đường tròn $(O;R)$.

**2. Tính đối xứng của đường tròn**
Hai điểm $M$ và $M'$ đối xứng với nhau qua điểm $I$ nếu $I$ là trung điểm của đoạn thẳng $MM'$.
Hai điểm $M$ và $M'$ đối xứng với nhau qua đường thẳng $d$ nếu $d$ là đường trung trực của đoạn thẳng $MM'$.
Đường tròn là hình có tâm đối xứng; tâm của đường tròn là tâm đối xứng của nó.
Đường tròn là hình có trục đối xứng; mỗi đường thẳng đi qua tâm (mỗi đường kính) là một trục đối xứng của nó. Đường tròn có vô số trục đối xứng.

**3. Chứng minh nhiều điểm cùng thuộc một đường tròn**
Chỉ ra một điểm cách đều tất cả các điểm đó.
Trong tam giác vuông, đường trung tuyến ứng với cạnh huyền bằng nửa cạnh huyền ⇒ ba đỉnh của tam giác vuông cùng thuộc đường tròn có tâm là trung điểm cạnh huyền.
Ngược lại, nếu điểm $A$ (khác $B$, $C$) nằm trên đường tròn đường kính $BC$ thì tam giác $ABC$ vuông tại $A$ (đường trung tuyến $AO$ bằng nửa cạnh $BC$).
Bốn đỉnh của hình chữ nhật (hình vuông) cùng thuộc đường tròn có tâm là giao điểm hai đường chéo.

**4. Dây và đường kính**
Đoạn thẳng nối hai điểm của đường tròn gọi là dây (dây cung). Dây đi qua tâm gọi là đường kính; đường kính của đường tròn bán kính $R$ có độ dài $2R$.
Trong một đường tròn, đường kính là dây lớn nhất: nếu $AB$ là một dây của $(O;R)$ thì $AB\le2R$; khi $AB$ không đi qua tâm thì $AB<2R$.

**5. Góc ở tâm, cung và số đo cung**
Góc ở tâm là góc có đỉnh trùng với tâm của đường tròn.
Khi $\widehat{AOB}$ không bẹt, cung nằm trong góc gọi là cung nhỏ, cung còn lại gọi là cung lớn. Khi $\widehat{AOB}$ bẹt thì mỗi cung $AB$ là một nửa đường tròn. Ta nói góc $\widehat{AOB}$ chắn cung $AB$.
Số đo của cung nhỏ bằng số đo của góc ở tâm chắn cung đó. Số đo của cung lớn bằng $360^\circ$ trừ số đo cung nhỏ có chung hai mút. Số đo nửa đường tròn bằng $180^\circ$. Cả đường tròn là cung $360^\circ$.
Kí hiệu số đo cung $AB$ là sđ$\overset{\frown}{AB}$. Hai cung trên một đường tròn bằng nhau nếu chúng có cùng số đo.
Nếu $C$ là một điểm nằm trên cung $AB$ thì sđ$\overset{\frown}{AB}=$ sđ$\overset{\frown}{AC}+$ sđ$\overset{\frown}{CB}$.`,

  HH00106: S`**1. Độ dài đường tròn**
Tỉ số giữa độ dài đường tròn và đường kính của nó luôn bằng một số không đổi, kí hiệu là $\pi$ ($\pi\approx3{,}14$).
Độ dài (chu vi) $C$ của đường tròn bán kính $R$, đường kính $d=2R$: $C=\pi d=2\pi R$.

**2. Độ dài cung tròn**
Độ dài $l$ của cung $n^\circ$ trên đường tròn bán kính $R$: $l=\dfrac{\pi Rn}{180}$.
Tỉ số giữa độ dài cung $n^\circ$ và độ dài đường tròn (cùng bán kính) bằng $\dfrac{n}{360}$: $l=\dfrac{n}{360}C$.
Từ công thức suy ra: $R=\dfrac{180\,l}{\pi n}$; $n=\dfrac{180\,l}{\pi R}$.

**3. Chú ý**
Nếu không nói gì thêm thì lấy $\pi$ theo máy tính; kết quả làm tròn theo yêu cầu đề bài, chỉ làm tròn ở bước cuối.`,

  HH00107: S`**1. Diện tích hình tròn**
Diện tích hình tròn bán kính $R$: $S=\pi R^2$.

**2. Hình quạt tròn**
Hình quạt tròn là phần hình tròn giới hạn bởi một cung tròn và hai bán kính đi qua hai mút của cung đó.
Diện tích hình quạt tròn bán kính $R$ ứng với cung $n^\circ$: $S_q=\dfrac{\pi R^2n}{360}=\dfrac{l\cdot R}{2}$ ($l$ là độ dài cung).
Tỉ số giữa diện tích hình quạt ứng với cung $n^\circ$ và diện tích hình tròn (cùng bán kính) bằng $\dfrac{n}{360}$.

**3. Hình viên phân**
Hình viên phân là hình giới hạn bởi một cung tròn và dây căng cung đó.
$S_{\text{viên phân}}=S_{\text{quạt }OAB}-S_{\triangle OAB}$.
Diện tích tam giác: $S=\dfrac12a\cdot h$ ($h$ là chiều cao ứng với cạnh $a$).

**4. Hình vành khuyên**
Hình vành khuyên (hình vành khăn) là phần nằm giữa hai đường tròn cùng tâm $(O;R)$ và $(O;r)$ với $R>r$.
Diện tích hình vành khuyên: $S=\pi\left(R^2-r^2\right)$.`,

  HH00108: S`**1. Vị trí tương đối của đường thẳng và đường tròn**
Gọi $d$ là khoảng cách từ tâm $O$ đến đường thẳng $a$ ($d=OH$, $H$ là chân đường vuông góc kẻ từ $O$ đến $a$).
- Đường thẳng $a$ và $(O;R)$ cắt nhau (có đúng hai điểm chung) khi $d<R$.
- Đường thẳng $a$ và $(O;R)$ tiếp xúc nhau (có duy nhất một điểm chung $H$) khi $d=R$. Điểm chung gọi là tiếp điểm, đường thẳng $a$ gọi là tiếp tuyến của $(O)$ tại $H$.
- Đường thẳng $a$ và $(O;R)$ không giao nhau (không có điểm chung) khi $d>R$.

**2. Tính chất của tiếp tuyến**
Nếu một đường thẳng là tiếp tuyến của đường tròn thì nó vuông góc với bán kính đi qua tiếp điểm.

**3. Dấu hiệu nhận biết tiếp tuyến**
Nếu một đường thẳng đi qua một điểm nằm trên đường tròn và vuông góc với bán kính đi qua điểm đó thì đường thẳng ấy là một tiếp tuyến của đường tròn.`,

  HH00109: S`**1. Hai tiếp tuyến cắt nhau của một đường tròn**
Nếu hai tiếp tuyến của đường tròn $(O)$ tại $A$ và $B$ cắt nhau tại điểm $P$ thì:
- Điểm $P$ cách đều hai tiếp điểm: $PA=PB$;
- $PO$ là tia phân giác của góc tạo bởi hai tiếp tuyến: $\widehat{APO}=\widehat{BPO}$;
- $OP$ là tia phân giác của góc tạo bởi hai bán kính đi qua hai tiếp điểm: $\widehat{AOP}=\widehat{BOP}$.

**2. Nhắc lại**
Tiếp tuyến vuông góc với bán kính tại tiếp điểm. Đường thẳng đi qua một điểm của đường tròn và vuông góc với bán kính tại điểm đó là tiếp tuyến.
Đường tròn tiếp xúc với ba cạnh của tam giác gọi là đường tròn nội tiếp tam giác; tâm của nó cách đều ba cạnh.`,

  HH00110: S`**1. Hai đường tròn cắt nhau**
Hai đường tròn có đúng hai điểm chung gọi là hai đường tròn cắt nhau; hai điểm chung gọi là hai giao điểm.
$(O;R)$ và $(O';R')$ với $R\ge R'$ cắt nhau khi $R-R'<OO'<R+R'$.

**2. Hai đường tròn tiếp xúc nhau**
Hai đường tròn có duy nhất một điểm chung gọi là hai đường tròn tiếp xúc nhau; điểm chung gọi là tiếp điểm.
Tiếp xúc ngoài khi $OO'=R+R'$; tiếp xúc trong khi $OO'=R-R'>0$.
Nếu hai đường tròn tiếp xúc nhau thì tiếp điểm nằm trên đường nối tâm (thẳng hàng với hai tâm).

**3. Hai đường tròn không giao nhau**
Hai đường tròn không có điểm chung gọi là hai đường tròn không giao nhau.
Ở ngoài nhau khi $OO'>R+R'$; đường tròn $(O)$ đựng đường tròn $(O')$ khi $OO'<R-R'$. Khi $O$ trùng $O'$ và $R\ne R'$ ta có hai đường tròn đồng tâm.

**4. Bảng tổng kết** ($R\ge R'$)
Cắt nhau: 2 điểm chung, $R-R'<OO'<R+R'$.
Tiếp xúc ngoài: 1 điểm chung, $OO'=R+R'$.
Tiếp xúc trong: 1 điểm chung, $OO'=R-R'>0$.
Ở ngoài nhau: 0 điểm chung, $OO'>R+R'$.
$(O)$ đựng $(O')$: 0 điểm chung, $OO'<R-R'$.

**5. Tiếp tuyến chung**
Đường thẳng tiếp xúc với cả hai đường tròn gọi là tiếp tuyến chung của hai đường tròn đó.`,
}
if (process.argv.includes('--ghi')) {
  const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
  await c.connect(); await c.query('begin')
  for (const [ma, nd] of Object.entries(LT)) await c.query(`insert into hinh_hoc_bai_ly_thuyet (ma_bai, noi_dung) values ($1,$2) on conflict (ma_bai) do update set noi_dung = excluded.noi_dung, cap_nhat_at = now()`, [ma, nd])
  await c.query('commit'); await c.end(); console.log('ghi', Object.keys(LT).length, 'lý thuyết')
} else for (const [ma, nd] of Object.entries(LT)) console.log(ma, nd.length, 'ký tự', /\n\n\n/.test(nd) ? 'DÒNG TRỐNG KÉP' : '')
