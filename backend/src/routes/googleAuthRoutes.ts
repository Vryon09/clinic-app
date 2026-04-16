import { Router } from "express";
import { oauth2Client } from "../config/google.config";
import { prisma } from "../config/prisma";

const router = Router();

// Step 6a: Redirect admin to Google consent screen
router.get("/", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline", // ensures we get a refresh token
    prompt: "consent", // forces Google to always return refresh token
    scope: ["https://www.googleapis.com/auth/drive.file"],
  });
  res.redirect(url);
});

// Step 6b: Google redirects back here with a code
router.get("/callback", async (req, res) => {
  const { code } = req.query;

  // Exchange code for tokens
  const { tokens } = await oauth2Client.getToken(code as string);

  // Save refresh token to DB (upsert so there's only ever one row)
  await prisma.googleToken.upsert({
    where: { id: 1 },
    update: { refreshToken: tokens.refresh_token! },
    create: { id: 1, refreshToken: tokens.refresh_token! },
  });

  res.send("Google Drive connected. You can close this tab.");
});

// GET /api/auth/google/status
router.get("/status", async (req, res) => {
  const token = await prisma.googleToken.findUnique({ where: { id: 1 } });

  res.json({ connected: !!token });
});

router.delete("/", async (req, res) => {
  await prisma.googleToken.deleteMany(); // or delete where id = 1
  res.json({ success: true });
});

export default router;
