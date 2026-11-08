const scan=(f,a,b,n=200000)=>{let M=-Infinity,m=Infinity,xM,xm;for(let i=0;i<=n;i++){const x=a+(b-a)*i/n,y=f(x);if(!Number.isFinite(y))continue;if(y>M){M=y;xM=x}if(y<m){m=y;xm=x}}return{M,m,xM,xm}}
const P=(t,r)=>console.log(t,JSON.stringify(r))
// 3.1.1
P('111a',scan(x=>x**3-3*x+1,-2,1));P('111b',scan(x=>-(x**4)+2*x*x+1,-1,2))
// 3.1.3 ex1: f'=-(x-2)(x+1)=-x^2+x+2 ; f(x)=-x^3/3+x^2/2+2x ; check cond impossible to realize generic: test with f from integral + const
{const f=x=>-(x**3)/3+x*x/2+2*x;P('113a vals',[0,1,2,3,4].map(f));
 // condition f0+f1-2f2 = f4-f3 : for actual f?
 console.log(f(0)+f(1)-2*f(2),f(4)-f(3))}
// 3.2.1
P('211a',scan(x=>x**3-3*x*x-9*x+5,-2,4));P('211b',scan(x=>x**4-4*x*x+3,-1,3))
P('212a',scan(x=>(2*x+1)/(x-1),2,4));P('212b',scan(x=>(x*x-3*x+6)/(x-1),2,6))
P('213a',scan(x=>x+Math.sqrt(4-x*x),-2,2),2*Math.SQRT2);P('213b',scan(x=>Math.sqrt(x+3)+Math.sqrt(6-x),-3,6),3*Math.SQRT2)
P('214a',scan(x=>x-2*Math.sin(x),0,Math.PI),[Math.PI,Math.PI/3-Math.sqrt(3)]);P('214b',scan(x=>x*x-2*Math.log(x),1/Math.E,Math.E),[Math.E**2-2])
P('215a',scan(x=>x+4/x,0.0001,1000))
// 3.3.1
for(const m of [-3,-1,0,1,5,5.0]){}
P('331a m=5',scan(x=>(x+5)/(x-1),2,4))
for(let m=-10;m<=10;m+=0.5){const r=scan(x=>(x+m)/(x-1),2,4,2000);if(Math.abs(r.m-3)<1e-6)console.log('331a m',m)}
for(let m=-10;m<=10;m+=0.25){const r=scan(x=>x**3-3*x+m,0,2,4000);if(Math.abs(r.M-3*r.m)<1e-6)console.log('331b m',m,r.M,r.m)}
// 3.3.2
for(let m=-10;m<=10;m+=0.5){const r=scan(x=>Math.abs(x**3-3*x+m),0,2,4000);if(Math.abs(r.M-3)<1e-6)console.log('332a m',m)}
{let best=1e9,bm;for(let m=-10;m<=10;m+=0.01){const r=scan(x=>Math.abs(x*x-4*x+m),-1,3,2000);if(r.M<best){best=r.M;bm=m}}console.log('332b',bm,best)}
// 3.3.3
P('333a',scan(x=>x**3-3*x*x-9*x,-2,4));
P('333b',scan(x=>Math.sqrt(x-1)+Math.sqrt(5-x),1,5))
P('333c',scan(x=>x+4/(x-1),1.00001,1000))
// 3.4.1
// 3.4.2
P('342a',scan(x=>4*x*x-x**3,0,4),256/27)
{let M=-1e9,m=1e9;for(let i=0;i<=400000;i++){const th=2*Math.PI*i/400000,r=Math.SQRT2,x=r*Math.cos(th),y=r*Math.sin(th),p=x+y+x*y;M=Math.max(M,p);m=Math.min(m,p)}console.log('342b',M,m)}
