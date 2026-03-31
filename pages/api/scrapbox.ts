import { copyFileSync, readFileSync, writeFileSync } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { resolve } from "path";

import appConfig from "../../lib/config";
import { pandoc } from "../../lib/pandoc";
import { readMetaFile } from "../../lib/readMetaFile";
import { scrapbox } from "../../lib/scrapbox";
import { IStatus, writeMetaFile } from "../../lib/writeMetaFile";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1kb",
    },
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // get file name
  const { file } = req.body;

  // read current status
  let status: IStatus;
  try {
    status = await readMetaFile(file as string);
  } catch (e) {
    // something wrong happened
    res.json({
      success: false,
      error: e.message,
    });
    return;
  }
  if (!status.scrapbox) {
    res.json({
      success: false,
      error: "Scrapbox data not found",
    });
    return;
  }

  // start conversion
  const path = resolve(appConfig.uploadDir, status.name);
  const format = appConfig.formats.find((f) => f.value === status.format);
  const result = await scrapbox(path, appConfig.scrapbox.options);

  // clean up source file
  // unlink(path, (_err) => {
  //   // do nothing on clean up error
  // });

  // start conversion
  if (result.success) {
    status.scrapbox = false;

    // update meta file
    await writeMetaFile(status);

    // proceed to pandoc conversion
    const src = result.path;

    if (format.value === "markdown") {
      copyFileSync(src, `${path}.${format.ext || format.value}`);
      status.success = true;
      status.error = null;
      status.result = null;

      // update meta file
      writeMetaFile(status);
    } else {
      const dest = `${path}.${format.ext || format.value}`;
      const res = await pandoc(src, dest, format.value, [
        "--from",
        "markdown-yaml_metadata_block",
      ]);
      status.success = res.success;
      status.error = res.error;
      status.result = res.result;

      if (format.value === "html") {
        const text = readFileSync(dest, "utf8");
        writeFileSync(
          dest,
          text
            .split(/\r?\n/g)
            .map((line) =>
              line === "<hr />"
                ? '<hr class="page-divider" />'
                : line ===
                  '<p><a href="https://scrapbox.io/arcatdmz/hr.icon">hr.icon</a><br />'
                ? '<hr class="inpage-divider" /><p>'
                : line ===
                  '<a href="https://scrapbox.io/arcatdmz/hr.icon">hr.icon</a></p>'
                ? '</p><hr class="inpage-divider" />'
                : line ===
                  '<a href="https://scrapbox.io/arcatdmz/hr.icon">hr.icon</a><br />'
                ? '<hr class="inpage-divider" />'
                : line
            )
            .join("\n"),
          "utf8"
        );
      }
    }

    // update meta file
    writeMetaFile(status);

    // clean up intermediate Markdown file
    // unlink(src, (_err) => {
    //   // do nothing on clean up error
    // });

    delete result.path;
  }

  // return the Scrapbox conversion result
  res.json(result);
};

export default handler;
