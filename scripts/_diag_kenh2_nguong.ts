// Read-only: đo kênh ② theo ngưỡng (A >10% · B >15% · C >10%&đạt<50% · D = B hoặc C · E ≥3 yếu&>10%). argv[2] = môn.
import { readFileSync } from 'node:fs'
import { supabase } from '../src/lib/supabase'
import { listCandidatesLop, cuaSoHienTai } from '../src/lib/danhgia'
import { cuaSoCua, cuaSoTruoc } from '../src/gami/danhgia.js'
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const [, email, pass] = (env.VITE_DEV_ACCOUNTS as string).split(';')[0].split('|')
await supabase.auth.signInWithPassword({ email, password: pass })
const mon = process.argv[2] ?? 'Toán'
const { data: lops } = await supabase.from('lop').select('id, ten_lop').eq('trang_thai', 'dang_hoc').eq('mon', mon).limit(500)
type R = { ten: string; lop: string; nDo: number; nYeu: number; nDat: number; khac: boolean; lv: number; daDuyet: boolean }
async function quet(): Promise<{ roster: number; rows: R[] }> {
  const rows: R[] = []; let roster = 0
  for (const l of (lops ?? []) as any[]) {
    const cs = await listCandidatesLop(l.id).catch(() => [])
    const { count } = await supabase.from('hoc_sinh_lop').select('id', { count: 'exact', head: true }).eq('lop_id', l.id).eq('trang_thai', 'dang_hoc')
    roster += count ?? 0
    const ht = cuaSoHienTai(), tr = cuaSoTruoc(ht)
    for (const c of cs) {
      const gd = c.sheet.dangs.filter((d: any) => { const w = cuaSoCua(d.cuoiCungAt); return w === ht || w === tr })
      const khac = c.kenh.some((k) => k !== 'pct_yeu' && k !== 'thai_do') || (c.sheet.levelKienThuc > 0 && c.deXuatKienThuc.deXuat !== c.sheet.levelKienThuc)
      rows.push({ ten: c.ho_ten, lop: l.ten_lop, nDo: gd.length, nYeu: gd.filter((d: any) => d.muc === 'yeu').length, nDat: gd.filter((d: any) => d.muc === 'dat').length, khac, lv: c.sheet.levelKienThuc, daDuyet: !!c.daDuyetKienThucAt })
    }
  }
  return { roster, rows }
}
function bao(nhan: string, roster: number, rows: R[]) {
  const pct = (r: R) => (r.nDo ? r.nYeu / r.nDo : 0), pDat = (r: R) => (r.nDo ? r.nDat / r.nDo : 1)
  const rules: [string, (r: R) => boolean][] = [
    ['A  >10%', (r) => r.nDo > 0 && pct(r) > 0.10],
    ['B  >15%', (r) => r.nDo > 0 && pct(r) > 0.15],
    ['C  >10% & đạt<50%', (r) => r.nDo > 0 && pct(r) > 0.10 && pDat(r) < 0.5],
    ['D  B hoặc C', (r) => r.nDo > 0 && (pct(r) > 0.15 || (pct(r) > 0.10 && pDat(r) < 0.5))],
    ['E  ≥3 dạng yếu & >10%', (r) => r.nDo > 0 && pct(r) > 0.10 && r.nYeu >= 3],
  ]
  console.log(`\n=== ${nhan} · ${mon} · roster ${roster} HS · cửa sổ ${cuaSoHienTai()} ===`)
  const khac = rows.filter((r) => r.khac).length
  console.log(`vào vì kênh khác (①③④/báo động/case mở): ${khac}`)
  for (const [t, f] of rules) {
    const k2 = rows.filter((r) => f(r)), chi = k2.filter((r) => !r.khac)
    const hang = rows.filter((r) => f(r) || r.khac).filter((r) => r.lv === 0 && !r.daDuyet)
    console.log(`${t.padEnd(24)} kênh②=${String(k2.length).padStart(3)} · chỉ-vì-②=${String(chi.length).padStart(3)} · tổng đủ tín hiệu=${String(k2.length + khac - k2.filter((r) => r.khac).length).padStart(3)} (${Math.round(100 * (k2.length + khac - k2.filter((r) => r.khac).length) / roster)}% roster) · hàng đợi duyệt=${hang.length}`)
  }
  const bien = rows.filter((r) => r.nDo > 0 && pct(r) > 0.10 && pct(r) <= 0.15 && !r.khac)
  console.log(`sát biên (10–15%, chỉ vì ②): ${bien.length} — ${bien.slice(0, 12).map((r) => `${r.ten}(${r.lop} ${r.nYeu}/${r.nDo}, đạt ${r.nDat})`).join('; ')}`)
}
const a = await quet(); bao('Kênh ② theo ngưỡng', a.roster, a.rows)
