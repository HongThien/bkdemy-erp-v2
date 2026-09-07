// OpsBoxes — CHỈ RENDER các mảnh "Của tôi" app OPS (header tháng + chip ⭐ + ô %, lưới box, màn con
// Gậy / Hướng dẫn / Đạt chuẩn / Shopping) theo style cũ (CuaToiBoxes Đợt 1, 07/09). Không fetch tính
// toán — mọi số đã đến từ Postgres qua seam lib. File này sẽ được THAY bằng bộ components/bk (design
// CEO duyệt) khi bên TA chốt; DashOps.tsx (dữ liệu + điều hướng) giữ nguyên khi đổi hình.
import { useEffect, useState, type ReactNode } from 'react'
import { gayCuaToi, type GayCuaToi } from '../../lib/gaycuatoi'
import { listQuyTrinh, type QuyTrinh } from '../../lib/quytrinh'
import { listVatPham, listDonCuaToi, doiVatPham, type ShopVatPham, type ShopDon } from '../../lib/shop'
import { ddmmVN } from '../../lib/tuan'
import { ViecThangAccordion, type ViecItem } from '../../components/CuaToiWidgets'

export type BoxKey = 'xephang' | 'gay' | 'maymai' | 'tientrinh' | 'shop' | 'huongdan' | 'datchuan'

export function ymCong(ym: string, n: number): string {
  const [y, m] = ym.split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1 + n, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

// ── HEADER: tháng + điểm tích lũy + % ─────────────────────────────────────────
export function CuaToiHeader({ ym, ymNay, onYm, mau, pct, diemTichLuy, chuoi, onPct, onBack }: {
  ym: string; ymNay: string; onYm: (ym: string) => void; mau: string
  pct: number | null | undefined; diemTichLuy: number | null; chuoi?: number | null; onPct: () => void; onBack: (() => void) | null
}) {
  const [thang, nam] = [ym.slice(5, 7), ym.slice(0, 4)]
  return (
    <div className={`${mau} px-4 pb-3`} style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}>
      <div className="mx-auto flex max-w-[1000px] items-center gap-2">
        {onBack
          ? <button onClick={onBack} className="rounded-lg px-2 py-1 text-[17px] font-bold text-white/90 active:bg-white/10">‹</button>
          : null}
        <p className="text-[15px] font-bold text-white">📈 Của tôi</p>
        <div className="ml-auto flex items-center gap-1">
          <button onClick={() => onYm(ymCong(ym, -1))} className="rounded-lg px-2.5 py-1 text-[15px] font-bold text-white/80 active:bg-white/10">‹</button>
          <span className="text-[13px] font-semibold text-white">Tháng {thang}/{nam}</span>
          <button onClick={() => onYm(ymCong(ym, 1))} disabled={ym >= ymNay} className="rounded-lg px-2.5 py-1 text-[15px] font-bold text-white/80 active:bg-white/10 disabled:opacity-30">›</button>
        </div>
      </div>
      <div className="mx-auto mt-2 flex max-w-[1000px] gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/15 px-3 py-2">
          <span className="text-[18px]">⭐</span>
          <div className="leading-tight">
            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-white/70">Điểm tích lũy</p>
            <p className="text-[17px] font-extrabold text-white">{diemTichLuy == null ? '—' : diemTichLuy.toLocaleString('vi-VN')}</p>
            {chuoi != null && chuoi > 0 && <p className="text-[10px] font-semibold text-amber-200">🔥 chuỗi {chuoi} ngày</p>}
          </div>
        </div>
        <button onClick={onPct} className="flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2 text-left active:bg-white/25">
          <div className="leading-tight">
            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-white/70">Đạt chuẩn</p>
            <p className="text-[17px] font-extrabold text-white">{pct == null ? '—' : `${pct}%`}</p>
          </div>
          <span className="text-white/60">›</span>
        </button>
      </div>
    </div>
  )
}

