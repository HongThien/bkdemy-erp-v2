// GÓC LUYỆN TẬP — ôn từ yếu · thẻ ghi nhớ · tiến độ học tập · góp từ mới.
import { useEffect, useMemo, useRef, useState } from 'react'
import { CHU_DE, TU, TU_THEO_CD, TU_THEO_ID, TEN_LOAI } from '../data/kho'
import { capNhatNho, tuDenHan, tuYeu, useHoSo, TEN_MUC, type MucNho } from '../lib/hoSo'
import { phuongAnOn } from '../lib/boDe'
import { doc, phat } from '../lib/amThanh'
import { ghiTran, gopTu, tuDaGop } from '../lib/api'
import { ghiNhatKy, type DongNhatKy } from '../lib/nhatKy'
import { tron } from '../lib/tienich'
import { DauMan, Nut, toast } from '../ui/Chung'

type Muc = 'menu' | 'on' | 'the' | 'tien_do' | 'gop'

export function GocLuyen({ onLui }: { onLui: () => void }) {
  const [muc, setMuc] = useState<Muc>('menu')
  const h = useHoSo()
  const yeu = tuYeu(h.nho)
  const denHan = tuDenHan(h.nho)
  if (muc === 'on') return <OnTu onLui={() => setMuc('menu')} />
  if (muc === 'the') return <TheNho onLui={() => setMuc('menu')} />
  if (muc === 'tien_do') return <TienDo onLui={() => setMuc('menu')} />
  if (muc === 'gop') return <GopTu onLui={() => setMuc('menu')} />
  return (
    <div className="man">
      <DauMan tieuDe="📚 Góc luyện tập" phu="Luyện đúng phần còn yếu, tiến bộ từng ngày" onLui={onLui} />
      <div className="luoi-goc">
        <button className="o-goc giay noi-bat" onClick={() => setMuc('on')}>
          <span className="o-icon">🎯</span><b>Ôn từ yếu</b>
          <small>Luyện những từ em từng trả lời sai hoặc phản xạ còn chậm.</small>
          <span className="huy-hieu">{yeu.length + denHan.length} từ</span>
        </button>
        <button className="o-goc giay" onClick={() => setMuc('the')}>
          <span className="o-icon">🃏</span><b>Thẻ ghi nhớ</b><small>Lật thẻ, nghe phát âm, học theo chủ đề.</small>
        </button>
        <button className="o-goc giay" onClick={() => setMuc('tien_do')}>
          <span className="o-icon">📈</span><b>Tiến độ học tập</b><small>Từ thành thạo · đang nhớ · cần ôn, độ phủ từng chủ đề.</small>
        </button>
        <button className="o-goc giay" onClick={() => setMuc('gop')}>
          <span className="o-icon">✍️</span><b>Góp từ mới</b><small>Gửi từ, nghĩa và câu ví dụ để cùng xây kho từ (tối đa 10 từ/ngày).</small>
        </button>
      </div>
    </div>
  )
}

