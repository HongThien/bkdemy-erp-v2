# ĐỀ | Chữ số tận cùng của lũy thừa — 3 bài mẫu + 10 bài clone (khối 6 nâng cao)
nam: 2026
bo_sach: KNTT

## PHẦN 1 | Chữ số tận cùng của lũy thừa | tra_loi_ngan

### Bài toán 1a | kho=dai | loai=tra_loi_ngan | dap_an=7
**Đề:** Tìm chữ số tận cùng của số $7^{9^{9}}$.
**Ghi chú:** Nguồn in lũy thừa chồng $7^{9^9}$ (ảnh sao chép mất cấp số mũ nhỏ, hiện "$7^{99}$"); đã khôi phục theo lời giải mẫu của nguồn ($9^9-1$ chia hết cho 4).

**Phần 1. Hướng dẫn**

**Mấu chốt:** chữ số tận cùng của $7^{m}$ lặp lại theo chu kì 4 của số mũ, nên **tìm số dư của số mũ khi chia cho 4** rồi dùng chữ số tận cùng của $7^4$.

**Bước 1.** Xét số mũ $9^{9}$: cơ số 9 chia 4 dư 1, nên mọi thừa số của tích đều có cùng số dư và ta tìm số dư của cả lũy thừa bằng cách nhân các số dư.

**Bước 2.** Viết số mũ dưới dạng $4k$ hoặc $4k+r$ rồi tách lũy thừa của $7$ thành tích của $7^{4k}$ với phần còn lại.

**Bước 3.** Tính $7^4$ để biết chữ số tận cùng của nó, rồi dùng tính chất: số có chữ số tận cùng là 0, 1, 5 hoặc 6 nâng lên lũy thừa nào cũng giữ nguyên chữ số tận cùng.

**Bước 4.** Nhân chữ số tận cùng của $7^{4k}$ với chữ số tận cùng của phần lũy thừa còn lại, chữ số tận cùng của tích là chữ số cần tìm.

**Chú ý:** số mũ ở đây cũng là một lũy thừa, nên phải tìm số dư của nó khi chia cho 4 chứ không chia cho 10.

**Phần 2. Trình bày**

Vì $9$ chia 4 dư 1 nên mỗi thừa số $9$ của $9^{9}$ chia 4 dư 1, mà tích các số chia 4 dư 1 thì chia 4 dư 1 (vì $(4a+1).(4b+1)=4.(4ab+a+b)+1$).

Suy ra $9^{9}=4k+1$ ($k\in\mathbb{N}^*$).

Do đó $7^{9^{9}}=7^{4k+1}=7^{4k}.7$.

Ta có $7^4=2401$ có chữ số tận cùng là 1 nên $7^{4k}=2401^k$ cũng có chữ số tận cùng là 1 (tích các số cùng có chữ số tận cùng là 1 thì vẫn có chữ số tận cùng là 1).

Số $7$ có chữ số tận cùng là 7.

Ta có $1.7=7$ nên $7^{4k}.7$ có chữ số tận cùng là 7.

Vậy $7^{9^{9}}$ có chữ số tận cùng là 7.

### Bài toán 1b | kho=dai | loai=tra_loi_ngan | dap_an=6
**Đề:** Tìm chữ số tận cùng của số $14^{14^{14}}$.
**Ghi chú:** Nguồn in lũy thừa chồng $14^{14^{14}}$ (ảnh sao chép mất cấp số mũ nhỏ, hiện "$14^{1414}$"); đã khôi phục theo lời giải mẫu của nguồn ($14^{14}=4k$).

**Phần 1. Hướng dẫn**

**Mấu chốt:** chữ số tận cùng của $14^{m}$ lặp lại theo chu kì 4 của số mũ, nên **tìm số dư của số mũ khi chia cho 4** rồi dùng chữ số tận cùng của $14^4$.

**Bước 1.** Xét số mũ $14^{14}$: cơ số 14 là số chẵn, nên kiểm tra xem lũy thừa này có chia hết cho 4 không bằng cách tách ra thừa số $14^2$.

