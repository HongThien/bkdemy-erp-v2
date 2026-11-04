const simp=(f,a,b,n=20000)=>{let h=(b-a)/n,s=f(a)+f(b);for(let i=1;i<n;i++)s+=(i%2?4:2)*f(a+i*h);return s*h/3};
// W0972 d
{const P=s=>[320-4*s,148-1.5*s,45-0.5*s];const r=s=>Math.hypot(...P(s));
let lo=-100,hi=0;for(let i=0;i<100;i++){const m=(lo+hi)/2;(r(m)>400)?lo=m:hi=m}
console.log('W0972 |A|',r(0),'enter s',lo,'z',P(lo)[2]);
lo=0,hi=200;for(let i=0;i<100;i++){const m=(lo+hi)/2;(r(m)<400)?lo=m:hi=m}console.log('exit s',lo,P(lo));}
// W0975
console.log('W0975 dist10',simp(t=>-0.5*t+25,0,10),'v18 kmh',(-0.5*18+25)*3.6);
// W0976
{const r=t=>Math.hypot(-16+4*t,-10+3*t,10-t);console.log('W0976',r(2),r(6));}
// W0987
{const r=t=>Math.hypot(4+2*t,2+t,1-t);console.log('W0987',Math.sqrt(21),Math.sqrt(13.5),r(-1),r(-2),'min',Math.sqrt(6)*10/80*60);}
// W0990
{const r=t=>Math.hypot(4+2*t,4+2*t,-t);console.log('W0990',r(-1),r(-23/9),'min',(14/3)*10/90*60);}
// W0998
{const D=T=>60*((7000+3000*T)/25000)**2;const L=2*simp(D,0,5);const n=1e6/L;console.log('W0998 L',L,'orbits',n,'years',n*10/8760);
// exact within-orbit: dose symmetric; cum within orbit
const full=Math.floor(n);let rem=1e6-full*L;// first half 0..5 uses D(T), second half mirror D(10-T)
let cum=0,t=0,dt=1e-4;const Dm=t=>t<=5?D(t):D(10-t);while(cum<rem){cum+=Dm(t)*dt;t+=dt}
console.log('exact years',(full*10+t)/8760);}
console.log('W0969',Math.PI*simp(x=>x-1,1,5)/Math.PI,'W0974',simp(x=>4*x-x*x,0,4),32/3,'W0988',simp(x=>Math.exp(x)-x,1,2),Math.E**2-Math.E-1.5,'W0997',simp(x=>4-x*x,0,2));
console.log('W0973',simp(x=>(2*x+1)*Math.exp(x)+(x*x+x)*Math.exp(x),0,1),2*Math.E);
