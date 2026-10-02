// GIẢI ĐẤU 8 NGƯỜI: sảnh chờ (8 ghế, thêm bot, mời bạn) → bảng nhánh trực tiếp → trận của em / xem trận khác → vô địch.
import { useEffect, useRef, useState } from 'react'
import { nguonCua, type CapNguon, type ChuDeNguon } from '../nguon'
import { GiaiDau, TEN_VONG, type TrangThaiGiai, type TranGiai, type TTGiaiCucBo } from '../lib/giai'
import { guiLoiMoi, datTrangThai, type ThongTinTran } from '../lib/mang'
import type { NguoiTran, Snap } from '../lib/trongTai'
import { maSo } from '../lib/tienich'
import { HUONG_DO, tenHuong } from '../lib/boDe'
import { phat } from '../lib/amThanh'
import { Avatar, DauMan, Nut, chepVao, toast } from '../ui/Chung'
import { ManDau } from './ManDau'
import { DanhSachOnline, useSanh } from './Online'

export function ManGiai({ toi, tran, vaoSan, onLui }: {
  toi: NguoiTran; tran: ThongTinTran; vaoSan?: { code: string; laChu: boolean }; onLui: () => void
}) {
  const [giai, setGiai] = useState<GiaiDau | null>(null)
  const [ma, setMa] = useState('')
  const ref = useRef<GiaiDau | null>(null)
  const mo = (code: string, laChu: boolean) => {
    ref.current?.roi()
    const g = new GiaiDau({ code, laChu, toi, mon: tran.mon, cap: tran.cap, chuDe: tran.chuDe, tenChuDe: tran.tenChuDe, soCau: tran.soCau })
    ref.current = g
    setGiai(g)
    datTrangThai('dau')
  }
  useEffect(() => {
    if (vaoSan) mo(vaoSan.code, vaoSan.laChu)
    return () => { ref.current?.roi(); datTrangThai('ranh') }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (giai) return <TrongGiai giai={giai} onLui={onLui} />
  const vaoMa = () => { const m = ma.match(/(\d{6})/); if (m) mo(m[1], false) }
  return (
    <div className="man">
      <DauMan tieuDe="🏆 Giải đấu 8 người" phu="Loại trực tiếp · thắng cặp mình thì chờ người thắng cặp bên cạnh" onLui={onLui} />
      <div className="luoi-2">
        <div className="giay o-phong">
          <h3>Tạo giải mới</h3>
          <p>Em làm chủ giải (trọng tài). Mời bạn vào; ghế trống sẽ là bot.</p>
          <p className="mo">{tran.mon} · <b>{tran.tenChuDe}</b> · {tran.soCau} câu/trận</p>
          <Nut mau="vang" to onClick={() => mo(maSo(6), true)}>Tạo giải</Nut>
        </div>
        <div className="giay o-phong">
          <h3>Vào giải bằng mã</h3>
          <input className="o-nhap ma" inputMode="numeric" placeholder="Nhập 6 số hoặc dán link…" value={ma} onChange={(e) => setMa(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') vaoMa() }} />
          <Nut mau="lam" to onClick={vaoMa} disabled={!/\d{6}/.test(ma)}>Vào giải</Nut>
        </div>
      </div>
      <div className="giay o-phong luat">
        <h3>Luật giải</h3>
        <ul>
          <li>8 người, bốc thăm vào 4 cặp <b>Tứ kết</b>. Mỗi trận đấu từ vựng như đấu online.</li>
          <li>Thắng xong em <b>chờ người thắng cặp bên cạnh</b> rồi vào Bán kết ngay — không chờ cả vòng.</li>
          <li>Hoà điểm ⇒ ai đúng nhiều hơn đi tiếp; vẫn hoà ⇒ ai trả lời nhanh hơn.</li>
          <li>Rời giải giữa chừng ⇒ xử thua các trận còn lại. Trong lúc chờ có thể <b>xem trực tiếp</b> các trận khác.</li>
        </ul>
      </div>
    </div>
  )
}

function useKho<T>(k: { lay: () => T; nghe: (f: (v: T) => void) => () => void }) {
  const [v, setV] = useState(k.lay())
  useEffect(() => k.nghe(setV), [k])
  return v
}

function TrongGiai({ giai, onLui }: { giai: GiaiDau; onLui: () => void }) {
  const st = useKho(giai.st)
  const cb = useKho(giai.cb) as TTGiaiCucBo
  const snaps = useKho(giai.snaps)
  const sanh = useSanh()
  const [daXem, setDaXem] = useState<Set<string>>(new Set())
  const [xemMid, setXemMid] = useState<string | null>(null)
  const daBao = useRef('')

  const ghe = st?.ghe.findIndex((g) => g.ma === giai.toi.ma) ?? -1
  // trận của em đang diễn ra (hoặc vừa xong mà em chưa bấm "Về bảng đấu")
  const tranToi = st?.tran.find((t) => (t.a === ghe || t.b === ghe) && ghe >= 0 && !daXem.has(t.mid) && (t.dang || (t.thang !== null && snaps[t.mid]?.ketQua)))
  useEffect(() => {
    if (tranToi && daBao.current !== tranToi.mid) { daBao.current = tranToi.mid; phat('bat_dau') }
  }, [tranToi?.mid])
  useEffect(() => { if (st?.pha === 'xong') phat('thang') }, [st?.pha])

  if (cb.chuRoi) return <ThongBao chu="Chủ giải đã rời — giải đấu dừng." onLui={onLui} />
  if (cb.ketNoi === 'loi') return <ThongBao chu={cb.loi} onLui={onLui} />
  if (!st) return <div className="man man-giua"><div className="dang-tai">Đang vào giải {giai.code}…</div></div>

  if (tranToi && st.pha !== 'sanh') {
    return <ManDau key={tranToi.mid} phien={giai.phien(tranToi.mid)} nhanCheDo={'Giải · ' + TEN_VONG[tranToi.vong]}
      onVeBang={() => setDaXem((s) => new Set(s).add(tranToi.mid))} onThoat={() => setDaXem((s) => new Set(s).add(tranToi.mid))} />
  }
  if (xemMid && snaps[xemMid]) {
    return <ManDau key={'xem' + xemMid} phien={giai.phien(xemMid)} nhanCheDo="Đang xem trực tiếp" onVeBang={() => setXemMid(null)} onThoat={() => setXemMid(null)} />
  }

  const link = `${location.origin}${location.pathname}?giai=${giai.code}`
  return (
    <div className="man">
      <DauMan tieuDe={<>🏆 Giải đấu · <span className="ma-nho" onClick={() => chepVao(giai.code)}>{giai.code}</span></>}
        phu={<>{st.mon} · {st.tenChuDe} · {nguonCua(st.mon).coDaoChieu ? `${tenHuong(st.huong ?? 'tron')} · ` : ''}{st.soCau} câu/trận</>} onLui={onLui}
        phai={st.pha === 'sanh' ? <div className="hang-nut"><Nut mau="lam" onClick={() => chepVao(giai.code)}>Mã giải</Nut><Nut mau="lam" onClick={() => chepVao(link)}>Link</Nut></div> : null} />

      {st.pha === 'sanh' && (
        <div className="giai-sanh">
          <div className="giay o-phong">
            <h3>Người chơi ({st.ghe.length}/8)</h3>
            <div className="luoi-ghe">
              {Array.from({ length: 8 }, (_, i) => st.ghe[i]).map((g, i) => (
                <div key={i} className={'ghe' + (g ? ' co' : '')}>
                  {g ? <>
                    <Avatar nv={g.nv} co={44} />
                    <b>{g.ten}</b>
                    <small>{g.bot ? 'BOT' : g.ma === st.chu ? 'Chủ giải' : 'Người chơi'}</small>
                    {giai.laChu && g.bot && <button className="xoa-ghe" onClick={() => giai.boGhe(i)}>✕</button>}
                  </> : <span className="ghe-trong">Ghế trống</span>}
                </div>
              ))}
            </div>
            {giai.laChu ? (
              <>
                <CauHinhGiai giai={giai} st={st} />
                <div className="hang-nut">
                  <Nut mau="xam" onClick={() => giai.themBot()} disabled={st.ghe.length >= 8}>+ Thêm bot</Nut>
                  <Nut mau="vang" to onClick={() => giai.batDau()}>Bắt đầu giải {st.ghe.length < 8 ? `(${8 - st.ghe.length} bot)` : ''}</Nut>
                </div>
              </>
            ) : <p className="mo"><span className="cham-nhay" /> Chờ chủ giải bắt đầu…</p>}
          </div>
          {giai.laChu && (
            <div className="giay o-phong">
              <h3>Mời bạn đang online</h3>
              <DanhSachOnline sanh={sanh.online} toi={giai.toi.ma} nhan="Mời" onChon={(x) => { guiLoiMoi(x.ma, { mon: st.mon, cap: st.cap, chuDe: st.chuDe, tenChuDe: st.tenChuDe, soCau: st.soCau, phong: giai.code, loai: 'giai' }); toast(`Đã mời ${x.ten}`, 'ok') }} />
            </div>
          )}
        </div>
      )}

      {st.pha !== 'sanh' && (
        <>
          {st.pha === 'xong' && st.vd !== null && <VoDich st={st} />}
          {st.pha === 'dau' && <TinGiai st={st} ghe={ghe} />}
          <BangNhanh st={st} snaps={snaps} ghe={ghe} onXem={(mid) => setXemMid(mid)} />
        </>
      )}
    </div>
  )
}

function TinGiai({ st, ghe }: { st: TrangThaiGiai; ghe: number }) {
  if (ghe < 0) return <div className="bang-tin giay">Em đang xem giải với tư cách khán giả.</div>
  const thua = st.tran.find((t) => t.thang !== null && (t.a === ghe || t.b === ghe) && t.thang !== ghe)
  if (thua) return <div className="bang-tin giay">Em đã dừng ở {TEN_VONG[thua.vong]}. Ở lại xem trực tiếp các trận còn lại nhé!</div>
  const tiep = st.tran.find((t) => t.thang === null && (t.a === ghe || t.b === ghe))
  if (tiep && !tiep.dang) {
    const nguon = { s0: ['q0', 'q1'], s1: ['q2', 'q3'], f: ['s0', 's1'] }[tiep.mid as 's0' | 's1' | 'f']
    const cho = st.tran.find((t) => nguon?.includes(t.mid) && t.thang === null)
    return <div className="bang-tin giay vang"><span className="cham-nhay" /> Em đã vào {TEN_VONG[tiep.vong]}! Đang chờ người thắng {cho ? `cặp ${tenCap(cho, st)}` : 'cặp bên cạnh'}…</div>
  }
  return null
}

const tenCap = (t: TranGiai, st: TrangThaiGiai) => `${t.a !== null ? st.ghe[t.a].ten : '?'} – ${t.b !== null ? st.ghe[t.b].ten : '?'}`

function BangNhanh({ st, snaps, ghe, onXem }: { st: TrangThaiGiai; snaps: Record<string, Snap>; ghe: number; onXem: (mid: string) => void }) {
  return (
    <div className="bang-nhanh">
      {[0, 1, 2].map((v) => (
        <div key={v} className={'cot-vong v' + v}>
          <div className="ten-vong">{TEN_VONG[v]}</div>
          {st.tran.filter((t) => t.vong === v).map((t) => {
            const sn = snaps[t.mid]
            const diem = t.diem ?? (sn ? sn.diem : null)
            return (
              <div key={t.mid} className={'o-tran giay' + (t.dang ? ' dang' : '')}>
                {([t.a, t.b] as const).map((g, k) => (
                  <div key={k} className={'o-tran-ng' + (t.thang !== null && t.thang === g ? ' thang' : t.thang !== null ? ' thua' : '') + (g === ghe ? ' la-toi' : '')}>
                    {g !== null ? <><Avatar nv={st.ghe[g].nv} co={26} vien={false} /><span>{st.ghe[g].ten}{st.ghe[g].roi ? ' (rời)' : ''}</span></> : <span className="mo">Chờ…</span>}
                    <b>{diem ? diem[k] : ''}</b>
                  </div>
                ))}
                {t.dang && <button className="nut-xem" onClick={() => onXem(t.mid)}>🔴 Xem trực tiếp · Từ {Math.min((sn?.i ?? 0) + 1, sn?.ds.length ?? 0)}/{sn?.ds.length ?? '?'}</button>}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function VoDich({ st }: { st: TrangThaiGiai }) {
  const g = st.ghe[st.vd!]
  const f = st.tran.find((t) => t.mid === 'f')!
  const aHai = f.a === st.vd ? f.b : f.a
  return (
    <div className="vo-dich giay">
      <div className="phao-hoa">🎆</div>
      <Avatar nv={g.nv} co={110} />
      <h2>👑 {g.ten} VÔ ĐỊCH!</h2>
      {aHai !== null && <p>Á quân: <b>{st.ghe[aHai].ten}</b></p>}
    </div>
  )
}

function ThongBao({ chu, onLui }: { chu: string; onLui: () => void }) {
  return <div className="man man-giua"><div className="tim-tran giay"><h2>{chu}</h2><Nut mau="xam" onClick={onLui}>Về sảnh</Nut></div></div>
}

/** Chủ giải chỉnh khối/cấp · chủ đề · kiểu đố (môn có) · số câu — danh sách lấy từ nguồn của môn. */
function CauHinhGiai({ giai, st }: { giai: GiaiDau; st: TrangThaiGiai }) {
  const ng = nguonCua(st.mon)
  const [dsCap, setDsCap] = useState<CapNguon[]>([])
  const [dsCd, setDsCd] = useState<ChuDeNguon[]>([])
  useEffect(() => { ng.dsCap().then(setDsCap).catch(() => {}) }, [ng])
  useEffect(() => { ng.dsChuDe(st.cap).then(setDsCd).catch(() => {}) }, [ng, st.cap])
  return (
    <>
      <div className="chip-hang cuon">
        <span className="mo">{ng.tenCap}:</span>
        {dsCap.map((c) => <button key={c.id} className={'chip' + (st.cap === c.id ? ' bat' : '')} onClick={() => giai.datCauHinh({ cap: c.id, chuDe: 'tron', tenChuDe: 'Trộn tất cả' })}><b>{c.ten}</b></button>)}
      </div>
      <div className="chip-hang cuon">
        {dsCd.map((c) => <button key={c.id} className={'chip' + (st.chuDe === c.id ? ' bat' : '')} onClick={() => giai.datCauHinh({ chuDe: c.id, tenChuDe: c.ten })}><b>{c.icon} {c.ten}</b></button>)}
      </div>
      <div className="chip-hang nho">
        {ng.coDaoChieu && HUONG_DO.map((h) => <button key={h.id} className={'chip' + (st.huong === h.id ? ' bat' : '')} onClick={() => giai.datCauHinh({ huong: h.id })}><b>{h.ten}</b></button>)}
        {[5, 10, 15].map((n) => <button key={n} className={'chip' + (st.soCau === n ? ' bat' : '')} onClick={() => giai.datCauHinh({ soCau: n })}><b>{n} câu</b></button>)}
      </div>
    </>
  )
}
