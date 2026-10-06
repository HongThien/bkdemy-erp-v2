// ============================================================================
// HoSoHS — HỒ SƠ khoe của HS (design/DON-HANG-GAMI-HS.md Đơn 4). Em bấm AVATAR ở màn chính là mở; phase này chỉ em tự xem.
// 7 khối đúng thứ tự đơn: ① đầu hồ sơ (avatar trong khung bậc rank) ② chọn môn ③ rank ④ 3 huy hiệu khoe ⑤ album thu gọn
// ⑥ tháng này ⑦ kỷ niệm các mùa. Số liệu: fn_hs_rank_cua_toi · fn_hs_nhiem_vu_cua_toi · fn_hs_ho_so (mig 202609290015) — chỉ trình bày.
// Tách VIEW (HoSoView) khỏi container để hs.html?xem=gami vẽ mọi trạng thái. Hình: gami/HinhGami (đổi vỏ ở gami/hinh.ts).
// Danh hiệu ("Xuất sắc tháng 9") CHƯA có nguồn DB ⇒ prop danhHieu, container để null ⇒ ô ẩn (đúng đơn: không có thì ẩn).
// Kỷ niệm mùa: chưa hết mùa nào ⇒ ô trống có chữ giải thích (đơn cho phép).
// ============================================================================
import { useEffect, useState, type ReactNode } from 'react'
import { rankCuaToi, type RankCuaToi } from '../../lib/rank'
import { rankBat } from './phieuluu/coBat'
import { nhiemVuCuaToi, type NhiemVuCuaToi } from '../../lib/nhiemvu'
import { hoSoGamiCuaToi, datKhoe, type HoSoGami, type Khoe } from '../../lib/hosoGami'
import type { LopMonHS } from '../../lib/tuluyen'
import { MAU, THE, THE_TRON, HEAD, ManHS, DauTrangHS, NutHS } from './skin/KhungHS'
import { NutDoHoa } from './phieuluu/DoHoa'
import ThanhChonMon from './ThanhChonMon'
import { chuongCua, laThan, mauHH, VANG, MAU_GAMI } from './gami/hinh'
import { AvatarKhung, BieuTuongBac, SaoBac, HinhHuyHieu } from './gami/HinhGami'

const so = (n: number) => n.toLocaleString('vi-VN')
const vietTat = (ten: string) => ten.trim().split(/\s+/).slice(-2).map((w) => w[0]).join('').toUpperCase()
const tenNgan = (ten: string) => ten.trim().split(/\s+/).slice(-2).join(' ')

function Nhom({ tieuDe, phai, children }: { tieuDe: string; phai?: ReactNode; children: ReactNode }) {
  return (
    <div className="p-4" style={THE}>
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <p className="text-[12px] font-extrabold uppercase tracking-[0.08em]" style={{ color: MAU.muted }}>{tieuDe}</p>
        {phai}
      </div>
      {children}
    </div>
  )
}

export type HoSoViewProps = {
  hoTen: string; anhUrl: string | null; avatar?: ReactNode; danhHieu?: string | null
  mons: LopMonHS[]; mon: string | null; onChonMon: (m: string) => void
  rank: RankCuaToi | null; nv: NhiemVuCuaToi | null; hs: HoSoGami | null
  onRank?: () => void; onAlbum?: () => void; onDoiKhoe?: () => void
}

