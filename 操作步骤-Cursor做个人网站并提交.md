# 操作步骤 · 个人网站：改内容、部署、交作业

> 对应提交表单：**03 个人网站域名 / 04 需求文档、技术文档、AGENTS.md 截图 / 05 个人网页截图**

## 当前进度（2026-10）

网站已经是**浅色编辑感 v2.0**，`npm run build` 通过，桌面 / 移动端自测无控制台报错，编辑面板可改内容并持久保存。剩下的事只有三件：

1. **改成你的真实信息**——两种方式任选：
   - 打开网页点「编辑资料」，在面板里直接改（快，但只存在本机浏览器）；
   - 或者改 `src/data/defaults.ts` 里的默认值（改完 build 部署，所有访客都能看到）。
   必改的占位：学校「某某大学」、邮箱 `pjh@example.com`、GitHub `github.com/your-name`、两条校园经历（标注了「示例」）。
2. **部署上线拿域名**（阶段 3）—— 表单第 03 项；
3. **截图提交**（阶段 4、5）。

> 小提示：只想快速交作业 → 用页面里的「编辑资料」改完，再把「05 个人网页截图」截下来即可；
> 想让线上站点内容也变成你的 → 改 `defaults.ts` 后重新部署。

---

## 编辑功能怎么用（新增）

| 位置 | 说明 |
|---|---|
| 右上角「编辑资料」/ 手机右下角浮动按钮 | 打开右侧编辑面板（ESC、点遮罩、右上角 × 都能关） |
| 基本信息 | 姓名、头像首字、学校、专业、年级、所在地、状态、大标题、分段简介、邮箱、GitHub、时间线、校园经历 |
| 技能 | 分组和技能增删改，熟练度 0–100 |
| 项目 | 新增 / 编辑 / 删除，含类型、年份、状态、简介、详情、标签、演示与源码地址 |
| 笔记 | 新增 / 编辑 / 删除，正文写 Markdown |
| 数据 | 导出 JSON（备份）、导入 JSON（换电脑恢复）、恢复默认 |

改动**实时生效**，300ms 防抖后自动写入 `localStorage['personal-site-data-v1']`，面板顶部显示「已保存」。
数据只存在本机浏览器；访客看到的是 `src/data/defaults.ts` 里的默认内容。

---

## 阶段 0 · 准备（30 分钟）

- [ ] 装好 **Cursor**（cursor.com 下载），用 GitHub 或邮箱登录，选 Agent / Composer 模式
- [ ] 确认本机 `node -v`、`npm -v`、`git --version` 都有输出（没有就先装 Node LTS 和 Git）
- [ ] 换 npm 镜像：`npm config set registry https://registry.npmmirror.com`
- [ ] 注册 **GitHub** 账号；注册 **Vercel**（用 GitHub 登录最快）
- [ ] 把三份文档里的 **[待填写]** 改成真实信息（姓名、身份、技能、项目、邮箱）

---

## 阶段 1 · 在 Cursor 里建项目（10 分钟）

1. Cursor → `File → Open Folder` → 新建/打开一个空文件夹（例如 `D:\...\Desktop\实训\个人网站`，本目录已经是了）
2. 打开 Cursor 侧边栏的 **Chat / Agent**，第一条消息（把文档一起 @ 进去）：

```
@PRD.md @TECH_DESIGN.md @AGENTS.md
先通读这三份文档，然后只做 M1：用 Vite + React + TypeScript + Tailwind 初始化项目，
创建目录结构、基础路由区块占位、Navbar、Footer，确保 npm run dev 能启动。
不要实现具体板块内容，不要引入 UI 库。
```

