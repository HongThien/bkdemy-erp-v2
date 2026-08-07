// M9 — Soạn tài liệu, HAI CHẾ ĐỘ. Hai chế độ rút từ hai nguồn KHÁC NHAU vì mục đích khác nhau:
//
//   GIẢNG DẠY — rút từ NODE CHUẨN. Một buổi = MỘT KHÚC A→B, không in lại từ cấp 1.
//               Cần mạch liền; tên điểm nhất quán toàn tài liệu.
//   ÔN TẬP    — rút từ BÀI THẬT trong kho chính, chọn theo DẠNG, KHÔNG ràng buộc mô hình.
//               Cần đa dạng: khác hình vẽ, khác lời văn, khác tên điểm — đó chính là cái ôn tập cần.
import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import * as api from '../../../lib/kho/api'
import type { Bai, BaiToan, Luoi, Y } from '../../../lib/kho/hinh'
import HinhPrintView, { type BanIn, type MucIn, type YIn } from './HinhPrintView'
import { MathText } from '../ui'
import { Btn, Cap, Empty, Fig, Ma, Panel, Seg, Sol, Tag, inpCls, tron } from './hinhUi'
import { useStore, SOAN_HINH_DEFAULT, type SoanHinhDraft, type GhepItem } from '../../../store/useStore'
import * as gt from '../../../lib/kho/hinhGiaoTrinh'
import type { GiaoTrinh } from '../../../lib/kho/hinhGiaoTrinh'

// Nháp soạn tài liệu theo khối (store, RAM) — giữ lựa chọn khi rời/quay lại màn (như etDraft).
// Trả slice của 1 chế độ + hàm patch (merge nông). Set→mảng, Map→record: component tự đổi qua lại.
function useSoanSlice<K extends 'gd' | 'mh' | 'ot'>(khoi: string, mode: K): [SoanHinhDraft[K], (patch: Partial<SoanHinhDraft[K]>) => void] {
  const slice = useStore((s) => (s.soanHinh[khoi] ?? SOAN_HINH_DEFAULT)[mode])
  const setSoanHinh = useStore((s) => s.setSoanHinh)
  const patch = useCallback((p: Partial<SoanHinhDraft[K]>) =>
    setSoanHinh(khoi, (cur) => ({ ...cur, [mode]: { ...cur[mode], ...p } })), [khoi, mode, setSoanHinh])
  return [slice, patch]
}

export default function SoanTaiLieu({ L, khoi }: { L: Luoi; khoi: string }) {
  const che = useStore((s) => (s.soanHinh[khoi] ?? SOAN_HINH_DEFAULT).che)
  const setSoanHinh = useStore((s) => s.setSoanHinh)
  const setChe = (v: 'gd' | 'mh' | 'ot') => setSoanHinh(khoi, (cur) => ({ ...cur, che: v }))
  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h1 className="text-[19px] font-semibold text-slate-900">Soạn tài liệu <span className="text-slate-400">· Khối {khoi}</span></h1>
        <Seg value={che} onChange={setChe} options={[
          { v: 'gd', label: '▶ Giảng dạy — đi tới đích' },
          { v: 'mh', label: '◇ Theo mô hình — chọn node' },
          { v: 'ot', label: '↻ Ôn tập — theo dạng' },
        ]} />
      </div>
      {che === 'gd' ? <GiangDay L={L} khoi={khoi} /> : che === 'mh' ? <TheoMoHinh L={L} khoi={khoi} /> : <OnTap L={L} khoi={khoi} />}
    </>
  )
}

// ══════════════════ CHẾ ĐỘ GIẢNG DẠY ══════════════════
function GiangDay({ L, khoi }: { L: Luoi; khoi: string }) {
  const [gd, setGd] = useSoanSlice(khoi, 'gd')  // nháp store (giữ khi rời màn)
  const aId = gd.aId, bId = gd.bId
  const setA = (v: string) => setGd({ aId: v })
  const setB = (v: string) => setGd({ bId: v })
  const daHoc = useMemo(() => new Set(gd.daHoc), [gd.daHoc])   // "đã học" — quyết định của buổi
  const themVao = useMemo(() => new Set(gd.themVao), [gd.themVao]) // "thêm vào buổi" — kéo node hở vào khúc
  const [inBan, setInBan] = useState<BanIn | null>(null)

  const khuc = useMemo(() => (aId && bId ? api.tinhKhuc(L, aId, bId, daHoc) : null), [L, aId, bId, daHoc])

  const trong = useMemo(() => {
    if (!khuc) return []
    const them = [...themVao].map((id) => L.baiToan.find((b) => b.id === id)!).filter(Boolean)
    return [...khuc.trong, ...them.filter((t) => !khuc.trong.some((x) => x.id === t.id))]
      .sort((x, y) => x.cap - y.cap || x.ma.localeCompare(y.ma))
  }, [khuc, themVao, L])

  const hoHang = khuc ? khuc.hoHang.filter((h) => !themVao.has(h.id)) : []
  const mhCua = (id: string) => L.moHinh.find((m) => m.id === id)

  return (
    <>
      <p className="mb-3.5 max-w-4xl text-[12.5px] leading-relaxed text-slate-500">
        Một buổi = <b>một khúc</b>. In từ <b>A đến B</b>, không in lại từ cấp 1 — buổi trước đã dạy đoạn dưới.
        (Bản đầy đủ 1→B chỉ dùng cho <b>lời giải tham chiếu</b> — xem Tài liệu chuẩn.)
      </p>

      <div className="grid items-start gap-4 lg:grid-cols-[300px_1fr]">
        <Panel label="Khúc của buổi này">
          <NodeChon L={L} label="TỪ (A)" value={aId} onChange={setA} />
          <div className="my-1 text-center text-[13px] text-slate-300">↓</div>
          <NodeChon L={L} label="ĐẾN (B)" value={bId} onChange={setB} nhan />
          {khuc && (
            <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50/50 px-2.5 py-2 text-[11.5px] leading-relaxed text-slate-600">
              <b className="text-blue-700">Khúc: {trong.length} bài</b>
              {!!trong.length && <> · cấp {trong[0].cap}→{trong.at(-1)!.cap} · qua {new Set(trong.map((t) => t.mo_hinh_id)).size} mô hình</>}
              <br />
              <span className="text-slate-400">
                {khuc.nhacLai.length} nhắc lại · <b className={hoHang.length ? 'text-rose-700' : ''}>{hoHang.length} cảnh báo hở</b>
              </span>
            </div>
          )}
          <p className="mt-2.5 text-[11px] leading-relaxed text-slate-400">
            Tiền đề nằm <b>dưới A</b> ⇒ buổi trước đã dạy ⇒ vào mục nhắc lại.
            Tiền đề <b>không nằm dưới A</b> ⇒ HS chưa học ⇒ báo đỏ.
          </p>
          <Btn kind="pri" className="mt-3 w-full justify-center" disabled={!khuc || !trong.length}
            onClick={() => khuc && setInBan(banInBuoi(L, khuc, trong))}>⎙ Xuất buổi</Btn>
        </Panel>

        <div className="min-w-0">
          {!khuc
            ? <Empty icon="▶">Chọn node <b>A</b> (đã dạy tới) và <b>B</b> (đích của buổi) để hệ tự cắt khúc.</Empty>
            : (
              <Panel>
                <div className="mb-3 flex items-center gap-2.5">
                  <Tag ton="bt">Buổi này · {trong.length} bài</Tag>
                  <Tag ton="mh">{khuc.mocChuong.length} chương</Tag>
                  <span className="ml-auto text-[11.5px] text-slate-400">tên điểm chuẩn, nhất quán toàn tài liệu</span>
                </div>

                {!!khuc.nhacLai.length && (
                  <div className="mb-2.5 rounded-lg border border-dashed border-slate-300 bg-slate-50/60 px-3 py-2.5">
                    <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Nhắc lại đầu buổi — đã học buổi trước</div>
                    {khuc.nhacLai.map((n) => (
                      <div key={n.id} className="flex items-center gap-2 py-0.5 text-[12.5px] text-slate-600">
                        ◈ <MathText>{n.phat_bieu}</MathText> <Cap cap={n.cap} /> <Ma>{n.ma}</Ma>
                      </div>
                    ))}
                  </div>
                )}

                {!!hoHang.length && (
                  <div className="mb-3 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2.5">
                    <div className="mb-1 text-[12.5px] font-semibold text-rose-800">⚠ Khúc bị hở — {hoHang.length} tiền đề chưa học</div>
                    {hoHang.map((h) => (
                      <div key={h.id} className="mb-1.5">
                        <div className="text-[12.5px] text-rose-800">◈ <MathText>{h.phat_bieu}</MathText> <Ma>{h.ma} · c{h.cap}</Ma></div>
                        <div className="mt-1 flex gap-2">
                          <Btn className="h-7 text-[12px]" onClick={() => setGd({ themVao: [...gd.themVao, h.id] })}>Thêm vào buổi</Btn>
                          <Btn className="h-7 text-[12px]" onClick={() => setGd({ daHoc: [...gd.daHoc, h.id] })}>Đánh dấu đã học</Btn>
                        </div>
                      </div>
                    ))}
                    <div className="text-[11.5px] text-rose-700/80">Node cần nhưng <b>không nằm dưới A</b> — nhánh khác, buổi trước không đi qua.</div>
                  </div>
                )}

                {trong.map((n, i) => {
                  const moc = khuc.mocChuong.find((m) => m.truocNodeId === n.id)
                  const cach = api.cachMacDinh(L, n.id)
                  const mh = mhCua(n.mo_hinh_id)
                  return (
                    <div key={n.id}>
                      {moc && (
                        <div className="mb-2.5 mt-3.5 rounded-lg border border-teal-300 bg-teal-50 px-3 py-2.5 first:mt-0">
                          <div className="text-[13px] font-semibold text-teal-800">CHƯƠNG {khuc.mocChuong.indexOf(moc) + 1} — <MathText>{moc.moHinh.ten}</MathText></div>
                          <div className="mt-0.5 text-[12px] text-slate-600">
                            {moc.moHinh.gia_thiet_them
                              ? <>Nay cho thêm: <MathText>{moc.moHinh.gia_thiet_them}</MathText> <Tag ton="mh">{moc.moHinh.ma}</Tag></>
                              : <><b>Giả thiết:</b> <MathText>{moc.moHinh.gia_thiet}</MathText></>}
                          </div>
                        </div>
                      )}
                      <div className={`mb-2 rounded-xl border p-3 ${n.id === bId ? 'border-[1.5px] border-blue-400 bg-blue-50/40' : 'border-slate-200 bg-white'}`}>
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500 text-[11.5px] font-bold text-white">{i + 1}</span>
                          <div className="min-w-0 flex-1">
                            <b className="text-[12.5px] text-slate-800"><MathText>{n.phat_bieu}</MathText></b>
                            <div className="mt-0.5 text-[11.5px] text-slate-400">
                              {n.ma} · cấp {n.cap}{cach && ` · ${api.tenDangDayDu(L, cach.dang_id)}`}{mh && ` · ${mh.ma}`}
                            </div>
                          </div>
                          {n.id === aId && <Tag ton="dg">điểm A — mở đầu</Tag>}
                          {n.id === bId && <Tag ton="bt">ĐÍCH B</Tag>}
                        </div>
                        {cach?.loi_giai && <div className="mt-2"><Sol>{cach.loi_giai}</Sol></div>}
                      </div>
                    </div>
                  )
                })}

                <div className="mt-3 rounded-lg bg-teal-50 px-3 py-2 text-[11.5px] leading-relaxed text-teal-800">
                  <b>Chương tự chia theo lần thêm giả thiết.</b> Đường đi cắt biên mô hình ⇒ hệ chèn mốc “nay cho thêm…”. Không soạn tay.
                </div>
              </Panel>
            )}
        </div>
      </div>
      {inBan && <HinhPrintView ban={inBan} onClose={() => setInBan(null)} />}
    </>
  )
}

