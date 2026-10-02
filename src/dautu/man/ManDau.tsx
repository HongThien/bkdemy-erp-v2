// MÀN TRẬN ĐẤU — dùng chung cho mọi chế độ (bot · 2 người 1 máy · online · giải). Chỉ hiển thị Snap + gửi câu trả lời.
import { useEffect, useMemo, useRef, useState } from 'react'
import type { PhienDau } from '../lib/phien'
import type { Snap } from '../lib/trongTai'
import { thongKe } from '../lib/trongTai'
import { TU_THEO_ID, TEN_LOAI, tenChuDe } from '../data/kho'
import { doc, phat, useCaiDat } from '../lib/amThanh'
import { capNhatNho, khoHoSo } from '../lib/hoSo'
import { ghiTran, type CheDo, type KetQuaGhi } from '../lib/api'
import { Avatar, Nut } from '../ui/Chung'
import { SanDau2D, type SuKienSan } from '../ui/SanDau2D'

const PHIM: string[][] = [['a', 's', 'z', 'x'], ['j', 'k', 'n', 'm']]
const PHIM_SO = ['1', '2', '3', '4']

export function ManDau({ phien, onThoat, onVeBang, nhanCheDo }: { phien: PhienDau; onThoat: () => void; onVeBang?: () => void; nhanCheDo: string }) {
  const [s, setS] = useState<Snap | null>(null)
  const [conLai, setConLai] = useState(0)
  const [chon, setChon] = useState<string | null>(null)
  const [suKien, setSuKien] = useState<SuKienSan | null>(null)
  const [tt, setTt] = useState(phien.tt.lay())
  const [ketQuaGhi, setKetQuaGhi] = useState<KetQuaGhi | null>(null)
  const [hoiThoat, setHoiThoat] = useState(false)
  const [hienKQ, setHienKQ] = useState(false)
  const hanRef = useRef(0)
  const daXuLy = useRef({ ket: '', het: '', vong: '' })
  const tuMoi = useRef<Set<string>>(new Set())
  const cd = useCaiDat()
  const laDoi = phien.loai === 'doi'
  const gheToi = phien.gheToi
  const toi = (gheToi[0] ?? 0) as 0 | 1
  const ban = (1 - toi) as 0 | 1
  const xemThoi = gheToi.length === 0 // khán giả (giải)

  useEffect(() => phien.tt.nghe(setTt), [phien])
  useEffect(() => phien.dangKy((sn) => {
    hanRef.current = performance.now() + sn.conLai
    setS(sn)
  }), [phien])
  useEffect(() => {
    const h = setInterval(() => setConLai(Math.max(0, hanRef.current - performance.now())), 100)
    return () => clearInterval(h)
  }, [])

  // ── xử lý chuyển pha (1 lần mỗi vòng) ──
  useEffect(() => {
    if (!s) return
    const khoaVong = s.mid + ':' + s.i
    if (s.pha === 'vong' && daXuLy.current.vong !== khoaVong) {
      daXuLy.current.vong = khoaVong
      setChon(null)
      const c = s.ds[s.i]
      const tu = TU_THEO_ID.get(c.id)
      if (tu && !khoHoSo.lay().nho[c.id]) tuMoi.current.add(c.id)
      if (tu && !c.dao && cd.tuDocTu) doc(tu.en)
      if (s.i === 0) phat('bat_dau')
    }
    if (s.pha === 'ket' && daXuLy.current.ket !== khoaVong) {
      daXuLy.current.ket = khoaVong
      const c = s.ds[s.i]
      const w = s.thangVong
      const benHienThi = (g: 0 | 1) => (laDoi ? g : g === toi ? 0 : 1) as 0 | 1
      if (w === 0 || w === 1) {
        setSuKien({ seq: Date.now(), loai: 'danh', ben: benHienThi(w) })
        phat(gheToi.includes(w) || laDoi ? 'dung' : 'sai')
        setTimeout(() => phat('chem'), 280)
      }
      for (const g of gheToi) {
        if (w === g) capNhatNho(c.id, true, s.giayThang)
        else if (s.sai[g].length) capNhatNho(c.id, false, 12)
        else if (s.dungCham[g]) capNhatNho(c.id, true, Math.max(2, s.giayThang + 0.5))
      }
      const tu = TU_THEO_ID.get(c.id)
      if (tu && c.dao && cd.tuDocTu) doc(tu.en)
    }
    if (s.pha === 'het' && s.ketQua && daXuLy.current.het !== s.mid) {
      daXuLy.current.het = s.mid
      const kq = s.ketQua
      setHienKQ(false)
      setTimeout(() => setHienKQ(true), kq.bo !== -1 || kq.thang === -1 ? 600 : 3400)
      setSuKien({ seq: Date.now(), loai: 'ket', ben: kq.thang === -1 ? -1 : laDoi ? kq.thang : kq.thang === toi ? 0 : 1 })
      if (!xemThoi) {
        const thang = laDoi ? true : kq.thang === toi
        phat(kq.thang === -1 ? 'thong_bao' : thang ? 'thang' : 'thua')
        const cheDo: CheDo = phien.loai === 'doi' ? 'doi' : phien.loai
        const ketQua = laDoi ? 'xong' : kq.thang === -1 ? 'hoa' : kq.thang === toi ? 'thang' : 'thua'
        ghiTran({ cheDo, chuDe: phien.chuDe, ketQua, soDung: s.dung[toi], soCau: s.ds.length, diem: s.diem[toi], doiThu: s.nguoi[ban]?.ten })
          .then((r) => { setKetQuaGhi(r); if (r?.len_cap) setTimeout(() => phat('len_cap'), 900) })
      }
    }
  }, [s?.seq, s?.mid])

  // ── phím tắt ──
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (!s || s.pha !== 'vong' || (e.target as HTMLElement)?.tagName === 'INPUT') return
      const k = e.key.toLowerCase()
      const c = s.ds[s.i]
      for (const g of gheToi) {
        const bo = laDoi ? PHIM[g] : PHIM[0]
        let idx = bo.indexOf(k)
        if (idx < 0 && !laDoi) idx = PHIM_SO.indexOf(k)
        if (idx >= 0 && c.opts[idx]) { traLoi(g, c.opts[idx]); e.preventDefault(); return }
      }
      if (k === ' ' && !c.dao) { const tu = TU_THEO_ID.get(c.id); if (tu) doc(tu.en) }
    }
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  })

  const traLoi = (g: 0 | 1, opt: string) => {
    if (!s || s.pha !== 'vong' || s.sai[g].includes(opt)) return
    if (!laDoi) setChon(opt)
    phat('click')
    phien.traLoi(g, opt)
  }

  const tamDung = s?.pha === 'dung'
  const thoat = () => {
    if (s && !s.ketQua && !xemThoi && phien.loai !== 'doi' && phien.loai !== 'bot') { setHoiThoat(true); return }
    onThoat()
  }

  if (!s) return <div className="man man-giua"><div className="dang-tai">Đang vào trận…</div></div>

  const c = s.ds[s.i]
  const tu = TU_THEO_ID.get(c.id)
  const pct = s.tong ? Math.min(100, (conLai / s.tong) * 100) : 0
  const giay = Math.ceil(conLai / 1000)
  const trai = laDoi ? 0 : toi
  const phai = laDoi ? 1 : ban

  return (
    <div className={'man man-dau' + (laDoi ? ' che-do-doi' : '')} style={{ backgroundImage: 'url(/bk-ui/hs/skin/rpg/bg_dao_troi_chibi_ngang.jpg)' }}>
      <div className="dau-hud">
        <TheNguoi s={s} g={trai as 0 | 1} ben="trai" />
        <div className="hud-giua">
          <div className="hud-nho">{nhanCheDo} · {tenChuDe(phien.chuDe)} · {s.ds.every((c) => !c.dao) ? 'Anh → Việt' : s.ds.every((c) => c.dao) ? 'Việt → Anh' : 'Trộn'}</div>
          <div className="hud-vong">Từ <b>{Math.min(s.i + 1, s.ds.length)}</b>/{s.ds.length}</div>
          <div className={'dong-ho' + (s.pha === 'vong' && giay <= 3 ? ' gap' : '')} style={{ ['--pct' as string]: s.pha === 'vong' ? pct : 0 }}>
            <span>{s.pha === 'vong' ? giay : s.pha === 'dem' ? '⏳' : '⏸'}</span>
          </div>
          <div className="hud-nut">
            {phien.coTamDung && !s.ketQua && <button className="nut-tron" onClick={() => phien.tamDung?.(!tamDung)} title="Tạm dừng">{tamDung ? '▶' : '⏸'}</button>}
            <button className="nut-tron" onClick={thoat} title="Thoát">✕</button>
          </div>
        </div>
        <TheNguoi s={s} g={phai as 0 | 1} ben="phai" />
      </div>

      {laDoi ? (
        <div className="dau-doi">
          <KhuTraLoi s={s} g={1} xoay onChon={(o) => traLoi(1, o)} phim={PHIM[1]} chon={null} />
          <div className="dau-doi-giua"><SanDau2D trai={s.nguoi[0].nv} phai={s.nguoi[1].nv} suKien={suKien} /></div>
          <KhuTraLoi s={s} g={0} onChon={(o) => traLoi(0, o)} phim={PHIM[0]} chon={null} />
        </div>
      ) : (
        <div className="dau-than">
          <div className="dau-san">
            <SanDau2D trai={s.nguoi[trai].nv} phai={s.nguoi[phai].nv} suKien={suKien} />
            {s.pha === 'ket' && s.thangVong !== null && (
              <div className={'bong-ket ' + (s.thangVong === toi ? 'tot' : s.thangVong === -1 ? 'trung' : 'xau')}>
                {s.thangVong === -1 ? '⌛ Hết giờ!' : s.thangVong === toi ? `+${s.cong[toi]} ⚡ ${s.giayThang}s` : xemThoi ? `${s.nguoi[s.thangVong].ten} +${s.cong[s.thangVong]}` : 'Chậm hơn một chút!'}
                {(s.thangVong === 0 || s.thangVong === 1) && s.chuoi[s.thangVong] > 0 && s.chuoi[s.thangVong] % 3 === 0 && <div className="chuoi-thuong">🔥 Chuỗi {s.chuoi[s.thangVong]}! +30</div>}
              </div>
            )}
          </div>
          {tu && <TheTu c={c} s={s} />}
          <KhuTraLoi s={s} g={toi} onChon={(o) => traLoi(toi, o)} phim={PHIM[0]} chon={chon} khoa={xemThoi} />
        </div>
      )}

      {s.pha === 'dem' && <div className="dem-nguoc"><div key={giay}>{giay > 0 ? giay : 'GO!'}</div><p>Ai đúng trước ăn từ đó!</p></div>}
      {tamDung && <div className="dem-nguoc"><div>⏸</div><p>Đang tạm dừng</p><Nut mau="xanh" onClick={() => phien.tamDung?.(false)}>Chơi tiếp</Nut></div>}
      {s.pha === 'het' && s.ketQua && hienKQ && (
        <KetQuaTran s={s} toi={toi} laDoi={laDoi} xemThoi={xemThoi} kq={ketQuaGhi} tuMoi={[...tuMoi.current]} tt={tt}
          onChoiLai={phien.choiLai && !onVeBang ? () => { setKetQuaGhi(null); setHienKQ(false); tuMoi.current = new Set(); phien.choiLai!() } : undefined}
          onVeBang={onVeBang} onThoat={onThoat} />
      )}
      {hoiThoat && (
        <div className="dem-nguoc">
          <p className="hoi">Thoát giữa trận online sẽ bị xử <b>thua</b>. Chắc chắn thoát?</p>
          <div className="hang-nut"><Nut mau="xam" onClick={() => setHoiThoat(false)}>Ở lại</Nut><Nut mau="do" onClick={onThoat}>Thoát</Nut></div>
        </div>
      )}
      {tt.doiThuRoi && !s.ketQua && <div className="bang-tin">Đối thủ đã rời trận</div>}
    </div>
  )
}

