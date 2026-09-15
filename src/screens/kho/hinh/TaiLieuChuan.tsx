// M8 — Tài liệu chuẩn: sinh từ CHUỖI node, KHÔNG phải từ bài.
// Một chuỗi phục vụ MỌI bài đi cùng nó — khác trường, khác tên điểm, vẫn một bản.
// ⇒ số tài liệu chuẩn ÍT HƠN NHIỀU số bài trong kho.
//
// Cần CỔNG 2 (nối tiền đề) ở nhánh đó: chưa nối thì chỉ ghép được các node rời, mất phần nối —
// mà "phần nối" chính là chỗ hướng dẫn bị hụt (bước HS không được hỏi nhưng phải có mới hiểu).
import { useEffect, useMemo, useState } from 'react'
import * as api from '../../../lib/kho/api'
import type { Bai, Luoi, Y } from '../../../lib/kho/hinh'
import { MathText } from '../ui'
import { Btn, Empty, Fig, Ma, Panel, Sol, Tag } from './hinhUi'
import HinhPrintView, { type BanIn } from './HinhPrintView'

export default function TaiLieuChuan({ L, khoi }: { L: Luoi; khoi: string }) {
  const [bais, setBais] = useState<Bai[]>([])
  const [ys, setYs] = useState<Y[]>([])
  const [chon, setChon] = useState<string | null>(null)
  const [inBan, setInBan] = useState<BanIn | null>(null)

  useEffect(() => {
    api.listBai('chinh', khoi).then(async (bs) => { setBais(bs); setYs(bs.length ? await api.listY(bs.map((b) => b.id)) : []) })
  }, [khoi])

  const chuois = useMemo(() => api.gomChuoi(L, bais, ys), [L, bais, ys])
  const c = chuois.find((x) => x.key === chon) ?? chuois[0] ?? null

  // Node nào HS thật sự được hỏi (có ý trỏ tới) — phần còn lại là bước trung gian.
  const nodeCoY = useMemo(() => {
    if (!c) return new Set<string>()
    const idsBai = new Set(c.baiIds)
    return new Set(ys.filter((y) => idsBai.has(y.bai_id) && y.baitoan_id).map((y) => y.baitoan_id!))
  }, [c, ys])

  const mhSau = c ? api.moHinhSauNhat(L, c.nodeIds) : null

  return (
    <>
      <div className="mb-1 flex items-center justify-between gap-3">
        <h1 className="text-[19px] font-semibold text-slate-900">Tài liệu chuẩn</h1>
        <span className="text-[12.5px] text-slate-400">sinh từ chuỗi node · tái dùng cho nhiều bài thật</span>
      </div>
      <p className="mb-4 max-w-3xl text-[12.5px] text-slate-500">
        Một tài liệu chuẩn phục vụ <b>mọi bài đi cùng một chuỗi</b>. Sinh một lần, dùng mãi.
      </p>

      {!chuois.length
        ? <Empty icon="⎙">Chưa sinh được chuỗi nào — cần bài ở <b>kho chính</b> và <b>cổng 2</b> (nối tiền đề) đã làm ở nhánh đó.</Empty>
        : (
          <div className="grid items-start gap-4 lg:grid-cols-[300px_1fr]">
            <Panel label={`Chuỗi · ${chuois.length} tài liệu`}>
              {chuois.map((x) => {
                const ns = x.nodeIds.map((id) => L.baiToan.find((b) => b.id === id)!).filter(Boolean)
                const mhs = [...new Set(ns.map((n) => L.moHinh.find((m) => m.id === n.mo_hinh_id)?.ma))].filter(Boolean)
                return (
                  <button key={x.key} onClick={() => setChon(x.key)}
                    className={`mb-1 flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition ${
                      c?.key === x.key ? 'border-amber-300 bg-amber-50/60' : 'border-transparent hover:bg-slate-50'}`}>
                    <span className="min-w-0 flex-1">
                      <b className="block truncate text-[12.5px] text-slate-800">{ns.map((n) => n.ma).join(' → ')}</b>
                      <span className="text-[11px] text-slate-400">cấp {[...new Set(ns.map((n) => n.cap))].join('·')} · {mhs.join('+')}</span>
                    </span>
                    <Ma>{x.baiIds.length} bài</Ma>
                  </button>
                )
              })}
              <div className="mt-2.5 rounded-lg border border-slate-200 bg-slate-50/60 px-2.5 py-2 text-[11.5px] leading-relaxed text-slate-500">
                Chuỗi chỉ sinh được khi <b className="text-slate-700">cổng 2</b> (nối tiền đề) đã xong ở nhánh đó.
                Nhánh chưa nối → chỉ ghép được các node rời, mất phần nối.
              </div>
            </Panel>

            {c && (
              <Panel className="bg-amber-50/20">
                <div className="mb-3 flex items-center gap-2.5">
                  <Tag ton="bd">Bài tương đương — tên điểm theo hệ thống</Tag>
                  <span className="text-[11.5px] text-slate-400">dùng cho {c.baiIds.length} bài thật</span>
                  <Btn className="ml-auto h-7" onClick={() => setInBan(banInChuan(L, c.nodeIds, nodeCoY, c.baiIds.length))}>⎙ In</Btn>
                </div>

                <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">Đề chuẩn</p>
                <div className="mb-3.5 grid gap-3 md:grid-cols-[1fr_200px]">
                  <div className="rounded-lg border border-slate-200 bg-white p-3 text-[12.5px] leading-relaxed text-slate-700">
                    {mhSau && <MathText>{api.giaThietDayDu(L, mhSau.id)}</MathText>}
                    <div className="mt-2 space-y-1">
                      {(() => {
                        const ds = c.nodeIds.filter((id) => nodeCoY.has(id))
                        return ds.map((id, i) => {
                          const n = L.baiToan.find((b) => b.id === id)!
                          // Câu hỏi lấy PHÁT BIỂU NGUYÊN VĂN, không lấy `de_bai_chuan`: đề chuẩn của
                          // từng node đã gói sẵn giả thiết riêng ⇒ ghép lại thì lặp "Cho △ABC nhọn…" ở
                          // mọi câu. Giả thiết đứng MỘT LẦN ở đầu, lấy từ mô hình sâu nhất chuỗi chạm
                          // tới. Nhãn a)/b) CHỈ khi ≥2 câu (Thùy 08-20: "chỉ chuỗi mới có abc"); không
                          // tự thêm chữ "Chứng minh" — phát biểu hiện đúng như đã nhập.
                          return <div key={id}>{ds.length > 1 && <b>{String.fromCharCode(97 + i)}) </b>}<MathText>{n.phat_bieu}</MathText></div>
                        })
                      })()}
                    </div>
                  </div>
                  <Fig src={mhSau ? api.anhCauHinhCua(L, mhSau.id) : null} cap="Hình chuẩn — mô hình sâu nhất chuỗi chạm tới" />
                </div>

                <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">Lời giải liền mạch</p>
                {c.nodeIds.map((id, i) => {
                  const n = L.baiToan.find((b) => b.id === id)!
                  const cach = api.cachMacDinh(L, id)
                  const trongDe = nodeCoY.has(id)
                  return (
                    <div key={id} className="flex gap-2.5 border-b border-dashed border-slate-200 py-2 last:border-0">
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11.5px] font-bold text-white ${trongDe ? 'bg-violet-500' : 'bg-amber-500'}`}>{i + 1}</span>
                      <div className="min-w-0 flex-1 text-[12.5px]">
                        <div className="font-semibold text-slate-800">
                          {trongDe ? '' : 'Bước trung gian · '}<MathText>{n.phat_bieu}</MathText>{' '}
                          <Ma>{n.ma} · c{n.cap}</Ma>
                          {!trongDe && <span className="ml-1"><Tag ton="bd">không có trong đề</Tag></span>}
                        </div>
                        <div className="mt-0.5 text-slate-600"><Sol>{cach?.loi_giai}</Sol></div>
                      </div>
                    </div>
                  )
                })}
                {c.nodeIds.some((id) => !nodeCoY.has(id)) && (
                  <div className="mt-2.5 rounded-lg bg-amber-100/70 px-3 py-2 text-[11.5px] leading-relaxed text-amber-800">
                    <b>Bước gắn nhãn “không có trong đề”</b> là mắt xích HS không được hỏi nhưng cần để hiểu ý sau.
                    Không có sơ đồ thì hướng dẫn sẽ hụt đúng chỗ này.
                  </div>
                )}
              </Panel>
            )}
          </div>
        )}
      {inBan && <HinhPrintView ban={inBan} onClose={() => setInBan(null)} />}
    </>
  )
}

/** Chuỗi → bản in "bài tương đương": giả thiết ĐỨNG MỘT LẦN (mô hình sâu nhất chuỗi chạm tới),
 *  câu hỏi = node có ý thật, bước trung gian gắn nhãn "không có trong đề". */
function banInChuan(L: Luoi, nodeIds: string[], nodeCoY: Set<string>, soBai: number): BanIn {
  const mhSau = api.moHinhSauNhat(L, nodeIds)
  // Nhãn a)/b) CHỈ khi thật sự ≥2 câu TRONG ĐỀ (Thùy 08-20: "chỉ chuỗi mới có abc thôi") — đếm trước,
  // không gán mù cho từng node rồi mới biết tổng.
  const soTrongDe = nodeIds.filter((id) => nodeCoY.has(id)).length
  let i = 0
  return {
    tieuDe: 'Tài liệu chuẩn — bài tương đương',
    phuDe: `dùng cho ${soBai} bài thật · chuỗi ${nodeIds.length} bước`,
    ghiChuDau: 'Bài tương đương — TÊN ĐIỂM THEO HỆ THỐNG, không trùng tên điểm của đề gốc. HS tự đối chiếu.',
    mucs: [{
      kieu: 'de',
      deBai: mhSau ? api.giaThietDayDu(L, mhSau.id) : '',
      anhDe: mhSau ? api.anhCauHinhCua(L, mhSau.id) : null,
      ma: mhSau?.ma,
      ys: nodeIds.map((id) => {
        const n = L.baiToan.find((b) => b.id === id)!
        const cach = api.cachMacDinh(L, id)
        const trongDe = nodeCoY.has(id)
        return {
          nhan: trongDe && soTrongDe > 1 ? String.fromCharCode(97 + i++) : '',
          noiDung: n.phat_bieu,
          loiGiai: cach?.loi_giai,
          anh: cach?.anh_loi_giai ?? api.anhCuaBaiToan(L, n.id),
          ghiChu: trongDe ? null : 'không có trong đề',
          ma: n.ma, cap: n.cap,
        }
      }),
    }],
  }
}
