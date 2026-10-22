const add=(u,v)=>u.map((x,i)=>x+v[i]), sub=(u,v)=>u.map((x,i)=>x-v[i]), mul=(k,u)=>u.map(x=>k*x)
const dot=(u,v)=>u.reduce((s,x,i)=>s+x*v[i],0), nrm=u=>Math.sqrt(dot(u,u))
const cross=(u,v)=>[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]]
const det3=(u,v,w)=>dot(u,cross(v,w))
const ok=(n,c)=>console.log(c?'OK  ':'FAIL',n)
const near=(x,y)=>Math.abs(x-y)<1e-9
const rnd=()=>[Math.random()*4-2,Math.random()*4-2,Math.random()*4-2]

// ---- P1.2.7 VD1 (hop) : A goc, a=AB b=AD c=AA'
{
  const a=rnd(),b=rnd(),c=rnd()
  const Cp=add(add(a,b),c), G=mul(1/3,add(add(c,a),b)) // A'=c,B=a,D=b
  ok('1.2.7 VD1a AG=1/3 AC\'', near(dot(sub(G,mul(1/3,Cp)),sub(G,mul(1/3,Cp))),0))
  const f=(x,y)=>{const M=mul(x,add(a,c)); const N=add(a,mul(y,sub(b,a))); return sub(N,M)}
  const AtC=sub(add(a,b),c)  // A'C = C - A' = a+b - c
  const k=1/3
  ok('1.2.7 VD1b MN=1/3 A\'C', nrm(sub(f(k,k),mul(k,AtC)))<1e-9)
  ok('M khong thuoc A\'C', nrm(cross(sub(mul(k,add(a,c)),c),AtC))>1e-6)
  ok('doi x,y thi het song song', nrm(cross(f(0.4,1/3),AtC))>1e-6)
}
// ---- P1.2.7 VD2 chop S.ABCD day hbh
{
  const a=rnd(),b=rnd(),d=rnd(); const c=sub(add(b,d),a)  // S goc
  const M=mul(.5,b), N=mul(1/3,d), P=mul(1/4,c)
  ok('1.2.7 VD2 A,M,N,P dong phang', near(det3(sub(M,a),sub(N,a),sub(P,a)),0))
  ok('P khong phai 1/3', Math.abs(det3(sub(M,a),sub(N,a),sub(mul(1/3,c),a)))>1e-6)
  ok('hbh: SA+SC=SB+SD', nrm(sub(add(a,c),add(b,d)))<1e-9)
}
// ---- P1.4.6 VD1: AC=AD, goc BAC=BAD
{
  const B=[2,0,0], C0=[1,2,1]; const ph=Math.random()*6
  const C=C0, D=[1,2*Math.cos(ph)-1*Math.sin(ph),2*Math.sin(ph)+1*Math.cos(ph)]
  ok('|AC|=|AD|', near(nrm(C),nrm(D))); ok('B.C=B.D', near(dot(B,C),dot(B,D)))
  const CD=sub(D,C)
  ok('1.4.6 VD1a AB.CD=0', near(dot(B,CD),0))
  const M=mul(.5,B), N=mul(.5,add(C,D))
  ok('1.4.6 VD1b MN.CD=0', near(dot(sub(N,M),CD),0))
  const ang=(u,v)=>Math.acos(Math.abs(dot(u,v))/(nrm(u)*nrm(v)))*180/Math.PI
  ok('MN.AB !=0 (khong vuong AB)', Math.abs(dot(sub(N,M),B))>1e-6)
}
// ---- P1.4.6 VD2: SA=SB=SC=1; ASB=90, BSC=60, CSA=120
{
  const A=[1,0,0],B=[0,1,0],C=[-.5,.5,Math.sqrt(.5)]
  const g=(u,v)=>Math.acos(dot(u,v)/(nrm(u)*nrm(v)))*180/Math.PI
  ok('goc ASB=90',near(g(A,B),90)); ok('BSC=60',near(g(B,C),60)); ok('CSA=120',near(g(C,A),120))
  const ang=(u,v)=>Math.acos(Math.abs(dot(u,v))/(nrm(u)*nrm(v)))*180/Math.PI
  const AB=sub(B,A), BC=sub(C,B), AC=sub(C,A)
  ok('(AB,SC)=45', near(ang(AB,C),45)); console.log(' AB.SC=',dot(AB,C),'|AB|',nrm(AB))
  ok('(BC,SA)=60', near(ang(BC,A),60)); console.log(' BC.SA=',dot(BC,A),'|BC|',nrm(BC))
  console.log(' cos(AC,SB)=',Math.abs(dot(AC,B))/(nrm(AC)*nrm(B)),' sqrt3/6=',Math.sqrt(3)/6, 'AC.SB',dot(AC,B))
  const SM=mul(.5,add(B,C)); ok('SM.BC=0', near(dot(SM,BC),0))
}
// ---- P3.2.5
{
  const A=[1,2,-1],B=[3,0,2],C=[1,-2,3]
  const AB=sub(B,A),AC=sub(C,A)
  const OM=sub(mul(2,AB),AC); console.log(' AB',AB,'AC',AC,'OM',OM)
  ok('3.2.5 VD1a OM=(4;0;2)', OM.join()==='4,0,2')
  const M=mul(.5,sub(add(A,mul(2,B)),C)); console.log(' M',M)
  const MA=sub(A,M),MB=sub(B,M),MC=sub(C,M)
  ok('VD1b MA+2MB-MC=0', nrm(sub(add(MA,mul(2,MB)),MC))<1e-9 && M.join()==='3,2,0')
}
{
  const A=[-1,-4,0],B=[2,-1,3],C=[1,0,2]
  const M=mul(1/6,add(add(A,mul(2,B)),mul(3,C))); console.log(' M',M)
  const f=(P)=>add(add(sub(A,P),mul(2,sub(B,P))),mul(3,sub(C,P)))
  ok('VD2a M=(1;-1;2)', M.join()==='1,-1,2' && nrm(f(M))<1e-9)
  const N=mul(.5,add(A,C)); console.log(' N',N)
  const BC=sub(C,B)
  const g=(P)=>sub(add(sub(A,P),mul(3,sub(C,P))),mul(2,sub(B,P)))
  ok('VD2b NA-2NB+3NC=2BC', N.join()==='0,-2,1' && nrm(sub(g(N),mul(2,BC)))<1e-9)
  const k=add(add(A,mul(-2,B)),C); console.log(' A-2B+C =',k)
  ok('VD2c khong ton tai', nrm(k)>0)
}