// ── VIEW: chỉ vẽ ──
export function HoSoView(p: HoSoViewProps) {
  const toi = p.rank?.toi ?? null
  const bac = toi?.bac ?? 1
  const than = laThan(bac) || !!toi?.ghe
  const c = chuongCua(bac)
  const bacSau = toi && p.rank ? p.rank.bac.find((b) => b.bac === toi.bac + 1) : undefined
  const tienDo = toi?.nguong_sau ? Math.min(1, (toi.diem_mua - toi.nguong_bac) / (toi.nguong_sau - toi.nguong_bac)) : 1
  const khoe: (Khoe | null)[] = [1, 2, 3].map((v) => p.hs?.khoe.find((k) => k.vi_tri === v) ?? null)
  const nvMo = p.nv && p.nv.mo ? p.nv : null

  return (
    <div className="flex flex-col gap-3">
      {/* ① ĐẦU HỒ SƠ */}
      <div className="flex flex-col items-center gap-1 pt-2 text-center">
        <AvatarKhung bac={bac} size={132} anhUrl={p.anhUrl} initials={vietTat(p.hoTen)} avatar={p.avatar} />
        <p className="mt-1 text-[22px] font-extrabold leading-tight" style={{ ...HEAD, color: MAU.ink, textShadow: '0 1px 8px var(--sk-bg)' }}>{p.hoTen}</p>
        {toi && <p className="text-[13px]" style={{ color: MAU.muted, textShadow: '0 1px 8px var(--sk-bg)' }}>{toi.ten_lop} · khối {p.rank!.khoi}</p>}
        {p.danhHieu && <span className="mt-1 rounded-full px-3 py-1 text-[12.5px] font-bold" style={{ ...THE_TRON, borderRadius: 999, color: MAU.acc }}>🎗 {p.danhHieu}</span>}
      </div>

      {/* ② CHỌN MÔN */}
      <ThanhChonMon mons={p.mons} mon={p.mon} onChon={p.onChonMon} className="justify-center"
        nut={(chon) => (chon ? { background: MAU.acc, color: MAU.accInk } : { ...THE_TRON, borderRadius: 999, color: MAU.ink })} />

      {/* ③ RANK — tạm khoá 06/10 (rankBat) */}
      {rankBat() && <button onClick={p.onRank} disabled={!p.onRank} className="overflow-hidden text-left active:scale-[0.99]" style={THE}>
        <div className="flex items-center justify-between px-4 py-2" style={{ background: c.mau, color: MAU_GAMI.chu }}>
          <span className="text-[13px] font-extrabold" style={HEAD}>{than ? 'Thần' : `Chương ${c.ten}`}</span>
          {p.onRank && <span className="text-[12px] font-bold opacity-90">Xem Rank ›</span>}
        </div>
        <div className="flex items-center gap-4 px-4 py-3.5" style={{ color: MAU.ink }}>
          {toi ? (
            <>
              <BieuTuongBac bac={bac} size={76} />
              <div className="min-w-0 flex-1">
                <p className="text-[24px] font-extrabold leading-none" style={HEAD}>{toi.ghe ?? toi.ten_bac}</p>
                {!than && <div className="mt-1"><SaoBac n={toi.sao} size={17} /></div>}
                <p className="mt-1.5 text-[13px]"><b>{so(toi.diem_mua)}</b> Điểm Rank · hạng <b>{toi.hang_khoi}</b>/{toi.so_em_khoi} khối</p>
                {bacSau && toi.nguong_sau != null && (
                  <>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full" style={{ background: MAU.surface2 }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.round(tienDo * 100)}%`, background: c.mau }} />
                    </div>
                    <p className="mt-1 text-[11.5px]" style={{ color: MAU.muted }}>Còn {so(toi.nguong_sau - toi.diem_mua)} điểm lên {bacSau.ten}</p>
                  </>
                )}
              </div>
            </>
          ) : <p className="text-[13px]" style={{ color: MAU.muted }}>{p.rank === null ? 'Rank chưa mở cho môn này.' : 'Em chưa có điểm Rank mùa này.'}</p>}
        </div>
      </button>}

      {/* ④ 3 HUY HIỆU KHOE */}
      <Nhom tieuDe="Huy hiệu khoe" phai={p.onDoiKhoe && <button onClick={p.onDoiKhoe} className="rounded-full px-3 py-1 text-[12.5px] font-bold" style={{ background: MAU.surface2, color: MAU.acc }}>Đổi</button>}>
        <div className="grid grid-cols-3 gap-2">
          {khoe.map((k, i) => (
            <button key={i} onClick={p.onDoiKhoe} disabled={!p.onDoiKhoe} className="flex flex-col items-center gap-1.5 rounded-2xl py-2.5" style={{ background: MAU.surface2 }}>
              {k ? <HinhHuyHieu hhKey={k.key} sao={k.sao} size={64} title={k.ten} />
                : <span className="flex h-16 w-16 items-center justify-center rounded-full text-[26px] font-bold" style={{ border: `2px dashed ${MAU.line}`, color: MAU.muted }}>+</span>}
              <span className="text-[12.5px] font-bold" style={{ color: k ? MAU.ink : MAU.muted }}>{k ? k.ten : 'Trống'}</span>
            </button>
          ))}
        </div>
      </Nhom>

      {/* ⑤ ALBUM THU GỌN */}
      {p.hs && (
        <button onClick={p.onAlbum} disabled={!p.onAlbum} className="p-4 text-left active:scale-[0.99]" style={THE}>
          <div className="mb-2.5 flex items-center justify-between">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.08em]" style={{ color: MAU.muted }}>Album huy hiệu</p>
            <span className="text-[13px] font-extrabold" style={{ color: MAU.acc }}>{p.hs.tong_sao}/{p.hs.tong_sao_toi_da} sao ›</span>
          </div>
          <div className="grid grid-cols-8 gap-1">
            {p.hs.huy_hieu.map((h) => (
              <span key={h.key} className="flex flex-col items-center gap-0.5">
                <HinhHuyHieu hhKey={h.key} sao={h.sao} size={36} kieu="nho" title={h.ten} />
                <span className="text-[10.5px] font-bold leading-none" style={{ color: h.sao ? (h.sao >= 4 ? VANG : mauHH(h.key).dam) : MAU.muted }}>{h.sao ? `★${h.sao}` : '–'}</span>
              </span>
            ))}
          </div>
        </button>
      )}

      {/* ⑥ THÁNG NÀY */}
      <Nhom tieuDe="Tháng này">
        <div className="grid grid-cols-3 gap-2 text-center">
          {([
            ['Đua tháng', p.rank?.dua_thang ? `#${p.rank.dua_thang.hang}` : '–', p.rank?.dua_thang ? `/${p.rank.dua_thang.so_em_co_diem}` : ''],
            ['Chặng', nvMo ? `cấp ${nvMo.chang.cap}` : '–', nvMo ? `/${nvMo.cau_hinh.cap_max}` : ''],
            ['Bản cứng', p.hs ? String(p.hs.ban_cung_da_nhan) : '–', ''],
          ] as const).map(([nhan, so1, phu]) => (
            <div key={nhan} className="rounded-2xl py-2.5" style={{ background: MAU.surface2 }}>
              <div className="text-[18px] font-extrabold leading-tight" style={{ color: MAU.ink }}>{so1}<span className="text-[12px] font-bold" style={{ color: MAU.muted }}>{phu}</span></div>
              <div className="text-[11.5px]" style={{ color: MAU.muted }}>{nhan}</div>
            </div>
          ))}
        </div>
      </Nhom>

      {/* ⑦ KỶ NIỆM CÁC MÙA */}
      <Nhom tieuDe="Kỷ niệm các mùa">
        <p className="rounded-2xl px-3 py-4 text-center text-[13px]" style={{ border: `1.5px dashed ${MAU.line}`, color: MAU.muted }}>
          Hết mùa {p.hs?.mua ?? 'này'}, bậc cao nhất em đạt được sẽ lưu ở đây — giữ mãi.
        </p>
      </Nhom>
    </div>
  )
}

