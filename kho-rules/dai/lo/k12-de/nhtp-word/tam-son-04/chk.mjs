const S=(f,a,b,n=200000)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=f(a+i*h)*(i%2?4:2);return s*h/3};
console.log('184',S(x=>Math.PI*(-x*x+2*x)**2,-1,3),92*Math.PI/15);
console.log('188',S(x=>Math.abs(x*x-3*x+2),-1,2),29/6);
console.log('182',S(x=>(x*x-1)/x,1,2),1.5-Math.log(2));
console.log('193',S(x=>6*x*x+Math.sqrt(x),1,2),(40+4*Math.SQRT2)/3);
console.log('206d',S(x=>x*x+2,-2,3),65/3);
console.log('219',S(x=>4*Math.sin(x),0,Math.PI/4));
console.log('222',S(x=>Math.abs(x*x-1),0,1));
// 194d
const g=(x,C)=>x*x/2+2*x-5*Math.log(Math.abs(x))+C;
const C1=3/2,C2=20-(g(3,0)+g(-9,0))-C1;console.log('194d',g(-6,C2)+0, -5*Math.log(6)-8.5, C2);
const h=(x,C)=>x*x/2+5*x-7*Math.log(Math.abs(x))+C;
const D1=4-h(1,0),D2=20-(h(3,D1)+h(-9,0));console.log('201d',h(-6,D2),-7*Math.log(6)-5.5);
