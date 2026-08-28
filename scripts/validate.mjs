// CI 校验：JSON 可解析 + 每条目字段齐全 + id 唯一 + 格式合法（与 manifest id 规则一致）。
import { readFileSync } from 'node:fs'

const list = JSON.parse(readFileSync(new URL('../registry.json', import.meta.url), 'utf8'))
const seen = new Set()
for (const e of list) {
  for (const k of ['id', 'name', 'author', 'repo', 'description']) {
    if (!e[k] || typeof e[k] !== 'string') throw new Error(`条目缺字段 ${k}: ${JSON.stringify(e)}`)
  }
  if (!/^[a-z0-9][a-z0-9.-]{1,63}$/.test(e.id)) throw new Error(`id 非法: ${e.id}`)
  if (!/^[^/]+\/[^/]+$/.test(e.repo)) throw new Error(`repo 非法: ${e.repo}`)
  if (seen.has(e.id)) throw new Error(`id 重复: ${e.id}`)
  seen.add(e.id)
}
console.log(`OK: ${list.length} 个插件`)
