import pg from 'pg'; import fs from 'fs';
const SP = 'scripts/luong-ta-t9/'; // chạy từ GỐC repo: cat scripts/luong-ta-t9/kiemchuan.mjs | node --input-type=module
import { pathToFileURL } from 'url';
const { apMigration } = await import(pathToFileURL('scripts/luong-ta-t9/_mig.mjs').href); // chạy từ GỐC repo
const {cc,bt}=JSON.parse(fs.readFileSync(SP+'sheet4.json','utf8'));
const v5=Object.fromEntries(JSON.parse(fs.readFileSync(SP+'v5-summary.json','utf8')).map(x=>[x.ta,x.tong]));
const NAME={'CườngP':'Phong Ngọc Cường','Duy':'Nguyễn Ngọc Duy','Dương':'Lộ Thị Dương','Hà Giang':'Nguyễn Hà Giang','Hằng':'Nguyễn Thị Mỹ Hằng','Huyền':'Ngô Ngọc Huyền','Khánh':'Lê Văn Quang Khánh','Long':'Trần Nhật Long','MinhP':'Phạm Quang Minh','Ngân':'Phạm Bảo Ngân','Nguyên':'Trần Thị Thảo Nguyên','Thùy Giang':'Lê Thuỳ Giang','TrangQ':'Hoàng Thị Quỳnh Trang','Tùng':'Tạ Quang Tùng','Vân Anh':'Trần Thị Vân Anh'};
const LOAI={'Trợ giảng':'tro_giang','Bổ trợ bù':'bo_tro_bu','Bổ trợ yếu':'bo_tro_yeu','Bổ trợ Đuổi':'bo_tro_duoi','Bổ trợ định kì':'bo_tro_dinh_ki','Bổ trợ ôn thi':'bo_tro_on_thi','Bổ trợ đặc biệt':'bo_tro_dac_biet','Trông thi':'trong_thi','Bổ trợ chữa BT':'bo_tro_bu'};
const hrs=g=>{const m=(g||'').match(/(\d+)h(\d*)\s*-\s*(\d+)h(\d*)/);return m?[`${m[1]}:${m[2]||'00'}`,`${m[3]}:${m[4]||'00'}`]:[null,null]};
const env=fs.readFileSync('.env','utf8').match(/^DATABASE_URL=(.*)$/m)[1].replace(/^['"]|['"]$/g,'');
const c=new pg.Client({connectionString:env,ssl:{rejectUnauthorized:false}});await c.connect();
const q=async(s,p)=>(await c.query(s,p)).rows;
await c.query('begin');
try{
  await apMigration(c);
  await c.query('alter table ta_cong_viec disable trigger ta_cong_viec_kiem'); // chỉ trong test: dòng trông thi cũ không ghi lớp
  const id={}; for(const [k,n] of Object.entries(NAME)) id[k]=(await q('select id from nhan_su where ho_ten=$1 limit 1',[n]))[0].id;
  const lop={}; for(const r of await q('select id,ten_lop from lop')) lop[r.ten_lop]=r.id;
  // làm sạch theo CEO 12/10: Khánh 13/9 là MỘT buổi trông thi (bỏ dòng TG 19h30)
  const rows=cc.filter(r=>!(r.ta==='Khánh'&&r.ngay===13&&r.viec==='Trợ giảng'&&r.lop==='8A2'));
  // chỉ giả lập phân công ERP còn thiếu mà CEO đã xác nhận là lớp CHỦ (Ngân phụ trách 3A1, chỉ chấm BTVN)
  const thieuPC=[];
  for(const [ta,l] of [['Ngân','3A1']]){
    const ex=await q("select 1 from phan_cong_lop where nhan_su_id=$1 and lop_id=$2 and vai_tro='tg'",[id[ta],lop[l]]);
    if(!ex.length){ thieuPC.push(`${ta} → ${l}`); await q("insert into phan_cong_lop(nhan_su_id,lop_id,vai_tro,la_chinh,created_at) values($1,$2,'tg',false,'2026-06-15')",[id[ta],lop[l]]);
      // từ 14/10 lương đọc phân công THEO NGÀY từ log (trigger ghi ts = bây giờ) ⇒ lùi ngày trong log cho khớp giả lập
      await q("update phan_cong_lop_log set ts='2026-06-15' where nhan_su_id=$1 and lop_id=$2 and vai_tro='tg' and hanh_dong='them'",[id[ta],lop[l]]); }
  }
  let n=0;
  for(const r of rows){
    const loai=LOAI[r.viec]; if(!loai||!id[r.ta]) continue;
    const [b,k]=hrs(r.gio);
    await q(`insert into ta_cong_viec(nhan_su_id,ngay,loai_viec,lop_id,gio_bat_dau,gio_ket_thuc,hoc_sinh,nguon,trang_thai) values($1,$2,$3,$4,$5,$6,$7,'import_sheet','da_duyet')`,
      [id[r.ta],`2026-09-${String(r.ngay).padStart(2,'0')}`,loai,r.lop?lop[r.lop]:null,b,k,r.ghichu||null]); n++;
  }
  console.log('nạp',n,'dòng; phân công ERP còn thiếu so với thực tế sheet (đã giả lập để tính):\n  '+thieuPC.join('\n  '));
  const adm=(await q("select tk.id, ns.email from tai_khoan tk join nhan_su ns on ns.id=tk.nhan_su_id where ns.la_admin_he_thong limit 1"))[0];
  await c.query("select set_config('request.jwt.claims',$1,true)",[JSON.stringify({sub:adm.id,email:adm.email,role:'authenticated'})]);
  const out=[];
  for(const [ta,nid] of Object.entries(id)){
    const r=(await q("select * from fn_ta_luong_thang('2026-09-01',$1)",[nid]))[0];
    const lops=r.chi_tiet.lop.map(l=>`${l.lop}${l.la_chu?'':'(hộ)'} TG${l.tg_lam}/${l.so_buoi} BTVN${l.btvn_lam}/${l.btvn_dinh_muc}`).join('; ')+' | BT '+r.chi_tiet.bo_tro.gio+'/'+r.chi_tiet.bo_tro.chi_tieu+'h → '+r.bo_tro_tien;
    out.push({ta,v5:v5[ta]??0,erp:Number(r.net),delta:Number(r.net)-(v5[ta]??0),gio_bt:r.bo_tro_gio,ngoai:Number(r.ngoai_package),lops,thay:r.chi_tiet.day_thay});
  }
  console.table(out.map(o=>({TA:o.ta,v5:o.v5,ERP:o.erp,'Δ':o.delta,'giờ BT':o.gio_bt,'ngoài PK':o.ngoai,'dạy thay':o.thay})));
  for(const o of out) console.log(o.ta.padEnd(11),o.lops);
  console.log('TỔNG v5',out.reduce((s,o)=>s+o.v5,0),'| ERP',out.reduce((s,o)=>s+o.erp,0));
}catch(e){console.log('LỖI',e.message)}
await c.query('rollback'); await c.end(); console.log('(đã ROLLBACK)');
