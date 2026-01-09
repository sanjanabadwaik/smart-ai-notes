import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);

  server.listen(env.port, () => {
    console.log(`server listening on port ${env.port} in ${env.nodeEnv} mode`);
  });

  const shutdown = (signal) => {
    console.log(`[server] received ${signal}, closing server...`);
    server.close(() => {
      console.log("[server] closed");
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
};

startServer().catch((err) => {
  console.error("[server] failed to start", err);
  process.exit(1);
});