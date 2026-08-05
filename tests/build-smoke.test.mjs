import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import test from "node:test";

const read = path => readFileSync(new URL(path, import.meta.url), "utf8");

test("production build contains a loadable entry and local assets", async () => {
  const html = read("../dist/index.html");
  assert.match(html, /id=["']root["']/);

  const references = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)]
    .map(match => match[1])
    .filter(value => !/^(?:https?:|data:|#)/.test(value));

  for (const reference of references) {
    const clean = reference.split(/[?#]/, 1)[0].replace(/^\//, "");
    assert.ok(existsSync(new URL(`../dist/${clean}`, import.meta.url)), `missing build asset: ${reference}`);
  }

  const assets = await readdir(new URL("../dist/assets/", import.meta.url));
  assert.ok(assets.some(name => name.endsWith(".js")), "missing JavaScript bundle");
});

test("critical product pages remain wired into the app", () => {
  const app = read("../src/App.jsx");
  for (const page of ["FeedPage", "AssistantPage", "ProjectPage", "MemberPage", "DesktopPage"]) {
    assert.match(app, new RegExp(page), `missing page integration: ${page}`);
  }
});

test("Super Agent provider and overlay remain wired into the application shell", () => {
  const app = read("../src/App.jsx");
  assert.match(app, /SuperAgentProvider/);
  assert.match(app, /SuperAgentOverlay/);
  assert.match(app, /SUPER_AGENT_ID/);
});
