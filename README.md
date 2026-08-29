# AnyEasier 插件注册表

本仓库是 AnyEasier 的中央插件注册表。
上架流程：

1. Fork 本仓库
2. 运行 `node scripts/add-plugin.mjs add <插件ID>`，按提示填写信息
3. 提交并创建 PR
4. CI 自动校验格式；通过后人工审核合并即上架

要求：

- 插件仓库必须有 GitHub Release，资产名固定 `plugin.zip`
- `manifest.json`、`ui.xml`、`main.wasm` 齐备（见主程序仓库的插件规范）
- 注册表中的 `id` 必须与包内 `manifest.json` 的 `id` 一致（`^[a-z0-9][a-z0-9.-]{1,63}$`）
- 主程序按 Raw 地址 `{registry_base}/registry.json` 拉取本清单；详情按
  `https://raw.githubusercontent.com/{repo}/main/manifest.json` 与 `README.md` 拉取
