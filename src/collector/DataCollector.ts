import { getMarkets, getOrderbook } from "../sdk/nord.js";
import { saveSnapshot } from "../storage/FileStore.js";
import { computeMetrics } from "../analytics/Metrics.js";

export class DataCollector {
  constructor(private nord: any, private interval: "5m" | "1h") {}

  start() {
    const delay = this.interval === "5m" ? 5 * 60_000 : 60 * 60_000;
    setInterval(async () => {
      const markets = await getMarkets(this.nord);
      for (const m of markets) {
        const symbolPerp = m.symbol.endsWith('-PERP') ? m.symbol : `${m.symbol}-PERP`;
        try {
          const ob   = await getOrderbook(this.nord, symbolPerp);
          const snap = computeMetrics(m.symbol, m, ob);
          saveSnapshot(this.interval, m.symbol, snap);
        } catch (e) {
          console.error(symbolPerp, e);
        }
      }
    }, delay);
  }
}