/** Khúc A→B → bản in: nhắc lại đầu buổi · mốc chương (mỗi lần thêm giả thiết) · node theo thứ tự topo. */
function banInBuoi(L: Luoi, khuc: ReturnType<typeof api.tinhKhuc>, trong: BaiToan[]): BanIn {
  const mucs: MucIn[] = []
  if (khuc.nhacLai.length) {
    mucs.push({ kieu: 'nhac_lai', items: khuc.nhacLai.map((n) => ({ ma: n.ma, phatBieu: n.phat_bieu, cap: n.cap })) })
  }
  trong.forEach((n) => {
    const moc = khuc.mocChuong.find((m) => m.truocNodeId === n.id)
    if (moc) {
      mucs.push({
        kieu: 'chuong',
        tieuDe: `CHƯƠNG ${khuc.mocChuong.indexOf(moc) + 1} — ${tron(moc.moHinh.ten)}`,
        moTa: moc.moHinh.gia_thiet_them ? `Nay cho thêm: ${moc.moHinh.gia_thiet_them}` : moc.moHinh.gia_thiet,
      })
    }
    const c = api.cachMacDinh(L, n.id)
    // Đề = giả thiết đầy đủ của mô hình (mượn) + câu hỏi. Hình của node: riêng nếu có, mặc định mượn mô hình.
    mucs.push({
      kieu: 'de',
      deBai: [api.giaThietDayDu(L, n.mo_hinh_id), `Chứng minh ${n.phat_bieu}`].filter(Boolean).join('. '),
      anhDe: api.anhCuaBaiToan(L, n.id),
      ma: n.ma,
      ys: [{ nhan: '', noiDung: '', loiGiai: c?.loi_giai, anh: c?.anh_loi_giai ?? api.anhCuaBaiToan(L, n.id), ma: n.ma, cap: n.cap }],
    })
  })
  return {
    tieuDe: 'Buổi học — khúc trong sơ đồ',
    phuDe: `${trong.length} bài · cấp ${trong[0]?.cap}→${trong.at(-1)?.cap}`,
    ghiChuDau: 'Tên điểm theo hệ thống, nhất quán toàn tài liệu.',
    mucs,
  }
}

function NodeChon({ L, label, value, onChange, nhan }: { L: Luoi; label: string; value: string; onChange: (v: string) => void; nhan?: boolean }) {
  const n = L.baiToan.find((b) => b.id === value)
  return (
    <div className={`rounded-lg border px-2.5 py-2 ${nhan ? 'border-[1.5px] border-blue-400 bg-blue-50/40' : 'border-slate-300'}`}>
      <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">{label}</div>
      <select className={inpCls} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">— chọn node —</option>
        {L.baiToan.slice().sort((a, b) => a.cap - b.cap).map((b) => (
          <option key={b.id} value={b.id}>c{b.cap} · {b.ma} · {tron(b.phat_bieu).slice(0, 46)}</option>
        ))}
      </select>
      {n && <div className="mt-1.5 flex items-center gap-1.5"><Cap cap={n.cap} /><Ma>{n.ma}</Ma></div>}
    </div>
  )
}

