const sub=(a,b)=>a.map((x,i)=>x-b[i]), add=(a,b)=>a.map((x,i)=>x+b[i]), sc=(k,a)=>a.map(x=>k*x)
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0), len2=a=>dot(a,a), len=a=>Math.sqrt(len2(a))
const cr=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]
const deg=x=>x*180/Math.PI, cosA=(a,b)=>dot(a,b)/(len(a)*len(b))
let bad=0; const ok=(c,m)=>{ if(!c){bad++;console.log('SAI:',m)} else console.log('ok:',m) }
const eq=(a,b)=>Math.abs(a-b)<1e-9
const eqv=(a,b)=>a.every((x,i)=>eq(x,b[i]))
const rd=a=>a.map(x=>Math.round(x*1e9)/1e9)
// ---------- P3.4.1
{ let a=[2,1,-1],b=[1,2,1]; ok(dot(a,b)===3&&eq(cosA(a,b),0.5)&&eq(deg(Math.acos(.5)),60),'4.1 VD1')
  a=[1,-2,0];b=[2,1,-2]; const s=add(a,b),d=sub(a,b),t=sub(sc(2,a),b)
  ok(eqv(s,[3,-1,-2])&&eqv(t,[0,-5,2])&&dot(s,t)===1,'4.1 VD2 (a+b).(2a-b)=1')
  ok(eqv(d,[-1,-3,2])&&dot(s,d)===-4&&len2(s)===14&&len2(d)===14&&eq(cosA(s,d),-2/7),'4.1 VD2 cos=-2/7') }
// ---------- P3.4.2
{ const f=m=>dot([m,2,-3],[2,m-1,2]); ok(f(2)===0&&f(0)===-8+0*0&&f(1)===-4,'4.2 VD1a m=2 (4m-8)')
  const g=m=>dot(sub([2,2,1],[1,0,2]),sub([0,m,2],[m,1,1])); ok(g(3)===0&&g(0)===-3&&g(1)===-2,'4.2 VD1b m=3 (m-3)')
  const h=m=>dot(sub([1,-1,2],[1,m,0]),sub([2,1,0],[1,m,0])); ok(h(1)===0&&h(-1)===0&&h(0)===-1&&h(2)===3,'4.2 VD2 m^2-1')
  ok(len2(cr(sub([1,-1,2],[1,1,0]),sub([2,1,0],[1,1,0])))>0&&len2(cr(sub([1,-1,2],[1,-1,0]),sub([2,1,0],[1,-1,0])))>0,'4.2 VD2 không suy biến') }
// ---------- P3.4.3
{ const A=[2,1,-1],B=[3,3,1],C=[4,2,-3]
  const ang=(P,Q,R)=>deg(Math.acos(cosA(sub(Q,P),sub(R,P))))
  ok(eq(ang(A,B,C),90)&&eq(ang(B,A,C),45)&&eq(ang(C,A,B),45),'4.3 VD1 90/45/45')
  ok(len2(sub(B,A))===9&&len2(sub(C,A))===9&&len2(sub(C,B))===18,'4.3 VD1 độ dài')
  const c=m=>cosA(sub([4,0,2],[0,0,m]),sub([0,0,0],[0,0,m]))
  let sols=[];for(let m=-50;m<=50;m+=0.25){if(m!==0&&eq(c(m),0.6))sols.push(m)}
  ok(sols.includes(5)&&sols.filter(m=>m>0).length===1,'4.3 VD2 nghiệm m>0 duy nhất (m=-1 bị loại do tia Oz): '+sols) }
