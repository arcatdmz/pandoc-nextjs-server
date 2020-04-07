import { NextApiRequest, NextApiResponse } from "next";
import { resolve } from "path";
import { readFile } from "fs";
import sanitize from "sanitize-filename";

import appConfig from "../../lib/config";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // get file name
  const { file } = req.query;
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

  // return file status
  const sanitizedPath = resolve(appConfig.uploadDir, `${sanitized}.meta.json`);
  readFile(sanitizedPath, (err, data) => {
    if (err) {
      res.json({
        success: false,
        error: "File not found",
      });
      return;
    }
    const status = JSON.parse(data.toString());
    delete status.originalName;
    res.json({
      success: true,
      status,
    });
  });
};

export default handler;
