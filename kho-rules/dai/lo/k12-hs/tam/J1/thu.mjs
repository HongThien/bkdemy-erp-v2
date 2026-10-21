// kiểm số các ví dụ J1
const d=(f,x,h=1e-6)=>(f(x+h)-f(x-h))/(2*h)
// tìm các khoảng dấu của hàm s trên lưới
function dau(s,a,b,n=20000){const out=[];let cur=null,st=a;for(let i=0;i<=n;i++){const x=a+(b-a)*i/n;const v=s(x);if(!isFinite(v)||Math.abs(v)<1e-9)continue;const sg=v>0?'+':'-';if(sg!==cur){if(cur)out.push([cur,+st.toFixed(3),+x.toFixed(3)]);cur=sg;st=x}}out.push([cur,+st.toFixed(3),b]);return out}
const log=(t,v)=>console.log(t,JSON.stringify(v))
// H1.1.1
log('1.1.1a',dau(x=>d(x=>x**3-3*x*x-9*x+5,x),-6,6))
log('1.1.1b',dau(x=>d(x=>(x*x-3*x+3)/(x-1),x),-4,5))
// H1.1.2
log('1.1.2a',dau(x=>d(x=>Math.sqrt(x*x-2*x-3),x),-6,-1.0001).concat(dau(x=>d(x=>Math.sqrt(x*x-2*x-3),x),3.0001,8)))
log('1.1.2b',dau(x=>d(x=>Math.abs(x*x-4*x+3),x),-3,7))
log('1.1.2 d x-sinx min y\'',Math.min(...Array.from({length:10000},(_,i)=>1-Math.cos(i*0.01))))
// H1.2.2 + 1.2.1 đọc hình
log('1.2.2a',dau(x=>d(x=>x**3-3*x*x+2,x),-2,4))
log('1.2.2b',dau(x=>d(x=>2*x*x-x**4,x),-2,2))
const f2=x=>(2*x+1)/(x-1);log('1.2.1 f(-3),f(3)',[f2(-3),f2(3)])
// H1.3
log('1.3.1b f\'=(x+1)^2(x-2)',dau(x=>(x+1)**2*(x-2),-3,3))
log('1.3.2a',dau(x=>(x+1)*(x-2)*(x-3),-4,5))
log('1.3.2b',dau(x=>x*(x-1)**2*(x+2)**3,-4,4))
// H1.4.1
const fp1=t=>(t+1)*(t-3)
log('1.4.1a g\'',dau(x=>-2*fp1(1-2*x),-4,4))
const fp2=t=>(t+1)*(t-2)
log('1.4.1b g\'',dau(x=>2*x*fp2(x*x-2),-4,4))
// H1.4.2
log('1.4.2a g\'=f\'-x',dau(x=>(x*x-2)-x,-4,4))
// f(x)=x^3/3-2x ; g=f-x^2/2
const g2=x=>{const f=t=>t**3/3-2*t;return f(2*x-1)-2*x*x}
log('1.4.2b g\' (f\'=-t^2+3t+1)',dau(x=>{const f=t=>-(t**3)/3+1.5*t*t+t;return d(x=>f(2*x-1)-2*x*x,x)},-3,4))
// H1.5.1
function tapm(ok,a,b,st=0.001){const r=[];let s=null;for(let m=a;m<=b+1e-12;m+=st){const o=ok(+m.toFixed(6));if(o&&s===null)s=m;if(!o&&s!==null){r.push([+s.toFixed(3),+(m-st).toFixed(3)]);s=null}}if(s!==null)r.push([+s.toFixed(3),b]);return r}
const xs=Array.from({length:4001},(_,i)=>-20+i*0.01)
log('1.5.1a',tapm(m=>xs.every(x=>x*x+2*m*x+m+6>=-1e-9),-10,10))
log('1.5.1b',tapm(m=>xs.every(x=>3*(m*m-1)*x*x+2*(m-1)*x-1<=1e-9),-3,3))
// 1.5.2
log('1.5.2a',tapm(m=>m*m-4>0,-6,6))
log('1.5.2b',tapm(m=>(m+2)*(m-1)<0,-6,6))
// 1.5.3a: y=(x+3)/(x+m) tăng trên (-inf;-4): lấy mẫu x in [-200,-4.001]
const X1=Array.from({length:3000},(_,i)=>-200+i*(195.99/2999))
log('1.5.3a',tapm(m=>X1.every(x=>Math.abs(x+m)>1e-9&&(m-3)/((x+m)**2)>=0)&&X1.some(x=>(m-3)/(x+m)**2>0),-8,8,0.01))
const X2=Array.from({length:999},(_,i)=>(i+1)/1000)
log('1.5.3b',tapm(m=>X2.every(x=>3*x*x+6*x-m<=1e-9),-5,20,0.01))
// 1.5.4
const X3=xs.filter(x=>Math.abs(x-1)>1e-9)
log('1.5.4a',tapm(m=>X3.every(x=>x*x-2*x+2-m>=-1e-9),-6,6))
const X4=Array.from({length:4000},(_,i)=>-100+i*0.0249)  // < 1
log('1.5.4b',tapm(m=>X4.filter(x=>x<1).every(x=>x*x-4*x+6-m>=-1e-9),-6,8,0.01))
// 1.5.5a: y=(cos x-2)/(cos x-m) nghịch biến trên (0,pi/3)
const Xc=Array.from({length:600},(_,i)=>(i+0.5)/600*Math.PI/3)
const y5=(m)=>x=>(Math.cos(x)-2)/(Math.cos(x)-m)
log('1.5.5a',tapm(m=>Xc.every(x=>Math.abs(Math.cos(x)-m)>1e-6)&&Xc.every(x=>d(y5(m),x,1e-7)<=1e-6)&&Xc.some(x=>d(y5(m),x,1e-7)<-1e-6),-3,4,0.01))
const Xl=Array.from({length:600},(_,i)=>1+(Math.E**2-1)*(i+0.5)/600)
const y5b=m=>x=>(Math.log(x)-4)/(Math.log(x)-2*m)
log('1.5.5b',tapm(m=>Xl.every(x=>Math.abs(Math.log(x)-2*m)>1e-6)&&Xl.every(x=>d(y5b(m),x,1e-7)>=-1e-6)&&Xl.some(x=>d(y5b(m),x,1e-7)>1e-6),-3,4,0.01))
// 1.5.6a: f'=(t+3)(t-1); g'=f'(x+m) <=0 on (0,2)
const X5=Array.from({length:399},(_,i)=>(i+1)/200)
log('1.5.6a',tapm(m=>X5.every(x=>(x+m+3)*(x+m-1)<=1e-9),-8,5))
// 1.5.6b g'=(2x-2) f'(x²-2x+m), f'=(t+2)(t-1) >=0 on (0,1)
const X6=Array.from({length:999},(_,i)=>(i+1)/1000)
log('1.5.6b',tapm(m=>X6.every(x=>{const u=x*x-2*x+m;return (2*x-2)*(u+2)*(u-1)>=-1e-9}),-6,6))
