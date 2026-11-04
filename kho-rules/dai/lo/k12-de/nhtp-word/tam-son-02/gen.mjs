import fs from 'fs';
const lo=JSON.parse(fs.readFileSync('lo-02.json','utf8'));
const C='cao',V='vua';
const m={
W0061:['C',C,0,'sin x + C'],
W0062:[['S','Đ','S','Đ'],C,0,'Giao 0,3; S1=9/2; S(trục Ox)=125/6 nên c sai; tỉ số 27/6 sai'],
W0063:['A',C,0,'khớp nguồn'],
W0064:['A',C,0,''],
W0065:['A',C,0,''],
W0066:['A',C,0,'V=π∫x dx'],
W0067:['A',C,0,''],
W0068:['7.37',C,0,'k²=163/3, k≈7,3711; đã kiểm số'],
W0069:[['S','Đ','S','Đ'],C,0,'Nguyên hàm x³/3-4x; H là tam giác diện tích 2; giao x=-3,2'],
W0070:['6',C,0,'b²-6b+2=0, tổng nghiệm dương 6; khớp nguồn'],
W0071:['A',C,0,'đổi cận đổi dấu'],
W0072:['D',C,0,'1/6'],
W0073:['B',C,0,''],
W0074:['C',C,0,''],
W0075:[['S','S','S','S'],C,0,'a: e^{2x}/2+2x; b: hằng số 1/2; c: chứa e^4 nên sai; d: ∫|1-x²|=2'],
W0076:['D',C,0,''],
W0077:['C',C,0,'31/3; đã kiểm số'],
W0078:['D',C,0,'π(π-2)/4; đã kiểm số'],
W0079:['1',C,0,'V=π/2(e²-1): a=2,b=-1'],
W0080:['B',C,0,'6'],
W0081:[['S','S','Đ','S'],C,0,'a: e²-e+3/2; b: diện tích e²-3; c: C=3 ⇒ (6e+13)/6; d: x²/2'],
W0082:['A',C,0,''],
W0083:['C',C,0,'6'],
W0084:['D',C,0,''],
W0085:['A',C,0,'74-64=10'],
W0086:['C',V,1,'F(4)-F(2)=-3; đề ghi đoạn [1;2] nhưng dùng F(4): lỗi đề nhẹ'],
W0087:[null,null,0,'cần xem lựa chọn (công thức lỗi); đáp án x⁴/4+C'],
W0088:[null,null,0,'cần xem công thức (đề lỗi chuyển đổi)'],
W0089:[null,null,0,'cần xem công thức (đề lỗi chuyển đổi)'],
W0090:['D',C,0,'3·5=15'],
W0091:['A',C,0,'F(2)-F(1)=-4; khớp nguồn'],
W0092:['D',C,0,'F\'=5^x'],
W0093:['C',C,0,'-4'],
W0094:['B',C,0,'tích phân không tách tích'],
W0095:['B',C,0,''],
W0096:['541',C,0,'π[3x³+6lnx-1/(3x³)]₂⁴≈540,97; đã kiểm số'],
W0097:['-2',C,0,'F=-2cosx-sinx-1'],
W0098:['A',C,0,'5-3=2'],
W0099:['B',C,0,'∫[2+f]=2x+∫f'],
W0100:['A',C,0,''],
W0101:[null,null,0,'cần xem lựa chọn (công thức lỗi); đáp án x⁴/2+C'],
W0102:[['S','S','S','S'],V,1,'Đề ghi f=(x²-x-1)/x nên f=x-1-1/x: a,b,c,d đều sai; có lẽ đề gốc (2x²-x-1)/x'],
W0103:['3.3',C,0,'10/3≈3,3'],
W0104:['D',C,0,''],
W0105:[['Đ',null,'Đ','Đ'],V,0,'b: F có ln x (không |x|) trên ℝ\{0} mơ hồ nên null; c: C=1, F(2)=7+ln2 đúng'],
W0106:[['S','S','S','S'],V,1,'Trùng W0102: đề sai (có lẽ (2x²-x-1)/x), theo đề thì đều sai'],
W0107:['A',C,0,'14-6=8'],
W0108:['B',C,0,'3+25'],
W0109:[null,null,0,'cần xem lựa chọn (công thức lỗi); đáp án x⁴+C'],
W0110:['D',C,0,'3+15'],
W0111:['A',C,0,'28'],
W0112:['D',C,0,'-3+1=-2'],
W0113:['C',C,0,''],
W0114:[['S','S','Đ','Đ'],C,0,'a: 8/3; b: π/5 (thiếu π); c: 4/3; d: max h=2, S=h³/6=4/3'],
W0115:['B',C,0,'π/30; đã kiểm số'],
W0116:['7.5',C,0,'0,005·1500; đã kiểm số'],
W0117:['3',C,0,'=1+√2: a=1,b=1'],
W0118:['A',C,0,'5+2=7'],
W0119:['C',C,0,''],
W0120:['A',C,0,''],
};
const out=lo.map(q=>{const r=m[q.id];if(!r)throw new Error(q.id);
 if(q.loai==='trac_nghiem'&&r[0]!==null&&!/^[A-D]$/.test(r[0]))throw new Error('bad '+q.id);
 if(q.loai==='dung_sai'&&r[0]===null)return {id:q.id,dap_an:null,do_chac:null,de_sai:false,ghi:r[3]};
 const o={id:q.id,dap_an:r[0]};
 if(r[0]===null||(Array.isArray(r[0])&&r[0].every(x=>x===null))){o.do_chac=null;} else o.do_chac=r[1];
 o.de_sai=!!r[2];o.ghi=r[3];return o;});
fs.writeFileSync('lo-02.son.out.json',JSON.stringify(out,null,1),'utf8');
const c={cao:0,vua:0,nul:0};out.forEach(o=>{if(o.dap_an===null)c.nul++;else c[o.do_chac]++});
console.log(out.length,c);
