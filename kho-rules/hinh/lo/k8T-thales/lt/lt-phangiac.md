##ĐN Đường phân giác trong và đường phân giác ngoài của tam giác
Trong $\triangle ABC$, tia phân giác của góc $BAC$ cắt cạnh $BC$ tại $D$ gọi là đường phân giác trong (kẻ từ $A$). Tia phân giác của góc ngoài tại đỉnh $A$ (góc kề bù với góc $BAC$) gọi là đường phân giác ngoài (kẻ từ $A$). Đường phân giác ngoài cắt đường thẳng $BC$ tại $D'$ khi và chỉ khi $AB\ne AC$.

##ĐL Tính chất đường phân giác trong của tam giác
Đường phân giác trong của một tam giác chia cạnh đối diện thành hai đoạn thẳng tỉ lệ với hai cạnh kề của hai đoạn ấy.
Xét $\triangle ABC$, $AD$ là phân giác trong ($D\in BC$) thì $\dfrac{DB}{DC}=\dfrac{AB}{AC}$.

{{HINH:phan_giac_trong|AD là phân giác trong của tam giác ABC}}

##TC Chứng minh tính chất đường phân giác trong
Qua $C$ kẻ đường thẳng song song với $AD$, cắt đường thẳng $AB$ tại $E$. Vì $C$ và $D$ nằm cùng một phía đối với đường thẳng $AB$, và $A$ nằm giữa $E$ và $B$ nên ta có hình vẽ như dưới đây.
Vì $EC\parallel AD$ nên $\widehat{AEC}=\widehat{BAD}$ (hai góc đồng vị).
Vì $EC\parallel AD$ nên $\widehat{ACE}=\widehat{CAD}$ (hai góc so le trong, vì $E$ và $D$ nằm khác phía đối với đường thẳng $AC$).
Mà $\widehat{BAD}=\widehat{CAD}$ ($AD$ là tia phân giác) nên $\widehat{AEC}=\widehat{ACE}$.
Suy ra $\triangle ACE$ cân tại $A$, do đó $AE=AC$.
Trong $\triangle BEC$ có $AD\parallel EC$ ($A\in BE$, $D\in BC$) nên theo định lí Thalès: $\dfrac{DB}{DC}=\dfrac{AB}{AE}$.
Thay $AE=AC$ ta được $\dfrac{DB}{DC}=\dfrac{AB}{AC}$ (đpcm).

{{HINH:phan_giac_trong_cm|Chứng minh: kẻ CE song song AD}}

