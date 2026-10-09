// BẢN ĐỒ PHIÊU LƯU (tự luyện theo chủ đề) bản THẬT: dữ liệu từ `fn_ban_do_phieu_luu`, câu hỏi/chấm điểm từ luồng Tự luyện sẵn có (LamBai).
// Thế giới → lục địa → chặng đường → màn đấu (DauView + LamBai nhúng, kết quả hiện NGAY trong cảnh) . Spec: spec-v1-app-hs.md §4.5.
// Thế giới còn là cửa vào các kiểu luyện khác (spec §4.2): "Săn quái lang thang" = Tự luyện tổng hợp · "Đấu trường" = Thử thách.
import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react'
import { sinhTuLuyenChuDe } from '../../../lib/tuluyen'
import { BaoLuotHS } from '../BaoLuot'
import { DauTrangHS, HEAD, MAU, ManHS, NutHS, TrongHS, useLoi } from '../skin/KhungHS'
import { laySkin } from '../skin/registry'
import type { SkinId } from '../skin/kieu'
import { tuBanDoPL, type BanDoV, type ChangV, type LucDiaV, type VungV } from './kieu'
import { ganBiomeTheoTranh } from './ban2d/hinh2d'
// 01/10 khuya (Thùy): 3 tầng bản đồ chuyển sang 2D (ảnh tĩnh + hiệu ứng code, ban2d/). Màn đấu giữ 3D tới khi có bản 2.5D.
import { TheGioi2D } from './ban2d/TheGioi2D'
import { LucDia2D } from './ban2d/LucDia2D'
import { Chang2D } from './ban2d/Chang2D'
import { DauView2D } from './DauView2D'
import type { NhungDau } from './nhungDau'
import { BaoDoHoa, NutDoHoa } from './DoHoa'
import type { NvId } from '../skin/nhanVat'
import { anhTheGioi, layBanDo, ManCho, nhoAnh } from './chuyenCanh'

export type LamBaiCmp = (p: { baiTestId: string; hocSinhId: string; onXong: () => void; desktop?: boolean; nhung?: NhungDau }) => ReactElement

type Tang = { t: 'the_gioi' } | { t: 'luc_dia'; luc: string } | { t: 'chang'; luc: string; vung: string } | { t: 'dau'; luc: string; vung: string; chang: string }
// Độ sâu của tầng: đi SÂU hơn ⇒ màn mới hiện kiểu "vừa tới nơi" (phóng từ lớn về vừa — nối tiếp cú phóng vào); đi NGƯỢC lại ⇒ lùi ra (từ nhỏ về vừa).
const SAU: Record<Tang['t'], number> = { the_gioi: 0, luc_dia: 1, chang: 2, dau: 3 }
type Lop = { t: Tang; h: 'vao' | 'ra' }
const KHOA = (t: Tang) => (t.t === 'the_gioi' ? 'tg' : t.t === 'luc_dia' ? `ld${t.luc}` : t.t === 'chang' ? `ch${t.vung}` : `dau${t.chang}`)

