// M3 — Kho tạm + màn GÁN. Việc CƠ HỌC, TA giao được: tra node có sẵn để trỏ vào.
//
// ⚠ KHÔNG CÓ NÚT TẠO NODE ở màn này (§2 luật 2). Vị trí trong lưới KHÔNG suy được từ đề bài:
//   bài mới có thể cách bài cũ mấy lớp. Gặp ý chưa có node ⇒ cờ thiếu + hàng chờ (M5),
//   Thùy vào M2 đặt node đúng chỗ, xong bài tự nối được.
// KHÔNG CHẶN NHẬP LIỆU (§2 luật 3): ý chưa gán được thì bài vẫn nằm yên ở kho tạm.
import { useCallback, useEffect, useMemo, useState } from 'react'
import * as api from '../../../lib/kho/api'
import type { Bai, BaiToan, Luoi, Y } from '../../../lib/kho/hinh'
import { MathText, Shell, Field, Actions, inp } from '../ui'
import { AnhInput, Btn, Cap, Empty, Fig, Ma, OcrButton, Panel, Sol, Tag, inpCls } from './hinhUi'
import type { Nhay } from './KhoHinhScreen'

export default function KhoTam({ L, khoi, di, reload, baiId }: { L: Luoi; khoi: string; di: (n: Nhay) => void; reload: () => Promise<void>; baiId?: string }) {
  const [bais, setBais] = useState<Bai[]>([])
  const [chon, setChon] = useState<string | null>(baiId ?? null)
  const [ys, setYs] = useState<Y[]>([])
  const [them, setThem] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)

  const napBai = useCallback(async () => {
    const ds = await api.listBai('tam')
    setBais(ds)
    setChon((c) => c ?? ds[0]?.id ?? null)
  }, [])
  useEffect(() => { napBai() }, [napBai])

  const napY = useCallback(async (id: string | null) => { setYs(id ? await api.listY([id]) : []) }, [])
  useEffect(() => { napY(chon) }, [chon, napY])

  const bai = bais.find((b) => b.id === chon) ?? null
  const daGan = ys.filter((y) => y.baitoan_id).length
  const xong = ys.length > 0 && daGan === ys.length

  const chuyen = async () => {
    if (!bai) return
    try { await api.chuyenKhoChinh(bai.id); await napBai(); await reload(); setChon(null); di({ man: 'khochinh' }) }
    catch (e: any) { setLoi(e.message ?? String(e)) }
  }

  return (
    <>
      <div className="mb-1 flex items-center justify-between gap-3">
        <h1 className="text-[19px] font-semibold text-slate-900">Kho tạm — gán ý vào sơ đồ</h1>
        <div className="flex gap-2">
          <Btn onClick={() => setThem(true)}>＋ Bài mới</Btn>
          <Btn kind="pri" disabled={!xong} onClick={chuyen}
            title={xong ? 'Mọi ý đã gán — qua cổng 1' : 'Cổng 1: phải gán hết ý mới chuyển được'}>
            Chuyển sang kho chính
          </Btn>
        </div>
      </div>
      <p className="mb-4 max-w-3xl text-[12.5px] text-slate-500">
        Việc <b>cơ học</b>: tra node có sẵn để trỏ vào. <b>Không có nút tạo node</b> — vị trí trong sơ đồ không suy được từ đề bài.
      </p>
      {loi && <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</div>}

      {!bais.length
        ? <Empty icon="▤">Kho tạm trống. Bấm <b>＋ Bài mới</b> để nhập đề thật (đề nguyên văn + hình đề + các ý).</Empty>
        : (
          <div className="grid items-start gap-4 lg:grid-cols-[236px_1fr]">
            <Panel label={`Bài trong kho tạm · ${bais.length}`} className="max-h-[70vh] overflow-y-auto">
              {bais.map((b) => (
                <button key={b.id} onClick={() => setChon(b.id)}
                  className={`mb-1 block w-full rounded-lg border px-2.5 py-2 text-left transition ${
                    chon === b.id ? 'border-blue-300 bg-blue-50/60' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <Ma>{b.ma_bai}</Ma>
                  <div className="truncate text-[12.5px] text-slate-700">{b.nguon ?? 'chưa rõ nguồn'}</div>
                </button>
              ))}
            </Panel>

            {bai && (
              <div className="min-w-0">
                <Panel className="mb-3.5">
                  <div className="flex items-center gap-3">
                    <span className="text-[12.5px] text-slate-600"><Ma>{bai.ma_bai}</Ma> · {bai.nguon ?? 'chưa rõ nguồn'}</span>
                    <div className="h-[7px] flex-1 overflow-hidden rounded-full bg-slate-100">
                      <i className="block h-full bg-blue-500 transition-all" style={{ width: `${ys.length ? (daGan / ys.length) * 100 : 0}%` }} />
                    </div>
                    <span className="whitespace-nowrap text-[12.5px] font-semibold text-slate-700">{daGan}/{ys.length} ý đã gán</span>
                  </div>
                </Panel>

                <div className="grid items-start gap-4 xl:grid-cols-[320px_1fr]">
                  <Panel label="Đề bài — nguyên văn">
                    <Sol>{bai.de_bai}</Sol>
                    <div className="mt-2.5"><Fig src={bai.anh_de} cap="Hình đề — bắt buộc" /></div>
                    <div className="mt-2.5 rounded-lg bg-teal-50/70 px-2.5 py-2 text-[11.5px] text-slate-600">
                      <b className="text-teal-700">Mô hình (derive):</b>{' '}
                      {api.moHinhCuaBai(L, ys).map((m) => <Tag key={m.id} ton="mh">◇ {m.ma}</Tag>)}
                      {!api.moHinhCuaBai(L, ys).length && <span className="text-slate-400">chưa gán ý nào</span>}
                    </div>
                    <p className="mt-2 text-[11.5px] leading-relaxed text-slate-400">
                      Đề dùng bộ chữ riêng, node chuẩn dùng bộ chữ của họ — biến thể điểm, gán bình thường.
                      <b> Không thay chữ, không ánh xạ điểm.</b>
                    </p>
                    <div className="mt-2 flex gap-2">
                      <Btn onClick={async () => { if (confirm(`Xoá bài ${bai.ma_bai} và mọi ý của nó?`)) { await api.deleteBai(bai.id); setChon(null); await napBai(); await reload() } }}>🗑 Xoá bài</Btn>
                    </div>
                  </Panel>

                  <div className="min-w-0 space-y-3">
                    {ys.map((y) => (
                      <OY key={y.id} L={L} y={y} ys={ys} onDone={async () => { await napY(bai.id); await reload() }} />
                    ))}
                    <ThemY baiId={bai.id} nextThuTu={(ys.at(-1)?.thu_tu ?? 0) + 1} onDone={() => napY(bai.id)} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      {them && <FormBai khoi={khoi} onClose={() => setThem(false)} onDone={async (id) => { await napBai(); setChon(id); await reload() }} />}
    </>
  )
}

// ── một Ý: nguyên văn + ô gán ──
function OY({ L, y, ys, onDone }: { L: Luoi; y: Y; ys: Y[]; onDone: () => Promise<void> }) {
  const [q, setQ] = useState('')
  const [moRong, setMoRong] = useState(false)     // mở rộng phạm vi ra toàn kho
  const [thieu, setThieu] = useState(false)
  const [moTa, setMoTa] = useState(y.mo_ta_thieu ?? '')
  const [sua, setSua] = useState(false)
  const bt = y.baitoan_id ? L.baiToan.find((b) => b.id === y.baitoan_id) : null

  // Phạm vi gợi ý = mô hình của các ý ĐÃ GÁN trong bài + tổ tiên/hậu duệ của chúng.
  // Mở rộng được ra toàn kho — gợi ý là để nhanh, không phải để chặn.
  const phamVi = useMemo(() => {
    if (moRong) return null
    const nen = new Set<string>()
    for (const o of ys) {
      const b = o.baitoan_id ? L.baiToan.find((x) => x.id === o.baitoan_id) : null
      if (!b) continue
      nen.add(b.mo_hinh_id)
      for (const t of api.toTienCua(L, b.mo_hinh_id)) nen.add(t)
      for (const h of api.hauDueCua(L, b.mo_hinh_id)) nen.add(h)
    }
    return nen.size ? nen : null
  }, [ys, L, moRong])

  const ketQua = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return []
    return L.baiToan
      .filter((b) => !phamVi || phamVi.has(b.mo_hinh_id))
      .filter((b) => b.phat_bieu.toLowerCase().includes(s) || b.ma.toLowerCase().includes(s))
      .slice(0, 8)
  }, [q, L, phamVi])

  const mucDo = bt ? api.mucDoCua(L, bt.id) : null
  const cach = bt ? api.cachMacDinh(L, bt.id) : null
  const vien = bt ? 'border-blue-300' : y.co_thieu_node ? 'border-amber-400' : 'border-slate-200'

  return (
    <div className={`rounded-xl border bg-white p-3.5 ${vien}`}>
      <div className="mb-2.5 flex items-start gap-2.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-violet-50 text-[12.5px] font-semibold text-violet-700">
          {y.nhan_hien_thi ?? String.fromCharCode(96 + y.thu_tu)}
        </span>
        <span className="flex-1 text-[13px] text-slate-800"><MathText>{y.noi_dung}</MathText></span>
        <Ma>{y.ma_y}</Ma>
        {bt ? <Tag ton="bt">✓ đã gán</Tag> : y.co_thieu_node ? <Tag ton="bd">⚑ hàng chờ</Tag> : <Tag ton="gh">chưa gán</Tag>}
        <Btn className="h-6 px-1.5 text-[11px]" onClick={() => setSua(true)}>✎</Btn>
      </div>

      {bt ? (
        <div className="rounded-lg border border-blue-100 bg-blue-50/40 px-3 py-2.5 text-[12.5px]">
          <div className="text-slate-700"><b>◈ {bt.ma}</b> — <MathText>{bt.phat_bieu}</MathText></div>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <Cap cap={bt.cap} />
            {cach?.dang_id && <Tag ton="dg">{api.tenDangDayDu(L, cach.dang_id)}</Tag>}
            {cach && api.boDeCuaCach(L, cach.id).map((id) => {
              const b = L.boDe.find((x) => x.id === id); return b ? <Tag key={id} ton="bd">◦ {b.ten}</Tag> : null
            })}
            {mucDo && <Tag ton="gh">độ khó {mucDo}</Tag>}
            <span className="ml-auto text-[11px] text-slate-400">chỉ xem — sửa node ở sơ đồ</span>
            <Btn className="h-6 px-2 text-[11px]" onClick={async () => { await api.goGanY(y.id); await onDone() }}>Gỡ gán</Btn>
          </div>
        </div>
      ) : (
        <>
          <input className={inpCls} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm node theo phát biểu chuẩn / mã…" />
          {q.trim() && (
            <div className="mt-2 overflow-hidden rounded-lg border border-slate-200 text-[12.5px]">
              {ketQua.map((b) => (
                <button key={b.id} onClick={async () => { await api.ganY(y.id, b.id); await onDone() }}
                  className="flex w-full items-center gap-2 border-b border-slate-100 px-3 py-2 text-left last:border-0 hover:bg-blue-50/50">
                  <b className="shrink-0">◈ {b.ma}</b>
                  <span className="min-w-0 flex-1 truncate"><MathText>{b.phat_bieu}</MathText></span>
                  <Cap cap={b.cap} />
                </button>
              ))}
              {!ketQua.length && <div className="px-3 py-2 text-center text-slate-400">— không có node nào khớp —</div>}
            </div>
          )}
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1.5 text-[11.5px] text-slate-500">
              <input type="checkbox" checked={moRong} onChange={(e) => setMoRong(e.target.checked)} /> mở rộng ra toàn kho
            </label>
            <Btn kind="warn" onClick={() => setThieu((v) => !v)}>⚑ Thiếu node trong sơ đồ</Btn>
            <span className="text-[11.5px] text-slate-400">→ hàng chờ, bài vẫn lưu ở kho tạm</span>
          </div>
          {thieu && (
            <div className="mt-2 rounded-lg border border-amber-300 bg-amber-50 p-2.5">
              <textarea className={`${inpCls} h-16 bg-white`} value={moTa} onChange={(e) => setMoTa(e.target.value)}
                placeholder='Mô tả để Thùy đặt node đúng chỗ — vd "có vẻ thuộc mô hình con + M, cấp cao"' />
              <div className="mt-2 flex gap-2">
                <Btn kind="pri" disabled={!moTa.trim()}
                  onClick={async () => { await api.baoThieuNode(y.id, moTa.trim()); setThieu(false); await onDone() }}>Gửi vào hàng chờ</Btn>
                <Btn onClick={() => setThieu(false)}>Huỷ</Btn>
              </div>
            </div>
          )}
          {y.co_thieu_node && !thieu && (
            <div className="mt-2 rounded-lg bg-amber-50 px-2.5 py-2 text-[11.5px] text-amber-800">Đang ở hàng chờ: “{y.mo_ta_thieu}”</div>
          )}
        </>
      )}

      {sua && <FormY y={y} onClose={() => setSua(false)} onDone={onDone} />}
    </div>
  )
}

function ThemY({ baiId, nextThuTu, onDone }: { baiId: string; nextThuTu: number; onDone: () => Promise<void> }) {
  const [mo, setMo] = useState(false)
  const [nd, setNd] = useState('')
  return mo ? (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-3">
      <textarea className={`${inpCls} h-16`} value={nd} onChange={(e) => setNd(e.target.value)} placeholder="Nguyên văn ý — chép đúng đề gốc" autoFocus />
      <div className="mt-2 flex gap-2">
        <Btn kind="pri" disabled={!nd.trim()} onClick={async () => { await api.addY(baiId, { thu_tu: nextThuTu, noi_dung: nd.trim() }); setNd(''); setMo(false); await onDone() }}>Thêm ý</Btn>
        <Btn onClick={() => setMo(false)}>Huỷ</Btn>
      </div>
    </div>
  ) : (
    <button onClick={() => setMo(true)} className="w-full rounded-xl border border-dashed border-slate-300 py-2 text-[12.5px] text-slate-400 hover:bg-white">＋ Thêm ý</button>
  )
}

function FormY({ y, onClose, onDone }: { y: Y; onClose: () => void; onDone: () => Promise<void> }) {
  const [nd, setNd] = useState(y.noi_dung)
  const [nhan, setNhan] = useState(y.nhan_hien_thi ?? '')
  const [dapAn, setDapAn] = useState(y.dap_an ?? '')
  const [lg, setLg] = useState(y.loi_giai ?? '')
  const [anh, setAnh] = useState<string | null>(y.anh_loi_giai)
  const [duyet, setDuyet] = useState(y.da_duyet)
  const [saving, setSaving] = useState(false)
  return (
    <Shell title={`Sửa ý ${y.nhan_hien_thi ?? y.thu_tu}`} onClose={onClose}>
      <Field label="Nguyên văn ý (đề gốc — KHÔNG chuẩn hoá chữ cái)">
        <textarea className={`${inp} h-20`} value={nd} onChange={(e) => setNd(e.target.value)} />
        <div className="mt-1.5"><OcrButton onText={setNd} /></div>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Nhãn hiển thị (2 ý nguyên tử in chung một nhãn)"><input className={inp} value={nhan} onChange={(e) => setNhan(e.target.value)} placeholder="b" /></Field>
        <Field label="Đáp án"><input className={inp} value={dapAn} onChange={(e) => setDapAn(e.target.value)} /></Field>
      </div>
      <Field label="Lời giải riêng — để TRỐNG thì dùng lời giải của node (đáp án bậc THAM CHIẾU, miễn phí)">
        <textarea className={`${inp} h-24`} value={lg} onChange={(e) => setLg(e.target.value)} />
      </Field>
      <Field label="Ảnh lời giải riêng"><AnhInput value={anh} onChange={setAnh} /></Field>
      <label className="mb-3 flex items-center gap-2 text-[13px] text-slate-700">
        <input type="checkbox" checked={duyet} onChange={(e) => setDuyet(e.target.checked)} />
        Đã duyệt — chưa duyệt thì bậc tham chiếu chỉ GV xem, không in cho HS
      </label>
      <Actions onClose={onClose} disabled={!nd.trim() || saving} saving={saving} label="Lưu ý"
        onSave={async () => {
          setSaving(true)
          await api.updateY(y.id, { noi_dung: nd, nhan_hien_thi: nhan || null, dap_an: dapAn || null, loi_giai: lg || null, anh_loi_giai: anh, da_duyet: duyet })
          await onDone(); onClose()
        }} />
    </Shell>
  )
}

/** Nhập bài thật: đề nguyên văn + HÌNH ĐỀ (bắt buộc) + các ý. Không đụng lưới.
 *  Khối = khối đang mở (kho Hình đi theo khối) — không hỏi lại. */
function FormBai({ khoi, onClose, onDone }: { khoi: string; onClose: () => void; onDone: (id: string) => Promise<void> }) {
  const [de, setDe] = useState('')
  const [anh, setAnh] = useState<string | null>(null)
  const [nguon, setNguon] = useState('')
  const [ys, setYs] = useState<string[]>([''])
  const [saving, setSaving] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)

  const luu = async () => {
    setSaving(true); setLoi(null)
    try {
      const bai = await api.createBai({ de_bai: de, anh_de: anh!, nguon: nguon || null, khoi })
      let i = 0
      for (const nd of ys.map((s) => s.trim()).filter(Boolean)) await api.addY(bai.id, { thu_tu: ++i, noi_dung: nd })
      await onDone(bai.id); onClose()
    } catch (e: any) { setLoi(e.message ?? String(e)); setSaving(false) }
  }

  return (
    <Shell title={`Bài thật mới → kho tạm · khối ${khoi}`} onClose={onClose}>
      <Field label="Đề bài — NGUYÊN VĂN đề gốc (giữ đúng bộ chữ của đề)">
        <textarea className={`${inp} h-20`} value={de} onChange={(e) => setDe(e.target.value)}
          placeholder="Cho $\\triangle MNP$ nhọn có ba đường cao $MQ, NR, PS$ cắt nhau tại $K$." />
        <div className="mt-1.5"><OcrButton onText={setDe} nhan="📋 Ảnh đề → AI dịch (có công thức)" /></div>
      </Field>
      <Field label="Nguồn"><input className={inp} value={nguon} onChange={(e) => setNguon(e.target.value)} placeholder="THCS Cầu Giấy — HK1 2025" /></Field>
      <Field label="Hình đề — BẮT BUỘC"><AnhInput value={anh} onChange={setAnh} cap="Hình đề" /></Field>
      <Field label="Các ý (nguyên văn, mỗi ô một ý)">
        {ys.map((v, i) => (
          <div key={i} className="mb-2.5 flex gap-2">
            <span className="mt-2 w-4 text-[12px] text-slate-400">{String.fromCharCode(97 + i)}</span>
            <div className="min-w-0 flex-1">
              <textarea className={`${inp} h-14`} value={v} onChange={(e) => setYs((a) => a.map((x, j) => (j === i ? e.target.value : x)))} />
              <div className="mt-1"><OcrButton onText={(t) => setYs((a) => a.map((x, j) => (j === i ? t : x)))} nhan="📋 Ảnh → AI dịch" /></div>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => setYs((a) => [...a, ''])} className="text-[12.5px] font-medium text-blue-600 hover:underline">＋ thêm ý</button>
      </Field>
      {loi && <div className="mb-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</div>}
      <Actions onClose={onClose} onSave={luu} disabled={!de.trim() || !anh || saving} saving={saving} label="Lưu vào kho tạm" />
    </Shell>
  )
}

export type { BaiToan }