**Bước 2.** Viết số mũ dưới dạng $4k$ hoặc $4k+r$ rồi tách lũy thừa của $14$ thành tích của $14^{4k}$ với phần còn lại.

**Bước 3.** Tính $14^4$ để biết chữ số tận cùng của nó, rồi dùng tính chất: số có chữ số tận cùng là 0, 1, 5 hoặc 6 nâng lên lũy thừa nào cũng giữ nguyên chữ số tận cùng.

**Chú ý:** số mũ ở đây cũng là một lũy thừa, nên phải tìm số dư của nó khi chia cho 4 chứ không chia cho 10.

**Phần 2. Trình bày**

Ta có $14^{14}=14^2.14^{12}$ và $14^2=196=4.49$ chia hết cho 4.

Suy ra $14^{14}=4k$ ($k\in\mathbb{N}^*$).

Do đó $14^{14^{14}}=14^{4k}$.

Ta có $14^4=38416$ có chữ số tận cùng là 6 nên $14^{4k}=38416^k$ cũng có chữ số tận cùng là 6 (tích các số cùng có chữ số tận cùng là 6 thì vẫn có chữ số tận cùng là 6).

Vậy $14^{14^{14}}$ có chữ số tận cùng là 6.

### Bài toán 1c | kho=dai | loai=tra_loi_ngan | dap_an=4
**Đề:** Tìm chữ số tận cùng của số $4^{5^{67}}$.
**Ghi chú:** Nguồn in lũy thừa chồng $4^{5^{67}}$ (ảnh sao chép mất cấp số mũ nhỏ, hiện "$4^{567}$"); đã khôi phục theo lời giải mẫu của nguồn ($5^{67}-1$ chia hết cho 4).

**Phần 1. Hướng dẫn**

**Mấu chốt:** chữ số tận cùng của $4^{m}$ lặp lại theo chu kì 4 của số mũ, nên **tìm số dư của số mũ khi chia cho 4** rồi dùng chữ số tận cùng của $4^4$.

**Bước 1.** Xét số mũ $5^{67}$: cơ số 5 chia 4 dư 1, nên mọi thừa số của tích đều có cùng số dư và ta tìm số dư của cả lũy thừa bằng cách nhân các số dư.

**Bước 2.** Viết số mũ dưới dạng $4k$ hoặc $4k+r$ rồi tách lũy thừa của $4$ thành tích của $4^{4k}$ với phần còn lại.

**Bước 3.** Tính $4^4$ để biết chữ số tận cùng của nó, rồi dùng tính chất: số có chữ số tận cùng là 0, 1, 5 hoặc 6 nâng lên lũy thừa nào cũng giữ nguyên chữ số tận cùng.

**Bước 4.** Nhân chữ số tận cùng của $4^{4k}$ với chữ số tận cùng của phần lũy thừa còn lại, chữ số tận cùng của tích là chữ số cần tìm.

**Chú ý:** số mũ ở đây cũng là một lũy thừa, nên phải tìm số dư của nó khi chia cho 4 chứ không chia cho 10.

**Phần 2. Trình bày**

Vì $5$ chia 4 dư 1 nên mỗi thừa số $5$ của $5^{67}$ chia 4 dư 1, mà tích các số chia 4 dư 1 thì chia 4 dư 1 (vì $(4a+1).(4b+1)=4.(4ab+a+b)+1$).

Suy ra $5^{67}=4k+1$ ($k\in\mathbb{N}^*$).

Do đó $4^{5^{67}}=4^{4k+1}=4^{4k}.4$.

Ta có $4^4=256$ có chữ số tận cùng là 6 nên $4^{4k}=256^k$ cũng có chữ số tận cùng là 6 (tích các số cùng có chữ số tận cùng là 6 thì vẫn có chữ số tận cùng là 6).

Số $4$ có chữ số tận cùng là 4.

Ta có $6.4=24$ nên $4^{4k}.4$ có chữ số tận cùng là 4.

