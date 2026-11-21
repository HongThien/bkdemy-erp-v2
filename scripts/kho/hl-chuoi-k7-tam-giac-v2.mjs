// Dựng LẠI cây Hình–Luyện KHỐI 7 · "Tam giác bằng nhau" theo file Thùy gửi 21/11/2026 (`Documents\Mô hình 7.docx`), sau khi xoá chuỗi 07/11.
// Luật Thùy 21/11: (1) BỎ kiểu nhánh chính–phụ — mọi nhánh giả thiết chỉ là nhánh (chinh=false) · (2) "nhóm" = nhóm bài chỉ ở MH.126 (nhóm 1, nhóm 2); các "nhóm" của cụng đầu
// là nhánh giả thiết song song, KHÔNG sự kiện · (3) tam giác cân: 3 nhánh riêng, không gộp nhóm · (4) MH.133 "Hai trung điểm" BỎ · (5) chỉ dựng CÂY (giả thiết · bài · tiền đề), hình + lời giải làm sau.
// Chỉ ghi tiền đề file nói rõ (và B5→B6 cùng kiểu của mô hình nhọn); chỗ file im lặng KHÔNG đoán — danh sách hỏi Thùy ở cuối nhật ký.
//   node scripts/kho/hl-chuoi-k7-tam-giac-v2.mjs          ⇒ chạy thử 1 transaction rồi ROLLBACK
//   node scripts/kho/hl-chuoi-k7-tam-giac-v2.mjs --ghi    ⇒ commit
import { createRequire } from 'node:module'
import fs from 'node:fs'
const pg = createRequire(process.cwd() + '/')('pg')
const GHI = process.argv.includes('--ghi')
const T = String.raw

// nhánh: { ten, gt, bai:[{k,pb,td:[k]}], con:[nhánh] }   ·   td = khoá bài tiền đề (cùng nhánh hoặc tổ tiên)
const CAN = (gt, ten) => ({
  ten, gt,
  bai: [
    { k: 'B1', pb: T`Chứng minh $\triangle ABD=\triangle ACE$.`, td: [] },
    { k: 'B2', pb: T`Chứng minh tam giác $ADE$ cân.`, td: ['B1'] },
    { k: 'B3', pb: T`Chứng minh $DE\parallel BC$.`, td: ['B2'] },
    { k: 'B4', pb: T`Chứng minh $\triangle BEC=\triangle CDB$.`, td: [] },
    { k: 'B5', pb: T`Chứng minh $\triangle BEI=\triangle CDI$.`, td: ['B1', 'B4'] },
    { k: 'B6', pb: T`Chứng minh tam giác $BIC$ cân.`, td: ['B5'] },
    { k: 'B7', pb: T`Chứng minh ba điểm $A, I, M$ thẳng hàng.`, td: ['B6'] },
  ],
  con: [{
    ten: 'K trung điểm DE', gt: T`Gọi $K$ là trung điểm của $DE$.`,
    bai: [
      { k: 'B8', pb: T`Chứng minh ba điểm $A, I, K$ thẳng hàng.`, td: [] },
      { k: 'B9', pb: T`Chứng minh bốn điểm $A, I, M, K$ thẳng hàng.`, td: ['B8'] },
    ], con: [],
  }],
})

