// TRANG CHÍNH của ERP (Thùy 13/10) — vẽ theo STYLE app Học sinh mà người dùng tự chọn (5 style, xem lib/erpSkin.ts):
// tranh nền của style, thẻ theo dáng thẻ của style, icon vẽ tay, nhân vật dẫn đường bên trái (bố cục ảnh chuẩn
// design/handoff/hs-skin-rpg-v1/reference/reference_rpg_ipad.png). Hai trang cùng một component:
//   leaf 'home'         → lời chào · 🎨 chọn giao diện · ★ Yêu thích (bấm là vào thẳng) · lưới box: mỗi NHÓM lớn 1 box
//   leaf 'home:<nhóm>'  → các mục con của nhóm, mỗi mục 1 card TO (có ☆ để ghim lên Trang chính)
// Màu chỉ đọc biến `--sk-*` (bienCss của app HS); hình chỉ lấy qua useSkinErp — không gõ mã màu hay đường dẫn ảnh ở đây,
// không `if (skin === …)`.
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { useStore } from '../store/useStore'
import { useDieuHuong } from '../lib/useDieuHuong'
import { useIsMobile } from '../hooks/useIsMobile'
import { useSkinErp, cheDoErp, SKINS_ERP, NEN_TU_CHON, nenErpCho, MEO_NGU, VIT_DI, DOI_BAN } from '../lib/erpSkin'
import MeoNgu, { meoCao } from '../components/MeoNgu'
import VitDi from '../components/VitDi'
import DoiBan from '../components/DoiBan'
import { napCanh, CANH_ERP, duongDanCanh, KHOA_NHOM, type Canh } from '../lib/canhErp'
import HomeScene from './home/HomeScene'
import { uploadNenErp } from '../lib/nhansu'
import { nenCua } from './hocsinh/skin/registry'
import { HEAD, THE } from './home/khung'
import TienDoViec from './home/TienDoViec'
import ViecHangNgay, { NOTICE_TAB, noticeTabCua } from './home/ViecHangNgay'
import HomThu from '../components/HomThu'
import AvatarEditButton from '../components/AvatarEditButton'
import BangOrder from './home/BangOrder'
import { LEAF_VIEC, MUC_VIEC, NHOM_MO_TA, VIEC_MO_TA, leafNhom, nhomCuaLeafHome, nhomIcon, type MucMenu } from '../lib/menu'

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

