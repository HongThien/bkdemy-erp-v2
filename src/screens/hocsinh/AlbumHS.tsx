/// ============================================================================
// AlbumHS — ALBUM HUY HIỆU của HS theo môn (spec-thanh-tuu-nhiem-vu.md §0.7 A5.3, mig 202609281846).
// 8 huy hiệu × 5 sao · "Sắp đạt" · N bạn trong khối có (< 10% = Hiếm) · checklist tháng này · lịch sử từng tháng.
// Số liệu nguyên từ fn_hs_album — ở đây chỉ trình bày. Card KIỂU 1 (CLAUDE.md §6): dải header màu + thân nền skin.
// Thùy 29/09: khung/chữ/thân thẻ theo skin (KhungHS); màu từng huy hiệu + vàng "hoàn hảo/bản cứng" là màu GAME, giữ.
// ============================================================================
import { useEffect, useState } from 'react'
import { albumCuaToi, type Album, type AlbumHuyHieu } from '../../lib/huyhieu'
import { monCuaHS } from '../../lib/tuluyen'
import { Khung, NutBack } from './TuLuyenChuDe'
import { MAU, THE, HEAD } from './skin/KhungHS'

// Màu riêng từng huy hiệu (màu game — cố định mọi skin, chữ trắng trên dải màu đậm).
const MAU_HH: Record<string, string> = {
  helios: 'linear-gradient(135deg,#FFB020,#F57C00)', chronos: 'linear-gradient(135deg,#5C6BC0,#3949AB)',
  athena: 'linear-gradient(135deg,#26A69A,#00796B)', zeus: 'linear-gradient(135deg,#FFD54F,#F9A825)',
  phoenix: 'linear-gradient(135deg,#FF7043,#D84315)', hercules: 'linear-gradient(135deg,#8D6E63,#5D4037)',
  hephaestus: 'linear-gradient(135deg,#78909C,#455A64)', nike: 'linear-gradient(135deg,#AB47BC,#7B1FA2)',
}
const CHUA_DAT = 'linear-gradient(135deg,#B0B7C9,#8E97AD)' // dải xám = huy hiệu chưa có sao
const VANG = '#C9950F'                                      // hoàn hảo / bản cứng / Hiếm — màu game
const VANG_NEN = 'rgba(233,170,30,0.18)'
const sao5 = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)
const thangNgan = (ym: string) => `T${Number(ym.slice(5))}`
const KQ: Record<string, { t: string; c: string; o?: number }> = {
  dat: { t: '✓', c: MAU.dung }, khong_dat: { t: '☐', c: MAU.muted }, khong_ap_dung: { t: '–', c: MAU.muted, o: 0.5 },
}

// Tiến độ tới sao kế (từ số tháng DB đã đếm) — chỉ để hiển thị.
function saoKe(h: AlbumHuyHieu, al: Album) {
  const ke = al.thang_sao.find((s) => s.sao === h.sao + 1)
  if (!ke) return null
  const co = ke.loai === 'chuan' ? h.n_chuan : h.n_hoan_hao
  return { ke, co, con: Math.max(0, ke.so_thang - co) }
}

