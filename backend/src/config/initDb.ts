import fs from "fs";
import path from "path";
import { prisma } from "./prisma";

export async function initDatabase() {
  try {
    const possiblePaths = [
      path.resolve(__dirname, "../prisma/migrations"),
      path.resolve(__dirname, "../../src/prisma/migrations"),
      path.resolve(process.cwd(), "prisma/migrations"),
      path.resolve(process.cwd(), "src/prisma/migrations"),
    ];

    let migrationsPath = "";
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        migrationsPath = p;
        break;
      }
    }

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "_migration_meta" (
        "name" TEXT PRIMARY KEY,
        "appliedAt" DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const userTable: any[] = await prisma.$queryRawUnsafe(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='User';"
    );
    const hasExistingDb = userTable && userTable.length > 0;

    const applied: any[] = await prisma.$queryRawUnsafe(
      "SELECT name FROM _migration_meta;"
    );
    const appliedSet = new Set(applied.map((r: any) => r.name));

    if (migrationsPath) {
      const dirs = fs.readdirSync(migrationsPath).sort();

      // Legacy DB support: if tables exist but tracking table is empty, mark initial migration as applied
      if (hasExistingDb && appliedSet.size === 0 && dirs.length > 0) {
        const initDir = dirs[0];
        await prisma.$executeRawUnsafe(
          "INSERT OR IGNORE INTO _migration_meta (name) VALUES (?);",
          initDir
        );
        appliedSet.add(initDir);
      }

      for (const dir of dirs) {
        if (appliedSet.has(dir)) {
          continue;
        }

        const sqlFile = path.join(migrationsPath, dir, "migration.sql");
        if (fs.existsSync(sqlFile)) {
          console.log(`Applying migration: ${dir}...`);
          const migrationSql = fs.readFileSync(sqlFile, "utf-8");
          const statements = migrationSql
            .split(";")
            .map((s) => s.trim())
            .filter((s) => s.length > 0);

          for (const statement of statements) {
            try {
              await prisma.$executeRawUnsafe(statement);
            } catch (stmtErr: any) {
              const msg = stmtErr?.message || "";
              if (
                msg.includes("duplicate column name") ||
                msg.includes("already exists")
              ) {
                console.warn(
                  `Statement skipped (already applied): ${statement}`
                );
              } else {
                throw stmtErr;
              }
            }
          }

          await prisma.$executeRawUnsafe(
            "INSERT OR IGNORE INTO _migration_meta (name) VALUES (?);",
            dir
          );
          appliedSet.add(dir);
          console.log(`Migration ${dir} applied successfully.`);
        }
      }
    } else {
      console.warn("No migrations folder found.");
    }

    // Idempotent column safeguard for Patient.allergies
    const patientTable: any[] = await prisma.$queryRawUnsafe(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='Patient';"
    );
    if (patientTable && patientTable.length > 0) {
      const cols: any[] = await prisma.$queryRawUnsafe(
        "PRAGMA table_info('Patient');"
      );
      const hasAllergies = cols.some((c: any) => c.name === "allergies");
      if (!hasAllergies) {
        console.log("Applying missing column: Patient.allergies...");
        await prisma.$executeRawUnsafe(
          'ALTER TABLE "Patient" ADD COLUMN "allergies" TEXT;'
        );
        console.log("Patient.allergies column added successfully.");
      }
    }

    // Idempotent column safeguard for Clinic.logoPath
    const clinicTable: any[] = await prisma.$queryRawUnsafe(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='Clinic';"
    );
    if (clinicTable && clinicTable.length > 0) {
      const cols: any[] = await prisma.$queryRawUnsafe(
        "PRAGMA table_info('Clinic');"
      );
      const hasLogoPath = cols.some((c: any) => c.name === "logoPath");
      if (!hasLogoPath) {
        console.log("Applying missing column: Clinic.logoPath...");
        await prisma.$executeRawUnsafe(
          'ALTER TABLE "Clinic" ADD COLUMN "logoPath" TEXT;'
        );
        console.log("Clinic.logoPath column added successfully.");
      }
    }
  } catch (error) {
    console.error("Database initialization error:", error);
  }
}
