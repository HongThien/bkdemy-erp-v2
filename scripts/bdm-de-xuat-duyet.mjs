// Duyệt hàng ĐỀ XUẤT dạng bài (bản đồ mới) — Thùy 26/10: "chuyển hẳn sang bản đồ và kho mới … duyệt rồi mới được sử dụng;
// ở kho cũ duyệt rồi mà kho mới chưa duyệt thì m cứ đề xuất duyệt đi". Dạng bài của câu giờ chỉ từ gán + đề xuất (mig 202610261834).
//   node scripts/bdm-de-xuat-duyet.mjs dung <ra.html> <ds.json> [--khoi 6,7,8,9,10,11,12]   — CHỈ ĐỌC: dựng trang + danh sách
//   node scripts/bdm-de-xuat-duyet.mjs ghi <ds.json> [--tru T1…,T3…] [--ghi]                  — chạy thử / ghi khi CEO nói "ghi"
// Đơn vị = dòng đề xuất (dai_bdm_de_xuat / hgt_bdm_de_xuat) của câu còn sống, khối dạng cũ trong --khoi; bản sao đi theo câu gốc nên
// chỉ hiện "+N bản sao". 3 mục:
//   duyet      — kho cũ đã duyệt (da_duyet hoặc kho_chuan), không phải Đ/S ⇒ đề xuất DUYỆT: ghi *_bdm_gan_cau (nguon 'ai') + rút đề xuất
//   chua_duyet — kho cũ chưa duyệt ⇒ để nguyên trong hàng đề xuất (không ghi gì)
//   loai_ds    — câu Đúng/Sai ⇒ đề xuất LOẠI: rút dòng đề xuất (luật 18/10: Đ/S không vào kho dạng bài; câu đã ở kho Đ/S chủ đề)
import pg from 'pg'
import fs from 'node:fs'
import path from 'node:path'
process.loadEnvFile('.env')
const args = process.argv.slice(2)
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null }
const CHE_DO = args[0]
const KHO = { dai: { cau: 'dai_cau_hoi', bd: 'dai_ban_do', dx: 'dai_bdm_de_xuat', gan: 'dai_bdm_gan_cau', ds: 'dai_bdm_kho_ds' }, hgt: { cau: 'hgt_cau_hoi', bd: 'hgt_ban_do', dx: 'hgt_bdm_de_xuat', gan: 'hgt_bdm_gan_cau', ds: 'hgt_bdm_kho_ds' } }

