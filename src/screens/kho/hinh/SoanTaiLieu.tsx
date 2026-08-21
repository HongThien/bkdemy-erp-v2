// M9 — Soạn tài liệu, HAI CHẾ ĐỘ. Hai chế độ rút từ hai nguồn KHÁC NHAU vì mục đích khác nhau:
//
//   GIẢNG DẠY — rút từ NODE CHUẨN. Một buổi = MỘT KHÚC A→B, không in lại từ cấp 1.
//               Cần mạch liền; tên điểm nhất quán toàn tài liệu.
//   ÔN TẬP    — rút từ BÀI THẬT trong kho chính, chọn theo DẠNG, KHÔNG ràng buộc mô hình.
//               Cần đa dạng: khác hình vẽ, khác lời văn, khác tên điểm — đó chính là cái ôn tập cần.
import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import * as api from '../../../lib/kho/api'
import type { Bai, BaiToan, BienThe, Luoi, MoHinh, Y } from '../../../lib/kho/hinh'
import HinhPrintView, { type BanIn, type MucIn, type YIn } from './HinhPrintView'
import { MathText } from '../ui'
import { Btn, Cap, Empty, Fig, Ma, Panel, Seg, Sol, Tag, inpCls, tron } from './hinhUi'
import { useStore, SOAN_HINH_DEFAULT, type SoanHinhDraft, type PickItem } from '../../../store/useStore'
import * as gt from '../../../lib/kho/hinhGiaoTrinh'
import { CHE_DO_HINH, cheDoKe, type CheDoHinh } from '../../../lib/kho/hinhGiaoTrinh'

// Nháp soạn tài liệu theo khối (store, RAM) — giữ lựa chọn khi rời/quay lại màn (như etDraft).
// Trả slice của 1 chế độ + hàm patch (merge nông). Set→mảng, Map→record: component tự đổi qua lại.
function useSoanSlice<K extends 'gd' | 'ot'>(khoi: string, mode: K): [SoanHinhDraft[K], (patch: Partial<SoanHinhDraft[K]>) => void] {
  const slice = useStore((s) => (s.soanHinh[khoi] ?? SOAN_HINH_DEFAULT)[mode])
  const setSoanHinh = useStore((s) => s.setSoanHinh)
  const patch = useCallback((p: Partial<SoanHinhDraft[K]>) =>
    setSoanHinh(khoi, (cur) => ({ ...cur, [mode]: { ...cur[mode], ...p } })), [khoi, mode, setSoanHinh])
  return [slice, patch]
}