export default function PhieuLuuHS({ hocSinhId, mon, gioiTinh, nhanVat, skin, onVe, onTongHop, onThuThach, LamBai }: {
  hocSinhId: string; mon: string; gioiTinh: 'nam' | 'nu' | null; /** nhân vật chính em đã chọn (skin/nhanVat.ts) — chưa chọn ⇒ nhà thám hiểm theo giới tính */ nhanVat?: NvId | null; skin: SkinId; onVe: () => void
  /** lối tắt từ thế giới: Tự luyện tổng hợp ("săn quái lang thang") và Thử thách ("đấu trường") */
  onTongHop?: () => void; onThuThach?: () => void
  LamBai: LamBaiCmp
}) {
  const [banDo, setBanDo] = useState<BanDoV | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  // CÁC LỚP đang vẽ: [màn cũ đang mờ đi, màn mới] — màn cũ GIỮ NGUYÊN instance (key cũ) nên cú phóng của nó chạy hết, màn mới hiện dần ngay bên dưới ⇒ giao nhau, không còn "lõm" qua nền trống.
  // Từ/đến màn ĐẤU không chồng (màn đấu có hiệu ứng phụ: sinh lượt luyện — dựng 2 lần là sai).
  const [lop, setLop] = useState<Lop[]>([{ t: { t: 'the_gioi' }, h: 'vao' }])
  const tang = lop[lop.length - 1].t
  const setTang = (t: Tang) => setLop((l) => {
    const cu = l[l.length - 1]
    if (KHOA(cu.t) === KHOA(t)) return l
    const h = SAU[t.t] >= SAU[cu.t.t] ? 'vao' : 'ra'
    return cu.t.t === 'dau' || t.t === 'dau' ? [{ t, h }] : [cu, { t, h }]
  })
  useEffect(() => {
    if (lop.length < 2) return
    const id = window.setTimeout(() => setLop((l) => l.slice(-1)), 700)
    return () => window.clearTimeout(id)
  }, [lop])
  const b = laySkin(skin).the3d

  // lần đầu: dùng bản đã nạp trước (chuyenCanh.napPhieuLuu) + CHỜ ảnh thế giới giải mã xong mới hiện (không còn cảnh nền biển rồi từng lục địa nhảy vào). Quay lại từ màn đấu (moi) ⇒ gọi mới, không chờ ảnh.
  const tai = (moi = false) => { setLoi(null); Promise.all([layBanDo(mon, moi), moi ? undefined : nhoAnh(anhTheGioi())]).then(([d]) => setBanDo(ganBiomeTheoTranh(tuBanDoPL(d)))).catch((e) => setLoi(e?.message ?? String(e))) }
  useEffect(() => { setBanDo(null); tai() }, [mon]) // eslint-disable-line react-hooks/exhaustive-deps

  // lục địa em đang học: lục địa đầu tiên có chặng còn quái
  const hienTai = useMemo(() => banDo?.luc_dia.find((l) => l.vung.some((v) => v.chang.some((c) => c.trang_thai === 'yeu')))?.ma ?? banDo?.luc_dia[0]?.ma ?? null, [banDo])

  if (!b) return <ManHS><DauTrangHS tieuDe="Bản đồ" onBack={onVe} /><TrongHS>Style này chưa có bản đồ 3D.</TrongHS></ManHS>
  if (loi) return <ManHS><DauTrangHS tieuDe="Bản đồ" onBack={onVe} /><TrongHS>Chưa tải được bản đồ: {loi}</TrongHS><NutHS onClick={() => tai(true)}>Thử lại</NutHS></ManHS>
  if (!banDo) return <ManCho />
  if (!banDo.luc_dia.length) return <ManHS><DauTrangHS tieuDe="Bản đồ" onBack={onVe} /><TrongHS>Chưa có chủ đề nào để luyện. Học vài buổi trên lớp rồi quay lại nhé.</TrongHS></ManHS>

  // vẽ 1 tầng (màn cũ đang mờ cũng gọi lại hàm này với tầng cũ của nó)
  const manTang = (t: Tang) => {
    const luc: LucDiaV | undefined = t.t === 'the_gioi' ? undefined : banDo.luc_dia.find((l) => l.ma === t.luc)
    const vung: VungV | undefined = t.t === 'chang' || t.t === 'dau' ? luc?.vung.find((v) => v.ma === t.vung) : undefined
    const chang: ChangV | undefined = t.t === 'dau' ? vung?.chang.find((c) => c.ma === t.chang) : undefined
    return (
      <>
        {t.t === 'the_gioi' && (
          <>
            <TheGioi2D banDo={banDo} b={b} gioi={gioiTinh ?? 'nam'} hienTai={hienTai} onChon={(ma) => setTang({ t: 'luc_dia', luc: ma })}
              thanh={(onTongHop || onThuThach) ? <>
                {onTongHop && <NutHS phu onClick={onTongHop}>Săn quái lang thang</NutHS>}
                {onThuThach && <NutHS phu onClick={onThuThach}>Đấu trường</NutHS>}
              </> : undefined} />
            <div className="pointer-events-none absolute left-0 right-0 top-0 p-3"><div className="pointer-events-auto"><DauTrangHS tieuDe={`Thế giới ${banDo.mon}`} phu="Bấm một lục địa để đi vào" onBack={onVe} /></div></div>
          </>
        )}
        {t.t === 'luc_dia' && luc && <LucDia2D luc={luc} b={b} gioi={nhanVat ?? gioiTinh ?? 'nam'} onChon={(v) => setTang({ t: 'chang', luc: luc.ma, vung: v })} onVe={() => setTang({ t: 'the_gioi' })} />}
        {t.t === 'chang' && luc && vung && <Chang2D luc={luc} vung={vung} b={b} gioi={gioiTinh ?? 'nam'} onVe={() => setTang({ t: 'luc_dia', luc: luc.ma })} onVao={(c) => setTang({ t: 'dau', luc: luc.ma, vung: vung.ma, chang: c.ma })} />}
        {t.t === 'dau' && luc && vung && chang && (
          <DauThat luc={luc} chang={chang} b={b} mon={mon} hocSinhId={hocSinhId} gioi={nhanVat ?? gioiTinh ?? 'nam'} LamBai={LamBai} onVe={() => { setTang({ t: 'chang', luc: luc.ma, vung: vung.ma }); tai(true) }} />
        )}
      </>
    )
  }

  return (
    <div className="fixed inset-0 z-10 overflow-hidden" style={{ background: 'var(--sk-page)', color: 'var(--sk-ink)', fontFamily: 'var(--sk-font)' }}>
      {lop.map((e, i) => {
        const moiNhat = i === lop.length - 1
        return (
          <div key={KHOA(e.t)} className="absolute inset-0" style={moiNhat
            ? { animation: `${e.h === 'vao' ? 'pl-vao' : 'pl-ra'} .6s cubic-bezier(.2,.7,.2,1) both` }
            : { animation: 'pl-roi .45s ease-in both', pointerEvents: 'none' }}>
            {manTang(e.t)}
          </div>
        )
      })}
      {tang.t !== 'dau' && <div className="pointer-events-none absolute bottom-3 right-3 z-20"><NutDoHoa /></div>}
      <BaoDoHoa />
      <style>{'@keyframes pl-vao{0%{opacity:0;transform:scale(1.07)}100%{opacity:1;transform:scale(1)}}@keyframes pl-ra{0%{opacity:0;transform:scale(.95)}100%{opacity:1;transform:scale(1)}}@keyframes pl-roi{0%{opacity:1}100%{opacity:0}}@media (prefers-reduced-motion:reduce){.pl-x{animation:none!important}}'}</style>
    </div>
  )
}

