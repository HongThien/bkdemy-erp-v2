import fs from 'node:fs'
import { GAN, DEXUAT, KHONGKHOP } from '../kho-rules/dai/lo/k10-htl/quyet-dinh.mjs'
const cau = new Map(JSON.parse(fs.readFileSync('kho-rules/dai/lo/k10-htl/cau.json','utf8')).map(q=>[q.ma_cau,q]))
const ids = [...GAN.map(x=>x[0]), ...DEXUAT.map(x=>x[0]), ...Object.keys(KHONGKHOP)]
console.log('GAN', GAN.length, 'DEXUAT', DEXUAT.length, 'KK', Object.keys(KHONGKHOP).length)
console.log('không có trong pool:', ids.filter(i=>!cau.has(i)))
console.log('trùng:', ids.filter((i,k)=>ids.indexOf(i)!==k))
console.log('không phải de_xuat:', ids.filter(i=>cau.has(i)&&cau.get(i).nguon_hang!=='de_xuat'))
console.log('là Đúng/Sai:', ids.filter(i=>cau.has(i)&&cau.get(i).loai_cau==='dung_sai'))
const dg = {}; GAN.forEach(x=>dg[x[1]]=(dg[x[1]]||0)+1); console.log(dg)
