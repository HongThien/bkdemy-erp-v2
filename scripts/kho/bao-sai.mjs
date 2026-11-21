// Báo sai câu trong kho — phía CLAUDE (Thùy 21/11; spec-giai-bai §E3 + Phần D; mig 202611210816 + 202611210821).
//
//   node scripts/kho/bao-sai.mjs --ds [--ra <file.json>]   báo cáo ĐÃ ĐÓNG mà AI chưa ghi vào Phần D (kèm nội dung câu, loại lỗi, ai làm gì)
//   node scripts/kho/bao-sai.mjs --mo                       báo cáo còn MỞ (nhân sự: đã nối sang nhan-xet.mjs; học sinh: chờ trưởng khối)
//   node scripts/kho/bao-sai.mjs --da-ghi <id,id|all> [--ghi]  đánh dấu AI đã ghi các báo cáo đó vào Phần D (mặc định chạy thử)
//   node scripts/kho/bao-sai.mjs --thong-ke                 loại lỗi × kho × khối (lỗi lặp ≥3 cùng kiểu ⇒ sửa LUẬT, spec-giai-bai §C7)
//
// QUY TRÌNH (mỗi lượt Claude chạy "sửa theo nhận xét" hoặc khi Thùy gọi "ghi sổ sai lầm"):
//   1. --ds → với MỖI báo cáo đóng: ghi 1 dòng vào bảng Phần D của spec-giai-bai.md (ngày · khối·phần · câu · sai gì · lọt ở trạm nào ·
//      luật rút ra · đã quét câu cùng loại?). "Lọt ở trạm nào" suy từ nguon / giai_method / nguon_giai của câu (không đoán — không biết thì ghi "chưa rõ").
//   2. Cùng kiểu ≥3 câu ⇒ KHÔNG vá từng câu: sửa luật Phần A/B (gom một lượt), quét các câu cùng dạng.
//   3. Sửa spec xong ⇒ --da-ghi <ids> --ghi. Báo cáo của học sinh đóng bởi trưởng khối cũng vào đây.
// Chỉ ghi cột ghi_spec_at; không đụng câu, không đụng trạng thái báo cáo.
import pg from 'pg'
import fs from 'node:fs'

const args = process.argv.slice(2)
const co = (k) => args.includes(k)
const sau = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined }
const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env }); await c.connect()

const TBL = { toan: 'dai', hgt: 'hgt', hinh_hoc: 'hinh_hoc', khtn: 'khtn', vatly: 'vatly', hoahoc: 'hoahoc', anh: 'anh', tsa: 'tsa' }
const TEN_LOAI = { trinh_bay: 'trình bày', tinh_sai: 'tính sai', sai_de: 'sai đề', sai_dang: 'sai dạng', khac: 'khác',
  thieu_du_kien: 'thiếu dữ kiện (HS)', hinh_loi: 'hình lỗi (HS)', cong_thuc_loi: 'công thức lỗi (HS)', dap_an_sai: 'đáp án sai (HS)', loi_giai_sai: 'lời giải sai (HS)' }

async function cauTomTat(kho, ma) {
  const t = TBL[kho]; if (!t) return null
  const cot = kho === 'hinh_hoc' ? 'ma_cau, loai_cau, left(noi_dung, 300) noi_dung, dap_an, nguon, nguon_giai, giai_method, ai_model, ten_de_goc, da_duyet, duyet_nguon, xoa_at'
    : 'ma_cau, loai_cau, left(noi_dung, 300) noi_dung, dap_an, nguon, nguon_giai, giai_method, ai_model, ten_de_goc, da_duyet, duyet_nguon, xoa_at'
  try { return (await c.query(`select ${cot} from ${t}_cau_hoi where ma_cau = $1`, [ma])).rows[0] ?? null } catch { return null }
}

