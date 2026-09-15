// 🚨 CHUÔNG BÁO ĐỘNG "HS kém dạng" — 1 component DÙNG CHUNG cho ERP (Đánh giá sau buổi · ET · BTVN · MT)
// và app GV/TA. Trước 09/09 có 3 bản chuông chép tay (AlertModal ERP · ChuongDo app GV · NutChuongDo app TA)
// lệch nhau: ERP disable khi lưới chấm chưa gắn dạng (41/44 buổi ⇒ mờ suốt), app thì bấm được, MT không có.
//
// ⭐ LUẬT CHUNG (CEO 09/09) cho MỌI chuông, kể cả BTVN: bấm chuông → hiện DANH SÁCH DẠNG CÓ TRONG TÀI LIỆU
// của phase đó (giáo trình buổi / đề ET / phiếu BTVN / đề MT — xem `loadDangTaiLieuBuoi`) + 1 Ô GHI CHÚ.
// Chọn được NHIỀU dạng một lượt (mỗi dạng = 1 dòng canh_bao_yeu, chung ghi chú). Tài liệu chưa gán / thiếu
// dạng thì vẫn "Chọn dạng khác trong kho" (DangPickerOne) — chuông KHÔNG BAO GIỜ bị mờ vì thiếu dữ liệu.
// Tín hiệu KHÔNG vào điểm — là kênh ③ "chuông đỏ" khi duyệt bổ trợ yếu (lib/danhgia.ts).
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import DangPickerOne from './DangPickerOne'
import {
  themCanhBao, xoaCanhBao, loadDangTaiLieuBuoi, getDangTen, TEN_NGUON_CANH_BAO,
  type CanhBao, type DangTaiLieu, type NguonCanhBao,
} from '../lib/gami'

/** Nạp 1 lần / tab: dạng có trong tài liệu của (buổi, phase). Tab truyền xuống từng hàng HS, không fetch per-HS. */
export function useDangTaiLieu(buoiId: string, nguon: NguonCanhBao, mon?: string | null): { dang: DangTaiLieu[]; loading: boolean } {
  const [dang, setDang] = useState<DangTaiLieu[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let alive = true
    setDang([]); setLoading(true)
    loadDangTaiLieuBuoi(buoiId, nguon, mon)
      .then((d) => { if (alive) setDang(d) })
      .catch(() => { /* tài liệu lỗi ⇒ list rỗng, vẫn chọn kho được */ })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [buoiId, nguon, mon])
  return { dang, loading }
}

/** Danh sách dạng cho popup = dạng TRONG TÀI LIỆU (luật CEO 09/09). Chỉ khi buổi KHÔNG có tài liệu / tài liệu
 *  không có dạng mới lấy tạm dạng đã gắn ở lưới chấm (`them`) để không rơi vào list rỗng. KHÔNG trộn cả hai:
 *  lưới MT 9S1 06/09 còn giữ mã dạng cũ (T309…) không tra được tên ⇒ trộn vào là chip mã vô nghĩa xen giữa (verify 09/09). */
export function hopDang(taiLieu: DangTaiLieu[], them: (string | null | undefined)[], ten: (md: string) => string): DangTaiLieu[] {
  if (taiLieu.length) return taiLieu
  const out: DangTaiLieu[] = []
  for (const md of them) if (md && !out.some((d) => d.ma_dang === md)) out.push({ ma_dang: md, ten: ten(md) })
  return out
}

