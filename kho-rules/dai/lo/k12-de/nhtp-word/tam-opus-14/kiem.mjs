const simp=(f,a,b,n=20000)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=f(a+i*h)*(i%2?4:2);return s*h/3};
// W0781
const f1=x=>x>=1?3*x*x-2*x-4:1-4*x;
console.log('W0781 c',simp(f1,-1,1)+simp(f1,1,5),'d',simp(t=>f1(t),0,1)+simp(f1,1,2));
// W0788
const g=x=>x*x-3*x+2;
console.log('W0788 a',simp(g,0,1),'c',Math.PI*simp(x=>g(x)**2,1,2)/Math.PI,1/30,'d',simp(x=>Math.abs(x*x-2*x),1,4),22/3);
// W0787
const F=x=>x**4/2+x**3/3-2*x*x-2*x; console.log('W0787',F(-1),F(-0.5));
// W0794
console.log('W0794',Math.PI*(simp(x=>(x+1/x)**2,1,4)-simp(x=>x*x,1,4)));
// W0792
console.log('W0792 b',simp(x=>1/x-1/x/x,1,Math.E),1/Math.E,'c',simp(x=>(x*x+x+1)/x,3,5),10+Math.log(5/3));
// W0797
console.log('W0797 b',simp(x=>(x-1)*(x+1),0,1));
// W0802/803
for(const [A,v] of [[[-16,-10,10],[4,3,-1]],[[-12,-7,9],[8,6,-2]]]){let ins=0;const dt=1e-5;for(let t=0;t<=10;t+=dt){const p=A.map((a,i)=>a+v[i]*t);if(Math.hypot(...p)<=12)ins+=dt}console.log('khinh khi cau phut',ins*60)}
// W0805
const ff=x=>x+5-7/x;console.log('W0805 c',simp(ff,-2,-1),3.5+7*Math.log(2));
{const C1=4-simp(ff,0.000001,1)*0; }
const G=(x,C)=>x*x/2+5*x-7*Math.log(Math.abs(x))+C;const C1=4-G(1,0);const C2=20-G(3,C1)-G(-9,0);console.log('W0805 d',G(-6,C2),-5.5-7*Math.log(2)+14*Math.log(3));
// W0829
const h=x=>Math.abs(x*x+2*x);console.log('W0829 c',simp(h,0,2),'d m=1',simp(h,-1,0)+simp(h,0,1));
// W0837/839
console.log(simp(x=>Math.abs(x*x-x),0,1));
// W0815
const P=[[2,4,0],[0,4,6],[2,0,6],[-1,-2,-3]];let M=[0.75,1.5,2.25];
for(let it=0;it<200000;it++){let num=[0,0,0],den=0;for(const p of P){const d=Math.hypot(...p.map((c,i)=>c-M[i]));if(d<1e-12)continue;den+=1/d;for(let i=0;i<3;i++)num[i]+=p[i]/d}M=num.map(c=>c/den)}
const S=m=>P.reduce((s,p)=>s+Math.hypot(...p.map((c,i)=>c-m[i])),0);
console.log('M',M,'sum',S(M),'MO',Math.hypot(...M),'a2-b2+c2',M[0]**2-M[1]**2+M[2]**2);
for(const p of P)console.log('at vertex',S(p));
