const L = (f, x) => f(x)
const big = [1e6, 1e8], neg = [-1e6, -1e8]
const p = (t, v) => console.log(t.padEnd(44), v)
const ff = (f, xs) => xs.map((x) => +f(x).toPrecision(8))
// H4.1.1
p('1.1 VD1 (2x-1)/(x+3) ±inf', ff((x)=>(2*x-1)/(x+3), [1e7,-1e7]))
p('1.1 VD1 near -3', [(2*-3.001-1)/(-3.001+3),(2*-2.999-1)/(-2.999+3)])
p('1.1 VD2a (1-3x)/(2x+4) ±inf', ff((x)=>(1-3*x)/(2*x+4), [1e7,-1e7]))
p('1.1 VD2a near -2', [(1+3*1.999)/(2*-1.999+4),(1+3*2.001)/(2*-2.001+4)])
p('1.1 VD2b (-2x+5)/(3-x)', ff((x)=>(-2*x+5)/(3-x), [1e7,-1e7]))
p('1.1 VD2b near 3', [(-2*3.001+5)/(3-3.001),(-2*2.999+5)/(3-2.999)])
// 1.2
const a=(x)=>(x*x-3*x+2)/(x*x-1)
p('1.2 VD1 near1 (-.5)', [a(1.00001),a(0.99999)]); p('near -1',[a(-0.99999),a(-1.00001)]); p('±inf',ff(a,[1e7,-1e7]))
const b=(x)=>(x*x-4)/(x**3-x*x-4*x+4)
p('1.2 VD2a near 2,-2,1', [b(2.00001),b(-2.00001),b(1.00001),b(0.99999)]); p('±inf',ff(b,[1e7,-1e7]))
const c=(x)=>(x+1)/(x**3-3*x+2)
p('1.2 VD2b near 1,-2', [c(1.001),c(0.999),c(-1.999),c(-2.001)]); p('±inf',ff(c,[1e7,-1e7]))
// 1.3
const d=(x)=>(3*x+1)/Math.sqrt(x*x+2); p('1.3 VD1',ff(d,[1e7,-1e7]))
const e=(x)=>Math.sqrt(x*x+3*x)-x; p('1.3 VD2a +inf',ff(e,[1e5,1e7])); p('-inf',ff(e,[-1e5,-1e7]))
const g=(x)=>(Math.abs(x)+1)/(x-1); p('1.3 VD2b',ff(g,[1e7,-1e7])); p('near1',[g(1.0001),g(0.9999)])
// 2.1
const h=(x)=>(2*x*x+3*x-1)/(x-1); p('2.1 VD1 f-(2x+5)',ff((x)=>h(x)-(2*x+5),[1e6,-1e6]))
const i=(x)=>(x*x+x-3)/(2*x-4); p('2.1 VD2 f-(x/2+3/2)',ff((x)=>i(x)-(x/2+1.5),[1e6,-1e6]))
// 2.2
p('2.2 VD2a rem',ff((x)=>(2*x-1)/(x*x+1),[1e6,-1e6]))
p('2.2 VD2b f-(2x+2)',ff((x)=>2*x+1+(x+3)/(x-1)-(2*x+2),[1e6,-1e6]))
// 2.3
const j=(x)=>Math.sqrt(x*x+4*x)
p('2.3 VD1 +: f/x, f-x',[j(1e7)/1e7, j(1e7)-1e7]); p('2.3 VD1 -: f/x, f+x',[j(-1e7)/-1e7, j(-1e7)+1e7])
const k=(x)=>Math.sqrt(x*x-2*x)+2*x
p('2.3 VD2 +: f/x, f-3x',[k(1e7)/1e7, k(1e7)-3e7]); p('2.3 VD2 -: f/x, f-x',[k(-1e7)/-1e7, k(-1e7)+1e7])
// 3.1
const m=(x)=>(2*x-1)/(x-1); p('3.1 VD1',ff(m,[1e6,-1e6])); p('pts',[m(0),m(2),m(-1),m(3)])
const n=(x)=>(x*x-x-1)/(x-1); p('3.1 VD2 f-x',ff((x)=>n(x)-x,[1e6,-1e6])); p('pts',[n(0),n(2),n(3),n(-1)])
// 3.4
const fv=(x)=>x**3-3*x+1
p('3.4 VD1 f(-1),f(1)',[fv(-1),fv(1)])
console.log('3.4 g=1/(f-2) f=2 roots count in grid:'); let cnt=0; for(let x=-4;x<4;x+=1e-4){ if((fv(x)-2)*(fv(x+1e-4)-2)<0)cnt++ } console.log(cnt)
