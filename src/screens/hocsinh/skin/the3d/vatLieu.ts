// ============================================================================
// VẬT LIỆU DÙNG CHUNG: mọi vật đi qua cùng một bộ shader (gió lắc theo aFlex · viền sáng fresnel · tông toon mềm).
// Nhờ vậy cả thế giới cùng lắc theo gió, cùng ánh sáng, "ăn nhập" với nhau dù hình rất đơn giản (nghien-cuu-do-hoa-little-habitats.md §2 #4-5).
// ============================================================================
import * as THREE from 'three'

/** Uniform toàn cục (thời gian cho gió + nước). Sân khấu cập nhật .uTime mỗi khung; .uGio (độ lắc gió) + .uNuoc (0/1/2 mức hiệu ứng nước)
 *  theo bảng chất lượng (`chatLuong.ts`) — đổi được ngay không dựng lại cảnh. */
export const TOAN_CUC = { uTime: { value: 0 }, uGio: { value: 1 }, uNuoc: { value: 2 } }

/** Đất / cây / đá: Lambert tô theo màu đỉnh, có gió nếu hình có aFlex. */
export function matVat(op: { gio?: boolean; phatSang?: THREE.ColorRepresentation } = {}) {
  const m = new THREE.MeshLambertMaterial({ vertexColors: true })
  if (op.phatSang) m.emissive = new THREE.Color(op.phatSang)
  if (op.gio) {
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uTime = TOAN_CUC.uTime; sh.uniforms.uGio = TOAN_CUC.uGio
      sh.vertexShader = 'attribute float aFlex;\nuniform float uTime;\nuniform float uGio;\n' + sh.vertexShader.replace('#include <begin_vertex>', `
        vec3 transformed = vec3(position);
        #ifdef USE_INSTANCING
          float ph = instanceMatrix[3].x * 0.7 + instanceMatrix[3].z * 0.5;
        #else
          float ph = modelMatrix[3].x * 0.7 + modelMatrix[3].z * 0.5;
        #endif
        float sway = sin(uTime * 1.6 + ph) * aFlex * 0.07 * uGio;
        transformed.x += sway; transformed.z += sway * 0.6;`)
    }
  }
  return m
}

let _gm: THREE.DataTexture | null = null
/** Bản đồ chuyển cấp độ sáng 4 nấc, mềm (không cứng như hoạt hình 2 tông). */
function gradientToon() {
  if (_gm) return _gm
  const d = new Uint8Array([70, 140, 205, 255])
  _gm = new THREE.DataTexture(d, 4, 1, THREE.RedFormat)
  _gm.minFilter = _gm.magFilter = THREE.NearestFilter
  _gm.needsUpdate = true
  return _gm
}

/** Quái / hero: Toon mềm + viền sáng + phát sáng chỉnh được (đòn trúng, hồi máu). Mỗi sinh vật một vật liệu riêng. */
export function matToon(op: { vienSang?: THREE.ColorRepresentation; mau?: THREE.ColorRepresentation } = {}) {
  const m = new THREE.MeshToonMaterial({ vertexColors: true, gradientMap: gradientToon() })
  if (op.mau) m.color = new THREE.Color(op.mau)
  const rim = new THREE.Color(op.vienSang ?? '#ffe9c4')
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uRim = { value: new THREE.Vector3(rim.r, rim.g, rim.b) }
    sh.fragmentShader = 'uniform vec3 uRim;\n' + sh.fragmentShader.replace('#include <opaque_fragment>', `
      float rimF = pow(1.0 - clamp(dot(normalize(vViewPosition), normal), 0.0, 1.0), 2.4);
      outgoingLight += uRim * rimF * 0.42;
      #include <opaque_fragment>`)
  }
  return m
}

/** Bóng tối mờ dưới chân (thay bóng thật — rẻ, dễ thương): đĩa tròn gradient. */
let _blob: THREE.CanvasTexture | null = null
export function matBongTron() {
  if (!_blob) {
    const c = document.createElement('canvas'); c.width = c.height = 64
    const g = c.getContext('2d')!, gr = g.createRadialGradient(32, 32, 2, 32, 32, 31)
    gr.addColorStop(0, 'rgba(0,0,0,0.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64)
    _blob = new THREE.CanvasTexture(c)
  }
  return new THREE.MeshBasicMaterial({ map: _blob, transparent: true, depthWrite: false, toneMapped: false })
}
export function bongTron(r: number) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(r * 2, r * 2), matBongTron())
  m.rotation.x = -Math.PI / 2; m.position.y = 0.03; m.renderOrder = 1
  return m
}

/** Vật liệu "bóng đen" cho quái chưa gặp (sương mù). */
export function matBongDen(mau: THREE.ColorRepresentation) {
  return new THREE.MeshBasicMaterial({ color: new THREE.Color(mau), transparent: true, opacity: 0.62, fog: true })
}