if (CHE_DO === 'dung') {
  const [, ra, dsFile] = args
  const KHOI = (opt('--khoi') || '6,7,8,9,10,11,12').split(',')
  if (!ra || !dsFile) { console.error('Dùng: … dung <ra.html> <ds.json> [--khoi …]'); process.exit(2) }
  const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO || process.env.DATABASE_URL })
  await c.connect(); await c.query('begin read only')
  const rows = []
  for (const [kho, T] of Object.entries(KHO)) {
    rows.push(...(await c.query(`
      select '${kho}' kho, x.ma_cau, x.dang_bai_id, x.chac, x.ly_do, b.khoi, q.loai_cau, q.noi_dung, q.lua_chon, q.menh_de, q.dap_an,
             left(q.loi_giai, 1500) loi_giai, q.anh_de, q.anh_dap_an, q.da_duyet, q.kho_chuan,
             (select count(*) from ${T.cau} k where k.parent_ma_cau = x.ma_cau and k.xoa_at is null)::int ban_sao,
             exists (select 1 from ${T.ds} k where k.ma_cau = x.ma_cau) co_kho_ds,
             d.ten dang, n.ten nhom, cd.ten chu_de, cd.id chu_de_id, cd.thu_tu cd_tt, n.thu_tu n_tt, d.thu_tu d_tt, cdx.ten chuyen_de
        from ${T.dx} x join ${T.cau} q on q.ma_cau = x.ma_cau and q.xoa_at is null
        join ${T.bd} b on b.ma_dang = q.dang_chinh
        left join dai_bdm_dang_bai d on d.id = x.dang_bai_id left join dai_bdm_nhom n on n.id = d.nhom_id
        left join dai_bdm_chu_de cd on cd.id = n.chu_de_id left join dai_bdm_chuyen_de cdx on cdx.id = n.chuyen_de_id
       where b.khoi = any($1) and not exists (select 1 from ${T.gan} g where g.ma_cau = x.ma_cau)`, [KHOI])).rows)
  }
  await c.query('rollback'); await c.end()
  const muc = (r) => (r.loai_cau === 'dung_sai' ? 'loai_ds' : (r.da_duyet || r.kho_chuan) ? 'duyet' : 'chua_duyet')
  for (const r of rows) r.muc = muc(r)
  const ds = { tao_luc: new Date().toISOString(), khoi: KHOI, duyet: [], chua_duyet: [], loai_ds: [] }
  for (const r of rows) ds[r.muc].push({ kho: r.kho, ma_cau: r.ma_cau, dang_bai_id: r.dang_bai_id })
  fs.mkdirSync(path.dirname(dsFile), { recursive: true }); fs.writeFileSync(dsFile, JSON.stringify(ds, null, 1))
  const dem = {}
  for (const r of rows) { const k = `${r.muc}|${r.khoi}|${r.kho}`; dem[k] = dem[k] || { n: 0, bs: 0 }; dem[k].n++; dem[k].bs += r.ban_sao }
  const data = rows.map((r) => ({ m: r.muc, k: r.kho, ma: r.ma_cau, kh: r.khoi, db: r.dang_bai_id, dang: r.dang, nhom: r.nhom, cd: r.chu_de, cx: r.chuyen_de,
    o: [Number(r.khoi) || 0, r.cd_tt ?? 999, r.n_tt ?? 999, r.d_tt ?? 999], ch: r.chac, ly: r.ly_do, l: r.loai_cau, d: r.noi_dung, lc: r.lua_chon, md: r.menh_de,
    da: r.dap_an, lg: r.loi_giai, a: r.anh_de, ad: r.anh_dap_an, dd: r.da_duyet, kc: r.kho_chuan, bs: r.ban_sao, kds: r.co_kho_ds }))
  data.sort((a, b) => a.o[0] - b.o[0] || a.o[1] - b.o[1] || a.o[2] - b.o[2] || a.o[3] - b.o[3] || a.ma.localeCompare(b.ma))
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  fs.mkdirSync(path.dirname(ra), { recursive: true })
  fs.writeFileSync(ra, `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Duyệt đề xuất dạng bài</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
<style>
:root{--bg:#f6f7f9;--card:#fff;--ink:#1d2330;--mut:#667085;--line:#e3e6eb;--ok:#127a43;--ok-bg:#e5f6ec;--warn:#9a6200;--warn-bg:#fff4dc;--bad:#a12a2a;--bad-bg:#fde9e9;--acc:#2754c5}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 system-ui,"Segoe UI",sans-serif}
header{position:sticky;top:0;z-index:5;background:var(--card);border-bottom:1px solid var(--line);padding:12px 16px}
h1{font-size:18px;margin:0 0 4px}.sub{color:var(--mut);font-size:13px}
nav{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}nav button{border:1px solid var(--line);background:var(--card);border-radius:999px;padding:5px 12px;cursor:pointer;font:inherit;font-size:13px}
nav button.on{background:var(--acc);border-color:var(--acc);color:#fff}
input[type=search]{margin-top:8px;width:100%;max-width:360px;padding:6px 10px;border:1px solid var(--line);border-radius:8px;font:inherit}
main{max-width:1000px;margin:0 auto;padding:12px 16px 60px}
details{background:var(--card);border:1px solid var(--line);border-radius:10px;margin:8px 0}
details details{border-radius:8px;margin:6px 10px}
summary{cursor:pointer;padding:9px 14px;font-weight:600;list-style:none;display:flex;gap:8px;align-items:baseline}
summary::-webkit-details-marker{display:none}summary::before{content:"▸";color:var(--mut)}details[open]>summary::before{content:"▾"}
.path{color:var(--mut);font-weight:400;font-size:12px}.cnt{margin-left:auto;color:var(--mut);font-weight:400;font-size:13px;white-space:nowrap}
.c{border-top:1px solid var(--line);padding:12px 14px}.top{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:12px;color:var(--mut);margin-bottom:6px}
.b{border-radius:6px;padding:1px 8px;font-weight:600;font-size:12px}.b.ok{background:var(--ok-bg);color:var(--ok)}.b.warn{background:var(--warn-bg);color:var(--warn)}.b.bad{background:var(--bad-bg);color:var(--bad)}
.de{white-space:pre-wrap;overflow-x:auto}.lc{margin:6px 0 0;padding-left:0;list-style:none}.lc li.dung{font-weight:600;color:var(--ok)}
img.h{max-width:min(100%,420px);display:block;margin:8px 0;border:1px solid var(--line);border-radius:6px;background:#fff}
.ly{margin-top:6px;font-size:13px;background:var(--bg);border-radius:6px;padding:6px 8px}
details.lg{border:0;margin:6px 0 0}details.lg>summary{padding:0;font-weight:400;color:var(--acc);font-size:13px}.lgt{white-space:pre-wrap;overflow-x:auto;padding:6px 0}
.note{background:#fffbe8;border:1px solid #f0e2a8;border-radius:8px;padding:8px 12px;font-size:13px;margin:10px 0}
table.t{border-collapse:collapse;font-size:13px;margin-top:6px}table.t td,table.t th{border:1px solid var(--line);padding:3px 8px;text-align:right}table.t th:first-child,table.t td:first-child{text-align:left}
</style></head><body>
<header><h1>Duyệt hàng ĐỀ XUẤT dạng bài — bản đồ mới K${KHOI[0]}–${KHOI[KHOI.length - 1]} (Đại + Hình giải tích)</h1>
<div class="sub" id="sub"></div><nav id="nav"></nav><input type="search" id="tim" placeholder="Tìm mã câu / chữ trong đề…"></header>
<main><div class="note">Thùy 26/10: dạng bài chỉ được dùng khi đã DUYỆT. Trang này là các câu hiện chỉ có dạng từ <b>hàng đề xuất</b> (chưa gán chắc). <b>CHƯA GHI GÌ.</b>
<br>① <b>Đề xuất DUYỆT</b> — câu đã duyệt ở kho cũ (đã duyệt / kho chuẩn): đồng ý thì dạng đề xuất thành gán chắc. ② <b>Chưa duyệt ở kho cũ</b> — không đề xuất duyệt, để nguyên hàng chờ. ③ <b>Đúng/Sai — đề xuất LOẠI</b> — Đ/S không vào kho dạng bài (luật 18/10); các câu này đã nằm trong kho Đúng/Sai của chủ đề, chỉ rút dòng đề xuất dư.
<br>Trả lời <i>"ghi"</i> (hoặc <i>"ghi, trừ T1…, T3…"</i>) ⇒ áp mục ① và ③. «+N bản sao» = bản sao số liệu tự đi theo câu này.<div id="bang"></div></div><div id="m"></div></main>
<script>
const D=${json};
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const TABS=[['duyet','① Đề xuất DUYỆT'],['chua_duyet','② Chưa duyệt ở kho cũ'],['loai_ds','③ Đúng/Sai — đề xuất LOẠI']];
let tab='duyet',tim='';
const n=k=>D.filter(r=>r.m===k).length;
document.getElementById('sub').innerHTML=D.length+' câu · '+TABS.map(([k,t])=>t+': <b>'+n(k)+'</b>').join(' · ');
const kh=[...new Set(D.map(r=>r.kh))];
document.getElementById('bang').innerHTML='<table class="t"><tr><th>Khối</th>'+TABS.map(([,t])=>'<th>'+t+'</th>').join('')+'</tr>'+kh.map(k=>'<tr><td>K'+k+'</td>'+TABS.map(([m])=>{const a=D.filter(r=>r.kh===k&&r.m===m);const d=a.filter(r=>r.k==='dai').length,h=a.length-d;return '<td>'+(a.length?a.length+' <span style="color:var(--mut)">('+(d?'Đại '+d:'')+(d&&h?' · ':'')+(h?'HGT '+h:'')+')</span>':'')+'</td>'}).join('')+'</tr>').join('')+'</table>';
function nav(){document.getElementById('nav').innerHTML=TABS.map(([k,t])=>'<button data-k="'+k+'" class="'+(k===tab?'on':'')+'">'+t+' ('+n(k)+')</button>').join('')}
document.getElementById('nav').onclick=e=>{const k=e.target.dataset.k;if(k){tab=k;nav();ve()}};
document.getElementById('tim').oninput=e=>{tim=e.target.value.trim().toLowerCase();ve()};
function the(r){let h='<div class="c"><div class="top"><b style="color:var(--ink)">'+r.ma+'</b><span>'+(r.k==='hgt'?'HGT':'Đại')+' · '+esc(r.l)+'</span>'+(r.dd?'<span class="b ok">đã duyệt kho cũ</span>':'')+(r.kc?'<span class="b ok">kho chuẩn</span>':'')+(r.bs?'<span>+'+r.bs+' bản sao</span>':'')+(r.m==='loai_ds'?'<span class="b bad">LOẠI khỏi kho dạng</span>'+(r.kds?'<span>đã ở kho Đ/S chủ đề</span>':'<span class="b warn">CHƯA ở kho Đ/S</span>'):'<span class="b '+(r.ch==='cao'?'ok':'warn')+'">'+(r.ch==='cao'?'AI chắc':'AI chưa chắc')+' · '+esc(r.db)+'</span>')+'</div>';
 h+='<div class="de">'+esc(r.d)+'</div>';if(r.a)h+='<img class="h" loading="lazy" src="'+esc(r.a)+'">';
 if(Array.isArray(r.lc)&&r.lc.length)h+='<ul class="lc">'+r.lc.map((o,i)=>{const L='ABCDEFGH'[i];return '<li class="'+(String(r.da||'').trim()===L?'dung':'')+'">'+L+'. '+esc(typeof o==='object'?(o.noi_dung??JSON.stringify(o)):o)+'</li>'}).join('')+'</ul>';
 if(Array.isArray(r.md)&&r.md.length)h+='<ol type="a">'+r.md.map(m=>'<li>'+esc(m.noi_dung)+' <b>['+esc(m.dap_an)+']</b></li>').join('')+'</ol>';
 if(r.da&&!(Array.isArray(r.lc)&&r.lc.length))h+='<div><b>Đáp án:</b> '+esc(r.da)+'</div>';
 if(r.ly)h+='<div class="ly"><b>Lý do AI:</b> '+esc(r.ly)+'</div>';
 if(r.lg||r.ad)h+='<details class="lg"><summary>Lời giải</summary><div class="lgt">'+esc(r.lg||'')+'</div>'+(r.ad?'<img class="h" loading="lazy" src="'+esc(r.ad)+'">':'')+'</details>';
 return h+'</div>'}
const khop=r=>!tim||r.ma.toLowerCase().includes(tim)||String(r.d).toLowerCase().includes(tim);
function ve(){const rs=D.filter(r=>r.m===tab&&khop(r));const m=document.getElementById('m');let h='';
 const g1=new Map();for(const r of rs){const k1='K'+r.kh+' · '+(r.cd||'(chưa rõ chủ đề)');if(!g1.has(k1))g1.set(k1,new Map());const g2=g1.get(k1);const k2=r.db?r.db+' · '+(r.dang||''):'—';if(!g2.has(k2))g2.set(k2,{p:(r.cx||'')+(r.nhom?' › '+r.nhom:''),a:[]});g2.get(k2).a.push(r)}
 let id=0;const kho={};
 for(const [k1,g2] of g1){const tong=[...g2.values()].reduce((s,x)=>s+x.a.length,0);h+='<details'+(tim?' open':'')+'><summary>'+esc(k1)+'<span class="cnt">'+tong+' câu</span></summary>';
  for(const [k2,x] of g2){id++;kho[id]=x.a;h+='<details class="g" data-id="'+id+'"'+(tim?' open':'')+'><summary>'+esc(k2)+' <span class="path">'+esc(x.p)+'</span><span class="cnt">'+x.a.length+'</span></summary><div class="body"></div></details>'}
  h+='</details>'}
 m.innerHTML=h||'<p>Không có câu.</p>';
 m.querySelectorAll('details.g').forEach(g=>{const mo=()=>{const b=g.querySelector('.body');if(!b.dataset.xong){b.innerHTML=kho[g.dataset.id].map(the).join('');b.dataset.xong=1;renderMathInElement(b,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false})}};if(g.open)mo();g.addEventListener('toggle',()=>g.open&&mo())})}
nav();ve();
</script></body></html>`)
  console.log('khối|kho', Object.fromEntries(Object.entries(dem).sort()))
  console.log(`duyet ${ds.duyet.length} · chua_duyet ${ds.chua_duyet.length} · loai_ds ${ds.loai_ds.length} ⇒ ${ra} (${Math.round(fs.statSync(ra).size / 1024)} KB) · ${dsFile}`)
} else if (CHE_DO === 'ghi') {
  const dsFile = args[1], GHI = args.includes('--ghi'), TRU = new Set((opt('--tru') || '').split(',').filter(Boolean))
  if (!dsFile) { console.error('Dùng: … ghi <ds.json> [--tru …] [--ghi]'); process.exit(2) }
  const ds = JSON.parse(fs.readFileSync(dsFile, 'utf8'))
  const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? process.env.DATABASE_URL })
  await c.connect()
  try {
    await c.query('begin')
    for (const [kho, T] of Object.entries(KHO)) {
      const du = ds.duyet.filter((r) => r.kho === kho && !TRU.has(r.ma_cau)), lo = ds.loai_ds.filter((r) => r.kho === kho && !TRU.has(r.ma_cau))
      // chỉ áp khi dòng đề xuất vẫn y như lúc dựng trang (cùng dạng bài) — đổi rồi thì bỏ qua, báo
      const g = await c.query(`insert into ${T.gan} (ma_cau, dang_bai_id, nguon)
        select t.ma, t.db, 'ai' from unnest($1::text[], $2::text[]) t(ma, db)
          join ${T.dx} x on x.ma_cau = t.ma and x.dang_bai_id = t.db
          join ${T.cau} q on q.ma_cau = t.ma and q.xoa_at is null and q.loai_cau <> 'dung_sai'
        on conflict (ma_cau) do nothing returning ma_cau`, [du.map((r) => r.ma_cau), du.map((r) => r.dang_bai_id)])
      const r1 = await c.query(`delete from ${T.dx} where ma_cau = any($1)`, [g.rows.map((x) => x.ma_cau)])
      const r2 = await c.query(`delete from ${T.dx} x using ${T.cau} q where x.ma_cau = q.ma_cau and q.loai_cau = 'dung_sai' and x.ma_cau = any($1)`, [lo.map((r) => r.ma_cau)])
      console.log(`${kho}: DUYỆT ${g.rowCount}/${du.length} (rút đề xuất ${r1.rowCount}) · LOẠI Đ/S ${r2.rowCount}/${lo.length}${TRU.size ? ` · trừ ${TRU.size} mã` : ''}`)
      if (g.rowCount !== du.length || r2.rowCount !== lo.length) console.log(`   ⚠ ${kho}: có dòng đã đổi/đã xử lý từ lúc dựng trang — bỏ qua phần lệch`)
    }
    await c.query(GHI ? 'commit' : 'rollback')
    console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
  } catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
  await c.end()
} else { console.error('Dùng: node scripts/bdm-de-xuat-duyet.mjs dung|ghi …'); process.exit(2) }
