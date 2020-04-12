import { extname } from "path";

import { pandoc, IPandocResult } from "./pandoc";
import { readFile } from "fs";

export async function parseScrapbox(src: string): Promise<any> {
  const ext = extname(src).toLowerCase();
  if (ext !== ".json") {
    return null;
  }
  return new Promise((r) => {
    readFile(src, { encoding: "utf8" }, (err, data) => {
      if (err) {
        r(null);
        return;
      }
      r(parseScrapboxData(data));
    });
  });
}

function parseScrapboxData(data: string) {
  try {
    const json = JSON.parse(data);
    return json.name &&
      json.displayName &&
      json.exported &&
      Array.isArray(json.pages)
      ? json
      : null;
  } catch (e) {
    return null;
  }
}

export async function scrapbox(
  src: string,
  dest: string,
  format: string,
  args: string[] = []
): Promise<IPandocResult> {
  return pandoc(src, dest, format, args);
}
