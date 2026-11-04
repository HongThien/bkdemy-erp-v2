const simp=(f,a,b,n=20000)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=f(a+i*h)*(i%2?4:2);return s*h/3};
console.log('W0535',Math.PI*simp(x=>Math.exp(x)+1,0,2));
console.log('W0500',Math.PI*simp(x=>4*x,0,1));
console.log('W0485',simp(x=>9/Math.sin(x)**2,Math.PI/4,Math.PI/2)); 
console.log('W0519',simp(x=>Math.cbrt(x),1,8),45/4);
console.log('W0516c',simp(x=>3*x+1-2/x,1,2),5.5-2*Math.log(2));
// 516d
const Fp=x=>1.5*x*x+x-2*Math.log(Math.abs(x));
const C1=1-Fp(2);const C2=10-Fp(5)-C1-Fp(-5);const G=Fp(-10)+C2;
console.log('516d',G, -4*Math.log(2)+2*Math.log(5)+82);
console.log('W0531d',simp(x=>2*x+1,-0.5,0));
console.log('W0504',simp(x=>x**3+2*x,1,3));
console.log('W0528c',simp(x=>2*x,-1,0)+simp(x=>2*(x-x*x),0,1));
console.log('W0528d',simp(x=>2*x,-1,0), simp(x=>(x-x*x),0,2));
console.log('W0533c',simp(x=>2*(x-x*x),-2,0)+simp(x=>2*x,0,2));
console.log('W0497',simp(x=>x-2,1,2)+simp(x=>x*x-2*x,2,3));
console.log('W0501');
console.log('W0520',simp(x=>8**x,0,1),7/(3*Math.log(2)));
