// HOẠT CẢNH TRÊN TRANH NỀN (Thùy 30/10: "bí ngô phát sáng rồi tắt rồi sáng, vài con dơi bay, con ma di chuyển — làm ảnh động mà KHÔNG bị khựng,
// lâu nay các ảnh động toàn bị khựng"). Cấu hình theo style: `Skin.hoatCanh` (hợp đồng `HoatCanh` ở skin/kieu.ts) — màn KHÔNG tự chọn hình theo style.
//
// VÌ SAO KHÔNG KHỰNG (khác các ảnh động cũ — vịt / corgi ERP chạy bằng `left` + đổi 2 dáng theo nấc `steps(1)`):
//   1. CHỈ animate `transform` + `opacity` ⇒ trình duyệt giao cho GPU (compositor), chạy đều 60 khung/giây kể cả khi luồng chính đang bận tải dữ liệu,
//      React vẽ lại. Cấm animate left/top/width/filter/box-shadow/background (mỗi khung phải tính bố cục + vẽ lại trên luồng chính ⇒ giật).
//   2. Chuyển động LIỀN (ease-in-out, quỹ đạo sin), không đổi hình theo nấc — dơi vỗ cánh bằng co giãn, ma trôi bằng dịch + nghiêng.
//   3. Mọi lớp chuyển động có `will-change` ⇒ được tách lớp sẵn từ đầu, không "nâng lớp" giữa chừng (cú giật đầu tiên).
//   4. Thành phần memo + thông số sinh TẤT ĐỊNH theo chỉ số (không Math.random lúc vẽ) ⇒ trang vẽ lại không làm chuyển động khởi động lại.
//   5. Gốc `contain: strict` ⇒ thay đổi bên trong không lan ra bố cục trang.
//   6. Keyframe KHÔNG dùng biến CSS `var()` (có thể làm trình duyệt bỏ chạy trên GPU) — biên độ tính theo % cỡ chính con vật, độ lệch giữa các con
//      bằng thời lượng + chiều chạy (alternate / alternate-reverse).
// Máy bật "giảm chuyển động" ⇒ điểm sáng đứng ở trạng thái sáng, dơi / ma ẩn, nhân vật đứng yên. Tab ẩn ⇒ trình duyệt tự dừng.
//
// Điểm sáng bám đúng chỗ vẽ trong tranh: tranh nền phủ khung kiểu `center top / cover` ⇒ lớp `.hc-tranh` dựng lại ĐÚNG khung ảnh đó bằng đơn vị
// container (cqw/cqh) — không đo bằng JS, đổi cỡ cửa sổ vẫn khớp. Chỉ khổ NGANG (khổ dọc dùng tranh khác, chưa đo điểm).
import { memo, type CSSProperties } from 'react'
import type { DiemSang, HoatCanh, LinhVatSong } from './kieu'

