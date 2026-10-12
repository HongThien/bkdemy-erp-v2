=== D1.35b@p13
- bai: 35 · y: b · trang: 13 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T010102
- cong_cu: tổng các bình phương
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: ĐỀ ĐÃ SỬA so với sách. Sách in "Cho biết $a^4+b^4+c^4+d^4=4abcd$. Chứng minh rằng $a=b=c=d$" — thiếu điều kiện nên sai ($a=b=1$, $c=d=-1$ thoả giả thiết mà $a\ne c$). CEO 10/10: thêm "các số dương". Khối này do người soát (Opus) viết, không phải trạm soạn; ý a của bài 35 là câu D1.35@p13.
## DE
Cho các số dương $a,b,c,d$ thoả mãn $a^4+b^4+c^4+d^4=4abcd$. Chứng minh rằng $a=b=c=d$.
## SACH
b) $a^4+b^4+c^4+d^4=4abcd$
$\Leftrightarrow a^4+b^4+c^4+d^4-4abcd=0$
$\Leftrightarrow (a^4-2a^2b^2+b^4)+(c^4-2c^2d^2+d^4)+(2a^2b^2-4abcd+2c^2d^2)=0$
$\Leftrightarrow (a^2-b^2)^2+(c^2-d^2)^2+2(ab-cd)^2=0$
(sách dừng ở đây, không kết luận)
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế phải $4abcd$ gợi ra hai tích kép $2a^2b^2$ và $2c^2d^2$: thêm bớt chúng thì vế trái tách thành tổng ba bình phương bằng $0$.

**Bước 1.** Chuyển $4abcd$ sang vế trái rồi thêm bớt $2a^2b^2$ và $2c^2d^2$ để ghép được hai bình phương của hiệu $a^2-b^2$, $c^2-d^2$.

**Bước 2.** Nhận ra ba hạng tử còn lại là hai lần bình phương của $ab-cd$, nên vế trái là tổng ba số không âm.

**Bước 3.** Tổng các số không âm bằng $0$ thì từng số bằng $0$; dùng điều kiện các số dương để từ bình phương bằng nhau suy ra các số bằng nhau.

**Chú ý:** Không có điều kiện "dương" thì kết luận sai: $a=b=1$, $c=d=-1$ vẫn thoả giả thiết.

**Phần 2. Trình bày**

$a^4+b^4+c^4+d^4=4abcd$

$\Leftrightarrow (a^4-2a^2b^2+b^4)+(c^4-2c^2d^2+d^4)+(2a^2b^2-4abcd+2c^2d^2)=0$

$\Leftrightarrow (a^2-b^2)^2+(c^2-d^2)^2+2(ab-cd)^2=0$

Vì ba số hạng đều không âm nên $a^2=b^2$, $c^2=d^2$ và $ab=cd$.

Vì $a,b,c,d$ dương nên từ $a^2=b^2$ suy ra $a=b$, từ $c^2=d^2$ suy ra $c=d$.

Khi đó $ab=cd$ trở thành $a^2=c^2$, mà $a,c$ dương nên $a=c$.

Vậy $a=b=c=d$.
