// 中国天气网（weather.com.cn）API 集成
// 直接调用官方接口，无需 API Key
// 数据源：http://www.weather.com.cn

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const API_BASE = "http://d1.weather.com.cn";

// ─── 城市名 → 城市代码映射表 ───────────────────────────────────────────────────
// 从同级目录下的 city-codes-complete.json 加载（共 2732 个城市/区县）
const __dirname = dirname(fileURLToPath(import.meta.url));
let CITY_CODES = {};
try {
  const codeFile = join(__dirname, "..", "city-codes-complete.json");
  CITY_CODES = JSON.parse(readFileSync(codeFile, "utf-8"));
} catch {
  // 加载失败时使用内置的常用城市兜底
  CITY_CODES = {
  // 直辖市
  "北京": "101010100", "上海": "101020100", "天津": "101030100", "重庆": "101040100",
  // 广东
  "广州": "101280101", "深圳": "101280601", "珠海": "101280701", "佛山": "101280801",
  "东莞": "101281601", "惠州": "101280301", "中山": "101281701", "江门": "101281101",
  "湛江": "101281001", "茂名": "101282001", "肇庆": "101280901", "汕头": "101280501",
  // 浙江
  "杭州": "101210101", "宁波": "101210401", "温州": "101210701", "嘉兴": "101210301",
  "金华": "101210901", "绍兴": "101210501", "台州": "101210601",
  // 江苏
  "南京": "101190101", "苏州": "101190401", "无锡": "101190201", "常州": "101191101",
  "徐州": "101190801", "南通": "101190501", "扬州": "101190601",
  // 四川
  "成都": "101270101", "绵阳": "101270401", "德阳": "101272001", "宜宾": "101271101",
  // 湖北
  "武汉": "101200101", "宜昌": "101200901", "襄阳": "101200201",
  // 湖南
  "长沙": "101250101", "株洲": "101250301", "湘潭": "101250201",
  // 山东
  "济南": "101120101", "青岛": "101120201", "烟台": "101120501", "潍坊": "101120601",
  // 河南
  "郑州": "101180101", "洛阳": "101180901", "开封": "101180801",
  // 福建
  "福州": "101230101", "厦门": "101230201", "泉州": "101230501",
  // 安徽
  "合肥": "101220101", "芜湖": "101220301",
  // 江西
  "南昌": "101240101", "九江": "101240201",
  // 广西
  "南宁": "101300101", "桂林": "101300501", "柳州": "101300301", "北海": "101301301",
  // 云南
  "昆明": "101290101", "大理": "101290201", "丽江": "101291401",
  // 贵州
  "贵阳": "101260101", "遵义": "101260201",
  // 陕西
  "西安": "101110101", "咸阳": "101110200",
  // 山西
  "太原": "101100101", "大同": "101100201",
  // 辽宁
  "沈阳": "101070101", "大连": "101070201",
  // 吉林
  "长春": "101060101",
  // 黑龙江
  "哈尔滨": "101050101",
  // 河北
  "石家庄": "101090101", "唐山": "101090501",
  // 内蒙古
  "呼和浩特": "101080101",
  // 新疆
  "乌鲁木齐": "101130101",
  // 西藏
  "拉萨": "101140101",
  // 宁夏
  "银川": "101170101",
  // 甘肃
  "兰州": "101160101",
  // 青海
  "西宁": "101150101",
  // 海南
  "海口": "101310101", "三亚": "101310201",
  };
}

// ─── 工具函数 ─────────────────────────────────────────────────────────────────

/**
 * 通过城市名获取中国天气网城市代码。
 * 1. 查本地映射表（支持去掉"市/区/县"后缀及模糊匹配）
 * 2. 本地找不到时，调用中国天气网内部搜索接口在线查询
 */
async function getCityCode(city) {
  // 1. 本地映射表直接匹配
  if (CITY_CODES[city]) return CITY_CODES[city];
  const stripped = city.replace(/[市区县]$/, "");
  if (CITY_CODES[stripped]) return CITY_CODES[stripped];
  // 2. 本地模糊匹配
  for (const [name, code] of Object.entries(CITY_CODES)) {
    if (name.includes(stripped) || stripped.includes(name)) return code;
  }
  // 3. 在线搜索 fallback
  return await searchCityCodeOnline(stripped);
}

