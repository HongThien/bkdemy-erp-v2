const P=(t,...v)=>console.log(t.padEnd(46),...v.map(x=>typeof x==='number'?+x.toPrecision(7):x))
const lim=(f,a)=>[f(a+1e-7),f(a+1e-9)]
const inf=f=>[f(1e7),f(-1e7)]
// H4.1.1
let f=x=>(2*x-1)/(x+3); P('411v1 3+ / 3- / ±inf',f(-3+1e-8),f(-3-1e-8),...inf(f))
f=x=>(1-3*x)/(2*x+4); P('411v2a -2± / inf',f(-2+1e-8),f(-2-1e-8),...inf(f))
f=x=>(-2*x+5)/(3-x); P('411v2b 3± / inf',f(3+1e-8),f(3-1e-8),...inf(f))
// H4.1.2
f=x=>(x*x-3*x+2)/(x*x-1); P('412v1 at1, -1±, inf',f(1+1e-7),f(-1+1e-8),f(-1-1e-8),...inf(f))
f=x=>(x*x-4)/(x**3-x*x-4*x+4); P('412v2a at2,-2,1±,inf',f(2+1e-7),f(-2+1e-7),f(1+1e-8),f(1-1e-8),...inf(f))
f=x=>(x+1)/(x**3-3*x+2); P('412v2b 1±,-2±,inf',f(1+1e-5),f(1-1e-5),f(-2+1e-8),f(-2-1e-8),...inf(f))
// roots of denominators
for(const [n,q] of [['x^3-x^2-4x+4',x=>x**3-x*x-4*x+4],['x^3-3x+2',x=>x**3-3*x+2]]){const r=[];for(let x=-10;x<=10;x+=0.001){const a=q(x),b=q(x+0.001);if(a===0||a*b<0||Math.abs(a)<1e-9)r.push(+x.toFixed(2))}P('  nghiem '+n,[...new Set(r)].join(','))}
// H4.1.3
f=x=>(3*x+1)/Math.sqrt(x*x+2); P('413v1 ±inf',...inf(f))
f=x=>Math.sqrt(x*x+3*x)-x; P('413v2a +inf,-inf, D at -3,0',f(1e7),f(-1e7),f(-3),f(0),f(-1))
f=x=>(Math.abs(x)+1)/(x-1); P('413v2b 1±, ±inf, f(-5)',f(1+1e-8),f(1-1e-8),...inf(f),f(-5))
// H4.2.1
f=x=>(2*x*x+3*x-1)/(x-1); P('421v1 f-(2x+5) ±inf',f(1e6)-(2e6+5),f(-1e6)-(-2e6+5))
f=x=>(x*x+x-3)/(2*x-4); for(const s of [1e6,-1e6]){const a=f(s)/s,b=f(s)-0.5*s;P('421v2 a,b',a,b)}
// H4.2.2
f=x=>x-2+(2*x-1)/(x*x+1); P('422v2a f-(x-2)',f(1e6)-(1e6-2),f(-1e6)-(-1e6-2))
f=x=>2*x+1+(x+3)/(x-1); P('422v2b f-(2x+2)',f(1e6)-(2e6+2),f(-1e6)-(-2e6+2))
f=x=>2*x-1+3/(x-2); P('422v1 f-(2x-1)',f(1e6)-(2e6-1))
// H4.2.3
for(const [n,g] of [['423v1',x=>Math.sqrt(x*x+4*x)],['423v2',x=>Math.sqrt(x*x-2*x)+2*x]]) for(const s of [1e7,-1e7]){const a=g(s)/s;const ar=Math.round(a*1e4)/1e4;P(n+' s='+s+' a,b',a,g(s)-ar*s)}
// H4.3.1 points
f=x=>(2*x-1)/(x-1); P('431v1 f(0),f(2),f(3), 1±, ±inf',f(0),f(2),f(3),f(1+1e-8),f(1-1e-8),...inf(f))
f=x=>(x*x-x-1)/(x-1); P('431v2 f-x ±inf, 1±',f(1e6)-1e6,f(-1e6)+1e6,f(1+1e-8),f(1-1e-8))
