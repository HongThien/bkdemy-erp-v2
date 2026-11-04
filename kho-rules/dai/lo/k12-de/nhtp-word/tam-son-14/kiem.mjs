const simp=(f,a,b,n=20000)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=f(a+i*h)*(i%2?4:2);return s*h/3};
// W0781
const f1=x=>x>=1?3*x*x-2*x-4:1-4*x;
console.log('c',simp(f1,-1,5),'d',simp(t=>f1(t),0,2));
// W0788
const f=x=>x*x-3*x+2;
console.log('a',simp(f,0,1),5/6,'c',simp(x=>f(x)**2,1,2),1/30,'d',simp(x=>Math.abs(f(x)-(-x+2)),1,4),22/3);
// W0792
console.log(simp(x=>1/x-1/x/x,1,Math.E),1/Math.E, simp(x=>(x*x+x+1)/x,3,5),10+Math.log(5/3));
// W0797
let s=0;for(let k=1;k<=100;k++)s+=2/((k+1)**2);console.log('sum',s);
// W0805
const g=x=>(x*x+5*x-7)/x;
console.log(simp(g,-2,-1),3.5+7*Math.log(2));
const G6=-5.5-7*Math.log(2)+14*Math.log(3);
// check G constraints
const C1=-1.5,C2=6.5+21*Math.log(3);
const Gp=x=>x*x/2+5*x-7*Math.log(x)+C1, Gn=x=>x*x/2+5*x-7*Math.log(-x)+C2;
console.log(Gp(1),Gp(3)+Gn(-9),Gn(-6),G6,'abc sum',-7+14-5.5);
// W0829
const ff=x=>Math.abs(x*x+2*x);
console.log(simp(ff,0,2),20/3);
for(const m of [1,2,3]) console.log('m',m,simp(ff,-1,m));
// roots of int_{-1}^m f=2 positive: scan
let prev=null;for(let m=0.001;m<5;m+=0.001){const v=simp(ff,-1,m,2000)-2;if(prev!==null&&prev*v<0)console.log('root~',m);prev=v}
// balloons
for(const [A,v] of [[[-16,-10,10],[4,3,-1]],[[-12,-7,9],[8,6,-2]]]){const ts=[];let inside=false,t0=null;for(let t=0;t<=10;t+=0.0005){const d=Math.hypot(A[0]+v[0]*t,A[1]+v[1]*t,A[2]+v[2]*t);if(d<=12&&!inside){inside=true;t0=t}if(d>12&&inside){inside=false;ts.push([t0,t])}}console.log(ts.map(([a,b])=>[a,b,(b-a)*60]))}
// GPS geometric median
const P=[[2,4,0],[0,4,6],[2,0,6],[-1,-2,-3]];
let M=[0,0,0];for(let it=0;it<200000;it++){let w=0,x=[0,0,0];for(const p of P){const d=Math.max(1e-12,Math.hypot(p[0]-M[0],p[1]-M[1],p[2]-M[2]));w+=1/d;for(let i=0;i<3;i++)x[i]+=p[i]/d}M=x.map(z=>z/w)}
console.log('M',M,'MO',Math.hypot(...M),'a2-b2+c2',M[0]**2-M[1]**2+M[2]**2);
// also check cost vs candidate intersections
const cost=M=>P.reduce((s,p)=>s+Math.hypot(p[0]-M[0],p[1]-M[1],p[2]-M[2]),0);console.log(cost(M));
// area 1/6
console.log(simp(x=>x-x*x,0,1));
// W0794
console.log(Math.PI*(simp(x=>(x+1/x)**2,1,4)-simp(x=>x*x,1,4)));
// W0787
console.log(0.5/16+(-1/8)/3-2/4+1);
