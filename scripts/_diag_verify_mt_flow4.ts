// Verify kênh 4 (MT) đang bắt đúng: cho vài lớp Toán vừa cập nhật MT, chạy listCandidatesLop THẬT,
// đối chiếu với tính tay từ gami_grades gốc cho 1-2 HS cụ thể.
import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
import { listCandidatesLop } from '../src/lib/danhgia'

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
if (error) { console.error('❌', error.message); process.exit(1) }

const LOP_IDS: Record<string, string> = {
  '9A1': '61798484-db05-4464-b050-5a2cfd4dc27b',
  '8A1': 'dbe3056a-bb04-4178-8335-c19e9964f456',
  '6A1': 'edae4996-d5e3-4d66-af9f-bfd0995e9f4d', // đây là buoi_hoc_id, cần lop_id thật riêng — sẽ tra lại
}
// Tra lop_id thật từ buoi_hoc (map trên đang lẫn buoi_hoc_id, sửa lại cho đúng)
const buoiIds = Object.values(LOP_IDS)
const { data: buois } = await supabase.from('buoi_hoc').select('id, lop_id, lop:lop_id(ten_lop)').in('id', buoiIds)
const lopIdByTen: Record<string, string> = {}
for (const b of (buois ?? []) as any[]) lopIdByTen[b.lop.ten_lop] = b.lop_id

for (const [ten, lopId] of Object.entries(lopIdByTen)) {
  const cands = await listCandidatesLop(lopId)
  const viaMT = cands.filter((c) => c.kenh.includes('so_lop_mt'))
  console.log(`\n=== ${ten} (${lopId}) — ${cands.length} candidate, ${viaMT.length} dính kênh MT ===`)
  for (const c of viaMT) {
    console.log(`  ${c.ho_ten}: coSoLopMT=${c.sheet.coSoLopMT} · lyDo MT: ${c.lyDo.find(l => l.startsWith('④'))}`)
  }
}