3. AI 改完后，在 Cursor 的终端里跑：

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:5173`，能看到骨架就进入下一步。

---

## 阶段 2 · 分步实现功能（2~4 小时，一次一个模块）

> 原则：**一次只提一个模块**，做完立刻在浏览器里测，有问题马上让 AI 改。别一次说"把整个网站做完"。

| 顺序 | 发给 Cursor 的消息（示例） | 验收 |
|---|---|---|
| 1 | `按 PRD 实现首屏与关于：Hero（眉标/大标题/简介/状态/CTA/名片卡）、时间线、校园经历，内容从 store 的 Context 读，配色圆角按 AGENTS.md` | 内容真实、配色符合 |
| 2 | `实现技能与项目：4 组技能带进度条；项目用编号细线列表 + 详情弹层` | 进度条正常、弹层能开 |
| 3 | `实现联系方式板块：邮箱一键复制并提示、GitHub 链接、留言表单（zod 或原生校验）+ 提交成功反馈` | 复制有提示、空表单报错 |
| 4 | `实现站内编辑面板：右侧抽屉 + 5 个页签（基本信息/技能/项目/笔记/数据），改动写进 Context 并持久化到 localStorage` | 改完刷新仍在 |
| 5 | `收尾：汉堡菜单、375px 无横向滚动、滚动淡入、回到顶部、SEO title/description/favicon` | 手机模式正常 |
| 6 | `跑一遍自测：检查控制台报错、未使用依赖，确认 npm run build 零错误` | build 通过 |

**每一步完成后提交一次 Git**（Cursor 终端）：

```bash
git init                 # 只在第一次
git add -A
git commit -m "feat: hero/about/skills"
```

---

## 阶段 3 · 部署上线，拿到域名（30 分钟）

1. 在 GitHub 新建空仓库（不要勾 README），然后：

```bash
git remote add origin https://github.com/你的用户名/个人网站.git
git branch -M main
git push -u origin main
```

2. 打开 vercel.com → `Add New… → Project` → 授权 GitHub → 选刚推的仓库
3. 配置确认：Framework `Vite`，Build Command `npm run build`，Output `dist` → **Deploy**
4. 部署完成后 Vercel 给一个 `https://xxx.vercel.app` 地址（备选 Cloudflare Pages 同理，框架预设选 Vite）
5. **这个域名就是表单第 03 项「个人网站域名」**（平台免费子域名即满足要求，不必另外买域名）

---

## 阶段 4 · 截图（10 分钟）

| 表单项 | 截什么 | 怎么截 |
|---|---|---|
| 04 需求/技术/AGENTS 文档 | 三份 .md 的截图，要能看清文件名和正文 | Cursor 里分别打开 `PRD.md`、`TECH_DESIGN.md`、`AGENTS.md`，`Win+Shift+S` 框选；可把三张拼成一张长图，或分别上传 |
| 05 个人网页截图 | 首页整页效果 | Chrome 打开线上域名 → `F12` → `Ctrl+Shift+M` 设备模式（选 iPhone 或 Responsive 1440）→ `Ctrl+Shift+P` 输入 `Capture full size screenshot` 回车，得到整页长图 |

> 技巧：05 的截图**保留地址栏**，能证明是部署好的域名，而不是本地 localhost。

---

## 阶段 5 · 自查后提交表单

- [ ] 换无痕窗口（或手机）打开域名，能正常访问、内容完整
- [ ] 控制台无红色报错
- [ ] 三份文档里没有遗留 `[待填写]`
- [ ] 04、05 截图清晰、非空白、单张 < 300MB
- [ ] 03 域名可点击访问（提交前再点一次）
- [ ] 点「提交」

---

## 常见卡点

| 现象 | 处理 |
|---|---|
| `npm install` 卡住/失败 | 换镜像；删 `node_modules` + `package-lock.json` 重装 |
| AI 一次改一大片、越改越乱 | 撤回：`git checkout .` 或 Cursor 的 Restore checkpoint，然后**一次只提一个模块** |
| 页面样式全丢 | Tailwind 没装好：确认 `index.css` 里有 `@import "tailwindcss";`（v4）或 `@tailwind base;`（v3），且 `main.tsx` 引入了它 |
| 部署后白屏 | 检查 `dist` 是否生成、Vite 的 `base` 是否被改过；看 Vercel 构建日志 |
| 国内打开 Vercel 慢 | 同一套代码换 Cloudflare Pages 部署一份，用它的域名 |
| 截图太长看不清内容 | 分区块截 2~3 张（首屏 + 技能/项目 + 博客/联系） |