function TheHuyHieu({ h, al, mo, onMo }: { h: AlbumHuyHieu; al: Album; mo: boolean; onMo: () => void }) {
  const k = saoKe(h, al)
  const cao = h.dat.length ? h.dat[h.dat.length - 1] : null
  const hiem = cao && al.si_so_khoi > 0 && cao.so_ban_khoi / al.si_so_khoi < 0.1
  return (
    <div className="overflow-hidden" style={{ ...THE, opacity: h.sao ? 1 : 0.92 }}>
      <button onClick={onMo} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-white" style={{ background: h.sao ? MAU_HH[h.key] ?? MAU_HH.nike : CHUA_DAT }}>
        <span className="text-[22px]" aria-hidden style={{ filter: h.sao ? 'none' : 'grayscale(1)' }}>{h.bieu_tuong}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-extrabold leading-tight" style={HEAD}>{h.ten}</span>
          <span className="block text-[11px] opacity-85">{h.ghi_nhan}</span>
        </span>
        <span className="shrink-0 text-[15px] tracking-tight">{sao5(h.sao)}</span>
      </button>
      <div className="px-4 py-3 text-[12.5px]" style={{ color: MAU.ink }}>
        {k ? (
          <>
            <div className="flex justify-between">
              <span>Tới <b>★{k.ke.sao}</b>: {k.co}/{k.ke.so_thang} tháng {k.ke.loai === 'chuan' ? 'đạt chuẩn' : 'hoàn hảo'}</span>
              {k.ke.ban_cung && <span className="text-[11px] font-bold" style={{ color: VANG }}>🎖 bản cứng</span>}
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full" style={{ background: MAU.surface2 }}>
              <div className="h-full rounded-full" style={{ width: `${Math.round(100 * Math.min(1, k.co / k.ke.so_thang))}%`, background: MAU_HH[h.key] ?? MAU_HH.nike }} />
            </div>
            {h.n_chuan_tam > 0 && <p className="mt-1 text-[11px]" style={{ color: MAU.muted }}>Có tháng đang tạm tính — chốt ngày 10 tháng sau.</p>}
          </>
        ) : <p className="font-bold" style={{ color: MAU.dung }}>Đã đủ 5 sao mùa này 🎉</p>}
        {cao && (
          <p className="mt-1.5 text-[11.5px]" style={{ color: MAU.muted }}>
            {cao.so_ban_khoi}/{al.si_so_khoi} bạn trong khối có ★{cao.sao}{hiem && <b className="ml-1 rounded px-1.5 py-0.5" style={{ background: VANG_NEN, color: VANG }}>Hiếm</b>}
            {cao.lan > 1 && <b className="ml-1">×{cao.lan}</b>}
            {cao.sao >= 4 && <span className="ml-1">· {cao.da_trao ? 'đã nhận bản cứng' : 'chờ thầy cô trao bản cứng'}</span>}
          </p>
        )}
        {mo && (
          <div className="mt-2.5 border-t pt-2.5" style={{ borderColor: MAU.line }}>
            {h.cau_chuyen && <p className="mb-2 text-[11.5px] italic" style={{ color: MAU.muted }}>{h.cau_chuyen}</p>}
            <p className="mb-1 text-[11px] font-extrabold uppercase tracking-wide" style={{ color: MAU.muted }}>Tháng này</p>
            {h.thang_nay.map((x) => {
              const kq = KQ[x.ket_qua ?? 'khong_dat']
              return (
                <div key={x.key} className="flex items-center gap-2 py-0.5">
                  <span className="w-4 text-center font-bold" style={{ color: kq.c, opacity: kq.o ?? 1 }}>{kq.t}</span>
                  <span className="min-w-0 flex-1">{x.ten}</span>
                  <span className="shrink-0 text-[10.5px]" style={{ color: MAU.muted }}>{x.vai === 'chuan' ? 'chuẩn' : '★4–5'}</span>
                </div>
              )
            })}
            <p className="mb-1 mt-2 text-[11px] font-extrabold uppercase tracking-wide" style={{ color: MAU.muted }}>Các tháng</p>
            <div className="flex flex-wrap gap-1">
              {h.lich_su.map((m) => (
                <span key={m.thang} className="rounded-lg px-1.5 py-0.5 text-[11px] font-bold"
                  style={{ background: m.hoan_hao ? VANG_NEN : m.chuan ? 'rgba(34,160,107,0.16)' : MAU.surface2, color: m.hoan_hao ? VANG : m.chuan ? MAU.dung : MAU.muted }}>
                  {thangNgan(m.thang)}{m.hoan_hao ? ' ★' : m.chuan ? ' ✓' : m.chuan === null ? ' –' : ''}{m.da_chot ? '' : '*'}
                </span>
              ))}
            </div>
            <p className="mt-1 text-[10.5px]" style={{ color: MAU.muted }}>✓ đạt chuẩn · ★ hoàn hảo · – chưa áp dụng · * đang tạm tính</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AlbumHS({ gioiTinh, onBack }: { gioiTinh: 'nam' | 'nu' | null; onBack: () => void }) {
  const [al, setAl] = useState<Album | null>(null)
  const [state, setState] = useState<'dang_tai' | 'san_sang' | 'trong' | 'loi'>('dang_tai')
  const [err, setErr] = useState<string | null>(null)
  const [mo, setMo] = useState<string | null>(null)

  useEffect(() => {
    monCuaHS().then((m) => (m ? albumCuaToi(m) : null))
      .then((r) => { setAl(r); setState(r ? 'san_sang' : 'trong') })
      .catch((e) => { setErr(e?.message ?? String(e)); setState('loi') })
  }, [])

  const tongSao = al ? al.huy_hieu.reduce((s, h) => s + h.sao, 0) : 0   // đếm sao đang hiển thị (badge)
  const sapDat = al ? al.huy_hieu.map((h) => ({ h, k: saoKe(h, al) })).filter((x) => x.k && x.k.con > 0 && x.k.con <= 2)
    .sort((a, b) => a.k!.con - b.k!.con).slice(0, 3) : []

  return (
    <Khung gioiTinh={gioiTinh}>
      <NutBack onBack={onBack} />
      <h1 className="text-[22px] font-extrabold leading-tight tracking-tight" style={{ ...HEAD, color: MAU.ink, textShadow: '0 1px 8px var(--sk-bg)' }}>Huy hiệu {al?.mon ?? ''}</h1>
      <p className="mt-1 text-[13px]" style={{ color: MAU.muted, textShadow: '0 1px 8px var(--sk-bg)' }}>
        {al ? `Mùa ${al.mua} · album ${tongSao}/${al.huy_hieu.length * 5} sao · ★4–★5 được trung tâm tặng bản cứng` : 'Sưu tầm huy hiệu qua từng tháng học'}
      </p>

      {state === 'dang_tai' && <p className="mt-6 px-4 py-5 text-center text-[13px]" style={{ ...THE, color: MAU.muted }}>Đang tải…</p>}
      {state === 'loi' && <p className="mt-6 px-4 py-5 text-center text-[13px]" style={{ ...THE, color: MAU.sai }}>{err}</p>}
      {state === 'trong' && <p className="mt-6 px-4 py-5 text-center text-[13px]" style={{ ...THE, color: MAU.muted }}>Huy hiệu chưa mở cho môn của em.</p>}

      {state === 'san_sang' && al && (
        <>
          {sapDat.length > 0 && (
            <div className="mt-4 p-3.5" style={THE}>
              <p className="text-[12px] font-extrabold uppercase tracking-wide" style={{ color: MAU.acc }}>⏳ Sắp đạt</p>
              {sapDat.map(({ h, k }) => (
                <p key={h.key} className="mt-1 text-[13px]" style={{ color: MAU.ink }}>{h.bieu_tuong} <b>{h.ten} ★{k!.ke.sao}</b> — còn {k!.con} tháng {k!.ke.loai === 'chuan' ? 'đạt chuẩn' : 'hoàn hảo'}</p>
              ))}
            </div>
          )}
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {al.huy_hieu.map((h) => <TheHuyHieu key={h.key} h={h} al={al} mo={mo === h.key} onMo={() => setMo((x) => (x === h.key ? null : h.key))} />)}
          </div>
        </>
      )}
    </Khung>
  )
}
