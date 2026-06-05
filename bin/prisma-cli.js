#!/usr/bin/env node
/**
 * Run the project-local Prisma CLI (v6).
 * Never use `npx prisma` on deploy — it can install Prisma 7 and break the schema.
 */
const { spawnSync } = require("node:child_process");
const { existsSync } = require("node:fs");
const { join } = require("node:path");

const root = join(__dirname, "..");
const cli = join(root, "node_modules", "prisma", "build", "index.js");

if (!existsSync(cli)) {
  console.error(
    "[prisma] Local CLI not found at node_modules/prisma.\n" +
      "[prisma] Run: npm ci\n" +
      "[prisma] Do NOT use npx prisma — Render/Vercel may install Prisma 7.",
  );
  process.exit(1);
}

const args = process.argv.slice(2);
const result = spawnSync(process.execPath, [cli, ...args], {
  stdio: "inherit",
  cwd: root,
  env: process.env,
});

process.exit(result.status ?? 1);
