// TRANG CHÍNH của ERP (Thùy 13/10) — vẽ theo style app Học sinh (Anime RPG, đọc qua erpSkin.ts): tranh nền lâu đài,
// thẻ kính tối viền vàng, icon vẽ tay, nhân vật dẫn đường bên trái (bố cục của ảnh chuẩn
// design/handoff/hs-skin-rpg-v1/reference/reference_rpg_ipad.png). Hai trang cùng một component:
//   leaf 'home'         → lời chào · ★ Yêu thích (bấm là vào thẳng) · lưới box: mỗi NHÓM lớn 1 box
//   leaf 'home:<nhóm>'  → các mục con của nhóm (mỗi mục có ☆ để ghim lên Trang chính)
// Màu chỉ đọc biến `--e-*`; hình chỉ lấy từ SKIN_ERP / ANH_NHOM — không gõ mã màu hay đường dẫn ảnh ở đây.
import type { CSSProperties } from 'react'
import type { NavLeaf } from '../types'
import { useDieuHuong } from '../lib/useDieuHuong'
import { useIsMobile } from '../hooks/useIsMobile'
import { ANH_NHOM, BIEN_ERP, SKIN_ERP, kieuKhung9 } from '../lib/erpSkin'
import { LEAF_VIEC, MUC_VIEC, NHOM_MO_TA, VIEC_MO_TA, leafNhom, nhomCuaLeafHome, nhomIcon, type MucMenu } from '../lib/menu'

const HEAD: CSSProperties = { fontFamily: 'var(--e-font-head)' }
const BONG_CHU: CSSProperties = { textShadow: '0 2px 10px rgba(0,0,0,.65)' }   // chữ đặt thẳng trên tranh nền
const CAO_MUC = 54

// 1 MỤC mở được — khung viền vàng 9 mảnh của style · bấm vào thẳng màn · ☆ ghim (nút riêng: button lồng button là HTML sai).
function MucTile({ m, phu, bat, coSao, onMo, onSao }: { m: MucMenu; phu?: string; bat: boolean; coSao: boolean; onMo: () => void; onSao: () => void }) {
  return (
    <div className="group relative brightness-90 transition hover:brightness-110">
      <button onClick={onMo} style={{ ...kieuKhung9(SKIN_ERP.khungMuc, CAO_MUC), height: CAO_MUC }}
        className={`flex w-full items-center gap-2.5 text-left ${coSao ? 'pr-7' : ''}`}>
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--e-surface2)] text-[14px] leading-none ring-1 ring-[var(--e-line)]">{m.icon}</span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-[13.5px] font-semibold text-[var(--e-ink)]">{m.ten}</span>
          {phu && <span className="block truncate text-[10.5px] text-[var(--e-muted)]">{phu}</span>}
        </span>
      </button>
      {coSao && (
        <button onClick={onSao} title={bat ? 'Bỏ khỏi Yêu thích' : 'Thêm vào Yêu thích'}
          className={`absolute right-3 top-1/2 -translate-y-1/2 rounded px-1 text-[17px] leading-none ${bat ? 'text-[var(--e-acc)]' : 'text-[var(--e-muted)] opacity-50 hover:text-[var(--e-acc)] hover:opacity-100'}`}>
          {bat ? '★' : '☆'}
        </button>
      )}
    </div>
  )
}

