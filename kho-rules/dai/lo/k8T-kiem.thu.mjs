// Tự thử bộ tính biểu thức của k8T-kiem.mjs — node kho-rules/dai/lo/k8T-kiem.thu.mjs  (mọi dòng phải ✔)
import { giaTri, bangNhau, soVoiDe, docKiem, docNghiem, chuoi } from './k8T-kiem.mjs'

let hong = 0
const thu = (ten, dung) => { let ok = false, ghi = ''; try { ok = dung() === true } catch (e) { ghi = ' — ' + e.message } console.log((ok ? '✔ ' : '✘ ') + ten + ghi); if (!ok) hong++ }
const nem = (f) => { try { f(); return false } catch { return true } }

// giá trị
thu('2+3·4 = 14', () => chuoi(giaTri(String.raw`2+3\cdot 4`)) === '14')
thu('x^23 đọc như LaTeX: x^2·3', () => chuoi(giaTri('x^23', { x: giaTri('2') })) === '12')
thu('x^{10}', () => chuoi(giaTri('x^{10}', { x: giaTri('2') })) === '1024')
thu('phân số + thập phân', () => chuoi(giaTri(String.raw`\dfrac{1}{4}+0,25`)) === '1/2')
thu('phân số gõ tắt \\dfrac52, \\dfrac12x', () => chuoi(giaTri(String.raw`-\dfrac52`)) === '-5/2' && chuoi(giaTri(String.raw`\dfrac12x^3+4`, { x: giaTri('2') })) === '8')
thu('số thập phân kiểu 16{,}87', () => chuoi(giaTri(String.raw`16{,}87\cdot 100`)) === '1687')
thu('(-2)^4 và -2^4', () => chuoi(giaTri('(-2)^4')) === '16' && chuoi(giaTri('-2^4')) === '-16')
thu('nhân ngầm 5x(3x+2y)', () => chuoi(giaTri('5x(3x+2y)', { x: giaTri('2'), y: giaTri('1') })) === '80')
thu('ngoặc vuông', () => chuoi(giaTri('2[x(x-3)+2(x-3)]', { x: giaTri('5') })) === '28')
thu('giá trị tuyệt đối', () => chuoi(giaTri(String.raw`\lvert x-3\rvert`, { x: giaTri('1') })) === '2')
thu('chia bằng dấu :', () => chuoi(giaTri('12:4:3')) === '1')

// bằng nhau
thu('x^3-7x-6 = (x+1)(x+2)(x-3)', () => bangNhau('x^3-7x-6', '(x+1)(x+2)(x-3)').bang)
thu('sai dấu thì KHÔNG bằng', () => bangNhau('x^3-7x-6', '(x+1)(x-2)(x-3)').bang === false)
thu('a^3+b^3+c^3-3abc', () => bangNhau('a^3+b^3+c^3-3abc', '(a+b+c)(a^2+b^2+c^2-ab-bc-ca)').bang)
thu('hệ số phân số', () => bangNhau(String.raw`8x^3-\dfrac{1}{125}y^3`, String.raw`\left(2x-\dfrac{1}{5}y\right)\left(4x^2+\dfrac{2}{5}xy+\dfrac{1}{25}y^2\right)`).bang)
thu('thiếu một hạng tử thì KHÔNG bằng', () => bangNhau('x^5+x+1', '(x^2+x+1)(x^3-x^2)').bang === false)
thu('(x+2)(x+3)(x+4)(x+5)-24', () => bangNhau('(x+2)(x+3)(x+4)(x+5)-24', '(x^2+7x+16)(x+1)(x+6)').bang)

// theo dòng kiem
thu('bang: đạt', () => soVoiDe(docKiem('bang | 15x^2+10xy'), '$5x(3x+2y)$').ket_qua === 'dat')
thu('bang: không đạt', () => soVoiDe(docKiem('bang | 15x^2+10xy'), '$5x(3x+2)$').ket_qua === 'khong_dat')
thu('gia_tri', () => soVoiDe(docKiem('gia_tri | x(x-2009)-y(2009-x) | x=3009; y=1991'), '$5000000$').ket_qua === 'dat')
thu('gia_tri sai', () => soVoiDe(docKiem('gia_tri | x(x-2009)-y(2009-x) | x=3009; y=1991'), '$500000$').ket_qua === 'khong_dat')
thu('nghiem: S={0;2;-2}', () => soVoiDe(docKiem('nghiem | x^3-4x = 0 | x'), String.raw`$S=\{0;2;-2\}$`).ket_qua === 'dat')
thu('nghiem: có nghiệm sai', () => soVoiDe(docKiem('nghiem | x^3-4x = 0 | x'), String.raw`$S=\{0;2;3\}$`).ket_qua === 'khong_dat')
thu('đọc nghiệm dạng x=1; x=-2', () => docNghiem('$x=1$; $x=-2$').join('|') === '1|-2')
thu('nghiem phân số', () => soVoiDe(docKiem('nghiem | 2x-1 = 0 | x'), String.raw`$x=\dfrac{1}{2}$`).ket_qua === 'dat')
thu('khong ⇒ khong_kiem_duoc', () => soVoiDe(docKiem('khong'), 'Chứng minh').ket_qua === 'khong_kiem_duoc')

// không đoán
thu('lệnh lạ ⇒ ném lỗi', () => nem(() => giaTri(String.raw`x \rightarrow 2`)))
thu('căn ⇒ không kiểm được, không trả đạt', () => soVoiDe(docKiem(String.raw`bang | \sqrt{x^2}`), '$x$').ket_qua === 'khong_kiem_duoc')
thu('số mũ là chữ (bộ số thử là phân số) ⇒ không kiểm được, không trả đạt', () => soVoiDe(docKiem('bang | 2^{n+1}-2^n'), '$2^n$').ket_qua === 'khong_kiem_duoc')

console.log(hong ? `\n✘ ${hong} dòng hỏng` : '\n✔ tất cả đạt'); process.exit(hong ? 1 : 0)
