// node kho-rules/dai/lo/k10-bdm/hinh/ve.mjs <thư-mục-ra> [key…]   → <ra>/<key>.png
import { FIGS } from './figs.mjs'
import { svgTrucSo, svgMienNghiem, veNhieu } from '../../../../../scripts/kho/k10-hinh.mjs'
const [ra, ...keys] = process.argv.slice(2)
const ds = Object.entries(FIGS).filter(([k]) => !keys.length || keys.includes(k)).map(([k, v]) => ({ ...(v.loai === 'truc' ? svgTrucSo(v.mo_ta) : svgMienNghiem(v.mo_ta)), file: `${ra}/${k}` }))
await veNhieu(ds)
console.log('vẽ', ds.length, 'hình →', ra)
