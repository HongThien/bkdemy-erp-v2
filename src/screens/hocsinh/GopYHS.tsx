// GÓP Ý & BÁO LỖI của học sinh (spec-v1-app-hs.md §6, hạng mục V1 #8 · backlog V2). Vào từ menu ⋯ ở màn chính và từ Hồ sơ.
// Trên: form gửi (Báo lỗi / Góp ý tưởng · 10–1.500 chữ · ảnh tuỳ chọn: chọn tệp hoặc dán). Dưới: "Góp ý của em" — trạng thái dễ hiểu + lời trả lời của thầy cô.
// Luật (độ dài, 5 lần/ngày, ảnh hợp lệ) nằm ở DB (fn_hs_gui_gop_y) — màn chỉ báo trước cho em đỡ gửi hỏng, lỗi thật lấy từ DB.
// Gửi xong ⇒ thêm đúng dòng vừa gửi lên đầu danh sách (không tải lại cả danh sách — CLAUDE §2). Mở màn ⇒ đánh dấu đã đọc lời trả lời.
import { useEffect, useRef, useState } from 'react'
import { DauTrangHS, HEAD, MAU, ManHS, NhanHS, NhomHS, NutHS, THE_TRON, TheHS, TrongHS, useMonHS } from './skin/KhungHS'
import { GOP_Y_TOI_DA_MOI_NGAY, TEN_TRANG_THAI_GOP_Y, danhDauDaDocGopY, gopYCuaToi, guiGopY, type GopYCuaToi, type LoaiGopY, type TrangThaiGopY } from '../../lib/gopy_hs'

const TOI_THIEU = 10, TOI_DA = 1500
const LOAI: { id: LoaiGopY; ten: string; goiY: string }[] = [
  { id: 'bug', ten: 'Báo lỗi', goiY: 'Em đang làm gì thì gặp lỗi? Màn hình hiện ra sao? (vd: bấm "Nộp bài" ở Tự luyện thì app đứng im)' },
  { id: 'yeu_cau', ten: 'Góp ý tưởng', goiY: 'Em muốn app có thêm gì, hoặc sửa chỗ nào cho dễ dùng hơn?' },
]
const MAU_TT: Record<TrangThaiGopY, string> = { da_nhan: MAU.muted, dang_xem: MAU.canhBao, da_xu_ly: MAU.dung, chua_lam_duoc: MAU.sai }
const ngayGio = (iso: string) => new Date(iso).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' })

