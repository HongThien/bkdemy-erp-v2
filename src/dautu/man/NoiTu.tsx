// NỐI TỪ — tự do · đấu bot · phòng online. Mỗi từ được chấp nhận: hiện nghĩa + phát âm + ví dụ (học từ qua ngữ cảnh).
import { useEffect, useRef, useState } from 'react'
import { TrongTaiNT, moPhongNT, type PhongNT, type SnapNT } from '../lib/noiTu'
import type { MucBot, NguoiTran } from '../lib/trongTai'
import { BOT } from '../lib/bot'
import { doc, phat } from '../lib/amThanh'
import { ghiTran } from '../lib/api'
import { ghiNhatKy, type DongNhatKy } from '../lib/nhatKy'
import { maSo } from '../lib/tienich'
import { datTrangThai } from '../lib/mang'
import { Avatar, DauMan, Nut, chepVao } from '../ui/Chung'

type CheDoNT = { loai: 'tu_do' } | { loai: 'bot'; muc: MucBot } | { loai: 'mang'; phong: string; laChu: boolean }

export function ManNoiTu({ toi, vaoPhong, onLui }: { toi: NguoiTran; vaoPhong?: string; onLui: () => void }) {
  const [cd, setCd] = useState<CheDoNT | null>(vaoPhong ? { loai: 'mang', phong: vaoPhong, laChu: false } : null)
  const [ma, setMa] = useState('')
  const [muc, setMuc] = useState<MucBot>('vua')
  if (cd) return <VanNoiTu key={JSON.stringify(cd)} toi={toi} cd={cd} onLui={() => (vaoPhong ? onLui() : setCd(null))} />
  return (
    <div className="man">
      <DauMan tieuDe="🔗 Nối từ" phu="Từ tiếp theo phải bắt đầu bằng chữ cái cuối của từ trước. Nghe phát âm, học nghĩa qua từng từ!" onLui={onLui} />
      <div className="luoi-che-do ba">
        <div className="the-che-do giay">
          <div className="cd-icon">🌿</div><h3>Nối từ tự do</h3><p>Không giới hạn thời gian — nối càng dài càng giỏi.</p>
          <Nut mau="xanh" to onClick={() => setCd({ loai: 'tu_do' })}>Bắt đầu</Nut>
        </div>
        <div className="the-che-do giay">
          <div className="cd-icon">🤖</div><h3>Đấu với bot</h3><p>20 giây mỗi lượt, 3 tim. Hết giờ hoặc bí từ mất 1 tim.</p>
          <div className="chip-hang nho">{(Object.keys(BOT) as MucBot[]).map((m) => <button key={m} className={'chip' + (muc === m ? ' bat' : '')} onClick={() => setMuc(m)}><b>{BOT[m].nhan}</b></button>)}</div>
          <Nut mau="tim" to onClick={() => setCd({ loai: 'bot', muc })}>Đấu ngay</Nut>
        </div>
        <div className="the-che-do giay">
          <div className="cd-icon">🌐</div><h3>Phòng online</h3><p>2–6 người, lần lượt nối từ, người cuối còn tim thắng.</p>
          <Nut mau="lam" to onClick={() => setCd({ loai: 'mang', phong: maSo(6), laChu: true })}>Tạo phòng</Nut>
          <input className="o-nhap ma" inputMode="numeric" placeholder="hoặc nhập mã 6 số…" value={ma} onChange={(e) => setMa(e.target.value)} />
          <Nut mau="xam" disabled={!/^\d{6}$/.test(ma.trim())} onClick={() => setCd({ loai: 'mang', phong: ma.trim(), laChu: false })}>Vào phòng</Nut>
        </div>
      </div>
    </div>
  )
}

/** Nhật ký: mỗi từ em nối được = 1 dòng (đúng); game không đo thời gian từng lượt nên ms = 0. */
const tuCuaToi = (tu: { w: string; ai: number; vi?: string }[], ai: number): DongNhatKy[] =>
  tu.filter((t) => t.ai === ai).map((t, k) => ({ thu_tu: k + 1, de: 'Nối từ', dap_an: t.vi ?? '', tra_loi: t.w, dung: true, ms: 0 }))

