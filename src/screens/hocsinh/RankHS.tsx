// ============================================================================
// RankHS — màn RANK của HS theo môn (spec-thanh-tuu-nhiem-vu.md §0.3, mig 202609281711).
// Bậc mùa + sao · hạng khối · Bảng đua tháng · Thử thách hôm nay/tháng · top khối · hành trình 8 bậc.
// Mọi con số lấy nguyên từ fn_hs_rank_cua_toi — ở đây chỉ trình bày.
// Card theo KIỂU 1 (CLAUDE.md §6): dải header màu + thân trắng. Màu header theo CHƯƠNG của bậc
// (phan-tich-diem-rank.md "Tên gọi"): Người thường đồng → Chiến binh bạc → Anh hùng vàng → Vương giả tím → Thần lửa.
// ============================================================================
import { useEffect, useState } from 'react'
import { rankCuaToi, type RankCuaToi } from '../../lib/rank'
import { monCuaHS } from '../../lib/tuluyen'
import { Khung, NutBack, THEME } from './TuLuyenChuDe'

const NAVY = '#0F1745'
const CHUONG: { tu: number; ten: string; mau: string }[] = [
  { tu: 1, ten: 'Người thường', mau: 'linear-gradient(135deg,#B87333,#8C5523)' },
  { tu: 2, ten: 'Chiến binh', mau: 'linear-gradient(135deg,#8E9BB3,#5F6B85)' },
  { tu: 5, ten: 'Anh hùng', mau: 'linear-gradient(135deg,#E0B01E,#B8860B)' },
  { tu: 7, ten: 'Vương giả', mau: 'linear-gradient(135deg,#8B4DE8,#5B2BB5)' },
]
const MAU_THAN = 'linear-gradient(135deg,#FF7A18,#D7263D 55%,#7B2FF7)'
function chuongCua(bac: number) { return [...CHUONG].reverse().find((c) => bac >= c.tu) ?? CHUONG[0] }
const so = (n: number) => n.toLocaleString('vi-VN')
const sao = (n: number) => '★'.repeat(n) + '☆'.repeat(Math.max(0, 3 - n))
function labelThang(ym: string) { const [y, m] = ym.split('-'); return `tháng ${parseInt(m, 10)}/${y}` }

function Card({ mau, icon, tieuDe, children }: { mau: string; icon: string; tieuDe: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[22px] bg-white" style={{ boxShadow: '0 8px 24px rgba(76,108,170,.12)' }}>
      <div className="flex items-center gap-2 px-4 py-2.5 text-white" style={{ background: mau }}>
        <span className="text-[18px]" aria-hidden>{icon}</span>
        <span className="text-[14px] font-extrabold tracking-tight">{tieuDe}</span>
      </div>
      <div className="px-4 py-3.5" style={{ color: NAVY }}>{children}</div>
    </div>
  )
}

function DongTop({ hang, ten, lop, phai, laToi }: { hang: number; ten: string; lop: string; phai: string; laToi: boolean }) {
  return (
    <div className={`flex items-center gap-2 rounded-xl px-2 py-1.5 text-[13px] ${laToi ? 'bg-[#EEF4FF] font-bold' : ''}`}>
      <span className="w-6 shrink-0 text-center font-extrabold" style={{ color: hang <= 3 ? '#D4A017' : '#8792B5' }}>{hang}</span>
      <span className="min-w-0 flex-1 truncate">{ten} <span className="font-normal opacity-50">· {lop}</span></span>
      <span className="shrink-0 font-bold">{phai}</span>
    </div>
  )
}

