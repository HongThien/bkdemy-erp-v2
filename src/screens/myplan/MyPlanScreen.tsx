// MÀN "KẾ HOẠCH CỦA TÔI" (MyPlan — Thùy 16/10). Chỉ mình thấy, mọi nhân sự đều có. Khuôn GTD + Personal Kanban:
//   💡 Ý tưởng · để sau → 📌 Sẽ làm → 🔨 Đang làm → ✅ Đã xong (nhật ký theo tuần). Kéo thẻ giữa các cột / đổi thứ tự trong cột.
// Ghi nhanh ở đầu màn (Enter là lưu). Thẻ có hạn được nhắc vào Hòm thư (trước 1 ngày + quá hạn — DB `_plan_nhac_han`).
// Thẻ giao đi được: thành task cho cấp dưới / thành order cho bất kỳ ai (RPC dùng lại fn_task_giao / fn_order_tao).
// Không xoá cứng: "Bỏ" ⇒ mục "Đã bỏ" ở cuối màn, khôi phục được. Mọi sửa đổi VÁ TẠI CHỖ (CLAUDE.md §2), không tải lại cả màn.
// Màn TRONG (màn làm việc) ⇒ nền sáng của ERP, không theo tranh style.
import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../../store/useStore'
import { homNayVN, congNgay, ddmmVN, ngayCuaTs, tuanCuaNgay, nhanTuan } from '../../lib/tuan'
import { listNhanSu } from '../../lib/nhansu'
import { listCapDuoi } from '../../lib/taskPt'
import SearchSelect, { type Opt } from '../../components/SearchSelect'
import {
  COT_PLAN, listPlan, listPlanBo, themThePlan, suaThePlan, giaoTaskTuThe, datOrderTuThe, docThePlan, nhanChuyenThanh,
  type ThePlan, type TrangThaiPlan,
} from '../../lib/myPlan'

type CotMo = Exclude<TrangThaiPlan, 'bo'>
// Rời màn rồi quay lại = thấy ngay danh sách cũ (refetch nền, không trắng màn) — sống tới F5.
const NHO: { rows: ThePlan[] | null } = { rows: null }

const sapCot = (rows: ThePlan[], cot: CotMo) => {
  const ds = rows.filter((r) => r.trang_thai === cot)
  return cot === 'xong'
    ? ds.sort((a, b) => (b.xong_at ?? '').localeCompare(a.xong_at ?? ''))
    : ds.sort((a, b) => a.thu_tu - b.thu_tu || a.created_at.localeCompare(b.created_at))
}

