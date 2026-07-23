# MCP Weather Servers

一套基于 MCP（Model Context Protocol）协议的天气查询服务器集合，支持多种 AI 客户端（Claude Code、Claude Desktop、OpenCode、Cursor 等）。

## 项目概览

本项目包含两个独立的 MCP 天气服务器，分别对接不同的数据源，可根据需要选择使用：

| 服务器 | 数据源 | 需要 API Key | 预报天数 | 特色 |
|--------|--------|:---:|:---:|------|
| [weather-china-mcp](./weather-china-mcp/) | 中国天气网 weather.com.cn | 否 | 5 天 | 免 API Key，支持 2732+ 城市/区县 |
| [qweather-mcp](./qweather-mcp/) | 和风天气 QWeather | 是 | 7 天 | 数据更丰富，需和风天气 DevKey |

## 快速开始

### 前置要求

- Node.js >= 18.0
- 一个支持 MCP 的 AI 客户端（Claude Code、OpenCode、Cursor 等）

### 安装

```bash
# 克隆仓库
git clone https://github.com/zaixiamaomaoyu/mcp-servers.git
cd mcp-servers

# 安装 weather-china-mcp（免 API Key，推荐优先尝试）
cd weather-china-mcp
npm install
cd ..

# 安装 qweather-mcp（可选，需要和风天气 DevKey）
cd qweather-mcp
npm install
cd ..
```

### 配置

#### Claude Code

项目根目录下的 `.mcp.json` 已预配置好三个 MCP 服务，启动 Claude Code 时会自动加载：

```json
{
  "mcpServers": {
    "openmeteo": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "open-meteo-mcp-server"]
    },
    "qweather": {
      "type": "stdio",
      "command": "node",
      "args": ["<项目路径>/qweather-mcp/src/index.js"]
    },
    "weather-china": {
      "type": "stdio",
      "command": "weather-china-mcp"
    }
  }
}
```

> **提示**：`openmeteo` 是公共开放服务，无需额外配置即可使用。

#### OpenCode

项目根目录下的 `opencode.json` 同样已预配置，直接可用。

#### Claude Desktop / Cursor / 全局配置

各子目录的 README 中有详细的配置说明，请参考：
- [weather-china-mcp 配置文档](./weather-china-mcp/README.md#配置)
- [qweather-mcp 配置文档](./qweather-mcp/README.md#配置)

## 可用工具

### weather-china-mcp（中国天气网）

| 工具 | 说明 | 参数 |
|------|------|------|
| `weather_current` | 实时天气（温度、湿度、PM2.5、空气质量、气压） | `city`（必填） |
| `weather_forecast` | 5 天天气预报 | `city`（必填） |
| `weather_summary` | 天气摘要（实时 + 今天 + 明天） | `city`（必填） |

### qweather-mcp（和风天气）

| 工具 | 说明 | 参数 |
|------|------|------|
| `get_weather` | 未来 7 天天气预报 | `city`（必填）、`lang`（可选: zh/en） |
| `get_weather_detail` | 实时天气（结构化 JSON） | `city`（必填） |
| `get_weather_summary` | 实时天气（简洁摘要） | `city`（必填）、`lang`（可选: zh/en） |

## 项目结构

```
mcp-servers/
├── .mcp.json              # Claude Code 全局 MCP 配置
├── opencode.json          # OpenCode MCP 配置
├── weather-china-mcp/     # 中国天气网 MCP 服务
│   ├── src/
│   │   ├── index.js       # 服务入口
│   │   └── weather-tool.js # 天气 API 集成
│   ├── city-codes-complete.json  # 2732+ 城市代码映射表
│   ├── package.json
│   └── README.md
├── qweather-mcp/          # 和风天气 MCP 服务
│   ├── src/
│   │   └── index.js       # 服务入口 + API 集成
│   ├── package.json
│   └── README.md
└── README.md              # 本文件
```

## 选择建议

- **只想快速用** → 选 `weather-china-mcp`，免注册、免 API Key，开箱即用
- **需要更准确的天气数据** → 选 `qweather-mcp`，注册和风天气获取 DevKey
- **想要最全面** → 两个都装，配合 `openmeteo`（已内置配置）覆盖全球城市

## 许可证

MIT © [zaixiamaomaoyu](https://github.com/zaixiamaomaoyu)
