import { DataCollector } from "./collector/DataCollector.js";
import { ReportGenerator } from "./reporting/ReportGenerator.js";
import { initNord, getMarkets } from "./sdk/nord.js";

async function main() {
  const nord = await initNord();
  const markets = await getMarkets(nord);

  const coll5  = new DataCollector(nord, "5m");
  const coll60 = new DataCollector(nord, "1h");
  const reporter = new ReportGenerator(markets.map((m: any) => m.symbol));

  coll5.start(); coll60.start();
  setInterval(() => reporter.generate("daily"),  24*60*60_000);
  setInterval(() => reporter.generate("weekly"), 7*24*60*60_000);

  console.log("01.xyz Data Bot running (pure REST)");
}
main();