function VanNoiTu({ toi, cd, onLui }: { toi: NguoiTran; cd: CheDoNT; onLui: () => void }) {
  const [s, setS] = useState<SnapNT | null>(null)
  const [nhap, setNhap] = useState('')
  const [loi, setLoi] = useState('')
  const [conLai, setConLai] = useState(0)
  const han = useRef(0)
  const tt = useRef<TrongTaiNT | null>(null)
  const pg = useRef<PhongNT | null>(null)
  const daGhi = useRef(false)
  const cuoi = useRef<HTMLDivElement>(null)
  const oNhap = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const nhan = (x: SnapNT | null) => { if (!x) return; han.current = performance.now() + x.conLai; setS(x) }
    if (cd.loai === 'mang') {
      const p = moPhongNT({ phong: cd.phong, laChu: cd.laChu, toi })
      pg.current = p
      datTrangThai('dau')
      const h1 = p.snap.nghe(nhan)
      const h2 = p.loi.nghe((l) => setLoi(l))
      return () => { h1(); h2(); p.roi(); datTrangThai('ranh') }
    }
    const nguoi = cd.loai === 'bot' ? [toi, { ma: 'bot', ten: BOT[cd.muc].ten, nv: BOT[cd.muc].nv, bot: cd.muc }] : [toi]
    const t = new TrongTaiNT(nguoi, cd.loai === 'tu_do')
    tt.current = t
    const h = t.dangKy(nhan)
    t.bat()
    return () => { h(); t.huy() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => { const h = setInterval(() => setConLai(Math.max(0, han.current - performance.now())), 100); return () => clearInterval(h) }, [])
  // từ mới được chấp nhận ⇒ đọc + cuộn
  const soTu = s?.tu.length ?? 0
  useEffect(() => {
    if (!s || !soTu) return
    const t = s.tu[soTu - 1]
    doc(t.w)
    phat(s.nguoi[t.ai]?.ma === toi.ma ? 'dung' : 'tich')
    cuoi.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [soTu])
  useEffect(() => {
    if (!s || s.pha !== 'het' || daGhi.current) return
    daGhi.current = true
    const ai = s.nguoi.findIndex((n) => n.ma === toi.ma)
    const thang = s.thang === ai
    phat(thang ? 'thang' : 'thua')
    ghiTran({ mon: 'Tiếng Anh', cheDo: 'noi_tu', chuDe: 'noi_tu', ketQua: thang ? 'thang' : 'thua', soDung: s.tu.filter((t) => t.ai === ai).length, soCau: s.tu.filter((t) => t.ai === ai).length, diem: s.nguoi[ai]?.diem ?? 0, doiThu: s.nguoi.filter((_, i) => i !== ai).map((n) => n.ten).join(', ') })
      .then((r) => { if (r?.tran_id) void ghiNhatKy({ mon: 'Tiếng Anh', cheDo: 'noi_tu', chuDe: 'noi_tu', tranId: r.tran_id, cau: tuCuaToi(s.tu, ai) }) })
  }, [s?.pha])

  const ai = s ? s.nguoi.findIndex((n) => n.ma === toi.ma) : -1
  const luotToi = !!s && s.pha === 'dau' && s.luot === ai
  useEffect(() => { if (luotToi) oNhap.current?.focus() }, [luotToi])

  const nop = async () => {
    const w = nhap.trim()
    if (!w || !s) return
    setLoi('')
    const l = tt.current ? await tt.current.nop(ai, w) : await pg.current!.nop(w)
    if (l) { setLoi(l); phat('sai') } else setNhap('')
  }
  const ketThucTuDo = () => {
    if (cd.loai === 'tu_do' && s && !daGhi.current && s.tu.length) {
      daGhi.current = true
      ghiTran({ mon: 'Tiếng Anh', cheDo: 'noi_tu', chuDe: 'noi_tu', ketQua: 'xong', soDung: s.tu.length, soCau: s.tu.length, diem: s.nguoi[0].diem })
        .then((r) => { if (r?.tran_id) void ghiNhatKy({ mon: 'Tiếng Anh', cheDo: 'noi_tu', chuDe: 'noi_tu', tranId: r.tran_id, cau: tuCuaToi(s.tu, 0) }) })
    }
    onLui()
  }

  if (!s) return <div className="man man-giua"><div className="dang-tai">{loi || 'Đang vào phòng nối từ…'}</div><Nut mau="xam" onClick={onLui}>Quay lại</Nut></div>

  const giay = Math.ceil(conLai / 1000)
  return (
    <div className="man man-noi-tu">
      <DauMan tieuDe={cd.loai === 'tu_do' ? '🌿 Nối từ tự do' : cd.loai === 'bot' ? '🤖 Nối từ với bot' : <>🌐 Phòng nối từ <span className="ma-nho" onClick={() => chepVao(cd.phong)}>{cd.phong}</span></>}
        phu={cd.loai === 'tu_do' ? `Chuỗi hiện tại: ${s.tu.length} từ · ${s.nguoi[0].diem} điểm` : undefined} onLui={ketThucTuDo} />
      {s.pha === 'cho' && cd.loai === 'mang' && (
        <div className="giay o-phong">
          <h3>Phòng chờ ({s.nguoi.length}/6)</h3>
          <div className="hang-nguoi">{s.nguoi.map((n) => <div key={n.ma} className="ng-nt"><Avatar nv={n.nv} co={44} /><b>{n.ten}</b></div>)}</div>
          {cd.laChu ? <Nut mau="xanh" to disabled={s.nguoi.length < 2} onClick={() => pg.current?.bat()}>Bắt đầu {s.nguoi.length < 2 ? '(cần ≥ 2 người)' : ''}</Nut>
            : <p className="mo"><span className="cham-nhay" /> Chờ chủ phòng bắt đầu…</p>}
          <div className="hang-nut"><Nut mau="lam" onClick={() => chepVao(cd.phong)}>Sao chép mã phòng</Nut></div>
        </div>
      )}
      {s.pha !== 'cho' && (
        <div className="nt-khung">
          {!s.tuDo && (
            <div className="hang-nguoi">
              {s.nguoi.map((n, i) => (
                <div key={n.ma} className={'ng-nt' + (s.luot === i && s.pha === 'dau' ? ' luot' : '') + (n.tim <= 0 || n.roi ? ' loai' : '')}>
                  <Avatar nv={n.nv} co={44} />
                  <b>{n.ten}</b>
                  <span className="tim">{'❤️'.repeat(Math.max(0, n.tim))}{'🤍'.repeat(Math.max(0, 3 - n.tim))}</span>
                  <small>{n.diem} điểm</small>
                </div>
              ))}
            </div>
          )}
          <div className="nt-chuoi giay">
            {s.tu.length === 0 && <p className="mo">{luotToi ? 'Em mở đầu nhé! Nhập một từ tiếng Anh bất kỳ.' : `${s.nguoi[s.luot]?.ten} đang mở đầu…`}</p>}
            {s.tu.map((t, i) => (
              <div key={i} className={'bong-tu' + (s.nguoi[t.ai]?.ma === toi.ma ? ' cua-toi' : '')}>
                <div className="bong-tu-dau">
                  <b>{t.w.slice(0, -1)}<span className="chu-cuoi">{t.w.slice(-1)}</span></b>
                  <button className="nut-loa" onClick={() => doc(t.w)}>🔊</button>
                  {!s.tuDo && <small>{s.nguoi[t.ai]?.ten}</small>}
                </div>
                {t.vi && <div className="bong-tu-vi">{t.vi} {t.ipa && <i>{t.ipa}</i>}</div>}
                {!t.vi && t.nghia && <div className="bong-tu-vi en">{t.nghia}</div>}
                {t.vd && <div className="bong-tu-vd">“{t.vd}”</div>}
              </div>
            ))}
            <div ref={cuoi} />
          </div>
          {s.pha === 'dau' && (
            <div className="nt-nhap giay">
              <div className="nt-chu">{s.chu ? <>Bắt đầu bằng <b>{s.chu.toUpperCase()}</b></> : 'Từ bất kỳ'}</div>
              {!s.tuDo && <div className="thanh-gio"><div style={{ width: `${(conLai / s.tong) * 100}%` }} className={giay <= 5 ? 'gap' : ''} /></div>}
              <div className="nt-hang">
                <input ref={oNhap} className="o-nhap" value={nhap} disabled={!luotToi || s.dangKiem} autoCapitalize="none" autoCorrect="off" spellCheck={false}
                  placeholder={luotToi ? (s.chu ? `${s.chu.toUpperCase()}…` : 'Nhập từ tiếng Anh…') : `Lượt của ${s.nguoi[s.luot]?.ten}…`}
                  onChange={(e) => setNhap(e.target.value.replace(/[^a-zA-Z]/g, ''))} onKeyDown={(e) => { if (e.key === 'Enter') nop() }} />
                <Nut mau="xanh" onClick={nop} disabled={!luotToi || !nhap.trim() || s.dangKiem}>{s.dangKiem ? 'Đang tra…' : 'Gửi'}</Nut>
              </div>
              {(loi || s.thongBao) && <div className={'nt-tin' + (loi ? ' loi' : '')}>{loi || s.thongBao}</div>}
              {!s.tuDo && !luotToi && <div className="nt-tin">{s.nguoi[s.luot]?.bot ? '🤔 Bot đang nghĩ…' : `⏳ ${s.nguoi[s.luot]?.ten} đang nghĩ…`} {giay}s</div>}
            </div>
          )}
          {s.pha === 'het' && (
            <div className="giay o-phong ket-nt">
              <h2>{s.thang === ai ? '🎉 Em chiến thắng!' : s.thang !== null ? `${s.nguoi[s.thang].ten} thắng!` : 'Kết thúc'}</h2>
              <p>Chuỗi dài {s.tu.length} từ · em được {s.nguoi[ai]?.diem ?? 0} điểm</p>
              <div className="hang-nut"><Nut mau="xam" onClick={onLui}>Về menu nối từ</Nut></div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