// ── Màn đấu thật: sinh lượt (bài tự luyện đúng dạng) → DauView + LamBai nhúng → thẻ kết quả NGAY trong cảnh ──────
// `sinh` = nguồn sinh lượt (mặc định: luyện đúng dạng của chặng); Luyện dạng yếu truyền nguồn riêng. `veKhu` ⇒ nút về ghi "Về khu Học tập" thay vì "Về chặng đường".
export function DauThat({ luc, chang, b, mon, hocSinhId, gioi, LamBai, onVe, sinh, veKhu }: {
  luc: LucDiaV; chang: ChangV; b: NonNullable<ReturnType<typeof laySkin>['the3d']>; mon: string; hocSinhId: string; gioi: NvId; LamBai: LamBaiCmp; onVe: () => void
  sinh?: () => Promise<{ baiTestId: string }>; veKhu?: boolean
}) {
  const [bai, setBai] = useState<{ id: string } | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [tong, setTong] = useState(chang.so_cau_luot ?? 10)
  const [daLam, setDaLam] = useState(0)
  const [kq, setKq] = useState<{ dung: number; tong: number; baiLamId: string | null } | null>(null)
  const [lan, setLan] = useState(0)

  // Guard StrictMode (dev chạy effect 2 lần): mỗi LƯỢT chỉ sinh 1 bài — bản không guard để lại 1 lượt mồ côi mỗi lần mở (bài học LamTuLuyen).
  const daGoi = useRef(-1)
  useEffect(() => {
    if (daGoi.current === lan) return
    daGoi.current = lan
    setBai(null); setKq(null); setLoi(null)
    void (sinh ? sinh() : sinhTuLuyenChuDe(mon, chang.ma, false)).then((r) => setBai({ id: r.baiTestId })).catch((e) => setLoi(e?.message ?? String(e)))
  }, [lan]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loi) return <ManHS><DauTrangHS tieuDe={chang.ten} onBack={onVe} /><TrongHS>Chưa mở được lượt luyện: {loi}</TrongHS><NutHS onClick={() => setLan((x) => x + 1)}>Thử lại</NutHS></ManHS>
  if (!bai) return <ManCho chu="Đang gọi quái ra…" />
  return (
    <DauView2D key={bai.id} luc={luc} chang={chang} b={b} gioi={gioi} tong={tong} daLam={daLam} onRut={onVe}>
      {(api) => kq
        ? <KetQuaTrongDau chang={chang} kq={kq} heT={api.heT} veKhu={!!veKhu} onTiep={() => setLan((x) => x + 1)} onVe={onVe} />
        : <LamBai baiTestId={bai.id} hocSinhId={hocSinhId} onXong={onVe} desktop
            nhung={{ onTai: (t, d) => { setTong(t); setDaLam(d) }, onCau: (e) => { void api.tra(e.verdict === 'correct') }, onHet: setKq, ban: api.ban }} />}
    </DauView2D>
  )
}

function KetQuaTrongDau({ chang, kq, heT, veKhu, onTiep, onVe }: { chang: ChangV; kq: { dung: number; tong: number; baiLamId: string | null }; heT: boolean; veKhu: boolean; onTiep: () => void; onVe: () => void }) {
  const loi = useLoi()
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-2 p-5 text-center">
      <p className="text-[14.5px]" style={{ color: MAU.muted }}>{chang.ten}</p>
      <p className="text-[37.5px] font-bold leading-none" style={{ ...HEAD, color: MAU.ink }}>{heT ? loi.hetDoiHinh : `${kq.dung}/${kq.tong} đúng`}</p>
      {heT && <p className="text-[16.5px]" style={{ color: MAU.ink }}>{kq.dung}/{kq.tong} câu đúng</p>}
      <BaoLuotHS baiLamId={kq.baiLamId} />
      <p className="text-[14px]" style={{ color: MAU.muted }}>{loi.ketQua.ghiNhan}</p>
      <div className="mt-1 flex flex-wrap justify-center gap-2"><NutHS onClick={onTiep}>{loi.ketQua.luyenTiep}</NutHS><NutHS phu onClick={onVe}>{veKhu ? loi.ketQua.veKhu : loi.ketQua.veChang}</NutHS></div>
    </div>
  )
}
