/// ============================================================================
// AlbumHS — ALBUM HUY HIỆU của HS theo môn (spec-thanh-tuu-nhiem-vu.md §0.7 A5.3, mig 202609281846).
// 8 huy hiệu × 5 sao · "Sắp đạt" · N bạn trong khối có (< 10% = Hiếm) · checklist tháng này · lịch sử từng tháng.
// Số liệu nguyên từ fn_hs_album — ở đây chỉ trình bày. Card KIỂU 1 (CLAUDE.md §6): dải header màu + thân nền skin.
// Thùy 29/09: khung/chữ/thân thẻ theo skin (KhungHS); màu từng huy hiệu + vàng "hoàn hảo/bản cứng" là màu GAME, giữ.
// ============================================================================
// Tách VIEW (AlbumView — chỉ vẽ từ 1 object Album) khỏi container (gọi RPC) để màn xem mẫu hs.html?xem=gami vẽ mọi trạng thái
// bằng dữ liệu giả; hình + màu huy hiệu lấy từ gami/hinh.ts (đổi vỏ ở đó, không sửa màn).
import { useEffect, useState } from 'react'
import { albumCuaToi, type Album, type AlbumHuyHieu } from '../../lib/huyhieu'
import { monCuaHS } from '../../lib/tuluyen'
import { Khung, NutBack } from './TuLuyenChuDe'
import { MAU, THE, HEAD } from './skin/KhungHS'
import { mauHH, MAU_CHUA_DAT, VANG, VANG_NEN, MAU_GAMI } from './gami/hinh'
import { HinhHuyHieu } from './gami/HinhGami'
import { ChucMungSao, saoChuaXem, daXemHetSao, type SaoMoi } from './gami/ChucMung'
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
      <button onClick={onMo} className="flex w-full items-center gap-2.5 px-3 py-2 text-left" style={{ color: MAU_GAMI.chu, background: h.sao ? mauHH(h.key).mau : MAU_CHUA_DAT }}>
        <HinhHuyHieu hhKey={h.key} sao={h.sao} size={48} kieu="nho" title={h.ten} />
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
              <div className="h-full rounded-full" style={{ width: `${Math.round(100 * Math.min(1, k.co / k.ke.so_thang))}%`, background: mauHH(h.key).mau }} />
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

// ── VIEW: chỉ vẽ. mo/onMo do cha giữ; chucMung = sao mới cần chúc (null = không) ──
export function AlbumView({ al, mo, onMo, chucMung, onDongChucMung }: {
  al: Album; mo: string | null; onMo: (key: string) => void; chucMung?: SaoMoi | null; onDongChucMung?: () => void
}) {
  const sapDat = al.huy_hieu.map((h) => ({ h, k: saoKe(h, al) })).filter((x) => x.k && x.k.con > 0 && x.k.con <= 2)
    .sort((a, b) => a.k!.con - b.k!.con).slice(0, 3)
  return (
    <>
      {sapDat.length > 0 && (
        <div className="mt-4 p-3.5" style={THE}>
          <p className="text-[12px] font-extrabold uppercase tracking-wide" style={{ color: MAU.acc }}>⏳ Sắp đạt</p>
          {sapDat.map(({ h, k }) => (
            <p key={h.key} className="mt-1.5 flex items-center gap-2 text-[13px]" style={{ color: MAU.ink }}>
              <HinhHuyHieu hhKey={h.key} sao={h.sao} size={26} kieu="nho" />
              <span><b>{h.ten} ★{k!.ke.sao}</b> — còn {k!.con} tháng {k!.ke.loai === 'chuan' ? 'đạt chuẩn' : 'hoàn hảo'}</span>
            </p>
          ))}
        </div>
      )}
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {al.huy_hieu.map((h) => <TheHuyHieu key={h.key} h={h} al={al} mo={mo === h.key} onMo={() => onMo(h.key)} />)}
      </div>
      {chucMung && onDongChucMung && <ChucMungSao s={chucMung} onDong={onDongChucMung} />}
    </>
  )
}

export function tieuDeAlbum(al: Album | null) {
  const tongSao = al ? al.huy_hieu.reduce((s, h) => s + h.sao, 0) : 0   // đếm sao đang hiển thị (badge)
  return al ? `Mùa ${al.mua} · album ${tongSao}/${al.huy_hieu.length * 5} sao · ★4–★5 được trung tâm tặng bản cứng` : 'Sưu tầm huy hiệu qua từng tháng học'
}

export default function AlbumHS({ gioiTinh, onBack }: { gioiTinh: 'nam' | 'nu' | null; onBack: () => void }) {
  const [al, setAl] = useState<Album | null>(null)
  const [state, setState] = useState<'dang_tai' | 'san_sang' | 'trong' | 'loi'>('dang_tai')
  const [err, setErr] = useState<string | null>(null)
  const [mo, setMo] = useState<string | null>(null)
  const [chuc, setChuc] = useState<SaoMoi | null>(null)

  useEffect(() => {
    monCuaHS().then((m) => (m ? albumCuaToi(m) : null))
      .then((r) => { setAl(r); setState(r ? 'san_sang' : 'trong'); if (r) setChuc(saoChuaXem(r)) })
      .catch((e) => { setErr(e?.message ?? String(e)); setState('loi') })
  }, [])

  return (
    <Khung gioiTinh={gioiTinh}>
      <NutBack onBack={onBack} />
      <h1 className="text-[22px] font-extrabold leading-tight tracking-tight" style={{ ...HEAD, color: MAU.ink, textShadow: '0 1px 8px var(--sk-bg)' }}>Huy hiệu {al?.mon ?? ''}</h1>
      <p className="mt-1 text-[13px]" style={{ color: MAU.muted, textShadow: '0 1px 8px var(--sk-bg)' }}>{tieuDeAlbum(al)}</p>

      {state === 'dang_tai' && <p className="mt-6 px-4 py-5 text-center text-[13px]" style={{ ...THE, color: MAU.muted }}>Đang tải…</p>}
      {state === 'loi' && <p className="mt-6 px-4 py-5 text-center text-[13px]" style={{ ...THE, color: MAU.sai }}>{err}</p>}
      {state === 'trong' && <p className="mt-6 px-4 py-5 text-center text-[13px]" style={{ ...THE, color: MAU.muted }}>Huy hiệu chưa mở cho môn của em.</p>}

      {state === 'san_sang' && al && (
        <AlbumView al={al} mo={mo} onMo={(k) => setMo((x) => (x === k ? null : k))}
          chucMung={chuc} onDongChucMung={() => { daXemHetSao(al); setChuc(null) }} />
      )}
    </Khung>
  )
}
