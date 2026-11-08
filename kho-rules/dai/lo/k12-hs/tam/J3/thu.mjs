const log=(...a)=>console.log(...a)
// dem so lan doi dau cua h tren luoi min..max (bo qua nghiem chinh xac bang cach lay mau le)
function doiDau(h,a,b,N=400003){let c=0,prev=null,xs=[];for(let i=0;i<=N;i++){const x=a+(b-a)*(i+0.37)/(N+1);const v=h(x);if(v===0)continue;const s=Math.sign(v);if(prev!==null&&s!==prev){c++;xs.push(+x.toFixed(3))}prev=s}return [c,xs]}
const dh=(f)=>(x)=>(f(x+1e-6)-f(x-1e-6))/2e-6
// 4.1 VD1
for(const m of [-5,0,2.9,3,3.1,5]){const [c]=doiDau(x=>3*x*x-6*x+m,-20,20);log('4.1a m',m,c)}
// 4.1 VD2
const cnt=(m)=>doiDau(x=>3*(m-2)*x*x+6*x+m,-50,50)[0]
for(const m of [-3,-1.01,-1,-0.5,1,2,2.5,2.99,3,4]) log('4.1b m',m,cnt(m))
// 4.2 VD1
{const a=-2,b=-7,f=x=>x**3+a*x*x+b*x+1;log('4.2a',doiDau(x=>3*x*x+2*a*x+b,-10,10),f(-1))}
// 4.2 VD2
for(const m of [1,2]){const [c,xs]=doiDau(x=>x*x-2*m*x+m*m-m+1,-10,10);log('4.2b m',m,xs)}
// 4.3
{const m=-3;const f=x=>x**3-3*x*x+m*x+1;const r=[1+Math.sqrt(1-m/3),1-Math.sqrt(1-m/3)];log('4.3a',r[0]**2+r[1]**2)}
for(const m of [0.5,-0.75]){const D=m*m-(2*m-3);const r=[m+Math.sqrt(D),m-Math.sqrt(D)];log('4.3b',m,r,r[0]+2*r[1],r[1]+2*r[0])}
// 4.4
{log('4.4a',[0.5,2,3.5,0,4,-1].map(m=>{const A=m,B=m-4;return [m,A*B<0]}))}
{const y=(m)=>x=>x**3-3*m*x*x+3*(m*m-1)*x-m**3+3*m;for(const m of [1,0.3]){const f=y(m);log('4.4b m',m,'A',f(m-1),'B',f(m+1),doiDau(dh(f),m-5,m+5)[1])}}
// 4.5
{const m=1,f=x=>x**4-2*m*x*x+m-1;const A=[0,m-1],B=[-1,f(-1)],C=[1,f(1)];log('4.5a',(B[0]-A[0])*(C[0]-A[0])+(B[1]-A[1])*(C[1]-A[1]),f(-1),f(1))}
{const m=3,k=m-1;const f=x=>x**4-2*k*x*x+m-2;const A=[0,f(0)],B=[-Math.sqrt(k),f(-Math.sqrt(k))],C=[Math.sqrt(k),f(Math.sqrt(k))];const S=0.5*Math.abs((B[0]-A[0])*(C[1]-A[1])-(C[0]-A[0])*(B[1]-A[1]));log('4.5b S',S,4*Math.SQRT2,doiDau(dh(f),-5,5)[1])}
// 4.6
for(const m of [-1,0,0.01,3]){const f=x=>(x*x+m*x+1)/(x+1);const g=dh(f);log('4.6a m',m,doiDau(x=>g(x),-20,-1.0001)[0]+doiDau(x=>g(x),-0.9999,20)[0])}
{const m=2,f=x=>(x*x+2*x+m)/(x-1);const g=dh(f);const [c,xs]=doiDau(g,-10,0.9999);const [c2,xs2]=doiDau(g,1.0001,10);log('4.6b',xs,xs2);const x1=1-Math.sqrt(3+m),x2=1+Math.sqrt(3+m);log(f(x1),f(x2),Math.hypot(x2-x1,f(x2)-f(x1)),2*x1+2)}
for(const m of [-3.5,-3,-2,2]) {const f=x=>(x*x+2*x+m)/(x-1);const g=dh(f);log('4.6b m',m,doiDau(g,-30,0.9999)[0]+doiDau(g,1.0001,30)[0])}
// 5.1
{const f=x=>x**3-3*x*x-9*x+1;log('5.1a',doiDau(dh(f),-10,10)[1],f(-1),-8*-1-2,f(3),-8*3-2)}
{const f=x=>(x*x-2*x+4)/(x-1);const s=Math.sqrt(3);log('5.1b',f(1+s),2*(1+s)-2,f(1-s),2*(1-s)-2)}
// 5.2
{log('5.2a',Math.hypot(2,-4),2*Math.sqrt(5),2/Math.sqrt(5))}
{const m=4,f=x=>x**3-3*m*x+1;const A=[-Math.sqrt(m),f(-Math.sqrt(m))],B=[Math.sqrt(m),f(Math.sqrt(m))];log('5.2b',A,B,0.5*Math.abs(A[0]*B[1]-B[0]*A[1]))}
// 5.3
{const m=2,f=x=>x**3-3*m*x+1;const A=[-Math.sqrt(m),f(-Math.sqrt(m))],B=[Math.sqrt(m),f(Math.sqrt(m))];log('5.3a',(B[1]-A[1])/(B[0]-A[0]),-2*m)}
{const m=4,f=x=>x**3-3*x*x+m;log('5.3b',f(0),f(2),(f(0)+f(2))/2)}
// 6.1 VD1
{const f=x=>x**3-3*x*x+1;log('6.1a |f|',doiDau(dh(x=>Math.abs(f(x))),-10,10),'f(|x|)',doiDau(dh(x=>f(Math.abs(x))),-10,10),'roots',doiDau(f,-10,10))}
// 6.1 VD2: f' = (t+1)(t-1)^? y: -inf,3,0,+inf ; build f: f'=3(x+1)(x-1)... cubic: f(x)=x^3-3x+1 has f(-1)=3,f(1)=-1 ; need f(1)=0 -> f=x^3-3x+2 : f(-1)=4, f(1)=0
{const f=x=>x**3-3*x+2;log('6.1b |f|',doiDau(dh(x=>Math.abs(f(x))),-10,10),'f(|x|)',doiDau(dh(x=>f(Math.abs(x))),-10,10))}
// 6.2 VD1
{const fp=t=>t*(t-1)*(t-2);const g=x=>(2*x-2)*fp(x*x-2*x);log('6.2a',doiDau(g,-10,10))}
{const fp=t=>(t+4)*(t-5);const g=x=>(2*x-4)*fp(x*x-4*x);log('6.2b',doiDau(g,-20,20))}
// 6.3 VD1
for(let m=-4;m<=8;m++){const fp=t=>t*(t-4);const g=x=>(2*x-2)*fp(x*x-2*x+m);log('6.3a m',m,doiDau(g,-30,30)[0])}
for(let m=-6;m<=6;m++){const fp=t=>t*(t-2);const g=x=>(3*x*x-3)*fp(x**3-3*x+m);log('6.3b m',m,doiDau(g,-30,30)[0])}
