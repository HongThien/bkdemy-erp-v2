// TỦ QUÀ — màn app OPS (Thùy chốt 30/08): đổi quà tại tủ thanh toán bằng XU + đơn đặt quà theo yêu cầu
// + kho (catalog/nhập). Touch-first, tông HỒNG (rose) theo khuôn màu-per-tab của app OPS.
// Mọi số (số dư, tồn) từ DB (fn_tuqua_* / view) — client không tính (CLAUDE §2.0). Seam: lib/tuqua.ts.
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  listSoDuXu, getSoDuXu, listTonQua, listXuLedger, doiQua, giaoDoiQua, huyDoiQua,
  listDoiQuaCuaHS, listDoiQuaChoGiao, taoOrder, duyetOrder, tuChoiOrder, orderVe, orderGiao, huyOrder,
  listOrderDangSong, listOrderGanDay, themQua, suaQua, setQuaDangBan, uploadQuaAnh,
  taoNhap, xacNhanNhap, huyNhap, listNhapChoXacNhan,
  type SoDuXu, type TonQua, type DoiQua, type QuaOrder, type QuaNhap, type XuLedgerRow,
} from '../../lib/tuqua'
import SearchSelect, { type Opt } from '../../components/SearchSelect'
import { OA, OpsHero } from '../../components/ops/OpsUI'

