#!/usr/bin/env node
// 中国天气网 MCP 服务器
// 数据源：weather.com.cn（通过 sojson 封装接口）
// 无需 API Key，免费使用
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { weatherCurrent, weatherForecast, weatherSummary } from "./weather-tool.js";

const TOOLS = [
  {
    name: "weather_current",
    description: "获取中国天气网实时天气（温度、湿度、PM2.5、空气质量等）。参数：city（城市名，如'广州'）",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        city: { type: "string", description: "城市名，如：广州、北京、上海" },
      },
      required: ["city"],
    },
  },
  {
    name: "weather_forecast",
    description: "获取中国天气网 15 天天气预报。参数：city（城市名）",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        city: { type: "string", description: "城市名，如：广州、北京、上海" },
      },
      required: ["city"],
    },
  },
  {
    name: "weather_summary",
    description: "获取中国天气网天气摘要（实时+今天+明天，简洁格式）。参数：city（城市名）",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        city: { type: "string", description: "城市名，如：广州、北京、上海" },
      },
      required: ["city"],
    },
  },
];

const HANDLERS = {
  weather_current: (args) => weatherCurrent(args),
  weather_forecast: (args) => weatherForecast(args),
  weather_summary: (args) => weatherSummary(args),
};

const server = new Server(
  { name: "weather-china-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const handler = HANDLERS[req.params.name];
  if (!handler) {
    return {
      content: [{ type: "text", text: `未知工具: ${req.params.name}` }],
      isError: true,
    };
  }
  try {
    const result = await handler(req.params.arguments ?? {});
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { content: [{ type: "text", text: `错误: ${message}` }], isError: true };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write("[weather-china-mcp] 中国天气网 MCP 服务已启动\n");
}

main().catch((err) => {
  process.stderr.write(`[weather-china-mcp] 致命错误: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
