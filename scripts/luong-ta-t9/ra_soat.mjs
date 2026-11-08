// RÀ SOÁT dữ liệu trợ giảng (chấm công · việc · duyệt · lương) — CHỈ ĐỌC. Chạy từ GỐC repo:
//   node scripts/luong-ta-t9/ra_soat.mjs [tu=2026-10-01] [den=hôm qua]
import pg from 'pg'; import fs from 'fs';
const env = fs.readFileSync('.env', 'utf8');
const url = (env.match(/^DATABASE_URL_RO=(.*)$/m) || env.match(/^DATABASE_URL=(.*)$/m))[1].replace(/^['"]|['"]$/g, '');
const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } }); await c.connect();
const q = async (s, p) => (await c.query(s, p)).rows;
const [TU = '2026-10-01', DEN] = process.argv.slice(2);
const den = DEN || (await q(`select ((now() at time zone 'Asia/Ho_Chi_Minh')::date - 1)::text d`))[0].d;
const P = [TU, den];
const muc = async (ten, sql, p = P) => { const r = await q(sql, p); console.log(`\n## ${ten} — ${r.length}`); if (r.length) console.table(r.slice(0, 60)); return r; };
const gio = `to_char(%s at time zone 'Asia/Ho_Chi_Minh','HH24:MI')`;
const g = (x) => gio.replace('%s', x);
const CA = `(select c.*, n.ho_ten, coalesce(c.vao_chot,c.vao_at) v, coalesce(c.ra_chot,c.ra_at) r from ta_cham_cong c join nhan_su n on n.id=c.nhan_su_id where c.ngay between $1 and $2)`;

console.log(`RÀ SOÁT TA ${TU} → ${den}`);
console.log((await q(`select (select count(*) from ta_cham_cong where ngay between $1 and $2)::int ca, (select count(*) from ta_cong_viec where ngay between $1 and $2)::int viec,
  (select count(distinct nhan_su_id) from ta_cham_cong where ngay between $1 and $2)::int nguoi`, P))[0]);

// ── A. CA CÓ MẶT ──
await muc('A1 Ca trùng giờ nhau (cùng người cùng ngày, chưa từ chối)', `
  select a.ho_ten, a.ngay::text, ${g('a.v')}||'–'||coalesce(${g('a.r')},'?') ca1, a.duyet d1, ${g('b.v')}||'–'||coalesce(${g('b.r')},'?') ca2, b.duyet d2, a.khai_bu kb1, b.khai_bu kb2
    from ${CA} a join ${CA} b on a.nhan_su_id=b.nhan_su_id and a.ngay=b.ngay and a.id<b.id
   where a.duyet<>'tu_choi' and b.duyet<>'tu_choi' and tstzrange(a.v, coalesce(a.r,'infinity')) && tstzrange(b.v, coalesce(b.r,'infinity')) order by 2,1`);
await muc('A2 Ca dài < 1 phút (chưa từ chối)', `select ho_ten, ngay::text, ${g('v')} vao, ${g('r')} ra, duyet from ${CA} x where duyet<>'tu_choi' and r < v + interval '1 minute' order by 2`);
await muc('A3 Quên checkout (chưa có giờ ra, ngày đã qua)', `select ho_ten, ngay::text, ${g('v')} vao, duyet from ${CA} x where r is null order by 2`);
await muc('A4 Ca dài > 9 giờ', `select ho_ten, ngay::text, ${g('v')}||'–'||${g('r')} ca, round(extract(epoch from r-v)/3600.0,1) gio, khai_bu, duyet from ${CA} x where duyet<>'tu_choi' and r > v + interval '9 hours' order by gio desc`);
await muc('A5 Ca vào trước 6:30 hoặc ra sau 22:30', `select ho_ten, ngay::text, ${g('v')}||'–'||coalesce(${g('r')},'?') ca, khai_bu, duyet from ${CA} x where duyet<>'tu_choi' and ((v at time zone 'Asia/Ho_Chi_Minh')::time < '06:30' or (r at time zone 'Asia/Ho_Chi_Minh')::time > '22:30') order by 2`);
await muc('A6 Cột ngày ≠ ngày của giờ vào', `select ho_ten, ngay::text, (v at time zone 'Asia/Ho_Chi_Minh')::date::text ngay_vao, duyet from ${CA} x where (v at time zone 'Asia/Ho_Chi_Minh')::date <> ngay`);
await muc('A7 Tỉ lệ khai bù theo người (≥ 40% số ca)', `select ho_ten, count(*)::int ca, count(*) filter (where khai_bu)::int khai_bu, count(*) filter (where nguon='nhap_ho')::int nhap_ho,
   round(100.0*count(*) filter (where khai_bu)/count(*))::int pct from ${CA} x where duyet<>'tu_choi' group by 1 having count(*) filter (where khai_bu) >= 0.4*count(*) and count(*) >= 3 order by pct desc`);