export function ChuongBaoDong({ buoiId, hsId, hsTen, nguon, khoi, mon, dangTaiLieu, dangLoading, batBuocGhiChu, nhan, className, onSaved }: {
  buoiId: string; hsId: string; hsTen: string; nguon: NguonCanhBao
  khoi?: string | null; mon?: string | null
  dangTaiLieu: DangTaiLieu[]; dangLoading?: boolean
  /** Đánh giá sau buổi: ghi chú BẮT BUỘC (CEO 31/08 — GV phải ghi rõ kém chỗ nào). Chỗ khác tuỳ chọn. */
  batBuocGhiChu?: boolean
  /** Chữ cạnh 🚨 (app: "Báo bổ trợ"); ERP để trống cho gọn ô. */
  nhan?: string
  className?: string
  onSaved: () => void
}) {
  const [mo, setMo] = useState(false)
  const [pick, setPick] = useState(false)
  const [chon, setChon] = useState<string[]>([])
  const [themKho, setThemKho] = useState<DangTaiLieu[]>([]) // dạng chọn từ kho (ngoài tài liệu)
  const [ghiChu, setGhiChu] = useState('')
  const [busy, setBusy] = useState(false)
  const tenNguon = TEN_NGUON_CANH_BAO[nguon]
  const dsDang = [...dangTaiLieu, ...themKho.filter((d) => !dangTaiLieu.some((x) => x.ma_dang === d.ma_dang))]
  const toggle = (md: string) => setChon((c) => (c.includes(md) ? c.filter((x) => x !== md) : [...c, md]))
  const okGui = !busy && chon.length > 0 && (!batBuocGhiChu || !!ghiChu.trim())

  function moModal() { setChon([]); setThemKho([]); setGhiChu(''); setMo(true) }
  async function gui() {
    if (!okGui) return
    setBusy(true)
    try {
      // Mỗi dạng 1 dòng (đơn vị chân lý = HS × dạng), chung ghi chú. Tuần tự để lỗi dòng nào biết dòng đó.
      for (const md of chon) await themCanhBao({ buoiId, hocSinhId: hsId, maDang: md, ghiChu: ghiChu.trim() || undefined, nguon })
      setMo(false); onSaved()
    } catch (e: any) { alert(e.message ?? String(e)) } finally { setBusy(false) }
  }
  async function chonTuKho(md: string) {
    setPick(false)
    if (!dsDang.some((d) => d.ma_dang === md)) {
      const ten = await getDangTen([md], mon ?? undefined).catch(() => ({} as Record<string, string>))
      setThemKho((t) => [...t, { ma_dang: md, ten: ten[md] ?? md }])
    }
    setChon((c) => (c.includes(md) ? c : [...c, md]))
  }

  return (
    <>
      <button type="button" onClick={moModal} title={`Báo động: ${hsTen} kém dạng — chọn dạng trong tài liệu ${tenNguon} + ghi chú`}
        className={className ?? 'shrink-0 rounded border border-rose-200 px-1.5 py-0.5 text-[12px] text-rose-600 hover:bg-rose-50 active:bg-rose-100'}>
        🚨{nhan ? ` ${nhan}` : ''}
      </button>
      {/* Portal ra body: nút nằm trong ô sticky của bảng chấm (stacking context z-10) — render tại chỗ thì
          cột "Học sinh"/thead (z-30) ĐÈ LÊN modal dù modal z-50 (đã dính khi verify 09/09). */}
      {mo && createPortal(
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-3 sm:items-center" onClick={() => setMo(false)}>
          <div className="max-h-[92vh] w-full max-w-[520px] overflow-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:p-5" onClick={(e) => e.stopPropagation()}>
            <p className="mb-1 text-[14px] font-bold text-slate-900">🚨 Báo động: {hsTen} đang kém dạng</p>
            <p className="mb-3 text-[11.5px] text-slate-400">Chỗ bấm: <b className="text-slate-500">{tenNguon}</b>. Tín hiệu này KHÔNG vào điểm — để hệ thống xét bổ trợ cho HS.</p>

            <p className="mb-1 text-[11.5px] font-semibold text-slate-500">Dạng có trong tài liệu {tenNguon} của buổi này — tick dạng HS kém:</p>
            {dangLoading ? (
              <p className="mb-2 text-[12px] text-slate-400">Đang tải dạng của tài liệu…</p>
            ) : dsDang.length === 0 ? (
              <p className="mb-2 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[12px] text-amber-800">Buổi này chưa có tài liệu {tenNguon} (hoặc tài liệu chưa gắn dạng) — chọn dạng trong kho bên dưới.</p>
            ) : (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {dsDang.map((d) => {
                  const on = chon.includes(d.ma_dang)
                  const kho = !dangTaiLieu.some((x) => x.ma_dang === d.ma_dang)
                  return (
                    <button key={d.ma_dang} type="button" onClick={() => toggle(d.ma_dang)} title={d.ma_dang}
                      className={`min-h-[36px] max-w-full rounded-lg border px-2.5 text-left text-[12.5px] font-medium ${on ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50 active:bg-slate-100'}`}>
                      <span className="line-clamp-2">{on ? '✓ ' : ''}{d.ten}{kho ? <span className="ml-1 text-[10px] font-normal text-slate-400">(kho)</span> : null}</span>
                    </button>
                  )
                })}
              </div>
            )}
            <button type="button" onClick={() => setPick(true)} disabled={!khoi} title={khoi ? '' : 'Lớp chưa có khối — không mở được kho'}
              className="mb-3 min-h-[38px] w-full rounded-lg border border-dashed border-slate-300 px-2.5 text-left text-[12.5px] text-slate-500 hover:border-slate-400 hover:text-slate-700 disabled:opacity-40">
              + Chọn dạng khác trong kho{khoi ? ` (Khối ${khoi})` : ''}
            </button>

            <textarea value={ghiChu} onChange={(e) => setGhiChu(e.target.value)}
              placeholder={batBuocGhiChu ? 'Ghi chú (bắt buộc): kém chỗ nào, biểu hiện gì…' : 'Ghi chú (tuỳ chọn): kém chỗ nào, biểu hiện gì…'}
              className="mb-3 h-20 w-full rounded-lg border border-slate-300 px-2 py-1 text-[13px]" />
            <div className="flex items-center justify-end gap-2">
              <span className="mr-auto text-[11.5px] text-slate-400">{chon.length ? `Đã chọn ${chon.length} dạng` : 'Chưa chọn dạng nào'}</span>
              <button type="button" onClick={() => setMo(false)} className="min-h-[38px] rounded-lg px-3 text-[13px] text-slate-500 hover:bg-slate-100">Huỷ</button>
              <button type="button" onClick={gui} disabled={!okGui} className="min-h-[38px] rounded-lg bg-rose-600 px-4 text-[13px] font-semibold text-white hover:bg-rose-500 disabled:opacity-40">
                {busy ? 'Đang gửi…' : chon.length > 1 ? `Gửi báo động (${chon.length})` : 'Gửi báo động'}
              </button>
            </div>
          </div>
        </div>, document.body)}
      {pick && createPortal(<DangPickerOne khoi={khoi ?? ''} mon={mon ?? undefined} onClose={() => setPick(false)} onPick={(md) => { void chonTuKho(md) }} />, document.body)}
    </>
  )
}

