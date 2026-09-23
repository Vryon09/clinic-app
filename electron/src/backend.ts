import { ChildProcess, spawn } from "child_process";
import path from "path";
import fs from "fs";
import { app } from "electron";
import { isDev } from "./util";

let backendProcess: ChildProcess | null = null;

export function startBackend() {
  const backendEntry = isDev()
    ? path.resolve(__dirname, "../../backend/dist/server.js")
    : path.join(process.resourcesPath, "backend", "dist", "server.js");

  const cwd = isDev()
    ? path.resolve(__dirname, "../../backend")
    : path.join(process.resourcesPath, "backend");

  let env: NodeJS.ProcessEnv = {
    ...process.env,
  };

  if (!isDev()) {
    const userDataPath = app.getPath("userData");
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }
    const dbPath = path.join(userDataPath, "clinic.db");
    env = {
      ...env,
      ELECTRON_RUN_AS_NODE: "1",
      PORT: "3000",
      DATABASE_URL: `file:${dbPath}`,
    };
  }

  const child = isDev()
    ? spawn("node", [backendEntry], {
        cwd,
        stdio: "inherit",
        env,
      })
    : spawn(process.execPath, [backendEntry], {
        cwd,
        stdio: "inherit",
        env,
      });

  backendProcess = child;

  backendProcess.on("error", (err) => {
    console.error("Failed to start backend:", err);
  });

  backendProcess.on("exit", (code) => {
    console.log("Backend exited:", code);
  });
}

export function stopBackend() {
  backendProcess?.kill();
}
