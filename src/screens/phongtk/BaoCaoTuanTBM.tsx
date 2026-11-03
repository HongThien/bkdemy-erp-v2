// BÁO CÁO TUẦN — phía TRƯỞNG BỘ MÔN (spec-bao-cao-tuan.md §2.8, P3 · Thùy 03/11). Mở từ đồ vật "📝 Báo cáo tuần" ở phòng Trưởng bộ môn.
//   Các khối: hàng báo cáo khối của môn mình (chưa nộp / chờ duyệt / trả lại / đã duyệt · trễ) → bấm 1 khối xem đầy đủ → Duyệt / Trả lại (ghi lý do).
//   Báo cáo môn: tổng môn (cùng hàm số với báo cáo khối) + các khối đã ghép + khối thiếu + nhận xét → Chốt (snap). CEO (admin) thấy mọi môn.
//   Báo cáo của tôi: trưởng bộ môn tự báo cáo ô chưa có trưởng khối (cùng màn soạn của trưởng khối).
// Gậy nộp trễ: hệ tự đề xuất khi mở hàng sau hạn (vào màn Gậy để Trang quyết). Sau duyệt / trả lại: vá đúng dòng, không tải lại cả hàng.
import { useEffect, useState } from 'react'
import { chotBaoCaoMon, hangBaoCao, layBaoCaoMon, luuBaoCaoMon, xemBaoCao, xuLyBaoCao, type BaoCaoMon, type BaoCaoTuan, type HangBaoCao } from '../../lib/baoCaoTuan'
import { congNgay, ddmmVN } from '../../lib/tuan'
import BaoCaoTuanTK, { NoiDungBaoCao, Khung } from './BaoCaoTuanTK'

type Tab = 'khoi' | 'mon' | 'cua_toi'
const NHO: { tab: Tab; tuan: string | null; mon: string | null } = { tab: 'khoi', tuan: null, mon: null }
const TT: Record<string, [string, string]> = {
  chua_nop: ['Chưa nộp', 'bg-slate-100 text-slate-600'], da_nop: ['Chờ duyệt', 'bg-sky-100 text-sky-700'],
  tra_lai: ['Đã trả lại', 'bg-amber-100 text-amber-800'], da_duyet: ['Đã duyệt', 'bg-emerald-100 text-emerald-700'],
}
const tenO = (o: { mon: string; khoi: string }) => `${o.mon === 'Toán' ? '' : `${o.mon} `}${o.khoi}`
const so = (v: number | null | undefined, hau = '') => (v == null ? '—' : `${v}${hau}`)
const gio = (ts: string | null) => ts ? new Date(ts).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : '—'
const khong = () => {}