##ĐL Tính chất đường phân giác ngoài của tam giác
Trong $\triangle ABC$ có $AB\ne AC$, đường phân giác ngoài tại $A$ cắt đường thẳng $BC$ tại $D'$ thì $\dfrac{D'B}{D'C}=\dfrac{AB}{AC}$.

{{HINH:phan_giac_ngoai|AD' là phân giác ngoài tại A (AB nhỏ hơn AC)}}

##TC Chứng minh tính chất đường phân giác ngoài
Giả sử $AB<AC$ (trường hợp $AB>AC$ chứng minh tương tự). Gọi $C'$ là điểm trên tia đối của tia $AC$, khi đó $AD'$ là tia phân giác của góc $BAC'$, tức $\widehat{BAD'}=\widehat{D'AC'}$, và $D'$ nằm trên tia $CB$, ngoài đoạn $BC$, về phía $B$.
Vì $AB<AC$ nên trên đoạn $AC$ lấy được điểm $E$ sao cho $AE=AB$. Khi đó $\triangle ABE$ cân tại $A$ nên $\widehat{ABE}=\widehat{AEB}$.
Góc $BAC'$ là góc ngoài của $\triangle ABE$ tại đỉnh $A$ nên $\widehat{BAC'}=\widehat{ABE}+\widehat{AEB}=2\widehat{AEB}$.
Mà $\widehat{D'AC'}=\dfrac{1}{2}\widehat{BAC'}$ nên $\widehat{D'AC'}=\widehat{AEB}$.
Hai góc $\widehat{D'AC'}$ và $\widehat{AEB}$ ở vị trí đồng vị ($B$ và $D'$ cùng phía đối với đường thẳng $AC$, tia $AC'$ cùng hướng với tia $EA$) nên $AD'\parallel BE$.
Trong $\triangle CD'A$ có $BE\parallel D'A$ ($B\in CD'$, $E\in CA$) nên theo định lí Thalès: $\dfrac{CB}{CD'}=\dfrac{CE}{CA}$.
Do $B$ nằm giữa $D'$ và $C$ nên $CB=CD'-D'B$; do $E$ nằm giữa $A$ và $C$ nên $CE=CA-AE=CA-AB$.
Suy ra $\dfrac{CD'-D'B}{CD'}=\dfrac{CA-AB}{CA}$, hay $1-\dfrac{D'B}{D'C}=1-\dfrac{AB}{AC}$.
Vậy $\dfrac{D'B}{D'C}=\dfrac{AB}{AC}$ (đpcm).

{{HINH:phan_giac_ngoai_cm|Chứng minh: lấy E trên AC sao cho AE = AB, kẻ BE}}

##ĐL Định lí đảo của tính chất đường phân giác trong
Cho $\triangle ABC$, điểm $D$ thuộc đoạn $BC$. Nếu $\dfrac{DB}{DC}=\dfrac{AB}{AC}$ thì $AD$ là phân giác của góc $BAC$.
Chứng minh: gọi $D_1$ là chân đường phân giác trong kẻ từ $A$ thì $\dfrac{D_1B}{D_1C}=\dfrac{AB}{AC}=\dfrac{DB}{DC}$, suy ra $\dfrac{DB}{DB+DC}=\dfrac{D_1B}{D_1B+D_1C}$, tức $\dfrac{DB}{BC}=\dfrac{D_1B}{BC}$. Vậy $DB=D_1B$, mà $D$, $D_1$ cùng thuộc đoạn $BC$ nên $D\equiv D_1$.

##TC Tính các đoạn do phân giác chia ra
Đặt $BC=a$, $CA=b$, $AB=c$.
- Phân giác trong: $DB=\dfrac{ac}{b+c}$, $DC=\dfrac{ab}{b+c}$ (suy từ $\dfrac{DB}{DC}=\dfrac{c}{b}$ và $DB+DC=a$).
- Phân giác ngoài với $b>c$: $D'B=\dfrac{ac}{b-c}$, $D'C=\dfrac{ab}{b-c}$ (suy từ $\dfrac{D'B}{D'C}=\dfrac{c}{b}$ và $D'C-D'B=a$).

##TC Hai đường phân giác trong và ngoài vuông góc
Hai góc $BAC$ và $BAC'$ kề bù nên tổng của chúng bằng $180^\circ$. Mà $AD$, $AD'$ là các tia phân giác của hai góc đó nên $\widehat{DAD'}=\dfrac{1}{2}\widehat{BAC}+\dfrac{1}{2}\widehat{BAC'}=90^\circ$. Vậy $AD\perp AD'$.

{{HINH:hai_phan_giac|Phân giác trong AD và phân giác ngoài AD' vuông góc}}

##PP Cách dùng tính chất đường phân giác
Xác định đường phân giác là trong hay ngoài, chân của nó nằm trên đoạn $BC$ hay ngoài đoạn $BC$
Viết tỉ lệ thức $\dfrac{DB}{DC}=\dfrac{AB}{AC}$ (hoặc $\dfrac{D'B}{D'C}=\dfrac{AB}{AC}$), tử và mẫu của hai vế cùng chỉ hai đoạn ở hai đầu của $BC$ và hai cạnh kề tương ứng
Đổi tỉ lệ thức thành các dạng $\dfrac{DB}{AB}=\dfrac{DC}{AC}=\dfrac{BC}{AB+AC}$ để tính độ dài
Với phân giác ngoài, dùng $D'C-D'B=BC$ (khi $AB<AC$) hoặc $D'B-D'C=BC$ (khi $AB>AC$)
Bài chứng minh song song, đẳng thức tỉ số: kẻ thêm đường song song với phân giác để tạo tam giác cân rồi dùng định lí Thalès

##CY Lưu ý
- Đường phân giác ngoài chỉ cắt đường thẳng $BC$ khi $AB\ne AC$. Nếu $AB=AC$ thì phân giác ngoài song song với $BC$ (vì nó vuông góc với phân giác trong, mà phân giác trong của tam giác cân vuông góc với $BC$).
- Chân phân giác trong nằm giữa $B$ và $C$, chân phân giác ngoài nằm ngoài đoạn $BC$, về phía đỉnh có cạnh kề nhỏ hơn.
- Viết tỉ lệ thức đúng thứ tự: $\dfrac{DB}{DC}=\dfrac{AB}{AC}$, không viết $\dfrac{DB}{DC}=\dfrac{AC}{AB}$.
- Ở bài này chỉ dùng định lí Thalès, tam giác cân và tính chất các góc ở vị trí đặc biệt; chưa dùng tam giác đồng dạng.
