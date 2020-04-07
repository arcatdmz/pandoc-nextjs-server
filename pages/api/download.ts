import { NextApiRequest, NextApiResponse } from "next";
import { resolve } from "path";
import { unlink, createReadStream, lstat } from "fs";
import sanitize from "sanitize-filename";

import appConfig from "../../lib/config";

export const config = {
  api: {
    bodyParser: true,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // get file name
  const { file, ext } = req.query;
  if (typeof file !== "string") {
    res.json({
      success: false,
      error: "File not specified",
    });
    return;
  }

  // sanitize file name
  const sanitized = sanitize(file);
  if (sanitized !== file) {
    res.json({
      success: false,
      error: "Unsafe file name specified",
    });
    return;
  }

  // check file extension
  const format = appConfig.formats.find(
    (f) => f.value === ext || f.ext === ext
  );
  if (!format) {
    res.json({
      success: false,
      error: "Unsupported file extension specified",
    });
    return;
  }

  // read file
  const sanitizedPath = resolve(appConfig.uploadDir, `${sanitized}.${ext}`);
  lstat(sanitizedPath, (err, stats) => {
    // emit error
    if (err || !stats.isFile()) {
      res.writeHead(301, { Location: "/404" });
      res.end();
      return;
    }

    // emit file info
    res.writeHead(200, {
      "Content-Type": format.mime,
      "Content-disposition": `attachment; filename=${sanitized}.${ext}`,
    });

    // emit file body
    const stream = createReadStream(sanitizedPath);
    stream.pipe(res);

    // remove the specified file after sending it
    stream.on("close", () => {
      unlink(sanitizedPath, (_err) => {
        //
      });
    });
  });
};

export default handler;
