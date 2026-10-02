// Đồ hoạ 3D (three.js) — nạp động, chỉ khi bật đồ hoạ 3D. Nhân vật KayKit (CC0) + bộ chuyển động KayKit/Kevin.
// Mẫu dựng theo prototype BK Hero Universe (arena-game.tsx): gắn vũ khí vào xương handslot, mixer theo từng nhân vật.
import * as THREE from 'three'
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js'

type Kieu = 'can' | 'phep' | 'cung'
interface CauHinhNv { model: string; vk: string; tay: 'l' | 'r'; kieu: Kieu; mau: number }
export const NV3D: Record<string, CauHinhNv> = {
  knight: { model: 'knight.glb', vk: 'sword_1handed.gltf', tay: 'r', kieu: 'can', mau: 0xf5c451 },
  barbarian: { model: 'barbarian.glb', vk: 'axe_1handed.gltf', tay: 'r', kieu: 'can', mau: 0xff8a50 },
  rogue: { model: 'rogue.glb', vk: 'dagger.gltf', tay: 'r', kieu: 'can', mau: 0x9ccc65 },
  mage: { model: 'mage.glb', vk: 'staff.gltf', tay: 'r', kieu: 'phep', mau: 0xb48cff },
  druid: { model: 'druid.glb', vk: 'wand.gltf', tay: 'r', kieu: 'phep', mau: 0x66e3a5 },
  ranger: { model: 'ranger.glb', vk: 'bow_withString.gltf', tay: 'l', kieu: 'cung', mau: 0xf2c56b },
  Skeleton_Warrior: { model: 'Skeleton_Warrior.glb', vk: 'sword_1handed.gltf', tay: 'r', kieu: 'can', mau: 0xff6b6b },
  Skeleton_Rogue: { model: 'Skeleton_Rogue.glb', vk: 'dagger.gltf', tay: 'r', kieu: 'can', mau: 0x64b5f6 },
  Skeleton_Minion: { model: 'Skeleton_Minion.glb', vk: 'axe_1handed.gltf', tay: 'r', kieu: 'can', mau: 0x81c784 },
  Skeleton_Mage: { model: 'Skeleton_Mage.glb', vk: 'staff.gltf', tay: 'r', kieu: 'phep', mau: 0x8fe8ff },
}

const loader = new GLTFLoader()
const cache = new Map<string, Promise<GLTF>>()
const tai = (url: string) => { if (!cache.has(url)) cache.set(url, loader.loadAsync(url)); return cache.get(url)! }

interface BoAnim { idle?: THREE.AnimationClip; danh?: THREE.AnimationClip; trung?: THREE.AnimationClip; nga?: THREE.AnimationClip; vui?: THREE.AnimationClip }
async function boAnim(kieu: Kieu): Promise<BoAnim> {
  const [canChien, xa, chung] = await Promise.all([tai('/3d/anim/kevin_melee_free.glb'), tai('/3d/anim/Rig_Medium_CombatRanged.glb'), tai('/3d/anim/kaykit_general.glb')])
  const f = (g: GLTF, n: string) => THREE.AnimationClip.findByName(g.animations, n) ?? undefined
  return {
    idle: kieu === 'can' ? f(canChien, 'combat_idle_1h_01') : kieu === 'cung' ? f(xa, 'Ranged_Bow_Idle') : f(chung, 'Idle_A'),
    danh: kieu === 'can' ? f(canChien, 'attack_1h_01_r') : kieu === 'cung' ? f(xa, 'Ranged_Bow_Release') : f(xa, 'Ranged_Magic_Shoot'),
    trung: f(chung, 'Hit_A'),
    nga: f(chung, 'Death_A'),
    vui: f(xa, 'Ranged_Magic_Raise') ?? f(chung, 'Interact'),
  }
}

export interface NhanVat3D { root: THREE.Object3D; mixer: THREE.AnimationMixer; anim: BoAnim; cfg: CauHinhNv }
export async function dungNhanVat(nv: string): Promise<NhanVat3D> {
  const cfg = NV3D[nv] ?? NV3D.knight
  const [m, vk, anim] = await Promise.all([tai('/3d/nv/' + cfg.model), tai('/3d/vk/' + cfg.vk), boAnim(cfg.kieu)])
  const root = cloneSkinned(m.scene)
  const tay = root.getObjectByName(cfg.tay === 'l' ? 'handslot.l' : 'handslot.r')
  if (tay) tay.add(vk.scene.clone(true))
  root.traverse((o) => { if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).castShadow = true })
  const mixer = new THREE.AnimationMixer(root)
  if (anim.idle) mixer.clipAction(anim.idle).play()
  return { root, mixer, anim, cfg }
}

