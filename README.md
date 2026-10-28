# 个人展示网站（浅色版 · 站内可编辑）

大三学生的个人主页：浅色「编辑感」单页站 + 站内编辑面板。

- 技术栈：React 18 + TypeScript + Vite 5 + Tailwind CSS 3（仅额外依赖 `lucide-react`）
- **内容不写在组件里**：全部在 `src/store/siteData.tsx` 的 Context，默认值在 `src/data/defaults.ts`
- **能自己改**：点右上角「编辑资料」（手机上是右下角按钮）打开面板，改完立刻生效，自动存本机，可导出 / 导入 JSON

## 本地运行

```bash
npm install          # 国内慢先 npm config set registry https://registry.npmmirror.com
npm run dev          # http://localhost:5173
npm run build        # 生产构建 → dist/
npm run preview
```

## 能改哪些内容（需要口令）

点右上角「编辑资料」（手机上是右下角浮动按钮）→ **先输入编辑口令**，验证通过才会打开面板。

口令实现：`src/auth/passcode.ts` 里只保存口令的 SHA-256 摘要，不保存明文；连续输错 5 次锁定 30 秒；解锁状态存 `sessionStorage`，关掉标签页即失效；面板右上角「退出编辑」会立刻上锁。

换口令（三步）：

```bash
# 1. 生成新口令的摘要（把 新口令 换成你的）
node -e "console.log(require('crypto').createHash('sha256').update('新口令').digest('hex'))"
```

2. 把输出的十六进制串替换 `src/auth/passcode.ts` 里的 `PASSCODE_HASH`
3. `npm run build` 后重新部署

> 说明：这是纯前端校验，只用来挡住随手点开的人，不构成真正的安全边界。真权限要放服务端，本作业为了零成本部署刻意不做后端。

| 页签 | 能改什么 |
|---|---|
| 基本信息 | 姓名、头像首字、身份、学校、专业、年级、所在地、当前状态、一句话大标题、分段简介、邮箱、GitHub、时间线、校园经历 |
| 技能 | 分组增删改；组内技能增删改；熟练度 0–100 |
| 项目 | 新增/编辑/删除；标题、类型、年份、状态、一句话简介、详细说明、技术标签、演示与源码地址 |
| 笔记 | 新增/编辑/删除；标题、日期、标签、摘要、Markdown 正文 |
| 数据 | 导出 JSON、导入 JSON、恢复默认 |

> 改动只保存在**当前浏览器**（`localStorage`），访客看到的是代码里的默认内容。
> 想让自己改的内容对所有人生效：数据页「导出 JSON」→ 内容覆盖 `src/data/defaults.ts` 里的 `defaultData` → 重新 build 部署。

## 目录结构

```
├─ PRD.md / TECH_DESIGN.md / AGENTS.md     # 需求 / 技术设计 / 给 AI 的项目说明
├─ index.html
├─ public/favicon.svg
├─ 截图/                                    # 自测截图（部署后可换成线上截图）
└─ src/
   ├─ App.tsx                  # Provider + 页面组装
   ├─ index.css                # 设计变量（配色/字体/圆角）+ Tailwind + 组件类
   ├─ types.ts                 # 数据类型
   ├─ data/defaults.ts         # 默认内容（唯一内容来源）
   ├─ store/siteData.tsx       # Context：读、改、存、导入导出
   ├─ components/
   │  ├─ Navbar / Hero / About / Skills / Projects / Notes / Contact / Footer
   │  ├─ Modal.tsx             # 项目详情 / 笔记正文弹层
   │  ├─ EditFab.tsx           # 移动端浮动编辑按钮
   │  ├─ edit/                 # 编辑面板与四个表单 + 数据页
   │  └─ ui/                   # SectionHeading、Field
   ├─ hooks/                   # useCopy、useReveal
   └─ utils/markdown.tsx       # 自写极简 Markdown 渲染（无依赖、不用 innerHTML）
```

## 视觉规范（改主题只改 `src/index.css` 的变量）

```css
--bg: #F7F5F0;        /* 暖白纸感背景 */
--surface: #FFFFFF;   /* 卡片 */
--ink: #1B1A17;       /* 正文 */
--muted: #6F6A61;     /* 次要文字 */
--accent: #2F5A4E;    /* 松绿强调 */
--line: #E6E0D4;      /* 1px 细线 */
--sand: #EFE9DC;      /* 进度条底 */
```

标题用衬线（Noto Serif SC → 宋体 → Georgia），正文用系统无衬线；全站无外部字体与图片请求。

## 部署（拿域名）

推到 GitHub 后，在 Vercel 或 Cloudflare Pages 导入仓库：

| 配置项 | 值 |
| --- | --- |
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

部署完成会得到 `xxx.vercel.app` / `xxx.pages.dev`，填进作业表单的「个人网站域名」。之后 `git push` 自动重新部署。

## 自测清单

- [ ] `npm run build` 零错误；控制台无报错
- [ ] 1440 / 768 / 390 三个宽度都正常，375px 无横向滚动
- [ ] 导航高亮跟随滚动，汉堡菜单可展开收起
- [ ] 项目弹层、笔记正文能打开，ESC 关闭
- [ ] 邮箱复制有提示；留言表单空提交会逐项报错
- [ ] 编辑面板：改姓名 → 页面立即变 → 刷新仍在
- [ ] 新增项目/笔记 → 列表立刻 +1，刷新仍在
- [ ] 导出 JSON 能下载；导入后内容一致；恢复默认能清空本地修改
