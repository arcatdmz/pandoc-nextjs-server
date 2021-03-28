import { NextApiRequest, NextApiResponse } from "next";
import { resolve } from "path";
import { unlink } from "fs";

import appConfig from "../../lib/config";
import { IStatus, writeMetaFile } from "../../lib/writeMetaFile";
import { readMetaFile } from "../../lib/readMetaFile";
import { scrapbox } from "../../lib/scrapbox";
import { pandoc } from "../../lib/pandoc";

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
  const result = await scrapbox(
    path,
    appConfig.formats.find((f) => f.value === "markdown").options
  );

  // clean up source file
  unlink(path, (_err) => {
    // do nothing on clean up error
  });

  // start conversion
  if (result.success) {
    status.scrapbox = false;

    // update meta file
    await writeMetaFile(status);

    // proceed to pandoc conversion
    const src = result.path;
    pandoc(src, `${path}.${format.ext || format.value}`, format.value, []).then(
      (res) => {
        status.success = res.success;
        status.error = res.error;
        status.result = res.result;

        // update meta file
        writeMetaFile(status);

        // clean up intermediate Markdown file
        unlink(src, (_err) => {
          // do nothing on clean up error
        });
      }
    );

    delete result.path;
  }

  // return the Scrapbox conversion result
  res.json(result);
};

export default handler;