const CSS = `
.hc-goc { position: absolute; inset: 0; overflow: hidden; pointer-events: none; container-type: size; contain: strict; z-index: 0 }
.hc-goc.hc-truoc { z-index: 2 }
.hc-tranh { position: absolute; left: 50%; top: 0; width: max(100cqw, calc(100cqh * var(--tl))); aspect-ratio: var(--tl); transform: translateX(-50%) }
.hc-tc { position: absolute; bottom: 0 }
.hc-tc > img { display: block; width: 100%; height: 100% }
.hc-diem { position: absolute; aspect-ratio: 1; transform: translate(-50%, -50%) }
.hc-diem > i { position: absolute; inset: 0; border-radius: 50%; will-change: opacity; animation-iteration-count: infinite; animation-timing-function: ease-in-out }
.hc-sang { background: radial-gradient(closest-side, var(--mau) 0%, transparent 100%) }
.hc-tat { background: radial-gradient(closest-side, rgba(22,10,30,.62) 0%, rgba(22,10,30,.35) 45%, transparent 75%); opacity: 0 }
@keyframes hcBi { 0%, 40% { opacity: .95 } 52%, 66% { opacity: .04 } 80%, 100% { opacity: .95 } }
@keyframes hcBiTat { 0%, 40% { opacity: 0 } 52%, 66% { opacity: 1 } 80%, 100% { opacity: 0 } }
@keyframes hcDen { 0% { opacity: .72 } 18% { opacity: .95 } 33% { opacity: .66 } 52% { opacity: 1 } 70% { opacity: .78 } 86% { opacity: .96 } 100% { opacity: .72 } }
@keyframes hcDom { 0%, 100% { opacity: 0; transform: translateY(0) } 35% { opacity: 1 } 60% { opacity: .85; transform: translateY(-14%) } 80% { opacity: 0; transform: translateY(-22%) } }
@keyframes hcTrang { 0%, 100% { opacity: .32 } 50% { opacity: .62 } }
@keyframes hcBay { from { transform: translate3d(-12%, 0, 0) } to { transform: translate3d(108%, 0, 0) } }
@keyframes hcNhap { from { transform: translate3d(0, 0, 0) } to { transform: translate3d(0, -130%, 0) } }
@keyframes hcVo { from { transform: scale(1, 1) } to { transform: scale(.92, .42) } }
@keyframes hcTroi { from { transform: translate3d(0, 0, 0) rotate(-4deg) } to { transform: translate3d(0, -22%, 0) rotate(4deg) } }
@keyframes hcBong { from { transform: translate3d(0, 0, 0) } to { transform: translate3d(0, -3.5%, 0) } }
.hc-bay { position: absolute; left: 0; width: 100%; height: 0; will-change: transform; animation: hcBay linear infinite }
.hc-nhap { position: absolute; left: 0; top: 0; will-change: transform; animation: hcNhap ease-in-out infinite alternate }
.hc-vo { display: block; width: 100%; height: auto; transform-origin: 50% 40%; will-change: transform; animation: hcVo .19s ease-in-out infinite alternate }
.hc-troi { display: block; width: 100%; height: auto; will-change: transform; animation: hcTroi ease-in-out infinite alternate }
.hc-bong { will-change: transform; animation: hcBong 2.8s ease-in-out infinite alternate }
@media (prefers-reduced-motion: reduce) {
  .hc-diem > i, .hc-bong { animation: none }
  .hc-diem > .hc-sang { opacity: .9 } .hc-diem > .hc-tat { opacity: 0 }
  .hc-bay { display: none }
}
`

const KIEU: Record<DiemSang['kieu'], { mau: string; ck: number; anim: string }> = {
  bi: { mau: 'rgba(255,168,64,.78)', ck: 5, anim: 'hcBi' },
  den: { mau: 'rgba(255,205,120,.62)', ck: 2.4, anim: 'hcDen' },
  nen: { mau: 'rgba(255,200,110,.7)', ck: 1.5, anim: 'hcDen' },
  dom: { mau: 'rgba(255,226,120,.95)', ck: 3.2, anim: 'hcDom' },
  trang: { mau: 'rgba(255,240,200,.5)', ck: 8, anim: 'hcTrang' },
}

/** Số giả ngẫu nhiên TẤT ĐỊNH theo chỉ số (0..1) — cùng một trang vẽ lại thì dơi vẫn bay đúng quỹ đạo cũ. */
const gn = (i: number, k: number) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x) }

function Diem({ d, i }: { d: DiemSang; i: number }) {
  const k = KIEU[d.kieu], ck = d.ck ?? k.ck, tre = -(d.tre ?? gn(i, 1) * ck)   // lệch pha âm ⇒ vào trang là đang chạy giữa chừng, không cùng nháy
  const a: CSSProperties = { animationName: k.anim, animationDuration: `${ck}s`, animationDelay: `${tre}s` }
  return (
    <div className="hc-diem" style={{ left: `${d.x}%`, top: `${d.y}%`, width: `${d.r}%`, ['--mau' as string]: d.mau ?? k.mau }}>
      {d.kieu === 'bi' && <i className="hc-tat" style={{ ...a, animationName: 'hcBiTat' }} />}
      <i className="hc-sang" style={a} />
    </div>
  )
}

/** Vật tiền cảnh + điểm sáng của nó. */
function TienCanh({ t, j }: { t: NonNullable<HoatCanh['tienCanh']>[number]; j: number }) {
  return (
    <div className="hc-tc" style={{ [t.canh === 'trai' ? 'left' : 'right']: 0, width: t.rong, aspectRatio: t.tl }}>
      <img src={t.src} alt="" draggable={false} decoding="async" />
      {t.ds.map((d, i) => <Diem key={i} d={d} i={i + 7 * (j + 1)} />)}
    </div>
  )
}