export default function BaoCaoTuanTBM() {
  const [tab, setTabS] = useState<Tab>(NHO.tab)
  const setTab = (t: Tab) => { NHO.tab = t; setTabS(t) }
  const [tuan, setTuanS] = useState<string | null>(NHO.tuan)
  const setTuan = (t: string) => { NHO.tuan = t; setTuanS(t) }
  const [hang, setHang] = useState<HangBaoCao | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => {   // đổi tuần = đổi ngữ cảnh ⇒ tải lại
    let con = true
    setHang(null); setLoi(null)
    hangBaoCao(tuan ?? undefined).then((h) => { if (!con) return; setHang(h); if (!tuan) { NHO.tuan = h.tuan; setTuanS(h.tuan) } })
      .catch((e) => { if (con) setLoi(e?.message ?? String(e)) })
    return () => { con = false }
  }, [tuan])
  const mon = NHO.mon && hang?.mon.includes(NHO.mon) ? NHO.mon : hang?.mon[0] ?? null
  const [monS, setMonS] = useState<string | null>(null)
  const monChon = monS ?? mon
  const chonMon = (m: string) => { NHO.mon = m; setMonS(m) }

  if (loi && !hang) return <p className="text-[13px] text-rose-600">Lỗi: {loi}</p>
  if (!hang) return <p className="text-[13px] text-slate-400">Đang tải hàng báo cáo…</p>
  const nut = (dang: boolean) => `rounded-lg px-3.5 py-1.5 text-[13px] font-semibold ${dang ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`
  return (
    <div className="space-y-3">
      {/* 1 hàng: tuần · môn · tab */}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => setTuan(congNgay(hang.tuan, -7))} className="rounded-lg border border-slate-200 px-2 py-1 text-[13px] hover:bg-slate-50">‹</button>
        <span className="text-[15px] font-bold text-slate-800">Tuần {ddmmVN(hang.tuan)} – {ddmmVN(hang.den)}</span>
        <button onClick={() => setTuan(congNgay(hang.tuan, 7))} className="rounded-lg border border-slate-200 px-2 py-1 text-[13px] hover:bg-slate-50">›</button>
        <span className="text-[12px] text-slate-500">Hạn khối nộp {gio(hang.han)}</span>
        {hang.mon.length > 1 && hang.mon.map((m) => (
          <button key={m} onClick={() => chonMon(m)} className={`rounded-full px-2.5 py-0.5 text-[12px] font-medium ${m === monChon ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}>{m}</button>
        ))}
        <div className="ml-auto inline-flex rounded-xl border border-slate-200 bg-white p-0.5">
          <button onClick={() => setTab('khoi')} className={nut(tab === 'khoi')}>Các khối</button>
          <button onClick={() => setTab('mon')} className={nut(tab === 'mon')}>Báo cáo môn{monChon ? ` ${monChon}` : ''}</button>
          <button onClick={() => setTab('cua_toi')} className={nut(tab === 'cua_toi')}>Báo cáo của tôi</button>
        </div>
      </div>
      {tab === 'khoi' && <CacKhoi hang={hang} setHang={setHang} mon={monChon} />}
      {tab === 'mon' && monChon && <BaoCaoMonView key={`${hang.tuan}|${monChon}`} tuan={hang.tuan} mon={monChon} />}
      {tab === 'cua_toi' && <BaoCaoTuanTK />}
    </div>
  )
}

// ── Hàng báo cáo khối (trái) + xem / duyệt 1 báo cáo (phải) ──
function CacKhoi({ hang, setHang, mon }: { hang: HangBaoCao; setHang: React.Dispatch<React.SetStateAction<HangBaoCao | null>>; mon: string | null }) {
  const [chon, setChon] = useState<string | null>(null)
  const ds = hang.bao_cao.filter((d) => !mon || d.o.some((o) => o.mon === mon))
  const thieuTk = hang.o_chua_co_tk.filter((o) => !mon || o.mon === mon)
  return (
    <div className="grid gap-3 lg:grid-cols-[320px_1fr]">
      <div className="space-y-1.5">
        {ds.map((d) => (
          <button key={d.nhan_su_id} onClick={() => d.id && d.trang_thai !== 'chua_nop' && setChon(d.id)} disabled={!d.id || d.trang_thai === 'chua_nop'}
            className={`w-full rounded-xl border px-3 py-2 text-left transition ${chon && chon === d.id ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-white hover:border-slate-300'} disabled:cursor-default`}>
            <div className="flex items-center gap-1.5">
              <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-slate-800">{d.ho_ten}{d.la_toi ? ' (tôi)' : ''}</span>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${TT[d.trang_thai][1]}`}>{TT[d.trang_thai][0]}</span>
            </div>
            <div className="text-[11.5px] text-slate-500">
              Khối {d.o.map(tenO).join(' · ')}{d.tre ? <b className="text-rose-600"> · nộp trễ</b> : ''}
              {d.trang_thai === 'chua_nop' && hang.qua_han ? <b className="text-rose-600"> · quá hạn</b> : ''}
              {d.trang_thai === 'chua_nop' && d.dang_soan ? ' · đang soạn' : ''}
            </div>
            {d.tong && <div className="text-[11.5px] text-slate-500">ET {so(d.tong.et.ti_le_dung_han, '%')} · BTVN {so(d.tong.btvn.ti_le_nop, '%')} · dạng yếu {so(d.tong.dang_yeu.cuoi)}</div>}
          </button>
        ))}
        {ds.length === 0 && <p className="text-[12.5px] text-slate-400">Chưa có trưởng khối nào trong môn này.</p>}
        {thieuTk.length > 0 && (
          <div className="rounded-xl border border-dashed border-rose-300 bg-rose-50/50 px-3 py-2 text-[12px] text-rose-700">
            Ô chưa có trưởng khối (trưởng bộ môn báo cáo thay — tab "Báo cáo của tôi"):{' '}
            {thieuTk.map((o) => <span key={`${o.mon}|${o.khoi}`} className="mr-1.5">{tenO(o)}{o.co_bao_cao ? ' ✓' : ''}</span>)}
          </div>
        )}
        {hang.qua_han && <p className="text-[11.5px] text-slate-400">Quá hạn mà chưa nộp / nộp trễ ⇒ hệ đề xuất gậy (tính từ kỳ 02/11–08/11) — xem ở màn Gậy.</p>}
      </div>
      <div>
        {chon ? <XemMot key={chon} id={chon} onXong={(tt) => setHang((h) => h && { ...h, bao_cao: h.bao_cao.map((d) => (d.id === chon ? { ...d, trang_thai: tt } : d)) })} />
          : <div className="rounded-2xl border border-dashed border-slate-200 py-16 text-center text-[13px] text-slate-400">Chọn một báo cáo đã nộp bên trái để xem và duyệt.</div>}
      </div>
    </div>
  )
}

