const A=[0,4,5],B=[3,0,5],C=[3,4,0],D=[3,4,5];
const sub=(p,q)=>p.map((v,i)=>v-q[i]);const cr=(u,v)=>[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];const n=v=>Math.hypot(...v);
function dist(P,M){const d=sub(D,M);return n(cr(sub(P,M),d))/n(d);}
let best=0,bs=0;for(let s=0;s<=1;s+=1e-5){const M=[3*s,4-4*s,5];if(s==1)continue;const t=dist(A,M)+dist(B,M)+dist(C,M);if(t>best){best=t;bs=s}}
console.log(best,bs,3*bs+4-4*bs+5, 216/25);
// simpson
const S=(f,a,b,N=20000)=>{let h=(b-a)/N,s=f(a)+f(b);for(let i=1;i<N;i++)s+=f(a+i*h)*(i%2?4:2);return s*h/3};
console.log(S(x=>Math.PI*(4*x*x-x**4*0)*0+Math.PI*(16*x*x-4*x**4),0,2)/S(x=>4*x-2*x*x,0,2)/Math.PI, 32/5);
console.log(S(x=>Math.PI*(36*x*x-9*x**4),0,2)/S(x=>6*x-3*x*x,0,2)/Math.PI,48/5);
console.log(S(x=>(x*x-2*x+3)**2,1,2),83/15,S(x=>(x*x-x+1)**2,1,2),3.7);
console.log(S(x=>1000*0+9-x*x,-3,3));
