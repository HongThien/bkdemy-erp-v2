// M4 — Kho chính: bài đã qua CỔNG 1 (mọi ý đã gán node). Đây là kho ĐANG DÙNG ĐỂ IN.
// Tag mô hình DERIVE từ node của các ý — một bài có thể mang NHIỀU tag (ý a·b ở mô hình cha,
// ý c ở mô hình con). Không nhập tay.
import { useEffect, useMemo, useState } from 'react'
import * as api from '../../../lib/kho/api'
import type { Bai, Luoi, Y } from '../../../lib/kho/hinh'
import { MathText } from '../ui'
import { Btn, Cap, Empty, Fig, Ma, Note, Panel, Sol, Tag, inpCls, tron } from './hinhUi'
import type { Nhay } from './KhoHinhScreen'

export default function KhoChinh({ L, khoi, di }: { L: Luoi; khoi: string; di: (n: Nhay) => void }) {
  const [bais, setBais] = useState<Bai[]>([])
  const [ys, setYs] = useState<Y[]>([])
  const [mo, setMo] = useState<string | null>(null)
  const [fMoHinh, setFMoHinh] = useState('')
  const [fDang, setFDang] = useState('')
  const [fCap, setFCap] = useState('')
  const [fDoKho, setFDoKho] = useState('')

  useEffect(() => {
    api.listBai('chinh', khoi).then(async (bs) => { setBais(bs); setYs(bs.length ? await api.listY(bs.map((b) => b.id)) : []) })
  }, [khoi])

  const rows = useMemo(() => bais.map((b) => {
    const yy = ys.filter((y) => y.bai_id === b.id)
    const bts = yy.map((y) => L.baiToan.find((x) => x.id === y.baitoan_id)).filter(Boolean) as typeof L.baiToan
    const caps = bts.map((x) => x.cap)
    const dks = bts.map((x) => api.mucDoCua(L, x.id) ?? 0).filter(Boolean)
    const dangIds = bts.map((x) => api.cachMacDinh(L, x.id)?.dang_id).filter(Boolean) as string[]
    return { bai: b, ys: yy, mhs: api.moHinhCuaBai(L, yy), caps, dks, dangIds, chuoi: api.chuoiCuaBai(L, yy) }
  }), [bais, ys, L])

  const loc = rows.filter((r) =>
    (!fMoHinh || r.mhs.some((m) => m.id === fMoHinh))
    && (!fDang || r.dangIds.includes(fDang))
    && (!fCap || r.caps.includes(Number(fCap)))
    && (!fDoKho || r.dks.includes(Number(fDoKho))))

  const capAll = [...new Set(rows.flatMap((r) => r.caps))].sort((a, b) => a - b)
  const chon = loc.find((r) => r.bai.id === mo)

  return (
    <>
      <div className="mb-1 flex items-center justify-between gap-3">
        <h1 className="text-[19px] font-semibold text-slate-900">Kho chính — cái IN RA dùng hiện tại <span className="text-slate-400">· Khối {khoi}</span></h1>
        <Btn kind="pri" onClick={() => di({ man: 'soan' })}>Soạn tài liệu</Btn>
      </div>
      <p className="mb-3 max-w-3xl text-[12.5px] text-slate-500">
        Bài vật lý đã gán đủ node. Sơ đồ gốc dùng để tham chiếu · lý thuyết · <b>in hướng dẫn có chuỗi đầy đủ</b>.
      </p>

      <div className="mb-3 flex flex-wrap gap-2">
        <select className={`${inpCls} w-auto`} value={fMoHinh} onChange={(e) => setFMoHinh(e.target.value)}>
          <option value="">Mọi mô hình</option>
          {L.moHinh.map((m) => <option key={m.id} value={m.id}>◇ {m.ma} · {tron(m.ten)}</option>)}
        </select>
        <select className={`${inpCls} w-auto`} value={fDang} onChange={(e) => setFDang(e.target.value)}>
          <option value="">Mọi dạng</option>
          {L.dang.filter((d) => d.cap === 'dang').map((d) => <option key={d.id} value={d.id}>{api.tenDangDayDu(L, d.id)}</option>)}
        </select>
        <select className={`${inpCls} w-auto`} value={fCap} onChange={(e) => setFCap(e.target.value)}>
          <option value="">Mọi cấp</option>
          {capAll.map((c) => <option key={c} value={c}>cấp {c}</option>)}
        </select>
        <select className={`${inpCls} w-auto`} value={fDoKho} onChange={(e) => setFDoKho(e.target.value)}>
          <option value="">Mọi độ khó</option>
          {[1, 2, 3, 4, 5].map((c) => <option key={c} value={c}>độ khó {c}</option>)}
        </select>
        <span className="self-center text-[12px] text-slate-400">{loc.length}/{rows.length} bài</span>
      </div>

      {!rows.length
        ? <Empty icon="▦">Kho chính trống — bài chỉ sang đây khi <b>mọi ý đã gán node</b> (cổng 1).</Empty>
        : loc.map((r) => (
          <div key={r.bai.id}>
            <button onClick={() => setMo(mo === r.bai.id ? null : r.bai.id)}
              className="mb-2 grid w-full grid-cols-[92px_1fr_auto] items-center gap-3.5 rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:shadow-sm">
              <Fig src={r.bai.anh_de} h="h-16" />
              <div className="min-w-0">
                <Ma>{r.bai.ma_bai} · {r.bai.nguon ?? 'chưa rõ nguồn'}</Ma>
                <div className="my-0.5 truncate text-[13.5px] font-medium text-slate-800"><MathText>{r.bai.de_bai}</MathText></div>
                <div className="flex flex-wrap gap-1.5">
                  {r.mhs.map((m) => <Tag key={m.id} ton="mh">◇ {m.ma}</Tag>)}
                  {!!r.caps.length && <Tag ton="bt">◈ cấp {[...new Set(r.caps)].sort((a, b) => a - b).join('·')}</Tag>}
                  {r.chuoi.length > r.ys.length && <Tag ton="bd">chuỗi {r.chuoi.length} bước</Tag>}
                </div>
              </div>
              <div className="text-right text-[11px] text-slate-400">
                <b className="block text-[17px] text-slate-800">{r.ys.length}</b>ý
                {!!r.dks.length && <><br />độ khó {Math.min(...r.dks)}–{Math.max(...r.dks)}</>}
              </div>
            </button>
            {chon?.bai.id === r.bai.id && <ChiTiet L={L} r={r} />}
          </div>
        ))}

      <Note>
        Bài mang <b>nhiều tag mô hình</b> khi các ý rơi vào mô hình khác nhau — derive từ node, không nhập tay.
        Tag <b>“chuỗi N bước”</b> = truy được tiền đề đủ để in hướng dẫn liền mạch (có bước HS không được hỏi).
      </Note>
    </>
  )
}

