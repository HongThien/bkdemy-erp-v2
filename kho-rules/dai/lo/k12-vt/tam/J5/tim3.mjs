const sub=(a,b)=>a.map((x,i)=>x-b[i]), dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0), len2=a=>dot(a,a)
const cr=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]
const isSq=n=>Number.isInteger(Math.sqrt(n))
const rs=[-3,-2,-1,0,1,2,3]
let out=[]
for(const x of rs)for(const y of rs)for(const z of rs)for(const u of rs)for(const v of rs)for(const w of rs){
 const AB=[x,y,z],AD=[u,v,w];const c=cr(AB,AD);const c2=len2(c)
 if(c2===0||dot(AB,AD)===0)continue
 if(isSq(c2)&&isSq(len2(AB))&&!isSq(len2(AD))&&c.every(t=>t!==0)&&Math.sqrt(c2)%Math.sqrt(len2(AB))===0&&Math.sqrt(len2(AB))>2) out.push([AB,AD,c,Math.sqrt(c2),Math.sqrt(len2(AB))])
}
console.log(out.length,JSON.stringify(out.slice(0,15)))
