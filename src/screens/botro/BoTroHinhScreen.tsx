// Bổ trợ › Hình (Thùy 17/10): loại bổ trợ thứ 4, ĐỘC LẬP với Yếu Đại. "Case" = hồ sơ bổ trợ Hình của 1 em.
// Chưa có bản đồ Hình ⇒ không dạng/đo/đề xuất: Trang/Lộc TỰ MỞ case (lý do + mức L1–L3 + ưu tiên); xếp lịch ở Lịch phòng (chung ca trực,
// tab Hình); tài liệu gắn theo BUỔI ở đây; người dạy hoàn tất ca ở app TA (chỉ nhận xét). Mọi số ở DB (fn_bthinh_*).
// Mutation vá tại chỗ, không reload list (CLAUDE.md §2); nhớ tab + list khi rời màn.
import { useEffect, useRef, useState } from 'react'
import { danhSachHinh, moCaHinh, doiCaHinh, dongCaHinh, lichSuCaHinh, taiLieuCuaBuoi, ganTaiLieu, timTaiLieu,
  UU_TIEN_HINH_TEN, MUC_HINH_TEN, KET_QUA_HINH_TEN, type CaseHinh, type DanhSachHinh, type UuTienHinh, type TaiLieuHinh, type LogHinh } from '../../lib/botro_hinh'
import { timHocSinhBT } from '../../lib/bt'
import { ddmmVN } from '../../lib/tuan'

type Tab = 'can_xep' | 'da_xep' | 'hoan_thanh'
const TAB_TEN: Record<Tab, string> = { can_xep: 'Cần xếp', da_xep: 'Đã xếp', hoan_thanh: 'Hoàn thành' }
const NHO: { tab: Tab; dang: DanhSachHinh | null; xong: DanhSachHinh | null } = { tab: 'can_xep', dang: null, xong: null }
const hhmm = (t: string | null | undefined) => (t ? String(t).slice(0, 5) : '')
const UU_CLS: Record<UuTienHinh, string> = { 3: 'bg-rose-600 text-white', 2: 'bg-slate-100 text-slate-600', 1: 'bg-slate-50 text-slate-400' }
const MUC_CLS: Record<number, string> = { 1: 'bg-slate-100 text-slate-600', 2: 'bg-amber-50 text-amber-700', 3: 'bg-rose-50 text-rose-700' }

