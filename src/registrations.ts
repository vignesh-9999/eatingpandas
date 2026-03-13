import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export interface RegistrationRecord {
  id: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface RegistrationStore {
  save(email: string, password: string): Promise<RegistrationRecord>;
}

async function readRegistrations(filePath: string): Promise<RegistrationRecord[]> {
  try {
    const contents = await readFile(filePath, "utf8");
    if (!contents.trim()) {
      return [];
    }

    return JSON.parse(contents) as RegistrationRecord[];
  } catch (error) {
    const fileError = error as NodeJS.ErrnoException;
    if (fileError.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

export function createRegistrationStore(filePath = path.join(process.cwd(), "data", "registrations.json")): RegistrationStore {
  return {
    async save(email: string, password: string) {
      const existing = await readRegistrations(filePath);
      const record: RegistrationRecord = {
        id: randomUUID(),
        email,
        password,
        createdAt: new Date().toISOString()
      };

      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(filePath, JSON.stringify([...existing, record], null, 2), "utf8");

      return record;
    }
  };
}