function TheNguoi({ s, g, ben }: { s: Snap; g: 0 | 1; ben: 'trai' | 'phai' }) {
  const n = s.nguoi[g]
  const thang = s.pha === 'ket' && s.thangVong === g
  return (
    <div className={'the-nguoi ' + ben + (thang ? ' an-diem' : '')}>
      <Avatar nv={n.nv} co={52} />
      <div className="the-nguoi-chu">
        <div className="ten">{n.ten}{n.bot && <span className="nhan-bot">BOT</span>}</div>
        <div className="diem">{s.diem[g]}</div>
        <div className="phu">✔ {s.dung[g]} {s.chuoi[g] >= 2 && <span className="lua">🔥{s.chuoi[g]}</span>}</div>
      </div>
      {thang && s.cong[g] > 0 && <div className="cong-bay">+{s.cong[g]}</div>}
    </div>
  )
}

function TheTu({ c, s }: { c: Snap['ds'][number]; s: Snap }) {
  const tu = TU_THEO_ID.get(c.id)!
  return (
    <div className="the-tu giay" key={s.mid + s.i}>
      {c.dao ? (
        <>
          <div className="the-tu-nhan">Chọn từ tiếng Anh có nghĩa:</div>
          <div className="the-tu-chu vi">{tu.vi}</div>
          <div className="the-tu-phu">{TEN_LOAI[tu.pos]}</div>
        </>
      ) : (
        <>
          <div className="the-tu-nhan">Chọn nghĩa tiếng Việt đúng:</div>
          <div className="the-tu-chu">{tu.en} <button className="nut-loa" onClick={() => doc(tu.en)} aria-label="Nghe phát âm">🔊</button></div>
          <div className="the-tu-phu">{tu.ipa} · {TEN_LOAI[tu.pos]}</div>
        </>
      )}
      {s.pha === 'ket' && <div className="the-tu-vd">“{tu.vd}” <i>— {tu.vdvi}</i></div>}
    </div>
  )
}

