// SÂN KHẤU 2D dùng chung cho 3 tầng bản đồ (thế giới / lục địa / chặng) — Thùy 01/10 khuya: ảnh tĩnh ChatGPT vẽ + hiệu ứng bằng code.
// · Khung chuẩn 16:9 (đúng nền 1672×941) đặt "contain" giữa màn; phần thừa phủ nền cùng màu ⇒ không méo, không cắt mốc.
//   Màn dọc (điện thoại cầm dọc) ⇒ khung 9:16 và XOAY bố cục (đổi x↔y) — cùng một bộ toạ độ, không phải làm bố cục riêng.
// · Hiệu ứng chỉ đụng transform/opacity (rẻ cho iPad gen 7); mức đồ hoạ Thấp hoặc máy bật "giảm chuyển động" ⇒ tắt hết chuyển động nền.
// · Màu lấy từ bảng màu của style (`b`), không gõ màu trong file này.
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { BangMau3D } from '../../skin/the3d/kieuMau'
import { TEN_LOAI } from '../../skin/the3d/loai'
import { laySkin } from '../../skin/registry'
import { anhChay } from '../../skin/heroChay'
import { useDoHoa } from '../DoHoa'
import type { Diem } from './boCuc'

export type Khung = { w: number; h: number; doc: boolean }

/** Đo ô chứa ⇒ kích thước khung 16:9 (hoặc 9:16 khi màn dọc) lớn nhất vừa trong ô.
 *  `tuDo`: khung = đúng cả ô (cảnh nhìn ngang như chặng đường — xoay 90° thì mặt đất thành dọc, vô nghĩa).
 *  `khongXoay`: luôn 16:9 kể cả màn dọc (bức tranh vẽ sẵn toàn cảnh — không xoay được). */
export function useKhung2D(tuDo = false, khongXoay = false): { ref: React.RefObject<HTMLDivElement>; khung: Khung } {
  const ref = useRef<HTMLDivElement>(null)
  const [khung, setKhung] = useState<Khung>({ w: 0, h: 0, doc: false })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const tinh = () => {
      const W = el.clientWidth, H = el.clientHeight, doc = !khongXoay && H > W * 1.15
      if (tuDo) { setKhung((k) => (k.w === W && k.h === H && !k.doc ? k : { w: W, h: H, doc: false })); return }
      const r = doc ? 941 / 1672 : 1672 / 941
      const w = Math.min(W, H * r), h = w / r
      setKhung((k) => (k.w === w && k.h === h && k.doc === doc ? k : { w, h, doc }))
    }
    tinh()
    const ro = new ResizeObserver(tinh); ro.observe(el)
    return () => ro.disconnect()
  }, [tuDo, khongXoay])
  return { ref, khung }
}

/** Điểm chuẩn hoá (khung ngang) → px trong khung đang vẽ (xoay khi dọc). */
export const viTri = (d: Diem, k: Khung) => (k.doc ? { x: d.y * k.w, y: d.x * k.h } : { x: d.x * k.w, y: d.y * k.h })
/** Đổi danh sách điểm sang hệ khung đang vẽ (để vẽ đường): trả về điểm chuẩn hoá theo khung hiện tại. */
export const xoay = (ds: Diem[], k: Khung): Diem[] => (k.doc ? ds.map((d) => ({ x: d.y, y: d.x })) : ds)

/** Chuyển động nền bật hay tắt (mức Thấp tắt). Dùng làm data-attribute cho CSS. */
export function useChuyenDong(): boolean {
  return useDoHoa().muc !== 'thap'
}

/** Tên quái không kéo three (nguonQuai.ts import three). Cùng luật: boss riêng của style trước, rồi bảng TEN_LOAI. */
export const tenQuai2D = (loai: string): string => laySkin(null).boss?.[loai]?.ten ?? TEN_LOAI[loai] ?? loai
export const anhBoss = (loai: string): string | null => laySkin(null).boss?.[loai]?.chandung ?? laySkin(null).boss?.[loai]?.dung ?? null
/** Ảnh đứng của NHÂN VẬT CHÍNH (nhà thám hiểm áo choàng xanh — skin/heroChay.ts). `nhanVat` của style là NPC dẫn truyện, KHÔNG dùng cho em. */
export const anhHero = (gioi: 'nam' | 'nu'): string | null => anhChay(gioi, 'dung')

