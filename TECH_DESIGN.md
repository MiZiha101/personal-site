# 个人展示网站 · 技术设计文档（TECH_DESIGN）

> 对应 `PRD.md` v2.0：浅色编辑感单页 + 站内可编辑内容。

---

## 一、技术选型

| 层 | 选型 | 理由 |
|---|---|---|
| 构建 | Vite 5 | 启动/热更新快，配置少 |
| 框架 | React 18 + TypeScript（strict） | 组件化 + 类型安全，AI 生成质量高 |
| 样式 | Tailwind CSS 3 + CSS 变量 | 原子类保证一致性，配色集中改一处 |
| 图标 | lucide-react | 轻量线性图标，风格统一 |
| 状态 | React Context + useReducer 风格 setter | 内容只有一份，不需要 Redux/Zustand |
| 编辑鉴权 | 自写 SHA-256（`src/auth/passcode.ts`）+ `sessionStorage` | 纯前端、零依赖、file:// 也能用；只挡随手点开的人 |
| 持久化 | `localStorage`（key：`personal-site-data-v1`） | 无后端、无隐私上传、刷新不丢 |
| Markdown | 自写极简渲染器（约 200 行） | 不引依赖、不用 innerHTML，避免 XSS |
| 字体 | 系统字体（衬线 + 无衬线各一套栈） | 零网络请求，首屏最快 |
| 部署 | Vercel（备选 Cloudflare Pages） | 免费、自动识别 Vite、推送即部署 |

**禁止**：UI 组件库、状态管理库、后端框架、需要密钥的第三方服务、任何统计脚本。

---

## 二、运行与构建

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build，产物在 dist/
npm run preview
```

---

## 三、目录结构

```
个人网站/
├─ PRD.md / TECH_DESIGN.md / AGENTS.md / README.md
├─ index.html
├─ public/favicon.svg
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx                 # Provider + 页面组装
│  ├─ index.css               # 设计变量 + Tailwind + 组件类
│  ├─ types.ts                # Profile / SkillGroup / Project / Post / SiteData
│  ├─ data/defaults.ts        # 默认内容（唯一的内容来源）
│  ├─ auth/passcode.ts        # SHA-256 实现 + 口令摘要常量
│  ├─ store/siteData.tsx      # Context：读取、修改、持久化、导入导出、解锁状态
│  ├─ components/
│  │  ├─ Navbar.tsx Hero.tsx About.tsx Skills.tsx Projects.tsx Notes.tsx Contact.tsx Footer.tsx
│  │  ├─ Modal.tsx            # 项目详情 / 笔记正文
│  │  ├─ BackToTop.tsx
│  │  ├─ EditFab.tsx          # 移动端浮动编辑按钮
│  │  ├─ auth/LoginGate.tsx   # 口令验证弹窗
│  │  ├─ edit/
│  │  │  ├─ EditDrawer.tsx    # 编辑面板骨架 + 5 个页签
│  │  │  ├─ ProfileForm.tsx   # 基本信息 / 简介 / 联系方式 / 时间线 / 校园经历
│  │  │  ├─ SkillsForm.tsx    # 分组与技能增删改
│  │  │  ├─ ProjectsForm.tsx  # 项目增删改
│  │  │  ├─ PostsForm.tsx     # 笔记增删改
│  │  │  └─ DataPanel.tsx     # 导入 / 导出 / 恢复默认
│  │  └─ ui/                  # SectionHeading、Field 等原子组件
│  ├─ hooks/useCopy.ts useReveal.ts
│  └─ utils/markdown.tsx
```

---

## 四、数据模型

```ts
type SiteData = {
  profile: {
    name; title; school; major; grade; location; status; tagline;
    bio: string[];                 // 每段一项
    email; github; githubLabel; avatarInitial;
    timeline: { id; year; title; desc }[];
    campus:   { id; title; desc }[];
  };
  skillGroups: { id; group; items: { id; name; level }[] }[];
  projects:    { id; title; summary; desc: string[]; tags: string[]; year; status; kind; demo?; repo? }[];
  posts:       { id; title; date; tags: string[]; summary; content }[];   // content 为 Markdown 字符串
};
```

- 所有条目都有稳定 `id`（`newId()`：`crypto.randomUUID` 前 8 位），React key 与增删改都依赖它。
- 文本字段统一「段落用两个换行分段」，编辑面板里是普通 `textarea`，保存时 `split(/\n{2,}/)`。
- 标签类字段在面板里用逗号分隔输入，保存时 `split(/[,，]/)` 并去空。

---

## 五、状态与持久化设计

```
localStorage ──读取──▶ loadData() ──▶ useState<SiteData>
                                        │
                         组件通过 useSiteData() 读
                                        │
                     编辑面板调用 updateProfile / setSkillGroups / setProjects / setPosts
                                        │
                       data 变化 → 300ms 防抖 → localStorage.setItem → saveState='saved'
