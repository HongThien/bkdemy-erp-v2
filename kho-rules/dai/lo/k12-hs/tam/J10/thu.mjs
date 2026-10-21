const ok=(n,c,extra='')=>console.log((c?'OK  ':'FAIL')+' '+n+' '+extra)
const near=(a,b,e=1e-6)=>Math.abs(a-b)<e
function argmax(f,a,b,n=200000){let bx=a,by=-1e18;for(let i=0;i<=n;i++){const x=a+(b-a)*i/n,y=f(x);if(y>by){by=y;bx=x}}return [bx,by]}
function argmin(f,a,b,n=200000){const [x,y]=argmax(x=>-f(x),a,b,n);return [x,-y]}
const d=(f,x,h=1e-5)=>(f(x+h)-f(x-h))/(2*h)
// 4.1.1
let R=x=>(200-10*x)*(100+10*x); let [x,y]=argmax(R,0,20); ok('4.1.1a',near(x,5,1e-3)&&near(y,22500,1e-3),[x,y])
let L=x=>(50-2*x)*(2000+100*x-100); let best=-1,bx;for(let k=0;k<=25;k++){if(L(k)>best){best=L(k);bx=k}} ok('4.1.1b',bx==3&&best==96800,[bx,best])
// 4.2
let L1=x=>-0.02*x*x+40*x-4000; [x,y]=argmax(L1,0,2000); ok('4.2a',near(x,1000,1e-2)&&near(y,16000,1e-3),[x,y])
let L2=x=>-0.02*x*x+35*x-4000; [x,y]=argmax(L2,0,800); ok('4.2b',near(x,800,1e-2)&&near(y,11200,1e-3),[x,y])
// 4.3
let c1=x=>x+10+2500/x; [x,y]=argmin(c1,0.01,1000); ok('4.3a',near(x,50,1e-2)&&near(y,110,1e-3),[x,y])
let c2=x=>x*x-12*x+60+486/x; [x,y]=argmin(c2,0.01,100); ok('4.3b',near(x,9,1e-2)&&near(y,87,1e-3),[x,y], c2(9))
// 4.4
let m1=n=>200*n+192*8000/(30*n); best=1e18;for(let n=1;n<=200;n++)if(m1(n)<best){best=m1(n);bx=n} ok('4.4a',bx==16&&near(best,6400),[bx,best])
let m2=n=>200*n+11250/n; best=1e18;for(let n=1;n<=100;n++)if(m2(n)<best){best=m2(n);bx=n} ok('4.4b',bx==8,[bx,best,m2(7),m2(8)]); ok('4.4b cont',near(Math.sqrt(11250/200),7.5))
// 5.1
let s=t=>t**3-6*t*t+9*t+2; ok('5.1a',near(d(s,4),9,1e-4)&&near(d(x=>d(s,x,1e-3),4,1e-3),12,1e-2)&&near(d(s,2),-3,1e-4))
// 5.1 a(t) at t=0: v(0)=9
let s2=t=>2*t**3-15*t*t+36*t; ok('5.1b',s2(2)==28&&s2(3)==27&&s2(4)==32&&near(d(s2,2),0,1e-4)&&near(d(s2,3),0,1e-4))
// 5.2
let v1=t=>d(x=>-(x**3)+9*x*x+5*x,t); [x,y]=argmax(v1,0,8,2000); ok('5.2a',near(x,3,1e-2)&&near(y,32,1e-3),[x,y])
let S3=t=>-(t**4)/4+2*t**3+t; let v3=t=>d(S3,t,1e-3), a3=t=>d(v3,t,1e-3); [x,y]=argmax(v3,0,6,2000); let [xa,ya]=argmax(a3,0,6,2000); ok('5.2b',near(x,4,1e-2)&&near(y,33,1e-2)&&near(xa,2,1e-2)&&near(ya,12,1e-2),[x,y,xa,ya])
// 6.1
let f=t=>(30*t+20)/(t+4); ok('6.1a',near(d(f,6),1,1e-6)&&near(d(f,16),0.25,1e-6),[d(f,6),d(f,16)])
let C=x=>0.01*x*x+20*x+1500; ok('6.1b',near(C(101)-C(100),22.01,1e-9)&&near(d(C,100),22,1e-6))
// 6.2
let g=t=>1200/(1+Math.exp(4-t)); [x,y]=argmax(t=>d(g,t),0,12,12000); ok('6.2a',near(x,4,1e-2)&&near(y,300,1e-3)&&near(g(4),600),[x,y])
let h=t=>45*t*t-(t**3); [x,y]=argmax(t=>d(h,t),0,25,25000); ok('6.2b',near(x,15,1e-2)&&near(y,675,1e-2),[x,y])
// 7.1 thang
{ const x0=6,v=0.5; const X=t=>x0+v*t, Y=t=>Math.sqrt(100-X(t)**2); const dy=(Y(1e-6)-Y(-1e-6))/2e-6; ok('7.1a',near(dy,-0.375,1e-5)&&near(Y(0),8),dy)}
{ // radar d^2 = x^2+36 ; d=10 -> x=8, d'=480 -> x'=600
  const xp=600, X=t=>8+xp*t, D=t=>Math.sqrt(X(t)**2+36); const dd=(D(1e-7)-D(-1e-7))/2e-7; ok('7.1b',near(D(0),10)&&near(dd,480,1e-3),dd)}
