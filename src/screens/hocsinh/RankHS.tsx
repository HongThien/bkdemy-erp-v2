// ============================================================================
// RankHS — màn RANK của HS theo môn (spec-thanh-tuu-nhiem-vu.md §0.3, mig 202609281711 + 202609281754).
// Bậc mùa (10 bậc theo điểm tích luỹ; 9–10 = thần) + sao · hạng khối · Bảng đua tháng · Thử thách hôm nay/tháng · top khối · hành trình 10 bậc.
// Mọi con số lấy nguyên từ fn_hs_rank_cua_toi — ở đây chỉ trình bày.
// Card theo KIỂU 1 (CLAUDE.md §6): dải header màu + thân nền skin. Riêng thẻ bậc: màu header theo CHƯƠNG của bậc
// (Người thường đồng → Chiến binh bạc → Anh hùng vàng → Vương giả tím → Thần lửa) — màu GAME, giữ mọi skin.
// Tách VIEW (RankView) khỏi container để hs.html?xem=gami vẽ mọi trạng thái; biểu tượng bậc / sao / hào quang / màu chương
// lấy từ gami/hinh.ts + gami/HinhGami.tsx (đổi vỏ ở đó — DON-HANG-GAMI-HS.md Đơn 3).
// ============================================================================
import { useEffect, useState } from 'react'
import { rankCuaToi, type RankCuaToi } from '../../lib/rank'
import { monCuaHS } from '../../lib/tuluyen'
import { Khung, NutBack } from './TuLuyenChuDe'
import { MAU, THE, HEAD, NutHS } from './skin/KhungHS'
import { BAC, chuongCua, laThan as bacThan, MAU_GAMI } from './gami/hinh'
import { BieuTuongBac, SaoBac } from './gami/HinhGami'
import { ChucMungBac, bacChuaXem, daXemBac } from './gami/ChucMung'

const VANG_SAO = MAU_GAMI.sao // hạng top 3 — màu huy chương
const so = (n: number) => n.toLocaleString('vi-VN')
function labelThang(ym: string) { const [y, m] = ym.split('-'); return `tháng ${parseInt(m, 10)}/${y}` }
// Tên bậc (DB) → số bậc, để vẽ biểu tượng nhỏ cạnh tên trong bảng top.
const bacTheoTen = (ten: string) => BAC.find((b) => b.ten === ten)?.bac ?? 1

// mau = màu bậc (game, chữ trắng); bỏ trống = màu nhấn skin.
function Card({ mau, icon, tieuDe, children }: { mau?: string; icon: React.ReactNode; tieuDe: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden" style={THE}>
      <div className="flex items-center gap-2 px-4 py-2.5" style={mau ? { background: mau, color: MAU_GAMI.chu } : { background: MAU.acc, color: MAU.accInk }}>
        <span className="text-[20px] leading-none" aria-hidden>{icon}</span>
        <span className="text-[15.5px] font-extrabold tracking-tight" style={HEAD}>{tieuDe}</span>
      </div>
      <div className="px-4 py-3.5" style={{ color: MAU.ink }}>{children}</div>
    </div>
  )
}

function DongTop({ hang, ten, lop, bac, phai, laToi }: { hang: number; ten: string; lop: string; bac?: number; phai: React.ReactNode; laToi: boolean }) {
  return (
    <div className={`flex items-center gap-2 rounded-xl px-2 py-1.5 text-[14.5px] ${laToi ? 'font-bold' : ''}`}
      style={laToi ? { background: MAU.surface2, boxShadow: `inset 0 0 0 1px ${MAU.acc}` } : undefined}>
      <span className="w-6 shrink-0 text-center font-extrabold" style={{ color: hang <= 3 ? VANG_SAO : MAU.muted }}>{hang}</span>
      {bac && <BieuTuongBac bac={bac} size={24} nho />}
      <span className="min-w-0 flex-1 truncate">{ten} <span className="font-normal" style={{ color: MAU.muted }}>· {lop}</span></span>
      <span className="shrink-0 font-bold">{phai}</span>
    </div>
  )
}

