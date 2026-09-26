// SỰ KIỆN (spec-su-kien.md) — 1 lá, 4 tab: Check-in (laptop cửa) · Quản trò (điện thoại phòng iPad) ·
// Bàn quay · Cài đặt (Quầy quà đã bỏ 26/09 — đổi quà không thuộc hệ này). 2 màn TV (vòng quay / hàng chờ) mở toàn màn hình qua hash — xem TvSuKien.tsx.
// Mọi con số/luật ở Postgres (fn_sk_*); ở đây chỉ gọi RPC, nghe realtime, vá tại chỗ.
import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import * as sk from '../../lib/sukien'
import type { KetQuaTim, PhongTQ, SuKien, TongQuan } from '../../lib/sukien'
import { VongQuay } from './TvSuKien'

export type TabSuKien = 'checkin' | 'dangky' | 'quay' | 'quantro' | 'caidat'
type Tab = TabSuKien
const LS_SK = 'sk-su-kien-dang-chon'
const LS_TAB = 'sk-tab'
const lsGet = (k: string) => { try { return localStorage.getItem(k) } catch { return null } }
const lsSet = (k: string, v: string) => { try { localStorage.setItem(k, v) } catch { /* bỏ qua */ } }

function useToast() {
  const [msg, setMsg] = useState<{ t: string; loi?: boolean } | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const show = (t: string, loi = false) => {
    setMsg({ t, loi })
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setMsg(null), loi ? 5000 : 2500)
  }
  const el = msg ? (
    <div className={`fixed bottom-5 left-1/2 z-50 max-w-[92vw] -translate-x-1/2 rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-lg ${msg.loi ? 'bg-rose-600' : 'bg-emerald-600'}`}>{msg.t}</div>
  ) : null
  return { show, el }
}

// VIỆC ĐƯỢC GIAO (Thùy 26/09: "giao task check-in, quản trò cho nhân sự, đứa nào không giao thì không thấy gì").
// Quản lý giao việc ở Cài đặt (sk_phan_cong); DB chặn mọi RPC ngoài việc được giao.
// Mỗi việc được giao = 1 TAB (1 người làm cả Check-in + Đăng ký game thì thấy 2 tab, bấm qua lại).
// Quản lý (vai quanly / admin hệ thống) thấy mọi tab + Cài đặt.
const TAB_VIEC: { k: Exclude<Tab, 'caidat'>; t: string }[] = [
  { k: 'checkin', t: '🚪 Check-in' }, { k: 'dangky', t: '📝 Đăng ký game' }, { k: 'quay', t: '🎡 Bàn quay' }, { k: 'quantro', t: '🎮 Quản trò' },
]
const tabDuoc = (vai: sk.Vai[]): [Tab, string][] => [
  ...TAB_VIEC.filter((x) => vai.includes(x.k)).map((x) => [x.k, x.t] as [Tab, string]),
  ...(vai.includes('quanly') ? [['caidat', '⚙️ Cài đặt'] as [Tab, string]] : []),
]