// ───────────────────────── SÀN ĐẤU ─────────────────────────
export interface SanDau {
  danh(ben: 0 | 1): void
  ketThuc(thang: -1 | 0 | 1): void
  datNhanVat(trai: string, phai: string): void
  huy(): void
}

export function taoSan(mount: HTMLElement, trai: string, phai: string): SanDau {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 100)
  camera.position.set(0, 2.1, 7.4)
  camera.lookAt(0, 1.05, 0)
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  mount.appendChild(renderer.domElement)
  scene.add(new THREE.HemisphereLight(0xfff1d6, 0x2a2350, 2.6))
  const den = new THREE.DirectionalLight(0xffffff, 3.2)
  den.position.set(2.5, 6, 4)
  den.castShadow = true
  den.shadow.mapSize.set(1024, 1024)
  scene.add(den)
  const vien = new THREE.DirectionalLight(0x8fb4ff, 2)
  vien.position.set(-4, 3, -3)
  scene.add(vien)
  const san = new THREE.Mesh(new THREE.CircleGeometry(3.6, 64), new THREE.MeshStandardMaterial({ color: 0x3a2d6b, roughness: 0.85, transparent: true, opacity: 0.88 }))
  san.rotation.x = -Math.PI / 2
  san.receiveShadow = true
  scene.add(san)
  const vong = new THREE.Mesh(new THREE.RingGeometry(3.5, 3.62, 64), new THREE.MeshBasicMaterial({ color: 0xffd36e, transparent: true, opacity: 0.7 }))
  vong.rotation.x = -Math.PI / 2
  vong.position.y = 0.01
  scene.add(vong)

  const nv: (NhanVat3D | null)[] = [null, null]
  const hao: THREE.Mesh[] = []
  const timers: ReturnType<typeof setTimeout>[] = []
  const dan: { o: THREE.Object3D; tu: THREE.Vector3; den: THREE.Vector3; t: number; d: number; mau: number }[] = []
  const no: { o: THREE.Mesh; m: THREE.MeshBasicMaterial; t: number; d: number }[] = []
  let huy = false
  let phienNv = 0

  const vongChan = (x: number, mau: number) => {
    const r = new THREE.Mesh(new THREE.RingGeometry(0.45, 0.62, 40), new THREE.MeshBasicMaterial({ color: mau, transparent: true, opacity: 0.55, depthWrite: false }))
    r.rotation.x = -Math.PI / 2
    r.position.set(x, 0.02, 0)
    scene.add(r)
    return r
  }

  const dung = (a: string, b: string) => {
    const p = ++phienNv
    nv.forEach((n) => n && scene.remove(n.root))
    hao.splice(0).forEach((h) => scene.remove(h))
    Promise.all([dungNhanVat(a), dungNhanVat(b)]).then((ds) => {
      if (huy || p !== phienNv) return
      ds.forEach((n, i) => {
        const x = i === 0 ? -1.45 : 1.45
        n.root.position.set(x, 0, 0)
        n.root.rotation.y = i === 0 ? Math.PI / 2 - 0.35 : -Math.PI / 2 + 0.35
        scene.add(n.root)
        nv[i] = n
        hao.push(vongChan(x, n.cfg.mau))
      })
    }).catch(() => { /* thiếu file 3D ⇒ sàn trống, chữ vẫn chơi được */ })
  }
  dung(trai, phai)

  const choi = (n: NhanVat3D | null, clip?: THREE.AnimationClip, giu = false, toc = 1) => {
    if (!n || !clip) return
    n.mixer.stopAllAction()
    const a = n.mixer.clipAction(clip)
    a.reset().setLoop(THREE.LoopOnce, 1)
    a.clampWhenFinished = true
    a.setEffectiveTimeScale(toc)
    a.play()
    if (!giu) timers.push(setTimeout(() => { if (n.anim.idle) { n.mixer.stopAllAction(); n.mixer.clipAction(n.anim.idle).reset().fadeIn(0.15).play() } }, (clip.duration / toc) * 1000 + 30))
  }

  const banDan = (ben: 0 | 1, mau: number, kieu: Kieu) => {
    const huong = ben === 0 ? 1 : -1
    const o = new THREE.Group()
    if (kieu === 'cung') {
      const than = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.7, 8), new THREE.MeshStandardMaterial({ color: 0x8a5b2f }))
      than.rotation.z = -Math.PI / 2
      const mui = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.16, 8), new THREE.MeshStandardMaterial({ color: mau, metalness: 0.4 }))
      mui.position.x = 0.42
      mui.rotation.z = -Math.PI / 2
      o.add(than, mui)
      if (huong < 0) o.rotation.y = Math.PI
    } else {
      o.add(new THREE.Mesh(new THREE.SphereGeometry(0.14, 20, 16), new THREE.MeshBasicMaterial({ color: mau })))
      o.add(new THREE.Mesh(new THREE.SphereGeometry(0.24, 18, 14), new THREE.MeshBasicMaterial({ color: mau, transparent: true, opacity: 0.25, depthWrite: false })))
      o.add(new THREE.PointLight(mau, 2.5, 2.4))
    }
    const tu = new THREE.Vector3(huong * -1.0, 1.35, 0.1)
    const toi = new THREE.Vector3(huong * 1.25, 1.2, 0.05)
    o.position.copy(tu)
    scene.add(o)
    dan.push({ o, tu, den: toi, t: 0, d: 0.5, mau })
  }

  const noTai = (x: number, mau: number) => {
    const m = new THREE.MeshBasicMaterial({ color: mau, transparent: true, opacity: 0.8, depthWrite: false })
    const o = new THREE.Mesh(new THREE.SphereGeometry(0.18, 18, 14), m)
    o.position.set(x, 1.2, 0.05)
    scene.add(o)
    no.push({ o, m, t: 0, d: 0.35 })
  }

  const ro = new ResizeObserver(() => {
    const r = mount.getBoundingClientRect()
    renderer.setSize(r.width, r.height, false)
    camera.aspect = r.width / Math.max(1, r.height)
    // khung dọc hẹp ⇒ lùi camera cho đủ 2 nhân vật
    camera.position.z = camera.aspect < 1 ? 7.4 / Math.max(0.55, camera.aspect) : 7.4
    camera.updateProjectionMatrix()
  })
  ro.observe(mount)

  const clock = new THREE.Clock()
  let raf = 0
  const ve = () => {
    const dt = Math.min(0.05, clock.getDelta())
    nv.forEach((n) => n?.mixer.update(dt))
    vong.rotation.z += dt * 0.15
    for (let k = dan.length - 1; k >= 0; k--) {
      const p = dan[k]
      p.t += dt
      const q = Math.min(1, p.t / p.d)
      p.o.position.lerpVectors(p.tu, p.den, q)
      p.o.position.y += Math.sin(q * Math.PI) * 0.25
      if (q >= 1) { scene.remove(p.o); noTai(p.den.x, p.mau); dan.splice(k, 1) }
    }
    for (let k = no.length - 1; k >= 0; k--) {
      const e = no[k]
      e.t += dt
      const q = Math.min(1, e.t / e.d)
      e.o.scale.setScalar(1 + q * 3)
      e.m.opacity = 0.8 * (1 - q)
      if (q >= 1) { scene.remove(e.o); e.o.geometry.dispose(); e.m.dispose(); no.splice(k, 1) }
    }
    renderer.render(scene, camera)
    raf = requestAnimationFrame(ve)
  }
  ve()

  return {
    danh(ben) {
      const a = nv[ben], b = nv[1 - ben]
      if (!a) return
      choi(a, a.anim.danh, false, 1.25)
      if (a.cfg.kieu !== 'can') timers.push(setTimeout(() => banDan(ben, a.cfg.mau, a.cfg.kieu), 260))
      timers.push(setTimeout(() => { choi(b, b?.anim.trung); if (a.cfg.kieu === 'can') noTai(ben === 0 ? 1.25 : -1.25, a.cfg.mau) }, a.cfg.kieu === 'can' ? 330 : 760))
    },
    ketThuc(thang) {
      if (thang === -1) return
      const w = nv[thang], l = nv[1 - thang]
      choi(w, w?.anim.danh, false, 1.1)
      timers.push(setTimeout(() => choi(l, l?.anim.nga, true), 500))
    },
    datNhanVat: dung,
    huy() {
      huy = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      timers.forEach(clearTimeout)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    },
  }
}

// ───────────────────────── CHÂN DUNG (avatar) ─────────────────────────
let rPortrait: THREE.WebGLRenderer | null = null
export async function chupChanDung(nv: string, co = 256): Promise<string> {
  const n = await dungNhanVat(nv)
  if (!rPortrait) {
    rPortrait = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
    rPortrait.outputColorSpace = THREE.SRGBColorSpace
  }
  rPortrait.setSize(co, co, false)
  const sc = new THREE.Scene()
  sc.add(new THREE.HemisphereLight(0xffffff, 0x444466, 3))
  const d = new THREE.DirectionalLight(0xffffff, 2.5)
  d.position.set(1.5, 3, 4)
  sc.add(d)
  n.root.rotation.y = 0.35
  sc.add(n.root)
  n.mixer.update(0.4)
  const cam = new THREE.PerspectiveCamera(30, 1, 0.05, 50)
  cam.position.set(0, 1.55, 3.0)
  cam.lookAt(0, 1.25, 0)
  rPortrait.render(sc, cam)
  return rPortrait.domElement.toDataURL('image/png')
}
