# pet-clothes-fit-web

一个移动端优先的宠物衣服尺码与穿搭助手。用户填写宠物档案、身体尺寸与穿搭偏好后，应用会在浏览器本地生成参考尺码、款式建议、面料建议、安全提醒和可复制的定制需求单。

项目不接后端、支付或真实 AI API，所有数据只保存在当前浏览器的 `localStorage` 中，适合作为可分享测试的网页版 MVP。

## 技术栈

- Vue 3
- Vite
- TypeScript
- SCSS
- Vue Router
- localStorage

## 页面结构

| 路径 | 页面 | 功能 |
| --- | --- | --- |
| `/` | 首页 | 产品介绍和测试入口 |
| `/profile` | 宠物档案 | 记录宠物基础信息 |
| `/measure` | 尺寸测量 | 记录颈围、胸围、背长等尺寸 |
| `/designer` | 穿搭偏好 | 选择场景、风格、颜色、款式和功能 |
| `/result` | 推荐结果 | 展示推荐方案并支持保存、复制 |
| `/result?id=...` | 已保存详情 | 查看指定的历史方案 |
| `/plans` | 我的方案 | 查看和删除已保存方案 |

## 安装依赖

要求 Node.js 18 或更高版本。

```bash
npm install
```

## 本地运行

```bash
npm run dev
```

根据终端提示打开本地地址，默认通常为 `http://localhost:5173`。

## 打包与预览

执行类型检查和生产构建：

```bash
npm run build
```

构建产物位于 `dist` 目录。可在本地预览：

```bash
npm run preview
```

## 部署到 Vercel

1. 将项目推送到 GitHub、GitLab 或 Bitbucket。
2. 登录 Vercel，选择 **Add New Project** 并导入仓库。
3. Framework Preset 选择 **Vite**。
4. Build Command 使用 `npm run build`。
5. Output Directory 使用 `dist`。
6. 点击 Deploy。

仓库中的 `vercel.json` 已配置 Vue Router history 模式所需的 SPA 回退，直接访问 `/profile`、`/plans` 等子路径不会出现 404。

## 部署到 Netlify

1. 将项目推送到 Git 仓库。
2. 登录 Netlify，选择 **Add new site > Import an existing project**。
3. 选择仓库并确认以下配置：
   - Build command：`npm run build`
   - Publish directory：`dist`
4. 点击 Deploy。

仓库中的 `netlify.toml` 已包含构建配置及 SPA 路由重定向。

也可以执行 `npm run build` 后，将 `dist` 目录拖入 Netlify Drop 进行快速测试部署。

## 本地数据说明

- 表单流程会自动暂存在 `localStorage`，刷新后可以继续填写。
- 生成结果会作为当前方案暂存。
- 点击“保存方案”后，方案会加入“我的方案”列表。
- “重新测试”只清除当前草稿和当前结果，不会删除已保存方案。
- 清除浏览器网站数据后，本地方案也会被删除。

## 尺码建议说明

推荐逻辑按胸围优先、背长第二、颈围第三的顺序判断。长毛和偏胖体型会增加宽松余量建议，特定场景和款式会补充对应的面料及活动空间提醒。

结果仅作为选购和定制沟通参考。不同品牌的版型和面料弹性存在差异，下单前应结合商家尺码表并观察宠物实际穿着状态。

“术后防舔”只作为服装场景，不提供医疗诊断或护理建议。

## 后续可扩展方向

- 增加不同品牌和品类的真实尺码库
- 接入账号系统，实现多设备同步
- 使用图片辅助识别宠物品种和体型
- 接入真实 AI API，生成更丰富的搭配说明
- 生成可分享的公开方案链接或图片卡片
- 对接宠物服装定制商家和订单系统
- 增加单元测试、端到端测试及埋点分析
