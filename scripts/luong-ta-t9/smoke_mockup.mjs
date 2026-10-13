// Chạy logic mockup trong Node với DOM giả: dựng từng kịch bản, làm đúng các bước, kiểm kết quả mong đợi.
import fs from 'fs'; import vm from 'vm';
const html = fs.readFileSync(process.argv[2], 'utf8');
const js = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));
const els = {};
const ctx = { console, Date, Math, String, Number, Set, Object, JSON,
  document: { getElementById: id => (els[id] ??= { innerHTML: '', value: '' }), addEventListener() {} },
  location: { hash: '' } };
vm.createContext(ctx);
vm.runInContext(js + '\n;globalThis.__ = {get S(){return S}, chayKB, vaoCa, raCa, khaiViec, khaiBuCa, goiY, doiChieu, coCa, thieuCong, duyet, luong, KB, NS, veTA, veQL, ve, D, dt, loai};', ctx);
const _ = ctx.__;
let pass = 0, fail = 0;
const ok = (t, c, x = '') => { c ? pass++ : fail++; console.log((c ? '✔ ' : '✘ ') + t + (x ? '  → ' + x : '')); };
const loi = fn => { try { fn(); return null; } catch (e) { return String(e.message || e); } };
const gio = m => { _.S.now = new Date(_.S.now.getTime() + m * 60000); };
const veHet = () => { for (const v of Object.keys(_.NS)) { _.S.vai = v; for (const t of ['cc', 'bang', 'luong', 'duyet', 'thieu', 'gia']) { _.S.tab = t; _.ve(); } } };

// mọi kịch bản dựng và vẽ được ở mọi vai / mọi tab
for (const k of _.KB) { const e = loi(() => { _.chayKB(k.id); veHet(); }); ok('dựng + vẽ ' + k.ten, !e, e || ''); }

