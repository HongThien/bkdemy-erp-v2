// M0 — Chọn họ mô hình gốc.
// Ẩn dụ chi phối (§0.1): giả thiết = một XÔ NƯỚC. Đổ nước → chảy xuống được một số nhánh
// trong cây; muốn đi sâu hơn phải đổ thêm nước. Mỗi họ có xô gốc riêng; GIỮA HAI HỌ KHÔNG
// CÓ QUAN HỆ — vào từng họ mới có sơ đồ.
import { useState } from 'react'
import * as api from '../../../lib/kho/api'
import type { Luoi, MoHinh } from '../../../lib/kho/hinh'
import { MathText, Shell, Field, Actions, inp } from '../ui'
import { AnhInput, Btn, Empty, Fig, Ma, Note, OcrButton, inpCls, tron } from './hinhUi'
import type { Nhay } from './KhoHinhScreen'

export default function Ho({ L, khoi, di, reload }: { L: Luoi; khoi: string; di: (n: Nhay) => void; reload: () => Promise<void> }) {
  const [form, setForm] = useState<{ sua?: MoHinh } | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const goc = L.moHinh.filter((m) => m.la_goc_ho)

  const xoa = async (m: MoHinh) => {
    if (!confirm(`Xoá họ "${tron(m.ten)}" (${m.ma})?`)) return
    try { await api.deleteMoHinh(m.id); await reload() } catch (e: any) { setLoi(e.message ?? String(e)) }
  }

  return (
    <>
      <div className="mb-1 flex items-center justify-between gap-3">
        <h1 className="text-[19px] font-semibold text-slate-900">Chọn họ mô hình gốc <span className="text-slate-400">· Khối {khoi}</span></h1>
        <Btn kind="pri" onClick={() => setForm({})}>＋ Mô hình gốc</Btn>
      </div>
      {loi && <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</div>}
      <p className="mb-4 max-w-3xl text-[12.5px] text-slate-500">
        Các họ mô hình <b>độc lập</b> với nhau — vào từng họ mới có sơ đồ. Mỗi họ là một graph riêng, không nối sang họ khác.
        Kho Hình đi <b>theo khối</b>: đây là các họ của <b>khối {khoi}</b>.
      </p>

      {goc.length === 0
        ? <Empty>Chưa có họ nào. Bấm <b>＋ Mô hình gốc</b> để dựng xô nước đầu tiên — vd họ <i>Trực tâm</i>: “△ABC nhọn, ba đường cao AD, BE, CF cắt nhau tại H”.</Empty>
        : (
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(360px,1fr))]">
            {goc.map((m) => (
              <Card key={m.id} L={L} m={m} onOpen={() => di({ man: 'sodo', hoId: m.id })}
                onEdit={() => setForm({ sua: m })} onDelete={() => xoa(m)} />
            ))}
          </div>
        )}

      <Note>
        Họ nào cũng bắt đầu từ một <b>xô nước gốc</b>. Đổ thêm nước (thêm giả thiết) → mô hình con, nước chảy xa hơn trong sơ đồ.
        Giữa hai họ khác nhau: <b>không có quan hệ</b>.
      </Note>

      {form && <FormMoHinh L={L} khoiMacDinh={khoi} sua={form.sua} onClose={() => setForm(null)} onDone={reload} />}
    </>
  )
}

