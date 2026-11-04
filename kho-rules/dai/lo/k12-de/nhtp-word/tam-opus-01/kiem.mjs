const S=(f,a,b,n=200000)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=f(a+i*h)*(i%2?4:2);return s*h/3};
const P=Math.PI,ab=Math.abs;
const f2=x=>x**3-3*x-4,g2=x=>x-4;
console.log('W2c',S(x=>ab(f2(x)-g2(x)),-2,2),'W2d V/pi',S(x=>ab(f2(x)**2-g2(x)**2),-2,2));
// W15 a=1
const h=Math.sqrt(3)/2;console.log('W15',S(x=>{const ax=ab(x);const lo=ax<=0.5?0:h*(ax-0.5)/0.5;return P*(h*h-lo*lo)},-1,1));
console.log('W19b',S(x=>P*(x*x-2*x)**2,0,1),8*P/15,'W19d',S(x=>P*16*(1-x*x/25),-5,5),320*P/3);
console.log('W21',S(x=>3*x*(3*x*x-2),1,3),'W24',S(x=>x**3+3*x*x-4,0,1));
console.log('W36',S(x=>x<1?x*x+2:2*x+1,-1,1)+S(x=>2*x+1,1,2),5/3+4+3);
console.log('W39c',S(x=>ab(3*x*x+x),-3,-1),'W39d/pi',S(x=>(3*x*x+x)**2,1,2));
console.log('W45',S(Math.sin,0,P/4),(2-Math.sqrt(2))/2,'W49',S(Math.cos,0,P/4));
console.log('W50',S(x=>ab(4-x*x),0,3),23/3,'W46',S(x=>x**3+3*x+2,-1,1));
console.log('W57a',S(x=>ab((2*x-3)/(x+1)-(x-3)),0,4),12-5*Math.log(5),'W57b',S(x=>ab((2*x-3)/(x+1)),0,1.5),-3+5*Math.log(2.5));
console.log('W12',S(x=>(x+2)/x,1,3),2+2*Math.log(3),'W26',S(x=>P*Math.exp(2*x),0,1),P*(Math.E**2-1)/2);
console.log('W28',S(x=>P*(2+Math.cos(x)),0,P/2),P*(P+1),'W30',S(x=>P*(2+Math.sin(x)),0,P),2*P*(P+1));
console.log('W6 |v|',S(t=>ab(1-2*Math.sin(2*t)),0,3*P/4),'v',S(t=>1-2*Math.sin(2*t),0,3*P/4));
