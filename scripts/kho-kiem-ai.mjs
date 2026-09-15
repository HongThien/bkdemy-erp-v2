// MỨC B — CLAUDE GIẢI LẠI KIỂM ĐÁP SỐ KHO theo lô (spec-kho-chuan.md §2, bước 4). Khuôn hangdoi-giai.mjs: Claude Code (quota
// subscription, KHÔNG API) đọc lô → tự giải trong chat → ghi file kết quả → script ghi DB trong 1 transaction.
//   1) node scripts/kho-kiem-ai.mjs --list [--n 150] [--kho dai] [--khoi 6,7,8,10] [--out lo.json]
//        → câu CHƯA kiểm (kiem_may null), có đáp số, chưa vào rác. ƯU TIÊN: câu HS ĐÃ LÀM (có trong bai_test_cau) trước, rồi
//          khối theo thứ tự truyền vào (mặc định 6,7,8,9,10,11,12 rồi cấp 1), rồi created_at. Mỗi câu: đề + đáp số kho + lời giải kho
//          + phương án/mệnh đề. Claude ĐỌC, GIẢI ĐỘC LẬP (không tin lời giải kho), so đáp số.
//   2) Claude viết kq.json: { lo: 'B-01 …', ghi_chu?, kq: [ { ma_cau, dap_an_ai, khop: true|false|null, ghi? } ] }
//        · khop=true  ⇒ kiem_may='khop'  (+ da_duyet=true, duyet_nguon='ai' nếu lô KÝ)
//        · khop=false ⇒ kiem_may='nghi'  (kiem_may_ghi "AI <x> ≠ kho <y>: <ghi>") — câu cũ tự rời kho chuẩn; KHÔNG sửa dap_an kho
//        · khop=null  ⇒ kiem_may='khong_kiem_duoc' (đề lỗi / thiếu hình / không giải được) — vào hàng duyệt
//   3) node scripts/kho-kiem-ai.mjs --ghi kq.json [--chi-bao]
//        → tạo 1 dòng kho_kiem_lo + UPDATE từng câu (chỉ câu vẫn kiem_may null hoặc do claude_code ghi trước) cùng transaction.
//          --chi-bao: KHÔNG ký da_duyet (độ tin thấp — spec §2 mức C) — chỉ ghi kiem_may + lô.
//   4) node scripts/kho-kiem-ai.mjs --thong-ke   → precision từng lô (fn_kho_kiem_lo_thong_ke) sau khi người soát mẫu.
// Luật (CLAUDE.md §1.5): không chắc ⇒ khop=null, đừng đoán khớp. AI chỉ BÁO nghi, không sửa kho.
import pg from 'pg'
import { readFileSync, writeFileSync } from 'node:fs'

const args = process.argv.slice(2)
const flag = (f) => args.includes(f)
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d }
const kho = opt('--kho', 'dai')
if (!['dai', 'khtn', 'hgt'].includes(kho)) { console.error('--kho phải là dai/khtn/hgt'); process.exit(1) }
const url = readFileSync(new URL('../.env', import.meta.url), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1]
const c = new pg.Client({ connectionString: url, connectionTimeoutMillis: 20000 }); await c.connect()

