import { veHinh } from './ve.mjs'
import { writeFileSync } from 'node:fs'
const cac = [
 {loai:'dothi',x:[-3,3],y:[-4,4],f:[{e:'x^3-3*x',ten:'y=f(x)'}],diem:[{x:-1,y:2,nhan:'CĐ'},{x:1,y:-2,nhan:'CT'}]},
 {loai:'dothi',x:[-3,5],y:[-4,6],f:[{e:'(2*x+1)/(x-1)',x:[-3,5],ten:'(C)'}],duong:[{dung:1,ten:'x=1'},{ngang:2,ten:'y=2'}]},
 {loai:'dothi',x:[-5,5],y:[-6,8],f:[{e:'(x^2+x+1)/(x-1)'}],duong:[{dung:1,ten:'x=1'},{xien:[1,2],ten:'y=x+2'}]},
 {loai:'bbt',x:['-∞','-1','1','+∞'],dau:['+','-','+'],y:['-∞','3','-1','+∞']},
 {loai:'bbt',x:['-∞','1','+∞'],dau:['-','-'],kd:{1:'||'},y:['2',['-∞','+∞'],'2']},
 {loai:'bbt',x:['-∞','0','2','+∞'],dau:['-','+','-'],y:['+∞','1','5','-∞']},
 {loai:'bbt',x:['-∞','-2','1','+∞'],hang:'dau',dau:['+','-','-'],ten_dao:"f'(x)"},
]
let h='<body style="font-family:sans-serif;background:#fff;color:#111"><h3>Thử vẽ</h3>'
for(const c of cac){ try{h+=`<div style="margin:12px 0;border:1px solid #ddd;padding:8px;display:inline-block">${veHinh(c)}</div> `}catch(e){h+=`<p style=color:red>${e.message}</p>`} }
writeFileSync('_thu-ve.html',h); console.log('ok')