function XemMot({ id, onXong }: { id: string; onXong: (tt: 'da_duyet' | 'tra_lai') => void }) {
  const [bc, setBc] = useState<(BaoCaoTuan & { ho_ten: string; la_toi: boolean }) | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [lyDo, setLyDo] = useState('')
  const [dang, setDang] = useState(false)
  useEffect(() => { setBc(null); setLoi(null); xemBaoCao(id).then(setBc).catch((e) => setLoi(e?.message ?? String(e))) }, [id])
  async function xuLy(duyet: boolean) {
    setDang(true); setLoi(null)
    try { const r = await xuLyBaoCao(id, duyet, lyDo); setBc((b) => b && { ...b, trang_thai: r.trang_thai, tra_lai_ly_do: duyet ? null : lyDo }); onXong(r.trang_thai) }
    catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setDang(false) }
  }
  if (loi && !bc) return <p className="text-[13px] text-rose-600">{loi}</p>
  if (!bc) return <p className="text-[13px] text-slate-400">Đang tải báo cáo…</p>
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[14.5px] font-bold text-slate-800">{bc.ho_ten} · Khối {bc.o.map(tenO).join(' · ')}</span>
        <span className={`rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${TT[bc.trang_thai]?.[1] ?? ''}`}>{TT[bc.trang_thai]?.[0] ?? bc.trang_thai}</span>
        <span className="text-[12px] text-slate-500">nộp {gio(bc.nop_at)}{bc.tre ? ' (trễ)' : ''}</span>
        {bc.trang_thai === 'da_nop' && !bc.la_toi && (
          <span className="ml-auto flex items-center gap-2">
            <input value={lyDo} onChange={(e) => setLyDo(e.target.value)} placeholder="Lý do trả lại (bắt buộc khi trả lại)" className="w-[260px] rounded-lg border border-slate-200 px-2 py-1 text-[12.5px]" />
            <button onClick={() => xuLy(false)} disabled={dang || !lyDo.trim()} className="rounded-lg border border-amber-300 px-3 py-1.5 text-[13px] font-semibold text-amber-800 hover:bg-amber-50 disabled:opacity-40">Trả lại</button>
            <button onClick={() => xuLy(true)} disabled={dang} className="rounded-lg bg-emerald-600 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-40">Duyệt</button>
          </span>
        )}
      </div>
      {loi && <p className="text-[12.5px] text-rose-600">{loi}</p>}
      {bc.tra_lai_ly_do && <p className="rounded-lg bg-amber-50 px-3 py-1.5 text-[12.5px] text-amber-800">Lý do trả lại: {bc.tra_lai_ly_do}</p>}
      <NoiDungBaoCao duLieu={bc.so} caNhan={bc.ca_nhan} setCaNhan={khong} tuViet={bc.tu_viet} setTuViet={khong} sua={false} />
    </div>
  )
}

