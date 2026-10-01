// TRANG XEM THỬ BOSS RIÊNG (hs.html?xem=boss): dữ liệu giả, không gọi DB, không cần đăng nhập. Soi 6 tư thế + hoạt ảnh + hội thoại ở màn 2D,
// và (nút dưới) vào trận 3D thử với boss cắm vào cảnh qua nguonQuai. Thiết kế: design/FLOW-NPC-BOSS-CUOI.md.
//   &ma=boss_thuy (mặc định) · &tt=noi|chieu|… (mở sẵn tư thế) · &tran=1 (vào thẳng trận 3D)
import { useState } from 'react'
import { DauTrangHS, HEAD, MAU, NhomHS, NutHS, TheHS } from '../skin/KhungHS'
import { laySkin } from '../skin/registry'
import type { BangMau3D } from '../skin/the3d/kieuMau'
import { XemDau } from '../phieuluu/XemDau'
import type { ChangV, LucDiaV } from '../phieuluu/kieu'
import { BOSS, type TinhHuong, type TuTheBoss } from './noiDungBoss'
import { BossAnhHS, HoiThoaiBoss, NHAN_TU_THE } from './BossSan'

const TINH_HUONG: { k: TinhHuong; ten: string }[] = [
  { k: 'gap_lan_dau', ten: 'Gặp lần đầu' }, { k: 'chua_du_suc', ten: 'Chưa đủ sức' }, { k: 'bat_dau', ten: 'Bắt đầu' },
  { k: 'dung', ten: 'Em đúng' }, { k: 'sai', ten: 'Em sai' }, { k: 'mau_50', ten: 'Còn 50%' }, { k: 'chuyen_pha', ten: 'Qua pha 2' },
  { k: 'ha', ten: 'Bị hạ' }, { k: 'roi_giua_tran', ten: 'Rời giữa trận' }, { k: 'gap_lai', ten: 'Gặp lại' },
]

const SO_GIA = { so_dang: 12 } // ổn định giữa các lần render

function duLieuTran(ma: string): { luc: LucDiaV; chang: ChangV } {
  const chang: ChangV = {
    ma: 'xem.boss', ten: 'Cổng Tháp Tri Thức', muc_do: 5, trang_thai: 'yeu', mastery: 0.4, da_day: true, so_cum: 2,
    quai: [{ loai: 'slime_la', boss: false }, { loai: ma, boss: true }], hp: 6, so_cau_luot: 6,
  }
  return { luc: { ma: 'X', ten: 'Tháp Tri Thức', biome: 'thanh_co', vung: [{ ma: 'X0', ten: 'Cổng Tháp', chang: [chang] }] }, chang }
}

export default function XemBoss() {
  const q = new URLSearchParams(location.search)
  const ma = q.get('ma') ?? 'boss_thuy'
  const skin = laySkin(null)
  const nd = BOSS[ma]
  const [tt, setTt] = useState<TuTheBoss>((q.get('tt') as TuTheBoss) ?? 'dung')
  const [lan, setLan] = useState(0) // đổi key để phát lại hoạt ảnh cùng tư thế
  const [th, setTh] = useState<TinhHuong>('gap_lan_dau')
  const [tran, setTran] = useState(q.get('tran') === '1')
  if (!nd || !skin.boss?.[ma]) return <div className="p-6 text-sm">Không có boss “{ma}”.</div>
  if (tran) {
    const { luc, chang } = duLieuTran(ma)
    return <div className="fixed inset-0" style={{ background: 'var(--sk-page)', color: 'var(--sk-ink)', fontFamily: 'var(--sk-font)' }}>
      <XemDau luc={luc} chang={chang} b={skin.the3d as BangMau3D} onRut={() => setTran(false)} />
    </div>
  }
  return (
    <div className="min-h-[100dvh]" style={{ background: 'var(--sk-page)', backgroundAttachment: 'fixed', color: 'var(--sk-ink)', fontFamily: 'var(--sk-font)' }}>
      <div className="mx-auto flex max-w-[1180px] flex-col gap-3 px-4 pb-10 pt-3">
        <DauTrangHS tieuDe={`Boss: ${nd.ten}`} phu={nd.vai} />
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
          <TheHS className="flex flex-col items-center gap-2 p-3">
            <BossAnhHS key={`${tt}-${lan}`} ma={ma} tt={tt} cao={380} />
            <div className="flex flex-wrap justify-center gap-1.5">
              {(Object.keys(NHAN_TU_THE) as TuTheBoss[]).map((k) => (
                <button key={k} onClick={() => { setTt(k); setLan((n) => n + 1) }} className="rounded-full px-3 py-1 text-[12.5px] font-bold"
                  style={{ border: '1.5px solid var(--sk-line)', background: k === tt ? 'var(--sk-acc)' : 'var(--sk-surface2)', color: k === tt ? 'var(--sk-acc-ink)' : 'var(--sk-ink)' }}>{NHAN_TU_THE[k]}</button>
              ))}
            </div>
          </TheHS>
          <div className="flex flex-col gap-3">
            <NhomHS>Hội thoại (chạm khung để đi tiếp)</NhomHS>
            <div className="flex flex-wrap gap-1.5">
              {TINH_HUONG.map((t) => (
                <button key={t.k} onClick={() => setTh(t.k)} className="rounded-full px-3 py-1 text-[12.5px]"
                  style={{ border: '1.5px solid var(--sk-line)', background: t.k === th ? 'var(--sk-acc)' : 'var(--sk-surface2)', color: t.k === th ? 'var(--sk-acc-ink)' : 'var(--sk-ink)' }}>{t.ten}</button>
              ))}
            </div>
            <HoiThoaiBoss key={th} ma={ma} tinhHuong={th} so={SO_GIA} onTuThe={(t) => { setTt(t); setLan((n) => n + 1) }} />
            <NhomHS>3 chiêu</NhomHS>
            {nd.chieu.map((c) => (
              <TheHS key={c.ma} className="p-3">
                <p className="text-[14px] font-bold" style={{ ...HEAD, color: MAU.acc }}>{c.ten} <span className="font-normal" style={{ color: MAU.muted }}>· pha {c.phase}</span></p>
                <p className="mt-0.5 text-[13px]" style={{ color: MAU.ink }}>{c.thu}</p>
              </TheHS>
            ))}
            <NutHS onClick={() => setTran(true)}>Vào trận 3D thử</NutHS>
          </div>
        </div>
      </div>
    </div>
  )
}
