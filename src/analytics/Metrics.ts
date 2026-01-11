export interface MarketSnapshot {
  market: string;
  timestamp: number;
  markPrice: number;
  indexPrice: number;
  openInterest: number;
  volume24h: number;
  bids: number;
  asks: number;
  spread: number;
  volatility: number;
  liquidityScore: number;
  farmabilityScore: number;
}

export function computeMetrics(
  market: string,
  data: any,
  orderbook: any,
  prev?: MarketSnapshot
): MarketSnapshot {
  const spread =
    (orderbook.asks[0].price - orderbook.bids[0].price) /
    orderbook.bids[0].price;

  const volatility = prev
    ? Math.abs(data.markPrice - prev.markPrice) / prev.markPrice
    : 0;

  const liquidity =
    orderbook.bids.slice(0, 10).reduce((a: number, b: any) => a + b.size, 0) +
    orderbook.asks.slice(0, 10).reduce((a: number, b: any) => a + b.size, 0);

  const liquidityScore = Math.min(liquidity / 1_000_000, 1);

  const farmabilityScore = Math.min(
    10,
    liquidityScore * 4 +
      Math.min(volatility * 50, 3) +
      Math.min(data.volume24h / 10_000_000, 3)
  );

  return {
    market,
    timestamp: Date.now(),
    markPrice: data.markPrice,
    indexPrice: data.indexPrice,
    openInterest: data.openInterest,
    volume24h: data.volume24h,
    bids: orderbook.bids.length,
    asks: orderbook.asks.length,
    spread,
    volatility,
    liquidityScore,
    farmabilityScore,
  };
}