function Card({ L, m, onOpen, onEdit, onDelete }: { L: Luoi; m: MoHinh; onOpen: () => void; onEdit: () => void; onDelete: () => void }) {
  const tk = api.thongKeHo(L, m.id)
  // Không dùng <button> bọc ngoài (nút-trong-nút không hợp lệ) — div click mở sơ đồ, hai nút góc
  // nổi khi hover, stopPropagation để không mở nhầm.
  return (
    <div onClick={onOpen} role="button" tabIndex={0}
      className="group relative cursor-pointer overflow-hidden rounded-xl border-[1.5px] border-teal-300 bg-white text-left transition hover:shadow-md">
      <div className="absolute right-2 top-2 z-10 hidden gap-1 group-hover:flex">
        <button onClick={(e) => { e.stopPropagation(); onEdit() }} title="Sửa mô hình"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300 bg-white/90 text-slate-600 shadow-sm hover:bg-slate-50">✎</button>
        <button onClick={(e) => { e.stopPropagation(); onDelete() }} title="Xoá họ"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-rose-300 bg-white/90 text-rose-600 shadow-sm hover:bg-rose-50">🗑</button>
      </div>
      <Fig src={api.anhCauHinhCua(L, m.id)} h="h-44" />
      <div className="p-3.5">
        <div className="flex items-center gap-2"><Ma>{m.ma}</Ma><span className="text-[13px] font-semibold text-slate-800"><MathText>{m.ten}</MathText></span></div>
        <div className="mb-2.5 mt-1.5 rounded-md bg-teal-50/70 px-2.5 py-2 text-[13px] leading-relaxed text-slate-700">
          <b className="text-teal-700">Giả thiết:</b> <MathText>{api.giaThietDayDu(L, m.id)}</MathText>
        </div>
        <div className="flex flex-wrap gap-3 text-[11.5px] text-slate-400">
          <span><b className="text-slate-700">{tk.soMoHinhCon}</b> mô hình con</span>
          <span><b className="text-slate-700">{tk.soBaiToan}</b> bài toán</span>
          {tk.capTu != null && <span>cấp <b className="text-slate-700">{tk.capTu === tk.capDen ? tk.capTu : `${tk.capTu}–${tk.capDen}`}</b></span>}
        </div>
      </div>
    </div>
  )
}

/** Form mô hình dùng chung cho M0 (gốc họ) và M2 (mô hình con) — chỉ khác `chaIds`.
 *  Khối KHÔNG cho sửa tay: mô hình luôn thuộc khối đang mở (kho Hình đi theo khối). Mô hình con
 *  thừa khối của cha (cùng họ = cùng khối) — cha nào cũng ở khối này nên đằng nào cũng khớp. */
