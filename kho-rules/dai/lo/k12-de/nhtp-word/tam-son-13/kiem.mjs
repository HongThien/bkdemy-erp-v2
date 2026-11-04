const simp=(f,a,b,n=20000)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=f(a+i*h)*(i%2?4:2);return s*h/3};
// W0731
let a=(180-120)/72; console.log('731 a',a,'v24 kmh',(a*24+10)*3.6);
// W0748
a=(200-120)/72; console.log('748 a',a,'v20 kmh',(a*20+10)*3.6);
// W0745
a=(150-75)/50; console.log('745 a',a,'v20 kmh',(a*20+7.5)*3.6);
// W0737
a=(220-250)/50; console.log('737 a',a,'v20 kmh',(a*20+25)*3.6);
// W0722
a=(208-128)/128; console.log('722 a',a,'v30 kmh',(a*30+8)*3.6);
console.log('736',simp(x=>Math.PI*Math.cos(4*x)**2,0,Math.PI/8),Math.PI**2/16);
console.log('739',simp(x=>Math.PI*Math.sin(x)**2,0,Math.PI),Math.PI**2/2);
console.log('741',simp(x=>Math.exp(3*x+1),0,1),(Math.E**4-Math.E)/3);
console.log('749 dist',simp(x=>Math.abs(x*x-x-6),1,4),61/6,'disp',simp(x=>x*x-x-6,1,4));
console.log('762',simp(x=>Math.PI*(4*x*x-x**4),0,2),64*Math.PI/15,'area',simp(x=>2*x-x*x,0,2));
console.log('770c',simp(x=>1/(x*x-4),3,4),Math.log(5/3)/4);
const f=x=>1/(x*x-4),fp=x=>-2*x/(x*x-4)**2;
console.log('770d',simp(x=>fp(x)/f(x)**2,3,4),-7);
console.log('772',simp(x=>2*x+Math.sin(x),0,Math.PI/2),Math.PI**2/4+1,simp(x=>2*x+Math.sin(x),0,Math.PI/4),Math.PI**2/16+1-Math.SQRT1_2);
console.log('773',simp(x=>2/x,1,4),simp(x=>Math.PI*4/x/x,1,4),3*Math.PI);
console.log('767 h6',0.75*36+30+12);
console.log('751',simp(x=>(x+2)/x,1,3),2+2*Math.log(3));
console.log('756',65/3.6+20);
