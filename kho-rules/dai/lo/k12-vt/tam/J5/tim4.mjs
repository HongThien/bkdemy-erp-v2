const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0)
const out=[]
// |A+tv|^2=R^2: |v|^2 t^2 + 2 A.v t + |A|^2 - R^2 =0, roots integer
for(const vx of [6,8,9,12])for(const vy of [0,3,4,6,8,12])for(const vz of [0,-1,-2,1])
 for(const ax of [-100,-80,-60,-50,-40,-30])for(const ay of [-60,-40,-30,-20,0,20,40,60])for(const az of [8,10,12]){
  const v=[vx,vy,vz],A=[ax,ay,az]
  const a=dot(v,v),b=2*dot(A,v)
  for(const R of [50,60,65,75,100,120,130,150]){
   const c=dot(A,A)-R*R
   const D=b*b-4*a*c
   if(D>0&&Number.isInteger(Math.sqrt(D))){
     const r1=(-b-Math.sqrt(D))/(2*a),r2=(-b+Math.sqrt(D))/(2*a)
     if(Number.isInteger(r1)&&Number.isInteger(r2)&&r1>0&&Math.abs(vz)<=0) out.push([A,v,R,r1,r2,'tmin',-b/(2*a)])
   }}
 }
console.log(out.length,JSON.stringify(out.slice(0,30)))
