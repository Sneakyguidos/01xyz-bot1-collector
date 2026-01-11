import { OrderbookStream } from "../sdk/websocket.js";
import { saveSnapshot } from "../storage/FileStore.js";
import { computeMetrics } from "../analytics/Metrics.js";

export class DataCollector {
  private streams = new Map<string, OrderbookStream>();

  constructor(private interval: "5m" | "1h") {}

  start(markets: string[]) {
    const delay = this.interval === "5m" ? 5 * 60_000 : 60 * 60_000;

    for (const m of markets) {
      const stream = new OrderbookStream(m);
      stream.once("update", (ob) => {
        const snap = computeMetrics(m, {}, ob);
        saveSnapshot(this.interval, m, snap);
      });
      stream.start();
      this.streams.set(m, stream);
    }

    // ogni tot minuti salva l’ultimo aggiornamento ricevuto
    setInterval(() => {
      for (const m of markets) {
        const stream = this.streams.get(m);
        if (stream) {
          stream.once("update", (ob) => {
            const snap = computeMetrics(m, {}, ob);
            saveSnapshot(this.interval, m, snap);
          });
        }
      }
    }, delay);
  }

  stop() {
    this.streams.forEach((s) => s.stop());
  }
}