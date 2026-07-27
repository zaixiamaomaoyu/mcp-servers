# 中国天气网 MCP 服务

[![npm version](https://img.shields.io/npm/v/weather-china-mcp)](https://www.npmjs.com/package/weather-china-mcp)
[![npm downloads](https://img.shields.io/npm/dm/weather-china-mcp)](https://www.npmjs.com/package/weather-china-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

基于中国天气网（[weather.com.cn](http://www.weather.com.cn)）的 MCP 服务器，提供实时天气和 5 天预报查询。兼容 Claude Desktop、Claude Code、Cursor、Cline、Windsurf、OpenCode 等 AI 工具。

> 直接调用中国天气网官方接口，**无需 API Key**，免费使用。

## 快速安装（npm）

```bash
# 全局安装
npm install -g weather-china-mcp
```

然后在你的 MCP 客户端配置中添加：

```json
{
  "mcpServers": {
    "weather-china": {
      "type": "stdio",
      "command": "weather-china-mcp",
      "args": []
    }
  }
}
```

或者直接用 npx（无需全局安装）：

```json
{
  "mcpServers": {
    "weather-china": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "weather-china-mcp"]
    }
  }
}
```

## 配置

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
    "weather-china": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "github:zaixiamaomaoyu/weather-china-mcp"]
    }
  }
}
```

---

#### 安装方式 B：本地克隆（Git Clone）

如果你是从 GitHub 克隆到本地运行的，需要先安装依赖，然后使用**本地绝对路径**：

```bash
git clone https://github.com/zaixiamaomaoyu/weather-china-mcp.git
cd weather-china-mcp
npm install
```

配置内容（将 `<你的项目路径>` 替换为实际路径）：

```json
{
  "mcpServers": {
    "weather-china": {
      "type": "stdio",
      "command": "node",
      "args": ["<你的项目路径>/weather-china-mcp/src/index.js"]
    }
  }
}
```

> 示例：如果克隆到 `D:\projects\weather-china-mcp`，则路径为 `D:/projects/weather-china-mcp/src/index.js`

---

#### 安装方式 C：npm 全局安装

```bash
npm install -g weather-china-mcp
```

配置内容：

```json
{
  "mcpServers": {
    "weather-china": {
      "type": "stdio",
      "command": "weather-china-mcp",
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
    "weather-china": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "weather-china-mcp"]
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
| **C. npm 全局安装** | ❌ | ✅ | `weather-china-mcp` | ⭐⭐ |
| **D. npm + npx** | ❌ | ❌ | `npx -y weather-china-mcp` | ⭐⭐⭐ |

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
    "weather-china": {
      "type": "local",
      "command": ["npx", "-y", "github:zaixiamaomaoyu/weather-china-mcp"],
      "enabled": true
    }
  }
}
```

#### OpenCode 各安装方式对应的 command

| 安装方式 | OpenCode 的 `command` 数组 |
|----------|---------------------------|
| **A. GitHub 直装（推荐）** | `["npx", "-y", "github:zaixiamaomaoyu/weather-china-mcp"]` |
| **B. 本地克隆** | `["node", "<绝对路径>/weather-china-mcp/src/index.js"]` |
| **C. npm 全局安装** | `["weather-china-mcp"]` |
| **D. npm + npx** | `["npx", "-y", "weather-china-mcp"]` |

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

**Claude Code**：运行 `/mcp`，如果看到 `weather-china` 服务已连接并列出 `weather_current`、`weather_forecast`、`weather_summary` 三个工具，说明配置成功。

**OpenCode**：运行 `opencode mcp list`，如果看到 `weather-china` 状态为已连接，说明配置成功。

**其他客户端**：在对话中尝试调用天气查询，如"查询北京天气"。

## 可用工具

| 工具名称 | 描述 | 参数 |
|---------|------|------|
| `weather_current` | 实时天气（温度、湿度、PM2.5、空气质量、气压） | `city`（必填） |
| `weather_forecast` | 5 天天气预报（含天气状况、高低温、风向风力） | `city`（必填） |
| `weather_summary` | 天气摘要（实时 + 今天 + 明天） | `city`（必填） |

## 支持的城市

支持**任意中文城市名**查询，查找逻辑如下：

1. **本地映射表**（`city-codes-complete.json`，含 2732 个城市/区县）
   - 精确匹配（如 `广州`）
   - 自动去后缀（如 `广州市` → `广州`）
   - 模糊匹配（如输入部分城市名）
2. **在线搜索 fallback**（中国天气网内部搜索接口）
   - 本地表找不到时，自动按城市名在线搜索代码
   - 搜索到后自动缓存到本地，下次无需再请求网络
   - 支持镇级地名（自动映射到上级市级数据）

## 数据源

| 项目 | 说明 |
|------|------|
| 数据来源 | 中国天气网 weather.com.cn |
| 天气接口 | `http://d1.weather.com.cn/weather_index/{城市代码}.html` |
| 搜索接口 | `http://toy1.weather.com.cn/search?cityname=城市名` |
| 认证方式 | 无需 API Key |

## 注意事项

- **预报天数**：`weather_forecast` 返回 **5 天**预报，这是中国天气网官方接口 `fc` 数组能提供的最大天数，无法获取 7 天或 15 天数据。

## 返回数据示例

### weather_current

```json
{
  "city": "广州",
  "temperature_c": "28.8",
  "weather": "多云",
  "wind": "西南风 1级",
  "humidity_pct": "84%",
  "pressure_hpa": "998",
  "aqi": "36",
  "pm25": "36",
  "updateTime": "18:30",
  "notice": "多云转晴，南风转微风 3-4级转<3级"
}
```

### weather_forecast

```json
{
  "city": "广州",
  "updateTime": "18:30",
  "days": 5,
  "forecast": [
    {
      "date": "7/22",
      "week": "今天",
      "weather_day": "多云",
      "weather_night": "晴",
      "temp_high": "33℃",
      "temp_low": "25℃",
      "wind_day": "南风 3-4级",
      "wind_night": "无持续风向 <3级"
    }
  ]
}
```

### weather_summary

```json
{
  "city": "广州",
  "updateTime": "18:30",
  "current": {
    "temperature_c": "28.8",
    "humidity_pct": "84%",
    "weather": "多云",
    "wind": "西南风 1级",
    "aqi": "36",
    "pm25": "36"
  },
  "today": {
    "date": "7/22",
    "week": "今天",
    "weather_day": "多云",
    "weather_night": "晴",
    "temp_high": "33℃",
    "temp_low": "25℃",
    "wind": "南风 3-4级"
  },
  "tomorrow": {
    "date": "7/23",
    "week": "星期四",
    "weather_day": "晴",
    "weather_night": "晴",
    "temp_high": "34℃",
    "temp_low": "26℃",
    "wind": "无持续风向 <3级"
  }
}
```

## 依赖

- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/sdk) — MCP 协议 SDK

## 许可证

MIT
