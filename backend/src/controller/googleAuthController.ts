import { Request, Response } from "express";
import { oauth2Client } from "../config/google.config";
import { prisma } from "../config/prisma";

export async function initGoogleDriveAuth(req: Request, res: Response) {
  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["https://www.googleapis.com/auth/drive.file"],
    });
    res.redirect(url);
  } catch (error) {
    res.status(400).json({ error: "Internal server error" });
  }
}

export async function googleAuthCallback(req: Request, res: Response) {
  try {
    const { code } = req.query;

    const { tokens } = await oauth2Client.getToken(code as string);

    // Save refresh token to DB (upsert so there's only ever one row)
    await prisma.googleToken.upsert({
      where: { id: 1 },
      update: { refreshToken: tokens.refresh_token! },
      create: { id: 1, refreshToken: tokens.refresh_token! },
    });

    res.send(`
  <html>
    <body>
      <script>
        window.opener.postMessage(
          { type: "GOOGLE_AUTH_SUCCESS" },
          "http://localhost:5123" 
        );
        window.close();
      </script>
      <p>Connecting Google Drive...</p>
    </body>
  </html>
`);
  } catch (error) {
    res.status(400).json({ error: "Internal server error" });
  }
}

export async function getGoogleAuthStatus(req: Request, res: Response) {
  try {
    const token = await prisma.googleToken.findUnique({ where: { id: 1 } });

    res.json({ connected: !!token });
  } catch (error) {
    res.status(400).json({ error: "Internal server error" });
  }
}

export async function deleteGoogleAuthToken(req: Request, res: Response) {
  try {
    await prisma.googleToken.deleteMany();
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: "Internal server error" });
  }
}
