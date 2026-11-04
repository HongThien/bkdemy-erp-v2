const simp=(f,a,b,n=20000)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=f(a+i*h)*(i%2?4:2);return s*h/3;};
for(const C of [-2,0,2]){console.log('C',C,Math.PI*simp(x=>(x*x+3*x+C)**2,1,3)/Math.PI,'vs',2576/15)}
// W0876
const v=t=>100+20*t-t*t;
let mx=-1e9,mx2=-1e9;for(let t=0;t<=25;t+=0.01){const w=650+simp(v,0,t,200);mx=Math.max(mx,w);const w2=650+simp(u=>v(u)-150,0,t,200);mx2=Math.max(mx2,w2);}
console.log('no outflow max',mx,'with outflow max',mx2);
// W0850 c area
console.log(simp(x=>Math.abs(2*x+3),-2,1,200000));
// W0880
console.log(Math.sqrt(6)*10/80*60);
// W0856 Q3 W0872
console.log(simp(x=>5*x+7,4,7),207/2);
console.log(simp(x=>Math.exp(x)-x,1,2)-(Math.exp(2)-Math.E-1.5));