// 7.2 nón: r=h/2, V=pi h^3/12, Q=2, h=4
{ const Q=2; const h0=4; const hp=Q/(Math.PI*h0*h0/4); // simulate: V(t)=V0+Q t
 const V=h=>Math.PI*h**3/12; const V0=V(h0); const H=t=>Math.cbrt(12*(V0+Q*t)/Math.PI); const dh=(H(1e-6)-H(-1e-6))/2e-6; ok('7.2a',near(dh,hp,1e-5)&&near(hp,1/(2*Math.PI),1e-12),[dh,hp]) }
{ const R=6,h0=3,Q=18; const V=h=>Math.PI*h*h*(3*R-h)/3; const V0=V(h0); // invert numerically
 const H=t=>{let lo=0,hi=2*R;for(let i=0;i<200;i++){const m=(lo+hi)/2; if(V(m)<V0+Q*t)lo=m;else hi=m}return lo}; const dh=(H(1e-5)-H(-1e-5))/2e-5; ok('7.2b',near(dh,2/(3*Math.PI),1e-5),[dh,2/(3*Math.PI)]); ok('7.2b V', near(V(3), 3*3*(18-3)*Math.PI/3)) }
// 8.1
let N=t=>8000*t/(t+10); ok('8.1a',near(N(40),6400)&&N(1e9)<8000&&near(N(1e9),8000,1e-1))
let P=t=>(40*t*t+30)/(2*t*t+5); ok('8.1b',near(P(Math.sqrt(15)),18)&&near(P(1e6),20,1e-3)&&near(P(0),6))
// 8.2
let Cn=t=>(10000+750*t)/(500+25*t); ok('8.2a',near(Cn(1e9),30,1e-4)&&near(Cn(0),20)&&near(Cn(10),30-200/30)&&Cn(1e5)<30)
let Cb=x=>(2*x*x+10*x+300)/x; ok('8.2b',near(Cb(1e7)-(2*1e7+10),0,1e-3))
// 8.3
let K=p=>1.5*p/(100-p); ok('8.3a',near(K(50),1.5)&&near(K(90),13.5)&&near(K(99),148.5)&&near(K(80),6)&&K(99.9999)>1e5)
let K2=p=>8*p/(100-p); ok('8.3b',near(K2(90),72)&&near(K2(95),152)&&near(d(K2,90),8,1e-3)&&near(d(K2,95),32,1e-2),[K2(95)-K2(90)])
