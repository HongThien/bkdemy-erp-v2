// Hộp thoại: tạo nhân vật · hồ sơ · bảng xếp hạng · cài đặt · góp ý.
import { useEffect, useState } from 'react'
import { useHoSo, datDB, type NvId } from '../lib/hoSo'
import { bangXepHang, gopY, luuHoSo, type DongBxh, type TieuChi } from '../lib/api'
import { khoCaiDat, useCaiDat } from '../lib/amThanh'
import { Avatar, DS_NV, Modal, Nut, TEN_NV, chepVao, toast } from '../ui/Chung'

function ChonNv({ nv, setNv }: { nv: NvId; setNv: (n: NvId) => void }) {
  return (
    <div className="luoi-nv">
      {DS_NV.map((n) => (
        <button key={n} className={'o-nv' + (nv === n ? ' bat' : '')} onClick={() => setNv(n)}>
          <Avatar nv={n} co={72} /><span>{TEN_NV[n]}</span>
        </button>
      ))}
    </div>
  )
}

export function TaoNhanVat() {
  const [ten, setTen] = useState('')
  const [nv, setNv] = useState<NvId>('knight')
  const [dang, setDang] = useState(false)
  const loi = ten.trim().length < 2 ? 'Tên cần ít nhất 2 ký tự' : ten.trim().length > 25 ? 'Tên tối đa 25 ký tự' : ''
  const tao = async () => {
    setDang(true)
    try {
      const db = await luuHoSo(ten.trim(), nv)
      if (!db) datDB({ ma: 'BK-MAY', ten: ten.trim(), nv, xp: 0, cap: 1, xp_trong_cap: 0, can_cho_cap_sau: 100, so_tran: 0, so_thang: 0, chuoi_thang: 0, chuoi_thang_max: 0, chuoi_ngay: 0, hoc_hom_nay: false })
    } catch (e) { toast('Chưa lưu được hồ sơ: ' + (e as Error).message, 'loi') } finally { setDang(false) }
  }
  return (
    <Modal tieuDe="✨ Chào mừng chiến binh mới!" rong={640}>
      <p className="mo">Chọn nhân vật và đặt tên để bắt đầu đấu từ vựng nhé!</p>
      <ChonNv nv={nv} setNv={setNv} />
      <label className="nhan-o">Tên nhân vật / biệt danh của em
        <input className="o-nhap" autoFocus maxLength={25} value={ten} onChange={(e) => setTen(e.target.value)} placeholder="Nhập tên của em…" onKeyDown={(e) => { if (e.key === 'Enter' && !loi) tao() }} />
      </label>
      {ten && loi && <p className="loi">{loi}</p>}
      <div className="hang-nut"><Nut mau="xanh" to disabled={!!loi || dang} onClick={tao}>{dang ? 'Đang tạo…' : '⚔️ Bắt đầu chơi'}</Nut></div>
    </Modal>
  )
}

