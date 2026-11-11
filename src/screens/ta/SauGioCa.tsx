// BỔ TRỢ SAU GIỜ (= L1, Thùy 11/11 — nâng cấp từ Bổ trợ Nhẹ). Khối thay bước 2–4 của CaDetail khi ca là ca sau giờ:
//   · 3 thứ IN RIÊNG, người in tự chọn (có em không cần lý thuyết, có em không cần luyện): 📘 lý thuyết · ✏️ bài luyện · 📝 bài test.
//   · Bài test = mỗi dạng yếu trong nhóm yếu 1 câu (DB chọn, fn_btnhe_in_test). TA NHẬP đáp án em khoanh → Nộp = XONG ca (như ET).
// Mọi chọn câu / chấm / đóng ca ở DB. Dùng lại TrangIn + NhapKetQua của phiếu giấy bổ trợ yếu, khung lý thuyết của kho (LyThuyetBlockView).
import { useEffect, useState } from 'react'
import { MathText, LT_CORE_CSS, LyThuyetBlockView } from '../kho/ui'
import { parseLyThuyetBlocks } from '../../lib/lythuyetBlocks'
import { inSinhBaiGiay, inLayBaiGiay, listPhieuGiayCuaCa, type BaiInGiay, type CaTA } from '../../lib/botro_yeu_ca'
import { inLyThuyetSauGio, inTestSauGio, type LyThuyetSauGio } from '../../lib/botro_nhe'
import { TrangIn, NhapKetQua } from './PhieuGiayYeuTA'
import { ddmmVN, thuCuaNgay } from '../../lib/tuan'

export default function SauGioCa({ ca, onDoi }: { ca: CaTA; onDoi: () => void }) {
  const [busy, setBusy] = useState<string | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)
  const [soCau, setSoCau] = useState(3)
  const [phieu, setPhieu] = useState<{ bai_test_id: string; so_cau: number; in_giay_at: string }[]>([])
  const [phieuIn, setPhieuIn] = useState<BaiInGiay | null>(null)
  const [phieuNhap, setPhieuNhap] = useState<BaiInGiay | null>(null)
  const [lt, setLt] = useState<LyThuyetSauGio | null>(null)
  const taiPhieu = () => listPhieuGiayCuaCa(ca.buoi_id).then(setPhieu).catch(() => {})
  useEffect(() => { taiPhieu() }, [ca.buoi_id]) // eslint-disable-line

  const xong = !!ca.danh_gia_xong_at
  const dong = xong || ca.trang_thai !== 'mo'
  const coTest = !!ca.test
  const daNop = !!ca.test?.da_nop
  const soDang = ca.dangs.filter((d) => !d.dong_at).length

  async function chay(k: string, f: () => Promise<void>) {
    setBusy(k); setLoi(null); setOk(null)
    try { await f() } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(null) }
  }
  const inLyThuyet = () => chay('lt', async () => setLt(await inLyThuyetSauGio(ca.buoi_id)))
  const inLuyen = () => chay('luyen', async () => {
    const r = await inSinhBaiGiay(ca.buoi_id, soCau)
    if (r.dang_khong_co_cau.length) setOk(`Phiếu luyện ${r.so_cau} câu — ${r.dang_khong_co_cau.length} dạng chưa có câu trong kho.`)
    setPhieuIn(await inLayBaiGiay(r.bai_test_id)); taiPhieu()
  })
  const inTest = () => chay('test', async () => {
    const r = await inTestSauGio(ca.buoi_id)
    if (r.dang_khong_co_cau.length) setOk(`Bài test ${r.so_cau} câu — chưa có câu cho: ${r.dang_khong_co_cau.join(', ')}.`)
    setPhieuIn(await inLayBaiGiay(r.bai_test_id)); if (!r.da_co) onDoi()
  })
  const nhapTest = () => chay('nhap', async () => { const r = await inTestSauGio(ca.buoi_id); setPhieuNhap(await inLayBaiGiay(r.bai_test_id)) })

  const nut = 'rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition disabled:opacity-40'
  return (
    <>
      {loi && <p className="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</p>}
      {ok && <p className="mb-3 rounded-xl bg-amber-50 px-3 py-2 text-[12.5px] text-amber-800">{ok}</p>}

      <div className="mb-3 rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-sm">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[12px] font-bold text-white">2</span>
          <p className="text-[14px] font-bold text-slate-800">In tài liệu — chọn thứ em cần</p>
          <span className="ml-auto text-[11.5px] text-slate-400">{soDang} dạng · dạng thuộc nhóm yếu in trước</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          <button disabled={!!busy || soDang === 0} onClick={inLyThuyet} className={`${nut} border border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100`}>
            📘 {busy === 'lt' ? 'Đang lấy…' : 'In lý thuyết'}<span className="mt-0.5 block text-[11.5px] font-normal text-sky-700/80">lý thuyết + ví dụ từng dạng</span>
          </button>
          <div className={`${nut} border border-indigo-200 bg-indigo-50 text-indigo-800`}>
            <button disabled={!!busy || dong || soDang === 0} onClick={inLuyen} className="w-full text-left disabled:opacity-40">✏️ {busy === 'luyen' ? 'Đang chọn câu…' : 'In bài luyện'}</button>
            <span className="mt-1 flex items-center gap-1 text-[11.5px] font-normal">
              {[3, 5, 8].map((n) => <button key={n} onClick={() => setSoCau(n)} className={`rounded px-1.5 ${soCau === n ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-700 ring-1 ring-indigo-200'}`}>{n}</button>)}
              <span className="text-indigo-700/80">câu mỗi dạng</span>
            </span>
          </div>
          <button disabled={!!busy || dong || soDang === 0} onClick={inTest} className={`${nut} border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100`}>
            📝 {busy === 'test' ? 'Đang chọn câu…' : coTest ? 'In lại bài test' : 'In bài test'}<span className="mt-0.5 block text-[11.5px] font-normal text-amber-800/80">{coTest ? `${ca.test!.so_cau} câu` : '1 câu mỗi dạng yếu trong nhóm yếu'}</span>
          </button>
        </div>
        {phieu.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5 text-[12px]">
            {phieu.map((g, i) => (
              <button key={g.bai_test_id} onClick={() => chay(g.bai_test_id, async () => setPhieuIn(await inLayBaiGiay(g.bai_test_id)))}
                className="rounded-lg border border-slate-200 px-2 py-1 text-slate-600 hover:bg-slate-50">🖨 Phiếu luyện {i + 1} · {g.so_cau} câu</button>
            ))}
          </div>
        )}
      </div>

      <div className={`mb-3 rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-sm ${!coTest && !xong ? 'opacity-60' : ''}`}>
        <div className="mb-2 flex items-center gap-2">
          <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-bold ${xong ? 'bg-emerald-500 text-white' : coTest ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>{xong ? '✓' : 3}</span>
          <p className="text-[14px] font-bold text-slate-800">Nhập kết quả bài test</p>
        </div>
        {xong ? <p className="text-[13px] font-semibold text-emerald-700">✓ Đã nhập & nộp — xong ca sau giờ. Kết quả đã vào mastery.</p>
          : !coTest ? <p className="text-[13px] text-slate-500">In bài test ở khối trên, em làm tại chỗ, rồi nhập đáp án em khoanh ở đây.</p>
          : daNop ? <p className="text-[13px] text-slate-600">Đã nộp.</p>
          : <button disabled={!!busy} onClick={nhapTest} className="w-full rounded-xl bg-emerald-600 py-2.5 text-[14px] font-bold text-white disabled:opacity-50">{busy === 'nhap' ? '…' : '✍ Nhập kết quả & nộp'}</button>}
      </div>

      {lt && <TrangInLyThuyet bai={lt} onDong={() => setLt(null)} />}
      {phieuIn && <TrangIn bai={phieuIn} onDong={() => setPhieuIn(null)} />}
      {phieuNhap && <NhapKetQua bai={phieuNhap} onDong={() => { setPhieuNhap(null); onDoi() }} />}
    </>
  )
}