await muc('A8 Ca có mặt không ghi việc nào (chưa từ chối)', `select ho_ten, count(*)::int so_ca, string_agg(to_char(ngay,'DD/MM'), ' ' order by ngay) ngay from ${CA} x
   where duyet<>'tu_choi' and not exists (select 1 from ta_cong_viec cv where cv.cham_cong_id=x.id and cv.trang_thai<>'tu_choi') group by 1 order by 2 desc`);

// ── B. VIỆC ──
const V = `(select cv.*, n.ho_ten, lv.ten lten, lv.tinh_vao, lv.don_vi, lv.nhom, l.ten_lop from ta_cong_viec cv join nhan_su n on n.id=cv.nhan_su_id join ta_loai_viec lv on lv.ma=cv.loai_viec left join lop l on l.id=cv.lop_id where cv.ngay between $1 and $2)`;
await muc('B1 Việc ĐÃ DUYỆT mà ca của nó chưa duyệt / bị từ chối (lương sẽ không tính)', `select v.ho_ten, v.ngay::text, v.lten, v.ten_lop, cc.duyet ca from ${V} v join ta_cham_cong cc on cc.id=v.cham_cong_id where v.trang_thai='da_duyet' and cc.duyet<>'da_duyet' order by 2`);
await muc('B2 Việc ghi ngoài giờ ca (sớm/trễ > 15 phút)', `select v.ho_ten, v.ngay::text, v.lten, v.ten_lop, to_char(v.gio_bat_dau,'HH24:MI')||'–'||to_char(v.gio_ket_thuc,'HH24:MI') viec,
   ${g('coalesce(cc.vao_chot,cc.vao_at)')}||'–'||coalesce(${g('coalesce(cc.ra_chot,cc.ra_at)')},'?') ca, v.trang_thai
   from ${V} v join ta_cham_cong cc on cc.id=v.cham_cong_id where v.trang_thai<>'tu_choi' and cc.duyet<>'tu_choi' and v.gio_bat_dau is not null and (
     v.gio_bat_dau < (coalesce(cc.vao_chot,cc.vao_at) at time zone 'Asia/Ho_Chi_Minh')::time - interval '15 minutes'
     or v.gio_ket_thuc > (coalesce(cc.ra_chot,cc.ra_at) at time zone 'Asia/Ho_Chi_Minh')::time + interval '15 minutes') order by 2,1`);
await muc('B3 Cùng một buổi lớp ghi trợ giảng ≥ 2 lần (cùng hoặc khác người)', `select v.ten_lop, v.ngay::text, count(*)::int lan, string_agg(v.ho_ten||' ['||v.trang_thai||']', ' · ') ai from ${V} v
   where v.tinh_vao='tg' and v.trang_thai<>'tu_choi' group by v.ten_lop, v.ngay, v.lop_id having count(*) > 1 order by 2`);
