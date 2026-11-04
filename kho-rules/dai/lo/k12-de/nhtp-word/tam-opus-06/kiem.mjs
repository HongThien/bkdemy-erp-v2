const S=(f,a,b,n=20000)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=(i%2?4:2)*f(a+i*h);return s*h/3};
const P=Math.PI;
console.log('302',S(x=>x,1,2)*P/P,'=1.5 ->3pi/2');
console.log('304b',S(x=>2*Math.cos(x),0,P/2),'d: sin a=2/3 a=',Math.asin(2/3));
console.log('307d',S(t=>6+t*t,0,6));
console.log('309',S(t=>12+t/2-t*t,0,6)/6);
console.log('314',S(x=>1/(3*x-2),1,2),2/3*Math.log(2));
console.log('316',S(x=>(x*x-2*x)**2,0,1),8/15);
console.log('319',S(t=>28+2*(t-7),6,12)/6);
console.log('321',S(x=>(x**3/3-x*x)**2,0,3),81/35);
console.log('330c',S(x=>(6-2*x)-(2*x*x-4*x+2),-1,2));
console.log('334',S(x=>(4-3*x)/(x+3),0,4/3));
console.log('338',S(x=>Math.sqrt(3)/4*(x*x*(8-x*x)),0,1),37*Math.sqrt(3)/60);
console.log('340',S(x=>9*x+7,2,7),475/2);
console.log('341',S(t=>16-4*t,0,4));
console.log('343',S(x=>(x+2)/x,1,3),2+Math.log(9));
console.log('350d',S(x=>(2*x+1)*(4*x**3+3*x*x),0,1));
console.log('352',S(x=>1/x,2,6),Math.log(3),S(x=>(1+1/x)**2,2,6),(13+6*Math.log(3))/3,S(x=>(1+1/x)**2-1,2,6),(1+12*Math.log(3))/3,S(x=>1+1/x,2,6),4+Math.log(3));
// 327d
const m=1.5,n=1.5; // solve
const A=[[-2024,2025],[-2025,2024]],B=[2026,2023];const det=A[0][0]*A[1][1]-A[0][1]*A[1][0];
const mm=(B[0]*A[1][1]-A[0][1]*B[1])/det,nn=(A[0][0]*B[1]-B[0]*A[1][0])/det;console.log('327d m,n',mm,nn,mm+nn);