// ─── 在线城市代码搜索 ─────────────────────────────────────────────────────────
// 使用中国天气网内部搜索接口：http://toy1.weather.com.cn/search?cityname=xxx
// 返回格式：success([{"ref":"代码~省份~城市名~拼音~..."}])
// 取第一个结果的 ref 中第一个 ~ 之前的字符串即为中国天气网城市代码

async function searchCityCodeOnline(city) {
  try {
    const url = `http://toy1.weather.com.cn/search?cityname=${encodeURIComponent(city)}&callback=success`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": "http://www.weather.com.cn/",
      },
    });
    if (!res.ok) return null;

    const text = await res.text();
    // 去掉回调函数包裹：success(...)
    const jsonStr = text.replace(/^success\(/, "").replace(/\);?$/, "");
    const data = JSON.parse(jsonStr);

    if (!Array.isArray(data) || data.length === 0) return null;

    // ref 格式：代码~省份~城市名~...，取第一个 ~ 之前的部分
    const rawCode = data[0].ref?.split("~")[0];
    if (rawCode && /^\d{9,12}$/.test(rawCode)) {
      // 镇级代码为 12 位，天气接口只支持 9 位市级代码，截取前 9 位
      const code = rawCode.length > 9 ? rawCode.slice(0, 9) : rawCode;
      // 缓存结果
      CITY_CODES[city] = code;
      return code;
    }
    return null;
  } catch {
    return null;
  }
}

// ─── 获取天气数据 ─────────────────────────────────────────────────────────────
// 中国天气网官方接口说明：
//   /weather_index/{城市代码}.html  → 综合天气数据（JS 格式，含实时+预报+生活指数）
// 需要带上 Referer 头，否则返回 403
//
// 返回的 JS 变量：
//   dataSK  → 实时天气（temp, WD, WS, SD, qy, aqi, weather, time...）
//   cityDZ  → 当天预报（weather, temp, tempn, wd, ws...）
//   fc      → 5天预报数组 f[0]~f[4]（fa/fb 天气码, fc/fd 高低温, fe/ff 风向, fg/fh 风力...）

async function fetchWeather(cityCode) {
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Referer": "http://www.weather.com.cn/",
  };

  const res = await fetch(`${API_BASE}/weather_index/${cityCode}.html`, { headers });
  if (!res.ok) throw new Error(`天气接口 HTTP ${res.status}`);

  const text = await res.text();

  // 解析 JS 变量中的 JSON（处理嵌套括号）
  const parseVar = (name) => {
    const startRegex = new RegExp(`var ${name} =`);
    const startMatch = startRegex.exec(text);
    if (!startMatch) return null;

    const startIdx = startMatch.index + startMatch[0].length;
    let depth = 0;
    let endIdx = startIdx;

    for (let i = startIdx; i < text.length; i++) {
      const ch = text[i];
      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) {
          endIdx = i + 1;
          break;
        }
      }
    }

    if (depth !== 0) return null;

    try {
      return JSON.parse(text.slice(startIdx, endIdx));
    } catch {
      return null;
    }
  };

  const dataSK = parseVar("dataSK");
  const cityDZ = parseVar("cityDZ");
  const fc = parseVar("fc");

  if (!dataSK) throw new Error("天气接口返回数据异常");

  return { dataSK, cityDZ, fc };
}

// ─── weather_current ──────────────────────────────────────────────────────────

export async function weatherCurrent(args) {
  const city = String(args.city ?? "").trim();
  if (!city) return { error: "请提供城市名（如：广州）" };

  const code = await getCityCode(city);
  if (!code) return { error: `未找到城市"${city}"，请检查城市名是否正确` };

  const data = await fetchWeather(code);
  const sk = data.dataSK;
  const dz = data.cityDZ?.weatherinfo;

  return {
    city: sk.cityname,
    temperature_c: sk.temp,
    weather: sk.weather,
    wind: `${sk.WD} ${sk.WS}`,
    humidity_pct: sk.SD,
    pressure_hpa: sk.qy,
    aqi: sk.aqi,
    pm25: sk.aqi_pm25,
    updateTime: sk.time,
    notice: dz ? `${dz.weather}，${dz.wd} ${dz.ws}` : undefined,
  };
}

// ─── weather_forecast ────────────────────────────────────────────────────────

