// BOX "Bảng Order" (Trang chính): nhân sự đặt hàng nhau làm một việc chưa đủ thành task — có chỗ ghi, có trạng thái, có lịch sử.
//   📥 Gửi tôi  — việc người khác nhờ tôi: phản hồi Bận / Đang làm / Xong / Không làm được (+ lời nhắn)
//   📤 Tôi đặt  — việc tôi nhờ người khác: theo dõi trạng thái, huỷ / mở lại
// GHI qua fn_order_* (order + lịch sử + thư vào hòm thư cùng transaction); ở đây vá đúng dòng tại chỗ, không nạp lại cả bảng.
import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../../store/useStore'
import { listNhanSu } from '../../lib/nhansu'
import { homNayVN } from '../../lib/tuan'
import SearchSelect from '../../components/SearchSelect'
import { listOrder, listOrderLog, taoOrder, phanHoiOrder, dangMo, TEN_TRANG_THAI, type OrderRow, type OrderLog, type TrangThaiOrder } from '../../lib/order'
import { HEAD, THE } from './khung'

const MAU_TT: Record<TrangThaiOrder, string> = {
  moi: 'bg-sky-100 text-sky-700', ban: 'bg-amber-100 text-amber-700', dang_lam: 'bg-indigo-100 text-indigo-700',
  xong: 'bg-emerald-100 text-emerald-700', tu_choi: 'bg-rose-100 text-rose-700', huy: 'bg-slate-200 text-slate-500',
}
const NUT_NHAN: TrangThaiOrder[] = ['ban', 'dang_lam', 'xong', 'tu_choi']
const ddmm = (iso: string) => { const [, m, d] = iso.slice(0, 10).split('-'); return `${d}/${m}` }
const gio = (iso: string) => new Date(iso).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' })

function FormDat({ meId, onXong, onDong }: { meId: string; onXong: (id: string) => void; onDong: () => void }) {
  const [nguoi, setNguoi] = useState<string | null>(null)
  const [nd, setNd] = useState('')
  const [han, setHan] = useState('')
  const [opts, setOpts] = useState<{ id: string; label: string; img?: string | null }[]>([])
  const [dang, setDang] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => {
    listNhanSu().then((ns) => setOpts(ns.filter((n) => n.trang_thai === 'dang_lam' && n.id !== meId).map((n) => ({ id: n.id, label: n.ho_ten, img: n.anh_url })))).catch(() => setOpts([]))
  }, [meId])
  const gui = async () => {
    if (!nguoi || !nd.trim()) return
    setDang(true); setLoi(null)
    try { onXong(await taoOrder(nguoi, nd.trim(), han || null)) }
    catch (e: any) { setLoi(e?.message ?? String(e)); setDang(false) }
  }
  return (
    <div className="mb-3 space-y-2 border border-[var(--sk-line)] bg-[var(--sk-surface2)] p-3" style={{ borderRadius: 10 }}>
      <SearchSelect value={nguoi} onChange={setNguoi} options={opts} avatars placeholder="Đặt order cho… (gõ tên)" allowClear={false} />
      <textarea value={nd} onChange={(e) => setNd(e.target.value)} rows={2} maxLength={1000} placeholder="Nhờ làm việc gì? (ghi rõ để người nhận khỏi phải hỏi lại)"
        className="w-full resize-none border border-[var(--sk-line)] bg-[var(--sk-bg)] px-2.5 py-1.5 text-[13px] text-[var(--sk-ink)] outline-none focus:border-[var(--sk-acc)]" style={{ borderRadius: 8 }} />
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-1.5 text-[12.5px] text-[var(--sk-muted)]">Hạn
          <input type="date" value={han} min={homNayVN()} onChange={(e) => setHan(e.target.value)}
            className="border border-[var(--sk-line)] bg-[var(--sk-bg)] px-2 py-1 text-[12.5px] text-[var(--sk-ink)]" style={{ borderRadius: 8 }} />
          {han && <button onClick={() => setHan('')} className="text-[12px] underline">bỏ hạn</button>}
        </label>
        {loi && <span className="text-[12px] text-rose-500">{loi}</span>}
        <span className="ml-auto flex gap-2">
          <button onClick={onDong} className="px-3 py-1.5 text-[13px] text-[var(--sk-muted)] hover:text-[var(--sk-ink)]">Thôi</button>
          <button onClick={gui} disabled={dang || !nguoi || !nd.trim()}
            className="bg-[var(--sk-acc)] px-4 py-1.5 text-[13px] font-bold text-[var(--sk-acc-ink)] disabled:opacity-40" style={{ borderRadius: 8 }}>{dang ? 'Đang gửi…' : 'Gửi order'}</button>
        </span>
      </div>
    </div>
  )
}