async function dsDong(trangThaiMo) {
  const w = trangThaiMo ? `b.trang_thai = 'moi'` : `b.trang_thai <> 'moi' and b.ghi_spec_at is null`
  return (await c.query(`
    select b.id, b.mon, b.kho, b.khoi, b.ma_cau, b.ly_do, b.nguon, b.ghi_chu, b.trang_thai, b.hanh_dong, b.xu_ly_ghi_chu, b.xu_ly_at, b.created_at,
           coalesce(n.ho_ten, case when b.hoc_sinh_id is not null then 'học sinh' end) nguoi_bao
      from bai_cau_bao_loi b left join nhan_su n on n.id = b.nhan_su_id
     where ${w} order by coalesce(b.xu_ly_at, b.created_at) limit 300`)).rows
}

try {
  if (co('--ds') || co('--mo')) {
    const rows = await dsDong(co('--mo'))
    const out = []
    for (const r of rows) out.push({ ...r, loai: TEN_LOAI[r.ly_do] ?? r.ly_do, cau: r.kho ? await cauTomTat(r.kho, r.ma_cau) : null })
    const file = sau('--ra')
    if (file) { fs.writeFileSync(file, JSON.stringify(out, null, 2)); console.log(`Ghi ${out.length} báo cáo → ${file}`) }
    else for (const o of out) {
      console.log(`\n[${o.id}] ${o.ma_cau} · ${o.mon} khối ${o.khoi ?? '?'} · ${o.loai} · báo bởi ${o.nguoi_bao ?? '?'} (${o.nguon})`)
      console.log(`   lỗi: ${o.ghi_chu ?? '(không ghi chú)'}`)
      if (o.trang_thai !== 'moi') console.log(`   xử lý: ${o.hanh_dong ?? o.trang_thai} — ${o.xu_ly_ghi_chu ?? ''}`)
      if (o.cau) console.log(`   câu: ${o.cau.loai_cau} · nguon=${o.cau.nguon} · nguon_giai=${o.cau.nguon_giai}/${o.cau.giai_method ?? '-'}/${o.cau.ai_model ?? '-'} · đề gốc=${o.cau.ten_de_goc ?? '-'} · duyệt=${o.cau.duyet_nguon ?? (o.cau.da_duyet ? 'có' : 'chưa')}${o.cau.xoa_at ? ' · ĐÃ XOÁ' : ''}`)
    }
    console.log(`\n${out.length} báo cáo ${co('--mo') ? 'đang mở' : 'đã đóng, chờ ghi Phần D'}.`)
  } else if (co('--da-ghi')) {
    const v = sau('--da-ghi'); if (!v) throw new Error('--da-ghi <id,id|all>')
    await c.query('begin')
    const r = v === 'all'
      ? await c.query(`update bai_cau_bao_loi set ghi_spec_at = now() where trang_thai <> 'moi' and ghi_spec_at is null`)
      : await c.query(`update bai_cau_bao_loi set ghi_spec_at = now() where id = any($1::uuid[]) and trang_thai <> 'moi' and ghi_spec_at is null`, [v.split(',').map((s) => s.trim())])
    console.log(`${r.rowCount} báo cáo → đã ghi Phần D`)
    await c.query(co('--ghi') ? 'commit' : 'rollback')
    if (!co('--ghi')) console.log('(chạy thử — ROLLBACK; thêm --ghi để ghi thật)')
  } else if (co('--thong-ke')) {
    const r = await c.query(`select coalesce(kho,'?') kho, coalesce(khoi,'?') khoi, ly_do, count(*) n, count(*) filter (where trang_thai='moi') mo
                               from bai_cau_bao_loi group by 1,2,3 having count(*) >= 1 order by n desc, 1, 2 limit 60`)
    console.log('kho | khối | loại | tổng | còn mở')
    for (const x of r.rows) console.log(`${x.kho} | ${x.khoi} | ${TEN_LOAI[x.ly_do] ?? x.ly_do} | ${x.n} | ${x.mo}${Number(x.n) >= 3 ? '   ← ≥3: xét sửa LUẬT' : ''}`)
  } else {
    console.log('Dùng: --ds | --mo | --da-ghi <id,id|all> [--ghi] | --thong-ke   (xem đầu file)')
  }
} finally { await c.end() }
