// Popup THÊM / SỬA 1 dòng LỊCH BỔ TRỢ KHỐI (Thùy 10/11) — lich_truc_bo_tro: môn × khối × thứ × giờ × phòng × người trực, lặp hằng tuần.
// Báo trùng SỐNG khi đang điền (fn_lich_truc_kiem_trung — đọc lịch phòng chung fn_phong_lich, 4 tuần tới kể từ ngày áp dụng):
//   🚫 chặn  = phòng có chính khoá/test/phát sinh, phòng đã đủ 2 ca bổ trợ, người trực đang ở chỗ khác
//   ⚠ cảnh báo = ghép phòng với 1 ca bổ trợ khác (luật ≤ 2 ca/phòng) — lưu được nếu bấm "Vẫn xếp"
// Lưu = fn_lich_truc_luu: kiểm lại + ghi trong CÙNG transaction ở DB (màn không tự quyết trùng hay không).
import { useEffect, useMemo, useState } from 'react'
import SearchSelect from '../../components/SearchSelect'
import TrungPhongList from '../../components/TrungPhongList'
import { kiemTrungLichKhoi, luuLichKhoi, type LichKhoiInput, type Phong, type TrungLichKhoi } from '../../lib/phong'
import type { NhanSu } from '../../lib/nhansu'
import { homNayVN } from '../../lib/tuan'