// BOX NHÓM lớn — đúng dáng ô chức năng trên Home app HS: thẻ kính tối viền vàng, hình vẽ ở trên, tên + 1 dòng phụ ở dưới, gần vuông.
function NhomBox({ anh, chu, ten, phu, so, onClick }: { anh?: string; chu: string; ten: string; phu: string; so?: number; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="group relative flex aspect-[1/0.86] flex-col items-center justify-end rounded-[14px] border border-[var(--e-line)] bg-[var(--e-surface)] px-2 pb-3 pt-2 text-center backdrop-blur-[6px] transition hover:-translate-y-1 hover:border-[var(--e-acc)] hover:shadow-[0_10px_28px_rgba(0,0,0,.45)]">
      <span className="flex min-h-0 w-full flex-1 items-center justify-center">
        {anh
          ? <img src={anh} alt="" draggable={false} className="max-h-full max-w-[62%] object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,.5)] transition group-hover:scale-110" />
          : <span className="text-[44px]">{chu}</span>}
      </span>
      <span className="mt-1 block text-[16.5px] font-bold leading-tight text-[var(--e-ink)]" style={HEAD}>{ten}</span>
      <span className="mt-0.5 block w-full truncate px-1 text-[11.5px] text-[var(--e-muted)]">{phu}</span>
      {so != null && (
        <span className="absolute right-2 top-2 rounded-full border border-[var(--e-line)] bg-[var(--e-surface2)] px-2 py-0.5 text-[10.5px] font-semibold text-[var(--e-acc)]">{so} mục</span>
      )}
    </button>
  )
}

const LUOI_MUC = 'grid gap-2 [grid-template-columns:repeat(auto-fill,minmax(215px,1fr))]'
const NHAN = 'text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--e-acc)]'

