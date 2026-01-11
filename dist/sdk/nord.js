const BASE = "https://zo-mainnet.n1.xyz";
export async function initNord() {
    // dummy resolved value so caller can keep `await initNord()` unchanged
    return { base: BASE };
}
export async function getMarkets(_nord) {
    const res = await fetch(`${BASE}/info`);
    if (!res.ok)
        throw new Error(`info ${res.status}`);
    const json = await res.json();
    return json.markets; // ← array of market objects
}
export async function getOrderbook(_nord, symbol) {
    const res = await fetch(`${BASE}/orderbook/${symbol}`);
    if (!res.ok)
        throw new Error(`orderbook ${res.status}`);
    return res.json(); // ← { bids: [], asks: [] }
}
