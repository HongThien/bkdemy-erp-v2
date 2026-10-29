// WIDGET DẠNG YẾU — màn chính ERP (Việc của tôi), Thùy 29/10, spec-truong-khoi.md §8.4.
// Mỗi ô (môn × khối) trong phạm vi của tôi: HS có dạng yếu · số dạng yếu. 2 số: đầu tuần (đóng băng lúc Chốt tuần — chờ P3) → hiện tại.
// Bấm ô ⇒ bảng chi tiết em yếu + trạng thái xử lý · bấm em ⇒ popup (dạng yếu · ET · BTVN như màn Duyệt bổ trợ).
// Số tính ở DB, lưu sẵn; widget gọi làm mới lười theo lô cho tới khi hết em cũ (fn_qlcl_lam_moi). Không tự ẩn số cũ khi đang làm mới.
import { useEffect, useState } from 'react'
import { tongQuanDangYeu, lamMoiDangYeu, hsDangYeu, etBtvnCuaEm, deXuatYeu, dongChayDangYeu, type DongChay, type OTongQuan, type HsDangYeu } from '../../lib/qlcl'
import type { EtBtvn } from '../../lib/botro_tuan'
import { KhoiET, KhoiBTVN } from '../danhgia/DuyetBoTroYeuScreen'

const khoaO = (o: { mon: string; khoi: string }) => `${o.mon}|${o.khoi}`
// Sống tới F5: số đã có (mở lại màn không trắng) + ô đang làm mới (2 lần mount không chạy trùng).
const NHO: { rows: OTongQuan[] | null; dangChay: boolean; nghe: Set<(r: OTongQuan[]) => void> } = { rows: null, dangChay: false, nghe: new Set() }
const phat = (r: OTongQuan[]) => { NHO.rows = r; NHO.nghe.forEach((f) => f(r)) }

// Làm mới tuần tự từng ô (giới hạn tải DB), sau mỗi lô đọc lại tổng quan (rẻ) để số nhảy dần.
async function chayLamMoi() {
  if (NHO.dangChay) return
  NHO.dangChay = true
  try {
    for (let vong = 0; vong < 200; vong++) {
      const o = (NHO.rows ?? []).find((x) => x.so_can_tinh > 0)
      if (!o) break
      await lamMoiDangYeu(o.mon, o.khoi, 10)
      phat(await tongQuanDangYeu())
    }
  } catch { /* lỗi mạng: lần mở sau chạy tiếp */ } finally { NHO.dangChay = false }
}

export default function WidgetDangYeu({ onTaoCaNhe }: { onTaoCaNhe: () => void }) {
  const [rows, setRows] = useState<OTongQuan[] | null>(NHO.rows)
  const [mo, setMo] = useState<OTongQuan | null>(null)
  useEffect(() => {
    NHO.nghe.add(setRows)
    tongQuanDangYeu().then((r) => { phat(r); chayLamMoi() }).catch(() => {})
    return () => { NHO.nghe.delete(setRows) }
  }, [])
  if (!rows || rows.length === 0) return null

  const dangCapNhat = rows.reduce((s, o) => s + o.so_can_tinh, 0) // đếm item đang render (badge)
  return (
    <section className="mb-4">
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-[14px] font-bold text-slate-800">Dạng yếu · khối tôi quản</h3>
        <span className="text-[12px] text-slate-400">{dangCapNhat > 0 ? `⟳ đang cập nhật ${dangCapNhat} em…` : 'bấm 1 ô để xem từng em'}</span>
      </div>
      <div className="grid gap-2.5 [grid-template-columns:repeat(auto-fill,minmax(170px,1fr))]">
        {rows.map((o) => (
          // Card kiểu 1 (CLAUDE.md §6): header màu + thân trắng, gần vuông
          <button key={khoaO(o)} onClick={() => setMo(o)} className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:shadow-md">
            <div className={`px-3 py-1.5 text-[13px] font-bold text-white ${o.so_hs_yeu > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`}>{o.mon} · Khối {o.khoi}</div>
            <div className="px-3 py-2.5">
              <div className="flex items-baseline gap-1.5"><span className="text-[24px] font-bold leading-none text-slate-800">{o.so_hs_yeu}</span><span className="text-[12px] text-slate-500">/ {o.so_hs} HS yếu</span></div>
              <div className="mt-1 flex items-baseline gap-1.5"><span className="text-[18px] font-bold leading-none text-rose-600">{o.so_dang_yeu}</span><span className="text-[12px] text-slate-500">dạng yếu</span></div>
              <p className="mt-2 text-[11px] text-slate-400">
                Đầu tuần: {o.dau_tuan_hs_yeu == null ? '— (chưa chốt)' : `${o.dau_tuan_hs_yeu} HS · ${o.dau_tuan_dang_yeu} dạng`}
              </p>
              {o.so_can_tinh > 0 && <p className="text-[11px] text-indigo-500">⟳ còn {o.so_can_tinh} em chưa cập nhật</p>}
            </div>
          </button>
        ))}
      </div>
      {mo && <BangChiTiet o={mo} onDong={() => setMo(null)} onTaoCaNhe={onTaoCaNhe} />}
    </section>
  )
}

