// ============================================================================
// PHIẾU SỬA BẢN ĐỒ (Thùy 23/11): "Trưởng khối muốn thao tác phải gửi 1 ticket để cho t duyệt - t duyệt thì claude mới chạy".
// Claude trong phiên soạn phiếu (danh sách lệnh + mô tả) → máy chạy thử lúc gửi → Thùy xem ở đây: Chạy thử lại · Duyệt & chạy · Trả lại.
// Mọi kiểm / chạy ở DB (fn_phien_phieu_*); màn chỉ hiển thị + bấm. Sau khi bấm: vá đúng phiếu đó tại chỗ (CLAUDE §2 React).
// ============================================================================
import { useEffect, useState } from 'react'
import { listPhieu, thuPhieu, duyetPhieu, type Phieu, type PhieuThu, type PhieuThayDoi, type PhieuTrangThai } from '../../lib/phien'

const TT: Record<PhieuTrangThai, { ten: string; cls: string }> = {
  cho_duyet: { ten: 'Chờ duyệt', cls: 'bg-amber-100 text-amber-800' },
  tra_lai: { ten: 'Đã trả lại', cls: 'bg-slate-200 text-slate-700' },
  da_chay: { ten: 'Đã chạy', cls: 'bg-emerald-100 text-emerald-800' },
  loi: { ten: 'Chạy lỗi', cls: 'bg-red-100 text-red-700' },
  huy: { ten: 'Đã huỷ', cls: 'bg-slate-100 text-slate-500' },
}
const LOAI: Record<string, string> = { chu_de: 'chủ đề', chuyen_de: 'chuyên đề', o: 'chuyên đề trong chủ đề', nhom: 'nhóm', dang_bai: 'dạng bài' }
const HD: Record<string, string> = { INSERT: 'Thêm', UPDATE: 'Sửa', DELETE: 'Xoá', insert: 'Thêm', update: 'Sửa', delete: 'Xoá' }
const O_SO = ['ten', 'mo_ta', 'ly_thuyet', 'vi_du', 'nhom_id', 'chu_de_id', 'chuyen_de_id', 'thu_tu', 'muc_do']

