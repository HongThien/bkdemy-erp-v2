// HOME của ERP (Thùy 13/10): mỗi NHÓM lớn = 1 box, bấm mới mở các mục con · mục Yêu thích do từng
// người tự chọn, bấm là vào thẳng. Hai trang cùng một component:
//   leaf 'home'          → Yêu thích + lưới box nhóm
//   leaf 'home:<nhóm>'   → các mục con của nhóm đó (mỗi mục có ☆ để ghim lên Home)
// Box theo đúng "kiểu 2" của CLAUDE.md §6 (chỉ header: nền pastel + icon trong khối bo tròn + chevron).
import type { NavGroup, NavLeaf } from '../types'
import { useStore, useYeuThich } from '../store/useStore'
import { useIsMobile } from '../hooks/useIsMobile'
import { LEAF_VIEC, VIEC_META, leafNhom, nhomCuaLeafHome, nhomMeta, traiMuc, type MucMenu, type Tone } from '../lib/menu'

// Nút sao — tách khỏi nút mở mục (button lồng button là HTML sai), nằm đè góc phải.
function Sao({ bat, onClick }: { bat: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} title={bat ? 'Bỏ khỏi Yêu thích' : 'Thêm vào Yêu thích'}
      className={`absolute right-1 top-1/2 -translate-y-1/2 rounded-md px-1.5 py-1 text-[17px] leading-none transition hover:bg-amber-50 ${bat ? 'text-amber-400' : 'text-slate-300 hover:text-amber-400'}`}>
      {bat ? '★' : '☆'}
    </button>
  )
}