/** Lớp nền chung: ảnh nền (nếu có) phủ kín, hoặc gradient biển đêm từ bảng màu; kèm sao lấp lánh + mây trôi + ánh nước. */
export function NenBien({ b, anh, may = true, sao = true, children }: { b: BangMau3D; anh?: string | null; may?: boolean; sao?: boolean; children?: ReactNode }) {
  const dong = useChuyenDong()
  return (
    <div className="ban2d absolute inset-0 overflow-hidden" data-dong={dong ? '1' : '0'}
      style={{ background: `radial-gradient(120% 90% at 50% 55%, ${b.nuocNong}55 0%, ${b.nuocSau} 45%, ${b.troi} 100%)` }}>
      {anh && <img src={anh} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />}
      {!anh && <div className="ban2d-anh-nuoc absolute -inset-[20%]" style={{ background: [[22, 30], [70, 24], [40, 70], [84, 66], [10, 82]].map(([x, y]) => `radial-gradient(18% 10% at ${x}% ${y}%, ${b.nuocNong}2e, transparent)`).join(',') }} />}
      {sao && <SaoLap mau={b.vang} />}
      {children}
      {may && <MayTroi mau={b.bot} />}
    </div>
  )
}

function SaoLap({ mau }: { mau: string }) {
  // 26 chấm sao, vị trí tất định
  const ds = Array.from({ length: 26 }, (_, i) => ({ x: (i * 37.7) % 100, y: (i * 61.3) % 100, d: (i % 7) * 0.45, s: i % 3 === 0 ? 3 : 2 }))
  return (
    <div className="pointer-events-none absolute inset-0">
      {ds.map((p, i) => <span key={i} className="ban2d-sao absolute rounded-full" style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, background: mau, animationDelay: `${p.d}s` }} />)}
    </div>
  )
}

function MayTroi({ mau }: { mau: string }) {
  const ds = [{ y: 8, w: 46, t: 70, d: 0, o: 0.16 }, { y: 62, w: 38, t: 90, d: -40, o: 0.12 }, { y: 84, w: 54, t: 110, d: -75, o: 0.1 }]
  return (
    <div className="pointer-events-none absolute inset-0">
      {ds.map((m, i) => (
        <span key={i} className="ban2d-may absolute rounded-[50%]" style={{ top: `${m.y}%`, left: `-${m.w}%`, width: `${m.w}%`, height: `${m.w * 0.22}%`, opacity: m.o, filter: 'blur(18px)', background: mau, animationDuration: `${m.t}s`, animationDelay: `${m.d}s` }} />
      ))}
    </div>
  )
}

/** Đám sương phủ lên mốc/lục địa chưa đo (hình tạm: 3 vầng mờ trôi nhẹ; có ảnh may_suong thì dùng ảnh). */
export function Suong({ mau, anh, style }: { mau: string; anh?: string | null; style?: CSSProperties }) {
  if (anh) return <img src={anh} alt="" className="ban2d-suong pointer-events-none absolute" style={style} draggable={false} />
  return (
    <span className="ban2d-suong pointer-events-none absolute" style={style}>
      {[[20, 35, 55], [45, 20, 60], [30, 55, 50]].map(([x, y, s], i) => (
        <span key={i} className="absolute rounded-full" style={{ left: `${x}%`, top: `${y}%`, width: `${s}%`, height: `${s * 0.7}%`, background: mau, opacity: 0.55, filter: 'blur(10px)' }} />
      ))}
    </span>
  )
}

/** Cờ chinh phục (hình tạm: cán + lá cờ màu nhấn của style, phấp phới). */
export function Co({ mau, anh, cao }: { mau: string; anh?: string | null; cao: number }) {
  if (anh) return <img src={anh} alt="" className="ban2d-co pointer-events-none" style={{ height: cao }} draggable={false} />
  return (
    <span className="pointer-events-none relative inline-block" style={{ width: cao * 0.7, height: cao }}>
      <span className="absolute bottom-0 left-[10%] rounded-full" style={{ width: Math.max(2, cao * 0.07), height: cao, background: 'var(--sk-ink)' }} />
      <span className="ban2d-co absolute left-[16%] top-[4%] origin-left" style={{ width: cao * 0.55, height: cao * 0.38, background: mau, clipPath: 'polygon(0 0,100% 18%,82% 50%,100% 82%,0 100%)' }} />
    </span>
  )
}

/** Token nhân vật chính của em (khung đứng của bộ chạy), nhấp nhô. */
export function Hero({ gioi, cao, mau }: { gioi: 'nam' | 'nu'; cao: number; mau: string }) {
  const a = anhHero(gioi)
  return (
    <span className="ban2d-hero pointer-events-none relative inline-flex flex-col items-center" style={{ height: cao }}>
      <span className="absolute bottom-0 rounded-[50%]" style={{ width: cao * 0.6, height: cao * 0.14, background: mau, opacity: 0.35, filter: 'blur(3px)' }} />
      {a ? <img src={a} alt="" className="relative h-full w-auto object-contain" draggable={false} /> : <span className="relative text-center" style={{ fontSize: cao * 0.7, lineHeight: 1 }}>🧙</span>}
    </span>
  )
}

