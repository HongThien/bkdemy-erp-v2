import pg from 'pg'; import fs from 'fs';
const env = Object.fromEntries(fs.readFileSync('.env','utf8').split(/\r?\n/).filter(l=>l.includes('=')).map(l=>[l.slice(0,l.indexOf('=')).trim(), l.slice(l.indexOf('=')+1).trim()]));
const c = new pg.Client({connectionString:env.DATABASE_URL, ssl:{rejectUnauthorized:false}}); await c.connect();
await c.query('set default_transaction_read_only=on');
const ten = ['fn_dai_chuyen_dang','fn_dai_chuyen_chuyen_de','fn_dai_gop_cau_dang','fn_ca_test_phan_cong_lai','fn_btyeu_ca_sap_toi','fn_lich_truc_cua_hs','fn_viec_chup_phu_trach','fn_ts_dk_form','current_nhan_su_id','la_thanh_vien','chi_me_id','co_chuc_nang','co_quyen_ghi','my_quyen','fn_phien_kho_them','fn_viec_buoi_thuong','fn_viec_buoi_thuong_loc'];
const r = await c.query(`select proname, prosrc, length(prosrc) dai from pg_proc where pronamespace='public'::regnamespace and proname = any($1)`, [ten]);
for (const x of r.rows) { const s = x.prosrc; const nghi = []; if (s.includes('$function$')) nghi.push('có $function$ trong thân'); if (/CREATE OR REPLACE FUNCTION/i.test(s)) nghi.push('có CREATE trong thân'); const dol = (s.match(/\$'|\$&|\$`/g) || []).length; console.log((nghi.length ? '✗ ' : '✔ ') + x.proname.padEnd(28), 'dài', String(x.dai).padStart(6), "| mẫu $' $& $` trong thân:", dol, nghi.join('; ')); }
await c.end();
