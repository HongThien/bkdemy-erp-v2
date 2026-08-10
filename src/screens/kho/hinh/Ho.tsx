// M0 — Chọn họ mô hình gốc.
// Ẩn dụ chi phối (§0.1): giả thiết = một XÔ NƯỚC. Đổ nước → chảy xuống được một số nhánh
// trong cây; muốn đi sâu hơn phải đổ thêm nước. Mỗi họ có xô gốc riêng; GIỮA HAI HỌ KHÔNG
// CÓ QUAN HỆ — vào từng họ mới có sơ đồ.
import { useState, useEffect } from 'react'
import * as api from '../../../lib/kho/api'
import type { Luoi, MoHinh } from '../../../lib/kho/hinh'
import { MathText, Shell, Field, Actions, inp } from '../ui'
import { AnhInput, Btn, Chip, Empty, Fig, FieldCard, Ma, MaPill, Note, OcrButton, inpCls, tron } from './hinhUi'
import { LyThuyetModal } from '../BanDo'
import { useMemo } from 'react'
import type { Nhay } from './KhoHinhScreen'

export default function Ho({ L, khoi, di, reload }: { L: Luoi; khoi: string; di: (n: Nhay) => void; reload: () => Promise<void> }) {
  const [form, setForm] = useState<{ sua?: MoHinh } | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const goc = L.moHinh.filter((m) => m.la_goc_ho)
  const maCap = useMemo(() => api.maPhanCapMap(L), [L])

  // Lý thuyết của mô hình gốc — gán NGAY ở màn chọn họ, khỏi phải chui vào Sơ đồ → View mô hình.
  // Tái dùng NGUYÊN LyThuyetModal + hinhMoHinhLyThuyet, khuôn hệt SoDo.tsx ViewMoHinh.
  const [moLtMap, setMoLtMap] = useState<Record<string, { noi_dung: string; file_url: string | null; ten_file: string | null }>>({})
  const [moLtModal, setMoLtModal] = useState<{ id: string; ten: string } | null>(null)
  const napMoLt = () => api.hinhMoHinhLyThuyet.list().then(setMoLtMap).catch(() => { /* */ })
  useEffect(() => { napMoLt() }, [])

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
              <Card key={m.id} L={L} m={m} maCap={maCap.get(m.id) ?? '?'} onOpen={() => di({ man: 'sodo', hoId: m.id })}
                onEdit={() => setForm({ sua: m })} onDelete={() => xoa(m)}
                coLt={!!(moLtMap[m.id]?.noi_dung?.trim() || moLtMap[m.id]?.file_url)}
                onLt={() => setMoLtModal({ id: m.id, ten: m.ten })} />
            ))}
          </div>
        )}

      <Note>
        Họ nào cũng bắt đầu từ một <b>xô nước gốc</b>. Đổ thêm nước (thêm giả thiết) → mô hình con, nước chảy xa hơn trong sơ đồ.
        Giữa hai họ khác nhau: <b>không có quan hệ</b>.
      </Note>

      {form && <FormMoHinh L={L} khoiMacDinh={khoi} sua={form.sua} onClose={() => setForm(null)} onDone={reload} />}
      {moLtModal && (
        <LyThuyetModal ma={moLtModal.id} ten={moLtModal.ten} current={moLtMap[moLtModal.id] as any} api={api.hinhMoHinhLyThuyet as any}
          onClose={() => setMoLtModal(null)} onSaved={() => { setMoLtModal(null); napMoLt() }} />
      )}
    </>
  )
}

