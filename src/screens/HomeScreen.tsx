// TRANG CHÍNH của ERP (Thùy 13/10) — vẽ theo STYLE app Học sinh mà người dùng tự chọn (5 style, xem lib/erpSkin.ts):
// tranh nền của style, thẻ theo dáng thẻ của style, icon vẽ tay, nhân vật dẫn đường bên trái (bố cục ảnh chuẩn
// design/handoff/hs-skin-rpg-v1/reference/reference_rpg_ipad.png). Hai trang cùng một component:
//   leaf 'home'         → lời chào · 🎨 chọn giao diện · ★ Yêu thích (bấm là vào thẳng) · lưới box: mỗi NHÓM lớn 1 box
//   leaf 'home:<nhóm>'  → các mục con của nhóm, mỗi mục 1 card TO (có ☆ để ghim lên Trang chính)
// Màu chỉ đọc biến `--sk-*` (bienCss của app HS); hình chỉ lấy qua useSkinErp — không gõ mã màu hay đường dẫn ảnh ở đây,
// không `if (skin === …)`.
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useStore } from '../store/useStore'
import { useDieuHuong } from '../lib/useDieuHuong'
import { useIsMobile } from '../hooks/useIsMobile'
import { useSkinErp, cheDoErp, SKINS_ERP } from '../lib/erpSkin'
import { nenCua } from './hocsinh/skin/registry'
import { LEAF_VIEC, MUC_VIEC, NHOM_MO_TA, VIEC_MO_TA, leafNhom, nhomCuaLeafHome, nhomIcon, type MucMenu } from '../lib/menu'

const HEAD: CSSProperties = { fontFamily: 'var(--sk-font-head)', textTransform: 'var(--sk-head-case)' as CSSProperties['textTransform'], letterSpacing: 'var(--sk-head-track)' }
// Dáng THẺ của style (nền · viền · bo góc · bóng · mờ sau thẻ) — cùng bộ biến mà thẻ trong app HS dùng.
const THE: CSSProperties = {
  background: 'var(--sk-surface)', border: 'var(--sk-card-border)', borderRadius: 'var(--sk-radius)', boxShadow: 'var(--sk-card-shadow)',
  backdropFilter: 'var(--sk-blur)', WebkitBackdropFilter: 'var(--sk-blur)',
}
const NOI = 'transition hover:-translate-y-1 hover:brightness-110 hover:[outline:2px_solid_var(--sk-acc)]'   // thẻ bấm được: nhấc lên + viền màu nhấn

// Icon của style: ảnh thường, hoặc MẶT NẠ tô màu chữ khi style đơn sắc (Tối giản — 1 bộ icon đúng cả sáng lẫn tối).
function IconStyle({ src, matNa, className }: { src: string; matNa: boolean; className: string }) {
  if (matNa) return <span aria-hidden className={`block ${className}`} style={{ background: 'var(--sk-ink)', WebkitMask: `url(${src}) center / contain no-repeat`, mask: `url(${src}) center / contain no-repeat` }} />
  return <img src={src} alt="" draggable={false} className={`object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,.35)] ${className}`} />
}

function Sao({ bat, onClick, className }: { bat: boolean; onClick: () => void; className: string }) {
  return (
    <button onClick={onClick} title={bat ? 'Bỏ khỏi Yêu thích' : 'Thêm vào Yêu thích'}
      className={`absolute rounded px-1 leading-none ${className} ${bat ? 'text-[var(--sk-acc)]' : 'text-[var(--sk-muted)] opacity-50 hover:text-[var(--sk-acc)] hover:opacity-100'}`}>
      {bat ? '★' : '☆'}
    </button>
  )
}
const HuyHieu = ({ chu, co }: { chu: string; co: string }) => (
  <span className={`flex shrink-0 items-center justify-center bg-[var(--sk-surface2)] leading-none ring-1 ring-[var(--sk-line)] ${co}`} style={{ borderRadius: 'var(--sk-radius-pill)' }}>{chu}</span>
)

