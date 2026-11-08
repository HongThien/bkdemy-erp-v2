// f' = (x-2)(x^2+c)  ;  f = x^4/4 -2x^3/3 + c x^2/2 - 2c x
const F=c=>x=>x**4/4-2*x**3/3+c*x*x/2-2*c*x
for(let c=0;c<=10;c+=0.25){const f=F(c);const t=f(0)+f(2)-f(1)-f(3);console.log(c,t.toFixed(3))}
