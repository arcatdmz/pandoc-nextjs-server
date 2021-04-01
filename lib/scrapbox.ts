import { extname } from "path";
import { convert } from "sb2md";

import { readFile, writeFile } from "fs";

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
  /** skip blank pages */
  skipBlankPages: boolean;
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
  const { filter, skipBlankPages } = options;
  let pages: IScrapboxPage[] = filter
    ? data.pages.filter((p) => filter.test(p.title))
    : data.pages;
  const mdBody = pages
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((p) => {
      const lines = processLines(p.lines, options);
      return lines || !skipBlankPages
        ? `## [${p.title}](https://scrapbox.io/${data.name}/${p.title})\n\n` +
            (lines
              ? (convert(lines.slice(1).join("\n")) as string)
                  .split("\n")
                  .map((line) =>
                    line.replace(
                      /\[([^\]]+)\]\(\.\/(.+)\.md\)/g,
                      `[$1](https://scrapbox.io/${data.name}/$2)`
                    )
                  )
                  .join("\n")
              : "\n")
        : null;
    })
    .filter((l) => !!l)
    .join("\n\n---\n\n\n");
  const md = `# ${data.displayName}\n${mdBody}\n---\n\ngenerated with [pandoc-nextjs-server](https://github.com/arcatdmz/pandoc-nextjs-server)`;

  // write Markdown and return the result
  return new Promise((r) => {
    const mdFilePath = `${src}.scrapbox.md`;
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
  let started = false,
    finished = false,
    numLines = 0;
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
    if (active) {
      numLines++;
    }
    res.push(active ? line : `<!-- ${line} -->`);
  }
  return numLines > 0 ? res : null;
}
