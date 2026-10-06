// LEO THÁP — menu 2 chế độ + bảng xếp hạng (hôm nay / kỷ lục) · màn leo · kết quả. Luật ở lib/thap.ts.
// Câu lấy từ NGUỒN của môn (nguon/): tháp hôm nay = chuỗi TẤT ĐỊNH theo (môn + khối + chế độ + ngày VN); BXH tách theo môn + khối.
import { useEffect, useRef, useState } from 'react'
import { THAP, MS_SONG_CON, PHAT_SAI_MS, bxhThap, ghiThap, giayVoTan, type BxhThap, type CheDoThap } from '../lib/thap'
import { capNhatNho } from '../lib/hoSo'
import { CD_NHUNG, CHE_NHUNG, KHOI_NHUNG, TCD_NHUNG } from '../lib/nhung'
import { doc, phat, useCaiDat } from '../lib/amThanh'
import { ngayVN } from '../lib/tienich'
import type { Cau, CapNguon, NguonCau } from '../nguon'
import { ChuMon } from '../../screens/kho/ui'
import { anhDau, hopDau, type TuTheDau } from '../../screens/hocsinh/skin/heroDau'
import { Avatar, DauMan, NHAN_VAT, Nut, nvChuan } from '../ui/Chung'
import type { NguoiTran } from '../lib/trongTai'
import { HINH_GAME } from '../hinhGame'

const PHIM = ['a', 's', 'z', 'x']
/** Biểu tượng Leo tháp = ngọn tháp pháp sư của bộ bản đồ phiêu lưu (tranh ChatGPT, cùng tông tím–vàng của game). */
export const ANH_THAP = HINH_GAME.icon.thap

export function ManLeoThap({ toi, nguon, cap, setCap, onLui }: { toi: NguoiTran; nguon: NguonCau; cap: string; setCap: (c: string) => void; onLui: () => void }) {
  const [che, setChe] = useState<CheDoThap | null>(CHE_NHUNG) // màn tháp của app HS đã chọn chế độ ⇒ vào thẳng ván
  const [lan, setLan] = useState(0) // đổi key để leo lại
  const [dsCap, setDsCap] = useState<CapNguon[]>([])
  useEffect(() => { if (!nguon.coNhoTu) nguon.dsCap().then(setDsCap).catch(() => {}) }, [nguon])
  const nhom = nguon.nhomThap(cap, CD_NHUNG)
  if (che) return <VanThap key={che + lan} che={che} toi={toi} nguon={nguon} cap={cap} onLeoLai={() => setLan((x) => x + 1)} onLui={() => (CHE_NHUNG ? onLui() : setChe(null))} />
  return (
    <div className="man">
      <DauMan tieuDe={<span className="tieu-thap"><img src={ANH_THAP} alt="" />Leo tháp · {nguon.icon} {nguon.ten}</span>}
        phu={`Tháp hôm nay ${ngayVN().split('-').reverse().join('/')} — mọi người cùng một tháp, cùng câu hỏi. 0h tháp mới.`} onLui={onLui} />
      {!nguon.coNhoTu && !KHOI_NHUNG && (
        <div className="chip-hang cuon">
          <span className="nhan-hang">{nguon.tenCap}:</span>
          {dsCap.map((c) => <button key={c.id} className={'chip' + (cap === c.id ? ' bat' : '')} onClick={() => setCap(c.id)}><b>{c.ten}</b></button>)}
        </div>
      )}
      <div className="luoi-2 thap-menu">
        {(Object.keys(THAP) as CheDoThap[]).map((c) => (
          <div key={c} className="giay o-phong the-thap">
            <div className="thap-dau"><span className="cd-icon">{THAP[c].icon}</span><h3>{THAP[c].ten}</h3></div>
            <ul className="luat-thap">{THAP[c].luat(nguon.giayThap).map((l) => <li key={l}>{l}</li>)}</ul>
            <Nut mau={c === 'song_con' ? 'xanh' : 'tim'} to onClick={() => setChe(c)}>Leo ngay</Nut>
            <BangThap che={c} mon={nguon.mon} nhom={nhom} gon />
          </div>
        ))}
      </div>
    </div>
  )
}

function moTa(che: CheDoThap, d: { sai: number; ms: number }) {
  return che === 'song_con' ? `${d.sai} sai` : `${(d.ms / 1000).toFixed(1)}s`
}

