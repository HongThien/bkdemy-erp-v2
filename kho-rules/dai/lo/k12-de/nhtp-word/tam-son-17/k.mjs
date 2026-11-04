// W0972 d
const A=[320,148,45],v=[-4,-1.5,-0.5];
const P=s=>A.map((a,i)=>a+s*v[i]); const n=p=>Math.hypot(...p);
console.log('|A|',n(A),'|B|',n([280,133,40]));
let a=18.5,b=2*(A[0]*v[0]+A[1]*v[1]+A[2]*v[2]),c=n(A)**2-160000;
const d=Math.sqrt(b*b-4*a*c);console.log((-b-d)/(2*a),(-b+d)/(2*a),P((-b-d)/(2*a)));
// W0998
let L=0;const N=1e6;for(let i=0;i<N;i++){const T=(i+.5)*5/N;L+=60*((7000+3000*T)/25000)**2*5/N;}L*=2;
console.log(L, 1e6/L*10/24/365);
// W0976
console.log((6-2)*60);
// W0975
const aa=-0.5,bb=25;console.log(50*aa+10*bb, bb+18*aa, (bb+18*aa)*3.6);
// W0987,0990 durations
console.log(Math.sqrt(6)*10/80*60, 14/3*10/90*60);
// W0969,0997
let V=0;for(let i=0;i<N;i++){const x=1+(i+.5)*4/N;V+=(x-1)*4/N}console.log(V/8);