try {
  if (flag('--list')) {
    const n = Number(opt('--n', 150))
    const khoi = opt('--khoi', '6,7,8,9,10,11,12,5,5T,4,4T,3').split(',').map((s) => s.trim())
    const { rows } = await c.query(`
      select q.ma_cau, b.khoi, q.dang_chinh, b.ten_dang, q.loai_cau, q.noi_dung, q.lua_chon, q.menh_de, q.dap_an, q.loi_giai, q.anh_de, q.nguon,
             exists (select 1 from bai_test_cau t where t.ma_cau = q.ma_cau) hs_da_lam
      from ${kho}_cau_hoi q join ${kho}_ban_do b on b.ma_dang = q.dang_chinh
      where q.xoa_at is null and q.kiem_may is null and q.dap_an is not null and q.dap_an <> '' and b.khoi = any($1)
        and (q.created_at < _kho_ngay_bat() or $3)   -- câu MỚI (sau NGÀY BẬT) phải qua cửa 1 người duyệt; chỉ lấy khi --ca-moi
      order by hs_da_lam desc, array_position($1, b.khoi), q.created_at, q.ma_cau
      limit $2`, [khoi, n, flag('--ca-moi')])
    const cau = rows.map((r) => ({
      ma_cau: r.ma_cau, khoi: r.khoi, dang: `${r.dang_chinh} ${r.ten_dang}`, loai: r.loai_cau, hs_da_lam: r.hs_da_lam, nguon: r.nguon,
      de: r.noi_dung, lua_chon: r.lua_chon ?? undefined, menh_de: r.menh_de ?? undefined, anh_de: r.anh_de ?? undefined,
      dap_an_kho: r.dap_an, loi_giai_kho: r.loi_giai ?? null,
    }))
    const out = { kho, sinh_luc: new Date().toISOString(), so_cau: cau.length, hs_da_lam: cau.filter((x) => x.hs_da_lam).length, cau }
    const f = opt('--out')
    if (f) { writeFileSync(f, JSON.stringify(out, null, 1), 'utf8'); console.log(`→ ${f}`) } else console.log(JSON.stringify(out, null, 1))
    console.error(`Lô: ${cau.length} câu (HS đã làm ${out.hs_da_lam}) · theo khối: ${Object.entries(cau.reduce((a, x) => (a[x.khoi] = (a[x.khoi] ?? 0) + 1, a), {})).map(([k, v]) => `${k}:${v}`).join(' ')}`)
  } else if (flag('--ghi')) {
    const f = opt('--ghi'); if (!f) throw new Error('--ghi cần file kết quả')
    const kq = JSON.parse(readFileSync(f, 'utf8'))
    const ky = !flag('--chi-bao')
    if (!kq.lo || !Array.isArray(kq.kq) || !kq.kq.length) throw new Error('File kết quả cần { lo, kq: [...] }')
    for (const x of kq.kq) if (!x.ma_cau || !('khop' in x)) throw new Error(`Thiếu ma_cau/khop: ${JSON.stringify(x)}`)
    await c.query('begin')
    const { rows: [lo] } = await c.query(`insert into kho_kiem_lo (kho, boi, ten, ky, ghi_chu) values ($1, 'claude_code', $2, $3, $4) returning id`,
      [kho, kq.lo, ky, kq.ghi_chu ?? `file ${f}`])
    let khop = 0, nghi = 0, khong = 0, boQua = []
    for (const x of kq.kq) {
      const { rows: [cu] } = await c.query(`select dap_an, kiem_may, kiem_may_boi, da_duyet from ${kho}_cau_hoi where ma_cau = $1 and xoa_at is null`, [x.ma_cau])
      if (!cu || (cu.kiem_may && cu.kiem_may_boi !== 'claude_code')) { boQua.push(x.ma_cau); continue }
      const km = x.khop === true ? 'khop' : x.khop === false ? 'nghi' : 'khong_kiem_duoc'
      const ghi = x.khop === true ? (x.ghi ? `AI: ${x.ghi}` : null)
        : x.khop === false ? `AI ${x.dap_an_ai ?? '?'} ≠ kho ${String(cu.dap_an).replace(/\s+/g, ' ').slice(0, 60)}${x.ghi ? `: ${x.ghi}` : ''}`
        : `AI không kiểm được${x.ghi ? `: ${x.ghi}` : ''}`
      await c.query(`update ${kho}_cau_hoi set kiem_may = $2, kiem_may_at = now(), kiem_may_boi = 'claude_code', kiem_may_ghi = $3, kiem_may_lo = $4,
          da_duyet    = case when $5 and $2 = 'khop' then true else da_duyet end,
          duyet_nguon = case when $5 and $2 = 'khop' and not da_duyet then 'ai' else duyet_nguon end,
          duyet_at    = case when $5 and $2 = 'khop' and not da_duyet then now() else duyet_at end
        where ma_cau = $1`, [x.ma_cau, km, ghi, lo.id, ky])
      if (km === 'khop') khop++; else if (km === 'nghi') nghi++; else khong++
    }
    await c.query(`update kho_kiem_lo set so_cau = $2, so_khop = $3, so_nghi = $4, so_khong_kiem = $5 where id = $1`, [lo.id, khop + nghi + khong, khop, nghi, khong])
    await c.query('commit')
    console.log(`✅ Lô "${kq.lo}" (${ky ? 'KÝ' : 'chỉ báo'}) id=${lo.id}: khớp ${khop} · nghi ${nghi} · không kiểm được ${khong}${boQua.length ? ` · bỏ qua ${boQua.length} (đã kiểm bởi người/máy hoặc vào rác): ${boQua.join(', ')}` : ''}`)
  } else if (flag('--thong-ke')) {
    await c.query(`select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000000"}', true)`)
    const { rows } = await c.query(`select l.*, s.nguoi_xac_nhan, s.nguoi_sua, s.tu_choi, s.precision_nguoi from kho_kiem_lo l
      left join lateral (
        select count(*) filter (where c.xoa_at is null and c.kiem_may_boi = 'nguoi' and c.kiem_may_ghi like 'người xác nhận%') nguoi_xac_nhan,
               count(*) filter (where c.xoa_at is null and c.kiem_may_boi = 'nguoi' and c.kiem_may_ghi like 'người sửa đáp số%') nguoi_sua,
               count(*) filter (where c.xoa_at is not null) tu_choi,
               null::numeric precision_nguoi
        from ${kho}_cau_hoi c where c.kiem_may_lo = l.id) s on true
      where l.kho = $1 order by l.tao_at`, [kho])
    for (const r of rows) {
      const p = Number(r.nguoi_xac_nhan) + Number(r.nguoi_sua)
      console.log(`${r.ten} [${r.boi}${r.ky ? ', ký' : ', chỉ báo'}] ${r.tao_at.toISOString().slice(0, 16)} · ${r.so_cau} câu: khớp ${r.so_khop} · nghi ${r.so_nghi} · không kiểm ${r.so_khong_kiem} · người soát: xác nhận ${r.nguoi_xac_nhan} · sửa ${r.nguoi_sua} · từ chối ${r.tu_choi} · precision ${p ? (100 * r.nguoi_xac_nhan / p).toFixed(1) + '%' : '(chưa soát)'}`)
    }
  } else console.log('Dùng: --list [--n 150] [--khoi 6,7] [--out lo.json] | --ghi kq.json [--chi-bao] | --thong-ke   (+ --kho dai|khtn|hgt)')
} catch (e) { try { await c.query('rollback') } catch {} console.error('❌', e.message); process.exitCode = 1 }
finally { await c.end() }