// ── VIEW: chỉ vẽ. chucMung = bậc vừa lên cần chúc (null = không) ──
export function RankView({ d, onThuThach, chucMung, onDongChucMung }: {
  d: RankCuaToi; onThuThach?: () => void; chucMung?: number | null; onDongChucMung?: () => void
}) {
  const toi = d.toi
  if (!toi) return <p className="mt-6 px-4 py-5 text-center text-[14.5px]" style={{ ...THE, color: MAU.muted }}>Em chưa có điểm Rank mùa này.</p>
  const than = bacThan(toi.bac) || !!toi.ghe
  const chuong = chuongCua(toi.bac)
  const tenBac = toi.ghe ?? toi.ten_bac
  const bacSau = d.bac.find((b) => b.bac === toi.bac + 1)
  const tienDo = toi.nguong_sau ? Math.min(1, (toi.diem_mua - toi.nguong_bac) / (toi.nguong_sau - toi.nguong_bac)) : 1

  return (
    <>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Card mau={chuong.mau} icon="🏆" tieuDe={than ? 'Thần' : `Chương ${chuong.ten}`}>
          <div className="flex items-center gap-4">
            <BieuTuongBac bac={toi.bac} size={than ? 104 : 96} />
            <div className="min-w-0 flex-1">
              <p className="text-[28.5px] font-extrabold leading-none" style={HEAD}>{tenBac}</p>
              {!than && <div className="mt-1.5"><SaoBac n={toi.sao} size={20} /></div>}
              <p className="mt-2 text-[14.5px]"><b>{so(toi.diem_mua)}</b> Điểm Rank · hạng <b>{toi.hang_khoi}</b>/{toi.so_em_khoi} khối</p>
            </div>
          </div>
          {than && <p className="mt-2 text-[13px]" style={{ color: MAU.muted }}>Em đã tích đủ điểm để thành thần mùa này — giữ tới hết mùa.</p>}
          {bacSau && toi.nguong_sau != null && (
            <>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full" style={{ background: MAU.surface2 }}>
                <div className="h-full rounded-full" style={{ width: `${Math.round(tienDo * 100)}%`, background: chuong.mau }} />
              </div>
              <p className="mt-1 text-[12.5px]" style={{ color: MAU.muted }}>Còn {so(toi.nguong_sau - toi.diem_mua)} điểm lên {bacSau.ten}</p>
            </>
          )}
        </Card>

        <Card icon="🏁" tieuDe={`Bảng đua ${labelThang(d.thang)}`}>
          {d.dua_thang ? (
            <>
              <p className="text-[14.5px]"><b className="text-[22px]">{so(d.dua_thang.diem_thang)}</b> điểm · hạng <b>{d.dua_thang.hang}</b>/{d.dua_thang.so_em_co_diem}</p>
              <div className="mt-2 grid grid-cols-4 gap-1.5 text-center text-[12px]">
                {([['ET', d.dua_thang.et], ['BTVN', d.dua_thang.btvn], ['MT', d.dua_thang.mt], ['Thử thách', d.dua_thang.thu_thach]] as const).map(([k, v]) => (
                  <div key={k} className="rounded-xl py-1.5" style={{ background: MAU.surface2 }}><div className="text-[14.5px] font-extrabold">{so(v)}</div><div style={{ color: MAU.muted }}>{k}</div></div>
                ))}
              </div>
              <p className="mt-2 text-[12px]" style={{ color: MAU.muted }}>MT của tháng này thi đầu tháng sau nên cộng sau. Bảng tháng không đổi bậc.</p>
            </>
          ) : <p className="text-[14.5px]" style={{ color: MAU.muted }}>Tháng này em chưa có điểm — đi học, làm BTVN, làm Thử thách để vào bảng.</p>}
        </Card>

        <Card icon="⚔️" tieuDe="Thử thách">
          <p className="text-[14.5px]">Hôm nay <b>{d.thu_thach.hom_nay}</b>/{d.thu_thach.tran_ngay} điểm · tháng này <b>{d.thu_thach.thang}</b>/{d.thu_thach.tran_thang}</p>
          <p className="mt-1 text-[12.5px]" style={{ color: MAU.muted }}>Đúng 8 / 9 / 10 câu = 10 / 20 / 30 điểm. Làm bao nhiêu lượt cũng được, điểm có trần mỗi ngày.</p>
          {onThuThach && <NutHS onClick={onThuThach} className="mt-2.5 w-full">Làm Thử thách</NutHS>}
        </Card>

        <Card icon="🗺️" tieuDe="Hành trình mùa">
          <div className="flex flex-col gap-1">
            {[...d.bac].reverse().map((b) => {
              const hienTai = b.bac === toi.bac, daQua = b.bac < toi.bac
              return (
                <div key={b.bac} className={`flex items-center gap-2 rounded-lg px-2 py-1 text-[14px] ${hienTai ? 'font-extrabold' : ''}`}
                  style={hienTai ? { background: MAU.surface2, color: MAU.acc } : { color: daQua ? MAU.ink : MAU.muted }}>
                  <span style={{ opacity: b.bac > toi.bac ? 0.35 : 1, filter: b.bac > toi.bac ? 'grayscale(1)' : 'none' }}><BieuTuongBac bac={b.bac} size={26} nho /></span>
                  <span className="flex-1">{b.ten}</span><span>{so(b.nguong)}</span>
                </div>
              )
            })}
            <p className="mt-1 text-[12px]" style={{ color: MAU.muted }}>2 bậc thần trên cùng chỉ dành cho ai tích đủ điểm cả năm — có năm không ai đạt.</p>
          </div>
        </Card>

        <Card icon="👑" tieuDe={`Top khối ${d.khoi} — mùa`}>
          {d.top_mua.map((r) => <DongTop key={r.hang + r.ho_ten} hang={r.hang} ten={r.ho_ten} lop={r.ten_lop} bac={bacTheoTen(r.ten_bac)}
            phai={bacThan(bacTheoTen(r.ten_bac)) ? r.ten_bac : <span className="inline-flex items-center gap-1">{r.ten_bac} <SaoBac n={r.sao} size={11} /></span>} laToi={r.la_toi} />)}
        </Card>

        <Card icon="🥇" tieuDe={`Top khối ${d.khoi} — ${labelThang(d.thang)}`}>
          {d.top_dua_thang.length
            ? d.top_dua_thang.map((r) => <DongTop key={r.hang + r.ho_ten} hang={r.hang} ten={r.ho_ten} lop={r.ten_lop} phai={so(r.diem)} laToi={r.la_toi} />)
            : <p className="text-[14.5px]" style={{ color: MAU.muted }}>Chưa có ai có điểm tháng này.</p>}
        </Card>
      </div>
      {chucMung && onDongChucMung && <ChucMungBac bac={chucMung} ten={d.bac.find((b) => b.bac === chucMung)?.ten ?? tenBac} onDong={onDongChucMung} />}
    </>
  )
}

