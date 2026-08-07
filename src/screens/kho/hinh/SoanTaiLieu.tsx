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
import { useStore, SOAN_HINH_DEFAULT, type SoanHinhDraft } from '../../../store/useStore'

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

  // Bài đã chọn cho từng phiếu (kèm node) — dùng cho tổng kết + xuất. Lớp/Nhà rời nhau theo thiết kế.
  const chosen = (phan: 'lop' | 'nha') => tickedNodes.flatMap((n) => (pools.get(n.id) ?? []).filter((p) => sel[n.id]?.[p.key] === phan).map((p) => ({ n, p })))
  const dsLop = chosen('lop'), dsNha = chosen('nha')

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
              : nodes.map((n) => (
                <NodeRow key={n.id} L={L} n={n} maCap={maCap} on={nodeIds.has(n.id)} pool={pools.get(n.id) ?? []}
                  pick={sel[n.id] ?? {}} onTick={() => tickNode(n.id)}
                  onSetPhan={(phan, keys) => setPhanPick(n.id, phan, keys)} onGoiY={(phan, c) => goiYPhan(n.id, phan, c)} />
              ))}
        </div>

        {/* CỘT 3 — tổng kết + xuất 2 phiếu */}
        <Panel label="Xuất phiếu" className="sticky top-4">
          {!tickedNodes.length
            ? <div className="text-[12.5px] text-slate-400">— chưa tick node nào —</div>
            : (
              <>
                <PhieuList nhan="📘 Trên lớp" ton="lop" ds={dsLop} />
                <div className="my-2 border-t border-slate-100" />
                <PhieuList nhan="📝 Về nhà" ton="nha" ds={dsNha} />
              </>
            )}
          <div className="mt-3 flex gap-4 border-t border-slate-100 pt-3 text-[12.5px]">
            <span className="text-sky-700">Lớp <b>{dsLop.length}</b></span>
            <span className="text-orange-600">Nhà <b>{dsNha.length}</b></span>
            <span className="ml-auto text-slate-400">{tickedNodes.length} node</span>
          </div>
          <Btn kind="pri" className="mt-3 w-full justify-center" disabled={!dsLop.length}
            onClick={() => setInBan(banInTheoMoHinh('Trên lớp', 'lop', tickedNodes, pools, sel))}>📘 Xuất phiếu Trên lớp</Btn>
          <Btn className="mt-2 w-full justify-center" disabled={!dsNha.length}
            onClick={() => setInBan(banInTheoMoHinh('Về nhà (BTVN)', 'nha', tickedNodes, pools, sel))}>📝 Xuất phiếu Về nhà</Btn>
          <p className="mt-2.5 text-[11px] leading-relaxed text-slate-400">Mỗi bài chỉ vào <b>một</b> phiếu — Lớp và Nhà không bao giờ trùng.</p>
        </Panel>
      </div>
      {inBan && <HinhPrintView ban={inBan} onClose={() => setInBan(null)} />}
    </>
  )
}

/** Trên lớp = bài đầu kho mỗi node (0..lop); Về nhà = bài kế tiếp (lop..lop+nha) → KHÔNG trùng trên lớp. */
function banInTheoMoHinh(tieuDe: string, phan: 'lop' | 'nha', nodes: BaiToan[], pools: Map<string, PoolItem[]>, sel: Record<string, Record<string, 'lop' | 'nha'>>): BanIn {
  const mucs: MucIn[] = []
  for (const bt of nodes) {
    const pick = sel[bt.id] ?? {}
    for (const it of (pools.get(bt.id) ?? [])) {
      if (pick[it.key] === phan) mucs.push({ kieu: 'de', deBai: it.deBai, anhDe: it.anhDe, ma: bt.ma, ys: it.ys })
    }
  }
  return { tieuDe: `Buổi học — ${tieuDe}`, phuDe: `${mucs.length} bài · ${nodes.length} node`, mucs }
}

// ── Một NODE trong builder: header tick + (khi mở) 2 KHỐI tách hẳn Trên lớp / Về nhà (như DangCard Đại) ──
function NodeRow({ L, n, maCap, on, pool, pick, onTick, onSetPhan, onGoiY }: {
  L: Luoi; n: BaiToan; maCap: Map<string, string>; on: boolean; pool: PoolItem[]
  pick: Record<string, 'lop' | 'nha'>; onTick: () => void
  onSetPhan: (phan: 'lop' | 'nha', keys: string[]) => void; onGoiY: (phan: 'lop' | 'nha', n: number) => void
}) {
  const mhNode = L.moHinh.find((m) => m.id === n.mo_hinh_id)
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
          <PhanBlock n={n} phan="lop" pool={pool} pick={pick} onGoiY={(c) => onGoiY('lop', c)} onSetPick={(keys) => onSetPhan('lop', keys)} />
          <PhanBlock n={n} phan="nha" pool={pool} pick={pick} onGoiY={(c) => onGoiY('nha', c)} onSetPick={(keys) => onSetPhan('nha', keys)} />
        </div>
      )}
    </div>
  )
}
// Một KHỐI phiếu (Trên lớp / Về nhà) của node: tiêu đề + tự động (Gợi ý) + Chọn bài (mở kho) + danh sách đã chọn.
function PhanBlock({ n, phan, pool, pick, onGoiY, onSetPick }: {
  n: BaiToan; phan: 'lop' | 'nha'; pool: PoolItem[]; pick: Record<string, 'lop' | 'nha'>
  onGoiY: (n: number) => void; onSetPick: (keys: string[]) => void
}) {
  const [open, setOpen] = useState(false)
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
        <span className="ml-auto text-[11px] text-slate-400">{chosen.length} bài</span>
      </div>
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
function PhieuList({ nhan, ton, ds }: { nhan: string; ton: 'lop' | 'nha'; ds: { n: BaiToan; p: PoolItem }[] }) {
  const col = ton === 'lop' ? 'text-sky-700' : 'text-orange-600'
  return (
    <div>
      <div className={`mb-1 text-[11px] font-semibold uppercase tracking-wide ${col}`}>{nhan} · {ds.length}</div>
      {ds.length === 0
        ? <div className="text-[11.5px] text-slate-400">— chưa chọn bài —</div>
        : ds.map(({ n, p }) => (
          <div key={p.key} className="flex items-center gap-1.5 py-0.5 text-[11.5px] text-slate-600">
            <Ma>{n.ma}</Ma>
            <span className="shrink-0 rounded bg-slate-100 px-1 text-[10px] text-slate-500">{NGUON_NHAN[p.nguon]}</span>
            <span className="min-w-0 flex-1 truncate"><MathText>{p.deBai}</MathText></span>
          </div>
        ))}
    </div>
  )
}