// ⭐ 08-08: chế độ "Theo mô hình" (build-rồi-lưu-popup) RÚT khỏi đây — dựng buổi giáo trình giờ làm TẠI
// CHỖ trong cây buổi của màn Giáo trình (`BuoiPickEditor`, export bên dưới). Còn lại 2 chế độ ad-hoc
// (không gắn giáo trình): Giảng dạy (khúc A→B) · Ôn tập (theo dạng, rút bài thật).
export default function SoanTaiLieu({ L, khoi }: { L: Luoi; khoi: string }) {
  const che = useStore((s) => (s.soanHinh[khoi] ?? SOAN_HINH_DEFAULT).che)
  const setSoanHinh = useStore((s) => s.setSoanHinh)
  const setChe = (v: 'gd' | 'ot') => setSoanHinh(khoi, (cur) => ({ ...cur, che: v }))
  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h1 className="text-[19px] font-semibold text-slate-900">Soạn tài liệu (ad-hoc) <span className="text-slate-400">· Khối {khoi}</span></h1>
        <Seg value={che} onChange={setChe} options={[
          { v: 'gd', label: '▶ Giảng dạy — đi tới đích' },
          { v: 'ot', label: '↻ Ôn tập — theo dạng' },
        ]} />
      </div>
      <p className="mb-3 max-w-3xl text-[12px] text-slate-400">In nhanh, không gắn giáo trình. Soạn buổi cho <b>giáo trình</b> (chọn chuỗi, gán lớp) → màn <b>Giáo trình</b>.</p>
      {che === 'gd' ? <GiangDay L={L} khoi={khoi} /> : <OnTap L={L} khoi={khoi} />}
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
                              {n.ma} · cấp {n.cap}{cach?.dang_id && ` · ${api.tenDangDayDu(L, cach.dang_id)}`}{mh && ` · ${mh.ma}`}
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
      deBai: [api.giaThietBaiToan(L, n.id), `Chứng minh ${n.phat_bieu}`].filter(Boolean).join('. '),
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
// Một buổi đi NHIỀU chuỗi (mỗi chuỗi = 1 dạng, kể cả chuỗi 1 câu). Mỗi chuỗi × phiếu = 1 DANH SÁCH pick
// (đề chuẩn / lứa / biến thể / ý thật), N + Gợi ý hoặc thêm tay từng bài → xuất 2 phiếu. In nhẹ, không lưu DB.
const DONG_BTVN = 6   // số dòng kẻ mặc định mỗi ý ở phiếu Về nhà (chỉnh được per bài)
// Chữ ký 1 pick = cùng phiếu + cùng bản (kind/luaId/bienTheId/yId) + cùng bộ node. 2 pick TRÙNG chữ ký
// in ra Y HỆT NHAU — chỉ giữ phần tử ĐẦU khi ghép bản in (dùng chung bởi dedupePicks + badge cảnh báo
// trùng trong ChuoiRow, Thùy 08-20: "builder hiện 2 câu nhưng preview chỉ hiện 1" — builder phải LỘ RÕ
// pick nào sẽ bị loại lúc in, không âm thầm khác số với preview).
function pickSig(p: PickItem): string {
  const banSig = p.kind === 'ghep' ? `ghep|${p.luaId ?? ''}` : p.kind === 'bienthe' ? `bienthe|${p.bienTheId}` : `y|${p.yId}`
  return `${p.phan}|${banSig}|${[...p.nodeIds].sort().join(',')}`
}
function dedupePicks(arr: PickItem[]): PickItem[] {
  const seen = new Set<string>()
  return arr.filter((p) => {
    const sig = pickSig(p)
    if (seen.has(sig)) return false; seen.add(sig); return true
  })
}
// Nhãn/màu theo phan — 'et'/'mt' thêm 21/08 (Thùy: builder ET/MT Hình tái dùng NGUYÊN cơ chế pick này,
// không phải giáo trình — 1 tab duy nhất, không "Trên lớp"/"Về nhà"). 'nha' vẫn là phan DUY NHẤT có "dòng kẻ".
const PHAN_META: Record<'lop' | 'nha' | 'et' | 'mt', { nhan: string; icon: string; border: string; bg: string; text: string }> = {
  lop: { nhan: 'Trên lớp', icon: '📘', border: 'border-sky-200', bg: 'bg-sky-50/40', text: 'text-sky-700' },
  nha: { nhan: 'Về nhà', icon: '📝', border: 'border-orange-200', bg: 'bg-orange-50/40', text: 'text-orange-600' },
  et: { nhan: 'ET', icon: '📄', border: 'border-violet-200', bg: 'bg-violet-50/40', text: 'text-violet-700' },
  mt: { nhan: 'MT (phần Hình)', icon: '🏆', border: 'border-amber-200', bg: 'bg-amber-50/40', text: 'text-amber-700' },
}

// ── ⭐ 08-08 "chuyển nhà": editor NỘI DUNG 1 buổi giáo trình — dùng TẠI CHỖ trong cây buổi của
// GiaoTrinhScreen (khuôn TaiLieuBuilder Đại: mỗi buổi tự chứa content, KHÔNG còn "dựng rồi lưu popup"
// tách rời). Props-driven, KHÔNG giữ nháp riêng — caller sở hữu state (picks/cheDo/soDong của 1 buổi cụ
// thể) + tự autosave (khuôn `markSaved()` của TaiLieuBuilder — mỗi thao tác ghi DB ngay, không nút Lưu). ──
export function BuoiPickEditor({ L, picks, cheDo, soDong, onChangePicks, onChangeCheDo, onChangeSoDong, phans = ['lop', 'nha'] }: {
  L: Luoi
  picks: PickItem[]; cheDo: Record<string, CheDoHinh>; soDong: Record<string, number>
  onChangePicks: (picks: PickItem[]) => void
  onChangeCheDo: (cheDo: Record<string, CheDoHinh>) => void
  onChangeSoDong: (soDong: Record<string, number>) => void
  phans?: ('lop' | 'nha' | 'et' | 'mt')[]   // mặc định giáo trình (2 tab) — ET Hình (ETScreen) truyền ['et'] (1 tab, không lop/nha)
}) {
  const maCap = useMemo(() => api.maPhanCapMap(L), [L])
  // Lọc mô hình chỉ để TÌM node dễ hơn (state cục bộ, không lưu) — KHÔNG đụng picks đã có: 1 buổi có thể
  // trộn node từ NHIỀU mô hình khác nhau, đổi bộ lọc không được xoá nội dung đã chọn.
  // ⭐ 17/08 (Thùy): "làm giáo trình hình có thể chọn nhiều mô hình" — TRƯỚC "Mô hình chính" là <select>
  // đơn (1 mainId), nên 2 mô hình KHÔNG cùng cây cha-con (vd "Tam giác" và "Tứ giác" độc lập) không lọc
  // gộp cùng lúc được, phải đổi filter qua lại nhiều lần. Đổi mainId (string) → mainIds (Set) — chọn được
  // NHIỀU mô hình chính cùng lúc, vệ tinh gộp từ TẤT CẢ mô hình chính đang chọn.
  const [mainIds, setMainIds] = useState<Set<string>>(new Set())
  const [satIds, setSatIds] = useState<Set<string>>(new Set())

  const vetinh = useMemo(() => {
    const seen = new Set<string>()
    const out: MoHinh[] = []
    for (const id of mainIds) for (const cid of api.conCua(L, id)) {
      if (seen.has(cid)) continue
      const m = L.moHinh.find((x) => x.id === cid)
      if (m && api.conCua(L, m.id).length === 0) { seen.add(cid); out.push(m) }
    }
    return out.sort((a, b) => a.ma.localeCompare(b.ma))
  }, [L, mainIds])
  // Mô hình chính bị bỏ chọn → vệ tinh của nó không còn hiện checkbox nữa; dọn satIds theo, không để
  // filter "ma" âm thầm còn hiệu lực dù ô tick đã biến mất khỏi màn hình.
  useEffect(() => {
    const okIds = new Set(vetinh.map((v) => v.id))
    setSatIds((s) => { const n = new Set([...s].filter((id) => okIds.has(id))); return n.size === s.size ? s : n })
  }, [vetinh])
  const modelIds = useMemo(() => [...mainIds, ...satIds], [mainIds, satIds])
  const nodes = useMemo(() => (modelIds.length ? L.baiToan.filter((b) => modelIds.includes(b.mo_hinh_id)) : L.baiToan.slice())
    .sort((a, b) => a.cap - b.cap || a.ma.localeCompare(b.ma)), [L, modelIds])

  const toggleMain = (id: string) => setMainIds((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const toggleSat = (id: string) => setSatIds((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  const addPick = (p: PickItem) => onChangePicks([...picks, p])
  const updatePick = (key: string, p: PickItem) => onChangePicks(picks.map((x) => (x.key === key ? p : x)))
  const removePick = (key: string) => onChangePicks(picks.filter((x) => x.key !== key))
  // Đổi thứ tự bài TRONG CÙNG PHIẾU (lớp/nhà riêng) — thứ tự này = thứ tự IN (banInTheoMoHinh duyệt
  // `picks` theo mảng, lọc phan trước). Đổi chỗ 2 KEY bất kỳ ngay trên mảng gốc (không cần liền kề trong
  // mảng — chỉ cần liền kề trong CÙNG CHUỖI, xem ChuoiRow: nút ▲▼ trên mỗi dòng, không kéo được bài khác
  // chuỗi lên trước/sau, Thùy đã biết và OK).
  const swapPicks = (keyA: string, keyB: string) => {
    const iFull = picks.findIndex((x) => x.key === keyA), jFull = picks.findIndex((x) => x.key === keyB)
    if (iFull < 0 || jFull < 0) return
    const next = [...picks];[next[iFull], next[jFull]] = [next[jFull], next[iFull]]
    onChangePicks(next)
  }
  const goiY = async (chuoi: BaiToan[], phan: 'lop' | 'nha' | 'et' | 'mt', n: number) => {
    const news = await goiYChuoi(chuoi, phan, n)
    if (news.length < n) alert(`Chuỗi này chỉ có ${news.length} bản khác nhau — lấy đủ ${news.length}.`)
    const ids = new Set(chuoi.map((b) => b.id))
    const cuCuaPhan = picks.filter((p) => p.phan === phan && p.nodeIds.every((id) => ids.has(id)))
    onChangePicks([...picks.filter((p) => !(p.phan === phan && p.nodeIds.every((id) => ids.has(id)))), ...news])
    // ⭐ 17/08 (Thùy: "chỉnh số dòng ... hiển thị dòng không đúng"): goiYChuoi() sinh key MỚI HOÀN TOÀN
    // mỗi lần — bấm lại "↻ Gợi ý" cho chuỗi đã áp "dòng kẻ (cả chuỗi)" thì bài mới không có trong `soDong`,
    // âm thầm rơi về mặc định cứng DONG_BTVN thay vì giữ số đã chỉnh. Kế thừa từ bài cũ sắp bị thay (nếu
    // có) — cùng gốc + cùng cách sửa với "+ Thêm bài" ở ChuoiRow.
    if (phan === 'nha' && cuCuaPhan.length) {
      const ke = soDong[cuCuaPhan[cuCuaPhan.length - 1].key] ?? DONG_BTVN
      onChangeSoDong({ ...soDong, ...Object.fromEntries(news.map((p) => [p.key, ke])) })
    }
  }
  // 1 nút xoay vòng 3 trạng thái (hien → o_trong → khong) — gọn hơn 3 nút trên mỗi dòng bài.
  const xoayCheDo = (key: string) => onChangeCheDo({ ...cheDo, [key]: cheDoKe(cheDo[key] ?? 'hien') })
  // Áp 1 số dòng cho NHIỀU bài 1 lượt (cả chuỗi) — thay setSoDongOne cũ (per-ý, Thùy: không cần nữa).
  const setSoDongChuoi = (keys: string[], n: number) => {
    const m = { ...soDong }
    for (const k of keys) { if (n > 0) m[k] = n; else delete m[k] }
    onChangeSoDong(m)
  }

  const components = useMemo(() => {
    const seen = new Set<string>(); const comps: BaiToan[][] = []
    for (const n of nodes) { if (seen.has(n.id)) continue; const chain = api.chuoiKetNoi(L, n.id); chain.forEach((b) => seen.add(b.id)); comps.push(chain) }
    return comps
  }, [nodes, L])

  // ⭐ 08-20 (Thùy: "bên phải preview luôn, thay vì cái mắt phải click"): panel xem trước SỐNG bên cột phải
  // — thay 👁 mở popup che màn hình bằng panel LUÔN HIỆN, dùng đúng khoảng trống thừa bên phải. `xem` giữ
  // CẢ danh sách anh em (đúng `ds` mà dòng 👁 đang bấm tới, thứ tự TRÊN→DƯỚI = thứ tự in) + vị trí hiện
  // tại → nút ↑↓ chỉ việc đổi index, khỏi tính lại "bài trước/sau" từ đầu.
  const [xem, setXem] = useState<{ list: PickItem[]; index: number } | null>(null)
  const xemPick = xem ? xem.list[xem.index] : null
  // Bài đang xem bị xoá/đổi (key không còn trong `picks`) → tự chọn bài khác thay vì để panel treo nội
  // dung cũ đã mất. Chưa chọn gì bao giờ (mở buổi lần đầu) → tự chọn bài ĐẦU TIÊN tìm thấy — khỏi để
  // panel trống phí không gian ngay từ đầu.
  useEffect(() => {
    if (xemPick && picks.some((p) => p.key === xemPick.key)) return
    for (const comp of components) {
      const ids = new Set(comp.map((b) => b.id))
      for (const phan of phans) {
        const ds = picks.filter((p) => p.phan === phan && p.nodeIds.length > 0 && p.nodeIds.every((id) => ids.has(id)))
        if (ds.length) { setXem({ list: ds, index: 0 }); return }
      }
    }
    setXem(null)
  }, [components, picks]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    // ⭐ 17/08 (Thùy: "bỏ cái màn ở bên góc phải đi, t chả thấy có ý nghĩa gì") — panel "Tóm tắt" cũ đã bỏ.
    // ⭐ 08-20 (Thùy: "bên phải preview luôn"): cột phải MỚI không phải "Tóm tắt" cũ — là panel XEM TRƯỚC
    // sống (đề + hình), thay hẳn popup 👁. Lọc mô hình = MỤC LỤC, BÉ, chỉ để tìm nhanh; cột giữa (danh
    // sách chuỗi/bài) vẫn rộng nhất — panel xem trước ăn vào phần không gian trống bên phải trước đây bỏ.
    <div className="grid items-start gap-3 xl:grid-cols-[190px_minmax(0,1fr)_360px]">
      <Panel label="Lọc mô hình (mục lục)">
        <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">Mô hình chính · chọn được nhiều</div>
        <div className="max-h-56 overflow-y-auto pr-0.5">
          {L.moHinh.slice().sort((a, b) => (maCap.get(a.id) ?? '').localeCompare(maCap.get(b.id) ?? '')).map((m) => (
            <label key={m.id} className="mb-1 flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-teal-200 bg-teal-50/40 px-2 py-1.5 text-[12px] text-slate-700 hover:bg-teal-50">
              <input type="checkbox" checked={mainIds.has(m.id)} onChange={() => toggleMain(m.id)} />
              <Ma>{maCap.get(m.id) ?? '?'}</Ma><span className="min-w-0 flex-1 truncate"><MathText>{tron(m.ten).slice(0, 42)}</MathText></span>
            </label>
          ))}
        </div>
        {mainIds.size > 0 && (
          <div className="mt-3">
            <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">Mô hình vệ tinh · {vetinh.length}</div>
            {vetinh.length === 0
              ? <div className="text-[11.5px] text-slate-400">— (các) mô hình này không có vệ tinh (lá) —</div>
              : vetinh.map((v) => (
                <label key={v.id} className="mb-1 flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-indigo-200 bg-indigo-50/40 px-2 py-1.5 text-[12px] text-slate-700 hover:bg-indigo-50">
                  <input type="checkbox" checked={satIds.has(v.id)} onChange={() => toggleSat(v.id)} />
                  <Ma>{maCap.get(v.id) ?? '?'}</Ma><span className="min-w-0 flex-1 truncate"><MathText>{v.ten}</MathText></span>
                </label>
              ))}
          </div>
        )}
      </Panel>

      <div className="min-w-0">
        <div className="mb-2 flex items-center gap-2 text-[11px] text-slate-400">
          <span>{mainIds.size ? `Đang lọc theo ${mainIds.size} mô hình chính` : 'Tất cả chuỗi trong kho'} · <b className="text-slate-600">{components.length}</b> chuỗi</span>
          {mainIds.size > 0 && <button onClick={() => { setMainIds(new Set()); setSatIds(new Set()) }} className="rounded border border-slate-300 px-1.5 py-0.5 text-slate-500 hover:bg-slate-50">✕ Bỏ lọc</button>}
        </div>
        {!nodes.length
          ? <Empty icon="◇">Kho khối này chưa có node nào. Tạo node ở <b>Sơ đồ</b> trước.</Empty>
          : components.map((comp) => (
              <ChuoiRow key={comp.map((b) => b.id).join(',')} L={L} chuoi={comp} picks={picks} cheDo={cheDo} soDong={soDong} phans={phans}
                onAdd={addPick} onUpdate={updatePick} onRemove={removePick} onSwap={swapPicks} onXoayCheDo={xoayCheDo} onSetSoDongChuoi={setSoDongChuoi}
                onGoiY={(phan, n) => goiY(comp, phan, n)} onXem={(list, index) => setXem({ list, index })} />
            ))}
      </div>

      <div className="xl:sticky xl:top-3">
        <PreviewPane L={L} xem={xem}
          onNav={(dir) => setXem((s) => (s ? { list: s.list, index: Math.max(0, Math.min(s.list.length - 1, s.index + dir)) } : s))}
          onClose={() => setXem(null)} />
      </div>
    </div>
  )
}

/** ⭐ 08-08: MỌI pick (đề chuẩn/lứa/biến thể/ý thật) của MỘT phiếu → bản in — 1 cơ chế cho mọi cỡ chuỗi.
 *  Export — dùng bởi GiaoTrinhScreen ("👁 Xem buổi" / "🖨 In") ngoài chỗ gọi nội bộ cũ. */
export async function banInTheoMoHinh(tieuDe: string, phan: 'lop' | 'nha' | 'et' | 'mt', picks: PickItem[], L: Luoi, cheDo: Record<string, CheDoHinh>, soDong: Record<string, number>): Promise<BanIn> {
  const cd = (k: string): CheDoHinh => cheDo[k] ?? 'hien'
  const dong = (key: string) => (phan === 'nha' ? (soDong[key] ?? DONG_BTVN) : soDong[key] ?? 0)   // BTVN mặc định DONG_BTVN; trên lớp KHÔNG kẻ dòng (bài sát nhau)
  const ps = dedupePicks(picks.filter((p) => p.phan === phan))
  const [btMap, yMap] = await Promise.all([
    gt.getBienTheByIds(ps.filter((p): p is Extract<PickItem, { kind: 'bienthe' }> => p.kind === 'bienthe').map((p) => p.bienTheId)),
    gt.getYFull(ps.filter((p): p is Extract<PickItem, { kind: 'y' }> => p.kind === 'y').map((p) => p.yId)),
  ])
  const mucs: MucIn[] = []
  for (const p of ps) {
    if (p.kind === 'bienthe') { const v = btMap.get(p.bienTheId); if (v) mucs.push(mucBienThe(L, v, cd(p.key), dong(p.key))) }
    else if (p.kind === 'y') { const yb = yMap.get(p.yId); if (yb) mucs.push(mucY(L, yb, cd(p.key), dong(p.key))) }
    else if (p.luaId) { const vs = await api.bienTheCuaLua(p.luaId); mucs.push(mucGhepLua(L, p.nodeIds, vs, cd(p.key), dong(p.key))) }
    else mucs.push(mucGhep(L, p, cd(p.key), dong(p.key)))
  }
  // ⭐ 08-10 (Thùy: "lý thuyết in ở phiếu bài tập trên lớp giống bên đại"): CHỈ resolve cho phan='lop' —
  // khuôn Đại (LT chuyên đề chỉ hiện ở buổi trên lớp, KHÔNG lặp lại ở phiếu BTVN riêng).
  let moHinhLyThuyet: Record<string, { ten: string; noiDung: string }> | undefined
  if (phan === 'lop') {
    const moHinhIds = [...new Set(mucs.map((m) => (m.kieu === 'de' ? m.moHinhId : null)).filter((x): x is string => !!x))]
    if (moHinhIds.length) {
      const map = await api.hinhMoHinhLyThuyet.list()
      moHinhLyThuyet = {}
      for (const id of moHinhIds) {
        const noiDung = map[id]?.noi_dung?.trim()
        if (!noiDung) continue
        const ten = L.moHinh.find((m) => m.id === id)?.ten ?? ''
        moHinhLyThuyet[id] = { ten, noiDung }
      }
    }
  }
  return { tieuDe: `Buổi học — ${tieuDe}`, phuDe: `${mucs.length} mục`, mucs, moHinhLyThuyet }
}
/** ⭐ Bài XA NHẤT trong 1 chuỗi (Thùy 08-20) — chọn giả thiết CHUNG của chuỗi theo CẤP (trục suy luận),
 *  KHÔNG phải độ sâu mô hình (trục giả thiết — khác trục hẳn, dùng `doSauTrongHo` là sai chỗ). Từ khi
 *  `giaThietBaiToan()` có thể lệch giữa các node (giả thiết riêng / kế thừa tổ tiên gần nhất — không
 *  còn đơn điệu theo cây mô hình), "mô hình sâu nhất" hết còn nghĩa là "đủ giả thiết nhất". Giả thiết
 *  mọi node trong chuỗi GIỐNG NHAU thì chọn ai cũng ra cùng 1 kết quả — không cần rẽ nhánh riêng, tự
 *  đúng. Cấp cao nhất = node XA NHẤT (đích cuối chuỗi chứng minh) — do kế thừa tổ tiên gần nhất, node
 *  này thường đã "gánh" hết giả thiết riêng của các node đứng trước nó trong chuỗi. */
function xaNhatTrongChuoi(ns: BaiToan[]): BaiToan | null {
  let xa: BaiToan | null = null
  for (const n of ns) if (!xa || n.cap > xa.cap) xa = n
  return xa
}
/** Ghép chuỗi (đề chuẩn) → 1 bài a,b,c: giả thiết + hình của node XA NHẤT chung; ý a,b,c = câu hỏi + lời giải từng node. */
export function mucGhep(L: Luoi, g: Extract<PickItem, { kind: 'ghep' }>, cheDo: CheDoHinh, soDong?: number | null): MucIn {
  const khung = api.noDapAn(L, g.nodeIds)             // ý = node tick; buocNodes = node ẩn nở; gtPhuKeo = van
  const nodes = khung.map((k) => k.node)
  const deep = xaNhatTrongChuoi(nodes) ?? nodes[0]
  const ys: YIn[] = khung.map((k, i) => {
    const c = api.cachMacDinh(L, k.node.id)
    const gtPhu = [k.node.gia_thiet_phu?.trim(), ...k.gtPhuKeo].filter(Boolean).join('; ') || null
    return {
      nhan: String.fromCharCode(97 + i), noiDung: `Chứng minh ${k.node.phat_bieu}`,
      giaThietPhu: gtPhu, loiGiai: c?.loi_giai ?? null, anh: c?.anh_loi_giai ?? null,
      buoc: k.buocNodes.map((n) => {
        const cc = api.cachMacDinh(L, n.id)
        return { phatBieu: n.phat_bieu, giaThietPhu: n.gia_thiet_phu?.trim() || null, loiGiai: cc?.loi_giai ?? null, anh: cc?.anh_loi_giai ?? null, ma: n.ma }
      }),
      ma: k.node.ma, cap: k.node.cap,
    }
  })
  const anhDe = api.anhCuaBaiToan(L, deep.id)
  return { kieu: 'de', deBai: api.giaThietBaiToan(L, deep.id), anhDe, ma: nodes.map((b) => b.ma).join('+'), ys, cheDo, soDong: soDong ?? null, moHinhId: deep.mo_hinh_id }
}
// Tách đề biến thể: cắt ở "Chứng minh" → giả thiết (chung cả chuỗi) + câu hỏi (ý). Giả thiết các câu trong chuỗi giống nhau.
function tachDe(deBai: string): { giaThiet: string; cauHoi: string } {
  const i = deBai.lastIndexOf('Chứng minh')
  if (i < 0) return { giaThiet: '', cauHoi: deBai.trim() }
  return { giaThiet: deBai.slice(0, i).replace(/[.,;\s]+$/, '').trim(), cauHoi: deBai.slice(i).trim() }
}
/** Ghép 1 LỨA (đổi đỉnh) → a,b,c: giả thiết CHUNG (từ câu xa nhất) + ý = câu hỏi từng câu (từ biến thể của lứa). */
export function mucGhepLua(L: Luoi, nodeIds: string[], bienThes: BienThe[], cheDo: CheDoHinh, soDong?: number | null): MucIn {
  const byNode = new Map(bienThes.map((v) => [v.baitoan_id, v]))
  // Cấu trúc ẩn/bước theo tiền-đề ĐÓNG BĂNG của lứa (ổn định khi đề-chuẩn đổi về sau); lứa CŨ (chưa có
  // tien_de_ids) → về derive live như trước để không mất bước decomposition.
  const coDongBang = bienThes.some((v) => v.tien_de_ids.length > 0)
  const khung = coDongBang ? api.noDapAnLua(L, bienThes, nodeIds) : api.noDapAn(L, nodeIds)
  const nodes = khung.map((k) => k.node)
  const coV = nodes.filter((n) => byNode.has(n.id))
  const deep = (coV.length ? xaNhatTrongChuoi(coV) : null) ?? nodes[0]
  const deepV = byNode.get(deep.id)
  const giaThiet = deepV ? tachDe(deepV.de_bai).giaThiet : api.giaThietBaiToan(L, deep.id)
  const ys: YIn[] = khung.map((k, i) => {
    const v = byNode.get(k.node.id)
    const gtPhu = [k.node.gia_thiet_phu?.trim(), ...k.gtPhuKeo].filter(Boolean).join('; ') || null
    return {
      nhan: String.fromCharCode(97 + i),
      noiDung: v ? tachDe(v.de_bai).cauHoi : `Chứng minh ${k.node.phat_bieu}`,
      giaThietPhu: gtPhu, loiGiai: v?.loi_giai ?? null, anh: v?.anh_loi_giai ?? null,
      buoc: k.buocNodes.map((n) => {
        const bv = byNode.get(n.id); const cc = api.cachMacDinh(L, n.id)
        return { phatBieu: bv ? tachDe(bv.de_bai).cauHoi : n.phat_bieu, giaThietPhu: n.gia_thiet_phu?.trim() || null, loiGiai: bv?.loi_giai ?? cc?.loi_giai ?? null, anh: bv?.anh_loi_giai ?? cc?.anh_loi_giai ?? null, ma: n.ma }
      }),
      ma: k.node.ma, cap: k.node.cap,
    }
  })
  const anhDe = deepV?.anh ?? api.anhCuaBaiToan(L, deep.id)
  return { kieu: 'de', deBai: giaThiet, anhDe, ma: nodes.map((b) => b.ma).join('+'), ys, cheDo, soDong: soDong ?? null, moHinhId: deep.mo_hinh_id }
}
/** Biến thể riêng lẻ (đổi số/đổi tên) của MỘT node — không tiền đề nên không có bước ẩn để nở. */
export function mucBienThe(L: Luoi, v: BienThe, cheDo: CheDoHinh, soDong?: number | null): MucIn {
  const node = L.baiToan.find((x) => x.id === v.baitoan_id)
  return { kieu: 'de', ma: node?.ma ?? null, deBai: v.de_bai, anhDe: v.anh, ys: [{ nhan: '', noiDung: '', loiGiai: v.loi_giai, anh: v.anh_loi_giai ?? v.anh, ma: node?.ma, cap: node?.cap }], cheDo, soDong: soDong ?? null, moHinhId: node?.mo_hinh_id ?? null }
}
/** Ý thật (đã chấm, từ đo lường) trỏ vào MỘT node — dùng làm bài luyện. */
export function mucY(L: Luoi, yb: { y: Y; bai: Bai }, cheDo: CheDoHinh, soDong?: number | null): MucIn {
  const da = api.dapAnHaiBac(L, yb.y)
  const node = yb.y.baitoan_id ? L.baiToan.find((x) => x.id === yb.y.baitoan_id) : null
  return { kieu: 'de', ma: yb.bai.ma_bai, deBai: yb.bai.de_bai, anhDe: yb.bai.anh_de, ys: [{ nhan: yb.y.nhan_hien_thi ?? String.fromCharCode(96 + yb.y.thu_tu), noiDung: yb.y.noi_dung, loiGiai: da.loiGiai, anh: da.anh, bacThamChieu: da.bac === 'tham_chieu', ma: yb.y.ma_y }], cheDo, soDong: soDong ?? null, moHinhId: node?.mo_hinh_id ?? null }
}

// ── ⭐ 08-08 (Thùy chốt: "1 chuỗi ghép lại cũng là 1 bài") — 1 BẢN của 1 chuỗi (mọi cỡ, kể cả 1 node):
// đề chuẩn / lứa (chuỗi ≥2 node) / biến thể + ý thật riêng lẻ (chuỗi 1 node, không nhóm lứa được). ──
export type Ban = { kind: 'ghep'; luaId: string | null } | { kind: 'bienthe'; bienTheId: string } | { kind: 'y'; yId: string }
export function sameBan(p: PickItem, ban: Ban): boolean {
  if (p.kind !== ban.kind) return false
  if (p.kind === 'ghep' && ban.kind === 'ghep') return p.luaId === ban.luaId
  if (p.kind === 'bienthe' && ban.kind === 'bienthe') return p.bienTheId === ban.bienTheId
  if (p.kind === 'y' && ban.kind === 'y') return p.yId === ban.yId
  return false
}
function sameBanBan(a: Ban, b: Ban): boolean {
  if (a.kind !== b.kind) return false
  if (a.kind === 'ghep' && b.kind === 'ghep') return a.luaId === b.luaId
  if (a.kind === 'bienthe' && b.kind === 'bienthe') return a.bienTheId === b.bienTheId
  if (a.kind === 'y' && b.kind === 'y') return a.yId === b.yId
  return false
}
export async function banOptionsOfChuoi(chuoi: BaiToan[]): Promise<{ ban: Ban; label: string }[]> {
  const out: { ban: Ban; label: string }[] = [{ ban: { kind: 'ghep', luaId: null }, label: 'Đề chuẩn (gốc)' }]
  if (chuoi.length >= 2) {
    const lists = await Promise.all(chuoi.map((b) => api.listBienThe(b.id)))
    const byLua = new Map<string, Set<string>>()
    lists.forEach((list, i) => list.forEach((v) => { if (v.lua_id) { const s = byLua.get(v.lua_id) ?? new Set<string>(); s.add(chuoi[i].id); byLua.set(v.lua_id, s) } }))
    let k = 0
    for (const [lua, ns] of byLua) if (ns.size >= 2) out.push({ ban: { kind: 'ghep', luaId: lua }, label: `Lứa ${++k} (đổi đỉnh)` })
  } else {
    const [bienThe, yThat] = await Promise.all([api.listBienThe(chuoi[0].id), api.yTheoNode(chuoi[0].id)])
    bienThe.forEach((v, i) => out.push({ ban: { kind: 'bienthe', bienTheId: v.id }, label: `Biến thể ${i + 1}` }))
    yThat.forEach(({ y }, i) => out.push({ ban: { kind: 'y', yId: y.id }, label: `Ý thật ${i + 1}` }))
  }
  return out
}
/** ⭐ Gợi ý N: tự chọn N pick cho (chuỗi,phan), mỗi pick BẢN KHÁC NHAU — ưu tiên ÍT DÙNG NHẤT (least-used,
 *  khuôn cauUsage Đại). Mặc định tick TOÀN BỘ chuỗi (Thùy: "đương nhiên hệ thống đưa full chuỗi"; sửa
 *  từng bài sau bằng ✎). Trả ÍT hơn N nếu kho chưa đủ bản khác nhau — caller tự báo. */
/** Xếp `opts` theo usage ÍT DÙNG NHẤT trước (dùng chung cho goiYChuoi + goiYMaDeChoBai). */
async function rankBanOptions(opts: { ban: Ban; label: string }[], chuoi: BaiToan[]): Promise<{ ban: Ban; label: string }[]> {
  const luaIds = opts.filter((o): o is { ban: { kind: 'ghep'; luaId: string }; label: string } => o.ban.kind === 'ghep' && !!o.ban.luaId).map((o) => o.ban.luaId)
  const bienTheIds = opts.filter((o): o is { ban: { kind: 'bienthe'; bienTheId: string }; label: string } => o.ban.kind === 'bienthe').map((o) => o.ban.bienTheId)
  const yIds = opts.filter((o): o is { ban: { kind: 'y'; yId: string }; label: string } => o.ban.kind === 'y').map((o) => o.ban.yId)
  const chuanNodeIds = chuoi.map((b) => b.id)
  const usage = await gt.banUsageCount(luaIds, bienTheIds, yIds, chuanNodeIds)
  const usageOf = (o: { ban: Ban }) => o.ban.kind === 'ghep'
    ? (o.ban.luaId ? (usage.lua.get(o.ban.luaId) ?? 0) : Math.max(0, ...chuanNodeIds.map((id) => usage.chuan.get(id) ?? 0)))
    : o.ban.kind === 'bienthe' ? (usage.bienthe.get(o.ban.bienTheId) ?? 0) : (usage.y.get(o.ban.yId) ?? 0)
  return [...opts].sort((a, b) => usageOf(a) - usageOf(b))
}
async function goiYChuoi(chuoi: BaiToan[], phan: 'lop' | 'nha' | 'et' | 'mt', n: number): Promise<PickItem[]> {
  const opts = await banOptionsOfChuoi(chuoi)
  const sorted = await rankBanOptions(opts, chuoi)
  const nodeIds = chuoi.map((b) => b.id)
  return sorted.slice(0, n).map((o) => ({ key: crypto.randomUUID(), phan, nodeIds, ...o.ban } as PickItem))
}
// ── ⭐ MÃ ĐỀ 2/3 cho ET Hình (Thùy 21/08, "làm đầy đủ giống Đại"): KHÔNG phải AI đổi đỉnh sinh mới —
// Thùy chốt "biến thể của Hình là cùng node là được". Tức mã đề 2/3 = BẢN KHÁC đã CÓ SẴN trong kho của
// cùng chuỗi/node (y hệt goiYChuoi ở trên) — chỉ khác là loại bản GỐC đã chọn ra khỏi pool trước khi
// xếp hạng (goiYChuoi lấy từ đầu opts, ở đây phải loại gốc vì gốc là do GV tự chọn, không phải hệ tự sinh). ──
/** N bản KHÁC bản GỐC đã chọn cho 1 bài — ưu tiên ÍT DÙNG NHẤT. Trả ÍT hơn N nếu kho chưa đủ bản khác —
 *  caller tự báo thiếu (khuôn "thiếu câu cùng dạng" của Đại — KHÔNG tự sinh AI để lấp). */
export async function goiYMaDeChoBai(chuoi: BaiToan[], gocBan: Ban, n: number): Promise<{ ban: Ban; label: string }[]> {
  const opts = (await banOptionsOfChuoi(chuoi)).filter((o) => !sameBanBan(o.ban, gocBan))
  return (await rankBanOptions(opts, chuoi)).slice(0, n)
}

// ── Một CHUỖI (= 1 DẠNG, cùng logic tiền đề) — hiện 1 lần, kể cả chuỗi 1 câu (câu lẻ = chuỗi 1 node,
// CÙNG cơ chế — Thùy chốt 08-08). Mỗi phiếu: N + Gợi ý (auto) hoặc ＋ Thêm bài (thủ công, lặp lại được). ──
// ⭐ Ẩn/hiện hình + số dòng kẻ + đổi thứ tự đều nằm NGAY ĐÂY (card CHÍNH — Thùy chốt, panel Tóm tắt phụ
// đã bỏ 17/08). Số dòng chỉnh 1 LẦN CHO CẢ CHUỖI (áp hết mọi bài Về nhà đang có của chuỗi này), KHÔNG theo
// từng ý riêng — khuôn `ApplyLinesAll` Đại (gõ số → Enter/blur ghi đè hết, vẫn thêm bài mới sau đó bình
// thường với số dòng vừa áp làm giá trị chung).
function ChuoiRow({ L, chuoi, picks, cheDo, soDong, phans, onAdd, onUpdate, onRemove, onSwap, onXoayCheDo, onSetSoDongChuoi, onGoiY, onXem }: {
  L: Luoi; chuoi: BaiToan[]; picks: PickItem[]; cheDo: Record<string, CheDoHinh>; soDong: Record<string, number>
  phans: ('lop' | 'nha' | 'et' | 'mt')[]
  onAdd: (p: PickItem) => void; onUpdate: (key: string, p: PickItem) => void; onRemove: (key: string) => void
  onSwap: (keyA: string, keyB: string) => void
  onXoayCheDo: (key: string) => void; onSetSoDongChuoi: (keys: string[], n: number) => void
  onGoiY: (phan: 'lop' | 'nha' | 'et' | 'mt', n: number) => void
  onXem: (list: PickItem[], index: number) => void
}) {
  const chuoiIds = useMemo(() => new Set(chuoi.map((b) => b.id)), [chuoi])
  const [open, setOpen] = useState<{ phan: 'lop' | 'nha' | 'et' | 'mt'; editKey?: string } | null>(null)
  const [nInput, setNInput] = useState<Record<string, number>>({ lop: 2, nha: 2, et: 2, mt: 2 })
  const picksOf = (phan: 'lop' | 'nha' | 'et' | 'mt') => picks.filter((p) => p.phan === phan && p.nodeIds.length > 0 && p.nodeIds.every((id) => chuoiIds.has(id)))
  const nhanBan = (p: PickItem) => p.kind === 'ghep' ? (p.luaId ? 'Lứa (đổi đỉnh)' : 'Đề chuẩn') : p.kind === 'bienthe' ? 'Biến thể' : 'Ý thật'
  // ⭐ 08-20 (Thùy: "builder hiện 2 câu nhưng preview chỉ hiện 1"): banInTheoMoHinh khử pick TRÙNG chữ ký
  // (cùng bản + cùng node) lúc IN — builder trước đây không lộ điều này, số bài hiện ra khác số bài in
  // ra mà không ai biết vì sao. Tính trước TẤT CẢ pick sẽ bị khử (đúng thuật toán dedupePicks — pick ĐẦU
  // theo thứ tự `picks` giữ lại, các pick SAU cùng chữ ký bị loại) → gắn badge cảnh báo ngay trên dòng đó.
  const dupKeys = useMemo(() => {
    const seen = new Set<string>(); const dup = new Set<string>()
    for (const p of picks) { const sig = pickSig(p); if (seen.has(sig)) dup.add(p.key); else seen.add(sig) }
    return dup
  }, [picks])
  return (
    <div className={`mb-2 rounded-xl border p-3 ${chuoi.length > 1 ? 'border-violet-200 bg-violet-50/30' : 'border-slate-200 bg-white'}`}>
      <div className={`mb-1 text-[11px] font-semibold uppercase tracking-wide ${chuoi.length > 1 ? 'text-violet-700' : 'text-slate-500'}`}>
        {chuoi.length > 1 ? `🌿 Chuỗi ${chuoi.length} câu` : 'Câu lẻ'}
      </div>
      <div className="mb-2 text-[11px] leading-snug text-slate-500">
        {chuoi.map((b, i) => <span key={b.id}>{i > 0 && ' → '}<Ma>{b.ma}</Ma></span>)}
      </div>
      <div className="space-y-2">
        {phans.map((phan) => {
          const ds = picksOf(phan); const meta = PHAN_META[phan]
          return (
            <div key={phan} className={`rounded-lg border p-2.5 ${meta.border} ${meta.bg}`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[12px] font-semibold ${meta.text}`}>{meta.icon} {meta.nhan}</span>
                <span className="flex items-center gap-1 text-[11px] text-slate-500">
                  <input type="number" min={1} value={nInput[phan]} onChange={(e) => setNInput((s) => ({ ...s, [phan]: Math.max(1, +e.target.value || 1) }))}
                    className="h-6 w-10 rounded border border-slate-300 px-1 text-center text-[12px]" />
                  <Btn className="h-6 px-2 text-[11px]" onClick={() => onGoiY(phan, nInput[phan])}>↻ Gợi ý</Btn>
                </span>
                <Btn className="h-6 px-2 text-[11px] border-violet-300 text-violet-700" onClick={() => setOpen({ phan })}>＋ Thêm bài</Btn>
                {phan === 'nha' && <ApplyDongChuoi soBai={ds.length} onApply={(n) => onSetSoDongChuoi(ds.map((d) => d.key), n)} />}
                <span className="ml-auto text-[11px] text-slate-400">{ds.length} bài</span>
              </div>
              {ds.length === 0
                ? <div className="mt-1.5 text-[11.5px] italic text-slate-400">Chưa có bài — bấm <b>↻ Gợi ý</b> hoặc <b>＋ Thêm bài</b>.</div>
                : <ol className="mt-1.5 space-y-1">
                  {ds.map((p, i) => {
                    const cd = CHE_DO_HINH.find((x) => x.ma === (cheDo[p.key] ?? 'hien'))!
                    return (
                      <li key={p.key} className="flex items-center gap-2 rounded-md border border-slate-100 bg-white/70 px-2 py-1 text-[12px]">
                        {/* ⭐ 17/08 (Thùy): đổi thứ tự NGAY TRONG card builder — câu trên hiện trước, câu
                            dưới hiện sau (đúng thứ tự in). Trước đây control này chỉ có ở panel "Tóm tắt"
                            (đã bỏ, xem BuoiPickEditor) — giờ chuyển hẳn vào đây, phạm vi trong CÙNG chuỗi. */}
                        <span className="flex shrink-0 flex-col leading-none" title="Đổi thứ tự — bài trên hiện trước">
                          <button onClick={() => onSwap(p.key, ds[i - 1].key)} disabled={i === 0} className="text-[9px] text-slate-400 hover:text-indigo-600 disabled:opacity-25">▲</button>
                          <button onClick={() => onSwap(p.key, ds[i + 1].key)} disabled={i === ds.length - 1} className="text-[9px] text-slate-400 hover:text-indigo-600 disabled:opacity-25">▼</button>
                        </span>
                        <span className="w-4 shrink-0 text-right text-[11px] text-slate-300">{i + 1}</span>
                        <span className="shrink-0 rounded bg-slate-100 px-1.5 text-[10px] font-medium text-slate-600">{nhanBan(p)}</span>
                        <span className="min-w-0 flex-1 truncate text-slate-700">{p.nodeIds.map((id) => L.baiToan.find((b) => b.id === id)?.ma).filter(Boolean).join(' · ')}</span>
                        {dupKeys.has(p.key) && <span className="shrink-0 rounded bg-rose-100 px-1.5 text-[10px] font-semibold text-rose-600" title="Trùng bản + trùng bài với 1 dòng khác trong buổi — lúc in/xem chỉ giữ dòng XUẤT HIỆN TRƯỚC, dòng này sẽ KHÔNG in ra. Bấm ✕ bỏ hoặc ✎ đổi sang bài khác.">⚠ trùng</span>}
                        {phan === 'nha' && <span className="shrink-0 text-[10px] text-slate-400">{soDong[p.key] ?? DONG_BTVN} dòng</span>}
                        <button onClick={() => onXoayCheDo(p.key)} title={cd.goi}
                          className={`shrink-0 rounded px-1 text-[11px] ${cd.ma === 'hien' ? 'text-slate-400 hover:text-slate-700' : cd.ma === 'o_trong' ? 'text-amber-600' : 'text-rose-500'}`}>{cd.icon}</button>
                        <button onClick={() => onXem(ds, i)} className="shrink-0 text-slate-400 hover:text-teal-600" title="Xem bài này ở panel bên phải">👁</button>
                        <button onClick={() => setOpen({ phan, editKey: p.key })} className="shrink-0 text-slate-400 hover:text-indigo-600" title="Đổi sang bài khác">✎</button>
                        <button onClick={() => onRemove(p.key)} className="shrink-0 text-slate-400 hover:text-rose-600" title="Bỏ bài này">✕</button>
                      </li>
                    )
                  })}
                </ol>}
            </div>
          )
        })}
      </div>
      {open && <ChonChuoiPopup L={L} phan={open.phan} chuoi={chuoi} editing={open.editKey ? picks.find((p) => p.key === open.editKey) : undefined}
        // ⭐ 17/08 (Thùy): "Thêm bài" bản chất là hiện các bài KHÁC (chưa chọn) trong kho — khi mở để THÊM
        // (không phải sửa 1 bài đang có), loại bỏ khỏi lưới những bản ĐÃ nằm trong chuỗi/phiếu này rồi.
        daChonList={open.editKey ? undefined : picksOf(open.phan)}
        onClose={() => setOpen(null)}
        onConfirm={(ban, nodeIds) => {
          if (open.editKey) {
            onUpdate(open.editKey, { key: open.editKey, phan: open.phan, nodeIds, ...ban } as PickItem)
          } else {
            const key = crypto.randomUUID()
            onAdd({ key, phan: open.phan, nodeIds, ...ban } as PickItem)
            // ⭐ 17/08 (Thùy: "chỉnh số dòng ... hiển thị dòng không đúng cái đã chọn"): bài MỚI thêm vào
            // "Về nhà" phải kế thừa số dòng CHUNG hiện tại của chuỗi (bài liền trước) — trước đây key mới
            // không có trong `soDong` nên mọi nơi đọc đều rơi về mặc định cứng DONG_BTVN=6, kể cả khi
            // chuỗi đã áp "dòng kẻ (cả chuỗi)" ra một số khác từ trước. Comment cũ ở setSoDongChuoi
            // ("bài mới thêm sau vẫn dùng mặc định chung") mô tả đúng Ý ĐỊNH nhưng code KHÔNG làm việc
            // đó — đây mới là chỗ thật sự phải ghi.
            if (open.phan === 'nha') {
              const ds = picksOf('nha')
              if (ds.length) onSetSoDongChuoi([key], soDong[ds[ds.length - 1].key] ?? DONG_BTVN)
            }
          }
          setOpen(null)
        }} />}
    </div>
  )
}
// Áp 1 số dòng kẻ cho CẢ CHUỖI (mọi bài Về nhà hiện có) 1 lượt — khuôn `ApplyLinesAll` Đại: gõ số rồi
// Enter/blur mới ghi (tránh ghi đè mỗi keystroke); ghi xong bài MỚI thêm sau vẫn dùng mặc định chung.
function ApplyDongChuoi({ soBai, onApply }: { soBai: number; onApply: (n: number) => void }) {
  const [val, setVal] = useState('')
  const commit = () => { if (val.trim() === '') return; onApply(Math.max(0, Math.min(30, +val || 0))); setVal('') }
  return (
    <label className="flex shrink-0 items-center gap-1 text-[11px] text-slate-500" title={soBai ? `Áp số dòng này cho cả ${soBai} bài Về nhà của chuỗi` : 'Chưa có bài Về nhà để áp'}>
      dòng kẻ (cả chuỗi)
      <input type="number" min={0} max={30} value={val} placeholder={String(DONG_BTVN)} disabled={!soBai}
        onChange={(e) => setVal(e.target.value)} onBlur={commit} onKeyDown={(e) => e.key === 'Enter' && commit()}
        className="h-6 w-11 rounded border border-violet-300 px-1 text-center text-[12px] disabled:bg-slate-50 disabled:text-slate-300" />
    </label>
  )
}
type DeMuc = Extract<MucIn, { kieu: 'de' }>
// ⭐ 08-20 (Thùy: "bên phải preview luôn, thay vì cái mắt phải click vào — không gian còn thừa khá
// nhiều"). Trước đây "👁 Xem bài" (nút này gõ ban đầu 17/08) mở POPUP che màn hình, đọc xong phải đóng
// mới soạn tiếp. Giờ panel SỐNG NGAY cột phải của BuoiPickEditor — bấm 👁 ở dòng nào, panel đổi nội dung
// tại chỗ, khỏi che gì cả; nút ↑↓ chuyển bài TRONG DANH SÁCH đang xem (thứ tự TRÊN→DƯỚI = thứ tự IN,
// đúng cùng danh sách nút ▲▼ đổi thứ tự trên mỗi dòng đang thao tác). Vẫn dùng lại NGUYÊN resolver
// mucGhep/mucGhepLua/mucBienThe/mucY (khuôn print thật — WYSIWYG với bản in, không tự tính lại gì ở đây).
function PreviewPane({ L, xem, onNav, onClose }: {
  L: Luoi; xem: { list: PickItem[]; index: number } | null; onNav: (dir: -1 | 1) => void; onClose: () => void
}) {
  const p = xem ? xem.list[xem.index] : null
  const [muc, setMuc] = useState<DeMuc | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => {
    if (!p) { setMuc(null); setLoi(null); return }
    let alive = true
    setMuc(null); setLoi(null)
    ;(async () => {
      try {
        let m: MucIn | null = null
        if (p.kind === 'bienthe') {
          const v = (await gt.getBienTheByIds([p.bienTheId])).get(p.bienTheId)
          if (v) m = mucBienThe(L, v, 'hien', null)
        } else if (p.kind === 'y') {
          const yb = (await gt.getYFull([p.yId])).get(p.yId)
          if (yb) m = mucY(L, yb, 'hien', null)
        } else if (p.luaId) {
          const vs = await api.bienTheCuaLua(p.luaId)
          m = mucGhepLua(L, p.nodeIds, vs, 'hien', null)
        } else {
          m = mucGhep(L, p, 'hien', null)
        }
        if (!alive) return
        if (m && m.kieu === 'de') setMuc(m)
        else setLoi('Không tìm thấy nội dung bài này (có thể đã bị xoá khỏi kho).')
      } catch (e: any) { if (alive) setLoi(e.message ?? String(e)) }
    })()
    return () => { alive = false }
  }, [p, L])
  return (
    <Panel label="👁 Xem trước — đề + hình vẽ">
      {!xem || !p ? (
        <div className="py-8 text-center text-[12.5px] leading-relaxed text-slate-400">Bấm 👁 ở 1 bài trong danh sách bên trái để xem đề + hình ngay tại đây.</div>
      ) : (
        <>
          <div className="mb-2.5 flex items-center gap-1.5">
            <button onClick={() => onNav(-1)} disabled={xem.index === 0} title="Bài trước (ở TRÊN trong danh sách)"
              className="rounded-md border border-slate-200 px-2 py-1 text-[12px] text-slate-500 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-25">↑</button>
            <button onClick={() => onNav(1)} disabled={xem.index === xem.list.length - 1} title="Bài sau (ở DƯỚI trong danh sách)"
              className="rounded-md border border-slate-200 px-2 py-1 text-[12px] text-slate-500 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-25">↓</button>
            <span className="text-[11px] text-slate-400">{xem.index + 1}/{xem.list.length}</span>
            {muc?.ma && <Ma>{muc.ma}</Ma>}
            <button onClick={onClose} className="ml-auto text-[11px] text-slate-400 hover:text-rose-600">Ẩn panel</button>
          </div>
          {loi ? <div className="rounded-lg bg-rose-50 px-3 py-2 text-[13px] text-rose-700">{loi}</div>
            : !muc ? <div className="text-[13px] text-slate-400">Đang tải…</div>
            : (
              <>
                <Fig src={muc.anhDe} h="h-44" />
                <div className="mt-2.5 text-[13.5px] leading-relaxed text-slate-700"><MathText>{muc.deBai}</MathText></div>
                {muc.ys.map((y, i) => (
                  <div key={i} className="mt-1.5 flex gap-1.5 text-[13.5px] leading-relaxed text-slate-700">
                    {muc.ys.length > 1 && y.nhan && <b className="shrink-0">{y.nhan})</b>}
                    <span className="min-w-0"><MathText>{y.giaThietPhu ? `${y.giaThietPhu}. ${y.noiDung}` : y.noiDung}</MathText></span>
                  </div>
                ))}
              </>
            )}
        </>
      )}
    </Panel>
  )
}
// Popup 2 BƯỚC cho MỘT chuỗi: (1) chọn BẢN — đề chuẩn/lứa (≥2 node) hoặc biến thể/ý thật riêng lẻ (1 node).
// (2) CHỈ chuỗi ≥2 node mới sang cây tick ý; chuỗi 1 node CONFIRM THẲNG (không tiền đề, không gì để nở/ẩn).
function ChonChuoiPopup({ L, phan, chuoi, editing, daChonList, onClose, onConfirm }: {
  L: Luoi; phan: 'lop' | 'nha' | 'et' | 'mt'; chuoi: BaiToan[]; editing?: PickItem; daChonList?: PickItem[]
  onClose: () => void; onConfirm: (ban: Ban, nodeIds: string[]) => void
}) {
  const lai1 = chuoi.length === 1
  const [lists, setLists] = useState<BienThe[][] | null>(null)   // biến thể theo TỪNG node (aligned với `chuoi`)
  const [yList, setYList] = useState<{ y: Y; bai: Bai }[] | null>(null)   // chỉ chuỗi 1 node
  const [picked, setPicked] = useState<{ ban: Ban; label: string } | null>(null)
  useEffect(() => {
    let alive = true
    Promise.all(chuoi.map((b) => api.listBienThe(b.id))).then((r) => { if (alive) setLists(r) }).catch(() => { if (alive) setLists([]) })
    if (lai1) api.yTheoNode(chuoi[0].id).then((r) => { if (alive) setYList(r) }).catch(() => { if (alive) setYList([]) })
    return () => { alive = false }
  }, [chuoi]) // eslint-disable-line react-hooks/exhaustive-deps
  const nhan = PHAN_META[phan].nhan
  const nodesSorted = useMemo(() => [...chuoi].sort((a, b) => a.cap - b.cap || a.ma.localeCompare(b.ma)), [chuoi])
  const deepestOf = (ns: BaiToan[]) => xaNhatTrongChuoi(ns) ?? ns[0]
  // Các BẢN của chuỗi KÈM nội dung để VIEW (giả thiết chung + câu từng bản + hình — Thùy 17/08: "click
  // vào thêm bài phải hiện cả hình vẽ", trước chỉ có chữ, khó phân biệt biến thể đổi đỉnh khác nhau sao).
  const versions = useMemo(() => {
    const deep = deepestOf(nodesSorted)
    const anhGoc = api.anhCuaBaiToan(L, deep.id)
    const out: { ban: Ban; label: string; giaThiet: string; anh: string | null; cau: { ma: string | null; text: string }[] }[] = [
      { ban: { kind: 'ghep', luaId: null }, label: 'Đề chuẩn (gốc)', giaThiet: api.giaThietBaiToan(L, deep.id), anh: anhGoc, cau: nodesSorted.map((b) => ({ ma: b.ma, text: b.phat_bieu })) },
    ]
    if (!lai1 && lists) {
      const byLua = new Map<string, Set<string>>()
      lists.forEach((list, i) => list.forEach((v) => { if (v.lua_id) { const s = byLua.get(v.lua_id) ?? new Set<string>(); s.add(chuoi[i].id); byLua.set(v.lua_id, s) } }))
      let k = 0
      for (const [lua, ns] of byLua) if (ns.size >= 2) {
        k++
        const byNode = new Map<string, BienThe>()
        lists.forEach((list, i) => { const v = list.find((x) => x.lua_id === lua); if (v) byNode.set(chuoi[i].id, v) })
        const withV = nodesSorted.filter((b) => byNode.has(b.id))
        const deepL = deepestOf(withV.length ? withV : nodesSorted)
        const deepV = byNode.get(deepL.id)
        const giaThiet = deepV ? tachDe(deepV.de_bai).giaThiet : api.giaThietBaiToan(L, deepL.id)
        out.push({ ban: { kind: 'ghep', luaId: lua }, label: `Lứa ${k} (đổi đỉnh)`, giaThiet, anh: deepV?.anh ?? api.anhCuaBaiToan(L, deepL.id), cau: nodesSorted.map((b) => { const v = byNode.get(b.id); return { ma: b.ma, text: v ? tachDe(v.de_bai).cauHoi : b.phat_bieu } }) })
      }
    }
    if (lai1) {
      (lists?.[0] ?? []).forEach((v, i) => out.push({ ban: { kind: 'bienthe', bienTheId: v.id }, label: `Biến thể ${i + 1}`, giaThiet: '', anh: v.anh ?? anhGoc, cau: [{ ma: nodesSorted[0].ma, text: v.de_bai }] }));
      (yList ?? []).forEach(({ y, bai }, i) => out.push({ ban: { kind: 'y', yId: y.id }, label: `Ý thật ${i + 1}`, giaThiet: '', anh: bai.anh_de ?? anhGoc, cau: [{ ma: bai.ma_bai, text: y.noi_dung || bai.de_bai }] }))
    }
    return out
  }, [lists, yList, nodesSorted, chuoi, L, lai1])
  // "Thêm bài" (không editing) chỉ hiện bản CHƯA có trong chuỗi/phiếu — Thùy 17/08: "Thêm bài bản chất là
  // hiện các bài KHÁC trong kho". Sửa (editing) thì vẫn hiện đủ để có cái mà đổi sang.
  const versionsHien = useMemo(
    () => editing ? versions : versions.filter((v) => !daChonList?.some((p) => sameBan(p, v.ban))),
    [versions, editing, daChonList],
  )

  const chon = (ban: Ban, label: string) => {
    if (lai1) { onConfirm(ban, [chuoi[0].id]); return }   // 1 node: không tiền đề, không cần cây — confirm thẳng
    setPicked({ ban, label })
  }
  if (picked) {
    return <CayTickPopup L={L} phan={phan} chuoi={chuoi} luaOpts={[{ luaId: picked.ban.kind === 'ghep' ? picked.ban.luaId : null, label: picked.label }]}
      initChon={editing?.nodeIds} initLua={picked.ban.kind === 'ghep' ? picked.ban.luaId : null}
      onBack={() => setPicked(null)} onClose={onClose} onConfirm={(lua, ids) => onConfirm({ kind: 'ghep', luaId: lua }, ids)} />
  }
  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-3 sm:p-6" onClick={onClose}>
      <div className="flex h-[80vh] w-[80vw] max-w-none flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
          <h3 className="text-[15px] font-semibold text-slate-900">{lai1 ? '📄 Chọn bài' : '🌿 Chọn bản của chuỗi'} — {nhan}</h3>
          <span className="text-[12px] text-slate-400">{chuoi.map((b) => b.ma).join(' → ')}{!lai1 && ' · xem rồi chọn 1 bản, bước sau tick ý'}</span>
          <button onClick={onClose} className="ml-auto rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50">Đóng</button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {!lists ? <div className="text-[13px] text-slate-400">Đang tải các bản…</div>
            : !editing && versionsHien.length === 0 ? <div className="py-10 text-center text-[13px] text-slate-400">Mọi bản của chuỗi này đã có trong phiếu — bấm <b>👁</b> ở danh sách để xem lại, hoặc <b>✎</b> để đổi.</div>
            : (
            <div className="grid items-start gap-3 md:grid-cols-2 xl:grid-cols-3">
              {versionsHien.map((v, i) => {
                const daChon = editing && sameBan(editing, v.ban)
                return (
                  <div key={i} className={`flex max-h-[64vh] flex-col rounded-xl border-2 p-3 ${daChon ? 'border-emerald-300' : 'border-slate-200'}`}>
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10.5px] font-medium ${v.ban.kind === 'ghep' ? (v.ban.luaId ? 'bg-indigo-100 text-indigo-700' : 'bg-teal-100 text-teal-700') : v.ban.kind === 'bienthe' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'}`}>
                        {v.ban.kind === 'ghep' ? (v.ban.luaId ? 'lứa' : 'gốc') : v.ban.kind === 'bienthe' ? 'biến thể' : 'ý thật'}
                      </span>
                      <span className="text-[13px] font-semibold text-slate-800">{v.label}</span>
                      {daChon && <span className="ml-auto text-[11px] font-medium text-emerald-600">✓ đang sửa</span>}
                    </div>
                    {/* ⭐ 17/08 (Thùy): "click vào thêm bài phải hiện cả hình vẽ" — trước chỉ có chữ,
                        biến thể đổi đỉnh khác nhau đọc chữ không phân biệt nổi. */}
                    {v.anh
                      ? <div className="mb-1.5 h-24 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50"><img src={v.anh} alt="" className="h-full w-full object-contain" /></div>
                      : <div className="mb-1.5 flex h-24 shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 text-[10.5px] text-slate-300">chưa có hình</div>}
                    <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto text-[14px] leading-relaxed text-slate-700">
                      {v.giaThiet && <div className="rounded bg-slate-50 px-2 py-1.5 text-[13px] text-slate-600"><MathText>{v.giaThiet}</MathText></div>}
                      {v.cau.map((c, ci) => (
                        <div key={ci} className="flex gap-1.5">{v.cau.length > 1 && <b className="shrink-0">{String.fromCharCode(97 + ci)})</b>}<span className="min-w-0">{c.ma && <Ma>{c.ma}</Ma>} <MathText>{c.text}</MathText></span></div>
                      ))}
                    </div>
                    <Btn kind="pri" className="mt-2 w-full justify-center" onClick={() => chon(v.ban, v.label)}>{lai1 ? 'Dùng bài này' : 'Chọn bản này →'}</Btn>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

// Popup CÂY tick: chuỗi/cây node hội tụ vẽ NGANG (dữ kiện trái → bổ đề → đích phải). Tick node = ý được
// HỎI; node bỏ tick = ẩn → nở thành BƯỚC trong đáp án (§ docs/spec-kho-hinh-soan-chuoi). Xem trước sống.
function CayTickPopup({ L, phan, chuoi, luaOpts = [{ luaId: null, label: 'Đề chuẩn (gốc)' }], initChon, initLua = null, onBack, onClose, onConfirm }: {
  L: Luoi; phan: 'lop' | 'nha' | 'et' | 'mt'; chuoi: BaiToan[]
  luaOpts?: { luaId: string | null; label: string }[]; initChon?: string[]; initLua?: string | null
  onBack?: () => void; onClose: () => void; onConfirm: (luaId: string | null, nodeIds: string[]) => void
}) {
  const [chon, setChon] = useState<Set<string>>(() => new Set(initChon?.length ? initChon : chuoi.map((b) => b.id)))
  const [lua, setLua] = useState<string | null>(initLua)
  const nhan = PHAN_META[phan].nhan
  const toggle = (id: string) => setChon((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); if (!n.size) n.add(id); return n })

  // Layout NGANG: cột = cấp (cap) tăng dần trái→phải (dữ kiện → bổ đề → đích); trong cột xếp dọc theo mã.
  const CW = 234, CH = 116, GX = 84, GY = 18, PAD = 16
  const { pos, W, H } = useMemo(() => {
    // Cột = ĐỘ SÂU phụ thuộc tiền đề (longest path trong chuỗi) — KHÔNG dùng `cap` nhập tay: chuỗi thẳng
    // luôn trải mỗi node MỘT cột theo chiều ngang (dữ kiện trái → đích phải), không xếp dọc.
    const ids = new Set(chuoi.map((b) => b.id))
    const depth = new Map<string, number>()
    const dep = (id: string): number => {
      const c = depth.get(id); if (c !== undefined) return c
      depth.set(id, 0)   // guard vòng
      const tds = api.tienDeCua(L, id).filter((t) => ids.has(t))
      const d = tds.length ? Math.max(...tds.map(dep)) + 1 : 0
      depth.set(id, d); return d
    }
    chuoi.forEach((b) => dep(b.id))
    const cols = [...new Set(chuoi.map((b) => depth.get(b.id)!))].sort((a, b) => a - b)
    const byCol = new Map<number, BaiToan[]>()
    for (const b of chuoi) { const d = depth.get(b.id)!; const a = byCol.get(d) ?? []; a.push(b); byCol.set(d, a) }
    for (const a of byCol.values()) a.sort((x, y) => x.ma.localeCompare(y.ma))
    const maxRows = Math.max(1, ...[...byCol.values()].map((a) => a.length))
    const H = maxRows * CH + (maxRows - 1) * GY + PAD * 2
    const pos = new Map<string, { x: number; y: number }>()
    cols.forEach((col, ci) => {
      const arr = byCol.get(col)!
      const colH = arr.length * CH + (arr.length - 1) * GY
      const y0 = (H - colH) / 2
      arr.forEach((b, ri) => pos.set(b.id, { x: PAD + ci * (CW + GX), y: y0 + ri * (CH + GY) }))
    })
    const W = PAD * 2 + cols.length * CW + (cols.length - 1) * GX
    return { pos, W, H }
  }, [chuoi, L])
  const edges = useMemo(() => chuoi.flatMap((b) => api.tienDeCua(L, b.id)
    .filter((t) => pos.has(t)).map((t) => ({ from: pos.get(t)!, to: pos.get(b.id)! }))), [chuoi, L, pos])

  // Xem trước sống: nở đáp án cho tập tick. Đề chung = giả thiết node sâu nhất được tick.
  const ys = useMemo(() => {
    const khung = api.noDapAn(L, [...chon])
    return khung.map((k, i) => ({
      nhan: String.fromCharCode(97 + i), node: k.node,
      gtPhu: [k.node.gia_thiet_phu?.trim(), ...k.gtPhuKeo].filter(Boolean).join('; '),
      giai: api.cachMacDinh(L, k.node.id)?.loi_giai ?? '—',
      buoc: k.buocNodes.map((n) => ({ ch: n.phat_bieu, gt: n.gia_thiet_phu?.trim() || '', giai: api.cachMacDinh(L, n.id)?.loi_giai ?? '—' })),
    }))
  }, [chon, L])
  const deBaiChung = useMemo(() => {
    const deep = xaNhatTrongChuoi(chuoi.filter((b) => chon.has(b.id)))
    return deep ? api.giaThietBaiToan(L, deep.id) : ''
  }, [chon, chuoi, L])

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 p-3 sm:p-6" onClick={onClose}>
      <div className="flex h-[80vh] w-[80vw] max-w-none flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
          {onBack && <button onClick={onBack} className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-[12.5px] text-slate-600 hover:bg-slate-50">← Đổi bản</button>}
          <h3 className="text-[15px] font-semibold text-slate-900">🌿 Chọn ý trên cây</h3>
          <span className="text-[12px] text-slate-400">{nhan} · {luaOpts[0]?.label ?? 'đề chuẩn'} · tick = hỏi (thành ý) · bỏ tick = ẩn → bước</span>
          <button onClick={onClose} className="ml-auto rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50">Đóng</button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {luaOpts.length > 1 && (
            <div className="mb-2 flex items-center gap-2 text-[12px]">
              <span className="text-slate-500">Bản:</span>
              <select className="h-7 rounded border border-slate-300 px-1.5 text-[12px]" value={lua ?? ''} onChange={(e) => setLua(e.target.value || null)}>
                {luaOpts.map((o) => <option key={o.luaId ?? 'chuan'} value={o.luaId ?? ''}>{o.label}</option>)}
              </select>
              <span className="text-[11px] text-slate-400">bản đổi đỉnh → số liệu/tên điểm khác khi in, cấu trúc ý giữ nguyên</span>
            </div>
          )}
          <div className="mb-3 overflow-x-auto rounded-xl bg-slate-50 p-1">
            <div className="relative" style={{ width: W, height: H }}>
              <svg viewBox={`0 0 ${W} ${H}`} className="pointer-events-none absolute inset-0 h-full w-full">
                {edges.map((e, i) => (
                  <path key={i} d={`M${e.from.x + CW},${e.from.y + CH / 2} C${e.from.x + CW + GX * 0.6},${e.from.y + CH / 2} ${e.to.x - GX * 0.6},${e.to.y + CH / 2} ${e.to.x},${e.to.y + CH / 2}`} fill="none" stroke="#cbd5e1" strokeWidth={1.5} />
                ))}
              </svg>
              {chuoi.map((b) => {
                const p = pos.get(b.id)!; const on = chon.has(b.id)
                const idx = ys.findIndex((y) => y.node.id === b.id)
                const dich = !chuoi.some((x) => api.tienDeCua(L, x.id).includes(b.id))
                return (
                  <button key={b.id} type="button" onClick={() => toggle(b.id)}
                    className={`absolute overflow-hidden rounded-xl border-2 px-3 py-2 text-left transition ${on ? 'border-blue-500 bg-blue-50' : 'border-dashed border-slate-300 bg-white hover:border-slate-400'}`}
                    style={{ left: p.x, top: p.y, width: CW, height: CH }}>
                    <div className="mb-1 flex items-center gap-1.5">
                      <span className={`font-mono text-[11.5px] ${on ? 'text-blue-600' : 'text-slate-400'}`}>{b.ma}</span>
                      {dich && <span className="text-[12px] text-amber-500" title="đích">◎</span>}
                      <span className={`ml-auto text-[11px] font-medium ${on ? 'text-blue-600' : 'text-slate-400'}`}>{on ? `ý ${idx >= 0 ? String.fromCharCode(97 + idx) : ''}` : 'ẩn → bước'}</span>
                    </div>
                    <div className="line-clamp-3 text-[16.5px] leading-snug text-slate-800"><MathText>{b.phat_bieu}</MathText></div>
                  </button>
                )
              })}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Đề — bản học sinh</div>
              <div className="text-[12.5px] leading-relaxed text-slate-700">
                {deBaiChung && <div className="mb-1"><MathText>{deBaiChung}</MathText></div>}
                {ys.map((y) => (
                  <div key={y.node.id} className="my-1"><b>{y.nhan})</b> {y.gtPhu && <span className="text-slate-500"><MathText>{`${y.gtPhu}. `}</MathText></span>}Chứng minh <MathText>{y.node.phat_bieu}</MathText>.</div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Đáp án — bản giáo viên</div>
              <div className="text-[12px] leading-relaxed text-slate-600">
                {ys.map((y) => (
                  <div key={y.node.id} className="my-1.5">
                    <b className="text-slate-800">{y.nhan})</b>
                    {y.buoc.map((bc, i) => (
                      <div key={i} className="my-1 ml-2 border-l-2 border-slate-200 pl-2"><b className="text-blue-600">Bước {i + 1} — <MathText>{bc.ch}</MathText>:</b> {bc.gt && <i><MathText>{`${bc.gt}. `}</MathText></i>}<MathText>{bc.giai}</MathText></div>
                    ))}
                    <MathText>{y.giai}</MathText>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 border-t border-slate-200 px-5 py-3">
          <span className="text-[12.5px] text-slate-500"><b>{ys.length}</b> ý · <b>{chuoi.length - ys.length}</b> node ẩn nở thành bước</span>
          <div className="ml-auto flex gap-2">
            <button onClick={onClose} className="rounded-lg px-3 py-2 text-[13px] text-slate-500 hover:bg-slate-100">Huỷ</button>
            <Btn kind="pri" disabled={!chon.size} onClick={() => onConfirm(lua, [...chon])}>Dùng ({ys.length} ý)</Btn>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
