const ok=(c,m)=>console.log(c?'OK ':'XX ',m); const near=(a,b,e=1e-3)=>Math.abs(a-b)<e
let f=x=>(2*x+2)/(x-1),m=1e9,s=1e9,mi;
for(let x=-30;x<30;x+=0.0005){if(Math.abs(x-1)<1e-3)continue;const v=Math.hypot(x-1,f(x)-2);if(v<m){m=v;mi=x}; const t=Math.abs(x-1)+Math.abs(f(x)-2); if(t<s)s=t}
ok(near(m,2*Math.SQRT2)&&(near(mi,3)||near(mi,-1)),'IM min '+m+' at '+mi+' ; sum '+s); ok(near(f(3),4)&&near(f(-1),0),'M')
f=x=>(x*x-x+2)/(x-1);m=1e9;for(let x=-30;x<30;x+=0.0005){if(Math.abs(x-1)<1e-3)continue;const v=Math.abs(x+f(x)-2)/Math.SQRT2;if(v<m){m=v;mi=x}}
ok(near(m,2*Math.SQRT2),'d to line '+m+' at '+mi); ok(near(f(2),4)&&near(f(0),-2),'pts')
// f(f(x))=0 with F=x^3-3x^2: distinct roots
const F=x=>x**3-3*x**2; const set=[];for(let x=-5;x<=5;x+=1e-5){const v=F(F(x));if(Math.abs(v)<1e-6&&!set.some(q=>Math.abs(q-x)<.05))set.push(+x.toFixed(3))}
console.log('f(f)=0 near-zero clusters',set); ok(F(0)==0&&F(3)==0&&F(2)==-4,'F'); 
let c=0;for(let x=-5;x<5;x+=1e-4){if(F(x)-3<0&&F(x+1e-4)-3>=0)c++}ok(c==1,'f=3 one root')
// d(1+u form) check points on curve (x+3)/(x-1) for AB 2 sqrt10
