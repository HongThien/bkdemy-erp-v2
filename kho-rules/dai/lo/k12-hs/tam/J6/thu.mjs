const d=(f,x,h=1e-6)=>(f(x+h)-f(x-h))/(2*h)
const lim=(f,x0)=>[f(x0-1e-7),f(x0+1e-7)]
const ok=(c,m)=>console.log(c?'OK ':'BAD',m)
// H4.4.1 vd1: y=(2x+1)/(x^2-2x+m): đúng 3 TC <=> m<1, m!=-5/4
const dem1=(m)=>{const D=1-m;let n=1; if(D>0){const r=[1-Math.sqrt(D),1+Math.sqrt(D)];n+=r.filter(x=>Math.abs(2*x+1)>1e-9).length}else if(D===0){n+=(Math.abs(2+1)>0)?1:0}return n}
for(let m=-10;m<=2;m+=0.25){const e=dem1(m)===3, p=(m<1&&m!==-1.25);ok(e===p,'vd1 m='+m)}
ok(dem1(-1.25)===2,'m=-5/4 ->2')
// vd2: y=(2x-1)/(x^2-2mx+3m-2)
const dem2=(m)=>{const D=m*m-3*m+2;const tu=x=>2*x-1;let n=1;const sq=Math.sqrt(Math.max(D,0));
 if(Math.abs(D)<1e-12){n+=Math.abs(tu(m))>1e-9?1:0}else if(D>0){n+=[m-sq,m+sq].filter(x=>Math.abs(tu(x))>1e-9).length}return n}
const sol=[];for(let k=-4000;k<=4000;k++){const m=k/1000;if(dem2(m)===2)sol.push(m)};console.log('vd2 m with 2:',sol)
// H4.4.2 vd1
{const a=4,b=-2;const f=x=>(a*x-1)/(b*x+2);console.log(lim(f,1),f(1e8),f(-1e8))}
// vd2 y=(2x^2+x+2)/(x+1)
{const f=x=>(2*x*x+1*x+2)/(x+1);console.log(f(1e6)-(2*1e6-1),f(-1e6)-(-2e6-1))}
// H4.5.2
{const f=x=>(3*x-2)/(x+1);for(const x of [0.5,2,5,-3]){console.log(Math.abs(x+1)*Math.abs(f(x)-3))} const g=x=>(2*x+1)/(x-1);let mn=1e9,ax=0;for(let x=1.0001;x<10;x+=0.0001){const s=(x-1)+Math.abs(g(x)-2);if(s<mn){mn=s;ax=x}}console.log(mn,2*Math.sqrt(3),ax,1+Math.sqrt(3),g(1+Math.sqrt(3)),2+Math.sqrt(3))}
// H4.5.3 vd2: slope; tam giac (m+1)^2/2=8
// H4.5.4
{const f=x=>(2*x*x+3*x+4)/(x+1);console.log(f(1e6)-(2e6+1))}
// H5.1.1
{const f=x=>x**3-3*x*x+2;console.log(d(f,0),d(f,2),f(0),f(2),f(1),f(1+Math.sqrt(3)))
 const g=x=>-(x**3)+3*x*x-3*x+2;console.log(g(1),d(g,1),g(0),g(2),1-(0.5-1)**3,g(.5))}
// H5.1.2
{const f=x=>(2*x-1)/(x+1);console.log(f(.5),f(0),f(1e8));const g=x=>(-x+3)/(2*x-2);console.log(g(3),g(0),g(1e8),d(g,2))}
// H5.1.3
{const f=x=>(x*x-x+1)/(x-1);console.log(d(f,0),d(f,2),f(0),f(2),f(3)-3-.5)
 const g=x=>(-x*x+2*x-2)/(x-1);console.log(d(g,0),d(g,2),g(0),g(2),d(g,-1),d(g,.5),d(g,1.5),d(g,3))}
// H5.2
{const f=x=>x**3-3*x+1;console.log(f(-1),f(1),f(0),d(f,1))
 const g=x=>-(x**3)+3*x*x-3*x+3;console.log(g(0),g(1),g(2),d(g,1))
 const h=x=>(2*x-1)/(x+1);console.log(h(0),h(.5))
 const k=x=>(-x+1)/(x-2);console.log(k(0),k(1),k(1e8),d(k,3))
 const p=x=>(x*x-x+1)/(x-1);console.log(p(0),p(2))
 const q=x=>(x*x-x-1)/(x-1);console.log(q(0),d(q,3),d(q,-2),d(q,.5))}
