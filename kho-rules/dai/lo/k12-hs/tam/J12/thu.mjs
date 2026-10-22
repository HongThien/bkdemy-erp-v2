// ex1 M: nghich bien tung khoang
let ok=[];for(let m=-6;m<=6;m++){ if((m+1)*m-2<0) ok.push(m)} console.log('ex1',ok);
// ex2 y=(x+3)/(x+m) dong bien tren (-inf;-4): quet m
function dong(m){ if(m===3) return false; const xs=[];for(let x=-100;x<-4;x+=0.37){ if(Math.abs(x+m)<1e-6) return false; xs.push(x)} for(let i=1;i<xs.length;i++){ if(Math.abs(xs[i-1]+m)<1e-9)continue; const f=x=>(x+3)/(x+m); if(!(f(xs[i])>f(xs[i-1])&&(xs[i]+m)*(xs[i-1]+m)>0)) return false} return true}
let r=[];for(let m=-10;m<=10;m+=0.25) if(dong(m)) r.push(m); console.log('ex2',r[0],r[r.length-1],r.length);
// ex4 hcn
let s=[];for(let m=-20;m<=20;m+=0.5){ const area=Math.abs(m)*Math.abs(m+1); const ad=-(m)*(m+1)+2; if(Math.abs(area-6)<1e-9&&Math.abs(ad)>1e-9) s.push(m)} console.log('ex4',s);
// ex5
let t=[];for(let m=-3;m<=3;m+=0.25){ if(-1-2*m<0) t.push(m)} console.log('ex5',t[0]);
// H4.5.1
const f=x=>(x+2)/(x-1); console.log(f(2),f(0));
const g=x=>(2*x+1)/(x-1); for(const x of [2,0,4,-2]) console.log(x,g(x));
let c=[];for(let x=-200;x<=200;x++){ if(x===1)continue; const y=(2*x+1)/(x-1); if(Number.isInteger(y)) c.push([x,y])} console.log(c);
const h=x=>(3-x)/(2*x+4); console.log(h(0), h(1000));
// m tam doi xung
for(const m of [1]) console.log(1-m, m, 2*(1-m)+1);