// ── Chọn 3 huy hiệu khoe (lưới 8, chưa đạt thì khoá) ──
export function ChonKhoe({ hs, onHuy, onLuu }: { hs: HoSoGami; onHuy: () => void; onLuu: (keys: string[]) => Promise<void> }) {
  const [chon, setChon] = useState<string[]>(hs.khoe.map((k) => k.key))
  const [dang, setDang] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const bam = (key: string) => setChon((c) => (c.includes(key) ? c.filter((x) => x !== key) : c.length < 3 ? [...c, key] : c))
  return (
    <div role="dialog" aria-modal className="fixed inset-0 z-40 flex items-end justify-center md:items-center" style={{ background: 'rgba(8,10,24,.6)' }} onClick={onHuy}>
      <div className="w-full max-w-[520px] p-4 pb-[calc(16px+env(safe-area-inset-bottom))]" style={{ ...THE, borderRadius: '24px 24px 0 0', clipPath: 'none' }} onClick={(e) => e.stopPropagation()}>
        <p className="text-[18px] font-extrabold" style={{ ...HEAD, color: MAU.ink }}>Chọn 3 huy hiệu khoe</p>
        <p className="mt-0.5 text-[12.5px]" style={{ color: MAU.muted }}>Bấm theo thứ tự muốn xếp · đã chọn {chon.length}/3</p>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {hs.huy_hieu.map((h) => {
            const khoa = h.sao_cao_nhat <= 0, thu = chon.indexOf(h.key)
            return (
              <button key={h.key} disabled={khoa} onClick={() => bam(h.key)} className="relative flex flex-col items-center gap-1 rounded-2xl py-2"
                style={{ background: MAU.surface2, boxShadow: thu >= 0 ? `inset 0 0 0 2px ${MAU.acc}` : undefined, opacity: khoa ? 0.55 : 1 }}>
                <HinhHuyHieu hhKey={h.key} sao={h.sao_cao_nhat} size={52} title={h.ten} />
                <span className="text-[11.5px] font-bold" style={{ color: MAU.ink }}>{h.ten}</span>
                {thu >= 0 && <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-extrabold" style={{ background: MAU.acc, color: MAU.accInk }}>{thu + 1}</span>}
              </button>
            )
          })}
        </div>
        {loi && <p className="mt-2 text-[12.5px] font-semibold" style={{ color: MAU.sai }}>{loi}</p>}
        <div className="mt-3 flex gap-2">
          <NutHS phu onClick={onHuy} className="flex-1">Huỷ</NutHS>
          <NutHS tat={dang} className="flex-1" onClick={async () => {
            setDang(true); setLoi(null)
            try { await onLuu(chon) } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setDang(false) }
          }}>{dang ? 'Đang lưu…' : 'Lưu'}</NutHS>
        </div>
      </div>
    </div>
  )
}

