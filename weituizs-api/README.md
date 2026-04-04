# 微推文章 → 钉钉AI表 同步工具

## 功能
接收微推助手推送的微信公众号文章数据，自动写入钉钉AI表。

## 部署步骤

### 1. 一键部署到 Vercel
点击下方按钮：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/weituizs-dingtalk)

或手动部署：
```bash
npx vercel
```

### 2. 配置环境变量
在 Vercel 项目设置中添加以下环境变量：

| 变量名 | 值 |
|--------|-----|
| DINGTALK_APP_KEY | dingots6iqruvtsmdowa |
| DINGTALK_APP_SECRET | FSvaj3LEVtH-mIxtdvCts1hUS4i4sym1uBUOwcdAzd2cXC4d0_7wfKB-KjsxaPPm |
| DINGTALK_BASE_ID | 14lgGw3P8vvEgQARTQokRgZ985daZ90D |
| DINGTALK_TABLE_ID | wDcqpEX |
| DINGTALK_OPERATOR_ID | mqywoFVMueMlErB9rVsHiPwiEiE |

### 3. 获取 API 地址
部署完成后，API 地址为：
```
https://你的项目.vercel.app/api/weituizs
```

### 4. 填入微推后台
在微推助手后台 → 接收推送设置 → 填入上面的 API 地址。

## 接口格式
- 方法：POST
- Content-Type: application/x-www-form-urlencoded 或 JSON

| 参数 | 说明 |
|------|------|
| title | 文章标题 |
| mp | 公众号名称 |
| time | 发布时间 |
| cover | 封面图片 URL |
| copyright | 1=原创 / 0=非原创 |
| desc | 摘要 |
| author | 作者 |
| link | 原文链接 |
