// SO MODEL trên CÙNG một stat sheet thật — trả lời "dùng model nào" bằng ĐO, không bằng ý kiến.
// Chạy: npx vite-node scripts/_diag_so_model.ts [ten_lop]
// ⚠ Gọi API THẬT, TỐN TIỀN (in chi phí từng lượt ở cuối).
import { readFileSync } from 'node:fs'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '../src/lib/supabase'
import { getStatSheetLop, listCandidatesLop, goiGon } from '../src/lib/danhgia'
import { SYSTEM, SCHEMA } from '../worker/danhgia_prompt.mjs'

const envRaw = readFileSync('.env.local', 'utf8')
const env = (k: string) => envRaw.match(new RegExp(`^\s*${k}\s*=\s*(.+?)\s*$`, 'm'))?.[1]?.replace(/^["']|["']$/g, '')
const claude = new Anthropic({ apiKey: env('ANTHROPIC_API_KEY')! })
const [, email, pass] = (env('VITE_DEV_ACCOUNTS') as string).split(';')[0].split('|')
await supabase.auth.signInWithPassword({ email, password: pass })

const GIA: Record<string, { vao: number; ra: number }> = {
  'claude-opus-4-8': { vao: 5, ra: 25 },
  'claude-sonnet-5': { vao: 2, ra: 10 },   // giá KM tới 31/8/2026
  'claude-haiku-4-5': { vao: 1, ra: 5 },
}
const USD_VND = 26_000

const tenLop = process.argv[2] ?? '9S1'
const { data: lop } = await supabase.from('lop').select('id, ten_lop, mon').eq('ten_lop', tenLop).eq('trang_thai', 'dang_hoc').limit(1).single()
if (!lop) { console.error('Không thấy lớp', tenLop); process.exit(1) }
const sheets = await getStatSheetLop((lop as any).id)
const cands = new Set((await listCandidatesLop((lop as any).id)).map((c) => c.hoc_sinh_id))
const gui = sheets.filter((s) => cands.has(s.hoc_sinh_id))
const sheet: any = goiGon(gui, (lop as any).ten_lop, sheets.length)
console.log(`Lớp ${sheet.ten_lop} · ${gui.length}/${sheets.length} em có tín hiệu · kỳ ${sheet.cua_so}
`)

const userMsg = `Lớp: ${sheet.ten_lop} · Môn: ${(lop as any).mon} · Kỳ: ${sheet.cua_so}

STAT SHEET (do hệ thống tính sẵn — chỉ đọc, không tự tính lại):
${JSON.stringify(sheet, null, 1)}`

const ketQua: any[] = []
for (const model of Object.keys(GIA)) {
  process.stdout.write(`-> ${model} ... `)
  const t0 = Date.now()
  try {
    const r: any = await claude.messages.create({
      model, max_tokens: 16000,
      thinking: { type: 'adaptive' },
      output_config: { effort: 'high', format: { type: 'json_schema', schema: SCHEMA } },
      system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: userMsg }],
    } as any)
    const giay = (Date.now() - t0) / 1000
    if (r.stop_reason === 'refusal') throw new Error('bi tu choi: ' + (r.stop_details?.category ?? '?'))
    if (r.stop_reason === 'max_tokens') throw new Error('ket qua bi cat (max_tokens)')
    const kq = JSON.parse(r.content.find((b: any) => b.type === 'text').text)
    const g = GIA[model], u = r.usage
    const dong = Math.round(((u.input_tokens * g.vao + u.output_tokens * g.ra) / 1e6) * USD_VND)
    ketQua.push({ model, giay, kq, u, dong })
    console.log(`${giay.toFixed(1)}s - ${dong.toLocaleString('vi-VN')} d`)
  } catch (e: any) {
    console.log('LOI:', e?.message ?? e)
    ketQua.push({ model, loi: String(e?.message ?? e) })
  }
}

const nhan = ['A', 'B', 'C', 'D']
console.log('\n' + '='.repeat(78))
console.log('DOC PHAN DUOI MA KHONG NHIN TEN MODEL - chon ban nao dung va dung duoc nhat.')
console.log('='.repeat(78))
ketQua.forEach((r, i) => {
  console.log(`\n--- BAN ${nhan[i]} ${'-'.repeat(58)}`)
  if (r.loi) { console.log(`  LOI: ${r.loi}`); return }
  console.log(`  TONG QUAN: ${r.kq.tong_quan}`)
  for (const c of r.kq.canh_bao_he ?? []) console.log(`  [!] ${c}`)
  for (const h of (r.kq.hoc_sinh ?? []).slice(0, 3)) {
    console.log(`\n  ${h.ho_ten} - ${h.phan_loai} (${h.do_tin})`)
    console.log(`    ${h.ly_do}`)
    for (const v of h.viec_can_lam ?? []) console.log(`    -> ${v}`)
    if (h.con_thieu) console.log(`    thieu: ${h.con_thieu}`)
  }
  if ((r.kq.hoc_sinh?.length ?? 0) > 3) console.log(`\n  ... con ${r.kq.hoc_sinh.length - 3} em nua`)
})

// KIEM TU DONG: co bia ma dang khong (luat so 1 cua prompt)
const maThat = new Set<string>()
for (const h of sheet.hoc_sinh ?? []) for (const d of h.dang ?? []) maThat.add(d.ma)
console.log('\n' + '='.repeat(78))
console.log('KIEM TU DONG - co bia ma dang khong (luat 1: chi dung so/ma co trong stat sheet)')
ketQua.forEach((r, i) => {
  if (r.loi) return
  const bia: string[] = []
  for (const h of r.kq.hoc_sinh ?? []) for (const m of h.dang_uu_tien_bo_tro ?? []) if (!maThat.has(m)) bia.push(m)
  console.log(`   BAN ${nhan[i]}: ${bia.length ? `BIA ${bia.length} ma: ${bia.slice(0, 5).join(', ')}` : 'khong bia ma nao'}`)
})

console.log('\n' + '='.repeat(78))
console.log('TIET LO + CHI PHI THAT')
let tong = 0
ketQua.forEach((r, i) => {
  if (r.loi) { console.log(`   BAN ${nhan[i]} = ${r.model} - LOI`); return }
  tong += r.dong
  console.log(`   BAN ${nhan[i]} = ${r.model.padEnd(18)} ${r.giay.toFixed(1).padStart(5)}s | vao ${String(r.u.input_tokens).padStart(6)} | ra ${String(r.u.output_tokens).padStart(5)} | cache doc ${String(r.u.cache_read_input_tokens ?? 0).padStart(5)} | ${r.dong.toLocaleString('vi-VN').padStart(6)} d`)
})
console.log(`   -- tong luot so sanh nay: ${tong.toLocaleString('vi-VN')} d`)
await supabase.auth.signOut()