function OnTu({ onLui }: { onLui: () => void }) {
  const h = useHoSo()
  const [ds] = useState(() => {
    const y = tuYeu(h.nho)
    const d = tron(tuDenHan(h.nho))
    return [...y, ...d].slice(0, 20)
  })
  const [i, setI] = useState(0)
  const [opts, setOpts] = useState<string[]>([])
  const [sai, setSai] = useState<string[]>([])
  const [dung, setDung] = useState<number | null>(null)
  const [batDau, setBatDau] = useState(false)
  const luc = useRef(0)
  const dungLanDau = useRef(0)
  const nk = useRef<DongNhatKy[]>([]) // mỗi từ 1 dòng: tra_loi = lần chọn ĐẦU, dung = đúng ngay lần đầu
  const lanDau = useRef<string | null>(null)
  const id = ds[i]
  useEffect(() => {
    if (!batDau || !id) return
    setOpts(phuongAnOn(id)); setSai([]); setDung(null); luc.current = performance.now(); lanDau.current = null
    doc(TU_THEO_ID.get(id)!.en)
  }, [i, batDau])
  useEffect(() => {
    if (batDau && i >= ds.length && ds.length) {
      phat('thang')
      ghiTran({ mon: 'Tiếng Anh', cheDo: 'on_tap', chuDe: 'on_tap', ketQua: 'xong', soDung: dungLanDau.current, soCau: ds.length, diem: 0 })
        .then((r) => { if (r?.tran_id) void ghiNhatKy({ mon: 'Tiếng Anh', cheDo: 'on_tap', chuDe: 'on_tap', tranId: r.tran_id, cau: nk.current }) })
    }
  }, [i, batDau])

  if (!ds.length) return (
    <div className="man man-giua"><div className="tim-tran giay"><div className="cd-icon">🌟</div><h2>Chưa có từ yếu nào!</h2><p>Hãy tham gia một trận đấu để thử thách vốn từ của em nhé.</p><Nut mau="xam" onClick={onLui}>Quay lại</Nut></div></div>
  )
  if (!batDau) return (
    <div className="man">
      <DauMan tieuDe="🎯 Ôn từ yếu" phu={`${ds.length} từ cần ôn · tiến độ tự lưu`} onLui={onLui} />
      <div className="kq-tu-ds lon">{ds.map((x) => { const t = TU_THEO_ID.get(x)!; const n = h.nho[x]; return <button key={x} className="chip-tu" onClick={() => doc(t.en)}><b>{t.en}</b> <span>{n?.lyDo ?? ''}</span></button> })}</div>
      <div className="hang-nut"><Nut mau="xanh" to onClick={() => setBatDau(true)}>Bắt đầu ôn</Nut></div>
    </div>
  )
  if (i >= ds.length) return (
    <div className="man man-giua"><div className="tim-tran giay"><div className="cd-icon">🏅</div><h2>Em đã ôn hết từ rồi!</h2><p>Đúng ngay lần đầu {dungLanDau.current}/{ds.length} từ. Tuyệt lắm!</p><Nut mau="xanh" onClick={onLui}>Về góc luyện tập</Nut></div></div>
  )
  const t = TU_THEO_ID.get(id)!
  const chon = (o: string) => {
    if (dung !== null || sai.includes(o)) return
    if (lanDau.current === null) lanDau.current = o
    if (o === id) {
      const g = (performance.now() - luc.current) / 1000
      nk.current.push({ thu_tu: i + 1, ma_cau: id, cau_id: id, tu_id: id, de: t.en, dap_an: t.vi, tra_loi: TU_THEO_ID.get(lanDau.current)?.vi ?? '', dung: !sai.length, ms: Math.round(g * 1000) })
      if (!sai.length) dungLanDau.current++
      capNhatNho(id, !sai.length, g)
      setDung(Math.round(g * 10) / 10); phat('dung')
    } else { setSai([...sai, o]); phat('sai') }
  }
  return (
    <div className="man">
      <DauMan tieuDe="🎯 Ôn từ yếu" phu={`Từ ${i + 1}/${ds.length} · Anh → Việt`} onLui={onLui} />
      <div className="the-tu giay lon">
        <div className="the-tu-nhan">Chọn nghĩa tiếng Việt đúng:</div>
        <div className="the-tu-chu">{t.en} <button className="nut-loa" onClick={() => doc(t.en)}>🔊</button></div>
        <div className="the-tu-phu">{t.ipa} · {TEN_LOAI[t.pos]}</div>
        {dung !== null && <div className="the-tu-vd">“{t.vd}” <i>— {t.vdvi}</i></div>}
      </div>
      <div className="luoi-dap-an">
        {opts.map((o, k) => (
          <button key={o} className={'dap-an ' + (dung !== null && o === id ? 'dung-thang' : sai.includes(o) ? 'sai' : '')} onClick={() => chon(o)} disabled={sai.includes(o)}>
            <span className="phim">{k + 1}</span><span className="chu">{TU_THEO_ID.get(o)?.vi}</span>
          </button>
        ))}
      </div>
      <div className="nt-tin">{dung !== null ? `Đúng rồi! (${dung}s) · Đã lưu tiến độ` : sai.length ? 'Chưa đúng, thử phương án khác nhé!' : ''}</div>
      {dung !== null && <div className="hang-nut"><Nut mau="xanh" to onClick={() => setI(i + 1)}>Từ tiếp theo →</Nut></div>}
    </div>
  )
}