export const THU_TEN: Record<number, string> = { 2: 'Thứ 2', 3: 'Thứ 3', 4: 'Thứ 4', 5: 'Thứ 5', 6: 'Thứ 6', 7: 'Thứ 7', 8: 'Chủ nhật' }
export const thuTuNgay = (ngay: string) => { const d = new Date(ngay + 'T00:00:00').getDay(); return d === 0 ? 8 : d + 1 }
const KHUNG_GIO = Array.from({ length: (22 - 6) * 2 + 1 }, (_, i) => `${String(6 + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`)
const congPhut = (g: string, p: number) => { const [h, m] = g.split(':').map(Number); const t = Math.min(h * 60 + m + p, 22 * 60); return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}` }
export type LopNho = { mon: string; khoi: string | null }

export default function LichKhoiModal({ init, cu, lops, nss, phongs, onClose, onSaved }: {
  init: Partial<LichKhoiInput>
  cu?: LichKhoiInput | null   // dòng đang sửa (null = thêm mới)
  lops: LopNho[]; nss: NhanSu[]; phongs: Phong[]
  onClose: () => void
  onSaved: (id: string) => void
}) {
  const [mon, setMon] = useState(init.mon ?? 'Toán')
  const [khoi, setKhoi] = useState(init.khoi ?? '')
  const [bac, setBac] = useState(init.bac ?? 'A')
  const [thu, setThu] = useState(init.thu ?? 2)
  const [gio, setGio] = useState((init.gio_bat_dau ?? '17:00').slice(0, 5))
  const [gioKt, setGioKt] = useState((init.gio_ket_thuc ?? congPhut((init.gio_bat_dau ?? '17:00').slice(0, 5), 60)).slice(0, 5))
  const [phong, setPhong] = useState<string | null>(init.phong || null)
  const [soTa, setSoTa] = useState<1 | 2>((init.so_ta as 1 | 2) ?? 1)
  const [ns, setNs] = useState<string | null>(init.nhan_su_id || null)
  const [ns2, setNs2] = useState<string | null>(init.nhan_su_2_id || null)
  const [sucChua, setSucChua] = useState(String(init.suc_chua ?? 3))
  const [tu, setTu] = useState(init.hieu_luc_tu ?? homNayVN())
  const [ghiChu, setGhiChu] = useState(init.ghi_chu ?? '')
  const [trung, setTrung] = useState<TrungLichKhoi[] | null>(null)
  const [dangKiem, setDangKiem] = useState(false)
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)

  const mons = useMemo(() => [...new Set(lops.map((l) => l.mon))].sort(), [lops])
  const khois = useMemo(() => [...new Set(lops.filter((l) => l.mon === mon).map((l) => l.khoi).filter(Boolean) as string[])].sort((a, b) => a.localeCompare(b, 'vi', { numeric: true })), [lops, mon])
  const nsOpts = useMemo(() => nss.map((n) => ({ id: n.id, label: n.ho_ten, sub: n.ma_ns })), [nss])
  const phongOpts = useMemo(() => phongs.map((p) => ({ id: p.ma_phong, label: p.ten_phong, sub: p.suc_chua != null ? `${p.suc_chua} chỗ` : undefined })), [phongs])
  const ns2Hieu = soTa === 2 ? ns2 : null
  // Sửa mà không đổi thứ/giờ/người (vd chỉ gán phòng) ⇒ DB không kiểm lại trùng người (trùng đó có từ trước) — xem trước cho khớp.
  const kiemNguoi = !cu || !(cu.thu === thu && cu.gio_bat_dau.slice(0, 5) === gio && cu.gio_ket_thuc.slice(0, 5) === gioKt && cu.nhan_su_id === ns && (cu.nhan_su_2_id ?? null) === ns2Hieu)

  useEffect(() => {
    if (gioKt <= gio || (!phong && !ns)) { setTrung(null); return }
    let alive = true
    setDangKiem(true)
    const t = setTimeout(() => {
      kiemTrungLichKhoi({ thu, gio_bat_dau: gio, gio_ket_thuc: gioKt, phong, nhan_su_id: kiemNguoi ? ns : null, nhan_su_2_id: kiemNguoi ? ns2Hieu : null, hieu_luc_tu: tu, bo_qua: cu?.id ?? null })
        .then((r) => { if (alive) setTrung(r) }).catch((e: any) => { if (alive) setLoi(e?.message ?? String(e)) }).finally(() => { if (alive) setDangKiem(false) })
    }, 350)
    return () => { alive = false; clearTimeout(t) }
  }, [thu, gio, gioKt, phong, ns, ns2Hieu, tu, kiemNguoi]) // eslint-disable-line react-hooks/exhaustive-deps

  const coChan = !!trung?.some((t) => t.muc === 'chan')
  const coCanhBao = !!trung?.some((t) => t.muc === 'canh_bao')

  async function luu(chapNhan: boolean) {
    if (!khoi) { setLoi('Chọn khối'); return }
    if (!phong) { setLoi('Chọn phòng'); return }
    if (!ns) { setLoi('Mỗi ca phải có người trực'); return }
    if (soTa === 2 && (!ns2 || ns2 === ns)) { setLoi('Ca 2 TA phải chọn người trực thứ 2 (khác người 1)'); return }
    if (gioKt <= gio) { setLoi('Giờ kết thúc phải sau giờ bắt đầu'); return }
    if (!(Number(sucChua) >= 1)) { setLoi('Sức chứa ≥ 1'); return }
    setLoi(null); setBusy(true)
    try {
      const r = await luuLichKhoi({ id: cu?.id ?? null, mon, khoi, bac, thu, gio_bat_dau: gio, gio_ket_thuc: gioKt, phong, so_ta: soTa, nhan_su_id: ns, nhan_su_2_id: ns2Hieu, suc_chua: Number(sucChua), hieu_luc_tu: tu, ghi_chu: ghiChu.trim() || null }, chapNhan)
      if (!r.ok) { setTrung(r.trung); setBusy(false); return }
      onSaved(r.id!)
    } catch (e: any) { setLoi(e?.message ?? String(e)); setBusy(false) }
  }

  const sel = 'w-full rounded-lg border border-slate-300 px-2 py-1.5 text-[13px] outline-none focus:border-teal-500'
  const lbl = 'mb-1 block text-[11px] font-medium text-slate-500'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="max-h-[92vh] w-full max-w-[640px] overflow-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between rounded-t-2xl bg-teal-600 px-5 py-3 text-white">
          <h2 className="text-[15px] font-bold">{cu ? 'Sửa lịch bổ trợ khối' : 'Thêm lịch bổ trợ khối'}</h2>
          <button onClick={onClose} className="rounded-md px-2 text-[18px] leading-none hover:bg-white/15">×</button>
        </div>
        <div className="space-y-3 p-5">
          <div className="grid grid-cols-3 gap-3">
            <div><label className={lbl}>Môn</label>
              <select value={mon} onChange={(e) => { setMon(e.target.value); setKhoi('') }} className={sel}>{mons.map((m) => <option key={m} value={m}>{m}</option>)}</select></div>
            <div><label className={lbl}>Khối *</label>
              <select value={khoi} onChange={(e) => setKhoi(e.target.value)} className={sel}><option value="">— chọn —</option>{khois.map((k) => <option key={k} value={k}>Khối {k}</option>)}{khoi && !khois.includes(khoi) && <option value={khoi}>Khối {khoi}</option>}</select></div>
            <div><label className={lbl}>Bậc ca <span className="font-normal text-slate-400">(nhận HS bậc ≤)</span></label>
              <select value={bac} onChange={(e) => setBac(e.target.value)} className={sel}>{['S', 'A', 'B', 'C'].map((b) => <option key={b} value={b}>{b}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className={lbl}>Thứ (hằng tuần)</label>
              <select value={thu} onChange={(e) => setThu(Number(e.target.value))} className={sel}>{[2, 3, 4, 5, 6, 7, 8].map((t) => <option key={t} value={t}>{THU_TEN[t]}</option>)}</select></div>
            <div><label className={lbl}>Bắt đầu</label>
              <select value={gio} onChange={(e) => { setGio(e.target.value); setGioKt(congPhut(e.target.value, 60)) }} className={`${sel} tabular-nums`}>{KHUNG_GIO.map((g) => <option key={g} value={g}>{g}</option>)}</select></div>
            <div><label className={lbl}>Kết thúc</label>
              <select value={gioKt} onChange={(e) => setGioKt(e.target.value)} className={`${sel} tabular-nums`}>{KHUNG_GIO.filter((g) => g > gio).map((g) => <option key={g} value={g}>{g}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className={lbl}>Phòng *</label><SearchSelect value={phong} onChange={setPhong} options={phongOpts} placeholder="Chọn phòng…" invalid={!phong} /></div>
            <div><label className={lbl}>Số TA</label>
              <select value={soTa} onChange={(e) => { const n = Number(e.target.value) as 1 | 2; setSoTa(n); setSucChua(String(3 * n)) }} className={sel}><option value={1}>1 TA</option><option value={2}>2 TA</option></select></div>
            <div><label className={lbl}>Sức chứa (em/ca)</label><input type="number" min={1} value={sucChua} onChange={(e) => setSucChua(e.target.value)} className={sel} /></div>
          </div>
          <div className={`grid gap-3 ${soTa === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <div><label className={lbl}>Người trực{soTa === 2 ? ' 1' : ''} *</label><SearchSelect value={ns} onChange={setNs} options={nsOpts} placeholder="Chọn người…" invalid={!ns} /></div>
            {soTa === 2 && <div><label className={lbl}>Người trực 2 *</label><SearchSelect value={ns2} onChange={setNs2} options={nsOpts} placeholder="Chọn người…" invalid={!ns2} /></div>}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className={lbl}>Áp dụng từ ngày</label><input type="date" value={tu} disabled={!!cu} onChange={(e) => setTu(e.target.value)} className={`${sel} disabled:bg-slate-50 disabled:text-slate-400`} /></div>
            <div className="col-span-2"><label className={lbl}>Ghi chú</label><input value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} placeholder="vd: trực chung với lớp 8B2…" className={sel} /></div>
          </div>

          {/* Báo trùng — DB tính trên lịch phòng chung, 4 tuần tới */}
          <TrungPhongList trung={trung} dangKiem={dangKiem} goiY="Chọn phòng / người trực để kiểm trùng." />
          {loi && <p className="text-[12px] text-rose-600">{loi}</p>}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button onClick={onClose} className="rounded-lg px-4 py-2 text-[13px] text-slate-500 hover:bg-slate-100">Đóng</button>
            {coCanhBao && !coChan && (
              <button onClick={() => luu(true)} disabled={busy} className="rounded-lg bg-amber-500 px-4 py-2 text-[13px] font-semibold text-white hover:bg-amber-600 disabled:opacity-50">Vẫn xếp (ghép phòng)</button>
            )}
            <button onClick={() => luu(false)} disabled={busy || coChan || coCanhBao}
              title={coChan ? 'Còn chỗ trùng — đổi giờ/phòng/người trực' : undefined}
              className="rounded-lg bg-teal-600 px-5 py-2 text-[13px] font-semibold text-white hover:bg-teal-700 disabled:opacity-40">{busy ? 'Đang lưu…' : cu ? 'Lưu' : 'Thêm lịch'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
