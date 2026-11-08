// Dựng hàm cụ thể khớp BBT rồi đếm nghiệm mẫu của g và giới hạn g ở ±∞
const roots=(h,a,b,st=1e-3)=>{const r=[];for(let x=a;x<b;x+=st){const u=h(x),v=h(x+st);if(u===0||u*v<0)r.push(+x.toFixed(3))}return r}
const mono=(f,a,b,s)=>{for(let x=a+0.01;x<b-0.01;x+=1e-3)if(s*(f(x+1e-3)-f(x))<=0)return false;return true}
// VD1: BBT -inf ↗ 3 (x=-1) ↘ -1 (x=1) ↗ +inf ; f=x^3-3x+1
let f=x=>x**3-3*x+1
console.log('VD1 f(-1),f(1)',f(-1),f(1),'mono',mono(f,-50,-1,1),mono(f,-1,1,-1),mono(f,1,50,1))
let g=x=>1/(f(x)-2); console.log('VD1 nghiem f=2:',roots(x=>f(x)-2,-50,50),' g(±1e6)',g(1e6),g(-1e6))
// VD2: BBT 1 ↘ -2 (x=0) ↗ 4 (x=2) ↘ 0
f=x=> x<=0 ? 1-3/(1+x*x) : x<=2 ? (t=>-2+6*(3*t*t-2*t**3))(x/2) : 4/(1+(x-2)**2)
console.log('VD2 f(-1e6),f(0),f(2),f(1e6)',f(-1e6),f(0),f(2),f(1e6),'mono',mono(f,-200,0,-1),mono(f,0,2,1),mono(f,2,200,-1))
g=x=>1/(2*f(x)-3)
console.log('VD2 nghiem 2f-3=0:',roots(x=>2*f(x)-3,-200,200),' g(-1e6)',g(-1e6),' g(1e6)',g(1e6))
// thêm: dải k cho nghiệm, để chắc đếm không phụ thuộc hàm cụ thể -> đổi hàm khác cùng BBT
f=x=> x<=0 ? 1-3*Math.exp(x) : x<=2 ? -2+1.5*(3*x*x-x**3) : 4*Math.exp(-(x-2)) 
console.log('VD2 hàm khác: f(0),f(2)',f(0),f(2),'mono',mono(f,-200,0,-1),mono(f,0,2,1),mono(f,2,200,-1),'nghiem',roots(x=>2*f(x)-3,-200,200),'g±',1/(2*f(-1e3)-3),1/(2*f(1e3)-3))
