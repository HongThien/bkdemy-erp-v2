// CA BỔ TRỢ YẾU — phía TRỢ GIẢNG (PLAN-botro-yeu-ca.md §6). Máy TA, tài khoản TA.
// List: ca tôi đứng (hôm nay · nợ cũ · sắp tới 7 ngày) + retest đến hạn của lớp tôi là TA (thông tin để đưa iPad).
// Detail 1 ca: điểm danh → tiến độ live (poll 10s, per dạng/cụm) → "Đóng ca & sinh test" (khoá sau khi có test)
// → điểm test theo dạng → nhận xét (mẫu + gõ) + mức → "Hoàn tất ca" (khoá sau khi xong). Mọi số từ fn_btyeu_*.
// KHÔNG import màn ERP desktop (luật app TA). Class màu literal (Tailwind JIT).
import { useEffect, useState, type ReactNode } from 'react'
import { caTA, dongCa, hoanTatCa, type CaTA, type ViecCaBoTro, type ViecRetest } from '../../lib/botro_yeu_ca'
import { diemDanh, huyBuoi, MUC_CATALOG } from '../../lib/gami'
import { timNhanXetMau, type NhanXetMau } from '../../lib/detest'
import { homNayVN, ddmmVN, thuCuaNgay } from '../../lib/tuan'

const POLL_MS = 10000
const hhmm = (t: string | null | undefined) => (t ? String(t).slice(0, 5) : '')
const MUC_TEN: Record<number, string> = { 1: 'Mức 1 · sau giờ', 2: 'Mức 2 · buổi riêng', 3: 'Mức 2 · GV cao cấp' }

type TrangThai = 'cho_em' | 'vang' | 'dang_luyen' | 'cho_test' | 'cho_nhan_xet' | 'hoan_tat' | 'sap_toi'
function trangThaiCa(c: ViecCaBoTro, homNay: string): TrangThai {
  if (c.danh_gia_xong_at) return 'hoan_tat'
  if (c.ngay > homNay) return 'sap_toi'
  if (c.diem_danh === 'vang' || c.diem_danh === 'vang_phep') return 'vang'
  if (!c.diem_danh) return 'cho_em'
  if (!c.co_test) return 'dang_luyen'
  if (!c.test_da_nop) return 'cho_test'
  return 'cho_nhan_xet'
}
const TT_NHAN: Record<TrangThai, { ten: string; cls: string }> = {
  cho_em: { ten: 'Chờ em đến', cls: 'bg-slate-100 text-slate-600' },
  vang: { ten: 'Vắng', cls: 'bg-rose-50 text-rose-700' },
  dang_luyen: { ten: 'Đang luyện', cls: 'bg-indigo-50 text-indigo-700' },
  cho_test: { ten: 'Đã đóng ca · chờ test', cls: 'bg-amber-50 text-amber-700' },
  cho_nhan_xet: { ten: 'Đã test · chờ nhận xét', cls: 'bg-violet-50 text-violet-700' },
  hoan_tat: { ten: 'Hoàn tất', cls: 'bg-emerald-50 text-emerald-700' },
  sap_toi: { ten: 'Sắp tới', cls: 'bg-slate-100 text-slate-500' },
}