// ---------- P3.5
{ let a=[2,-1,3],b=[1,4,-2];const c=cr(a,b)
  ok(eqv(c,[-10,7,9])&&dot(c,a)===0&&dot(c,b)===0,'5.1 VD1 [a,b]=(-10;7;9)')
  const A=[1,2,-1],B=[2,2,-2],C=[1,4,0],AB=sub(B,A),AC=sub(C,A),n0=cr(AB,AC)
  ok(eqv(AB,[1,0,-1])&&eqv(AC,[0,2,1])&&eqv(n0,[2,-1,2])&&len(n0)===3,'5.1 VD2 [AB,AC]=(2;-1;2)')
  const n=sc(2,n0); ok(eqv(n,[4,-2,4])&&len(n)===6&&dot(n,AB)===0&&dot(n,AC)===0,'5.1 VD2 n=(4;-2;4)') }
{ const A=[1,3,-2],B=[-1,1,1],C=[1,5,-3],AB=sub(B,A),AC=sub(C,A),c=cr(AB,AC)
  ok(eqv(AB,[-2,-2,3])&&eqv(AC,[0,2,-1])&&eqv(c,[-4,-2,-4])&&len(c)===6,'5.2 VD1 cross')
  ok(len(sub(C,B))===6&&eq(len(c)/2,3)&&eq(2*3/6,1),'5.2 VD1 S=3, BC=6, h=1')
  const A2=[1,0,2],B2=[3,2,3],D2=[1,2,4],AB2=sub(B2,A2),AD2=sub(D2,A2),c2=cr(AB2,AD2)
  const C2=add(B2,sub(D2,A2)); ok(eqv(AB2,[2,2,1])&&eqv(AD2,[0,2,2])&&eqv(c2,[2,-4,4])&&len(c2)===6&&len(AB2)===3&&eqv(C2,[3,4,5]),'5.2 VD2 S=6,C(3;4;5)')
  ok(eqv(sub(C2,B2),AD2)&&eqv(sub(C2,D2),AB2),'5.2 VD2 hbh')
  ok(eq(len(cr(AB2,AD2))/len(AB2),2),'5.2 VD2 h=2') }
{ const A=[1,0,1],B=[2,2,1],D=[1,1,4],A1=[3,1,4],AB=sub(B,A),AD=sub(D,A),AA=sub(A1,A)
  const c=cr(AB,AD); ok(eqv(AB,[1,2,0])&&eqv(AD,[0,1,3])&&eqv(AA,[2,1,3])&&eqv(c,[6,-3,1])&&dot(c,AA)===12,'5.3 VD1 V hộp=12')
  ok(dot(c,AA)/6===2&&dot(c,AA)/3===4,'5.3 VD1 tứ diện 2, chóp 4')
  console.log('   C=',add(B,AD))
  const P=[1,1,0],Q=[2,3,1],R=[0,2,3]; const PQ=sub(Q,P),PR=sub(R,P); ok(eqv(cr(PQ,PR),[5,-4,3]),'5.3 VD2 PQ x PR')
  const f=m=>dot(cr(PQ,PR),sub([m,4,4],P)); ok(f(1)===0&&f(7)===30&&f(7)/6===5&&f(0)!==0,'5.3 VD2 m=1; V(m=7)=5')
  console.log('   PQ=',PQ,'PR=',PR) }
// ---------- P3.6
{ const A=[3,1,-1],B=[1,-1,3],C=[2,2,1], I=sc(1/4,add(add(A,B),sc(2,C)))
  ok(eqv(I,[2,1,1]),'6.1 VD1 I=(2;1;1)')
  const T=M=>len2(sub(M,A))+len2(sub(M,B))+2*len2(sub(M,C))
  ok(T(I)===16,'6.1 VD1 Tmin=16')
  let mn=1e9;for(let i=0;i<20000;i++){const M=add(I,[Math.random()*2-1,Math.random()*2-1,Math.random()*2-1].map(x=>x*3));mn=Math.min(mn,T(M))};ok(mn>=16-1e-9&&mn<16.5,'6.1 VD1 numeric '+mn)
  ok(len2(sub(I,A))===5&&len2(sub(I,B))===9&&len2(sub(I,C))===1,'6.1 VD1 IA2,IB2,IC2')
  const A2=[2,0,3],B2=[3,2,5],C2=[2,1,3],I2=sub(sub(sc(3,C2),A2),B2)
  ok(eqv(I2,[1,1,1]),'6.1 VD2 I=(1;1;1)')
  const T2=M=>len2(sub(M,A2))+len2(sub(M,B2))-3*len2(sub(M,C2))
  ok(T2(I2)===12&&len2(sub(I2,A2))===6&&len2(sub(I2,B2))===21&&len2(sub(I2,C2))===5,'6.1 VD2 max=12')
  let mx=-1e9;for(let i=0;i<50000;i++){const M=add(I2,[Math.random()*2-1,Math.random()*2-1,Math.random()*2-1].map(x=>x*5));mx=Math.max(mx,T2(M))};ok(mx<=12+1e-9&&mx>11.5,'6.1 VD2 numeric '+mx)
  ok(eqv(add(add(sub(A2,I2),sub(B2,I2)),sc(-3,sub(C2,I2))),[0,0,0]),'6.1 VD2 IA+IB-3IC=0') }
{ const A=[2,-1,3],B=[0,3,1],C=[1,1,2],I=sc(1/4,add(add(A,B),sc(2,C))); ok(eqv(I,[1,1,2]),'6.2 VD1 I=(1;1;2)')
  const F=M=>len(add(add(sub(A,M),sub(B,M)),sc(2,sub(C,M))))
  ok(eq(F([1,1,0]),8),'6.2 VD1 min 8')
  let mn=1e9;for(let i=0;i<50000;i++){const M=[1+(Math.random()*2-1)*4,1+(Math.random()*2-1)*4,0];mn=Math.min(mn,F(M))};ok(mn>=8-1e-9&&mn<8.1,'6.2 VD1 numeric '+mn)
  const A2=[1,2,1],B2=[4,-1,2],Ap=[1,2,-1]; const d=sub(B2,Ap); ok(eqv(d,[3,-3,3])&&eq(len(d),3*Math.sqrt(3)),'6.2 VD2 AprimeB')
  const M=[2,1,0]; const G=P=>len(sub(P,A2))+len(sub(P,B2)); ok(eq(G(M),3*Math.sqrt(3))&&eqv(add(Ap,sc(1/3,d)),M),'6.2 VD2 M(2;1;0)')
  let mn2=1e9;for(let i=0;i<200000;i++){const P=[2+(Math.random()*2-1)*6,1+(Math.random()*2-1)*6,0];mn2=Math.min(mn2,G(P))};ok(mn2>=G(M)-1e-9&&mn2<G(M)+0.01,'6.2 VD2 numeric '+mn2+' vs '+G(M)) }
{ let mx=-1e9,mn=1e9,mx2=-1e9,mn2=1e9;const a=[2,-1,2]
  for(let i=0;i<200000;i++){let b=[Math.random()-.5,Math.random()-.5,Math.random()-.5];const l=len(b);b=sc(2/l,b);const p=dot(a,b);mx=Math.max(mx,p);mn=Math.min(mn,p);const q=len(add(a,b));mx2=Math.max(mx2,q);mn2=Math.min(mn2,q)}
  ok(len(a)===3&&mx<=6&&mx>5.99&&mn>=-6&&mn<-5.99&&mx2<=5&&mx2>4.99&&mn2>=1&&mn2<1.01,'6.3 VD1 [-6,6],[1,5] '+[mn,mx,mn2,mx2])
  const G=t=>Math.hypot(3,t-2)+Math.hypot(6,t-14); let m=1e9,tm=0;for(let t=-50;t<=50;t+=0.001){const v=G(t);if(v<m){m=v;tm=t}}
  ok(eq(Math.round(m*1e6)/1e6,15)&&eq(Math.round(tm*1000)/1000,6),'6.3 VD2 min 15 tại t=6: '+m+' '+tm)
  ok(Math.hypot(3,4)===5&&Math.hypot(6,8)===10&&Math.hypot(9,12)===15,'6.3 VD2 MA=5,MB=10') }
