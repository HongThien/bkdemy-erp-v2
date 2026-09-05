import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n')
  .map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean)
  .map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const admin = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false } })

let page = 1, total = 0, found = null
while (true) {
  const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 })
  if (error) { console.log('err', error.message); break }
  total += data.users.length
  const u = data.users.find(x => x.email === 'hs0440@hs.bkdemy.local')
  if (u) { found = u; break }
  if (data.users.length < 200) break
  page++
}
console.log('tổng auth.users quét được:', total, '· tìm thấy hs0440:', found ? found.id : 'KHÔNG')

// đối chiếu: những HS khối 4T/5T/3/4/5 khác có auth.users thật không (kiểm 3 em ngẫu nhiên để xem đây là ca lẻ hay hệ thống)
const { data: mauKhac } = await admin.from('hoc_sinh').select('ma_hs, ho_ten, khoi').in('khoi', ['4T']).eq('trang_thai', 'dang_hoc').limit(5)
for (const hs of mauKhac ?? []) {
  const { data: tk } = await admin.from('tai_khoan').select('email').eq('hoc_sinh_id', (await admin.from('hoc_sinh').select('id').eq('ma_hs', hs.ma_hs).single()).data.id).maybeSingle()
  if (!tk) { console.log(hs.ma_hs, '- KHÔNG có tai_khoan'); continue }
  let p = 1, ok = false
  while (true) {
    const { data } = await admin.auth.admin.listUsers({ page: p, perPage: 200 })
    if (data.users.find(x => x.email === tk.email)) { ok = true; break }
    if (data.users.length < 200) break
    p++
  }
  console.log(hs.ma_hs, hs.ho_ten, '-', tk.email, '- auth.users:', ok ? 'CÓ' : 'THIẾU')
}
