# AGENTS.md · 个人展示网站

> 给 AI（Cursor / Codex / Copilot 等）的项目说明书。**开始任何改动前先读它**，再读 `PRD.md` 与 `TECH_DESIGN.md`。

## 1. 项目是什么

一名大三学生（电子信息工程 · 嵌入式方向）的个人主页：浅色「编辑感」单页站（暖白纸 + 松绿 + 衬线标题）。

内容全部可在页面上编辑，但**编辑入口有口令验证**：代码里只保存 SHA-256 摘要（`src/auth/passcode.ts`），明文口令不写进任何文件，由本人自己保管。改动存 `localStorage`，可导入导出 JSON。

语气要求：务实、不夸口。只写真正做过的（焊板/固件/调试），明确写出还不熟的（RTOS、嵌入式 Linux、复杂 PCB），禁止「精通」「资深」这类词。

- 需求以 `PRD.md` v2.0 为准，技术方案以 `TECH_DESIGN.md` 为准。
- 当前视觉是**浅色**方案；v1.0 的深色星空版本已废弃，不要回退。

## 2. 怎么跑起来

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # 必须零错误（tsc -b && vite build）
npm run preview
```

包管理器只用 `npm`，不要新增 `pnpm-lock.yaml`。国内装包慢：`npm config set registry https://registry.npmmirror.com`。

## 3. 技术栈（不可擅自更换）

Vite 5 + React 18 + TypeScript（strict）+ Tailwind CSS 3 + lucide-react。

**禁止**：UI 组件库（shadcn 整包 / AntD / MUI）、状态管理库（Redux/Zustand/Jotai）、后端框架、jQuery、任何需要密钥的服务、统计脚本、`dangerouslySetInnerHTML`。

## 4. 架构约定（重要）

- **单一数据源**：所有内容在 `src/store/siteData.tsx` 的 Context 里，默认值在 `src/data/defaults.ts`。**组件里禁止硬编码文案/姓名/邮箱**，一律 `useSiteData()` 读取。
- 修改数据只能用 Context 暴露的 setter：`updateProfile / setSkillGroups / setProjects / setPosts`；不要在组件里直接改数组。
- 持久化 key 固定为 `localStorage['personal-site-data-v1']`；写盘已做 300ms 防抖，不要额外加存储逻辑。
- 条目必须有稳定 `id`（用 `newId()`），React key 一律用 `id`，不要用索引。
- 字段格式约定：`bio` / `desc` 是 `string[]`（段落数组），面板输入按「两个换行 = 一段」；标签是 `string[]`，输入按中英文逗号拆分。
- 新增可编辑字段时，四处都要改：`types.ts` → `defaults.ts` → 对应 `edit/*Form.tsx` → 展示组件。

### 4.1 鉴权约定

- 任何「编辑」入口（导航按钮、移动端浮动按钮、名片卡底部）都必须调用 Context 的 `requestEdit()`；**禁止**在组件里直接 `setEditing(true)` 绕过口令。
- 口令只以 SHA-256 摘要形式存在 `src/auth/passcode.ts`，**禁止**把明文口令写进代码或文档。
- 解锁状态用 `sessionStorage['personal-site-unlocked']`，不要改成 localStorage（那会变成长期免密）。
- `sha256Hex` 是自写实现（不依赖 `crypto.subtle`，file:// 也能用）；改动它必须用 `node:crypto` 对 `abc`、空串、中文、超长串各验一次。

## 5. 设计与交互硬性要求

| 项目 | 规范 |
|---|---|
| 背景 | `#F7F5F0`（暖白）+ 三层极淡径向渐变，`background-attachment: fixed` |
| 卡片 | `#FFFFFF`、1px `#E6E0D4`、圆角 20px、阴影仅 `0 1px 2px rgba(27,26,23,.04)` |
| 文字 | 正文 `#1B1A17`，次要 `#6F6A61`，强调 `#2F5A4E`，浅强调底 `#E9F0EA` |
| 字体 | 标题衬线（`font-serif`）、正文无衬线（`font-sans`）、数字用 `font-mono` |
| 圆角/按钮 | 按钮与标签用胶囊形；主按钮松绿填充，次按钮白底细边 |
| 阴影 | 克制：只有卡片 `shadow-soft`、弹层 `shadow-lift`、抽屉 `shadow-panel` |
| 断点 | `sm 640 / md 768 / lg 1024`；内容容器 `max-w-content`（1120px）+ `px-6` |
| 移动端 | 375px 不得横向滚动；导航收成汉堡；编辑入口用浮动按钮（`md:hidden`） |
| 动效 | `.reveal` 淡入 0.65s；必须尊重 `prefers-reduced-motion` |
| 无障碍 | 交互元素用 `button`/`a` 并带 `aria-label`；`:focus-visible` 描边；图片有 `alt` |

颜色只能取自 `index.css` 的 CSS 变量或 Tailwind 已映射的 token（`bg-surface`、`text-muted`、`border-line`、`bg-accent`…），**不要写死新的十六进制色**（如需新增，先加变量）。

## 6. 工作方式

1. **一次只做一个模块**（导航 → 首屏 → 关于 → 技能 → 项目 → 笔记 → 联系 → 编辑面板），每步做完 `npm run build` 通过再继续。
2. 改完自查：控制台无报错、`npm run build` 通过、375px 无横向滚动、编辑面板仍能保存。
3. 每个可运行的功能结束给出一条提交建议：`git add -A && git commit -m "feat: xxx"`。
4. 需要真实个人信息时**先问**，不要编造；默认可以用「某某大学」「示例」这类占位，并保持可编辑。
5. 与 PRD 冲突时以 PRD 为准，并提醒同步更新文档。
6. 解释关键逻辑（Context 持久化、`useReveal`、Markdown 渲染），不要交付无法维护的代码。

## 7. 测试要求

- 手动清单：导航高亮、汉堡菜单、项目弹层、笔记正文、邮箱复制、表单三项校验、回到顶部、编辑面板 5 个页签、改内容刷新后仍在、恢复默认、375px 布局。
- `npm run build` 必须成功；`npm run preview` 抽查一遍。
- 改了 store 或表单：必须验证「改 → 刷新 → 仍生效」和「导入 JSON → 内容替换」。
- 改了配色/布局：必须同时看 1440 与 390 两个宽度。

## 8. 部署（不要随意改）

- 平台 Vercel（备选 Cloudflare Pages），Framework `Vite`，Build `npm run build`，Output `dist`。
- `vite.config.ts` 的 `base: './'` 用于相对路径产物，两个平台都支持，不要改回 `/`。
- 不要提交 `dist/`、`node_modules/`、`.env`（已在 `.gitignore`）。
