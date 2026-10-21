// B3 Khớp kho HGT — dựng FILE ĐỀ XUẤT + TRANG DUYỆT (CHỈ ĐỌC DB). Luật Thùy 20/10 "đề xuất trước, ghi sau":
// lượt khớp chỉ ra đề xuất + trang HTML cho CEO xem; ghi DB (bdm-b3-hgt-ghi.mjs --ghi) khi CEO nói rõ "ghi".
//   node scripts/bdm-b3-hgt-xem.mjs <thu-muc> <khoi> <ra.html>
// Đọc <thu-muc>/lo-NN.json + out-NN.json (như bdm-b3-hgt-ghi.mjs). Ghi:
//   <thu-muc>/de-xuat.json — { dang: [{ma_cau, dang_bai_id, chac, ly_do}], dung_sai: [{ma_cau, chu_de_id, chac, ly_do}] }
//     · dang: câu thường (dang_bai_id null = không xếp được, ly_do mở đầu bằng nhãn KHÔNG THUỘC CHỦ ĐỀ / THIẾU DẠNG / …)
//     · dung_sai: câu Đ/S của khối chưa ở kho Đ/S ⇒ đề xuất vào kho Đ/S của chủ đề vùng hgt (luật 18/10: Đ/S không gán dạng)
//   node scripts/bdm-b3-hgt-xem.mjs --hang <khoi> <ra.html>  — trang cho HÀNG CHỜ đã nằm trong DB (hgt_bdm_de_xuat + cau_thieu_dang), không ghi file đề xuất
//   <thu-muc>/ghi-chu.html (nếu có) — đoạn ghi chú chèn đầu trang (kết quả soát mù, điểm cần CEO quyết)
//   <ra.html> — đề + hình + đáp án + lời giải + dạng bài đề xuất, nhóm theo mức chắc › dạng bài
import pg from 'pg'
import fs from 'node:fs'
import path from 'node:path'
process.loadEnvFile('.env')

const [thuMuc, khoi, ra] = process.argv.slice(2)
if (!thuMuc || !khoi || !ra) { console.error('Dùng: node scripts/bdm-b3-hgt-xem.mjs <thu-muc> <khoi> <ra.html>'); process.exit(2) }

const HANG = thuMuc === '--hang'
const kq = []
if (!HANG) for (const f of fs.readdirSync(thuMuc).filter((x) => /^lo-\d+\.json$/.test(x)).sort()) {
  const lo = JSON.parse(fs.readFileSync(path.join(thuMuc, f), 'utf8'))
  const out = new Map(JSON.parse(fs.readFileSync(path.join(thuMuc, f.replace('lo-', 'out-')), 'utf8')).map((r) => [r.ma_cau, r]))
  for (const l of lo) {
    const r = out.get(l.ma_cau)
    if (!r) throw new Error(`${f}: thiếu ${l.ma_cau}`)
    kq.push({ ma_cau: l.ma_cau, dang_bai_id: r.dang_bai_id || null, chac: r.dang_bai_id ? r.chac : null, ly_do: String(r.ly_do || '') })
  }
}

const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO || process.env.DATABASE_URL })
await c.connect()
await c.query('begin read only')
const q = async (s, p) => (await c.query(s, p)).rows
const cd = await q(`select id, ten from dai_bdm_chu_de where khoi = $1 and nhanh = 'hgt'`, [khoi])
if (cd.length !== 1) throw new Error(`khối ${khoi} có ${cd.length} chủ đề vùng hgt`)
const dich = await q(`
  select d.id, d.ten, n.ten nhom, cdx.ten chuyen_de
    from dai_bdm_dang_bai d
    join dai_bdm_nhom n on n.id = d.nhom_id and n.chu_de_id = $1
    join dai_bdm_chuyen_de cdx on cdx.id = n.chuyen_de_id
    left join dai_bdm_o o on o.chu_de_id = n.chu_de_id and o.chuyen_de_id = n.chuyen_de_id
   order by o.thu_tu, n.thu_tu, d.thu_tu`, [cd[0].id])
const hopLe = new Set(dich.map((d) => d.id))
const sai = kq.filter((r) => r.dang_bai_id && !hopLe.has(r.dang_bai_id))
if (sai.length) throw new Error('mã dạng bài lạ: ' + sai.slice(0, 5).map((r) => r.ma_cau + '→' + r.dang_bai_id).join(', '))
if (HANG) for (const r of await q(`
  select x.ma_cau, x.dang_bai_id, x.chac, x.ly_do from hgt_bdm_de_xuat x join hgt_cau_hoi h on h.ma_cau = x.ma_cau and h.xoa_at is null
    join hgt_ban_do b on b.ma_dang = h.dang_chinh where b.khoi = $1
     and not exists (select 1 from hgt_bdm_gan_cau g where g.ma_cau = x.ma_cau)
  union all
  select t.ma_cau, null, null, t.ly_do from hgt_bdm_cau_thieu_dang t join hgt_cau_hoi h on h.ma_cau = t.ma_cau and h.xoa_at is null
    join hgt_ban_do b on b.ma_dang = h.dang_chinh where b.khoi = $1
     and not exists (select 1 from hgt_bdm_gan_cau g where g.ma_cau = t.ma_cau)
   order by 1`, [khoi])) kq.push({ ma_cau: r.ma_cau, dang_bai_id: r.dang_bai_id, chac: r.dang_bai_id ? r.chac : null, ly_do: r.ly_do || '' })
