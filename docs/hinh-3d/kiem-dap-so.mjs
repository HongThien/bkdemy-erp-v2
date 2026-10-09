// Kiểm đáp số 10 bài 3D của spec-day-hinh-3d.md §C (tích phân số Simpson + Monte Carlo). Chạy: node docs/hinh-3d/kiem-dap-so.mjs
// Cột trái = tính số, cột phải = đáp số dạng đóng của spec. Lệch ⇒ spec hoặc lời giải sai.
const simp=(f,a,b,n=20000)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=(i%2?4:2)*f(a+i*h);return s*h/3}
const PI=Math.PI
// 43 cach 2
console.log('43 cach2', simp(x=>{const c=1-x/10;return 36*Math.acos(c)-36*c*Math.sqrt(Math.max(0,1-c*c))},0,10))
// 43 Monte Carlo: cylinder R=6,h=10; water below plane z = (h/R)*y  (plane through diameter y=0 at z=0, up to rim at y=R)
let n=0,N=2e6;for(let i=0;i<N;i++){const x=(Math.random()*2-1)*6,y=(Math.random()*2-1)*6,z=Math.random()*10;if(x*x+y*y<=36&&z<=10/6*y)n++}console.log('43 MC',n/N*12*12*10)
// 44
console.log('44', simp(x=>(PI/4-0.5)*(90**2*(1-x*x/75**2))/2,-75,75), (PI-2)*101250)
// 45 shell
console.log('45', 500*PI+2*PI*simp(x=>x*(x-10)**2/5,0,10), 2500*PI/3)
// 46 MC on revolution: solid = rotate right half; radius check per y
const f46=y=>{ // returns [inner,outer] for y>=0
 const u=y-1, r=Math.sqrt(Math.max(0,2-u*u)); if(y<=2) return [0,1+r]; return [1-r,1+r]}
console.log('46', 2*PI*simp(y=>{const[a,b]=f46(y);return b*b-a*a},0,1+Math.SQRT2), 32*PI/3+4*PI*PI)
// 47 MC
n=0;for(let i=0;i<N;i++){const x=Math.random(),y=Math.random(),z=Math.random();if(x*x+z*z<=1&&y*y+z*z<=1)n++}console.log('47 MC a=1',n/N,2/3)
// 48
const f=x=>x*x-8*x+12,g=x=>6-x
console.log('48', PI*simp(x=>{const lo=f(x),hi=g(x);return lo>=0?hi*hi-lo*lo:Math.max(hi*hi,lo*lo)},1,6,60000), 836*PI/15)
// 49
console.log('49', PI*simp(x=>Math.max((x*x+1)**2,(x+1)**2),-1,1,60000), 21*PI/5)
// 50,52
console.log('50', PI*simp(x=>9*(1-x*x/25),-4,4), 1416*PI/25)
const v52=PI*simp(x=>(0.5-0.4*x*x)**2,-0.5,0.5); console.log('52 V(m3)',v52,'lit',v52*1000,'tien(nghin)',v52*1000*30*7)
// 53: section area, R=1, plane z=sqrt3(x+1/2), over disk x>=-1/2 (check z<=4 at x=1)
const S=2*simp(x=>Math.sqrt(Math.max(0,1-x*x)),-0.5,1,60000); console.log('53 proj',S,'section',S/Math.cos(PI/3),'4pi/3+sqrt3/2=',4*PI/3+Math.sqrt(3)/2,'4pi/3+sqrt3/4=',4*PI/3+Math.sqrt(3)/4,'zmax',Math.sqrt(3)*1.5)
// Bẫy câu 48/49: áp bừa công thức vành khăn trên cả đoạn
console.log('48 bẫy π∫(g²−f²) [1;6] =', PI*simp(x=>g(x)**2-f(x)**2,1,6,60000), '(ra 0)')
console.log('49 bẫy π∫((x²+1)²−(x+1)²) [−1;1] =', PI*simp(x=>(x*x+1)**2-(x+1)**2,-1,1,60000), '= 16π/15 =', 16*PI/15)
// Câu 43: mực nước cốc đứng, góc nghiêng cuối, góc đổi chế độ (mặt nước bắt đầu cắt đáy)
console.log('43 h0 =', 240/(36*PI), '· α =', Math.atan(10/6)*180/PI, '° · đổi chế độ', Math.atan(240/(36*PI)/6)*180/PI, '°')
