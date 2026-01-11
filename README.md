![License](https://img.shields.io/github/license/Sneakyguidos/01xyz-bot1-collector)
# 01.xyz Data Bot (Bot 1)

TypeScript service that collects hourly & 5-minute snapshots of all perpetual markets on [01.xyz](https://01.xyz), calculates volatility, liquidity, spread and a **farmability score** (0-10) ideal for airdrop-volume farming.  
Daily & weekly rankings are auto-exported to local JSON.

## Features
- Zero wallet required – read-only mode  
- Uses official `@n1xyz/nord-ts` SDK (public client)  
- Stores data locally (`data/5m`, `data/1h`, `data/daily`, `data/weekly`)  
- CLI-friendly – runs under `pm2` or `systemd`  
- MIT licensed – open for contributions

## Quick start
```bash
git clone https://github.com/YOUR_USER/01xyz-data-bot.git
cd 01xyz-data-bot
npm install
npm run build
npm start
