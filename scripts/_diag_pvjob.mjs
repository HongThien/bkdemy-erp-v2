// Debug: vì sao PrintJobPage nhận token rỗng? In độ dài token từng chặng (KHÔNG in giá trị).
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'
import puppeteer from 'puppeteer-core'

const root = 'C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2'
const raw = readFileSync(root + '/.env.local', 'utf8')
const env = (k) => raw.match(new RegExp(`^\\s*${k}\\s*=\\s*(.+?)\\s*$`, 'm'))?.[1]?.replace(/^["']|["']$/g, '')
const auth = createClient(env('VITE_SUPABASE_URL'), env('VITE_SUPABASE_KEY'))
const [, email, pass] = (env('VITE_DEV_ACCOUNTS') ?? '').split(',')[0].split('|').map((s) => s.trim())

const { data: signIn, error } = await auth.auth.signInWithPassword({ email, password: pass })
if (error) { console.log('signin ERR:', error.message); process.exit(1) }
const at = signIn.session.access_token, rt = signIn.session.refresh_token
console.log('node-side: at.len=', at.length, 'rt.len=', rt.length)

const browser = await puppeteer.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage()
page.on('console', (m) => console.log('[page console]', m.type(), m.text().slice(0, 200)))
const hash = `#pvjob=5ba58d5a-fc9e-4c38-96f3-c76eafc5b66a&loai=btvn&at=${encodeURIComponent(at)}&rt=${encodeURIComponent(rt)}`
await page.goto(`http://localhost:4599/${hash}`, { waitUntil: 'domcontentloaded', timeout: 30000 })
const probe = await page.evaluate(() => {
  const p = new URLSearchParams(location.hash.slice(1))
  return { hashLen: location.hash.length, atLen: (p.get('at') ?? '').length, rtLen: (p.get('rt') ?? '').length, pvjob: p.get('pvjob'), loai: p.get('loai'), state: window.__pvState }
})
console.log('page-side:', JSON.stringify(probe))
await new Promise((r) => setTimeout(r, 8000))
console.log('after 8s __pvState =', await page.evaluate(() => window.__pvState), ' bodyText=', (await page.evaluate(() => document.body.innerText)).slice(0, 120))
await browser.close()
