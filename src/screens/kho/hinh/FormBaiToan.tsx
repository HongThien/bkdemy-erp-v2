// Form node lưới ③ (bài toán nhỏ) + cách giải mặc định của nó.
// CHỈ mở được từ M1/M2 (xây lưới). M3 (gán bài) KHÔNG có đường nào tới đây — §0.4.
//
// SEARCH-BEFORE-CREATE (§2 luật 7): gõ phát biểu → hiện ngay node gần giống trong cùng
// mô hình + cha/con. NHẮC, KHÔNG CHẶN — trùng thì lọc sau, chặn thì người nhập bỏ cuộc.
import { useEffect, useMemo, useState } from 'react'
import * as api from '../../../lib/kho/api'
import type { BaiToan, Luoi } from '../../../lib/kho/hinh'
import { MathText, Shell, Field, Actions, inp } from '../ui'
import { AnhInput, Cap, Ma, Tag, tron } from './hinhUi'

export default function FormBaiToan({ L, moHinhMacDinh, sua, phatBieuGoi, onClose, onDone }: {
  L: Luoi
  moHinhMacDinh?: string | null
  sua?: BaiToan
  phatBieuGoi?: string          // mô tả từ hàng chờ điền sẵn (M5 → M2)
  onClose: () => void
  onDone: () => Promise<void>
}) {
  const cachCu = sua ? api.cachMacDinh(L, sua.id) : null
  const [phatBieu, setPhatBieu] = useState(sua?.phat_bieu ?? phatBieuGoi ?? '')
  const [moHinhId, setMoHinhId] = useState(sua?.mo_hinh_id ?? moHinhMacDinh ?? L.moHinh[0]?.id ?? '')
  const [cap, setCap] = useState<number>(sua?.cap ?? 1)
  const [deBai, setDeBai] = useState(sua?.de_bai_chuan ?? '')
  const [anh, setAnh] = useState<string | null>(sua?.anh_chuan ?? null)
  const [dangId, setDangId] = useState(cachCu?.dang_id ?? '')
  const [loiGiai, setLoiGiai] = useState(cachCu?.loi_giai ?? '')
  const [anhGiai, setAnhGiai] = useState<string | null>(cachCu?.anh_loi_giai ?? null)
  const [tienDe, setTienDe] = useState<string[]>(cachCu ? api.tienDeCuaCach(L, cachCu.id) : [])
  const [boDe, setBoDe] = useState<string[]>(cachCu ? api.boDeCuaCach(L, cachCu.id) : [])
  const [saving, setSaving] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [tim, setTim] = useState('')

  const dangLa = L.dang.filter((d) => d.cap === 'dang')

  // Cấp gợi ý = 1 + max(cap tiền đề). Chỉ ĐỐI CHIẾU, không ghi đè cấp nhập tay (§1.1).
  const capGoi = useMemo(() => {
    if (!tienDe.length) return 1
    return 1 + Math.max(...tienDe.map((id) => L.baiToan.find((b) => b.id === id)?.cap ?? 0))
  }, [tienDe, L])

  // Node gần giống: cùng mô hình + cha/con của nó (phạm vi hay trùng nhất).
  const [gan, setGan] = useState<BaiToan[]>([])
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
      let btId = sua?.id
      if (sua) {
        await api.updateBaiToan(sua.id, { phat_bieu: phatBieu, mo_hinh_id: moHinhId, cap, de_bai_chuan: deBai || null, anh_chuan: anh })
      } else {
        const bt = await api.createBaiToan({ phat_bieu: phatBieu, mo_hinh_id: moHinhId, cap, de_bai_chuan: deBai || null, anh_chuan: anh })
        btId = bt.id
      }
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

  const ungVien = L.baiToan
    .filter((b) => b.id !== sua?.id)
    .filter((b) => !tim.trim() || b.phat_bieu.toLowerCase().includes(tim.toLowerCase()) || b.ma.toLowerCase().includes(tim.toLowerCase()))

  return (
    <Shell title={sua ? `Sửa node ${sua.ma}` : 'Node mới — bài toán nhỏ'} onClose={onClose}>
      <Field label="Phát biểu CHUẨN HOÁ (bộ chữ cái chuẩn của họ — △ABC, trực tâm H, chân đường cao D·E·F)">
        <textarea className={`${inp} h-16`} value={phatBieu} onChange={(e) => setPhatBieu(e.target.value)}
          placeholder="Tứ giác $BFEC$ nội tiếp đường tròn đường kính $BC$" />
      </Field>
      {gan.length > 0 && (
        <div className="-mt-1 mb-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2">
          <div className="mb-1 text-[12px] font-semibold text-amber-800">Đã có node gần giống — kiểm tra trước khi tạo (nhắc, không chặn)</div>
          {gan.slice(0, 4).map((b) => (
            <div key={b.id} className="flex items-center gap-2 py-0.5 text-[12.5px] text-slate-700">
              <Cap cap={b.cap} /><Ma>{b.ma}</Ma><span className="truncate"><MathText>{b.phat_bieu}</MathText></span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Field label="Mô hình TỐI THIỂU — nơi nước lần đầu chạm tới">
          <select className={inp} value={moHinhId} onChange={(e) => setMoHinhId(e.target.value)}>
            {L.moHinh.map((m) => <option key={m.id} value={m.id}>{m.ma} · {tron(m.ten)}</option>)}
          </select>
        </Field>
        <Field label={`Cấp (nhập tay, toàn cục) — gợi ý ${capGoi}`}>
          <div className="flex items-center gap-2">
            <input type="number" min={1} className={inp} value={cap} onChange={(e) => setCap(Number(e.target.value) || 1)} />
            {cap !== capGoi && (
              <span className="whitespace-nowrap rounded-md bg-amber-100 px-2 py-1 text-[11px] font-medium text-amber-800" title="1 + max(cấp tiền đề) — chỉ đối chiếu">
                lệch {cap > capGoi ? '+' : ''}{cap - capGoi}
              </span>
            )}
          </div>
        </Field>
      </div>
      <p className="-mt-1 mb-3 text-[11.5px] leading-relaxed text-slate-500">
        Mô hình tối thiểu ≠ mô hình của đề đang nhập. Sai luật này ⇒ cùng một tính chất bị khai ở cả cha lẫn mọi con.
        Mô hình con cấp 5 vẫn có bài cấp 1 — <b>độ sâu mô hình không cộng vào cấp</b>.
      </p>

      <Field label="Đề bài chuẩn (hiện ở detail panel + tài liệu chuẩn)">
        <textarea className={`${inp} h-16`} value={deBai} onChange={(e) => setDeBai(e.target.value)} />
      </Field>
      <Field label="Hình chuẩn"><AnhInput value={anh} onChange={setAnh} cap="Hình chuẩn của node" /></Field>

      <div className="my-4 border-t border-slate-200 pt-3">
        <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-slate-600">Cách giải mặc định</div>
        <p className="mb-2.5 text-[11.5px] text-slate-500">Tiền đề gắn ở <b>cách giải</b>, không gắn ở bài toán — nhiều cách giải = nhiều bộ tiền đề. v1 điền 1 cách (ngắn nhất).</p>
        <Field label="Dạng (loại câu hỏi › cách xử lý)">
          <select className={inp} value={dangId} onChange={(e) => setDangId(e.target.value)}>
            <option value="">— chưa gắn dạng —</option>
            {dangLa.map((d) => <option key={d.id} value={d.id}>{api.tenDangDayDu(L, d.id)}</option>)}
          </select>
        </Field>
        <Field label="Lời giải"><textarea className={`${inp} h-24`} value={loiGiai} onChange={(e) => setLoiGiai(e.target.value)} /></Field>
        <Field label="Ảnh lời giải"><AnhInput value={anhGiai} onChange={setAnhGiai} cap="Hình lời giải" /></Field>

        <Field label="Tiền đề — đi XUYÊN mô hình tự do">
          <input className={`${inp} mb-1.5`} value={tim} onChange={(e) => setTim(e.target.value)} placeholder="lọc theo phát biểu / mã…" />
          <div className="max-h-44 space-y-0.5 overflow-y-auto rounded-lg border border-slate-200 p-2">
            {ungVien.slice(0, 60).map((b) => (
              <label key={b.id} className="flex items-center gap-2 rounded px-1.5 py-1 text-[12.5px] hover:bg-slate-50">
                <input type="checkbox" checked={tienDe.includes(b.id)}
                  onChange={(e) => setTienDe((a) => (e.target.checked ? [...a, b.id] : a.filter((x) => x !== b.id)))} />
                <Cap cap={b.cap} teal={b.mo_hinh_id !== moHinhId} />
                <Ma>{b.ma}</Ma>
                <span className="truncate"><MathText>{b.phat_bieu}</MathText></span>
              </label>
            ))}
            {!ungVien.length && <div className="px-1 py-1 text-[12px] text-slate-400">— không có node nào —</div>}
          </div>
        </Field>

        <Field label="Bổ đề (có bổ đề ⇒ độ khó +1 bậc)">
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
        </Field>
        {!!tienDe.length && (
          <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-slate-500">
            <span>Đang chọn:</span>
            {tienDe.map((id) => {
              const b = L.baiToan.find((x) => x.id === id)
              return b ? <Tag key={id} ton="bt">◈ {b.ma} · c{b.cap}</Tag> : null
            })}
          </div>
        )}
      </div>

      {loi && <div className="mb-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</div>}
      <Actions onClose={onClose} onSave={luu} disabled={!phatBieu.trim() || !moHinhId || saving} saving={saving} label={sua ? 'Lưu node' : 'Tạo node'} />
    </Shell>
  )
}
