const ok=(c,t)=>console.log((c?'OK  ':'FAIL ')+t)
const near=(a,b)=>Math.abs(a-b)<1e-6
const d=(f,x)=>(f(x+1e-5)-f(x-1e-5))/2e-5
// đếm nghiệm f(x)=m trên [a,b] bằng đổi dấu (lưới mịn), bỏ cực điểm
function dem(f,m,a,b,gap=[]){let n=0,N=200000,pv=null;for(let i=0;i<=N;i++){const x=a+(b-a)*i/N;if(gap.some(g=>Math.abs(x-g)<2e-3)){pv=null;continue}const v=f(x)-m;if(Math.abs(v)<1e-9){n++;pv=null;continue}if(pv!==null&&pv*v<0)n++;pv=v}return n}
// 5.3.1
let f=x=>x**3-6*x**2+9*x+1
ok(near(d(f,1),0)&&near(d(f,3),0)&&f(0)==1&&f(1)==5&&f(3)==1,'531 vd1')
f=x=>-(x**3)-3*x**2+2
ok(near(d(f,0),0)&&near(d(f,-2),0)&&f(0)==2&&f(-2)==-2,'531 vd2')
// 5.3.2
f=x=>(2*x-4)/(x-1); ok(f(0)==4&&f(2)==0&&Math.abs(f(1e6)-2)<1e-4,'532 vd1')
f=x=>(-2*x+2)/(x+1); ok(f(0)==2&&f(1)==0&&Math.abs(f(1e6)+2)<1e-4,'532 vd2')
// 5.3.3
f=x=>(x**2+3)/(x-1); ok(f(0)==-3&&f(3)==6&&f(-1)==-2&&near(d(f,3),0)&&near(d(f,-1),0)&&Math.abs(f(1e6)-(1e6+1))<1e-3,'533 vd1')
f=x=>(2*x**2-3*x)/(x-2); ok(f(0)==0&&f(1)==1&&f(3)==9&&near(d(f,1),0)&&near(d(f,3),0)&&Math.abs(f(1e6)-(2e6+1))<1e-2,'533 vd2')
// 5.3.4
f=x=>x**3-6*x**2+9*x+1; ok(f(1)==5&&f(3)==1&&near(d(f,1),0)&&near(d(f,3),0),'534 vd1')
f=x=>(x**2+3)/(x-1); ok(f(3)==6&&near(d(f,3),0)&&d(f,2.9)<0&&d(f,3.1)>0,'534 vd2')
// 5.4.1
f=x=>-(x**3)+3*x**2-2; ok(near(d(f,0),0)&&near(d(f,2),0)&&f(0)==-2&&f(2)==2&&dem(f,0,-5,5)==3&&f(1)==0,'541 vd1')
f=x=>(x+2)/(x-1); ok(f(0)==-2&&f(-2)==0&&d(f,3)<0&&d(f,-3)<0,'541 vd2')
// 5.4.2
f=x=>-(x**3)+3*x; console.log('m=1:',dem(f,1,-5,5),'m=-2:',dem(f,-2,-5,5),'m=3:',dem(f,3,-5,5),'m=2:',dem(f,2,-5,5),'m=0.5',dem(f,0.5,-5,5))
// BBT: cực đại 4 tại 0, cực tiểu 0 tại 2: g=x^3? tương đương g(x)=x^3-3x^2... dựng g: g'=3x(x-2), g(0)=4,g(2)=0 -> x^3-3x^2+4
f=x=>x**3-3*x**2+4; console.log('f=0:',dem(f,0,-9,9),'f=4:',dem(f,4,-9,9),'f=2.5:',dem(f,2.5,-9,9),'f=1:',dem(f,1,-9,9),'f=-1:',dem(f,-1,-9,9),'f=-5',dem(f,-5,-9,9))
let cnt=dem(x=>Math.abs(f(x)),1,-9,9); console.log('|f|=1',cnt)
// 5.4.3
f=x=>x**3-3*x**2+4*x-2; ok(f(1)==0&&[0.3,1.7,2,5].every(t=>near(f(1+t)+f(1-t),0)),'543 vd1 tâm (1;0)')
ok(f(0)==-2&&f(2)==2,'  A(0;-2)->B(2;2)')
f=x=>(2*x+1)/(x-1); ok(f(2)==5&&f(0)==-1&&[0.5,2,3,7].every(t=>near(f(1+t)+f(1-t),4)),'543 vd2 tâm (1;2)')
// 6.1.1 vd1: (x^3-3x^2+2)=m(x-1)
f=x=>x**3-3*x**2+2
for(const m of [-5,-3,-2,0,4]){console.log('vd1 m=',m,'giao điểm',dem(x=>f(x)-m*(x-1),0,-20,20))}
// vd2: x^3-3x=m trên [0,3]
f=x=>x**3-3*x
for(const m of [-2.5,-2,-1.5,-0.5,0,0.5,3]){console.log('vd2 m=',m,'nghiệm trong [0,3]',dem(f,m,0,3))}
// 6.1.2 vd1
f=x=>x**3-3*x**2+2*x
{const m=1;console.log('vd1 pt: ',dem(x=>f(x)-m*x,0,-20,20)); const r=[(3+Math.sqrt(5))/2,(3-Math.sqrt(5))/2];console.log('sum sq',r[0]**2+r[1]**2)}
{for(let m=-3;m<=5;m+=0.5){const D=1+4*m;if(D>0&&m!=2){const s=9-2*(2-m);if(near(s,7))console.log('m thoả',m)}}}
// vd2 CSN
f=x=>x**3-7*x**2+14*x-8; console.log('roots',[1,2,4].map(f)); let found=[]
for(let m=-50;m<=50;m+=0.5){const g=x=>x**3-7*x**2+m*x-8;const r=[];const N=400000;let pv=g(-30);for(let i=1;i<=N;i++){const x=-30+60*i/N,v=g(x);if(pv*v<0)r.push(x);pv=v}if(r.length==3){const[a,b,c]=r;if(Math.abs(b*b-a*c)<1e-3)found.push(m)}}
console.log('CSN m=',found)
// vd2 csc 
// 6.1.3 vd1: (2x-1)/(x+1)=x+m
for(let m=-10;m<=10;m++){const D=m*m-6*m-3;if(D>0){const AB=Math.sqrt(2*D);if(near(AB,2*Math.sqrt(2)))console.log('AB=2√2 m=',m,'x=-1 root?',1-(m-1)+m+1)}}
for(let m=-10;m<=10;m++){const D=m*m-6*m-3;if(D>0){const xg=(1-m)/3,yg=(1+m)/3;if(near(2*xg+yg,2))console.log('G m=',m,'D=',D)}}
// kiểm trực tiếp A,B với m=-3
{const m=-3;const D=m*m-6*m-3;const x1=((1-m)+Math.sqrt(D))/2,x2=((1-m)-Math.sqrt(D))/2;const g=x=>(2*x-1)/(x+1);console.log(near(g(x1),x1+m),near(g(x2),x2+m),'G',(x1+x2)/3,(2*(x1+x2)+2*m)/3/2)
 const xg=(x1+x2)/3,yg=(x1+m+x2+m)/3;console.log('2xg+yg',2*xg+yg)}
{const m=7;const D=m*m-6*m-3;const x1=((1-m)+Math.sqrt(D))/2,x2=((1-m)-Math.sqrt(D))/2;console.log('AB m=7',Math.hypot(x1-x2,x1-x2), 2*Math.SQRT2, x1,x2)}