function ChiTiet({ o, laNguoiNhan, onDoi }: { o: OrderRow; laNguoiNhan: boolean; onDoi: (t: TrangThaiOrder, ghiChu: string | null) => Promise<void> }) {
  const [log, setLog] = useState<OrderLog[] | null>(null)
  const [ghiChu, setGhiChu] = useState('')
  const [dang, setDang] = useState(false)
  const nap = () => listOrderLog(o.id).then(setLog).catch(() => setLog((c) => c ?? []))
  useEffect(() => { nap() }, [o.id, o.updated_at])   // eslint-disable-line react-hooks/exhaustive-deps
  const gui = async (t: TrangThaiOrder) => {
    setDang(true)
    try { await onDoi(t, ghiChu.trim() || null); setGhiChu('') } finally { setDang(false) }
  }
  const nutCuaToi: TrangThaiOrder[] = laNguoiNhan ? NUT_NHAN : (dangMo(o.trang_thai) ? ['huy'] : ['moi'])
  return (
    <div className="mt-2 border-t border-[var(--sk-line)] pt-2">
      <p className="mb-2 whitespace-pre-line text-[13px] text-[var(--sk-ink)]">{o.noi_dung}</p>
      {log && log.length > 0 && (
        <ul className="mb-2 space-y-1">
          {log.map((l) => (
            <li key={l.id} className="text-[12px] text-[var(--sk-muted)]">
              <span className="tabular-nums">{gio(l.created_at)}</span> · <b className="text-[var(--sk-ink)]">{l.nguoi?.ho_ten ?? '—'}</b> · {TEN_TRANG_THAI[l.trang_thai]}
              {l.ghi_chu && <span className="block pl-3 text-[var(--sk-ink)]">💬 {l.ghi_chu}</span>}
            </li>
          ))}
        </ul>
      )}
      <textarea value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} rows={1} maxLength={500} placeholder="Lời nhắn kèm theo (không bắt buộc)…"
        className="mb-2 w-full resize-none border border-[var(--sk-line)] bg-[var(--sk-bg)] px-2.5 py-1.5 text-[12.5px] text-[var(--sk-ink)] outline-none focus:border-[var(--sk-acc)]" style={{ borderRadius: 8 }} />
      <div className="flex flex-wrap gap-1.5">
        {nutCuaToi.map((t) => (
          <button key={t} disabled={dang || (t === o.trang_thai)} onClick={() => gui(t)}
            className={`px-3 py-1 text-[12.5px] font-semibold disabled:opacity-40 ${t === o.trang_thai ? MAU_TT[t] : 'border border-[var(--sk-line)] hover:bg-[var(--sk-surface2)]'}`} style={{ borderRadius: 999 }}>
            {t === 'moi' ? 'Mở lại' : t === 'huy' ? 'Huỷ order' : TEN_TRANG_THAI[t]}
          </button>
        ))}
        <button disabled={dang || !ghiChu.trim()} onClick={() => gui(o.trang_thai)}
          className="ml-auto px-3 py-1 text-[12.5px] font-semibold text-[var(--sk-acc)] hover:underline disabled:opacity-40 disabled:no-underline">Chỉ gửi lời nhắn</button>
      </div>
    </div>
  )
}