Vậy $4^{5^{67}}$ có chữ số tận cùng là 4.

### Clone 1 | kho=dai | loai=tra_loi_ngan | dap_an=7
**Đề:** Tìm chữ số tận cùng của số $3^{7^{7}}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** chữ số tận cùng của $3^{m}$ lặp lại theo chu kì 4 của số mũ, nên **tìm số dư của số mũ khi chia cho 4** rồi dùng chữ số tận cùng của $3^4$.

**Bước 1.** Xét số mũ $7^{7}$: cơ số 7 chia 4 dư 3, nên xét $7^2$ chia 4 dư mấy rồi ghép lại theo số mũ 7 chẵn hay lẻ.

**Bước 2.** Viết số mũ dưới dạng $4k$ hoặc $4k+r$ rồi tách lũy thừa của $3$ thành tích của $3^{4k}$ với phần còn lại.

**Bước 3.** Tính $3^4$ để biết chữ số tận cùng của nó, rồi dùng tính chất: số có chữ số tận cùng là 0, 1, 5 hoặc 6 nâng lên lũy thừa nào cũng giữ nguyên chữ số tận cùng.

**Bước 4.** Nhân chữ số tận cùng của $3^{4k}$ với chữ số tận cùng của phần lũy thừa còn lại, chữ số tận cùng của tích là chữ số cần tìm.

**Chú ý:** số mũ ở đây cũng là một lũy thừa, nên phải tìm số dư của nó khi chia cho 4 chứ không chia cho 10.

**Phần 2. Trình bày**

Ta có $7^2=49=4.12+1$ chia 4 dư 1.

Vì số mũ $7$ là số lẻ nên $7^{7}=(7^2.7^2.\dots.7^2).7$ (3 thừa số $7^2$ rồi nhân với $7$); phần trong ngoặc chia 4 dư 1, còn $7$ chia 4 dư 3 nên tích chia 4 dư 3 (vì $(4a+1).(4b+3)=4.(4ab+3a+b)+3$).

Suy ra $7^{7}=4k+3$ ($k\in\mathbb{N}^*$).

Do đó $3^{7^{7}}=3^{4k+3}=3^{4k}.3^3$.

Ta có $3^4=81$ có chữ số tận cùng là 1 nên $3^{4k}=81^k$ cũng có chữ số tận cùng là 1 (tích các số cùng có chữ số tận cùng là 1 thì vẫn có chữ số tận cùng là 1).

Ta có $3^3=27$ có chữ số tận cùng là 7.

Ta có $1.7=7$ nên $3^{4k}.3^3$ có chữ số tận cùng là 7.

Vậy $3^{7^{7}}$ có chữ số tận cùng là 7.

### Clone 2 | kho=dai | loai=tra_loi_ngan | dap_an=2
**Đề:** Tìm chữ số tận cùng của số $2^{9^{9}}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** chữ số tận cùng của $2^{m}$ lặp lại theo chu kì 4 của số mũ, nên **tìm số dư của số mũ khi chia cho 4** rồi dùng chữ số tận cùng của $2^4$.

**Bước 1.** Xét số mũ $9^{9}$: cơ số 9 chia 4 dư 1, nên mọi thừa số của tích đều có cùng số dư và ta tìm số dư của cả lũy thừa bằng cách nhân các số dư.

**Bước 2.** Viết số mũ dưới dạng $4k$ hoặc $4k+r$ rồi tách lũy thừa của $2$ thành tích của $2^{4k}$ với phần còn lại.

**Bước 3.** Tính $2^4$ để biết chữ số tận cùng của nó, rồi dùng tính chất: số có chữ số tận cùng là 0, 1, 5 hoặc 6 nâng lên lũy thừa nào cũng giữ nguyên chữ số tận cùng.

**Bước 4.** Nhân chữ số tận cùng của $2^{4k}$ với chữ số tận cùng của phần lũy thừa còn lại, chữ số tận cùng của tích là chữ số cần tìm.

