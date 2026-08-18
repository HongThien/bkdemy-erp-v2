import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = readFileSync('.env','utf8')
const c = new pg.Client({ connectionString: env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'') })
await c.connect()
const p=async(t,s)=>{const r=await c.query(s);console.log('\n▸ '+t);console.table(r.rows.slice(0,30))}
await p('Ba người nhóm ① — ghế, role, có chức năng học phí chưa', `
  select ns.ma_ns, ns.ho_ten, ns.la_admin_he_thong as founder,
    coalesce(string_agg(distinct vt.ten, ' · '), '(không ghế)') as ghe,
    coalesce(string_agg(distinct vr.ten, ' · '), '(ghế chưa gán role)') as role,
    bool_or(vc.chuc_nang = 'hocphi') as co_quyen_hocphi
  from nhan_su ns
  left join vi_tri vt on vt.nhan_su_id = ns.id
  left join vai_tro vr on vr.id = vt.vai_tro_id
  left join vai_tro_chuc_nang vc on vc.vai_tro_id = vr.id
  where ns.ma_ns in ('NS001','NS002','NS003')
  group by ns.id, ns.ma_ns, ns.ho_ten, ns.la_admin_he_thong`)
await p('AI KHÁC đang có chức năng học phí (sẽ bị siết nếu không nằm nhóm ①)', `
  select distinct ns.ma_ns, ns.ho_ten, vr.ten as role
  from vai_tro_chuc_nang vc
  join vai_tro vr on vr.id=vc.vai_tro_id
  join vi_tri vt on vt.vai_tro_id=vr.id
  join nhan_su ns on ns.id=vt.nhan_su_id
  where vc.chuc_nang='hocphi' and ns.ma_ns not in ('NS001','NS002','NS003')`)
await p('Chức năng liên quan tiền hiện có trong hệ', `
  select distinct chuc_nang from vai_tro_chuc_nang
  where chuc_nang ilike '%phi%' or chuc_nang ilike '%luong%' or chuc_nang ilike '%tai_chinh%' or chuc_nang ilike '%dashboard%'`)
await c.end()
