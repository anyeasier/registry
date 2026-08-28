// 交互式增删改 registry.json 条目。
// 用法：node scripts/add-plugin.mjs add|remove|update <插件ID>
import { readFileSync, writeFileSync } from 'node:fs'
import { createInterface } from 'node:readline/promises'

const REGISTRY = new URL('../registry.json', import.meta.url)
const rl = createInterface({ input: process.stdin, output: process.stdout })

const list = JSON.parse(readFileSync(REGISTRY, 'utf8'))

const action = process.argv[2] // add | remove | update
const id = process.argv[3]

function validate(e) {
  // 与 anye-core manifest id 规则一致：^[a-z0-9][a-z0-9.-]{1,63}$
  if (!/^[a-z0-9][a-z0-9.-]{1,63}$/.test(e.id)) throw new Error('id 非法（须匹配 ^[a-z0-9][a-z0-9.-]{1,63}$）')
  if (!/^[^/]+\/[^/]+$/.test(e.repo)) throw new Error('repo 必须形如 owner/name')
  for (const k of ['name', 'author', 'description']) {
    if (!e[k] || !e[k].trim()) throw new Error(`${k} 不能为空`)
  }
}

if (action === 'add') {
  const entry = {
    id,
    name: await rl.question('插件名称: '),
    author: await rl.question('作者: '),
    repo: await rl.question('仓库 (owner/name): '),
    description: await rl.question('简短描述: '),
  }
  validate(entry)
  if (list.some((e) => e.id === id)) throw new Error('id 已存在')
  list.push(entry)
} else if (action === 'remove') {
  const i = list.findIndex((e) => e.id === id)
  if (i < 0) throw new Error('id 不存在')
  list.splice(i, 1)
} else if (action === 'update') {
  const e = list.find((x) => x.id === id)
  if (!e) throw new Error('id 不存在')
  e.name = (await rl.question(`名称 (${e.name}): `)) || e.name
  e.author = (await rl.question(`作者 (${e.author}): `)) || e.author
  e.repo = (await rl.question(`仓库 (${e.repo}): `)) || e.repo
  e.description = (await rl.question(`描述 (${e.description}): `)) || e.description
  validate(e)
} else {
  console.error('用法: node scripts/add-plugin.mjs add|remove|update <插件ID>')
  process.exit(1)
}

writeFileSync(REGISTRY, JSON.stringify(list, null, 2) + '\n')
console.log('registry.json 已更新，请提交并创建 PR')
rl.close()
