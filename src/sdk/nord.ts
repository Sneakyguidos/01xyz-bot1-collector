const BASE = "https://zo-mainnet.n1.xyz";

export async function initNord() {
  return { base: BASE };
}

export async function getMarkets(_nord: any) {
  const res = await fetch(`${BASE}/info`);
  if (!res.ok) throw new Error(`info ${res.status}`);
  const json = await res.json();
  return json.markets;
}