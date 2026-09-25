// 2 màn TV toàn màn hình của hệ SỰ KIỆN (spec-su-kien.md §4). Mở qua hash, sau khi đăng nhập nhân sự:
//   #sk-tv=quay&sk=<id>  — Vòng quay: nghe sk_xu nguồn vong_quay mới → quay dừng đúng ô, hiện tên + xu.
//   #sk-tv=hang&sk=<id>  — Hàng chờ: Đang chơi · Mời vào · N bạn đang chờ + 10 tên kế.
// Kết quả quay do Postgres random (fn_sk_quay) — TV CHỈ diễn hoạt ảnh tới đúng ô.
import { useEffect, useMemo, useRef, useState } from 'react'
import * as sk from '../../lib/sukien'

export function parseTvHash(): { man: 'quay' | 'hang'; sk: string } | null {
  const h = new URLSearchParams(location.hash.replace(/^#/, ''))
  const man = h.get('sk-tv'); const id = h.get('sk')
  if ((man === 'quay' || man === 'hang') && id) return { man, sk: id }
  return null
}

export default function TvSuKien({ man, skId }: { man: 'quay' | 'hang'; skId: string }) {
  return man === 'quay' ? <TvVongQuay skId={skId} /> : <TvHangCho skId={skId} />
}

const NEN = 'radial-gradient(ellipse at top, #3b1d6e 0%, #1a0b33 55%, #0b0418 100%)'
const MAU = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#a855f7', '#ec4899', '#14b8a6', '#f97316']

// ─────────────────────────────── VÒNG QUAY ───────────────────────────────
type Quay = { id: string; ten: string; so: number; xu: number }

function TvVongQuay({ skId }: { skId: string }) {
  const [cfg, setCfg] = useState<{ xu: number; ti_le: number }[] | null>(null)
  const [tenSk, setTenSk] = useState('')
  const [goc, setGoc] = useState(0)
  const [dangQuay, setDangQuay] = useState<Quay | null>(null)
  const [hien, setHien] = useState<Quay | null>(null)
  const [ganDay, setGanDay] = useState<Quay[]>([])
  const daThay = useRef<Set<string> | null>(null)
  const hang = useRef<Quay[]>([])
  const ban = useRef(false)

  useEffect(() => {
    sk.tongQuan(skId).then((t) => { setCfg(t.su_kien.cau_hinh.vong_quay); setTenSk(t.su_kien.ten) }).catch(() => setCfg([{ xu: 15, ti_le: 25 }, { xu: 20, ti_le: 50 }, { xu: 25, ti_le: 25 }]))
  }, [skId])

  // Ô trên vòng: chia theo tỉ lệ (25/50/25 ⇒ 2/4/2 ô), xen kẽ cho đẹp.
  const o = useMemo(() => {
    if (!cfg?.length) return [] as number[]
    const tong = cfg.reduce((a, x) => a + x.ti_le, 0) || 1
    const dem = cfg.map((x) => Math.max(1, Math.round((x.ti_le / tong) * 8)))
    const ra: number[] = []
    while (dem.some((d) => d > 0)) cfg.forEach((x, i) => { if (dem[i] > 0) { ra.push(x.xu); dem[i]-- } })
    return ra
  }, [cfg])

  const tai = async () => {
    try {
      const d = await sk.quayGanDay(skId, 10)
      if (!daThay.current) { daThay.current = new Set(d.map((x) => x.id)); setGanDay(d); return } // mở TV: không quay lại cái cũ
      const moi = d.filter((x) => !daThay.current!.has(x.id)).reverse()
      moi.forEach((x) => { daThay.current!.add(x.id); hang.current.push(x) })
      if (moi.length) chayKe()
    } catch { /* thử lại lần poll sau */ }
  }
  sk.useSkLive(['sk_xu'], tai, 2000)
  useEffect(() => { tai() }, [skId]) // eslint-disable-line
  useEffect(() => { if (o.length) chayKe() }, [o.length]) // eslint-disable-line -- lượt quay tới trước khi tải xong cấu hình

  const gocRef = useRef(0)
  const chayKe = () => {
    if (ban.current || !o.length) return
    const q = hang.current.shift()
    if (!q) return
    ban.current = true
    setHien(null); setDangQuay(q)
    const khop = o.map((x, i) => x === q.xu ? i : -1).filter((i) => i >= 0)
    const idx = khop.length ? khop[Math.floor(Math.random() * khop.length)] : 0
    const buoc = 360 / o.length
    // Kim ở đỉnh (0°). Ô idx nằm ở [idx*buoc, (idx+1)*buoc] ⇒ quay sao cho tâm ô về 0°, lệch ngẫu nhiên trong ô.
    const lech = (Math.random() - 0.5) * buoc * 0.6
    const dich = 360 - (idx * buoc + buoc / 2) + lech
    const hienTai = gocRef.current % 360
    const moi = gocRef.current + 360 * 6 + ((dich - hienTai + 360) % 360)
    gocRef.current = moi
    setGoc(moi)
    setTimeout(() => {
      setHien(q); setDangQuay(null)
      setGanDay((p) => [q, ...p].slice(0, 10))
      setTimeout(() => { ban.current = false; setHien(null); chayKe() }, 4500)
    }, 6200)
  }

  const R = 300
  return (
    <div className="flex h-screen w-screen items-center justify-center gap-12 overflow-hidden text-white" style={{ background: NEN }}>
      {/* Vừa khít mọi màn: cạnh = min(86% chiều cao, 50% chiều ngang) — SVG viewBox tự co theo. */}
      <div className="relative aspect-square shrink-0" style={{ width: 'min(86vh, 50vw)' }}>
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2" style={{ width: 0, height: 0, borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderTop: '48px solid #fde047', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.5))' }} />
        <svg viewBox={`${-R - 20} ${-R - 20} ${2 * R + 40} ${2 * R + 40}`} className="h-full w-full"
          style={{ transform: `rotate(${goc}deg)`, transition: dangQuay ? 'transform 6s cubic-bezier(.12,.72,.12,1)' : 'none' }}>
          <circle r={R + 14} fill="#7c2d12" stroke="#fde047" strokeWidth="6" />
          {o.map((xu, i) => {
            const b = (2 * Math.PI) / o.length
            const a0 = i * b - Math.PI / 2, a1 = (i + 1) * b - Math.PI / 2
            const x0 = R * Math.cos(a0), y0 = R * Math.sin(a0), x1 = R * Math.cos(a1), y1 = R * Math.sin(a1)
            const am = (a0 + a1) / 2
            const tx = R * 0.66 * Math.cos(am), ty = R * 0.66 * Math.sin(am)
            return (
              <g key={i}>
                <path d={`M0 0 L${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1} Z`} fill={MAU[i % MAU.length]} stroke="#fff7" strokeWidth="3" />
                <text x={tx} y={ty} fill="#fff" fontSize="56" fontWeight="900" textAnchor="middle" dominantBaseline="middle"
                  transform={`rotate(${(am * 180) / Math.PI + 90} ${tx} ${ty})`} style={{ paintOrder: 'stroke', stroke: '#0006', strokeWidth: 6 }}>{xu}</text>
              </g>
            )
          })}
          <circle r="46" fill="#fde047" stroke="#7c2d12" strokeWidth="6" />
          <text y="4" fontSize="40" textAnchor="middle" dominantBaseline="middle">🏮</text>
        </svg>
      </div>
      <div className="w-[34vw] min-w-[320px]">
        <div className="text-4xl font-black text-yellow-300">🎡 VÒNG QUAY{tenSk ? ` · ${tenSk.toUpperCase()}` : ''}</div>
        <div className="mt-6 min-h-[220px] rounded-3xl bg-white/10 p-6">
          {dangQuay ? (
            <><div className="text-2xl text-white/70">Đang quay cho…</div><div className="mt-2 text-6xl font-black">{dangQuay.ten}</div></>
          ) : hien ? (
            <><div className="text-6xl font-black">{hien.ten}</div><div className="mt-3 text-8xl font-black text-yellow-300">+{hien.xu} xu 🎉</div></>
          ) : <div className="text-3xl text-white/60">Check-in ở bàn bên cạnh để được quay nhé!</div>}
        </div>
        {ganDay.length > 0 && (
          <div className="mt-6 space-y-1 text-xl text-white/80">
            {ganDay.slice(0, 6).map((q) => <div key={q.id} className="flex justify-between"><span>{q.ten}</span><b className="text-yellow-300">+{q.xu}</b></div>)}
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────── HÀNG CHỜ ───────────────────────────────
function TvHangCho({ skId }: { skId: string }) {
  const { tq, err } = sk.useTongQuan(skId)
  if (!tq) return <div className="flex h-screen items-center justify-center text-2xl text-white" style={{ background: NEN }}>{err ?? 'Đang tải…'}</div>
  const phong = tq.phong.filter((p) => p.hang_doi)
  return (
    <div className="flex h-screen w-screen flex-col gap-6 overflow-hidden p-8 text-white" style={{ background: NEN }}>
      <div className="flex items-baseline justify-between">
        <div className="text-5xl font-black text-yellow-300">🏮 {tq.su_kien.ten}</div>
        <div className="text-2xl text-white/60">{new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
      <div className="grid min-h-0 flex-1 gap-6" style={{ gridTemplateColumns: `repeat(${Math.max(1, phong.length)}, minmax(0,1fr))` }}>
        {phong.map((p) => (
          <div key={p.id} className="flex min-h-0 flex-col gap-5">
            {phong.length > 1 && <div className="text-3xl font-bold">{p.ten}</div>}
            <div className="rounded-3xl bg-white/10 p-6">
              <div className="text-2xl font-bold text-sky-300">🎮 ĐANG CHƠI</div>
              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-4xl font-bold">
                {p.luot ? p.luot.nguoi.map((n) => <span key={n.dang_ky_id}>{n.ten}<span className="ml-1 text-2xl text-white/50">#{n.so}</span></span>) : <span className="text-white/40">—</span>}
              </div>
            </div>
            <div className="rounded-3xl bg-emerald-500/25 p-6 ring-4 ring-emerald-400">
              <div className="text-2xl font-bold text-emerald-300">🚪 MỜI VÀO</div>
              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-5xl font-black">
                {p.co_mat.length ? p.co_mat.map((n) => <span key={n.dang_ky_id}>{n.ten}<span className="ml-1 text-3xl text-white/60">#{n.so}</span></span>) : <span className="text-white/40">—</span>}
              </div>
            </div>
            <div className="min-h-0 flex-1 rounded-3xl bg-white/5 p-6">
              <div className="text-2xl font-bold text-yellow-300">⏳ ĐANG CHỜ: {p.cho.length} bạn</div>
              <ol className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2 text-3xl">
                {p.cho.slice(0, 10).map((n, i) => (
                  <li key={n.dang_ky_id} className={n.so_lan_bo_qua ? 'text-amber-300' : ''}><span className="mr-2 text-white/40">{i + 1}.</span>{n.ten}<span className="ml-1 text-xl text-white/40">#{n.so}</span></li>
                ))}
              </ol>
              {p.cho.length > 10 && <div className="mt-3 text-2xl text-white/50">… và {p.cho.length - 10} bạn nữa</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
