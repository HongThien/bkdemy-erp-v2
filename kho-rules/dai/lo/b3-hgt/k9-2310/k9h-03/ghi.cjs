const fs=require('fs');
const path=require('path');
const base=path.join(__dirname,'..');
// [index, dang, chac, ly_do]
function ghi(lo,out,spec){
  const a=JSON.parse(fs.readFileSync(path.join(base,lo),'utf8'));
  const m=new Map();
  for(const [i,d,c,l] of spec){ if(typeof i==='number') m.set(i,[d,c,l]); else for(let k=i[0];k<=i[1];k++) m.set(k,[d,c,l]); }
  const res=a.map((c,i)=>{ const s=m.get(i); if(!s) throw new Error('thieu '+i); return {ma_cau:c.ma_cau,dang_bai_id:s[0],chac:s[1],ly_do:s[2]}; });
  fs.writeFileSync(path.join(base,out),JSON.stringify(res,null,1));
  const n={cao:0,vua:0,trong:0}; res.forEach(r=>{ if(r.chac==='cao')n.cao++; else if(r.chac==='vua')n.vua++; else n.trong++; });
  console.log(out,res.length,n);
}
const PN='Đổi tỉ số/tính biểu thức bằng góc phụ nhau và giá trị góc đặc biệt.';
ghi('lo-03.json','out-03.json',[
 [[0,30],'NDB01372','cao',PN],
 [31,null,null,'THIẾU DẠNG: Chứng minh hệ thức lượng giác (tan = sin/cos) trong tam giác vuông'],
 [32,'NDB01373','vua','Chứng minh sin²α+cos²α=1 trong tam giác vuông; gần dạng nhưng là chứng minh, không phải rút gọn biểu thức.'],
 [[33,36],'NDB01373','vua','Ghép góc phụ nhau rồi dùng sin²x+cos²x=1; vướng dạng góc cụ thể, theo luật dạng sau.'],
 [[37,38],'NDB01373','cao','Biểu thức theo α nhọn, đưa về hằng số bằng sin²α+cos²α=1.'],
 [[39,54],'NDB01374','cao','Cho tan α, biểu thức đẳng cấp theo sin, cos; chia tử và mẫu cho cosⁿα.'],
 [55,'NDB01361','vua','Ý a tính BC, HB, AH trong tam giác vuông có đường cao; các ý còn lại là chứng minh.'],
 [56,'NDB01361','vua','Ý a giải tam giác vuông có đường cao AK; ý b, c tính và chứng minh thêm.'],
 [57,'NDB01373','vua','Ý a giải tam giác biết 2 cạnh, ý d biểu thức sin²B+sin²C; nhiều dạng, lấy dạng sau.'],
 [58,'NDB01361','vua','Ý a giải tam giác biết 2 cạnh, có đường cao AH ở các ý sau; còn chứng minh.'],
 [59,'NDB01358','vua','Ý a giải tam giác vuông biết cạnh góc vuông và góc; ý b, c chứng minh và tính diện tích.'],
 [60,'NDB01359','vua','Ý a tính góc từ 3 cạnh tam giác vuông; ý b, c là chứng minh đồng dạng và cực trị.'],
 [61,'NDB01358','vua','Ý a giải tam giác vuông biết cạnh góc vuông và góc P; ý b, c chứng minh.'],
 [62,'NDB01361','vua','Ý a biết 2 cạnh tam giác vuông, ý b tính đường cao AH; còn chứng minh.'],
 [63,'NDB01361','vua','Ý a giải tam giác biết 2 cạnh, ý b có đường cao MH; còn chứng minh.'],
 [64,'NDB01361','vua','Ý a tính AC, BH, góc B trong tam giác vuông có đường cao; còn chứng minh.'],
 [65,'NDB01361','vua','Ý a biết cạnh huyền và góc, ý b có đường cao AH; còn chứng minh.'],
 [66,'NDB01359','vua','Ý a giải hai tam giác vuông ABK, BKM từ cạnh và góc; ý b, c chứng minh.'],
 [67,'NDB01361','vua','Ý a giải tam giác biết 2 cạnh, ý b có đường cao AH; còn chứng minh.'],
 [68,'NDB01361','vua','Ý a tính BC, AH, góc B trong tam giác vuông có đường cao; còn chứng minh.'],
 [69,'NDB01361','vua','Ý a giải tam giác biết 2 cạnh, có đường cao AH ở ý sau; còn chứng minh.'],
]);
ghi('lo-04.json','out-04.json',[
 [0,'NDB01361','vua','Ý a giải tam giác biết 2 cạnh, ý b có đường cao AH; còn chứng minh.'],
 [1,'NDB01361','vua','Ý a giải tam giác biết 2 cạnh, ý b kẻ đường cao AI; còn chứng minh.'],
 [2,'NDB01361','vua','Ý a biết tan và cạnh, tính BC, AH, góc; ý b, c chứng minh.'],
 [3,'NDB01361','vua','Ý a tính NP, MH, góc N có đường cao MH; ý b, c chứng minh.'],
 [4,'NDB01361','vua','Ý a tính BC, AH, góc B có đường cao AH; ý b, c chứng minh.'],
 [5,'NDB01361','vua','Ý a giải tam giác biết cạnh và góc, ý b có đường cao AH; còn chứng minh.'],
 [6,'NDB01361','vua','Ý a giải tam giác biết cạnh và góc, có đường cao AH ở ý sau; còn chứng minh.'],
 [[7,9],'NDB01364','cao','Một tam giác vuông, biết hai cạnh, tính góc nhọn.'],
 [10,'NDB01364','vua','Tính góc từ hai cạnh trong tam giác vuông rồi so sánh khoảng an toàn.'],
 [11,'NDB01364','cao','Một tam giác vuông, biết góc nhọn và một cạnh, tính chiều cao.'],
 [12,'NDB01376','cao','Tính đoạn bằng tỉ số lượng giác rồi cộng thêm đoạn còn lại để ra chiều cao cây.'],
 [[13,14],'NDB01364','cao','Một tam giác vuông, biết góc nhọn và một cạnh, tính chiều cao.'],
 [15,'NDB01376','cao','Giải tam giác vuông tìm AB rồi tính thêm quãng đường, thời gian.'],
 [16,'NDB01376','cao','Tính độ cao rồi đổi sang thời gian bay theo vận tốc.'],
 [[17,18],'NDB01364','cao','Một tam giác vuông, biết góc nhọn và một cạnh, tính chiều cao cây.'],
 [19,'NDB01376','cao','Tính phần tháp bằng tan rồi cộng thêm chiều cao mắt người.'],
 [20,'NDB01376','cao','Tính góc rồi dùng lại góc cho tòa nhà và đổi ra số tầng.'],
 [[21,22],'NDB01365','cao','Hai góc nhìn, tách thành hai tam giác vuông chung cạnh để tính chiều cao.'],
 [23,'NDB01376','cao','Tính góc nắng từ cột cờ rồi dùng lại góc cho tòa nhà.'],
 [[24,26],'NDB01365','cao','Tam giác không vuông, tách thành hai tam giác vuông để tính chiều cao hoặc khoảng cách.'],
 [27,'NDB01365','vua','Hai tam giác vuông ghép từ góc chiếu sáng; cách đặt hình phụ thuộc hình vẽ.'],
 [[28,34],'NDB01365','cao','Tam giác không vuông, tách thành hai tam giác vuông chung cạnh hoặc góc để tính.'],
]);