export default function BoTroHinhScreen() {
  const [tab, setTabState] = useState<Tab>(NHO.tab)
  const [dang, setDang] = useState<DanhSachHinh | null>(NHO.dang)
  const [xong, setXong] = useState<DanhSachHinh | null>(NHO.xong)
  const [loi, setLoi] = useState<string | null>(null)
  const [moForm, setMoForm] = useState(false)
  const [tlCase, setTlCase] = useState<CaseHinh | null>(null)
  const [lsCase, setLsCase] = useState<CaseHinh | null>(null)
  const setTab = (t: Tab) => { NHO.tab = t; setTabState(t) }
  const tai = () => {
    setLoi(null)
    danhSachHinh('dang_xu').then((d) => { NHO.dang = d; setDang(d) }).catch((e) => setLoi(e?.message ?? String(e)))
    danhSachHinh('hoan_thanh').then((d) => { NHO.xong = d; setXong(d) }).catch(() => {})
  }
  useEffect(() => { if (!NHO.dang) tai() }, [])

  // vá tại chỗ một case trong list đang xem
  const va = (id: string, fn: (c: CaseHinh) => CaseHinh) => setDang((d) => { if (!d) return d; const n = { ...d, ds: d.ds.map((c) => c.id === id ? fn(c) : c) }; NHO.dang = n; return n })
  const nhanCaMoi = () => { danhSachHinh('dang_xu').then((d) => { NHO.dang = d; setDang(d) }).catch((e) => setLoi(e?.message ?? String(e))) } // refetch NỀN, không blank list

  const ds = tab === 'hoan_thanh' ? xong?.ds ?? [] : (dang?.ds ?? []).filter((c) => c.giai_doan === tab)
  const dem = (g: Tab) => g === 'hoan_thanh' ? xong?.ds.length ?? 0 : (dang?.ds ?? []).filter((c) => c.giai_doan === g).length
  const tr = dang?.tran

  async function doi(c: CaseHinh, muc: number | null, uu: UuTienHinh | null) {
    setLoi(null)
    try { await doiCaHinh(c.id, muc, uu); va(c.id, (x) => ({ ...x, muc: muc ?? x.muc, uu_tien: uu ?? x.uu_tien })); nhanCaMoi() } catch (e: any) { setLoi(e?.message ?? String(e)) }
  }
  async function dong(c: CaseHinh) {
    const kq = prompt(`Đóng ca Hình của ${c.ho_ten}.\nGõ kết quả: on (ổn) · can_them (cần thêm) · bo (bỏ)`, 'on')
    if (!kq) return
    if (!['on', 'can_them', 'bo'].includes(kq.trim())) { setLoi('Kết quả phải là on | can_them | bo.'); return }
    const gc = prompt('Ghi chú (có thể để trống):', '') ?? ''
    setLoi(null)
    try { await dongCaHinh(c.id, kq.trim() as 'on', gc.trim() || null); setDang((d) => { if (!d) return d; const n = { ...d, ds: d.ds.filter((x) => x.id !== c.id) }; NHO.dang = n; return n }); danhSachHinh('hoan_thanh').then((d) => { NHO.xong = d; setXong(d) }).catch(() => {}) }
    catch (e: any) { setLoi(e?.message ?? String(e)) }
  }

  return (
    <section className="min-h-0 flex-1 overflow-auto bg-[#f5f5f7] p-8">
      <div className="mx-auto max-w-[1000px]">
        <header className="mb-3 flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-[22px] font-bold text-slate-800">Bổ trợ Hình</h1>
            <p className="mt-1 text-[12.5px] text-slate-500">Chưa có bản đồ Hình nên chưa tự đo/đề xuất: Trang/Lộc tự mở ca. Xếp lịch ở <b>Lịch phòng</b> (cùng ca trực, cùng suất với Yếu). Tài liệu gắn theo buổi; người dạy hoàn tất ca chỉ ghi nhận xét.</p>
          </div>
          {tr && <span className="rounded-xl bg-white px-3 py-1.5 text-[12.5px] ring-1 ring-slate-200">Đang bổ trợ <b>{tr.dang}/{tr.tran_dang}</b> (Hình {tr.dang_hinh}) · Ưu tiên Cao <b>{tr.cao}/{tr.tran_cao}</b></span>}
          <button onClick={() => setMoForm((v) => !v)} className="rounded-lg bg-indigo-600 px-3.5 py-2 text-[13px] font-bold text-white hover:bg-indigo-700">+ Mở ca Hình</button>
        </header>
        {moForm && <MoCaForm onXong={() => { setMoForm(false); tai() }} onDong={() => setMoForm(false)} />}
        <div className="mb-3 flex items-center gap-2">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-0.5 text-[13px] font-semibold shadow-sm">
            {(Object.keys(TAB_TEN) as Tab[]).map((k) => (
              <button key={k} onClick={() => setTab(k)} className={`rounded-lg px-3.5 py-1.5 ${tab === k ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>{TAB_TEN[k]} <span className={tab === k ? 'opacity-80' : 'text-slate-400'}>{dem(k)}</span></button>
            ))}
          </div>
          <button onClick={tai} title="Tải lại" className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[12px] text-slate-500 hover:bg-slate-100">↻</button>
        </div>
        {loi && <p className="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</p>}
        {!dang ? <div className="rounded-2xl bg-white p-6 text-center text-[13px] text-slate-400 ring-1 ring-slate-200">Đang tải…</div>
          : ds.length === 0 ? <div className="rounded-2xl bg-white p-6 text-center text-[13px] text-slate-400 ring-1 ring-slate-200">Không có ca nào ở mục “{TAB_TEN[tab]}”.</div>
          : <div className="grid gap-3 md:grid-cols-2">{ds.map((c) => (
            <div key={c.id} className="rounded-2xl bg-white p-4 ring-1 ring-slate-300">
              <div className="flex flex-wrap items-center gap-1.5">
                <h3 className="text-[14px] font-bold text-slate-800">{c.ho_ten} <span className="font-normal text-slate-400">· {c.lop ?? `K${c.khoi ?? '?'}`}{c.ma_hs ? ` · ${c.ma_hs}` : ''}</span></h3>
                {c.vong_tiep && <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10.5px] font-bold text-purple-700">vòng tiếp</span>}
                <button onClick={() => setLsCase(c)} title="Lịch sử" className="ml-auto text-[13px] text-slate-400 hover:text-slate-700">🕘</button>
              </div>
              <p className="mt-1 text-[12.5px] text-slate-600">{c.ly_do}</p>
              <p className="mt-0.5 text-[11.5px] text-slate-400">Mở {ddmmVN(c.created_at.slice(0, 10))} · đã học {c.so_buoi_da_hoc} buổi</p>
              {c.trang_thai === 'dang_xu' ? (
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {[1, 2, 3].map((m) => <button key={m} onClick={() => c.muc !== m && doi(c, m, null)} title={MUC_HINH_TEN[m]} className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-bold ${c.muc === m ? 'bg-slate-900 text-white' : MUC_CLS[m]}`}>L{m}</button>)}
                  <button onClick={() => doi(c, null, (c.uu_tien === 3 ? 1 : c.uu_tien + 1) as UuTienHinh)} title="Bấm để đổi ưu tiên: Thường → Cao → Thấp" className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-bold ${UU_CLS[c.uu_tien]}`}>Ưu tiên {UU_TIEN_HINH_TEN[c.uu_tien]}</button>
                  <button onClick={() => dong(c)} className="ml-auto rounded-lg border border-slate-200 px-2.5 py-1 text-[12px] text-slate-500 hover:text-rose-600">Đóng ca</button>
                </div>
              ) : <p className="mt-2 text-[12px] text-slate-600">Kết quả: <b>{c.ket_qua ? KET_QUA_HINH_TEN[c.ket_qua] : '?'}</b>{c.ghi_chu_dong ? ` · ${c.ghi_chu_dong}` : ''}{c.hoan_thanh_at ? ` · ${ddmmVN(c.hoan_thanh_at.slice(0, 10))}` : ''}</p>}
              {c.giai_doan === 'can_xep' && <p className="mt-2 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[12px] text-amber-800">Chưa có buổi — vào <b>Lịch phòng</b> → ca trực → “+ Xếp” → tab Hình.</p>}
              {c.buoi_cho && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[12px] text-slate-700">
                  <span>📅 {ddmmVN(c.buoi_cho.ngay)} {hhmm(c.buoi_cho.gio_bat_dau)}{c.buoi_cho.phong ? ` · ${c.buoi_cho.phong}` : ''} · {c.buoi_cho.nguoi_day_ten ?? '?'}</span>
                  <button onClick={() => setTlCase(c)} className={`ml-auto rounded-full px-2.5 py-0.5 text-[11.5px] font-bold ${c.buoi_cho.so_tai_lieu ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>📎 Tài liệu {c.buoi_cho.so_tai_lieu ? `(${c.buoi_cho.so_tai_lieu})` : '— chưa có'}</button>
                </div>
              )}
            </div>
          ))}</div>}
      </div>
      {tlCase?.buoi_cho && <TaiLieuModal ca={tlCase} onDong={() => setTlCase(null)} onDoi={(n) => va(tlCase.id, (x) => x.buoi_cho ? { ...x, buoi_cho: { ...x.buoi_cho, so_tai_lieu: n } } : x)} />}
      {lsCase && <LichSuModal ca={lsCase} onDong={() => setLsCase(null)} />}
    </section>
  )
}

