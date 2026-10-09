// SOI MÔ HÌNH BOSS CHIBI 3D CẬN CẢNH (hs.html?xem=boss3d · &ma=boss_thuy · &tt=noi · &goc=0.5 góc xoay): sân khấu riêng, đèn riêng, không cần vào trận.
// Dùng để chỉnh nét mặt / tay / áo choàng / hào quang — cùng `taoBossChibi3D` cảnh trận dùng.
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { laySkin } from '../skin/registry'
import { taoBossChibi3D } from '../skin/the3d/bossChibi3D'
import { taoQuaiRelief } from '../skin/the3d/quaiRelief'
import { taoQuaiAnh } from '../skin/the3d/quaiAnh'
import type { QuaiBoss, TuThe } from '../skin/the3d/quaiAnh'
import { NHAN_TU_THE } from './BossSan'

export default function XemMoHinh3D() {
  const q = new URLSearchParams(location.search)
  const ma = q.get('ma') ?? 'boss_thuy'
  const a = laySkin(null).boss?.[ma]
  const ref = useRef<HTMLDivElement>(null)
  const boss = useRef<QuaiBoss | null>(null)
  const [tt, setTt] = useState<TuThe>((q.get('tt') as TuThe) ?? 'dung')
  const goc = useRef(+(q.get('goc') ?? '0.45'))
  const gan = useRef(q.get('gan') === '1')
  useEffect(() => {
    const el = ref.current
    if (!el || !a) return
    const r = new THREE.WebGLRenderer({ antialias: true, alpha: false }); r.setPixelRatio(Math.min(2, devicePixelRatio)); el.appendChild(r.domElement)
    const sc = new THREE.Scene(); const pal = laySkin(null).the3d!; sc.background = new THREE.Color(pal.troi) // màu cảnh/đèn lấy từ bảng màu 3D của style
    const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
    sc.add(new THREE.HemisphereLight(pal.hemiTroi, pal.hemiDat, pal.hemiCuong)); const sun = new THREE.DirectionalLight(pal.matTroi, pal.matTroiCuong); sun.position.set(3, 6, 6); sc.add(sun)
    const kieu = q.get('kieu') ?? a.dang ?? 'anh' // anh | relief | chibi — so 3 cách dựng
    const b = kieu === 'chibi' && a.mo3d ? taoBossChibi3D(ma, a.mo3d, a.cao) : kieu === 'relief' ? taoQuaiRelief(ma, a) : taoQuaiAnh(ma, a); boss.current = b; sc.add(b.goc)
    const fit = () => { const w = el.clientWidth, h = el.clientHeight; r.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix() }
    fit(); const ro = new ResizeObserver(fit); ro.observe(el)
    let raf = 0, last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now
      b.goc.rotation.y = goc.current
      b.capNhat(dt, now / 1000)
      if (gan.current) { cam.position.set(0, 1.9, 4.3); cam.lookAt(0, 1.75, 0) } else { cam.position.set(0, 1.5, 5.4); cam.lookAt(0, 1.2, 0) }
      r.render(sc, cam); raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); b.phaHuy(); r.dispose(); el.removeChild(r.domElement) }
  }, [ma, a])
  useEffect(() => { boss.current?.datTuThe(tt === 'dung' ? null : tt) }, [tt])
  if (!a) return <div className="p-6 text-[15.5px]">Boss “{ma}” không tồn tại.</div>
  const nut = (t: string, f: () => void, on = false) => <button key={t} onClick={f} className="rounded-full px-3 py-1 text-[14px] font-bold" style={{ border: '1.5px solid var(--sk-line)', background: on ? 'var(--sk-acc)' : 'var(--sk-surface2)', color: on ? 'var(--sk-acc-ink)' : 'var(--sk-ink)' }}>{t}</button>
  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: 'var(--sk-bg)', color: 'var(--sk-ink)', fontFamily: 'var(--sk-font)' }}>
      <div ref={ref} className="min-h-0 flex-1" />
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-2" style={{ background: 'var(--sk-surface)' }}>
        {(Object.keys(NHAN_TU_THE) as TuThe[]).map((k) => nut(NHAN_TU_THE[k], () => setTt(k), k === tt))}
        {nut('Trúng đòn', () => boss.current?.trung())}
        {nut('Hồi máu', () => boss.current?.hoi())}
        {nut('Báo hiệu chiêu', () => boss.current?.baoHieu())}
        {nut('Pha 2', () => boss.current?.giaiDoan(2))}
        {nut('Pha 1', () => boss.current?.giaiDoan(1))}
        {nut('Hạ', () => boss.current?.nga())}
        {nut('Dựng lại', () => boss.current?.dung())}
        {nut('Cận mặt', () => { gan.current = !gan.current })}
        {nut('Xoay trái', () => { goc.current -= 0.4 })}{nut('Xoay phải', () => { goc.current += 0.4 })}
      </div>
    </div>
  )
}