/** CSS hiệu ứng (1 lần mỗi màn). Tất cả chuyển động nằm dưới [data-dong="1"] + không giảm chuyển động. */
export function CssBan2D() {
  return <style>{`
@media (prefers-reduced-motion: no-preference){
.ban2d[data-dong="1"] .ban2d-sao{animation:ban2d-nhay 3.2s ease-in-out infinite}
.ban2d[data-dong="1"] .ban2d-may{animation-name:ban2d-troi;animation-timing-function:linear;animation-iteration-count:infinite}
.ban2d[data-dong="1"] .ban2d-anh-nuoc{animation:ban2d-nuoc 14s ease-in-out infinite alternate}
.ban2d[data-dong="1"] .ban2d-suong{animation:ban2d-suong 7s ease-in-out infinite alternate}
.ban2d[data-dong="1"] .ban2d-co{animation:ban2d-co 1.6s ease-in-out infinite alternate}
.ban2d[data-dong="1"] .ban2d-hero{animation:ban2d-nhun 1.8s ease-in-out infinite}
.ban2d[data-dong="1"] .ban2d-sang{animation:ban2d-sang 2.4s ease-in-out infinite}
.ban2d[data-dong="1"] .ban2d-quai{animation:ban2d-tho 2.2s ease-in-out infinite}
.ban2d[data-dong="1"] .ban2d-duong-toi{animation:ban2d-chay 1.2s linear infinite}
.ban2d[data-dong="1"] .ban2d-dao{animation:ban2d-noi 6s ease-in-out infinite alternate}
}
.ban2d-o{transition:transform .2s ease,filter .2s ease}
.ban2d-o:hover,.ban2d-o:focus-visible{transform:translate(-50%,-56%) scale(1.04)!important;filter:brightness(1.1) drop-shadow(0 0 4px var(--sk-acc)) drop-shadow(0 0 12px var(--sk-acc))!important}
.ban2d-zoom{transition:transform .45s cubic-bezier(.5,0,.75,0),opacity .45s ease}
@keyframes ban2d-nhay{0%,100%{opacity:.25;transform:scale(.7)}50%{opacity:1;transform:scale(1.2)}}
@keyframes ban2d-troi{from{transform:translateX(0)}to{transform:translateX(320%)}}
@keyframes ban2d-nuoc{from{transform:translate(0,0)}to{transform:translate(4%,2%)}}
@keyframes ban2d-suong{from{transform:translateX(-4%) scale(1)}to{transform:translateX(4%) scale(1.05)}}
@keyframes ban2d-co{from{transform:skewY(-4deg) scaleX(.94)}to{transform:skewY(4deg) scaleX(1)}}
@keyframes ban2d-nhun{0%,100%{transform:translateY(0)}50%{transform:translateY(-8%)}}
@keyframes ban2d-sang{0%,100%{opacity:.45;transform:translate(-50%,-50%) scale(.96)}50%{opacity:.9;transform:translate(-50%,-50%) scale(1.04)}}
@keyframes ban2d-tho{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.94) translateY(3%)}}
@keyframes ban2d-chay{to{stroke-dashoffset:-24}}
@keyframes ban2d-noi{from{translate:0 0}to{translate:0 -1.2%}}
`}</style>
}

/** 5 SAO tiến độ (Thùy 02/10: "thay vì hiện đạt thì để dạng star cho dễ hiểu — 5 star, mỗi star 20% hoàn thành").
 *  ti = tỉ lệ hoàn thành 0–1 (đã có sẵn: dạng đạt / tổng dạng, hoặc độ nắm dạng do DB trả) — chỉ đổi cách HIỂN THỊ. Sao đầy = mỗi 20% trọn. */