**Chú ý:** số mũ ở đây cũng là một lũy thừa, nên phải tìm số dư của nó khi chia cho 4 chứ không chia cho 10.

**Phần 2. Trình bày**

Vì $9$ chia 4 dư 1 nên mỗi thừa số $9$ của $9^{9}$ chia 4 dư 1, mà tích các số chia 4 dư 1 thì chia 4 dư 1 (vì $(4a+1).(4b+1)=4.(4ab+a+b)+1$).

Suy ra $9^{9}=4k+1$ ($k\in\mathbb{N}^*$).

Do đó $2^{9^{9}}=2^{4k+1}=2^{4k}.2$.

Ta có $2^4=16$ có chữ số tận cùng là 6 nên $2^{4k}=16^k$ cũng có chữ số tận cùng là 6 (tích các số cùng có chữ số tận cùng là 6 thì vẫn có chữ số tận cùng là 6).

Số $2$ có chữ số tận cùng là 2.

Ta có $6.2=12$ nên $2^{4k}.2$ có chữ số tận cùng là 2.

Vậy $2^{9^{9}}$ có chữ số tận cùng là 2.

### Clone 3 | kho=dai | loai=tra_loi_ngan | dap_an=1
**Đề:** Tìm chữ số tận cùng của số $13^{6^{6}}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** chữ số tận cùng của $13^{m}$ lặp lại theo chu kì 4 của số mũ, nên **tìm số dư của số mũ khi chia cho 4** rồi dùng chữ số tận cùng của $13^4$.

**Bước 1.** Xét số mũ $6^{6}$: cơ số 6 là số chẵn, nên kiểm tra xem lũy thừa này có chia hết cho 4 không bằng cách tách ra thừa số $6^2$.

**Bước 2.** Viết số mũ dưới dạng $4k$ hoặc $4k+r$ rồi tách lũy thừa của $13$ thành tích của $13^{4k}$ với phần còn lại.

**Bước 3.** Tính $13^4$ để biết chữ số tận cùng của nó, rồi dùng tính chất: số có chữ số tận cùng là 0, 1, 5 hoặc 6 nâng lên lũy thừa nào cũng giữ nguyên chữ số tận cùng.

**Chú ý:** số mũ ở đây cũng là một lũy thừa, nên phải tìm số dư của nó khi chia cho 4 chứ không chia cho 10.

**Phần 2. Trình bày**

Ta có $6^{6}=6^2.6^{4}$ và $6^2=36=4.9$ chia hết cho 4.

Suy ra $6^{6}=4k$ ($k\in\mathbb{N}^*$).

Do đó $13^{6^{6}}=13^{4k}$.

Ta có $13^4=28561$ có chữ số tận cùng là 1 nên $13^{4k}=28561^k$ cũng có chữ số tận cùng là 1 (tích các số cùng có chữ số tận cùng là 1 thì vẫn có chữ số tận cùng là 1).

Vậy $13^{6^{6}}$ có chữ số tận cùng là 1.

### Clone 4 | kho=dai | loai=tra_loi_ngan | dap_an=8
**Đề:** Tìm chữ số tận cùng của số $8^{5^{13}}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** chữ số tận cùng của $8^{m}$ lặp lại theo chu kì 4 của số mũ, nên **tìm số dư của số mũ khi chia cho 4** rồi dùng chữ số tận cùng của $8^4$.

**Bước 1.** Xét số mũ $5^{13}$: cơ số 5 chia 4 dư 1, nên mọi thừa số của tích đều có cùng số dư và ta tìm số dư của cả lũy thừa bằng cách nhân các số dư.

**Bước 2.** Viết số mũ dưới dạng $4k$ hoặc $4k+r$ rồi tách lũy thừa của $8$ thành tích của $8^{4k}$ với phần còn lại.

**Bước 3.** Tính $8^4$ để biết chữ số tận cùng của nó, rồi dùng tính chất: số có chữ số tận cùng là 0, 1, 5 hoặc 6 nâng lên lũy thừa nào cũng giữ nguyên chữ số tận cùng.

