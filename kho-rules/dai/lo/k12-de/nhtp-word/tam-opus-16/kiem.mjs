const simp=(f,a,b,n=20000)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=(i%2?4:2)*f(a+i*h);return s*h/3};
const P=Math.PI;
let S1=simp(x=>4*x-2*x*x,0,2),V1=P*simp(x=>16*x*x-4*x**4,0,2);console.log('W0901',S1,V1/S1/P);
let S3=simp(x=>6*x-3*x*x,0,2),V3=P*simp(x=>36*x*x-9*x**4,0,2);console.log('W0903',S3,V3/S3/P);
console.log('W0910 dien tich',simp(x=>Math.abs(x-4/x),1,4),simp(x=>x-4/x,1,4));
console.log('W0920',simp(x=>9-x*x,-3,3));
let k=1500;console.log('W0921',2*k/3*64+40000,2*k/3*64+40000-4800);
// W0923
const A=[0,4,5],B=[3,0,5],C=[3,4,0],D=[3,4,5];
const sub=(p,q)=>p.map((v,i)=>v-q[i]),dot=(p,q)=>p.reduce((s,v,i)=>s+v*q[i],0),nrm=p=>Math.sqrt(dot(p,p));
const dl=(Pt,u)=>{const w=sub(Pt,D);const t=dot(w,u)/dot(u,u);return nrm(w.map((v,i)=>v-t*u[i]))};
let best=-1,bs=0;for(let i=0;i<=100000;i++){const s=i/100000;const M=A.map((v,j)=>v+s*(B[j]-v));const u=sub(M,D);const T=dl(A,u)+dl(B,u)+dl(C,u);if(T>best){best=T;bs=s}}
const M=A.map((v,j)=>v+bs*(B[j]-v));console.log('W0923',bs,M,M[0]+M[1]+M[2],best);
console.log('W0949',simp(x=>(x*x-2*x+3)**2,1,2),83/15);
console.log('W0952',simp(x=>(x*x-x+1)**2,1,2));
console.log('W0954',simp(x=>x**4,0,1));
console.log('W0957',Math.hypot(300,-400,100),2*Math.sqrt(250**2-100**2)/900*60);
console.log('W0928',-60000*Math.exp(-0.3)-250*Math.exp(1.2)+60250,Math.log(30)/0.05);
console.log('W0930',97*P);
