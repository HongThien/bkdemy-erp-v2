// BẢN ĐỒ PHIÊU LƯU (tự luyện theo chủ đề) bản THẬT: dữ liệu từ `fn_ban_do_phieu_luu`, câu hỏi/chấm điểm từ luồng Tự luyện sẵn có (LamBai).
// Thế giới → lục địa → chặng đường → màn đấu (DauView + LamBai nhúng, kết quả hiện NGAY trong cảnh) . Spec: spec-v1-app-hs.md §4.5.
// Thế giới còn là cửa vào các kiểu luyện khác (spec §4.2): "Săn quái lang thang" = Tự luyện tổng hợp · "Đấu trường" = Thử thách.
import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react'
import { banDoPhieuLuu } from '../../../lib/phieuluu'
import { sinhTuLuyenChuDe } from '../../../lib/tuluyen'
import { ketQuaLuotHocThat, loiLuotKhongTinh, type KetQuaLuot } from '../../../lib/chuoi'
import { DauTrangHS, HEAD, MAU, ManHS, NutHS, TheHS, TrongHS } from '../skin/KhungHS'
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

export type LamBaiCmp = (p: { baiTestId: string; hocSinhId: string; onXong: () => void; desktop?: boolean; nhung?: NhungDau }) => ReactElement

type Tang = { t: 'the_gioi' } | { t: 'luc_dia'; luc: string } | { t: 'chang'; luc: string; vung: string } | { t: 'dau'; luc: string; vung: string; chang: string }
const KHOA = (t: Tang) => (t.t === 'the_gioi' ? 'tg' : t.t === 'luc_dia' ? `ld${t.luc}` : t.t === 'chang' ? `ch${t.vung}` : `dau${t.chang}`)

export default function PhieuLuuHS({ hocSinhId, mon, gioiTinh, nhanVat, skin, onVe, onTongHop, onThuThach, LamBai }: {
  hocSinhId: string; mon: string; gioiTinh: 'nam' | 'nu' | null; /** nhân vật chính em đã chọn (skin/nhanVat.ts) — chưa chọn ⇒ nhà thám hiểm theo giới tính */ nhanVat?: NvId | null; skin: SkinId; onVe: () => void
  /** lối tắt từ thế giới: Tự luyện tổng hợp ("săn quái lang thang") và Thử thách ("đấu trường") */
  onTongHop?: () => void; onThuThach?: () => void
  LamBai: LamBaiCmp
}) {
  const [banDo, setBanDo] = useState<BanDoV | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [tang, setTang] = useState<Tang>({ t: 'the_gioi' })
  const b = laySkin(skin).the3d

  const tai = () => { setLoi(null); banDoPhieuLuu(mon).then((d) => setBanDo(ganBiomeTheoTranh(tuBanDoPL(d)))).catch((e) => setLoi(e?.message ?? String(e))) }
  useEffect(() => { setBanDo(null); tai() }, [mon]) // eslint-disable-line react-hooks/exhaustive-deps

  // lục địa em đang học: lục địa đầu tiên có chặng còn quái
  const hienTai = useMemo(() => banDo?.luc_dia.find((l) => l.vung.some((v) => v.chang.some((c) => c.trang_thai === 'yeu')))?.ma ?? banDo?.luc_dia[0]?.ma ?? null, [banDo])

  if (!b) return <ManHS><DauTrangHS tieuDe="Bản đồ" onBack={onVe} /><TrongHS>Style này chưa có bản đồ 3D.</TrongHS></ManHS>
  if (loi) return <ManHS><DauTrangHS tieuDe="Bản đồ" onBack={onVe} /><TrongHS>Chưa tải được bản đồ: {loi}</TrongHS><NutHS onClick={tai}>Thử lại</NutHS></ManHS>
  if (!banDo) return (
    <div className="fixed inset-0 z-10 flex items-center justify-center" style={{ background: 'var(--sk-page)', color: 'var(--sk-muted)', fontFamily: 'var(--sk-font)' }}>
      <style>{'@keyframes pl-cho { 0%,30% { opacity: 0 } 100% { opacity: 1 } }'}</style>
      <span className="text-[14px]" style={{ animation: 'pl-cho 1.2s ease-out both' }}>Đang mở bản đồ…</span>
    </div>
  )
  if (!banDo.luc_dia.length) return <ManHS><DauTrangHS tieuDe="Bản đồ" onBack={onVe} /><TrongHS>Chưa có chủ đề nào để luyện. Học vài buổi trên lớp rồi quay lại nhé.</TrongHS></ManHS>

  const luc: LucDiaV | undefined = tang.t === 'the_gioi' ? undefined : banDo.luc_dia.find((l) => l.ma === tang.luc)
  const vung: VungV | undefined = tang.t === 'chang' || tang.t === 'dau' ? luc?.vung.find((v) => v.ma === tang.vung) : undefined
  const chang: ChangV | undefined = tang.t === 'dau' ? vung?.chang.find((c) => c.ma === tang.chang) : undefined

  return (
    <div className="fixed inset-0 z-10" style={{ background: 'var(--sk-page)', color: 'var(--sk-ink)', fontFamily: 'var(--sk-font)' }}>
      {/* đổi tầng: hiện dần + phóng nhẹ (cảm giác "đi vào" bản đồ) */}
      <div key={KHOA(tang)} className="absolute inset-0" style={{ animation: 'phieuluu-hien .5s ease-out both' }}>
        {tang.t === 'the_gioi' && (
          <>
            <TheGioi2D banDo={banDo} b={b} gioi={gioiTinh ?? 'nam'} hienTai={hienTai} onChon={(ma) => setTang({ t: 'luc_dia', luc: ma })}
              thanh={(onTongHop || onThuThach) ? <>
                {onTongHop && <NutHS phu onClick={onTongHop}>Săn quái lang thang</NutHS>}
                {onThuThach && <NutHS phu onClick={onThuThach}>Đấu trường</NutHS>}
              </> : undefined} />
            <div className="pointer-events-none absolute left-0 right-0 top-0 p-3"><div className="pointer-events-auto"><DauTrangHS tieuDe={`Thế giới ${banDo.mon}`} phu="Bấm một lục địa để đi vào" onBack={onVe} /></div></div>
          </>
        )}
        {tang.t === 'luc_dia' && luc && <LucDia2D luc={luc} b={b} gioi={nhanVat ?? gioiTinh ?? 'nam'} onChon={(v) => setTang({ t: 'chang', luc: luc.ma, vung: v })} onVe={() => setTang({ t: 'the_gioi' })} />}
        {tang.t === 'chang' && luc && vung && <Chang2D luc={luc} vung={vung} b={b} gioi={gioiTinh ?? 'nam'} onVe={() => setTang({ t: 'luc_dia', luc: luc.ma })} onVao={(c) => setTang({ t: 'dau', luc: luc.ma, vung: vung.ma, chang: c.ma })} />}
        {tang.t === 'dau' && luc && vung && chang && (
          <DauThat luc={luc} chang={chang} b={b} mon={mon} hocSinhId={hocSinhId} gioi={nhanVat ?? gioiTinh ?? 'nam'} LamBai={LamBai} onVe={() => { setTang({ t: 'chang', luc: luc.ma, vung: vung.ma }); tai() }} />
        )}
      </div>
      {tang.t !== 'dau' && <div className="pointer-events-none absolute bottom-3 right-3 z-20"><NutDoHoa /></div>}
      <BaoDoHoa />
      <style>{'@keyframes phieuluu-hien{0%{opacity:0;transform:scale(.97)}100%{opacity:1;transform:scale(1)}}'}</style>
    </div>
  )
}