// KB1
_.chayKB('kb1'); _.vaoCa('an'); for (const g of _.goiY('an')) _.khaiViec('an', g); gio(240); _.raCa('an');
let vs = _.S.viecs; ok('KB1: 3 việc gợi ý, tất cả đã khớp, không cờ', vs.length === 3 && vs.every(v => { const d = _.doiChieu(v); return d.khop && !d.co.length; }), vs.map(v => v.loai).join(','));
_.duyet(_.S.cas.map(c => c.id), vs.map(v => v.id), 'duyet'); ok('KB1: duyệt lô xong lương An tăng buổi 6S2', _.luong('an').lops[0].tg === 4);
// KB2
_.chayKB('kb2'); const v2 = _.khaiViec('an', { loai: 'tro_giang', lop: '6S1', bat: '18:00', ket: '19:30' });
ok('KB2: dạy hộ 6S1 → làm hộ Bình', _.doiChieu(v2).ho === 'Bình' && _.doiChieu(v2).khop);
gio(120); _.raCa('an'); _.duyet(_.S.cas.map(c => c.id), [v2.id], 'duyet');
let L = _.luong('an'); ok('KB2: lương An có lớp 6S1 (dạy hộ), bậc 1.000.000', L.lops.some(l => l.lop === '6S1' && !l.chu && l.bac === 1000000 && l.tg === 1), JSON.stringify(L.lops.map(l => [l.lop, l.tg, l.chu])));
// KB3
_.chayKB('kb3'); const gt = _.goiY('dung').find(g => g.loai === 'trong_thi'); const vd = _.khaiViec('dung', gt);
const va = _.khaiViec('an', { loai: 'trong_thi', lop: '9A1', bat: '19:30', ket: '21:30' }); gio(180); _.raCa('dung'); _.raCa('an');
_.duyet(_.S.cas.map(c => c.id), [vd.id, va.id], 'duyet');
ok('KB3: Dũng trông thi lớp mình → +1 buổi TG, 0đ riêng', _.luong('dung').lops[0].tg === 5 && _.luong('dung').tNgoai === 0, 'TG ' + _.luong('dung').lops[0].tg);
ok('KB3: An trông thi lớp khác 2 giờ = 100.000đ', _.luong('an').tNgoai === 100000);
// KB4
_.chayKB('kb4'); const d1 = _.khaiViec('an', { loai: 'bo_tro_dac_biet', bat: '14:00', ket: '15:30', hs: 'Đức Nam' }); const d2 = _.khaiViec('an', { loai: 'hop', bat: '15:30', ket: '16:30' });
ok('KB4: việc khác không ghi chú bị chặn', /ghi chú/.test(loi(() => _.khaiViec('an', { loai: 'khac', bat: '10:00', ket: '11:00' })) || ''));
ok('KB4: họp có cờ chưa có đơn giá, không khớp', _.doiChieu(d2).co.includes('Chưa có đơn giá') && !_.doiChieu(d2).khop);
gio(200); _.raCa('an'); _.duyet(_.S.cas.map(c => c.id), [d1.id, d2.id], 'duyet'); ok('KB4: bổ trợ đặc biệt 150.000 + họp 0đ', _.luong('an').tNgoai === 150000);
// KB5
_.chayKB('kb5'); const c5 = _.S.cas[0]; ok('KB5: cờ quên ra ca', _.coCa(c5).includes('Quên ra ca'));
ok('KB5: duyệt bị chặn khi chưa có giờ ra', /chưa có giờ ra/.test(loi(() => _.duyet([c5.id], [], 'duyet')) || ''));
c5.raChot = _.dt(c5.ngay, '19:35'); ok('KB5: chốt giờ xong duyệt được, giờ gốc giữ nguyên', !loi(() => _.duyet([c5.id], _.S.viecs.map(v => v.id), 'duyet')) && c5.ra === null);
// KB6
_.chayKB('kb6'); const c6 = _.khaiBuCa('an', _.D(0), '17:00', '19:35'); const v6 = _.khaiViec('an', { loai: 'tro_giang', ngay: _.D(0), bat: '18:00', ket: '19:30' });
ok('KB6: khai bù trong 24 giờ được, có nhãn', c6.khaiBu && v6.khaiBu && _.doiChieu(v6).co.includes('Khai bù') && v6.tt === 'cho');
// KB7
_.chayKB('kb7'); ok('KB7: khai bù quá 24 giờ bị chặn', /24 giờ/.test(loi(() => _.khaiBuCa('an', _.D(0), '17:00', '19:35')) || ''));
// KB8
_.chayKB('kb8'); const t8 = _.thieuCong().map(x => x.d.slice(8) + ' ' + x.ten);
ok('KB8: thiếu công đúng 4 dòng (13/10: 6S2, 8B1 · 14/10: ca trực K6, 6S1)', t8.length === 4 && !t8.some(x => /9A1|7A1/.test(x)), t8.join(' | '));
// KB9
_.chayKB('kb9'); const co9 = _.S.viecs.map(v => _.NS[v.ns].ten + ' ' + v.loai + (v.lop || '') + ': ' + _.doiChieu(v).co.join('+'));
ok('KB9: đủ 4 loại cờ', ['Buổi đã huỷ', 'Hai TA cùng buổi', 'Trước giờ vào ca', 'Trùng giờ việc khác'].every(c => co9.some(x => x.includes(c))), '\n     ' + co9.join('\n     '));
// KB10
_.chayKB('kb10'); const ct = _.S.viecs.find(v => v.loai === 'cham_thi');
ok('KB10: từ chối không lý do bị chặn', /lý do/.test(loi(() => _.duyet([], [ct.id], 'tuchoi', '')) || ''));
_.duyet([], [ct.id], 'tuchoi', 'Chưa có phân công chấm thi'); _.duyet(_.S.cas.map(c => c.id), _.S.viecs.filter(v => v.tt === 'cho').map(v => v.id), 'duyet');
ok('KB10: 1 từ chối kèm lý do, 5 việc còn lại đã duyệt', ct.tt === 'tuchoi' && ct.lydo && _.S.viecs.filter(v => v.tt === 'duyet').length === 5);
// KB11
_.chayKB('kb11'); const Lc = _.luong('chi'), La = _.luong('an');
ok('KB11: Chi 8B1 TG 0/8, BTVN 3/7, chỉ tiêu bổ trợ 16 giờ', Lc.lops.find(l => l.lop === '8B1').tg === 0 && Lc.nLop === 2, 'nLop ' + Lc.nLop);
ok('KB11: An có 8B1 dạy hộ 2/8', La.lops.some(l => l.lop === '8B1' && !l.chu && l.tg === 2) && La.nLop === 1);
// KB12
_.chayKB('kb12'); const truoc = _.luong('an').tNgoai; _.S.gia.push({ ma: 'gia_trong_thi', ten: 'Trông thi lớp khác', gia: 60000, dv: 'đ/giờ', tu: '2026-11-01', ai: 'CEO' });
ok('KB12: thêm giá 60.000 từ 01/11 không đổi lương tháng 10', truoc === 100000 && _.luong('an').tNgoai === 100000);
veHet();
console.log(`\n${pass} đạt · ${fail} hỏng`);
