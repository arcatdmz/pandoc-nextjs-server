import { extname } from "path";
import { convert } from "sb2md";

import { pandoc } from "./pandoc";
import { readFile, writeFile, unlink } from "fs";

export interface IScrapboxResult {
  success: boolean;
  error?: string;
  path?: string;
}

export interface IScrapboxOptions {
  /** page name filter */
  filter: RegExp;
  /** section openings */
  openings: string[];
  /** section endings */
  endings: string[];
}

interface IScrapboxPage {
  title: string;
  created: string;
  updated: string;
  lines: string[];
}

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
  options: IScrapboxOptions
): Promise<IScrapboxResult> {
  const data = await parseScrapbox(src);
  if (!data) {
    return {
      success: false,
      error: "Scrapbox data parsing failed",
    };
  }

  // convert Scrapbox exported data into Markdown
  const { filter } = options;
  let pages: IScrapboxPage[] = filter
    ? data.pages.filter((p) => filter.test(p.title))
    : data.pages;
  const mdBody = pages
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((p) => {
      const lines = processLines(p.lines, options);
      return `## ${p.title}\n\n` + convert(lines.slice(1).join("\n"));
    })
    .join("\n---\n\n");
  const md = `# ${data.displayName}\n${mdBody}\n---\n\ngenerated with [pandoc-nextjs-server](https://github.com/arcatdmz/pandoc-nextjs-server)`;

  // write Markdown and return the result
  return new Promise((r) => {
    const mdFilePath = `${src}.md`;
    writeFile(mdFilePath, md, (err) => {
      if (err) {
        r({
          success: false,
          error: err.message,
        });
        return;
      }
      r({
        success: true,
        path: mdFilePath,
      });
    });
  });
}

function processLines(lines: string[], options: IScrapboxOptions) {
  const { openings, endings } = options;
  if (openings.length <= 0 && endings.length <= 0) {
    return lines.slice(0);
  }
  const res = [lines[0]];
  let started = false;
  let finished = false;
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    let active = false;
    if (openings.includes(line)) {
      started = true;
    } else if (started && !finished) {
      if (endings.includes(line)) {
        finished = true;
      } else {
        active = true;
      }
    }
    res.push(active ? line : `<!-- ${line} -->`);
  }
  return res;
}
