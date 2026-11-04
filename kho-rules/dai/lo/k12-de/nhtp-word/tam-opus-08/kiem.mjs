const S=(f,a,b,n=20000)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=f(a+i*h)*(i%2?4:2);return s*h/3};
console.log('W0427',S(x=>(x*Math.exp(x)+3*x**3-2026)/x,1,2), Math.E**2-Math.E+7-2026*Math.LN2);
console.log('W0426d',S(x=>(3*x+2)/x,1,3), 6+Math.log(9));
console.log('W0471a',S(x=>-3/x**3,1,2));
console.log('W0473',S(x=>4/Math.cos(x)**2,0,Math.PI/4));
console.log('W0460',2026+Math.E);
console.log('W0447',S(x=>3/x,1,2),3*Math.LN2);
