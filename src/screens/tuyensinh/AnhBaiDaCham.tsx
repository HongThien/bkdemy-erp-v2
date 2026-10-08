// Ảnh BÀI ĐÃ CHẤM của 1 ca test (Thùy 08/10) — dải thumbnail bấm phóng to; PDF hiện ô "📄 PDF" mở tab mới.
// Có `onThem` ⇒ hiện nút 📸 Chụp ảnh / 🖼️ Thư viện (chọn nhiều trang 1 lần); có `onBo` ⇒ mỗi ảnh có ✕.
// Dùng ở màn Chấm (up + bỏ) và màn Trả bài (chỉ xem). Nguồn: ca_test.bai_da_cham_anh (lib/detest.ts).
import { useState } from 'react'
import ImgZoom from '../../components/ImgZoom'
import { anhNho } from '../../lib/anhNho'
import { laPdfUrl } from '../../lib/detest'

export default function AnhBaiDaCham({ urls, onThem, onBo, toi = false, cao = 'h-11 w-11' }: {
  urls: string[]
  onThem?: (files: File[]) => Promise<void>
  onBo?: (url: string) => Promise<void>
  toi?: boolean   // nền tối (thanh trên màn Trả bài)
  cao?: string
}) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  async function chon(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (!files.length || !onThem) return
    setBusy(true); setErr(null)
    try { await onThem(files) } catch (x: any) { setErr(x.message ?? String(x)) } finally { setBusy(false) }
  }
  async function bo(u: string) {
    if (!onBo || !window.confirm('Bỏ ảnh này khỏi bài đã chấm?')) return
    setBusy(true); setErr(null)
    try { await onBo(u) } catch (x: any) { setErr(x.message ?? String(x)) } finally { setBusy(false) }
  }
  const nut = toi
    ? 'cursor-pointer rounded-md border border-slate-500 px-2.5 py-1.5 text-[12px] text-white hover:bg-slate-700'
    : 'cursor-pointer rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[12px] font-medium text-slate-700 hover:border-indigo-300'
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {urls.map((u, i) => (
        <div key={u} className="relative">
          {laPdfUrl(u)
            ? <a href={u} target="_blank" rel="noreferrer" className={`${cao} flex items-center justify-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-600 ring-1 ring-slate-300`}>📄 PDF</a>
            : <ImgZoom src={anhNho(u, 120)!} zoomSrc={anhNho(u, 1600)!} className={`${cao} rounded-md object-cover ring-1 ring-slate-300`} />}
          {onBo && (
            <button onClick={() => bo(u)} disabled={busy} aria-label={`Bỏ ảnh ${i + 1}`}
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[11px] font-bold leading-none text-white shadow disabled:opacity-40">×</button>
          )}
        </div>
      ))}
      {onThem && (
        <>
          <label className={nut}>📸 Chụp ảnh<input type="file" accept="image/*" capture="environment" className="hidden" onChange={chon} disabled={busy} /></label>
          <label className={nut}>🖼️ Thư viện<input type="file" accept="image/*,application/pdf" multiple className="hidden" onChange={chon} disabled={busy} /></label>
        </>
      )}
      {busy && <span className={`text-[12px] ${toi ? 'text-slate-300' : 'text-slate-500'}`}>Đang tải lên…</span>}
      {err && <span className="text-[12px] text-rose-500">{err}</span>}
    </div>
  )
}
