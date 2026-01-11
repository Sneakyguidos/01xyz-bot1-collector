import fs from "fs";
import path from "path";
export function saveSnapshot(interval, market, data) {
    const dir = path.join("data", interval, market);
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `${data.timestamp}.json`);
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}