function TheNho({ onLui }: { onLui: () => void }) {
  const [cd, setCd] = useState(CHU_DE[0].id)
  const [ds, setDs] = useState<string[]>([])
  const [i, setI] = useState(0)
  const [lat, setLat] = useState(false)
  useEffect(() => { setDs(tron((TU_THEO_CD[cd] ?? []).map((t) => t.id))); setI(0); setLat(false) }, [cd])
  const t = TU_THEO_ID.get(ds[i] ?? '')
  const tiep = (thuoc: boolean) => { if (t) capNhatNho(t.id, thuoc, thuoc ? 2 : 10); setLat(false); setI((x) => (x + 1) % Math.max(1, ds.length)) }
  return (
    <div className="man">
      <DauMan tieuDe="🃏 Thẻ ghi nhớ" phu={`${i + 1}/${ds.length} thẻ`} onLui={onLui} />
      <div className="chip-hang cuon">{CHU_DE.map((c) => <button key={c.id} className={'chip' + (cd === c.id ? ' bat' : '')} onClick={() => setCd(c.id)}><b>{c.icon} {c.ten}</b></button>)}</div>
      {t && (
        <div className={'the-lat' + (lat ? ' da-lat' : '')} onClick={() => { setLat(!lat); if (!lat) doc(t.en) }}>
          <div className="mat truoc giay"><div className="the-tu-chu">{t.en}</div><div className="the-tu-phu">{t.ipa} · {TEN_LOAI[t.pos]}</div><small>Chạm để lật</small></div>
          <div className="mat sau giay"><div className="the-tu-chu vi">{t.vi}</div><div className="the-tu-vd">“{t.vd}”<br /><i>{t.vdvi}</i></div></div>
        </div>
      )}
      <div className="hang-nut">
        <Nut mau="lam" onClick={() => t && doc(t.en)}>🔊 Nghe</Nut>
        <Nut mau="do" onClick={() => tiep(false)}>Chưa thuộc</Nut>
        <Nut mau="xanh" onClick={() => tiep(true)}>Đã thuộc ✓</Nut>
      </div>
    </div>
  )
}

