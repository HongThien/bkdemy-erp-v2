// Bổ trợ › Lịch phòng (Thùy 24/09, spec-xep-bo-tro-chung.md §4) = "ĐANG DIỄN RA" của CẢ 3 loại bổ trợ + nơi xếp chung theo ĐƠN VỊ.
// 2 khu: (1) LỊCH TRỰC BỔ TRỢ KHỐI — ca trực cố định (trước/sau giờ học), mở ngày thì DB tự gắn buổi đã xếp bằng form riêng vào ca khớp
// người + giờ (mig 202609241600) · (2) LỊCH RIÊNG — ca tạo tay + buổi xếp riêng không khớp ca trực nào (nhúng TheoDoiCaBoTroTab).
// Màu theo loại (nền nhạt): Yếu đỏ · Đuổi xanh da trời · Bù cam. Ngày: 3 ô (qua · nay · mai quanh ngày chọn) + mũi tên + chọn thẳng.
// Máy chỉ CHẶN (đơn vị, 3 em/TA, Đuổi ≥60', phòng ≤2 ca) — không tự xếp. Mọi mutation vá tại chỗ (CLAUDE.md §2), không reload list.
import { useEffect, useMemo, useState } from 'react'
import { caCuaNgay, tomTatNgay, ungVienCa, xepVaoCa, xacNhanPH, goKhoiCa, huyCa, taoCaTay, LOAI_TEN, type CaBoTro, type HsTrongCa, type NgayTomTat, type UngVien, type UngVienCa, type LoaiBoTro } from '../../lib/ca_bo_tro'
import { caTheoDoi, type CaTheoDoi } from '../../lib/botro_yeu_ca'
import { homNayVN, congNgay, ddmmVN, thuCuaNgay } from '../../lib/tuan'
import { listNhanSu, type NhanSu } from '../../lib/nhansu'
import { listPhong, type Phong } from '../../lib/phong'
import SearchSelect from '../../components/SearchSelect'
import TheoDoiCaBoTroTab, { TT, trangThai } from '../danhgia/TheoDoiCaBoTroTab'

const hhmm = (t: string | null | undefined) => (t ? String(t).slice(0, 5) : '')
const KHUNG_GIO = Array.from({ length: (22 - 6) * 2 + 1 }, (_, i) => `${String(6 + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`)
// Thùy 24/09: màu nhận diện theo loại — Yếu đỏ · Đuổi xanh da trời · Bù cam (nền nhạt)
const LOAI_CLS: Record<LoaiBoTro, string> = { yeu: 'bg-rose-100 text-rose-700', duoi: 'bg-sky-100 text-sky-700', bu: 'bg-orange-100 text-orange-700' }
const LOAI_ROW: Record<LoaiBoTro, string> = { yeu: 'bg-rose-50 border-rose-200', duoi: 'bg-sky-50 border-sky-200', bu: 'bg-orange-50 border-orange-200' }
const POLL_MS = 15000
// Nhớ ngày + môn đang xem khi rời màn (CLAUDE.md §2 "rời màn rồi quay lại = đúng chỗ cũ").
const NHO: { ngay: string | null; mon: string } = { ngay: null, mon: '' }

