import { app, BrowserWindow } from "electron";
import waitOn from "wait-on";
import { startBackend, stopBackend } from "./backend";
import { isDev } from "./util";
import path from "path";

console.log("isPackaged:", app.isPackaged);
console.log("isDev:", isDev());
console.log("resourcesPath:", process.resourcesPath);

let mainWindow: BrowserWindow | null = null;
let backendStarted = false;

async function createWindow() {
  if (!backendStarted) {
    startBackend();
    backendStarted = true;

    await waitOn({
      resources: ["http://localhost:3000/health"],
      timeout: 300000,
    });
  }

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
  });

  if (isDev()) {
    await mainWindow.loadURL("http://localhost:5123");
  } else {
    await mainWindow.loadFile(
      path.join(process.resourcesPath, "frontend", "index.html"),
    );
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("before-quit", () => {
  stopBackend();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
