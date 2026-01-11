import { Keypair } from "@solana/web3.js";
import fs from "fs";

const kp = Keypair.generate();
fs.writeFileSync("dummy.json", `[${kp.secretKey.toString()}]`);
console.log("Dummy pubblica:", kp.publicKey.toBase58());