**Bước 4.** Nhân chữ số tận cùng của $8^{4k}$ với chữ số tận cùng của phần lũy thừa còn lại, chữ số tận cùng của tích là chữ số cần tìm.

**Chú ý:** số mũ ở đây cũng là một lũy thừa, nên phải tìm số dư của nó khi chia cho 4 chứ không chia cho 10.

**Phần 2. Trình bày**

Vì $5$ chia 4 dư 1 nên mỗi thừa số $5$ của $5^{13}$ chia 4 dư 1, mà tích các số chia 4 dư 1 thì chia 4 dư 1 (vì $(4a+1).(4b+1)=4.(4ab+a+b)+1$).

Suy ra $5^{13}=4k+1$ ($k\in\mathbb{N}^*$).

Do đó $8^{5^{13}}=8^{4k+1}=8^{4k}.8$.

Ta có $8^4=4096$ có chữ số tận cùng là 6 nên $8^{4k}=4096^k$ cũng có chữ số tận cùng là 6 (tích các số cùng có chữ số tận cùng là 6 thì vẫn có chữ số tận cùng là 6).

Số $8$ có chữ số tận cùng là 8.

Ta có $6.8=48$ nên $8^{4k}.8$ có chữ số tận cùng là 8.

Vậy $8^{5^{13}}$ có chữ số tận cùng là 8.

### Clone 5 | kho=dai | loai=tra_loi_ngan | dap_an=3
**Đề:** Tìm chữ số tận cùng của số $17^{11^{11}}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** chữ số tận cùng của $17^{m}$ lặp lại theo chu kì 4 của số mũ, nên **tìm số dư của số mũ khi chia cho 4** rồi dùng chữ số tận cùng của $17^4$.

**Bước 1.** Xét số mũ $11^{11}$: cơ số 11 chia 4 dư 3, nên xét $11^2$ chia 4 dư mấy rồi ghép lại theo số mũ 11 chẵn hay lẻ.

**Bước 2.** Viết số mũ dưới dạng $4k$ hoặc $4k+r$ rồi tách lũy thừa của $17$ thành tích của $17^{4k}$ với phần còn lại.

**Bước 3.** Tính $17^4$ để biết chữ số tận cùng của nó, rồi dùng tính chất: số có chữ số tận cùng là 0, 1, 5 hoặc 6 nâng lên lũy thừa nào cũng giữ nguyên chữ số tận cùng.

**Bước 4.** Nhân chữ số tận cùng của $17^{4k}$ với chữ số tận cùng của phần lũy thừa còn lại, chữ số tận cùng của tích là chữ số cần tìm.

**Chú ý:** số mũ ở đây cũng là một lũy thừa, nên phải tìm số dư của nó khi chia cho 4 chứ không chia cho 10.

**Phần 2. Trình bày**

Ta có $11^2=121=4.30+1$ chia 4 dư 1.

Vì số mũ $11$ là số lẻ nên $11^{11}=(11^2.11^2.\dots.11^2).11$ (5 thừa số $11^2$ rồi nhân với $11$); phần trong ngoặc chia 4 dư 1, còn $11$ chia 4 dư 3 nên tích chia 4 dư 3 (vì $(4a+1).(4b+3)=4.(4ab+3a+b)+3$).

Suy ra $11^{11}=4k+3$ ($k\in\mathbb{N}^*$).

Do đó $17^{11^{11}}=17^{4k+3}=17^{4k}.17^3$.

Ta có $17^4=83521$ có chữ số tận cùng là 1 nên $17^{4k}=83521^k$ cũng có chữ số tận cùng là 1 (tích các số cùng có chữ số tận cùng là 1 thì vẫn có chữ số tận cùng là 1).

Ta có $17^3=4913$ có chữ số tận cùng là 3.

Ta có $1.3=3$ nên $17^{4k}.17^3$ có chữ số tận cùng là 3.

Vậy $17^{11^{11}}$ có chữ số tận cùng là 3.

