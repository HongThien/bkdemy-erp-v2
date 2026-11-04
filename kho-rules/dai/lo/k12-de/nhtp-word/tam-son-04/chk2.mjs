const g=(x,C)=>x*x/2+2*x-5*Math.log(Math.abs(x))+C;
let C1=4-g(1,0),C2=20-g(3,C1)-g(-9,0);let v=g(-6,C2);console.log(C1,C2,v,'ln terms -5ln2-5ln3 =>',v+5*Math.log(2)+5*Math.log(3));
const h=(x,C)=>x*x/2+5*x-7*Math.log(Math.abs(x))+C;
C1=4-h(1,0);C2=20-h(3,C1)-h(-9,0);v=h(-6,C2);console.log(C1,C2,v+7*Math.log(2)+7*Math.log(3));