// BOX NHÓM lớn — 5 DÁNG do người dùng chọn (⚙ Tuỳ chỉnh › Dáng card): vuông (như ô chức năng Home app HS) · ngang · cao · tròn · gọn.
type DangCard = 'vuong' | 'ngang' | 'cao' | 'tron' | 'gon'
// luoi = số cột khi nằm NỬA PHẢI (cạnh Order) · rong = khi chiếm cả bề ngang (ẩn Order).
const DANG_CARD: { id: DangCard; ten: string; luoi: string; rong: string }[] = [
  { id: 'vuong', ten: 'Vuông', luoi: 'grid-cols-3', rong: 'grid-cols-4' },
  { id: 'ngang', ten: 'Ngang', luoi: 'grid-cols-2', rong: 'grid-cols-3' },
  { id: 'cao', ten: 'Cao', luoi: 'grid-cols-3', rong: 'grid-cols-5' },
  { id: 'tron', ten: 'Tròn', luoi: 'grid-cols-3', rong: 'grid-cols-5' },
  { id: 'gon', ten: 'Gọn', luoi: 'grid-cols-2', rong: 'grid-cols-4' },
]
function NhomBox({ dang = 'vuong', anh, matNa, chu, ten, phu, so, onClick }: { dang?: DangCard; anh?: string; matNa: boolean; chu: string; ten: string; phu: string; so?: number; onClick: () => void }) {
  const hinh = (cs: string, tt: string) => (anh ? <IconStyle src={anh} matNa={matNa} className={cs} /> : <HuyHieu chu={chu} co={tt} />)
  const soNho = so != null && (
    <span className="shrink-0 border border-[var(--sk-line)] bg-[var(--sk-surface2)] px-2 py-0.5 text-[10.5px] font-semibold text-[var(--sk-acc)]" style={{ borderRadius: 'var(--sk-radius-pill)' }}>{so} mục</span>
  )
  const soGoc = so != null && (
    <span className="absolute right-2 top-2 border border-[var(--sk-line)] bg-[var(--sk-surface2)] px-2 py-0.5 text-[10.5px] font-semibold text-[var(--sk-acc)]" style={{ borderRadius: 'var(--sk-radius-pill)' }}>{so} mục</span>
  )
  if (dang === 'ngang') return (
    <button onClick={onClick} style={THE} className={`group relative flex h-[92px] items-center gap-3 px-3.5 text-left ${NOI}`}>
      <span className="flex size-[60px] shrink-0 items-center justify-center transition group-hover:scale-110">{hinh('size-[60px]', 'size-[56px] text-[30px]')}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[17px] font-bold leading-tight text-[var(--sk-ink)]" style={HEAD}>{ten}</span>
        <span className="mt-0.5 block truncate text-[12px] text-[var(--sk-muted)]">{phu}</span>
      </span>
      {soNho}
    </button>
  )
  if (dang === 'gon') return (
    <button onClick={onClick} style={THE} className={`group flex h-[54px] items-center gap-2.5 px-3 text-left ${NOI}`}>
      <span className="flex size-[34px] shrink-0 items-center justify-center">{hinh('size-[34px]', 'size-[34px] text-[18px]')}</span>
      <span className="min-w-0 flex-1 truncate text-[15px] font-bold text-[var(--sk-ink)]" style={HEAD}>{ten}</span>
      {soNho}
    </button>
  )
  if (dang === 'tron') return (
    <button onClick={onClick} style={{ ...THE, borderRadius: '9999px' }} className={`group relative flex aspect-square w-full min-w-0 self-start flex-col items-center justify-center gap-0.5 overflow-hidden px-3 text-center ${NOI}`}>
      <span className="flex items-center justify-center transition group-hover:scale-110">{hinh('size-[40%] min-w-[40px]', 'size-[48px] text-[26px]')}</span>
      <span className="line-clamp-2 text-[13.5px] font-bold leading-tight text-[var(--sk-ink)]" style={HEAD}>{ten}</span>
      {so != null && <span className="text-[11px] font-semibold text-[var(--sk-acc)]">{so} mục</span>}
    </button>
  )
  const cao = dang === 'cao'
  return (
    <button onClick={onClick} style={THE} className={`group relative flex w-full self-start ${cao ? 'aspect-[1/1.25]' : 'aspect-[1/0.86]'} flex-col items-center justify-end px-2 pb-3 pt-2 text-center ${NOI}`}>
      <span className="flex min-h-0 w-full flex-1 items-center justify-center">
        {anh ? <IconStyle src={anh} matNa={matNa} className={`transition group-hover:scale-110 ${matNa ? 'size-[42%]' : 'max-h-full max-w-[62%]'}`} />
          : <span className="transition group-hover:scale-110"><HuyHieu chu={chu} co={cao ? 'size-[96px] text-[50px]' : 'size-[84px] text-[44px]'} /></span>}
      </span>
      <span className="mt-1 block text-[17px] font-bold leading-tight text-[var(--sk-ink)]" style={HEAD}>{ten}</span>
      <span className="mt-0.5 block w-full truncate px-1 text-[12px] text-[var(--sk-muted)]">{phu}</span>
      {soGoc}
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
  const tep = useRef<HTMLInputElement>(null)
  const [dangTai, setDangTai] = useState(false)
  const [loiNen, setLoiNen] = useState<string | null>(null)
  const chonAnh = async (f: File | undefined) => {
    if (!f) return
    setDangTai(true); setLoiNen(null)
    try { const url = await uploadNenErp(f); doi({ nen: NEN_TU_CHON, nen_url: url }) }
    catch (e: any) { setLoiNen(e?.message ?? String(e)) }
    finally { setDangTai(false); if (tep.current) tep.current.value = '' }
  }
  const doi = useStore((s) => s.doiGiaoDienErp)
  const maNs = useStore((s) => s.me?.nhanSu.ma_ns)
  const gdNenUrl = useStore((s) => s.erpGiaoDien.nen_url)
  const canhDangDung = useStore((s) => s.erpGiaoDien.canh) ?? null
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
          {(
            <>
              <div className={`mt-3 ${muc}`}>Hình nền</div>
              <div className={hep ? 'grid grid-cols-3 gap-2' : 'grid grid-cols-5 gap-2'}>
                {sk.skin.hinhNen.map((h) => (
                  <button key={h.id} onClick={() => doi({ nen: h.id })} className={o(h.id === sk.nenId)} style={{ borderRadius: 8 }}>
                    <span className="block h-[58px]" style={{ background: nenCua(h, sk.cd, false) }} />
                    <span className={ten}>{h.ten}</span>
                  </button>
                ))}
                {/* Hình nền "phòng học" dùng chung mọi style (bộ ChatGPT) */}
                {nenErpCho(maNs).map((n) => (
                  <button key={n.id} onClick={() => doi({ nen: n.id })} className={o(sk.nenId === n.id)} style={{ borderRadius: 8 }}>
                    <span className="block h-[58px]" style={{ background: `url("${n.url}") center / cover no-repeat` }} />
                    <span className={ten}>{n.ten}</span>
                  </button>
                ))}
                {/* Ảnh người dùng tự đưa lên — nằm cạnh kho hình nền có sẵn của style */}
                {gdNenUrl && (
                  <button onClick={() => doi({ nen: NEN_TU_CHON })} className={o(sk.nenId === NEN_TU_CHON)} style={{ borderRadius: 8 }} title="Ảnh của bạn (đã tải lên)">
                    <span className="block h-[58px]" style={{ background: `url("${gdNenUrl}") center / cover no-repeat` }} />
                    <span className={ten}>Ảnh của tôi</span>
                  </button>
                )}
                <button onClick={() => tep.current?.click()} disabled={dangTai} className={o(false)} style={{ borderRadius: 8 }} title="Chọn ảnh từ máy làm hình nền">
                  <span className="flex h-[58px] items-center justify-center bg-[var(--sk-surface2)] text-[22px] text-[var(--sk-muted)]">{dangTai ? '…' : '＋'}</span>
                  <span className={ten}>{dangTai ? 'Đang tải…' : gdNenUrl ? 'Đổi ảnh' : 'Ảnh của tôi'}</span>
                </button>
              </div>
              <input ref={tep} type="file" accept="image/*" className="hidden" onChange={(e) => chonAnh(e.target.files?.[0])} />
              {loiNen && <p className="mt-1.5 text-[12px] text-rose-500">Chưa tải được ảnh: {loiNen}</p>}
            </>
          )}
          {/* CẢNH "Phòng học": nền + đồ vật ghép sẵn (bộ ChatGPT). Chỉ máy tính; màn hẹp tự về bố cục thường. */}
          <div className={`mt-3 ${muc}`}>Phòng học (cảnh có đồ vật)</div>
          <div className={hep ? 'grid grid-cols-3 gap-2' : 'grid grid-cols-5 gap-2'}>
            <button onClick={() => doi({ canh: null })} className={o(!canhDangDung)} style={{ borderRadius: 8 }}>
              <span className="flex h-[58px] items-center justify-center bg-[var(--sk-surface2)] text-[12px] text-[var(--sk-muted)]">Không dùng</span>
              <span className={ten}>Bố cục thường</span>
            </button>
            {CANH_ERP.map((c) => (
              <button key={c.id} title={c.moTa} onClick={() => doi({ canh: c.id })} className={o(canhDangDung === c.id)} style={{ borderRadius: 8 }}>
                <span className="block h-[58px]" style={{ background: `url("${duongDanCanh(c.id)}/background.jpg") center / cover no-repeat` }} />
                <span className={ten}>{c.ten}</span>
              </button>
            ))}
          </div>
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

// Mỗi box có THANH CÔNG CỤ nhỏ đậu trên mép trên (hiện khi rê chuột): ⠿ kéo để đổi chỗ · ✕ ẩn box.
// Hai khu kéo thả, chỉ đổi chỗ TRONG cùng khu:
//   'lon'  = 4 box lớn (Notice Board · Việc phát triển · Yêu thích · Bảng Order) — kéo box này lên box kia ⇒ HOÁN VỊ trí.
//   'luoi' = các box nhóm (nửa phải khu Tất cả) — kéo thả chèn vào chỗ mới.
// Thứ tự lưu ở nhan_su.home_bo_cuc.thu_tu (mảng id). Ẩn lưu ở home_bo_cuc.an; bật lại ở ⚙ Tuỳ chỉnh.
const KHU_LON = ['viec_ngay', 'tien_do', 'yeu_thich', 'order']
const khuCua = (id: string) => (id.startsWith('nhom:') ? 'luoi' : 'lon')

function KeoBox({ id, keo, dich, setKeo, setDich, tha, onAn, children }: {
  id: string; keo: string | null; dich: string | null; setKeo: (v: string | null) => void; setDich: (v: string | null) => void
  tha: (keo: string, dich: string) => void; onAn: () => void; children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const chap = keo !== null && keo !== id && khuCua(keo) === khuCua(id)
  return (
    <div ref={ref} className="group/keo relative"
      onDragOver={(e) => { if (chap) { e.preventDefault(); if (dich !== id) setDich(id) } }}
      onDrop={(e) => { if (chap) { e.preventDefault(); tha(keo!, id) } setKeo(null); setDich(null) }}>
      <div className="absolute -top-3 right-3 z-20 flex items-center overflow-hidden border border-[var(--sk-line)] bg-[var(--sk-bg)] text-[var(--sk-muted)] opacity-0 shadow transition group-hover/keo:opacity-100" style={{ borderRadius: 999 }}>
        <span draggable title="Kéo để đổi chỗ"
          onDragStart={(e) => { setKeo(id); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', id); if (ref.current) e.dataTransfer.setDragImage(ref.current, 16, 16) }}
          onDragEnd={() => { setKeo(null); setDich(null) }}
          className="cursor-grab select-none px-2 py-0.5 text-[13px] leading-none hover:text-[var(--sk-acc)] active:cursor-grabbing">⠿</span>
        <button onClick={onAn} title="Ẩn box này (bật lại ở ⚙ Tuỳ chỉnh)" className="border-l border-[var(--sk-line)] px-2 py-0.5 text-[12px] leading-none hover:text-rose-500">✕</button>
      </div>
      <div className={keo === id ? 'opacity-40' : ''}>{children}</div>
      {chap && dich === id && <span className="pointer-events-none absolute inset-0 border-2 border-dashed border-[var(--sk-acc)]" style={{ borderRadius: 'var(--sk-radius)' }} />}
    </div>
  )
}

// ⚙ TUỲ CHỈNH — mỗi người tự ẩn / hiện từng box trên Trang chính (nhan_su.home_bo_cuc.an). Box ẩn chỉ không vẽ;
// danh sách ở đây luôn đủ để bật lại.
function TuyChinh({ cacBox, an, doi, hep, dang, doiDang, notice, doiNotice }: {
  cacBox: { id: string; ten: string }[]; an: string[]; doi: (id: string) => void; hep: boolean; dang: DangCard; doiDang: (d: DangCard) => void
  notice?: string[]; doiNotice: (ids: string[]) => void
}) {
  // Notice Board: tab đang bật theo thứ tự người dùng chọn + các tab chưa bật xếp sau (để bật thêm). Luôn giữ ≥ 1 tab.
  const batNotice = noticeTabCua(notice)
  const dsNotice = [...batNotice, ...NOTICE_TAB.map((t) => t.id).filter((id) => !batNotice.includes(id))]
  const batTat = (id: string) => (batNotice.includes(id as never)
    ? (batNotice.length > 1 ? doiNotice(batNotice.filter((x) => x !== id)) : undefined)
    : doiNotice([...batNotice, id]))
  const doiCho = (id: string, buoc: -1 | 1) => {
    const ds = [...batNotice] as string[]
    const i = ds.indexOf(id), j = i + buoc
    if (i < 0 || j < 0 || j >= ds.length) return
    ;[ds[i], ds[j]] = [ds[j], ds[i]]
    doiNotice(ds)
  }
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
  return (
    <div ref={khung} className="relative shrink-0">
      <button onClick={() => setMo(!mo)} style={THE} className="px-3 py-1.5 text-[12.5px] font-semibold text-[var(--sk-ink)] hover:brightness-110">
        ⚙ Tuỳ chỉnh{an.length > 0 && <span className="ml-1 text-[var(--sk-muted)]">({an.length} ẩn)</span>}
      </button>
      {mo && (
        <div className={`z-40 mt-2 border border-[var(--sk-line)] bg-[var(--sk-bg)] p-3 text-[var(--sk-ink)] shadow-2xl ${hep ? 'fixed inset-x-3' : 'absolute right-0 w-[300px]'}`} style={{ borderRadius: 'var(--sk-radius)' }}>
          <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--sk-muted)]">Hiện trên Trang chính</div>
          <ul className="max-h-[44vh] space-y-0.5 overflow-auto">
            {cacBox.map((b) => {
              const hien = !an.includes(b.id)
              return (
                <li key={b.id}>
                  <button onClick={() => doi(b.id)} className="flex w-full items-center gap-2.5 px-1.5 py-1.5 text-left text-[13.5px] hover:bg-[var(--sk-surface2)]" style={{ borderRadius: 8 }}>
                    <span aria-hidden className={`flex size-[18px] shrink-0 items-center justify-center border text-[12px] font-black leading-none ${hien ? 'border-[var(--sk-acc)] bg-[var(--sk-acc)] text-[var(--sk-acc-ink)]' : 'border-[var(--sk-line)]'}`} style={{ borderRadius: 5 }}>{hien ? '✓' : ''}</span>
                    <span className={hien ? 'font-semibold' : 'text-[var(--sk-muted)]'}>{b.ten}</span>
                  </button>
                </li>
              )
            })}
          </ul>
          <div className="mb-1 mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--sk-muted)]">📌 Notice Board — hiện tab nào</div>
          <p className="mb-1 text-[11px] text-[var(--sk-muted)]">Box góc trái trên. Bật tab bạn cần, ↑↓ để đổi thứ tự (tab đầu mở sẵn).</p>
          <ul className="space-y-0.5">
            {dsNotice.map((id) => {
              const t = NOTICE_TAB.find((x) => x.id === id)!
              const on = batNotice.includes(id)
              const i = batNotice.indexOf(id)
              return (
                <li key={id} className="flex items-center gap-1">
                  <button onClick={() => batTat(id)} disabled={on && batNotice.length === 1} title={on && batNotice.length === 1 ? 'Notice Board cần ít nhất 1 tab' : t.moTa}
                    className="flex min-w-0 flex-1 items-center gap-2.5 px-1.5 py-1.5 text-left text-[13.5px] hover:bg-[var(--sk-surface2)] disabled:cursor-not-allowed" style={{ borderRadius: 8 }}>
                    <span aria-hidden className={`flex size-[18px] shrink-0 items-center justify-center border text-[12px] font-black leading-none ${on ? 'border-[var(--sk-acc)] bg-[var(--sk-acc)] text-[var(--sk-acc-ink)]' : 'border-[var(--sk-line)]'}`} style={{ borderRadius: 5 }}>{on ? '✓' : ''}</span>
                    <span className="min-w-0">
                      <span className={`block ${on ? 'font-semibold' : 'text-[var(--sk-muted)]'}`}>{t.ten}</span>
                      <span className="block truncate text-[11px] text-[var(--sk-muted)]">{t.moTa}</span>
                    </span>
                  </button>
                  {on && batNotice.length > 1 && (
                    <span className="flex shrink-0 flex-col">
                      <button onClick={() => doiCho(id, -1)} disabled={i === 0} title="Lên trước" className="px-1 text-[11px] leading-none text-[var(--sk-muted)] hover:text-[var(--sk-ink)] disabled:opacity-25">▲</button>
                      <button onClick={() => doiCho(id, 1)} disabled={i === batNotice.length - 1} title="Ra sau" className="px-1 text-[11px] leading-none text-[var(--sk-muted)] hover:text-[var(--sk-ink)] disabled:opacity-25">▼</button>
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
          <div className="mb-1.5 mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--sk-muted)]">Dáng card (lưới nhóm)</div>
          <div className="grid grid-cols-5 gap-1.5">
            {DANG_CARD.map((d) => (
              <button key={d.id} onClick={() => doiDang(d.id)} title={d.ten}
                className={`flex flex-col items-center gap-1 border-2 px-1 py-1.5 ${d.id === dang ? 'border-[var(--sk-acc)]' : 'border-transparent hover:border-[var(--sk-line)]'}`} style={{ borderRadius: 8 }}>
                <span className="block border border-[var(--sk-ink)] opacity-70" style={{
                  borderRadius: d.id === 'tron' ? 9999 : 4,
                  width: d.id === 'ngang' || d.id === 'gon' ? 34 : d.id === 'cao' ? 20 : 26,
                  height: d.id === 'ngang' ? 20 : d.id === 'gon' ? 12 : d.id === 'cao' ? 30 : d.id === 'tron' ? 26 : 22,
                }} />
                <span className="text-[11px] font-semibold">{d.ten}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function HomeScreen() {
  const dh = useDieuHuong()
  const sk = useSkinErp()
  const canhId = useStore((s) => s.erpGiaoDien.canh) ?? null
  const [canh, setCanh] = useState<Canh | null>(null)
  useEffect(() => {
    if (!canhId) { setCanh(null); return }
    let con = true
    napCanh(canhId).then((c) => { if (con) setCanh(c) }).catch(() => { if (con) setCanh(null) })
    return () => { con = false }
  }, [canhId])
  const [keo, setKeo] = useState<string | null>(null)   // box đang kéo
  const [dich, setDich] = useState<string | null>(null)  // box đang bị rê lên
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
  const meo = MEO_NGU[dh.me?.nhanSu.ma_ns ?? '']   // trang trí riêng theo mã nhân sự (mèo ngủ trên card Chào…)
  const vit = VIT_DI[dh.me?.nhanSu.ma_ns ?? '']    // … hoặc vịt đi lại trên mép card
  const ban = DOI_BAN[dh.me?.nhanSu.ma_ns ?? '']   // … hoặc hai bạn đi gặp nhau, chào, bấm thì giận
  const homNay = new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' })
  const coNv = !hep && !!sk.nhanVat
  // Box ẩn theo từng người. Id: 'tien_do' · 'viec_ngay' · 'yeu_thich' · 'nhom:<tên nhóm>' ('nhom:viec' = Việc của tôi).
  const an = dh.me?.nhanSu.home_bo_cuc?.an ?? []
  const dangCard: DangCard = DANG_CARD.find((d) => d.id === dh.me?.nhanSu.home_bo_cuc?.dang_card)?.id ?? 'vuong'
  const luoiHep = DANG_CARD.find((d) => d.id === dangCard)!.luoi
  const luoiRong = DANG_CARD.find((d) => d.id === dangCard)!.rong
  const hienBox = (id: string) => !an.includes(id)
  const noticeTabs = dh.me?.nhanSu.home_bo_cuc?.notice
  const thuTu = dh.me?.nhanSu.home_bo_cuc?.thu_tu ?? []
  // Sắp theo thứ tự người dùng đã kéo; id chưa từng kéo giữ nguyên thứ tự mặc định, đứng sau.
  const xep = (ids: string[]) => ids.map((id, i) => ({ id, k: thuTu.indexOf(id) >= 0 ? thuTu.indexOf(id) : 1e6 + i })).sort((a, b) => a.k - b.k).map((x) => x.id)
  const khuLuoi = ['nhom:viec', ...dh.adminNav.map((x) => `nhom:${x.nhom ?? ''}`)]
  const tha = (a: string, b: string) => {
    if (khuCua(a) === 'lon') {
      // 4 box lớn: HOÁN vị trí (vị trí = chỗ trong bố cục: góc trái · cạnh lời chào · hàng rộng · nửa trái Tất cả)
      const ids = xep(KHU_LON)
      const tu = ids.indexOf(a), den = ids.indexOf(b)
      if (tu < 0 || den < 0) return
      ;[ids[tu], ids[den]] = [ids[den], ids[tu]]
      dh.doiHomeThuTu([...ids, ...thuTu.filter((x) => !ids.includes(x))])
      return
    }
    const ids = xep(khuLuoi)
    const tu = ids.indexOf(a), den = ids.indexOf(b)
    if (tu < 0 || den < 0) return
    ids.splice(den, 0, ids.splice(tu, 1)[0])
    dh.doiHomeThuTu([...ids, ...thuTu.filter((x) => !ids.includes(x))])
  }
  const keoBox = (id: string, node: ReactNode) => <KeoBox key={id} id={id} keo={keo} dich={dich} setKeo={setKeo} setDich={setDich} tha={tha} onAn={() => dh.doiHomeAn(id)}>{node}</KeoBox>
  const cacBox = [
    { id: 'viec_ngay', ten: '📌 Notice Board' }, { id: 'tien_do', ten: '🚀 Việc phát triển' },
    { id: 'yeu_thich', ten: '★ Yêu thích' }, { id: 'order', ten: '📋 Bảng Order' },
    { id: 'nhom:viec', ten: `${MUC_VIEC.icon} ${MUC_VIEC.ten}` },
    ...dh.adminNav.map((x) => ({ id: `nhom:${x.nhom ?? ''}`, ten: `${nhomIcon(x.nhom)} ${x.nhom ?? ''}` })),
  ]
  // Thiết kế chung (Thùy 14/10): góc dưới Trang chính chỉ để TỐI ĐA 4 box nhóm (theo thứ tự người dùng đã xếp);
  // các nhóm còn lại mở bằng ☰ menu / thanh địa chỉ — muốn đổi 4 box nào hiện thì ẩn (✕) hoặc kéo lên đầu.
  const nhomHienTatCa = xep(khuLuoi).filter(hienBox)
  const dsNhom = nhomHienTatCa.slice(0, 4)
  const nhomThua = nhomHienTatCa.length - dsNhom.length
  const lenViec = () => dh.di(LEAF_VIEC)

  // ── 4 BOX LỚN: thân từng box + 4 VỊ TRÍ (hoán đổi được) ──
  const thanLon = (id: string): ReactNode => {
    if (id === 'viec_ngay') return <ViecHangNgay compact onMoVietCuaToi={lenViec} onMoKeHoach={() => dh.di('myplan')} tabs={noticeTabs} />
    if (id === 'tien_do') return <TienDoViec />
    if (id === 'order') return <BangOrder />
    return (
      <div>
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
      </div>
    )
  }
  const lon = xep(KHU_LON)

  // ── CẢNH "Phòng học": thay cả bố cục thường (chỉ màn rộng; cảnh chưa tải xong thì hiện bố cục thường) ──
  if (canh && !hep) {
    const ngan = canh.nhomO.length   // 6 hoặc 4 — theo từng cảnh
    const nhomCanh = nhomHienTatCa.slice(0, ngan).map((id) => {
      if (id === 'nhom:viec') return { khoa: KHOA_NHOM[id], ten: MUC_VIEC.ten, icon: MUC_VIEC.icon, onMo: lenViec }
      const x = dh.adminNav.find((n) => `nhom:${n.nhom ?? ''}` === id)
      return { khoa: KHOA_NHOM[id] ?? 'group-viec-cua-toi', ten: x?.nhom ?? '', icon: nhomIcon(x?.nhom ?? null), so: mucs.filter((m) => m.nhom === x?.nhom).length, onMo: () => dh.di(leafNhom(x?.nhom ?? '')) }
    })
    return (
      <section style={khung} className="h-full min-h-0 overflow-hidden text-[var(--sk-ink)]">
        <HomeScene canh={canh}
          today={hienBox('viec_ngay') ? <ViecHangNgay compact onMoVietCuaToi={lenViec} onMoKeHoach={() => dh.di('myplan')} tabs={noticeTabs} /> : null}
          dev={hienBox('tien_do') ? <TienDoViec /> : null}
          order={hienBox('order') ? <BangOrder /> : null}
          profile={(
            <div className="flex w-full items-center gap-2">
              {dh.me && (
                <AvatarEditButton nhanSuId={dh.me.nhanSu.id} anhUrl={dh.me.nhanSu.anh_url} initial={(tenGoi ?? '?').charAt(0).toUpperCase()} size={52}
                  ring="var(--sk-line)" badge="var(--sk-acc)"
                  onChanged={(url) => useStore.setState((s) => (s.me ? { me: { ...s.me, nhanSu: { ...s.me.nhanSu, anh_url: url } } } : {}))} />
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate text-[17px] font-extrabold leading-tight" style={HEAD}>{tenGoi ? `Chào ${tenGoi}!` : 'Trang chính'}</div>
                <div className="text-[11px] capitalize text-[var(--sk-muted)]">{homNay}</div>
              </div>
              {coSao && <HomThu di={dh.di} duocDi={(id) => id === 'home' || mucs.some((m) => m.id === id)} />}
            </div>
          )}
          tuyChinh={coSao ? <TuyChinh cacBox={cacBox} an={an} doi={dh.doiHomeAn} hep={false} dang={dangCard} doiDang={dh.doiHomeDangCard} notice={noticeTabs} doiNotice={dh.doiNoticeTab} /> : null}
          giaoDien={<ChonGiaoDien hep={false} />}
          yeuThich={dsYeuThich.slice(0, 8).map((m) => ({ id: m.id, ten: m.ten, onMo: () => dh.di(m.id), onSao: coSao ? () => dh.doiYeuThich(m.id) : undefined }))}
          nhom={nhomCanh}
        />
      </section>
    )
  }
  const oVitri = (i: number): ReactNode => (hienBox(lon[i]) ? keoBox(lon[i], thanLon(lon[i])) : null)
  const coTrai = hienBox(lon[0]), coCanh = hienBox(lon[1]), coRong = hienBox(lon[2]), coNuaTrai = hienBox(lon[3])
  const soAn = an.length

  return (
    <section style={khung} className="min-h-0 overflow-auto text-[var(--sk-ink)]">
      <div className={`mx-auto flex min-h-full max-w-[1500px] gap-5 ${le}`}>
        {coNv && (
          <div className="flex w-[25%] shrink-0 flex-col self-stretch">
            {coTrai && <div className="shrink-0 pt-3">{oVitri(0)}</div>}
            <div className="sticky bottom-0 mt-auto flex flex-col items-center justify-end pt-3">
              <div className="relative mb-2 ml-auto mr-2 max-w-[220px] rounded-2xl bg-white/95 px-3.5 py-2.5 text-[12.5px] font-medium leading-snug text-slate-700 shadow-lg">
                {dsYeuThich.length ? 'Mục hay dùng nằm ngay hàng ★ Yêu thích — bấm là vào thẳng.' : 'Mở một nhóm rồi bấm ☆ ở mục hay dùng, mình sẽ để sẵn ở hàng Yêu thích.'}
                <span className="absolute -bottom-1.5 left-8 size-3 rotate-45 bg-white/95" />
              </div>
              <img src={sk.nhanVat} alt="" draggable={false} className="max-h-[56vh] w-full object-contain object-bottom"
                style={{ filter: sk.nhanVatLoc ?? 'drop-shadow(0 14px 22px rgba(0,0,0,.5))' }} />
            </div>
          </div>
        )}
        <div className="min-w-0 flex-1">
          {/* HÀNG ĐẦU: lời chào · vị trí 2 (cạnh lời chào) · nút Tuỳ chỉnh / Giao diện */}
          <div className={isMobile ? 'mb-4 space-y-3' : 'mb-5 flex flex-wrap items-start gap-4 pt-3'} style={!isMobile && (meo || vit || ban) ? { paddingTop: Math.max(12, (meo ? meoCao(meo) - meo.chim : 0), (vit ? vit.cao - vit.chim : 0) + 4, (ban ? ban.cao - ban.chim : 0) + 4) } : undefined}>
            {!coNv && coTrai && <div className={isMobile ? '' : 'w-[340px] shrink-0'}>{oVitri(0)}</div>}
            {/* MỘT BOX HỒ SƠ: avatar to (bấm để đổi ảnh) · lời chào · Hòm thư nằm TRONG box */}
            <div className={`relative flex shrink-0 items-center gap-4 ${isMobile ? 'px-3 py-3' : 'px-5 py-4'}`} style={tam}>
              {meo && !isMobile && <MeoNgu cfg={meo} />}
              {vit && !isMobile && <VitDi cfg={vit} />}
              {ban && !isMobile && <DoiBan cfg={ban} />}
              {dh.me && (
                <AvatarEditButton nhanSuId={dh.me.nhanSu.id} anhUrl={dh.me.nhanSu.anh_url} initial={(tenGoi ?? '?').charAt(0).toUpperCase()} size={isMobile ? 72 : 104}
                  ring="var(--sk-line)" badge="var(--sk-acc)"
                  onChanged={(url) => useStore.setState((s) => (s.me ? { me: { ...s.me, nhanSu: { ...s.me.nhanSu, anh_url: url } } } : {}))} />
              )}
              <div className="min-w-0">
                <h2 className={isMobile ? 'text-[23px] font-bold leading-tight' : 'text-[32px] font-bold leading-[1.12]'} style={HEAD}>
                  <span className="text-[var(--sk-acc)]">✦</span> {tenGoi ? `Chào ${tenGoi}!` : 'Trang chính'}
                </h2>
                <p className="mb-2.5 mt-0.5 text-[12.5px] capitalize text-[var(--sk-muted)]">{homNay}</p>
                {coSao && <HomThu noiBat di={dh.di} duocDi={(id) => id === 'home' || mucs.some((m) => m.id === id)} />}
              </div>
            </div>
            {coCanh && <div className={isMobile ? '' : 'min-w-[330px] max-w-[620px] flex-1'}>{oVitri(1)}</div>}
            <div className="ml-auto flex flex-wrap items-start gap-2">
              {coSao && <TuyChinh cacBox={cacBox} an={an} doi={dh.doiHomeAn} hep={isMobile} dang={dangCard} doiDang={dh.doiHomeDangCard} notice={noticeTabs} doiNotice={dh.doiNoticeTab} />}
              <ChonGiaoDien hep={isMobile} />
            </div>
          </div>

          {coRong && <div className="mb-5 pt-3">{oVitri(2)}</div>}

          {/* TẤT CẢ: nửa TRÁI = vị trí 4 (mặc định Bảng Order) · nửa PHẢI = các box nhóm (ít dùng — đã có Yêu thích) */}
          {(coNuaTrai || dsNhom.length > 0) && (
            <>
              <Nhan>Tất cả</Nhan>
              <div className={isMobile ? 'space-y-4' : 'flex items-start gap-4 pt-3'}>
                {coNuaTrai && <div className={isMobile ? '' : `min-w-[320px] ${dsNhom.length ? 'w-1/2 shrink-0' : 'flex-1'}`}>{oVitri(3)}</div>}
                {dsNhom.length > 0 && (
                  <div className={isMobile ? 'grid grid-cols-2 gap-2.5' : `grid min-w-0 flex-1 ${coNuaTrai ? luoiHep : luoiRong} gap-3`}>
                    {dsNhom.map((id) => {
                      if (id === 'nhom:viec') return keoBox(id, <NhomBox dang={isMobile ? 'vuong' : dangCard} anh={sk.anhNhom.viec} matNa={sk.iconMatNa} chu={MUC_VIEC.icon} ten={MUC_VIEC.ten} phu={VIEC_MO_TA} onClick={lenViec} />)
                      const x = dh.adminNav.find((n) => `nhom:${n.nhom ?? ''}` === id)
                      if (!x) return null
                      return keoBox(id, <NhomBox dang={isMobile ? 'vuong' : dangCard} anh={sk.anhNhom[x.nhom ?? '']} matNa={sk.iconMatNa} chu={nhomIcon(x.nhom)} ten={x.nhom ?? ''} phu={NHOM_MO_TA[x.nhom ?? ''] ?? ''}
                        so={mucs.filter((m) => m.nhom === x.nhom).length} onClick={() => dh.di(leafNhom(x.nhom ?? ''))} />)
                    })}
                  </div>
                )}
              </div>
            </>
          )}
          {nhomThua > 0 && <p className="mt-4 text-[12px] text-[var(--sk-muted)]">Còn {nhomThua} nhóm khác — mở ở ☰ menu bên trái hoặc thanh địa chỉ. (Trang chính chỉ hiện tối đa 4 nhóm: kéo nhóm cần dùng lên đầu hoặc ẩn bớt.)</p>}
          {soAn > 0 && coSao && <p className="mt-6 text-[12px] text-[var(--sk-muted)]">Đang ẩn {soAn} box — bật lại ở ⚙ Tuỳ chỉnh.</p>}
        </div>
      </div>
    </section>
  )
}
