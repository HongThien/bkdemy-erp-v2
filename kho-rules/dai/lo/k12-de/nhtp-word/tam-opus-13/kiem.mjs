const S=(f,a,b,n=20000)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=f(a+i*h)*(i%2?4:2);return s*h/3};
const P=Math.PI;
console.log('736',S(x=>P*Math.cos(4*x)**2,0,P/8),P*P/16);
console.log('739',S(x=>P*Math.sin(x)**2,0,P),P*P/2);
console.log('749c',S(x=>x*x-x-6,1,4),'d',S(x=>Math.abs(x*x-x-6),1,4),61/6);
console.log('762b',S(x=>Math.abs(x*x-2*x),0,2),'d',S(x=>P*(4*x*x-x**4),0,2),64*P/15,16*P/15);
const f=x=>1/(x*x-4),fp=x=>-2*x/(x*x-4)**2;
console.log('770c',S(f,3,4),Math.log(5/3)/4,'d',S(x=>f(x)+fp(x)/f(x)**2,3,4),Math.log(5/3)/4+7);
console.log('772c',S(x=>2*x+Math.sin(x),0,P/2),P*P/4-1,'d',S(x=>2*x+Math.sin(x),0,P/4),P*P/16-Math.SQRT2/2+1);
console.log('773',S(x=>2/x,1,4),4*Math.SQRT2,S(x=>P*4/x/x,1,4),2*P);
// xe
for(const [L,v0,tr,tn,td,lim] of [[240,8,4,16,30,null],[200,10,2,12,24,100],[320,25,4,10,20,50],[180,7.5,4,10,20,120],[250,10,5,12,20,100]]){const rem=L-v0*tr;const a=(rem-v0*tn)/(tn*tn/2);console.log('xe',rem,a,(a*td+v0)*3.6,lim)}
console.log('767',0.75*36+30+12);
// 734 d
const A=[1000,2000,3000];for(const R of [6400,12400]){const q=(t)=>A.reduce((s,c,i)=>s+(c+t)**2,0);let lo=0,hi=1e5;for(let k=0;k<200;k++){const m=(lo+hi)/2;q(m)<=R*R?lo=m:hi=m}console.log('734',R,lo,lo/3000,lo*Math.sqrt(3))}
console.log('734 |A|',Math.hypot(...A));