// ── Màn đấu thật: sinh lượt (bài tự luyện đúng dạng) → DauView + LamBai nhúng → thẻ kết quả NGAY trong cảnh ──────
function DauThat({ luc, chang, b, mon, hocSinhId, gioi, LamBai, onVe }: {
  luc: LucDiaV; chang: ChangV; b: NonNullable<ReturnType<typeof laySkin>['the3d']>; mon: string; hocSinhId: string; gioi: NvId; LamBai: LamBaiCmp; onVe: () => void
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
    sinhTuLuyenChuDe(mon, chang.ma, false).then((r) => setBai({ id: r.baiTestId })).catch((e) => setLoi(e?.message ?? String(e)))
  }, [lan]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loi) return <ManHS><DauTrangHS tieuDe={chang.ten} onBack={onVe} /><TrongHS>Chưa mở được lượt luyện: {loi}</TrongHS><NutHS onClick={() => setLan((x) => x + 1)}>Thử lại</NutHS></ManHS>
  if (!bai) return <ManHS><DauTrangHS tieuDe={chang.ten} onBack={onVe} /><TrongHS>Đang gọi quái ra…</TrongHS></ManHS>
  return (
    <DauView2D key={bai.id} luc={luc} chang={chang} b={b} gioi={gioi} tong={tong} daLam={daLam} onRut={onVe}>
      {(api) => kq
        ? <KetQuaTrongDau chang={chang} kq={kq} heT={api.heT} onTiep={() => setLan((x) => x + 1)} onVe={onVe} />
        : <LamBai baiTestId={bai.id} hocSinhId={hocSinhId} onXong={onVe} desktop
            nhung={{ onTai: (t, d) => { setTong(t); setDaLam(d) }, onCau: (e) => { void api.tra(e.verdict === 'correct') }, onHet: setKq, ban: api.ban }} />}
    </DauView2D>
  )
}

function KetQuaTrongDau({ chang, kq, heT, onTiep, onVe }: { chang: ChangV; kq: { dung: number; tong: number; baiLamId: string | null }; heT: boolean; onTiep: () => void; onVe: () => void }) {
  const [r, setR] = useState<KetQuaLuot | null | undefined>(undefined)
  useEffect(() => { if (!kq.baiLamId) { setR(null); return } ketQuaLuotHocThat(kq.baiLamId).then(setR).catch(() => setR(null)) }, [kq.baiLamId])
  const khong = r ? loiLuotKhongTinh(r) : null
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-2 p-5 text-center">
      <p className="text-[13px]" style={{ color: MAU.muted }}>{chang.ten}</p>
      <p className="text-[34px] font-bold leading-none" style={{ ...HEAD, color: MAU.ink }}>{heT ? 'Hạ hết đội hình!' : `${kq.dung}/${kq.tong} đúng`}</p>
      {heT && <p className="text-[15px]" style={{ color: MAU.ink }}>{kq.dung}/{kq.tong} câu đúng</p>}
      <TheHS className="w-full px-4 py-3 text-[14px]">
        {r === undefined ? <span style={{ color: MAU.muted }}>Đang tính…</span>
          : r?.tinh ? <span style={{ color: MAU.dung, fontWeight: 600 }}>Lượt này được tính: chuỗi, nhiệm vụ và quái đều ghi nhận.</span>
          : <span style={{ color: MAU.canhBao }}>{khong ?? 'Lượt này chưa được tính.'}</span>}
      </TheHS>
      <p className="text-[12.5px]" style={{ color: MAU.muted }}>Máu quái và độ nắm dạng cập nhật theo kết quả thật khi em quay lại bản đồ.</p>
      <div className="mt-1 flex flex-wrap justify-center gap-2"><NutHS onClick={onTiep}>Đánh tiếp</NutHS><NutHS phu onClick={onVe}>Về chặng đường</NutHS></div>
    </div>
  )
}
