const sub=(a,b)=>a.map((x,i)=>x-b[i]), dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0), len2=a=>dot(a,a)
const cr=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]
const A=[1,-1,2],B=[2,1,0]
const out=[]
for(let a=0;a<=1;a++)for(let b=-2;b<=2;b++)for(let c=0;c<=1;c++)for(let d=-2;d<=2;d++)for(let e=-2;e<=3;e++){
 if(a===0&&c===0)continue
 const sols=[]
 for(let m=-8;m<=8;m++){const C=[a*m+b,c*m+d,e]
  const CA=sub(A,C),CB=sub(B,C)
  if(dot(CA,CB)===0&&len2(cr(CA,CB))>0)sols.push(m)}
 if(sols.length===2) out.push([[a,b],[c,d],e,sols])
}
console.log(JSON.stringify(out))