function ChiTiet({ L, r }: { L: Luoi; r: { bai: Bai; ys: Y[] } }) {
  return (
    <Panel className="mb-3 -mt-1">
      <div className="grid gap-3.5 md:grid-cols-[240px_1fr]">
        <div><Fig src={r.bai.anh_de} cap="Hình đề" /></div>
        <div className="min-w-0 space-y-2.5">
          {r.ys.map((y) => {
            const da = api.dapAnHaiBac(L, y)
            const bt = y.baitoan_id ? L.baiToan.find((b) => b.id === y.baitoan_id) : null
            return (
              <div key={y.id} className="rounded-lg border border-slate-200 p-2.5">
                <div className="mb-1 flex items-center gap-2 text-[12.5px]">
                  <b className="text-violet-700">{y.nhan_hien_thi ?? String.fromCharCode(96 + y.thu_tu)})</b>
                  <span className="min-w-0 flex-1 truncate"><MathText>{y.noi_dung}</MathText></span>
                  {bt && <><Cap cap={bt.cap} /><Ma>{bt.ma}</Ma></>}
                </div>
                <div className="mb-1 flex items-center gap-1.5">
                  {da.bac === 'chuan_xac' && <Tag ton="bt">đáp án CHUẨN XÁC — gõ riêng cho bài này</Tag>}
                  {da.bac === 'tham_chieu' && <Tag ton="bd">đáp án THAM CHIẾU — lấy từ node, khác tên điểm</Tag>}
                  {da.bac === 'chua_co' && <Tag ton="gh">chưa có đáp án</Tag>}
                  {!y.da_duyet && da.bac === 'tham_chieu' && <Tag ton="gh">chưa duyệt — chỉ GV xem</Tag>}
                </div>
                <Sol>{da.loiGiai}</Sol>
              </div>
            )
          })}
        </div>
      </div>
    </Panel>
  )
}
