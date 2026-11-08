const fs=require('fs');
const D='C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/kho-rules/dai/lo/b3-hgt/k9-2310/';
function run(lo, rules){
  const a=JSON.parse(fs.readFileSync(D+`lo-${lo}.json`,'utf8'));
  const out=a.map((c,i)=>{
    let r=null;
    for(const [from,to,id,chac,ly] of rules){ if(i>=from&&i<=to){r=[id,chac,ly];break;} }
    if(!r) throw new Error('thieu '+lo+' '+i);
    return {ma_cau:c.ma_cau,dang_bai_id:r[0],chac:r[1],ly_do:r[2]};
  });
  fs.writeFileSync(D+`out-${lo}.json`,JSON.stringify(out,null,1));
  const cnt={};out.forEach(o=>{const k=o.chac||'trong';cnt[k]=(cnt[k]||0)+1});
  console.log(lo,out.length,cnt);
}
run('01',[
 [0,3,'NDB01372','vua','Sắp xếp tỉ số các góc cụ thể, đổi bằng góc phụ nhau; chưa hẳn là tính biểu thức.'],
 [4,7,'NDB01372','cao','Biểu thức các góc cụ thể, ghép cặp góc phụ nhau và dùng góc đặc biệt.'],
 [8,8,'NDB01361','vua','Giải tam giác vuông biết hai cạnh, có phân giác và đường cao AH của tam giác vuông ABI.'],
 [9,9,'NDB01361','cao','Giải tam giác vuông rồi kẻ đường cao AH; vướng dạng 01358 nên chọn dạng sau.'],
 [10,10,'NDB01361','cao','Giải tam giác vuông biết hai cạnh rồi tính đường cao AH; chọn dạng sau.'],
 [11,13,'NDB01364','cao','Tình huống thực tế quy về đúng một tam giác vuông (thang/tháp/tia nắng).'],
 [14,14,'NDB01361','cao','Biết cạnh và tan B, tính đường cao AH; vướng 01360 nên chọn dạng sau 01361.'],
 [15,15,'NDB01365','cao','Góc hạ, góc nâng từ nóc nhà, tách hai tam giác vuông chung cạnh nằm ngang.'],
 [16,16,'NDB01359','vua','Tìm hai cạnh góc vuông từ chu vi và trung tuyến rồi tính tỉ số lượng giác các góc.'],
 [17,17,'NDB01361','vua','Hình thang vuông có hai đường chéo vuông góc; tam giác vuông có đường cao, thiên về đồng dạng.'],
 [18,19,'NDB01364','cao','Thực tế: cột cờ, bóng và tia nắng tạo một tam giác vuông.'],
 [20,20,'NDB01376','cao','Cây gãy tạo tam giác vuông, còn phải cộng đoạn còn đứng để ra chiều cao ban đầu.'],
 [21,21,'NDB01364','cao','Hải đăng, mặt biển và tia nhìn tạo một tam giác vuông, tính khoảng cách.'],
 [22,22,'NDB01365','cao','Hai góc hạ từ đỉnh tháp, hai tam giác vuông chung tháp, rồi đổi sang thời gian; chọn dạng sau.'],
 [23,23,'NDB01361','vua','Chứng minh hệ thức sin trong tam giác vuông có đường cao AH.'],
 [24,24,'NDB01373','cao','Dùng sin30=cos60 và cos²42+sin²42=1; vướng 01372 nên chọn dạng sau.'],
 [25,25,'NDB01372','cao','Sáu góc cụ thể ghép thành các cặp góc phụ nhau, dùng góc đặc biệt 30°, 60°.'],
 [26,26,'NDB01361','vua','Giải tam giác biết hai cạnh, rồi chứng minh hệ thức với đường cao AH và hình chiếu.'],
 [27,27,'NDB01358','vua','Giải tam giác biết cạnh góc vuông và góc nhọn; các ý chứng minh đồng dạng khác dạng.'],
 [28,28,'NDB01361','vua','Hình chữ nhật có đường cao DH của tam giác vuông ADC; ý chứng minh phức tạp.'],
 [29,29,'NDB01361','vua','Giải tam giác BCA có đường cao CA, ý c chứng minh sin2α khác dạng.'],
 [30,30,'NDB01364','cao','Thực tế: tháp, bóng và tia nắng tạo một tam giác vuông, tính góc và chiều cao.'],
 [31,31,'NDB01361','vua','Giải tam giác biết hai cạnh góc vuông, có đường cao BH; ý chứng minh nặng.'],
 [32,58,'NDB01357','cao','Biết cạnh huyền và một góc nhọn, giải tam giác hoặc tìm cạnh còn lại.'],
 [59,69,'NDB01358','cao','Biết cạnh góc vuông AB và góc nhọn B, giải tam giác vuông.'],
]);
run('02',[
 [0,9,'NDB01358','cao','Biết cạnh góc vuông AB và góc nhọn B, giải tam giác vuông.'],
 [10,20,'NDB01360','cao','Biết một cạnh góc vuông và sin/cos của một góc, giải tam giác vuông.'],
 [21,41,'NDB01360','cao','Biết cạnh huyền BC và tan B, giải tam giác vuông.'],
 [42,62,'NDB01359','cao','Biết hai cạnh góc vuông, dùng Pythagore và tỉ số lượng giác giải tam giác.'],
 [63,69,'NDB01372','cao','Biểu thức hoặc đổi tỉ số của góc cụ thể (góc đặc biệt, góc phụ nhau).'],
]);
