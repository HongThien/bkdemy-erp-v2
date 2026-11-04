const simp=(f,a,b,n=20000)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=f(a+i*h)*(i%2?4:2);return s*h/3};
const P=Math.PI;
const y1=x=>x**3-3*x-4,y2=x=>x-4;
console.log('2 S',simp(x=>Math.abs(y1(x)-y2(x)),-2,2),'V/pi',simp(x=>Math.abs(y1(x)**2-y2(x)**2),-2,2), 'vs64');
// 15: trapezoid a=1
const a=1,h=Math.sqrt(3)/2;
const V=simp(x=>{const inner = x<0? -2*h*x/a : (x>a? 2*h*(x-a)/a:0); // inner radius
 const lo=-a/2; const hi=1.5*a; return P*(h*h-inner*inner)},-a/2,1.5*a);
console.log('15',V/ a**3, 5*P/4);
console.log('19B',simp(x=>(x*x-2*x)**2,0,1),8/15);
console.log('21',simp(x=>3*x*(3*x*x-2),1,3));
console.log('26',P*simp(x=>Math.exp(2*x),0,1),P*(Math.E**2-1)/2);
console.log('28',P*simp(x=>2+Math.cos(x),0,P/2),(P+1)*P);
console.log('39C',simp(x=>3*x*x+x,-3,-1),'39D/pi',simp(x=>(3*x*x+x)**2,1,2),17/2);
console.log('50',simp(x=>Math.abs(4-x*x),0,3),23/3);
console.log('57A',simp(x=>Math.abs((2*x-3)/(x+1)-(x-3)),0,4),12-5*Math.log(5));
console.log('57B',simp(x=>Math.abs((2*x-3)/(x+1)),0,1.5),5*Math.log(2.5)-3);
console.log('36',simp(x=>x<1?x*x+2:2*x+1,-1,2),26/3);
console.log('12',simp(x=>(x+2)/x,1,3),2+2*Math.log(3));
console.log('45',simp(Math.sin,0,P/4),(2-Math.sqrt(2))/2,'49',simp(Math.cos,0,P/4),Math.sqrt(2)/2);
console.log('6 sign changes', simp(x=>Math.abs(1-2*Math.sin(2*x)),0,3*P/4), simp(x=>1-2*Math.sin(2*x),0,3*P/4));
console.log('4',simp(x=>x,0,1)); 