export default function CaBoTroTA({ viec, onDoi }: { viec: { ca: ViecCaBoTro[]; retest: ViecRetest[] }; onDoi: () => void }) {
  const [moId, setMoId] = useState<string | null>(null)
  const homNay = homNayVN()
  if (moId) return <CaDetail buoiId={moId} onBack={() => { setMoId(null); onDoi() }} />

  const nhom = (tt: (t: TrangThai, c: ViecCaBoTro) => boolean) => viec.ca.filter((c) => tt(trangThaiCa(c, homNay), c))
  const homNayCa = nhom((_t, c) => c.ngay === homNay)
  const noCu = nhom((t, c) => c.ngay < homNay && t !== 'hoan_tat')
  const sapToi = nhom((t) => t === 'sap_toi')

  return (
    <div>
      <div className="bg-indigo-600 px-4 pb-2" style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}>
        <p className="mx-auto max-w-[1000px] text-[15px] font-bold text-white">🧑‍🏫 Bổ trợ yếu <span className="font-medium opacity-75">· {homNayCa.length ? `${homNayCa.length} ca hôm nay` : 'không có ca hôm nay'}{viec.retest.length ? ` · ${viec.retest.length} retest` : ''}</span></p>
      </div>
      <div className="mx-auto max-w-[1000px] px-3 pb-6 pt-3">
        {noCu.length > 0 && <Nhom tieuDe="⚠ Ca chưa hoàn tất" cls="text-rose-500" items={noCu} homNay={homNay} onMo={setMoId} />}
        <Nhom tieuDe="Hôm nay" cls="text-slate-400" items={homNayCa} homNay={homNay} onMo={setMoId} rong="Không có ca bổ trợ hôm nay." />
        {viec.retest.length > 0 && (
          <div className="mt-4">
            <p className="mb-1.5 px-1 text-[12px] font-bold uppercase tracking-wide text-violet-600">📝 Retest đến hạn · đưa iPad cho em sau ET</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {viec.retest.map((r) => (
                <div key={r.bai_test_id} className="flex items-center gap-2.5 rounded-2xl border border-violet-200/70 bg-white p-3 shadow-sm">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-[19px]">📝</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold text-slate-800">{r.ho_ten} <span className="font-normal text-slate-400">· {r.ten_lop}</span></p>
                    <p className="text-[12px] text-slate-400">{r.so_cau} câu · {r.mon}{r.ngay < homNay ? ` · ⚠ hạn ${ddmmVN(r.ngay)} (em vắng?)` : ' · hôm nay'}{r.buoi_bo_tro_ngay ? ` · ca ${ddmmVN(r.buoi_bo_tro_ngay)}` : ''}</p>
                  </div>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500">em tự làm trên iPad</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {sapToi.length > 0 && <div className="mt-4"><Nhom tieuDe="Sắp tới" cls="text-slate-400" items={sapToi} homNay={homNay} onMo={setMoId} /></div>}
      </div>
    </div>
  )
}

function Nhom({ tieuDe, cls, items, homNay, onMo, rong }: { tieuDe: string; cls: string; items: ViecCaBoTro[]; homNay: string; onMo: (id: string) => void; rong?: string }) {
  if (items.length === 0 && !rong) return null
  return (
    <div className="mb-3">
      <p className={`mb-1.5 px-1 text-[12px] font-bold uppercase tracking-wide ${cls}`}>{tieuDe}</p>
      {items.length === 0 ? <p className="rounded-2xl border border-slate-200/70 bg-white p-4 text-center text-[13px] text-slate-400">{rong}</p> : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {items.map((c) => {
            const tt = TT_NHAN[trangThaiCa(c, homNay)]
            return (
              <button key={c.buoi_id} onClick={() => onMo(c.buoi_id)} className="flex items-center gap-2.5 rounded-2xl border border-slate-200/70 bg-white p-3 text-left shadow-sm active:bg-slate-50">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[19px]">🧑‍🏫</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold text-slate-800">{c.ho_ten} <span className="font-normal text-slate-400">· {c.mon}{c.khoi ? ` · K${c.khoi}` : ''}</span></p>
                  <p className="flex flex-wrap items-center gap-1.5 text-[12px] text-slate-400">
                    <span>{c.ngay === homNay ? 'hôm nay' : `${thuCuaNgay(c.ngay)} ${ddmmVN(c.ngay)}`}{c.gio_bat_dau ? ` · ${hhmm(c.gio_bat_dau)}` : ''}{c.phong ? ` · ${c.phong}` : ''}</span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-500">{MUC_TEN[c.level ?? 1] ?? `L${c.level}`}</span>
                    <span>{c.so_dang} dạng</span>
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${tt.cls}`}>{tt.ten}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── DETAIL 1 CA ──────────────────────────────────────────────────────────────
function CaDetail({ buoiId, onBack }: { buoiId: string; onBack: () => void }) {
  const [ca, setCa] = useState<CaTA | null | undefined>(undefined)
  const [busy, setBusy] = useState<string | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)
  const [hoiVang, setHoiVang] = useState(false)
  const [hoiDong, setHoiDong] = useState(false)
  // form nhận xét
  const [nx, setNx] = useState('')
  const [mucMa, setMucMa] = useState<string | null>(null)
  const [khongTest, setKhongTest] = useState(false)
  const [lyDo, setLyDo] = useState('')
  const [mau, setMau] = useState<NhanXetMau[]>([])
  const [now, setNow] = useState(Date.now())

  const tai = async () => { try { const c = await caTA(buoiId); setCa(c); if (c?.danh_gia) { setNx(c.danh_gia.nhan_xet ?? ''); setMucMa(c.danh_gia.muc_ma) } } catch (e: any) { setLoi(e?.message ?? String(e)); setCa(null) } }
  useEffect(() => { tai() }, [buoiId]) // eslint-disable-line
  useEffect(() => { const id = setInterval(() => { tai(); setNow(Date.now()) }, POLL_MS); return () => clearInterval(id) }, [buoiId]) // eslint-disable-line
  useEffect(() => { if (ca?.mon) timNhanXetMau(ca.mon, 'kien_thuc', '').then(setMau).catch(() => {}) }, [ca?.mon])

  async function chay(k: string, f: () => Promise<void>, xong?: string) {
    setBusy(k); setLoi(null); setOk(null)
    try { await f(); await tai(); if (xong) setOk(xong) } catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(null) }
  }

  if (ca === undefined) return <div className="p-6 text-center text-[13px] text-slate-400">Đang tải ca…</div>
  if (!ca) return <div className="p-6"><button onClick={onBack} className="text-[13px] text-indigo-600">‹ Quay lại</button><p className="mt-3 text-[13px] text-rose-600">{loi ?? 'Không thấy ca.'}</p></div>

  const coMat = ca.diem_danh === 'co_mat'
  const vang = ca.diem_danh === 'vang' || ca.diem_danh === 'vang_phep'
  const daDong = !!ca.test
  const testDaNop = !!ca.test?.da_nop
  const hoanTat = !!ca.danh_gia_xong_at
  const tongCau = ca.dangs.reduce((s, d) => s + d.so_cau, 0)
  const cauCuoi = ca.dangs.map((d) => d.cau_cuoi_at).filter(Boolean).sort().pop()
  const imPhut = cauCuoi ? Math.floor((now - Date.parse(cauCuoi)) / 60000) : null

  return (
    <div>
      <div className="bg-indigo-600 px-4 pb-2.5" style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}>
        <div className="mx-auto flex max-w-[1000px] items-center gap-2">
          <button onClick={onBack} className="rounded-lg px-2 py-1 text-[15px] font-bold text-white/90 active:bg-white/10">‹</button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-bold text-white">{ca.hs.ho_ten} <span className="font-medium opacity-75">· {ca.mon}{ca.hs.khoi ? ` · K${ca.hs.khoi}` : ''}</span></p>
            <p className="text-[11.5px] text-indigo-100">{thuCuaNgay(ca.ngay)} {ddmmVN(ca.ngay)} · {MUC_TEN[ca.hs.level ?? 1] ?? `L${ca.hs.level}`} · {ca.dangs.length} dạng{ca.so_lan_huy ? ` · đã huỷ ${ca.so_lan_huy} lần` : ''}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1000px] px-3 pb-8 pt-3">
        {loi && <p className="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</p>}
        {ok && <p className="mb-3 rounded-xl bg-emerald-50 px-3 py-2 text-[12.5px] font-medium text-emerald-700">✓ {ok}</p>}

        {/* 1. Điểm danh */}
        <Khoi so={1} ten="Điểm danh" trang={coMat ? 'xong' : vang ? 'xong' : 'dang'}>
          {coMat ? <p className="text-[13px] text-emerald-700">✓ Em có mặt — iPad của em đã thấy ca.</p>
            : vang ? <p className="text-[13px] text-rose-700">Em vắng — buổi đã huỷ (đếm số lần huỷ của ca).</p>
            : hoiVang ? (
              <div className="flex flex-wrap items-center gap-2 text-[13px]">
                <span className="text-slate-600">Đánh vắng và HUỶ buổi này?</span>
                <button disabled={!!busy} onClick={() => chay('vang', async () => { await diemDanh(ca.buoi_hoc_hs_id, 'vang'); await huyBuoi(ca.buoi_id, 'HS vắng ca bổ trợ yếu') }, 'Đã đánh vắng và huỷ buổi. OPS xếp lại ở màn Xếp bổ trợ yếu.')}
                  className="rounded-lg bg-rose-600 px-3 py-1.5 font-semibold text-white disabled:opacity-50">Vắng · huỷ buổi</button>
                <button onClick={() => setHoiVang(false)} className="rounded-lg px-3 py-1.5 text-slate-500">Thôi</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button disabled={!!busy || ca.trang_thai !== 'mo'} onClick={() => chay('comat', () => diemDanh(ca.buoi_hoc_hs_id, 'co_mat'), 'Đã điểm danh có mặt — em mở app là thấy ca.')}
                  className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-[14px] font-bold text-white disabled:opacity-50">{busy === 'comat' ? '…' : '✓ Em có mặt'}</button>
                <button disabled={!!busy || ca.trang_thai !== 'mo'} onClick={() => setHoiVang(true)} className="rounded-xl border border-rose-200 px-4 py-2.5 text-[14px] font-semibold text-rose-600 disabled:opacity-50">Vắng</button>
              </div>
            )}
        </Khoi>

        {/* 2. Tiến độ luyện */}
        <Khoi so={2} ten="Luyện" trang={!coMat ? 'cho' : daDong ? 'xong' : 'dang'}
          phu={coMat && !daDong ? (tongCau === 0 ? 'em chưa làm câu nào' : imPhut != null && imPhut >= 5 ? `⚠ im ${imPhut} phút` : 'đang làm · tự cập nhật 10s') : undefined}>
          {ca.dangs.length === 0 ? <p className="text-[13px] text-slate-400">Ca chưa có dạng — chọn ở "Nội dung bổ trợ yếu".</p> : (
            <div className="flex flex-col gap-2">
              {ca.dangs.map((d) => (
                <div key={d.ma_dang} className="rounded-xl bg-slate-50 px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-semibold text-slate-800">{d.ten_dang}</p>
                      <p className="truncate text-[11.5px] text-slate-400">{d.ten_chuyen_de}{d.day_at && d.day_buoi_id !== ca.buoi_id ? ' · đã học ca trước' : ''}{d.dong_at ? ' · ✓ đã đóng dạng' : ''}</p>
                    </div>
                    <TiLe dung={d.so_dung} tong={d.so_cau} />
                  </div>
                  {d.cums.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {d.cums.map((c, i) => (
                        <span key={c.ma_cum ?? i} className="rounded-md bg-white px-2 py-0.5 text-[11px] text-slate-600 ring-1 ring-slate-200">
                          {c.ten}: <b className={c.so_cau && c.so_dung / c.so_cau >= 0.7 ? 'text-emerald-700' : 'text-amber-700'}>{c.so_dung}/{c.so_cau}</b>{c.so_goi_y ? ` · 💡${c.so_goi_y}` : ''}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Khoi>

        {/* 3. Đóng ca & test */}
        <Khoi so={3} ten="Đóng ca · test cuối buổi" trang={!coMat ? 'cho' : !daDong ? 'dang' : testDaNop ? 'xong' : 'dang'}>
          {!daDong ? (
            hoiDong ? (
              <div className="flex flex-wrap items-center gap-2 text-[13px]">
                <span className="text-slate-600">Đóng ca? Em không luyện thêm được; hệ sinh test từ {ca.dangs.filter((d) => d.so_cau > 0).length} dạng đã luyện{tongCau === 0 ? ' — chưa luyện gì → ca đóng "không học", không test' : ''}.</span>
                <button disabled={!!busy} onClick={() => chay('dong', async () => { const r = await dongCa(ca.buoi_id); setHoiDong(false); if (r.khong_hoc) setOk('Ca đóng "không học" — không có test. Nhận xét rồi hoàn tất.') }, undefined)}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 font-semibold text-white disabled:opacity-50">{busy === 'dong' ? 'Đang sinh test…' : 'Đóng ca & sinh test'}</button>
                <button onClick={() => setHoiDong(false)} className="rounded-lg px-3 py-1.5 text-slate-500">Thôi</button>
              </div>
            ) : (
              <button disabled={!coMat || !!busy} onClick={() => setHoiDong(true)} className="w-full rounded-xl bg-indigo-600 py-2.5 text-[14px] font-bold text-white disabled:opacity-40">Đóng ca & sinh test</button>
            )
          ) : (
            <div className="text-[13px]">
              <p className="text-slate-700">✓ Đã đóng ca · test {ca.test!.so_cau} câu {testDaNop ? <span className="font-semibold text-emerald-700">· em đã nộp</span> : <span className="font-semibold text-amber-700">· chờ em làm trên iPad</span>}</p>
              {testDaNop && ca.test!.theo_dang.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {ca.test!.theo_dang.map((t) => {
                    const d = ca.dangs.find((x) => x.ma_dang === t.ma_dang)
                    return <span key={t.ma_dang} className="rounded-md bg-slate-50 px-2 py-0.5 text-[11.5px] text-slate-600 ring-1 ring-slate-200">{d?.ten_dang ?? t.ma_dang}: <b className={t.so_cau && t.so_dung / t.so_cau >= 0.5 ? 'text-emerald-700' : 'text-rose-700'}>{t.so_dung}/{t.so_cau}</b></span>
                  })}
                </div>
              )}
              {ca.retest ? <p className="mt-1.5 text-[12px] text-violet-700">📝 Retest đã sinh: {ca.retest.so_cau} câu · làm sau ET {thuCuaNgay(ca.retest.ngay)} {ddmmVN(ca.retest.ngay)} (TA lớp đưa iPad){ca.retest.da_nop ? ' · ✓ đã nộp' : ''}</p>
                : <p className="mt-1.5 text-[12px] text-amber-700">⚠ Không sinh được retest (lớp em không có buổi thường trong 28 ngày tới) — báo OPS.</p>}
            </div>
          )}
        </Khoi>

        {/* 4. Nhận xét & hoàn tất */}
        <Khoi so={4} ten="Nhận xét · hoàn tất ca" trang={hoanTat ? 'xong' : coMat ? 'dang' : 'cho'}>
          {hoanTat ? (
            <div className="text-[13px] text-slate-700">
              <p className="text-emerald-700">✓ Đã hoàn tất ca.</p>
              {ca.danh_gia?.muc_ma && <p className="mt-1">Mức: <b>{MUC_CATALOG.find((m) => m.ma === ca.danh_gia!.muc_ma)?.nhan ?? ca.danh_gia.muc_ma}</b></p>}
              {ca.danh_gia?.nhan_xet && <p className="mt-1 whitespace-pre-wrap text-slate-600">{ca.danh_gia.nhan_xet}</p>}
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {mau.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {mau.slice(0, 8).map((m) => <button key={m.id} onClick={() => setNx((s) => (s ? s + '\n' : '') + m.noiDung)} className="rounded-lg bg-slate-100 px-2 py-1 text-left text-[11.5px] text-slate-600 active:bg-slate-200">+ {m.noiDung.length > 48 ? m.noiDung.slice(0, 48) + '…' : m.noiDung}</button>)}
                </div>
              )}
              <textarea value={nx} onChange={(e) => setNx(e.target.value)} rows={3} placeholder="Nhận xét cho phụ huynh và GV: em làm được gì, còn yếu gì…"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-[13.5px] outline-none focus:border-indigo-400" />
              <select value={mucMa ?? ''} onChange={(e) => setMucMa(e.target.value || null)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-indigo-400">
                <option value="">— Mức (tuỳ chọn) —</option>
                {MUC_CATALOG.map((m) => <option key={m.ma} value={m.ma}>Mức {m.muc} · {m.nhan}</option>)}
              </select>
              {daDong && !testDaNop && (
                <label className="flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-[12.5px] text-amber-800">
                  <input type="checkbox" checked={khongTest} onChange={(e) => setKhongTest(e.target.checked)} className="mt-0.5" />
                  <span className="flex-1">Em không làm test cuối buổi (bỏ về / hết giờ)
                    {khongTest && <input value={lyDo} onChange={(e) => setLyDo(e.target.value)} placeholder="Lý do…" className="mt-1.5 w-full rounded-lg border border-amber-200 bg-white px-2 py-1.5 text-[13px] outline-none" />}
                  </span>
                </label>
              )}
              <button disabled={!!busy || !coMat || (!daDong && tongCau > 0) || (daDong && !testDaNop && !(khongTest && lyDo.trim()))}
                onClick={() => chay('ht', () => hoanTatCa(ca.buoi_id, nx, mucMa, khongTest ? lyDo.trim() : null), 'Đã hoàn tất ca.')}
                className="w-full rounded-xl bg-emerald-600 py-2.5 text-[14px] font-bold text-white disabled:opacity-40">
                {busy === 'ht' ? 'Đang lưu…' : 'Hoàn tất ca'}
              </button>
              {!daDong && tongCau > 0 && <p className="text-[11.5px] text-slate-400">Đóng ca (bước 3) trước rồi mới hoàn tất.</p>}
              {daDong && !testDaNop && !khongTest && <p className="text-[11.5px] text-slate-400">Chờ em nộp test, hoặc tick "không làm test" kèm lý do.</p>}
            </div>
          )}
        </Khoi>
      </div>
    </div>
  )
}

function Khoi({ so, ten, trang, phu, children }: { so: number; ten: string; trang: 'cho' | 'dang' | 'xong'; phu?: string; children: ReactNode }) {
  const dot = trang === 'xong' ? 'bg-emerald-500 text-white' : trang === 'dang' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
  return (
    <div className={`mb-3 rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-sm ${trang === 'cho' ? 'opacity-60' : ''}`}>
      <div className="mb-2 flex items-center gap-2">
        <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-bold ${dot}`}>{trang === 'xong' ? '✓' : so}</span>
        <p className="text-[14px] font-bold text-slate-800">{ten}</p>
        {phu && <span className="ml-auto text-[11.5px] text-slate-400">{phu}</span>}
      </div>
      {children}
    </div>
  )
}

function TiLe({ dung, tong }: { dung: number; tong: number }) {
  if (!tong) return <span className="shrink-0 text-[11.5px] text-slate-400">chưa làm</span>
  const p = Math.round((dung / tong) * 100)
  return <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11.5px] font-semibold ${p >= 70 ? 'bg-emerald-50 text-emerald-700' : p >= 40 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>{dung}/{tong} · {p}%</span>
}

export function demNoBoTro(viec: { ca: ViecCaBoTro[]; retest: ViecRetest[] }): number {
  const homNay = homNayVN()
  return viec.ca.filter((c) => c.ngay <= homNay && !c.danh_gia_xong_at && c.diem_danh !== 'vang').length + viec.retest.length
}