/** Kiểu sao RIÊNG khi đè lên tranh (màu cố định, không theo style): sao đạt · sao chưa đạt · viền · nền viên thuốc tối phía sau hàng sao. */
export interface KieuSao { dat: string; chua: string; vien: string; nen: string }
export function Sao5({ ti, co = 13, vienToi = false, kieu }: { ti: number; co?: number; vienToi?: boolean; kieu?: KieuSao }) {
  const n = Math.max(0, Math.min(5, Math.floor(ti * 5 + 1e-9)))
  return (
    <span className="inline-flex items-center gap-[1px] leading-none" role="img" aria-label={`${n}/5 sao`} style={kieu ? { background: kieu.nen, borderRadius: 999, padding: `${co * 0.06}px ${co * 0.3}px`, boxShadow: `0 0 0 1px ${kieu.vien}` } : undefined}>
      {Array.from({ length: 5 }, (_, i) => kieu ? (
        // KIỂU RIÊNG (Thùy 02/10: sao trùng màu nền ⇒ phải NỔI): vàng rực + viền nâu tím tối dày + bóng; sao chưa đạt xám sáng; cả hàng nằm trên viên thuốc tối mờ
        <span key={i} style={{ fontSize: co, lineHeight: 1, color: i < n ? kieu.dat : kieu.chua, WebkitTextStroke: `${Math.max(2, co / 5)}px ${kieu.vien}`, paintOrder: 'stroke fill',
          textShadow: i < n ? `0 2px 3px ${kieu.vien}, 0 0 10px ${kieu.dat}66` : `0 1px 2px ${kieu.vien}` }}>★</span>
      ) : vienToi ? (
        // VIỀN TỐI (Thùy 02/10: sao đè lên cảnh phải có viền tối để tách khỏi cảnh vật): viền màu nền style ôm ngoài + bóng tối; sao chưa đạt = ruột tối mờ + viền sáng mảnh ⇒ vẫn phân biệt rõ
        <span key={i} style={{ fontSize: co, lineHeight: 1, color: i < n ? 'var(--sk-acc)' : 'color-mix(in srgb, var(--sk-muted) 60%, transparent)',
          WebkitTextStroke: `${Math.max(2, co / 7)}px var(--sk-bg)`, paintOrder: 'stroke fill',
          textShadow: i < n ? '0 2px 4px var(--sk-bg), 0 0 8px var(--sk-bg)' : '0 1px 3px var(--sk-bg)' }}>★</span>
      ) : (
        <span key={i} style={{ fontSize: co, lineHeight: 1, color: i < n ? 'var(--sk-acc)' : 'transparent', WebkitTextStroke: i < n ? undefined : `${Math.max(1, co / 14)}px var(--sk-muted)`,
          // sao đầy: vàng + viền tối + quầng sáng · sao chưa đạt: RỖNG chỉ có viền (phân biệt rõ ở mọi cỡ)
          textShadow: i < n ? '0 0 2px var(--sk-bg), 0 0 2px var(--sk-bg), 0 0 10px var(--sk-acc)' : undefined }}>★</span>
      ))}
    </span>
  )
}

/** CHỮ NHÃN KHÔNG KHUNG (Thùy 02/10: "có phương án nào không có khung đen mà chữ vẫn nổi bật trên nền cảnh?") — kiểu nhãn bản đồ game:
 *  viền dày màu nền style (8 hướng) + bóng mềm ⇒ đọc rõ trên mọi vùng tranh mà không che cảnh. text-shadow được KẾ THỪA ⇒ đặt lên khối nhãn là đủ. */
const V = 'var(--sk-bg)'
export const CHU_VIEN = {
  textShadow: [[-2, -2], [2, -2], [-2, 2], [2, 2], [0, -2.5], [0, 2.5], [-2.5, 0], [2.5, 0]].map(([x, y]) => `${x}px ${y}px 0 ${V}`).join(', ') + `, 0 3px 10px ${V}, 0 0 18px ${V}`,
} as const

/** MŨI TÊN "EM ĐANG Ở ĐÂY" (Thùy 02/10: bỏ chữ "Em đang ở đây" + ảnh nhân vật, thay "1 mũi tên vàng chỉ xuống, chuyển động lên xuống — các game đều làm thế").
 *  Đặt ngay TRÊN chỗ em đang học, mũi chỉ xuống; nhấp nhô liên tục (cả mức đồ hoạ Thấp — đây là chỉ dẫn, không phải trang trí; chỉ đứng yên khi máy bật giảm chuyển động). */
export function MuiTen({ co }: { co: number }) {
  return (
    <span className="ban2d-mui-ten pointer-events-none inline-block" style={{ width: co, height: co * 1.1 }} role="img" aria-label="Em đang ở đây">
      <svg viewBox="0 0 40 44" className="h-full w-full overflow-visible" style={{ filter: 'drop-shadow(0 0 7px var(--sk-acc)) drop-shadow(0 0 2px var(--sk-acc))' }}>
        <path d="M13 2 H27 V20 H37 L20 41 L3 20 H13 Z" fill="var(--sk-acc)" strokeLinejoin="round" />
        <path d="M16 5 H21 V22 H14 Z" fill="var(--sk-ink)" opacity="0.45" />
      </svg>
      <style>{'@keyframes ban2d-nhap{0%,100%{transform:translateY(0)}50%{transform:translateY(-28%)}} @media (prefers-reduced-motion: no-preference){.ban2d-mui-ten{animation:ban2d-nhap .9s ease-in-out infinite}}'}</style>
    </span>
  )
}