export async function weatherForecast(args) {
  const city = String(args.city ?? "").trim();
  if (!city) return { error: "请提供城市名（如：广州）" };

  const code = await getCityCode(city);
  if (!code) return { error: `未找到城市"${city}"，请检查城市名是否正确` };

  const data = await fetchWeather(code);
  const sk = data.dataSK;
  const fc = data.fc?.f ?? [];

  // fc 数组每项：fa/fb 天气码(白天/夜间), fc/fd 高低温, fe/ff 风向, fg/fh 风力, fi 日期, fj 星期
  const weatherCodeMap = {
    "00": "晴", "01": "多云", "02": "阴", "03": "阵雨", "04": "雷阵雨",
    "05": "雷阵雨伴有冰雹", "06": "雨夹雪", "07": "小雨", "08": "中雨",
    "09": "大雨", "10": "暴雨", "11": "大暴雨", "12": "特大暴雨",
    "13": "阵雪", "14": "小雪", "15": "中雪", "16": "大雪", "17": "暴雪",
    "18": "雾", "19": "冻雨", "20": "沙尘暴", "21": "小到中雨",
    "22": "中到大雨", "23": "大到暴雨", "24": "暴到大暴雨",
    "25": "大暴到特大暴雨", "26": "小到中雪", "27": "中到大雪",
    "28": "大到暴雪", "29": "浮尘", "30": "扬沙", "31": "强沙尘暴",
    "53": "霾", "99": "无数据",
  };

  const codeToWeather = (code) => weatherCodeMap[code] || `未知(${code})`;

  return {
    city: sk.cityname,
    updateTime: sk.time,
    days: fc.length,
    forecast: fc.map((d) => ({
      date: d.fi,
      week: d.fj,
      weather_day: codeToWeather(d.fa),
      weather_night: codeToWeather(d.fb),
      temp_high: `${d.fc}℃`,
      temp_low: `${d.fd}℃`,
      wind_day: `${d.fe} ${d.fg}`,
      wind_night: `${d.ff} ${d.fh}`,
    })),
  };
}

// ─── weather_summary ─────────────────────────────────────────────────────────

export async function weatherSummary(args) {
  const city = String(args.city ?? "").trim();
  if (!city) return { error: "请提供城市名（如：广州）" };

  const code = await getCityCode(city);
  if (!code) return { error: `未找到城市"${city}"，请检查城市名是否正确` };

  const data = await fetchWeather(code);
  const sk = data.dataSK;
  const dz = data.cityDZ?.weatherinfo;
  const today = data.fc?.f?.[0];
  const tomorrow = data.fc?.f?.[1];

  const weatherCodeMap = {
    "00": "晴", "01": "多云", "02": "阴", "03": "阵雨", "04": "雷阵雨",
    "05": "雷阵雨伴有冰雹", "06": "雨夹雪", "07": "小雨", "08": "中雨",
    "09": "大雨", "10": "暴雨", "11": "大暴雨", "12": "特大暴雨",
    "13": "阵雪", "14": "小雪", "15": "中雪", "16": "大雪", "17": "暴雪",
    "18": "雾", "19": "冻雨", "20": "沙尘暴", "21": "小到中雨",
    "22": "中到大雨", "23": "大到暴雨", "24": "暴到大暴雨",
    "25": "大暴到特大暴雨", "26": "小到中雪", "27": "中到大雪",
    "28": "大到暴雪", "29": "浮尘", "30": "扬沙", "31": "强沙尘暴",
    "53": "霾", "99": "无数据",
  };
  const codeToWeather = (code) => weatherCodeMap[code] || `未知(${code})`;

  return {
    city: sk.cityname,
    updateTime: sk.time,
    current: {
      temperature_c: sk.temp,
      humidity_pct: sk.SD,
      weather: sk.weather,
      wind: `${sk.WD} ${sk.WS}`,
      aqi: sk.aqi,
      pm25: sk.aqi_pm25,
    },
    today: today ? {
      date: today.fi,
      week: today.fj,
      weather_day: codeToWeather(today.fa),
      weather_night: codeToWeather(today.fb),
      temp_high: `${today.fc}℃`,
      temp_low: `${today.fd}℃`,
      wind: `${today.fe} ${today.fg}`,
    } : null,
    tomorrow: tomorrow ? {
      date: tomorrow.fi,
      week: tomorrow.fj,
      weather_day: codeToWeather(tomorrow.fa),
      weather_night: codeToWeather(tomorrow.fb),
      temp_high: `${tomorrow.fc}℃`,
      temp_low: `${tomorrow.fd}℃`,
      wind: `${tomorrow.fe} ${tomorrow.fg}`,
    } : null,
  };
}
