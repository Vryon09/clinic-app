import { ChildProcess, spawn } from "child_process";
import path from "path";
import { isDev } from "./util";

let backendProcess: ChildProcess | null = null;

export function startBackend() {
  const backendEntry = isDev()
    ? path.resolve(__dirname, "../../backend/dist/server.js")
    : path.join(process.resourcesPath, "backend", "dist", "server.js");

  const cwd = isDev()
    ? path.resolve(__dirname, "../../backend")
    : path.join(process.resourcesPath, "backend");

  const child = isDev()
    ? spawn("node", [backendEntry], {
        cwd,
        stdio: "inherit",
      })
    : spawn(process.execPath, [backendEntry], {
        cwd,
        stdio: "inherit",
        env: {
          ...process.env,
          ELECTRON_RUN_AS_NODE: "1",
        },
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
