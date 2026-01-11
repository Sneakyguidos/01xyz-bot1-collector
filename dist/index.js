import { DataCollector } from "./collector/DataCollector.js";
import { ReportGenerator } from "./reporting/ReportGenerator.js";
import { initNord, getMarkets } from "./sdk/nord.js";
async function main() {
    const nord = await initNord();
    const markets = await getMarkets(nord);
    const coll5 = new DataCollector("5m");
    const coll60 = new DataCollector("1h");
    const reporter = new ReportGenerator(markets.map((m) => m.symbol));
    coll5.start(markets.map((m) => m.symbol));
    coll60.start(markets.map((m) => m.symbol));
    setInterval(() => reporter.generate("daily"), 24 * 60 * 60_000);
    setInterval(() => reporter.generate("weekly"), 7 * 24 * 60 * 60_000);
    console.log("01.xyz Data Bot running (WebSocket orderbook)");
}
main();
