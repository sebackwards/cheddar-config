import "module-alias/register";
import express, { Request, Response, NextFunction } from "express";
import usersRouter from "./routes/users";
import preferencesRouter from "./routes/preferences";
import workspaceRouter from "./routes/workspace";

// Lightweight body parser for JSON requests.
// Reads the raw request stream and parses it with JSON.parse.
function parseJsonBody(req: Request, res: Response, next: NextFunction): void {
  if (!req.headers["content-type"]?.startsWith("application/json")) {
    next();
    return;
  }

  let raw = "";
  req.on("data", (chunk: Buffer) => {
    raw += chunk.toString();
  });
  req.on("end", () => {
    try {
      req.body = JSON.parse(raw);
    } catch {
      req.body = {};
    }
    next();
  });
}

export function createApp(): express.Application {
  const app = express();

  app.use(parseJsonBody);

  app.use("/users", usersRouter);
  app.use("/preferences", preferencesRouter);
  app.use("/workspace", workspaceRouter);

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  return app;
}

if (require.main === module) {
  const app = createApp();
  const PORT = process.env.PORT ?? 3000;
  app.listen(PORT, () => {
    console.log(`cheddar-config listening on port ${PORT}`);
  });
}