// coTruoc = màn đang có cột nhân vật ⇒ vật tiền cảnh `truoc` vẽ ở lớp TRƯỚC nội dung (z 2); không thì mọi thứ nằm sau nội dung (z 0).
function HoatCanhNenGoc({ hc, nenId, doc, coTruoc = false }: { hc: HoatCanh; nenId: string | null; doc: boolean; coTruoc?: boolean }) {
  const diem = !doc && nenId ? hc.diem?.[nenId] : undefined
  const soDoi = hc.doi?.so ?? 0
  const tc = (hc.tienCanh ?? []).map((t, j) => ({ t, j }))
  const tcTruoc = coTruoc ? tc.filter((x) => x.t.truoc) : []
  return (
    <>
    <div className="hc-goc" aria-hidden>
      <style>{CSS}</style>
      {diem && (
        <div className="hc-tranh" style={{ ['--tl' as string]: diem.tl }}>
          {diem.ds.map((d, i) => <Diem key={i} d={d} i={i} />)}
        </div>
      )}
      {/* TIỀN CẢNH: vật đặt rời ở góc dưới màn (bí ngô cắt từ tranh, mép mờ dần) + điểm sáng của chính nó. */}
      {tc.filter((x) => !tcTruoc.includes(x)).map(({ t, j }) => <TienCanh key={`t${j}`} t={t} j={j} />)}
      {/* DƠI: bay ngang trời (lớp ngoài, thẳng đều) · nhấp nhô (lớp giữa, sin) · vỗ cánh (ảnh, co giãn nhanh). Nửa số con bay ngược chiều. */}
      {hc.doi && Array.from({ length: soDoi }, (_, i) => {
        const ck = 16 + gn(i, 2) * 14, rong = 30 + gn(i, 3) * 26
        return (
          <div key={`d${i}`} className="hc-bay" style={{ top: `${5 + gn(i, 4) * 30}%`, animationDuration: `${ck}s`, animationDelay: `${-gn(i, 5) * ck}s`, animationDirection: i % 2 ? 'reverse' : 'normal' }}>
            <div className="hc-nhap" style={{ width: rong, animationDuration: `${1.6 + gn(i, 7) * 1.4}s`, animationDirection: i % 3 ? 'alternate' : 'alternate-reverse' }}>
              <img src={hc.doi!.src} alt="" draggable={false} decoding="async" className="hc-vo" style={{ animationDuration: `${0.16 + gn(i, 8) * 0.08}s`, opacity: 0.8 + gn(i, 9) * 0.2 }} />
            </div>
          </div>
        )
      })}
      {/* BÉ MA NHỎ ở xa: trôi rất chậm qua trời, bồng bềnh + nghiêng nhẹ, hơi trong (ở xa). */}
      {(hc.ma ?? []).map((src, i) => {
        const ck = 46 + gn(i, 11) * 24
        return (
          <div key={`m${i}`} className="hc-bay" style={{ top: `${14 + gn(i, 12) * 22}%`, animationDuration: `${ck}s`, animationDelay: `${-gn(i, 13) * ck}s`, animationDirection: i % 2 ? 'normal' : 'reverse' }}>
            <div className="hc-nhap" style={{ width: 54 + gn(i, 14) * 22, animationName: 'none' }}>
              <img src={src} alt="" draggable={false} decoding="async" className="hc-troi" style={{ animationDuration: `${3.2 + gn(i, 15)}s`, opacity: 0.72 }} />
            </div>
          </div>
        )
      })}
    </div>
    {tcTruoc.length > 0 && (
      <div className="hc-goc hc-truoc" aria-hidden>
        {tcTruoc.map(({ t, j }) => <TienCanh key={`t${j}`} t={t} j={j} />)}
      </div>
    )}
    </>
  )
}
/** Lớp hoạt cảnh — đặt làm con ĐẦU của khối có tranh nền (khối đó `position: relative`, nội dung đè lên trên). */
export const HoatCanhNen = memo(HoatCanhNenGoc)

/** Nhân vật linh vật BỒNG BỀNH (hoatCanh.nvBong): đế (lá / cỏ dưới chân) đứng yên, thân trôi lên xuống — cùng khung nên không lệch chỗ.
 *  `loc` = bộ lọc CSS (bóng đổ) đặt TRÊN CHÍNH lớp đang chuyển động ⇒ được tính 1 lần cùng lớp, không vẽ lại mỗi khung. */
export const NvBong = memo(function NvBong({ lv, cao, loc }: { lv: LinhVatSong; cao: string; loc?: string }) {
  const tl = lv.rong / lv.cao
  return (
    <div className="relative" style={{ width: `min(100%, calc(${cao} * ${tl}))`, aspectRatio: `${lv.rong} / ${lv.cao}` }}>
      <style>{CSS}</style>
      {lv.co && <img src={lv.co} alt="" draggable={false} className="absolute inset-0 h-full w-full" />}
      <img src={lv.dung} alt="" draggable={false} className="hc-bong absolute inset-0 h-full w-full" style={loc && loc !== 'none' ? { filter: loc } : undefined} />
    </div>
  )
})
