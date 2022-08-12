import mkcert from "vite-plugin-mkcert";
import fs from "fs";

const a = mkcert({ hosts: ["localhost"] });
const b = await a.config({ server: { https: true } });

// buffer
const { server: { https: { key, cert } } } = b;

// write to file
fs.writeFileSync("dist/key.pem", key);
fs.writeFileSync("dist/cert.pem", cert);

// npx http-server -p 3000 -S -C cert.pem -K key.pem --gzip -f https://127.0.0.1:3000/