// ---------- P3.7
{ const A=[10,20,48],B=[16,28,24],v=sc(1/2,sub(B,A)); ok(eqv(v,[3,4,-12])&&len(v)===13,'7.1 VD1 v,13')
  const P=t=>add(A,sc(t,v)); ok(eqv(P(3),[19,32,12])&&eqv(P(4),[22,36,0])&&eqv(P(2),B),'7.1 VD1 P(3),P(4)')
  const A2=[-45,20,9],B2=[-15,50,7],v2=sc(1/10,sub(B2,A2)); ok(eqv(rd(v2),[3,3,-0.2]),'7.1 VD2 v')
  const P2=t=>add(A2,sc(t,v2)); ok(eqv(rd(P2(15)),[0,65,6])&&eqv(rd(P2(20)),[15,80,5]),'7.1 VD2 P(15),P(20)')
  ok(eqv(rd(P2(7)),[-24,41,7.6]),'7.1 VD2 P(7)=(-24;41;7.6)') }
{ const A=[-80,40,10],v=[6,3,0],P=t=>add(A,sc(t,v)); ok(len2(P(5))===5625&&len2(P(11))===5625&&len2(P(8))===5220&&len2(P(0))===8100,'7.2 VD1 radar t=5..11, len2 P(8)=5220')
  let inside=[];for(let t=0;t<=20;t+=0.5){if(len2(P(t))<=5625)inside.push(t)};ok(inside[0]===5&&inside.at(-1)===11,'7.2 VD1 vào/ra')
  console.log('   min dist=',Math.sqrt(5220), 'tại t=8 P=',P(8), '|v|=',len(v))
  const P1=t=>add([10,5,12],sc(t,[1,3,0])),P2=t=>add([2,-2,1],sc(t,[3,4,2]))
  const d=t=>len(sub(P2(t),P1(t))); ok(eq(d(5),3)&&d(4)>3&&d(6)>3&&eq(d(0)**2,234),'7.2 VD2 min 3 tại 5; d0^2=234')
  let m=1e9,tm;for(let t=0;t<=20;t+=0.001){if(d(t)<m){m=d(t);tm=t}};ok(Math.abs(m-3)<1e-6&&Math.abs(tm-5)<1e-3,'7.2 VD2 numeric')
  console.log('   P1(5)=',P1(5),'P2(5)=',P2(5)) }
{ const T1=[-1,-6,20],T2=[-2,2,28],P=[0,0,-60],T3=sc(-1,add(add(T1,T2),P)); ok(eqv(T3,[3,4,12])&&len(T3)===13&&eqv(add(add(add(T1,T2),T3),P),[0,0,0]),'7.3 VD1 T3=(3;4;12), 13')
  const G1=[1,1,4],G2=[1,2,2],G=add(G1,G2),A=[1,2,0],B=[4,2,4],AB=sub(B,A)
  ok(eqv(G,[2,3,6])&&len(G)===7&&eqv(AB,[3,0,4])&&len(AB)===5,'7.3 VD2 F,AB')
  ok(dot(G1,AB)===19&&dot(G2,AB)===11&&dot(G,AB)===30&&eq(cosA(G,AB),6/7),'7.3 VD2 công 19,11,30; cos 6/7')
  console.log('   góc=',deg(Math.acos(6/7))) }
console.log(bad?('LỖI '+bad):'TẤT CẢ KHỚP')