export default function SuKienScreen({ tabDau, appRieng = false }: { tabDau?: Tab; appRieng?: boolean } = {}) {
  const [ds, setDs] = useState<SuKien[] | null>(null)
  const [skId, setSkId] = useState<string | null>(lsGet(LS_SK))
  const [tabMuon, setTabMuon] = useState<Tab | null>(tabDau || (lsGet(LS_TAB) as Tab | null))
  const [loiTai, setLoiTai] = useState<string | null>(null)
  const toast = useToast()

  const taiDs = async () => {
    try {
      const d = await sk.listSuKien()
      setDs(d)
      // Máy nhớ sự kiện cũ nhưng nó đã ĐÓNG (vd TEST) mà đang có sự kiện mở ⇒ chuyển sang sự kiện mở, không kẹt ở cái đã đóng.
      setSkId((cur) => {
        const mo = d.find((x) => x.trang_thai === 'mo')
        const giu = cur ? d.find((x) => x.id === cur) : undefined
        return (giu && (giu.trang_thai === 'mo' || !mo) ? giu : (mo ?? d[0]))?.id ?? null
      })
    } catch (e) { setLoiTai((e as Error).message) }
  }
  useEffect(() => { taiDs() }, [])
  useEffect(() => { if (skId) lsSet(LS_SK, skId) }, [skId])

  const ev = ds?.find((s) => s.id === skId) ?? null
  const tabs = ev ? tabDuoc(ev.vai) : []
  const tab: Tab | null = tabMuon && tabs.some(([k]) => k === tabMuon) ? tabMuon : tabs[0]?.[0] ?? null
  const chonTab = (k: Tab) => { setTabMuon(k); lsSet(LS_TAB, k) }
  const quanLy = !!ev?.vai.includes('quanly')

  const live = sk.useTongQuan(skId)

  if (loiTai) return <section className="p-6 text-sm text-rose-600">Không tải được sự kiện: {loiTai}</section>
  if (!ds) return <section className="p-6 text-sm text-slate-400">Đang tải…</section>
  if (!ev || !tab) return <section className="flex min-h-0 flex-col items-center justify-center gap-2 p-8 text-center"><div className="text-4xl">🏮</div><div className="font-bold text-slate-700">Bạn chưa được giao việc ở sự kiện nào</div><div className="text-sm text-slate-500">Nhờ quản lý sự kiện giao việc cho bạn (Cài đặt › Giao việc), rồi tải lại trang.</div><button onClick={() => taiDs()} className="mt-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm">↻ Tải lại</button></section>

  return (
    <section className="flex min-h-0 flex-col overflow-hidden bg-[#f5f5f7]">
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-3 py-2">
        {ds.length > 1 && quanLy ? (
          <select value={skId ?? ''} onChange={(e) => setSkId(e.target.value)} className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm font-semibold">
            {ds.map((s) => <option key={s.id} value={s.id}>{s.ten}{s.trang_thai === 'dong' ? ' (đã đóng)' : ''}</option>)}
          </select>
        ) : <span className="px-1 text-sm font-bold text-slate-800">🏮 {ev.ten}</span>}
        <div className="flex flex-wrap gap-1">
          {tabs.map(([k, t]) => (
            tabs.length > 1
              ? <button key={k} onClick={() => chonTab(k)} className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${tab === k ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{t}</button>
              : <span key={k} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-bold text-white">{t}</span>
          ))}
        </div>
        {live.tq && (
          <div className="ml-auto hidden gap-3 text-xs text-slate-500 md:flex">
            <span>✅ {live.tq.tong_checkin} check-in</span><span>👥 {live.tq.tong_nguoi} người chơi ({live.tq.tong_khach} khách)</span>
            <span>🪙 phát {live.tq.xu_phat} xu</span>
          </div>
        )}
      </div>
      {live.err && <div className="shrink-0 bg-amber-50 px-3 py-1 text-xs text-amber-700">⚠ Mất kết nối số liệu: {live.err} — đang thử lại…</div>}
      <div className="min-h-0 flex-1 overflow-auto">
        {tab === 'checkin' ? <CheckinTab skId={skId!} toast={toast.show} onDoi={live.tai} />
          : tab === 'dangky' ? <DangKyTab skId={skId!} tq={live.tq} toast={toast.show} onDoi={live.tai} />
          : tab === 'quantro' ? <QuanTroTab tq={live.tq} toast={toast.show} onDoi={live.tai} setTq={live.setTq} />
          : tab === 'quay' ? <VongQuay skId={skId!} banQuay onLoi={(t) => toast.show(t, true)} />
          : <CaiDatTab appRieng={appRieng} laAdmin={ev.la_admin} ds={ds} skId={skId!} tq={live.tq} toast={toast.show} onDoi={() => { taiDs(); live.tai() }} onChon={setSkId} />}
      </div>
      {toast.el}
    </section>
  )
}

// ─────────────────────────────── Ô TÌM (dùng chung check-in + đăng ký game) ───────────────────────────────
function useTim(skId: string) {
  const [q, setQ] = useState('')
  const [rows, setRows] = useState<KetQuaTim[]>([])
  const [dangTim, setDangTim] = useState(false)
  const req = useRef(0)
  const chay = async (text: string) => {
    const my = ++req.current
    if (!text.trim()) { setRows([]); return }
    setDangTim(true)
    try { const d = await sk.tim(skId, text); if (my === req.current) setRows(d) }
    catch { /* giữ list cũ */ }
    finally { if (my === req.current) setDangTim(false) }
  }
  useEffect(() => { const t = setTimeout(() => chay(q), 220); return () => clearTimeout(t) }, [q, skId]) // eslint-disable-line
  return { q, setQ, rows, setRows, dangTim, lamMoi: () => chay(q) }
}

// ─────────────────────────────── CHECK-IN (chỉ HS BK) ───────────────────────────────
// Check-in xong ⇒ HS ra BÀN QUAY. Danh sách đã check-in hiện ngay dưới ô tìm (Thùy 26/09), mới nhất trên cùng.
function CheckinTab({ skId, toast, onDoi }: { skId: string; toast: (t: string, loi?: boolean) => void; onDoi: () => void }) {
  const t = useTim(skId)
  const [ban, setBan] = useState<string | null>(null)
  const [daCi, setDaCi] = useState<Awaited<ReturnType<typeof sk.daCheckin>> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const taiDaCi = async () => { try { setDaCi(await sk.daCheckin(skId)) } catch { /* giữ list cũ */ } }
  sk.useSkLive(['sk_checkin', 'sk_xu'], taiDaCi, 5000)
  useEffect(() => { setDaCi(null); taiDaCi() }, [skId]) // eslint-disable-line

  const checkin = async (r: KetQuaTim) => {
    setBan(r.hoc_sinh_id)
    try {
      const id = await sk.checkin(skId, r.hoc_sinh_id!)
      toast(`✓ Check-in ${r.ten} — mời ra bàn quay`)
      // vá tại chỗ: dòng tìm được ⇒ đã check-in; đưa lên đầu danh sách
      t.setRows((prev) => prev.map((x) => x.hoc_sinh_id === r.hoc_sinh_id ? { ...x, da_checkin: true, nguoi_choi_id: id } : x))
      setDaCi((prev) => prev && !prev.some((x) => x.nguoi_choi_id === id)
        ? [{ nguoi_choi_id: id, ten: r.ten, so: r.so ?? 0, lop: r.lop, checkin_at: new Date().toISOString(), xu_quay: null }, ...prev] : prev)
      t.setQ(''); inputRef.current?.focus()
      taiDaCi(); onDoi()
    } catch (e) { toast((e as Error).message, true) }
    finally { setBan(null) }
  }
  const hs = t.rows.filter((r) => !r.la_khach)

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4">
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="mb-2 text-base font-bold text-slate-800">Check-in học sinh BK</h3>
        <input ref={inputRef} autoFocus value={t.q} onChange={(e) => t.setQ(e.target.value)} placeholder="Gõ tên học sinh (không cần dấu)…"
          className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-lg outline-none focus:border-emerald-500" />
        <div className="mt-2 divide-y divide-slate-100">
          {t.q.trim() && !hs.length && !t.dangTim && <div className="py-3 text-sm text-slate-400">Không thấy học sinh BK nào khớp.</div>}
          {hs.map((r) => (
            <div key={r.hoc_sinh_id} className="flex flex-wrap items-center gap-2 py-2.5">
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-slate-800">{r.ten} {r.so != null && <span className="font-mono text-xs text-slate-400">#{r.so}</span>}</div>
                <div className="text-xs text-slate-500">{r.lop ?? '—'}</div>
              </div>
              {!r.da_checkin ? (
                <button disabled={ban === r.hoc_sinh_id} onClick={() => checkin(r)}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50">Check-in</button>
              ) : r.xu_quay == null ? (
                <span className="rounded-lg bg-amber-100 px-3 py-2 text-sm font-bold text-amber-800">✓ Đã check-in · 🎡 mời ra bàn quay</span>
              ) : <span className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">✓ Đã check-in · quay {r.xu_quay} xu</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="mb-2 text-base font-bold text-slate-800">✅ Đã check-in ({daCi?.length ?? '…'})</h3>
        {daCi?.length === 0 && <div className="text-sm text-slate-400">Chưa ai check-in.</div>}
        <div className="divide-y divide-slate-100">
          {daCi?.map((x, i) => (
            <div key={x.nguoi_choi_id} className="flex items-center gap-2 py-2 text-sm">
              <span className="w-8 text-right text-xs text-slate-400">{daCi.length - i}</span>
              <span className="w-12 text-xs text-slate-400">{new Date(x.checkin_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="min-w-0 flex-1 truncate font-semibold">{x.ten} <span className="font-normal text-slate-400">{x.lop ?? ''}</span></span>
              {x.xu_quay != null ? <span className="text-xs font-semibold text-emerald-700">🎡 {x.xu_quay} xu</span> : <span className="text-xs text-amber-700">chưa quay</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────── ĐĂNG KÝ GAME (HS BK + khách ngoài) ───────────────────────────────
function DangKyTab({ skId, tq, toast, onDoi }: { skId: string; tq: TongQuan | null; toast: (t: string, loi?: boolean) => void; onDoi: () => void }) {
  const t = useTim(skId)
  const [ban, setBan] = useState<string | null>(null)
  const [khach, setKhach] = useState('')
  const [khachMoi, setKhachMoi] = useState<{ id: string; so: number; ten: string; daDk: boolean }[]>([])
  const phongHang = (tq?.phong ?? []).filter((p) => p.hang_doi)
  const [phongId, setPhongId] = useState<string | null>(null)
  const phong = phongHang.find((p) => p.id === phongId) ?? phongHang[0]

  const lam = async (key: string, fn: () => Promise<string | void>) => {
    setBan(key)
    try { const m = await fn(); if (m) toast(m); await t.lamMoi(); onDoi() }
    catch (e) { toast((e as Error).message, true) }
    finally { setBan(null) }
  }
  const ensure = async (r: KetQuaTim) => r.nguoi_choi_id ?? await sk.nguoiChoiBK(skId, r.hoc_sinh_id!)

  return (
    <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800">Đăng ký game — HS BK hoặc khách theo số</h3>
            {phongHang.length > 1 && (
              <select value={phong?.id ?? ''} onChange={(e) => setPhongId(e.target.value)} className="rounded-md border border-slate-300 px-2 py-1 text-xs">
                {phongHang.map((p) => <option key={p.id} value={p.id}>Vào: {p.ten}</option>)}
              </select>
            )}
          </div>
          <input autoFocus value={t.q} onChange={(e) => t.setQ(e.target.value)} placeholder="Gõ tên (không cần dấu) hoặc số #37…"
            className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-lg outline-none focus:border-indigo-500" />
          <div className="mt-3 divide-y divide-slate-100">
            {t.q.trim() && !t.rows.length && !t.dangTim && <div className="py-3 text-sm text-slate-400">Không thấy ai khớp. Khách ngoài chưa có số thì cấp số ở dưới.</div>}
            {t.rows.map((r) => {
              const key = (r.hoc_sinh_id ?? r.nguoi_choi_id)!
              return (
                <div key={key} className="flex flex-wrap items-center gap-2 py-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-800">{r.ten} {r.so != null && <span className="font-mono text-xs text-slate-400">#{r.so}</span>}</div>
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      <span className="text-slate-500">{r.la_khach ? 'Khách ngoài BK' : (r.lop ?? '—')}</span>
                      {r.so_du > 0 && <span className="rounded bg-yellow-50 px-1.5 text-yellow-800">🪙 {r.so_du}</span>}
                      {r.dang_ky_trang_thai && <span className="rounded bg-indigo-50 px-1.5 text-indigo-700">{r.dang_ky_trang_thai === 'dang_choi' ? '🎮 đang chơi' : '⏳ đang chờ'} · {r.phong_ten}</span>}
                    </div>
                  </div>
                  {!r.dang_ky_trang_thai && phong && (
                    <button disabled={ban === key} onClick={() => lam(key, async () => { await sk.dangKy(phong.id, await ensure(r)); return `⏳ ${r.ten} đã vào hàng chờ ${phong.ten}` })}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50">+ Đăng ký</button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <h3 className="mb-2 text-base font-bold text-slate-800">Khách ngoài BK — cấp số</h3>
          <form className="flex gap-2" onSubmit={(e) => {
            e.preventDefault()
            const ten = khach.trim()
            if (!ten) return
            lam('khach', async () => {
              const k = await sk.themKhach(skId, ten)
              setKhachMoi((prev) => [{ id: k.id, so: k.so, ten, daDk: false }, ...prev].slice(0, 8))
              setKhach('')
              return `Cấp số #${k.so} cho ${ten}`
            })
          }}>
            <input value={khach} onChange={(e) => setKhach(e.target.value)} placeholder="Tên bạn…" className="min-w-0 flex-1 rounded-xl border-2 border-slate-200 px-3 py-2 outline-none focus:border-indigo-500" />
            <button disabled={!khach.trim() || ban === 'khach'} className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-bold text-white disabled:opacity-40">Cấp số</button>
          </form>
          {khachMoi.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {khachMoi.map((k) => (
                <div key={k.id} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 font-mono text-lg font-bold text-white">#{k.so}</span>
                  <span className="flex-1 font-semibold">{k.ten}</span>
                  {k.daDk ? <span className="text-xs text-indigo-600">⏳ đã vào hàng chờ</span> : phong && (
                    <button disabled={ban === k.id} onClick={() => lam(k.id, async () => {
                      await sk.dangKy(phong.id, k.id)
                      setKhachMoi((prev) => prev.map((x) => x.id === k.id ? { ...x, daDk: true } : x))
                      return `⏳ ${k.ten} #${k.so} đã vào hàng chờ`
                    })} className="rounded-lg bg-indigo-600 px-3 py-1 text-sm font-bold text-white disabled:opacity-50">+ Đăng ký</button>
                  )}
                </div>
              ))}
            </div>
          )}
          <p className="mt-2 text-xs text-slate-400">Khách không check-in, không quay; vẫn đăng ký game và nhận xu như thường. Lần sau tìm theo số ở ô trên.</p>
        </div>
      </div>

      <TomTatHang tq={tq} />
    </div>
  )
}

function TomTatHang({ tq }: { tq: TongQuan | null }) {
  if (!tq) return <div className="text-sm text-slate-400">Đang tải hàng chờ…</div>
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2 text-center">
        <Stat n={tq.tong_checkin} t="check-in" />
        <Stat n={tq.tong_quay} t="đã quay" />
        <Stat n={tq.tong_khach} t="khách" />
      </div>
      {tq.phong.filter((p) => p.hang_doi).map((p) => (
        <div key={p.id} className="rounded-2xl bg-white p-3 shadow-sm">
          <div className="mb-1 flex items-center justify-between"><b>{p.ten}</b><span className="text-xs text-slate-400">{p.so_luot_xong} lượt đã xong</span></div>
          <div className="text-sm"><span className="text-slate-500">🎮 Đang chơi:</span> {p.luot ? p.luot.nguoi.map((n) => n.ten).join(', ') : '—'}</div>
          <div className="text-sm"><span className="text-slate-500">🚪 Mời vào:</span> {p.co_mat.length ? p.co_mat.map((n) => n.ten).join(', ') : '—'}</div>
          <div className="mt-1 text-sm"><span className="text-slate-500">⏳ Đang chờ:</span> <b>{p.cho.length}</b> bạn</div>
          {p.cho.length > 0 && <div className="mt-1 text-xs text-slate-500">{p.cho.slice(0, 8).map((n, i) => `${i + 1}. ${n.ten}`).join(' · ')}{p.cho.length > 8 ? ' …' : ''}</div>}
        </div>
      ))}
    </div>
  )
}
const Stat = ({ n, t }: { n: number; t: string }) => (
  <div className="rounded-xl bg-white py-2 shadow-sm"><div className="text-xl font-bold text-slate-800">{n}</div><div className="text-[11px] text-slate-500">{t}</div></div>
)

// ─────────────────────────────── QUẢN TRÒ ───────────────────────────────

function QuanTroTab({ tq, toast, onDoi, setTq }: { tq: TongQuan | null; toast: (t: string, loi?: boolean) => void; onDoi: () => void; setTq: (f: (p: TongQuan | null) => TongQuan | null) => void }) {
  const phongHang = (tq?.phong ?? []).filter((p) => p.hang_doi)
  const [phongId, setPhongId] = useState<string | null>(lsGet('sk-qt-phong'))
  const phong = phongHang.find((p) => p.id === phongId) ?? phongHang[0]
  useEffect(() => { if (phong) lsSet('sk-qt-phong', phong.id) }, [phong?.id]) // eslint-disable-line
  const [ban, setBan] = useState<string | null>(null)
  const [gameHub, setGameHub] = useState<string | null>(null)
  const [game, setGame] = useState<string>(lsGet('sk-qt-game') || sk.GAME_IPAD[0].id)
  useEffect(() => { lsSet('sk-qt-game', game) }, [game])

  // Hub iPad báo game đang mở → chọn sẵn. Giữ kênh để quản trò RA LỆNH mở game trên TV (event 'sk_open', hub TV xử lý).
  const hubRef = useRef<ReturnType<typeof supabase.channel> | null>(null)
  useEffect(() => {
    if (!phong?.ma_hub) return
    const ch = supabase.channel('bk-hub:' + phong.ma_hub, { config: { broadcast: { self: false } } })
    ch.on('broadcast', { event: 'open' }, (m) => {
      const g = (m.payload as { game?: string | null })?.game ?? null
      setGameHub(g); if (g && sk.GAME_IPAD.some((x) => x.id === g)) setGame(g)
    }).subscribe()
    hubRef.current = ch
    return () => { hubRef.current = null; supabase.removeChannel(ch) }
  }, [phong?.ma_hub])
  // Thùy 26/09: bấm BẮT ĐẦU mà TV đang đứng menu hub ⇒ iPad cứ "đang chờ". Giờ điện thoại bảo TV mở đúng game luôn.
  const moTv = (id: string) => { if (sk.GAME_IPAD.some((x) => x.id === id)) hubRef.current?.send({ type: 'broadcast', event: 'sk_open', payload: { game: id } }) }

  if (!tq) return <div className="p-4 text-sm text-slate-400">Đang tải…</div>
  if (!phong) return <div className="p-4 text-sm text-slate-500">Sự kiện chưa có phòng dùng hàng chờ — vào ⚙️ Cài đặt.</div>

  // Vá tại chỗ: chuyển 1 người giữa các nhóm của phòng, rồi refetch nền.
  const vaPhong = (f: (p: PhongTQ) => PhongTQ) => setTq((prev) => prev && ({ ...prev, phong: prev.phong.map((p) => p.id === phong.id ? f(p) : p) }))
  const danhDau = async (id: string, hd: 'co_mat' | 'bo_qua' | 'tra_ve' | 'huy', ten: string) => {
    setBan(id)
    try {
      const d = await sk.danhDau(id, hd)
      vaPhong((p) => {
        const all = [...p.co_mat, ...p.cho]
        const nguoi = all.find((x) => x.dang_ky_id === id)
        const coMat = p.co_mat.filter((x) => x.dang_ky_id !== id)
        const cho = p.cho.filter((x) => x.dang_ky_id !== id)
        if (nguoi && d.trang_thai === 'co_mat') coMat.push({ ...nguoi, so_lan_bo_qua: d.so_lan_bo_qua })
        if (nguoi && d.trang_thai === 'cho') {
          // giữ vị trí cũ trong hàng (thứ tự = lúc đăng ký): chèn lại đúng chỗ ban đầu
          const idx = p.cho.findIndex((x) => x.dang_ky_id === id)
          const moi = { ...nguoi, so_lan_bo_qua: d.so_lan_bo_qua }
          if (idx >= 0) cho.splice(idx, 0, moi); else cho.unshift(moi)
        }
        return { ...p, co_mat: coMat, cho }
      })
      if (hd === 'bo_qua') toast(d.trang_thai === 'bo' ? `✖ ${ten} vắng lần 2 — đã loại khỏi hàng` : `${ten} vắng lần 1 — giữ chỗ, gọi lại sau`)
      onDoi()
    } catch (e) { toast((e as Error).message, true); onDoi() }
    finally { setBan(null) }
  }

  const toiDa = tq.su_kien.cau_hinh.toi_da_luot ?? 6
  return (
    <div className="mx-auto max-w-xl space-y-3 p-3">
      <div className="flex flex-wrap items-center gap-2">
        {phongHang.length > 1 ? (
          <select value={phong.id} onChange={(e) => setPhongId(e.target.value)} className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm font-bold">
            {phongHang.map((p) => <option key={p.id} value={p.id}>{p.ten}</option>)}
          </select>
        ) : <b className="text-slate-800">{phong.ten}</b>}
        {phong.ma_hub && <span className="rounded bg-slate-200 px-1.5 text-xs text-slate-600">hub {phong.ma_hub}{gameHub ? ` · đang mở ${gameHub}` : ''}</span>}
        <span className="ml-auto text-xs text-slate-500">{phong.so_luot_xong} lượt xong</span>
      </div>

      {phong.luot && <LuotDangChoi key={phong.luot.id} phong={phong} gameHub={gameHub} moTv={moTv} toast={toast} onDoi={onDoi} />}
      {(
          <div className="rounded-2xl border-2 border-emerald-500 bg-white p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-bold text-emerald-700">🚪 Lượt kế ({phong.co_mat.length}/{toiDa})</h3>
            </div>
            {!phong.co_mat.length && <div className="py-2 text-sm text-slate-400">Hô tên ở hàng chờ bên dưới, bạn nào có mặt thì bấm ✔.</div>}
            <div className="space-y-1.5">
              {phong.co_mat.map((n, i) => (
                <div key={n.dang_ky_id} className="flex items-center gap-2 rounded-lg bg-emerald-50 px-2 py-2">
                  <span className="w-7 text-center text-sm font-bold text-emerald-700">{i + 1}</span>
                  <span className="flex-1 font-semibold">{n.ten} <span className="font-mono text-xs text-slate-400">#{n.so}</span></span>
                  <button disabled={ban === n.dang_ky_id} onClick={() => danhDau(n.dang_ky_id, 'tra_ve', n.ten)} className="rounded-md px-2 py-1.5 text-xs text-slate-500 hover:bg-white">↩ Trả về</button>
                </div>
              ))}
            </div>
            {phong.co_mat.length > 0 && !phong.luot && (
              <div className="mt-3 flex gap-2">
                <select value={game} onChange={(e) => setGame(e.target.value)} className="min-w-0 flex-1 rounded-lg border border-slate-300 px-2 py-2 text-sm">
                  {sk.GAME_IPAD.map((g) => <option key={g.id} value={g.id}>{g.ten}</option>)}
                  <option value="khac">Game khác (nhập tay)</option>
                </select>
                <button disabled={ban === 'bd'} onClick={async () => {
                  setBan('bd')
                  try {
                    const r = await sk.batDau(phong.id, game)
                    moTv(game)
                    toast(`▶ Bắt đầu lượt ${r.nguoi.length} bạn — TV tự mở game, ngồi đúng iPad số slot`)
                    onDoi()
                  } catch (e) { toast((e as Error).message, true) }
                  finally { setBan(null) }
                }} className="rounded-xl bg-emerald-600 px-5 py-2 text-base font-bold text-white disabled:opacity-50">▶ BẮT ĐẦU</button>
              </div>
            )}
          </div>
        )}

      <div className="rounded-2xl bg-white p-3 shadow-sm">
        <h3 className="mb-2 font-bold text-slate-800">⏳ Hàng chờ ({phong.cho.length})</h3>
        {!phong.cho.length && <div className="py-2 text-sm text-slate-400">Chưa ai chờ.</div>}
        <div className="space-y-1.5">
          {phong.cho.map((n, i) => (
            <div key={n.dang_ky_id} className={`flex items-center gap-2 rounded-lg px-2 py-2 ${n.so_lan_bo_qua ? 'bg-amber-50' : 'bg-slate-50'}`}>
              <span className="w-7 text-center text-sm font-bold text-slate-500">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">{n.ten} <span className="font-mono text-xs text-slate-400">#{n.so}</span>{n.la_khach && <span className="ml-1 text-[11px] text-slate-400">khách</span>}</div>
                {n.so_lan_bo_qua > 0 && <div className="text-[11px] font-medium text-amber-700">đã bỏ qua 1 lần — vắng nữa là loại</div>}
              </div>
              <button disabled={ban === n.dang_ky_id || phong.co_mat.length >= toiDa} onClick={() => danhDau(n.dang_ky_id, 'co_mat', n.ten)}
                className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white disabled:opacity-40">✔ Có mặt</button>
              <button disabled={ban === n.dang_ky_id} onClick={() => danhDau(n.dang_ky_id, 'bo_qua', n.ten)}
                className="rounded-lg border border-rose-300 px-2.5 py-2 text-sm font-bold text-rose-600 disabled:opacity-40">✖</button>
            </div>
          ))}
        </div>
        {phong.co_mat.length >= toiDa && <p className="mt-2 text-xs text-slate-500">Lượt kế đã đủ {toiDa} bạn.</p>}
      </div>
    </div>
  )
}

// Tên theo slot cho TV game (games-site nghe event 'sk_names'): tên chỉ nhận khi TV ở sảnh chờ; kèm mã lượt + số ván
// đã trả ⇒ TV đếm "Ván x/3", đủ thì chặn BẮT ĐẦU, và gắn mã lượt vào kết quả ván (khoá tự nhiên để điện thoại nhận đúng ván).
const namesTheoSlot = (nguoi: { slot: number; ten: string; so: number }[]) =>
  Object.fromEntries(nguoi.map((n) => [n.slot, `${n.ten} #${n.so}`])) as Record<number, string>

function LuotDangChoi({ phong, gameHub, moTv, toast, onDoi }: { phong: PhongTQ; gameHub: string | null; moTv: (game: string) => void; toast: (t: string, loi?: boolean) => void; onDoi: () => void }) {
  const luot = phong.luot!
  const g = sk.GAME_IPAD.find((x) => x.id === luot.game)
  // Game iPad: xu trả NGAY mỗi ván (Thùy 26/09 "quản trò ko cần lưu xu nữa, qua mỗi trận trả xu luôn") — tình trạng đọc từ DB.
  const [xl, setXl] = useState<sk.XuLuot | null>(null)
  const [sua, setSua] = useState<Record<number, string>>({}) // chỉ "Game khác": nhập tay xu cả lượt
  const [ban, setBan] = useState(false)
  const [ketNoi, setKetNoi] = useState(false)
  // Có TV game đang mở trong kênh không (presence role tv). "Đã nối kênh" ≠ "có TV nghe": sai mã hub / TV mở game khác
  // thì kênh vẫn nối xanh mà tên gửi đi rơi vào khoảng không (Thùy 26/09: hub BK01 trong app, TV thật ở BK09).
  const [coTv, setCoTv] = useState(false)
  useEffect(() => {
    if (!g) return
    let huy = false
    sk.xuLuot(luot.id).then((d) => { if (!huy) setXl(d) }).catch((e) => toast((e as Error).message, true))
    return () => { huy = true }
  }, [luot.id]) // eslint-disable-line

  const namesRef = useRef<Record<number, string>>({})
  namesRef.current = namesTheoSlot(luot.nguoi)
  const xlRef = useRef<sk.XuLuot | null>(null)
  xlRef.current = xl
  const onDoiRef = useRef(onDoi)
  onDoiRef.current = onDoi
  const chRef = useRef<ReturnType<typeof supabase.channel> | null>(null)
  const guiTen = () => {
    chRef.current?.send({ type: 'broadcast', event: 'sk_names', payload: { names: namesRef.current, luot: luot.id, van: xlRef.current?.so_van ?? 0, soVan: xlRef.current?.toi_da ?? 3 } })
  }
  useEffect(() => {
    if (!g || !phong.ma_hub) return
    const slots = new Set(luot.nguoi.map((n) => n.slot))
    // TV đã nhận mã lượt ⇒ kết quả mang skLuot, so thẳng. TV chưa nhận (vừa tải lại…) ⇒ lùi về mốc giờ:
    // matchId = Date.now() lúc bắt đầu ván ⇒ bỏ kết quả ván của lượt TRƯỚC (TV còn đứng ở màn kết quả, phát lại mỗi 1s).
    const moc = new Date(luot.bat_dau_at).getTime() - 30_000
    const daGui: Record<string, number> = {} // matchId → lúc gửi; -1 = xong. TV phát lại mỗi 1s ⇒ không gửi lặp; lỗi thì 5s sau thử lại
    const ch = supabase.channel(g.kenh + ':' + phong.ma_hub, { config: { broadcast: { self: false } } })
    let phaseTruoc = ''
    ch.on('presence', { event: 'sync' }, () => {
      setCoTv(Object.values(ch.presenceState()).flat().some((x) => (x as { role?: string }).role === 'tv'))
    })
    ch.on('broadcast', { event: 'state' }, (m) => {
      const st = m.payload as { phase?: string; matchId?: number; skLuot?: string | null; results?: Record<string, { xu: number }> }
      const cuaLuot = st.skLuot ? st.skLuot === luot.id : Number(st.matchId) > moc
      if (st.phase === 'result' && st.results && st.matchId != null && cuaLuot) {
        const id = String(st.matchId), nw = Date.now(), t = daGui[id]
        if (t === undefined || (t >= 0 && nw - t >= 5000)) {
          const ketQua = Object.entries(st.results).filter(([s]) => slots.has(+s)).map(([s, r]) => ({ slot: +s, xu: Number(r?.xu) || 0 }))
          if (!ketQua.length) daGui[id] = -1
          else {
            const lanDau = t === undefined
            daGui[id] = nw
            sk.traXuVan(luot.id, Number(st.matchId), ketQua).then((d) => {
              daGui[id] = -1
              setXl(d); xlRef.current = d; guiTen()
              if (d.xong) { toast(`✓ Đủ ${d.toi_da} ván — xu đã cộng, lượt kết thúc`); onDoiRef.current() }
              else toast(`💰 Ván ${d.so_van}/${d.toi_da} — đã cộng xu`)
            }).catch((e) => { if (lanDau) toast((e as Error).message, true) })
          }
        }
      }
      if (st.phase === 'lobby' && phaseTruoc !== 'lobby') guiTen() // TV vừa về sảnh (hoặc vừa tải lại) ⇒ điền lại tên + số ván
      phaseTruoc = st.phase ?? ''
    }).subscribe((s) => {
      setKetNoi(s === 'SUBSCRIBED')
      if (s === 'SUBSCRIBED') guiTen() // vừa bắt đầu lượt ⇒ điền tên luôn
    })
    chRef.current = ch
    return () => { chRef.current = null; supabase.removeChannel(ch) }
  }, [g?.kenh, phong.ma_hub, luot.id]) // eslint-disable-line

  const soVan = xl?.so_van ?? 0, toiDaVan = xl?.toi_da ?? 3
  const xuSlot = (slot: number) => sua[slot] ?? ''

  return (
    <div className="rounded-2xl border-2 border-indigo-500 bg-white p-3 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h3 className="font-bold text-indigo-700">🎮 Đang chơi · {g?.ten ?? (luot.game === 'khac' ? 'Game khác' : luot.game)}</h3>
        {g && <span className="rounded bg-indigo-600 px-2 py-0.5 text-sm font-black text-white">Ván {Math.min(soVan + 1, toiDaVan)}/{toiDaVan}</span>}
        {g && phong.ma_hub && <span className={`rounded px-1.5 text-[11px] ${!ketNoi ? 'bg-slate-100 text-slate-500' : coTv ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-100 font-bold text-amber-800'}`}>{!ketNoi ? '○ đang nối…' : coTv ? `● TV đã nối · xong ${soVan} ván` : '⚠ chưa thấy TV'}</span>}
        {g && phong.ma_hub && <button onClick={() => { moTv(luot.game); guiTen(); toast('Đã gửi lệnh mở game + tên xuống TV') }} className="ml-auto rounded-md px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50">↻ Gửi lại tên</button>}
      </div>
      {g && phong.ma_hub && gameHub && gameHub !== luot.game ? (
        <div className="mb-2 rounded-lg bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-900">⚠ TV phòng {phong.ma_hub} đang mở <b>{sk.GAME_IPAD.find((x) => x.id === gameHub)?.ten ?? gameHub}</b>, lượt này là <b>{g.ten}</b>. Chuyển TV sang {g.ten}, hoặc Huỷ lượt rồi bắt đầu lại đúng game.<button onClick={() => moTv(luot.game)} className="mt-1.5 block rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-bold text-white">📺 Mở {g.ten} trên TV</button></div>
      ) : g && phong.ma_hub && ketNoi && !coTv ? (
        <div className="mb-2 rounded-lg bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-900">⚠ Không thấy TV {g.ten} ở phòng <b>{phong.ma_hub}</b> — tên chưa xuống được iPad. Kiểm tra: TV đã mở {g.ten} chưa, mã phòng trên hub TV có đúng {phong.ma_hub} không (sai thì sửa ở ⚙️ Cài đặt › Phòng chơi).<button onClick={() => moTv(luot.game)} className="mt-1.5 block rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-bold text-white">📺 Mở {g.ten} trên TV</button></div>
      ) : null}
      <div className="space-y-1.5">
        {luot.nguoi.map((n) => (
          <div key={n.dang_ky_id} className="flex items-center gap-2 rounded-lg bg-indigo-50 px-2 py-1.5">
            <span className="rounded bg-indigo-600 px-2 py-0.5 text-sm font-bold text-white">iPad {n.slot}</span>
            <span className="min-w-0 flex-1 truncate font-semibold">{n.ten} <span className="font-mono text-xs text-slate-400">#{n.so}</span></span>
            {g ? (
              <span className="text-base font-bold text-emerald-700">+{xl?.tong[String(n.slot)] ?? 0} <span className="text-xs font-normal text-slate-400">xu</span></span>
            ) : (<>
              <input inputMode="numeric" value={xuSlot(n.slot)} onChange={(e) => setSua((p) => ({ ...p, [n.slot]: e.target.value.replace(/[^0-9]/g, '') }))}
                placeholder="xu" className="w-16 rounded-lg border border-slate-300 px-2 py-1.5 text-right text-base font-bold" />
              <span className="text-xs text-slate-400">xu</span>
            </>)}
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-slate-500">{g
        ? `Mỗi ván xong là xu tự vào ví sự kiện (Nhất 5 · Nhì 3 · còn lại 2). Đủ ${toiDaVan} ván lượt tự kết thúc — không cần ghi, không cần bấm.`
        : 'Game khác: nhập tổng xu cả lượt từng bạn rồi bấm Kết thúc lượt.'}</p>
      <div className="mt-3 flex gap-2">
        {soVan === 0 && <button disabled={ban} onClick={async () => {
          if (!confirm('Huỷ lượt này? Các bạn quay lại "Lượt kế", không ai được xu.')) return
          setBan(true)
          try { await sk.huyLuot(luot.id); toast('Đã huỷ lượt'); onDoi() } catch (e) { toast((e as Error).message, true) } finally { setBan(false) }
        }} className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-600">Huỷ lượt</button>}
        <button disabled={ban} onClick={async () => {
          if (g && !confirm(`Kết thúc lượt khi mới xong ${soVan}/${toiDaVan} ván? Xu các ván đã chơi giữ nguyên.`)) return
          const ketQua = g ? [] : luot.nguoi.map((n) => ({ slot: n.slot, xu: Number(xuSlot(n.slot)) || 0 }))
          setBan(true)
          try {
            const r = await sk.ketThuc(luot.id, ketQua)
            toast(g ? '✓ Đã kết thúc lượt' : `✓ Kết thúc lượt — phát ${r.tong_xu} xu`)
            onDoi()
          } catch (e) { toast((e as Error).message, true) } finally { setBan(false) }
        }} className={g ? 'flex-1 rounded-xl border border-indigo-300 px-4 py-2.5 text-sm font-bold text-indigo-700 disabled:opacity-50'
          : 'flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-base font-bold text-white disabled:opacity-50'}>{g ? '■ Kết thúc sớm' : '■ KẾT THÚC LƯỢT · cộng xu'}</button>
      </div>
    </div>
  )
}

// ─────────────────────────────── CÀI ĐẶT ───────────────────────────────
// ── GIAO VIỆC: tìm nhân sự (gợi ý realtime, không dropdown) → bấm chip việc. Lưu ngay từng lần bấm, vá tại chỗ.
const VAI_CHIP: { k: sk.Vai; t: string }[] = [
  { k: 'checkin', t: '🚪 Check-in' }, { k: 'dangky', t: '📝 Đăng ký game' }, { k: 'quay', t: '🎡 Bàn quay' }, { k: 'quantro', t: '🎮 Quản trò' }, { k: 'quanly', t: '⚙️ Quản lý' },
]
function GiaoViec({ skId, toast }: { skId: string; toast: (t: string, loi?: boolean) => void }) {
  const [rows, setRows] = useState<{ nhan_su_id: string; ho_ten: string; email: string | null; vai: sk.Vai[] }[] | null>(null)
  const [q, setQ] = useState('')
  const [goiY, setGoiY] = useState<{ id: string; ho_ten: string; email: string | null }[]>([])
  const [ban, setBan] = useState<string | null>(null)
  useEffect(() => { setRows(null); sk.phanCongDs(skId).then(setRows).catch((e) => { setRows([]); toast((e as Error).message, true) }) }, [skId]) // eslint-disable-line
  useEffect(() => {
    if (!q.trim()) { setGoiY([]); return }
    const t = setTimeout(() => { sk.timNhanSu(q).then(setGoiY).catch(() => setGoiY([])) }, 200)
    return () => clearTimeout(t)
  }, [q])

  const luu = async (ns: { nhan_su_id: string; ho_ten: string; email: string | null }, vai: sk.Vai[]) => {
    setBan(ns.nhan_su_id)
    try {
      const moi = await sk.phanCongLuu(skId, ns.nhan_su_id, vai)
      setRows((prev) => {
        const list = prev ?? []
        if (!moi.length) return list.filter((r) => r.nhan_su_id !== ns.nhan_su_id)
        return list.some((r) => r.nhan_su_id === ns.nhan_su_id)
          ? list.map((r) => r.nhan_su_id === ns.nhan_su_id ? { ...r, vai: moi } : r)
          : [...list, { ...ns, vai: moi }]
      })
    } catch (e) { toast((e as Error).message, true) } finally { setBan(null) }
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <h3 className="mb-1 font-bold">👥 Giao việc</h3>
      <p className="mb-2 text-xs text-slate-500">Ai chưa được giao sẽ không thấy gì. Giao 1 việc ⇒ người đó vào thẳng màn đó. <b>Quản lý</b> = xem tất cả + cài đặt + giao việc. Bấm chip là lưu ngay.</p>
      <div className="relative">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Gõ tên nhân sự để thêm…" className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 outline-none focus:border-indigo-500" />
        {goiY.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
            {goiY.map((n) => (
              <button key={n.id} onClick={() => {
                setQ(''); setGoiY([])
                if (!(rows ?? []).some((r) => r.nhan_su_id === n.id)) setRows((p) => [...(p ?? []), { nhan_su_id: n.id, ho_ten: n.ho_ten, email: n.email, vai: [] }])
              }} className="block w-full px-3 py-2 text-left text-sm hover:bg-indigo-50">
                <b>{n.ho_ten}</b> <span className="text-xs text-slate-400">{n.email}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="mt-3 space-y-2">
        {rows === null && <div className="text-sm text-slate-400">Đang tải…</div>}
        {rows?.length === 0 && <div className="text-sm text-slate-400">Chưa giao việc cho ai.</div>}
        {rows?.map((r) => (
          <div key={r.nhan_su_id} className={`flex flex-wrap items-center gap-1.5 rounded-lg px-2 py-2 ${r.vai.length ? 'bg-slate-50' : 'bg-amber-50'}`}>
            <span className="min-w-[140px] flex-1 text-sm font-semibold">{r.ho_ten}{!r.vai.length && <span className="ml-1 text-xs font-normal text-amber-700">— chưa có việc</span>}</span>
            {VAI_CHIP.map((c) => {
              const on = r.vai.includes(c.k)
              return (
                <button key={c.k} disabled={ban === r.nhan_su_id} onClick={() => luu(r, on ? r.vai.filter((x) => x !== c.k) : [...r.vai, c.k])}
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold disabled:opacity-50 ${on ? 'bg-indigo-600 text-white' : 'border border-slate-300 text-slate-500'}`}>{c.t}</button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function CaiDatTab({ appRieng, laAdmin, ds, skId, tq, toast, onDoi, onChon }: { appRieng: boolean; laAdmin: boolean; ds: SuKien[]; skId: string; tq: TongQuan | null; toast: (t: string, loi?: boolean) => void; onDoi: () => void; onChon: (id: string) => void }) {
  const s = ds.find((x) => x.id === skId)!
  const [ten, setTen] = useState(s.ten)
  const [ngay, setNgay] = useState(s.ngay)
  const [vq, setVq] = useState(s.cau_hinh.vong_quay.map((x) => ({ xu: String(x.xu), ti_le: String(x.ti_le) })))
  const [toiDa, setToiDa] = useState(String(s.cau_hinh.toi_da_luot ?? 6))
  useEffect(() => {
    setTen(s.ten); setNgay(s.ngay); setVq(s.cau_hinh.vong_quay.map((x) => ({ xu: String(x.xu), ti_le: String(x.ti_le) }))); setToiDa(String(s.cau_hinh.toi_da_luot ?? 6))
  }, [s.id]) // eslint-disable-line
  const base = `${location.origin}${location.pathname}`

  const luu = async (trangThai: 'mo' | 'dong' | null = null) => {
    try {
      await sk.luuSuKien(s.id, ten, ngay, { ...s.cau_hinh, vong_quay: vq.map((x) => ({ xu: Number(x.xu) || 0, ti_le: Number(x.ti_le) || 0 })).filter((x) => x.xu > 0 && x.ti_le > 0), toi_da_luot: Number(toiDa) || 6 }, trangThai)
      toast('Đã lưu'); onDoi()
    } catch (e) { toast((e as Error).message, true) }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4">
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="mb-2 font-bold">📺 Màn TV (mở trên máy nối TV, đăng nhập tài khoản nhân sự)</h3>
        <div className="flex flex-wrap gap-2">
          <a href={`${base}#sk-tv=quay&sk=${s.id}`} target="_blank" rel="noreferrer" className="rounded-xl bg-amber-500 px-4 py-2 font-bold text-white">🎡 TV Vòng quay</a>
          <a href={`${base}#sk-tv=hang&sk=${s.id}`} target="_blank" rel="noreferrer" className="rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white">📋 TV Hàng chờ</a>
        </div>
        <p className="mt-2 text-xs text-slate-500">Mở link → bấm F11 để toàn màn hình.</p>
        {appRieng ? <>
        <h3 className="mb-2 mt-4 font-bold">🔗 Link cho từng vị trí trực (mở thẳng đúng màn)</h3>
        <div className="space-y-1 text-sm">
          {([['checkin', '🚪 Check-in'], ['dangky', '📝 Đăng ký game'], ['quay', '🎡 Bàn quay'], ['quantro', '🎮 Quản trò']] as const).map(([m, t]) => (
            <div key={m} className="flex items-center gap-2">
              <span className="w-44 shrink-0">{t}</span>
              <code className="min-w-0 flex-1 truncate rounded bg-slate-100 px-2 py-1 text-xs">{`${base}#man=${m}`}</code>
              <button onClick={() => { navigator.clipboard?.writeText(`${base}#man=${m}`).then(() => toast('Đã copy link'), () => toast('Không copy được — bôi đen link để copy', true)) }}
                className="shrink-0 rounded-md border border-slate-300 px-2 py-1 text-xs">Copy</button>
            </div>
          ))}
        </div>
        </> : <p className="mt-3 text-xs text-slate-500">Nhân sự trực nên dùng app riêng <b>BK Sự kiện</b> (không có menu ERP) — link từng vị trí nằm ở tab Cài đặt bên đó.</p>}
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="mb-3 font-bold">Sự kiện</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="text-sm">Tên<input value={ten} onChange={(e) => setTen(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5" /></label>
          <label className="text-sm">Ngày<input type="date" value={ngay} onChange={(e) => setNgay(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5" /></label>
          <label className="text-sm">Tối đa người / lượt<input inputMode="numeric" value={toiDa} onChange={(e) => setToiDa(e.target.value.replace(/[^0-9]/g, ''))} className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-1.5" /></label>
        </div>
        <div className="mt-3 text-sm font-semibold">Vòng quay (xu · tỉ lệ %)</div>
        {vq.map((x, i) => (
          <div key={i} className="mt-1 flex items-center gap-2">
            <input value={x.xu} onChange={(e) => setVq((p) => p.map((y, j) => j === i ? { ...y, xu: e.target.value } : y))} className="w-20 rounded-lg border border-slate-300 px-2 py-1" /> xu
            <input value={x.ti_le} onChange={(e) => setVq((p) => p.map((y, j) => j === i ? { ...y, ti_le: e.target.value } : y))} className="w-20 rounded-lg border border-slate-300 px-2 py-1" /> %
            <button onClick={() => setVq((p) => p.filter((_, j) => j !== i))} className="text-xs text-rose-500">bỏ</button>
          </div>
        ))}
        <button onClick={() => setVq((p) => [...p, { xu: '', ti_le: '' }])} className="mt-1 text-xs text-indigo-600">+ thêm ô</button>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={() => luu()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white">Lưu</button>
          <button onClick={() => luu(s.trang_thai === 'mo' ? 'dong' : 'mo')} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">{s.trang_thai === 'mo' ? 'Đóng sự kiện' : 'Mở lại sự kiện'}</button>
          {laAdmin && <button onClick={async () => {
            const t = prompt('Tên sự kiện mới?')
            if (!t?.trim()) return
            try { const id = await sk.luuSuKien(null, t, ngay, null, 'mo'); toast('Đã tạo sự kiện'); onDoi(); onChon(id) } catch (e) { toast((e as Error).message, true) }
          }} className="ml-auto rounded-lg border border-indigo-300 px-3 py-2 text-sm text-indigo-700">+ Sự kiện mới</button>}
        </div>
      </div>

      <GiaoViec skId={skId} toast={toast} />

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="mb-2 font-bold">Phòng chơi</h3>
        {(tq?.phong ?? []).map((p, i) => <PhongRow key={p.id} skId={skId} p={p} thuTu={i + 1} toast={toast} onDoi={onDoi} />)}
        <PhongRow skId={skId} p={null} thuTu={(tq?.phong.length ?? 0) + 1} toast={toast} onDoi={onDoi} />
      </div>
    </div>
  )
}

function PhongRow({ skId, p, thuTu, toast, onDoi }: { skId: string; p: PhongTQ | null; thuTu: number; toast: (t: string, loi?: boolean) => void; onDoi: () => void }) {
  const [ten, setTen] = useState(p?.ten ?? '')
  const [hub, setHub] = useState(p?.ma_hub ?? '')
  const [hang, setHang] = useState(p?.hang_doi ?? true)
  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-2">
      <input value={ten} onChange={(e) => setTen(e.target.value)} placeholder={p ? '' : 'Tên phòng mới…'} className="min-w-0 flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
      <input value={hub} onChange={(e) => setHub(e.target.value)} placeholder="Mã hub iPad (vd BK01)" className="w-40 rounded-lg border border-slate-300 px-2 py-1.5 text-sm" />
      <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={hang} onChange={(e) => setHang(e.target.checked)} /> hàng chờ</label>
      <button disabled={!ten.trim()} onClick={async () => {
        try { await sk.luuPhong(skId, p?.id ?? null, ten, hub, hang, thuTu); toast('Đã lưu phòng'); if (!p) { setTen(''); setHub('') } onDoi() } catch (e) { toast((e as Error).message, true) }
      }} className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40">{p ? 'Lưu' : '+ Thêm'}</button>
    </div>
  )
}
