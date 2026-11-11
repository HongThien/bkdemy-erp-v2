// 3 NÚT IN bổ trợ sau giờ cho 1 em — dùng chung ở danh sách HS của ca (Thùy 11/11 "đưa ra chỗ danh sách học sinh thành các nút luôn")
// và trong màn ca (SauGioCa). 📘 lý thuyết in thẳng · ✏️ bài luyện / 📝 bài test mở khung SOẠN (builder) rồi mới lưu & in.
import { useState } from 'react'
import { inLyThuyetSauGio, type LyThuyetSauGio } from '../../lib/botro_nhe'
import type { BaiInGiay } from '../../lib/botro_yeu_ca'
import InSauGioET from './InSauGioET'
import { TrangInLyThuyet } from '../ta/SauGioCa'
import SoanBaiSauGio from './SoanBaiSauGio'

export default function NutInSauGio({ buoiId, dong, daNop, gon, lop, onDoi }: {
  buoiId: string; dong: boolean; daNop: boolean; gon?: boolean; lop?: string | null; onDoi?: () => void
}) {
  const [lt, setLt] = useState<LyThuyetSauGio | null>(null)
  const [soan, setSoan] = useState<'luyen' | 'test' | null>(null)
  const [phieu, setPhieu] = useState<BaiInGiay | null>(null)
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  async function inLt() {
    setBusy(true); setLoi(null)
    try { setLt(await inLyThuyetSauGio(buoiId)) } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(false) }
  }
  const nut = gon
    ? 'rounded-md px-1.5 py-0.5 text-[15px] leading-none hover:bg-slate-100 disabled:opacity-30'
    : 'rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition disabled:opacity-40'
  return (
    <span className={gon ? 'inline-flex items-center gap-0.5' : 'grid gap-2 sm:grid-cols-3'} onClick={(e) => e.stopPropagation()}>
      <button title="In lý thuyết + ví dụ" disabled={busy} onClick={inLt} className={gon ? nut : `${nut} border border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100`}>
        📘{!gon && <> In lý thuyết<span className="mt-0.5 block text-[11.5px] font-normal text-sky-700/80">lý thuyết + ví dụ từng dạng</span></>}
      </button>
      <button title="Soạn & in bài luyện" disabled={dong} onClick={() => setSoan('luyen')} className={gon ? nut : `${nut} border border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100`}>
        ✏️{!gon && <> Soạn & in bài luyện<span className="mt-0.5 block text-[11.5px] font-normal text-indigo-700/80">sửa câu như builder trước khi in</span></>}
      </button>
      <button title={daNop ? 'Bài test đã nhập — không sửa được' : 'Soạn & in bài test'} disabled={dong || daNop} onClick={() => setSoan('test')} className={gon ? nut : `${nut} border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100`}>
        📝{!gon && <> Soạn & in bài test<span className="mt-0.5 block text-[11.5px] font-normal text-amber-800/80">1 câu mỗi dạng yếu trong nhóm yếu</span></>}
      </button>
      {loi && <span className="basis-full text-[11.5px] text-rose-600">{loi}</span>}
      {lt && <TrangInLyThuyet bai={lt} onDong={() => setLt(null)} />}
      {soan && <SoanBaiSauGio buoiId={buoiId} loai={soan} onDong={() => setSoan(null)} onIn={(b) => { setSoan(null); setPhieu(b); onDoi?.() }} />}
      {phieu && <InSauGioET bais={[phieu]} lop={lop} onDong={() => setPhieu(null)} />}
    </span>
  )
}
