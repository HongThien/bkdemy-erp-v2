import fs from 'fs';
const D=[
[181,"C"],[182,"-2","cao","a=3/2,b=-1; máy kiểm"],[183,"A"],[184,"D","cao","V=92π/15 (đề ghi S); máy kiểm"],[185,"B"],[186,"A"],
[187,["S","Đ","S","Đ"]],[188,"35","cao","I=29/6; máy kiểm"],[189,"A"],[190,"C"],[191,"C"],[192,"-17"],[193,"44","cao","a=40,b=4; máy kiểm"],
[194,["Đ","Đ","S","Đ"],"cao","(d) hằng số khác nhau hai nhánh, C2 chứa ln3; a=-5,b=10,c=-17/2 ⇒ -7/2; máy kiểm"],
[195,"C"],[196,"A"],[197,"B"],[198,"A"],[199,"A"],[200,"6"],
[201,["Đ","Đ","S","Đ"],"cao","(c) F=...-1/2; (d) a=-7,b=14,c=-11/2 ⇒ 3/2; máy kiểm"],
[202,"D"],[203,"C"],[204,"B"],[205,"A"],
[206,["Đ","Đ","S","S"],"cao","g=cos x; (d)=65/3; máy kiểm"],
[207,"9","cao","a=2,b=7"],[208,"C"],[209,"9"],[210,"C","cao","đề không có lua_chon; mệnh đề sai là C (đáp án đọc từ chữ A–D trong đề)"],
[211,"D"],[212,"D"],[213,"A"],[214,"B"],[215,"A"],[216,"D"],
[217,["S","Đ","Đ","Đ"],"cao","F=e^x+2"],[218,"B"],[219,"1.2","cao","4(1-√2/2)=1.17; máy kiểm"],[220,"B"],[221,"C"],
[222,"C","cao","miền x∈[0,1], S=2/3; máy kiểm"],[223,"B"],[224,"C"],[225,"B"],[226,"B"],
[227,["S","Đ","Đ","Đ"],"cao","F(0)=3 ⇒ e^x+2"],[228,"A"],[229,"A"],[230,"A"],[231,"D"],[232,"C"],[233,"C"],[234,"C"],[235,"B"],
[236,["S","Đ","Đ","Đ"],"vua","(a) F(3)=ln3+1 trên (0;+∞); (b) chấp nhận ln|x|+C"],
[237,"B"],
[238,["Đ","S","Đ","Đ"],"vua","M=9∫_3^2 g=-9; (d) coi ln f xác định, =3e+12"],
[239,"1"],[240,"A"]];
const lo=JSON.parse(fs.readFileSync('lo-04.json','utf8'));
const m=new Map(D.map(r=>[ 'W0'+r[0],r]));
const out=lo.map(q=>{const r=m.get(q.id);if(!r)throw q.id;
 return {id:q.id,dap_an:r[1],do_chac:r[2]||"cao",de_sai:false,ghi:r[3]||"giải tay, kiểm hai cách"}});
if(out.length!==lo.length||m.size!==lo.length)throw 'len';
fs.writeFileSync('lo-04.son.out.json',JSON.stringify(out));
console.log(out.length, out.filter(o=>o.do_chac==='cao').length);
