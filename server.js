import http from "http";
import handler from "serve-handler";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.resolve(__dirname, "dist");

const server = http.createServer((req, res) => {
  return handler(req, res, {
    public: distPath,
    rewrites: [
      { source: "**", destination: "/index.html" },
    ],
  });
});

server.listen(8080, () => {
  console.log("✅ Serveur HTTP lancé sur http://localhost:8080");
});