export default function LichPhongScreen() {
  const homNay = homNayVN()
  const [ngay, setNgay] = useState<string>(NHO.ngay ?? homNay)
  const [tomTat, setTomTat] = useState<NgayTomTat[]>([])
  const [cas, setCas] = useState<CaBoTro[]>([])
  const [live, setLive] = useState<Map<string, CaTheoDoi>>(new Map()) // buoi_id → trạng thái sống của ca yếu
  const [now, setNow] = useState(Date.now())
  const [loading, setLoading] = useState(true)
  const [loi, setLoi] = useState<string | null>(null)
  const [monF, setMonF] = useState(NHO.mon)
  const [hienHuy, setHienHuy] = useState(false)
  const [moCaId, setMoCaId] = useState<string | null>(null)
  const [taoMoi, setTaoMoi] = useState(false)
  const [nss, setNss] = useState<NhanSu[]>([])
  const [phongs, setPhongs] = useState<Phong[]>([])

  const taiTomTat = (d: string) => tomTatNgay(congNgay(d, -1), congNgay(d, 1)).then(setTomTat).catch(() => {})
  const taiLive = (d: string) => caTheoDoi(d).then((r) => { setLive(new Map(r.map((x) => [x.buoi_id, x]))); setNow(Date.now()) }).catch(() => {})
  const taiNgay = (d: string) => { setLoading(true); setLoi(null); caCuaNgay(d).then(setCas).catch((e: any) => setLoi(e?.message ?? String(e))).finally(() => setLoading(false)) }
  useEffect(() => { listNhanSu().then((l) => setNss(l.filter((n) => n.trang_thai === 'dang_lam'))).catch(() => {}); listPhong(true).then(setPhongs).catch(() => {}) }, [])
  useEffect(() => { NHO.ngay = ngay; taiNgay(ngay); taiTomTat(ngay); taiLive(ngay) }, [ngay])
  useEffect(() => { NHO.mon = monF }, [monF])
  useEffect(() => { const id = setInterval(() => { if (document.visibilityState === 'visible') taiLive(NHO.ngay ?? homNay) }, POLL_MS); return () => clearInterval(id) }, [])

  const mons = useMemo(() => [...new Set(cas.map((c) => c.mon))].sort(), [cas])
  const hien = useMemo(() => cas.filter((c) => (!monF || c.mon === monF) && (hienHuy || c.trang_thai === 'mo')), [cas, monF, hienHuy])
  const caTruc = hien.filter((c) => c.lich_truc_id)
  const caRieng = hien.filter((c) => !c.lich_truc_id)
  const anBuoiIds = useMemo(() => new Set(cas.flatMap((c) => c.hs.map((h) => h.buoi_hoc_id))), [cas]) // đã hiện trong card ca ⇒ Lịch riêng ẩn
  const moCa = cas.find((c) => c.id === moCaId) ?? null
  const tenNs = (id: string | null) => (id ? nss.find((n) => n.id === id)?.ho_ten ?? null : null)

  // ── vá tại chỗ sau mutation ──
  // Vá ngay cho mượt, rồi nạp lại NGẦM (không blank list) để cờ đầy người/đầy đơn vị lấy đúng từ DB — không tự tính ở màn (§2.0).
  const vaCa = (id: string, fn: (c: CaBoTro) => CaBoTro) => { setCas((prev) => prev.map((c) => c.id === id ? fn(c) : c)); const d = NHO.ngay ?? ngay; caCuaNgay(d).then((r) => { if ((NHO.ngay ?? ngay) === d) setCas(r) }).catch(() => {}) }
  const capNhatTomTat = (d: string, dDung: number, dCho: number) => setTomTat((prev) => prev.map((t) => t.ngay === d ? { ...t, don_vi_dung: t.don_vi_dung + dDung, don_vi_cho: t.don_vi_cho + dCho } : t))

  async function xep(ca: CaBoTro, u: UngVien): Promise<boolean> {
    try {
      const r = await xepVaoCa(ca.id, u)
      const hs: HsTrongCa = { bhh_id: r.bhh_id, buoi_hoc_id: r.buoi_hoc_id, loai: u.loai, hoc_sinh_id: u.hoc_sinh_id, ho_ten: u.ho_ten, ma_hs: u.ma_hs, khoi: u.khoi, lop: u.lop, don_vi: r.don_vi, xac_nhan_ph_at: null, diem_danh: null, nguoi_day_tg: r.nguoi_day_tg, nguoi_day_ten: tenNs(r.nguoi_day_tg), chi_tiet: u.chi_tiet }
      vaCa(ca.id, (c) => ({ ...c, hs: [...c.hs, hs], don_vi_cho: c.don_vi_cho + r.don_vi, so_hs_cho: c.so_hs_cho + 1 }))
      capNhatTomTat(ca.ngay, 0, r.don_vi)
      return true
    } catch (e: any) { setLoi(e?.message ?? String(e)); return false }
  }
  async function xacNhan(ca: CaBoTro, h: HsTrongCa) {
    setLoi(null)
    try {
      await xacNhanPH(h.bhh_id)
      vaCa(ca.id, (c) => ({ ...c, hs: c.hs.map((x) => x.bhh_id === h.bhh_id ? { ...x, xac_nhan_ph_at: new Date().toISOString() } : x), don_vi_dung: c.don_vi_dung + h.don_vi, don_vi_cho: c.don_vi_cho - h.don_vi, so_hs_xn: c.so_hs_xn + 1, so_hs_cho: c.so_hs_cho - 1 }))
      capNhatTomTat(ca.ngay, h.don_vi, -h.don_vi)
    } catch (e: any) { setLoi(e?.message ?? String(e)) }
  }
  async function go(ca: CaBoTro, h: HsTrongCa) {
    if (!confirm(`Gỡ ${h.ho_ten} (${LOAI_TEN[h.loai]} · ${h.don_vi} đv) khỏi ca ${hhmm(ca.gio_bat_dau)}? Em quay lại hàng chờ.`)) return
    setLoi(null)
    try {
      await goKhoiCa(h.bhh_id, 'OPS gỡ ở Lịch phòng')
      const xn = !!h.xac_nhan_ph_at
      vaCa(ca.id, (c) => ({ ...c, hs: c.hs.filter((x) => x.bhh_id !== h.bhh_id), don_vi_dung: c.don_vi_dung - (xn ? h.don_vi : 0), don_vi_cho: c.don_vi_cho - (xn ? 0 : h.don_vi), so_hs_xn: c.so_hs_xn - (xn ? 1 : 0), so_hs_cho: c.so_hs_cho - (xn ? 0 : 1) }))
      capNhatTomTat(ca.ngay, xn ? -h.don_vi : 0, xn ? 0 : -h.don_vi)
    } catch (e: any) { setLoi(e?.message ?? String(e)) }
  }
  async function huy(ca: CaBoTro) {
    const ly = prompt(`Huỷ ca ${hhmm(ca.gio_bat_dau)}–${hhmm(ca.gio_ket_thuc)} · ${ca.nhan_su_ten ?? '?'}? ${ca.hs.length} em đã xếp sẽ quay lại hàng chờ.\nLý do:`, 'TA nghỉ')
    if (ly === null) return
    setLoi(null)
    try {
      await huyCa(ca.id, ly || 'OPS huỷ')
      vaCa(ca.id, (c) => ({ ...c, trang_thai: 'huy', ly_do_huy: ly || 'OPS huỷ', hs: [], don_vi_dung: 0, don_vi_cho: 0, so_hs_xn: 0, so_hs_cho: 0 }))
      capNhatTomTat(ca.ngay, -ca.don_vi_dung, -ca.don_vi_cho)
      if (moCaId === ca.id) setMoCaId(null)
    } catch (e: any) { setLoi(e?.message ?? String(e)) }
  }

  const nhanNgay = (d: string) => d === homNay ? 'Hôm nay' : d === congNgay(homNay, -1) ? 'Hôm qua' : d === congNgay(homNay, 1) ? 'Ngày mai' : thuCuaNgay(d)
  const theCa = (c: CaBoTro) => <CaCard key={c.id} c={c} live={live} now={now} onMo={() => setMoCaId(c.id)} onXacNhan={(h) => xacNhan(c, h)} onGo={(h) => go(c, h)} onHuy={() => huy(c)} />
  return (
    <section className="min-h-0 overflow-auto bg-[#f5f5f7] p-8">
      <div className="mx-auto max-w-[1100px]">
        <header className="mb-4 flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-[22px] font-bold text-slate-800">Lịch phòng · đang diễn ra</h1>
            <p className="mt-1 text-[12.5px] text-slate-500">Mọi bổ trợ trong ngày. Bấm "+ Xếp" trên ca trực để xếp em (Đuổi → Bù → Yếu). 1 đv = 30' × 1 TA · Đuổi 4 · Bù 4 · Yếu L2 4 · Yếu L1 1 · tối đa 3 em/TA. Ca đầy khi đủ người HOẶC đủ đơn vị.</p>
          </div>
          {/* Ngày: 3 ô quanh ngày chọn + mũi tên + chọn thẳng (Thùy 24/09: gọn, tiết kiệm chỗ) */}
          <div className="flex items-center gap-1 rounded-2xl bg-white p-1.5 ring-1 ring-slate-200">
            <button onClick={() => setNgay(congNgay(ngay, -1))} title="Lùi 1 ngày" className="h-9 w-8 rounded-lg text-[16px] text-slate-500 hover:bg-slate-100">‹</button>
            {[congNgay(ngay, -1), ngay, congNgay(ngay, 1)].map((d) => { const t = tomTat.find((x) => x.ngay === d); const on = d === ngay; return (
              <button key={d} onClick={() => setNgay(d)} className={`min-w-[92px] rounded-xl px-2.5 py-1 text-center ${on ? 'bg-indigo-50 ring-1 ring-indigo-200' : 'hover:bg-slate-50'}`}>
                <div className={`text-[12.5px] font-bold ${on ? 'text-indigo-700' : 'text-slate-700'}`}>{nhanNgay(d)} · {ddmmVN(d)}</div>
                <div className="text-[11px] text-slate-400">{t ? `${t.so_ca} ca · ${t.don_vi_dung}${t.don_vi_cho ? `+${t.don_vi_cho}` : ''}/${t.don_vi} đv` : '…'}</div>
              </button>) })}
            <button onClick={() => setNgay(congNgay(ngay, 1))} title="Tới 1 ngày" className="h-9 w-8 rounded-lg text-[16px] text-slate-500 hover:bg-slate-100">›</button>
            <input type="date" value={ngay} onChange={(e) => e.target.value && setNgay(e.target.value)} title="Chọn ngày" className="ml-1 w-[34px] cursor-pointer rounded-lg border border-slate-200 px-1 py-1.5 text-[12px] text-transparent [color-scheme:light] focus:w-[130px] focus:text-slate-700" />
            {ngay !== homNay && <button onClick={() => setNgay(homNay)} className="ml-1 rounded-lg px-2 py-1 text-[12px] font-semibold text-indigo-600 hover:bg-indigo-50">Hôm nay</button>}
          </div>
        </header>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          {mons.length > 1 && <select value={monF} onChange={(e) => setMonF(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-[13px]"><option value="">Tất cả môn</option>{mons.map((m) => <option key={m} value={m}>{m}</option>)}</select>}
          <span className="flex items-center gap-2 text-[11.5px] text-slate-500">
            {(['yeu', 'duoi', 'bu'] as const).map((k) => <span key={k} className={`rounded-full px-2 py-0.5 font-bold ${LOAI_CLS[k]}`}>{LOAI_TEN[k]}</span>)}
            <span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-indigo-600 align-[-1px]" />đã xác nhận PH</span><span><i className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-indigo-200 align-[-1px]" />chờ PH</span>
          </span>
          <label className="ml-auto flex items-center gap-1.5 text-[12px] text-slate-500"><input type="checkbox" checked={hienHuy} onChange={(e) => setHienHuy(e.target.checked)} /> hiện ca đã huỷ</label>
          <button onClick={() => { taiNgay(ngay); taiTomTat(ngay); taiLive(ngay) }} title="Tải lại" className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[12px] text-slate-500 hover:bg-slate-100">↻</button>
        </div>
        {loi && <p className="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</p>}

        {/* ── Khu 1: Lịch trực bổ trợ khối ── */}
        <h2 className="mb-2 mt-1 flex items-baseline gap-2 text-[14px] font-bold text-slate-700">📅 Lịch trực bổ trợ khối <span className="text-[12px] font-normal text-slate-400">ca trực cố định, trước/sau giờ học · {caTruc.length} ca</span></h2>
        {loading ? <div className="mb-6 rounded-2xl bg-white p-6 text-center text-[13px] text-slate-400 ring-1 ring-slate-200">Đang tải…</div>
          : caTruc.length === 0 ? <div className="mb-6 rounded-2xl bg-white p-6 text-center text-[13px] text-slate-400 ring-1 ring-slate-200">{thuCuaNgay(ngay)} {ddmmVN(ngay)} không có ca trực nào{monF ? ` (${monF})` : ''} — thêm ở tab Lịch trực.</div>
          : <div className="mb-6 grid gap-3 md:grid-cols-2">{caTruc.map(theCa)}</div>}

        {/* ── Khu 2: Lịch riêng ── */}
        <div className="mb-2 flex flex-wrap items-baseline gap-2">
          <h2 className="text-[14px] font-bold text-slate-700">🗂 Lịch riêng</h2>
          <span className="text-[12px] text-slate-400">ca ngoài lịch trực + buổi xếp riêng không khớp ca trực nào</span>
          <button onClick={() => setTaoMoi((v) => !v)} className="ml-auto rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12.5px] font-semibold text-slate-700 hover:bg-slate-50">+ Ca ngoài lịch trực</button>
        </div>
        {taoMoi && <TaoCaForm ngay={ngay} nss={nss} phongs={phongs} mons={mons} onXong={(id) => { setTaoMoi(false); taiNgay(ngay); taiTomTat(ngay); setMoCaId(id) }} onDong={() => setTaoMoi(false)} />}
        {caRieng.length > 0 && <div className="mb-3 grid gap-3 md:grid-cols-2">{caRieng.map(theCa)}</div>}
        <TheoDoiCaBoTroTab monF={monF} khoiF="" ngay={ngay} anBuoiIds={anBuoiIds} />
      </div>
      {moCa && moCa.trang_thai === 'mo' && <UngVienModal ca={moCa} onDong={() => setMoCaId(null)} onXep={(u) => xep(moCa, u)} />}
    </section>
  )
}

function ThanhDonVi({ c }: { c: Pick<CaBoTro, 'don_vi' | 'don_vi_dung' | 'don_vi_cho'> }) {
  const lo = c.don_vi_dung > c.don_vi
  const pDung = Math.min(100, (100 * c.don_vi_dung) / Math.max(1, c.don_vi)), pCho = Math.min(100 - pDung, (100 * c.don_vi_cho) / Math.max(1, c.don_vi))
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-slate-100"><div className={lo ? 'bg-rose-500' : 'bg-indigo-600'} style={{ width: `${pDung}%` }} /><div className="bg-indigo-200" style={{ width: `${pCho}%` }} /></div>
      <b className={`whitespace-nowrap text-[12.5px] ${lo ? 'text-rose-600' : 'text-slate-700'}`}>{c.don_vi_dung}{c.don_vi_cho ? <span className="text-slate-400">+{c.don_vi_cho}</span> : null}/{c.don_vi} đv{lo ? ' · LỐ' : ''}</b>
    </div>
  )
}

function CaCard({ c, live, now, onMo, onXacNhan, onGo, onHuy }: { c: CaBoTro; live: Map<string, CaTheoDoi>; now: number; onMo: () => void; onXacNhan: (h: HsTrongCa) => void; onGo: (h: HsTrongCa) => void; onHuy: () => void }) {
  const con = c.don_vi - c.don_vi_dung
  const cho = c.toi_da_hs - c.so_hs_xn // chỗ người còn lại
  const huy = c.trang_thai === 'huy'
  const day = c.day_nguoi || c.day_don_vi
  // Thùy 24/09: ca đầy khi (1) đủ người 3 em/TA hoặc (2) đủ đơn vị — chạm cái nào báo cái đó
  const goiY = con < 0 ? `LỐ ${-con} đv — ca xếp theo đường cũ vượt sức, cân nhắc gỡ bớt` : day ? `ĐẦY — ${[c.day_nguoi && `đủ ${c.toi_da_hs} em`, c.day_don_vi && 'đủ đơn vị'].filter(Boolean).join(' · ')}` : con < 4 ? `còn ${con} đv · ${cho} chỗ — chỉ vừa Yếu L1` : `còn ${con} đv · ${cho} chỗ — vừa ${c.phut >= 60 ? 'Đuổi / ' : ''}Bù / L2 / L1`
  return (
    <div className={`rounded-2xl bg-white p-4 ring-1 ${huy ? 'opacity-60 ring-slate-200' : con < 0 ? 'ring-rose-300' : day ? 'ring-emerald-300' : 'ring-slate-200'}`}>
      <div className="flex items-start gap-2">
        <div>
          <h3 className="text-[14px] font-bold text-slate-800">{hhmm(c.gio_bat_dau)}–{hhmm(c.gio_ket_thuc)}{c.phong ? ` · ${c.phong}` : ''}{c.khoi ? ` · Khối ${c.khoi}` : ''} <span className="font-normal text-slate-400">· {c.mon}</span></h3>
          <div className="mt-0.5 text-[12px] text-slate-500">Trực: <b className="text-slate-700">{c.nhan_su_ten ?? 'chưa phân'}</b>{c.so_ta === 2 ? <> + <b className="text-slate-700">{c.nhan_su_2_ten ?? '?'}</b></> : null} · {c.so_ta} TA · {c.don_vi} đơn vị{c.lich_truc_id ? '' : ' · ngoài lịch trực'}</div>
        </div>
        {huy ? <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">ĐÃ HUỶ{c.ly_do_huy ? ` · ${c.ly_do_huy}` : ''}</span>
          : <div className="ml-auto flex shrink-0 gap-1.5"><button onClick={onMo} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[12px] font-bold text-white hover:bg-indigo-700">+ Xếp</button><button onClick={onHuy} title="Huỷ ca (TA nghỉ…)" className="rounded-lg border border-slate-200 px-2 py-1.5 text-[12px] text-slate-400 hover:text-rose-600">Huỷ</button></div>}
      </div>
      {!huy && <div className="mt-2.5 flex items-center gap-2"><div className="flex-1"><ThanhDonVi c={c} /></div><b className={`whitespace-nowrap text-[12.5px] ${c.day_nguoi ? 'text-emerald-700' : 'text-slate-700'}`}>{c.so_hs_xn}{c.so_hs_cho ? <span className="text-slate-400">+{c.so_hs_cho}</span> : null}/{c.toi_da_hs} em</b>{day && con >= 0 && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">ĐẦY</span>}</div>}
      {c.hs.map((h) => {
        const lv = h.loai === 'yeu' ? live.get(h.buoi_hoc_id) : undefined
        const tt = lv ? trangThai(lv, now) : null
        return (
          <div key={h.bhh_id} className={`mt-1.5 flex flex-wrap items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[12.5px] ${LOAI_ROW[h.loai]} ${h.xac_nhan_ph_at ? '' : 'border-dashed opacity-75'}`}>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${LOAI_CLS[h.loai]}`}>{LOAI_TEN[h.loai]} · {h.don_vi}</span>
            <span className="font-semibold text-slate-800">{h.ho_ten}</span><span className="text-slate-500">{h.lop ?? ''} · {h.chi_tiet}{h.nguoi_day_ten ? ` · dạy: ${h.nguoi_day_ten}` : ''}</span>
            {lv && tt && tt !== 'chua_dd' && <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${TT[tt].cls}`} title={`đã làm ${lv.so_dung}/${lv.so_cau} câu đúng`}>{TT[tt].ten} · {lv.so_dung}/{lv.so_cau}</span>}
            {h.diem_danh ? <span className="ml-auto rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-bold text-slate-600">{h.diem_danh === 'co_mat' ? 'có mặt' : 'vắng'}</span>
              : h.xac_nhan_ph_at ? <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">✓ PH</span>
              : <span className="ml-auto flex items-center gap-1"><span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">chờ PH</span><button onClick={() => onXacNhan(h)} className="rounded-md bg-indigo-600 px-2 py-0.5 text-[11px] font-bold text-white hover:bg-indigo-700">Xác nhận</button></span>}
            {!h.diem_danh && <button onClick={() => onGo(h)} title="Gỡ khỏi ca" className="text-slate-400 hover:text-rose-600">✕</button>}
          </div>
        )
      })}
      {!huy && <div className={`mt-2 text-[11.5px] ${con < 0 ? 'font-semibold text-rose-600' : day ? 'font-semibold text-emerald-700' : 'text-slate-400'}`}>{goiY}{c.phong ? ` · ${c.phong}: ${c.phong_so_ca}/2 ca${c.phong_so_ca >= 2 ? ' — phòng đầy' : ''}` : ''}</div>}
    </div>
  )
}

function UngVienModal({ ca, onDong, onXep }: { ca: CaBoTro; onDong: () => void; onXep: (u: UngVien) => Promise<boolean> }) {
  const [data, setData] = useState<UngVienCa | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [tab, setTab] = useState<LoaiBoTro>('duoi')
  const [busy, setBusy] = useState<string | null>(null)
  const daXep = new Set(ca.hs.map((h) => `${h.loai}|${h.hoc_sinh_id}`))
  useEffect(() => { ungVienCa(ca.id).then((d) => { setData(d); if (!d.duoi.length) setTab(d.bu.length ? 'bu' : 'yeu') }).catch((e: any) => setLoi(e?.message ?? String(e))) }, [ca.id])
  const list = data ? data[tab].filter((u) => !daXep.has(`${u.loai}|${u.hoc_sinh_id}`)) : []
  const con = ca.don_vi - ca.don_vi_dung
  async function xep(u: UngVien) { setBusy(u.ref_id); const ok = await onXep(u); setBusy(null); if (!ok) setLoi('Không xếp được — xem lỗi ở màn chính.') }
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-4" onClick={onDong}>
      <div className="flex max-h-[88vh] w-[780px] max-w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-slate-200 px-5 py-3">
          <div className="flex items-center gap-2"><h2 className="text-[15px] font-bold text-slate-900">{hhmm(ca.gio_bat_dau)}–{hhmm(ca.gio_ket_thuc)}{ca.phong ? ` · ${ca.phong}` : ''}{ca.khoi ? ` · Khối ${ca.khoi}` : ''} · {ca.mon} — {ca.nhan_su_ten ?? '?'}{ca.so_ta === 2 ? ` + ${ca.nhan_su_2_ten ?? '?'}` : ''}</h2><button onClick={onDong} className="ml-auto h-8 w-8 rounded-md text-slate-400 hover:bg-slate-100">✕</button></div>
          <div className="mt-2"><ThanhDonVi c={ca} /></div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {(['duoi', 'bu', 'yeu'] as const).map((k) => <button key={k} onClick={() => setTab(k)} className={`rounded-full px-3 py-1 text-[12px] font-bold ${tab === k ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>{LOAI_TEN[k]} {data ? `(${data[k].length})` : ''}</button>)}
            <span className="ml-auto text-[11.5px] text-slate-400">Ưu tiên: Đuổi → Bù → Yếu · trong tab đã sắp cao → thấp · còn {con} đv · {3 * ca.so_ta - ca.so_hs_xn} chỗ</span>
          </div>
        </div>
        <div className="overflow-auto px-5 py-3">
          {loi && <p className="mb-2 rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</p>}
          {!data ? <p className="text-[13px] text-slate-400">Đang tải hàng chờ…</p>
            : list.length === 0 ? <p className="text-[13px] text-slate-400">Không còn em nào chờ {LOAI_TEN[tab]}{ca.khoi ? ` khối ${ca.khoi}` : ''} · {ca.mon}.</p>
            : list.map((u) => (
              <div key={u.ref_id} className="mb-2 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-semibold text-slate-800">{u.ho_ten} <span className="font-normal text-slate-400">· {u.lop ?? '?'}{u.khoi ? ` · K${u.khoi}` : ''}</span></div>
                  <div className="text-[12px] text-slate-500">{u.chi_tiet}{u.ta_lop_ten ? ` · TA lớp: ${u.ta_lop_ten}${u.ta_dang_truc ? ' (đang trực ✓)' : ''}` : ''}{u.da_xep_ngay_khac ? ' · đã có buổi ngày khác' : ''}</div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${LOAI_CLS[u.loai]}`}>{LOAI_TEN[u.loai]}{u.level ? ` L${u.level}` : ''} · {u.don_vi}</span>
                {u.vua ? <button disabled={busy === u.ref_id} onClick={() => xep(u)} className="rounded-lg bg-indigo-600 px-3 py-1 text-[12px] font-bold text-white hover:bg-indigo-700 disabled:opacity-50">{busy === u.ref_id ? '…' : '+ Xếp'}</button>
                  : <span className="rounded-lg border border-slate-200 px-2 py-1 text-[11.5px] text-slate-400" title={u.ly_do_khong_vua ?? ''}>{u.ly_do_khong_vua ?? 'không vừa'}</span>}
              </div>
            ))}
          <p className="mt-2 text-[11.5px] text-slate-400">"+ Xếp" ⇒ em vào ca ở trạng thái <b>chờ PH</b> (chưa trừ đơn vị). PH đồng ý ⇒ bấm <b>Xác nhận</b> trên ca ⇒ trừ đơn vị, chiếm chỗ.</p>
        </div>
      </div>
    </div>
  )
}

function TaoCaForm({ ngay, nss, phongs, mons, onXong, onDong }: { ngay: string; nss: NhanSu[]; phongs: Phong[]; mons: string[]; onXong: (id: string) => void; onDong: () => void }) {
  const [gio, setGio] = useState('17:00'), [gioKt, setGioKt] = useState('18:00')
  const [mon, setMon] = useState(mons[0] ?? 'Toán'), [khoi, setKhoi] = useState(''), [phong, setPhong] = useState<string | null>(null)
  const [soTa, setSoTa] = useState<1 | 2>(1), [ns, setNs] = useState<string | null>(null), [ns2, setNs2] = useState<string | null>(null)
  const [busy, setBusy] = useState(false), [loi, setLoi] = useState<string | null>(null)
  const sel = 'w-full rounded-lg border border-slate-300 px-2 py-1.5 text-[13px]'
  const nsOpts = nss.map((n) => ({ id: n.id, label: n.ho_ten, sub: n.ma_ns }))
  async function luu() {
    if (!ns) { setLoi('Chọn người trực'); return }
    if (gioKt <= gio) { setLoi('Giờ kết thúc phải sau giờ bắt đầu'); return }
    setBusy(true); setLoi(null)
    try { onXong(await taoCaTay({ ngay, gio_bat_dau: gio, gio_ket_thuc: gioKt, mon, khoi: khoi || null, phong, so_ta: soTa, nhan_su_id: ns, nhan_su_2_id: soTa === 2 ? ns2 : null })) }
    catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(false) }
  }
  return (
    <div className="mb-3 rounded-2xl bg-white p-4 ring-1 ring-indigo-200">
      <h2 className="mb-2 text-[13px] font-bold uppercase tracking-wide text-slate-500">Ca ngoài lịch trực · {thuCuaNgay(ngay)} {ddmmVN(ngay)}</h2>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <div><label className="mb-1 block text-[11px] text-slate-500">Bắt đầu</label><select value={gio} onChange={(e) => setGio(e.target.value)} className={sel}>{KHUNG_GIO.map((g) => <option key={g}>{g}</option>)}</select></div>
        <div><label className="mb-1 block text-[11px] text-slate-500">Kết thúc</label><select value={gioKt} onChange={(e) => setGioKt(e.target.value)} className={sel}>{KHUNG_GIO.filter((g) => g > gio).map((g) => <option key={g}>{g}</option>)}</select></div>
        <div><label className="mb-1 block text-[11px] text-slate-500">Môn</label><select value={mon} onChange={(e) => setMon(e.target.value)} className={sel}>{['Toán', 'KHTN', 'Văn', 'Tiếng Anh'].map((m) => <option key={m}>{m}</option>)}</select></div>
        <div><label className="mb-1 block text-[11px] text-slate-500">Khối (trống = mọi khối)</label><input value={khoi} onChange={(e) => setKhoi(e.target.value)} placeholder="vd 7" className={sel} /></div>
        <div><label className="mb-1 block text-[11px] text-slate-500">Phòng</label><SearchSelect value={phong} onChange={setPhong} options={phongs.map((p) => ({ id: p.ma_phong, label: p.ten_phong }))} placeholder="Chọn phòng…" /></div>
        <div><label className="mb-1 block text-[11px] text-slate-500">Số TA</label><select value={soTa} onChange={(e) => setSoTa(Number(e.target.value) as 1 | 2)} className={sel}><option value={1}>1 TA</option><option value={2}>2 TA</option></select></div>
        <div><label className="mb-1 block text-[11px] text-slate-500">Người trực{soTa === 2 ? ' 1' : ''}</label><SearchSelect value={ns} onChange={setNs} options={nsOpts} placeholder="Chọn người…" /></div>
        {soTa === 2 && <div><label className="mb-1 block text-[11px] text-slate-500">Người trực 2</label><SearchSelect value={ns2} onChange={setNs2} options={nsOpts} placeholder="Chọn người…" /></div>}
      </div>
      {loi && <p className="mt-2 text-[12px] text-rose-600">{loi}</p>}
      <div className="mt-3 flex gap-2"><button onClick={luu} disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-semibold text-white disabled:opacity-60">{busy ? 'Đang lưu…' : 'Tạo ca'}</button><button onClick={onDong} className="rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] text-slate-600">Thôi</button></div>
    </div>
  )
}