type Muc = 'doi' | 'don' | 'kho'
const ddmm = (iso: string) => new Date(iso).toLocaleDateString('vi', { day: '2-digit', month: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' })
const inputCls = 'w-full rounded-xl border border-slate-300 px-3 py-2.5 text-[14px] outline-none focus:border-rose-400'
const Lbl = ({ children }: { children: React.ReactNode }) => <label className="mb-1 block text-[13px] font-medium text-slate-600">{children}</label>

const DQ_TT: Record<DoiQua['trang_thai'], [string, string]> = {
  cho_giao: ['chờ giao', 'bg-amber-100 text-amber-800'],
  da_giao: ['đã giao', 'bg-emerald-100 text-emerald-800'],
  huy: ['đã hủy', 'bg-slate-100 text-slate-500'],
}
const OD_TT: Record<QuaOrder['trang_thai'], [string, string]> = {
  cho_duyet: ['chờ duyệt', 'bg-amber-100 text-amber-800'],
  da_duyet: ['đã duyệt — chờ hàng', 'bg-sky-100 text-sky-800'],
  da_ve: ['quà đã về', 'bg-violet-100 text-violet-800'],
  da_giao: ['đã giao', 'bg-emerald-100 text-emerald-800'],
  tu_choi: ['từ chối', 'bg-rose-100 text-rose-700'],
  huy: ['đã hủy', 'bg-slate-100 text-slate-500'],
}

function AvaHS({ ten, img, size = 'h-9 w-9 text-[12px]' }: { ten: string; img: string | null | undefined; size?: string }) {
  if (img) return <img src={img} alt="" className={`${size} shrink-0 rounded-full object-cover ring-1 ring-slate-200`} />
  const ini = ten.trim().split(/\s+/).slice(-2).map((w) => w.charAt(0).toUpperCase()).join('')
  return <span className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-rose-100 font-bold text-rose-700`}>{ini}</span>
}
function AnhQua({ url, cls }: { url: string | null; cls: string }) {
  return url
    ? <img src={url} alt="" className={`${cls} rounded-xl object-cover`} />
    : <span className={`${cls} flex items-center justify-center rounded-xl bg-rose-50 text-[26px]`}>🎁</span>
}

export default function TuQuaScreen() {
  const [muc, setMuc] = useState<Muc>('doi')
  const [toast, setToast] = useState<string | null>(null)
  const bao = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2500) }

  return (
    // REDESIGN 07/09 (nhẹ tay — chỉ đổi header, KHÔNG đụng logic 3 tab bên dưới): tông cam đúng khuôn
      // "Quà" trong bộ 7 màn OPS mới (ops6.png), dù đây là tính năng KHÁC (tủ quà học sinh, không phải
      // shopping cá nhân nhân viên) — chỉ mượn màu cho đồng bộ giao diện.
    <div>
      <OpsHero tone="orange" title="Tủ quà · đổi bằng xu" character={OA('gift/header_gift_box.svg')} characterSize={64}>
        <div className="relative mx-auto mt-2.5 flex max-w-[760px] rounded-2xl bg-white/20 p-1">
          {([['doi', '🎁 Đổi quà'], ['don', '📦 Đơn đặt'], ['kho', '🗃️ Kho']] as [Muc, string][]).map(([k, lbl]) => (
            <button key={k} onClick={() => setMuc(k)}
              className={`min-h-[40px] flex-1 rounded-xl text-[13.5px] font-bold transition ${muc === k ? 'bg-white text-[#9A3E10]' : 'text-white/80 active:bg-white/10'}`}>
              {lbl}
            </button>
          ))}
        </div>
      </OpsHero>

      <div className="mx-auto max-w-[760px] px-3 pb-24 pt-3">
        {muc === 'doi' && <DoiTab bao={bao} />}
        {muc === 'don' && <DonTab bao={bao} />}
        {muc === 'kho' && <KhoTab bao={bao} />}
      </div>

      {toast && createPortal(
        <div className="fixed bottom-24 left-1/2 z-[90] -translate-x-1/2 rounded-full bg-slate-900/90 px-4 py-2.5 text-[13.5px] font-semibold text-white shadow-lg">{toast}</div>,
        document.body)}
    </div>
  )
}

// ── TAB ĐỔI QUÀ: chọn HS → thấy số dư → chạm quà → xác nhận trừ xu ──────────
function DoiTab({ bao }: { bao: (m: string) => void }) {
  const [hsList, setHsList] = useState<SoDuXu[]>([])
  const [tonList, setTonList] = useState<TonQua[]>([])
  const [hsId, setHsId] = useState<string | null>(null)
  const [soDu, setSoDu] = useState<number | null>(null)
  const [lichSu, setLichSu] = useState<DoiQua[]>([])
  const [soXu, setSoXu] = useState<XuLedgerRow[]>([])
  const [chonQua, setChonQua] = useState<TonQua | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  async function reload() {
    setLoading(true)
    try {
      const [h, t] = await Promise.all([listSoDuXu(), listTonQua()])
      setHsList(h); setTonList(t)
    } catch (e: any) { setErr(e.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [])

  async function reloadHS(id: string) {
    try {
      const [du, ls, sx] = await Promise.all([getSoDuXu(id), listDoiQuaCuaHS(id), listXuLedger(id)])
      setSoDu(du); setLichSu(ls); setSoXu(sx)
    } catch (e: any) { setErr(e.message ?? String(e)) }
  }
  useEffect(() => { setSoDu(null); setLichSu([]); setSoXu([]); if (hsId) reloadHS(hsId) }, [hsId]) // eslint-disable-line

  const hs = hsList.find((h) => h.hoc_sinh_id === hsId) ?? null
  const opts: Opt[] = hsList.map((h) => ({ id: h.hoc_sinh_id, label: h.ho_ten, sub: `${h.ma_hs ?? ''} · ${h.so_du} xu${h.khoi ? ` · K${h.khoi}` : ''}`, img: h.anh_url }))
  const catalog = tonList.filter((q) => q.dang_ban)

  async function huy(d: DoiQua) {
    const lyDo = prompt(`Hủy lượt đổi "${d.qlht_qua?.ten}" (hoàn ${d.xu_tru} xu)?\nNhập lý do:`)
    if (lyDo == null || !lyDo.trim()) return
    try { const du = await huyDoiQua(d.id, lyDo.trim()); setSoDu(du); await reloadHS(d.hoc_sinh_id); reload(); bao(`✓ Đã hủy, hoàn ${d.xu_tru} xu`) }
    catch (e: any) { alert(e.message ?? String(e)) }
  }
  async function giao(d: DoiQua) {
    try { await giaoDoiQua(d.id); await reloadHS(d.hoc_sinh_id); bao('✓ Đã giao quà') }
    catch (e: any) { alert(e.message ?? String(e)) }
  }

  if (loading) return <p className="py-10 text-center text-sm text-slate-400">Đang tải…</p>
  return (
    <div className="flex flex-col gap-3">
      {err && <p className="rounded-xl bg-rose-50 px-3 py-2 text-[13px] text-rose-700">{err}</p>}
      <SearchSelect value={hsId} onChange={setHsId} options={opts} placeholder="🔎 Tìm học sinh (tên / mã)…" avatars />

      {hs && (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-sm">
          <AvaHS ten={hs.ho_ten} img={hs.anh_url} size="h-12 w-12 text-[15px]" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15.5px] font-bold text-slate-800">{hs.ho_ten}</p>
            <p className="text-[12.5px] text-slate-400">{hs.ma_hs ?? ''}{hs.khoi ? ` · Khối ${hs.khoi}` : ''}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Số dư</p>
            <p className="text-[21px] font-bold leading-6 text-rose-600">{soDu ?? hs.so_du} <span className="text-[13px] font-semibold">xu</span></p>
          </div>
        </div>
      )}

      {hsId && (
        catalog.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 py-12 text-center text-sm text-slate-400">Tủ chưa có quà đang bán — thêm ở mục Kho.</div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {catalog.map((q) => {
              const het = q.ton <= 0
              const duXu = (soDu ?? hs?.so_du ?? 0) >= q.gia_xu
              return (
                <button key={q.qua_id} disabled={het} onClick={() => setChonQua(q)}
                  className={`rounded-2xl border border-slate-200/70 bg-white p-2.5 text-left shadow-sm active:bg-rose-50 ${het ? 'opacity-45' : ''}`}>
                  <AnhQua url={q.anh_url} cls="aspect-square w-full" />
                  <p className="mt-1.5 line-clamp-2 min-h-[34px] text-[13px] font-semibold leading-[17px] text-slate-800">{q.ten}</p>
                  <div className="mt-1 flex items-center">
                    <span className={`rounded-full px-2 py-0.5 text-[12px] font-bold ${duXu && !het ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>{q.gia_xu} xu</span>
                    <span className="ml-auto text-[11.5px] text-slate-400">{het ? 'hết hàng' : `còn ${q.ton}`}</span>
                  </div>
                </button>
              )
            })}
          </div>
        )
      )}
      {!hsId && <p className="py-8 text-center text-[13px] text-slate-400">Chọn học sinh để bắt đầu đổi quà 🎁</p>}

      {hsId && lichSu.length > 0 && (
        <section>
          <p className="mb-1.5 pl-1 text-[12px] font-bold uppercase tracking-wide text-slate-400">Lượt đổi gần đây</p>
          <div className="flex flex-col gap-1.5">
            {lichSu.map((d) => {
              const [lbl, cls] = DQ_TT[d.trang_thai]
              return (
                <div key={d.id} className="flex items-center gap-2 rounded-xl border border-slate-200/70 bg-white px-3 py-2 shadow-sm">
                  <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-slate-700">{d.qlht_qua?.ten ?? '?'}{d.so_luong > 1 ? ` ×${d.so_luong}` : ''}
                    <span className="ml-1.5 font-normal text-slate-400">−{d.xu_tru} xu · {ddmm(d.created_at)}</span></span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${cls}`}>{lbl}</span>
                  {d.trang_thai === 'cho_giao' && <button onClick={() => giao(d)} className="min-h-[36px] shrink-0 rounded-lg bg-emerald-600 px-2.5 text-[12px] font-bold text-white active:bg-emerald-500">Giao</button>}
                  {d.trang_thai !== 'huy' && <button onClick={() => huy(d)} className="min-h-[36px] shrink-0 rounded-lg px-2 text-[12px] text-slate-400 active:bg-rose-50 active:text-rose-600">Hủy</button>}
                </div>
              )
            })}
          </div>
        </section>
      )}
      {hsId && soXu.length > 0 && (
        <details className="text-[12px] text-slate-400">
          <summary className="cursor-pointer select-none pl-1 font-semibold">Sổ xu gần đây ({soXu.length})</summary>
          <div className="mt-1.5 flex flex-col gap-1">
            {soXu.map((r) => (
              <div key={r.id} className="flex items-center gap-2 rounded-lg bg-white px-2.5 py-1.5">
                <span className="min-w-0 flex-1 truncate">{r.ly_do ?? r.loai} · {ddmm(r.created_at)}</span>
                <span className={`shrink-0 font-bold ${r.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{r.amount >= 0 ? '+' : ''}{r.amount}</span>
              </div>
            ))}
          </div>
        </details>
      )}

      {chonQua && hs && (
        <DoiModal hs={hs} soDu={soDu ?? hs.so_du} qua={chonQua} onClose={() => setChonQua(null)}
          onDone={async (duMoi, giaoNgay) => {
            setChonQua(null); setSoDu(duMoi)
            await reloadHS(hs.hoc_sinh_id); reload()
            bao(giaoNgay ? `✓ Đã đổi & giao — số dư mới ${duMoi} xu` : `✓ Đã đổi (chờ giao) — số dư mới ${duMoi} xu`)
          }} />
      )}
    </div>
  )
}

