// Form node lưới ③ (bài toán nhỏ). CHỈ mở từ M1/M2 (xây lưới) — M3 (gán bài) không có đường tới đây (§0.4).
//
// ⭐ MODEL (Thùy chốt): bài toán KHÔNG có giả thiết/hình riêng — cả hai MƯỢN của MÔ HÌNH. Các bài toán
//   trong một mô hình chỉ khác nhau ở CÂU HỎI. Vì câu hỏi luôn dựa trên giả thiết ⇒ mỗi bài toán phải
//   TRỰC TIẾP thuộc đúng 1 mô hình (trường "Mô hình" bắt buộc).
//
// Bố cục: popup lớn 2 cột.
//   TRÁI  = ngữ cảnh (mô hình + giả thiết đầy đủ + cấp + hình mô hình) → rồi CÂU HỎI.
//   PHẢI  = lời giải + tiền đề (mặc định = bài toán phía trước, thêm được qua cây Mô hình›node) + bổ đề.
// Mọi ô chữ có công thức đều 2 cách nhập: gõ LaTeX hoặc 📋 dán ảnh → AI dịch (OcrButton).
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import * as api from '../../../lib/kho/api'
import type { BaiToan, Luoi } from '../../../lib/kho/hinh'
import { MathText, inp } from '../ui'
import { AnhInput, Btn, Cap, Fig, Ma, OcrButton, tron } from './hinhUi'