function KhuTraLoi({ s, g, onChon, phim, chon, xoay, khoa }: { s: Snap; g: 0 | 1; onChon: (o: string) => void; phim: string[]; chon: string | null; xoay?: boolean; khoa?: boolean }) {
  const c = s.ds[s.i]
  const tuDung = TU_THEO_ID.get(c.id)
  const ket = s.pha === 'ket' || s.pha === 'het'
  return (
    <div className={'khu-tra-loi' + (xoay ? ' xoay' : '')}>
      {xoay && tuDung && (
        <div className="the-tu nho giay">
          <div className="the-tu-chu">{c.dao ? tuDung.vi : tuDung.en}</div>
        </div>
      )}
      <div className="luoi-dap-an">
        {c.opts.map((o, k) => {
          const t = TU_THEO_ID.get(o)
          const sai = s.sai[g].includes(o)
          const dung = o === c.id
          let lop = ''
          if (ket && dung) lop = s.thangVong === g ? 'dung-thang' : 'dung'
          else if (sai) lop = 'sai'
          else if (chon === o && s.pha === 'vong') lop = 'dang-chon'
          return (
            <button key={o} className={'dap-an ' + lop} disabled={khoa || s.pha !== 'vong' || sai} onClick={() => onChon(o)}>
              <span className="phim">{phim[k].toUpperCase()}</span>
              <span className="chu">{c.dao ? t?.en : t?.vi}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function KetQuaTran({ s, toi, laDoi, xemThoi, kq, tuMoi, tt, onChoiLai, onVeBang, onThoat }: {
  s: Snap; toi: 0 | 1; laDoi: boolean; xemThoi: boolean; kq: KetQuaGhi | null; tuMoi: string[]; tt: { doiThuMuonLai: boolean; toiMuonLai: boolean; doiThuRoi: boolean }
  onChoiLai?: () => void; onVeBang?: () => void; onThoat: () => void
}) {
  const k = s.ketQua!
  const ban = (1 - toi) as 0 | 1
  const tieuDe = k.thang === -1 ? 'Hoà! Ngang tài ngang sức' : laDoi || xemThoi ? `${s.nguoi[k.thang].ten} chiến thắng!` : k.thang === toi ? 'Em chiến thắng! 🎉' : `${s.nguoi[ban].ten} thắng rồi!`
  const phu = k.bo !== -1 ? `${s.nguoi[k.bo].ten} đã rời trận` : k.thang === -1 ? 'Hai bên bằng điểm' : !laDoi && !xemThoi && k.thang !== toi ? 'Một trận rất hay. Thử lại nhé!' : 'Tốc độ và độ chính xác tuyệt vời!'
  const tuTran = useMemo(() => s.ds.map((c) => TU_THEO_ID.get(c.id)!).filter(Boolean), [s.mid])
  const moi = new Set(tuMoi)
  return (
    <div className="ket-qua-nen">
      <div className="ket-qua giay">
        <div className={'ket-qua-dau ' + (k.thang === toi || laDoi ? 'thang' : k.thang === -1 ? 'hoa' : 'thua')}>
          <h2>{tieuDe}</h2>
          <p>{phu}</p>
        </div>
        <div className="ket-qua-2ben">
          {([0, 1] as const).map((g) => {
            const t = thongKe(s, g)
            return (
              <div key={g} className={'kq-ben' + (k.thang === g ? ' kq-thang' : '')}>
                <Avatar nv={s.nguoi[g].nv} co={64} />
                <div className="kq-ten">{s.nguoi[g].ten}{k.thang === g && ' 👑'}</div>
                <div className="kq-diem">{s.diem[g]}</div>
                <div className="kq-so">
                  <span>✔ Đúng <b>{t.dung}</b></span>
                  <span>⚡ Nhanh nhất <b>{t.nhanhNhat ?? '—'}{t.nhanhNhat ? 's' : ''}</b></span>
                  <span>🎯 Chính xác <b>{t.chinhXac}%</b></span>
                  <span>🔥 Chuỗi <b>{t.chuoi}</b></span>
                </div>
              </div>
            )
          })}
        </div>
        {!xemThoi && (
          <div className="kq-xp">
            {kq ? <>+{kq.xp_nhan} XP {kq.len_cap && <b className="len-cap">LÊN CẤP {kq.ho_so.cap}! 🎉</b>} · 🔥 Chuỗi ngày {kq.ho_so.chuoi_ngay} · 🏆 Chuỗi thắng {kq.ho_so.chuoi_thang}</> : 'Đang lưu kết quả…'}
          </div>
        )}
        <div className="kq-tu">
          <div className="kq-tu-dau">Từ trong trận {moi.size > 0 && <span>· {moi.size} từ mới ✨</span>}</div>
          <div className="kq-tu-ds">
            {tuTran.map((t) => (
              <button key={t.id} className={'chip-tu' + (moi.has(t.id) ? ' moi' : '')} onClick={() => doc(t.en)} title={t.vd}>
                <b>{t.en}</b> <span>{t.vi}</span> 🔊
              </button>
            ))}
          </div>
        </div>
        <div className="hang-nut">
          {onVeBang ? <Nut mau="vang" to onClick={onVeBang}>Về bảng đấu</Nut> : (
            <>
              <Nut mau="xam" onClick={onThoat}>Về sảnh</Nut>
              {onChoiLai && !tt.doiThuRoi && (
                <Nut mau="xanh" to onClick={onChoiLai} disabled={tt.toiMuonLai}>
                  {tt.toiMuonLai ? 'Chờ đối thủ…' : tt.doiThuMuonLai ? 'Đối thủ muốn đấu lại!' : 'Chơi lại'}
                </Nut>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
