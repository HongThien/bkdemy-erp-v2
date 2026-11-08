const S=(f,a,b,n=20000)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=(i%2?4:2)*f(a+i*h);return s*h/3};
console.log('W0182',S(x=>(x*x-1)/x,1,2),1.5-Math.log(2));
console.log('W0184',S(x=>(-x*x+2*x)**2,-1,3),92/15);
console.log('W0188',S(x=>Math.abs(x*x-3*x+2),-1,2),29/6);
console.log('W0193',S(x=>6*x*x+Math.sqrt(x),1,2),(40+4*Math.SQRT2)/3);
console.log('W0219',S(x=>4*Math.sin(x),0,Math.PI/4));
console.log('W0206d',S(x=>x*x+2,-2,3),63/5);
console.log('W0209',S(x=>2**x+x*x,1,2),2/Math.log(2)+7/3);
console.log('W0222',S(x=>Math.abs(x*x-1),0,1));
// W0194d: G(x)=x^2/2+2x-5ln|x|+C
{const P=x=>x*x/2+2*x-5*Math.log(Math.abs(x));const C1=4-P(1);const C2=20-P(3)-C1-P(-9);console.log('W0194d',P(-6)+C2,-5*Math.log(2)+10*Math.log(3)-8.5)}
{const P=x=>x*x/2+5*x-7*Math.log(Math.abs(x));const C1=4-P(1);const C2=20-P(3)-C1-P(-9);console.log('W0201d',P(-6)+C2,-7*Math.log(2)+14*Math.log(3)-5.5)}