export default function RankHS({ gioiTinh, onBack, onThuThach }: { gioiTinh: 'nam' | 'nu' | null; onBack: () => void; onThuThach?: () => void }) {
  const [d, setD] = useState<RankCuaToi | null>(null)
  const [state, setState] = useState<'dang_tai' | 'san_sang' | 'trong' | 'loi'>('dang_tai')
  const [err, setErr] = useState<string | null>(null)
  const t = THEME[gioiTinh === 'nu' ? 'nu' : 'nam']

  useEffect(() => {
    monCuaHS().then((m) => (m ? rankCuaToi(m) : null))
      .then((r) => { setD(r); setState(r ? 'san_sang' : 'trong') })
      .catch((e) => { setErr(e?.message ?? String(e)); setState('loi') })
  }, [])

  const toi = d?.toi
  const laThan = !!toi?.ghe
  const chuong = toi ? chuongCua(toi.bac) : CHUONG[0]
  const bacSau = toi && d ? d.bac.find((b) => b.bac === toi.bac + 1) : undefined
  const tienDo = toi && toi.nguong_sau ? Math.min(1, (toi.diem_mua - toi.nguong_bac) / (toi.nguong_sau - toi.nguong_bac)) : 1

  return (
    <Khung gioiTinh={gioiTinh}>
      <NutBack onBack={onBack} />
      <h1 className="text-[22px] font-extrabold leading-tight tracking-tight" style={{ color: NAVY }}>Rank {d?.mon ?? ''}</h1>
      <p className="mt-1 text-[13px]" style={{ color: t.sec }}>
        {d ? `Mùa này · khối ${d.khoi} · hành trình người thường → thần` : 'Hành trình người thường → thần'}
      </p>

      {state === 'dang_tai' && <p className="mt-8 text-center text-[13px]" style={{ color: t.sec }}>Đang tải…</p>}
      {state === 'loi' && <p className="mt-8 text-center text-[13px] text-ph-red">{err}</p>}
      {state === 'trong' && <p className="mt-8 text-center text-[13px]" style={{ color: t.sec }}>Rank chưa mở cho môn của em.</p>}

      {state === 'san_sang' && d && toi && (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Card mau={laThan ? MAU_THAN : chuong.mau} icon={laThan ? '🔥' : '🏆'} tieuDe={laThan ? 'Thần' : `Chương ${chuong.ten}`}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[26px] font-extrabold leading-none">{toi.ghe ?? toi.ten_bac}</span>
              {!laThan && <span className="text-[20px] leading-none" style={{ color: '#E0B01E' }}>{sao(toi.sao)}</span>}
            </div>
            {laThan && <p className="mt-1 text-[12px] opacity-60">Ghế thần xét lại mỗi ngày — giữ phong độ để ngồi tiếp. Bậc gốc: {toi.ten_bac} {sao(toi.sao)}</p>}
            <p className="mt-2 text-[13px]"><b>{so(toi.diem_mua)}</b> Điểm Rank mùa này · hạng <b>{toi.hang_khoi}</b>/{toi.so_em_khoi} khối</p>
            {bacSau && toi.nguong_sau != null && (
              <>
                <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-[#EDF0F7]">
                  <div className="h-full rounded-full" style={{ width: `${Math.round(tienDo * 100)}%`, background: chuong.mau }} />
                </div>
                <p className="mt-1 text-[11.5px] opacity-60">Còn {so(toi.nguong_sau - toi.diem_mua)} điểm lên {bacSau.ten}</p>
              </>
            )}
          </Card>

          <Card mau="linear-gradient(135deg,#1673D8,#2A4BC4)" icon="🏁" tieuDe={`Bảng đua ${labelThang(d.thang)}`}>
            {d.dua_thang ? (
              <>
                <p className="text-[13px]"><b className="text-[20px]">{so(d.dua_thang.diem_thang)}</b> điểm · hạng <b>{d.dua_thang.hang}</b>/{d.dua_thang.so_em_co_diem}</p>
                <div className="mt-2 grid grid-cols-4 gap-1.5 text-center text-[11px]">
                  {([['ET', d.dua_thang.et], ['BTVN', d.dua_thang.btvn], ['MT', d.dua_thang.mt], ['Thử thách', d.dua_thang.thu_thach]] as const).map(([k, v]) => (
                    <div key={k} className="rounded-xl bg-[#F4F7FC] py-1.5"><div className="font-extrabold text-[13px]">{so(v)}</div><div className="opacity-60">{k}</div></div>
                  ))}
                </div>
                <p className="mt-2 text-[11px] opacity-55">MT của tháng này thi đầu tháng sau nên cộng sau. Bảng tháng không đổi bậc.</p>
              </>
            ) : <p className="text-[13px] opacity-70">Tháng này em chưa có điểm — đi học, làm BTVN, làm Thử thách để vào bảng.</p>}
          </Card>

          <Card mau="linear-gradient(135deg,#F2663B,#E23A6B)" icon="⚔️" tieuDe="Thử thách">
            <p className="text-[13px]">Hôm nay <b>{d.thu_thach.hom_nay}</b>/{d.thu_thach.tran_ngay} điểm · tháng này <b>{d.thu_thach.thang}</b>/{d.thu_thach.tran_thang}</p>
            <p className="mt-1 text-[11.5px] opacity-60">Đúng 8 / 9 / 10 câu = 10 / 20 / 30 điểm. Làm bao nhiêu lượt cũng được, điểm có trần mỗi ngày.</p>
            {onThuThach && (
              <button onClick={onThuThach} className="mt-2.5 w-full rounded-xl py-2.5 text-[14px] font-bold text-white" style={{ background: 'linear-gradient(135deg,#F2663B,#E23A6B)' }}>
                Làm Thử thách
              </button>
            )}
          </Card>

          <Card mau="linear-gradient(135deg,#3A4A7A,#1F2B55)" icon="🗺️" tieuDe="Hành trình mùa">
            <div className="flex flex-col gap-1">
              {[...d.bac].reverse().map((b) => (
                <div key={b.bac} className={`flex items-center justify-between rounded-lg px-2 py-1 text-[12.5px] ${b.bac === toi.bac ? 'bg-[#EEF4FF] font-extrabold' : 'opacity-70'}`}>
                  <span>{b.bac === toi.bac ? '▶ ' : ''}{b.ten}</span><span>{so(b.nguong)}</span>
                </div>
              ))}
              <p className="mt-1 text-[11px] opacity-55">Trên Emperor là 2 ghế thần: God of War (top 3% khối) · Supreme God (hạng 1) — cần phong độ cao cả mùa.</p>
            </div>
          </Card>

          <Card mau="linear-gradient(135deg,#E0B01E,#B8860B)" icon="👑" tieuDe={`Top khối ${d.khoi} — mùa`}>
            {d.top_mua.map((r) => <DongTop key={r.hang + r.ho_ten} hang={r.hang} ten={r.ho_ten} lop={r.ten_lop} phai={`${r.ten_bac}${r.ten_bac.includes('God') ? '' : ' ' + sao(r.sao)}`} laToi={r.la_toi} />)}
          </Card>

          <Card mau="linear-gradient(135deg,#1673D8,#2A4BC4)" icon="🥇" tieuDe={`Top khối ${d.khoi} — ${labelThang(d.thang)}`}>
            {d.top_dua_thang.length
              ? d.top_dua_thang.map((r) => <DongTop key={r.hang + r.ho_ten} hang={r.hang} ten={r.ho_ten} lop={r.ten_lop} phai={so(r.diem)} laToi={r.la_toi} />)
              : <p className="text-[13px] opacity-70">Chưa có ai có điểm tháng này.</p>}
          </Card>
        </div>
      )}
    </Khung>
  )
}
