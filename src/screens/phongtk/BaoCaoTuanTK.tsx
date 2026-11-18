// BÁO CÁO TUẦN TRƯỞNG KHỐI (spec-bao-cao-tuan.md · Thùy 03/11) — mở từ đồ vật "📝 Báo cáo tuần" trong Phòng làm việc.
// Kỳ = T2 → CN tuần trước. Nháp: số tính trực tiếp ở DB. Bấm NỘP: DB tính + ghi SNAP cùng transaction — từ đó chỉ đọc bản đã snap.
// Client KHÔNG tính số nào: mọi tỉ lệ / tổng / trend đến từ fn_bctk_so · fn_bctk_trend. Màn chỉ hiển thị + nhận phần chữ / phần cá nhân.
// Thùy 18/11: full màn · 3 tab con Vận hành · Học tập · Phát triển cá nhân (NoiDungBaoCao.tsx) · Tự viết ở cột phải.
import { useEffect, useState } from 'react'
import { layBaoCaoTuan, luuNhapBaoCao, nopBaoCao, type BaoCaoTuan, type DongCaNhan, type TuViet } from '../../lib/baoCaoTuan'
import { NoiDungBaoCao } from './NoiDungBaoCao'
import { congNgay, ddmmVN } from '../../lib/tuan'
import { nhoBen } from '../../lib/nho'

const NHO = nhoBen<{ tuan: string | null }>('bao_cao_tuan_tk', { tuan: null }, { trongNgay: ['tuan'] })   // tuần đang xem — nhớ qua F5 trong ngày (lib/nho)
const TT: Record<string, [string, string]> = {
  nhap: ['Nháp — chưa nộp', 'bg-slate-100 text-slate-600'], da_nop: ['Đã nộp — chờ duyệt', 'bg-sky-100 text-sky-700'],
  tra_lai: ['Bị trả lại — sửa phần chữ rồi nộp lại', 'bg-amber-100 text-amber-800'], da_duyet: ['Đã duyệt', 'bg-emerald-100 text-emerald-700'],
}
const gio = (ts: string | null) => ts ? new Date(ts).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : '—'

