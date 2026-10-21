const d=(f,x,h=1e-6)=>(f(x+h)-f(x-h))/(2*h)
const ok=(c,m)=>console.log(c?'OK ':'XX ',m)
const near=(a,b,e=1e-5)=>Math.abs(a-b)<e
// nghiem dem: quet doi dau + cham 0
function roots(f,a,b,N=400000){const r=[];let px=a,py=f(a);for(let i=1;i<=N;i++){const x=a+(b-a)*i/N,y=f(x);if(py===0||py*y<0){// bisect
let lo=px,hi=x;for(let k=0;k<80;k++){const m=(lo+hi)/2;if(f(lo)*f(m)<=0)hi=m;else lo=m}r.push((lo+hi)/2)}px=x;py=y}return r}
function dem(f,a,b){ // dem nghiem ke ca nghiem kep (cuc tri bang 0)
 const r=roots(f,a,b);const N=400000;let c=[...r];
 for(let i=1;i<N;i++){const x=a+(b-a)*i/N;const y=f(x);if(Math.abs(y)<1e-9&&Math.abs(d(f,x))<1e-4){if(!c.some(q=>Math.abs(q-x)<1e-3))c.push(x)}}
 return c}
// 6.2.1
let f=x=>x**3-3*x**2+2; ok(near(f(3),2)&&near(d(f,3),9),'tt tai x=3: y=9x-25'); ok(near(f(1),0)&&near(d(f,1),-3),'uon x=1: y=-3x+3')
f=x=>(2*x-1)/(x+1); ok(near(f(.5),0)&&near(d(f,.5),4/3),'giao Ox: k=4/3'); ok(near(f(2),1)&&near(d(f,2),1/3),'tung do 1: x=2 k=1/3')
// 6.2.2
f=x=>x**3+3*x**2-2; for(const x of [1,-3]) ok(near(d(f,x),9),'k=9 x='+x), ok(near(f(1),2)&&near(f(-3),-2),'y');
for(const x of [2,-4]) ok(near(d(f,x),24),'k=24 x='+x); ok(near(f(2),18)&&near(f(-4),-18),'y 18/-18')
// tt: 9x-7: at x=1: 9-7=2 ok; x=-3: 9*-3+25=-2 ok; 24x-30 at 2:18; 24x+78 at -4: -18 ok
f=x=>(x+2)/(x-1); ok(near(d(f,2),-3)&&near(d(f,0),-3),'hu ti k=-3'); ok(near(f(2),4)&&near(f(0),-2),'y 4,-2')
// -3x+10 at 2:4 ok -> trung d; -3x-2 at 0:-2 ok
// 6.2.3 VD1
f=x=>(2*x+1)/(x-1);for(const a of [2,3,-1,0.5,5]){const k=d(f,a),b=f(a);const A=k*(1-a)+b;const Bx=a+(2-b)/k;ok(near(A,(2*a+4)/(a-1),1e-4)&&near(Bx,2*a-1,1e-4)&&near((1+Bx)/2,a,1e-4),'VD1 a='+a);const S=.5*Math.abs(A-2)*Math.abs(Bx-1);ok(near(S,6,1e-4),'S=6')}
f=x=>(2*x-3)/(x-2);let best=1e9,ba;for(let a=2.0001;a<6;a+=0.0001){const k=d(f,a,1e-7),b=f(a);const A=k*(2-a)+b,Bx=a+(2-b)/k;const ab2=(Bx-2)**2+(A-2)**2;if(ab2<best){best=ab2;ba=a}}
ok(near(best,8,1e-3)&&near(ba,3,1e-3),'VD2 min AB^2=8 a='+ba); ok(near(f(3),3)&&near(f(1),1),'M(3;3),M(1;1)')
{const a=1,k=d(f,a,1e-7),b=f(a);const A=k*(2-a)+b,Bx=a+(2-b)/k;ok(near((Bx-2)**2+(A-2)**2,8,1e-4),'a=1 ->8; A='+A+' B='+Bx)}
// 6.3.1
f=x=>(3*x+2)/(x-1);let m=1e9,mi;for(let a=1.0001;a<8;a+=0.0001){const s=(a-1)+Math.abs(f(a)-3);if(s<m){m=s;mi=a}}ok(near(m,2*Math.sqrt(5),1e-3)&&near(mi,1+Math.sqrt(5),1e-3),'sum d min 2sqrt5');ok(near(f(1+Math.sqrt(5)),3+Math.sqrt(5))&&near(f(1-Math.sqrt(5)),3-Math.sqrt(5)),'M')
m=1e9;const g=x=>x-1+1/(x-1);for(let t=0.0005;t<5;t+=0.0005){const u=t; // x=1+t
 const v=(t)**2+g(1+t)**2;if(v<m){m=v;mi=t}};for(let t=-5;t<-0.0005;t+=0.0005){const v=t**2+g(1+t)**2;if(v<m){m=v;mi=t}}