export function BangThap({ che, mon, nhom, gon, lamMoi }: { che: CheDoThap; mon: string; nhom: string; gon?: boolean; lamMoi?: number }) {
  const [homNay, setHomNay] = useState(true)
  const [kq, setKq] = useState<BxhThap | null>(null)
  const [loi, setLoi] = useState(false)
  useEffect(() => {
    setKq(null); setLoi(false)
    bxhThap(che, mon, nhom, homNay).then((r) => setKq(r ?? { so_nguoi: 0, top: [], toi: null })).catch(() => setLoi(true))
  }, [che, mon, nhom, homNay, lamMoi])
  const ds = kq?.top.slice(0, gon ? 8 : 50) ?? []
  return (
    <div className="bang-thap">
      <div className="chip-hang nho">
        <button className={'chip' + (homNay ? ' bat' : '')} onClick={() => setHomNay(true)}><b>Hôm nay</b></button>
        <button className={'chip' + (!homNay ? ' bat' : '')} onClick={() => setHomNay(false)}><b>Kỷ lục</b></button>
        {kq && <small className="mo">{kq.so_nguoi} người đã leo</small>}
      </div>
      {loi ? <p className="loi">Chưa tải được bảng xếp hạng.</p> : !kq ? <p className="mo">Đang tải…</p> : !ds.length ? <p className="mo">Chưa ai leo — em mở hàng nhé!</p> : (
        <div className="ds-bxh">
          {ds.map((d) => (
            <div key={d.ma} className={'dong-bxh' + (kq.toi && kq.toi.hang === d.hang ? ' la-toi-nhe' : '')}>
              <span className="hang">{d.hang <= 3 ? ['🥇', '🥈', '🥉'][d.hang - 1] : d.hang}</span>
              <Avatar nv={d.nv} co={30} vien={false} /><b>{d.ten}</b><small>{moTa(che, d)}</small><span className="gt">{d.tang} tầng</span>
            </div>
          ))}
        </div>
      )}
      {kq && <div className="dong-bxh la-toi">{kq.toi ? <>Em hạng <b>#{kq.toi.hang}</b> · {kq.toi.tang} tầng · {moTa(che, kq.toi)}</> : 'Em chưa leo tháp này'}</div>}
    </div>
  )
}

type Pha = 'tai' | 'dem' | 'choi' | 'chet' | 'xong'
interface KetQuaLeo { tang: number; sai: number; ms: number; cauSai: Cau[] }

function VanThap({ che, toi, nguon, cap, onLeoLai, onLui }: { che: CheDoThap; toi: NguoiTran; nguon: NguonCau; cap: string; onLeoLai: () => void; onLui: () => void }) {
  const [ds, setDs] = useState<Cau[] | null>(null)
  const [loiTai, setLoiTai] = useState('')
  const cd = useCaiDat()
  const [pha, setPha] = useState<Pha>('tai')
  const [i, setI] = useState(0)
  const [tang, setTang] = useState(0)
  const [sai, setSai] = useState(0)
  const [daSai, setDaSai] = useState<string | null>(null)
  const [hienDung, setHienDung] = useState(false)
  const [bay, setBay] = useState(performance.now())
  const [pose, setPose] = useState<'nghi' | 'len' | 'trung' | 'guc'>('nghi')
  const [kq, setKq] = useState<KetQuaLeo | null>(null)
  const batDau = useRef(0)
  const han = useRef(0) // Sinh tồn: hết 5 phút · Vô tận: hết giờ câu hiện tại
  const lucCau = useRef(0)
  const khoa = useRef(false)
  const cauSai = useRef<Cau[]>([])
  const daXong = useRef(false)
  const gioi = NHAN_VAT[nvChuan(toi.nv)].gioi
  const goc = nguon.giayThap
  const buoc = Math.max(1, Math.round(goc * 0.1))

  // tháp hôm nay (tất định) → đếm ngược 3s
  useEffect(() => {
    nguon.taoThap(che, ngayVN(), cap, CD_NHUNG).then((d) => { setDs(d); setPha('dem') }).catch((e) => setLoiTai((e as Error).message))
  }, [che, nguon, cap])
  useEffect(() => {
    if (pha !== 'dem') return
    const h = setTimeout(() => {
      const t = performance.now()
      batDau.current = t
      lucCau.current = t
      han.current = t + (che === 'song_con' ? MS_SONG_CON : giayVoTan(0, goc) * 1000)
      setPha('choi')
      phat('bat_dau')
    }, 3000)
    return () => clearTimeout(h)
  }, [pha === 'dem']) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { const h = setInterval(() => setBay(performance.now()), 100); return () => clearInterval(h) }, [])

  const cau = ds?.[i]
  useEffect(() => { if (pha === 'choi' && cau?.doc && !cau.dao && cd.tuDocTu) doc(cau.doc) }, [i, pha]) // eslint-disable-line react-hooks/exhaustive-deps

  const ketThuc = (cuoi: { tang: number; sai: number }) => {
    if (daXong.current) return
    daXong.current = true
    const ms = Math.min(performance.now() - batDau.current, che === 'song_con' ? MS_SONG_CON : Infinity)
    setKq({ tang: cuoi.tang, sai: cuoi.sai, ms, cauSai: cauSai.current })
    setPha('xong')
  }

  // hết giờ · hết câu trong tháp hôm nay
  useEffect(() => {
    if (pha !== 'choi') return
    if (ds && i >= ds.length) { ketThuc({ tang, sai }); return }
    if (bay < han.current) return
    if (che === 'song_con') { phat('thong_bao'); ketThuc({ tang, sai }) }
    else chet()
  }, [bay]) // eslint-disable-line react-hooks/exhaustive-deps

  const chet = () => {
    if (pha !== 'choi' || !cau) return
    setPha('chet'); setPose('guc'); setHienDung(true); phat('thua')
    cauSai.current = [...cauSai.current, cau]
    if (cau.tuId) capNhatNho(cau.tuId, false, 12)
    setTimeout(() => ketThuc({ tang, sai: sai + 1 }), 1800)
  }

  const chon = (opt: string) => {
    if (pha !== 'choi' || !cau || khoa.current || opt === daSai) return
    const giay = (performance.now() - lucCau.current) / 1000
    if (opt === cau.dung) {
      phat('dung')
      if (cau.tuId) capNhatNho(cau.tuId, true, giay)
      const t = tang + 1
      setTang(t); setPose('len'); setTimeout(() => setPose('nghi'), 500)
      setI(i + 1); setDaSai(null)
      lucCau.current = performance.now()
      if (che === 'vo_tan') han.current = lucCau.current + giayVoTan(t, goc) * 1000
      if (t % 10 === 0) phat('len_cap')
      return
    }
    // sai
    phat('sai')
    if (cau.tuId) capNhatNho(cau.tuId, false, giay)
    if (che === 'vo_tan') { setDaSai(opt); chet(); return }
    cauSai.current = [...cauSai.current, cau]
    setSai(sai + 1); setDaSai(opt); setHienDung(true); setPose('trung')
    han.current -= PHAT_SAI_MS
    khoa.current = true
    setTimeout(() => { khoa.current = false; setDaSai(null); setHienDung(false); setPose('nghi'); setI((x) => x + 1); lucCau.current = performance.now() }, cau.giai ? 1600 : 900)
  }

  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (!cau) return
      const k = e.key.toLowerCase()
      let idx = PHIM.indexOf(k)
      if (idx < 0) idx = ['1', '2', '3', '4'].indexOf(k)
      if (idx >= 0 && cau.opts[idx]) chon(cau.opts[idx].id)
    }
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  })

  if (pha === 'xong' && kq) return <KetQuaThap che={che} nguon={nguon} cap={cap} kq={kq} onLeoLai={onLeoLai} onLui={onLui} />
  if (!ds || !cau) return (
    <div className="man man-giua"><div className="tim-tran giay"><img className="thap-dem" src={ANH_THAP} alt="" /><h2>{loiTai ? 'Chưa mở được tháp' : 'Đang dựng tháp hôm nay…'}</h2>{loiTai && <p className="loi">{loiTai}</p>}<Nut mau="xam" onClick={onLui}>Quay lại</Nut></div></div>
  )

  const conLai = Math.max(0, han.current - bay)
  const tongCau = giayVoTan(tang, goc) * 1000
  const dungTx = cau.opts.find((o) => o.id === cau.dung)?.text ?? ''
  return (
    <div className="man man-thap" style={{ backgroundImage: `url(${HINH_GAME.nenDau})` }}>
      <div className="thap-hud">
        <button className="nut-lui" onClick={() => (pha === 'choi' ? ketThuc({ tang, sai }) : onLui())} aria-label="Dừng leo">‹</button>
        <div className="thap-ten"><b>{THAP[che].icon} {THAP[che].ten} · {nguon.ten}</b><small>Tháp hôm nay · {pha === 'choi' ? 'bấm ‹ để dừng và ghi kết quả' : ''}</small></div>
        <div className="thap-so"><span>Tầng</span><b>{tang}</b></div>
        {che === 'song_con'
          ? <div className={'thap-gio' + (conLai < 30000 ? ' gap' : '')}><span>Còn</span><b>{pha === 'dem' ? '5:00' : `${Math.floor(conLai / 60000)}:${String(Math.floor((conLai % 60000) / 1000)).padStart(2, '0')}`}</b><small>Sai: {sai} (−3s mỗi lần)</small></div>
          : <div className={'dong-ho' + (conLai < 3000 && pha === 'choi' ? ' gap' : '')} style={{ ['--pct' as string]: pha === 'choi' ? (conLai / tongCau) * 100 : 100 }}><span>{pha === 'choi' ? Math.ceil(conLai / 1000) : giayVoTan(tang, goc)}</span></div>}
      </div>
      <div className="thap-than">
        <ThapVe tang={tang} gioi={gioi} pose={pose} che={che} buoc={buoc} />
        <div className="thap-cau">
          <div className={'the-tu giay' + (cau.tuId ? '' : ' the-cau')} key={i}>
            <div className="the-tu-nhan">{cau.nhan} {che === 'vo_tan' && <span className="nhan-giay">⏱ {giayVoTan(tang, goc)}s/câu</span>}</div>
            <div className={'the-tu-chu' + (cau.tuId ? (cau.dao ? ' vi' : '') : ' de-dai')}>
              <ChuMon mon={nguon.mon}>{cau.de}</ChuMon> {cau.doc && !cau.dao && <button className="nut-loa" onClick={() => doc(cau.doc!)}>🔊</button>}
            </div>
            {cau.anh && <img className="anh-de" src={cau.anh} alt="Hình của đề" />}
            {cau.phu && <div className="the-tu-phu">{cau.phu}</div>}
            {hienDung && cau.giai && <div className="the-tu-vd"><ChuMon mon={nguon.mon}>{cau.giai}</ChuMon></div>}
          </div>
          <div className="luoi-dap-an">
            {cau.opts.map(({ id: o, text }, k) => {
              const lop = hienDung && o === cau.dung ? 'dung' : daSai === o ? 'sai' : ''
              return (
                <button key={o} className={'dap-an ' + lop} disabled={pha !== 'choi' || daSai === o} onClick={() => chon(o)}>
                  <span className="phim">{PHIM[k].toUpperCase()}</span><span className="chu"><ChuMon mon={nguon.mon}>{text}</ChuMon></span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
      {pha === 'dem' && <div className="dem-nguoc"><img className="thap-dem" src={ANH_THAP} alt="" /><p>{THAP[che].ten} — chuẩn bị leo!</p><p className="mo-trang">{THAP[che].luat(goc).join(' · ')}</p></div>}
      {pha === 'chet' && <div className="bang-tin thap-chet">💥 Rơi ở tầng {tang}! Đáp án: <b><ChuMon mon={nguon.mon}>{dungTx}</ChuMon></b></div>}
    </div>
  )
}

/** Tháp vẽ bằng CSS: các tầng trượt xuống khi leo, nhân vật đứng ở tầng hiện tại. Mốc mỗi 10 tầng. */
function ThapVe({ tang, gioi, pose, che, buoc }: { tang: number; gioi: 'nam' | 'nu'; pose: 'nghi' | 'len' | 'trung' | 'guc'; che: CheDoThap; buoc: number }) {
  const FH = 58
  const [nhip, setNhip] = useState(false)
  useEffect(() => { const h = setInterval(() => setNhip((x) => !x), 900); return () => clearInterval(h) }, [])
  const p: TuTheDau = pose === 'len' ? 'thang_1' : pose === 'trung' ? 'bi_danh_1' : pose === 'guc' ? 'guc' : nhip ? 'dung_2' : 'dung_1'
  const tu = Math.max(0, tang - 3), den = tang + 6
  const caoNv = 84
  const hv = hopDau(gioi, p, caoNv, 40, caoNv)
  return (
    <div className="thap-ve">
      <div className="thap-trong" style={{ transform: `translateY(${(tang - 2) * FH}px)` }}>
        {Array.from({ length: den - tu + 1 }, (_, k) => tu + k).map((t) => (
          <div key={t} className={'tang' + (t === tang ? ' hien-tai' : t < tang ? ' da-qua' : '') + (t > 0 && t % 10 === 0 ? ' moc' : '')} style={{ bottom: t * FH, height: FH - 4 }}>
            <span className="so-tang">{t === 0 ? 'Chân tháp' : t}</span>
            {t > 0 && t % 10 === 0 && <span className="co-moc">🚩{che === 'vo_tan' && t <= 70 ? ` −${buoc}s` : ''}</span>}
          </div>
        ))}
      </div>
      <div className="nv-thap" style={{ bottom: 2 * FH + 2 }}>
        <img src={anhDau(gioi, p)} alt="" draggable={false} style={{ position: 'absolute', left: hv.left, top: hv.top, width: hv.width, height: hv.height, maxWidth: 'none' }} />
      </div>
    </div>
  )
}

function KetQuaThap({ che, nguon, cap, kq, onLeoLai, onLui }: { che: CheDoThap; nguon: NguonCau; cap: string; kq: KetQuaLeo; onLeoLai: () => void; onLui: () => void }) {
  const [ghi, setGhi] = useState<Awaited<ReturnType<typeof ghiThap>> | null>(null)
  const [loi, setLoi] = useState('')
  const da = useRef(false)
  const nhom = nguon.nhomThap(cap, CD_NHUNG)
  useEffect(() => {
    if (da.current) return
    da.current = true
    phat(kq.tang >= 10 ? 'thang' : 'thong_bao')
    ghiThap(che, nguon.mon, nhom, kq.tang, kq.sai, kq.ms).then((r) => { setGhi(r); if (r?.len_cap) setTimeout(() => phat('len_cap'), 800) }).catch((e) => setLoi((e as Error).message))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const toi = ghi?.bxh.toi
  const cauSai = kq.cauSai.filter((c, k, a) => a.findIndex((x) => x.id === c.id) === k)
  return (
    <div className="man">
      <DauMan tieuDe={`${THAP[che].icon} ${THAP[che].ten} — kết quả`} phu={`${nguon.icon} ${nguon.ten}${TCD_NHUNG ? ` · ${TCD_NHUNG}` : nhom ? ` · Lớp ${nhom}` : ''}`} onLui={onLui} />
      <div className="luoi-2">
        <div className="giay o-phong ket-thap">
          <div className="so-to">{kq.tang}</div>
          <div className="nhan-so-to">tầng</div>
          <p>{che === 'song_con' ? `Sai ${kq.sai} câu · leo trong ${Math.floor(kq.ms / 60000)}:${String(Math.floor((kq.ms % 60000) / 1000)).padStart(2, '0')}` : `Trụ được ${(kq.ms / 1000).toFixed(1)} giây`}</p>
          {loi ? <p className="loi">Chưa ghi được kết quả: {loi}</p> : !ghi ? <p className="mo">Đang ghi kết quả…</p> : (
            <>
              <p className="hang-to">{toi ? <>Hạng hôm nay: <b>#{toi.hang}</b> / {ghi.bxh.so_nguoi} người</> : ''}</p>
              {toi && toi.tang > kq.tang && <p className="mo">Kỷ lục hôm nay của em: {toi.tang} tầng</p>}
              <p className="kq-xp">+{ghi.xp_nhan} XP {ghi.len_cap && <b className="len-cap">LÊN CẤP {ghi.ho_so.cap}! 🎉</b>}</p>
            </>
          )}
          {cauSai.length > 0 && (
            <div className="kq-tu">
              <div className="kq-tu-dau">{cauSai.every((c) => c.tuId) ? 'Từ cần ôn lại' : 'Câu cần xem lại · đáp án đúng'}</div>
              {cauSai.every((c) => c.tuId) ? (
                <div className="kq-tu-ds">{cauSai.map((c) => (
                  <button key={c.id} className="chip-tu moi" onClick={() => c.doc && doc(c.doc)}><b>{c.doc}</b> <span>{c.dao ? c.de : c.opts.find((o) => o.id === c.dung)?.text}</span> 🔊</button>
                ))}</div>
              ) : (
                <div className="ds-cau-kq">{cauSai.map((c, k) => (
                  <div key={c.id} className="dong-cau-kq">
                    <span className="so">{k + 1}</span>
                    <div className="de"><ChuMon mon={nguon.mon}>{c.de}</ChuMon></div>
                    <div className="dap"><ChuMon mon={nguon.mon}>{c.opts.find((o) => o.id === c.dung)?.text ?? ''}</ChuMon></div>
                  </div>
                ))}</div>
              )}
            </div>
          )}
          <div className="hang-nut"><Nut mau="xam" onClick={onLui}>Về tháp</Nut><Nut mau="xanh" to onClick={onLeoLai}>Leo lại</Nut></div>
        </div>
        <div className="giay o-phong"><h3>🏆 Bảng xếp hạng</h3><BangThap che={che} mon={nguon.mon} nhom={nhom} lamMoi={ghi ? 1 : 0} /></div>
      </div>
    </div>
  )
}