export default function BaoCaoTuanTK() {
  const [tuan, setTuanS] = useState<string | null>(NHO.tuan)
  const setTuan = (t: string) => { NHO.tuan = t; setTuanS(t) }
  const [bc, setBc] = useState<BaoCaoTuan | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [caNhan, setCaNhan] = useState<DongCaNhan[]>([])
  const [tuViet, setTuViet] = useState<TuViet>({})
  const [dang, setDang] = useState<'' | 'luu' | 'nop'>('')
  const [bao, setBao] = useState<string | null>(null)

  useEffect(() => {   // đổi tuần = đổi ngữ cảnh ⇒ tải lại
    let con = true
    setBc(null); setLoi(null)
    layBaoCaoTuan(tuan ?? undefined).then((d) => {
      if (!con) return
      setBc(d); setCaNhan(d.ca_nhan ?? []); setTuViet(d.tu_viet ?? {})
      if (!tuan && d.tuan) { NHO.tuan = d.tuan; setTuanS(d.tuan) }
    }).catch((e) => { if (con) setLoi(e?.message ?? String(e)) })
    return () => { con = false }
  }, [tuan])

  const sua = bc ? bc.trang_thai === 'nhap' || bc.trang_thai === 'tra_lai' : false
  const uuTien = [0, 1, 2].map((i) => tuViet.uu_tien?.[i] ?? '')
  const thieu = !(tuViet.nhan_dinh ?? '').trim() || !uuTien.some((u) => u.trim())
  const bao2s = (m: string) => { setBao(m); setTimeout(() => setBao(null), 2200) }
  async function luu() {
    if (!bc) return
    setDang('luu')
    try { await luuNhapBaoCao(bc.tuan, caNhan, tuViet); bao2s('Đã lưu nháp') } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setDang('') }
  }
  async function nop() {
    if (!bc) return
    setDang('nop')
    try { const d = await nopBaoCao(bc.tuan, caNhan, tuViet); setBc(d); setCaNhan(d.ca_nhan ?? []); setTuViet(d.tu_viet ?? {}); bao2s('Đã nộp — số đã được chốt') }
    catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setDang('') }
  }
  const doiTuan = (n: number) => bc && setTuan(congNgay(bc.tuan, 7 * n))

  if (loi && !bc) return <p className="text-[13px] text-rose-600">Lỗi: {loi}</p>
  if (!bc) return <p className="text-[13px] text-slate-400">Đang tính báo cáo…</p>
  if (!bc.co_bao_cao) return <p className="text-[13px] text-slate-500">Bạn chưa được phân công làm trưởng khối ô nào, nên không có báo cáo tuần.</p>
  const ten = (o: { mon: string; khoi: string }) => `${o.mon === 'Toán' ? '' : `${o.mon} `}${o.khoi}`
  return (
    <div className="space-y-3">
      {/* 1 hàng: kỳ · đổi tuần · khối · hạn · trạng thái · nút */}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => doiTuan(-1)} className="rounded-lg border border-slate-200 px-2 py-1 text-[13px] hover:bg-slate-50" title="Tuần trước">‹</button>
        <span className="text-[15px] font-bold text-slate-800">Báo cáo tuần {ddmmVN(bc.tuan)} – {ddmmVN(bc.den)}</span>
        <button onClick={() => doiTuan(1)} className="rounded-lg border border-slate-200 px-2 py-1 text-[13px] hover:bg-slate-50" title="Tuần sau">›</button>
        <span className="text-[12.5px] text-slate-500">Khối {bc.o.map(ten).join(' · ')}</span>
        <span className={`rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${TT[bc.trang_thai][1]}`}>{TT[bc.trang_thai][0]}</span>
        <span className={`text-[12px] ${bc.qua_han && bc.trang_thai === 'nhap' ? 'font-semibold text-rose-600' : 'text-slate-500'}`}>
          Hạn {gio(bc.han)}{bc.nop_at ? ` · nộp ${gio(bc.nop_at)}${bc.tre ? ' (trễ)' : ''}` : ''}
        </span>
        <span className="ml-auto flex items-center gap-2">
          {bao && <span className="text-[12.5px] text-emerald-600">{bao}</span>}
          {loi && <span className="max-w-[360px] truncate text-[12px] text-rose-600" title={loi}>{loi}</span>}
          {sua && <button onClick={luu} disabled={!!dang} className="rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">{dang === 'luu' ? 'Đang lưu…' : 'Lưu nháp'}</button>}
          {sua && (
            <button onClick={nop} disabled={!!dang || thieu || !bc.ky_xong}
              title={!bc.ky_xong ? 'Tuần chưa kết thúc' : thieu ? 'Cần Nhận định + ít nhất 1 việc ưu tiên' : 'Nộp — số được chốt, không tính lại'}
              className="rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-indigo-700 disabled:opacity-40">
              {dang === 'nop' ? 'Đang nộp…' : bc.trang_thai === 'tra_lai' ? 'Nộp lại' : 'Nộp báo cáo'}
            </button>
          )}
        </span>
      </div>
      {bc.trang_thai === 'tra_lai' && bc.tra_lai_ly_do && <p className="rounded-lg bg-amber-50 px-3 py-1.5 text-[12.5px] text-amber-800">Lý do trả lại: {bc.tra_lai_ly_do}</p>}
      <p className="text-[11.5px] text-slate-400">
        {bc.trang_thai === 'nhap' ? 'Số đang tính trực tiếp — bấm Nộp thì số được chốt (snap), không tính lại.' : `Số đã chốt lúc nộp ${gio(bc.nop_at)}.`}
        {!bc.so.co_anh_dau && ' · Chưa có ảnh dạng yếu đầu tuần (hệ chụp tự động 00:00 thứ 2 — bắt đầu từ tuần này) nên chưa so được dạng yếu / HS yếu.'}
      </p>

      <NoiDungBaoCao duLieu={bc.so} caNhan={caNhan} setCaNhan={setCaNhan} tuViet={tuViet} setTuViet={setTuViet} sua={sua} />
    </div>
  )
}

// Phần nội dung (3 tab con Vận hành · Học tập · Phát triển cá nhân) ở NoiDungBaoCao.tsx — xuất lại cho các màn đang import từ đây.
export { NoiDungBaoCao, O, Khung } from './NoiDungBaoCao'