```

要点：
1. **单一数据源**：整站内容只在 `store/siteData.tsx` 里，组件不写死文案。
2. **初次加载合并**：读取本地数据后与 `defaultData` 做浅合并（`profile` 逐字段合并），旧版本缺字段也不会崩。
3. **写盘防抖**：连续输入时 300ms 后写一次，避免每键一次 `setItem`。
4. **失败兜底**：`setItem` 抛错（隐私模式 / 配额满）时 `saveState='error'`，面板显示「保存失败」，页面仍可浏览。
5. **导入校验**：`JSON.parse` 后检查存在 `profile` 字段，非法文件给出中文提示，不覆盖现有数据。
6. **导出**：`Blob` + `URL.createObjectURL` 触发下载 `personal-site-data.json`。

**为什么不用后端**：作业场景无账号体系，纯本地存储就能满足「自己能改、立刻生效、隐私安全」，部署成本为零。

**局限与升级路径**：内容只在本人浏览器生效，访客看到的是 `defaults.ts` 里的默认值。升级方式见 DataPanel 提示：把导出的 JSON 覆盖 `defaults.ts`，再构建部署；或（v2.1）改成运行时 `fetch('./data.json')` 初始化。

### 5.1 编辑鉴权（口令）

```
点击「编辑资料」
   ├─ 本次会话已解锁（sessionStorage['personal-site-unlocked'] === '1'）→ 直接打开面板
   └─ 未解锁 → 打开 LoginGate 弹窗
                ├─ 输入口令 → sha256Hex(输入) === PASSCODE_HASH ? 解锁 + 开面板
                └─ 不匹配 → 提示剩余次数；连续 5 次 → 锁定 30 秒（组件内倒计时）
```

实现要点：

1. **只存摘要**：`src/auth/passcode.ts` 里只有 `PASSCODE_HASH`（SHA-256 小写十六进制），仓库里没有明文口令。
2. **自带 SHA-256**：手写实现（约 60 行）而不是 `crypto.subtle`，因为后者只在 https / localhost 可用；已用 `abc`、空串、中文、超长串与 `node:crypto` 结果逐个核对一致。
3. **解锁范围**：`sessionStorage`——同一标签页刷新保持解锁，关掉标签页即失效；面板内「退出编辑」会主动清除。
4. **入口统一**：所有编辑入口（导航按钮、移动端浮动按钮、名片卡底部）都调用 store 的 `requestEdit()`，禁止组件里直接 `setEditing(true)`，避免绕过验证。
5. **诚实说明**：这是纯前端校验，只能挡住随手点开的人，挡不住开发者工具。真权限必须放服务端；本作业要求零成本部署、不上传数据，所以刻意不做后端，并在 PRD 与技术文档里写清楚。

修改口令：改 `PASSCODE_HASH` 即可，命令行生成摘要：

```bash
node -e "console.log(require('crypto').createHash('sha256').update('你的新口令').digest('hex'))"
```

---

## 六、UI 实现要点

| 点 | 做法 |
|---|---|
| 配色 | `index.css` 里 8 个 CSS 变量，Tailwind `colors` 直接映射；换主题只改一处 |
| 衬线标题 | `font-serif`（Noto Serif SC → 宋体 → Georgia 回退），字重 400，`leading-[1.4]`，`tracking-tight` |
| 纸感背景 | `body` 上三层 `radial-gradient` + `background-attachment: fixed`，无图片请求 |
| 分区标识 | `SectionHeading`：衬线斜体序号 + 12px 短横线 + 0.28em 字距的英文标签 |
| 列表式项目/笔记 | 用 `border-bottom` 细线分行的编辑部式布局，hover 时整行浅白底 + 箭头位移 |
| 动效 | `.reveal` + IntersectionObserver；`useReveal(key)` 在内容数量变化时重扫，新增条目也能淡入 |
| 弹层 | `createPortal` 到 body，锁滚动，ESC / 遮罩关闭 |
| 编辑面板 | 右侧抽屉 640px，页签 + 滚动区 + 固定页脚；移动端占满宽度 |
| 响应式 | 断点 `sm 640 / md 768 / lg 1024`，内容容器 `max-w-content(1120px)`；移动端浮动编辑按钮，桌面端用导航里的入口 |
| 可访问性 | `aria-label`、`aria-invalid`、`aria-live` 用于复制与保存提示、`:focus-visible` 统一描边 |

---

## 七、关键技术难点与对策

| 难点 | 对策 |
|---|---|
| 编辑内容导致列表增删后动画元素不显示 | `useReveal` 依赖「内容数量签名」，变化时重新扫描；已在视口内的直接标记可见 |
| 中文长标题在窄屏断词难看 | 控制字号阶梯（1.7 → 2.1 → 2.6rem）并缩短默认文案；不用 `keep-all`（会导致溢出） |
| 段落型字段的编辑体验 | 面板里按「两行 = 一段」编辑，保存时按 `\n{2,}` 拆分；渲染端只认数组 |
| 表单删除误操作 | 项目/笔记删除走 `window.confirm`；恢复默认二次确认并在数据页提示先导出 |
| localStorage 不可用 | 读写都包 `try/catch`，失败不阻塞渲染，仅提示保存失败 |
| 首屏体积 | 全系统字体、无图片、无动画库，gzip 约 67KB |

---

## 八、部署

1. `npm run build` → 产物 `dist/`
2. 推 GitHub，Vercel 导入仓库：Framework `Vite`、Build `npm run build`、Output `dist`
3. 拿到 `xxx.vercel.app`（备选 Cloudflare Pages，`xxx.pages.dev`）
4. 之后 push 即自动部署；`vite.config.ts` 的 `base: './'` 保持相对路径，两个平台都支持