const MH = {
  // ── Phân giác tam giác vuông: gốc = NHÓM BÀI 1 (3 sự kiện đã có sẵn do Thùy dựng) ──
  'MH.126': {
    gtMoi: null, // giữ nguyên giả thiết gốc (đầu ra nhóm 1) của Thùy
    nhomGoc: {
      thanhVien: [
        { ten: 'Thành viên 1', cho: [1, 3], hoi: [2], gt: T`Cho tam giác $ABC$ vuông tại $A$. $BD$ là phân giác của góc $B$ ($D\in AC$). Từ $D$ kẻ $DE\perp BC$ ($E\in BC$).`, bai: [T`Chứng minh $\triangle ABD=\triangle EBD$.`] },
        { ten: 'Thành viên 2', cho: [2, 3], hoi: [1], gt: T`Cho tam giác $ABC$ vuông tại $A$. Trên $BC$ lấy điểm $E$ sao cho $BE=BA$. Qua $E$ kẻ đường vuông góc với $BC$ cắt $AC$ tại $D$.`, bai: [T`Chứng minh $\triangle ABD=\triangle EBD$.`] },
        { ten: 'Thành viên 3', cho: [1, 2], hoi: [3], gt: T`Cho tam giác $ABC$ vuông tại $A$. $BD$ là phân giác của góc $B$ ($D\in AC$). Trên $BC$ lấy điểm $E$ sao cho $BE=BA$.`, bai: [T`Chứng minh $\triangle ABD=\triangle EBD$.`] },
      ],
      // sau nhóm 1: 3 bài ĐỘC LẬP (file: "ko bài nào dẫn đến bài nào") — treo ở chính nút nhóm, không tiền đề
      bai: [
        { k: 'B2', pb: T`Chứng minh $BD$ là đường trung trực của đoạn thẳng $AE$.`, td: [] },
        { k: 'B3', pb: T`Chứng minh tam giác $ADE$ cân.`, td: [] },
        { k: 'B4', pb: T`Chứng minh $DB$ là tia phân giác của góc $ADE$.`, td: [] },
      ],
    },
    con: [{
      // nhóm 2: 2 kiểu giả thiết cho điểm F (tách rồi nhập lại), mỗi thành viên 2 ý B5→B6
      ten: 'Nhóm 2: điểm F', gt: T`Gọi $F$ là giao điểm của $DE$ và $AB$ ($F$ thuộc tia đối của tia $AB$, $AF=CE$).`,
      nhom: {
        suKien: [T`$F$ là giao điểm của $DE$ và $AB$`, T`$F$ thuộc tia đối của tia $AB$, $AF=CE$`],
        thanhVien: [
          { ten: 'Kiểu 1', cho: [1], hoi: [2], gt: T`Gọi $F$ là giao điểm của $DE$ và $AB$.`, bai: [T`Chứng minh $\triangle ADF=\triangle EDC$.`, T`Chứng minh tam giác $BFC$ cân.`], chuoi: true },
          { ten: 'Kiểu 2', cho: [2], hoi: [1], gt: T`Trên tia đối của tia $AB$ lấy điểm $F$ sao cho $AF=CE$.`, bai: [T`Chứng minh $\triangle ADF=\triangle EDC$.`, T`Chứng minh tam giác $BFC$ cân.`], chuoi: true },
        ],
      },
      bai: [],
      con: [{ ten: 'M trung điểm FC', gt: T`Gọi $M$ là trung điểm của $FC$.`, bai: [{ k: 'B', pb: T`Chứng minh ba điểm $B, D, M$ thẳng hàng.`, td: [] }], con: [] }],
    }],
  },
  // ── Phân giác tam giác nhọn ──
  'MH.130': {
    gtMoi: T`Cho tam giác $ABC$ nhọn, $BA<BC$. $BD$ là phân giác của góc $B$ ($D\in AC$). Trên cạnh $BC$ lấy điểm $E$ sao cho $BE=BA$.`,
    bai: [
      { k: 'B1', pb: T`Chứng minh $\triangle ABD=\triangle EBD$.`, td: [] },
      { k: 'B2', pb: T`Chứng minh $BD$ là đường trung trực của đoạn thẳng $AE$.`, td: ['B1'] },
      { k: 'B3', pb: T`Chứng minh tam giác $ADE$ cân.`, td: ['B1'] },
      { k: 'B4', pb: T`Chứng minh $DB$ là tia phân giác của góc $ADE$.`, td: ['B1'] },
    ],
    con: [{
      ten: 'DE cắt AB tại F', gt: T`Tia $DE$ cắt đường thẳng $AB$ tại $F$.`,
      bai: [{ k: 'B5', pb: T`Chứng minh $\triangle ADF=\triangle EDC$.`, td: [] }, { k: 'B6', pb: T`Chứng minh tam giác $BFC$ cân.`, td: ['B5'] }],
      con: [{ ten: 'M trung điểm FC', gt: T`Gọi $M$ là trung điểm của $FC$.`, bai: [{ k: 'B7', pb: T`Chứng minh ba điểm $B, D, M$ thẳng hàng.`, td: [] }], con: [] }],
    }],
  },
  // ── Tam giác cụng đầu ──
  'MH.131': {
    gtMoi: null, // giữ nguyên
    bai: [
      { k: 'B1', pb: T`Chứng minh $\triangle AMB=\triangle DMC$.`, td: [] },
      { k: 'B2', pb: T`Chứng minh $\triangle AMC=\triangle DMB$.`, td: [] },
      { k: 'B3', pb: T`Chứng minh $AB\parallel CD$ và $AB=CD$.`, td: ['B1'] },
      { k: 'B4', pb: T`Chứng minh $AC\parallel BD$ và $AC=BD$.`, td: ['B2'] }, // file ghi "AD // BC, AD = BC" — sai (AD cắt BC tại M); sửa thành AC // BD
    ],
    con: [
      { ten: 'E, F trung điểm AB, CD', gt: T`Gọi $E, F$ lần lượt là trung điểm của $AB, CD$.`, bai: [{ k: 'B5', pb: T`Chứng minh ba điểm $E, M, F$ thẳng hàng.`, td: [] }], con: [] },
      { ten: 'AI = DJ', gt: T`Gọi $I, J$ lần lượt là điểm trên $AB, CD$ sao cho $AI=DJ$.`, bai: [{ k: 'B6', pb: T`Chứng minh ba điểm $I, M, J$ thẳng hàng.`, td: [] }], con: [] },
      { ten: 'MH ⊥ AB, MK ⊥ DC', gt: T`Kẻ $MH\perp AB$, $MK\perp DC$ ($H\in AB$, $K\in DC$).`, bai: [{ k: 'B7', pb: T`Chứng minh ba điểm $H, M, K$ thẳng hàng.`, td: [] }], con: [] },
      { ten: 'N trung điểm AB, P đối xứng C qua N', gt: T`Gọi $N$ là trung điểm của $AB$. $P$ là điểm đối xứng với $C$ qua $N$.`, bai: [{ k: 'B8', pb: T`Chứng minh ba điểm $D, B, P$ thẳng hàng.`, td: [] }, { k: 'B9', pb: T`Chứng minh $B$ là trung điểm của $DP$.`, td: ['B8'] }], con: [] },
      { ten: 'L trung điểm AC, Q đối xứng B qua L', gt: T`Gọi $L$ là trung điểm của $AC$. $Q$ là điểm đối xứng với $B$ qua $L$.`, bai: [{ k: 'B10', pb: T`Chứng minh ba điểm $D, C, Q$ thẳng hàng.`, td: [] }, { k: 'B11', pb: T`Chứng minh $C$ là trung điểm của $DQ$.`, td: ['B10'] }], con: [] },
    ],
  },
  // ── Tam giác cân: 3 nhánh riêng, mỗi nhánh có nhánh con "K trung điểm DE" ──
  'MH.132': {
    gtMoi: T`Cho tam giác $ABC$ cân tại $A$. Gọi $M$ là trung điểm của $BC$.`,
    bai: [],
    con: [
      CAN(T`Kẻ các đường cao $BD$, $CE$ ($D\in AC$, $E\in AB$), chúng cắt nhau tại $I$.`, 'Hai đường cao BD, CE'),
      CAN(T`Kẻ các đường phân giác $BD$, $CE$ ($D\in AC$, $E\in AB$), chúng cắt nhau tại $I$.`, 'Hai phân giác BD, CE'),
      CAN(T`Gọi $D, E$ lần lượt là trung điểm của $AC, AB$. Hai đoạn $BD$, $CE$ cắt nhau tại $I$.`, 'Hai trung tuyến BD, CE'),
    ],
  },
}