// ══════════════════ CHẾ ĐỘ ÔN TẬP ══════════════════
function OnTap({ L, khoi }: { L: Luoi; khoi: string }) {
  const [ot, setOt] = useSoanSlice(khoi, 'ot')  // nháp store (giữ khi rời màn)
  const { dangIds, gio, dkTu, dkDen } = ot
  const [ds, setDs] = useState<{ y: Y; bai: Bai; bt: BaiToan }[]>([])
  const [inBan, setInBan] = useState<BanIn | null>(null)

  useEffect(() => {
    if (!dangIds.length) { setDs([]); return }
    api.listYTheoDang(L, dangIds, {
      khoi,                            // KHÓA theo khối đang mở — không cho ôn tập trộn khối
      doKhoTu: dkTu ? Number(dkTu) : undefined,
      doKhoDen: dkDen ? Number(dkDen) : undefined,
    }).then(setDs).catch(() => setDs([]))
  }, [dangIds, L, khoi, dkTu, dkDen])

  const chon = ds.filter((x) => gio.includes(x.y.id))
  const soHo = new Set(chon.map((x) => api.gocHoCua(L, x.bt.mo_hinh_id))).size
  const dkTB = chon.length ? (chon.reduce((s, x) => s + (api.mucDoCua(L, x.bt.id) ?? 0), 0) / chon.length).toFixed(1) : '—'
  const hoCuaKetQua = new Set(ds.map((x) => api.gocHoCua(L, x.bt.mo_hinh_id))).size
  const loaiCh = L.dang.filter((d) => d.cap === 'loai_ch')

  return (
    <>
      <p className="mb-3.5 max-w-4xl text-[12.5px] leading-relaxed text-slate-500">
        Rút từ <b>bài thật</b> trong kho chính — luyện tập cần đa dạng lời văn, hình vẽ, tên điểm.
        Chọn dạng <b>hoàn toàn độc lập với mô hình</b>: cùng một cách xử lý, gặp ở họ mô hình nào cũng được.
      </p>
      <div className="grid items-start gap-4 xl:grid-cols-[290px_1fr_250px]">
        <Panel label="Chọn dạng">
          {loaiCh.map((lc) => (
            <div key={lc.id}>
              <div className="px-2 pb-0.5 pt-2 text-[11.5px] font-semibold text-slate-600">{lc.ten}</div>
              {L.dang.filter((d) => d.cha_id === lc.id).map((d) => (
                <button key={d.id} onClick={() => setOt({ dangIds: dangIds.includes(d.id) ? dangIds.filter((x) => x !== d.id) : [...dangIds, d.id] })}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left ${dangIds.includes(d.id) ? 'bg-violet-50' : 'hover:bg-slate-50'}`}>
                  <Tag ton="dg">… {d.ten}</Tag>
                </button>
              ))}
            </div>
          ))}
          <div className="mb-1.5 mt-3 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">Lọc thêm</div>
          <div className="flex flex-wrap items-center gap-1.5">
            <input className={`${inpCls} w-20`} value={dkTu} onChange={(e) => setOt({ dkTu: e.target.value })} placeholder="ĐK từ" />
            <input className={`${inpCls} w-20`} value={dkDen} onChange={(e) => setOt({ dkDen: e.target.value })} placeholder="đến" />
            <Tag ton="gh">khối {khoi}</Tag>
            <Tag ton="gh">mọi mô hình ✓</Tag>
          </div>
        </Panel>

        <div className="min-w-0">
          {!dangIds.length
            ? <Empty icon="↻">Chọn ít nhất một <b>cách xử lý</b> ở cột trái. Kết quả là các <b>ý</b> thuộc dạng đó, trải nhiều họ mô hình.</Empty>
            : (
              <>
                <div className="mb-2.5 text-[12px] text-slate-400">
                  {ds.length} ý thuộc dạng này · trải <b className="text-slate-700">{hoCuaKetQua} họ mô hình</b> · tick từng ý
                </div>
                {ds.map(({ y, bai, bt }) => {
                  const mh = L.moHinh.find((m) => m.id === bt.mo_hinh_id)
                  const tick = gio.includes(y.id)
                  return (
                    <button key={y.id} onClick={() => setOt({ gio: tick ? gio.filter((x) => x !== y.id) : [...gio, y.id] })}
                      className="mb-2 flex w-full items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:shadow-sm">
                      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-[1.5px] text-[12px] text-white ${
                        tick ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>{tick ? '✓' : ''}</span>
                      <div className="min-w-0 flex-1">
                        <Ma>{bai.ma_bai} · ý {y.nhan_hien_thi ?? y.thu_tu} · {bai.nguon ?? 'chưa rõ nguồn'}</Ma>
                        <div className="my-1 text-[12.5px] text-slate-700"><MathText>{y.noi_dung}</MathText></div>
                        <div className="flex flex-wrap gap-1.5">
                          {mh && <Tag ton="mh">{mh.ma}</Tag>}
                          <Cap cap={bt.cap} />
                          <Tag ton="gh">độ khó {api.mucDoCua(L, bt.id)}</Tag>
                        </div>
                      </div>
                      <div className="w-[88px] shrink-0"><Fig src={bai.anh_de} h="h-14" /></div>
                    </button>
                  )
                })}
                {!ds.length && <Empty icon="↻">Chưa có ý nào của dạng này trong <b>kho chính</b> — nhập/gán bài trước.</Empty>}
              </>
            )}
        </div>

        <Panel label="Phiếu ôn tập" className="sticky top-4">
          <div className="space-y-1 text-[12.5px] text-slate-600">
            {chon.map((x) => (
              <div key={x.y.id} className="truncate">
                {x.bai.ma_bai} · ý {x.y.nhan_hien_thi ?? x.y.thu_tu}{' '}
                <Ma>{L.moHinh.find((m) => m.id === x.bt.mo_hinh_id)?.ma}</Ma>
              </div>
            ))}
            {!chon.length && <div className="text-slate-400">— chưa tick ý nào —</div>}
          </div>
          <div className="mt-3 space-y-1 border-t border-slate-100 pt-3 text-[12.5px]">
            <div className="flex justify-between"><span>Số ý</span><b>{chon.length}</b></div>
            <div className="flex justify-between"><span>Họ mô hình</span><b>{soHo}</b></div>
            <div className="flex justify-between"><span>Độ khó TB</span><b>{dkTB}</b></div>
          </div>
          <div className="mt-3 rounded-lg border border-violet-300 bg-violet-50 px-2.5 py-2 text-[11.5px] leading-relaxed text-violet-800">
            Cùng một <b>cách xử lý</b>, nhiều cấu hình khác nhau — đó là điều ôn tập cần. Không cần mạch liền như giảng dạy.
          </div>
          <Btn kind="pri" className="mt-3 w-full justify-center" disabled={!chon.length}
            onClick={() => setInBan(banInOnTap(L, chon))}>⎙ Xuất phiếu</Btn>
        </Panel>
      </div>
      {inBan && <HinhPrintView ban={inBan} onClose={() => setInBan(null)} />}
    </>
  )
}

/** Phiếu ôn tập → bản in: gom ý theo BÀI THẬT (giữ nguyên văn + hình đề gốc, KHÔNG chuẩn hoá chữ). */
function banInOnTap(L: Luoi, chon: { y: Y; bai: Bai; bt: BaiToan }[]): BanIn {
  const theoBai = new Map<string, { bai: Bai; ys: YIn[] }>()
  for (const { y, bai } of chon) {
    const da = api.dapAnHaiBac(L, y)
    const g = theoBai.get(bai.id) ?? { bai, ys: [] }
    g.ys.push({
      nhan: y.nhan_hien_thi ?? String.fromCharCode(96 + y.thu_tu),
      noiDung: y.noi_dung,
      loiGiai: da.loiGiai,
      anh: da.anh,
      bacThamChieu: da.bac === 'tham_chieu',
      ma: y.ma_y,
    })
    theoBai.set(bai.id, g)
  }
  const hos = new Set(chon.map((x) => api.gocHoCua(L, x.bt.mo_hinh_id)))
  return {
    tieuDe: 'Phiếu ôn tập',
    phuDe: `${chon.length} ý · ${theoBai.size} bài · phủ ${hos.size} họ mô hình`,
    mucs: [...theoBai.values()].map((g) => ({
      kieu: 'de' as const, deBai: g.bai.de_bai, anhDe: g.bai.anh_de, nguon: g.bai.nguon, ma: g.bai.ma_bai, ys: g.ys,
    })),
  }
}

// ══════════════════ CHẾ ĐỘ THEO MÔ HÌNH ══════════════════
// Một buổi đi NHIỀU node. Soạn = chọn MÔ HÌNH CHÍNH + các mô hình VỆ TINH (lá) của nó → bày mọi node →
// tick node → builder chọn SỐ BÀI mỗi node (kho bài = đề chuẩn + biến thể + ý thật, khác nhau từng node) →
// tách TRÊN LỚP / VỀ NHÀ, auto rút không trùng → xuất 2 phiếu (như builder Đại). In nhẹ, không lưu DB.
type NguonBai = 'chuan' | 'bienthe' | 'that'
type PoolItem = { key: string; nguon: NguonBai; deBai: string; anhDe: string | null; ys: YIn[] }
const NGUON_NHAN: Record<NguonBai, string> = { chuan: 'chuẩn', bienthe: 'biến thể', that: 'bài thật' }
const DONG_BTVN = 6   // số dòng kẻ mặc định mỗi ý ở phiếu Về nhà (chỉnh được per bài)
// Khử bài GHÉP trùng: cùng bộ node (bất kể thứ tự) chỉ giữ phần tử ĐẦU.
function dedupeGhep<T extends { nodeIds: string[] }>(arr: T[]): T[] {
  const seen = new Set<string>()
  return arr.filter((g) => { const k = [...g.nodeIds].sort().join(','); if (seen.has(k)) return false; seen.add(k); return true })
}

/** Kho bài của MỘT node = đề chuẩn (1, derive) + biến thể (đổi số/thay điểm) + ý thật trỏ vào node (kho chính). */
async function poolCuaNode(L: Luoi, bt: BaiToan): Promise<PoolItem[]> {
  const [bienThe, yThat] = await Promise.all([api.listBienThe(bt.id), api.yTheoNode(bt.id)])
  const c = api.cachMacDinh(L, bt.id)
  const anhChuan = api.anhCuaBaiToan(L, bt.id)
  const items: PoolItem[] = [{
    key: `${bt.id}:chuan`, nguon: 'chuan',
    deBai: [api.giaThietDayDu(L, bt.mo_hinh_id), `Chứng minh ${bt.phat_bieu}`].filter(Boolean).join('. '),
    anhDe: anhChuan,
    ys: [{ nhan: '', noiDung: '', loiGiai: c?.loi_giai, anh: c?.anh_loi_giai ?? anhChuan, ma: bt.ma, cap: bt.cap }],
  }]
  for (const v of bienThe) items.push({
    key: `bt:${v.id}`, nguon: 'bienthe', deBai: v.de_bai, anhDe: v.anh,
    ys: [{ nhan: '', noiDung: '', loiGiai: v.loi_giai, anh: v.anh_loi_giai ?? v.anh, ma: bt.ma, cap: bt.cap }],
  })
  for (const { y, bai } of yThat) {
    const da = api.dapAnHaiBac(L, y)
    items.push({
      key: `y:${y.id}`, nguon: 'that', deBai: bai.de_bai, anhDe: bai.anh_de,
      ys: [{ nhan: y.nhan_hien_thi ?? String.fromCharCode(96 + y.thu_tu), noiDung: y.noi_dung, loiGiai: da.loiGiai, anh: da.anh, bacThamChieu: da.bac === 'tham_chieu', ma: y.ma_y }],
    })
  }
  return items
}

function TheoMoHinh({ L, khoi }: { L: Luoi; khoi: string }) {
  const maCap = useMemo(() => api.maPhanCapMap(L), [L])
  const [mh, setMh] = useSoanSlice(khoi, 'mh')  // nháp store (giữ khi rời màn) — chỉ LỰA CHỌN
  const mainId = mh.mainId
  const sel = mh.sel  // node → (khoá bài → 'lop'|'nha'); mỗi bài 1 phiếu ⇒ không trùng
  const satIds = useMemo(() => new Set(mh.satIds), [mh.satIds])
  const nodeIds = useMemo(() => new Set(mh.nodeIds), [mh.nodeIds])
  const [pools, setPools] = useState<Map<string, PoolItem[]>>(new Map())  // pool bài — RAM local, re-fetch khi quay lại
  const [inBan, setInBan] = useState<BanIn | null>(null)

  // Vệ tinh = con LÁ (không có con) của mô hình chính.
  const vetinh = useMemo(() => (mainId
    ? api.conCua(L, mainId).map((id) => L.moHinh.find((m) => m.id === id)!).filter((m) => m && api.conCua(L, m.id).length === 0)
    : []), [L, mainId])
  const modelIds = useMemo(() => (mainId ? [mainId, ...mh.satIds] : []), [mainId, mh.satIds])
  const nodes = useMemo(() => L.baiToan.filter((b) => modelIds.includes(b.mo_hinh_id)).sort((a, b) => a.cap - b.cap || a.ma.localeCompare(b.ma)), [L, modelIds])
  const tickedNodes = useMemo(() => nodes.filter((n) => nodeIds.has(n.id)), [nodes, nodeIds])

  // Quay lại màn: nodeIds phục hồi từ nháp nhưng pool (RAM local) rỗng → nạp lại pool (KHÔNG tự chọn sẵn).
  useEffect(() => {
    const missing = mh.nodeIds.filter((id) => !pools.has(id))
    if (!missing.length) return
    let alive = true
    Promise.all(missing.map(async (id) => { const bt = L.baiToan.find((b) => b.id === id); return bt ? [id, await poolCuaNode(L, bt)] as const : null }))
      .then((res) => {
        if (!alive) return
        const loaded = res.filter(Boolean) as [string, PoolItem[]][]
        setPools((m) => { const n = new Map(m); for (const [id, p] of loaded) n.set(id, p); return n })
      })
    return () => { alive = false }
  }, [mh.nodeIds, L]) // eslint-disable-line react-hooks/exhaustive-deps

  // Đổi mô hình chính → reset chọn (tránh giữ node/vệ tinh của mô hình cũ).
  const chonMain = (id: string) => setMh({ mainId: id, satIds: [], nodeIds: [], sel: {} })
  const toggleSat = (id: string) => setMh({ satIds: satIds.has(id) ? mh.satIds.filter((x) => x !== id) : [...mh.satIds, id] })
  const tickNode = (id: string) => setMh({ nodeIds: nodeIds.has(id) ? mh.nodeIds.filter((x) => x !== id) : [...mh.nodeIds, id] })
  // Đặt lại DANH SÁCH bài của MỘT phiếu (lop/nha) cho 1 node (từ picker). Giữ nguyên phiếu kia ⇒ không trùng.
  const setPhanPick = (nodeId: string, phan: 'lop' | 'nha', keys: string[]) => {
    const cur = { ...(sel[nodeId] ?? {}) }
    for (const k of Object.keys(cur)) if (cur[k] === phan) delete cur[k]  // xoá lựa chọn cũ của phiếu này
    for (const k of keys) cur[k] = phan
    setMh({ sel: { ...sel, [nodeId]: cur } })
  }
  // Gợi ý TỰ ĐỘNG cho 1 phiếu: lấy N bài đầu kho CHƯA nằm ở phiếu kia → phiếu này (ghi đè phiếu này).
  const goiYPhan = (nodeId: string, phan: 'lop' | 'nha', n: number) => {
    const pool = pools.get(nodeId) ?? []
    const other = phan === 'lop' ? 'nha' : 'lop'
    const cur = { ...(sel[nodeId] ?? {}) }
    for (const k of Object.keys(cur)) if (cur[k] === phan) delete cur[k]
    pool.filter((p) => cur[p.key] !== other).slice(0, n).forEach((p) => { cur[p.key] = phan })
    setMh({ sel: { ...sel, [nodeId]: cur } })
  }

  // Bài đã chọn cho từng phiếu (kèm node). Node ĐÃ GHÉP (cùng phiếu) → BỎ bài lẻ (đã nằm trong bài a,b,c).
  const chosen = (phan: 'lop' | 'nha') => {
    const daGhep = new Set(mh.ghep.filter((g) => g.phan === phan).flatMap((g) => g.nodeIds))
    return tickedNodes.flatMap((n) => (daGhep.has(n.id) ? [] : (pools.get(n.id) ?? []).filter((p) => sel[n.id]?.[p.key] === phan).map((p) => ({ n, p }))))
  }
  const dsLop = chosen('lop'), dsNha = chosen('nha')

  // Bài a,b,c GHÉP từ chuỗi (đề chuẩn: luaId null). Chéo node ⇒ để ở mh (không per-node).
  const ghep = mh.ghep
  const addGhep = (phan: 'lop' | 'nha', luaId: string | null, nodeIds: string[]) => {
    const dh = [...nodeIds].sort().join(',')
    if (ghep.some((g) => g.phan === phan && [...g.nodeIds].sort().join(',') === dh)) return  // đã có ghép y hệt (cùng phiếu + node) → không thêm nữa
    // Ghép "ăn" các node → xoá bài lẻ (sel) của chúng ở phiếu này, tránh lặp bài a,b,c với bài lẻ.
    const newSel: typeof sel = { ...sel }
    for (const nid of nodeIds) {
      if (!newSel[nid]) continue
      const cur = { ...newSel[nid] }
      for (const k of Object.keys(cur)) if (cur[k] === phan) delete cur[k]
      newSel[nid] = cur
    }
    setMh({ sel: newSel, ghep: [...ghep, { key: crypto.randomUUID(), phan, luaId, nodeIds }] })
  }
  const removeGhep = (key: string) => setMh({ ghep: ghep.filter((g) => g.key !== key) })
  // Khử trùng: bài ghép GIỐNG HỆT (cùng bộ node) chỉ giữ 1 (phòng buổi cũ / reload dính ghép lặp).
  const ghepLop = dedupeGhep(ghep.filter((g) => g.phan === 'lop')), ghepNha = dedupeGhep(ghep.filter((g) => g.phan === 'nha'))

  // GOM node thành CHUỖI liên thông — mỗi chuỗi HIỆN 1 LẦN. Chuỗi >1 câu → khối ghép a,b,c; 1 câu → node lẻ.
  const components = useMemo(() => {
    const seen = new Set<string>(); const comps: BaiToan[][] = []
    for (const n of nodes) { if (seen.has(n.id)) continue; const chain = api.chuoiKetNoi(L, n.id); chain.forEach((b) => seen.add(b.id)); comps.push(chain) }
    return comps
  }, [nodes, L])
  // Đặt bài a,b,c của MỘT chuỗi cho MỘT phiếu (nodeIds = câu đã tick; rỗng = bỏ chuỗi khỏi phiếu). Thay đúng ghép của chuỗi đó.
  const setChuoiGhep = (chuoiIds: Set<string>, phan: 'lop' | 'nha', nodeIds: string[]) => {
    const others = ghep.filter((g) => !(g.phan === phan && g.nodeIds.length > 0 && g.nodeIds.every((id) => chuoiIds.has(id))))
    setMh({ ghep: nodeIds.length ? [...others, { key: crypto.randomUUID(), phan, luaId: null, nodeIds }] : others })
  }

  // Ẩn hình (HS tự vẽ) theo từng bài — mặc định HIỆN. anDe chứa khoá bài đã ẩn.
  const anDe = mh.anDe
  const toggleAnDe = (key: string) => setMh({ anDe: anDe.includes(key) ? anDe.filter((k) => k !== key) : [...anDe, key] })

  // Số dòng kẻ HS viết cho BTVN (per bài). Vắng = mặc định. Đặt 0 → xoá khỏi map.
  const soDong = mh.soDong
  const setSoDong = (key: string, n: number) => { const m = { ...soDong }; if (n > 0) m[key] = n; else delete m[key]; setMh({ soDong: m }) }

  const [luuOpen, setLuuOpen] = useState(false)   // popup "Lưu vào giáo trình"
  const coChon = dsLop.length + dsNha.length + ghep.length > 0
  // Sửa buổi giáo trình (mở từ màn Giáo trình): Lưu = CẬP NHẬT buổi đó, không tạo mới.
  const editBuoi = mh.editBuoi
  const capNhatBuoi = async () => {
    if (!editBuoi) return
    try { await gt.saveBuoiSelection(editBuoi, { sel, ghep, anDe, soDong }); alert('Đã cập nhật buổi giáo trình.') }
    catch (e: any) { alert(e.message ?? String(e)) }
  }
  const buoiMoi = () => setMh({ mainId: '', satIds: [], nodeIds: [], sel: {}, ghep: [], anDe: [], soDong: {}, editBuoi: null })

  return (
    <>
      <p className="mb-3.5 max-w-4xl text-[12.5px] leading-relaxed text-slate-500">
        Một buổi đi <b>nhiều node</b>. Chọn <b>mô hình chính</b> + các <b>mô hình vệ tinh</b> → tick node → chọn
        <b> số bài</b> mỗi node (kho bài = đề chuẩn + biến thể + bài thật, khác nhau từng node) → tách <b>Trên lớp</b> / <b>Về nhà</b>, hệ tự rút không trùng.
      </p>
      <div className="grid items-start gap-4 xl:grid-cols-[300px_1fr_248px]">
        {/* CỘT 1 — chọn mô hình chính + vệ tinh */}
        <Panel label="Mô hình của buổi">
          <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">Mô hình chính</div>
          <select className={inpCls} value={mainId} onChange={(e) => chonMain(e.target.value)}>
            <option value="">— chọn mô hình —</option>
            {L.moHinh.slice().sort((a, b) => (maCap.get(a.id) ?? '').localeCompare(maCap.get(b.id) ?? '')).map((m) => (
              <option key={m.id} value={m.id}>{maCap.get(m.id) ?? '?'} · {tron(m.ten).slice(0, 42)}</option>
            ))}
          </select>
          {mainId && (
            <div className="mt-3">
              <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">Mô hình vệ tinh · {vetinh.length}</div>
              {vetinh.length === 0
                ? <div className="text-[11.5px] text-slate-400">— mô hình này không có vệ tinh (lá) —</div>
                : vetinh.map((v) => (
                  <label key={v.id} className="mb-1 flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-indigo-200 bg-indigo-50/40 px-2 py-1.5 text-[12px] text-slate-700 hover:bg-indigo-50">
                    <input type="checkbox" checked={satIds.has(v.id)} onChange={() => toggleSat(v.id)} />
                    <Ma>{maCap.get(v.id) ?? '?'}</Ma><span className="min-w-0 flex-1 truncate"><MathText>{v.ten}</MathText></span>
                  </label>
                ))}
              <p className="mt-2 text-[11px] leading-relaxed text-slate-400">Vệ tinh = mô hình lá treo dưới mô hình chính. Tick để lấy thêm node của nó vào buổi.</p>
            </div>
          )}
        </Panel>

        {/* CỘT 2 — tick node + builder số bài mỗi node */}
        <div className="min-w-0">
          {!mainId
            ? <Empty icon="◇">Chọn <b>mô hình chính</b> ở cột trái — hệ bày mọi node của nó (và vệ tinh đã tick) để chọn vào buổi.</Empty>
            : !nodes.length
              ? <Empty icon="◇">Mô hình đã chọn chưa có node nào. Tạo node ở <b>Sơ đồ</b> trước.</Empty>
              : components.map((comp) => {
                if (comp.length > 1) return <ChuoiRow key={comp.map((b) => b.id).join(',')} chuoi={comp} ghep={ghep} onSet={setChuoiGhep} />
                const n = comp[0]
                return (
                  <NodeRow key={n.id} L={L} n={n} maCap={maCap} on={nodeIds.has(n.id)} pool={pools.get(n.id) ?? []}
                    pick={sel[n.id] ?? {}} onTick={() => tickNode(n.id)}
                    onSetPhan={(phan, keys) => setPhanPick(n.id, phan, keys)} onGoiY={(phan, c) => goiYPhan(n.id, phan, c)}
                    onAddGhep={(phan, ids) => addGhep(phan, null, ids)} />
                )
              })}
        </div>

        {/* CỘT 3 — tổng kết + xuất 2 phiếu */}
        <Panel label="Xuất phiếu" className="sticky top-4">
          {!tickedNodes.length && !ghep.length
            ? <div className="text-[12.5px] text-slate-400">— chưa tick node nào —</div>
            : (
              <>
                <PhieuList nhan="📘 Trên lớp" ton="lop" ds={dsLop} ghep={ghepLop} L={L} onRemoveGhep={removeGhep} anDe={anDe} onToggleAnDe={toggleAnDe} soDong={soDong} onSetSoDong={setSoDong} />
                <div className="my-2 border-t border-slate-100" />
                <PhieuList nhan="📝 Về nhà" ton="nha" ds={dsNha} ghep={ghepNha} L={L} onRemoveGhep={removeGhep} anDe={anDe} onToggleAnDe={toggleAnDe} soDong={soDong} onSetSoDong={setSoDong} />
              </>
            )}
          <div className="mt-3 flex gap-4 border-t border-slate-100 pt-3 text-[12.5px]">
            <span className="text-sky-700">Lớp <b>{dsLop.length + ghepLop.length}</b></span>
            <span className="text-orange-600">Nhà <b>{dsNha.length + ghepNha.length}</b></span>
            <span className="ml-auto text-slate-400">{tickedNodes.length} node</span>
          </div>
          <Btn kind="pri" className="mt-3 w-full justify-center" disabled={!dsLop.length && !ghepLop.length}
            onClick={() => setInBan(banInTheoMoHinh('Trên lớp', 'lop', tickedNodes, pools, sel, ghep, L, anDe, soDong))}>📘 Xuất phiếu Trên lớp</Btn>
          <Btn className="mt-2 w-full justify-center" disabled={!dsNha.length && !ghepNha.length}
            onClick={() => setInBan(banInTheoMoHinh('Về nhà (BTVN)', 'nha', tickedNodes, pools, sel, ghep, L, anDe, soDong))}>📝 Xuất phiếu Về nhà</Btn>
          <p className="mt-2.5 text-[11px] leading-relaxed text-slate-400">Mỗi bài chỉ vào <b>một</b> phiếu. <b>🔗</b> = a,b,c ghép chuỗi. <b>✏️</b> = ẩn hình, chừa ô HS tự vẽ.</p>
          <div className="mt-3 border-t border-slate-100 pt-3">
            {editBuoi ? (
              <>
                <Btn kind="pri" className="w-full justify-center" disabled={!coChon} onClick={capNhatBuoi}>💾 Cập nhật buổi này</Btn>
                <div className="mt-1.5 flex items-center gap-2 text-[11px]">
                  <span className="font-medium text-violet-700">✎ Đang sửa buổi giáo trình</span>
                  <button onClick={buoiMoi} className="ml-auto text-slate-400 hover:text-slate-700">↺ Thoát / Buổi mới</button>
                </div>
              </>
            ) : (
              <>
                <Btn className="w-full justify-center border-violet-300 text-violet-700" disabled={!coChon} onClick={() => setLuuOpen(true)}>💾 Lưu vào giáo trình</Btn>
                <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">Lưu lựa chọn hiện tại thành <b>một buổi</b> trong giáo trình (để gán lớp sau).</p>
              </>
            )}
          </div>
        </Panel>
      </div>
      {inBan && <HinhPrintView ban={inBan} onClose={() => setInBan(null)} />}
      {luuOpen && <LuuGiaoTrinhPopup khoi={khoi} moHinhChinhId={mainId || null}
        nhap={{ sel, ghep, anDe, soDong }} onClose={() => setLuuOpen(false)} onDone={() => setLuuOpen(false)} />}
    </>
  )
}

// Popup "Lưu vào giáo trình": chọn/tạo giáo trình + đặt tên buổi → tạo buổi master + lưu bài của nháp.
function LuuGiaoTrinhPopup({ khoi, moHinhChinhId, nhap, onClose, onDone }: {
  khoi: string; moHinhChinhId: string | null
  nhap: { sel: Record<string, Record<string, 'lop' | 'nha'>>; ghep: GhepItem[]; anDe: string[]; soDong: Record<string, number> }
  onClose: () => void; onDone: () => void
}) {
  const [gts, setGts] = useState<GiaoTrinh[]>([])
  const [gtId, setGtId] = useState('')        // '' = tạo giáo trình mới
  const [tenMoi, setTenMoi] = useState('')
  const [tieuDe, setTieuDe] = useState('')
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => { gt.listGiaoTrinh(khoi).then((d) => { setGts(d); setGtId(d[0]?.id ?? '') }).catch(() => setGts([])) }, [khoi])
  const luu = async () => {
    if (!gtId && !tenMoi.trim()) { setLoi('Chọn giáo trình có sẵn hoặc đặt tên giáo trình mới.'); return }
    setBusy(true); setLoi(null)
    try {
      const id = gtId || (await gt.createGiaoTrinh({ ten: tenMoi.trim(), khoi })).id
      const buoi = await gt.createBuoiMaster(id, { tieu_de: tieuDe.trim() || null, mo_hinh_chinh_id: moHinhChinhId })
      await gt.saveBuoiSelection(buoi.id, nhap)
      alert('Đã lưu buổi vào giáo trình.')
      onDone()
    } catch (e: any) { setLoi(e.message ?? String(e)); setBusy(false) }
  }
  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-3 sm:p-6" onClick={onClose}>
      <div className="w-[92vw] max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
          <h3 className="text-[15px] font-semibold text-slate-900">💾 Lưu vào giáo trình</h3>
          <button onClick={onClose} className="ml-auto rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50">Đóng</button>
        </div>
        <div className="space-y-3 p-5">
          <div>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Giáo trình</div>
            <select className={inpCls} value={gtId} onChange={(e) => setGtId(e.target.value)}>
              {gts.map((g) => <option key={g.id} value={g.id}>{g.ten}</option>)}
              <option value="">+ Tạo giáo trình mới…</option>
            </select>
            {!gtId && <input className={`${inpCls} mt-1.5`} value={tenMoi} onChange={(e) => setTenMoi(e.target.value)} placeholder={`Tên giáo trình mới · Khối ${khoi}`} />}
          </div>
          <div>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Tên buổi (tuỳ chọn)</div>
            <input className={inpCls} value={tieuDe} onChange={(e) => setTieuDe(e.target.value)} placeholder="vd Buổi 5 — Trực tâm" />
          </div>
          {loi && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</div>}
        </div>
        <div className="flex items-center gap-3 border-t border-slate-200 px-5 py-3">
          <div className="ml-auto flex gap-2">
            <button onClick={onClose} className="rounded-lg px-3 py-2 text-[13px] text-slate-500 hover:bg-slate-100">Huỷ</button>
            <Btn kind="pri" disabled={busy} onClick={luu}>{busy ? 'Đang lưu…' : 'Lưu buổi'}</Btn>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

/** Bài lẻ (từ sel) + bài a,b,c GHÉP (từ ghep) của MỘT phiếu → bản in. */
function banInTheoMoHinh(tieuDe: string, phan: 'lop' | 'nha', nodes: BaiToan[], pools: Map<string, PoolItem[]>, sel: Record<string, Record<string, 'lop' | 'nha'>>, ghep: GhepItem[], L: Luoi, anDe: string[], soDong: Record<string, number>): BanIn {
  const an = new Set(anDe)
  const daGhep = new Set(ghep.filter((g) => g.phan === phan).flatMap((g) => g.nodeIds))   // node đã ghép → bỏ bài lẻ
  const dong = (key: string) => (phan === 'nha' ? (soDong[key] ?? DONG_BTVN) : soDong[key] ?? 0)   // BTVN mặc định DONG_BTVN; trên lớp KHÔNG kẻ dòng (bài sát nhau)
  const mucs: MucIn[] = []
  for (const bt of nodes) {
    if (daGhep.has(bt.id)) continue
    const pick = sel[bt.id] ?? {}
    for (const it of (pools.get(bt.id) ?? [])) {
      if (pick[it.key] === phan) mucs.push({ kieu: 'de', deBai: it.deBai, anhDe: it.anhDe, ma: bt.ma, ys: it.ys, anDe: an.has(it.key) || !it.anhDe, soDong: dong(it.key) })
    }
  }
  for (const g of dedupeGhep(ghep.filter((x) => x.phan === phan))) mucs.push(mucGhep(L, g, an.has(g.key), dong(g.key)))
  return { tieuDe: `Buổi học — ${tieuDe}`, phuDe: `${mucs.length} mục · ${nodes.length} node`, mucs }
}
/** Ghép chuỗi (đề chuẩn) → 1 bài a,b,c: giả thiết + hình của node SÂU NHẤT chung; ý a,b,c = câu hỏi + lời giải từng node. */
export function mucGhep(L: Luoi, g: GhepItem, anDe: boolean, soDong?: number | null): MucIn {
  const nodes = (g.nodeIds.map((id) => L.baiToan.find((b) => b.id === id)).filter(Boolean) as BaiToan[])
    .sort((a, b) => a.cap - b.cap || a.ma.localeCompare(b.ma))
  let deep = nodes[0]; let dS = -1
  for (const bt of nodes) { const d = api.doSauTrongHo(L, bt.mo_hinh_id); if (d > dS) { dS = d; deep = bt } }
  const ys: YIn[] = nodes.map((bt, i) => {
    const c = api.cachMacDinh(L, bt.id)
    return { nhan: String.fromCharCode(97 + i), noiDung: `Chứng minh ${bt.phat_bieu}`, loiGiai: c?.loi_giai ?? null, anh: c?.anh_loi_giai ?? null, ma: bt.ma, cap: bt.cap }
  })
  const anhDe = api.anhCuaBaiToan(L, deep.id)
  return { kieu: 'de', deBai: api.giaThietDayDu(L, deep.mo_hinh_id), anhDe, ma: nodes.map((b) => b.ma).join('+'), ys, anDe: anDe || !anhDe, soDong: soDong ?? null }
}

// ── Một CHUỖI (nhiều câu nối tiền đề) — hiện 1 lần. 2 khối Trên lớp / Về nhà RIÊNG; tick câu → bài a,b,c của phiếu đó ──
function ChuoiRow({ chuoi, ghep, onSet }: {
  chuoi: BaiToan[]; ghep: GhepItem[]; onSet: (chuoiIds: Set<string>, phan: 'lop' | 'nha', nodeIds: string[]) => void
}) {
  const chuoiIds = useMemo(() => new Set(chuoi.map((b) => b.id)), [chuoi])
  const ghepOf = (phan: 'lop' | 'nha') => ghep.find((g) => g.phan === phan && g.nodeIds.length > 0 && g.nodeIds.every((id) => chuoiIds.has(id)))
  return (
    <div className="mb-2 rounded-xl border border-violet-200 bg-violet-50/30 p-3">
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-violet-700">🔗 Chuỗi {chuoi.length} câu — ghép a,b,c</div>
      <div className="space-y-2">
        {(['lop', 'nha'] as const).map((phan) => {
          const g = ghepOf(phan); const on = !!g
          const checked = new Set(g?.nodeIds ?? chuoi.map((b) => b.id))
          const laLop = phan === 'lop'
          const toggle = () => onSet(chuoiIds, phan, on ? [] : chuoi.map((b) => b.id))
          const tickCau = (id: string) => { const s = new Set(checked); s.has(id) ? s.delete(id) : s.add(id); onSet(chuoiIds, phan, chuoi.filter((b) => s.has(b.id)).map((b) => b.id)) }
          return (
            <div key={phan} className={`rounded-lg border p-2.5 ${laLop ? 'border-sky-200 bg-sky-50/40' : 'border-orange-200 bg-orange-50/40'}`}>
              <label className="flex cursor-pointer items-center gap-2 text-[12px] font-semibold">
                <input type="checkbox" checked={on} onChange={toggle} />
                <span className={laLop ? 'text-sky-700' : 'text-orange-600'}>{laLop ? '📘 Trên lớp' : '📝 Về nhà'}</span>
                {on && <span className="text-[11px] font-normal text-slate-400">— {chuoi.filter((b) => checked.has(b.id)).length} ý</span>}
              </label>
              {on && (
                <ol className="mt-1.5 space-y-1">
                  {chuoi.map((b, i) => {
                    const c = checked.has(b.id)
                    const idx = chuoi.filter((x, j) => j <= i && checked.has(x.id)).length
                    return (
                      <li key={b.id} className="flex items-center gap-2 rounded-md border border-slate-100 bg-white/70 px-2 py-1 text-[12px]">
                        <input type="checkbox" checked={c} onChange={() => tickCau(b.id)} />
                        <span className="w-4 shrink-0 text-center text-[11px] font-bold text-violet-600">{c ? `${String.fromCharCode(96 + idx)})` : '–'}</span>
                        <span className="min-w-0 flex-1 truncate text-slate-700"><MathText>{b.phat_bieu}</MathText></span>
                        <Ma>{b.ma}</Ma>
                      </li>
                    )
                  })}
                </ol>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
// ── Một NODE trong builder: header tick + (khi mở) 2 KHỐI tách hẳn Trên lớp / Về nhà (như DangCard Đại) ──
function NodeRow({ L, n, maCap, on, pool, pick, onTick, onSetPhan, onGoiY, onAddGhep }: {
  L: Luoi; n: BaiToan; maCap: Map<string, string>; on: boolean; pool: PoolItem[]
  pick: Record<string, 'lop' | 'nha'>; onTick: () => void
  onSetPhan: (phan: 'lop' | 'nha', keys: string[]) => void; onGoiY: (phan: 'lop' | 'nha', n: number) => void
  onAddGhep: (phan: 'lop' | 'nha', nodeIds: string[]) => void
}) {
  const mhNode = L.moHinh.find((m) => m.id === n.mo_hinh_id)
  const chuoi = api.chuoiKetNoi(L, n.id)   // >1 câu ⇒ cho GHÉP a,b,c
  const nLop = Object.values(pick).filter((v) => v === 'lop').length
  const nNha = Object.values(pick).filter((v) => v === 'nha').length
  return (
    <div className={`mb-2 rounded-xl border p-3 ${on ? 'border-blue-300 bg-blue-50/30' : 'border-slate-200 bg-white'}`}>
      <button onClick={onTick} className="flex w-full items-start gap-2.5 text-left">
        <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-[1.5px] text-[12px] text-white ${on ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>{on ? '✓' : ''}</span>
        <div className="min-w-0 flex-1">
          <b className="text-[12.5px] text-slate-800"><MathText>{n.phat_bieu}</MathText></b>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
            <Ma>{n.ma}</Ma><Cap cap={n.cap} />{mhNode && <Tag ton="mh">{maCap.get(mhNode.id) ?? mhNode.ma}</Tag>}
            <span>· kho {pool.length}</span>
            {on && nLop + nNha > 0 && <span className="text-slate-500"><b className="text-sky-700">{nLop}</b>📘 <b className="text-orange-600">{nNha}</b>📝</span>}
          </div>
        </div>
      </button>
      {on && (
        <div className="mt-2.5 space-y-2">
          <PhanBlock n={n} phan="lop" pool={pool} pick={pick} chuoi={chuoi} onGoiY={(c) => onGoiY('lop', c)} onSetPick={(keys) => onSetPhan('lop', keys)} onAddGhep={(ids) => onAddGhep('lop', ids)} />
          <PhanBlock n={n} phan="nha" pool={pool} pick={pick} chuoi={chuoi} onGoiY={(c) => onGoiY('nha', c)} onSetPick={(keys) => onSetPhan('nha', keys)} onAddGhep={(ids) => onAddGhep('nha', ids)} />
        </div>
      )}
    </div>
  )
}
// Một KHỐI phiếu (Trên lớp / Về nhà) của node: tiêu đề + tự động (Gợi ý) + Chọn bài (mở kho) + Ghép a,b,c + danh sách.
function PhanBlock({ n, phan, pool, pick, chuoi, onGoiY, onSetPick, onAddGhep }: {
  n: BaiToan; phan: 'lop' | 'nha'; pool: PoolItem[]; pick: Record<string, 'lop' | 'nha'>; chuoi: BaiToan[]
  onGoiY: (n: number) => void; onSetPick: (keys: string[]) => void; onAddGhep: (nodeIds: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [ghepOpen, setGhepOpen] = useState(false)
  const [g, setG] = useState(2)
  const laLop = phan === 'lop'
  const chosen = pool.filter((p) => pick[p.key] === phan)
  const tone = laLop ? 'border-sky-200 bg-sky-50/40' : 'border-orange-200 bg-orange-50/40'
  const txt = laLop ? 'text-sky-700' : 'text-orange-600'
  return (
    <div className={`rounded-lg border ${tone} p-2.5`}>
      <div className="flex flex-wrap items-center gap-2 text-[12px]">
        <span className={`font-semibold ${txt}`}>{laLop ? '📘 Trên lớp' : '📝 Về nhà'}</span>
        <span className="flex items-center gap-1 text-[11px] text-slate-500">tự động
          <input type="number" min={0} value={g} onChange={(e) => setG(Math.max(0, +e.target.value || 0))} className="h-6 w-11 rounded border border-slate-300 px-1 text-center text-[12px]" />
          <Btn className="h-6 px-2 text-[11px]" onClick={() => onGoiY(g)}>↻ Gợi ý</Btn>
        </span>
        <Btn className="h-6 px-2 text-[11px]" onClick={() => setOpen(true)}>✎ Chọn bài</Btn>
        {chuoi.length > 1 && <Btn className="h-6 px-2 text-[11px] border-violet-300 text-violet-700" onClick={() => setGhepOpen(true)}>🔗 Ghép a,b,c</Btn>}
        <span className="ml-auto text-[11px] text-slate-400">{chosen.length} bài</span>
      </div>
      {ghepOpen && <GhepChuoiPopup phan={phan} chuoi={chuoi} onClose={() => setGhepOpen(false)} onConfirm={(ids) => { onAddGhep(ids); setGhepOpen(false) }} />}
      {chosen.length === 0
        ? <div className="mt-1.5 text-[11.5px] italic text-slate-400">Chưa có bài — bấm <b>Gợi ý</b> (tự động) hoặc <b>Chọn bài</b>.</div>
        : <ol className="mt-1.5 space-y-1">
          {chosen.map((p, i) => (
            <li key={p.key} className="flex items-center gap-2 rounded-md border border-slate-100 bg-white/70 px-2 py-1 text-[12px]">
              <span className="w-4 shrink-0 text-right text-[11px] text-slate-300">{i + 1}</span>
              <span className={`shrink-0 rounded px-1.5 text-[10px] font-medium ${p.nguon === 'chuan' ? 'bg-teal-50 text-teal-700' : p.nguon === 'bienthe' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>{NGUON_NHAN[p.nguon]}</span>
              <span className="min-w-0 flex-1 truncate text-slate-700"><MathText>{p.deBai}</MathText></span>
              <button onClick={() => onSetPick(chosen.filter((x) => x.key !== p.key).map((x) => x.key))} className="shrink-0 text-slate-400 hover:text-rose-600" title="Bỏ bài này">✕</button>
            </li>
          ))}
        </ol>}
      {open && <KhoBaiPicker node={n} phan={phan} pool={pool} pick={pick} onClose={() => setOpen(false)} onConfirm={(keys) => { onSetPick(keys); setOpen(false) }} />}
    </div>
  )
}
// Picker kho bài của MỘT node cho MỘT phiếu — bài đang ở phiếu KIA bị KHOÁ (không cho trùng), như KhoPicker Đại.
function KhoBaiPicker({ node, phan, pool, pick, onClose, onConfirm }: {
  node: BaiToan; phan: 'lop' | 'nha'; pool: PoolItem[]; pick: Record<string, 'lop' | 'nha'>
  onClose: () => void; onConfirm: (keys: string[]) => void
}) {
  const other = phan === 'lop' ? 'nha' : 'lop'
  const [chon, setChon] = useState<Set<string>>(new Set(pool.filter((p) => pick[p.key] === phan).map((p) => p.key)))
  const nhan = phan === 'lop' ? 'Trên lớp' : 'Về nhà'
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-3 sm:p-6" onClick={onClose}>
      <div className="flex max-h-[85vh] w-[92vw] max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
          <h3 className="text-[15px] font-semibold text-slate-900">Chọn bài — {nhan}</h3>
          <Ma>{node.ma}</Ma>
          <span className="text-[12px] text-slate-400">kho {pool.length} bài</span>
          <button onClick={onClose} className="ml-auto rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50">Đóng</button>
        </div>
        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-4">
          {pool.length === 0
            ? <div className="py-8 text-center text-[13px] text-slate-400">Node chưa có bài (chưa biến thể / bài thật) — chỉ có đề chuẩn.</div>
            : pool.map((p) => {
              const khoa = pick[p.key] === other
              const on = chon.has(p.key)
              return (
                <button key={p.key} type="button" disabled={khoa}
                  onClick={() => setChon((s) => { const nw = new Set(s); nw.has(p.key) ? nw.delete(p.key) : nw.add(p.key); return nw })}
                  className={`flex w-full items-start gap-2 rounded-lg border px-2.5 py-2 text-left transition ${khoa ? 'cursor-not-allowed border-slate-100 bg-slate-50 opacity-50' : on ? 'border-blue-300 bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-[1.5px] text-[12px] text-white ${on ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>{on ? '✓' : ''}</span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-center gap-1.5">
                      <span className={`shrink-0 rounded px-1.5 text-[10px] font-medium ${p.nguon === 'chuan' ? 'bg-teal-50 text-teal-700' : p.nguon === 'bienthe' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>{NGUON_NHAN[p.nguon]}</span>
                      {khoa && <span className="rounded bg-amber-50 px-1.5 text-[10px] font-medium text-amber-700">đang ở phiếu {other === 'lop' ? 'Trên lớp' : 'Về nhà'}</span>}
                    </div>
                    <div className="text-[12.5px] text-slate-700"><MathText>{p.deBai}</MathText></div>
                  </div>
                </button>
              )
            })}
        </div>
        <div className="flex items-center gap-3 border-t border-slate-200 px-5 py-3 text-[12.5px]">
          <span className="text-slate-500"><b>{chon.size}</b> bài đã chọn</span>
          <div className="ml-auto flex gap-2">
            <button onClick={onClose} className="rounded-lg px-3 py-2 text-[13px] text-slate-500 hover:bg-slate-100">Huỷ</button>
            <Btn kind="pri" onClick={() => onConfirm([...chon])}>Xong</Btn>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
// Danh sách bài đã chọn cho 1 phiếu (cột xuất) — hiện rõ node + nguồn + đề, để soát trước khi in.
function PhieuList({ nhan, ton, ds, ghep, L, onRemoveGhep, anDe, onToggleAnDe, soDong, onSetSoDong }: {
  nhan: string; ton: 'lop' | 'nha'; ds: { n: BaiToan; p: PoolItem }[]
  ghep: GhepItem[]; L: Luoi; onRemoveGhep: (key: string) => void; anDe: string[]; onToggleAnDe: (key: string) => void
  soDong: Record<string, number>; onSetSoDong: (key: string, n: number) => void
}) {
  const col = ton === 'lop' ? 'text-sky-700' : 'text-orange-600'
  const laNha = ton === 'nha'
  const tong = ds.length + ghep.length
  // Nút ẩn/hiện hình: có hình mới bấm được (không hình thì HS luôn phải vẽ → hiện ✏️ mờ).
  const HinhBtn = ({ khoa, coHinh }: { khoa: string; coHinh: boolean }) => {
    const an = anDe.includes(khoa)
    return (
      <button onClick={() => onToggleAnDe(khoa)} title={an ? 'Đang ẩn hình — HS tự vẽ. Bấm để hiện.' : 'Đang hiện hình. Bấm để ẩn (HS tự vẽ).'}
        className={`shrink-0 rounded px-1 text-[11px] ${an || !coHinh ? 'text-amber-600' : 'text-slate-400 hover:text-slate-700'}`}>{an || !coHinh ? '✏️' : '🖼'}</button>
    )
  }
  // Số dòng HS viết (chỉ phiếu Về nhà = BTVN).
  const DongIn = ({ khoa }: { khoa: string }) => laNha ? (
    <input type="number" min={0} max={30} value={soDong[khoa] ?? DONG_BTVN} onChange={(e) => onSetSoDong(khoa, Math.max(0, Math.min(30, +e.target.value || 0)))}
      title="Số dòng kẻ HS viết mỗi ý" className="h-5 w-9 shrink-0 rounded border border-slate-300 px-1 text-center text-[10px]" />
  ) : null
  return (
    <div>
      <div className={`mb-1 text-[11px] font-semibold uppercase tracking-wide ${col}`}>{nhan} · {tong}</div>
      {tong === 0 && <div className="text-[11.5px] text-slate-400">— chưa chọn bài —</div>}
      {ds.map(({ n, p }) => (
        <div key={p.key} className="flex items-center gap-1.5 py-0.5 text-[11.5px] text-slate-600">
          <Ma>{n.ma}</Ma>
          <span className="shrink-0 rounded bg-slate-100 px-1 text-[10px] text-slate-500">{NGUON_NHAN[p.nguon]}</span>
          <span className="min-w-0 flex-1 truncate"><MathText>{p.deBai}</MathText></span>
          <DongIn khoa={p.key} />
          <HinhBtn khoa={p.key} coHinh={!!p.anhDe} />
        </div>
      ))}
      {ghep.map((g) => {
        const mas = g.nodeIds.map((id) => L.baiToan.find((b) => b.id === id)?.ma).filter(Boolean)
        return (
          <div key={g.key} className="flex items-center gap-1.5 py-0.5 text-[11.5px] text-slate-600">
            <span className="shrink-0 rounded bg-violet-100 px-1 text-[10px] font-medium text-violet-700">🔗 a,b,c</span>
            <span className="min-w-0 flex-1 truncate">{mas.join(' · ')}</span>
            <DongIn khoa={g.key} />
            <HinhBtn khoa={g.key} coHinh />
            <button onClick={() => onRemoveGhep(g.key)} className="shrink-0 text-slate-400 hover:text-rose-600" title="Bỏ bài ghép">✕</button>
          </div>
        )
      })}
    </div>
  )
}
// Popup GHÉP a,b,c: tick câu trong chuỗi (đề chuẩn) → 1 bài a,b,c, ý theo thứ tự tiền đề.
function GhepChuoiPopup({ phan, chuoi, onClose, onConfirm }: {
  phan: 'lop' | 'nha'; chuoi: BaiToan[]; onClose: () => void; onConfirm: (nodeIds: string[]) => void
}) {
  const [chon, setChon] = useState<Set<string>>(new Set(chuoi.map((b) => b.id)))
  const selected = chuoi.filter((b) => chon.has(b.id))   // giữ thứ tự topo của chuoi
  const nhan = phan === 'lop' ? 'Trên lớp' : 'Về nhà'
  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-3 sm:p-6" onClick={onClose}>
      <div className="flex max-h-[85vh] w-[92vw] max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
          <h3 className="text-[15px] font-semibold text-slate-900">🔗 Ghép a,b,c</h3>
          <span className="text-[12px] text-slate-400">đề chuẩn · {nhan}</span>
          <button onClick={onClose} className="ml-auto rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50">Đóng</button>
        </div>
        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4">
          <p className="text-[12px] leading-snug text-slate-500">Tick các câu trong chuỗi → gộp thành <b>1 bài</b>: giả thiết + hình chung (node sâu nhất), ý <b>a, b, c</b> theo thứ tự tiền đề.</p>
          {chuoi.map((b) => {
            const on = chon.has(b.id)
            const idx = selected.findIndex((x) => x.id === b.id)
            return (
              <button key={b.id} type="button" onClick={() => setChon((s) => { const n = new Set(s); n.has(b.id) ? n.delete(b.id) : n.add(b.id); return n })}
                className={`flex w-full items-start gap-2 rounded-lg border px-2.5 py-2 text-left transition ${on ? 'border-violet-300 bg-violet-50/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-[1.5px] text-[12px] font-bold text-white ${on ? 'border-violet-500 bg-violet-500' : 'border-slate-300 text-transparent'}`}>{on && idx >= 0 ? String.fromCharCode(97 + idx) : ''}</span>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-center gap-1.5"><Ma>{b.ma}</Ma><Cap cap={b.cap} /></div>
                  <div className="text-[12.5px] text-slate-700"><MathText>{b.phat_bieu}</MathText></div>
                </div>
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-3 border-t border-slate-200 px-5 py-3">
          <span className="text-[12.5px] text-slate-500"><b>{selected.length}</b> ý</span>
          <div className="ml-auto flex gap-2">
            <button onClick={onClose} className="rounded-lg px-3 py-2 text-[13px] text-slate-500 hover:bg-slate-100">Huỷ</button>
            <Btn kind="pri" disabled={selected.length < 2} onClick={() => onConfirm(selected.map((b) => b.id))}>Ghép ({selected.length} ý)</Btn>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
