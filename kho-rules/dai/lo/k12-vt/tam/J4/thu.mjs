const add=(a,b)=>a.map((x,i)=>x+b[i]), sub=(a,b)=>a.map((x,i)=>x-b[i]), mul=(k,a)=>a.map(x=>k*x)
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0), len=a=>Math.sqrt(dot(a,a)), cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]
const P=(n,...x)=>console.log(n,JSON.stringify(x))
// 3.1.1
{const a=[2,-1,3],b=[1,4,-2];P('311a',add(a,b),sub(a,b),mul(3,a),sub(mul(2,a),mul(3,b)))
 const a2=[1,-2,3],b2=[2,0,-1],c2=[-4,6,2];P('311b',add(sub(mul(2,a2),mul(3,b2)),mul(.5,c2)),add(a2,sub(mul(2,b2),c2)))}
// 3.1.2
{P('312a',mul(-2,[1,-2,3]))
 const A=[1,2,-1],B=[3,1,2],C=[7,-1,8];P('312b',sub(B,A),sub(C,A));const AB=sub(B,A);P('M',add(A,mul(2,AB)),'cross',cross(AB,sub(C,A)))}
// 3.1.3
{const a=[1,-2,3],b=[2,0,-1],c=[-3,4,5];P('313a',sub(sub(mul(3,b),c),mul(2,a)))
 const a2=[1,2,0],b2=[0,1,-1],d2=[2,0,1];const c2=add(add(mul(2,a2),mul(-1,b2)),mul(3,d2));P('313b',c2)}
// 3.2.1
{const A=[2,-1,3],B=[5,2,-1];P('321a',sub(B,A),sub(A,B))
 const A2=[1,2,-3],B2=[0,4,1];P('321b',add(B2,[3,-2,5]),sub(A2,sub(B2,A2)),add(A2,mul(2,sub(B2,A2))))
 P('321a2',add(A2,[2,-3,4]),sub([2,4,-3],[-1,0,5]))}
// 3.2.2
{const A=[1,2,-3],B=[3,-4,1],C=[5,2,5];P('322',mul(.5,add(A,B)),mul(1/3,add(add(A,B),C)))
 const G=[1,-1,2],A2=[2,0,1],B2=[-1,3,4],C2=[3,-2,0];P('322b',sub(mul(4,G),add(add(A2,B2),C2)));P('322c',sub(mul(2,[1,-2,3]),[-1,0,5]))}
// 3.2.3
{const A=[1,0,2],B=[2,3,-1],C=[-1,4,5];const D=sub(add(A,C),B);P('323a',D,sub(B,A),sub(C,D),mul(.5,add(A,C)),cross(sub(B,A),sub(C,A)))
 const A2=[1,2,0],B2=[3,1,2],C2=[4,4,3];const D2=sub(add(A2,C2),B2);const Dp=[3,6,4];const DD=sub(Dp,D2);P('323b',D2,DD,add(A2,DD),add(B2,DD),add(C2,DD))}
// 3.2.4
{const A=[1,2,3],B=[4,-1,6];const AB=sub(B,A);P('324a',add(A,mul(2/3,AB)),sub(mul(2,B),A))
 const A2=[2,1,-1],B2=[5,-2,3];const AB2=sub(B2,A2);P('324b',AB2,add(A2,mul(1/3,AB2)),add(A2,mul(1/4,AB2)))}
// 3.3.1
{P('331',len([2,-3,6]),len(sub([4,6,11],[1,2,-1])))
 const A=[2,-1,3],B=[0,3,-1],C=[4,1,5];const M=mul(.5,add(B,C));P('331b',M,sub(M,A),len(sub(M,A)),len(sub([3,3,6],[1,-1,2])))}
// 3.3.2
{const A=[1,0,2],B=[3,3,8],C=[4,-6,4];P('332a',len(sub(B,A)),len(sub(C,A)),len(sub(C,B)),dot(sub(B,A),sub(C,A)))
 const A2=[1,2,-1],B2=[0,1,1],Cm=[-1,0,0];P("332b",len(sub(A2,B2)),len(sub(Cm,B2)),len(sub(Cm,A2)),dot(sub(A2,B2),sub(Cm,B2)))}
// 3.3.3
{const A=[1,2,2];P('333a',len(sub([0,0,0],A)),len(sub([2,0,0],A)))
 const A1=[1,2,3],B1=[-1,0,5],M=[0,-3,0];P('333b',len(sub(A1,M)),len(sub(B1,M)))
 const N=[2,1,0];P('333c',len(sub([2,1,3],N)),len(sub([2,4,0],N)),len(sub([5,1,0],N)))}
