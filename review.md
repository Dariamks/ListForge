# ListForge 项目审阅报告

> 角色：软件架构师 + 资深产品经理
> 日期：2026-05-07
> 版本：0.1.0 / 生产环境 https://listforge.dev

---

## 项目概况

Next.js 16 + DeepSeek AI 的电商 listing 优化工具，3 平台 × 3 变体流式输出，184 个 pSEO 页面，部署在 Vercel。整体工程质量很高，MVP 执行力强。

---

## 架构师视角

### 🔴 高优先级风险

**1. 单一 LLM 供应商依赖**
`lib/deepseek.ts` 只接 DeepSeek，没有 fallback。DeepSeek 任何宕机都直接让核心功能归零。建议抽象一个 `providers` 层，至少预留接 OpenAI/Gemini 的切换开关。

**2. 无错误监控（生产盲区）**
进度单里标注了 Sentry 是 optional，但对于一个无注册用户的工具来说，错误完全不可见。Vercel 自带的 Function Logs 不能告警。至少应该接 Sentry 的免费 tier，或者在 `/api/optimize` 的 catch 块里记录到 Vercel KV。

**3. 提示注入风险未处理**
`features` 字段的用户输入直接拼入 system prompt，未做任何过滤。用户可以注入 `"Ignore all previous instructions..."` 类指令。建议在 `buildUserPrompt` 里对 `features` 做基础清洗，或在 system prompt 里加显式边界声明。

**4. Cloudflare Turnstile 缺失**
进度单里标注 pending，但这是防止 API key 被薅羊毛的关键防线。IP rate limit 被 VPN 绕过后整个配额就暴露了。

### 🟡 中优先级技术债

**5. pSEO 内容硬编码在代码里**
`lib/category-content.ts`、`lib/sample-listings.json`、`lib/categories.ts` 里塞了大量内容。每次更新内容都需要重新部署。当内容量继续增长后维护成本会很高。中期应该考虑把这些内容移到 Vercel KV、Sanity 或者哪怕一个单独的 JSON 目录。

**6. `variants: 1` 路径有 bug**
`InputSchema` 允许 `variants: 1`，但 server 端的 `VARIANT_PROFILES[0]` 永远是 `conservative`——用户传 1 只会得到保守版本，没有任何提示说明这是设计行为还是 bug。要么把这个参数去掉，要么显式处理。

**7. `nodejs` runtime 影响冷启动**
`route.ts` 设置了 `export const runtime = "nodejs"`，这意味着无法用 Edge Functions，Vercel 冷启动会更慢。考虑换成 `edge` runtime 或者 Vercel Fluid Compute，能显著降低首次响应延迟。

**8. 没有生成结果缓存**
同一个产品的 listing 每次都重新生成，DeepSeek 费用随调用次数线性增长。对于 pSEO 页面的 sample listings 这类确定性内容，可以在 Vercel KV 里缓存，用 product name + platform 做 key，TTL 24h。

---

## 产品经理视角

### 🔴 直接影响转化率的问题

**9. 表单状态不持久化**
用户填完一半的产品信息，切换 tab 或刷新页面，全部丢失。history 存了 localStorage，但输入表单没有。这是一个高频用户流失点。把 `productName`、`features`、`brand` 等字段 debounce 存入 localStorage，用 platform 做隔离 key。

**10. 没有"一键全复制"**
用户需要分别点击 Title / Bullets / Description / Backend Keywords 四个 Copy 按钮。实际卖家需要把整个 listing 粘贴进后台，分段复制摩擦极大。增加一个 **"Copy full listing"** 按钮，输出格式化文本：
```
TITLE: ...
BULLETS:
1. ...
5. ...
DESCRIPTION: ...
BACKEND KEYWORDS: ...
```