export function HoSoModal({ onDong }: { onDong: () => void }) {
  const h = useHoSo()
  const db = h.db!
  const [ten, setTen] = useState(db.ten)
  const [nv, setNv] = useState<NvId>(db.nv)
  const doi = ten.trim() !== db.ten || nv !== db.nv
  const luu = async () => {
    try { await luuHoSo(ten.trim(), nv); toast('Đã lưu hồ sơ', 'ok') } catch (e) { toast((e as Error).message, 'loi') }
  }
  const pct = db.can_cho_cap_sau ? (db.xp_trong_cap / db.can_cho_cap_sau) * 100 : 0
  return (
    <Modal tieuDe="🛡️ Hồ sơ chiến binh" onDong={onDong} rong={680}>
      <div className="ho-so-dau">
        <Avatar nv={nv} co={96} />
        <div>
          <input className="o-nhap ten-lon" value={ten} maxLength={25} onChange={(e) => setTen(e.target.value)} />
          <div className="ma-the" onClick={() => chepVao(db.ma)}>ID: <b>{db.ma}</b> 📋</div>
          <div className="thanh-xp"><div style={{ width: pct + '%' }} /></div>
          <small>Cấp {db.cap} · {db.xp_trong_cap}/{db.can_cho_cap_sau} XP · Tổng {db.xp} XP</small>
        </div>
      </div>
      <div className="luoi-so nho">
        <div className="o-so"><b>🔥 {db.chuoi_ngay}</b><span>Chuỗi ngày học</span></div>
        <div className="o-so"><b>🏆 {db.chuoi_thang}</b><span>Chuỗi thắng (kỷ lục {db.chuoi_thang_max})</span></div>
        <div className="o-so"><b>{db.so_thang}/{db.so_tran}</b><span>Trận thắng</span></div>
      </div>
      <p className="mo">{db.hoc_hom_nay ? 'Hôm nay em đã học — giữ lửa nhé!' : 'Học ngay hôm nay để thắp sáng chuỗi lửa!'}</p>
      <h4>Đổi nhân vật</h4>
      <ChonNv nv={nv} setNv={setNv} />
      <div className="hang-nut"><Nut mau="xanh" disabled={!doi || ten.trim().length < 2} onClick={luu}>Lưu thay đổi</Nut></div>
    </Modal>
  )
}

const TAB: { id: TieuChi; ten: string; dv: string }[] = [
  { id: 'xp', ten: 'Tổng XP', dv: 'XP' },
  { id: 'chuoi_thang', ten: 'Chuỗi thắng', dv: 'trận' },
  { id: 'chuoi_ngay', ten: 'Chuỗi ngày học', dv: 'ngày' },
]
export function BxhModal({ onDong }: { onDong: () => void }) {
  const [tc, setTc] = useState<TieuChi>('xp')
  const [kq, setKq] = useState<{ top: DongBxh[]; toi: { hang: number; gt: number } | null } | null>(null)
  const [loi, setLoi] = useState(false)
  const h = useHoSo()
  useEffect(() => {
    setKq(null); setLoi(false)
    bangXepHang(tc).then((r) => setKq(r ?? { top: [], toi: null })).catch(() => setLoi(true))
  }, [tc])
  const dv = TAB.find((t) => t.id === tc)!.dv
  const top3 = kq?.top.slice(0, 3) ?? []
  return (
    <Modal tieuDe="🏆 Bảng xếp hạng" onDong={onDong} rong={640}>
      <p className="mo">Cùng học, cùng đấu và chinh phục vị trí dẫn đầu!</p>
      <div className="chip-hang">{TAB.map((t) => <button key={t.id} className={'chip' + (tc === t.id ? ' bat' : '')} onClick={() => setTc(t.id)}><b>{t.ten}</b></button>)}</div>
      {loi ? <p className="loi">Chưa thể tải bảng xếp hạng.</p> : !kq ? <p className="mo">Đang tải…</p> : !kq.top.length ? <p className="mo">Chưa có người chơi nào trên bảng xếp hạng.</p> : (
        <>
          <div className="buc-vinh-danh">
            {[1, 0, 2].map((k) => top3[k] && (
              <div key={k} className={'bvd bvd-' + (k + 1)}>
                <Avatar nv={top3[k].nv} co={k === 0 ? 72 : 56} />
                <b>{top3[k].ten}</b>
                <small>{top3[k].gt} {dv}</small>
                <div className="bvd-cot">{k + 1}</div>
              </div>
            ))}
          </div>
          <div className="ds-bxh">
            {kq.top.slice(3).map((d) => (
              <div key={d.ma} className={'dong-bxh' + (d.ma === h.db?.ma ? ' la-toi' : '')}>
                <span className="hang">{d.hang}</span><Avatar nv={d.nv} co={32} vien={false} /><b>{d.ten}</b><small>Lv.{d.cap}</small><span className="gt">{d.gt} {dv}</span>
              </div>
            ))}
          </div>
          <div className="dong-bxh la-toi">{kq.toi ? <>Em đang hạng <b>{kq.toi.hang}</b> · {kq.toi.gt} {dv}</> : 'Em chưa có trên bảng — chơi một trận để lên bảng nhé!'}</div>
        </>
      )}
    </Modal>
  )
}

