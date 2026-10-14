import pg from 'pg'; import fs from 'fs';
const SP = 'scripts/luong-ta-t9/'; // chạy từ GỐC repo: cat scripts/luong-ta-t9/gen_v6.mjs | node --input-type=module
const OUT = SP + '_out/phieu6/';
fs.mkdirSync(OUT, { recursive: true });
import { pathToFileURL } from 'url';
const { apMigration } = await import(pathToFileURL('scripts/luong-ta-t9/_mig.mjs').href); // chạy từ GỐC repo
const { cc } = JSON.parse(fs.readFileSync(SP + 'sheet4.json', 'utf8'));
const CSS = fs.readFileSync(SP + 'phieu.css', 'utf8');
const NAME = { 'CườngP': 'Phong Ngọc Cường', 'Duy': 'Nguyễn Ngọc Duy', 'Dương': 'Lộ Thị Dương', 'Hà Giang': 'Nguyễn Hà Giang', 'Hằng': 'Nguyễn Thị Mỹ Hằng', 'Huyền': 'Ngô Ngọc Huyền', 'Khánh': 'Lê Văn Quang Khánh', 'Long': 'Trần Nhật Long', 'MinhP': 'Phạm Quang Minh', 'Ngân': 'Phạm Bảo Ngân', 'Nguyên': 'Trần Thị Thảo Nguyên', 'Thùy Giang': 'Lê Thuỳ Giang', 'TrangQ': 'Hoàng Thị Quỳnh Trang', 'Tùng': 'Tạ Quang Tùng', 'Vân Anh': 'Trần Thị Vân Anh' };
const LOAI = { 'Trợ giảng': 'tro_giang', 'Bổ trợ bù': 'bo_tro_bu', 'Bổ trợ yếu': 'bo_tro_yeu', 'Bổ trợ Đuổi': 'bo_tro_duoi', 'Bổ trợ định kì': 'bo_tro_dinh_ki', 'Bổ trợ ôn thi': 'bo_tro_on_thi', 'Bổ trợ đặc biệt': 'bo_tro_dac_biet', 'Trông thi': 'trong_thi', 'Bổ trợ chữa BT': 'bo_tro_bu' };
const hrs = g => { const m = (g || '').match(/(\d+)h(\d*)\s*-\s*(\d+)h(\d*)/); return m ? [`${m[1]}:${m[2] || '00'}`, `${m[3]}:${m[4] || '00'}`] : [null, null]; };
const money = n => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const dec = (n, d = 1) => (Math.round(n * 10 ** d) / 10 ** d).toString().replace('.', ',');
const pct = n => dec(n * 100, 2).replace(/,00$/, '').replace(/(,\d)0$/, '$1') + '%';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const ascii = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^A-Za-z0-9]+/g, '');
const dd = n => `${n}/9`;

