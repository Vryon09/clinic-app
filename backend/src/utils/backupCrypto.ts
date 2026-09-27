import crypto from "crypto";
import fs from "fs";
import { pipeline } from "stream/promises";

export const MAGIC_HEADER = Buffer.from("CSYNCENC"); // 8 bytes
export const FLAG_SYSTEM_KEY = 0x01;
export const FLAG_CUSTOM_KEY = 0x02;

const DEFAULT_SECRET =
  process.env.BACKUP_ENCRYPTION_KEY ||
  process.env.JWT_SECRET ||
  "clinic_sync_backup_default_secret_key";

function deriveKey(secret: string, salt: Buffer): Buffer {
  return crypto.scryptSync(secret, salt, 32, { N: 16384, r: 8, p: 1 });
}

export function isEncryptedBackupFile(filePath: string): boolean {
  if (!fs.existsSync(filePath)) return false;
  const fd = fs.openSync(filePath, "r");
  try {
    const buffer = Buffer.alloc(8);
    const bytesRead = fs.readSync(fd, buffer, 0, 8, 0);
    return bytesRead === 8 && buffer.equals(MAGIC_HEADER);
  } finally {
    fs.closeSync(fd);
  }
}

export async function encryptBackupFile(
  inputFilePath: string,
  outputFilePath: string,
  passphrase?: string
): Promise<void> {
  const secret = passphrase && passphrase.trim().length > 0 ? passphrase.trim() : DEFAULT_SECRET;
  const flag = passphrase && passphrase.trim().length > 0 ? FLAG_CUSTOM_KEY : FLAG_SYSTEM_KEY;

  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = deriveKey(secret, salt);

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  // Encrypt stream to temporary file first so we can capture the auth tag
  const tempCipherPath = `${outputFilePath}.tmp_cipher`;
  const inputStream = fs.createReadStream(inputFilePath);
  const tempCipherOut = fs.createWriteStream(tempCipherPath);

  await pipeline(inputStream, cipher, tempCipherOut);

  const authTag = cipher.getAuthTag(); // 16 bytes

  // Header layout: [MAGIC (8B)][FLAG (1B)][SALT (16B)][IV (12B)][AUTH_TAG (16B)] = 53 bytes
  const header = Buffer.concat([
    MAGIC_HEADER,
    Buffer.from([flag]),
    salt,
    iv,
    authTag,
  ]);

  const finalOut = fs.createWriteStream(outputFilePath);
  finalOut.write(header);

  const cipherStream = fs.createReadStream(tempCipherPath);
  await pipeline(cipherStream, finalOut);

  if (fs.existsSync(tempCipherPath)) {
    fs.unlinkSync(tempCipherPath);
  }
}

export async function decryptBackupFile(
  inputFilePath: string,
  outputFilePath: string,
  passphrase?: string
): Promise<void> {
  const fileStats = fs.statSync(inputFilePath);
  if (fileStats.size < 53) {
    throw new Error("Invalid or corrupted backup file: file too small.");
  }

  const fd = fs.openSync(inputFilePath, "r");
  const headerBuf = Buffer.alloc(53);
  fs.readSync(fd, headerBuf, 0, 53, 0);
  fs.closeSync(fd);

  const magic = headerBuf.subarray(0, 8);
  if (!magic.equals(MAGIC_HEADER)) {
    throw new Error("File is not a valid encrypted ClinicSync backup.");
  }

  const flag = headerBuf.readUInt8(8);
  const salt = headerBuf.subarray(9, 25);
  const iv = headerBuf.subarray(25, 37);
  const authTag = headerBuf.subarray(37, 53);

  let secret = DEFAULT_SECRET;
  if (flag === FLAG_CUSTOM_KEY) {
    if (!passphrase || passphrase.trim().length === 0) {
      throw new Error("This backup is protected with a custom password. Password is required.");
    }
    secret = passphrase.trim();
  } else if (passphrase && passphrase.trim().length > 0) {
    secret = passphrase.trim();
  }

  const key = deriveKey(secret, salt);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  const cipherStream = fs.createReadStream(inputFilePath, { start: 53 });
  const outputStream = fs.createWriteStream(outputFilePath);

  try {
    await pipeline(cipherStream, decipher, outputStream);
  } catch (err: any) {
    if (fs.existsSync(outputFilePath)) {
      fs.unlinkSync(outputFilePath);
    }
    throw new Error(
      "Failed to decrypt backup: Incorrect password or corrupted backup archive."
    );
  }
}