function MoCaForm({ onXong, onDong }: { onXong: () => void; onDong: () => void }) {
  const [q, setQ] = useState('')
  const [kq, setKq] = useState<{ id: string; ma_hs: string | null; ho_ten: string; khoi: string | null; lop: string[] }[]>([])
  const [hs, setHs] = useState<{ id: string; ho_ten: string } | null>(null)
  const [muc, setMuc] = useState(2), [uu, setUu] = useState<UuTienHinh>(2), [lyDo, setLyDo] = useState('')
  const [busy, setBusy] = useState(false), [loi, setLoi] = useState<string | null>(null)
  const tim = useRef<number | undefined>(undefined)
  useEffect(() => { window.clearTimeout(tim.current); if (q.trim().length < 2) { setKq([]); return }; tim.current = window.setTimeout(() => { timHocSinhBT(q).then(setKq).catch(() => {}) }, 250) }, [q])
  async function luu() {
    if (!hs) { setLoi('Chọn học sinh'); return }
    setBusy(true); setLoi(null)
    try { await moCaHinh(hs.id, muc, uu, lyDo); onXong() } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(false) }
  }
  const inp = 'w-full rounded-lg border border-slate-300 px-2 py-1.5 text-[13px]'
  return (
    <div className="mb-3 rounded-2xl bg-white p-4 ring-1 ring-indigo-200">
      <h2 className="mb-2 text-[13px] font-bold uppercase tracking-wide text-slate-500">Mở ca bổ trợ Hình</h2>
      <div className="grid gap-2 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-[11px] text-slate-500">Học sinh (gõ tên/mã)</label>
          {hs ? <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-[13px] font-semibold text-indigo-800">{hs.ho_ten}<button onClick={() => setHs(null)} className="ml-auto text-indigo-400">✕</button></div>
            : <><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="vd Nguyễn Văn A hoặc HS0604" className={inp} />
              {kq.length > 0 && <div className="mt-1 max-h-[180px] overflow-auto rounded-lg border border-slate-200">{kq.map((h) => (
                <button key={h.id} onClick={() => { setHs({ id: h.id, ho_ten: h.ho_ten }); setKq([]) }} className="block w-full px-2.5 py-1.5 text-left text-[12.5px] hover:bg-slate-50">{h.ho_ten} <span className="text-slate-400">· {h.ma_hs ?? ''}{h.khoi ? ` · K${h.khoi}` : ''}{h.lop.length ? ` · ${h.lop.join(', ')}` : ''}</span></button>))}</div>}</>}
        </div>
        <div className="flex items-end gap-2">
          <div className="flex-1"><label className="mb-1 block text-[11px] text-slate-500">Mức</label>
            <select value={muc} onChange={(e) => setMuc(Number(e.target.value))} className={inp}>{[1, 2, 3].map((m) => <option key={m} value={m}>{MUC_HINH_TEN[m]}</option>)}</select></div>
          <div className="flex-1"><label className="mb-1 block text-[11px] text-slate-500">Ưu tiên</label>
            <select value={uu} onChange={(e) => setUu(Number(e.target.value) as UuTienHinh)} className={inp}>{([3, 2, 1] as UuTienHinh[]).map((u) => <option key={u} value={u}>{UU_TIEN_HINH_TEN[u]}</option>)}</select></div>
        </div>
        <div className="md:col-span-2"><label className="mb-1 block text-[11px] text-slate-500">Lý do (bắt buộc — em yếu phần nào / vì sao cần bổ trợ Hình)</label>
          <textarea value={lyDo} onChange={(e) => setLyDo(e.target.value)} rows={2} className={inp} /></div>
      </div>
      {loi && <p className="mt-2 text-[12px] text-rose-600">{loi}</p>}
      <div className="mt-3 flex gap-2"><button disabled={busy} onClick={luu} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-bold text-white disabled:opacity-50">{busy ? '…' : 'Mở ca'}</button><button onClick={onDong} className="rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] text-slate-500">Huỷ</button></div>
    </div>
  )
}

