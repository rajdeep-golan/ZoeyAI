// Uploads data/generated-members.json as one bundle document: members/generated.json
import { put } from "@vercel/blob";
import { readFileSync } from "node:fs";
const body = readFileSync(new URL("../data/generated-members.json", import.meta.url), "utf8");
await put("members/generated.json", body, { access: "private", contentType: "application/json", addRandomSuffix: false, allowOverwrite: true });
console.log("uploaded", JSON.parse(body).length, "members");