const ds = await q(`
  select h.ma_cau, h.noi_dung from hgt_cau_hoi h join hgt_ban_do b on b.ma_dang = h.dang_chinh
   where b.khoi = $1 and h.xoa_at is null and h.loai_cau = 'dung_sai'
     and not exists (select 1 from hgt_bdm_kho_ds k where k.ma_cau = h.ma_cau)
   order by h.ma_cau`, [khoi])
const ma = [...kq.map((r) => r.ma_cau), ...ds.map((r) => r.ma_cau)]
const cau = new Map((await q(`
  select ma_cau, loai_cau, noi_dung, lua_chon, menh_de, dap_an, loi_giai, anh_de, anh_dap_an, kho_chuan, ten_de_goc
    from hgt_cau_hoi where ma_cau = any($1)`, [ma])).map((r) => [r.ma_cau, r]))
await c.query('rollback'); await c.end()

// Đ/S: chủ đề vùng hgt của khối là đích duy nhất; câu nhắc tới phương trình đường/conic ⇒ "vua" (có thể thuộc chủ đề khác)
const ngoai = /phương trình đường|đường tròn|elip|hypebol|parabol/i
const dungSai = ds.map((r) => ngoai.test(r.noi_dung)
  ? { ma_cau: r.ma_cau, chu_de_id: cd[0].id, chac: 'vua', ly_do: 'Đề nhắc phương trình đường / conic — có thể không thuộc chủ đề ' + cd[0].ten }
  : { ma_cau: r.ma_cau, chu_de_id: cd[0].id, chac: 'cao', ly_do: 'Đúng/Sai về ' + cd[0].ten + ' ⇒ kho Đ/S cấp chủ đề (luật 18/10)' })
if (!HANG) fs.writeFileSync(path.join(thuMuc, 'de-xuat.json'), JSON.stringify({ khoi, chu_de: cd[0], tao_luc: new Date().toISOString(), dang: kq, dung_sai: dungSai }, null, 1))

