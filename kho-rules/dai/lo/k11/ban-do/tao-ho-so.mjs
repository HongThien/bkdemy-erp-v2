// tao-ho-so.mjs — dựng hồ sơ trạm soạn cho bản đồ mới khối 11 (chỉ ĐỌC DB). Chạy từ gốc repo: node kho-rules/dai/lo/k11/ban-do/tao-ho-so.mjs
import pg from 'pg'; import fs from 'node:fs'
const LV = 'C:/Users/WBPC/bk-kho-lam-viec/bdm/k11'
fs.mkdirSync(LV + '/ra', { recursive: true }); fs.mkdirSync(LV + '/tam', { recursive: true })
const env = fs.readFileSync('.env', 'utf8')
const url = env.match(/^DATABASE_URL_RO=(.*)$/m)?.[1] ?? env.match(/^DATABASE_URL=(.*)$/m)[1]
const c = new pg.Client({ connectionString: url.trim().replace(/^"|"$/g, ''), ssl: { rejectUnauthorized: false } }); await c.connect()
const rows = (await c.query(`select cd.thu_tu cd_tt, cd.id cd_id, cd.ten cd_ten, o.thu_tu o_tt, ch.id ch_id, ch.ten ch_ten, n.id n_id, n.thu_tu n_tt, n.ten n_ten, coalesce(n.ly_thuyet,'') n_lt, coalesce(n.mo_ta,'') n_mo_ta,
  d.id d_id, d.thu_tu d_tt, d.ten d_ten, coalesce(d.mo_ta,'') d_mo_ta, coalesce(d.ly_thuyet,'') d_lt, coalesce(d.vi_du,'') d_vd
  from dai_bdm_chu_de cd join dai_bdm_o o on o.chu_de_id=cd.id join dai_bdm_chuyen_de ch on ch.id=o.chuyen_de_id
  join dai_bdm_nhom n on n.chu_de_id=o.chu_de_id and n.chuyen_de_id=o.chuyen_de_id join dai_bdm_dang_bai d on d.nhom_id=n.id
  where cd.khoi='11' order by cd.thu_tu,o.thu_tu,n.thu_tu,d.thu_tu`)).rows
const cu = (await c.query(`select u.dich_nhom, u.dich_dang_bai, u.ma_dang_cu, b.ten_dang, l.noi_dung from dai_bdm_doi_ung u join dai_ban_do b on b.ma_dang=u.ma_dang_cu left join dai_dang_ly_thuyet l on l.ma_dang=u.ma_dang_cu where b.khoi='11'`)).rows
const cuAll = (await c.query(`select b.ma_dang, b.ten_dang, b.ten_chuyen_de, l.noi_dung from dai_ban_do b left join dai_dang_ly_thuyet l on l.ma_dang=b.ma_dang where b.khoi='11' and b.xoa_at is null order by 1`)).rows
await c.end()
const co = rows.filter((r) => r.d_mo_ta.trim())
fs.writeFileSync(LV + '/dang.json', JSON.stringify(co, null, 1))
fs.writeFileSync(LV + '/lt-cu-k11.md', cuAll.map((x) => `### ${x.ma_dang} — ${x.ten_chuyen_de} › ${x.ten_dang}\n\n${x.noi_dung || '(chưa có lý thuyết)'}\n`).join('\n'))
const nhom = new Map()
for (const r of rows) if (!nhom.has(r.n_id)) { nhom.set(r.n_id, r); fs.writeFileSync(`${LV}/nhom-${r.n_id}.md`, `# Nhóm ${r.n_id} — ${r.n_ten}\n(${r.cd_ten} › ${r.ch_ten})\n\nMô tả nhóm: ${r.n_mo_ta || '(trống)'}\n\n## Lý thuyết NHÓM đang có (không sửa)\n\n${r.n_lt || '(TRỐNG — nhóm chưa có lý thuyết; công thức nền cần cho dạng thì đặt trong ##TC của dạng)'}\n`) }
for (const r of rows) {
  const dc = cu.filter((x) => x.dich_dang_bai === r.d_id || x.dich_nhom === r.n_id)
  fs.writeFileSync(`${LV}/${r.d_id}.md`, `### ${r.d_id} — ${r.d_ten}
${r.cd_ten} › ${r.ch_ten} › Nhóm ${r.n_id} ${r.n_ten}

**Mô tả của CEO (ĐÍCH):** ${r.d_mo_ta.trim() || '(TRỐNG — KHÔNG làm dạng này)'}

**Lý thuyết dạng:** ${r.d_lt.trim() ? 'ĐÃ CÓ — không viết lại, chỉ viết ví dụ.\n\n```\n' + r.d_lt + '\n```' : 'TRỐNG — cần soạn.'}
**Ví dụ dạng:** ${r.d_vd.trim() ? 'ĐÃ CÓ' : 'TRỐNG — cần 2 ví dụ.'}

**Dạng cũ đối ứng (bản đồ cũ):** ${dc.length ? '' : '(không có — soạn theo mô tả + sách)'}
${dc.map((x) => `- ${x.ma_dang_cu} · ${x.ten_dang}\n\n\`\`\`\n${x.noi_dung || '(chưa có lý thuyết)'}\n\`\`\``).join('\n')}
`)
}
console.log(`dạng ${rows.length} · có mô tả ${co.length} · cần LT ${co.filter((r) => !r.d_lt.trim()).length} · cần VD ${co.filter((r) => !r.d_vd.trim()).length} · nhóm ${nhom.size} → ${LV}`)
