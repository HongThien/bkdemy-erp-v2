// Build APK Android cho app HỌC SINH (hs.bkacademy.edu.vn) — Thùy 03/09/2026.
// Chạy: npm run apk            → android/app/build/outputs/apk/release/app-release.apk (đã ký)
//       npm run apk -- --debug → app-debug.apk (ký debug, chỉ để test nhanh)
// Yêu cầu máy: JDK 21 + Android SDK 36 portable ở C:\Users\WBPC\android-tools (tải 03/09, không
// cần Android Studio). Máy khác: đặt JAVA_HOME / ANDROID_HOME trước khi chạy, script sẽ dùng.
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, writeFileSync, statSync, copyFileSync, mkdirSync } from 'node:fs'
import { join, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..', '..')
const TOOLS = 'C:/Users/WBPC/android-tools'
const debug = process.argv.includes('--debug')

function findJdk() {
  if (process.env.JAVA_HOME && existsSync(join(process.env.JAVA_HOME, 'bin'))) return process.env.JAVA_HOME
  if (!existsSync(TOOLS)) return null
  const d = readdirSync(TOOLS).find((n) => n.startsWith('jdk-21'))
  return d ? join(TOOLS, d) : null
}
const JAVA_HOME = findJdk()
const ANDROID_HOME = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || join(TOOLS, 'sdk')
if (!JAVA_HOME) { console.error('✗ Không thấy JDK 21 (JAVA_HOME hoặc ' + TOOLS + '/jdk-21*)'); process.exit(1) }
if (!existsSync(join(ANDROID_HOME, 'platforms'))) { console.error('✗ Không thấy Android SDK tại ' + ANDROID_HOME); process.exit(1) }

const android = join(ROOT, 'android')
if (!existsSync(join(android, 'keystore.properties')) && !debug)
  console.warn('⚠ Thiếu android/keystore.properties → APK release sẽ KHÔNG được ký (không cài được). Xem docs/APK-android.md')
// ⚠ .properties coi `\` là ký tự escape → `C:\Users\…` thành `C:Users…` (build chết với lỗi mù
// "filename, directory name, or volume label syntax is incorrect"). Dùng `/` — Windows chấp nhận.
writeFileSync(join(android, 'local.properties'), 'sdk.dir=' + ANDROID_HOME.replaceAll('\\', '/') + '\n')

const env = { ...process.env, JAVA_HOME, ANDROID_HOME, PATH: join(JAVA_HOME, 'bin') + ';' + process.env.PATH }
const run = (cmd, args, cwd) => {
  const r = spawnSync(cmd, args, { cwd, env, stdio: 'inherit', shell: true })
  if (r.status !== 0) process.exit(r.status ?? 1)
}
// 1) web bundle + copy vào android/ (bắt buộc dù runtime dùng server.url — Capacitor cần webDir)
run('npm', ['run', 'build:hs'], ROOT)
run('npx', ['cap', 'sync', 'android'], ROOT)
// 2) gradle — ưu tiên bản standalone ở android-tools (wrapper tải gradle qua Java HTTP ~85KB/s trên
// máy này, 45 phút; curl từ mirror thì 40MB/s — nên tải tay 1 lần, xem docs/APK-android.md)
const gradleDirs = existsSync(TOOLS) ? readdirSync(TOOLS).filter((n) => n.startsWith('gradle-')) : []
const gradle = gradleDirs.length ? join(TOOLS, gradleDirs.sort().at(-1), 'bin', 'gradle.bat') : 'gradlew.bat'
run(`"${gradle}"`, [debug ? 'assembleDebug' : 'assembleRelease', '--no-daemon', '-q'], android)

const out = join(android, 'app', 'build', 'outputs', 'apk', debug ? 'debug' : 'release', debug ? 'app-debug.apk' : 'app-release.apk')
if (!existsSync(out)) { console.error('✗ Không thấy ' + out); process.exit(1) }
mkdirSync(join(ROOT, 'apk'), { recursive: true })
const dst = join(ROOT, 'apk', debug ? 'BKAcademy-HS-debug.apk' : 'BKAcademy-HS.apk')
copyFileSync(out, dst)
console.log(`✓ APK: ${dst} (${(statSync(dst).size / 1024 / 1024).toFixed(1)} MB)`)
