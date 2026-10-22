const sub=(a,b)=>a.map((x,i)=>x-b[i]), dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0), len2=a=>dot(a,a)
let out=[]
for(let a1=-3;a1<=3;a1++)for(let a2=-3;a2<=3;a2++)for(let a3=-3;a3<=3;a3++)for(let b1=-3;b1<=3;b1++)for(let b2=-3;b2<=3;b2++)for(let b3=-3;b3<=3;b3++){
 const A=[a1,a2,a3],B=[b1,b2,b3]
 const sols=[]
 for(let m=-5;m<=5;m++){
  const M=[m,0,0];const u=sub(A,M),v=sub(B,M);
  if(len2(u)==0||len2(v)==0)continue
  const d=dot(u,v)
  if(d>0&&4*d*d===len2(u)*len2(v)) sols.push(m)
 }
 if(sols.length===1&&a2!==0&&b2!==0&&a2!==b2) out.push([A,B,sols])
}
console.log(out.length, JSON.stringify(out.slice(0,40)))
