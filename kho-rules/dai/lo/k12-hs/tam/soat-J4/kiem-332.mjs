// Kiểm công thức max/min |f+m| (lý thuyết H3.3.2) bằng quét mịn, sai số theo lưới
const scan=(f,a,b,N)=>{let mx=-Infinity,mn=Infinity;for(let i=0;i<=N;i++){const y=f(a+(b-a)*i/N);if(y>mx)mx=y;if(y<mn)mn=y}return{mx,mn}}
for (const [f,a,b,K,k] of [[x=>x**3-3*x,0,2,2,-2],[x=>x*x-4*x,-1,3,5,-4]]) {
  let worstMax=0,worstMin=0
  for (let i=-800;i<=800;i++){const m=i/40;const s=scan(x=>Math.abs(f(x)+m),a,b,200000)
    const mxF=m>=-(K+k)/2?m+K:-(m+k), mnF=m>=-k?m+k:m<=-K?-(m+K):0
    worstMax=Math.max(worstMax,Math.abs(s.mx-mxF)); worstMin=Math.max(worstMin,Math.abs(s.mn-mnF))}
  console.log(`K=${K},k=${k}: lệch lớn nhất max ${worstMax.toExponential(2)}, min ${worstMin.toExponential(2)}`)
}
