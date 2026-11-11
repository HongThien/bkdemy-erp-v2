// XƯỞNG ẢNH VINH DANH FB (Thùy 11/11): popup xem ảnh + ĐỔI NỀN (bấm tranh nền) + CHỌN ẢNH HS từ kho ảnh của em
// (1 em có thể có nhiều ảnh; chọn 1 ⇒ lưu làm ảnh vinh danh của em, lần sau mở lại vẫn là ảnh đó) + thêm ảnh mới + tải PNG.
// Số liệu gọi 1 lần lúc mở (fn_vinh_danh_hs); đổi nền / đổi ảnh chỉ vẽ lại ở máy, không gọi lại DB.
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  veVinhDanhFB, getVinhDanhData, getKhoAnh, chonAnhChanDung, uploadAnhChanDung, nenUrl, PHONG_CACH,
  type LoaiNen, type PhongCach, type VinhDanhData, type AnhKho,
} from './vinhDanhFB'

// Nền chọn gần nhất — sống tới F5, mở em kế tiếp vẫn dùng nền đó.
const NHO = { nen: 'hoanggia' as PhongCach }

export default function XuongAnhFB({ hsId, mon, ym, loai, tenFile, onClose, onDoiAnh }: {
  hsId: string; mon: string; ym: string; loai: LoaiNen; tenFile: string
  onClose: () => void; onDoiAnh?: (url: string) => void
}) {
  const [data, setData] = useState<VinhDanhData | null>(null)
  const [kho, setKho] = useState<AnhKho[]>([])
  const [anh, setAnh] = useState<string | null>(null)
  const [nen, setNen] = useState<PhongCach>(NHO.nen)
  const [png, setPng] = useState<string | null>(null)
  const [dangVe, setDangVe] = useState(false)
  const [dangTai, setDangTai] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const luot = useRef(0)

  useEffect(() => {
    let huy = false
    Promise.all([getVinhDanhData(hsId, mon, ym), getKhoAnh(hsId)])
      .then(([d, k]) => { if (huy) return; setData(d); setKho(k); setAnh(d.anhChanDung ?? null) })
      .catch((e) => { if (!huy) setLoi((e as Error).message) })
    return () => { huy = true }
  }, [hsId, mon, ym])

  useEffect(() => {
    if (!data) return
    const id = ++luot.current
    setDangVe(true)
    veVinhDanhFB({ ...data, anhChanDung: anh }, loai, nen)
      .then((cv) => { if (id === luot.current) setPng(cv.toDataURL('image/png')) })
      .catch((e) => { if (id === luot.current) setLoi((e as Error).message) })
      .finally(() => { if (id === luot.current) setDangVe(false) })
  }, [data, anh, nen, loai])

  function doiNen(id: PhongCach) { NHO.nen = id; setNen(id) }
  async function doiAnh(url: string) {
    if (url === anh) return
    const cu = anh
    setAnh(url)
    try { await chonAnhChanDung(hsId, url); onDoiAnh?.(url) }
    catch (e) { setAnh(cu); setLoi((e as Error).message) }
  }
  async function themAnh(files: FileList | null) {
    if (!files?.length) return
    setDangTai(true); setLoi(null)
    try {
      let cuoi = ''
      for (const f of Array.from(files)) {
        cuoi = await uploadAnhChanDung(hsId, f)
        const moi = cuoi
        setKho((p) => [{ id: moi, url: moi, tai_at: new Date().toISOString() }, ...p])
      }
      setAnh(cuoi); onDoiAnh?.(cuoi)
    } catch (e) { setLoi((e as Error).message) }
    finally { setDangTai(false) }
  }

  const nhom = [...new Set(PHONG_CACH.map((p) => p.nhom))]
  return createPortal(
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3">
      <div onClick={(e) => e.stopPropagation()} className="flex max-h-[96vh] w-full max-w-[1100px] flex-col gap-3 overflow-hidden rounded-2xl bg-white p-3 shadow-2xl md:flex-row">
        <div className="relative flex min-h-[300px] flex-1 items-center justify-center rounded-xl bg-slate-100">
          {png ? <img src={png} alt="" className={`max-h-[88vh] max-w-full rounded-lg shadow transition-opacity ${dangVe ? 'opacity-60' : ''}`} />
            : <span className="text-sm text-slate-400">{loi ? '' : 'Đang dựng ảnh…'}</span>}
          {dangVe && png && <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-slate-600">Đang vẽ…</span>}
        </div>
        <div className="flex w-full shrink-0 flex-col gap-3 overflow-y-auto md:w-[330px]">
          <div className="flex items-center justify-between">
            <div className="text-[15px] font-extrabold text-slate-800">{data?.hoTen ?? '…'} <span className="text-[12px] font-semibold text-slate-400">{data?.lop ?? ''}</span></div>
            <button onClick={onClose} className="rounded-md px-2 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">✕</button>
          </div>
          {loi && <div className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1.5 text-[12px] text-rose-600">⚠️ {loi}</div>}

          <section>
            <div className="mb-1.5 text-[12px] font-bold uppercase tracking-wide text-slate-500">Ảnh học sinh <span className="font-normal normal-case text-slate-400">· {kho.length} ảnh — bấm để chọn</span></div>
            <div className="grid grid-cols-4 gap-1.5">
              {kho.map((a) => (
                <button key={a.id} onClick={() => void doiAnh(a.url)} title="Dùng ảnh này"
                  className={`relative aspect-[4/5] overflow-hidden rounded-lg border-2 ${a.url === anh ? 'border-amber-500 ring-2 ring-amber-200' : 'border-transparent hover:border-slate-300'}`}>
                  <img src={a.url} alt="" className="h-full w-full object-cover" loading="lazy" />
                  {a.url === anh && <span className="absolute right-0.5 top-0.5 rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">✓</span>}
                </button>
              ))}
              <label className={`flex aspect-[4/5] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-slate-400 hover:border-amber-400 hover:text-amber-600 ${dangTai ? 'pointer-events-none opacity-60' : ''}`}>
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { void themAnh(e.target.files); e.target.value = '' }} />
                <span className="text-[20px] leading-none">{dangTai ? '⏳' : '+'}</span>
                <span className="mt-1 text-[10.5px] font-semibold">{dangTai ? 'Đang tải' : 'Thêm ảnh'}</span>
              </label>
            </div>
          </section>

          <section>
            <div className="mb-1.5 text-[12px] font-bold uppercase tracking-wide text-slate-500">Nền</div>
            {nhom.map((nh) => (
              <div key={nh} className="mb-2">
                <div className="mb-1 text-[11px] font-semibold text-slate-400">{nh}</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {PHONG_CACH.filter((p) => p.nhom === nh).map((p) => (
                    <button key={p.id} onClick={() => doiNen(p.id)} title={p.ten}
                      className={`overflow-hidden rounded-lg border-2 text-left ${p.id === nen ? 'border-amber-500 ring-2 ring-amber-200' : 'border-transparent hover:border-slate-300'}`}>
                      <img src={nenUrl(p.id, loai)} alt="" className="aspect-[4/5] w-full object-cover" loading="lazy" />
                      <div className="truncate bg-white px-1 py-0.5 text-[10.5px] font-semibold text-slate-600">{p.ten}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <div className="sticky bottom-0 mt-auto flex gap-2 bg-white pt-1">
            {png && !dangVe
              ? <a href={png} download={tenFile} className="flex-1 rounded-lg bg-amber-500 px-4 py-2 text-center text-sm font-bold text-white shadow hover:bg-amber-400">⬇ Tải ảnh</a>
              : <span className="flex-1 rounded-lg bg-amber-200 px-4 py-2 text-center text-sm font-bold text-white">⬇ Tải ảnh</span>}
            <button onClick={onClose} className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Đóng</button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