// ── Thẻ nhỏ trên TV lớp (1 dòng) — KHÔNG hiện hạng (hạng thấp chỉ em tự thấy) ──
export function TheTVHS({ hoTen, anhUrl, bac, khoe }: { hoTen: string; anhUrl: string | null; bac: number; khoe: Khoe[] }) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2" style={THE}>
      <AvatarKhung bac={bac} size={52} anhUrl={anhUrl} initials={vietTat(hoTen)} />
      <span className="min-w-0 flex-1 truncate text-[15px] font-extrabold" style={{ ...HEAD, color: MAU.ink }}>{tenNgan(hoTen)}</span>
      <BieuTuongBac bac={bac} size={34} nho />
      <span className="flex gap-1">{khoe.slice(0, 3).map((k) => <HinhHuyHieu key={k.key} hhKey={k.key} sao={k.sao} size={30} kieu="nho" title={k.ten} />)}</span>
    </div>
  )
}

// ── CONTAINER ──
export default function HoSoHS({ hoTen, anhUrl, avatar, mons, mon, onChonMon, onBack, onRank, onAlbum }: {
  hoTen: string; anhUrl: string | null; avatar?: ReactNode
  mons: LopMonHS[]; mon: string | null; onChonMon: (m: string) => void
  onBack: () => void; onRank?: () => void; onAlbum?: () => void
}) {
  const [rank, setRank] = useState<RankCuaToi | null | undefined>(undefined)
  const [nv, setNv] = useState<NhiemVuCuaToi | null>(null)
  const [hs, setHs] = useState<HoSoGami | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [chonKhoe, setChonKhoe] = useState(false)

  // Đổi MÔN = đổi ngữ cảnh ⇒ reset + tải lại (CLAUDE §2). 3 nguồn tải song song, khối nào về trước vẽ trước.
  useEffect(() => {
    if (!mon) return
    setRank(undefined); setNv(null); setHs(null); setLoi(null)
    const baoLoi = (e: any) => setLoi(e?.message ?? String(e))
    if (rankBat()) rankCuaToi(mon).then(setRank).catch((e) => { setRank(null); baoLoi(e) })
    else setRank(null) // Rank tạm khoá 06/10
    nhiemVuCuaToi(mon).then(setNv).catch(() => setNv(null))
    hoSoGamiCuaToi(mon).then(setHs).catch(baoLoi)
  }, [mon])

  return (
    <ManHS>
      <DauTrangHS tieuDe="Hồ sơ" phu={mon ?? undefined} onBack={onBack} phai={<NutDoHoa />} />
      {loi && <p className="px-4 py-3 text-[13px]" style={{ ...THE, color: MAU.sai }}>{loi}</p>}
      {rank === undefined && !loi
        ? <p className="px-4 py-5 text-center text-[13px]" style={{ ...THE, color: MAU.muted }}>Đang tải…</p>
        : <HoSoView hoTen={hoTen} anhUrl={anhUrl} avatar={avatar} mons={mons} mon={mon} onChonMon={onChonMon}
            rank={rank ?? null} nv={nv} hs={hs} onRank={onRank} onAlbum={onAlbum} onDoiKhoe={hs ? () => setChonKhoe(true) : undefined} />}
      {chonKhoe && hs && mon && (
        <ChonKhoe hs={hs} onHuy={() => setChonKhoe(false)}
          onLuu={async (keys) => { const moi = await datKhoe(mon, keys); setHs((h) => (h ? { ...h, khoe: moi } : h)); setChonKhoe(false) }} />
      )}
    </ManHS>
  )
}
