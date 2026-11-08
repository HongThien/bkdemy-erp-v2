const simp=(f,a,b,n=20000)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=f(a+i*h)*(i%2?4:2);return s*h/3};
console.log('427',simp(x=>(x*Math.exp(x)+3*x**3-2026)/x,1,2), Math.E**2-Math.E+7-2026*Math.LN2);
console.log('460',1+Math.E+2025);
console.log('473',simp(x=>Math.PI*4/Math.cos(x)**2,0,Math.PI/4)/Math.PI);
console.log('426a-d',simp(x=>3*x+2,1,4),simp(x=>3*x+2,0,1)*2,simp(x=>(3*x+2)/x,1,3),6+Math.log(9));
console.log('471a',simp(x=>-3/x**3,1,2),-9/8);
console.log('461K',1+simp(x=>2*x,-1,2));
console.log('468d',Math.E-4);
