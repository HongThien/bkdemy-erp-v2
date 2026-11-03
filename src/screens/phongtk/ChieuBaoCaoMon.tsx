// CHIẾU TV — Báo cáo Chuyên môn tuần của một môn (spec-bao-cao-tuan.md §2.9, P4 · Thùy 03/11: "chiếu lên tivi để báo cáo cho t xem").
// Khuôn y hệt trình chiếu Tổng kết tuần (troly/TongKetTuan): lớp phủ kín cửa sổ (toàn màn hình chỉ là phần cộng thêm — nơi trình duyệt
// từ chối vẫn chiếu được) · phím → ↓ PageDown Space = sau, ← ↑ PageUp = trước, Home / End, Esc = thoát · mục lục bấm thẳng tới trang ·
// mỗi trang co giãn VỪA KHÍT màn (VuaMan) — đọc được từ xa, không phải cuộn.
// Thứ tự trang: Tổng môn (5 ô chỉ số) → Từng lớp toàn môn → mỗi khối một trang (5 ô chỉ số + tự viết của trưởng khối) → HS yếu chưa xử lý → Nhận xét.
// Số = đúng dữ liệu báo cáo môn (đã chốt thì là bản snap); trang vẽ lại bằng NoiDungBaoCao — cùng một khuôn với màn thường.
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { BaoCaoMon, KhoiGhep, TuViet } from '../../lib/baoCaoTuan'
import { ddmmVN } from '../../lib/tuan'
import { VuaMan } from '../troly/TongKetTuan'
import { NoiDungBaoCao } from './BaoCaoTuanTK'

const RONG = 1240
const tenO = (o: { mon: string; khoi: string }) => `${o.mon === 'Toán' ? '' : `${o.mon} `}${o.khoi}`
const khong = () => {}
// rong = khổ gốc của trang: trang ít nội dung lấy khổ HẸP ⇒ VuaMan phóng to hơn (chữ to đọc từ xa); bảng dài lấy khổ rộng.
type Trang = { ma: string; ten: string; noiDung: React.ReactNode; rong: number }

function TuVietLon({ tv }: { tv: TuViet }) {
  const ut = (tv.uu_tien ?? []).filter((u) => u.trim())
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
        <p className="text-[12px] font-bold uppercase tracking-wide text-slate-500">Nhận định</p>
        <p className="mt-1 whitespace-pre-wrap text-[15px] leading-relaxed text-slate-800">{tv.nhan_dinh || '—'}</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
        <p className="text-[12px] font-bold uppercase tracking-wide text-slate-500">Ưu tiên tuần tới</p>
        {ut.length ? <ol className="mt-1 list-decimal pl-5 text-[15px] leading-relaxed text-slate-800">{ut.map((u, i) => <li key={i}>{u}</li>)}</ol> : <p className="mt-1 text-[15px] text-slate-400">—</p>}
      </div>
      <div className="rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3">
        <p className="text-[12px] font-bold uppercase tracking-wide text-amber-700">Cần hỗ trợ</p>
        <p className="mt-1 whitespace-pre-wrap text-[15px] leading-relaxed text-slate-800">{tv.can_ho_tro?.trim() || '—'}</p>
      </div>
    </div>
  )
}