**11. 目标市场用自由输入太脆弱**
用户输入 "uk" / "UK" / "Britain" 才能命中 locale 规则，而当前代码用 regex 匹配。但 UI 暗示任意文本都有效（placeholder 是 "United States"）。大量用户会输入 "USA" 然后得到默认美式输出，不知道为什么。改成 select 下拉，选项对应 locale 规则里的 6 个市场 + 一个 "Other (US default)"。

**12. About 页面有 `TODO(founder)` 占位符**
`app/about/page.tsx` 里有未填写的创始人故事。这个页面在 PH 发布期间会被大量访问，占位符会直接损害信任度。这是发布前必须完成的事项。

### 🟡 增长和留存机会

**13. 零邮件捕获**
没有注册、没有 newsletter、没有任何邮件收集。用户来了、用了、走了，没有任何方式召回。最低成本方案：在 rate limit 触发时，展示一个 **"邮件提醒我配额刷新"** 的输入框。既解决用户痛点，又建立邮件列表。

**14. "只能逐 variant 对比"的 UX 限制**
当前必须点 tab 才能切换看 A/B/C 三个变体。增加一个 **"Compare all"** 视图，三栏并排展示 Title，让用户快速做决策。这是差异化竞品的实际体验改进点。

**15. 没有"单独重新生成"按钮**
用户如果满意 A 和 B 但不满意 C，只能重新生成全部 3 个。加一个每个 variant tab 上的"🔄 Regenerate this"按钮，成本低，体验提升明显。

**16. 分类覆盖有盲区**
表单里 Category 是硬编码的 12 个选项，但实际卖家可能卖玩具、工具、电子产品。用户只能选最接近的，但 AI 拿到错误的 category context 会影响输出质量。短期：允许自定义输入（select + free text）。长期：扩展分类列表。

**17. AdSense 申请时间窗口**
进度单说"等域名有 7 天流量再申请"，但现在域名已上线超过 7 天，sitemap 已提交，这个事项可以立即推进了。

### 🟢 锦上添花（低优先级）

**18. 字符计数器**
Amazon 标题有 200 char 限制，bullet 有 250 char 限制。在对应字段旁边显示实时计数（像 Twitter 那样），帮助卖家在使用工具前就建立正确预期，减少"为什么我的标题被截断"的困惑。

**19. 平台间对比引导**
首页的平台卡片直接跳工具页，但没有引导用户理解"为什么你应该关心多平台"。一个简短的 "Amazon vs TikTok Shop vs Shopify：什么情况下用哪个" 的内容页，既是 SEO 机会，也是用户教育。

---

## 优先级总结

| 优先级 | 编号 | 事项 | 类型 |
|--------|------|------|------|
| P0 立即 | #3 | 提示注入防护 | 安全 |
| P0 立即 | #4 | Turnstile bot 防护 | 安全 |
| P0 立即 | #12 | About 页创始人故事填写 | 产品 |
| P1 本周 | #9 | 表单状态持久化 | 产品 |
| P1 本周 | #10 | 一键全复制 | 产品 |
| P1 本周 | #11 | Target Market 改下拉 | 产品 |
| P1 本周 | #13 | 邮件捕获（rate limit 场景） | 增长 |
| P2 本月 | #2 | Sentry 错误监控接入 | 架构 |
| P2 本月 | #17 | AdSense 申请 | 变现 |
| P2 本月 | #14 | Compare all 视图 | 产品 |
| P3 迭代 | #15 | 单 variant 重生成 | 产品 |
| P3 迭代 | #1 | LLM 供应商 fallback | 架构 |
| P3 迭代 | #7 | Edge runtime 迁移 | 架构 |
| P4 长期 | #5 | pSEO 内容移出代码 | 架构 |
| P4 长期 | #8 | 生成结果缓存 | 架构 |

---

## 关键判断

整体工程底座扎实，pSEO 布局思路清晰。**最大的风险不是技术，而是在建立用户留存机制前流量就来了却留不住**——零 email capture 是目前最值得立刻解决的产品问题。安全侧的提示注入和 bot 防护是上线后的隐形炸弹，建议在 PH 发布前处理掉。
