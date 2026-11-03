// Chuyển bản đồ mới K3 / K5 sang 3 tầng "chuyên đề › nhóm › dạng" dưới chủ đề bao trùm (Thùy 03/11).
//   chủ đề cũ -> CHUYÊN ĐỀ mới · chuyên đề cũ -> NHÓM mới · nhóm cũ (= 1 dạng của bản đồ cũ) -> DẠNG mới.
// Chỉ THÊM hàng mới (mã gốc bất biến: NNB không thành NDB được). KHÔNG xoá cây cũ — việc đó là bước riêng, chờ Thùy gật.
// Ca nhóm cũ đang có dạng con (K5 Tổng Tỉ · NNB00860): bỏ nhóm làm 1 tầng, dạng con CHUYỂN (giữ nguyên mã NDB) lên nhóm mới.
// Mặc định dry-run (ROLLBACK, in cây mới). Ghi thật: --ghi. Chuỗi kết nối ghi: DATABASE_URL_RW (truyền lúc gọi, đừng để trong .env).
import pg from 'pg';
import fs from 'fs';

const GHI = process.argv.includes('--ghi');
const env = { ...Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => /^[A-Z_]+=/.test(l))
  .map(l => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')])), ...process.env };
const conn = env.DATABASE_URL_RW || env.DATABASE_URL;

// khối -> các chủ đề mới (theo thứ tự) -> mã chủ đề CŨ (dai_ban_do.ma_chu_de) thành chuyên đề
const SPEC = {
  '3': [
    { ten: 'Số tự nhiên', cu: ['T10301', 'T10302', 'T10303', 'T10305', 'T10306'] },
    { ten: 'Hình học', cu: ['T10304'] },
  ],
  '5': [
    { ten: 'Phép toán với các số', cu: ['T10501', 'T10502', 'T10503', 'T10504', 'T10505', 'T10506'] },
    { ten: 'Bài toán về tỉ số', cu: ['T10507'] },
    { ten: 'Toán chuyển động', cu: ['T10508'] },
    { ten: 'Thống kê xác suất', cu: ['T10509'] },
    { ten: 'Diện tích các hình', cu: ['T10510'] },
  ],
};

const c = new pg.Client({ connectionString: conn });
await c.connect();
const q = async (s, p) => (await c.query(s, p)).rows;
const one = async (s, p) => (await q(s, p))[0];
const rep = { chu_de: 0, chuyen_de: 0, nhom: 0, dang: 0, dang_tu_cay_cu: 0, dang_tu_ban_do_cu: 0, dang_chuyen_len: 0, doi_ung_sua: 0, doi_ung_them: 0 };
const cay = [];

try {
  await c.query('begin');
  for (const [khoi, groups] of Object.entries(SPEC)) {
    for (const g of groups) {
      if (await one(`select 1 from dai_bdm_chu_de where khoi=$1 and ten=$2`, [khoi, g.ten]))
        throw new Error(`K${khoi}: đã có chủ đề «${g.ten}» — script đã chạy rồi? dừng, không tạo trùng`);
    }
    const bdmUsed = new Set(); // nhóm cũ đã dùng hết (kiểm cuối)
    const cdMoi = [];
    for (const g of groups) {
      const cd = await one(`insert into dai_bdm_chu_de(khoi, ten, nhanh) values ($1,$2,'toan') returning id`, [khoi, g.ten]);
      rep.chu_de++; cdMoi.push(cd.id);
      cay.push(`K${khoi} ▸ CHỦ ĐỀ ${g.ten} [${cd.id}]`);
      for (const maCu of g.cu) {
        const tenCu = (await one(`select ten_chu_de t from dai_ban_do where khoi=$1 and ma_chu_de=$2 and xoa_at is null limit 1`, [khoi, maCu]))?.t;
        if (!tenCu) throw new Error(`K${khoi}: không thấy chủ đề cũ ${maCu}`);
        const ch = await one(`insert into dai_bdm_chuyen_de(ten) values ($1) returning id`, [tenCu]);
        await q(`insert into dai_bdm_o(chu_de_id, chuyen_de_id) values ($1,$2)`, [cd.id, ch.id]);
        rep.chuyen_de++;
        cay.push(`    ▸ CHUYÊN ĐỀ ${tenCu} [${ch.id}]`);
        // bản sao 3 tầng cũ trong bdm (cùng khối, cùng tên chủ đề cũ) -> lấy mô tả chuyên đề
        const bdmCd = await one(`select id from dai_bdm_chu_de where khoi=$1 and ten=$2 and id <> $3 order by thu_tu limit 1`, [khoi, tenCu, cd.id]);
        const cdCu = await q(`select distinct ma_chuyen_de m, ten_chuyen_de t from dai_ban_do where khoi=$1 and ma_chu_de=$2 and xoa_at is null order by 1`, [khoi, maCu]);
        for (const cy of cdCu) {
          const bdmCh = bdmCd && await one(
            `select ch.mo_ta from dai_bdm_o o join dai_bdm_chuyen_de ch on ch.id=o.chuyen_de_id where o.chu_de_id=$1 and ch.ten=$2 limit 1`, [bdmCd.id, cy.t]);
          const nh = await one(`insert into dai_bdm_nhom(chu_de_id, chuyen_de_id, ten, mo_ta) values ($1,$2,$3,$4) returning id`,
            [cd.id, ch.id, cy.t, bdmCh?.mo_ta ?? '']);
          rep.nhom++;
          cay.push(`        ▸ NHÓM ${cy.t} [${nh.id}]`);
          const dangCu = await q(`select ma_dang, ten_dang, mo_ta_ngan, muc_do, bac_toi_thieu from dai_ban_do
                                   where khoi=$1 and ma_chuyen_de=$2 and xoa_at is null order by ma_dang`, [khoi, cy.m]);
          for (const d of dangCu) {
            const nhomCu = await q(`select n.* from dai_bdm_doi_ung u join dai_bdm_nhom n on n.id=u.dich_nhom
                                     where u.ma_dang_cu=$1 and n.chu_de_id=$2`, [d.ma_dang, bdmCd?.id]);
            if (nhomCu.length > 1) throw new Error(`${d.ma_dang}: đối ứng tới ${nhomCu.length} nhóm`);
            const nc = nhomCu[0];
            const con = nc ? await q(`select id from dai_bdm_dang_bai where nhom_id=$1 order by thu_tu`, [nc.id]) : [];
            if (nc) bdmUsed.add(nc.id);
            if (nc && con.length) {
              // GỘP LÊN: nhóm cũ có dạng con -> con thành dạng ngang hàng (đổi nhom_id, giữ mã NDB)
              for (const k of con) {
                await q(`update dai_bdm_dang_bai set nhom_id=$1, thu_tu=(select coalesce(max(thu_tu),0)+1 from dai_bdm_dang_bai where nhom_id=$1) where id=$2`, [nh.id, k.id]);
                rep.dang_chuyen_len++;
                cay.push(`            ▸ DẠNG (chuyển lên từ nhóm cũ «${nc.ten}») [${k.id}]`);
              }
              const u = await q(`select id from dai_bdm_doi_ung where ma_dang_cu=$1 and dich_nhom=$2`, [d.ma_dang, nc.id]);
              await q(`update dai_bdm_doi_ung set dich_dang_bai=$1, dich_nhom=null where id=$2`, [con[0].id, u[0].id]); rep.doi_ung_sua++;
              for (const k of con.slice(1)) { await q(`insert into dai_bdm_doi_ung(ma_dang_cu, dich_dang_bai) values ($1,$2)`, [d.ma_dang, k.id]); rep.doi_ung_them++; }
              continue;
            }
            const dg = await one(`insert into dai_bdm_dang_bai(nhom_id, ten, mo_ta, vi_du, vi_du_file_url, vi_du_ten_file, ly_thuyet, ly_thuyet_file_url, ly_thuyet_ten_file, muc_do, bac_toi_thieu)
                                   values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) returning id`,
              nc ? [nh.id, nc.ten, nc.mo_ta, '', null, null, nc.ly_thuyet, nc.ly_thuyet_file_url, nc.ly_thuyet_ten_file, d.muc_do, d.bac_toi_thieu]
                 : [nh.id, d.ten_dang, d.mo_ta_ngan ?? '', '', null, null, '', null, null, d.muc_do, d.bac_toi_thieu]);
            rep.dang++;
            if (nc) {
              rep.dang_tu_cay_cu++;
              await q(`update dai_bdm_doi_ung set dich_dang_bai=$1, dich_nhom=null where ma_dang_cu=$2 and dich_nhom=$3`, [dg.id, d.ma_dang, nc.id]); rep.doi_ung_sua++;
            } else {
              rep.dang_tu_ban_do_cu++;
              await q(`insert into dai_bdm_doi_ung(ma_dang_cu, dich_dang_bai) values ($1,$2)`, [d.ma_dang, dg.id]); rep.doi_ung_them++;
            }
            cay.push(`            ▸ DẠNG ${nc ? nc.ten : d.ten_dang + '  (MỚI từ bản đồ cũ)'} [${dg.id}]`);
          }
        }
      }
    }
    // mọi nhóm cũ phải đã được dùng — sót là lệch, dừng
    const sot = await q(`select n.id, n.ten from dai_bdm_nhom n join dai_bdm_chu_de c on c.id=n.chu_de_id
                          where c.khoi=$1 and c.ten = any($2) and n.id <> all($3) and c.id <> all($4)`, [khoi,
      (await q(`select distinct ten_chu_de t from dai_ban_do where khoi=$1 and ma_chu_de = any($2)`, [khoi, groups.flatMap(g => g.cu)])).map(r => r.t), [...bdmUsed], cdMoi]);
    if (sot.length) throw new Error(`K${khoi}: ${sot.length} nhóm cũ KHÔNG được chuyển: ` + sot.map(s => s.id + ' ' + s.ten).join(' | '));
  }
  console.log(cay.join('\n'));
  console.log('\nTỔNG', JSON.stringify(rep));
  await c.query(GHI ? 'commit' : 'rollback');
  console.log(GHI ? '✔ ĐÃ GHI (commit)' : '↩ DRY-RUN — đã ROLLBACK, DB không đổi. Thêm --ghi để ghi thật.');
} catch (e) {
  await c.query('rollback').catch(() => {});
  console.error('✘ LỖI, đã rollback:', e.message);
  process.exitCode = 1;
} finally { await c.end(); }