const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env, ssl: { rejectUnauthorized: false } }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
let nNhanh = 0, nBai = 0
const thamSo = (s) => { if ((s.match(/\$/g) || []).length % 2) throw new Error('số dấu $ lẻ: ' + s.slice(0, 60)); for (const m of s.matchAll(/\$([^$]+)\$/g)) if (/(?<![\\a-zA-Z])(triangle|widehat|perp|parallel|angle)\b/.test(m[1])) throw new Error('LaTeX mất \\ : ' + m[1]) }

async function themBai(nutId, bais, ma) {
  const id = {}
  for (const b of bais) {
    thamSo(b.pb)
    const r = (await q(`select fn_hl_them_bai($1, $2, null, null, null, $3::uuid[]) v`, [nutId, b.pb, (b.td || []).map((x) => id[x])]))[0].v
    id[b.k] = r.bai_moi; nBai++
  }
  return id
}
async function dungNhanh(cha, n, ma) {
  thamSo(n.gt)
  await q(`select fn_hl_them_gia_thiet($1, $2, $3, false)`, [cha, n.ten, n.gt]); nNhanh++
  const nut = (await q(`select m.id from hinh_mo_hinh m join hinh_mo_hinh_cha h on h.mo_hinh_id = m.id where h.cha_id = $1 and m.gia_thiet_them = $2 order by m.created_at desc limit 1`, [cha, n.gt]))[0].id
  if (n.nhom) await dungNhom(nut, n.nhom, ma, true)
  await themBai(nut, n.bai || [], ma)
  for (const k of n.con || []) await dungNhanh(nut, k, ma)
}
async function dungNhom(nut, nhom, ma, taoSuKien) {
  if (taoSuKien) await q(`select fn_hl_nhom_bai_bat($1, $2::text[])`, [nut, nhom.suKien])
  const sk = (await q(`select id from hinh_nhom_bai_su_kien where nhom_id = $1 order by thu_tu`, [nut])).map((r) => r.id)
  if (sk.length < 2) throw new Error(`${ma}: nhóm bài chưa đủ sự kiện`)
  for (const tv of nhom.thanhVien) {
    thamSo(tv.gt)
    const r = (await q(`select fn_hl_thanh_vien_them($1, $2, $3, $4::uuid[], $5::uuid[]) v`, [nut, tv.ten, tv.gt, tv.cho.map((i) => sk[i - 1]), tv.hoi.map((i) => sk[i - 1])]))[0].v
    nNhanh++
    const idTv = r.nhanh_moi
    const bais = tv.bai.map((pb, i) => ({ k: 'b' + i, pb, td: tv.chuoi && i > 0 ? ['b' + (i - 1)] : [] }))
    await themBai(idTv, bais, ma)
  }
}