export default function HomeScreen() {
  const dh = useDieuHuong()
  const isMobile = useIsMobile()
  const hep = useIsMobile(1180)   // dưới ~1180px không đủ chỗ cho cột nhân vật
  const coSao = !!dh.me           // tài khoản chưa gắn hồ sơ nhân sự thì không có chỗ lưu → ẩn ☆ thay vì cho bấm rồi mất
  const mucs = dh.mucs
  // Yêu thích: tra theo id (khoá tự nhiên); mục đã mất quyền/đã bỏ thì chỉ không hiện, không tự xoá khỏi DB.
  const dsYeuThich = dh.yeuThich.map((id) => mucs.find((m) => m.id === id)).filter((m) => !!m)
  const khung: CSSProperties = { ...BIEN_ERP, background: isMobile ? SKIN_ERP.nenDoc : SKIN_ERP.nenNgang, fontFamily: 'var(--e-font)' }
  const le = isMobile ? 'px-3 py-4' : 'px-8 py-6'

  // ── Trang 1 nhóm ──
  const nhom = nhomCuaLeafHome(dh.leaf)
  const g = nhom ? dh.adminNav.find((x) => x.nhom === nhom) : null
  if (g) {
    const tile = (l: NavLeaf) => {
      const m = mucs.find((x) => x.id === l.id)
      return m ? <MucTile key={l.id} m={m} bat={dh.yeuThich.includes(l.id)} coSao={coSao} onMo={() => dh.di(l.id)} onSao={() => dh.doiYeuThich(l.id)} /> : null
    }
    const le1 = g.leaves.filter((l) => !l.children?.length)
    const thuMuc = g.leaves.filter((l) => l.children?.length)
    const anh = ANH_NHOM[g.nhom ?? '']
    return (
      <section style={khung} className="min-h-0 overflow-auto text-[var(--e-ink)]">
        <div className={`mx-auto max-w-[1180px] ${le}`}>
          <div className="mb-1 flex items-center gap-3" style={BONG_CHU}>
            {anh ? <img src={anh} alt="" draggable={false} className="size-16 object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,.5)]" /> : <span className="text-[40px]">{nhomIcon(g.nhom)}</span>}
            <div>
              <h2 className="text-[28px] font-bold leading-tight" style={HEAD}>{g.nhom}</h2>
              <p className="text-[12.5px] text-[var(--e-muted)]">{NHOM_MO_TA[g.nhom ?? ''] ?? ''}{coSao ? ' — bấm ☆ ở mục hay dùng để ghim lên Trang chính' : ''}</p>
            </div>
          </div>
          {SKIN_ERP.gach && <img src={SKIN_ERP.gach} alt="" draggable={false} className="mb-4 h-3 w-full max-w-[520px] object-contain object-left opacity-80" />}
          {le1.length > 0 && <div className={LUOI_MUC}>{le1.map(tile)}</div>}
          {thuMuc.map((f) => (
            <div key={f.id} className="mt-5">
              <div className={`mb-2 ${NHAN}`} style={{ ...HEAD, ...BONG_CHU }}>{f.ten}</div>
              <div className={LUOI_MUC}>{f.children!.map(tile)}</div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // ── Trang chính ──
  const tenGoi = dh.me?.nhanSu.ho_ten?.trim().split(/\s+/).pop()
  const homNay = new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' })
  const coNv = !hep && !!SKIN_ERP.nhanVat
  return (
    <section style={khung} className="min-h-0 overflow-auto text-[var(--e-ink)]">
      <div className={`mx-auto flex min-h-full max-w-[1340px] gap-4 ${le}`}>
        {coNv && (
          <div className="sticky bottom-0 flex w-[25%] shrink-0 flex-col items-center justify-end self-end">
            <div className="relative mb-2 ml-auto mr-2 max-w-[210px] rounded-2xl bg-white/95 px-3.5 py-2.5 text-[12.5px] font-medium leading-snug text-slate-700 shadow-lg">
              {dsYeuThich.length ? 'Mục hay dùng nằm ngay hàng ★ Yêu thích — bấm là vào thẳng.' : 'Mở một nhóm rồi bấm ☆ ở mục hay dùng, mình sẽ để sẵn ở hàng Yêu thích.'}
              <span className="absolute -bottom-1.5 left-8 size-3 rotate-45 bg-white/95" />
            </div>
            <img src={SKIN_ERP.nhanVat} alt="" draggable={false} className="max-h-[58vh] w-full object-contain object-bottom drop-shadow-[0_14px_22px_rgba(0,0,0,.55)]" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="mb-5" style={BONG_CHU}>
            <h2 className={isMobile ? 'text-[24px] font-bold leading-tight' : 'text-[34px] font-bold leading-[1.12]'} style={HEAD}>
              <span className="text-[var(--e-acc)]">✦</span> {tenGoi ? <>Chào {isMobile ? '' : <br />}{tenGoi}!</> : 'Trang chính'}
            </h2>
            <p className="mt-1 text-[12.5px] capitalize text-[var(--e-muted)]">{homNay}</p>
          </div>

          <div className={`mb-2 ${NHAN}`} style={{ ...HEAD, ...BONG_CHU }}>★ Yêu thích</div>
          {dsYeuThich.length === 0 ? (
            <div className="rounded-[14px] border border-dashed border-[var(--e-line)] bg-[var(--e-surface)] px-4 py-3 text-[12.5px] text-[var(--e-muted)] backdrop-blur-[6px]">
              {coSao ? 'Chưa có mục nào. Mở một nhóm bên dưới rồi bấm ☆ ở mục hay dùng — nó sẽ nằm ở đây, bấm là vào thẳng.'
                : 'Tài khoản chưa gắn hồ sơ nhân sự nên chưa lưu được mục Yêu thích.'}
            </div>
          ) : (
            <div className={LUOI_MUC}>
              {dsYeuThich.map((m) => (
                <MucTile key={m.id} m={m} phu={[m.nhom, m.cha].filter(Boolean).join(' › ') || undefined} bat coSao={coSao}
                  onMo={() => dh.di(m.id)} onSao={() => dh.doiYeuThich(m.id)} />
              ))}
            </div>
          )}

          <div className={`mb-2 mt-6 ${NHAN}`} style={{ ...HEAD, ...BONG_CHU }}>Tất cả</div>
          <div className={isMobile ? 'grid grid-cols-2 gap-2.5' : 'grid grid-cols-4 gap-3.5'}>
            <NhomBox anh={ANH_NHOM.viec} chu={MUC_VIEC.icon} ten={MUC_VIEC.ten} phu={VIEC_MO_TA} onClick={() => dh.di(LEAF_VIEC)} />
            {dh.adminNav.map((x) => (
              <NhomBox key={x.nhom ?? '_'} anh={ANH_NHOM[x.nhom ?? '']} chu={nhomIcon(x.nhom)} ten={x.nhom ?? ''} phu={NHOM_MO_TA[x.nhom ?? ''] ?? ''}
                so={mucs.filter((m) => m.nhom === x.nhom).length} onClick={() => dh.di(leafNhom(x.nhom ?? ''))} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