// MỤC CON dạng CARD TO (trang nhóm) — Thùy 13/10: "card bên trong phải to ra cho dễ nhìn, để thừa không gian làm gì".
function MucCard({ m, bat, coSao, onMo, onSao }: { m: MucMenu; bat: boolean; coSao: boolean; onMo: () => void; onSao: () => void }) {
  return (
    <div className="relative">
      <button onClick={onMo} style={THE} className={`flex aspect-[1/0.72] min-h-[150px] w-full flex-col items-center justify-center gap-2 px-3 py-4 text-center ${NOI}`}>
        <HuyHieu chu={m.icon} co="size-[70px] text-[36px]" />
        <span className="line-clamp-2 text-[17px] font-bold leading-tight text-[var(--sk-ink)]" style={HEAD}>{m.ten}</span>
        {/* mục nằm trong 1 thư mục con (vd "Vận hành lớp học") ⇒ ghi tên thư mục ngay trên card, không tách lưới riêng */}
        {m.cha && m.cha !== m.ten && <span className="block max-w-full truncate text-[11.5px] text-[var(--sk-muted)]">{m.cha}</span>}
      </button>
      {coSao && <Sao bat={bat} onClick={onSao} className="right-2.5 top-2.5 text-[22px]" />}
    </div>
  )
}

// MỤC YÊU THÍCH (Trang chính) — ô ngang: huy hiệu + tên + thuộc nhóm nào.
function MucNgang({ m, phu, coSao, onMo, onSao }: { m: MucMenu; phu?: string; coSao: boolean; onMo: () => void; onSao: () => void }) {
  return (
    <div className="relative">
      <button onClick={onMo} style={THE} className={`flex h-[66px] w-full items-center gap-3 pl-3 text-left ${coSao ? 'pr-10' : 'pr-3'} ${NOI}`}>
        <HuyHieu chu={m.icon} co="size-10 text-[20px]" />
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-[15px] font-bold text-[var(--sk-ink)]" style={HEAD}>{m.ten}</span>
          {phu && <span className="block truncate text-[11.5px] text-[var(--sk-muted)]">{phu}</span>}
        </span>
      </button>
      {coSao && <Sao bat onClick={onSao} className="right-3 top-1/2 -translate-y-1/2 text-[19px]" />}
    </div>
  )
}

// BOX NHÓM lớn — đúng dáng ô chức năng trên Home app HS: hình vẽ ở trên, tên + 1 dòng phụ ở dưới, gần vuông.
function NhomBox({ anh, matNa, chu, ten, phu, so, onClick }: { anh?: string; matNa: boolean; chu: string; ten: string; phu: string; so?: number; onClick: () => void }) {
  return (
    <button onClick={onClick} style={THE} className={`group relative flex aspect-[1/0.86] flex-col items-center justify-end px-2 pb-3 pt-2 text-center ${NOI}`}>
      <span className="flex min-h-0 w-full flex-1 items-center justify-center">
        {anh ? <IconStyle src={anh} matNa={matNa} className={`transition group-hover:scale-110 ${matNa ? 'size-[42%]' : 'max-h-full max-w-[62%]'}`} />
          : <span className="transition group-hover:scale-110"><HuyHieu chu={chu} co="size-[84px] text-[44px]" /></span>}
      </span>
      <span className="mt-1 block text-[17px] font-bold leading-tight text-[var(--sk-ink)]" style={HEAD}>{ten}</span>
      <span className="mt-0.5 block w-full truncate px-1 text-[12px] text-[var(--sk-muted)]">{phu}</span>
      {so != null && (
        <span className="absolute right-2 top-2 border border-[var(--sk-line)] bg-[var(--sk-surface2)] px-2 py-0.5 text-[10.5px] font-semibold text-[var(--sk-acc)]" style={{ borderRadius: 'var(--sk-radius-pill)' }}>{so} mục</span>
      )}
    </button>
  )
}