await c.query('begin')
try {
  for (const [ma, d] of Object.entries(MH)) {
    const goc = (await q(`select id, vai, gia_thiet from hinh_mo_hinh where ma = $1 and khoi = '7' and phan = 'luyen' and la_mo_hinh`, [ma]))[0]
    if (!goc) throw new Error(`Không thấy ${ma}`)
    const nCon = +(await q(`select count(*) n from hinh_mo_hinh_cha where cha_id = $1`, [goc.id]))[0].n
    const nBaiCo = +(await q(`select count(*) n from hinh_baitoan where mo_hinh_id = $1`, [goc.id]))[0].n
    if (nCon || nBaiCo) throw new Error(`${ma} đã có ${nCon} nhánh / ${nBaiCo} bài — không chạy đè`)
    // Mã BT.07.<số>.NN còn dính ở nơi khác (vd BT.07.126.01/.02 nằm ở MH.061 cũ ẩn) ⇒ bộ sinh mã của cây mới đụng khoá trùng.
    // Giữ chỗ: bài tạm mang số kế tiếp (bỏ cuối lượt dựng, chừa trống 1 số — mã không bao giờ tái dùng).
    const soMh = ma.replace('MH.', '')
    const maxCu = +(await q(`select coalesce(max((substring(ma from '^BT\.07\.${soMh}\.(\.+)$'))::int), 0) m from hinh_baitoan where ma ~ '^BT\.07\.${soMh}\.\.+$'`))[0].m
    let giuCho = null
    if (maxCu > 0) {
      giuCho = (await q(`insert into hinh_baitoan(ma, mo_hinh_id, phat_bieu, cap, thu_tu) values ($1, $2, 'giữ chỗ mã', 1, 0) returning id`, [`BT.07.${soMh}.${String(maxCu + 1).padStart(2, '0')}`, goc.id]))[0].id
      console.log(`${ma}: mã BT.07.${soMh}.01–${String(maxCu).padStart(2, '0')} đang dính ở cây khác ⇒ giữ chỗ ${String(maxCu + 1).padStart(2, '0')}, bài mới bắt đầu từ ${String(maxCu + 2).padStart(2, '0')}`)
    }
    if (d.gtMoi) { thamSo(d.gtMoi); await q(`update hinh_mo_hinh set gia_thiet = $2, updated_at = now() where id = $1`, [goc.id, d.gtMoi]) }
    if (d.nhomGoc) {
      if (goc.vai !== 'nhom_bai') throw new Error(`${ma} gốc chưa là nhóm bài`)
      await dungNhom(goc.id, d.nhomGoc, ma, false)
      await themBai(goc.id, d.nhomGoc.bai, ma)
    }
    await themBai(goc.id, d.bai || [], ma)
    for (const k of d.con || []) await dungNhanh(goc.id, k, ma)
    if (giuCho) await q(`delete from hinh_baitoan where id = $1`, [giuCho])
    const sai = await q(`select * from fn_hl_sai_nhanh($1)`, [goc.id])
    if (sai.length) throw new Error(`${ma}: sai nhánh ${JSON.stringify(sai)}`)
    // luật Thùy 21/11: không còn nhánh chính–phụ
    await q(`with recursive t as (select $1::uuid id union all select c.mo_hinh_id from t join hinh_mo_hinh_cha c on c.cha_id = t.id) update hinh_mo_hinh_cha set chinh = false where chinh and cha_id in (select id from t)`, [goc.id])
    const so = await q(`select s.ma, s.so, b.phat_bieu from fn_hl_so_hien_thi($1) s join hinh_baitoan b on b.id = s.baitoan_id order by s.so`, [goc.id])
    console.log(`\n${ma}: ${so.length} bài`)
    for (const r of so) console.log(`  ${r.so}  ${r.phat_bieu}`)
  }
  // MH.133 "Hai trung điểm" — Thùy bỏ (21/11). Chặn nếu còn dính gì.
  const m133 = (await q(`select id from hinh_mo_hinh where ma = 'MH.133' and khoi = '7' and phan = 'luyen' and la_mo_hinh`))[0]
  if (m133) {
    const dinh = await q(`select (select count(*) from hinh_baitoan where mo_hinh_id = $1) b, (select count(*) from hinh_mo_hinh_cha where cha_id = $1 or mo_hinh_id = $1) c, (select count(*) from hinh_bai where mo_hinh_id = $1) k, (select count(*) from hinh_gt_buoi where mo_hinh_chinh_id = $1) g, (select count(*) from hinh_hoc_cau_hoi where mo_hinh_id = $1) h`, [m133.id])
    const x = dinh[0]
    if (+x.b || +x.c || +x.k || +x.g || +x.h) throw new Error('MH.133 còn dính: ' + JSON.stringify(x))
    await q(`delete from hinh_mo_hinh where id = $1`, [m133.id]); console.log('\nMH.133 đã xoá (gốc rỗng, 0 bài, 0 kho bài, 0 giáo trình)')
  }
  console.log(`\nTỔNG: +${nNhanh} nút giả thiết/thành viên · +${nBai} bài`)
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message, e.detail || '', e.where || ''); process.exitCode = 1 }
await c.end()
