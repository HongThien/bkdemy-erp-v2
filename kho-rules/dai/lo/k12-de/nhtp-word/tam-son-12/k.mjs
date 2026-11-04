const simp=(f,a,b,n=20000)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=f(a+i*h)*(i%2?4:2);return s*h/3;};
console.log('670',simp(x=>3*x*x,0,1)+simp(x=>4-x,1,2));
console.log('680d',simp(x=>{const f=2*x+5*Math.cos(x)+5;return (2-5*Math.sin(x))/(f*f)},0,Math.PI/2));
console.log('685a f(pi)',Math.PI+10, 'S',simp(x=>Math.abs(x-2),0,2));
console.log('694 disp',simp(t=>t*t-7*t+6,1,7));
let best=-1e9,bt=0;for(let t=0;t<=8;t+=0.001){const x=t**3/3-3.5*t*t+6*t;if(x>best){best=x;bt=t}}console.log('694d',bt,best);
console.log('699',simp(x=>Math.abs(3*x*x+2*x-1),-1,1/3));
console.log('700 a',(200-120)/72*0, 'a=',(200-120)/72,'v20 kmh',((200-120)/72*20+10)*3.6);
console.log('717 a',(350-175)/98,'v21 kmh',((350-175)/98*21+12.5)*3.6);
console.log('704',simp(x=>2026*x,1,2));
console.log('711c');
// 720
const g=s=>Math.hypot(4*s,20-8*s,6-3*s);
for(const s of [0,1,3,4])console.log('720',s,g(s));
console.log(2*Math.hypot(4,8,3)*1000);