export default function BangOrder() {
  const meId = useStore((s) => s.me?.nhanSu.id)
  const [rows, setRows] = useState<OrderRow[] | null>(null)
  const [loi, setLoi] = useState(false)
  const [tab, setTab] = useState<'toi' | 'dat'>('toi')
  const [mo, setMo] = useState<string | null>(null)
  const [form, setForm] = useState(false)
  const [hienDong, setHienDong] = useState(false)
  const [loiGhi, setLoiGhi] = useState<string | null>(null)
  const hom = homNayVN()

  const nap = () => listOrder().then((r) => { setRows(r); setLoi(false) }).catch(() => { setLoi(true); setRows((c) => c ?? []) })
  useEffect(() => { if (meId) nap() }, [meId])   // eslint-disable-line react-hooks/exhaustive-deps

  const cuaTab = useMemo(() => (rows ?? []).filter((o) => (tab === 'toi' ? o.nguoi_nhan_id === meId : o.nguoi_dat_id === meId)), [rows, tab, meId])
  const dangMoDs = cuaTab.filter((o) => dangMo(o.trang_thai))
  const daDong = cuaTab.filter((o) => !dangMo(o.trang_thai))
  const soMoToi = (rows ?? []).filter((o) => o.nguoi_nhan_id === meId && dangMo(o.trang_thai)).length
  const soMoDat = (rows ?? []).filter((o) => o.nguoi_dat_id === meId && dangMo(o.trang_thai)).length

  const doi = async (o: OrderRow, t: TrangThaiOrder, ghiChu: string | null) => {
    setLoiGhi(null)
    try {
      await phanHoiOrder(o.id, t, ghiChu)
      const bay = new Date().toISOString()
      setRows((c) => (c ?? []).map((x) => (x.id === o.id ? { ...x, trang_thai: t, updated_at: bay } : x)))
    } catch (e: any) { setLoiGhi(e?.message ?? String(e)) }
  }

  const the = (o: OrderRow) => {
    const laNhan = o.nguoi_nhan_id === meId
    const quaHan = !!o.han && o.han < hom && dangMo(o.trang_thai)
    const mở = mo === o.id
    return (
      <li key={o.id} className="border-b border-[var(--sk-line)] py-2 last:border-0">
        <button onClick={() => setMo(mở ? null : o.id)} className="flex w-full items-start gap-2.5 text-left">
          <span className={`mt-0.5 shrink-0 px-2 py-0.5 text-[11px] font-bold ${MAU_TT[o.trang_thai]}`} style={{ borderRadius: 999 }}>{TEN_TRANG_THAI[o.trang_thai]}</span>
          <span className="min-w-0 flex-1">
            <span className={`block text-[13.5px] font-semibold text-[var(--sk-ink)] ${mở ? '' : 'line-clamp-2'}`}>{o.noi_dung}</span>
            <span className="mt-0.5 block text-[12px] text-[var(--sk-muted)]">
              {laNhan ? `Từ ${o.dat?.ho_ten ?? '—'}` : `Cho ${o.nhan?.ho_ten ?? '—'}`} · {ddmm(o.created_at)}
              {o.han && <span className={quaHan ? 'font-bold text-rose-500' : ''}> · hạn {ddmm(o.han)}{quaHan ? ' (quá hạn)' : ''}</span>}
            </span>
          </span>
          <span className="shrink-0 text-[var(--sk-muted)]">{mở ? '▾' : '▸'}</span>
        </button>
        {mở && <ChiTiet o={o} laNguoiNhan={laNhan} onDoi={(t, g) => doi(o, t, g)} />}
      </li>
    )
  }

  const nutTab = (k: 'toi' | 'dat', ten: string, n: number) => (
    <button onClick={() => { setTab(k); setMo(null) }}
      className={`px-3 py-1 text-[12.5px] font-bold ${tab === k ? 'bg-[var(--sk-acc)] text-[var(--sk-acc-ink)]' : 'text-[var(--sk-muted)] hover:text-[var(--sk-ink)]'}`} style={{ borderRadius: 'var(--sk-radius-pill)' }}>
      {ten}{n > 0 && <span className="ml-1 opacity-80">({n})</span>}
    </button>
  )

  if (!meId) return null
  return (
    <div style={THE} className="p-3.5">
      <div className="mb-2.5 flex flex-wrap items-center gap-2">
        <h3 className="text-[15px] font-bold text-[var(--sk-ink)]" style={HEAD}>📋 Bảng Order</h3>
        <div className="inline-flex gap-0.5 border border-[var(--sk-line)] p-0.5" style={{ borderRadius: 'var(--sk-radius-pill)' }}>
          {nutTab('toi', '📥 Gửi tôi', soMoToi)}{nutTab('dat', '📤 Tôi đặt', soMoDat)}
        </div>
        <button onClick={() => setForm(!form)} className="ml-auto bg-[var(--sk-acc)] px-3 py-1 text-[12.5px] font-bold text-[var(--sk-acc-ink)]" style={{ borderRadius: 'var(--sk-radius-pill)' }}>＋ Đặt order</button>
      </div>
      {form && <FormDat meId={meId} onDong={() => setForm(false)} onXong={() => { setForm(false); setTab('dat'); nap() }} />}
      {loiGhi && <p className="mb-2 text-[12.5px] text-rose-500">{loiGhi}</p>}
      {rows === null ? <p className="text-[12.5px] text-[var(--sk-muted)]">Đang tải…</p>
        : loi ? <p className="text-[12.5px] text-[var(--sk-muted)]">Chưa tải được bảng order.</p>
        : dangMoDs.length === 0 ? <p className="text-[12.5px] text-[var(--sk-muted)]">{tab === 'toi' ? 'Chưa có ai nhờ bạn việc gì. ✓' : 'Bạn chưa có order nào đang chờ.'}</p>
        : <ul>{dangMoDs.map(the)}</ul>}
      {daDong.length > 0 && (
        <div className="mt-2">
          <button onClick={() => setHienDong(!hienDong)} className="text-[12px] font-semibold text-[var(--sk-muted)] hover:text-[var(--sk-ink)]">{hienDong ? '▾' : '▸'} Đã đóng ({daDong.length})</button>
          {hienDong && <ul className="mt-1 opacity-80">{daDong.map(the)}</ul>}
        </div>
      )}
    </div>
  )
}