const env = fs.readFileSync('.env', 'utf8').match(/^DATABASE_URL=(.*)$/m)[1].replace(/^['"]|['"]$/g, '');
const c = new pg.Client({ connectionString: env, ssl: { rejectUnauthorized: false } });
await c.connect();
const q = async (s, p) => (await c.query(s, p)).rows;
await c.query('begin');
const summary = [];
try {
  await apMigration(c);
  await c.query('alter table ta_cong_viec disable trigger ta_cong_viec_kiem');
  const id = {}; for (const [k, n] of Object.entries(NAME)) id[k] = (await q('select id from nhan_su where ho_ten=$1 limit 1', [n]))[0].id;
  const lop = {}; for (const r of await q('select id,ten_lop from lop')) lop[r.ten_lop] = r.id;
  // Ngân phụ trách 3A1 (chỉ chấm BTVN) — CEO xác nhận, ERP chưa có dòng phân công
  const ngan3a1 = !(await q("select 1 from phan_cong_lop where nhan_su_id=$1 and lop_id=$2 and vai_tro='tg'", [id['Ngân'], lop['3A1']])).length;
  if (ngan3a1) await q("insert into phan_cong_lop(nhan_su_id,lop_id,vai_tro,la_chinh,created_at) values($1,$2,'tg',false,'2026-06-15')", [id['Ngân'], lop['3A1']]);
  // Làm sạch theo CEO: Khánh 13/9 là MỘT buổi trông thi lại lớp 8A2 (bỏ dòng TG ghi nhầm)
  const rows = cc.filter(r => !(r.ta === 'Khánh' && r.ngay === 13 && r.viec === 'Trợ giảng' && r.lop === '8A2'));
  for (const r of rows) {
    const loai = LOAI[r.viec]; if (!loai || !id[r.ta]) continue;
    const [b, k] = hrs(r.gio);
    await q(`insert into ta_cong_viec(nhan_su_id,ngay,loai_viec,lop_id,gio_bat_dau,gio_ket_thuc,hoc_sinh,nguon,trang_thai)
             values($1,$2,$3,$4,$5,$6,$7,'import_sheet','da_duyet')`,
      [id[r.ta], `2026-09-${String(r.ngay).padStart(2, '0')}`, loai, r.lop ? lop[r.lop] : null, b, k, r.ghichu || null]);
  }
  const adm = (await q("select tk.id, ns.email from tai_khoan tk join nhan_su ns on ns.id=tk.nhan_su_id where ns.la_admin_he_thong limit 1"))[0];
  await c.query("select set_config('request.jwt.claims',$1,true)", [JSON.stringify({ sub: adm.id, email: adm.email, role: 'authenticated' })]);

  for (const ta of Object.keys(NAME)) {
    const nid = id[ta];
    const r = (await q("select * from fn_ta_luong_thang('2026-09-01',$1)", [nid]))[0];
    const ct = r.chi_tiet;
    const lopsHoatDong = ct.lop.filter(l => l.co_hoat_dong || l.tg_lam > 0 || l.btvn_lam > 0);
    const lopTen = new Set(ct.lop.map(l => l.lop));
    // căn cứ chi tiết
    const tgRows = await q(`select l.ten_lop, cv.ngay::text ngay, lv.tinh_vao from ta_cong_viec cv join ta_loai_viec lv on lv.ma=cv.loai_viec join lop l on l.id=cv.lop_id
        where cv.nhan_su_id=$1 and cv.ky='2026-09-01' and lv.tinh_vao in ('tg','trong_thi') order by cv.ngay`, [nid]);
    const btvnRows = await q(`select l.ten_lop, b.ngay::text ngay from buoi_hoc b join lop l on l.id=b.lop_id
        where b.loai='thuong' and b.trang_thai<>'huy' and b.ngay between '2026-09-01' and '2026-09-30'
          and exists (select 1 from gami_grades g join gami_session_problems p on p.id=g.problem_id and p.phase='btvn' and not p.hidden
                        join tai_khoan tk on tk.id=g.graded_by
                       where g.buoi_hoc_id=b.id and tk.nhan_su_id=$1 and g.graded_at < ('2026-10-04'::date)::timestamp at time zone 'Asia/Ho_Chi_Minh')
        order by l.ten_lop, b.ngay`, [nid]);
    const boRows = await q(`select cv.ngay::text ngay, lv.ten loai, l.ten_lop, cv.gio_bat_dau::text bat, cv.gio_ket_thuc::text ket,
          round((extract(epoch from (cv.gio_ket_thuc-cv.gio_bat_dau))/3600.0)::numeric,2) gio, cv.hoc_sinh
        from ta_cong_viec cv join ta_loai_viec lv on lv.ma=cv.loai_viec left join lop l on l.id=cv.lop_id
        where cv.nhan_su_id=$1 and cv.ky='2026-09-01' and lv.tinh_vao='bo_tro' order by cv.ngay, cv.gio_bat_dau`, [nid]);
    const ttRows = await q(`select cv.ngay::text ngay, l.ten_lop, cv.gio_bat_dau::text bat, cv.gio_ket_thuc::text ket,
          round((extract(epoch from (cv.gio_ket_thuc-cv.gio_bat_dau))/3600.0)::numeric,2) gio
        from ta_cong_viec cv join ta_loai_viec lv on lv.ma=cv.loai_viec left join lop l on l.id=cv.lop_id
        where cv.nhan_su_id=$1 and cv.ky='2026-09-01' and lv.tinh_vao='trong_thi' order by cv.ngay, cv.gio_bat_dau`, [nid]);
    const dbRows = await q(`select cv.ngay::text ngay, cv.gio_bat_dau::text bat, cv.gio_ket_thuc::text ket, cv.hoc_sinh
        from ta_cong_viec cv join ta_loai_viec lv on lv.ma=cv.loai_viec
        where cv.nhan_su_id=$1 and cv.ky='2026-09-01' and lv.tinh_vao='bo_tro_dac_biet' order by cv.ngay`, [nid]);
    const day = s => Number(s.slice(8, 10));
    const hhmm = s => (s || '').slice(0, 5);
    const ttPaid = ttRows.filter(t => !lopTen.has(t.ten_lop));
    const ttPaidGio = ttPaid.reduce((s, t) => s + Number(t.gio), 0);
    const notes = [];
    for (const l of ct.lop) {
      if (!l.la_chu && l.tg_lam > 0) notes.push(`Lớp ${l.lop}: dạy hộ ${l.tg_lam} buổi, tiền TG tính theo bậc và số buổi của lớp ${l.lop}.`);
      if (l.la_chu && !l.co_hoat_dong) notes.push(`Lớp ${l.lop} được phân công nhưng không có hoạt động trong tháng 9: không tính vào chỉ tiêu bổ trợ.`);
      if (l.la_chu && l.tg_lam === 0 && l.btvn_lam > 0) notes.push(`Lớp ${l.lop}: không trợ giảng (nhờ người dạy hộ), vẫn tính BTVN và chỉ tiêu bổ trợ của lớp.`);
      if (l.tg_lam > l.so_buoi && l.so_buoi > 0) notes.push(`Lớp ${l.lop}: ${l.tg_lam} buổi trợ giảng so với ${l.so_buoi} buổi lịch ERP, tỉ lệ vượt 100% theo quy định không trần.`);
      if (l.btvn_lam > l.btvn_dinh_muc) notes.push(`Lớp ${l.lop}: ${l.btvn_lam} lần chấm BTVN so với định mức ${l.btvn_dinh_muc}, không trần.`);
      if (l.si_tb < 5) notes.push(`Lớp ${l.lop}: sĩ số trung bình ${dec(l.si_tb)} học sinh, tính bậc lương thấp nhất.`);
    }
    if (ta === 'Khánh') notes.push('Ngày 6/9 trông thi lớp 8A2 (lớp mình): tính một buổi trợ giảng. Ngày 13/9 là buổi trông thi lại của 8A2 (ghi nhầm là trợ giảng): tính một buổi, không trả tiền trông thi riêng.');
    if (ta === 'Ngân') notes.push('Lớp 3A1: ERP chưa có dòng phân công, tính là lớp phụ trách theo xác nhận (chỉ chấm BTVN).');
    if (ta === 'Duy') notes.push('Lớp 11B1 được phân công cho Duy từ 29/9 nhưng mẫu số trợ giảng lấy theo cả tháng (8 buổi); BTVN 11B1 là bài online chưa chấm nên không tính.');
    if (ta === 'MinhP') notes.push('Dòng "trợ giảng ngày 31/9" (ghi chú trông thi 11A1) không hợp lệ nên không tính.');
    if (ta === 'TrangQ') notes.push('Giờ bổ trợ 31,5 giờ cao hơn nhiều so với chỉ tiêu, nên soát lại nguồn giờ khi chốt.');
    if (r.tien_phat > 0) notes.push(`Phạt gậy kỳ 9/2026: ${money(r.tien_phat)}đ.`);

    const rowsLop = ct.lop.map(l => `<tr>
        <td><b>${esc(l.lop)}</b>${l.la_chu ? '' : ' <span class="tag">dạy hộ</span>'}<div class="sub">TB tháng ${dec(l.si_tb)} → ${Math.round(l.si_tb)} HS · bậc ${money(l.bac)}đ</div></td>
        <td class="r n">${l.tg_lam}/${l.so_buoi} buổi</td><td class="r">${pct(l.ti_le_tg)}</td>
        <td class="r n">${l.btvn_lam}/${l.btvn_dinh_muc} lần</td><td class="r">${pct(l.ti_le_btvn)}</td>
        <td class="r">${money(l.tien)}</td></tr>`).join('');
    const tgBlock = ct.lop.map(l => {
      const d = tgRows.filter(x => x.ten_lop === l.lop);
      const tt = d.filter(x => x.tinh_vao === 'trong_thi').map(x => day(x.ngay));
      const tg = [...new Set(d.map(x => day(x.ngay)))].sort((a, b) => a - b);
      return `<p><b>${esc(l.lop)}</b>${l.la_chu ? '' : ' (dạy hộ)'}: ${tg.length ? tg.map(dd).join(', ') : '<span class="sub">không có buổi nào</span>'} <span class="sub">(${l.tg_lam} buổi${tt.length ? `, trong đó trông thi lớp mình: ${tt.map(dd).join(', ')}` : ''})</span></p>`;
    }).join('') || '<p class="sub">Không có.</p>';
    const btBlock = ct.lop.map(l => {
      const d = btvnRows.filter(x => x.ten_lop === l.lop).map(x => day(x.ngay));
      return `<p><b>${esc(l.lop)}</b> <span class="sub">(${l.btvn_lam}/${l.btvn_dinh_muc} lần)</span>: ${d.length ? d.map(dd).join(', ') : '<span class="sub">chưa có buổi nào do mình chấm</span>'}</p>`;
    }).join('') || '<p class="sub">Không có.</p>';

    const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>Phiếu lương ${esc(ta)} T9-2026</title><style>${CSS}</style></head><body>
<header class="head"><div><div class="eyebrow">BKdemy · Phiếu lương trợ giảng · Bản V6</div><h1>Trợ giảng ${esc(ta)}</h1></div><div class="ky">Kỳ lương tháng 9/2026</div></header>
<div class="body">
<dl class="info">
  <div><dt>Lớp phụ trách</dt><dd>${esc(ct.lop.filter(l => l.la_chu && l.co_hoat_dong).map(l => `${l.lop} (${Math.round(l.si_tb)} HS)`).join(', ') || '—')}</dd></div>
  <div><dt>Dạy hộ</dt><dd>${esc(ct.lop.filter(l => !l.la_chu).map(l => l.lop).join(', ') || '—')}</dd></div>
  <div><dt>Sĩ số</dt><dd>Trung bình cả tháng 9</dd></div>
</dl>
<div class="total"><span class="lbl">Tổng lương tháng 9</span><span class="num">${money(r.net)}<small>đ</small></span></div>

<section><h2>1. Đầu việc và tỉ lệ hoàn thành</h2>
<table><thead><tr><th>Lớp</th><th class="r">Trợ giảng + ET (40%)</th><th class="r">Tỉ lệ</th><th class="r">BTVN (20%)</th><th class="r">Tỉ lệ</th><th class="r">Tiền (đ)</th></tr></thead><tbody>
${rowsLop || '<tr><td colspan="6" class="sub">Không có lớp.</td></tr>'}
<tr class="sum"><td colspan="5">Lương theo lớp</td><td class="r">${money(r.package_lop)}</td></tr>
<tr><td>Bổ trợ (40%)<div class="sub">${ct.bo_tro.so_lop} lớp × ${dec(ct.bo_tro.chi_tieu_moi_lop, 0)} giờ = chỉ tiêu ${dec(ct.bo_tro.chi_tieu, 0)} giờ · Σ bậc ${money(ct.bo_tro.tong_bac)}đ</div></td>
  <td class="r n">${dec(ct.bo_tro.gio)} / ${dec(ct.bo_tro.chi_tieu, 0)} giờ</td><td class="r">${pct(Number(ct.bo_tro.ti_le || 0))}</td><td></td><td></td><td class="r">${money(r.bo_tro_tien)}</td></tr>
${dbRows.length ? `<tr><td>Bổ trợ đặc biệt, tính riêng<div class="sub">${dbRows.length} buổi × 150.000đ</div></td><td class="r n">${dbRows.length} buổi</td><td></td><td></td><td></td><td class="r">${money(dbRows.length * 150000)}</td></tr>` : ''}
<tr><td>Trông thi lớp khác<div class="sub">${dec(ttPaidGio)} giờ × 50.000đ</div></td><td class="r n">${dec(ttPaidGio)} giờ</td><td></td><td></td><td></td><td class="r">${money(ttPaidGio * 50000)}</td></tr>
${r.tien_phat > 0 ? `<tr><td>Trừ phạt gậy</td><td></td><td></td><td></td><td></td><td class="r">−${money(r.tien_phat)}</td></tr>` : ''}
<tr class="sum"><td colspan="5">Tổng lương</td><td class="r">${money(r.net)}</td></tr>
</tbody></table></section>

<section><h2>2. Cách ra con số</h2><div class="formula">
${ct.lop.map(l => `<span class="step">Lớp ${esc(l.lop)} = ${money(l.bac)} × (0,4 × ${pct(l.ti_le_tg)} + 0,2 × ${pct(l.ti_le_btvn)}) = <b>${money(l.tien)}đ</b></span>`).join('')}
<span class="step">Bổ trợ = 0,4 × ${pct(Number(ct.bo_tro.ti_le || 0))} × ${money(ct.bo_tro.tong_bac)} = <b>${money(r.bo_tro_tien)}đ</b></span>
${dbRows.length ? `<span class="step">Bổ trợ đặc biệt = ${dbRows.length} × 150.000 = <b>${money(dbRows.length * 150000)}đ</b></span>` : ''}
<span class="step">Trông thi = ${dec(ttPaidGio)} giờ × 50.000 = <b>${money(ttPaidGio * 50000)}đ</b></span>
<span class="step">Tổng = ${money(r.package_lop)} + ${money(r.bo_tro_tien)}${dbRows.length ? ' + ' + money(dbRows.length * 150000) : ''} + ${money(ttPaidGio * 50000)}${r.tien_phat > 0 ? ' − ' + money(r.tien_phat) : ''} = <b>${money(r.net)}đ</b></span>
</div></section>

<section><h2>3. Căn cứ chi tiết</h2>
<h3>Trợ giảng (buổi TA có mặt, tính theo ngày)</h3>${tgBlock}
<h3>Chấm BTVN (buổi chính TA đã chấm trong hạn)</h3>${btBlock}
<h3>Bổ trợ: ${dec(ct.bo_tro.gio)} giờ</h3>
${boRows.length ? `<table class="dense"><thead><tr><th>Ngày</th><th>Loại</th><th>Lớp</th><th>Khung giờ</th><th class="r">Giờ</th><th>Học sinh / ghi chú</th></tr></thead><tbody>
${boRows.map(x => `<tr><td class="n">${dd(day(x.ngay))}</td><td>${esc(x.loai.replace(/^Bổ trợ /, ''))}</td><td>${esc(x.ten_lop || '—')}</td><td class="n">${hhmm(x.bat)}–${hhmm(x.ket)}</td><td class="r">${dec(Number(x.gio))}</td><td class="sub">${esc(x.hoc_sinh || '')}</td></tr>`).join('')}
<tr class="sum"><td colspan="4">Tổng</td><td class="r">${dec(ct.bo_tro.gio)}</td><td></td></tr></tbody></table>` : '<p class="sub">Không có ca bổ trợ.</p>'}
${dbRows.length ? `<h3>Bổ trợ đặc biệt (tính riêng): ${dbRows.length} buổi</h3><table class="dense"><thead><tr><th>Ngày</th><th>Khung giờ</th><th class="r">Tiền (đ)</th><th>Học sinh</th></tr></thead><tbody>
${dbRows.map(x => `<tr><td class="n">${dd(day(x.ngay))}</td><td class="n">${hhmm(x.bat)}–${hhmm(x.ket)}</td><td class="r">150.000</td><td class="sub">${esc(x.hoc_sinh || '')}</td></tr>`).join('')}</tbody></table>` : ''}
<h3>Trông thi: ${dec(ttPaidGio)} giờ tính lương</h3>
${ttRows.length ? `<table class="dense"><thead><tr><th>Ngày</th><th>Lớp</th><th>Khung giờ</th><th class="r">Giờ</th><th class="r">Tiền (đ)</th><th>Ghi chú</th></tr></thead><tbody>
${ttRows.map(x => { const own = lopTen.has(x.ten_lop); return `<tr${own ? ' class="excluded"' : ''}><td class="n">${dd(day(x.ngay))}</td><td>${esc(x.ten_lop || '—')}</td><td class="n">${hhmm(x.bat)}–${hhmm(x.ket)}</td><td class="r">${dec(Number(x.gio))}</td><td class="r">${own ? 0 : money(Number(x.gio) * 50000)}</td><td class="sub">${own ? 'lớp mình, nằm trong công trợ giảng' : ''}</td></tr>`; }).join('')}
<tr class="sum"><td colspan="3">Tổng</td><td class="r">${dec(ttPaidGio)}</td><td class="r">${money(ttPaidGio * 50000)}</td><td></td></tr></tbody></table>` : '<p class="sub">Không có ca trông thi.</p>'}
</section>
${notes.length ? `<section><h2>Ghi chú</h2><ul class="notes">${notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul></section>` : ''}

<section class="appendix"><h2>Phụ lục. Bảng công thức tính lương trợ giảng</h2>
<div class="formula" style="margin-bottom:12px"><span class="step">Lương = Σ lớp [ bậc × (0,4 × %TG + 0,2 × %BTVN) ] + 0,4 × giờ bổ trợ ÷ (8 × số lớp) × Σ bậc + giờ trông thi lớp khác × 50.000 + 150.000 × buổi bổ trợ đặc biệt − phạt gậy</span></div>
<div class="cols">
<table class="dense"><thead><tr><th>Đầu việc</th><th class="r">Trọng số</th><th>Tỉ lệ</th></tr></thead><tbody>
<tr><td>Trợ giảng + ET</td><td class="r">40%</td><td>Số buổi TA có mặt ÷ số buổi lớp diễn ra (không tính buổi huỷ). Không trần. Trông thi lớp mình tính vào buổi này.</td></tr>
<tr><td>Chấm BTVN</td><td class="r">20%</td><td>Số buổi chính TA chấm trong hạn ÷ định mức (lớp 8 buổi: 7, lớp 4 buổi: 3). Không trần.</td></tr>
<tr><td>Bổ trợ</td><td class="r">40%</td><td>Tổng giờ ÷ (8 giờ × số lớp). Giờ dùng chung cho cả lớp. Không trần.</td></tr>
<tr><td>Trông thi lớp khác</td><td class="r">50.000đ/giờ</td><td>Cộng thẳng, ngoài hệ số.</td></tr>
<tr><td>Bổ trợ đặc biệt</td><td class="r">150.000đ/buổi</td><td>Tính riêng, không vào 8 giờ.</td></tr>
</tbody></table>
<table class="dense"><thead><tr><th>Sĩ số TB tháng</th><th class="r">Lương / tháng</th></tr></thead><tbody>
<tr><td>≤ 8 học sinh</td><td class="r">1.000.000đ</td></tr><tr><td>9 – 12</td><td class="r">1.200.000đ</td></tr>
<tr><td>13 – 15</td><td class="r">1.400.000đ</td></tr><tr><td>16 – 20</td><td class="r">1.600.000đ</td></tr>
<tr><td>từ 21</td><td class="r">1.800.000đ</td></tr></tbody></table>
</div>
<ul class="rules">
<li>Lớp thuộc về TA được phân công: giữ BTVN, chỉ tiêu bổ trợ và bậc lương kể cả khi nhờ người dạy hộ. Lớp chỉ vào chỉ tiêu bổ trợ khi TA có hoạt động ở lớp đó trong tháng.</li>
<li>Tiền trợ giảng đi theo người thực sự dạy từng buổi, tính theo bậc và số buổi của lớp được dạy.</li>
<li>BTVN tính theo buổi có dữ liệu thật do chính TA chấm trong hạn (3 ngày đầu tháng sau). Buổi thi/MT không có BTVN thì không tính.</li>
<li>Sĩ số lớp là trung bình số học sinh đang học mỗi ngày trong tháng, làm tròn đến số nguyên gần nhất.</li>
</ul></section>
<p class="note">Bản V6 tạm tính cho tháng 9/2026 theo bảng chấm công và dữ liệu lớp trên ERP. Số liệu chốt khi quản lý xác nhận.</p>
</div></body></html>`;
    fs.writeFileSync(`${OUT}${ascii(ta)}.html`, html);
    summary.push({ ta, net: Number(r.net), package_lop: Number(r.package_lop), bo_tro_tien: Number(r.bo_tro_tien), ngoai: Number(r.ngoai_package), phat: Number(r.tien_phat) });
  }
} catch (e) { console.log('LỖI', e.message); }
await c.query('rollback'); await c.end();
console.table(summary);
console.log('TỔNG', summary.reduce((s, x) => s + x.net, 0), '| files', fs.readdirSync(OUT).length);
fs.mkdirSync(SP + '_out', { recursive: true }); fs.writeFileSync(SP + '_out/phieu6-summary.json', JSON.stringify(summary, null, 1));
