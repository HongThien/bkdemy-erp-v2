const simp=(f,a,b,n=20000)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=f(a+i*h)*(i%2?4:2);return s*h/3};
// 2: quay quanh AD, r(y)
const r=y=>y>=2?Math.sqrt(Math.max(0,4-(y-2)**2)):2+(y-2)**2;
console.log('2',Math.PI*simp(y=>r(y)**2,0,4));
console.log('7',simp(x=>Math.abs(x**3-3*x),-1,1));
console.log('29',simp(x=>Math.abs(x+2-x*x),-1,2));
console.log('43',simp(x=>Math.abs(x**3+x*x-2*x),-2,1));
console.log('59',simp(x=>Math.abs(x**3-4*x),0,3));
console.log('6d',Math.PI*simp(x=>x-x/4,0,4));
console.log('53c',simp(x=>Math.abs(x*x+1-2*x),0,2),2/3,'53d',Math.PI*simp(x=>4*x*x,1,2),28*Math.PI/3);
console.log('60',-Math.cos(Math.PI)+Math.PI**2+4);
console.log('58c',(()=>{const C=-2+28/3;const F=x=>x**3/3-x*x/2-5*x+C;return F(-2)})());
console.log('50c',(()=>{const F=x=>x**3/3+x*x/2+3*x;return [F(6),F(-6)]})());
console.log('54',(()=>{const F=x=>-(x**4)+2*x**3/3+3*x*x/2+4*x+2;return [F(2),16/3]})());
console.log('42',simp(x=>1+3*x*x,1,3),'33',1+2*(1-1/Math.E),3-2/Math.E,'48',Math.PI*4/3,simp(x=>Math.PI*(x*x+1),0,1));
