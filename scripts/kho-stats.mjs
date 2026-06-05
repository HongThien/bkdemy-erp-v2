// Đếm số liệu thật của "kho" v1 (read-only public). Chạy: node scripts/kho-stats.mjs
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8')
  .match(/^\s*DATABASE_URL(?:_RO)?\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')

const Q = {
  'knowledge_map — tổng dạng': `select count(*) n from public.knowledge_map`,
  'knowledge_map — theo khối': `select khoi, count(*) n from public.knowledge_map group by khoi order by khoi`,
  'knowledge_map — distinct chương/chủ đề': `select count(distinct chuong) chuong, count(distinct chu_de) chu_de from public.knowledge_map`,
  'question_bank — tổng câu': `select count(*) n from public.question_bank`,
  'question_bank — verify hay chưa': `select da_verify, count(*) n from public.question_bank group by da_verify`,
  'question_bank — theo loại câu': `select loai_cau, count(*) n from public.question_bank group by loai_cau order by n desc`,
  'question_bank — theo khối': `select khoi_lop, count(*) n from public.question_bank group by khoi_lop order by khoi_lop`,
  'question_bank — có gắn dạng / distinct dạng': `select count(*) filter (where ma_dang is not null) co_dang, count(distinct ma_dang) distinct_dang from public.question_bank`,
  'question_bank — có ảnh / có lời giải AI': `select count(*) filter (where image_url is not null) co_anh, count(*) filter (where loi_giai_ai is not null) co_loigiai from public.question_bank`,
  'question_drafts — theo status': `select draft_status, count(*) n from public.question_drafts group by draft_status order by n desc`,
  'question_accepted_answers — tổng': `select count(*) n from public.question_accepted_answers`,
  'exams / exam_questions': `select (select count(*) from public.exams) exams, (select count(*) from public.exam_questions) exam_questions`,
  'documents — tổng': `select count(*) n from public.documents`,
}

const c = new pg.Client({ connectionString: url })
await c.connect()
for (const [label, sql] of Object.entries(Q)) {
  try { const r = await c.query(sql); console.log(`### ${label}\n` + JSON.stringify(r.rows)) }
  catch (e) { console.log(`### ${label}\nERR: ${e.message}`) }
}
await c.end()