const gio = (s: string | null) => {
  if (!s) return ''
  const d = new Date(s)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} ${d.getDate()}/${d.getMonth() + 1}`
}
const ngan = (v: unknown) => { const s = typeof v === 'string' ? v : JSON.stringify(v ?? ''); return s.length > 80 ? s.slice(0, 80) + '…' : s }

function DongThayDoi({ t }: { t: PhieuThayDoi }) {
  const hd = HD[t.hanh_dong] ?? t.hanh_dong
  const ten = String((t.moi ?? t.cu)?.ten ?? (t.moi ?? t.cu)?.id ?? '')
  const doi = t.cu && t.moi ? O_SO.filter((k) => JSON.stringify(t.cu?.[k] ?? null) !== JSON.stringify(t.moi?.[k] ?? null)) : []
  const mau = hd === 'Xoá' ? 'text-red-700' : hd === 'Thêm' ? 'text-emerald-700' : 'text-slate-700'
  return (
    <li className="text-[12px]">
      <span className={`font-semibold ${mau}`}>{hd}</span> {LOAI[t.loai] ?? t.loai} <b>{ten}</b>
      {doi.length > 0 && (
        <span className="text-slate-500"> — {doi.map((k) => k === 'ten'
          ? `tên: "${ngan(t.cu?.ten)}" → "${ngan(t.moi?.ten)}"`
          : ['mo_ta', 'ly_thuyet', 'vi_du'].includes(k) ? `${k.replace('_', ' ')} (sửa nội dung)` : `${k}: ${ngan(t.cu?.[k])} → ${ngan(t.moi?.[k])}`).join(' · ')}</span>
      )}
    </li>
  )
}

function ThePhieu({ p, laNguoiDuyet, onVa }: { p: Phieu; laNguoiDuyet: boolean; onVa: (id: number, patch: Partial<Phieu>) => void }) {
  const [thu, setThu] = useState<PhieuThu>(p.thu)
  const [moTd, setMoTd] = useState(false)
  const [dang, setDang] = useState<string | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [traLai, setTraLai] = useState<string | null>(null)
  const td = thu?.thay_doi ?? []

  async function lam(viec: string, f: () => Promise<void>) {
    setDang(viec); setLoi(null)
    try { await f() } catch (e: any) { setLoi(e.message ?? String(e)) } finally { setDang(null) }
  }
  const chayThu = () => lam('thu', async () => { setThu(await thuPhieu(p.id)); setMoTd(true) })
  const duyet = () => lam('duyet', async () => {
    if (!confirm(`Duyệt và CHẠY phiếu #${p.id} (${p.lenh.length} lệnh) vào bản đồ ${p.mon} ${p.khoi}?`)) return
    const r = await duyetPhieu(p.id, true)
    onVa(p.id, { trang_thai: r.trang_thai, ghi_chu_duyet: r.loi ?? null, duyet_at: new Date().toISOString() })
    if (!r.ok) setLoi(`Chạy lỗi — không lệnh nào được ghi: ${r.loi}`)
  })
  const guiTraLai = () => lam('tra', async () => {
    const r = await duyetPhieu(p.id, false, traLai ?? '')
    onVa(p.id, { trang_thai: r.trang_thai, ghi_chu_duyet: traLai, duyet_at: new Date().toISOString() }); setTraLai(null)
  })

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center gap-2 bg-indigo-600 px-4 py-2 text-white">
        <span className="text-[13px] font-semibold">#{p.id} · {p.tieu_de}</span>
        <span className="text-[11.5px] opacity-80">{p.mon} {p.khoi} · {p.ten_gui ?? '?'} · {gio(p.created_at)}</span>
        <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold ${TT[p.trang_thai].cls}`}>{TT[p.trang_thai].ten}</span>
      </div>
      <div className="space-y-2 px-4 py-3">
        {p.ly_do && <p className="text-[12.5px] text-slate-600"><b>Vì sao:</b> {p.ly_do}</p>}
        <ol className="list-decimal space-y-0.5 pl-5 text-[12.5px] text-slate-800">
          {p.lenh.map((l, i) => (
            <li key={i} className={/^xoa|_xoa/.test(l.viec ?? l.ham_hinh ?? '') ? 'text-red-700' : ''}>{l.mo_ta}</li>
          ))}
        </ol>
        <div>
          <button onClick={() => setMoTd((x) => !x)} className="text-[12px] text-indigo-700 hover:underline">
            {moTd ? '▾' : '▸'} Bản đồ thay đổi khi chạy thử ({td.length}){thu?.luc ? ` · thử lúc ${gio(thu.luc)}` : ''}
          </button>
          {thu && !thu.ok && <p className="mt-1 text-[12px] text-red-600">Chạy thử lỗi: {thu.loi}</p>}
          {moTd && (td.length
            ? <ul className="mt-1 max-h-72 space-y-0.5 overflow-auto rounded-lg bg-slate-50 px-3 py-2">{td.map((t, i) => <DongThayDoi key={i} t={t} />)}</ul>
            : <p className="mt-1 text-[12px] text-slate-400">Không có thay đổi cây Đại / Giải tích / KHTN (lệnh Hình chỉ hiện ở kết quả từng lệnh).</p>)}
        </div>
        {p.ghi_chu_duyet && p.trang_thai !== 'cho_duyet' && (
          <p className={`text-[12px] ${p.trang_thai === 'loi' ? 'text-red-600' : 'text-slate-600'}`}>
            {p.trang_thai === 'tra_lai' ? 'Lý do trả lại' : 'Lỗi'}: {p.ghi_chu_duyet}
          </p>
        )}
        {p.ten_duyet && p.trang_thai !== 'cho_duyet' && <p className="text-[11px] text-slate-400">{p.ten_duyet} · {gio(p.duyet_at)}</p>}
        {loi && <p className="text-[12px] text-red-600">{loi}</p>}
        {laNguoiDuyet && p.trang_thai === 'cho_duyet' && (
          traLai == null ? (
            <div className="flex flex-wrap gap-2 pt-1">
              <button onClick={duyet} disabled={!!dang} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[12.5px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                {dang === 'duyet' ? 'Đang chạy…' : '✓ Duyệt & chạy'}</button>
              <button onClick={chayThu} disabled={!!dang} className="rounded-lg bg-slate-100 px-3 py-1.5 text-[12.5px] text-slate-700 hover:bg-slate-200 disabled:opacity-50">
                {dang === 'thu' ? 'Đang thử…' : '↻ Chạy thử lại'}</button>
              <button onClick={() => setTraLai('')} disabled={!!dang} className="rounded-lg bg-slate-100 px-3 py-1.5 text-[12.5px] text-slate-700 hover:bg-slate-200 disabled:opacity-50">↩ Trả lại</button>
            </div>
          ) : (
            <div className="space-y-1.5 pt-1">
              <textarea value={traLai} onChange={(e) => setTraLai(e.target.value)} rows={2} placeholder="Lý do trả lại (bắt buộc) — gửi về phiên cho trưởng khối và Claude"
                className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-[12.5px]" />
              <div className="flex gap-2">
                <button onClick={guiTraLai} disabled={!!dang || !traLai.trim()} className="rounded-lg bg-slate-800 px-3 py-1.5 text-[12.5px] font-semibold text-white disabled:opacity-50">Gửi trả lại</button>
                <button onClick={() => setTraLai(null)} className="rounded-lg bg-slate-100 px-3 py-1.5 text-[12.5px] text-slate-600">Thôi</button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default function PhieuBanDo({ onSoCho }: { onSoCho?: (n: number) => void }) {
  const [ds, setDs] = useState<Phieu[] | null>(null)
  const [laNguoiDuyet, setLaNguoiDuyet] = useState(false)
  const [loc, setLoc] = useState<'cho' | 'tat_ca'>('cho')
  const [loi, setLoi] = useState<string | null>(null)

  async function tai() {
    try { const r = await listPhieu(false, 100); setDs(r.ds); setLaNguoiDuyet(r.la_nguoi_duyet); onSoCho?.(r.so_cho); setLoi(null) }
    catch (e: any) { setLoi(e.message ?? String(e)) }
  }
  useEffect(() => { tai() }, [])   // eslint-disable-line react-hooks/exhaustive-deps

  const va = (id: number, patch: Partial<Phieu>) => setDs((prev) => {
    const moi = prev?.map((p) => p.id === id ? { ...p, ...patch } : p) ?? prev
    onSoCho?.((moi ?? []).filter((p) => p.trang_thai === 'cho_duyet').length)
    return moi
  })
  const hien = (ds ?? []).filter((p) => loc === 'tat_ca' || p.trang_thai === 'cho_duyet')

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-[15px] font-semibold text-slate-800">📋 Phiếu sửa bản đồ</h3>
        <span className="text-[12px] text-slate-400">{laNguoiDuyet ? 'Thùy duyệt thì máy mới chạy — đúng các lệnh trong phiếu, một lệnh lỗi thì không ghi gì.' : 'Phiếu bạn gửi qua phiên Claude — chờ Thùy duyệt.'}</span>
        <div className="ml-auto flex gap-1 text-[12px]">
          {([['cho', 'Chờ duyệt'], ['tat_ca', 'Tất cả']] as const).map(([k, t]) => (
            <button key={k} onClick={() => setLoc(k)} className={`rounded-full px-2.5 py-0.5 ${loc === k ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}>{t}</button>
          ))}
          <button onClick={tai} title="Quét lại" className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600 hover:bg-slate-200">↻</button>
        </div>
      </div>
      {loi && <p className="text-[12px] text-red-600">{loi}</p>}
      {ds == null && <p className="py-6 text-center text-[12.5px] text-slate-400">Đang tải…</p>}
      {ds != null && hien.length === 0 && <p className="py-6 text-center text-[12.5px] text-slate-400">{loc === 'cho' ? 'Không có phiếu nào chờ duyệt.' : 'Chưa có phiếu nào.'}</p>}
      {hien.map((p) => <ThePhieu key={p.id} p={p} laNguoiDuyet={laNguoiDuyet} onVa={va} />)}
    </div>
  )
}
