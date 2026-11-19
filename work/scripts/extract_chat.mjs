import { readFileSync, writeFileSync } from 'node:fs'
import { zstdDecompressSync } from 'node:zlib'

const 魔数 = Buffer.from([0x28, 0xB5, 0x2F, 0xFD])
function 解会话(路径) {
  const 缓冲 = readFileSync(路径)
  const 头 = []
  let p = 0
  while (true) {
    const i = 缓冲.indexOf(魔数, p)
    if (i < 0) break
    头.push(i); p = i + 4
  }
  let 文 = ''
  for (let k = 0; k < 头.length; k++) {
    const 止 = k + 1 < 头.length ? 头[k + 1] : 缓冲.length
    try { 文 += zstdDecompressSync(缓冲.subarray(头[k], 止)).toString('utf8') } catch {}
  }
  return 文
}

const [路径, 起, 止, 出] = process.argv.slice(2)
const 起0 = new Date(起 + 'T00:00:00+08:00').getTime()
const 止0 = new Date(止 + 'T23:59:59+08:00').getTime()

const 条 = []
for (const l of 解会话(路径).split('\n')) {
  if (!l.trim()) continue
  let o; try { o = JSON.parse(l) } catch { continue }
  if (o.type !== 'user/message' && o.type !== 'assistant/message') continue
  const t = o.time
  if (t < 起0 || t > 止0) continue
  const msg = o.type === 'user/message' ? o.data : o.data.message
  const 文本 = (msg.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n').trim()
  if (!文本) continue
  if (文本.includes('心里冒出来的念头')) continue // 搭话插件注入的念头
  if (/^Current runtime context\./m.test(文本) || 文本.includes('【你记得的事】')) continue // 宿主注入的运行时上下文/记忆块
  if (文本.includes('Time sampled while preparing turn')) continue
  if (文本.startsWith('<system-reminder>') || 文本.includes('A skill is a reusable set of task-specific instructions')) continue
  if (msg.source && msg.source.kind === 'user' && o.type === 'assistant/message') continue
  const d = new Date(t)
  const 日期 = d.toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).replaceAll('/', '-')
  条.push({ 日期, 谁: o.type === 'user/message' ? 'user' : 'assistant', 时间: d.toLocaleTimeString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false }), 文本 })
}

const 段 = new Map()
for (const c of 条) {
  if (!段.has(c.日期)) 段.set(c.日期, [])
  段.get(c.日期).push(c)
}
let 出文 = `# 小鯨记忆 · 需求讨论与评审对话记录（${起} ~ ${止}）\n\n> 提取自工作室会话落盘记录，已滤除工具调用与插件注入；每轮对话保留小主与小鯨的原话。\n\n`
for (const [日期, 列] of 段) {
  出文 += `## ${日期}\n\n`
  for (const c of 列) {
    出文 += `### ${c.谁 === 'user' ? '我的想法' : '小鯨的想法'}\n\n${c.文本}\n\n`
  }
}
writeFileSync(出, 出文)
console.log('对话轮数', 条.length, '| 日期分布:', [...段.entries()].map(([d, l]) => `${d}:${l.length}`).join(' '), '| 输出', 出)