// ── Báo cáo Chuyên môn tuần của 1 môn ──
function BaoCaoMonView({ tuan, mon }: { tuan: string; mon: string }) {
  const [bc, setBc] = useState<BaoCaoMon | null>(null)
  const [nhanXet, setNhanXet] = useState('')
  const [loi, setLoi] = useState<string | null>(null)
  const [dang, setDang] = useState<'' | 'luu' | 'chot'>('')
  const [bao, setBao] = useState<string | null>(null)
  useEffect(() => { setBc(null); setLoi(null); layBaoCaoMon(tuan, mon).then((d) => { setBc(d); setNhanXet(d.nhan_xet) }).catch((e) => setLoi(e?.message ?? String(e))) }, [tuan, mon])
  const bao2s = (m: string) => { setBao(m); setTimeout(() => setBao(null), 2200) }
  async function luu() { setDang('luu'); try { await luuBaoCaoMon(tuan, mon, nhanXet); bao2s('Đã lưu') } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setDang('') } }
  async function chot() { setDang('chot'); try { const d = await chotBaoCaoMon(tuan, mon, nhanXet); setBc(d); bao2s('Đã chốt — số tổng môn đã snap') } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setDang('') } }
  if (loi && !bc) return <p className="text-[13px] text-rose-600">{loi}</p>
  if (!bc) return <p className="text-[13px] text-slate-400">Đang tính báo cáo môn…</p>
  const chot0 = bc.trang_thai === 'da_chot'
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[14.5px] font-bold text-slate-800">Báo cáo Chuyên môn tuần — {mon}</span>
        <span className={`rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${chot0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
          {chot0 ? `Đã chốt ${gio(bc.chot_at)}${bc.chot_boi ? ` · ${bc.chot_boi}` : ''}` : 'Nháp — số tổng môn đang tính trực tiếp'}
        </span>
        <span className="ml-auto flex items-center gap-2">
          {bao && <span className="text-[12.5px] text-emerald-600">{bao}</span>}
          {loi && <span className="max-w-[320px] truncate text-[12px] text-rose-600" title={loi}>{loi}</span>}
          {!chot0 && <button onClick={luu} disabled={!!dang} className="rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] text-slate-700 hover:bg-slate-50 disabled:opacity-50">Lưu nháp</button>}
          {!chot0 && <button onClick={chot} disabled={!!dang || !nhanXet.trim() || !bc.ky_xong} title={!bc.ky_xong ? 'Tuần chưa kết thúc' : !nhanXet.trim() ? 'Cần nhận xét' : 'Chốt — snap số tổng môn + ghép các khối đã duyệt'}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-indigo-700 disabled:opacity-40">{dang === 'chot' ? 'Đang chốt…' : 'Chốt báo cáo môn'}</button>}
        </span>
      </div>
      <NoiDungBaoCao duLieu={bc.tong} caNhan={[]} setCaNhan={khong} tuViet={{}} setTuViet={khong} sua={false} anChu />
      <div className="grid gap-3 lg:grid-cols-[3fr_2fr]">
        <Khung ten={`Các khối đã ghép (${bc.cac_khoi.length})`}>
          {bc.o_thieu.length > 0 && <p className="mb-1.5 rounded-lg bg-rose-50 px-2.5 py-1 text-[12px] text-rose-700">Chưa có báo cáo được ghép: khối {bc.o_thieu.map(tenO).join(' · ')}</p>}
          <ul className="space-y-1.5">{bc.cac_khoi.map((k) => (
            <li key={k.id} className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[12.5px]">
              <div className="flex items-center gap-2">
                <b className="text-slate-800">Khối {k.o.map(tenO).join(' · ')}</b><span className="text-slate-500">· {k.ho_ten}{k.tre ? ' · nộp trễ' : ''}</span>
                <span className="ml-auto text-slate-500">ET {so(k.so.tong.et.ti_le_dung_han, '%')} · BTVN {so(k.so.tong.btvn.ti_le_nop, '%')} · dạng yếu {so(k.so.tong.dang_yeu.cuoi)}</span>
              </div>
              {k.tu_viet?.nhan_dinh && <p className="mt-0.5 text-slate-600">{k.tu_viet.nhan_dinh}</p>}
              {k.tu_viet?.uu_tien?.some((u) => u.trim()) && <p className="text-slate-500">Ưu tiên: {k.tu_viet.uu_tien.filter((u) => u.trim()).join(' · ')}</p>}
              {k.tu_viet?.can_ho_tro?.trim() && <p className="text-amber-700">Cần hỗ trợ: {k.tu_viet.can_ho_tro}</p>}
            </li>
          ))}</ul>
          {bc.cac_khoi.length === 0 && <p className="text-[12.5px] text-slate-400">Chưa có báo cáo khối nào được duyệt.</p>}
        </Khung>
        <Khung ten="Nhận xét của trưởng bộ môn">
          <textarea disabled={chot0} value={nhanXet} onChange={(e) => setNhanXet(e.target.value)} rows={8}
            className="w-full rounded-lg border border-slate-200 px-2 py-1 text-[13px] disabled:bg-slate-50" placeholder="Nhận định chung của môn, việc cần CEO biết / quyết…" />
        </Khung>
      </div>
    </div>
  )
}