// Nhãn mục đặt thẳng trên tranh nền ⇒ có tấm nền mờ của style phía sau cho đọc được ở mọi tranh, sáng lẫn tối.
const Nhan = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`mb-2 ${className}`}>
    <span className="inline-block px-2.5 py-1 text-[12.5px] font-bold uppercase tracking-[0.14em] text-[var(--sk-acc)]" style={{ ...HEAD, background: 'var(--sk-surface)', borderRadius: 'var(--sk-radius-pill)', backdropFilter: 'var(--sk-blur)' }}>{children}</span>
  </div>
)

// 🎨 CHỌN GIAO DIỆN — Mặc định (ERP như cũ) + 4 style có tranh của app HS; style có nhiều hình nền / có cả sáng lẫn tối thì chọn tiếp ở dưới. Đổi là áp ngay.
function ChonGiaoDien({ hep }: { hep: boolean }) {
  const sk = useSkinErp()
  const doi = useStore((s) => s.doiGiaoDienErp)
  const [mo, setMo] = useState(false)
  const khung = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!mo) return
    const ngoai = (e: MouseEvent) => { if (!khung.current?.contains(e.target as Node)) setMo(false) }
    const phim = (e: KeyboardEvent) => { if (e.key === 'Escape') setMo(false) }
    document.addEventListener('mousedown', ngoai)
    document.addEventListener('keydown', phim)
    return () => { document.removeEventListener('mousedown', ngoai); document.removeEventListener('keydown', phim) }
  }, [mo])
  const o = (chon: boolean) => `block w-full overflow-hidden border-2 text-left ${chon ? 'border-[var(--sk-acc)]' : 'border-transparent hover:border-[var(--sk-line)]'}`
  const ten = 'block truncate px-1.5 py-1 text-[11.5px] font-semibold'
  const muc = 'mb-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--sk-muted)]'
  return (
    <div ref={khung} className="relative shrink-0">
      <button onClick={() => setMo(!mo)} style={THE} className="px-3 py-1.5 text-[12.5px] font-semibold text-[var(--sk-ink)] hover:brightness-110">🎨 Giao diện</button>
      {mo && (
        <div className={`z-40 mt-2 border border-[var(--sk-line)] bg-[var(--sk-bg)] p-3 text-[var(--sk-ink)] shadow-2xl ${hep ? 'fixed inset-x-3' : 'absolute right-0 w-[560px]'}`} style={{ borderRadius: 'var(--sk-radius)' }}>
          <div className={muc}>Giao diện</div>
          <div className={hep ? 'grid grid-cols-3 gap-2' : 'grid grid-cols-5 gap-2'}>
            {SKINS_ERP.map((s) => (
              <button key={s.id} title={s.moTa} onClick={() => doi({ skin: s.id, nen: null, che_do: undefined })} className={o(s.id === sk.skin.id)} style={{ borderRadius: 8 }}>
                <span className="block h-[58px]" style={{ background: nenCua(s.hinhNen[0], cheDoErp(s, {}), false) }} />
                <span className={ten}>{s.ten}</span>
              </button>
            ))}
          </div>
          {sk.skin.hinhNen.length > 1 && (
            <>
              <div className={`mt-3 ${muc}`}>Hình nền</div>
              <div className={hep ? 'grid grid-cols-3 gap-2' : 'grid grid-cols-5 gap-2'}>
                {sk.skin.hinhNen.map((h) => (
                  <button key={h.id} onClick={() => doi({ nen: h.id })} className={o(h.id === sk.nenId)} style={{ borderRadius: 8 }}>
                    <span className="block h-[58px]" style={{ background: nenCua(h, sk.cd, false) }} />
                    <span className={ten}>{h.ten}</span>
                  </button>
                ))}
              </div>
            </>
          )}
          {sk.skin.cheDo.length > 1 && (
            <div className="mt-3 flex items-center gap-2">
              <span className={muc.replace('mb-1.5 ', '')}>Chế độ</span>
              {(['sang', 'toi'] as const).map((c) => (
                <button key={c} onClick={() => doi({ che_do: c })}
                  className={`border px-3 py-1 text-[12px] font-semibold ${sk.cd === c ? 'border-[var(--sk-acc)] bg-[var(--sk-acc)] text-[var(--sk-acc-ink)]' : 'border-[var(--sk-line)] text-[var(--sk-muted)] hover:text-[var(--sk-ink)]'}`}
                  style={{ borderRadius: 'var(--sk-radius-pill)' }}>{c === 'sang' ? '☀ Sáng' : '🌙 Tối'}</button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function HomeScreen() {
  const dh = useDieuHuong()
  const sk = useSkinErp()
  const isMobile = useIsMobile()
  const hep = useIsMobile(1180)   // dưới ~1180px không đủ chỗ cho cột nhân vật
  const coSao = !!dh.me           // tài khoản chưa gắn hồ sơ nhân sự thì không có chỗ lưu → ẩn ☆ thay vì cho bấm rồi mất
  const mucs = dh.mucs
  // Yêu thích: tra theo id (khoá tự nhiên); mục đã mất quyền/đã bỏ thì chỉ không hiện, không tự xoá khỏi DB.
  const dsYeuThich = dh.yeuThich.map((id) => mucs.find((m) => m.id === id)).filter((m) => !!m)
  const khung: CSSProperties = { ...sk.bien, background: 'var(--sk-page)', fontFamily: 'var(--sk-font)' }
  const le = isMobile ? 'px-3 py-4' : 'px-8 py-6'
  const tam: CSSProperties = { background: 'var(--sk-surface)', borderRadius: 'var(--sk-radius)', backdropFilter: 'var(--sk-blur)' }   // tấm nền sau chữ đặt trên tranh

  // ── Trang 1 nhóm ──
  const nhom = nhomCuaLeafHome(dh.leaf)
  const g = nhom ? dh.adminNav.find((x) => x.nhom === nhom) : null
  if (g) {
    // MỘT lưới cho cả nhóm, theo đúng thứ tự menu (thư mục con trải phẳng tại chỗ, tên thư mục ghi trên card): card to,
    // lấp kín bề ngang — không chia nhiều lưới nhỏ mỗi lưới vài ô rồi bỏ trống nửa màn.
    const cuaNhom = mucs.filter((m) => m.nhom === g.nhom)
    const luoi = isMobile ? 'grid grid-cols-2 gap-2.5' : 'grid gap-3.5 [grid-template-columns:repeat(auto-fill,minmax(215px,1fr))]'
    const anh = sk.anhNhom[g.nhom ?? '']
    return (
      <section style={khung} className="min-h-0 overflow-auto text-[var(--sk-ink)]">
        <div className={`mx-auto max-w-[1500px] ${le}`}>
          <div className="mb-4 inline-flex items-center gap-3 py-2 pl-3 pr-5" style={tam}>
            {anh ? <IconStyle src={anh} matNa={sk.iconMatNa} className="size-14" /> : <HuyHieu chu={nhomIcon(g.nhom)} co="size-14 text-[28px]" />}
            <div>
              <h2 className="text-[27px] font-bold leading-tight" style={HEAD}>{g.nhom}</h2>
              <p className="text-[12.5px] text-[var(--sk-muted)]">{NHOM_MO_TA[g.nhom ?? ''] ?? ''}{coSao ? ' — bấm ☆ ở mục hay dùng để ghim lên Trang chính' : ''}</p>
            </div>
          </div>
          <div className={luoi}>
            {cuaNhom.map((m) => (
              <MucCard key={m.id} m={m} bat={dh.yeuThich.includes(m.id)} coSao={coSao} onMo={() => dh.di(m.id)} onSao={() => dh.doiYeuThich(m.id)} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  // ── Trang chính ──
  const tenGoi = dh.me?.nhanSu.ho_ten?.trim().split(/\s+/).pop()
  const homNay = new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' })
  const coNv = !hep && !!sk.nhanVat
  return (
    <section style={khung} className="min-h-0 overflow-auto text-[var(--sk-ink)]">
      <div className={`mx-auto flex min-h-full max-w-[1500px] gap-5 ${le}`}>
        {coNv && (
          <div className="sticky bottom-0 flex w-[25%] shrink-0 flex-col items-center justify-end self-end">
            <div className="relative mb-2 ml-auto mr-2 max-w-[220px] rounded-2xl bg-white/95 px-3.5 py-2.5 text-[12.5px] font-medium leading-snug text-slate-700 shadow-lg">
              {dsYeuThich.length ? 'Mục hay dùng nằm ngay hàng ★ Yêu thích — bấm là vào thẳng.' : 'Mở một nhóm rồi bấm ☆ ở mục hay dùng, mình sẽ để sẵn ở hàng Yêu thích.'}
              <span className="absolute -bottom-1.5 left-8 size-3 rotate-45 bg-white/95" />
            </div>
            <img src={sk.nhanVat} alt="" draggable={false} className="max-h-[56vh] w-full object-contain object-bottom"
              style={{ filter: sk.nhanVatLoc ?? 'drop-shadow(0 14px 22px rgba(0,0,0,.5))' }} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="mb-5 flex items-start gap-3">
            <div className="px-4 py-2.5" style={tam}>
              <h2 className={isMobile ? 'text-[23px] font-bold leading-tight' : 'text-[32px] font-bold leading-[1.12]'} style={HEAD}>
                <span className="text-[var(--sk-acc)]">✦</span> {tenGoi ? `Chào ${tenGoi}!` : 'Trang chính'}
              </h2>
              <p className="mt-0.5 text-[12.5px] capitalize text-[var(--sk-muted)]">{homNay}</p>
            </div>
            <div className="ml-auto"><ChonGiaoDien hep={isMobile} /></div>
          </div>

          <Nhan>★ Yêu thích</Nhan>
          {dsYeuThich.length === 0 ? (
            <div className="border border-dashed border-[var(--sk-line)] px-4 py-3 text-[13px] text-[var(--sk-muted)]" style={tam}>
              {coSao ? 'Chưa có mục nào. Mở một nhóm bên dưới rồi bấm ☆ ở mục hay dùng — nó sẽ nằm ở đây, bấm là vào thẳng.'
                : 'Tài khoản chưa gắn hồ sơ nhân sự nên chưa lưu được mục Yêu thích.'}
            </div>
          ) : (
            <div className={isMobile ? 'grid gap-2' : 'grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(235px,1fr))]'}>
              {dsYeuThich.map((m) => (
                <MucNgang key={m.id} m={m} phu={[m.nhom, m.cha].filter(Boolean).join(' › ') || undefined} coSao={coSao}
                  onMo={() => dh.di(m.id)} onSao={() => dh.doiYeuThich(m.id)} />
              ))}
            </div>
          )}

          <Nhan className="mt-6">Tất cả</Nhan>
          {/* Style không có nhân vật (Tối giản) hoặc màn hẹp: lưới trải hết bề ngang thì box quá khổ, tràn xuống dưới ⇒ chặn bề rộng. */}
          <div className={isMobile ? 'grid grid-cols-2 gap-2.5' : `grid grid-cols-4 gap-3.5 ${coNv ? '' : 'max-w-[1060px]'}`}>
            <NhomBox anh={sk.anhNhom.viec} matNa={sk.iconMatNa} chu={MUC_VIEC.icon} ten={MUC_VIEC.ten} phu={VIEC_MO_TA} onClick={() => dh.di(LEAF_VIEC)} />
            {dh.adminNav.map((x) => (
              <NhomBox key={x.nhom ?? '_'} anh={sk.anhNhom[x.nhom ?? '']} matNa={sk.iconMatNa} chu={nhomIcon(x.nhom)} ten={x.nhom ?? ''} phu={NHOM_MO_TA[x.nhom ?? ''] ?? ''}
                so={mucs.filter((m) => m.nhom === x.nhom).length} onClick={() => dh.di(leafNhom(x.nhom ?? ''))} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
