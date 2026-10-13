import pg from 'pg'; import fs from 'fs';
const SP = 'scripts/luong-ta-t9/'; // chạy từ GỐC repo: cat scripts/luong-ta-t9/test_luong.mjs | node --input-type=module
const sql=fs.readFileSync('supabase/migrations/202610122210_ta_cham_cong_va_luong.sql','utf8');
const {cc}=JSON.parse(fs.readFileSync(SP+'sheet4.json','utf8'));
const env=fs.readFileSync('.env','utf8').match(/^DATABASE_URL=(.*)$/m)[1].replace(/^['"]|['"]$/g,'');
const c=new pg.Client({connectionString:env,ssl:{rejectUnauthorized:false}});await c.connect();
const q=async(s,p)=>(await c.query(s,p)).rows;
await c.query('begin');
try {
  await c.query(sql);
  console.log('✔ migration chạy được');
  const idOf=async n=>(await q('select id from nhan_su where ho_ten=$1 limit 1',[n]))[0].id;
  const map={'CườngP':await idOf('Phong Ngọc Cường'),'Duy':await idOf('Nguyễn Ngọc Duy'),'Nguyên':await idOf('Trần Thị Thảo Nguyên')};
  const LOAI={'Trợ giảng':'tro_giang','Bổ trợ bù':'bo_tro_bu','Bổ trợ yếu':'bo_tro_yeu','Bổ trợ Đuổi':'bo_tro_duoi','Bổ trợ định kì':'bo_tro_dinh_ki','Bổ trợ ôn thi':'bo_tro_on_thi','Bổ trợ đặc biệt':'bo_tro_dac_biet','Trông thi':'trong_thi'};
  const hrs=g=>{const m=(g||'').match(/(\d+)h(\d*)\s*-\s*(\d+)h(\d*)/);return m?[`${m[1]}:${m[2]||'00'}`,`${m[3]}:${m[4]||'00'}`]:[null,null]};
  let n=0;
  for(const r of cc.filter(x=>map[x.ta])){
    const loai=LOAI[r.viec]; if(!loai) continue;
    const lop=r.lop?(await q('select id from lop where ten_lop=$1',[r.lop]))[0]?.id:null;
    const [b,k]=hrs(r.gio);
    await q(`insert into ta_cong_viec(nhan_su_id,ngay,loai_viec,lop_id,gio_bat_dau,gio_ket_thuc,hoc_sinh,nguon,trang_thai)
             values($1,$2,$3,$4,$5,$6,$7,'import_sheet','da_duyet')`,[map[r.ta],`2026-09-${String(r.ngay).padStart(2,'0')}`,loai,lop,b,k,r.ghichu||null]);
    n++;
  }
  console.log('đã nạp',n,'dòng công T9 (3 TA)');
  // đóng vai CEO (admin) để gọi hàm có kiểm quyền
  const adm=(await q("select tk.id, ns.email from tai_khoan tk join nhan_su ns on ns.id=tk.nhan_su_id where ns.la_admin_he_thong limit 1"))[0];
  await c.query("select set_config('request.jwt.claims',$1,true)",[JSON.stringify({sub:adm.id,email:adm.email,role:'authenticated'})]);
  const rs=await q("select * from fn_ta_luong_thang('2026-09-01', null)");
  console.log('kết quả fn_ta_luong_thang cho kỳ 9/2026 (chỉ 3 TA đã nạp công + TA còn lại chỉ có package K1):');
  for(const r of rs) console.log(r.ho_ten.padEnd(24),'package',r.package_lop,'bổ trợ',r.bo_tro_gio+'h →',r.bo_tro_tien,'ngoài',r.ngoai_package,'| gross',r.gross,'net',r.net);
  for(const id of Object.values(map)){
    const r=(await q("select * from fn_ta_luong_thang('2026-09-01',$1)",[id]))[0];
    console.log('\n'+r.ho_ten, JSON.stringify(r.chi_tiet.lop.map(l=>({lop:l.lop,si:l.si_tb,bac:l.bac,tg:`${l.tg_lam}/${l.so_buoi}`,btvn:`${l.btvn_lam}/${l.btvn_dinh_muc}`,tien:l.tien}))), 'day_thay',r.chi_tiet.day_thay, 'ngoài',JSON.stringify(r.chi_tiet.ngoai_package.map(x=>`${x.loai} ${x.so_luong}×${x.don_gia}`)));
  }
  // append-only
  try { await c.query('savepoint a'); await c.query("update ta_don_gia set gia_tri=1 where ma='he_so_tg'"); console.log('✘ update ta_don_gia KHÔNG bị chặn'); }
  catch(e){ await c.query('rollback to savepoint a'); console.log('✔ ta_don_gia chặn sửa:',e.message.slice(0,70)); }
  const bang=await q("select ma,si_tu,gia_tri,dang_hieu_luc from fn_ta_bang_don_gia('2026-09-15') where ma in ('he_so_tg','bac_luong','gia_trong_thi') order by ma,si_tu");
  console.log('bảng đơn giá (mẫu):',JSON.stringify(bang.slice(0,4)));
  // luồng chấm công của chính TA
  const tk=(await q("select tk.id, ns.email from tai_khoan tk join nhan_su ns on ns.id=tk.nhan_su_id where ns.id=$1",[map['CườngP']]))[0];
  if(tk){
    await c.query("select set_config('request.jwt.claims',$1,true)",[JSON.stringify({sub:tk.id,email:tk.email,role:'authenticated'})]);
    const vao=(await q('select fn_ta_cham_cong_vao($1) id',['Cơ sở 1']))[0].id;
    const hn=await q('select * from fn_ta_hom_nay()');
    console.log('✔ vào ca',vao,'| hôm nay có',hn.length,'việc gợi ý từ ERP');
    const today=(await q("select (now() at time zone 'Asia/Ho_Chi_Minh')::date d"))[0].d.toISOString().slice(0,10);
    const kv=(await q("select fn_ta_khai_viec('tro_giang',(now() at time zone 'Asia/Ho_Chi_Minh')::date) id"))[0].id;
    const row=(await q('select lop_id, nguon, trang_thai from ta_cong_viec where id=$1',[kv]))[0];
    console.log('✔ khai TG không chọn lớp → lớp mặc định:',(await q('select ten_lop from lop where id=$1',[row.lop_id]))[0]?.ten_lop,'| nguon',row.nguon,'| trạng thái',row.trang_thai);
    try{ await c.query('savepoint b'); await q("select fn_ta_duyet_cong('{}', array[$1::uuid], 'da_duyet')",[kv]); console.log('✘ TA tự duyệt được!'); }
    catch(e){ await c.query('rollback to savepoint b'); console.log('✔ TA không tự duyệt được:',e.message); }
    await q('select fn_ta_cham_cong_ra()'); console.log('✔ ra ca');
    try{ await c.query('savepoint c'); await q("select * from fn_ta_luong_thang('2026-09-01',$1)",[map['Duy']]); console.log('✘ TA xem được lương người khác!'); }
    catch(e){ await c.query('rollback to savepoint c'); console.log('✔ TA không xem lương người khác:',e.message); }
  } else console.log('(CườngP chưa có tài khoản — bỏ qua test luồng TA)');
} catch(e){ console.log('✘ LỖI:',e.message, e.position?('@'+e.position):''); }
await c.query('rollback'); await c.end(); console.log('\n(đã ROLLBACK — DB không đổi)');