function ChipTrangThai({ h }: { h: HsDangYeu }) {
  const chips: [string, string][] = []
  if (h.so_ca_nhe_tuan > 0) chips.push([`Ca Nhẹ ${h.so_ca_nhe_tuan}/2 tuần này`, 'bg-indigo-50 text-indigo-700'])
  if (h.co_case_yeu) chips.push(['Đang bổ trợ Yếu', 'bg-violet-50 text-violet-700'])
  if (h.dang_theo_doi) chips.push(h.theo_doi_nguon === 'truong_khoi' ? ['Đã đề xuất Yếu', 'bg-indigo-600 text-white'] : ['Đang theo dõi', 'bg-amber-50 text-amber-800'])
  if (!chips.length) chips.push(['Chưa xử lý', 'bg-rose-50 text-rose-700'])
  return <span className="flex flex-wrap gap-1">{chips.map(([t, c]) => <span key={t} className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${c}`}>{t}</span>)}</span>
}

function BangChiTiet({ o, onDong, onTaoCaNhe }: { o: OTongQuan; onDong: () => void; onTaoCaNhe: () => void }) {
  const [ds, setDs] = useState<HsDangYeu[] | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [em, setEm] = useState<HsDangYeu | null>(null)
  async function deXuat(h: HsDangYeu) {
    const gc = window.prompt(`Đề xuất Bổ trợ Yếu cho ${h.ho_ten}? Ghi chú cho Trang (tuỳ chọn):`, '')
    if (gc === null) return
    try {
      await deXuatYeu(h.hoc_sinh_id, o.mon, gc.trim() || null)
      setDs((p) => p && p.map((x) => x.hoc_sinh_id === h.hoc_sinh_id ? { ...x, dang_theo_doi: true, theo_doi_nguon: 'truong_khoi' } : x)) // vá tại chỗ
    } catch (e: any) { setLoi(e?.message ?? String(e)) }
  }
  const [dc, setDc] = useState<DongChay | null>(null)
  useEffect(() => { setDs(null); hsDangYeu(o.mon, o.khoi).then(setDs).catch((e) => setLoi(e?.message ?? String(e))) }, [o.mon, o.khoi])
  useEffect(() => { setDc(null); dongChayDangYeu(o.mon, o.khoi).then(setDc).catch(() => {}) }, [o.mon, o.khoi])
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-slate-900/40 p-6" onClick={onDong}>
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-3">
          <h3 className="text-[15px] font-bold text-slate-800">{o.mon} · Khối {o.khoi} — {o.so_hs_yeu} HS yếu · {o.so_dang_yeu} dạng</h3>
          {o.so_can_tinh > 0 && <span className="text-[12px] text-indigo-500">⟳ còn {o.so_can_tinh} em đang cập nhật</span>}
          <button onClick={onTaoCaNhe} className="ml-auto rounded-lg bg-indigo-600 px-3 py-1.5 text-[12.5px] font-semibold text-white hover:bg-indigo-700">＋ Tạo ca Nhẹ</button>
          <button onClick={onDong} className="rounded-lg px-2 py-1 text-[18px] leading-none text-slate-400 hover:text-slate-700">×</button>
        </div>
        {/* Dòng chảy (spec §4.2): so 2 ảnh đầu tuần gần nhất — Ra chỉ tính là thành tích khi có lần đo mới; độ phủ = đối trọng "đo ít đi" */}
        {dc && (
          <div className="flex flex-wrap gap-x-5 gap-y-1 border-b border-slate-100 bg-slate-50 px-5 py-2 text-[12.5px] text-slate-600">
            {dc.tuan_truoc == null ? <span className="text-slate-400">Vào / Ra: cần ít nhất 2 lần Chốt tuần để so.</span> : <>
              <span title="Dạng yếu ở ảnh tuần này mà tuần trước chưa yếu">Vào <b className="text-rose-600">+{dc.vao}</b></span>
              <span title="Tuần trước yếu, tuần này hết yếu VÀ có lần đo mới dạng đó">Ra có bằng chứng <b className="text-emerald-600">−{dc.ra_bang_chung}</b></span>
              <span title="Hết yếu chỉ vì không còn đo trong cửa sổ — không tính thành tích">Rớt cửa sổ <b className="text-slate-500">{dc.ra_cua_so}</b></span>
            </>}
            <span title="Em có ≥ 1 lần chấm trong 7 ngày qua">Độ phủ đo <b className="text-slate-700">{dc.so_hs_co_do}/{dc.so_hs} em</b></span>
          </div>
        )}
        <div className="max-h-[75vh] overflow-auto px-5 py-3">
          {loi ? <p className="text-[13px] text-rose-600">{loi}</p>
            : ds === null ? <p className="text-[13px] text-slate-400">Đang tải…</p>
            : ds.length === 0 ? <p className="text-[13px] text-slate-400">Không có em nào có dạng yếu.</p>
            : (
              <table className="w-full text-[13px]">
                <thead><tr className="text-left text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="py-1.5">Học sinh</th><th>Lớp</th><th title="Số dạng yếu lúc chốt đầu tuần">Đầu tuần</th><th>Dạng yếu (hiện tại)</th><th>Trạng thái</th><th></th>
                </tr></thead>
                <tbody>
                  {ds.map((h) => (
                    <tr key={h.hoc_sinh_id} onClick={() => setEm(h)} className="cursor-pointer border-t border-slate-100 hover:bg-slate-50">
                      <td className="py-2 font-medium text-slate-800">{h.ho_ten}</td>
                      <td className="text-slate-500">{h.ten_lop}</td>
                      <td className="text-slate-500">{h.so_dang_dau_tuan ?? '—'}</td>
                      <td className="max-w-[380px]"><b className="text-rose-600">{h.so_dang_yeu}</b> <span className="text-slate-500">· {h.dang.slice(0, 3).map((d) => d.ten_dang).join(' · ')}{h.dang.length > 3 ? ' …' : ''}</span></td>
                      <td><ChipTrangThai h={h} /></td>
                      <td className="text-right">{!h.co_case_yeu && !h.dang_theo_doi && (
                        <button onClick={(e) => { e.stopPropagation(); deXuat(h) }} className="whitespace-nowrap rounded-lg border border-violet-200 px-2 py-0.5 text-[11.5px] font-semibold text-violet-700 hover:bg-violet-50">Đề xuất Yếu</button>
                      )}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      </div>
      {em && <PopupEm h={em} mon={o.mon} onDong={() => setEm(null)} />}
    </div>
  )
}

function PopupEm({ h, mon, onDong }: { h: HsDangYeu; mon: string; onDong: () => void }) {
  const [eb, setEb] = useState<EtBtvn | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => { setEb(null); etBtvnCuaEm(h.hoc_sinh_id).then(setEb).catch((e) => setLoi(e?.message ?? String(e))) }, [h.hoc_sinh_id])
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-auto bg-slate-900/30 p-8" onClick={(e) => { e.stopPropagation(); onDong() }}>
      <div className="w-full max-w-3xl rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-2 flex items-start gap-3">
          <div>
            <h3 className="text-[16px] font-bold text-slate-800">{h.ho_ten}{h.ma_hs ? <span className="ml-2 text-[12px] font-normal text-slate-400">{h.ma_hs}</span> : null}</h3>
            <p className="text-[12.5px] text-slate-500">{h.ten_lop} · {mon}</p>
          </div>
          <span className="ml-auto"><ChipTrangThai h={h} /></span>
          <button onClick={onDong} className="text-[18px] leading-none text-slate-400 hover:text-slate-700">×</button>
        </div>
        <Muc t={`Dạng yếu (${h.so_dang_yeu})`} ghi="mastery < 0,5 · đo trong 2 cửa sổ gần nhất">
          <ul className="grid gap-1 sm:grid-cols-2">
            {h.dang.map((d) => (
              <li key={d.ma_dang} className="flex items-center gap-2 rounded-lg bg-rose-50 px-2.5 py-1 text-[12.5px]">
                <span className="min-w-0 flex-1 truncate text-slate-800" title={d.ten_dang}>{d.ten_dang}</span>
                <span className="shrink-0 font-semibold text-rose-700">{Math.round(d.score * 100)}%</span>
                <span className="shrink-0 text-[11px] text-slate-400">{d.n} lần đo</span>
              </li>
            ))}
          </ul>
        </Muc>
        {loi && <p className="mb-2 text-[12.5px] text-rose-600">{loi}</p>}
        <Muc t="ET 4 buổi gần nhất" ghi="so với cả lớp">{eb ? <KhoiET et={eb.et} /> : <span className="text-[12px] text-slate-400">Đang tải…</span>}</Muc>
        <Muc t="BTVN 4 buổi gần nhất" ghi="Đ = đúng · C = chưa trọn · S = sai">{eb ? <KhoiBTVN bt={eb.btvn} /> : null}</Muc>
      </div>
    </div>
  )
}

const Muc = ({ t, ghi, children }: { t: string; ghi?: string; children: React.ReactNode }) => (
  <div className="mt-3">
    <p className="mb-1.5 text-[11.5px] font-bold uppercase tracking-wide text-slate-500">{t}{ghi && <span className="ml-1.5 font-normal normal-case tracking-normal text-slate-400">· {ghi}</span>}</p>
    {children}
  </div>
)
