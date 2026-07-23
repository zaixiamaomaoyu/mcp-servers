# 天气 MCP 服务

基于和风天气（QWeather）API 的 MCP 服务器，提供实时天气和 7 天预报查询。

## 安装

```bash
cd qweather-mcp
npm install
```

## 配置

### Claude Desktop

在 `claude_desktop_config.json` 中添加：

```json
{
  "mcpServers": {
    "qweather": {
      "command": "node",
      "args": ["D:/亿讯/练习/agent/mcp/qweather-mcp/src/index.js"]
    }
  }
}
```

### Claude Code / VS Code

在 `.mcp.json` 中添加：

```json
{
  "mcpServers": {
    "qweather": {
      "command": "node",
      "args": ["D:/亿讯/练习/agent/mcp/qweather-mcp/src/index.js"]
    }
  }
}
```

## 可用工具

| 工具名称 | 描述 | 参数 |
|---------|------|------|
| `get_weather` | 未来 7 天天气预报 | `city` (必填), `lang` (可选: zh/en) |
| `get_weather_detail` | 实时天气（结构化 JSON） | `city` (必填) |
| `get_weather_summary` | 实时天气（简洁摘要） | `city` (必填), `lang` (可选: zh/en) |

## 数据源

- **和风天气 QWeather** — https://www.qweather.com
- 城市查询 API: `geoapi.qweather.com/v2/city/lookup`
- 天气数据 API: `devapi.qweather.com/v7`

## 依赖

- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/sdk) — MCP 协议 SDK
- [node-fetch](https://github.com/node-fetch/node-fetch) — HTTP 请求

## 许可证

MIT