export function FormMoHinh({ L, chaMacDinh, khoiMacDinh, sua, onClose, onDone }: {
  L: Luoi; chaMacDinh?: string | null; khoiMacDinh?: string; sua?: MoHinh; onClose: () => void; onDone: () => Promise<void>
}) {
  const [ten, setTen] = useState(sua?.ten ?? '')
  const [gt, setGt] = useState(sua?.gia_thiet ?? '')
  const [gtThem, setGtThem] = useState(sua?.gia_thiet_them ?? '')
  const [anh, setAnh] = useState<string | null>(sua?.anh_cau_hinh ?? null)
  const khoi = sua?.khoi ?? khoiMacDinh ?? null
  const [cha, setCha] = useState<string[]>(
    sua ? api.chaCua(L, sua.id) : chaMacDinh ? [chaMacDinh] : [],
  )
  const [saving, setSaving] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  // Không cho chọn cha là chính nó hoặc hậu duệ của nó — sẽ tạo vòng (service chặn, UI khỏi mời).
  const cam = sua ? new Set([sua.id, ...api.hauDueCua(L, sua.id)]) : new Set<string>()
  const laCon = cha.length > 0
  // Kế thừa: giả thiết đầy đủ của mô hình con = giả thiết của bố + phần THÊM riêng. Bố = cha đầu tiên.
  const chaFull = laCon ? api.giaThietDayDu(L, cha[0]) : ''
  const fullXemTruoc = laCon ? [chaFull, gtThem.trim()].filter(Boolean).join('; ') : gt

  const luu = async () => {
    setSaving(true); setLoi(null)
    try {
      // Con: KHÔNG lưu lại full — chỉ phần thêm. Cột gia_thiet (NOT NULL) giữ bản composed cho tương thích;
      // hiển thị luôn suy live qua giaThietDayDu nên dù bố đổi vẫn đúng.
      const giaThiet = laCon ? fullXemTruoc : gt
      const them = laCon ? (gtThem.trim() || null) : null
      if (sua) {
        await api.updateMoHinh(sua.id, { ten, gia_thiet: giaThiet, gia_thiet_them: them, anh_cau_hinh: anh, khoi })
        await api.setChaMoHinh(sua.id, cha)
      } else {
        await api.createMoHinh({ ten, gia_thiet: giaThiet, gia_thiet_them: them, anh_cau_hinh: anh, khoi }, cha)
      }
      await onDone(); onClose()
    } catch (e: any) { setLoi(e.message ?? String(e)); setSaving(false) }
  }

  return (
    <Shell title={sua ? `Sửa mô hình ${sua.ma}` : laCon ? 'Mô hình con (đổ thêm giả thiết)' : 'Mô hình gốc của một họ'} onClose={onClose}>
      <Field label="Tên (ngắn gọn — đề & hình mới là chính)"><input className={inp} value={ten} onChange={(e) => setTen(e.target.value)} placeholder="Trực tâm  ·  Trực tâm + EF∩BC=M" /></Field>
      {laCon ? (
        <>
          <div className="mb-3 rounded-lg border border-teal-200 bg-teal-50/60 px-3 py-2.5">
            <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-wide text-teal-700">Kế thừa từ bố (không sửa ở đây)</div>
            <div className="text-[13px] leading-relaxed text-slate-700">{chaFull ? <MathText>{chaFull}</MathText> : <span className="text-slate-400">bố chưa có giả thiết</span>}</div>
          </div>
          <Field label="Giả thiết THÊM của mô hình con này (chỉ phần cộng — full = bố + phần này)">
            <textarea className={`${inp} h-16`} value={gtThem} onChange={(e) => setGtThem(e.target.value)} placeholder="$EF$ cắt $BC$ tại $M$" />
            <div className="mt-1.5"><OcrButton onText={setGtThem} /></div>
          </Field>
          <div className="mb-3 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 text-[12.5px]">
            <span className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">Giả thiết đầy đủ (xem trước): </span>
            {fullXemTruoc ? <MathText>{fullXemTruoc}</MathText> : <span className="text-slate-400">—</span>}
          </div>
        </>
      ) : (
        <Field label="Giả thiết nền của họ (đầy đủ — text + LaTeX $…$)">
          <textarea className={`${inp} h-20`} value={gt} onChange={(e) => setGt(e.target.value)}
            placeholder="$\\triangle ABC$ nhọn, ba đường cao $AD, BE, CF$ cắt nhau tại $H$" />
          <div className="mt-1.5"><OcrButton onText={setGt} /></div>
        </Field>
      )}
      <Field label="Mô hình cha — bỏ trống = gốc của một họ mới">
        <div className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-slate-200 p-2">
          {L.moHinh.filter((m) => !cam.has(m.id)).map((m) => (
            <label key={m.id} className="flex items-center gap-2 rounded px-1.5 py-1 text-[13px] hover:bg-slate-50">
              <input type="checkbox" checked={cha.includes(m.id)}
                onChange={(e) => setCha((a) => (e.target.checked ? [...a, m.id] : a.filter((x) => x !== m.id)))} />
              <span className="font-mono text-[10.5px] text-slate-400">{m.ma}</span>
              <span className="truncate">{tron(m.ten)}</span>
            </label>
          ))}
          {!L.moHinh.filter((m) => !cam.has(m.id)).length && <div className="px-1 py-1 text-[12px] text-slate-400">— chưa có mô hình nào khác —</div>}
        </div>
      </Field>
      <Field label={`Hình cấu hình — mô hình thuộc khối ${khoi ?? '?'}`}>
        <AnhInput value={anh} onChange={setAnh} cap="Hình chuẩn của mô hình" />
      </Field>
      {loi && <div className="mb-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</div>}
      <Actions onClose={onClose} onSave={luu} disabled={!ten.trim() || !fullXemTruoc.trim() || saving} saving={saving} label={sua ? 'Lưu' : 'Tạo mô hình'} />
    </Shell>
  )
}

export { inpCls }
