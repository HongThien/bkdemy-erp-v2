import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env.local','utf8').split('\n').filter(l=>l.includes('=')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(), l.slice(i+1).trim()]}))
const supabase = createClient(env.VITE_SUPABASE_URL || env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE)
const rootId = 'e5d87e5d-2d5f-4f3b-b1d8-be8c49901849'

// descendants via hinh_mo_hinh_cha (cha_id -> mo_hinh_id means mo_hinh_id's parent is cha_id)
const { data: allCha } = await supabase.from('hinh_mo_hinh_cha').select('mo_hinh_id, cha_id')
const childrenOf = new Map()
for (const r of allCha||[]) { const a = childrenOf.get(r.cha_id)||[]; a.push(r.mo_hinh_id); childrenOf.set(r.cha_id, a) }
const desc = new Set([rootId])
const stack=[rootId]
while(stack.length){ const id=stack.pop(); for(const c of childrenOf.get(id)||[]){ if(!desc.has(c)){desc.add(c); stack.push(c)} } }
console.log('mô hình trong họ Hình thang (root+desc):', desc.size)

// baiToan nodes under these mô hình
const { data: nodes } = await supabase.from('hinh_baitoan').select('id, mo_hinh_id, ma').in('mo_hinh_id', [...desc])
console.log('baiToan nodes:', JSON.stringify(nodes))

// hinh_gt_bai rows referencing these nodes directly (loai=chuan/ghep -> ref via ghep_node_ids, or bienthe/y via ref_id needing join)
if (nodes?.length) {
  const nodeIds = nodes.map(n=>n.id)
  const { data: baiRows } = await supabase.from('hinh_gt_bai').select('id, buoi_id, phan, loai, ref_id, ghep_node_ids').overlaps('ghep_node_ids', nodeIds)
  console.log('gt_bai (ghep node match):', JSON.stringify(baiRows))
}
