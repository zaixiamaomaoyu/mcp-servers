import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cityCodes = JSON.parse(readFileSync(join(__dirname, "..", "city-codes-complete.json"), "utf-8"));

describe("city-codes-complete.json", () => {
  it("should contain more than 2000 cities", () => {
    expect(Object.keys(cityCodes).length).toBeGreaterThan(2000);
  });

  it("should have valid 9-digit codes for major cities", () => {
    expect(cityCodes["北京"]).toBe("101010100");
    expect(cityCodes["上海"]).toBe("101020100");
    expect(cityCodes["广州"]).toBe("101280101");
    expect(cityCodes["深圳"]).toBe("101280601");
  });

  it("all codes should be numeric strings", () => {
    for (const [name, code] of Object.entries(cityCodes)) {
      expect(code).toMatch(/^\d+$/);
    }
  });
});

describe("weather-tool module", () => {
  it("should export weatherCurrent, weatherForecast, weatherSummary", async () => {
    const mod = await import("../src/weather-tool.js");
    expect(typeof mod.weatherCurrent).toBe("function");
    expect(typeof mod.weatherForecast).toBe("function");
    expect(typeof mod.weatherSummary).toBe("function");
  });
});
