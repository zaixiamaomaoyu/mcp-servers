import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const QWEATHER_KEY = "****"; // TODO: 填入你的和风天气 DevKey
const GEO_API = "https://geoapi.qweather.com/v2/city/lookup";
const WEATHER_API = "https://devapi.qweather.com/v7";

async function fetchJSON(url) {
  const response = await fetch(url, { headers: { "User-Agent": "qweather-mcp-Server/1.0" } });
  if (!response.ok) throw new Error("HTTP " + response.status);
  const data = await response.json();
  if (data.code && data.code !== "200") throw new Error("QWeather API error: " + data.code);
  return data;
}

async function lookupCityId(city) {
  const data = await fetchJSON(GEO_API + "?location=" + encodeURIComponent(city) + "&key=" + QWEATHER_KEY);
  if (!data.location || data.location.length === 0) throw new Error("未找到城市: " + city);
  return data.location[0];
}

async function fetchCurrentWeather(city) {
  const cityInfo = await lookupCityId(city);
  const data = await fetchJSON(WEATHER_API + "/weather/now?location=" + cityInfo.id + "&key=" + QWEATHER_KEY + "&lang=zh");
  const now = data.now;
  return {
    city: cityInfo.name,
    temp: now.temp + "°C",
    feelsLike: now.feelsLike + "°C",
    desc: now.text,
    humidity: now.humidity + "%",
    wind: now.windScale + "级 " + now.windDir,
    pressure: now.pressure + "hPa",
    obsTime: now.obsTime
  };
}

async function fetchForecast(city) {
  const cityInfo = await lookupCityId(city);
  const data = await fetchJSON(WEATHER_API + "/weather/7d?location=" + cityInfo.id + "&key=" + QWEATHER_KEY + "&lang=zh");
  return data.daily.map(d => ({
    date: d.fxDate,
    tempMax: d.tempMax + "°C",
    tempMin: d.tempMin + "°C",
    textDay: d.textDay,
    textNight: d.textNight,
    humidity: d.humidity + "%",
    wind: d.windScaleDay + "级 " + d.windDirDay
  }));
}

function createServer() {
  const server = new Server({ name: "qweather-mcp", version: "1.0.0" }, { capabilities: { tools: {} } });

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      { name: "get_weather", description: "Get weather forecast", inputSchema: { type: "object", properties: { city: { type: "string" }, lang: { type: "string", enum: ["zh", "en"] } }, required: ["city"] } },
      { name: "get_weather_detail", description: "Get structured weather data", inputSchema: { type: "object", properties: { city: { type: "string" } }, required: ["city"] } },
      { name: "get_weather_summary", description: "Get weather summary", inputSchema: { type: "object", properties: { city: { type: "string" }, lang: { type: "string", enum: ["zh", "en"] } }, required: ["city"] } }
    ]
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
      switch (name) {
        case "get_weather": {
          const { city } = args;
          const forecast = await fetchForecast(city);
          const today = forecast[0];
          var text = "【" + city + " 未来7天天气预报】\n";
          forecast.forEach(d => {
            text += d.date + " | " + d.textDay;
            if (d.textDay !== d.textNight) text += " 转 " + d.textNight;
            text += " | " + d.tempMin + "~" + d.tempMax + " | 湿度" + d.humidity + " | " + d.wind + "\n";
          });
          return { content: [{ type: "text", text: text }] };
        }
        case "get_weather_detail": {
          const { city } = args;
          const detail = await fetchCurrentWeather(city);
          return { content: [{ type: "text", text: JSON.stringify(detail, null, 2) }] };
        }
        case "get_weather_summary": {
          const { city } = args;
          const detail = await fetchCurrentWeather(city);
          const text = "【" + detail.city + " 实时天气】\n" +
            "天气：" + detail.desc + "\n" +
            "气温：" + detail.temp + "（体感 " + detail.feelsLike + "）\n" +
            "湿度：" + detail.humidity + "\n" +
            "风力：" + detail.wind + "\n" +
            "气压：" + detail.pressure;
          return { content: [{ type: "text", text: text }] };
        }
        default: throw new Error("Unknown tool: " + name);
      }
    } catch (error) {
      return { content: [{ type: "text", text: "Error: " + error.message }], isError: true };
    }
  });
  return server;
}

async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Weather MCP Server started");
}

main().catch(console.error);