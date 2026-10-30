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
import type { DiemSang, HoatCanh, LinhVatSong, MaVai } from './kieu'

const CSS = `
.hc-goc { position: absolute; inset: 0; overflow: hidden; pointer-events: none; container-type: size; contain: strict; z-index: 0 }
.hc-goc.hc-truoc { z-index: 2 }
/* top: tranh cao H = max(100cqw / tl, 100cqh); phần thừa (100cqh − H, âm) chia theo điểm neo dọc --ny (0 = neo trên · .5 = neo giữa) */
.hc-tranh { position: absolute; left: 50%; top: calc((100cqh - max(100cqw / var(--tl), 100cqh)) * var(--ny, 0)); width: max(100cqw, calc(100cqh * var(--tl))); aspect-ratio: var(--tl); transform: translateX(-50%) }
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
/* MA VẢI: trồi lên từ mộ (nhỏ → to, hiện dần) · lượn zíc zắc lên trời · tan · nghỉ dưới mộ. Đơn vị % = cỡ CHÍNH con ma (đổi cỡ màn vẫn đúng tỉ lệ). */
@keyframes hcMaVai {
  0% { opacity: 0; transform: translate3d(0, 25%, 0) scale(.45) }
  9% { opacity: .92; transform: translate3d(0, -55%, 0) scale(1) rotate(0deg) }
  26% { transform: translate3d(75%, -170%, 0) rotate(9deg) }
  44% { transform: translate3d(-35%, -270%, 0) rotate(-7deg) }
  62% { opacity: .9; transform: translate3d(95%, -345%, 0) rotate(10deg) }
  80% { opacity: .55; transform: translate3d(15%, -420%, 0) rotate(-5deg) }
  90%, 100% { opacity: 0; transform: translate3d(55%, -480%, 0) scale(.85) }
}
@keyframes hcVai { from { transform: skewX(-5deg) scale(1, 1) } to { transform: skewX(5deg) scale(1.03, .96) } }
@keyframes hcSuong { from { transform: translate3d(0, 0, 0) } to { transform: translate3d(-50%, 0, 0) } }
.hc-mv { position: absolute; aspect-ratio: 100 / 125; transform: translate(-50%, -100%) }
.hc-mv.lat { transform: translate(-50%, -100%) scaleX(-1) }
.hc-mv > div { position: absolute; inset: 0; opacity: 0; will-change: transform, opacity; animation: hcMaVai ease-in-out infinite }
.hc-mv img { display: block; width: 100%; height: 100%; transform-origin: 50% 15%; will-change: transform; animation: hcVai 1.3s ease-in-out infinite alternate }
/* SƯƠNG sát đất: dải rộng 200% khung, nền là 1 "viên" sương lặp ngang 2 lần (background-size 50%) ⇒ dịch đúng −50% là khớp liền, lặp mãi không nối */
.hc-suong { position: absolute; left: 0; width: 200%; background-repeat: repeat-x; background-size: 50% 100%; will-change: transform; animation: hcSuong linear infinite;
  background-image: radial-gradient(ellipse 17% 42% at 18% 62%, rgba(206,196,236,.26), transparent 70%), radial-gradient(ellipse 21% 36% at 52% 58%, rgba(206,196,236,.2), transparent 70%),
    radial-gradient(ellipse 12% 30% at 84% 66%, rgba(214,204,242,.22), transparent 70%), radial-gradient(ellipse 48% 22% at 50% 92%, rgba(190,180,224,.2), transparent 75%) }
.hc-bay { position: absolute; left: 0; width: 100%; height: 0; will-change: transform; animation: hcBay linear infinite }
.hc-nhap { position: absolute; left: 0; top: 0; will-change: transform; animation: hcNhap ease-in-out infinite alternate }
.hc-vo { display: block; width: 100%; height: auto; transform-origin: 50% 40%; will-change: transform; animation: hcVo .19s ease-in-out infinite alternate }
.hc-troi { display: block; width: 100%; height: auto; will-change: transform; animation: hcTroi ease-in-out infinite alternate }
.hc-bong { will-change: transform; animation: hcBong 2.8s ease-in-out infinite alternate }
@media (prefers-reduced-motion: reduce) {
  .hc-diem > i, .hc-bong { animation: none }
  .hc-diem > .hc-sang { opacity: .9 } .hc-diem > .hc-tat { opacity: 0 }
  .hc-bay, .hc-mv { display: none }
  .hc-suong { animation: none }
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

// Con MA VẢI (giống video Thùy gửi 30/10: vải trắng mờ dần xuống đuôi lượn sóng, 2 tay nhỏ, mắt + miệng đen) — vẽ SVG ⇒ nét ở mọi cỡ màn, 0 file ảnh.
// Dùng làm <img> (vẽ thành ảnh 1 lần) chứ không nhúng DOM SVG ⇒ chuyển động chỉ là dịch / xoay / co giãn 1 ảnh, chạy trên GPU.
const MA_SVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 125"><defs><linearGradient id="v" x1="0" y1="0" x2="0" y2="1">' +
  '<stop offset="0" stop-color="#fff" stop-opacity=".97"/><stop offset=".55" stop-color="#f1ecff" stop-opacity=".9"/><stop offset="1" stop-color="#e2dbff" stop-opacity=".18"/></linearGradient></defs>' +
  '<path d="M50 6C24 6 13 27 13 52L13 98Q19 112 27 101Q35 117 43 103Q50 119 57 103Q65 117 73 101Q81 112 87 98L87 52C87 27 76 6 50 6Z" fill="url(#v)" stroke="#d9d0ff" stroke-opacity=".45" stroke-width="2.5"/>' +
  '<ellipse cx="9" cy="64" rx="7" ry="4.5" transform="rotate(-28 9 64)" fill="url(#v)"/><ellipse cx="91" cy="64" rx="7" ry="4.5" transform="rotate(28 91 64)" fill="url(#v)"/>' +
  '<ellipse cx="38" cy="46" rx="6" ry="8.5" fill="#1b1028"/><ellipse cx="62" cy="46" rx="6" ry="8.5" fill="#1b1028"/>' +
  '<circle cx="36" cy="43" r="1.8" fill="#fff" opacity=".8"/><circle cx="60" cy="43" r="1.8" fill="#fff" opacity=".8"/><ellipse cx="50" cy="62" rx="4" ry="5" fill="#1b1028" opacity=".85"/></svg>')

function MaVaiCon({ m, i }: { m: MaVai; i: number }) {
  const ck = m.ck ?? 13 + gn(i, 21) * 7, tre = -(m.tre ?? gn(i, 22) * ck)
  return (
    <div className={m.lat ? 'hc-mv lat' : 'hc-mv'} style={{ left: `${m.x}%`, top: `${m.y}%`, width: `${m.s}%` }}>
      <div style={{ animationDuration: `${ck}s`, animationDelay: `${tre}s` }}>
        <img src={MA_SVG} alt="" draggable={false} style={{ animationDuration: `${1.1 + gn(i, 23) * 0.6}s` }} />
      </div>
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
  const diem = nenId ? hc.diem?.[doc ? `${nenId}:doc` : nenId] : undefined   // khổ dọc dùng tranh khác ⇒ chỉ có điểm nếu đã đo riêng (`<id>:doc`)
  const soDoi = hc.doi?.so ?? 0
  const tc = (hc.tienCanh ?? []).map((t, j) => ({ t, j })).filter((x) => !x.t.chiNen || (!!nenId && x.t.chiNen.includes(nenId)))
  const tcTruoc = coTruoc ? tc.filter((x) => x.t.truoc) : []
  return (
    <>
    <div className="hc-goc" aria-hidden>
      <style>{CSS}</style>
      {diem && (
        <div className="hc-tranh" style={{ ['--tl' as string]: diem.tl, ['--ny' as string]: diem.neoY ?? 0 }}>
          {diem.ds.map((d, i) => <Diem key={i} d={d} i={i} />)}
          {(diem.ma ?? []).map((m, i) => <MaVaiCon key={`v${i}`} m={m} i={i} />)}
        </div>
      )}
      {/* SƯƠNG sát đất: 2 lớp trôi ngược chiều, khác tốc độ */}
      {diem?.suong && <>
        <div className="hc-suong" style={{ bottom: 0, height: '34%', animationDuration: '70s' }} />
        <div className="hc-suong" style={{ bottom: '-4%', height: '26%', animationDuration: '48s', animationDirection: 'reverse', opacity: 0.8 }} />
      </>}
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