// Modal xác nhận đổi: stepper số lượng, tổng xu; server là người phán cuối (fn check tồn + số dư).
function DoiModal({ hs, soDu, qua, onClose, onDone }: {
  hs: SoDuXu; soDu: number; qua: TonQua; onClose: () => void; onDone: (soDuMoi: number, giaoNgay: boolean) => void
}) {
  const [sl, setSl] = useState(1)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const tong = qua.gia_xu * sl // hiển thị preview; số thật do fn trả về

  async function doi(giaoNgay: boolean) {
    setBusy(true); setErr(null)
    try { const r = await doiQua(hs.hoc_sinh_id, qua.qua_id, sl, giaoNgay); onDone(r.soDuMoi, giaoNgay) }
    catch (e: any) { setErr(e.message ?? String(e)); setBusy(false) }
  }
  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-900/40 p-3 sm:items-center" onClick={onClose}>
      <div className="w-full max-w-[440px] rounded-3xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3">
          <AnhQua url={qua.anh_url} cls="h-16 w-16" />
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold text-slate-800">{qua.ten}</p>
            <p className="text-[12.5px] text-slate-400">{qua.gia_xu} xu · còn {qua.ton}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
          <span className="text-[13.5px] font-semibold text-slate-600">Số lượng</span>
          <div className="flex items-center gap-3">
            <button onClick={() => setSl((s) => Math.max(1, s - 1))} className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[19px] font-bold text-slate-600 shadow-sm active:bg-slate-100">−</button>
            <span className="w-8 text-center text-[17px] font-bold text-slate-800">{sl}</span>
            <button onClick={() => setSl((s) => Math.min(qua.ton, s + 1))} className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[19px] font-bold text-slate-600 shadow-sm active:bg-slate-100">+</button>
          </div>
        </div>
        <div className="mt-2.5 flex items-center justify-between px-1 text-[13.5px]">
          <span className="text-slate-500">Trừ xu của <b>{hs.ho_ten}</b></span>
          <span className="font-bold text-rose-600">−{tong} xu</span>
        </div>
        <div className="flex items-center justify-between px-1 text-[12.5px] text-slate-400">
          <span>Số dư hiện tại {soDu} xu</span><span>{soDu < tong ? '⚠ không đủ xu' : ''}</span>
        </div>
        {err && <p className="mt-2 rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{err}</p>}
        <button onClick={() => doi(true)} disabled={busy || soDu < tong}
          className="mt-3 min-h-[50px] w-full rounded-2xl bg-rose-600 text-[15px] font-bold text-white shadow-sm active:bg-rose-500 disabled:opacity-40">
          {busy ? 'Đang đổi…' : '🎁 Đổi & giao ngay'}
        </button>
        <div className="mt-2 flex items-center justify-between">
          <button onClick={onClose} className="min-h-[44px] rounded-xl px-3 text-[13px] text-slate-500 active:bg-slate-100">Đóng</button>
          <button onClick={() => doi(false)} disabled={busy || soDu < tong} className="min-h-[44px] rounded-xl px-3 text-[13px] font-semibold text-amber-700 active:bg-amber-50 disabled:opacity-40">Đổi trước — giao sau</button>
        </div>
      </div>
    </div>, document.body)
}

