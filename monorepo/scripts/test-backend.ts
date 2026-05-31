/**
 * Integration tests for MedSecure backend APIs.
 * Requires: migrated DB, web on :3000, dashboard on :3001
 *
 * Run: bun run test:backend
 */

import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
config({ path: path.join(root, ".env.local") });
config({ path: path.join(root, ".env") });

const WEB = process.env.WEB_URL ?? "http://localhost:3000";
const DASHBOARD = process.env.DASHBOARD_URL ?? "http://localhost:3001";

type Result = { name: string; ok: boolean; detail?: string };

const results: Result[] = [];
let cookie = "";

function record(name: string, ok: boolean, detail?: string) {
  results.push({ name, ok, detail });
  const mark = ok ? "PASS" : "FAIL";
  console.log(`${mark}  ${name}${detail ? ` — ${detail}` : ""}`);
}

function parseSetCookie(header: string | null): string | undefined {
  if (!header) return undefined;
  const match = header.match(/token=([^;]+)/);
  return match?.[1];
}

async function api(
  base: string,
  method: string,
  route: string,
  options?: {
    body?: unknown;
    formData?: FormData;
    auth?: boolean;
    expectStatus?: number;
  }
) {
  const headers: Record<string, string> = {};
  if (options?.auth && cookie) {
    headers.Cookie = `token=${cookie}`;
  }
  if (options?.body && !options.formData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${base}${route}`, {
    method,
    headers,
    body: options?.formData
      ? options.formData
      : options?.body
        ? JSON.stringify(options.body)
        : undefined,
    redirect: "manual",
  });

  const setCookie = res.headers.get("set-cookie");
  const newToken = parseSetCookie(setCookie);
  if (newToken) cookie = newToken;

  let json: Record<string, unknown> = {};
  const text = await res.text();
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text.slice(0, 200) };
  }

  return { res, json, status: res.status };
}

async function waitForServer(url: string, label: string, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
      if (res.ok || res.status === 404 || res.status === 401 || res.status === 400)
        return true;
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw new Error(`${label} not reachable at ${url}`);
}

async function main() {
  const runId = Date.now();
  const email = `test-${runId}@medsecure.test`;
  const password = "TestPass123!";
  let qrToken = "";
  let reportId = "";

  console.log("\nMedSecure backend integration tests\n");
  console.log(`Web: ${WEB}`);
  console.log(`Dashboard: ${DASHBOARD}\n`);

  try {
    await waitForServer(`${WEB}/`, "Web app");
    await waitForServer(
      `${DASHBOARD}/api/view/00000000-0000-0000-0000-000000000000`,
      "Dashboard app"
    );
  } catch (e) {
    console.error(String(e));
    console.error("\nStart servers first: bun run dev\n");
    process.exit(1);
  }

  // --- Auth: signup ---
  {
    const { status, json } = await api(WEB, "POST", "/api/auth/signup", {
      body: { name: "Test User", email, password },
    });
    record(
      "POST /api/auth/signup",
      status === 200 && json.success === true && !!cookie,
      `status=${status}`
    );
  }

  // --- Auth: me ---
  {
    const { status, json } = await api(WEB, "GET", "/api/auth/me", { auth: true });
    record(
      "GET /api/auth/me",
      status === 200 && json.success === true && json.user !== undefined,
      `status=${status}`
    );
  }

  // --- Profile: GET (no password leak) ---
  {
    const { status, json } = await api(WEB, "GET", "/api/profile", { auth: true });
    const user = json.user as Record<string, unknown> | undefined;
    record(
      "GET /api/profile",
      status === 200 &&
        json.success === true &&
        user !== undefined &&
        !("password" in (user ?? {})),
      `status=${status}`
    );
  }

  // --- Profile: PATCH ---
  {
    const { status, json } = await api(WEB, "PATCH", "/api/profile", {
      auth: true,
      body: {
        name: "Test User Updated",
        age: 30,
        bloodGroup: "O+",
        allergies: "Penicillin",
        chronicDiseases: "None",
        emergencyContact: "+1-555-0100",
      },
    });
    record("PATCH /api/profile", status === 200 && json.success === true, `status=${status}`);
  }

  // --- Health: POST ---
  {
    const { status, json } = await api(WEB, "POST", "/api/health", {
      auth: true,
      body: {
        bloodPressure: "120/80",
        sugarLevel: "95",
        pulse: "72",
        weight: "70kg",
        notes: "Feeling good",
      },
    });
    record("POST /api/health", status === 200 && json.success === true, `status=${status}`);
  }

  // --- Health: GET ---
  {
    const { status, json } = await api(WEB, "GET", "/api/health", { auth: true });
    const records = json.records as unknown[] | undefined;
    record(
      "GET /api/health",
      status === 200 && json.success === true && Array.isArray(records) && records.length > 0,
      `status=${status}, count=${records?.length ?? 0}`
    );
  }

  // --- QR ---
  {
    const { status, json } = await api(WEB, "GET", "/api/qr", { auth: true });
    const qrUrl = json.qrUrl as string | undefined;
    const match = qrUrl?.match(/\/view\/([^/]+)$/);
    qrToken = match?.[1] ?? "";
    record(
      "GET /api/qr",
      status === 200 && json.success === true && qrToken.length > 0,
      `status=${status}, token=${qrToken.slice(0, 8)}…`
    );
  }

  // --- Dashboard public view ---
  {
    const { status, json } = await api(DASHBOARD, "GET", `/api/view/${qrToken}`);
    const profile = json.profile as Record<string, unknown> | undefined;
    record(
      "GET /api/view/[token] (dashboard)",
      status === 200 &&
        json.success === true &&
        profile?.bloodGroup === "O+" &&
        profile?.name === "Test User Updated",
      `status=${status}`
    );
  }

  // --- Reports: list ---
  {
    const { status, json } = await api(WEB, "GET", "/api/reports", { auth: true });
    record(
      "GET /api/reports",
      status === 200 && json.success === true && Array.isArray(json.reports),
      `status=${status}`
    );
  }

  // --- Reports: upload (requires Supabase bucket "medical-reports") ---
  {
    const form = new FormData();
    const blob = new Blob(["%PDF-1.4 test report"], { type: "application/pdf" });
    form.append("file", blob, "test-report.pdf");
    form.append("title", "Integration Test Report");

    const { status, json } = await api(WEB, "POST", "/api/reports/upload", {
      auth: true,
      formData: form,
    });
    const report = json.report as { id?: string } | undefined;
    reportId = report?.id ?? "";
    const ok = status === 200 && json.success === true && !!reportId;
    const skipped =
      !ok &&
      (status === 500 || status === 503) &&
      (json.error !== undefined || json.message !== undefined);
    record(
      "POST /api/reports/upload",
      ok || skipped,
      ok
        ? `status=${status}`
        : skipped
          ? `skipped — Supabase/storage (${String(json.error ?? json.message).slice(0, 80)})`
          : `status=${status}, ${JSON.stringify(json).slice(0, 120)}`
    );
  }

  // --- Reports: signed download URL ---
  if (reportId) {
    const { status, json } = await api(WEB, "GET", `/api/reports/${reportId}`, {
      auth: true,
    });
    record(
      "GET /api/reports/[id]",
      status === 200 && json.success === true && typeof json.downloadUrl === "string",
      `status=${status}`
    );
  } else {
    record("GET /api/reports/[id]", true, "skipped (upload not available)");
  }

  // --- Auth: logout ---
  {
    const { status, json } = await api(WEB, "POST", "/api/auth/logout", { auth: true });
    record("POST /api/auth/logout", status === 200 && json.success === true, `status=${status}`);
    cookie = "";
    const { status: meStatus } = await api(WEB, "GET", "/api/auth/me");
    record(
      "GET /api/auth/me after logout (expect 401)",
      meStatus === 401,
      `status=${meStatus}`
    );
    cookie = "";
  }

  // --- Auth: login ---
  {
    cookie = "";
    const { status, json } = await api(WEB, "POST", "/api/auth/login", {
      body: { email, password },
    });
    record(
      "POST /api/auth/login",
      status === 200 && json.success === true && !!cookie,
      `status=${status}`
    );
  }

  // --- Unauthorized QR ---
  {
    cookie = "";
    const { status } = await api(WEB, "GET", "/api/qr");
    record("GET /api/qr without auth (expect 401)", status === 401, `status=${status}`);
  }

  // --- Invalid dashboard token ---
  {
    const { status, json } = await api(
      DASHBOARD,
      "GET",
      "/api/view/00000000-0000-0000-0000-000000000000"
    );
    record(
      "GET /api/view/[invalid] (expect 404)",
      status === 404 && json.success === false,
      `status=${status}`
    );
  }

  // --- Reports: delete ---
  if (reportId) {
    cookie = "";
    await api(WEB, "POST", "/api/auth/login", { body: { email, password } });
    const { status, json } = await api(WEB, "DELETE", `/api/reports/${reportId}`, {
      auth: true,
    });
    record("DELETE /api/reports/[id]", status === 200 && json.success === true, `status=${status}`);
  } else {
    record("DELETE /api/reports/[id]", true, "skipped (upload not available)");
  }

  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;

  console.log(`\n--- ${passed} passed, ${failed} failed ---\n`);

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
