const add=(u,v)=>u.map((x,i)=>x+v[i]), sub=(u,v)=>u.map((x,i)=>x-v[i]), mul=(k,u)=>u.map(x=>k*x)
const dot=(u,v)=>u.reduce((s,x,i)=>s+x*v[i],0), len=u=>Math.sqrt(dot(u,u))
const det=(u,v,w)=>u[0]*(v[1]*w[2]-v[2]*w[1])-u[1]*(v[0]*w[2]-v[2]*w[0])+u[2]*(v[0]*w[1]-v[1]*w[0])
const ang=(u,v)=>Math.acos(dot(u,v)/len(u)/len(v))*180/Math.PI
const ok=(n,c)=>console.log(c?'OK  ':'FAIL',n)
const z=(x)=>Math.abs(x)<1e-9, eq=(x,y)=>Math.abs(x-y)<1e-9
// ---- P1.3.1 hình hộp tổng quát
{
 const a=[1,0,.3],b=[.2,1,.1],c=[.1,.3,1]
 const A=[0,0,0],B=a,D=b,A1=c,C=add(a,b),B1=add(a,c),D1=add(b,c),C1=add(add(a,b),c)
 const V=(P,Q)=>sub(Q,P)
 ok('131 ex1a',z(det(V(A,B),V(A,D),V(A1,C1))))
 ok('131 ex1b ≠',!z(det(V(A,B),V(B1,C1),V(C,C1))))
 ok('131 ex1b B1C1=AD,CC1=AA1',JSON.stringify(V(B1,C1))==JSON.stringify(V(A,D))&&JSON.stringify(V(C,C1))==JSON.stringify(V(A,A1)))
 ok('131 ex1c',z(det(V(A,A1),V(C,C1),V(B,D))))
 // tứ diện
 const T={A:[0,0,0],B:[2,0,0],C:[1,3,0],D:[1,1,4]}
 const M=mul(.5,add(T.A,T.B)),N=mul(.5,add(T.C,T.D))
 const MN=sub(N,M)
 ok('131 ex2a',z(det(MN,sub(T.C,T.A),sub(T.D,T.B))))
 ok('131 ex2b',z(det(MN,sub(T.D,T.A),sub(T.C,T.B))))
 ok('131 ex2c ≠',!z(det(MN,sub(T.B,T.A),sub(T.D,T.C))))
}
// ---- P1.3.2
{
 const a=[1,0,.3],b=[.2,1,.1],c=[.1,.3,1]
 const comb=(x,y,z0)=>add(add(mul(x,a),mul(y,b)),mul(z0,c))
 const x=comb(1,2,0),y=comb(2,-1,1),zz=comb(5,0,2)
 ok('132 ex1a z=x+2y',z(len(sub(zz,add(x,mul(2,y))))))
 ok('132 ex1a x,y not collinear',len(cross(x,y))>1e-6)
 const u=comb(1,2,-1),v=comb(2,-1,4)
 for(const m of [2,1,3]){const w=comb(4,3,m);console.log(' m',m,'det',det(u,v,w).toFixed(4))}
 ok('132 ex1b m=2',z(det(u,v,comb(4,3,2))))
 ok('132 ex1b 2u+v',z(len(sub(comb(4,3,2),add(mul(2,u),v)))))
 // hộp, M trung điểm AD, N: CN=t CC'
 const AB=a,AD=b,AA=c
 for(const t of [0.5,0.3,0.7]){
  const AN=add(add(AB,AD),mul(t,AA)), AM=mul(.5,AD), MN=sub(AN,AM)
  console.log(' t',t,'det',det(MN,add(AB,AD),add(AB,AA)).toFixed(4))
 }
}
function cross(u,v){return [u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]]}
// ---- P1.4.1
{
 const ab=2*4*Math.cos(2*Math.PI/3); ok('141 ex1a ab=-4',eq(ab,-4))
 ok('141 ex1b |a+b|^2=12',eq(4+16+2*ab,12))
 const k=2; ok('141 ex1c k=2',eq((k*4)*2+k*ab-2*ab-16,0)) // (ka-b)(2a+b)=2k a^2 + k ab -2ab - b^2
 // ex2 Gram
 const ab2=0,bc=3*4*.5,ca=4*2*.5
 ok('141 ex2 |sum|=7',eq(4+9+16+2*(ab2+bc+ca),49))
 ok('141 ex2 (a+b)(b-c)=-1',eq(ab2-ca+9-bc,-1))
}
// ---- P1.4.2 tứ diện đều
{
 const A=[1,1,1],B=[1,-1,-1],C=[-1,1,-1],D=[-1,-1,1],V=(P,Q)=>sub(Q,P)
 const a2=dot(V(A,B),V(A,B)); const I=mul(.5,add(C,D))
 ok('142 ex1a',eq(dot(V(A,B),V(A,C)),a2/2)); ok('142 ex1b',z(dot(V(A,B),V(C,D)))); ok('142 ex1c',eq(dot(V(A,B),V(A,I)),a2/2))
 // hộp thoi: Gram
 const G=[[1,.5,.5],[.5,1,.5],[.5,.5,1]]
 const dd=(p,q)=>p.reduce((s,x,i)=>s+q.reduce((t,y,j)=>t+x*y*G[i][j],0),0)
 const e=[1,0,0],f=[0,1,0],g=[0,0,1]
 const AC1=[1,1,1],BD=[-1,1,0],AB1=[1,0,1],AD1=[0,1,1]
 ok('142 ex2a 2a^2',eq(dd(e,AC1),2)); ok('142 ex2b 5/2',eq(dd(AB1,AD1),2.5)); ok('142 ex2c 0',z(dd(AC1,BD)))
 // check Gram realisable
 ok('142 gram pd',det([1,.5,.5],[.5,1,.5],[.5,.5,1])>0)
}
// ---- P1.4.3
{
 const A=[0,0,0],B=[1,0,0],D=[0,1,0],A1=[0,0,1],C=[1,1,0],B1=[1,0,1],D1=[0,1,1],C1=[1,1,1],V=(P,Q)=>sub(Q,P)
 ok('143 a 90',eq(ang(V(A,B1),V(A,D)),90))
 ok('143 b 60',eq(ang(V(B,D),V(B1,C)),60)); ok('143 b BD=B1D1',JSON.stringify(V(B,D))==JSON.stringify(V(B1,D1)))
 ok('143 c 180',eq(ang(V(A,C),V(C1,A1)),180))
 const a=1,w=Math.SQRT2
 const AC1=[1,1,w],BD=[-1,1,0],A1C=[1,1,-w],BD1=[-1,1,w]
 ok('143 ex2a 90',eq(ang(AC1,BD),90)); ok('143 ex2b 120',eq(ang(A1C,BD1),120))
}
// ---- P1.4.4
{
 ok('144 a 30',eq(Math.acos(6*Math.sqrt(3)/12)*180/Math.PI,30))
 ok('144 b 135',eq(Math.acos(-10/(5*2*Math.SQRT2))*180/Math.PI,135))
 // a+b+c=0 |3|,|5|,|7|
 const ab=(49-9-25)/2; ok('144 ex2 60',eq(Math.acos(ab/15)*180/Math.PI,60))
}
// ---- P1.4.5
{
 let mn=1e9,mx=-1e9; for(let p=0;p<=180;p+=.01){const v=Math.sqrt(25+24*Math.cos(p*Math.PI/180));mn=Math.min(mn,v);mx=Math.max(mx,v)}
 ok('145 ex1a 1..7',eq(Math.round(mn*1e6)/1e6,1)&&eq(Math.round(mx*1e6)/1e6,7))
 let m2=1e9; for(let t=-2;t<=2;t+=1e-4){m2=Math.min(m2,Math.sqrt(16*t*t+12*t+9))}
 ok('145 ex1b 3√3/2',Math.abs(m2-3*Math.sqrt(3)/2)<1e-6)
 // |a+tb| numerically with real vectors angle 60
 const a=[3,0],b=[4*.5,4*Math.sqrt(3)/2]; let m3=1e9; for(let t=-2;t<=2;t+=1e-4){const w=[a[0]+t*b[0],a[1]+t*b[1]];m3=Math.min(m3,Math.hypot(...w))}
 ok('145 ex1b geo',Math.abs(m3-3*Math.sqrt(3)/2)<1e-6)
 let mxP=-1,mnP=1e9
 for(let i=0;i<200000;i++){const r=()=>{const v=[Math.random()-.5,Math.random()-.5,Math.random()-.5];const l=len(v);return mul(1/l,v)};const a=r(),b=r(),c=r()
  const P=dot(sub(a,b),sub(a,b))+dot(sub(b,c),sub(b,c))+dot(sub(c,a),sub(c,a));mxP=Math.max(mxP,P);mnP=Math.min(mnP,P)}
 console.log(' P range',mnP,mxP)
 ok('145 ex2 ≤9',mxP<=9+1e-9)
 const c1=[1,0,0],c2=[-.5,Math.sqrt(3)/2,0],c3=[-.5,-Math.sqrt(3)/2,0]
 const P0=dot(sub(c1,c2),sub(c1,c2))+dot(sub(c2,c3),sub(c2,c3))+dot(sub(c3,c1),sub(c3,c1)); ok('145 ex2 =9',eq(P0,9))
}
