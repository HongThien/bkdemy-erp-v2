import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const sb = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false } })
// Cùng shape với listBaoSaiDe (lọc quan hệ lồng qua !inner) — kiểm PostgREST chấp nhận + lọc đúng.
const { data, error } = await sb.from('bai_test_report')
  .select('id, y_kien, bai_lam_cau_id, blc:bai_lam_cau_id!inner(bai_test_cau_id, cau:bai_test_cau_id!inner(loai_cau))')
  .eq('trang_thai', 'moi').neq('blc.cau.loai_cau', 'tra_loi_ngan').limit(1000)
console.log('error:', error?.message ?? null, '| rows (TN/ĐS moi):', data?.length, JSON.stringify(data?.slice(0, 2)))
const all = await sb.from('bai_test_report').select('id, blc:bai_lam_cau_id!inner(cau:bai_test_cau_id!inner(loai_cau))').eq('trang_thai', 'moi').limit(1000)
console.log('đối chiếu — mọi report moi:', all.data?.map((r) => r.blc?.cau?.loai_cau))