// Bản in LÝ THUYẾT: mỗi dạng 1 mục (lý thuyết + ví dụ), khung theo kí hiệu ##ĐL/##PP/##VD… giống bản in giáo trình.
function NoiDung({ text }: { text: string }) {
  return <>{parseLyThuyetBlocks(text).map((b, i) => b.loai === 'text'
    ? <div key={i} className="my-1"><MathText>{b.noiDung}</MathText></div>
    : <LyThuyetBlockView key={i} b={b} />)}</>
}
export function TrangInLyThuyet({ bai, onDong }: { bai: LyThuyetSauGio; onDong: () => void }) {
  return (
    <div className="bk-print fixed inset-0 z-[100] overflow-auto bg-white">
      <style>{`@media print { body * { visibility: hidden !important; } .bk-print, .bk-print * { visibility: visible !important; } .bk-print { position: absolute !important; inset: 0 auto auto 0 !important; width: 100% !important; overflow: visible !important; } .bk-no-print { display: none !important; } .bk-dang { break-inside: avoid-page; } }${LT_CORE_CSS}`}</style>
      <div className="bk-no-print sticky top-0 z-10 flex items-center gap-2 border-b border-slate-200 bg-white/95 px-4 py-2">
        <span className="text-[13px] font-semibold text-slate-700">Xem trước lý thuyết — {bai.hs.ho_ten} · {bai.dang.length} dạng</span>
        <button onClick={() => window.print()} className="ml-auto rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-indigo-700">🖨 In</button>
        <button onClick={onDong} className="rounded-lg border border-slate-200 px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50">Đóng</button>
      </div>
      <div className="mx-auto max-w-[800px] px-8 py-6 text-[14px] leading-relaxed text-slate-900">
        <div className="mb-4 border-b-2 border-slate-800 pb-2">
          <div className="flex items-baseline justify-between">
            <h1 className="text-[18px] font-bold">BK ACADEMY — LÝ THUYẾT BỔ TRỢ SAU GIỜ · {bai.mon}</h1>
            <span className="text-[12px]">{thuCuaNgay(bai.ngay)} {ddmmVN(bai.ngay)}</span>
          </div>
          <div className="mt-1 text-[13px]">Họ tên: <b>{bai.hs.ho_ten}</b> ({bai.hs.ma_hs}) · Khối {bai.hs.khoi}</div>
        </div>
        {bai.dang.map((d, i) => (
          <section key={d.ma_dang} className="bk-dang mb-6">
            <h2 className="mb-1 border-b border-slate-300 pb-1 text-[15px] font-bold">Dạng {i + 1}. {d.ten_dang}</h2>
            {d.ly_thuyet ? <NoiDung text={d.ly_thuyet} /> : <p className="text-[12.5px] italic text-slate-400">Dạng này chưa có lý thuyết trong bản đồ.</p>}
            {d.file_url && <a href={d.file_url} className="text-[12px] text-indigo-600">📎 Tài liệu kèm</a>}
            {d.vi_du && <div className="mt-2"><NoiDung text={d.vi_du.includes('##') ? d.vi_du : '##VD\n' + d.vi_du} /></div>}
          </section>
        ))}
      </div>
    </div>
  )
}