await muc('B4 Việc tính theo giờ mà thiếu giờ', `select v.ho_ten, v.ngay::text, v.lten, v.trang_thai from ${V} v where v.don_vi='gio' and (v.gio_bat_dau is null or v.gio_ket_thuc is null) and v.trang_thai<>'tu_choi'`);
await muc('B5 Trợ giảng lớp và bổ trợ CHỒNG GIỜ (một người ở 2 chỗ)', `select a.ho_ten, a.ngay::text, a.lten||' '||coalesce(a.ten_lop,'')||' '||to_char(a.gio_bat_dau,'HH24:MI')||'–'||to_char(a.gio_ket_thuc,'HH24:MI') viec1,
   b.lten||' '||coalesce(b.ten_lop,'')||' '||to_char(b.gio_bat_dau,'HH24:MI')||'–'||to_char(b.gio_ket_thuc,'HH24:MI') viec2
   from ${V} a join ${V} b on a.nhan_su_id=b.nhan_su_id and a.ngay=b.ngay and a.id<>b.id
  where a.tinh_vao='tg' and b.tinh_vao<>'tg' and a.trang_thai<>'tu_choi' and b.trang_thai<>'tu_choi'
    and a.gio_bat_dau < b.gio_ket_thuc and b.gio_bat_dau < a.gio_ket_thuc order by 2,1`);
await muc('B6 Trợ giảng 2 lớp CHỒNG GIỜ', `select a.ho_ten, a.ngay::text, a.ten_lop l1, to_char(a.gio_bat_dau,'HH24:MI')||'–'||to_char(a.gio_ket_thuc,'HH24:MI') g1, b.ten_lop l2, to_char(b.gio_bat_dau,'HH24:MI')||'–'||to_char(b.gio_ket_thuc,'HH24:MI') g2
   from ${V} a join ${V} b on a.nhan_su_id=b.nhan_su_id and a.ngay=b.ngay and a.id<b.id
  where a.tinh_vao='tg' and b.tinh_vao='tg' and a.trang_thai<>'tu_choi' and b.trang_thai<>'tu_choi' and a.gio_bat_dau < b.gio_ket_thuc and b.gio_bat_dau < a.gio_ket_thuc order by 2`);
await muc('B7 Việc ngoài package chưa có đơn giá', `select v.lten, count(*)::int n, string_agg(distinct v.ho_ten, ', ') ai from ${V} v
   where v.nhom='ngoai_package' and v.trang_thai<>'tu_choi' and not exists (select 1 from ta_don_gia d where d.ma='gia_'||v.loai_viec and d.hieu_luc_tu<=v.ngay and d.xoa_at is null) group by 1`);
await muc('B8 GV kiêm TA vẫn ghi công (không nhận lương TA)', `select v.ho_ten, count(*)::int viec, count(*) filter (where v.trang_thai='cho_duyet')::int cho_duyet from ${V} v where public._la_gv_kiem_ta(v.nhan_su_id) and v.trang_thai<>'tu_choi' group by 1 order by 2 desc`);
await muc('B9 Việc "khác" / ghi chú lạ', `select v.ho_ten, v.ngay::text, v.lten, v.ghi_chu, v.trang_thai from ${V} v where v.loai_viec='khac' and v.trang_thai<>'tu_choi' order by 2`);
await muc('B10 Bổ trợ cùng 1 em ghi ≥ 2 lần cùng ngày', `select v.ho_ten, v.ngay::text, v.hoc_sinh, count(*)::int lan, string_agg(v.lten,' · ') viec from ${V} v
   where v.tinh_vao='bo_tro' and v.hoc_sinh is not null and btrim(v.hoc_sinh)<>'' and v.trang_thai<>'tu_choi' group by 1,2,3 having count(*)>1`);

