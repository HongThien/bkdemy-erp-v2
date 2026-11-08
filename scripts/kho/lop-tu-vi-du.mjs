// Đổ KHO TRÊN LỚP (dai_cau_lop, vai giảng) từ VÍ DỤ đã soạn sẵn của từng dạng bài bản đồ mới (dai_bdm_dang_bai.vi_du).
// Thùy 27/10: "Dùng tài liệu tham khảo đã có, fill lại kho trên lớp của các dạng bài" — ví dụ hướng dẫn (rút từ sách tham khảo)
// thuộc kho trên lớp (luật sách tham khảo, kho-rules/README.md §3).
//   node scripts/kho/lop-tu-vi-du.mjs          → chạy thử (ROLLBACK), in số liệu + mẫu
//   node scripts/kho/lop-tu-vi-du.mjs --ghi    → ghi thật
// Mỗi khối ##VD = 1 câu: đề = phần trước dòng "Bài giải / Lời giải / Hướng dẫn giải", lời giải = phần sau; khối không có dòng đó
// (ví dụ minh hoạ khái niệm) ⇒ cả khối là đề, lời giải để trống. Nhãn "Ví dụ 1:" chỉ là vị trí ⇒ bỏ. Khối ##TC/##CY lọt vào ô ví dụ ⇒ bỏ qua.
// Ô ví dụ của dạng bài GIỮ NGUYÊN. Dạng bài đã có câu mang nhãn nguồn này ⇒ bỏ qua (chạy lại không đẻ trùng).
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
const GHI = process.argv.includes('--ghi')
const NGUON = 'Ví dụ của dạng bài (bản đồ mới)'
const MOC = /^[ \t]*\**[ \t]*(Bài giải|Lời giải|Hướng dẫn giải|Hướng dẫn)[ \t]*\**[ \t]*[.:][ \t]*\**[ \t]*(.*)$|^[ \t]*\**[ \t]*(Bài giải|Lời giải|Hướng dẫn giải)[ \t]*\**[ \t]*$/im

function tach(viDu) {
  const ra = []
  let s = viDu.replace(/\r\n/g, '\n')
  if (!/^##[A-Za-z]/m.test(s)) s = '##VD\n' + s   // ô ví dụ dán trần không thẻ = 1 ví dụ
  for (const p of s.split(/^(?=##\S)/m)) {
    const m0 = p.match(/^##([A-Za-z]+):?[ \t]*\n?/)
    if (!m0 || m0[1].toUpperCase() !== 'VD') continue
    let than = p.slice(m0[0].length)
    const m = than.match(MOC)
    let de = than, lg = null
    if (m) { de = than.slice(0, m.index); lg = ((m[2] ?? '') + '\n' + than.slice(m.index + m[0].length)).trim() || null }
    de = de.replace(/^\s*\**Ví dụ(\s*\d+[a-z]?)?\s*\**\s*[:.]\s*\**\s*/i, '').trim()
    if (!de) continue
    ra.push({ de, lg })
  }
  return ra
}

try {
  await q('begin')
  const dangs = await q(`select d.id, d.ten, cd.khoi, d.vi_du from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id
                           join dai_bdm_chu_de cd on cd.id = n.chu_de_id
                          where btrim(d.vi_du) <> ''
                            and not exists (select 1 from dai_cau_lop l where l.dang_bai_id = d.id and l.nguon = $1)
                          order by cd.khoi, d.id`, [NGUON])
  let so = 0, coLg = 0, dangCo = 0; const theoKhoi = {}, rong = []
  for (const d of dangs) {
    const ds = tach(d.vi_du)
    if (!ds.length) { rong.push(d.id); continue }
    dangCo++
    let tt = (await q(`select coalesce(max(thu_tu), -1) m from dai_cau_lop where dang_bai_id = $1 and vai = 'giang' and xoa_at is null`, [d.id]))[0].m
    for (const x of ds) {
      await q(`insert into dai_cau_lop (dang_bai_id, vai, thu_tu, loai_cau, noi_dung, loi_giai, nguon) values ($1, 'giang', $2, 'tu_luan', $3, $4, $5)`,
        [d.id, ++tt, x.de, x.lg, NGUON])
      so++; if (x.lg) coLg++
      theoKhoi[d.khoi] = (theoKhoi[d.khoi] ?? 0) + 1
    }
  }
  console.log(`dạng bài có ô ví dụ: ${dangs.length} · đổ được ${dangCo} · không tách được khối ##VD nào: ${rong.length} ${rong.slice(0, 20).join(' ')}`)
  console.log(`câu kho trên lớp mới: ${so} (có lời giải ${coLg}, chỉ đề ${so - coLg})`, theoKhoi)
  const la = await q(`select dang_bai_id, left(noi_dung, 200) de, left(coalesce(loi_giai, ''), 80) lg from dai_cau_lop where nguon = $1
                        and (noi_dung ~ '\\*\\*\\s*$' or noi_dung ~* '(bài giải|lời giải|hướng dẫn giải)' or loi_giai ~ '^\\s*\\*\\*' or noi_dung ~ '^##')`, [NGUON])
  console.log('khối lạ cần nhìn:', la.length); for (const r of la.slice(0, 12)) console.log('  ?', r.dang_bai_id, r.de.replace(/\n/g, ' ⏎ '), '| GIẢI:', r.lg.replace(/\n/g, ' ⏎ '))
  const mau = await q(`select dang_bai_id, thu_tu, left(noi_dung, 160) de, left(coalesce(loi_giai, '∅'), 120) lg from dai_cau_lop where nguon = $1 order by random() limit 4`, [NGUON])
  for (const r of mau) console.log('—', r.dang_bai_id, '#' + r.thu_tu, '\n  ĐỀ:', r.de.replace(/\n/g, ' ⏎ '), '\n  GIẢI:', r.lg.replace(/\n/g, ' ⏎ '))
  await q(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await q('rollback'); console.log('LỖI', e.message); process.exitCode = 1 } finally { await c.end() }