// ── TAB ĐƠN ĐẶT: tạo → duyệt (chốt giá, trừ xu) → quà về → HS ra tủ nhận ────
function DonTab({ bao }: { bao: (m: string) => void }) {
  const [dangSong, setDangSong] = useState<QuaOrder[]>([])
  const [ganDay, setGanDay] = useState<QuaOrder[]>([])
  const [choGiao, setChoGiao] = useState<DoiQua[]>([])
  const [form, setForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  async function reload() {
    setLoading(true)
    try {
      const [s, g, c] = await Promise.all([listOrderDangSong(), listOrderGanDay(), listDoiQuaChoGiao()])
      setDangSong(s); setGanDay(g); setChoGiao(c)
    } catch (e: any) { setErr(e.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [])

  const lam = (fn: () => Promise<any>, ok: string) => async () => {
    try { await fn(); await reload(); bao(ok) } catch (e: any) { alert(e.message ?? String(e)) }
  }
  function duyet(o: QuaOrder) {
    const s = prompt(`Duyệt đơn "${o.mo_ta}" của ${o.hoc_sinh?.ho_ten}.\nNhập GIÁ XU (trừ ngay khi duyệt):`)
    if (s == null) return
    const gia = Number(s)
    if (!Number.isInteger(gia) || gia <= 0) { alert('Giá xu phải là số nguyên dương'); return }
    lam(() => duyetOrder(o.id, gia), `✓ Đã duyệt, trừ ${gia} xu`)()
  }
  function tuChoi(o: QuaOrder) {
    const lyDo = prompt('Từ chối đơn — nhập lý do:')
    if (lyDo == null || !lyDo.trim()) return
    lam(() => tuChoiOrder(o.id, lyDo.trim()), '✓ Đã từ chối')()
  }
  function huy(o: QuaOrder) {
    const hoan = o.trang_thai !== 'cho_duyet' && o.gia_xu ? ` (hoàn ${o.gia_xu} xu)` : ''
    const lyDo = prompt(`Hủy đơn${hoan}? Nhập lý do:`)
    if (lyDo == null || !lyDo.trim()) return
    lam(() => huyOrder(o.id, lyDo.trim()), `✓ Đã hủy${hoan}`)()
  }

  const nhom = {
    choDuyet: dangSong.filter((o) => o.trang_thai === 'cho_duyet'),
    daDuyet: dangSong.filter((o) => o.trang_thai === 'da_duyet'),
    daVe: dangSong.filter((o) => o.trang_thai === 'da_ve'),
  }

  if (loading) return <p className="py-10 text-center text-sm text-slate-400">Đang tải…</p>
  return (
    <div className="flex flex-col gap-4">
      {err && <p className="rounded-xl bg-rose-50 px-3 py-2 text-[13px] text-rose-700">{err}</p>}
      <button onClick={() => setForm(true)} className="min-h-[48px] rounded-2xl bg-rose-600 text-[14.5px] font-bold text-white shadow-sm active:bg-rose-500">+ Đặt quà cho học sinh</button>

      {choGiao.length > 0 && (
        <Section title={`Đổi tại tủ — chờ giao · ${choGiao.length}`}>
          {choGiao.map((d) => (
            <CardDon key={d.id} ten={d.hoc_sinh?.ho_ten ?? '?'} anh={d.hoc_sinh?.anh_url} sub={`${d.qlht_qua?.ten ?? '?'}${d.so_luong > 1 ? ` ×${d.so_luong}` : ''} · −${d.xu_tru} xu · ${ddmm(d.created_at)}`}
              badge={DQ_TT.cho_giao}>
              <NutXanh onClick={lam(() => giaoDoiQua(d.id), '✓ Đã giao quà')}>Giao</NutXanh>
              <NutXam onClick={() => { const l = prompt(`Hủy (hoàn ${d.xu_tru} xu)? Lý do:`); if (l?.trim()) lam(() => huyDoiQua(d.id, l.trim()), '✓ Đã hủy & hoàn xu')() }}>Hủy</NutXam>
            </CardDon>
          ))}
        </Section>
      )}

      <Section title={`Chờ duyệt · ${nhom.choDuyet.length}`} empty={nhom.choDuyet.length === 0 ? 'Không có đơn chờ duyệt' : undefined}>
        {nhom.choDuyet.map((o) => (
          <CardDon key={o.id} ten={o.hoc_sinh?.ho_ten ?? '?'} anh={o.hoc_sinh?.anh_url} sub={`${o.mo_ta} · ${ddmm(o.created_at)}`} link={o.link_tham_khao} badge={OD_TT.cho_duyet}>
            <NutXanh onClick={() => duyet(o)}>Duyệt</NutXanh>
            <NutXam onClick={() => tuChoi(o)}>Từ chối</NutXam>
          </CardDon>
        ))}
      </Section>

      {nhom.daDuyet.length > 0 && (
        <Section title={`Đã duyệt — đang chờ hàng · ${nhom.daDuyet.length}`}>
          {nhom.daDuyet.map((o) => (
            <CardDon key={o.id} ten={o.hoc_sinh?.ho_ten ?? '?'} anh={o.hoc_sinh?.anh_url} sub={`${o.mo_ta} · −${o.gia_xu} xu`} link={o.link_tham_khao} badge={OD_TT.da_duyet}>
              <NutXanh onClick={lam(() => orderVe(o.id), '✓ Đã đánh dấu quà về')}>Quà đã về</NutXanh>
              <NutXam onClick={() => huy(o)}>Hủy</NutXam>
            </CardDon>
          ))}
        </Section>
      )}

      {nhom.daVe.length > 0 && (
        <Section title={`Quà đã về — HS ra tủ nhận · ${nhom.daVe.length}`}>
          {nhom.daVe.map((o) => (
            <CardDon key={o.id} ten={o.hoc_sinh?.ho_ten ?? '?'} anh={o.hoc_sinh?.anh_url} sub={`${o.mo_ta} · −${o.gia_xu} xu · về ${o.ve_luc ? ddmm(o.ve_luc) : ''}`} badge={OD_TT.da_ve}>
            <NutXanh onClick={lam(() => orderGiao(o.id), '✓ Đã giao quà')}>Giao</NutXanh>
              <NutXam onClick={() => huy(o)}>Hủy</NutXam>
            </CardDon>
          ))}
        </Section>
      )}

      {ganDay.length > 0 && (
        <details className="text-[12.5px]">
          <summary className="cursor-pointer select-none pl-1 font-bold uppercase tracking-wide text-slate-400">Đơn gần đây ({ganDay.length})</summary>
          <div className="mt-2 flex flex-col gap-1.5">
            {ganDay.map((o) => {
              const [lbl, cls] = OD_TT[o.trang_thai]
              return (
                <div key={o.id} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-slate-500 shadow-sm">
                  <span className="min-w-0 flex-1 truncate"><b className="text-slate-700">{o.hoc_sinh?.ho_ten}</b> · {o.mo_ta}{o.ly_do_huy ? ` — ${o.ly_do_huy}` : ''}</span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${cls}`}>{lbl}</span>
                </div>
              )
            })}
          </div>
        </details>
      )}

      {form && <OrderModal onClose={() => setForm(false)} onDone={async () => { setForm(false); await reload(); bao('✓ Đã tạo đơn đặt quà') }} />}
    </div>
  )
}

function Section({ title, empty, children }: { title: string; empty?: string; children?: React.ReactNode }) {
  return (
    <section>
      <p className="mb-1.5 pl-1 text-[12px] font-bold uppercase tracking-wide text-slate-400">{title}</p>
      {empty ? <p className="rounded-xl border border-dashed border-slate-300 py-5 text-center text-[12.5px] text-slate-400">{empty}</p>
        : <div className="flex flex-col gap-1.5">{children}</div>}
    </section>
  )
}
function CardDon({ ten, anh, sub, link, badge: [lbl, cls], children }: {
  ten: string; anh: string | null | undefined; sub: string; link?: string | null; badge: [string, string]; children?: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-2.5">
        <AvaHS ten={ten} img={anh} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold text-slate-800">{ten}</p>
          <p className="truncate text-[12.5px] text-slate-500">{sub}{link && <> · <a href={link} target="_blank" rel="noreferrer" className="text-rose-500 underline">link</a></>}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${cls}`}>{lbl}</span>
      </div>
      {children && <div className="mt-2 flex justify-end gap-2">{children}</div>}
    </div>
  )
}
const NutXanh = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) =>
  <button onClick={onClick} className="min-h-[40px] rounded-xl bg-emerald-600 px-3.5 text-[13px] font-bold text-white active:bg-emerald-500">{children}</button>
const NutXam = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) =>
  <button onClick={onClick} className="min-h-[40px] rounded-xl px-3 text-[13px] text-slate-500 active:bg-slate-100">{children}</button>

function OrderModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [hsList, setHsList] = useState<SoDuXu[]>([])
  const [hsId, setHsId] = useState<string | null>(null)
  const [moTa, setMoTa] = useState('')
  const [link, setLink] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => { listSoDuXu().then(setHsList).catch(() => {}) }, [])
  const opts: Opt[] = hsList.map((h) => ({ id: h.hoc_sinh_id, label: h.ho_ten, sub: `${h.ma_hs ?? ''} · ${h.so_du} xu`, img: h.anh_url }))

  async function save() {
    if (!hsId) { setErr('Chọn học sinh'); return }
    if (!moTa.trim()) { setErr('Nhập mô tả quà'); return }
    setBusy(true); setErr(null)
    try { await taoOrder(hsId, moTa.trim(), link.trim() || null); onDone() }
    catch (e: any) { setErr(e.message ?? String(e)); setBusy(false) }
  }
  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-[480px] overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <p className="mb-3 text-[16px] font-bold text-slate-800">📦 Đặt quà theo yêu cầu</p>
        <div className="space-y-3">
          <div><Lbl>Học sinh *</Lbl><SearchSelect value={hsId} onChange={setHsId} options={opts} placeholder="🔎 Tìm học sinh…" avatars /></div>
          <div><Lbl>Quà muốn đặt *</Lbl><textarea className={inputCls} rows={2} value={moTa} onChange={(e) => setMoTa(e.target.value)} placeholder="VD: Bộ LEGO City 60292…" /></div>
          <div><Lbl>Link tham khảo</Lbl><input className={inputCls} value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://…" /></div>
          <p className="text-[11.5px] text-slate-400">Xu CHƯA bị trừ khi tạo đơn — chỉ trừ lúc leader duyệt & chốt giá.</p>
          {err && <p className="text-[12.5px] text-rose-600">{err}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={onClose} className="min-h-[44px] rounded-xl border border-slate-200 px-4 text-[14px] text-slate-600 active:bg-slate-50">Huỷ</button>
            <button onClick={save} disabled={busy} className="min-h-[44px] rounded-xl bg-rose-600 px-4 text-[14px] font-bold text-white active:bg-rose-500 disabled:opacity-50">{busy ? 'Đang tạo…' : 'Tạo đơn'}</button>
          </div>
        </div>
      </div>
    </div>, document.body)
}

// ── TAB KHO: catalog + tồn + phiếu nhập ─────────────────────────────────────
function KhoTab({ bao }: { bao: (m: string) => void }) {
  const [tonList, setTonList] = useState<TonQua[]>([])
  const [phieuCho, setPhieuCho] = useState<QuaNhap[]>([])
  const [formQua, setFormQua] = useState<TonQua | 'moi' | null>(null)
  const [formNhap, setFormNhap] = useState<TonQua | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  async function reload() {
    setLoading(true)
    try { const [t, p] = await Promise.all([listTonQua(), listNhapChoXacNhan()]); setTonList(t); setPhieuCho(p) }
    catch (e: any) { setErr(e.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [])

  async function toggleBan(q: TonQua) {
    try { await setQuaDangBan(q.qua_id, !q.dang_ban); await reload(); bao(q.dang_ban ? 'Đã ngừng bán' : '✓ Đã mở bán lại') }
    catch (e: any) { alert(e.message ?? String(e)) }
  }
  async function xacNhan(p: QuaNhap) {
    const s = prompt(`Xác nhận vào kho "${p.qlht_qua?.ten}" (phiếu ${p.so_luong}).\nSố lượng THỰC nhận (để trống = đúng ${p.so_luong}):`)
    if (s == null) return
    const thuc = s.trim() === '' ? null : Number(s)
    if (thuc !== null && (!Number.isInteger(thuc) || thuc <= 0)) { alert('Số lượng thực phải là số nguyên dương'); return }
    try { const ton = await xacNhanNhap(p.id, thuc); await reload(); bao(`✓ Đã vào kho — tồn mới ${ton}`) }
    catch (e: any) { alert(e.message ?? String(e)) }
  }
  async function huyPhieu(p: QuaNhap) {
    const lyDo = prompt('Hủy phiếu nhập? Lý do (không bắt buộc):')
    if (lyDo == null) return
    try { await huyNhap(p.id, lyDo.trim() || null); await reload(); bao('✓ Đã hủy phiếu') }
    catch (e: any) { alert(e.message ?? String(e)) }
  }

  if (loading) return <p className="py-10 text-center text-sm text-slate-400">Đang tải…</p>
  return (
    <div className="flex flex-col gap-4">
      {err && <p className="rounded-xl bg-rose-50 px-3 py-2 text-[13px] text-rose-700">{err}</p>}
      <button onClick={() => setFormQua('moi')} className="min-h-[48px] rounded-2xl bg-rose-600 text-[14.5px] font-bold text-white shadow-sm active:bg-rose-500">+ Quà mới vào tủ</button>

      {phieuCho.length > 0 && (
        <Section title={`Phiếu nhập chờ vào kho · ${phieuCho.length}`}>
          {phieuCho.map((p) => (
            <div key={p.id} className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50/60 px-3 py-2.5">
              <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-slate-700">{p.qlht_qua?.ten ?? '?'} <span className="font-bold text-amber-700">+{p.so_luong}</span>
                {p.ghi_chu && <span className="font-normal text-slate-400"> · {p.ghi_chu}</span>}</span>
              <NutXanh onClick={() => xacNhan(p)}>✓ Vào kho</NutXanh>
              <NutXam onClick={() => huyPhieu(p)}>Hủy</NutXam>
            </div>
          ))}
        </Section>
      )}

      <Section title={`Quà trong tủ · ${tonList.length}`} empty={tonList.length === 0 ? 'Tủ chưa có quà nào' : undefined}>
        {tonList.map((q) => (
          <div key={q.qua_id} className={`flex items-center gap-2.5 rounded-2xl border border-slate-200/70 bg-white p-2.5 shadow-sm ${q.dang_ban ? '' : 'opacity-55'}`}>
            <AnhQua url={q.anh_url} cls="h-12 w-12" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-bold text-slate-800">{q.ten}</p>
              <p className="text-[12px] text-slate-400">{q.gia_xu} xu · tồn <b className={q.ton <= 0 ? 'text-rose-600' : 'text-slate-600'}>{q.ton}</b>{q.dang_ban ? '' : ' · ngừng bán'}</p>
            </div>
            <button onClick={() => setFormNhap(q)} className="min-h-[40px] shrink-0 rounded-xl bg-slate-100 px-2.5 text-[12.5px] font-bold text-slate-600 active:bg-slate-200">Nhập</button>
            <button onClick={() => setFormQua(q)} className="min-h-[40px] shrink-0 rounded-xl px-2 text-[13px] text-slate-400 active:bg-slate-100">✎</button>
            <button onClick={() => toggleBan(q)} className={`min-h-[40px] shrink-0 rounded-xl px-2.5 text-[12px] font-bold ${q.dang_ban ? 'text-emerald-600 active:bg-emerald-50' : 'text-slate-400 active:bg-slate-100'}`}>{q.dang_ban ? 'Bán' : 'Tắt'}</button>
          </div>
        ))}
      </Section>

      {formQua && <QuaModal qua={formQua === 'moi' ? null : formQua} onClose={() => setFormQua(null)}
        onDone={async (m) => { setFormQua(null); await reload(); bao(m) }} />}
      {formNhap && <NhapModal qua={formNhap} onClose={() => setFormNhap(null)}
        onDone={async (m) => { setFormNhap(null); await reload(); bao(m) }} />}
    </div>
  )
}

function QuaModal({ qua, onClose, onDone }: { qua: TonQua | null; onClose: () => void; onDone: (msg: string) => void }) {
  const [ten, setTen] = useState(qua?.ten ?? '')
  const [gia, setGia] = useState(qua ? String(qua.gia_xu) : '')
  const [moTa, setMoTa] = useState(qua?.mo_ta ?? '')
  const [anhUrl, setAnhUrl] = useState<string | null>(qua?.anh_url ?? null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function chonAnh(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return
    setBusy(true); setErr(null)
    try { setAnhUrl(await uploadQuaAnh(f)) } catch (ex: any) { setErr(ex.message ?? String(ex)) } finally { setBusy(false) }
  }
  async function save() {
    const giaN = Number(gia)
    if (!ten.trim()) { setErr('Nhập tên quà'); return }
    if (!Number.isInteger(giaN) || giaN <= 0) { setErr('Giá xu phải là số nguyên dương'); return }
    setBusy(true); setErr(null)
    try {
      if (qua) { await suaQua(qua.qua_id, ten.trim(), giaN, anhUrl, moTa.trim() || null); onDone('✓ Đã sửa quà') }
      else { await themQua(ten.trim(), giaN, anhUrl, moTa.trim() || null); onDone('✓ Đã thêm quà vào tủ') }
    } catch (e: any) { setErr(e.message ?? String(e)); setBusy(false) }
  }
  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-[440px] overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <p className="mb-3 text-[16px] font-bold text-slate-800">{qua ? '✎ Sửa quà' : '🎁 Quà mới'}</p>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <AnhQua url={anhUrl} cls="h-16 w-16" />
            <label className="min-h-[40px] cursor-pointer rounded-xl border border-slate-200 px-3 py-2 text-[12.5px] font-semibold text-slate-600 active:bg-slate-50">
              {anhUrl ? 'Đổi ảnh' : '📷 Thêm ảnh'}
              <input type="file" accept="image/*" className="hidden" onChange={chonAnh} disabled={busy} />
            </label>
          </div>
          <div><Lbl>Tên quà *</Lbl><input className={inputCls} value={ten} onChange={(e) => setTen(e.target.value)} autoFocus={!qua} /></div>
          <div><Lbl>Giá (xu) *</Lbl><input className={inputCls} inputMode="numeric" value={gia} onChange={(e) => setGia(e.target.value)} /></div>
          <div><Lbl>Mô tả</Lbl><input className={inputCls} value={moTa} onChange={(e) => setMoTa(e.target.value)} /></div>
          {err && <p className="text-[12.5px] text-rose-600">{err}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={onClose} className="min-h-[44px] rounded-xl border border-slate-200 px-4 text-[14px] text-slate-600 active:bg-slate-50">Huỷ</button>
            <button onClick={save} disabled={busy} className="min-h-[44px] rounded-xl bg-rose-600 px-4 text-[14px] font-bold text-white active:bg-rose-500 disabled:opacity-50">{busy ? 'Đang lưu…' : 'Lưu'}</button>
          </div>
        </div>
      </div>
    </div>, document.body)
}

// Nhập thêm (phiếu chờ xác nhận) hoặc xuất bớt/hao hụt (trừ tồn ngay, bắt buộc ghi chú).
function NhapModal({ qua, onClose, onDone }: { qua: TonQua; onClose: () => void; onDone: (msg: string) => void }) {
  const [huong, setHuong] = useState<'nhap' | 'xuat'>('nhap')
  const [sl, setSl] = useState('')
  const [ghiChu, setGhiChu] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function save() {
    const n = Number(sl)
    if (!Number.isInteger(n) || n <= 0) { setErr('Số lượng phải là số nguyên dương'); return }
    if (huong === 'xuat' && !ghiChu.trim()) { setErr('Xuất/giảm tồn phải có ghi chú lý do'); return }
    setBusy(true); setErr(null)
    try {
      const r = await taoNhap(qua.qua_id, huong === 'nhap' ? n : -n, ghiChu.trim() || null)
      onDone(r.trangThaiMoi === 'cho_vao_kho' ? '✓ Đã tạo phiếu — xác nhận khi hàng về kệ' : '✓ Đã trừ tồn')
    } catch (e: any) { setErr(e.message ?? String(e)); setBusy(false) }
  }
  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="w-full max-w-[420px] rounded-3xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <p className="mb-1 text-[16px] font-bold text-slate-800">🗃️ {qua.ten}</p>
        <p className="mb-3 text-[12.5px] text-slate-400">Tồn hiện tại: {qua.ton}</p>
        <div className="mb-3 flex rounded-xl bg-slate-100 p-1">
          {([['nhap', 'Nhập thêm'], ['xuat', 'Xuất / hao hụt']] as const).map(([k, lbl]) => (
            <button key={k} onClick={() => setHuong(k)}
              className={`min-h-[40px] flex-1 rounded-lg text-[13px] font-bold ${huong === k ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>{lbl}</button>
          ))}
        </div>
        <div className="space-y-3">
          <div><Lbl>Số lượng *</Lbl><input className={inputCls} inputMode="numeric" value={sl} onChange={(e) => setSl(e.target.value)} autoFocus /></div>
          <div><Lbl>Ghi chú{huong === 'xuat' ? ' (lý do — bắt buộc)' : ''}</Lbl><input className={inputCls} value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} placeholder={huong === 'xuat' ? 'VD: hỏng vỡ / kiểm kê thiếu…' : 'VD: đợt mua 30/08…'} /></div>
          {huong === 'nhap' && <p className="text-[11.5px] text-slate-400">Nhập thêm tạo PHIẾU CHỜ — tồn chỉ cộng khi bấm “✓ Vào kho” lúc hàng về kệ (đếm số thực).</p>}
          {err && <p className="text-[12.5px] text-rose-600">{err}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={onClose} className="min-h-[44px] rounded-xl border border-slate-200 px-4 text-[14px] text-slate-600 active:bg-slate-50">Huỷ</button>
            <button onClick={save} disabled={busy} className="min-h-[44px] rounded-xl bg-rose-600 px-4 text-[14px] font-bold text-white active:bg-rose-500 disabled:opacity-50">{busy ? 'Đang lưu…' : huong === 'nhap' ? 'Tạo phiếu nhập' : 'Trừ tồn'}</button>
          </div>
        </div>
      </div>
    </div>, document.body)
}
