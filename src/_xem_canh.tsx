// TRANG ĐÁNH DẤU Ô cho CẢNH LIỀN của Trang chính ERP (Thùy 14/10: giữ nguyên ảnh gốc, chỉ chừa ô trống để điền chữ).
// Không cần đăng nhập, chỉ chạy ở dev: /xem-thu-canh.html?anh=<đường dẫn ảnh>
// Cách dùng: chọn ô ở cột trái → kéo chuột khoanh ô trên tranh (ô điểm ★ / số: bấm 1 cái) → tự sang ô kế → "Xem thử" để thấy
// chữ thật đè lên tranh → "Tải manifest.json" bỏ vào public/bk-ui/erp/canh/<id>/ cạnh ảnh. Khuôn: design/YEU-CAU-ANH-STYLE-ERP.md §A.
// Toạ độ luôn là px trên ẢNH GỐC (kích thước thật của file), không phụ thuộc màn đang xem to hay nhỏ.
import { StrictMode, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import HomeScene from './screens/home/HomeScene'
import { canhLien } from './lib/canhErp'
import { YEU_THICH_TOI_DA } from './lib/menu'
import './index.css'

document.documentElement.style.setProperty('--app-z', '1')
document.documentElement.style.setProperty('--app-unz', '1')

type Khoa = { k: string; nhan: string; diem?: boolean }
const BANG: Khoa[] = [
  { k: 'today', nhan: 'Bảng Notice Board (góc trái trên)' }, { k: 'development', nhan: 'Bảng Việc phát triển' }, { k: 'order', nhan: 'Bảng Order' },
  { k: 'greeting', nhan: 'Hồ sơ (avatar · lời chào · hòm thư)' }, { k: 'favorites_title', nhan: 'Biển "Yêu thích" (tuỳ chọn)' },
  { k: 'toolbar_primary', nhan: 'Nút Tuỳ chỉnh' }, { k: 'toolbar_secondary', nhan: 'Nút Giao diện' },
]
const dsKhoa = (soNhom: number): Khoa[] => [
  ...BANG,
  ...Array.from({ length: YEU_THICH_TOI_DA }, (_, i) => [
    { k: `fav${i + 1}.box`, nhan: `Yêu thích ${i + 1} · cả ô (vùng bấm)` },
    { k: `fav${i + 1}.label`, nhan: `Yêu thích ${i + 1} · chỗ ghi tên` },
    { k: `fav${i + 1}.star`, nhan: `Yêu thích ${i + 1} · chỗ ★ (bấm 1 điểm)`, diem: true },
  ]).flat(),
  ...Array.from({ length: soNhom }, (_, i) => [
    { k: `grp${i + 1}.box`, nhan: `Nhóm ${i + 1} · cả ô (vùng bấm)` },
    { k: `grp${i + 1}.label`, nhan: `Nhóm ${i + 1} · chỗ ghi tên` },
    { k: `grp${i + 1}.icon`, nhan: `Nhóm ${i + 1} · chỗ icon` },
    { k: `grp${i + 1}.badge`, nhan: `Nhóm ${i + 1} · chỗ "n mục" (bấm 1 điểm)`, diem: true },
  ]).flat(),
]
const MAU = (k: string) => (k.startsWith('fav') ? '#e11d48' : k.startsWith('grp') ? '#2563eb' : '#16a34a')
const TOKENS_MAC_DINH = { ink: '#3b2a1e', muted: '#7a6450', acc: '#c2410c', acc_ink: '#ffffff', surface: '#fffaf2', surface2: '#f6ead8', line: '#e2cfb2', radius: 14, font_head: 'Baloo 2', font_body: 'Be Vietnam Pro' }

type Gia = Record<string, number[]>
const tron = (n: number) => Math.round(n)

function dungManifest(v: Gia, soNhom: number, W: number, H: number, tenFile: string, tone: string, tokens: object) {
  const zones: Record<string, number[]> = {}
  for (const b of BANG) if (v[b.k]) zones[b.k] = v[b.k]
  const favorite_slots = Array.from({ length: YEU_THICH_TOI_DA }, (_, i) => i + 1).filter((i) => v[`fav${i}.box`])
    .map((i) => ({ box: v[`fav${i}.box`], ...(v[`fav${i}.label`] ? { label: v[`fav${i}.label`] } : {}), ...(v[`fav${i}.star`] ? { star: v[`fav${i}.star`] } : {}) }))
  const group_slots = Array.from({ length: soNhom }, (_, i) => i + 1).filter((i) => v[`grp${i}.box`])
    .map((i) => ({ box: v[`grp${i}.box`], ...(v[`grp${i}.label`] ? { label: v[`grp${i}.label`] } : {}), ...(v[`grp${i}.icon`] ? { icon: v[`grp${i}.icon`] } : {}), ...(v[`grp${i}.badge`] ? { badge: v[`grp${i}.badge`] } : {}) }))
  return { kieu: 'lien', style_id: tenFile.replace(/\.[a-z0-9]+$/i, ''), ten: '', canvas: { width: W, height: H }, tone, background: { file: tenFile }, tokens, zones, favorite_slots, group_slots }
}
function napManifest(m: any): { v: Gia; soNhom: number } {
  const v: Gia = {}
  for (const [k, z] of Object.entries(m.zones ?? {})) v[k] = Array.isArray(z) ? z as number[] : (z as any).box
  ;(m.favorite_slots ?? []).forEach((s: any, i: number) => { v[`fav${i + 1}.box`] = s.box; if (s.label) v[`fav${i + 1}.label`] = s.label; if (s.star) v[`fav${i + 1}.star`] = s.star })
  ;(m.group_slots ?? []).forEach((s: any, i: number) => { v[`grp${i + 1}.box`] = s.box; if (s.label) v[`grp${i + 1}.label`] = s.label; if (s.icon) v[`grp${i + 1}.icon`] = s.icon; if (s.badge) v[`grp${i + 1}.badge`] = s.badge })
  return { v, soNhom: Math.max(4, (m.group_slots ?? []).length) }
}

// Nội dung mẫu để soi chữ thật trên tranh (không đụng DB).
const Dong = ({ t, phu }: { t: string; phu?: string }) => (
  <div className="flex items-center gap-2 border-b border-black/10 py-1 text-[13px]"><span className="size-3.5 shrink-0 rounded border border-current opacity-60" /><span className="min-w-0 flex-1 truncate">{t}</span>{phu && <span className="text-[11px] opacity-60">{phu}</span>}</div>
)
const MAU_TODAY = <div><div className="mb-1 text-[15px] font-extrabold">📌 Notice Board</div><Dong t="Điểm danh · 8A1" phu="0/18" /><Dong t="Chấm ET · 7A2" phu="2 quá hạn" /><Dong t="Report & Báo tan · 9A1" /><Dong t="Chuẩn bị phòng 204 · Tối" /><Dong t="Nhắc: gọi phụ huynh em Minh" /></div>
const MAU_DEV = <div><div className="mb-1 text-[15px] font-extrabold">🚀 Việc phát triển</div><Dong t="⚠ Bản đồ kiến thức lớp 8 — chia dạng" phu="60%" /><Dong t="● Soạn ET tuần 6 khối 9" phu="30%" /><Dong t="● Kiểm lời giải Hình lớp 7" phu="0%" /></div>
const MAU_ORDER = <div><div className="mb-1 text-[15px] font-extrabold">📋 Bảng Order</div><Dong t="In 30 phiếu ET 8A1" phu="Lộc" /><Dong t="Mua bút dạ bảng" phu="Trang" /><Dong t="Sửa máy chiếu P204" /></div>
const MAU_HOSO = <div className="flex w-full items-center gap-2"><span className="flex size-[52px] shrink-0 items-center justify-center rounded-full bg-indigo-500 text-[22px] font-bold text-white">T</span><div className="min-w-0 flex-1"><div className="truncate text-[17px] font-extrabold">Chào Thùy!</div><div className="text-[11px] opacity-70">Thứ Tư, 14/10</div></div><span className="text-[18px]">✉️<sup className="text-[10px] font-bold text-red-600">3</sup></span></div>
const MAU_YT = ['Buổi học', 'ET', 'Bản đồ kiến thức (Kho)', 'Kho đề thi', 'Học phí', 'Duyệt kho', 'Report & Báo tan', 'Nhập kho (từ tài liệu)']
const MAU_NHOM: [string, string][] = [['Việc của tôi', '✅'], ['Vận hành', '🛠'], ['Học thuật', '📚'], ['Quản lý chất lượng', '🎯'], ['Core team', '👥'], ['Dashboard', '📊']]

function Trang() {
  const q = new URLSearchParams(location.search)
  const [anh, setAnh] = useState(q.get('anh') ?? '/bk-ui/erp/nen/ke_hoc_thuat.jpg')
  const [tenFile, setTenFile] = useState(() => (q.get('anh') ?? 'scene.jpg').split('/').pop() || 'scene.jpg')
  const khoaNho = `erp.canhLien:${anh}`
  const [soNhom, setSoNhom] = useState(4)
  const [v, setV] = useState<Gia>({})
  const [tone, setTone] = useState('sang')
  const [tokens, setTokens] = useState<object>(TOKENS_MAC_DINH)
  const [chon, setChon] = useState('today')
  const [xem, setXem] = useState(false)
  const [kich, setKich] = useState<{ W: number; H: number } | null>(null)
  const [keo, setKeo] = useState<{ x: number; y: number; x2: number; y2: number } | null>(null)
  const [json, setJson] = useState('')
  const khung = useRef<HTMLDivElement>(null)

  // bản nháp đang đánh dấu nhớ trên máy theo từng ảnh (tiện quay lại làm tiếp) — mất cũng không sao, manifest mới là kết quả
  useEffect(() => {
    try { const s = JSON.parse(localStorage.getItem(khoaNho) ?? 'null'); if (s) { setV(s.v ?? {}); setSoNhom(s.soNhom ?? 4); setTone(s.tone ?? 'sang'); if (s.tokens) setTokens(s.tokens) } else setV({}) } catch { setV({}) }
  }, [khoaNho])
  useEffect(() => { try { localStorage.setItem(khoaNho, JSON.stringify({ v, soNhom, tone, tokens })) } catch { /* bỏ qua */ } }, [khoaNho, v, soNhom, tone, tokens])
  useEffect(() => { const i = new Image(); i.onload = () => setKich({ W: i.naturalWidth, H: i.naturalHeight }); i.src = anh }, [anh])

  const ds = useMemo(() => dsKhoa(soNhom), [soNhom])
  const kc = ds.find((x) => x.k === chon) ?? ds[0]
  const manifest = useMemo(() => (kich ? dungManifest(v, soNhom, kich.W, kich.H, tenFile, tone, tokens) : null), [v, soNhom, kich, tenFile, tone, tokens])
  useEffect(() => { if (manifest) setJson(JSON.stringify(manifest, null, 2)) }, [manifest])
  const canhXem = useMemo(() => (manifest ? canhLien({ ...manifest, background: { file: anh } }, 'xem', '') : null), [manifest, anh])

  const toaDo = (e: React.MouseEvent) => {
    const r = khung.current!.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * kich!.W, y: ((e.clientY - r.top) / r.height) * kich!.H }
  }
  const sangKe = () => { const i = ds.findIndex((x) => x.k === kc.k); if (i >= 0 && i < ds.length - 1) setChon(ds[i + 1].k) }
  const ghi = (k: string, gt: number[]) => { setV((s) => ({ ...s, [k]: gt.map(tron) })); sangKe() }
  const xuong = (e: React.MouseEvent) => {
    if (!kich || xem) return
    const p = toaDo(e)
    if (kc.diem) { ghi(kc.k, [p.x, p.y]); return }
    setKeo({ x: p.x, y: p.y, x2: p.x, y2: p.y })
  }
  const reChuot = (e: React.MouseEvent) => { if (keo) { const p = toaDo(e); setKeo({ ...keo, x2: p.x, y2: p.y }) } }
  const len = () => {
    if (!keo) return
    const x = Math.min(keo.x, keo.x2), y = Math.min(keo.y, keo.y2), w = Math.abs(keo.x2 - keo.x), h = Math.abs(keo.y2 - keo.y)
    setKeo(null)
    if (w > 6 && h > 6) ghi(kc.k, [x, y, w, h])
  }
  const tai = () => {
    const b = new Blob([json], { type: 'application/json' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'manifest.json'; a.click(); URL.revokeObjectURL(a.href)
  }
  const nap = () => {
    try { const m = JSON.parse(json); const r = napManifest(m); setV(r.v); setSoNhom(r.soNhom); if (m.tone) setTone(m.tone); if (m.tokens) setTokens(m.tokens) } catch (e: any) { alert(`JSON lỗi: ${e.message}`) }
  }
  const daCo = ds.filter((x) => v[x.k]).length

  return (
    <div className="flex h-screen bg-slate-100 text-[13px] text-slate-800">
      <aside className="flex w-[300px] shrink-0 flex-col border-r bg-white">
        <div className="space-y-2 border-b p-3">
          <div className="text-[14px] font-bold">Đánh dấu ô — cảnh liền</div>
          <label className="block">Ảnh (đường dẫn)
            <input value={anh} onChange={(e) => { setAnh(e.target.value); setTenFile(e.target.value.split('/').pop() || 'scene.jpg') }} className="mt-0.5 w-full rounded border px-2 py-1" />
          </label>
          <label className="block">…hoặc chọn ảnh trên máy
            <input type="file" accept="image/*" className="mt-0.5 block w-full text-[12px]" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setAnh(URL.createObjectURL(f)); setTenFile(f.name) } }} />
          </label>
          <div className="flex items-center gap-2">
            <span>Số ô nhóm</span>
            {[4, 6].map((n) => <button key={n} onClick={() => setSoNhom(n)} className={`rounded border px-2 py-0.5 ${soNhom === n ? 'border-indigo-500 bg-indigo-50 font-bold' : ''}`}>{n}</button>)}
            <span className="ml-2">Nền</span>
            {['sang', 'toi'].map((t) => <button key={t} onClick={() => setTone(t)} className={`rounded border px-2 py-0.5 ${tone === t ? 'border-indigo-500 bg-indigo-50 font-bold' : ''}`}>{t === 'sang' ? 'sáng' : 'tối'}</button>)}
          </div>
          <div className="text-[11.5px] text-slate-500">{kich ? `Ảnh ${kich.W}×${kich.H}px · đã đánh dấu ${daCo}/${ds.length} ô` : 'Đang tải ảnh…'}</div>
        </div>
        <ol className="min-h-0 flex-1 overflow-auto p-2">
          {ds.map((x) => (
            <li key={x.k}>
              <button onClick={() => setChon(x.k)} className={`flex w-full items-center gap-2 rounded px-2 py-1 text-left ${chon === x.k ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100'}`}>
                <span className="size-2.5 shrink-0 rounded-sm" style={{ background: MAU(x.k), opacity: v[x.k] ? 1 : 0.25 }} />
                <span className="min-w-0 flex-1 truncate">{x.nhan}</span>
                {v[x.k] && <span onClick={(e) => { e.stopPropagation(); setV((s) => { const n = { ...s }; delete n[x.k]; return n }) }} title="Bỏ ô này" className="px-1 opacity-60 hover:opacity-100">✕</span>}
              </button>
            </li>
          ))}
        </ol>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b bg-white px-3 py-2">
          <span className="truncate font-semibold">{xem ? 'Xem thử chữ thật trên tranh' : `Đang khoanh: ${kc.nhan}`}</span>
          <button onClick={() => setXem(!xem)} className="ml-auto rounded bg-indigo-600 px-3 py-1 font-semibold text-white">{xem ? '✎ Quay lại đánh dấu' : '👁 Xem thử'}</button>
          <button onClick={tai} disabled={!manifest} className="rounded border px-3 py-1 font-semibold">⬇ Tải manifest.json</button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-3">
          {kich && !xem && (
            <div ref={khung} onMouseDown={xuong} onMouseMove={reChuot} onMouseUp={len} onMouseLeave={len}
              className="relative mx-auto max-w-full cursor-crosshair select-none" style={{ aspectRatio: `${kich.W} / ${kich.H}` }}>
              <img src={anh} alt="" draggable={false} className="pointer-events-none absolute inset-0 h-full w-full" />
              <svg viewBox={`0 0 ${kich.W} ${kich.H}`} className="pointer-events-none absolute inset-0 h-full w-full">
                {ds.filter((x) => v[x.k]).map((x) => {
                  const g = v[x.k]
                  const dang = x.k === chon
                  return g.length === 2
                    ? <circle key={x.k} cx={g[0]} cy={g[1]} r={dang ? 12 : 8} fill={MAU(x.k)} stroke="#fff" strokeWidth={3} />
                    : <g key={x.k}><rect x={g[0]} y={g[1]} width={g[2]} height={g[3]} fill={MAU(x.k)} fillOpacity={dang ? 0.28 : 0.12} stroke={MAU(x.k)} strokeWidth={dang ? 5 : 3} strokeDasharray={x.k.endsWith('.box') || !x.k.includes('.') ? '' : '10 6'} />
                      <text x={g[0] + 8} y={g[1] + 30} fontSize={24} fontWeight={700} fill={MAU(x.k)} stroke="#fff" strokeWidth={4} paintOrder="stroke">{x.k}</text></g>
                })}
                {keo && <rect x={Math.min(keo.x, keo.x2)} y={Math.min(keo.y, keo.y2)} width={Math.abs(keo.x2 - keo.x)} height={Math.abs(keo.y2 - keo.y)} fill="#6366f1" fillOpacity={0.2} stroke="#6366f1" strokeWidth={4} />}
              </svg>
            </div>
          )}
          {kich && xem && canhXem && (
            <div className="mx-auto max-w-full" style={{ aspectRatio: `${kich.W} / ${kich.H}` }}>
              <HomeScene canh={canhXem} today={MAU_TODAY} dev={MAU_DEV} order={MAU_ORDER} profile={MAU_HOSO}
                tuyChinh={<span className="text-[13px] font-bold">⚙ Tuỳ chỉnh</span>} giaoDien={<span className="text-[13px] font-bold">🎨 Giao diện</span>}
                yeuThich={MAU_YT.slice(0, 6).map((t, i) => ({ id: `yt${i}`, ten: t, onMo: () => {}, onSao: () => {} }))}
                nhom={MAU_NHOM.slice(0, soNhom).map(([t, ic], i) => ({ khoa: `g${i}`, ten: t, icon: ic, so: 7 + i, onMo: () => {} }))} />
            </div>
          )}
        </div>
        <div className="flex gap-2 border-t bg-white p-2">
          <textarea value={json} onChange={(e) => setJson(e.target.value)} spellCheck={false} className="h-28 min-w-0 flex-1 rounded border p-2 font-mono text-[11px]" />
          <div className="flex flex-col gap-1.5">
            <button onClick={nap} className="rounded border px-3 py-1 font-semibold">⟲ Nạp JSON</button>
            <button onClick={() => navigator.clipboard?.writeText(json)} className="rounded border px-3 py-1 font-semibold">⧉ Chép</button>
          </div>
        </div>
      </main>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<StrictMode><Trang /></StrictMode>)