function dungTrang(bc: BaoCaoMon): Trang[] {
  const trang: Trang[] = []
  trang.push({
    ma: 'tong', ten: `Tổng môn ${bc.mon}`, rong: 760,
    noiDung: (
      <div className="space-y-3">
        {bc.o_thieu.length > 0 && <p className="rounded-xl bg-rose-50 px-4 py-2 text-[15px] text-rose-700">Chưa có báo cáo được ghép: khối {bc.o_thieu.map(tenO).join(' · ')}</p>}
        <NoiDungBaoCao duLieu={bc.tong} caNhan={[]} setCaNhan={khong} tuViet={{}} setTuViet={khong} sua={false} anChu phan="o" />
      </div>
    ),
  })
  trang.push({   // bảng từng lớp toàn môn — trang riêng (bảng dài, để chung trang thì chữ quá nhỏ)
    ma: 'lop', ten: `Từng lớp — ${bc.mon}`, rong: RONG,
    noiDung: <NoiDungBaoCao duLieu={bc.tong} caNhan={[]} setCaNhan={khong} tuViet={{}} setTuViet={khong} sua={false} anChu phan="lop" />,
  })
  for (const k of bc.cac_khoi) {
    trang.push({
      ma: `k:${k.id}`, ten: `Khối ${k.o.map(tenO).join(' · ')}`, rong: 980,
      noiDung: (
        <div className="space-y-3">
          <p className="text-[15px] text-slate-500">Trưởng khối <b className="text-slate-800">{k.ho_ten}</b>{k.tre ? <b className="text-rose-600"> · nộp trễ</b> : ''}</p>
          <NoiDungBaoCao duLieu={k.so} caNhan={[]} setCaNhan={khong} tuViet={{}} setTuViet={khong} sua={false} anChu phan="o" />
          <TuVietLon tv={k.tu_viet ?? {}} />
        </div>
      ),
    })
  }
  // HS yếu CHƯA XỬ LÝ — lọc từ danh sách các khối đã snap (lọc hiển thị, không tính)
  const chua = bc.cac_khoi.map((k) => ({ k, ds: k.so.hs_con_yeu.filter((h) => h.xu_ly === 'chua') })).filter((x) => x.ds.length)
  trang.push({
    ma: 'hs_chua', ten: 'HS yếu chưa xử lý', rong: 1100,
    noiDung: chua.length === 0
      ? <p className="rounded-xl bg-emerald-50 px-4 py-6 text-center text-[18px] text-emerald-700">Không còn em yếu nào chưa được xử lý. 👏</p>
      : (
        <div className="grid grid-cols-2 gap-3">
          {chua.map(({ k, ds }: { k: KhoiGhep; ds: KhoiGhep['so']['hs_con_yeu'] }) => (
            <div key={k.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="mb-1.5 text-[14px] font-bold text-slate-700">Khối {k.o.map(tenO).join(' · ')} — {ds.length} em</p>
              <ul className="space-y-1">{ds.map((h) => (
                <li key={`${h.hoc_sinh_id}|${h.mon}`} className="flex items-baseline gap-2 text-[14px]">
                  <b className="text-slate-800">{h.ho_ten}</b><span className="text-slate-500">{h.ten_lop} · {h.so_dang_yeu} dạng yếu</span>
                </li>
              ))}</ul>
            </div>
          ))}
        </div>
      ),
  })
  trang.push({
    ma: 'nhan_xet', ten: 'Nhận xét trưởng bộ môn', rong: 860,
    noiDung: (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-5">
        <p className="whitespace-pre-wrap text-[20px] leading-relaxed text-slate-800">{bc.nhan_xet?.trim() || 'Chưa có nhận xét.'}</p>
        {bc.chot_boi && <p className="mt-3 text-[14px] text-slate-500">— {bc.chot_boi}</p>}
      </div>
    ),
  })
  return trang
}

function TrinhChieu({ bc, thoat }: { bc: BaoCaoMon; thoat: () => void }) {
  const trang = dungTrang(bc)
  const [i, setI] = useState(0)
  const n = trang.length
  const vt = Math.min(i, n - 1)
  const t = trang[vt]
  const sang = (k: number) => setI((x) => Math.max(0, Math.min(n - 1, Math.min(x, n - 1) + k)))
  useEffect(() => {
    const nghe = (e: KeyboardEvent) => {
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); sang(1) }
      else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); sang(-1) }
      else if (e.key === 'Home') setI(0)
      else if (e.key === 'End') setI(n - 1)
      else if (e.key === 'Escape') thoat()
    }
    window.addEventListener('keydown', nghe)
    return () => window.removeEventListener('keydown', nghe)
  }, [n]) // eslint-disable-line
  const nut = 'rounded-xl border border-slate-300 bg-white px-4 py-2 text-[16px] font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-30'
  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-slate-200 bg-white px-6 py-3">
        <div className="min-w-0">
          <div className="text-[14px] text-slate-500">
            Báo cáo Chuyên môn tuần {ddmmVN(bc.tuan)} – {ddmmVN(bc.den)} · {bc.mon}
            {bc.trang_thai === 'da_chot' ? ' · đã chốt' : ' · bản nháp (số đang tính trực tiếp)'}
          </div>
          <div className="text-[26px] font-semibold leading-tight text-slate-900">{t.ten}</div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {/* nút ‹ không bắt đầu bằng "←" ⇒ hook useNutQuayVe không ẩn; vẫn gắn no-nut-ve cho chắc */}
          <button onClick={() => sang(-1)} disabled={vt === 0} className={`no-nut-ve ${nut}`}>‹ Trước</button>
          <span className="min-w-[64px] text-center text-[16px] tabular-nums text-slate-600">{vt + 1} / {n}</span>
          <button onClick={() => sang(1)} disabled={vt === n - 1} className={nut}>Sau ›</button>
          <button onClick={thoat} className={nut}>Thoát</button>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col px-6 pt-4">
        <VuaMan key={t.ma} rong={t.rong}>{t.noiDung}</VuaMan>
      </div>
      <div className="flex flex-wrap justify-center gap-1.5 border-t border-slate-200 bg-white px-6 py-2.5">
        {trang.map((x, j) => (
          <button key={x.ma} onClick={() => setI(j)}
            className={`rounded-full border px-3 py-1 text-[13px] font-medium ${j === vt ? 'border-indigo-500 bg-indigo-600 text-white' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'}`}>
            {j + 1}. {x.ten}
          </button>
        ))}
      </div>
    </div>
  )
}

// Nút "📺 Chiếu TV" + lớp phủ trình chiếu (portal ra body, xin toàn màn hình SAU khi lớp phủ đã vẽ — bị từ chối thì vẫn chiếu).
export default function NutChieuBaoCaoMon({ bc }: { bc: BaoCaoMon }) {
  const [chieu, setChieu] = useState(false)
  const khung = useRef<HTMLDivElement>(null)
  const vaoLuc = useRef(0)
  useEffect(() => {
    // Esc lúc toàn màn hình ⇒ trình duyệt tự thoát ⇒ mình cũng thoát; bị đẩy ra ngay trong 1 giây (khung nhúng) thì chiếu tiếp.
    const nghe = () => {
      if (document.fullscreenElement) { vaoLuc.current = Date.now(); return }
      if (Date.now() - vaoLuc.current > 1000) setChieu(false)
    }
    document.addEventListener('fullscreenchange', nghe)
    return () => document.removeEventListener('fullscreenchange', nghe)
  }, [])
  const mo = () => { setChieu(true); requestAnimationFrame(() => { khung.current?.requestFullscreen?.().catch(() => {}) }) }
  const thoat = () => { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); setChieu(false) }
  return (
    <>
      <button onClick={mo} className="rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] font-semibold text-slate-700 hover:bg-slate-50">📺 Chiếu TV</button>
      {chieu && createPortal(<div ref={khung} className="fixed inset-0 z-[1000] bg-slate-50"><TrinhChieu bc={bc} thoat={thoat} /></div>, document.body)}
    </>
  )
}
