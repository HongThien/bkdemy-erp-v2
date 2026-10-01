// ============================================================================
// QUÁI/BOSS DỰNG TỪ ẢNH 2D (chibi ChatGPT vẽ) — cắm vào cảnh 3D qua điểm cắm `nguonQuai.ts`, cùng giao diện `Quai` như quái dựng bằng code.
// Hình: tấm "sprite" luôn quay mặt về camera, chân chạm đất (center 0.5, 0). Chuyển động làm bằng CODE trên 6 tư thế (design/FLOW-NPC-BOSS-CUOI.md §6):
//   idle thở + nhấp nhô · trúng đòn (đổi tư thế + loé trắng + rung) · hồi máu (loé xanh) · báo hiệu chiêu (lùi + phồng, đổi tư thế gồng) ·
//   giận (qua 50% máu — đổi tư thế, cố định) · bị hạ (tư thế "ha" rồi tan dần) · bóng đen (quái chưa gặp).
// Chỉ đụng transform + opacity + màu nhân (rẻ cho iPad). `prefers-reduced-motion`: bỏ rung/nhấp nhô, vẫn đổi tư thế.
// ============================================================================
import * as THREE from 'three'
import { bongTron } from './vatLieu'
import type { Quai } from './quai'
import type { BossAnh } from '../kieu'

export type TuThe = 'dung' | 'noi' | 'chieu' | 'trung' | 'gian' | 'ha'
/** Quai + vài thao tác riêng của boss (cảnh thường không cần biết; trận boss/hội thoại gọi). */
export type QuaiBoss = Quai & {
  /** ép tư thế (vd 'noi' khi đang thoại); null = trả về tư thế nền */
  datTuThe: (t: TuThe | null) => void
  /** báo hiệu trước chiêu (lùi + phồng + tư thế gồng), xong thì tự về nền */
  baoHieu: (ms?: number) => void
  /** pha 2 (≤50% máu): tư thế nền chuyển sang 'gian' */
  giaiDoan: (p: 1 | 2) => void
}

const GIAM_CHUYEN_DONG = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const TUT_AN = 1.6 // giây tan dần khi bị hạ

export function taoQuaiAnh(loai: string, a: BossAnh): QuaiBoss {
  const goc = new THREE.Group()
  const tex: Partial<Record<TuThe, THREE.Texture>> = {}
  const dl = new THREE.TextureLoader()
  const url: Record<TuThe, string> = { dung: a.dung, noi: a.noi, chieu: a.chieu, trung: a.trung, gian: a.gian, ha: a.ha }
  const mat = new THREE.SpriteMaterial({ transparent: true, depthWrite: false, toneMapped: false })
  mat.visible = false // chưa có ảnh thì ẩn (SpriteMaterial không map = ô trắng)
  const sp = new THREE.Sprite(mat)
  const H = a.cao * 1.03 // ảnh vuông, nhân vật chiếm ~97% chiều cao
  sp.scale.set(H, H, 1); sp.center.set(0.5, 0)
  goc.add(sp)
  const bg = bongTron(0.95); goc.add(bg)

  let hienTai: TuThe = 'dung', nen: TuThe = 'dung', ep: TuThe | null = null
  let tHit = 0, tHoi = 0, tBao = 0, tBaoTong = 0.7, chet = 0, daNga = false, bong = false, huy = false
  const hienTuThe = (t: TuThe) => { hienTai = t; const m = tex[t]; if (m) { mat.map = m; mat.needsUpdate = true; mat.visible = true } }
  ;(Object.keys(url) as TuThe[]).forEach((k) => {
    dl.load(url[k], (t) => {
      if (huy) { t.dispose(); return }
      t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; tex[k] = t
      if (k === hienTai) hienTuThe(k)
    })
  })

  const chonTuThe = (): TuThe => daNga ? 'ha' : ep ?? (tBao > 0 ? 'chieu' : tHit > 0 ? 'trung' : nen)
  const pha = (loai.length * 1.7) % 6.28

  return {
    goc, loai, cao: a.cao, ban: 0.95, khongVuongMien: true,
    capNhat(dt, t) {
      const w = t * 1.9 + pha
      let sx = 1, sy = 1, dx = 0, dy = 0, op = 1
      if (daNga) {
        chet = Math.min(1, chet + dt / TUT_AN)
        const k = 1 - Math.pow(1 - chet, 3)
        sx = 1 + 0.02 * k; sy = 1 - 0.05 * k; dy = 0.18 * k; op = 1 - k // ngồi nhẹ, bay lên, tan
      } else {
        if (!GIAM_CHUYEN_DONG) { sy = 1 + 0.018 * Math.sin(w * 2); sx = 1 - 0.01 * Math.sin(w * 2); dy = Math.sin(w) * 0.035 }
        if (tBao > 0) { // báo hiệu: lùi + phồng dần
          tBao = Math.max(0, tBao - dt); const k = 1 - tBao / tBaoTong
          sx *= 1 + 0.05 * k; sy *= 1 + 0.05 * k; dx += 0.12 * k
        }
        if (tHit > 0) { tHit = Math.max(0, tHit - dt) }
        if (tHoi > 0) { tHoi = Math.max(0, tHoi - dt) }
      }
      sp.scale.set(H * sx, H * sy, 1)
      const k = tHit / 0.42
      if (k > 0 && !GIAM_CHUYEN_DONG) dx += Math.sin(k * 26) * 0.1 * k
      sp.position.set(dx, dy, 0)
      mat.opacity = op
      if (bong) mat.color.setRGB(0.03, 0.02, 0.06)
      else if (k > 0) mat.color.setRGB(1 + 0.9 * k, 1 + 0.9 * k, 1 + 0.9 * k) // loé trắng
      else if (tHoi > 0) { const h = tHoi / 0.6; mat.color.setRGB(1 - 0.35 * h, 1 + 0.25 * h, 1 - 0.1 * h) }
      else mat.color.setRGB(1, 1, 1)
      const tt = chonTuThe(); if (tt !== hienTai) hienTuThe(tt)
      bg.visible = !bong && !daNga
    },
    trung() { if (!daNga) tHit = 0.42 },
    hoi() { if (!daNga) tHoi = 0.6 },
    nga() { if (!daNga) { daNga = true; chet = 0 } },
    dung() { daNga = false; chet = 0; tHit = 0; tHoi = 0; tBao = 0; ep = null; sp.scale.set(H, H, 1); sp.position.set(0, 0, 0); mat.opacity = 1 },
    daNga: () => daNga,
    bong(on) { bong = on },
    datTuThe(t) { ep = t },
    baoHieu(ms = 700) { tBaoTong = ms / 1000; tBao = tBaoTong },
    giaiDoan(p) { nen = p === 2 ? 'gian' : 'dung' },
    phaHuy() { huy = true; Object.values(tex).forEach((m) => m?.dispose()); mat.dispose(); (bg.geometry as THREE.BufferGeometry).dispose() },
  }
}
