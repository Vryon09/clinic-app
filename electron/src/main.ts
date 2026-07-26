import { app, BrowserWindow } from "electron";
import waitOn from "wait-on";
import { startBackend, stopBackend } from "./backend";
import { isDev } from "./util";
import path from "path";

console.log("isPackaged:", app.isPackaged);
console.log("isDev:", isDev());
console.log("resourcesPath:", process.resourcesPath);

async function createWindow() {
  startBackend();

  await waitOn({
    resources: ["http://localhost:3000/health"],
    timeout: 300000,
  });

  const window = new BrowserWindow({
    width: 1400,
    height: 900,
  });

  if (isDev()) {
    await window.loadURL("http://localhost:5123");
  } else {
    await window.loadFile(
      path.join(process.resourcesPath, "frontend", "index.html"),
    );
  }
}

app.whenReady().then(createWindow);

app.on("before-quit", () => {
  stopBackend();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