// ── C. DUYỆT ──
await muc('C1 Còn chờ duyệt theo tháng', `select to_char(ngay,'MM/YYYY') thang, count(*) filter (where k='ca')::int ca, count(*) filter (where k='viec')::int viec from (
   select ngay, 'ca' k from ta_cham_cong where duyet='cho_duyet' and ngay between $1 and $2 union all select ngay, 'viec' from ta_cong_viec where trang_thai='cho_duyet' and ngay between $1 and $2) x group by 1 order by 1`);
await muc('C2 Người tự duyệt công của chính mình', `select n.ho_ten, count(*)::int from (select nhan_su_id, duyet_boi from ta_cham_cong where ngay between $1 and $2 union all select nhan_su_id, duyet_boi from ta_cong_viec where ngay between $1 and $2) x
   join nhan_su n on n.id=x.nhan_su_id where x.duyet_boi = x.nhan_su_id group by 1`);
await muc('C3 Ai duyệt bao nhiêu', `select coalesce(n.ho_ten,'(chưa)') nguoi_duyet, count(*)::int from (select duyet_boi from ta_cham_cong where ngay between $1 and $2 and duyet<>'cho_duyet' union all select duyet_boi from ta_cong_viec where ngay between $1 and $2 and trang_thai<>'cho_duyet') x left join nhan_su n on n.id=x.duyet_boi group by 1 order by 2 desc`);
await muc('C4 Từ chối theo người', `select n.ho_ten, count(*)::int tu_choi, string_agg(distinct coalesce(x.ly_do_duyet,'(không lý do)'), ' | ') ly_do from (
   select nhan_su_id, ly_do_duyet from ta_cham_cong where duyet='tu_choi' and ngay between $1 and $2 union all select nhan_su_id, ly_do_duyet from ta_cong_viec where trang_thai='tu_choi' and ngay between $1 and $2) x join nhan_su n on n.id=x.nhan_su_id group by 1 order by 2 desc`);

// ── D. THIẾU CÔNG ──
await muc('D1 Buổi/ca đã diễn ra chưa ai ghi công — theo người phụ trách', `select coalesce(nguoi_phu_trach,'(chưa phân TA)') ai, count(*)::int n,
   count(*) filter (where loai='buoi')::int buoi_lop, count(*) filter (where loai='ca')::int ca_truc, count(*) filter (where loai not in ('buoi','ca'))::int bo_tro
   from public._ta_buoi_thieu_cong($1::date, $2::date) group by 1 order by 2 desc`);

// ── E. LƯƠNG ──
for (const ky of ['2026-10-01']) {
  await muc(`E1 Lương ${ky.slice(5, 7)}: bảng tóm tắt`, `select ho_ten, package_lop::int lop, bo_tro_gio::float gio_bt, bo_tro_tien::int bt, ngoai_package::int ngoai, tien_phat::int phat, net::int net,
     (chi_tiet->'bo_tro'->>'gio_trung')::float trung from _ta_luong_tinh($1::date) order by net desc`, [ky]);
  await muc(`E2 Tháng ${ky.slice(5, 7)}: trạng thái công theo người`, `select n.ho_ten,
     count(*) filter (where k='ca')::int ca, count(*) filter (where k='ca' and d='da_duyet')::int ca_ok, count(*) filter (where k='ca' and d='cho_duyet')::int ca_cho,
     count(*) filter (where k='viec')::int viec, count(*) filter (where k='viec' and d='da_duyet')::int viec_ok, count(*) filter (where k='viec' and d='cho_duyet')::int viec_cho,
     count(*) filter (where d='tu_choi')::int tu_choi, public._la_gv_kiem_ta(x.ns) gv
     from (select nhan_su_id ns, 'ca' k, duyet d from ta_cham_cong where ky_thang = $1::date union all select nhan_su_id, 'viec', trang_thai from ta_cong_viec where ky = $1::date) x
     join nhan_su n on n.id=x.ns group by n.ho_ten, x.ns order by n.ho_ten`.replace('ky_thang = $1::date', "date_trunc('month', ngay) = $1::date"), [ky]);
}
await c.end();
