# 天气 MCP 服务

基于和风天气（[QWeather](https://www.qweather.com)）API 的 MCP 服务器，提供实时天气和 **7 天预报**查询。

> 使用和风天气官方接口，**需要 API Key（DevKey）**，免费版支持 1000 次/天调用。

## 安装

```bash
cd qweather-mcp
npm install
```

## 配置

### 获取和风天气 API Key

本服务使用[和风天气（QWeather）](https://www.qweather.com) API，需要先获取 **DevKey**。步骤如下：

1. 访问 [和风天气官网](https://www.qweather.com)，注册/登录账号。
2. 进入 [控制台](https://console.qweather.com) → **项目管理** → 创建一个新项目（Project）。
3. 在项目中生成一把 **Key**（选择 **WebAPI** 类型），即为本服务所需的 `DevKey`。
4. 将 Key 填入 `src/index.js` 第 5 行的 `QWEATHER_KEY` 处：

```js
// src/index.js 第 5 行
const QWEATHER_KEY = "你的DevKey"; // 替换为实际的和风天气 DevKey
```

> ⚠️ **注意**：
> - 免费版 Key 有调用次数限制（默认 1000 次/天），请合理使用。
> - 不要将 Key 提交到公开代码仓库（建议将 `src/index.js` 加入 `.gitignore`，或使用环境变量读取）。
> - Key 绑定的项目需已订阅 **实时天气**、**天气预报**、**城市搜索** 等所需 API 权限。

---

### 配置位置说明（项目级 vs 全局）

MCP 服务可以在**两个位置**配置，区别如下：

| 配置级别 | 配置文件位置 | 作用范围 | 适用客户端 |
|----------|-------------|----------|-----------|
| **项目级** | 项目根目录下的 `.mcp.json` / `opencode.jsonc` | 仅当前项目 | Claude Code、OpenCode |
| **全局级** | 用户主目录下的配置文件 | 所有项目 | Claude Code、Claude Desktop、OpenCode、Cursor 等 |

---

### 方式一：项目级配置（仅当前项目生效）

**适用场景**：希望这个 MCP 服务只在某个特定项目中可用。

在**项目根目录**下创建 `.mcp.json` 文件：

```
<项目根目录>/
├── .mcp.json          ← 在这里创建
├── src/
├── package.json
└── ...
```

---

### 方式二：全局配置（推荐，所有项目生效）

**适用场景**：希望在任何项目、任何目录都能使用这个 MCP 服务。

#### 2.1 Claude Code 全局配置

**配置文件路径**：

| 系统 | 完整路径 |
|------|----------|
| Windows | `C:\Users\<你的用户名>\.claude.json` |
| macOS | `/Users/<你的用户名>/.claude.json` |
| Linux | `/home/<你的用户名>/.claude.json` |

> 简写：`~/.claude.json`

在 `~/.claude.json` 中添加 `mcpServers` 字段（详见下方安装方式）。

#### 2.2 Claude Desktop 配置

| 系统 | 完整路径 |
|------|----------|
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |

#### 2.3 OpenCode 全局配置

**配置文件路径**：

| 系统 | 完整路径 |
|------|----------|
| Windows | `C:\Users\<你的用户名>\.config\opencode\opencode.jsonc` |
| macOS | `~/.config/opencode/opencode.jsonc` |
| Linux | `~/.config/opencode/opencode.jsonc` |

> 简写：`~/.config/opencode/opencode.jsonc`

> ⚠️ **注意**：OpenCode 的配置格式与 Claude Code 不同，详见下方 [OpenCode 配置格式](#opencode-配置格式)。

#### 2.4 Cursor / Windsurf / Cline 等 IDE

| IDE | 配置方式 |
|-----|----------|
| Cursor | 设置面板 → MCP，或项目 `.cursor/mcp.json` |
| Windsurf | 设置面板 → MCP |
| Cline | 扩展设置 → MCP 配置 |

---

### 安装方式与配置内容

> 以下安装方式对应不同的 `command` + `args`，根据你的选择填入上述配置文件。

---

#### 安装方式 A：GitHub 直装（npx，推荐）

无需克隆，直接通过 `npx` 从 GitHub 运行：

```json
{
  "mcpServers": {
    "qweather": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "github:zaixiamaomaoyu/mcp-servers/qweather-mcp"]
    }
  }
}
```

---

#### 安装方式 B：本地克隆（Git Clone）

如果你是从 GitHub 克隆到本地运行的，需要先安装依赖，然后使用**本地绝对路径**：

```bash
git clone https://github.com/zaixiamaomaoyu/qweather-mcp.git
cd qweather-mcp
npm install
```

配置内容（将 `<你的项目路径>` 替换为实际路径）：

```json
{
  "mcpServers": {
    "qweather": {
      "type": "stdio",
      "command": "node",
      "args": ["<你的项目路径>/qweather-mcp/src/index.js"]
    }
  }
}
```

> 示例：如果克隆到 `D:\projects\qweather-mcp`，则路径为 `D:/projects/qweather-mcp/src/index.js`

---

#### 安装方式 C：npm 全局安装

```bash
npm install -g qweather-mcp
```

配置内容：

```json
{
  "mcpServers": {
    "qweather": {
      "type": "stdio",
      "command": "qweather-mcp",
      "args": []
    }
  }
}
```

---

#### 安装方式 D：npm 包 + npx（不全局安装）

无需全局安装，直接用 npx 运行：

```json
{
  "mcpServers": {
    "qweather": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "qweather-mcp"]
    }
  }
}
```

---

### 各安装方式对比

| 安装方式 | 是否需要克隆 | 是否需要全局安装 | 配置中的 command | 推荐度 |
|----------|:---:|:---:|---|:---:|
| **A. GitHub 直装（npx）** | ❌ | ❌ | `npx -y github:...` | ⭐⭐⭐ |
| **B. 本地克隆** | ✅ | ❌ | `node <绝对路径>` | ⭐⭐ |
| **C. npm 全局安装** | ❌ | ✅ | `qweather-mcp` | ⭐⭐ |
| **D. npm + npx** | ❌ | ❌ | `npx -y qweather-mcp` | ⭐⭐⭐ |

---

### OpenCode 配置格式

> ⚠️ OpenCode 的配置格式与 Claude Code 不同，主要差异如下：

| 差异项 | Claude Code | OpenCode |
|--------|-------------|----------|
| **顶层键** | `mcpServers` | `mcp` |
| **类型关键字** | `"stdio"` | `"local"` |
| **命令格式** | `command: "npx"` + `args: ["-y", "..."]` | `command: ["npx", "-y", "..."]`（合并为一个数组） |
| **环境变量** | `env: { "KEY": "val" }` | `environment: { "KEY": "val" }` |
| **支持注释** | ❌ | ✅（`.jsonc` 格式） |

#### OpenCode 配置示例

在 `opencode.jsonc`（项目级或全局）中添加：

```jsonc
// opencode.jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "qweather": {
      "type": "local",
      "command": ["npx", "-y", "github:zaixiamaomaoyu/mcp-servers/qweather-mcp"],
      "enabled": true
    }
  }
}
```

#### OpenCode 各安装方式对应的 command

| 安装方式 | OpenCode 的 `command` 数组 |
|----------|---------------------------|
| **A. GitHub 直装（推荐）** | `["npx", "-y", "github:zaixiamaomaoyu/mcp-servers/qweather-mcp"]` |
| **B. 本地克隆** | `["node", "<绝对路径>/qweather-mcp/src/index.js"]` |
| **C. npm 全局安装** | `["qweather-mcp"]` |
| **D. npm + npx** | `["npx", "-y", "qweather-mcp"]` |

#### OpenCode MCP 管理命令

```bash
opencode mcp list          # 列出所有 MCP 服务器和认证状态
opencode mcp auth <name>   # 与需要 OAuth 的 MCP 服务器进行认证
opencode mcp debug <name>  # 调试连接/OAuth 问题
opencode mcp logout <name> # 移除已存储的凭证
```

---

### 配置验证

配置完成后，重启你的客户端，然后验证：

**Claude Code**：运行 `/mcp`，如果看到 `qweather` 服务已连接并列出 `get_weather`、`get_weather_detail`、`get_weather_summary` 三个工具，说明配置成功。

**OpenCode**：运行 `opencode mcp list`，如果看到 `qweather` 状态为已连接，说明配置成功。

**其他客户端**：在对话中尝试调用天气查询，如"查询北京天气"。

## 可用工具

| 工具名称 | 描述 | 参数 |
|---------|------|------|
| `get_weather` | 未来 7 天天气预报 | `city` (必填), `lang` (可选: zh/en) |
| `get_weather_detail` | 实时天气（结构化 JSON） | `city` (必填) |
| `get_weather_summary` | 实时天气（简洁摘要） | `city` (必填), `lang` (可选: zh/en) |

## 支持的城市

支持**任意中文城市名**查询，通过和风天气城市搜索 API（`geoapi.qweather.com/v2/city/lookup`）进行匹配，覆盖全国各市、区、县。

## 数据源

| 项目 | 说明 |
|------|------|
| 数据来源 | 和风天气 QWeather（https://www.qweather.com） |
| 城市查询 API | `https://geoapi.qweather.com/v2/city/lookup` |
| 天气数据 API | `https://devapi.qweather.com/v7` |
| 认证方式 | 需要 API Key（DevKey） |

## 注意事项

- **预报天数**：`get_weather` 返回 **7 天**预报，这是和风天气免费版 `weather/7d` 接口能提供的最大天数。
- **调用限制**：免费版 Key 默认 1000 次/天，超出后会返回错误，请合理控制查询频率。
- **API 权限**：确保在控制台为 Key 订阅了 **实时天气**、**7天天气预报**、**城市搜索** 权限。

## 返回数据示例

### get_weather_detail

```json
{
  "city": "北京",
  "temp": "25°C",
  "feelsLike": "24°C",
  "desc": "多云",
  "humidity": "65%",
  "wind": "3级 东南风",
  "pressure": "1012hPa",
  "obsTime": "2026-07-23T10:00+08:00"
}
```

### get_weather

```
【北京 未来7天天气预报】
2026-07-23 | 多云 | 22°C~30°C | 湿度65% | 3级 东南风
2026-07-24 | 晴 转 多云 | 23°C~31°C | 湿度60% | 2级 南风
...
```

### get_weather_summary

```
【北京 实时天气】
天气：多云
气温：25°C（体感 24°C）
湿度：65%
风力：3级 东南风
气压：1012hPa
```

## 依赖

- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/sdk) — MCP 协议 SDK
- [node-fetch](https://github.com/node-fetch/node-fetch) — HTTP 请求

## 许可证

MIT
