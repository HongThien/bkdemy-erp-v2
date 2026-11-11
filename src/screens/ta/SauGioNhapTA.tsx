// BỔ TRỢ SAU GIỜ — app TA (Thùy 11/11): "màn hình chính hiện Bổ trợ sau giờ, click vào hiện 1 tab có học sinh và từng câu tương ứng điền DCS".
// TA KHÔNG mở ca (GV/trưởng khối đã mở + in). Mỗi em 1 thẻ: Câu 1…n, mỗi câu 3 nút Đ / C / S (bấm lại ô đang chọn = xoá).
// Lưu TỪNG Ô ngay (fn_btnhe_nhap_dcs), vá tại chỗ. "Xong" = nộp (fn_btyeu_giay_nop: ô trống tính sai, nộp ⇒ xong ca, vào mastery).
// Mọi số ở DB. Class màu literal (luật app TA).
import { useEffect, useState } from 'react'
import { taNhapDs, nhapDcs, type EmNhapSauGio } from '../../lib/botro_nhe'
import { nopTestGiay } from '../../lib/botro_yeu_ca'
import { BKTabHeader, MaHS } from '../../components/bk/BKUI'
import { ddmmVN, thuCuaNgay, homNayVN } from '../../lib/tuan'

const NHO: { ds: EmNhapSauGio[] | null } = { ds: null }   // nhớ tới F5 (rời tab quay lại = đúng chỗ cũ)
const MAU: Record<string, string> = { D: 'bg-[#1E8A52] text-white', C: 'bg-[#C27A00] text-white', S: 'bg-[#C0355A] text-white' }

export default function SauGioNhapTA({ onBack, onDoi }: { onBack: () => void; onDoi: () => void }) {
  const [ds, setDs] = useState<EmNhapSauGio[] | null>(NHO.ds)
  const [loi, setLoi] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [hoiNop, setHoiNop] = useState<string | null>(null)
  const homNay = homNayVN()
  const vaDs = (f: (x: EmNhapSauGio[]) => EmNhapSauGio[]) => setDs((cu) => { const moi = cu ? f(cu) : cu; NHO.ds = moi; return moi })
  // nền: giữ list cũ tới khi có list mới
  const tai = () => taNhapDs().then((r) => { NHO.ds = r; setDs(r); setLoi(null) }).catch((e) => setLoi(e?.message ?? String(e)))
  useEffect(() => { tai() }, [])

  async function chon(e: EmNhapSauGio, cauId: string, kq: 'D' | 'C' | 'S') {
    const cu = e.caus.find((k) => k.id === cauId)?.kq ?? null
    const moi = cu === kq ? null : kq
    vaDs((l) => l.map((x) => x.buoi_id === e.buoi_id ? { ...x, caus: x.caus.map((k) => k.id === cauId ? { ...k, kq: moi } : k) } : x))
    try { await nhapDcs(cauId, moi) }
    catch (err: any) { setLoi(err?.message ?? String(err)); vaDs((l) => l.map((x) => x.buoi_id === e.buoi_id ? { ...x, caus: x.caus.map((k) => k.id === cauId ? { ...k, kq: cu } : k) } : x)) }
  }
  async function nop(e: EmNhapSauGio) {
    setBusy(e.buoi_id); setLoi(null)
    try { await nopTestGiay(e.bai_test_id); vaDs((l) => l.map((x) => x.buoi_id === e.buoi_id ? { ...x, da_nop: true, xong: true } : x)); setHoiNop(null); onDoi() }
    catch (err: any) { setLoi(err?.message ?? String(err)) } finally { setBusy(null) }
  }

  const choNhap = (ds ?? []).filter((x) => !x.da_nop)
  return (
    <div>
      <BKTabHeader onBack={onBack} icon="/bk-ui/pr_et.png" title="Bổ trợ sau giờ"
        sub={ds === null ? 'Đang tải…' : choNhap.length ? `${choNhap.length} em chờ nhập kết quả` : 'Không còn em nào chờ nhập ✓'} />
      <div className="mx-auto flex max-w-[1000px] flex-col gap-2 px-2 pb-6">
        {loi && <p className="rounded-xl bg-[#FFE3EA] px-3 py-2 text-[12.5px] font-semibold text-[#C0355A]">{loi}</p>}
        <p className="px-1 text-[11.5px] text-[#63709A]">Bấm <b className="text-[#1E8A52]">Đ</b> đúng · <b className="text-[#C27A00]">C</b> chưa trọn · <b className="text-[#C0355A]">S</b> sai cho từng câu (bấm lại để xoá). Đủ thì bấm <b>Xong</b>.</p>
        {ds !== null && ds.length === 0 && <p className="rounded-[20px] bg-white/80 px-3 py-3 text-[13px] text-[#63709A]">Chưa có bài test sau giờ nào — giáo viên in bài test xong thì em hiện ở đây.</p>}
        {(ds ?? []).map((e) => {
          const daNhap = e.caus.filter((k) => k.kq).length
          return (
            <div key={e.buoi_id} className={`rounded-[20px] p-3 ${e.da_nop ? 'bg-[#E4F8EC]' : 'bg-white/90'}`}>
              <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-[15px] font-extrabold text-[#16224D]">{e.ho_ten}</span><MaHS ma={e.ma_hs} />
                <span className="text-[12px] text-[#63709A]">{e.ten_lop} · {e.ngay === homNay ? 'hôm nay' : `${thuCuaNgay(e.ngay)} ${ddmmVN(e.ngay)}`}</span>
                <span className="ml-auto text-[12px] font-bold text-[#63709A]">{e.da_nop ? '✓ Đã xong' : `${daNhap}/${e.caus.length} câu`}</span>
              </div>
              <div className="grid gap-1.5 [grid-template-columns:repeat(auto-fill,minmax(150px,1fr))]">
                {e.caus.map((k) => (
                  <div key={k.id} className="flex items-center gap-1.5 rounded-xl bg-[#F4F6FB] px-2 py-1.5">
                    <span className="w-12 shrink-0 text-[12px] font-bold text-[#16224D]">Câu {k.thu_tu}</span>
                    {(['D', 'C', 'S'] as const).map((v) => (
                      <button key={v} disabled={e.da_nop} onClick={() => chon(e, k.id, v)}
                        className={`h-8 w-8 rounded-full text-[13px] font-extrabold transition disabled:opacity-60 ${k.kq === v ? MAU[v] : 'bg-white text-[#63709A] ring-1 ring-[#D8DEEC]'}`}>{v === 'D' ? 'Đ' : v}</button>
                    ))}
                  </div>
                ))}
              </div>
              {!e.da_nop && (hoiNop === e.buoi_id ? (
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[12.5px]">
                  <span className="text-[#C27A00]">{daNhap < e.caus.length ? `Còn ${e.caus.length - daNhap} câu chưa nhập — tính SAI. ` : ''}Nộp rồi không sửa được nữa.</span>
                  <button disabled={busy === e.buoi_id} onClick={() => nop(e)} className="rounded-xl bg-[#1E8A52] px-4 py-1.5 font-bold text-white disabled:opacity-50">{busy === e.buoi_id ? '…' : 'Nộp'}</button>
                  <button onClick={() => setHoiNop(null)} className="px-2 text-[#63709A]">Thôi</button>
                </div>
              ) : (
                <button disabled={daNhap === 0} onClick={() => setHoiNop(e.buoi_id)} className="mt-2 w-full rounded-xl bg-[#2F73F6] py-2 text-[13.5px] font-bold text-white disabled:opacity-40">Xong · nộp kết quả</button>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