export default function FormBaiToan({ L, moHinhMacDinh, sua, phatBieuGoi, onClose, onDone }: {
  L: Luoi
  moHinhMacDinh?: string | null
  sua?: BaiToan
  phatBieuGoi?: string          // mô tả từ hàng chờ điền sẵn (M5 → M2)
  onClose: () => void
  onDone: () => Promise<void>
}) {
  const cachCu = sua ? api.cachMacDinh(L, sua.id) : null
  const [moHinhId, setMoHinhId] = useState(sua?.mo_hinh_id ?? moHinhMacDinh ?? L.moHinh[0]?.id ?? '')
  const [phatBieu, setPhatBieu] = useState(sua?.phat_bieu ?? phatBieuGoi ?? '')
  const [cap, setCap] = useState<number>(sua?.cap ?? 1)
  const [dangId, setDangId] = useState(cachCu?.dang_id ?? '')
  const [loiGiai, setLoiGiai] = useState(cachCu?.loi_giai ?? '')
  const [anhGiai, setAnhGiai] = useState<string | null>(cachCu?.anh_loi_giai ?? null)
  // Tiền đề: khi TẠO node, mặc định gắn "bài toán phía trước" (node cấp cao nhất đã có trong mô hình)
  // làm tiền đề CHÍNH. Người thêm/bớt tự do sau.
  const [tienDe, setTienDe] = useState<string[]>(() => {
    if (cachCu) return api.tienDeCuaCach(L, cachCu.id)
    const truoc = api.nodeTruoc(L, sua?.mo_hinh_id ?? moHinhMacDinh ?? '')
    return truoc ? [truoc.id] : []
  })
  const [boDe, setBoDe] = useState<string[]>(cachCu ? api.boDeCuaCach(L, cachCu.id) : [])
  const [themTd, setThemTd] = useState(false)   // mở cây chọn tiền đề
  const [saving, setSaving] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [gan, setGan] = useState<BaiToan[]>([])

  const dangLa = L.dang.filter((d) => d.cap === 'dang')
  const giaThiet = api.giaThietDayDu(L, moHinhId)
  const anhMoHinh = api.anhCauHinhCua(L, moHinhId)

  // Cấp gợi ý = 1 + max(cap tiền đề). Chỉ ĐỐI CHIẾU, không ghi đè cấp nhập tay (§1.1).
  const capGoi = useMemo(() => (tienDe.length ? 1 + Math.max(...tienDe.map((id) => L.baiToan.find((b) => b.id === id)?.cap ?? 0)) : 1), [tienDe, L])

  // Search-before-create: gõ câu hỏi → hiện node gần giống trong cùng mô hình + cha/con (nhắc, không chặn).
  useEffect(() => {
    if (sua || phatBieu.trim().length < 3) { setGan([]); return }
    const q = phatBieu.trim()
    const t = setTimeout(() => {
      const scope = [moHinhId, ...api.chaCua(L, moHinhId), ...api.conCua(L, moHinhId)].filter(Boolean)
      api.searchBaiToan(q, scope).then(setGan).catch(() => setGan([]))
    }, 300)
    return () => clearTimeout(t)
  }, [phatBieu, moHinhId, sua, L])

  const luu = async () => {
    setSaving(true); setLoi(null)
    try {
      // KHÔNG ghi de_bai_chuan/anh_chuan — bài toán mượn giả thiết + hình của mô hình.
      let btId = sua?.id
      if (sua) await api.updateBaiToan(sua.id, { phat_bieu: phatBieu, mo_hinh_id: moHinhId, cap, de_bai_chuan: null, anh_chuan: null })
      else btId = (await api.createBaiToan({ phat_bieu: phatBieu, mo_hinh_id: moHinhId, cap, de_bai_chuan: null, anh_chuan: null })).id
      if (dangId) {
        const cachId = cachCu
          ? (await api.updateCachGiai(cachCu.id, { dang_id: dangId, loi_giai: loiGiai || null, anh_loi_giai: anhGiai }), cachCu.id)
          : (await api.createCachGiai({ baitoan_id: btId!, dang_id: dangId, ten: 'cách ngắn nhất', loi_giai: loiGiai || null, anh_loi_giai: anhGiai, la_mac_dinh: true })).id
        await api.setTienDe(cachId, btId!, tienDe)
        await api.setBoDeCuaCach(cachId, boDe)
      }
      await onDone(); onClose()
    } catch (e: any) { setLoi(e.message ?? String(e)); setSaving(false) }
  }

  const themTienDe = (id: string) => setTienDe((a) => (a.includes(id) ? a : [...a, id]))
  const boTienDe = (id: string) => setTienDe((a) => a.filter((x) => x !== id))

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 sm:p-6" onClick={onClose}>
      <div className="flex h-[92vh] w-[95vw] max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-3">
          <h3 className="text-[15px] font-semibold text-slate-900">{sua ? `Sửa bài toán ${sua.ma}` : 'Bài toán mới trong mô hình'}</h3>
          <span className="text-[12px] text-slate-400">giả thiết + hình mượn của mô hình · chỉ câu hỏi là riêng</span>
          <button onClick={onClose} className="ml-auto rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50">Đóng</button>
        </div>

        {/* Thân — 2 cột */}
        <div className="grid min-h-0 flex-1 gap-0 overflow-hidden lg:grid-cols-2">
          {/* ── TRÁI: ngữ cảnh + câu hỏi ── */}
          <div className="min-w-0 space-y-3 overflow-y-auto border-r border-slate-100 p-5">
            <Lbl>Mô hình <span className="font-normal normal-case text-slate-400">— bài toán trực tiếp thuộc mô hình này (vì dựa trên giả thiết của nó)</span></Lbl>
            <select className={inp} value={moHinhId} onChange={(e) => setMoHinhId(e.target.value)}>
              {L.moHinh.map((m) => <option key={m.id} value={m.id}>{m.ma} · {tron(m.ten)}</option>)}
            </select>

            <div className="rounded-lg border border-teal-200 bg-teal-50/60 px-3 py-2.5">
              <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-wide text-teal-700">Giả thiết đầy đủ (mượn của mô hình, kế thừa từ bố)</div>
              <div className="text-[13px] leading-relaxed text-slate-700">
                {giaThiet ? <MathText>{giaThiet}</MathText> : <span className="text-slate-400">mô hình chưa có giả thiết</span>}
              </div>
            </div>

            <div className="flex items-end gap-3">
              <div className="w-40">
                <Lbl>Cấp độ (nhập tay, toàn cục)</Lbl>
                <div className="flex items-center gap-2">
                  <input type="number" min={1} className={inp} value={cap} onChange={(e) => setCap(Number(e.target.value) || 1)} />
                  {cap !== capGoi && (
                    <span className="whitespace-nowrap rounded-md bg-amber-100 px-2 py-1 text-[11px] font-medium text-amber-800" title="1 + max(cấp tiền đề) — chỉ đối chiếu">
                      ⚠ gợi ý {capGoi}
                    </span>
                  )}
                </div>
              </div>
              <p className="flex-1 pb-1 text-[11px] leading-snug text-slate-400">Cấp = số tính chất phải CM trước. Độ sâu mô hình KHÔNG cộng vào cấp — mô hình con vẫn có bài cấp 1.</p>
            </div>

            <div>
              <Lbl>Hình vẽ (của mô hình)</Lbl>
              <Fig src={anhMoHinh} cap={anhMoHinh ? 'Hình cấu hình — mượn của mô hình' : undefined} h="h-52" />
              <p className="mt-1 text-[11px] text-slate-400">Sửa hình ở form <b>mô hình</b>, không ở đây — mọi bài toán cùng mô hình dùng chung một hình.</p>
            </div>

            <div>
              <Lbl>Câu hỏi / yêu cầu <span className="font-normal normal-case text-slate-400">— bộ chữ chuẩn của họ (△ABC, trực tâm H, chân đường cao D·E·F)</span></Lbl>
              <textarea className={`${inp} h-20`} value={phatBieu} onChange={(e) => setPhatBieu(e.target.value)}
                placeholder="Chứng minh tứ giác $BFEC$ nội tiếp đường tròn đường kính $BC$" />
              <div className="mt-1.5"><OcrButton onText={setPhatBieu} /></div>
              {gan.length > 0 && (
                <div className="mt-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2">
                  <div className="mb-1 text-[12px] font-semibold text-amber-800">Đã có node gần giống — kiểm tra trước khi tạo (nhắc, không chặn)</div>
                  {gan.slice(0, 4).map((b) => (
                    <div key={b.id} className="flex items-center gap-2 py-0.5 text-[12.5px] text-slate-700">
                      <Cap cap={b.cap} /><Ma>{b.ma}</Ma><span className="truncate"><MathText>{b.phat_bieu}</MathText></span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── PHẢI: lời giải + tiền đề + bổ đề ── */}
          <div className="min-w-0 space-y-3 overflow-y-auto p-5">
            <div>
              <Lbl>Dạng (loại câu hỏi › cách xử lý)</Lbl>
              <select className={inp} value={dangId} onChange={(e) => setDangId(e.target.value)}>
                <option value="">— chưa gắn dạng —</option>
                {dangLa.map((d) => <option key={d.id} value={d.id}>{api.tenDangDayDu(L, d.id)}</option>)}
              </select>
            </div>

            <div>
              <Lbl>Lời giải</Lbl>
              <textarea className={`${inp} h-28`} value={loiGiai} onChange={(e) => setLoiGiai(e.target.value)} />
              <div className="mt-1.5"><OcrButton onText={setLoiGiai} /></div>
            </div>
            <div>
              <Lbl>Ảnh lời giải (tuỳ chọn — hình có tô/kẻ thêm cho bước giải)</Lbl>
              <AnhInput value={anhGiai} onChange={setAnhGiai} cap="Hình lời giải" />
            </div>

            {/* Tiền đề */}
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="mb-1.5 flex items-center gap-2">
                <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-600">Bài toán tiền đề</span>
                <span className="text-[11px] text-slate-400">cần CẢ (AND) · bỏ 1 là không giải được</span>
                <Btn className="ml-auto h-7 text-[12px]" onClick={() => setThemTd((v) => !v)}>{themTd ? 'Đóng cây' : '＋ Thêm tiền đề'}</Btn>
              </div>
              {tienDe.length === 0
                ? <div className="text-[12px] text-slate-400">Chưa có tiền đề — bài suy thẳng từ giả thiết (cấp 1).</div>
                : (
                  <div className="space-y-1">
                    {tienDe.map((id, i) => {
                      const b = L.baiToan.find((x) => x.id === id)
                      if (!b) return null
                      const mh = L.moHinh.find((m) => m.id === b.mo_hinh_id)
                      return (
                        <div key={id} className="flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1.5 text-[12.5px]">
                          {i === 0 && <span className="rounded bg-blue-100 px-1.5 py-px text-[10px] font-semibold text-blue-700">chính</span>}
                          <Cap cap={b.cap} teal={b.mo_hinh_id !== moHinhId} />
                          <span className="min-w-0 flex-1 truncate"><MathText>{b.phat_bieu}</MathText></span>
                          {mh && <span className="shrink-0 text-[10px] text-teal-600">{mh.ma}</span>}
                          <button onClick={() => boTienDe(id)} className="shrink-0 text-slate-400 hover:text-rose-600" title="Bỏ tiền đề">✕</button>
                        </div>
                      )
                    })}
                    <p className="pt-0.5 text-[11px] text-slate-400">Tiền đề <b>chính</b> = bài toán phía trước (gợi ý sẵn). Thêm tiền đề khác nếu bài cần nhiều.</p>
                  </div>
                )}
              {themTd && <CayTienDe L={L} moHinhId={moHinhId} daChon={tienDe} chuId={sua?.id} onPick={themTienDe} />}
            </div>

            {/* Bổ đề */}
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-slate-600">Bổ đề <span className="font-normal normal-case text-slate-400">— có bổ đề ⇒ độ khó +1 bậc</span></div>
              <div className="flex flex-wrap gap-1.5">
                {L.boDe.map((b) => (
                  <button key={b.id} type="button"
                    onClick={() => setBoDe((a) => (a.includes(b.id) ? a.filter((x) => x !== b.id) : [...a, b.id]))}
                    className={`rounded-full border px-2.5 py-1 text-[11.5px] font-medium transition ${
                      boDe.includes(b.id) ? 'border-amber-400 bg-amber-100 text-amber-800' : 'border-slate-300 bg-white text-slate-500 hover:bg-slate-50'}`}>
                    ◦ {b.ten}
                  </button>
                ))}
                {!L.boDe.length && <span className="text-[12px] text-slate-400">— danh mục bổ đề còn trống (màn Bổ đề) —</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-slate-200 px-5 py-3">
          {loi && <span className="text-[12.5px] text-rose-700">{loi}</span>}
          <div className="ml-auto flex gap-2">
            <button onClick={onClose} className="rounded-lg px-3 py-2 text-[13px] text-slate-500 hover:bg-slate-100">Huỷ</button>
            <Btn kind="pri" disabled={!phatBieu.trim() || !moHinhId || saving} onClick={luu}>{saving ? 'Đang lưu…' : sua ? 'Lưu bài toán' : 'Tạo bài toán'}</Btn>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function Lbl({ children }: { children: React.ReactNode }) {
  return <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{children}</div>
}

/** Cây chọn tiền đề: nhóm node theo MÔ HÌNH (cả họ — tiền đề đi xuyên mô hình), sắp theo độ sâu.
 *  Dễ hình dung "node này thuộc mô hình nào" hơn là một danh sách phẳng. */
function CayTienDe({ L, moHinhId, daChon, chuId, onPick }: {
  L: Luoi; moHinhId: string; daChon: string[]; chuId?: string; onPick: (id: string) => void
}) {
  const [q, setQ] = useState('')
  const nhom = useMemo(() => {
    const goc = api.gocHoCua(L, moHinhId)
    const trongHo = api.moHinhCuaHo(L, goc)
    return L.moHinh
      .filter((m) => trongHo.has(m.id))
      .map((m) => ({ mh: m, sau: api.doSauTrongHo(L, m.id), nodes: L.baiToan.filter((b) => b.mo_hinh_id === m.id).sort((a, b) => a.cap - b.cap) }))
      .filter((g) => g.nodes.length)
      .sort((a, b) => a.sau - b.sau)
  }, [L, moHinhId])

  const khop = (b: BaiToan) => !q.trim() || b.phat_bieu.toLowerCase().includes(q.toLowerCase()) || b.ma.toLowerCase().includes(q.toLowerCase())

  return (
    <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50/50 p-2">
      <input className={`${inp} mb-2`} value={q} onChange={(e) => setQ(e.target.value)} placeholder="lọc node theo câu hỏi / mã…" />
      <div className="max-h-64 space-y-2 overflow-y-auto">
        {nhom.map(({ mh, nodes }) => {
          const hien = nodes.filter(khop)
          if (!hien.length) return null
          return (
            <div key={mh.id}>
              <div className="flex items-center gap-1.5 px-1 py-0.5 text-[11px] font-semibold text-teal-700">
                ◇ {mh.ma} · {tron(mh.ten)} {mh.id === moHinhId && <span className="rounded bg-teal-100 px-1 text-[9.5px]">mô hình này</span>}
              </div>
              {hien.map((b) => {
                const chon = daChon.includes(b.id), laChinhNo = b.id === chuId
                return (
                  <button key={b.id} type="button" disabled={chon || laChinhNo}
                    onClick={() => onPick(b.id)}
                    className={`ml-3 flex w-[calc(100%-0.75rem)] items-center gap-2 rounded px-1.5 py-1 text-left text-[12.5px] ${
                      chon || laChinhNo ? 'opacity-40' : 'hover:bg-white'}`}>
                    <Cap cap={b.cap} />
                    <span className="min-w-0 flex-1 truncate"><MathText>{b.phat_bieu}</MathText></span>
                    {laChinhNo ? <span className="text-[10px] text-slate-400">chính nó</span>
                      : chon ? <span className="text-[10px] text-blue-600">đã chọn</span>
                      : <span className="text-[13px] text-blue-600">＋</span>}
                  </button>
                )
              })}
            </div>
          )
        })}
        {!nhom.length && <div className="px-1 py-2 text-[12px] text-slate-400">— họ này chưa có node nào để làm tiền đề —</div>}
      </div>
    </div>
  )
}