const nhan = (r) => (r.dang_bai_id ? r.chac : (r.ly_do.match(/^(KHÔNG THUỘC CHỦ ĐỀ|THIẾU DẠNG|THIẾU HÌNH|ĐỀ LỖI)/) || [, 'KHÁC'])[1])
const dem = {}
for (const r of kq) dem[nhan(r)] = (dem[nhan(r)] || 0) + 1
const data = {
  khoi, chu_de: cd[0], dich, dem, dsDem: { cao: dungSai.filter((x) => x.chac === 'cao').length, vua: dungSai.filter((x) => x.chac === 'vua').length },
  kq: kq.map((r) => ({ ...r, n: nhan(r) })), ds: dungSai,
  cau: Object.fromEntries(ma.map((m) => { const x = cau.get(m); return [m, { l: x.loai_cau, d: x.noi_dung, lc: x.lua_chon, md: x.menh_de, da: x.dap_an, lg: x.loi_giai, a: x.anh_de, ad: x.anh_dap_an, kc: x.kho_chuan, tg: x.ten_de_goc }] })),
}
const json = JSON.stringify(data).replace(/</g, '\\u003c')
fs.mkdirSync(path.dirname(ra), { recursive: true })
fs.writeFileSync(ra, `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Xếp câu HGT K${khoi}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
<style>
:root{--bg:#f6f7f9;--card:#fff;--ink:#1d2330;--mut:#667085;--line:#e3e6eb;--cao:#127a43;--cao-bg:#e5f6ec;--vua:#9a6200;--vua-bg:#fff4dc;--trong:#a12a2a;--trong-bg:#fde9e9;--acc:#2754c5}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 system-ui,"Segoe UI",sans-serif}
header{position:sticky;top:0;z-index:5;background:var(--card);border-bottom:1px solid var(--line);padding:12px 16px}
h1{font-size:18px;margin:0 0 4px}.sub{color:var(--mut);font-size:13px}
nav{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}nav button{border:1px solid var(--line);background:var(--card);border-radius:999px;padding:5px 12px;cursor:pointer;font:inherit;font-size:13px}
nav button.on{background:var(--acc);border-color:var(--acc);color:#fff}
input[type=search]{margin-top:8px;width:100%;max-width:360px;padding:6px 10px;border:1px solid var(--line);border-radius:8px;font:inherit}
main{max-width:1000px;margin:0 auto;padding:12px 16px 60px}
details.g{background:var(--card);border:1px solid var(--line);border-radius:10px;margin:10px 0}
details.g>summary{cursor:pointer;padding:10px 14px;font-weight:600;list-style:none;display:flex;gap:8px;align-items:baseline}
details.g>summary::-webkit-details-marker{display:none}details.g>summary::before{content:"▸";color:var(--mut)}details.g[open]>summary::before{content:"▾"}
.path{color:var(--mut);font-weight:400;font-size:12px}.cnt{margin-left:auto;color:var(--mut);font-weight:400;font-size:13px;white-space:nowrap}
.c{border-top:1px solid var(--line);padding:12px 14px}.top{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:12px;color:var(--mut);margin-bottom:6px}
.b{border-radius:6px;padding:1px 8px;font-weight:600;font-size:12px}.b.cao{background:var(--cao-bg);color:var(--cao)}.b.vua{background:var(--vua-bg);color:var(--vua)}.b.trong{background:var(--trong-bg);color:var(--trong)}
.de{white-space:pre-wrap;overflow-x:auto}.lc{margin:6px 0 0;padding-left:0;list-style:none}.lc li.dung{font-weight:600;color:var(--cao)}
img.h{max-width:min(100%,420px);display:block;margin:8px 0;border:1px solid var(--line);border-radius:6px;background:#fff}
.ly{margin-top:6px;font-size:13px;background:var(--bg);border-radius:6px;padding:6px 8px}.ly b{color:var(--ink)}
details.lg{margin-top:6px;font-size:14px}details.lg summary{cursor:pointer;color:var(--acc);font-size:13px}.lgt{white-space:pre-wrap;overflow-x:auto;padding:6px 0}
.md li{margin:2px 0}.note{background:#fffbe8;border:1px solid #f0e2a8;border-radius:8px;padding:8px 12px;font-size:13px;margin:10px 0}
</style></head><body>
<header><h1>Xếp câu Hình giải tích K${khoi} vào bản đồ mới — ${HANG ? 'HÀNG CHỜ DUYỆT (đề xuất + thiếu dạng đang trong DB)' : 'ĐỀ XUẤT (chưa ghi)'}</h1>
<div class="sub" id="sub"></div><nav id="nav"></nav><input type="search" id="tim" placeholder="Tìm mã câu / chữ trong đề…"></header>
<main id="m">${!HANG && fs.existsSync(path.join(thuMuc, 'ghi-chu.html')) ? fs.readFileSync(path.join(thuMuc, 'ghi-chu.html'), 'utf8') : ''}<div id="m2"></div></main>
<script>
const D=${json};
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const dichMap=Object.fromEntries(D.dich.map(d=>[d.id,d]));
const TABS=[['cao','Mức cao'],['vua','Chưa chắc'],['trong','Không xếp được'],['ds','Đúng/Sai → kho chủ đề']];
let tab='cao',tim='';
const nTrong=D.kq.filter(r=>!r.dang_bai_id).length;
document.getElementById('sub').innerHTML='Chủ đề <b>'+esc(D.chu_de.ten)+'</b> ('+D.chu_de.id+') · '+D.dich.length+' dạng bài · '+D.kq.length+' câu thường: <b>'+(D.dem.cao||0)+'</b> cao · <b>'+(D.dem.vua||0)+'</b> chưa chắc · <b>'+nTrong+'</b> không xếp được · Đ/S '+D.ds.length+' câu. Bấm một dạng bài để mở câu.';
function nav(){document.getElementById('nav').innerHTML=TABS.map(([k,t])=>{const n=k==='ds'?D.ds.length:k==='trong'?nTrong:(D.dem[k]||0);return '<button data-k="'+k+'" class="'+(k===tab?'on':'')+'">'+t+' ('+n+')</button>'}).join('')}
document.getElementById('nav').onclick=e=>{const k=e.target.dataset.k;if(k){tab=k;nav();ve()}};
document.getElementById('tim').oninput=e=>{tim=e.target.value.trim().toLowerCase();ve()};
function the(ma,badge,lydo){const x=D.cau[ma];let h='<div class="c"><div class="top"><b style="color:var(--ink)">'+ma+'</b><span>'+esc(x.l)+'</span>'+(x.kc?'<span>kho chuẩn</span>':'')+(x.tg?'<span>· '+esc(x.tg)+'</span>':'')+badge+'</div>';
 h+='<div class="de">'+esc(x.d)+'</div>';if(x.a)h+='<img class="h" loading="lazy" src="'+esc(x.a)+'">';
 if(Array.isArray(x.lc)&&x.lc.length)h+='<ul class="lc">'+x.lc.map((o,i)=>{const L='ABCDEFGH'[i];return '<li class="'+(String(x.da||'').trim()===L?'dung':'')+'">'+L+'. '+esc(typeof o==='object'?(o.noi_dung??JSON.stringify(o)):o)+'</li>'}).join('')+'</ul>';
 if(Array.isArray(x.md)&&x.md.length)h+='<ol type="a" class="md">'+x.md.map(m=>'<li>'+esc(m.noi_dung)+' <b>['+esc(m.dap_an)+']</b></li>').join('')+'</ol>';
 if(x.da&&!(Array.isArray(x.lc)&&x.lc.length))h+='<div><b>Đáp án:</b> '+esc(x.da)+'</div>';
 if(lydo)h+='<div class="ly">'+lydo+'</div>';
 if(x.lg||x.ad)h+='<details class="lg"><summary>Lời giải</summary><div class="lgt">'+esc(x.lg||'')+'</div>'+(x.ad?'<img class="h" loading="lazy" src="'+esc(x.ad)+'">':'')+'</details>';
 return h+'</div>'}
const khop=ma=>!tim||ma.toLowerCase().includes(tim)||String(D.cau[ma].d).toLowerCase().includes(tim);
function nhom(tieu,path,ds,fn){if(!ds.length)return '';return '<details class="g"'+(tim?' open':'')+'><summary>'+tieu+(path?' <span class="path">'+path+'</span>':'')+'<span class="cnt">'+ds.length+' câu</span></summary><div class="body" data-n="'+encodeURIComponent(JSON.stringify(ds.map(fn)))+'"></div></details>'}
function ve(){let h='';const m=document.getElementById('m2');
 if(tab==='cao'||tab==='vua'){const rs=D.kq.filter(r=>r.n===tab&&khop(r.ma_cau));
  h+=tab==='vua'?'<div class="note">Máy chọn được một dạng hợp nhất nhưng còn dạng khác cũng có thể, hoặc đề phụ thuộc hình. Xem lý do dưới mỗi câu.</div>':'<div class="note">Khớp rõ đúng một dạng bài. Chị lướt từng dạng, thấy câu nào sai thì ghi mã câu lại.</div>';
  for(const d of D.dich){const ds=rs.filter(r=>r.dang_bai_id===d.id);h+=nhom(d.id+' · '+esc(d.ten),esc(d.chuyen_de+' › '+d.nhom),ds,r=>[r.ma_cau,'',r.ly_do])}}
 else if(tab==='trong'){const rs=D.kq.filter(r=>!r.dang_bai_id&&khop(r.ma_cau));
  for(const k of ['KHÔNG THUỘC CHỦ ĐỀ','THIẾU DẠNG','THIẾU HÌNH','ĐỀ LỖI','KHÁC'])h+=nhom(k,'',rs.filter(r=>r.n===k),r=>[r.ma_cau,'',r.ly_do])}
 else{const rs=D.ds.filter(r=>khop(r.ma_cau));h+='<div class="note">Luật 18/10: câu Đúng/Sai không gán dạng bài; cả câu vào <b>kho Đúng/Sai của chủ đề '+esc(D.chu_de.ten)+'</b>.</div>';
  h+=nhom('Vào kho Đ/S chủ đề '+esc(D.chu_de.ten),'',rs.filter(r=>r.chac==='cao'),r=>[r.ma_cau,'',r.ly_do]);h+=nhom('Cần xem — đề nhắc phương trình đường / conic','',rs.filter(r=>r.chac==='vua'),r=>[r.ma_cau,'',r.ly_do])}
 m.innerHTML=h||'<p>Không có câu.</p>';
 m.querySelectorAll('details.g').forEach(g=>{const mo=()=>{const b=g.querySelector('.body');if(b.dataset.n){const ds=JSON.parse(decodeURIComponent(b.dataset.n));b.innerHTML=ds.map(([ma,,ly])=>{const r=D.kq.find(x=>x.ma_cau===ma);const bd=r?(r.dang_bai_id?'<span class="b '+r.chac+'">'+(r.chac==='cao'?'cao':'chưa chắc')+' · '+r.dang_bai_id+'</span>':'<span class="b trong">không xếp</span>'):'';return the(ma,bd,ly?'<b>Lý do máy:</b> '+esc(ly):'')}).join('');delete b.dataset.n;renderMathInElement(b,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false})}};if(g.open)mo();g.addEventListener('toggle',()=>g.open&&mo())})}
nav();ve();
</script></body></html>`)
console.log(`đề xuất: ${kq.length} câu thường`, dem, `· Đ/S ${dungSai.length} (cao ${data.dsDem.cao} · vua ${data.dsDem.vua})`)
console.log('→', path.join(thuMuc, 'de-xuat.json'), '·', ra, Math.round(fs.statSync(ra).size / 1024) + ' KB')
