// Sinh phần "chặn rò môn" của mig 202610011120 từ thân hàm ĐANG CHẠY (pg_get_functiondef), chỉ chèn 1 dòng sau `begin`.
import pg from 'pg'; import fs from 'node:fs'; process.loadEnvFile('.env');
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO || process.env.DATABASE_URL }); await c.connect();
const DOC = ['hs_dang_evals', 'tu_luyen_chu_de_ds_dang', 'htd_lo_trinh']          // đọc ⇒ trả rỗng
const GHI = ['tu_luyen_sinh', 'tu_luyen_chu_de_sinh', 'tu_luyen_dien_sinh', 'thu_thach_sinh'] // sinh bài ⇒ báo lỗi rõ
let out = ''
for (const ten of [...DOC, ...GHI]) {
  const rows = (await c.query(`select pg_get_functiondef(p.oid) d, pg_get_function_identity_arguments(p.oid) a from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.proname=$1 order by 2`, [ten])).rows
  for (const { d, a } of rows) {
    const m = d.match(/\nbegin[ \t]*\n/gi); if (!m || m.length !== 1) throw new Error(`${ten}(${a}): không đúng 1 dòng begin`)
    if (!/p_mon text/.test(a)) throw new Error(`${ten}(${a}): không có p_mon`)
    const chan = DOC.includes(ten)
      ? `  if not public._kho_co_mon(p_mon) then return '[]'::jsonb; end if; -- mig 202610011120: môn chưa có kho ⇒ rỗng, KHÔNG rơi về kho Toán\n`
      : `  if not public._kho_co_mon(p_mon) then raise exception 'Môn % chưa có kho bài trên app.', p_mon; end if; -- mig 202610011120: chặn sinh câu Toán gắn nhãn môn khác\n`
    out += `-- ${ten}(${a}) — thân lấy từ bản đang chạy, chỉ thêm 1 dòng chặn ngay sau begin\n`
    out += d.replace(/\nbegin[ \t]*\n/i, (x) => x + chan).trimEnd() + ';\n\n'
  }
}
fs.writeFileSync(process.argv[2], out); console.log('ok', out.length)
await c.end();