function Card({ L, m, maCap, onOpen, onEdit, onDelete, coLt, onLt }: {
  L: Luoi; m: MoHinh; maCap: string; onOpen: () => void; onEdit: () => void; onDelete: () => void; coLt: boolean; onLt: () => void
}) {
  const tk = api.thongKeHo(L, m.id)
  // Không dùng <button> bọc ngoài (nút-trong-nút không hợp lệ) — div click mở sơ đồ, ba nút góc
  // nổi khi hover, stopPropagation để không mở nhầm.
  return (
    <div onClick={onOpen} role="button" tabIndex={0}
      className="group relative cursor-pointer overflow-hidden rounded-xl border-[1.5px] border-teal-300 bg-white text-left transition hover:shadow-md">
      <div className="absolute right-2 top-2 z-10 hidden gap-1 group-hover:flex">
        <button onClick={(e) => { e.stopPropagation(); onLt() }} title={coLt ? 'Sửa lý thuyết' : 'Gán lý thuyết'}
          className={`flex h-7 w-7 items-center justify-center rounded-lg border bg-white/90 shadow-sm ${coLt ? 'border-violet-300 text-violet-600 hover:bg-violet-50' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}>📖</button>
        <button onClick={(e) => { e.stopPropagation(); onEdit() }} title="Sửa mô hình"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300 bg-white/90 text-slate-600 shadow-sm hover:bg-slate-50">✎</button>
        <button onClick={(e) => { e.stopPropagation(); onDelete() }} title="Xoá họ"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-rose-300 bg-white/90 text-rose-600 shadow-sm hover:bg-rose-50">🗑</button>
      </div>
      <Fig src={api.anhCauHinhCua(L, m.id)} h="h-40" />
      <div className="space-y-2 p-3.5">
        <div className="flex items-center gap-2">
          <MaPill code={maCap} />
          <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-slate-800"><MathText>{m.ten}</MathText></span>
          <Ma>{m.ma}</Ma>
        </div>
        <FieldCard label="Giả thiết"><MathText>{api.giaThietDayDu(L, m.id)}</MathText></FieldCard>
        <div className="flex flex-wrap gap-1.5">
          <Chip>{tk.soMoHinhCon} mô hình con</Chip>
          <Chip>{tk.soBaiToan} bài toán</Chip>
          {tk.capTu != null && <Chip>cấp {tk.capTu === tk.capDen ? tk.capTu : `${tk.capTu}–${tk.capDen}`}</Chip>}
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
  // Kiểu kế thừa của mô hình CON: cộng thêm (false) vs tự phát biểu / thay cách gọi bố (true).
  const [thayThe, setThayThe] = useState(sua?.gt_thay_the ?? false)
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
  // Kế thừa: bố = cha đầu tiên. Full con = (cộng thêm) bố + phần thêm | (thay thế) chính câu con tự viết.
  const chaFull = laCon ? api.giaThietDayDu(L, cha[0]) : ''
  const fullXemTruoc = !laCon ? gt : thayThe ? gt.trim() : [chaFull, gtThem.trim()].filter(Boolean).join('; ')

  const luu = async () => {
    setSaving(true); setLoi(null)
    try {
      // CỘNG THÊM: cột gia_thiet (NOT NULL) giữ bản composed cho tương thích, gia_thiet_them = delta; hiển
      //   thị suy live qua giaThietDayDu nên dù bố đổi vẫn đúng. TỰ PHÁT BIỂU: gia_thiet = câu con tự viết,
      //   gia_thiet_them = null, gt_thay_the = true → derive dừng leo ở node này. Quan hệ cha-con GIỮ NGUYÊN.
      const conThayThe = laCon && thayThe
      const giaThiet = !laCon ? gt : conThayThe ? gt.trim() : fullXemTruoc
      const them = laCon && !thayThe ? (gtThem.trim() || null) : null
      const payload = { ten, gia_thiet: giaThiet, gia_thiet_them: them, gt_thay_the: laCon ? thayThe : false, anh_cau_hinh: anh, khoi }
      if (sua) {
        await api.updateMoHinh(sua.id, payload)
        await api.setChaMoHinh(sua.id, cha)
      } else {
        await api.createMoHinh(payload, cha)
      }
      await onDone(); onClose()
    } catch (e: any) { setLoi(e.message ?? String(e)); setSaving(false) }
  }

  return (
    <Shell title={sua ? `Sửa mô hình ${sua.ma}` : laCon ? 'Mô hình con (đổ thêm giả thiết)' : 'Mô hình gốc của một họ'} onClose={onClose}>
      <Field label="Tên (ngắn gọn — đề & hình mới là chính)"><input className={inp} value={ten} onChange={(e) => setTen(e.target.value)} placeholder="Trực tâm  ·  Trực tâm + EF∩BC=M" /></Field>
      {laCon ? (
        <>
          {/* Chọn KIỂU kế thừa. Quan hệ cha-con KHÔNG đổi giữa hai kiểu — chỉ đổi cách VIẾT giả thiết. */}
          <div className="mb-3">
            <div className="mb-1.5 text-[11px] font-medium text-slate-600">Kiểu kế thừa giả thiết từ bố</div>
            <div className="grid grid-cols-2 gap-2">
              {([[false, 'Cộng thêm', 'Bố + phần thêm riêng (vd trực tâm → thêm EF∩BC=M)'],
                 [true, 'Tự phát biểu', 'Con định danh, thay cách gọi bố (vd hình thang → hình bình hành)']] as const).map(([v, tit, mo]) => (
                <button key={String(v)} type="button" onClick={() => setThayThe(v)}
                  className={`rounded-lg border px-3 py-2 text-left transition ${thayThe === v ? 'border-teal-400 bg-teal-50 ring-1 ring-teal-300' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                  <div className="text-[12.5px] font-semibold text-slate-800">{tit}</div>
                  <div className="mt-0.5 text-[10.5px] leading-snug text-slate-500">{mo}</div>
                </button>
              ))}
            </div>
          </div>
          <div className={`mb-3 rounded-lg border px-3 py-2.5 ${thayThe ? 'border-slate-200 bg-slate-50/60' : 'border-teal-200 bg-teal-50/60'}`}>
            <div className={`mb-1 text-[10.5px] font-semibold uppercase tracking-wide ${thayThe ? 'text-slate-400' : 'text-teal-700'}`}>{thayThe ? 'Giả thiết của bố (tham chiếu — con sẽ THAY cách gọi này)' : 'Kế thừa từ bố (không sửa ở đây)'}</div>
            <div className="text-[13px] leading-relaxed text-slate-700">{chaFull ? <MathText>{chaFull}</MathText> : <span className="text-slate-400">bố chưa có giả thiết</span>}</div>
          </div>
          {thayThe ? (
            <Field label="Giả thiết của mô hình con (tự phát biểu ĐẦY ĐỦ — thay cách gọi của bố)">
              <textarea className={`${inp} h-20`} value={gt} onChange={(e) => setGt(e.target.value)} placeholder="$ABCD$ là hình bình hành" />
              <div className="mt-1.5"><OcrButton onText={setGt} /></div>
            </Field>
          ) : (
            <>
              <Field label="Giả thiết THÊM của mô hình con này (chỉ phần cộng — full = bố + phần này)">
                <textarea className={`${inp} h-16`} value={gtThem} onChange={(e) => setGtThem(e.target.value)} placeholder="$EF$ cắt $BC$ tại $M$" />
                <div className="mt-1.5"><OcrButton onText={setGtThem} /></div>
              </Field>
              <div className="mb-3 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 text-[12.5px]">
                <span className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">Giả thiết đầy đủ (xem trước): </span>
                {fullXemTruoc ? <MathText>{fullXemTruoc}</MathText> : <span className="text-slate-400">—</span>}
              </div>
            </>
          )}
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