export function CaiDatModal({ onDong }: { onDong: () => void }) {
  const c = useCaiDat()
  const [gopYMo, setGopYMo] = useState(false)
  const [nd, setNd] = useState('')
  const dat = (p: Partial<typeof c>) => khoCaiDat.dat({ ...c, ...p })
  const gui = async () => {
    try { await gopY(nd.trim()); toast('Cảm ơn em đã góp ý!', 'ok'); setNd(''); setGopYMo(false) } catch (e) { toast((e as Error).message, 'loi') }
  }
  return (
    <Modal tieuDe="⚙️ Cài đặt trò chơi" onDong={onDong}>
      <div className="dong-cai-dat"><div><b>Âm thanh & hiệu ứng</b><small>Tiếng thắng/thua, đồng hồ, chém</small></div><button className={'cong-tac' + (c.amThanh ? ' bat' : '')} onClick={() => dat({ amThanh: !c.amThanh })} /></div>
      <div className="dong-cai-dat"><div><b>Tự đọc từ</b><small>Phát âm từ tiếng Anh mỗi câu</small></div><button className={'cong-tac' + (c.tuDocTu ? ' bat' : '')} onClick={() => dat({ tuDocTu: !c.tuDocTu })} /></div>
      <div className="dong-cai-dat"><div><b>Giọng đọc</b><small>Chọn giọng nữ hoặc nam (tuỳ máy có)</small></div>
        <div className="chip-hang nho"><button className={'chip' + (c.giongNu ? ' bat' : '')} onClick={() => dat({ giongNu: true })}><b>Nữ</b></button><button className={'chip' + (!c.giongNu ? ' bat' : '')} onClick={() => dat({ giongNu: false })}><b>Nam</b></button></div></div>
      <div className="dong-cai-dat"><div><b>Đồ hoạ</b><small>Đẹp = sàn đấu 3D · Nhẹ = 2D cho máy yếu (iPad cũ)</small></div>
        <div className="chip-hang nho"><button className={'chip' + (c.doHoa === '3d' ? ' bat' : '')} onClick={() => dat({ doHoa: '3d' })}><b>Đẹp (3D)</b></button><button className={'chip' + (c.doHoa === '2d' ? ' bat' : '')} onClick={() => dat({ doHoa: '2d' })}><b>Nhẹ (2D)</b></button></div></div>
      <div className="dong-cai-dat cot"><b>Phím tắt (máy tính)</b>
        <small>Trả lời: <code>A</code> <code>S</code> <code>Z</code> <code>X</code> hoặc <code>1</code>–<code>4</code> · Nghe lại: <code>Space</code></small>
        <small>2 người 1 máy — Người 1: <code>A</code> <code>S</code> <code>Z</code> <code>X</code> · Người 2: <code>J</code> <code>K</code> <code>N</code> <code>M</code></small>
      </div>
      <div className="dong-cai-dat"><div><b>Góp ý cho BK Đấu Từ</b><small>Chia sẻ ý tưởng, báo lỗi hoặc góp ý giao diện</small></div><Nut mau="lam" onClick={() => setGopYMo(!gopYMo)}>Góp ý</Nut></div>
      {gopYMo && (
        <div className="cot-gop-y">
          <textarea className="o-nhap" rows={4} value={nd} onChange={(e) => setNd(e.target.value)} placeholder="Em muốn góp ý điều gì?" />
          <Nut mau="xanh" disabled={nd.trim().length < 3} onClick={gui}>Gửi góp ý</Nut>
        </div>
      )}
    </Modal>
  )
}
