const min=(f,a,b,n=2000000)=>{let m=[Infinity,0],M=[-Infinity,0];for(let i=0;i<=n;i++){const x=a+(b-a)*i/n,y=f(x);if(y<m[0])m=[y,x];if(y>M[0])M=[y,x]}return {min:m,max:M}}
const p=(n,v)=>console.log(n,JSON.stringify(v))
p('711a',min(x=>-(x**3)+9*x*x,0,10))
let b=-1e9,bx;for(let x=1;x<=6;x++){const v=-(x**3)+7*x*x;if(v>b){b=v;bx=x}};p('711b',[bx,b])
// 712a
{const a=-1,B=8,c=10;p('712a',[c,B,a*16+4*B+c, 2*a*4+B])}
{const a=30,b=9,C=t=>a*t/(t*t+b);p('712b',[min(C,0,200),C(6),C(3)])}
const V=t=>t**3-12*t*t+36*t+50;p('713a',[V(0),V(2),V(6),V(10),min(V,0,10)])
const K=t=>t**3-3*t*t-9*t+40;p('713b',[K(0),K(3),K(6),min(K,0,6)])
p('721a',min(x=>x*(12-2*x)**2,0,6))
p('721b',min(x=>300*x*x+129600/x,0.5,50))
p('722a',min(x=>x*(100-2*x),0,50))
p('722b',min(x=>2*x*Math.sqrt(25-x*x),0,5))
p('723a',min(x=>(x*x+(60-x)**2)/16,0,60))
p('723b',[min(x=>x*x/16+(60-x)**2/(4*Math.PI),0,60),240/(4+Math.PI),900/(4+Math.PI)])
p('724a',[min(x=>2*x*(4-x*x/4),0,4),64*Math.sqrt(3)/9,4/Math.sqrt(3)])
{const f=x=>-(x**3)+6*x*x;p('724b',[f(6),f(2),min(x=>0.5*(6-x)*f(x),0,6),f(3)])}
p('731a',[min(x=>Math.sqrt(9+x*x)/3+(8-x)/5,0,8)])
p('731b',[min(x=>5*Math.sqrt(4+x*x)+4*(10-x),0,10),8/3])
p('732a',[min(x=>x*x+(x*x-3)**2,-5,5),Math.sqrt(11)/2,Math.sqrt(2.5)])
p('732b',[min(t=>(20-10*t)**2+(5*t)**2,0,50)])
p('733a',[min(t=>3/Math.sin(t)+3/Math.cos(t),0.001,Math.PI/2-0.001),6*Math.SQRT2])
{const r=min(t=>27/Math.sin(t)+64/Math.cos(t),0.001,Math.PI/2-0.001);p('733b',[r.min,Math.tan(r.min[1])])}
p('734a',min(x=>Math.atan(4/x)-Math.atan(1/x),0.001,100),)
p('734a2',[Math.tan(Math.atan(4/2)-Math.atan(1/2)),Math.atan(.75)*180/Math.PI])
p('734b',[min(x=>Math.atan(9/x)-Math.atan(4/x),0.001,200),Math.atan(5/12)*180/Math.PI])