function TaiLieuModal({ ca, onDong, onDoi }: { ca: CaseHinh; onDong: () => void; onDoi: (n: number) => void }) {
  const buoi = ca.buoi_cho!.buoi_id
  const [chon, setChon] = useState<TaiLieuHinh[] | null>(null)
  const [q, setQ] = useState('')
  const [kq, setKq] = useState<TaiLieuHinh[]>([])
  const [busy, setBusy] = useState(false), [loi, setLoi] = useState<string | null>(null)
  useEffect(() => { taiLieuCuaBuoi(buoi).then(setChon).catch((e) => setLoi(e?.message ?? String(e))) }, [buoi])
  useEffect(() => { const t = window.setTimeout(() => { timTaiLieu(q).then(setKq).catch(() => {}) }, 250); return () => window.clearTimeout(t) }, [q])
  async function luu(moi: TaiLieuHinh[]) {
    setBusy(true); setLoi(null)
    try { await ganTaiLieu(buoi, moi.map((t) => t.id)); setChon(moi); onDoi(moi.length) } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(false) }
  }
  const daChon = new Set((chon ?? []).map((t) => t.id))
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-4" onClick={onDong}>
      <div className="flex max-h-[88vh] w-[720px] max-w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center border-b border-slate-200 px-5 py-3"><h2 className="text-[15px] font-bold text-slate-900">Tài liệu buổi {ddmmVN(ca.buoi_cho!.ngay)} · {ca.ho_ten}</h2><button onClick={onDong} className="ml-auto h-8 w-8 rounded-md text-slate-400 hover:bg-slate-100">✕</button></div>
        <div className="overflow-auto px-5 py-3">
          {loi && <p className="mb-2 rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</p>}
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">Đã gắn ({chon?.length ?? '…'})</p>
          {(chon ?? []).length === 0 ? <p className="mb-3 text-[12.5px] text-slate-400">Chưa có — chọn từ kho tài liệu bên dưới (hoặc tạo tài liệu bằng builder rồi tìm lại ở đây).</p>
            : <div className="mb-3 flex flex-col gap-1">{(chon ?? []).map((t, i) => (
              <div key={t.id} className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[12.5px]">
                <span className="font-semibold text-emerald-800">{i + 1}. {t.ten}</span><span className="text-emerald-600">{t.loai}{t.khoi ? ` · K${t.khoi}` : ''}</span>
                <button disabled={busy} onClick={() => luu((chon ?? []).filter((x) => x.id !== t.id))} className="ml-auto text-emerald-500 hover:text-rose-600">✕</button>
              </div>))}</div>}
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">Kho tài liệu (Toán)</p>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo tên tài liệu…" className="mb-2 w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-[13px]" />
          <div className="flex flex-col gap-1">{kq.filter((t) => !daChon.has(t.id)).map((t) => (
            <div key={t.id} className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[12.5px]">
              <span className="font-semibold text-slate-700">{t.ten}</span><span className="text-slate-400">{t.loai}{t.khoi ? ` · K${t.khoi}` : ''}</span>
              <button disabled={busy} onClick={() => luu([...(chon ?? []), t])} className="ml-auto rounded-full bg-indigo-600 px-2.5 py-0.5 text-[11.5px] font-bold text-white disabled:opacity-50">+ Gắn</button>
            </div>))}</div>
        </div>
      </div>
    </div>
  )
}

