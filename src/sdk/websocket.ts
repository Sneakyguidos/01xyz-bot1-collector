import { WebSocket } from "ws";
import { EventEmitter } from "events";

const BASE = "wss://zo-mainnet.n1.xyz";

export class OrderbookStream extends EventEmitter {
  private socket: WebSocket | null = null;
  private symbol: string;

  constructor(symbol: string) {
    super();
    this.symbol = symbol;
  }

  start() {
    const url = `${BASE}/ws/orderbook@${this.symbol}`;
    this.socket = new WebSocket(url);
    this.socket.on("open", () => console.log(`WS orderbook ${this.symbol} open`));

    // al primo aggiornamento salviamo e lasciamo aperta la connessione
    this.socket.once("message", (data) => {
      const ob = JSON.parse(data.toString());
      this.emit("update", ob);
      console.log(`Orderbook ${this.symbol} received`, ob.bids?.length, ob.asks?.length);
    });

    this.socket.on("close", () => console.log(`WS orderbook ${this.symbol} closed`));
    this.socket.on("error", (e) => console.error(`WS ${this.symbol} error`, e));
  }

  stop() {
    this.socket?.close();
  }
}