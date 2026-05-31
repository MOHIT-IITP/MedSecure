import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const monorepoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);

dotenv.config({ path: path.join(monorepoRoot, ".env.local") });
dotenv.config({ path: path.join(monorepoRoot, ".env") });
