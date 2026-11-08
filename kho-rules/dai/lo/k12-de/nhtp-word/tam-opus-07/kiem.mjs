const S=(f,a,b,n=20000)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=f(a+i*h)*(i%2?4:2);return s*h/3};
const P=Math.PI,r=[];
r.push(['363d',S(x=>3*x*x+x,4,8)-10,462]);
r.push(['371d',S(x=>3*x*x+x,2,8)-9,525]);
r.push(['381',S(x=>Math.sqrt(3)/4*x*x,0,1),Math.sqrt(3)/12]);
r.push(['383',S(x=>Math.abs(Math.sin(x)),-P/2,P/6),2-Math.sqrt(0.75)]);
r.push(['384a',S(x=>Math.abs(4*x**3+x),-2,1),39/2]);
r.push(['384b',4+S(x=>4*x**3+x,1,2),31/2]);
r.push(['384c',S(x=>4*x**3+x,3,5),552]);
r.push(['386',S(x=>x+2,-3,-1)+S(x=>x*x,-1,3),28/3]);
r.push(['387',S(x=>x,-1,2)+6+3,10.5]);
r.push(['389',S(x=>Math.abs(x**3-6*x-x*x),-2,3,200000),253/12]);
r.push(['394',P*S(x=>2+Math.sin(x),0,P),2*P*(P+1)]);
r.push(['396',S(x=>Math.sqrt(3)/4*x*x*(3-x),0,3),27*Math.sqrt(3)/16]);
r.push(['398',S(x=>3/Math.sin(x)**2,P/4,2*P/3),3+Math.sqrt(3)]);
r.push(['402c',P*S(x=>x**4,0,1),P/5]);
r.push(['405b',S(x=>2*Math.exp(x),0,2),2*(Math.E**2-1)]);
r.push(['405d',P*S(x=>4*Math.exp(2*x),0,1),P*(2*Math.E**2-2)]);
r.push(['408',S(x=>Math.abs(x**3-x-(x-x*x)),-2,1,200000),37/12]);
r.push(['412',S(x=>1/x/x-3/x+2,0.5,1),2-3*Math.log(2)]);
r.push(['416',P*S(x=>x,0,1),P/2]);
// 392d
{const G1=x=>x*x/2+5*x-6*Math.log(x)-1.5, C2=5-G1(2)-(0.5-5);const G2=x=>x*x/2+5*x-6*Math.log(-x)+C2;r.push(['392d',G2(-6),-13-6*Math.log(3)]);}
// 391, 388, 393 kiem F(x0)
r.push(['388',Math.exp(0)-2*Math.exp(0)+2,1]);
r.push(['391',-2*Math.cos(P/3)-Math.sin(P/3)+1,-Math.sqrt(3)/2]);
for(const [k,a,b] of r)console.log(k,a.toFixed(6),b.toFixed(6),Math.abs(a-b)<1e-4?'OK':'LECH');
