import fs from "fs";
import path from "path";
import { prisma } from "./prisma";

export async function initDatabase() {
  try {
    const tables: any[] = await prisma.$queryRawUnsafe(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='User';"
    );

    if (tables && tables.length > 0) {
      return;
    }

    console.log("Initializing database tables...");

    const possiblePaths = [
      path.resolve(__dirname, "../prisma/migrations"),
      path.resolve(__dirname, "../../src/prisma/migrations"),
      path.resolve(process.cwd(), "prisma/migrations"),
      path.resolve(process.cwd(), "src/prisma/migrations"),
    ];

    let migrationSql = "";

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        const dirs = fs.readdirSync(p);
        for (const dir of dirs) {
          const sqlFile = path.join(p, dir, "migration.sql");
          if (fs.existsSync(sqlFile)) {
            migrationSql += fs.readFileSync(sqlFile, "utf-8") + "\n";
          }
        }
        if (migrationSql) break;
      }
    }

    if (migrationSql) {
      const statements = migrationSql
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const statement of statements) {
        await prisma.$executeRawUnsafe(statement);
      }
      console.log("Database tables initialized successfully.");
    } else {
      console.warn("No migration.sql found to initialize database.");
    }
  } catch (error) {
    console.error("Database initialization error:", error);
  }
}