const SK_TEN: Record<string, string> = { mo: 'Mở ca', doi_muc: 'Đổi mức', doi_uu_tien: 'Đổi ưu tiên', doi_trang_thai: 'Đóng ca' }
function LichSuModal({ ca, onDong }: { ca: CaseHinh; onDong: () => void }) {
  const [ls, setLs] = useState<LogHinh[] | null>(null)
  useEffect(() => { lichSuCaHinh(ca.id).then(setLs).catch(() => setLs([])) }, [ca.id])
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-4" onClick={onDong}>
      <div className="max-h-[80vh] w-[520px] max-w-full overflow-auto rounded-2xl bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-2 flex items-center"><h2 className="text-[15px] font-bold text-slate-900">Lịch sử · {ca.ho_ten}</h2><button onClick={onDong} className="ml-auto text-slate-400">✕</button></div>
        {!ls ? <p className="text-[13px] text-slate-400">Đang tải…</p> : ls.map((l, i) => (
          <div key={i} className="border-b border-slate-100 py-1.5 text-[12.5px] text-slate-700">
            <b>{SK_TEN[l.su_kien] ?? l.su_kien}</b> <span className="text-slate-400">· {new Date(l.at).toLocaleString('vi-VN')} · {l.ai ?? '—'}</span>
            <div className="text-slate-500">{l.cu != null ? `${JSON.stringify(l.cu)} → ` : ''}{typeof l.moi === 'object' ? Object.values(l.moi as object).filter(Boolean).join(' · ') : String(l.moi ?? '')}</div>
          </div>))}
      </div>
    </div>
  )
}
