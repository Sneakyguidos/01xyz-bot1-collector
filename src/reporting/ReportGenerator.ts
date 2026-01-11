import fs from "fs";
import path from "path";

interface Agg {
  market: string;
  avgFarmability: number;
  avgVolatility: number;
  avgSpread: number;
  avgLiquidity: number;
  snapshots: number;
}

export class ReportGenerator {
  constructor(private markets: string[]) {}

  generate(interval: "daily" | "weekly"): void {
    const window = interval === "daily" ? 24 * 60 * 60_000 : 7 * 24 * 60 * 60_000;
    const now = Date.now();
    const out: Agg[] = [];

    for (const m of this.markets) {
      const dir = path.join("data", "1h", m);
      if (!fs.existsSync(dir)) continue;
      const snaps = fs
        .readdirSync(dir)
        .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")))
        .filter((s) => s.timestamp >= now - window);
      if (snaps.length === 0) continue;
      const agg = {
        market: m,
        avgFarmability: snaps.reduce((a, s) => a + s.farmabilityScore, 0) / snaps.length,
        avgVolatility: snaps.reduce((a, s) => a + s.volatility, 0) / snaps.length,
        avgSpread: snaps.reduce((a, s) => a + s.spread, 0) / snaps.length,
        avgLiquidity: snaps.reduce((a, s) => a + s.liquidityScore, 0) / snaps.length,
        snapshots: snaps.length,
      };
      out.push(agg);
    }
    out.sort((a, b) => b.avgFarmability - a.avgFarmability);
    const reportDir = path.join("data", interval);
    fs.mkdirSync(reportDir, { recursive: true });
    fs.writeFileSync(
      path.join(reportDir, `${Date.now()}.json`),
      JSON.stringify({ generatedAt: Date.now(), interval, markets: out }, null, 2)
    );
    console.table(out.slice(0, 10).map((r) => ({ market: r.market, farmability: r.avgFarmability.toFixed(2) })));
  }
}