### Clone 6 | kho=dai | loai=tra_loi_ngan | dap_an=6
**Đề:** Tìm chữ số tận cùng của số $12^{10^{10}}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** chữ số tận cùng của $12^{m}$ lặp lại theo chu kì 4 của số mũ, nên **tìm số dư của số mũ khi chia cho 4** rồi dùng chữ số tận cùng của $12^4$.

**Bước 1.** Xét số mũ $10^{10}$: cơ số 10 là số chẵn, nên kiểm tra xem lũy thừa này có chia hết cho 4 không bằng cách tách ra thừa số $10^2$.

**Bước 2.** Viết số mũ dưới dạng $4k$ hoặc $4k+r$ rồi tách lũy thừa của $12$ thành tích của $12^{4k}$ với phần còn lại.

**Bước 3.** Tính $12^4$ để biết chữ số tận cùng của nó, rồi dùng tính chất: số có chữ số tận cùng là 0, 1, 5 hoặc 6 nâng lên lũy thừa nào cũng giữ nguyên chữ số tận cùng.

**Chú ý:** số mũ ở đây cũng là một lũy thừa, nên phải tìm số dư của nó khi chia cho 4 chứ không chia cho 10.

**Phần 2. Trình bày**

Ta có $10^{10}=10^2.10^{8}$ và $10^2=100=4.25$ chia hết cho 4.

Suy ra $10^{10}=4k$ ($k\in\mathbb{N}^*$).

Do đó $12^{10^{10}}=12^{4k}$.

Ta có $12^4=20736$ có chữ số tận cùng là 6 nên $12^{4k}=20736^k$ cũng có chữ số tận cùng là 6 (tích các số cùng có chữ số tận cùng là 6 thì vẫn có chữ số tận cùng là 6).

Vậy $12^{10^{10}}$ có chữ số tận cùng là 6.

### Clone 7 | kho=dai | loai=tra_loi_ngan | dap_an=4
**Đề:** Tìm chữ số tận cùng của số $14^{7^{9}}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** chữ số tận cùng của $14^{m}$ lặp lại theo chu kì 4 của số mũ, nên **tìm số dư của số mũ khi chia cho 4** rồi dùng chữ số tận cùng của $14^4$.

**Bước 1.** Xét số mũ $7^{9}$: cơ số 7 chia 4 dư 3, nên xét $7^2$ chia 4 dư mấy rồi ghép lại theo số mũ 9 chẵn hay lẻ.

**Bước 2.** Viết số mũ dưới dạng $4k$ hoặc $4k+r$ rồi tách lũy thừa của $14$ thành tích của $14^{4k}$ với phần còn lại.

**Bước 3.** Tính $14^4$ để biết chữ số tận cùng của nó, rồi dùng tính chất: số có chữ số tận cùng là 0, 1, 5 hoặc 6 nâng lên lũy thừa nào cũng giữ nguyên chữ số tận cùng.

**Bước 4.** Nhân chữ số tận cùng của $14^{4k}$ với chữ số tận cùng của phần lũy thừa còn lại, chữ số tận cùng của tích là chữ số cần tìm.

**Chú ý:** số mũ ở đây cũng là một lũy thừa, nên phải tìm số dư của nó khi chia cho 4 chứ không chia cho 10.

**Phần 2. Trình bày**

Ta có $7^2=49=4.12+1$ chia 4 dư 1.

Vì số mũ $9$ là số lẻ nên $7^{9}=(7^2.7^2.\dots.7^2).7$ (4 thừa số $7^2$ rồi nhân với $7$); phần trong ngoặc chia 4 dư 1, còn $7$ chia 4 dư 3 nên tích chia 4 dư 3 (vì $(4a+1).(4b+3)=4.(4ab+3a+b)+3$).

Suy ra $7^{9}=4k+3$ ($k\in\mathbb{N}^*$).

Do đó $14^{7^{9}}=14^{4k+3}=14^{4k}.14^3$.