export default function GopYHS({ onBack, tu }: { onBack: () => void; tu?: string }) {
  const mon = useMonHS()
  const [loai, setLoai] = useState<LoaiGopY>('bug')
  const [moTa, setMoTa] = useState('')
  const [anh, setAnh] = useState<Blob | null>(null)
  const [xemAnh, setXemAnh] = useState<string | null>(null)
  const [dang, setDang] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [vuaGui, setVuaGui] = useState<string | null>(null)
  const [ds, setDs] = useState<GopYCuaToi[] | null | undefined>(undefined)
  const tep = useRef<HTMLInputElement>(null)

  useEffect(() => {
    gopYCuaToi().then((d) => { setDs(d); if (d.some((x) => x.tra_loi_moi)) danhDauDaDocGopY().catch(() => {}) }).catch(() => setDs(null))
  }, [])
  useEffect(() => () => { if (xemAnh) URL.revokeObjectURL(xemAnh) }, [xemAnh])

  const datAnh = (b: Blob | null) => { setAnh(b); setXemAnh(b ? URL.createObjectURL(b) : null) }
  const dai = moTa.trim().length
  const gui = async () => {
    if (dang || dai < TOI_THIEU || dai > TOI_DA) return
    setDang(true); setLoi(null); setVuaGui(null)
    try {
      const r = await guiGopY({
        loai, moTa: moTa.trim(), anh, route: tu ?? 'gop_y',
        context: { mon, man_rong: window.innerWidth, man_cao: window.innerHeight, doc: window.matchMedia('(orientation: portrait)').matches, ua: navigator.userAgent },
      })
      setDs((cu) => [{ id: r.id, loai, mo_ta: moTa.trim(), anh_url: null, at: new Date().toISOString(), trang_thai: 'da_nhan', tra_loi: null, tra_loi_at: null, tra_loi_moi: false }, ...(cu ?? [])])
      setMoTa(''); datAnh(null)
      setVuaGui(`Đã gửi! Thầy cô sẽ xem và trả lời ở mục "Góp ý của em" bên dưới. Hôm nay em còn gửi được ${r.con_lai_hom_nay} lần.`)
    } catch (e) {
      setLoi((e as Error).message || 'Chưa gửi được, em thử lại nhé.')
    } finally { setDang(false) }
  }

  const l = LOAI.find((x) => x.id === loai)!
  return (
    <ManHS rong="hep">
      <DauTrangHS tieuDe="Góp ý & báo lỗi" phu="Giúp BK làm app tốt hơn mỗi ngày" onBack={onBack} />
      <TheHS className="flex flex-col gap-3 p-4">
        <div className="flex gap-2" role="tablist">
          {LOAI.map((x) => (
            <button key={x.id} role="tab" aria-selected={loai === x.id} onClick={() => setLoai(x.id)} className="flex-1 py-2 text-[15.5px] font-bold"
              style={loai === x.id ? { background: MAU.acc, color: MAU.accInk, borderRadius: 'var(--sk-radius-pill)', fontFamily: 'var(--sk-font-head)' }
                : { ...THE_TRON, borderRadius: 'var(--sk-radius-pill)', fontFamily: 'var(--sk-font-head)' }}>{x.ten}</button>
          ))}
        </div>
        <textarea value={moTa} onChange={(e) => setMoTa(e.target.value.slice(0, TOI_DA))} rows={5} placeholder={l.goiY}
          onPaste={(e) => { const f = [...e.clipboardData.items].find((i) => i.type.startsWith('image/'))?.getAsFile(); if (f) { e.preventDefault(); datAnh(f) } }}
          className="w-full resize-y p-3 text-[16px] leading-relaxed outline-none"
          style={{ background: MAU.surface2, color: MAU.ink, border: `1px solid ${MAU.line}`, borderRadius: 'var(--sk-radius)' }} />
        <div className="flex items-center justify-between gap-2 text-[13px]" style={{ color: dai > 0 && dai < TOI_THIEU ? MAU.canhBao : MAU.muted }}>
          <span>{dai > 0 && dai < TOI_THIEU ? `Viết thêm ${TOI_THIEU - dai} chữ nữa nhé` : `Tối đa ${GOP_Y_TOI_DA_MOI_NGAY} lần mỗi ngày`}</span>
          <span>{dai}/{TOI_DA}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input ref={tep} type="file" accept="image/*" className="hidden" onChange={(e) => { datAnh(e.target.files?.[0] ?? null); e.target.value = '' }} />
          {xemAnh
            ? <span className="flex items-center gap-2">
                <img src={xemAnh} alt="Ảnh đính kèm" className="h-16 w-16 object-cover" style={{ borderRadius: 'var(--sk-radius)', border: `1px solid ${MAU.line}` }} />
                <button onClick={() => datAnh(null)} className="text-[14.5px] font-bold" style={{ color: MAU.muted }}>Bỏ ảnh</button>
              </span>
            : <NutHS phu onClick={() => tep.current?.click()} className="!h-9 !px-3 !text-[14.5px]">📎 Đính kèm ảnh chụp</NutHS>}
          <span className="text-[13px]" style={{ color: MAU.muted }}>(không bắt buộc · dán ảnh vào ô chữ cũng được)</span>
        </div>
        {loi && <p className="text-[14.5px]" style={{ color: MAU.sai }}>{loi}</p>}
        {vuaGui && <p className="text-[14.5px] font-bold" style={{ color: MAU.dung }}>{vuaGui}</p>}
        <NutHS onClick={gui} tat={dang || dai < TOI_THIEU}>{dang ? 'Đang gửi…' : `Gửi ${l.ten.toLowerCase()}`}</NutHS>
      </TheHS>

      <NhomHS>Góp ý của em</NhomHS>
      {ds === undefined ? <TrongHS>Đang tải…</TrongHS>
        : ds === null ? <TrongHS>Chưa tải được danh sách, em mở lại sau nhé.</TrongHS>
        : !ds.length ? <TrongHS>Em chưa gửi góp ý nào.</TrongHS>
        : ds.map((g) => (
          <TheHS key={g.id} className="flex flex-col gap-2 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[15.5px] font-bold" style={HEAD}>{g.loai === 'bug' ? 'Báo lỗi' : 'Góp ý tưởng'}</span>
              <NhanHS mau={MAU_TT[g.trang_thai]}>{TEN_TRANG_THAI_GOP_Y[g.trang_thai]}</NhanHS>
              {g.tra_loi_moi && <NhanHS dac>Mới</NhanHS>}
              <span className="ml-auto text-[13px]" style={{ color: MAU.muted }}>{ngayGio(g.at)}</span>
            </div>
            <p className="whitespace-pre-wrap text-[15.5px] leading-relaxed" style={{ color: MAU.ink }}>{g.mo_ta}</p>
            {g.anh_url && <a href={g.anh_url} target="_blank" rel="noreferrer"><img src={g.anh_url} alt="Ảnh em gửi" className="max-h-40 object-contain" style={{ borderRadius: 'var(--sk-radius)' }} /></a>}
            {g.tra_loi && (
              <div className="p-3 text-[15.5px] leading-relaxed" style={{ background: MAU.surface2, borderRadius: 'var(--sk-radius)', borderLeft: `3px solid ${MAU.acc}` }}>
                <p className="mb-1 text-[13px] font-bold" style={{ color: MAU.acc }}>Thầy cô trả lời{g.tra_loi_at ? ` · ${ngayGio(g.tra_loi_at)}` : ''}</p>
                <p className="whitespace-pre-wrap" style={{ color: MAU.ink }}>{g.tra_loi}</p>
              </div>
            )}
          </TheHS>
        ))}
    </ManHS>
  )
}