function ChipHan({ han, xong }: { han: string | null; xong: boolean }) {
  if (!han) return null
  const hom = homNayVN()
  const tone = xong ? 'bg-slate-100 text-slate-500'
    : han < hom ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200'
    : han <= congNgay(hom, 1) ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
    : 'bg-slate-100 text-slate-600'
  const chu = xong ? `hạn ${ddmmVN(han)}` : han < hom ? `⚠ quá hạn ${ddmmVN(han)}` : han === hom ? '⏰ hôm nay' : han === congNgay(hom, 1) ? '⏳ mai' : `🗓 ${ddmmVN(han)}`
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${tone}`}>{chu}</span>
}

// Khung giao thẻ đi (task cho cấp dưới / order cho bất kỳ ai) — mở ngay trong thẻ.
function GiaoDi({ kieu, onGiao, onHuy }: { kieu: 'task' | 'order'; onGiao: (nguoi: string, han: string | null) => Promise<void>; onHuy: () => void }) {
  const meId = useStore((s) => s.me?.nhanSu.id)
  const [opts, setOpts] = useState<Opt[] | null>(null)
  const [nguoi, setNguoi] = useState<string | null>(null)
  const [han, setHan] = useState<string>(kieu === 'task' ? congNgay(homNayVN(), 7) : '')
  const [dang, setDang] = useState(false)
  useEffect(() => {
    const p = kieu === 'task'
      ? listCapDuoi().then((ds) => ds.map((d) => ({ id: d.nhan_su_id, label: d.ho_ten })))
      : listNhanSu().then((ns) => ns.filter((n) => n.trang_thai === 'dang_lam' && n.id !== meId).map((n) => ({ id: n.id, label: n.ho_ten, img: n.anh_url })))
    p.then(setOpts).catch(() => setOpts([]))
  }, [kieu, meId])
  const thieu = !nguoi || (kieu === 'task' && !han)
  return (
    <div className="mt-2 space-y-2 rounded-lg border border-indigo-200 bg-indigo-50/60 p-2" onClick={(e) => e.stopPropagation()}>
      <div className="text-[12px] font-semibold text-indigo-700">{kieu === 'task' ? '↗ Giao thành task (cho cấp dưới)' : '↗ Đặt thành order'}</div>
      {opts === null ? <p className="text-[12px] text-slate-500">Đang tải danh sách…</p>
        : kieu === 'task' && opts.length === 0 ? <p className="text-[12px] text-slate-500">Bạn chưa có cấp dưới trong sơ đồ tổ chức — với đồng cấp / cấp trên hãy đặt order.</p>
        : <SearchSelect value={nguoi} onChange={setNguoi} options={opts} avatars placeholder={kieu === 'task' ? 'Giao cho… (gõ tên)' : 'Đặt order cho… (gõ tên)'} allowClear={false} />}
      <label className="flex items-center gap-2 text-[12px] text-slate-600">Hạn{kieu === 'order' ? ' (tuỳ chọn)' : ''}
        <input type="date" value={han} onChange={(e) => setHan(e.target.value)} className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[12px]" />
      </label>
      <div className="flex justify-end gap-2">
        <button onClick={onHuy} className="rounded px-2.5 py-1 text-[12px] font-semibold text-slate-500 hover:bg-white">Huỷ</button>
        <button disabled={thieu || dang} onClick={async () => { setDang(true); try { await onGiao(nguoi!, han || null) } finally { setDang(false) } }}
          className="rounded bg-indigo-600 px-3 py-1 text-[12px] font-semibold text-white disabled:opacity-40">{dang ? 'Đang gửi…' : kieu === 'task' ? 'Giao task' : 'Đặt order'}</button>
      </div>
    </div>
  )
}

function TheCard({ t, keo, onKeo, onTha, onSua, onGiao }: {
  t: ThePlan; keo: boolean
  onKeo: (id: string | null) => void; onTha: () => void
  onSua: (p: Partial<ThePlan>) => void
  onGiao: (kieu: 'task' | 'order', nguoi: string, han: string | null) => Promise<void>
}) {
  const [sua, setSua] = useState(false)
  const [nd, setNd] = useState(t.noi_dung)
  const [gc, setGc] = useState(t.ghi_chu ?? '')
  const [han, setHan] = useState(t.han ?? '')
  const [giao, setGiao] = useState<'task' | 'order' | null>(null)
  const [menu, setMenu] = useState(false)
  const xong = t.trang_thai === 'xong'
  const daGiao = nhanChuyenThanh(t.chuyen_thanh)
  const i = COT_PLAN.findIndex((c) => c.id === t.trang_thai)
  const luu = () => {
    const noi = nd.trim()
    if (!noi) return
    onSua({ noi_dung: noi, ghi_chu: gc.trim() || null, han: han || null })
    setSua(false)
  }
  if (sua) return (
    <div className="space-y-1.5 rounded-xl border border-indigo-300 bg-white p-2.5 shadow-sm">
      <textarea value={nd} onChange={(e) => setNd(e.target.value)} rows={2} maxLength={500} autoFocus
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); luu() } if (e.key === 'Escape') setSua(false) }}
        className="w-full resize-none rounded border border-slate-300 px-2 py-1 text-[13px] outline-none focus:border-indigo-400" />
      <textarea value={gc} onChange={(e) => setGc(e.target.value)} rows={2} maxLength={4000} placeholder="Ghi chú (tuỳ chọn)"
        className="w-full resize-none rounded border border-slate-200 px-2 py-1 text-[12px] text-slate-600 outline-none focus:border-indigo-400" />
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-1.5 text-[12px] text-slate-500">Hạn
          <input type="date" value={han} onChange={(e) => setHan(e.target.value)} className="rounded border border-slate-300 px-1.5 py-0.5 text-[12px]" />
        </label>
        {han && <button onClick={() => setHan('')} className="text-[11px] text-slate-400 hover:text-rose-500">bỏ hạn</button>}
        <button onClick={() => setSua(false)} className="ml-auto rounded px-2 py-1 text-[12px] font-semibold text-slate-500 hover:bg-slate-100">Huỷ</button>
        <button onClick={luu} disabled={!nd.trim()} className="rounded bg-indigo-600 px-3 py-1 text-[12px] font-semibold text-white disabled:opacity-40">Lưu</button>
      </div>
    </div>
  )
  return (
    <div draggable={!giao} onDragStart={(e) => { e.dataTransfer.setData('text/plain', t.id); e.dataTransfer.effectAllowed = 'move'; onKeo(t.id) }}
      onDragEnd={() => onKeo(null)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); e.stopPropagation(); onTha() }}
      className={`group relative cursor-grab rounded-xl border bg-white p-2.5 shadow-sm transition hover:shadow-md active:cursor-grabbing ${keo ? 'opacity-40' : ''} ${xong ? 'border-emerald-100' : 'border-slate-200'}`}>
      <button onClick={() => setSua(true)} title="Bấm để sửa" className="block w-full text-left">
        <span className={`block whitespace-pre-wrap break-words text-[13.5px] font-medium leading-snug ${xong ? 'text-slate-500' : 'text-slate-800'}`}>{t.noi_dung}</span>
        {t.ghi_chu && <span className="mt-0.5 line-clamp-2 block whitespace-pre-wrap text-[12px] text-slate-500">{t.ghi_chu}</span>}
      </button>
      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
        <ChipHan han={t.han} xong={xong} />
        {daGiao && <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-600">{daGiao}</span>}
        {xong && t.xong_at && <span className="text-[11px] text-slate-400">xong {ddmmVN(ngayCuaTs(Date.parse(t.xong_at)))}</span>}
        <span className="ml-auto flex items-center gap-0.5 opacity-60 group-hover:opacity-100">
          {i > 0 && <button onClick={() => onSua({ trang_thai: COT_PLAN[i - 1].id })} title={`Về "${COT_PLAN[i - 1].ten}"`} className="rounded px-1.5 text-[14px] text-slate-500 hover:bg-slate-100">‹</button>}
          {i < COT_PLAN.length - 1 && <button onClick={() => onSua({ trang_thai: COT_PLAN[i + 1].id })} title={`Sang "${COT_PLAN[i + 1].ten}"`} className="rounded px-1.5 text-[14px] text-slate-500 hover:bg-slate-100">›</button>}
          {!xong && <button onClick={() => onSua({ trang_thai: 'xong' })} title="Đánh dấu đã xong" className="rounded px-1.5 text-[13px] font-bold text-emerald-600 hover:bg-emerald-50">✓</button>}
          <button onClick={() => setMenu(!menu)} title="Thêm" className="rounded px-1.5 text-[14px] text-slate-500 hover:bg-slate-100">⋯</button>
        </span>
      </div>
      {menu && (
        <div className="absolute right-2 top-full z-20 mt-1 w-48 rounded-lg border border-slate-200 bg-white p-1 text-[12.5px] shadow-xl" onMouseLeave={() => setMenu(false)}>
          <button onClick={() => { setMenu(false); setSua(true) }} className="block w-full rounded px-2 py-1.5 text-left hover:bg-slate-100">✎ Sửa · đặt hạn</button>
          {!t.chuyen_thanh && <button onClick={() => { setMenu(false); setGiao('task') }} className="block w-full rounded px-2 py-1.5 text-left hover:bg-slate-100">↗ Giao thành task</button>}
          {!t.chuyen_thanh && <button onClick={() => { setMenu(false); setGiao('order') }} className="block w-full rounded px-2 py-1.5 text-left hover:bg-slate-100">↗ Đặt thành order</button>}
          <button onClick={() => { setMenu(false); onSua({ trang_thai: 'bo' }) }} className="block w-full rounded px-2 py-1.5 text-left text-rose-600 hover:bg-rose-50">🗑 Bỏ thẻ (khôi phục được)</button>
        </div>
      )}
      {giao && <GiaoDi kieu={giao} onHuy={() => setGiao(null)} onGiao={async (n, h) => { await onGiao(giao, n, h); setGiao(null) }} />}
    </div>
  )
}

export default function MyPlanScreen() {
  const me = useStore((s) => s.me)
  const [rows, setRows] = useState<ThePlan[] | null>(NHO.rows)
  const [loi, setLoi] = useState<string | null>(null)
  const [moi, setMoi] = useState('')
  const [cotMoi, setCotMoi] = useState<CotMo>('y_tuong')
  const [hanMoi, setHanMoi] = useState('')
  const [keo, setKeo] = useState<string | null>(null)
  const [soXong, setSoXong] = useState(40)
  const [bo, setBo] = useState<ThePlan[] | null>(null)
  const oNhap = useRef<HTMLInputElement>(null)

  useEffect(() => { NHO.rows = rows }, [rows])
  useEffect(() => {
    // có bản nhớ thì hiện ngay, tải nền để cập nhật (không xoá list đang thấy)
    listPlan().then(setRows).catch((e) => { setLoi(e?.message ?? String(e)); setRows((r) => r ?? []) })
  }, [])

  const cot = useMemo(() => Object.fromEntries(COT_PLAN.map((c) => [c.id, sapCot(rows ?? [], c.id)])) as Record<CotMo, ThePlan[]>, [rows])

  if (!me) return <section className="p-8 text-sm text-slate-500">Tài khoản chưa gắn hồ sơ nhân sự nên chưa có Kế hoạch của tôi.</section>

  const va = (t: ThePlan) => setRows((c) => (c ?? []).filter((x) => x.id !== t.id || t.trang_thai !== 'bo').map((x) => (x.id === t.id ? t : x)))
  // Sửa lạc quan: vá ngay → DB ghi → thay bằng dòng DB trả về (xong_at do trigger); lỗi thì trả lại như cũ.
  const sua = (t: ThePlan, p: Partial<ThePlan>) => {
    const cu = rows
    const moiT = { ...t, ...p } as ThePlan
    if (p.trang_thai === 'bo') setRows((c) => (c ?? []).filter((x) => x.id !== t.id))
    else va(moiT)
    suaThePlan(t.id, p).then((r) => { if (r.trang_thai !== 'bo') va(r) }).catch((e) => { setRows(cu); alert(`Chưa lưu được: ${e?.message ?? e}`) })
  }
  const them = async () => {
    const nd = moi.trim()
    if (!nd) return
    setMoi('')
    const dau = cot[cotMoi][0]
    try {
      const t = await themThePlan(nd, cotMoi, dau ? dau.thu_tu - 1 : 0, hanMoi || null)
      setRows((c) => [...(c ?? []), t])
      setHanMoi('')
      oNhap.current?.focus()
    } catch (e: any) { setMoi(nd); alert(`Chưa thêm được: ${e?.message ?? e}`) }
  }
  // Thả thẻ đang kéo vào cột `den`, ngay TRƯỚC thẻ `truoc` (null = cuối cột). Thứ tự mới = trung bình 2 thẻ kề.
  const tha = (den: CotMo, truoc: string | null) => {
    const t = (rows ?? []).find((x) => x.id === keo)
    setKeo(null)
    if (!t || t.id === truoc) return
    if (den === 'xong') { if (t.trang_thai !== 'xong') sua(t, { trang_thai: 'xong' }); return }
    const ds = cot[den].filter((x) => x.id !== t.id)
    const j = truoc ? ds.findIndex((x) => x.id === truoc) : -1
    const thu = j < 0 ? (ds.length ? ds[ds.length - 1].thu_tu + 1 : 0) : j === 0 ? ds[0].thu_tu - 1 : (ds[j - 1].thu_tu + ds[j].thu_tu) / 2
    sua(t, { trang_thai: den, thu_tu: thu })
  }
  const giao = async (t: ThePlan, kieu: 'task' | 'order', nguoi: string, han: string | null) => {
    try {
      if (kieu === 'task') await giaoTaskTuThe(t.id, nguoi, han!)
      else await datOrderTuThe(t.id, nguoi, han)
      va(await docThePlan(t.id))
    } catch (e: any) { alert(`Chưa giao được: ${e?.message ?? e}`); throw e }
  }
  const moBo = () => { if (bo) { setBo(null); return } listPlanBo().then(setBo).catch((e) => alert(`Chưa tải được: ${e?.message ?? e}`)) }
  const khoiPhuc = (t: ThePlan) => {
    setBo((c) => (c ?? []).filter((x) => x.id !== t.id))
    suaThePlan(t.id, { trang_thai: 'y_tuong' }).then((r) => setRows((c) => [...(c ?? []), r])).catch((e) => alert(`Chưa khôi phục được: ${e?.message ?? e}`))
  }

  // Cột Đã xong: gom theo tuần (giờ VN) — "nhật ký những gì đã làm".
  const tuanNay = tuanCuaNgay(homNayVN())
  const tenTuan = (tu: number) => (tu === tuanNay ? 'Tuần này' : tu === tuanNay - 1 ? 'Tuần trước' : nhanTuan(tu))
  const xongHien = cot.xong.slice(0, soXong)

  return (
    <section className="min-h-0 overflow-auto bg-[#f5f5f7] p-4 md:p-6">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-3 flex flex-wrap items-end gap-x-4 gap-y-1">
          <h2 className="text-[22px] font-semibold text-slate-800">🗂 Kế hoạch của tôi</h2>
          <p className="text-[12.5px] text-slate-500">🔒 Chỉ mình bạn thấy · thẻ có hạn được nhắc vào Hòm thư (trước 1 ngày và khi quá hạn)</p>
        </div>

        {/* GHI NHANH — gõ rồi Enter, phân loại sau */}
        <form onSubmit={(e) => { e.preventDefault(); them() }} className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          <input ref={oNhap} value={moi} onChange={(e) => setMoi(e.target.value)} maxLength={500} placeholder="Ghi nhanh việc / ý tưởng… rồi Enter"
            className="min-w-[240px] flex-1 rounded-lg border border-transparent bg-slate-50 px-3 py-2 text-[14px] outline-none focus:border-indigo-300 focus:bg-white" />
          <div className="inline-flex rounded-full bg-slate-100 p-0.5">
            {COT_PLAN.filter((c) => c.id !== 'xong').map((c) => (
              <button type="button" key={c.id} onClick={() => setCotMoi(c.id)}
                className={`rounded-full px-3 py-1 text-[12.5px] font-semibold ${cotMoi === c.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>{c.icon} {c.ten.split(' · ')[0]}</button>
            ))}
          </div>
          <input type="date" value={hanMoi} onChange={(e) => setHanMoi(e.target.value)} title="Hạn (tuỳ chọn)" className="rounded-lg border border-slate-200 px-2 py-1.5 text-[12.5px] text-slate-600" />
          <button type="submit" disabled={!moi.trim()} className="rounded-lg bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-40">Thêm</button>
        </form>

        {loi && <p className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-[12.5px] text-rose-600">Chưa tải được kế hoạch ({loi}).</p>}
        {rows === null ? <p className="text-sm text-slate-400">Đang tải…</p> : (
          <div className="grid items-start gap-3 md:grid-cols-2 xl:grid-cols-4">
            {COT_PLAN.map((c) => (
              <div key={c.id} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); tha(c.id, null) }}
                className={`flex min-h-[220px] flex-col rounded-2xl border p-2.5 transition ${keo ? 'border-dashed border-indigo-300 bg-indigo-50/40' : 'border-slate-200/70 bg-slate-100/70'}`}>
                <div className="mb-2 flex items-baseline gap-2 px-1">
                  <h3 className="text-[14px] font-semibold text-slate-700">{c.icon} {c.ten}</h3>
                  <span className="text-[12px] font-semibold text-slate-400">{cot[c.id].length}{c.id === 'xong' && cot.xong.length >= 300 ? '+' : ''}</span>
                </div>
                {cot[c.id].length === 0 && <p className="px-1 py-3 text-[12px] text-slate-400">{c.goiY}</p>}
                <div className="space-y-2">
                  {(c.id === 'xong' ? xongHien : cot[c.id]).map((t, k, ds) => {
                    const tu = c.id === 'xong' && t.xong_at ? tuanCuaNgay(ngayCuaTs(Date.parse(t.xong_at))) : null
                    const tuTruoc = c.id === 'xong' && k > 0 && ds[k - 1].xong_at ? tuanCuaNgay(ngayCuaTs(Date.parse(ds[k - 1].xong_at!))) : null
                    return (
                      <div key={t.id}>
                        {tu !== null && tu !== tuTruoc && <div className="mb-1 mt-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400 first:mt-0">{tenTuan(tu)}</div>}
                        <TheCard t={t} keo={keo === t.id} onKeo={setKeo} onTha={() => tha(c.id, t.id)}
                          onSua={(p) => sua(t, p)} onGiao={(kieu, n, h) => giao(t, kieu, n, h)} />
                      </div>
                    )
                  })}
                </div>
                {c.id === 'xong' && cot.xong.length > soXong && (
                  <button onClick={() => setSoXong((n) => n + 40)} className="mt-2 rounded-lg border border-slate-200 bg-white py-1.5 text-[12px] font-semibold text-slate-600 hover:border-indigo-300">Xem thêm ({cot.xong.length - soXong})</button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <button onClick={moBo} className="text-[12.5px] font-semibold text-slate-500 hover:text-slate-700">{bo ? '▾' : '▸'} 🗑 Thẻ đã bỏ</button>
          {bo && (bo.length === 0 ? <p className="mt-2 text-[12px] text-slate-400">Chưa bỏ thẻ nào.</p> : (
            <ul className="mt-2 grid gap-1.5 md:grid-cols-2 xl:grid-cols-3">
              {bo.map((t) => (
                <li key={t.id} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12.5px] text-slate-500">
                  <span className="min-w-0 flex-1 truncate line-through">{t.noi_dung}</span>
                  <button onClick={() => khoiPhuc(t)} className="shrink-0 rounded px-2 py-0.5 font-semibold text-indigo-600 hover:bg-indigo-50">Khôi phục</button>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