function TienDo({ onLui }: { onLui: () => void }) {
  const h = useHoSo()
  const dem = useMemo(() => {
    const d: Record<MucNho, number> = { yeu: 0, dang_nho: 0, quen: 0, thao: 0 }
    for (const n of Object.values(h.nho)) d[n.muc]++
    return d
  }, [h.nho])
  const gap = Object.keys(h.nho).length
  return (
    <div className="man">
      <DauMan tieuDe="📈 Tiến độ học tập" phu={`Cấp ${h.db?.cap ?? 1} · ${dem.thao} từ thành thạo`} onLui={onLui} />
      <div className="luoi-so">
        {(['thao', 'quen', 'dang_nho', 'yeu'] as MucNho[]).map((m) => <div key={m} className={'o-so giay m-' + m}><b>{dem[m]}</b><span>{TEN_MUC[m]}</span></div>)}
        <div className="o-so giay"><b>{gap}</b><span>Từ đã luyện</span></div>
      </div>
      <div className="giay o-phong">
        <h3>Độ phủ theo chủ đề ({gap}/{TU.length} từ đã luyện)</h3>
        {CHU_DE.map((c) => {
          const ds = TU_THEO_CD[c.id] ?? []
          const da = ds.filter((t) => h.nho[t.id]).length
          const thao = ds.filter((t) => h.nho[t.id]?.muc === 'thao' || h.nho[t.id]?.muc === 'quen').length
          return (
            <div key={c.id} className="dong-phu">
              <span>{c.icon} {c.ten}</span>
              <div className="thanh"><div className="gap" style={{ width: `${(da / ds.length) * 100}%` }} /><div className="thao" style={{ width: `${(thao / ds.length) * 100}%` }} /></div>
              <small>{da}/{ds.length}</small>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function GopTu({ onLui }: { onLui: () => void }) {
  const [f, setF] = useState({ en: '', vi: '', loai: 'n', vd: '', vdvi: '' })
  const [ds, setDs] = useState<{ en: string; vi: string; trang_thai: string }[]>([])
  const [dangGui, setDangGui] = useState(false)
  useEffect(() => { tuDaGop().then(setDs).catch(() => {}) }, [])
  const gui = async () => {
    setDangGui(true)
    try {
      const r = await gopTu(f)
      toast(`Đã gửi! Hôm nay còn góp được ${r?.con_lai_hom_nay ?? '?'} từ`, 'ok')
      setDs([{ en: f.en.toLowerCase(), vi: f.vi, trang_thai: 'cho_duyet' }, ...ds])
      setF({ en: '', vi: '', loai: 'n', vd: '', vdvi: '' })
    } catch (e) { toast((e as Error).message, 'loi') } finally { setDangGui(false) }
  }
  const TT: Record<string, string> = { cho_duyet: '⏳ Chờ duyệt', da_duyet: '✅ Đã duyệt', tu_choi: '✏️ Cần chỉnh sửa' }
  return (
    <div className="man">
      <DauMan tieuDe="✍️ Góp từ mới" phu="Mỗi đóng góp được kiểm tra trước khi đưa vào game · tối đa 10 từ/ngày" onLui={onLui} />
      <div className="luoi-2">
        <div className="giay o-phong form">
          <label>Từ tiếng Anh *<input className="o-nhap" value={f.en} onChange={(e) => setF({ ...f, en: e.target.value })} placeholder="vd: rainbow" /></label>
          <label>Nghĩa tiếng Việt *<input className="o-nhap" value={f.vi} onChange={(e) => setF({ ...f, vi: e.target.value })} placeholder="vd: cầu vồng" /></label>
          <div className="chip-hang nho">{Object.entries(TEN_LOAI).map(([k, v]) => <button key={k} className={'chip' + (f.loai === k ? ' bat' : '')} onClick={() => setF({ ...f, loai: k })}><b>{v}</b></button>)}</div>
          <label>Câu ví dụ tiếng Anh (phải chứa từ)<input className="o-nhap" value={f.vd} onChange={(e) => setF({ ...f, vd: e.target.value })} placeholder="vd: I saw a rainbow after the rain." /></label>
          <label>Dịch câu ví dụ<input className="o-nhap" value={f.vdvi} onChange={(e) => setF({ ...f, vdvi: e.target.value })} /></label>
          <Nut mau="xanh" to onClick={gui} disabled={!f.en.trim() || !f.vi.trim() || dangGui}>{dangGui ? 'Đang gửi…' : 'Gửi đóng góp'}</Nut>
        </div>
        <div className="giay o-phong">
          <h3>Từ em đã góp</h3>
          {!ds.length ? <p className="mo">Em chưa gửi từ nào. Hãy bắt đầu với một từ thật hữu ích nhé!</p> : (
            <div className="ds-gop">{ds.map((x, i) => <div key={i} className="dong-gop"><b>{x.en}</b><span>{x.vi}</span><small>{TT[x.trang_thai] ?? x.trang_thai}</small></div>)}</div>
          )}
        </div>
      </div>
    </div>
  )
}