// ── LƯỚI 6 BOX ────────────────────────────────────────────────────────────────
export type BoxDef = { key: BoxKey; icon: string; label: string; sub?: string; bg: string; sapMo?: boolean; badge?: number }
export function CuaToiGrid({ boxes, onOpen }: { boxes: BoxDef[]; onOpen: (k: BoxKey) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {boxes.map((b) => (
        <button key={b.key} onClick={() => !b.sapMo && onOpen(b.key)}
          className={`relative rounded-2xl border border-slate-200/70 bg-white p-3.5 text-left shadow-sm ${b.sapMo ? 'opacity-60' : 'active:bg-slate-50'}`}>
          <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-[20px] ${b.bg}`}>{b.icon}</span>
          <p className="mt-2 text-[14px] font-bold text-slate-800">{b.label}</p>
          {b.sub && <p className="text-[11.5px] text-slate-400">{b.sub}</p>}
          {b.sapMo && <span className="absolute right-3 top-3 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">sắp mở</span>}
          {!!b.badge && <span className="absolute right-3 top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white">{b.badge}</span>}
        </button>
      ))}
    </div>
  )
}

export function BoxTitle({ children }: { children: ReactNode }) {
  return <p className="mb-2 px-1 text-[12px] font-bold uppercase tracking-wide text-slate-400">{children}</p>
}
const Trong = ({ children }: { children: ReactNode }) => <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-3 py-4 text-center text-[12.5px] text-slate-400">{children}</p>

// ── MÀN CON: GẬY ─────────────────────────────────────────────────────────────
const vnd = (n: number) => `${n.toLocaleString('vi-VN')}đ`
export function GayBox({ ym, donGia }: { ym: string; donGia: number }) {
  const [data, setData] = useState<GayCuaToi | null>(null)
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => { setData(null); setErr(null); gayCuaToi(`${ym}-01`).then(setData).catch((e) => setErr(e?.message ?? String(e))) }, [ym])
  if (err) return <p className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-[13px] text-rose-700">⚠ {err}</p>
  if (!data) return <p className="text-[13px] text-slate-400">Đang tải…</p>
  const hieuLuc = data.ledger.filter((e) => !e.thu_hoi_at)
  const soGay = hieuLuc.reduce((s, e) => s + e.so_gay, 0)   // đếm items đang render (badge) — không phải phép tính nghiệp vụ
  return (
    <div className="flex flex-col gap-3">
      <div className={`rounded-2xl border p-4 shadow-sm ${soGay > 0 ? 'border-rose-200 bg-rose-50' : 'border-emerald-200 bg-emerald-50'}`}>
        <p className={`text-[28px] font-extrabold ${soGay > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>{soGay} gậy</p>
        <p className="text-[12.5px] text-slate-600">{soGay > 0 ? `≈ ${vnd(soGay * donGia)} · 1 gậy = ${vnd(donGia)}` : 'Tháng này sạch bóng 🎉'}</p>
      </div>
      {data.deXuatCho.length > 0 && (
        <div>
          <BoxTitle>Đang đề xuất — chờ leader duyệt ({data.deXuatCho.length})</BoxTitle>
          <div className="flex flex-col gap-2">
            {data.deXuatCho.map((d) => (
              <div key={d.id} className="rounded-2xl border border-amber-200 bg-white p-3 shadow-sm">
                <p className="text-[13px] font-semibold text-slate-800">{d.mo_ta}</p>
                <p className="mt-0.5 text-[11.5px] text-amber-700">Chưa chốt — đang tạm tính đạt. Thấy sai thì báo leader bỏ qua kèm lý do.</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div>
        <BoxTitle>Đã chốt ({data.ledger.length})</BoxTitle>
        {!data.ledger.length ? <Trong>Chưa có gậy nào được chốt tháng này.</Trong> : (
          <div className="flex flex-col gap-2">
            {data.ledger.map((e) => (
              <div key={e.id} className={`rounded-2xl border bg-white p-3 shadow-sm ${e.thu_hoi_at ? 'border-slate-200 opacity-60' : e.so_gay < 0 ? 'border-emerald-200' : 'border-rose-200'}`}>
                <div className="flex items-center gap-2">
                  <span className={`text-[16px] font-extrabold ${e.so_gay < 0 ? 'text-emerald-600' : 'text-rose-600'} ${e.thu_hoi_at ? 'line-through' : ''}`}>{e.so_gay > 0 ? `+${e.so_gay}` : e.so_gay}</span>
                  <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-slate-800">{e.so_gay < 0 ? e.hoat_dong_ten : e.loi_ten ?? 'Gậy'}</span>
                  <span className="text-[11px] text-slate-400">{ddmmVN(e.created_at.slice(0, 10))}</span>
                </div>
                {e.ly_do && <p className="mt-1 text-[12px] text-slate-600">{e.ly_do}</p>}
                {e.thu_hoi_at && <p className="mt-1 text-[11.5px] font-medium text-amber-600">Đã thu hồi: {e.thu_hoi_ly_do}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── MÀN CON: HƯỚNG DẪN ────────────────────────────────────────────────────────
export function HuongDanBox({ vaiTro }: { vaiTro: string }) {
  const [ds, setDs] = useState<QuyTrinh[] | null>(null)
  const [mo, setMo] = useState<QuyTrinh | null>(null)
  useEffect(() => { listQuyTrinh(vaiTro).then(setDs).catch(() => setDs([])) }, [vaiTro])
  if (mo) {
    return (
      <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
        <button onClick={() => setMo(null)} className="mb-2 text-[12.5px] font-semibold text-indigo-600">‹ Danh sách quy trình</button>
        <p className="text-[16px] font-bold text-slate-800">{mo.tieu_de}</p>
        <p className="mb-3 text-[11px] text-slate-400">Cập nhật {ddmmVN(mo.updated_at.slice(0, 10))}</p>
        <div className="whitespace-pre-wrap text-[13.5px] leading-relaxed text-slate-700">{mo.noi_dung || '(chưa có nội dung)'}</div>
      </div>
    )
  }
  if (ds === null) return <p className="text-[13px] text-slate-400">Đang tải…</p>
  if (!ds.length) return <Trong>Chưa có quy trình nào được đưa lên. Nội dung sẽ được bổ sung dần.</Trong>
  return (
    <div className="flex flex-col gap-2">
      {ds.map((q) => (
        <button key={q.id} onClick={() => setMo(q)} className="rounded-2xl border border-slate-200/70 bg-white p-3.5 text-left shadow-sm active:bg-slate-50">
          <p className="text-[14px] font-bold text-slate-800">{q.tieu_de}</p>
          {q.tom_tat && <p className="mt-0.5 text-[12px] text-slate-500">{q.tom_tat}</p>}
        </button>
      ))}
    </div>
  )
}

// ── MÀN CON: ĐẠT CHUẨN (bar + 4 số + danh sách việc) ──────────────────────────
export function DatChuanBox({ me, items, tabTen, lyDoTen, mauBar, chuThich }: {
  me: { tong?: number; cho?: number; den_han?: number; dat?: number; khong_dat?: number; pct?: number | null }
  items: ViecItem[]; tabTen: Record<string, string>; lyDoTen: Record<string, string>; mauBar: string; chuThich: string
}) {
  const pct = me.pct ?? null
  if (!me.tong) return <Trong>Tháng này chưa có việc trực ca nào của bạn.</Trong>
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
        <div className="mb-1.5 flex items-baseline gap-2">
          <span className="text-[28px] font-extrabold text-slate-800">{pct == null ? '—' : `${pct}%`}</span>
          <span className="text-[13px] font-semibold text-slate-500">đạt chuẩn · {me.dat ?? 0}/{me.den_han ?? 0} việc đến hạn</span>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-slate-100">
          <div className={`h-full rounded-full ${(pct ?? 0) >= 80 ? mauBar : (pct ?? 0) >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${pct ?? 0}%` }} />
        </div>
        <p className="mt-2 text-[12px] text-slate-500">{chuThich}</p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[[me.tong ?? 0, 'Được giao', 'text-slate-700'], [me.dat ?? 0, 'Đạt chuẩn', 'text-emerald-600'], [me.khong_dat ?? 0, 'Không đạt', 'text-rose-600'], [me.cho ?? 0, 'Đang chờ', 'text-slate-400']].map(([n, l, c]) => (
          <div key={String(l)} className="rounded-2xl border border-slate-200/70 bg-white p-2.5 text-center shadow-sm">
            <p className={`text-[20px] font-extrabold ${c}`}>{n}</p>
            <p className="text-[10.5px] font-semibold text-slate-400">{l}</p>
          </div>
        ))}
      </div>
      <ViecThangAccordion items={items} tenViecLabel="Việc" tabTen={tabTen} lyDoTen={lyDoTen} fmtNgay={ddmmVN} />
    </div>
  )
}

// ── MÀN CON: SHOPPING — vật phẩm mua bằng điểm ĐÃ CHỐT (điểm tháng này chỉ là dự kiến) ─────
const TT: Record<ShopDon['trang_thai'], { ten: string; cls: string }> = {
  cho_giao: { ten: 'Chờ giao', cls: 'bg-amber-50 text-amber-700' },
  da_giao: { ten: 'Đã giao', cls: 'bg-emerald-50 text-emerald-700' },
  huy: { ten: 'Đã huỷ', cls: 'bg-slate-100 text-slate-400 line-through' },
}
export function ShopBox({ xaiDuoc, diemThang, onChanged }: { xaiDuoc: number; diemThang: number; onChanged: () => void }) {
  const [items, setItems] = useState<ShopVatPham[] | null>(null)
  const [don, setDon] = useState<ShopDon[]>([])
  const [busy, setBusy] = useState<string | null>(null)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [xacNhan, setXacNhan] = useState<ShopVatPham | null>(null)

  const load = () => Promise.all([listVatPham(), listDonCuaToi()]).then(([i, d]) => { setItems(i); setDon(d) }).catch((e) => setMsg({ ok: false, text: e?.message ?? String(e) }))
  useEffect(() => { load() }, [])

  async function doi(v: ShopVatPham) {
    setBusy(v.id); setMsg(null)
    try { await doiVatPham(v.id); setMsg({ ok: true, text: `Đã đổi ${v.ten} — chờ giao.` }); setXacNhan(null); await load(); onChanged() }
    catch (e: any) { setMsg({ ok: false, text: e?.message ?? String(e) }) }
    finally { setBusy(null) }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-500">Điểm xài được (đã chốt tháng)</p>
        <p className="text-[28px] font-extrabold text-violet-800">{xaiDuoc.toLocaleString('vi-VN')}</p>
        <p className="text-[12px] text-violet-700">Tháng này đang có +{diemThang.toLocaleString('vi-VN')} (dự kiến) — chốt cuối tháng mới xài được.</p>
      </div>
      {msg && <p className={`rounded-xl px-3 py-2 text-[12.5px] ${msg.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{msg.text}</p>}

      <BoxTitle>Vật phẩm</BoxTitle>
      {items === null ? <p className="text-[13px] text-slate-400">Đang tải…</p>
        : !items.length ? <Trong>Chưa có vật phẩm nào — admin sẽ thêm.</Trong>
        : (
          <div className="grid grid-cols-2 gap-3">
            {items.map((v) => {
              const du = xaiDuoc >= v.gia_diem
              return (
                <div key={v.id} className="rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm">
                  {v.anh_url ? <img src={v.anh_url} alt="" className="mb-2 h-20 w-full rounded-xl object-cover" /> : <div className="mb-2 flex h-20 items-center justify-center rounded-xl bg-slate-50 text-[30px]">🎁</div>}
                  <p className="text-[13.5px] font-bold text-slate-800">{v.ten}</p>
                  {v.mo_ta && <p className="text-[11.5px] text-slate-500">{v.mo_ta}</p>}
                  <p className="mt-1 text-[13px] font-extrabold text-violet-700">⭐ {v.gia_diem.toLocaleString('vi-VN')}</p>
                  <button disabled={!du || busy === v.id} onClick={() => setXacNhan(v)}
                    className="mt-2 w-full rounded-lg bg-violet-600 px-3 py-1.5 text-[12.5px] font-semibold text-white disabled:opacity-40">
                    {du ? 'Đổi' : `Thiếu ${(v.gia_diem - xaiDuoc).toLocaleString('vi-VN')}`}
                  </button>
                </div>
              )
            })}
          </div>
        )}

      {don.length > 0 && (
        <div>
          <BoxTitle>Đơn của tôi</BoxTitle>
          <div className="flex flex-col gap-2">
            {don.map((d) => (
              <div key={d.id} className="flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-slate-800">{d.ten_vat_pham}</p>
                  <p className="text-[11px] text-slate-400">⭐ {d.gia_diem.toLocaleString('vi-VN')} · {ddmmVN(d.created_at.slice(0, 10))}{d.ghi_chu ? ` · ${d.ghi_chu}` : ''}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${TT[d.trang_thai].cls}`}>{TT[d.trang_thai].ten}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {xacNhan && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-900/40 p-2" onClick={() => setXacNhan(null)}>
          <div className="w-full max-w-lg rounded-t-3xl rounded-b-2xl bg-white p-5 shadow-2xl" style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }} onClick={(e) => e.stopPropagation()}>
            <p className="text-[16px] font-bold text-slate-800">Đổi {xacNhan.ten}?</p>
            <p className="mt-1 text-[13px] text-slate-600">Trừ ⭐ {xacNhan.gia_diem.toLocaleString('vi-VN')} điểm đã chốt. Còn lại {(xaiDuoc - xacNhan.gia_diem).toLocaleString('vi-VN')}.</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setXacNhan(null)} className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-[13px] font-semibold text-slate-600">Thôi</button>
              <button onClick={() => doi(xacNhan)} disabled={busy === xacNhan.id} className="flex-1 rounded-xl bg-violet-600 px-3 py-2.5 text-[13px] font-semibold text-white disabled:opacity-50">{busy === xacNhan.id ? 'Đang đổi…' : 'Đổi ngay'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
