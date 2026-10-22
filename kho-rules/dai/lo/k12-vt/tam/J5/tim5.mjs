const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0)
const rs=[-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6]
const out=[]
for(const a of rs)for(const b of rs)for(const c of rs){const F=[a,b,c];const l=Math.sqrt(dot(F,F));if(!Number.isInteger(l)||l<5||c<=0)continue
 for(const x of rs)for(const y of rs)for(const z of rs){const d=[x,y,z];const m=Math.sqrt(dot(d,d));if(!Number.isInteger(m)||m<3)continue
  const p=dot(F,d); if(p>0&&2*p===l*m&&Math.abs(c)<=Math.abs(a)+5)out.push([F,l,d,m,p])}}
console.log(out.length,JSON.stringify(out.filter(o=>o[1]<=9).slice(0,30)))