Ta có $14^4=38416$ có chữ số tận cùng là 6 nên $14^{4k}=38416^k$ cũng có chữ số tận cùng là 6 (tích các số cùng có chữ số tận cùng là 6 thì vẫn có chữ số tận cùng là 6).

Ta có $14^3=2744$ có chữ số tận cùng là 4.

Ta có $6.4=24$ nên $14^{4k}.14^3$ có chữ số tận cùng là 4.

Vậy $14^{7^{9}}$ có chữ số tận cùng là 4.

### Clone 8 | kho=dai | loai=tra_loi_ngan | dap_an=9
**Đề:** Tìm chữ số tận cùng của số $19^{7^{20}}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** chữ số tận cùng của $19^{m}$ lặp lại theo chu kì 4 của số mũ, nên **tìm số dư của số mũ khi chia cho 4** rồi dùng chữ số tận cùng của $19^4$.

**Bước 1.** Xét số mũ $7^{20}$: cơ số 7 chia 4 dư 3, nên xét $7^2$ chia 4 dư mấy rồi ghép lại theo số mũ 20 chẵn hay lẻ.

**Bước 2.** Viết số mũ dưới dạng $4k$ hoặc $4k+r$ rồi tách lũy thừa của $19$ thành tích của $19^{4k}$ với phần còn lại.

**Bước 3.** Tính $19^4$ để biết chữ số tận cùng của nó, rồi dùng tính chất: số có chữ số tận cùng là 0, 1, 5 hoặc 6 nâng lên lũy thừa nào cũng giữ nguyên chữ số tận cùng.

**Bước 4.** Nhân chữ số tận cùng của $19^{4k}$ với chữ số tận cùng của phần lũy thừa còn lại, chữ số tận cùng của tích là chữ số cần tìm.

**Chú ý:** số mũ ở đây cũng là một lũy thừa, nên phải tìm số dư của nó khi chia cho 4 chứ không chia cho 10.

**Phần 2. Trình bày**

Ta có $7^2=49=4.12+1$ chia 4 dư 1.

Vì số mũ $20$ là số chẵn nên $7^{20}=7^2.7^2.\dots.7^2$ (10 thừa số $7^2$) chia 4 dư 1 (tích các số chia 4 dư 1).

Suy ra $7^{20}=4k+1$ ($k\in\mathbb{N}^*$).

Do đó $19^{7^{20}}=19^{4k+1}=19^{4k}.19$.

Ta có $19^4=130321$ có chữ số tận cùng là 1 nên $19^{4k}=130321^k$ cũng có chữ số tận cùng là 1 (tích các số cùng có chữ số tận cùng là 1 thì vẫn có chữ số tận cùng là 1).

Số $19$ có chữ số tận cùng là 9.

Ta có $1.9=9$ nên $19^{4k}.19$ có chữ số tận cùng là 9.

Vậy $19^{7^{20}}$ có chữ số tận cùng là 9.

### Clone 9 | kho=dai | loai=tra_loi_ngan | dap_an=8
**Đề:** Tìm chữ số tận cùng của số $18^{3^{12}}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** chữ số tận cùng của $18^{m}$ lặp lại theo chu kì 4 của số mũ, nên **tìm số dư của số mũ khi chia cho 4** rồi dùng chữ số tận cùng của $18^4$.

**Bước 1.** Xét số mũ $3^{12}$: cơ số 3 chia 4 dư 3, nên xét $3^2$ chia 4 dư mấy rồi ghép lại theo số mũ 12 chẵn hay lẻ.

**Bước 2.** Viết số mũ dưới dạng $4k$ hoặc $4k+r$ rồi tách lũy thừa của $18$ thành tích của $18^{4k}$ với phần còn lại.

**Bước 3.** Tính $18^4$ để biết chữ số tận cùng của nó, rồi dùng tính chất: số có chữ số tận cùng là 0, 1, 5 hoặc 6 nâng lên lũy thừa nào cũng giữ nguyên chữ số tận cùng.

**Bước 4.** Nhân chữ số tận cùng của $18^{4k}$ với chữ số tận cùng của phần lũy thừa còn lại, chữ số tận cùng của tích là chữ số cần tìm.