export default function RankHS({ gioiTinh, onBack, onThuThach }: { gioiTinh: 'nam' | 'nu' | null; onBack: () => void; onThuThach?: () => void }) {
  const [d, setD] = useState<RankCuaToi | null>(null)
  const [state, setState] = useState<'dang_tai' | 'san_sang' | 'trong' | 'loi'>('dang_tai')
  const [err, setErr] = useState<string | null>(null)
  const [chuc, setChuc] = useState<number | null>(null)

  useEffect(() => {
    monCuaHS().then((m) => (m ? rankCuaToi(m) : null))
      .then((r) => { setD(r); setState(r ? 'san_sang' : 'trong'); if (r?.toi) setChuc(bacChuaXem(r.mon, r.toi.bac)) })
      .catch((e) => { setErr(e?.message ?? String(e)); setState('loi') })
  }, [])

  return (
    <Khung gioiTinh={gioiTinh}>
      <NutBack onBack={onBack} />
      <h1 className="text-[24px] font-extrabold leading-tight tracking-tight" style={{ ...HEAD, color: MAU.ink, textShadow: '0 1px 8px var(--sk-bg)' }}>Rank {d?.mon ?? ''}</h1>
      <p className="mt-1 text-[14.5px]" style={{ color: MAU.muted, textShadow: '0 1px 8px var(--sk-bg)' }}>
        {d ? `Mùa này · khối ${d.khoi} · hành trình người thường → thần` : 'Hành trình người thường → thần'}
      </p>

      {state === 'dang_tai' && <p className="mt-6 px-4 py-5 text-center text-[14.5px]" style={{ ...THE, color: MAU.muted }}>Đang tải…</p>}
      {state === 'loi' && <p className="mt-6 px-4 py-5 text-center text-[14.5px]" style={{ ...THE, color: MAU.sai }}>{err}</p>}
      {state === 'trong' && <p className="mt-6 px-4 py-5 text-center text-[14.5px]" style={{ ...THE, color: MAU.muted }}>Rank chưa mở cho môn của em.</p>}

      {state === 'san_sang' && d && (
        <RankView d={d} onThuThach={onThuThach} chucMung={chuc}
          onDongChucMung={() => { if (d.toi) daXemBac(d.mon, d.toi.bac); setChuc(null) }} />
      )}
    </Khung>
  )
}
