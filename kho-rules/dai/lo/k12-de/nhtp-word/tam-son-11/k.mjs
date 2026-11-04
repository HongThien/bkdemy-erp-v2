const S=(f,a,b,n=200000)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=f(a+i*h)*(i%2?4:2);return s*h/3};
console.log('601',S(x=>Math.sqrt(3)*(1-x*x),-1,1));
console.log('606',S(x=>3*x*(3*x*x-2),1,3));
console.log('622b',Math.PI*S(x=>(2*x**3-1)**2,0,1),4*Math.PI/7,'622c',S(x=>2*x**3-1,-2,2));
console.log('643b',S(x=>2*x+5*Math.cos(x)+5,0,Math.PI),Math.PI**2+5*Math.PI);
console.log('628',S(x=>Math.abs(x*x-x),-1,2),11/6);
console.log('660',S(x=>3/x,1,Math.exp(-3)),S(x=>3/x,1/Math.E,Math.E**3),Math.PI*S(x=>9/x/x,1,5),36*Math.PI/5);
console.log('657',(Math.sqrt(3)**3-2*Math.sqrt(3)+4)-(25),Math.sqrt(3)-21);
console.log('604b',S(x=>2*x+Math.sqrt(x),1,4),59/3);