**Chú ý:** số mũ ở đây cũng là một lũy thừa, nên phải tìm số dư của nó khi chia cho 4 chứ không chia cho 10.

**Phần 2. Trình bày**

Ta có $3^2=9=4.2+1$ chia 4 dư 1.

Vì số mũ $12$ là số chẵn nên $3^{12}=3^2.3^2.\dots.3^2$ (6 thừa số $3^2$) chia 4 dư 1 (tích các số chia 4 dư 1).

Suy ra $3^{12}=4k+1$ ($k\in\mathbb{N}^*$).

Do đó $18^{3^{12}}=18^{4k+1}=18^{4k}.18$.

Ta có $18^4=104976$ có chữ số tận cùng là 6 nên $18^{4k}=104976^k$ cũng có chữ số tận cùng là 6 (tích các số cùng có chữ số tận cùng là 6 thì vẫn có chữ số tận cùng là 6).

Số $18$ có chữ số tận cùng là 8.

Ta có $6.8=48$ nên $18^{4k}.18$ có chữ số tận cùng là 8.

Vậy $18^{3^{12}}$ có chữ số tận cùng là 8.

### Clone 10 | kho=dai | loai=tra_loi_ngan | dap_an=4
**Đề:** Tìm chữ số tận cùng của số $2^{2022}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** chữ số tận cùng của $2^{m}$ lặp lại theo chu kì 4 của số mũ, nên **tìm số dư của số mũ khi chia cho 4** rồi dùng chữ số tận cùng của $2^4$.

**Bước 1.** Chia số mũ 2022 cho 4 để tìm số dư, tức là viết số mũ dưới dạng $4q+r$.

**Bước 2.** Viết số mũ dưới dạng $4k$ hoặc $4k+r$ rồi tách lũy thừa của $2$ thành tích của $2^{4k}$ với phần còn lại.

**Bước 3.** Tính $2^4$ để biết chữ số tận cùng của nó, rồi dùng tính chất: số có chữ số tận cùng là 0, 1, 5 hoặc 6 nâng lên lũy thừa nào cũng giữ nguyên chữ số tận cùng.

**Bước 4.** Nhân chữ số tận cùng của $2^{4k}$ với chữ số tận cùng của phần lũy thừa còn lại, chữ số tận cùng của tích là chữ số cần tìm.

**Chú ý:** chữ số tận cùng của một tích chỉ phụ thuộc chữ số tận cùng của từng thừa số.

**Phần 2. Trình bày**

Ta có $2022=4.505+2$.

Suy ra $2^{2022}=2^{4k+2}=2^{4k}.2^2$ với $k=505$.

Ta có $2^4=16$ có chữ số tận cùng là 6 nên $2^{4k}=16^k$ cũng có chữ số tận cùng là 6 (tích các số cùng có chữ số tận cùng là 6 thì vẫn có chữ số tận cùng là 6).

Ta có $2^2=4$ có chữ số tận cùng là 4.

Ta có $6.4=24$ nên $2^{4k}.2^2$ có chữ số tận cùng là 4.

Vậy $2^{2022}$ có chữ số tận cùng là 4.

## GHI CHÚ CHO NGƯỜI DUYỆT

- 3 bài mẫu = Bài toán 1 a/b/c của nguồn Thùy gửi 13/10 (lũy thừa chồng). 10 bài clone: đổi cơ số / số mũ, phủ đủ 4 trường hợp số dư của số mũ khi chia cho 4 (0 · 1 · 2 · 3), cơ số tận cùng 2, 3, 4, 7, 8, 9.
- Phương pháp lớp 6 (không đồng dư): số dư của số mũ tìm bằng tích các số dư ($(4a+1)(4b+1)$ vẫn dư 1…), chữ số tận cùng của $x^4$ ∈ {0, 1, 5, 6} rồi nâng lên lũy thừa $k$.
- Đáp số là MỘT chữ số ⇒ trả lời ngắn.