ok(near(m,2+2*Math.sqrt(2),1e-3),'IM^2 min='+m+' u='+mi+' 2^-1/4='+2**-.25)
// 6.3.2
f=x=>(x+3)/(x-1);ok(near(f(1+2*Math.SQRT2),1+Math.SQRT2)&&near(f(1+Math.SQRT2),1+2*Math.SQRT2),'diem doi xung')
for(const u of [Math.SQRT2,2*Math.SQRT2]){const A=[1+u,f(1+u)],B=[1-u,f(1-u)];ok(near(A[0]+B[0],2)&&near(A[1]+B[1],2)&&near(Math.hypot(A[0]-B[0],A[1]-B[1]),2*Math.sqrt(10)),'AB=2sqrt10 u='+u)}
f=x=>(2*x-1)/(x-1);m=1e9;for(let u=.01;u<4;u+=.01)for(let v=.01;v<4;v+=.01){const A=1+u,B=1-v;const ab=(A-B)**2+(f(A)-f(B))**2;if(ab<m){m=ab;mi=[u,v]}}ok(near(m,8,1e-3),'AB^2 min 8 '+mi);ok(near(f(2),3)&&near(f(0),1),'A(2;3) B(0;1)')
// 6.3.3
f=x=>(2*x+7)/(x-1);const L=[];for(let x=-200;x<=200;x++){if(x==1)continue;const y=f(x);if(Number.isInteger(y))L.push([x,y])}console.log(JSON.stringify(L))
f=x=>(x*x+3*x+6)/(x+2);const L2=[];for(let x=-300;x<=300;x++){if(x==-2)continue;const y=f(x);if(Number.isInteger(y))L2.push([x,y])}console.log(JSON.stringify(L2))
f=x=>(3*x+1)/(2*x-1);const L3=[];for(let x=-300;x<=300;x++){if(x==.5)continue;const y=f(x);if(Number.isInteger(y))L3.push([x,y])}console.log(JSON.stringify(L3))
// 6.4.1
const F=x=>x**3-3*x; const rt=roots(t=>F(t)+1,-3,3);console.log('f(t)=-1 roots',rt);
const c1=roots(x=>F(x*x-2*x)+1,-6,8).length;ok(c1==4,'f(x^2-2x)=-1: '+c1)
console.log('f(f(x))=2', dem(x=>F(F(x))-2,-4,4).length,'f(f)=0',dem(x=>F(F(x)),-4,4).length)
// 6.4.2
const G=x=>x**3-3*x**2+2;
for(const mm of [0,0.5,1,1.9,2,2.1,3,-1]) console.log('|G|=',mm,dem(x=>Math.abs(G(x))-mm,-5,6).length)
const H=x=>x**3-6*x**2+9*x-2; ok(H(1)==2&&H(3)==-2&&H(2)==0,'H')
for(const mm of [-3,-2,-1.5,-1,0,1,2,2.5,3]) console.log('H(|x|)=',mm,dem(x=>H(Math.abs(x))-mm,-8,8).length)