/** Chip các báo động đã ghi của 1 HS trong buổi (+ ✕ gỡ nếu bấm nhầm). Tên dạng lạ (chọn từ kho) tự tra theo môn. */
export function ChipCanhBao({ cb, tenDang, mon, onChanged, khoaXoa }: {
  cb: CanhBao[]; tenDang: (md: string) => string; mon?: string | null; onChanged: () => void; khoaXoa?: boolean
}) {
  const [tenThem, setTenThem] = useState<Record<string, string>>({})
  const thieu = cb.map((c) => c.ma_dang).filter((md) => tenDang(md) === md && !(md in tenThem))
  useEffect(() => {
    if (!thieu.length) return
    let alive = true
    getDangTen(thieu, mon ?? undefined).then((m) => { if (alive) setTenThem((t) => ({ ...t, ...m })) }).catch(() => { /* giữ mã */ })
    return () => { alive = false }
  }, [thieu.join(',')]) // eslint-disable-line
  if (!cb.length) return null
  const ten = (md: string) => (tenDang(md) !== md ? tenDang(md) : tenThem[md] ?? md)
  return (
    <div className="mt-1 flex max-w-[260px] flex-wrap items-center gap-1">
      {cb.map((c) => (
        <span key={c.id} className="inline-flex items-center gap-1 rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700" title={c.ghi_chu ?? ''}>{ten(c.ma_dang)}
          {!khoaXoa && <button type="button" onClick={async () => { try { await xoaCanhBao(c.id); onChanged() } catch (e: any) { alert(e.message ?? String(e)) } }} className="text-rose-400 hover:text-rose-700">✕</button>}
        </span>
      ))}
    </div>
  )
}