// 1 mục mở được: icon + tên (+ dòng phụ) · bấm vào thẳng màn · ☆ ghim.
function MucTile({ m, phu, bat, coSao, onMo, onSao }: { m: MucMenu; phu?: string; bat: boolean; coSao: boolean; onMo: () => void; onSao: () => void }) {
  return (
    <div className="relative">
      <button onClick={onMo}
        className={`flex w-full items-center gap-2.5 rounded-xl border border-slate-200/70 bg-white py-2.5 pl-3 text-left shadow-sm transition hover:shadow-md ${m.tone.vien} ${coSao ? 'pr-10' : 'pr-3'}`}>
        <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg text-[17px] ${m.tone.ill}`}>{m.icon}</span>
        <span className="min-w-0">
          <span className="block truncate text-[13.5px] font-medium text-slate-800">{m.ten}</span>
          {phu && <span className="block truncate text-[11px] text-slate-400">{phu}</span>}
        </span>
      </button>
      {coSao && <Sao bat={bat} onClick={onSao} />}
    </div>
  )
}

// Box nhóm lớn — gần vuông, không dẹt.
function NhomBox({ icon, tone, ten, phu, so, onClick }: { icon: string; tone: Tone; ten: string; phu: string; so?: number; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`relative flex aspect-[5/4] flex-col justify-between rounded-2xl border border-transparent p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${tone.bg} ${tone.vien}`}>
      <div className="flex items-start justify-between">
        <span className={`flex size-11 items-center justify-center rounded-xl text-[22px] ${tone.ill}`}>{icon}</span>
        {so != null && <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-semibold text-slate-500">{so} mục</span>}
      </div>
      <div className="pr-4">
        <div className={`text-[15.5px] font-semibold leading-snug ${tone.chu}`}>{ten}</div>
        <div className="mt-0.5 line-clamp-2 text-[11.5px] leading-snug text-slate-500">{phu}</div>
      </div>
      <span className="absolute bottom-3 right-3 text-[16px] leading-none text-slate-400">›</span>
    </button>
  )
}

const LUOI_MUC = 'grid gap-2 [grid-template-columns:repeat(auto-fill,minmax(210px,1fr))]'

export default function HomeScreen({ leaf, groups, coViec }: { leaf: string; groups: NavGroup[]; coViec: boolean }) {
  const setStaffLeaf = useStore((s) => s.setStaffLeaf)
  const doiYeuThich = useStore((s) => s.doiYeuThich)
  const me = useStore((s) => s.me)
  const yeuThich = useYeuThich()
  const isMobile = useIsMobile()
  const coSao = !!me   // tài khoản chưa gắn hồ sơ nhân sự thì không có chỗ lưu → ẩn ☆ thay vì cho bấm rồi mất
  const mucs = traiMuc(groups)
  const viec: MucMenu = { id: LEAF_VIEC, ten: 'Việc của tôi', nhom: null, cha: null, ...VIEC_META }
  const tatCa = coViec ? [viec, ...mucs] : mucs
  // Yêu thích: tra theo id (khoá tự nhiên); mục đã mất quyền/đã bỏ thì chỉ không hiện, không tự xoá khỏi DB.
  const dsYeuThich = yeuThich.map((id) => tatCa.find((m) => m.id === id)).filter((m): m is MucMenu => !!m)
  const khung = isMobile ? 'min-h-0 overflow-auto bg-[#f5f5f7] p-3' : 'min-h-0 overflow-auto bg-[#f5f5f7] p-8'

  // ── Trang 1 nhóm ──
  const nhom = nhomCuaLeafHome(leaf)
  const g = nhom ? groups.find((x) => x.nhom === nhom) : null
  if (g) {
    const meta = nhomMeta(g.nhom)
    const mucCua = (l: NavLeaf) => mucs.find((m) => m.id === l.id)!
    const le = g.leaves.filter((l) => !l.children?.length)
    const thuMuc = g.leaves.filter((l) => l.children?.length)
    const tile = (l: NavLeaf) => {
      const m = mucCua(l)
      return <MucTile key={l.id} m={m} bat={yeuThich.includes(l.id)} coSao={coSao} onMo={() => setStaffLeaf(l.id)} onSao={() => doiYeuThich(l.id)} />
    }
    return (
      <section className={khung}>
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-4 flex items-center gap-3">
            <span className={`flex size-11 items-center justify-center rounded-xl text-[22px] ${meta.tone.ill}`}>{meta.icon}</span>
            <div>
              <h2 className="text-[22px] font-semibold leading-tight text-slate-800">{g.nhom}</h2>
              {coSao && <p className="text-[12px] text-slate-400">Bấm ☆ ở mục hay dùng để ghim lên Trang chính.</p>}
            </div>
          </div>
          {le.length > 0 && <div className={LUOI_MUC}>{le.map(tile)}</div>}
          {thuMuc.map((f) => (
            <div key={f.id} className="mt-5">
              <div className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-slate-400">{f.ten}</div>
              <div className={LUOI_MUC}>{f.children!.map(tile)}</div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // ── Trang chính ──
  const tenGoi = me?.nhanSu.ho_ten?.trim().split(/\s+/).pop()
  return (
    <section className={khung}>
      <div className="mx-auto max-w-[1100px]">
        <h2 className={isMobile ? 'mb-3 text-[19px] font-semibold text-slate-800' : 'mb-5 text-[24px] font-semibold text-slate-800'}>
          {tenGoi ? `Chào ${tenGoi} 👋` : 'Trang chính'}
        </h2>

        <div className="mb-2 flex items-baseline gap-2">
          <h3 className="text-[13px] font-semibold text-slate-600">⭐ Yêu thích</h3>
          {dsYeuThich.length > 0 && <span className="text-[11px] text-slate-400">bấm là vào thẳng · bấm ★ để bỏ</span>}
        </div>
        {dsYeuThich.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 px-4 py-3 text-[12.5px] text-slate-500">
            {coSao ? 'Chưa có mục nào. Mở một nhóm bên dưới rồi bấm ☆ ở mục hay dùng — nó sẽ nằm ở đây, bấm là vào thẳng.'
              : 'Tài khoản chưa gắn hồ sơ nhân sự nên chưa lưu được mục Yêu thích.'}
          </div>
        ) : (
          <div className={LUOI_MUC}>
            {dsYeuThich.map((m) => (
              <MucTile key={m.id} m={m} phu={[m.nhom, m.cha].filter(Boolean).join(' › ') || undefined} bat coSao={coSao}
                onMo={() => setStaffLeaf(m.id)} onSao={() => doiYeuThich(m.id)} />
            ))}
          </div>
        )}

        <h3 className="mb-2 mt-7 text-[13px] font-semibold text-slate-600">Tất cả</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {coViec && (
            <NhomBox icon={VIEC_META.icon} tone={VIEC_META.tone} ten="Việc của tôi" phu="Việc vận hành cần làm trong tuần · việc phát triển"
              onClick={() => setStaffLeaf(LEAF_VIEC)} />
          )}
          {groups.map((x) => {
            const meta = nhomMeta(x.nhom)
            const con = mucs.filter((m) => m.nhom === x.nhom)
            return (
              <NhomBox key={x.nhom ?? '_'} icon={meta.icon} tone={meta.tone} ten={x.nhom ?? ''} so={con.length}
                phu={con.map((m) => m.ten).join(' · ')} onClick={() => setStaffLeaf(leafNhom(x.nhom ?? ''))} />
            )
          })}
        </div>
      </div>
    </section>
  )
}
