import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { chromium } from "playwright";
import { defaultScenario, parseScenario } from "../src/scenario.mjs";
import { assess, selectedPoint } from "../src/localization.mjs";
import { blockedDemo, mapDemo } from "../src/demonstrations.mjs";
const previewPort = 17000 + Math.floor(Math.random() * 20000);
const url = process.env.BROWSER_URL || `http://127.0.0.1:${previewPort}`;
let server, browser;
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
try {
  if (!process.env.BROWSER_URL)
    server = spawn(
      process.execPath,
      [
        "node_modules/vite/bin/vite.js",
        "preview",
        "--host",
        "127.0.0.1",
        "--port",
        String(previewPort),
        "--strictPort",
      ],
      { stdio: "pipe", cwd: new URL("..", import.meta.url) },
    );
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(url)).ok) break;
    } catch {}
    if (i === 99) throw new Error("Preview server did not start.");
    await pause(100);
  }
  browser = await chromium.launch({
    headless: true,
    executablePath:
      process.env.CHROMIUM_EXECUTABLE ||
      (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
    args: [
      "--no-sandbox",
      "--enable-webgl",
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
    ],
  });
  const context = await browser.newContext({
    viewport: { width: 1600, height: 1100 },
    acceptDownloads: true,
  });
  const page = await context.newPage(),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const checkSigma = async (s, d) => {
    const p = selectedPoint(assess(s, { distances: [d] }), d);
    await page.waitForFunction(
      ({ v, distance }) =>
        document.getElementById("distanceReadout").textContent ===
          `${distance} m` &&
        v.every(
          (x, i) =>
            Math.abs(
              Number(document.getElementById(`sigma${i}`).dataset.value) - x,
            ) < 1e-7,
        ),
      { v: p.selectedSigma, distance: d },
    );
    assert.equal(await page.locator("#distanceReadout").innerText(), `${d} m`);
  };
  // Button state changes immediately; the caption updates on the queued render.
  const checkView = async (view) => {
    await page.waitForFunction(
      ({ view, label }) =>
        document
          .getElementById(`${view}View`)
          .getAttribute("aria-pressed") === "true" &&
        document.getElementById("viewLabel").textContent === label,
      {
        view,
        label: view === "local" ? "LOCAL NAVIGATION" : "GLOBAL POSITION",
      },
    );
  };
  const set = async (id, value) => {
    await page.locator("#" + id).evaluate((e, value) => {
      e.value = String(value);
      e.dispatchEvent(new Event("input", { bubbles: true }));
    }, value);
  };
  const top = () => page.locator("main").evaluate((e) => (e.scrollTop = 0));
  mkdirSync("artifacts", { recursive: true });
  await page.goto(url);
  await checkSigma(defaultScenario(), 330);
  assert.equal(await page.locator("#viewport canvas").count(), 1);
  assert.equal(await page.locator("#viewportError").isVisible(), false);
  await page.screenshot({ path: "artifacts/desktop-baseline.png" });
  const s = defaultScenario();
  s.ravineLength_m = 500;
  s.climb_m = 120;
  await set("ravineLength_m", 500);
  await set("climb_m", 120);
  await checkSigma(s, 330);
  assert.match(await page.locator("#routeSummary").innerText(), /650 m/);
  // All three views and readouts use the same exact requested distance.
  await set("routeCursor", 423);
  await checkSigma(s, 423);
  assert.match(await page.locator("#contributionContext").innerText(), /423 m/);
  await page.locator("#localView").click();
  await checkView("local");
  await checkSigma(s, 423);
  await page.locator("#globalView").click();
  await checkView("global");
  await page.locator("#reset").click();
  await checkSigma(defaultScenario(), 330);
  await page
    .locator("label.method-toggle")
    .filter({ hasText: "UWB range" })
    .click();
  s.uwbEnabled = true;
  const both = { ...defaultScenario(), uwbEnabled: true, mapEnabled: true };
  await page
    .locator("label.method-toggle")
    .filter({ hasText: "Orbital map matching" })
    .click();
  await checkSigma(both, 330);
  assert.match(await page.locator("#comparisonRows").innerText(), /UWB only/);
  assert.match(await page.locator("#comparisonRows").innerText(), /Map only/);
  // Plot interaction controls the single route cursor.
  const rect = await page.locator("#plot1").boundingBox();
  await page.mouse.click(rect.x + rect.width * 0.6, rect.y + rect.height * 0.5);
  const clicked = Number(await page.locator("#routeCursor").inputValue());
  assert.ok(clicked > 0 && clicked < 550);
  await checkSigma(both, clicked);
  await page.locator("#blockedDemo").click();
  await checkSigma(blockedDemo(), 400);
  assert.match(await page.locator("#linkStatus").innerText(), /Blocked/);
  await page.locator(".event").filter({ hasText: "UWB · 450 m" }).click();
  await checkSigma(blockedDemo(), 450);
  await top();
  await page.screenshot({ path: "artifacts/desktop-blocked-uwb.png" });
  await page.locator("#scenarioName").fill("Browser round trip");
  const downloadPromise = page.waitForEvent("download");
  await page.locator("#save").click();
  const download = await downloadPromise;
  await download.saveAs("artifacts/round-trip.json");
  const saved = parseScenario(
    readFileSync("artifacts/round-trip.json", "utf8"),
  );
  assert.equal(saved.name, "Browser round trip");
  await page.reload();
  await checkSigma(saved, 330);
  assert.equal(
    await page.locator("#scenarioName").inputValue(),
    "Browser round trip",
  );
  await page.locator("#reset").click();
  await page.locator("#loadFile").setInputFiles("artifacts/round-trip.json");
  await checkSigma(saved, 330);
  await page.locator("#mapDemo").click();
  await checkSigma(mapDemo(), 550);
  assert.ok(
    Number(await page.locator("#sigma0").getAttribute("data-value")) > 4.999,
  );
  await top();
  await page.screenshot({ path: "artifacts/desktop-shared-map-limit.png" });
  // Missing essential inputs suppress stale results and prevent saving.
  await page.locator("#motionH_m").fill("");
  await page.waitForSelector("#validation:not([hidden])");
  assert.match(await page.locator("#validation").innerText(), /TBD/);
  assert.equal(await page.locator("#assessment").isVisible(), false);
  assert.equal(await page.locator("#save").isDisabled(), true);
  await page.locator("#motionH_m").fill("0");
  await checkSigma(mapDemo(), 550);
  // Unavailable map observations reduce exactly to the baseline.
  await page.locator("#mapAvailable").uncheck();
  await checkSigma({ ...mapDemo(), mapAvailable: false }, 550);
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
  });
  mobile.on("pageerror", (e) => errors.push(e.message));
  await mobile.goto(url);
  await mobile.waitForSelector("#sigma0[data-value]");
  assert.ok(
    await mobile.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Mobile page must not overflow horizontally",
  );
  await mobile.locator("#routeCursor").scrollIntoViewIfNeeded();
  await mobile.screenshot({ path: "artifacts/mobile-route.png" });
  await mobile.close();
  assert.deepEqual(errors, []);
  console.log(
    "Browser workflow passed: inputs, linked cursor/views/plots, both methods, blocked link, map limit, save/reload/import, TBD state, unavailable map, mobile layout, and no page errors.",
  );
} finally {
  await browser?.close();
  server?.kill("SIGTERM");
}
